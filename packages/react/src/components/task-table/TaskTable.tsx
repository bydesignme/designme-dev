'use client';
import { useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Avatar, Dot, enter, Spin } from '../../lib/motion';
import '../../designme.css';
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
  /** Minutes since it last changed, shown as "14m ago" */
  updated: number;
}

export type TaskSortKey = 'name' | 'status' | 'agent' | 'cost' | 'updated';
export interface TaskSort { key: TaskSortKey; desc?: boolean }
export type TaskAction = 'pause' | 'retry' | 'cancel';

export interface TaskTableProps {
  tasks: Task[];
  /** Ids of the selected tasks. Leave it out to let the checkboxes and rows toggle it */
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  /** The column the rows are sorted by. Leave it out to let the headers set it. Defaults to updated, newest first */
  sort?: TaskSort;
  defaultSort?: TaskSort;
  onSortChange?: (sort: TaskSort) => void;
  /** A button in the bar that rises when tasks are selected. The selection clears after it */
  onAction?: (action: TaskAction, ids: string[]) => void;
  className?: string;
}

const STATUS: Record<TaskStatus, { label: string; rank: number; glyph: () => ReactNode }> = {
  running: { label: 'Running', rank: 0, glyph: () => <Spin /> },
  failed: { label: 'Failed', rank: 1, glyph: () => <span style={{ color: 'var(--dm-bad)', display: 'grid' }}><Icon name="alert" size="xs" /></span> },
  queued: { label: 'Queued', rank: 2, glyph: () => <Dot color="var(--dm-faint)" /> },
  paused: { label: 'Paused', rank: 3, glyph: () => <span className="dm-muted" style={{ display: 'grid' }}><Icon name="pause" size="xs" /></span> },
  done: { label: 'Done', rank: 4, glyph: () => <span style={{ color: 'var(--dm-ok)', display: 'grid' }}><Icon name="ok" size="xs" /></span> }
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

/** Agent tasks in a sortable table. Select rows and a bar rises with what you can do to them. */
export function TaskTable({ tasks, selected, defaultSelected = [], onSelectedChange, sort, defaultSort = { key: 'updated' }, onSortChange, onAction, className }: TaskTableProps) {
  const [sel, setSel] = useControllable(selected, defaultSelected, onSelectedChange);
  const [by, setBy] = useControllable(sort, defaultSort, onSortChange);
  // the rows replay their entrance when the order changes or an action runs, not when a row is ticked
  const [round, setRound] = useState(0);
  const f = FIELD[by.key];
  const rows = [...tasks].sort((a, b) => { const x = f(a), y = f(b); return (x > y ? 1 : x < y ? -1 : 0) * (by.desc ? -1 : 1); });
  const picked = sel.filter(id => tasks.some(t => t.id === id));
  const n = picked.length, all = n === 0 ? 'false' : n === tasks.length ? 'true' : 'mixed';
  // the bar keeps its count while it slides away
  const [shown, setShown] = useState(n);
  if (n && n !== shown) setShown(n);

  const toggle = (id: string) => setSel(sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
  const sortBy = (key: TaskSortKey) => { setBy(key === by.key ? { key, desc: !by.desc } : { key, desc: false }); setRound(r => r + 1); };
  const act = (a: TaskAction) => { onAction?.(a, picked); setSel([]); setRound(r => r + 1); };

  return (
    <div data-dm="" className={cx('dm-ttx-box', className)} style={{ containerType: 'inline-size', width: '100%' }}>
      <div className="dm-ttx dm-panel">
        <div className="dm-ttx-sc">
          <table className="dm-ttx-t">
            <thead>
              <tr>
                <th className="dm-ck">
                  <button type="button" className="dm-ttx-cb" role="checkbox" aria-checked={all} aria-label="Select all" onClick={() => setSel(all === 'true' ? [] : tasks.map(t => t.id))}>
                    {n > 0 && <Icon name={all === 'true' ? 'check' : 'minus'} size="xs" />}
                  </button>
                </th>
                {COLUMNS.map(c => (
                  <th key={c.key} className={c.right ? 'dm-r' : undefined} aria-sort={by.key === c.key ? (by.desc ? 'descending' : 'ascending') : undefined}>
                    <button type="button" className={cx('dm-ttx-s', by.key === c.key && 'dm-on', by.desc && 'dm-desc')} onClick={() => sortBy(c.key)}>
                      {c.label}<span className="dm-ar"><Icon name="chev-u" size="xs" /></span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((t, i) => {
                const on = picked.includes(t.id), e = enter(i * 30);
                return (
                  <tr key={round + ':' + t.id} className={cx(on && 'dm-sel', e.className)} style={e.style} onClick={() => toggle(t.id)}>
                    <td className="dm-ck">
                      <button type="button" className="dm-ttx-cb" role="checkbox" aria-checked={on} aria-label={'Select ' + t.name}>{on && <Icon name="check" size="xs" />}</button>
                    </td>
                    <td className="dm-nm">{t.name}</td>
                    <td><span className="dm-ttx-st">{STATUS[t.status].glyph()}{STATUS[t.status].label}</span></td>
                    <td><span className="dm-ag"><Avatar initials={t.agent.initials} color={t.agent.color} />{t.agent.name}</span></td>
                    <td className="dm-r dm-num">${t.cost.toFixed(2)}</td>
                    <td className="dm-r dm-num dm-muted">{t.updated}m ago</td>
                  </tr>
                );
              })}
              {/* room under the last row, so the bar never covers it */}
              <tr className="dm-ttx-pad"><td colSpan={6} /></tr>
            </tbody>
          </table>
        </div>
        <div className={cx('dm-ttx-bar', n > 0 && 'dm-show')} inert={n === 0}>
          <span className="dm-ttx-n dm-num">{shown} selected</span>
          {ACTIONS.map(a => <button key={a.key} type="button" className="dm-pill dm-ghost dm-sm" onClick={() => act(a.key)}><Icon name={a.icon} size="xs" />{a.label}</button>)}
        </div>
      </div>
    </div>
  );
}
