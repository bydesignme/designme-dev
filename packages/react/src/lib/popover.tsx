'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from './cx';
import { useControllable, useIsoLayoutEffect } from './hooks';

export interface PopoverOptions {
  /** Line the popover up with the trigger's start edge (the default) or its end edge */
  align?: 'start' | 'end';
  /** Open above or below the trigger. Left out, it opens below unless there is no room */
  side?: 'up' | 'down';
  /** Whether it is open. Leave it out to let the trigger toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * A menu or panel that opens from a button, placed the way designme.dev places them: under the trigger, or above it
 * when there is no room, and closed by a click outside, Escape or a resize.
 *
 * Spread `trigger` on the button and `pop` on an element with the dm-pop class that is always rendered
 * (it fades in and out, so it needs to be there to measure). Its nearest positioned ancestor is what it is placed in.
 *
 *   const menu = usePopover({ align: 'end' });
 *   <button {...menu.trigger}>Model</button>
 *   <div {...menu.pop} className={cx(menu.pop.className, 'dm-my-menu')} role="menu">…</div>
 */
export function usePopover({ align = 'start', side, open, defaultOpen = false, onOpenChange }: PopoverOptions = {}) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const btn = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<CSSProperties>({});
  const set = useRef(setOpen);
  useEffect(() => { set.current = setOpen; });

  useIsoLayoutEffect(() => {
    const b = btn.current, p = pop.current; if (!isOpen || !b || !p) return;
    const host = (p.offsetParent || p.parentElement) as HTMLElement;
    const hr = host.getBoundingClientRect(), br = b.getBoundingClientRect();
    const up = side === 'up' || (side !== 'down' && br.bottom + p.offsetHeight + 12 > innerHeight && br.top - p.offsetHeight > 12);
    let x = align === 'end' ? br.right - hr.left - p.offsetWidth : br.left - hr.left;
    x = Math.max(-hr.left + 8, Math.min(x, innerWidth - hr.left - p.offsetWidth - 8));
    setPlace({ left: x, top: up ? br.top - hr.top - p.offsetHeight - 6 : br.bottom - hr.top + 6, ['--dm-origin' as string]: `${up ? 'bottom' : 'top'} ${align === 'end' ? 'right' : 'left'}` });
  }, [isOpen, align, side]);

  useEffect(() => {
    if (!isOpen) return;
    const down = (e: PointerEvent) => { const t = e.target as Node; if (!pop.current?.contains(t) && !btn.current?.contains(t)) set.current(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { set.current(false); btn.current?.focus(); } };
    const resize = () => set.current(false);
    document.addEventListener('pointerdown', down); document.addEventListener('keydown', key); addEventListener('resize', resize);
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); removeEventListener('resize', resize); };
  }, [isOpen]);

  const close = () => setOpen(false);
  return {
    open: isOpen,
    setOpen,
    close,
    /** Closes a moment after a choice, so the pick shows before the menu fades, as on designme.dev */
    closeSoon: () => setTimeout(() => set.current(false), 120),
    trigger: { ref: btn, 'aria-expanded': isOpen, 'aria-haspopup': 'menu' as const, onClick: () => setOpen(!isOpen) },
    pop: { ref: pop, className: cx('dm-pop', isOpen && 'dm-open'), style: place, inert: !isOpen }
  };
}
