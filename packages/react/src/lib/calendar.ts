// Date maths for the calendar components (date picker, date range picker, event calendar, agenda).
// Every Date here stands for a whole day: local time, midnight. Helpers never change the Date you pass in.

/** The day a week starts on: 0 for Sunday, 1 for Monday */
export type WeekStart = 0 | 1;

/** The same day at midnight */
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
/** The first day of the month */
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
/** The first day of the quarter: Jan 1, Apr 1, Jul 1 or Oct 1 */
export const startOfQuarter = (d: Date) => new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1);
/** The first day of the week the day is in */
export const startOfWeek = (d: Date, weekStart: WeekStart = 1) => addDays(d, -weekdayIndex(d, weekStart));
/** How many days the month has */
export const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

/** `n` days later (or earlier, when negative). Safe across daylight saving changes */
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
/** `n` months later, keeping the day where the month allows it (Jan 31 + 1 month is Feb 28) */
export function addMonths(d: Date, n: number) {
  const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
  return new Date(first.getFullYear(), first.getMonth(), Math.min(d.getDate(), daysInMonth(first)));
}

/** A number that sorts days in order, like 20261019 for Oct 19, 2026 */
export const dayKey = (d: Date) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
/** The day as "2026-10-19" */
export const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
/** Reads "2026-10-19" back into a local Date */
export function fromIsoDay(s: string) {
  const [y, m, day] = s.split('-').map(Number);
  return new Date(y, m - 1, day);
}

export const sameDay = (a?: Date | null, b?: Date | null) => !!a && !!b && dayKey(a) === dayKey(b);
export const sameMonth = (a?: Date | null, b?: Date | null) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
/** Negative when `a` is before `b`, 0 on the same day, positive after */
export const compareDays = (a: Date, b: Date) => dayKey(a) - dayKey(b);
/** Whole days from `a` to `b` (Oct 1 to Oct 3 is 2) */
export const daysBetween = (a: Date, b: Date) =>
  Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 864e5);
/** True when the day falls between `start` and `end`, both included */
export const inRange = (d: Date, start?: Date | null, end?: Date | null) => !!start && !!end && dayKey(d) >= dayKey(start) && dayKey(d) <= dayKey(end);
/** The day's column in a week that starts on `weekStart`: 0 to 6 */
export const weekdayIndex = (d: Date, weekStart: WeekStart = 1) => (d.getDay() - weekStart + 7) % 7;

/** Every day of the month, in order */
export const monthDays = (month: Date) => Array.from({ length: daysInMonth(month) }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1));

/** The days a month view shows: whole weeks from the one holding the 1st, `weeks` of them (6 fits every month) */
export function monthGrid(month: Date, weekStart: WeekStart = 1, weeks = 6) {
  const start = startOfWeek(startOfMonth(month), weekStart);
  return Array.from({ length: weeks * 7 }, (_, i) => addDays(start, i));
}

/** Weekday names for the column heads, in week order, like M T W T F S S */
export function weekdayNames(locale = 'en-US', weekStart: WeekStart = 1, style: 'narrow' | 'short' | 'long' = 'narrow') {
  const f = new Intl.DateTimeFormat(locale, { weekday: style });
  // Jan 4, 2026 is a Sunday
  return Array.from({ length: 7 }, (_, i) => f.format(new Date(2026, 0, 4 + weekStart + i)));
}

/** "October 2026" */
export const formatMonth = (d: Date, locale = 'en-US') => d.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

/**
 * Where a calendar key moves the focused day: the arrows move a day or a week, Home and End go to the start or end
 * of the week, Page Up and Page Down move a month (a year with Shift). Returns null for any other key.
 */
export function moveDay(d: Date, key: string, weekStart: WeekStart = 1, shift = false): Date | null {
  switch (key) {
    case 'ArrowLeft': return addDays(d, -1);
    case 'ArrowRight': return addDays(d, 1);
    case 'ArrowUp': return addDays(d, -7);
    case 'ArrowDown': return addDays(d, 7);
    case 'Home': return startOfWeek(d, weekStart);
    case 'End': return addDays(startOfWeek(d, weekStart), 6);
    case 'PageUp': return addMonths(d, shift ? -12 : -1);
    case 'PageDown': return addMonths(d, shift ? 12 : 1);
    default: return null;
  }
}

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/**
 * Reads the plain English people type into a date field, the way designme.dev's date picker does:
 * "today", "tomorrow", a weekday ("friday", "next friday": the next one, never today) and "in 3 days", "in 2 weeks", "in 1 month".
 * Returns null when it finds no date.
 */
export function parseRelativeDay(text: string, today: Date): Date | null {
  const s = text.toLowerCase().trim();
  const n = s.match(/in (\d+) (day|week|month)s?/);
  if (n) return n[2] === 'month' ? addMonths(today, +n[1]) : addDays(today, +n[1] * (n[2] === 'week' ? 7 : 1));
  const wd = WEEKDAYS.findIndex(w => s.includes(w));
  if (wd >= 0) return addDays(today, (wd - today.getDay() + 7) % 7 || 7);
  if (s === 'today') return startOfDay(today);
  if (s === 'tomorrow') return addDays(today, 1);
  return null;
}
