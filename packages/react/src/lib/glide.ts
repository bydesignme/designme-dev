'use client';
import { useEffect } from 'react';

/* Clean's one hover in a menu or a list (owner, 21 Nov), as the shared core's hoverGlide() draws it: a single highlight that
   glides from row to row as the pointer moves, and fades in as the pointer enters the list and out as it leaves. It follows
   the keyboard too: the row with the focus (:focus-visible) and the row the arrows are on (opts.hl, .dm-hl by default). It is
   the list's own ::before (or its ::after when that one is taken), placed by CSS variables (--dm-hg-x, --dm-hg-y, --dm-hg-w,
   --dm-hg-h and the row's own corners, --dm-hg-r), so it adds no element. Only Clean draws it (designme.css); there the rows'
   own hover fills give way to it, while a picked row (opts.keep) keeps its stronger fill over it. */

export interface HoverGlideOptions {
  /** The row the arrow keys are on. Default `.dm-hl` */
  hl?: string;
  /** Picked rows, which keep their own fill over the glide */
  keep?: string;
}

const KEEP = '[aria-selected="true"],[aria-checked="true"],[aria-current]:not([aria-current="false"])';
type Glided = HTMLElement & { _hg?: (() => void) | null; _hgAt?: ((r: HTMLElement | null, mouse?: boolean) => void) | null };

/** Starts the glide on `list` for the rows that match `rows`. Returns a function that stops it */
export function hoverGlide(el: HTMLElement | null, rows = '.dm-mi', o: HoverGlideOptions = {}): () => void {
  if (!el || typeof window === 'undefined') return () => {};
  const list = el as Glided;
  if (list._hg) return list._hg;
  const free = (p: string) => { const v = getComputedStyle(list, p).content; return !v || v === 'none' || v === 'normal'; };
  const side = free('::before') ? 'b' : free('::after') ? 'a' : ''; if (!side) return () => {};
  const hl = o.hl || '.dm-hl', keep = o.keep || KEEP;
  list.dataset.hg = side; list.classList.add('dm-hg'); const pos = getComputedStyle(list).position === 'static'; if (pos) list.classList.add('dm-hg-pos');
  // React writes the list's whole className again whenever its own classes change, which drops these: they go back on
  const own = new MutationObserver(() => { if (!list.classList.contains('dm-hg')) list.classList.add('dm-hg'); if (pos && !list.classList.contains('dm-hg-pos')) list.classList.add('dm-hg-pos'); });
  own.observe(list, { attributes: true, attributeFilter: ['class'] });
  const all = () => [...list.querySelectorAll<HTMLElement>(rows)].filter(r => !r.hasAttribute('data-ghost'));
  const ok = (r: HTMLElement | null): r is HTMLElement => !!r && r.isConnected && list.contains(r) && !(r as HTMLButtonElement).disabled && r.getAttribute('aria-disabled') !== 'true' && r.getClientRects().length > 0;
  // the rows' own fills give way to the glide, all but a picked one
  const mark = () => all().forEach(r => { const v = r.matches(keep) ? 'k' : ''; if (r.dataset.hgr !== v) r.dataset.hgr = v; });
  // where a row sits in the list, from the layout, so a menu still scaling in is measured as it will be
  const off = (r: HTMLElement): [number, number] => {
    let x = 0, y = 0, e: HTMLElement | null = r;
    while (e && e !== list) {
      x += e.offsetLeft; y += e.offsetTop; const p = e.offsetParent as HTMLElement | null;
      if (!p || !(p === list || list.contains(p))) { const a = r.getBoundingClientRect(), b = list.getBoundingClientRect(); return [a.left - b.left - list.clientLeft + list.scrollLeft, a.top - b.top - list.clientTop + list.scrollTop]; }
      if (p !== list) { x += p.clientLeft; y += p.clientTop; }
      e = p;
    }
    return [x, y];
  };
  let at: HTMLElement | null = null, on = false, gone = -1e9, over = false;
  const set = (k: string, v: string) => list.style.setProperty('--dm-hg-' + k, v);
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { if (at) show(at); }) : null;
  function show(r: HTMLElement | null) {
    if (!ok(r)) r = null;
    // the picked row has its own fill: the highlight never lays a second fill over it, so the two edges never show
    if (r && r.dataset.hgr === 'k') r = null;
    if (!r) { if (on) { on = false; gone = performance.now(); set('o', '0'); } at = null; return; }
    // coming back from hidden it starts where the row is; a quick return while it still fades glides on from where it was; a move
    // that would pass over the picked row fades across instead of gliding through it
    const from = at, to = r;
    const crosses = on && !!from && all().some(k => k.dataset.hgr === 'k' && ((k.compareDocumentPosition(from) & 2) ? !!(k.compareDocumentPosition(to) & 4) : !!(k.compareDocumentPosition(to) & 2) && !!(k.compareDocumentPosition(from) & 4)));
    const jump = (!on && performance.now() - gone > 200) || crosses, [x, y] = off(r);
    if (jump) list.classList.add('dm-hg-jump');
    set('x', x + 'px'); set('y', y + 'px'); set('w', r.offsetWidth + 'px'); set('h', r.offsetHeight + 'px'); set('r', getComputedStyle(r).borderRadius); set('o', '1');
    if (jump) { void getComputedStyle(list, side === 'b' ? '::before' : '::after').transform; requestAnimationFrame(() => list.classList.remove('dm-hg-jump')); }
    if (ro && r !== at) { ro.disconnect(); ro.observe(list); ro.observe(r); }
    at = r; on = true;
  }
  // what it rests on when nothing new has moved it: the row under a mouse, the keyboard's row, then the arrows' row
  const rest = () => { const rs = all().filter(ok), f = document.activeElement;
    return (over && rs.find(r => r.matches(':hover'))) || (f && list.contains(f) && f.matches(':focus-visible') && rs.find(r => r.contains(f))) || rs.find(r => r.matches(hl)) || null; };
  const row = (t: EventTarget | null) => { const r = t instanceof Element ? t.closest<HTMLElement>(rows) : null; return r && list.contains(r) ? r : null; };
  const onOver = (e: PointerEvent) => { if (e.pointerType && e.pointerType !== 'mouse') return; over = true; const r = row(e.target); if (r) show(r); else if ((e.target as Element).closest('.dm-hg') !== list) show(null); };
  const onLeave = (e: PointerEvent) => { if ((e.pointerType && e.pointerType !== 'mouse') || (e.relatedTarget && list.contains(e.relatedTarget as Node))) return; over = false; show(rest()); };
  const onIn = (e: FocusEvent) => { const r = row(e.target); if (r && (e.target as Element).matches(':focus-visible')) show(r); };
  const onOut = () => setTimeout(() => { if (list.isConnected && !list.contains(document.activeElement)) show(rest()); });
  list.addEventListener('pointerover', onOver); list.addEventListener('pointerout', onLeave);
  list.addEventListener('focusin', onIn); list.addEventListener('focusout', onOut);
  // rows drawn again, a row the arrows move to, a row picked; and a menu that closes hides it
  const mo = new MutationObserver(ms => {
    ms = ms.filter(m => m.target !== list || m.type !== 'attributes'); if (!ms.length) return;
    mark(); let to: HTMLElement | undefined;
    for (const m of ms) { const t = m.target as HTMLElement; if (m.type === 'attributes' && m.attributeName === 'class' && t.matches && t.matches(rows) && t.matches(hl)) to = t; }
    if (to) show(to); else if (!at || !ok(at) || !(over || at.matches(hl) || at.contains(document.activeElement))) show(rest()); else show(at);
  });
  mo.observe(list, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-selected', 'aria-checked', 'aria-current', 'aria-disabled', 'disabled', 'hidden'] });
  const pop = list.closest('.dm-pop'), po = pop && new MutationObserver(() => { if (!pop.classList.contains('dm-open')) { over = false; on = false; gone = -1e9; set('o', '0'); at = null; } });
  if (po && pop) po.observe(pop, { attributes: true, attributeFilter: ['class'] });
  if (ro) ro.observe(list);
  mark(); show(rest());
  list._hgAt = (r, mouse) => { if (mouse) over = true; show(r); };
  return list._hg = () => {
    own.disconnect(); mo.disconnect(); po?.disconnect(); ro?.disconnect();
    list.removeEventListener('pointerover', onOver); list.removeEventListener('pointerout', onLeave); list.removeEventListener('focusin', onIn); list.removeEventListener('focusout', onOut);
    list.classList.remove('dm-hg', 'dm-hg-pos', 'dm-hg-jump'); delete list.dataset.hg; ['x', 'y', 'w', 'h', 'r', 'o'].forEach(k => list.style.removeProperty('--dm-hg-' + k));
    all().forEach(r => delete r.dataset.hgr); list._hg = null; list._hgAt = null;
  };
}

/** The glide on a list a component renders: `ref` is the list, `rows` a selector for its rows */
export function useHoverGlide(ref: { current: HTMLElement | null }, rows: string, opts: HoverGlideOptions = {}) {
  const { hl, keep } = opts;
  useEffect(() => hoverGlide(ref.current, rows, { hl, keep }), [ref, rows, hl, keep]);
}

/* every menu's rows (.dm-mi) glide in Clean: a menu takes its glide the first time a pointer or the keyboard reaches one of
   its rows, in the scrolling list its rows sit in, or the menu itself. Importing this file is all it takes */
function menuGlide(mi: HTMLElement): Glided | null {
  if (mi.closest('.dm-kbx,.dm-ahx')) return null;
  const m = (mi.closest('.dm-pop,[role="menu"],[role="listbox"]') || mi.parentElement) as HTMLElement | null; if (!m) return null;
  let box: HTMLElement = m;
  for (let a = mi.parentElement; a && a !== m; a = a.parentElement) { const oy = getComputedStyle(a).overflowY; if (oy === 'auto' || oy === 'scroll') { box = a; break; } }
  // (a row that asks again before it acts, like Delete, keeps its own fill)
  hoverGlide(box, '.dm-mi', { keep: KEEP + ',.dm-ask' });
  return box as Glided;
}
if (typeof document !== 'undefined' && !(window as unknown as { __dmMenuGlide?: boolean }).__dmMenuGlide) {
  (window as unknown as { __dmMenuGlide?: boolean }).__dmMenuGlide = true;
  (['pointerover', 'focusin'] as const).forEach(t => document.addEventListener(t, (e: Event) => {
    const mi = e.target instanceof Element ? e.target.closest<HTMLElement>('.dm-mi') : null;
    if (!mi || !mi.closest('[data-dm]')) return;
    const box = menuGlide(mi); if (!box || !box._hgAt) return;
    if (t === 'focusin') { if ((e.target as Element).matches(':focus-visible')) box._hgAt(mi); }
    else if ((e as PointerEvent).pointerType === 'mouse') box._hgAt(mi, true);
  }, true));
}
