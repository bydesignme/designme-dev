# Error and recovery

> A failed step with retry, skip or hand over to a person.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/error-recovery

## Install

```sh
npx designme add error-recovery          # HTML, CSS and JS, with the shared core
npx designme add error-recovery --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Error recovery shows an agent run that stopped on a failed step, with the steps before and after it and the error underneath. Below the steps, the person chooses how the agent should carry on, such as retry, skip the step or hand it to a colleague, and presses Continue.

### When to use it

- When an agent hits an error it can't fix by itself, like a lost permission or a missing file, and needs a decision.
- When you want the person to see what already worked before choosing what to do about what failed.
- When a failure can go to a teammate instead of stopping the whole run.

### What it does

- Each step has a `state`: done, fail (with a red alert and note), run (spinner), wait (not started), skip (struck through) or hand (passed to a person).
- A step's `note` sits under it, like "Done in 8s" or the error message, and crossfades when it changes. The glyph plays a short entrance each time the state changes.
- The header shows the run's `title` and a `status` line, like "Stopped at step 2", that crossfades as you update it.
- `options` are shown as single-choice rows under `question`. The first one is picked by default, or you control the choice with `value` and `onValueChange`.
- Continue calls `onContinue` with the chosen value and folds the choices away. `continueLabel` renames the button, and `open` lets you keep the choices in view.

### Accessibility

- The choices are a `role="radiogroup"` labelled by the question, and each option is a `role="radio"` with `aria-checked`.
- Once folded away, the choices are `inert` and `aria-hidden`.

## Usage in React

```tsx
import { ErrorRecovery } from '@/components/designme/error-recovery/ErrorRecovery';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { ErrorRecovery, type RecoveryStep } from './ErrorRecovery';
import { useScript } from '../lib/useScript';

/* ---------- Error and recovery: step 2 failed; pick how to carry on and the run plays it out ---------- */
const OPTIONS = [
  { value: 'retry', label: 'Ask for edit access, then retry' },
  { value: 'skip', label: 'Skip it and post the summary' },
  { value: 'hand', label: 'Hand it over to Maya' }
];
export default function ErrorRecoveryDemo() {
  const [steps, setSteps] = useState<RecoveryStep[]>([
    { label: 'Pull 1,240 deals from the CRM', state: 'done', note: 'Done in 8s' },
    { label: 'Write to the Pipeline 2026 sheet', state: 'fail', note: 'Error 403: the agent lost edit access to this sheet' },
    { label: 'Post the summary in #sales', state: 'wait' }
  ]);
  const [status, setStatus] = useState('Stopped at step 2');
  const [choice, setChoice] = useState<string | null>(null);
  const set = (i: number, state: RecoveryStep['state'], note?: string) => setSteps(s => s.map((x, k) => k === i ? { ...x, state, note } : x));
  // plays out the chosen recovery once Continue is pressed
  useScript(async ({ wait }) => {
    if (choice === 'retry') {
      set(1, 'run', 'Asking for edit access'); setStatus('Recovering'); await wait(1200);
      set(1, 'run', 'Access granted, retrying'); await wait(1000);
      set(1, 'done', 'Wrote 1,240 rows'); set(2, 'run'); await wait(1000);
      set(2, 'done', 'Posted to 14 people'); setStatus('Recovered');
    } else if (choice === 'skip') {
      set(1, 'skip', 'Skipped, nothing was written'); set(2, 'run'); await wait(1000);
      set(2, 'done', 'Posted, with a note about the sheet'); setStatus('2 of 3 done');
    } else if (choice === 'hand') {
      set(1, 'hand', 'Maya has the error, the logs and the last good state'); setStatus('Waiting on Maya');
    }
  }, [choice]);
  return (
    <div style={{ width: '100%' }}>
      <ErrorRecovery title="Sync the pipeline to Sheets" status={status} steps={steps} options={OPTIONS} onContinue={setChoice} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | What the agent was doing, like "Sync the pipeline to Sheets" |
| `status` (optional) | `string` | Where the run stands, like "Stopped at step 2". Crossfades when it changes |
| `steps` | `RecoveryStep[]` |  |
| `question` (optional) | `string` | The question above the choices |
| `options` | `RecoveryOption[]` | The ways the agent can carry on |
| `value` (optional) | `string` | The chosen option. Leave it out to let the choices hold their own selection |
| `defaultValue` (optional) | `string` | Defaults to the first option |
| `onValueChange` (optional) | `(value: string) => void` |  |
| `onContinue` (optional) | `(value: string) => void` | Called with the chosen option when Continue is pressed |
| `continueLabel` (optional) | `string` |  |
| `open` (optional) | `boolean` | Whether the choices show. Leave it out and they fold away once Continue is pressed |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Questions

**What happens after the person presses Continue?**

The choices fold away and `onContinue` gets the chosen option's value. Your code carries on the run and updates the steps, for example setting the failed step to 'run', then 'done', or to 'skip' or 'hand'.

**Can I offer my own recovery options?**

Yes. `options` is a list of `{ value, label }`, so you can offer any choices that fit the error, like asking for access first and then retrying.

**How do I show that a step went to a person?**

Set its `state` to 'hand' and use `note` to say who has it and what they got, for example the error and the logs.

## Source

`ErrorRecovery.tsx`, as `npx designme add error-recovery --react` installs it:

```tsx
'use client';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Dot, Fold, Spin, Swap } from '../lib/motion';
import '../designme.css';
import './error-recovery.css';

export type RecoveryStepState = 'done' | 'fail' | 'run' | 'wait' | 'skip' | 'hand';

export interface RecoveryStep {
  label: string;
  /** done, fail (red note), run (spinner), wait (not started), skip (struck through) or hand (passed to a person) */
  state: RecoveryStepState;
  /** The quiet line under the step, like "Done in 8s" or the error. Crossfades when it changes */
  note?: string;
}

export interface RecoveryOption {
  value: string;
  label: string;
}

export interface ErrorRecoveryProps {
  /** What the agent was doing, like "Sync the pipeline to Sheets" */
  title: string;
  /** Where the run stands, like "Stopped at step 2". Crossfades when it changes */
  status?: string;
  steps: RecoveryStep[];
  /** The question above the choices */
  question?: string;
  /** The ways the agent can carry on */
  options: RecoveryOption[];
  /** The chosen option. Leave it out to let the choices hold their own selection */
  value?: string;
  /** Defaults to the first option */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the chosen option when Continue is pressed */
  onContinue?: (value: string) => void;
  continueLabel?: string;
  /** Whether the choices show. Leave it out and they fold away once Continue is pressed */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

function Glyph({ state }: { state: RecoveryStepState }) {
  if (state === 'done') return <span style={{ color: 'var(--dm-ok)' }}><Icon name="check" size="xs" /></span>;
  if (state === 'fail') return <span style={{ color: 'var(--dm-bad)' }}><Icon name="alert" size="xs" /></span>;
  if (state === 'run') return <Spin />;
  if (state === 'skip') return <span className="dm-muted"><Icon name="chev-r" size="xs" /></span>;
  if (state === 'hand') return <span style={{ color: 'var(--dm-pl)' }}><Icon name="user" size="xs" /></span>;
  return <Dot color="var(--dm-faint)" />;
}

/** A run that hit an error, with the steps around it and a choice of how the agent should carry on. */
export function ErrorRecovery({ title, status, steps, question = 'How should the agent continue?', options, value, defaultValue, onValueChange, onContinue, continueLabel = 'Continue', open, defaultOpen = true, onOpenChange, bare = true, className }: ErrorRecoveryProps) {
  const [pick, setPick] = useControllable(value, defaultValue ?? options[0]?.value ?? '', onValueChange);
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);

  return (
    <div data-dm="" className={cx('dm-erx', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-erx-h">
        <span className="dm-erx-t">{title}</span>
        {status !== undefined && <Swap className="dm-erx-s dm-muted">{status}</Swap>}
      </div>
      <div className="dm-erx-list">
        {steps.map((s, i) => (
          <div key={i} className={cx('dm-erx-row', 'dm-' + s.state)}>
            {/* keyed by state and note, so a new state plays its entrance like the site does */}
            <span className="dm-g"><span key={s.state + '\u0000' + (s.note ?? '')} className="dm-enter" style={{ display: 'grid' }}><Glyph state={s.state} /></span></span>
            <span className="dm-tx">{s.label}<Swap className="dm-d">{s.note ?? ''}</Swap></span>
          </div>
        ))}
      </div>
      <Fold open={isOpen} className="dm-erx-box">
        <div className="dm-erx-in">
          <div className="dm-erx-q">{question}</div>
          <div className="dm-erx-opts" role="radiogroup" aria-label={question}>
            {options.map(o => (
              <button type="button" key={o.value} className={cx('dm-erx-o', o.value === pick && 'dm-on')} role="radio" aria-checked={o.value === pick} onClick={() => setPick(o.value)}>
                <i /><span>{o.label}</span>
              </button>
            ))}
          </div>
          <button type="button" className="dm-pill dm-ink dm-sm dm-erx-go" onClick={() => { setOpen(false); onContinue?.(pick); }}>{continueLabel}</button>
        </div>
      </Fold>
    </div>
  );
}
```

## More in Agent status

- [Thinking](https://designme.dev/components/thinking.md): The live trace, written as the agent works, then folded away.
- [Reasoning trail](https://designme.dev/components/reasoning-trail.md): The agent's plan, notes, sources and edits, after it thinks.
- [Agent lanes](https://designme.dev/components/agent-lanes.md): Several agents working in parallel, each with its own lane and hand-offs.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Run queue](https://designme.dev/components/run-queue.md): Grouped tasks with live progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.

All components: https://designme.dev/llms.txt
