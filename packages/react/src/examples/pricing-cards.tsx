'use client';
// The preview from designme.dev, rebuilt from the React component: switch the billing period or drag the editors slider.
import { useRef, useState } from 'react';
import { useStory } from './useScript';
import { PricingCards, type PricingPeriod, type PricingPlan } from '../components/pricing-cards/PricingCards';

const PLANS: PricingPlan[] = [
  { name: 'Starter', description: 'For trying the agent', price: 0, total: 'Up to 2 editors', features: ['1 project', '50 agent runs a month', 'Figma import'], action: { label: 'Start free', variant: 'soft' } },
  { name: 'Pro', description: 'For growing design teams', price: 24, popular: true, features: ['Unlimited projects', '1,000 runs per editor', 'Shared tokens and memory', 'Priority models'], action: { label: 'Start free trial', variant: 'accent' } },
  { name: 'Enterprise', description: 'For design orgs', price: null, unit: 'billed yearly', total: 'Volume pricing from 25 editors', fromSeats: 25, features: ['SSO and audit log', 'Custom spend caps', 'Dedicated support'], action: { label: 'Talk to us', variant: 'ink' } }
];

export default function PricingCardsDemo() {
  const [period, setPeriod] = useState<PricingPeriod>('yearly');
  // once it has appeared it shows the switch at work: monthly, then back to yearly. Clicking, focusing or typing in it takes over
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait }) => {
    await wait(1900); setPeriod('monthly');
    await wait(2000); setPeriod('yearly');
  });
  return <div ref={ref} style={{ width: '100%' }}><PricingCards plans={PLANS} period={period} onPeriodChange={setPeriod} /></div>;
}
