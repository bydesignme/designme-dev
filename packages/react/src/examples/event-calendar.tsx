'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useCallback, useEffect, useRef, useState } from 'react';
import { EventCalendar, type EventCalendarEvent, type EventCalendarPerson, type EventCalendarSuggestion, type EventCalendarTone } from '../components/event-calendar/EventCalendar';
import { useScript } from './useScript';

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

/** timers for runs started by a click, cleared when the demo unmounts */
function useWait() {
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => { const all = timers.current; return () => all.forEach(clearTimeout); }, []);
  return useCallback((ms: number) => new Promise<void>(res => { const t = setTimeout(() => { timers.current.delete(t); res(); }, ms); timers.current.add(t); }), []);
}

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
