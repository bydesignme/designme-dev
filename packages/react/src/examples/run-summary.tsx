'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { RunSummary, type RunNeed } from '../components/run-summary/RunSummary';
import { useScript } from './useScript';

/* ---------- Run summary: the numbers roll in, Review settles the one thing left, Undo all takes it back ---------- */
export default function RunSummaryDemo() {
  const [need, setNeed] = useState<'open' | 'busy' | 'fixed'>('open');
  // Review spins for a second, then the question is answered
  useScript(async ({ wait }) => { if (need === 'busy') { await wait(1000); setNeed('fixed'); } }, [need]);
  const needs: RunNeed[] = [need === 'fixed'
    ? { key: 'badge', text: 'Badge moved above the price, nothing left to review' }
    : { key: 'badge', text: 'The yearly badge overlaps the price on mobile', action: { label: 'Review', busy: need === 'busy', onClick: () => setNeed('busy') } }];
  return (
    <div style={{ width: '100%' }}>
      <RunSummary subtitle="Finished in 12m 40s" summary="Pricing cards now use spacing tokens"
        stats={[{ label: 'files', value: 6 }, { label: 'steps', value: 14 }, { label: 'tokens', value: 182, suffix: 'k' }, { label: 'cost', value: 0.84, prefix: '$', decimals: 2 }]}
        changes={[{ file: 'PricingCard.tsx', added: 24, removed: 18 }, { file: 'tokens.css', added: 9, removed: 2 }, { file: 'Pricing.test.tsx', added: 31, removed: 0 }]}
        needs={needs} onDetails={() => {}} onOpenChanges={() => {}} />
    </div>
  );
}
