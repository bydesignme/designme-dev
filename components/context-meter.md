# Context meter

> How full the context is and what fills it, with Compact to free room.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/context-meter

## Install

```sh
npx designme add context-meter          # HTML, CSS and JS, with the shared core
npx designme add context-meter --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Context meter shows how full an agent's context window is and what fills it. A small pill with a ring and a percentage opens a panel with one bar split by kind (files, tool output, chat, instructions), a legend whose rows list what is in them on hover, and a Compact button that frees room and says how much.

### When to use it

- When long agent sessions run close to the context limit and people should see it coming.
- When people want to know why the context is full, not only how full it is.
- When your agent can compact a session, and people should decide when and see what it freed.
- When a new tool result can suddenly take a large share and you want to warn about it.

### What it does

- `parts` are the kinds of thing in the context, each with a `label`, a `tokens` count, an optional `color` and `items`, the list shown on hover. `limit` is the size of the window.
- The pill shows the ring and the share used. From `warnAt` of the limit, 85% by default, the ring turns amber.
- The bar and the numbers count to their new values whenever `parts` change, so a compaction counts down.
- Hovering a legend row lights its share of the bar and shows its `items`.
- `message` adds a line under the legend, in amber with a warning sign for `messageTone: 'warn'` or in green with a check for `'ok'`, like "Freed 41.2k tokens. 9 decisions kept". The line keeps its room while empty, so a message fades in without the panel changing height.
- Compact calls `onCompact`. Return a promise and the button spins until it settles. Set `compacted` and the button becomes Undo, which calls `onUndo`.
- The pill opens and shuts the panel, and `open`, `defaultOpen` and `onOpenChange` let you control it. The panel keeps its room while shut, so nothing around it moves.

### Accessibility

- The pill is a button with `aria-expanded` and a label that includes the share used, like "Context, 68% used".
- The panel is a region labelled "What fills the context", and it is inert while shut so its controls can't be reached.
- Escape shuts the panel while the pointer or the focus is on the meter, and moves the focus back to the pill if it was inside.
- The message line is an `aria-live="polite"` region, so a warning or the compaction result is announced.

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

/* ---------- Context meter: what fills it, new tool output takes it close to the limit, Compact frees room ---------- */
const START: ContextPart[] = [
  { key: 'files', label: 'Files', tokens: 56200, items: 'Pricing.fig export 31.9k, PricingCard.tsx 18.2k, tokens.css 6.1k' },
  { key: 'tools', label: 'Tool output', tokens: 41800, items: 'Contrast check 17.4k, Figma frames 15.6k, grid audit 8.8k' },
  { key: 'chat', label: 'Chat', tokens: 32100, items: '48 turns with Maya Kim since 09:12' },
  { key: 'sys', label: 'Instructions', tokens: 6300, items: 'Studio guidelines 4.1k, pricing brief 2.2k' }
];
const LIMIT = 200000;
const sum = (ps: ContextPart[]) => ps.reduce((t, p) => t + p.tokens, 0);
const set = (ps: ContextPart[], key: string, tokens: number) => ps.map(p => p.key === key ? { ...p, tokens } : p);

export default function ContextMeterDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [parts, setParts] = useState(START);
  const [before, setBefore] = useState<ContextPart[] | null>(null);
  const [message, setMessage] = useState<{ text: string; tone: 'warn' | 'ok' }>();
  const [open, setOpen] = useState(true);
  const live = useRef(parts);
  useEffect(() => { live.current = parts; });
  const at = (ps: ContextPart[], key: string) => ps.find(p => p.key === key)!.tokens;
  // Compact turns older turns into a summary and trims old tool output
  const compact = async () => {
    await wait(1000);
    const next = set(set(parts, 'chat', 4600), 'tools', at(parts, 'tools') - 13700);
    setBefore(parts); setParts(next);
    setMessage({ text: `Freed ${((sum(parts) - sum(next)) / 1000).toFixed(1)}k tokens. 9 decisions kept`, tone: 'ok' });
  };
  const undo = () => { if (before) setParts(before); setBefore(null); setMessage(undefined); };
  // the preview's story: new tool output lands and takes it close to the limit, the person compacts, then shuts the panel
  useStory(ref, async ({ wait, press }) => {
    await wait(8000);
    const next = set(live.current, 'tools', at(live.current, 'tools') + 38500);
    setParts(next); setMessage({ text: `${Math.round(sum(next) / LIMIT * 100)}% full. Older turns start to drop at 200k`, tone: 'warn' });
    await wait(2000); press('.dm-ctm-go');
    await wait(3500); setOpen(false);
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ContextMeter parts={parts} limit={LIMIT} message={message?.text} messageTone={message?.tone} onCompact={compact} compacted={!!before} onUndo={undo}
        hint={before ? 'Older turns are now a summary' : undefined} open={open} onOpenChange={setOpen} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `parts` | `ContextPart[]` |  |
| `limit` | `number` | The size of the context window, in tokens, like 200000 |
| `warnAt` (optional) | `number` | From this share of the limit (0 to 1) the ring turns amber. Defaults to 0.85 |
| `message` (optional) | `string` | A line under the legend, like "Freed 41.2k tokens. 9 decisions kept". Crossfades when it changes |
| `messageTone` (optional) | `'warn' \| 'ok'` | warn shows the message in amber with a warning sign, ok in green with a check |
| `onCompact` (optional) | `() => void \| Promise<void>` | Called by Compact. Return a promise and the button spins until it settles |
| `compacted` (optional) | `boolean` | Set once the context is compacted: the button turns into Undo, which calls onUndo |
| `onUndo` (optional) | `() => void` |  |
| `hint` (optional) | `string` | The quiet line beside the button. Defaults to what Compact does |
| `open` (optional) | `boolean` | Whether the panel is open. Leave it out to let the pill toggle it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `className` (optional) | `string` |  |

## Questions

**What should the parts be?**

Whatever your agent can tell apart. Files, tool output, chat and instructions work for most agents. Put the largest items of each into `items` so people can see what to drop.

**How do I show what a compaction freed?**

Make `onCompact` return a promise, update `parts` with the smaller counts when it resolves, set `compacted`, and pass the difference as `message` with `messageTone: 'ok'`. The numbers count down by themselves.

**When does it turn amber?**

When the tokens in `parts` add up to `warnAt` of `limit` or more. `warnAt` is 0.85 unless you change it.

## Source

`ContextMeter.tsx`, as `npx designme add context-meter --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useTween } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Spin, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './context-meter.css';

/** One kind of thing in the context */
export interface ContextPart {
  key: string;
  /** Like "Files", "Tool output" or "Chat" */
  label: string;
  /** How many tokens it takes */
  tokens: number;
  /** Its colour in the bar and the legend. Defaults to blue, teal, violet and grey, in order */
  color?: string;
  /** What is in it, shown when you hover its row, like "PricingCard.tsx 18.2k, tokens.css 6.1k" */
  items?: string;
}

export interface ContextMeterProps {
  parts: ContextPart[];
  /** The size of the context window, in tokens, like 200000 */
  limit: number;
  /** From this share of the limit (0 to 1) the ring turns amber. Defaults to 0.85 */
  warnAt?: number;
  /** A line under the legend, like "Freed 41.2k tokens. 9 decisions kept". Crossfades when it changes */
  message?: string;
  /** warn shows the message in amber with a warning sign, ok in green with a check */
  messageTone?: 'warn' | 'ok';
  /** Called by Compact. Return a promise and the button spins until it settles */
  onCompact?: () => void | Promise<void>;
  /** Set once the context is compacted: the button turns into Undo, which calls onUndo */
  compacted?: boolean;
  onUndo?: () => void;
  /** The quiet line beside the button. Defaults to what Compact does */
  hint?: string;
  /** Whether the panel is open. Leave it out to let the pill toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const PALETTE = ['var(--dm-pb)', 'var(--dm-pt)', 'var(--dm-pl)', 'var(--dm-faint)'];
const k = (n: number) => (n / 1000).toFixed(1) + 'k';

/** A number that counts to its new value (it starts on its first value) */
function Count({ value, ms = 900, format }: { value: number; ms?: number; format: (n: number) => string }) {
  return <>{format(useTween(value, ms))}</>;
}

/** How full the context is and what fills it: a pill with a ring that opens one bar split by kind, a legend whose rows list
 *  what is in them, and Compact. Escape closes it. */
export function ContextMeter({ parts, limit, warnAt = .85, message, messageTone = 'ok', onCompact, compacted = false, onUndo,
  hint = 'Summarises older turns', open, defaultOpen = true, onOpenChange, className }: ContextMeterProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [busy, setBusy] = useState(false);
  const [lit, setLit] = useState<string | null>(null);
  // it opens on its real numbers; they only count when something changes
  const ready = true;
  const total = parts.reduce((t, p) => t + p.tokens, 0), share = ready ? total / limit : 0, pct = Math.round(share * 100);
  const root = useRef<HTMLDivElement>(null), tg = useRef<HTMLButtonElement>(null);
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
    <div ref={root} data-dm="" className={cx('dm-ctm', share >= warnAt && 'dm-hot', className)} data-open={isOpen ? '1' : '0'}>
      <button ref={tg} type="button" className="dm-ctm-tg" aria-expanded={isOpen} aria-label={`Context, ${pct}% used`} onClick={() => setOpen(!isOpen)}>
        <span className="dm-ctm-ring" aria-hidden="true">
          <svg viewBox="0 0 20 20"><circle className="dm-tr" cx="10" cy="10" r="7.5" /><circle className="dm-fl" cx="10" cy="10" r="7.5" pathLength={100} style={{ strokeDasharray: `${pct} 100` }} /></svg>
        </span>
        <span><span className="dm-ctm-pc dm-num"><Count value={ready ? total : 0} format={n => Math.round(n / limit * 100) + '%'} /></span> of context used</span>
        <Icon name="chev-d" size="xs" />
      </button>
      <div className="dm-ctm-pop dm-panel" role="region" aria-label="What fills the context" inert={!isOpen}>
        <div className="dm-ctm-ph"><span>In context</span><span className="dm-num"><b className="dm-ctm-tot"><Count value={ready ? total : 0} format={k} /></b> of {Math.round(limit / 1000)}k tokens</span></div>
        <div className={cx('dm-ctm-bar', lit && 'dm-hl')} aria-hidden="true">
          {parts.map((p, i) => <i key={p.key} className={lit === p.key ? 'dm-on' : undefined} style={{ width: (ready ? p.tokens / limit * 100 : 0) + '%', '--dm-c': p.color ?? PALETTE[i % PALETTE.length] } as CSSProperties} />)}
        </div>
        <div className="dm-ctm-leg" onPointerLeave={() => setLit(null)}>
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
          <span>{message && <><Icon name={messageTone === 'warn' ? 'warn' : 'ok'} size="xs" /><Swap>{message}</Swap></>}</span>
        </div>
        {(onCompact || onUndo) && (
          <div className="dm-ctm-f">
            <Swap className="dm-ctm-hint">{hint}</Swap>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-ctm-go" onClick={compact}>{busy ? <><Spin />Compacting</> : compacted ? 'Undo' : 'Compact'}</button>
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
- [Browser session](https://designme.dev/components/browser-session.md): The agent browsing for you, step by step, with Pause and Take over.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Grouped tasks with live progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.

All components: https://designme.dev/llms.txt
