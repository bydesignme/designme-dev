'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { PromptStarters, type Starter } from '../components/prompt-starters/PromptStarters';

/* ---------- Prompt starters: two sets of four; the box starts empty, a pick fills it, Shuffle swaps between them ---------- */
const SETS: Starter[][] = [
  [
    { icon: 'grid', tone: 'blue', title: 'Audit a page', description: 'Check the pricing page for spacing and contrast', prompt: 'Audit pricing for spacing and contrast' },
    { icon: 'edit', tone: 'purple', title: 'Rewrite copy', description: 'Make the onboarding intro shorter', prompt: 'Make the onboarding intro shorter' },
    { icon: 'code', tone: 'green', title: 'Export tokens', description: 'Turn colour and spacing into CSS variables', prompt: 'Export the tokens as CSS variables' },
    { icon: 'layers', tone: 'orange', title: 'Compare frames', description: 'Diff the mobile and desktop frames', prompt: 'Diff the mobile and desktop frames' }
  ],
  [
    { icon: 'chart', tone: 'teal', title: 'Explain a metric', description: 'Why did activation drop last week', prompt: 'Why did activation drop last week?' },
    { icon: 'mail', tone: 'pink', title: 'Draft an email', description: 'Announce the new pricing to customers', prompt: 'Announce the new pricing by email' },
    { icon: 'alert', tone: 'red', title: 'Find a bug', description: 'Trace why checkout logs people out', prompt: 'Fix checkout logging people out' },
    { icon: 'figma', tone: 'purple', title: 'Build from Figma', description: 'Turn the hero frame into code', prompt: 'Build the hero frame in React' }
  ]
];

export default function PromptStartersDemo() {
  const [set, setSet] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div style={{ width: '100%' }}>
      <PromptStarters starters={SETS[set]} value={picked} onValueChange={setPicked} onShuffle={() => { setPicked(null); setSet(s => (s + 1) % SETS.length); }} />
    </div>
  );
}
