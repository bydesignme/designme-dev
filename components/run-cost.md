# Run cost

> Live credit and token spend, with a cap that pauses the run.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/run-cost

## Install

```sh
npx designme add run-cost          # HTML, CSS and JS, with the shared core
npx designme add run-cost --react  # React 19 component and its CSS
npx designme add run-cost --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/run-cost.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/run-cost.json  # Astro
```

## About

Run cost shows how many credits an agent run has used against its budget, as a big number and a bar with a marker where the agent should pause. Under the bar it breaks the spend down, for example into input tokens, output tokens and tool calls, and a switch turns the pause on or off.

### When to use it

- When agent runs cost money or credits and people want to watch the spend while the run is going.
- When a long run should stop at a set share of the budget and wait for someone to approve more.
- When people ask what a run's cost is made of and you want to show the token and tool numbers behind it.

### What it does

- `used` and `budget` set the big number and how far the bar is filled. Numbers are rounded and shown with thousands separators.
- A marker on the bar sits at `capAt` percent (90 by default), with a tooltip saying the agent pauses there. It fades when the cap switch is off.
- The "Pause at N%" switch can be left to the component or controlled with `capOn` and `onCapChange`.
- `status` sets the tag and colour: idle, running (blue), stopped, paused (orange, and the bar and the dot in the tag turn bright orange too) or spent (red). `statusLabel` replaces the tag's words.
- The main button's label follows the status: Start run, Stop, Resume, Raise cap or Start over. It calls `onAction`, and `actionLabel` replaces the label.
- `rows` lists the breakdown under the bar, and `title` replaces the "Credits used" heading.

### Accessibility

- The bar is a `role="meter"` with `aria-valuenow` set to the credits used and `aria-valuemax` set to the budget, labelled with the title.
- The cap control is a `role="switch"` with `aria-checked` and a label like "Pause at 90 percent".

## Usage in React

```tsx
import { RunCost } from '@/components/designme/run-cost/RunCost';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { RunCost, type RunCostStatus } from './RunCost';
import { useTakeover } from '../lib/useScript';

/* ---------- Run cost: the run starts by itself and burns credits until the cap pauses it; raise the cap to finish ---------- */
const BUDGET = 2000;

export default function RunCostDemo() {
  const [status, setStatus] = useState<RunCostStatus>('idle');
  const [capOn, setCapOn] = useState(true);
  const [n, setN] = useState({ used: 0, input: 0, output: 0, tools: 0 });
  // the ticker reads these without restarting
  const live = useRef({ n, capOn });
  useEffect(() => { live.current = { n, capOn }; });

  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(() => {
      const { n: p, capOn: cap } = live.current, limit = cap ? BUDGET * 0.9 : BUDGET;
      const next = { used: Math.min(BUDGET, p.used + 8 + Math.random() * 18), input: p.input + 120 + Math.random() * 220, output: p.output + 30 + Math.random() * 70, tools: p.tools + (Math.random() < 0.12 ? 1 : 0) };
      if (next.used >= limit) { next.used = limit; setStatus(limit < BUDGET ? 'paused' : 'spent'); }
      live.current.n = next; setN(next);
    }, 90);
    return () => clearInterval(id);
  }, [status]);

  // the run starts by itself once the card has settled, unless you take over first
  const ref = useRef<HTMLDivElement>(null), mine = useTakeover(ref);
  useEffect(() => { const t = setTimeout(() => { if (!mine()) setStatus(s => (s === 'idle' ? 'running' : s)); }, 1500); return () => clearTimeout(t); }, [mine]);

  const act = () => {
    if (status === 'running') return setStatus('stopped');
    // Raise cap turns the pause off and carries on to the full budget
    if (status === 'paused') { setCapOn(false); live.current.capOn = false; }
    if (n.used >= BUDGET) setN({ used: 0, input: 0, output: 0, tools: 0 });
    setStatus('running');
  };

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <RunCost used={n.used} budget={BUDGET} capOn={capOn} onCapChange={setCapOn} status={status} onAction={act}
        rows={[{ label: 'Input tokens', value: n.input }, { label: 'Output tokens', value: n.output }, { label: 'Tool calls', value: n.tools }]} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `used` | `number` | Credits used so far |
| `budget` | `number` | The whole budget, like 2000 |
| `capAt` (optional) | `number` | Where the agent pauses, as a percentage of the budget. Defaults to 90 |
| `capOn` (optional) | `boolean` | Whether the agent pauses at the cap. Leave it out to let the switch change it |
| `defaultCapOn` (optional) | `boolean` |  |
| `onCapChange` (optional) | `(on: boolean) => void` |  |
| `status` (optional) | `RunCostStatus` | running is blue, paused (at the cap) amber, spent (the whole budget) red |
| `statusLabel` (optional) | `string` | Words in the status tag. Defaults to Idle, Running, Stopped, "Paused at 90%" or "Budget used" |
| `rows` (optional) | `RunCostRow[]` | The breakdown under the bar, like input tokens, output tokens and tool calls |
| `actionLabel` (optional) | `string` | Words on the button. Defaults to Start run, Stop, Resume, Raise cap or Start over, by status |
| `onAction` (optional) | `() => void` | Called by the button. What it does is up to you: start, stop, resume, raise the cap |
| `title` (optional) | `string` |  |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import RunCost from '../components/designme/run-cost/RunCost.astro';
---
<RunCost />
<RunCost data-style="soft" class="my-class" />
```
It plays its demo; change `run-cost.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Does the component pause the agent when it reaches the cap?**

No. It shows the cap and whether it is on. Your code compares `used` with the cap, stops the agent and sets `status` to 'paused'.

**What should the button do?**

Whatever fits the status, through `onAction`. Its label suggests the usual move, for example Stop while running or Raise cap when paused. The demo turns the cap off and runs on to the full budget when Raise cap is pressed.

**Can I show money instead of credits?**

The numbers are shown as whole numbers with thousands separators and no currency sign. You can change `title` to name the unit, for example "Cents used".

## Source

`RunCost.tsx`, as `npx designme add run-cost --react` installs it:

```tsx
'use client';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Swap, Tip } from '../lib/motion';
import '../designme.css';
import './run-cost.css';

export type RunCostStatus = 'idle' | 'running' | 'stopped' | 'paused' | 'spent';

export interface RunCostRow {
  /** Like "Input tokens" */
  label: string;
  value: number;
}

export interface RunCostProps {
  /** Credits used so far */
  used: number;
  /** The whole budget, like 2000 */
  budget: number;
  /** Where the agent pauses, as a percentage of the budget. Defaults to 90 */
  capAt?: number;
  /** Whether the agent pauses at the cap. Leave it out to let the switch change it */
  capOn?: boolean;
  defaultCapOn?: boolean;
  onCapChange?: (on: boolean) => void;
  /** running is blue, paused (at the cap) amber, spent (the whole budget) red */
  status?: RunCostStatus;
  /** Words in the status tag. Defaults to Idle, Running, Stopped, "Paused at 90%" or "Budget used" */
  statusLabel?: string;
  /** The breakdown under the bar, like input tokens, output tokens and tool calls */
  rows?: RunCostRow[];
  /** Words on the button. Defaults to Start run, Stop, Resume, Raise cap or Start over, by status */
  actionLabel?: string;
  /** Called by the button. What it does is up to you: start, stop, resume, raise the cap */
  onAction?: () => void;
  title?: string;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const TONE: Partial<Record<RunCostStatus, string>> = { running: 'dm-b', paused: 'dm-warn', spent: 'dm-bad' };
const ACTION: Record<RunCostStatus, string> = { idle: 'Start run', running: 'Stop', stopped: 'Resume', paused: 'Raise cap', spent: 'Start over' };

/** Credits a run has used against its budget, with a cap the agent pauses at and the tokens behind the number. */
export function RunCost({ used, budget, capAt = 90, capOn, defaultCapOn = true, onCapChange, status = 'idle', statusLabel, rows, actionLabel, onAction, title = 'Credits used', bare = true, className }: RunCostProps) {
  const [cap, setCap] = useControllable(capOn, defaultCapOn, onCapChange);
  const label = statusLabel ?? { idle: 'Idle', running: 'Running', stopped: 'Stopped', paused: `Paused at ${capAt}%`, spent: 'Budget used' }[status];
  return (
    <div data-dm="" className={cx('dm-rc', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-rc-h">
        <span className="dm-muted">{title}</span>
        <span className={cx('dm-rc-st dm-tag', TONE[status])}><span className="dm-dot" /><Swap className="dm-rc-stt">{label}</Swap></span>
      </div>
      <div className="dm-rc-big"><span className="dm-rc-n dm-num">{fmt(used)}</span><span className="dm-muted"> / {fmt(budget)}</span></div>
      <div className="dm-rc-track" role="meter" aria-label={title} aria-valuemin={0} aria-valuemax={budget} aria-valuenow={Math.round(used)}>
        <div className="dm-rc-fill" style={{ width: Math.max(0, Math.min(100, used / budget * 100)) + '%', background: status === 'paused' ? 'var(--dm-warn-mark)' : 'var(--dm-accent-mark, var(--dm-accent))' }} />
        <Tip label="The agent pauses here"><div className="dm-rc-cap" style={{ left: capAt + '%', opacity: cap ? 1 : 0.2 }} /></Tip>
      </div>
      {rows && (
        <div className="dm-rc-rows">
          {rows.map(r => <div key={r.label}><span>{r.label}</span><span className="dm-num">{fmt(r.value)}</span></div>)}
        </div>
      )}
      <div className="dm-rc-f">
        <label className="dm-rc-cap-t" onClick={e => { e.preventDefault(); setCap(!cap); }}>
          <button type="button" className="dm-toggle" role="switch" aria-checked={cap} aria-label={`Pause at ${capAt} percent`} />
          <span>Pause at {capAt}%</span>
        </label>
        <button type="button" className={cx('dm-pill dm-sm dm-rc-go', status === 'running' || status === 'stopped' ? 'dm-soft' : 'dm-primary')} onClick={onAction}>
          <Swap>{actionLabel ?? ACTION[status]}</Swap>
        </button>
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
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Agent jobs running, up next and done, with progress, retries and a compact view.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.
- [Thinking states](https://designme.dev/components/thinking-states.md): Six thinking indicators to pick from, each with a status line.

All components: https://designme.dev/llms.txt
