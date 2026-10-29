# Step library

> Search the steps a workflow can use, preview what each does, and add one.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/step-library

## Install

```sh
npx designme add step-library          # HTML, CSS and JS, with the shared core
npx designme add step-library --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Step library is the side panel people build a workflow from. It lists the steps an agent workflow can use, in groups like AI, Tools, Logic and Actions with a count on each, under a search field. Hovering or focusing a step shows what it does, what it takes and what it gives in a card beside the panel, and Enter, a click or a drag into the workflow adds it.

### When to use it

- Beside a workflow canvas or a list of steps, so people can find the next step without leaving it.
- When there are more steps than fit on screen and people need to search them by name.
- When a step's name alone doesn't say enough, and people should read what it does before they add it.
- Not for choosing one value from a short list: use a select or Multi-select then.

### What it does

- The search narrows the steps by name as you type, and the start of a group's name finds the whole group. Matching letters are marked, the header shows how many steps match out of all of them, and a search that finds nothing says so, with Clear search.
- Each group folds under its header, which shows its count. A search opens any folded group it finds something in.
- Hovering a step shows its preview after a short pause, then follows straight away from row to row; focusing a step with the keyboard shows it at once. The preview sits beside the panel, level with the row, over the workflow and never over the list. Below 560px wide the workflow steps aside and the description shows at the foot of the panel instead.
- A click or Enter adds the step; so does Enter in the search, for the first match. The row's plus turns into a tick for a moment, and the step joins the workflow at the end.
- Rows can be dragged into the workflow, which shows where to drop them. In React this is on when there is a `workflow`, and `draggable` turns it off or on.
- In HTML the panel fires a `step-add` event with the step's `id`, `name`, `group` and `via` (click, keyboard or drop). In React, `onAdd(step, group, via)` does the same, `workflow` holds the steps beside the panel, and `query` and `collapsed` are each controlled or left to the component.
- The steps are your own: in HTML they are the list at the top of the script, and in React the `groups` prop, each with its icon, name, description and optional `takes` and `gives`.

### Accessibility

- The search field is labelled. ↓ in it moves to the first step, Enter adds the first match, and Escape clears it while the focus stays in it.
- The list is one tab stop. ↑ and ↓ move through the group headers and the steps that show, Home and End jump to the ends, and ↑ from the first goes back to the search. Typing a letter in the list goes on into the search, and Backspace takes one off.
- Group headers are buttons with `aria-expanded` and `aria-controls`; Enter or Space folds them, ← folds and → opens one, and ← on a step goes to its group's header. A folded group is hidden from Tab and screen readers.
- Each step is a button described by its description, so a screen reader reads what it does without the preview, which is `aria-hidden`.
- An `aria-live="polite"` region says how many steps a search found, that the search was cleared, and which step was added and how many steps the workflow now has.
- With reduced motion on, nothing fades or slides in, and the workflow jumps to its newest step instead of scrolling.

## Usage in React

```tsx
import { StepLibrary } from '@/components/designme/step-library/StepLibrary';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { StepLibrary, type StepLibraryFlowStep, type StepLibraryGroup } from './StepLibrary';
import { useStory } from '../lib/useScript';

const GROUPS: StepLibraryGroup[] = [
  { id: 'ai', label: 'AI', color: 'var(--dm-accent-mark)', iconColor: 'var(--dm-accent-fg)', steps: [
    { id: 'summarize', icon: 'spark', name: 'Summarize text', description: 'Turns long text into a short summary or a few bullet points, at the length you set.', takes: 'Any text, like a thread or a transcript', gives: 'A summary' },
    { id: 'classify', icon: 'hash', name: 'Classify', description: 'Sorts what comes in into one of the labels you list, with how sure it is.', takes: 'Text and your labels', gives: 'A label and a score' },
    { id: 'extract', icon: 'table', name: 'Extract fields', description: 'Pulls named fields, like a date or an order number, out of free text.', takes: 'Text and the fields to find', gives: 'A record with those fields' },
    { id: 'draft', icon: 'edit', name: 'Write a draft', description: 'Writes a first draft from your instructions and what the earlier steps found.', takes: 'Instructions and context', gives: 'Draft text to review' }] },
  { id: 'tools', label: 'Tools', color: 'var(--dm-pb)', steps: [
    { id: 'web', icon: 'globe', name: 'Search the web', description: 'Runs a web search and passes on the top results with their links.', takes: 'A query', gives: 'Results with titles and links' },
    { id: 'file', icon: 'file-text', name: 'Read a file', description: 'Opens a document from the workspace and passes on its text.', takes: 'A file', gives: 'The text of the file' },
    { id: 'db', icon: 'db', name: 'Query a database', description: 'Runs a read-only query and returns the rows that match.', takes: 'A query', gives: 'Rows as a table' },
    { id: 'api', icon: 'link', name: 'Call an API', description: 'Sends an HTTP request and hands the response to the next step.', takes: 'A URL, a method and a body', gives: 'The response' }] },
  { id: 'logic', label: 'Logic', color: 'var(--dm-pl)', steps: [
    { id: 'if', icon: 'branch', name: 'If / else', description: 'Sends the run down one of two paths, depending on a condition.', takes: 'A condition', gives: 'One of two paths' },
    { id: 'loop', icon: 'refresh', name: 'Loop over items', description: 'Runs the steps inside it once for each item in a list.', takes: 'A list', gives: 'One result per item' },
    { id: 'wait', icon: 'clock', name: 'Wait', description: 'Pauses the run for a set time, or until a date and time.', takes: 'A duration or a date', gives: 'The run, later' },
    { id: 'approve', icon: 'shield', name: 'Ask for approval', description: 'Holds the run until a person approves or rejects what happens next.', takes: 'Who to ask, and what', gives: 'Approved or rejected' }] },
  { id: 'actions', label: 'Actions', color: 'var(--dm-pm)', steps: [
    { id: 'email', icon: 'mail', name: 'Send an email', description: 'Sends an email from your workspace to one or more people.', takes: 'To, subject and body', gives: 'The sent email' },
    { id: 'post', icon: 'send', name: 'Post a message', description: 'Posts a message in a team chat channel.', takes: 'A channel and the message', gives: 'The posted message' },
    { id: 'ticket', icon: 'flag', name: 'Create a ticket', description: 'Opens a ticket in your tracker with a title, details and an owner.', takes: 'Title, details and owner', gives: 'The new ticket' },
    { id: 'record', icon: 'sliders', name: 'Update a record', description: 'Changes fields on a record in your CRM or database.', takes: 'The record and its new values', gives: 'The updated record' }] }
];
const START: StepLibraryFlowStep[] = [
  { key: 'trigger', icon: 'bolt', color: 'var(--dm-py)', name: 'When a ticket arrives', detail: 'Trigger' },
  { key: 'classify', icon: 'hash', color: 'var(--dm-accent-fg)', name: 'Classify', detail: 'AI' },
  { key: 'db', icon: 'db', color: 'var(--dm-pb)', name: 'Query a database', detail: 'Tools' }
];

/* ---------- Step library: search for "sum", read what Summarize text does, add it, clear the search, fold Tools ---------- */
export default function StepLibraryDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [steps, setSteps] = useState(START);

  // the preview's story. Your first click or key stops it, and the panel is yours from wherever it got to
  useStory(ref, async ({ wait, press, taken }) => {
    taken(() => setQuery(''));
    await wait(1500);
    for (const ch of 'sum') { setQuery(q => q + ch); await wait(110); }
    await wait(1000);
    ref.current?.querySelector('.dm-slb-s')?.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }));
    await wait(2000); press('.dm-slb-s');
    await wait(1500); setQuery('');
    await wait(1000); setCollapsed(['tools']);
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <StepLibrary groups={GROUPS} query={query} onQueryChange={setQuery} collapsed={collapsed} onCollapsedChange={setCollapsed}
        workflow={{ title: 'Support triage', steps }}
        onAdd={(step, group) => setSteps(s => [...s, { key: step.id + '-' + s.length, icon: step.icon, color: group.iconColor ?? group.color, name: step.name, detail: group.label }])} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `groups` | `StepLibraryGroup[]` |  |
| `onAdd` (optional) | `(step: StepLibraryStep, group: StepLibraryGroup, via: StepLibraryAddVia) => void` | Called when a step is added: by a click, by Enter (on a row, or in the search for the first match), or by a drop on the workflow |
| `workflow` (optional) | `{ title: string; steps: StepLibraryFlowStep[] }` | The workflow beside the panel: its name and steps. Leave it out to show the panel on its own; the preview still opens beside it |
| `query` (optional) | `string` | What is typed in the search. Leave it out to let the panel keep it |
| `defaultQuery` (optional) | `string` |  |
| `onQueryChange` (optional) | `(query: string) => void` |  |
| `collapsed` (optional) | `string[]` | The ids of the folded groups. A search opens any folded group it finds something in |
| `defaultCollapsed` (optional) | `string[]` |  |
| `onCollapsedChange` (optional) | `(ids: string[]) => void` |  |
| `draggable` (optional) | `boolean` | Rows can be dragged into the workflow. Defaults to true when there is a workflow |
| `title` (optional) | `string` |  |
| `placeholder` (optional) | `string` |  |
| `previewHint` (optional) | `string` | The line at the foot of the preview |
| `dropLabel` (optional) | `string` |  |
| `className` (optional) | `string` |  |

## Questions

**Does it build the workflow for me?**

No. It tells you which step was added and how. Add the step to your own workflow in `onAdd` (or on `step-add` in HTML) and pass the new list back as `workflow`.

**Can I use it without the workflow beside it?**

Yes. Leave `workflow` out and the panel stands on its own; the preview still opens to its right, and dragging is off unless you turn it on with `draggable`.

**Does dragging work on phones?**

Dragging uses the browser's own drag and drop, which most phones don't offer for buttons. A tap adds the step there instead.

**What does the search match?**

Any part of a step's name, and the start of a group's name. It ignores case.

## Source

`StepLibrary.tsx`, as `npx designme add step-library --react` installs it:

```tsx
'use client';
import { useEffect, useId, useRef, useState, type DragEvent, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Tip } from '../lib/motion';
import '../designme.css';
import './step-library.css';

/** One step people can add */
export interface StepLibraryStep {
  id: string;
  icon: IconName;
  /** Like "Summarize text". The search matches it */
  name: string;
  /** What it does, in a sentence. Shown in the preview */
  description: string;
  /** What it needs, like "Any text, like a thread or a transcript" */
  takes?: string;
  /** What it passes on, like "A summary" */
  gives?: string;
}

/** A group of steps, like Tools or Logic. Its rows fold away under its header */
export interface StepLibraryGroup {
  id: string;
  /** Like "Tools". Typing the start of it finds the whole group */
  label: string;
  /** Its icons' colour, like 'var(--dm-pb)'. Each icon tile is a light tint of it */
  color: string;
  /** The icon's own colour when it differs from its tile's, like 'var(--dm-accent-fg)' for an accent tile */
  iconColor?: string;
  steps: StepLibraryStep[];
}

/** A step in the workflow beside the panel */
export interface StepLibraryFlowStep {
  key: string;
  icon: IconName;
  color: string;
  name: string;
  /** The quiet line under it, like its group */
  detail?: string;
}

export type StepLibraryAddVia = 'click' | 'keyboard' | 'drop';

export interface StepLibraryProps {
  groups: StepLibraryGroup[];
  /** Called when a step is added: by a click, by Enter (on a row, or in the search for the first match), or by a drop on the workflow */
  onAdd?: (step: StepLibraryStep, group: StepLibraryGroup, via: StepLibraryAddVia) => void;
  /** The workflow beside the panel: its name and steps. Leave it out to show the panel on its own; the preview still opens beside it */
  workflow?: { title: string; steps: StepLibraryFlowStep[] };
  /** What is typed in the search. Leave it out to let the panel keep it */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** The ids of the folded groups. A search opens any folded group it finds something in */
  collapsed?: string[];
  defaultCollapsed?: string[];
  onCollapsedChange?: (ids: string[]) => void;
  /** Rows can be dragged into the workflow. Defaults to true when there is a workflow */
  draggable?: boolean;
  title?: string;
  placeholder?: string;
  /** The line at the foot of the preview */
  previewHint?: string;
  dropLabel?: string;
  className?: string;
}

const MIME = 'application/x-designme-step';
const marked = (name: string, v: string): ReactNode => {
  const i = v ? name.toLowerCase().indexOf(v) : -1;
  return i < 0 ? name : <>{name.slice(0, i)}<mark>{name.slice(i, i + v.length)}</mark>{name.slice(i + v.length)}</>;
};
const tile = (icon: IconName, color: string, iconColor?: string) => (
  <span className="dm-ic" style={{ color: iconColor ?? color, background: `color-mix(in srgb,${color} 14%,transparent)` }}><Icon name={icon} size="xs" /></span>
);

/** A side panel of the steps a workflow can be built from: a search, groups that fold, and a row per step. Hovering or
 * focusing a step shows what it does beside the panel, never over the list; Enter, a click or a drag into the workflow adds
 * it. ↑ and ↓ move through the rows, typing searches, and Escape clears the search. */
export function StepLibrary({
  groups, onAdd, workflow, query, defaultQuery = '', onQueryChange, collapsed, defaultCollapsed = [], onCollapsedChange,
  draggable, title = 'Add a step', placeholder = 'Search steps', previewHint = 'Press Enter or click to add it, or drag it into the workflow',
  dropLabel = 'Drop a step here', className
}: StepLibraryProps) {
  const [q, setQ] = useControllable(query, defaultQuery, onQueryChange);
  const [shut, setShut] = useControllable(collapsed, defaultCollapsed, onCollapsedChange);
  const v = q.trim().toLowerCase();
  const total = groups.reduce((n, g) => n + g.steps.length, 0);
  const shown = groups.map(g => ({ g, steps: g.steps.filter(s => !v || s.name.toLowerCase().includes(v) || g.label.toLowerCase().startsWith(v)) })).filter(x => x.steps.length);
  const found = shown.reduce((n, x) => n + x.steps.length, 0);
  // a search opens any folded group it finds something in
  useEffect(() => { if (!v) return; const open = shut.filter(id => !shown.some(x => x.g.id === id)); if (open.length !== shut.length) setShut(open); }, [v]); // eslint-disable-line react-hooks/exhaustive-deps
  const canDrag = draggable ?? !!workflow;
  const uid = useId(), reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null), panel = useRef<HTMLDivElement>(null), list = useRef<HTMLDivElement>(null), field = useRef<HTMLInputElement>(null);
  const fl = useRef<HTMLOListElement>(null), pvEl = useRef<HTMLDivElement>(null);
  const [say, setSay] = useState('');
  const [narrow, setNarrow] = useState(false);
  useIsoLayoutEffect(() => {
    const el = root.current; if (!el) return;
    const read = () => setNarrow(el.clientWidth > 0 && el.clientWidth < 560);
    read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect();
  }, []);

  /* ---------- the list is one tab stop: ↑ and ↓ move through the headers and rows that show ---------- */
  const [stop, setStop] = useState<string | null>(null);
  const items = () => Array.from(list.current?.querySelectorAll<HTMLButtonElement>('.dm-slb-gb,.dm-slb-s,.dm-slb-ec') ?? []).filter(b => !b.closest('.dm-fold.dm-shut'));
  const keyOf = (b: HTMLElement) => b.dataset.k ?? '';
  const firstStep = shown.length && !shut.includes(shown[0].g.id) ? 's:' + shown[0].steps[0].id : shown.length ? 'g:' + shown[0].g.id : 'e';
  const tab = stop && (stop === 'e' ? !shown.length : stop.startsWith('g:') ? shown.some(x => 'g:' + x.g.id === stop) : shown.some(x => !shut.includes(x.g.id) && x.steps.some(s => 's:' + s.id === stop))) ? stop : firstStep;
  useEffect(() => { setStop(null); }, [v]);
  const keep = (b: HTMLElement) => {
    const l = list.current; if (!l) return; const lr = l.getBoundingClientRect(), br = b.getBoundingClientRect();
    if (br.top < lr.top + 4) l.scrollTop -= lr.top + 4 - br.top; else if (br.bottom > lr.bottom - 4) l.scrollTop += br.bottom - lr.bottom + 4;
  };
  const goTo = (b: HTMLElement) => { setStop(keyOf(b)); b.focus({ preventScroll: true }); keep(b); };
  const toggle = (id: string) => { const open = shut.includes(id); setShut(open ? shut.filter(x => x !== id) : [...shut, id]); setStop('g:' + id); };
  const clear = () => { const back = !!root.current?.contains(document.activeElement); setQ(''); if (back) field.current?.focus({ preventScroll: true }); setSay('Search cleared'); };
  useEffect(() => { if (v) setSay(found ? `${found} ${found === 1 ? 'step' : 'steps'} found` : 'No steps found'); }, [v, found]);

  /* ---------- the preview: the hovered step, or the focused one, beside the panel and level with its row ---------- */
  const [hov, setHov] = useState<string | null>(null), [foc, setFoc] = useState<string | null>(null);
  const [pv, setPv] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const want = hov ?? foc;
  useEffect(() => { clearTimeout(timer.current); if (want === pv) return; timer.current = setTimeout(() => setPv(want), want ? (pv ? 0 : (hov ? 280 : 0)) : 120); }, [want]); // eslint-disable-line react-hooks/exhaustive-deps
  const find = (id: string | null) => { for (const g of groups) { const s = g.steps.find(x => x.id === id); if (s) return { s, g }; } return null; };
  const cur = find(pv);
  const [at, setAt] = useState<{ left: number; top: number } | null>(null);
  const [jump, setJump] = useState(true);
  const place = () => {
    const r = root.current, p = panel.current, row = list.current?.querySelector<HTMLElement>(`[data-k="s:${pv}"]`), card = pvEl.current;
    if (!r || !p || !row || !card || narrow) return;
    const rr = r.getBoundingClientRect(), br = row.getBoundingClientRect(), pr = p.getBoundingClientRect();
    setAt({ left: Math.round(pr.right - rr.left + 8), top: Math.round(Math.max(0, Math.min(r.clientHeight - card.offsetHeight, br.top - rr.top - 8))) });
  };
  useIsoLayoutEffect(() => { if (!pv) { setAt(null); setJump(true); return; } place(); }, [pv, narrow, q]);
  useEffect(() => { if (at) { const t = setTimeout(() => setJump(false), 0); return () => clearTimeout(t); } }, [at]);

  /* ---------- adding ---------- */
  const [added, setAdded] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const addedT = useRef<ReturnType<typeof setTimeout>>(undefined), noteT = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => { clearTimeout(addedT.current); clearTimeout(noteT.current); }, []);
  const count = (workflow?.steps.length ?? 0) + 1;
  const add = (id: string, via: StepLibraryAddVia) => {
    const hit = find(id); if (!hit) return;
    onAdd?.(hit.s, hit.g, via);
    setAdded(id); clearTimeout(addedT.current); addedT.current = setTimeout(() => setAdded(null), 1400);
    setHov(null);
    const line = workflow ? `${count} steps in ${workflow.title}` : 'Added';
    setSay(`Added ${hit.s.name}. ${workflow ? line : ''}`.trim());
    if (narrow) { setNote(hit.s.name); clearTimeout(noteT.current); noteT.current = setTimeout(() => setNote(null), 2400); }
  };
  // the workflow scrolls to its newest step
  // (the steps it starts with are already there; the ones added after come in)
  const flowLen = workflow?.steps.length ?? 0, lastLen = useRef(flowLen), mountLen = useRef(flowLen);
  useEffect(() => { if (flowLen > lastLen.current) fl.current?.scrollTo({ top: fl.current.scrollHeight, behavior: reduce ? 'auto' : 'smooth' }); lastLen.current = flowLen; }, [flowLen, reduce]);
  const [over, setOver] = useState(false);
  const dragOver = (e: DragEvent) => { if (!e.dataTransfer.types.includes(MIME)) return; e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; setOver(true); };
  const drop = (e: DragEvent) => { setOver(false); const id = e.dataTransfer.getData(MIME); if (!id) return; e.preventDefault(); add(id, 'drop'); };

  /* ---------- keys ---------- */
  const fieldKeys = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { const f = items().find(b => b.matches('.dm-slb-s')) ?? items()[0]; if (f) { e.preventDefault(); goTo(f); } }
    else if (e.key === 'Enter' && v && shown.length) { e.preventDefault(); add(shown[0].steps[0].id, 'keyboard'); }
    else if (e.key === 'Escape' && q) { e.preventDefault(); e.stopPropagation(); clear(); }
  };
  const listKeys = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const all = items(), i = all.indexOf(document.activeElement as HTMLButtonElement); if (i < 0) return;
    const k = e.key, b = all[i];
    if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); const j = i + (k === 'ArrowDown' ? 1 : -1); if (j < 0) field.current?.focus({ preventScroll: true }); else if (j < all.length) goTo(all[j]); }
    else if (k === 'Home' || k === 'End') { e.preventDefault(); goTo(all[k === 'Home' ? 0 : all.length - 1]); }
    else if (b.matches('.dm-slb-gb') && (k === 'ArrowLeft' || k === 'ArrowRight')) { e.preventDefault(); const id = keyOf(b).slice(2); if ((k === 'ArrowRight') === shut.includes(id)) toggle(id); }
    else if (b.matches('.dm-slb-s') && k === 'ArrowLeft') { e.preventDefault(); const h = b.closest('.dm-slb-g')?.querySelector<HTMLElement>('.dm-slb-gb'); if (h) goTo(h); }
    else if (k === 'Escape' && q) { e.preventDefault(); clear(); }
    // typing anywhere in the list goes on into the search
    else if (k === 'Backspace' && q) { e.preventDefault(); setQ(q.slice(0, -1)); field.current?.focus({ preventScroll: true }); }
    else if (k.length === 1 && k !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); setQ(q + k); field.current?.focus({ preventScroll: true }); }
  };

  const hintText = typeof matchMedia === 'function' && !matchMedia('(hover:hover)').matches ? 'Tap a step to add it to the workflow' : 'Hover or focus a step to see what it does';
  return (
    <div ref={root} data-dm="" className={cx('dm-slb', className)}>
      <div ref={panel} className="dm-slb-p">
        <div className="dm-slb-h"><b>{title}</b><span className="dm-num dm-slb-ct">{v ? `${found} of ${total}` : `${total} steps`}</span></div>
        <div className="dm-slb-q">
          <Icon name="search" />
          <input ref={field} className="dm-slb-in" type="text" placeholder={placeholder} aria-label={placeholder} autoComplete="off" spellCheck={false}
            value={q} onChange={e => setQ(e.target.value)} onKeyDown={fieldKeys} />
          {q && <Tip label="Clear search" kbd="Esc"><button type="button" className="dm-ib dm-slb-x" aria-label="Clear search" onClick={clear}><Icon name="x" /></button></Tip>}
        </div>
        <div ref={list} className="dm-slb-list" role="group" aria-label="Steps" onKeyDown={listKeys} onScroll={() => { if (pv) place(); }}
          onPointerLeave={() => setHov(null)}
          onFocus={e => { const id = (e.target as HTMLElement).dataset.k; setFoc(id?.startsWith('s:') ? id.slice(2) : null); }}
          onBlur={e => { if (!list.current?.contains(e.relatedTarget as Node)) setFoc(null); }}>
          {shown.length ? shown.map(({ g, steps }) => {
            const open = !shut.includes(g.id), fid = `${uid}-g-${g.id}`;
            return (
              <div key={g.id} className="dm-slb-g">
                <button type="button" className="dm-slb-gb" data-k={'g:' + g.id} tabIndex={tab === 'g:' + g.id ? 0 : -1} aria-expanded={open} aria-controls={fid}
                  onClick={() => toggle(g.id)} onPointerOver={e => { if (e.pointerType === 'mouse') setHov(null); }}>
                  <Icon name="chev-d" size="xs" /><span>{g.label}</span><span className="dm-n dm-num">{steps.length}</span>
                </button>
                <div className={cx('dm-fold', !open && 'dm-shut')} id={fid} inert={!open}>
                  <div><ul className="dm-slb-ul">
                    {steps.map(s => (
                      <li key={s.id}>
                        <button type="button" className={cx('dm-slb-s', pv === s.id && 'dm-on', added === s.id && 'dm-added')} data-k={'s:' + s.id} tabIndex={tab === 's:' + s.id ? 0 : -1}
                          aria-describedby={`${uid}-d-${s.id}`} draggable={canDrag}
                          onClick={e => add(s.id, e.detail ? 'click' : 'keyboard')}
                          onPointerOver={e => { if (e.pointerType === 'mouse') setHov(s.id); }}
                          onDragStart={e => { e.dataTransfer.setData(MIME, s.id); e.dataTransfer.setData('text/plain', s.name); e.dataTransfer.effectAllowed = 'copy'; setHov(null); setPv(null); }}
                          onDragEnd={() => setOver(false)}>
                          {tile(s.icon, g.color, g.iconColor)}<span className="dm-t">{marked(s.name, v)}</span>
                          <span className="dm-ad" aria-hidden="true"><Icon name={added === s.id ? 'check' : 'plus'} size="xs" /></span>
                        </button>
                      </li>
                    ))}
                  </ul></div>
                </div>
              </div>
            );
          }) : (
            <div className="dm-slb-e"><b>No steps match “{q.trim()}”</b><span>Try another word, or clear the search.</span>
              <button type="button" className="dm-pill dm-ghost dm-sm dm-slb-ec" data-k="e" tabIndex={tab === 'e' ? 0 : -1} onClick={clear}>Clear search</button></div>
          )}
        </div>
        <div className="dm-slb-dock" aria-hidden="true">
          {note ? <div className="dm-slb-ph">{tile('check', 'var(--dm-ok)')}<div><b>Added {note}</b><span>{workflow ? `${count - 1} steps in ${workflow.title}` : 'To the workflow'}</span></div></div>
            : cur ? <><div className="dm-slb-ph">{tile(cur.s.icon, cur.g.color, cur.g.iconColor)}<div><b>{cur.s.name}</b><span>{cur.g.label}</span></div></div><p className="dm-slb-pd">{cur.s.description}</p></>
            : <span className="dm-hint">{hintText}</span>}
        </div>
      </div>
      {workflow && (
        <div className={cx('dm-slb-flow', over && 'dm-over')} role="region" aria-label="Workflow" onDragOver={dragOver} onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false); }} onDrop={drop}>
          <div className="dm-slb-fh"><b>{workflow.title}</b><span className="dm-num dm-slb-fn">{workflow.steps.length} steps</span></div>
          <ol ref={fl} className="dm-slb-fl">
            {workflow.steps.map((s, i) => (
              <li key={s.key} className={cx('dm-slb-fs', i >= mountLen.current && 'dm-in')}>
                <span className="dm-slb-cn" aria-hidden="true" />
                <span className="dm-ic" style={{ color: s.color }}><Icon name={s.icon} size="xs" /></span>
                <span className="dm-t"><b>{s.name}</b>{s.detail && <span>{s.detail}</span>}</span>
              </li>
            ))}
          </ol>
          <div className="dm-slb-drop"><Icon name="plus" /><span>{dropLabel}</span></div>
        </div>
      )}
      <div ref={pvEl} className={cx('dm-slb-pv', !!cur && !!at && 'dm-show', jump && 'dm-jump')} aria-hidden="true" style={at ?? undefined}>
        {cur && <>
          <div className="dm-slb-ph">{tile(cur.s.icon, cur.g.color, cur.g.iconColor)}<div><b>{cur.s.name}</b><span>{cur.g.label}</span></div></div>
          <p className="dm-slb-pd">{cur.s.description}</p>
          {(cur.s.takes || cur.s.gives) && <dl className="dm-slb-io">{cur.s.takes && <><dt>Takes</dt><dd>{cur.s.takes}</dd></>}{cur.s.gives && <><dt>Gives</dt><dd>{cur.s.gives}</dd></>}</dl>}
          <p className="dm-slb-pf">{previewHint}</p>
        </>}
      </div>
      <div className="dm-slb-d" hidden>{groups.flatMap(g => g.steps).map(s => <span key={s.id} id={`${uid}-d-${s.id}`}>{s.description}</span>)}</div>
      <p className="dm-slb-live" aria-live="polite">{say}</p>
    </div>
  );
}
```

## More in Workspace

- [Automation canvas](https://designme.dev/components/automation-canvas.md): A trigger, a few agent steps, and a run you can watch flow through.
- [Canvas toolbar](https://designme.dev/components/canvas-toolbar.md): A floating toolbar for a workflow canvas: run, pick a tool, comment, fit and zoom.
- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
- [Memory panel](https://designme.dev/components/memory-panel.md): What the agent remembers about your team, editable and removable.
- [Model compare](https://designme.dev/components/model-compare.md): Run one prompt on three models side by side and keep the best.
- [Agent settings](https://designme.dev/components/agent-settings.md): How much the agent may do alone, with a save bar for changes.
- [Tools and connections](https://designme.dev/components/tool-connections.md): The tools the agent can reach, and how much it may do with each.
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md): The files, sites and folders the agent knows, and how far each is indexed.
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md): Tasks the agent runs on a schedule, with their last result and a switch.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.
- [Workspace rail](https://designme.dev/components/workspace-rail.md): A slim app rail that opens into a labelled sidebar.

All components: https://designme.dev/llms.txt
