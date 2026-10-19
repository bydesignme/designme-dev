'use client';
import { useRef, useState, type PointerEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useTween } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Fold, Seg, Swap, Think, Tip } from '../../lib/motion';
import '../../designme.css';
import './metric-insight.css';

export interface MetricRange {
  /** Identifies the range, like '30' */
  key: string;
  /** The switch label, like "30d" */
  label: string;
  /** The values over the range, oldest first */
  points: number[];
  /** The number in large type, which rolls to it */
  value: number;
  /** The change over the range, in the tag beside it */
  change: number;
  /** One line on what happened, like "Jumped after the pricing page update on Sep 18." */
  insight: string;
  /** A marker on the chart, like a release: `at` is 0 to 1 across, `label` shows on hover */
  marker?: { at: number; label: string };
}

export interface MetricDriver {
  label: string;
  /** Its share of the change, 0 to 100 */
  percent: number;
  /** Any CSS colour, like 'var(--dm-accent)'. Defaults to the accent */
  color?: string;
}

export interface MetricInsightProps {
  /** The metric's name, like "Trial to paid" */
  label: string;
  ranges: MetricRange[];
  /** The range on show, by key. Leave it out to let the switch pick it */
  range?: string;
  defaultRange?: string;
  onRangeChange?: (key: string) => void;
  /** Formats the large number and the hovered point. Defaults to one decimal and a % */
  format?: (value: number) => string;
  /** Formats the change. Defaults to "+8.1 pts" */
  formatChange?: (change: number) => string;
  /** What moved the number, shown under "Why did it move?" */
  drivers?: MetricDriver[];
  /** Shows "Looking into it" on the button and keeps the breakdown shut, while you fetch the drivers */
  explaining?: boolean;
  /** Whether the breakdown is open. Leave it out to let the button toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const pct = (v: number) => v.toFixed(1) + '%';
const pts = (v: number) => (v < 0 ? '−' : '+') + Math.abs(v).toFixed(1) + ' pts';
const W = 300, H = 90;

/** A metric with its trend, a one-line explanation, and a breakdown of what moved it. */
export function MetricInsight({ label, ranges, range, defaultRange, onRangeChange, format = pct, formatChange = pts, drivers, explaining = false, open, defaultOpen = false, onOpenChange, className }: MetricInsightProps) {
  const [key, setKey] = useControllable(range, defaultRange ?? ranges[0]?.key ?? '', onRangeChange);
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const r = ranges.find(x => x.key === key) ?? ranges[0];
  const value = useTween(r?.value ?? 0, 900, 0), change = useTween(r?.change ?? 0, 900, 0);
  const [hover, setHover] = useState<{ x: number; y: number; px: number; py: number; v: number } | null>(null);

  // the chart, scaled to 300 by 90 with a point of room above and below
  const d = r?.points ?? [];
  const lo = Math.min(...d) - 1, hi = Math.max(...d) + 1;
  const xy = d.map((v, i) => [d.length > 1 ? i / (d.length - 1) * W : 0, 86 - (v - lo) / (hi - lo) * 80, v] as const);
  const path = xy.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ');

  // the area and the marker fade in once the metric appears; a range change redraws the line in place
  const chart = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const el = chart.current; if (!el) return;
    void el.offsetWidth;
    const id = requestAnimationFrame(() => el.classList.add('dm-in'));
    return () => cancelAnimationFrame(id);
  }, []);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!xy.length) return;
    const b = e.currentTarget.getBoundingClientRect(), fx = (e.clientX - b.left) / b.width * W;
    let best = xy[0]; xy.forEach(q => { if (Math.abs(q[0] - fx) < Math.abs(best[0] - fx)) best = q; });
    setHover({ x: best[0], y: best[1], px: best[0] / W * b.width, py: best[1] / H * b.height, v: best[2] });
  };

  // the button changes at once when it starts looking, then crossfades to its next label
  const [looks, setLooks] = useState(0);
  const [wasBusy, setWasBusy] = useState(explaining);
  if (explaining !== wasBusy) { setWasBusy(explaining); if (explaining) setLooks(n => n + 1); }
  const shown = isOpen && !explaining && !!drivers?.length;
  const [opened, setOpened] = useState(0);
  const [wasShown, setWasShown] = useState(shown);
  if (shown !== wasShown) { setWasShown(shown); if (shown) setOpened(n => n + 1); }

  return (
    <div data-dm="" className={cx('dm-mix dm-panel', className)}>
      <div className="dm-mix-h">
        <span className="dm-muted">{label}</span>
        <Seg className="dm-mix-rg" label="Range" value={key} onChange={setKey} options={ranges.map(x => ({ value: x.key, label: x.label }))} />
      </div>
      <div className="dm-mix-v">
        <b className="dm-num dm-mix-n">{format(hover ? hover.v : value)}</b>
        <span className={cx('dm-tag dm-mix-d dm-num', (r?.change ?? 0) < 0 ? 'dm-bad' : 'dm-ok')}>{formatChange(change)}</span>
      </div>
      <div className="dm-mix-ch" ref={chart} onPointerMove={move} onPointerLeave={() => setHover(null)}>
        <svg className="dm-mix-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="dm-mixg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--dm-accent)" stopOpacity=".18" /><stop offset="1" stopColor="var(--dm-accent)" stopOpacity="0" /></linearGradient></defs>
          <path className="dm-mix-a" fill="url(#dm-mixg)" d={path && path + ` L${W} ${H} L0 ${H} Z`} />
          <path className="dm-mix-l" fill="none" stroke="var(--dm-accent)" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" d={path} />
          <line className="dm-mix-x" x1={hover?.x ?? 0} x2={hover?.x ?? 0} y1={0} y2={H} stroke="var(--dm-faint)" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="dm-mix-dot" style={hover ? { left: hover.px, top: hover.py } : undefined} />
        {r?.marker && <Marker key={r.key} at={r.marker.at} label={r.marker.label} />}
      </div>
      <div className="dm-mix-ins"><span className="dm-mix-ic"><Icon name="spark" size="xs" /></span><Swap className="dm-mix-t">{r?.insight ?? ''}</Swap></div>
      {drivers && (
        <button type="button" className="dm-pill dm-soft dm-sm dm-mix-why" aria-expanded={shown} onClick={() => { if (!explaining) setOpen(!isOpen); }}>
          {explaining && <Think />}
          <Swap key={looks}>{explaining ? 'Looking into it' : shown ? 'Hide the breakdown' : 'Why did it move?'}</Swap>
        </button>
      )}
      {drivers && (
        <Fold open={shown} className="dm-mix-box">
          <div className="dm-mix-rs" key={opened}>
            {drivers.map((q, i) => {
              const e = enter(i * 60), c = q.color ?? 'var(--dm-accent)';
              return (
                <div key={q.label + i} className={cx('dm-mix-r', e.className)} style={e.style}>
                  <span className="dm-dot" style={{ color: c }} />
                  <span className="dm-t">{q.label}</span>
                  <span className="dm-bar"><i style={{ width: q.percent + '%', background: c }} /></span>
                  <span className="dm-v dm-num">{q.percent}%</span>
                </div>
              );
            })}
          </div>
        </Fold>
      )}
    </div>
  );
}

/** The marker on the chart. It fades in late, after the line, each time a range that has one comes up */
function Marker({ at, label }: { at: number; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // it renders hidden, then lets the stylesheet take over a frame later, so the delayed fade-in runs
  useIsoLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    void el.offsetWidth;
    const id = requestAnimationFrame(() => { el.style.opacity = ''; el.style.transform = ''; });
    return () => cancelAnimationFrame(id);
  }, []);
  return <Tip label={label}><span ref={ref} className="dm-mix-mk" style={{ left: at * 100 + '%', opacity: 0, transform: 'scale(.5)' }}><Icon name="spark" size="xs" /></span></Tip>;
}
