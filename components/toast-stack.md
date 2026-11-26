# Toast stack

> Agent notifications that stack and fan out on hover.

Components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/toast-stack

## Install

```sh
npx designme add toast-stack          # HTML, CSS and JS, with the shared core
npx designme add toast-stack --react  # React 19 component and its CSS
npx designme add toast-stack --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/toast-stack.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/toast-stack.json  # Astro
```

## About

Toast stack collects the news an agent sends while it works and piles it into a small deck, newest in front. Each toast in it is a Toast card, so a job keeps its live glyph, its steps and its buttons, and a problem can become its fix in the same card. Hover the deck, or Tab into it, and it fans out into a list so a person can read each card, act on it and close the ones they are done with.

### When to use it

- When an agent sends several things in a row, like a job in progress, tests failing and frames syncing, and each should stay readable.
- When some of that news needs an answer, like a fix to run or a deck to open, without leaving the page.
- When a job runs in the background and its progress should stay in one card while other news arrives in front of it.
- When you want a quiet corner of the app that shows the last few events at a glance and tidies itself up.

### What it does

- Pass `toasts` oldest first. Each is Toast's `ToastData`: a `status`, a `title`, a `description`, and optionally a `glyph`, `steps`, one or two `actions`, `onStop` and a `duration`. The last one sits in front.
- Keep a toast's `id` and change it, and its card changes in place: its words crossfade (a counter ticks over at once), its status mark crossfades, its footer opens and closes, and the card eases to its new height. The demo turns "2 tests failed" into "Fixing 2 tests…" and then "42 tests passed" this way.
- Collapsed, the two cards behind the front one take its height and peek out 8px above it, a step narrower each, with their words hidden. Fanned out, the four in front show at their own heights, 8px apart. The stack is as tall as what it shows, and the cards and the stack ease together, so nothing jumps when a card comes, goes or changes height.
- It fans out under a mouse, while the keyboard's focus is in it, and on a tap on touch screens (a tap anywhere else folds it). Set `expanded` to fan it yourself.
- Each card has Close with a countdown ring when it has a `duration`, and Stop in its place while it is `working` with an `onStop`. Every countdown holds while the stack is fanned out, and while the pointer or the focus is on its card.
- Swipe a card sideways to dismiss it, or press Escape while the focus is in it. `onDismiss` tells you how it was closed: `close`, `timeout`, `swipe` or `escape`. A new card rises in at the front, and a closed one fades 8px down as the others close the gap.
- `max` caps how many toasts stay mounted (6 by default). Older ones drop off the back.
- Each card looks as Toast does in each style: square in Blueprint, plush in Soft, and in Clean with its footer on an off-white strip, the ink primary, and the accent white in dark mode.

### Accessibility

- The stack is a region named "Notifications" with two live regions: a card's `announce` (or its title) is read each time it changes, politely, and an `error` is read at once (assertive).
- Close, Stop and the steps' chevron are real buttons with labels ("Close", "Stop the job", "Show the steps" or "Hide the steps"), and the chevron sets `aria-expanded`. Glyphs and status marks are hidden from screen readers; the words carry the news.
- Cards that can't be seen (behind the front one in the deck, or past the fourth when fanned out) and a card on its way out are `inert`, so Tab only reaches cards on show.
- Escape closes the card the focus is in and moves the focus to the next card's Close.
- The countdowns pause while the stack is open for reading, so there is time to reach a card's buttons.
- With reduced motion turned on, cards change place and size at once, with no rise, blur or swipe-off glide.

## Usage in React

```tsx
import { ToastStack } from '@/components/designme/toast-stack/ToastStack';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ToastStack } from './ToastStack';
import { DeckGlyph, type ToastData, type ToastStep } from '../toast/Toast';
import { Icon } from '../lib/icons';
import { useStory, useWait } from '../lib/useScript';

/* ---------- Toast stack: an agent's news as it comes. A job starts with its glyph at work, a success and a problem arrive; the
   story opens the stack, fixes the problem (the same card becomes its fix, then the result), drops the success and lets the
   stack fold back. Send notification sends more. An agent at work, so it keeps playing under the pointer ---------- */
const SEC = ['Cover', 'Agenda', 'Revenue', 'North', 'South', 'Plan vs actual', 'By region', 'Hiring', 'Open roles', 'Risks', 'Data move', 'Next steps'];
const POOL: Omit<ToastData, 'id' | 'actions'>[] = [
  { status: 'success', title: 'Frames synced', description: '6 frames from Pricing.fig', duration: 9000 },
  { status: 'info', title: 'PR #412 is ready', description: 'Use shared spacing tokens · 3 files', duration: 10000 },
  { status: 'warning', title: 'Budget at 80%', description: '1,600 of 2,000 credits', duration: 12000 },
  { status: 'success', title: 'Draft written', description: 'Launch email · 2 subject lines', duration: 9000 }
];
const TESTS = ['Cart total rounds down', 'Tax shows on the receipt', '40 other tests'];

export default function ToastStackDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [expanded, setExpanded] = useState<boolean | undefined>(undefined);
  const wait = useWait(), live = useRef(new Map<string, number>()), all = useRef<ToastData[]>([]);
  // one card per id: a known id changes in place, a new one comes in at the front; six at most
  const put = (t: ToastData) => { const l = all.current; all.current = (l.some(x => x.id === t.id) ? l.map(x => x.id === t.id ? t : x) : [...l, t]).slice(-6); setToasts(all.current); };
  const drop = (id: ToastData['id']) => { all.current = all.current.filter(x => x.id !== id); setToasts(all.current); };
  const run = (id: string) => { const n = (live.current.get(id) ?? 0) + 1; live.current.set(id, n); return () => live.current.get(id) === n && all.current.some(t => t.id === id); };

  /* a job the agent runs in the background: it reads the notes, outlines and drafts twelve slides; Stop pauses it */
  const job = (from = 0, made = 0) => {
    const id = 'job', ok = run(id);
    const L = ['Read the notes', 'Outline 12 slides', 'Draft the slides'];
    const steps = (at: number, s: ToastStep['status'], n: number): ToastStep[] => L.map((label, i) => ({ label, status: i < at ? 'done' : i === at ? s : 'waiting', detail: i === 2 && at >= 2 ? `${Math.min(n + (s === 'running' ? 1 : 0), 12)} of 12` : undefined }));
    let n = made;
    const stop = (at: number) => () => { run(id); put({ id, status: 'stopped', title: at === 2 ? `Stopped at slide ${n}` : 'Stopped before drafting', description: `${n} of 12 drafted · nothing lost`,
      glyph: <DeckGlyph phase={at ? 'outlining' : 'idle'} made={n} />, steps: steps(at, 'paused', n), announce: `Stopped. ${n} of 12 drafted. Resume or discard.`,
      actions: [{ label: 'Discard', onClick: () => drop(id) }, { label: 'Resume', variant: 'primary', onClick: () => job(at, n) }] }); };
    const say = 'Making slides from your notes';
    const done = () => put({ id, status: 'success', title: '12 slides ready', description: 'Q3 planning deck', glyph: <DeckGlyph phase="done" made={12} />, steps: steps(3, 'done', 12), duration: 12000,
      announce: '12 slides ready. Open the deck or undo it.', actions: [
        { label: 'Undo', onClick: () => put({ id, status: 'success', title: 'Deck removed', description: 'Your notes are unchanged', glyph: <DeckGlyph phase="gone" />, steps: steps(3, 'done', 12), duration: 6000, actions: [{ label: 'Redo', onClick: done }] }) },
        { label: 'Open', variant: 'primary', onClick: () => drop(id) }] });
    (async () => {
      if (from === 0) { put({ id, status: 'working', title: 'Reading your notes…', description: '3 sections · 212 words', glyph: <DeckGlyph phase="reading" />, steps: steps(0, 'running', 0), onStop: stop(0), announce: say }); await wait(1600); if (!ok()) return; }
      if (from <= 1) { put({ id, status: 'working', title: 'Outlining the deck…', description: '12 slides planned', glyph: <DeckGlyph phase="outlining" />, steps: steps(1, 'running', 0), onStop: stop(1), announce: say }); await wait(1200); if (!ok()) return; }
      for (; n < 12; n++) {
        put({ id, status: 'working', title: 'Drafting slides…', description: `Slide ${n + 1} of 12 · ${SEC[n]}`, glyph: <DeckGlyph phase="drafting" made={n} active={n} />, steps: steps(2, 'running', n), onStop: stop(2), announce: n >= 6 ? 'Half the slides are drafted' : say });
        await wait(380); if (!ok()) return;
      }
      done();
    })();
  };

  /* a problem the agent can fix: the card becomes its fix, then the result, in place */
  const tests = () => {
    const id = 'tests';
    const fail = () => put({ id, status: 'error', title: '2 tests failed', description: 'checkout.spec · the total is 1¢ off', announce: '2 tests failed in checkout.spec. Fix them or ignore them.',
      steps: TESTS.map((label, i) => ({ label, status: i < 2 ? 'failed' : 'done' })), actions: [{ label: 'Ignore', onClick: () => drop(id) }, { label: 'Fix', variant: 'primary', onClick: fix }] });
    const fix = async () => {
      const ok = run(id), stop = () => { run(id); fail(); };
      put({ id, status: 'working', title: 'Fixing 2 tests…', description: 'Rounding in cart.ts', steps: TESTS.map((label, i) => ({ label, status: i < 2 ? 'running' : 'done' })), onStop: stop, announce: 'Fixing 2 tests' });
      await wait(1700); if (!ok()) return;
      for (let i = 6; i <= 42; i += 6) { put({ id, status: 'working', title: 'Running checkout.spec…', description: `Passed ${i} of 42`, steps: TESTS.map(label => ({ label, status: 'done' })), onStop: stop, announce: 'Fixing 2 tests' }); await wait(200); if (!ok()) return; }
      put({ id, status: 'success', title: '42 tests passed', description: 'Fixed in cart.ts · 1 line', steps: TESTS.map(label => ({ label, status: 'done' })), duration: 10000,
        announce: '42 tests passed. Fixed in cart.ts.', actions: [{ label: 'View diff', onClick: () => drop(id) }] });
    };
    fail();
  };

  /* plain news, and what Send notification sends: one action at most, and a countdown */
  const sent = useRef(0);
  const news = (k = sent.current++) => {
    const id = 'n' + k, d = POOL[k % POOL.length];
    const act = d.title === 'PR #412 is ready' ? [{ label: 'Review', variant: 'primary' as const, onClick: () => drop(id) }]
      : d.title === 'Budget at 80%' ? [{ label: 'Raise cap', variant: 'warn' as const, onClick: () => put({ id, status: 'success', title: 'Cap raised to 3,000', description: '1,600 of 3,000 credits', duration: 6000 }) }] : undefined;
    put({ ...d, id, actions: act });
    return id;
  };

  useStory(ref, async s => {
    const until = async (f: () => boolean) => { while (!f()) await s.wait(100); };
    s.taken(() => setExpanded(undefined));
    await s.wait(500); job();
    await s.wait(1500); const frames = news(); sent.current = 1;
    await s.wait(1500); tests();
    await s.wait(1500); setExpanded(true);
    await s.wait(1500); s.press('.dm-tst-fi .dm-primary');
    await until(() => all.current.some(t => t.id === 'tests' && t.status === 'success'));
    await s.wait(1000); drop(frames);
    await s.wait(1500); setExpanded(undefined);
  }, { hold: false });

  return (
    <div ref={ref} style={{ width: '100%', minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
      <div style={{ marginBlock: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ToastStack toasts={toasts} expanded={expanded} onDismiss={id => drop(id)} />
      </div>
      <div data-dm=""><button type="button" className="dm-pill dm-line dm-sm" onClick={() => news()}><Icon name="bell" />Send notification</button></div>
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `toasts` | `ToastData[]` | The toasts, oldest first: the last one sits in front. Each is a Toast (`ToastData`): keep its `id` and change it, and its card changes in place (a job's progress, a problem becoming its fix); a new `id` comes in at the front |
| `onDismiss` (optional) | `(id: ToastData['id'], reason: ToastDismissReason) => void` | Called when a toast is closed: by Close, its countdown, a swipe or Escape. It leaves the stack either way; drop it from `toasts` too |
| `expanded` (optional) | `boolean` | Fans the stack out (true) or keeps it a deck (false). Leave it out and it fans out under the pointer, while the keyboard's focus is in it, and on a tap |
| `max` (optional) | `number` | How many toasts stay mounted. Older ones drop off the back. Default 6 |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ToastStack from '../components/designme/toast-stack/ToastStack.astro';
---
<ToastStack />
<ToastStack data-style="soft" class="my-class" />
```
It plays its demo; change `toast-stack.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I add a new notification?**

Append a toast with a new `id` to the end of `toasts`. It rises in at the front and the others step back.

**How does a problem become its fix in the same card?**

Keep its `id`. Show the problem with `status: 'error'` and the fix as the primary action; when it is pressed, set `status: 'working'` with a title like "Fixing 2 tests…", then `status: 'success'` with the result. The card changes in place wherever it sits in the stack.

**Do I have to remove a closed toast from my state?**

It leaves the stack as soon as it is closed, by Close, its countdown, a swipe or Escape, and `onDismiss` tells you which. Drop it from `toasts` too, so it doesn't come back if you reuse the list.

**Can I keep the stack fanned out all the time?**

Yes. Pass `expanded={true}` to keep it open, or `expanded={false}` to keep it collapsed. While it is fanned out, the countdowns hold.

**Does it need Toast too?**

Yes: every card is Toast's card. `npx designme add toast-stack --react` adds Toast beside it, and the HTML and Astro versions carry Toast's styles in their own CSS.

## Source

`ToastStack.tsx`, as `npx designme add toast-stack --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../lib/cx';
import { useIsoLayoutEffect } from '../lib/hooks';
import { ToastCard, type ToastData, type ToastDismissReason } from '../toast/Toast';
import '../designme.css';
import './toast-stack.css';

export interface ToastStackProps {
  /** The toasts, oldest first: the last one sits in front. Each is a Toast (`ToastData`): keep its `id` and change it, and its
      card changes in place (a job's progress, a problem becoming its fix); a new `id` comes in at the front */
  toasts: ToastData[];
  /** Called when a toast is closed: by Close, its countdown, a swipe or Escape. It leaves the stack either way; drop it from
      `toasts` too */
  onDismiss?: (id: ToastData['id'], reason: ToastDismissReason) => void;
  /** Fans the stack out (true) or keeps it a deck (false). Leave it out and it fans out under the pointer, while the keyboard's
      focus is in it, and on a tap */
  expanded?: boolean;
  /** How many toasts stay mounted. Older ones drop off the back. Default 6 */
  max?: number;
  className?: string;
}

// collapsed, the two cards behind the front one peek out 8px each; fanned out, the four in front show, 8px apart
const PEEK = 8, GAP = 8, FAN = 4;

/** Where each card sits, counting from the front: collapsed into a deck (the cards behind take the front one's height and
    peek out above it, a step narrower each), or fanned out into a list, each at its own height */
function place(i: number, fan: boolean, hs: number[]): { style: CSSProperties; height?: number; back: boolean; hidden: boolean } {
  if (fan) {
    let y = 0;
    for (let k = 0; k < i; k++) y += hs[k] + GAP;
    return { style: { transform: `translateY(${-y}px)`, opacity: i < FAN ? 1 : 0, zIndex: 100 - i }, back: false, hidden: i >= FAN };
  }
  const j = Math.min(i, 2);
  return { style: { transform: j ? `translateY(${-j * PEEK}px) scale(${1 - j * .05})` : 'translateY(0px)', opacity: i > 2 ? 0 : 1, zIndex: 100 - i }, height: i ? hs[0] : undefined, back: i > 0, hidden: i > 0 };
}

/** Toasts that stack into a deck and fan out under the pointer or the focus. Each one is a Toast card, with its steps, its
    footer, Close with its countdown, swipe and Escape; the stack reads each card's own height and moves them together */
export function ToastStack({ toasts, onDismiss, expanded, max = 6, className }: ToastStackProps) {
  // a closed toast goes at once, whether or not the parent drops it
  const [closed, setClosed] = useState<Set<ToastData['id']>>(() => new Set());
  const live = toasts.filter(t => !closed.has(t.id)).slice(-max), front = live.slice().reverse();
  const ids = live.map(t => t.id).join('\u0000');

  // it fans out under a mouse, while the keyboard's focus is in it, and on a tap (touch has no hover)
  const [hover, setHover] = useState(false), [focused, setFocused] = useState(false), [tapped, setTapped] = useState(false);
  const fan = expanded ?? (hover || focused || tapped);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const out = (e: PointerEvent) => { if (e.pointerType !== 'mouse' && !root.current?.contains(e.target as Node)) setTapped(false); };
    document.addEventListener('pointerdown', out); return () => document.removeEventListener('pointerdown', out);
  }, []);

  // each card's own height, as it reports it
  const [heights, setHeights] = useState<Record<string, number>>({});
  const hs = front.map(t => heights[t.id] ?? 0);

  // a new card waits two frames below its place, so its rise to it eases; the cards it covers step back as it comes
  const [placed, setPlaced] = useState<Set<ToastData['id']>>(() => new Set());
  useEffect(() => {
    const fresh = live.filter(t => !placed.has(t.id)).map(t => t.id); if (!fresh.length) return;
    let raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => setPlaced(p => new Set([...p, ...fresh]))); });
    return () => cancelAnimationFrame(raf);
  }, [ids]); // eslint-disable-line react-hooks/exhaustive-deps

  // a card that goes keeps its place in the DOM for a moment, fading 8px down as the others close the gap (a swiped one has
  // already gone on sideways)
  type Leaving = { toast: ToastData; at: number; style: CSSProperties; height?: number };
  const [prev, setPrev] = useState({ ids, live, fan, hs });
  const [leaving, setLeaving] = useState<Leaving[]>([]);
  if (prev.ids !== ids) {
    const now = new Set(live.map(t => t.id)), n = prev.live.length;
    const gone = prev.live.flatMap((t, at): Leaving[] => {
      if (now.has(t.id) || leaving.some(l => l.toast.id === t.id)) return [];
      const was = place(n - 1 - at, prev.fan, prev.hs);
      return [{ toast: t, at, height: was.height, style: { ...was.style, transform: `${was.style.transform} translateY(8px) scale(.98)`, opacity: 0 } }];
    });
    setPrev({ ids, live, fan, hs });
    if (gone.length) setLeaving(l => [...l, ...gone]);
  } else if (prev.fan !== fan || prev.hs.join() !== hs.join()) setPrev({ ids, live, fan, hs });
  const leavingIds = leaving.map(l => l.toast.id).join('\u0000');
  useEffect(() => {
    if (!leaving.length) return;
    const t = setTimeout(() => setLeaving(l => l.filter(x => !leaving.includes(x))), 520);
    return () => clearTimeout(t);
  }, [leavingIds]); // eslint-disable-line react-hooks/exhaustive-deps

  /* what screen readers hear, through the stack's two live regions: a card's `announce` (or its title) each time it changes;
     an error at once, the rest politely */
  const said = useRef(new Map<ToastData['id'], string>());
  const [say, setSay] = useState<{ text: string; loud: boolean }>({ text: '', loud: false });
  const news = live.map(t => [t.id, t.announce ?? t.title, t.status === 'error'] as const).filter(([id, text]) => said.current.get(id) !== text);
  const newsKey = news.map(([id, text]) => id + ':' + text).join('\u0000');
  useEffect(() => {
    if (!news.length) return;
    news.forEach(([id, text]) => said.current.set(id, text));
    const [, text, loud] = news[news.length - 1];
    setSay({ text: '', loud: false });
    const t = setTimeout(() => setSay({ text, loud }), 60);
    return () => clearTimeout(t);
  }, [newsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = (id: ToastData['id'], r: ToastDismissReason) => {
    const had = !!root.current?.contains(document.activeElement);
    setClosed(c => new Set(c).add(id)); onDismiss?.(id, r);
    // the focus goes on to the next card's Close (or Stop)
    if (had) setTimeout(() => { const b = root.current?.querySelectorAll<HTMLElement>('.dm-tst-t:not([inert]) :is(.dm-tst-x,.dm-tst-stop)'); b?.[b.length - 1]?.focus({ preventScroll: true }); }, 0);
  };
  // closed ids the parent has since dropped are forgotten
  useEffect(() => { setClosed(c => { const has = new Set(toasts.map(t => t.id)); const next = new Set([...c].filter(id => has.has(id))); return next.size === c.size ? c : next; }); }, [toasts]);

  // the stack is as tall as what it shows, so it stays centred where it is placed as it grows and shrinks
  const fanh = hs.slice(0, FAN).reduce((a, h) => a + h + GAP, 0) - (live.length ? GAP : 0);
  const deckh = live.length ? hs[0] + Math.min(live.length - 1, 2) * PEEK : 0;
  useIsoLayoutEffect(() => { root.current?.style.setProperty('--dm-tsk-h', (fan ? fanh : deckh) + 'px'); });

  const card = (t: ToastData, i: number) => {
    const p = place(i, fan, hs), fresh = !placed.has(t.id);
    return <ToastCard key={t.id} toast={t} motion="host" paused={fan} onClose={r => close(t.id, r)} inert={p.hidden}
      className={cx(fresh && 'dm-tsk-new', p.back && 'dm-tsk-back')} style={fresh ? { zIndex: p.style.zIndex } : p.style} height={p.height}
      onHeight={h => setHeights(x => x[t.id] === h ? x : { ...x, [t.id]: h })} />;
  };
  const gone = (l: Leaving) => <ToastCard key={l.toast.id} toast={l.toast} motion="host" leaving onClose={() => {}} className="dm-tsk-out" style={l.style} height={l.height} />;

  return (
    <div data-dm="" ref={root} className={cx('dm-tsk-stack', className)} role="region" aria-label="Notifications"
      onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(true); }} onPointerLeave={e => { if (e.pointerType === 'mouse') setHover(false); }}
      onPointerDown={e => { if (e.pointerType !== 'mouse' && !(e.target as Element).closest('button')) setTapped(true); }}
      onFocus={e => { if (e.target.matches(':focus-visible')) setFocused(true); }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false); }}>
      {leaving.slice().sort((a, b) => a.at - b.at).reduce((all, l) => { all.splice(Math.min(l.at, all.length), 0, gone(l)); return all; },
        live.map(t => card(t, front.indexOf(t))))}
      <div className="dm-tst-sr" role="status" aria-live="polite">{say.loud ? '' : say.text}</div>
      <div className="dm-tst-sr" role="alert" aria-live="assertive">{say.loud ? say.text : ''}</div>
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
- [Toast](https://designme.dev/components/toast.md): A background job in one toast, from start to finish.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.
- [Thinking states](https://designme.dev/components/thinking-states.md): Six thinking indicators to pick from, each with a status line.

All components: https://designme.dev/llms.txt
