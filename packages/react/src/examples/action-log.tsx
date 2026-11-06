'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { ActionLog, type Action } from '../components/action-log/ActionLog';
import { useScript } from './useScript';

/* ---------- Action log: five tool calls land one by one, each opens to its output ---------- */
const ACTIONS: Omit<Action, 'state'>[] = [
  { icon: 'file-text', title: <>Read <code>Pricing.tsx</code></>, detail: 'src/pages, 212 lines', time: '0.4s', output: 'export function Pricing() {\n  return <Grid cols={3} gap={20}>…' },
  { icon: 'search', title: <>Searched Figma for <code>Button</code></>, detail: '6 matches in Components.fig', time: '1.1s', output: 'Button / Primary\nButton / Secondary\nButton / Ghost  +3' },
  { icon: 'edit', title: <>Edited <code>PricingCard.tsx</code></>, detail: <><span style={{ color: 'var(--dm-add)' }}>+18</span> <span style={{ color: 'var(--dm-del)' }}>−7</span> lines</>, time: '2.3s',
    output: <><span className="dm-x">− gap: 20px;</span>{'\n'}<span className="dm-a">+ gap: var(--space-6);</span></> },
  { icon: 'term', title: <>Ran <code>npm test</code></>, detail: '24 tests passed', time: '3.2s', output: '✓ PricingCard renders 3 plans\n✓ toggles yearly billing\n24 passed, 0 failed' },
  { icon: 'pr', title: 'Opened a pull request', detail: '#412, Use shared spacing tokens', time: '0.6s', output: 'feat/pricing-spacing → main\n3 commits, ready for review' }
];

export default function ActionLogDemo() {
  const [actions, setActions] = useState<Action[]>([]);
  const [running, setRunning] = useState(true);
  useScript(async ({ wait }) => {
    for (let i = 0; i < ACTIONS.length; i++) {
      setActions(a => [...a, { ...ACTIONS[i], state: 'running' }]);
      await wait(950);
      setActions(a => a.map((x, k) => (k === i ? { ...x, state: 'done' } : x)));
    }
    setRunning(false);
  });
  // keeps the room the five steps fill, so the header doesn't climb as each one lands
  return <div style={{ width: '100%', minHeight: 326 }}><ActionLog actions={actions} running={running} /></div>;
}
