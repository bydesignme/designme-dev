# Context switcher

> The organisation, project and environment you are in, each part a searchable switcher.

App basics / Collaboration. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/context-switcher

## Install

```sh
npx designme add context-switcher          # HTML, CSS and JS, with the shared core
npx designme add context-switcher --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Context switcher is the breadcrumb at the top of a developer dashboard that says where you are: an organisation, a project and an environment. Each part shows its name, an optional badge like a plan ("Pro") or an environment ("Production"), and a ⇅ mark, and opens its own switcher with a search, the list with the current one ticked, and Create new at the bottom. Picking an organisation brings its projects, and picking a project brings the environment it was on.

### When to use it

- When people work across several organisations, projects or environments and need to see, on every page, which one they are in.
- When switching between them should take a couple of keys, without leaving the page.
- When the environment matters, like Production next to Staging, and a badge should make that hard to miss.
- When there are too many items for tabs, so a search in each list helps.

### What it does

- Each part is a button with the item's name, its badge and ⇅. The organisation also has a tile with its initial. When a pick changes a part, its name and badge crossfade.
- A part's switcher opens under it: a search, a line saying what the list holds ("Projects in Fernhill Labs"), the items with their badges and the current one ticked, and Create new… at the bottom, which reads Create “…” once something is typed. Typing filters the list; with nothing left, it says so.
- Picking an organisation brings its projects and picking a project brings its environments. In the HTML version each level remembers what was last picked in it; in React, the parts after a pick keep their item if their new list has it, and otherwise take the item marked `isDefault`, or the first.
- As the bar runs short, each part takes an even share of it and never more than it needs, so the names shorten alike with an ellipsis, and a name cut short shows in full in a tooltip. When the component is 560px wide or less the organisation's tile goes, and at 440px or less, phone width, only the last part shows, and a … button opens a menu with the others, each opening its own switcher.
- In HTML, each change goes out as a `context-change` event with the whole path, and Create new first sends a cancelable `context-create` event with the part and what was typed: left alone, it adds one by that name (an organisation with a first project) and picks it. In React, `onChange` gets the path and the item, and `onCreate` adds the Create new row.

### Accessibility

- The bar is a `nav` named "Context" holding an ordered list; the slashes between the parts are hidden from screen readers. Each part's button has `aria-haspopup="listbox"`, `aria-expanded` and a name with its badge, like "Environment: eu-live, Production".
- The search is a combobox with `aria-autocomplete="list"` that keeps the focus while `aria-activedescendant` follows the highlight through the listbox. Rows are options with `aria-selected`; Create new is named "Create new project" until something is typed.
- Enter, Space or the down arrow on a part opens its switcher with the focus in the search and the current item highlighted; the up arrow opens it on the last row. The arrows move and wrap, Home and End go to the ends, typing filters, Enter picks, Escape closes it and gives the focus back to the part (or to … on a phone), and Tab closes it and moves on. On the bar, the left and right arrows move between the parts; in the search, with nothing typed, they open the part before or after.
- A polite live region says what changed, like "Switched to Invoice reader (Beta), environment staging (Staging)". Every badge's text is at least 4.5:1 and APCA Lc 60 on the bar and in the list, hovered rows included, in both styles and themes.

## Usage in React

```tsx
import { ContextSwitcher } from '@/components/designme/context-switcher/ContextSwitcher';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ContextSwitcher, type ContextSwitcherItem, type ContextSwitcherSegment, type ContextSwitcherValue } from './ContextSwitcher';
import { useStory } from '../lib/useScript';

/* ---------- Context switcher: open the project's switcher, search for "inv" and pick Invoice reader; the environment
   follows it from eu-live in Production to staging ---------- */
type Project = ContextSwitcherItem & { envs: ContextSwitcherItem[] };
type Org = ContextSwitcherItem & { projects: Project[] };
const env = (id: string, kind: 'Production' | 'Staging' | 'Development', isDefault = false): ContextSwitcherItem =>
  ({ id, name: id, badge: { label: kind, tone: kind === 'Production' ? 'warning' : kind === 'Staging' ? 'blue' : 'neutral' }, isDefault });
const envs = (on: string) => [env('live', 'Production', on === 'live'), env('staging', 'Staging', on === 'staging'), env('sandbox', 'Development', on === 'sandbox')];
const ORGS: Org[] = [
  { id: 'fernhill', name: 'Fernhill Labs', tile: 'blue', badge: { label: 'Pro', tone: 'accent' }, projects: [
    { id: 'triage', name: 'Support triage agent', envs: [env('eu-live', 'Production', true), env('us-live', 'Production'), env('staging', 'Staging'), env('sandbox', 'Development')] },
    { id: 'invoice', name: 'Invoice reader', badge: { label: 'Beta', tone: 'teal' }, envs: envs('staging') },
    { id: 'research', name: 'Sales research agent', envs: envs('live') },
    { id: 'onboard', name: 'Onboarding copilot', badge: 'Paused', envs: envs('sandbox') },
    { id: 'notes', name: 'Release notes writer', envs: envs('live') }
  ] },
  { id: 'quillwork', name: 'Quillwork', tile: 'orange', badge: 'Free', projects: [
    { id: 'coach', name: 'Essay coach', envs: envs('live') },
    { id: 'cite', name: 'Citation checker', badge: { label: 'Beta', tone: 'teal' }, envs: envs('staging') }
  ] },
  { id: 'otterline', name: 'Otterline Health', tile: 'green', badge: { label: 'Enterprise', tone: 'violet' }, projects: [
    { id: 'intake', name: 'Intake assistant', envs: envs('live') },
    { id: 'claims', name: 'Claims summariser', envs: envs('live') },
    { id: 'handover', name: 'Shift handover notes', badge: { label: 'Beta', tone: 'teal' }, envs: envs('sandbox') }
  ] }
];

export default function ContextSwitcherDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [orgs, setOrgs] = useState(ORGS);
  const [value, setValue] = useState<ContextSwitcherValue>({ org: 'fernhill', project: 'triage', env: 'eu-live' });
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const org = (v: ContextSwitcherValue) => orgs.find(o => o.id === v.org) ?? orgs[0];
  const project = (v: ContextSwitcherValue) => org(v).projects.find(p => p.id === v.project) ?? org(v).projects[0];
  // each part's list comes from the parts before it, so picking an organisation brings its projects
  const segments: ContextSwitcherSegment[] = [
    { key: 'org', label: 'Organisation', items: orgs, heading: 'Your organisations' },
    { key: 'project', label: 'Project', items: v => org(v).projects, heading: v => `Projects in ${org(v).name}` },
    { key: 'env', label: 'Environment', items: v => project(v).envs, heading: v => `Environments of ${project(v).name}` }
  ];
  // Create new adds one by the name typed (an organisation comes with a first project) and picks it
  const create = (key: string, name: string) => {
    const id = `new-${Date.now()}`;
    const next = orgs.map(o => ({ ...o, projects: o.projects.map(p => ({ ...p, envs: [...p.envs] })) }));
    const o = next.find(x => x.id === value.org) ?? next[0], p = o.projects.find(x => x.id === value.project) ?? o.projects[0];
    if (key === 'org') next.push({ id, name: name || 'New organisation', tile: 'violet', badge: 'Free', projects: [{ id: id + '-p', name: 'First project', envs: envs('sandbox') }] });
    else if (key === 'project') o.projects.push({ id, name: name || 'New project', envs: envs('sandbox') });
    else p.envs.push(env(name || 'new-environment', 'Development'));
    setOrgs(next); setValue({ ...value, [key]: key === 'env' ? name || 'new-environment' : id });
  };
  // the story stops at the visitor's first click or key, so it never types into their search or picks over their choice
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); setOpen('project');
    await wait(1000);
    let typed = '';
    for (const ch of 'inv') { typed += ch; setQuery(typed); await wait(200); }
    await wait(1000); press('.dm-csw-o.dm-hl');
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ContextSwitcher segments={segments} value={value} onChange={setValue} onCreate={create}
        open={open} onOpenChange={setOpen} query={query} onQueryChange={setQuery} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `segments` | `ContextSwitcherSegment[]` | The parts, outermost first: an organisation, its projects, a project's environments |
| `value` (optional) | `ContextSwitcherValue` | What is picked in each part. A part left out, or holding an id its list doesn't have, takes its default item |
| `defaultValue` (optional) | `ContextSwitcherValue` |  |
| `onChange` (optional) | `(value: ContextSwitcherValue, change: { key: string; item: ContextSwitcherItem }) => void` | Called with the whole path after a pick. The parts after the one picked keep their item if their new list has it, and take its default (or first) item otherwise |
| `onCreate` (optional) | `(key: string, query: string) => void` | Adds Create new… at the bottom of each list (Create “…” once something is typed), and is called with the part's key and what was typed. Add the item to your data and pick it in `value` |
| `open` (optional) | `string \| null` | The key of the part whose switcher is open, or null. Leave it out to let the bar open and close them |
| `defaultOpen` (optional) | `string \| null` |  |
| `onOpenChange` (optional) | `(key: string \| null) => void` |  |
| `query` (optional) | `string` | What is typed in the open switcher's search. Opening a switcher clears it |
| `defaultQuery` (optional) | `string` |  |
| `onQueryChange` (optional) | `(query: string) => void` |  |
| `label` (optional) | `string` | The bar's name for screen readers. Defaults to "Context" |
| `className` (optional) | `string` |  |

## Questions

**Does it load projects or switch my app?**

No. It keeps the path and tells you when it changes. Load the new project's data in `onChange` (React) or on `context-change` (HTML).

**Can I have two parts, or four?**

In React, `segments` takes any number of parts, outermost first, each with its own list, heading and noun. The HTML version is written for the three shown.

**How does the project list follow the organisation?**

In React, a segment's `items` can be a function of the parts before it, like `v => projectsOf(v.org)`. In HTML, each organisation holds its own projects.

**What does Create new do?**

In React it calls `onCreate(key, query)`, and the row only shows when you pass it: add the item to your data and pick it in `value`. In HTML, cancel the `context-create` event to open your own form instead of adding it on the spot.

## Source

`ContextSwitcher.tsx`, as `npx designme add context-switcher --react` installs it:

```tsx
'use client';
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Swap, Tip } from '../lib/motion';
import '../designme.css';
import './context-switcher.css';

/** A badge's colour, the same tones as Badge: neutral grey, the accent's tint, the three states, or a tag colour */
export type ContextSwitcherTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'blue' | 'violet' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';
/** The tint of an item's tile */
export type ContextSwitcherTint = 'blue' | 'violet' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

/** One organisation, project or environment */
export interface ContextSwitcherItem {
  id: string;
  name: string;
  /** A small badge after the name, like a plan ("Pro") or an environment ("Production"). A string is a neutral badge */
  badge?: string | { label: string; tone?: ContextSwitcherTone };
  /** A tile with the name's first letter on this tint, before the name, as the organisations have on designme.dev */
  tile?: ContextSwitcherTint;
  /** Where its list lands when the part before it changes and the item held is no longer in the list. The first item otherwise */
  isDefault?: boolean;
}

/** The id picked in each part, by the part's key, like { org: 'fernhill', project: 'invoice', env: 'staging' } */
export type ContextSwitcherValue = Record<string, string>;

/** One part of the path */
export interface ContextSwitcherSegment {
  key: string;
  /** What the part is, like "Organisation". Read out with the name, and shown in the … menu on a phone */
  label: string;
  /** Its items, or a function that works them out from the parts before it, so picking an organisation brings its projects */
  items: ContextSwitcherItem[] | ((value: ContextSwitcherValue) => ContextSwitcherItem[]);
  /** The line over the list, like "Projects in Fernhill Labs" */
  heading?: string | ((value: ContextSwitcherValue) => string);
  /** The search's placeholder and name. Defaults to "Find a" and the noun */
  placeholder?: string;
  /** One of its items, for "Create new project". Defaults to the label in lower case */
  noun?: string;
  /** Several, for the list's name and "No projects match". Defaults to the noun with an s */
  plural?: string;
}

export interface ContextSwitcherProps {
  /** The parts, outermost first: an organisation, its projects, a project's environments */
  segments: ContextSwitcherSegment[];
  /** What is picked in each part. A part left out, or holding an id its list doesn't have, takes its default item */
  value?: ContextSwitcherValue;
  defaultValue?: ContextSwitcherValue;
  /** Called with the whole path after a pick. The parts after the one picked keep their item if their new list has it, and
      take its default (or first) item otherwise */
  onChange?: (value: ContextSwitcherValue, change: { key: string; item: ContextSwitcherItem }) => void;
  /** Adds Create new… at the bottom of each list (Create “…” once something is typed), and is called with the part's key and
      what was typed. Add the item to your data and pick it in `value` */
  onCreate?: (key: string, query: string) => void;
  /** The key of the part whose switcher is open, or null. Leave it out to let the bar open and close them */
  open?: string | null;
  defaultOpen?: string | null;
  onOpenChange?: (key: string | null) => void;
  /** What is typed in the open switcher's search. Opening a switcher clears it */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** The bar's name for screen readers. Defaults to "Context" */
  label?: string;
  className?: string;
}

const TINT: Record<ContextSwitcherTint, string> = { blue: 'pb', violet: 'pl', green: 'pm', orange: 'pp', red: 'pr', yellow: 'py', pink: 'pk', teal: 'pt' };
type Bdg = { label: string; tone: ContextSwitcherTone };
const badgeOf = (x?: ContextSwitcherItem): Bdg | undefined => !x?.badge ? undefined : typeof x.badge === 'string' ? { label: x.badge, tone: 'neutral' } : { label: x.badge.label, tone: x.badge.tone ?? 'neutral' };
const BadgeEl = ({ b }: { b: Bdg }) => <span className="dm-csw-bd" data-tone={b.tone === 'neutral' ? undefined : b.tone}>{b.label}</span>;
const Tile = ({ x }: { x: ContextSwitcherItem }) => x.tile ? <span className="dm-csw-lg" data-t={TINT[x.tile]} aria-hidden="true">{x.name[0]}</span> : null;
const listOf = (s: ContextSwitcherSegment, v: ContextSwitcherValue) => typeof s.items === 'function' ? s.items(v) : s.items;
/** The whole path: each part keeps its item if its list has it, otherwise takes the list's default or first item */
function settle(segments: ContextSwitcherSegment[], v: ContextSwitcherValue) {
  const out: ContextSwitcherValue = {};
  for (const s of segments) {
    const items = listOf(s, out), held = v[s.key];
    out[s.key] = (items.find(i => i.id === held) ?? items.find(i => i.isDefault) ?? items[0])?.id ?? '';
  }
  return out;
}

/** The badge in the bar crossfades when it changes, like the name beside it */
function FadeBadge({ b }: { b?: Bdg }) {
  const k = b ? `${b.tone}|${b.label}` : '';
  const [shown, setShown] = useState(k), [out, setOut] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (k === shown) { setOut(false); return; }
    setOut(true);
    const t = setTimeout(() => { setShown(k); setOut(false); }, reduce ? 0 : 170);
    return () => clearTimeout(t);
  }, [k, shown, reduce]);
  const at = shown.indexOf('|');
  return <span className={cx('dm-csw-bh', 'dm-sw', out && 'dm-out')}>{shown && <BadgeEl b={{ tone: shown.slice(0, at) as ContextSwitcherTone, label: shown.slice(at + 1) }} />}</span>;
}

/** Where you are in an app, as a breadcrumb: an organisation, a project and an environment, or any parts you give it. Each
    part opens a switcher with a search, its list (the current one ticked, each with its badge) and Create new. Narrow, the
    names shorten with an ellipsis; phone narrow, only the last part shows and a … menu holds the others. */
export function ContextSwitcher({ segments, value, defaultValue, onChange, onCreate, open, defaultOpen = null, onOpenChange, query, defaultQuery = '',
  onQueryChange, label = 'Context', className }: ContextSwitcherProps) {
  const [inner, setInner] = useState<ContextSwitcherValue>(defaultValue ?? {});
  const cur = settle(segments, value ?? inner);
  const [openKey, setOpenKey] = useControllable<string | null>(open, defaultOpen, onOpenChange);
  const [q, setQ] = useControllable(query, defaultQuery, onQueryChange);
  const [more, setMore] = useState(false);
  const [said, setSaid] = useState('');
  const id = useId(), listId = `${id}-list`;

  const root = useRef<HTMLDivElement>(null), bar = useRef<HTMLElement>(null), pop = useRef<HTMLDivElement>(null), mpop = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null), list = useRef<HTMLDivElement>(null), moreBtn = useRef<HTMLButtonElement>(null), mi = useRef<HTMLLIElement>(null);
  const trigs = useRef<(HTMLButtonElement | null)[]>([]), opts = useRef<(HTMLDivElement | null)[]>([]);

  // the switcher keeps showing the part it was opened for while it fades out
  const lastKey = useRef(segments[0]?.key);
  if (openKey) lastKey.current = openKey;
  const d = Math.max(0, segments.findIndex(s => s.key === lastKey.current)), seg = segments[d];
  const noun = seg?.noun ?? seg?.label.toLowerCase() ?? '', plural = seg?.plural ?? noun + 's';
  const placeholder = seg?.placeholder ?? `Find ${/^[aeiou]/i.test(noun) ? 'an' : 'a'} ${noun}`;
  const items = seg ? listOf(seg, cur) : [];
  const v = q.trim(), lv = v.toLowerCase();
  const shown = items.filter(x => !lv || x.name.toLowerCase().includes(lv));
  const total = shown.length + (onCreate ? 1 : 0);
  const heading = !seg?.heading ? '' : typeof seg.heading === 'function' ? seg.heading(cur) : seg.heading;

  // the highlight starts on the current item, or on the first match once something is typed; it starts again whenever a
  // switcher opens or the list changes
  const [opens, setOpens] = useState(0), [wasOpen, setWasOpen] = useState(openKey);
  if (wasOpen !== openKey) { setWasOpen(openKey); if (openKey) setOpens(opens + 1); }
  const sig = `${opens}|${openKey}|${lv}`;
  const [hi, setHi] = useState({ at: 0, for: '' });
  const at = hi.for === sig ? Math.min(hi.at, total - 1) : lv ? 0 : Math.max(0, shown.findIndex(x => x.id === cur[seg?.key ?? '']));
  const move = (by: number) => { if (total) setHi({ at: (at + by + total) % total, for: sig }); };

  // phone narrow (the CSS decides), only the last part shows and the … button stands in for the others
  const narrow = () => !!mi.current && getComputedStyle(mi.current).display !== 'none';
  const anchor = (k: string) => { const i = segments.findIndex(s => s.key === k); return narrow() && i < segments.length - 1 ? moreBtn.current : trigs.current[i]; };
  const [place, setPlace] = useState<CSSProperties>({}), [mplace, setMplace] = useState<CSSProperties>({});
  const placeUnder = (el: HTMLElement | null, at: HTMLElement | null | undefined) => {
    const r = root.current, b = bar.current; if (!el || !at || !r || !b) return {};
    const rr = r.getBoundingClientRect(), ar = at.getBoundingClientRect(), br = b.getBoundingClientRect();
    return { left: Math.max(0, Math.min(ar.left - rr.left, rr.width - el.offsetWidth)), top: Math.round(br.bottom - rr.top + 6) };
  };
  // once a closed one has faded it goes back to the component's corner, so a narrower screen later never scrolls sideways to it
  useIsoLayoutEffect(() => {
    if (openKey) { setPlace(placeUnder(pop.current, anchor(openKey))); return; }
    const t = setTimeout(() => setPlace({}), 320); return () => clearTimeout(t);
  }, [openKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useIsoLayoutEffect(() => {
    if (more) { setMplace(placeUnder(mpop.current, moreBtn.current)); return; }
    const t = setTimeout(() => setMplace({}), 320); return () => clearTimeout(t);
  }, [more]); // eslint-disable-line react-hooks/exhaustive-deps

  // where the focus goes once a switcher opens: its search, with the highlight on the last row for the up arrow
  const focusTo = useRef<'search' | 'last' | null>(null), menuFocus = useRef<'first' | 'last' | null>(null);
  useIsoLayoutEffect(() => {
    if (!openKey || !focusTo.current) return;
    if (focusTo.current === 'last') setHi({ at: total - 1, for: sig });
    focusTo.current = null; search.current?.focus({ preventScroll: true });
  }, [openKey, sig]); // eslint-disable-line react-hooks/exhaustive-deps
  useIsoLayoutEffect(() => {
    if (!more || !menuFocus.current) return;
    const all = Array.from(mpop.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    (menuFocus.current === 'last' ? all[all.length - 1] : all[0])?.focus({ preventScroll: true }); menuFocus.current = null;
  }, [more]);
  // the list scrolls to keep the highlight in view, never the page
  useIsoLayoutEffect(() => {
    const l = list.current, o = opts.current[at]; if (!openKey || !l) return;
    if (!at) { l.scrollTop = 0; return; } if (!o) return;
    const lr = l.getBoundingClientRect(), r = o.getBoundingClientRect();
    if (r.top < lr.top) l.scrollTop -= lr.top - r.top; else if (r.bottom > lr.bottom) l.scrollTop += r.bottom - lr.bottom;
  }, [at, openKey, sig]);

  const show = (k: string, focus: 'search' | 'last' | null) => { setMore(false); setQ(''); focusTo.current = focus; if (openKey !== k) setOpenKey(k); else if (focus) search.current?.focus({ preventScroll: true }); };
  // closing gives the focus back to the part's button (or the … button, on a phone) when it was in the switcher
  const hide = (back: boolean) => { const k = openKey; setOpenKey(null); if (back && k) anchor(k)?.focus({ preventScroll: true }); };
  const menu = (on: boolean, focus: 'first' | 'last' | null = null) => {
    if (on) { if (openKey) setOpenKey(null); menuFocus.current = focus; setMore(true); return; }
    const back = !!mpop.current?.contains(document.activeElement); setMore(false); if (back) moreBtn.current?.focus({ preventScroll: true });
  };

  // what changed, said once for screen readers: the part picked and the parts that came with it
  const announce = (next: ContextSwitcherValue, from: number) => {
    const parts = segments.slice(from).map((s, i) => {
      const x = listOf(s, next).find(it => it.id === next[s.key]), b = badgeOf(x);
      return x ? `${i ? (s.noun ?? s.label.toLowerCase()) + ' ' : ''}${x.name}${b ? ` (${b.label})` : ''}` : '';
    }).filter(Boolean);
    setSaid('Switched to ' + parts.join(', '));
  };
  const pick = (i: number) => {
    if (!seg || !openKey) return;
    const back = !!pop.current?.contains(document.activeElement);
    if (i >= shown.length) { hide(back); onCreate?.(seg.key, v); return; }
    const item = shown[i]; hide(back);
    if (item.id === cur[seg.key]) return;
    const next = settle(segments, { ...cur, [seg.key]: item.id });
    if (value === undefined) setInner(next);
    onChange?.(next, { key: seg.key, item }); announce(next, d);
  };

  // on the bar, the left and right arrows move between the parts you can see
  const sideways = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return false;
    const all = [moreBtn.current, ...trigs.current].filter((b): b is HTMLButtonElement => !!b && b.getClientRects().length > 0);
    const to = all[all.indexOf(e.currentTarget) + (e.key === 'ArrowLeft' ? -1 : 1)];
    if (to) { e.preventDefault(); to.focus({ preventScroll: true }); }
    return true;
  };
  // in the search: the arrows move and wrap, Home and End go to the ends, Enter picks, Escape closes it and gives the focus
  // back. With nothing typed, the left and right arrows open the part before or after
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); move(k === 'ArrowDown' ? 1 : -1); }
    else if (k === 'Home' || k === 'End') { e.preventDefault(); if (total) setHi({ at: k === 'Home' ? 0 : total - 1, for: sig }); }
    else if (k === 'Enter') { e.preventDefault(); if (total) pick(at); }
    else if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); hide(true); }
    else if ((k === 'ArrowLeft' || k === 'ArrowRight') && !q) { const n = segments[d + (k === 'ArrowLeft' ? -1 : 1)]; if (n) { e.preventDefault(); show(n.key, 'search'); } }
  };
  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const all = Array.from(mpop.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []), i = all.indexOf(document.activeElement as HTMLElement);
    const go = ({ ArrowDown: all[(i + 1) % all.length], ArrowUp: all[(i - 1 + all.length) % all.length], Home: all[0], End: all[all.length - 1] } as Record<string, HTMLElement | undefined>)[e.key];
    if (go) { e.preventDefault(); go.focus({ preventScroll: true }); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); menu(false); }
    else if (e.key === 'Tab') setTimeout(() => setMore(false));
  };

  // a press anywhere else closes them, and so does a real resize; Tab out of a switcher closes it
  useEffect(() => {
    if (!openKey && !more) return;
    const down = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (pop.current?.contains(t) || mpop.current?.contains(t) || (root.current?.contains(t) && t.closest('.dm-csw-tr,.dm-csw-more'))) return;
      setOpenKey(null); setMore(false);
    };
    const resize = (e: UIEvent) => { if (e.isTrusted) { setOpenKey(null); setMore(false); } };
    document.addEventListener('pointerdown', down); addEventListener('resize', resize);
    return () => { document.removeEventListener('pointerdown', down); removeEventListener('resize', resize); };
  }, [openKey, more, setOpenKey]);

  // a name the ellipsis cuts short shows in full in a tooltip
  const [cut, setCut] = useState<boolean[]>([]);
  const names = segments.map(s => listOf(s, cur).find(x => x.id === cur[s.key])?.name ?? '').join('|');
  useEffect(() => {
    const check = () => setCut(trigs.current.map(t => { const n = t?.querySelector<HTMLElement>('.dm-csw-nm'); return !!n && n.scrollWidth > n.clientWidth + 1; }));
    const t = setTimeout(check, 220); const ro = new ResizeObserver(check); if (bar.current) ro.observe(bar.current);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [names]);

  const named = (s: ContextSwitcherSegment, x?: ContextSwitcherItem) => { const b = badgeOf(x); return `${s.label}: ${x?.name ?? ''}${b ? ', ' + b.label : ''}`; };
  const crumbs = segments.flatMap((s, i) => {
    const x = listOf(s, cur).find(it => it.id === cur[s.key]);
    const onClick = (e: MouseEvent) => { if (openKey === s.key) hide(!!pop.current?.contains(document.activeElement)); else show(s.key, e.nativeEvent.isTrusted ? 'search' : null); };
    const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => { if (sideways(e)) return; if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); show(s.key, e.key === 'ArrowUp' ? 'last' : 'search'); } };
    return [
      ...(i ? [<li key={s.key + '-sep'} className="dm-csw-sep" aria-hidden="true"><Icon name="crumb" /></li>] : []),
      <li key={s.key} className="dm-csw-seg" data-k={s.key}>
        <Tip label={x?.name ?? ''} off={!cut[i] || openKey === s.key}>
          <button ref={el => { trigs.current[i] = el; }} type="button" className="dm-csw-tr" aria-haspopup="listbox" aria-expanded={openKey === s.key} aria-controls={listId}
            aria-label={named(s, x)} onClick={onClick} onKeyDown={onKeyDown}>
            {x && <Tile x={x} />}<Swap className="dm-csw-nm">{x?.name ?? ''}</Swap><FadeBadge b={badgeOf(x)} /><Icon name="unfold" size="xs" />
          </button>
        </Tip>
      </li>
    ];
  });
  const hidden = segments.slice(0, -1), moreLabel = hidden.map(s => s.label).join(' and ');

  return (
    <div data-dm="" ref={root} className={cx('dm-csw', className)}>
      <nav ref={bar} className="dm-csw-bar dm-panel" aria-label={label}>
        <ol className="dm-csw-path">
          <li ref={mi} className="dm-csw-mi">
            <Tip label={moreLabel} off={more}>
              <button ref={moreBtn} type="button" className="dm-csw-more" aria-haspopup="menu" aria-expanded={more} aria-label={moreLabel}
                onClick={e => menu(!more, e.nativeEvent.isTrusted ? 'first' : null)}
                onKeyDown={e => { if (sideways(e)) return; if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); menu(true, e.key === 'ArrowUp' ? 'last' : 'first'); } }}>
                <Icon name="more" />
              </button>
            </Tip>
          </li>
          <li className="dm-csw-sep dm-m" aria-hidden="true"><Icon name="crumb" /></li>
          {crumbs}
        </ol>
      </nav>
      <div ref={pop} className={cx('dm-pop', 'dm-csw-pop', openKey && 'dm-open')} style={place} inert={!openKey}
        onBlur={e => { const t = e.relatedTarget as Node | null; if (openKey && t && !pop.current?.contains(t) && t !== anchor(openKey)) setOpenKey(null); }}>
        <div className="dm-csw-sf">
          <Icon name="search" size="xs" />
          <input ref={search} className="dm-csw-q" role="combobox" aria-autocomplete="list" aria-expanded={!!openKey} aria-controls={listId}
            aria-activedescendant={openKey && total ? `${id}-o${at}` : undefined} aria-label={placeholder} placeholder={placeholder}
            spellCheck={false} autoComplete="off" value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKey} />
        </div>
        <div ref={list} className="dm-csw-list" role="listbox" id={listId} aria-label={plural[0]?.toUpperCase() + plural.slice(1)}>
          {heading && <div className="dm-ph" role="presentation">{heading}</div>}
          {shown.map((x, i) => {
            const b = badgeOf(x);
            return (
              <div key={x.id} ref={el => { opts.current[i] = el; }} id={`${id}-o${i}`} role="option" aria-selected={x.id === cur[seg.key]}
                className={cx('dm-mi', 'dm-csw-o', i === at && 'dm-hl')} onMouseMove={() => { if (at !== i) setHi({ at: i, for: sig }); }}
                onMouseDown={e => e.preventDefault()} onClick={() => pick(i)}>
                <Tile x={x} /><span className="dm-csw-on">{x.name}</span>{b && <BadgeEl b={b} />}<span className="dm-ck"><Icon name="check" size="xs" /></span>
              </div>
            );
          })}
          {!shown.length && <div className="dm-csw-none" role="presentation">No {plural} match “{v}”</div>}
          {onCreate && <>
            <div className="dm-sep" role="presentation" />
            <div ref={el => { opts.current[shown.length] = el; }} id={`${id}-o${shown.length}`} role="option" aria-selected={false} aria-label={v ? undefined : `Create new ${noun}`}
              className={cx('dm-mi', 'dm-csw-o', 'dm-csw-new', at === shown.length && 'dm-hl')} onMouseMove={() => { if (at !== shown.length) setHi({ at: shown.length, for: sig }); }}
              onMouseDown={e => e.preventDefault()} onClick={() => pick(shown.length)}>
              <Icon name="plus" size="xs" /><span className="dm-csw-on">{v ? `Create “${v}”` : 'Create new…'}</span>
            </div>
          </>}
        </div>
      </div>
      <div ref={mpop} className={cx('dm-pop', 'dm-csw-mpop', more && 'dm-open')} style={mplace} inert={!more} role="menu" aria-label={moreLabel} onKeyDown={onMenuKey}>
        {hidden.map((s, i) => {
          const x = listOf(s, cur).find(it => it.id === cur[s.key]), b = badgeOf(x);
          return (
            <button key={s.key} type="button" className="dm-mi" role="menuitem" tabIndex={-1} onClick={e => { setMore(false); show(s.key, e.nativeEvent.isTrusted ? 'search' : null); }}>
              {x?.tile ? <Tile x={x} /> : <Icon name={i ? 'layers' : 'folder'} />}<span className="dm-t"><b>{x?.name}</b><span className="dm-d">{s.label}</span></span>{b && <BadgeEl b={b} />}
            </button>
          );
        })}
      </div>
      <p className="dm-csw-live" aria-live="polite">{said}</p>
    </div>
  );
}
```

## More in Collaboration

- [Comments](https://designme.dev/components/comments.md): A design thread where you can @mention the agent and it replies.
- [Notifications](https://designme.dev/components/notifications.md): An inbox where agent updates and mentions arrive live.
- [Banner](https://designme.dev/components/banner.md): An announcement on a tint of its tone, with its own line drawing and a dismiss.
- [Invite to collaborate](https://designme.dev/components/invite-to-collaborate.md): Add teammates by email as chips, set their role, send.
- [Reactions](https://designme.dev/components/reactions.md): Quick reactions on an agent update, with counts that pop.
- [Profile menu](https://designme.dev/components/profile-menu.md): The account menu behind an avatar: switch workspace, theme, shortcuts and sign out.
- [Filter menu](https://designme.dev/components/filter-menu.md): Add filters from a menu, see them as chips, and watch the count change.
- [Ticket list](https://designme.dev/components/ticket-list.md): Support tickets the agent has triaged, with suggested replies.
- [Kanban board](https://designme.dev/components/kanban-board.md): A board where you and the agent move cards, with drag and drop.

All components: https://designme.dev/llms.txt
