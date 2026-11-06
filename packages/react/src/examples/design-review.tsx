'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { DesignReview, type ReviewCheck, type ReviewMessage, type ReviewPhase, type ShipOption } from '../components/design-review/DesignReview';
import { useScript, useWait } from './useScript';

/* ---------- Design review: three checks pass, Maya asks for one change, the agent makes it, she approves, you ship ---------- */
const CHECKS: [label: string, result: string][] = [['Visual diff', '2 of 6 screens changed'], ['Library tokens', 'All from the library'], ['Contrast', 'AA on every screen']];
const MAYA = { name: 'Maya Kim', initials: 'MK', color: 'var(--dm-av-l)' };
const AGENT = { name: 'Design agent', agent: true };
const DONE: Record<string, string> = { all: 'Live for every visitor', some: 'Live for 10% of visitors. Everyone tomorrow', later: 'Ships on Monday at 09:00' };

export default function DesignReviewDemo() {
  const [checks, setChecks] = useState<ReviewCheck[]>(CHECKS.map(([label]) => ({ label, state: 'wait' })));
  const [messages, setMessages] = useState<ReviewMessage[]>([]);
  const [phase, setPhase] = useState<ReviewPhase>('review');
  const [note, setNote] = useState('Waiting on checks');
  const [done, setDone] = useState('');
  const wait = useWait();

  useScript(async ({ wait }) => {
    await wait(500);
    for (let i = 0; i < CHECKS.length; i++) {
      setChecks(cs => cs.map((c, k) => k === i ? { ...c, state: 'run' } : c));
      await wait(650 + i * 120);
      setChecks(cs => cs.map((c, k) => k === i ? { ...c, state: 'ok', note: CHECKS[i][1] } : c));
    }
    setNote('Waiting on Maya'); await wait(900);
    setMessages([{ author: MAYA, verdict: { label: 'Changes requested', tone: 'warn' }, text: 'Start the plan toggle on yearly. Most people pick it.' }]);
    setNote('The agent is on it'); await wait(1200);
    setMessages(ms => [...ms, { author: AGENT, verdict: { label: 'Updating', busy: true } }]);
    await wait(1300);
    setMessages(ms => [ms[0], { author: AGENT, verdict: { label: 'Updated' }, text: 'The toggle starts on yearly on all 6 screens.' }]);
    await wait(1100);
    setMessages(ms => [...ms, { author: MAYA, verdict: { label: 'Approved', tone: 'ok', icon: 'check' } }]);
    setNote('Approved by Maya'); setPhase('approved');
  });

  const ship = async (o: ShipOption) => {
    setPhase('shipping'); setNote('Publishing 6 screens');
    await wait(1000);
    setDone(DONE[o.key]); setPhase(o.key === 'later' ? 'scheduled' : 'live');
  };

  return (
    <DesignReview title="Pricing page v4" subtitle="6 screens · sent for review by the design agent" checks={checks} messages={messages}
      phase={phase} note={note} waitingLabel="Maya reviews once the checks pass" onShip={ship} doneLabel={done} />
  );
}
