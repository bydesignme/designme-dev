'use client';
// The preview from designme.dev, rebuilt from the React component: the baseline draws, this run grows over it, and the agent
// notes it is cheaper but weaker at tool use, which pulses.
import { useEffect, useState } from 'react';
import { RadarChart, type RadarAxis } from '../components/radar-chart/RadarChart';

const AXES: RadarAxis[] = [
  { label: 'Accuracy', value: 88, baseline: 84 }, { label: 'Instruction following', short: 'Instructions', value: 86, baseline: 80 },
  { label: 'Tool use', value: 62, baseline: 78 }, { label: 'Speed', value: 74, baseline: 66 },
  { label: 'Cost efficiency', short: 'Cost', value: 82, baseline: 58 }, { label: 'Safety', value: 91, baseline: 90 }
];

export default function RadarChartDemo() {
  const [said, setSaid] = useState(false);
  useEffect(() => { const t = setTimeout(() => setSaid(true), 3100); return () => clearTimeout(t); }, []);
  return (
    <div style={{ width: '100%' }}>
      <RadarChart axes={AXES} subtitle="Run 48 against run 41" pulse={said ? 2 : undefined}
        note={said ? <>Cheaper and faster, <b>weaker at tool use</b> (−16). It skipped the search tool on 7 of 40 tasks.</> : undefined} />
    </div>
  );
}
