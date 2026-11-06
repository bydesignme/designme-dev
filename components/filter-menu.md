# Filter menu

> Add filters from a menu, see them as chips, and watch the count change.

App basics / Collaboration. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/filter-menu

## Install

```sh
npx designme add filter-menu          # HTML, CSS and JS, with the shared core
npx designme add filter-menu --react  # React 19 component and its CSS
npx designme add filter-menu --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/filter-menu.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/filter-menu.json  # Astro
```

## About

Filter menu is the filter bar above a list. A Filter button opens a menu in two steps, a field and then its value, and each filter in use shows as a chip that reads like a sentence, "Status is Open". A chip's operator flips with a click, its × takes it off, and the count of matches and Clear all sit under the chips.

### When to use it

- When a list can be narrowed by a few known fields, like status, owner or date.
- When people should see at a glance which filters are on, and take one off without opening a menu.
- When the number of matches matters, so people know how far a filter narrowed the list before they read it.
- When a filter sometimes needs to read the other way, like "is not" or "older than".

### What it does

- The menu's first step lists the fields, each with its icon and, once used, its value. Picking one shows its values, with a back row to return.
- Each value can show how many items picking it would leave, with the other filters kept (`countFor`). The value in use is checked.
- One filter per field: picking a new value for a field replaces the old one. A new chip pops in; the ones already there keep still.
- Clicking a chip's operator flips it between the field's two `operators`, "is" and "is not" by default, or "within" and "older than" for a date.
- The count reads "24 issues", or "4 of 24 issues" once a filter is on, and crossfades as it changes. Clear all takes every filter off. The first few matches show under it, with "and 5 more" for the rest, or a line saying nothing matches.

### Accessibility

- The Filter button has `aria-haspopup="menu"` and `aria-expanded`. Enter, Space or the down arrow opens the menu on its first field, the up arrow on its last.
- Each step is a `role="menu"`. Fields are `menuitem`s with `aria-haspopup="menu"`, and values are `menuitemradio` items with `aria-checked`.
- Inside, the arrow keys move and wrap, Home and End jump to the ends, the right arrow opens a field's values and the left arrow goes back. Escape closes the menu and gives the focus back to the Filter button; picking a value does too.
- The chips are a list named "Filters". Each operator and × button is labelled with the whole filter, like "Remove filter Status is Open". The count is a polite live region.

## Usage in React

```tsx
import { FilterMenu } from '@/components/designme/filter-menu/FilterMenu';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { FilterMenu, type FilterMenuField, type FilterMenuFilter } from './FilterMenu';
import { avatarInk } from '../lib/motion';
import { useStory } from '../lib/useScript';

/* ---------- Filter menu: filter to open issues, then to Maya's, then take the status filter off ---------- */
const OWNERS: Record<string, [string, string]> = { MK: ['Maya Kim', 'var(--dm-av-l)'], LP: ['Leo Park', 'var(--dm-av-b)'], AR: ['Ana Ruiz', 'var(--dm-av-m)'], SC: ['Sam Cole', 'var(--dm-av-p)'] };
const STATUS: Record<string, [string, string]> = { open: ['Open', 'var(--dm-flm-open)'], prog: ['In progress', 'var(--dm-flm-prog)'], done: ['Done', 'var(--dm-flm-done)'] };
// title, status, owner and days since the last update, most recent first
const ISSUES = ([
  ['Pricing toggle hides the yearly saving', 'open', 'MK', 0], ['Plan cards wrap at 768px', 'open', 'MK', 1], ['Checkout button loses its focus ring', 'open', 'MK', 3],
  ['Invoice email shows the wrong currency', 'open', 'MK', 9], ['Seat slider skips 25', 'open', 'LP', 0], ['Coupon field accepts expired codes', 'open', 'LP', 2],
  ['Dark logo has a white edge', 'open', 'AR', 1], ['FAQ accordion jumps on open', 'open', 'AR', 5], ['Trial banner covers the nav', 'open', 'SC', 0],
  ['EU tax line rounds down', 'open', 'SC', 12], ['Annual plan link goes to a 404', 'open', 'LP', 20], ['Move pricing copy into the CMS', 'prog', 'MK', 0],
  ['Comparison table for Team', 'prog', 'MK', 2], ['Prices in yen for Japan', 'prog', 'LP', 4], ['New hero illustration', 'prog', 'AR', 1],
  ['Track plan clicks', 'prog', 'SC', 6], ['Enterprise contact form', 'prog', 'MK', 15], ['Seat limits on the Free plan', 'prog', 'AR', 3],
  ['Ship the new plan names', 'done', 'MK', 1], ['Price flicker on load', 'done', 'MK', 8], ['Remove the Starter plan', 'done', 'LP', 3],
  ['Badge for the yearly discount', 'done', 'AR', 2], ['Retry failed Stripe webhooks', 'done', 'SC', 25], ['Refund policy link', 'done', 'SC', 10]
] as [string, string, string, number][]).map(([title, status, owner, age]) => ({ title, status, owner, age })).sort((a, b) => a.age - b.age);
type Issue = (typeof ISSUES)[number];

const FIELDS: FilterMenuField[] = [
  { key: 'status', label: 'Status', icon: 'target', options: Object.entries(STATUS).map(([value, [label, color]]) => ({ value, label, glyph: <span className="dm-dot" style={{ color }} /> })) },
  { key: 'owner', label: 'Owner', icon: 'user', options: Object.entries(OWNERS).map(([value, [label, color]]) => ({ value, label, glyph: <span className="dm-av" style={{ background: color, color: avatarInk(color) }}>{value}</span> })) },
  { key: 'date', label: 'Updated', icon: 'cal', operators: ['within', 'older than'], options: [{ value: '1', label: 'Past day', chip: '1 day' }, { value: '7', label: 'Past 7 days', chip: '7 days' }, { value: '30', label: 'Past 30 days', chip: '30 days' }] }
];
const test = (t: Issue, f: FilterMenuFilter) => (f.field === 'status' ? t.status === f.value : f.field === 'owner' ? t.owner === f.value : t.age < +f.value) !== !!f.negate;

export default function FilterMenuDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<FilterMenuFilter[]>([]);
  const hits = ISSUES.filter(t => filters.every(f => test(t, f)));

  // the preview's story: filter to open issues, then to Maya's, and watch the count drop; then take the status filter off
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-flm-tr');
    await wait(1200); press('.dm-mi[data-k="status"]');
    await wait(1200); press('.dm-flm-lv:not([hidden]) .dm-mi[role="menuitemradio"]');
    await wait(2500); press('.dm-flm-tr');
    await wait(1200); press('.dm-mi[data-k="owner"]');
    await wait(1200); press('.dm-flm-lv:not([hidden]) .dm-mi[role="menuitemradio"]');
    await wait(2500); press('.dm-flm-x');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <FilterMenu fields={FIELDS} filters={filters} onFiltersChange={setFilters} total={ISSUES.length} count={hits.length}
        // each value says how many issues picking it would leave, with the other filters kept
        countFor={(field, value) => ISSUES.filter(t => filters.every(f => f.field === field || test(t, f)) && test(t, { field, value })).length}
        results={hits.slice(0, 4).map(t => ({
          id: t.title, title: t.title, meta: t.age ? t.age + 'd' : 'Today',
          dot: { color: STATUS[t.status][1], label: STATUS[t.status][0] }, avatar: { initials: t.owner, color: OWNERS[t.owner][1], label: OWNERS[t.owner][0] }
        }))} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `fields` | `FilterMenuField[]` |  |
| `filters` (optional) | `FilterMenuFilter[]` | The filters in use, in the order they were added; one per field. Leave it out to let the menu keep them |
| `defaultFilters` (optional) | `FilterMenuFilter[]` |  |
| `onFiltersChange` (optional) | `(filters: FilterMenuFilter[]) => void` |  |
| `total` | `number` | How many items there are, and how many match the filters |
| `count` | `number` |  |
| `noun` (optional) | `string` | The items' name, like "issues" |
| `countFor` (optional) | `(field: string, value: string) => number` | The number beside a value in the menu: how many items picking it would leave. Left out, no numbers show |
| `results` (optional) | `FilterMenuResult[]` | The first few matches, shown under the count |
| `emptyLabel` (optional) | `string` | Shown when nothing matches. Defaults to "No issues match these filters" with your noun |
| `label` (optional) | `string` | Defaults to "Filter" and "Clear all" |
| `clearLabel` (optional) | `string` |  |
| `open` (optional) | `boolean` | Whether the menu is open. Leave it out to let the Filter button, Escape and a click outside open and close it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import FilterMenu from '../components/designme/filter-menu/FilterMenu.astro';
---
<FilterMenu />
<FilterMenu data-style="soft" class="my-class" />
```
It plays its demo; change `filter-menu.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Does it filter my data?**

No. It keeps the filters and calls `onFiltersChange`. Filter your own data with them, and pass back `count`, `total` and the first few `results`.

**Can a field take several values, like Status is Open or In progress?**

Not as built: each field holds one value, and a new pick replaces it. For several, keep a list of values per field in your own state and show it in the chip's `chip` text.

**Can I add my own fields?**

Yes. Each field in `fields` has a `key`, a `label`, an optional `icon`, its two `operators`, and its `options`, each with an optional `glyph` like a dot or an avatar.

## Source

`FilterMenu.tsx`, as `npx designme add filter-menu --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { avatarInk, Swap, Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './filter-menu.css';

/** One value a field can be filtered by */
export interface FilterMenuOption {
  value: string;
  /** How the menu names it, like "Past 7 days" */
  label: string;
  /** How a chip names it, like "7 days". Defaults to the label */
  chip?: string;
  /** A dot, avatar or icon before the label in the menu */
  glyph?: ReactNode;
}

/** A field the menu can filter on, like Status, Owner or Updated */
export interface FilterMenuField {
  key: string;
  label: string;
  icon?: IconName;
  /** The two ways a filter on it reads, the second when it's flipped. Defaults to "is" and "is not" */
  operators?: [string, string];
  options: FilterMenuOption[];
}

/** A filter in use. `negate` reads it the other way: "is not", or the field's second operator */
export interface FilterMenuFilter {
  field: string;
  value: string;
  negate?: boolean;
}

/** A row in the results under the filters */
export interface FilterMenuResult {
  id: string;
  title: string;
  /** The colour of the dot before it, like 'var(--dm-flm-open)', and what it means, like "Open" */
  dot?: { color: string; label: string };
  /** An avatar colour, like 'var(--dm-av-l)', brings its own ink for the initials */
  avatar?: { initials: string; color: string; label: string };
  /** The quiet text at the end, like "Today" or "3d" */
  meta?: string;
}

export interface FilterMenuProps {
  fields: FilterMenuField[];
  /** The filters in use, in the order they were added; one per field. Leave it out to let the menu keep them */
  filters?: FilterMenuFilter[];
  defaultFilters?: FilterMenuFilter[];
  onFiltersChange?: (filters: FilterMenuFilter[]) => void;
  /** How many items there are, and how many match the filters */
  total: number;
  count: number;
  /** The items' name, like "issues" */
  noun?: string;
  /** The number beside a value in the menu: how many items picking it would leave. Left out, no numbers show */
  countFor?: (field: string, value: string) => number;
  /** The first few matches, shown under the count */
  results?: FilterMenuResult[];
  /** Shown when nothing matches. Defaults to "No issues match these filters" with your noun */
  emptyLabel?: string;
  /** Defaults to "Filter" and "Clear all" */
  label?: string;
  clearLabel?: string;
  /** Whether the menu is open. Leave it out to let the Filter button, Escape and a click outside open and close it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** A Filter button that adds filters from a two-step menu (a field, then its value), the filters as removable chips whose
    operator flips with a click, and the number of matches with Clear all. */
export function FilterMenu({
  fields, filters, defaultFilters = [], onFiltersChange, total, count, noun = 'issues', countFor, results = [], emptyLabel,
  label = 'Filter', clearLabel = 'Clear all', open, defaultOpen = false, onOpenChange, className
}: FilterMenuProps) {
  const [list, setList] = useControllable(filters, defaultFilters, onFiltersChange);
  const menu = usePopover({ side: 'down', open, defaultOpen, onOpenChange });
  const pop = menu.pop.ref, trigger = menu.trigger.ref;
  const root = useRef<HTMLDivElement>(null);
  // the field whose values the menu shows, or null for the list of fields
  const [field, setField] = useState<string | null>(null);
  const from = useRef<string | null>(null);
  const focusTo = useRef<'first' | 'last' | 'value' | 'field' | null>(null);
  // chips already on screen keep still when the list changes; only a new one pops in
  const seen = useRef(new Set<string>());
  useEffect(() => { seen.current = new Set(list.map(f => f.field)); }, [list]);

  const fieldOf = (k: string) => fields.find(f => f.key === k);
  const opsOf = (f?: FilterMenuField) => f?.operators ?? ['is', 'is not'];
  const optOf = (f: FilterMenuFilter) => fieldOf(f.field)?.options.find(o => o.value === f.value);
  const items = () => Array.from(pop.current?.querySelectorAll<HTMLElement>('[role="menu"]:not([hidden]) [role^="menuitem"]') ?? []);
  // the menu always opens on its list of fields
  useEffect(() => { if (!menu.open) setField(null); }, [menu.open]);
  // after opening, or moving between the two steps, the focus goes where the keys asked
  useEffect(() => {
    const to = focusTo.current; if (!menu.open || !to) return;
    focusTo.current = null;
    const all = items();
    const pick = to === 'last' ? all[all.length - 1] : to === 'value' ? (all.find(x => x.getAttribute('aria-checked') === 'true') ?? all[1]) : to === 'field' ? all.find(x => x.dataset.k === from.current) : all[0];
    (pick ?? all[0])?.focus();
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const inside = () => !!pop.current?.contains(document.activeElement);
  const step = (k: string | null) => { if (inside()) focusTo.current = k ? 'value' : 'field'; from.current = field; setField(k); };
  const apply = (k: string, value: string) => {
    const had = inside();
    setList(list.some(f => f.field === k) ? list.map(f => (f.field === k ? { field: k, value } : f)) : [...list, { field: k, value }]);
    if (had) trigger.current?.focus();
    menu.closeSoon();
  };
  const remove = (k: string, e: MouseEvent<HTMLButtonElement>) => {
    const chip = e.currentTarget.closest('.dm-flm-ch'), next = (chip?.nextElementSibling ?? chip?.previousElementSibling)?.querySelector<HTMLElement>('.dm-flm-x');
    const had = chip?.contains(document.activeElement);
    setList(list.filter(f => f.field !== k));
    if (had) setTimeout(() => (next ?? trigger.current)?.focus());
  };
  const onTrigger = (e: MouseEvent) => { if (!menu.open && e.nativeEvent.isTrusted) focusTo.current = 'first'; menu.trigger.onClick(); };
  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault(); focusTo.current = e.key === 'ArrowUp' ? 'last' : 'first';
    if (menu.open) { const all = items(); (focusTo.current === 'last' ? all[all.length - 1] : all[0])?.focus(); focusTo.current = null; } else menu.setOpen(true);
  };
  // inside the menu: the arrow keys move and wrap, Home and End jump to the ends, the right arrow opens a field's values and
  // the left arrow goes back, Tab leaves it (Escape is the popover's)
  const onMenuKey = (e: KeyboardEvent) => {
    const all = items(), i = all.indexOf(document.activeElement as HTMLElement);
    const go = ({ ArrowDown: all[(i + 1) % all.length], ArrowUp: all[(i - 1 + all.length) % all.length], Home: all[0], End: all[all.length - 1] } as Record<string, HTMLElement | undefined>)[e.key];
    if (go) { e.preventDefault(); go.focus(); }
    else if (e.key === 'ArrowRight' && !field && all[i]?.dataset.k) { e.preventDefault(); step(all[i].dataset.k!); }
    else if (e.key === 'ArrowLeft' && field) { e.preventDefault(); step(null); }
    else if (e.key === 'Tab') setTimeout(() => menu.close());
  };

  const cur = field ? fieldOf(field) : undefined, on = list.find(f => f.field === field);
  return (
    <div data-dm="" ref={root} className={cx('dm-flm dm-panel', className)}>
      <div className="dm-flm-bar">
        <button {...menu.trigger} onClick={onTrigger} onKeyDown={onTriggerKey} type="button" className="dm-pill dm-line dm-sm dm-flm-tr"><Icon name="filter" />{label}</button>
        <div className="dm-flm-chips" role="list" aria-label="Filters">
          {list.map(f => {
            const fd = fieldOf(f.field), o = optOf(f); if (!fd || !o) return null;
            const ops = opsOf(fd), op = ops[+!!f.negate], other = ops[+!f.negate], text = `${fd.label} ${op} ${o.chip ?? o.label}`;
            return (
              <div key={f.field} className={cx('dm-flm-ch', seen.current.has(f.field) && 'dm-seen')} role="listitem">
                <span className="dm-k">{fd.label}</span>
                <Tip label={`Change to ${other}`}>
                  <button type="button" className="dm-op" aria-label={`${text}: change to ${other}`} onClick={() => setList(list.map(x => (x.field === f.field ? { ...x, negate: !x.negate } : x)))}>{op}</button>
                </Tip>
                <span className="dm-v">{o.chip ?? o.label}</span>
                <Tip label="Remove filter">
                  <button type="button" className="dm-x dm-flm-x" aria-label={`Remove filter ${text}`} onClick={e => remove(f.field, e)}><Icon name="x" size="xs" /></button>
                </Tip>
              </div>
            );
          })}
        </div>
      </div>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-flm-pop')} onKeyDown={onMenuKey}>
        <div className="dm-flm-lv" role="menu" aria-label={`${label} by`} hidden={!!field}>
          <div className="dm-ph" role="none">{label} by</div>
          {fields.map(fd => {
            const f = list.find(x => x.field === fd.key), o = f && optOf(f);
            return (
              <button key={fd.key} type="button" className="dm-mi" role="menuitem" aria-haspopup="menu" tabIndex={-1} data-k={fd.key} onClick={() => step(fd.key)}>
                {fd.icon && <Icon name={fd.icon} />}<span>{fd.label}</span>
                <span className="dm-r">{o ? (f.negate ? opsOf(fd)[1] + ' ' : '') + (o.chip ?? o.label) : ''}</span><Icon name="chev-r" size="xs" />
              </button>
            );
          })}
        </div>
        <div className="dm-flm-lv" role="menu" aria-label={cur?.label} hidden={!field}>
          {cur && <>
            <button type="button" className="dm-mi dm-flm-bk" role="menuitem" tabIndex={-1} aria-label="Back to all fields" onClick={() => step(null)}><Icon name="chev-l" size="xs" /><span>{cur.label}</span></button>
            <div className="dm-sep" role="separator" />
            {cur.options.map(o => (
              <button key={o.value} type="button" className="dm-mi" role="menuitemradio" aria-checked={on?.value === o.value} tabIndex={-1} onClick={() => apply(cur.key, o.value)}>
                {o.glyph}<span>{o.label}</span>{countFor && <span className="dm-r dm-num">{countFor(cur.key, o.value)}</span>}<span className="dm-ck"><Icon name="check" size="xs" /></span>
              </button>
            ))}
          </>}
        </div>
      </div>
      <div className="dm-flm-sum">
        <span aria-live="polite"><Swap className="dm-flm-ct dm-num">{list.length ? `${count} of ${total} ${noun}` : `${total} ${noun}`}</Swap></span>
        {list.length > 0 && <button type="button" className="dm-pill dm-ghost dm-sm dm-flm-clr" onClick={e => { const had = e.currentTarget === document.activeElement; setList([]); if (had) trigger.current?.focus(); }}>{clearLabel}</button>}
      </div>
      <div className="dm-flm-list">
        {count === 0 ? <div className="dm-flm-e">{emptyLabel ?? `No ${noun} match these filters`}</div> : <>
          {results.map((t, i) => (
            <div key={t.id} className="dm-flm-r dm-enter" style={{ animationDelay: i * 50 + 'ms' }}>
              {t.dot ? <span className="dm-dot" style={{ color: t.dot.color }} role="img" aria-label={t.dot.label} /> : <span />}
              <span className="dm-t">{t.title}</span>
              {t.avatar ? <span className="dm-av" style={{ background: t.avatar.color, color: avatarInk(t.avatar.color) }} role="img" aria-label={t.avatar.label}>{t.avatar.initials}</span> : <span />}
              <span className="dm-a">{t.meta}</span>
            </div>
          ))}
          {count > results.length && <div className="dm-flm-more">and {count - results.length} more</div>}
        </>}
      </div>
    </div>
  );
}
```

## More in Collaboration

- [Banner](https://designme.dev/components/banner.md): An announcement on a tint of its tone, with its own line drawing.
- [Comments](https://designme.dev/components/comments.md): A design thread where you can @mention the agent and it replies.
- [Notifications](https://designme.dev/components/notifications.md): An inbox where agent updates and mentions arrive live.
- [Invite to collaborate](https://designme.dev/components/invite-to-collaborate.md): Add teammates by email as chips, set their role, send.
- [Reactions](https://designme.dev/components/reactions.md): Quick reactions on an agent update, with counts that pop.
- [Profile menu](https://designme.dev/components/profile-menu.md): The account menu behind an avatar: switch workspace, theme, shortcuts and sign out.
- [Context menu](https://designme.dev/components/context-menu.md): Right-click an agent reply for its actions, with a submenu that asks the agent about it.
- [Context switcher](https://designme.dev/components/context-switcher.md): The organisation, project and environment you are in, each part a searchable switcher.
- [Number field](https://designme.dev/components/number-field.md): Type a number or step it with minus and plus, with units, limits and a word when a value is changed to fit.
- [Ticket list](https://designme.dev/components/ticket-list.md): Support tickets the agent has triaged, with suggested replies.
- [Kanban board](https://designme.dev/components/kanban-board.md): A sprint board where you and the agent move cards, with filters, details and keyboard moves.

All components: https://designme.dev/llms.txt
