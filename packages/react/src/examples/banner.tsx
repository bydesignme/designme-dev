'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { Banner, type BannerArtName, type BannerTone } from '../components/banner/Banner';
import { useStory } from './useScript';

/* ---------- Banner: three announcements one after another, each with its own tone and drawing, then the last one is
   dismissed and brought back with Undo ---------- */
const BANNERS: { tone: BannerTone; art: BannerArtName; eyebrow: string; title: string; description: string; action: string; secondary: string }[] = [
  { tone: 'accent', art: 'layers', eyebrow: 'New', title: 'Memory that carries across threads', description: 'Agents keep what they learn about your project, so you only explain things once.', action: 'Turn on memory', secondary: 'What it keeps' },
  { tone: 'violet', art: 'tools', eyebrow: 'Beta', title: 'Connect your tools in one place', description: 'Linear, GitHub and Slack in one list, with access you can scope for each agent.', action: 'Connect a tool', secondary: 'Read the docs' },
  { tone: 'green', art: 'steps', eyebrow: 'Guide', title: 'Set up your first automation', description: 'Five short steps, about ten minutes. The agent can do most of them for you.', action: 'Start the guide', secondary: 'Maybe later' },
  { tone: 'amber', art: 'path', eyebrow: 'Heads-up', title: 'Maintenance on Sunday, 02:00 UTC', description: 'Agents pause for about an hour, and queued runs pick up where they left off.', action: 'Add to calendar', secondary: 'Status page' }
];

export default function BannerDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(true);
  // the preview's story: the next two banners take the first one's place, then the last is dismissed and comes back with
  // Undo. Your first click, key or focus stops it, and a mouse resting on it holds it where it is
  useStory(ref, async ({ wait, press }) => {
    await wait(4000); setI(1);
    await wait(4000); setI(2);
    await wait(4000); press('.dm-bnx-x');
    await wait(3000); press('.dm-bnx-undo');
  });
  const b = BANNERS[i];
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <Banner tone={b.tone} art={b.art} eyebrow={b.eyebrow} title={b.title} description={b.description}
        action={{ label: b.action, onClick: () => {} }} secondary={{ label: b.secondary, onClick: () => {} }}
        open={open} onOpenChange={setOpen} />
    </div>
  );
}
