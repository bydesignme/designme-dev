'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from './cx';
import { useIsoLayoutEffect, useReducedMotion } from './hooks';
import { Icon } from './icons';

/* ---------- status glyphs ---------- */
/** Four dots turning: the agent is thinking */
export const Think = ({ on = true, className }: { on?: boolean; className?: string }) => (
  <span className={cx('think', on && 'on', className)} aria-hidden="true"><i /><i /><i /><i /></span>
);
/** A ring spinning: work in progress */
export const Spin = () => <span className="spin" aria-hidden="true" />;
/** A dot with a sweeping ring: reading or searching */
export const Radar = () => <span className="radar" aria-hidden="true" />;
/** A grey dot with a soft ping: the step happening now */
export const Pulse = () => <span className="pulse" aria-hidden="true" />;
/** Three bars rising and falling */
export const Bars = () => <span className="bars3" aria-hidden="true"><i /><i /><i /></span>;
/** A small round dot, coloured by `color` (or currentColor) */
export const Dot = ({ color }: { color?: string }) => <span className="dot" style={color ? { color } : undefined} aria-hidden="true" />;

/* ---------- text that changes ---------- */
/** Text that blurs out and back in when it changes */
export function Swap({ children, className, style }: { children: string; className?: string; style?: CSSProperties }) {
  const [shown, setShown] = useState(children);
  const [out, setOut] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (children === shown) { setOut(false); return; }
    setOut(true);
    const t = setTimeout(() => { setShown(children); setOut(false); }, reduce ? 0 : 170);
    return () => clearTimeout(t);
  }, [children, shown, reduce]);
  return <span className={cx('sw', out && 'out', className)} style={style}>{shown}</span>;
}

/* ---------- layout ---------- */
/** A panel that folds open and shut by its height */
export function Fold({ open, className, children }: { open: boolean; className?: string; children: ReactNode }) {
  return <div className={cx('fold', !open && 'shut', className)} inert={!open} aria-hidden={!open}><div>{children}</div></div>;
}

/** Segmented control with a sliding knob */
export function Seg<T extends string>({ options, value, onChange, label }: {
  // T comes from value, so options and onChange are checked against it rather than widening it
  options: { value: NoInfer<T>; label: string }[]; value: T; onChange: (v: NoInfer<T>) => void; label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState<CSSProperties>({});
  useIsoLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const place = () => { const b = el.querySelector<HTMLElement>('[aria-pressed="true"]'); if (b) setKnob({ left: b.offsetLeft, width: b.offsetWidth }); };
    place();
    const ro = new ResizeObserver(place); ro.observe(el);
    return () => ro.disconnect();
  }, [value, options.length]);
  return (
    <div className="seg2" role="group" aria-label={label} ref={ref}>
      <span className="knob" style={knob} />
      {options.map(o => <button type="button" key={o.value} aria-pressed={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>)}
    </div>
  );
}

/* ---------- tooltip ---------- */
/** Shows `label` above whatever it wraps, after a short pause, the same way the site does */
export function Tip({ label, children }: { label: string; children: ReactNode }) {
  const [at, setAt] = useState<{ x: number; y: number; r: DOMRect } | null>(null);
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tip = useRef<HTMLDivElement>(null);
  const open = (el: Element | null, now = false) => {
    if (!el) return; clearTimeout(timer.current);
    timer.current = setTimeout(() => setAt({ x: 0, y: 0, r: el.getBoundingClientRect() }), now ? 0 : 380);
  };
  const close = () => { clearTimeout(timer.current); setShow(false); setAt(null); };
  useEffect(() => () => clearTimeout(timer.current), []);
  // place it above the target, or below when there is no room, then fade it in
  useIsoLayoutEffect(() => {
    const t = tip.current; if (!at || !t || (at.x || at.y)) return;
    const w = t.offsetWidth, h = t.offsetHeight;
    const x = Math.max(8, Math.min(innerWidth - w - 8, at.r.left + at.r.width / 2 - w / 2));
    const y = at.r.top - h - 8 < 8 ? at.r.bottom + 8 : at.r.top - h - 8;
    setAt({ ...at, x, y }); requestAnimationFrame(() => setShow(true));
  }, [at]);
  return (
    <span style={{ display: 'contents' }}
      onPointerEnter={e => open(e.currentTarget.firstElementChild)} onPointerLeave={close}
      onFocus={e => { if ((e.target as Element).matches(':focus-visible')) open(e.target, true); }} onBlur={close}>
      {children}
      {at && typeof document !== 'undefined' && createPortal(
        <div ref={tip} className={cx('tip', show && 'show')} role="tooltip" data-dm="" style={{ left: at.x, top: at.y }}>{label}</div>, document.body)}
    </span>
  );
}

/* ---------- sources ---------- */
export type SourceKind = 'figma' | 'web' | 'ts' | 'tsx' | 'css' | 'csv' | 'pdf';
export interface Source { label: string; kind?: SourceKind; tip?: string; onClick?: () => void }
const FT: Partial<Record<SourceKind, string>> = { tsx: 're', csv: 'csv', pdf: 'pdf' };
/** A file or link chip, with its type in front */
export function SourceChip({ source, className, style }: { source: Source; className?: string; style?: CSSProperties }) {
  const { label, kind, tip, onClick } = source;
  const mark = kind === 'figma' ? <Icon name="figma" size="xs" /> : kind === 'web' ? <Icon name="globe" size="xs" />
    : kind ? <span className={cx('ft', FT[kind])}>{kind.toUpperCase()}</span> : null;
  const chip = <button type="button" className={cx('fchip lnk', className)} style={style} onClick={onClick}>{mark}{label}</button>;
  return tip ? <Tip label={tip}>{chip}</Tip> : chip;
}

/** Plays the entrance animation, `delay` ms late, the first time it renders */
export const enter = (delay = 0): { className: string; style: CSSProperties } => ({ className: 'enter', style: { animationDelay: delay + 'ms' } });
