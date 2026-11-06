# Donut chart

> Where the agent's time went, by kind of task.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/donut-chart

## Install

```sh
npx designme add donut-chart          # HTML, CSS and JS, with the shared core
npx designme add donut-chart --react  # React 19 component and its CSS
npx designme add donut-chart --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/donut-chart.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/donut-chart.json  # Astro
```

## About

A ring chart that splits one total into parts, such as the hours an agent spent on each kind of task. The total sits in the middle, and a legend beside the ring lists each part with its value and share. Hovering a slice or its legend row highlights both and puts that part's value in the middle.

### When to use it

- When you want to show where an agent's time, cost or effort went.
- When a total breaks into a handful of categories and their shares matter.
- When a small dashboard card needs both the total and the breakdown.

### What it does

- Draws one arc per entry in `segments`, sized by its share of the total, sweeping in one after another.
- The middle shows the total, counting up, with `label` under it; while a part is highlighted it shows that part's value and label instead.
- Each legend row shows the value with `unit` and its rounded percent of the total.
- Hovering a slice or a row highlights both; `active` and `onActiveChange` let you drive the highlight from outside.
- Colours come from the chart palette in order, or from each segment's `color`, and `format` sets how values read (one decimal by default).

### Accessibility

- The ring's SVG is aria-hidden, so the values are read from the legend rows as text.
- The count-up of the total finishes at once when the user prefers reduced motion.

## Usage in React

```tsx
import { DonutChart } from '@/components/designme/donut-chart/DonutChart';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: where the agent's time went.
import { DonutChart } from './DonutChart';

export default function DonutChartDemo() {
  return (
    <div style={{ width: '100%' }}>
      <DonutChart label="Agent time" unit="h" segments={[
        { label: 'Design reviews', value: 14.2 }, { label: 'Code changes', value: 9.6 }, { label: 'Research', value: 6.1 },
        { label: 'Copy edits', value: 3.4 }, { label: 'Other', value: 1.7, color: 'var(--dm-faint)' }
      ]} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `segments` | `DonutChartSegment[]` |  |
| `label` (optional) | `string` | Under the total in the middle, like "Agent time" |
| `unit` (optional) | `string` | After every value, like "h" in "14.2h" |
| `format` (optional) | `(n: number) => string` | Writes a value. Defaults to one decimal, like 14.2 |
| `active` (optional) | `number \| null` | Index of the highlighted segment, or null. Leave it out to let hovering a segment or its row highlight it |
| `defaultActive` (optional) | `number \| null` |  |
| `onActiveChange` (optional) | `(index: number \| null) => void` |  |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import DonutChart from '../components/designme/donut-chart/DonutChart.astro';
---
<DonutChart />
<DonutChart data-style="soft" class="my-class" />
```
It plays its demo; change `donut-chart.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I grey out an "Other" slice?**

Give that segment its own `color`, like 'var(--dm-faint)'. Segments without a color take the next palette colour.

**Can I highlight a slice from somewhere else on the page?**

Yes. Pass `active` with the segment's index (or null for none) and update it from your own state; `onActiveChange` tells you when hovering changes it.

**How do I show money or percentages instead of hours?**

Pass `format` to write each value and `unit` for the text after it. Both apply to the middle and to every legend row.

## Source

`DonutChart.tsx`, as `npx designme add donut-chart --react` installs it:

```tsx
'use client';
import { useStagger } from '../lib/chart';
import { cx } from '../lib/cx';
import { useControllable, useTween } from '../lib/hooks';
import { enter } from '../lib/motion';
import '../designme.css';
import './donut-chart.css';

export interface DonutChartSegment {
  /** Like "Design reviews" */
  label: string;
  value: number;
  /** Defaults to the chart palette, in order */
  color?: string;
}

export interface DonutChartProps {
  segments: DonutChartSegment[];
  /** Under the total in the middle, like "Agent time" */
  label?: string;
  /** After every value, like "h" in "14.2h" */
  unit?: string;
  /** Writes a value. Defaults to one decimal, like 14.2 */
  format?: (n: number) => string;
  /** Index of the highlighted segment, or null. Leave it out to let hovering a segment or its row highlight it */
  active?: number | null;
  defaultActive?: number | null;
  onActiveChange?: (index: number | null) => void;
  className?: string;
}

const R = 48, C = 2 * Math.PI * R, GAP = 2;

/** A ring of segments that draw in one by one, with a legend; hovering either one highlights both and shows it in the middle. */
export function DonutChart({ segments, label = 'Total', unit = '', format = n => n.toFixed(1), active, defaultActive = null, onActiveChange, className }: DonutChartProps) {
  const [hl, setHl] = useControllable(active, defaultActive, onActiveChange);
  const total = segments.reduce((a, s) => a + s.value, 0);
  // the arcs sweep in one after another, a moment after the ring appears
  const drawn = useStagger(1, segments.length, 90, 100);
  const counted = useTween(total, 1200, 0);
  const color = (i: number) => segments[i].color ?? `var(--dm-c${i % 6 + 1})`;
  const pick = hl != null ? segments[hl] : undefined;
  let off = 0;

  return (
    <div data-dm="" className={cx('dm-dnx dm-panel', className)}>
      <div className={cx('dm-dnx-ring', pick && 'dm-hov')}>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          {segments.map((s, i) => {
            const len = s.value / (total || 1) * C, at = off; off += len;
            return <circle key={i} className={cx(hl === i && 'dm-hl')} cx="60" cy="60" r={R} style={{ stroke: color(i) }} strokeDasharray={`${drawn[i] ? len - GAP : 0} ${C}`} strokeDashoffset={-at}
              onMouseEnter={() => setHl(i)} onMouseLeave={() => setHl(null)} />;
          })}
        </svg>
        <div className="dm-dnx-c">
          <b className="dm-num">{format(pick ? pick.value : counted)}{unit}</b>
          <span className="dm-muted">{pick ? pick.label : label}</span>
        </div>
      </div>
      <div className="dm-dnx-lg">
        {segments.map((s, i) => (
          <div key={i} className={cx('dm-dnx-r dm-enter', hl === i && 'dm-hl')} style={enter(150 + i * 60).style} onMouseEnter={() => setHl(i)} onMouseLeave={() => setHl(null)}>
            <i style={{ background: color(i) }} />
            <span className="dm-t">{s.label}</span>
            <span className="dm-v dm-num">{format(s.value)}{unit} · {Math.round(s.value / (total || 1) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## More in Charts and tables

- [Line chart](https://designme.dev/components/line-chart.md): Two series over time with a hover readout and toggles.
- [Bar chart](https://designme.dev/components/bar-chart.md): Weekly agent runs, split by outcome, with a range switch.
- [Radial goals](https://designme.dev/components/radial-goals.md): Each agent's share of its own target as a ring, with the overall score in the middle.
- [Funnel chart](https://designme.dev/components/funnel-chart.md): Signup to paid, with the biggest drop called out by the agent.
- [Top pages](https://designme.dev/components/top-pages.md): Most visited pages with share of traffic and a quick sort.
- [Health score](https://designme.dev/components/health-score.md): A design system score made of a few checks you can open.
- [Score breakdown](https://designme.dev/components/score-breakdown.md): A score out of 100 whose gauge is split by what goes into it, with the weakest part flagged and a fix to try.
- [Eval radar](https://designme.dev/components/radar-chart.md): This run against the baseline on six eval scores, with the weak ones flagged.
- [Cost vs quality](https://designme.dev/components/scatter-chart.md): Every run as a dot by cost and eval score, sized by tokens, with quadrants and a drag to select.
- [Activity heatmap](https://designme.dev/components/activity-heatmap.md): When the agent and the team were busy, by day and hour.
- [Stat cards](https://designme.dev/components/stat-cards.md): Four headline numbers with sparklines and a period switch.
- [Account table](https://designme.dev/components/account-table.md): Customer accounts with health, plan and an agent note per row.

All components: https://designme.dev/llms.txt
