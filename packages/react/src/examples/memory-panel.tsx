'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { MemoryPanel, type MemoryItem, type MemoryKind } from '../components/memory-panel/MemoryPanel';
import { useScript } from './useScript';

const KINDS: MemoryKind[] = [
  { value: 'brand', label: 'Brand', color: 'var(--dm-pb)' },
  { value: 'process', label: 'Process', color: 'var(--dm-pt)' }
];
const START: MemoryItem[] = [
  ['brand', 'Primary buttons use the accent blue, never black', 'From the Pricing review, Sep 12'],
  ['brand', 'Headlines stay under eight words', 'You told the agent, Aug 30'],
  ['process', 'Ask Maya before publishing to the shared library', 'From a Slack thread, Sep 4'],
  ['brand', 'Card radius is 16px on web, 12px in the app', 'From tokens.css'],
  ['process', 'Run the launch checklist before every PR', 'You told the agent, Sep 20'],
  ['process', 'Weekly QA posts go to #design, not #general', 'From settings'],
  ['brand', 'No em dashes in product copy', 'You told the agent, Oct 2']
].map(([kind, text, source], id) => ({ id, kind, text, source }));

/* ---------- Memory panel: a new memory arrives from your edit, and every memory can be edited or forgotten ---------- */
export default function MemoryPanelDemo() {
  const [list, setList] = useState(START);
  useScript(async ({ wait }) => {
    await wait(2200);
    setList(l => [{ id: 100, kind: 'brand', text: 'Use “Start free” instead of “Sign up” on CTAs', source: 'Learned just now from your edit', isNew: true }, ...l]);
    await wait(2600);
    setList(l => l.map(m => (m.id === 100 ? { ...m, isNew: false, source: 'Learned from your edit, today' } : m)));
  });
  return (
    <div style={{ width: '100%' }}>
      <MemoryPanel kinds={KINDS} memories={list} onMemoriesChange={setList} />
    </div>
  );
}
