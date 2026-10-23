'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { Thinking, type ThinkingStep } from '../components/thinking/Thinking';
import { useScript, useStory } from './useScript';

/* ---------- Thinking: each step and what it found; measuring the cards times out once and tries again; then it folds away ---------- */
export const PRICING_STEPS: { label: string; result: string; ms: number; retry?: string; tip?: string }[] = [
  { label: 'Open Pricing v4 in Figma', result: '6 frames, 3 plan cards', ms: 1300 },
  { label: 'Read the spacing tokens', result: 'tokens.css, 9 spacing values', ms: 1200 },
  { label: 'Measure the plan cards', result: '3 cards are off the 8px grid', ms: 1400, retry: "Figma didn't answer", tip: 'Pro has an 18px gap, Team 22px and Enterprise 13px' },
  { label: 'Check text contrast', result: 'All 14 text pairs pass AA', ms: 1100 },
  { label: 'Plan the fix', result: '2 changes, about 3 minutes', ms: 1200 }
];

export default function ThinkingDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [steps, setSteps] = useState<ThinkingStep[]>([]);
  const [running, setRunning] = useState(true);
  const [open, setOpen] = useState(true);
  useScript(async ({ wait }) => {
    await wait(600);
    const out: ThinkingStep[] = [];
    const show = () => setSteps(out.slice());
    for (const s of PRICING_STEPS) {
      out.push({ label: s.label, state: 'running' }); show();
      const at = out.length - 1;
      await wait(s.ms);
      if (s.retry) {
        for (let k = 2; k > 0; k--) { out[at] = { ...out[at], state: 'retry', result: `${s.retry}. Trying again in ${k}s` }; show(); await wait(1000); }
        out[at] = { ...out[at], state: 'running', result: 'Trying again' }; show(); await wait(900);
      }
      out[at] = { ...out[at], state: 'done', result: s.result, resultTip: s.tip }; show();
    }
    await wait(500); setRunning(false);
  });
  // the preview's story: once it has folded, the person opens it again to read what the cards measured
  useStory(ref, async ({ wait }) => {
    await wait(16000); setOpen(true);
  });
  return <div ref={ref} style={{ width: '100%' }}><Thinking steps={steps} running={running} title="Checking the pricing page" summary="3 cards to fix, 2 changes planned" open={open} onOpenChange={setOpen} /></div>;
}
