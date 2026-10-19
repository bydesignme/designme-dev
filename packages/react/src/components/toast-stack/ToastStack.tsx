'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useIsoLayoutEffect } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Tip } from '../../lib/motion';
import '../../designme.css';
import './toast-stack.css';

export type ToastTone = 'neutral' | 'ok' | 'warn' | 'bad' | 'merge' | 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

export interface StackToast {
  id: string | number;
  /** The icon in the round badge */
  icon: IconName;
  /** Colours the badge. Defaults to neutral */
  tone?: ToastTone;
  title: ReactNode;
  /** The quiet line under the title */
  detail?: ReactNode;
  /** Like "now" or "2m" */
  time?: string;
}

export interface ToastStackProps {
  /** Oldest first. The last one sits in front */
  toasts: StackToast[];
  /** Called when a toast's close button is pressed. Remove it from `toasts` and it slides away */
  onDismiss?: (id: StackToast['id']) => void;
  /** Fans the stack out. Leave it out to fan it while the pointer is over it */
  expanded?: boolean;
  /** How many toasts stay mounted. Older ones drop off the back */
  max?: number;
  className?: string;
}

const TONE: Record<ToastTone, [string, string]> = {
  neutral: ['--dm-fg2', '--dm-chip'], ok: ['--dm-ok', '--dm-ok-bg'], warn: ['--dm-warn', '--dm-warn-bg'], bad: ['--dm-bad', '--dm-bad-bg'],
  merge: ['--dm-merge', '--dm-merge-bg'], blue: ['--dm-pb', '--dm-pb-bg'], purple: ['--dm-pl', '--dm-pl-bg'], green: ['--dm-pm', '--dm-pm-bg'],
  orange: ['--dm-pp', '--dm-pp-bg'], red: ['--dm-pr', '--dm-pr-bg'], yellow: ['--dm-py', '--dm-py-bg'], pink: ['--dm-pk', '--dm-pk-bg'], teal: ['--dm-pt', '--dm-pt-bg']
};
// a new toast rises in from below, blurred, before it takes its place
const ARRIVING: CSSProperties = { transform: 'translateY(24px) scale(.96)', opacity: 0, filter: 'blur(6px)' };

/** Where each toast sits: stacked into a deck, or fanned out into a list. `i` counts from the front */
function place(i: number, fan: boolean, heights: number[]): CSSProperties {
  if (fan) {
    let y = 0;
    for (let k = 0; k < Math.min(i, 3); k++) y += heights[k] + 8;
    return { transform: `translateY(${-y}px)`, opacity: i > 3 ? 0 : 1, filter: 'none', zIndex: 100 - i };
  }
  const k = Math.min(i, 3);
  return { transform: `translateY(${-k * 10}px) scale(${1 - k * .05})`, opacity: i > 2 ? 0 : 1 - k * .15, filter: i ? 'blur(.3px)' : 'none', zIndex: 100 - i };
}

/** Notifications that stack into a deck and fan out when you hover them. */
export function ToastStack({ toasts, onDismiss, expanded, max = 6, className }: ToastStackProps) {
  const live = toasts.slice(-max);
  const [hover, setHover] = useState(false);
  const fan = expanded ?? hover;

  // heights of the toasts, front first, so the fanned list leaves the right gaps
  const els = useRef(new Map<StackToast['id'], HTMLDivElement>());
  const [heights, setHeights] = useState<Record<string, number>>({});
  const front = live.slice().reverse();
  const hs = front.map(t => heights[t.id] ?? 0);
  const ids = live.map(t => t.id).join('\u0000');
  useIsoLayoutEffect(() => {
    const measure = () => setHeights(prev => {
      const next: Record<string, number> = {};
      els.current.forEach((el, id) => { next[id] = el.offsetHeight; });
      return Object.keys(next).length === Object.keys(prev).length && Object.keys(next).every(k => prev[k] === next[k]) ? prev : next;
    });
    measure();
    const ro = new ResizeObserver(measure);
    els.current.forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, [ids]);

  // new toasts wait two frames in their arriving pose, so the move to their place animates
  const [placed, setPlaced] = useState<Set<StackToast['id']>>(() => new Set());
  useEffect(() => {
    const fresh = live.filter(t => !placed.has(t.id)).map(t => t.id);
    if (!fresh.length) return;
    let raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => setPlaced(p => new Set([...p, ...fresh]))); });
    return () => cancelAnimationFrame(raf);
  }, [ids]); // eslint-disable-line react-hooks/exhaustive-deps

  // a toast that leaves keeps its place for a moment and slides off to the right as it fades.
  // It stays at the same spot in the DOM, so its transition is not cut short by a move
  type Leaving = { toast: StackToast; style: CSSProperties; at: number };
  const [prev, setPrev] = useState({ ids, live, fan, hs });
  const [leaving, setLeaving] = useState<Leaving[]>([]);
  if (prev.ids !== ids) {
    const now = new Set(live.map(t => t.id)), n = prev.live.length;
    const gone = prev.live.flatMap((t, at): Leaving[] => {
      if (now.has(t.id) || leaving.some(l => l.toast.id === t.id)) return [];
      const was = place(n - 1 - at, prev.fan, prev.hs);
      return [{ toast: t, at, style: { ...was, transform: was.transform + ' translateX(30px)', opacity: 0 } }];
    });
    setPrev({ ids, live, fan, hs });
    if (gone.length) setLeaving(l => [...l, ...gone]);
  } else if (prev.fan !== fan || prev.hs.join() !== hs.join()) setPrev({ ids, live, fan, hs });
  const leavingIds = leaving.map(l => l.toast.id).join('\u0000');
  useEffect(() => {
    if (!leaving.length) return;
    const t = setTimeout(() => setLeaving(l => l.filter(x => !leaving.includes(x))), 400);
    return () => clearTimeout(t);
  }, [leavingIds]); // eslint-disable-line react-hooks/exhaustive-deps

  // the stack grows to fit the four front toasts when it fans out
  const fanh = live.length ? hs.slice(0, 4).reduce((a, b) => a + b + 8, 0) - 8 || 96 : undefined;

  const card = (t: StackToast, style: CSSProperties, gone = false) => {
    const [fg, bg] = TONE[t.tone ?? 'neutral'];
    return (
      <div key={t.id} className="dm-tsk-c" style={style} inert={gone} ref={el => { if (gone) return; if (el) els.current.set(t.id, el); else els.current.delete(t.id); }}>
        <span className="dm-g" style={{ color: `var(${fg})`, background: `var(${bg})` }}><Icon name={t.icon} /></span>
        <div className="dm-tx"><b>{t.title}</b>{t.detail && <span>{t.detail}</span>}</div>
        {t.time && <span className="dm-t">{t.time}</span>}
        <Tip label="Dismiss"><button type="button" className="dm-ib" aria-label="Dismiss" onClick={() => onDismiss?.(t.id)}><Icon name="x" size="xs" /></button></Tip>
      </div>
    );
  };

  return (
    <div data-dm="" className={cx('dm-tsk-stack', fan && 'dm-fan', className)} aria-live="polite"
      style={fanh !== undefined ? { '--dm-fanh': fanh + 'px' } as CSSProperties : undefined}
      onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      {leaving.slice().sort((a, b) => a.at - b.at).reduce((all, l) => { all.splice(Math.min(l.at, all.length), 0, card(l.toast, l.style, true)); return all; },
        live.map(t => card(t, placed.has(t.id) ? place(front.indexOf(t), fan, hs) : ARRIVING)))}
    </div>
  );
}
