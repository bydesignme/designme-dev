'use client';
// The preview from designme.dev, rebuilt from the React component: where the agent's time went.
import { DonutChart } from '../components/donut-chart/DonutChart';

export default function DonutChartDemo() {
  return (
    <div style={{ width: '100%' }}>
      <DonutChart label="Agent time" unit="h" segments={[
        { label: 'Design reviews', value: 14.2 }, { label: 'Code changes', value: 9.6 }, { label: 'Research', value: 6.1 },
        { label: 'Copy edits', value: 3.4 }, { label: 'Other', value: 1.7, color: 'var(--dm-faint)' }
      ]} />
    </div>
  );
}
