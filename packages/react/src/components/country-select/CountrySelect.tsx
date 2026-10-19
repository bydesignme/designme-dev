'use client';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import { Flag, type FlagCode } from '../../lib/flags';
import { Icon } from '../../lib/icons';
import { Swap } from '../../lib/motion';
import '../../designme.css';
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
  };

  return (
    <div data-dm="" ref={root} className={cx('dm-csx', className)}>
      <label className="dm-csx-l" htmlFor={`${id}-f`}>{label}</label>
      <button ref={field} id={`${id}-f`} type="button" className="dm-csx-f" aria-haspopup="listbox" aria-expanded={isOpen}
        onClick={() => (isOpen ? close() : openList())} onKeyDown={e => { if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !isOpen) { e.preventDefault(); openList(); } }}>
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
