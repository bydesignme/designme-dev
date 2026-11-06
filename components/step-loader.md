# Step loader

> Named steps with a progress track and four loaders.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/step-loader

## Install

```sh
npx designme add step-loader          # HTML, CSS and JS, with the shared core
npx designme add step-loader --react  # React 19 component and its CSS
npx designme add step-loader --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/step-loader.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/step-loader.json  # Astro
```

## About

Step loader shows an agent task as a short list of named steps, with the current step's label, a count like 2/4 and a segmented progress track. Click the row to open the full list and see which steps are done and which are still to come.

### When to use it

- When an agent runs a known sequence, like reading frames, matching tokens and writing components.
- When people want one compact line by default, with the full list a click away.
- When finished steps should report what they did, such as "Read 4 frames" instead of "Reading Figma frames".
- When the end of a run should hand off with a clear label like "Ready for review".

### What it does

- Pass `steps` and a `current` index. Setting `current` to `steps.length` marks every step done and shows a check.
- Each step has a running `label` and an optional `done` text that replaces it once the step is finished.
- The row label and the count crossfade as the agent moves to the next step.
- `loader` picks the animation beside the running step: `radar`, `dots`, `ring` or `bars`.
- `doneLabel` sets the text once everything is finished, "Ready for review" by default.
- The step list can be left to toggle itself, or controlled with `open`, `defaultOpen` and `onOpenChange`.

### Accessibility

- The row is a button with `aria-expanded` that reflects whether the step list is open.
- The track has `role="progressbar"` with `aria-valuemin`, `aria-valuemax` and `aria-valuenow` set from the steps.
- When the list is closed it is `inert` and `aria-hidden`, so hidden steps are skipped by keyboard and screen readers.
- With reduced motion turned on, label swaps happen instantly and loader animations are cut short.

## Usage in React

```tsx
import { StepLoader } from '@/components/designme/step-loader/StepLoader';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { StepLoader, type StepLoaderGlyph } from './StepLoader';
import { Seg } from '../lib/motion';
import { Demo } from '../lib/Demo';
import { useScript } from '../lib/useScript';

/* ---------- Step loader: four named steps, looping ---------- */
const STEPS = [
  { label: 'Reading Figma frames', done: 'Read 4 frames' }, { label: 'Matching tokens', done: 'Matched 18 tokens' },
  { label: 'Writing components', done: 'Wrote 3 components' }, { label: 'Checking contrast', done: 'Contrast passes' }
];
export default function StepLoaderDemo() {
  const [loader, setLoader] = useState<StepLoaderGlyph>('radar');
  const [current, setCurrent] = useState(0);
  useScript(async ({ wait }) => {
    for (;;) {
      for (let i = 0; i < STEPS.length; i++) { setCurrent(i); await wait(1900); }
      setCurrent(STEPS.length); await wait(3200);
      setCurrent(0); await wait(700);
    }
  });
  return (
    <Demo switcher={<Seg label="Loader" value={loader} onChange={setLoader} options={[{ value: 'radar', label: 'Radar' }, { value: 'dots', label: 'Dots' }, { value: 'ring', label: 'Ring' }, { value: 'bars', label: 'Bars' }]} />}>
      <StepLoader steps={STEPS} current={current} loader={loader} />
    </Demo>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `steps` | `Step[]` |  |
| `current` | `number` | Index of the step running now. steps.length (or more) means every step is done |
| `loader` (optional) | `StepLoaderGlyph` | The loader beside the running step |
| `doneLabel` (optional) | `string` | Label once every step is done |
| `open` (optional) | `boolean` | Whether the list of every step is open. Leave it out to let the row toggle it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import StepLoader from '../components/designme/step-loader/StepLoader.astro';
---
<StepLoader />
<StepLoader data-style="soft" class="my-class" />
```
It plays its demo; change `step-loader.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I mark the whole run as finished?**

Set `current` to `steps.length` or higher. The loader becomes a green check, every step shows its `done` text and the row shows `doneLabel`.

**Can I open the step list from my own code?**

Yes. Pass `open` and update it from `onOpenChange` to control it. Leave `open` out and the row toggles the list by itself, starting from `defaultOpen`.

**Does the loader advance on its own?**

No. It shows whatever `current` you pass, so you move it forward as your agent reports each step.

## Source

`StepLoader.tsx`, as `npx designme add step-loader --react` installs it:

```tsx
'use client';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Bars, Dot, Fold, Radar, Spin, Swap, Think } from '../lib/motion';
import '../designme.css';
import './step-loader.css';

export interface Step {
  /** Shown while the step runs, like "Reading Figma frames" */
  label: string;
  /** Shown once it is done, like "Read 4 frames". Falls back to label */
  done?: string;
}

export type StepLoaderGlyph = 'radar' | 'dots' | 'ring' | 'bars';

export interface StepLoaderProps {
  steps: Step[];
  /** Index of the step running now. steps.length (or more) means every step is done */
  current: number;
  /** The loader beside the running step */
  loader?: StepLoaderGlyph;
  /** Label once every step is done */
  doneLabel?: string;
  /** Whether the list of every step is open. Leave it out to let the row toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const Loader = ({ kind }: { kind: StepLoaderGlyph }) =>
  kind === 'dots' ? <Think /> : kind === 'ring' ? <Spin /> : kind === 'bars' ? <Bars /> : <Radar />;

/** Named steps with a progress track. Click the row to see every step. */
export function StepLoader({ steps, current, loader = 'radar', doneLabel = 'Ready for review', open, defaultOpen = false, onOpenChange, className }: StepLoaderProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const n = steps.length, done = current >= n, at = Math.min(current, n - 1);
  return (
    <div data-dm="" className={cx('dm-stl', className)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <button type="button" className="dm-stl-row" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
        <span className="dm-stl-g">{done ? <span style={{ color: 'var(--dm-ok)', display: 'grid' }}><Icon name="ok" /></span> : <Loader kind={loader} />}</span>
        <span className="dm-stl-t"><Swap className={cx('dm-stl-lab', !done && 'dm-shim')}>{done ? doneLabel : steps[at].label}</Swap></span>
        <Swap className="dm-stl-n dm-num">{`${done ? n : at + 1}/${n}`}</Swap>
        <Icon name="chev-d" size="xs" className="dm-stl-chev" />
      </button>
      <div className="dm-stl-track" role="progressbar" aria-valuemin={0} aria-valuemax={n} aria-valuenow={done ? n : at}>
        {steps.map((_, i) => <i key={i} className={cx((done || i < current) && 'dm-on', !done && i === current && 'dm-run')} />)}
      </div>
      <Fold open={isOpen} className="dm-stl-fold">
        <ol className="dm-stl-list">
          {steps.map((s, i) => {
            const finished = done || i < current, running = !done && i === current;
            return (
              <li key={i} className={cx(finished && 'dm-done', running && 'dm-run')}>
                <span className="dm-g">{finished ? <span style={{ color: 'var(--dm-ok)', display: 'grid' }}><Icon name="check" size="xs" /></span> : running ? <Loader kind={loader} /> : <Dot color="var(--dm-faint)" />}</span>
                {finished ? s.done ?? s.label : s.label}
              </li>
            );
          })}
        </ol>
      </Fold>
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
- [Run queue](https://designme.dev/components/run-queue.md): Agent jobs running, up next and done, with progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Thinking states](https://designme.dev/components/thinking-states.md): Six thinking indicators to pick from, each with a status line.

All components: https://designme.dev/llms.txt
