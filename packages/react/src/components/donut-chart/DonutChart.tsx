'use client';
import { useStagger } from '../../lib/chart';
import { cx } from '../../lib/cx';
import { useControllable, useTween } from '../../lib/hooks';
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
