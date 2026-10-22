# Notifications

> An inbox where agent updates and mentions arrive live.

App basics / Collaboration. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/notifications

## Install

```sh
npx designme add notifications          # HTML, CSS and JS, with the shared core
npx designme add notifications --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Notifications is an inbox panel where updates from the agent and mentions from people arrive in one list. New items drop in at the top and bump the unread count, and tabs split the list into All, Agent and Mentions. A person clicks an item to mark it read or unread, or clears everything at once with Mark all read.

### When to use it

- When background agent runs finish, pause or need review while the person is elsewhere
- When agent updates and teammates' mentions should share one inbox but stay easy to separate
- When a header bell or side panel needs a list with a live unread count
- When an agent stops at a limit and the person has to hear about it

### What it does

- Agent items show an `icon` on a tile tinted with its `color`; people's items show an `avatar` with initials.
- A new id at the top of `items` drops in on its own and makes the unread count bump.
- The filter switch shows all items or only those whose `kind` matches, and you can supply your own `filters`.
- Clicking an item toggles `read`, and the change comes back through `onItemsChange`.
- Mark all read marks every item read, and the unread dots in view clear one row after another.
- An empty filter shows `emptyLabel`, which defaults to "Nothing here yet".

### Accessibility

- The unread count has an `aria-label` like "3 unread".
- Each item is a button whose `aria-pressed` reports whether it has been read.
- The filter is a `group` labelled Filter, and each option reports `aria-pressed`.

## Usage in React

```tsx
import { Notifications } from '@/components/designme/notifications/Notifications';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { Notifications, type NotificationsItem } from './Notifications';
import { useScript } from '../lib/useScript';

/* ---------- Notifications: an inbox where two new items arrive while you watch ---------- */
const START: NotificationsItem[] = [
  { id: 'audit', kind: 'agent', icon: 'ok', color: 'var(--dm-ok)', text: <><b>Pricing audit</b> finished. 2 fixes ready to review</>, time: '4 min ago' },
  { id: 'maya', kind: 'mention', avatar: { initials: 'MK', color: 'var(--dm-pl)' }, text: <><b>Maya</b> mentioned you in Checkout flow</>, time: '20 min ago' },
  { id: 'export', kind: 'agent', icon: 'alert', color: 'var(--dm-warn)', text: <><b>Token export</b> paused at the $5 cap</>, time: '1 hour ago' },
  { id: 'jon', kind: 'mention', avatar: { initials: 'JO', color: 'var(--dm-pm)' }, text: <><b>Jon</b> asked for your review on PR #284</>, time: '2 hours ago', read: true }
];
const INCOMING: NotificationsItem[] = [
  { id: 'qa', kind: 'agent', icon: 'spark', color: 'var(--dm-accent)', text: <><b>Weekly design QA</b> started on 12 frames</>, time: 'Just now' },
  { id: 'ari', kind: 'mention', avatar: { initials: 'AR', color: 'var(--dm-pp)' }, text: <><b>Ari</b> replied: “Looks great, ship it”</>, time: 'Just now' }
];

export default function NotificationsDemo() {
  const [items, setItems] = useState(START);
  useScript(async ({ wait }) => {
    await wait(2200);
    for (const x of INCOMING) { setItems(xs => [x, ...xs]); await wait(2600); }
  });
  return (
    <div style={{ width: '100%' }}>
      <Notifications items={items} onItemsChange={setItems} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `items` (optional) | `NotificationsItem[]` | Newest first. A new id at the top drops in and bumps the count |
| `defaultItems` (optional) | `NotificationsItem[]` |  |
| `onItemsChange` (optional) | `(items: NotificationsItem[]) => void` | Called when items are read or unread, one at a time or all at once |
| `filters` (optional) | `NotificationsFilter[]` |  |
| `filter` (optional) | `string` | The open filter. Leave it out to let the switch change it |
| `defaultFilter` (optional) | `string` |  |
| `onFilterChange` (optional) | `(filter: string) => void` |  |
| `title` (optional) | `string` |  |
| `markAllLabel` (optional) | `string` |  |
| `emptyLabel` (optional) | `string` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I push a new notification in while the inbox is open?**

Control it with `items` and `onItemsChange`, and add the new item to the front of the array with an id it has not seen. It drops in at the top and the count bumps.

**Can I add my own filter, like Billing?**

Yes. Pass `filters` with a `value` and `label` for each tab, and give items the matching `kind`. The value 'all' always shows everything.

**How do I bold the subject of a notification?**

`text` takes React nodes, so wrap the subject in `<b>`, like `<><b>Pricing audit</b> finished</>`.

## Source

`Notifications.tsx`, as `npx designme add notifications --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Avatar, enter, Seg } from '../lib/motion';
import '../designme.css';
import './notifications.css';

export interface NotificationsItem {
  id: string;
  /** Which filter it belongs to, like 'agent' or 'mention' */
  kind: string;
  /** What happened. Wrap the subject in <b>, like <><b>Pricing audit</b> finished</> */
  text: ReactNode;
  /** Like "4 min ago" */
  time: string;
  /** An icon on a tinted tile, for things the agent did */
  icon?: IconName;
  /** The icon's colour, like 'var(--dm-ok)' */
  color?: string;
  /** An avatar instead of an icon, for people */
  avatar?: { initials: string; color: string };
  read?: boolean;
}

export interface NotificationsFilter {
  /** 'all' shows everything; anything else shows the items of that kind */
  value: string;
  label: string;
}

export interface NotificationsProps {
  /** Newest first. A new id at the top drops in and bumps the count */
  items?: NotificationsItem[];
  defaultItems?: NotificationsItem[];
  /** Called when items are read or unread, one at a time or all at once */
  onItemsChange?: (items: NotificationsItem[]) => void;
  filters?: NotificationsFilter[];
  /** The open filter. Leave it out to let the switch change it */
  filter?: string;
  defaultFilter?: string;
  onFilterChange?: (filter: string) => void;
  title?: string;
  markAllLabel?: string;
  emptyLabel?: string;
  className?: string;
}

const FILTERS: NotificationsFilter[] = [{ value: 'all', label: 'All' }, { value: 'agent', label: 'Agent' }, { value: 'mention', label: 'Mentions' }];

/** An inbox where agent updates and mentions arrive live. Click one to mark it read or unread. */
export function Notifications({ items, defaultItems = [], onItemsChange, filters = FILTERS, filter, defaultFilter = 'all', onFilterChange, title = 'Inbox', markAllLabel = 'Mark all read', emptyLabel = 'Nothing here yet', className }: NotificationsProps) {
  const [list, setList] = useControllable(items, defaultItems, onItemsChange);
  const [cur, setCur] = useControllable(filter, defaultFilter, onFilterChange);
  const shown = list.filter(x => cur === 'all' || x.kind === cur);
  const unread = list.filter(x => !x.read).length;

  // the rows painted together (on first show and on each filter) stagger in; ones that arrive later drop in on their own
  const [paint, setPaint] = useState(() => ({ filter: cur, ids: shown.map(x => x.id) }));
  if (paint.filter !== cur) setPaint({ filter: cur, ids: shown.map(x => x.id) });
  // a new item bumps the count
  const [known, setKnown] = useState(() => new Set(list.map(x => x.id)));
  const [bump, setBump] = useState(0);
  const fresh = list.filter(x => !known.has(x.id));
  if (fresh.length) { setKnown(new Set([...known, ...fresh.map(x => x.id)])); setBump(b => b + 1); }

  // Mark all read clears the dots one row after another
  const [pending, setPending] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const markAll = () => {
    const rows = shown.filter(x => !x.read).map(x => x.id);
    setPending(rows);
    rows.forEach((id, i) => timers.current.push(setTimeout(() => setPending(p => p.filter(x => x !== id)), i * 50)));
    setList(list.map(x => (x.read ? x : { ...x, read: true })));
  };
  const toggle = (id: string) => setList(list.map(x => (x.id === id ? { ...x, read: !x.read } : x)));

  return (
    <div data-dm="" className={cx('dm-ntx dm-panel', className)}>
      <div className="dm-ntx-h">
        <b>{title}</b>
        <span key={bump} className={cx('dm-ntx-ct dm-num', !unread && 'dm-z', bump > 0 && 'dm-bump')} aria-label={`${unread} unread`}>{unread}</span>
        <span className="dm-ntx-sp" />
        <button type="button" className="dm-pill dm-ghost dm-sm dm-ntx-all" onClick={markAll}>{markAllLabel}</button>
      </div>
      <div className="dm-ntx-tabs"><Seg label="Filter" value={cur} onChange={setCur} options={filters} /></div>
      <div key={paint.filter} className="dm-ntx-list">
        {shown.length ? shown.map(x => {
          const at = paint.ids.indexOf(x.id), e = at >= 0 ? enter(at * 40) : null;
          return (
            <button type="button" key={x.id} className={cx('dm-ntx-n', x.read && !pending.includes(x.id) && 'dm-read', e ? e.className : 'dm-new')} style={e?.style}
              aria-pressed={!!x.read} onClick={() => toggle(x.id)}>
              <span className="dm-ic" style={x.avatar ? undefined : { color: x.color, background: `color-mix(in srgb,${x.color ?? 'currentColor'} 13%,transparent)` }}>
                {x.avatar ? <Avatar initials={x.avatar.initials} color={x.avatar.color} /> : <Icon name={x.icon ?? 'bell'} size="xs" />}
              </span>
              <span className="dm-t">{x.text}<span>{x.time}</span></span>
              <span className="dm-u" />
            </button>
          );
        }) : <div className="dm-ntx-e">{emptyLabel}</div>}
      </div>
    </div>
  );
}
```

## More in Collaboration

- [Comments](https://designme.dev/components/comments.md): A design thread where you can @mention the agent and it replies.
- [Invite to collaborate](https://designme.dev/components/invite-to-collaborate.md): Add teammates by email as chips, set their role, send.
- [Reactions](https://designme.dev/components/reactions.md): Quick reactions on an agent update, with counts that pop.
- [Ticket list](https://designme.dev/components/ticket-list.md): Support tickets the agent has triaged, with suggested replies.
- [Kanban board](https://designme.dev/components/kanban-board.md): A board where you and the agent move cards, with drag and drop.

All components: https://designme.dev/llms.txt
