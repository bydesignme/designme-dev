# Run queue

> Agent jobs running, up next and done, with progress, retries and a compact view.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/run-queue

## Install

```sh
npx designme add run-queue          # HTML, CSS and JS, with the shared core
npx designme add run-queue --react  # React 19 component and its CSS
npx designme add run-queue --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/run-queue.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/run-queue.json  # Astro
```

## About

Run queue shows the jobs an agent has lined up in three parts: the job running, raised on its own card with its agent, its steps, a progress bar and the time left; the jobs up next, each with its agent and when it should start; and the jobs done, each with how long it took and a green tick. A strip across the top shows the whole queue at a glance, and a failed step offers a Retry button.

### When to use it

- When your agent works through several jobs in a row and people want to see what is running, what comes next and what is done.
- When a step can fail and people should be able to retry just that step.
- When people want to know how long the queue still has to go.

### What it does

- Each job in `jobs` has a `title`, an `agent` and an `icon` for its badge, a `state` (queued, running, failed or done) and its `steps`. Running and failed jobs sit under Running, queued ones under Up next and finished ones under Done, in the order of `jobs`.
- A job glides from one part to the next when its `state` changes, and the jobs it passes glide with it.
- The running job shows its agent and the step it is on, a progress bar from `progress` (or the share of its steps that are done) and its steps with what each came to (`meta`). `time` is the words at the end of the row: when a waiting job starts, what is left of a running one, or how long a done one took.
- A failed step turns its job red and, with `onRetry`, shows a Retry button that calls it with the job and step indexes.
- An empty part says so ("Nothing waiting", "Nothing done yet"). Once every job is done, Running and Up next fold away and "All 4 jobs done" takes their place, with `summary` under it.
- A Detailed / Compact switch shows or folds away the running job's steps. Control it with `density` and `onDensityChange`.
- The status line defaults to "1 of 4 done", and `status` replaces it. The queue sits on its card by default, and `bare` lays it flat in a chat.

### Accessibility

- Running, Up next and Done are labelled lists, so screen readers announce each part and how many jobs it holds.
- The density switch is a `role="group"` labelled "Density", and the current option has `aria-pressed="true"`.
- Folded steps and folded parts are `inert` and `aria-hidden`, so their Retry buttons leave the tab order.

## Usage in React

```tsx
import { RunQueue } from '@/components/designme/run-queue/RunQueue';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { RunQueue, type RunJob } from './RunQueue';
import type { IconName } from '../lib/icons';
import { useScript, useTakeover } from '../lib/useScript';

/* ---------- Run queue: four jobs run in turn, each with its agent. The launch email's test send fails once and waits for
   Retry, and retries by itself after a moment until you take over ---------- */
const STEP = 1.4;
const JOBS: { title: string; agent: string; icon: IconName; steps: [string, string, boolean?][] }[] = [
  { title: 'Research three competitors', agent: 'Research agent', icon: 'search', steps: [['Read their pricing pages', '3 of 3'], ['Compared plans and limits', '5 gaps']] },
  { title: 'Draft the launch email', agent: 'Copy agent', icon: 'mail', steps: [['Pulled the new features', '6 items'], ['Wrote two subject lines', '2 drafts'], ['Sent a test to the team', 'Sent', true]] },
  { title: 'Update the help centre', agent: 'Docs agent', icon: 'book', steps: [['Billing questions', '4 articles'], ['Inviting your team', '2 articles']] },
  { title: 'Post the changelog', agent: 'Release agent', icon: 'send', steps: [['Posted in #releases', 'Posted']] }
];
const secs = (gi: number) => JOBS[gi].steps.length * STEP;

export default function RunQueueDemo() {
  const [jobs, setJobs] = useState<RunJob[]>(() => JOBS.map(j => ({ title: j.title, agent: j.agent, icon: j.icon, state: 'queued', steps: j.steps.map(([label, meta]) => ({ label, meta, state: 'queued' })) })));
  const [summary, setSummary] = useState<string>();
  const retry = useRef<() => void>(undefined);
  const ref = useRef<HTMLDivElement>(null), mine = useTakeover(ref);
  // when each waiting job starts: after what is left of the one running and of every job ahead of it
  const times = (all: RunJob[]) => { let ahead = 0;
    return all.map((j, k) => {
      if (j.state === 'running' || j.state === 'failed') { const left = secs(k) * (1 - (j.progress ?? 0)); ahead += left; return j.state === 'running' ? { ...j, time: left < .5 ? 'Finishing' : `${Math.ceil(left)}s left` } : j; }
      if (j.state === 'queued') { const t = `in ~${Math.max(1, Math.round(ahead))}s`; ahead += secs(k); return { ...j, time: t }; }
      return j;
    }); };
  const edit = (gi: number, g: Partial<RunJob>, si?: number, s?: Partial<NonNullable<RunJob['steps']>[number]>) =>
    setJobs(all => times(all.map((x, k) => k !== gi ? x : { ...x, ...g, steps: x.steps?.map((y, j) => (j === si ? { ...y, ...s } : y)) })));
  useScript(async ({ wait }) => {
    edit(0, { state: 'running', progress: 0 });
    await wait(700);
    let total = 0, retries = 0;
    for (let gi = 0; gi < JOBS.length; gi++) {
      const n = JOBS[gi].steps.length; let took = 0, failed = false;
      edit(gi, { state: 'running', progress: 0 });
      for (let si = 0; si < n; si++) {
        edit(gi, {}, si, { state: 'running' });
        // the step fills its share of the bar a tenth of a second at a time; the test send fails part way, once
        const failAt = JOBS[gi].steps[si][2] && !failed ? .55 : 2;
        let q = 0;
        while (q < 1 && q < failAt) { await wait(100); q = Math.min(1, q + .1 / STEP); took += .1; edit(gi, { progress: (si + q) / n }); }
        if (q < 1) {
          failed = true;
          edit(gi, { state: 'failed', time: 'Test send failed' }, si, { state: 'failed' });
          await new Promise<void>(res => { retry.current = res; wait(2800).then(() => { if (!mine()) res(); }); });
          retries++; si--;
          edit(gi, { state: 'running' });
          continue;
        }
        edit(gi, {}, si, { state: 'done' });
      }
      total += took;
      await wait(420);
      edit(gi, { state: 'done', progress: 1, time: `${took.toFixed(1)}s${failed ? ' · 1 retry' : ''}` });
    }
    setSummary(`${total.toFixed(1)}s in all · ${retries ? `${retries} ${retries > 1 ? 'retries' : 'retry'}` : 'no retries'}`);
  });
  return <div ref={ref} style={{ width: '100%' }}><RunQueue title="Launch prep" jobs={jobs} summary={summary} onRetry={() => retry.current?.()} /></div>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `jobs` | `RunJob[]` |  |
| `title` (optional) | `string` | The queue's name over its status line |
| `status` (optional) | `string` | Overrides the status line. Defaults to "1 of 4 done", "1 step failed, waiting for Retry" or "All 4 done" |
| `summary` (optional) | `string` | The line under "All 4 jobs done" once every job is done, like "18.4s in all · 1 retry" |
| `density` (optional) | `RunQueueDensity` | detailed lists the running job's steps, compact folds them away. Leave it out to let the switch change it |
| `defaultDensity` (optional) | `RunQueueDensity` |  |
| `onDensityChange` (optional) | `(density: RunQueueDensity) => void` |  |
| `onRetry` (optional) | `(job: number, step: number) => void` | Called by the Retry button on a failed step, with the job's and the step's index. Without it, failed steps show no button |
| `bare` (optional) | `boolean` | Sits flat in a chat thread, with no card. Defaults to false: the queue on its card, as on designme.dev |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import RunQueue from '../components/designme/run-queue/RunQueue.astro';
---
<RunQueue />
<RunQueue data-style="soft" class="my-class" />
```
It plays its demo; change `run-queue.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I let people retry a failed step?**

Pass `onRetry`. It is called with the job index and the step index, and you rerun the step and set its `state` back to 'running'. Without `onRetry`, failed steps show no button.

**Does a job's state follow its steps automatically?**

No. You set each job's `state` and each step's `state` yourself. The component only works out the progress bar from the done steps when `progress` is left out, and the counts from the job states.

**Can I start in the compact view?**

Yes. Set `defaultDensity="compact"`, or control `density` from your own state.

## Source

`RunQueue.tsx`, as `npx designme add run-queue --react` installs it:

```tsx
'use client';
import { useRef, type CSSProperties } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Fold, Seg, Swap } from '../lib/motion';
import '../designme.css';
import './run-queue.css';

export type RunState = 'queued' | 'running' | 'failed' | 'done';

export interface RunStep {
  label: string;
  state: RunState;
  /** What the step came to, shown once it is done, like "3 of 3" or "4 articles" */
  meta?: string;
}

export interface RunJob {
  /** Keeps the job's row when the list changes order. Defaults to the title */
  id?: string;
  /** What the job is, like "Draft the launch email" */
  title: string;
  /** Who does it, like "Copy agent", under the title */
  agent?: string;
  /** The icon on the job's badge. Defaults to a spark */
  icon?: IconName;
  state: RunState;
  /** How far the job is, 0 to 1. Defaults to the share of its steps that are done */
  progress?: number;
  /** The time at the end of the row: when a waiting job starts ("in ~4s"), what is left of a running one ("12s left") or how long a done one took ("4.2s") */
  time?: string;
  /** The line after the agent while it runs. Defaults to the step running, or the one that failed */
  note?: string;
  steps?: RunStep[];
}

export type RunQueueDensity = 'detailed' | 'compact';

export interface RunQueueProps {
  jobs: RunJob[];
  /** The queue's name over its status line */
  title?: string;
  /** Overrides the status line. Defaults to "1 of 4 done", "1 step failed, waiting for Retry" or "All 4 done" */
  status?: string;
  /** The line under "All 4 jobs done" once every job is done, like "18.4s in all · 1 retry" */
  summary?: string;
  /** detailed lists the running job's steps, compact folds them away. Leave it out to let the switch change it */
  density?: RunQueueDensity;
  defaultDensity?: RunQueueDensity;
  onDensityChange?: (density: RunQueueDensity) => void;
  /** Called by the Retry button on a failed step, with the job's and the step's index. Without it, failed steps show no button */
  onRetry?: (job: number, step: number) => void;
  /** Sits flat in a chat thread, with no card. Defaults to false: the queue on its card, as on designme.dev */
  bare?: boolean;
  className?: string;
}

const live = (s: RunState) => s === 'running' || s === 'failed';
const share = (j: RunJob) => j.progress ?? (j.steps?.length ? j.steps.filter(s => s.state === 'done').length / j.steps.length : j.state === 'done' ? 1 : 0);

function StepGlyph({ state }: { state: RunState }) {
  if (state === 'running') return <span className="dm-spin" aria-hidden="true" />;
  if (state === 'failed') return <Icon name="x" size="xs" />;
  if (state === 'done') return <Icon name="check" size="xs" />;
  return <span className="dm-dot" aria-hidden="true" />;
}

/** A queue of agent jobs: the one running, raised with its steps, progress and time left; the ones up next; and the ones done. */
export function RunQueue({ jobs, title = 'Run queue', status, summary, density, defaultDensity = 'detailed', onDensityChange, onRetry, bare = false, className }: RunQueueProps) {
  const [dens, setDens] = useControllable(density, defaultDensity, onDensityChange);
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const done = jobs.filter(j => j.state === 'done').length, fin = jobs.length > 0 && done === jobs.length;
  const failed = jobs.some(j => j.state === 'failed');
  const line = status ?? (fin ? `All ${jobs.length} done` : failed ? '1 step failed, waiting for Retry' : `${done} of ${jobs.length} done`);
  const keyOf = (j: RunJob) => j.id ?? j.title;
  const part = (s: RunState) => live(s) ? 'run' : s === 'done' ? 'done' : 'next';

  /* a job that moves to another part of the queue glides there from where it was, and the jobs it passes glide with it */
  const was = useRef(new Map<string, { part: string; top: number; left: number }>());
  useIsoLayoutEffect(() => {
    const el = box.current; if (!el) return;
    const moved = jobs.some(j => { const w = was.current.get(keyOf(j)); return w && w.part !== part(j.state); });
    el.querySelectorAll<HTMLElement>('.dm-rq-j[data-k]').forEach(row => {
      const k = row.dataset.k!, w = was.current.get(k), b = row.getBoundingClientRect();
      if (moved && w && !reduce) { const dx = w.left - b.left, dy = w.top - b.top;
        if (Math.abs(dx) + Math.abs(dy) > 1) row.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' }); }
      was.current.set(k, { part: row.dataset.p!, top: b.top, left: b.left });
    });
  }, [jobs.map(j => keyOf(j) + ':' + part(j.state)).join()]);

  const row = (j: RunJob, ji: number) => {
    const p = Math.max(0, Math.min(1, share(j))), s = j.state === 'running' ? 'run' : j.state === 'failed' ? 'fail' : j.state === 'done' ? 'done' : 'wait';
    const at = j.steps?.find(x => x.state === 'failed') ?? j.steps?.find(x => x.state === 'running');
    const note = live(j.state) ? j.note ?? at?.label : undefined;
    return (
      <li key={keyOf(j)} className="dm-rq-j" data-s={s} data-k={keyOf(j)} data-p={part(j.state)}>
        <div className="dm-rq-jh">
          <span className="dm-rq-av" aria-hidden="true"><Icon name={j.icon ?? 'spark'} /></span>
          <span className="dm-rq-jt"><b>{j.title}</b><Swap className="dm-rq-js">{[j.agent, note].filter(Boolean).join(' · ')}</Swap></span>
          <span className="dm-rq-jm dm-num">
            {j.time && <span>{j.time}</span>}
            {j.state === 'done' && <span className="dm-ok"><Icon name="check" size="xs" /></span>}
          </span>
        </div>
        <div className="dm-rq-jb" aria-hidden="true">
          <div className="dm-rq-bar"><i style={{ '--dm-p': p } as CSSProperties} /></div>
          <span className="dm-rq-pc dm-num">{Math.round(p * 100)}%</span>
        </div>
        <Fold open={dens === 'detailed' && live(j.state) && !!j.steps?.length} className="dm-rq-sf">
          <ul className="dm-rq-steps">
            {j.steps?.map((x, si) => (
              <li key={si} className={cx('dm-rq-sp', x.state === 'queued' ? 'dm-wait' : x.state === 'running' ? 'dm-run' : x.state === 'failed' ? 'dm-fail' : 'dm-done')}>
                <span className="dm-g"><StepGlyph state={x.state} /></span>
                <span>{x.label}</span>
                <span className="dm-m">
                  {x.state === 'failed' && onRetry
                    ? <button type="button" className="dm-rq-retry dm-enter" onClick={() => onRetry(ji, si)}>Retry</button>
                    : x.state === 'done' && x.meta ? <Swap>{x.meta}</Swap> : null}
                </span>
              </li>
            ))}
          </ul>
        </Fold>
      </li>
    );
  };
  const of = (ps: string) => jobs.map((j, ji) => part(j.state) === ps ? row(j, ji) : null);
  const waiting = jobs.some(j => part(j.state) === 'next');

  return (
    <div ref={box} data-dm="" className={cx('dm-rq', !bare && 'dm-panel dm-keep', fin && 'dm-fin', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-rq-h">
        <div className="dm-rq-ht"><b>{title}</b><Swap className="dm-rq-st dm-num">{line}</Swap></div>
        <Seg label="Density" value={dens} onChange={setDens} options={[{ value: 'detailed', label: 'Detailed' }, { value: 'compact', label: 'Compact' }]} />
      </div>
      <div className="dm-rq-tot" aria-hidden="true">
        {jobs.map(j => <i key={keyOf(j)} className={cx(j.state === 'failed' && 'dm-fail')}><b style={{ '--dm-p': Math.max(0, Math.min(1, share(j))) } as CSSProperties} /></i>)}
      </div>
      <div className="dm-rq-b">
        <Fold open={fin} className="dm-rq-ff">
          <div className="dm-rq-sec">
            <div className={cx('dm-rq-fin', fin && 'dm-enter')}>
              <span className="dm-rq-av" aria-hidden="true"><Icon name="ok" /></span>
              <span className="dm-rq-jt"><b className="dm-rq-ft">{`All ${jobs.length} jobs done`}</b>{summary && <span className="dm-rq-js">{summary}</span>}</span>
            </div>
          </div>
        </Fold>
        <Fold open={!fin} className="dm-rq-rf">
          <div className="dm-rq-sec"><span className="dm-rq-l">Running</span><ul className="dm-rq-run" aria-label="Running">{of('run')}</ul></div>
        </Fold>
        <Fold open={!fin} className="dm-rq-nf">
          <div className="dm-rq-sec"><span className="dm-rq-l">Up next</span><ol className="dm-rq-next" aria-label="Up next">{waiting ? of('next') : null}</ol><p className="dm-rq-none">Nothing waiting</p></div>
        </Fold>
        <Fold open className="dm-rq-df">
          <div className="dm-rq-sec"><span className="dm-rq-l">Done <span className="dm-num">{done}</span></span><ul className="dm-rq-done" aria-label="Done">{done ? of('done') : null}</ul><p className="dm-rq-none">Nothing done yet</p></div>
        </Fold>
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
- [Trace view](https://designme.dev/components/trace-view.md): One agent run as a waterfall of spans, with latency and tokens.
- [Browser session](https://designme.dev/components/browser-session.md): The agent browsing for you, step by step, with Pause and Take over.
- [Web search](https://designme.dev/components/web-search.md): The agent's searches as a trail: what it asked, what came back, what it read or skipped, and the answer with its sources.
- [Agent phases](https://designme.dev/components/agent-phases.md): One line for which phase the agent is in, from thinking to done, that stops to ask you, says when it is slow, and folds to how long it took.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.
- [Thinking states](https://designme.dev/components/thinking-states.md): Six thinking indicators to pick from, each with a status line.

All components: https://designme.dev/llms.txt
