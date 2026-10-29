# Memory panel

> What the agent remembers about your team, editable and removable.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/memory-panel

## Install

```sh
npx designme add memory-panel          # HTML, CSS and JS, with the shared core
npx designme add memory-panel --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

A list of the things an agent remembers about a team, such as brand rules and working habits, with the source of each one. People can filter memories by kind, fix one in place, or tell the agent to forget it. It makes the agent's long-term memory visible and correctable.

### When to use it

- When your agent keeps memories across sessions and people should be able to see them.
- When someone needs to correct a rule the agent learned wrong.
- When you want to show the agent learning something new while the panel is open.
- As a settings page or a flat block inside a chat thread.

### What it does

- Filter tabs for All plus one per entry in `kinds`, each kind with its own dot colour.
- Edit turns a memory into editable text; Enter or leaving the field saves it, gives it the `editedSource` line and calls `onEdit`.
- Forget removes a memory and leaves an Undo in its place for `undoFor` ms (4000 by default), calling `onForget` and, if undone, `onRestore`.
- A memory marked `isNew` is highlighted and grows into the list when it arrives while the panel is open.
- The count under the title updates as memories come and go, worded by `countLabel`.
- Sits flat by default; set `bare` to false to give it its own card.

### Accessibility

- The filter tabs are a role="group" labelled "Filter", with aria-pressed on the active tab.
- The Edit and Forget icon buttons have aria-labels and tooltips that also show on keyboard focus.
- Pressing Enter while editing a memory saves it.
- The grow animation for a new memory is skipped when the user prefers reduced motion.

## Usage in React

```tsx
import { MemoryPanel } from '@/components/designme/memory-panel/MemoryPanel';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { MemoryPanel, type MemoryItem, type MemoryKind } from './MemoryPanel';
import { useScript } from '../lib/useScript';

const KINDS: MemoryKind[] = [
  { value: 'brand', label: 'Brand', color: 'var(--dm-pb)' },
  { value: 'process', label: 'Process', color: 'var(--dm-pt)' }
];
const START: MemoryItem[] = [
  ['brand', 'Primary buttons use the accent blue, never black', 'From the Pricing review, Sep 12'],
  ['brand', 'Headlines stay under eight words', 'You told the agent, Aug 30'],
  ['process', 'Ask Maya before publishing to the shared library', 'From a Slack thread, Sep 4'],
  ['brand', 'Card radius is 16px on web, 12px in the app', 'From tokens.css'],
  ['process', 'Run the launch checklist before every PR', 'You told the agent, Sep 20'],
  ['process', 'Weekly QA posts go to #design, not #general', 'From settings'],
  ['brand', 'No em dashes in product copy', 'You told the agent, Oct 2']
].map(([kind, text, source], id) => ({ id, kind, text, source }));

/* ---------- Memory panel: a new memory arrives from your edit, and every memory can be edited or forgotten ---------- */
export default function MemoryPanelDemo() {
  const [list, setList] = useState(START);
  useScript(async ({ wait }) => {
    await wait(2200);
    setList(l => [{ id: 100, kind: 'brand', text: 'Use “Start free” instead of “Sign up” on CTAs', source: 'Learned just now from your edit', isNew: true }, ...l]);
    await wait(2600);
    setList(l => l.map(m => (m.id === 100 ? { ...m, isNew: false, source: 'Learned from your edit, today' } : m)));
  });
  return (
    <div style={{ width: '100%' }}>
      <MemoryPanel kinds={KINDS} memories={list} onMemoriesChange={setList} />
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
| `countLabel` (optional) | `(count: number) => string` | The line under the title, like "7 memories" |
| `editedSource` (optional) | `string` | The source an edited memory gets |
| `onEdit` (optional) | `(memory: MemoryItem) => void` | Called with the memory after an edit |
| `onForget` (optional) | `(memory: MemoryItem) => void` | Called when a memory is forgotten. It can still come back with Undo for `undoFor` ms |
| `onRestore` (optional) | `(memory: MemoryItem) => void` | Called when Undo brings a forgotten memory back |
| `undoFor` (optional) | `number` | How long Undo stays, in ms |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Questions

**How do I save an edited memory to my backend?**

Use `onEdit`. It is called with the updated memory after an edit, with its new text and the `editedSource` line. If the text is left empty, the old text is kept.

**When should I delete a forgotten memory for good?**

`onForget` fires as soon as someone clicks Forget, and `onRestore` fires if they click Undo within `undoFor` ms. Wait out that window, or handle both callbacks, before deleting it on the server.

**How do I show a memory the agent just learned?**

Add it to the front of `memories` with `isNew: true`. It grows into the list and is highlighted; set `isNew` back to false later to clear the highlight.

**Can I use my own categories?**

Yes. Pass `kinds` with a value, a tab label and a dot colour for each; every memory points to one by its `kind`.

## Source

`MemoryPanel.tsx`, as `npx designme add memory-panel --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Dot, Seg, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './memory-panel.css';

/** A group of memories, with its own filter tab and dot colour */
export interface MemoryKind {
  value: string;
  /** Its tab, like "Brand" */
  label: string;
  /** The dot before its memories, like 'var(--dm-pb)' */
  color: string;
}

/** Something the agent remembers */
export interface MemoryItem {
  id: string | number;
  /** Which kind it is, by value */
  kind: string;
  /** What it remembers, like "Headlines stay under eight words" */
  text: string;
  /** Where it came from, like "You told the agent, Aug 30" */
  source?: string;
  /** Highlights it as just learned */
  isNew?: boolean;
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
  /** The line under the title, like "7 memories" */
  countLabel?: (count: number) => string;
  /** The source an edited memory gets */
  editedSource?: string;
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

/** What the agent remembers about the team, filtered by kind, each memory editable in place or forgotten with an undo. */
export function MemoryPanel({
  title = 'Team memory', icon = 'book', kinds, memories, defaultMemories = [], onMemoriesChange, filter, defaultFilter = 'all', onFilterChange,
  allLabel = 'All', countLabel = plural, editedSource = 'Edited by you, just now', onEdit, onForget, onRestore, undoFor = 4000, bare = true, className
}: MemoryPanelProps) {
  const [list, setList] = useControllable(memories, defaultMemories, onMemoriesChange);
  const [f, setF] = useControllable(filter, defaultFilter, onFilterChange);
  const [gone, setGone] = useState<Gone[]>([]);
  const [editing, setEditing] = useState<MemoryItem['id'] | null>(null);
  const timers = useRef(new Map<MemoryItem['id'], ReturnType<typeof setTimeout>>());
  const edit = useRef<HTMLSpanElement>(null);
  const colour = (kind: string) => kinds.find(k => k.value === kind)?.color ?? 'var(--dm-faint)';

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

  const commit = (m: MemoryItem, text: string) => {
    const next = { ...m, text: text.trim() || m.text, source: editedSource };
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

  return (
    <div data-dm="" className={cx('dm-mmx', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-mmx-h">
        <span className="dm-mmx-ic"><Icon name={icon} /></span>
        <div className="dm-mmx-ht"><b>{title}</b><Swap className="dm-muted dm-mmx-st">{countLabel(list.length)}</Swap></div>
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
          const m = r.m, arriving = !!m.isNew && !order.current.has(m.id);
          return (
            <div key={`${paint}-${m.id}`} ref={arriving ? grow : undefined} className={cx('dm-mmx-m', !arriving && 'dm-enter', m.isNew && 'dm-new')} style={arriving ? undefined : { animationDelay: delay(m.id) }}>
              <Dot color={colour(m.kind)} />
              {editing === m.id
                ? <span key="edit" ref={edit} className="dm-t" spellCheck={false} contentEditable suppressContentEditableWarning
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
                    onBlur={e => commit(m, e.currentTarget.textContent ?? '')}>{m.text}</span>
                : <span key="view" className="dm-t" spellCheck={false}>{m.text}{m.source && <span className="dm-src">{m.source}</span>}</span>}
              <span className="dm-acts">
                <Tip label="Edit"><button type="button" className="dm-ib" aria-label="Edit" onClick={() => setEditing(m.id)}><Icon name="edit" size="xs" /></button></Tip>
                <Tip label="Forget"><button type="button" className="dm-ib" aria-label="Forget" onClick={() => forget(m)}><Icon name="trash" size="xs" /></button></Tip>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## More in Workspace

- [Automation canvas](https://designme.dev/components/automation-canvas.md): A trigger, a few agent steps, and a run you can watch flow through.
- [Canvas toolbar](https://designme.dev/components/canvas-toolbar.md): A floating toolbar for a workflow canvas: run, pick a tool, comment, fit and zoom.
- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
- [Model compare](https://designme.dev/components/model-compare.md): Run one prompt on three models side by side and keep the best.
- [Agent settings](https://designme.dev/components/agent-settings.md): How much the agent may do alone, with a save bar for changes.
- [Tools and connections](https://designme.dev/components/tool-connections.md): The tools the agent can reach, and how much it may do with each.
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md): The files, sites and folders the agent knows, and how far each is indexed.
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md): Tasks the agent runs on a schedule, with their last result and a switch.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.
- [Workspace rail](https://designme.dev/components/workspace-rail.md): A slim app rail that opens into a labelled sidebar.

All components: https://designme.dev/llms.txt
