# Onboarding checklist

> First steps with a progress ring, and the agent can do some for you.

App basics / Product. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/onboarding-checklist

## Install

```sh
npx designme add onboarding-checklist          # HTML, CSS and JS, with the shared core
npx designme add onboarding-checklist --react  # React 19 component and its CSS
npx designme add onboarding-checklist --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/onboarding-checklist.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/onboarding-checklist.json  # Astro
```

## About

Onboarding checklist lists a new user's first steps with a progress ring that fills as they are ticked off. Steps the agent can handle carry a Do it for me button, and while the agent works the step shows a spinner and "The agent is on it". When every step is done, the ring shows a green check and a closing note appears.

### When to use it

- When new users need a few setup steps, such as connecting a tool or inviting a teammate
- When the agent can complete some setup steps on the person's behalf
- When onboarding sits in a chat thread or a sidebar and should fold away
- When you want progress to be visible at a glance

### What it does

- The ring fills to the share of steps done, and the status line reads "2 of 5 done" until everything is done.
- Clicking a step's checkbox or anywhere on its row ticks it, and clicking again unticks it.
- Steps marked `automatic` show Do it for me on hover or focus; it calls `onDoIt`, and a returned promise shows the step running until it settles and then ticks it.
- Keys in `running` show a step as in progress even when the agent started it on its own.
- The chevron folds the list away, and `open` can be controlled.
- `bare` (the default) sits flat in a chat thread; set it to false to give it its own card.

### Accessibility

- The ring is an SVG with `role="progressbar"` and `aria-valuenow`, `aria-valuemin` and `aria-valuemax` set to the step counts.
- Each step's checkbox is a button with `role="checkbox"`, `aria-checked` and the step title as its label.
- The fold button has `aria-expanded`, and the folded list is `inert` and `aria-hidden`.
- Do it for me buttons become visible on keyboard focus as well as on hover.

## Usage in React

```tsx
import { OnboardingChecklist } from '@/components/designme/onboarding-checklist/OnboardingChecklist';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: the agent connects Figma by itself, and the other
// "Do it for me" buttons take a moment before they tick their step off.
import { useRef, useState } from 'react';
import { OnboardingChecklist, type OnboardingStep } from './OnboardingChecklist';
import { useScript, useTakeover } from '../lib/useScript';

const STEPS: OnboardingStep[] = [
  { key: 'workspace', title: 'Create your workspace', detail: 'Done when you signed up', done: true },
  { key: 'figma', title: 'Connect Figma', detail: 'So the agent can read your frames', automatic: true },
  { key: 'tokens', title: 'Import your tokens', detail: 'Colours, type and spacing', automatic: true },
  { key: 'invite', title: 'Invite a teammate', detail: 'Design is better together' },
  { key: 'audit', title: 'Run your first audit', detail: 'Takes about a minute', automatic: true }
];

export default function OnboardingChecklistDemo() {
  const [done, setDone] = useState(['workspace']);
  const [running, setRunning] = useState<string[]>([]);
  // a moment after it appears, the agent starts on Figma, unless you take over first; once it has started, it finishes
  const ref = useRef<HTMLDivElement>(null), mine = useTakeover(ref);
  useScript(async ({ wait }) => {
    await wait(1300); if (mine()) return; setRunning(['figma']);
    await wait(1400); setRunning([]); setDone(d => (d.includes('figma') ? d : [...d, 'figma']));
  });
  return (
    <div ref={ref} style={{ display: 'contents' }}><OnboardingChecklist steps={STEPS} done={done} onDoneChange={setDone} running={running}
      onDoIt={() => new Promise(res => setTimeout(res, 1400))} /></div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `steps` | `OnboardingStep[]` |  |
| `done` (optional) | `string[]` | Keys of the steps that are done. Leave it out to let the checkboxes tick them |
| `defaultDone` (optional) | `string[]` |  |
| `onDoneChange` (optional) | `(done: string[]) => void` |  |
| `running` (optional) | `string[]` | Keys of the steps the agent is doing right now: a spinner in the checkbox and `runningLabel` under the title |
| `onDoIt` (optional) | `(step: OnboardingStep, index: number) => void \| Promise<unknown>` | "Do it for me" was pressed. Return a promise and the step shows as running until it settles, then ticks itself off |
| `title` (optional) | `string` | Like "Get set up" |
| `status` (optional) | `string` | The line under the title. Defaults to "2 of 5 done", then "All done. Nice work" |
| `doneMessage` (optional) | `ReactNode` | The note that comes in once every step is done |
| `doItLabel` (optional) | `string` |  |
| `runningLabel` (optional) | `string` |  |
| `open` (optional) | `boolean` | Whether the list is open. Leave it out to let the chevron fold it away |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import OnboardingChecklist from '../components/designme/onboarding-checklist/OnboardingChecklist.astro';
---
<OnboardingChecklist />
<OnboardingChecklist data-style="soft" class="my-class" />
```
It plays its demo; change `onboarding-checklist.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I let the agent complete a step?**

Mark the step `automatic` and handle `onDoIt`. Return a promise: the step shows "The agent is on it" until it resolves, then ticks itself off. If it rejects, the step goes back to waiting.

**Can the agent start a step without the person pressing anything?**

Yes. Put the step's key in `running` while the agent works, then add the key to `done`. The example does this for Connect Figma.

**How do I keep progress between sessions?**

Control it with `done` and `onDoneChange`, which gives you the list of ticked step keys to save and pass back next time.

## Source

`OnboardingChecklist.tsx`, as `npx designme add onboarding-checklist --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Fold, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './onboarding-checklist.css';

export interface OnboardingStep {
  /** Names the step in `done` and `running`. Defaults to the title */
  key?: string;
  /** Like "Connect Figma" */
  title: string;
  /** The quiet line under it, like "So the agent can read your frames" */
  detail?: string;
  /** Ticked off when the checklist starts, if `done` and `defaultDone` are left out */
  done?: boolean;
  /** Shows a "Do it for me" button on hover, which calls `onDoIt` */
  automatic?: boolean;
}

export interface OnboardingChecklistProps {
  steps: OnboardingStep[];
  /** Keys of the steps that are done. Leave it out to let the checkboxes tick them */
  done?: string[];
  defaultDone?: string[];
  onDoneChange?: (done: string[]) => void;
  /** Keys of the steps the agent is doing right now: a spinner in the checkbox and `runningLabel` under the title */
  running?: string[];
  /** "Do it for me" was pressed. Return a promise and the step shows as running until it settles, then ticks itself off */
  onDoIt?: (step: OnboardingStep, index: number) => void | Promise<unknown>;
  /** Like "Get set up" */
  title?: string;
  /** The line under the title. Defaults to "2 of 5 done", then "All done. Nice work" */
  status?: string;
  /** The note that comes in once every step is done */
  doneMessage?: ReactNode;
  doItLabel?: string;
  runningLabel?: string;
  /** Whether the list is open. Leave it out to let the chevron fold it away */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

const RING = 100.5;
const keyOf = (s: OnboardingStep) => s.key ?? s.title;

/** A few first steps with a progress ring. The agent can do some of them for the person. */
export function OnboardingChecklist({ steps, done, defaultDone, onDoneChange, running, onDoIt, title = 'Get set up', status,
  doneMessage = 'You are all set. The agent will suggest what to try next.', doItLabel = 'Do it for me', runningLabel = 'The agent is on it',
  open, defaultOpen = true, onOpenChange, bare = true, className }: OnboardingChecklistProps) {
  const [ticked, setTicked] = useControllable(done, defaultDone ?? steps.filter(s => s.done).map(keyOf), onDoneChange);
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  // steps started from "Do it for me" that are still waiting on onDoIt
  const [pending, setPending] = useState<string[]>([]);
  const latest = useRef(ticked);
  useEffect(() => { latest.current = ticked; });
  // the ring fills in a moment after the checklist appears
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  const n = steps.filter(s => ticked.includes(keyOf(s))).length, all = n === steps.length && n > 0;
  const toggle = (k: string) => setTicked(ticked.includes(k) ? ticked.filter(x => x !== k) : [...ticked, k]);
  const doIt = (s: OnboardingStep, i: number) => {
    const k = keyOf(s), out = onDoIt?.(s, i);
    if (!out || typeof (out as Promise<unknown>).then !== 'function') return;
    setPending(p => [...p, k]);
    (out as Promise<unknown>).then(
      () => { setPending(p => p.filter(x => x !== k)); if (!latest.current.includes(k)) setTicked([...latest.current, k]); },
      () => setPending(p => p.filter(x => x !== k)));
  };

  return (
    <div data-dm="" className={cx('dm-obx', !bare && 'dm-panel', className)}>
      <div className="dm-obx-h">
        {/* when every step is done, a green check grows in the middle of the ring */}
        <span className={cx('dm-obx-rw', ready && all && 'dm-full')}>
          <svg className={cx('dm-obx-ring', ready && all && 'dm-full')} viewBox="0 0 40 40" role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={n}>
            <circle cx="20" cy="20" r="16" className="dm-tr" />
            <circle cx="20" cy="20" r="16" className="dm-fl" style={{ strokeDashoffset: ready ? RING * (1 - n / steps.length) : RING }} />
          </svg>
          <span className="dm-obx-rk" aria-hidden="true"><Icon name="check" size="xs" /></span>
        </span>
        <div className="dm-obx-ht"><b>{title}</b><Swap className="dm-muted dm-obx-st">{status ?? (all ? 'All done. Nice work' : `${n} of ${steps.length} done`)}</Swap></div>
        <Tip label={isOpen ? 'Collapse' : 'Expand'}>
          <button type="button" className={cx('dm-ib dm-obx-min', !isOpen && 'dm-shut')} aria-label={isOpen ? 'Collapse' : 'Expand'} aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}><Icon name="chev-d" size="xs" /></button>
        </Tip>
      </div>
      <Fold open={isOpen} className="dm-obx-fold">
        <div className="dm-obx-list">
          {steps.map((s, i) => {
            const k = keyOf(s), isDone = ticked.includes(k), run = !isDone && (pending.includes(k) || !!running?.includes(k));
            const e = enter(i * 50);
            return (
              // the whole row ticks the step, not only its checkbox; its button does its own thing, and a running step waits
              <div key={k} className={cx('dm-obx-s', isDone && 'dm-done', run && 'dm-run', e.className)} style={e.style}
                onClick={ev => { if (!run && !(ev.target as HTMLElement).closest('.dm-obx-ck, .dm-pill')) toggle(k); }}>
                <button type="button" className="dm-obx-ck" role="checkbox" aria-checked={isDone} aria-label={s.title} onClick={() => toggle(k)}>
                  {run ? <span className="dm-spin" style={{ width: 14, height: 14 }} /> : <Icon name="check" size="xs" />}
                </button>
                <span className="dm-t"><b>{s.title}</b>{s.detail !== undefined && <Swap className={run ? 'dm-shim' : undefined}>{run ? runningLabel : s.detail}</Swap>}</span>
                {s.automatic && <button type="button" className="dm-pill dm-soft dm-sm" onClick={() => doIt(s, i)}><Icon name="spark" size="xs" />{doItLabel}</button>}
              </div>
            );
          })}
          {all && <div key="dn" className="dm-obx-dn dm-enter"><Icon name="ok" size="xs" />{doneMessage}</div>}
        </div>
      </Fold>
    </div>
  );
}
```

## More in Product

- [Pricing cards](https://designme.dev/components/pricing-cards.md): Three plans with a billing switch and a seat slider.
- [Stepper](https://designme.dev/components/stepper.md): A multi-step setup with a progress track that fills as you go.
- [Set limit](https://designme.dev/components/set-limit.md): A monthly agent budget with a draggable cap and a forecast.
- [Currency converter](https://designme.dev/components/currency-converter.md): Show plan prices in local currency, with a swap and live rate.

All components: https://designme.dev/llms.txt
