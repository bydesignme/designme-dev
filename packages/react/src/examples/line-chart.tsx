'use client';
// The preview from designme.dev, rebuilt from the React component: active editors this year against last year.
import { LineChart } from '../components/line-chart/LineChart';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function LineChartDemo() {
  return (
    <div style={{ width: '100%' }}>
      <LineChart label="Active editors" unit="editors" compareLabel="vs last year" points={MONTHS} range={[500, 1700]}
        series={[
          { key: 'now', label: 'This year', values: [820, 860, 910, 980, 1040, 1130, 1210, 1180, 1320, 1460, 1540, 1620] },
          { key: 'before', label: 'Last year', values: [610, 640, 660, 700, 690, 760, 800, 790, 850, 880, 910, 960] }
        ]} />
    </div>
  );
}
