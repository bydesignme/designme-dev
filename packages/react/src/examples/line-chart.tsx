'use client';
// The preview from designme.dev, rebuilt from the React component: active editors on a project, today against yesterday,
// this week against last week, or this month against last month.
import { LineChart, type LineChartView } from '../components/line-chart/LineChart';

const PROJECTS = [{ key: 'web', label: 'Website', size: 1 }, { key: 'app', label: 'Mobile app', size: .58 }, { key: 'docs', label: 'Docs', size: .27 }];
const HOURS = Array.from({ length: 24 }, (_, h) => (h % 12 || 12) + (h < 12 ? 'am' : 'pm'));
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const NOV = Array.from({ length: 30 }, (_, d) => 'Nov ' + (d + 1));
// it is 2pm on Thursday 19 November. November starts on a Sunday and October on a Thursday
const RANGES: Record<string, { points: string[]; ticks?: string[]; now: number; main: string; compare: string; grid: number[]; a: number[]; b: number[]; ka: number; kb: number }> = {
  day: { points: HOURS, now: 14, main: 'Today', compare: 'Yesterday', grid: [1, 2, 3, 4, 6, 12], ka: 1.05, kb: .93,
    a: [110, 80, 64, 58, 62, 96, 210, 460, 820, 1120, 1290, 1360, 1180, 1260, 1330, 1250, 1130, 960, 720, 510, 360, 260, 190, 140], b: [] },
  week: { points: DAYS, ticks: DAYS.map(d => d.slice(0, 3)), now: 3, main: 'This week', compare: 'Last week', grid: [1], ka: 1.04, kb: .92,
    a: [4380, 4720, 4610, 4890, 4420, 1680, 1240], b: [] },
  month: { points: NOV, now: 18, main: 'This month', compare: 'Last month', grid: [1, 7, 14], ka: 1.02, kb: .95,
    a: NOV.map((_, d) => d % 7 === 0 || d % 7 === 6 ? 1500 : 4500), b: NOV.map((_, d) => (4 + d) % 7 === 0 || (4 + d) % 7 === 6 ? 1450 : 4400) }
};
// a small seeded wobble, so each project's numbers differ but are the same on every visit
const wob = (s: number, i: number) => { const x = Math.sin(s * 91.7 + i * 12.9898) * 43758.5453; return x - Math.floor(x) - .5; };

function projectMonth(g: (typeof RANGES)[string], p: number, size: number) {
  const now = Math.round(g.a[g.now] * g.ka * size * (1 + wob(p + 1, g.now) * .14)), shape = g.a.map((v, i) => v * (1 + wob(p + 13, i) * .06));
  return shape.slice(g.now).map(v => Math.round(now * v / shape[g.now]));
}

function view({ source, range }: { source: string; range: string }): LineChartView {
  const g = RANGES[range], p = PROJECTS.findIndex(x => x.key === source), size = PROJECTS[p].size;
  return {
    points: g.points, ticks: g.ticks, now: g.now, grid: g.grid,
    main: { label: g.main, values: g.a.slice(0, g.now + 1).map((v, i) => Math.round(v * g.ka * size * (1 + wob(p + 1, i) * .14))) },
    compare: { label: g.compare, values: (g.b.length ? g.b : g.a).map((v, i) => Math.round(v * g.kb * size * (1 + wob(p + 7, i) * .14))) },
    // the rest of the month is projected along its own weekdays (October's weekends fall on other dates); the day and the week
    // take the chart's default, the latest value carried forward along the comparison's shape
    projected: g.b.length ? projectMonth(g, p, size) : undefined
  };
}

export default function LineChartDemo() {
  return (
    <div style={{ width: '100%' }}>
      <LineChart title="Active editors" sources={PROJECTS.map(({ key, label }) => ({ key, label }))} sourceLabel="Project"
        ranges={[{ key: 'day', label: 'Day' }, { key: 'week', label: 'Week' }, { key: 'month', label: 'Month' }]} pointName="Point" data={view} />
    </div>
  );
}
