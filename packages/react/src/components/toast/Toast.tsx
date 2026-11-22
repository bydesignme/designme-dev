'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/cx';
import { useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Spin, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './toast.css';

export type ToastTone = 'success' | 'error' | 'info' | 'loading';

export interface ToastData {
  /** A new id slides a new toast in and the old one away. Keep the id to change the text in place */
  id: string | number;
  /** Picks the icon and its colour (in Clean only success and error take colour). loading spins */
  tone?: ToastTone;
  title: string;
  /** The quieter line under the title. Crossfades when it changes */
  description?: string;
  /** The one action, a button on the toast's row just before the close button, like Undo or Retry: ghost (the usual), or
      primary on the accent (ink, the old name, still works). On a narrow toast, or when the words run past two lines, it
      moves to a row of its own under them, at the end. A toast with an action should stay at least 10 seconds.
      busy swaps its label for a spinner; done swaps it for the green tick and turns the button off (Undo once it has undone).
      Either way the button eases to its new width */
  action?: { label: string; onClick: () => void; variant?: 'ghost' | 'primary' | 'ink'; busy?: boolean; done?: boolean; doneLabel?: string };
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

const cssMs = (el: Element, v: string) => { const s = getComputedStyle(el).getPropertyValue(v).trim(); return (s.endsWith('ms') ? parseFloat(s) : parseFloat(s) * 1000) || 340; };

function Card({ toast, leaving, onDismiss }: { toast: ToastData; leaving: boolean; onDismiss: () => void }) {
  const tone = TONES[toast.tone ?? 'success'], a = toast.action;
  // a pressed action never goes blank and keeps no room for what it turns into: it shows its new content and eases from its
  // old width to its new one
  const reduce = useReducedMotion(), btn = useRef<HTMLButtonElement>(null), w = useRef(0), tx = useRef<HTMLDivElement>(null);
  // the action sits on the toast's row, before the close button; when the words run past two lines beside it, it moves to a
  // row of its own under them (on a narrow toast, a phone, the stylesheet does that whatever the words)
  const [wrap, setWrap] = useState(false);
  useIsoLayoutEffect(() => {
    const el = tx.current; if (!el || !a) { setWrap(false); return; }
    const lines = new Set<number>(), tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) { const g = document.createRange(); g.selectNodeContents(n); Array.from(g.getClientRects()).forEach(b => { if (b.width > 1) lines.add(Math.round(b.top / 4)); }); }
    if (lines.size > 2) setWrap(true);
  }, [toast.id, !!a]);
  const look = a ? (a.done ? 'done' : a.busy ? 'busy' : a.label) : '';
  useIsoLayoutEffect(() => {
    const b = btn.current; if (!b) { w.current = 0; return; }
    const w1 = b.getBoundingClientRect().width, w0 = w.current; w.current = w1;
    if (w0 && !reduce && Math.abs(w1 - w0) > .5) b.animate([{ width: w0 + 'px' }, { width: w1 + 'px' }], { duration: cssMs(b, '--dm-t'), easing: getComputedStyle(b).getPropertyValue('--dm-ease').trim() || 'ease' });
  }, [look]);
  return (
    <div className={cx('dm-tst-t', leaving ? 'dm-tst-out' : 'dm-tst-in', wrap && 'dm-wrap')} role="status" inert={leaving}>
      <span className="dm-g" data-tone={toast.tone ?? 'success'} style={{ color: tone.color, background: tone.bg }}>{tone.icon ? <Icon name={tone.icon} /> : <Spin />}</span>
      <div className="dm-tx" ref={tx}><b className={toast.tone === 'loading' ? 'dm-shim' : undefined}>{toast.title}</b>{toast.description !== undefined && <Swap>{toast.description}</Swap>}</div>
      <div className="dm-acts">
        {a && <button type="button" ref={btn} className={cx('dm-pill dm-sm', a.variant === 'primary' || a.variant === 'ink' ? 'dm-primary' : 'dm-ghost', a.done && 'dm-done')} aria-busy={a.busy || undefined}
          aria-disabled={a.done || undefined} aria-label={a.done ? a.doneLabel ?? 'Done' : undefined} onClick={() => { if (!a.busy && !a.done) a.onClick(); }}>{a.done ? <Icon name="check" /> : a.busy ? <Spin /> : a.label}</button>}
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
