'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useTween } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { enter, Seg, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './stat-cards.css';

export interface StatCardsValue {
  /** The number in large type, which rolls to it */
  value: number;
  /** Change against the period before, in percent. Its chip is green when the change is good news and red when it isn't
      (see `lowerIsBetter`) */
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
  /** The sparkline's colour, any CSS colour. Defaults to the chart palette: the accent for the first card, then violet, green and orange */
  color?: string;
  /** For a number that is better when it falls, like spend: its chip turns green as it falls and red as it rises */
  lowerIsBetter?: boolean;
}

export interface StatCardsPeriod {
  /** The switch label, like "30 days" */
  label: string;
  /** What the change is measured against, like "vs previous 30 days": shown when you point at the change chip, and read
      after the number by screen readers */
  compare?: string;
}

export interface StatCardsProps {
  /** What the numbers are about, like "Workspace": on the left of the head, on one line with the period switch */
  title?: ReactNode;
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
  const spark = useRef<SVGSVGElement>(null), gid = 'dm-scx-' + useId().replace(/:/g, '');
  useEffect(() => {
    const el = spark.current; if (!el || !el.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const a = el.animate([{ clipPath: 'inset(-4px 100% -4px 0)' }, { clipPath: 'inset(-4px 0% -4px 0)' }], { duration: 1000, delay: 300 + index * 70, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'backwards' });
    return () => a.cancel();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // the chip: green when the change is good news, red when it isn't, with a true minus sign; pointing at it says what it is
  // measured against. The card isn't a button, so pointing at the card itself changes nothing
  const good = stat.lowerIsBetter ? v.change <= 0 : v.change >= 0;
  const text = (v.change > 0 ? '+' : v.change < 0 ? '\u2212' : '') + Math.abs(v.change) + '%';
  return (
    <div className={cx('dm-scx-c dm-panel', entering)} style={style}>
      <span className="dm-scx-k"><span className="dm-ic"><Icon name={stat.icon} size="xs" /></span>{stat.label}</span>
      <div className="dm-scx-v">
        <b className="dm-num">{(stat.prefix ?? '') + Math.round(shown).toLocaleString('en-US') + (stat.suffix ?? '')}</b>
        <Tip label={compare ?? ''} off={!compare || !drawn}>
          <Swap className={cx('dm-scx-d dm-num', drawn && cx('dm-tag', good ? 'dm-ok' : 'dm-bad', v.change >= 0 ? 'dm-up' : 'dm-dn'))}>{drawn ? text : ''}</Swap>
        </Tip>
        {compare && <span className="dm-scx-sr">{compare}</span>}
      </div>
      <div className="dm-scx-sp">
        {/* the line and, under it, the area down to the axis, which Clean fills with the line's colour fading to nothing */}
        <svg ref={spark} viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true" style={{ color: stat.color ?? `var(--dm-c${index % 6 + 1})` }}>
          <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".22" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
          <path className="dm-ar" style={{ fill: `url(#${gid})` }} d={(drawn ? d : FLAT) + ' L100 30 L0 30 Z'} />
          <path className="dm-ln" stroke={stat.color ?? `var(--dm-c${index % 6 + 1})`} d={drawn ? d : FLAT} />
        </svg>
      </div>
    </div>
  );
}

/** A row of numbers with their change and a sparkline. Switch the period and they roll to the new values. */
export function StatCards({ title, stats, periods, period, defaultPeriod = 0, onPeriodChange, sparkRange, className }: StatCardsProps) {
  const [at, setAt] = useControllable(period, defaultPeriod, onPeriodChange);
  // the numbers roll up and the lines draw a moment after the cards come in
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 200); return () => clearTimeout(t); }, []);

  return (
    <div data-dm="" className={cx('dm-scx', className)}>
      {(title != null || periods.length > 1) && (
        <div className="dm-scx-h">
          {title != null && <b className="dm-scx-t">{title}</b>}
          {periods.length > 1 && <Seg className="dm-scx-sg" label="Period" value={String(at)} onChange={v => setAt(+v)} options={periods.map((p, i) => ({ value: String(i), label: p.label }))} />}
        </div>
      )}
      <div className="dm-scx-grid">
        {stats.map((s, i) => <Card key={s.key ?? s.label} stat={s} index={i} period={at} compare={periods[at]?.compare} drawn={drawn} range={sparkRange} />)}
      </div>
    </div>
  );
}
