'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Swap } from '../../lib/motion';
import '../../designme.css';
import './number-field.css';

export interface NumberFieldProps {
  /** Like "Max steps" */
  label: string;
  min?: number;
  max?: number;
  step?: number;
  /** Steps that Shift with an arrow, Page Up and Page Down move by (10) */
  bigStep?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Decimal places the value shows with, like 2 for money (0) */
  decimals?: number;
  /** Shown before the value, like "$" */
  prefix?: string;
  /** Shown after the value, like "min" */
  unit?: string;
  /** The value in words for screen readers, like "10 minutes". Defaults to the prefix, value and unit */
  valueText?: (value: number) => string;
  /** The line under the field. Defaults to the range, like "5 to 100, in steps of 5" */
  hint?: string;
  /** What the minus and plus buttons are called, like ["Fewer steps", "More steps"] */
  buttonLabels?: [string, string];
  className?: string;
}

const fix = (x: number) => +x.toFixed(4);

/** A number to type or step: minus and plus (press and hold to keep going), the arrow keys, Shift or Page Up/Down for ten
    steps. A typed value is rounded to the step and kept inside the range when you press Enter or leave, and the hint says so. */
export function NumberField({ label, min = 0, max = 100, step = 1, bigStep = 10, value, defaultValue = min, onValueChange, decimals = 0, prefix, unit, valueText, hint, buttonLabels = ['Decrease', 'Increase'], className }: NumberFieldProps) {
  const [v, setV] = useControllable(value, defaultValue, onValueChange);
  const shown = (x: number) => x.toFixed(decimals);
  const say = valueText ?? ((x: number) => `${prefix ?? ''}${shown(x)}${unit ? ' ' + unit : ''}`);
  const range = hint ?? `${shown(min)} to ${shown(max)}${step !== 1 ? `, in steps of ${step.toFixed(decimals)}` : ''}`;
  const [text, setText] = useState(shown(v));
  const [note, setNote] = useState('');
  const [bad, setBad] = useState(false);
  const [bump, setBump] = useState(0);
  const editing = useRef(false);
  useEffect(() => { if (!editing.current) setText(shown(v)); }, [v, decimals]); // eslint-disable-line react-hooks/exhaustive-deps
  const vRef = useRef(v); vRef.current = v;
  const set = (x: number, why?: string) => {
    const next = fix(Math.min(max, Math.max(min, x)));
    if (next !== vRef.current) { setV(next); vRef.current = next; setBump(b => b + 1); }
    setText(shown(next));
    setNote(why ?? (x > max ? `${say(max)} is the most` : x < min ? `${say(min)} is the least` : ''));
  };
  const stepBy = (n: number) => set(vRef.current + n * step);
  const commit = () => {
    editing.current = false; setBad(false);
    const raw = text.replace(/[^0-9.]/g, ''), x = parseFloat(raw);
    if (!raw || isNaN(x)) { setText(shown(vRef.current)); setNote(`Enter a number from ${shown(min)} to ${shown(max)}`); return; }
    const snapped = fix(Math.round((x - min) / step) * step + min);
    if (x > max || x < min) set(x);
    else set(snapped, Math.abs(snapped - x) > 1e-9 ? `Rounded to ${say(snapped)}` : '');
  };
  // press and hold minus or plus: one step at once, then more and more quickly until you let go
  const hold = useRef<ReturnType<typeof setTimeout>>(undefined);
  const stop = () => clearTimeout(hold.current);
  useEffect(() => stop, []);
  const press = (d: number) => {
    stepBy(d); stop();
    const rep = (ms: number) => { hold.current = setTimeout(() => { const at = vRef.current; if ((d < 0 && at <= min) || (d > 0 && at >= max)) return; stepBy(d); rep(Math.max(40, ms * .8)); }, ms); };
    rep(420);
  };
  const input = useRef<HTMLInputElement>(null), box = useRef<HTMLDivElement>(null);
  // a nudge of the value each time it changes
  useEffect(() => { const b = box.current; if (!b || !bump) return; b.classList.remove('dm-bump'); void b.offsetWidth; b.classList.add('dm-bump'); }, [bump]);
  const id = useId();
  const btn = (d: number, name: string): ReactNode => (
    <button type="button" className={cx('dm-ib', d < 0 ? 'dm-nmf-dn' : 'dm-nmf-up')} tabIndex={-1} aria-label={name} disabled={d < 0 ? v <= min : v >= max}
      onPointerDown={e => { if (e.button) return; e.preventDefault(); press(d); }} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
      onClick={e => { if (e.detail === 0) stepBy(d); }}>
      <Icon name={d < 0 ? 'minus' : 'plus'} size="xs" />
    </button>
  );
  return (
    <div data-dm="" className={cx('dm-nmf-f', note && 'dm-noted', className)}>
      <span className="dm-nmf-l" id={id} onClick={() => input.current?.focus()}>{label}</span>
      <div ref={box} className="dm-nmf-in">
        {btn(-1, buttonLabels[0])}
        <span className="dm-nmf-v" onClick={e => { if (e.target !== input.current) input.current?.focus(); }}>
          {prefix && <span className="dm-nmf-u">{prefix}</span>}
          <input ref={input} className="dm-num" role="spinbutton" inputMode="decimal" autoComplete="off" spellCheck={false} aria-labelledby={id}
            aria-valuemin={min} aria-valuemax={max} aria-valuenow={v} aria-valuetext={say(v)} aria-invalid={bad || undefined} value={text}
            onChange={e => { editing.current = true; setText(e.target.value); setBad(!/^\$?\d*\.?\d*$/.test(e.target.value.trim())); }}
            onBlur={commit}
            onKeyDown={e => {
              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); editing.current = false; stepBy((e.key === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? bigStep : 1)); }
              else if (e.key === 'PageUp' || e.key === 'PageDown') { e.preventDefault(); editing.current = false; stepBy(e.key === 'PageUp' ? bigStep : -bigStep); }
              else if (e.key === 'Enter') { e.preventDefault(); commit(); }
              else if (e.key === 'Escape') { editing.current = false; setBad(false); setText(shown(vRef.current)); }
            }} />
          {unit && <span className="dm-nmf-u">{unit}</span>}
        </span>
        {btn(1, buttonLabels[1])}
      </div>
      <Swap className="dm-nmf-hint dm-muted">{note || range}</Swap>
    </div>
  );
}

/** The panel the fields sit in on designme.dev: a title, a line under it, the fields, and an optional summary at the foot */
export function NumberFieldGroup({ title, description, summary, children, className }: { title?: string; description?: string; summary?: string; children: ReactNode; className?: string }) {
  return (
    <div data-dm="" className={cx('dm-nmf dm-panel', className)}>
      {title && <div className="dm-nmf-h"><b>{title}</b>{description && <span className="dm-muted">{description}</span>}</div>}
      {children}
      {summary != null && <p className="dm-nmf-sum dm-muted" aria-live="polite">{summary}</p>}
    </div>
  );
}
