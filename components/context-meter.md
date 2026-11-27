# Context meter

> How full the context is and what fills it, with Compact to free room.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/context-meter

## Install

```sh
npx designme add context-meter          # HTML, CSS and JS, with the shared core
npx designme add context-meter --react  # React 19 component and its CSS
npx designme add context-meter --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/context-meter.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/context-meter.json  # Astro
```

## About

Context meter shows how full an agent's context window is and what fills it. A small pill with a ring and a percentage opens a panel above it with one bar split by kind (files, tool output, chat, instructions), a legend whose rows list what is in them on hover, and a Compact button that frees room and says how much.

### When to use it

- When long agent sessions run close to the context limit and people should see it coming.
- When people want to know why the context is full, not only how full it is.
- When your agent can compact a session, and people should decide when and see what it freed.
- When a new tool result can suddenly take a large share and you want to warn about it.

### What it does

- `parts` are the kinds of thing in the context, each with a `label`, a `tokens` count, an optional `color` (by default the accent, violet, teal and a neutral grey, in order) and `items`, the list shown on hover. `limit` is the size of the window.
- The pill shows the ring and the share used. As the share rises, the percentage counts up in place and the ring grows; each step sends a thin bright highlight once along the ring's filled arc and lifts the ring a touch. As the count passes `warnAt` of the limit, 85% by default, the warning orange wipes along the ring from its start (the two colours never blend) and the pill nudges once; when it drops back below, the orange wipes back the same way.
- The bar and the numbers count to their new values whenever `parts` change, so a compaction counts down.
- Hovering a legend row lights its share of the bar and shows its `items`, and one highlight glides from row to row.
- `message` adds a line under the legend. With `messageTone: 'warn'` it is a warning notice: a faint warning tint, the filled warning sign and the words in the text colour, and Compact takes the warning tint as the action that resolves it. With `'ok'` it is a plain line with the green tick, like "Freed 120.0k tokens. 9 decisions kept". The line takes no room while empty and opens smoothly when a message comes.
- Compact calls `onCompact`. Return a promise and, until it settles, the button gives way to a status in its place, a spinner and "Compacting…" with a moving highlight (nothing to press while it runs), while the line beside it says `busyHint` with the same highlight; the row keeps its height. Set `compacted` and the button becomes Undo, which calls `onUndo`. The button eases to the width of its new words.
- The pill opens and shuts the panel, and `open`, `defaultOpen` and `onOpenChange` let you control it. The panel opens above the pill, as it would under a chat composer, and the pill's chevron points up while it is shut. `placement` (`'top'` by default, or `'bottom'`) picks the side; when the window, or a box round the meter that clips it, has no room on that side and more on the other, it opens there instead. The panel grows out of the pill and folds back into it when shut.
- Ships in Clean too (`data-style="clean"`): the pill is a flat secondary control (a hairline and a light fill), the panel is a round card with off-white head and foot strips and its content 16px in from every edge, the bar and its parts keep their colours on round tracks, Compact is a 28px secondary pill 16px from the foot strip's top and bottom and 16px in from the side, on the content's column, and the panel fades and scales a little from the pill as it opens and shuts.

### Accessibility

- The pill is a button with `aria-expanded` and a label that includes the share used, like "Context, 68% used".
- The panel is a region labelled "What fills the context", and it is inert while shut so its controls can't be reached.
- Escape shuts the panel while the pointer or the focus is on the meter, and moves the focus back to the pill if it was inside.
- The message line is an `aria-live="polite"` region, so a warning or the compaction result is announced.
- With reduced motion the ring and its colour change at once, with no highlight, lift, nudge or wipe.

## Usage in React

```tsx
import { ContextMeter } from '@/components/designme/context-meter/ContextMeter';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { ContextMeter, type ContextPart } from './ContextMeter';
import { useStory, useWait } from '../lib/useScript';

/* ---------- Context meter: what fills it, the chat takes it step by step past 85%, Compact frees room ---------- */
const START: ContextPart[] = [
  { key: 'files', label: 'Files', tokens: 32000, items: 'Pricing.fig export 19.8k, PricingCard.tsx 8.1k, tokens.css 4.1k' },
  { key: 'tools', label: 'Tool output', tokens: 24000, items: 'Contrast check 11.2k, Figma frames 8.6k, grid audit 4.2k' },
  { key: 'chat', label: 'Chat', tokens: 26000, items: 'Turns with Maya Kim since 09:12' },
  { key: 'sys', label: 'Instructions', tokens: 6000, items: 'Studio guidelines 3.9k, pricing brief 2.1k' }
];
// what the chat adds, one step at a time: [part, tokens, what it is]. The third takes it past 85%
const STEPS: [string, number, string][] = [['files', 22000, 'brand-guide.pdf'], ['tools', 36000, 'web search'], ['chat', 28000, ''], ['files', 10000, 'checkout.fig']];
// compacting leaves a summary in place of older turns, reads and output
const AFTER: Record<string, [number, string]> = {
  files: [26000, 'Pricing.fig export 19.8k, summary of older reads 6.2k'], tools: [24000, 'Contrast check 11.2k, summary of older output 12.8k'],
  chat: [8000, 'Summary of 48 turns, 9 decisions kept'], sys: [6000, 'Studio guidelines 3.9k, pricing brief 2.1k']
};
const LIMIT = 200000;
const sum = (ps: ContextPart[]) => ps.reduce((t, p) => t + p.tokens, 0);
const add = (ps: ContextPart[], [key, tokens, what]: [string, number, string]) => ps.map(p => p.key === key ? { ...p, tokens: p.tokens + tokens, items: what ? `${p.items}, ${what} ${(tokens / 1000).toFixed(1)}k` : p.items } : p);

export default function ContextMeterDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [parts, setParts] = useState(START);
  const [before, setBefore] = useState<ContextPart[] | null>(null);
  const [message, setMessage] = useState<{ text: string; tone: 'warn' | 'ok' }>();
  const [open, setOpen] = useState(true);
  const live = useRef(parts);
  useEffect(() => { live.current = parts; });
  // Compact turns older turns, reads and tool output into a summary
  const compact = async () => {
    await wait(1000);
    const next = parts.map(p => AFTER[p.key] ? { ...p, tokens: AFTER[p.key][0], items: AFTER[p.key][1] } : p);
    setBefore(parts); setParts(next);
    setMessage({ text: `Freed ${((sum(parts) - sum(next)) / 1000).toFixed(1)}k tokens. 9 decisions kept`, tone: 'ok' });
  };
  const undo = () => { if (before) setParts(before); setBefore(null); setMessage(undefined); };
  // the preview's story: the chat goes on, step by step, past 85% (the warning shows as the count passes it), the person
  // compacts, then shuts the panel
  useStory(ref, async ({ wait, press }) => {
    await wait(6000);
    for (const [i, st] of STEPS.entries()) {
      const next = add(live.current, st), pct = Math.round(sum(next) / LIMIT * 100), was = Math.round(sum(live.current) / LIMIT * 100);
      setParts(next);
      if (pct >= 85) { if (was < 85) await wait(300); setMessage({ text: `${pct}% full. Older turns start to drop at 200k`, tone: 'warn' }); }
      await wait(i === 2 ? 1700 : 1200);
    }
    await wait(500); press('.dm-ctm-go');
    await wait(3500); setOpen(false);
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ContextMeter parts={parts} limit={LIMIT} message={message?.text} messageTone={message?.tone} onCompact={compact} compacted={!!before} onUndo={undo}
        hint={before ? 'Older turns are now a summary' : undefined} busyHint="Summarising 48 turns" open={open} onOpenChange={setOpen} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `parts` | `ContextPart[]` |  |
| `limit` | `number` | The size of the context window, in tokens, like 200000 |
| `warnAt` (optional) | `number` | From this share of the limit (0 to 1) the ring turns orange. Defaults to 0.85 |
| `message` (optional) | `string` | A line under the legend, like "Freed 41.2k tokens. 9 decisions kept". Crossfades when it changes |
| `messageTone` (optional) | `'warn' \| 'ok'` | warn shows the message as a warning notice (a faint warning tint, the filled warning sign, the words in the text colour) and puts Compact in the warning tint, as the action that resolves it; ok shows it as a plain line with the green tick |
| `onCompact` (optional) | `() => void \| Promise<void>` | Called by Compact. Return a promise and, until it settles, the button gives way to a "Compacting…" status line with a spinner |
| `compacted` (optional) | `boolean` | Set once the context is compacted: the button turns into Undo, which calls onUndo |
| `onUndo` (optional) | `() => void` |  |
| `hint` (optional) | `string` | The quiet line beside the button. Defaults to what Compact does |
| `busyHint` (optional) | `string` | The line beside the button while Compact runs, with a moving highlight. Defaults to "Summarising older turns" |
| `open` (optional) | `boolean` | Whether the panel is open. Leave it out to let the pill toggle it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `placement` (optional) | `'top' \| 'bottom'` | Which side of the pill the panel opens on. Defaults to top, above the pill, as it sits under a chat composer. When the window, or a box round the meter that clips it, has no room on that side and more on the other, it opens there instead |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ContextMeter from '../components/designme/context-meter/ContextMeter.astro';
---
<ContextMeter />
<ContextMeter data-style="soft" class="my-class" />
```
It plays its demo; change `context-meter.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**What should the parts be?**

Whatever your agent can tell apart. Files, tool output, chat and instructions work for most agents. Put the largest items of each into `items` so people can see what to drop.

**How do I show what a compaction freed?**

Make `onCompact` return a promise, update `parts` with the smaller counts when it resolves, set `compacted`, and pass the difference as `message` with `messageTone: 'ok'`. The numbers count down by themselves.

**When does it turn orange?**

When the tokens in `parts` add up to `warnAt` of `limit` or more. `warnAt` is 0.85 unless you change it.

## Source

`ContextMeter.tsx`, as `npx designme add context-meter --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion, useTween } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { mxT, Spin, Swap, Tip } from '../lib/motion';
import { useHoverGlide } from '../lib/glide';
import '../designme.css';
import './context-meter.css';

/** One kind of thing in the context */
export interface ContextPart {
  key: string;
  /** Like "Files", "Tool output" or "Chat" */
  label: string;
  /** How many tokens it takes */
  tokens: number;
  /** Its colour in the bar and the legend. Defaults to the accent, violet, teal and a neutral grey, in order */
  color?: string;
  /** What is in it, shown when you hover its row, like "PricingCard.tsx 18.2k, tokens.css 6.1k" */
  items?: string;
}

export interface ContextMeterProps {
  parts: ContextPart[];
  /** The size of the context window, in tokens, like 200000 */
  limit: number;
  /** From this share of the limit (0 to 1) the ring turns orange. Defaults to 0.85 */
  warnAt?: number;
  /** A line under the legend, like "Freed 41.2k tokens. 9 decisions kept". Crossfades when it changes */
  message?: string;
  /** warn shows the message as a warning notice (a faint warning tint, the filled warning sign, the words in the text colour)
      and puts Compact in the warning tint, as the action that resolves it; ok shows it as a plain line with the green tick */
  messageTone?: 'warn' | 'ok';
  /** Called by Compact. Return a promise and, until it settles, the button gives way to a "Compacting…" status line with a spinner */
  onCompact?: () => void | Promise<void>;
  /** Set once the context is compacted: the button turns into Undo, which calls onUndo */
  compacted?: boolean;
  onUndo?: () => void;
  /** The quiet line beside the button. Defaults to what Compact does */
  hint?: string;
  /** The line beside the button while Compact runs, with a moving highlight. Defaults to "Summarising older turns" */
  busyHint?: string;
  /** Whether the panel is open. Leave it out to let the pill toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Which side of the pill the panel opens on. Defaults to top, above the pill, as it sits under a chat composer. When the
      window, or a box round the meter that clips it, has no room on that side and more on the other, it opens there instead */
  placement?: 'top' | 'bottom';
  className?: string;
}

/** The room the panel may open into: the window, cut by any box round the meter that clips what spills out of it */
function roomOf(el: HTMLElement) {
  let top = 0, bottom = innerHeight;
  for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
    if (getComputedStyle(a).overflowY === 'visible') continue;
    const r = a.getBoundingClientRect(); top = Math.max(top, r.top); bottom = Math.min(bottom, r.bottom);
  }
  return { top, bottom };
}


/** A button as wide as its words: when they change it eases to its new width on the motion pieces' spring, keeping no room
    for a longer word */
function useEaseWidth(ref: RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current; if (!el || reduce || typeof ResizeObserver === 'undefined') return;
    let w = 0, busy: Animation | null = null;
    const ro = new ResizeObserver(() => {
      if (busy) return;
      const w1 = el.getBoundingClientRect().width;
      if (w && Math.abs(w1 - w) > .5) {
        busy = el.animate([{ width: w + 'px' }, { width: w1 + 'px' }], { duration: mxT(el, 't-in', 360), easing: mxT(el, 'ease-spring', 'ease') });
        busy.finished.catch(() => {}).then(() => { busy = null; w = el.getBoundingClientRect().width; });
      }
      w = w1;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, reduce]);
}

const PALETTE = ['var(--dm-c1)', 'var(--dm-c2)', 'var(--dm-c6)', 'var(--dm-muted)'];
const k = (n: number) => (n / 1000).toFixed(1) + 'k';

/** A number that counts to its new value (it starts on its first value) */
function Count({ value, ms = 900, format }: { value: number; ms?: number; format: (n: number) => string }) {
  return <>{format(useTween(value, ms))}</>;
}

/** How full the context is and what fills it: a pill with a ring that opens one bar split by kind, a legend whose rows list
 *  what is in them, and Compact. The panel opens above the pill (placement), and Escape closes it. */
export function ContextMeter({ parts, limit, warnAt = .85, message, messageTone = 'ok', onCompact, compacted = false, onUndo,
  hint = 'Summarises older turns', busyHint = 'Summarising older turns', open, defaultOpen = true, onOpenChange, placement = 'top', className }: ContextMeterProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [busy, setBusy] = useState(false);
  const [lit, setLit] = useState<string | null>(null);
  // it opens on its real numbers; they only count when something changes
  const ready = true;
  const total = parts.reduce((t, p) => t + p.tokens, 0), share = ready ? total / limit : 0, pct = Math.round(share * 100);
  const root = useRef<HTMLDivElement>(null), tg = useRef<HTMLButtonElement>(null), go = useRef<HTMLButtonElement>(null), pop = useRef<HTMLDivElement>(null);
  const leg = useRef<HTMLDivElement>(null);
  useHoverGlide(leg, '.dm-ctm-l');
  // the ring's moments (designme.dev, 26 Nov): a step up (or the drop after compacting) sends a thin bright highlight once along
  // the filled arc and lifts the ring a touch; as the count passes warnAt, the warning mark wipes along the arc (and back once
  // it drops below), never blending the two colours, and the pill nudges once. No halo or glow. Reduced motion: none of it
  const reduce = useReducedMotion();
  const ring = useRef<SVGSVGElement>(null), warc = useRef<SVGCircleElement>(null), shine = useRef<SVGCircleElement>(null);
  const counted = useTween(total, 900), hot = Math.round(counted / limit * 100) >= Math.round(warnAt * 100);
  const last = useRef(total);
  useEffect(() => {
    const was = last.current; last.current = total;
    const sv = ring.current, sh = shine.current; if (reduce || !sv || !sh || typeof sh.animate !== 'function' || Math.abs(total - was) < 50) return;
    const seg = Math.min(9, pct); sh.style.strokeDasharray = seg + ' 200';
    sh.animate([{ strokeDashoffset: 0, opacity: 0 }, { opacity: .9, offset: .5 }, { strokeDashoffset: -(pct - seg), opacity: 0 }], { duration: 450, easing: 'cubic-bezier(.65,0,.35,1)' });
    sv.animate([{ scale: 1 }, { scale: 1.06, offset: .2 }, { scale: 1 }], { duration: 350, easing: 'cubic-bezier(.23,1,.32,1)' });
  }, [total]); // eslint-disable-line react-hooks/exhaustive-deps
  const wasHot = useRef(hot);
  useIsoLayoutEffect(() => {
    const w = warc.current, was = wasHot.current; wasHot.current = hot; if (!w) return;
    if (hot === was) { if (hot) w.style.strokeDasharray = pct + ' 100'; return; }
    const ease = 'cubic-bezier(.65,0,.35,1)', from = parseFloat(w.style.strokeDasharray) || 0;
    w.style.transition = 'none';
    if (hot) {
      w.style.opacity = '1'; w.style.strokeDasharray = pct + ' 100';
      if (!reduce && typeof w.animate === 'function') {
        w.animate([{ strokeDasharray: '0 100' }, { strokeDasharray: pct + ' 100' }], { duration: 200, easing: ease });
        tg.current?.animate([{ translate: '0 0' }, { translate: '3px 0', offset: .22 }, { translate: '-1.4px 0', offset: .6 }, { translate: '0 0' }], { duration: 380, easing: 'ease-out' });
      }
    } else {
      w.style.strokeDasharray = '0 100';
      if (reduce || typeof w.animate !== 'function') w.style.opacity = '0';
      else w.animate([{ strokeDasharray: from + ' 100' }, { strokeDasharray: '0 100' }], { duration: 200, easing: ease }).onfinish = () => { if (!wasHot.current) w.style.opacity = '0'; };
    }
    void w.getBoundingClientRect(); w.style.transition = '';
  }, [hot, pct]);
  useEaseWidth(go);
  // the side it opens on is chosen as it opens: the placement's side, or the other one when that side has no room for the
  // panel (its height, its padding while it is still easing in, and the gap) and the other has more
  const [side, setSide] = useState(placement);
  const full = useRef(0);
  useIsoLayoutEffect(() => {
    const el = pop.current, b = tg.current; if (!isOpen || !el || !b) return;
    full.current = Math.max(full.current, el.scrollHeight);
    const room = roomOf(b), r = b.getBoundingClientRect(), need = full.current + 44, above = r.top - room.top, below = room.bottom - r.bottom;
    const [want, other] = placement === 'top' ? [above, below] : [below, above];
    const up = placement === 'top' ? want >= need || want >= other : !(want >= need || want >= other);
    setSide(up ? 'top' : 'bottom');
  }, [isOpen, placement]);
  // Escape shuts the panel while the pointer or the focus is on the meter
  useEffect(() => {
    if (!isOpen) return;
    const key = (e: KeyboardEvent) => {
      const el = root.current; if (e.key !== 'Escape' || !el) return;
      const inside = el.contains(document.activeElement);
      if (inside || el.matches(':hover')) { setOpen(false); if (inside) tg.current?.focus({ preventScroll: true }); }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps
  const compact = async () => {
    if (busy) return;
    if (compacted) { onUndo?.(); return; }
    setBusy(true);
    try { await onCompact?.(); } finally { setBusy(false); }
  };

  return (
    <div ref={root} data-dm="" className={cx('dm-ctm', hot && 'dm-hot', className)} data-open={isOpen ? '1' : '0'} data-pos={side === 'top' ? 'up' : 'down'}>
      <button ref={tg} type="button" className="dm-ctm-tg" aria-expanded={isOpen} aria-label={`Context, ${pct}% used`} onClick={() => setOpen(!isOpen)}>
        <span className="dm-ctm-ring" aria-hidden="true">
          <svg ref={ring} viewBox="0 0 20 20"><circle className="dm-tr" cx="10" cy="10" r="7.5" /><circle className="dm-fl" cx="10" cy="10" r="7.5" pathLength={100} style={{ strokeDasharray: `${pct} 100` }} />
            <circle ref={warc} className="dm-fw" cx="10" cy="10" r="7.5" pathLength={100} /><circle ref={shine} className="dm-hl" cx="10" cy="10" r="7.5" pathLength={100} /></svg>
        </span>
        <span><span className="dm-ctm-pc dm-num"><Count value={ready ? total : 0} format={n => Math.round(n / limit * 100) + '%'} /></span> of context used</span>
        <Icon name="chev-d" size="xs" />
      </button>
      <div ref={pop} className="dm-ctm-pop dm-panel" role="region" aria-label="What fills the context" inert={!isOpen}>
        <div className="dm-ctm-ph"><span>In context</span><span className="dm-num"><b className="dm-ctm-tot"><Count value={ready ? total : 0} format={k} /></b> of {Math.round(limit / 1000)}k tokens</span></div>
        <div className={cx('dm-ctm-bar', lit && 'dm-hl')} aria-hidden="true">
          {parts.map((p, i) => <i key={p.key} className={lit === p.key ? 'dm-on' : undefined} style={{ width: (ready ? p.tokens / limit * 100 : 0) + '%', '--dm-c': p.color ?? PALETTE[i % PALETTE.length] } as CSSProperties} />)}
        </div>
        {/* one highlight glides from part to part (motion pieces) */}
        <div ref={leg} className="dm-ctm-leg dm-mx-glide" onPointerLeave={() => setLit(null)}>
          {parts.map((p, i) => {
            const row = (
              <div key={p.key} className="dm-ctm-l" style={{ '--dm-c': p.color ?? PALETTE[i % PALETTE.length] } as CSSProperties}
                onPointerEnter={() => setLit(p.key)} onFocus={() => setLit(p.key)} onBlur={() => setLit(null)} tabIndex={p.items ? 0 : undefined}>
                <span className="dm-sw" />{p.label}<span className="dm-v dm-num"><Count value={ready ? p.tokens : 0} format={k} /></span>
              </div>
            );
            return p.items ? <Tip key={p.key} label={p.items}>{row}</Tip> : row;
          })}
        </div>
        <div className={cx('dm-ctm-msg', message && 'dm-on', message && 'dm-' + messageTone)} aria-live="polite">
          <span>{message && <>{messageTone === 'warn'
            ? <svg className="dm-ctm-wi" viewBox="0 0 24 24" aria-hidden="true"><path className="dm-a" d="M12 3.6 2.6 19.9h18.8z" /><path className="dm-b" d="M12 9.6v4.4M12 17v.01" /></svg>
            : <Icon name="ok" size="xs" />}<Swap>{message}</Swap></>}</span>
        </div>
        {(onCompact || onUndo) && (
          <div className="dm-ctm-f">
            {busy ? <span className="dm-ctm-hint"><span className="dm-shim">{busyHint}</span></span> : <Swap className="dm-ctm-hint">{hint}</Swap>}
            {/* while it compacts nothing can be pressed, so it says so where the button was, in the loader's sweep, and the button
                comes back as Undo once it is done */}
            {busy
              ? <span className="dm-ctm-run" role="status"><Spin /><span className="dm-shim">Compacting…</span></span>
              : <button ref={go} type="button" className={cx('dm-pill dm-sm dm-ctm-go dm-mx-press', message && messageTone === 'warn' ? 'dm-warn' : 'dm-line')} onClick={compact}>{compacted ? 'Undo' : 'Compact'}</button>}
          </div>
        )}
      </div>
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
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): A background job in one toast, from start to finish.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.
- [Thinking states](https://designme.dev/components/thinking-states.md): Six thinking indicators to pick from, each with a status line.

All components: https://designme.dev/llms.txt
