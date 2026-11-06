# Memory panel

> What the agent remembers about your team, editable and removable.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/memory-panel

## Install

```sh
npx designme add memory-panel          # HTML, CSS and JS, with the shared core
npx designme add memory-panel --react  # React 19 component and its CSS
npx designme add memory-panel --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/memory-panel.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/memory-panel.json  # Astro
```

## About

A list of the things an agent remembers about a team, such as brand rules and working habits. Each memory shows where it came from, with that app's own mark (Slack, Figma, GitHub, Notion, Linear, Drive) or an icon for something said in chat, and what kind of memory it is, in the kind's colour. People can filter memories by kind, fix one in place, or tell the agent to forget it. A memory the agent learns arrives shimmering, then sits highlighted with a New tag, and the memories an answer uses pulse once and keep a Used tag, so the agent's long-term memory is visible, alive and correctable.

### When to use it

- When your agent keeps memories across sessions and people should be able to see them, and where each one came from.
- When someone needs to correct a rule the agent learned wrong.
- When you want to show the agent learning something new while the panel is open.
- When people should see which memories shaped an answer.
- As a settings page or a flat block inside a chat thread.

### What it does

- Filter tabs for All plus one per entry in `kinds`. Under each memory its kind's `label` is written in the kind's `color`, followed by its `source`, like "A thread in #design-system, Sep 4".
- Each memory shows where it came from: `brand` for an app's own mark (google, github, figma, slack, notion, linear, gmail or drive), or `icon` for anything else. Wider than a phone, the marks of the apps the memories came from sit beside the count unless `showSources` is false.
- `learning` shimmers a memory's text, shows a spinner where its source goes and hides Edit and Forget. When it is learned, the text crossfades to the rule and the source's mark comes in.
- A memory marked `isNew` sits on the accent's tint with a New tag (`newLabel`), and grows into the list when it arrives while the panel is open.
- A memory marked `used` pulses once with the accent's tint as it turns on, its source lifts, and it keeps a Used tag (`usedLabel`).
- `activity` sets the line at the foot, like the answer the agent is writing with its memory now: its `text`, an optional `brand` or `icon` (a spark by default), and `live` to shimmer it.
- Edit turns a memory into editable text; Enter or leaving the field saves it, gives it the `editedSource` line and an edit icon in place of its source, and calls `onEdit`.
- Forget removes a memory and leaves an Undo in its place for `undoFor` ms (4000 by default), calling `onForget` and, if undone, `onRestore`.
- The count under the title updates as memories come and go, worded by `countLabel`.
- In Blueprint the new memory's tint is hatched and the pulse steps in hard beats, with the source's edge blinking in the kind's colour instead of lifting.
- Sits flat by default; set `bare` to false to give it its own card.

### Accessibility

- The filter tabs are a role="group" labelled "Filter", with aria-pressed on the active tab.
- Each memory's kind, source and tags are written as text; the source marks are `aria-hidden`, so the colours and logos are never the only way to tell them apart.
- The line at the foot is `aria-live="polite"`, so a change in what the agent is doing is read out.
- The Edit and Forget icon buttons have aria-labels and tooltips that also show on keyboard focus, and are disabled while a memory is still being learned.
- Pressing Enter while editing a memory saves it.
- With reduced motion, the grow animation for a new memory is skipped, and the shimmer, the pulse and the lift stop.

## Usage in React

```tsx
import { MemoryPanel } from '@/components/designme/memory-panel/MemoryPanel';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { MemoryPanel, type MemoryActivity, type MemoryItem, type MemoryKind } from './MemoryPanel';
import type { BrandName } from '../lib/brands';
import type { IconName } from '../lib/icons';
import { useStory } from '../lib/useScript';

const KINDS: MemoryKind[] = [
  { value: 'brand', label: 'Brand', color: 'var(--dm-pl)' },
  { value: 'process', label: 'Process', color: 'var(--dm-pt)' }
];
// where each memory came from: an app's mark, or an icon for something said in chat
const START: MemoryItem[] = ([
  ['brand', 'Primary buttons use the accent blue, never black', 'figma', 'Pricing review in Figma, Sep 12'],
  ['brand', 'Headlines stay under eight words', '', 'You told the agent, Aug 30'],
  ['process', 'Ask Maya before publishing to the shared library', 'slack', 'A thread in #design-system, Sep 4'],
  ['brand', 'Card radius is 16px on web, 12px in the app', 'github', 'tokens.css on GitHub, Sep 18'],
  ['process', 'Run the launch checklist before every PR', 'notion', 'Launch checklist in Notion, Sep 20'],
  ['process', 'File design bugs in the Design QA project', 'linear', 'DES-214 in Linear, Sep 26'],
  ['brand', 'No em dashes in product copy', 'drive', 'Voice and tone guide in Drive, Oct 2']
] as const).map(([kind, text, brand, source], id) => ({ id, kind, text, source, ...(brand ? { brand: brand as BrandName } : { icon: 'comment' as IconName }) }));
const IDLE: MemoryActivity = { text: 'Used in 14 answers this week' };

/* ---------- Memory panel: the agent learns a rule from your edit in Figma, then drafts an email in Gmail with three memories, which pulse as it uses them ---------- */
export default function MemoryPanelDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [list, setList] = useState(START);
  const [activity, setActivity] = useState(IDLE);
  const set = (id: number, patch: Partial<MemoryItem>) => setList(l => l.map(m => (m.id === id ? { ...m, ...patch } : m)));
  // the story stops for good at your first click, key or focus inside the panel; whatever it was halfway through settles
  useStory(ref, async ({ wait, taken }) => {
    await wait(2200);
    setList(l => [{ id: 100, kind: 'brand', text: 'Learning from your edit in Pricing v4', source: 'Just now', brand: 'figma', learning: true }, ...l]);
    const learnt = { learning: false, text: 'Use “Start free” instead of “Sign up” on CTAs', source: 'Your edit in Pricing v4, just now' };
    taken(() => { setList(l => l.map(m => (m.id === 100 && m.learning ? { ...m, ...learnt } : m))); setActivity(IDLE); });
    await wait(1500);
    set(100, { ...learnt, isNew: true });
    await wait(2600);
    set(100, { isNew: false, source: 'Your edit in Figma, today' });
    await wait(1000);
    setActivity({ text: 'Drafting the launch email in Gmail', live: true, brand: 'gmail' });
    await wait(1100);
    for (const id of [100, 1, 6]) { set(id, { used: true }); await wait(700); }
    setActivity({ text: 'Used 3 memories in the launch email draft', brand: 'gmail' });
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <MemoryPanel kinds={KINDS} memories={list} onMemoriesChange={setList} activity={activity} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` (optional) | `ReactNode` | Like "Team memory" |
| `icon` (optional) | `IconName` |  |
| `kinds` | `MemoryKind[]` |  |
| `memories` (optional) | `MemoryItem[]` | Every memory, newest first. Leave it out to let Edit and Forget keep their own list |
| `defaultMemories` (optional) | `MemoryItem[]` |  |
| `onMemoriesChange` (optional) | `(memories: MemoryItem[]) => void` |  |
| `filter` (optional) | `string` | The tab that is showing: 'all' or a kind's value |
| `defaultFilter` (optional) | `string` |  |
| `onFilterChange` (optional) | `(filter: string) => void` |  |
| `allLabel` (optional) | `string` | The first tab |
| `countLabel` (optional) | `(count: number) => string` | The count under the title, like "7 memories" |
| `showSources` (optional) | `boolean` | Shows the marks of the apps the memories came from beside the count. On by default |
| `activity` (optional) | `MemoryActivity` | The line at the foot, like what the agent is answering with its memory now |
| `editedSource` (optional) | `string` | The source an edited memory gets |
| `newLabel` (optional) | `string` | The tag on a memory marked `isNew` |
| `usedLabel` (optional) | `string` | The tag on a memory marked `used` |
| `onEdit` (optional) | `(memory: MemoryItem) => void` | Called with the memory after an edit |
| `onForget` (optional) | `(memory: MemoryItem) => void` | Called when a memory is forgotten. It can still come back with Undo for `undoFor` ms |
| `onRestore` (optional) | `(memory: MemoryItem) => void` | Called when Undo brings a forgotten memory back |
| `undoFor` (optional) | `number` | How long Undo stays, in ms |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import MemoryPanel from '../components/designme/memory-panel/MemoryPanel.astro';
---
<MemoryPanel />
<MemoryPanel data-style="soft" class="my-class" />
```
It plays its demo; change `memory-panel.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I save an edited memory to my backend?**

Use `onEdit`. It is called with the updated memory after an edit, with its new text, the `editedSource` line and the edit icon. If the text is left empty, the old text is kept.

**When should I delete a forgotten memory for good?**

`onForget` fires as soon as someone clicks Forget, and `onRestore` fires if they click Undo within `undoFor` ms. Wait out that window, or handle both callbacks, before deleting it on the server.

**How do I show a memory the agent just learned?**

Add it to the front of `memories` with `learning: true` while the agent works it out, then replace its text and set `learning` to false and `isNew` to true. It grows into the list and is highlighted; set `isNew` back to false later to clear the highlight.

**How do I show which memories an answer used?**

Set `used: true` on each one as the agent reads it, and set `activity` to say what it is writing, with `live: true` while it works. Each memory pulses as it turns on and keeps its Used tag until you set `used` back to false.

**Can I use my own categories?**

Yes. Pass `kinds` with a value, a tab label and a colour for each; every memory points to one by its `kind`. Pick a colour that reads as text, since the kind's label is written in it.

## Source

`MemoryPanel.tsx`, as `npx designme add memory-panel --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Brand, type BrandName } from '../lib/brands';
import { Seg, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './memory-panel.css';

/** A group of memories, with its own filter tab and colour */
export interface MemoryKind {
  value: string;
  /** Its tab, and the word under each of its memories, like "Brand" */
  label: string;
  /** Its colour, for that word, like 'var(--dm-pl)'. Pick one that reads as text, 4.5:1 on your surface */
  color: string;
}

/** Something the agent remembers */
export interface MemoryItem {
  id: string | number;
  /** Which kind it is, by value */
  kind: string;
  /** What it remembers, like "Headlines stay under eight words" */
  text: string;
  /** Where it came from, like "A thread in #design-system, Sep 4" */
  source?: string;
  /** The app it came from, shown as its own mark, like 'slack' or 'figma' */
  brand?: BrandName;
  /** An icon for where it came from when that isn't an app, like 'comment' for something said in chat. Used without a `brand` */
  icon?: IconName;
  /** Highlights it as just learned, on the accent's tint with a New tag */
  isNew?: boolean;
  /** Still being learned: the text shimmers, a spinner stands in for its source, and it can't be edited yet */
  learning?: boolean;
  /** Used in the answer the agent is writing: it pulses once when this turns on, and keeps a Used tag */
  used?: boolean;
}

/** The line at the foot of the panel */
export interface MemoryActivity {
  /** Like "Drafting the launch email in Gmail" or "Used in 14 answers this week" */
  text: string;
  /** Shimmers the text, while the agent is at work */
  live?: boolean;
  brand?: BrandName;
  icon?: IconName;
}

export interface MemoryPanelProps {
  /** Like "Team memory" */
  title?: ReactNode;
  icon?: IconName;
  kinds: MemoryKind[];
  /** Every memory, newest first. Leave it out to let Edit and Forget keep their own list */
  memories?: MemoryItem[];
  defaultMemories?: MemoryItem[];
  onMemoriesChange?: (memories: MemoryItem[]) => void;
  /** The tab that is showing: 'all' or a kind's value */
  filter?: string;
  defaultFilter?: string;
  onFilterChange?: (filter: string) => void;
  /** The first tab */
  allLabel?: string;
  /** The count under the title, like "7 memories" */
  countLabel?: (count: number) => string;
  /** Shows the marks of the apps the memories came from beside the count. On by default */
  showSources?: boolean;
  /** The line at the foot, like what the agent is answering with its memory now */
  activity?: MemoryActivity;
  /** The source an edited memory gets */
  editedSource?: string;
  /** The tag on a memory marked `isNew` */
  newLabel?: string;
  /** The tag on a memory marked `used` */
  usedLabel?: string;
  /** Called with the memory after an edit */
  onEdit?: (memory: MemoryItem) => void;
  /** Called when a memory is forgotten. It can still come back with Undo for `undoFor` ms */
  onForget?: (memory: MemoryItem) => void;
  /** Called when Undo brings a forgotten memory back */
  onRestore?: (memory: MemoryItem) => void;
  /** How long Undo stays, in ms */
  undoFor?: number;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

interface Gone { m: MemoryItem; at: number; leaving: boolean }

const plural = (n: number) => `${n} ${n === 1 ? 'memory' : 'memories'}`;
const Mark = ({ brand, icon }: { brand?: BrandName; icon?: IconName }) => brand ? <Brand name={brand} /> : icon ? <Icon name={icon} size="xs" /> : null;

/** What the agent remembers about the team, filtered by kind, each memory with the app or place it came from, editable in
    place or forgotten with an undo. New memories arrive highlighted, and the ones an answer uses pulse. */
export function MemoryPanel({
  title = 'Team memory', icon = 'book', kinds, memories, defaultMemories = [], onMemoriesChange, filter, defaultFilter = 'all', onFilterChange,
  allLabel = 'All', countLabel = plural, showSources = true, activity, editedSource = 'Edited by you, just now', newLabel = 'New', usedLabel = 'Used',
  onEdit, onForget, onRestore, undoFor = 4000, bare = true, className
}: MemoryPanelProps) {
  const [list, setList] = useControllable(memories, defaultMemories, onMemoriesChange);
  const [f, setF] = useControllable(filter, defaultFilter, onFilterChange);
  const [gone, setGone] = useState<Gone[]>([]);
  const [editing, setEditing] = useState<MemoryItem['id'] | null>(null);
  const timers = useRef(new Map<MemoryItem['id'], ReturnType<typeof setTimeout>>());
  const edit = useRef<HTMLSpanElement>(null);
  const kindOf = (kind: string) => kinds.find(k => k.value === kind);

  // a new tab repaints the list: the rows stagger in again and any Undo goes away
  const [paint, setPaint] = useState(0);
  const order = useRef(new Map<MemoryItem['id'], number>());
  const first = useRef(true);
  useIsoLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    timers.current.forEach(clearTimeout); timers.current.clear();
    order.current.clear(); setGone([]); setPaint(p => p + 1);
  }, [f]);
  useEffect(() => { const t = timers.current; return () => t.forEach(clearTimeout); }, []);

  // editing starts with the caret at the end of the text
  useIsoLayoutEffect(() => {
    const t = edit.current; if (editing === null || !t) return;
    t.focus();
    const s = document.getSelection(); s?.selectAllChildren(t); s?.collapseToEnd();
  }, [editing]);

  // a memory that has just been learned crossfades from its shimmering line to what it remembers, and its source comes in
  const learnt = useRef(new Set<MemoryItem['id']>());
  list.forEach(m => { if (m.learning) learnt.current.add(m.id); });

  const commit = (m: MemoryItem, text: string) => {
    const next: MemoryItem = { ...m, text: text.trim() || m.text, source: editedSource, brand: undefined, icon: 'edit' };
    setEditing(null);
    setList(list.map(x => (x.id === m.id ? next : x)));
    onEdit?.(next);
  };
  const forget = (m: MemoryItem) => {
    const at = list.indexOf(m);
    setList(list.filter(x => x !== m)); onForget?.(m);
    order.current.delete(m.id);
    setGone(g => [...g, { m, at, leaving: false }]);
    timers.current.set(m.id, setTimeout(() => {
      setGone(g => g.map(x => (x.m === m ? { ...x, leaving: true } : x)));
      timers.current.set(m.id, setTimeout(() => { setGone(g => g.filter(x => x.m !== m)); timers.current.delete(m.id); }, 320));
    }, undoFor));
  };
  const restore = (g: Gone) => {
    clearTimeout(timers.current.get(g.m.id)); timers.current.delete(g.m.id);
    setGone(x => x.filter(y => y !== g));
    const next = [...list]; next.splice(Math.min(g.at, next.length), 0, g.m);
    setList(next); onRestore?.(g.m);
  };

  // forgotten memories hold their place with an Undo until it times out
  const rows: ({ m: MemoryItem; g?: undefined } | { g: Gone; m?: undefined })[] = list.map(m => ({ m }));
  for (const g of gone) rows.splice(Math.min(g.at, rows.length), 0, { g });
  const shown = rows.filter(r => f === 'all' || (r.m ?? r.g.m).kind === f);
  // rows that were there when the tab painted stagger in; anything that arrives later comes in on its own
  if (!order.current.size) shown.forEach((r, i) => { if (r.m) order.current.set(r.m.id, i); });
  const delay = (id: MemoryItem['id']) => (order.current.get(id) ?? 0) * 40 + 'ms';
  // a memory the agent learns while the panel is open opens its own height, so the panel grows instead of jumping
  const reduce = useReducedMotion(), grown = useRef(new WeakSet<HTMLElement>());
  const grow = (el: HTMLDivElement | null) => {
    if (!el || grown.current.has(el)) return; grown.current.add(el);
    if (reduce || !el.animate) return;
    const cs = getComputedStyle(el), ease = cs.getPropertyValue('--dm-ease').trim() || 'ease';
    el.animate([{ height: '0px', paddingTop: '0px', paddingBottom: '0px', opacity: 0, filter: 'blur(4px)', overflow: 'hidden' },
      { height: cs.height, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, opacity: 1, filter: 'blur(0px)', overflow: 'hidden' }], { duration: 560, easing: ease });
  };
  const apps = [...new Set(list.map(m => m.brand).filter((b): b is BrandName => !!b))];

  return (
    <div data-dm="" className={cx('dm-mmx', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-mmx-h">
        <span className="dm-mmx-ic"><Icon name={icon} /></span>
        <div className="dm-mmx-ht">
          <b>{title}</b>
          <span className="dm-mmx-sub">
            <Swap className="dm-muted dm-mmx-st">{countLabel(list.length)}</Swap>
            {showSources && apps.length > 0 && <span className="dm-mmx-srcs" aria-hidden="true">{apps.map(b => <span key={b}><Brand name={b} /></span>)}</span>}
          </span>
        </div>
        <div className="dm-mmx-tab" style={{ display: 'flex' }}>
          <Seg label="Filter" value={f} onChange={setF} options={[{ value: 'all', label: allLabel }, ...kinds.map(k => ({ value: k.value, label: k.label }))]} />
        </div>
      </div>
      <div className="dm-mmx-list">
        {shown.map(r => {
          if (r.g) {
            const { m, leaving } = r.g;
            return (
              <div key={`${paint}-gone-${m.id}`} className={cx('dm-mmx-gone', leaving ? 'dm-leave' : 'dm-enter')}>
                <span>Forgot “{m.text.slice(0, 32)}{m.text.length > 32 ? '…' : ''}”</span>
                <button type="button" onClick={() => restore(r.g)}>Undo</button>
              </div>
            );
          }
          const m = r.m, arriving = !!(m.isNew || m.learning) && !order.current.has(m.id), k = kindOf(m.kind);
          const fresh = learnt.current.has(m.id) && !m.learning;
          return (
            // a memory that turns `used` pulses once, as the class arrives
            <div key={`${paint}-${m.id}`} ref={arriving ? grow : undefined}
              className={cx('dm-mmx-m', !arriving && 'dm-enter', m.isNew && 'dm-new', m.learning && 'dm-learn', m.used && 'dm-use')}
              style={{ '--dm-k': k?.color ?? 'var(--dm-muted)', ...(arriving ? null : { animationDelay: delay(m.id) }) } as CSSProperties}>
              <span key={m.learning ? 'learn' : 'from'} className={cx('dm-mmx-src', fresh && 'dm-enter')} aria-hidden="true">
                {m.learning ? <span className="dm-spin" /> : <Mark brand={m.brand} icon={m.icon} />}
              </span>
              <span className="dm-mmx-b">
                {editing === m.id
                  ? <span key="edit" ref={edit} className="dm-t" spellCheck={false} contentEditable suppressContentEditableWarning
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
                      onBlur={e => commit(m, e.currentTarget.textContent ?? '')}>{m.text}</span>
                  : <Swap key="view" className={cx('dm-t', m.learning && 'dm-shim')}>{m.text}</Swap>}
                <span className="dm-mmx-meta">
                  {k && <span className="dm-k">{k.label}</span>}
                  {k && m.source && <span aria-hidden="true">·</span>}
                  {m.source && <span className="dm-s">{m.source}</span>}
                  {m.isNew && <span className="dm-tag dm-nw">{newLabel}</span>}
                  {m.used && <span className="dm-tag dm-nw">{usedLabel}</span>}
                </span>
              </span>
              <span className="dm-acts">
                <Tip label="Edit"><button type="button" className="dm-ib" aria-label="Edit" disabled={m.learning} onClick={() => setEditing(m.id)}><Icon name="edit" size="xs" /></button></Tip>
                <Tip label="Forget"><button type="button" className="dm-ib" aria-label="Forget" disabled={m.learning} onClick={() => forget(m)}><Icon name="trash" size="xs" /></button></Tip>
              </span>
            </div>
          );
        })}
      </div>
      {activity && (
        <div className="dm-mmx-f" aria-live="polite">
          <span className="dm-mmx-fi" aria-hidden="true"><Mark brand={activity.brand} icon={activity.icon ?? (activity.brand ? undefined : 'spark')} /></span>
          <Swap className={cx('dm-mmx-ft', activity.live && 'dm-shim')}>{activity.text}</Swap>
        </div>
      )}
    </div>
  );
}
```

## More in Workspace

- [Automation canvas](https://designme.dev/components/automation-canvas.md): A trigger, a few agent steps, and a run you can watch flow through.
- [Canvas toolbar](https://designme.dev/components/canvas-toolbar.md): A floating toolbar for a workflow canvas: run, pick a tool, comment, fit and zoom.
- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
- [Model compare](https://designme.dev/components/model-compare.md): Run one prompt on three models side by side and keep the best.
- [Agent builder](https://designme.dev/components/agent-builder.md): Describe an agent in a sentence and it drafts the rest: who it is, what it may do, what it knows, when it runs. Test it, save it, publish it.
- [Agent settings](https://designme.dev/components/agent-settings.md): How much the agent may do alone, with a save bar for changes.
- [Tools and connections](https://designme.dev/components/tool-connections.md): The tools the agent can reach, and how much it may do with each.
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md): The files, sites and folders the agent knows, and how far each is indexed.
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md): Tasks the agent runs on a schedule, with their last result and a switch.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.
- [Workspace rail](https://designme.dev/components/workspace-rail.md): A slim app rail that opens into a labelled sidebar.

All components: https://designme.dev/llms.txt
