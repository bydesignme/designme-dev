'use client';
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Avatar, enter, Swap, Think, Tip } from '../../lib/motion';
import '../../designme.css';
import './event-calendar.css';

export type EventCalendarTone = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

export interface EventCalendarPerson {
  /** Like "MK" */
  initials: string;
  /** The avatar's colour, like 'var(--dm-av-l)' */
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
  /** The day a narrow calendar shows, as its place in the week (0 for the first day). A calendar under 520px wide shows one
      day at a time, picked from a row of days; it opens on today, and moves to the day of the agent's pick when one comes */
  day?: number;
  defaultDay?: number;
  onDayChange?: (day: number) => void;
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
          <button type="button" className="dm-pill dm-primary dm-sm" onClick={() => onSave(input.current?.value ?? '')}>Save</button>
        </div>
      ) : (onPrepNotes || onJoin) && (
        <div className="dm-ecx-pa">
          {onPrepNotes && prep !== 'done' && <button type="button" className="dm-pill dm-soft dm-sm" onClick={write}>{prep === 'writing' ? <><Think />Writing</> : <><Icon name="spark" size="xs" />Prep notes</>}</button>}
          {onJoin && <button type="button" className="dm-pill dm-primary dm-sm" onClick={() => onJoin(event)}>Join</button>}
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
  askLabel = 'Find a time', onAsk, finding = false, suggestions = [], onBook, onSkip, status, day, defaultDay, onDayChange, className
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
  // opened with Enter or Space, the card takes the focus; closed with the focus in it, its event gets it back
  const keyOpen = useRef(false), inPop = useRef(false), lastOpen = useRef<string | null>(null);
  useIsoLayoutEffect(() => {
    if (openId != null) {
      lastOpen.current = openId;
      if (keyOpen.current) { keyOpen.current = false; pop.current?.querySelector<HTMLElement>('input,button')?.focus({ preventScroll: true }); }
      return;
    }
    if (inPop.current) { inPop.current = false; const b = lastOpen.current && blocks.current.get(lastOpen.current); if (b && b.isConnected) b.focus({ preventScroll: true }); }
  }, [openId]);

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
  const sizes: CSSProperties | undefined = days !== 5 ? { ['--dm-days' as string]: days } : undefined;
  /* ---------- a narrow calendar: one day at a time ---------- */
  const [shownDay, setShownDay] = useControllable(day, defaultDay ?? Math.max(0, today), onDayChange);
  const daysRow = useRef<HTMLDivElement>(null);
  const narrow = () => !!daysRow.current?.getClientRects().length;
  const [turns, setTurns] = useState(0);
  const pickDay = (d: number) => { if (d === shownDay) return; if (narrow()) { close(); setTurns(n => n + 1); } setShownDay(d); };
  // the agent's pick opens on its day
  const pick = suggestions[0], pickDayOf = pick && inView(pick.start) ? dayIndex(week, pick.start) : -1;
  useEffect(() => { if (pickDayOf >= 0) pickDay(pickDayOf); }, [pick?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const tall: CSSProperties | undefined = hours !== 8 ? { height: hours * PX } : undefined;
  const top = (h: number) => (h - startHour) * PX + 1;

  return (
    <div ref={root} data-dm="" className={cx('dm-ecx dm-panel', className)}>
      <div className="dm-ecx-h">
        <b>{heading}</b><span className="dm-ecx-sp" />
        <Swap className="dm-ecx-msg dm-muted">{status ?? msg}</Swap>
        {onAsk && <button type="button" className="dm-pill dm-soft dm-sm dm-ecx-ask" onClick={onAsk}>{finding ? <Think /> : <Icon name="spark" size="xs" />}<Swap key={finding ? 'f' : 'i'}>{askLabel}</Swap></button>}
      </div>
      <div ref={daysRow} className="dm-ecx-days" role="group" aria-label="Day">
        {Array.from({ length: days }, (_, d) => {
          const date = addDays(week, d);
          return (
            <button key={d} type="button" className={d === today ? 'dm-t' : undefined} aria-pressed={d === shownDay} onClick={() => pickDay(d)}
              aria-label={date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}>
              <span>{DAYN[date.getDay()]}</span><b>{date.getDate()}</b>
            </button>
          );
        })}
      </div>
      <div className="dm-ecx-sc">
        <div className="dm-ecx-grid" style={sizes}>
          <div className="dm-ecx-tm">{Array.from({ length: hours }, (_, i) => { const h = startHour + i; return <span key={h}>{h > 12 ? h - 12 : h}{h >= 12 ? 'pm' : 'am'}</span>; })}</div>
          {Array.from({ length: days }, (_, d) => {
            const date = addDays(week, d);
            return (
              <div key={d === shownDay ? `${d}:${turns}` : d} className={cx('dm-ecx-day', d === shownDay && 'dm-on', d === shownDay && turns > 0 && 'dm-enter')}>
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
                          onPointerDown={p => down(p, e)} onPointerMove={p => move(p, e)} onPointerUp={() => up(e)} onPointerCancel={() => up(e)}
                          onClick={c => { if (c.detail !== 0) return; keyOpen.current = openId !== e.id; select(openId === e.id ? null : e.id); }}>
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
      <div ref={pop} className={cx('dm-ecx-pop', open && 'dm-open')} role="dialog" aria-label="Event" inert={!open} style={place}
        onFocus={() => { inPop.current = true; }} onBlur={f => { if (!pop.current?.contains(f.relatedTarget as Node)) inPop.current = false; }}>
        {card && <Details key={`${card.id}:${runs}`} event={card} onClose={close} onSave={v => save(card, v)} onDiscard={() => remove(card.id)} onPrepNotes={onPrepNotes} onJoin={onJoin} />}
      </div>
    </div>
  );
}
