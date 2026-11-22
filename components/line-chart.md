# Line chart

> Today so far and projected, against yesterday, with a range switch, a project picker, toggles and a readout.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/line-chart

## Install

```sh
npx designme add line-chart          # HTML, CSS and JS, with the shared core
npx designme add line-chart --react  # React 19 component and its CSS
npx designme add line-chart --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/line-chart.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/line-chart.json  # Astro
```

## About

A line chart that shows one metric over a period against the period before, such as active editors today against yesterday. The main series is a solid line in the accent with a fill that fades to nothing at the bottom, up to the latest point, where an open ring sits with "Now" under it; from there a projection carries it to the period's end as a dotted line in the same colour over a fainter fill, so the chart always runs full width. The comparison runs across the whole period as a dotted line in the chart palette's second colour. A legend under the plot turns each line on and off, and a readout card follows the pointer or the arrow keys. In an agent product it suits a usage or growth metric on a dashboard.

### When to use it

- When you want to show how a period is going so far, and where it is heading, against the same period before.
- When people switch between a few ranges, like a day, a week and a month, or between a few projects or teams.
- When people need exact values at each point without a full analytics tool.

### What it does

- Straight segments with sharp corners, drawn in pixels so the line, its dots and the dashed gridlines stay crisp at any width.
- The values sit on the left, from zero to a round top a little over the highest value, with dashed vertical gridlines and no horizontal ones.
- After `now` the main series is projected to the last point: pass `projected` with your own values, or leave it out and the value at `now` is carried forward along the comparison's shape (held level when there is none). `false` draws no projection.
- Pointing at the plot, tapping it or using the arrow keys on it shows a dashed guide, a ring on each line, and a card beside the guide (on the side with room) with the point's name and each line's swatch, label and value; past now the main row reads as the projection. The point's short name becomes a grey chip on the axis.
- The legend under the plot names the main line, the projection and the comparison, and turns each on and off (one always stays on); `visible` and `onVisibleChange` let you control it.
- `sources` adds a picker beside the title (a mark and a name, opening a menu), and `ranges` adds a Day, Week and Month style switch; `data` can be a function of the picked source and range.
- The lines draw in from the left when the chart appears and again after each pick. `grid`, `format`, `formatAxis` and `projectedLabel` control the gridlines, how values read and what the projection is called.
- In Clean the title, picker and switch sit on an off-white head strip and the legend's toggles on a foot strip, as flat pills (a stronger fill while a line is shown); the readout is Clean's popover. In Clean dark the accent is white, so the main line, its projection and "Now" are white.

### Accessibility

- The plot is one focusable group with a label; the arrow keys, Home and End move through the points, Escape hides the readout, and each move is announced in a polite live region, naming the projection past now.
- A visually hidden table lists every point with the main series, the projection and the comparison, so a screen reader can read all the values.
- The picker is a menu button with radio items, the range switch and the legend are pressed buttons, and the drawing itself is aria-hidden.
- With reduced motion the lines appear without drawing in.

## Usage in React

```tsx
import { LineChart } from '@/components/designme/line-chart/LineChart';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: active editors on a project, today against yesterday,
// this week against last week, or this month against last month.
import { LineChart, type LineChartView } from './LineChart';

const PROJECTS = [{ key: 'web', label: 'Website', size: 1 }, { key: 'app', label: 'Mobile app', size: .58 }, { key: 'docs', label: 'Docs', size: .27 }];
const HOURS = Array.from({ length: 24 }, (_, h) => (h % 12 || 12) + (h < 12 ? 'am' : 'pm'));
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const NOV = Array.from({ length: 30 }, (_, d) => 'Nov ' + (d + 1));
// it is 2pm on Thursday 19 November. November starts on a Sunday and October on a Thursday
const RANGES: Record<string, { points: string[]; ticks?: string[]; now: number; main: string; compare: string; grid: number[]; a: number[]; b: number[]; ka: number; kb: number }> = {
  day: { points: HOURS, now: 14, main: 'Today', compare: 'Yesterday', grid: [1, 2, 3, 4, 6, 12], ka: 1.05, kb: .93,
    a: [110, 80, 64, 58, 62, 96, 210, 460, 820, 1120, 1290, 1360, 1180, 1260, 1330, 1250, 1130, 960, 720, 510, 360, 260, 190, 140], b: [] },
  week: { points: DAYS, ticks: DAYS.map(d => d.slice(0, 3)), now: 3, main: 'This week', compare: 'Last week', grid: [1], ka: 1.04, kb: .92,
    a: [4380, 4720, 4610, 4890, 4420, 1680, 1240], b: [] },
  month: { points: NOV, now: 18, main: 'This month', compare: 'Last month', grid: [1, 7, 14], ka: 1.02, kb: .95,
    a: NOV.map((_, d) => d % 7 === 0 || d % 7 === 6 ? 1500 : 4500), b: NOV.map((_, d) => (4 + d) % 7 === 0 || (4 + d) % 7 === 6 ? 1450 : 4400) }
};
// a small seeded wobble, so each project's numbers differ but are the same on every visit
const wob = (s: number, i: number) => { const x = Math.sin(s * 91.7 + i * 12.9898) * 43758.5453; return x - Math.floor(x) - .5; };

function projectMonth(g: (typeof RANGES)[string], p: number, size: number) {
  const now = Math.round(g.a[g.now] * g.ka * size * (1 + wob(p + 1, g.now) * .14)), shape = g.a.map((v, i) => v * (1 + wob(p + 13, i) * .06));
  return shape.slice(g.now).map(v => Math.round(now * v / shape[g.now]));
}

function view({ source, range }: { source: string; range: string }): LineChartView {
  const g = RANGES[range], p = PROJECTS.findIndex(x => x.key === source), size = PROJECTS[p].size;
  return {
    points: g.points, ticks: g.ticks, now: g.now, grid: g.grid,
    main: { label: g.main, values: g.a.slice(0, g.now + 1).map((v, i) => Math.round(v * g.ka * size * (1 + wob(p + 1, i) * .14))) },
    compare: { label: g.compare, values: (g.b.length ? g.b : g.a).map((v, i) => Math.round(v * g.kb * size * (1 + wob(p + 7, i) * .14))) },
    // the rest of the month is projected along its own weekdays (October's weekends fall on other dates); the day and the week
    // take the chart's default, the latest value carried forward along the comparison's shape
    projected: g.b.length ? projectMonth(g, p, size) : undefined
  };
}

export default function LineChartDemo() {
  return (
    <div style={{ width: '100%' }}>
      <LineChart title="Active editors" sources={PROJECTS.map(({ key, label }) => ({ key, label }))} sourceLabel="Project"
        ranges={[{ key: 'day', label: 'Day' }, { key: 'week', label: 'Week' }, { key: 'month', label: 'Month' }]} pointName="Point" data={view} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | The quiet title at the head's start, like "Active editors" |
| `sources` (optional) | `LineChartOption[]` | What the picker beside the title chooses between, like projects. Leave it out for no picker |
| `source` (optional) | `string` | Key of the picked source. Leave it out to let the picker change it |
| `defaultSource` (optional) | `string` |  |
| `onSourceChange` (optional) | `(key: string) => void` |  |
| `sourceLabel` (optional) | `string` | Names the picker for screen readers, like "Project" |
| `ranges` (optional) | `{ key: string; label: string }[]` | The range switch's options, like Day, Week and Month. Leave it out for no switch |
| `range` (optional) | `string` |  |
| `defaultRange` (optional) | `string` |  |
| `onRangeChange` (optional) | `(key: string) => void` |  |
| `data` | `LineChartView \| ((pick: { source: string; range: string }) => LineChartView)` | What to draw: one view, or a function that gives the view for the picked source and range |
| `nowLabel` (optional) | `string` | Under the latest point. Defaults to "Now" |
| `projectedLabel` (optional) | `string` | Names the projection in the legend and the readout. Defaults to "Projected" |
| `pointName` (optional) | `string` | Heads the first column of the screen reader table, like "Hour" |
| `visible` (optional) | `LineChartLine[]` | Which lines show. Leave it out to let the legend under the plot turn each on and off; one always stays on |
| `defaultVisible` (optional) | `LineChartLine[]` |  |
| `onVisibleChange` (optional) | `(lines: LineChartLine[]) => void` |  |
| `format` (optional) | `(n: number) => string` | Writes a value in the readout. Defaults to whole numbers like 1,240 |
| `formatAxis` (optional) | `(n: number) => string` | Writes the values on the left. Defaults to short numbers like 1.5k |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import LineChart from '../components/designme/line-chart/LineChart.astro';
---
<LineChart />
<LineChart data-style="soft" class="my-class" />
```
It plays its demo; change `line-chart.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I switch the data when someone picks a range or a source?**

Pass `data` as a function: it gets `{ source, range }` and returns the view to draw (`points`, `main`, `compare` and so on). Or control `source` and `range` yourself and pass the matching view.

**Where does the projection come from?**

From `projected` when you pass it: one value per point from `now` to the last. Otherwise the chart takes the value at `now` and follows the comparison's shape from there, so if yesterday fell by a third after 2pm, so does the projection. Pass `projected: false` to stop the line at now.

**Can I leave out the comparison?**

Yes. Without `compare` the chart draws the main line and its projection (held at the latest value unless you pass `projected`), and the readout has one row.

**What if the period is over?**

Leave out `now`, or set it to the last point. The line runs to the right edge with no projection, its ring sits on the last point and the axis ends with "Now" (or your `nowLabel`, like "Today").

**Can I hide the picker or the range switch?**

Leave out `sources` for no picker and `ranges` for no switch; the title stays.

## Source

`LineChart.tsx`, as `npx designme add line-chart --react` installs it:

```tsx
'use client';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { formatCount } from '../lib/chart';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Seg } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './line-chart.css';

export interface LineChartSeries {
  /** Names the series in the readout, like "Today" */
  label: string;
  /** One value per point, oldest first. The main series may stop at `now` */
  values: number[];
}

export interface LineChartView {
  /** Names each point in the readout's head and the screen reader table, like "2pm" or "Thursday" */
  points: string[];
  /** Shorter names for the axis and the chip under the point read, like "Thu". Defaults to `points` */
  ticks?: string[];
  /** Index of the latest point: the solid line ends there with a ring and "Now" under it, and the projection carries on to the
      last point. Defaults to the last point */
  now?: number;
  /** The main series: a solid line in the accent with a fill that fades to nothing at the bottom */
  main: LineChartSeries;
  /** The series to compare against, like yesterday: a dotted line in the chart palette's second colour across every point */
  compare?: LineChartSeries;
  /** The rest of the main series after `now`, so the chart runs to the period's end: a dotted line in the main colour over a fill at
      half strength, one value per point from `now` to the last. Left out, the value at `now` is carried forward along the
      comparison's shape (held level without one); false draws none */
  projected?: number[] | false;
  /** How many points a gridline may fall every, smallest first; the chart takes the first that keeps them about 40px apart. Defaults to [1, 2, 3, 4, 6, 12] */
  grid?: number[];
}

export interface LineChartOption {
  key: string;
  /** On the picker and in its menu, like "Website" */
  label: string;
  /** A letter or two on the option's mark, like "W". Defaults to the label's first letter */
  mark?: string;
  /** The mark's fill and its letter's colour. Default to the avatar colours, in order */
  color?: string;
  ink?: string;
}

export type LineChartLine = 'main' | 'projected' | 'compare';

export interface LineChartProps {
  /** The quiet title at the head's start, like "Active editors" */
  title: string;
  /** What the picker beside the title chooses between, like projects. Leave it out for no picker */
  sources?: LineChartOption[];
  /** Key of the picked source. Leave it out to let the picker change it */
  source?: string;
  defaultSource?: string;
  onSourceChange?: (key: string) => void;
  /** Names the picker for screen readers, like "Project" */
  sourceLabel?: string;
  /** The range switch's options, like Day, Week and Month. Leave it out for no switch */
  ranges?: { key: string; label: string }[];
  range?: string;
  defaultRange?: string;
  onRangeChange?: (key: string) => void;
  /** What to draw: one view, or a function that gives the view for the picked source and range */
  data: LineChartView | ((pick: { source: string; range: string }) => LineChartView);
  /** Under the latest point. Defaults to "Now" */
  nowLabel?: string;
  /** Names the projection in the legend and the readout. Defaults to "Projected" */
  projectedLabel?: string;
  /** Heads the first column of the screen reader table, like "Hour" */
  pointName?: string;
  /** Which lines show. Leave it out to let the legend under the plot turn each on and off; one always stays on */
  visible?: LineChartLine[];
  defaultVisible?: LineChartLine[];
  onVisibleChange?: (lines: LineChartLine[]) => void;
  /** Writes a value in the readout. Defaults to whole numbers like 1,240 */
  format?: (n: number) => string;
  /** Writes the values on the left. Defaults to short numbers like 1.5k */
  formatAxis?: (n: number) => string;
  className?: string;
}

const AV = ['b', 'l', 'm', 'p', 't', 'k'];
const shortNum = (n: number) => n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);
// the top of the scale: a round step that gives three or four bands above zero, with a little room over the highest value
const scaleOf = (m: number) => {
  const raw = m / 4 || 1, p = 10 ** Math.floor(Math.log10(raw)), s = [1, 2, 2.5, 5, 10].map(k => k * p).find(k => k >= raw) ?? raw;
  return { step: s, top: Math.max(s, Math.ceil(m * 1.04 / s) * s) };
};

/** One metric over a period against the period before: straight segments, a saturated line with a fading fill up to a ring at
    now, a dotted projection to the period's end, a dotted comparison, and a readout card that follows the pointer or the arrow keys. */
export function LineChart({ title, sources, source, defaultSource, onSourceChange, sourceLabel = 'Source', ranges, range, defaultRange, onRangeChange,
  data, nowLabel = 'Now', projectedLabel = 'Projected', pointName = 'Point', visible, defaultVisible = ['main', 'projected', 'compare'], onVisibleChange, format = formatCount, formatAxis = shortNum, className }: LineChartProps) {
  const [lines, setLines] = useControllable(visible, defaultVisible, onVisibleChange);
  const [src, setSrc] = useControllable(source, defaultSource ?? sources?.[0]?.key ?? '', onSourceChange);
  const [rng, setRng] = useControllable(range, defaultRange ?? ranges?.[0]?.key ?? '', onRangeChange);
  const view = typeof data === 'function' ? data({ source: src, range: rng }) : data;
  const { points, main, compare } = view, ticks = view.ticks ?? points, n = Math.max(1, points.length - 1);
  const now = Math.min(view.now ?? n, main.values.length - 1, n);
  // the projection: from now to the last point, given or carried forward along the comparison's shape
  const given = Array.isArray(view.projected) ? view.projected : null, base = compare?.values[now];
  const proj = points.map((_, j) => j < now || now >= n || view.projected === false ? null
    : given ? given[j - now] ?? null : base && compare ? main.values[now] * compare.values[j] / base : main.values[now]);
  const hasProj = proj.some((v, j) => j > now && v != null);
  const onA = lines.includes('main') || (!compare && !hasProj), onP = hasProj && lines.includes('projected'), onB = !!compare && lines.includes('compare');
  // the legend turns each line on and off; one always stays on
  const toggle = (l: LineChartLine) => { const st: Record<LineChartLine, boolean> = { main: onA, projected: onP, compare: onB };
    if (st[l] && !(Object.keys(st) as LineChartLine[]).some(k => k !== l && st[k])) return; setLines(st[l] ? lines.filter(x => x !== l) : [...lines, l]); };
  const { step, top } = scaleOf(Math.max(...main.values.slice(0, now + 1), ...(compare?.values ?? []), ...proj.filter((v): v is number => v != null)));
  const menu = usePopover();
  const pick = sources?.find(s => s.key === src) ?? sources?.[0];
  const markOf = (o: LineChartOption, i: number) => ({ text: o.mark ?? o.label.slice(0, 1), style: { ['--dm-mk' as string]: o.color ?? `var(--dm-av-${AV[i % AV.length]})`, ['--dm-mk-ink' as string]: o.ink ?? (o.color ? '#fff' : `var(--dm-av-${AV[i % AV.length]}-ink)`) } });

  // the plot's size, so the lines are drawn in pixels: sharp corners, even dots and dashes at any width
  const ch = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useIsoLayoutEffect(() => {
    const el = ch.current; if (!el) return;
    const fit = () => setBox(b => (b.w === el.clientWidth && b.h === el.clientHeight ? b : { w: el.clientWidth, h: el.clientHeight }));
    fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect();
  }, []);
  const W = box.w, H = box.h, xr = W - (now === n ? 6 : 0);
  const X = (i: number) => i / n * xr, Y = (v: number) => H - v / top * H;
  const line = (vs: number[]) => vs.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join('');
  const A = main.values.slice(0, now + 1), P = proj.slice(now).filter((v): v is number => v != null);
  const pLine = P.map((v, j) => `${j ? 'L' : 'M'}${X(now + j).toFixed(1)} ${Y(v).toFixed(1)}`).join('');
  const grid = view.grid ?? [1, 2, 3, 4, 6, 12], k = grid.find(g => g * xr / n >= 40) ?? grid[grid.length - 1];
  const gl: number[] = []; for (let i = 0; i <= n; i += k) gl.push(Math.round(X(i)) + .5);

  // the lines draw in from the left, again whenever the source or the range changes
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  const drawKey = `${src}|${rng}`;
  useEffect(() => {
    if (reduce) { setShown(1); return; }
    let raf = 0; const t0 = performance.now() + (shown === 0 ? 260 : 0);
    setShown(0);
    const f = (t: number) => { const p = Math.max(0, Math.min(1, (t - t0) / 1100)); setShown(p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2); if (p < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf);
  }, [drawKey, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  // the point read: by the pointer, a finger or the arrow keys
  const [at, setAt] = useState<number | null>(null);
  const [said, setSaid] = useState('');
  const i = at == null ? null : Math.min(at, n);
  const idx = (e: PointerEvent<HTMLDivElement>) => { const b = e.currentTarget.getBoundingClientRect(); return Math.max(0, Math.min(n, Math.round((e.clientX - b.left) / (xr || 1) * n))); };
  // up to now a point reads the main series; after now, the projection
  const reading = (j: number) => j > now ? { on: onP, label: projectedLabel, value: proj[j] } : { on: onA, label: main.label, value: main.values[j] };
  const say = (j: number) => { const m = reading(j); setSaid(`${points[j]}: ` + [m.on && m.value != null && `${m.label} ${format(m.value)}`, onB && compare && `${compare.label} ${format(compare.values[j])}`].filter(Boolean).join(', ')); };
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const from = i ?? now;
    const to = ({ ArrowLeft: from - 1, ArrowRight: from + 1, Home: 0, End: n } as Record<string, number>)[e.key];
    if (e.key === 'Escape' && i != null) { e.preventDefault(); setAt(null); return; }
    if (to == null) return;
    e.preventDefault(); const j = Math.max(0, Math.min(n, to)); setAt(j); say(j);
  };

  // the readout beside the guide on the side with room (or over the point on a plot too narrow for either), and the axis labels,
  // placed once they are measured
  const tt = useRef<HTMLDivElement>(null), ax = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const a = ax.current; if (!a || !W) return;
    const lab = (c: string) => a.querySelector<HTMLElement>(c);
    const near = (p: HTMLElement, q: HTMLElement) => p.offsetLeft < q.offsetLeft + q.offsetWidth + 6 && q.offsetLeft < p.offsetLeft + p.offsetWidth + 6;
    const put = (el: HTMLElement | null, x: number) => { if (el) el.style.left = Math.max(0, Math.min(xr - el.offsetWidth, x - el.offsetWidth / 2)) + 'px'; };
    const first = lab('.dm-lnx-a'), last = lab('.dm-lnx-z'), nw = lab('.dm-lnx-nw:not(.dm-lnx-z)'), tk = lab('.dm-lnx-tk');
    put(nw, X(now));
    // the first and last labels step aside for Now, and every label for the chip of the point read
    const hid = (l: HTMLElement) => l !== nw && !!nw && near(l, nw);
    if (tk && i != null) put(tk, X(i));
    [first, last, nw].forEach(l => l && l.classList.toggle('dm-lnx-off', hid(l) || (!!tk && i != null && near(l, tk))));
    const t = tt.current; if (!t || i == null) return;
    const m = reading(i), has = m.on && m.value != null, x = X(i), w = t.offsetWidth, h = t.offsetHeight, gap = 12, py = Y(has ? m.value ?? 0 : compare?.values[i] ?? 0);
    const side = x + gap + w <= W ? x + gap : x - gap - w >= 0 ? x - gap - w : null;
    t.style.left = (side ?? Math.max(0, Math.min(W - w, x - w / 2))) + 'px';
    t.style.top = (side != null ? Math.max(0, Math.min(H - h, py - h / 2)) : py - gap - h >= -8 ? py - gap - h : py + gap) + 'px';
  });

  const ids = useId().replace(/[^\w-]/g, '');
  const what = `${title}${pick ? ' on ' + pick.label : ''}`;
  return (
    <div data-dm="" className={cx('dm-lnx dm-panel', i != null && 'dm-on', !onA && 'dm-lnx-noa', !onP && 'dm-lnx-nop', !onB && 'dm-lnx-nob', className)}>
      <div className="dm-lnx-h">
        <div className="dm-lnx-tl">
          <span className="dm-lnx-t">{title}</span>
          {sources && pick && (
            <button type="button" className="dm-lnx-pk" {...menu.trigger} aria-label={`${sourceLabel}: ${pick.label}`}>
              {(() => { const m = markOf(pick, sources.indexOf(pick)); return <span className="dm-lnx-mk" style={m.style} aria-hidden="true">{m.text}</span>; })()}
              <span className="dm-lnx-pn">{pick.label}</span><Icon name="chev-d" size="xs" />
            </button>
          )}
        </div>
        {ranges && ranges.length > 1 && <Seg className="dm-lnx-rg" label="Range" value={rng} onChange={setRng} options={ranges.map(r => ({ value: r.key, label: r.label }))} />}
      </div>
      {sources && (
        <div {...menu.pop} className={cx(menu.pop.className, 'dm-lnx-pp')} role="menu" aria-label={sourceLabel}>
          {sources.map((o, j) => { const m = markOf(o, j); return (
            <button key={o.key} type="button" className="dm-mi" role="menuitemradio" aria-checked={o.key === src} onClick={() => { if (o.key !== src) setSrc(o.key); menu.closeSoon(); }}>
              <span className="dm-lnx-mk" style={m.style} aria-hidden="true">{m.text}</span><span>{o.label}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
            </button>
          ); })}
        </div>
      )}
      <div className="dm-lnx-pl">
        <div className="dm-lnx-y dm-num" aria-hidden="true">{Array.from({ length: top / step + 1 }, (_, j) => <span key={j}>{formatAxis(top - j * step)}</span>)}</div>
        <div className="dm-lnx-ch" ref={ch} tabIndex={0} role="group" aria-roledescription="line chart" aria-label={`${what}. The arrow keys read each point`}
          onPointerMove={e => setAt(idx(e))} onPointerDown={e => setAt(idx(e))}
          onPointerLeave={e => { if (e.pointerType !== 'touch' && !e.currentTarget.matches(':focus-visible')) setAt(null); }}
          onFocus={e => { if (e.currentTarget.matches(':focus-visible')) { setAt(now); say(now); } }} onBlur={() => setAt(null)} onKeyDown={key}>
          <svg className="dm-lnx-svg" viewBox={`0 0 ${W || 1} ${H || 1}`} aria-hidden="true">
            <defs>
              <linearGradient id={ids + 'g'} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" style={{ stopColor: 'var(--dm-lnx-line)', stopOpacity: 'var(--dm-lnx-fill)' }} />
                <stop offset="1" style={{ stopColor: 'var(--dm-lnx-line)', stopOpacity: 0 }} />
              </linearGradient>
              <linearGradient id={ids + 'p'} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" style={{ stopColor: 'var(--dm-lnx-line)', stopOpacity: 'var(--dm-lnx-pfill)' }} />
                <stop offset="1" style={{ stopColor: 'var(--dm-lnx-line)', stopOpacity: 0 }} />
              </linearGradient>
              <clipPath id={ids + 'c'}><rect x="-8" y="-8" height={H + 16} width={(W + 16) * shown} /></clipPath>
            </defs>
            {W > 0 && gl.map(x => <line key={x} className="dm-gl" x1={x} x2={x} y1="0" y2={H} />)}
            {W > 0 && (
              <g clipPath={`url(#${ids}c)`}>
                {compare && <path className="dm-cmp" d={line(compare.values)} />}
                {P.length > 1 && <path className="dm-par" d={`${pLine}L${X(now + P.length - 1).toFixed(1)} ${H}L${X(now).toFixed(1)} ${H}Z`} fill={`url(#${ids}p)`} />}
                <path className="dm-ar" d={`${line(A)}L${X(now).toFixed(1)} ${H}L0 ${H}Z`} fill={`url(#${ids}g)`} />
                {P.length > 1 && <path className="dm-prj" d={pLine} />}
                <path className="dm-ln" d={line(A)} />
              </g>
            )}
          </svg>
          <span className="dm-lnx-x" style={i != null ? { left: X(i) } : undefined} />
          {compare && <span className={cx('dm-lnx-pt', i != null && onB && 'dm-on')} style={{ color: 'var(--dm-lnx-cmp)', ...(i != null && { left: X(i), top: Y(compare.values[i]) }) }} />}
          {(() => { const m = i != null ? reading(i) : null; return <span className={cx('dm-lnx-pt', i != null && i !== now && m?.on && m.value != null && 'dm-on')} style={{ color: 'var(--dm-lnx-line)', ...(i != null && m?.value != null && { left: X(i), top: Y(m.value) }) }} />; })()}
          {W > 0 && <span className="dm-lnx-now" style={{ left: X(now), top: Y(A[now]), opacity: shown * (W + 16) - 8 >= X(now) ? 1 : 0 }} />}
          <div className="dm-lnx-tt" ref={tt} aria-hidden="true">
            <div className="dm-lnx-tt-h">{i != null && points[i]}</div>
            {(() => { const m = i != null ? reading(i) : null; return <div className={cx('dm-lnx-tt-r', i != null && i > now && 'dm-p')} hidden={!m?.on || m.value == null}><i /><span>{m?.label}</span><b className="dm-num">{m?.value != null && format(m.value)}</b></div>; })()}
            {compare && <div className="dm-lnx-tt-r dm-c" hidden={!onB}><i /><span>{compare.label}</span><b className="dm-num">{i != null && format(compare.values[i])}</b></div>}
          </div>
        </div>
        <div className="dm-lnx-ax dm-num" ref={ax} aria-hidden="true">
          <span className="dm-lnx-a">{ticks[0]}</span>
          <span className={cx('dm-lnx-z', now === n && 'dm-lnx-nw')}>{now === n ? nowLabel : ticks[n]}</span>
          {now < n && <span className="dm-lnx-nw">{nowLabel}</span>}
          <span className="dm-lnx-tk">{i != null && ticks[i]}</span>
        </div>
      </div>
      {(compare || hasProj) && (
        <div className="dm-lnx-lg">
          <button type="button" className="dm-lnx-k" aria-pressed={onA} onClick={() => toggle('main')}><i /><span>{main.label}</span></button>
          {hasProj && <button type="button" className="dm-lnx-k dm-p" aria-pressed={onP} onClick={() => toggle('projected')}><i /><span>{projectedLabel}</span></button>}
          {compare && <button type="button" className="dm-lnx-k dm-c" aria-pressed={onB} onClick={() => toggle('compare')}><i /><span>{compare.label}</span></button>}
        </div>
      )}
      <p className="dm-lnx-sr" aria-live="polite">{said}</p>
      <div className="dm-lnx-sr"><table>
        <caption>{what}</caption>
        <tbody>
          <tr><th scope="col">{pointName}</th><th scope="col">{main.label}</th>{hasProj && <th scope="col">{projectedLabel}</th>}{compare && <th scope="col">{compare.label}</th>}</tr>
          {points.map((p, j) => { const pv = proj[j]; return <tr key={j}><th scope="row">{p}</th><td>{j <= now ? format(main.values[j]) : ''}</td>{hasProj && <td>{j > now && pv != null ? format(pv) : ''}</td>}{compare && <td>{format(compare.values[j])}</td>}</tr>; })}
        </tbody>
      </table></div>
    </div>
  );
}
```

## More in Charts and tables

- [Bar chart](https://designme.dev/components/bar-chart.md): Weekly agent runs, split by outcome, with a range switch.
- [Donut chart](https://designme.dev/components/donut-chart.md): Where the agent's time went this week, as a gauge against its budget, with a part you can select.
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
