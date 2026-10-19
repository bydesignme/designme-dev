'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useState } from 'react';
import { AgentRunTimeline, type TimelineStep } from '../components/agent-run-timeline/AgentRunTimeline';

/* ---------- Agent run timeline: the playhead sweeps the run at 1.6x, then the totals settle ---------- */
const STEPS: TimelineStep[] = [
  { label: 'Plan the change', icon: 'brain', start: 0, duration: 1.6, color: 'var(--dm-c2)', cost: 0.03 },
  { label: 'Read 6 files', icon: 'file-text', start: 1.6, duration: 2.2, color: 'var(--dm-c1)', cost: 0.02 },
  { label: 'Search Figma', icon: 'figma', start: 1.9, duration: 1.4, color: 'var(--dm-c6)', cost: 0.01 },
  { label: 'Edit PricingCard', icon: 'edit', start: 4, duration: 2.4, color: 'var(--dm-c2)', cost: 0.06 },
  { label: 'Run tests', icon: 'term', start: 6.5, duration: 1.5, color: 'var(--dm-c3)', cost: 0.01, failed: true, note: '2 tests failed' },
  { label: 'Run tests, retry', icon: 'refresh', start: 8.1, duration: 1.9, color: 'var(--dm-c3)', cost: 0.01 },
  { label: 'Open PR', icon: 'pr', start: 10.1, duration: 1.3, color: 'var(--dm-c4)', cost: 0.02 }
];
const SPAN = 12;

export default function AgentRunTimelineDemo() {
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    let raf = 0;
    const start = setTimeout(() => {
      setStarted(true);
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(SPAN, ((now - t0) / 1000) * 1.6);
        setTime(t);
        if (t < SPAN) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, 500);
    return () => { clearTimeout(start); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div style={{ width: '100%' }}>
      <AgentRunTimeline title="Run 4821, update the pricing page" steps={STEPS} span={SPAN} time={time} status={started ? undefined : 'Starting'} />
    </div>
  );
}
