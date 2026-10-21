'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useTween } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { enter, Seg, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './stat-cards.css';

export interface StatCardsValue {
  /** The number in large type, which rolls to it */
  value: number;
  /** Change against the period before, in percent. Green from 0, red below */
  change: number;
  /** The sparkline, oldest first */
  points: number[];
}

export interface StatCardsStat {
  /** Identifies the card. Defaults to its label */
  key?: string;
  icon: IconName;
  /** Like "Agent runs" */
  label: string;
  /** One entry per period, in the same order as `periods` */
  values: StatCardsValue[];
  /** Before the number, like "$" */
  prefix?: string;
  /** After the number, like "h" */
  suffix?: string;
  /** The sparkline's colour, any CSS colour. Defaults to the accent */
  color?: string;
}

export interface StatCardsPeriod {
  /** The switch label, like "30 days" */
  label: string;
  /** Shown when you hover a card, like "vs previous 30 days" */
  compare?: string;
}

export interface StatCardsProps {
  stats: StatCardsStat[];
  periods: StatCardsPeriod[];
  /** The period on show, by index. Leave it out to let the switch pick it */
  period?: number;
  defaultPeriod?: number;
  onPeriodChange?: (period: number) => void;
  /** The values at the bottom and top of every sparkline. Defaults to each card's own lowest and highest point */
  sparkRange?: [number, number];
  className?: string;
}

const FLAT = 'M0 30 L100 30';

function Card({ stat, index, period, compare, drawn, range }: { stat: StatCardsStat; index: number; period: number; compare?: string; drawn: boolean; range?: [number, number] }) {
  const v = stat.values[Math.min(period, stat.values.length - 1)];
  const shown = useTween(drawn ? v.value : 0, 900, 0);
  const all = stat.values.flatMap(x => x.points);
  const [lo, hi] = range ?? [Math.min(...all), Math.max(...all)];
  const d = v.points.map((y, k) => `${k === 0 ? 'M' : 'L'}${(k / Math.max(1, v.points.length - 1) * 100).toFixed(1)} ${(29 - (y - lo) / (hi - lo || 1) * 28).toFixed(1)}`).join(' ');
  const { className: entering, style } = enter(index * 70);
  // the sparkline draws in from the left as its card arrives
  const spark = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = spark.current; if (!el || !el.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const a = el.animate([{ clipPath: 'inset(-4px 100% -4px 0)' }, { clipPath: 'inset(-4px 0% -4px 0)' }], { duration: 1000, delay: 300 + index * 70, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'backwards' });
    return () => a.cancel();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const card = (
    <div className={cx('dm-scx-c dm-panel', entering)} style={style}>
      <span className="dm-scx-k"><span className="dm-ic"><Icon name={stat.icon} size="xs" /></span>{stat.label}</span>
      <div className="dm-scx-v">
        <b className="dm-num">{(stat.prefix ?? '') + Math.round(shown).toLocaleString('en-US') + (stat.suffix ?? '')}</b>
        <Swap className={cx('dm-scx-d dm-num', drawn && (v.change >= 0 ? 'dm-up' : 'dm-dn'))}>{drawn ? (v.change >= 0 ? '+' : '') + v.change + '%' : ''}</Swap>
      </div>
      <div className="dm-scx-sp">
        <svg ref={spark} viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path stroke={stat.color ?? 'var(--dm-accent)'} d={drawn ? d : FLAT} /></svg>
      </div>
    </div>
  );
  return <Tip label={compare ?? ''} off={!compare}>{card}</Tip>;
}

/** A row of numbers with their change and a sparkline. Switch the period and they roll to the new values. */
export function StatCards({ stats, periods, period, defaultPeriod = 0, onPeriodChange, sparkRange, className }: StatCardsProps) {
  const [at, setAt] = useControllable(period, defaultPeriod, onPeriodChange);
  // the numbers roll up and the lines draw a moment after the cards come in
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 200); return () => clearTimeout(t); }, []);

  return (
    <div data-dm="" className={cx('dm-scx', className)}>
      {periods.length > 1 && (
        <div className="dm-scx-h">
          <Seg className="dm-scx-sg" label="Period" value={String(at)} onChange={v => setAt(+v)} options={periods.map((p, i) => ({ value: String(i), label: p.label }))} />
        </div>
      )}
      <div className="dm-scx-grid">
        {stats.map((s, i) => <Card key={s.key ?? s.label} stat={s} index={i} period={at} compare={periods[at]?.compare} drawn={drawn} range={sparkRange} />)}
      </div>
    </div>
  );
}
