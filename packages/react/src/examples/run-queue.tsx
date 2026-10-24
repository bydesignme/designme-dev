'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { RunQueue, type RunGroup } from '../components/run-queue/RunQueue';
import { useScript, useTakeover } from './useScript';

/* ---------- Run queue: three tasks run in turn; one step fails and waits for Retry, and retries by itself after a moment ---------- */
const TASKS: { title: string; steps: [string, string, boolean?][] }[] = [
  { title: 'Research three competitors', steps: [['Read their pricing pages', '3/3'], ['Compared plans and limits', '5 gaps']] },
  { title: 'Draft the launch email', steps: [['Pulled the new features', 'Done'], ['Wrote two subject lines', 'Done'], ['Sent a test to the team', 'Done', true]] },
  { title: 'Update the help centre', steps: [['Billing questions', '4 articles'], ['Inviting your team', '2 articles']] }
];

export default function RunQueueDemo() {
  const [groups, setGroups] = useState<RunGroup[]>(() => TASKS.map(t => ({ title: t.title, state: 'queued', steps: t.steps.map(([label, meta]) => ({ label, meta, state: 'queued' })) })));
  const retry = useRef<() => void>(undefined);
  const ref = useRef<HTMLDivElement>(null), mine = useTakeover(ref);
  const edit = (gi: number, g: Partial<RunGroup>, si?: number, s?: Partial<RunGroup['steps'][number]>) =>
    setGroups(all => all.map((x, k) => k !== gi ? x : { ...x, ...g, steps: x.steps.map((y, j) => (j === si ? { ...y, ...s } : y)) }));
  useScript(async ({ wait }) => {
    await wait(600);
    for (let gi = 0; gi < TASKS.length; gi++) {
      edit(gi, { state: 'running' });
      for (let si = 0, retried = false; si < TASKS[gi].steps.length; si++) {
        edit(gi, {}, si, { state: 'running' });
        await wait(900);
        if (TASKS[gi].steps[si][2] && !retried) {
          edit(gi, { state: 'failed' }, si, { state: 'failed' });
          // waits for Retry, and carries on by itself after a moment so the run never stalls, until you take over
          await new Promise<void>(res => { retry.current = res; wait(2800).then(() => { if (!mine()) res(); }); });
          retried = true; si--;
          edit(gi, { state: 'running', meta: 'Retrying' });
          continue;
        }
        edit(gi, {}, si, { state: 'done' });
      }
      edit(gi, { state: 'done', meta: undefined });
    }
  });
  return <div ref={ref} style={{ width: '100%' }}><RunQueue groups={groups} onRetry={() => retry.current?.()} /></div>;
}
