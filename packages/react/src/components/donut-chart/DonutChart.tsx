'use client';
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useReducedMotion } from '../../lib/hooks';
import { enter } from '../../lib/motion';
import '../../designme.css';
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
