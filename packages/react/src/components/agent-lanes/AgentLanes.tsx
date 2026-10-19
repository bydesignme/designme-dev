'use client';
import { Fragment, useEffect, useState, type CSSProperties } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useSeconds } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Fold, Swap } from '../../lib/motion';
import '../../designme.css';
import './agent-lanes.css';

export type LaneStatus = 'queued' | 'waiting' | 'working' | 'paused' | 'done';
export type LaneTone = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

export interface AgentLane {
  key: string;
  /** Like "Researcher" */
  name: string;
  icon: IconName;
  /** Colours the badge and the track. Defaults to blue */
  tone?: LaneTone;
  /** working spins and fills the next step, paused holds it, done settles with a check */
  status: LaneStatus;
  /** What the agent is doing now, or what it is waiting for. It crossfades when it changes */
  activity: string;
  /** How many steps the track is cut into. Defaults to 3 */
  steps?: number;
  /** How many steps are finished. The next one fills while the agent works */
  done?: number;
  /** What the agent did, shown when the lane is opened. New entries slide in */
  log?: { text: string; time?: string }[];
}

/** One agent passing work to another, shown as a banner above the lane it goes to */
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
  /** The handoff to show. Set it back to undefined and the banner slides away */
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

/** How many times `value` has changed since the first render, so a part can play its entrance on a change but not on mount */
function useChanges<T>(value: T) {
  const [seen, setSeen] = useState({ value, n: 0 });
  if (Object.is(seen.value, value)) return seen.n;
  setSeen({ value, n: seen.n + 1 });
  return seen.n + 1;
}

/** Keeps the last value on screen for `ms` after it is cleared, so it can play its exit */
function usePresence<T>(value: T | undefined, ms = 350) {
  const [kept, setKept] = useState(value);
  if (value !== undefined && value !== kept) setKept(value);
  useEffect(() => {
    if (value !== undefined || kept === undefined) return;
    const t = setTimeout(() => setKept(undefined), ms);
    return () => clearTimeout(t);
  }, [value, kept, ms]);
  return { shown: value ?? kept, leaving: value === undefined && kept !== undefined };
}

function StatusTag({ status }: { status: LaneStatus }) {
  const moved = useChanges(status) > 0 ? 'dm-enter' : undefined;
  if (status === 'working') return <span key="working" className={cx('dm-tag dm-b', moved)}><span className="dm-spin" style={{ width: 9, height: 9 }} aria-hidden="true" />Working</span>;
  if (status === 'paused') return <span key="paused" className={cx('dm-tag dm-warn', moved)}>Paused</span>;
  if (status === 'done') return <span key="done" className={cx('dm-tag dm-ok', moved)}><Icon name="check" size="xs" />Done</span>;
  return <span key={status} className={cx('dm-tag', moved)}>{status === 'waiting' ? 'Waiting' : 'Queued'}</span>;
}

function Lane({ lane, paused, open, onToggle }: { lane: AgentLane; paused: boolean; open: boolean; onToggle: () => void }) {
  const status = paused && lane.status === 'working' ? 'paused' : lane.status;
  const tone = TONE[lane.tone ?? 'blue'], steps = lane.steps ?? 3, done = lane.done ?? 0;
  const live = status === 'working' || status === 'paused';
  return (
    <div className="dm-aln-lane">
      <button type="button" className="dm-aln-row" aria-expanded={open} onClick={onToggle}>
        <span className="dm-aln-av" style={{ background: `var(--dm-${tone}-bg)`, color: `var(--dm-${tone})` }}><Icon name={lane.icon} /></span>
        <span><span className="dm-aln-n">{lane.name}</span><Swap className={cx('dm-aln-a', live && 'dm-live')}>{lane.activity}</Swap></span>
        <span className="dm-aln-tr" style={{ '--dm-c': `var(--dm-${tone})` } as CSSProperties}>
          {Array.from({ length: steps }, (_, i) => <i key={i} className={cx(i < done && 'dm-on', i === done && live && 'dm-run')} />)}
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

/** Several agents working side by side, each in its own lane, handing work to one another. */
export function AgentLanes({ lanes, title, seconds, paused, defaultPaused = false, onPausedChange, handoff, expanded, defaultExpanded = [], onExpandedChange, bare = true, className }: AgentLanesProps) {
  const [isPaused, setPaused] = useControllable(paused, defaultPaused, onPausedChange);
  const [open, setOpen] = useControllable(expanded, defaultExpanded, onExpandedChange);
  const finished = lanes.length > 0 && lanes.every(l => l.status === 'done');
  const counted = useSeconds(seconds === undefined && !isPaused && !finished);
  const { shown: hand, leaving } = usePresence(handoff);
  const nameOf = (key: string) => lanes.find(l => l.key === key)?.name ?? key;
  const head = title ?? (finished ? `All ${lanes.length} agents finished` : isPaused ? 'All agents paused' : `${lanes.length} agents working`);

  return (
    <div data-dm="" className={cx('dm-aln', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-aln-h">
        <span className="dm-aln-ic"><Icon name="users" /></span>
        <Swap className="dm-aln-t">{head}</Swap>
        <span className="dm-aln-m dm-muted dm-num">{clock(seconds ?? counted)}</span>
        {onPausedChange && !finished && (
          <button type="button" className="dm-pill dm-soft dm-sm" onClick={() => setPaused(!isPaused)}>
            <Icon name={isPaused ? 'play' : 'pause'} size="xs" />{isPaused ? 'Resume' : 'Pause all'}
          </button>
        )}
      </div>
      <div>
        {lanes.map(l => (
          <Fragment key={l.key}>
            {hand?.to === l.key && (
              <div key={`${hand.from}>${hand.to}`} className={cx('dm-aln-hand', leaving ? 'dm-leave' : 'dm-enter')}>
                <Icon name="right" size="xs" />{nameOf(hand.from)} handed {hand.what} to {nameOf(hand.to)}
              </div>
            )}
            <Lane lane={l} paused={isPaused} open={open.includes(l.key)} onToggle={() => setOpen(open.includes(l.key) ? open.filter(k => k !== l.key) : [...open, l.key])} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
