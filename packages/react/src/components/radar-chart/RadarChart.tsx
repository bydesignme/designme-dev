'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useIsoLayoutEffect, useReducedMotion, useTween } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import '../../designme.css';
import './radar-chart.css';

export interface RadarAxis {
  /** Like "Instruction following" */
  label: string;
  /** Shown instead of the label on a narrow card, like "Instructions" */
  short?: string;
  /** This run's score, 0 to 100 */
  value: number;
  /** The baseline's score, 0 to 100 */
  baseline: number;
}

export interface RadarChartProps {
  /** Five to seven axes, clockwise from the top */
  axes: RadarAxis[];
  title?: string;
  subtitle?: string;
  /** The legend's names for the two series */
  seriesLabels?: [string, string];
  /** A score under this is flagged "Weak" (70) */
  weakBelow?: number;
  /** The agent's note under the chart, shown while no axis is pointed at. Defaults to the average and its change */
  note?: ReactNode;
  /** An axis to call out: its label pulses (by index) */
  pulse?: number;
  className?: string;
}

const tween = (ms: number, step: (t: number) => void, reduce: boolean) => new Promise<void>(res => {
  const t0 = performance.now(), f = (t: number) => { const p = Math.min(1, (t - t0) / (reduce ? 1 : ms)); step(1 - Math.pow(1 - p, 3)); if (p < 1) requestAnimationFrame(f); else res(); };
  requestAnimationFrame(f);
});

/** Compares a run with its baseline on a handful of eval scores: the baseline as an outline, this run filled, weak axes flagged in words. */
export function RadarChart({ axes, title = 'Eval scores', subtitle, seriesLabels = ['This run', 'Baseline'], weakBelow = 70, note, pulse, className }: RadarChartProps) {
  const N = axes.length;
  const ch = useRef<HTMLDivElement>(null), labels = useRef<(HTMLButtonElement | null)[]>([]);
  const [size, setSize] = useState({ W: 0, H: 0, side: 92 });
  const [on, setOn] = useState({ cur: true, base: true });
  const [hot, setHot] = useState(-1);
  const [focusAt, setFocusAt] = useState(0);
  const [drawn, setDrawn] = useState(0), [grow, setGrow] = useState(0);
  const reduce = useReducedMotion();
  const mean = (k: 'value' | 'baseline') => Math.round(axes.reduce((t, a) => t + a[k], 0) / N);
  const avg = useTween(grow > 0 ? mean('value') : 0, 1100, 0);
  // the baseline draws itself, then this run grows out of the middle
  useEffect(() => { let live = true; void (async () => {
    await new Promise(r => setTimeout(r, 300)); if (!live) return;
    await tween(900, t => live && setDrawn(t * 100), reduce); await new Promise(r => setTimeout(r, 250));
    await tween(1100, t => live && setGrow(t), reduce);
  })(); return () => { live = false; }; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const narrow = size.W > 0 && size.W < 380;
  useIsoLayoutEffect(() => {
    const el = ch.current; if (!el) return;
    const measure = () => { const side = Math.max(0, ...labels.current.filter((l, i) => l && Math.abs(Math.cos(ang(i))) >= .2).map(l => l!.offsetWidth)); setSize({ W: el.clientWidth, H: el.clientHeight, side }); };
    measure(); const ro = new ResizeObserver(measure); ro.observe(el); return () => ro.disconnect();
  }, [narrow]); // eslint-disable-line react-hooks/exhaustive-deps
  const ang = (i: number) => -Math.PI / 2 + i * 2 * Math.PI / N;
  const { W, H } = size, cxp = W / 2, cyp = H / 2, R = Math.max(40, Math.min(H / 2 - 46, W / 2 - size.side - 14));
  const pt = (i: number, v: number) => [cxp + Math.cos(ang(i)) * R * v / 100, cyp + Math.sin(ang(i)) * R * v / 100];
  const poly = (f: (a: RadarAxis) => number) => axes.map((a, i) => pt(i, f(a)).map(n => n.toFixed(1)).join(',')).join(' ');
  const ro = hot >= 0 ? axes[hot] : null;
  const keys = (e: React.KeyboardEvent) => {
    const i = focusAt, to = ({ ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: N - 1 } as Record<string, number>)[e.key];
    if (to == null) return; e.preventDefault(); const j = (to + N) % N; setFocusAt(j); labels.current[j]?.focus();
  };
  const toggle = (s: 'cur' | 'base') => { const o = s === 'cur' ? 'base' : 'cur'; if (on[s] && !on[o]) return; setOn({ ...on, [s]: !on[s] }); };
  return (
    <div data-dm="" className={cx('dm-rdx dm-panel', className)}>
      <div className="dm-rdx-h">
        <div className="dm-rdx-t"><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div>
        <div className="dm-rdx-lg">
          <button type="button" className="dm-rdx-k" aria-pressed={on.cur} onClick={() => toggle('cur')}><i className="dm-c" />{seriesLabels[0]}</button>
          <button type="button" className="dm-rdx-k" aria-pressed={on.base} onClick={() => toggle('base')}><i className="dm-b" />{seriesLabels[1]}</button>
        </div>
      </div>
      <div ref={ch} className="dm-rdx-ch" role="group" aria-label="Scores by axis. Left and Right move between axes" onKeyDown={keys}
        onPointerLeave={() => { if (!ch.current?.contains(document.activeElement)) setHot(-1); }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHot(-1); }}>
        {W > 0 && <svg className="dm-rdx-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          {[25, 50, 75, 100].map(v => <polygon key={v} className={cx('dm-ring', v === 100 && 'dm-out')} points={axes.map((_, i) => pt(i, v).join(',')).join(' ')} />)}
          {axes.map((_, i) => { const [x, y] = pt(i, 100); return <line key={i} className={cx('dm-sp', i === hot && 'dm-on')} x1={cxp} y1={cyp} x2={x} y2={y} />; })}
          <polygon className={cx('dm-base', !on.base && 'dm-off')} pathLength={100} style={{ strokeDasharray: `${drawn} 100` }} points={poly(a => a.baseline)} />
          <polygon className={cx('dm-cur', !on.cur && 'dm-off')} points={poly(a => a.value * grow)} />
          {axes.map((a, i) => { const [bx, by] = pt(i, a.baseline), [x, y] = pt(i, a.value * grow); return <g key={i}>
            <circle className={cx('dm-pt dm-b', !(on.base && drawn >= 100) && 'dm-off')} r={2.5} cx={bx} cy={by} />
            <circle className={cx('dm-pt dm-c', !(on.cur && grow > .98) && 'dm-off', i === hot && 'dm-on')} r={3} cx={x} cy={y} /></g>; })}
        </svg>}
        <span className="dm-rdx-avg dm-num"><b>{Math.round(avg)}</b><span className="dm-muted">average</span></span>
        {axes.map((a, i) => {
          const an = ang(i), cs = Math.cos(an), sn = Math.sin(an), side = Math.abs(cs) < .2 ? 'm' : cs < 0 ? 'l' : 'r';
          const x = cxp + cs * (R + 12), y = cyp + sn * (R + 12), d = a.value - a.baseline, weak = a.value < weakBelow;
          const el = labels.current[i], w = el?.offsetWidth ?? 0, h = el?.offsetHeight ?? 0;
          return (
            <button type="button" key={a.label} ref={b => { labels.current[i] = b; }} className={cx('dm-rdx-ax', 'dm-' + side, i === hot && 'dm-on', i === pulse && grow > .98 && 'dm-hot')} tabIndex={i === focusAt ? 0 : -1}
              aria-label={`${a.label}: ${a.value}, baseline ${a.baseline}, ${d >= 0 ? 'up' : 'down'} ${Math.abs(d)}${weak ? ', weak' : ''}`}
              style={{ left: side === 'm' ? x - w / 2 : side === 'l' ? x - w : x, top: Math.abs(sn) > .9 ? (sn < 0 ? y - h : y) : y - h / 2, visibility: W ? undefined : 'hidden' }}
              onPointerEnter={e => { if (e.pointerType !== 'touch') setHot(i); }} onFocus={() => { setHot(i); setFocusAt(i); }} onClick={() => setHot(i)}>
              <span className="dm-n">{narrow && a.short ? a.short : a.label}</span>
              <span className="dm-v dm-num"><b>{a.value}</b><span>{d >= 0 ? '+' : '−'}{Math.abs(d)}</span>{weak && <span className="dm-tag dm-warn">Weak</span>}</span>
            </button>
          );
        })}
      </div>
      <div className="dm-rdx-ro" aria-live="polite">
        {ro ? <span><b>{ro.label}</b> {ro.value} now, {ro.baseline} before, <span className={ro.value < ro.baseline ? 'dm-dn' : 'dm-up'}>{ro.value < ro.baseline ? '−' : '+'}{Math.abs(ro.value - ro.baseline)}</span>{ro.value < weakBelow ? `, below ${weakBelow}` : ''}</span>
          : <span><Icon name="spark" size="xs" /><span>{note ?? <>This run averages <b>{mean('value')}</b>, {mean('value') >= mean('baseline') ? 'up' : 'down'} {Math.abs(mean('value') - mean('baseline'))} on the baseline.</>}</span></span>}
      </div>
    </div>
  );
}
