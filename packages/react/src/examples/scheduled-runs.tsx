'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { useStory, useWait } from './useScript';
import { ScheduledRuns, type ScheduledRun } from '../components/scheduled-runs/ScheduledRuns';

/* ---------- Scheduled runs: run the design QA now, reconnect Figma so the token sync passes, pause the price check ---------- */
const RUNS: ScheduledRun[] = [
  { key: 'qa', name: 'Weekly design QA', schedule: 'Mondays at 9:00', next: 'Next in 2 days', result: 'passed', ago: '5 days ago', icon: 'palette', color: 'var(--dm-pl)' },
  { key: 'tokens', name: 'Sync tokens from Figma', schedule: 'Every day at 8:00', next: 'Next in 17h', result: 'failed', error: 'Figma token expired', fix: 'Reconnect Figma', brand: 'figma' },
  { key: 'price', name: 'Competitor price check', schedule: 'Fridays at 17:00', next: 'Next in 6 days', result: 'passed', ago: 'yesterday', icon: 'chart', color: 'var(--dm-pt)' }
];

export default function ScheduledRunsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [runs, setRuns] = useState(RUNS);
  const wait = useWait();
  const patch = (key: string, p: Partial<ScheduledRun>) => setRuns(rs => rs.map(r => r.key === key ? { ...r, ...p } : r));

  const runNow = async (key: string) => { patch(key, { result: 'running' }); await wait(3000); patch(key, { result: 'passed', ago: 'just now', error: undefined }); };
  // reconnecting takes a moment, then the run goes again straight away
  const fix = async (key: string) => { patch(key, { fixing: true }); await wait(900); patch(key, { fixing: false }); runNow(key); };

  // the preview's story: run the design QA and watch it pass, reconnect Figma so the token sync passes, then pause the price check
  useStory(ref, async ({ wait, press }) => {
    await wait(2000); press('.dm-shx-r:nth-child(1) .dm-shx-run');
    await wait(4000); press('.dm-shx-r:nth-child(2) .dm-shx-fx .dm-pill');
    await wait(5000); press('.dm-shx-r:nth-child(3) .dm-toggle');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ScheduledRuns runs={runs} onRunsChange={setRuns} onRunNow={runNow} onFix={fix}
        onCreate={n => setRuns(rs => [...rs, { key: 'new' + rs.length, name: n.task, schedule: n.schedule, next: n.next, result: 'never' }])} />
    </div>
  );
}
