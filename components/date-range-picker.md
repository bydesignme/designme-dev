# Date range picker

> Pick a start and end across two months, or use a preset.

App basics / Dates. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/date-range-picker

## Install

```sh
npx designme add date-range-picker          # HTML, CSS and JS, with the shared core
npx designme add date-range-picker --react  # React 19 component and its CSS
npx designme add date-range-picker --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/date-range-picker.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/date-range-picker.json  # Astro
```

## About

A range picker with two months side by side and a list of ready-made ranges such as Last 7 days and This quarter. People click a start day and an end day, see the range fill in as they hover, and confirm with Apply. It suits reports and dashboards where an agent's results are read over a period.

### When to use it

- When a report, chart or agent summary needs a start and end date.
- When most people want a common range, like the last 30 days, in one click.
- When a range tied to your product, such as "Since pricing launch", should sit next to the standard ones.

### What it does

- The first click sets the start, the second sets the end; clicking a day before the start, or clicking again after a full range, starts over.
- While only the start is set, hovering a later day previews the range.
- From and To boxes show the picked days, and a counter shows how many days the range covers.
- Presets in the side list fill the range from `today`; the preset that matches the current range lights up, and its days fill in one after another.
- Apply is enabled once both days are set and calls `onApply`; Clear empties the range.
- `locale`, `weekStartsOn` and `format` control the month names, week start and how days read.

### Accessibility

- Arrow keys move focus a day or a week, Home and End go to the start and end of the week, and Page Up and Page Down move a month, or a year with Shift; the months follow the focus.
- Only one day is a tab stop: the one the arrows reached, the end, the start, today or the first day on show.
- Moving focus with the keyboard while only the start is set previews the range the same way hovering does.
- Each day button has its full date as aria-label and aria-pressed on the start and end days.
- Preset buttons use aria-pressed to show which one matches the range.

## Usage in React

```tsx
import { DateRangePicker } from '@/components/designme/date-range-picker/DateRangePicker';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: the range since the pricing launch fills in.
import { useState } from 'react';
import { DateRangePicker, DateRangePickerPresets, type DateRangePickerRange } from './DateRangePicker';
import { useScript } from '../lib/useScript';

const TODAY = new Date(2026, 9, 19), LAUNCH = new Date(2026, 8, 18);
const PRESETS = [...DateRangePickerPresets, { key: 'launch', label: 'Since pricing launch', range: (t: Date): [Date, Date] => [LAUNCH, t] }];

/* ---------- Date range picker: ready-made ranges, two months, a hover preview, then Apply ---------- */
export default function DateRangePickerDemo() {
  const [range, setRange] = useState<DateRangePickerRange>({ start: null, end: null });
  useScript(async ({ wait }) => { await wait(900); setRange({ start: LAUNCH, end: TODAY }); });
  return (
    <div style={{ width: '100%' }}>
      <DateRangePicker today={TODAY} defaultMonth={new Date(2026, 8, 1)} presets={PRESETS} value={range} onValueChange={setRange} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `value` (optional) | `DateRangePickerRange` | The picked range. Days are Dates at local midnight |
| `defaultValue` (optional) | `DateRangePickerRange` |  |
| `onValueChange` (optional) | `(range: DateRangePickerRange) => void` |  |
| `month` (optional) | `Date` | The month in the left calendar, as its first day; the right one shows the month after. Defaults to last month |
| `defaultMonth` (optional) | `Date` |  |
| `onMonthChange` (optional) | `(month: Date) => void` |  |
| `presets` (optional) | `DateRangePickerPreset[]` | The side list. Defaults to the last 7 and 30 days and this quarter. The one matching the range lights up |
| `today` (optional) | `Date` | Ranges end today in the presets. Defaults to the real today; pass one when rendering on a server |
| `onApply` (optional) | `(range: { start: Date; end: Date }) => void` | Called with the range when Apply is pressed |
| `format` (optional) | `(date: Date) => string` | How a day reads in the From and To boxes. Defaults to "Sep 18, 2026" |
| `locale` (optional) | `string` | Used for the month names, the weekday letters and the default format |
| `weekStartsOn` (optional) | `WeekStart` | 1 starts the weeks on Monday (the default), 0 on Sunday |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import DateRangePicker from '../components/designme/date-range-picker/DateRangePicker.astro';
---
<DateRangePicker />
<DateRangePicker data-style="soft" class="my-class" />
```
It plays its demo; change `date-range-picker.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I add a custom preset like "Since launch"?**

Spread the exported `DateRangePickerPresets` into a new array and add your own entry with a `key`, a `label` and a `range` function that takes today and returns [start, end].

**How do people get to other months?**

There are no previous and next buttons. The view moves when a preset is picked, when the keyboard focus passes the edge of the two months (Page Up and Page Down move a month), or when you set `month` yourself.

**What is the difference between `onValueChange` and `onApply`?**

`onValueChange` fires on every click, including when only the start is set and `end` is null. `onApply` fires only when the person presses Apply with both days set.

**Which months show first?**

By default the left calendar shows the month before the range's end, or before today, and the right one shows the month after it. Pass `defaultMonth` or `month` to choose.

## Source

`DateRangePicker.tsx`, as `npx designme add date-range-picker --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { addDays, addMonths, daysBetween, dayKey, formatMonth, fromIsoDay, isoDay, monthDays, moveDay, sameMonth, startOfDay, startOfMonth, startOfQuarter, weekdayIndex, weekdayNames, type WeekStart } from '../lib/calendar';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Swap } from '../lib/motion';
import '../designme.css';
import './date-range-picker.css';

/** A range of days. `end` is null while the second day is still to be picked */
export interface DateRangePickerRange {
  start: Date | null;
  end: Date | null;
}

/** A ready-made range in the side list, worked out from today */
export interface DateRangePickerPreset {
  key: string;
  label: string;
  range: (today: Date) => [Date, Date];
}

export interface DateRangePickerProps {
  /** The picked range. Days are Dates at local midnight */
  value?: DateRangePickerRange;
  defaultValue?: DateRangePickerRange;
  onValueChange?: (range: DateRangePickerRange) => void;
  /** The month in the left calendar, as its first day; the right one shows the month after. Defaults to last month */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** The side list. Defaults to the last 7 and 30 days and this quarter. The one matching the range lights up */
  presets?: DateRangePickerPreset[];
  /** Ranges end today in the presets. Defaults to the real today; pass one when rendering on a server */
  today?: Date;
  /** Called with the range when Apply is pressed */
  onApply?: (range: { start: Date; end: Date }) => void;
  /** How a day reads in the From and To boxes. Defaults to "Sep 18, 2026" */
  format?: (date: Date) => string;
  /** Used for the month names, the weekday letters and the default format */
  locale?: string;
  /** 1 starts the weeks on Monday (the default), 0 on Sunday */
  weekStartsOn?: WeekStart;
  className?: string;
}

/** The side list designme.dev starts from: the last 7 days, the last 30 days and this quarter */
export const DateRangePickerPresets: DateRangePickerPreset[] = [
  { key: '7', label: 'Last 7 days', range: t => [addDays(t, -6), t] },
  { key: '30', label: 'Last 30 days', range: t => [addDays(t, -29), t] },
  { key: 'q', label: 'This quarter', range: t => [startOfQuarter(t), t] }
];

const EMPTY: DateRangePickerRange = { start: null, end: null };

/** Two months side by side with ready-made ranges, a live preview of the range as you hover, and Apply. */
export function DateRangePicker({
  value, defaultValue = EMPTY, onValueChange, month, defaultMonth, onMonthChange, presets = DateRangePickerPresets, today: todayProp,
  onApply, format, locale = 'en-US', weekStartsOn = 1, className
}: DateRangePickerProps) {
  const [today] = useState(() => startOfDay(todayProp ?? new Date()));
  const now = todayProp ? startOfDay(todayProp) : today;
  const [range, setRange] = useControllable(value, defaultValue, onValueChange);
  const [view, setView] = useControllable(month, startOfMonth(defaultMonth ?? addMonths(defaultValue.end ?? now, -1)), onMonthChange);
  const [hover, setHover] = useState<Date | null>(null);
  const show = format ?? ((d: Date) => d.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' }));
  const { start, end } = range;
  const ka = start ? dayKey(start) : 0, kb = end ? dayKey(end) : 0;
  const preset = start && end ? presets.find(p => { const [a, b] = p.range(now); return dayKey(a) === ka && dayKey(b) === kb; }) : undefined;

  // a range that matches a preset fills in day by day, the way picking the preset does on designme.dev
  const rangeKey = `${ka}-${kb}`;
  const [seen, setSeen] = useState(rangeKey);
  const [pass, setPass] = useState(0);
  const [flash, setFlash] = useState(false);
  if (seen !== rangeKey) { setSeen(rangeKey); setFlash(!!preset); if (preset) setPass(n => n + 1); }

  // when the range is set from outside, bring its last day into view
  const visible = (d: Date) => sameMonth(d, view) || sameMonth(d, addMonths(startOfMonth(view), 1));
  useEffect(() => { if (end && !visible(end)) setView(startOfMonth(addMonths(end, -1))); }, [kb]); // eslint-disable-line react-hooks/exhaustive-deps

  const click = (d: Date) => {
    setHover(null);
    setRange(!start || end || dayKey(d) < ka ? { start: d, end: null } : { start, end: d });
  };
  const choose = (p: DateRangePickerPreset) => {
    const [a, b] = p.range(now);
    setHover(null); setRange({ start: a, end: b });
    const base = startOfMonth(addMonths(b, -1));
    if (dayKey(base) !== dayKey(startOfMonth(view))) setView(base);
  };

  const [applied, setApplied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const apply = () => {
    if (!start || !end) return;
    onApply?.({ start, end });
    setApplied(true); clearTimeout(timer.current); timer.current = setTimeout(() => setApplied(false), 1200);
  };

  // arrow keys move the focus a day or a week, and Page Up / Page Down a month
  const cals = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<string | null>(null);
  useIsoLayoutEffect(() => {
    if (!focus) return;
    cals.current?.querySelector<HTMLButtonElement>(`[data-date="${focus}"]`)?.focus();
    setFocus(null);
  }, [focus, view]);
  // one day takes Tab: the one the arrows last reached, or the end, the start, today or the first day on show
  const [cursor, setCursor] = useState<Date | null>(null);
  const tabDay = [cursor, end, start, now].find(d => d && visible(d)) ?? startOfMonth(view);
  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    const at = (e.target as HTMLElement).dataset.date; if (!at) return;
    const next = moveDay(fromIsoDay(at), e.key, weekStartsOn, e.shiftKey); if (!next) return;
    e.preventDefault();
    if (!visible(next)) setView(startOfMonth(dayKey(next) < dayKey(view) ? next : addMonths(next, -1)));
    setCursor(next); setFocus(isoDay(next));
    if (start && !end) setHover(next);
  };

  // the days that light up when a preset fills in, in page order, for their stagger
  const reach = end ?? hover, kr = reach ? dayKey(reach) : 0;
  const months = [startOfMonth(view), startOfMonth(addMonths(startOfMonth(view), 1))];
  let lit = 0;
  const heads = weekdayNames(locale, weekStartsOn);

  return (
    <div data-dm="" className={cx('dm-drx dm-panel', className)}>
      <div className="dm-drx-side">
        {presets.map(p => <button type="button" key={p.key} className={cx('dm-drx-p', preset === p && 'dm-on')} aria-pressed={preset === p} onClick={() => choose(p)}>{p.label}</button>)}
      </div>
      <div className="dm-drx-main">
        <div className="dm-drx-top">
          <div className={cx('dm-drx-in', !start && 'dm-on')}><span className="dm-muted">From</span><b className="dm-drx-a"><Swap>{start ? show(start) : '–'}</Swap></b></div>
          <Icon name="right" size="xs" />
          <div className={cx('dm-drx-in', !!start && !end && 'dm-on')}><span className="dm-muted">To</span><b className="dm-drx-b"><Swap>{end ? show(end) : '–'}</Swap></b></div>
          <span className="dm-drx-n dm-muted">{start && end ? `${daysBetween(start, end) + 1} ${daysBetween(start, end) ? 'days' : 'day'}` : start ? 'Pick an end date' : 'Pick a start date'}</span>
        </div>
        <div ref={cals} className="dm-drx-cals" onMouseLeave={() => setHover(null)} onKeyDown={keys}>
          {months.map((mo, o) => (
            <div key={o} className="dm-drx-cal" data-o={o}>
              <h5>{formatMonth(mo, locale)}</h5>
              <div key={`${isoDay(mo)}-${pass}`} className="dm-drx-g">
                {heads.map((w, i) => <span key={'w' + i} className="dm-w" aria-hidden="true">{w}</span>)}
                {Array.from({ length: weekdayIndex(mo, weekStartsOn) }, (_, i) => <span key={'e' + i} className="dm-drx-d dm-e" />)}
                {monthDays(mo).map(d => {
                  const k = dayKey(d), isA = !!start && k === ka, isB = !!end && k === kb;
                  const between = !!start && !!reach && k > ka && k < kr;
                  const on = isA || isB || (between && !!end);
                  const stagger = flash && on ? { className: 'dm-enter', style: { animationDelay: lit++ * 8 + 'ms' } } : null;
                  return (
                    <button type="button" key={k} data-date={isoDay(d)} style={stagger?.style}
                      className={cx('dm-drx-d', isA && 'dm-a', isA && reach && kr > k && 'dm-ra', isB && 'dm-b dm-rb', between && (end ? 'dm-in' : 'dm-hv'),
                        !end && hover && start && k === kr && k > ka && 'dm-hv', stagger?.className)}
                      aria-pressed={isA || isB} aria-label={show(d)} tabIndex={k === dayKey(tabDay) ? 0 : -1}
                      onClick={() => click(d)} onMouseEnter={() => { if (start && !end) setHover(d); }}>{d.getDate()}</button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="dm-drx-f">
          <button type="button" className="dm-pill dm-ghost dm-sm dm-drx-clr" onClick={() => { setHover(null); setRange(EMPTY); }}>Clear</button>
          <button type="button" className="dm-pill dm-primary dm-sm dm-drx-ok" disabled={!start || !end} onClick={apply}>
            {applied ? <><Icon name="check" size="xs" />Applied</> : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

## More in Dates

- [Date picker](https://designme.dev/components/date-picker.md): A field that opens a calendar, with quick picks and natural language.
- [Segmented control](https://designme.dev/components/segmented-control.md): Switch between views of the same thing, with a sliding indicator.
- [Event calendar](https://designme.dev/components/event-calendar.md): A week view where the agent finds a free slot for you.
- [Agenda](https://designme.dev/components/agenda.md): Today's schedule with a live now line and agent prep notes.

All components: https://designme.dev/llms.txt
