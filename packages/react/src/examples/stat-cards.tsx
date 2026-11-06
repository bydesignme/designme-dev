'use client';
// The animated preview from designme.dev, rebuilt from the React component: the numbers roll up and the switch changes the period.
import { StatCards, type StatCardsPeriod, type StatCardsStat } from '../components/stat-cards/StatCards';

const PERIODS: StatCardsPeriod[] = [
  { label: '7 days', compare: 'vs previous 7 days' },
  { label: '30 days', compare: 'vs previous 30 days' },
  { label: 'Quarter', compare: 'vs last quarter' }
];

// each card has one shape that wobbles a little differently per period, like real weeks do
const wobble = (base: number[], p: number) => base.map((y, k) => y + Math.sin(k * 1.7 + p * 2) * (p ? 1 : .5));
const stat = (icon: StatCardsStat['icon'], label: string, nums: [number, number][], base: number[], extra: Partial<StatCardsStat> = {}): StatCardsStat =>
  ({ icon, label, values: nums.map(([value, change], p) => ({ value, change, points: wobble(base, p) })), ...extra });

const STATS: StatCardsStat[] = [
  stat('spark', 'Agent runs', [[412, 12], [1730, 18], [4980, 22]], [3, 4, 4, 5, 6, 5, 7, 8]),
  stat('users', 'Active editors', [[318, 4], [1130, 9], [1620, 31]], [5, 5, 6, 6, 6, 7, 7, 8]),
  stat('clock', 'Hours saved', [[96, 15], [402, 21], [1180, 26]], [2, 3, 3, 4, 5, 6, 6, 8], { suffix: 'h' }),
  stat('coins', 'Agent spend', [[84, -6], [341, -3], [960, 8]], [6, 5, 6, 5, 4, 4, 4, 3], { prefix: '$' })
];

export default function StatCardsDemo() {
  return <div style={{ width: '100%' }}><StatCards stats={STATS} periods={PERIODS} defaultPeriod={1} sparkRange={[0, 8.75]} /></div>;
}
