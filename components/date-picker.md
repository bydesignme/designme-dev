# Date picker

> A field that opens a calendar, with quick picks and natural language.

App basics / Dates. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/date-picker

## Install

```sh
npx designme add date-picker          # HTML, CSS and JS, with the shared core
npx designme add date-picker --react  # React 19 component and its CSS
npx designme add date-picker --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/date-picker.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/date-picker.json  # Astro
```

## About

A date field that opens a small calendar, with a text box at the top that reads plain English like "next friday" or "in 2 weeks". Quick picks such as Today and Tomorrow sit under the box, and the month grid below works with mouse or keyboard. It suits agent products where people set a due date or launch date the way they would say it.

### When to use it

- When people pick one date, such as a deadline, launch or reminder.
- When typing "tomorrow" or "in 3 days" is quicker than clicking through months.
- When the same few dates come up often and deserve one-click quick picks.

### What it does

- The field shows the picked day, like "Fri, Oct 23, 2026", or `placeholder` before a day is picked; `format` changes how it reads.
- Typed text is passed to `parse` and picks the day as soon as it reads as a date, while the calendar stays open; Enter then closes it.
- The default parser understands "today", "tomorrow", weekday names and "in N days", "in N weeks" or "in N months".
- Quick picks from `presets` (Today, Tomorrow and In a week by default) pick a day a set number of days after today.
- Previous and next month buttons slide the grid in from the side it comes from, and clicking a day picks it and closes the calendar.
- `locale` sets the month and weekday names, `weekStartsOn` starts weeks on Monday or Sunday, and `today` sets the day marked with a dot.

### Accessibility

- The field button has aria-haspopup="dialog" and aria-expanded, and the calendar is a role="dialog" labelled "Choose a date"; Escape closes it and returns focus to the field.
- In the day grid, arrow keys move a day or a week, Home and End go to the start and end of the week, and Page Up and Page Down move a month, or a year with Shift.
- Opened from the keyboard, the calendar takes the focus on the picked day, or today. Only one day is a tab stop: the one the arrows reached, the picked day, today or the 1st.
- Each day button has its full date as aria-label, aria-pressed on the picked day and aria-current="date" on today.
- The month name is an aria-live="polite" region, so changing month is announced.

## Usage in React

```tsx
import { DatePicker } from '@/components/designme/date-picker/DatePicker';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: the calendar opens and someone types "next friday".
import { useRef, useState } from 'react';
import { DatePicker } from './DatePicker';
import { useStory } from '../lib/useScript';

/* ---------- Date picker: a field that opens a calendar and reads plain English ---------- */
// today is the real today, so the calendar opens on this month and "next friday" is the coming Friday
export default function DatePickerDemo() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  // the preview opens it and types a date on its own; clicking, focusing or typing in it takes over, and what it had typed goes
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait, taken }) => {
    await wait(800); setOpen(true);
    await wait(500);
    const s = 'next friday';
    let typing = true;
    taken(() => { if (typing) setQuery(''); });
    for (let k = 1; k <= s.length; k++) { setQuery(s.slice(0, k)); await wait(70); }
    typing = false;
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <DatePicker placeholder="Pick a launch date" open={open} onOpenChange={setOpen} query={query} onQueryChange={setQuery} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `value` (optional) | `Date \| null` | The picked day (a Date at local midnight), or null before anything is picked |
| `defaultValue` (optional) | `Date \| null` |  |
| `onValueChange` (optional) | `(date: Date \| null) => void` |  |
| `month` (optional) | `Date` | The month on show, as its first day. Defaults to the picked day's month, or today's |
| `defaultMonth` (optional) | `Date` |  |
| `onMonthChange` (optional) | `(month: Date) => void` |  |
| `open` (optional) | `boolean` | Whether the calendar is open. Leave it out to let the field toggle it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `query` (optional) | `string` | What is typed in the box at the top, like "next friday". A date it reads is picked straight away |
| `defaultQuery` (optional) | `string` |  |
| `onQueryChange` (optional) | `(text: string) => void` |  |
| `parse` (optional) | `(text: string, today: Date) => Date \| null` | Turns typed text into a day. Defaults to plain English: weekdays, "tomorrow", "in 2 weeks" |
| `today` (optional) | `Date` | The day marked with a dot. Defaults to the real today; pass one when rendering on a server |
| `placeholder` (optional) | `string` | Shown in the field before a day is picked |
| `queryPlaceholder` (optional) | `string` | The hint in the text box |
| `presets` (optional) | `DatePickerPreset[]` | Quick picks under the text box. Defaults to Today, Tomorrow and In a week |
| `format` (optional) | `(date: Date) => string` | How the picked day reads in the field. Defaults to "Fri, Oct 23, 2026" |
| `locale` (optional) | `string` | Used for the month name, the weekday letters and the default format |
| `weekStartsOn` (optional) | `WeekStart` | 1 starts the weeks on Monday (the default), 0 on Sunday |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import DatePicker from '../components/designme/date-picker/DatePicker.astro';
---
<DatePicker />
<DatePicker data-style="soft" class="my-class" />
```
It plays its demo; change `date-picker.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**What does "friday" pick if today is Friday?**

The default parser always picks the next one, so it returns the Friday a week later, never today. "next friday" works the same way.

**Can I use my own natural language parser?**

Yes. Pass `parse`, a function that takes the typed text and today's date and returns a Date or null. You could call your agent or a library like chrono from there, as long as it returns synchronously.

**Why should I pass `today` when rendering on the server?**

The today dot and the presets are based on the current date. Passing `today` keeps server and client output the same and makes demos and tests repeatable.

**Can I change the quick picks?**

Yes. Pass `presets` as a list of a `label` and a number of `days` after today, like { label: 'Next sprint', days: 14 }.

## Source

`DatePicker.tsx`, as `npx designme add date-picker --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { addDays, formatMonth, fromIsoDay, isoDay, monthGrid, moveDay, parseRelativeDay, sameDay, sameMonth, startOfDay, startOfMonth, weekdayNames, type WeekStart } from '../lib/calendar';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Swap } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './date-picker.css';

/** A quick pick under the text box, like Tomorrow: `days` after today */
export interface DatePickerPreset {
  label: string;
  days: number;
}

export interface DatePickerProps {
  /** The picked day (a Date at local midnight), or null before anything is picked */
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  /** The month on show, as its first day. Defaults to the picked day's month, or today's */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** Whether the calendar is open. Leave it out to let the field toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** What is typed in the box at the top, like "next friday". A date it reads is picked straight away */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (text: string) => void;
  /** Turns typed text into a day. Defaults to plain English: weekdays, "tomorrow", "in 2 weeks" */
  parse?: (text: string, today: Date) => Date | null;
  /** The day marked with a dot. Defaults to the real today; pass one when rendering on a server */
  today?: Date;
  /** Shown in the field before a day is picked */
  placeholder?: string;
  /** The hint in the text box */
  queryPlaceholder?: string;
  /** Quick picks under the text box. Defaults to Today, Tomorrow and In a week */
  presets?: DatePickerPreset[];
  /** How the picked day reads in the field. Defaults to "Fri, Oct 23, 2026" */
  format?: (date: Date) => string;
  /** Used for the month name, the weekday letters and the default format */
  locale?: string;
  /** 1 starts the weeks on Monday (the default), 0 on Sunday */
  weekStartsOn?: WeekStart;
  className?: string;
}

const PRESETS: DatePickerPreset[] = [{ label: 'Today', days: 0 }, { label: 'Tomorrow', days: 1 }, { label: 'In a week', days: 7 }];

/** A date field that opens a calendar, with quick picks and a box that understands "next friday". */
export function DatePicker({
  value, defaultValue = null, onValueChange, month, defaultMonth, onMonthChange, open, defaultOpen = false, onOpenChange,
  query, defaultQuery = '', onQueryChange, parse = parseRelativeDay, today: todayProp, placeholder = 'Pick a date',
  queryPlaceholder = 'Try “next friday” or “in 2 weeks”', presets = PRESETS, format, locale = 'en-US', weekStartsOn = 1, className
}: DatePickerProps) {
  const [today] = useState(() => startOfDay(todayProp ?? new Date()));
  const now = todayProp ? startOfDay(todayProp) : today;
  const [picked, setPicked] = useControllable(value, defaultValue, onValueChange);
  const [view, setView] = useControllable(month, startOfMonth(defaultMonth ?? defaultValue ?? now), onMonthChange);
  const [text, setText] = useControllable(query, defaultQuery, onQueryChange);
  const menu = usePopover({ side: 'down', open, defaultOpen, onOpenChange });
  const show = format ?? ((d: Date) => d.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));

  // a new month slides in from the side it comes from
  const viewKey = isoDay(startOfMonth(view));
  const [shown, setShown] = useState(viewKey);
  const [dir, setDir] = useState(0);
  if (shown !== viewKey) { setDir(viewKey > shown ? 1 : -1); setShown(viewKey); }

  const closing = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(closing.current), []);
  const pick = (d: Date, keep = false) => {
    setPicked(d);
    if (!sameMonth(d, view)) setView(startOfMonth(d));
    if (!keep) { clearTimeout(closing.current); closing.current = setTimeout(() => menu.setOpen(false), 260); }
  };

  // typed text picks a day as soon as it reads as one, and the calendar stays open
  const read = useRef(text);
  useEffect(() => {
    if (read.current === text) return;
    read.current = text;
    const d = parse(text, now);
    if (d) pick(d, true);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  // arrow keys move the focus a day or a week, across months too
  const grid = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<string | null>(null);
  useIsoLayoutEffect(() => {
    if (!focus) return;
    grid.current?.querySelector<HTMLButtonElement>(`[data-date="${focus}"]`)?.focus();
    setFocus(null);
  }, [focus, viewKey]);
  // one day takes Tab: the one the arrows last reached, or the picked day, today or the 1st
  const [cursor, setCursor] = useState<Date | null>(null);
  const tabDay = [cursor, picked, now].find(d => d && sameMonth(d, view)) ?? startOfMonth(view);
  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    const at = (e.target as HTMLElement).dataset.date; if (!at) return;
    const next = moveDay(fromIsoDay(at), e.key, weekStartsOn, e.shiftKey); if (!next) return;
    e.preventDefault();
    if (!sameMonth(next, view)) setView(startOfMonth(next));
    setCursor(next); setFocus(isoDay(next));
  };
  // opened with Enter or Space, the calendar takes the focus on the picked day, or today
  const keyOpen = useRef(false);
  useIsoLayoutEffect(() => { if (menu.open && keyOpen.current) { keyOpen.current = false; setCursor(null); grid.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus({ preventScroll: true }); } }, [menu.open]);

  return (
    <div data-dm="" className={cx('dm-dpk', className)}>
      <button type="button" className="dm-dpk-f" {...menu.trigger} aria-haspopup="dialog" onClick={e => { keyOpen.current = !menu.open && e.detail === 0; menu.trigger.onClick(); }}>
        <Icon name="cal" size="xs" />
        <Swap className={cx('dm-dpk-val', !picked && 'dm-ph')}>{picked ? show(picked) : placeholder}</Swap>
        <Icon name="chev-d" size="xs" />
      </button>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-dpk-pop')} role="dialog" aria-label="Choose a date">
        <input className="dm-dpk-nl" placeholder={queryPlaceholder} spellCheck={false} aria-label="Type a date" value={text}
          onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && picked) menu.setOpen(false); }} />
        <div className="dm-dpk-qk">
          {presets.map(p => <button type="button" key={p.label} className="dm-chip dm-sm" onClick={() => pick(addDays(now, p.days))}>{p.label}</button>)}
        </div>
        <div className="dm-dpk-mh">
          <button type="button" className="dm-ib dm-dpk-pv" aria-label="Previous month" onClick={() => setView(startOfMonth(new Date(view.getFullYear(), view.getMonth() - 1, 1)))}><Icon name="chev-l" size="xs" /></button>
          <b className="dm-dpk-m" aria-live="polite">{formatMonth(view, locale)}</b>
          <button type="button" className="dm-ib dm-dpk-nx" aria-label="Next month" onClick={() => setView(startOfMonth(new Date(view.getFullYear(), view.getMonth() + 1, 1)))}><Icon name="chev-r" size="xs" /></button>
        </div>
        <div className="dm-dpk-wd dm-muted" aria-hidden="true">{weekdayNames(locale, weekStartsOn).map((w, i) => <span key={i}>{w}</span>)}</div>
        <div className="dm-dpk-vp">
          <div key={viewKey} ref={grid} className={cx('dm-dpk-g', dir < 0 && 'dm-in-l', dir > 0 && 'dm-in-r')} onKeyDown={keys}>
            {monthGrid(view, weekStartsOn).map(d => (
              <button type="button" key={isoDay(d)} data-date={isoDay(d)}
                className={cx('dm-dpk-d', !sameMonth(d, view) && 'dm-o', sameDay(d, now) && 'dm-t', sameDay(d, picked) && 'dm-s')}
                aria-pressed={sameDay(d, picked)} aria-current={sameDay(d, now) ? 'date' : undefined} aria-label={show(d)} tabIndex={sameDay(d, tabDay) ? 0 : -1}
                onClick={() => pick(d)}>{d.getDate()}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## More in Dates

- [Segmented control](https://designme.dev/components/segmented-control.md): Switch between views of the same thing, with a sliding indicator.
- [Date range picker](https://designme.dev/components/date-range-picker.md): Pick a start and end across two months, or use a preset.
- [Event calendar](https://designme.dev/components/event-calendar.md): A week view where the agent finds a free slot for you.
- [Agenda](https://designme.dev/components/agenda.md): Today's schedule with a live now line and agent prep notes.

All components: https://designme.dev/llms.txt
