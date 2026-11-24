# Toast

> One notification that changes shape with its state.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/toast

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

Toast shows one notification at a time and lets it change as the agent's work moves on. A loading toast can turn into a success, and an error can offer Retry, all in the same spot on screen.

### When to use it

- When an agent action needs a short confirmation, like "Changes applied" with an Undo button.
- When a task starts as loading and you want the same toast to report the result.
- When a failure needs a single clear next step, such as Retry.
- When only the latest message matters and older ones should step aside.

### What it does

- Four tones: `success`, `error`, `info` and `loading`. Each picks its own icon and colour, and loading shows a spinner, with a highlight sweeping across its title. In Clean the colour is on the icon alone, with no disc behind it, and only `success` (green) and `error` (red) take one; `info` and `loading` stay grey.
- Give the toast a new `id` and the new one rises in while the old one slips away. Keep the `id` to update the text in place.
- The `description` line crossfades when it changes, so progress text can update without a jump.
- One optional `action` adds a button on the toast's row, just before the close button: the message, then the action, then close at the far end. It is a `ghost` button by default (the demo's Undo, Retry and Open all are), or `primary` on the accent. On a narrow toast (340px or less, as on a phone), or when the words run past two lines beside it, the action moves to a row of its own under the message, its words ending under the close button's glyph, and close stays at the top end.
- Set `action.busy` and the button label turns into a spinner. Clicks are ignored while it is busy.
- Set `action.done` and the button label turns into the green tick, as Undo does once it has undone. The button stays in place but is turned off. Whichever it turns into, the button eases to its new width.
- The close button hides the toast straight away and calls `onDismiss`, even if your state has not cleared it yet.

### Accessibility

- Each toast has `role="status"` inside an `aria-live="polite"` slot, so changes are announced without interrupting.
- The action button sets `aria-busy` while `busy` is true. Once `done` it sets `aria-disabled` and is named by `action.doneLabel` (Done if you leave it out), since the tick has no words.
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
import { useTakeover } from '../lib/useScript';

/* ---------- Toast: four states; Undo and Retry change the toast, loading turns into the preview link, and a toast with a timer leaves when it runs out ---------- */
type Kind = 'ok' | 'err' | 'info' | 'load';

export default function ToastDemo() {
  const [kind, setKind] = useState<Kind>('ok');
  const [toast, setToast] = useState<ToastData | null>(null);
  const current = useRef<ToastData['id'] | null>(null);
  const next = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ref = useRef<HTMLDivElement>(null), mine = useTakeover(ref);
  const later = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => { timers.current.forEach(clearTimeout); if (life.current) clearTimeout(life.current.t); }, []);

  const update = (id: number, patch: Partial<ToastData>) => setToast(t => (t && t.id === id ? { ...t, ...patch } : t));
  // success and info time out like real toasts, after 10 seconds as they carry an action: hovering holds the timer, and when it runs out the toast leaves and comes
  // back (until you take over: then it stays gone until you pick one)
  const life = useRef<{ t?: ReturnType<typeof setTimeout>; id: number; k: Kind; left: number; at: number } | null>(null);
  const arm = (id: number, k: Kind, ms: number) => {
    if (life.current) clearTimeout(life.current.t);
    life.current = { id, k, left: ms, at: Date.now(), t: setTimeout(() => {
      if (current.current !== id) return;
      current.current = null; setToast(null); life.current = null;
      later(1100, () => { if (current.current === null && !mine()) show(k); });
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
      action: { label: 'Undo', onClick: () => update(id, { title: 'Changes undone', description: 'PricingCard is back as it was', action: { label: 'Undo', doneLabel: 'Undone', done: true, onClick: () => {} } }) } });
    if (k === 'err') setToast({ id, tone: 'error', title: 'Could not push to main', description: 'The branch is protected',
      action: { label: 'Retry', onClick: () => {
        setToast(t => (t && t.id === id && t.action ? { ...t, action: { ...t.action, busy: true } } : t));
        later(1200, () => { if (current.current === id) show('ok'); });
      } } });
    if (k === 'info') setToast({ id, tone: 'info', title: 'Preview is ready', description: 'pricing-spacing.preview.app', action: { label: 'Open', onClick: () => {} } });
    if (k === 'ok' || k === 'info') arm(id, k, 10000); else if (life.current) { clearTimeout(life.current.t); life.current = null; }
    if (k === 'load') {
      setToast({ id, tone: 'loading', title: 'Deploying preview', description: 'Building 3 pages' });
      later(2600, () => { if (current.current === id) show('info'); });
    }
  };
  useEffect(() => { const t = setTimeout(() => show('ok'), 400); return () => clearTimeout(t); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Demo ref={ref} switcher={<Seg label="State" value={kind} onChange={show} options={[{ value: 'ok', label: 'Success' }, { value: 'err', label: 'Error' }, { value: 'info', label: 'Info' }, { value: 'load', label: 'Loading' }]} />}>
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

**Does the toast close itself after a few seconds?**

No, the component has no timer. Set `toast` to null from your own timeout when you want it gone. The demo does this for success and info after 10 seconds, since they carry an action (Undo, Open) that needs time to reach, and pauses the timer on hover. Keep a toast with an action up for at least 10 seconds, or until it is dismissed.

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
import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Spin, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './toast.css';

export type ToastTone = 'success' | 'error' | 'info' | 'loading';

export interface ToastData {
  /** A new id slides a new toast in and the old one away. Keep the id to change the text in place */
  id: string | number;
  /** Picks the icon and its colour (in Clean only success and error take colour). loading spins */
  tone?: ToastTone;
  title: string;
  /** The quieter line under the title. Crossfades when it changes */
  description?: string;
  /** The one action, a button on the toast's row just before the close button, like Undo or Retry: ghost (the usual), or
      primary on the accent (ink, the old name, still works). On a narrow toast, or when the words run past two lines, it
      moves to a row of its own under them, at the end. A toast with an action should stay at least 10 seconds.
      busy swaps its label for a spinner; done swaps it for the green tick and turns the button off (Undo once it has undone).
      Either way the button eases to its new width */
  action?: { label: string; onClick: () => void; variant?: 'ghost' | 'primary' | 'ink'; busy?: boolean; done?: boolean; doneLabel?: string };
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

const cssMs = (el: Element, v: string) => { const s = getComputedStyle(el).getPropertyValue(v).trim(); return (s.endsWith('ms') ? parseFloat(s) : parseFloat(s) * 1000) || 340; };

function Card({ toast, leaving, onDismiss }: { toast: ToastData; leaving: boolean; onDismiss: () => void }) {
  const tone = TONES[toast.tone ?? 'success'], a = toast.action;
  // a pressed action never goes blank and keeps no room for what it turns into: it shows its new content and eases from its
  // old width to its new one
  const reduce = useReducedMotion(), btn = useRef<HTMLButtonElement>(null), w = useRef(0), tx = useRef<HTMLDivElement>(null);
  // the action sits on the toast's row, before the close button; when the words run past two lines beside it, it moves to a
  // row of its own under them (on a narrow toast, a phone, the stylesheet does that whatever the words)
  const [wrap, setWrap] = useState(false);
  useIsoLayoutEffect(() => {
    const el = tx.current; if (!el || !a) { setWrap(false); return; }
    const lines = new Set<number>(), tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) { const g = document.createRange(); g.selectNodeContents(n); Array.from(g.getClientRects()).forEach(b => { if (b.width > 1) lines.add(Math.round(b.top / 4)); }); }
    if (lines.size > 2) setWrap(true);
  }, [toast.id, !!a]);
  const look = a ? (a.done ? 'done' : a.busy ? 'busy' : a.label) : '';
  useIsoLayoutEffect(() => {
    const b = btn.current; if (!b) { w.current = 0; return; }
    const w1 = b.getBoundingClientRect().width, w0 = w.current; w.current = w1;
    if (w0 && !reduce && Math.abs(w1 - w0) > .5) b.animate([{ width: w0 + 'px' }, { width: w1 + 'px' }], { duration: cssMs(b, '--dm-t'), easing: getComputedStyle(b).getPropertyValue('--dm-ease').trim() || 'ease' });
  }, [look]);
  return (
    <div className={cx('dm-tst-t', leaving ? 'dm-tst-out' : 'dm-tst-in', wrap && 'dm-wrap')} role="status" inert={leaving}>
      <span className="dm-g" data-tone={toast.tone ?? 'success'} style={{ color: tone.color, background: tone.bg }}>{tone.icon ? <Icon name={tone.icon} /> : <Spin />}</span>
      <div className="dm-tx" ref={tx}><b className={toast.tone === 'loading' ? 'dm-shim' : undefined}>{toast.title}</b>{toast.description !== undefined && <Swap>{toast.description}</Swap>}</div>
      <div className="dm-acts">
        {a && <button type="button" ref={btn} className={cx('dm-pill dm-sm', a.variant === 'primary' || a.variant === 'ink' ? 'dm-primary' : 'dm-ghost', a.done && 'dm-done')} aria-busy={a.busy || undefined}
          aria-disabled={a.done || undefined} aria-label={a.done ? a.doneLabel ?? 'Done' : undefined} onClick={() => { if (!a.busy && !a.done) a.onClick(); }}>{a.done ? <Icon name="check" /> : a.busy ? <Spin /> : a.label}</button>}
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
- [Agent tree](https://designme.dev/components/agent-tree.md): An orchestrator and its sub-agents, with cost rolled up per branch.
- [Agent inbox](https://designme.dev/components/agent-inbox.md): Every run that needs you, is running or is done, in one list.
- [Trace view](https://designme.dev/components/trace-view.md): One agent run as a waterfall of spans, with latency and tokens.
- [Web search](https://designme.dev/components/web-search.md): The agent's searches as a trail: what it asked, what came back, what it read or skipped, and the answer with its sources.
- [Browser session](https://designme.dev/components/browser-session.md): The agent browsing for you, step by step, with Pause and Take over.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.
- [Thinking states](https://designme.dev/components/thinking-states.md): Six thinking indicators to pick from, each with a status line.

All components: https://designme.dev/llms.txt
