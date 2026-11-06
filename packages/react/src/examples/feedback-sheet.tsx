'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { useStory, useWait } from './useScript';
import { FeedbackSheet, type Feedback, type FeedbackRating } from '../components/feedback-sheet/FeedbackSheet';

/* ---------- Feedback sheet: thumbs under an answer; thumbs down opens a short sheet. It plays a thumbs down by itself,
   and clicking, focusing or typing inside it takes over ---------- */
const NOTE = 'Keep our 8px spacing scale';

export default function FeedbackSheetDemo() {
  const [rating, setRating] = useState<FeedbackRating>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Feedback | null>(null);
  const ref = useRef<HTMLDivElement>(null), later = useWait();

  useStory(ref, async ({ wait, taken }) => {
    // taking over while it types takes its note back
    let writing = false;
    taken(() => { if (writing) setComment(''); });
    await wait(1500); setRating('down'); setOpen(true);
    await wait(1000); setSelected(['Ignored my tokens']);
    await wait(700); writing = true;
    for (let i = 1; i <= NOTE.length; i++) { setComment(NOTE.slice(0, i)); await wait(34 + Math.random() * 40); }
    await wait(650); writing = false; setSending(true);
    // once sent, it goes through whatever happens next
    await later(800); setSending(false); setOpen(false);
    await later(300); setSent({ reasons: ['Ignored my tokens'], comment: NOTE });
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <FeedbackSheet rating={rating} onRatingChange={setRating} open={open} onOpenChange={setOpen} selected={selected} onSelectedChange={setSelected}
        comment={comment} onCommentChange={setComment} sending={sending || undefined} sent={sent} onSentChange={setSent}
        onSubmit={() => new Promise(res => setTimeout(res, 800))}>
        I tightened the hero spacing to 24px and swapped the CTA to the accent blue. The card grid now wraps at 720px.
      </FeedbackSheet>
    </div>
  );
}
