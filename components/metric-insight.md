# Metric insight

> A number, its trend, and the agent's read on why it moved.

Agent components / Sources and output. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/metric-insight

## Install

```sh
npx designme add metric-insight          # HTML, CSS and JS, with the shared core
npx designme add metric-insight --react  # React 19 component and its CSS
npx designme add metric-insight --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/metric-insight.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/metric-insight.json  # Astro
```

## About

Metric insight shows one number, such as a conversion rate, with its trend line, its change over the chosen range and a one-line note from the agent on what happened. A "Why did it move?" button opens a breakdown of the drivers behind the change.

### When to use it

- When a dashboard should explain a number as well as show it.
- When the agent has found a likely cause, like a release, and you want it marked on the chart.
- When people switch between 7, 30 and 90 day views and expect the story to change with the range.
- When the agent needs a moment to work out the drivers after someone asks.

### What it does

- Each entry in `ranges` has its own `points`, `value`, `change` and `insight`, and a switch picks between them.
- The large number and the change tag roll to their new values. The tag turns red when the change is negative.
- Hovering the chart shows a guide line and a dot on the nearest point, and the large number shows that point's value.
- A range can carry a `marker`, such as a release, placed across the chart with its label in a tooltip.
- With `drivers`, a button opens a list of what moved the number, each with a coloured bar and its share in percent.
- Set `explaining` while you fetch the drivers. The button says "Looking into it" and the breakdown stays shut. `format` and `formatChange` control how numbers read.

### Accessibility

- The range switch is a group labelled "Range" whose buttons use `aria-pressed`.
- The breakdown button has `aria-expanded`, and the closed breakdown is `inert` and `aria-hidden`.
- The chart SVG is `aria-hidden`, so the number, change and insight text carry the meaning.
- With reduced motion turned on, the number and change jump straight to their values.

## Usage in React

```tsx
import { MetricInsight } from '@/components/designme/metric-insight/MetricInsight';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: switch the range, hover the line, ask why it moved.
import { useEffect, useRef, useState } from 'react';
import { MetricInsight, type MetricDriver, type MetricRange } from './MetricInsight';

const RANGES: MetricRange[] = [
  { key: '7', label: '7d', points: [22.8, 23.1, 22.9, 24.6, 25.4, 25.9, 26.3], value: 26.3, change: 3.5, insight: 'Up all week. Most of the gain came from annual plans.' },
  { key: '30', label: '30d', points: [18.2, 18.5, 18.1, 18.9, 18.4, 18.7, 19.0, 18.6, 19.2, 19.1, 18.8, 19.4, 19.0, 19.3, 19.1, 19.6, 19.2, 21.8, 22.9, 23.4, 23.1, 24.0, 23.6, 24.4, 24.1, 24.9, 25.2, 25.6, 25.9, 26.3],
    value: 26.3, change: 8.1, insight: 'Jumped after the pricing page update on Sep 18.', marker: { at: .58, label: 'Pricing page update shipped' } },
  { key: '90', label: '90d', points: [17.1, 17.6, 17.4, 18.0, 17.8, 18.3, 18.1, 18.6, 18.2, 18.9, 19.4, 22.1, 24.0, 25.5, 26.3], value: 26.3, change: 9.2, insight: 'Flat for two months, then a clear step up in September.' }
];
const DRIVERS: MetricDriver[] = [
  { label: 'Annual plan shown first', percent: 54, color: 'var(--dm-accent)' }, { label: 'One CTA per card', percent: 27, color: 'var(--dm-pl)' },
  { label: 'Seasonal traffic', percent: 12, color: 'var(--dm-pt)' }, { label: 'Unexplained', percent: 7, color: 'var(--dm-faint)' }
];

export default function MetricInsightDemo() {
  const [open, setOpen] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  // asking takes a moment, the way an agent would look into it
  const toggle = (next: boolean) => {
    if (!next) { setOpen(false); return; }
    setExplaining(true);
    timer.current = setTimeout(() => { setExplaining(false); setOpen(true); }, 900);
  };
  return (
    <div style={{ width: '100%' }}>
      <MetricInsight label="Trial to paid" ranges={RANGES} defaultRange="30" drivers={DRIVERS} explaining={explaining} open={open} onOpenChange={toggle} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `label` | `string` | The metric's name, like "Trial to paid" |
| `ranges` | `MetricRange[]` |  |
| `range` (optional) | `string` | The range on show, by key. Leave it out to let the switch pick it |
| `defaultRange` (optional) | `string` |  |
| `onRangeChange` (optional) | `(key: string) => void` |  |
| `format` (optional) | `(value: number) => string` | Formats the large number and the hovered point. Defaults to one decimal and a % |
| `formatChange` (optional) | `(change: number) => string` | Formats the change. Defaults to "+8.1 pts" |
| `drivers` (optional) | `MetricDriver[]` | What moved the number, shown under "Why did it move?" |
| `explaining` (optional) | `boolean` | Shows "Looking into it" on the button and keeps the breakdown shut, while you fetch the drivers |
| `open` (optional) | `boolean` | Whether the breakdown is open. Leave it out to let the button toggle it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import MetricInsight from '../components/designme/metric-insight/MetricInsight.astro';
---
<MetricInsight />
<MetricInsight data-style="soft" class="my-class" />
```
It plays its demo; change `metric-insight.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Can I show something other than a percentage?**

Yes. Pass `format` for the large number and hovered points, and `formatChange` for the tag. The defaults are one decimal with a % and a change like "+8.1 pts".

**How do I fetch the drivers only when someone asks?**

Control `open` and handle `onOpenChange`. When it asks to open, set `explaining` to true, load the drivers, then set `explaining` to false and `open` to true. The demo does this.

**How do I mark a release on the chart?**

Add `marker: { at, label }` to a range. `at` is a position from 0 to 1 across the chart, and `label` shows when the marker is hovered.

## Source

`MetricInsight.tsx`, as `npx designme add metric-insight --react` installs it:

```tsx
'use client';
import { useRef, useState, type PointerEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useTween } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Fold, Seg, Swap, Think, Tip } from '../lib/motion';
import '../designme.css';
import './metric-insight.css';

export interface MetricRange {
  /** Identifies the range, like '30' */
  key: string;
  /** The switch label, like "30d" */
  label: string;
  /** The values over the range, oldest first */
  points: number[];
  /** The number in large type, which rolls to it */
  value: number;
  /** The change over the range, in the tag beside it */
  change: number;
  /** One line on what happened, like "Jumped after the pricing page update on Sep 18." */
  insight: string;
  /** A marker on the chart, like a release: `at` is 0 to 1 across, `label` shows on hover */
  marker?: { at: number; label: string };
}

export interface MetricDriver {
  label: string;
  /** Its share of the change, 0 to 100 */
  percent: number;
  /** Any CSS colour, like 'var(--dm-accent)'. Defaults to the accent */
  color?: string;
}

export interface MetricInsightProps {
  /** The metric's name, like "Trial to paid" */
  label: string;
  ranges: MetricRange[];
  /** The range on show, by key. Leave it out to let the switch pick it */
  range?: string;
  defaultRange?: string;
  onRangeChange?: (key: string) => void;
  /** Formats the large number and the hovered point. Defaults to one decimal and a % */
  format?: (value: number) => string;
  /** Formats the change. Defaults to "+8.1 pts" */
  formatChange?: (change: number) => string;
  /** What moved the number, shown under "Why did it move?" */
  drivers?: MetricDriver[];
  /** Shows "Looking into it" on the button and keeps the breakdown shut, while you fetch the drivers */
  explaining?: boolean;
  /** Whether the breakdown is open. Leave it out to let the button toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const pct = (v: number) => v.toFixed(1) + '%';
const pts = (v: number) => (v < 0 ? '−' : '+') + Math.abs(v).toFixed(1) + ' pts';
const W = 300, H = 90;

/** A metric with its trend, a one-line explanation, and a breakdown of what moved it. */
export function MetricInsight({ label, ranges, range, defaultRange, onRangeChange, format = pct, formatChange = pts, drivers, explaining = false, open, defaultOpen = false, onOpenChange, className }: MetricInsightProps) {
  const [key, setKey] = useControllable(range, defaultRange ?? ranges[0]?.key ?? '', onRangeChange);
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const r = ranges.find(x => x.key === key) ?? ranges[0];
  const value = useTween(r?.value ?? 0, 900, 0), change = useTween(r?.change ?? 0, 900, 0);
  const [hover, setHover] = useState<{ x: number; y: number; px: number; py: number; v: number } | null>(null);

  // the chart, scaled to 300 by 90 with a point of room above and below
  const d = r?.points ?? [];
  const lo = Math.min(...d) - 1, hi = Math.max(...d) + 1;
  const xy = d.map((v, i) => [d.length > 1 ? i / (d.length - 1) * W : 0, 86 - (v - lo) / (hi - lo) * 80, v] as const);
  const path = xy.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ');

  // the area and the marker fade in once the metric appears; a range change redraws the line in place
  const chart = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const el = chart.current; if (!el) return;
    void el.offsetWidth;
    const id = requestAnimationFrame(() => el.classList.add('dm-in'));
    return () => cancelAnimationFrame(id);
  }, []);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!xy.length) return;
    const b = e.currentTarget.getBoundingClientRect(), fx = (e.clientX - b.left) / b.width * W;
    let best = xy[0]; xy.forEach(q => { if (Math.abs(q[0] - fx) < Math.abs(best[0] - fx)) best = q; });
    setHover({ x: best[0], y: best[1], px: best[0] / W * b.width, py: best[1] / H * b.height, v: best[2] });
  };

  // the button changes at once when it starts looking, then crossfades to its next label
  const [looks, setLooks] = useState(0);
  const [wasBusy, setWasBusy] = useState(explaining);
  if (explaining !== wasBusy) { setWasBusy(explaining); if (explaining) setLooks(n => n + 1); }
  const shown = isOpen && !explaining && !!drivers?.length;
  const [opened, setOpened] = useState(0);
  const [wasShown, setWasShown] = useState(shown);
  if (shown !== wasShown) { setWasShown(shown); if (shown) setOpened(n => n + 1); }

  return (
    <div data-dm="" className={cx('dm-mix dm-panel', className)}>
      <div className="dm-mix-h">
        <span className="dm-muted">{label}</span>
        <Seg className="dm-mix-rg" label="Range" value={key} onChange={setKey} options={ranges.map(x => ({ value: x.key, label: x.label }))} />
      </div>
      <div className="dm-mix-v">
        <b className="dm-num dm-mix-n">{format(hover ? hover.v : value)}</b>
        <span className={cx('dm-tag dm-mix-d dm-num', (r?.change ?? 0) < 0 ? 'dm-bad' : 'dm-ok')}>{formatChange(change)}</span>
      </div>
      <div className="dm-mix-ch" ref={chart} onPointerMove={move} onPointerLeave={() => setHover(null)}>
        <svg className="dm-mix-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="dm-mixg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--dm-accent)" stopOpacity=".18" /><stop offset="1" stopColor="var(--dm-accent)" stopOpacity="0" /></linearGradient></defs>
          <path className="dm-mix-a" fill="url(#dm-mixg)" d={path && path + ` L${W} ${H} L0 ${H} Z`} />
          <path className="dm-mix-l" fill="none" stroke="var(--dm-accent)" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" d={path} />
          <line className="dm-mix-x" x1={hover?.x ?? 0} x2={hover?.x ?? 0} y1={0} y2={H} stroke="var(--dm-faint)" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="dm-mix-dot" style={hover ? { left: hover.px, top: hover.py } : undefined} />
        {r?.marker && <Marker key={r.key} at={r.marker.at} label={r.marker.label} />}
      </div>
      <div className="dm-mix-ins"><span className="dm-mix-ic"><Icon name="spark" size="xs" /></span><Swap className="dm-mix-t">{r?.insight ?? ''}</Swap></div>
      {drivers && (
        <button type="button" className="dm-pill dm-soft dm-sm dm-mix-why" aria-expanded={shown} onClick={() => { if (!explaining) setOpen(!isOpen); }}>
          {explaining && <Think />}
          <Swap key={looks}>{explaining ? 'Looking into it' : shown ? 'Hide the breakdown' : 'Why did it move?'}</Swap>
        </button>
      )}
      {drivers && (
        <Fold open={shown} className="dm-mix-box">
          <div className="dm-mix-rs" key={opened}>
            {drivers.map((q, i) => {
              const e = enter(i * 60), c = q.color ?? 'var(--dm-accent)';
              return (
                <div key={q.label + i} className={cx('dm-mix-r', e.className)} style={e.style}>
                  <span className="dm-dot" style={{ color: c }} />
                  <span className="dm-t">{q.label}</span>
                  <span className="dm-bar"><i style={{ width: q.percent + '%', background: c }} /></span>
                  <span className="dm-v dm-num">{q.percent}%</span>
                </div>
              );
            })}
          </div>
        </Fold>
      )}
    </div>
  );
}

/** The marker on the chart. It fades in late, after the line, each time a range that has one comes up */
function Marker({ at, label }: { at: number; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // it renders hidden, then lets the stylesheet take over a frame later, so the delayed fade-in runs
  useIsoLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    void el.offsetWidth;
    const id = requestAnimationFrame(() => { el.style.opacity = ''; el.style.transform = ''; });
    return () => cancelAnimationFrame(id);
  }, []);
  return <Tip label={label}><span ref={ref} className="dm-mix-mk" style={{ left: at * 100 + '%', opacity: 0, transform: 'scale(.5)' }}><Icon name="spark" size="xs" /></span></Tip>;
}
```

## More in Sources and output

- [Code viewer](https://designme.dev/components/code-viewer.md): Code the agent wrote, with line notes you can ask about.
- [Terminal stream](https://designme.dev/components/terminal-stream.md): Shell commands the agent runs, with their output as it streams in.
- [Citation hover card](https://designme.dev/components/citation-hover-card.md): Hover a citation to see the exact passage it came from.
- [Source stack](https://designme.dev/components/source-stack.md): Everything the agent read, folded into one quiet pill.
- [Field extraction](https://designme.dev/components/field-extraction.md): The agent pulls fields out of a document and shows where each came from.
- [Details panel](https://designme.dev/components/details-panel.md): Properties of a run you can change in place.
- [Task table](https://designme.dev/components/task-table.md): Agent tasks in a sortable table with bulk actions.

All components: https://designme.dev/llms.txt
