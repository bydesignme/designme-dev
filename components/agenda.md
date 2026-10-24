# Agenda

> Today's schedule with a live now line and agent prep notes.

App basics / Dates. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/agenda

## Install

```sh
npx designme add agenda          # HTML, CSS and JS, with the shared core
npx designme add agenda --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Agenda lists today's events in time order, with a line that marks where now falls in the day. When a person opens an event, the notes the agent prepared for it slide in underneath, along with an optional action such as joining the call. It suits an assistant that gets people ready for their meetings.

### When to use it

- When an assistant prepares briefing notes before each meeting
- When a home screen should show what is left of today at a glance
- When a person needs a join or open button next to the context for a call
- When past events should stay visible but step back from the ones still to come

### What it does

- Each row shows the time, title, a quiet detail line and avatars for the people attending.
- Items marked `past` fade back, and the now line with the `now` time sits right after the last past item.
- Opening an item reveals its `notes` one by one; items without notes do not open.
- An `action` adds a pill at the end of the notes, like "Join in 48 min", that calls its own `onClick` without closing the row.
- Only one item is open at a time, and you can control which with `open` and `onOpenChange` or let each row toggle itself.
- The corner tag counts the events for you unless you pass your own `count` text.

### Accessibility

- Each event is a native button, so it is reachable with Tab and opens with Enter or Space.
- Events that have notes carry `aria-expanded`, which reports whether their notes are open.
- Attendee avatars are marked `aria-hidden`, so screen readers skip the initials.

## Usage in React

```tsx
import { Agenda } from '@/components/designme/agenda/Agenda';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { Agenda, type AgendaItem } from './Agenda';
import { useStory } from '../lib/useScript';

const P = {
  MK: { initials: 'MK', color: 'var(--dm-pl)' }, JO: { initials: 'JO', color: 'var(--dm-pm)' }, AR: { initials: 'AR', color: 'var(--dm-pp)' },
  SL: { initials: 'SL', color: 'var(--dm-pt)' }, DK: { initials: 'DK', color: 'var(--dm-pb)' }
};
const ITEMS: AgendaItem[] = [
  { key: 'standup', time: '9:00', title: 'Standup', detail: '15 min, Design team', people: [P.MK, P.JO, P.AR], past: true },
  { key: 'demo', time: '11:30', title: 'Agent demo', detail: '30 min, Zoom', people: [P.SL, P.MK],
    notes: ['Demo flow: pricing audit, then the token export', 'Sam asked about cost limits last time, the cap is now $5'], action: { label: 'Join in 48 min' } },
  { key: 'pricing', time: '1:00', title: 'Pricing workshop', detail: '90 min, Room 4', people: [P.JO, P.AR, P.DK, P.MK],
    notes: ['Trial to paid is up 8.1 pts since Sep 18', 'Open question: show monthly price crossed out on mobile too?', '3 frames ready to review in Figma'] },
  { key: 'maya', time: '4:00', title: '1:1 with Maya', detail: '30 min', people: [P.MK],
    notes: ['She wanted feedback on the checkout copy', 'Library publish is waiting on her approval'] }
];

export default function AgendaDemo() {
  const [open, setOpen] = useState<string | null>(null);
  // a moment in, the agent opens its notes for the next big meeting
  // the preview opens one meeting on its own, unless you take over first
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait }) => { await wait(1000); setOpen('pricing'); });
  return <div ref={ref} style={{ width: '100%' }}><Agenda items={ITEMS} subtitle="Monday, Oct 19" now="10:42" open={open} onOpenChange={setOpen} /></div>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `items` | `AgendaItem[]` |  |
| `title` (optional) | `string` | Like "Today" |
| `subtitle` (optional) | `string` | Under the title, like "Monday, Oct 19" |
| `count` (optional) | `string` | The tag in the corner. Defaults to "4 events" |
| `now` (optional) | `string` | The time on the now line, like "10:42". Leave it out for no line |
| `open` (optional) | `string \| null` | The item whose notes are open, by key. Leave it out to let each item toggle |
| `defaultOpen` (optional) | `string \| null` |  |
| `onOpenChange` (optional) | `(key: string \| null) => void` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I have the agent open its notes for the next meeting on its own?**

Control the component with `open` and `onOpenChange`, then set `open` to that item's key when the agent is ready. The example on this page does exactly that a moment after it loads.

**Where does the now line go?**

It goes after the last item marked `past`, labelled with the `now` string you pass. Leave `now` out and no line is drawn.

**Can the notes contain links or formatted text?**

Yes. `notes` is an array of React nodes, so each note can be plain text or your own markup. Each note gets a small spark icon in front.

## Source

`Agenda.tsx`, as `npx designme add agenda --react` installs it:

```tsx
'use client';
import type { ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Avatar, enter } from '../lib/motion';
import '../designme.css';
import './agenda.css';

export interface AgendaPerson {
  /** Like "MK" */
  initials: string;
  /** The avatar's colour, like 'var(--dm-pl)' */
  color: string;
}

export interface AgendaItem {
  /** Identifies the item for `open`. Defaults to its title */
  key?: string;
  /** Like "11:30" */
  time: string;
  /** Like "Agent demo" */
  title: string;
  /** The quiet line under the title, like "30 min, Zoom" */
  detail?: string;
  people?: AgendaPerson[];
  /** Already over: the item fades back, and the now line sits after the last one */
  past?: boolean;
  /** What the agent prepared, shown when the item opens. Items without notes don't open */
  notes?: ReactNode[];
  /** A button at the end of the notes, like "Join in 48 min" */
  action?: { label: string; onClick?: () => void };
}

export interface AgendaProps {
  items: AgendaItem[];
  /** Like "Today" */
  title?: string;
  /** Under the title, like "Monday, Oct 19" */
  subtitle?: string;
  /** The tag in the corner. Defaults to "4 events" */
  count?: string;
  /** The time on the now line, like "10:42". Leave it out for no line */
  now?: string;
  /** The item whose notes are open, by key. Leave it out to let each item toggle */
  open?: string | null;
  defaultOpen?: string | null;
  onOpenChange?: (key: string | null) => void;
  className?: string;
}

const keyOf = (item: AgendaItem) => item.key ?? item.title;

/** Today's events in order, with a line for now. Open one to see what the agent prepared for it. */
export function Agenda({ items, title = 'Today', subtitle, count, now, open, defaultOpen = null, onOpenChange, className }: AgendaProps) {
  const [opened, setOpened] = useControllable(open, defaultOpen, onOpenChange);
  // the now line goes after the last item that is over
  const lastPast = items.reduce((at, item, i) => item.past ? i : at, -1);
  // rows and the now line stagger in together, in the order they sit
  let n = 0;
  const row = (item: AgendaItem) => {
    const k = keyOf(item), isOpen = opened === k && !!item.notes?.length;
    const notes = item.notes ?? [];
    return (
      <button key={k} type="button" className={cx('dm-agx-e', item.past && 'dm-past', isOpen && 'dm-open', enter().className)} style={enter(n++ * 60).style}
        aria-expanded={notes.length ? isOpen : undefined} onClick={() => setOpened(isOpen || !notes.length ? null : k)}>
        <span className="dm-tm dm-num">{item.time}</span>
        <span className="dm-bar" />
        <span className="dm-t">
          <b>{item.title}</b>
          {item.detail && <span>{item.detail}</span>}
          {item.people?.length ? <span className="dm-who">{item.people.map((p, j) => <Avatar key={j} initials={p.initials} color={p.color} />)}</span> : null}
        </span>
        {isOpen && (
          <div className="dm-agx-prep">
            {notes.map((t, j) => <div key={j} {...enter(j * 60)}><Icon name="spark" size="xs" /><span>{t}</span></div>)}
            {item.action && <span className="dm-pill dm-accent dm-sm dm-agx-join dm-enter" style={enter(notes.length * 60).style}
              onClick={e => { if (item.action?.onClick) { e.stopPropagation(); item.action.onClick(); } }}>{item.action.label}</span>}
          </div>
        )}
      </button>
    );
  };

  return (
    <div data-dm="" className={cx('dm-agx dm-panel', className)}>
      <div className="dm-agx-h">
        <div><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div>
        <span className="dm-tag dm-b">{count ?? `${items.length} ${items.length === 1 ? 'event' : 'events'}`}</span>
      </div>
      <div className="dm-agx-list">
        {items.flatMap((item, i) => {
          const out = [row(item)];
          if (now && i === lastPast) out.push(<div key="now" className="dm-agx-now dm-enter" style={enter(n++ * 60).style}><i />{now}</div>);
          return out;
        })}
      </div>
    </div>
  );
}
```

## More in Dates

- [Date picker](https://designme.dev/components/date-picker.md): A field that opens a calendar, with quick picks and natural language.
- [Segmented control](https://designme.dev/components/segmented-control.md): Switch between views of the same thing, with a sliding indicator.
- [Date range picker](https://designme.dev/components/date-range-picker.md): Pick a start and end across two months, or use a preset.
- [Event calendar](https://designme.dev/components/event-calendar.md): A week view where the agent finds a free slot for you.

All components: https://designme.dev/llms.txt
