'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/cx';
import { Icon } from '../../lib/icons';
import { Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './progress.css';

export type ProgressState = 'indeterminate' | 'running' | 'paused' | 'error' | 'complete';

export interface ProgressStep {
  /** Like "Indexing files" */
  label: string;
  /** What the step counts, like "Files" */
  unit: string;
  /** How many there are to count, like 2000 */
  total: number;
}

export interface ProgressMeter {
  /** Like "Credits this month" */
  label: string;
  value: number;
  max: number;
  /** The unit in the meter's spoken value, like "credits" */
  unit?: string;
  /** Share of `max` where it says "Running low" (0.75) */
  warnAt?: number;
  /** Share of `max` where it warns more strongly (0.9) */
  dangerAt?: number;
  /** The words for the stronger warning ("Almost out") */
  dangerLabel?: string;
  /** Quiet text at the right under the meter, like "Resets Dec 1" */
  note?: string;
}

export interface ProgressProps {
  /** Like "Indexing the docs" */
  title: string;
  /** indeterminate: the ring turns and the bar sweeps; running: the accent; paused: grey; error: red with Retry; complete: green */
  state: ProgressState;
  steps: ProgressStep[];
  /** The step in hand, from 0 */
  step: number;
  /** How far the step in hand is, 0 to 1 */
  stepProgress: number;
  /** The line under the title. Defaults to "Step 3 of 5, indexing files" and the like */
  valueText?: string;
  /** What failed, shown over the bar with a Retry button while `state` is "error" */
  error?: string;
  onPause?: () => void;
  onResume?: () => void;
  onRetry?: () => void;
  /** Adds a Run again button once complete */
  onRestart?: () => void;
  /** A meter under the run, with thresholds that warn in words */
  meter?: ProgressMeter;
  className?: string;
}

const CODE: Record<ProgressState, string> = { indeterminate: 'ind', running: 'run', paused: 'paused', error: 'err', complete: 'done' };
const TAG: Record<ProgressState, [string, string]> = { indeterminate: ['Starting', ''], running: ['Running', 'dm-run'], paused: ['Paused', ''], error: ['Failed', 'dm-bad'], complete: ['Done', 'dm-ok'] };
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

/** A run's progress three ways (a ring for the whole run, segments for its steps, a bar for the step in hand), with an optional meter that warns as it fills. */
export function Progress({ title, state, steps, step, stepProgress, valueText, error = 'The step failed', onPause, onResume, onRetry, onRestart, meter, className }: ProgressProps) {
  const n = steps.length, at = Math.max(0, Math.min(step, n - 1)), cur = steps[at];
  const done = state === 'complete', ind = state === 'indeterminate';
  const sub = done ? 1 : Math.max(0, Math.min(1, stepProgress));
  const all = done ? 1 : (at + sub) / n, pct = Math.round(all * 100);
  const words = valueText ?? (ind ? 'Preparing the run' : state === 'paused' ? `Paused at step ${at + 1} of ${n}` : state === 'error' ? `Failed at step ${at + 1} of ${n}` : done ? `All ${n} steps done` : `Step ${at + 1} of ${n}, ${cur.label.toLowerCase()}`);
  // only a change of state is announced, never every percent
  const [said, setSaid] = useState('');
  const was = useRef(state);
  useEffect(() => {
    if (was.current === state) return; was.current = state;
    setSaid({ indeterminate: 'Starting', running: 'Running', paused: 'Paused', error: `Step ${at + 1} failed: ${error}`, complete: 'Done. ' + words }[state]);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps
  const btn = state === 'paused' ? { icon: 'play' as const, label: 'Resume', on: onResume } : done ? { icon: 'refresh' as const, label: 'Run again', on: onRestart } : { icon: 'pause' as const, label: 'Pause', on: onPause };
  const m = meter ? meter.value / meter.max : 0, warnAt = meter?.warnAt ?? .75, dangerAt = meter?.dangerAt ?? .9;
  const band = !meter ? 0 : m >= dangerAt ? 2 : m >= warnAt ? 1 : 0;

  return (
    <div data-dm="" data-s={CODE[state]} className={cx('dm-prg dm-panel', className)}>
      <div className="dm-prg-h">
        <span className="dm-prg-ring" role="progressbar" aria-label="Run progress" aria-valuemin={ind ? undefined : 0} aria-valuemax={ind ? undefined : 100} aria-valuenow={ind ? undefined : pct} aria-valuetext={ind ? 'Preparing the run' : pct + '% of the run'}>
          <svg viewBox="0 0 36 36" aria-hidden="true"><circle className="dm-tr" cx="18" cy="18" r="15" /><circle className="dm-fl" cx="18" cy="18" r="15" pathLength={100} style={ind ? undefined : { strokeDasharray: `${all * 100} 100` }} /></svg>
          <span className="dm-prg-pc dm-num">{done ? <Icon name="check" size="xs" className="dm-enter" /> : ind ? '' : pct + '%'}</span>
        </span>
        <div className="dm-prg-t"><b>{title}</b><span className="dm-muted dm-prg-vt">{words}</span></div>
        <span className={cx('dm-tag dm-prg-st', TAG[state][1])}><Swap>{TAG[state][0]}</Swap></span>
        {btn.on && <Tip label={btn.label}><button type="button" className="dm-ib dm-prg-btn" aria-label={btn.label} onClick={btn.on} disabled={state === 'error' || ind} style={state === 'error' ? { visibility: 'hidden' } : undefined}><Icon name={btn.icon} /></button></Tip>}
      </div>
      <div className="dm-prg-seg" role="progressbar" aria-label="Steps" aria-valuemin={0} aria-valuemax={n} aria-valuenow={done ? n : at} aria-valuetext={done ? `All ${n} steps done` : ind ? 'Not started' : `Step ${at + 1} of ${n}`}>
        {steps.map((_, j) => <i key={j}><b style={{ ['--dm-f' as string]: done || j < at ? 1 : j === at && !ind ? sub : 0 }} /></i>)}
      </div>
      <div className="dm-prg-ll">
        {state === 'error'
          ? <><span className="dm-e dm-enter"><Icon name="alert" size="xs" /><span>{error}</span></span>{onRetry && <button type="button" className="dm-pill dm-line dm-sm" onClick={onRetry}><Icon name="refresh" size="xs" />Retry</button>}</>
          : ind ? <><span>Getting ready</span><span className="dm-n">Counting</span></> : <><span>{cur.unit}</span><span className="dm-n dm-num">{fmt(sub * cur.total)} of {fmt(cur.total)}</span></>}
      </div>
      <div className={cx('dm-prg-lin', ind && 'dm-ind')} role="progressbar" aria-label="This step" aria-valuemin={0} aria-valuemax={100} aria-valuenow={ind ? undefined : Math.round(sub * 100)} aria-valuetext={ind ? 'Working out how much there is' : `${fmt(sub * cur.total)} of ${fmt(cur.total)} ${cur.unit.toLowerCase()}`}>
        <i style={ind ? undefined : { width: sub * 100 + '%' }} />
      </div>
      {meter && (
        <div className="dm-prg-meter">
          <div className="dm-prg-mh"><span>{meter.label}</span><span className="dm-num dm-muted"><b className="dm-prg-mv">{fmt(meter.value)}</b> of {fmt(meter.max)}</span></div>
          <div className={cx('dm-prg-mb', band === 1 && 'dm-warn', band === 2 && 'dm-bad')} role="meter" aria-label={meter.label} aria-valuemin={0} aria-valuemax={meter.max} aria-valuenow={Math.round(meter.value)}
            aria-valuetext={`${fmt(meter.value)} of ${fmt(meter.max)} ${meter.unit ?? ''}`.trim() + ['', ', running low', ', ' + (meter.dangerLabel ?? 'almost out').toLowerCase()][band]}>
            <i className="dm-fl" style={{ width: Math.min(100, m * 100) + '%' }} /><i className="dm-th" style={{ left: warnAt * 100 + '%' }} /><i className="dm-th" style={{ left: dangerAt * 100 + '%' }} />
          </div>
          <div className="dm-prg-ml">
            <span key={band} className={band ? 'dm-enter' : undefined}>{band === 2 ? <span className="dm-tag dm-bad"><Icon name="alert" size="xs" />{meter.dangerLabel ?? 'Almost out'}</span> : band === 1 ? <span className="dm-tag dm-warn"><Icon name="warn" size="xs" />Running low</span> : <span className="dm-muted">On track</span>}</span>
            {meter.note && <span className="dm-muted">{meter.note}</span>}
          </div>
        </div>
      )}
      <p className="dm-prg-sr" aria-live="polite">{said}</p>
    </div>
  );
}
