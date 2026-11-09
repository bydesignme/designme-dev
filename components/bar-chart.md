# Bar chart

> Weekly agent runs, split by outcome, with a range switch.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/bar-chart

## Install

```sh
npx designme add bar-chart          # HTML, CSS and JS, with the shared core
npx designme add bar-chart --react  # React 19 component and its CSS
npx designme add bar-chart --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/bar-chart.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/bar-chart.json  # Astro
```

## About

A bar chart with a headline total, built for counts that split into parts, such as agent runs that shipped, needed review or failed. Each bar is one block in the accent colour, and hovering it shows its total and the value of each part. A switch moves between ranges like Week and Month, and the bars redraw one after another.

### When to use it

- When you want to show how many agent runs happened and how they turned out.
- When each bar is a total made of a few outcomes or categories, and the breakdown can wait for a hover.
- When the same chart needs a couple of time ranges without a date picker.

### What it does

- Each bar is one block in the accent colour, as tall as the sum of its values in `series` order. Set `stacked` to draw the parts as a stack in the chart palette's colours (or each series' `color`) instead.
- The headline number counts up to the total of every bar in the range on screen.
- Hovering a bar shows its total with `unit`, followed by each part named by its `tipLabel` or lower-cased label.
- With more than one entry in `ranges`, a segmented switch picks the range and the bars regrow left to right.
- With `stacked`, a legend under the chart names each series. `format` controls how numbers read.

### Accessibility

- The range switch is a role="group" labelled "Range", and its buttons use aria-pressed.
- The count-up of the headline total finishes at once when the user prefers reduced motion.

## Usage in React

```tsx
import { BarChart } from '@/components/designme/bar-chart/BarChart';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: agent runs by outcome, by week or by month.
import { BarChart } from './BarChart';

const bars = (labels: string[], values: number[][]) => labels.map((label, i) => ({ label, values: values[i] }));

export default function BarChartDemo() {
  return (
    <div style={{ width: '100%' }}>
      <BarChart label="Agent runs" unit="runs"
        series={[{ label: 'Shipped' }, { label: 'Needed review', tipLabel: 'reviewed' }, { label: 'Failed' }]}
        ranges={[
          { key: 'week', label: 'Week', bars: bars(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], [[42, 9, 2], [51, 12, 3], [48, 8, 1], [63, 10, 4], [57, 14, 2], [18, 3, 0], [12, 2, 1]]) },
          { key: 'month', label: 'Month', bars: bars(['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'], [[180, 40, 9], [210, 44, 12], [236, 51, 8], [262, 48, 10], [251, 39, 6], [298, 52, 7], [321, 47, 5]]) }
        ]} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `label` | `string` | The name over the big number, like "Agent runs" |
| `series` | `BarChartSeries[]` | What each part of a bar means, in order. The hover readout breaks each bar down by these |
| `stacked` (optional) | `boolean` | Draws each bar as a stack of its parts in the palette's colours, with a legend. Off by default: one bar in the accent, with the breakdown in the hover readout |
| `ranges` | `BarChartRange[]` | One set of bars per range. With more than one, a switch picks between them |
| `range` (optional) | `string` | Key of the range shown. Leave it out to let the switch change it |
| `defaultRange` (optional) | `string` | Defaults to the first range |
| `onRangeChange` (optional) | `(key: string) => void` |  |
| `unit` (optional) | `string` | What the values count, like "runs" in "66 runs" |
| `format` (optional) | `(n: number) => string` | Writes a value. Defaults to whole numbers like 1,240 |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import BarChart from '../components/designme/bar-chart/BarChart.astro';
---
<BarChart />
<BarChart data-style="soft" class="my-class" />
```
It plays its demo; change `bar-chart.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I change the wording in the hover readout?**

Set `tipLabel` on a series, like "reviewed" for "Needed review". Without it, the readout uses the series label in lower case, and `unit` follows the bar's total.

**Can I show the parts as a stack?**

Yes. Set `stacked` and each bar becomes a stack of its parts, coloured from the chart palette or each series' `color`, with a legend under the chart. Without it the chart stays one colour and the hover readout carries the breakdown.

**How do I hide the range switch?**

Pass a single entry in `ranges`. The switch only appears when there is more than one.

**Do the ranges need the same number of bars?**

No. The chart makes room for the longest range, and bars a range does not have stay empty.

## Source

`BarChart.tsx`, as `npx designme add bar-chart --react` installs it:

```tsx
'use client';
import { useRef, useState } from 'react';
import { formatCount, useStagger } from '../lib/chart';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useTween } from '../lib/hooks';
import { Seg } from '../lib/motion';
import '../designme.css';
import './bar-chart.css';

export interface BarChartSeries {
  /** Names the part in the hover readout and, when stacked, in the legend, like "Needed review" */
  label: string;
  /** How the hover readout names it, like "reviewed". Defaults to the label in lower case */
  tipLabel?: string;
  /** When stacked. Defaults to the chart palette: blue, purple, then orange */
  color?: string;
}

export interface BarChartBar {
  /** Under the bar, like "Mon" */
  label: string;
  /** One value per series, stacked from the bottom */
  values: number[];
}

export interface BarChartRange {
  key: string;
  /** On the switch, like "Week" */
  label: string;
  bars: BarChartBar[];
}

export interface BarChartProps {
  /** The name over the big number, like "Agent runs" */
  label: string;
  /** What each part of a bar means, in order. The hover readout breaks each bar down by these */
  series: BarChartSeries[];
  /** Draws each bar as a stack of its parts in the palette's colours, with a legend. Off by default: one bar in the
      accent, with the breakdown in the hover readout */
  stacked?: boolean;
  /** One set of bars per range. With more than one, a switch picks between them */
  ranges: BarChartRange[];
  /** Key of the range shown. Leave it out to let the switch change it */
  range?: string;
  /** Defaults to the first range */
  defaultRange?: string;
  onRangeChange?: (key: string) => void;
  /** What the values count, like "runs" in "66 runs" */
  unit?: string;
  /** Writes a value. Defaults to whole numbers like 1,240 */
  format?: (n: number) => string;
  className?: string;
}

// the colours of a stack's parts, in order
const PALETTE = ['var(--dm-c1)', 'var(--dm-c2)', 'var(--dm-c4)', 'var(--dm-c3)', 'var(--dm-c5)', 'var(--dm-c6)'];

/** Bars that grow in one after another, with a readout on hover that breaks each one down, and a switch between ranges. */
export function BarChart({ label, series, ranges, range, defaultRange, onRangeChange, unit, format = formatCount, stacked = false, className }: BarChartProps) {
  const [cur, setCur] = useControllable(range, defaultRange ?? ranges[0]?.key ?? '', onRangeChange);
  const count = Math.max(0, ...ranges.map(r => r.bars.length));
  // the bars draw a moment after the chart appears, then redraw left to right on every switch
  const at = useStagger(cur, count, 45, 200);
  const byKey = (k: string | null) => ranges.find(r => r.key === k);
  const shown = byKey(at[0]);
  const sum = (b?: BarChartBar) => b ? b.values.reduce((a, v) => a + v, 0) : 0;
  const total = useTween(shown ? shown.bars.reduce((a, b) => a + sum(b), 0) : 0, 900, 0);

  // the room the bars have, less the label under them
  const ch = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState(128);
  useIsoLayoutEffect(() => { if (ch.current) setRoom(ch.current.clientHeight - 22); }, []);
  const color = (j: number) => series[j]?.color ?? PALETTE[j % PALETTE.length];

  return (
    <div data-dm="" className={cx('dm-bcx dm-panel', className)}>
      <div className="dm-bcx-h">
        <div><span className="dm-muted">{label}</span><b className="dm-num dm-bcx-v">{format(total)}</b></div>
        {ranges.length > 1 && (
          <Seg className="dm-bcx-rg" label="Range" value={cur} onChange={setCur} options={ranges.map(r => ({ value: r.key, label: r.label }))} />
        )}
      </div>
      <div className="dm-bcx-ch" ref={ch}>
        {Array.from({ length: count }, (_, i) => {
          const r = byKey(at[i]), bar = r?.bars[i], top = r ? Math.max(...r.bars.map(sum)) * 1.08 : 1;
          const tip = shown?.bars[i];
          return (
            <div key={i} className="dm-bcx-b">
              <div className="dm-bcx-tt">
                <b className="dm-num">{tip && `${format(sum(tip))}${unit ? ' ' + unit : ''}`}</b>
                <span>{tip && tip.values.map((v, j) => `${format(v)} ${series[j]?.tipLabel ?? series[j]?.label.toLowerCase() ?? ''}`).join(', ')}</span>
              </div>
              <div className="dm-bcx-st">
                {stacked ? series.map((_, j) => {
                  const v = bar?.values[j] ?? 0;
                  return <i key={j} style={{ height: bar ? Math.max(v ? 3 : 0, v / top * room) : 0, background: color(j) }} />;
                }) : <i style={{ height: bar ? Math.max(sum(bar) ? 3 : 0, sum(bar) / top * room) : 0 }} />}
              </div>
              <div className="dm-bcx-l">{tip?.label}</div>
            </div>
          );
        })}
      </div>
      {stacked && <div className="dm-bcx-lg dm-muted">{series.map((s, j) => <span key={j}><i style={{ background: color(j) }} />{s.label}</span>)}</div>}
    </div>
  );
}
```

## More in Charts and tables

- [Line chart](https://designme.dev/components/line-chart.md): Two series over time with a hover readout and toggles.
- [Donut chart](https://designme.dev/components/donut-chart.md): Where the agent's time went, by kind of task.
- [Radial goals](https://designme.dev/components/radial-goals.md): Each agent's share of its own target as a ring, with the overall score in the middle.
- [Funnel chart](https://designme.dev/components/funnel-chart.md): Signup to paid, with the biggest drop called out by the agent.
- [Top pages](https://designme.dev/components/top-pages.md): Most visited pages with share of traffic and a quick sort.
- [Health score](https://designme.dev/components/health-score.md): An account's health: a score ring, four factors that open, and the agent's next move.
- [Score breakdown](https://designme.dev/components/score-breakdown.md): A score out of 100 whose gauge is split by what goes into it, with the weakest part flagged and a fix to try.
- [Eval radar](https://designme.dev/components/radar-chart.md): This run against the baseline on six eval scores, with the weak ones flagged.
- [Cost vs quality](https://designme.dev/components/scatter-chart.md): Every run as a dot by cost and eval score, sized by tokens, with quadrants and a drag to select.
- [Activity heatmap](https://designme.dev/components/activity-heatmap.md): When the agent and the team were busy, by day and hour.
- [Stat cards](https://designme.dev/components/stat-cards.md): Four headline numbers with sparklines and a period switch.
- [Account table](https://designme.dev/components/account-table.md): Customer accounts with health, plan and an agent note per row.

All components: https://designme.dev/llms.txt
