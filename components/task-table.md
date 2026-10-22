# Task table

> Agent tasks in a sortable table with bulk actions.

Agent components / Sources and output. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/task-table

## Install

```sh
npx designme add task-table          # HTML, CSS and JS, with the shared core
npx designme add task-table --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Task table lists the tasks your agents are working on, with each task's status, the agent on it, its cost and when it last changed. Select some rows and the header turns into bulk actions to pause, retry or cancel them.

### When to use it

- When several agents run tasks at once and people need one place to see them all.
- When someone wants to retry every failed task, or pause a batch, in one go.
- When sorting by cost or status helps people find what needs attention.
- When the list can run empty and should say so clearly.

### What it does

- Columns for task, status, agent, cost and updated. Click a header to sort by it, and click again to reverse the order.
- Five statuses, each with its own glyph: running, failed, queued, paused and done. Sorting by status follows that order.
- Click a row or its checkbox to select it. The select-all box shows a dash when only some rows are picked.
- While rows are selected, the header shows the count with Pause, Retry, Cancel and Clear. An action calls `onAction` with the ids and clears the selection.
- Rows glide to their new places when the order changes, and cancelled rows slide away before `onAction` runs.
- With no tasks, the table shows a "No agent tasks" note, or your own `empty` content, with an optional `emptyAction` button.

### Accessibility

- Each header cell sets `aria-sort` to ascending, descending or none.
- Row checkboxes are buttons with `role="checkbox"`, `aria-checked` and an `aria-label` like "Select Sync Figma frames".
- The select-all box uses `aria-checked="mixed"` when only some rows are selected, and the hidden half of the header is `inert`.
- With reduced motion turned on, rows skip the glide and cancelled rows leave without sliding.

## Usage in React

```tsx
import { TaskTable } from '@/components/designme/task-table/TaskTable';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { TaskTable, type Task, type TaskAction } from './TaskTable';
import { useScript } from '../lib/useScript';

/* ---------- Task table: six agent tasks; two get picked after a moment, then retried ---------- */
const DESIGN = { name: 'Design', initials: 'DS', color: 'var(--dm-pb)' };
const TASKS: Task[] = [
  { id: '0', name: 'Audit pricing contrast', status: 'running', agent: DESIGN, cost: 0.42, updated: 2 },
  { id: '1', name: 'Export tokens to CSS', status: 'done', agent: { name: 'Code', initials: 'CO', color: 'var(--dm-pm)' }, cost: 0.18, updated: 14 },
  { id: '2', name: 'Sync Figma frames', status: 'failed', agent: DESIGN, cost: 0.07, updated: 26 },
  { id: '3', name: 'Draft launch email', status: 'queued', agent: { name: 'Writer', initials: 'WR', color: 'var(--dm-pl)' }, cost: 0, updated: 31 },
  { id: '4', name: 'Compare checkout flows', status: 'done', agent: { name: 'Research', initials: 'RE', color: 'var(--dm-pt)' }, cost: 0.66, updated: 48 },
  { id: '5', name: 'Rename layers in Hero', status: 'running', agent: DESIGN, cost: 0.11, updated: 5 }
];

// what each action does to the selected tasks
const apply = (list: Task[], a: TaskAction, ids: string[]): Task[] => a === 'cancel' ? list.filter(t => !ids.includes(t.id)) : list.map(t => {
  if (!ids.includes(t.id)) return t;
  if (a === 'pause' && (t.status === 'running' || t.status === 'queued')) return { ...t, status: 'paused' };
  if (a === 'retry' && (t.status === 'failed' || t.status === 'paused')) return { ...t, status: 'running', updated: 0 };
  return t;
});

export default function TaskTableDemo() {
  const [tasks, setTasks] = useState(TASKS);
  const [selected, setSelected] = useState<string[]>([]);
  // the preview picks two tasks and retries them, unless you start clicking first
  const yours = useRef(false);
  useScript(async ({ wait }) => {
    await wait(1600); if (yours.current) return;
    setSelected(s => s.length ? s : ['2', '5']);
    await wait(1900); if (yours.current) return;
    setTasks(list => apply(list, 'retry', ['2', '5'])); setSelected([]);
  });
  return (
    <div style={{ width: '100%' }} onPointerDownCapture={e => { if (e.isTrusted) yours.current = true; }}>
      <TaskTable tasks={tasks} selected={selected} onSelectedChange={setSelected}
        onAction={(a, ids) => setTasks(list => apply(list, a, ids))}
        emptyAction={{ label: 'Bring them back', onClick: () => setTasks(TASKS) }} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `tasks` | `Task[]` |  |
| `title` (optional) | `string` | The name in the header. Defaults to "Agent tasks" |
| `summary` (optional) | `string` | The quiet line beside the name. Defaults to a count of tasks and how many are running |
| `selected` (optional) | `string[]` | Ids of the selected tasks. Leave it out to let the checkboxes and rows toggle it |
| `defaultSelected` (optional) | `string[]` |  |
| `onSelectedChange` (optional) | `(ids: string[]) => void` |  |
| `sort` (optional) | `TaskSort` | The column the rows are sorted by. Leave it out to let the headers set it. Defaults to updated, newest first |
| `defaultSort` (optional) | `TaskSort` |  |
| `onSortChange` (optional) | `(sort: TaskSort) => void` |  |
| `onAction` (optional) | `(action: TaskAction, ids: string[]) => void` | A button in the header while tasks are selected. The selection clears after it; cancelled rows slide away first |
| `empty` (optional) | `ReactNode` | What shows when there are no tasks. Defaults to a short "No agent tasks" note |
| `emptyAction` (optional) | `{ label: string; onClick: () => void }` | A button under the empty note, like { label: 'Bring them back', onClick } |
| `className` (optional) | `string` |  |

## Questions

**Does Cancel remove the rows for me?**

No. The rows slide out, then `onAction('cancel', ids)` is called. Remove those tasks from `tasks` in that handler or they come back.

**How is "Updated" shown?**

`updated` is the number of minutes since the task last changed. It reads as "14m ago", or "Just now" at 0, and the default sort puts the smallest number first.

**Can I select rows from my own code?**

Yes. Control `selected` with an array of task ids and update it from `onSelectedChange`. The demo selects a failed task and a running task this way, then retries them.

## Source

`TaskTable.tsx`, as `npx designme add task-table --react` installs it:

```tsx
'use client';
import { useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Avatar, Spin, Swap } from '../lib/motion';
import '../designme.css';
import './task-table.css';

export type TaskStatus = 'running' | 'failed' | 'queued' | 'paused' | 'done';

export interface Task {
  id: string;
  /** What the agent is doing, like "Audit pricing contrast" */
  name: string;
  status: TaskStatus;
  /** The agent on it, shown as a small avatar and a name */
  agent: { name: string; initials: string; color: string };
  /** In dollars, shown as $0.42 */
  cost: number;
  /** Minutes since it last changed, shown as "14m ago", or "Just now" at 0 */
  updated: number;
}

export type TaskSortKey = 'name' | 'status' | 'agent' | 'cost' | 'updated';
export interface TaskSort { key: TaskSortKey; desc?: boolean }
export type TaskAction = 'pause' | 'retry' | 'cancel';

export interface TaskTableProps {
  tasks: Task[];
  /** The name in the header. Defaults to "Agent tasks" */
  title?: string;
  /** The quiet line beside the name. Defaults to a count of tasks and how many are running */
  summary?: string;
  /** Ids of the selected tasks. Leave it out to let the checkboxes and rows toggle it */
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  /** The column the rows are sorted by. Leave it out to let the headers set it. Defaults to updated, newest first */
  sort?: TaskSort;
  defaultSort?: TaskSort;
  onSortChange?: (sort: TaskSort) => void;
  /** A button in the header while tasks are selected. The selection clears after it; cancelled rows slide away first */
  onAction?: (action: TaskAction, ids: string[]) => void;
  /** What shows when there are no tasks. Defaults to a short "No agent tasks" note */
  empty?: ReactNode;
  /** A button under the empty note, like { label: 'Bring them back', onClick } */
  emptyAction?: { label: string; onClick: () => void };
  className?: string;
}

const STATUS: Record<TaskStatus, { label: string; rank: number; tone: string; glyph: () => ReactNode }> = {
  running: { label: 'Running', rank: 0, tone: 'run', glyph: () => <Spin /> },
  failed: { label: 'Failed', rank: 1, tone: 'fail', glyph: () => <Icon name="alert" size="xs" /> },
  queued: { label: 'Queued', rank: 2, tone: 'wait', glyph: () => <span className="dm-dot" /> },
  paused: { label: 'Paused', rank: 3, tone: 'pause', glyph: () => <Icon name="pause" size="xs" /> },
  done: { label: 'Done', rank: 4, tone: 'done', glyph: () => <Icon name="ok" size="xs" /> }
};
const COLUMNS: { key: TaskSortKey; label: string; right?: boolean }[] = [
  { key: 'name', label: 'Task' }, { key: 'status', label: 'Status' }, { key: 'agent', label: 'Agent' },
  { key: 'cost', label: 'Cost', right: true }, { key: 'updated', label: 'Updated', right: true }
];
const FIELD: Record<TaskSortKey, (t: Task) => string | number> = {
  name: t => t.name, status: t => STATUS[t.status].rank, agent: t => t.agent.name, cost: t => t.cost, updated: t => t.updated
};
const ACTIONS: { key: TaskAction; label: string; icon: 'pause' | 'refresh' | 'x' }[] = [
  { key: 'pause', label: 'Pause', icon: 'pause' }, { key: 'retry', label: 'Retry', icon: 'refresh' }, { key: 'cancel', label: 'Cancel', icon: 'x' }
];
const ago = (m: number) => (m ? m + 'm ago' : 'Just now');

/** A tick that springs in, and the dash select-all shows while only some rows are picked */
const Tick = () => <><Icon name="check" size="xs" className="dm-ck-y" /><Icon name="minus" size="xs" className="dm-ck-m" /></>;

/**
 * Agent tasks in a sortable table. Pick rows and the header turns into what you can do to them; rows glide when the
 * order changes, cancelled ones slide away, and an empty table says so.
 */
export function TaskTable({
  tasks, title = 'Agent tasks', summary, selected, defaultSelected = [], onSelectedChange, sort, defaultSort = { key: 'updated' }, onSortChange,
  onAction, empty, emptyAction, className
}: TaskTableProps) {
  const [sel, setSel] = useControllable(selected, defaultSelected, onSelectedChange);
  const [by, setBy] = useControllable(sort, defaultSort, onSortChange);
  const [leaving, setLeaving] = useState<string[]>([]);
  const reduce = useReducedMotion();
  const f = FIELD[by.key];
  const rows = [...tasks].sort((a, b) => { const x = f(a), y = f(b); return (x > y ? 1 : x < y ? -1 : 0) * (by.desc ? -1 : 1); });
  const picked = sel.filter(id => tasks.some(t => t.id === id) && !leaving.includes(id));
  const n = picked.length, all = n === 0 ? 'false' : n === tasks.length ? 'true' : 'mixed';
  // the header keeps its count while it slides back to the title
  const [shown, setShown] = useState(n);
  if (n && n !== shown) setShown(n);
  const running = tasks.filter(t => t.status === 'running').length;
  const line = summary ?? (tasks.length ? `${tasks.length} task${tasks.length === 1 ? '' : 's'}, ${running} running` : 'No tasks');

  // rows glide to their new places: where each row sat in the table is kept after every render and eased from on the next
  const body = useRef<HTMLTableSectionElement>(null);
  const was = useRef(new Map<string, number>());
  useIsoLayoutEffect(() => {
    const now = new Map<string, number>();
    body.current?.querySelectorAll<HTMLTableRowElement>('tr[data-id]').forEach(tr => {
      const id = tr.dataset.id!, top = tr.offsetTop, before = was.current.get(id);
      now.set(id, top);
      if (!reduce && before !== undefined && Math.abs(before - top) > 1) tr.animate([{ transform: `translateY(${before - top}px)` }, { transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.22,1,.36,1)' });
    });
    was.current = now;
  });

  const toggle = (id: string) => setSel(sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
  const sortBy = (key: TaskSortKey) => setBy(key === by.key ? { key, desc: !by.desc } : { key, desc: false });
  const act = (a: TaskAction) => {
    const ids = picked; setSel([]);
    if (a !== 'cancel' || reduce) { onAction?.(a, ids); return; }
    setLeaving(ids);
    setTimeout(() => { onAction?.(a, ids); setLeaving([]); }, 250);
  };

  return (
    <div data-dm="" className={cx('dm-ttx-box', className)} style={{ containerType: 'inline-size', width: '100%' }}>
      <div className={cx('dm-ttx dm-panel', n > 0 && 'dm-selecting')}>
        <div className="dm-ttx-hd">
          <div className="dm-ttx-ti" inert={n > 0}><b>{title}</b><Swap className="dm-muted dm-num dm-ttx-sum">{line}</Swap></div>
          <div className="dm-ttx-sb" inert={n === 0}>
            <span className="dm-ttx-n dm-num">{shown} selected</span>
            {ACTIONS.map(a => (
              <button key={a.key} type="button" className={cx('dm-pill dm-ghost dm-sm', a.key === 'cancel' && 'dm-ttx-del')} onClick={() => act(a.key)}><Icon name={a.icon} size="xs" />{a.label}</button>
            ))}
            <span className="dm-ttx-sp" />
            <button type="button" className="dm-pill dm-ghost dm-sm dm-ttx-clr" onClick={() => setSel([])}>Clear</button>
          </div>
        </div>
        <div className="dm-ttx-sc">
          <table className="dm-ttx-t">
            <thead>
              <tr>
                <th className="dm-ck">
                  <button type="button" className="dm-ttx-cb dm-ttx-all" role="checkbox" aria-checked={all} aria-label="Select all" onClick={() => setSel(all === 'true' ? [] : tasks.map(t => t.id))}><Tick /></button>
                </th>
                {COLUMNS.map(c => (
                  <th key={c.key} className={c.right ? 'dm-r' : undefined} aria-sort={by.key === c.key ? (by.desc ? 'descending' : 'ascending') : 'none'}>
                    <button type="button" className={cx('dm-ttx-s', by.key === c.key && 'dm-on', by.desc && 'dm-desc')} onClick={() => sortBy(c.key)}>
                      {c.label}<span className="dm-ar"><Icon name="chev-u" size="xs" /></span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody ref={body}>
              {rows.map((t, i) => {
                const on = picked.includes(t.id), st = STATUS[t.status];
                return (
                  <tr key={t.id} data-id={t.id} className={cx('dm-enter', on && 'dm-sel', leaving.includes(t.id) && 'dm-ttx-out')} style={{ animationDelay: i * 30 + 'ms' }} onClick={() => toggle(t.id)}>
                    <td className="dm-ck">
                      <button type="button" className="dm-ttx-cb" role="checkbox" aria-checked={on} aria-label={'Select ' + t.name}><Tick /></button>
                    </td>
                    <td className="dm-nm">{t.name}</td>
                    <td><span className="dm-ttx-st" data-s={st.tone}><span key={t.status} className="dm-sv dm-ttx-sin">{st.glyph()}<span>{st.label}</span></span></span></td>
                    <td><span className="dm-ag"><Avatar initials={t.agent.initials} color={t.agent.color} />{t.agent.name}</span></td>
                    <td className="dm-r dm-num">${t.cost.toFixed(2)}</td>
                    <td className="dm-r dm-num dm-up"><Swap>{ago(t.updated)}</Swap></td>
                  </tr>
                );
              })}
              {!tasks.length && (
                <tr className="dm-ttx-empty dm-enter">
                  <td colSpan={6}>
                    {empty ?? (
                      <div className="dm-ttx-em">
                        <span className="dm-ic"><Icon name="check" /></span>
                        <b>No agent tasks</b>
                        <span>Everything has finished or been cancelled.</span>
                        {emptyAction && <button type="button" className="dm-pill dm-ghost dm-sm" onClick={emptyAction.onClick}><Icon name="refresh" size="xs" />{emptyAction.label}</button>}
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

## More in Sources and output

- [Code viewer](https://designme.dev/components/code-viewer.md): Code the agent wrote, with line notes you can ask about.
- [Citation hover card](https://designme.dev/components/citation-hover-card.md): Hover a citation to see the exact passage it came from.
- [Source stack](https://designme.dev/components/source-stack.md): Everything the agent read, folded into one quiet pill.
- [Field extraction](https://designme.dev/components/field-extraction.md): The agent pulls fields out of a document and shows where each came from.
- [Metric insight](https://designme.dev/components/metric-insight.md): A number, its trend, and the agent's read on why it moved.
- [Details panel](https://designme.dev/components/details-panel.md): Properties of a run you can change in place.

All components: https://designme.dev/llms.txt
