# Kanban board

> A sprint board where you and the agent move cards, with filters, details and keyboard moves.

App basics / Collaboration. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/kanban-board

## Install

```sh
npx designme add kanban-board          # HTML, CSS and JS, with the shared core
npx designme add kanban-board --react  # React 19 component and its CSS
npx designme add kanban-board --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/kanban-board.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/kanban-board.json  # Astro
```

## About

Kanban board is a sprint board with columns such as To do, In progress and Done, where people and an agent move cards. Each card shows its key and people, one row of chips (its priority in colour, the project it belongs to and its labels), its title, and one line with its due date, subtasks, comments and files, and the card an agent is working on says what it is doing as its bar fills. A header filters the board by person, label, priority or a search, switches between the board and a list, and each card opens a details sheet with a checklist you can tick.

### When to use it

- When an agent picks up tasks from a shared backlog and the team should watch it progress
- When people and the agent work from one board and either can move a card
- When a team needs a dense board: priorities, due dates, subtasks and owners at a glance
- When work in progress should stay under a limit, with a warning once a column holds too much
- When a board has to work from the keyboard as well as with drag and drop

### What it does

- Each card shows its key (like DES-142) with its people as initials avatars at the top right, then one row of chips: its priority in colour (Urgent red, High orange, Medium yellow, Low blue, none grey), a grey chip for the `project` it belongs to, and its labels, each in its own tag colour wherever it shows (`labelTones`, or the next colour in the order of `labels`). Under the title, one muted line holds the due date ("Today", "Tomorrow" or a date, in the bad text colour once it is past), subtasks done with a thin bar that turns green when they all are, and comment and file counts. Hover the priority and project chips and the counts for what they mean.
- A card with `progress` is the agent's: it gets an accent edge, the thinking dots, what it is doing now (`activity`, or its first open subtask) with a percentage, and a bar that fills.
- Drag a card to another column or to a new place in its own column: a floating copy follows the pointer, a placeholder shows where it will land and the column under it highlights. `onMove` reports the card, its column and its place there.
- Click a card to open its details sheet over the right of the board: status, priority and people (each opens its menu), the project, the due date, labels, the agent's progress, a checklist you can tick (it updates the card), and its comments and files. Arrow keys move the sheet from card to card.
- Click a card's priority chip or its avatars to change them in a menu, or its dots (they show on hover, just left of the avatars) to move it to another column. Each change calls `onChange` with the card.
- Shift-click, Cmd-click or Ctrl-click cards to pick several (Shift-click picks a range within a column); a bar over the foot of the board moves them all to a column at once, and Escape or its × clears the pick.
- Filter chips for assignee, label and priority each open a menu of values with how many cards have each; pick several. The facepile in the header filters by person too, and a search matches titles, keys and projects. Column counts read "2 of 4" while filtering, and when nothing matches the board says so with a Clear filters button.
- Each column header counts its cards in a grey chip; a column with a `limit` shows how full it is ("2/3"), and a warning chip once it holds more. Each column header can fold the column to a narrow strip (press it to open it again), add a card, and open a menu to select all, sort by priority or due date, or fold it.
- The view switch shows the same cards as a list, grouped by column, one row each; the list keeps the board's height. Cards still drag, open and pick in the list.
- The + buttons add a card at the end of a column with its title ready to type, and a double-click on any title (or F2) renames it; Enter saves, Escape cancels, and `onRename` reports it.
- Under 640px wide, on a phone or in a narrow card, the header stacks, the board shows one column at a time picked with tabs that count each column's cards, and the details sheet covers the board.
- Filters, view, folded columns, picked cards, the open card and the narrow board's column can each be controlled (`filters`, `view`, `collapsed`, `selected`, `open`, `column`) or left to the board.

### Accessibility

- Cards are list items with a label that reads their key, title, priority, project, people, due date, whether the agent is on it and whether they are picked. One card at a time is in the Tab order.
- From the keyboard, the arrow keys move between cards (up and down in a column, left and right across columns), Home and End go to a column's ends, Enter opens the details sheet, Space or x picks a card, Shift with an arrow picks as it moves, m opens Move to, p the priority, a the people, F2 renames, and Escape closes the sheet or clears the pick.
- Menus are `menu`s with `menuitemradio` (Move to, priority) or `menuitemcheckbox` (people, filters) items; they open on their checked item, the arrows move through them and wrap, and picking from the keyboard puts the focus back on the card or the sheet's field.
- The facepile is a group of toggle buttons with `aria-pressed`, the view switch and the narrow board's tabs are groups with `aria-pressed` on the one shown, and the checklist items are `checkbox`es.
- The details sheet is a labelled `dialog`; opened with Enter it takes the focus on its close button, and Escape returns it to the card.
- Moves, picks, filters and folds are announced in a polite live region, as is a column going over its limit. The floating copy shown while dragging is `aria-hidden`.

## Usage in React

```tsx
import { KanbanBoard } from '@/components/designme/kanban-board/KanbanBoard';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { KanbanBoard, type KanbanBoardCard, type KanbanBoardColumn, type KanbanBoardMember } from './KanbanBoard';
import { useStory } from '../lib/useScript';

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
  { id: 'DES-148', column: 'todo', title: 'Audit checkout for contrast', priority: 'high', project: 'Checkout', labels: ['A11y'], assignees: ['DA'], due: day(3), subtasks: tasks(['List every text pair'], ['Check against 4.5:1'], ['Fix the failing pairs'], ['Write up the changes']) },
  { id: 'DES-151', column: 'todo', title: 'Write release notes for pricing', priority: 'medium', project: 'Pricing', labels: ['Copy'], assignees: ['MK'], due: day(2), comments: 2 },
  { id: 'DES-157', column: 'todo', title: 'Pricing toggle hides the yearly saving', priority: 'urgent', project: 'Pricing', labels: ['Bug'], assignees: ['JO'], due: day(1), comments: 4, attachments: 1 },
  { id: 'DES-155', column: 'todo', title: 'Empty state for search', priority: 'low', project: 'Search', labels: ['Design'], assignees: ['LP'], attachments: 2 },
  { id: 'DES-142', column: 'doing', title: 'Export tokens to CSS', priority: 'high', project: 'Tokens', labels: ['Code'], assignees: ['DA'], attachments: 1, progress: .4, subtasks: tasks(['Read the Figma variables', true], ['Map colours to roles', true], ['Write the CSS variables'], ['Check contrast pairs'], ['Open a pull request']) },
  { id: 'DES-144', column: 'doing', title: 'Review annual plan copy', priority: 'medium', project: 'Pricing', labels: ['Copy'], assignees: ['JO', 'MK'], due: day(-1), comments: 5, subtasks: tasks(['Headline', true], ['Plan names', true], ['Feature list'], ['Footnotes']) },
  { id: 'DES-146', column: 'doing', title: 'Plan cards wrap at 768px', priority: 'high', project: 'Pricing', labels: ['Design', 'Bug'], assignees: ['LP'], due: day(0), comments: 1, subtasks: tasks(['Reproduce on a tablet', true], ['Fix the grid'], ['Test at 744px']) },
  { id: 'DES-139', column: 'done', title: 'One CTA per pricing card', priority: 'medium', project: 'Pricing', labels: ['Design'], assignees: ['MK'], comments: 3, subtasks: tasks(['Pick the CTA', true], ['Update the cards', true]) },
  { id: 'DES-137', column: 'done', title: 'Compare checkout flows', priority: 'low', project: 'Checkout', labels: ['Design'], assignees: ['LP'], attachments: 3, subtasks: tasks(['Collect five flows', true], ['Note the steps', true], ['Share the findings', true]) }
];
// each label takes the next core tag colour in this order: Design purple, Copy teal, Code green, Bug pink, A11y red
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
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` (optional) | `string` | The board's name, like "Website refresh" |
| `subtitle` (optional) | `string` | Beside the name, like "Sprint 14". Defaults to how many cards are done, when a column is marked `done` |
| `columns` | `KanbanBoardColumn[]` |  |
| `members` (optional) | `KanbanBoardMember[]` | The people (and agents) on the board: the facepile in the header, the Assignee filter and each card's people menu |
| `labels` (optional) | `string[]` | The labels the Label filter offers. Defaults to every label on the cards |
| `labelTones` (optional) | `Record<string, KanbanBoardTone>` | Each label's colour, like { Bug: 'pink' }. A label without one takes the next of purple, teal, green, pink and red (then blue, yellow and orange) in the order of `labels`, so pass `labels` to keep each label's colour as cards change |
| `cards` (optional) | `KanbanBoardCard[]` | The cards, in order: a column shows its cards in the order they come here. Leave it out to let the board keep them |
| `defaultCards` (optional) | `KanbanBoardCard[]` |  |
| `onCardsChange` (optional) | `(cards: KanbanBoardCard[]) => void` |  |
| `onMove` (optional) | `(id: string, column: string, index: number) => void` | Called when a card lands in a column (dragged, from its Move to menu, or with the bulk bar), with its place among that column's cards |
| `onChange` (optional) | `(card: KanbanBoardCard) => void` | Called when a card's title, priority, people or subtasks change from the board |
| `onRename` (optional) | `(id: string, title: string) => void` | Called when a card's title is edited |
| `open` (optional) | `string \| null` | The card whose details sheet is open, or null |
| `defaultOpen` (optional) | `string \| null` |  |
| `onOpen` (optional) | `(id: string \| null) => void` |  |
| `filters` (optional) | `KanbanBoardFilters` |  |
| `defaultFilters` (optional) | `KanbanBoardFilters` |  |
| `onFiltersChange` (optional) | `(filters: KanbanBoardFilters) => void` |  |
| `view` (optional) | `KanbanBoardView` |  |
| `defaultView` (optional) | `KanbanBoardView` |  |
| `onViewChange` (optional) | `(view: KanbanBoardView) => void` |  |
| `collapsed` (optional) | `string[]` | The keys of folded columns |
| `defaultCollapsed` (optional) | `string[]` |  |
| `onCollapsedChange` (optional) | `(keys: string[]) => void` |  |
| `selected` (optional) | `string[]` | The ids of picked cards (Shift- or Cmd-click, Space or x); picking any shows the bar that moves them together |
| `defaultSelected` (optional) | `string[]` |  |
| `onSelectedChange` (optional) | `(ids: string[]) => void` |  |
| `onDraggingChange` (optional) | `(dragging: boolean) => void` | Called with true when a card starts moving with the pointer and false when it lands, for pausing anything that would move cards meanwhile |
| `newCard` (optional) | `(column: string) => KanbanBoardCard` | Makes the card the + buttons add to a column. It goes to the end of the column with its title ready to type |
| `today` (optional) | `string` | Today, 'YYYY-MM-DD', for due dates. Defaults to the visitor's today |
| `addLabel` (optional) | `string` | The + buttons' label |
| `column` (optional) | `string` | The column a narrow board shows. A board under 640px wide shows one column at a time, picked with tabs that count each column's cards. Defaults to the first column |
| `defaultColumn` (optional) | `string` |  |
| `onColumnChange` (optional) | `(column: string) => void` |  |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import KanbanBoard from '../components/designme/kanban-board/KanbanBoard.astro';
---
<KanbanBoard />
<KanbanBoard data-style="soft" class="my-class" />
```
It plays its demo; change `kanban-board.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I show the agent working through its cards?**

Control the board with `cards`, mark the agent with `agent: true` in `members`, and raise its card's `progress` toward 1 as it works, with `activity` saying what it is doing (or tick its `subtasks` and the first open one is shown). When it finishes, move the card to your done column and clear `progress`, as the example does.

**How do I stop the agent from moving cards while someone is dragging?**

Use `onDraggingChange`. It is called with true when a card starts moving with the pointer and false when it lands, so you can pause your updates in between.

**Can cards be moved without dragging?**

Yes. Each card's dots open a Move to menu (m from the keyboard), the details sheet's Status opens the same menu, and picked cards move together from the bar at the foot of the board. Every move calls `onMove`.

**How do due dates and the WIP limit work?**

Give a card `due` as 'YYYY-MM-DD'; it reads as overdue once it is before `today` (the visitor's today by default), except in a column marked `done`. Give a column a `limit` and its header shows how full it is, with a warning chip once it is over.

**What does a new card look like?**

By default it is titled "New card" with no priority. Pass `newCard(column)` to return your own card, such as one with your key and already assigned to the current user.

## Source

`KanbanBoard.tsx`, as `npx designme add kanban-board --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type AnimationEvent, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Avatar, reflowGhost, reflowGlide, reflowIn, reflowMeasure, reflowStop, Seg, Swap, Think, Tip, type ReflowSnap } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './kanban-board.css';

export type KanbanBoardPriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';
export type KanbanBoardView = 'board' | 'list';
/** A label's colour: one of the core tag colours */
export type KanbanBoardTone = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

export interface KanbanBoardColumn {
  key: string;
  /** Like "In progress" */
  title: string;
  /** A shorter name for the tabs of a narrow board and the bulk bar, like "Doing". Defaults to the title */
  short?: string;
  /** A WIP limit: the header shows "2/3", and a warning chip once the column holds more */
  limit?: number;
  /** Cards here are finished: they show no due date, so none of them reads as overdue */
  done?: boolean;
}

export interface KanbanBoardMember {
  id: string;
  name: string;
  initials: string;
  /** An avatar colour, like 'var(--dm-av-l)' */
  color: string;
  /** An agent: a card it is assigned to with a `progress` says what it is doing */
  agent?: boolean;
}

export interface KanbanBoardSubtask {
  title: string;
  done?: boolean;
}

export interface KanbanBoardCard {
  id: string;
  /** The key shown on the card, like "DES-142". Defaults to the id */
  code?: string;
  /** The key of the column it sits in */
  column: string;
  title: string;
  /** Shown as a coloured chip: Urgent red, High orange, Medium yellow, Low blue, none grey */
  priority?: KanbanBoardPriority;
  /** What the card belongs to, like a project, an epic or a client: a grey chip beside its priority */
  project?: string;
  /** Labels, like ['Design', 'Bug'], each in its own colour (see `labelTones`) */
  labels?: string[];
  /** Member ids, shown as initials avatars */
  assignees?: string[];
  /** The due date, 'YYYY-MM-DD'. Before `today` it reads as overdue, in the bad text colour */
  due?: string;
  /** A checklist: the card shows "3/5" with a thin bar, and the details sheet lets you tick them */
  subtasks?: KanbanBoardSubtask[];
  comments?: number;
  attachments?: number;
  /** 0 to 1 while an agent works on it: an accent edge, the thinking mark, what it is doing and a bar that fills */
  progress?: number;
  /** What the agent is doing now, like "Writing the CSS variables". Defaults to the first open subtask */
  activity?: string;
}

export interface KanbanBoardFilters {
  /** Matches a card's title, code or project */
  query: string;
  assignees: string[];
  labels: string[];
  priorities: KanbanBoardPriority[];
}

export interface KanbanBoardProps {
  /** The board's name, like "Website refresh" */
  title?: string;
  /** Beside the name, like "Sprint 14". Defaults to how many cards are done, when a column is marked `done` */
  subtitle?: string;
  columns: KanbanBoardColumn[];
  /** The people (and agents) on the board: the facepile in the header, the Assignee filter and each card's people menu */
  members?: KanbanBoardMember[];
  /** The labels the Label filter offers. Defaults to every label on the cards */
  labels?: string[];
  /** Each label's colour, like { Bug: 'pink' }. A label without one takes the next of purple, teal, green, pink and red (then
      blue, yellow and orange) in the order of `labels`, so pass `labels` to keep each label's colour as cards change */
  labelTones?: Record<string, KanbanBoardTone>;
  /** The cards, in order: a column shows its cards in the order they come here. Leave it out to let the board keep them */
  cards?: KanbanBoardCard[];
  defaultCards?: KanbanBoardCard[];
  onCardsChange?: (cards: KanbanBoardCard[]) => void;
  /** Called when a card lands in a column (dragged, from its Move to menu, or with the bulk bar), with its place among that column's cards */
  onMove?: (id: string, column: string, index: number) => void;
  /** Called when a card's title, priority, people or subtasks change from the board */
  onChange?: (card: KanbanBoardCard) => void;
  /** Called when a card's title is edited */
  onRename?: (id: string, title: string) => void;
  /** The card whose details sheet is open, or null */
  open?: string | null;
  defaultOpen?: string | null;
  onOpen?: (id: string | null) => void;
  filters?: KanbanBoardFilters;
  defaultFilters?: KanbanBoardFilters;
  onFiltersChange?: (filters: KanbanBoardFilters) => void;
  view?: KanbanBoardView;
  defaultView?: KanbanBoardView;
  onViewChange?: (view: KanbanBoardView) => void;
  /** The keys of folded columns */
  collapsed?: string[];
  defaultCollapsed?: string[];
  onCollapsedChange?: (keys: string[]) => void;
  /** The ids of picked cards (Shift- or Cmd-click, Space or x); picking any shows the bar that moves them together */
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  /** Called with true when a card starts moving with the pointer and false when it lands, for pausing anything that would move cards meanwhile */
  onDraggingChange?: (dragging: boolean) => void;
  /** Makes the card the + buttons add to a column. It goes to the end of the column with its title ready to type */
  newCard?: (column: string) => KanbanBoardCard;
  /** Today, 'YYYY-MM-DD', for due dates. Defaults to the visitor's today */
  today?: string;
  /** The + buttons' label */
  addLabel?: string;
  /** The column a narrow board shows. A board under 640px wide shows one column at a time, picked with tabs that count each
      column's cards. Defaults to the first column */
  column?: string;
  defaultColumn?: string;
  onColumnChange?: (column: string) => void;
  className?: string;
}

const PRIORITY: Record<KanbanBoardPriority, string> = { urgent: 'Urgent', high: 'High', medium: 'Medium', low: 'Low', none: 'No priority' };
const PRIORITIES = Object.keys(PRIORITY) as KanbanBoardPriority[];
// priority is a coloured chip, and labels take the other core tag colours first, so a label rarely shares its priority's colour
const PRIORITY_TONE: Record<KanbanBoardPriority, string | undefined> = { urgent: 'dm-bad', high: 'dm-p', medium: 'dm-y', low: 'dm-b', none: undefined };
const TONE: Record<KanbanBoardTone, string> = { blue: 'dm-b', purple: 'dm-l', green: 'dm-m', orange: 'dm-p', red: 'dm-r', yellow: 'dm-y', pink: 'dm-k', teal: 'dm-t' };
const LABEL_TONES: KanbanBoardTone[] = ['purple', 'teal', 'green', 'pink', 'red', 'blue', 'yellow', 'orange'];
const NO_FILTERS: KanbanBoardFilters = { query: '', assignees: [], labels: [], priorities: [] };
const uid = () => 'card-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const toDay = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1); };
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const daysFrom = (due: string, today: string) => Math.round((toDay(due).getTime() - toDay(today).getTime()) / 864e5);
const dueText = (n: number, due: string) => n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : toDay(due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const plural = (n: number, one: string) => `${n} ${one}${n === 1 ? '' : 's'}`;

/** Priority as a chip in its colour */
function PriorityTag({ value = 'none' }: { value?: KanbanBoardPriority }) {
  return <span className={cx('dm-tag', PRIORITY_TONE[value])}>{PRIORITY[value]}</span>;
}

type FilterField = 'assignees' | 'labels' | 'priorities';
type Menu = { kind: 'move' | 'priority' | 'assign' | 'column' | 'filter'; id?: string; col?: string; field?: FilterField; from?: 'card' | 'sheet'; btn: HTMLButtonElement };
interface Drag { id: string; w: number; h: number; x: number; y: number }
interface Spot { column: string; before: string | null }

/** A sprint board where you and the agent move cards, with filters, details and keyboard moves. */
export function KanbanBoard({
  title, subtitle, columns, members = [], labels, labelTones, cards, defaultCards = [], onCardsChange, onMove, onChange, onRename,
  open, defaultOpen = null, onOpen, filters, defaultFilters = NO_FILTERS, onFiltersChange, view, defaultView = 'board', onViewChange,
  collapsed, defaultCollapsed = [], onCollapsedChange, selected, defaultSelected = [], onSelectedChange, onDraggingChange, newCard,
  today: todayProp, addLabel = 'Add card', column, defaultColumn, onColumnChange, className
}: KanbanBoardProps) {
  const [list, setListState] = useControllable(cards, defaultCards, onCardsChange);
  const latest = useRef(list);
  useEffect(() => { latest.current = list; });
  const setList = (next: KanbanBoardCard[]) => { latest.current = next; setListState(next); };
  const [f, setFilters] = useControllable(filters, defaultFilters, onFiltersChange);
  const [mode, setMode] = useControllable(view, defaultView, onViewChange);
  const [shut, setShut] = useControllable(collapsed, defaultCollapsed, onCollapsedChange);
  const [sel, setSel] = useControllable(selected, defaultSelected, onSelectedChange);
  const [peek, setPeek] = useControllable(open, defaultOpen, onOpen);
  const [shown, setShown] = useControllable(column, defaultColumn ?? columns[0]?.key ?? '', onColumnChange);
  const [today] = useState(() => todayProp ?? iso(new Date()));
  const day = todayProp ?? today;
  const reduce = useReducedMotion();

  const root = useRef<HTMLDivElement>(null), wrap = useRef<HTMLDivElement>(null), bar = useRef<HTMLDivElement>(null), sheet = useRef<HTMLElement>(null);
  const cols = useRef(new Map<string, HTMLDivElement>());
  const els = useRef(new Map<string, HTMLDivElement>());
  const who = (id: string) => members.find(m => m.id === id);
  const colOf = (key: string) => columns.find(c => c.key === key);
  const nameOf = (key: string) => colOf(key)?.title ?? key;
  const codeOf = (c: KanbanBoardCard) => c.code ?? c.id;

  // what a screen reader hears after each change
  const [said, setSaid] = useState({ text: '', n: 0 });
  const say = (text: string) => setSaid(s => ({ text, n: s.n + 1 }));

  // whether the board is narrow (one column at a time); the layout itself follows a container query
  const [narrow, setNarrow] = useState(false);
  useIsoLayoutEffect(() => {
    const el = root.current; if (!el) return;
    const fit = () => setNarrow(el.clientWidth < 640);
    fit(); const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ---------- filters ---------- */
  // a card just added stays on show until the filters change, so it never vanishes as you name it
  const kept = useRef(new Set<string>());
  const filtering = !!(f.query || f.assignees.length || f.labels.length || f.priorities.length);
  const words = (c: KanbanBoardCard) => `${c.title} ${codeOf(c)} ${c.project ?? ''}`.toLowerCase();
  const matches = (c: KanbanBoardCard) => kept.current.has(c.id) || ((!f.query || words(c).includes(f.query.toLowerCase()))
    && (!f.assignees.length || (c.assignees ?? []).some(a => f.assignees.includes(a)))
    && (!f.labels.length || (c.labels ?? []).some(l => f.labels.includes(l)))
    && (!f.priorities.length || f.priorities.includes(c.priority ?? 'none')));
  const visible = (key: string) => list.filter(c => c.column === key && matches(c));
  const shownCount = list.filter(matches).length;
  const setF = (next: KanbanBoardFilters) => {
    kept.current.clear(); flip.current = true; filt.current = true; setFilters(next);
    const n = latest.current.filter(c => (!next.query || words(c).includes(next.query.toLowerCase())) && (!next.assignees.length || (c.assignees ?? []).some(a => next.assignees.includes(a))) && (!next.labels.length || (c.labels ?? []).some(l => next.labels.includes(l))) && (!next.priorities.length || next.priorities.includes(c.priority ?? 'none'))).length;
    const any = !!(next.query || next.assignees.length || next.labels.length || next.priorities.length);
    say(any ? `${n} of ${latest.current.length} cards shown` : `All ${latest.current.length} cards shown`);
  };
  const toggleIn = <T,>(arr: T[], v: T) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
  const allLabels = labels ?? [...new Set(list.flatMap(c => c.labels ?? []))];
  // one colour per label wherever it shows: on the cards, in the sheet and in the Label filter
  const toneOf = (l: string) => { const t = labelTones?.[l]; if (t) return TONE[t]; const i = allLabels.indexOf(l); return TONE[LABEL_TONES[(i < 0 ? 0 : i) % LABEL_TONES.length]]; };
  const labelTag = (l: string) => <span key={l} className={cx('dm-tag', toneOf(l))}>{l}</span>;

  /* ---------- the cards glide to their new places after a move, a sort or a filter. A filter also fades in the cards it
     brings back and fades the ones it hides where they were. A glide still going when the board draws again carries on from
     where the card is on screen ---------- */
  const flip = useRef(false), filt = useRef(false);
  const rects = useRef(new Map<string, ReflowSnap>());
  useIsoLayoutEffect(() => {
    const box = root.current; if (!box) return;
    const now = new Map<string, ReflowSnap>(), go = flip.current && !reduce, was = rects.current;
    let n = 0;
    els.current.forEach((el, id) => {
      const { rb, b, o, dx, dy } = reflowMeasure(el, box);
      const s: ReflowSnap = { el, p: el.parentNode, x: b.left - rb.left, y: b.top - rb.top, w: b.width, h: b.height };
      if (b.width || b.height) now.set(id, s);
      if (!go) return;
      const a = was.get(id);
      if (a && (Math.abs(a.x - s.x) > .5 || Math.abs(a.y - s.y) > .5)) { reflowStop(el); reflowGlide(el, a.x + dx - s.x, a.y + dy - s.y, box, o, 420); }
      else if (!a && filt.current && (b.width || b.height)) { reflowStop(el); reflowIn(el, n++, box); }
    });
    if (go && filt.current) was.forEach((a, id) => { if (!now.has(id)) reflowGhost(a, box, 'data-id'); });
    flip.current = false; filt.current = false; rects.current = now;
  });

  // cards that are new, or moved by someone else, come in with the entrance; a dropped card gets its own little pop
  const mounted = useRef(false);
  const seen = useRef(new Map<string, string>());
  useEffect(() => { mounted.current = true; seen.current = new Map(list.map(c => [c.id, c.column])); });
  const landing = useRef<string | null>(null);
  const enters = (c: KanbanBoardCard) => mounted.current && seen.current.get(c.id) !== c.column && landing.current !== c.id && !flip.current;
  const [dropped, setDropped] = useState<{ id: string; n: number } | null>(null);
  useIsoLayoutEffect(() => {
    if (!dropped) return;
    landing.current = null;
    if (!reduce) els.current.get(dropped.id)?.animate([{ transform: 'scale(1.04)' }, { transform: 'none' }], { duration: 350, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }, [dropped]);

  /* ---------- the narrow board's tabs ---------- */
  useIsoLayoutEffect(() => {
    const el = cols.current.get(shown); if (!el || !narrow || mode !== 'board') return;
    el.classList.remove('dm-enter'); void el.offsetWidth; el.classList.add('dm-enter');
  }, [shown]);

  /* ---------- the keyboard's place: one card is in the Tab order ---------- */
  const [focusId, setFocusId] = useState<string | null>(null);
  const reachable = list.filter(c => matches(c) && (narrow && mode === 'board' ? c.column === shown : !shut.includes(c.column)));
  const tabStop = reachable.find(c => c.id === focusId)?.id ?? reachable[0]?.id;
  const focusCard = (id: string) => { setFocusId(id); requestAnimationFrame(() => els.current.get(id)?.focus()); if (peek && peek !== id) setPeek(id); };

  /* ---------- moving ---------- */
  const place = (all: KanbanBoardCard[], card: KanbanBoardCard, to: string, before: string | null = null) => {
    const rest = all.filter(c => c.id !== card.id), moved = { ...card, column: to };
    const at = before ? rest.findIndex(c => c.id === before) : -1;
    if (at < 0) rest.push(moved); else rest.splice(at, 0, moved);
    return { next: rest, index: rest.filter(c => c.column === to).findIndex(c => c.id === card.id) };
  };
  // a move that takes a column over its limit says so
  const limitNote = (all: KanbanBoardCard[], key: string) => { const c = colOf(key); return c?.limit && all.filter(x => x.column === key).length > c.limit ? `, which is over its limit of ${c.limit}` : ''; };
  const moveMany = (ids: string[], to: string) => {
    let all = latest.current; const moved: [string, number][] = [];
    for (const id of ids) { const card = all.find(c => c.id === id); if (!card || card.column === to) continue; const r = place(all, card, to); all = r.next; moved.push([id, r.index]); }
    if (!moved.length) return;
    flip.current = true; setList(all); moved.forEach(([id, i]) => onMove?.(id, to, i));
    const one = all.find(c => c.id === moved[0][0])!;
    say((moved.length === 1 ? `${codeOf(one)} moved to ${nameOf(to)}` : `${moved.length} cards moved to ${nameOf(to)}`) + limitNote(all, to));
  };
  const update = (id: string, patch: Partial<KanbanBoardCard>) => {
    const next = latest.current.map(c => c.id === id ? { ...c, ...patch } : c); setList(next);
    const card = next.find(c => c.id === id); if (card) onChange?.(card);
  };

  /* ---------- picking ---------- */
  const anchor = useRef<string | null>(null);
  const pick = (id: string, range = false) => {
    const card = latest.current.find(c => c.id === id), a = anchor.current && latest.current.find(c => c.id === anchor.current);
    let next: string[];
    if (range && card && a && a.column === card.column && a.id !== id && sel.includes(a.id)) {
      const L = visible(card.column), i = L.findIndex(c => c.id === a.id), j = L.findIndex(c => c.id === id);
      next = [...new Set([...sel, ...L.slice(Math.min(i, j), Math.max(i, j) + 1).map(c => c.id)])];
    } else next = toggleIn(sel, id);
    anchor.current = id; setSel(next); say(`${next.length} selected`);
  };
  const clearPick = () => { anchor.current = null; setSel([]); say('Selection cleared'); };
  const picked = sel.filter(id => list.some(c => c.id === id));

  /* ---------- menus: Move to, priority, people, a column's actions, a filter ---------- */
  const [menu, setMenu] = useState<Menu | null>(null);
  const closeMenu = (o: boolean) => { if (!o) setMenu(null); };
  const pops = {
    move: usePopover({ align: 'end', open: menu?.kind === 'move', onOpenChange: closeMenu }),
    priority: usePopover({ align: 'start', open: menu?.kind === 'priority', onOpenChange: closeMenu }),
    assign: usePopover({ align: 'end', open: menu?.kind === 'assign', onOpenChange: closeMenu }),
    column: usePopover({ align: 'end', open: menu?.kind === 'column', onOpenChange: closeMenu }),
    filter: usePopover({ align: 'start', open: menu?.kind === 'filter', onOpenChange: closeMenu })
  };
  const openMenu = (m: Menu, key = false) => {
    if (menu && menu.btn === m.btn) { setMenu(null); return; }
    const p = pops[m.kind]; p.trigger.ref.current = m.btn;
    if (key) p.openFocused();
    setMenu(m);
  };
  const isOpen = (btn: string) => menu && menu.btn.dataset.kbx === btn;
  const cardOpen = (kind: Menu['kind'], id: string) => !!menu && menu.kind === kind && menu.id === id && menu.from === 'card';
  // picked with the keyboard, the focus goes back to the card (or the sheet's field) once the menu has gone
  const refocus = (id: string) => {
    const m = menu; const p = m && pops[m.kind].pop.ref.current;
    if (!m || !p || !p.contains(document.activeElement)) return;
    setTimeout(() => {
      const field = m.from === 'sheet' && sheet.current?.querySelector<HTMLElement>(`[data-kbx="sheet-${m.kind}"]`);
      if (field && field.isConnected) field.focus({ preventScroll: true }); else focusCard(id);
    }, 160);
  };
  const menuCard = menu?.id ? list.find(c => c.id === menu.id) : undefined;
  const moveTo = (to: string) => {
    const card = menuCard; pops.move.closeSoon(); if (!card) return;
    refocus(card.id); if (card.column === to) return; moveMany([card.id], to); if (narrow && !peek) setShown(to);
  };
  const setPriority = (p: KanbanBoardPriority) => {
    const card = menuCard; pops.priority.closeSoon(); if (!card) return;
    refocus(card.id); update(card.id, { priority: p }); say(`${codeOf(card)} priority ${PRIORITY[p]}`);
  };
  const toggleAssignee = (m: string) => {
    const card = menuCard; if (!card) return;
    const has = (card.assignees ?? []).includes(m);
    update(card.id, { assignees: members.map(x => x.id).filter(x => x === m ? !has : (card.assignees ?? []).includes(x)) });
    say(`${who(m)?.name ?? m} ${has ? 'removed from' : 'assigned to'} ${codeOf(card)}`);
  };
  const columnAction = (a: 'add' | 'all' | 'priority' | 'due' | 'fold') => {
    const key = menu?.col; pops.column.closeSoon(); if (!key) return;
    if (a === 'add') return add(key);
    if (a === 'fold') { setShut([...shut, key]); say(`${nameOf(key)} folded`); return; }
    if (a === 'all') { const next = [...new Set([...sel, ...visible(key).map(c => c.id)])]; setSel(next); say(`${next.length} selected`); return; }
    const rank = a === 'priority' ? (c: KanbanBoardCard) => PRIORITIES.indexOf(c.priority ?? 'none') : (c: KanbanBoardCard) => c.due ? daysFrom(c.due, day) : 1e6;
    const mine = latest.current.filter(c => c.column === key).sort((x, y) => rank(x) - rank(y));
    flip.current = true; setList([...latest.current.filter(c => c.column !== key), ...mine]);
    say(`${nameOf(key)} sorted by ${a === 'priority' ? 'priority' : 'due date'}`);
  };

  /* ---------- the details sheet ---------- */
  const [sheetFor, setSheetFor] = useState<string | null>(peek);
  useEffect(() => { if (peek) setSheetFor(peek); }, [peek]);
  const openSheet = (id: string) => { setFocusId(id); if (peek === id) { setPeek(null); return; } setPeek(id); say(`${codeOf(list.find(c => c.id === id)!)} details open`); };
  const closeSheet = (back = false) => { const id = peek; setPeek(null); if (back && id) focusCard(id); };
  useEffect(() => { if (peek && !list.some(c => c.id === peek)) setPeek(null); }, [list, peek]); // eslint-disable-line react-hooks/exhaustive-deps
  const sheetCard = list.find(c => c.id === (peek ?? sheetFor));
  // opened from the keyboard, the sheet takes the focus on its close button
  const focusSheet = useRef(false);
  useEffect(() => { if (peek && focusSheet.current) { focusSheet.current = false; requestAnimationFrame(() => sheet.current?.querySelector<HTMLElement>('.dm-kbx-pk-x')?.focus({ preventScroll: true })); } }, [peek]);

  /* ---------- adding and renaming ---------- */
  const [editing, setEditing] = useState<string | null>(null);
  const add = (key: string) => {
    const card = newCard?.(key) ?? { id: uid(), column: key, title: 'New card', priority: 'none' as const };
    kept.current.add(card.id); if (shut.includes(key)) setShut(shut.filter(k => k !== key)); if (narrow) setShown(key);
    setList([...latest.current, card]); setEditing(card.id);
  };
  const rename = (id: string, text: string) => {
    const card = latest.current.find(c => c.id === id); setEditing(null); if (!card) return;
    const t = text.trim() || (card.title || 'New card');
    if (t !== card.title) { update(id, { title: t }); onRename?.(id, t); }
    setTimeout(() => els.current.get(id)?.focus({ preventScroll: true }), 0);
  };

  /* ---------- the pointer: drag to move, click to open, Shift-click to pick ---------- */
  const [drag, setDrag] = useState<Drag | null>(null);
  const [spot, setSpot] = useState<Spot | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const stop = useRef<() => void>(undefined);
  const swallow = useRef(false);
  useEffect(() => () => stop.current?.(), []);
  const down = (card: KanbanBoardCard) => (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button || editing === card.id || (e.target as Element).closest('button')) return;
    const rc = e.currentTarget.getBoundingClientRect(), sx = e.clientX, sy = e.clientY, list = mode === 'list', w = list ? Math.min(rc.width, 260) : rc.width;
    const ox = Math.min(sx - rc.left, w - 24), oy = list ? 16 : sy - rc.top;
    let moved = false, at: Spot | null = null;
    const move = (ev: PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 5) return;
      if (!moved) { moved = true; onDraggingChange?.(true); }
      setDrag({ id: card.id, w, h: rc.height, x: ev.clientX - ox, y: ev.clientY - oy });
      const col = document.elementsFromPoint(ev.clientX, ev.clientY).find(x => [...cols.current.values()].includes(x as HTMLDivElement));
      const key = col && [...cols.current.entries()].find(([, el]) => el === col)?.[0];
      setOver(key ?? null);
      if (!key || !col) return;
      // the placeholder goes before the first card whose middle is below the pointer
      const sibs = [...col.querySelectorAll<HTMLElement>('.dm-kbx-list > .dm-kbx-k:not(.dm-drag)')];
      const after = sibs.find(s => { const b = s.getBoundingClientRect(); return ev.clientY < b.top + b.height / 2; });
      at = { column: key, before: after?.dataset.id ?? null };
      setSpot(at);
    };
    const up = (ev: PointerEvent) => {
      stop.current?.();
      if (!moved) return;
      swallow.current = true; setTimeout(() => { swallow.current = false; }, 0);
      if (at && ev.type === 'pointerup') {
        const now = latest.current.find(c => c.id === card.id)!, was = now.column, r = place(latest.current, now, at.column, at.before);
        setList(r.next); onMove?.(card.id, at.column, r.index);
        if (was !== at.column) say(`${codeOf(now)} moved to ${nameOf(at.column)}` + limitNote(r.next, at.column));
      }
      setDrag(null); setSpot(null); setOver(null);
      landing.current = card.id;
      setDropped(d => ({ id: card.id, n: (d?.n ?? 0) + 1 }));
      onDraggingChange?.(false);
    };
    stop.current = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up); stop.current = undefined; };
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up);
  };
  const clickT = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(clickT.current), []);
  const click = (card: KanbanBoardCard) => (e: ReactMouseEvent<HTMLDivElement>) => {
    if (swallow.current || (e.target as Element).closest('button') || editing === card.id) return;
    if (e.shiftKey || e.metaKey || e.ctrlKey) { pick(card.id, e.shiftKey); return; }
    clearTimeout(clickT.current);
    // a click on the title waits a moment, in case it is the first of a double-click that renames the card
    if ((e.target as Element).closest('.dm-kbx-k>.dm-t') && e.detail === 1) { clickT.current = setTimeout(() => openSheet(card.id), 240); return; }
    if (e.detail > 1) return;
    openSheet(card.id);
  };

  /* ---------- the keyboard on a card ---------- */
  // arrows move between cards (up and down in a column, left and right across columns), Enter opens the details, Space or x
  // picks, m opens Move to, p the priority, a the people, F2 renames, Escape closes the details or clears what is picked
  const key = (card: KanbanBoardCard) => (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (editing || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key, onCard = e.target === e.currentTarget;
    if (k === 'ArrowUp' || k === 'ArrowDown' || k === 'Home' || k === 'End') {
      e.preventDefault();
      const L = mode === 'list' ? columns.filter(c => !shut.includes(c.key)).flatMap(c => visible(c.key)) : visible(card.column), i = L.findIndex(c => c.id === card.id);
      const to = k === 'Home' ? L[0] : k === 'End' ? L[L.length - 1] : L[i + (k === 'ArrowUp' ? -1 : 1)];
      if (!to) return;
      if (e.shiftKey && (k === 'ArrowUp' || k === 'ArrowDown')) { const next = [...new Set([...sel, card.id, to.id])]; anchor.current = to.id; setSel(next); say(`${next.length} selected`); }
      focusCard(to.id); return;
    }
    if ((k === 'ArrowLeft' || k === 'ArrowRight') && mode === 'board') {
      e.preventDefault();
      const d = k === 'ArrowLeft' ? -1 : 1, i = visible(card.column).findIndex(c => c.id === card.id);
      for (let ci = columns.findIndex(c => c.key === card.column) + d; ci >= 0 && ci < columns.length; ci += d) {
        const c = columns[ci]; if (!narrow && shut.includes(c.key)) continue;
        if (narrow) setShown(c.key);
        const L = visible(c.key); if (L.length) { focusCard(L[Math.min(i, L.length - 1)].id); return; }
        if (narrow) return;
      }
      return;
    }
    if (!onCard) return;
    if (k === 'Enter') { e.preventDefault(); if (peek !== card.id) focusSheet.current = true; openSheet(card.id); return; }
    if (k === ' ' || k === 'x') { e.preventDefault(); pick(card.id); return; }
    if (k === 'F2') { e.preventDefault(); setEditing(card.id); return; }
    const kind = ({ m: 'move', p: 'priority', a: 'assign' } as const)[k.toLowerCase() as 'm' | 'p' | 'a'];
    if (kind) { e.preventDefault(); const btn = e.currentTarget.querySelector<HTMLButtonElement>(`[data-kbx="${kind}"]`); if (btn) openMenu({ kind, id: card.id, from: 'card', btn }, true); return; }
    if (k === 'Escape') { if (peek) { e.preventDefault(); closeSheet(); } else if (sel.length) { e.preventDefault(); clearPick(); } }
  };

  /* ---------- view ---------- */
  const [held, setHeld] = useState<number | undefined>(undefined);
  const switchView = (v: KanbanBoardView) => {
    if (v === mode) return;
    // the list keeps the board's height, so the board stays where it is
    const h = (wrap.current?.getBoundingClientRect().height ?? 0) + (narrow && bar.current ? bar.current.offsetHeight + 10 : 0);
    setHeld(v === 'list' ? Math.round(h) : undefined); setMode(v); say(v === 'list' ? 'List view' : 'Board view');
  };

  /* ---------- drawing a card ---------- */
  const meta = (c: KanbanBoardCard) => {
    const col = colOf(c.column), n = c.subtasks?.length ?? 0, d = c.subtasks?.filter(s => s.done).length ?? 0;
    const days = c.due && !col?.done ? daysFrom(c.due, day) : null;
    const out: ReactNode[] = [];
    if (days != null && c.due) out.push(<Tip key="d" label={days < 0 ? 'Overdue' : 'Due'}><span className={cx('dm-kbx-mt', days < 0 && 'dm-late')}><Icon name="cal" size="xs" />{dueText(days, c.due)}</span></Tip>);
    if (n) out.push(<Tip key="s" label={`${d} of ${n} subtasks done`}><span className={cx('dm-kbx-mt', d === n && 'dm-ok')}><span className="dm-num">{d}/{n}</span><span className="dm-kbx-sb"><i style={{ width: d / n * 100 + '%' }} /></span></span></Tip>);
    if (c.comments) out.push(<Tip key="c" label={plural(c.comments, 'comment')}><span className="dm-kbx-mt"><Icon name="comment" size="xs" /><span className="dm-num">{c.comments}</span></span></Tip>);
    if (c.attachments) out.push(<Tip key="a" label={plural(c.attachments, 'file')}><span className="dm-kbx-mt"><Icon name="clip" size="xs" /><span className="dm-num">{c.attachments}</span></span></Tip>);
    return out;
  };
  const people = (c: KanbanBoardCard) => (c.assignees ?? []).map(who).filter((m): m is KanbanBoardMember => !!m);
  const activity = (c: KanbanBoardCard) => c.activity ?? c.subtasks?.find(s => !s.done)?.title ?? 'Working';
  const describe = (c: KanbanBoardCard) => {
    const days = c.due && !colOf(c.column)?.done ? daysFrom(c.due, day) : null;
    return `${codeOf(c)}, ${c.title}. ${PRIORITY[c.priority ?? 'none']} priority${c.project ? `, project ${c.project}` : ''}${people(c).length ? ', ' + people(c).map(m => m.name).join(' and ') : ''}${days != null && c.due ? `, due ${dueText(days, c.due)}${days < 0 ? ', overdue' : ''}` : ''}${c.progress != null ? ', the agent is working on it' : ''}${sel.includes(c.id) ? ', selected' : ''}`;
  };
  const face = (c: KanbanBoardCard, ghost = false) => {
    const ps = people(c), names = ps.map(m => m.name).join(', '), pr = c.priority ?? 'none', working = c.progress != null, p = Math.max(0, Math.min(1, c.progress ?? 0));
    const tab = ghost ? undefined : -1;
    const btn = (kind: Menu['kind'], e: ReactMouseEvent<HTMLButtonElement>) => openMenu({ kind, id: c.id, from: 'card', btn: e.currentTarget }, e.detail === 0);
    return (
      <>
        <div className="dm-kbx-k1">
          <button type="button" className="dm-kbx-sel" role="checkbox" aria-checked={sel.includes(c.id)} aria-label={`Select ${codeOf(c)}`} tabIndex={tab} onClick={() => pick(c.id)}><Icon name="check" size="xs" /></button>
          <span className="dm-kbx-id dm-num">{codeOf(c)}</span>
          <span className="dm-kbx-sp" />
          {/* the dots show on hover or focus just left of the people, so the avatar sits at the card's edge */}
          <Tip label="Move to" off={!!cardOpen('move', c.id)}>
            <button type="button" className="dm-kbx-mv" data-kbx="move" aria-haspopup="menu" aria-expanded={!!cardOpen('move', c.id)} aria-label={`Move ${codeOf(c)}`} tabIndex={tab} onClick={e => btn('move', e)}><Icon name="more" size="xs" /></button>
          </Tip>
          <Tip label={names || 'Assign'} off={!!cardOpen('assign', c.id)}>
            <button type="button" className="dm-kbx-who" data-kbx="assign" aria-haspopup="menu" aria-expanded={!!cardOpen('assign', c.id)} aria-label={`Assignees: ${names || 'none'}`} tabIndex={tab} onClick={e => btn('assign', e)}>
              {ps.length ? ps.map(m => <Avatar key={m.id} initials={m.initials} color={m.color} />) : <span className="dm-none"><Icon name="user" size="xs" /></span>}
            </button>
          </Tip>
        </div>
        {/* one row of chips: the priority (it opens its menu), the project and the labels */}
        <div className="dm-kbx-cr">
          <Tip label="Priority" off={!!cardOpen('priority', c.id)}>
            <button type="button" className={cx('dm-tag', PRIORITY_TONE[pr], 'dm-kbx-pri')} data-kbx="priority" data-kbx-id={c.id} aria-haspopup="menu" aria-expanded={!!cardOpen('priority', c.id)} aria-label={`Priority: ${PRIORITY[pr]}`} tabIndex={tab} onClick={e => btn('priority', e)}>{PRIORITY[pr]}</button>
          </Tip>
          {c.project && <Tip label="Project"><span className="dm-tag dm-kbx-pj"><span>{c.project}</span></span></Tip>}
          {c.labels?.map(labelTag)}
        </div>
        <Title card={c} editing={!ghost && editing === c.id} onDone={t => rename(c.id, t)} onCancel={() => { setEditing(null); setTimeout(() => els.current.get(c.id)?.focus({ preventScroll: true }), 0); }} />
        {working && <>
          <div className="dm-kbx-ag"><Think /><Swap className="dm-s">{activity(c)}</Swap><span className="dm-pc dm-num">{Math.round(p * 100)}%</span></div>
          <div className="dm-kbx-pr"><i style={{ width: p * 100 + '%' }} /></div>
        </>}
        <div className="dm-kbx-m">{meta(c)}</div>
      </>
    );
  };

  /* ---------- the board ---------- */
  const doneCols = columns.filter(c => c.done).map(c => c.key);
  const sub = subtitle ?? (doneCols.length ? `${list.filter(c => doneCols.includes(c.column)).length} of ${list.length} done` : undefined);
  const chip = (field: FilterField, name: string) => {
    const v = field === 'assignees' ? f.assignees.map(id => who(id)?.name.split(' ')[0] ?? id) : field === 'labels' ? f.labels : f.priorities.map(p => PRIORITY[p]);
    return (
      <button key={field} type="button" data-kbx={`filter-${field}`} className={cx('dm-chip dm-sm dm-kbx-f', v.length > 0 && 'dm-on')} aria-haspopup="menu" aria-expanded={!!isOpen(`filter-${field}`)}
        onClick={e => openMenu({ kind: 'filter', field, btn: e.currentTarget }, e.detail === 0)}>
        <span className="dm-k">{name}{v.length ? ':' : ''}</span><span className="dm-v">{v.length > 1 ? `${v.length} picked` : v[0] ?? ''}</span><Icon name="chev-d" size="xs" />
      </button>
    );
  };
  const ghostCard = drag && list.find(c => c.id === drag.id);
  const fm = menu?.kind === 'filter' ? menu.field : undefined;
  const fOpts: { v: string; label: ReactNode; n: number }[] = fm === 'assignees' ? members.map(m => ({ v: m.id, label: <><Avatar initials={m.initials} color={m.color} /><span>{m.name}</span></>, n: list.filter(c => (c.assignees ?? []).includes(m.id)).length }))
    : fm === 'labels' ? allLabels.map(l => ({ v: l, label: labelTag(l), n: list.filter(c => (c.labels ?? []).includes(l)).length }))
    : fm === 'priorities' ? PRIORITIES.map(p => ({ v: p, label: <PriorityTag value={p} />, n: list.filter(c => (c.priority ?? 'none') === p).length })) : [];
  const fName = { assignees: 'Assignee', labels: 'Label', priorities: 'Priority' } as const;

  return (
    <div data-dm="" ref={root} className={cx('dm-kbx', mode === 'list' && 'dm-list', picked.length > 0 && 'dm-selecting', className)}
      onKeyDown={e => { if (e.key === 'Escape' && picked.length && !menu && !(e.target as Element).closest('.dm-kbx-k,.dm-kbx-q')) clearPick(); }}>
      <div className="dm-kbx-hd">
        <div className="dm-kbx-ti">{title && <b>{title}</b>}{sub && <span className="dm-num">{sub}</span>}</div>
        {members.length > 0 && (
          <div className={cx('dm-kbx-fp', f.assignees.length > 0 && 'dm-some')} role="group" aria-label="Filter by person">
            {members.map(m => (
              <Tip key={m.id} label={m.name}>
                <button type="button" aria-pressed={f.assignees.includes(m.id)} aria-label={m.name} onClick={() => setF({ ...f, assignees: toggleIn(f.assignees, m.id) })}><Avatar initials={m.initials} color={m.color} /></button>
              </Tip>
            ))}
          </div>
        )}
        <span className="dm-kbx-sp" />
        <label className="dm-kbx-q">
          <Icon name="search" size="xs" />
          <input type="search" placeholder="Search cards" aria-label="Search cards" autoComplete="off" value={f.query}
            onChange={e => setF({ ...f, query: e.target.value })} onKeyDown={e => { if (e.key === 'Escape' && f.query) { e.stopPropagation(); setF({ ...f, query: '' }); } }} />
          {f.query && <button type="button" className="dm-ib dm-kbx-qx" aria-label="Clear the search" onClick={e => { setF({ ...f, query: '' }); (e.currentTarget.previousElementSibling as HTMLInputElement | null)?.focus(); }}><Icon name="x" size="xs" /></button>}
        </label>
        <Seg className="dm-kbx-vw" label="View" value={mode} onChange={switchView}
          options={[{ value: 'board', label: <><Icon name="grid" size="xs" /><span className="dm-lb">Board</span></> }, { value: 'list', label: <><Icon name="list" size="xs" /><span className="dm-lb">List</span></> }]} />
      </div>
      <div className="dm-kbx-fl">
        {members.length > 0 && chip('assignees', 'Assignee')}
        {allLabels.length > 0 && chip('labels', 'Label')}
        {chip('priorities', 'Priority')}
        {filtering && <button type="button" className="dm-pill dm-ghost dm-sm dm-kbx-clr" onClick={() => setF(NO_FILTERS)}>Clear</button>}
        <span className="dm-kbx-sp" />
        <span className="dm-kbx-cnt dm-num">{filtering ? `${shownCount} of ${list.length} cards` : plural(list.length, 'card')}</span>
      </div>
      <div ref={bar} className="dm-kbx-bar">
        <Seg className="dm-kbx-tabs" label="Column" value={shown} onChange={setShown}
          options={columns.map(col => { const n = visible(col.key).length; return { value: col.key, label: <>{col.short ?? col.title}<span key={n} className="dm-n dm-num dm-enter">{n}</span></> }; })} />
        <Tip label={addLabel}><button type="button" className="dm-ib dm-kbx-add" aria-label={addLabel} onClick={() => add(shown)}><Icon name="plus" size="xs" /></button></Tip>
      </div>
      <div className="dm-kbx-bd">
        <div ref={wrap} className="dm-kbx-cols" style={{ ['--dm-kbx-gt' as string]: columns.map(c => shut.includes(c.key) ? '40px' : 'minmax(0,1fr)').join(' '), minHeight: mode === 'list' ? held : undefined }}>
          {columns.map(col => {
            const here = visible(col.key), all = list.filter(c => c.column === col.key).length, folded = shut.includes(col.key), full = !!col.limit && all > col.limit;
            const items: ReactNode[] = [];
            const hole = <div key="dm-kbx-ph" className="dm-kbx-ph" style={{ height: drag?.h }} />;
            for (const c of here) {
              if (spot?.column === col.key && spot.before === c.id && c.id !== drag?.id) items.push(hole);
              items.push(
                <Card key={c.id} card={c} entering={enters(c)} className={cx(c.progress != null && 'dm-agent', drag?.id === c.id && 'dm-drag', sel.includes(c.id) && 'dm-sel', peek === c.id && 'dm-open')}
                  label={describe(c)} tabIndex={c.id === tabStop ? 0 : -1}
                  setRef={el => { if (el) els.current.set(c.id, el); else els.current.delete(c.id); }}
                  onPointerDown={down(c)} onClick={click(c)} onDoubleClick={e => { if ((e.target as Element).closest('.dm-kbx-k>.dm-t') && !editing) { clearTimeout(clickT.current); setEditing(c.id); } }}
                  onKeyDown={key(c)} onFocus={e => { if (e.target === e.currentTarget) setFocusId(c.id); }}>
                  {face(c)}
                </Card>
              );
            }
            if (spot?.column === col.key && spot.before == null) items.push(hole);
            return (
              <div key={col.key} className={cx('dm-kbx-c', full && 'dm-wip', folded && 'dm-shut', shown === col.key && 'dm-on', over === col.key && 'dm-over')}
                ref={el => { if (el) cols.current.set(col.key, el); else cols.current.delete(col.key); }}
                onClick={folded && mode === 'board' && !narrow ? e => { if (!(e.target as Element).closest('.dm-kbx-cmn')) setShut(shut.filter(k => k !== col.key)); } : undefined}>
                <div className="dm-kbx-ch">
                  <Tip label={folded ? 'Open' : 'Fold'}>
                    <button type="button" className="dm-ib dm-kbx-tg" aria-expanded={!folded} aria-label={`${folded ? 'Open' : 'Fold'} ${col.title}`}
                      onClick={e => { e.stopPropagation(); setShut(folded ? shut.filter(k => k !== col.key) : [...shut, col.key]); say(`${col.title} ${folded ? 'open' : 'folded'}`); }}><Icon name="chev-d" size="xs" /></button>
                  </Tip>
                  <b>{col.title}</b>
                  <span className="dm-n dm-num">
                    {full ? <Tip label={`Over the limit of ${col.limit}`}><span className="dm-tag dm-warn"><Icon name="alert" size="xs" />{all}/{col.limit}</span></Tip>
                      : <span className="dm-tag">{filtering && here.length !== all ? `${here.length} of ${all}` : col.limit ? `${all}/${col.limit}` : all}</span>}
                  </span>
                  <span className="dm-kbx-sp" />
                  <Tip label={addLabel}><button type="button" className="dm-ib dm-kbx-cadd" aria-label={`${addLabel}: ${col.title}`} onClick={() => add(col.key)}><Icon name="plus" size="xs" /></button></Tip>
                  <Tip label="Column actions" off={!!isOpen(`column-${col.key}`)}>
                    <button type="button" className="dm-ib dm-kbx-cmn" data-kbx={`column-${col.key}`} aria-haspopup="menu" aria-expanded={!!isOpen(`column-${col.key}`)} aria-label={`${col.title} actions`}
                      onClick={e => openMenu({ kind: 'column', col: col.key, btn: e.currentTarget }, e.detail === 0)}><Icon name="more" size="xs" /></button>
                  </Tip>
                </div>
                <div className="dm-kbx-list" role="list" aria-label={col.title}>{items.length ? items : !filtering && <div className="dm-kbx-none">No cards</div>}</div>
              </div>
            );
          })}
        </div>
        {/* nothing matches: one note in the middle of the board */}
        {filtering && !shownCount && (
          <div className="dm-kbx-em"><span className="dm-ic"><Icon name="filter" /></span><b>No cards match</b><span>Try another filter or search.</span>
            <button type="button" className="dm-pill dm-line dm-sm" onClick={() => setF(NO_FILTERS)}>Clear filters</button></div>
        )}
        {/* picked cards move together */}
        <div className={cx('dm-kbx-bk', picked.length > 0 && 'dm-on')} inert={!picked.length}>
          <span className="dm-n dm-num">{picked.length} selected</span><span className="dm-l">Move to</span>
          {columns.map(col => <button key={col.key} type="button" className="dm-pill dm-ghost dm-sm" onClick={() => { const ids = picked; anchor.current = null; setSel([]); moveMany(ids, col.key); }}><span className="dm-lg">{col.title}</span><span className="dm-sh">{col.short ?? col.title}</span></button>)}
          <span className="dm-sep" />
          <Tip label="Clear" kbd="Esc"><button type="button" className="dm-ib" aria-label="Clear the selection" onClick={clearPick}><Icon name="x" size="xs" /></button></Tip>
        </div>
        {/* a card's details */}
        <aside ref={sheet} className={cx('dm-kbx-pk', peek && sheetCard && 'dm-on')} role="dialog" aria-label={sheetCard ? `${codeOf(sheetCard)} details` : 'Card details'} inert={!peek}
          onKeyDown={e => { if (e.key === 'Escape' && !menu) { e.stopPropagation(); closeSheet(true); } }}>
          {sheetCard && sheetView(sheetCard)}
        </aside>
      </div>
      <div className="dm-kbx-sr" aria-live="polite" key={said.n}>{said.text}</div>

      {/* the menus */}
      <div {...pops.move.pop} className={cx(pops.move.pop.className, 'dm-kbx-pop dm-kbx-mp')} role="menu" aria-label="Move to">
        <div className="dm-ph">Move to</div>
        {columns.map(col => (
          <button key={col.key} type="button" className="dm-mi" role="menuitemradio" aria-checked={menuCard?.column === col.key} onClick={() => moveTo(col.key)}>
            <span>{col.title}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
          </button>
        ))}
      </div>
      <div {...pops.priority.pop} className={cx(pops.priority.pop.className, 'dm-kbx-pop dm-kbx-pm')} role="menu" aria-label="Priority">
        <div className="dm-ph">Priority</div>
        {PRIORITIES.map(p => (
          <button key={p} type="button" className="dm-mi" role="menuitemradio" aria-checked={(menuCard?.priority ?? 'none') === p} onClick={() => setPriority(p)}>
            <PriorityTag value={p} /><span className="dm-ck"><Icon name="check" size="xs" /></span>
          </button>
        ))}
      </div>
      <div {...pops.assign.pop} className={cx(pops.assign.pop.className, 'dm-kbx-pop dm-kbx-am')} role="menu" aria-label="Assignees">
        <div className="dm-ph">Assignees</div>
        {members.map(m => (
          <button key={m.id} type="button" className="dm-mi" role="menuitemcheckbox" aria-checked={(menuCard?.assignees ?? []).includes(m.id)} onClick={() => toggleAssignee(m.id)}>
            <Avatar initials={m.initials} color={m.color} /><span>{m.name}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
          </button>
        ))}
      </div>
      <div {...pops.column.pop} className={cx(pops.column.pop.className, 'dm-kbx-pop dm-kbx-cm')} role="menu" aria-label="Column">
        <div className="dm-ph">Column</div>
        <button type="button" className="dm-mi" role="menuitem" onClick={() => columnAction('add')}><Icon name="plus" size="xs" /><span>{addLabel}</span></button>
        <button type="button" className="dm-mi" role="menuitem" onClick={() => columnAction('all')}><Icon name="check" size="xs" /><span>Select all</span></button>
        <button type="button" className="dm-mi" role="menuitem" onClick={() => columnAction('priority')}><Icon name="sort" size="xs" /><span>Sort by priority</span></button>
        <button type="button" className="dm-mi" role="menuitem" onClick={() => columnAction('due')}><Icon name="cal" size="xs" /><span>Sort by due date</span></button>
        <div className="dm-sep" />
        <button type="button" className="dm-mi" role="menuitem" onClick={() => columnAction('fold')}><Icon name="chev-l" size="xs" /><span>Fold column</span></button>
      </div>
      <div {...pops.filter.pop} className={cx(pops.filter.pop.className, 'dm-kbx-pop dm-kbx-fm')} role="menu" aria-label={fm ? fName[fm] : 'Filter'}>
        <div className="dm-ph">{fm ? fName[fm] : 'Filter'}</div>
        {fOpts.map(o => {
          const on = fm ? (f[fm] as string[]).includes(o.v) : false;
          return (
            <button key={o.v} type="button" className="dm-mi" role="menuitemcheckbox" aria-checked={on} onClick={() => { if (fm) setF({ ...f, [fm]: toggleIn(f[fm] as string[], o.v) }); }}>
              {o.label}<span className="dm-r dm-num">{o.n}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
            </button>
          );
        })}
      </div>

      {ghostCard && drag && typeof document !== 'undefined' && createPortal(
        <div data-dm="" className={cx('dm-kbx-k dm-ghost', ghostCard.progress != null && 'dm-agent')} style={{ left: drag.x, top: drag.y, width: drag.w }} aria-hidden="true">
          {face(ghostCard, true)}
        </div>, document.body)}
    </div>
  );

  /** The details sheet: what the card is, its fields (each opens its menu), the agent's progress, a checklist and its talk and files */
  function sheetView(card: KanbanBoardCard) {
    const ps = people(card), names = ps.map(m => m.name).join(', '), n = card.subtasks?.length ?? 0, d = card.subtasks?.filter(s => s.done).length ?? 0;
    const days = card.due ? daysFrom(card.due, day) : null, late = days != null && days < 0 && !colOf(card.column)?.done, agent = ps.find(m => m.agent);
    const field = (kind: Menu['kind']) => (e: ReactMouseEvent<HTMLButtonElement>) => openMenu({ kind, id: card.id, from: 'sheet', btn: e.currentTarget }, e.detail === 0);
    const p = Math.max(0, Math.min(1, card.progress ?? 0));
    return (
      <>
        <div className="dm-kbx-pk-h"><span className="dm-kbx-id dm-num">{codeOf(card)}</span><span className="dm-kbx-sp" />
          <Tip label="Close" kbd="Esc"><button type="button" className="dm-ib dm-kbx-pk-x" aria-label="Close details" onClick={() => closeSheet(true)}><Icon name="x" size="xs" /></button></Tip></div>
        <div className="dm-kbx-pk-t">{card.title}</div>
        {card.progress != null && (
          <div className="dm-kbx-pk-ag">
            <div className="dm-kbx-ag"><Think /><span className="dm-s">{agent ? `${agent.name}: ` : ''}{activity(card)}</span><span className="dm-pc dm-num">{Math.round(p * 100)}%</span></div>
            <div className="dm-kbx-pr"><i style={{ width: p * 100 + '%' }} /></div>
          </div>
        )}
        <div className="dm-kbx-pk-rows">
          <div className="dm-kbx-pk-r"><span className="dm-k">Status</span><button type="button" className="dm-kbx-pv" data-kbx="sheet-move" aria-haspopup="menu" aria-expanded={!!isOpen('sheet-move')} aria-label={`Status: ${nameOf(card.column)}`} onClick={field('move')}>{nameOf(card.column)}<Icon name="chev-d" size="xs" /></button></div>
          <div className="dm-kbx-pk-r"><span className="dm-k">Priority</span><button type="button" className="dm-kbx-pv" data-kbx="sheet-priority" aria-haspopup="menu" aria-expanded={!!isOpen('sheet-priority')} aria-label={`Priority: ${PRIORITY[card.priority ?? 'none']}`} onClick={field('priority')}><PriorityTag value={card.priority} /><Icon name="chev-d" size="xs" /></button></div>
          {members.length > 0 && <div className="dm-kbx-pk-r"><span className="dm-k">Assignees</span><button type="button" className="dm-kbx-pv" data-kbx="sheet-assign" aria-haspopup="menu" aria-expanded={!!isOpen('sheet-assign')} aria-label={`Assignees: ${names || 'none'}`} onClick={field('assign')}>
            {ps.length ? <><span className="dm-avs">{ps.map(m => <Avatar key={m.id} initials={m.initials} color={m.color} />)}</span>{ps.length > 1 ? `${ps.length} people` : ps[0].name}</> : 'Assign'}<Icon name="chev-d" size="xs" /></button></div>}
          {card.project && <div className="dm-kbx-pk-r"><span className="dm-k">Project</span><span className="dm-kbx-pv">{card.project}</span></div>}
          {days != null && card.due && <div className="dm-kbx-pk-r"><span className="dm-k">Due</span><span className={cx('dm-kbx-pv', late && 'dm-late')}><Icon name="cal" size="xs" />{dueText(days, card.due)}{late ? ', overdue' : ''}</span></div>}
          {!!card.labels?.length && <div className="dm-kbx-pk-r"><span className="dm-k">Labels</span><span className="dm-kbx-tags">{card.labels.map(labelTag)}</span></div>}
        </div>
        {n > 0 && <>
          <div className="dm-kbx-pk-s"><b>Subtasks</b><span className="dm-num">{d}/{n}</span><span className="dm-kbx-sb"><i style={{ width: d / n * 100 + '%' }} /></span></div>
          <div className="dm-kbx-pk-cl" role="group" aria-label="Subtasks">
            {card.subtasks!.map((s, i) => (
              <button key={i} type="button" className="dm-kbx-ci" role="checkbox" aria-checked={!!s.done} disabled={card.progress != null}
                onClick={() => { const subtasks = card.subtasks!.map((x, j) => j === i ? { ...x, done: !x.done } : x); update(card.id, { subtasks }); say(`${s.title} ${s.done ? 'not done' : 'done'}, ${subtasks.filter(x => x.done).length} of ${n}`); }}>
                <span className="dm-kbx-cb"><Icon name="check" size="xs" /></span><span>{s.title}</span>
              </button>
            ))}
          </div>
        </>}
        <div className="dm-kbx-pk-f">
          <span className="dm-kbx-mt"><Icon name="comment" size="xs" />{card.comments ? plural(card.comments, 'comment') : 'No comments'}</span>
          <span className="dm-kbx-mt"><Icon name="clip" size="xs" />{card.attachments ? plural(card.attachments, 'file') : 'No files'}</span>
        </div>
      </>
    );
  }
}

/** A card's title, written in place while it is being named */
function Title({ card, editing, onDone, onCancel }: { card: KanbanBoardCard; editing: boolean; onDone: (title: string) => void; onCancel: () => void }) {
  const ref = useRef<HTMLSpanElement>(null);
  const cancelled = useRef(false);
  useEffect(() => {
    const t = ref.current; if (!editing || !t) return;
    cancelled.current = false; t.focus(); document.getSelection()?.selectAllChildren(t);
  }, [editing]);
  // keyed by the title, so an edit always starts from what was saved
  return (
    <span key={card.title} ref={ref} className="dm-t" contentEditable={editing} suppressContentEditableWarning
      onBlur={editing ? e => { if (cancelled.current) { e.currentTarget.textContent = card.title; onCancel(); } else onDone(e.currentTarget.textContent ?? ''); } : undefined}
      onKeyDown={editing ? e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } if (e.key === 'Escape') { cancelled.current = true; e.currentTarget.blur(); } } : undefined}>{card.title}</span>
  );
}

function Card({ card, entering: enters, className, label, tabIndex, setRef, children, ...on }: {
  card: KanbanBoardCard; entering: boolean; className?: string; label: string; tabIndex: number; setRef: (el: HTMLDivElement | null) => void; children: ReactNode;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void; onClick: (e: ReactMouseEvent<HTMLDivElement>) => void; onDoubleClick: (e: ReactMouseEvent<HTMLDivElement>) => void;
  onKeyDown: (e: ReactKeyboardEvent<HTMLDivElement>) => void; onFocus: (e: React.FocusEvent<HTMLDivElement>) => void;
}) {
  // a card that arrives after the board appears comes in once, then drops the entrance so a drag can fade it
  const [entering, setEntering] = useState(enters);
  return (
    <div ref={setRef} data-id={card.id} role="listitem" aria-label={label} tabIndex={tabIndex} className={cx('dm-kbx-k', className, entering && 'dm-enter')} {...on}
      onAnimationEnd={(e: AnimationEvent) => { if (e.target === e.currentTarget && entering) setEntering(false); }}>
      {children}
    </div>
  );
}
```

## More in Collaboration

- [Banner](https://designme.dev/components/banner.md): An announcement on a tint of its tone, with its own line drawing.
- [Comments](https://designme.dev/components/comments.md): A design thread where you can @mention the agent and it replies.
- [Notifications](https://designme.dev/components/notifications.md): An inbox where agent updates and mentions arrive live.
- [Invite to collaborate](https://designme.dev/components/invite-to-collaborate.md): Add teammates by email as chips, set their role, send.
- [Reactions](https://designme.dev/components/reactions.md): Quick reactions on an agent update, with counts that pop.
- [Profile menu](https://designme.dev/components/profile-menu.md): The account menu behind an avatar: switch workspace, theme, shortcuts and sign out.
- [Context menu](https://designme.dev/components/context-menu.md): Right-click an agent reply for its actions, with a submenu that asks the agent about it.
- [Context switcher](https://designme.dev/components/context-switcher.md): The organisation, project and environment you are in, each part a searchable switcher.
- [Filter menu](https://designme.dev/components/filter-menu.md): Add filters from a menu, see them as chips, and watch the count change.
- [Number field](https://designme.dev/components/number-field.md): Type a number or step it with minus and plus, with units, limits and a word when a value is changed to fit.
- [Ticket list](https://designme.dev/components/ticket-list.md): Support tickets the agent has triaged, with suggested replies.

All components: https://designme.dev/llms.txt
