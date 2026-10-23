'use client';
import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Spin } from '../../lib/motion';
import '../../designme.css';
import './otp-field.css';

export type OtpStatus = 'idle' | 'checking' | 'error' | 'success';

export interface OtpFieldProps {
  /** Defaults to "Check your email" */
  title?: string;
  /** Like "Enter the 6-digit code we sent to maya@designme.studio" */
  description?: ReactNode;
  /** The tile above the title. Defaults to mail; null hides it */
  icon?: IconName | null;
  /** How many digits. Defaults to 6, split in two halves */
  length?: number;
  /** The digits typed so far */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the code once every box is filled */
  onComplete?: (code: string) => void;
  /** `checking` dims the digits and spins, `error` shakes them red, `success` turns them green and locks them.
      Typing after an error starts the code over, so set it back to `idle` when the value changes */
  status?: OtpStatus;
  /** The line under the boxes, like "That code doesn't match. 2 tries left". Defaults to a line for each status */
  message?: string;
  /** Under the message, like a resend link */
  footer?: ReactNode;
  className?: string;
}

const LINE: Record<OtpStatus, string> = { idle: '', checking: 'Checking the code', error: "That code doesn't match", success: 'Verified' };

/** A one-time code with one box per digit. Typing moves along, Backspace clears and moves back, the arrow keys move,
    and a paste fills every box. The first box asks for autocomplete="one-time-code", so a phone can offer the code. */
export function OtpField({ title = 'Check your email', description, icon = 'mail', length = 6, value, defaultValue = '', onValueChange, onComplete, status = 'idle', message, footer, className }: OtpFieldProps) {
  const [code, setCode] = useControllable(value, defaultValue, onValueChange);
  const ins = useRef<(HTMLInputElement | null)[]>([]);
  const [popped, setPopped] = useState(-1);
  const locked = status === 'checking' || status === 'success';
  const digits = Array.from({ length }, (_, i) => code[i] ?? '');
  const half = Math.ceil(length / 2);

  // the code is handed over the moment the last box is filled
  const last = useRef('');
  useEffect(() => {
    if (code.length === length && code !== last.current && status === 'idle') onComplete?.(code);
    last.current = code;
  }, [code, length, status, onComplete]);
  useEffect(() => { if (popped < 0) return; const t = setTimeout(() => setPopped(-1), 160); return () => clearTimeout(t); }, [popped]);

  const focus = (i: number) => ins.current[Math.max(0, Math.min(length - 1, i))]?.focus();
  // a digit goes in at i; after a wrong code, typing starts the code over from the first box
  const put = (i: number, d: string) => {
    const start = status === 'error' ? '' : code;
    const at = status === 'error' ? 0 : Math.min(i, start.length);
    const next = (start.slice(0, at) + d + start.slice(at + 1)).slice(0, length);
    setCode(next); setPopped(at);
    if (at + 1 < length) focus(at + 1);
  };
  const fill = (text: string) => {
    const d = text.replace(/\D/g, '').slice(0, length); if (!d) return;
    setCode(d); focus(d.length < length ? d.length : length - 1);
  };
  const onKey = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (locked) return;
    if (/^\d$/.test(e.key)) { e.preventDefault(); put(i, e.key); }
    else if (e.key === 'Backspace') {
      e.preventDefault();
      if (status === 'error') { setCode(''); focus(0); }
      else if (digits[i]) setCode(code.slice(0, i) + code.slice(i + 1));
      else if (i > 0) { setCode(code.slice(0, i - 1) + code.slice(i)); focus(i - 1); }
    }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); focus(i - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); focus(i + 1); }
  };
  const line = message ?? LINE[status];

  return (
    <div data-dm="" className={cx('dm-otp dm-panel', className)}>
      {icon && <span className="dm-otp-ic"><Icon name={icon} /></span>}
      <b className="dm-otp-t">{title}</b>
      {description && <p className="dm-muted dm-otp-s">{description}</p>}
      <div className={cx('dm-otp-in', status === 'checking' && 'dm-vf', status === 'error' && 'dm-bad', status === 'success' && 'dm-ok')} role="group" aria-label="Verification code">
        {digits.map((d, i) => (
          <span key={i} style={{ display: 'contents' }}>
            {i === half && <span className="dm-sep" aria-hidden="true" />}
            <input ref={el => { ins.current[i] = el; }} className={cx('dm-otp-d', popped === i && 'dm-bump')} value={d} readOnly={locked}
              inputMode="numeric" pattern="[0-9]*" maxLength={1} autoComplete={i ? 'off' : 'one-time-code'} aria-label={`Digit ${i + 1} of ${length}`}
              aria-invalid={status === 'error' || undefined} onKeyDown={onKey(i)} onFocus={e => e.target.select()}
              onChange={e => { const v = e.target.value.replace(/\D/g, ''); if (v.length > 1) fill(v); else if (v) put(i, v); }}
              onPaste={(e: ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); if (!locked) fill(e.clipboardData.getData('text')); }} />
          </span>
        ))}
      </div>
      <p className={cx('dm-otp-m', status === 'error' && 'dm-bad', status === 'success' && 'dm-ok')} aria-live="polite">
        {status === 'checking' ? <Spin /> : status === 'error' ? <Icon name="alert" size="xs" /> : status === 'success' ? <Icon name="ok" size="xs" /> : null}{line}
      </p>
      {footer && status !== 'success' && <p className="dm-muted dm-otp-f">{footer}</p>}
    </div>
  );
}
