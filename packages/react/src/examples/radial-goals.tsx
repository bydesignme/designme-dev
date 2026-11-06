'use client';
// The preview from designme.dev, rebuilt from the React component: the week, then the month.
import { useEffect, useRef, useState } from 'react';
import { RadialGoals, type RadialGoal } from '../components/radial-goals/RadialGoals';
import { useStory } from './useScript';

const DATA: Record<'w' | 'm', RadialGoal[]> = {
  w: [{ key: 'support', label: 'Support agent', unit: 'tickets', value: 412, target: 375 }, { key: 'qa', label: 'QA agent', unit: 'checks', value: 136, target: 160 },
    { key: 'research', label: 'Research agent', unit: 'reports', value: 18, target: 24, color: 'var(--dm-c4)' }],
  m: [{ key: 'support', label: 'Support agent', unit: 'tickets', value: 1490, target: 1600 }, { key: 'qa', label: 'QA agent', unit: 'checks', value: 702, target: 640 },
    { key: 'research', label: 'Research agent', unit: 'reports', value: 71, target: 96, color: 'var(--dm-c4)' }]
};
const EMPTY = DATA.w.map(g => ({ ...g, value: 0 }));

export default function RadialGoalsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState<'w' | 'm'>('w');
  // the rings sweep in a moment after the card appears
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 260); return () => clearTimeout(t); }, []);
  useStory(ref, async ({ wait }) => { await wait(7000); setRange('m'); await wait(2000); setRange('w'); });
  const on = DATA[range].filter(g => g.value >= g.target).length;
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <RadialGoals goals={drawn ? DATA[range] : EMPTY} subtitle={`${range === 'w' ? 'This week' : 'This month'}, ${on} of ${DATA[range].length} on target`}
        ranges={[{ value: 'w', label: 'Week' }, { value: 'm', label: 'Month' }]} range={range} onRangeChange={setRange} />
    </div>
  );
}
