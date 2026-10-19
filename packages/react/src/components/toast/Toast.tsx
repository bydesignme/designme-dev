'use client';
import { useEffect, useState } from 'react';
import { cx } from '../../lib/cx';
import { useReducedMotion } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Spin, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './toast.css';

export type ToastTone = 'success' | 'error' | 'info' | 'loading';

export interface ToastData {
  /** A new id slides a new toast in and the old one away. Keep the id to change the text in place */
  id: string | number;
  /** Picks the icon and its colour. loading spins */
  tone?: ToastTone;
  title: string;
  /** The quieter line under the title. Crossfades when it changes */
  description?: string;
  /** A button before the close button, like Undo or Retry. busy swaps its label for a spinner */
  action?: { label: string; onClick: () => void; variant?: 'ghost' | 'ink'; busy?: boolean };
}

export interface ToastProps {
  /** The toast to show, or null for none */
  toast: ToastData | null;
  /** Called by the close button. The toast leaves either way */
  onDismiss?: (id: ToastData['id']) => void;
  className?: string;
}

const TONES: Record<ToastTone, { icon: 'ok' | 'alert' | 'info' | null; color: string; bg: string }> = {
  success: { icon: 'ok', color: 'var(--dm-ok)', bg: 'var(--dm-ok-bg)' },
  error: { icon: 'alert', color: 'var(--dm-bad)', bg: 'var(--dm-bad-bg)' },
  info: { icon: 'info', color: 'var(--dm-pb)', bg: 'var(--dm-pb-bg)' },
  loading: { icon: null, color: 'var(--dm-fg)', bg: 'var(--dm-chip)' }
};

function Card({ toast, leaving, onDismiss }: { toast: ToastData; leaving: boolean; onDismiss: () => void }) {
  const tone = TONES[toast.tone ?? 'success'], a = toast.action;
  return (
    <div className={cx('dm-tst-t', leaving ? 'dm-tst-out' : 'dm-tst-in')} role="status" inert={leaving}>
      <span className="dm-g" style={{ color: tone.color, background: tone.bg }}>{tone.icon ? <Icon name={tone.icon} /> : <Spin />}</span>
      <div className="dm-tx"><b>{toast.title}</b>{toast.description !== undefined && <Swap>{toast.description}</Swap>}</div>
      <div className="dm-acts">
        {a && <button type="button" className={cx('dm-pill dm-sm', a.variant === 'ink' ? 'dm-ink' : 'dm-ghost')} aria-busy={a.busy || undefined} onClick={() => { if (!a.busy) a.onClick(); }}>{a.busy ? <Spin /> : a.label}</button>}
        <Tip label="Dismiss"><button type="button" className="dm-ib" aria-label="Dismiss" onClick={onDismiss}><Icon name="x" /></button></Tip>
      </div>
    </div>
  );
}

/** One toast at a time: a new one rises in while the last one slips away. */
export function Toast({ toast, onDismiss, className }: ToastProps) {
  const reduce = useReducedMotion();
  // the close button hides the toast straight away, whether or not the parent clears it
  const [closed, setClosed] = useState<ToastData['id']>();
  const shown = toast && toast.id !== closed ? toast : null;
  // the toast on screen, kept so it can play its exit after the prop moves on
  const [cur, setCur] = useState(shown);
  const [leaving, setLeaving] = useState<ToastData[]>([]);
  if ((shown?.id ?? null) !== (cur?.id ?? null)) {
    if (cur) setLeaving(l => [...l, cur]);
    setCur(shown);
  } else if (shown !== cur) setCur(shown);
  useEffect(() => {
    if (!leaving.length) return;
    const t = setTimeout(() => setLeaving(l => l.slice(1)), reduce ? 0 : 300);
    return () => clearTimeout(t);
  }, [leaving, reduce]);

  return (
    <div data-dm="" className={cx('dm-tst-slot', className)} aria-live="polite">
      {leaving.filter(t => t.id !== cur?.id).map(t => <Card key={'t' + t.id} toast={t} leaving onDismiss={() => {}} />)}
      {cur && <Card key={'t' + cur.id} toast={cur} leaving={false} onDismiss={() => { setClosed(cur.id); onDismiss?.(cur.id); }} />}
    </div>
  );
}
