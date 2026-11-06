'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { AgentRunTimeline, type TimelineStep } from '../components/agent-run-timeline/AgentRunTimeline';
import { useStory } from './useScript';

/* ---------- Agent run timeline: the playhead sweeps the run at 1.6x, the tests fail and run again, then the totals settle ---------- */
const STEPS: TimelineStep[] = [
  { label: 'Plan the change', icon: 'brain', kind: 'model', start: 0, duration: 1.6, cost: 0.03 },
  { label: 'Read 6 files', icon: 'file-text', kind: 'tool', start: 1.6, duration: 2.2, cost: 0.02 },
  { label: 'Search Figma', brand: 'figma', kind: 'app', start: 1.9, duration: 1.4, cost: 0.01 },
  { label: 'Edit PricingCard', icon: 'edit', kind: 'model', start: 4, duration: 2.4, cost: 0.06 },
  { label: 'Run tests', icon: 'term', kind: 'tool', start: 6.5, duration: 1.5, cost: 0.01, failed: true, tag: '2 failed', note: '2 tests failed' },
  { label: 'Run tests again', icon: 'refresh', kind: 'tool', start: 8.1, duration: 1.9, cost: 0.01, retry: true },
  { label: 'Open a PR on GitHub', brand: 'github', kind: 'app', start: 10.1, duration: 1, cost: 0.02 },
  { label: 'Post to Slack', brand: 'slack', kind: 'app', start: 11.1, duration: 0.6, cost: 0.01 }
];
const SPAN = 12, END = 11.7, PACE = 1.6;

export default function AgentRunTimelineDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<number | undefined>(0);
  const [started, setStarted] = useState(false);
  // the run plays at 1.6 times real speed; while a mouse rests on it the story holds, and the clock waits with it
  useStory(ref, async ({ wait }) => {
    await wait(500);
    setStarted(true);
    let t = 0, last = performance.now();
    while (t < END) {
      await wait(16);
      const now = performance.now();
      // a long gap is a hold ending, and counts as one frame
      t = Math.min(END, t + ((now - last < 250 ? now - last : 16) / 1000) * PACE); last = now;
      setTime(t);
    }
    setTime(undefined);
  }, { hold: false });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <AgentRunTimeline title="Run 4821, update the pricing page" steps={STEPS} span={SPAN} time={time} status={started ? undefined : 'Starting'} />
    </div>
  );
}
