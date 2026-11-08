# Command palette

> Jump anywhere or hand a task to the agent from one box.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/command-palette

## Install

```sh
npx designme add command-palette          # HTML, CSS and JS, with the shared core
npx designme add command-palette --react  # React 19 component and its CSS
npx designme add command-palette --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/command-palette.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/command-palette.json  # Astro
```

## About

A search box with a list of commands under it, grouped by heading, where a person can jump to a page, run an action, or pass what they typed to the agent. As soon as something is typed, the list narrows and a last row, "Ask the agent", sends the text to the agent instead. It gives an agent product one keyboard-first place to start anything.

### When to use it

- When people need a single shortcut that reaches every page and action in your app.
- When a typed request that matches no command should still reach the agent.
- When you want to show keyboard shortcuts next to the commands they trigger.
- Inside a modal opened by a key such as Cmd K, closed again with Escape.

### What it does

- Filters `items` as you type, matching the letters of the query in order anywhere in the label, and marks the matching letters in the accent. Rows that come into the list rise in a short cascade.
- Lists commands under their `group` heading, each with an icon on a tile in its `tone` (blue, purple, green, orange, red, yellow, pink or teal, grey when left out), an optional quiet `hint` after the label, and optional `keys` shown as keyboard chips.
- A grey highlight glides to the row the arrows or the pointer are on, and the keyboard chips on it turn white.
- Adds an "Ask the agent" row at the end whenever the box has text, with the text in quotes and Enter shown while it is highlighted, which calls `onAsk` with that text.
- Runs the highlighted command on click or Enter and calls `onRun` with it. The command's tile spins for a beat, then the footer says what ran, or shows your own `status` text.
- Works controlled through `query` and `onQueryChange`, or holds its own text with `defaultQuery`.

### Accessibility

- The list has role="listbox" and each row has role="option" with aria-selected on the highlighted one.
- The input is a `combobox` that points at the highlighted row with `aria-activedescendant`, so the focus stays in the box and the rows are not tab stops.
- Arrow Up and Arrow Down move the highlight and wrap around, and Enter runs the highlighted row.
- Escape clears the box first, and calls `onClose` only when the box is already empty.
- The input carries aria-label="Command".
- With reduced motion the highlight and the rows don't glide or rise, and a command's tile doesn't spin before the footer updates.

## Usage in React

```tsx
import { CommandPalette } from '@/components/designme/command-palette/CommandPalette';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { CommandPalette, type CommandPaletteItem } from './CommandPalette';
import { useStory } from '../lib/useScript';

const COMMANDS: CommandPaletteItem[] = [
  { group: 'Agent', icon: 'spark', label: 'Audit this page for contrast', keys: ['⌘', 'J'], hint: 'WCAG AA', tone: 'purple' },
  { group: 'Agent', icon: 'wand', label: 'Tidy layer names in the selection', hint: '12 layers', tone: 'purple' },
  { group: 'Agent', icon: 'code', label: 'Export tokens as CSS variables', hint: 'tokens.css', tone: 'purple' },
  { group: 'Go to', icon: 'layers', label: 'Pricing v4', keys: ['G', 'P'], hint: 'Page', tone: 'blue' },
  { group: 'Go to', icon: 'figma', label: 'Checkout flow', hint: 'Figma file', tone: 'blue' },
  { group: 'Go to', icon: 'book', label: 'Memory', hint: 'Team notes', tone: 'blue' },
  { group: 'Actions', icon: 'users', label: 'Invite a teammate', hint: 'Acme Labs', tone: 'teal' },
  { group: 'Actions', icon: 'gear', label: 'Agent settings', keys: ['⌘', ','], tone: 'teal' },
  { group: 'Actions', icon: 'palette', label: 'Switch theme', hint: 'Light', tone: 'teal' }
];

/* ---------- Command palette: someone types "tok" and runs the token export, then finds the invite and runs it ---------- */
export default function CommandPaletteDemo() {
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  // clicking, focusing or typing in it takes over, and what it had typed goes
  useStory(ref, async ({ wait, taken }) => {
    let typing = false;
    taken(() => { if (typing) setQuery(''); });
    const type = async (text: string) => { typing = true; let typed = ''; for (const ch of text) { typed += ch; setQuery(typed); await wait(180); } typing = false; };
    // Enter in the box runs the highlighted row, as a person pressing it would
    const enter = () => ref.current?.querySelector('input')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await wait(1500);
    await type('tok'); await wait(1000); enter(); await wait(2000);
    setQuery(''); await wait(500);
    await type('invi'); await wait(1000); enter();
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <CommandPalette items={COMMANDS} query={query} onQueryChange={setQuery} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `items` | `CommandPaletteItem[]` |  |
| `query` (optional) | `string` | What is typed in the box. Leave it out to let the box hold its own |
| `defaultQuery` (optional) | `string` |  |
| `onQueryChange` (optional) | `(query: string) => void` |  |
| `onRun` (optional) | `(item: CommandPaletteItem) => void` | Called when a command runs, by click or Enter |
| `onAsk` (optional) | `(query: string) => void` | Called with the typed text when the last row, "Ask the agent", runs |
| `onClose` (optional) | `() => void` | Called by Escape when the box is already empty |
| `placeholder` (optional) | `string` |  |
| `status` (optional) | `string` | The quiet text at the end of the footer. Defaults to what ran last |
| `autoFocus` (optional) | `boolean` | Puts the cursor in the box when it appears |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import CommandPalette from '../components/designme/command-palette/CommandPalette.astro';
---
<CommandPalette />
<CommandPalette data-style="soft" class="my-class" />
```
It plays its demo; change `command-palette.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I send a free-text request to the agent?**

Pass `onAsk`. When the box has text, the last row reads "Ask the agent" with the typed text in quotes, and running it calls `onAsk` with the trimmed query.

**How does the filter match commands?**

Each letter of the query must appear in the label in the same order, though not side by side. So "tok" matches "Export tokens as CSS variables".

**How do I close the palette with Escape?**

Pass `onClose`. The first Escape clears any text, and the next Escape, on an empty box, calls `onClose` so you can hide the palette.

**Can I focus the input when the palette opens?**

Yes. Set `autoFocus` and the cursor goes into the box when it appears.

## Source

`CommandPalette.tsx`, as `npx designme add command-palette --react` installs it:

```tsx
'use client';
import { Fragment, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import '../designme.css';
import './command-palette.css';

export type CommandTone = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';
const TONE: Record<CommandTone, string> = { blue: 'pb', purple: 'pl', green: 'pm', orange: 'pp', red: 'pr', yellow: 'py', pink: 'pk', teal: 'pt' };

/** One command in the palette */
export interface CommandPaletteItem {
  /** The group it is listed under, like "Go to" */
  group: string;
  icon: IconName;
  /** What it does, like "Invite a teammate". Typing matches it letter by letter */
  label: string;
  /** Its shortcut, one key per entry, like ['⌘', 'J'] */
  keys?: string[];
  /** A quiet word or two after the label, like "tokens.css". It isn't matched, and gives way first on a narrow palette */
  hint?: string;
  /** The hue of its icon tile, usually one per group. Leave it out for grey */
  tone?: CommandTone;
}

export interface CommandPaletteProps {
  items: CommandPaletteItem[];
  /** What is typed in the box. Leave it out to let the box hold its own */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** Called when a command runs, by click or Enter */
  onRun?: (item: CommandPaletteItem) => void;
  /** Called with the typed text when the last row, "Ask the agent", runs */
  onAsk?: (query: string) => void;
  /** Called by Escape when the box is already empty */
  onClose?: () => void;
  placeholder?: string;
  /** The quiet text at the end of the footer. Defaults to what ran last */
  status?: string;
  /** Puts the cursor in the box when it appears */
  autoFocus?: boolean;
  className?: string;
}

// letters of the query, in order, anywhere in the label
const matches = (label: string, q: string) => {
  const l = label.toLowerCase(); let at = 0;
  for (const ch of q.toLowerCase()) { at = l.indexOf(ch, at); if (at < 0) return false; at++; }
  return true;
};
// every letter the query contains is marked, as on designme.dev
const marked = (label: string, q: string) => {
  if (!q) return label;
  const set = new Set(q.toLowerCase()), out: { t: string; m: boolean }[] = [];
  for (const ch of label) { const m = set.has(ch.toLowerCase()), last = out[out.length - 1]; if (last && !last.m && !m) last.t += ch; else out.push({ t: ch, m }); }
  return out.map((p, i) => p.m ? <mark key={i}>{p.t}</mark> : <Fragment key={i}>{p.t}</Fragment>);
};

/** Jump anywhere or hand a task to the agent from one box. Type to filter, arrows to move, Enter to run, Escape to clear.
    Each command has a tile in its hue and a quiet hint; a command that runs spins its tile for a beat. */
export function CommandPalette({ items, query, defaultQuery = '', onQueryChange, onRun, onAsk, onClose, placeholder = 'Search or ask the agent', status, autoFocus, className }: CommandPaletteProps) {
  const [q, setQ] = useControllable(query, defaultQuery, onQueryChange);
  const v = q.trim();
  const shown = items.filter(it => matches(it.label, v));
  const rows = v ? [...shown, null] : shown; // null is the "Ask the agent" row
  // the highlight goes back to the first row whenever the list changes
  const [hi, setHi] = useState({ at: 0, for: v });
  const at = hi.for === v ? Math.min(hi.at, Math.max(0, rows.length - 1)) : 0;
  const [ran, setRan] = useState('');
  // the row that just ran spins its tile for a beat before the footer says what ran
  const [busy, setBusy] = useState<string>();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  // rows that arrive after the first render play a short rise, in a cascade
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);

  const list = useRef<HTMLDivElement>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId(), reduce = useReducedMotion();
  const [top, setTop] = useState<{ for: string; px: number }>();
  useIsoLayoutEffect(() => {
    const b = btns.current[at], l = list.current; if (!b || !l) return;
    setTop({ for: v, px: b.offsetTop });
    if (b.offsetTop < l.scrollTop || b.offsetTop + 36 > l.scrollTop + l.clientHeight) l.scrollTo({ top: b.offsetTop - 40, behavior: reduce ? 'auto' : 'smooth' });
  }, [at, v, rows.length, reduce]);

  // while there is more list below, its last row fades out at the edge instead of being cut off by the footer
  const [more, setMore] = useState(false);
  const edge = () => { const l = list.current; if (l) setMore(l.scrollTop + l.clientHeight < l.scrollHeight - 2); };
  useIsoLayoutEffect(edge, [v, rows.length]);

  const move = (d: number) => { if (rows.length) setHi({ at: (at + d + rows.length) % rows.length, for: v }); };
  const run = (i: number) => {
    const row = rows[i], b = btns.current[i];
    if (row === undefined) return;
    if (row) onRun?.(row); else onAsk?.(v);
    const said = row ? 'Ran: ' + row.label : 'Sent to the agent', k = row ? row.group + row.label : '\u0000ask';
    setBusy(k); clearTimeout(timer.current);
    timer.current = setTimeout(() => { setBusy(b => b === k ? undefined : b); setRan(said); }, reduce ? 0 : 650);
    b?.animate?.([{ transform: 'scale(1)' }, { transform: 'scale(.98)' }, { transform: 'scale(1)' }], { duration: 260, easing: 'ease-out' });
  };
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { move(1); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { move(-1); e.preventDefault(); }
    else if (e.key === 'Enter') run(at);
    else if (e.key === 'Escape') { if (q) setQ(''); else onClose?.(); }
  };

  let group = '';
  return (
    <div data-dm="" className={cx('dm-cpl dm-panel', className)}>
      <div className="dm-cpl-in">
        <Icon name="search" />
        {/* the box keeps the focus and points at the highlighted row, so the rows are not tab stops */}
        <input className="dm-cpl-q" placeholder={placeholder} aria-label="Command" spellCheck={false} autoFocus={autoFocus} value={q}
          role="combobox" aria-expanded aria-controls={`${id}-list`} aria-autocomplete="list" aria-activedescendant={rows.length ? `${id}-${at}` : undefined}
          onChange={e => setQ(e.target.value)} onKeyDown={key} />
        <span className="dm-kbd">esc</span>
      </div>
      <div className={cx('dm-cpl-list', more && 'dm-more')} role="listbox" id={`${id}-list`} aria-label="Commands" tabIndex={-1} ref={list} onScroll={edge}>
        {/* a new list starts the highlight afresh, so it jumps into place instead of sliding */}
        <span key={v} className="dm-cpl-hl" style={{ top: top?.for === v ? top.px : undefined }} />
        {rows.map((row, i) => {
          const head = row ? row.group : 'Ask', k = row ? row.group + row.label : '\u0000ask';
          const g = head !== group ? <div className="dm-cpl-g">{(group = head)}</div> : null;
          const tone = row?.tone ? TONE[row.tone] : undefined;
          return (
            <Fragment key={k}>
              {g}
              <button type="button" ref={el => { btns.current[i] = el; }} className={cx('dm-cpl-i', !row && 'dm-ask', i === at && 'dm-hl', ready && 'dm-in')}
                style={ready ? { animationDelay: `${Math.min(i, 6) * 28}ms` } : undefined}
                role="option" id={`${id}-${i}`} tabIndex={-1} aria-selected={i === at} onMouseEnter={() => setHi({ at: i, for: v })} onClick={() => run(i)}>
                <span className="dm-ic" style={tone ? { '--dm-tc': `var(--dm-${tone})`, '--dm-tb': `var(--dm-${tone}-bg)` } as CSSProperties : undefined}>
                  {busy === k ? <span className="dm-spin" aria-hidden="true" /> : <Icon name={row ? row.icon : 'spark'} size="xs" />}
                </span>
                <span className="dm-t">{row ? marked(row.label, v) : <>Ask the agent <span className="dm-q">“{v}”</span></>}</span>
                {row?.hint && <span className="dm-h">{row.hint}</span>}
                {row?.keys && <span className="dm-k">{row.keys.map((k, j) => <span key={j} className="dm-kbd">{k}</span>)}</span>}
                {!row && <span className="dm-kbd dm-ent" aria-hidden="true">↵</span>}
              </button>
            </Fragment>
          );
        })}
      </div>
      <div className="dm-cpl-f dm-muted">
        <span><span className="dm-kbd">↑</span><span className="dm-kbd">↓</span> move</span>
        <span><span className="dm-kbd">↵</span> run</span>
        <span className="dm-cpl-st">{(status ?? ran) && <span key={status ?? ran} className="dm-enter"><span className="dm-dot" aria-hidden="true" />{status ?? ran}</span>}</span>
      </div>
    </div>
  );
}
```

## More in Workspace

- [Automation canvas](https://designme.dev/components/automation-canvas.md): A trigger, a few agent steps, and a run you can watch flow through.
- [Canvas toolbar](https://designme.dev/components/canvas-toolbar.md): A floating toolbar for a workflow canvas: run, pick a tool, comment, fit and zoom.
- [Step inspector](https://designme.dev/components/step-inspector.md): The settings of one step in an agent workflow, in sections that fold.
- [Data picker](https://designme.dev/components/data-picker.md): Map a field from earlier steps into a step's input.
- [Run drawer](https://designme.dev/components/run-drawer.md): A workflow's run under its canvas: the steps, the log and the data.
- [Memory panel](https://designme.dev/components/memory-panel.md): What the agent remembers about your team, editable and removable.
- [Model compare](https://designme.dev/components/model-compare.md): Run one prompt on three models side by side and keep the best.
- [Agent builder](https://designme.dev/components/agent-builder.md): Describe an agent in a sentence and it drafts the rest: who it is, what it may do, what it knows, when it runs. Test it, save it, publish it.
- [Agent settings](https://designme.dev/components/agent-settings.md): How much the agent may do alone, with a save bar for changes.
- [Tools and connections](https://designme.dev/components/tool-connections.md): The tools the agent can reach, and how much it may do with each.
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md): The files, sites and folders the agent knows, and how far each is indexed.
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md): Tasks the agent runs on a schedule, with their last result and a switch.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.
- [Workspace rail](https://designme.dev/components/workspace-rail.md): A slim app rail that opens into a labelled sidebar.

All components: https://designme.dev/llms.txt
