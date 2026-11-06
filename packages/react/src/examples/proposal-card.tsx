'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { ProposalCard, type ProposalOption } from '../components/proposal-card/ProposalCard';

/* ---------- Proposal card: the agent's fix, its confidence, two other options, Accept or Not now ---------- */
const OPTIONS: ProposalOption[] = [
  { color: '#5b6472', label: '#5B6472', badge: '5.9 : 1', confidence: 84, name: 'Suggested', description: 'Balanced with the primary' },
  { color: '#475161', label: '#475161', badge: '7.4 : 1', confidence: 62, name: 'Darker', description: 'Stronger than the primary' },
  { color: '#116ff8', label: '#116FF8', badge: '4.6 : 1', confidence: 41, name: 'Accent outline', description: 'Competes with the CTA' }
];
export default function ProposalCardDemo() {
  return (
    <div style={{ width: '100%' }}>
      <ProposalCard title="Raise contrast on the secondary button" subtitle="Pricing, frame 2 of 3"
        from={{ color: '#c9cfd8', label: '#C9CFD8', badge: '2.1 : 1' }} options={OPTIONS} acceptedLabel="Applied to 3 buttons" />
    </div>
  );
}
