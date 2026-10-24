'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { ThreadPanel, type Thread } from '../components/thread-panel/ThreadPanel';
import { useStory } from './useScript';

/* ---------- Thread panel: three threads; a reply is typed and sent by itself, gets a short Thinking, then an answer ---------- */
const THREADS: Thread[] = [
  { id: 'onboarding', title: 'Onboarding', color: 'var(--dm-ok)', messages: [
    { from: 'user', text: 'Why is the workspace step losing people?' },
    { from: 'agent', text: 'It asks for a team name before anyone has made anything. Moving it after the first project, with the name filled from the email domain, should help.',
      sources: [{ label: 'Funnel data', tip: 'Amplitude, last 30 days' }, { label: 'Session notes', tip: 'Notion, 8 interviews' }] }] },
  { id: 'tokens', title: 'Tokens', color: 'var(--dm-warn)', messages: [
    { from: 'user', text: 'Which colours are still hard-coded?' },
    { from: 'agent', text: 'Eleven, mostly greys in Button and Card. I can swap them for tokens in one pass.', sources: [{ label: 'tokens.ts', tip: 'src/styles/tokens.ts' }] }] },
  { id: 'launch', title: 'Launch email', color: 'var(--dm-faint)', messages: [
    { from: 'user', text: 'Draft the launch email for Friday.' },
    { from: 'agent', text: 'Two subject lines are ready. The shorter one tested better with the team.' }] }
];

export default function ThreadPanelDemo() {
  const [threads, setThreads] = useState(THREADS);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const add = (id: string, change: (t: Thread) => Thread) => setThreads(ts => ts.map(t => (t.id === id ? change(t) : t)));

  const send = (text: string, id: string) => {
    add(id, t => ({ ...t, messages: [...t.messages, { from: 'user', text }, { from: 'agent', text: '', thinking: true }] }));
    timers.current.push(setTimeout(() => add(id, t => ({
      ...t, messages: [...t.messages.filter(m => !m.thinking), { from: 'agent', text: "On it. I'll update this thread when it's done." }]
    })), 1400));
  };

  // once the card has settled, a reply is typed and sent in place. Clicking, focusing or typing in it takes over, and what
  // it had typed goes
  const [draft, setDraft] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait, taken }) => {
    await wait(1800);
    taken(() => setDraft(''));
    const reply = 'Can you make that change now?';
    for (let i = 1; i <= reply.length; i++) { setDraft(reply.slice(0, i)); await wait(32 + Math.random() * 40); }
    await wait(380);
    setDraft(''); send(reply, 'onboarding');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ThreadPanel threads={threads} onSend={send} draft={draft} onDraftChange={setDraft} />
    </div>
  );
}
