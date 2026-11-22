'use client';
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

/* A data table's columns, as in a spreadsheet (owner, 10 Nov; restated 21 Nov), as the shared core's cols() makes them. Each
   table draws the lines between its columns in its own CSS; this makes the columns work:
   - resizing: a handle on each header's right edge (.dm-col-rz, a separator), dragged, or ← and → by 16px while it has the
     focus; a double click gives every column its natural width back. No column goes under its min width; the last one takes
     what is left, and once the columns outgrow the box the table scrolls sideways in it (sized, with the table's .dm-cols-rz)
   - moving: drag a header sideways (its column is tinted, a line shows where it will land and its name follows the pointer),
     or Alt and ← → on a header. Only the `move` columns move, among themselves; a touch on a header scrolls the table
   While `wide` is false (a table drawn as a list of cards on a phone), every row keeps its own order and its natural widths.
   Cells carry data-col with their column's key. */

export interface ColumnsOptions<K extends string> {
  /** Columns before the keyed ones that never resize or move, like a checkbox column */
  lead?: number;
  /** The columns that move, among themselves */
  move?: K[];
  /** Each column's least width in px (64 by default) */
  min?: Partial<Record<K, number>>;
  /** False while the table is drawn as a list of cards: the natural order and widths. Default true */
  wide?: boolean;
  /** A column's name, for its handle's label and the name that follows a drag */
  name?: (key: K) => string;
}

const STEP = 16;

export function useColumns<K extends string>(keys: K[], { lead = 0, move = [], min = {}, wide = true, name = k => k }: ColumnsOptions<K> = {}) {
  const table = useRef<HTMLTableElement>(null);
  const [order, setOrder] = useState<K[]>(keys);
  const [W, setW] = useState<Partial<Record<K, number>> | null>(null);
  const least = (k: K) => min[k] ?? 64;
  // keys the caller adds or drops later keep their places
  const shown = (wide ? [...order.filter(k => keys.includes(k)), ...keys.filter(k => !order.includes(k))] : keys);
  const last = shown[shown.length - 1];
  const sized = !!W && wide;
  const th = (k: K) => table.current?.querySelector<HTMLElement>(`thead th[data-col="${k}"]`) || null;
  // the lead columns (a checkbox) keep the width they have, so a sized table still counts them
  const leadW = useRef<number[]>([]);
  const measure = () => { if (W) return W; const w: Partial<Record<K, number>> = {}; keys.forEach(k => { w[k] = th(k)?.getBoundingClientRect().width || least(k); });
    const row = table.current?.tHead?.rows[0]; leadW.current = Array.from({ length: lead }, (_, i) => row?.cells[i]?.getBoundingClientRect().width || 0); return w; };
  const size = (k: K, w: number, from = W || measure()) => setW({ ...from, [k]: Math.max(least(k), w) });
  const moveTo = (k: K, at: number) => setOrder(() => { const s = [...shown], from = s.indexOf(k); s.splice(from, 1); s.splice(at > from ? at - 1 : at, 0, k); return s; });

  // a drag on a header: its column tinted, a name that follows the pointer and a line where it lands
  const drag = useRef<{ k: K; x0: number; on: boolean; at?: number; ghost?: HTMLDivElement; bar?: HTMLDivElement } | null>(null);
  const tint = (k: K | null) => table.current?.querySelectorAll<HTMLElement>('th[data-col],td[data-col]').forEach(c => c.classList.toggle('dm-col-mv', c.dataset.col === k));
  useEffect(() => {
    const mv = (e: PointerEvent) => {
      const d = drag.current, t = table.current; if (!d || !t) return;
      if (!d.on) {
        if (Math.abs(e.clientX - d.x0) < 6) return;
        d.on = true; t.classList.add('dm-cols-drag'); tint(d.k);
        d.ghost = document.createElement('div'); d.ghost.className = 'dm-col-ghost'; d.ghost.textContent = name(d.k);
        d.bar = document.createElement('div'); d.bar.className = 'dm-col-at';
        const host = t.closest('[data-dm]') || document.body; host.append(d.ghost, d.bar);
      }
      d.ghost!.style.transform = `translate(${e.clientX + 12}px,${e.clientY - 14}px)`;
      const hs = shown.map(k => th(k)!).filter(Boolean), tb = t.getBoundingClientRect();
      const m = shown.map((k, i) => ({ k, i })).filter(z => move.includes(z.k));
      let at = m[m.length - 1].i + 1;
      for (const z of m) { const b = hs[z.i].getBoundingClientRect(); if (e.clientX < b.left + b.width / 2) { at = z.i; break; } }
      d.at = at; const x = at < hs.length ? hs[at].getBoundingClientRect().left : tb.right;
      Object.assign(d.bar!.style, { left: Math.round(x - 1) + 'px', top: Math.round(tb.top) + 'px', height: Math.round(tb.height) + 'px' });
    };
    const up = () => {
      const d = drag.current; drag.current = null; if (!d || !d.on) return;
      d.ghost?.remove(); d.bar?.remove(); table.current?.classList.remove('dm-cols-drag'); tint(null);
      if (d.at != null) moveTo(d.k, d.at);
      // the click that ends a drag never sorts
      const stop = (ev: MouseEvent) => { ev.stopPropagation(); ev.preventDefault(); };
      addEventListener('click', stop, { capture: true, once: true }); setTimeout(() => removeEventListener('click', stop, { capture: true }), 0);
    };
    addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up);
    return () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); };
  });

  const total = sized ? leadW.current.reduce((a, x) => a + x, 0) + shown.slice(0, -1).reduce((a, k) => a + (W![k] ?? least(k)), 0) + least(last) : 0;
  const tableStyle: CSSProperties | undefined = sized ? { width: `max(100%, ${Math.round(total)}px)` } : undefined;

  return {
    /** The columns in the order they are shown */
    order: shown,
    /** Whether a column has a set width: the table lays its columns out fixed (add .dm-cols-rz) */
    sized,
    /** Spread on the table */
    table: { ref: table, style: tableStyle },
    /** The table's colgroup: the lead columns, then one per key in the order shown */
    colgroup: (
      <colgroup>
        {Array.from({ length: lead }, (_, i) => <col key={'lead' + i} style={sized && leadW.current[i] ? { width: Math.round(leadW.current[i]) } : undefined} />)}
        {shown.map(k => <col key={k} style={sized && k !== last ? { width: Math.round(W![k] ?? least(k)) } : undefined} />)}
      </colgroup>
    ),
    /** Spread on a column's header */
    head: (k: K) => ({
      'data-col': k,
      ...(move.includes(k) && wide ? { 'aria-keyshortcuts': 'Alt+ArrowLeft Alt+ArrowRight' } : {}),
      onPointerDown: (e: ReactPointerEvent) => {
        if ((e.target as Element).closest('.dm-col-rz') || e.button || e.pointerType === 'touch' || !wide || !move.includes(k)) return;
        drag.current = { k, x0: e.clientX, on: false };
      },
      onKeyDown: (e: ReactKeyboardEvent) => {
        if (!e.altKey || !wide || !move.includes(k) || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
        const ms = shown.filter(x => move.includes(x)), i = ms.indexOf(k), to = ms[i + (e.key === 'ArrowLeft' ? -1 : 1)];
        if (!to) return; e.preventDefault();
        const j = shown.indexOf(to); moveTo(k, e.key === 'ArrowLeft' ? j : j + 1);
        requestAnimationFrame(() => { const h = th(k), f = h?.querySelector<HTMLElement>('button') || h; f?.focus(); });
      }
    }),
    /** A column's resize handle, inside its header; the last column has none */
    handle: (k: K): ReactNode => k === last ? null : (
      <span className="dm-col-rz" role="separator" aria-orientation="vertical" tabIndex={0} aria-valuemin={least(k)} aria-valuenow={W?.[k] ? Math.round(W[k]!) : undefined}
        aria-label={`Resize ${name(k)}`} data-tip="Drag to resize, double click to reset"
        onPointerDown={e => {
          if (e.button || !wide) return; e.preventDefault(); e.stopPropagation();
          const g = e.currentTarget, from = measure(), x0 = e.clientX, w0 = from[k] ?? least(k);
          g.setPointerCapture(e.pointerId); g.classList.add('dm-on'); table.current?.classList.add('dm-cols-rzing');
          const mv = (ev: PointerEvent) => size(k, w0 + ev.clientX - x0, from);
          const end = () => { g.removeEventListener('pointermove', mv); g.removeEventListener('pointerup', end); g.removeEventListener('pointercancel', end); g.classList.remove('dm-on'); table.current?.classList.remove('dm-cols-rzing'); };
          g.addEventListener('pointermove', mv); g.addEventListener('pointerup', end); g.addEventListener('pointercancel', end);
        }}
        onDoubleClick={e => { e.stopPropagation(); setW(null); }}
        onClick={e => e.stopPropagation()}
        onKeyDown={e => {
          if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return; e.preventDefault(); e.stopPropagation();
          const from = measure(); size(k, (from[k] ?? least(k)) + (e.key === 'ArrowLeft' ? -STEP : STEP), from);
        }} />
    )
  };
}
