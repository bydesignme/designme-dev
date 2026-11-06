'use client';
// The animated preview from designme.dev, rebuilt from the React component: the agent's week fills in, and the switch shows the team's.
import { ActivityHeatmap, type ActivityHeatmapSeries } from '../components/activity-heatmap/ActivityHeatmap';

// a made-up month: the agent works overnight when the queue runs, the team works office hours
function week(who: 'agent' | 'team') {
  const out: number[] = [];
  for (let d = 0; d < 7; d++) for (let h = 0; h < 24; h++) {
    let v = who === 'agent' ? (h >= 1 && h <= 5 ? .75 : h >= 9 && h <= 18 ? .45 : .15) : (h >= 9 && h <= 18 ? .65 : h >= 19 && h <= 22 ? .2 : .03);
    if (d >= 5) v *= who === 'agent' ? .8 : .2;
    if (who === 'agent' && d === 0 && h === 9) v = 1;
    out.push(Math.max(0, Math.min(1, v + Math.sin(d * 7.1 + h * 3.3) * .18)));
  }
  return out;
}

const SERIES: ActivityHeatmapSeries[] = [
  { key: 'agent', label: 'Agent', values: week('agent'), max: 40, unit: 'runs', note: 'Busiest overnight, when the queue runs' },
  { key: 'team', label: 'Team', values: week('team'), max: 25, unit: 'edits', note: 'Busiest 10am to 4pm on weekdays' }
];

export default function ActivityHeatmapDemo() {
  return <div style={{ width: '100%' }}><ActivityHeatmap series={SERIES} /></div>;
}
