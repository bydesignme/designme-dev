# Stat cards

> Four headline numbers with sparklines and a period switch.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/stat-cards

## Install

```sh
npx designme add stat-cards          # HTML, CSS and JS, with the shared core
npx designme add stat-cards --react  # React 19 component and its CSS
npx designme add stat-cards --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/stat-cards.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/stat-cards.json  # Astro
```

## About

A row of headline numbers, each on its own card with an icon, its change against the period before and a sparkline. A period switch, such as 7 days, 30 days and Quarter, rolls every number and line to the new values at once. It works as the top row of an agent dashboard, for numbers like runs, hours saved and spend.

### When to use it

- At the top of a dashboard, to show the few numbers people check first.
- When you want to show an agent's runs, time saved or cost at a glance.
- When the same numbers need comparing across a few fixed periods.

### What it does

- Each card shows an icon, a label, a large number that rolls to its value, and a change percentage, green from 0 and red below.
- A sparkline per card draws in from the left, in the card's `color`, or the chart palette in order: the accent, then violet, green and orange.
- Each stat has one entry in `values` per entry in `periods`, and switching the period updates every card together.
- Hovering a card shows the period's `compare` text, like "vs previous 30 days".
- `prefix` and `suffix` wrap the number, like "$" or "h".
- `sparkRange` puts every sparkline on the same scale; by default each card scales to its own lowest and highest point.
- The change against the previous period sits in a tinted chip: green with dark text when it rises, red when it falls.
- Four across on a wide screen, and two by two on tablets and phones.

### Accessibility

- The period switch is a role="group" labelled "Period", with aria-pressed on the active option.
- Sparklines are aria-hidden SVGs.
- The sparkline draw-in is skipped, and number roll-ups finish at once, when the user prefers reduced motion.

## Usage in React

```tsx
import { StatCards } from '@/components/designme/stat-cards/StatCards';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: the numbers roll up and the switch changes the period.
import { StatCards, type StatCardsPeriod, type StatCardsStat } from './StatCards';

const PERIODS: StatCardsPeriod[] = [
  { label: '7 days', compare: 'vs previous 7 days' },
  { label: '30 days', compare: 'vs previous 30 days' },
  { label: 'Quarter', compare: 'vs last quarter' }
];

// each card has one shape that wobbles a little differently per period, like real weeks do
const wobble = (base: number[], p: number) => base.map((y, k) => y + Math.sin(k * 1.7 + p * 2) * (p ? 1 : .5));
const stat = (icon: StatCardsStat['icon'], label: string, nums: [number, number][], base: number[], extra: Partial<StatCardsStat> = {}): StatCardsStat =>
  ({ icon, label, values: nums.map(([value, change], p) => ({ value, change, points: wobble(base, p) })), ...extra });

const STATS: StatCardsStat[] = [
  stat('spark', 'Agent runs', [[412, 12], [1730, 18], [4980, 22]], [3, 4, 4, 5, 6, 5, 7, 8]),
  stat('users', 'Active editors', [[318, 4], [1130, 9], [1620, 31]], [5, 5, 6, 6, 6, 7, 7, 8]),
  stat('clock', 'Hours saved', [[96, 15], [402, 21], [1180, 26]], [2, 3, 3, 4, 5, 6, 6, 8], { suffix: 'h' }),
  stat('coins', 'Agent spend', [[84, -6], [341, -3], [960, 8]], [6, 5, 6, 5, 4, 4, 4, 3], { prefix: '$' })
];

export default function StatCardsDemo() {
  return <div style={{ width: '100%' }}><StatCards stats={STATS} periods={PERIODS} defaultPeriod={1} sparkRange={[0, 8.75]} /></div>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `stats` | `StatCardsStat[]` |  |
| `periods` | `StatCardsPeriod[]` |  |
| `period` (optional) | `number` | The period on show, by index. Leave it out to let the switch pick it |
| `defaultPeriod` (optional) | `number` |  |
| `onPeriodChange` (optional) | `(period: number) => void` |  |
| `sparkRange` (optional) | `[number, number]` | The values at the bottom and top of every sparkline. Defaults to each card's own lowest and highest point |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import StatCards from '../components/designme/stat-cards/StatCards.astro';
---
<StatCards />
<StatCards data-style="soft" class="my-class" />
```
It plays its demo; change `stat-cards.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Can a number show decimals?**

No. The large number is rounded to a whole number and written with thousands separators, like 1,730. Pass a smaller unit, or put the unit in `suffix`, if you need finer detail.

**How do I compare sparklines across cards?**

Pass `sparkRange` as [bottom, top]. Every card then uses the same scale, so a taller line means a bigger value on every card.

**How do I hide the period switch?**

Pass a single entry in `periods`, with one value per stat. The switch only shows with two or more periods.

## Source

`StatCards.tsx`, as `npx designme add stat-cards --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useTween } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { enter, Seg, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './stat-cards.css';

export interface StatCardsValue {
  /** The number in large type, which rolls to it */
  value: number;
  /** Change against the period before, in percent. Green from 0, red below */
  change: number;
  /** The sparkline, oldest first */
  points: number[];
}

export interface StatCardsStat {
  /** Identifies the card. Defaults to its label */
  key?: string;
  icon: IconName;
  /** Like "Agent runs" */
  label: string;
  /** One entry per period, in the same order as `periods` */
  values: StatCardsValue[];
  /** Before the number, like "$" */
  prefix?: string;
  /** After the number, like "h" */
  suffix?: string;
  /** The sparkline's colour, any CSS colour. Defaults to the chart palette: the accent for the first card, then violet, green and orange */
  color?: string;
}

export interface StatCardsPeriod {
  /** The switch label, like "30 days" */
  label: string;
  /** Shown when you hover a card, like "vs previous 30 days" */
  compare?: string;
}

export interface StatCardsProps {
  stats: StatCardsStat[];
  periods: StatCardsPeriod[];
  /** The period on show, by index. Leave it out to let the switch pick it */
  period?: number;
  defaultPeriod?: number;
  onPeriodChange?: (period: number) => void;
  /** The values at the bottom and top of every sparkline. Defaults to each card's own lowest and highest point */
  sparkRange?: [number, number];
  className?: string;
}

const FLAT = 'M0 30 L100 30';

function Card({ stat, index, period, compare, drawn, range }: { stat: StatCardsStat; index: number; period: number; compare?: string; drawn: boolean; range?: [number, number] }) {
  const v = stat.values[Math.min(period, stat.values.length - 1)];
  const shown = useTween(drawn ? v.value : 0, 900, 0);
  const all = stat.values.flatMap(x => x.points);
  const [lo, hi] = range ?? [Math.min(...all), Math.max(...all)];
  const d = v.points.map((y, k) => `${k === 0 ? 'M' : 'L'}${(k / Math.max(1, v.points.length - 1) * 100).toFixed(1)} ${(29 - (y - lo) / (hi - lo || 1) * 28).toFixed(1)}`).join(' ');
  const { className: entering, style } = enter(index * 70);
  // the sparkline draws in from the left as its card arrives
  const spark = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = spark.current; if (!el || !el.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const a = el.animate([{ clipPath: 'inset(-4px 100% -4px 0)' }, { clipPath: 'inset(-4px 0% -4px 0)' }], { duration: 1000, delay: 300 + index * 70, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'backwards' });
    return () => a.cancel();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const card = (
    <div className={cx('dm-scx-c dm-panel', entering)} style={style}>
      <span className="dm-scx-k"><span className="dm-ic"><Icon name={stat.icon} size="xs" /></span>{stat.label}</span>
      <div className="dm-scx-v">
        <b className="dm-num">{(stat.prefix ?? '') + Math.round(shown).toLocaleString('en-US') + (stat.suffix ?? '')}</b>
        <Swap className={cx('dm-scx-d dm-num', drawn && (v.change >= 0 ? 'dm-tag dm-ok dm-up' : 'dm-tag dm-bad dm-dn'))}>{drawn ? (v.change >= 0 ? '+' : '') + v.change + '%' : ''}</Swap>
      </div>
      <div className="dm-scx-sp">
        <svg ref={spark} viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path stroke={stat.color ?? `var(--dm-c${index % 6 + 1})`} d={drawn ? d : FLAT} /></svg>
      </div>
    </div>
  );
  return <Tip label={compare ?? ''} off={!compare}>{card}</Tip>;
}

/** A row of numbers with their change and a sparkline. Switch the period and they roll to the new values. */
export function StatCards({ stats, periods, period, defaultPeriod = 0, onPeriodChange, sparkRange, className }: StatCardsProps) {
  const [at, setAt] = useControllable(period, defaultPeriod, onPeriodChange);
  // the numbers roll up and the lines draw a moment after the cards come in
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 200); return () => clearTimeout(t); }, []);

  return (
    <div data-dm="" className={cx('dm-scx', className)}>
      {periods.length > 1 && (
        <div className="dm-scx-h">
          <Seg className="dm-scx-sg" label="Period" value={String(at)} onChange={v => setAt(+v)} options={periods.map((p, i) => ({ value: String(i), label: p.label }))} />
        </div>
      )}
      <div className="dm-scx-grid">
        {stats.map((s, i) => <Card key={s.key ?? s.label} stat={s} index={i} period={at} compare={periods[at]?.compare} drawn={drawn} range={sparkRange} />)}
      </div>
    </div>
  );
}
```

## More in Charts and tables

- [Line chart](https://designme.dev/components/line-chart.md): Two series over time with a hover readout and toggles.
- [Bar chart](https://designme.dev/components/bar-chart.md): Weekly agent runs, split by outcome, with a range switch.
- [Donut chart](https://designme.dev/components/donut-chart.md): Where the agent's time went, by kind of task.
- [Radial goals](https://designme.dev/components/radial-goals.md): Each agent's share of its own target as a ring, with the overall score in the middle.
- [Funnel chart](https://designme.dev/components/funnel-chart.md): Signup to paid, with the biggest drop called out by the agent.
- [Top pages](https://designme.dev/components/top-pages.md): Most visited pages with share of traffic and a quick sort.
- [Health score](https://designme.dev/components/health-score.md): An account's health: a score ring, four factors that open, and the agent's next move.
- [Score breakdown](https://designme.dev/components/score-breakdown.md): A score out of 100 whose gauge is split by what goes into it, with the weakest part flagged and a fix to try.
- [Eval radar](https://designme.dev/components/radar-chart.md): This run against the baseline on six eval scores, with the weak ones flagged.
- [Cost vs quality](https://designme.dev/components/scatter-chart.md): Every run as a dot by cost and eval score, sized by tokens, with quadrants and a drag to select.
- [Activity heatmap](https://designme.dev/components/activity-heatmap.md): When the agent and the team were busy, by day and hour.
- [Account table](https://designme.dev/components/account-table.md): Customer accounts with health, plan and an agent note per row.

All components: https://designme.dev/llms.txt
