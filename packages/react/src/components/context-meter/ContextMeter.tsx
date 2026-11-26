'use client';
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion, useTween } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { mxT, Spin, Swap, Tip } from '../../lib/motion';
import { useHoverGlide } from '../../lib/glide';
import '../../designme.css';
import './context-meter.css';

/** One kind of thing in the context */
export interface ContextPart {
  key: string;
  /** Like "Files", "Tool output" or "Chat" */
  label: string;
  /** How many tokens it takes */
  tokens: number;
  /** Its colour in the bar and the legend. Defaults to the accent, violet, teal and a neutral grey, in order */
  color?: string;
  /** What is in it, shown when you hover its row, like "PricingCard.tsx 18.2k, tokens.css 6.1k" */
  items?: string;
}

export interface ContextMeterProps {
  parts: ContextPart[];
  /** The size of the context window, in tokens, like 200000 */
  limit: number;
  /** From this share of the limit (0 to 1) the ring turns orange. Defaults to 0.85 */
  warnAt?: number;
  /** A line under the legend, like "Freed 41.2k tokens. 9 decisions kept". Crossfades when it changes */
  message?: string;
  /** warn shows the message as a warning notice (a faint warning tint, the filled warning sign, the words in the text colour)
      and puts Compact in the warning tint, as the action that resolves it; ok shows it as a plain line with the green tick */
  messageTone?: 'warn' | 'ok';
  /** Called by Compact. Return a promise and, until it settles, the button gives way to a "Compacting…" status line with a spinner */
  onCompact?: () => void | Promise<void>;
  /** Set once the context is compacted: the button turns into Undo, which calls onUndo */
  compacted?: boolean;
  onUndo?: () => void;
  /** The quiet line beside the button. Defaults to what Compact does */
  hint?: string;
  /** The line beside the button while Compact runs, with a moving highlight. Defaults to "Summarising older turns" */
  busyHint?: string;
  /** Whether the panel is open. Leave it out to let the pill toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Which side of the pill the panel opens on. Defaults to top, above the pill, as it sits under a chat composer. When the
      window, or a box round the meter that clips it, has no room on that side and more on the other, it opens there instead */
  placement?: 'top' | 'bottom';
  className?: string;
}

/** The room the panel may open into: the window, cut by any box round the meter that clips what spills out of it */
function roomOf(el: HTMLElement) {
  let top = 0, bottom = innerHeight;
  for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
    if (getComputedStyle(a).overflowY === 'visible') continue;
    const r = a.getBoundingClientRect(); top = Math.max(top, r.top); bottom = Math.min(bottom, r.bottom);
  }
  return { top, bottom };
}


/** A button as wide as its words: when they change it eases to its new width on the motion pieces' spring, keeping no room
    for a longer word */
function useEaseWidth(ref: RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current; if (!el || reduce || typeof ResizeObserver === 'undefined') return;
    let w = 0, busy: Animation | null = null;
    const ro = new ResizeObserver(() => {
      if (busy) return;
      const w1 = el.getBoundingClientRect().width;
      if (w && Math.abs(w1 - w) > .5) {
        busy = el.animate([{ width: w + 'px' }, { width: w1 + 'px' }], { duration: mxT(el, 't-in', 360), easing: mxT(el, 'ease-spring', 'ease') });
        busy.finished.catch(() => {}).then(() => { busy = null; w = el.getBoundingClientRect().width; });
      }
      w = w1;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, reduce]);
}

const PALETTE = ['var(--dm-c1)', 'var(--dm-c2)', 'var(--dm-c6)', 'var(--dm-muted)'];
const k = (n: number) => (n / 1000).toFixed(1) + 'k';

/** A number that counts to its new value (it starts on its first value) */
function Count({ value, ms = 900, format }: { value: number; ms?: number; format: (n: number) => string }) {
  return <>{format(useTween(value, ms))}</>;
}

/** How full the context is and what fills it: a pill with a ring that opens one bar split by kind, a legend whose rows list
 *  what is in them, and Compact. The panel opens above the pill (placement), and Escape closes it. */
export function ContextMeter({ parts, limit, warnAt = .85, message, messageTone = 'ok', onCompact, compacted = false, onUndo,
  hint = 'Summarises older turns', busyHint = 'Summarising older turns', open, defaultOpen = true, onOpenChange, placement = 'top', className }: ContextMeterProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [busy, setBusy] = useState(false);
  const [lit, setLit] = useState<string | null>(null);
  // it opens on its real numbers; they only count when something changes
  const ready = true;
  const total = parts.reduce((t, p) => t + p.tokens, 0), share = ready ? total / limit : 0, pct = Math.round(share * 100);
  const root = useRef<HTMLDivElement>(null), tg = useRef<HTMLButtonElement>(null), go = useRef<HTMLButtonElement>(null), pop = useRef<HTMLDivElement>(null);
  const leg = useRef<HTMLDivElement>(null);
  useHoverGlide(leg, '.dm-ctm-l');
  useEaseWidth(go);
  // the side it opens on is chosen as it opens: the placement's side, or the other one when that side has no room for the
  // panel (its height, its padding while it is still easing in, and the gap) and the other has more
  const [side, setSide] = useState(placement);
  const full = useRef(0);
  useIsoLayoutEffect(() => {
    const el = pop.current, b = tg.current; if (!isOpen || !el || !b) return;
    full.current = Math.max(full.current, el.scrollHeight);
    const room = roomOf(b), r = b.getBoundingClientRect(), need = full.current + 44, above = r.top - room.top, below = room.bottom - r.bottom;
    const [want, other] = placement === 'top' ? [above, below] : [below, above];
    const up = placement === 'top' ? want >= need || want >= other : !(want >= need || want >= other);
    setSide(up ? 'top' : 'bottom');
  }, [isOpen, placement]);
  // Escape shuts the panel while the pointer or the focus is on the meter
  useEffect(() => {
    if (!isOpen) return;
    const key = (e: KeyboardEvent) => {
      const el = root.current; if (e.key !== 'Escape' || !el) return;
      const inside = el.contains(document.activeElement);
      if (inside || el.matches(':hover')) { setOpen(false); if (inside) tg.current?.focus({ preventScroll: true }); }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps
  const compact = async () => {
    if (busy) return;
    if (compacted) { onUndo?.(); return; }
    setBusy(true);
    try { await onCompact?.(); } finally { setBusy(false); }
  };

  return (
    <div ref={root} data-dm="" className={cx('dm-ctm', share >= warnAt && 'dm-hot', className)} data-open={isOpen ? '1' : '0'} data-pos={side === 'top' ? 'up' : 'down'}>
      <button ref={tg} type="button" className="dm-ctm-tg" aria-expanded={isOpen} aria-label={`Context, ${pct}% used`} onClick={() => setOpen(!isOpen)}>
        <span className="dm-ctm-ring" aria-hidden="true">
          <svg viewBox="0 0 20 20"><circle className="dm-tr" cx="10" cy="10" r="7.5" /><circle className="dm-fl" cx="10" cy="10" r="7.5" pathLength={100} style={{ strokeDasharray: `${pct} 100` }} /></svg>
        </span>
        <span><span className="dm-ctm-pc dm-num"><Count value={ready ? total : 0} format={n => Math.round(n / limit * 100) + '%'} /></span> of context used</span>
        <Icon name="chev-d" size="xs" />
      </button>
      <div ref={pop} className="dm-ctm-pop dm-panel" role="region" aria-label="What fills the context" inert={!isOpen}>
        <div className="dm-ctm-ph"><span>In context</span><span className="dm-num"><b className="dm-ctm-tot"><Count value={ready ? total : 0} format={k} /></b> of {Math.round(limit / 1000)}k tokens</span></div>
        <div className={cx('dm-ctm-bar', lit && 'dm-hl')} aria-hidden="true">
          {parts.map((p, i) => <i key={p.key} className={lit === p.key ? 'dm-on' : undefined} style={{ width: (ready ? p.tokens / limit * 100 : 0) + '%', '--dm-c': p.color ?? PALETTE[i % PALETTE.length] } as CSSProperties} />)}
        </div>
        {/* one highlight glides from part to part (motion pieces) */}
        <div ref={leg} className="dm-ctm-leg dm-mx-glide" onPointerLeave={() => setLit(null)}>
          {parts.map((p, i) => {
            const row = (
              <div key={p.key} className="dm-ctm-l" style={{ '--dm-c': p.color ?? PALETTE[i % PALETTE.length] } as CSSProperties}
                onPointerEnter={() => setLit(p.key)} onFocus={() => setLit(p.key)} onBlur={() => setLit(null)} tabIndex={p.items ? 0 : undefined}>
                <span className="dm-sw" />{p.label}<span className="dm-v dm-num"><Count value={ready ? p.tokens : 0} format={k} /></span>
              </div>
            );
            return p.items ? <Tip key={p.key} label={p.items}>{row}</Tip> : row;
          })}
        </div>
        <div className={cx('dm-ctm-msg', message && 'dm-on', message && 'dm-' + messageTone)} aria-live="polite">
          <span>{message && <>{messageTone === 'warn'
            ? <svg className="dm-ctm-wi" viewBox="0 0 24 24" aria-hidden="true"><path className="dm-a" d="M12 3.6 2.6 19.9h18.8z" /><path className="dm-b" d="M12 9.6v4.4M12 17v.01" /></svg>
            : <Icon name="ok" size="xs" />}<Swap>{message}</Swap></>}</span>
        </div>
        {(onCompact || onUndo) && (
          <div className="dm-ctm-f">
            {busy ? <span className="dm-ctm-hint"><span className="dm-shim">{busyHint}</span></span> : <Swap className="dm-ctm-hint">{hint}</Swap>}
            {/* while it compacts nothing can be pressed, so it says so where the button was, in the loader's sweep, and the button
                comes back as Undo once it is done */}
            {busy
              ? <span className="dm-ctm-run" role="status"><Spin /><span className="dm-shim">Compacting…</span></span>
              : <button ref={go} type="button" className={cx('dm-pill dm-sm dm-ctm-go dm-mx-press', message && messageTone === 'warn' ? 'dm-warn' : 'dm-line')} onClick={compact}>{compacted ? 'Undo' : 'Compact'}</button>}
          </div>
        )}
      </div>
    </div>
  );
}
