'use client';
// The preview from designme.dev, rebuilt from the React component: the picker opens, the range since the pricing launch fills
// in, and Apply closes it with the range in the field.
import { useRef, useState } from 'react';
import { DateRangePicker, DateRangePickerPresets, type DateRangePickerRange } from '../components/date-range-picker/DateRangePicker';
import { useStory } from './useScript';

const TODAY = new Date(2026, 9, 19), LAUNCH = new Date(2026, 8, 18);
const PRESETS = [...DateRangePickerPresets, { key: 'launch', label: 'Since pricing launch', range: (t: Date): [Date, Date] => [LAUNCH, t] }];

/* ---------- Date range picker: a field that opens ready-made ranges, two months, a hover preview, then Apply ---------- */
export default function DateRangePickerDemo() {
  const [range, setRange] = useState<DateRangePickerRange>({ start: null, end: null });
  const [open, setOpen] = useState(false);
  // the preview opens the picker, picks Since pricing launch and applies it, unless you take over first
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait }) => { await wait(900); setOpen(true); await wait(900); setRange({ start: LAUNCH, end: TODAY }); await wait(1900); setOpen(false); });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <DateRangePicker today={TODAY} defaultMonth={new Date(2026, 8, 1)} presets={PRESETS} value={range} onValueChange={setRange} open={open} onOpenChange={setOpen} />
    </div>
  );
}
