# Ticket list

> Support tickets the agent has triaged, with suggested replies.

App basics / Collaboration. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/ticket-list

## Install

```sh
npx designme add ticket-list          # HTML, CSS and JS, with the shared core
npx designme add ticket-list --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Ticket list is a support queue where the agent has already triaged each ticket and drafted a reply. Rows show a priority dot, the customer, how long they have waited and who the ticket is assigned to. Opening a ticket shows the customer's message and the suggested reply, which a person can edit before choosing Send and solve.

### When to use it

- When an agent triages incoming support tickets and drafts answers for a person to approve
- When a support lead wants urgent tickets to stand out by colour
- When replies should be edited in place before they go out
- When solved tickets should leave the open queue but stay one click away

### What it does

- A coloured dot marks `priority`: urgent red, high amber, normal accent and low grey, with the name in a tooltip.
- While shut, each row shows the customer and a preview of their `question`, plus the `waiting` time and assignee avatar.
- Opening a row shows the question and the agent's `reply` in an editable box; Edit puts the cursor at the end of it.
- Send and solve calls `onSend` with the ticket and the reply as edited; a promise shows a spinner, then the row fades out and moves to Solved.
- An Open and Solved switch filters the list, and an empty filter shows `emptyLabel`, "All caught up" by default.
- `tickets`, `filter` and `open` can each be controlled or left to the component.

### Accessibility

- Each ticket row is a button with `aria-expanded` reporting whether it is open.
- The Send and solve button sets `aria-busy` while sending.
- The Open and Solved switch is a `group` labelled Filter, with `aria-pressed` on each option.

## Usage in React

```tsx
import { TicketList } from '@/components/designme/ticket-list/TicketList';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { TicketList, type TicketListTicket } from './TicketList';
import { useStory } from '../lib/useScript';

/* ---------- Ticket list: four triaged tickets, the urgent one opens with the agent's reply ---------- */
const MAYA = { initials: 'MK', color: 'var(--dm-pl)' };
const TICKETS: TicketListTicket[] = [
  { id: 'export', priority: 'urgent', title: 'Agent stopped mid export', from: 'Northwind', assignee: MAYA, waiting: '4m', status: 'open',
    question: 'The token export stopped at 60% and nothing has happened for 20 minutes.',
    reply: 'Sorry about that. The run paused at your $5 spend cap. I have raised it for this run and it finished just now. Your tokens are in the Exports tab.' },
  { id: 'figma', priority: 'high', title: 'Figma frames not syncing', from: 'Lumen Labs', assignee: { initials: 'JO', color: 'var(--dm-pm)' }, waiting: '22m', status: 'open',
    question: 'New frames from this morning are not showing up in DesignMe.',
    reply: 'The Figma token for your workspace expired yesterday. Reconnect it from Settings, then the frames will sync within a minute.' },
  { id: 'share', priority: 'normal', title: 'How do I share a run?', from: 'Orbit', assignee: { initials: 'DA', color: 'var(--dm-pb)' }, waiting: '1h', status: 'open',
    question: 'Can I send an agent run to someone outside my team?',
    reply: 'Yes. Open the run, click Share, and turn on "Anyone with the link". They can view it without an account.' },
  { id: 'invoice', priority: 'low', title: 'Invoice address change', from: 'Kite Health', assignee: MAYA, waiting: '2d', status: 'done' }
];

export default function TicketListDemo() {
  const [open, setOpen] = useState<string | null>(null);
  // the preview opens the first ticket on its own, unless you take over first
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait }) => { await wait(1000); setOpen(o => o ?? 'export'); });
  return <div ref={ref} style={{ display: 'contents' }}><TicketList defaultTickets={TICKETS} open={open} onOpenChange={setOpen} onSend={() => new Promise(res => setTimeout(res, 700))} /></div>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `tickets` (optional) | `TicketListTicket[]` | The tickets. Leave it out to let Send and solve move them to Solved by itself |
| `defaultTickets` (optional) | `TicketListTicket[]` |  |
| `onTicketsChange` (optional) | `(tickets: TicketListTicket[]) => void` |  |
| `filter` (optional) | `TicketListStatus` | Which tickets show. Leave it out to let the switch change it |
| `defaultFilter` (optional) | `TicketListStatus` |  |
| `onFilterChange` (optional) | `(filter: TicketListStatus) => void` |  |
| `open` (optional) | `string \| null` | The id of the open ticket, or null. Leave it out to let the rows open and shut |
| `defaultOpen` (optional) | `string \| null` |  |
| `onOpenChange` (optional) | `(id: string \| null) => void` |  |
| `onSend` (optional) | `(ticket: TicketListTicket, reply: string) => void \| Promise<void>` | Sends the reply, edited or not. Return a promise and the button spins until it settles; then the ticket fades out and is solved |
| `title` (optional) | `string` |  |
| `filterLabels` (optional) | `Record<TicketListStatus, string>` | The switch's two labels |
| `emptyLabel` (optional) | `string` | Shown when no ticket matches the filter |
| `replyLabel` (optional) | `string` |  |
| `editLabel` (optional) | `string` |  |
| `sendLabel` (optional) | `string` |  |
| `className` (optional) | `string` |  |

## Questions

**Does the reply that gets sent include the person's edits?**

Yes. `onSend` receives the text currently in the reply box, edited or not. That text is also saved on the ticket when it moves to Solved.

**What happens if sending fails?**

If the promise from `onSend` rejects, the spinner stops and the ticket stays open, so the person can try again.

**How do I open the most urgent ticket for the person?**

Control `open` with `onOpenChange` and set it to that ticket's id. The example opens the urgent ticket a second after it loads.

## Source

`TicketList.tsx`, as `npx designme add ticket-list --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type AnimationEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Avatar, enter, Seg, Spin, Tip } from '../lib/motion';
import '../designme.css';
import './ticket-list.css';

export type TicketListPriority = 'urgent' | 'high' | 'normal' | 'low';
export type TicketListStatus = 'open' | 'done';

export interface TicketListTicket {
  id: string;
  /** What it is about, like "Figma frames not syncing" */
  title: string;
  /** Who asked, like "Lumen Labs" */
  from: string;
  /** What they wrote. Shown after the customer while the ticket is shut, and above the reply when it opens */
  question?: string;
  /** The reply the agent suggests. People can edit it before sending */
  reply?: string;
  /** The coloured dot in front: urgent red, high amber, normal accent, low grey */
  priority?: TicketListPriority;
  /** Who it is assigned to, shown as a small avatar */
  assignee: { initials: string; color: string };
  /** How long it has waited, like "4m" */
  waiting: string;
  status: TicketListStatus;
}

export interface TicketListProps {
  /** The tickets. Leave it out to let Send and solve move them to Solved by itself */
  tickets?: TicketListTicket[];
  defaultTickets?: TicketListTicket[];
  onTicketsChange?: (tickets: TicketListTicket[]) => void;
  /** Which tickets show. Leave it out to let the switch change it */
  filter?: TicketListStatus;
  defaultFilter?: TicketListStatus;
  onFilterChange?: (filter: TicketListStatus) => void;
  /** The id of the open ticket, or null. Leave it out to let the rows open and shut */
  open?: string | null;
  defaultOpen?: string | null;
  onOpenChange?: (id: string | null) => void;
  /** Sends the reply, edited or not. Return a promise and the button spins until it settles; then the ticket fades out and is solved */
  onSend?: (ticket: TicketListTicket, reply: string) => void | Promise<void>;
  title?: string;
  /** The switch's two labels */
  filterLabels?: Record<TicketListStatus, string>;
  /** Shown when no ticket matches the filter */
  emptyLabel?: string;
  replyLabel?: string;
  editLabel?: string;
  sendLabel?: string;
  className?: string;
}

const PRIORITY: Record<TicketListPriority, { label: string; color: string }> = {
  urgent: { label: 'Urgent', color: 'var(--dm-bad)' },
  high: { label: 'High', color: 'var(--dm-warn)' },
  normal: { label: 'Normal', color: 'var(--dm-accent)' },
  low: { label: 'Low', color: 'var(--dm-faint)' }
};

function Ticket({ ticket, index, isOpen, leaving, busy, onToggle, onSend, labels }: {
  ticket: TicketListTicket; index: number; isOpen: boolean; leaving: boolean; busy: boolean;
  onToggle: () => void; onSend: (reply: string) => void; labels: { reply: string; edit: string; send: string };
}) {
  // rows come in one after another, then drop the entrance so a later fade-out starts on time
  const [entering, setEntering] = useState(true);
  const text = useRef<HTMLDivElement>(null);
  const p = PRIORITY[ticket.priority ?? 'normal'];
  const edit = () => {
    const el = text.current; if (!el) return;
    el.focus();
    const sel = document.getSelection(); sel?.selectAllChildren(el); sel?.collapseToEnd();
  };
  return (
    <div className={cx('dm-tkx-t', isOpen && 'dm-open', entering && 'dm-enter', leaving && 'dm-leave')} style={entering ? enter(index * 40).style : undefined}
      onAnimationEnd={(e: AnimationEvent) => { if (e.target === e.currentTarget && entering) setEntering(false); }}>
      <button type="button" className="dm-tkx-r" aria-expanded={isOpen} onClick={leaving ? undefined : onToggle}>
        <Tip label={p.label}><span className="dm-pr"><span className="dm-dot" style={{ color: p.color }} /></span></Tip>
        <span className="dm-t"><b>{ticket.title}</b><span>{ticket.from}{ticket.question && !isOpen ? ' · ' + ticket.question : ''}</span></span>
        <span className="dm-m"><span className="dm-w">{ticket.waiting}</span><Avatar initials={ticket.assignee.initials} color={ticket.assignee.color} /></span>
      </button>
      {isOpen && (
        <div className="dm-tkx-d">
          <div className="dm-tkx-q dm-enter" style={enter(0).style}>{ticket.question}</div>
          <div className="dm-tkx-s dm-enter" style={enter(50).style}>
            <div className="dm-lb"><Icon name="spark" size="xs" />{labels.reply}</div>
            <div ref={text} className="dm-tx" contentEditable suppressContentEditableWarning spellCheck={false}>{ticket.reply}</div>
          </div>
          <div className="dm-tkx-a dm-enter" style={enter(100).style}>
            <button type="button" className="dm-pill dm-ghost dm-sm" onClick={edit}><Icon name="edit" size="xs" />{labels.edit}</button>
            <button type="button" className="dm-pill dm-accent dm-sm" aria-busy={busy} onClick={() => { if (!busy) onSend(text.current?.textContent ?? ticket.reply ?? ''); }}>
              {busy ? <Spin /> : <><Icon name="send" size="xs" />{labels.send}</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Support tickets the agent has triaged, with suggested replies. */
export function TicketList({ tickets, defaultTickets = [], onTicketsChange, filter, defaultFilter = 'open', onFilterChange, open, defaultOpen = null, onOpenChange, onSend,
  title = 'Support', filterLabels = { open: 'Open', done: 'Solved' }, emptyLabel = 'All caught up', replyLabel = 'Suggested reply', editLabel = 'Edit', sendLabel = 'Send and solve', className }: TicketListProps) {
  const [list, setList] = useControllable(tickets, defaultTickets, onTicketsChange);
  const [shown, setShown] = useControllable(filter, defaultFilter, onFilterChange);
  const [openId, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [busy, setBusy] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<string | null>(null);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);
  // the latest list, for when a send settles after other changes
  const latest = useRef(list);
  useEffect(() => { latest.current = list; });

  const send = async (t: TicketListTicket, reply: string) => {
    setBusy(t.id);
    try { await onSend?.(t, reply); } catch { if (alive.current) setBusy(null); return; }
    if (!alive.current) return;
    setLeaving(t.id);
    await new Promise(res => setTimeout(res, 330));
    if (!alive.current) return;
    setBusy(null); setLeaving(null); setOpen(null);
    setList(latest.current.map(x => x.id === t.id ? { ...x, status: 'done', reply } : x));
  };
  const rows = list.filter(t => t.status === shown);

  return (
    <div data-dm="" className={cx('dm-tkx dm-panel', className)}>
      <div className="dm-tkx-h">
        <b>{title}</b>
        <Seg className="dm-tkx-sg" label="Filter" value={shown} onChange={v => { setOpen(null); setShown(v); }}
          options={[{ value: 'open', label: filterLabels.open }, { value: 'done', label: filterLabels.done }]} />
      </div>
      {/* a new filter brings its rows in again */}
      <div className="dm-tkx-list" key={shown}>
        {rows.length ? rows.map((t, i) => (
          <Ticket key={t.id} ticket={t} index={i} isOpen={openId === t.id} leaving={leaving === t.id} busy={busy === t.id}
            onToggle={() => setOpen(openId === t.id ? null : t.id)} onSend={reply => send(t, reply)}
            labels={{ reply: replyLabel, edit: editLabel, send: sendLabel }} />
        )) : <div className="dm-tkx-e">{emptyLabel}</div>}
      </div>
    </div>
  );
}
```

## More in Collaboration

- [Comments](https://designme.dev/components/comments.md): A design thread where you can @mention the agent and it replies.
- [Notifications](https://designme.dev/components/notifications.md): An inbox where agent updates and mentions arrive live.
- [Invite to collaborate](https://designme.dev/components/invite-to-collaborate.md): Add teammates by email as chips, set their role, send.
- [Reactions](https://designme.dev/components/reactions.md): Quick reactions on an agent update, with counts that pop.
- [Profile menu](https://designme.dev/components/profile-menu.md): The account menu behind an avatar: switch workspace, theme, shortcuts and sign out.
- [Filter menu](https://designme.dev/components/filter-menu.md): Add filters from a menu, see them as chips, and watch the count change.
- [Kanban board](https://designme.dev/components/kanban-board.md): A board where you and the agent move cards, with drag and drop.

All components: https://designme.dev/llms.txt
