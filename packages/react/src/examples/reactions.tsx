'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { Reactions, type ReactionsItem } from '../components/reactions/Reactions';
import { useScript } from './useScript';

/* ---------- Reactions: three reactions on an agent update, and you add a rocket after a moment ---------- */
const START: ReactionsItem[] = [
  { emoji: '🚀', count: 4, people: ['Maya', 'Jon', 'Ari', 'Sam'] },
  { emoji: '👀', count: 2, people: ['Jon', 'Dana'] },
  { emoji: '✅', count: 1, people: ['Maya'] }
];

export default function ReactionsDemo() {
  const [reactions, setReactions] = useState(START);
  useScript(async ({ wait }) => {
    await wait(1100);
    setReactions(list => list.map((r, i) => i === 0 ? { ...r, mine: !r.mine, count: r.count + (r.mine ? -1 : 1) } : r).filter(r => r.count > 0));
  });
  return (
    <Reactions author="Design agent" time="10:42" reactions={reactions} onReactionsChange={setReactions}
      message="Shipped the pricing update to staging. Trial to paid preview is up 8.1 points against last month." />
  );
}
