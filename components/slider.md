# Slider

> Named stops, a stepped scale and a range, with the agent's recommended value marked on the track.

App basics / Forms and inputs. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/slider

## Install

```sh
npx designme add slider          # HTML, CSS and JS, with the shared core
npx designme add slider --react  # React 19 component and its CSS
npx designme add slider --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/slider.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/slider.json  # Astro
```

## About

Sliders for the settings an agent takes: a single slider with named stops (a Creativity slider from Precise to Creative, with a sample sentence that rewrites itself in the chosen tone), a stepped slider with a tick and a number at each step, and a range with two knobs that never cross. A value the agent recommends sits on the track as a mark you can press, and a knob dropped near it snaps to it.

### When to use it

- For a setting with a few named levels that people understand better as words, like tone or effort.
- For a whole number that moves in fixed steps, like tool calls or retries per run.
- For a budget or a window with a lower and an upper bound.
- When the agent can suggest a good value and you want people to see it without being forced to take it.

### What it does

- Drag a knob, or press anywhere on the track: the nearest knob comes to the pointer and follows it.
- The value shows over the knob while you drag it, hover it or move it with the keys, and in the header beside the label.
- `names` splits the range into named parts (Precise, Focused, Balanced, Playful, Creative); the nearest name shows beside the value.
- `stops` adds buttons under the track that glide the knob to a value; `ticks` adds a tick and a number at each step, each one a button.
- `recommended` draws the agent's mark over the track and a notch in it. Pressing the mark glides the knob there, and a knob dragged within 5% of it snaps to it.
- `description` is a line under the slider that crossfades when it changes, like a sample sentence in the chosen tone.
- `RangeSlider` keeps its two knobs at least one step apart, so they can't cross; pressing the track moves the nearer knob.
- `SliderGroup` is the panel they sit in on designme.dev, with a hairline between sliders.

### Accessibility

- Each knob has role="slider" with aria-valuemin, aria-valuemax and aria-valuenow, and an aria-valuetext with the unit and the name, like "0.40, Balanced, recommended" or "At most $0.35".
- On a range, each knob's limits stop at the other knob, so a screen reader announces the real range.
- The arrow keys move one step, Shift with an arrow or Page Up and Page Down move ten (or `bigStep`), and Home and End go to the ends.
- Stops, ticks and the recommended mark are buttons, so they can be reached with Tab and pressed with Enter or Space; the mark has a label and a tooltip on hover and keyboard focus.
- The keyboard focus ring is the quiet grey ring; a mouse or touch never shows one.

## Usage in React

```tsx
import { Slider } from '@/components/designme/slider/Slider';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React components: try the far end of Creativity, take the agent's
// recommendation, read fewer tool calls, then narrow the budget.
import { useRef, useState } from 'react';
import { RangeSlider, Slider, SliderGroup } from './Slider';
import { useStory } from '../lib/useScript';

const NAMES = ['Precise', 'Focused', 'Balanced', 'Playful', 'Creative'];
const SAMPLE = [
  'The export failed because the token expired. Renew it in Settings.',
  'The export failed: your access token expired. Renew it in Settings, then run it again.',
  "Your export didn't finish because its access token had expired. Renew it in Settings and try again.",
  'Your export tripped over an expired token. A quick renewal in Settings will get it moving.',
  'The export ran out of road when its token expired mid-trip. Renew it in Settings and send it on its way.'
];

export default function SliderDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [creativity, setCreativity] = useState(0.5);
  const [calls, setCalls] = useState(30);
  const [cost, setCost] = useState<[number, number]>([0.1, 0.6]);
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-sdx-stops button:last-child');
    await wait(3500); press('.dm-sdx-rec');
    await wait(2000); setCalls(20);
    await wait(2000); setCost([0.1, 0.35]);
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <SliderGroup>
        <Slider label="Creativity" min={0} max={1} step={0.05} bigStep={4} value={creativity} onValueChange={setCreativity} format={v => v.toFixed(2)}
          names={NAMES} stops={[{ value: 0, label: 'Precise' }, { value: 0.5, label: 'Balanced' }, { value: 1, label: 'Creative' }]}
          recommended={{ value: 0.4 }} description={SAMPLE[Math.round(creativity * 4)]} />
        <Slider label="Tool calls per run" min={10} max={50} step={10} bigStep={2} value={calls} onValueChange={setCalls} format={v => v + ' calls'} ticks />
        <RangeSlider label="Cost per run" min={0} max={1} step={0.05} bigStep={4} value={cost} onValueChange={setCost} format={v => '$' + v.toFixed(2)} />
      </SliderGroup>
    </div>
  );
}
```

## Props

### SliderProps

| Prop | Type | What it does |
| --- | --- | --- |
| `label` | `string` | Like "Creativity" |
| `min` (optional) | `number` |  |
| `max` (optional) | `number` |  |
| `step` (optional) | `number` |  |
| `bigStep` (optional) | `number` | Steps that Shift with an arrow, Page Up and Page Down move by (10) |
| `value` (optional) | `number` |  |
| `defaultValue` (optional) | `number` |  |
| `onValueChange` (optional) | `(value: number) => void` |  |
| `format` (optional) | `(value: number) => string` | How the value reads over the knob and in the header, like "0.40" or "30 calls" |
| `names` (optional) | `string[]` | Names for ranges of the value, like Precise to Creative: the nearest one shows beside the value and is spoken with it |
| `stops` (optional) | `SliderStop[]` | Buttons under the track that move the knob to a value |
| `ticks` (optional) | `boolean \| number[]` | A tick and a number under the track at each of these values (or at every step with `true`), each one a button |
| `recommended` (optional) | `{ value: number; label?: string }` | A value the agent recommends: a mark over the track you can press, and a knob dropped near it snaps to it |
| `description` (optional) | `string` | A line under the slider that changes with it, like a sample sentence in the chosen tone |
| `className` (optional) | `string` |  |

### RangeSliderProps

| Prop | Type | What it does |
| --- | --- | --- |
| `label` | `string` | Like "Cost per run" |
| `min` (optional) | `number` |  |
| `max` (optional) | `number` |  |
| `step` (optional) | `number` |  |
| `bigStep` (optional) | `number` |  |
| `value` (optional) | `[number, number]` |  |
| `defaultValue` (optional) | `[number, number]` |  |
| `onValueChange` (optional) | `(value: [number, number]) => void` |  |
| `format` (optional) | `(value: number) => string` |  |
| `thumbLabels` (optional) | `[string, string]` | What each knob is called for screen readers ("Lowest", "Highest") |
| `showEnds` (optional) | `boolean` | Shows `min` and `max` under the ends of the track |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import Slider from '../components/designme/slider/Slider.astro';
---
<Slider />
<Slider data-style="soft" class="my-class" />
```
It plays its demo; change `slider.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I show the named stops without fixing the slider to them?**

Use `names` for the words and `step` for how finely it moves. The knob can sit anywhere; the name shown is the nearest one.

**Can I turn off the snapping to the recommended value?**

Snapping only happens when `recommended` is set. Leave it out and the knob moves freely by `step`.

**How do I format money or units?**

Pass `format`, for example `v => '$' + v.toFixed(2)`. It is used over the knob, in the header and in the spoken value.

## Source

`Slider.tsx`, as `npx designme add slider --react` installs it:

```tsx
'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Swap, Tip } from '../lib/motion';
import '../designme.css';
import './slider.css';

interface TrackProps {
  min: number; max: number; step: number; big: number; values: number[]; onChange: (v: number[]) => void;
  format: (v: number, i: number) => string; valueText: (v: number, i: number) => string; labels: string[]; labelledBy?: string;
  recommended?: { value: number; label?: string }; snap: number; gliding: boolean; setGliding: (on: boolean) => void;
}
const fix = (x: number) => +x.toFixed(4);

/* one track: knobs you drag or move with the keys, the value over the knob while it moves, the covered part in the accent */
function Track({ min, max, step, big, values, onChange, format, valueText, labels, labelledBy, recommended, snap, gliding, setGliding }: TrackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const knobs = useRef<(HTMLSpanElement | null)[]>([]);
  const [drag, setDrag] = useState(false);
  const [active, setActive] = useState(0);
  const [say, setSay] = useState(false);
  // a press never shows the focus ring; the keys bring it back
  const [ptr, setPtr] = useState(false);
  // the knob leans into the way it moves and rights itself once the pointer rests (not with reduced motion)
  const last = useRef({ x: 0, t: 0 });
  const rest = useRef<ReturnType<typeof setTimeout>>(undefined);
  const body = (i: number) => knobs.current[i]?.querySelector<HTMLElement>('.dm-sdx-kb') ?? null;
  const still = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lean = (i: number, deg: number) => body(i)?.style.setProperty('--dm-tilt', deg.toFixed(1) + 'deg');
  useEffect(() => () => clearTimeout(rest.current), []);
  const sayT = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(sayT.current), []);
  const pct = (x: number) => (x - min) / (max - min) * 100;
  const two = values.length > 1;
  const clamp = (i: number, x: number) => { let lo = min, hi = max; if (two) { if (i === 0) hi = values[1] - step; else lo = values[0] + step; } return Math.max(lo, Math.min(hi, x)); };
  const set = (i: number, x: number, near = false) => {
    let v = clamp(i, Math.round((x - min) / step) * step + min), hit = false;
    if (near && recommended && Math.abs(v - recommended.value) <= snap) { v = recommended.value; hit = true; }
    if (fix(v) === fix(values[i])) return;
    const next = values.slice(); next[i] = fix(v); onChange(next);
    // a little hop when it snaps onto the agent's mark
    if (hit && drag && !still()) body(i)?.animate([{ transform: 'scale(1.2)' }, { transform: 'scale(1.38)', offset: .35 }, { transform: 'scale(1.2)' }], { duration: 320, easing: 'cubic-bezier(.34,1.56,.64,1)' });
  };
  const flash = (i: number) => { setActive(i); setSay(true); clearTimeout(sayT.current); sayT.current = setTimeout(() => setSay(false), 1200); };
  const at = (clientX: number) => { const b = ref.current!.getBoundingClientRect(); return min + (max - min) * Math.max(0, Math.min(1, (clientX - b.left) / b.width)); };
  const down = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('.dm-sdx-rec') || e.button) return;
    const x = at(e.clientX);
    const i = two ? (Math.abs(x - values[0]) < Math.abs(x - values[1]) || x < values[0] ? 0 : 1) : 0;
    e.preventDefault(); setGliding(false); setActive(i); setDrag(true); setPtr(true); e.currentTarget.setPointerCapture(e.pointerId);
    last.current = { x: e.clientX, t: e.timeStamp };
    knobs.current[i]?.focus({ preventScroll: true, focusVisible: false } as FocusOptions); set(i, x, true);
  };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    set(active, at(e.clientX), true);
    if (still()) return;
    const dt = Math.max(8, e.timeStamp - last.current.t), vx = (e.clientX - last.current.x) / dt; last.current = { x: e.clientX, t: e.timeStamp };
    lean(active, Math.max(-16, Math.min(16, vx * 14))); clearTimeout(rest.current); rest.current = setTimeout(() => lean(active, 0), 90);
  };
  // let go, it drops back with a bounce
  const up = () => {
    if (!drag) return;
    setDrag(false); clearTimeout(rest.current); lean(active, 0);
    if (!still()) body(active)?.animate([{ transform: 'scale(1.2)' }, { transform: 'scale(.9)', offset: .4 }, { transform: 'scale(1.05)', offset: .7 }, { transform: 'scale(1)' }], { duration: 480, easing: 'ease-out' });
  };
  const key = (i: number) => (e: React.KeyboardEvent) => {
    setPtr(false);
    const bigStep = step * big;
    const d = ({ ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: bigStep, PageDown: -bigStep } as Record<string, number>)[e.key];
    if (d != null) { e.preventDefault(); set(i, values[i] + (e.shiftKey && e.key.startsWith('Arrow') ? Math.sign(d) * bigStep : d)); flash(i); }
    else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); set(i, e.key === 'Home' ? -Infinity : Infinity); flash(i); }
  };
  return (
    <div ref={ref} className={cx('dm-sdx-tr', drag && 'dm-drag', gliding && 'dm-glide')} onPointerDown={down}
      onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <span className="dm-sdx-rail">
        <i className="dm-sdx-fill" style={{ left: two ? pct(values[0]) + '%' : 0, width: (two ? pct(values[1]) - pct(values[0]) : pct(values[0])) + '%' }} />
        {recommended && <i className="dm-sdx-notch" style={{ left: `calc(10px + (100% - 20px) * ${pct(recommended.value) / 100})` }} />}
      </span>
      {recommended && <Tip label={recommended.label ?? `Recommended by the agent: ${format(recommended.value, 0)}`}>
        <button type="button" className="dm-sdx-rec" style={{ left: pct(recommended.value) + '%' }} aria-label="Use the recommended value"
          onClick={() => { setGliding(true); set(0, recommended.value); flash(0); }}><Icon name="spark" size="xs" /></button>
      </Tip>}
      {values.map((v, i) => (
        <span key={i} ref={el => { knobs.current[i] = el; }} className={cx('dm-sdx-k', i === active && 'dm-on', i === active && say && 'dm-say', ptr && 'dm-ptr')} role="slider" tabIndex={0}
          aria-label={labelledBy ? undefined : labels[i]} aria-labelledby={labelledBy} aria-valuemin={two && i ? fix(values[0] + step) : min} aria-valuemax={two && !i ? fix(values[1] - step) : max}
          aria-valuenow={fix(v)} aria-valuetext={valueText(v, i)} style={{ left: pct(v) + '%' }} onKeyDown={key(i)}>
          <i className="dm-sdx-kb" />
          <span className="dm-sdx-tt dm-num">{format(v, i)}</span>
        </span>
      ))}
    </div>
  );
}

const useGlide = () => {
  const [on, setOn] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  return [on, (v: boolean) => { setOn(v); clearTimeout(t.current); if (v) t.current = setTimeout(() => setOn(false), 500); }] as const;
};

export interface SliderStop { value: number; label: string }

export interface SliderProps {
  /** Like "Creativity" */
  label: string;
  min?: number;
  max?: number;
  step?: number;
  /** Steps that Shift with an arrow, Page Up and Page Down move by (10) */
  bigStep?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** How the value reads over the knob and in the header, like "0.40" or "30 calls" */
  format?: (value: number) => string;
  /** Names for ranges of the value, like Precise to Creative: the nearest one shows beside the value and is spoken with it */
  names?: string[];
  /** Buttons under the track that move the knob to a value */
  stops?: SliderStop[];
  /** A tick and a number under the track at each of these values (or at every step with `true`), each one a button */
  ticks?: boolean | number[];
  /** A value the agent recommends: a mark over the track you can press, and a knob dropped near it snaps to it */
  recommended?: { value: number; label?: string };
  /** A line under the slider that changes with it, like a sample sentence in the chosen tone */
  description?: string;
  className?: string;
}

/** A slider with named stops, ticks and an agent's recommended value. Arrows move a step, Shift or Page Up/Down ten, Home and End the ends. */
export function Slider({ label, min = 0, max = 100, step = 1, bigStep = 10, value, defaultValue = min, onValueChange, format = v => String(v), names, stops, ticks, recommended, description, className }: SliderProps) {
  const [v, setV] = useControllable(value, defaultValue, onValueChange);
  const [gliding, setGliding] = useGlide();
  const id = useId();
  const name = (x: number) => names ? names[Math.min(names.length - 1, Math.round((x - min) / (max - min) * (names.length - 1)))] : '';
  const head = names ? `${name(v)}, ${format(v)}` : format(v);
  const tickVals = ticks === true ? Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => fix(min + i * step)) : ticks || [];
  const go = (x: number) => { setGliding(true); setV(x); };
  return (
    <div data-dm="" className={cx('dm-sdx-b', className)}>
      <div className="dm-sdx-h"><span id={id}>{label}</span><span className="dm-sdx-v dm-num">{head}</span></div>
      <Track min={min} max={max} step={step} big={bigStep} values={[v]} onChange={n => setV(n[0])} format={format} labels={[label]} labelledBy={id}
        valueText={x => [format(x), name(x), recommended && Math.abs(x - recommended.value) < 1e-3 ? 'recommended' : ''].filter(Boolean).join(', ')}
        recommended={recommended} snap={(max - min) * .05} gliding={gliding} setGliding={setGliding} />
      {stops && <div className="dm-sdx-stops">{stops.map(s => <button type="button" key={s.value} aria-pressed={Math.abs(s.value - v) < 1e-3} onClick={() => go(s.value)}>{s.label}</button>)}</div>}
      {tickVals.length > 0 && <div className="dm-sdx-ticks dm-num">{tickVals.map(t => <button type="button" key={t} aria-pressed={Math.abs(t - v) < 1e-3} aria-label={`${format(t)}`} style={{ left: (t - min) / (max - min) * 100 + '%' }} onClick={() => go(t)}><i />{t}</button>)}</div>}
      {description != null && <p className="dm-sdx-sm" aria-live="polite"><Swap>{description}</Swap></p>}
    </div>
  );
}

export interface RangeSliderProps {
  /** Like "Cost per run" */
  label: string;
  min?: number;
  max?: number;
  step?: number;
  bigStep?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  format?: (value: number) => string;
  /** What each knob is called for screen readers ("Lowest", "Highest") */
  thumbLabels?: [string, string];
  /** Shows `min` and `max` under the ends of the track */
  showEnds?: boolean;
  className?: string;
}

/** Two knobs on one track for a range. They stay at least a step apart, so they never cross. */
export function RangeSlider({ label, min = 0, max = 100, step = 1, bigStep = 10, value, defaultValue = [min, max], onValueChange, format = v => String(v), thumbLabels = ['Lowest', 'Highest'], showEnds = true, className }: RangeSliderProps) {
  const [v, setV] = useControllable(value, defaultValue, onValueChange);
  const [gliding, setGliding] = useGlide();
  return (
    <div data-dm="" className={cx('dm-sdx-b', className)}>
      <div className="dm-sdx-h"><span>{label}</span><span className="dm-sdx-v dm-num">{format(v[0])} to {format(v[1])}</span></div>
      <Track min={min} max={max} step={step} big={bigStep} values={v} onChange={n => setV([n[0], n[1]])} format={format}
        labels={thumbLabels.map(t => `${t} ${label.toLowerCase()}`)} valueText={(x, i) => (i ? 'At most ' : 'At least ') + format(x)} snap={0} gliding={gliding} setGliding={setGliding} />
      {showEnds && <div className="dm-sdx-ends dm-muted dm-num"><span>{format(min)}</span><span>{format(max)}</span></div>}
    </div>
  );
}

/** The panel the sliders sit in on designme.dev, with a hairline between them */
export function SliderGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div data-dm="" className={cx('dm-sdx dm-panel', className)}>{children}</div>;
}
```

## More in Forms and inputs

- [Buttons](https://designme.dev/components/buttons.md): Every button style, with loading, success and hold-to-confirm states.
- [Badge](https://designme.dev/components/badge.md): Small labels for plans, environments and status, with a dot, an icon or a remove button.
- [Progress and meter](https://designme.dev/components/progress.md): An agent run's progress and what it costs, with a credits meter that warns as it fills.
- [Tooltip](https://designme.dev/components/tooltip.md): Quiet labels on hover, with shortcuts and a richer preview card.
- [Search input](https://designme.dev/components/search-input.md): Search with scoped filters, recent queries and an agent answer.
- [Country select](https://designme.dev/components/country-select.md): A searchable select with country codes, currency and keyboard support.
- [Multi-select](https://designme.dev/components/multi-select.md): A combobox that filters as you type and keeps your picks as chips.
- [Colour picker](https://designme.dev/components/color-picker.md): Pick a colour by eye or by hex, check its contrast, and let the agent fix it or make a scale from it.
- [Social sign-in](https://designme.dev/components/social-sign-in.md): One-tap providers that remember the last one you used.
- [Sign in](https://designme.dev/components/sign-in.md): Email first, then the one-time code from the email, copied or typed in.
- [OTP field](https://designme.dev/components/otp-field.md): A one-time code, one box per digit, that fills from a paste.
- [Form](https://designme.dev/components/form.md): A project brief with inline checks and an agent that drafts the rest.
- [Payment form](https://designme.dev/components/payment-form.md): Card details with live formatting, brand detection and a clear total.
- [Carousel](https://designme.dev/components/carousel.md): Drafts the agent made to keep one of, or a gallery of pictures, on one swipeable track.

All components: https://designme.dev/llms.txt
