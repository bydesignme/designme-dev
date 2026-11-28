# Context menu

> Right-click an agent reply for its actions, with a submenu that asks the agent about it.

App basics / Collaboration. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/context-menu

## Install

```sh
npx designme add context-menu          # HTML, CSS and JS, with the shared core
npx designme add context-menu --react  # React 19 component and its CSS
npx designme add context-menu --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/context-menu.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/context-menu.json  # Astro
```

## About

A menu that opens where you right-click an agent reply, or where you long-press it on a touch screen, or at its corner with Shift+F10 or the Menu key. It holds the usual actions with their shortcuts, an Ask the agent item with a submenu (Explain, Summarise, Rewrite shorter), a checkable item and a delete that asks again before it runs. In the demo the agent's summary streams in under the reply.

### When to use it

- On messages, files or rows that have several actions you don't want to show as buttons all the time.
- When some of those actions hand the item to the agent, grouped in a submenu.
- When a destructive action needs a second press rather than a separate dialog.

### What it does

- Opens at the pointer for a right-click or a long press (half a second), and at the target's top left for Shift+F10 or the Menu key.
- Turns back from the right edge so it stays inside the card. Short of room below (the foot of the screen, or a box round it that would cut it off) it opens upward from the point, or moves up just enough to stay whole, so it is never cut off.
- The submenu opens when the pointer rests on its item, with Right, or with Enter; on a wide screen it sits beside the menu, its first item level with the item that opened it (which carries a chevron), on the right or on the left when the screen has no room there; it is placed against the screen, not the box round the reply. Only on a phone does it drop under its item.
- Items take an icon, a shortcut hint, a hairline above them (`separator`), `checked` for a checkable item, and `danger` for red.
- `confirmLabel` makes an item ask again: the first press changes its label ("Press again to delete"), the second runs it.
- A press anywhere outside closes it; choosing an item closes it and calls `onSelect` with the item's key (a checkable item keeps it open).
- While its menu is open the target takes a quiet, deeper fill. In the demo, what an action did shows for a moment on the reply's head line ("Copied"), and the agent's summary appears under the reply as plain text once it is written; the reply grows to hold it, and shrinks to an Undo row when deleted.

### Accessibility

- The menus have role="menu"; items are menuitem or menuitemcheckbox with aria-checked, and the submenu's item has aria-haspopup and aria-expanded.
- Up and Down move through the items and wrap, Home and End go to the ends, and a letter jumps to the next item starting with it.
- Right opens the submenu with the focus on its first item; Left or Escape closes it and puts the focus back on its item.
- Escape closes the menu and gives the focus back to the target; Tab closes it.
- The target is focusable and its label says to press Shift+F10 for actions. Opened from the keyboard or by a real right-click, the menu takes the focus; a demo leaves it where it is.
- A closed menu is inert, so Tab and screen readers pass over it.

## Usage in React

```tsx
import { ContextMenu } from '@/components/designme/context-menu/ContextMenu';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: right-click the reply, ask the agent for a
// summary, and it streams in under the reply.
import { useEffect, useRef, useState } from 'react';
import { ContextMenu, type ContextMenuItem } from './ContextMenu';
import { Icon } from '../lib/icons';
import { useGrow } from '../lib/motion';
import { useStory, useWait } from '../lib/useScript';

const TEXT = 'Most of the checkout drop-off is on mobile. 61% of the people who leave do it at the address step, where the keyboard covers the Continue button. Moving Continue above the keyboard should win back about 300 orders a week.';
const ASK: Record<string, [string, 'info' | 'list' | 'edit', string]> = {
  explain: ['Explanation', 'info', 'On a phone the keyboard takes the lower half of the screen. The Continue button sits there, so people have to close the keyboard to find it, and many leave instead.'],
  sum: ['Summary', 'list', 'Mobile shoppers drop at the address step because the keyboard hides Continue. Moving it up could win back about 300 orders a week.'],
  rewrite: ['Shorter', 'edit', 'Mobile checkout loses people at the address step: the keyboard hides Continue. Move it up to win back about 300 orders a week.']
};

export default function ContextMenuDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [follow, setFollow] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [deleted, setDeleted] = useState(false);
  // what an action did: said to screen readers, and shown for a moment on the reply's head line with a green tick (a pin shows
  // its own Pinned, Ask the agent its answer)
  const [note, setNote] = useState('');
  const [ok, setOk] = useState<{ text: string; out: boolean } | null>(null);
  const confirm = (t: string) => { setNote(t); setOk({ text: t, out: false }); };
  useEffect(() => {
    if (!ok) return;
    const t = setTimeout(() => ok.out ? setOk(null) : setOk({ ...ok, out: true }), ok.out ? 240 : 2400);
    return () => clearTimeout(t);
  }, [ok]);
  // the card grows to hold what the agent writes, and shrinks to the Undo row, eased
  const [box, boxIn] = useGrow();
  const [out, setOut] = useState<{ k: string; text: string; busy: boolean } | null>(null);
  const run = useRef(0);
  const items: ContextMenuItem[] = [
    { key: 'copy', label: 'Copy text', icon: 'copy', shortcut: '⌘C' },
    { key: 'quote', label: 'Quote in reply', icon: 'quote', shortcut: 'R' },
    { key: 'pin', label: pinned ? 'Unpin' : 'Pin to thread', icon: 'pin', shortcut: 'P' },
    { key: 'ask', label: 'Ask the agent', icon: 'spark', separator: true, items: [
      { key: 'explain', label: 'Explain', icon: 'info' }, { key: 'sum', label: 'Summarise', icon: 'list' }, { key: 'rewrite', label: 'Rewrite shorter', icon: 'edit' }] },
    { key: 'follow', label: 'Follow replies', icon: 'bell', checked: follow },
    { key: 'del', label: 'Delete reply', icon: 'trash', shortcut: '⌫', danger: true, confirmLabel: 'Press again to delete', separator: true }
  ];
  const ask = async (k: string) => {
    const id = ++run.current, text = ASK[k][2].split(' ');
    setOut({ k, text: '', busy: true }); await wait(900);
    for (let i = 1; i <= text.length && id === run.current; i++) { setOut({ k, text: text.slice(0, i).join(' '), busy: false }); await wait(55); }
  };
  const select = (k: string) => {
    if (k === 'copy') { navigator.clipboard?.writeText(TEXT).catch(() => {}); confirm('Copied'); }
    if (k === 'quote') confirm('Quoted in your reply');
    if (k === 'pin') { setPinned(p => !p); setNote(pinned ? 'Unpinned' : 'Pinned to the thread'); setOk(null); }
    if (k === 'follow') { setFollow(f => !f); confirm(follow ? 'Not following replies' : 'Following replies'); }
    if (k === 'del') { setDeleted(true); setNote('Reply deleted'); setOk(null); }
    if (ASK[k]) { setOk(null); void ask(k); }
  };
  // the preview's story: right-click the reply, open Ask the agent, pick Summarise
  useStory(ref, async ({ wait, press }) => {
    await wait(1500);
    const p = ref.current?.querySelector('.dm-cxm-tx'); if (!p) return;
    const b = p.getBoundingClientRect();
    p.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: b.left + b.width * .62, clientY: b.top + b.height * .58 }));
    await wait(1000); press('.dm-cxm-sub');
    await wait(1000); press('.dm-cxm-pop2 [data-k="sum"]');
  });
  return (
    <div ref={el => { ref.current = el; box.current = el; }} data-dm="" className="dm-growing" style={{ width: '100%', overflow: 'visible' }}><div ref={boxIn} className="dm-grow">
      {deleted
        ? <div className="dm-cxm" data-dm=""><div className="dm-cxm-gone dm-enter">Reply deleted<button type="button" className="dm-pill dm-ghost dm-sm" onClick={() => { setDeleted(false); setNote('Reply restored'); }}>Undo</button></div></div>
        : <ContextMenu items={items} onSelect={select} label="Reply actions" targetLabel="Agent reply. Press Shift+F10 for actions">
            <div className="dm-cxm-hd"><span className="dm-cxm-av"><Icon name="spark" /></span><span className="dm-cxm-ht"><b>Agent</b><span className="dm-muted dm-num">2:14 pm</span></span>{ok && <span className={ok.out ? 'dm-cxm-ok dm-out' : 'dm-cxm-ok'}><Icon name="check" size="xs" /><span>{ok.text}</span></span>}{pinned && <span className="dm-cxm-pin"><Icon name="pin" />Pinned</span>}</div>
            <p className="dm-cxm-tx">{TEXT}</p>
            <div className="dm-cxm-out" aria-live="polite">{out && <div className="dm-cxm-res dm-enter"><span className="dm-k"><Icon name={ASK[out.k][1]} size="xs" /><span className={out.busy ? 'dm-shim' : undefined}>{out.busy ? `Writing a ${ASK[out.k][0].toLowerCase()}` : ASK[out.k][0]}</span></span><span>{out.text}</span></div>}</div>
          </ContextMenu>}
      <p className="dm-cxm-note" data-dm="" aria-live="polite">{note}</p>
    </div></div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `items` | `ContextMenuItem[]` |  |
| `onSelect` | `(key: string, item: ContextMenuItem) => void` | Called with the item chosen (in a submenu too) |
| `label` (optional) | `string` | The menu's name for screen readers, like "Reply actions" |
| `targetLabel` (optional) | `string` | The target's name for screen readers. Defaults to "Press Shift+F10 for actions" |
| `targetClassName` (optional) | `string` | Classes for the target. Defaults to an agent reply's panel |
| `children` | `ReactNode` | What you right-click: an agent reply, a row, a file |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ContextMenu from '../components/designme/context-menu/ContextMenu.astro';
---
<ContextMenu />
<ContextMenu data-style="soft" class="my-class" />
```
It plays its demo; change `context-menu.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Can I use it on something other than a reply?**

Yes. `children` is whatever you right-click, and `targetClassName` replaces the reply's panel classes with your own.

**How do I make a checkable item?**

Give the item `checked` (true or false). It becomes a menuitemcheckbox with a check mark, and `onSelect` tells you it was pressed so you can flip it.

**Does it replace the browser's own menu everywhere?**

No, only on the target. Everywhere else a right-click still opens the browser's menu.

## Source

`ContextMenu.tsx`, as `npx designme add context-menu --react` installs it:

```tsx
'use client';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useIsoLayoutEffect } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import '../designme.css';
// its menus' rows glide in Clean
import '../lib/glide';
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

/** The room a menu may open into: the window, cut by any box round the target that clips what spills out of it */
function roomOf(el: HTMLElement) {
  let top = 0, bottom = innerHeight;
  for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
    if (getComputedStyle(a).overflowY === 'visible') continue;
    const r = a.getBoundingClientRect(); top = Math.max(top, r.top); bottom = Math.min(bottom, r.bottom);
  }
  return { top, bottom };
}

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
  // the room across is the screen, not the box round the target, so the submenu has room beside its item
  const bounds = () => ({ lo: 8, hi: innerWidth - 8 });
  // where a menu goes: at the point, turned back from the right and bottom edges so it stays on screen
  const fit = (m: HTMLElement, x: number, y: number) => {
    const rb = root.current!.getBoundingClientRect(), { lo, hi } = bounds(), w = m.offsetWidth, h = m.offsetHeight;
    if (rb.left + x + w > hi) x -= w;
    x = Math.max(lo - rb.left, Math.min(x, hi - rb.left - w));
    // short of room below (the screen's foot, or a box round it that would cut it off), it opens upward from the point; where
    // neither way fits, it moves up just enough to end inside the room, so it is never cut off
    const room = roomOf(root.current!), top = room.top + 8 - rb.top, bottom = room.bottom - 8 - rb.top;
    let up = false;
    if (y + h > bottom) { if (y - h >= top) { y -= h; up = true; } else y = Math.max(top, bottom - h); }
    m.style.left = x + 'px'; m.style.top = y + 'px'; m.style.setProperty('--dm-origin', (up ? 'bottom ' : 'top ') + 'left');
  };
  useIsoLayoutEffect(() => { if (at && menu.current) { fit(menu.current, at.x, at.y); if (at.keyed) itemsOf(menu.current)[0]?.focus({ preventScroll: true }); } }, [at]);
  // on a wide screen the submenu opens beside its item, on the right or else the left, its first item level with the item; only
  // on a phone, or where neither side has room, does it drop under the item
  useIsoLayoutEffect(() => {
    const m = subMenu.current, p = menu.current; if (!sub || !m || !p) return;
    const row = p.querySelector<HTMLElement>(`[data-k="${sub.key}"]`)!, pr = p.getBoundingClientRect(), b = row.getBoundingClientRect(), rb = root.current!.getBoundingClientRect(), { lo, hi } = bounds(), w = m.offsetWidth;
    const cs = getComputedStyle(m), top = b.top - rb.top - parseFloat(cs.paddingTop) - parseFloat(cs.borderTopWidth), wide = innerWidth >= 640;
    if (wide && pr.right - 4 + w <= hi) fit(m, pr.right - rb.left - 4, top);
    else if (wide && pr.left + 4 - w >= lo) fit(m, pr.left - rb.left + 4 - w, top);
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
```

## More in Collaboration

- [Banner](https://designme.dev/components/banner.md): An announcement on a tint of its tone, with its own line drawing.
- [Comments](https://designme.dev/components/comments.md): A design thread where you can @mention the agent and it replies.

All components: https://designme.dev/llms.txt
