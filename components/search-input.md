# Search input

> Search with scoped filters, recent queries and an agent answer.

App basics / Forms and inputs. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/search-input

## Install

```sh
npx designme add search-input          # HTML, CSS and JS, with the shared core
npx designme add search-input --react  # React 19 component and its CSS
npx designme add search-input --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/search-input.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/search-input.json  # Astro
```

## About

Search input is a search box that opens to show recent searches, matching results, and an answer from the agent above them. Typing @ lists sources such as Figma or Notion, and picking one narrows the search to that source with a removable chip. It lets a person find a file directly or ask a question and get a written answer in the same box.

### When to use it

- When people search across several connected tools and need to narrow to one
- When a question typed into search should get an agent answer as well as matching files
- When the empty box should offer recent searches to pick up where someone left off
- When nothing matches and Enter should hand the query to the agent

### What it does

- While the box is empty it lists `recent` searches, and picking one fills the box.
- Typing @ lists your `sources`; picking one sets the `scope` chip, and Backspace in an empty box removes it.
- Results show their source, and the matched word in each label is highlighted.
- The `answer` string appears above the results, and each new word fades in as you feed it more text.
- By default an item matches the whole search or any word longer than two letters, and `filter` replaces that rule.
- Enter picks the highlighted row through `onSelect`, or calls `onSubmit` with the search and scope when no row is highlighted.

### Accessibility

- The input is a `combobox` with `aria-expanded`, `aria-controls` and `aria-autocomplete="list"`, and the results are a `listbox` of `option` rows.
- Arrow Up and Arrow Down move the highlight, which is announced through `aria-activedescendant` and `aria-selected`.
- Enter picks or submits, Escape closes the list and keeps the focus in the box, and a second Escape clears it.
- The list's height animation is skipped when the user prefers reduced motion.

## Usage in React

```tsx
import { SearchInput } from '@/components/designme/search-input/SearchInput';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { SearchInput, type SearchInputItem, type SearchInputSource } from './SearchInput';
import { useStory } from '../lib/useScript';

const ITEMS: SearchInputItem[] = [
  { icon: 'figma', label: 'Pricing v4', source: 'Figma' }, { icon: 'figma', label: 'Pricing mobile', source: 'Figma' },
  { icon: 'file-text', label: 'Pricing research notes', source: 'Notion' }, { icon: 'code', label: 'PricingCard.tsx', source: 'GitHub' },
  { icon: 'figma', label: 'Checkout flow', source: 'Figma' }, { icon: 'file-text', label: 'Brand voice guide', source: 'Notion' },
  { icon: 'code', label: 'tokens.css', source: 'GitHub' }
];
const SOURCES: SearchInputSource[] = [{ key: 'figma', label: 'Figma', icon: 'figma' }, { key: 'notion', label: 'Notion', icon: 'file-text' }, { key: 'github', label: 'GitHub', icon: 'code' }];
const RECENT = ['pricing contrast', 'checkout copy', 'tokens'];
const ANSWER = 'Pricing changed on Sep 18: annual plans first, one CTA per card. Trial to paid is up 8.1 points since.'.split(' ');

/* ---------- Search input: the box lifts, then someone asks a question and the agent answers above the results ---------- */
export default function SearchInputDemo() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [answer, setAnswer] = useState('');
  // the preview types a question on its own; clicking, focusing or typing in it takes over, and what it had typed goes
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait, taken }) => {
    await wait(900); setOpen(true);
    await wait(600);
    let typed = '', typing = true;
    taken(() => { if (typing) setValue(''); });
    for (const ch of 'why did pricing change?') { typed += ch; setValue(typed); await wait(45); }
    typing = false;
  });
  // a question gets an answer, a word every 45ms, which keeps going while the question is still being typed
  const v = value.trim(), asking = v.split(' ').length > 2 || v.endsWith('?');
  useEffect(() => {
    if (!asking) { setAnswer(''); return; }
    let n = 0;
    const id = setInterval(() => { n++; setAnswer(ANSWER.slice(0, n).join(' ')); if (n >= ANSWER.length) clearInterval(id); }, 45);
    return () => clearInterval(id);
  }, [asking]);
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <SearchInput items={ITEMS} sources={SOURCES} recent={RECENT} value={value} onValueChange={setValue} open={open} onOpenChange={setOpen}
        answer={asking ? answer : undefined} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `items` | `SearchInputItem[]` |  |
| `sources` (optional) | `SearchInputSource[]` | Typing @ lists these, and picking one adds it as a filter chip |
| `recent` (optional) | `string[]` | Earlier searches, shown while the box is empty |
| `value` (optional) | `string` | What is typed. Leave it out to let the box hold its own |
| `defaultValue` (optional) | `string` |  |
| `onValueChange` (optional) | `(value: string) => void` |  |
| `scope` (optional) | `string \| null` | The source filter, by label, or null. Backspace in an empty box removes it |
| `defaultScope` (optional) | `string \| null` |  |
| `onScopeChange` (optional) | `(scope: string \| null) => void` |  |
| `open` (optional) | `boolean` | Whether the box is lifted with its results open. Focus opens it and leaving closes it when you leave it out |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `answer` (optional) | `string` | An answer from the agent, shown above the results. Feed it as it grows and each new word fades in |
| `filter` (optional) | `(item: SearchInputItem, search: string) => boolean` | Which items match the search. By default an item matches the whole search or any word longer than two letters |
| `onSelect` (optional) | `(item: SearchInputItem) => void` | Called when a result is picked, by click or Enter |
| `onSubmit` (optional) | `(search: string, scope: string \| null) => void` | Called by Enter when no row is highlighted, with the search and the source filter |
| `placeholder` (optional) | `string` |  |
| `shortcut` (optional) | `string` | The key hint at the end of the empty box |
| `emptyLabel` (optional) | `string` | What the list says when nothing matches |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import SearchInput from '../components/designme/search-input/SearchInput.astro';
---
<SearchInput />
<SearchInput data-style="soft" class="my-class" />
```
It plays its demo; change `search-input.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I stream the agent's answer into the results?**

Pass the text so far as `answer` and update it as tokens arrive. Each word is its own span, so new words fade in while earlier ones stay put.

**What happens when the person presses Enter without picking a result?**

`onSubmit` is called with the trimmed search and the current source filter, or null. That is the place to send the question to your agent.

**Can I use my own matching, like fuzzy search?**

Yes. Pass `filter(item, search)` and return true for the items to keep. The source filter is still applied first.

## Source

`SearchInput.tsx`, as `npx designme add search-input --react` installs it:

```tsx
'use client';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Fold, useReflow } from '../lib/motion';
import '../designme.css';
import './search-input.css';

/** Something the box can find, like a Figma frame or a doc */
export interface SearchInputItem {
  icon: IconName;
  /** Its name. The part that matches the search is marked */
  label: string;
  /** Where it lives, like "Figma". A source filter keeps only the items whose source is its label */
  source: string;
}

/** A source you can narrow the search to by typing @ and its key, like @figma */
export interface SearchInputSource {
  key: string;
  /** Its name, like "Figma". It becomes the filter chip */
  label: string;
  icon: IconName;
}

export interface SearchInputProps {
  items: SearchInputItem[];
  /** Typing @ lists these, and picking one adds it as a filter chip */
  sources?: SearchInputSource[];
  /** Earlier searches, shown while the box is empty */
  recent?: string[];
  /** What is typed. Leave it out to let the box hold its own */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** The source filter, by label, or null. Backspace in an empty box removes it */
  scope?: string | null;
  defaultScope?: string | null;
  onScopeChange?: (scope: string | null) => void;
  /** Whether the box is lifted with its results open. Focus opens it and leaving closes it when you leave it out */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** An answer from the agent, shown above the results. Feed it as it grows and each new word fades in */
  answer?: string;
  /** Which items match the search. By default an item matches the whole search or any word longer than two letters */
  filter?: (item: SearchInputItem, search: string) => boolean;
  /** Called when a result is picked, by click or Enter */
  onSelect?: (item: SearchInputItem) => void;
  /** Called by Enter when no row is highlighted, with the search and the source filter */
  onSubmit?: (search: string, scope: string | null) => void;
  placeholder?: string;
  /** The key hint at the end of the empty box */
  shortcut?: string;
  /** What the list says when nothing matches */
  emptyLabel?: string;
  className?: string;
}

// words too common to match on, as on designme.dev
const STOP = ['why', 'did', 'the', 'how', 'what', 'does'];
const wordsOf = (search: string) => search.toLowerCase().split(/[^a-z0-9.]+/).filter(w => w.length > 2 && !STOP.includes(w));
const matchAny = (item: SearchInputItem, search: string) => {
  const l = item.label.toLowerCase();
  return !search || l.includes(search.toLowerCase()) || wordsOf(search).some(w => l.includes(w));
};
// marks the first place the word appears
const marked = (label: string, word: string): ReactNode => {
  const at = word ? label.toLowerCase().indexOf(word.toLowerCase()) : -1;
  return at < 0 ? label : <>{label.slice(0, at)}<mark>{label.slice(at, at + word.length)}</mark>{label.slice(at + word.length)}</>;
};

type Row = { kind: 'recent'; search: string } | { kind: 'source'; source: SearchInputSource } | { kind: 'item'; item: SearchInputItem };

const rowKey = (r: Row) => r.kind === 'item' ? 'i:' + r.item.label + '|' + r.item.source : r.kind === 'recent' ? 'r:' + r.search : 's:' + r.source.key;

/** Search with source filters, recent searches and an answer from the agent. Type @ to filter by source. */
export function SearchInput({ items, sources = [], recent = [], value, defaultValue = '', onValueChange, scope, defaultScope = null, onScopeChange,
  open, defaultOpen = false, onOpenChange, answer, filter = matchAny, onSelect, onSubmit, placeholder = 'Search frames, files and docs',
  shortcut = '⌘K', emptyLabel = 'No matches. Press Enter to ask the agent', className }: SearchInputProps) {
  const [text, setText] = useControllable(value, defaultValue, onValueChange);
  const [sc, setScope] = useControllable(scope, defaultScope, onScopeChange);
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const v = text.trim();
  const root = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null);
  const id = useId();

  // while the box is open, rows that were showing a moment ago glide to their new places as the answer comes and goes or the
  // results narrow, new rows and the answer fade in, and rows that no longer match fade where they were, so typing never
  // restarts the list; the list eases to its new height
  const [opens, setOpens] = useState(0), [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) { setWasOpen(isOpen); if (isOpen) setOpens(opens + 1); }

  const at = /@\w*$/.test(v) && sources.length ? v.split('@').pop()!.toLowerCase() : null;
  const found = items.filter(it => (!sc || it.source === sc) && filter(it, v));
  const word = wordsOf(v).find(w => found.some(it => it.label.toLowerCase().includes(w))) || v;
  const mode = at !== null ? 'sources' : !v && !sc ? 'recent' : 'results';
  const rows: Row[] = mode === 'sources' ? sources.filter(s => s.key.startsWith(at!)).map(source => ({ kind: 'source', source }))
    : mode === 'recent' ? recent.map(search => ({ kind: 'recent', search }))
    : found.map(item => ({ kind: 'item', item }));
  const paint = `${opens}|${text}|${sc}`;
  // places are read against the box, which glides as the list opens under it
  const list = useRef<HTMLDivElement>(null), field = useRef<HTMLDivElement>(null);
  useReflow(field, '.dm-six-res > [data-key]', { host: list });
  const lastH = useRef(0), grow = useRef<Animation | null>(null), reduce = useReducedMotion();
  useIsoLayoutEffect(() => {
    const el = list.current; if (!el) { lastH.current = 0; return; }
    const from = grow.current?.playState === 'running' ? el.getBoundingClientRect().height : lastH.current;
    grow.current?.cancel(); grow.current = null;
    const to = el.getBoundingClientRect().height; lastH.current = to;
    if (!isOpen || !from || Math.abs(from - to) < 1 || reduce || !el.animate) return;
    grow.current = el.animate([{ height: from + 'px', boxSizing: 'border-box', overflow: 'hidden' }, { height: to + 'px', boxSizing: 'border-box', overflow: 'hidden' }], { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)' });
  });

  // the highlight only moves with the arrow keys, and starts afresh with each new list
  const [hi, setHi] = useState({ at: -1, for: paint });
  const cur = hi.for === paint && hi.at < rows.length ? hi.at : -1;

  // a click outside lowers the box, unless the cursor is still in it
  useEffect(() => {
    if (!isOpen) return;
    const down = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node) && document.activeElement !== input.current) setOpen(false); };
    document.addEventListener('pointerdown', down);
    return () => document.removeEventListener('pointerdown', down);
  }, [isOpen, setOpen]);

  const pick = (row: Row) => {
    if (row.kind === 'recent') setText(row.search);
    else if (row.kind === 'source') { setScope(row.source.label); setText(text.replace(/@\w*$/, '')); }
    else onSelect?.(row.item);
  };
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); if (!isOpen) setOpen(true);
      if (rows.length) setHi({ at: cur < 0 ? (e.key === 'ArrowDown' ? 0 : rows.length - 1) : (cur + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length, for: paint });
    } else if (e.key === 'Enter') { if (cur >= 0) pick(rows[cur]); else onSubmit?.(v, sc); }
    // Escape closes the list and keeps the focus in the box; a second Escape clears it
    else if (e.key === 'Escape') { e.preventDefault(); if (isOpen) setOpen(false); else if (text || sc) { setText(''); setScope(null); } }
    else if (e.key === 'Backspace' && !text && sc) setScope(null);
  };
  // rows are picked on mousedown, so the cursor stays in the box
  const row = (r: Row, i: number, body: ReactNode) => {
    const k = rowKey(r);
    return (
      <button key={k} data-key={k} type="button" tabIndex={-1} id={`${id}-${i}`} role="option" aria-selected={i === cur} className={cx('dm-six-it', i === cur && 'dm-hl')}
        onMouseDown={ev => { ev.preventDefault(); pick(r); }}>{body}</button>
    );
  };

  const words = answer?.split(' ').filter(Boolean) ?? [];
  return (
    <div data-dm="" ref={root} className={cx('dm-six', className)}>
      <div ref={field} className={cx('dm-six-box', isOpen && 'dm-f')}>
        <div className="dm-six-in">
          <Icon name="search" size="xs" />
          <span className="dm-six-chips">
            {sc && <span key={sc} className="dm-six-ch dm-enter">{sc}<button type="button" aria-label="Remove filter" onMouseDown={e => { e.preventDefault(); setScope(null); }}><Icon name="x" size="xs" /></button></span>}
          </span>
          <input ref={input} placeholder={placeholder} aria-label="Search" spellCheck={false} value={text} role="combobox" aria-expanded={isOpen}
            aria-controls={`${id}-list`} aria-autocomplete="list" aria-activedescendant={isOpen && cur >= 0 ? `${id}-${cur}` : undefined}
            onChange={e => setText(e.target.value)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onKeyDown={key} />
          <span className="dm-kbd" hidden={!!v || !!sc}>{shortcut}</span>
          <button type="button" className="dm-ib dm-six-x" aria-label="Clear" hidden={!v && !sc} onMouseDown={e => { e.preventDefault(); setText(''); setScope(null); }}><Icon name="x" size="xs" /></button>
        </div>
        <Fold open={isOpen}>
          <div key={opens} ref={list} className="dm-six-res" id={`${id}-list`} role="listbox" aria-label="Results">
            {mode === 'sources' && <>
              <div className="dm-six-g" data-key="g">Filter by source</div>
              {rows.map((r, i) => r.kind === 'source' && row(r, i, <><span className="dm-ic"><Icon name={r.source.icon} size="xs" /></span>{r.source.label}<span className="dm-d">@{r.source.key}</span></>))}
            </>}
            {mode === 'recent' && !!rows.length && <>
              <div className="dm-six-g" data-key="g">Recent</div>
              {rows.map((r, i) => r.kind === 'recent' && row(r, i, <><span className="dm-ic"><Icon name="history" size="xs" /></span>{r.search}</>))}
            </>}
            {mode === 'results' && <>
              {answer !== undefined && <div className="dm-six-ans" data-key="ans"><Icon name="spark" size="xs" /><span>{words.map((w, i) => <span key={i} className="dm-w">{w} </span>)}</span></div>}
              {rows.length ? <>
                <div className="dm-six-g" data-key="g">{rows.length} {rows.length === 1 ? 'result' : 'results'}</div>
                {rows.map((r, i) => r.kind === 'item' && row(r, i, <><span className="dm-ic"><Icon name={r.item.icon} size="xs" /></span><span>{marked(r.item.label, word)}</span><span className="dm-d">{r.item.source}</span></>))}
              </> : <div className="dm-six-g" data-key="g">{emptyLabel}</div>}
            </>}
          </div>
        </Fold>
      </div>
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
- [Country select](https://designme.dev/components/country-select.md): A searchable select with country codes, currency and keyboard support.
- [Multi-select](https://designme.dev/components/multi-select.md): A combobox that filters as you type and keeps your picks as chips.
- [Colour picker](https://designme.dev/components/color-picker.md): Pick a colour by eye or by hex, check its contrast, and let the agent fix it or make a scale from it.
- [Social sign-in](https://designme.dev/components/social-sign-in.md): One-tap providers that remember the last one you used.
- [Sign in](https://designme.dev/components/sign-in.md): Email first, then the one-time code from the email, copied or typed in.
- [OTP field](https://designme.dev/components/otp-field.md): A one-time code, one box per digit, that fills from a paste.
- [Form](https://designme.dev/components/form.md): A project brief with inline checks and an agent that drafts the rest.
- [Payment form](https://designme.dev/components/payment-form.md): Card details with live formatting, brand detection and a clear total.
- [Carousel](https://designme.dev/components/carousel.md): Drafts the agent made to keep one of, or a gallery of pictures, on one swipeable track.

All components: https://designme.dev/llms.txt
