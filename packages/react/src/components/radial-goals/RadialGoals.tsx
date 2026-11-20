'use client';
import { useId, useState, type CSSProperties } from 'react';
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
  /** The line under the title, like the period it covers ("This week"). Leave it out for none */
  subtitle?: string;
  /** A switch for the period, like Week and Month */
  ranges?: { value: R; label: string }[];
  range?: R;
  onRangeChange?: (range: R) => void;
  className?: string;
}

const PAL = ['var(--dm-c1)', 'var(--dm-c2)', 'var(--dm-c3)', 'var(--dm-c4)', 'var(--dm-c5)'];
const pc = (x: number) => Math.round(x * 100) + '%';

/** Concentric rings, one per agent, each its share of its own target. What is still to go is hatched in the ring's colour; past
    the target the ring goes round again over its start in a deeper shade, with a small cap where it ends. */
export function RadialGoals<R extends string = string>({ goals, title = 'Agent goals', subtitle, ranges, range, onRangeChange, className }: RadialGoalsProps<R>) {
  const [focus, setFocus] = useState(-1);
  // the rings share the band from the outer edge (85) to the readout in the middle (34) with a 4 unit gap between them, so
  // three goals get rings 14 units wide; never wider than 16
  const W = Math.min(16, (51 - 4 * (goals.length - 1)) / Math.max(1, goals.length));
  const RAD = goals.map((_, i) => 85 - W / 2 - i * (W + 4));
  const share = (g: RadialGoal) => g.target ? g.value / g.target : 0;
  const overall = goals.reduce((t, g) => t + share(g), 0) / Math.max(1, goals.length);
  const mid = useTween(focus < 0 ? overall : share(goals[focus]), 600, 0);
  // each ring's hatch is a pattern of its own, named after this chart so two charts on a page keep theirs apart
  const uid = useId().replace(/[^\w-]/g, '');
  return (
    <div data-dm="" className={cx('dm-rgx dm-panel', className)}>
      <div className="dm-rgx-h">
        <div className="dm-rgx-t"><b>{title}</b>{subtitle && <Swap className="dm-muted dm-rgx-sub">{subtitle}</Swap>}</div>
        {ranges && range !== undefined && onRangeChange && <Seg className="dm-rgx-sg" label="Range" options={ranges} value={range} onChange={onRangeChange} />}
      </div>
      <div className="dm-rgx-b">
        <div className={cx('dm-rgx-ring', focus >= 0 && 'dm-hov')}>
          <svg viewBox="0 0 180 180" aria-hidden="true" style={{ ['--dm-rw' as string]: W } as CSSProperties}>
            <defs>
              {goals.map((g, i) => (
                <pattern key={g.key} id={`${uid}-${i}`} className="dm-rgx-hp" style={{ ['--dm-rc' as string]: g.color ?? PAL[i % PAL.length] } as CSSProperties}
                  patternUnits="userSpaceOnUse" width={4} height={4} patternTransform="rotate(45)"><rect width={1.3} height={4} /></pattern>
              ))}
            </defs>
            {goals.map((g, i) => { const s = share(g), c = g.color ?? PAL[i % PAL.length];
              return (
                <g key={g.key} className={cx(i === focus && 'dm-on', s > 1 && 'dm-lap')} style={{ ['--dm-rc' as string]: c } as CSSProperties} onPointerEnter={e => { if (e.pointerType !== 'touch') setFocus(i); }} onPointerLeave={() => setFocus(-1)}>
                  <circle className="dm-tr" cx={90} cy={90} r={RAD[i]} />
                  {/* what is still to go, from the share to the target, hatched in the ring's colour */}
                  <circle className="dm-rm" cx={90} cy={90} r={RAD[i]} pathLength={100} strokeDasharray={`${Math.max(0, 1 - s) * 100} 100`} strokeDashoffset={-Math.min(1, s) * 100} style={{ stroke: `url(#${uid}-${i})` }} />
                  <circle className="dm-fl" cx={90} cy={90} r={RAD[i]} pathLength={100} strokeDasharray={`${Math.max(0, Math.min(1, s) * 100 - .01)} 100`} />
                  {/* past the target the ring goes round again from the top in a deeper shade, and a cap sits where it ends */}
                  {/* under the lap's end only, a band of the surface a little wider than the ring, so the end cuts into the ring under it */}
                  <circle className="dm-ovb" cx={90} cy={90} r={RAD[i]} pathLength={100} strokeDasharray={`${Math.min(3, Math.max(0, s - 1) * 100)} 100`} strokeDashoffset={-Math.max(0, (s - 1) * 100 - 3)} />
                  <circle className="dm-ov" cx={90} cy={90} r={RAD[i]} pathLength={100} strokeDasharray={`${Math.max(0, s - 1) * 100} 100`} />
                  {/* the cap turns round the middle with the lap's end, so the two move together */}
                  <circle className="dm-mk" r={Math.max(2.5, W * .29)} cx={90 + RAD[i]} cy={90} style={{ transform: `rotate(${Math.max(0, s - 1) * 360}deg)` }} />
                </g>
              ); })}
          </svg>
          {/* the one big figure; what it is a share of is for screen readers only */}
          <div className="dm-rgx-c"><b className="dm-num">{pc(mid)}</b><span className="dm-rgx-cl">{focus < 0 ? 'of targets' : `of the ${goals[focus].label}'s target`}</span></div>
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
