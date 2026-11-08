# Multi-select

> A combobox that filters as you type and keeps your picks as chips.

App basics / Forms and inputs. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/multi-select

## Install

```sh
npx designme add multi-select          # HTML, CSS and JS, with the shared core
npx designme add multi-select --react  # React 19 component and its CSS
npx designme add multi-select --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/multi-select.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/multi-select.json  # Astro
```

## About

Multi-select is a combobox for picking several things from a long list. Typing filters the list, the arrow keys move through it and Enter picks, and each pick becomes a chip in the box with its own remove button. Backspace in an empty box takes the last chip off, so a wrong pick is one key away from gone.

### When to use it

- When people pick several items from a list too long to show at once, like tags, teammates or labels.
- When people know what they want and would rather type a few letters than scroll.
- When the picks should stay visible as chips that are easy to remove one by one.
- Not for picking one item: use a select or a combobox with a single value then.

### What it does

- `options` are the choices, each with a `value`, an optional `label` and quiet `meta` at the end of the row, like how many files carry a tag.
- `value`, `defaultValue` and `onValueChange` hold the picks in the order they were made, shown as chips before the text box.
- Typing filters the list by name; `query` and `onQueryChange` hold the text, and `empty` is the line when nothing matches.
- Each row has a checkbox: Enter or a click picks a row that isn't picked and unpicks one that is. The box clears for the next search.
- Each chip has a remove button, and Backspace in an empty box removes the last chip. While anything is picked, Clear all beside the label takes every chip off and puts the cursor back in the box; `clearLabel` changes its words.
- The list opens under the box and moves down as the chips wrap onto more lines. `open`, `defaultOpen` and `onOpenChange` hold whether it's open; a click outside closes it.

### Accessibility

- The text box has `role="combobox"` with `aria-expanded`, `aria-controls` and `aria-autocomplete="list"`, and the label is tied to it.
- The list is a `listbox` with `aria-multiselectable`, and each row an `option` with `aria-selected`.
- The focus stays in the text box: ↑ and ↓ move the highlight, which `aria-activedescendant` points to, Enter picks, and Escape closes the list.
- Each chip's remove button is named for its tag, like "Remove Pricing".

## Usage in React

```tsx
import { MultiSelect } from '@/components/designme/multi-select/MultiSelect';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { MultiSelect } from './MultiSelect';
import { useStory } from '../lib/useScript';

/* ---------- Multi-select: add Pricing, pick Tooltips by mistake and take it off with Backspace, then add Tokens ---------- */
// tags for the pricing page, and how many files carry each
const TAGS: [string, number][] = [['Accessibility', 14], ['Billing', 9], ['Copy', 22], ['Design system', 31], ['Launch', 12], ['Mobile', 18], ['Onboarding', 7], ['Pricing', 16], ['Research', 11], ['Tokens', 25], ['Tooltips', 6]];

export default function MultiSelectDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [tags, setTags] = useState(['Launch']);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  // the preview's story types and presses keys in the box without taking the focus
  useStory(ref, async ({ wait, taken }) => {
    const key = (k: string) => ref.current?.querySelector('[role="combobox"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
    // taking over takes back the letters it was typing
    taken(() => setQuery(''));
    const type = async (t: string) => { for (const ch of t) { setQuery(q => q + ch); await wait(200); } };
    await wait(1500); setOpen(true);
    await wait(1000); await type('pri'); await wait(500); key('Enter');
    await wait(1000); await type('to'); await wait(500); key('ArrowDown');
    await wait(1000); key('Enter');
    await wait(1500); key('Backspace');
    await wait(1000); await type('tok'); await wait(500); key('Enter');
    await wait(1000); key('Escape');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <MultiSelect label="Tags" options={TAGS.map(([t, n]) => ({ value: t, meta: String(n) }))} value={tags} onValueChange={setTags}
        query={query} onQueryChange={setQuery} open={open} onOpenChange={setOpen} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `label` | `string` | Like "Tags" |
| `options` | `MultiSelectOption[]` |  |
| `value` (optional) | `string[]` | What's picked, in the order it was picked |
| `defaultValue` (optional) | `string[]` |  |
| `onValueChange` (optional) | `(value: string[]) => void` |  |
| `query` (optional) | `string` | What's typed in the box. It filters the list |
| `defaultQuery` (optional) | `string` |  |
| `onQueryChange` (optional) | `(query: string) => void` |  |
| `open` (optional) | `boolean` |  |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `placeholder` (optional) | `string` | Defaults to "Add a tag" |
| `hint` (optional) | `string` | The quiet line under the box. Defaults to "Type to filter. Backspace removes the last tag." |
| `empty` (optional) | `string` | Shown when nothing matches. Defaults to "No tags match" |
| `clearLabel` (optional) | `string` | The button beside the label that takes every pick off, shown while something is picked. Defaults to "Clear all" |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import MultiSelect from '../components/designme/multi-select/MultiSelect.astro';
---
<MultiSelect />
<MultiSelect data-style="soft" class="my-class" />
```
It plays its demo; change `multi-select.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Can people add a tag that isn't in the list?**

Not by default. Add a row for the typed text to `options` when nothing matches, and pick it in `onValueChange`.

**Does it search a server?**

It filters the `options` you pass. To search a server, pass `query` and `onQueryChange`, fetch as the query changes, and pass the results as `options`.

**Can I limit how many are picked?**

Yes. In `onValueChange`, ignore a change that would go over the limit, and say so in the `hint`.

**Why does the list stay open after a pick?**

People usually pick several in a row. Escape, Tab or a click outside closes it.

## Source

`MultiSelect.tsx`, as `npx designme add multi-select --react` installs it:

```tsx
'use client';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../lib/hooks';
import { Icon } from '../lib/icons';
import '../designme.css';
import './multi-select.css';

export interface MultiSelectOption {
  value: string;
  /** Defaults to the value */
  label?: string;
  /** Quiet text at the end of the row, like how many files carry the tag */
  meta?: string;
}

export interface MultiSelectProps {
  /** Like "Tags" */
  label: string;
  options: MultiSelectOption[];
  /** What's picked, in the order it was picked */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** What's typed in the box. It filters the list */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Defaults to "Add a tag" */
  placeholder?: string;
  /** The quiet line under the box. Defaults to "Type to filter. Backspace removes the last tag." */
  hint?: string;
  /** Shown when nothing matches. Defaults to "No tags match" */
  empty?: string;
  /** The button beside the label that takes every pick off, shown while something is picked. Defaults to "Clear all" */
  clearLabel?: string;
  className?: string;
}

/** A combobox that keeps what you pick as chips. Typing filters the list, the arrow keys move through it, Enter picks
    or unpicks, Escape closes it, and Backspace in an empty box takes the last chip off. */
export function MultiSelect({ label, options, value, defaultValue = [], onValueChange, query, defaultQuery = '', onQueryChange, open, defaultOpen = false, onOpenChange,
  placeholder = 'Add a tag', hint = 'Type to filter. Backspace removes the last tag.', empty = 'No tags match', clearLabel = 'Clear all', className }: MultiSelectProps) {
  const id = 'dm-msc' + useId().replace(/:/g, '');
  const [picked, setPicked] = useControllable(value, defaultValue, onValueChange);
  const [q, setQ] = useControllable(query, defaultQuery, onQueryChange);
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [hi, setHi] = useState(0);
  // typing (or a new query from outside) starts the highlight at the first match again
  const [seenQ, setSeenQ] = useState(q);
  if (seenQ !== q) { setSeenQ(q); if (q) setHi(0); }
  const field = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null), list = useRef<HTMLDivElement>(null), root = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(76);
  const name = (v: string) => options.find(o => o.value === v)?.label ?? v;
  const shown = options.filter(o => !q.trim() || (o.label ?? o.value).toLowerCase().includes(q.trim().toLowerCase()));
  const at = Math.min(hi, Math.max(0, shown.length - 1));

  // the list sits under the box, which grows as the chips wrap
  useIsoLayoutEffect(() => { const f = field.current; if (f) setTop(f.offsetTop + f.offsetHeight + 6); }, [picked.length, isOpen]);
  // the highlighted row stays in view
  useEffect(() => { const o = list.current?.querySelector<HTMLElement>(`#${id}-o${at}`), l = list.current; if (!o || !l) return;
    if (o.offsetTop < l.scrollTop) l.scrollTop = o.offsetTop; else if (o.offsetTop + o.offsetHeight > l.scrollTop + l.clientHeight) l.scrollTop = o.offsetTop + o.offsetHeight - l.clientHeight; }, [at, id, isOpen]);
  // a click outside closes it
  useEffect(() => {
    if (!isOpen) return;
    const off = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', off); return () => document.removeEventListener('pointerdown', off);
  }, [isOpen, setOpen]);

  const toggle = (v: string) => {
    setPicked(picked.includes(v) ? picked.filter(x => x !== v) : [...picked, v]);
    setQ(''); setHi(Math.max(0, options.findIndex(o => o.value === v)));
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) { setOpen(true); setHi(0); return; }
      if (shown.length) setHi((at + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length);
    }
    else if (e.key === 'Enter') { e.preventDefault(); if (isOpen && shown[at]) toggle(shown[at].value); else setOpen(true); }
    else if (e.key === 'Escape') { if (isOpen) { e.preventDefault(); setOpen(false); } }
    else if (e.key === 'Backspace' && !q && picked.length) setPicked(picked.slice(0, -1));
    else if (e.key === 'Tab') setOpen(false);
  };

  return (
    <div ref={root} data-dm="" className={cx('dm-msc', className)}>
      {/* Clear all takes every chip off at once; the cursor goes back to the box, so the next tag can be typed straight away */}
      <div className="dm-msc-top">
        <label className="dm-msc-l" htmlFor={`${id}-q`}>{label}</label>
        {picked.length > 0 && <button type="button" className="dm-msc-clr" onMouseDown={e => e.preventDefault()} onClick={() => { setPicked([]); input.current?.focus(); }}>{clearLabel}</button>}
      </div>
      <div ref={field} className="dm-msc-f" onClick={e => { if ((e.target as Element).closest('.dm-msc-c')) return; input.current?.focus(); setOpen(true); }}>
        {picked.map(v => (
          <span key={v} className="dm-msc-c">{name(v)}
            <button type="button" aria-label={`Remove ${name(v)}`} onClick={e => { e.stopPropagation(); setPicked(picked.filter(x => x !== v)); }}><Icon name="x" size="xs" /></button>
          </span>
        ))}
        <input ref={input} id={`${id}-q`} className="dm-msc-q" role="combobox" aria-expanded={isOpen} aria-controls={`${id}-l`} aria-autocomplete="list" aria-haspopup="listbox"
          aria-activedescendant={isOpen && shown.length ? `${id}-o${at}` : undefined} value={q} placeholder={placeholder} spellCheck={false} autoComplete="off"
          onChange={e => { setQ(e.target.value); setHi(0); setOpen(true); }} onKeyDown={onKey} />
      </div>
      <div className={cx('dm-msc-pop', isOpen && 'dm-open')} style={{ top }}>
        <div ref={list} id={`${id}-l`} className="dm-msc-list" role="listbox" aria-multiselectable="true" aria-label={label}>
          {shown.length ? shown.map((o, i) => (
            <div key={o.value} id={`${id}-o${i}`} role="option" aria-selected={picked.includes(o.value)} className={cx('dm-msc-o', i === at && 'dm-hl')}
              onMouseMove={() => { if (i !== at) setHi(i); }} onMouseDown={e => e.preventDefault()} onClick={() => toggle(o.value)}>
              <span className="dm-bx"><Icon name="check" size="xs" /></span>{o.label ?? o.value}{o.meta && <span className="dm-n dm-num">{o.meta}</span>}
            </div>
          )) : <div className="dm-msc-none">{empty}</div>}
        </div>
      </div>
      {hint && <span className="dm-muted dm-msc-h">{hint}</span>}
    </div>
  );
}
```

## More in Forms and inputs

- [Buttons](https://designme.dev/components/buttons.md): Every button style, with loading, success and hold-to-confirm states.
- [Badge](https://designme.dev/components/badge.md): Small labels for plans, environments and status, with a dot, an icon or a remove button.
- [Progress and meter](https://designme.dev/components/progress.md): An agent run's progress and what it costs, with a credits meter that warns as it fills.
- [Slider](https://designme.dev/components/slider.md): Named stops, a stepped scale and a range, with the agent's recommended value marked on the track.
- [Tooltip](https://designme.dev/components/tooltip.md): Quiet labels on hover, with shortcuts and a richer preview card.
- [Search input](https://designme.dev/components/search-input.md): Search with scoped filters, recent queries and an agent answer.
- [Country select](https://designme.dev/components/country-select.md): A searchable select with country codes, currency and keyboard support.
- [Colour picker](https://designme.dev/components/color-picker.md): Pick a colour by eye or by hex, check its contrast, and let the agent fix it or make a scale from it.
- [Social sign-in](https://designme.dev/components/social-sign-in.md): One-tap providers that remember the last one you used.
- [Sign in](https://designme.dev/components/sign-in.md): Email first, then the one-time code from the email, copied or typed in.
- [OTP field](https://designme.dev/components/otp-field.md): A one-time code, one box per digit, that fills from a paste.
- [Form](https://designme.dev/components/form.md): A project brief with inline checks and an agent that drafts the rest.
- [Payment form](https://designme.dev/components/payment-form.md): Card details with live formatting, brand detection and a clear total.
- [Carousel](https://designme.dev/components/carousel.md): Drafts the agent made to keep one of, or a gallery of pictures, on one swipeable track.

All components: https://designme.dev/llms.txt
