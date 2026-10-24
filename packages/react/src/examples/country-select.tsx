'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { CountrySelect, type CountrySelectCountry } from '../components/country-select/CountrySelect';
import { useStory } from './useScript';

const COUNTRIES: CountrySelectCountry[] = [
  { code: 'US', name: 'United States', currency: 'USD' }, { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'DE', name: 'Germany', currency: 'EUR' }, { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' }, { code: 'IE', name: 'Ireland', currency: 'EUR' },
  { code: 'IT', name: 'Italy', currency: 'EUR' }, { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'CA', name: 'Canada', currency: 'CAD' }, { code: 'ES', name: 'Spain', currency: 'EUR' },
  { code: 'SE', name: 'Sweden', currency: 'SEK' }, { code: 'AU', name: 'Australia', currency: 'AUD' }
];

/* ---------- Country select: the list opens, someone types "ger" and picks Germany ---------- */
export default function CountrySelectDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [value, setValue] = useState('GB');
  // the story stops at the visitor's first click or key, so it never types into their search or picks over their choice
  useStory(ref, async ({ wait }) => {
    await wait(900); setQuery(''); setOpen(true);
    await wait(500);
    let typed = '';
    for (const ch of 'ger') { typed += ch; setQuery(typed); await wait(160); }
    await wait(1100); setValue('DE'); setOpen(false);
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <CountrySelect countries={COUNTRIES} value={value} onValueChange={setValue} open={open} onOpenChange={setOpen} query={query} onQueryChange={setQuery} />
    </div>
  );
}
