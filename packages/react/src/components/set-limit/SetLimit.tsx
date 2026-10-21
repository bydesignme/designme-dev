'use client';
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useTween } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Seg } from '../../lib/motion';
import '../../designme.css';
import './set-limit.css';

/** What happens when spending reaches the cap */
export type SetLimitMode = 'pause' | 'ask' | 'keep';

export interface SetLimitMessage {
  /** True when the forecast goes past the cap */
  over: boolean;
  cap: number;
  /** The cap minus the forecast, what is left at the end of the period */
  left: number;
  mode: SetLimitMode;
}

export interface SetLimitProps {
  /** The cap. Leave it out to let the slider set it */
  value?: number;
  defaultValue?: number;
  onValueChange?: (cap: number) => void;
  /** The lowest cap the slider allows */
  min?: number;
  /** The highest cap the slider allows */
  max?: number;
  /** How far one arrow key press or slider notch moves the cap */
  step?: number;
  /** Spent so far this period, the solid part of the bar */
  spent?: number;
  /** Where spending is headed by the end of the period, the striped part of the bar */
  forecast?: number;
  /** What happens at the cap. Leave it out to let the switch set it */
  mode?: SetLimitMode;
  defaultMode?: SetLimitMode;
  onModeChange?: (mode: SetLimitMode) => void;
  title?: string;
  /** The quiet line under the title, like "Resets Nov 1" */
  subtitle?: string;
  /** When the forecast passes the cap, like "Oct 27" */
  passesOn?: string;
  /** Writes an amount, like "$200" */
  format?: (n: number) => string;
  /** Lets the person click the big figure and type a cap (the default). Enter or leaving the field keeps it, held to min and max; Escape goes back */
  editable?: boolean;
  /** Replaces the line under the bar, which by default warns when the forecast passes the cap */
  message?: (state: SetLimitMessage) => ReactNode;
  className?: string;
}

const MODES: { value: SetLimitMode; label: string }[] = [{ value: 'pause', label: 'Pause runs' }, { value: 'ask', label: 'Ask me' }, { value: 'keep', label: 'Keep going' }];
const WILL: Record<SetLimitMode, string> = { pause: 'pause', ask: 'wait for you', keep: 'keep going' };

/** A spending cap on a bar that shows what is spent and what is forecast, with what to do at the limit. */
export function SetLimit({ value, defaultValue = 200, onValueChange, min = 50, max = 500, step = 10, spent = 128, forecast = 184, mode, defaultMode = 'pause', onModeChange,
  title = 'Monthly agent budget', subtitle = 'Resets Nov 1', passesOn = 'Oct 27', format = n => '$' + n, editable = true, message, className }: SetLimitProps) {
  const [capRaw, setCap] = useControllable(value, defaultValue, onValueChange);
  const [atLimit, setMode] = useControllable(mode, defaultMode, onModeChange);
  const cap = Math.max(min, Math.min(max, capRaw));
  const [drag, setDrag] = useState(false);
  // the bars fill in a moment after the card appears
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);
  const bar = useRef<HTMLDivElement>(null);
  // the knob and bars glide to a new cap, except while it is being dragged
  const shown = useTween(cap, drag ? 1 : 450);
  // the figure being typed, while the field has focus
  const [draft, setDraft] = useState<string | null>(null);
  const before = useRef(cap), cancel = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const clamp = (n: number) => Math.max(min, Math.min(max, Math.round(n)));
  const commit = () => {
    if (draft === null) return;
    setCap(cancel.current || draft === '' ? before.current : clamp(parseInt(draft, 10))); cancel.current = false; setDraft(null);
  };
  // the symbols around the number in `format`, like the "$" in "$200", stay put while the number is typed
  const text = format(cap), first = text.search(/\d/), last = text.length - [...text].reverse().join('').search(/\d/);
  const pre = first < 0 ? '' : text.slice(0, first), post = first < 0 ? '' : text.slice(last);

  const pct = (x: number) => (x - min) / (max - min) * 100;
  const snap = (x: number) => Math.max(min, Math.min(max, Math.round(x / step) * step));
  const at = (e: PointerEvent) => { const b = bar.current!.getBoundingClientRect(); setCap(snap(min + (max - min) * Math.max(0, Math.min(1, (e.clientX - b.left) / b.width)))); };
  const key = (e: KeyboardEvent) => {
    const dir = ({ ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 } as Record<string, number>)[e.key]; if (!dir) return;
    e.preventDefault(); setCap(Math.max(min, Math.min(max, cap + dir * step)));
  };

  const over = forecast > cap, left = cap - forecast;
  const used = ready ? Math.min(100, spent / shown * pct(shown)) : 0;
  const fc = ready ? Math.min(pct(shown), forecast / shown * pct(shown)) : 0;
  const figure = draft ?? String(Math.round(shown));
  const line = message ? message({ over, cap, left, mode: atLimit })
    : over ? <><Icon name="alert" size="xs" />Forecast passes your cap around {passesOn}. Runs will {WILL[atLimit]}.</>
      : <><Icon name="ok" size="xs" />On track. About {format(left)} left at month end.</>;

  return (
    <div data-dm="" className={cx('dm-slx dm-panel', className)}>
      <div className="dm-slx-h">
        <div><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div>
        {editable ? (
          // reads as the figure until it is clicked; a click selects it all, so typing replaces it
          <label className="dm-num dm-slx-v" onPointerDown={e => { if (document.activeElement !== input.current) { e.preventDefault(); input.current?.focus(); } }}>
            {pre}<input ref={input} className="dm-slx-in" inputMode="numeric" autoComplete="off" aria-label={title} value={figure} style={{ width: Math.max(1, figure.length) + 'ch' }}
              onFocus={e => { before.current = cap; setDraft(String(cap)); e.currentTarget.select(); }}
              onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 6); setDraft(v); const n = +v; if (v && n >= min && n <= max) setCap(n); }}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
                else if (e.key === 'Escape') { cancel.current = true; e.currentTarget.blur(); }
                else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); const n = clamp((parseInt(draft ?? '', 10) || cap) + (e.key === 'ArrowUp' ? step : -step)); setDraft(String(n)); setCap(n); }
              }}
              onBlur={commit} />{post}
          </label>
        ) : <b className="dm-num dm-slx-v">{format(cap)}</b>}
      </div>
      <div ref={bar} className="dm-slx-bar"
        onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); at(e); }}
        onPointerMove={e => { if (drag) at(e); }}
        onPointerUp={() => setDrag(false)} onPointerCancel={() => setDrag(false)}>
        <div className="dm-slx-used" style={{ width: used + '%' }} />
        <div className="dm-slx-fc" style={{ width: fc + '%' }} />
        <button type="button" className={cx('dm-slx-k', drag && 'dm-drag')} role="slider" aria-label="Budget cap"
          aria-valuemin={min} aria-valuemax={max} aria-valuenow={cap} aria-valuetext={format(cap)} style={{ left: pct(shown) + '%' }} onKeyDown={key}>
          <span className="dm-slx-tt dm-num">{format(cap)}</span>
        </button>
      </div>
      <div className="dm-slx-lg dm-muted">
        <span><i style={{ background: 'var(--dm-accent)' }} />Spent <b className="dm-num">{format(spent)}</b></span>
        <span><i className="dm-fc" />Forecast <b className="dm-num">{format(forecast)}</b></span>
      </div>
      <div className="dm-slx-warn" aria-live="polite">
        {/* the line comes in again when it changes between on track and over, or the choice at the limit changes */}
        {ready && <span key={String(over) + atLimit} className={cx(over ? 'dm-w' : 'dm-o', 'dm-enter')}>{line}</span>}
      </div>
      <div className="dm-slx-opt">
        <span className="dm-muted">At the limit</span>
        <Seg className="dm-slx-sg" label="At the limit" value={atLimit} onChange={setMode} options={MODES} />
      </div>
    </div>
  );
}
