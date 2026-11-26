'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useReducedMotion } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Avatar, Spin, Swap, useGrow, useMounted, useReflow } from '../../lib/motion';
import { useColumns } from '../../lib/columns';
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
  /** The quiet line beside the name. Defaults to a count of tasks and how many are running (nothing while the table is
   *  empty, as the empty note says so) */
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
  /** What shows when there are no tasks. Defaults to a short "No agent tasks" note under a small sketch of the table */
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
const COLUMNS: { key: TaskSortKey; label: string; right?: boolean; name?: boolean }[] = [
  { key: 'name', label: 'Task', name: true }, { key: 'status', label: 'Status' }, { key: 'agent', label: 'Agent' },
  { key: 'cost', label: 'Cost', right: true }, { key: 'updated', label: 'Updated', right: true }
];
const FIELD: Record<TaskSortKey, (t: Task) => string | number> = {
  name: t => t.name, status: t => STATUS[t.status].rank, agent: t => t.agent.name, cost: t => t.cost, updated: t => t.updated
};
const ACTIONS: { key: TaskAction; label: string; icon: 'pause' | 'refresh' | 'x' }[] = [
  { key: 'pause', label: 'Pause', icon: 'pause' }, { key: 'retry', label: 'Retry', icon: 'refresh' }, { key: 'cancel', label: 'Cancel', icon: 'x' }
];
const ago = (m: number) => (m ? m + 'm ago' : 'Just now');

/** A small sketch of the table's rows for the empty note: a soft card in Soft, Clean's white card in Clean; Blueprint keeps
 *  its mark */
const ART = <span className="dm-ttx-em-art" aria-hidden="true">{[0, 1, 2].map(i => <span key={i} className="dm-r"><i className="dm-t" /><i className="dm-l" /></span>)}</span>;

/** A tick that springs in, and the dash select-all shows while only some rows are picked */
const Tick = () => <><Icon name="check" size="xs" className="dm-ck-y" /><Icon name="minus" size="xs" className="dm-ck-m" /></>;

/**
 * Agent tasks in a sortable table. Pick rows and the header turns into what you can do to them; rows glide when the
 * order changes, cancelled ones slide away, and an empty table says so. The card grows and shrinks with its rows, keeping
 * no room for them.
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
  const line = summary ?? (tasks.length ? `${tasks.length} task${tasks.length === 1 ? '' : 's'}, ${running} running` : '');

  // rows glide to their new places, a short glide from where they are on screen, so sorting again mid-glide carries on from
  // there; rows that come back fade in. Cancelled rows slide away on their own (dm-ttx-out). The rows play their entrance
  // once, so a sort that moves them doesn't play it again
  // the card keeps no room for rows to come or for the empty note (owner, 18 Nov): it follows its rows' height, eased
  const [panel, inner] = useGrow();
  useReflow(panel, 'tbody > tr[data-id]', { by: 'data-id', leave: false });
  const mounted = useMounted();
  // the columns resize and move as in a spreadsheet; Task stays first with its checkbox, and on a narrow card, where each task
  // is a small card (528px of content or less), every row keeps its own order
  const [wide, setWide] = useState(true);
  useEffect(() => { const el = panel.current; if (!el) return; const ro = new ResizeObserver(() => setWide(el.clientWidth - 32 > 528)); ro.observe(el); return () => ro.disconnect(); }, [panel]);
  const cols = useColumns<TaskSortKey>(COLUMNS.map(c => c.key), { lead: 1, move: ['status', 'agent', 'cost', 'updated'], min: { name: 140, status: 104, agent: 96, cost: 72, updated: 88 }, wide, name: k => COLUMNS.find(c => c.key === k)!.label });
  const COL = Object.fromEntries(COLUMNS.map(c => [c.key, c])) as Record<TaskSortKey, (typeof COLUMNS)[number]>;
  const cell = (t: Task, k: TaskSortKey): ReactNode => {
    const st = STATUS[t.status];
    switch (k) {
      case 'name': return <td key={k} data-col={k} className="dm-nm">{t.name}</td>;
      case 'status': return <td key={k} data-col={k}><span className="dm-ttx-st" data-s={st.tone}><span key={t.status} className="dm-sv dm-ttx-sin">{st.glyph()}<span>{st.label}</span></span></span></td>;
      case 'agent': return <td key={k} data-col={k}><span className="dm-ag"><Avatar initials={t.agent.initials} color={t.agent.color} /><span>{t.agent.name}</span></span></td>;
      case 'cost': return <td key={k} data-col={k} className="dm-r dm-num">${t.cost.toFixed(2)}</td>;
      default: return <td key={k} data-col={k} className="dm-r dm-num dm-up"><Swap>{ago(t.updated)}</Swap></td>;
    }
  };

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
      <div ref={panel} className={cx('dm-ttx dm-panel dm-growing', n > 0 && 'dm-selecting', !tasks.length && 'dm-none')}>
        <div ref={inner} className="dm-grow">
        {/* the head's mark is the column every row's checkbox is centred in; the title and each task's name start after it */}
        <div className="dm-ttx-hd">
          <span className="dm-ttx-hi" aria-hidden="true"><Icon name="list" /></span>
          <div className="dm-ttx-hx">
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
        </div>
        <div className="dm-ttx-sc">
          <table {...cols.table} className={cx('dm-ttx-t', cols.sized && 'dm-cols-rz')}>
            {cols.colgroup}
            <thead>
              <tr>
                <th className="dm-ck">
                  <button type="button" className="dm-ttx-cb dm-ttx-all" role="checkbox" aria-checked={all} aria-label="Select all" onClick={() => setSel(all === 'true' ? [] : tasks.map(t => t.id))}><Tick /></button>
                </th>
                {cols.order.map(k => { const c = COL[k]; return (
                  <th key={c.key} {...cols.head(c.key)} className={c.right ? 'dm-r' : c.name ? 'dm-nm' : undefined} aria-sort={by.key === c.key ? (by.desc ? 'descending' : 'ascending') : 'none'}>
                    <button type="button" className={cx('dm-ttx-s', by.key === c.key && 'dm-on', by.desc && 'dm-desc')} onClick={() => sortBy(c.key)}>
                      {c.label}<span className="dm-ar"><Icon name="chev-u" size="xs" /></span>
                    </button>
                    {cols.handle(c.key)}
                  </th>
                ); })}
              </tr>
            </thead>
            <tbody>
              {rows.map((t, i) => {
                const on = picked.includes(t.id);
                return (
                  <tr key={t.id} data-id={t.id} className={cx(!mounted && 'dm-enter', on && 'dm-sel', leaving.includes(t.id) && 'dm-ttx-out')} style={mounted ? undefined : { animationDelay: i * 30 + 'ms' }} onClick={() => toggle(t.id)}>
                    <td className="dm-ck">
                      <button type="button" className="dm-ttx-cb" role="checkbox" aria-checked={on} aria-label={'Select ' + t.name}><Tick /></button>
                    </td>
                    {cols.order.map(k => cell(t, k))}
                  </tr>
                );
              })}
              {!tasks.length && (
                <tr className="dm-ttx-empty dm-enter">
                  <td colSpan={6}>
                    {empty ?? (
                      <div className="dm-ttx-em">
                        <span className="dm-ic"><Icon name="check" /></span>
                        {ART}
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
    </div>
  );
}
