'use client';
// The preview from designme.dev, rebuilt from the React component: the range since the pricing launch fills in.
import { useState } from 'react';
import { DateRangePicker, DateRangePickerPresets, type DateRangePickerRange } from '../components/date-range-picker/DateRangePicker';
import { useScript } from './useScript';

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
