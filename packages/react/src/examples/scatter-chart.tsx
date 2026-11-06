'use client';
// The preview from designme.dev, rebuilt from the React component: the agent rings three outliers, then the person selects
// the cheap, high scoring runs and asks why.
import { useEffect, useRef, useState } from 'react';
import { ScatterChart, type ScatterRun } from '../components/scatter-chart/ScatterChart';
import { useStory } from './useScript';

const rnd = (i: number, k: number) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
const RUNS: ScatterRun[] = [];
const add = (series: string, n: number, x: [number, number], y: [number, number], t: [number, number], k: number) => {
  for (let i = 0; i < n; i++) RUNS.push({ id: 12 + RUNS.length, series, x: Math.round((x[0] + rnd(i, k) * x[1]) * 100) / 100, y: Math.round(y[0] + rnd(i, k + 1) * y[1]), size: Math.round(t[0] + rnd(i, k + 2) * t[1]) });
};
add('opus', 15, [.3, .22], [85, 12], [28, 30], 1); add('sonnet', 18, [.06, .22], [79, 16], [12, 18], 4); add('haiku', 12, [.02, .08], [64, 20], [5, 8], 7);
RUNS.push({ id: 57, series: 'opus', x: .57, y: 73, size: 61 }, { id: 58, series: 'opus', x: .54, y: 70, size: 58 }, { id: 59, series: 'sonnet', x: .47, y: 71, size: 44 });

export default function ScatterChartDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [ringed, setRinged] = useState<number[]>([]);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  useEffect(() => { const t = setTimeout(() => setRinged([57, 58, 59]), 1500); return () => clearTimeout(t); }, []);
  useStory(ref, async ({ wait, press }) => {
    await wait(4500); setRinged([]);
    setSelected(RUNS.filter(r => r.x >= .03 && r.x <= .2 && r.y >= 88).map(r => r.id));
    await wait(1500); press('.dm-cvq-ft .dm-pill');
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ScatterChart runs={RUNS} subtitle="48 runs this week, sized by tokens" ringed={ringed} selected={selected} onSelectedChange={setSelected}
        series={[{ key: 'opus', label: 'Opus' }, { key: 'sonnet', label: 'Sonnet' }, { key: 'haiku', label: 'Haiku' }]}
        note={ringed.length ? <><b>3 outliers</b> cost over $0.45 for a score under 75. Each one looped on the search tool.</> : undefined}
        onAsk={runs => new Promise(res => setTimeout(() => res(`Most of these ${runs.length} are Sonnet runs on short tickets, with under 6 tool calls each. Sending tickets like these to Sonnet would cut their cost by about 40%.`), 1000))} />
    </div>
  );
}
