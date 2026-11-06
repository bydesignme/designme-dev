'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { CommandPalette, type CommandPaletteItem } from '../components/command-palette/CommandPalette';
import { useStory } from './useScript';

const COMMANDS: CommandPaletteItem[] = [
  { group: 'Agent', icon: 'spark', label: 'Audit this page for contrast', keys: ['⌘', 'J'], hint: 'WCAG AA', tone: 'purple' },
  { group: 'Agent', icon: 'wand', label: 'Tidy layer names in the selection', hint: '12 layers', tone: 'purple' },
  { group: 'Agent', icon: 'code', label: 'Export tokens as CSS variables', hint: 'tokens.css', tone: 'purple' },
  { group: 'Go to', icon: 'layers', label: 'Pricing v4', keys: ['G', 'P'], hint: 'Page', tone: 'blue' },
  { group: 'Go to', icon: 'figma', label: 'Checkout flow', hint: 'Figma file', tone: 'blue' },
  { group: 'Go to', icon: 'book', label: 'Memory', hint: 'Team notes', tone: 'blue' },
  { group: 'Actions', icon: 'users', label: 'Invite a teammate', hint: 'Acme Labs', tone: 'teal' },
  { group: 'Actions', icon: 'gear', label: 'Agent settings', keys: ['⌘', ','], tone: 'teal' },
  { group: 'Actions', icon: 'palette', label: 'Switch theme', hint: 'Light', tone: 'teal' }
];

/* ---------- Command palette: someone types "tok" and runs the token export, then finds the invite and runs it ---------- */
export default function CommandPaletteDemo() {
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  // clicking, focusing or typing in it takes over, and what it had typed goes
  useStory(ref, async ({ wait, taken }) => {
    let typing = false;
    taken(() => { if (typing) setQuery(''); });
    const type = async (text: string) => { typing = true; let typed = ''; for (const ch of text) { typed += ch; setQuery(typed); await wait(180); } typing = false; };
    // Enter in the box runs the highlighted row, as a person pressing it would
    const enter = () => ref.current?.querySelector('input')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await wait(1500);
    await type('tok'); await wait(1000); enter(); await wait(2000);
    setQuery(''); await wait(500);
    await type('invi'); await wait(1000); enter();
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <CommandPalette items={COMMANDS} query={query} onQueryChange={setQuery} />
    </div>
  );
}
