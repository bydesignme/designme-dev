# Toast stack

> Agent notifications that stack and fan out on hover.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/toast-stack

## Install

```sh
npx designme add toast-stack          # HTML, CSS and JS, with the shared core
npx designme add toast-stack --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Toast stack collects the notifications an agent sends while it works and piles them into a small deck, newest in front. Hover the deck and it fans out into a list so a person can read each one and close the ones they are done with.

### When to use it

- When an agent finishes several things in a row, like tests passing, a PR opening and frames syncing.
- When notifications should stay on screen until someone reads them, without covering the page.
- When you want a quiet corner of the app that shows the last few events at a glance.
- When each event needs its own icon colour so people can tell good news from warnings.

### What it does

- Pass `toasts` oldest first. The last item sits at the front and older ones step back, shrink and fade.
- Hovering the stack fans it into a list that grows to fit the four front toasts. Set `expanded` to fan it yourself.
- Each toast has an icon badge, a bold `title`, an optional `detail` line and an optional `time` like "now" or "2m".
- `tone` colours the badge, with status tones (ok, warn, bad, merge) and colour names like blue, purple and teal.
- The close button calls `onDismiss` with the toast id. Remove it from `toasts` and it slides off to the right as it fades.
- `max` caps how many toasts stay mounted (6 by default). Older ones drop off the back, and new ones rise in from below.

### Accessibility

- The stack is an `aria-live="polite"` region, so screen readers announce new toasts.
- Each close button is a real button with `aria-label="Dismiss"` and a Dismiss tooltip.
- A toast that is sliding away is marked `inert`, so it cannot be focused or clicked during its exit.
- Under `prefers-reduced-motion: reduce`, the shared stylesheet cuts animations and transitions to almost nothing.

## Usage in React

```tsx
import { ToastStack } from '@/components/designme/toast-stack/ToastStack';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ToastStack, type StackToast } from './ToastStack';
import { Icon } from '../lib/icons';
import { useScript } from '../lib/useScript';

/* ---------- Toast stack: three notifications arrive, then one now and then; the button sends more, hover fans them out ---------- */
const POOL: Omit<StackToast, 'id'>[] = [
  { icon: 'ok', tone: 'ok', title: 'Tests passed', detail: '42 of 42 in 38s' },
  { icon: 'pr', tone: 'merge', title: 'PR #412 is ready', detail: 'Use shared spacing tokens' },
  { icon: 'figma', tone: 'purple', title: 'Frames synced', detail: '6 frames from Pricing.fig' },
  { icon: 'warn', tone: 'warn', title: 'Budget at 80%', detail: '1,600 of 2,000 credits' },
  { icon: 'spark', tone: 'blue', title: 'Draft written', detail: 'Launch email, 2 subject lines' }
];
export default function ToastStackDemo() {
  const [toasts, setToasts] = useState<StackToast[]>([]);
  const sent = useRef(0);
  const add = () => {
    const n = sent.current++;
    setToasts(list => {
      // keeps the six newest; the newest says "now" and the older ones age by two minutes each
      const next = [...list, { ...POOL[n % POOL.length], id: n }].slice(-6);
      return next.map((t, i) => ({ ...t, time: i === next.length - 1 ? 'now' : (next.length - 1 - i) * 2 + 'm' }));
    });
  };
  const hover = useRef(false);
  useScript(async ({ wait }) => {
    for (let i = 0; i < 3; i++) { await wait(i ? 700 : 400); add(); }
    // a new one now and then, held back while the stack is fanned out under the pointer
    for (;;) { await wait(3800); if (!hover.current) add(); }
  });
  return (
    <div style={{ width: '100%', minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
      <div style={{ marginBlock: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onPointerEnter={() => { hover.current = true; }} onPointerLeave={() => { hover.current = false; }}>
        <ToastStack toasts={toasts} onDismiss={id => setToasts(list => list.filter(t => t.id !== id))} />
      </div>
      <div data-dm=""><button type="button" className="dm-pill dm-soft dm-sm" onClick={add}><Icon name="bell" />Send notification</button></div>
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `toasts` | `StackToast[]` | Oldest first. The last one sits in front |
| `onDismiss` (optional) | `(id: StackToast['id']) => void` | Called when a toast's close button is pressed. Remove it from `toasts` and it slides away |
| `expanded` (optional) | `boolean` | Fans the stack out. Leave it out to fan it while the pointer is over it |
| `max` (optional) | `number` | How many toasts stay mounted. Older ones drop off the back |
| `className` (optional) | `string` |  |

## Questions

**How do I add a new notification?**

Append an object with a unique `id`, an `icon` and a `title` to the end of your `toasts` array. It rises in from below and becomes the front card.

**Does the stack remove a toast when I press its close button?**

No. The button only calls `onDismiss(id)`. Filter that toast out of `toasts` in your state and the component animates it away.

**Can I keep the stack fanned out all the time?**

Yes. Pass `expanded={true}` to keep it open, or `expanded={false}` to keep it stacked. Leave it out and it fans while the pointer is over it.

**What happens when more toasts arrive than fit?**

Only the newest `max` toasts stay mounted, six by default. In the stacked view only the front three are visible, and the fanned list shows the front four.

## Source

`ToastStack.tsx`, as `npx designme add toast-stack --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useIsoLayoutEffect } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Tip } from '../lib/motion';
import '../designme.css';
import './toast-stack.css';

export type ToastStackTone = 'neutral' | 'ok' | 'warn' | 'bad' | 'merge' | 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

export interface StackToast {
  id: string | number;
  /** The icon in the round badge */
  icon: IconName;
  /** Colours the badge. Defaults to neutral */
  tone?: ToastStackTone;
  title: ReactNode;
  /** The quiet line under the title */
  detail?: ReactNode;
  /** Like "now" or "2m" */
  time?: string;
}

export interface ToastStackProps {
  /** Oldest first. The last one sits in front */
  toasts: StackToast[];
  /** Called when a toast's close button is pressed. Remove it from `toasts` and it slides away */
  onDismiss?: (id: StackToast['id']) => void;
  /** Fans the stack out. Leave it out to fan it while the pointer is over it */
  expanded?: boolean;
  /** How many toasts stay mounted. Older ones drop off the back */
  max?: number;
  className?: string;
}

const TONE: Record<ToastStackTone, [string, string]> = {
  neutral: ['--dm-fg2', '--dm-chip'], ok: ['--dm-ok', '--dm-ok-bg'], warn: ['--dm-warn', '--dm-warn-bg'], bad: ['--dm-bad', '--dm-bad-bg'],
  merge: ['--dm-merge', '--dm-merge-bg'], blue: ['--dm-pb', '--dm-pb-bg'], purple: ['--dm-pl', '--dm-pl-bg'], green: ['--dm-pm', '--dm-pm-bg'],
  orange: ['--dm-pp', '--dm-pp-bg'], red: ['--dm-pr', '--dm-pr-bg'], yellow: ['--dm-py', '--dm-py-bg'], pink: ['--dm-pk', '--dm-pk-bg'], teal: ['--dm-pt', '--dm-pt-bg']
};
// a new toast rises in from below, blurred, before it takes its place
const ARRIVING: CSSProperties = { transform: 'translateY(24px) scale(.96)', opacity: 0, filter: 'blur(6px)' };

/** Where each toast sits: stacked into a deck, or fanned out into a list. `i` counts from the front */
function place(i: number, fan: boolean, heights: number[]): CSSProperties {
  if (fan) {
    let y = 0;
    for (let k = 0; k < Math.min(i, 3); k++) y += heights[k] + 8;
    return { transform: `translateY(${-y}px)`, opacity: i > 3 ? 0 : 1, filter: 'none', zIndex: 100 - i };
  }
  const k = Math.min(i, 3);
  return { transform: `translateY(${-k * 10}px) scale(${1 - k * .05})`, opacity: i > 2 ? 0 : 1 - k * .15, filter: i ? 'blur(.3px)' : 'none', zIndex: 100 - i };
}

/** Notifications that stack into a deck and fan out when you hover them. */
export function ToastStack({ toasts, onDismiss, expanded, max = 6, className }: ToastStackProps) {
  const live = toasts.slice(-max);
  const [hover, setHover] = useState(false);
  const fan = expanded ?? hover;

  // heights of the toasts, front first, so the fanned list leaves the right gaps
  const els = useRef(new Map<StackToast['id'], HTMLDivElement>());
  const [heights, setHeights] = useState<Record<string, number>>({});
  const front = live.slice().reverse();
  const hs = front.map(t => heights[t.id] ?? 0);
  const ids = live.map(t => t.id).join('\u0000');
  useIsoLayoutEffect(() => {
    const measure = () => setHeights(prev => {
      const next: Record<string, number> = {};
      els.current.forEach((el, id) => { next[id] = el.offsetHeight; });
      return Object.keys(next).length === Object.keys(prev).length && Object.keys(next).every(k => prev[k] === next[k]) ? prev : next;
    });
    measure();
    const ro = new ResizeObserver(measure);
    els.current.forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, [ids]);

  // new toasts wait two frames in their arriving pose, so the move to their place animates
  const [placed, setPlaced] = useState<Set<StackToast['id']>>(() => new Set());
  useEffect(() => {
    const fresh = live.filter(t => !placed.has(t.id)).map(t => t.id);
    if (!fresh.length) return;
    let raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => setPlaced(p => new Set([...p, ...fresh]))); });
    return () => cancelAnimationFrame(raf);
  }, [ids]); // eslint-disable-line react-hooks/exhaustive-deps

  // a toast that leaves keeps its place for a moment and slides off to the right as it fades.
  // It stays at the same spot in the DOM, so its transition is not cut short by a move
  type Leaving = { toast: StackToast; style: CSSProperties; at: number };
  const [prev, setPrev] = useState({ ids, live, fan, hs });
  const [leaving, setLeaving] = useState<Leaving[]>([]);
  if (prev.ids !== ids) {
    const now = new Set(live.map(t => t.id)), n = prev.live.length;
    const gone = prev.live.flatMap((t, at): Leaving[] => {
      if (now.has(t.id) || leaving.some(l => l.toast.id === t.id)) return [];
      const was = place(n - 1 - at, prev.fan, prev.hs);
      return [{ toast: t, at, style: { ...was, transform: was.transform + ' translateX(30px)', opacity: 0 } }];
    });
    setPrev({ ids, live, fan, hs });
    if (gone.length) setLeaving(l => [...l, ...gone]);
  } else if (prev.fan !== fan || prev.hs.join() !== hs.join()) setPrev({ ids, live, fan, hs });
  const leavingIds = leaving.map(l => l.toast.id).join('\u0000');
  useEffect(() => {
    if (!leaving.length) return;
    const t = setTimeout(() => setLeaving(l => l.filter(x => !leaving.includes(x))), 400);
    return () => clearTimeout(t);
  }, [leavingIds]); // eslint-disable-line react-hooks/exhaustive-deps

  // the stack grows to fit the four front toasts when it fans out
  const fanh = live.length ? hs.slice(0, 4).reduce((a, b) => a + b + 8, 0) - 8 || 96 : undefined;

  const card = (t: StackToast, style: CSSProperties, gone = false) => {
    const [fg, bg] = TONE[t.tone ?? 'neutral'];
    return (
      <div key={t.id} className="dm-tsk-c" style={style} inert={gone} ref={el => { if (gone) return; if (el) els.current.set(t.id, el); else els.current.delete(t.id); }}>
        <span className="dm-g" style={{ color: `var(${fg})`, background: `var(${bg})` }}><Icon name={t.icon} /></span>
        <div className="dm-tx"><b>{t.title}</b>{t.detail && <span>{t.detail}</span>}</div>
        {t.time && <span className="dm-t">{t.time}</span>}
        <Tip label="Dismiss"><button type="button" className="dm-ib" aria-label="Dismiss" onClick={() => onDismiss?.(t.id)}><Icon name="x" size="xs" /></button></Tip>
      </div>
    );
  };

  return (
    <div data-dm="" className={cx('dm-tsk-stack', fan && 'dm-fan', className)} aria-live="polite"
      style={fanh !== undefined ? { '--dm-fanh': fanh + 'px' } as CSSProperties : undefined}
      onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      {leaving.slice().sort((a, b) => a.at - b.at).reduce((all, l) => { all.splice(Math.min(l.at, all.length), 0, card(l.toast, l.style, true)); return all; },
        live.map(t => card(t, placed.has(t.id) ? place(front.indexOf(t), fan, hs) : ARRIVING)))}
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
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context window is, with session and weekly limits, in one small popover.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Grouped tasks with live progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.

All components: https://designme.dev/llms.txt
