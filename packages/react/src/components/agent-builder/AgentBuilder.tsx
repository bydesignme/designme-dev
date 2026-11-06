'use client';
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { Brand, type BrandName } from '../../lib/brands';
import { cx } from '../../lib/cx';
import { useIsoLayoutEffect } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Seg, Spin, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './agent-builder.css';

export type AgentSection = 'id' | 'ins' | 'model' | 'tools' | 'know' | 'trig';
export type ToolLevel = 'read' | 'ask' | 'act';
export type MascotShape = 'circle' | 'squircle';
export type MascotState = 'idle' | 'thinking';

/* ---------- Dotto, the agent's mascot ---------- */
// each outline as [bezel, screen], in a 64 by 64 box; a mascot draws only the one in use
const SHAPES: Record<MascotShape, [string, string]> = {
  circle: ['M4 32A28 28 0 1 0 60 32A28 28 0 1 0 4 32Z', 'M10.5 32A21.5 21.5 0 1 0 53.5 32A21.5 21.5 0 1 0 10.5 32Z'],
  squircle: ['M60 32C60 58.5 58.5 60 32 60S4 58.5 4 32 5.5 4 32 4 60 5.5 60 32Z', 'M53.5 32C53.5 52.3 52.3 53.5 32 53.5S10.5 52.3 10.5 32 11.7 10.5 32 10.5 53.5 11.7 53.5 32Z'],
};
const SHAPE_NAMES: Record<MascotShape, string> = { circle: 'Circle', squircle: 'Squircle' };
type Cell = [number, number];
const GRID: Cell[] = Array.from({ length: 25 }, (_, i) => [i % 5, Math.floor(i / 5)]);
const dots = (cells: Cell[], cls?: string) => cells.map(([x, y]) => <circle key={`${x}-${y}`} className={cls} cx={19 + x * 6.5} cy={19 + y * 6.5} r={cls ? 2.75 : 1.3} />);

export interface AgentMascotProps {
  /** Any CSS colour; the bezel takes it, the screen and the dots are mixed from it. Leave it out for the accent */
  color?: string;
  shape?: MascotShape;
  /** idle blinks a row of dots; thinking moves the eyes cell by cell and runs a loading row. Still poses with reduced motion */
  state?: MascotState;
  /** In px; 24 by default */
  size?: number;
  /** Names it for screen readers; without one it is decorative */
  label?: string;
  className?: string;
}

/** Dotto: a dark LED screen in a bezel of the agent's colour, with a 5 by 5 grid of dots drawing its eyes and smile. */
export function AgentMascot({ color, shape = 'squircle', state = 'idle', size, label, className }: AgentMascotProps) {
  const [bz, sc] = SHAPES[shape];
  const style = { ...(color ? { '--dm-m': color } : {}), ...(size ? { width: size, height: size } : {}) } as CSSProperties;
  return (
    <svg className={cx('dm-abx-mascot', className)} viewBox="0 0 64 64" data-shape={shape} data-state={state} style={style}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })} focusable="false">
      <path className="dm-bz" d={bz} /><path className="dm-sc" d={sc} />
      <g className="dm-dg">{dots(GRID)}</g>
      <g className="dm-lk">{dots([[1, 1], [3, 1]], 'dm-on dm-tp')}{dots([[1, 2], [3, 2]], 'dm-on')}</g>
      <g className="dm-id">{dots([[0, 3], [4, 3], [1, 4], [2, 4], [3, 4]], 'dm-on')}</g>
      <g className="dm-th">{dots([[1, 4]], 'dm-on dm-ld dm-l1')}{dots([[2, 4]], 'dm-on dm-ld dm-l2')}{dots([[3, 4]], 'dm-on dm-ld dm-l3')}</g>
    </svg>
  );
}

/** The colours the builder offers: the accent, then four of the palette's. A colour the accent already is shows once */
export const AGENT_COLORS: { value: string; label: string; color: string }[] = [
  { value: 'accent', label: 'Accent', color: 'var(--dm-accent)' },
  { value: 'blue', label: 'Blue', color: '#116ff8' },
  { value: 'violet', label: 'Violet', color: '#7c4dff' },
  { value: 'orange', label: 'Orange', color: '#f76700' },
  { value: 'green', label: 'Green', color: '#00a876' }
];

/** A radio group: a click picks, the arrow keys move and pick (and wrap), Home and End go to the ends; only the picked one is
    in the tab order */
function Radios<T extends string>({ options, value, onChange, label, className, children, item, rootRef }: {
  options: { value: T; label: string; hidden?: boolean }[]; value: T; onChange: (v: T) => void; label: string; className?: string;
  children?: ReactNode; rootRef?: Ref<HTMLDivElement>; item: (o: { value: T; label: string }) => { className?: string; style?: CSSProperties; content?: ReactNode };
}) {
  const shown = options.filter(o => !o.hidden);
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = shown.findIndex(o => o.value === value), d = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
    const to = d ? shown[(i + d + shown.length) % shown.length] : e.key === 'Home' ? shown[0] : e.key === 'End' ? shown[shown.length - 1] : null;
    if (!to) return;
    e.preventDefault(); onChange(to.value);
    (e.currentTarget.querySelector(`[data-v="${to.value}"]`) as HTMLElement | null)?.focus();
  };
  return (
    <div className={className} role="radiogroup" aria-label={label} onKeyDown={key} ref={rootRef}>
      {children}
      {shown.map(o => { const { className: c, style, content } = item(o);
        return <Tip key={o.value} label={o.label}><button type="button" role="radio" aria-checked={o.value === value} tabIndex={o.value === value ? 0 : -1} aria-label={o.label}
          data-v={o.value} className={c} style={style} onClick={() => onChange(o.value)}>{content}</button></Tip>; })}
    </div>
  );
}

export interface AgentDraft {
  name: string;
  purpose: string;
  /** The avatar's colour: one of `colors` by its value ('accent', 'blue', 'violet', 'orange', 'green' by default) */
  color: string;
  /** The avatar's outline. Leave it out for a squircle */
  shape?: MascotShape;
  instructions: string;
  model: string;
  effort: 'low' | 'med' | 'high';
  tools: { key: string; label: string; brand?: BrandName; level: ToolLevel }[];
  knowledge: { label: string; icon?: IconName }[];
  trigger: 'chat' | 'sched' | 'event';
  /** A line beside the trigger, like "When an email arrives at support@" */
  triggerDetail?: string;
}

export interface AgentBuilderProps {
  value: AgentDraft;
  onChange: (value: AgentDraft, section: AgentSection) => void;
  /** The one sentence it starts from */
  description: string;
  onDescriptionChange: (text: string) => void;
  /** Asks the agent to draft every field from the description */
  onDraft: () => void;
  /** The section being drafted now, while drafting; the ones after it wait */
  drafting?: AgentSection | null;
  /** Sections the agent drafted and nobody has changed since: they carry a Drafted tag */
  drafted?: AgentSection[];
  /** empty: nothing drafted yet; dirty: unsaved changes; saved; live */
  status: 'empty' | 'dirty' | 'saved' | 'live';
  onSave: () => void;
  onPublish: () => void | Promise<unknown>;
  publishing?: boolean;
  onTest?: () => void;
  /** The test chat: what went in, and the agent's reply, or 'busy' while it works (the avatar thinks meanwhile) */
  test?: { email: { subject: string; body: string; from?: string }; reply?: 'busy' | { tags: { label: string; tone?: 'warn' }[]; text: ReactNode } };
  models?: string[];
  /** The avatar colours to pick from */
  colors?: { value: string; label: string; color: string }[];
  className?: string;
}

const SECTIONS: AgentSection[] = ['id', 'ins', 'model', 'tools', 'know', 'trig'];
const TRIG = [{ value: 'chat' as const, label: 'Chat' }, { value: 'sched' as const, label: 'Schedule' }, { value: 'event' as const, label: 'Event' }];

/** Describe an agent in one sentence and the agent drafts the rest: identity (its avatar, Dotto, in a colour and shape you pick),
    instructions, model and effort, tools with a permission each, knowledge and trigger. A test chat beside it, and a bar to save and
    publish. */
export function AgentBuilder({ value: v, onChange, description, onDescriptionChange, onDraft, drafting = null, drafted = [], status, onSave, onPublish, publishing = false, onTest, test,
  models = ['Haiku 5', 'Sonnet 5', 'Opus 5.5'], colors = AGENT_COLORS, className }: AgentBuilderProps) {
  const errId = useId(), descId = useId();
  const ref = useRef<HTMLDivElement>(null), shpRef = useRef<HTMLDivElement>(null);
  // the colours the accent already is, read once it is placed
  const [dupes, setDupes] = useState<string[]>([]);
  useIsoLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const ink = (c: string) => { const t = document.createElement('i'); t.hidden = true; t.style.color = c; el.appendChild(t); const x = getComputedStyle(t).color; t.remove(); return x; };
    const acc = ink('var(--dm-accent)');
    setDupes(colors.filter(c => c.value !== 'accent' && ink(c.color) === acc).map(c => c.value));
  }, [colors]);
  const shape = v.shape ?? 'squircle';
  const pick = colors.find(c => c.value === v.color && !dupes.includes(c.value)) ?? colors[0];
  const mood: MascotState = test?.reply === 'busy' ? 'thinking' : 'idle';
  const dotto = (extra?: Partial<AgentMascotProps>) => <AgentMascot color={pick.color} shape={shape} state={mood} {...extra} />;
  // the shape switch's knob sits under the picked outline
  const [knob, setKnob] = useState<CSSProperties>({});
  useIsoLayoutEffect(() => {
    const el = shpRef.current; if (!el) return;
    const place = () => { const b = el.querySelector<HTMLElement>('[aria-checked="true"]'); if (b) setKnob({ left: b.offsetLeft, width: b.offsetWidth }); };
    place(); const ro = new ResizeObserver(place); ro.observe(el); return () => ro.disconnect();
  }, [shape]);
  const set = (section: AgentSection, patch: Partial<AgentDraft>) => onChange({ ...v, ...patch }, section);
  const at = drafting ? SECTIONS.indexOf(drafting) : -1;
  const sec = (k: AgentSection) => cx('dm-abx-s', at >= 0 && SECTIONS.indexOf(k) > at && 'dm-wait', drafting === k && 'dm-busy');
  const head = (k: AgentSection, label: string, extra?: ReactNode) => (
    <div className="dm-abx-sh"><span>{label}</span>{drafted.includes(k) && drafting !== k && <span className="dm-abx-dt dm-enter"><Icon name="spark" size="xs" />Drafted</span>}{extra}</div>
  );
  const bad = status !== 'empty' && !v.name.trim();
  return (
    <div data-dm="" ref={ref} className={cx('dm-abx dm-panel', className)} style={{ '--dm-m': pick.color } as CSSProperties}>
      <div className="dm-abx-g">
        <div className="dm-abx-f">
          <div className="dm-abx-ask"><label className="dm-abx-l" htmlFor={descId}>Describe your agent</label>
            <div className="dm-abx-askr"><input className="dm-abx-in" id={descId} autoComplete="off" placeholder="What should it do?" value={description} onChange={e => onDescriptionChange(e.target.value)} />
              <button type="button" className={cx('dm-pill dm-sm', status === 'empty' ? 'dm-primary' : 'dm-line')} disabled={!!drafting || !description.trim()} onClick={onDraft}>
                {drafting ? <><Spin />Drafting</> : status === 'empty' ? <><Icon name="spark" size="xs" />Draft</> : <><Icon name="refresh" size="xs" />Draft again</>}</button></div>
          </div>
          <div className={sec('id')} role="group" aria-label="Identity">{head('id', 'Identity')}
            <div className="dm-abx-idr">
              <span className="dm-abx-av" role="img" aria-label={`Avatar: ${pick.label}, ${SHAPE_NAMES[shape].toLowerCase()}`}>{dotto()}</span>
              <input className="dm-abx-in" aria-label="Name" placeholder="Name" autoComplete="off" value={v.name} aria-invalid={bad} aria-describedby={errId} onChange={e => set('id', { name: e.target.value })} />
              <div className="dm-abx-look">
                <Radios className="dm-abx-sw" label="Colour" value={pick.value} onChange={c => set('id', { color: c })}
                  options={colors.map(c => ({ value: c.value, label: c.label, hidden: dupes.includes(c.value) }))}
                  item={o => ({ style: { '--dm-s': colors.find(c => c.value === o.value)!.color } as CSSProperties })} />
                <Radios className="dm-seg2 dm-abx-shp" label="Shape" value={shape} onChange={s => set('id', { shape: s })} rootRef={shpRef}
                  options={(Object.keys(SHAPES) as MascotShape[]).map(s => ({ value: s, label: SHAPE_NAMES[s] }))}
                  item={o => ({ content: <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d={SHAPES[o.value][0]} /></svg> })}>
                  <span className="dm-knob" style={knob} />
                </Radios>
              </div>
            </div>
            <span className="dm-abx-err" id={errId} hidden={!bad}><Icon name="alert" size="xs" />Give it a name to save it</span>
            <input className="dm-abx-in" aria-label="Purpose" placeholder="What it is for" autoComplete="off" value={v.purpose} onChange={e => set('id', { purpose: e.target.value })} />
          </div>
          <div className={sec('ins')} role="group" aria-label="Instructions">{head('ins', 'Instructions')}<textarea className="dm-abx-ta" rows={3} aria-label="Instructions" placeholder="How it should work" value={v.instructions} onChange={e => set('ins', { instructions: e.target.value })} /></div>
          <div className={sec('model')} role="group" aria-label="Model and effort">{head('model', 'Model and effort')}
            <div className="dm-abx-mr"><select className="dm-abx-in dm-abx-sel" aria-label="Model" value={v.model} onChange={e => set('model', { model: e.target.value })}>{models.map(m => <option key={m}>{m}</option>)}</select>
              <Seg className="dm-abx-eff" label="Effort" options={[{ value: 'low', label: 'Low' }, { value: 'med', label: 'Medium' }, { value: 'high', label: 'High' }]} value={v.effort} onChange={e => set('model', { effort: e })} /></div>
          </div>
          <div className={sec('tools')} role="group" aria-label="Tools">{head('tools', 'Tools', <span className="dm-muted">What it may do in each</span>)}
            <div className="dm-abx-tools">{v.tools.map(t => (
              <div key={t.key} className="dm-abx-tl">{t.brand ? <Brand name={t.brand} /> : <Icon name="bolt" />}<span className="dm-n">{t.label}</span>
                <Seg label={`${t.label}: what it may do`} options={[{ value: 'read', label: 'Read' }, { value: 'ask', label: 'Ask' }, { value: 'act', label: 'Act' }]} value={t.level}
                  onChange={l => set('tools', { tools: v.tools.map(x => x.key === t.key ? { ...x, level: l } : x) })} /></div>))}</div>
          </div>
          <div className={sec('know')} role="group" aria-label="Knowledge">{head('know', 'Knowledge')}
            <div className="dm-abx-kn">{v.knowledge.length ? v.knowledge.map(k => <span key={k.label} className="dm-tag">{k.icon && <Icon name={k.icon} size="xs" />}{k.label}</span>) : <span className="dm-muted" style={{ fontSize: 12 }}>Nothing yet</span>}</div>
          </div>
          <div className={sec('trig')} role="group" aria-label="Trigger">{head('trig', 'Trigger')}
            <div className="dm-abx-tr"><Seg className="dm-abx-trs" label="Starts on" options={TRIG} value={v.trigger} onChange={t => set('trig', { trigger: t })} />{v.triggerDetail && <Swap className="dm-muted dm-abx-trd">{v.triggerDetail}</Swap>}</div>
          </div>
          <div className="dm-abx-bar">
            <span className="dm-abx-st dm-muted">{status === 'live' ? <>{dotto()}<span className="dm-tag dm-ok">Live</span></> : status === 'saved' ? <><Icon name="check" size="xs" />Saved</> : status === 'dirty' ? (drafted.length ? 'Drafted, not saved' : 'Unsaved changes') : 'Not saved'}</span>
            <span className="dm-sp" />
            {onTest && <button type="button" className="dm-pill dm-line dm-sm" disabled={status === 'empty' || test?.reply === 'busy'} onClick={onTest}><Icon name="play" size="xs" />Test</button>}
            <button type="button" className="dm-pill dm-line dm-sm" disabled={status === 'empty' || status === 'saved' || status === 'live' || bad} onClick={onSave}>Save</button>
            <button type="button" className="dm-pill dm-primary dm-sm" disabled={status === 'empty' || status === 'live' || bad || publishing} onClick={() => { void onPublish(); }}>{publishing ? <><Spin />Publishing</> : status === 'live' ? 'Published' : 'Publish'}</button>
          </div>
        </div>
        <div className="dm-abx-c">
          <div className="dm-abx-ch">{dotto()}<div className="dm-abx-cht"><b>Test</b><Swap className="dm-muted dm-abx-cs">{!test ? 'Try it before it goes live' : test.reply === 'busy' || !test.reply ? 'Testing with a sample email' : 'The test passed'}</Swap></div></div>
          <div className="dm-abx-log" aria-live="polite">
            {!test ? <p className="dm-muted dm-abx-empty">Draft the agent, then press Test to send it a sample email.</p> : <>
              <div className="dm-abx-em dm-enter"><b>{test.email.subject}</b><span>{test.email.body}</span>{test.email.from && <span className="dm-muted">{test.email.from}</span>}</div>
              {test.reply === 'busy' ? <div className="dm-abx-rp dm-enter"><span className="dm-k">{dotto()}<span className="dm-shim">{v.name || 'The agent'} is reading it</span></span></div>
                : test.reply ? <div className="dm-abx-rp dm-enter"><span className="dm-k">{dotto()}{v.name || 'The agent'}</span>
                    <span className="dm-tags">{test.reply.tags.map(t => <span key={t.label} className={cx('dm-tag', t.tone === 'warn' && 'dm-warn')}>{t.label}</span>)}</span><span>{test.reply.text}</span></div> : null}
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}
