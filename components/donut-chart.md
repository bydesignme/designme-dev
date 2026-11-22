# Donut chart

> Where the agent's time went this week, as a gauge against its budget, with a part you can select.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/donut-chart

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

A gauge that splits a total into parts against what it is out of, such as the hours an agent spent on each kind of task out of its weekly budget. The parts sweep in as a half ring in the chart palette's colours, what is left is a light grey track, the total sits in the middle, and a legend under the gauge lists each part with its value. Hovering a part or focusing its legend row highlights both and puts that part in the middle; clicking one selects it, so it stays there until it is clicked again.

### When to use it

- When you want to show where an agent's time, cost or effort went, and how much of a budget it used.
- When a total breaks into a handful of categories and their sizes matter.
- When a small dashboard card needs both the total and the breakdown.

### What it does

- Draws one part per entry in `segments`, sized by its share of `max`, sweeping in one after another, with small gaps between them and slightly rounded corners (square in Blueprint).
- What the parts leave of `max` shows as a light grey track; without `max` the parts fill the half ring.
- The middle shows the total, counting up, with `label` under it; while a part is highlighted or selected it shows that part's value and name instead.
- Each legend row shows a bar in the part's colour, its name, and its value with `unit`.
- Hovering a part or a row, or focusing a row, highlights both; `active` and `onActiveChange` let you drive the highlight from outside.
- Clicking a part or a row (or Enter or Space on a row) selects it: its row keeps a stronger fill and the middle keeps showing it while you point at others. Clicking it again or Escape clears it; `selected` and `onSelectedChange` let you drive the selection from outside.
- Colours come from the chart palette in order, or from each segment's `color`, and `format` sets how values read (one decimal by default).
- In Clean the title sits on an off-white head strip, the ring is slimmer with a little rounder corners, the track is recessed with an inner shadow, and the legend's hover is one fill that glides from row to row. In Clean dark a gauge with its title draws its first part, in the accent, white.

### Accessibility

- The gauge's SVG is aria-hidden, so the total, what it is out of and each part's value are read from the text in the middle and the legend.
- Each legend row is a button that can take the keyboard's focus, which highlights its part; Enter or Space selects it, and it says whether it is selected (aria-pressed). Escape clears the selection.
- The sweep and the count-up finish at once, and Clean's hover only fades rather than gliding, when the user prefers reduced motion.

## Usage in React

```tsx
import { DonutChart } from '@/components/designme/donut-chart/DonutChart';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: where the agent's time went this week, out of its budget.
import { DonutChart } from './DonutChart';

export default function DonutChartDemo() {
  return (
    <div style={{ width: '100%' }}>
      <DonutChart title="Agent time" max={40} label="of 40h this week" unit="h" segments={[
        { label: 'Design reviews', value: 14.2 }, { label: 'Code changes', value: 9.6 }, { label: 'Research', value: 6.1 }, { label: 'Copy edits', value: 5.1 }
      ]} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `segments` | `DonutChartSegment[]` |  |
| `title` (optional) | `string` | The quiet title over the gauge, like "Agent time" |
| `max` (optional) | `number` | The value the half ring stands for. What the parts leave of it is a light grey track. Defaults to the total, so the parts fill it |
| `label` (optional) | `string` | Under the total in the middle, like "of 40h this week" |
| `unit` (optional) | `string` | After every value, like "h" in "14.2h" |
| `format` (optional) | `(n: number) => string` | Writes a value. Defaults to one decimal, like 14.2 |
| `active` (optional) | `number \| null` | Index of the highlighted segment, or null. Leave it out to let hovering or focusing a segment or its row highlight it |
| `defaultActive` (optional) | `number \| null` |  |
| `onActiveChange` (optional) | `(index: number \| null) => void` |  |
| `selected` (optional) | `number \| null` | Index of the selected segment, or null. A click on a part or its row (or Enter on the row) selects it and keeps it in the middle until it is clicked again or Escape clears it. Leave it out to let the chart keep its own |
| `defaultSelected` (optional) | `number \| null` |  |
| `onSelectedChange` (optional) | `(index: number \| null) => void` |  |
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

**How do I show a budget or a target?**

Pass `max`, like 40 for a 40-hour week, and say it in `label`, like "of 40h this week". The parts fill their share of it and the rest is the grey track.

**Can I highlight a part from somewhere else on the page?**

Yes. Pass `active` with the segment's index (or null for none) and update it from your own state; `onActiveChange` tells you when hovering or focus changes it.

**What is the difference between highlighted and selected?**

A highlight follows the pointer and the keyboard's focus, and goes when they leave. A selection is made with a click (or Enter or Space on a row) and stays until it is clicked again or cleared with Escape. The middle shows the highlighted part if there is one, otherwise the selected one.

**How do I show money or percentages instead of hours?**

Pass `format` to write each value and `unit` for the text after it. Both apply to the middle and to every legend row.

## Source

`DonutChart.tsx`, as `npx designme add donut-chart --react` installs it:

```tsx
'use client';
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useReducedMotion } from '../lib/hooks';
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
  /** The quiet title over the gauge, like "Agent time" */
  title?: string;
  /** The value the half ring stands for. What the parts leave of it is a light grey track. Defaults to the total, so the parts fill it */
  max?: number;
  /** Under the total in the middle, like "of 40h this week" */
  label?: string;
  /** After every value, like "h" in "14.2h" */
  unit?: string;
  /** Writes a value. Defaults to one decimal, like 14.2 */
  format?: (n: number) => string;
  /** Index of the highlighted segment, or null. Leave it out to let hovering or focusing a segment or its row highlight it */
  active?: number | null;
  defaultActive?: number | null;
  onActiveChange?: (index: number | null) => void;
  /** Index of the selected segment, or null. A click on a part or its row (or Enter on the row) selects it and keeps it in the
      middle until it is clicked again or Escape clears it. Leave it out to let the chart keep its own */
  selected?: number | null;
  defaultSelected?: number | null;
  onSelectedChange?: (index: number | null) => void;
  className?: string;
}

/* the half ring: centred on the middle of its base, the parts 4px apart. Its thickness and corner radius are the style's
   (--dm-dnx-th and --dm-dnx-cr: 18px and 4px, Clean 14px and 5px), read once it is on the page */
const CX = 110, CY = 110, RO = 104, GAP = 4;
const P = (rho: number, a: number) => `${(CX + rho * Math.cos(a)).toFixed(2)} ${(CY - rho * Math.sin(a)).toFixed(2)}`;
/* one part, from f0 to f1 of the sweep (left to right over the top). Its corners are rounded by a stroke of their radius drawn
   round the part's shape inset by that radius (Blueprint joins the stroke square, which gives a square part). gs and ge are
   the room left at each end: half the gap where it meets another part, nothing at the ring's own ends */
function part(f0: number, f1: number, gs: number, ge: number, RI: number, CR: number) {
  const ts = Math.PI * (1 - f0), te = Math.PI * (1 - f1), ro = RO - CR, ri = RI + CR;
  let os = ts - Math.asin((gs + CR) / ro), oe = te + Math.asin((ge + CR) / ro), is = ts - Math.asin((gs + CR) / ri), ie = te + Math.asin((ge + CR) / ri);
  if (os < oe) os = oe = (os + oe) / 2;
  if (is < ie) is = ie = (is + ie) / 2;
  return `M${P(ro, os)}A${ro} ${ro} 0 0 1 ${P(ro, oe)}L${P(ri, ie)}A${ri} ${ri} 0 0 0 ${P(ri, is)}Z`;
}

/** A half-ring gauge of parts that sweep in one after another, with what is left as a track, the total in the middle and a
    legend under it; hovering or focusing a part or its row highlights both and shows it in the middle, and a click selects it. */
export function DonutChart({ segments, title, max, label = 'Total', unit = '', format = n => n.toFixed(1), active, defaultActive = null, onActiveChange, selected, defaultSelected = null, onSelectedChange, className }: DonutChartProps) {
  const [hl, setHl] = useControllable(active, defaultActive, onActiveChange);
  const [sel, setSel] = useControllable(selected, defaultSelected, onSelectedChange);
  const pickRow = (i: number) => setSel(sel === i ? null : i);
  const shown = hl ?? sel;
  const uid = 'dm-dnx' + useId().replace(/:/g, '');
  /* Clean's hover on the legend is one fill under the rows that glides to the row in question; it appears where it is the
     first time rather than sliding in (Clean's CSS shows it; the other styles fill the row itself) */
  const lg = useRef<HTMLDivElement>(null), hv = useRef<HTMLElement>(null), hvOn = useRef(false), svg = useRef<SVGSVGElement>(null);
  const [ring, setRing] = useState({ ri: 86, cr: 4 });
  useLayoutEffect(() => { const el = svg.current; if (!el) return; const cs = getComputedStyle(el);
    setRing({ ri: RO - (parseFloat(cs.getPropertyValue('--dm-dnx-th')) || 18), cr: parseFloat(cs.getPropertyValue('--dm-dnx-cr')) || 4 }); }, []);
  useLayoutEffect(() => {
    const el = hv.current, row = hl != null ? lg.current?.querySelectorAll<HTMLElement>('.dm-dnx-r')[hl] : undefined; if (!el) return;
    if (!row) { el.style.opacity = '0'; hvOn.current = false; return; }
    const move = () => { el.style.transform = `translateY(${row.offsetTop}px)`; el.style.height = row.offsetHeight + 'px'; };
    if (!hvOn.current) { el.style.transition = 'none'; move(); void el.offsetWidth; el.style.transition = ''; } else move();
    el.style.opacity = '1'; hvOn.current = true;
  }, [hl]);
  const total = segments.reduce((a, s) => a + s.value, 0), full = Math.max(max ?? total, total) || 1;
  const color = (i: number) => segments[i].color ?? `var(--dm-c${i % 6 + 1})`;
  // the parts sweep in to the front f, a moment after the gauge appears, and the total counts up with them
  const reduce = useReducedMotion();
  const [f, setF] = useState(0);
  useEffect(() => {
    const end = total / full;
    if (reduce) { setF(end); return; }
    let raf = 0; const t0 = performance.now() + 260;
    const step = (t: number) => { const p = Math.max(0, Math.min(1, (t - t0) / 1200)); setF(end * (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [total, full, reduce]);
  const pick = shown != null ? segments[shown] : undefined;
  let acc = 0;
  const spans = segments.map(s => { const a = acc / full; acc += s.value; return [a, acc / full]; });
  const end = Math.min(f, total / full);

  return (
    <div data-dm="" className={cx('dm-dnx dm-panel', className)}>
      {title && <div className="dm-dnx-h">{title}</div>}
      <div className={cx('dm-dnx-g', pick && 'dm-hov')}>
        <svg className="dm-dnx-svg" ref={svg} viewBox="0 0 220 110" aria-hidden="true" style={{ '--dm-dnx-in': `url(#${uid}-in)` } as CSSProperties}>
          {/* Clean's inner shadow for the track (Clean's CSS turns it on): a 1px ring just inside the edge and a soft shade from
              the top, each the track's own shape cut out of a blurred or shrunk copy of it */}
          <defs>
            <filter id={`${uid}-in`} filterUnits="userSpaceOnUse" x="-4" y="-4" width="228" height="118" colorInterpolationFilters="sRGB">
              <feOffset in="SourceAlpha" dy="1" result="o" /><feGaussianBlur in="o" stdDeviation="1.5" result="b" /><feComposite in="SourceAlpha" in2="b" operator="out" result="e" />
              <feFlood className="dm-dnx-in-s" /><feComposite in2="e" operator="in" result="s" />
              <feMorphology in="SourceAlpha" operator="erode" radius="1" result="k" /><feComposite in="SourceAlpha" in2="k" operator="out" result="q" />
              <feFlood className="dm-dnx-in-r" /><feComposite in2="q" operator="in" result="r" />
              <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="s" /><feMergeNode in="r" /></feMerge>
            </filter>
          </defs>
          {spans.map(([a, b], i) => { const e = Math.min(b, f); return (
            <path key={i} data-i={i} className={cx(shown === i && 'dm-hl')} style={{ fill: color(i), stroke: color(i) }} d={e > a + .004 ? part(a, e, a ? GAP / 2 : 0, e < 1 ? GAP / 2 : 0, ring.ri, ring.cr) : ''}
              onMouseEnter={() => setHl(i)} onMouseLeave={() => setHl(null)} onClick={() => pickRow(i)} />
          ); })}
          <path className="dm-tr" d={end < .996 ? part(end, 1, end ? GAP / 2 : 0, 0, ring.ri, ring.cr) : ''} />
        </svg>
        <div className="dm-dnx-c">
          <b className="dm-num">{format(pick ? pick.value : end * full)}{unit}</b>
          <span className="dm-muted">{pick ? pick.label : label}</span>
        </div>
      </div>
      {/* the pointer moving from row to row keeps the hover (the gap between rows included); it goes when the pointer leaves */}
      <div className="dm-dnx-lg dm-gl" ref={lg} onMouseLeave={() => { const a = document.activeElement; if (!(a && lg.current?.contains(a) && a.matches(':focus-visible'))) setHl(null); }}>
        <i className="dm-dnx-hv" ref={hv} aria-hidden="true" />
        {segments.map((s, i) => (
          <button type="button" key={i} className={cx('dm-dnx-r dm-enter', shown === i && 'dm-hl', sel === i && 'dm-sel')} style={enter(150 + i * 60).style} aria-pressed={sel === i}
            onMouseEnter={() => setHl(i)} onFocus={() => setHl(i)} onBlur={e => { if (!(e.relatedTarget instanceof HTMLElement && e.relatedTarget.classList.contains('dm-dnx-r') && lg.current?.contains(e.relatedTarget))) setHl(null); }}
            onClick={() => pickRow(i)} onKeyDown={e => { if (e.key === 'Escape' && sel != null) setSel(null); }}>
            <i style={{ background: color(i) }} />
            <span className="dm-t">{s.label}</span>
            <span className="dm-v dm-num">{format(s.value)}{unit}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

## More in Charts and tables

- [Line chart](https://designme.dev/components/line-chart.md): Today so far and projected, against yesterday, with a range switch, a project picker, toggles and a readout.
- [Bar chart](https://designme.dev/components/bar-chart.md): Weekly agent runs, split by outcome, with a range switch.
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
