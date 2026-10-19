'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Comments, type CommentsEntry, type CommentsPerson } from '../components/comments/Comments';
import { useScript } from './useScript';

/* ---------- Comments: Maya asks the agent in the thread; it thinks, writes its answer, then offers to apply it ---------- */
const AGENT: CommentsPerson = { name: 'Design agent', initials: 'DA', color: 'var(--dm-pb)', handle: 'agent' };
const MAYA: CommentsPerson = { name: 'Maya Kim', initials: 'MK', color: 'var(--dm-pl)', handle: 'maya' };
const JON: CommentsPerson = { name: 'Jon Ortiz', initials: 'JO', color: 'var(--dm-pm)', handle: 'jon' };
const START: CommentsEntry[] = [
  { id: 'c1', author: MAYA, text: 'The secondary button feels too faint next to the CTA.', time: '2h' },
  { id: 'c2', author: JON, text: 'Agree. Can we keep it outlined though?', time: '1h' }
];
const ASK = '@agent can you keep it outlined but darker?';

/** Timers for replies started by a click, cleared when the demo unmounts */
function useWait() {
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => { const all = timers.current; return () => all.forEach(clearTimeout); }, []);
  return useCallback((ms: number) => new Promise<void>(res => { const t = setTimeout(() => { timers.current.delete(t); res(); }, ms); timers.current.add(t); }), []);
}

export default function CommentsDemo() {
  const [comments, setComments] = useState(START);
  const [draft, setDraft] = useState('');
  const wait = useWait();
  const next = useRef(3);

  const reply = useCallback(async (q: string) => {
    const id = 'c' + next.current++;
    const set = (patch: Partial<CommentsEntry>) => setComments(cs => cs.map(c => (c.id === id ? { ...c, ...patch } : c)));
    setComments(cs => [...cs, { id, author: AGENT, text: '', time: 'now', agent: true, thinking: true }]);
    await wait(900);
    set({ thinking: false });
    const answer = /outline|border/i.test(q + ' outlined')
      ? 'Kept it outlined and raised the text to #5B6472, which passes AA at 5.9 : 1. Want me to apply it to the other 2 frames?'
      : 'On it. I will post the change here when it is ready.';
    let text = '';
    for (const w of answer.split(' ')) { text += (text ? ' ' : '') + w; set({ text }); await wait(40); }
    set({ actions: [
      { label: 'Apply to all', primary: true, onClick: () => set({ resolution: 'Applied to 3 frames' }) },
      { label: 'Just this one', onClick: () => set({ resolution: 'Applied to frame 2' }) }
    ] });
  }, [wait]);

  const send = useCallback((text: string) => {
    setComments(cs => [...cs, { id: 'c' + next.current++, author: MAYA, text, time: 'now' }]);
    if (/@agent/i.test(text)) reply(text);
  }, [reply]);

  // Maya types the question a letter at a time, then sends it
  useScript(async ({ wait }) => {
    await wait(1000);
    for (let i = 1; i <= ASK.length; i++) { setDraft(ASK.slice(0, i)); await wait(28); }
    await wait(300);
    setDraft(''); send(ASK);
  });

  return (
    <div style={{ width: '100%' }}>
      <Comments title="Pricing, frame 2" comments={comments} people={[AGENT, MAYA, JON]} value={draft} onValueChange={setDraft} onSend={send} />
    </div>
  );
}
