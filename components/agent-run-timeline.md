# Agent run timeline

> Every model and tool step of a run on one time axis.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/agent-run-timeline

## Install

```sh
npx designme add agent-run-timeline          # HTML, CSS and JS, with the shared core
npx designme add agent-run-timeline --react  # React 19 component and its CSS
npx designme add agent-run-timeline --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/agent-run-timeline.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/agent-run-timeline.json  # Astro
```

## About

Agent run timeline draws one agent run as a Gantt chart: every model, tool and app step is a bar on a shared time axis, in its kind's colour and with its own icon or app mark, so people can see what ran in parallel, what took longest and where a step failed and was retried. While the run is live, a playhead with the time on it sweeps across, the bars grow up to it and the step at work carries a passing light.

### When to use it

- When you need to see why an agent run was slow and which steps overlapped.
- When a step failed and was retried, and people should see where in the run that happened.
- When people care about cost per step as well as time.
- In a run history or debugging view, to replay a finished run or follow one live.

### What it does

- Each step is a bar placed by its `start` and `duration` in seconds, with an optional `icon` (or `brand`, an app's own mark like Figma, GitHub or Slack) and `cost`.
- A step's `kind` colours it: `model` in purple, `tool` in teal and `app` in orange, in light and dark. Its bar, its icon's tint and its live time take the colour, and a key under the title adds up how long each kind has run. `color` overrides the bar's colour.
- Pass `time` while the run is live. Bars grow up to it, a playhead in the accent carries the time on the axis, the lanes it has passed take a faint wash, and the line under the title names the steps at work, shimmering. The step at work has a passing light along its bar, a bright leading edge and a soft ring that breathes round its icon. Steps that haven't started yet are dimmed.
- The column at the right shows how long each step took, counting up in the step's colour while it runs.
- Leave `time` out once the run is over. The tag turns from Running to Done, the playhead stops at the end of the last step and turns green with a check, and the status line reads "Finished in Ns" (with the number of retries when a step failed) unless you set `status`.
- `failed` hatches a bar red and puts a red tag after the label, reading `tag` or "Failed". `retry` on the next step draws a dashed amber line from the end of the failed step to it once it starts. `note` is added to the bar's tooltip, which also lists the step's duration and cost.
- The footer counts up total time, cost, steps and retries as the playhead moves, each with an icon. Pass `stats` to show your own figures once the run is done.
- The axis covers `span` seconds, defaulting to the end of the last step rounded up to a multiple of 4, with labels at quarters unless you pass `ticks`. An axis label hides while the playhead's time covers it.
- In Blueprint the bars are flat, the running bar is hatched and steps along, its icon's ring blinks in steps, the lanes behind the playhead are hatched and the lines are hairlines, with no glow.

### Accessibility

- The run's state is written as text, Running or Done, and the spinner beside it is `aria-hidden`.
- The key is a list labelled "Time by kind of step", so the colours are never the only way to tell the kinds apart. Icons, app marks, the axis, the playhead and the retry line are `aria-hidden`; each step's label and time are text.
- A failed step says so in its tag, not only with its hatching and colour.
- With `prefers-reduced-motion: reduce`, the passing light, the shimmer and the breathing ring stop, and the status text changes without a crossfade.

## Usage in React

```tsx
import { AgentRunTimeline } from '@/components/designme/agent-run-timeline/AgentRunTimeline';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { AgentRunTimeline, type TimelineStep } from './AgentRunTimeline';
import { useStory } from '../lib/useScript';

/* ---------- Agent run timeline: the playhead sweeps the run at 1.6x, the tests fail and run again, then the totals settle ---------- */
const STEPS: TimelineStep[] = [
  { label: 'Plan the change', icon: 'brain', kind: 'model', start: 0, duration: 1.6, cost: 0.03 },
  { label: 'Read 6 files', icon: 'file-text', kind: 'tool', start: 1.6, duration: 2.2, cost: 0.02 },
  { label: 'Search Figma', brand: 'figma', kind: 'app', start: 1.9, duration: 1.4, cost: 0.01 },
  { label: 'Edit PricingCard', icon: 'edit', kind: 'model', start: 4, duration: 2.4, cost: 0.06 },
  { label: 'Run tests', icon: 'term', kind: 'tool', start: 6.5, duration: 1.5, cost: 0.01, failed: true, tag: '2 failed', note: '2 tests failed' },
  { label: 'Run tests again', icon: 'refresh', kind: 'tool', start: 8.1, duration: 1.9, cost: 0.01, retry: true },
  { label: 'Open a PR on GitHub', brand: 'github', kind: 'app', start: 10.1, duration: 1, cost: 0.02 },
  { label: 'Post to Slack', brand: 'slack', kind: 'app', start: 11.1, duration: 0.6, cost: 0.01 }
];
const SPAN = 12, END = 11.7, PACE = 1.6;

export default function AgentRunTimelineDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<number | undefined>(0);
  const [started, setStarted] = useState(false);
  // the run plays at 1.6 times real speed; while a mouse rests on it the story holds, and the clock waits with it
  useStory(ref, async ({ wait }) => {
    await wait(500);
    setStarted(true);
    let t = 0, last = performance.now();
    while (t < END) {
      await wait(16);
      const now = performance.now();
      // a long gap is a hold ending, and counts as one frame
      t = Math.min(END, t + ((now - last < 250 ? now - last : 16) / 1000) * PACE); last = now;
      setTime(t);
    }
    setTime(undefined);
  }, { hold: false });
  return (
    <div ref={ref} style={{ width: '100%' }}>
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
| `kindLabels` (optional) | `Partial<Record<StepKind, string>>` | The names of the kinds in the key. Defaults to Model, Tools and Apps |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import AgentRunTimeline from '../components/designme/agent-run-timeline/AgentRunTimeline.astro';
---
<AgentRunTimeline />
<AgentRunTimeline data-style="soft" class="my-class" />
```
It plays its demo; change `agent-run-timeline.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I follow a run live?**

Keep the steps you know about in `steps` and update `time` with the seconds since the run started, for example on each animation frame. When the run ends, leave `time` out.

**How do I show a failed step and its retry?**

Mark the failed step with `failed: true`, a short `tag` like "2 failed" and an optional `note` for its tooltip, then add the retry as its own step after it with `retry: true`. The footer counts the failed steps as retries.

**Which app marks can a step show?**

Set `brand` to one of the marks the components share: google, github, figma, slack, notion, linear, gmail or drive. For anything else, use `icon`.

**Can I replay a finished run?**

Yes. Pass the full `steps` list and move `time` from 0 to the end of the run. The demo plays it back at 1.6 times real speed, and holds while a mouse rests on it.

## Source

`AgentRunTimeline.tsx`, as `npx designme add agent-run-timeline --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../lib/cx';
import { useIsoLayoutEffect, useReducedMotion, useTween } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Brand, type BrandName } from '../lib/brands';
import { enter, Tip } from '../lib/motion';
import '../designme.css';
import './agent-run-timeline.css';

/** What a step is: the model thinking or writing (purple), a tool like a file read or a test run (teal), or an app the agent
    works in, like Figma or GitHub (orange) */
export type StepKind = 'model' | 'tool' | 'app';

export interface TimelineStep {
  label: string;
  icon?: IconName;
  /** An app's own mark in place of the icon, like 'figma', 'github' or 'slack' */
  brand?: BrandName;
  /** Colours the step's bar, icon and live time, and counts it in the key under the title */
  kind?: StepKind;
  /** Seconds into the run when the step started */
  start: number;
  /** How long it took, in seconds */
  duration: number;
  /** Bar colour, any CSS colour. Defaults to the kind's colour, or the chart blue, var(--dm-c1), for a step with no kind */
  color?: string;
  /** What the step cost, in dollars */
  cost?: number;
  /** Hatches the bar red and puts a red tag after the label, for a step that failed */
  failed?: boolean;
  /** The tag on a failed step, like "2 failed". Defaults to "Failed" */
  tag?: string;
  /** Added to the bar's tooltip, like "2 tests failed" */
  note?: string;
  /** A retry of the failed step just before it: a dashed line joins the end of that step to this one once it starts */
  retry?: boolean;
}

export interface TimelineStat {
  /** Like "11.4s" */
  value: string;
  /** Like "total" */
  label: string;
  icon?: IconName;
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
  /** The names of the kinds in the key. Defaults to Model, Tools and Apps */
  kindLabels?: Partial<Record<StepKind, string>>;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

// each kind's bar colour, a chart colour (teal and orange take a little of their text slot, so the bars keep 3:1 on a light
// page), and palette slot (its icon tint and live time)
const KIND: Record<StepKind, [string, string, string]> = {
  model: ['Model', 'var(--dm-c2)', 'pl'],
  tool: ['Tools', 'color-mix(in srgb,var(--dm-c6) 70%,var(--dm-pt))', 'pt'],
  app: ['Apps', 'color-mix(in srgb,var(--dm-c4) 75%,var(--dm-pp))', 'pp']
};
const KINDS = Object.keys(KIND) as StepKind[];

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
type State = 'wait' | 'run' | 'done' | 'fail';

/** A run drawn as a Gantt chart: every step as a bar in its kind's colour on a shared time axis, with a playhead while it runs. */
export function AgentRunTimeline({ title, steps, time, span, ticks, status, stats, kindLabels, bare = true, className }: AgentRunTimelineProps) {
  const end = Math.max(0, ...steps.map(s => s.start + s.duration));
  const T = span ?? Math.max(4, Math.ceil(end / 4) * 4);
  const done = time === undefined || time >= T;
  const t = done ? end : Math.max(0, time);
  // the bars ease after the playhead in JS: a CSS width transition restarted on every frame never gets to move
  const eased = useTween(t, 250);
  const changed = useChanges(done) > 0 ? 'dm-enter' : undefined;

  const state = (s: TimelineStep): State => t < s.start ? 'wait' : t < s.start + s.duration && !done ? 'run' : s.failed ? 'fail' : 'done';
  // the line under the title names the steps at work; between two steps it keeps the last one's names
  const now = steps.filter(s => state(s) === 'run').map(s => s.label).join(', ');
  const last = useRef('');
  if (now) last.current = now;
  const retries = steps.filter(s => s.failed && t >= s.start + s.duration).length;
  const line = status ?? (done ? `Finished in ${end.toFixed(1)}s${steps.some(s => s.failed) ? `, ${retries} ${retries === 1 ? 'retry' : 'retries'}` : ''}` : now || last.current || 'Starting');
  // the footer counts up with the playhead, so it is there from the start and never pops in at the end
  const started = steps.filter(s => t >= s.start), hasRetries = steps.some(s => s.failed), n = started.length;
  const ran = (s: TimelineStep) => Math.max(0, Math.min(s.duration, t - s.start));
  const cost = started.reduce((sum, s) => sum + (s.cost ?? 0) * (ran(s) / (s.duration || 1)), 0);
  const figures = (done && stats) || [
    { value: `${Math.min(t, end).toFixed(1)}s`, label: 'total', icon: 'clock' as IconName },
    ...(steps.some(s => s.cost !== undefined) ? [{ value: `$${cost.toFixed(2)}`, label: 'cost', icon: 'dollar' as IconName }] : []),
    { value: String(n), label: n === 1 ? 'step' : 'steps', icon: 'layers' as IconName },
    ...(hasRetries ? [{ value: String(retries), label: retries === 1 ? 'retry' : 'retries', icon: 'refresh' as IconName }] : [])
  ];
  const kinds = KINDS.filter(k => steps.some(s => s.kind === k));
  const per = (k: StepKind) => steps.filter(s => s.kind === k).reduce((sum, s) => sum + ran(s), 0);

  // a step that finishes while you watch gives its icon a small bump
  const seenRunning = useRef(new Set<number>());
  steps.forEach((s, i) => { if (state(s) === 'run') seenRunning.current.add(i); });

  // the time on the playhead covers the axis labels it passes
  const grid = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const g = grid.current; if (!g) return;
    const b = g.querySelector('.dm-art-now')?.getBoundingClientRect(); if (!b) return;
    g.querySelectorAll('.dm-art-ticks span').forEach(el => { const x = el.getBoundingClientRect(); el.classList.toggle('dm-hid', x.right > b.left - 4 && x.left < b.right + 4); });
  });

  return (
    <div data-dm="" className={cx('dm-art', !bare && 'dm-panel', done ? 'dm-fin' : 'dm-live', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-art-h">
        <div className="dm-art-hd">
          <div className="dm-art-t">{title}</div>
          <Status className={cx('dm-art-s dm-num', done ? 'dm-muted' : 'dm-shim')} text={line} instant={!done} />
        </div>
        {done
          ? <span key="done" className={cx('dm-art-tag dm-tag dm-ok', changed)}><Icon name="check" size="xs" />Done</span>
          : <span key="run" className={cx('dm-art-tag dm-tag', changed)}><span className="dm-spin" aria-hidden="true" />Running</span>}
      </div>
      {kinds.length > 0 && (
        <div className="dm-art-key dm-num" role="list" aria-label="Time by kind of step">
          {kinds.map(k => <span key={k} role="listitem" style={{ '--dm-k': KIND[k][1] } as CSSProperties}><i />{kindLabels?.[k] ?? KIND[k][0]}<b>{per(k).toFixed(1)}s</b></span>)}
        </div>
      )}
      <div className="dm-art-grid" ref={grid} style={{ '--dm-p': (t / T).toFixed(4) } as CSSProperties}>
        <div className="dm-art-axis" aria-hidden="true">
          <span />
          <div className="dm-art-ticks">{(ticks ?? [0, 1, 2, 3, 4].map(k => (T * k) / 4)).map(v => <span key={v} style={{ left: pct(v / T) }}>{secs(v)}s</span>)}</div>
          <span />
        </div>
        <div className="dm-art-past" aria-hidden="true" />
        <div className="dm-art-rows">
          {steps.map((s, i) => {
            const st = state(s), w = Math.max(0, Math.min(s.duration, eased - s.start)), prev = steps[i - 1];
            const k = s.kind ? KIND[s.kind] : null;
            const tip = `${s.label}: ${s.duration.toFixed(1)}s${s.cost !== undefined ? `, $${s.cost.toFixed(2)}` : ''}${s.note ? `, ${s.note}` : ''}`;
            const e = enter(i * 40);
            const hue = { '--dm-k': s.color ?? (k ? k[1] : 'var(--dm-c1)'), '--dm-kt': k ? `var(--dm-${k[2]})` : 'var(--dm-fg2)', '--dm-kb': k ? `var(--dm-${k[2]}-bg)` : 'var(--dm-chip)' } as CSSProperties;
            return (
              <div key={i} className={cx('dm-art-row', e.className, st === 'done' && seenRunning.current.has(i) && 'dm-bump')} style={{ ...e.style, ...hue }} data-k={s.kind} data-s={st}>
                <span className="dm-art-lab">
                  <span className="dm-art-ic" aria-hidden="true">{s.brand ? <Brand name={s.brand} /> : s.icon && <Icon name={s.icon} size="xs" />}</span>
                  <span className="dm-t">{s.label}</span>
                  {st === 'fail' && <span className="dm-tag dm-bad dm-enter">{s.tag ?? 'Failed'}</span>}
                </span>
                <span className="dm-art-lane">
                  {s.retry && prev?.failed && <span className="dm-art-link" aria-hidden="true" style={{ left: pct((prev.start + prev.duration) / T), width: pct((s.start - prev.start - prev.duration) / T) }} />}
                  <Tip label={tip}>
                    <span className="dm-art-bar" style={{ left: pct(s.start / T), width: pct(w / T) }}><i /></span>
                  </Tip>
                </span>
                <span className="dm-art-d dm-num">{st === 'wait' ? '' : `${ran(s).toFixed(1)}s`}</span>
              </div>
            );
          })}
        </div>
        <div className="dm-art-head" aria-hidden="true"><i /><span className="dm-art-now dm-num">{done && <Icon name="check" size="xs" />}{t.toFixed(1)}s</span></div>
      </div>
      <div className="dm-art-f dm-muted dm-num">
        {figures.map((f, i) => <span key={i}>{f.icon && <Icon name={f.icon} size="xs" />}<span><b>{f.value}</b> {f.label}</span></span>)}
      </div>
    </div>
  );
}
```

## More in Agent status

- [Thinking](https://designme.dev/components/thinking.md): The live trace, written as the agent works, then folded away.
- [Reasoning trail](https://designme.dev/components/reasoning-trail.md): The agent's plan, notes, sources and edits, after it thinks.
- [Agent lanes](https://designme.dev/components/agent-lanes.md): Several agents working in parallel, each with its own lane and hand-offs.
- [Agent tree](https://designme.dev/components/agent-tree.md): An orchestrator and the sub-agents it spawns, with the active path and cost rolled up.
- [Agent inbox](https://designme.dev/components/agent-inbox.md): Every run that needs you, is running or is done, in one list.
- [Trace view](https://designme.dev/components/trace-view.md): One agent run as a waterfall of spans, with latency and tokens.
- [Browser session](https://designme.dev/components/browser-session.md): The agent browsing for you, step by step, with Pause and Take over.
- [Web search](https://designme.dev/components/web-search.md): The agent's searches as a trail: what it asked, what came back, what it read or skipped, and the answer with its sources.
- [Agent phases](https://designme.dev/components/agent-phases.md): One line for which phase the agent is in, from thinking to done, that stops to ask you, says when it is slow, and folds to how long it took.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Agent jobs running, up next and done, with progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.
- [Thinking states](https://designme.dev/components/thinking-states.md): Six thinking indicators to pick from, each with a status line.

All components: https://designme.dev/llms.txt
