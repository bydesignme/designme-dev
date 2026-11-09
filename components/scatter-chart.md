# Cost vs quality

> Every run as a dot by cost and eval score, sized by tokens, with quadrants and a drag to select.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/scatter-chart

## Install

```sh
npx designme add scatter-chart          # HTML, CSS and JS, with the shared core
npx designme add scatter-chart --react  # React 19 component and its CSS
npx designme add scatter-chart --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/scatter-chart.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/scatter-chart.json  # Astro
```

## About

A scatter chart of agent runs: each dot is a run, placed by its cost and its eval score and sized by the tokens it used, with a colour and a shape for each model. Dashed median lines cut it into four named quadrants. Point at the chart and the tooltip snaps to the nearest run while the other models step back; drag across it to select runs, see how many and their averages, and ask the agent why they stand out.

### When to use it

- To weigh cost against quality across many runs, prompts or models at once.
- To find runs that cost a lot for a middling score, or cheap runs that score well, and ask the agent what they share.
- On an evals or spend dashboard, beside a table of the same runs.

### What it does

- Axis titles with units set clear of the ticks, a few light gridlines with quiet tick labels, and a dot size that grows with tokens.
- A colour from the chart palette and a shape (circle, square, triangle) for each series, so the models tell apart without colour too.
- Median lines for cost and score, worked out from the runs on show, with a name in each quadrant's corner (`quadrants`).
- The legend shows and hides each model; one always stays, and the medians follow what is on show.
- Pointing snaps the tooltip to the nearest run within reach (cost, score, run, model and tokens) and dims the other models.
- Dragging draws a dashed box; the runs inside it are selected, with their count and averages under the chart, and an Ask the agent why button (with `onAsk`). A click on an empty spot, or Escape, clears it.
- On a narrow chart (340px or less, as on a phone) the quadrant names give way to the median lines alone, each axis keeps three ticks, the dots get a little smaller, and a selection's words sit above a full-width Ask the agent why.
- `ringed` draws dashed rings round runs worth a look, such as outliers the agent found, and `note` says why.
- The selection can be controlled with `selected` and `onSelectedChange`.

### Accessibility

- The chart takes the focus as one group with a label saying the arrow keys step through the runs.
- The arrow keys move from run to run, cheapest first; Home and End go to the first and last; Escape clears a selection. Each run in focus is written under the chart, which is a polite live region, with its place in the list ("7 of 48").
- Series differ by shape as well as colour.
- The drawn chart is hidden from screen readers; the line under it carries the values.
- The keyboard focus ring is the quiet grey ring; a mouse or touch never shows one.

## Usage in React

```tsx
import { ScatterChart } from '@/components/designme/scatter-chart/ScatterChart';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: the agent rings three outliers, then the person selects
// the cheap, high scoring runs and asks why.
import { useEffect, useRef, useState } from 'react';
import { ScatterChart, type ScatterRun } from './ScatterChart';
import { useStory } from '../lib/useScript';

const rnd = (i: number, k: number) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
const RUNS: ScatterRun[] = [];
const add = (series: string, n: number, x: [number, number], y: [number, number], t: [number, number], k: number) => {
  for (let i = 0; i < n; i++) RUNS.push({ id: 12 + RUNS.length, series, x: Math.round((x[0] + rnd(i, k) * x[1]) * 100) / 100, y: Math.round(y[0] + rnd(i, k + 1) * y[1]), size: Math.round(t[0] + rnd(i, k + 2) * t[1]) });
};
add('opus', 15, [.3, .22], [85, 12], [28, 30], 1); add('sonnet', 18, [.06, .22], [79, 16], [12, 18], 4); add('haiku', 12, [.02, .08], [64, 20], [5, 8], 7);
RUNS.push({ id: 57, series: 'opus', x: .57, y: 73, size: 61 }, { id: 58, series: 'opus', x: .54, y: 70, size: 58 }, { id: 59, series: 'sonnet', x: .47, y: 71, size: 44 });

export default function ScatterChartDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [ringed, setRinged] = useState<number[]>([]);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  useEffect(() => { const t = setTimeout(() => setRinged([57, 58, 59]), 1500); return () => clearTimeout(t); }, []);
  useStory(ref, async ({ wait, press }) => {
    await wait(4500); setRinged([]);
    setSelected(RUNS.filter(r => r.x >= .03 && r.x <= .2 && r.y >= 88).map(r => r.id));
    await wait(1500); press('.dm-cvq-ft .dm-pill');
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ScatterChart runs={RUNS} subtitle="48 runs this week, sized by tokens" ringed={ringed} selected={selected} onSelectedChange={setSelected}
        series={[{ key: 'opus', label: 'Opus' }, { key: 'sonnet', label: 'Sonnet' }, { key: 'haiku', label: 'Haiku' }]}
        note={ringed.length ? <><b>3 outliers</b> cost over $0.45 for a score under 75. Each one looped on the search tool.</> : undefined}
        onAsk={runs => new Promise(res => setTimeout(() => res(`Most of these ${runs.length} are Sonnet runs on short tickets, with under 6 tool calls each. Sending tickets like these to Sonnet would cut their cost by about 40%.`), 1000))} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `runs` | `ScatterRun[]` |  |
| `series` | `ScatterSeries[]` |  |
| `title` (optional) | `string` |  |
| `subtitle` (optional) | `string` |  |
| `xDomain` (optional) | `[number, number]` | [min, max] of each axis |
| `yDomain` (optional) | `[number, number]` |  |
| `xTicks` (optional) | `number[]` | Where the labels go along the bottom. A narrow chart (340px or less, on a phone) shows the two ends and the middle |
| `yTicks` (optional) | `number[]` | Where the gridlines and their labels go up the side. A narrow chart keeps the two ends and the middle |
| `xTitle` (optional) | `string` |  |
| `yTitle` (optional) | `string` |  |
| `formatX` (optional) | `(x: number) => string` |  |
| `formatY` (optional) | `(y: number) => string` |  |
| `formatSize` (optional) | `(s: number) => string` |  |
| `quadrants` (optional) | `[string, string, string, string]` | The four quadrants the medians make, from the top left, clockwise: top left, top right, bottom right, bottom left. A narrow chart keeps the median lines and leaves the names out |
| `ringed` (optional) | `(string \| number)[]` | Runs to ring, like outliers the agent found |
| `note` (optional) | `ReactNode` | The line under the chart while nothing is selected or in focus |
| `selected` (optional) | `(string \| number)[]` | The selected runs, by id |
| `onSelectedChange` (optional) | `(ids: (string \| number)[]) => void` |  |
| `onAsk` (optional) | `(runs: ScatterRun[]) => string \| Promise<string>` | Adds "Ask the agent why" to a selection. Return the answer (or a promise of it) and it streams in. A click on an empty spot, or Escape, clears the selection |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ScatterChart from '../components/designme/scatter-chart/ScatterChart.astro';
---
<ScatterChart />
<ScatterChart data-style="soft" class="my-class" />
```
It plays its demo; change `scatter-chart.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Can I plot something other than cost and score?**

Yes. Set `xDomain`, `yDomain`, the ticks, the titles, the formatters and the quadrant names for your two measures. The demo's labels are only defaults.

**How does the agent answer about a selection?**

Pass `onAsk`. It gets the selected runs and returns the answer, or a promise of it; the answer streams in under the chart a word at a time.

**Does a drag on a phone scroll the page or select?**

A vertical swipe still scrolls the page. A drag that moves sideways draws the selection box.

## Source

`ScatterChart.tsx`, as `npx designme add scatter-chart --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useIsoLayoutEffect } from '../lib/hooks';
import { Icon } from '../lib/icons';
import '../designme.css';
import './scatter-chart.css';

export interface ScatterRun {
  id: string | number;
  /** Which series it belongs to, by key */
  series: string;
  /** Along the bottom, like cost per run in dollars */
  x: number;
  /** Up the side, like an eval score in % */
  y: number;
  /** Its dot's size, like thousands of tokens */
  size: number;
}

export interface ScatterSeries {
  key: string;
  label: string;
  /** Defaults to the chart palette in order: --dm-c1, --dm-c2, --dm-c3 */
  color?: string;
  /** Each series has a shape as well as a colour, so it reads without colour too */
  shape?: 'circle' | 'square' | 'triangle';
}

export interface ScatterChartProps {
  runs: ScatterRun[];
  series: ScatterSeries[];
  title?: string;
  subtitle?: string;
  /** [min, max] of each axis */
  xDomain?: [number, number];
  yDomain?: [number, number];
  /** Where the labels go along the bottom. A narrow chart (340px or less, on a phone) shows the two ends and the middle */
  xTicks?: number[];
  /** Where the gridlines and their labels go up the side. A narrow chart keeps the two ends and the middle */
  yTicks?: number[];
  xTitle?: string;
  yTitle?: string;
  formatX?: (x: number) => string;
  formatY?: (y: number) => string;
  formatSize?: (s: number) => string;
  /** The four quadrants the medians make, from the top left, clockwise: top left, top right, bottom right, bottom left. A narrow chart keeps the median lines and leaves the names out */
  quadrants?: [string, string, string, string];
  /** Runs to ring, like outliers the agent found */
  ringed?: (string | number)[];
  /** The line under the chart while nothing is selected or in focus */
  note?: ReactNode;
  /** The selected runs, by id */
  selected?: (string | number)[];
  onSelectedChange?: (ids: (string | number)[]) => void;
  /** Adds "Ask the agent why" to a selection. Return the answer (or a promise of it) and it streams in. A click on an empty spot, or Escape, clears the selection */
  onAsk?: (runs: ScatterRun[]) => string | Promise<string>;
  className?: string;
}

const PAL = ['var(--dm-c1)', 'var(--dm-c2)', 'var(--dm-c3)', 'var(--dm-c4)', 'var(--dm-c5)', 'var(--dm-c6)'];
const SHAPES = ['circle', 'square', 'triangle'] as const;
const median = (a: number[]) => { if (!a.length) return 0; const s = [...a].sort((p, q) => p - q), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
function Mark({ shape, x, y, s }: { shape: 'circle' | 'square' | 'triangle'; x: number; y: number; s: number }) {
  return shape === 'circle' ? <circle cx={x} cy={y} r={s} /> : shape === 'square' ? <rect x={x - s * .9} y={y - s * .9} width={s * 1.8} height={s * 1.8} rx={s * .25} />
    : <path d={`M${x} ${y - s * 1.15}L${x + s * 1.05} ${y + s * .75}L${x - s * 1.05} ${y + s * .75}Z`} />;
}

/** Runs as dots by cost and quality, sized by tokens, a colour and a shape per model, with median quadrants, a tooltip that snaps to the nearest run, and a drag to select. */
export function ScatterChart({ runs, series, title = 'Cost vs quality', subtitle, xDomain = [0, .6], yDomain = [60, 100], xTicks = [0, .2, .4, .6], yTicks = [60, 80, 100],
  xTitle = 'Cost per run (USD)', yTitle = 'Eval score (%)', formatX = x => '$' + x.toFixed(2), formatY = y => Math.round(y) + '%', formatSize = s => Math.round(s) + 'k tokens',
  quadrants = ['Cheap, good', 'Costly, good', 'Costly, weaker', 'Cheap, weaker'], ringed = [], note, selected, onSelectedChange, onAsk, className }: ScatterChartProps) {
  const pl = useRef<HTMLDivElement>(null), tt = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState({ W: 0, H: 0 });
  const [off, setOff] = useState<string[]>([]);
  const [hot, setHot] = useState(-1);
  const [box, setBox] = useState<number[] | null>(null);
  const [inner, setInner] = useState<(string | number)[]>([]);
  const sel = selected ?? inner;
  const setSel = (ids: (string | number)[]) => { if (selected === undefined) setInner(ids); onSelectedChange?.(ids); };
  const [answer, setAnswer] = useState<{ text: string; busy: boolean } | null>(null);
  const asked = useRef(0);
  const drag = useRef<{ x: number; y: number; id: number; moved: boolean } | null>(null);
  useIsoLayoutEffect(() => { const el = pl.current!; const m = () => setDim({ W: el.clientWidth, H: el.clientHeight }); m(); const ro = new ResizeObserver(m); ro.observe(el); return () => ro.disconnect(); }, []);
  useEffect(() => { asked.current++; setAnswer(null); }, [sel.join()]);
  // narrow charts (phones) leave out the quadrant names and keep three ticks a side, so the runs have the room
  const { W, H } = dim, narrow = W > 0 && W <= 340, l = narrow ? 38 : 44, b = 40, t = 6, rr = 8;
  const ends = (a: number[], d: [number, number]) => narrow && a.length > 3 ? [a[0], (d[0] + d[1]) / 2, a[a.length - 1]] : a;
  const xt = ends(xTicks, xDomain), yt = ends(yTicks, yDomain);
  const X = (v: number) => l + (v - xDomain[0]) / (xDomain[1] - xDomain[0]) * (W - l - rr), Y = (v: number) => t + (1 - (v - yDomain[0]) / (yDomain[1] - yDomain[0])) * (H - t - b);
  const sMin = Math.min(...runs.map(r => r.size)), sMax = Math.max(...runs.map(r => r.size));
  const R = (r: ScatterRun) => (3 + (r.size - sMin) / Math.max(1, sMax - sMin) * 4.5) * (narrow ? .85 : 1);
  const si = (k: string) => Math.max(0, series.findIndex(s => s.key === k));
  const colorOf = (k: string) => series[si(k)]?.color ?? PAL[si(k) % PAL.length];
  const shapeOf = (k: string) => series[si(k)]?.shape ?? SHAPES[si(k) % SHAPES.length];
  const shown = runs.map((_, i) => i).filter(i => !off.includes(runs[i].series));
  const mx = median(shown.map(i => runs[i].x)), my = median(shown.map(i => runs[i].y));
  const near = (px: number, py: number) => { let best = -1, bd = 26 * 26; shown.forEach(i => { const dx = X(runs[i].x) - px, dy = Y(runs[i].y) - py, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } }); return best; };
  const local = (e: React.PointerEvent) => { const r = pl.current!.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const order = [...shown].sort((a, c) => runs[a].x - runs[c].x || runs[c].y - runs[a].y);
  const ask = async () => {
    if (!onAsk) return; const id = ++asked.current, ps = runs.filter(r => sel.includes(r.id));
    setAnswer({ text: '', busy: true }); const text = await onAsk(ps); if (id !== asked.current) return;
    const ws = text.split(' ');
    for (let i = 1; i <= ws.length; i++) { if (id !== asked.current) return; setAnswer({ text: ws.slice(0, i).join(' '), busy: false }); await new Promise(r => setTimeout(r, 45)); }
  };
  const hr = hot >= 0 ? runs[hot] : null;
  const ps = runs.filter(r => sel.includes(r.id));
  const ttX = hr && tt.current ? Math.max(tt.current.offsetWidth / 2, Math.min(W - tt.current.offsetWidth / 2, X(hr.x))) : 0;
  return (
    <div data-dm="" className={cx('dm-cvq dm-panel', className)}>
      <div className="dm-cvq-h">
        <div className="dm-cvq-t"><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div>
        <div className="dm-cvq-lg">{series.map(s => (
          <button type="button" key={s.key} className="dm-cvq-k" aria-pressed={!off.includes(s.key)}
            onClick={() => { if (!off.includes(s.key) && off.length === series.length - 1) return; setHot(-1); setOff(o => o.includes(s.key) ? o.filter(k => k !== s.key) : [...o, s.key]); }}>
            <svg viewBox="-6 -6 12 12" style={{ fill: colorOf(s.key) }} aria-hidden="true"><Mark shape={shapeOf(s.key)} x={0} y={0} s={4.5} /></svg>{s.label}
          </button>))}</div>
      </div>
      <div ref={pl} className="dm-cvq-pl" tabIndex={0} role="group" aria-roledescription="scatter chart" aria-label={`${title}. Arrow keys step through the runs`}
        onPointerDown={e => { if (e.button) return; const [x, y] = local(e); drag.current = { x, y, id: e.pointerId, moved: false }; }}
        onPointerMove={e => {
          const [x, y] = local(e), d = drag.current;
          if (d && (d.moved || Math.abs(x - d.x) + Math.abs(y - d.y) > 5)) { if (!d.moved) { d.moved = true; pl.current!.setPointerCapture(d.id); setHot(-1); } setBox([d.x, d.y, Math.max(l, Math.min(W - rr, x)), Math.max(t, Math.min(H - b, y))]); return; }
          if (e.pointerType !== 'touch') setHot(near(x, y));
        }}
        onPointerUp={() => { const d = drag.current; drag.current = null; if (!d) return;
          if (d.moved && box) { const [a, b2, x2, y2] = box, lo = Math.min(a, x2), hi = Math.max(a, x2), top = Math.min(b2, y2), bot = Math.max(b2, y2);
            setSel(shown.filter(i => X(runs[i].x) >= lo && X(runs[i].x) <= hi && Y(runs[i].y) >= top && Y(runs[i].y) <= bot).map(i => runs[i].id)); }
          else if (hot < 0 && sel.length) { setSel([]); setBox(null); } }}
        onPointerCancel={() => { drag.current = null; setBox(null); }}
        onPointerLeave={() => { if (!drag.current && document.activeElement !== pl.current) setHot(-1); }}
        onBlur={() => setHot(-1)}
        onKeyDown={e => {
          let k = order.indexOf(hot);
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') k = Math.min(order.length - 1, k + 1); else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') k = Math.max(0, k - 1);
          else if (e.key === 'Home') k = 0; else if (e.key === 'End') k = order.length - 1;
          else if (e.key === 'Escape' && sel.length) { setSel([]); setBox(null); return; } else return;
          e.preventDefault(); setHot(order[k]);
        }}>
        {W > 0 && <svg className="dm-cvq-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          {/* a few light gridlines and quiet tick labels; the axis titles sit well clear of the ticks */}
          {yt.map(v => <g key={v}><line className="dm-gl" x1={l} x2={W - rr} y1={Y(v)} y2={Y(v)} /><text x={l - 6} y={Y(v) + 3.5} textAnchor="end">{v}</text></g>)}
          {xt.map((v, i) => <text key={v} x={X(v)} y={H - b + 15} textAnchor={i === 0 ? 'start' : i === xt.length - 1 ? 'end' : 'middle'}>{formatX(v)}</text>)}
          <line className="dm-ax" x1={l} x2={W - rr} y1={H - b} y2={H - b} />
          <text className="dm-at" x={W - rr} y={H - 1} textAnchor="end">{xTitle}</text>
          <text className="dm-at" x={-t} y={9} transform="rotate(-90)" textAnchor="end">{yTitle}</text>
          <line className="dm-md" x1={X(mx)} x2={X(mx)} y1={t} y2={H - b} /><line className="dm-md" x1={l} x2={W - rr} y1={Y(my)} y2={Y(my)} />
          {!narrow && <><text className="dm-q" x={l + 6} y={t + 11}>{quadrants[0]}</text><text className="dm-q" x={W - rr - 4} y={t + 11} textAnchor="end">{quadrants[1]}</text>
          <text className="dm-q" x={W - rr - 4} y={H - b - 6} textAnchor="end">{quadrants[2]}</text><text className="dm-q" x={l + 6} y={H - b - 6}>{quadrants[3]}</text></>}
          {runs.map((r, i) => <g key={r.id} className={cx('dm-d', off.includes(r.series) && 'dm-off', hr && hr.series !== r.series && !off.includes(r.series) && 'dm-dim', i === hot && 'dm-on', sel.includes(r.id) && 'dm-sel')} style={{ fill: colorOf(r.series) }}>
            <Mark shape={shapeOf(r.series)} x={+X(r.x).toFixed(1)} y={+Y(r.y).toFixed(1)} s={+R(r).toFixed(1)} /></g>)}
          {runs.filter(r => ringed.includes(r.id) && !off.includes(r.series)).map(r => <circle key={r.id} className="dm-ring" cx={X(r.x)} cy={Y(r.y)} r={R(r) + 6} />)}
          {box && <rect className="dm-box" x={Math.min(box[0], box[2])} y={Math.min(box[1], box[3])} width={Math.abs(box[2] - box[0])} height={Math.abs(box[3] - box[1])} rx={3} />}
        </svg>}
        <div ref={tt} className={cx('dm-cvq-tt', hr && 'dm-on')} style={hr ? { left: ttX, top: Y(hr.y) - R(hr) } : undefined}>
          {hr && <><b className="dm-num">{formatX(hr.x)} · {formatY(hr.y)}</b><span>Run {hr.id}, {series[si(hr.series)]?.label}, {formatSize(hr.size)}</span></>}
        </div>
      </div>
      <div className="dm-cvq-ft" aria-live="polite">
        {hr && document.activeElement === pl.current
          ? <span className="dm-cvq-msg"><span><b>Run {hr.id}</b>, {series[si(hr.series)]?.label}: {formatX(hr.x)}, {formatY(hr.y)}, {formatSize(hr.size)}. {order.indexOf(hot) + 1} of {order.length}</span></span>
          : answer ? <span className="dm-cvq-msg"><Icon name="spark" size="xs" /><span className={answer.busy ? 'dm-shim' : undefined}>{answer.busy ? `Looking at ${ps.length} runs` : answer.text}</span></span>
          : ps.length ? <><span className="dm-cvq-msg"><span><b>{ps.length} runs selected</b>, {formatX(ps.reduce((a, r) => a + r.x, 0) / ps.length)} and {formatY(ps.reduce((a, r) => a + r.y, 0) / ps.length)} on average</span></span>
              {onAsk && <button type="button" className="dm-pill dm-soft dm-sm" onClick={ask}><Icon name="spark" size="xs" />Ask the agent why</button>}</>
          : <span className="dm-cvq-msg"><Icon name="spark" size="xs" /><span>{note ?? <>Medians split the runs: <b>{formatX(mx)}</b> and <b>{formatY(my)}</b>. Drag across the chart to select runs.</>}</span></span>}
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
- [Activity heatmap](https://designme.dev/components/activity-heatmap.md): When the agent and the team were busy, by day and hour.
- [Stat cards](https://designme.dev/components/stat-cards.md): Four headline numbers with sparklines and a period switch.
- [Account table](https://designme.dev/components/account-table.md): Customer accounts with health, plan and an agent note per row.

All components: https://designme.dev/llms.txt
