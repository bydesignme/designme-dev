# Line chart

> Two series over time with a hover readout and toggles.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/line-chart

## Install

```sh
npx designme add line-chart          # HTML, CSS and JS, with the shared core
npx designme add line-chart --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

A line chart that compares a main series with one or more reference series over time, such as this year against last year. A big number above it counts up to the latest value, and a readout follows the pointer to show the value at each point. In an agent product it suits a usage or growth metric on a dashboard.

### When to use it

- When you want to show a metric's trend over time next to the same period before.
- When the latest value matters most and should be the headline.
- When people need to read exact values by hovering, without a full analytics tool.

### What it does

- The first entry in `series` draws as a solid line with a soft fill; the others draw dashed for comparison.
- The lines draw in from the left while the headline number counts up to the last value.
- Moving the pointer shows a guide line, dots on each series and a readout with the value, the point's name from `points`, and, with `compareLabel`, the percent change between the first two series.
- Legend buttons toggle each series on and off; one series always stays on.
- `range` fixes the bottom and top values, `axis` sets the labels along the bottom, and `format` and `unit` control how values read.

### Accessibility

- Each legend button uses aria-pressed to show whether its series is visible.
- The SVG drawing is aria-hidden, so the headline number and legend are what a screen reader gets.
- The count-up of the headline number finishes at once when the user prefers reduced motion.

## Usage in React

```tsx
import { LineChart } from '@/components/designme/line-chart/LineChart';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: active editors this year against last year.
import { LineChart } from './LineChart';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function LineChartDemo() {
  return (
    <div style={{ width: '100%' }}>
      <LineChart label="Active editors" unit="editors" compareLabel="vs last year" points={MONTHS} range={[500, 1700]}
        series={[
          { key: 'now', label: 'This year', values: [820, 860, 910, 980, 1040, 1130, 1210, 1180, 1320, 1460, 1540, 1620] },
          { key: 'before', label: 'Last year', values: [610, 640, 660, 700, 690, 760, 800, 790, 850, 880, 910, 960] }
        ]} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `label` | `string` | The name over the big number, like "Active editors" |
| `series` | `LineChartSeries[]` | The first series is the main one: a solid line with a soft fill. The others are dashed, to compare against |
| `points` | `string[]` | One name per point, shown in the hover readout, like the months |
| `axis` (optional) | `string[]` | Labels spread along the bottom. Defaults to every other point |
| `range` (optional) | `[number, number]` | The values at the bottom and top of the chart. Defaults to the data's range with a little room |
| `unit` (optional) | `string` | What the values count, like "editors" in "1,620 editors" |
| `compareLabel` (optional) | `string` | Ends the readout's comparison of the first two series, like "vs last year" in "+69% vs last year" |
| `format` (optional) | `(n: number) => string` | Writes a value. Defaults to whole numbers like 1,620 |
| `visible` (optional) | `string[]` | Keys of the series shown. Leave it out to let the legend toggle them. One always stays on |
| `defaultVisible` (optional) | `string[]` |  |
| `onVisibleChange` (optional) | `(keys: string[]) => void` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I show "+69% vs last year" in the readout?**

Pass `compareLabel`, like "vs last year". The readout then adds the percent change of the first series against the second at the hovered point, as long as both are visible.

**Can I plot more than two series?**

Yes. `series` takes any number; the first is the solid main line and the rest are dashed. The percent comparison only uses the first two.

**How do I keep the y-axis from starting near the lowest value?**

Pass `range` as [bottom, top]. Without it, the chart uses the data's range with a little room above and below.

**Can I control which series are visible?**

Yes. Pass `visible` with the keys to show and handle `onVisibleChange`, or use `defaultVisible` and let the legend manage it.

## Source

`LineChart.tsx`, as `npx designme add line-chart --react` installs it:

```tsx
'use client';
import { useId, useState, type PointerEvent } from 'react';
import { formatCount } from '../lib/chart';
import { cx } from '../lib/cx';
import { useControllable, useTween } from '../lib/hooks';
import '../designme.css';
import './line-chart.css';

export interface LineChartSeries {
  /** Names the series in `visible` */
  key: string;
  /** The legend's label, like "This year" */
  label: string;
  /** One value per point, oldest first */
  values: number[];
  /** Defaults to the accent for the first series and a quiet grey for the others */
  color?: string;
}

export interface LineChartProps {
  /** The name over the big number, like "Active editors" */
  label: string;
  /** The first series is the main one: a solid line with a soft fill. The others are dashed, to compare against */
  series: LineChartSeries[];
  /** One name per point, shown in the hover readout, like the months */
  points: string[];
  /** Labels spread along the bottom. Defaults to every other point */
  axis?: string[];
  /** The values at the bottom and top of the chart. Defaults to the data's range with a little room */
  range?: [number, number];
  /** What the values count, like "editors" in "1,620 editors" */
  unit?: string;
  /** Ends the readout's comparison of the first two series, like "vs last year" in "+69% vs last year" */
  compareLabel?: string;
  /** Writes a value. Defaults to whole numbers like 1,620 */
  format?: (n: number) => string;
  /** Keys of the series shown. Leave it out to let the legend toggle them. One always stays on */
  visible?: string[];
  defaultVisible?: string[];
  onVisibleChange?: (keys: string[]) => void;
  className?: string;
}

const W = 320, H = 140;
// a smooth line through the points, eased halfway between each pair, as the site draws it
const smooth = (p: [number, number][]) => p.map((q, i) => {
  if (!i) return `M${q[0]} ${q[1]}`;
  const a = p[i - 1], m = (q[0] - a[0]) / 2;
  return `C${a[0] + m} ${a[1]} ${q[0] - m} ${q[1]} ${q[0]} ${q[1]}`;
}).join(' ');

/** Two series over time, drawn in from the left, with a readout that follows the pointer and a legend that toggles them. */
export function LineChart({ label, series, points, axis, range, unit, compareLabel, format = formatCount, visible, defaultVisible, onVisibleChange, className }: LineChartProps) {
  const [on, setOn] = useControllable(visible, defaultVisible ?? series.map(s => s.key), onVisibleChange);
  const shown = series.map(s => on.includes(s.key));
  const n = points.length, last = Math.max(1, n - 1);
  const all = series.flatMap(s => s.values), min = Math.min(...all), max = Math.max(...all);
  const [lo, hi] = range ?? [min - (max - min) * .11, max + (max - min) * .08];
  const y = (d: number) => 136 - (d - lo) / (hi - lo || 1) * 128;
  const paths = series.map(s => s.values.map((d, i): [number, number] => [i / last * W, y(d)]));
  const color = (k: number) => series[k].color ?? (k ? 'var(--dm-faint)' : 'var(--dm-accent)');

  // the lines draw in from the left while the big number counts up
  const clip = useTween(W, 1400, 0);
  const lead = Math.max(0, shown.indexOf(true));
  const counted = useTween(series[lead]?.values[n - 1] ?? 0, 1400, 0);

  const [at, setAt] = useState<{ i: number; w: number; h: number } | null>(null);
  const [inside, setInside] = useState(false);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    setAt({ i: Math.max(0, Math.min(last, Math.round((e.clientX - b.left) / b.width * last))), w: b.width, h: b.height });
    setInside(true);
  };
  const toggle = (k: number) => {
    if (shown[k] && shown.filter(Boolean).length === 1) return;
    setOn(series.filter((_, j) => (j === k ? !shown[k] : shown[j])).map(s => s.key));
  };

  const ids = useId().replace(/[^\w-]/g, '');
  const px = at ? at.i / last * at.w : 0;
  const value = inside && at ? series[lead].values[at.i] : counted;
  const pct = at && series[1] ? Math.round((series[0].values[at.i] / series[1].values[at.i] - 1) * 100) : 0;
  const ticks = axis ?? points.filter((_, i) => i % 2 === 0);

  return (
    <div data-dm="" className={cx('dm-lnx dm-panel', className)}>
      <div className="dm-lnx-h">
        <div><span className="dm-muted">{label}</span><b className="dm-num dm-lnx-v">{format(value)}</b></div>
        <div className="dm-lnx-lg">
          {series.map((s, k) => (
            <button key={s.key} type="button" className={cx('dm-lnx-k', shown[k] && 'dm-on')} aria-pressed={shown[k]} onClick={() => toggle(k)}>
              <i style={{ background: color(k) }} />{s.label}
            </button>
          ))}
        </div>
      </div>
      <div className="dm-lnx-ch" onPointerMove={move} onPointerLeave={() => setInside(false)}>
        <svg className="dm-lnx-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={ids + 'g'} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" style={{ stopColor: color(0), stopOpacity: .16 }} />
              <stop offset="1" style={{ stopColor: color(0), stopOpacity: 0 }} />
            </linearGradient>
            <clipPath id={ids + 'c'}><rect x="0" y="-10" width={clip} height="160" /></clipPath>
          </defs>
          {[35, 70, 105].map(g => <line key={g} className="dm-gl" x1="0" x2={W} y1={g} y2={g} />)}
          <g clipPath={`url(#${ids}c)`}>
            <path className="dm-ar" d={`${smooth(paths[0])} L${W} ${H} L0 ${H} Z`} fill={`url(#${ids}g)`} style={{ opacity: shown[0] ? 1 : 0 }} />
            {/* the main line goes on top */}
            {[...series.keys()].slice(1).reverse().concat(0).map(k => (
              <path key={series[k].key} className={cx('dm-ln', !shown[k] && 'dm-off')} d={smooth(paths[k])} style={{ stroke: color(k) }} strokeDasharray={k ? '4 4' : undefined} />
            ))}
          </g>
        </svg>
        <div className="dm-lnx-x" style={at ? { left: px } : undefined} />
        <div className="dm-lnx-tt" style={at ? { left: Math.max(50, Math.min(px, at.w - 50)) } : undefined}>
          <b className="dm-num">{at && `${format(series[lead].values[at.i])}${unit ? ' ' + unit : ''}`}</b>
          <span>{at && points[at.i] + (compareLabel && shown[0] && shown[1] ? `, ${pct < 0 ? '−' : '+'}${Math.abs(pct)}% ${compareLabel}` : '')}</span>
        </div>
        {series.map((s, k) => (
          <span key={s.key} className={cx('dm-lnx-pt', shown[k] && 'dm-on')} style={{ color: color(k), ...(at && { left: px, top: paths[k][at.i][1] / H * at.h }) }} />
        ))}
      </div>
      <div className="dm-lnx-ax dm-muted dm-num">{ticks.map((t, i) => <span key={i}>{t}</span>)}</div>
    </div>
  );
}
```

## More in Charts and tables

- [Bar chart](https://designme.dev/components/bar-chart.md): Weekly agent runs, split by outcome, with a range switch.
- [Donut chart](https://designme.dev/components/donut-chart.md): Where the agent's time went, by kind of task.
- [Funnel chart](https://designme.dev/components/funnel-chart.md): Signup to paid, with the biggest drop called out by the agent.
- [Top pages](https://designme.dev/components/top-pages.md): Most visited pages with share of traffic and a quick sort.
- [Health score](https://designme.dev/components/health-score.md): A design system score made of a few checks you can open.
- [Activity heatmap](https://designme.dev/components/activity-heatmap.md): When the agent and the team were busy, by day and hour.
- [Stat cards](https://designme.dev/components/stat-cards.md): Four headline numbers with sparklines and a period switch.
- [Account table](https://designme.dev/components/account-table.md): Customer accounts with health, plan and an agent note per row.

All components: https://designme.dev/llms.txt
