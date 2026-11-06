'use client';
// The animated preview from designme.dev, rebuilt from the React component: the weakest factor opens, the agent proposes a fix,
// the person applies it and the score rises.
import { useRef, useState } from 'react';
import { ScoreBreakdown, type ScoreFactor } from '../components/score-breakdown/ScoreBreakdown';
import { useStory } from './useScript';

const START: ScoreFactor[] = [
  { key: 'acc', label: 'Accuracy', weight: 40, earned: 34, note: '2 wrong refund amounts in 120 tickets' },
  { key: 'speed', label: 'Speed', weight: 20, earned: 11, note: 'Median reply 6.4s, target under 4s', improvable: true },
  { key: 'cost', label: 'Cost', weight: 20, earned: 16, note: '$0.11 a ticket, budget $0.12' },
  { key: 'safety', label: 'Safety', weight: 20, earned: 19, note: 'No policy breaks, 1 tone flag' }
];

export default function ScoreBreakdownDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [factors, setFactors] = useState(START);
  const [open, setOpen] = useState<string[]>([]);
  useStory(ref, async ({ wait, press }) => {
    await wait(2500); setOpen(['speed']);
    await wait(1500); press('.dm-sbx-r.dm-open .dm-pill');
    await wait(3500); press('.dm-sbx-r.dm-open .dm-primary');
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ScoreBreakdown factors={factors} title="Support agent quality" previous={77} open={open} onOpenChange={setOpen} improvingLabel="Looking at 120 slow replies"
        onImprove={() => new Promise(res => setTimeout(() => res({ text: 'Cache the search results between steps and run the two account lookups at once.', gain: 'About 2.1s faster a reply', to: 17 }), 1300))}
        onApply={(f, p) => setFactors(fs => fs.map(x => x.key === f.key ? { ...x, earned: p.to, note: 'Median reply 4.3s, close to the target', improvable: false, detail: 'Applied: search results are cached and the lookups run together.' } : x))} />
    </div>
  );
}
