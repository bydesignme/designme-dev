'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { HumanHandoff, type HandoffPerson, type HandoffStatus } from '../components/human-handoff/HumanHandoff';
import { useStory, useWait } from './useScript';

/* ---------- Hand-off to a person: Maya is assigned but is out, so the person reassigns it to Alex, who takes it ---------- */
// someone free takes the conversation in a few seconds, someone in a call takes longer, and someone who is out never does
type Member = HandoffPerson & { wait?: number };
const TEAM: Member[] = [
  { name: 'Alex Rivera', initials: 'AR', color: 'var(--dm-pm)', team: 'Billing', presence: 'Available', tone: 'ok', wait: 2500 },
  { name: 'Sam Ortiz', initials: 'SO', color: 'var(--dm-pp)', team: 'Billing', presence: 'In a call', wait: 6000 },
  { name: 'Maya Chen', initials: 'MC', color: 'var(--dm-pl)', team: 'Billing', presence: 'Out until 2pm', tone: 'warn' }
];
const first = (p: HandoffPerson) => p.name.split(' ')[0];
const MESSAGE = "Thanks, Dana. A refund this size needs someone on our billing team, so I've passed your conversation to them. They'll reply here within 15 minutes.";

export default function HumanHandoffDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const run = useRef(0);
  const [who, setWho] = useState<HandoffPerson | null>(null);
  const [status, setStatus] = useState<HandoffStatus>({ title: 'Handing off to Billing', detail: 'The agent has stopped replying to Dana' });
  const [left, setLeft] = useState(846);
  const [message, setMessage] = useState(MESSAGE);
  const [edited, setEdited] = useState(false);

  // the reply is due 15 minutes after the hand-off; this one starts with 14:06 left
  useEffect(() => { const id = setInterval(() => setLeft(s => s - 1), 1000); return () => clearInterval(id); }, []);

  const assign = async (p: Member) => {
    const id = ++run.current;
    // their status comes back a moment after they are assigned
    setWho({ ...p, presence: undefined, tone: undefined });
    setStatus({ title: `Waiting for ${first(p)} to accept`, detail: 'The agent has stopped replying to Dana' });
    await wait(1600); if (id !== run.current) return;
    setWho(p);
    if (!p.wait) { setStatus({ tone: 'warn', title: `${first(p)} is out until 2pm`, detail: 'The reply is due before then. Reassign it to someone who is free.' }); return; }
    await wait(p.wait); if (id !== run.current) return;
    setStatus({ tone: 'ok', person: p, title: `${first(p)} joined`, detail: 'Reading the conversation' });
    await wait(1800); if (id !== run.current) return;
    setStatus({ tone: 'ok', person: p, title: `With ${first(p)} · agent paused`, detail: `The agent won't reply while ${first(p)} has it` });
  };
  // the agent finds someone on the team a moment after it hands off
  useEffect(() => { const t = setTimeout(() => void assign(TEAM[2]), 1500); return () => { clearTimeout(t); run.current++; }; }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // the preview's story, on the same beats as the site's
  useStory(ref, async ({ wait, press }) => {
    await wait(5600); press('.dm-hox-rb');
    await wait(2500); press('.dm-hox-pop .dm-mi:nth-of-type(1)');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <HumanHandoff reason="Refund over $500 needs a person" assignee={who} finding={{ title: 'Finding someone', detail: 'Billing team' }}
        people={TEAM} onReassign={p => void assign(p as Member)} secondsLeft={left}
        summary="Dana was charged twice for her annual plan on Oct 21 and wants one charge back. The agent confirmed the duplicate, but can't refund more than $500."
        facts={[{ label: 'Amount', value: '$588.00' }, { label: 'Customer', value: 'Dana Lee · Pro since 2023' }, { label: 'Order', value: '#48213 · charged twice' }]}
        link={{ label: 'View conversation · 12 messages', tip: 'Opens the whole conversation' }}
        message={message} messageLabel="Sent to Dana" edited={edited} onMessageChange={t => { setMessage(t); setEdited(true); }} status={status} />
    </div>
  );
}
