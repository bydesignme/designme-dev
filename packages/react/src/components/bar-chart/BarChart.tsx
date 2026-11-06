'use client';
import { useRef, useState } from 'react';
import { formatCount, useStagger } from '../../lib/chart';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useTween } from '../../lib/hooks';
import { Seg } from '../../lib/motion';
import '../../designme.css';
import './bar-chart.css';

export interface BarChartSeries {
  /** Names the part in the hover readout and, when stacked, in the legend, like "Needed review" */
  label: string;
  /** How the hover readout names it, like "reviewed". Defaults to the label in lower case */
  tipLabel?: string;
  /** When stacked. Defaults to the chart palette: blue, purple, then orange */
  color?: string;
}

export interface BarChartBar {
  /** Under the bar, like "Mon" */
  label: string;
  /** One value per series, stacked from the bottom */
  values: number[];
}

export interface BarChartRange {
  key: string;
  /** On the switch, like "Week" */
  label: string;
  bars: BarChartBar[];
}

export interface BarChartProps {
  /** The name over the big number, like "Agent runs" */
  label: string;
  /** What each part of a bar means, in order. The hover readout breaks each bar down by these */
  series: BarChartSeries[];
  /** Draws each bar as a stack of its parts in the palette's colours, with a legend. Off by default: one bar in the
      accent, with the breakdown in the hover readout */
  stacked?: boolean;
  /** One set of bars per range. With more than one, a switch picks between them */
  ranges: BarChartRange[];
  /** Key of the range shown. Leave it out to let the switch change it */
  range?: string;
  /** Defaults to the first range */
  defaultRange?: string;
  onRangeChange?: (key: string) => void;
  /** What the values count, like "runs" in "66 runs" */
  unit?: string;
  /** Writes a value. Defaults to whole numbers like 1,240 */
  format?: (n: number) => string;
  className?: string;
}

// the colours of a stack's parts, in order
const PALETTE = ['var(--dm-c1)', 'var(--dm-c2)', 'var(--dm-c4)', 'var(--dm-c3)', 'var(--dm-c5)', 'var(--dm-c6)'];

/** Bars that grow in one after another, with a readout on hover that breaks each one down, and a switch between ranges. */
export function BarChart({ label, series, ranges, range, defaultRange, onRangeChange, unit, format = formatCount, stacked = false, className }: BarChartProps) {
  const [cur, setCur] = useControllable(range, defaultRange ?? ranges[0]?.key ?? '', onRangeChange);
  const count = Math.max(0, ...ranges.map(r => r.bars.length));
  // the bars draw a moment after the chart appears, then redraw left to right on every switch
  const at = useStagger(cur, count, 45, 200);
  const byKey = (k: string | null) => ranges.find(r => r.key === k);
  const shown = byKey(at[0]);
  const sum = (b?: BarChartBar) => b ? b.values.reduce((a, v) => a + v, 0) : 0;
  const total = useTween(shown ? shown.bars.reduce((a, b) => a + sum(b), 0) : 0, 900, 0);

  // the room the bars have, less the label under them
  const ch = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState(128);
  useIsoLayoutEffect(() => { if (ch.current) setRoom(ch.current.clientHeight - 22); }, []);
  const color = (j: number) => series[j]?.color ?? PALETTE[j % PALETTE.length];

  return (
    <div data-dm="" className={cx('dm-bcx dm-panel', className)}>
      <div className="dm-bcx-h">
        <div><span className="dm-muted">{label}</span><b className="dm-num dm-bcx-v">{format(total)}</b></div>
        {ranges.length > 1 && (
          <Seg className="dm-bcx-rg" label="Range" value={cur} onChange={setCur} options={ranges.map(r => ({ value: r.key, label: r.label }))} />
        )}
      </div>
      <div className="dm-bcx-ch" ref={ch}>
        {Array.from({ length: count }, (_, i) => {
          const r = byKey(at[i]), bar = r?.bars[i], top = r ? Math.max(...r.bars.map(sum)) * 1.08 : 1;
          const tip = shown?.bars[i];
          return (
            <div key={i} className="dm-bcx-b">
              <div className="dm-bcx-tt">
                <b className="dm-num">{tip && `${format(sum(tip))}${unit ? ' ' + unit : ''}`}</b>
                <span>{tip && tip.values.map((v, j) => `${format(v)} ${series[j]?.tipLabel ?? series[j]?.label.toLowerCase() ?? ''}`).join(', ')}</span>
              </div>
              <div className="dm-bcx-st">
                {stacked ? series.map((_, j) => {
                  const v = bar?.values[j] ?? 0;
                  return <i key={j} style={{ height: bar ? Math.max(v ? 3 : 0, v / top * room) : 0, background: color(j) }} />;
                }) : <i style={{ height: bar ? Math.max(sum(bar) ? 3 : 0, sum(bar) / top * room) : 0 }} />}
              </div>
              <div className="dm-bcx-l">{tip?.label}</div>
            </div>
          );
        })}
      </div>
      {stacked && <div className="dm-bcx-lg dm-muted">{series.map((s, j) => <span key={j}><i style={{ background: color(j) }} />{s.label}</span>)}</div>}
    </div>
  );
}
