# Thinking

> The live trace, written as the agent works, then folded away.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/thinking

## Install

```sh
npx designme add thinking          # HTML, CSS and JS, with the shared core
npx designme add thinking --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Thinking is the live trace an agent writes while it works: a plain list of the steps it takes, each with what it found. A step that runs into a problem shows it in amber while it waits and tries again. When the work is done, the header says what it came to and the trace folds away, one click from opening again.

### When to use it

- When an agent works for more than a few seconds and people want to see what it is doing rather than a spinner.
- When each step has a result worth reading, like how many frames it opened or which cards failed a check.
- When a step can hit a timeout or a rate limit and the agent waits it out instead of failing.
- When the trace should step aside once the answer is ready but stay one click away.

### What it does

- Each step has a `label`, a `state` and an optional `result`. Running steps spin and shimmer, `retry` shows a clock in amber while the step waits on a problem, and `done` turns into a check.
- A step's `result` opens under it and crossfades when it changes, so a countdown like "Trying again in 2s" updates in place. `resultTip` adds more detail on hover.
- The header shows `title` while it runs, like "Checking the pricing page", and a clock that counts by itself unless you pass `seconds`.
- When `running` turns false, the header becomes `summary`, like "3 cards to fix, 2 changes planned", with a check. With `collapseWhenDone` on, the default, the trace folds away a moment later.
- The header toggles the trace open and shut, and `open`, `defaultOpen` and `onOpenChange` let you control it.

### Accessibility

- The header is a button with `aria-expanded`, so screen readers hear whether the trace is open.
- The list of steps is an `aria-live="polite"` region, so new steps and their results are announced as they arrive.
- With `prefers-reduced-motion: reduce`, the spinner, shimmer and crossfades stop and changes appear at once.

## Usage in React

```tsx
import { Thinking } from '@/components/designme/thinking/Thinking';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { Thinking, type ThinkingStep } from './Thinking';
import { useScript, useStory } from '../lib/useScript';

/* ---------- Thinking: each step and what it found; measuring the cards times out once and tries again; then it folds away ---------- */
export const PRICING_STEPS: { label: string; result: string; ms: number; retry?: string; tip?: string }[] = [
  { label: 'Open Pricing v4 in Figma', result: '6 frames, 3 plan cards', ms: 1300 },
  { label: 'Read the spacing tokens', result: 'tokens.css, 9 spacing values', ms: 1200 },
  { label: 'Measure the plan cards', result: '3 cards are off the 8px grid', ms: 1400, retry: "Figma didn't answer", tip: 'Pro has an 18px gap, Team 22px and Enterprise 13px' },
  { label: 'Check text contrast', result: 'All 14 text pairs pass AA', ms: 1100 },
  { label: 'Plan the fix', result: '2 changes, about 3 minutes', ms: 1200 }
];

export default function ThinkingDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [steps, setSteps] = useState<ThinkingStep[]>([]);
  const [running, setRunning] = useState(true);
  const [open, setOpen] = useState(true);
  useScript(async ({ wait }) => {
    await wait(600);
    const out: ThinkingStep[] = [];
    const show = () => setSteps(out.slice());
    for (const s of PRICING_STEPS) {
      out.push({ label: s.label, state: 'running' }); show();
      const at = out.length - 1;
      await wait(s.ms);
      if (s.retry) {
        for (let k = 2; k > 0; k--) { out[at] = { ...out[at], state: 'retry', result: `${s.retry}. Trying again in ${k}s` }; show(); await wait(1000); }
        out[at] = { ...out[at], state: 'running', result: 'Trying again' }; show(); await wait(900);
      }
      out[at] = { ...out[at], state: 'done', result: s.result, resultTip: s.tip }; show();
    }
    await wait(500); setRunning(false);
  });
  // the preview's story: once it has folded, the person opens it again to read what the cards measured
  useStory(ref, async ({ wait }) => {
    await wait(16000); setOpen(true);
  });
  return <div ref={ref} style={{ width: '100%' }}><Thinking steps={steps} running={running} title="Checking the pricing page" summary="3 cards to fix, 2 changes planned" open={open} onOpenChange={setOpen} /></div>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `steps` | `ThinkingStep[]` |  |
| `running` | `boolean` | Spins, counts seconds and keeps the trace open while true |
| `seconds` (optional) | `number` | Seconds to show. Leave it out to let it count while running |
| `title` (optional) | `string` | The header while it runs, like "Checking the pricing page" |
| `summary` (optional) | `string` | The header once it is done: what the work came to, like "3 cards to fix, 2 changes planned". Defaults to the number of steps |
| `collapseWhenDone` (optional) | `boolean` | Folds the trace away a moment after it finishes |
| `open` (optional) | `boolean` | Whether the trace is open. Leave it out to let the header toggle it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I show a step that is waiting out a problem?**

Set its `state` to `'retry'` and put what it waits on in `result`, like "Figma didn't answer. Trying again in 2s". Update the result each second for a countdown, then set the state back to `'running'` and finally `'done'` with what it found.

**What does the header say when the work is done?**

Whatever you pass as `summary`, which should say what the work came to. Without it, the header says how many steps there were.

**Can I keep the trace open after it finishes?**

Yes. Set `collapseWhenDone` to false, or control it with `open` and `onOpenChange`.

## Source

`Thinking.tsx`, as `npx designme add thinking --react` installs it:

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion, useSeconds } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Fold, Spin, Swap, Think, Tip } from '../lib/motion';
import '../designme.css';
import './thinking.css';

export interface ThinkingStep {
  /** What the agent does, like "Measure the plan cards" */
  label: string;
  /** running spins and shimmers, retry waits out a problem in amber, done turns into a check */
  state: 'running' | 'retry' | 'done';
  /** What the step found, or what it waits on, under it: "3 cards are off the 8px grid". Opens and crossfades when it changes */
  result?: string;
  /** More detail shown when you hover the result, like the measured values */
  resultTip?: string;
}

export interface ThinkingProps {
  steps: ThinkingStep[];
  /** Spins, counts seconds and keeps the trace open while true */
  running: boolean;
  /** Seconds to show. Leave it out to let it count while running */
  seconds?: number;
  /** The header while it runs, like "Checking the pricing page" */
  title?: string;
  /** The header once it is done: what the work came to, like "3 cards to fix, 2 changes planned". Defaults to the number of steps */
  summary?: string;
  /** Folds the trace away a moment after it finishes */
  collapseWhenDone?: boolean;
  /** Whether the trace is open. Leave it out to let the header toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** A line that settles in place when its words change, sharpening out of a soft blur. While it shimmers it just takes the new words */
function Settle({ children, shimmer, className }: { children: string; shimmer: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef({ text: children, shimmer });
  const reduce = useReducedMotion();
  useIsoLayoutEffect(() => {
    const el = ref.current, was = prev.current; prev.current = { text: children, shimmer };
    if (!el) return;
    // the shimmer draws the words in a clear colour; going straight to the solid colour stops it fading in from nothing
    if (was.shimmer && !shimmer){ el.style.transition = 'none'; void el.offsetWidth; requestAnimationFrame(() => { el.style.transition = ''; }); }
    if (shimmer || reduce || was.text === children) return;
    const bp = getComputedStyle(el).getPropertyValue('--dm-motion').trim() === 'bp';
    el.animate(bp ? [{ opacity: .6 }, { opacity: 1 }] : [{ opacity: .6, filter: 'blur(1.5px)' }, { opacity: 1, filter: 'blur(0)' }],
      { duration: bp ? 220 : 460, easing: bp ? 'steps(3, end)' : 'cubic-bezier(.22,1,.36,1)' });
  }, [children, shimmer]);
  return <span ref={ref} className={cx(shimmer && 'dm-shim', className)}>{children}</span>;
}

function Mark({ state }: { state: ThinkingStep['state'] }) {
  if (state === 'running') return <Spin />;
  // keyed so each new mark plays its entrance once
  return <span key={state} className="dm-enter" style={{ display: 'grid' }}><Icon name={state === 'retry' ? 'clock' : 'check'} size="xs" /></span>;
}

/** The live trace: each step the agent takes and what it found, then a header that says what the work came to, folded away. */
export function Thinking({ steps, running, seconds, title = 'Working on it', summary, collapseWhenDone = true, open, defaultOpen = true, onOpenChange, className }: ThinkingProps) {
  const counted = useSeconds(running && seconds === undefined);
  const secs = seconds ?? counted;
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  // once it finishes, the trace waits a beat and folds itself away
  useEffect(() => {
    if (running || !collapseWhenDone || !steps.length) return;
    const t = setTimeout(() => setOpen(false), 2500);
    return () => clearTimeout(t);
  }, [running, collapseWhenDone, steps.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const done = !running && steps.length > 0;

  return (
    <div data-dm="" className={cx('dm-tk', className)} data-open={isOpen ? '1' : '0'}>
      <button type="button" className={cx('dm-tk-h', done && 'dm-tk-fin')} aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
        <span className="dm-tk-mark">{done ? <span key="ok" {...enter()} style={{ display: 'grid' }}><Icon name="ok" /></span> : <Think on={running} />}</span>
        <Settle className="dm-tk-title" shimmer={running}>{done ? summary ?? `${steps.length} ${steps.length === 1 ? 'step' : 'steps'}` : title}</Settle>
        <span className="dm-tk-time dm-num">{secs + 's'}</span>
        <Icon name="chev-d" size="xs" className="dm-tk-chev" />
      </button>
      <Fold open={isOpen} className="dm-tk-fold">
        <ol className="dm-tk-list" aria-live="polite">
          {steps.map((s, i) => (
            <li key={i} className={cx('dm-tk-st dm-enter', s.state === 'running' ? 'dm-run' : 'dm-' + s.state)}>
              <span className="dm-mk"><Mark state={s.state} /></span>
              <div className="dm-tx">
                <Settle className="dm-lab" shimmer={s.state === 'running'}>{s.label}</Settle>
                <span className={cx('dm-res', s.result && 'dm-on')}>
                  {s.result && s.resultTip ? <Tip label={s.resultTip}><span tabIndex={0} data-tip="">{s.result}</span></Tip> : <Swap>{s.result ?? ''}</Swap>}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </Fold>
    </div>
  );
}
```

## More in Agent status

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
- [Run queue](https://designme.dev/components/run-queue.md): Grouped tasks with live progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.

All components: https://designme.dev/llms.txt
