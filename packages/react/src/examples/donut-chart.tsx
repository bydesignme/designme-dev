'use client';
// The preview from designme.dev, rebuilt from the React component: where the agent's time went this week, out of its budget.
import { DonutChart } from '../components/donut-chart/DonutChart';

export default function DonutChartDemo() {
  return (
    <div style={{ width: '100%' }}>
      <DonutChart title="Agent time" max={40} label="of 40h this week" unit="h" segments={[
        { label: 'Design reviews', value: 14.2 }, { label: 'Code changes', value: 9.6 }, { label: 'Research', value: 6.1 }, { label: 'Copy edits', value: 5.1 }
      ]} />
    </div>
  );
}
