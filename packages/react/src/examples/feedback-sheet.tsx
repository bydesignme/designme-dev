'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { useScript } from './useScript';
import { FeedbackSheet, type Feedback, type FeedbackRating } from '../components/feedback-sheet/FeedbackSheet';

/* ---------- Feedback sheet: thumbs under an answer; thumbs down opens a short sheet. It plays a thumbs down by itself,
   and anything you do inside it takes over ---------- */
const NOTE = 'Keep our 8px spacing scale';

export default function FeedbackSheetDemo() {
  const [rating, setRating] = useState<FeedbackRating>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Feedback | null>(null);
  const auto = useRef(true);
  const mine = () => { auto.current = false; setTyping(false); };

  useScript(async s => {
    // each beat stops the run once a person has taken over
    const beat = async (ms: number) => { await s.wait(ms); if (!auto.current) throw new Error('stop'); };
    try {
      await beat(1500); setRating('down'); setOpen(true);
      await beat(1000); setSelected(['Ignored my tokens']);
      await beat(700); setTyping(true);
      for (let i = 1; i <= NOTE.length; i++) { setComment(NOTE.slice(0, i)); await beat(34 + Math.random() * 40); }
      await beat(650); setTyping(false); setSending(true);
      await beat(800); setSending(false); setOpen(false);
      await beat(300); setSent({ reasons: ['Ignored my tokens'], comment: NOTE });
    } catch { /* a person took over */ }
  });

  return (
    <div style={{ width: '100%' }} onPointerDownCapture={mine} onKeyDownCapture={mine}>
      <FeedbackSheet rating={rating} onRatingChange={setRating} open={open} onOpenChange={setOpen} selected={selected} onSelectedChange={setSelected}
        comment={comment} onCommentChange={setComment} typing={typing} sending={sending || undefined} sent={sent} onSentChange={setSent}
        onSubmit={() => new Promise(res => setTimeout(res, 800))}>
        I tightened the hero spacing to 24px and swapped the CTA to the accent blue. The card grid now wraps at 720px.
      </FeedbackSheet>
    </div>
  );
}
