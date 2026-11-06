'use client';
// The preview from designme.dev, rebuilt from the React component: agent runs by outcome, by week or by month.
import { BarChart } from '../components/bar-chart/BarChart';

const bars = (labels: string[], values: number[][]) => labels.map((label, i) => ({ label, values: values[i] }));

export default function BarChartDemo() {
  return (
    <div style={{ width: '100%' }}>
      <BarChart label="Agent runs" unit="runs"
        series={[{ label: 'Shipped' }, { label: 'Needed review', tipLabel: 'reviewed' }, { label: 'Failed' }]}
        ranges={[
          { key: 'week', label: 'Week', bars: bars(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], [[42, 9, 2], [51, 12, 3], [48, 8, 1], [63, 10, 4], [57, 14, 2], [18, 3, 0], [12, 2, 1]]) },
          { key: 'month', label: 'Month', bars: bars(['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'], [[180, 40, 9], [210, 44, 12], [236, 51, 8], [262, 48, 10], [251, 39, 6], [298, 52, 7], [321, 47, 5]]) }
        ]} />
    </div>
  );
}
