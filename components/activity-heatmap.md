# Activity heatmap

> When the agent and the team were busy, by day and hour.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/activity-heatmap

## Install

```sh
npx designme add activity-heatmap          # HTML, CSS and JS, with the shared core
npx designme add activity-heatmap --react  # React 19 component and its CSS
npx designme add activity-heatmap --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/activity-heatmap.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/activity-heatmap.json  # Astro
```

## About

A grid of 7 days by 24 hours where darker cells mean busier hours, so people can see when the agent and the team do their work. Hovering a cell gives the exact count for that day and hour. A switch flips between series, such as the agent's runs and the team's edits, and the cells refill in a wave.

### When to use it

- When you want to show when an agent runs, for example overnight when a queue is processed.
- When comparing the agent's working hours with the team's.
- When planning when to schedule jobs or reviews around busy periods.

### What it does

- Takes 168 values from 0 to 1 per series, one per hour starting Monday 12am, and shades each cell by its value.
- Hovering a cell shows a tooltip like "Monday 9am: 40 runs", using the series' `max` and `unit`.
- With two or more entries in `series`, a switch picks which one shows.
- The line under the title shows the series' `note`, or `period` when it has none.
- Cells fill in as a wave from the top left when the card appears and when the series changes.
- Day labels down the side, hour labels along the bottom and a Less to More legend.
- In a narrow card (400px or less, as on a phone) the grid shows half the day at a time in bigger cells and scrolls sideways by touch or trackpad, starting at the latest hours. The day labels stay put, the side with more to see fades out, and the hour labels come every three hours.

### Accessibility

- The grid has role="img" with an aria-label made of the title and the current note or period.
- The day labels, hour labels and legend are aria-hidden.
- The series switch is a role="group" labelled "Who", with aria-pressed on the active option.
- The wave delay between cells is removed when the user prefers reduced motion.

## Usage in React

```tsx
import { ActivityHeatmap } from '@/components/designme/activity-heatmap/ActivityHeatmap';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: the agent's week fills in, and the switch shows the team's.
import { ActivityHeatmap, type ActivityHeatmapSeries } from './ActivityHeatmap';

// a made-up month: the agent works overnight when the queue runs, the team works office hours
function week(who: 'agent' | 'team') {
  const out: number[] = [];
  for (let d = 0; d < 7; d++) for (let h = 0; h < 24; h++) {
    let v = who === 'agent' ? (h >= 1 && h <= 5 ? .75 : h >= 9 && h <= 18 ? .45 : .15) : (h >= 9 && h <= 18 ? .65 : h >= 19 && h <= 22 ? .2 : .03);
    if (d >= 5) v *= who === 'agent' ? .8 : .2;
    if (who === 'agent' && d === 0 && h === 9) v = 1;
    out.push(Math.max(0, Math.min(1, v + Math.sin(d * 7.1 + h * 3.3) * .18)));
  }
  return out;
}

const SERIES: ActivityHeatmapSeries[] = [
  { key: 'agent', label: 'Agent', values: week('agent'), max: 40, unit: 'runs', note: 'Busiest overnight, when the queue runs' },
  { key: 'team', label: 'Team', values: week('team'), max: 25, unit: 'edits', note: 'Busiest 10am to 4pm on weekdays' }
];

export default function ActivityHeatmapDemo() {
  return <div style={{ width: '100%' }}><ActivityHeatmap series={SERIES} /></div>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `series` | `ActivityHeatmapSeries[]` | One or more series; the switch shows when there are two or more |
| `value` (optional) | `string` | The series on show, by key. Leave it out to let the switch pick it |
| `defaultValue` (optional) | `string` |  |
| `onValueChange` (optional) | `(key: string) => void` |  |
| `title` (optional) | `string` | Header text |
| `period` (optional) | `string` | The line under the title before the cells fill in, and when a series has no note |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ActivityHeatmap from '../components/designme/activity-heatmap/ActivityHeatmap.astro';
---
<ActivityHeatmap />
<ActivityHeatmap data-style="soft" class="my-class" />
```
It plays its demo; change `activity-heatmap.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**What shape does the data need to be?**

Each series needs exactly 168 numbers between 0 and 1, one per hour, Monday 12am first and Sunday 11pm last. Scale your counts down first; the tooltips multiply by `max` to show real counts again.

**How do the tooltip counts work?**

A cell's value times the series' `max`, rounded, followed by its `unit`. So 0.5 with `max: 40` and `unit: 'runs'` reads "20 runs".

**Can I show just one series without the switch?**

Yes. Pass a single entry in `series`. The switch only appears when there are two or more.

## Source

`ActivityHeatmap.tsx`, as `npx designme add activity-heatmap --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useReducedMotion } from '../lib/hooks';
import { Seg, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './activity-heatmap.css';

export interface ActivityHeatmapSeries {
  key: string;
  /** The switch label, like "Agent" */
  label: string;
  /** 168 values from 0 to 1, one an hour, Monday 12am first */
  values: number[];
  /** What a full cell counts, for the tips, like 40 */
  max: number;
  /** What it counts, for the tips, like "runs" */
  unit: string;
  /** The line under the title while this series shows, like "Busiest overnight, when the queue runs" */
  note?: string;
}

export interface ActivityHeatmapProps {
  /** One or more series; the switch shows when there are two or more */
  series: ActivityHeatmapSeries[];
  /** The series on show, by key. Leave it out to let the switch pick it */
  value?: string;
  defaultValue?: string;
  onValueChange?: (key: string) => void;
  /** Header text */
  title?: string;
  /** The line under the title before the cells fill in, and when a series has no note */
  period?: string;
  className?: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const LEGEND = [.08, .3, .55, .85];
// every three hours; the ones between the four on a wide card only show on a phone
const HOURS = ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'];
const hour = (h: number) => (h % 12 || 12) + (h < 12 ? 'am' : 'pm');
const shade = (a: number): CSSProperties => ({ ['--dm-a' as string]: a });

/** When the agent or the team is busy, by day and hour. The cells fill in as a wave from the top left. In a narrow card (a phone)
    the grid shows half the day at a time in bigger cells, scrolls sideways and starts at the latest hours. */
export function ActivityHeatmap({ series, value, defaultValue, onValueChange, title = 'Activity', period = 'Last 4 weeks', className }: ActivityHeatmapProps) {
  const [key, setKey] = useControllable(value, defaultValue ?? series[0]?.key ?? '', onValueChange);
  const s = series.find(x => x.key === key) ?? series[0];
  const reduce = useReducedMotion();
  // the cells start empty and fill in a moment after the card appears
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 150); return () => clearTimeout(t); }, []);
  // on a phone the grid scrolls sideways: it starts at the latest hours, and fades out on whichever side has more to see
  const sc = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sc.current; if (!el) return;
    // it stays on the latest hours as the card settles its size, until the person scrolls it themselves
    let moved = false;
    const edges = () => { const m = el.scrollWidth - el.clientWidth; el.classList.toggle('dm-ml', m > 1 && el.scrollLeft > 1); el.classList.toggle('dm-mr', m > 1 && el.scrollLeft < m - 1); };
    const fit = () => { if (!moved) el.scrollLeft = el.scrollWidth; edges(); };
    const move = () => { moved = true; }, EV = ['pointerdown', 'wheel', 'touchstart', 'keydown'] as const;
    const ro = new ResizeObserver(fit); ro.observe(el); const g = el.querySelector('.dm-hmx-grid'); if (g) ro.observe(g); el.addEventListener('scroll', edges, { passive: true });
    EV.forEach(e => el.addEventListener(e, move, { passive: true }));
    return () => { ro.disconnect(); el.removeEventListener('scroll', edges); EV.forEach(e => el.removeEventListener(e, move)); };
  }, []);

  return (
    <div data-dm="" className={cx('dm-hmx dm-panel', className)}>
      <div className="dm-hmx-h">
        <div><b>{title}</b><Swap className="dm-muted dm-hmx-st">{drawn ? s?.note ?? period : period}</Swap></div>
        {series.length > 1 && <Seg className="dm-hmx-sg" label="Who" value={key} onChange={setKey} options={series.map(x => ({ value: x.key, label: x.label }))} />}
      </div>
      <div className="dm-hmx-wrap"><div ref={sc} className="dm-hmx-sc">
        <div className="dm-hmx-days dm-muted" aria-hidden="true">{['Mon', '', 'Wed', '', 'Fri', '', 'Sun'].map((d, i) => <span key={i}>{d}</span>)}</div>
        <div className="dm-hmx-grid" role="img" aria-label={`${title}, ${s?.note ?? period}`}>
          {Array.from({ length: 168 }, (_, i) => {
            const d = Math.floor(i / 24), h = i % 24, v = s?.values[i] ?? 0;
            // each cell changes a beat after the one before it, so a new series sweeps in from the top left
            const style = { ...shade(drawn ? +(v * .9).toFixed(2) : 0), transition: `background .5s var(--dm-ease) ${reduce ? 0 : (h + d) * 14}ms, transform .2s` };
            // always inside its Tip, so the cell keeps its element (and its transition) when the tips switch on
            return <Tip key={i} off={!drawn} label={s ? `${DAYS[d]} ${hour(h)}: ${Math.round(v * s.max)} ${s.unit}` : ''}><i style={style} /></Tip>;
          })}
        </div>
        <div className="dm-hmx-f dm-muted" aria-hidden="true">{HOURS.map((t, i) => <span key={t} className={cx('dm-hmx-ax', i % 2 === 1 && 'dm-x')}>{t}</span>)}</div>
      </div></div>
      <div className="dm-hmx-lg dm-muted" aria-hidden="true">Less{LEGEND.map(a => <i key={a} style={shade(a)} />)}More</div>
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
- [Health score](https://designme.dev/components/health-score.md): A design system score made of a few checks you can open.
- [Score breakdown](https://designme.dev/components/score-breakdown.md): A score out of 100 whose gauge is split by what goes into it, with the weakest part flagged and a fix to try.
- [Eval radar](https://designme.dev/components/radar-chart.md): This run against the baseline on six eval scores, with the weak ones flagged.
- [Cost vs quality](https://designme.dev/components/scatter-chart.md): Every run as a dot by cost and eval score, sized by tokens, with quadrants and a drag to select.
- [Stat cards](https://designme.dev/components/stat-cards.md): Four headline numbers with sparklines and a period switch.
- [Account table](https://designme.dev/components/account-table.md): Customer accounts with health, plan and an agent note per row.

All components: https://designme.dev/llms.txt
