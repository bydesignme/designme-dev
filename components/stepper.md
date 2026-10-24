# Stepper

> A multi-step setup with a progress track that fills as you go.

App basics / Product. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/stepper

## Install

```sh
npx designme add stepper          # HTML, CSS and JS, with the shared core
npx designme add stepper --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Stepper walks a person through a short setup one question at a time, with a track of numbered steps that fills in as they go. Each step offers a few choices, such as how much freedom the agent should have, or your own fields. Finishing shows a confirmation that sums up the picks, with a short burst of confetti.

### When to use it

- When setting up an agent needs a few decisions, like how it works and what it connects to
- When each question is simple enough to answer with one of a few options
- When people should be able to jump back to an earlier step to change an answer
- When a step needs a server check before the person can move on

### What it does

- Each step shows a title, an optional description and either `options` to pick from or your own `content`.
- Continue slides the next step in from the right, and Back slides the previous one in from the left.
- Completed steps on the track show a check and can be clicked to go back to them.
- `onNext` runs before moving on; returning false, or a promise of false, keeps the person on the step, and Continue is disabled while it is pending.
- Finish calls `onFinish` with the picks, and the done screen lists the chosen options unless you set `doneDetail`. The track is hidden there, and the screen keeps the height the steps had, with the confirmation centred in it.
- Start over returns to the first step, and `bare` (the default) sits flat in a chat thread.

### Accessibility

- Options are a `radiogroup` labelled with the step title, and each option is a `radio` with `aria-checked`.
- The current step on the track has `aria-current="step"`.
- Completed steps on the track are focusable buttons that respond to Enter and Space.
- The confetti is skipped when the user prefers reduced motion.

## Usage in React

```tsx
import { Stepper } from '@/components/designme/stepper/Stepper';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: pick an option on each step, go back from the track, start over at the end.
import { Stepper, type StepperStep } from './Stepper';

const STEPS: StepperStep[] = [
  { label: 'Workspace', title: 'Name your workspace', description: 'This is what your team will see.', options: [{ label: 'Studio', detail: 'Small team' }, { label: 'Agency', detail: 'Many clients' }, { label: 'In-house', detail: 'One product' }] },
  { label: 'Agent', title: 'How should the agent work?', description: 'You can change this any time.', defaultOption: 1, options: [{ label: 'Ask first', detail: 'Safest' }, { label: 'Balanced', detail: 'Recommended' }, { label: 'Autopilot', detail: 'Fastest' }] },
  { label: 'Connect', title: 'Where do your designs live?', description: 'Pick one to start.', defaultOption: 2, options: [{ label: 'Figma', detail: 'Frames and tokens' }, { label: 'GitHub', detail: 'Code and PRs' }, { label: 'Both', detail: 'Full loop' }] }
];

export default function StepperDemo() {
  return <Stepper steps={STEPS} />;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `steps` | `StepperStep[]` |  |
| `step` (optional) | `number` | The step on screen, from 0. steps.length shows the finished screen. Leave it out to let Back and Continue move it |
| `defaultStep` (optional) | `number` |  |
| `onStepChange` (optional) | `(step: number) => void` |  |
| `values` (optional) | `number[]` | The picked option of each step, by index |
| `defaultValues` (optional) | `number[]` |  |
| `onValuesChange` (optional) | `(values: number[]) => void` |  |
| `onNext` (optional) | `(step: number, values: number[]) => boolean \| void \| Promise<boolean \| void>` | Called on Continue or Finish before moving on. Return false (or a promise of false) to stay on the step, for example to show an error |
| `onFinish` (optional) | `(values: number[]) => void` | Called with the picks when the last step is finished |
| `doneTitle` (optional) | `string` | The finished screen's heading, like "You're set up" |
| `doneDetail` (optional) | `ReactNode` | The line under it. Defaults to the picked options, joined with dots |
| `backLabel` (optional) | `string` |  |
| `nextLabel` (optional) | `string` |  |
| `finishLabel` (optional) | `string` |  |
| `restartLabel` (optional) | `string` |  |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Questions

**How do I validate a step before the person continues?**

Pass `onNext(step, values)`. Return false, or a promise that resolves to false, to stay on the step. Continue is disabled while the promise is pending.

**Can a step have my own inputs instead of options?**

Yes. Give the step `content` with your own fields and leave out `options`. The content shows under the title.

**How are the answers given back to me?**

`values` holds the picked option index for each step, and `onFinish` receives the same array when the last step is finished. Each step starts on its `defaultOption`, or the first option.

## Source

`Stepper.tsx`, as `npx designme add stepper --react` installs it:

```tsx
'use client';
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useReducedMotion } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter } from '../lib/motion';
import '../designme.css';
import './stepper.css';

export interface StepperOption {
  /** Like "Balanced" */
  label: string;
  /** The quiet line under it, like "Recommended" */
  detail?: string;
}

export interface StepperStep {
  /** The short name on the track, like "Agent" */
  label: string;
  /** The question at the top of the step, like "How should the agent work?" */
  title: string;
  /** The quiet line under the title */
  description?: string;
  /** The choices, one of which is picked. Leave them out and pass `content` for a step of your own */
  options?: StepperOption[];
  /** Your own fields for this step, shown under the title in place of the options */
  content?: ReactNode;
  /** The option picked to begin with. Defaults to the first */
  defaultOption?: number;
}

export interface StepperProps {
  steps: StepperStep[];
  /** The step on screen, from 0. steps.length shows the finished screen. Leave it out to let Back and Continue move it */
  step?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  /** The picked option of each step, by index */
  values?: number[];
  defaultValues?: number[];
  onValuesChange?: (values: number[]) => void;
  /** Called on Continue or Finish before moving on. Return false (or a promise of false) to stay on the step, for example to show an error */
  onNext?: (step: number, values: number[]) => boolean | void | Promise<boolean | void>;
  /** Called with the picks when the last step is finished */
  onFinish?: (values: number[]) => void;
  /** The finished screen's heading, like "You're set up" */
  doneTitle?: string;
  /** The line under it. Defaults to the picked options, joined with dots */
  doneDetail?: ReactNode;
  backLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  restartLabel?: string;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

/** A short burst of confetti from an element, in the accent and a few brand colours, falling as it fades. Returns its cleanup */
function burst(at: HTMLElement) {
  const bp = getComputedStyle(at).getPropertyValue('--dm-motion').trim() === 'bp';
  const box = document.createElement('span'); box.className = 'dm-stx-conf'; at.appendChild(box);
  const COL = ['var(--dm-accent)', 'var(--dm-ok)', 'var(--dm-c2)', 'var(--dm-c4)', 'var(--dm-c5)', 'var(--dm-c6)'], N = 22;
  for (let k = 0; k < N; k++) {
    const p = document.createElement('i'), round = k % 3 === 0, a = -Math.PI / 2 + (k / (N - 1) - .5) * Math.PI * 1.5 + Math.sin(k * 7.3) * .18;
    const d = 46 + (k * 37 % 30), w = round ? 5 : 3 + k % 2, h = round ? 5 : 7 + k % 3;
    if (round) p.className = 'dm-d';
    Object.assign(p.style, { width: w + 'px', height: h + 'px', marginLeft: -w / 2 + 'px', marginTop: -h / 2 + 'px', background: COL[k % COL.length] });
    box.appendChild(p);
    const x = Math.cos(a) * d, y = Math.sin(a) * d, r0 = k * 47 % 180, spin = (k % 2 ? 1 : -1) * (180 + k * 23 % 200), ms = (bp ? 760 : 1150) + k * 13 % 220;
    p.animate([
      { opacity: 1, transform: `translate(0,0) rotate(${r0}deg) scale(.6)` },
      { opacity: 1, transform: `translate(${x}px,${y}px) rotate(${r0 + spin * .5}deg) scale(1)`, offset: .42 },
      { opacity: 0, transform: `translate(${x * 1.18}px,${y + 46}px) rotate(${r0 + spin}deg) scale(.9)` }
    ], { duration: ms, delay: 120 + k % 4 * 18, easing: bp ? 'cubic-bezier(.65,0,.25,1)' : 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
  }
  const t = setTimeout(() => box.remove(), 1700);
  return () => { clearTimeout(t); box.remove(); };
}

/** A few steps of setup, one question at a time, with a track that fills in as you go. */
export function Stepper({ steps, step, defaultStep = 0, onStepChange, values, defaultValues, onValuesChange, onNext, onFinish,
  doneTitle = "You're set up", doneDetail, backLabel = 'Back', nextLabel = 'Continue', finishLabel = 'Finish', restartLabel = 'Start over', bare = true, className }: StepperProps) {
  const [cur, setCur] = useControllable(step, defaultStep, onStepChange);
  const [picks, setPicks] = useControllable(values, defaultValues ?? steps.map(s => s.defaultOption ?? 0), onValuesChange);
  // each move slides the new step in from the side it comes from; the first step just appears
  const [seen, setSeen] = useState({ step: cur, dir: 0, key: 0 });
  if (seen.step !== cur) setSeen({ step: cur, dir: cur > seen.step ? 1 : -1, key: seen.key + 1 });
  const [busy, setBusy] = useState(false);
  const finished = cur >= steps.length;

  const next = async () => {
    if (finished) { setCur(0); return; }
    if (onNext) {
      setBusy(true);
      try { if ((await onNext(cur, picks)) === false) return; } finally { setBusy(false); }
    }
    if (cur === steps.length - 1) onFinish?.(picks);
    setCur(cur + 1);
  };
  const pick = (i: number, k: number) => setPicks(steps.map((_, j) => (j === i ? k : picks[j] ?? 0)));
  const s = steps[cur];
  // arriving at the finished screen from Finish is the moment to celebrate
  const celebrate = finished && seen.dir > 0;
  const ok = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  // the finished screen drops the track and keeps the height the steps had, centred in it
  const root = useRef<HTMLDivElement>(null), tall = useRef(0);
  useLayoutEffect(() => { if (!finished && root.current) tall.current = root.current.offsetHeight; });
  useEffect(() => { if (celebrate && !reduce && ok.current) return burst(ok.current); }, [celebrate, seen.key, reduce]);

  return (
    <div data-dm="" ref={root} className={cx('dm-stx', !bare && 'dm-panel', finished && 'dm-fin', finished && tall.current > 0 && 'dm-held', className)} style={finished && tall.current ? { minHeight: tall.current } : undefined}>
      <div className="dm-stx-track">
        {steps.map((st, i) => [
          // a finished step on the track takes you back to it
          <div key={'s' + i} className={cx('dm-stx-st', i === cur && 'dm-on', i < cur && 'dm-done')} aria-current={i === cur ? 'step' : undefined}
            {...(i < cur && { role: 'button', tabIndex: 0, onClick: () => setCur(i), onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCur(i); } } })}>
            <span className="dm-n">{i < cur ? <Icon name="check" size="xs" /> : i + 1}</span><span className="dm-lb">{st.label}</span>
          </div>,
          i < steps.length - 1 && <div key={'l' + i} className={cx('dm-stx-ln', i < cur && 'dm-full')}><i /></div>
        ])}
      </div>
      <div className="dm-stx-vp">
        {/* each step slides in from the side it comes from; the finished screen stays put and celebrates instead */}
        <div key={seen.key} className={cx('dm-stx-body', !finished && seen.dir > 0 && 'dm-inr', !finished && seen.dir < 0 && 'dm-inl')}>
          {finished ? (
            <div className={cx('dm-stx-dn', celebrate && 'dm-go')}>
              <span ref={ok} className="dm-stx-ok">
                <svg viewBox="0 0 44 44" aria-hidden="true"><circle className="dm-c" cx="22" cy="22" r="20" /><path className="dm-k" d="M14 22.5l5.5 5.5L30.5 16.5" /></svg>
              </span>
              <b {...(celebrate ? enter(260) : {})}>{doneTitle}</b>
              <span {...(celebrate ? enter(340) : {})} className={cx('dm-muted', celebrate && enter(340).className)}>{doneDetail ?? steps.map((st, k) => st.options?.[picks[k] ?? 0]?.label).filter(Boolean).join(' · ')}</span>
            </div>
          ) : (
            <>
              <h4>{s.title}</h4>
              {s.description && <p>{s.description}</p>}
              {s.content ?? (s.options && (
                <div className="dm-stx-opts" role="radiogroup" aria-label={s.title}>
                  {s.options.map((o, k) => (
                    <button type="button" key={k} role="radio" aria-checked={picks[cur] === k} className={cx('dm-stx-o', picks[cur] === k && 'dm-on')} onClick={() => pick(cur, k)}>
                      <b style={{ fontWeight: 500 }}>{o.label}</b>{o.detail && <span>{o.detail}</span>}
                    </button>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="dm-stx-f">
        <button type="button" className="dm-pill dm-ghost dm-sm dm-stx-bk" disabled={cur === 0} onClick={() => setCur(Math.max(0, cur - 1))}>{backLabel}</button>
        <button type="button" className="dm-pill dm-ink dm-sm dm-stx-nx" disabled={busy} onClick={next}>{finished ? restartLabel : cur === steps.length - 1 ? finishLabel : nextLabel}</button>
      </div>
    </div>
  );
}
```

## More in Product

- [Pricing cards](https://designme.dev/components/pricing-cards.md): Three plans with a billing switch and a seat slider.
- [Onboarding checklist](https://designme.dev/components/onboarding-checklist.md): First steps with a progress ring, and the agent can do some for you.
- [Set limit](https://designme.dev/components/set-limit.md): A monthly agent budget with a draggable cap and a forecast.
- [Currency converter](https://designme.dev/components/currency-converter.md): Show plan prices in local currency, with a swap and live rate.

All components: https://designme.dev/llms.txt
