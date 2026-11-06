'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { RunQueue, type RunJob } from '../components/run-queue/RunQueue';
import type { IconName } from '../lib/icons';
import { useScript, useTakeover } from './useScript';

/* ---------- Run queue: four jobs run in turn, each with its agent. The launch email's test send fails once and waits for
   Retry, and retries by itself after a moment until you take over ---------- */
const STEP = 1.4;
const JOBS: { title: string; agent: string; icon: IconName; steps: [string, string, boolean?][] }[] = [
  { title: 'Research three competitors', agent: 'Research agent', icon: 'search', steps: [['Read their pricing pages', '3 of 3'], ['Compared plans and limits', '5 gaps']] },
  { title: 'Draft the launch email', agent: 'Copy agent', icon: 'mail', steps: [['Pulled the new features', '6 items'], ['Wrote two subject lines', '2 drafts'], ['Sent a test to the team', 'Sent', true]] },
  { title: 'Update the help centre', agent: 'Docs agent', icon: 'book', steps: [['Billing questions', '4 articles'], ['Inviting your team', '2 articles']] },
  { title: 'Post the changelog', agent: 'Release agent', icon: 'send', steps: [['Posted in #releases', 'Posted']] }
];
const secs = (gi: number) => JOBS[gi].steps.length * STEP;

export default function RunQueueDemo() {
  const [jobs, setJobs] = useState<RunJob[]>(() => JOBS.map(j => ({ title: j.title, agent: j.agent, icon: j.icon, state: 'queued', steps: j.steps.map(([label, meta]) => ({ label, meta, state: 'queued' })) })));
  const [summary, setSummary] = useState<string>();
  const retry = useRef<() => void>(undefined);
  const ref = useRef<HTMLDivElement>(null), mine = useTakeover(ref);
  // when each waiting job starts: after what is left of the one running and of every job ahead of it
  const times = (all: RunJob[]) => { let ahead = 0;
    return all.map((j, k) => {
      if (j.state === 'running' || j.state === 'failed') { const left = secs(k) * (1 - (j.progress ?? 0)); ahead += left; return j.state === 'running' ? { ...j, time: left < .5 ? 'Finishing' : `${Math.ceil(left)}s left` } : j; }
      if (j.state === 'queued') { const t = `in ~${Math.max(1, Math.round(ahead))}s`; ahead += secs(k); return { ...j, time: t }; }
      return j;
    }); };
  const edit = (gi: number, g: Partial<RunJob>, si?: number, s?: Partial<NonNullable<RunJob['steps']>[number]>) =>
    setJobs(all => times(all.map((x, k) => k !== gi ? x : { ...x, ...g, steps: x.steps?.map((y, j) => (j === si ? { ...y, ...s } : y)) })));
  useScript(async ({ wait }) => {
    edit(0, { state: 'running', progress: 0 });
    await wait(700);
    let total = 0, retries = 0;
    for (let gi = 0; gi < JOBS.length; gi++) {
      const n = JOBS[gi].steps.length; let took = 0, failed = false;
      edit(gi, { state: 'running', progress: 0 });
      for (let si = 0; si < n; si++) {
        edit(gi, {}, si, { state: 'running' });
        // the step fills its share of the bar a tenth of a second at a time; the test send fails part way, once
        const failAt = JOBS[gi].steps[si][2] && !failed ? .55 : 2;
        let q = 0;
        while (q < 1 && q < failAt) { await wait(100); q = Math.min(1, q + .1 / STEP); took += .1; edit(gi, { progress: (si + q) / n }); }
        if (q < 1) {
          failed = true;
          edit(gi, { state: 'failed', time: 'Test send failed' }, si, { state: 'failed' });
          await new Promise<void>(res => { retry.current = res; wait(2800).then(() => { if (!mine()) res(); }); });
          retries++; si--;
          edit(gi, { state: 'running' });
          continue;
        }
        edit(gi, {}, si, { state: 'done' });
      }
      total += took;
      await wait(420);
      edit(gi, { state: 'done', progress: 1, time: `${took.toFixed(1)}s${failed ? ' · 1 retry' : ''}` });
    }
    setSummary(`${total.toFixed(1)}s in all · ${retries ? `${retries} ${retries > 1 ? 'retries' : 'retry'}` : 'no retries'}`);
  });
  return <div ref={ref} style={{ width: '100%' }}><RunQueue title="Launch prep" jobs={jobs} summary={summary} onRetry={() => retry.current?.()} /></div>;
}
