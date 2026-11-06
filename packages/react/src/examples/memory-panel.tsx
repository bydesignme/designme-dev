'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { MemoryPanel, type MemoryActivity, type MemoryItem, type MemoryKind } from '../components/memory-panel/MemoryPanel';
import type { BrandName } from '../lib/brands';
import type { IconName } from '../lib/icons';
import { useStory } from './useScript';

const KINDS: MemoryKind[] = [
  { value: 'brand', label: 'Brand', color: 'var(--dm-pl)' },
  { value: 'process', label: 'Process', color: 'var(--dm-pt)' }
];
// where each memory came from: an app's mark, or an icon for something said in chat
const START: MemoryItem[] = ([
  ['brand', 'Primary buttons use the accent blue, never black', 'figma', 'Pricing review in Figma, Sep 12'],
  ['brand', 'Headlines stay under eight words', '', 'You told the agent, Aug 30'],
  ['process', 'Ask Maya before publishing to the shared library', 'slack', 'A thread in #design-system, Sep 4'],
  ['brand', 'Card radius is 16px on web, 12px in the app', 'github', 'tokens.css on GitHub, Sep 18'],
  ['process', 'Run the launch checklist before every PR', 'notion', 'Launch checklist in Notion, Sep 20'],
  ['process', 'File design bugs in the Design QA project', 'linear', 'DES-214 in Linear, Sep 26'],
  ['brand', 'No em dashes in product copy', 'drive', 'Voice and tone guide in Drive, Oct 2']
] as const).map(([kind, text, brand, source], id) => ({ id, kind, text, source, ...(brand ? { brand: brand as BrandName } : { icon: 'comment' as IconName }) }));
const IDLE: MemoryActivity = { text: 'Used in 14 answers this week' };

/* ---------- Memory panel: the agent learns a rule from your edit in Figma, then drafts an email in Gmail with three memories, which pulse as it uses them ---------- */
export default function MemoryPanelDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [list, setList] = useState(START);
  const [activity, setActivity] = useState(IDLE);
  const set = (id: number, patch: Partial<MemoryItem>) => setList(l => l.map(m => (m.id === id ? { ...m, ...patch } : m)));
  // the story stops for good at your first click, key or focus inside the panel; whatever it was halfway through settles
  useStory(ref, async ({ wait, taken }) => {
    await wait(2200);
    setList(l => [{ id: 100, kind: 'brand', text: 'Learning from your edit in Pricing v4', source: 'Just now', brand: 'figma', learning: true }, ...l]);
    const learnt = { learning: false, text: 'Use “Start free” instead of “Sign up” on CTAs', source: 'Your edit in Pricing v4, just now' };
    taken(() => { setList(l => l.map(m => (m.id === 100 && m.learning ? { ...m, ...learnt } : m))); setActivity(IDLE); });
    await wait(1500);
    set(100, { ...learnt, isNew: true });
    await wait(2600);
    set(100, { isNew: false, source: 'Your edit in Figma, today' });
    await wait(1000);
    setActivity({ text: 'Drafting the launch email in Gmail', live: true, brand: 'gmail' });
    await wait(1100);
    for (const id of [100, 1, 6]) { set(id, { used: true }); await wait(700); }
    setActivity({ text: 'Used 3 memories in the launch email draft', brand: 'gmail' });
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <MemoryPanel kinds={KINDS} memories={list} onMemoriesChange={setList} activity={activity} />
    </div>
  );
}
