'use client';
import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useReducedMotion, useSeconds } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { enter, Fold, Swap } from '../../lib/motion';
import '../../designme.css';
import './agent-lanes.css';

export type LaneStatus = 'queued' | 'waiting' | 'working' | 'paused' | 'done';
export type LaneTone = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

export interface AgentLane {
  key: string;
  /** Like "Researcher" */
  name: string;
  icon: IconName;
  /** The lane's hue: its badge, its track, its Working tag and its stretch of the relay line. Defaults to blue */
  tone?: LaneTone;
  /** working breathes, shimmers and fills the next step, paused holds it, done fills the badge with its hue */
  status: LaneStatus;
  /** What the agent is doing now, or what it is waiting for. It crossfades when it changes, and shimmers while the agent works */
  activity: string;
  /** How many steps the track is cut into. Defaults to 3 */
  steps?: number;
  /** How many steps are finished. The next one fills while the agent works */
  done?: number;
  /** How far the agent is through the step in hand, from 0 to 1. Leave it out and that step fills part way */
  progress?: number;
  /** What the agent did, shown when the lane is opened. New entries slide in */
  log?: { text: string; time?: string }[];
}

/** One agent passing work to another: a light runs down the relay line between their badges, with a line saying what changed hands */
export interface AgentHandoff {
  /** Key of the lane handing over */
  from: string;
  /** Key of the lane taking it */
  to: string;
  /** What changes hands, like "the brief" */
  what: string;
}

export interface AgentLanesProps {
  lanes: AgentLane[];
  /** Header text. Defaults to "3 agents working", "All agents paused" or "All 3 agents finished" */
  title?: string;
  /** Seconds to show as m:ss. Leave it out to let the header count while agents work */
  seconds?: number;
  /** Whether every agent is paused. Working lanes then show Paused and the clock stops */
  paused?: boolean;
  defaultPaused?: boolean;
  /** Adds the Pause all / Resume button, until every lane is done */
  onPausedChange?: (paused: boolean) => void;
  /** The handoff to show. Set it back to undefined and its line slides away; the stretch of relay line it crossed stays lit */
  handoff?: AgentHandoff;
  /** Keys of the lanes that are open. Leave it out to let each row toggle itself */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (keys: string[]) => void;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

const TONE: Record<LaneTone, string> = { blue: 'pb', purple: 'pl', green: 'pm', orange: 'pp', red: 'pr', yellow: 'py', pink: 'pk', teal: 'pt' };
const hue = (l?: AgentLane) => TONE[l?.tone ?? 'blue'];

/** How many times `value` has changed since the first render, so a part can play its entrance on a change but not on mount */
function useChanges<T>(value: T) {
  const [seen, setSeen] = useState({ value, n: 0 });
  if (Object.is(seen.value, value)) return seen.n;
  setSeen({ value, n: seen.n + 1 });
  return seen.n + 1;
}

/** Keeps the last value on screen for `ms` after it is cleared, so it can play its exit */
function usePresence<T>(value: T | undefined, ms = 700) {
  const [kept, setKept] = useState(value);
  if (value !== undefined && value !== kept) setKept(value);
  useEffect(() => {
    if (value !== undefined || kept === undefined) return;
    const t = setTimeout(() => setKept(undefined), ms);
    return () => clearTimeout(t);
  }, [value, kept, ms]);
  return { shown: value ?? kept, leaving: value === undefined && kept !== undefined };
}

/** The hand-off line: it mounts shut and opens on the next frame, so the lanes below glide down, then closes before it goes */
function Handoff({ leaving, lit, style, children }: { leaving: boolean; lit: boolean; style: CSSProperties; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { let b = 0; const a = requestAnimationFrame(() => { b = requestAnimationFrame(() => setOpen(true)); }); return () => { cancelAnimationFrame(a); cancelAnimationFrame(b); }; }, []);
  const e = enter(80);
  return (
    <div className={cx('dm-fold dm-aln-hf', !(open && !leaving) && 'dm-shut', lit && 'dm-lit')} style={style} inert={!(open && !leaving)} aria-hidden={!(open && !leaving)}>
      <div><div className={cx('dm-aln-hand', e.className)} style={e.style}>{children}</div></div>
    </div>
  );
}

function StatusTag({ status }: { status: LaneStatus }) {
  const moved = useChanges(status) > 0 ? 'dm-enter' : undefined;
  if (status === 'working') return <span key="working" className={cx('dm-tag dm-aln-tg', moved)}><span className="dm-spin" aria-hidden="true" />Working</span>;
  if (status === 'paused') return <span key="paused" className={cx('dm-tag dm-warn', moved)}>Paused</span>;
  if (status === 'done') return <span key="done" className={cx('dm-tag dm-ok', moved)}><Icon name="check" size="xs" />Done</span>;
  if (status === 'waiting') return <span key="waiting" className={cx('dm-tag', moved)}><Icon name="clock" size="xs" />Waiting</span>;
  return <span key="queued" className={cx('dm-tag', moved)}>Queued</span>;
}

function Lane({ lane, paused, open, sent, got, ping, onToggle }: { lane: AgentLane; paused: boolean; open: boolean; sent: boolean; got: boolean; ping: boolean; onToggle: () => void }) {
  const status = paused && lane.status === 'working' ? 'paused' : lane.status;
  const tone = hue(lane), steps = lane.steps ?? 3, done = lane.done ?? 0;
  const live = status === 'working' || status === 'paused';
  return (
    <div className={cx('dm-aln-lane', sent && 'dm-sent', got && 'dm-got')} data-s={status} data-lane={lane.key} style={{ '--dm-c': `var(--dm-${tone})`, '--dm-cb': `var(--dm-${tone}-bg)`, '--dm-cm': `var(--dm-aln-${tone},var(--dm-${tone}))` } as CSSProperties}>
      <button type="button" className="dm-aln-row" aria-expanded={open} onClick={onToggle}>
        <span className={cx('dm-aln-av', ping && 'dm-ping')}>
          <Icon name={lane.icon} />
        </span>
        <span className="dm-aln-who"><span className="dm-aln-n">{lane.name}</span><Swap className={cx('dm-aln-a', live && 'dm-live', status === 'working' && 'dm-shim')}>{lane.activity}</Swap></span>
        <span className="dm-aln-tr" aria-hidden="true">
          {Array.from({ length: steps }, (_, i) => {
            const run = i === done && live;
            return <i key={i} className={cx(i < done && 'dm-on', run && 'dm-run', run && lane.progress === undefined && 'dm-ind')}
              style={run && lane.progress !== undefined ? { '--dm-p': Math.max(0, Math.min(1, lane.progress)) } as CSSProperties : undefined} />;
          })}
        </span>
        <span className="dm-aln-st"><StatusTag status={status} /></span>
      </button>
      <Fold open={open}>
        <div className="dm-aln-det">
          {lane.log?.map((l, i) => <div key={i} className="dm-enter"><span>{l.text}</span>{l.time && <span className="dm-muted">{l.time}</span>}</div>)}
        </div>
      </Fold>
    </div>
  );
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Several agents working side by side, each in its own lane and hue, handing work to one another down a relay line. */
export function AgentLanes({ lanes, title, seconds, paused, defaultPaused = false, onPausedChange, handoff, expanded, defaultExpanded = [], onExpandedChange, bare = true, className }: AgentLanesProps) {
  const [isPaused, setPaused] = useControllable(paused, defaultPaused, onPausedChange);
  const [open, setOpen] = useControllable(expanded, defaultExpanded, onExpandedChange);
  const finished = lanes.length > 0 && lanes.every(l => l.status === 'done');
  const counted = useSeconds(seconds === undefined && !isPaused && !finished);
  const { shown: hand, leaving } = usePresence(handoff);
  const reduce = useReducedMotion();
  const rows = useRef<HTMLDivElement>(null);
  // the hand-offs whose light has arrived: their stretch of the relay line stays lit
  const [relayed, setRelayed] = useState<string[]>([]);
  const [ping, setPing] = useState<string>();
  const handKey = hand ? `${hand.from}>${hand.to}` : '';
  useEffect(() => {
    if (!handoff) return;
    const { from, to } = handoff, key = `${from}>${to}`, box = rows.current;
    let an: Animation | undefined, pk: HTMLSpanElement | undefined, t2 = 0;
    const arrive = () => { pk?.remove(); setRelayed(r => r.includes(key) ? r : [...r, key]); setPing(to); t2 = window.setTimeout(() => setPing(p => p === to ? undefined : p), 950); };
    // the line opens first, then the light runs from the sender's badge down to the taker's
    const t1 = window.setTimeout(() => {
      const a = box?.querySelector(`[data-lane="${CSS.escape(from)}"] .dm-aln-av`), b = box?.querySelector(`[data-lane="${CSS.escape(to)}"] .dm-aln-av`);
      if (!box || !a || !b || reduce) return arrive();
      const rr = box.getBoundingClientRect(), y0 = a.getBoundingClientRect().bottom - rr.top + 4, y1 = b.getBoundingClientRect().top - rr.top - 4;
      const f = lanes.find(l => l.key === from), g = lanes.find(l => l.key === to);
      pk = document.createElement('span'); pk.className = 'dm-aln-pk'; pk.setAttribute('aria-hidden', 'true');
      pk.style.setProperty('--dm-from', `var(--dm-${hue(f)})`); pk.style.setProperty('--dm-to', `var(--dm-${hue(g)})`);
      box.appendChild(pk);
      an = pk.animate([{ transform: `translateY(${y0}px)`, opacity: 0 }, { opacity: 1, offset: .12 }, { opacity: 1, offset: .88 }, { transform: `translateY(${y1}px)`, opacity: 0 }], { duration: 950, easing: 'cubic-bezier(.65,0,.35,1)' });
      an.finished.then(arrive, () => {});
    }, reduce ? 0 : 500);
    return () => { clearTimeout(t1); clearTimeout(t2); an?.cancel(); pk?.remove(); };
  }, [handoff?.from, handoff?.to]); // eslint-disable-line react-hooks/exhaustive-deps

  const nameOf = (key: string) => lanes.find(l => l.key === key)?.name ?? key;
  const toneOf = (key: string) => hue(lanes.find(l => l.key === key));
  const head = title ?? (finished ? `All ${lanes.length} agents finished` : isPaused ? 'All agents paused' : `${lanes.length} agents working`);
  const total = lanes.reduce((n, l) => n + (l.steps ?? 3), 0), stepsDone = lanes.reduce((n, l) => n + Math.min(l.done ?? 0, l.steps ?? 3), 0);

  return (
    <div data-dm="" className={cx('dm-aln', !bare && 'dm-panel', finished && 'dm-fin', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-aln-h">
        <span className="dm-aln-ic">{finished ? <span key="ok" {...enter()} style={{ display: 'grid' }}><Icon name="ok" /></span> : <Icon name="users" />}</span>
        <Swap className="dm-aln-t">{head}</Swap>
        <span className="dm-aln-m dm-muted dm-num">{clock(seconds ?? counted)}</span>
        <Swap className="dm-aln-ct dm-num">{`${stepsDone} of ${total} steps`}</Swap>
        {onPausedChange && !finished && (
          <button type="button" className="dm-pill dm-soft dm-sm" onClick={() => setPaused(!isPaused)}>
            <Icon name={isPaused ? 'play' : 'pause'} size="xs" />{isPaused ? 'Resume' : 'Pause all'}
          </button>
        )}
      </div>
      <div className="dm-aln-rows" ref={rows}>
        {lanes.map(l => (
          <Fragment key={l.key}>
            {hand?.to === l.key && (
              <Handoff key={handKey} leaving={leaving} lit={relayed.includes(handKey)} style={{ '--dm-from': `var(--dm-${toneOf(hand.from)})`, '--dm-to': `var(--dm-${toneOf(hand.to)})` } as CSSProperties}>
                <b className="dm-f">{nameOf(hand.from)}</b> handed {hand.what} to <b className="dm-t">{nameOf(hand.to)}</b>
              </Handoff>
            )}
            <Lane lane={l} paused={isPaused} open={open.includes(l.key)} ping={ping === l.key}
              sent={relayed.some(k => k.startsWith(l.key + '>'))} got={relayed.some(k => k.endsWith('>' + l.key))}
              onToggle={() => setOpen(open.includes(l.key) ? open.filter(k => k !== l.key) : [...open, l.key])} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
