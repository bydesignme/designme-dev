# Eval radar

> This run against the baseline on six eval scores, with the weak ones flagged.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/radar-chart

## Install

```sh
npx designme add radar-chart          # HTML, CSS and JS, with the shared core
npx designme add radar-chart --react  # React 19 component and its CSS
npx designme add radar-chart --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/radar-chart.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/radar-chart.json  # Astro
```

## About

A radar chart for eval scores: the baseline run as an outline and the current run filled over it, on six axes such as accuracy, instruction following, tool use, speed, cost efficiency and safety. Each axis is labelled with its score and how far it moved, a weak axis says Weak in words, and the average sits in the middle. Point at an axis, or tab to it, to read both scores and the change; the agent's note sits under the chart.

### When to use it

- To compare a new agent run, prompt or model with a baseline across several eval scores at once.
- When the overall average hides one score that got worse, and you want that score called out.
- Beside an eval report, as the picture that says where to look first.

### What it does

- Grey scale rings at 25, 50, 75 and 100, with a spoke for each axis.
- The baseline is an outline in the second chart colour and this run is filled in the first (the accent), with a dot at each score.
- Each axis label shows the score and the change ("62 −16"); a score under `weakBelow` (70) gets a Weak tag.
- The average of this run sits in the middle of the chart.
- The legend shows and hides each series; one always stays on.
- Pointing at an axis, or moving the focus to it, lights its spoke and dot and writes both scores and the change under the chart; leaving it brings back the agent's `note`.
- `pulse` makes one axis's label pulse, to point at what the note is about.
- On load the baseline draws itself and this run grows out of the middle. On a narrow card long names switch to their `short` form and the labels stack, so the rings keep their room.

### Accessibility

- Each axis label is a button with a name that reads its scores and the change, like "Tool use: 62, baseline 78, down 16, weak".
- The labels form one tab stop: Left and Right (or Up and Down) move round the chart, Home and End go to the first and last.
- The line under the chart is a polite live region, so the scores of the axis in focus are read out.
- Weak axes are flagged in words, not only by colour; the two series differ by fill as well as colour.
- The drawn chart is hidden from screen readers, since every value is in the labels.

## Usage in React

```tsx
import { RadarChart } from '@/components/designme/radar-chart/RadarChart';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: the baseline draws, this run grows over it, and the agent
// notes it is cheaper but weaker at tool use, which pulses.
import { useEffect, useState } from 'react';
import { RadarChart, type RadarAxis } from './RadarChart';

const AXES: RadarAxis[] = [
  { label: 'Accuracy', value: 88, baseline: 84 }, { label: 'Instruction following', short: 'Instructions', value: 86, baseline: 80 },
  { label: 'Tool use', value: 62, baseline: 78 }, { label: 'Speed', value: 74, baseline: 66 },
  { label: 'Cost efficiency', short: 'Cost', value: 82, baseline: 58 }, { label: 'Safety', value: 91, baseline: 90 }
];

export default function RadarChartDemo() {
  const [said, setSaid] = useState(false);
  useEffect(() => { const t = setTimeout(() => setSaid(true), 3100); return () => clearTimeout(t); }, []);
  return (
    <div style={{ width: '100%' }}>
      <RadarChart axes={AXES} subtitle="Run 48 against run 41" pulse={said ? 2 : undefined}
        note={said ? <>Cheaper and faster, <b>weaker at tool use</b> (−16). It skipped the search tool on 7 of 40 tasks.</> : undefined} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `axes` | `RadarAxis[]` | Five to seven axes, clockwise from the top |
| `title` (optional) | `string` |  |
| `subtitle` (optional) | `string` |  |
| `seriesLabels` (optional) | `[string, string]` | The legend's names for the two series |
| `weakBelow` (optional) | `number` | A score under this is flagged "Weak" (70) |
| `note` (optional) | `ReactNode` | The agent's note under the chart, shown while no axis is pointed at. Defaults to the average and its change |
| `pulse` (optional) | `number` | An axis to call out: its label pulses (by index) |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import RadarChart from '../components/designme/radar-chart/RadarChart.astro';
---
<RadarChart />
<RadarChart data-style="soft" class="my-class" />
```
It plays its demo; change `radar-chart.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How many axes can it take?**

It is laid out for five to seven. With more, the labels start to crowd on a phone.

**Can I compare more than two runs?**

No. It is built for one run against one baseline, which keeps the picture readable. For more runs, use a table or a line chart.

**What scale do the scores use?**

0 to 100 on every axis. Convert other units first, for example cost efficiency as a score where 100 is your cheapest run.

## Source

`RadarChart.tsx`, as `npx designme add radar-chart --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useIsoLayoutEffect, useReducedMotion, useTween } from '../lib/hooks';
import { Icon } from '../lib/icons';
import '../designme.css';
import './radar-chart.css';

export interface RadarAxis {
  /** Like "Instruction following" */
  label: string;
  /** Shown instead of the label on a narrow card, like "Instructions" */
  short?: string;
  /** This run's score, 0 to 100 */
  value: number;
  /** The baseline's score, 0 to 100 */
  baseline: number;
}

export interface RadarChartProps {
  /** Five to seven axes, clockwise from the top */
  axes: RadarAxis[];
  title?: string;
  subtitle?: string;
  /** The legend's names for the two series */
  seriesLabels?: [string, string];
  /** A score under this is flagged "Weak" (70) */
  weakBelow?: number;
  /** The agent's note under the chart, shown while no axis is pointed at. Defaults to the average and its change */
  note?: ReactNode;
  /** An axis to call out: its label pulses (by index) */
  pulse?: number;
  className?: string;
}

const tween = (ms: number, step: (t: number) => void, reduce: boolean) => new Promise<void>(res => {
  const t0 = performance.now(), f = (t: number) => { const p = Math.min(1, (t - t0) / (reduce ? 1 : ms)); step(1 - Math.pow(1 - p, 3)); if (p < 1) requestAnimationFrame(f); else res(); };
  requestAnimationFrame(f);
});

/** Compares a run with its baseline on a handful of eval scores: the baseline as an outline, this run filled, weak axes flagged in words. */
export function RadarChart({ axes, title = 'Eval scores', subtitle, seriesLabels = ['This run', 'Baseline'], weakBelow = 70, note, pulse, className }: RadarChartProps) {
  const N = axes.length;
  const ch = useRef<HTMLDivElement>(null), labels = useRef<(HTMLButtonElement | null)[]>([]);
  const [size, setSize] = useState({ W: 0, H: 0, side: 92 });
  const [on, setOn] = useState({ cur: true, base: true });
  const [hot, setHot] = useState(-1);
  const [focusAt, setFocusAt] = useState(0);
  const [drawn, setDrawn] = useState(0), [grow, setGrow] = useState(0);
  const reduce = useReducedMotion();
  const mean = (k: 'value' | 'baseline') => Math.round(axes.reduce((t, a) => t + a[k], 0) / N);
  const avg = useTween(grow > 0 ? mean('value') : 0, 1100, 0);
  // the baseline draws itself, then this run grows out of the middle
  useEffect(() => { let live = true; void (async () => {
    await new Promise(r => setTimeout(r, 300)); if (!live) return;
    await tween(900, t => live && setDrawn(t * 100), reduce); await new Promise(r => setTimeout(r, 250));
    await tween(1100, t => live && setGrow(t), reduce);
  })(); return () => { live = false; }; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const narrow = size.W > 0 && size.W < 380;
  useIsoLayoutEffect(() => {
    const el = ch.current; if (!el) return;
    const measure = () => { const side = Math.max(0, ...labels.current.filter((l, i) => l && Math.abs(Math.cos(ang(i))) >= .2).map(l => l!.offsetWidth)); setSize({ W: el.clientWidth, H: el.clientHeight, side }); };
    measure(); const ro = new ResizeObserver(measure); ro.observe(el); return () => ro.disconnect();
  }, [narrow]); // eslint-disable-line react-hooks/exhaustive-deps
  const ang = (i: number) => -Math.PI / 2 + i * 2 * Math.PI / N;
  const { W, H } = size, cxp = W / 2, cyp = H / 2, R = Math.max(40, Math.min(H / 2 - 46, W / 2 - size.side - 14));
  const pt = (i: number, v: number) => [cxp + Math.cos(ang(i)) * R * v / 100, cyp + Math.sin(ang(i)) * R * v / 100];
  const poly = (f: (a: RadarAxis) => number) => axes.map((a, i) => pt(i, f(a)).map(n => n.toFixed(1)).join(',')).join(' ');
  const ro = hot >= 0 ? axes[hot] : null;
  const keys = (e: React.KeyboardEvent) => {
    const i = focusAt, to = ({ ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: N - 1 } as Record<string, number>)[e.key];
    if (to == null) return; e.preventDefault(); const j = (to + N) % N; setFocusAt(j); labels.current[j]?.focus();
  };
  const toggle = (s: 'cur' | 'base') => { const o = s === 'cur' ? 'base' : 'cur'; if (on[s] && !on[o]) return; setOn({ ...on, [s]: !on[s] }); };
  return (
    <div data-dm="" className={cx('dm-rdx dm-panel', className)}>
      <div className="dm-rdx-h">
        <div className="dm-rdx-t"><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div>
        <div className="dm-rdx-lg">
          <button type="button" className="dm-rdx-k" aria-pressed={on.cur} onClick={() => toggle('cur')}><i className="dm-c" />{seriesLabels[0]}</button>
          <button type="button" className="dm-rdx-k" aria-pressed={on.base} onClick={() => toggle('base')}><i className="dm-b" />{seriesLabels[1]}</button>
        </div>
      </div>
      <div ref={ch} className="dm-rdx-ch" role="group" aria-label="Scores by axis. Left and Right move between axes" onKeyDown={keys}
        onPointerLeave={() => { if (!ch.current?.contains(document.activeElement)) setHot(-1); }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHot(-1); }}>
        {W > 0 && <svg className="dm-rdx-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          {[25, 50, 75, 100].map(v => <polygon key={v} className={cx('dm-ring', v === 100 && 'dm-out')} points={axes.map((_, i) => pt(i, v).join(',')).join(' ')} />)}
          {axes.map((_, i) => { const [x, y] = pt(i, 100); return <line key={i} className={cx('dm-sp', i === hot && 'dm-on')} x1={cxp} y1={cyp} x2={x} y2={y} />; })}
          <polygon className={cx('dm-base', !on.base && 'dm-off')} pathLength={100} style={{ strokeDasharray: `${drawn} 100` }} points={poly(a => a.baseline)} />
          <polygon className={cx('dm-cur', !on.cur && 'dm-off')} points={poly(a => a.value * grow)} />
          {axes.map((a, i) => { const [bx, by] = pt(i, a.baseline), [x, y] = pt(i, a.value * grow); return <g key={i}>
            <circle className={cx('dm-pt dm-b', !(on.base && drawn >= 100) && 'dm-off')} r={2.5} cx={bx} cy={by} />
            <circle className={cx('dm-pt dm-c', !(on.cur && grow > .98) && 'dm-off', i === hot && 'dm-on')} r={3} cx={x} cy={y} /></g>; })}
        </svg>}
        <span className="dm-rdx-avg dm-num"><b>{Math.round(avg)}</b><span className="dm-muted">average</span></span>
        {axes.map((a, i) => {
          const an = ang(i), cs = Math.cos(an), sn = Math.sin(an), side = Math.abs(cs) < .2 ? 'm' : cs < 0 ? 'l' : 'r';
          const x = cxp + cs * (R + 12), y = cyp + sn * (R + 12), d = a.value - a.baseline, weak = a.value < weakBelow;
          const el = labels.current[i], w = el?.offsetWidth ?? 0, h = el?.offsetHeight ?? 0;
          return (
            <button type="button" key={a.label} ref={b => { labels.current[i] = b; }} className={cx('dm-rdx-ax', 'dm-' + side, i === hot && 'dm-on', i === pulse && grow > .98 && 'dm-hot')} tabIndex={i === focusAt ? 0 : -1}
              aria-label={`${a.label}: ${a.value}, baseline ${a.baseline}, ${d >= 0 ? 'up' : 'down'} ${Math.abs(d)}${weak ? ', weak' : ''}`}
              style={{ left: side === 'm' ? x - w / 2 : side === 'l' ? x - w : x, top: Math.abs(sn) > .9 ? (sn < 0 ? y - h : y) : y - h / 2, visibility: W ? undefined : 'hidden' }}
              onPointerEnter={e => { if (e.pointerType !== 'touch') setHot(i); }} onFocus={() => { setHot(i); setFocusAt(i); }} onClick={() => setHot(i)}>
              <span className="dm-n">{narrow && a.short ? a.short : a.label}</span>
              <span className="dm-v dm-num"><b>{a.value}</b><span>{d >= 0 ? '+' : '−'}{Math.abs(d)}</span>{weak && <span className="dm-tag dm-warn">Weak</span>}</span>
            </button>
          );
        })}
      </div>
      <div className="dm-rdx-ro" aria-live="polite">
        {ro ? <span><b>{ro.label}</b> {ro.value} now, {ro.baseline} before, <span className={ro.value < ro.baseline ? 'dm-dn' : 'dm-up'}>{ro.value < ro.baseline ? '−' : '+'}{Math.abs(ro.value - ro.baseline)}</span>{ro.value < weakBelow ? `, below ${weakBelow}` : ''}</span>
          : <span><Icon name="spark" size="xs" /><span>{note ?? <>This run averages <b>{mean('value')}</b>, {mean('value') >= mean('baseline') ? 'up' : 'down'} {Math.abs(mean('value') - mean('baseline'))} on the baseline.</>}</span></span>}
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
- [Health score](https://designme.dev/components/health-score.md): A design system score made of a few checks you can open.
- [Score breakdown](https://designme.dev/components/score-breakdown.md): A score out of 100 whose gauge is split by what goes into it, with the weakest part flagged and a fix to try.
- [Cost vs quality](https://designme.dev/components/scatter-chart.md): Every run as a dot by cost and eval score, sized by tokens, with quadrants and a drag to select.
- [Activity heatmap](https://designme.dev/components/activity-heatmap.md): When the agent and the team were busy, by day and hour.
- [Stat cards](https://designme.dev/components/stat-cards.md): Four headline numbers with sparklines and a period switch.
- [Account table](https://designme.dev/components/account-table.md): Customer accounts with health, plan and an agent note per row.

All components: https://designme.dev/llms.txt
