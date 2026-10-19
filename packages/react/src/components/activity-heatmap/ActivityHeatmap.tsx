'use client';
import { useEffect, useState, type CSSProperties } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useReducedMotion } from '../../lib/hooks';
import { Seg, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
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
const hour = (h: number) => (h % 12 || 12) + (h < 12 ? 'am' : 'pm');
const shade = (a: number): CSSProperties => ({ ['--dm-a' as string]: a });

/** When the agent or the team is busy, by day and hour. The cells fill in as a wave from the top left. */
export function ActivityHeatmap({ series, value, defaultValue, onValueChange, title = 'Activity', period = 'Last 4 weeks', className }: ActivityHeatmapProps) {
  const [key, setKey] = useControllable(value, defaultValue ?? series[0]?.key ?? '', onValueChange);
  const s = series.find(x => x.key === key) ?? series[0];
  const reduce = useReducedMotion();
  // the cells start empty and fill in a moment after the card appears
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 150); return () => clearTimeout(t); }, []);

  return (
    <div data-dm="" className={cx('dm-hmx dm-panel', className)}>
      <div className="dm-hmx-h">
        <div><b>{title}</b><Swap className="dm-muted dm-hmx-st">{drawn ? s?.note ?? period : period}</Swap></div>
        {series.length > 1 && <Seg className="dm-hmx-sg" label="Who" value={key} onChange={setKey} options={series.map(x => ({ value: x.key, label: x.label }))} />}
      </div>
      <div className="dm-hmx-wrap">
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
      </div>
      <div className="dm-hmx-f dm-muted" aria-hidden="true">{['12am', '6am', '12pm', '6pm'].map(t => <span key={t} className="dm-hmx-ax">{t}</span>)}</div>
      <div className="dm-hmx-lg dm-muted" aria-hidden="true">Less{LEGEND.map(a => <i key={a} style={shade(a)} />)}More</div>
    </div>
  );
}
