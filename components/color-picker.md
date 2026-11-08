# Colour picker

> Pick a colour by eye or by hex, check its contrast, and let the agent fix it or make a scale from it.

App basics / Forms and inputs. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/color-picker

## Install

```sh
npx designme add color-picker          # HTML, CSS and JS, with the shared core
npx designme add color-picker --react  # React 19 component and its CSS
npx designme add color-picker --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/color-picker.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/color-picker.json  # Astro
```

## About

A colour picker with its accessibility check built in. Pick by eye in a saturation and brightness field with hue and opacity rails, type a hex, or press a swatch. Under it, the colour's contrast with white and with ink text shows as a ratio and as Pass or Fail. Two agent actions finish the job: Suggest an accessible shade glides to the nearest darker shade where white text passes, and Make a scale fills a 50 to 900 ramp from the colour.

### When to use it

- For brand or accent colours in a design tool or a theme editor, where the colour will carry text.
- When people pick colours by eye and need to know at once whether text on them will be readable.
- To turn one picked colour into a scale for a design system.

### What it does

- A saturation and brightness field, a hue rail and an optional opacity rail, each with a knob that shows the colour under it.
- A hex field that takes three or six digits, with or without #; Enter keeps a valid colour, a wrong one is marked in red, and Escape puts back the one before.
- Swatches that glide the picker to their colour; the one matching the colour is marked.
- Contrast with white and with ink text (`ink`, #111111 by default) as a WCAG 2 ratio and a Pass or Fail tag at 4.5:1.
- Suggest an accessible shade, the primary button (on the accent, so it follows yours), keeps the hue and saturation and darkens the colour to the nearest shade where white text passes; once white text passes the button says so and is disabled.
- Make a scale fills ten steps from 50 to 900 one after another; the picked colour takes the step nearest its lightness, and each step shows its hex on hover and focus. `onScale` receives the steps.

### Accessibility

- The field and both rails are sliders (role="slider") with values in words: "Saturation 62%, brightness 62%", "172 degrees", "100% opaque".
- On the field, Left and Right change saturation and Up and Down brightness; on the rails the arrows move one step. Shift moves ten, Home and End go to the ends.
- The hex field has a label and aria-invalid when what was typed isn't a colour.
- Pass and Fail are words, not only colours; the contrast lines are a polite live region.
- A visually hidden live region says what the agent did, like "Moved to #1D6FD6, white text passes".

## Usage in React

```tsx
import { ColorPicker } from '@/components/designme/color-picker/ColorPicker';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: a bright blue fails with white text, the agent
// darkens it until it passes, then makes a scale from it.
import { useRef, useState } from 'react';
import { ColorPicker } from './ColorPicker';
import { useStory } from '../lib/useScript';

export default function ColorPickerDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState('#3c9e91');
  const [alpha, setAlpha] = useState(1);
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-cpk-sw button');
    await wait(2500); press('.dm-cpk-act .dm-soft');
    await wait(2500); press('.dm-cpk-act .dm-ghost');
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ColorPicker value={color} onValueChange={setColor} alpha={alpha} onAlphaChange={setAlpha} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `value` (optional) | `string` | A hex colour, like "#2f8cff" |
| `defaultValue` (optional) | `string` |  |
| `onValueChange` (optional) | `(hex: string) => void` |  |
| `alpha` (optional) | `number` | Opacity, 0 to 1. Leave both out to hide the opacity rail |
| `onAlphaChange` (optional) | `(alpha: number) => void` |  |
| `swatches` (optional) | `string[]` |  |
| `ink` (optional) | `string` | The dark text colour the contrast is checked against (#111111) |
| `onScale` (optional) | `(scale: { step: number; hex: string; base: boolean }[]) => void` | Called when a scale is made, with its ten steps |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ColorPicker from '../components/designme/color-picker/ColorPicker.astro';
---
<ColorPicker />
<ColorPicker data-style="soft" class="my-class" />
```
It plays its demo; change `color-picker.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Which contrast rule does it check?**

WCAG 2's ratio, with 4.5:1 for body text. For large text 3:1 is enough, so a Fail here can still be fine for a big heading.

**Does Suggest an accessible shade call a model?**

No. It works it out in the browser: it keeps the hue and saturation and lowers the brightness step by step until white text passes.

**How do I hide the opacity rail?**

Leave out both `alpha` and `onAlphaChange`.

## Source

`ColorPicker.tsx`, as `npx designme add color-picker --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../lib/cx';
import { useReducedMotion } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Spin, Tip } from '../lib/motion';
import '../designme.css';
import './color-picker.css';

type RGB = [number, number, number];
const hsv2rgb = (h: number, s: number, v: number): RGB => { const f = (n: number) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5), f(3), f(1)].map(x => Math.round(x * 255)) as RGB; };
const rgb2hsv = ([r, g, b]: RGB): [number, number, number] => { const [R, G, B] = [r, g, b].map(x => x / 255), mx = Math.max(R, G, B), mn = Math.min(R, G, B), d = mx - mn; let h = 0;
  if (d) h = mx === R ? ((G - B) / d) % 6 : mx === G ? (B - R) / d + 2 : (R - G) / d + 4; return [(h * 60 + 360) % 360, mx ? d / mx : 0, mx]; };
const toHex = (c: RGB) => '#' + c.map(x => x.toString(16).padStart(2, '0')).join('');
/** Reads #rgb or #rrggbb (with or without #), or returns null */
export const parseHex = (t: string): RGB | null => { const m = t.trim().replace(/^#/, '').match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i); if (!m) return null; let s = m[1]; if (s.length === 3) s = [...s].map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16)) as RGB; };
const lum = (c: RGB) => { const [R, G, B] = c.map(x => { x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); }); return .2126 * R + .7152 * G + .0722 * B; };
/** The WCAG 2 contrast ratio of two colours, from 1 to 21 */
export const contrast = (a: RGB, b: RGB) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
/** A 50 to 900 scale from a colour's hue and saturation, with the colour itself at the step nearest its lightness */
export function makeScale(color: string) {
  const c = parseHex(color); if (!c) return [];
  const [h, s] = rgb2hsv(c), L = [97, 93, 85, 74, 62, 50, 41, 33, 25, 18];
  const out = L.map(l => { const sat = Math.min(100, s * 100 * (l > 80 ? .9 : 1)), C = (1 - Math.abs(2 * l / 100 - 1)) * sat / 100, X = C * (1 - Math.abs((h / 60) % 2 - 1)), m = l / 100 - C / 2;
    const [r1, g1, b1] = h < 60 ? [C, X, 0] : h < 120 ? [X, C, 0] : h < 180 ? [0, C, X] : h < 240 ? [0, X, C] : h < 300 ? [X, 0, C] : [C, 0, X];
    return toHex([r1, g1, b1].map(x => Math.round((x + m) * 255)) as RGB); });
  const near = out.reduce((b, x, i) => Math.abs(lum(parseHex(x)!) - lum(c)) < Math.abs(lum(parseHex(out[b])!) - lum(c)) ? i : b, 0);
  out[near] = toHex(c);
  return out.map((hex, i) => ({ step: STEPS[i], hex, base: i === near }));
}

export interface ColorPickerProps {
  /** A hex colour, like "#2f8cff" */
  value?: string;
  defaultValue?: string;
  onValueChange?: (hex: string) => void;
  /** Opacity, 0 to 1. Leave both out to hide the opacity rail */
  alpha?: number;
  onAlphaChange?: (alpha: number) => void;
  swatches?: string[];
  /** The dark text colour the contrast is checked against (#111111) */
  ink?: string;
  /** Called when a scale is made, with its ten steps */
  onScale?: (scale: { step: number; hex: string; base: boolean }[]) => void;
  className?: string;
}

/** A saturation and brightness field, hue and opacity rails, a hex field and swatches, with the colour's contrast against white and ink text in words, and two agent actions: a nearby shade that passes, and a 50 to 900 scale. */
export function ColorPicker({ value, defaultValue = '#3c9e91', onValueChange, alpha, onAlphaChange, swatches = ['#2f8cff', '#7c4dff', '#ff4d6d', '#ff9f1c', '#22c993', '#00a2bf', '#1f2937', '#f5c400'], ink = '#111111', onScale, className }: ColorPickerProps) {
  const [hsv, setHsv] = useState(() => rgb2hsv(parseHex(value ?? defaultValue) ?? [47, 140, 255]));
  const [a, setA] = useState(alpha ?? 1);
  const [text, setText] = useState('');
  const [bad, setBad] = useState(false);
  const [busy, setBusy] = useState<'' | 'fix' | 'scale'>('');
  const [scale, setScale] = useState<{ step: number; hex: string; base: boolean }[]>([]);
  const [said, setSaid] = useState('');
  const reduce = useReducedMotion();
  const editing = useRef(false), before = useRef('');
  const [H, S, V] = hsv, rgb = hsv2rgb(H, S, V), hex = toHex(rgb);
  // a value from outside moves the picker, unless it is the colour already showing
  useEffect(() => { const p = value && parseHex(value); if (p && toHex(p) !== hex) setHsv(rgb2hsv(p)); }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (alpha !== undefined) setA(alpha); }, [alpha]);
  useEffect(() => { if (!editing.current) { setText(hex.slice(1).toUpperCase()); setBad(false); } }, [hex]);
  const set = (h: number, s: number, v: number) => { setHsv([h, s, v]); const n = toHex(hsv2rgb(h, s, v)); if (n !== hex) onValueChange?.(n); };
  const setAlpha = (x: number) => { setA(x); onAlphaChange?.(x); };
  const glide = (to: [number, number, number], ms = 500) => new Promise<void>(res => {
    const [h0, s0, v0] = hsv, dh = ((to[0] - h0 + 540) % 360) - 180, t0 = performance.now();
    const f = (t: number) => { const p = Math.min(1, (t - t0) / (reduce ? 1 : ms)), e = 1 - Math.pow(1 - p, 3); set((h0 + dh * e + 360) % 360, s0 + (to[1] - s0) * e, v0 + (to[2] - v0) * e); if (p < 1) requestAnimationFrame(f); else res(); };
    requestAnimationFrame(f);
  });
  const drag = (apply: (x: number, y: number) => void) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button) return; e.preventDefault(); const el = e.currentTarget; el.setPointerCapture(e.pointerId); el.querySelector<HTMLElement>('.dm-cpk-k')?.focus({ preventScroll: true });
    const mv = (ev: { clientX: number; clientY: number }) => { const b = el.getBoundingClientRect(); apply(Math.max(0, Math.min(1, (ev.clientX - b.left) / b.width)), Math.max(0, Math.min(1, (ev.clientY - b.top) / b.height))); };
    mv(e); el.onpointermove = mv; el.onpointerup = () => { el.onpointermove = null; };
  };
  const cl = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));
  const keys = (fn: (dx: number | 'min' | 'max', dy: number) => void) => (e: React.KeyboardEvent) => {
    const n = e.shiftKey ? 10 : 1, m = ({ ArrowLeft: [-n, 0], ArrowRight: [n, 0], ArrowUp: [0, n], ArrowDown: [0, -n], Home: ['min', 0], End: ['max', 0] } as Record<string, [number | 'min' | 'max', number]>)[e.key];
    if (!m) return; e.preventDefault(); fn(m[0], m[1]);
  };
  const passW = contrast(rgb, [255, 255, 255]) >= 4.5;
  // the agent: the same hue and saturation, darkened until white text passes 4.5:1
  const suggest = async () => {
    let v = V; while (v > 0 && contrast(hsv2rgb(H, S, v), [255, 255, 255]) < 4.6) v -= .005;
    setBusy('fix'); await new Promise(r => setTimeout(r, 500)); await glide([H, S, v], 700); setBusy(''); setSaid(`Moved to ${toHex(hsv2rgb(H, S, v)).toUpperCase()}, white text passes`);
  };
  const make = async () => { setBusy('scale'); setScale([]); await new Promise(r => setTimeout(r, 400)); const sc = makeScale(hex); setScale(sc); setBusy(''); onScale?.(sc); setSaid(`Scale made, ${hex.toUpperCase()} is step ${sc.find(x => x.base)?.step}`); };
  const showAlpha = alpha !== undefined || onAlphaChange !== undefined;
  const style = { '--dm-hc': `hsl(${H} 100% 50%)`, '--dm-c': a < 1 ? `rgb(${rgb.join(' ')} / ${a})` : hex } as CSSProperties;
  return (
    <div data-dm="" className={cx('dm-cpk dm-panel', className)} style={style}>
      <div className="dm-cpk-sv" onPointerDown={drag((x, y) => set(H, x, 1 - y))}>
        <span className="dm-cpk-k" role="slider" tabIndex={0} aria-label="Saturation and brightness" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(S * 100)}
          aria-valuetext={`Saturation ${Math.round(S * 100)}%, brightness ${Math.round(V * 100)}%`} style={{ left: S * 100 + '%', top: (1 - V) * 100 + '%', background: hex }}
          onKeyDown={keys((dx, dy) => dx === 'min' ? set(H, 0, V) : dx === 'max' ? set(H, 1, V) : set(H, cl(S + dx / 100, 0, 1), cl(V + dy / 100, 0, 1)))} />
      </div>
      <div className="dm-cpk-rail dm-cpk-hue" onPointerDown={drag(x => set(x * 359, S, V))}>
        <span className="dm-cpk-k" role="slider" tabIndex={0} aria-label="Hue" aria-valuemin={0} aria-valuemax={359} aria-valuenow={Math.round(H)} aria-valuetext={Math.round(H) + ' degrees'}
          style={{ left: H / 359 * 100 + '%', background: `hsl(${H} 100% 50%)` }} onKeyDown={keys((dx, dy) => set(dx === 'min' ? 0 : dx === 'max' ? 359 : cl(H + (dx || dy), 0, 359), S, V))} />
      </div>
      {showAlpha && <div className="dm-cpk-rail dm-cpk-al" onPointerDown={drag(x => setAlpha(x))}><i />
        <span className="dm-cpk-k" role="slider" tabIndex={0} aria-label="Opacity" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(a * 100)} aria-valuetext={Math.round(a * 100) + '% opaque'}
          style={{ left: a * 100 + '%', background: hex }} onKeyDown={keys((dx, dy) => setAlpha(dx === 'min' ? 0 : dx === 'max' ? 1 : cl(a + (dx || dy) / 100, 0, 1)))} />
      </div>}
      <div className="dm-cpk-row">
        <span className="dm-cpk-pv" aria-hidden="true"><i /></span>
        <label className="dm-cpk-hx" aria-invalid={bad || undefined}><span className="dm-muted">#</span>
          <input className="dm-num" spellCheck={false} autoComplete="off" maxLength={7} aria-label="Hex colour" value={text}
            onFocus={e => { editing.current = true; before.current = text; e.currentTarget.select(); }}
            onChange={e => { setText(e.target.value.replace(/[^0-9a-f#]/gi, '')); setBad(false); }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); const p = parseHex(text); if (p) set(...rgb2hsv(p)); else setBad(true); } if (e.key === 'Escape') { setText(before.current); setBad(false); } }}
            onBlur={() => { editing.current = false; const p = parseHex(text); if (p) set(...rgb2hsv(p)); else { setText(before.current); setBad(false); } }} />
        </label>
        {showAlpha && <span className="dm-cpk-a dm-num dm-muted">{Math.round(a * 100)}%</span>}
      </div>
      <div className="dm-cpk-sw" role="group" aria-label="Swatches">
        {swatches.map(s => <Tip key={s} label={s.toUpperCase()}><button type="button" style={{ ['--dm-s' as string]: s }} aria-label={s} aria-pressed={toHex(parseHex(s) ?? [0, 0, 0]) === hex} onClick={() => { const p = parseHex(s); if (p) void glide(rgb2hsv(p)); }} /></Tip>)}
      </div>
      <div className="dm-cpk-cr" aria-live="polite">
        {[['#ffffff', 'White text'], [ink, 'Ink text']].map(([on, label]) => { const x = contrast(rgb, parseHex(on)!), ok = x >= 4.5;
          return <div key={label} className="dm-cpk-ln"><span className="dm-cpk-aa" style={{ color: on }}>Aa</span><span className="dm-t">{label}</span><span className="dm-num dm-r">{x.toFixed(1)}:1</span><span className={cx('dm-tag', ok ? 'dm-ok' : 'dm-bad')}>{ok ? 'Pass' : 'Fail'}</span></div>; })}
      </div>
      <div className="dm-cpk-act">
        <button type="button" className="dm-pill dm-sm dm-cpk-fix" disabled={passW || !!busy} onClick={suggest}>{busy === 'fix' ? <><Spin />Finding a shade</> : <><Icon name="wand" size="xs" />{passW ? 'White text passes' : 'Suggest an accessible shade'}</>}</button>
        <button type="button" className="dm-pill dm-ghost dm-sm" disabled={!!busy} onClick={make}>{busy === 'scale' ? <><Spin />Making a scale</> : <><Icon name="layers" size="xs" />Make a scale</>}</button>
      </div>
      <div className="dm-cpk-sc" role="group" aria-label="Scale">
        {scale.map((x, i) => <Tip key={x.step} label={`${x.step}: ${x.hex.toUpperCase()}`}><button type="button" className={cx(x.base && 'dm-base', 'dm-enter')} style={{ animationDelay: i * 60 + 'ms' }} aria-label={`${x.step}, ${x.hex.toUpperCase()}`}><i style={{ background: x.hex }} /><span className="dm-num">{x.step}</span></button></Tip>)}
      </div>
      <p className="dm-cpk-sr" aria-live="polite">{said}</p>
    </div>
  );
}
```

## More in Forms and inputs

- [Buttons](https://designme.dev/components/buttons.md): Every button style, with loading, success and hold-to-confirm states.
- [Badge](https://designme.dev/components/badge.md): Small labels for plans, environments and status, with a dot, an icon or a remove button.
- [Progress and meter](https://designme.dev/components/progress.md): An agent run's progress and what it costs, with a credits meter that warns as it fills.
- [Slider](https://designme.dev/components/slider.md): Named stops, a stepped scale and a range, with the agent's recommended value marked on the track.
- [Tooltip](https://designme.dev/components/tooltip.md): Quiet labels on hover, with shortcuts and a richer preview card.
- [Search input](https://designme.dev/components/search-input.md): Search with scoped filters, recent queries and an agent answer.
- [Country select](https://designme.dev/components/country-select.md): A searchable select with country codes, currency and keyboard support.
- [Multi-select](https://designme.dev/components/multi-select.md): A combobox that filters as you type and keeps your picks as chips.
- [Social sign-in](https://designme.dev/components/social-sign-in.md): One-tap providers that remember the last one you used.
- [Sign in](https://designme.dev/components/sign-in.md): Email first, then the one-time code from the email, copied or typed in.
- [OTP field](https://designme.dev/components/otp-field.md): A one-time code, one box per digit, that fills from a paste.
- [Form](https://designme.dev/components/form.md): A project brief with inline checks and an agent that drafts the rest.
- [Payment form](https://designme.dev/components/payment-form.md): Card details with live formatting, brand detection and a clear total.
- [Carousel](https://designme.dev/components/carousel.md): Drafts the agent made to keep one of, or a gallery of pictures, on one swipeable track.

All components: https://designme.dev/llms.txt
