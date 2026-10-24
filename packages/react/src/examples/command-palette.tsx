'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { CommandPalette, type CommandPaletteItem } from '../components/command-palette/CommandPalette';
import { useStory } from './useScript';

const COMMANDS: CommandPaletteItem[] = [
  { group: 'Agent', icon: 'spark', label: 'Audit this page for contrast', keys: ['⌘', 'J'] },
  { group: 'Agent', icon: 'wand', label: 'Tidy layer names in the selection' },
  { group: 'Agent', icon: 'code', label: 'Export tokens as CSS variables' },
  { group: 'Go to', icon: 'layers', label: 'Pricing v4', keys: ['G', 'P'] },
  { group: 'Go to', icon: 'figma', label: 'Checkout flow' },
  { group: 'Go to', icon: 'book', label: 'Memory' },
  { group: 'Actions', icon: 'users', label: 'Invite a teammate' },
  { group: 'Actions', icon: 'gear', label: 'Agent settings', keys: ['⌘', ','] },
  { group: 'Actions', icon: 'palette', label: 'Switch theme' }
];

/* ---------- Command palette: someone types "tok" and the list narrows as they go ---------- */
export default function CommandPaletteDemo() {
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  // clicking, focusing or typing in it takes over, and what it had typed goes
  useStory(ref, async ({ wait, taken }) => {
    await wait(1500);
    let typed = '', typing = true;
    taken(() => { if (typing) setQuery(''); });
    for (const ch of 'tok') { typed += ch; setQuery(typed); await wait(180); }
    typing = false;
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <CommandPalette items={COMMANDS} query={query} onQueryChange={setQuery} />
    </div>
  );
}
