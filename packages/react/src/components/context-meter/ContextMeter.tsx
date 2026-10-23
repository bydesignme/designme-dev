'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useTween } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Spin, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './context-meter.css';

/** One kind of thing in the context */
export interface ContextPart {
  key: string;
  /** Like "Files", "Tool output" or "Chat" */
  label: string;
  /** How many tokens it takes */
  tokens: number;
  /** Its colour in the bar and the legend. Defaults to blue, teal, violet and grey, in order */
  color?: string;
  /** What is in it, shown when you hover its row, like "PricingCard.tsx 18.2k, tokens.css 6.1k" */
  items?: string;
}

export interface ContextMeterProps {
  parts: ContextPart[];
  /** The size of the context window, in tokens, like 200000 */
  limit: number;
  /** From this share of the limit (0 to 1) the ring turns amber. Defaults to 0.85 */
  warnAt?: number;
  /** A line under the legend, like "Freed 41.2k tokens. 9 decisions kept". Crossfades when it changes */
  message?: string;
  /** warn shows the message in amber with a warning sign, ok in green with a check */
  messageTone?: 'warn' | 'ok';
  /** Called by Compact. Return a promise and the button spins until it settles */
  onCompact?: () => void | Promise<void>;
  /** Set once the context is compacted: the button turns into Undo, which calls onUndo */
  compacted?: boolean;
  onUndo?: () => void;
  /** The quiet line beside the button. Defaults to what Compact does */
  hint?: string;
  /** Whether the panel is open. Leave it out to let the pill toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const PALETTE = ['var(--dm-pb)', 'var(--dm-pt)', 'var(--dm-pl)', 'var(--dm-faint)'];
const k = (n: number) => (n / 1000).toFixed(1) + 'k';

/** A number that counts to its new value (it starts on its first value) */
function Count({ value, ms = 900, format }: { value: number; ms?: number; format: (n: number) => string }) {
  return <>{format(useTween(value, ms))}</>;
}

/** How full the context is and what fills it: a pill with a ring that opens one bar split by kind, a legend whose rows list
 *  what is in them, and Compact. Escape closes it. */
export function ContextMeter({ parts, limit, warnAt = .85, message, messageTone = 'ok', onCompact, compacted = false, onUndo,
  hint = 'Summarises older turns', open, defaultOpen = true, onOpenChange, className }: ContextMeterProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [busy, setBusy] = useState(false);
  const [lit, setLit] = useState<string | null>(null);
  // it opens on its real numbers; they only count when something changes
  const ready = true;
  const total = parts.reduce((t, p) => t + p.tokens, 0), share = ready ? total / limit : 0, pct = Math.round(share * 100);
  const root = useRef<HTMLDivElement>(null), tg = useRef<HTMLButtonElement>(null);
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
    <div ref={root} data-dm="" className={cx('dm-ctm', share >= warnAt && 'dm-hot', className)} data-open={isOpen ? '1' : '0'}>
      <button ref={tg} type="button" className="dm-ctm-tg" aria-expanded={isOpen} aria-label={`Context, ${pct}% used`} onClick={() => setOpen(!isOpen)}>
        <span className="dm-ctm-ring" aria-hidden="true">
          <svg viewBox="0 0 20 20"><circle className="dm-tr" cx="10" cy="10" r="7.5" /><circle className="dm-fl" cx="10" cy="10" r="7.5" pathLength={100} style={{ strokeDasharray: `${pct} 100` }} /></svg>
        </span>
        <span><span className="dm-ctm-pc dm-num"><Count value={ready ? total : 0} format={n => Math.round(n / limit * 100) + '%'} /></span> of context used</span>
        <Icon name="chev-d" size="xs" />
      </button>
      <div className="dm-ctm-pop dm-panel" role="region" aria-label="What fills the context" inert={!isOpen}>
        <div className="dm-ctm-ph"><span>In context</span><span className="dm-num"><b className="dm-ctm-tot"><Count value={ready ? total : 0} format={k} /></b> of {Math.round(limit / 1000)}k tokens</span></div>
        <div className={cx('dm-ctm-bar', lit && 'dm-hl')} aria-hidden="true">
          {parts.map((p, i) => <i key={p.key} className={lit === p.key ? 'dm-on' : undefined} style={{ width: (ready ? p.tokens / limit * 100 : 0) + '%', '--dm-c': p.color ?? PALETTE[i % PALETTE.length] } as CSSProperties} />)}
        </div>
        <div className="dm-ctm-leg" onPointerLeave={() => setLit(null)}>
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
          <span>{message && <><Icon name={messageTone === 'warn' ? 'warn' : 'ok'} size="xs" /><Swap>{message}</Swap></>}</span>
        </div>
        {(onCompact || onUndo) && (
          <div className="dm-ctm-f">
            <Swap className="dm-ctm-hint">{hint}</Swap>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-ctm-go" onClick={compact}>{busy ? <><Spin />Compacting</> : compacted ? 'Undo' : 'Compact'}</button>
          </div>
        )}
      </div>
    </div>
  );
}
