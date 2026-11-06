'use client';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useIsoLayoutEffect } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import '../../designme.css';
import './context-menu.css';

export interface ContextMenuItem {
  key: string;
  label: string;
  icon?: IconName;
  /** A hint at the right, like "⌘C" */
  shortcut?: string;
  /** Makes it a checkable item (menuitemcheckbox) */
  checked?: boolean;
  /** Red, for something that deletes */
  danger?: boolean;
  /** Asks again before it runs: the first press changes the item to this label, the second runs it */
  confirmLabel?: string;
  /** A submenu, opened with the pointer resting on the item, Right or Enter */
  items?: ContextMenuItem[];
  /** A hairline above this item */
  separator?: boolean;
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  /** Called with the item chosen (in a submenu too) */
  onSelect: (key: string, item: ContextMenuItem) => void;
  /** The menu's name for screen readers, like "Reply actions" */
  label?: string;
  /** The target's name for screen readers. Defaults to "Press Shift+F10 for actions" */
  targetLabel?: string;
  /** Classes for the target. Defaults to an agent reply's panel */
  targetClassName?: string;
  /** What you right-click: an agent reply, a row, a file */
  children: ReactNode;
  className?: string;
}

type At = { x: number; y: number; keyed: boolean };

/** A menu that opens where you right-click, long-press, or press Shift+F10 or the Menu key, with a submenu, a checkable item and a delete that asks again. */
export function ContextMenu({ items, onSelect, label = 'Actions', targetLabel = 'Press Shift+F10 for actions', targetClassName = 'dm-cxm-msg dm-panel', children, className }: ContextMenuProps) {
  const root = useRef<HTMLDivElement>(null), target = useRef<HTMLDivElement>(null), menu = useRef<HTMLDivElement>(null), subMenu = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState<At | null>(null);
  const [sub, setSub] = useState<{ key: string; focus: boolean } | null>(null);
  const [asking, setAsking] = useState<string | null>(null);
  const openedAt = useRef(0), press = useRef<ReturnType<typeof setTimeout>>(undefined), hov = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => { clearTimeout(press.current); clearTimeout(hov.current); }, []);
  const open = !!at;
  const itemsOf = (m: HTMLElement | null) => m ? [...m.querySelectorAll<HTMLElement>('.dm-mi')] : [];
  const bounds = () => { const card = (root.current!.closest('[data-c],.dm-card') || document.body).getBoundingClientRect(); return { lo: Math.max(card.left, 0) + 8, hi: Math.min(card.right, innerWidth) - 8 }; };
  // where a menu goes: at the point, turned back from the right and bottom edges so it stays on screen
  const fit = (m: HTMLElement, x: number, y: number) => {
    const rb = root.current!.getBoundingClientRect(), { lo, hi } = bounds(), w = m.offsetWidth, h = m.offsetHeight;
    if (rb.left + x + w > hi) x -= w;
    x = Math.max(lo - rb.left, Math.min(x, hi - rb.left - w));
    // near the foot of the screen it opens upward, but only where it fits over the target, so it never covers what is above
    const up = rb.top + y + h > innerHeight - 8 && y - h >= 0 && rb.top + y - h > 8; if (up) y -= h;
    m.style.left = x + 'px'; m.style.top = y + 'px'; m.style.setProperty('--dm-origin', (up ? 'bottom ' : 'top ') + 'left');
  };
  useIsoLayoutEffect(() => { if (at && menu.current) { fit(menu.current, at.x, at.y); if (at.keyed) itemsOf(menu.current)[0]?.focus({ preventScroll: true }); } }, [at]);
  // the submenu opens beside its item, on the right or else the left; where neither side has room it drops under the item
  useIsoLayoutEffect(() => {
    const m = subMenu.current, p = menu.current; if (!sub || !m || !p) return;
    const row = p.querySelector<HTMLElement>(`[data-k="${sub.key}"]`)!, pr = p.getBoundingClientRect(), b = row.getBoundingClientRect(), rb = root.current!.getBoundingClientRect(), { lo, hi } = bounds(), w = m.offsetWidth;
    if (pr.right - 4 + w <= hi) fit(m, pr.right - rb.left - 4, b.top - rb.top - 6);
    else if (pr.left + 4 - w >= lo) fit(m, pr.left - rb.left + 4 - w, b.top - rb.top - 6);
    else fit(m, b.left - rb.left + 24, b.bottom - rb.top + 2);
    if (sub.focus) itemsOf(m)[0]?.focus({ preventScroll: true });
  }, [sub]);
  const openAt = (x: number, y: number, keyed: boolean) => { setSub(null); setAsking(null); openedAt.current = performance.now(); setAt({ x, y, keyed }); };
  const close = (back = false) => {
    const inside = !!(menu.current?.contains(document.activeElement) || subMenu.current?.contains(document.activeElement));
    setAt(null); setSub(null); setAsking(null); if (back && inside) target.current?.focus({ preventScroll: true });
  };
  // a press anywhere else closes it
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => { const t = e.target as Node; if (!menu.current?.contains(t) && !subMenu.current?.contains(t)) close(); };
    document.addEventListener('pointerdown', down, true);
    return () => document.removeEventListener('pointerdown', down, true);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const local = (cx0: number, cy0: number) => { const rb = root.current!.getBoundingClientRect(); return [cx0 - rb.left, cy0 - rb.top] as const; };
  // a submenu opened with Enter or Space takes the focus; one opened with a click (or by a demo) leaves it
  const choose = (it: ContextMenuItem, inSub: boolean, keyed: boolean) => {
    if (it.items) { setSub(s => s ? null : { key: it.key, focus: keyed }); return; }
    if (it.confirmLabel && asking !== it.key) { setAsking(it.key); return; }
    if (it.checked === undefined || inSub) close(true);
    onSelect(it.key, it);
  };
  const keys = (list: ContextMenuItem[], inSub: boolean) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    const its = itemsOf(e.currentTarget), i = its.indexOf(document.activeElement as HTMLElement), k = e.key;
    let to: HTMLElement | undefined;
    if (k === 'ArrowDown') to = its[(i + 1) % its.length]; else if (k === 'ArrowUp') to = its[(i - 1 + its.length) % its.length];
    else if (k === 'Home') to = its[0]; else if (k === 'End') to = its[its.length - 1];
    else if (k === 'ArrowRight' && !inSub && list[i]?.items) { e.preventDefault(); setSub({ key: list[i].key, focus: true }); return; }
    else if ((k === 'ArrowLeft' || k === 'Escape') && inSub) { e.preventDefault(); e.stopPropagation(); const key = sub?.key; setSub(null); menu.current?.querySelector<HTMLElement>(`[data-k="${key}"]`)?.focus({ preventScroll: true }); return; }
    else if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); return; }
    else if (k === 'Tab') { close(); return; }
    else if (k.length === 1 && /\S/.test(k)) { const n = its.length, from = Math.max(i, 0); for (let j = 1; j <= n; j++) { const it = its[(from + j) % n]; if ((it.textContent || '').trim().toLowerCase().startsWith(k.toLowerCase())) { to = it; break; } } }
    if (to) { e.preventDefault(); to.focus({ preventScroll: true }); if (!inSub && !list[its.indexOf(to)]?.items) setSub(null); }
  };
  const row = (it: ContextMenuItem, inSub: boolean) => {
    const ask = asking === it.key;
    return (
      <Fragment key={it.key}>
        {it.separator && <div className="dm-sep" role="separator" />}
        <button type="button" data-k={it.key} role={it.checked !== undefined ? 'menuitemcheckbox' : 'menuitem'} aria-checked={it.checked} aria-haspopup={it.items ? 'menu' : undefined}
          aria-expanded={it.items ? sub?.key === it.key : undefined} aria-label={ask ? `${it.label}: press again to confirm` : undefined}
          className={cx('dm-mi', it.items && 'dm-cxm-sub', it.danger && 'dm-cxm-del', ask && 'dm-ask')} onClick={e => choose(it, inSub, e.isTrusted && e.detail === 0)}
          onPointerEnter={() => { if (inSub) return; clearTimeout(hov.current); hov.current = setTimeout(() => setSub(it.items ? { key: it.key, focus: false } : null), it.items ? 160 : 200); }}>
          {it.icon && <Icon name={it.icon} />}{ask ? it.confirmLabel : it.label}
          {it.items ? <span className="dm-r"><Icon name="chev-r" size="xs" /></span> : it.checked !== undefined ? <span className="dm-ck"><Icon name="check" size="xs" /></span> : it.shortcut && <span className="dm-r">{it.shortcut}</span>}
        </button>
      </Fragment>
    );
  };
  const subItems = sub ? items.find(i => i.key === sub.key)?.items : undefined;
  return (
    <div ref={root} data-dm="" className={cx('dm-cxm', className)}>
      <div ref={target} className={cx(targetClassName, open && 'dm-on')} tabIndex={0} aria-haspopup="menu" aria-label={targetLabel}
        onContextMenu={e => { e.preventDefault(); if (open && performance.now() - openedAt.current < 600) return; const [x, y] = local(e.clientX, e.clientY); openAt(x, y, e.isTrusted); }}
        onPointerDown={e => { if (e.pointerType !== 'touch') return; const [x, y] = local(e.clientX, e.clientY); clearTimeout(press.current); press.current = setTimeout(() => openAt(x, y, true), 500); }}
        onPointerUp={() => clearTimeout(press.current)} onPointerCancel={() => clearTimeout(press.current)}
        onKeyDown={e => { if ((e.key === 'F10' && e.shiftKey) || e.key === 'ContextMenu') { e.preventDefault(); const b = e.currentTarget.getBoundingClientRect(), [x, y] = local(b.left + 16, b.top + 36); openAt(x, y, true); } }}>
        {children}
      </div>
      <div ref={menu} className={cx('dm-pop dm-cxm-pop', open && 'dm-open')} role="menu" aria-label={label} inert={!open} onKeyDown={keys(items, false)}>{items.map(it => row(it, false))}</div>
      <div ref={subMenu} className={cx('dm-pop dm-cxm-pop2', open && subItems && 'dm-open')} role="menu" aria-label={items.find(i => i.key === sub?.key)?.label} inert={!(open && subItems)} onKeyDown={keys(subItems || [], true)}>
        {(subItems || []).map(it => row(it, true))}
      </div>
    </div>
  );
}
