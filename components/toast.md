# Toast

> A background job in one toast, from start to finish.

Components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/toast

## Install

```sh
npx designme add toast          # HTML, CSS and JS, with the shared core
npx designme add toast --react  # React 19 component and its CSS
npx designme add toast --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/toast.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/toast.json  # Astro
```

## About

Toast holds a job the agent runs in the background in one toast, from start to finish. It grows out of the button that started it, its glyph shows the work as it happens, its words and buttons change in place as the job moves on (working, a problem with its fix, done), its steps open inside it, and Close drains a visible countdown. Plain toasts, a success or an error with one action, are the same card.

### When to use it

- When an agent runs something that takes a while, like making slides from notes, and people should keep working while it runs.
- When a job can hit a problem the person can fix, and the fix should happen in the same toast rather than in a new one.
- When a finished job needs a way back, like Undo, or a next step, like Open.
- For a plain confirmation or failure with one action, such as "Changes applied" with Undo.

### What it does

- One toast per job: keep its `id` and change `status`, `title`, `description`, `steps` and `actions` as the work moves on, and the same card changes in place. A new `id` brings in a new toast and sends the old one away.
- Six statuses: `working`, `success`, `error`, `warning`, `stopped` and `info`. While `working` the title has a highlight sweeping across it, and Stop (when you pass `onStop`) takes Close's place. Without a `glyph` the status picks the mark: the green tick, the red alert, the orange warning sign (its words stay in the text colour; give its fix `variant: 'warn'`), a grey info or pause mark, or a spinner.
- `glyph` takes a live drawing in place of the mark. `DeckGlyph` is the one the demo uses: it sweeps a line down the notes while `reading`, lays out a dashed slot for each slide while `outlining`, deals each slide into its slot as it is drafted (`made`), draws the slide in progress (`active`) in the accent and in front, lifts a `flagged` slide in red, and closes the hand into a deck with a green tick when `done`.
- `steps` adds a chevron to the head that opens them inside the toast, under a hairline, each with its mark (waiting, running, done, failed or paused) and an optional `detail` like "3 of 12". Use `stepsOpen` and `onStepsOpenChange` to control it, or leave them out.
- `actions` puts one or two buttons in the footer, under a hairline (an off-white strip in Clean): a white outlined `secondary`, a `primary`, or `warn` for a warning's fix. The footer opens and closes smoothly as actions come and go.
- The description crossfades when it changes, and a counter ticks over at once: a change that keeps the words before its first number, like "Slide 3 of 12" becoming "Slide 4 of 12".
- `duration` closes the toast after that many milliseconds and draws it as a ring that drains round Close. The pointer or the focus on the toast holds the countdown. It is not counted while `working`.
- Pass `from`, a ref to the button that started the job, and the toast grows out of it as it comes in and goes back into it as it leaves. Without it, the toast uses the style's own entrance and exit.
- Swipe it sideways to dismiss it, or press Escape while the focus is in it. `onDismiss` tells you how it was closed: `close`, `timeout`, `swipe` or `escape`.
- Up to 380px wide, and the full width of its container below that, so on a phone it takes the screen less your own 16px gutters. The actions always sit on a row of their own, in the footer.
- In Clean the primary action is the ink button, the secondary is flat, and in dark mode everything drawn in the accent (the spinner, the slide in progress) turns white.

### Accessibility

- Two live regions announce it: `announce` (or the title when you leave it out) is read each time it changes, politely, and an `error` is read at once (assertive). The demo announces milestones (the start, a problem, the end), not every slide.
- The glyph and the status marks are hidden from screen readers; the words carry the news.
- Stop, Close and the chevron have labels ("Stop the job", "Close", "Show the steps" or "Hide the steps"), and the chevron sets `aria-expanded`. Closed steps and an empty footer are inert, so Tab passes over them.
- Escape closes the toast while the focus is in it and hands the focus back to the `from` button.
- The countdown pauses while the pointer or the keyboard focus is on the toast, so there is time to reach its buttons.
- With reduced motion turned on, the toast only fades in and out, and the glyph's slides change in place without moving.

## Usage in React

```tsx
import { Toast } from '@/components/designme/toast/Toast';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { DeckGlyph, Toast, type DeckGlyphPhase, type ToastAction, type ToastData, type ToastStep, type ToastStepStatus } from './Toast';
import { Icon } from '../lib/icons';
import { useStory, useWait } from '../lib/useScript';

/* ---------- Toast: the Job toast. "Make slides" starts a job the agent runs in the background; one toast holds it from start
   to finish. It reads the notes, outlines and drafts twelve slides, and the check stops on slide 7: the toast becomes the
   problem with its fix, then the finished deck with Undo and Open. An agent at work, so it keeps playing under the pointer ---------- */
type Phase = 'idle' | 'read' | 'outline' | 'draft' | 'check' | 'error' | 'fix' | 'done' | 'stopped' | 'removed';
interface Job { phase: Phase; at: 'read' | 'outline' | 'draft' | 'check'; n: number; checking: number; fixed: boolean; skipped: boolean; run: number }
const N = 12;
const SEC = ['Cover', 'Agenda', 'Revenue', 'North', 'South', 'Plan vs actual', 'By region', 'Hiring', 'Open roles', 'Risks', 'Data move', 'Next steps'];
const STEPS = ['Read the notes', 'Outline 12 slides', 'Draft the slides', 'Check the numbers'];
const START: Job = { phase: 'idle', at: 'read', n: 0, checking: -1, fixed: false, skipped: false, run: 0 };

export default function ToastDemo() {
  const ref = useRef<HTMLDivElement>(null), make = useRef<HTMLButtonElement>(null);
  const [job, setJob] = useState<Job>(START);
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  // the job's own clock, cleared on unmount; a newer run (a fix, a stop) cancels an older one
  const wait = useWait(), live = useRef(0), J = useRef(job);
  const set = (patch: Partial<Job>) => { J.current = { ...J.current, ...patch }; setJob(J.current); };

  async function run(tok: number, from: 'read' | 'outline' | 'draft' | 'check' | 'recheck') {
    const ok = () => tok === live.current;
    if (from === 'read') { set({ phase: 'read', at: 'read' }); await wait(1700); if (!ok()) return; from = 'outline'; }
    if (from === 'outline') { set({ phase: 'outline', at: 'outline' }); await wait(1300); if (!ok()) return; from = 'draft'; }
    if (from === 'draft') {
      set({ phase: 'draft', at: 'draft' });
      while (J.current.n < N) { await wait(400); if (!ok()) return; set({ n: J.current.n + 1 }); }
      from = 'check';
    }
    set({ phase: 'check', at: 'check' });
    for (let i = from === 'recheck' ? 7 : 0; i < N; i++) {
      if (i === 6 && !J.current.fixed && !J.current.skipped) { set({ phase: 'error', checking: -1 }); return; }
      if (i === 6 && J.current.skipped) continue;
      set({ checking: i }); await wait(120); if (!ok()) return;
    }
    set({ checking: -1 }); await wait(150); if (!ok()) return;
    set({ phase: 'done' });
  }
  const start = () => {
    if (shown) return;
    // a job whose toast was closed before it finished: the button brings its toast back
    if (J.current.phase !== 'idle') { setShown(true); return; }
    live.current++; J.current = { ...START, run: J.current.run + 1 }; setOpen(false); setShown(true); run(live.current, 'read');
  };
  const fix = async () => { const tok = ++live.current; set({ phase: 'fix' }); await wait(1500); if (tok !== live.current) return; set({ fixed: true }); run(tok, 'recheck'); };
  const skip = () => { set({ skipped: true }); run(++live.current, 'recheck'); };
  // stopping a fix goes back to the problem it was fixing
  const stop = () => { live.current++; set({ phase: J.current.phase === 'fix' ? 'error' : 'stopped', checking: -1 }); };
  const resume = () => run(++live.current, J.current.at);
  const finish = () => { live.current++; set({ phase: 'idle' }); setShown(false); };

  // what the toast says and offers in each state
  const { phase, n, at } = job;
  const words: Record<Phase, [string, string]> = {
    idle: ['', ''], read: ['Reading your notes…', '3 sections · 212 words'], outline: ['Outlining the deck…', '12 slides planned'],
    draft: ['Drafting slides…', `Slide ${Math.min(n + 1, N)} of 12 · ${SEC[Math.min(n, N - 1)]}`], check: ['Checking the numbers…', 'Against the Q3 sheet'],
    error: ['Slide 7 doesn’t match', 'The sheet says 41k, not 14k'], fix: ['Fixing slide 7…', 'Using 41k from the sheet'],
    done: ['12 slides ready', job.skipped ? 'Q3 planning deck · 1 to check' : 'Q3 planning deck · 1 fixed'],
    stopped: [at === 'draft' ? `Stopped at slide ${n}` : at === 'check' ? 'Stopped while checking' : 'Stopped before drafting', `${n} of 12 drafted · nothing lost`],
    removed: ['Deck removed', 'Your notes are unchanged']
  };
  const working = ['read', 'outline', 'draft', 'check', 'fix'].includes(phase);
  const acts: Partial<Record<Phase, ToastAction[]>> = {
    error: [{ label: 'Skip', onClick: skip }, { label: 'Fix slide 7', variant: 'primary', onClick: fix }],
    done: [{ label: 'Undo', onClick: () => set({ phase: 'removed' }) }, { label: 'Open', variant: 'primary', onClick: finish }],
    stopped: [{ label: 'Discard', onClick: finish }, { label: 'Resume', variant: 'primary', onClick: resume }],
    removed: [{ label: 'Redo', onClick: () => set({ phase: 'done' }) }]
  };
  const stepAt = { read: 0, outline: 1, draft: 2, check: 3 }[at];
  const stepOf = (i: number): ToastStepStatus => phase === 'done' || phase === 'removed' ? 'done'
    : phase === 'stopped' ? (i < stepAt ? 'done' : i === stepAt ? 'paused' : 'waiting')
    : phase === 'error' && i === 3 ? 'failed' : i < stepAt ? 'done' : i === stepAt ? 'running' : 'waiting';
  const steps: ToastStep[] = STEPS.map((label, i) => ({ label, status: stepOf(i),
    detail: i === 2 && (stepOf(2) === 'running' || stepOf(2) === 'paused') ? `${Math.min(n + (phase === 'draft' ? 1 : 0), N)} of 12` : i === 3 && (phase === 'error' || phase === 'fix') ? 'Slide 7' : undefined }));
  const look: DeckGlyphPhase = { idle: 'idle', read: 'reading', outline: 'outlining', draft: 'drafting', check: 'checking', error: 'checking', fix: 'drafting', done: 'done', removed: 'gone', stopped: at === 'read' ? 'idle' : 'outlining' }[phase] as DeckGlyphPhase;
  const flagged = phase === 'error' || ((phase === 'done' || phase === 'removed') && job.skipped) ? 6 : undefined;
  const active = phase === 'draft' ? n : phase === 'fix' ? 6 : phase === 'check' && job.checking >= 0 ? job.checking : undefined;
  const toast: ToastData | null = shown && phase !== 'idle' ? {
    id: 'job' + job.run, status: working ? 'working' : phase === 'error' ? 'error' : phase === 'stopped' ? 'stopped' : 'success',
    title: words[phase][0], description: words[phase][1], steps: phase === 'removed' ? undefined : steps, actions: acts[phase],
    glyph: <DeckGlyph phase={look} made={phase === 'read' || phase === 'outline' ? 0 : phase === 'draft' || phase === 'stopped' ? n : N} active={active} flagged={flagged} />,
    onStop: stop, duration: phase === 'done' ? 10000 : phase === 'removed' ? 6000 : undefined,
    // milestones, not every slide: the start, a problem (at once), the end
    announce: { read: 'Making slides from your notes', outline: 'Making slides from your notes', draft: 'Making slides from your notes', check: 'Checking the numbers', error: 'Slide 7 doesn’t match the sheet. Fix slide 7 or skip it.', fix: 'Fixing slide 7', done: '12 slides ready. Open the deck or undo it.', stopped: `Stopped. ${n} of 12 drafted. Resume or discard.`, removed: 'Deck removed. Your notes are unchanged.', idle: '' }[phase]
  } : null;
  const label = shown || phase === 'idle' ? 'Make slides' : working ? 'Show progress' : 'Show job';

  // the story: make slides, open the steps, fix the problem the check finds, try Undo and Redo, then open the deck
  useStory(ref, async s => {
    const until = async (f: () => boolean) => { while (!f()) await s.wait(100); };
    await s.wait(1000); s.press('[data-k="make"]');
    await s.wait(2500); s.press('.dm-tst-more');
    await until(() => J.current.n >= 9); s.press('.dm-tst-more');
    await until(() => J.current.phase === 'error'); await s.wait(1500); s.press('.dm-tst-fi .dm-primary');
    await until(() => J.current.phase === 'done'); await s.wait(2000); s.press('.dm-tst-fi .dm-line');
    await s.wait(1500); s.press('.dm-tst-fi .dm-line');
    await s.wait(2500); s.press('.dm-tst-fi .dm-primary');
  }, { hold: false });

  return (
    <div ref={ref} data-dm="" style={{ width: '100%', minHeight: 260, display: 'grid', placeItems: 'center' }}>
      {/* the button and the toast share one place: the toast grows out of the button, and goes back into it once closed */}
      <div style={{ display: 'grid', width: '100%', justifyItems: 'center', alignItems: 'center' }}>
        <button ref={make} type="button" data-k="make" className="dm-pill dm-line dm-sm dm-tst-make" style={{ gridArea: '1/1', visibility: toast ? 'hidden' : undefined }} onClick={start}>
          <Icon name="spark" />{label}
        </button>
        <div style={{ gridArea: '1/1', width: '100%' }}>
          <Toast toast={toast} from={make} stepsOpen={open} onStepsOpenChange={setOpen}
            onDismiss={() => { setShown(false); if (!working && phase !== 'stopped' && phase !== 'error') finish(); }} />
        </div>
      </div>
    </div>
  );
}
```

## Props

### ToastProps

| Prop | Type | What it does |
| --- | --- | --- |
| `toast` | `ToastData \| null` | The toast to show, or null for none |
| `onDismiss` (optional) | `(id: ToastData['id'], reason: ToastDismissReason) => void` | Called when it is closed: by Close, its countdown, a swipe or Escape. It leaves either way |
| `from` (optional) | `RefObject<HTMLElement \| null>` | The button that started it: the toast grows out of it as it comes in and goes back into it as it leaves |
| `stepsOpen` (optional) | `boolean` | Whether the steps are open. Leave it out and the chevron keeps its own state |
| `defaultStepsOpen` (optional) | `boolean` |  |
| `onStepsOpenChange` (optional) | `(open: boolean) => void` |  |
| `className` (optional) | `string` |  |

### DeckGlyphProps

| Prop | Type | What it does |
| --- | --- | --- |
| `phase` | `DeckGlyphPhase` | reading sweeps a line down the notes; outlining lays out a dashed slot for every slide; drafting and checking deal the slides into their slots; done closes the hand into a deck with a green tick; gone folds it away |
| `slides` (optional) | `number` | How many slides the hand holds. Default 12 |
| `made` (optional) | `number` | How many are drafted so far |
| `active` (optional) | `number` | The slide being drafted, checked or fixed (from 0): in the accent, in front |
| `flagged` (optional) | `number` | A slide the check stopped on (from 0): red, lifted, in front |
| `className` (optional) | `string` |  |

### ToastCardProps

| Prop | Type | What it does |
| --- | --- | --- |
| `toast` | `ToastData` |  |
| `onClose` | `(reason: ToastDismissReason) => void` | Called when it is closed: by Close, its countdown, a swipe or Escape |
| `leaving` (optional) | `boolean` | It is on its way out: it can't be reached, and with its own motion it plays its exit |
| `from` (optional) | `RefObject<HTMLElement \| null>` | The button that started it: with its own motion it grows out of it and goes back into it |
| `stepsOpen` (optional) | `boolean` | Whether the steps are open. Leave it out and the chevron keeps its own state |
| `defaultStepsOpen` (optional) | `boolean` |  |
| `onStepsOpenChange` (optional) | `(open: boolean) => void` |  |
| `paused` (optional) | `boolean` | Holds the countdown while true, as the pointer or the focus on the card does (a stack open for reading holds them all) |
| `motion` (optional) | `'own' \| 'host'` | `own` (the default) plays its own entrance and exit; `host` leaves where it sits and how it comes and goes to the component that places it, as `ToastStack` does |
| `height` (optional) | `number` | A height to draw it at instead of its own; it clips what doesn't fit (a card behind the front one in a stack takes the front one's). It eases to it |
| `onHeight` (optional) | `(height: number) => void` | Called with its own height each time that changes: its words wrap, its steps or its footer open or shut |
| `className` (optional) | `string` |  |
| `style` (optional) | `CSSProperties` | Where its host places it. A swipe moves it on from its `transform` |
| `inert` (optional) | `boolean` |  |

## Usage in Astro

```astro
---
import Toast from '../components/designme/toast/Toast.astro';
---
<Toast />
<Toast data-style="soft" class="my-class" />
```
It plays its demo; change `toast.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I show a plain success or error toast?**

Leave out `glyph` and `steps`, set `status` to `success` or `error`, and give it one action if it needs one, like `actions: [{ label: 'Undo', onClick }]`. Set `duration` (10 seconds or more when it has an action) so it closes itself.

**How does a job's toast become its problem and then its fix?**

Keep the same `id`. When the job hits a problem, set `status: 'error'`, a title that says what is wrong, and the fix as the primary action. When it is pressed, set `status: 'working'` again with a title like "Fixing slide 7…". The demo does exactly this.

**What happens to the job when the toast is closed?**

Nothing: the toast is only the job's view. The demo keeps the job running and turns its button into Show progress, which brings the same toast back.

**Can I use my own glyph?**

Yes. Pass any element 64 by 40 pixels as `glyph`; the steps' marks line up under its centre. `DeckGlyph` shows how one can follow the job's progress.

## Source

`Toast.tsx`, as `npx designme add toast --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode, type RefObject } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Fold, Spin, Swap, SwapIcon, Tip } from '../lib/motion';
import '../designme.css';
import './toast.css';

/** What the toast is about. `working` sweeps the title and offers Stop (when you pass `onStop`); `error` is announced at once;
    `warning` shows the warning sign in orange, with its words in the text colour and its fix as a `warn` action */
export type ToastStatus = 'working' | 'success' | 'error' | 'warning' | 'stopped' | 'info';
export type ToastStepStatus = 'waiting' | 'running' | 'done' | 'failed' | 'paused';
export type ToastDismissReason = 'close' | 'timeout' | 'swipe' | 'escape';

export interface ToastStep {
  label: string;
  status: ToastStepStatus;
  /** A short count or note at the step's end, like "3 of 12" */
  detail?: string;
}

export interface ToastAction {
  label: string;
  onClick: () => void;
  /** `secondary` (the default) is the white outlined button; `primary` is the one that moves things on; `warn` resolves a warning */
  variant?: 'primary' | 'secondary' | 'warn';
}

export interface ToastData {
  /** A new id brings in a new toast and sends the old one away. Keep the id and the same toast changes in place */
  id: string | number;
  /** Picks the status mark when there is no `glyph`, and how it is announced. Default `success` */
  status?: ToastStatus;
  title: string;
  /** The quieter line under the title. It crossfades when it changes; a counter ticks over at once (a change that
      keeps the words before its first number, like "Slide 3 of 12" becoming "Slide 4 of 12") */
  description?: string;
  /** A live drawing in place of the status mark, 64 × 40, like `<DeckGlyph />` */
  glyph?: ReactNode;
  /** The job's steps. A chevron in the head opens them inside the toast */
  steps?: ToastStep[];
  /** The footer's buttons, under a hairline (a strip in Clean), at the right. One or two: a secondary, then a primary */
  actions?: ToastAction[];
  /** While `working`, shows Stop in the head in place of Close */
  onStop?: () => void;
  /** Closes the toast after this many ms, drawn as a ring that drains round Close. The pointer or the focus on the toast
      holds it. Not counted while `working` */
  duration?: number;
  /** What screen readers hear, each time it changes. Defaults to the title, so a new title is announced. `error` speaks at
      once (assertive), anything else waits its turn (polite) */
  announce?: string;
}

export interface ToastProps {
  /** The toast to show, or null for none */
  toast: ToastData | null;
  /** Called when it is closed: by Close, its countdown, a swipe or Escape. It leaves either way */
  onDismiss?: (id: ToastData['id'], reason: ToastDismissReason) => void;
  /** The button that started it: the toast grows out of it as it comes in and goes back into it as it leaves */
  from?: RefObject<HTMLElement | null>;
  /** Whether the steps are open. Leave it out and the chevron keeps its own state */
  stepsOpen?: boolean;
  defaultStepsOpen?: boolean;
  onStepsOpenChange?: (open: boolean) => void;
  className?: string;
}

/* ---------- the glyph: a hand of slides ---------- */
export type DeckGlyphPhase = 'idle' | 'reading' | 'outlining' | 'drafting' | 'checking' | 'done' | 'gone';

export interface DeckGlyphProps {
  /** reading sweeps a line down the notes; outlining lays out a dashed slot for every slide; drafting and checking deal the
      slides into their slots; done closes the hand into a deck with a green tick; gone folds it away */
  phase: DeckGlyphPhase;
  /** How many slides the hand holds. Default 12 */
  slides?: number;
  /** How many are drafted so far */
  made?: number;
  /** The slide being drafted, checked or fixed (from 0): in the accent, in front */
  active?: number;
  /** A slide the check stopped on (from 0): red, lifted, in front */
  flagged?: number;
  className?: string;
}

/** The Job toast's glyph: the slides of a deck the agent is making, dealt into a hand as each one is drafted */
export function DeckGlyph({ phase, slides = 12, made = 0, active, flagged, className }: DeckGlyphProps) {
  const ang = (i: number) => -32 + i * 64 / Math.max(1, slides - 1);
  const stateOf = (i: number) => i === flagged ? 'bad' : i === active ? (phase === 'checking' ? 'chk' : 'now') : i < made ? 'made' : '';
  const card = (i: number, k: string) => (
    <g key={i} className={cx('dm-tst-cd', k && 'dm-' + k)} style={{ '--dm-a': ang(i).toFixed(2) + 'deg', '--dm-i': i } as CSSProperties}>
      <rect className="dm-tst-b" x="26" y="6" width="12" height="20" rx="2" /><path className="dm-tst-l" d="M28.5 10h6M28.5 13.5h7M28.5 17h4.5" pathLength={8} />
    </g>
  );
  // the slide being drafted, or the one the check stopped on, is drawn last, in front of the hand
  const front = [flagged, active].filter((i): i is number => i !== undefined && i >= 0 && i < slides);
  const order = [...Array.from({ length: slides }, (_, i) => i).filter(i => !front.includes(i)), ...front];
  const look = { idle: 'idle', reading: 'read', outlining: 'plan', drafting: 'plan', checking: 'plan', done: 'done', gone: 'gone' }[phase];
  return (
    <span className={cx('dm-tst-dk', 'dm-' + look, className)} aria-hidden="true">
      <svg viewBox="0 0 64 40">
        <g className="dm-tst-pg"><rect className="dm-tst-pp" x="23.5" y="6.5" width="17" height="22" rx="2.5" /><path className="dm-tst-pl" d="M27 12h10M27 15.5h8M27 19h10M27 22.5h6" /><path className="dm-tst-sc" d="M25.5 10h13" /></g>
        <g>{Array.from({ length: slides }, (_, i) => card(i, 'tst-gh'))}</g>
        <g>{order.map(i => card(i, stateOf(i)))}</g>
        <g className="dm-tst-ok"><circle cx="41" cy="27" r="6.5" /><path d="M38.3 27.1l1.9 1.9 3.5-3.6" /></g>
      </svg>
    </span>
  );
}

/* ---------- motion: the style's own, read from its tokens ---------- */
const REVEAL: Record<string, { part: Keyframe; ms: number; step: number; ease: string }> = {
  soft: { part: { opacity: 0, filter: 'blur(6px)', transform: 'translateY(8px)' }, ms: 760, step: 65, ease: 'cubic-bezier(.16,1,.3,1)' },
  clean: { part: { opacity: 0, transform: 'translateY(6px)' }, ms: 560, step: 50, ease: 'cubic-bezier(.23,1,.32,1)' },
  bp: { part: { opacity: 0, transform: 'translateY(4px)' }, ms: 320, step: 45, ease: 'cubic-bezier(.65,0,.25,1)' }
};
const motionOf = (el: Element) => {
  const cs = getComputedStyle(el), s = (v: string) => { const x = cs.getPropertyValue(v).trim(); return (x.endsWith('ms') ? parseFloat(x) : parseFloat(x) * 1000) || 340; };
  return { ease: cs.getPropertyValue('--dm-ease').trim() || 'ease', t: s('--dm-t'), fast: s('--dm-t-fast'), slow: s('--dm-t-slow'), reveal: REVEAL[cs.getPropertyValue('--dm-motion').trim()] ?? REVEAL.soft };
};
const boxIn = (el: Element, host: Element) => {
  const a = el.getBoundingClientRect(), b = host.getBoundingClientRect();
  return { left: a.left - b.left + 'px', top: a.top - b.top + 'px', width: a.width + 'px', height: a.height + 'px', borderRadius: getComputedStyle(el).borderTopLeftRadius };
};
/** A box that eases from one place to another in the slot: the toast growing out of its button, or going back into it */
const fly = (host: Element, from: Record<string, string>, to: Record<string, string>, ms: number, ease: string) => {
  const f = document.createElement('div'); f.className = 'dm-tst-fly'; Object.assign(f.style, from); host.appendChild(f);
  const a = f.animate([from, to], { duration: ms, easing: ease, fill: 'forwards' });
  const gone = () => f.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' }).finished.then(() => f.remove(), () => f.remove());
  return { done: a.finished.then(() => { gone(); }, () => { f.remove(); }), stop: () => { a.cancel(); f.remove(); } };
};

const MARK: Record<ToastStatus, ReactNode> = { success: <Icon name="ok" />, error: <Icon name="alert" />, warning: <Icon name="warn" />, info: <Icon name="info" />, stopped: <Icon name="pause" />, working: <Spin /> };
const STEP: Record<ToastStepStatus, { s: string; mark: ReactNode }> = {
  waiting: { s: 'wait', mark: <span className="dm-tst-pend" /> }, running: { s: 'now', mark: <Spin /> }, done: { s: 'done', mark: <Icon name="check" /> },
  failed: { s: 'bad', mark: <Icon name="alert" /> }, paused: { s: 'paused', mark: <Icon name="pause" /> }
};

/* the description: a new line crossfades; a counter ticks over at once (a change that keeps the words before its first
   number, like "Slide 3 of 12 · Revenue" becoming "Slide 4 of 12 · North") */
function Line({ text }: { text: string }) {
  const [shown, setShown] = useState(text), [out, setOut] = useState(false), reduce = useReducedMotion();
  const lead = (x: string) => { const m = x.match(/^(\D*)\d/); return m ? m[1] : null; };
  const same = (a: string, b: string) => { const l = lead(a); return !!l && l === lead(b); };
  useEffect(() => {
    if (text === shown) { setOut(false); return; }
    if (reduce || same(text, shown)) { setShown(text); return; }
    setOut(true);
    const t = setTimeout(() => { setShown(text); setOut(false); }, 170);
    return () => clearTimeout(t);
  }, [text, shown, reduce]);
  return <span className={cx('dm-sw dm-tst-de', out && 'dm-out')}>{shown}</span>;
}

export interface ToastCardProps {
  toast: ToastData;
  /** Called when it is closed: by Close, its countdown, a swipe or Escape */
  onClose: (reason: ToastDismissReason) => void;
  /** It is on its way out: it can't be reached, and with its own motion it plays its exit */
  leaving?: boolean;
  /** The button that started it: with its own motion it grows out of it and goes back into it */
  from?: RefObject<HTMLElement | null>;
  /** Whether the steps are open. Leave it out and the chevron keeps its own state */
  stepsOpen?: boolean;
  defaultStepsOpen?: boolean;
  onStepsOpenChange?: (open: boolean) => void;
  /** Holds the countdown while true, as the pointer or the focus on the card does (a stack open for reading holds them all) */
  paused?: boolean;
  /** `own` (the default) plays its own entrance and exit; `host` leaves where it sits and how it comes and goes to the
      component that places it, as `ToastStack` does */
  motion?: 'own' | 'host';
  /** A height to draw it at instead of its own; it clips what doesn't fit (a card behind the front one in a stack takes the
      front one's). It eases to it */
  height?: number;
  /** Called with its own height each time that changes: its words wrap, its steps or its footer open or shut */
  onHeight?: (height: number) => void;
  className?: string;
  /** Where its host places it. A swipe moves it on from its `transform` */
  style?: CSSProperties;
  inert?: boolean;
}

/** One Toast card on its own: the head (the glyph or the status mark, the words, the chevron, Stop or Close with its countdown
    ring), the steps and the footer, swiped or Escaped away. `Toast` shows one at a time; `ToastStack` stacks them */
export function ToastCard({ toast: t, onClose: close, leaving = false, from, stepsOpen, defaultStepsOpen = false, onStepsOpenChange, paused = false, motion = 'own', height, onHeight, className, style, inert }: ToastCardProps) {
  const [open, setOpen] = useControllable(stepsOpen, defaultStepsOpen, onStepsOpenChange);
  const own = motion === 'own';
  // the card eases to its new height as its words wrap or its steps and footer come and go, or to the height its host asks for
  const el = useRef<HTMLDivElement>(null), inner = useRef<HTMLDivElement>(null), ring = useRef<SVGRectElement>(null), reduce = useReducedMotion();
  const natural = useRef(0), first = useRef(true), want = useRef(height), report = useRef(onHeight);
  want.current = height; report.current = onHeight;
  const fit = () => {
    const card = el.current; if (!card || !natural.current) return;
    const h = want.current ?? natural.current;
    if (first.current) { card.style.transition = 'none'; card.style.height = h + 'px'; void card.offsetHeight; card.style.transition = ''; first.current = false; }
    else card.style.height = h + 'px';
  };
  useIsoLayoutEffect(() => {
    const w = inner.current; if (!w || typeof ResizeObserver === 'undefined') return;
    const measure = () => { const h = Math.ceil(w.offsetHeight); if (h === natural.current) return; natural.current = h; fit(); report.current?.(h); };
    const ro = new ResizeObserver(measure); ro.observe(w); measure();
    return () => ro.disconnect();
  }, []);
  useIsoLayoutEffect(fit, [height]);
  const status = t.status ?? 'success', working = status === 'working';
  const stop = working && t.onStop;
  // the footer keeps its last buttons while it folds shut, so they never vanish before it has closed
  const lastActs = useRef<ToastAction[]>([]);
  if (t.actions?.length) lastActs.current = t.actions;
  const acts = t.actions?.length ? t.actions : lastActs.current;

  /* coming in: out of its button when there is one, eased to its place, its parts one after another; or the style's entrance */
  const [flyIn] = useState(() => own && typeof window !== 'undefined' && !matchMedia('(prefers-reduced-motion: reduce)').matches && !!from?.current?.getClientRects().length);
  useIsoLayoutEffect(() => {
    const card = el.current, host = card?.parentElement, btn = from?.current;
    if (!flyIn || !card || !host || !btn) return;
    const m = motionOf(card), f = fly(host, boxIn(btn, host), boxIn(card, host), m.slow, m.ease);
    card.style.opacity = '0';
    f.done.then(() => {
      card.style.opacity = '';
      const { transform, ...look } = m.reveal.part;
      card.querySelectorAll('.dm-tst-hd > *').forEach((p, i) => {
        if (Object.keys(look).length) p.animate([{ offset: 0, ...look }, {}], { duration: m.reveal.ms, delay: i * m.reveal.step, easing: m.reveal.ease, fill: 'backwards' });
        if (transform) p.animate([{ transform }, { transform: 'none' }], { duration: m.reveal.ms, delay: i * m.reveal.step, easing: m.reveal.ease, fill: 'backwards' });
      });
    });
    return () => { f.stop(); card.style.opacity = ''; };
  }, []);
  /* going: back into its button when there is one, or the style's exit */
  useIsoLayoutEffect(() => {
    const card = el.current, host = card?.parentElement, btn = from?.current;
    if (!own || !leaving || !card || !host || reduce || !btn || !btn.getClientRects().length || card.style.transform) return;
    const m = motionOf(card), f = fly(host, boxIn(card, host), boxIn(btn, host), m.t, m.ease);
    card.animate([{ opacity: 1 }, { opacity: 0 }], { duration: m.fast * .6, fill: 'forwards' });
    return () => f.stop();
  }, [leaving]);

  /* the countdown: a ring round Close that drains; the pointer or the focus on the toast holds it, and so does `paused` */
  const cd = useRef<Animation | null>(null), still = useRef(paused);
  still.current = paused;
  const held = () => still.current || (!!el.current && (el.current.matches(':hover') || el.current.contains(document.activeElement)));
  const timed = !!t.duration && !working && !stop && !leaving;
  useEffect(() => {
    const r = ring.current; if (!timed || !r) return;
    const a = r.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: 100 }], { duration: t.duration, fill: 'forwards', easing: 'linear' });
    cd.current = a; if (held()) a.pause();
    a.onfinish = () => close('timeout');
    return () => { a.cancel(); cd.current = null; };
  }, [timed, t.id, status, t.title, t.duration]); // eslint-disable-line react-hooks/exhaustive-deps
  const hold = () => { if (cd.current?.playState === 'running') cd.current.pause(); };
  const go = () => setTimeout(() => { if (cd.current?.playState === 'paused' && !held()) cd.current.play(); }, 0);
  useEffect(() => { if (paused) hold(); else go(); }, [paused]); // eslint-disable-line react-hooks/exhaustive-deps

  /* swipe it away: it follows the finger or the pointer sideways (on from where its host placed it) and goes once it has moved
     far enough, or eases back */
  const base = style?.transform ? String(style.transform) + ' ' : '';
  const sw = useRef<{ x: number; y: number; t: number; dx: number; id: number; on: boolean } | null>(null);
  const onDown = (e: ReactPointerEvent) => { if (e.button || (e.target as Element).closest('button')) return; sw.current = { x: e.clientX, y: e.clientY, t: performance.now(), dx: 0, id: e.pointerId, on: false }; };
  const onMove = (e: ReactPointerEvent) => {
    const s = sw.current, card = el.current; if (!s || !card || e.pointerId !== s.id) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (!s.on) { if (Math.abs(dx) < 6 || Math.abs(dy) > Math.abs(dx)) return; s.on = true; card.setPointerCapture(e.pointerId); }
    s.dx = dx; card.style.transition = 'none'; card.style.transform = `${base}translateX(${dx}px)`; card.style.opacity = String(Math.max(.2, 1 - Math.abs(dx) / 260));
  };
  const onUp = (e: ReactPointerEvent) => {
    const s = sw.current, card = el.current; if (!s || !card || e.pointerId !== s.id) return; sw.current = null; if (!s.on) return;
    const v = Math.abs(s.dx) / Math.max(1, performance.now() - s.t), m = motionOf(card), dir = Math.sign(s.dx) || 1;
    card.style.transition = '';
    if (Math.abs(s.dx) > 90 || v > .6) { card.animate([{ transform: `${base}translateX(${s.dx}px)`, opacity: card.style.opacity }, { transform: `${base}translateX(${reduce ? s.dx : own ? dir * 420 : s.dx + dir * 140}px)`, opacity: 0 }], { duration: reduce ? m.fast : m.t, easing: m.ease, fill: 'forwards' }); close('swipe'); }
    else { if (own) card.animate([{ transform: `translateX(${s.dx}px)`, opacity: card.style.opacity }, { transform: 'none', opacity: 1 }], { duration: m.t, easing: m.ease }); card.style.transform = String(style?.transform ?? ''); card.style.opacity = style?.opacity !== undefined ? String(style.opacity) : ''; }
  };

  // (going back into the button needs the button on screen; a swiped toast has gone sideways already)
  const flyOut = leaving && !reduce && !!from?.current?.getClientRects().length && !el.current?.style.transform;
  const anim = !own ? undefined : leaving ? (flyOut ? undefined : 'dm-tst-out') : flyIn ? undefined : 'dm-tst-in';
  return (
    <div ref={el} className={cx('dm-tst-t dm-growing', anim, className)} inert={leaving || inert} style={{ ...style, '--dm-tst-gw': t.glyph ? '64px' : '20px' } as CSSProperties}
      onPointerEnter={hold} onPointerLeave={go} onFocus={hold} onBlur={go}
      onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); close('escape'); } }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <div ref={inner} className="dm-grow">
        <div className="dm-tst-hd">
          {/* a status mark that changes (a fix's spinner becoming its tick) crossfades in place */}
          {t.glyph ?? <span className="dm-tst-g dm-mx-ic" data-s={status} aria-hidden="true"><SwapIcon id={status}>{MARK[status]}</SwapIcon></span>}
          <div className="dm-tst-tx">
            <Swap className={cx('dm-tst-ti', working && 'dm-shim')}>{t.title}</Swap>
            {t.description !== undefined && <Line text={t.description} />}
          </div>
          <div className="dm-tst-hb">
            {!!t.steps?.length && <Tip label={open ? 'Hide steps' : 'Steps'}>
              <button type="button" className="dm-ib dm-tst-more" aria-expanded={open} aria-label={open ? 'Hide the steps' : 'Show the steps'} onClick={() => setOpen(!open)}><Icon name="chev-d" /></button>
            </Tip>}
            {stop
              ? <Tip label="Stop"><button type="button" className="dm-ib dm-tst-stop" aria-label="Stop the job" onClick={t.onStop}><Icon name="stop" /></button></Tip>
              : <Tip label="Close"><button type="button" className="dm-ib dm-tst-x" aria-label="Close" onClick={() => close('close')}>
                {timed && <svg className="dm-tst-ring" viewBox="0 0 28 28" aria-hidden="true"><rect className="dm-tst-tk" x=".75" y=".75" width="26.5" height="26.5" /><rect ref={ring} className="dm-tst-rn" x=".75" y=".75" width="26.5" height="26.5" pathLength={100} /></svg>}
                <Icon name="x" /></button></Tip>}
          </div>
        </div>
        {!!t.steps?.length && <Fold open={open} className="dm-tst-mf">
          <ol className="dm-tst-st" aria-label="Steps">
            {t.steps.map((s, i) => <li key={i} data-s={STEP[s.status].s}><span className="dm-tst-mk">{STEP[s.status].mark}</span><span className="dm-tst-lb">{s.label}</span><span className="dm-tst-vl">{s.detail}</span></li>)}
          </ol>
        </Fold>}
        <Fold open={!!t.actions?.length} className="dm-tst-ft">
          <div className="dm-tst-fi">
            {acts.map(a => <button key={a.label} type="button" className={cx('dm-pill dm-sm', a.variant === 'primary' ? 'dm-primary' : a.variant === 'warn' ? 'dm-warn' : 'dm-line')} onClick={a.onClick}>{a.label}</button>)}
          </div>
        </Fold>
      </div>
    </div>
  );
}

/** One toast that holds a job from start to finish: its glyph, its words and its buttons change in place as the work moves
    on, its steps open inside it, and Close drains a visible countdown. Plain toasts (a success or an error with one action)
    are the same card */
export function Toast({ toast, onDismiss, from, stepsOpen, defaultStepsOpen = false, onStepsOpenChange, className }: ToastProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useControllable(stepsOpen, defaultStepsOpen, onStepsOpenChange);
  // a closed toast goes straight away, whether or not the parent clears it
  const [closed, setClosed] = useState<ToastData['id']>();
  const shown = toast && toast.id !== closed ? toast : null;
  // the toast on screen, kept so it can play its exit after the prop moves on
  const [cur, setCur] = useState(shown);
  const [leaving, setLeaving] = useState<ToastData[]>([]);
  if ((shown?.id ?? null) !== (cur?.id ?? null)) {
    if (cur) setLeaving(l => [...l, cur]);
    setCur(shown);
  } else if (shown !== cur) setCur(shown);
  const slot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!leaving.length) return;
    const el = slot.current, ms = el ? motionOf(el).t : 340;
    const t = setTimeout(() => setLeaving(l => l.slice(1)), reduce ? 200 : ms);
    return () => clearTimeout(t);
  }, [leaving, reduce]);

  /* what screen readers hear: the announcement (or the title) each time it changes; an error at once, the rest politely */
  const [said, setSaid] = useState<{ text: string; loud: boolean }>({ text: '', loud: false });
  const say = shown ? shown.announce ?? shown.title : '';
  useEffect(() => {
    if (!say) return;
    setSaid({ text: '', loud: false });
    const t = setTimeout(() => setSaid({ text: say, loud: shown?.status === 'error' }), 60);
    return () => clearTimeout(t);
  }, [say]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = (id: ToastData['id'], r: ToastDismissReason) => {
    // Escape hands the focus back to the button that started it
    if (r === 'escape' && from?.current) setTimeout(() => from.current?.focus({ preventScroll: true }), 0);
    setClosed(id); onDismiss?.(id, r);
  };
  return (
    <div data-dm="" ref={slot} className={cx('dm-tst-slot', className)}>
      {leaving.filter(t => t.id !== cur?.id).map(t => <ToastCard key={'t' + t.id} toast={t} leaving onClose={() => {}} stepsOpen={open} onStepsOpenChange={() => {}} from={from} />)}
      {cur && <ToastCard key={'t' + cur.id} toast={cur} onClose={r => close(cur.id, r)} stepsOpen={open} onStepsOpenChange={setOpen} from={from} />}
      <div className="dm-tst-sr" role="status" aria-live="polite">{said.loud ? '' : said.text}</div>
      <div className="dm-tst-sr" role="alert" aria-live="assertive">{said.loud ? said.text : ''}</div>
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
- [Web search](https://designme.dev/components/web-search.md): The agent's searches as a trail: what it asked, what came back, what it read or skipped, and the answer with its sources.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.
- [Thinking states](https://designme.dev/components/thinking-states.md): Six thinking indicators to pick from, each with a status line.

All components: https://designme.dev/llms.txt
