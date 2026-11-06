'use client';
// The animated preview from designme.dev, rebuilt from the React component: open a check that needs work and let the agent fix it.
import { useEffect, useRef, useState } from 'react';
import { HealthScore, type HealthScoreCheck } from '../components/health-score/HealthScore';

const CHECKS: HealthScoreCheck[] = [
  { label: 'Token usage', score: 96, detail: 'All colours come from the library' },
  { label: 'Contrast', score: 88, detail: '2 text pairs below AA on the pricing page', fixable: true },
  { label: 'Component reuse', score: 74, detail: '11 detached instances in Checkout', fixable: true },
  { label: 'Naming', score: 91, detail: 'Layer names follow the convention' }
];
const FIXED: Record<string, Partial<HealthScoreCheck>> = {
  Contrast: { score: 97, detail: 'Fixed. Both pairs now pass AA', fixable: false },
  'Component reuse': { score: 93, detail: 'Fixed. Reattached 11 instances', fixable: false }
};

export default function HealthScoreDemo() {
  const [checks, setChecks] = useState(CHECKS);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  // the agent takes a moment to fix a check, then the score moves
  const fix = (check: HealthScoreCheck) => new Promise<void>(done => {
    timers.current.push(setTimeout(() => { setChecks(cs => cs.map(c => c.label === check.label ? { ...c, ...FIXED[c.label] } : c)); done(); }, 900));
  });
  return <div style={{ width: '100%' }}><HealthScore checks={checks} onFix={fix} /></div>;
}
