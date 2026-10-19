'use client';
import { useEffect, useRef, useState, type AnimationEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Avatar, Think, Tip } from '../../lib/motion';
import '../../designme.css';
import './kanban-board.css';

export type KanbanBoardTone = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

export interface KanbanBoardColumn {
  key: string;
  /** Like "In progress" */
  title: string;
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
  className?: string;
}

const TONE: Record<KanbanBoardTone, string> = { blue: 'dm-b', purple: 'dm-l', green: 'dm-m', orange: 'dm-p', red: 'dm-r', yellow: 'dm-y', pink: 'dm-k', teal: 'dm-t' };
const uid = () => 'card-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/** What a card shows under its title; the card itself and the ghost under the pointer both use it */
function Face({ card }: { card: KanbanBoardCard }) {
  const working = card.progress != null;
  return (
    <>
      {working && <div className="dm-kbx-pr"><i style={{ width: Math.max(0, Math.min(1, card.progress ?? 0)) * 100 + '%' }} /></div>}
      <span className="dm-f">
        {card.tag && <span className={cx('dm-tag', card.tag.tone && TONE[card.tag.tone])}>{card.tag.label}</span>}
        {working && <Think />}
        {card.assignee && <Avatar initials={card.assignee.initials} color={card.assignee.color} />}
      </span>
    </>
  );
}

function Card({ card, entering: enters, dragging, editing, onDown, onDone, setRef }: {
  card: KanbanBoardCard; entering: boolean; dragging: boolean; editing: boolean;
  onDown: (e: ReactPointerEvent<HTMLDivElement>) => void; onDone: (title: string) => void; setRef: (el: HTMLDivElement | null) => void;
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
      <Face card={card} />
    </div>
  );
}

interface Drag { id: string; w: number; h: number; x: number; y: number }
interface Spot { column: string; index: number }

/** A board where you and the agent move cards, with drag and drop. */
export function KanbanBoard({ columns, cards, defaultCards = [], onCardsChange, onMove, onDraggingChange, newCard, onRename, addLabel = 'Add card', className }: KanbanBoardProps) {
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

  const down = (card: KanbanBoardCard) => (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button || editing === card.id) return;
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
    <div data-dm="" className={cx('dm-kbx', className)}>
      <div className="dm-kbx-cols">
        {columns.map(col => {
          const here = list.filter(c => c.column === col.key);
          const items: ReactNode[] = [];
          const hole = <div key="dm-kbx-ph" className="dm-kbx-ph" style={{ height: drag?.h }} />;
          let n = 0;
          for (const c of here) {
            if (c.id !== drag?.id) { if (spot?.column === col.key && spot.index === n) items.push(hole); n++; }
            items.push(<Card key={c.id} card={c} entering={enters(c)} dragging={c.id === drag?.id} editing={editing === c.id} onDown={down(c)}
              onDone={t => rename(c.id, t)} setRef={el => { if (el) els.current.set(c.id, el); else els.current.delete(c.id); }} />);
          }
          if (spot?.column === col.key && spot.index >= n) items.push(hole);
          return (
            <div key={col.key} className={cx('dm-kbx-c', over === col.key && 'dm-over')} ref={el => { if (el) cols.current.set(col.key, el); else cols.current.delete(col.key); }}>
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
      {ghost && drag && typeof document !== 'undefined' && createPortal(
        <div data-dm="" className={cx('dm-kbx-k dm-ghost', ghost.progress != null && 'dm-agent')} style={{ left: drag.x, top: drag.y, width: drag.w }} aria-hidden="true">
          <span className="dm-t">{ghost.title}</span>
          <Face card={ghost} />
        </div>, document.body)}
    </div>
  );
}
