# Kanban board

> A board where you and the agent move cards, with drag and drop.

App basics / Collaboration. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/kanban-board

## Install

```sh
npx designme add kanban-board          # HTML, CSS and JS, with the shared core
npx designme add kanban-board --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Kanban board is a task board with columns such as To do, In progress and Done, where people drag cards between columns and the agent moves its own cards as it works. A card the agent is working on gets an accent edge, a progress bar and the thinking dots. It lets a team see the agent's work in the same place as everyone else's.

### When to use it

- When an agent picks up tasks from a shared backlog and the team should watch it progress
- When people and the agent work from one board and either can move a card
- When you need a simple drag and drop board with no extra library
- When new ideas should be added to a column and named on the spot

### What it does

- Dragging a card shows a floating copy under the pointer and a placeholder where it will land, and the column under the pointer highlights.
- A dropped card gets a small pop, and `onMove` reports its id, new column and position within that column.
- Setting `progress` from 0 to 1 marks a card as the agent's work in progress, with a bar that fills.
- Cards that arrive later, or are moved by someone else, come in with an entrance animation.
- Each column's + button adds a card at the end with its title selected for typing; Enter saves and `onRename` reports it.
- Cards can carry a coloured `tag` in one of eight tones and an `assignee` avatar, and each column header shows its count.
- Under 640px wide, on a phone or in a narrow card, the board shows one column at a time, picked with tabs that count each column's cards (a column's `short` name labels its tab). The + beside the tabs adds to that column, and each card's menu moves it to another column. Control the column with `column` and `onColumnChange`.

### Accessibility

- Each column's + button has an `aria-label`, "Add card" by default, and a tooltip.
- The floating copy shown while dragging is `aria-hidden`, so it is not read twice.
- On a narrow board the column tabs are a group labelled "Column" with `aria-pressed` on the one shown, and each card's menu button is labelled "Move card"; its menu lists the columns as `menuitemradio`s with the card's own column checked.
- From the keyboard, Enter, Space or the down arrow opens a menu with the focus on its picked item, or its first (the up arrow, on its last); the arrow keys move through it and wrap, Home and End jump to the ends, Tab closes it and moves on, and closing it gives the focus back to its button.

## Usage in React

```tsx
import { KanbanBoard } from '@/components/designme/kanban-board/KanbanBoard';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { KanbanBoard, type KanbanBoardCard } from './KanbanBoard';
import { useScript, useTakeover } from '../lib/useScript';

/* ---------- Kanban board: the design agent works through its cards while you drag the rest around ---------- */
const COLUMNS = [{ key: 'todo', title: 'To do' }, { key: 'doing', title: 'In progress', short: 'Doing' }, { key: 'done', title: 'Done' }];
const AGENT = { initials: 'DA', color: 'var(--dm-av-b)' }, MAYA = { initials: 'MK', color: 'var(--dm-av-l)' };
const DESIGN = { label: 'Design', tone: 'blue' as const }, COPY = { label: 'Copy', tone: 'purple' as const };
const CARDS: KanbanBoardCard[] = [
  { id: '1', column: 'todo', title: 'Audit checkout for contrast', tag: DESIGN, assignee: AGENT },
  { id: '2', column: 'todo', title: 'Write release notes for pricing', tag: COPY, assignee: MAYA },
  { id: '3', column: 'todo', title: 'Rename layers in Hero', tag: DESIGN, assignee: AGENT },
  { id: '4', column: 'doing', title: 'Export tokens to CSS', tag: { label: 'Code', tone: 'green' }, assignee: AGENT, progress: .4 },
  { id: '5', column: 'doing', title: 'Review annual plan copy', tag: COPY, assignee: { initials: 'JO', color: 'var(--dm-av-m)' } },
  { id: '6', column: 'done', title: 'One CTA per pricing card', tag: DESIGN, assignee: MAYA }
];

export default function KanbanBoardDemo() {
  const [cards, setCards] = useState(CARDS);
  const latest = useRef(cards);
  useEffect(() => { latest.current = cards; });
  const put = (next: KanbanBoardCard[]) => { latest.current = next; setCards(next); };
  const dragging = useRef(false);
  // a narrow board shows one column: it follows the agent's card until the visitor takes over
  const box = useRef<HTMLDivElement>(null), mine = useTakeover(box);
  const [column, setColumn] = useState('doing');
  const follow = (key: string) => { if (!mine()) setColumn(key); };

  // every 600ms the agent's card fills a little; when it is done it moves to Done and the agent picks up its next card
  useScript(async ({ wait }) => {
    for (;;) {
      await wait(600);
      if (dragging.current) continue;
      const list = latest.current, card = list.find(c => c.progress != null);
      if (!card) continue;
      const progress = Math.min(1, (card.progress ?? 0) + .08);
      if (progress < 1) { put(list.map(c => c.id === card.id ? { ...c, progress } : c)); continue; }
      put([...list.filter(c => c.id !== card.id), { ...card, column: 'done', progress: undefined }]);
      follow('done');
      const next = latest.current.find(c => c.column === 'todo' && c.assignee === AGENT);
      if (next) wait(900).then(() => {
        const now = latest.current.find(c => c.id === next.id); if (!now) return;
        const rest = latest.current.filter(c => c.id !== next.id), at = rest.findIndex(c => c.column === 'doing');
        rest.splice(at < 0 ? rest.length : at, 0, { ...now, column: 'doing', progress: 0 });
        put(rest);
        wait(700).then(() => follow('doing'));
      });
    }
  });

  return (
    <div ref={box} style={{ width: '100%' }}>
    <KanbanBoard columns={COLUMNS} cards={cards} column={column} onColumnChange={setColumn}
      // a card dropped in Done stops being worked on
      onCardsChange={next => put(next.map(c => c.column === 'done' && c.progress != null ? { ...c, progress: undefined } : c))}
      onDraggingChange={d => { dragging.current = d; }}
      newCard={key => ({ id: String(Date.now()), column: key, title: 'New card', tag: { label: 'Idea', tone: 'pink' }, assignee: MAYA })} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `columns` | `KanbanBoardColumn[]` |  |
| `cards` (optional) | `KanbanBoardCard[]` | The cards, in order: a column shows its cards in the order they come here. Leave it out to let drags and the + buttons change them |
| `defaultCards` (optional) | `KanbanBoardCard[]` |  |
| `onCardsChange` (optional) | `(cards: KanbanBoardCard[]) => void` |  |
| `onMove` (optional) | `(id: string, column: string, index: number) => void` | Called when a card is dropped, with the column and its place among that column's other cards |
| `onDraggingChange` (optional) | `(dragging: boolean) => void` | Called with true when a card starts moving with the pointer and false when it lands, for pausing anything that would move cards meanwhile |
| `newCard` (optional) | `(column: string) => KanbanBoardCard` | Makes the card the + button adds to a column. It goes to the end of the column with its title ready to type |
| `onRename` (optional) | `(id: string, title: string) => void` | Called when a card's title is edited |
| `addLabel` (optional) | `string` | The + buttons' tooltip |
| `column` (optional) | `string` | The column a narrow board shows. A board under 640px wide shows one column at a time, picked with tabs that count each column's cards, and each card gets a menu to move it to another column. Defaults to the first column |
| `defaultColumn` (optional) | `string` |  |
| `onColumnChange` (optional) | `(column: string) => void` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I show the agent working through its cards?**

Control the board with `cards` and raise a card's `progress` toward 1 as the agent works. When it finishes, move the card to your done column and clear `progress`, as the example does.

**How do I stop the agent from moving cards while someone is dragging?**

Use `onDraggingChange`. It is called with true when a card starts moving with the pointer and false when it lands, so you can pause your updates in between.

**Can cards be moved with the keyboard?**

Dragging uses pointer events only. On a narrow board each card also has a Move card button that opens a Move to menu of the columns. You can always move cards from code by changing a card's `column` in `cards`.

**What does a new card look like?**

By default it is titled "New card" with a pink Idea tag. Pass `newCard(column)` to return your own card, such as one already assigned to the current user.

## Source

`KanbanBoard.tsx`, as `npx designme add kanban-board --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type AnimationEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Avatar, Seg, Think, Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './kanban-board.css';

export type KanbanBoardTone = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

export interface KanbanBoardColumn {
  key: string;
  /** Like "In progress" */
  title: string;
  /** A shorter name for the tabs of a narrow board, like "Doing". Defaults to the title */
  short?: string;
}

export interface KanbanBoardCard {
  id: string;
  /** The key of the column it sits in */
  column: string;
  title: string;
  /** A small coloured label, like { label: 'Design', tone: 'blue' } */
  tag?: { label: string; tone?: KanbanBoardTone };
  /** Who has it, shown as a small avatar */
  assignee?: { initials: string; color: string };
  /** 0 to 1 while the agent works on it: the card gets an accent edge, a progress bar and the thinking mark */
  progress?: number;
}

export interface KanbanBoardProps {
  columns: KanbanBoardColumn[];
  /** The cards, in order: a column shows its cards in the order they come here. Leave it out to let drags and the + buttons change them */
  cards?: KanbanBoardCard[];
  defaultCards?: KanbanBoardCard[];
  onCardsChange?: (cards: KanbanBoardCard[]) => void;
  /** Called when a card is dropped, with the column and its place among that column's other cards */
  onMove?: (id: string, column: string, index: number) => void;
  /** Called with true when a card starts moving with the pointer and false when it lands, for pausing anything that would move cards meanwhile */
  onDraggingChange?: (dragging: boolean) => void;
  /** Makes the card the + button adds to a column. It goes to the end of the column with its title ready to type */
  newCard?: (column: string) => KanbanBoardCard;
  /** Called when a card's title is edited */
  onRename?: (id: string, title: string) => void;
  /** The + buttons' tooltip */
  addLabel?: string;
  /** The column a narrow board shows. A board under 640px wide shows one column at a time, picked with tabs that count each
      column's cards, and each card gets a menu to move it to another column. Defaults to the first column */
  column?: string;
  defaultColumn?: string;
  onColumnChange?: (column: string) => void;
  className?: string;
}

const TONE: Record<KanbanBoardTone, string> = { blue: 'dm-b', purple: 'dm-l', green: 'dm-m', orange: 'dm-p', red: 'dm-r', yellow: 'dm-y', pink: 'dm-k', teal: 'dm-t' };
const uid = () => 'card-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/** What a card shows under its title; the card itself and the ghost under the pointer both use it */
function Face({ card, children }: { card: KanbanBoardCard; children?: ReactNode }) {
  const working = card.progress != null;
  return (
    <>
      {working && <div className="dm-kbx-pr"><i style={{ width: Math.max(0, Math.min(1, card.progress ?? 0)) * 100 + '%' }} /></div>}
      <span className="dm-f">
        {card.tag && <span className={cx('dm-tag', card.tag.tone && TONE[card.tag.tone])}>{card.tag.label}</span>}
        {working && <Think />}
        {card.assignee && <Avatar initials={card.assignee.initials} color={card.assignee.color} />}
        {children}
      </span>
    </>
  );
}

function Card({ card, entering: enters, dragging, editing, onDown, onDone, setRef, moveOpen, onMoveMenu }: {
  card: KanbanBoardCard; entering: boolean; dragging: boolean; editing: boolean;
  onDown: (e: ReactPointerEvent<HTMLDivElement>) => void; onDone: (title: string) => void; setRef: (el: HTMLDivElement | null) => void;
  moveOpen: boolean; onMoveMenu: (button: HTMLButtonElement, key: boolean) => void;
}) {
  // a card that arrives after the board appears comes in once, then drops the entrance so a drag can fade it
  const [entering, setEntering] = useState(enters);
  const title = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const t = title.current; if (!editing || !t) return;
    t.focus(); document.getSelection()?.selectAllChildren(t);
  }, [editing]);
  return (
    <div ref={setRef} className={cx('dm-kbx-k', card.progress != null && 'dm-agent', dragging && 'dm-drag', entering && 'dm-enter')} onPointerDown={onDown}
      onAnimationEnd={(e: AnimationEvent) => { if (e.target === e.currentTarget && entering) setEntering(false); }}>
      {/* keyed by the title, so an edit always starts from what was saved */}
      <span key={card.title} ref={title} className="dm-t" contentEditable={editing} suppressContentEditableWarning
        onBlur={editing ? e => onDone(e.currentTarget.textContent ?? '') : undefined}
        onKeyDown={editing ? e => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } } : undefined}>{card.title}</span>
      <Face card={card}>
        <Tip label="Move to" off={moveOpen}>
          <button type="button" className="dm-ib dm-kbx-mv" aria-label="Move card" aria-haspopup="menu" aria-expanded={moveOpen} onClick={e => onMoveMenu(e.currentTarget, e.detail === 0)}><Icon name="more" size="xs" /></button>
        </Tip>
      </Face>
    </div>
  );
}

interface Drag { id: string; w: number; h: number; x: number; y: number }
interface Spot { column: string; index: number }

/** A board where you and the agent move cards, with drag and drop. */
export function KanbanBoard({ columns, cards, defaultCards = [], onCardsChange, onMove, onDraggingChange, newCard, onRename, addLabel = 'Add card', column, defaultColumn, onColumnChange, className }: KanbanBoardProps) {
  const [list, setList] = useControllable(cards, defaultCards, onCardsChange);
  const latest = useRef(list);
  useEffect(() => { latest.current = list; });
  const [drag, setDrag] = useState<Drag | null>(null);
  const [spot, setSpot] = useState<Spot | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [dropped, setDropped] = useState<{ id: string; n: number } | null>(null);
  const cols = useRef(new Map<string, HTMLDivElement>());
  const els = useRef(new Map<string, HTMLDivElement>());
  const stop = useRef<() => void>(undefined);
  useEffect(() => () => stop.current?.(), []);

  // cards that are new, or moved by someone else, come in with the entrance; a dropped card gets its own little pop
  const mounted = useRef(false);
  const seen = useRef(new Map<string, string>());
  useEffect(() => { mounted.current = true; seen.current = new Map(list.map(c => [c.id, c.column])); });
  const landing = useRef<string | null>(null);
  const enters = (c: KanbanBoardCard) => mounted.current && seen.current.get(c.id) !== c.column && landing.current !== c.id;
  useIsoLayoutEffect(() => {
    if (!dropped) return;
    landing.current = null;
    els.current.get(dropped.id)?.animate([{ transform: 'scale(1.04)' }, { transform: 'none' }], { duration: 350, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }, [dropped]);

  /* ---------- a narrow board: one column at a time, and a menu on each card to move it ---------- */
  const [shown, setShown] = useControllable(column, defaultColumn ?? columns[0]?.key ?? '', onColumnChange);
  const bar = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    // the column coming into view comes in, the way the site's does
    const el = cols.current.get(shown); if (!el || !bar.current?.getClientRects().length) return;
    el.classList.remove('dm-enter'); void el.offsetWidth; el.classList.add('dm-enter');
  }, [shown]);
  const moveMenu = usePopover({ align: 'end' });
  const [moving, setMoving] = useState<string | null>(null);
  // opened with Enter or Space, the menu takes the focus on the card's column
  const openMove = (id: string, button: HTMLButtonElement, key = false) => {
    const again = moveMenu.open && moving === id;
    moveMenu.trigger.ref.current = button; setMoving(id);
    if (again) moveMenu.setOpen(false); else if (key) moveMenu.openFocused(); else moveMenu.setOpen(true);
  };
  // picked with the keyboard, the focus stays on the column's tab once the card has gone to its new column
  const board = useRef<HTMLDivElement>(null);
  const moveTo = (to: string) => {
    if (moveMenu.pop.ref.current?.contains(document.activeElement)) setTimeout(() => { const b = moveMenu.trigger.ref.current; if (!b || !b.isConnected || !b.getClientRects().length) board.current?.querySelector<HTMLElement>('.dm-kbx-tabs [aria-pressed="true"]')?.focus({ preventScroll: true }); }, 200);
    moveMenu.closeSoon();
    const card = latest.current.find(c => c.id === moving); if (!card || card.column === to) return;
    const rest = latest.current.filter(c => c.id !== card.id), index = rest.filter(c => c.column === to).length;
    setList([...rest, { ...card, column: to }]); onMove?.(card.id, to, index);
  };

  const down = (card: KanbanBoardCard) => (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button || editing === card.id || (e.target as Element).closest('.dm-kbx-mv')) return;
    const rc = e.currentTarget.getBoundingClientRect(), sx = e.clientX, sy = e.clientY, ox = sx - rc.left, oy = sy - rc.top;
    let moved = false, at: Spot | null = null;
    const move = (ev: PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 4) return;
      if (!moved) { moved = true; onDraggingChange?.(true); }
      setDrag({ id: card.id, w: rc.width, h: rc.height, x: ev.clientX - ox, y: ev.clientY - oy });
      const col = document.elementsFromPoint(ev.clientX, ev.clientY).find(x => [...cols.current.values()].includes(x as HTMLDivElement));
      const key = col && [...cols.current.entries()].find(([, el]) => el === col)?.[0];
      setOver(key ?? null);
      if (!key || !col) return;
      // the placeholder goes before the first card whose middle is below the pointer
      const sibs = [...col.querySelectorAll<HTMLElement>('.dm-kbx-list > .dm-kbx-k:not(.dm-drag)')];
      const after = sibs.findIndex(s => { const b = s.getBoundingClientRect(); return ev.clientY < b.top + b.height / 2; });
      at = { column: key, index: after < 0 ? sibs.length : after };
      setSpot(at);
    };
    const up = () => {
      stop.current?.();
      if (!moved) return;
      if (at) {
        const rest = latest.current.filter(c => c.id !== card.id), same = rest.filter(c => c.column === at!.column), before = same[at.index];
        const moving = { ...latest.current.find(c => c.id === card.id)!, column: at.column };
        const next = [...rest]; before ? next.splice(next.indexOf(before), 0, moving) : next.push(moving);
        setList(next); onMove?.(card.id, at.column, at.index);
      }
      setDrag(null); setSpot(null); setOver(null);
      landing.current = card.id;
      setDropped(d => ({ id: card.id, n: (d?.n ?? 0) + 1 }));
      onDraggingChange?.(false);
    };
    stop.current = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); stop.current = undefined; };
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up);
  };

  const add = (column: string) => {
    const card = newCard?.(column) ?? { id: uid(), column, title: 'New card', tag: { label: 'Idea', tone: 'pink' } };
    setList([...latest.current, card]); setEditing(card.id);
  };
  const rename = (id: string, text: string) => {
    const title = text.trim() || 'New card';
    setEditing(null);
    setList(latest.current.map(c => c.id === id ? { ...c, title } : c)); onRename?.(id, title);
  };

  const ghost = drag && list.find(c => c.id === drag.id);
  return (
    <div data-dm="" ref={board} className={cx('dm-kbx', className)}>
      <div ref={bar} className="dm-kbx-bar">
        <Seg className="dm-kbx-tabs" label="Column" value={shown} onChange={setShown}
          options={columns.map(col => { const n = list.filter(c => c.column === col.key).length; return { value: col.key, label: <>{col.short ?? col.title}<span key={n} className="dm-n dm-num dm-enter">{n}</span></> }; })} />
        <Tip label={addLabel}><button type="button" className="dm-ib dm-kbx-add" aria-label={addLabel} onClick={() => add(shown)}><Icon name="plus" size="xs" /></button></Tip>
      </div>
      <div className="dm-kbx-cols">
        {columns.map(col => {
          const here = list.filter(c => c.column === col.key);
          const items: ReactNode[] = [];
          const hole = <div key="dm-kbx-ph" className="dm-kbx-ph" style={{ height: drag?.h }} />;
          let n = 0;
          for (const c of here) {
            if (c.id !== drag?.id) { if (spot?.column === col.key && spot.index === n) items.push(hole); n++; }
            items.push(<Card key={c.id} card={c} entering={enters(c)} dragging={c.id === drag?.id} editing={editing === c.id} onDown={down(c)}
              moveOpen={moveMenu.open && moving === c.id} onMoveMenu={(b, key) => openMove(c.id, b, key)}
              onDone={t => rename(c.id, t)} setRef={el => { if (el) els.current.set(c.id, el); else els.current.delete(c.id); }} />);
          }
          if (spot?.column === col.key && spot.index >= n) items.push(hole);
          return (
            <div key={col.key} className={cx('dm-kbx-c', over === col.key && 'dm-over', shown === col.key && 'dm-on')} ref={el => { if (el) cols.current.set(col.key, el); else cols.current.delete(col.key); }}>
              <div className="dm-kbx-ch">
                <b>{col.title}</b>
                <span className="dm-n dm-num">{here.length}</span>
                <Tip label={addLabel}><button type="button" className="dm-ib" aria-label={addLabel} onClick={() => add(col.key)}><Icon name="plus" size="xs" /></button></Tip>
              </div>
              <div className="dm-kbx-list">{items}</div>
            </div>
          );
        })}
      </div>
      <div {...moveMenu.pop} className={cx(moveMenu.pop.className, 'dm-kbx-mp')} role="menu" aria-label="Move to">
        <div className="dm-ph">Move to</div>
        {columns.map(col => {
          const here = list.find(c => c.id === moving)?.column === col.key;
          return (
            <button key={col.key} type="button" className="dm-mi" role="menuitemradio" aria-checked={here} onClick={() => moveTo(col.key)}>
              <span>{col.title}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
            </button>
          );
        })}
      </div>
      {ghost && drag && typeof document !== 'undefined' && createPortal(
        <div data-dm="" className={cx('dm-kbx-k dm-ghost', ghost.progress != null && 'dm-agent')} style={{ left: drag.x, top: drag.y, width: drag.w }} aria-hidden="true">
          <span className="dm-t">{ghost.title}</span>
          <Face card={ghost} />
        </div>, document.body)}
    </div>
  );
}
```

## More in Collaboration

- [Comments](https://designme.dev/components/comments.md): A design thread where you can @mention the agent and it replies.
- [Notifications](https://designme.dev/components/notifications.md): An inbox where agent updates and mentions arrive live.
- [Banner](https://designme.dev/components/banner.md): An announcement on a tint of its tone, with its own line drawing.
- [Invite to collaborate](https://designme.dev/components/invite-to-collaborate.md): Add teammates by email as chips, set their role, send.
- [Reactions](https://designme.dev/components/reactions.md): Quick reactions on an agent update, with counts that pop.
- [Profile menu](https://designme.dev/components/profile-menu.md): The account menu behind an avatar: switch workspace, theme, shortcuts and sign out.
- [Context switcher](https://designme.dev/components/context-switcher.md): The organisation, project and environment you are in, each part a searchable switcher.
- [Filter menu](https://designme.dev/components/filter-menu.md): Add filters from a menu, see them as chips, and watch the count change.
- [Ticket list](https://designme.dev/components/ticket-list.md): Support tickets the agent has triaged, with suggested replies.

All components: https://designme.dev/llms.txt
