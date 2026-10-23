'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { PlanReview, type PlanPhase, type PlanReviewStep } from '../components/plan-review/PlanReview';
import { useScript, useStory } from './useScript';

/* ---------- Plan review: rewrite a step, approve, and the agent works through a rate limit to the end ---------- */
const PLAN: [text: string, done: string][] = [
  ['Read the pricing frames and the brand tokens', '6 frames and 42 tokens read'],
  ['Compare against the three competitor pages', '3 pages compared'],
  ['Simplify the plan cards to one CTA each', 'Plan cards now have one CTA each'],
  ['Move the FAQ below the comparison table', 'FAQ now sits under the table'],
  ['Write a summary of every change', 'Summary added to Pricing v4']
];
const DONE = new Map(PLAN.map(([text, done], i) => ['s' + i, { text, done }]));
const clock = (ms: number) => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

export default function PlanReviewDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [steps, setSteps] = useState<PlanReviewStep[]>(() => PLAN.map(([text], i) => ({ id: 's' + i, text })));
  const [phase, setPhase] = useState<PlanPhase>('review');
  const [status, setStatus] = useState<string>();
  const [note, setNote] = useState<string>();
  const [ms, setMs] = useState<number>();
  const live = useRef(steps);
  useEffect(() => { live.current = steps; });
  const stop = useRef(false);

  useScript(async ({ wait }) => {
    if (phase !== 'running') return;
    const t0 = performance.now(), tick = setInterval(() => setMs(performance.now() - t0), 250); setMs(0);
    const on = live.current.filter(s => !s.skipped);
    const mark = (id: string, change: Partial<PlanReviewStep>) => setSteps(ss => ss.map(s => s.id === id ? { ...s, ...change } : s));
    try {
      for (let i = 0; i < on.length && !stop.current; i++) {
        const s = on[i], plan = DONE.get(s.id);
        let done = !plan ? 'Done' : s.edited ? 'Done as you wrote it' : plan.done;
        mark(s.id, { state: 'run' }); setStatus(`Step ${i + 1} of ${on.length}`); await wait(900);
        // the second step hits a rate limit: the agent waits it out, counting down, and tries again
        if (s.id === 's1') {
          for (let k = 3; k > 0 && !stop.current; k--) { mark(s.id, { state: 'retry', detail: `Rate limited by the browser tool. Retrying in ${k}s` }); await wait(1000); }
          if (stop.current) { mark(s.id, { state: undefined, detail: 'Not started' }); break; }
          mark(s.id, { state: 'run', detail: 'Retrying' }); await wait(700);
          done += ', after 1 retry';
        }
        mark(s.id, { state: 'done', detail: done });
      }
    } finally { clearInterval(tick); }
    setMs(performance.now() - t0);
    setStatus(stop.current ? 'Stopped, progress kept' : `Done in ${clock(performance.now() - t0)}. 4 frames updated`); setPhase('done');
  }, [phase === 'running']);

  // the preview's story: the person rewrites the third step, then approves
  useStory(ref, async ({ wait }) => {
    await wait(2000);
    const was = PLAN[2][0], now = 'Simplify the plan cards to one CTA, annual price first';
    for (let n = was.length; n >= was.length - 5; n--) { setSteps(ss => ss.map(s => s.id === 's2' ? { ...s, text: was.slice(0, n) } : s)); await wait(60); }
    for (let n = was.length - 5; n <= now.length; n++) { setSteps(ss => ss.map(s => s.id === 's2' ? { ...s, text: now.slice(0, n), edited: true } : s)); await wait(45); }
    await wait(1500);
    stop.current = false; setNote(undefined); setPhase('running');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <PlanReview title="Plan: redesign the pricing page" steps={steps} onStepsChange={setSteps} phase={phase} status={status} note={note}
        meta={ms === undefined ? undefined : clock(ms)}
        onRequestChanges={() => setNote('Tell the agent what to change in chat')}
        onApprove={() => { stop.current = false; setNote(undefined); setPhase('running'); }}
        onStop={() => { stop.current = true; }} onSeeChanges={() => {}} />
    </div>
  );
}
