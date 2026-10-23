# Action log

> Every read, search, edit and command, logged as it runs.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/action-log

## Install

```sh
npx designme add action-log          # HTML, CSS and JS, with the shared core
npx designme add action-log --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Action log is a running list of everything an agent does during a task: each file it reads, search it makes, edit it saves and command it runs. Rows land one by one with a spinner, settle with a check and a time, and open to show their output, like a diff or test results.

### When to use it

- When a coding or work agent runs many tool calls and people want a plain record of each one.
- When people need to check the exact diff or command output behind a step.
- When you want a header that says the agent is on step 4, then how many steps it took and how long.

### What it does

- Each action has an `icon`, a `title` (wrap file names in `<code>`), an optional `detail` line, and a `state` of running or done.
- Running rows show a spinner. Done rows show a check and their `time`, like "0.4s".
- Rows with `output` open on click to show it in a preformatted block. Lines wrapped in `dm-a` or `dm-x` spans read as added or removed.
- While `running` is true, the header shows a spinner and "Running step N". After that it shows a green dot and "N steps, Xs", the total of the action times, unless you pass `status`.
- `title` changes the header, which defaults to "Agent activity". It sits flat in a chat thread by default, and `bare={false}` gives it a card.

### Accessibility

- Rows with output are buttons with `aria-expanded`.
- Closed output panels are `inert` and `aria-hidden`.
- The actions are an ordered list (`<ol>`), so screen readers announce the step count and position.

## Usage in React

```tsx
import { ActionLog } from '@/components/designme/action-log/ActionLog';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { ActionLog, type Action } from './ActionLog';
import { useScript } from '../lib/useScript';

/* ---------- Action log: five tool calls land one by one, each opens to its output ---------- */
const ACTIONS: Omit<Action, 'state'>[] = [
  { icon: 'file-text', title: <>Read <code>Pricing.tsx</code></>, detail: 'src/pages, 212 lines', time: '0.4s', output: 'export function Pricing() {\n  return <Grid cols={3} gap={20}>…' },
  { icon: 'search', title: <>Searched Figma for <code>Button</code></>, detail: '6 matches in Components.fig', time: '1.1s', output: 'Button / Primary\nButton / Secondary\nButton / Ghost  +3' },
  { icon: 'edit', title: <>Edited <code>PricingCard.tsx</code></>, detail: <><span style={{ color: 'var(--dm-add)' }}>+18</span> <span style={{ color: 'var(--dm-del)' }}>−7</span> lines</>, time: '2.3s',
    output: <><span className="dm-x">− gap: 20px;</span>{'\n'}<span className="dm-a">+ gap: var(--space-6);</span></> },
  { icon: 'term', title: <>Ran <code>npm test</code></>, detail: '24 tests passed', time: '3.2s', output: '✓ PricingCard renders 3 plans\n✓ toggles yearly billing\n24 passed, 0 failed' },
  { icon: 'pr', title: 'Opened a pull request', detail: '#412, Use shared spacing tokens', time: '0.6s', output: 'feat/pricing-spacing → main\n3 commits, ready for review' }
];

export default function ActionLogDemo() {
  const [actions, setActions] = useState<Action[]>([]);
  const [running, setRunning] = useState(true);
  useScript(async ({ wait }) => {
    for (let i = 0; i < ACTIONS.length; i++) {
      setActions(a => [...a, { ...ACTIONS[i], state: 'running' }]);
      await wait(950);
      setActions(a => a.map((x, k) => (k === i ? { ...x, state: 'done' } : x)));
    }
    setRunning(false);
  });
  // keeps the room the five steps fill, so the header doesn't climb as each one lands
  return <div style={{ width: '100%', minHeight: 326 }}><ActionLog actions={actions} running={running} /></div>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `actions` | `Action[]` |  |
| `title` (optional) | `string` |  |
| `running` (optional) | `boolean` | Shows a spinner in the header while true, and a green dot once false |
| `status` (optional) | `string` | The words beside it. Defaults to "Running step N", then "N steps, Xs" |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Questions

**How do I add actions as the agent works?**

Append each new action to `actions` with `state: 'running'`, then set it to 'done' with a `time` when it finishes. Each new row plays a short entrance as it lands.

**How is the total time in the header worked out?**

It adds up the number at the start of each action's `time`, so write times in seconds, like "0.4s", for the total to make sense. Pass `status` to write your own line instead.

**Can I show a coloured diff in the output?**

Yes. `output` takes any React node, so wrap removed lines in `<span className="dm-x">` and added lines in `<span className="dm-a">`.

## Source

`ActionLog.tsx`, as `npx designme add action-log --react` installs it:

```tsx
'use client';
import { useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { Icon, type IconName } from '../lib/icons';
import { Dot, Fold, Spin, Swap } from '../lib/motion';
import '../designme.css';
import './action-log.css';

export interface Action {
  /** The tool's icon, like 'file-text', 'search', 'edit', 'term' or 'pr' */
  icon: IconName;
  /** What the agent did. Wrap file names in <code> */
  title: ReactNode;
  /** The quiet line under it, like "src/pages, 212 lines" */
  detail?: ReactNode;
  /** running shows a spinner, done a check and the time */
  state: 'running' | 'done';
  /** How long it took, like "0.4s". Shown once the action is done */
  time?: string;
  /** What opens under the row, like a diff or test output. Lines in <span className="dm-a"> or "dm-x" read as added or removed */
  output?: ReactNode;
}

export interface ActionLogProps {
  actions: Action[];
  title?: string;
  /** Shows a spinner in the header while true, and a green dot once false */
  running?: boolean;
  /** The words beside it. Defaults to "Running step N", then "N steps, Xs" */
  status?: string;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

function Row({ action }: { action: Action }) {
  const [open, setOpen] = useState(false);
  const done = action.state === 'done';
  return (
    <li className="dm-alg-it dm-enter">
      <button type="button" className="dm-alg-row" aria-expanded={action.output ? open : undefined} onClick={() => setOpen(!open)}>
        <span className="dm-alg-ic"><Icon name={action.icon} /></span>
        <span className="dm-alg-tx"><b>{action.title}</b>{action.detail && <span className="dm-d">{action.detail}</span>}</span>
        <span className="dm-alg-r">
          <span className="dm-num dm-ms">{done ? action.time : ''}</span>
          <span className="dm-g">{done
            ? <span key="ok" className="dm-enter" style={{ color: 'var(--dm-ok)' }}><Icon name="check" size="xs" /></span>
            : <span className="dm-spin" style={{ width: 10, height: 10 }} />}</span>
        </span>
      </button>
      {action.output && <Fold open={open} className="dm-alg-det"><pre>{action.output}</pre></Fold>}
    </li>
  );
}

/** Every tool call the agent makes, as a list that grows while it works. Each row opens to show its output. */
export function ActionLog({ actions, title = 'Agent activity', running = true, status, bare = true, className }: ActionLogProps) {
  const total = actions.reduce((s, a) => s + (parseFloat(a.time ?? '') || 0), 0);
  const words = status ?? (running
    ? actions.length ? `Running step ${actions.length}` : 'Running'
    : `${actions.length} steps${total ? `, ${total.toFixed(1)}s` : ''}`);
  return (
    <div data-dm="" className={cx('dm-alg', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-alg-h">
        <span className="dm-alg-t">{title}</span>
        {running
          ? <span key="run" className="dm-alg-st"><Spin /><Swap className="dm-alg-sum">{words}</Swap></span>
          : <span key="done" className="dm-alg-st dm-enter"><Dot color="var(--dm-ok)" /><span>{words}</span></span>}
      </div>
      <ol className="dm-alg-list">{actions.map((a, i) => <Row key={i} action={a} />)}</ol>
    </div>
  );
}
```

## More in Agent status

- [Thinking](https://designme.dev/components/thinking.md): The live trace, written as the agent works, then folded away.
- [Reasoning trail](https://designme.dev/components/reasoning-trail.md): The agent's plan, notes, sources and edits, after it thinks.
- [Agent lanes](https://designme.dev/components/agent-lanes.md): Several agents working in parallel, each with its own lane and hand-offs.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
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
