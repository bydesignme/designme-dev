'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Fold, Spin, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './feedback-sheet.css';

export type FeedbackRating = 'up' | 'down' | null;
export interface Feedback { reasons: string[]; comment: string }

export interface FeedbackSheetProps {
  /** The answer being rated, shown above the thumbs */
  children?: ReactNode;
  /** Whether the answer was rated good or bad. Leave it out to let the thumbs set it */
  rating?: FeedbackRating;
  defaultRating?: FeedbackRating;
  onRatingChange?: (rating: FeedbackRating) => void;
  /** The heading of the sheet that opens on thumbs down */
  question?: string;
  /** Quick reasons to pick from */
  reasons?: string[];
  placeholder?: string;
  /** A quiet note beside the buttons, like who sees the feedback */
  note?: string;
  /** Called with what the person picked and wrote. Return a promise to show a spinner until it settles */
  onSubmit?: (feedback: Feedback) => void | Promise<void>;
  /** What to say once it is sent. Defaults to a line about what the agent will do next time */
  thanks?: (feedback: Feedback) => ReactNode;
  /** Sits flat under a message in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

const REASONS = ['Wrong spacing', 'Ignored my tokens', 'Too many changes', 'Broke the layout'];
const THANKS = (f: Feedback) => `Thanks. The agent will ${f.reasons.length ? 'avoid this' : 'use this'} next time in this project.`;

/** Rate an answer, and say what missed when it was wrong. */
export function FeedbackSheet({ children, rating, defaultRating = null, onRatingChange, question = 'What went wrong?', reasons = REASONS, placeholder = 'Anything else the agent should know', note = 'Shared with the agent for this project', onSubmit, thanks = THANKS, bare = true, className }: FeedbackSheetProps) {
  const [rate, setRate] = useControllable<FeedbackRating>(rating, defaultRating, onRatingChange);
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Feedback | null>(null);
  const [status, setStatus] = useState('');
  const box = useRef<HTMLTextAreaElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const up = () => { const on = rate !== 'up'; setRate(on ? 'up' : null); setOpen(false); setStatus(on ? 'Thanks, noted' : ''); };
  const down = () => {
    const on = rate !== 'down'; setRate(on ? 'down' : null); setOpen(on); setStatus('');
    // the sheet opens first, then the cursor goes to the box
    if (on) later(350, () => box.current?.focus({ preventScroll: true }));
  };
  const send = async () => {
    if (sending) return;
    const f = { reasons: picked, comment: comment.trim() };
    setSending(true);
    // if sending fails the sheet stays open so the person can try again
    try { await onSubmit?.(f); } catch (e) { setSending(false); throw e; }
    setSending(false); setOpen(false);
    later(300, () => { setSent(f); setStatus('Feedback sent'); });
  };

  return (
    <div data-dm="" className={cx('dm-fbx', !bare && 'dm-panel', className)} style={bare ? undefined : { padding: 16 }}>
      {children && <div className="dm-msg">{children}</div>}
      <div className="dm-fbx-bar">
        <Tip label="Good answer"><button type="button" className={cx('dm-ib dm-fbx-up', rate === 'up' && 'dm-on')} aria-label="Good answer" aria-pressed={rate === 'up'} onClick={up}><Icon name="up-thumb" /></button></Tip>
        <Tip label="Bad answer"><button type="button" className={cx('dm-ib dm-fbx-dn', rate === 'down' && 'dm-on')} aria-label="Bad answer" aria-pressed={rate === 'down'} onClick={down}><Icon name="down-thumb" /></button></Tip>
        <Swap className="dm-fbx-st dm-muted">{status}</Swap>
      </div>
      <Fold open={open} className="dm-fbx-box">
        <div className="dm-fbx-in dm-panel">
          <div className="dm-fbx-q">{question}</div>
          {reasons.length > 0 && (
            <div className="dm-fbx-ch">
              {reasons.map(r => {
                const on = picked.includes(r);
                return <button key={r} type="button" className={cx('dm-chip dm-sm', on && 'dm-on')} aria-pressed={on} onClick={() => setPicked(on ? picked.filter(x => x !== r) : [...picked, r])}>{r}</button>;
              })}
            </div>
          )}
          <textarea ref={box} className="dm-fbx-ta" rows={2} placeholder={placeholder} value={comment} onChange={e => setComment(e.target.value)} />
          <div className="dm-fbx-f">
            <span className="dm-muted dm-fbx-n">{note}</span>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-fbx-x" onClick={() => { setOpen(false); setRate(null); }}>Cancel</button>
            <button type="button" className="dm-pill dm-ink dm-sm dm-fbx-go" disabled={!(picked.length || comment.trim())} aria-busy={sending} onClick={send}>{sending ? <Spin /> : 'Send'}</button>
          </div>
        </div>
      </Fold>
      {sent && <div className="dm-fbx-thx dm-enter" role="status"><Icon name="ok" /><span>{thanks(sent)}</span></div>}
    </div>
  );
}
