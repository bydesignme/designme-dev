'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { TaskTable, type Task, type TaskAction } from '../components/task-table/TaskTable';
import { useScript } from './useScript';

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
