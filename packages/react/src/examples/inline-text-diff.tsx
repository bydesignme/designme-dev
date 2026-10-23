'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { InlineTextDiff, type EditDecision, type TextPart } from '../components/inline-text-diff/InlineTextDiff';
import { useStory } from './useScript';

/* ---------- Inline text diff: accept two edits, read why the agent isn't sure of one and reject it, then accept the rest ---------- */
const PARTS: TextPart[] = [
  { key: 'pick', from: 'Pick', to: 'Choose' }, ' a plan that ', { key: 'team', from: 'fits your team', to: 'grows with your studio' }, '. Every plan ',
  { key: 'includes', from: 'includes', to: 'comes with' }, ' unlimited projects, and ',
  { key: 'cancel', from: 'you can cancel at any time', to: 'your first month is free', note: 'Not in the pricing brief: there is no free month' }, '.'
];

export default function InlineTextDiffDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [decisions, setDecisions] = useState<Record<string, EditDecision>>({});

  // the preview's story, on the same beats as the site's
  useStory(ref, async ({ wait, press }) => {
    await wait(2500); press('[data-edit="pick"]'); await wait(1500); press('.dm-itd-acc');
    await wait(1000); press('[data-edit="team"]'); await wait(1500); press('.dm-itd-acc');
    await wait(1000); press('[data-edit="cancel"]'); await wait(3000); press('.dm-itd-rej');
    await wait(2000); press('.dm-itd-ok');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <InlineTextDiff title="Pricing intro" parts={PARTS} decisions={decisions} onDecisionsChange={setDecisions} doneLabel="Saved to Pricing v4" />
    </div>
  );
}
