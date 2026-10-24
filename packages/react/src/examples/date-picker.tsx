'use client';
// The preview from designme.dev, rebuilt from the React component: the calendar opens and someone types "next friday".
import { useRef, useState } from 'react';
import { DatePicker } from '../components/date-picker/DatePicker';
import { useStory } from './useScript';

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
