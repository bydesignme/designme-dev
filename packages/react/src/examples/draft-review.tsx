'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { DraftReview, type DraftAttachment, type DraftPhase, type SendOption } from '../components/draft-review/DraftReview';
import { useStory, useWait } from './useScript';

/* ---------- Draft review: send, get stopped by the missing attachment, attach it, send, and let the undo window pass ---------- */
const BODY = "Hi Maya,\n\nHere's what changed on the pricing page: one button per plan, the yearly price first, and the FAQ under the comparison table. The full list is in the attached summary.\n\nReady for your sign-off when you are.";
const WHEN: SendOption[] = [
  { key: 'now', label: 'Send now' },
  { key: 'tomorrow', label: 'Tomorrow at 09:00', detail: "The start of Maya's day" },
  { key: 'monday', label: 'Monday at 09:00', detail: 'The start of next week' }
];

export default function DraftReviewDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const run = useRef(0);
  const [subject, setSubject] = useState('Pricing v4: what changed');
  const [body, setBody] = useState(BODY);
  const [files, setFiles] = useState<DraftAttachment[]>([]);
  const [warn, setWarn] = useState(false);
  const [phase, setPhase] = useState<DraftPhase>('draft');
  const [left, setLeft] = useState(5);
  const [option, setOption] = useState('now');
  const attached = files.some(f => !f.loading);

  // the message talks about an attachment that isn't there: say so before it goes
  const send = async (o: SendOption, force = false) => {
    if (!force && !attached && /attach/i.test(body)) { setWarn(true); return; }
    setWarn(false); const id = ++run.current;
    setPhase('sending'); await wait(900); if (id !== run.current) return;
    if (o.key !== 'now') { setPhase('scheduled'); return; }
    // a few seconds to take it back before it really goes
    setPhase('undo');
    for (let k = 5; k > 0; k--) { setLeft(k); await wait(1000); if (id !== run.current) return; }
    setPhase('sent');
  };
  const attach = async () => {
    setWarn(false); if (files.length) return;
    setFiles([{ name: 'Pricing v4 summary.pdf', loading: true }]);
    await wait(1200); setFiles([{ name: 'Pricing v4 summary.pdf', size: '240 KB' }]);
  };

  // the preview's story, on the same beats as the site's
  useStory(ref, async ({ wait, press }) => {
    await wait(4200); press('.dm-drf-go');
    await wait(3100); press('.dm-drf-w .dm-primary');
    await wait(2800); press('.dm-drf-go');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <DraftReview subtitle="After the pricing review with Maya" to={[{ name: 'Maya Kim', initials: 'MK' }]} subject={subject} onSubjectChange={setSubject}
        body={BODY} onBodyChange={setBody} attachments={files} phase={phase} undoLeft={left}
        sendOptions={WHEN} sendOption={option} onSendOptionChange={setOption} onSend={o => void send(o)}
        warning={warn ? { text: 'You mention an attachment, but nothing is attached.', actions: [
          { label: 'Send anyway', onClick: () => void send(WHEN.find(w => w.key === option)!, true) },
          { label: 'Attach the summary', onClick: () => void attach(), primary: true }] } : undefined}
        onDiscard={() => { setWarn(false); setPhase('discarded'); }} onUndo={() => { run.current++; setPhase('draft'); }} />
    </div>
  );
}
