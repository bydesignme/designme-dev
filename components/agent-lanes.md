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

Agent lanes shows several agents working on one job, each in its own row and its own colour, with a name, what it is doing right now, a step track and a status tag. A relay line joins the agents' badges. When one agent passes work to another, a light runs down that line to the next badge, a line like "Researcher handed the brief to Designer" opens above the lane that takes it, and the stretch of line it crossed stays lit.

### When to use it

- When your product runs several agents with different roles, like a researcher, a designer and a reviewer, on one task.
- When some agents wait on others and people need to see who is blocked and why.
- When people should be able to pause every agent at once and resume them later.
- When each agent's own log should be one click away without crowding the overview.

### What it does

- Each lane has a `tone` (blue, purple, green, orange, red, yellow, pink or teal) that colours its badge, its track, its Working tag and its stretch of the relay line, in light and dark.
- Each lane has a `status`: queued, waiting, working, paused or done. A working lane breathes a soft ring round its badge, shimmers its activity and carries a wash of its colour; paused holds; done fills the badge with its colour.
- The `activity` line crossfades when it changes. The track is cut into `steps` (3 by default). The step after `done` fills as `progress` goes from 0 to 1, with a light running along it; without `progress` it fills part way.
- Setting `handoff` to `{ from, to, what }` opens a line above the receiving lane and sends a light down the relay line from the sender's badge to the receiver's, which rings once. Set it back to undefined and the line slides away; the stretch the light crossed stays lit.
- The header reads "3 agents working", "All agents paused" or "All 3 agents finished" unless you pass `title`, with a m:ss clock that counts while agents work and, wider than a phone, how many steps of all the lanes are done.
- Clicking a lane opens its `log`, with an optional time for each entry. Open lanes can be controlled with `expanded` and `onExpandedChange`.
- `onPausedChange` adds a Pause all / Resume button that turns working lanes into Paused and stops the clock. It disappears once every lane is done.

### Accessibility

- Each lane row is a button with `aria-expanded` for its log.
- Closed logs and a hand-off line that is leaving are `inert` and `aria-hidden`.
- The track, the relay line, the light and the working spinner are `aria-hidden`: each status is written out as text, like Working, Paused or Done, and the header counts the steps.
- With reduced motion the light doesn't run: the stretch of line lights at once, and the breathing and shimmer stop.

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

/* ---------- Agent lanes: three agents work in turn, each step filling as it goes, and hand the work along; Pause all holds them ---------- */
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
    const hold = async (ms: number, each?: (p: number) => void) => { for (let t = 0; t < ms;) { await wait(100); if (!live.current.paused) { t += 100; each?.(t / ms); } } };
    const work = async (p: (typeof PLAN)[number]) => {
      for (let i = 0; i < 3; i++) {
        set(p.key, { status: 'working', activity: p.acts[i], done: i, progress: 0 });
        await hold(1500, f => set(p.key, { progress: f }));
        const time = live.current.secs + 's';
        set(p.key, l => ({ done: i + 1, log: [...(l.log ?? []), { text: p.log[i], time }] }));
      }
      set(p.key, { status: 'done', activity: p.log[2] });
    };
    // the line opens, the light runs down to the next badge (about 1.5s), then the line closes
    const hand = async (from: string, to: string, what: string) => { setHandoff({ from, to, what }); await wait(2750); setHandoff(undefined); await wait(700); };

    await wait(600);
    const first = work(PLAN[0]); set('designer', { status: 'waiting' });
    await first; await hand('researcher', 'designer', 'the brief');
    set('reviewer', { status: 'waiting' });
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
| `handoff` (optional) | `AgentHandoff` | The handoff to show. Set it back to undefined and its line slides away; the stretch of relay line it crossed stays lit |
| `expanded` (optional) | `string[]` | Keys of the lanes that are open. Leave it out to let each row toggle itself |
| `defaultExpanded` (optional) | `string[]` |  |
| `onExpandedChange` (optional) | `(keys: string[]) => void` |  |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Questions

**Does Pause all stop my agents?**

No. It changes how the lanes look and calls `onPausedChange`. Your code pauses the agents, and the lanes' own `status` values stay as you set them.

**How do I show one agent handing work to another?**

Set `handoff` with the `from` and `to` lane keys and a short `what`, like "the brief". The light takes about a second and a half to arrive; clear `handoff` after that and the line closes before it goes.

**Can a lane have more than three steps?**

Yes. Set `steps` on the lane to cut its track into as many parts as you need, move `done` forward as each one finishes, and set `progress` to fill the one in hand.

## Source

`AgentLanes.tsx`, as `npx designme add agent-lanes --react` installs it:

```tsx
'use client';
import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useReducedMotion, useSeconds } from '../lib/hooks';
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
```

## More in Agent status

- [Thinking](https://designme.dev/components/thinking.md): The live trace, written as the agent works, then folded away.
- [Reasoning trail](https://designme.dev/components/reasoning-trail.md): The agent's plan, notes, sources and edits, after it thinks.
- [Agent tree](https://designme.dev/components/agent-tree.md): An orchestrator and its sub-agents, with cost rolled up per branch.
- [Agent inbox](https://designme.dev/components/agent-inbox.md): Every run that needs you, is running or is done, in one list.
- [Trace view](https://designme.dev/components/trace-view.md): One agent run as a waterfall of spans, with latency and tokens.
- [Browser session](https://designme.dev/components/browser-session.md): The agent browsing for you, step by step, with Pause and Take over.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Grouped tasks with live progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.

All components: https://designme.dev/llms.txt
