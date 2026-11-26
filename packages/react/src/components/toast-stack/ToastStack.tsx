'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../../lib/cx';
import { useIsoLayoutEffect } from '../../lib/hooks';
import { ToastCard, type ToastData, type ToastDismissReason } from '../toast/Toast';
import '../../designme.css';
import './toast-stack.css';

export interface ToastStackProps {
  /** The toasts, oldest first: the last one sits in front. Each is a Toast (`ToastData`): keep its `id` and change it, and its
      card changes in place (a job's progress, a problem becoming its fix); a new `id` comes in at the front */
  toasts: ToastData[];
  /** Called when a toast is closed: by Close, its countdown, a swipe or Escape. It leaves the stack either way; drop it from
      `toasts` too */
  onDismiss?: (id: ToastData['id'], reason: ToastDismissReason) => void;
  /** Fans the stack out (true) or keeps it a deck (false). Leave it out and it fans out under the pointer, while the keyboard's
      focus is in it, and on a tap */
  expanded?: boolean;
  /** How many toasts stay mounted. Older ones drop off the back. Default 6 */
  max?: number;
  className?: string;
}

// collapsed, the two cards behind the front one peek out 8px each; fanned out, the four in front show, 8px apart
const PEEK = 8, GAP = 8, FAN = 4;

/** Where each card sits, counting from the front: collapsed into a deck (the cards behind take the front one's height and
    peek out above it, a step narrower each), or fanned out into a list, each at its own height */
function place(i: number, fan: boolean, hs: number[]): { style: CSSProperties; height?: number; back: boolean; hidden: boolean } {
  if (fan) {
    let y = 0;
    for (let k = 0; k < i; k++) y += hs[k] + GAP;
    return { style: { transform: `translateY(${-y}px)`, opacity: i < FAN ? 1 : 0, zIndex: 100 - i }, back: false, hidden: i >= FAN };
  }
  const j = Math.min(i, 2);
  return { style: { transform: j ? `translateY(${-j * PEEK}px) scale(${1 - j * .05})` : 'translateY(0px)', opacity: i > 2 ? 0 : 1, zIndex: 100 - i }, height: i ? hs[0] : undefined, back: i > 0, hidden: i > 0 };
}

/** Toasts that stack into a deck and fan out under the pointer or the focus. Each one is a Toast card, with its steps, its
    footer, Close with its countdown, swipe and Escape; the stack reads each card's own height and moves them together */
export function ToastStack({ toasts, onDismiss, expanded, max = 6, className }: ToastStackProps) {
  // a closed toast goes at once, whether or not the parent drops it
  const [closed, setClosed] = useState<Set<ToastData['id']>>(() => new Set());
  const live = toasts.filter(t => !closed.has(t.id)).slice(-max), front = live.slice().reverse();
  const ids = live.map(t => t.id).join('\u0000');

  // it fans out under a mouse, while the keyboard's focus is in it, and on a tap (touch has no hover)
  const [hover, setHover] = useState(false), [focused, setFocused] = useState(false), [tapped, setTapped] = useState(false);
  const fan = expanded ?? (hover || focused || tapped);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const out = (e: PointerEvent) => { if (e.pointerType !== 'mouse' && !root.current?.contains(e.target as Node)) setTapped(false); };
    document.addEventListener('pointerdown', out); return () => document.removeEventListener('pointerdown', out);
  }, []);

  // each card's own height, as it reports it
  const [heights, setHeights] = useState<Record<string, number>>({});
  const hs = front.map(t => heights[t.id] ?? 0);

  // a new card waits two frames below its place, so its rise to it eases; the cards it covers step back as it comes
  const [placed, setPlaced] = useState<Set<ToastData['id']>>(() => new Set());
  useEffect(() => {
    const fresh = live.filter(t => !placed.has(t.id)).map(t => t.id); if (!fresh.length) return;
    let raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => setPlaced(p => new Set([...p, ...fresh]))); });
    return () => cancelAnimationFrame(raf);
  }, [ids]); // eslint-disable-line react-hooks/exhaustive-deps

  // a card that goes keeps its place in the DOM for a moment, fading 8px down as the others close the gap (a swiped one has
  // already gone on sideways)
  type Leaving = { toast: ToastData; at: number; style: CSSProperties; height?: number };
  const [prev, setPrev] = useState({ ids, live, fan, hs });
  const [leaving, setLeaving] = useState<Leaving[]>([]);
  if (prev.ids !== ids) {
    const now = new Set(live.map(t => t.id)), n = prev.live.length;
    const gone = prev.live.flatMap((t, at): Leaving[] => {
      if (now.has(t.id) || leaving.some(l => l.toast.id === t.id)) return [];
      const was = place(n - 1 - at, prev.fan, prev.hs);
      return [{ toast: t, at, height: was.height, style: { ...was.style, transform: `${was.style.transform} translateY(8px) scale(.98)`, opacity: 0 } }];
    });
    setPrev({ ids, live, fan, hs });
    if (gone.length) setLeaving(l => [...l, ...gone]);
  } else if (prev.fan !== fan || prev.hs.join() !== hs.join()) setPrev({ ids, live, fan, hs });
  const leavingIds = leaving.map(l => l.toast.id).join('\u0000');
  useEffect(() => {
    if (!leaving.length) return;
    const t = setTimeout(() => setLeaving(l => l.filter(x => !leaving.includes(x))), 520);
    return () => clearTimeout(t);
  }, [leavingIds]); // eslint-disable-line react-hooks/exhaustive-deps

  /* what screen readers hear, through the stack's two live regions: a card's `announce` (or its title) each time it changes;
     an error at once, the rest politely */
  const said = useRef(new Map<ToastData['id'], string>());
  const [say, setSay] = useState<{ text: string; loud: boolean }>({ text: '', loud: false });
  const news = live.map(t => [t.id, t.announce ?? t.title, t.status === 'error'] as const).filter(([id, text]) => said.current.get(id) !== text);
  const newsKey = news.map(([id, text]) => id + ':' + text).join('\u0000');
  useEffect(() => {
    if (!news.length) return;
    news.forEach(([id, text]) => said.current.set(id, text));
    const [, text, loud] = news[news.length - 1];
    setSay({ text: '', loud: false });
    const t = setTimeout(() => setSay({ text, loud }), 60);
    return () => clearTimeout(t);
  }, [newsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = (id: ToastData['id'], r: ToastDismissReason) => {
    const had = !!root.current?.contains(document.activeElement);
    setClosed(c => new Set(c).add(id)); onDismiss?.(id, r);
    // the focus goes on to the next card's Close (or Stop)
    if (had) setTimeout(() => { const b = root.current?.querySelectorAll<HTMLElement>('.dm-tst-t:not([inert]) :is(.dm-tst-x,.dm-tst-stop)'); b?.[b.length - 1]?.focus({ preventScroll: true }); }, 0);
  };
  // closed ids the parent has since dropped are forgotten
  useEffect(() => { setClosed(c => { const has = new Set(toasts.map(t => t.id)); const next = new Set([...c].filter(id => has.has(id))); return next.size === c.size ? c : next; }); }, [toasts]);

  // the stack is as tall as what it shows, so it stays centred where it is placed as it grows and shrinks
  const fanh = hs.slice(0, FAN).reduce((a, h) => a + h + GAP, 0) - (live.length ? GAP : 0);
  const deckh = live.length ? hs[0] + Math.min(live.length - 1, 2) * PEEK : 0;
  useIsoLayoutEffect(() => { root.current?.style.setProperty('--dm-tsk-h', (fan ? fanh : deckh) + 'px'); });

  const card = (t: ToastData, i: number) => {
    const p = place(i, fan, hs), fresh = !placed.has(t.id);
    return <ToastCard key={t.id} toast={t} motion="host" paused={fan} onClose={r => close(t.id, r)} inert={p.hidden}
      className={cx(fresh && 'dm-tsk-new', p.back && 'dm-tsk-back')} style={fresh ? { zIndex: p.style.zIndex } : p.style} height={p.height}
      onHeight={h => setHeights(x => x[t.id] === h ? x : { ...x, [t.id]: h })} />;
  };
  const gone = (l: Leaving) => <ToastCard key={l.toast.id} toast={l.toast} motion="host" leaving onClose={() => {}} className="dm-tsk-out" style={l.style} height={l.height} />;

  return (
    <div data-dm="" ref={root} className={cx('dm-tsk-stack', className)} role="region" aria-label="Notifications"
      onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(true); }} onPointerLeave={e => { if (e.pointerType === 'mouse') setHover(false); }}
      onPointerDown={e => { if (e.pointerType !== 'mouse' && !(e.target as Element).closest('button')) setTapped(true); }}
      onFocus={e => { if (e.target.matches(':focus-visible')) setFocused(true); }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false); }}>
      {leaving.slice().sort((a, b) => a.at - b.at).reduce((all, l) => { all.splice(Math.min(l.at, all.length), 0, gone(l)); return all; },
        live.map(t => card(t, front.indexOf(t))))}
      <div className="dm-tst-sr" role="status" aria-live="polite">{say.loud ? '' : say.text}</div>
      <div className="dm-tst-sr" role="alert" aria-live="assertive">{say.loud ? say.text : ''}</div>
    </div>
  );
}
