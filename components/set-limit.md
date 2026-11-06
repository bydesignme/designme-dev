# Set limit

> A monthly agent budget with a draggable cap and a forecast.

App basics / Product. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/set-limit

## Install

```sh
npx designme add set-limit          # HTML, CSS and JS, with the shared core
npx designme add set-limit --react  # React 19 component and its CSS
npx designme add set-limit --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/set-limit.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/set-limit.json  # Astro
```

## About

Set limit is a budget card for capping what an agent can spend in a month. A bar shows what has been spent so far and where spending is forecast to land, and the person drags a knob or types a figure to set the cap. A line under the bar warns when the forecast will pass the cap, and a switch decides whether runs pause, ask first or keep going at the limit.

### When to use it

- When agent runs cost money and a team needs a monthly ceiling
- When people should see whether their current pace will go over before it happens
- When the team must choose what the agent does at the limit: stop, ask, or continue
- When a cap needs to be adjusted quickly by dragging or typing an exact amount

### What it does

- The bar shows `spent` as a solid fill and `forecast` as a striped fill up to the cap.
- Dragging along the bar snaps the cap to `step`, and the knob glides to new values set any other way.
- Clicking the big figure lets the person type a cap; Enter or leaving the field keeps it within `min` and `max`, and Escape restores the old value.
- When the forecast passes the cap, the line warns "Forecast passes your cap around Oct 27" and says what runs will do; otherwise it shows the amount left.
- The At the limit switch sets `mode` to pause, ask or keep, and `message` can replace the line under the bar.
- `format` controls how amounts are written, and the symbols around the number stay in place while typing.

### Accessibility

- The knob is a `slider` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and a formatted `aria-valuetext`.
- Arrow keys move the cap by `step`, on the slider and in the typed figure.
- The warning line is an `aria-live="polite"` region, so going over or back on track is announced.
- The At the limit switch is a labelled `group` with `aria-pressed` on each choice.

## Usage in React

```tsx
import { SetLimit } from '@/components/designme/set-limit/SetLimit';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { SetLimit } from './SetLimit';
import { useStory } from '../lib/useScript';

/* ---------- Set limit: the cap eases down from $200 to $170, past the forecast, and the warning comes in, unless someone
   drags the cap or types a budget first ---------- */
export default function SetLimitDemo() {
  const [cap, setCap] = useState(200);
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait }) => {
    await wait(1500);
    const t0 = performance.now();
    for (let p = 0; p < 1;) {
      await wait(16);
      p = Math.min(1, (performance.now() - t0) / 900);
      setCap(Math.round((200 - 30 * (1 - Math.pow(1 - p, 3))) / 10) * 10);
    }
  });
  return <div ref={ref} style={{ width: '100%' }}><SetLimit value={cap} onValueChange={setCap} /></div>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `value` (optional) | `number` | The cap. Leave it out to let the slider set it |
| `defaultValue` (optional) | `number` |  |
| `onValueChange` (optional) | `(cap: number) => void` |  |
| `min` (optional) | `number` | The lowest cap the slider allows |
| `max` (optional) | `number` | The highest cap the slider allows |
| `step` (optional) | `number` | How far one arrow key press or slider notch moves the cap |
| `spent` (optional) | `number` | Spent so far this period, the solid part of the bar |
| `forecast` (optional) | `number` | Where spending is headed by the end of the period, the striped part of the bar |
| `mode` (optional) | `SetLimitMode` | What happens at the cap. Leave it out to let the switch set it |
| `defaultMode` (optional) | `SetLimitMode` |  |
| `onModeChange` (optional) | `(mode: SetLimitMode) => void` |  |
| `title` (optional) | `string` |  |
| `subtitle` (optional) | `string` | The quiet line under the title, like "Resets Nov 1" |
| `passesOn` (optional) | `string` | When the forecast passes the cap, like "Oct 27" |
| `format` (optional) | `(n: number) => string` | Writes an amount, like "$200" |
| `editable` (optional) | `boolean` | Lets the person click the big figure and type a cap (the default). Enter or leaving the field keeps it, held to min and max; Escape goes back |
| `message` (optional) | `(state: SetLimitMessage) => ReactNode` | Replaces the line under the bar, which by default warns when the forecast passes the cap |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import SetLimit from '../components/designme/set-limit/SetLimit.astro';
---
<SetLimit />
<SetLimit data-style="soft" class="my-class" />
```
It plays its demo; change `set-limit.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Does this component stop the agent when the cap is reached?**

No. It shows and sets the cap and the at-the-limit choice. Read them from `onValueChange` and `onModeChange` and enforce them where your runs are billed.

**How do I show amounts in another currency?**

Pass `format`, like `n => n + ' €'`. The text around the number stays fixed while someone types a new cap.

**Can I write my own warning text?**

Yes. `message` receives whether the forecast is over, the cap, what is left and the mode, and returns what to show under the bar.

## Source

`SetLimit.tsx`, as `npx designme add set-limit --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useTween } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Seg } from '../lib/motion';
import '../designme.css';
import './set-limit.css';

/** What happens when spending reaches the cap */
export type SetLimitMode = 'pause' | 'ask' | 'keep';

export interface SetLimitMessage {
  /** True when the forecast goes past the cap */
  over: boolean;
  cap: number;
  /** The cap minus the forecast, what is left at the end of the period */
  left: number;
  mode: SetLimitMode;
}

export interface SetLimitProps {
  /** The cap. Leave it out to let the slider set it */
  value?: number;
  defaultValue?: number;
  onValueChange?: (cap: number) => void;
  /** The lowest cap the slider allows */
  min?: number;
  /** The highest cap the slider allows */
  max?: number;
  /** How far one arrow key press or slider notch moves the cap */
  step?: number;
  /** Spent so far this period, the solid part of the bar */
  spent?: number;
  /** Where spending is headed by the end of the period, the striped part of the bar */
  forecast?: number;
  /** What happens at the cap. Leave it out to let the switch set it */
  mode?: SetLimitMode;
  defaultMode?: SetLimitMode;
  onModeChange?: (mode: SetLimitMode) => void;
  title?: string;
  /** The quiet line under the title, like "Resets Nov 1" */
  subtitle?: string;
  /** When the forecast passes the cap, like "Oct 27" */
  passesOn?: string;
  /** Writes an amount, like "$200" */
  format?: (n: number) => string;
  /** Lets the person click the big figure and type a cap (the default). Enter or leaving the field keeps it, held to min and max; Escape goes back */
  editable?: boolean;
  /** Replaces the line under the bar, which by default warns when the forecast passes the cap */
  message?: (state: SetLimitMessage) => ReactNode;
  className?: string;
}

const MODES: { value: SetLimitMode; label: string }[] = [{ value: 'pause', label: 'Pause runs' }, { value: 'ask', label: 'Ask me' }, { value: 'keep', label: 'Keep going' }];
const WILL: Record<SetLimitMode, string> = { pause: 'pause', ask: 'wait for you', keep: 'keep going' };

/** A spending cap on a bar that shows what is spent and what is forecast, with what to do at the limit. */
export function SetLimit({ value, defaultValue = 200, onValueChange, min = 50, max = 500, step = 10, spent = 128, forecast = 184, mode, defaultMode = 'pause', onModeChange,
  title = 'Monthly agent budget', subtitle = 'Resets Nov 1', passesOn = 'Oct 27', format = n => '$' + n, editable = true, message, className }: SetLimitProps) {
  const [capRaw, setCap] = useControllable(value, defaultValue, onValueChange);
  const [atLimit, setMode] = useControllable(mode, defaultMode, onModeChange);
  const cap = Math.max(min, Math.min(max, capRaw));
  const [drag, setDrag] = useState(false);
  // a change from the keys or the field shows the amount over the knob for a moment, so it can be followed there too
  const [say, setSay] = useState(0);
  useEffect(() => { if (!say) return; const t = setTimeout(() => setSay(0), 1200); return () => clearTimeout(t); }, [say]);
  const told = () => setSay(n => n + 1);
  // the bars fill in a moment after the card appears
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);
  const bar = useRef<HTMLDivElement>(null);
  // the knob and bars glide to a new cap, except while it is being dragged
  const shown = useTween(cap, drag ? 1 : 450);
  // the figure being typed, while the field has focus
  const [draft, setDraft] = useState<string | null>(null);
  const before = useRef(cap), cancel = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const clamp = (n: number) => Math.max(min, Math.min(max, Math.round(n)));
  const commit = () => {
    if (draft === null) return;
    const n = cancel.current || draft === '' ? before.current : clamp(parseInt(draft, 10));
    setCap(n); if (n !== cap) told(); cancel.current = false; setDraft(null);
  };
  // the symbols around the number in `format`, like the "$" in "$200", stay put while the number is typed
  const text = format(cap), first = text.search(/\d/), last = text.length - [...text].reverse().join('').search(/\d/);
  const pre = first < 0 ? '' : text.slice(0, first), post = first < 0 ? '' : text.slice(last);

  const pct = (x: number) => (x - min) / (max - min) * 100;
  const snap = (x: number) => Math.max(min, Math.min(max, Math.round(x / step) * step));
  const at = (e: PointerEvent) => { const b = bar.current!.getBoundingClientRect(); setCap(snap(min + (max - min) * Math.max(0, Math.min(1, (e.clientX - b.left) / b.width)))); };
  const key = (e: KeyboardEvent) => {
    const dir = ({ ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 } as Record<string, number>)[e.key]; if (!dir) return;
    e.preventDefault(); setCap(Math.max(min, Math.min(max, cap + dir * step))); told();
  };

  const over = forecast > cap, left = cap - forecast;
  const used = ready ? Math.min(100, spent / shown * pct(shown)) : 0;
  const fc = ready ? Math.min(pct(shown), forecast / shown * pct(shown)) : 0;
  const figure = draft ?? String(Math.round(shown));
  const line = message ? message({ over, cap, left, mode: atLimit })
    : over ? <><Icon name="alert" size="xs" />Forecast passes your cap around {passesOn}. Runs will {WILL[atLimit]}.</>
      : <><Icon name="ok" size="xs" />On track. About {format(left)} left at month end.</>;

  return (
    <div data-dm="" className={cx('dm-slx dm-panel', className)}>
      <div className="dm-slx-h">
        <div><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div>
        {editable ? (
          // reads as the figure until it is clicked; a click selects it all, so typing replaces it
          <label className="dm-num dm-slx-v" onPointerDown={e => { if (document.activeElement !== input.current) { e.preventDefault(); input.current?.focus(); } }}>
            {pre}<input ref={input} className="dm-slx-in" inputMode="numeric" autoComplete="off" aria-label={title} value={figure} style={{ width: Math.max(1, figure.length) + 'ch' }}
              onFocus={e => { before.current = cap; setDraft(String(cap)); e.currentTarget.select(); }}
              onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 6); setDraft(v); const n = +v; if (v && n >= min && n <= max) { setCap(n); told(); } }}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
                else if (e.key === 'Escape') { cancel.current = true; e.currentTarget.blur(); }
                else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); const n = clamp((parseInt(draft ?? '', 10) || cap) + (e.key === 'ArrowUp' ? step : -step)); setDraft(String(n)); setCap(n); told(); }
              }}
              onBlur={commit} />{post}
          </label>
        ) : <b className="dm-num dm-slx-v">{format(cap)}</b>}
      </div>
      <div ref={bar} className="dm-slx-bar"
        onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); at(e); }}
        onPointerMove={e => { if (drag) at(e); }}
        onPointerUp={() => setDrag(false)} onPointerCancel={() => setDrag(false)}>
        <div className="dm-slx-used" style={{ width: used + '%' }} />
        <div className="dm-slx-fc" style={{ width: fc + '%' }} />
        <button type="button" className={cx('dm-slx-k', drag && 'dm-drag', say > 0 && 'dm-say')} role="slider" aria-label="Budget cap"
          aria-valuemin={min} aria-valuemax={max} aria-valuenow={cap} aria-valuetext={format(cap)} style={{ left: pct(shown) + '%' }} onKeyDown={key}>
          <span className="dm-slx-tt dm-num">{format(cap)}</span>
        </button>
      </div>
      <div className="dm-slx-lg dm-muted">
        <span><i style={{ background: 'var(--dm-accent)' }} />Spent <b className="dm-num">{format(spent)}</b></span>
        <span><i className="dm-fc" />Forecast <b className="dm-num">{format(forecast)}</b></span>
      </div>
      <div className="dm-slx-warn" aria-live="polite">
        {/* the line comes in again when it changes between on track and over, or the choice at the limit changes */}
        {ready && <span key={String(over) + atLimit} className={cx(over ? 'dm-w' : 'dm-o', 'dm-enter')}>{line}</span>}
      </div>
      <div className="dm-slx-opt">
        <span className="dm-muted">At the limit</span>
        <Seg className="dm-slx-sg" label="At the limit" value={atLimit} onChange={setMode} options={MODES} />
      </div>
    </div>
  );
}
```

## More in Product

- [Pricing cards](https://designme.dev/components/pricing-cards.md): Three plans with a billing switch and a seat slider.
- [Onboarding checklist](https://designme.dev/components/onboarding-checklist.md): First steps with a progress ring, and the agent can do some for you.
- [Stepper](https://designme.dev/components/stepper.md): A multi-step setup with a progress track that fills as you go.
- [Currency converter](https://designme.dev/components/currency-converter.md): Show plan prices in local currency, with a swap and live rate.

All components: https://designme.dev/llms.txt
