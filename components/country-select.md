# Country select

> A searchable select with country codes, currency and keyboard support.

App basics / Forms and inputs. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/country-select

## Install

```sh
npx designme add country-select          # HTML, CSS and JS, with the shared core
npx designme add country-select --react  # React 19 component and its CSS
npx designme add country-select --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/country-select.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/country-select.json  # Astro
```

## About

Country select is a dropdown for picking a country, with a search box, a flag on each row and the country's currency at the end. Once a country is picked, the line under the field changes to say which currency prices will be shown in. It fits billing and account setup, where the country decides tax and currency.

### When to use it

- When a billing or checkout form needs the customer's country
- When the chosen country should set the currency people see prices in
- When the list is long enough that people would rather type than scroll
- When an agent fills in a form and the person should be able to correct the country quickly

### What it does

- Typing filters by country name, and typing a full two-letter code such as "DE" finds that country.
- Each row shows a flag, the name and its `currency` code, with a check on the chosen country.
- Twelve countries with drawn flags are built in, and your own `countries` can bring their own `flag`.
- The hint under the field switches from `hint` to `pickedHint`, which defaults to "Prices shown in EUR" style text.
- The highlight starts on the chosen country, and the list scrolls itself to keep the highlighted row in view without moving the page.
- `value`, `open` and `query` can each be controlled, so code can open the list and type into it.

### Accessibility

- The field is a button with `aria-haspopup="listbox"` and `aria-expanded`, tied to a visible `label`.
- The search box is a `combobox` that points at the highlighted `option` with `aria-activedescendant`; the chosen row has `aria-selected`.
- Arrow Down or Arrow Up on the field opens the list, the arrows move the highlight, Enter picks and Escape closes and returns focus to the field.
- Tab out of the search box closes the list.
- The closed popover is `inert`, so its contents cannot be reached by Tab.

## Usage in React

```tsx
import { CountrySelect } from '@/components/designme/country-select/CountrySelect';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { CountrySelect, type CountrySelectCountry } from './CountrySelect';
import { useStory } from '../lib/useScript';

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
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `countries` (optional) | `CountrySelectCountry[]` | Defaults to the twelve countries on designme.dev |
| `value` (optional) | `string` | The chosen country's code. Defaults to the first country |
| `defaultValue` (optional) | `string` |  |
| `onValueChange` (optional) | `(code: string) => void` |  |
| `open` (optional) | `boolean` | Whether the list is open. Leave it out to let the field toggle it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `query` (optional) | `string` | What is typed in the search box. Opening the list from the field clears it |
| `defaultQuery` (optional) | `string` |  |
| `onQueryChange` (optional) | `(query: string) => void` |  |
| `label` (optional) | `string` |  |
| `hint` (optional) | `string` | The quiet line under the field until a country is picked |
| `pickedHint` (optional) | `(country: CountrySelectCountry) => string` | The line under the field once one is picked |
| `placeholder` (optional) | `string` |  |
| `suggestedLabel` (optional) | `string` | The heading over the full list |
| `emptyLabel` (optional) | `string` |  |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import CountrySelect from '../components/designme/country-select/CountrySelect.astro';
---
<CountrySelect />
<CountrySelect data-style="soft" class="my-class" />
```
It plays its demo; change `country-select.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Can I use my own country list?**

Yes. Pass `countries` with `code`, `name` and `currency` for each one. Countries outside the twelve built-in ones show a blank flag unless you give them a `flag` node.

**How do I change the text under the field after a pick?**

Pass `pickedHint`, a function that receives the chosen country and returns a string. Before anything is picked, `hint` is shown instead.

**What is selected before the person picks anything?**

The first country in the list, unless you set `defaultValue` or control it with `value`.

## Source

`CountrySelect.tsx`, as `npx designme add country-select --react` installs it:

```tsx
'use client';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../lib/hooks';
import { Flag, type FlagCode } from '../lib/flags';
import { Icon } from '../lib/icons';
import { Swap } from '../lib/motion';
import '../designme.css';
import './country-select.css';

/** A country in the list */
export interface CountrySelectCountry {
  /** Its two-letter code, like "DE". Typing the whole code finds it */
  code: string;
  name: string;
  /** Its currency code, like "EUR", shown at the end of the row */
  currency: string;
  /** Your own flag. The countries designme.dev draws (US, GB, DE, FR, NL, IE, IT, JP, CA, SE, AU, ES) don't need one */
  flag?: ReactNode;
}

export interface CountrySelectProps {
  /** Defaults to the twelve countries on designme.dev */
  countries?: CountrySelectCountry[];
  /** The chosen country's code. Defaults to the first country */
  value?: string;
  defaultValue?: string;
  onValueChange?: (code: string) => void;
  /** Whether the list is open. Leave it out to let the field toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** What is typed in the search box. Opening the list from the field clears it */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  label?: string;
  /** The quiet line under the field until a country is picked */
  hint?: string;
  /** The line under the field once one is picked */
  pickedHint?: (country: CountrySelectCountry) => string;
  placeholder?: string;
  /** The heading over the full list */
  suggestedLabel?: string;
  emptyLabel?: string;
  className?: string;
}

const COUNTRIES: CountrySelectCountry[] = [
  { code: 'US', name: 'United States', currency: 'USD' }, { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'DE', name: 'Germany', currency: 'EUR' }, { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' }, { code: 'IE', name: 'Ireland', currency: 'EUR' },
  { code: 'IT', name: 'Italy', currency: 'EUR' }, { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'CA', name: 'Canada', currency: 'CAD' }, { code: 'ES', name: 'Spain', currency: 'EUR' },
  { code: 'SE', name: 'Sweden', currency: 'SEK' }, { code: 'AU', name: 'Australia', currency: 'AUD' }
];
const DRAWN = new Set(COUNTRIES.map(c => c.code));
const flagOf = (c?: CountrySelectCountry) => <span className="dm-csx-fl">{c?.flag ?? (c && DRAWN.has(c.code) ? <Flag code={c.code as FlagCode} /> : <span className="dm-flag" />)}</span>;

/** A searchable country select with flags and currencies. Type to filter, arrows to move, Enter to pick, Escape to close. */
export function CountrySelect({ countries = COUNTRIES, value, defaultValue, onValueChange, open, defaultOpen = false, onOpenChange, query, defaultQuery = '',
  onQueryChange, label = 'Billing country', hint = 'Used for tax and currency', pickedHint = c => `Prices shown in ${c.currency}`,
  placeholder = 'Search countries', suggestedLabel = 'Suggested', emptyLabel = 'No country found', className }: CountrySelectProps) {
  const [code, setCode] = useControllable(value, defaultValue ?? countries[0]?.code ?? '', onValueChange);
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [q, setQ] = useControllable(query, defaultQuery, onQueryChange);
  const [picked, setPicked] = useState(false);
  const chosen = countries.find(c => c.code === code);
  const v = q.trim().toLowerCase();
  const shown = countries.filter(c => !v || c.name.toLowerCase().includes(v) || c.code.toLowerCase() === v);

  const root = useRef<HTMLDivElement>(null), field = useRef<HTMLButtonElement>(null), search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null), opts = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  // the highlight starts on the chosen country, and again whenever the list changes or opens
  const [opens, setOpens] = useState(0), [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) { setWasOpen(isOpen); if (isOpen) setOpens(opens + 1); }
  const paint = `${opens}|${v}`;
  const [hi, setHi] = useState({ at: 0, for: '' });
  const at = hi.for === paint ? Math.min(hi.at, shown.length - 1) : Math.max(0, shown.findIndex(c => c.code === code));

  // keep the highlighted row in view by scrolling the list, never the page
  useIsoLayoutEffect(() => {
    const l = list.current, o = opts.current[at]; if (!isOpen || !l || !o) return;
    const lr = l.getBoundingClientRect(), r = o.getBoundingClientRect();
    if (r.top < lr.top) l.scrollTop -= lr.top - r.top; else if (r.bottom > lr.bottom) l.scrollTop += r.bottom - lr.bottom;
  }, [at, isOpen, paint]);

  // a click outside closes it
  useEffect(() => {
    if (!isOpen) return;
    const down = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', down);
    return () => document.removeEventListener('pointerdown', down);
  }, [isOpen, setOpen]);

  const openList = () => { setQ(''); setOpen(true); requestAnimationFrame(() => search.current?.focus({ preventScroll: true })); };
  const close = (refocus = false) => { setOpen(false); if (refocus) field.current?.focus({ preventScroll: true }); };
  const choose = (c: CountrySelectCountry) => { setCode(c.code); setPicked(true); close(root.current?.contains(document.activeElement) ?? false); };
  const move = (d: number) => { if (shown.length) setHi({ at: (at + d + shown.length) % shown.length, for: paint }); };
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { move(1); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { move(-1); e.preventDefault(); }
    else if (e.key === 'Enter') { if (shown[at]) choose(shown[at]); e.preventDefault(); }
    else if (e.key === 'Escape') close(true);
    // Tab moves on from the search box and closes the list
    else if (e.key === 'Tab') close();
  };

  return (
    <div data-dm="" ref={root} className={cx('dm-csx', className)}>
      <label className="dm-csx-l" htmlFor={`${id}-f`}>{label}</label>
      <button ref={field} id={`${id}-f`} type="button" className="dm-csx-f" aria-haspopup="listbox" aria-expanded={isOpen}
        onClick={() => (isOpen ? close() : openList())} onKeyDown={e => { if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return; e.preventDefault(); if (isOpen) search.current?.focus({ preventScroll: true }); else openList(); }}>
        {flagOf(chosen)}<Swap className="dm-csx-v">{chosen?.name ?? ''}</Swap><Icon name="chev-d" size="xs" />
      </button>
      <div className={cx('dm-csx-pop', isOpen && 'dm-open')} inert={!isOpen}>
        <input ref={search} className="dm-csx-q" placeholder={placeholder} aria-label={placeholder} spellCheck={false} value={q} role="combobox"
          aria-expanded={isOpen} aria-controls={`${id}-list`} aria-autocomplete="list" aria-activedescendant={shown[at] ? `${id}-${shown[at].code}` : undefined}
          onChange={e => setQ(e.target.value)} onKeyDown={key} />
        <div ref={list} className="dm-csx-list" role="listbox" id={`${id}-list`} aria-label={label}>
          {!v && <div className="dm-csx-g">{suggestedLabel}</div>}
          {shown.map((c, i) => (
            <button key={c.code} ref={el => { opts.current[i] = el; }} id={`${id}-${c.code}`} type="button" tabIndex={-1} role="option"
              aria-selected={c.code === code} className={cx('dm-csx-o', i === at && 'dm-hl')}
              onMouseEnter={() => setHi({ at: i, for: paint })} onClick={() => choose(c)}>
              {flagOf(c)}{c.name}<span className="dm-cd">{c.currency}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
            </button>
          ))}
          {!shown.length && <div className="dm-csx-g">{emptyLabel}</div>}
        </div>
      </div>
      <Swap className="dm-muted dm-csx-h">{picked && chosen ? pickedHint(chosen) : hint}</Swap>
    </div>
  );
}
```

## More in Forms and inputs

- [Buttons](https://designme.dev/components/buttons.md): Every button style, with loading, success and hold-to-confirm states.
- [Badge](https://designme.dev/components/badge.md): Labels for plans and status, with a dot, an icon or a remove button.
- [Progress and meter](https://designme.dev/components/progress.md): An agent run's progress and what it costs, with a credits meter that warns as it fills.
- [Slider](https://designme.dev/components/slider.md): Named stops, a stepped scale and a range, with the agent's recommended value marked on the track.
- [Tooltip](https://designme.dev/components/tooltip.md): Quiet labels on hover, with shortcuts and a richer preview card.
- [Search input](https://designme.dev/components/search-input.md): Search with scoped filters, recent queries and an agent answer.
- [Multi-select](https://designme.dev/components/multi-select.md): A combobox that filters as you type and keeps your picks as chips.
- [Colour picker](https://designme.dev/components/color-picker.md): Pick a colour by eye or by hex, check its contrast, and let the agent fix it or make a scale from it.
- [Social sign-in](https://designme.dev/components/social-sign-in.md): One-tap providers that remember the last one you used.
- [Sign in](https://designme.dev/components/sign-in.md): Email first, then the one-time code from the email, copied or typed in.
- [OTP field](https://designme.dev/components/otp-field.md): A one-time code, one box per digit, that fills from a paste.
- [Form](https://designme.dev/components/form.md): A project brief with inline checks and an agent that drafts the rest.
- [Payment form](https://designme.dev/components/payment-form.md): Card details with live formatting, brand detection and a clear total.
- [Carousel](https://designme.dev/components/carousel.md): Drafts the agent made to keep one of, or a gallery of pictures, on one swipeable track.

All components: https://designme.dev/llms.txt
