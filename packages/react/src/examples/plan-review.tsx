'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { PlanReview, type PlanPhase, type PlanReviewStep } from '../components/plan-review/PlanReview';
import { useScript } from './useScript';

/* ---------- Plan review: edit, skip or add steps, approve, and the agent works through them ---------- */
const PLAN = ['Read the pricing frames and the brand tokens', 'Compare against the three competitor pages', 'Simplify the plan cards to one CTA each',
  'Move the FAQ below the comparison table', 'Write a summary of every change'];

export default function PlanReviewDemo() {
  const [steps, setSteps] = useState<PlanReviewStep[]>(() => PLAN.map((text, i) => ({ id: 's' + i, text })));
  const [phase, setPhase] = useState<PlanPhase>('review');
  const [status, setStatus] = useState<string>();
  const [note, setNote] = useState<string>();
  const live = useRef(steps);
  useEffect(() => { live.current = steps; });
  const stop = useRef(false);

  useScript(async ({ wait }) => {
    if (phase !== 'running') return;
    const on = live.current.filter(s => !s.skipped);
    const mark = (id: string, state: PlanReviewStep['state']) => setSteps(ss => ss.map(s => s.id === id ? { ...s, state } : s));
    for (let i = 0; i < on.length && !stop.current; i++) {
      mark(on[i].id, 'run'); setStatus(`Step ${i + 1} of ${on.length}`); await wait(900);
      mark(on[i].id, 'done');
    }
    setStatus(stop.current ? 'Stopped, progress kept' : 'Done. 4 frames updated'); setPhase('done');
  }, [phase === 'running']);

  return (
    <div style={{ width: '100%' }}>
      <PlanReview title="Plan: redesign the pricing page" steps={steps} onStepsChange={setSteps} phase={phase} status={status} note={note}
        onRequestChanges={() => setNote('Tell the agent what to change in chat')}
        onApprove={() => { stop.current = false; setNote(undefined); setPhase('running'); }}
        onStop={() => { stop.current = true; }} onSeeChanges={() => {}} />
    </div>
  );
}
