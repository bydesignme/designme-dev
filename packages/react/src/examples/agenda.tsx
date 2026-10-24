'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { Agenda, type AgendaItem } from '../components/agenda/Agenda';
import { useStory } from './useScript';

const P = {
  MK: { initials: 'MK', color: 'var(--dm-pl)' }, JO: { initials: 'JO', color: 'var(--dm-pm)' }, AR: { initials: 'AR', color: 'var(--dm-pp)' },
  SL: { initials: 'SL', color: 'var(--dm-pt)' }, DK: { initials: 'DK', color: 'var(--dm-pb)' }
};
const ITEMS: AgendaItem[] = [
  { key: 'standup', time: '9:00', title: 'Standup', detail: '15 min, Design team', people: [P.MK, P.JO, P.AR], past: true },
  { key: 'demo', time: '11:30', title: 'Agent demo', detail: '30 min, Zoom', people: [P.SL, P.MK],
    notes: ['Demo flow: pricing audit, then the token export', 'Sam asked about cost limits last time, the cap is now $5'], action: { label: 'Join in 48 min' } },
  { key: 'pricing', time: '1:00', title: 'Pricing workshop', detail: '90 min, Room 4', people: [P.JO, P.AR, P.DK, P.MK],
    notes: ['Trial to paid is up 8.1 pts since Sep 18', 'Open question: show monthly price crossed out on mobile too?', '3 frames ready to review in Figma'] },
  { key: 'maya', time: '4:00', title: '1:1 with Maya', detail: '30 min', people: [P.MK],
    notes: ['She wanted feedback on the checkout copy', 'Library publish is waiting on her approval'] }
];

export default function AgendaDemo() {
  const [open, setOpen] = useState<string | null>(null);
  // a moment in, the agent opens its notes for the next big meeting
  // the preview opens one meeting on its own, unless you take over first
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait }) => { await wait(1000); setOpen('pricing'); });
  return <div ref={ref} style={{ width: '100%' }}><Agenda items={ITEMS} subtitle="Monday, Oct 19" now="10:42" open={open} onOpenChange={setOpen} /></div>;
}
