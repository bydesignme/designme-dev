'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { KanbanBoard, type KanbanBoardCard } from '../components/kanban-board/KanbanBoard';
import { useScript, useTakeover } from './useScript';

/* ---------- Kanban board: the design agent works through its cards while you drag the rest around ---------- */
const COLUMNS = [{ key: 'todo', title: 'To do' }, { key: 'doing', title: 'In progress', short: 'Doing' }, { key: 'done', title: 'Done' }];
const AGENT = { initials: 'DA', color: 'var(--dm-pb)' }, MAYA = { initials: 'MK', color: 'var(--dm-pl)' };
const DESIGN = { label: 'Design', tone: 'blue' as const }, COPY = { label: 'Copy', tone: 'purple' as const };
const CARDS: KanbanBoardCard[] = [
  { id: '1', column: 'todo', title: 'Audit checkout for contrast', tag: DESIGN, assignee: AGENT },
  { id: '2', column: 'todo', title: 'Write release notes for pricing', tag: COPY, assignee: MAYA },
  { id: '3', column: 'todo', title: 'Rename layers in Hero', tag: DESIGN, assignee: AGENT },
  { id: '4', column: 'doing', title: 'Export tokens to CSS', tag: { label: 'Code', tone: 'green' }, assignee: AGENT, progress: .4 },
  { id: '5', column: 'doing', title: 'Review annual plan copy', tag: COPY, assignee: { initials: 'JO', color: 'var(--dm-pm)' } },
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
