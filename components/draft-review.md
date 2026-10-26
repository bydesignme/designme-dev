# Draft review

> An email the agent drafted, to check and edit before it sends.

Agent components / Review and approve. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/draft-review

## Install

```sh
npx designme add draft-review          # HTML, CSS and JS, with the shared core
npx designme add draft-review --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Draft review lays out an email the agent wrote the way the email will go: who it is to, the subject, the message and what is attached. People can edit it, then send it now, schedule it from a dropdown beside Send, or discard it. A warning can stop it before it goes, like a message that mentions an attachment when nothing is attached, and after sending there is a short window to undo.

### When to use it

- When the agent writes on someone's behalf and nothing should leave without them seeing it.
- When people want to change a word or two before it goes, not write it again.
- When some messages are better sent later, like at the start of the reader's day.
- When a check can catch a mistake before sending, and a sent message can still be taken back for a few seconds.

### What it does

- `to` shows each recipient as a chip with an avatar. `subject` sits in a plain input, and `body` stays editable; read edits from `onBodyChange`.
- `attachments` show as file chips, with a spinner in place of the size while one is `loading`.
- `warning` folds open above the buttons with its own actions, like Send anyway and Attach the summary.
- The dropdown beside Send picks when it goes. `sendOptions` replace the defaults (now, tomorrow at 09:00, Monday at 09:00), and any pick but `now` turns the button into Schedule.
- `phase` moves from `draft` to `sending`, then `undo`, `sent`, `scheduled` or `discarded`. The tag in the header follows it, and the fields dim while it is out of your hands.
- In the `undo` phase a green row counts down `undoLeft` with an Undo button. A scheduled message can be cancelled and a discarded draft brought back, all through `onUndo`.

### Accessibility

- The subject is a labelled input and the message is a multi-line textbox labelled "Message".
- The dropdown button is labelled "When to send" and says whether its menu is open. Each time is a menu item that marks the picked one with `aria-checked`, and Escape closes the menu.
- Once it is sent, scheduled or discarded, the fields are inert, so they can't be edited or reached with Tab until it is undone.

## Usage in React

```tsx
import { DraftReview } from '@/components/designme/draft-review/DraftReview';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { DraftReview, type DraftAttachment, type DraftPhase, type SendOption } from './DraftReview';
import { useStory, useWait } from '../lib/useScript';

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
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` (optional) | `string` |  |
| `subtitle` (optional) | `string` | The line under the title, like "After the pricing review with Maya" |
| `to` | `DraftRecipient[]` |  |
| `subject` | `string` |  |
| `onSubjectChange` (optional) | `(subject: string) => void` |  |
| `body` | `string` | The message as the agent wrote it. Paragraphs are split by blank lines. It stays editable; read edits from onBodyChange |
| `onBodyChange` (optional) | `(body: string) => void` |  |
| `attachments` (optional) | `DraftAttachment[]` |  |
| `warning` (optional) | `{ text: ReactNode; actions: { label: string; onClick: () => void; primary?: boolean }[] }` | A problem to settle before it sends, like an attachment the message mentions but nothing attached |
| `phase` (optional) | `DraftPhase` |  |
| `sendOptions` (optional) | `SendOption[]` | When to send, picked from the menu beside the button |
| `sendOption` (optional) | `string` |  |
| `defaultSendOption` (optional) | `string` |  |
| `onSendOptionChange` (optional) | `(key: string) => void` |  |
| `onSend` (optional) | `(option: SendOption) => void` |  |
| `onDiscard` (optional) | `() => void` |  |
| `onUndo` (optional) | `() => void` | Takes it back: undoes a send in its undo window, cancels a scheduled one, or brings back a discarded draft |
| `undoLeft` (optional) | `number` | Seconds left to undo, shown while the phase is undo |
| `labels` (optional) | `{ send?: string; schedule?: string; sending?: string; scheduling?: string; discard?: string; notSent?: string; sent?: string; scheduled?: string; delivered?: string; discarded?: string; nothingSent?: string; undo?: string; cancel?: string }` |  |
| `className` (optional) | `string` |  |

## Questions

**Does it send the email?**

No. It calls `onSend` with the picked option and shows the `phase` you pass. Your code sends or schedules the message, runs the undo window and moves the phase along.

**Does it check for missing attachments by itself?**

No. The preview checks whether the message mentions an attachment when nothing is attached, and passes a `warning`. Pass your own warning for any check you run before sending.

**Can I use it for messages that aren't email?**

Yes. Change the `title` and `labels`, and pass the recipients and send options you need. With no `attachments` and no `warning`, neither shows.

## Source

`DraftReview.tsx`, as `npx designme add draft-review --react` installs it:

```tsx
'use client';
import { useRef, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Avatar, Fold, Spin, Swap } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './draft-review.css';

export interface DraftRecipient {
  name: string;
  initials?: string;
  /** The avatar's colour, like 'var(--dm-pl)' */
  color?: string;
}

export interface DraftAttachment {
  name: string;
  /** Shown beside the name, like "240 KB" */
  size?: string;
  /** Still uploading: a spinner in place of the size */
  loading?: boolean;
}

export interface SendOption {
  /** `now` sends straight away; any other key schedules it */
  key: string;
  /** Like "Tomorrow at 09:00" */
  label: string;
  /** The quiet line under it in the menu */
  detail?: string;
}

/** draft (being checked), sending, undo (sent, with a window to take it back), sent, scheduled or discarded */
export type DraftPhase = 'draft' | 'sending' | 'undo' | 'sent' | 'scheduled' | 'discarded';

export interface DraftReviewProps {
  title?: string;
  /** The line under the title, like "After the pricing review with Maya" */
  subtitle?: string;
  to: DraftRecipient[];
  subject: string;
  onSubjectChange?: (subject: string) => void;
  /** The message as the agent wrote it. Paragraphs are split by blank lines. It stays editable; read edits from onBodyChange */
  body: string;
  onBodyChange?: (body: string) => void;
  attachments?: DraftAttachment[];
  /** A problem to settle before it sends, like an attachment the message mentions but nothing attached */
  warning?: { text: ReactNode; actions: { label: string; onClick: () => void; primary?: boolean }[] };
  phase?: DraftPhase;
  /** When to send, picked from the menu beside the button */
  sendOptions?: SendOption[];
  sendOption?: string;
  defaultSendOption?: string;
  onSendOptionChange?: (key: string) => void;
  onSend?: (option: SendOption) => void;
  onDiscard?: () => void;
  /** Takes it back: undoes a send in its undo window, cancels a scheduled one, or brings back a discarded draft */
  onUndo?: () => void;
  /** Seconds left to undo, shown while the phase is undo */
  undoLeft?: number;
  labels?: { send?: string; schedule?: string; sending?: string; scheduling?: string; discard?: string; notSent?: string; sent?: string; scheduled?: string; delivered?: string; discarded?: string; nothingSent?: string; undo?: string; cancel?: string };
  className?: string;
}

const WHEN: SendOption[] = [
  { key: 'now', label: 'Send now' },
  { key: 'tomorrow', label: 'Tomorrow at 09:00', detail: 'The start of their day' },
  { key: 'monday', label: 'Monday at 09:00', detail: 'The start of next week' }
];

/** An email the agent drafted, laid out like the email it is, to check and edit before it goes: send now or later, or
    discard it. A warning can stop it before it sends, and after sending there is a short window to undo. */
export function DraftReview({
  title = 'Draft from the agent', subtitle, to, subject, onSubjectChange, body, onBodyChange, attachments = [], warning, phase = 'draft',
  sendOptions = WHEN, sendOption, defaultSendOption, onSendOptionChange, onSend, onDiscard, onUndo, undoLeft = 5, labels = {}, className
}: DraftReviewProps) {
  const [pick, setPick] = useControllable(sendOption, defaultSendOption ?? sendOptions[0].key, onSendOptionChange);
  const menu = usePopover({ align: 'end' });
  const chosen = sendOptions.find(o => o.key === pick) ?? sendOptions[0];
  const later = chosen.key !== 'now';
  const L = { send: 'Send', schedule: 'Schedule', sending: 'Sending', scheduling: 'Scheduling', discard: 'Discard', notSent: 'Not sent', sent: 'Sent', scheduled: 'Scheduled', delivered: 'Delivered just now', discarded: 'Draft discarded', nothingSent: 'Nothing was sent', undo: 'Undo', cancel: 'Cancel', ...labels };
  const names = to.map(p => p.name).join(', ');
  // the body is written once and left to the browser while it is edited, so the caret stays where it is
  const first = useRef(body);
  const busy = phase === 'sending', done = phase !== 'draft' && phase !== 'sending';
  const tag = phase === 'sent' ? ['dm-ok', L.sent] : phase === 'scheduled' ? ['dm-b', L.scheduled] : ['', L.notSent];
  const row = phase === 'undo' ? { icon: 'ok' as const, cls: '', t: `${L.sent} to ${names}`, sub: `You can undo for ${undoLeft}s`, btn: L.undo }
    : phase === 'sent' ? { icon: 'ok' as const, cls: '', t: `${L.sent} to ${names}`, sub: L.delivered }
    : phase === 'scheduled' ? { icon: 'clock' as const, cls: 'dm-later', t: `${L.scheduled} for ${chosen.label.replace(/^\w/, c => c.toLowerCase())}`, sub: `To ${names}`, btn: L.cancel }
    : phase === 'discarded' ? { icon: 'trash' as const, cls: 'dm-bin', t: L.discarded, sub: L.nothingSent, btn: L.undo } : null;

  return (
    <div data-dm="" className={className} style={{ width: '100%' }}>
      <div className={cx('dm-drf dm-panel', done && 'dm-sent')}>
        <div className="dm-drf-h">
          <span className="dm-drf-ag"><Icon name="spark" /></span>
          <div className="dm-drf-ht"><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div>
          <span className={cx('dm-tag dm-drf-tag', tag[0])}><Swap>{tag[1]}</Swap></span>
        </div>
        <div className="dm-drf-fs" inert={done}>
          <div className="dm-drf-r"><span className="dm-drf-l">To</span>
            {to.map(p => <span key={p.name} className="dm-drf-p"><Avatar initials={p.initials ?? p.name.split(' ').map(w => w[0]).join('').slice(0, 2)} color={p.color ?? 'var(--dm-pl)'} />{p.name}</span>)}
          </div>
          <label className="dm-drf-r"><span className="dm-drf-l">Subject</span><input className="dm-drf-s" value={subject} onChange={e => onSubjectChange?.(e.target.value)} readOnly={!onSubjectChange} aria-label="Subject" /></label>
        </div>
        <div className="dm-drf-b" contentEditable={!done} suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label="Message" spellCheck={false}
          style={{ whiteSpace: 'pre-wrap' }} inert={done} onInput={e => onBodyChange?.((e.target as HTMLElement).innerText)}>{first.current}</div>
        <div className="dm-drf-att" inert={done}>
          {attachments.map(a => (
            <span key={a.name} className="dm-drf-file dm-enter"><Icon name="file" size="xs" /><span>{a.name}</span>
              <span className="dm-muted dm-drf-fz">{a.loading ? <Spin /> : a.size}</span></span>
          ))}
        </div>
        <Fold open={!!warning && phase === 'draft'} className="dm-drf-wf">
          <div className="dm-drf-w">
            <p><Icon name="alert" size="xs" /><span>{warning?.text}</span></p>
            <div className="dm-drf-wa">
              {warning?.actions.map(a => <button key={a.label} type="button" className={cx('dm-pill dm-sm', a.primary ? 'dm-primary' : 'dm-ghost')} onClick={a.onClick}>{a.label}</button>)}
            </div>
          </div>
        </Fold>
        {row ? (
          <div className={cx('dm-drf-done dm-enter', row.cls)}>
            <Icon name={row.icon} size={row.icon === 'trash' ? 'xs' : undefined} />
            <span className="dm-t">{row.t}<span className="dm-muted dm-drf-sub">{row.sub}</span></span>
            {row.btn && <button type="button" className="dm-pill dm-sm" onClick={onUndo}>{row.btn}</button>}
          </div>
        ) : (
          <div className="dm-drf-f">
            <button type="button" className="dm-pill dm-ghost dm-sm dm-drf-x" disabled={busy} onClick={onDiscard}><Icon name="trash" size="xs" />{L.discard}</button>
            <span className="dm-sp" />
            <Swap className="dm-muted dm-drf-when">{later ? chosen.label : ''}</Swap>
            <div className="dm-drf-mg">
              <button type="button" className="dm-pill dm-primary dm-sm dm-drf-go" disabled={busy} onClick={() => onSend?.(chosen)}>
                {busy ? <><Spin />{later ? L.scheduling : L.sending}</> : <><Icon name={later ? 'clock' : 'send'} size="xs" />{later ? L.schedule : L.send}</>}
              </button>
              <button type="button" className="dm-pill dm-primary dm-sm dm-drf-dd" aria-label="When to send" disabled={busy} {...menu.trigger}><Icon name="chev-d" size="xs" /></button>
            </div>
            <div {...menu.pop} className={cx(menu.pop.className, 'dm-drf-pop')} role="menu" aria-label="When to send">
              {sendOptions.map(o => (
                <button type="button" key={o.key} className="dm-mi" role="menuitemradio" aria-checked={o.key === chosen.key} onClick={() => { setPick(o.key); menu.closeSoon(); }}>
                  <span>{o.label}{o.detail && <span className="dm-d">{o.detail}</span>}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

## More in Review and approve

- [Change review](https://designme.dev/components/change-review.md): Accept or reject each change the agent made, file by file.
- [Plan review](https://designme.dev/components/plan-review.md): Check the agent's plan, edit steps, then let it run.
- [Permission gate](https://designme.dev/components/permission-gate.md): The agent asks before it touches something new.
- [Hand-off to a person](https://designme.dev/components/human-handoff.md): The agent hands a conversation to a person, with what they need to pick it up.
- [Decision prompt](https://designme.dev/components/decision-prompt.md): The agent asks a few quick questions before it starts.
- [Proposal card](https://designme.dev/components/proposal-card.md): A suggested change with confidence, alternatives and undo.
- [Design tuner](https://designme.dev/components/design-tuner.md): Tweak a component by hand or let the agent tune it.
- [Rewrite toolbar](https://designme.dev/components/rewrite-toolbar.md): Select a sentence and let the agent rewrite it in place.
- [Launch checklist](https://designme.dev/components/launch-checklist.md): The agent checks a design before it ships, and fixes what fails.
- [Inline text diff](https://designme.dev/components/inline-text-diff.md): The agent's edits to a piece of copy, accepted or rejected one by one.
- [Steering](https://designme.dev/components/steering.md): Change the agent's course while it works, without starting over.
- [Eval results](https://designme.dev/components/eval-results.md): An eval run case by case, against the run before.
- [Design review](https://designme.dev/components/design-review.md): Checks run, a teammate asks for a change, the agent makes it, and you ship.

All components: https://designme.dev/llms.txt
