# Event calendar

> A week view where the agent finds a free slot for you.

App basics / Dates. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/event-calendar

## Install

```sh
npx designme add event-calendar          # HTML, CSS and JS, with the shared core
npx designme add event-calendar --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

A work-week calendar where people drag events to a new time or day, click free time to add one, and open any event for its details. An agent button in the header asks your agent to find a slot, and the slots it suggests appear as outlined blocks with Book and Other. It shows scheduling help from an agent right inside the calendar people already use.

### When to use it

- When an agent schedules meetings or finds free time for a team.
- When people need to move and add events in a simple week view without a full calendar app.
- When the agent can prepare something for a meeting, such as prep notes, from the event itself.

### What it does

- Shows `days` columns from `week` (5 by default) and `hours` rows from `startHour` (9am to 5pm by default), with a today mark and a now line when `now` is set.
- Dragging an event moves it to another time or day in 15-minute steps; a click without moving opens its details card.
- Hovering free time shows a "+ New event" slot, and clicking it adds an event, from `newEvent`, with a box to name it; Save keeps it and Discard removes it.
- The details card shows the time and the people invited, plus Prep notes when `onPrepNotes` is set ("Writing" shows until a returned promise settles) and Join when `onJoin` is set.
- With `onAsk`, the header gets the agent's button; while `finding` is true it shows a thinking mark and a scan line sweeps the week.
- `suggestions` draw as outlined blocks; the first is the pick, with Book (`onBook`) and, while there are more, Other (`onSkip`). The header line reports the last move or addition, or your own `status`.

### Accessibility

- The details card is a role="dialog" labelled "Event", and it is inert while closed.
- Escape closes the details card; in a new event's title box, Enter saves and Escape discards.
- The title box is labelled "Event title", and the card's close button is labelled "Close".

## Usage in React

```tsx
import { EventCalendar } from '@/components/designme/event-calendar/EventCalendar';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useCallback, useRef, useState } from 'react';
import { EventCalendar, type EventCalendarEvent, type EventCalendarPerson, type EventCalendarSuggestion, type EventCalendarTone } from './EventCalendar';
import { useScript, useWait } from '../lib/useScript';

const WEEK = new Date(2026, 9, 19);
const at = (day: number, hour: number) => new Date(2026, 9, 19 + day, Math.floor(hour), Math.round((hour % 1) * 60));
const WHO: EventCalendarPerson[] = [{ initials: 'MK', color: 'var(--dm-pl)' }, { initials: 'JO', color: 'var(--dm-pm)' }, { initials: 'DA', color: 'var(--dm-pb)' }, { initials: 'AR', color: 'var(--dm-pp)' }];
// two to four people, the way the site picks them
const people = (title: string) => WHO.slice(0, 2 + title.length % 3);
const EVENTS: [number, number, number, string, EventCalendarTone][] = [
  [0, 9, 1, 'Standup', 'blue'], [0, 13, 1.5, 'Pricing workshop', 'orange'], [1, 10, 1, '1:1 with Maya', 'purple'], [1, 14, 2, 'Focus: checkout', 'teal'],
  [2, 9, 1, 'Standup', 'blue'], [2, 11.5, 1, 'Agent demo', 'yellow'], [3, 9, 1, 'Standup', 'blue'], [3, 12, 1, 'Lunch & learn', 'green'],
  [3, 15, 1.5, 'Launch review', 'red'], [4, 10, 1.5, 'Planning', 'orange']
];
const START: EventCalendarEvent[] = EVENTS.map(([d, h, len, title, tone], i) => ({ id: 'e' + i, title, start: at(d, h), end: at(d, h + len), tone, people: people(title) }));
const SLOTS: EventCalendarSuggestion[] = [
  { id: 'wed', title: 'Design review', start: at(2, 13.5), end: at(2, 14.25) },
  { id: 'fri', title: 'Design review', start: at(4, 13), end: at(4, 13.75) }
];

export default function EventCalendarDemo() {
  const [events, setEvents] = useState(START);
  const [suggestions, setSuggestions] = useState<EventCalendarSuggestion[]>([]);
  const [finding, setFinding] = useState(false);
  const [label, setLabel] = useState('Find 45 min for a design review');
  const skipped = useRef(false);
  const wait = useWait();

  // the agent checks everyone's calendar, then suggests the best slot with one more behind it
  const ask = useCallback(async () => {
    setSuggestions([]); skipped.current = false;
    setFinding(true); setLabel('Checking 4 calendars');
    await wait(1300);
    setSuggestions(SLOTS); setFinding(false); setLabel('Everyone is free Wed 1:30');
  }, [wait]);
  useScript(async ({ wait }) => { await wait(1200); await ask(); });

  return (
    <div style={{ width: '100%' }}>
      <EventCalendar week={WEEK} now={new Date(2026, 9, 19, 10, 42)} events={events} onEventsChange={setEvents}
        newEvent={{ tone: 'pink', people: people('New event') }}
        onPrepNotes={() => wait(1200).then(() => "Notes ready: last week's decisions and 3 open questions.")} onJoin={() => {}}
        askLabel={label} onAsk={ask} finding={finding} suggestions={suggestions}
        onBook={s => {
          setEvents(es => [...es, { id: s.id + '-booked', title: s.title, start: s.start, end: s.end, tone: 'blue', people: people(s.title) }]);
          setSuggestions([]); setLabel(skipped.current ? 'Booked Fri 1:00, invites sent' : 'Booked, invites sent to 4 people');
        }}
        onSkip={() => { skipped.current = true; setSuggestions(ss => ss.slice(1)); setLabel('Next best: Fri 1:00'); }} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `events` (optional) | `EventCalendarEvent[]` | The events. Dragging moves them, clicking free time adds one, the details card names or removes it |
| `defaultEvents` (optional) | `EventCalendarEvent[]` |  |
| `onEventsChange` (optional) | `(events: EventCalendarEvent[]) => void` |  |
| `week` | `Date` | The first day shown, like Monday Oct 19. Its time of day is ignored |
| `days` (optional) | `number` | How many days to show, from `week`. Defaults to 5 |
| `startHour` (optional) | `number` | The first hour on the grid, 9 for 9am |
| `hours` (optional) | `number` | How many hours the grid shows. Defaults to 8 (9am to 5pm) |
| `title` (optional) | `string` | The heading. Defaults to the dates shown, like "Oct 19 – 23, 2026" |
| `now` (optional) | `Date` | Marks today and draws the now line. Leave it out for neither |
| `selected` (optional) | `string \| null` | The event whose details card is open |
| `defaultSelected` (optional) | `string \| null` |  |
| `onSelectedChange` (optional) | `(id: string \| null) => void` |  |
| `newEvent` (optional) | `{ tone?: EventCalendarTone; people?: EventCalendarPerson[]; hours?: number }` | What an event added by clicking free time starts with. Defaults to a pink, one hour event |
| `onPrepNotes` (optional) | `(event: EventCalendarEvent) => ReactNode \| Promise<ReactNode>` | Adds Prep notes to the details card. Return the notes, or a promise of them; "Writing" shows until it settles |
| `onJoin` (optional) | `(event: EventCalendarEvent) => void` | Adds Join to the details card |
| `askLabel` (optional) | `string` | Adds the agent's button to the header, like "Find 45 min for a design review" |
| `onAsk` (optional) | `() => void` |  |
| `finding` (optional) | `boolean` | The agent is looking: its button thinks and a scan line sweeps the week |
| `suggestions` (optional) | `EventCalendarSuggestion[]` | Slots the agent suggests. The first is the pick, the rest wait dimmed behind it |
| `onBook` (optional) | `(suggestion: EventCalendarSuggestion) => void` | Book on the picked suggestion. Add the event and clear the suggestions |
| `onSkip` (optional) | `(suggestion: EventCalendarSuggestion) => void` | Other on the picked suggestion, shown while there are more. Drop it and the next one becomes the pick |
| `status` (optional) | `string` | The quiet line in the header. Defaults to what the person last did, like "Moved Standup to Wed 1:15" |
| `className` (optional) | `string` |  |

## Questions

**Does the calendar find free slots by itself?**

No. `onAsk` tells you the person pressed the agent's button. Set `finding` to true while your agent looks, then pass what it found as `suggestions` and set `finding` back to false.

**What should Book and Other do?**

`onBook` gets the picked suggestion: add it to `events` and clear `suggestions`. `onSkip` gets the one being skipped: drop it from `suggestions` and the next one becomes the pick.

**How do I save events after someone drags or adds one?**

Pass `events` and `onEventsChange`. Every move, new event, rename and removal comes back as the full updated list, with times as local Dates.

**Can I show a full week or longer hours?**

Yes. Set `days` to 7 for a full week, and `startHour` and `hours` for the time range, like `startHour={8}` and `hours={10}` for 8am to 6pm.

## Source

`EventCalendar.tsx`, as `npx designme add event-calendar --react` installs it:

```tsx
'use client';
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Avatar, enter, Swap, Think, Tip } from '../lib/motion';
import '../designme.css';
import './event-calendar.css';

export type EventCalendarTone = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

export interface EventCalendarPerson {
  /** Like "MK" */
  initials: string;
  /** The avatar's colour, like 'var(--dm-pl)' */
  color: string;
}

export interface EventCalendarEvent {
  id: string;
  /** Like "Pricing workshop". An empty title reads "New event" and opens with a box to name it */
  title: string;
  /** Read in the browser's local time */
  start: Date;
  end: Date;
  /** The block's colour. Defaults to blue */
  tone?: EventCalendarTone;
  /** Who is invited, shown in the details card */
  people?: EventCalendarPerson[];
}

/** A free slot the agent found, drawn as an outlined block with Book (and Other while there are more) */
export interface EventCalendarSuggestion {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export interface EventCalendarProps {
  /** The events. Dragging moves them, clicking free time adds one, the details card names or removes it */
  events?: EventCalendarEvent[];
  defaultEvents?: EventCalendarEvent[];
  onEventsChange?: (events: EventCalendarEvent[]) => void;
  /** The first day shown, like Monday Oct 19. Its time of day is ignored */
  week: Date;
  /** How many days to show, from `week`. Defaults to 5 */
  days?: number;
  /** The first hour on the grid, 9 for 9am */
  startHour?: number;
  /** How many hours the grid shows. Defaults to 8 (9am to 5pm) */
  hours?: number;
  /** The heading. Defaults to the dates shown, like "Oct 19 – 23, 2026" */
  title?: string;
  /** Marks today and draws the now line. Leave it out for neither */
  now?: Date;
  /** The event whose details card is open */
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  /** What an event added by clicking free time starts with. Defaults to a pink, one hour event */
  newEvent?: { tone?: EventCalendarTone; people?: EventCalendarPerson[]; hours?: number };
  /** Adds Prep notes to the details card. Return the notes, or a promise of them; "Writing" shows until it settles */
  onPrepNotes?: (event: EventCalendarEvent) => ReactNode | Promise<ReactNode>;
  /** Adds Join to the details card */
  onJoin?: (event: EventCalendarEvent) => void;
  /** Adds the agent's button to the header, like "Find 45 min for a design review" */
  askLabel?: string;
  onAsk?: () => void;
  /** The agent is looking: its button thinks and a scan line sweeps the week */
  finding?: boolean;
  /** Slots the agent suggests. The first is the pick, the rest wait dimmed behind it */
  suggestions?: EventCalendarSuggestion[];
  /** Book on the picked suggestion. Add the event and clear the suggestions */
  onBook?: (suggestion: EventCalendarSuggestion) => void;
  /** Other on the picked suggestion, shown while there are more. Drop it and the next one becomes the pick */
  onSkip?: (suggestion: EventCalendarSuggestion) => void;
  /** The quiet line in the header. Defaults to what the person last did, like "Moved Standup to Wed 1:15" */
  status?: string;
  className?: string;
}

const PX = 44;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TONE: Record<EventCalendarTone, string> = { blue: 'pb', purple: 'pl', green: 'pm', orange: 'pp', red: 'pr', yellow: 'py', pink: 'pk', teal: 'pt' };

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const dayIndex = (week: Date, d: Date) => Math.round((addDays(d, 0).getTime() - addDays(week, 0).getTime()) / 864e5);
const hourOf = (d: Date) => d.getHours() + d.getMinutes() / 60;
const at = (week: Date, day: number, hour: number) => new Date(week.getFullYear(), week.getMonth(), week.getDate() + day, Math.floor(hour), Math.round((hour % 1) * 60));
/** 13.5 → "1:30", the way the site writes times */
const tm = (h: number) => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60); return `${hh > 12 ? hh - 12 : hh}:${String(mm).padStart(2, '0')}`; };
const tint = (tone: EventCalendarTone = 'blue'): CSSProperties => ({ background: `var(--dm-${TONE[tone]}-bg)`, color: `var(--dm-${TONE[tone]})` });
const named = (e: EventCalendarEvent) => e.title || 'New event';

/** The details card: who is coming and what to do, or a box to name a new event */
function Details({ event, onClose, onSave, onDiscard, onPrepNotes, onJoin }: {
  event: EventCalendarEvent; onClose: () => void; onSave: (title: string) => void; onDiscard: () => void;
  onPrepNotes?: EventCalendarProps['onPrepNotes']; onJoin?: EventCalendarProps['onJoin'];
}) {
  const fresh = !event.title;
  const input = useRef<HTMLInputElement>(null);
  const [prep, setPrep] = useState<'idle' | 'writing' | 'done'>('idle');
  const [note, setNote] = useState<ReactNode>(null);
  useEffect(() => { if (fresh) input.current?.focus({ preventScroll: true }); }, [fresh]);
  const write = async () => {
    if (!onPrepNotes || prep !== 'idle') return;
    setPrep('writing');
    const n = await onPrepNotes(event);
    setNote(n); setPrep('done');
  };
  const key = (k: KeyboardEvent<HTMLInputElement>) => { if (k.key === 'Enter') onSave(k.currentTarget.value); if (k.key === 'Escape') onDiscard(); };
  const h = hourOf(event.start), end = hourOf(event.end), people = event.people ?? [];
  return (
    <>
      <div className="dm-ecx-ph">
        <i style={{ background: `var(--dm-${TONE[event.tone ?? 'blue']})` }} />
        {fresh ? <input ref={input} className="dm-ecx-ti" placeholder="Add a title" aria-label="Event title" onKeyDown={key} /> : <b>{event.title}</b>}
        <Tip label="Close"><button type="button" className="dm-ib" aria-label="Close" onClick={onClose}><Icon name="x" size="xs" /></button></Tip>
      </div>
      <div className="dm-ecx-pt">{DAYN[event.start.getDay()]} {event.start.getDate()} {MONTHS[event.start.getMonth()]} · {tm(h)} – {tm(end)}</div>
      {people.length > 0 && (
        <div className="dm-ecx-pw">
          {people.map((p, i) => <Avatar key={i} initials={p.initials} color={p.color} />)}
          <span className="dm-muted">{people.length === 1 ? '1 person' : `${people.length} people`}</span>
        </div>
      )}
      {prep === 'done' && <div className={cx('dm-ecx-note', enter().className)}><Icon name="spark" size="xs" /><span>{note}</span></div>}
      {fresh ? (
        <div className="dm-ecx-pa">
          <button type="button" className="dm-pill dm-ghost dm-sm" onClick={onDiscard}>Discard</button>
          <button type="button" className="dm-pill dm-ink dm-sm" onClick={() => onSave(input.current?.value ?? '')}>Save</button>
        </div>
      ) : (onPrepNotes || onJoin) && (
        <div className="dm-ecx-pa">
          {onPrepNotes && prep !== 'done' && <button type="button" className="dm-pill dm-soft dm-sm" onClick={write}>{prep === 'writing' ? <><Think />Writing</> : <><Icon name="spark" size="xs" />Prep notes</>}</button>}
          {onJoin && <button type="button" className="dm-pill dm-ink dm-sm" onClick={() => onJoin(event)}>Join</button>}
        </div>
      )}
    </>
  );
}

/** A work week of events you can drag to another time or day, add to by clicking free time, and open for details.
    The agent can look for a free slot and suggest it. */
export function EventCalendar({
  events, defaultEvents = [], onEventsChange, week, days = 5, startHour = 9, hours = 8, title, now,
  selected, defaultSelected = null, onSelectedChange, newEvent, onPrepNotes, onJoin,
  askLabel = 'Find a time', onAsk, finding = false, suggestions = [], onBook, onSkip, status, className
}: EventCalendarProps) {
  const [list, setList] = useControllable(events, defaultEvents, onEventsChange);
  const [openId, setOpenId] = useControllable(selected, defaultSelected, onSelectedChange);
  const [msg, setMsg] = useState('');
  const uid = useId();
  const made = useRef(0);

  const root = useRef<HTMLDivElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const cols = useRef<(HTMLDivElement | null)[]>([]);
  const blocks = useRef(new Map<string, HTMLElement>());

  // the first events stagger in; an event added later, or dropped after a drag, plays the entrance again
  const delays = useRef<Map<string, number> | null>(null);
  if (!delays.current) delays.current = new Map(list.map((e, i) => [e.id, i * 30]));
  // a dropped event goes last in its day, so it sits on top, as on the site
  const [moves, setMoves] = useState<Record<string, number>>({});
  const drops = useRef(0);

  const end = startHour + hours;
  const inView = (d: Date) => { const i = dayIndex(week, d); return i >= 0 && i < days; };
  const shown = list.filter(e => inView(e.start));
  const open = openId != null ? list.find(e => e.id === openId) ?? null : null;
  // the card keeps what it showed while it fades out, and starts afresh each time it opens
  const [card, setCard] = useState(open);
  if (open && open !== card) setCard(open);
  const [runs, setRuns] = useState(0);

  const select = (id: string | null) => { if (id !== null) setRuns(n => n + 1); setOpenId(id); };
  const close = () => setOpenId(null);

  /* ---------- the details card: beside its event, inside the calendar ---------- */
  const [place, setPlace] = useState<CSSProperties>({});
  useIsoLayoutEffect(() => {
    const el = open && blocks.current.get(open.id), p = pop.current, panel = root.current;
    if (!el || !p || !panel) return;
    const pr = panel.getBoundingClientRect(), er = el.getBoundingClientRect(), w = 248;
    let x = er.right - pr.left + 8; if (x + w > pr.width - 8) x = er.left - pr.left - w - 8; x = Math.max(8, x);
    const y = Math.max(8, Math.min(er.top - pr.top, pr.height - p.offsetHeight - 8));
    setPlace({ left: x, top: y });
  }, [open?.id, runs]);
  useEffect(() => {
    if (!open) return;
    const down = (e: globalThis.PointerEvent) => { const t = e.target as Node; if (!pop.current?.contains(t) && !blocks.current.get(open.id)?.contains(t)) close(); };
    const key = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('pointerdown', down); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); };
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (id: string, change: Partial<EventCalendarEvent>) => setList(list.map(e => e.id === id ? { ...e, ...change } : e));
  const remove = (id: string) => { setList(list.filter(e => e.id !== id)); close(); };
  const save = (e: EventCalendarEvent, value: string) => {
    const v = value.trim() || 'Untitled';
    update(e.id, { title: v }); close();
    setMsg(`Added ${v}, ${DAYN[e.start.getDay()]} ${tm(hourOf(e.start))}`);
  };

  /* ---------- dragging: to another time or day, in 15 minute steps; a click without moving opens the card ---------- */
  const drag = useRef<{ id: string; x: number; y: number; moved: boolean; day: number; hour: number } | null>(null);
  const [dragging, setDragging] = useState<{ id: string; day: number; hour: number; dx: number } | null>(null);
  const colX = (i: number) => cols.current[i]?.getBoundingClientRect().left ?? 0;
  const down = (p: PointerEvent<HTMLElement>, e: EventCalendarEvent) => {
    if (p.button) return;
    p.currentTarget.setPointerCapture(p.pointerId);
    drag.current = { id: e.id, x: p.clientX, y: p.clientY, moved: false, day: dayIndex(week, e.start), hour: hourOf(e.start) };
  };
  const move = (p: PointerEvent<HTMLElement>, e: EventCalendarEvent) => {
    const d = drag.current; if (!d || d.id !== e.id) return;
    const dx = p.clientX - d.x, dy = p.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    if (!d.moved) { d.moved = true; if (openId != null) close(); setGhost(null); }
    const from = dayIndex(week, e.start), len = hourOf(e.end) - hourOf(e.start);
    d.hour = Math.max(startHour, Math.min(end - len, hourOf(e.start) + Math.round(dy / PX * 4) / 4));
    const under = document.elementsFromPoint(p.clientX, p.clientY).find(x => x.classList?.contains('dm-ecx-col')) as HTMLElement | undefined;
    if (under) d.day = +(under.dataset.d ?? d.day);
    setDragging({ id: e.id, day: d.day, hour: d.hour, dx: colX(d.day) - colX(from) });
  };
  const up = (e: EventCalendarEvent) => {
    const d = drag.current; drag.current = null; if (!d || d.id !== e.id) return;
    if (!d.moved) { select(openId === e.id ? null : e.id); return; }
    setDragging(null);
    const n = ++drops.current; setMoves(m => ({ ...m, [e.id]: n }));
    const from = dayIndex(week, e.start), h = hourOf(e.start), len = hourOf(e.end) - h;
    if (d.day === from && d.hour === h) return;
    update(e.id, { start: at(week, d.day, d.hour), end: at(week, d.day, d.hour + len) });
    setMsg(`Moved ${named(e)} to ${DAYN[addDays(week, d.day).getDay()]} ${tm(d.hour)}`);
  };

  /* ---------- free time: a dashed slot follows the pointer, a click adds an event there ---------- */
  const [ghost, setGhost] = useState<{ day: number; hour: number } | null>(null);
  const hover = (p: PointerEvent<HTMLDivElement>, day: number) => {
    if (p.target !== p.currentTarget || dragging) { if (ghost) setGhost(null); return; }
    const hour = startHour + Math.min(hours * 2 - 1, Math.floor((p.clientY - p.currentTarget.getBoundingClientRect().top) / PX * 2)) / 2;
    if (ghost?.day !== day || ghost.hour !== hour) setGhost({ day, hour });
  };
  const add = (p: MouseEvent<HTMLDivElement>, day: number) => {
    if (p.target !== p.currentTarget || !ghost || ghost.day !== day) return;
    const len = newEvent?.hours ?? 1, id = `${uid}-new-${++made.current}`;
    setList([...list, { id, title: '', start: at(week, day, ghost.hour), end: at(week, day, ghost.hour + len), tone: newEvent?.tone ?? 'pink', people: newEvent?.people }]);
    setGhost(null); select(id);
  };

  /* ---------- the agent's scan ---------- */
  const [scans, setScans] = useState(0);
  useEffect(() => { if (finding) setScans(n => n + 1); }, [finding]);

  const heading = title ?? (() => { const a = week, b = addDays(week, days - 1); return `${MONTHS[a.getMonth()]} ${a.getDate()} – ${b.getMonth() !== a.getMonth() ? MONTHS[b.getMonth()] + ' ' : ''}${b.getDate()}, ${b.getFullYear()}`; })();
  const today = now && inView(now) ? dayIndex(week, now) : -1;
  const sizes: CSSProperties | undefined = days !== 5 ? { gridTemplateColumns: `44px repeat(${days},minmax(76px,1fr))` } : undefined;
  const tall: CSSProperties | undefined = hours !== 8 ? { height: hours * PX } : undefined;
  const top = (h: number) => (h - startHour) * PX + 1;

  return (
    <div ref={root} data-dm="" className={cx('dm-ecx dm-panel', className)}>
      <div className="dm-ecx-h">
        <b>{heading}</b><span className="dm-ecx-sp" />
        <Swap className="dm-ecx-msg dm-muted">{status ?? msg}</Swap>
        {onAsk && <button type="button" className="dm-pill dm-soft dm-sm dm-ecx-ask" onClick={onAsk}>{finding ? <Think /> : <Icon name="spark" size="xs" />}<Swap key={finding ? 'f' : 'i'}>{askLabel}</Swap></button>}
      </div>
      <div className="dm-ecx-sc">
        <div className="dm-ecx-grid" style={sizes}>
          <div className="dm-ecx-tm">{Array.from({ length: hours }, (_, i) => { const h = startHour + i; return <span key={h}>{h > 12 ? h - 12 : h}{h >= 12 ? 'pm' : 'am'}</span>; })}</div>
          {Array.from({ length: days }, (_, d) => {
            const date = addDays(week, d);
            return (
              <div key={d} className="dm-ecx-day">
                <div className={cx('dm-ecx-dh', d === today && 'dm-t')}>{DAYN[date.getDay()]} <b>{date.getDate()}</b></div>
                <div ref={el => { cols.current[d] = el; }} className="dm-ecx-col" data-d={d} style={tall}
                  onPointerMove={p => hover(p, d)} onPointerLeave={() => setGhost(null)} onClick={p => add(p, d)}>
                  {shown.filter(e => dayIndex(week, e.start) === d).sort((a, b) => (moves[a.id] ?? 0) - (moves[b.id] ?? 0)).map(e => {
                    const h = hourOf(e.start), len = hourOf(e.end) - h, live = dragging?.id === e.id ? dragging : null, at_ = live?.hour ?? h;
                    if (h + len <= startHour || h >= end) return null;
                    // an hour or more keeps its exact height; anything shorter grows to show its time, like a booked suggestion on the site
                    return (
                      <Tip key={`${e.id}:${moves[e.id] ?? 0}`} label={`${named(e)}, ${tm(at_)}`} off={!!dragging || openId === e.id}>
                        <button type="button" ref={el => { if (el) blocks.current.set(e.id, el); else blocks.current.delete(e.id); }}
                          className={cx('dm-ecx-e dm-enter', live && 'dm-drag')}
                          style={{ ...tint(e.tone), top: top(at_), [len < 1 ? 'minHeight' : 'height']: len * PX - 3, transform: live ? `translateX(${live.dx}px)` : undefined, animationDelay: (delays.current!.get(e.id) ?? 0) + 'ms' }}
                          onPointerDown={p => down(p, e)} onPointerMove={p => move(p, e)} onPointerUp={() => up(e)} onPointerCancel={() => up(e)}>
                          <b>{named(e)}</b><span>{tm(at_)} – {tm(at_ + len)}</span>
                        </button>
                      </Tip>
                    );
                  })}
                  {suggestions.filter(s => dayIndex(week, s.start) === d).map(s => {
                    const i = suggestions.indexOf(s), h = hourOf(s.start), len = hourOf(s.end) - h;
                    return (
                      <div key={s.id} className={cx('dm-ecx-e dm-sug', i > 0 && 'dm-alt')} style={{ ...tint('blue'), top: top(h), height: 'auto', minHeight: len * PX - 3, animationDelay: i * 120 + 'ms' }}>
                        <b>{s.title}</b><span>{tm(h)} – {tm(h + len)}</span>
                        {i === 0 && (onBook || onSkip) && (
                          <div className="dm-ecx-sg">
                            {onBook && <button type="button" onClick={() => onBook(s)}>Book</button>}
                            {onSkip && suggestions.length > 1 && <button type="button" className="dm-n" onClick={() => onSkip(s)}>Other</button>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {d === today && now && <Tip label={`Now, ${tm(hourOf(now))}`}><div className="dm-ecx-now" style={{ top: (hourOf(now) - startHour) * PX }} /></Tip>}
                  {ghost?.day === d && <div className="dm-ecx-ghost" style={{ top: top(ghost.hour) }}>+ New event</div>}
                </div>
              </div>
            );
          })}
          <div key={scans} className={cx('dm-ecx-scan', scans > 0 && 'dm-go')} />
        </div>
      </div>
      <div ref={pop} className={cx('dm-ecx-pop', open && 'dm-open')} role="dialog" aria-label="Event" inert={!open} style={place}>
        {card && <Details key={`${card.id}:${runs}`} event={card} onClose={close} onSave={v => save(card, v)} onDiscard={() => remove(card.id)} onPrepNotes={onPrepNotes} onJoin={onJoin} />}
      </div>
    </div>
  );
}
```

## More in Dates

- [Date picker](https://designme.dev/components/date-picker.md): A field that opens a calendar, with quick picks and natural language.
- [Date range picker](https://designme.dev/components/date-range-picker.md): Pick a start and end across two months, or use a preset.
- [Agenda](https://designme.dev/components/agenda.md): Today's schedule with a live now line and agent prep notes.

All components: https://designme.dev/llms.txt
