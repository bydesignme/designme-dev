'use client';
import { useState, type CSSProperties } from 'react';
import { cx } from '../../lib/cx';
import { useTween } from '../../lib/hooks';
import { Seg, Swap } from '../../lib/motion';
import '../../designme.css';
import './radial-goals.css';

export interface RadialGoal {
  key: string;
  /** Like "Support agent" */
  label: string;
  /** What it counts, like "tickets" */
  unit: string;
  value: number;
  target: number;
  /** Defaults to the chart palette in order */
  color?: string;
}

export interface RadialGoalsProps<R extends string = string> {
  /** Two to five goals, outermost first. Three read best: the fewer the rings, the thicker they are */
  goals: RadialGoal[];
  title?: string;
  /** The line under the title. Defaults to "1 of 3 on target" */
  subtitle?: string;
  /** A switch for the period, like Week and Month */
  ranges?: { value: R; label: string }[];
  range?: R;
  onRangeChange?: (range: R) => void;
  className?: string;
}

const PAL = ['var(--dm-c1)', 'var(--dm-c3)', 'var(--dm-c4)', 'var(--dm-c2)', 'var(--dm-c5)'];
const pc = (x: number) => Math.round(x * 100) + '%';

/** Concentric rings, one per agent, each its share of its own target; past the target a ring goes round again with a marker. */
export function RadialGoals<R extends string = string>({ goals, title = 'Agent goals', subtitle, ranges, range, onRangeChange, className }: RadialGoalsProps<R>) {
  const [focus, setFocus] = useState(-1);
  // the rings share the band from the outer edge (85) to the readout in the middle (34) with a 4 unit gap between them, so
  // three goals get rings 14 units wide; never wider than 16
  const W = Math.min(16, (51 - 4 * (goals.length - 1)) / Math.max(1, goals.length));
  const RAD = goals.map((_, i) => 85 - W / 2 - i * (W + 4));
  const share = (g: RadialGoal) => g.target ? g.value / g.target : 0;
  const overall = goals.reduce((t, g) => t + share(g), 0) / Math.max(1, goals.length);
  const mid = useTween(focus < 0 ? overall : share(goals[focus]), 600, 0);
  const on = goals.filter(g => share(g) >= 1).length;
  return (
    <div data-dm="" className={cx('dm-rgx dm-panel', className)}>
      <div className="dm-rgx-h">
        <div className="dm-rgx-t"><b>{title}</b><Swap className="dm-muted dm-rgx-sub">{subtitle ?? `${on} of ${goals.length} on target`}</Swap></div>
        {ranges && range !== undefined && onRangeChange && <Seg className="dm-rgx-sg" label="Range" options={ranges} value={range} onChange={onRangeChange} />}
      </div>
      <div className="dm-rgx-b">
        <div className={cx('dm-rgx-ring', focus >= 0 && 'dm-hov')}>
          <svg viewBox="0 0 180 180" aria-hidden="true" style={{ ['--dm-rw' as string]: W } as CSSProperties}>
            {goals.map((g, i) => { const s = share(g), c = g.color ?? PAL[i % PAL.length], an = (s > 1 ? s - 1 : s) * 2 * Math.PI;
              return (
                <g key={g.key} className={cx(i === focus && 'dm-on', s > 1 && 'dm-lap')} style={{ stroke: c }} onPointerEnter={e => { if (e.pointerType !== 'touch') setFocus(i); }} onPointerLeave={() => setFocus(-1)}>
                  <circle className="dm-tr" cx={90} cy={90} r={RAD[i]} />
                  <circle className="dm-fl" cx={90} cy={90} r={RAD[i]} pathLength={100} strokeDasharray={`${Math.max(0, Math.min(1, s) * 100 - .01)} 100`} />
                  {/* past the target the ring goes round again from the top, and a marker sits where it ends */}
                  {/* under the lap's end only, a band of the surface a little wider than the ring, so the end cuts into the ring under it */}
                  <circle className="dm-ovb" cx={90} cy={90} r={RAD[i]} pathLength={100} strokeDasharray={`${Math.min(3, Math.max(0, s - 1) * 100)} 100`} strokeDashoffset={-Math.max(0, (s - 1) * 100 - 3)} />
                  <circle className="dm-ov" cx={90} cy={90} r={RAD[i]} pathLength={100} strokeDasharray={`${Math.max(0, s - 1) * 100} 100`} />
                  <circle className="dm-mk" r={Math.max(2.5, W * .29)} cx={90 + Math.cos(an) * RAD[i]} cy={90 + Math.sin(an) * RAD[i]} style={{ stroke: c }} />
                </g>
              ); })}
          </svg>
          <div className="dm-rgx-c"><b className="dm-num">{pc(mid)}</b><Swap className="dm-muted">{focus < 0 ? 'of targets' : goals[focus].label.replace(/ agent$/, '')}</Swap></div>
        </div>
        <div className="dm-rgx-lg">
          {goals.map((g, i) => { const s = share(g);
            return (
              <div key={g.key} className={cx('dm-rgx-r', i === focus && 'dm-on')} tabIndex={0} aria-label={`${g.label}: ${g.value} of ${g.target} ${g.unit}, ${pc(s)} of target`}
                onPointerEnter={e => { if (e.pointerType !== 'touch') setFocus(i); }} onPointerLeave={e => { if (!e.currentTarget.parentElement?.contains(document.activeElement)) setFocus(-1); }}
                onFocus={() => setFocus(i)} onBlur={() => setFocus(-1)}>
                <i style={{ background: g.color ?? PAL[i % PAL.length] }} /><span className="dm-n">{g.label}</span>
                <span className="dm-p dm-num">{s >= 1 ? <span className="dm-tag dm-ok">{pc(s)}</span> : pc(s)}</span>
                <span className="dm-v dm-num">{g.value.toLocaleString('en-US')} / {g.target.toLocaleString('en-US')} {g.unit}</span>
              </div>
            ); })}
        </div>
      </div>
      <div className="dm-rgx-sr"><table>
        <caption>{title}</caption>
        <thead><tr><th>Agent</th><th>Done</th><th>Target</th><th>Share</th></tr></thead>
        <tbody>{goals.map(g => <tr key={g.key}><th>{g.label}</th><td>{g.value} {g.unit}</td><td>{g.target}</td><td>{pc(share(g))}</td></tr>)}</tbody>
      </table></div>
    </div>
  );
}
