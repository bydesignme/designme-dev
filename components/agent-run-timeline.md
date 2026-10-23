# Agent run timeline

> Every model and tool step of a run on one time axis.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/agent-run-timeline

## Install

```sh
npx designme add agent-run-timeline          # HTML, CSS and JS, with the shared core
npx designme add agent-run-timeline --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Agent run timeline draws one agent run as a Gantt chart: every model and tool step is a bar on a shared time axis, so people can see what ran in parallel, what took longest and where a step failed and was retried. While the run is live, a playhead sweeps across and the bars grow up to it.

### When to use it

- When you need to see why an agent run was slow and which steps overlapped.
- When a step failed and was retried, and people should see where in the run that happened.
- When people care about cost per step as well as time.
- In a run history or debugging view, to replay a finished run or follow one live.

### What it does

- Each step is a bar placed by its `start` and `duration` in seconds, with an optional `icon`, `color` and `cost`.
- Pass `time` while the run is live. Bars grow up to it, a playhead sits on it, and the status line names the steps running at that moment.
- Leave `time` out once the run is over. The tag turns from Running to Done and the status line reads "Finished in Ns" unless you set `status`.
- `failed` hatches a bar red, and `note` is added to its tooltip, which also lists the step's duration and cost.
- The footer counts up total time, cost, steps and retries as the playhead moves. Pass `stats` to show your own figures once the run is done.
- The axis covers `span` seconds, defaulting to the end of the last step rounded up to a multiple of 4, with labels at quarters unless you pass `ticks`.

### Accessibility

- The run's state is written as text, Running or Done, and the spinner beside it is `aria-hidden`.
- With `prefers-reduced-motion: reduce`, the bars follow the playhead without easing and the status text changes without a crossfade.

## Usage in React

```tsx
import { AgentRunTimeline } from '@/components/designme/agent-run-timeline/AgentRunTimeline';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useState } from 'react';
import { AgentRunTimeline, type TimelineStep } from './AgentRunTimeline';

/* ---------- Agent run timeline: the playhead sweeps the run at 1.6x, then the totals settle ---------- */
const STEPS: TimelineStep[] = [
  { label: 'Plan the change', icon: 'brain', start: 0, duration: 1.6, color: 'var(--dm-c2)', cost: 0.03 },
  { label: 'Read 6 files', icon: 'file-text', start: 1.6, duration: 2.2, color: 'var(--dm-c1)', cost: 0.02 },
  { label: 'Search Figma', icon: 'figma', start: 1.9, duration: 1.4, color: 'var(--dm-c6)', cost: 0.01 },
  { label: 'Edit PricingCard', icon: 'edit', start: 4, duration: 2.4, color: 'var(--dm-c2)', cost: 0.06 },
  { label: 'Run tests', icon: 'term', start: 6.5, duration: 1.5, color: 'var(--dm-c3)', cost: 0.01, failed: true, note: '2 tests failed' },
  { label: 'Run tests, retry', icon: 'refresh', start: 8.1, duration: 1.9, color: 'var(--dm-c3)', cost: 0.01 },
  { label: 'Open PR', icon: 'pr', start: 10.1, duration: 1.3, color: 'var(--dm-c4)', cost: 0.02 }
];
const SPAN = 12;

export default function AgentRunTimelineDemo() {
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    let raf = 0;
    const start = setTimeout(() => {
      setStarted(true);
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(SPAN, ((now - t0) / 1000) * 1.6);
        setTime(t);
        if (t < SPAN) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, 500);
    return () => { clearTimeout(start); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div style={{ width: '100%' }}>
      <AgentRunTimeline title="Run 4821, update the pricing page" steps={STEPS} span={SPAN} time={time} status={started ? undefined : 'Starting'} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | Like "Run 4821, update the pricing page" |
| `steps` | `TimelineStep[]` |  |
| `time` (optional) | `number` | Seconds into the run. Bars grow up to it and the playhead sits on it. Leave it out once the run has finished |
| `span` (optional) | `number` | Seconds the axis covers. Defaults to the end of the last step, rounded up to a multiple of 4 |
| `ticks` (optional) | `number[]` | Labels on the axis, in seconds. Defaults to quarters of the span |
| `status` (optional) | `string` | The line under the title. Defaults to the steps running now, then "Finished in 11.4s" |
| `stats` (optional) | `TimelineStat[]` | The figures in the footer once the run is done. Defaults to the total time, cost, steps and retries, which count up while it plays |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Questions

**How do I follow a run live?**

Keep the steps you know about in `steps` and update `time` with the seconds since the run started, for example on each animation frame. When the run ends, leave `time` out.

**How do I show a failed step and its retry?**

Mark the failed step with `failed: true` and an optional `note`, like "2 tests failed", then add the retry as its own step after it. The footer counts the failed steps as retries.

**Can I replay a finished run?**

Yes. Pass the full `steps` list and move `time` from 0 to the end of the run. The demo plays it back at 1.6 times real speed.

## Source

`AgentRunTimeline.tsx`, as `npx designme add agent-run-timeline --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../lib/cx';
import { useIsoLayoutEffect, useReducedMotion, useTween } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { enter, Tip } from '../lib/motion';
import '../designme.css';
import './agent-run-timeline.css';

export interface TimelineStep {
  label: string;
  icon?: IconName;
  /** Seconds into the run when the step started */
  start: number;
  /** How long it took, in seconds */
  duration: number;
  /** Bar colour, any CSS colour. Defaults to the chart blue, var(--dm-c1) */
  color?: string;
  /** What the step cost, in dollars */
  cost?: number;
  /** Hatches the bar red, for a step that failed */
  failed?: boolean;
  /** Added to the bar's tooltip, like "2 tests failed" */
  note?: string;
}

export interface TimelineStat {
  /** Like "11.4s" */
  value: string;
  /** Like "total" */
  label: string;
}

export interface AgentRunTimelineProps {
  /** Like "Run 4821, update the pricing page" */
  title: string;
  steps: TimelineStep[];
  /** Seconds into the run. Bars grow up to it and the playhead sits on it. Leave it out once the run has finished */
  time?: number;
  /** Seconds the axis covers. Defaults to the end of the last step, rounded up to a multiple of 4 */
  span?: number;
  /** Labels on the axis, in seconds. Defaults to quarters of the span */
  ticks?: number[];
  /** The line under the title. Defaults to the steps running now, then "Finished in 11.4s" */
  status?: string;
  /** The figures in the footer once the run is done. Defaults to the total time, cost, steps and retries, which count up while it plays */
  stats?: TimelineStat[];
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

/** How many times `value` has changed since the first render, so a part can play its entrance on a change but not on mount */
function useChanges<T>(value: T) {
  const [seen, setSeen] = useState({ value, n: 0 });
  if (Object.is(seen.value, value)) return seen.n;
  setSeen({ value, n: seen.n + 1 });
  return seen.n + 1;
}

/** Like Swap, except that while `instant` is set the text changes straight away: the live status moves too fast to crossfade */
function Status({ text, instant, className }: { text: string; instant: boolean; className?: string }) {
  const [shown, setShown] = useState(text);
  const [out, setOut] = useState(false);
  const reduce = useReducedMotion();
  if (instant && shown !== text) setShown(text);
  useEffect(() => {
    if (instant || text === shown) return;
    setOut(true);
    const t = setTimeout(() => { setShown(text); setOut(false); }, reduce ? 0 : 170);
    return () => clearTimeout(t);
  }, [text, shown, instant, reduce]);
  return <div className={cx(className, !instant && 'dm-sw', out && 'dm-out')}>{instant ? text : shown}</div>;
}

const pct = (n: number) => n * 100 + '%';
const secs = (n: number) => String(+n.toFixed(1));

/** A run drawn as a Gantt chart: every step as a bar on a shared time axis, with a playhead while it runs. */
export function AgentRunTimeline({ title, steps, time, span, ticks, status, stats, bare = true, className }: AgentRunTimelineProps) {
  const end = Math.max(0, ...steps.map(s => s.start + s.duration));
  const T = span ?? Math.max(4, Math.ceil(end / 4) * 4);
  const done = time === undefined || time >= T;
  const t = done ? T : Math.max(0, time);
  // the bars ease after the playhead in JS: a CSS width transition restarted on every frame never gets to move
  const eased = useTween(t, 250);
  const changed = useChanges(done) > 0 ? 'dm-enter' : undefined;

  const now = steps.filter(s => t >= s.start && t < s.start + s.duration).map(s => s.label);
  const line = status ?? (done ? `Finished in ${end.toFixed(1)}s` : now.length ? now.join(', ') : 'Wrapping up');
  // the footer counts up with the playhead, so it is there from the start and never pops in at the end
  const started = steps.filter(s => t >= s.start), hasRetries = steps.some(s => s.failed);
  const cost = started.reduce((sum, s) => sum + (s.cost ?? 0) * Math.min(1, (t - s.start) / (s.duration || 1)), 0);
  const retries = steps.filter(s => s.failed && t >= s.start + s.duration).length, n = started.length;
  const figures = (done && stats) || [
    { value: `${Math.min(t, end).toFixed(1)}s`, label: 'total' },
    ...(steps.some(s => s.cost !== undefined) ? [{ value: `$${cost.toFixed(2)}`, label: 'cost' }] : []),
    { value: String(n), label: n === 1 ? 'step' : 'steps' },
    ...(hasRetries ? [{ value: String(retries), label: retries === 1 ? 'retry' : 'retries' }] : [])
  ];

  // the playhead follows the lanes, which start after the label column (narrower on small screens)
  const grid = useRef<HTMLDivElement>(null), head = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);
  useEffect(() => {
    const g = grid.current; if (!g) return;
    const ro = new ResizeObserver(() => setSize(n => n + 1)); ro.observe(g);
    return () => ro.disconnect();
  }, []);
  useIsoLayoutEffect(() => {
    const g = grid.current, h = head.current, lane = g?.querySelector('.dm-art-lane');
    if (!g || !h || !lane) return;
    const L = lane.getBoundingClientRect(), G = g.getBoundingClientRect();
    h.style.left = L.left - G.left + (t / T) * L.width + 'px';
  }, [t, T, size]);

  return (
    <div data-dm="" className={cx('dm-art', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-art-h">
        <div>
          <div className="dm-art-t">{title}</div>
          <Status className="dm-art-s dm-muted dm-num" text={line} instant={!done} />
        </div>
        {done
          ? <span key="done" className={cx('dm-tag dm-ok', changed)}><Icon name="check" size="xs" />Done</span>
          : <span key="run" className={cx('dm-tag dm-b', changed)}><span className="dm-spin" style={{ width: 9, height: 9 }} aria-hidden="true" />Running</span>}
      </div>
      <div className="dm-art-grid" ref={grid}>
        <div className="dm-art-axis">
          <span />
          <div className="dm-art-ticks">{(ticks ?? [0, 1, 2, 3, 4].map(k => (T * k) / 4)).map(v => <span key={v} style={{ left: pct(v / T) }}>{secs(v)}s</span>)}</div>
        </div>
        <div>
          {steps.map((s, i) => {
            const w = Math.max(0, Math.min(s.duration, eased - s.start));
            const tip = `${s.label}: ${s.duration.toFixed(1)}s${s.cost !== undefined ? `, $${s.cost.toFixed(2)}` : ''}${s.note ? `, ${s.note}` : ''}`;
            const e = enter(i * 50);
            return (
              <div key={i} className={cx('dm-art-row', e.className)} style={e.style}>
                <span className="dm-art-lab">{s.icon && <Icon name={s.icon} size="xs" />}<span className="dm-t">{s.label}</span></span>
                <span className="dm-art-lane">
                  <Tip label={tip}>
                    <span className={cx('dm-art-bar', s.failed && 'dm-fail')} style={{ '--dm-c': s.color ?? 'var(--dm-c1)', left: pct(s.start / T), width: pct(w / T), transition: 'none' } as CSSProperties} />
                  </Tip>
                </span>
              </div>
            );
          })}
        </div>
        <div className="dm-art-head" ref={head} style={done ? { opacity: 0 } : undefined} />
      </div>
      <div className="dm-art-f dm-muted dm-num">
        {figures.map((f, i) => <span key={i}><b>{f.value}</b> {f.label}</span>)}
      </div>
    </div>
  );
}
```

## More in Agent status

- [Thinking](https://designme.dev/components/thinking.md): The live trace, written as the agent works, then folded away.
- [Reasoning trail](https://designme.dev/components/reasoning-trail.md): The agent's plan, notes, sources and edits, after it thinks.
- [Agent lanes](https://designme.dev/components/agent-lanes.md): Several agents working in parallel, each with its own lane and hand-offs.
- [Agent tree](https://designme.dev/components/agent-tree.md): An orchestrator and its sub-agents, with cost rolled up per branch.
- [Agent inbox](https://designme.dev/components/agent-inbox.md): Every run that needs you, is running or is done, in one list.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
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
