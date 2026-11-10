'use client';
import { cloneElement, isValidElement, useEffect, useRef, useState, type CSSProperties, type FocusEvent, type PointerEvent, type ReactNode, type Ref, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { cx } from './cx';
import { useIsoLayoutEffect, useReducedMotion } from './hooks';
import { Icon } from './icons';

/* ---------- status glyphs ---------- */
/** Four dots turning: the agent is thinking */
export const Think = ({ on = true, className }: { on?: boolean; className?: string }) => (
  <span className={cx('dm-think', on && 'dm-on', className)} aria-hidden="true"><i /><i /><i /><i /></span>
);
/** A ring spinning: work in progress */
export const Spin = () => <span className="dm-spin" aria-hidden="true" />;
/** A dot with a sweeping ring: reading or searching */
export const Radar = () => <span className="dm-radar" aria-hidden="true" />;
/** A grey dot with a soft ping: the step happening now */
export const Pulse = () => <span className="dm-pulse" aria-hidden="true" />;
/** Three bars rising and falling */
export const Bars = () => <span className="dm-bars3" aria-hidden="true"><i /><i /><i /></span>;
/** A small round dot, coloured by `color` (or currentColor) */
export const Dot = ({ color }: { color?: string }) => <span className="dm-dot" style={color ? { color } : undefined} aria-hidden="true" />;

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
  return <span className={cx('dm-sw', out && 'dm-out', className)} style={style}>{shown}</span>;
}

/* ---------- layout ---------- */
/** A panel that folds open and shut by its height */
export function Fold({ open, className, children }: { open: boolean; className?: string; children: ReactNode }) {
  return <div className={cx('dm-fold', !open && 'dm-shut', className)} inert={!open} aria-hidden={!open}><div>{children}</div></div>;
}

/** Segmented control with a sliding knob */
export function Seg<T extends string>({ options, value, onChange, label, className }: {
  // T comes from value, so options and onChange are checked against it rather than widening it
  options: { value: NoInfer<T>; label: ReactNode }[]; value: T; onChange: (v: NoInfer<T>) => void; label: string; className?: string;
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
    <div className={cx('dm-seg2', className)} role="group" aria-label={label} ref={ref}>
      <span className="dm-knob" style={knob} />
      {options.map(o => <button type="button" key={o.value} aria-pressed={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>)}
    </div>
  );
}

/* ---------- tooltip ---------- */
// when the last visible tip closed, shared by every Tip on the page
let tipSeen = -Infinity;
type Handlers = { onPointerEnter?: (e: PointerEvent) => void; onPointerLeave?: (e: PointerEvent) => void; onFocus?: (e: FocusEvent) => void; onBlur?: (e: FocusEvent) => void; ref?: Ref<Element> };
const setRef = (ref: Ref<Element> | undefined, node: Element | null) => { if (typeof ref === 'function') ref(node); else if (ref) (ref as RefObject<Element | null>).current = node; };

/** Shows `label` above the element it wraps, after a short pause, the same way the site does.
    `kbd` adds a shortcut after the label, `open` shows it straight away (for feedback like "Copied"),
    and `off` keeps it hidden, for example while the button's own menu is open.
    A single HTML element is used as is, so the tip adds nothing to the layout; anything else gets a display:contents wrapper. */
export function Tip({ label, kbd, open: forced, off, side = 'top', children }: { label: string; kbd?: string; open?: boolean; off?: boolean; side?: 'top' | 'bottom'; children: ReactNode }) {
  const [at, setAt] = useState<{ x: number; y: number; r: DOMRect } | null>(null);
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tip = useRef<HTMLDivElement>(null);
  const target = useRef<Element | null>(null);
  // whether the pointer is on the target: a tip opened from code and then let go stays while the pointer is on it
  const over = useRef(false);
  const open = (el: Element | null | undefined, now = false) => {
    if (!el) return; clearTimeout(timer.current);
    // moving straight from one tip to the next shows it at once, as on the site
    timer.current = setTimeout(() => setAt({ x: 0, y: 0, r: el.getBoundingClientRect() }), now || performance.now() - tipSeen < 120 ? 0 : 380);
  };
  const close = () => { clearTimeout(timer.current); if (tip.current) tipSeen = performance.now(); setShow(false); setAt(null); };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (forced) open(target.current, true); else if (!over.current) close(); }, [forced]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (off) close(); }, [off]);
  // a new label can change the width, so place it again
  useIsoLayoutEffect(() => { setAt(a => a && { ...a, x: 0, y: 0 }); }, [label, kbd]);
  // place it above the target, or below when there is no room (side="bottom" tries below first, for a target with a
  // header just above it), then fade it in
  useIsoLayoutEffect(() => {
    const t = tip.current; if (!at || !t || (at.x || at.y)) return;
    const w = t.offsetWidth, h = t.offsetHeight;
    const x = Math.max(8, Math.min(innerWidth - w - 8, at.r.left + at.r.width / 2 - w / 2));
    const up = at.r.top - h - 8, down = at.r.bottom + 8;
    const y = side === 'bottom' ? (down + h > innerHeight - 8 ? up : down) : (up < 8 ? down : up);
    setAt({ ...at, x, y }); requestAnimationFrame(() => setShow(true));
  }, [at]);

  const enterEl = (el: Element | null) => { over.current = true; if (!off) open(el); };
  const leave = () => { over.current = false; if (!forced) close(); };
  const focus = (el: Element) => { if (!off && el.matches(':focus-visible')) open(el, true); };
  const portal = at && typeof document !== 'undefined' && createPortal(
    <div ref={tip} className={cx('dm-tip', show && 'dm-show')} role="tooltip" data-dm="" style={{ left: at.x, top: at.y }}>{label}{kbd && <span className="dm-kbd">{kbd}</span>}</div>, document.body);

  if (isValidElement<Handlers>(children) && typeof children.type === 'string') {
    const own = children.props;
    return <>{cloneElement(children, {
      ref: (node: Element | null) => { target.current = node; setRef(own.ref, node); },
      onPointerEnter: (e: PointerEvent) => { own.onPointerEnter?.(e); enterEl(e.currentTarget as Element); },
      onPointerLeave: (e: PointerEvent) => { own.onPointerLeave?.(e); leave(); },
      onFocus: (e: FocusEvent) => { own.onFocus?.(e); focus(e.target as Element); },
      onBlur: (e: FocusEvent) => { own.onBlur?.(e); leave(); }
    })}{portal}</>;
  }
  return (
    <span ref={el => { target.current = el?.firstElementChild ?? null; }} style={{ display: 'contents' }}
      onPointerEnter={e => enterEl(e.currentTarget.firstElementChild)} onPointerLeave={leave}
      onFocus={e => focus(e.target)} onBlur={leave}>
      {children}{portal}
    </span>
  );
}

/** The ink for initials on an avatar colour: each of the eight avatar colours, 'var(--dm-av-b)' to 'var(--dm-av-t)', has its
    own (white, or a dark ink of its hue where white would fail contrast). Any other colour returns undefined, and the
    initials stay white */
export const avatarInk = (color: string) => /^var\(--dm-av-[a-z]\)$/.test(color) ? color.replace(')', '-ink)') : undefined;

/** A round avatar with initials, on a colour like 'var(--dm-av-l)' */
export const Avatar = ({ initials, color, size, className }: { initials: string; color: string; size?: number; className?: string }) => (
  <span className={cx('dm-av', className)} style={{ background: color, color: avatarInk(color), ...(size && { width: size, height: size }) }} aria-hidden="true">{initials}</span>
);

/* ---------- sources ---------- */
export type SourceKind = 'figma' | 'web' | 'ts' | 'tsx' | 'css' | 'csv' | 'pdf';
export interface Source { label: string; kind?: SourceKind; tip?: string; onClick?: () => void }
const FT: Partial<Record<SourceKind, string>> = { tsx: 'dm-re', csv: 'dm-csv', pdf: 'dm-pdf' };
/** A file or link chip, with its type in front */
export function SourceChip({ source, className, style, tipSide }: { source: Source; className?: string; style?: CSSProperties; tipSide?: 'top' | 'bottom' }) {
  const { label, kind, tip, onClick } = source;
  const mark = kind === 'figma' ? <Icon name="figma" size="xs" /> : kind === 'web' ? <Icon name="globe" size="xs" />
    : kind ? <span className={cx('dm-ft', FT[kind])}>{kind.toUpperCase()}</span> : null;
  const chip = <button type="button" className={cx('dm-fchip dm-lnk', className)} style={style} onClick={onClick}>{mark}{label}</button>;
  return tip ? <Tip label={tip} side={tipSide}>{chip}</Tip> : chip;
}

/** Plays the entrance animation, `delay` ms late, the first time it renders */
export const enter = (delay = 0): { className: string; style: CSSProperties } => ({ className: 'dm-enter', style: { animationDelay: delay + 'ms' } });

/** True from the first commit on: give an item its entrance only while this is false, so a later move (a sort reordering the
    rows) doesn't play it again */
export function useMounted() {
  const on = useRef(false);
  useEffect(() => { on.current = true; }, []);
  return on.current;
}

/* ---------- lists that change ---------- */
type Moving = HTMLElement & { _rf?: Animation[] };
/** Where an item was after the last render, against the component: its box, its parent, its cells (a table row) */
export interface ReflowSnap { el: Moving; p: Node | null; x: number; y: number; w: number; h: number; cells?: number[] }
/** The style's own pace, read live so Soft and Blueprint keep their feel */
export const reflowPace = (el: Element) => {
  const cs = getComputedStyle(el);
  return { ease: cs.getPropertyValue('--dm-ease').trim() || 'ease', ms: (parseFloat(cs.getPropertyValue('--dm-t-fast')) || .22) * 1000 };
};
/** A new item fades in from 4px down; the nth new one in a change waits n x 24ms, up to five */
export function reflowIn(el: Moving, n: number, root: Element) {
  const { ease, ms } = reflowPace(root);
  (el._rf ??= []).push(el.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: ms, delay: Math.min(n, 5) * 24, easing: ease, fill: 'backwards' }));
}
/** An item that went fades out where it was, as a still copy that takes no room and can't be reached. `host` takes the copy
    when the item's own parent is gone */
export function reflowGhost(s: ReflowSnap, root: Element, by: string, host?: Element | null) {
  const p = s.p?.isConnected ? s.p : host?.isConnected ? host : null; if (!p) return;
  // an item still fading in leaves from as far as it got
  const fin = s.el._rf?.find(a => a.playState === 'running' && String((a.effect as KeyframeEffect | null)?.getKeyframes()[0]?.opacity) === '0');
  const from = fin ? Number(fin.effect?.getComputedTiming().progress ?? 1) : 1; if (from < .05) return;
  const g = s.el.cloneNode(true) as HTMLElement;
  [g, ...g.querySelectorAll('[id]')].forEach(x => x.removeAttribute('id'));
  g.removeAttribute(by); g.removeAttribute('hidden'); g.setAttribute('data-ghost', ''); g.setAttribute('aria-hidden', 'true'); g.inert = true;
  Object.assign(g.style, { position: 'absolute', left: '0', top: '0', margin: '0', width: s.w + 'px', height: s.h + 'px', boxSizing: 'border-box', pointerEvents: 'none' });
  if (s.cells) [...(g as HTMLTableRowElement).cells].forEach((td, i) => { td.style.boxSizing = 'border-box'; td.style.width = s.cells![i] + 'px'; });
  p.appendChild(g);
  const rb = root.getBoundingClientRect(), gb = g.getBoundingClientRect();
  g.style.transform = `translate(${rb.left + s.x - gb.left}px,${rb.top + s.y - gb.top}px)`;
  const { ease, ms } = reflowPace(root);
  const f = g.animate([{ opacity: from }, { opacity: 0 }], { duration: ms * .8, easing: ease, fill: 'forwards' });
  f.onfinish = f.oncancel = () => g.remove();
}
/** Measures `el` against the component, leaving any glide it is in running: b is where it sits (the glide taken out), dx and
    dy how far the glide has it from there right now, o its opacity right now */
export function reflowMeasure(el: Moving, root: Element) {
  const rb = root.getBoundingClientRect(), cur = el.getBoundingClientRect(), moving = !!el._rf?.some(a => a.playState === 'running');
  const t = moving ? getComputedStyle(el).transform : 'none', m = t && t !== 'none' ? new DOMMatrixReadOnly(t) : null;
  const dx = m ? m.m41 : 0, dy = m ? m.m42 : 0, o = moving ? +getComputedStyle(el).opacity : 1;
  return { rb, b: { left: cur.left - dx, top: cur.top - dy, width: cur.width, height: cur.height }, o, dx, dy };
}
/** Stops the glide or fade `el` is in, where it is */
export function reflowStop(el: Moving) { el._rf?.forEach(a => a.cancel()); el._rf = []; }
/** A ref for an element whose text changes in place (a chip's value): the new text fades up 2px. Not on its first render */
export function freshText(el: HTMLElement | null, text: string) {
  const e = el as (HTMLElement & { _tx?: string; _in?: Animation }) | null; if (!e) return;
  const was = e._tx; e._tx = text;
  if (was === undefined || was === text || typeof e.animate !== 'function' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  e._in?.cancel();
  e._in = e.animate([{ opacity: 0, transform: 'translateY(2px)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: reflowPace(e).ease });
}
/** Glides `el` from (dx, dy) away back to where it is, and from opacity `o` (an item caught fading in) to full */
export function reflowGlide(el: Moving, dx: number, dy: number, root: Element, o = 1, dur?: number) {
  const { ease, ms } = reflowPace(root);
  if (Math.abs(dx) > .5 || Math.abs(dy) > .5) (el._rf ??= []).push(el.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: dur ?? ms + 40, easing: ease }));
  if (o < .99) (el._rf ??= []).push(el.animate([{ opacity: o }, { opacity: 1 }], { duration: ms, easing: ease }));
}

/**
 * A list that changes under a filter, a search or a sort. After each render the items (the elements in `root` that match
 * `selector`, each known by its `by` attribute, data-key by default) that stay glide from where they were to where they are
 * now, new ones fade in from 4px down, and ones that went fade out where they were, as a copy that takes no room and can't be
 * reached. A change made while the last one is still moving starts from where everything is on screen, so quick clicks never
 * stack or leave anything halfway. Places are read against `root`, so when the component re-centres in its stage the items
 * move with it. Transform and opacity only, at the style's own pace; nothing with reduced motion, and nothing on the first
 * render. `enter: false` and `leave: false` leave new and gone items to something else; `host` takes the copies of items whose
 * own parent the render replaced. Items can't sit inside one another.
 */
export function useReflow(root: RefObject<HTMLElement | null>, selector: string, { by = 'data-key', enter = true, leave = true, host }: { by?: string; enter?: boolean; leave?: boolean; host?: RefObject<HTMLElement | null> } = {}) {
  const reduce = useReducedMotion();
  const last = useRef<Map<string, ReflowSnap> | null>(null);
  useIsoLayoutEffect(() => {
    const box = root.current; if (!box) return;
    const was = reduce || typeof box.animate !== 'function' ? null : last.current, now = new Map<string, ReflowSnap>();
    let n = 0;
    box.querySelectorAll<Moving>(selector).forEach(el => {
      const k = el.getAttribute(by); if (k == null || el.hasAttribute('data-ghost')) return;
      const { rb, b, o, dx, dy } = reflowMeasure(el, box); if (!b.width && !b.height) return;
      const s: ReflowSnap = { el, p: el.parentNode, x: b.left - rb.left, y: b.top - rb.top, w: b.width, h: b.height, cells: el instanceof HTMLTableRowElement ? [...el.cells].map(td => td.getBoundingClientRect().width) : undefined };
      now.set(k, s);
      if (!was) return;
      const a = was.get(k);
      // an item that moved glides from where it is on screen (its old place, plus how far along the last glide it was); one
      // that didn't move keeps whatever it is doing, so a render that changes nothing never restarts a glide
      if (a && (Math.abs(a.x - s.x) > .5 || Math.abs(a.y - s.y) > .5)) { reflowStop(el); reflowGlide(el, a.x + dx - s.x, a.y + dy - s.y, box, o); }
      else if (!a && enter) { reflowStop(el); reflowIn(el, n++, box); }
    });
    if (was && leave) was.forEach((a, k) => { if (!now.has(k)) reflowGhost(a, box, by, host?.current); });
    last.current = now;
  });
  // things that move the items between renders (a fold easing open, the component resizing) update where they are, so the
  // next change glides them from where they really were
  useEffect(() => {
    const box = root.current; if (!box) return;
    let raf = 0;
    const fresh = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => {
      const snap = last.current; if (!snap || !box.isConnected) return;
      snap.forEach(s => { if (!s.el.isConnected) return; const { rb, b } = reflowMeasure(s.el, box); if (b.width || b.height) { s.x = b.left - rb.left; s.y = b.top - rb.top; s.w = b.width; s.h = b.height; } });
    }); };
    box.addEventListener('transitionend', fresh); box.addEventListener('animationend', fresh);
    const ro = new ResizeObserver(fresh); ro.observe(box);
    return () => { cancelAnimationFrame(raf); box.removeEventListener('transitionend', fresh); box.removeEventListener('animationend', fresh); ro.disconnect(); };
  }, [root]);
}
