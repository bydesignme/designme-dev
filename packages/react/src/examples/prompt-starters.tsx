'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { useScript } from './useScript';
import { PromptStarters, type Starter } from '../components/prompt-starters/PromptStarters';

/* ---------- Prompt starters: two sets of four; the first is picked by itself, Shuffle swaps between them ---------- */
const SETS: Starter[][] = [
  [
    { icon: 'grid', tone: 'blue', title: 'Audit a page', description: 'Check the pricing page for spacing and contrast', prompt: 'Audit the pricing page for spacing and contrast issues and list fixes.' },
    { icon: 'edit', tone: 'purple', title: 'Rewrite copy', description: 'Make the onboarding intro shorter', prompt: 'Rewrite the onboarding intro so it is shorter and clearer.' },
    { icon: 'code', tone: 'green', title: 'Export tokens', description: 'Turn colour and spacing into CSS variables', prompt: 'Export the colour and spacing tokens as CSS variables.' },
    { icon: 'layers', tone: 'orange', title: 'Compare frames', description: 'Diff the mobile and desktop frames', prompt: 'Compare the mobile and desktop frames and list the differences.' }
  ],
  [
    { icon: 'chart', tone: 'teal', title: 'Explain a metric', description: 'Why did activation drop last week', prompt: 'Explain why activation dropped last week, with sources.' },
    { icon: 'mail', tone: 'pink', title: 'Draft an email', description: 'Announce the new pricing to customers', prompt: 'Draft an email announcing the new pricing to existing customers.' },
    { icon: 'alert', tone: 'red', title: 'Find a bug', description: 'Trace why checkout logs people out', prompt: 'Find out why checkout logs people out and suggest a fix.' },
    { icon: 'figma', tone: 'purple', title: 'Build from Figma', description: 'Turn the hero frame into code', prompt: 'Build the hero frame from Figma as a React component.' }
  ]
];

export default function PromptStartersDemo() {
  const [set, setSet] = useState(0);
  // once the card has settled, the first starter is picked and fills the box, unless someone got there first
  const [picked, setPicked] = useState<string | null>(null);
  const touched = useRef(false);
  useScript(async ({ wait }) => { await wait(1700); if (!touched.current) setPicked(SETS[0][0].title); });
  return (
    <div style={{ width: '100%' }} onPointerDownCapture={() => { touched.current = true; }}>
      <PromptStarters starters={SETS[set]} value={picked} onValueChange={setPicked} onShuffle={() => { setPicked(null); setSet(s => (s + 1) % SETS.length); }} />
    </div>
  );
}
