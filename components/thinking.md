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

Thinking shows an agent's reasoning as a live list of steps while it works, under a header that reads "Thinking" and counts the seconds. When the agent finishes, the header changes to "Thought for Ns" and the trace folds away, a click away for anyone who wants to read it.

### When to use it

- When your agent takes several seconds before it answers and people should see that it is making progress.
- When you want to show which files and pages the agent read on the way.
- When dead ends are worth showing, so people understand why the agent took the path it did.
- When the reasoning should stay available after the answer without taking up room.

### What it does

- Each step has a `label` and a `state`. Running steps shimmer and their label can change in place, like "Reading 2 of 6". Done steps settle, and dead steps get a cross for a path that went nowhere.
- A finished step keeps a dot, a search glass or a hollow ring, set with `mark`, and `sub` indents a step under the one before it.
- Steps can show `sources` as file and link chips, with extra ones behind a "+N more" chip that lists them in its tooltip.
- While `running` is true, the header shimmers and counts seconds, unless you pass `seconds`.
- Once it stops running, `summary` adds a "Finished thinking" line, and with `collapseWhenDone` on (the default) the trace folds itself away about two seconds later.
- Clicking the header opens and closes the trace, and `open`, `defaultOpen` and `onOpenChange` let you control it.

### Accessibility

- The header is a button with `aria-expanded`.
- The step list is an `aria-live="polite"` region, so new steps are announced as they arrive.
- When folded, the trace is `inert` and `aria-hidden`.
- With `prefers-reduced-motion: reduce`, step labels change without the blur animation and other motion is cut to near zero.

## Usage in React

```tsx
import { Thinking } from '@/components/designme/thinking/Thinking';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { Thinking, type ThinkingStep } from './Thinking';
import { useScript } from '../lib/useScript';

/* ---------- Thinking: the trace is written step by step, then folds away ---------- */
type Plan = Omit<ThinkingStep, 'state' | 'label'> & { run: string; done: string; dead?: boolean; count?: number; ms: number };
const THOUGHTS: Plan[] = [
  { mark: 'search', run: 'Searching the design system', done: 'Searched the design system', ms: 1600,
    sources: [{ label: 'Pricing.fig', kind: 'figma', tip: 'Figma, 6 frames read' }, { label: 'tokens.ts', kind: 'ts', tip: 'src/styles/tokens.ts, 212 lines' }, { label: 'PricingCard.tsx', kind: 'tsx', tip: 'src/components/PricingCard.tsx' }, { label: 'Contrast guide', kind: 'web', tip: 'w3.org, WCAG 2.2 contrast' }],
    moreSources: [{ label: 'Button.tsx', kind: 'tsx', tip: 'src/components/Button.tsx' }, { label: 'globals.css', kind: 'css', tip: 'src/styles/globals.css' }] },
  { run: 'Reading 1 of 6 frames', done: 'Read 6 frames from Pricing.fig', count: 6, ms: 1500 },
  { run: 'Checking if the old grid is in the tokens', done: "Dead end: the old grid isn't in tokens.ts", dead: true, ms: 1400 },
  { run: 'Mapping every spacing value', done: 'Mapped 9 spacing values', ms: 1300 },
  { run: 'Comparing desktop and mobile', done: 'Compared desktop and mobile', sub: true, ms: 1100 },
  { run: 'Finding values off the 8px grid', done: '3 values break the 8px grid', sub: true, ms: 1000 },
  { run: 'Merging both breakpoints', done: 'Merged both breakpoints', mark: 'hollow', ms: 1000 },
  { run: 'Spotting cards that need a fix', done: 'Found 3 cards to fix', ms: 1200 },
  { run: 'Drafting the fix', done: 'Drafted a 2-step fix', ms: 1300 }
];
export default function ThinkingDemo() {
  const [steps, setSteps] = useState<ThinkingStep[]>([]);
  const [running, setRunning] = useState(true);
  useScript(async ({ wait }) => {
    await wait(800);
    const out: ThinkingStep[] = [];
    const show = () => setSteps(out.slice());
    for (const t of THOUGHTS) {
      const { run, done, dead, count, ms, ...rest } = t;
      out.push({ ...rest, label: run, state: 'running', sources: undefined, moreSources: undefined }); show();
      const at = out.length - 1;
      if (t.sources) { await wait(550); out[at] = { ...out[at], sources: t.sources, moreSources: t.moreSources }; show(); }
      if (count) for (let n = 2; n <= count; n++) { await wait(ms / count); out[at] = { ...out[at], label: `Reading ${n} of ${count} frames` }; show(); }
      else await wait(ms);
      out[at] = { ...out[at], label: done, state: dead ? 'dead' : 'done' }; show();
    }
    await wait(500); setRunning(false);
  });
  // keeps the room the steps will fill while it runs, so the header stays put as they arrive; folding gives it back
  return <div style={{ width: '100%', minHeight: running ? 444 : 0 }}><Thinking steps={steps} running={running} summary="3 cards to fix · 2 steps" /></div>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `steps` | `ThinkingStep[]` |  |
| `running` | `boolean` | Shimmers, counts seconds and keeps the trace open while true |
| `seconds` (optional) | `number` | Seconds to show. Leave it out to let it count while running |
| `summary` (optional) | `string` | A last line once thinking is done, like "3 cards to fix · 2 steps" |
| `collapseWhenDone` (optional) | `boolean` | Folds the trace away a moment after it finishes |
| `open` (optional) | `boolean` | Whether the trace is open. Leave it out to let the header toggle it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I update a step while it is still running?**

Keep the steps in state and replace the running step's `label`, for example with a count. While it shimmers, the new words simply replace the old ones. When you set `state` to 'done', the final label settles in with a short sharpen.

**Can I keep the trace open after the agent finishes?**

Yes. Set `collapseWhenDone={false}`, or control `open` yourself.

**How is this different from the reasoning trail?**

Thinking is the live view while the agent works and folds away when it is done. Reasoning trail lays out the plan, notes, sources and edits after the agent has finished.

## Source

`Thinking.tsx`, as `npx designme add thinking --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion, useSeconds } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Fold, Pulse, SourceChip, Think, Tip, type Source } from '../lib/motion';
import '../designme.css';
import './thinking.css';

export interface ThinkingStep {
  /** What the agent is doing, then what it did. While it runs it changes in place under the shimmer; when the step finishes it settles */
  label: string;
  /** running shimmers, done settles, dead marks a path that went nowhere */
  state: 'running' | 'done' | 'dead';
  /** The mark a finished step keeps: a dot (default), a search glass, or a hollow ring */
  mark?: 'dot' | 'search' | 'hollow';
  /** Indents the step under the one before it */
  sub?: boolean;
  /** Files or pages this step read, shown as chips */
  sources?: Source[];
  /** Sources hidden behind a "+N more" chip */
  moreSources?: Source[];
}

export interface ThinkingProps {
  steps: ThinkingStep[];
  /** Shimmers, counts seconds and keeps the trace open while true */
  running: boolean;
  /** Seconds to show. Leave it out to let it count while running */
  seconds?: number;
  /** A last line once thinking is done, like "3 cards to fix · 2 steps" */
  summary?: string;
  /** Folds the trace away a moment after it finishes */
  collapseWhenDone?: boolean;
  /** Whether the trace is open. Leave it out to let the header toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function Chips({ sources, more }: { sources: Source[]; more?: Source[] }) {
  const [all, setAll] = useState(false);
  return (
    <div className="dm-tk-chips">
      {sources.map((s, i) => <SourceChip key={i} source={s} {...enter(i * 80)} />)}
      {more?.length ? (all
        ? more.map((s, i) => <SourceChip key={'m' + i} source={s} />)
        : <Tip label={more.map(s => s.label).join(', ')}><button type="button" className="dm-tk-more" onClick={() => setAll(true)}>+{more.length} more</button></Tip>) : null}
    </div>
  );
}

function Mark({ step }: { step: ThinkingStep }) {
  if (step.state === 'running') return <Pulse />;
  // keyed so the finished mark plays its entrance once
  if (step.state === 'dead') return <span key="dead" className="dm-enter" style={{ display: 'grid' }}><Icon name="x" size="xs" /></span>;
  if (step.mark === 'search') return <span key="search" className="dm-enter" style={{ display: 'grid' }}><Icon name="search" size="xs" /></span>;
  if (step.mark === 'hollow') return <span key="hollow" className="dm-ring dm-enter" />;
  return <span key="dot" className="dm-dot dm-enter" />;
}

/** The live trace, written as the agent works, then folded away. */
/** A line that settles in place when its words change, sharpening out of a soft blur, never fading to nothing and back.
 *  While it shimmers (still running) it just takes the new words, so a count like "Reading 2 of 6" doesn't blink */
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

export function Thinking({ steps, running, seconds, summary, collapseWhenDone = true, open, defaultOpen = true, onOpenChange, className }: ThinkingProps) {
  const counted = useSeconds(running && seconds === undefined);
  const secs = seconds ?? counted;
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  // once it finishes, the trace waits a beat and folds itself away
  useEffect(() => {
    if (running || !collapseWhenDone || !steps.length) return;
    const t = setTimeout(() => setOpen(false), 2200);
    return () => clearTimeout(t);
  }, [running, collapseWhenDone, steps.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const fin = !running && summary !== undefined;

  return (
    <div data-dm="" className={cx('dm-tk', className)} data-open={isOpen ? '1' : '0'}>
      <button type="button" className="dm-tk-h" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
        <span className="dm-tk-mark"><Think on={running} /></span>
        <Settle className="dm-tk-title" shimmer={running}>{running ? 'Thinking' : `Thought for ${Math.max(secs, 1)}s`}</Settle>
        <span className="dm-tk-time dm-num">{running ? secs + 's' : ''}</span>
        <Icon name="chev-d" size="xs" className="dm-tk-chev" />
      </button>
      <Fold open={isOpen} className="dm-tk-fold">
        <ol className="dm-tk-list" aria-live="polite">
          {steps.map((s, i) => (
            <li key={i} className={cx('dm-tk-st dm-enter', s.state === 'running' && 'dm-run', s.sub && 'dm-sub', s.state === 'dead' && 'dm-dead')}>
              {s.sub && <span className="dm-curve" />}
              <span className="dm-mk"><Mark step={s} /></span>
              <span className={cx('dm-rl', (i < steps.length - 1 || fin) && 'dm-on')} />
              <div className="dm-tx">
                <Settle className="dm-lab" shimmer={s.state === 'running'}>{s.label}</Settle>
                {s.sources?.length ? <Chips sources={s.sources} more={s.moreSources} /> : null}
              </div>
            </li>
          ))}
          {fin && (
            <li className="dm-tk-st dm-tk-fin dm-enter">
              <span className="dm-mk"><Icon name="ok" /></span>
              <div className="dm-tx"><span><span className="dm-lab">Finished thinking</span>{summary && <span className="dm-sum">{summary}</span>}</span></div>
            </li>
          )}
        </ol>
      </Fold>
    </div>
  );
}
```

## More in Agent status

- [Reasoning trail](https://designme.dev/components/reasoning-trail.md): The agent's plan, notes, sources and edits, after it thinks.
- [Agent lanes](https://designme.dev/components/agent-lanes.md): Several agents working in parallel, each with its own lane and hand-offs.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context window is, with session and weekly limits, in one small popover.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Grouped tasks with live progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.

All components: https://designme.dev/llms.txt
