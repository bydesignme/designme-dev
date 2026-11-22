'use client';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { formatCount } from '../../lib/chart';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Seg } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
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
