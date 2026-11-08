# Progress and meter

> An agent run's progress and what it costs, with a credits meter that warns as it fills.

App basics / Forms and inputs. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/progress

## Install

```sh
npx designme add progress          # HTML, CSS and JS, with the shared core
npx designme add progress --react  # React 19 component and its CSS
npx designme add progress --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/progress.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/progress.json  # Astro
```

## About

One run shown three ways, plus a meter. A ring gives the whole run as a percentage, a row of segments gives the steps (step 3 of 5), and a bar gives how far the step in hand is, with its count in words. The run can be indeterminate while it works out how much there is, running, paused, failed with Retry, or done. Under it, a credits meter fills and warns in words at 75% (Running low) and more strongly at 90%.

### When to use it

- For an agent run whose length you only know once it has started: show it indeterminate first, then switch to the real numbers.
- When a run has named steps and each step has its own count, like pages fetched or files indexed.
- Beside a run that spends a budget, so people see the budget fill and get warned before it runs out.

### What it does

- Five states: indeterminate (the ring turns a short arc and the bar sweeps), running (the accent), paused (grey), error (red, with the error over the bar and a Retry button) and complete (green, with a check in the ring).
- A line under the title in plain words, such as "Step 3 of 5, indexing files" or "Paused at step 3 of 5"; pass `valueText` for your own.
- A status tag (Starting, Running, Paused, Failed, Done) and one button beside it: Pause while running, Resume while paused, Run again once complete when `onRestart` is set.
- The step's count over its bar, like "1,240 of 2,000", from each step's `unit` and `total`.
- An optional `meter` with two thresholds, drawn as notches through the bar: from `warnAt` (75%) its bar turns orange and a Running low tag appears, from `dangerAt` (90%) it turns red and says `dangerLabel`.
- The line over the bar and the button keep their place in every state, so the component never changes height as the run goes on.

### Accessibility

- The ring, the segments and the bar each have role="progressbar" with an aria-valuetext in words ("62% of the run", "Step 3 of 5", "1,240 of 2,000 files"); while indeterminate they have no value.
- The meter has role="meter", with its value and its warning in aria-valuetext ("9,280 of 10,000 credits, almost out").
- A polite live region announces only changes of state (Paused, Step 4 failed, Done), never every percent.
- The warnings are words in a tag, not only a colour.
- With reduced motion the ring stops turning and the indeterminate bar shows as a still, faint fill.

## Usage in React

```tsx
import { Progress } from '@/components/designme/progress/Progress';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: a run starts, its steps fill, the fourth step
// times out and is retried, while the credits meter crosses 75% and then 90%.
import { useEffect, useRef, useState } from 'react';
import { Progress, type ProgressState, type ProgressStep } from './Progress';
import { useStory, useWait } from '../lib/useScript';

const STEPS: ProgressStep[] = [
  { label: 'Reading the sitemap', unit: 'Pages', total: 48 }, { label: 'Fetching pages', unit: 'Pages', total: 48 },
  { label: 'Indexing files', unit: 'Files', total: 2000 }, { label: 'Writing embeddings', unit: 'Chunks', total: 6400 }, { label: 'Checking links', unit: 'Links', total: 310 }
];

export default function ProgressDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ProgressState>('indeterminate');
  const [step, setStep] = useState(0);
  const [sub, setSub] = useState(0);
  const [credits, setCredits] = useState(7000);
  const live = useRef(state); live.current = state;
  const run = useRef(0);
  // the agent's run goes on whatever the visitor does; only the person in the preview (the Retry press) stops when they take over
  const wait = useWait();
  const go = async () => {
    const id = ++run.current;
    setState('indeterminate'); setStep(0); setSub(0); setCredits(7000);
    await wait(1800); if (id !== run.current) return;
    setState('running');
    let failed = false;
    for (let s = 0; s < STEPS.length; s++) {
      setStep(s); setSub(0);
      for (let k = 1; k <= 12; k++) {
        await wait(150);
        while (live.current === 'paused') await wait(100);
        if (id !== run.current) return;
        if (s === 3 && k === 6 && !failed) {
          failed = true; setState('error');
          while (live.current === 'error') await wait(100);
          await wait(400);
        }
        setSub(k / 12); setCredits(c => c + 38);
      }
    }
    setState('complete');
  };
  useEffect(() => { void go(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // the person in the preview retries the failed step; an agent at work keeps working under the pointer
  useStory(ref, async ({ wait, press }) => {
    while (live.current !== 'error') await wait(100);
    await wait(1500); press('.dm-prg-ll .dm-pill');
  }, { hold: false });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <Progress title="Indexing the docs" state={state} steps={STEPS} step={step} stepProgress={sub} error="The embeddings service timed out"
        valueText={state === 'complete' ? 'Indexed 2,000 files' : undefined}
        onPause={() => setState('paused')} onResume={() => setState('running')} onRetry={() => setState('running')} onRestart={() => { void go(); }}
        meter={{ label: 'Credits this month', value: credits, max: 10000, unit: 'credits', note: 'Resets Dec 1', dangerLabel: 'Almost out' }} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | Like "Indexing the docs" |
| `state` | `ProgressState` | indeterminate: the ring turns and the bar sweeps; running: the accent; paused: grey; error: red with Retry; complete: green |
| `steps` | `ProgressStep[]` |  |
| `step` | `number` | The step in hand, from 0 |
| `stepProgress` | `number` | How far the step in hand is, 0 to 1 |
| `valueText` (optional) | `string` | The line under the title. Defaults to "Step 3 of 5, indexing files" and the like |
| `error` (optional) | `string` | What failed, shown over the bar with a Retry button while `state` is "error" |
| `onPause` (optional) | `() => void` |  |
| `onResume` (optional) | `() => void` |  |
| `onRetry` (optional) | `() => void` |  |
| `onRestart` (optional) | `() => void` | Adds a Run again button once complete |
| `meter` (optional) | `ProgressMeter` | A meter under the run, with thresholds that warn in words |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import Progress from '../components/designme/progress/Progress.astro';
---
<Progress />
<Progress data-style="soft" class="my-class" />
```
It plays its demo; change `progress.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I show a run I can't measure yet?**

Set `state` to "indeterminate". Switch it to "running" with `step` and `stepProgress` once you know how much there is.

**Can I use only the meter, or only the bar?**

The component always draws the run. For a meter on its own, leave the run out of your page and copy the meter's markup and its classes; they don't depend on the rest.

**How do I change where the meter warns?**

Pass `warnAt` and `dangerAt` as shares of `max`, for example 0.8 and 0.95. The notches move with them.

## Source

`Progress.tsx`, as `npx designme add progress --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { Icon } from '../lib/icons';
import { Swap, Tip } from '../lib/motion';
import '../designme.css';
import './progress.css';

export type ProgressState = 'indeterminate' | 'running' | 'paused' | 'error' | 'complete';

export interface ProgressStep {
  /** Like "Indexing files" */
  label: string;
  /** What the step counts, like "Files" */
  unit: string;
  /** How many there are to count, like 2000 */
  total: number;
}

export interface ProgressMeter {
  /** Like "Credits this month" */
  label: string;
  value: number;
  max: number;
  /** The unit in the meter's spoken value, like "credits" */
  unit?: string;
  /** Share of `max` where it says "Running low" (0.75) */
  warnAt?: number;
  /** Share of `max` where it warns more strongly (0.9) */
  dangerAt?: number;
  /** The words for the stronger warning ("Almost out") */
  dangerLabel?: string;
  /** Quiet text at the right under the meter, like "Resets Dec 1" */
  note?: string;
}

export interface ProgressProps {
  /** Like "Indexing the docs" */
  title: string;
  /** indeterminate: the ring turns and the bar sweeps; running: the accent; paused: grey; error: red with Retry; complete: green */
  state: ProgressState;
  steps: ProgressStep[];
  /** The step in hand, from 0 */
  step: number;
  /** How far the step in hand is, 0 to 1 */
  stepProgress: number;
  /** The line under the title. Defaults to "Step 3 of 5, indexing files" and the like */
  valueText?: string;
  /** What failed, shown over the bar with a Retry button while `state` is "error" */
  error?: string;
  onPause?: () => void;
  onResume?: () => void;
  onRetry?: () => void;
  /** Adds a Run again button once complete */
  onRestart?: () => void;
  /** A meter under the run, with thresholds that warn in words */
  meter?: ProgressMeter;
  className?: string;
}

const CODE: Record<ProgressState, string> = { indeterminate: 'ind', running: 'run', paused: 'paused', error: 'err', complete: 'done' };
const TAG: Record<ProgressState, [string, string]> = { indeterminate: ['Starting', ''], running: ['Running', 'dm-run'], paused: ['Paused', ''], error: ['Failed', 'dm-bad'], complete: ['Done', 'dm-ok'] };
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

/** A run's progress three ways (a ring for the whole run, segments for its steps, a bar for the step in hand), with an optional meter that warns as it fills. */
export function Progress({ title, state, steps, step, stepProgress, valueText, error = 'The step failed', onPause, onResume, onRetry, onRestart, meter, className }: ProgressProps) {
  const n = steps.length, at = Math.max(0, Math.min(step, n - 1)), cur = steps[at];
  const done = state === 'complete', ind = state === 'indeterminate';
  const sub = done ? 1 : Math.max(0, Math.min(1, stepProgress));
  const all = done ? 1 : (at + sub) / n, pct = Math.round(all * 100);
  const words = valueText ?? (ind ? 'Preparing the run' : state === 'paused' ? `Paused at step ${at + 1} of ${n}` : state === 'error' ? `Failed at step ${at + 1} of ${n}` : done ? `All ${n} steps done` : `Step ${at + 1} of ${n}, ${cur.label.toLowerCase()}`);
  // only a change of state is announced, never every percent
  const [said, setSaid] = useState('');
  const was = useRef(state);
  useEffect(() => {
    if (was.current === state) return; was.current = state;
    setSaid({ indeterminate: 'Starting', running: 'Running', paused: 'Paused', error: `Step ${at + 1} failed: ${error}`, complete: 'Done. ' + words }[state]);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps
  const btn = state === 'paused' ? { icon: 'play' as const, label: 'Resume', on: onResume } : done ? { icon: 'refresh' as const, label: 'Run again', on: onRestart } : { icon: 'pause' as const, label: 'Pause', on: onPause };
  const m = meter ? meter.value / meter.max : 0, warnAt = meter?.warnAt ?? .75, dangerAt = meter?.dangerAt ?? .9;
  const band = !meter ? 0 : m >= dangerAt ? 2 : m >= warnAt ? 1 : 0;

  return (
    <div data-dm="" data-s={CODE[state]} className={cx('dm-prg dm-panel', className)}>
      <div className="dm-prg-h">
        <span className="dm-prg-ring" role="progressbar" aria-label="Run progress" aria-valuemin={ind ? undefined : 0} aria-valuemax={ind ? undefined : 100} aria-valuenow={ind ? undefined : pct} aria-valuetext={ind ? 'Preparing the run' : pct + '% of the run'}>
          <svg viewBox="0 0 36 36" aria-hidden="true"><circle className="dm-tr" cx="18" cy="18" r="15" /><circle className="dm-fl" cx="18" cy="18" r="15" pathLength={100} style={ind ? undefined : { strokeDasharray: `${all * 100} 100` }} /></svg>
          <span className="dm-prg-pc dm-num">{done ? <Icon name="check" size="xs" className="dm-enter" /> : ind ? '' : pct + '%'}</span>
        </span>
        <div className="dm-prg-t"><b>{title}</b><span className="dm-muted dm-prg-vt">{words}</span></div>
        <span className={cx('dm-tag dm-prg-st', TAG[state][1])}><Swap>{TAG[state][0]}</Swap></span>
        {btn.on && <Tip label={btn.label}><button type="button" className="dm-ib dm-prg-btn" aria-label={btn.label} onClick={btn.on} disabled={state === 'error' || ind} style={state === 'error' ? { visibility: 'hidden' } : undefined}><Icon name={btn.icon} /></button></Tip>}
      </div>
      <div className="dm-prg-seg" role="progressbar" aria-label="Steps" aria-valuemin={0} aria-valuemax={n} aria-valuenow={done ? n : at} aria-valuetext={done ? `All ${n} steps done` : ind ? 'Not started' : `Step ${at + 1} of ${n}`}>
        {steps.map((_, j) => <i key={j}><b style={{ ['--dm-f' as string]: done || j < at ? 1 : j === at && !ind ? sub : 0 }} /></i>)}
      </div>
      <div className="dm-prg-ll">
        {state === 'error'
          ? <><span className="dm-e dm-enter"><Icon name="alert" size="xs" /><span>{error}</span></span>{onRetry && <button type="button" className="dm-pill dm-line dm-sm" onClick={onRetry}><Icon name="refresh" size="xs" />Retry</button>}</>
          : ind ? <><span>Getting ready</span><span className="dm-n">Counting</span></> : <><span>{cur.unit}</span><span className="dm-n dm-num">{fmt(sub * cur.total)} of {fmt(cur.total)}</span></>}
      </div>
      <div className={cx('dm-prg-lin', ind && 'dm-ind')} role="progressbar" aria-label="This step" aria-valuemin={0} aria-valuemax={100} aria-valuenow={ind ? undefined : Math.round(sub * 100)} aria-valuetext={ind ? 'Working out how much there is' : `${fmt(sub * cur.total)} of ${fmt(cur.total)} ${cur.unit.toLowerCase()}`}>
        <i style={ind ? undefined : { width: sub * 100 + '%' }} />
      </div>
      {meter && (
        <div className="dm-prg-meter">
          <div className="dm-prg-mh"><span>{meter.label}</span><span className="dm-num dm-muted"><b className="dm-prg-mv">{fmt(meter.value)}</b> of {fmt(meter.max)}</span></div>
          <div className={cx('dm-prg-mb', band === 1 && 'dm-warn', band === 2 && 'dm-bad')} role="meter" aria-label={meter.label} aria-valuemin={0} aria-valuemax={meter.max} aria-valuenow={Math.round(meter.value)}
            aria-valuetext={`${fmt(meter.value)} of ${fmt(meter.max)} ${meter.unit ?? ''}`.trim() + ['', ', running low', ', ' + (meter.dangerLabel ?? 'almost out').toLowerCase()][band]}>
            <i className="dm-fl" style={{ width: Math.min(100, m * 100) + '%' }} /><i className="dm-th" style={{ left: warnAt * 100 + '%' }} /><i className="dm-th" style={{ left: dangerAt * 100 + '%' }} />
          </div>
          <div className="dm-prg-ml">
            <span key={band} className={band ? 'dm-enter' : undefined}>{band === 2 ? <span className="dm-tag dm-bad"><Icon name="alert" size="xs" />{meter.dangerLabel ?? 'Almost out'}</span> : band === 1 ? <span className="dm-tag dm-warn"><Icon name="warn" size="xs" />Running low</span> : <span className="dm-muted">On track</span>}</span>
            {meter.note && <span className="dm-muted">{meter.note}</span>}
          </div>
        </div>
      )}
      <p className="dm-prg-sr" aria-live="polite">{said}</p>
    </div>
  );
}
```

## More in Forms and inputs

- [Buttons](https://designme.dev/components/buttons.md): Every button style, with loading, success and hold-to-confirm states.
- [Badge](https://designme.dev/components/badge.md): Small labels for plans, environments and status, with a dot, an icon or a remove button.
- [Slider](https://designme.dev/components/slider.md): Named stops, a stepped scale and a range, with the agent's recommended value marked on the track.
- [Tooltip](https://designme.dev/components/tooltip.md): Quiet labels on hover, with shortcuts and a richer preview card.
- [Search input](https://designme.dev/components/search-input.md): Search with scoped filters, recent queries and an agent answer.
- [Country select](https://designme.dev/components/country-select.md): A searchable select with country codes, currency and keyboard support.
- [Multi-select](https://designme.dev/components/multi-select.md): A combobox that filters as you type and keeps your picks as chips.
- [Colour picker](https://designme.dev/components/color-picker.md): Pick a colour by eye or by hex, check its contrast, and let the agent fix it or make a scale from it.
- [Social sign-in](https://designme.dev/components/social-sign-in.md): One-tap providers that remember the last one you used.
- [Sign in](https://designme.dev/components/sign-in.md): Email first, then the one-time code from the email, copied or typed in.
- [OTP field](https://designme.dev/components/otp-field.md): A one-time code, one box per digit, that fills from a paste.
- [Form](https://designme.dev/components/form.md): A project brief with inline checks and an agent that drafts the rest.
- [Payment form](https://designme.dev/components/payment-form.md): Card details with live formatting, brand detection and a clear total.
- [Carousel](https://designme.dev/components/carousel.md): Drafts the agent made to keep one of, or a gallery of pictures, on one swipeable track.

All components: https://designme.dev/llms.txt
