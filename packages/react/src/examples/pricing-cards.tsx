'use client';
// The preview from designme.dev, rebuilt from the React component: switch the billing period or drag the editors slider.
import { PricingCards, type PricingPlan } from '../components/pricing-cards/PricingCards';

const PLANS: PricingPlan[] = [
  { name: 'Starter', description: 'For trying the agent', price: 0, total: 'Up to 2 editors', features: ['1 project', '50 agent runs a month', 'Figma import'], action: { label: 'Start free', variant: 'soft' } },
  { name: 'Pro', description: 'For growing design teams', price: 24, popular: true, features: ['Unlimited projects', '1,000 runs per editor', 'Shared tokens and memory', 'Priority models'], action: { label: 'Start free trial', variant: 'accent' } },
  { name: 'Enterprise', description: 'For design orgs', price: null, unit: 'billed yearly', total: 'Volume pricing from 25 editors', fromSeats: 25, features: ['SSO and audit log', 'Custom spend caps', 'Dedicated support'], action: { label: 'Talk to us', variant: 'ink' } }
];

export default function PricingCardsDemo() {
  return <PricingCards plans={PLANS} />;
}
