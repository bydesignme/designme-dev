# Agent lanes

> Several agents working in parallel, each with its own lane and hand-offs.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/agent-lanes

## Install

```sh
npx designme add agent-lanes          # HTML, CSS and JS, with the shared core
npx designme add agent-lanes --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Agent lanes shows several agents working on one job, each in its own row with a name, what it is doing right now, a step track and a status tag. When one agent passes work to another, a banner like "Researcher handed the brief to Designer" slides in above the lane that takes it.

### When to use it

- When your product runs several agents with different roles, like a researcher, a designer and a reviewer, on one task.
- When some agents wait on others and people need to see who is blocked and why.
- When people should be able to pause every agent at once and resume them later.
- When each agent's own log should be one click away without crowding the overview.

### What it does

- Each lane has a `status`: queued, waiting, working, paused or done. Working shows a spinner, paused holds, and done settles with a check.
- The `activity` line crossfades when it changes. The track is cut into `steps` (3 by default), and the step after `done` fills while the agent works.
- Clicking a lane opens its `log`, with an optional time for each entry. Open lanes can be controlled with `expanded` and `onExpandedChange`.
- Setting `handoff` to `{ from, to, what }` slides a banner in above the receiving lane. Set it back to undefined and the banner slides away.
- The header reads "3 agents working", "All agents paused" or "All 3 agents finished" unless you pass `title`, and shows a m:ss clock that counts while agents work.
- `onPausedChange` adds a Pause all / Resume button that turns working lanes into Paused and stops the clock. It disappears once every lane is done.

### Accessibility

- Each lane row is a button with `aria-expanded` for its log.
- Closed logs and a hand-off banner that is leaving are `inert` and `aria-hidden`.
- The working spinner is `aria-hidden`, and each status is written out as text, like Working, Paused or Done.

## Usage in React

```tsx
import { AgentLanes } from '@/components/designme/agent-lanes/AgentLanes';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { AgentLanes, type AgentHandoff, type AgentLane, type LaneTone } from './AgentLanes';
import type { IconName } from '../lib/icons';
import { useScript } from '../lib/useScript';

/* ---------- Agent lanes: three agents work in turn and hand the work along; Pause all holds them ---------- */
const PLAN: { key: string; name: string; icon: IconName; tone: LaneTone; wait?: string; acts: string[]; log: string[] }[] = [
  { key: 'researcher', name: 'Researcher', icon: 'search', tone: 'blue', acts: ['Reading competitor sites', 'Comparing 5 pricing pages', 'Writing the brief'], log: ['Read stripe.com/pricing', 'Read linear.app/pricing', 'Noted 3 patterns'] },
  { key: 'designer', name: 'Designer', icon: 'palette', tone: 'purple', wait: 'Waiting for the brief', acts: ['Laying out pricing cards', 'Setting type and spacing', 'Exporting frames'], log: ['Made 3 card variants', 'Applied spacing tokens', 'Exported 4 frames'] },
  { key: 'reviewer', name: 'Reviewer', icon: 'eye', tone: 'green', wait: 'Waiting for the designer', acts: ['Checking contrast', 'Checking copy', 'Signing off'], log: ['Contrast passes AA', 'Fixed 2 lines of copy', 'Approved'] }
];

export default function AgentLanesDemo() {
  const [lanes, setLanes] = useState<AgentLane[]>(() => PLAN.map(p => ({ key: p.key, name: p.name, icon: p.icon, tone: p.tone, status: 'queued', activity: p.wait ?? 'Queued', done: 0, log: [] })));
  const [handoff, setHandoff] = useState<AgentHandoff>();
  const [paused, setPaused] = useState(false);
  const [secs, setSecs] = useState(0);
  const [finished, setFinished] = useState(false);
  // the script reads these while it runs
  const live = useRef({ paused, secs });
  useEffect(() => { live.current = { paused, secs }; });
  // the clock ticks on a steady beat and skips the beats that fall in a pause
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => { if (!live.current.paused) setSecs(s => s + 1); }, 1000);
    return () => clearInterval(id);
  }, [finished]);

  useScript(async ({ wait }) => {
    const set = (key: string, patch: Partial<AgentLane> | ((l: AgentLane) => Partial<AgentLane>)) =>
      setLanes(ls => ls.map(l => l.key === key ? { ...l, ...(typeof patch === 'function' ? patch(l) : patch) } : l));
    // work only moves on while the agents are not paused
    const hold = async (ms: number) => { for (let t = 0; t < ms;) { await wait(100); if (!live.current.paused) t += 100; } };
    const work = async (p: (typeof PLAN)[number]) => {
      for (let i = 0; i < 3; i++) {
        set(p.key, { status: 'working', activity: p.acts[i], done: i });
        await hold(1500);
        const time = live.current.secs + 's';
        set(p.key, l => ({ done: i + 1, log: [...(l.log ?? []), { text: p.log[i], time }] }));
      }
      set(p.key, { status: 'done', activity: p.log[2] });
    };
    const hand = async (from: string, to: string, what: string) => { setHandoff({ from, to, what }); await wait(1700); setHandoff(undefined); await wait(700); };

    await wait(600);
    const first = work(PLAN[0]); set('designer', { status: 'waiting' });
    await first; await hand('researcher', 'designer', 'the brief');
    await work(PLAN[1]); await hand('designer', 'reviewer', '4 frames');
    await work(PLAN[2]);
    setFinished(true);
  });

  return (
    <div style={{ width: '100%' }}>
      <AgentLanes lanes={lanes} handoff={handoff} seconds={secs} paused={paused} onPausedChange={setPaused} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `lanes` | `AgentLane[]` |  |
| `title` (optional) | `string` | Header text. Defaults to "3 agents working", "All agents paused" or "All 3 agents finished" |
| `seconds` (optional) | `number` | Seconds to show as m:ss. Leave it out to let the header count while agents work |
| `paused` (optional) | `boolean` | Whether every agent is paused. Working lanes then show Paused and the clock stops |
| `defaultPaused` (optional) | `boolean` |  |
| `onPausedChange` (optional) | `(paused: boolean) => void` | Adds the Pause all / Resume button, until every lane is done |
| `handoff` (optional) | `AgentHandoff` | The handoff to show. Set it back to undefined and the banner slides away |
| `expanded` (optional) | `string[]` | Keys of the lanes that are open. Leave it out to let each row toggle itself |
| `defaultExpanded` (optional) | `string[]` |  |
| `onExpandedChange` (optional) | `(keys: string[]) => void` |  |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Questions

**Does Pause all stop my agents?**

No. It changes how the lanes look and calls `onPausedChange`. Your code pauses the agents, and the lanes' own `status` values stay as you set them.

**How do I show one agent handing work to another?**

Set `handoff` with the `from` and `to` lane keys and a short `what`, like "the brief". Clear it after a moment and the banner closes before it goes.

**Can a lane have more than three steps?**

Yes. Set `steps` on the lane to cut its track into as many parts as you need, and move `done` forward as each one finishes.

## Source

`AgentLanes.tsx`, as `npx designme add agent-lanes --react` installs it:

```tsx
'use client';
import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useSeconds } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { enter, Fold, Swap } from '../lib/motion';
import '../designme.css';
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

/** The hand-off row: it mounts shut and opens on the next frame, so the lanes below glide down, then closes before it goes */
function Handoff({ leaving, children }: { leaving: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { let b = 0; const a = requestAnimationFrame(() => { b = requestAnimationFrame(() => setOpen(true)); }); return () => { cancelAnimationFrame(a); cancelAnimationFrame(b); }; }, []);
  const e = enter(80);
  return <Fold open={open && !leaving} className="dm-aln-hf"><div className={cx('dm-aln-hand', e.className)} style={e.style}>{children}</div></Fold>;
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
              <Handoff key={`${hand.from}>${hand.to}`} leaving={leaving}>
                <Icon name="right" size="xs" />{nameOf(hand.from)} handed {hand.what} to {nameOf(hand.to)}
              </Handoff>
            )}
            <Lane lane={l} paused={isPaused} open={open.includes(l.key)} onToggle={() => setOpen(open.includes(l.key) ? open.filter(k => k !== l.key) : [...open, l.key])} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
```

## More in Agent status

- [Thinking](https://designme.dev/components/thinking.md): The live trace, written as the agent works, then folded away.
- [Reasoning trail](https://designme.dev/components/reasoning-trail.md): The agent's plan, notes, sources and edits, after it thinks.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Grouped tasks with live progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.

All components: https://designme.dev/llms.txt
