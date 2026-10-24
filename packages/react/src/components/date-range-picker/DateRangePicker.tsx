'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { addDays, addMonths, daysBetween, dayKey, formatMonth, fromIsoDay, isoDay, monthDays, moveDay, sameMonth, startOfDay, startOfMonth, startOfQuarter, weekdayIndex, weekdayNames, type WeekStart } from '../../lib/calendar';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Swap } from '../../lib/motion';
import '../../designme.css';
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
  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    const at = (e.target as HTMLElement).dataset.date; if (!at) return;
    const next = moveDay(fromIsoDay(at), e.key, weekStartsOn, e.shiftKey); if (!next) return;
    e.preventDefault();
    if (!visible(next)) setView(startOfMonth(dayKey(next) < dayKey(view) ? next : addMonths(next, -1)));
    setFocus(isoDay(next));
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
                      aria-pressed={isA || isB} aria-label={show(d)}
                      onClick={() => click(d)} onMouseEnter={() => { if (start && !end) setHover(d); }}>{d.getDate()}</button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="dm-drx-f">
          <button type="button" className="dm-pill dm-ghost dm-sm dm-drx-clr" onClick={() => { setHover(null); setRange(EMPTY); }}>Clear</button>
          <button type="button" className="dm-pill dm-ink dm-sm dm-drx-ok" disabled={!start || !end} onClick={apply}>
            {applied ? <><Icon name="check" size="xs" />Applied</> : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
}
