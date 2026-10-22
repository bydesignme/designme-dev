# Toast

> One notification that changes shape with its state.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/toast

## Install

```sh
npx designme add toast          # HTML, CSS and JS, with the shared core
npx designme add toast --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Toast shows one notification at a time and lets it change as the agent's work moves on. A loading toast can turn into a success, and an error can offer Retry, all in the same spot on screen.

### When to use it

- When an agent action needs a short confirmation, like "Changes applied" with an Undo button.
- When a task starts as loading and you want the same toast to report the result.
- When a failure needs a single clear next step, such as Retry.
- When only the latest message matters and older ones should step aside.

### What it does

- Four tones: `success`, `error`, `info` and `loading`. Each picks its own icon and colour, and loading shows a spinner.
- Give the toast a new `id` and the new one rises in while the old one slips away. Keep the `id` to update the text in place.
- The `description` line crossfades when it changes, so progress text can update without a jump.
- An optional `action` adds a button before the close button, in a `ghost` or `ink` style.
- Set `action.busy` and the button label turns into a spinner. Clicks are ignored while it is busy.
- The close button hides the toast straight away and calls `onDismiss`, even if your state has not cleared it yet.

### Accessibility

- Each toast has `role="status"` inside an `aria-live="polite"` slot, so changes are announced without interrupting.
- The action button sets `aria-busy` while `busy` is true.
- The close button has `aria-label="Dismiss"`, and a toast that is leaving is `inert`.
- With reduced motion turned on, the exit animation is skipped and the text swap happens at once.

## Usage in React

```tsx
import { Toast } from '@/components/designme/toast/Toast';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { Toast, type ToastData } from './Toast';
import { Seg } from '../lib/motion';
import { Demo } from '../lib/Demo';

/* ---------- Toast: four states; Undo and Retry change the toast, loading turns into the preview link, and a toast with a timer leaves when it runs out ---------- */
type Kind = 'ok' | 'err' | 'info' | 'load';

export default function ToastDemo() {
  const [kind, setKind] = useState<Kind>('ok');
  const [toast, setToast] = useState<ToastData | null>(null);
  const current = useRef<ToastData['id'] | null>(null);
  const next = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => { timers.current.forEach(clearTimeout); if (life.current) clearTimeout(life.current.t); }, []);

  const update = (id: number, patch: Partial<ToastData>) => setToast(t => (t && t.id === id ? { ...t, ...patch } : t));
  // success and info time out like real toasts: hovering holds the timer, and when it runs out the toast leaves and comes back
  const life = useRef<{ t?: ReturnType<typeof setTimeout>; id: number; k: Kind; left: number; at: number } | null>(null);
  const arm = (id: number, k: Kind, ms: number) => {
    if (life.current) clearTimeout(life.current.t);
    life.current = { id, k, left: ms, at: Date.now(), t: setTimeout(() => {
      if (current.current !== id) return;
      current.current = null; setToast(null); life.current = null;
      later(1100, () => { if (current.current === null) show(k); });
    }, ms) };
  };
  const hold = (on: boolean) => {
    const l = life.current; if (!l || current.current !== l.id) return;
    if (on) { clearTimeout(l.t); l.left -= Date.now() - l.at; } else arm(l.id, l.k, Math.max(400, l.left));
  };
  const show = (k: Kind) => {
    const id = ++next.current;
    current.current = id; setKind(k);
    if (k === 'ok') setToast({ id, tone: 'success', title: 'Changes applied', description: '4 files updated in PricingCard',
      action: { label: 'Undo', onClick: () => update(id, { title: 'Changes undone', description: 'PricingCard is back as it was', action: undefined }) } });
    if (k === 'err') setToast({ id, tone: 'error', title: 'Could not push to main', description: 'The branch is protected',
      action: { label: 'Retry', variant: 'ink', onClick: () => {
        setToast(t => (t && t.id === id && t.action ? { ...t, action: { ...t.action, busy: true } } : t));
        later(1200, () => { if (current.current === id) show('ok'); });
      } } });
    if (k === 'info') setToast({ id, tone: 'info', title: 'Preview is ready', description: 'pricing-spacing.preview.app', action: { label: 'Open', onClick: () => {} } });
    if (k === 'ok' || k === 'info') arm(id, k, 5200); else if (life.current) { clearTimeout(life.current.t); life.current = null; }
    if (k === 'load') {
      setToast({ id, tone: 'loading', title: 'Deploying preview', description: 'Building 3 pages' });
      later(2600, () => { if (current.current === id) show('info'); });
    }
  };
  useEffect(() => { const t = setTimeout(() => show('ok'), 400); return () => clearTimeout(t); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Demo switcher={<Seg label="State" value={kind} onChange={show} options={[{ value: 'ok', label: 'Success' }, { value: 'err', label: 'Error' }, { value: 'info', label: 'Info' }, { value: 'load', label: 'Loading' }]} />}>
      <div style={{ display: 'contents' }} onPointerEnter={() => hold(true)} onPointerLeave={() => hold(false)}>
        <Toast toast={toast} onDismiss={() => { current.current = null; setToast(null); }} />
      </div>
    </Demo>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `toast` | `ToastData \| null` | The toast to show, or null for none |
| `onDismiss` (optional) | `(id: ToastData['id']) => void` | Called by the close button. The toast leaves either way |
| `className` (optional) | `string` |  |

## Questions

**Does the toast close itself after a few seconds?**

No, the component has no timer. Set `toast` to null from your own timeout when you want it gone. The demo does this for success and info, and pauses the timer on hover.

**How do I turn a loading toast into a success toast?**

Keep the same `id` and change `tone`, `title` and `description`. The card stays in place and the description crossfades. Use a new `id` if you want a fresh toast to slide in instead.

**How do I show a spinner on Retry while the agent tries again?**

Set `action.busy` to true. The button shows a spinner, gets `aria-busy`, and ignores further clicks until you clear it.

**What does `onDismiss` need to do?**

The toast hides itself when its close button is pressed, so `onDismiss` is for your own state. Clearing `toast` there keeps the two in sync.

## Source

`Toast.tsx`, as `npx designme add toast --react` installs it:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { cx } from '../lib/cx';
import { useReducedMotion } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Spin, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './toast.css';

export type ToastTone = 'success' | 'error' | 'info' | 'loading';

export interface ToastData {
  /** A new id slides a new toast in and the old one away. Keep the id to change the text in place */
  id: string | number;
  /** Picks the icon and its colour. loading spins */
  tone?: ToastTone;
  title: string;
  /** The quieter line under the title. Crossfades when it changes */
  description?: string;
  /** A button before the close button, like Undo or Retry. busy swaps its label for a spinner */
  action?: { label: string; onClick: () => void; variant?: 'ghost' | 'ink'; busy?: boolean };
}

export interface ToastProps {
  /** The toast to show, or null for none */
  toast: ToastData | null;
  /** Called by the close button. The toast leaves either way */
  onDismiss?: (id: ToastData['id']) => void;
  className?: string;
}

const TONES: Record<ToastTone, { icon: 'ok' | 'alert' | 'info' | null; color: string; bg: string }> = {
  success: { icon: 'ok', color: 'var(--dm-ok)', bg: 'var(--dm-ok-bg)' },
  error: { icon: 'alert', color: 'var(--dm-bad)', bg: 'var(--dm-bad-bg)' },
  info: { icon: 'info', color: 'var(--dm-pb)', bg: 'var(--dm-pb-bg)' },
  loading: { icon: null, color: 'var(--dm-fg)', bg: 'var(--dm-chip)' }
};

function Card({ toast, leaving, onDismiss }: { toast: ToastData; leaving: boolean; onDismiss: () => void }) {
  const tone = TONES[toast.tone ?? 'success'], a = toast.action;
  return (
    <div className={cx('dm-tst-t', leaving ? 'dm-tst-out' : 'dm-tst-in')} role="status" inert={leaving}>
      <span className="dm-g" style={{ color: tone.color, background: tone.bg }}>{tone.icon ? <Icon name={tone.icon} /> : <Spin />}</span>
      <div className="dm-tx"><b>{toast.title}</b>{toast.description !== undefined && <Swap>{toast.description}</Swap>}</div>
      <div className="dm-acts">
        {a && <button type="button" className={cx('dm-pill dm-sm', a.variant === 'ink' ? 'dm-ink' : 'dm-ghost')} aria-busy={a.busy || undefined} onClick={() => { if (!a.busy) a.onClick(); }}>{a.busy ? <Spin /> : a.label}</button>}
        <Tip label="Dismiss"><button type="button" className="dm-ib" aria-label="Dismiss" onClick={onDismiss}><Icon name="x" /></button></Tip>
      </div>
    </div>
  );
}

/** One toast at a time: a new one rises in while the last one slips away. */
export function Toast({ toast, onDismiss, className }: ToastProps) {
  const reduce = useReducedMotion();
  // the close button hides the toast straight away, whether or not the parent clears it
  const [closed, setClosed] = useState<ToastData['id']>();
  const shown = toast && toast.id !== closed ? toast : null;
  // the toast on screen, kept so it can play its exit after the prop moves on
  const [cur, setCur] = useState(shown);
  const [leaving, setLeaving] = useState<ToastData[]>([]);
  if ((shown?.id ?? null) !== (cur?.id ?? null)) {
    if (cur) setLeaving(l => [...l, cur]);
    setCur(shown);
  } else if (shown !== cur) setCur(shown);
  useEffect(() => {
    if (!leaving.length) return;
    const t = setTimeout(() => setLeaving(l => l.slice(1)), reduce ? 0 : 300);
    return () => clearTimeout(t);
  }, [leaving, reduce]);

  return (
    <div data-dm="" className={cx('dm-tst-slot', className)} aria-live="polite">
      {leaving.filter(t => t.id !== cur?.id).map(t => <Card key={'t' + t.id} toast={t} leaving onDismiss={() => {}} />)}
      {cur && <Card key={'t' + cur.id} toast={cur} leaving={false} onDismiss={() => { setClosed(cur.id); onDismiss?.(cur.id); }} />}
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
- [Context meter](https://designme.dev/components/context-meter.md): How full the context window is, with session and weekly limits, in one small popover.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Grouped tasks with live progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.

All components: https://designme.dev/llms.txt
