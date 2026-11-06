'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { TicketList, type TicketListTicket } from '../components/ticket-list/TicketList';
import { useStory } from './useScript';

/* ---------- Ticket list: four triaged tickets, the urgent one opens with the agent's reply ---------- */
const MAYA = { initials: 'MK', color: 'var(--dm-av-l)' };
const TICKETS: TicketListTicket[] = [
  { id: 'export', priority: 'urgent', title: 'Agent stopped mid export', from: 'Northwind', assignee: MAYA, waiting: '4m', status: 'open',
    question: 'The token export stopped at 60% and nothing has happened for 20 minutes.',
    reply: 'Sorry about that. The run paused at your $5 spend cap. I have raised it for this run and it finished just now. Your tokens are in the Exports tab.' },
  { id: 'figma', priority: 'high', title: 'Figma frames not syncing', from: 'Lumen Labs', assignee: { initials: 'JO', color: 'var(--dm-av-m)' }, waiting: '22m', status: 'open',
    question: 'New frames from this morning are not showing up in DesignMe.',
    reply: 'The Figma token for your workspace expired yesterday. Reconnect it from Settings, then the frames will sync within a minute.' },
  { id: 'share', priority: 'normal', title: 'How do I share a run?', from: 'Orbit', assignee: { initials: 'DA', color: 'var(--dm-av-b)' }, waiting: '1h', status: 'open',
    question: 'Can I send an agent run to someone outside my team?',
    reply: 'Yes. Open the run, click Share, and turn on "Anyone with the link". They can view it without an account.' },
  { id: 'invoice', priority: 'low', title: 'Invoice address change', from: 'Kite Health', assignee: MAYA, waiting: '2d', status: 'done' }
];

export default function TicketListDemo() {
  const [open, setOpen] = useState<string | null>(null);
  // the preview opens the first ticket on its own, unless you take over first
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait }) => { await wait(1000); setOpen(o => o ?? 'export'); });
  return <div ref={ref} style={{ display: 'contents' }}><TicketList defaultTickets={TICKETS} open={open} onOpenChange={setOpen} onSend={() => new Promise(res => setTimeout(res, 700))} /></div>;
}
