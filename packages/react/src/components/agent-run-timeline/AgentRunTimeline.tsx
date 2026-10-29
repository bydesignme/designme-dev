'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../../lib/cx';
import { useIsoLayoutEffect, useReducedMotion, useTween } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Brand, type BrandName } from '../../lib/brands';
import { enter, Tip } from '../../lib/motion';
import '../../designme.css';
import './agent-run-timeline.css';

/** What a step is: the model thinking or writing (purple), a tool like a file read or a test run (teal), or an app the agent
    works in, like Figma or GitHub (orange) */
export type StepKind = 'model' | 'tool' | 'app';

export interface TimelineStep {
  label: string;
  icon?: IconName;
  /** An app's own mark in place of the icon, like 'figma', 'github' or 'slack' */
  brand?: BrandName;
  /** Colours the step's bar, icon and live time, and counts it in the key under the title */
  kind?: StepKind;
  /** Seconds into the run when the step started */
  start: number;
  /** How long it took, in seconds */
  duration: number;
  /** Bar colour, any CSS colour. Defaults to the kind's colour, or the chart blue, var(--dm-c1), for a step with no kind */
  color?: string;
  /** What the step cost, in dollars */
  cost?: number;
  /** Hatches the bar red and puts a red tag after the label, for a step that failed */
  failed?: boolean;
  /** The tag on a failed step, like "2 failed". Defaults to "Failed" */
  tag?: string;
  /** Added to the bar's tooltip, like "2 tests failed" */
  note?: string;
  /** A retry of the failed step just before it: a dashed line joins the end of that step to this one once it starts */
  retry?: boolean;
}

export interface TimelineStat {
  /** Like "11.4s" */
  value: string;
  /** Like "total" */
  label: string;
  icon?: IconName;
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
  /** The figures in the footer once the run is done. Defaults to the total time, cost, steps and retries, which count up while it plays */
  stats?: TimelineStat[];
  /** The names of the kinds in the key. Defaults to Model, Tools and Apps */
  kindLabels?: Partial<Record<StepKind, string>>;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

// each kind's bar colour, a chart colour (teal and orange take a little of their text slot, so the bars keep 3:1 on a light
// page), and palette slot (its icon tint and live time)
const KIND: Record<StepKind, [string, string, string]> = {
  model: ['Model', 'var(--dm-c2)', 'pl'],
  tool: ['Tools', 'color-mix(in srgb,var(--dm-c6) 70%,var(--dm-pt))', 'pt'],
  app: ['Apps', 'color-mix(in srgb,var(--dm-c4) 75%,var(--dm-pp))', 'pp']
};
const KINDS = Object.keys(KIND) as StepKind[];

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
type State = 'wait' | 'run' | 'done' | 'fail';

/** A run drawn as a Gantt chart: every step as a bar in its kind's colour on a shared time axis, with a playhead while it runs. */
export function AgentRunTimeline({ title, steps, time, span, ticks, status, stats, kindLabels, bare = true, className }: AgentRunTimelineProps) {
  const end = Math.max(0, ...steps.map(s => s.start + s.duration));
  const T = span ?? Math.max(4, Math.ceil(end / 4) * 4);
  const done = time === undefined || time >= T;
  const t = done ? end : Math.max(0, time);
  // the bars ease after the playhead in JS: a CSS width transition restarted on every frame never gets to move
  const eased = useTween(t, 250);
  const changed = useChanges(done) > 0 ? 'dm-enter' : undefined;

  const state = (s: TimelineStep): State => t < s.start ? 'wait' : t < s.start + s.duration && !done ? 'run' : s.failed ? 'fail' : 'done';
  // the line under the title names the steps at work; between two steps it keeps the last one's names
  const now = steps.filter(s => state(s) === 'run').map(s => s.label).join(', ');
  const last = useRef('');
  if (now) last.current = now;
  const retries = steps.filter(s => s.failed && t >= s.start + s.duration).length;
  const line = status ?? (done ? `Finished in ${end.toFixed(1)}s${steps.some(s => s.failed) ? `, ${retries} ${retries === 1 ? 'retry' : 'retries'}` : ''}` : now || last.current || 'Starting');
  // the footer counts up with the playhead, so it is there from the start and never pops in at the end
  const started = steps.filter(s => t >= s.start), hasRetries = steps.some(s => s.failed), n = started.length;
  const ran = (s: TimelineStep) => Math.max(0, Math.min(s.duration, t - s.start));
  const cost = started.reduce((sum, s) => sum + (s.cost ?? 0) * (ran(s) / (s.duration || 1)), 0);
  const figures = (done && stats) || [
    { value: `${Math.min(t, end).toFixed(1)}s`, label: 'total', icon: 'clock' as IconName },
    ...(steps.some(s => s.cost !== undefined) ? [{ value: `$${cost.toFixed(2)}`, label: 'cost', icon: 'dollar' as IconName }] : []),
    { value: String(n), label: n === 1 ? 'step' : 'steps', icon: 'layers' as IconName },
    ...(hasRetries ? [{ value: String(retries), label: retries === 1 ? 'retry' : 'retries', icon: 'refresh' as IconName }] : [])
  ];
  const kinds = KINDS.filter(k => steps.some(s => s.kind === k));
  const per = (k: StepKind) => steps.filter(s => s.kind === k).reduce((sum, s) => sum + ran(s), 0);

  // a step that finishes while you watch gives its icon a small bump
  const seenRunning = useRef(new Set<number>());
  steps.forEach((s, i) => { if (state(s) === 'run') seenRunning.current.add(i); });

  // the time on the playhead covers the axis labels it passes
  const grid = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const g = grid.current; if (!g) return;
    const b = g.querySelector('.dm-art-now')?.getBoundingClientRect(); if (!b) return;
    g.querySelectorAll('.dm-art-ticks span').forEach(el => { const x = el.getBoundingClientRect(); el.classList.toggle('dm-hid', x.right > b.left - 4 && x.left < b.right + 4); });
  });

  return (
    <div data-dm="" className={cx('dm-art', !bare && 'dm-panel', done ? 'dm-fin' : 'dm-live', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-art-h">
        <div className="dm-art-hd">
          <div className="dm-art-t">{title}</div>
          <Status className={cx('dm-art-s dm-num', done ? 'dm-muted' : 'dm-shim')} text={line} instant={!done} />
        </div>
        {done
          ? <span key="done" className={cx('dm-art-tag dm-tag dm-ok', changed)}><Icon name="check" size="xs" />Done</span>
          : <span key="run" className={cx('dm-art-tag dm-tag', changed)}><span className="dm-spin" aria-hidden="true" />Running</span>}
      </div>
      {kinds.length > 0 && (
        <div className="dm-art-key dm-num" role="list" aria-label="Time by kind of step">
          {kinds.map(k => <span key={k} role="listitem" style={{ '--dm-k': KIND[k][1] } as CSSProperties}><i />{kindLabels?.[k] ?? KIND[k][0]}<b>{per(k).toFixed(1)}s</b></span>)}
        </div>
      )}
      <div className="dm-art-grid" ref={grid} style={{ '--dm-p': (t / T).toFixed(4) } as CSSProperties}>
        <div className="dm-art-axis" aria-hidden="true">
          <span />
          <div className="dm-art-ticks">{(ticks ?? [0, 1, 2, 3, 4].map(k => (T * k) / 4)).map(v => <span key={v} style={{ left: pct(v / T) }}>{secs(v)}s</span>)}</div>
          <span />
        </div>
        <div className="dm-art-past" aria-hidden="true" />
        <div className="dm-art-rows">
          {steps.map((s, i) => {
            const st = state(s), w = Math.max(0, Math.min(s.duration, eased - s.start)), prev = steps[i - 1];
            const k = s.kind ? KIND[s.kind] : null;
            const tip = `${s.label}: ${s.duration.toFixed(1)}s${s.cost !== undefined ? `, $${s.cost.toFixed(2)}` : ''}${s.note ? `, ${s.note}` : ''}`;
            const e = enter(i * 40);
            const hue = { '--dm-k': s.color ?? (k ? k[1] : 'var(--dm-c1)'), '--dm-kt': k ? `var(--dm-${k[2]})` : 'var(--dm-fg2)', '--dm-kb': k ? `var(--dm-${k[2]}-bg)` : 'var(--dm-chip)' } as CSSProperties;
            return (
              <div key={i} className={cx('dm-art-row', e.className, st === 'done' && seenRunning.current.has(i) && 'dm-bump')} style={{ ...e.style, ...hue }} data-k={s.kind} data-s={st}>
                <span className="dm-art-lab">
                  <span className="dm-art-ic" aria-hidden="true">{s.brand ? <Brand name={s.brand} /> : s.icon && <Icon name={s.icon} size="xs" />}</span>
                  <span className="dm-t">{s.label}</span>
                  {st === 'fail' && <span className="dm-tag dm-bad dm-enter">{s.tag ?? 'Failed'}</span>}
                </span>
                <span className="dm-art-lane">
                  {s.retry && prev?.failed && <span className="dm-art-link" aria-hidden="true" style={{ left: pct((prev.start + prev.duration) / T), width: pct((s.start - prev.start - prev.duration) / T) }} />}
                  <Tip label={tip}>
                    <span className="dm-art-bar" style={{ left: pct(s.start / T), width: pct(w / T) }}><i /></span>
                  </Tip>
                </span>
                <span className="dm-art-d dm-num">{st === 'wait' ? '' : `${ran(s).toFixed(1)}s`}</span>
              </div>
            );
          })}
        </div>
        <div className="dm-art-head" aria-hidden="true"><i /><span className="dm-art-now dm-num">{done && <Icon name="check" size="xs" />}{t.toFixed(1)}s</span></div>
      </div>
      <div className="dm-art-f dm-muted dm-num">
        {figures.map((f, i) => <span key={i}>{f.icon && <Icon name={f.icon} size="xs" />}<span><b>{f.value}</b> {f.label}</span></span>)}
      </div>
    </div>
  );
}
