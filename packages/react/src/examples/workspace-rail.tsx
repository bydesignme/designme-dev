'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { WorkspaceRail, type WorkspaceRailItem } from '../components/workspace-rail/WorkspaceRail';
import { useStory } from './useScript';

/* ---------- Workspace rail: opens out a moment after it appears; opening an item clears its badge ---------- */
const ITEMS: WorkspaceRailItem[] = [
  { key: 'home', label: 'Home', icon: 'home' }, { key: 'agent', label: 'Agent', icon: 'spark' }, { key: 'projects', label: 'Projects', icon: 'layers' },
  { key: 'frames', label: 'Frames', icon: 'figma' }, { key: 'memory', label: 'Memory', icon: 'book' }, { key: 'settings', label: 'Settings', icon: 'gear' }
];

export default function WorkspaceRailDemo() {
  const [active, setActive] = useState('agent');
  const [badges, setBadges] = useState<Record<string, number>>({ agent: 2 });
  const [wide, setWide] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // the preview pins the rail open on its own, unless you take over first
  useStory(ref, async ({ wait }) => { await wait(1500); setWide(true); });
  const open = (key: string) => { setActive(key); setBadges(b => ({ ...b, [key]: 0 })); };

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <WorkspaceRail items={ITEMS.map(i => ({ ...i, badge: badges[i.key] }))} value={active} onValueChange={open}
        expanded={wide} onExpandedChange={setWide}
        runs={[{ key: 'audit', label: 'Pricing audit' }, { key: 'tokens', label: 'Token export' }]} />
    </div>
  );
}
