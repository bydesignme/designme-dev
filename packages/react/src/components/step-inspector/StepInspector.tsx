'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Avatar, Fold, Seg, Swap, Tip } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
import './step-inspector.css';

/** The kinds of step, each with its colour: the trigger orange, AI steps violet, tools teal, app steps and outputs blue, a
    branch yellow, a wait pink, an approval green */
export type StepInspectorKind = 'trigger' | 'ai' | 'tool' | 'app' | 'output' | 'branch' | 'wait' | 'approval';
/** The types of data a step hands on, each with its colour: text blue, numbers green, lists orange, objects pink, yes or no
    yellow, dates teal */
export type StepFieldType = 'text' | 'number' | 'list' | 'object' | 'bool' | 'date';
export interface StepField {
  name: string;
  type: StepFieldType;
  /** A sample value, like "Priya Shah" */
  sample?: string;
}
/** An earlier step, whose fields this step can read as `"<id>.<field>"` */
export interface StepSource {
  id: string;
  title: string;
  kind: StepInspectorKind;
  icon?: IconName;
  fields: StepField[];
}
/** Instructions are text and mapped fields: `['Look up ', { ref: 'form.company' }, ' and score them.']` */
export type StepInstructionPart = string | { ref: string };
export interface StepTool { id: string; title: string; icon?: IconName }
export interface StepPerson { id: string; name: string; initials: string; color: string }
export interface StepLink { title: string; kind: StepInspectorKind; icon?: IconName }

/** One step's settings. Which ones show depends on `kind` */
export interface StepConfig {
  title: string;
  kind: StepInspectorKind;
  icon?: IconName;
  /** Where it sits, shown after the kind, like "step 2 of 7" */
  position?: string;
  /** AI steps: the model, the instructions and the tools it may call */
  model?: string;
  instructions?: StepInstructionPart[];
  tools?: StepTool[];
  /** The data the step reads, each a name and the `"<source>.<field>"` it is mapped from */
  inputs?: { name: string; ref: string }[];
  /** What the step hands on */
  outputs?: StepField[];
  /** AI, tool, app and output steps: what happens if it fails */
  retries?: number;
  backoff?: 'fixed' | 'doubling';
  timeLimit?: string;
  onFail?: string;
  /** A branch: Yes when the value at `ref` compares to `value`, and where each path goes */
  rule?: { ref: string; op: string; value: number };
  yes?: StepLink;
  no?: StepLink;
  /** An approval: who can approve, where they are asked, what they see, and what happens if nobody answers */
  approvers?: StepPerson[];
  askIn?: string;
  shows?: string;
  expire?: string;
  then?: string;
  /** A step that is turned off: runs skip it */
  off?: boolean;
}
export type StepChoice = 'model' | 'op' | 'askIn' | 'expire' | 'then' | 'timeLimit' | 'onFail';
const LABEL: Record<StepChoice, string> = { model: 'Model', op: 'Comparison', askIn: 'Ask in', expire: 'Nobody answers in', then: 'Then', timeLimit: 'Time limit', onFail: 'If it still fails' };
const CHOICES: Record<StepChoice, { value: string; detail?: string }[]> = {
  model: [{ value: 'Sonnet 5.5', detail: 'Balanced, the default' }, { value: 'Opus 5.5', detail: 'Deepest reasoning, slower' }, { value: 'Haiku 5.5', detail: 'Fastest and cheapest' }],
  op: [{ value: 'is at least' }, { value: 'is below' }, { value: 'is exactly' }],
  askIn: [{ value: 'Slack message' }, { value: 'Email' }, { value: 'In the app' }],
  expire: [{ value: '4 hours' }, { value: '24 hours' }, { value: '3 days' }],
  then: [{ value: 'Stop the run' }, { value: 'Send it anyway' }, { value: 'Ask someone else' }],
  timeLimit: [{ value: '15 seconds' }, { value: '30 seconds' }, { value: '60 seconds' }],
  onFail: [{ value: 'Stop the run' }, { value: 'Skip this step' }, { value: 'Carry on with empty data' }]
};
const KIND: Record<StepInspectorKind, string> = { trigger: 'Trigger', ai: 'AI step', tool: 'Tool', app: 'App step', output: 'Output', branch: 'Branch', wait: 'Wait', approval: 'Approval' };
const KIND_ICON: Record<StepInspectorKind, IconName> = { trigger: 'bolt', ai: 'spark', tool: 'globe', app: 'send', output: 'hash', branch: 'branch', wait: 'clock', approval: 'user' };
const TYPE_TONE: Record<StepFieldType, string> = { text: 'dm-b', number: 'dm-m', list: 'dm-p', object: 'dm-k', bool: 'dm-y', date: 'dm-t' };
export type StepSection = 'setup' | 'in' | 'out' | 'fail' | 'exp';

export interface StepInspectorProps {
  step: StepConfig;
  /** The steps before this one, in order: only their fields can be mapped */
  sources: StepSource[];
  /** Every change to the step, as the whole new step */
  onChange?: (step: StepConfig) => void;
  /** Adds Test, which runs the step on its own */
  onTest?: () => void;
  /** While the test runs: Test spins and `status` replaces the kind line */
  testing?: boolean;
  /** A line in place of the kind and position, like "Worked in 1.4s" */
  status?: string;
  /** Whether `status` is good news, in green */
  statusOk?: boolean;
  /** The options of each choice, in place of the built-in ones */
  choices?: Partial<Record<StepChoice, { value: string; detail?: string }[]>>;
  /** The tools an AI step can be given */
  toolOptions?: StepTool[];
  /** The people who can approve */
  people?: StepPerson[];
  /** The sections that are open. Leave it out to let the heads fold them; Output and If it fails start shut */
  open?: StepSection[];
  defaultOpen?: StepSection[];
  onOpenChange?: (open: StepSection[]) => void;
  /** Extra buttons in the head, after Test and More, like a close button */
  actions?: ReactNode;
  className?: string;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** A mapped field: the earlier step's tile, the step and the field. A field no earlier step gives is red */
function Token({ refId, sources, editable }: { refId: string; sources: StepSource[]; editable?: boolean }) {
  const [s, f] = refId.split('.'), src = sources.find(x => x.id === s);
  const ce = editable ? { contentEditable: false, 'data-ref': refId } : {};
  if (!src || !src.fields.some(x => x.name === f)) return <span className="dm-sti-tok dm-bad" {...ce}><Icon name="alert" size="xs" /><span className="dm-s">{cap(s)}</span><span className="dm-sep" aria-hidden="true">›</span><span className="dm-f">{f}</span></span>;
  return (
    <span className="dm-sti-tok" {...ce}>
      <span className="dm-sti-ti" data-k={src.kind} aria-hidden="true"><Icon name={src.icon ?? KIND_ICON[src.kind]} size="xs" /></span>
      <span className="dm-s">{src.title}</span><span className="dm-sep" aria-hidden="true">›</span><span className="dm-f">{f}</span>
    </span>
  );
}

const known = (ref: string, sources: StepSource[]) => { const [s, f] = ref.split('.'); return !!sources.find(x => x.id === s)?.fields.some(x => x.name === f); };
const nameOf = (ref: string, sources: StepSource[]) => { const [s, f] = ref.split('.'); return `${sources.find(x => x.id === s)?.title ?? cap(s)} › ${f}`; };

/** A choice: a field-like button and its menu, on the panel so a folding section can't clip it */
function Choice({ label, value, options, host, onPick }: { label: string; value: string; options: { value: string; detail?: string }[]; host: HTMLElement | null; onPick: (v: string) => void }) {
  const menu = usePopover();
  return (
    <>
      <button type="button" {...menu.trigger} className="dm-sti-sel" aria-label={`${label}: ${value}`}><Swap>{value}</Swap><Icon name="chev-d" size="xs" /></button>
      {host && createPortal(
        <div {...menu.pop} className={cx(menu.pop.className, 'dm-sti-pk')} role="menu" aria-label={label}>
          <div className="dm-ph" role="none">{label}</div>
          {options.map(o => (
            <button type="button" key={o.value} className="dm-mi" role="menuitemradio" aria-checked={o.value === value} tabIndex={-1} onClick={() => { if (o.value !== value) onPick(o.value); menu.closeSoon(); }}>
              <span>{o.value}{o.detail && <span className="dm-d">{o.detail}</span>}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
            </button>
          ))}
        </div>, host)}
    </>
  );
}

/** The fields of the earlier steps, grouped by step, each with its type and a sample; picking one maps it */
function DataMenu({ trigger, label, current, sources, host, onPick }: { trigger: (t: ReturnType<typeof usePopover>['trigger']) => ReactNode; label: string; current?: string; sources: StepSource[]; host: HTMLElement | null; onPick: (ref: string) => void }) {
  const menu = usePopover();
  return (
    <>
      {trigger(menu.trigger)}
      {host && createPortal(
        <div {...menu.pop} className={cx(menu.pop.className, 'dm-sti-dp')} role="menu" aria-label={label}>
          {sources.map(src => (
            <div key={src.id} role="group" aria-label={src.title}>
              <div className="dm-ph" role="none"><span className="dm-sti-ti" data-k={src.kind} aria-hidden="true"><Icon name={src.icon ?? KIND_ICON[src.kind]} size="xs" /></span>{src.title}</div>
              {src.fields.map(f => {
                const ref = src.id + '.' + f.name;
                return (
                  <button type="button" key={ref} className="dm-mi" role="menuitemradio" aria-checked={ref === current} tabIndex={-1} data-ref={ref} onClick={() => { onPick(ref); menu.closeSoon(); }}>
                    <span>{f.name}</span><span className={cx('dm-tag', TYPE_TONE[f.type])}>{f.type}</span><span className="dm-r">{f.sample}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>, host)}
    </>
  );
}

/* the instructions box holds text and tokens. It is written once from `parts`, then the browser edits it; what it says is read
   back into parts on every change, and a change from outside (a new step) writes it again. Tokens are copied from a hidden
   stock rendered by React, so they look exactly like the others */
const readParts = (el: HTMLElement): StepInstructionPart[] => {
  const out: StepInstructionPart[] = [];
  el.childNodes.forEach(n => {
    if (n.nodeType === 3) { const t = n.textContent ?? ''; if (typeof out[out.length - 1] === 'string') out[out.length - 1] += t; else out.push(t); }
    else if (n instanceof HTMLElement && n.dataset.ref) out.push({ ref: n.dataset.ref });
    else if (n.nodeName === 'BR') out.push('\n');
    else out.push('\n' + (n.textContent ?? ''));
  });
  return out;
};
const sameParts = (a: StepInstructionPart[], b: StepInstructionPart[]) => JSON.stringify(a) === JSON.stringify(b);

function Instructions({ parts, sources, host, onChange, id }: { parts: StepInstructionPart[]; sources: StepSource[]; host: HTMLElement | null; onChange: (p: StepInstructionPart[]) => void; id: string }) {
  const box = useRef<HTMLDivElement>(null), stock = useRef<HTMLSpanElement>(null), last = useRef<StepInstructionPart[] | null>(null), caret = useRef<Range | null>(null);
  const refs = [...new Set([...sources.flatMap(s => s.fields.map(f => s.id + '.' + f.name)), ...parts.flatMap(p => typeof p === 'string' ? [] : [p.ref])])];
  const tokenNode = (ref: string) => (stock.current?.querySelector(`[data-ref="${CSS.escape(ref)}"]`)?.cloneNode(true) ?? document.createTextNode(`{{${ref}}}`)) as Node;
  useEffect(() => {
    const el = box.current; if (!el || (last.current && sameParts(last.current, parts))) return;
    el.replaceChildren(...parts.map(p => typeof p === 'string' ? document.createTextNode(p) : tokenNode(p.ref)));
    last.current = parts;
  });
  useEffect(() => {
    const save = () => { const s = getSelection(); if (s && s.rangeCount && box.current?.contains(s.anchorNode)) caret.current = s.getRangeAt(0).cloneRange(); };
    document.addEventListener('selectionchange', save); return () => document.removeEventListener('selectionchange', save);
  }, []);
  const emit = () => { const el = box.current; if (!el) return; const p = readParts(el); last.current = p; onChange(p); };
  const insert = (ref: string) => {
    const el = box.current; if (!el) return;
    const t = tokenNode(ref) as HTMLElement, sp = document.createTextNode(' '); t.classList?.add('dm-new');
    const r = caret.current;
    if (r && el.contains(r.startContainer)) { r.collapse(false); r.insertNode(sp); r.insertNode(t); } else el.append(t, sp);
    emit();
  };
  return (
    <div className="dm-sti-insw">
      <div className="dm-sti-ih">
        <span className="dm-k" id={id}>Instructions</span>
        <DataMenu label="Data from earlier steps" sources={sources} host={host} onPick={insert}
          trigger={t => <button type="button" {...t} className="dm-pill dm-ghost dm-sm"><Icon name="plus" size="xs" />Insert data</button>} />
      </div>
      <div ref={box} className="dm-sti-ins" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-labelledby={id} spellCheck={false}
        onInput={emit}
        onKeyDown={e => {
          // Enter starts a new line as plain text, so the box never fills with markup
          if (e.key !== 'Enter') return; e.preventDefault();
          const s = getSelection(); if (!s || !s.rangeCount) return; const r = s.getRangeAt(0); r.deleteContents();
          const nl = document.createTextNode('\n'); r.insertNode(nl); r.setStartAfter(nl); r.collapse(true); s.removeAllRanges(); s.addRange(r); emit();
        }} />
      <span ref={stock} hidden>{refs.map(r => <Token key={r} refId={r} sources={sources} editable />)}</span>
    </div>
  );
}

/** The settings of one step in an agent workflow: its kind in colour, its name and where it sits, Test and More, then folding
    sections for what it does, the data it reads from earlier steps, what it hands on and what happens if it fails. */
export function StepInspector({ step, sources, onChange, onTest, testing, status, statusOk, choices, toolOptions = [], people = [], open, defaultOpen = ['setup', 'in', 'exp'], onOpenChange, actions, className }: StepInspectorProps) {
  const [shown, setShown] = useControllable(open, defaultOpen, onOpenChange);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [uid] = useState(() => 'sti' + Math.random().toString(36).slice(2, 7));
  const more = usePopover({ align: 'end' });
  const tool = usePopover(), who = usePopover();
  const set = (patch: Partial<StepConfig>) => onChange?.({ ...step, ...patch });
  const opts = (c: StepChoice) => choices?.[c] ?? CHOICES[c];
  const toggle = (k: StepSection) => setShown(shown.includes(k) ? shown.filter(x => x !== k) : [...shown, k]);
  const k = step.kind;
  const row = (label: string, v: ReactNode, top = false) => <div className={cx('dm-sti-row', top && 'dm-top')}><span className="dm-k">{label}</span><div className="dm-v">{v}</div></div>;
  const sec = (key: StepSection, title: string, body: ReactNode, meta?: ReactNode) => (
    <div className="dm-sti-sec" key={key}>
      <button type="button" className="dm-sti-sh" aria-expanded={shown.includes(key)} aria-controls={`${uid}-${key}`} onClick={() => toggle(key)}><Icon name="chev-r" size="xs" /><span>{title}</span>{meta}</button>
      <Fold open={shown.includes(key)}><div className="dm-sti-rows" id={`${uid}-${key}`}>{body}</div></Fold>
    </div>
  );
  const choice = (c: StepChoice, value: string | undefined, pick: (v: string) => void) => <Choice label={LABEL[c]} value={value ?? opts(c)[0].value} options={opts(c)} host={host} onPick={pick} />;
  const tokB = (label: string, ref: string, pick: (r: string) => void) => (
    <DataMenu label={`${label}: pick data`} current={ref} sources={sources} host={host} onPick={pick}
      trigger={t => <button type="button" {...t} className="dm-sti-tokb" aria-label={`${label}: ${nameOf(ref, sources)}${known(ref, sources) ? '' : ', which no earlier step gives'}. Change it`}><Token refId={ref} sources={sources} /></button>} />
  );
  const note = (ref: string) => known(ref, sources) ? null : <p className="dm-sti-note">{cap(ref.split('.')[0])} isn't an earlier step any more. Pick where {ref.split('.')[1]} comes from.</p>;
  const outs = step.outputs ?? [];
  const missing = (step.inputs ?? []).filter(x => !known(x.ref, sources)).length;
  const fails = ['ai', 'tool', 'app', 'output'].includes(k);
  const link = (l?: StepLink) => l ? <span className="dm-sti-link"><span className="dm-sti-ti" data-k={l.kind} aria-hidden="true"><Icon name={l.icon ?? KIND_ICON[l.kind]} size="xs" /></span><span>{l.title}</span></span> : <span className="dm-muted">Ends the run</span>;
  const retries = step.retries ?? 0;

  return (
    <div data-dm="" ref={setHost} data-k={k} className={cx('dm-sti dm-panel', className)}>
      <div className="dm-sti-h">
        <span className="dm-sti-ti" data-k={k} aria-hidden="true"><Icon name={step.icon ?? KIND_ICON[k]} /></span>
        <span className="dm-sti-tx">
          <span className="dm-sti-nr">
            <input className="dm-sti-n" value={step.title} aria-label="Step name" maxLength={40} spellCheck={false} autoComplete="off"
              onChange={e => set({ title: e.target.value })} onBlur={e => { if (!e.target.value.trim()) set({ title: KIND[k] }); }}
              onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }} />
            {step.off && <span className="dm-tag dm-sti-off">Off</span>}
          </span>
          <Swap className={cx('dm-sti-kd', statusOk && 'dm-ok')}>{status ?? `${KIND[k]}${step.position ? ', ' + step.position : ''}`}</Swap>
        </span>
        {onTest && <Tip label="Test this step"><button type="button" className={cx('dm-ib dm-sti-test', testing && 'dm-busy')} aria-label="Test this step" onClick={() => { if (!testing) onTest(); }}><Icon name={testing ? 'refresh' : 'play'} /></button></Tip>}
        <Tip label="More" off={more.open}><button type="button" {...more.trigger} className="dm-ib" aria-label="Step actions"><Icon name="more" /></button></Tip>
        {actions}
        <div {...more.pop} className={cx(more.pop.className, 'dm-sti-mm')} role="menu" aria-label="Step actions">
          <button type="button" className="dm-mi" role="menuitem" tabIndex={-1} onClick={() => { more.closeSoon(); setTimeout(() => { const i = host?.querySelector<HTMLInputElement>('.dm-sti-n'); i?.focus(); i?.select(); }, 140); }}><Icon name="edit" /><span>Rename</span></button>
          <button type="button" className="dm-mi" role="menuitem" tabIndex={-1} onClick={() => { set({ off: !step.off }); more.closeSoon(); }}><Icon name={step.off ? 'play' : 'pause'} /><span>{step.off ? 'Turn on' : 'Turn off'}</span></button>
        </div>
      </div>

      <div className="dm-sti-body">
        {k === 'ai' && sec('setup', 'Setup', <>
          {row(LABEL.model, choice('model', step.model, v => set({ model: v })))}
          <Instructions id={`${uid}-il`} parts={step.instructions ?? []} sources={sources} host={host} onChange={p => set({ instructions: p })} />
          {row('Tools', (
            <span className="dm-sti-chips">
              {(step.tools ?? []).map(t => (
                <span className="dm-sti-chip" key={t.id}>
                  <span className="dm-sti-ti" data-k="tool" aria-hidden="true"><Icon name={t.icon ?? 'globe'} size="xs" /></span><span>{t.title}</span>
                  <Tip label="Remove"><button type="button" className="dm-sti-cx" aria-label={`Remove ${t.title}`} onClick={() => set({ tools: (step.tools ?? []).filter(x => x.id !== t.id) })}><Icon name="x" size="xs" /></button></Tip>
                </span>
              ))}
              {toolOptions.length > 0 && <Tip label="Add a tool" off={tool.open}><button type="button" {...tool.trigger} className="dm-sti-add" aria-label="Add a tool"><Icon name="plus" size="xs" /></button></Tip>}
            </span>
          ), true)}
        </>)}
        {k === 'branch' && step.rule && sec('setup', 'Takes Yes when', <>
          <div className="dm-sti-rule">
            {tokB('Value', step.rule.ref, r => set({ rule: { ...step.rule!, ref: r } }))}
            {choice('op', step.rule.op, v => set({ rule: { ...step.rule!, op: v } }))}
            <input className="dm-sti-in" type="number" inputMode="numeric" min={0} max={100} value={step.rule.value} aria-label="Threshold" onChange={e => set({ rule: { ...step.rule!, value: Math.max(0, Math.min(100, +e.target.value || 0)) } })} />
          </div>
          {row('Yes', link(step.yes))}{row('No', link(step.no))}
        </>)}
        {k === 'approval' && sec('setup', 'Who approves', <>
          {row('People', (
            <span className="dm-sti-chips">
              {(step.approvers ?? []).map(p => (
                <span className="dm-sti-chip" key={p.id}>
                  <Avatar initials={p.initials} color={p.color} /><span>{p.name}</span>
                  <Tip label="Remove"><button type="button" className="dm-sti-cx" aria-label={`Remove ${p.name}`} onClick={() => { if ((step.approvers ?? []).length > 1) set({ approvers: (step.approvers ?? []).filter(x => x.id !== p.id) }); }}><Icon name="x" size="xs" /></button></Tip>
                </span>
              ))}
              {people.length > 0 && <Tip label="Add a person" off={who.open}><button type="button" {...who.trigger} className="dm-sti-add" aria-label="Add a person"><Icon name="plus" size="xs" /></button></Tip>}
            </span>
          ), true)}
          {row(LABEL.askIn, choice('askIn', step.askIn, v => set({ askIn: v })))}
          {step.shows && row('They see', tokB('They see', step.shows, r => set({ shows: r })))}
        </>)}
        {(step.inputs?.length ?? 0) > 0 && sec('in', 'Inputs', (step.inputs ?? []).map((x, i) => (
          <div key={x.name}>
            {row(x.name, tokB(x.name, x.ref, r => set({ inputs: (step.inputs ?? []).map((y, j) => j === i ? { ...y, ref: r } : y) })))}
            {note(x.ref)}
          </div>
        )), missing ? <span className="dm-tag dm-bad">{missing} missing</span> : <span className="dm-n">{step.inputs!.length} mapped</span>)}
        {k === 'approval' && sec('exp', 'If nobody answers', <>{row(LABEL.expire, choice('expire', step.expire, v => set({ expire: v })))}{row(LABEL.then, choice('then', step.then, v => set({ then: v })))}</>)}
        {sec('out', 'Output', outs.length ? outs.map(o => <div className="dm-sti-out" key={o.name}><span>{o.name}</span><span className={cx('dm-tag', TYPE_TONE[o.type])}>{o.type}</span><span className="dm-ex">{o.sample}</span></div>) : <p className="dm-sti-p">Nothing. The run carries on as it was.</p>,
          <span className="dm-n">{outs.length} {outs.length === 1 ? 'field' : 'fields'}</span>)}
        {fails && sec('fail', 'If it fails', <>
          {row('Retries', (
            <span className="dm-sti-num" role="group" aria-label="Retries">
              <Tip label="Fewer"><button type="button" className="dm-ib" aria-label="Fewer retries" aria-disabled={retries <= 0 || undefined} onClick={() => { if (retries > 0) set({ retries: retries - 1 }); }}><Icon name="minus" size="xs" /></button></Tip>
              <span className="dm-num" aria-live="polite">{retries}</span>
              <Tip label="More"><button type="button" className="dm-ib" aria-label="More retries" aria-disabled={retries >= 5 || undefined} onClick={() => { if (retries < 5) set({ retries: retries + 1 }); }}><Icon name="plus" size="xs" /></button></Tip>
            </span>
          ))}
          {row('Wait between', <Seg className="dm-sti-seg" label="Wait between tries" value={step.backoff ?? 'fixed'} onChange={v => set({ backoff: v })} options={[{ value: 'fixed', label: '2s each' }, { value: 'doubling', label: 'Doubling' }]} />)}
          {row(LABEL.timeLimit, choice('timeLimit', step.timeLimit, v => set({ timeLimit: v })))}
          {row(LABEL.onFail, choice('onFail', step.onFail, v => set({ onFail: v })))}
        </>)}
      </div>

      <div {...tool.pop} className={cx(tool.pop.className, 'dm-sti-pk')} role="menu" aria-label="Add a tool">
        <div className="dm-ph" role="none">Give {step.title} a tool</div>
        {toolOptions.map(t => {
          const has = (step.tools ?? []).some(x => x.id === t.id);
          return <button type="button" key={t.id} className="dm-mi" role="menuitem" tabIndex={-1} aria-disabled={has || undefined} onClick={() => { if (has) return; set({ tools: [...(step.tools ?? []), t] }); tool.closeSoon(); }}><span className="dm-sti-ti" data-k="tool" aria-hidden="true"><Icon name={t.icon ?? 'globe'} size="xs" /></span><span>{t.title}</span></button>;
        })}
      </div>
      <div {...who.pop} className={cx(who.pop.className, 'dm-sti-pk')} role="menu" aria-label="Who approves">
        <div className="dm-ph" role="none">Who approves</div>
        {people.map(p => {
          const on = (step.approvers ?? []).some(x => x.id === p.id);
          return <button type="button" key={p.id} className="dm-mi" role="menuitemcheckbox" aria-checked={on} tabIndex={-1} data-person={p.id} onClick={() => {
            const list = step.approvers ?? []; if (on && list.length < 2) return;
            set({ approvers: on ? list.filter(x => x.id !== p.id) : [...list, p] }); who.closeSoon(); }}><Avatar initials={p.initials} color={p.color} /><span>{p.name}</span><span className="dm-ck"><Icon name="check" size="xs" /></span></button>;
        })}
      </div>
    </div>
  );
}
