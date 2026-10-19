'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../../lib/cx';
import { useIsoLayoutEffect, useReducedMotion, useTween } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { enter, Tip } from '../../lib/motion';
import '../../designme.css';
import './agent-run-timeline.css';

export interface TimelineStep {
  label: string;
  icon?: IconName;
  /** Seconds into the run when the step started */
  start: number;
  /** How long it took, in seconds */
  duration: number;
  /** Bar colour, any CSS colour. Defaults to the chart blue, var(--dm-c1) */
  color?: string;
  /** What the step cost, in dollars */
  cost?: number;
  /** Hatches the bar red, for a step that failed */
  failed?: boolean;
  /** Added to the bar's tooltip, like "2 tests failed" */
  note?: string;
}

export interface TimelineStat {
  /** Like "11.4s" */
  value: string;
  /** Like "total" */
  label: string;
}

export interface AgentRunTimelineProps {
  /** Like "Run 4821, update the pricing page" */
  title: string;
  steps: TimelineStep[];
  /** Seconds into the run. Bars grow up to it and the playhead sits on it. Leave it out once the run has finished */
  time?: number;
  /** Seconds the axis covers. Defaults to the end of the last step, rounded up to a multiple of 4 */
  span?: number;
  /** Labels on the axis, in seconds. Defaults to quarters of the span */
  ticks?: number[];
  /** The line under the title. Defaults to the steps running now, then "Finished in 11.4s" */
  status?: string;
  /** The figures in the footer once the run is done. Defaults to the total time, cost, steps and retries */
  stats?: TimelineStat[];
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

/** How many times `value` has changed since the first render, so a part can play its entrance on a change but not on mount */
function useChanges<T>(value: T) {
  const [seen, setSeen] = useState({ value, n: 0 });
  if (Object.is(seen.value, value)) return seen.n;
  setSeen({ value, n: seen.n + 1 });
  return seen.n + 1;
}

/** Like Swap, except that while `instant` is set the text changes straight away: the live status moves too fast to crossfade */
function Status({ text, instant, className }: { text: string; instant: boolean; className?: string }) {
  const [shown, setShown] = useState(text);
  const [out, setOut] = useState(false);
  const reduce = useReducedMotion();
  if (instant && shown !== text) setShown(text);
  useEffect(() => {
    if (instant || text === shown) return;
    setOut(true);
    const t = setTimeout(() => { setShown(text); setOut(false); }, reduce ? 0 : 170);
    return () => clearTimeout(t);
  }, [text, shown, instant, reduce]);
  return <div className={cx(className, !instant && 'dm-sw', out && 'dm-out')}>{instant ? text : shown}</div>;
}

const pct = (n: number) => n * 100 + '%';
const secs = (n: number) => String(+n.toFixed(1));

/** A run drawn as a Gantt chart: every step as a bar on a shared time axis, with a playhead while it runs. */
export function AgentRunTimeline({ title, steps, time, span, ticks, status, stats, bare = true, className }: AgentRunTimelineProps) {
  const end = Math.max(0, ...steps.map(s => s.start + s.duration));
  const T = span ?? Math.max(4, Math.ceil(end / 4) * 4);
  const done = time === undefined || time >= T;
  const t = done ? T : Math.max(0, time);
  // the bars ease after the playhead in JS: a CSS width transition restarted on every frame never gets to move
  const eased = useTween(t, 250);
  const changed = useChanges(done) > 0 ? 'dm-enter' : undefined;

  const now = steps.filter(s => t >= s.start && t < s.start + s.duration).map(s => s.label);
  const line = status ?? (done ? `Finished in ${end.toFixed(1)}s` : now.length ? now.join(', ') : 'Wrapping up');
  const cost = steps.reduce((sum, s) => sum + (s.cost ?? 0), 0), retries = steps.filter(s => s.failed).length;
  const figures = stats ?? [
    { value: `${end.toFixed(1)}s`, label: 'total' },
    ...(steps.some(s => s.cost !== undefined) ? [{ value: `$${cost.toFixed(2)}`, label: 'cost' }] : []),
    { value: String(steps.length), label: steps.length === 1 ? 'step' : 'steps' },
    ...(retries ? [{ value: String(retries), label: retries === 1 ? 'retry' : 'retries' }] : [])
  ];

  // the playhead follows the lanes, which start after the label column (narrower on small screens)
  const grid = useRef<HTMLDivElement>(null), head = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);
  useEffect(() => {
    const g = grid.current; if (!g) return;
    const ro = new ResizeObserver(() => setSize(n => n + 1)); ro.observe(g);
    return () => ro.disconnect();
  }, []);
  useIsoLayoutEffect(() => {
    const g = grid.current, h = head.current, lane = g?.querySelector('.dm-art-lane');
    if (!g || !h || !lane) return;
    const L = lane.getBoundingClientRect(), G = g.getBoundingClientRect();
    h.style.left = L.left - G.left + (t / T) * L.width + 'px';
  }, [t, T, size]);

  return (
    <div data-dm="" className={cx('dm-art', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-art-h">
        <div>
          <div className="dm-art-t">{title}</div>
          <Status className="dm-art-s dm-muted dm-num" text={line} instant={!done} />
        </div>
        {done
          ? <span key="done" className={cx('dm-tag dm-ok', changed)}><Icon name="check" size="xs" />Done</span>
          : <span key="run" className={cx('dm-tag dm-b', changed)}><span className="dm-spin" style={{ width: 9, height: 9 }} aria-hidden="true" />Running</span>}
      </div>
      <div className="dm-art-grid" ref={grid}>
        <div className="dm-art-axis">
          <span />
          <div className="dm-art-ticks">{(ticks ?? [0, 1, 2, 3, 4].map(k => (T * k) / 4)).map(v => <span key={v} style={{ left: pct(v / T) }}>{secs(v)}s</span>)}</div>
        </div>
        <div>
          {steps.map((s, i) => {
            const w = Math.max(0, Math.min(s.duration, eased - s.start));
            const tip = `${s.label}: ${s.duration.toFixed(1)}s${s.cost !== undefined ? `, $${s.cost.toFixed(2)}` : ''}${s.note ? `, ${s.note}` : ''}`;
            const e = enter(i * 50);
            return (
              <div key={i} className={cx('dm-art-row', e.className)} style={e.style}>
                <span className="dm-art-lab">{s.icon && <Icon name={s.icon} size="xs" />}<span className="dm-t">{s.label}</span></span>
                <span className="dm-art-lane">
                  <Tip label={tip}>
                    <span className={cx('dm-art-bar', s.failed && 'dm-fail')} style={{ '--dm-c': s.color ?? 'var(--dm-c1)', left: pct(s.start / T), width: pct(w / T), transition: 'none' } as CSSProperties} />
                  </Tip>
                </span>
              </div>
            );
          })}
        </div>
        <div className="dm-art-head" ref={head} style={done ? { opacity: 0 } : undefined} />
      </div>
      <div key={done ? 'done' : 'run'} className={cx('dm-art-f dm-muted dm-num', done && changed)}>
        {done && figures.map(f => <span key={f.label}><b>{f.value}</b> {f.label}</span>)}
      </div>
    </div>
  );
}
