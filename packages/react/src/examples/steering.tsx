'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useReducer, useRef, useState } from 'react';
import { Steering, type SteerMessage, type SteerStep } from '../components/steering/Steering';
import { useScript, useStory, type Script } from './useScript';

/* ---------- Steering: tell the agent to use the library's blue mid-run, and have it redo the card that was already violet ---------- */
// a card step paints its card in the current accent and remembers which, so a change of mind can find the cards with the old one
type Step = SteerStep & { card?: string; hue?: string; ms: number; redo?: string };
const START: Step[] = [
  { id: 'read', title: 'Read Pricing v4', detail: '3 frames, 14 layers', status: 'done', ms: 0 },
  { id: 'pro', card: 'Pro', title: 'Update the Pro card', status: 'running', ms: 7500 },
  { id: 'team', card: 'Team', title: 'Update the Team card', detail: 'Pricing v4, frame 3', status: 'queued', ms: 3500 },
  { id: 'ship', title: 'Export to staging', detail: 'designme.studio/pricing', status: 'queued', ms: 2500 }
];

export default function SteeringDemo() {
  const ref = useRef<HTMLDivElement>(null);
  // the run lives in a ref the agent's loop works on; paint shows it
  const run = useRef({ steps: START.map(s => ({ ...s })), hue: 'violet', queue: [] as string[], busy: false, wait: undefined as Script['wait'] | undefined });
  const [, paint] = useReducer((n: number) => n + 1, 0);
  const [messages, setMessages] = useState<SteerMessage[]>([]);
  const [draft, setDraft] = useState('');
  const ids = useRef(0);
  const nid = () => 'm' + ++ids.current;
  const doing = (x: Step) => x.card ? `Setting the accent to ${run.current.hue}` : x.detail;
  const say = (m: Omit<SteerMessage, 'id' | 'from'>, id = nid()) => setMessages(ms => [...ms, { id, from: 'agent', ...m }]);
  const answer = (id: string, text: string) => setMessages(ms => ms.map(m => m.id === id ? { ...m, answer: text } : m));

  // between two steps the agent takes up what you sent
  const apply = () => {
    const r = run.current;
    while (r.queue.length) {
      const text = r.queue.shift()!;
      setMessages(ms => { const i = ms.findIndex(m => m.from === 'you' && m.state === 'queued'); return ms.map((m, k) => k === i ? { ...m, state: 'applied' } : m); });
      if (r.steps.every(s => s.status === 'done')) { say({ text: "The run had finished, so I'll keep this for the next one." }); continue; }
      if (!/blue|accent|library/i.test(text)) { say({ text: "Got it. I'll follow that from the next step." }); continue; }
      // a change of accent: what's still to come uses it, and a card already painted the old way is offered a redo
      r.hue = 'library blue';
      const old = r.steps.filter(x => x.card && x.status === 'done' && x.hue === 'violet' && !r.steps.some(y => y.redo === x.id));
      if (!old.length) { say({ text: 'Got it. From here the accent is color.accent.500 from the library.' }); continue; }
      const names = old.map(x => x.card).join(' and '), many = old.length > 1, id = nid();
      say({ text: `Got it. From here the accent is color.accent.500. The ${names} card${many ? 's are' : ' is'} already violet.`, warn: true, actions: [
        { label: 'Leave it', onClick: () => answer(id, `Kept the ${names} card as it is`) },
        { label: `Redo the ${names} card${many ? 's' : ''}`, onClick: () => { old.forEach(redo); answer(id, `Added a step to redo the ${names} card${many ? 's' : ''}`); } }
      ] }, id);
    }
    paint();
  };
  // a redo goes in before the export if the export hasn't started, otherwise at the end, and picks the run up again if it had finished
  const redo = (x: Step) => {
    const r = run.current, ship = r.steps.find(y => y.id === 'ship')!, ended = r.steps.every(s => s.status === 'done');
    r.steps.splice(ship.status === 'queued' ? r.steps.indexOf(ship) : r.steps.length, 0,
      { id: 'redo-' + x.id, redo: x.id, card: x.card, fromYou: true, title: `Redo the ${x.card} card`, detail: 'Accent to library blue', status: 'queued', ms: 2000 });
    paint();
    if (ended && r.wait) void work(r.wait);
  };
  // the agent works through the steps
  const work = async (wait: Script['wait']) => {
    const r = run.current; r.busy = true;
    for (let x = r.steps.find(y => y.status !== 'done'); x; x = r.steps.find(y => y.status !== 'done')) {
      x.status = 'running'; x.detail = doing(x); paint();
      await wait(x.ms);
      if (x.card) x.hue = r.hue;
      x.status = 'done'; x.detail = x.card ? `Accent set to ${x.hue}` : x.id === 'ship' ? 'Live on designme.studio/pricing' : x.detail;
      apply();
    }
    r.busy = false; paint();
  };
  useScript(async ({ wait }) => { run.current.wait = wait; await work(wait); });

  const send = (text: string) => {
    const id = nid(); setMessages(ms => [...ms, { id, from: 'you', text, state: 'queued' }]);
    run.current.queue.push(text);
    if (!run.current.busy) apply();
  };

  // the preview's story: tell the agent to use the library's blue, then have it redo the card that was already violet
  useStory(ref, async ({ wait, press }) => {
    await wait(2500);
    for (const ch of 'Use our library blue, not violet') { setDraft(d => d + ch); await wait(40); }
    await wait(500); press('.dm-ste-go');
    await wait(5200); press('.dm-ste-acts .dm-ink');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <Steering title="Redesign the pricing page" steps={run.current.steps.map(s => ({ ...s }))} messages={messages} onSend={send} value={draft} onValueChange={setDraft} />
    </div>
  );
}
