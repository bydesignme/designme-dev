# Feedback sheet

> Rate an answer and tell the agent what missed.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/feedback-sheet

## Install

```sh
npx designme add feedback-sheet          # HTML, CSS and JS, with the shared core
npx designme add feedback-sheet --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Feedback sheet puts thumbs up and thumbs down under an agent's answer. A thumbs down opens a short sheet where the person picks what went wrong from quick reasons, adds a note, and sends it, so the agent can do better next time.

### When to use it

- When you want ratings on agent answers and the reasons behind the bad ones.
- When feedback should be stored per project, like a memory of what the agent should avoid.
- When a rating should cost one click and the longer form should only appear when something went wrong.

### What it does

- Thumbs up marks the answer as good and shows "Thanks, noted". Thumbs down opens the sheet and moves the cursor to the comment box once it has opened.
- The sheet shows a `question` heading, toggleable `reasons` chips, a comment box and a `note` about who sees the feedback.
- Send stays disabled until a reason is picked or something is written. `onSubmit` receives `{ reasons, comment }`, and if it returns a promise the button shows a spinner until it settles.
- If `onSubmit` throws, the sheet stays open so the person can try again. On success it closes and a thank-you line appears, which you can change with `thanks`.
- Cancel closes the sheet and clears the rating.
- Rating, open state, picked reasons, comment and sent state can each be controlled or left to the component. `bare={false}` gives it a card of its own.

### Accessibility

- The thumbs are labelled "Good answer" and "Bad answer" and use `aria-pressed`.
- Each reason chip is a toggle button with `aria-pressed`.
- The Send button sets `aria-busy` while sending, and the thank-you line is a `role="status"` region.
- While closed, the sheet is `inert` and `aria-hidden`.

## Usage in React

```tsx
import { FeedbackSheet } from '@/components/designme/feedback-sheet/FeedbackSheet';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { useStory, useWait } from '../lib/useScript';
import { FeedbackSheet, type Feedback, type FeedbackRating } from './FeedbackSheet';

/* ---------- Feedback sheet: thumbs under an answer; thumbs down opens a short sheet. It plays a thumbs down by itself,
   and clicking, focusing or typing inside it takes over ---------- */
const NOTE = 'Keep our 8px spacing scale';

export default function FeedbackSheetDemo() {
  const [rating, setRating] = useState<FeedbackRating>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Feedback | null>(null);
  const ref = useRef<HTMLDivElement>(null), later = useWait();

  useStory(ref, async ({ wait, taken }) => {
    // taking over while it types takes its note back
    let writing = false;
    taken(() => { setTyping(false); if (writing) setComment(''); });
    await wait(1500); setRating('down'); setOpen(true);
    await wait(1000); setSelected(['Ignored my tokens']);
    await wait(700); setTyping(true); writing = true;
    for (let i = 1; i <= NOTE.length; i++) { setComment(NOTE.slice(0, i)); await wait(34 + Math.random() * 40); }
    await wait(650); writing = false; setTyping(false); setSending(true);
    // once sent, it goes through whatever happens next
    await later(800); setSending(false); setOpen(false);
    await later(300); setSent({ reasons: ['Ignored my tokens'], comment: NOTE });
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <FeedbackSheet rating={rating} onRatingChange={setRating} open={open} onOpenChange={setOpen} selected={selected} onSelectedChange={setSelected}
        comment={comment} onCommentChange={setComment} typing={typing} sending={sending || undefined} sent={sent} onSentChange={setSent}
        onSubmit={() => new Promise(res => setTimeout(res, 800))}>
        I tightened the hero spacing to 24px and swapped the CTA to the accent blue. The card grid now wraps at 720px.
      </FeedbackSheet>
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `children` (optional) | `ReactNode` | The answer being rated, shown above the thumbs |
| `rating` (optional) | `FeedbackRating` | Whether the answer was rated good or bad. Leave it out to let the thumbs set it |
| `defaultRating` (optional) | `FeedbackRating` |  |
| `onRatingChange` (optional) | `(rating: FeedbackRating) => void` |  |
| `open` (optional) | `boolean` | Whether the reasons sheet is open. Leave it out and thumbs down opens it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `selected` (optional) | `string[]` | The reasons picked. Leave it out to let the chips keep it |
| `defaultSelected` (optional) | `string[]` |  |
| `onSelectedChange` (optional) | `(selected: string[]) => void` |  |
| `comment` (optional) | `string` | What is written in the box. Leave it out to let the box keep it |
| `defaultComment` (optional) | `string` |  |
| `onCommentChange` (optional) | `(comment: string) => void` |  |
| `typing` (optional) | `boolean` | Shows the box as if someone were typing in it, for a scripted demo |
| `sending` (optional) | `boolean` | Shows the spinner on Send, for a scripted demo. A promise from onSubmit shows it by itself |
| `sent` (optional) | `Feedback \| null` | What was sent, which shows the thank-you line. Leave it out and Send sets it |
| `onSentChange` (optional) | `(sent: Feedback \| null) => void` |  |
| `question` (optional) | `string` | The heading of the sheet that opens on thumbs down |
| `reasons` (optional) | `string[]` | Quick reasons to pick from |
| `placeholder` (optional) | `string` |  |
| `note` (optional) | `string` | A quiet note beside the buttons, like who sees the feedback |
| `onSubmit` (optional) | `(feedback: Feedback) => void \| Promise<void>` | Called with what the person picked and wrote. Return a promise to show a spinner until it settles |
| `thanks` (optional) | `(feedback: Feedback) => ReactNode` | What to say once it is sent. Defaults to a line about what the agent will do next time |
| `bare` (optional) | `boolean` | Sits flat under a message in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Questions

**How do I save the feedback to my backend?**

Pass an async `onSubmit`. The component shows a spinner while the promise is pending and closes the sheet only when it resolves. If it rejects, the sheet stays open.

**Can I use my own reasons?**

Yes. Pass `reasons` as a list of strings. Pass an empty list to hide the chips and keep only the comment box.

**Does thumbs up open the sheet too?**

No. Thumbs up closes the sheet if it was open and shows a short thanks. Only thumbs down opens it, unless you control `open` yourself.

## Source

`FeedbackSheet.tsx`, as `npx designme add feedback-sheet --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Fold, Spin, Swap, Tip } from '../lib/motion';
import '../designme.css';
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
  /** Whether the reasons sheet is open. Leave it out and thumbs down opens it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The reasons picked. Leave it out to let the chips keep it */
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (selected: string[]) => void;
  /** What is written in the box. Leave it out to let the box keep it */
  comment?: string;
  defaultComment?: string;
  onCommentChange?: (comment: string) => void;
  /** Shows the box as if someone were typing in it, for a scripted demo */
  typing?: boolean;
  /** Shows the spinner on Send, for a scripted demo. A promise from onSubmit shows it by itself */
  sending?: boolean;
  /** What was sent, which shows the thank-you line. Leave it out and Send sets it */
  sent?: Feedback | null;
  onSentChange?: (sent: Feedback | null) => void;
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
export function FeedbackSheet({ children, rating, defaultRating = null, onRatingChange, open: openProp, defaultOpen = false, onOpenChange,
  selected, defaultSelected = [], onSelectedChange, comment: commentProp, defaultComment = '', onCommentChange, typing, sending: sendingProp, sent: sentProp, onSentChange, question = 'What went wrong?', reasons = REASONS, placeholder = 'Anything else the agent should know', note = 'Shared with the agent for this project', onSubmit, thanks = THANKS, bare = true, className }: FeedbackSheetProps) {
  const [rate, setRate] = useControllable<FeedbackRating>(rating, defaultRating, onRatingChange);
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const [picked, setPicked] = useControllable(selected, defaultSelected, onSelectedChange);
  const [comment, setComment] = useControllable(commentProp, defaultComment, onCommentChange);
  const [busy, setBusy] = useState(false);
  const sending = sendingProp ?? busy;
  const [sent, setSent] = useControllable<Feedback | null>(sentProp, null, onSentChange);
  const status = sent ? 'Feedback sent' : rate === 'up' ? 'Thanks, noted' : '';
  const box = useRef<HTMLTextAreaElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const up = () => { const on = rate !== 'up'; setRate(on ? 'up' : null); setOpen(false); };
  const down = () => {
    const on = rate !== 'down'; setRate(on ? 'down' : null); setOpen(on);
    // the sheet opens first, then the cursor goes to the box
    if (on) later(350, () => box.current?.focus({ preventScroll: true }));
  };
  const send = async () => {
    if (sending) return;
    const f = { reasons: picked, comment: comment.trim() };
    setBusy(true);
    // if sending fails the sheet stays open so the person can try again
    try { await onSubmit?.(f); } catch (e) { setBusy(false); throw e; }
    setBusy(false); setOpen(false);
    later(300, () => setSent(f));
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
          <textarea ref={box} className={cx('dm-fbx-ta', typing && 'dm-typing')} rows={2} placeholder={placeholder} value={comment} onChange={e => setComment(e.target.value)} />
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
```

## More in Conversation

- [Live answer](https://designme.dev/components/live-answer.md): Answers that stream in with numbered sources and next steps.
- [Composer](https://designme.dev/components/composer.md): Message input with attachments, what to work on, a mode and dictation.
- [Thread panel](https://designme.dev/components/thread-panel.md): Switch between agent threads and reply in place.
- [Artifact card](https://designme.dev/components/artifact-card.md): A file the agent made, with its versions, Open, Copy and Download.
- [Rich text editor](https://designme.dev/components/rich-text-editor.md): A minimal editor with an inline AI menu that streams a suggestion to accept or discard.
- [Tool call](https://designme.dev/components/tool-call.md): Each tool the agent calls, with its input and output.
- [Voice capture](https://designme.dev/components/voice-capture.md): Talk to the agent, then fix what it misheard before sending.
- [Voice orb](https://designme.dev/components/voice-orb.md): A hands-free voice chat, with an orb that shows who is talking.
- [Answer action bar](https://designme.dev/components/answer-action-bar.md): Copy, regenerate, rate and listen to an answer from one row under it.
- [Response versions](https://designme.dev/components/response-versions.md): Regenerate an answer and flip between versions.
- [Model picker](https://designme.dev/components/model-picker.md): Pick a model by speed, quality and cost, and how hard it thinks.
- [Prompt starters](https://designme.dev/components/prompt-starters.md): Suggested tasks that fill the composer in one click.
- [Prompt library](https://designme.dev/components/prompt-library.md): Saved prompts with blanks to fill in before they go to the agent.
- [Attachment tray](https://designme.dev/components/attachment-tray.md): Drop files for the agent and watch each one upload.

All components: https://designme.dev/llms.txt
