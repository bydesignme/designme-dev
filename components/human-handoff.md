# Hand-off to a person

> The agent hands a conversation to a person, with what they need to pick it up.

Agent components / Review and approve. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/human-handoff

## Install

```sh
npx designme add human-handoff          # HTML, CSS and JS, with the shared core
npx designme add human-handoff --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Hand-off to a person shows an agent passing a conversation to a human. It says why, like "Refund over $500 needs a person", who it is assigned to with their team and whether they are free, and when the reply is due, counting down. Beside that is the context they need to pick it up: a short summary, a few key facts and a link to the whole conversation. Under the assignee is what the customer was told, with Edit, and a row at the foot says where it stands. If the person can't take it, Reassign opens a small menu of who else can.

### When to use it

- When an agent reaches something it isn't allowed to do, like a large refund, and a person has to take over.
- When the person picking it up should not have to read the whole conversation to know what is going on.
- When there is a target time to reply and people need to see how much of it is left.
- When whoever was assigned is away or busy, and someone needs to pass it on quickly.

### What it does

- `reason` sits under the title. `assignee` shows an avatar, name, `team` and `presence`, with a green dot for `tone: 'ok'` or amber for `'warn'`. While `assignee` is null a spinner and `finding` fill the row.
- `people` adds Reassign, a small menu of who else can take it with their team and presence. Picking someone calls `onReassign`.
- `secondsLeft` reads "Reply due in 14 min" and empties a bar over `targetSeconds` (15 minutes by default). Under five minutes it turns amber, and at zero it reads overdue.
- `summary`, `facts` (label and value rows) and `link` are the context passed along.
- `message` is what the customer was told. `onMessageChange` adds Edit: the message turns editable, then Save or Cancel, and `edited` adds "· edited" to its label.
- `status` is the row at the foot: neutral with a spinner while it waits, amber with an alert when the person can't take it, and green with the person's avatar once they have, like "With Alex · agent paused".
- On wide screens the assignment and the context sit side by side; below 600px they stack.

### Accessibility

- Reassign says whether its menu is open. Each person is a menu item that marks the current one with `aria-checked`, and Escape closes the menu.
- From the keyboard, Enter, Space or the down arrow opens a menu with the focus on its picked item, or its first (the up arrow, on its last); the arrow keys move through it and wrap, Home and End jump to the ends, Tab closes it and moves on, and closing it gives the focus back to its button.
- The time left is a progress bar labelled "Time left to reply", with the seconds left as its value.
- The message is a textbox that is read-only until Edit is pressed, and the status row is a polite live region, so changes like "Alex joined" are announced.

## Usage in React

```tsx
import { HumanHandoff } from '@/components/designme/human-handoff/HumanHandoff';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { HumanHandoff, type HandoffPerson, type HandoffStatus } from './HumanHandoff';
import { useStory, useTakeover, useWait } from '../lib/useScript';

/* ---------- Hand-off to a person: Maya is assigned but is out, so the person reassigns it to Alex, who takes it ---------- */
// someone free takes the conversation in a few seconds, someone in a call takes longer, and someone who is out never does
type Member = HandoffPerson & { wait?: number };
const TEAM: Member[] = [
  { name: 'Alex Rivera', initials: 'AR', color: 'var(--dm-pm)', team: 'Billing', presence: 'Available', tone: 'ok', wait: 2500 },
  { name: 'Sam Ortiz', initials: 'SO', color: 'var(--dm-pp)', team: 'Billing', presence: 'In a call', wait: 6000 },
  { name: 'Maya Chen', initials: 'MC', color: 'var(--dm-pl)', team: 'Billing', presence: 'Out until 2pm', tone: 'warn' }
];
const first = (p: HandoffPerson) => p.name.split(' ')[0];
const MESSAGE = "Thanks, Dana. A refund this size needs someone on our billing team, so I've passed your conversation to them. They'll reply here within 15 minutes.";

export default function HumanHandoffDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const run = useRef(0);
  const [who, setWho] = useState<HandoffPerson | null>(null);
  const [status, setStatus] = useState<HandoffStatus>({ title: 'Handing off to Billing', detail: 'The agent has stopped replying to Dana' });
  const [left, setLeft] = useState(846);
  const [message, setMessage] = useState(MESSAGE);
  const [edited, setEdited] = useState(false);

  // the reply is due 15 minutes after the hand-off; this one starts with 14:06 left
  useEffect(() => { const id = setInterval(() => setLeft(s => s - 1), 1000); return () => clearInterval(id); }, []);

  const assign = async (p: Member) => {
    const id = ++run.current;
    // their status comes back a moment after they are assigned
    setWho({ ...p, presence: undefined, tone: undefined });
    setStatus({ title: `Waiting for ${first(p)} to accept`, detail: 'The agent has stopped replying to Dana' });
    await wait(1600); if (id !== run.current) return;
    setWho(p);
    if (!p.wait) { setStatus({ tone: 'warn', title: `${first(p)} is out until 2pm`, detail: 'The reply is due before then. Reassign it to someone who is free.' }); return; }
    await wait(p.wait); if (id !== run.current) return;
    setStatus({ tone: 'ok', person: p, title: `${first(p)} joined`, detail: 'Reading the conversation' });
    await wait(1800); if (id !== run.current) return;
    setStatus({ tone: 'ok', person: p, title: `With ${first(p)} · agent paused`, detail: `The agent won't reply while ${first(p)} has it` });
  };
  // the agent finds someone on the team a moment after it hands off, unless you have picked someone first
  const mine = useTakeover(ref);
  useEffect(() => { const t = setTimeout(() => { if (!mine()) void assign(TEAM[2]); }, 1500); return () => { clearTimeout(t); run.current++; }; }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // the preview's story, on the same beats as the site's
  useStory(ref, async ({ wait, press }) => {
    await wait(5600); press('.dm-hox-rb');
    await wait(2500); press('.dm-hox-pop .dm-mi:nth-of-type(1)');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <HumanHandoff reason="Refund over $500 needs a person" assignee={who} finding={{ title: 'Finding someone', detail: 'Billing team' }}
        people={TEAM} onReassign={p => void assign(p as Member)} secondsLeft={left}
        summary="Dana was charged twice for her annual plan on Oct 21 and wants one charge back. The agent confirmed the duplicate, but can't refund more than $500."
        facts={[{ label: 'Amount', value: '$588.00' }, { label: 'Customer', value: 'Dana Lee · Pro since 2023' }, { label: 'Order', value: '#48213 · charged twice' }]}
        link={{ label: 'View conversation · 12 messages', tip: 'Opens the whole conversation' }}
        message={message} messageLabel="Sent to Dana" edited={edited} onMessageChange={t => { setMessage(t); setEdited(true); }} status={status} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` (optional) | `string` |  |
| `reason` | `string` | Why the agent handed off, like "Refund over $500 needs a person" |
| `assignee` | `HandoffPerson \| null` | Who has it, or null while the agent is still finding someone |
| `finding` (optional) | `{ title: string; detail?: string }` | The two lines shown while assignee is null |
| `people` (optional) | `HandoffPerson[]` | The people it can go to instead. Leave it out to hide Reassign |
| `onReassign` (optional) | `(person: HandoffPerson) => void` |  |
| `secondsLeft` | `number` | Seconds left until the reply is due. It shows whole minutes and turns amber under five; at 0 or less it reads overdue |
| `targetSeconds` (optional) | `number` | The whole window, for the bar and the line beside it ("15 min target") |
| `summary` | `string` | What the person needs to pick it up |
| `facts` (optional) | `HandoffFact[]` | A few key facts, as label and value rows |
| `link` (optional) | `{ label: string; href?: string; onClick?: () => void; tip?: string }` | A link to the whole conversation |
| `message` | `string` | What the agent told the customer |
| `messageLabel` (optional) | `string` | The label over the message, like "Sent to Dana" |
| `onMessageChange` (optional) | `(text: string) => void` | Adds Edit: the message turns editable, and Save calls this with the new text |
| `edited` (optional) | `boolean` | Adds "· edited" to the label |
| `status` | `HandoffStatus` | The row at the foot that says where it stands |
| `labels` (optional) | `{ assignedTo?: string; context?: string; reassign?: string; reassignTo?: string; target?: string; edit?: string; save?: string; cancel?: string; edited?: string }` |  |
| `className` (optional) | `string` |  |

## Questions

**Does it assign the conversation or notify anyone?**

No. It shows the `assignee` and `status` you pass. Your code routes the conversation, checks who is free, and calls back when they accept; `onReassign` tells you who was picked.

**Does the timer count down by itself?**

No. Pass `secondsLeft` and update it, for example once a second, from the time the reply is due. The line and the bar follow it.

**Does editing the message send the change to the customer?**

No. Save calls `onMessageChange` with the new text. Update the message where the customer sees it, then pass it back with `edited`.

## Source

`HumanHandoff.tsx`, as `npx designme add human-handoff --react` installs it:

```tsx
'use client';
import { useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { Icon } from '../lib/icons';
import { Avatar, Spin, Swap, Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './human-handoff.css';

export interface HandoffPerson {
  /** Used as the key, so keep it unique */
  name: string;
  initials?: string;
  /** The avatar's colour, like 'var(--dm-pm)' */
  color?: string;
  /** Like "Billing" */
  team?: string;
  /** Whether they can take it now, like "Available", "In a call" or "Out until 2pm" */
  presence?: string;
  /** ok puts a green dot before the presence, warn turns it amber */
  tone?: 'ok' | 'warn';
}

export interface HandoffFact {
  label: string;
  value: string;
}

export interface HandoffStatus {
  /** wait is neutral with a spinner, warn amber with an alert, ok green */
  tone?: 'wait' | 'warn' | 'ok';
  title: string;
  detail?: string;
  /** Shown in place of the icon, like the person who just joined */
  person?: HandoffPerson;
}

export interface HumanHandoffProps {
  title?: string;
  /** Why the agent handed off, like "Refund over $500 needs a person" */
  reason: string;
  /** Who has it, or null while the agent is still finding someone */
  assignee: HandoffPerson | null;
  /** The two lines shown while assignee is null */
  finding?: { title: string; detail?: string };
  /** The people it can go to instead. Leave it out to hide Reassign */
  people?: HandoffPerson[];
  onReassign?: (person: HandoffPerson) => void;
  /** Seconds left until the reply is due. It shows whole minutes and turns amber under five; at 0 or less it reads overdue */
  secondsLeft: number;
  /** The whole window, for the bar and the line beside it ("15 min target") */
  targetSeconds?: number;
  /** What the person needs to pick it up */
  summary: string;
  /** A few key facts, as label and value rows */
  facts?: HandoffFact[];
  /** A link to the whole conversation */
  link?: { label: string; href?: string; onClick?: () => void; tip?: string };
  /** What the agent told the customer */
  message: string;
  /** The label over the message, like "Sent to Dana" */
  messageLabel?: string;
  /** Adds Edit: the message turns editable, and Save calls this with the new text */
  onMessageChange?: (text: string) => void;
  /** Adds "· edited" to the label */
  edited?: boolean;
  /** The row at the foot that says where it stands */
  status: HandoffStatus;
  labels?: { assignedTo?: string; context?: string; reassign?: string; reassignTo?: string; target?: string; edit?: string; save?: string; cancel?: string; edited?: string };
  className?: string;
}

const initialsOf = (p: HandoffPerson) => p.initials ?? p.name.split(' ').map(w => w[0]).join('').slice(0, 2);
const due = (s: number) => { const m = Math.floor(s / 60); return s <= 0 ? 'Reply overdue' : m < 1 ? 'Reply due in under a minute' : `Reply due in ${m} min`; };

/** The agent hands a conversation to a person: why, who has it (with Reassign), when the reply is due, the context they
    need to pick it up, and what the customer was told, with a row at the foot that says where it stands. */
export function HumanHandoff({
  title = 'Handed off to a person', reason, assignee, finding = { title: 'Finding someone' }, people, onReassign, secondsLeft, targetSeconds = 900,
  summary, facts = [], link, message, messageLabel = 'Sent to the customer', onMessageChange, edited, status, labels = {}, className
}: HumanHandoffProps) {
  const L = { assignedTo: 'Assigned to', context: 'Context passed along', reassign: 'Reassign', reassignTo: 'Reassign to', target: `${Math.round(targetSeconds / 60)} min target`,
    edit: 'Edit', save: 'Save', cancel: 'Cancel', edited: 'edited', ...labels };
  const menu = usePopover({ align: 'end', side: 'down' });
  const [editing, setEditing] = useState(false);
  // the message box is drawn afresh after each edit, so what React renders and what was typed never disagree
  const [rev, setRev] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const left = Math.max(0, secondsLeft);
  const tone = secondsLeft <= 0 ? 'dm-bad' : secondsLeft < 300 ? 'dm-warn' : '';

  const startEdit = () => {
    setEditing(true);
    requestAnimationFrame(() => { const b = box.current; if (!b) return; b.focus(); const s = getSelection(); s?.selectAllChildren(b); s?.collapseToEnd(); });
  };
  const save = () => { const t = box.current?.innerText.trim() ?? ''; if (t && t !== message) onMessageChange?.(t); setEditing(false); setRev(r => r + 1); };
  const cancel = () => { setEditing(false); setRev(r => r + 1); };
  const st = status.tone ?? 'wait';
  const link0 = link && (link.href
    ? <a className="dm-fchip dm-lnk dm-hox-lnk" href={link.href} onClick={link.onClick}><Icon name="link" size="xs" /><span>{link.label}</span></a>
    : <button type="button" className="dm-fchip dm-lnk dm-hox-lnk" onClick={link.onClick}><Icon name="link" size="xs" /><span>{link.label}</span></button>);

  return (
    <div data-dm="" className={className} style={{ width: '100%', containerType: 'inline-size' }}>
      <div className="dm-hox dm-panel">
        <div className="dm-hox-h">
          <span className="dm-hox-ic"><Icon name="user" /></span>
          <div className="dm-hox-ht"><b>{title}</b><span className="dm-muted">{reason}</span></div>
        </div>
        <div className="dm-hox-b">
          <div className="dm-hox-col">
            <span className="dm-hox-lb">{L.assignedTo}</span>
            <div className="dm-hox-who">
              <span className="dm-hox-av">{assignee ? <Avatar key={assignee.name} className="dm-enter" initials={initialsOf(assignee)} color={assignee.color ?? 'var(--dm-pl)'} /> : <Spin />}</span>
              <span className="dm-hox-wt">
                <b><Swap>{assignee ? assignee.name : finding.title}</Swap></b>
                {assignee ? (
                  <span key={assignee.name + (assignee.presence ?? '')} className={cx('dm-hox-wd dm-enter', assignee.tone && 'dm-' + assignee.tone)}>
                    {assignee.presence && <span className="dm-dot" />}<span>{[assignee.team, assignee.presence].filter(Boolean).join(' · ')}</span>
                  </span>
                ) : <span className="dm-hox-wd"><span>{finding.detail}</span></span>}
              </span>
              {people && (
                <button type="button" className="dm-hox-rb" disabled={!assignee} {...menu.trigger}>{L.reassign}<Icon name="chev-d" size="xs" /></button>
              )}
            </div>
            <div className={cx('dm-hox-sla', tone)}>
              <div className="dm-hox-sl"><Icon name="clock" /><span className="dm-hox-due dm-num">{due(secondsLeft)}</span><span className="dm-muted">{L.target}</span></div>
              <div className="dm-hox-bar" role="progressbar" aria-label="Time left to reply" aria-valuemin={0} aria-valuemax={targetSeconds} aria-valuenow={left}>
                <i style={{ width: `${Math.min(100, (left / targetSeconds) * 100)}%` }} />
              </div>
            </div>
            <div className="dm-hox-ms">
              <div className="dm-hox-mh">
                <span className="dm-hox-lb">{edited ? `${messageLabel} · ${L.edited}` : messageLabel}</span><span className="dm-sp" />
                {onMessageChange && editing && <button type="button" className="dm-pill dm-ghost dm-sm" onClick={cancel}>{L.cancel}</button>}
                {onMessageChange && (editing
                  ? <button type="button" className="dm-pill dm-primary dm-sm" onClick={save}>{L.save}</button>
                  : <button type="button" className="dm-pill dm-ghost dm-sm" onClick={startEdit}><Icon name="edit" size="xs" />{L.edit}</button>)}
              </div>
              <div key={rev} ref={box} className="dm-hox-mb" contentEditable={editing} suppressContentEditableWarning role="textbox" aria-multiline="true" aria-readonly={!editing}
                aria-label={messageLabel} spellCheck={false}>{message}</div>
            </div>
          </div>
          <div className="dm-hox-col">
            <span className="dm-hox-lb">{L.context}</span>
            <p className="dm-hox-sum">{summary}</p>
            {facts.length > 0 && (
              <div className="dm-hox-facts">
                {facts.map(f => <div key={f.label} className="dm-hox-f"><span className="dm-k">{f.label}</span><span className="dm-v dm-num">{f.value}</span></div>)}
              </div>
            )}
            {link0 && (link?.tip ? <Tip label={link.tip}>{link0}</Tip> : link0)}
          </div>
        </div>
        <div className={cx('dm-hox-st', st !== 'wait' && 'dm-' + st)} aria-live="polite">
          <span className="dm-g">{status.person ? <Avatar initials={initialsOf(status.person)} color={status.person.color ?? 'var(--dm-pl)'} /> : st === 'wait' ? <Spin /> : <Icon name={st === 'warn' ? 'alert' : 'ok'} />}</span>
          <span className="dm-t"><b><Swap>{status.title}</Swap></b>{status.detail && <span><Swap>{status.detail}</Swap></span>}</span>
        </div>
        {people && (
          <div {...menu.pop} className={cx(menu.pop.className, 'dm-hox-pop')} role="menu" aria-label={L.reassignTo}>
            <div className="dm-ph">{L.reassignTo}</div>
            {people.map(p => (
              <button type="button" key={p.name} className="dm-mi" role="menuitemradio" aria-checked={p.name === assignee?.name}
                onClick={() => { if (p.name !== assignee?.name) onReassign?.(p); menu.closeSoon(); }}>
                <Avatar initials={initialsOf(p)} color={p.color ?? 'var(--dm-pl)'} />
                <span>{p.name}<span className="dm-d">{[p.team, p.presence].filter(Boolean).join(' · ')}</span></span>
                <span className="dm-ck"><Icon name="check" size="xs" /></span>
              </button>
            ))}
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
- [Decision prompt](https://designme.dev/components/decision-prompt.md): The agent asks a few quick questions before it starts.
- [Proposal card](https://designme.dev/components/proposal-card.md): A suggested change with confidence, alternatives and undo.
- [Design tuner](https://designme.dev/components/design-tuner.md): Tweak a component by hand or let the agent tune it.
- [Rewrite toolbar](https://designme.dev/components/rewrite-toolbar.md): Select a sentence and let the agent rewrite it in place.
- [Launch checklist](https://designme.dev/components/launch-checklist.md): The agent checks a design before it ships, and fixes what fails.
- [Inline text diff](https://designme.dev/components/inline-text-diff.md): The agent's edits to a piece of copy, accepted or rejected one by one.
- [Draft review](https://designme.dev/components/draft-review.md): An email the agent drafted, to check and edit before it sends.
- [Steering](https://designme.dev/components/steering.md): Change the agent's course while it works, without starting over.
- [Eval results](https://designme.dev/components/eval-results.md): An eval run case by case, against the run before.
- [Design review](https://designme.dev/components/design-review.md): Checks run, a teammate asks for a change, the agent makes it, and you ship.

All components: https://designme.dev/llms.txt
