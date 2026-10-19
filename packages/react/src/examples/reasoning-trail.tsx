'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { ReasoningTrail, type PlanStep } from '../components/reasoning-trail/ReasoningTrail';
import { useScript } from './useScript';

/* ---------- Reasoning trail: the plan fills in, then the trail settles ---------- */
const PLAN = [['Open the onboarding file', '4 frames'], ['Compare it with the design system', '12 components'], ['Find spacing that breaks the 8px grid', '3 frames'], ['Draft fixes for review', 'Ready']];
export default function ReasoningTrailDemo() {
  const [done, setDone] = useState(0);
  useScript(async ({ wait }) => { for (let i = 1; i <= PLAN.length; i++) { await wait(1500); setDone(i); } });
  const running = done < PLAN.length;
  const plan: PlanStep[] = PLAN.map(([label, detail], i) => ({ label, detail, state: i < done ? 'done' : i === done ? 'now' : 'next' }));
  return (
    <div style={{ width: '100%' }}>
      <ReasoningTrail running={running} plan={plan}
        notes={['The hero card uses 20px padding, every other card uses 24px.', 'Mobile frames already follow the grid, desktop drifted.', 'Two buttons use a hard-coded grey instead of a token.']}
        sources={[{ label: 'Onboarding.fig', kind: 'figma', tip: 'Figma, 4 frames read' }, { label: 'tokens.ts', kind: 'ts', tip: 'src/styles/tokens.ts, 212 lines' }, { label: 'Card.tsx', kind: 'tsx', tip: 'src/components/Card.tsx, 2 edits' }, { label: 'Spacing guide', kind: 'web', tip: 'designme.dev/guide/spacing' }]}
        edits={[{ file: 'Card.tsx', detail: '2 lines', removed: ['padding: 20px;'], added: ['padding: var(--space-6);'] }, { file: 'Button.tsx', detail: '1 line', removed: ['color: #8a8a8a;'], added: ['color: var(--text-dim);'] }]} />
    </div>
  );
}
