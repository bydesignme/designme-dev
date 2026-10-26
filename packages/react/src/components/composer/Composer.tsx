'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useSeconds } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Spin, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './composer.css';

export interface ComposerAttachment {
  key: string;
  label: string;
  /** Defaults to a paper clip */
  icon?: IconName;
  /** loading shows a spinner and holds Send until it's ready; error shows the chip in red with a Try again button */
  status?: 'loading' | 'error' | 'ready';
}
export interface ComposerOption {
  value: string;
  /** Defaults to the value */
  label?: string;
  /** The quiet line under the label */
  detail?: string;
  icon?: IconName;
}

export interface ComposerProps {
  /** The text in the box. Leave it out to let the composer keep it */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /** Called with the message when the person sends it. The box clears itself afterwards */
  onSubmit?: (message: { text: string; attachments: ComposerAttachment[] }) => void;
  /** The agent is answering: send turns into stop */
  busy?: boolean;
  /** Called by the stop button while busy */
  onStop?: () => void;
  /** The conversation above the box, like the bubbles a message turns into */
  thread?: ReactNode;

  /** Files and frames added to the message, shown as chips above the text */
  attachments?: ComposerAttachment[];
  defaultAttachments?: ComposerAttachment[];
  onAttachmentsChange?: (attachments: ComposerAttachment[]) => void;
  /** What the attach menu offers. Defaults to a file, a Figma frame and a screenshot */
  addOptions?: ComposerOption[];
  /** Called with the option's value when the person picks one from the attach menu */
  onAdd?: (value: string) => void;
  /** Called by Try again on an attachment that failed to load */
  onRetry?: (key: string) => void;

  /** What the agent can work on, like Figma files and repositories. The chip only shows when there are some */
  contexts?: ComposerOption[];
  context?: string;
  defaultContext?: string;
  onContextChange?: (context: string) => void;
  /** What the agent may do. Defaults to Ask, Edit and Plan */
  modes?: ComposerOption[];
  mode?: string;
  defaultMode?: string;
  onModeChange?: (mode: string) => void;
  /** More in the toolbar, before the mode, like a context ring */
  tools?: ReactNode;

  /** Called by the microphone button. Start listening and set dictating; the mic button only shows when this is set */
  onDictate?: () => void;
  /** Swaps the toolbar for a red dot, a clock, Cancel and Done. Write what you hear into value while it is on */
  dictating?: boolean;
  /** Seconds to show while dictating. Leave it out to let it count */
  dictationSeconds?: number;
  /** Called by Cancel (false, the text goes back to what it was) or Done (true, the text stays) */
  onDictationEnd?: (keep: boolean) => void;
  className?: string;
}

const ADD: ComposerOption[] = [
  { value: 'file', label: 'Upload a file', detail: 'Images, PDFs or code', icon: 'file-text' },
  { value: 'figma', label: 'Link a Figma frame', detail: 'From any file you can open', icon: 'figma' },
  { value: 'shot', label: 'Add a screenshot', detail: "Of the window you're in", icon: 'image' }
];
const MODES: ComposerOption[] = [
  { value: 'ask', label: 'Ask', detail: 'Answer only, change nothing', icon: 'eye' },
  { value: 'edit', label: 'Edit', detail: 'Change frames on a new page', icon: 'edit' },
  { value: 'plan', label: 'Plan', detail: 'Propose steps before it starts', icon: 'list' }
];
const PLACEHOLDER = 'Ask the design agent, or attach a frame';

type PopName = 'plus' | 'ctx' | 'mode';
const Check = () => <span className="dm-ck"><Icon name="check" /></span>;
const clock = (s: number) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

/** The message box: text that grows as you type, attachments that load, what the agent works on, what it may do, dictation and send. */
export function Composer({
  value, defaultValue = '', onValueChange, placeholder = PLACEHOLDER, onSubmit, busy = false, onStop, thread,
  attachments, defaultAttachments = [], onAttachmentsChange, addOptions = ADD, onAdd, onRetry,
  contexts, context, defaultContext, onContextChange, modes = MODES, mode, defaultMode, onModeChange, tools,
  onDictate, dictating = false, dictationSeconds, onDictationEnd, className
}: ComposerProps) {
  const [text, setText] = useControllable(value, defaultValue, onValueChange);
  const [files, setFiles] = useControllable(attachments, defaultAttachments, onAttachmentsChange);
  const [ctx, setCtx] = useControllable(context, defaultContext ?? contexts?.[0]?.value ?? '', onContextChange);
  const [md, setMd] = useControllable(mode, defaultMode ?? modes[0]?.value ?? '', onModeChange);
  const ctxOpt = contexts?.find(o => o.value === ctx), mdOpt = modes.find(o => o.value === md) ?? modes[0];
  const counted = useSeconds(dictating && dictationSeconds === undefined);

  const box = useRef<HTMLDivElement>(null), ta = useRef<HTMLTextAreaElement>(null);
  // the text box grows with its text, up to 160px
  useIsoLayoutEffect(() => { const t = ta.current; if (!t) return; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 160) + 'px'; }, [text, dictating]);

  /* ---------- menus: open above their button, close on a click outside, Escape or a pick ---------- */
  const [pop, setPop] = useState<PopName | null>(null);
  const [place, setPlace] = useState<Partial<Record<PopName, CSSProperties>>>({});
  const triggers = useRef<Partial<Record<PopName, HTMLButtonElement | null>>>({});
  const pops = useRef<Partial<Record<PopName, HTMLDivElement | null>>>({});
  const pick = (fn: () => void) => () => { fn(); setTimeout(() => setPop(null), 120); };
  useIsoLayoutEffect(() => {
    if (!pop) return;
    const btn = triggers.current[pop], el = pops.current[pop], host = box.current; if (!btn || !el || !host) return;
    // the mode sits near the right end of the bar, so its menu lines up with the button's right edge
    const hr = host.getBoundingClientRect(), br = btn.getBoundingClientRect(), end = pop === 'mode';
    let x = end ? br.right - hr.left - el.offsetWidth : br.left - hr.left;
    x = Math.max(-hr.left + 8, Math.min(x, innerWidth - hr.left - el.offsetWidth - 8));
    setPlace(p => ({ ...p, [pop]: { left: x, top: br.top - hr.top - el.offsetHeight - 6, '--dm-origin': 'bottom ' + (end ? 'right' : 'left') } as CSSProperties }));
  }, [pop]);
  useEffect(() => {
    if (!pop) return;
    const click = (e: MouseEvent) => { const t = e.target as Node; if (!pops.current[pop]?.contains(t) && !triggers.current[pop]?.contains(t)) setPop(null); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setPop(null); };
    const resize = () => setPop(null);
    document.addEventListener('click', click); document.addEventListener('keydown', key); addEventListener('resize', resize);
    return () => { document.removeEventListener('click', click); document.removeEventListener('keydown', key); removeEventListener('resize', resize); };
  }, [pop]);
  const trigger = (name: PopName) => ({
    ref: (el: HTMLButtonElement | null) => { triggers.current[name] = el; },
    'aria-expanded': pop === name, 'aria-haspopup': 'menu' as const, onClick: () => setPop(p => p === name ? null : name)
  });
  const popProps = (name: PopName, cls: string) => ({
    ref: (el: HTMLDivElement | null) => { pops.current[name] = el; },
    className: cx('dm-pop', cls, pop === name && 'dm-open'), style: place[name], inert: pop !== name
  });

  /* ---------- attachments leave with a short fade before they go ---------- */
  const [leaving, setLeaving] = useState<string[]>([]);
  const latest = useRef(files);
  useEffect(() => { latest.current = files; });
  const remove = (key: string) => {
    setLeaving(l => [...l, key]);
    setTimeout(() => { setLeaving(l => l.filter(k => k !== key)); setFiles(latest.current.filter(f => f.key !== key)); }, 300);
  };

  /* ---------- dictation: what was there comes back on cancel ---------- */
  const before = useRef('');
  const wasDictating = useRef(dictating);
  useEffect(() => {
    if (dictating && !wasDictating.current) { before.current = text; setText(''); }
    wasDictating.current = dictating;
  }); // eslint-disable-line react-hooks/exhaustive-deps
  const endDictation = (keep: boolean) => { if (!keep) setText(before.current); onDictationEnd?.(keep); ta.current?.focus({ preventScroll: true }); };

  // send waits for text or a file, and for every file to finish loading
  const canSend = (!!text.trim() || files.length > 0) && !files.some(f => f.status === 'loading' || f.status === 'error');
  const submit = () => {
    if (!canSend || busy) return;
    onSubmit?.({ text: text.trim(), attachments: files });
    setText(''); setFiles([]);
  };

  return (
    <div data-dm="" className={cx('dm-cpx', className)}>
      <div className="dm-cpx-thread" aria-live="polite">{thread}</div>
      <div ref={box} className="dm-cpx-box" data-mode={dictating ? 'voice' : 'idle'}>
        <div className="dm-cpx-att">{files.map(f => (
          <span key={f.key} className={cx('dm-fchip', f.status === 'loading' && 'dm-ld', f.status === 'error' && 'dm-err', leaving.includes(f.key) ? 'dm-leave' : 'dm-enter')}>
            <span className="dm-ic" style={{ display: 'grid' }}>{f.status === 'loading' ? <Spin /> : <Icon name={f.status === 'error' ? 'alert' : f.icon ?? 'clip'} size="xs" />}</span>
            <Swap className="dm-n">{f.label}</Swap>
            {f.status === 'error' && onRetry && <Tip label="Try again"><button type="button" className="dm-rt" aria-label="Try again" onClick={() => onRetry(f.key)}><Icon name="refresh" size="xs" /></button></Tip>}
            <button type="button" className="dm-x" aria-label={'Remove ' + f.label} onClick={() => remove(f.key)}><Icon name="x" size="xs" /></button>
          </span>))}
        </div>
        <textarea ref={ta} className="dm-cpx-ta" rows={1} aria-label="Message" placeholder={dictating ? 'Listening…' : placeholder} value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey && !dictating) { e.preventDefault(); submit(); }
            if (e.key === 'Escape' && dictating) endDictation(false);
          }} />
        <div className="dm-cpx-rows">
          <div className="dm-cpx-bar" inert={dictating}>
            <Tip label="Attach a file or a frame" off={pop === 'plus'}><button type="button" className="dm-ib dm-cpx-add" aria-label="Attach" {...trigger('plus')}><Icon name="clip" /></button></Tip>
            {ctxOpt && <Tip label="What the agent works on" off={pop === 'ctx'}><button type="button" className="dm-chip dm-cpx-ctx" {...trigger('ctx')}><Icon name={ctxOpt.icon ?? 'folder'} /><Swap className="dm-cpx-ctx-n">{ctxOpt.label ?? ctxOpt.value}</Swap><Icon name="chev-d" size="xs" /></button></Tip>}
            <span className="dm-sp" />
            {tools}
            {mdOpt && <Tip label="What the agent may do" off={pop === 'mode'}><button type="button" className="dm-chip dm-cpx-mode" {...trigger('mode')}><Icon name={mdOpt.icon ?? 'edit'} /><Swap className="dm-cpx-mode-n">{mdOpt.label ?? mdOpt.value}</Swap><Icon name="chev-d" size="xs" /></button></Tip>}
            {onDictate && <Tip label="Dictate"><button type="button" className="dm-ib dm-cpx-mic" aria-label="Dictate" onClick={onDictate}><Icon name="mic" /></button></Tip>}
            {busy
              ? <Tip label="Stop"><button type="button" className="dm-cpx-send" aria-label="Stop" onClick={onStop}><Icon name="stop" /></button></Tip>
              : <Tip label="Send" kbd="↵"><button type="button" className="dm-cpx-send" aria-label="Send" disabled={!canSend} onClick={submit}><Icon name="up" /></button></Tip>}
          </div>
          <div className="dm-cpx-voice" inert={!dictating}>
            <span className="dm-cpx-rec"><span className="dm-cpx-dot" />Listening</span><span className="dm-cpx-tm dm-num dm-muted">{clock(dictationSeconds ?? counted)}</span>
            <span className="dm-sp" />
            <button type="button" className="dm-pill dm-ghost dm-sm dm-cpx-cancel" onClick={() => endDictation(false)}>Cancel</button>
            <button type="button" className="dm-pill dm-primary dm-sm dm-cpx-ok" onClick={() => endDictation(true)}>Done</button>
          </div>
        </div>

        <div role="menu" aria-label="Attach" {...popProps('plus', 'dm-pp-plus')}>
          {addOptions.map(o => <button key={o.value} type="button" role="menuitem" className="dm-mi" onClick={pick(() => onAdd?.(o.value))}><Icon name={o.icon ?? 'clip'} /><span>{o.label ?? o.value}{o.detail && <span className="dm-d">{o.detail}</span>}</span></button>)}
        </div>
        {contexts && contexts.length > 0 && <div role="menu" aria-label="Working on" {...popProps('ctx', 'dm-pp-ctx')}>
          <div className="dm-ph">Working on</div>
          {contexts.map(o => <button key={o.value} type="button" role="menuitemradio" aria-checked={o.value === ctx} className="dm-mi" onClick={pick(() => setCtx(o.value))}><Icon name={o.icon ?? 'folder'} /><span>{o.label ?? o.value}{o.detail && <span className="dm-d">{o.detail}</span>}</span><Check /></button>)}
        </div>}
        <div role="menu" aria-label="The agent may" {...popProps('mode', 'dm-pp-mode')}>
          <div className="dm-ph">The agent may</div>
          {modes.map(o => <button key={o.value} type="button" role="menuitemradio" aria-checked={o.value === md} className="dm-mi" onClick={pick(() => setMd(o.value))}><Icon name={o.icon ?? 'edit'} /><span>{o.label ?? o.value}{o.detail && <span className="dm-d">{o.detail}</span>}</span><Check /></button>)}
        </div>
      </div>
    </div>
  );
}
