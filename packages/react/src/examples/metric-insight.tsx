'use client';
// The animated preview from designme.dev, rebuilt from the React component: switch the range, hover the line, ask why it moved.
import { useEffect, useRef, useState } from 'react';
import { MetricInsight, type MetricDriver, type MetricRange } from '../components/metric-insight/MetricInsight';

const RANGES: MetricRange[] = [
  { key: '7', label: '7d', points: [22.8, 23.1, 22.9, 24.6, 25.4, 25.9, 26.3], value: 26.3, change: 3.5, insight: 'Up all week. Most of the gain came from annual plans.' },
  { key: '30', label: '30d', points: [18.2, 18.5, 18.1, 18.9, 18.4, 18.7, 19.0, 18.6, 19.2, 19.1, 18.8, 19.4, 19.0, 19.3, 19.1, 19.6, 19.2, 21.8, 22.9, 23.4, 23.1, 24.0, 23.6, 24.4, 24.1, 24.9, 25.2, 25.6, 25.9, 26.3],
    value: 26.3, change: 8.1, insight: 'Jumped after the pricing page update on Sep 18.', marker: { at: .58, label: 'Pricing page update shipped' } },
  { key: '90', label: '90d', points: [17.1, 17.6, 17.4, 18.0, 17.8, 18.3, 18.1, 18.6, 18.2, 18.9, 19.4, 22.1, 24.0, 25.5, 26.3], value: 26.3, change: 9.2, insight: 'Flat for two months, then a clear step up in September.' }
];
const DRIVERS: MetricDriver[] = [
  { label: 'Annual plan shown first', percent: 54, color: 'var(--dm-accent)' }, { label: 'One CTA per card', percent: 27, color: 'var(--dm-pl)' },
  { label: 'Seasonal traffic', percent: 12, color: 'var(--dm-pt)' }, { label: 'Unexplained', percent: 7, color: 'var(--dm-faint)' }
];

export default function MetricInsightDemo() {
  const [open, setOpen] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  // asking takes a moment, the way an agent would look into it
  const toggle = (next: boolean) => {
    if (!next) { setOpen(false); return; }
    setExplaining(true);
    timer.current = setTimeout(() => { setExplaining(false); setOpen(true); }, 900);
  };
  return (
    <div style={{ width: '100%' }}>
      <MetricInsight label="Trial to paid" ranges={RANGES} defaultRange="30" drivers={DRIVERS} explaining={explaining} open={open} onOpenChange={toggle} />
    </div>
  );
}
