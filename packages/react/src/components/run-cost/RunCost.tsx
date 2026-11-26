'use client';
import { useEffect, useRef, type RefObject } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useReducedMotion } from '../../lib/hooks';
import { Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './run-cost.css';

export type RunCostStatus = 'idle' | 'running' | 'stopped' | 'paused' | 'spent';

export interface RunCostRow {
  /** Like "Input tokens" */
  label: string;
  value: number;
}

export interface RunCostProps {
  /** Credits used so far */
  used: number;
  /** The whole budget, like 2000 */
  budget: number;
  /** Where the agent pauses, as a percentage of the budget. Defaults to 90 */
  capAt?: number;
  /** Whether the agent pauses at the cap. Leave it out to let the switch change it */
  capOn?: boolean;
  defaultCapOn?: boolean;
  onCapChange?: (on: boolean) => void;
  /** running is blue, paused (at the cap) amber, spent (the whole budget) red */
  status?: RunCostStatus;
  /** Words in the status tag. Defaults to Idle, Running, Stopped, "Paused at 90%" or "Budget used" */
  statusLabel?: string;
  /** The breakdown under the bar, like input tokens, output tokens and tool calls */
  rows?: RunCostRow[];
  /** Words on the button. Defaults to Start run, Stop, Resume, Raise cap or Start over, by status */
  actionLabel?: string;
  /** Called by the button. What it does is up to you: start, stop, resume, raise the cap */
  onAction?: () => void;
  title?: string;
  /** Draws its own container (the default, as on designme.dev). Set true to sit it flat in a chat thread */
  bare?: boolean;
  className?: string;
}


/** A button as wide as its words: when they change it eases to its new width, keeping no room for a longer word */
function useEaseWidth(ref: RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current; if (!el || reduce || typeof ResizeObserver === 'undefined') return;
    let w = 0, busy: Animation | null = null;
    const ro = new ResizeObserver(() => {
      if (busy) return;
      const w1 = el.getBoundingClientRect().width;
      if (w && Math.abs(w1 - w) > .5) {
        busy = el.animate([{ width: w + 'px' }, { width: w1 + 'px' }], { duration: 340, easing: 'cubic-bezier(.23,1,.32,1)' });
        busy.finished.catch(() => {}).then(() => { busy = null; w = el.getBoundingClientRect().width; });
      }
      w = w1;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, reduce]);
}

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const TONE: Partial<Record<RunCostStatus, string>> = { running: 'dm-b', paused: 'dm-warn', spent: 'dm-bad' };
const ACTION: Record<RunCostStatus, string> = { idle: 'Start run', running: 'Stop', stopped: 'Resume', paused: 'Raise cap', spent: 'Start over' };

/** Credits a run has used against its budget, with a cap the agent pauses at and the tokens behind the number. */
export function RunCost({ used, budget, capAt = 90, capOn, defaultCapOn = true, onCapChange, status = 'idle', statusLabel, rows, actionLabel, onAction, title = 'Credits used', bare = false, className }: RunCostProps) {
  const [cap, setCap] = useControllable(capOn, defaultCapOn, onCapChange);
  const go = useRef<HTMLButtonElement>(null);
  useEaseWidth(go);
  const label = statusLabel ?? { idle: 'Idle', running: 'Running', stopped: 'Stopped', paused: `Paused at ${capAt}%`, spent: 'Budget used' }[status];
  return (
    <div data-dm="" className={cx('dm-rc', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-rc-h">
        <span className="dm-muted">{title}</span>
        <span className={cx('dm-rc-st dm-tag', TONE[status])}><span className="dm-dot" /><Swap className="dm-rc-stt dm-mx-w">{label}</Swap></span>
      </div>
      <div className="dm-rc-big"><span className="dm-rc-n dm-num">{fmt(used)}</span><span className="dm-muted"> / {fmt(budget)}</span></div>
      <div className="dm-rc-track" role="meter" aria-label={title} aria-valuemin={0} aria-valuemax={budget} aria-valuenow={Math.round(used)}>
        <div className="dm-rc-fill" style={{ width: Math.max(0, Math.min(100, used / budget * 100)) + '%', background: status === 'paused' ? 'var(--dm-warn-mark)' : 'var(--dm-accent-mark, var(--dm-accent))' }} />
        <Tip label="The agent pauses here"><div className="dm-rc-cap" style={{ left: capAt + '%', opacity: cap ? 1 : 0.2 }} /></Tip>
      </div>
      {rows && (
        <div className="dm-rc-rows">
          {rows.map(r => <div key={r.label}><span>{r.label}</span><span className="dm-num">{fmt(r.value)}</span></div>)}
        </div>
      )}
      <div className="dm-rc-f">
        <label className="dm-rc-cap-t" onClick={e => { e.preventDefault(); setCap(!cap); }}>
          <button type="button" className="dm-toggle" role="switch" aria-checked={cap} aria-label={`Pause at ${capAt} percent`} />
          <span>Pause at {capAt}%</span>
        </label>
        <button ref={go} type="button" className={cx('dm-pill dm-sm dm-rc-go', status === 'running' || status === 'stopped' ? 'dm-line' : 'dm-primary')} onClick={onAction}>
          <Swap>{actionLabel ?? ACTION[status]}</Swap>
        </button>
      </div>
    </div>
  );
}
