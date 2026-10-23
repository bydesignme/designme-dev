# Run queue

> Grouped tasks with live progress, retries and a compact view.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/run-queue

## Install

```sh
npx designme add run-queue          # HTML, CSS and JS, with the shared core
npx designme add run-queue --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Run queue lists the tasks an agent has lined up, each with its own steps, a status and a thin progress bar that fills as steps finish. A count at the top says how many tasks are done, a switch folds the steps away for a compact view, and a failed step can offer a Retry button.

### When to use it

- When your agent works through several tasks in a row and people want to see what is done, running and still waiting.
- When a step can fail and people should be able to retry just that step.
- When the queue can get long and people want a compact view with only the task rows.

### What it does

- Each task in `groups` has a `title`, a `state` (queued, running, failed or done) and its `steps`. Its progress bar shows the share of steps that are done.
- The words at the end of a task row default to Queued, Running, "1 step failed" or Done, and `meta` replaces them, for example with "Retrying".
- Done steps show their `meta`, like "3/3" or "4 articles", or "Done" if it is left out.
- With `onRetry`, a failed step shows a Retry button that calls it with the task and step indexes.
- A Detailed / Compact switch folds the steps away or shows them. Control it with `density` and `onDensityChange`.
- The top line counts finished tasks, like "1 of 3 done". The list sits flat by default, and `bare={false}` puts it on a card.

### Accessibility

- The density switch is a `role="group"` labelled "Density", and the current option has `aria-pressed="true"`.
- In the compact view, the folded steps are `inert` and `aria-hidden`, so their Retry buttons leave the tab order.

## Usage in React

```tsx
import { RunQueue } from '@/components/designme/run-queue/RunQueue';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { RunQueue, type RunGroup } from './RunQueue';
import { useScript } from '../lib/useScript';

/* ---------- Run queue: three tasks run in turn; one step fails and waits for Retry, and retries by itself after a moment ---------- */
const TASKS: { title: string; steps: [string, string, boolean?][] }[] = [
  { title: 'Research three competitors', steps: [['Read their pricing pages', '3/3'], ['Compared plans and limits', '5 gaps']] },
  { title: 'Draft the launch email', steps: [['Pulled the new features', 'Done'], ['Wrote two subject lines', 'Done'], ['Sent a test to the team', 'Done', true]] },
  { title: 'Update the help centre', steps: [['Billing questions', '4 articles'], ['Inviting your team', '2 articles']] }
];

export default function RunQueueDemo() {
  const [groups, setGroups] = useState<RunGroup[]>(() => TASKS.map(t => ({ title: t.title, state: 'queued', steps: t.steps.map(([label, meta]) => ({ label, meta, state: 'queued' })) })));
  const retry = useRef<() => void>(undefined);
  const edit = (gi: number, g: Partial<RunGroup>, si?: number, s?: Partial<RunGroup['steps'][number]>) =>
    setGroups(all => all.map((x, k) => k !== gi ? x : { ...x, ...g, steps: x.steps.map((y, j) => (j === si ? { ...y, ...s } : y)) }));
  useScript(async ({ wait }) => {
    await wait(600);
    for (let gi = 0; gi < TASKS.length; gi++) {
      edit(gi, { state: 'running' });
      for (let si = 0, retried = false; si < TASKS[gi].steps.length; si++) {
        edit(gi, {}, si, { state: 'running' });
        await wait(900);
        if (TASKS[gi].steps[si][2] && !retried) {
          edit(gi, { state: 'failed' }, si, { state: 'failed' });
          // waits for Retry, and carries on by itself after a moment so the run never stalls
          await Promise.race([new Promise<void>(res => { retry.current = res; }), wait(2800)]);
          retried = true; si--;
          edit(gi, { state: 'running', meta: 'Retrying' });
          continue;
        }
        edit(gi, {}, si, { state: 'done' });
      }
      edit(gi, { state: 'done', meta: undefined });
    }
  });
  return <div style={{ width: '100%' }}><RunQueue groups={groups} onRetry={() => retry.current?.()} /></div>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `groups` | `RunGroup[]` |  |
| `density` (optional) | `RunQueueDensity` | detailed lists every step under its task, compact folds them away. Leave it out to let the switch change it |
| `defaultDensity` (optional) | `RunQueueDensity` |  |
| `onDensityChange` (optional) | `(density: RunQueueDensity) => void` |  |
| `onRetry` (optional) | `(group: number, step: number) => void` | Called by the Retry button on a failed step. Without it, failed steps show no button |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to put the list on a card |
| `className` (optional) | `string` |  |

## Questions

**How do I let people retry a failed step?**

Pass `onRetry`. It is called with the task index and the step index, and you rerun the step and set its `state` back to 'running'. Without `onRetry`, failed steps show no button.

**Does the task's state follow its steps automatically?**

No. You set each task's `state` and each step's `state` yourself. The component only works out the progress bar from the done steps and the "N of M done" count from the done tasks.

**Can I start in the compact view?**

Yes. Set `defaultDensity="compact"`, or control `density` from your own state.

## Source

`RunQueue.tsx`, as `npx designme add run-queue --react` installs it:

```tsx
'use client';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Dot, Fold, Seg, Swap } from '../lib/motion';
import '../designme.css';
import './run-queue.css';

export type RunState = 'queued' | 'running' | 'failed' | 'done';

export interface RunStep {
  label: string;
  state: RunState;
  /** Quiet detail at the end once the step is done, like "3/3" or "4 articles". Defaults to "Done" */
  meta?: string;
}

export interface RunGroup {
  /** One task in the queue, like "Draft the launch email" */
  title: string;
  state: RunState;
  steps: RunStep[];
  /** Overrides the words at the end of the row, like "Retrying". Defaults to Queued, Running, "1 step failed" or Done */
  meta?: string;
}

export type RunQueueDensity = 'detailed' | 'compact';

export interface RunQueueProps {
  groups: RunGroup[];
  /** detailed lists every step under its task, compact folds them away. Leave it out to let the switch change it */
  density?: RunQueueDensity;
  defaultDensity?: RunQueueDensity;
  onDensityChange?: (density: RunQueueDensity) => void;
  /** Called by the Retry button on a failed step. Without it, failed steps show no button */
  onRetry?: (group: number, step: number) => void;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to put the list on a card */
  bare?: boolean;
  className?: string;
}

const groupMeta = (g: RunGroup) => {
  if (g.meta) return g.meta;
  if (g.state === 'failed') { const n = g.steps.filter(s => s.state === 'failed').length || 1; return `${n} step${n > 1 ? 's' : ''} failed`; }
  return g.state === 'running' ? 'Running' : g.state === 'done' ? 'Done' : 'Queued';
};

function GroupGlyph({ state }: { state: RunState }) {
  if (state === 'running') return <span className="dm-spin" style={{ color: 'var(--dm-fg)' }} />;
  if (state === 'failed') return <span style={{ color: 'var(--dm-bad)' }}><Icon name="alert" size="xs" /></span>;
  if (state === 'done') return <span style={{ color: 'var(--dm-ok)' }}><Icon name="check" size="xs" /></span>;
  return <Dot color="var(--dm-faint)" />;
}

function StepGlyph({ state }: { state: RunState }) {
  if (state === 'running') return <span className="dm-spin" style={{ width: 10, height: 10 }} />;
  if (state === 'failed') return <span style={{ color: 'var(--dm-bad)' }}><Icon name="x" size="xs" /></span>;
  if (state === 'done') return <span style={{ color: 'var(--dm-ok)' }}><Icon name="check" size="xs" /></span>;
  return <span className="dm-dot" style={{ color: 'var(--dm-faint)', width: 5, height: 5 }} />;
}

/** A queue of agent tasks, each with its own steps, a progress line and a retry for the step that failed. */
export function RunQueue({ groups, density, defaultDensity = 'detailed', onDensityChange, onRetry, bare = true, className }: RunQueueProps) {
  const [dens, setDens] = useControllable(density, defaultDensity, onDensityChange);
  const done = groups.filter(g => g.state === 'done').length;
  return (
    <div data-dm="" className={cx('dm-rq', className)}>
      <div className="dm-rq-top">
        <Seg label="Density" value={dens} onChange={setDens} options={[{ value: 'detailed', label: 'Detailed' }, { value: 'compact', label: 'Compact' }]} />
        <Swap className="dm-rq-all dm-muted dm-num">{`${done} of ${groups.length} done`}</Swap>
      </div>
      <div className={cx('dm-rq-list', !bare && 'dm-panel')} style={bare ? { paddingInline: 0 } : undefined}>
        {groups.map((g, gi) => {
          const finished = g.steps.filter(s => s.state === 'done').length;
          return (
            <div key={gi} className="dm-rq-g">
              <div className="dm-rq-gh">
                <span className="dm-g"><GroupGlyph state={g.state} /></span>
                <span>{g.title}</span>
                <Swap className="dm-m">{groupMeta(g)}</Swap>
              </div>
              <div className="dm-rq-bar"><i style={{ width: (g.steps.length ? finished / g.steps.length * 100 : 0) + '%' }} /></div>
              <Fold open={dens === 'detailed'}>
                {g.steps.map((s, si) => (
                  <div key={si} className={cx('dm-rq-sub', s.state === 'queued' && 'dm-wait')}>
                    <span className="dm-g"><StepGlyph state={s.state} /></span>
                    <span>{s.label}</span>
                    {s.state === 'failed' && onRetry
                      ? <span className="dm-m"><button type="button" className="dm-rq-retry" onClick={() => onRetry(gi, si)}>Retry</button></span>
                      : <Swap className="dm-m">{s.state === 'done' ? s.meta ?? 'Done' : ''}</Swap>}
                  </div>
                ))}
              </Fold>
            </div>
          );
        })}
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
- [Browser session](https://designme.dev/components/browser-session.md): The agent browsing for you, step by step, with Pause and Take over.
- [Trace view](https://designme.dev/components/trace-view.md): One agent run as a waterfall of spans, with latency and tokens.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.

All components: https://designme.dev/llms.txt
