'use client';
// The preview from designme.dev, rebuilt from the React component: the calendar opens and someone types "next friday".
import { useState } from 'react';
import { DatePicker } from '../components/date-picker/DatePicker';
import { useScript } from './useScript';

const TODAY = new Date(2026, 9, 19);

/* ---------- Date picker: a field that opens a calendar and reads plain English ---------- */
export default function DatePickerDemo() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  useScript(async ({ wait }) => {
    await wait(800); setOpen(true);
    await wait(500);
    const s = 'next friday';
    for (let k = 1; k <= s.length; k++) { setQuery(s.slice(0, k)); await wait(70); }
  });
  return (
    <div style={{ width: '100%' }}>
      <DatePicker today={TODAY} defaultMonth={TODAY} placeholder="Pick a launch date" open={open} onOpenChange={setOpen} query={query} onQueryChange={setQuery} />
    </div>
  );
}
