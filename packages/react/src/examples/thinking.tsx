'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { Thinking, type ThinkingStep } from '../components/thinking/Thinking';
import { useScript } from './useScript';

/* ---------- Thinking: the trace is written step by step, then folds away ---------- */
type Plan = Omit<ThinkingStep, 'state' | 'label'> & { run: string; done: string; dead?: boolean; count?: number; ms: number };
const THOUGHTS: Plan[] = [
  { mark: 'search', run: 'Searching the design system', done: 'Searched the design system', ms: 1600,
    sources: [{ label: 'Pricing.fig', kind: 'figma', tip: 'Figma, 6 frames read' }, { label: 'tokens.ts', kind: 'ts', tip: 'src/styles/tokens.ts, 212 lines' }, { label: 'PricingCard.tsx', kind: 'tsx', tip: 'src/components/PricingCard.tsx' }, { label: 'Contrast guide', kind: 'web', tip: 'w3.org, WCAG 2.2 contrast' }],
    moreSources: [{ label: 'Button.tsx', kind: 'tsx', tip: 'src/components/Button.tsx' }, { label: 'globals.css', kind: 'css', tip: 'src/styles/globals.css' }] },
  { run: 'Reading 1 of 6 frames', done: 'Read 6 frames from Pricing.fig', count: 6, ms: 1500 },
  { run: 'Checking if the old grid is in the tokens', done: "Dead end: the old grid isn't in tokens.ts", dead: true, ms: 1400 },
  { run: 'Mapping every spacing value', done: 'Mapped 9 spacing values', ms: 1300 },
  { run: 'Comparing desktop and mobile', done: 'Compared desktop and mobile', sub: true, ms: 1100 },
  { run: 'Finding values off the 8px grid', done: '3 values break the 8px grid', sub: true, ms: 1000 },
  { run: 'Merging both breakpoints', done: 'Merged both breakpoints', mark: 'hollow', ms: 1000 },
  { run: 'Spotting cards that need a fix', done: 'Found 3 cards to fix', ms: 1200 },
  { run: 'Drafting the fix', done: 'Drafted a 2-step fix', ms: 1300 }
];
export default function ThinkingDemo() {
  const [steps, setSteps] = useState<ThinkingStep[]>([]);
  const [running, setRunning] = useState(true);
  useScript(async ({ wait }) => {
    await wait(800);
    const out: ThinkingStep[] = [];
    const show = () => setSteps(out.slice());
    for (const t of THOUGHTS) {
      const { run, done, dead, count, ms, ...rest } = t;
      out.push({ ...rest, label: run, state: 'running', sources: undefined, moreSources: undefined }); show();
      const at = out.length - 1;
      if (t.sources) { await wait(550); out[at] = { ...out[at], sources: t.sources, moreSources: t.moreSources }; show(); }
      if (count) for (let n = 2; n <= count; n++) { await wait(ms / count); out[at] = { ...out[at], label: `Reading ${n} of ${count} frames` }; show(); }
      else await wait(ms);
      out[at] = { ...out[at], label: done, state: dead ? 'dead' : 'done' }; show();
    }
    await wait(500); setRunning(false);
  });
  return <div style={{ width: '100%' }}><Thinking steps={steps} running={running} summary="3 cards to fix · 2 steps" /></div>;
}
