'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { KanbanBoard, type KanbanBoardCard, type KanbanBoardColumn, type KanbanBoardMember } from '../components/kanban-board/KanbanBoard';
import { useStory } from './useScript';

/* ---------- Kanban board: a designer's sprint board, where the design agent finishes its card and picks up the next ---------- */
const COLUMNS: KanbanBoardColumn[] = [{ key: 'todo', title: 'To do' }, { key: 'doing', title: 'In progress', short: 'Doing', limit: 3 }, { key: 'done', title: 'Done', done: true }];
const MEMBERS: KanbanBoardMember[] = [
  { id: 'MK', name: 'Maya Kim', initials: 'MK', color: 'var(--dm-av-l)' },
  { id: 'JO', name: 'Jonas Ortiz', initials: 'JO', color: 'var(--dm-av-m)' },
  { id: 'LP', name: 'Lena Park', initials: 'LP', color: 'var(--dm-av-p)' },
  { id: 'DA', name: 'Design agent', initials: 'DA', color: 'var(--dm-av-b)', agent: true }
];
// due dates are days from today, so the overdue one is always overdue
const day = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const tasks = (...t: [string, boolean?][]) => t.map(([title, done]) => ({ title, done: !!done }));
const CARDS: KanbanBoardCard[] = [
  { id: 'DES-148', column: 'todo', title: 'Audit checkout for contrast', priority: 'high', labels: ['A11y'], assignees: ['DA'], due: day(3), subtasks: tasks(['List every text pair'], ['Check against 4.5:1'], ['Fix the failing pairs'], ['Write up the changes']) },
  { id: 'DES-151', column: 'todo', title: 'Write release notes for pricing', priority: 'medium', labels: ['Copy'], assignees: ['MK'], due: day(2), comments: 2 },
  { id: 'DES-157', column: 'todo', title: 'Pricing toggle hides the yearly saving', priority: 'urgent', labels: ['Bug'], assignees: ['JO'], due: day(1), comments: 4, attachments: 1 },
  { id: 'DES-155', column: 'todo', title: 'Empty state for search', priority: 'low', labels: ['Design'], assignees: ['LP'], attachments: 2 },
  { id: 'DES-142', column: 'doing', title: 'Export tokens to CSS', priority: 'high', labels: ['Code'], assignees: ['DA'], attachments: 1, progress: .4, subtasks: tasks(['Read the Figma variables', true], ['Map colours to roles', true], ['Write the CSS variables'], ['Check contrast pairs'], ['Open a pull request']) },
  { id: 'DES-144', column: 'doing', title: 'Review annual plan copy', priority: 'medium', labels: ['Copy'], assignees: ['JO', 'MK'], due: day(-1), comments: 5, subtasks: tasks(['Headline', true], ['Plan names', true], ['Feature list'], ['Footnotes']) },
  { id: 'DES-146', column: 'doing', title: 'Plan cards wrap at 768px', priority: 'high', labels: ['Design', 'Bug'], assignees: ['LP'], due: day(0), comments: 1, subtasks: tasks(['Reproduce on a tablet', true], ['Fix the grid'], ['Test at 744px']) },
  { id: 'DES-139', column: 'done', title: 'One CTA per pricing card', priority: 'medium', labels: ['Design'], assignees: ['MK'], comments: 3, subtasks: tasks(['Pick the CTA', true], ['Update the cards', true]) },
  { id: 'DES-137', column: 'done', title: 'Compare checkout flows', priority: 'low', labels: ['Design'], assignees: ['LP'], attachments: 3, subtasks: tasks(['Collect five flows', true], ['Note the steps', true], ['Share the findings', true]) }
];
const LABELS = ['Design', 'Copy', 'Code', 'Bug', 'A11y'];

export default function KanbanBoardDemo() {
  const [cards, setCards] = useState(CARDS);
  const latest = useRef(cards);
  useEffect(() => { latest.current = cards; });
  const put = (next: KanbanBoardCard[]) => { latest.current = next; setCards(next); };
  const [column, setColumn] = useState('doing');
  const [next, setNext] = useState(158);
  const box = useRef<HTMLDivElement>(null);

  // every 600ms the agent's card fills a little and ticks off its subtasks; at the end it goes to Done and the agent picks up
  // its next card. The story holds while the pointer rests on the board and stops for good once the visitor takes over
  useStory(box, async ({ wait }) => {
    for (;;) {
      await wait(600);
      const list = latest.current, card = list.find(c => c.progress != null);
      if (!card) return;
      const progress = Math.min(1, (card.progress ?? 0) + .08), n = card.subtasks?.length ?? 0, d = Math.min(n, Math.floor(progress * n + 1e-9));
      const subtasks = card.subtasks?.map((s, i) => ({ ...s, done: i < d }));
      if (progress < 1) { put(list.map(c => c.id === card.id ? { ...c, progress, subtasks } : c)); continue; }
      put([...list.filter(c => c.id !== card.id), { ...card, column: 'done', progress: undefined, subtasks }]);
      setColumn('done');
      const up = latest.current.find(c => c.column === 'todo' && c.assignees?.includes('DA'));
      if (!up) return;
      await wait(900);
      const rest = latest.current.filter(c => c.id !== up.id), at = rest.findIndex(c => c.column === 'doing');
      rest.splice(at < 0 ? rest.length : at, 0, { ...up, column: 'doing', progress: 0 });
      put(rest);
      await wait(700);
      setColumn('doing');
    }
  });

  return (
    <div ref={box} style={{ width: '100%' }}>
      <KanbanBoard title="Website refresh" subtitle={`Sprint 14 · ${cards.filter(c => c.column === 'done').length} of ${cards.length} done`}
        columns={COLUMNS} members={MEMBERS} labels={LABELS} cards={cards} column={column} onColumnChange={setColumn}
        // a card dropped in Done stops being worked on
        onCardsChange={list => put(list.map(c => c.column === 'done' && c.progress != null ? { ...c, progress: undefined } : c))}
        newCard={key => { setNext(n => n + 1); return { id: `DES-${next}`, column: key, title: 'New card', priority: 'none', assignees: ['MK'] }; }} />
    </div>
  );
}
