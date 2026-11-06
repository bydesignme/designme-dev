'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { addDays, formatMonth, fromIsoDay, isoDay, monthGrid, moveDay, parseRelativeDay, sameDay, sameMonth, startOfDay, startOfMonth, weekdayNames, type WeekStart } from '../../lib/calendar';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Swap } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
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
