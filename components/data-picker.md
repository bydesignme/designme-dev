# Data picker

> Map a field from earlier steps into a step's input.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/data-picker

## Install

```sh
npx designme add data-picker          # HTML, CSS and JS, with the shared core
npx designme add data-picker --react  # React 19 component and its CSS
npx designme add data-picker --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/data-picker.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/data-picker.json  # Astro
```

## About

Data picker maps data from earlier steps of a workflow into a step's inputs. Each input holds tokens, the earlier step and then its field, with a button to remove each one, and a + that opens the picker: only the fields that earlier steps hand on, grouped by step under the step's coloured tile, each with its type as a coloured chip and a sample value. A search filters them, the arrow keys move through them and Enter puts the one picked in.

### When to use it

- In a workflow or automation builder, where a step's inputs (an email's To, Subject and Body) come from what earlier steps found.
- When people should only ever pick data that exists by the time the step runs.
- When fields need their type and a real sample to tell apart, like the company name from a form and the company record from a lookup.
- Beside a step inspector, for the inputs of the step that is picked.

### What it does

- The step being set up sits on top with its tile, its name and where it sits. Under it, each input has its label and a box of tokens.
- A token shows the earlier step's tile in its kind's colour, the step's name and the field. The step's name gives way first when there is no room, so the field stays whole. Each token has a remove button.
- The + at the end of an input opens the picker under it. On designme.dev the inputs glide up as it opens, so the inputs and the picker stay centred together.
- The picker lists only the fields of the earlier steps, grouped by step in their order, each group with the step's tile, its name and its place. Each field shows its type as a coloured chip, text blue, numbers green, lists orange, objects pink, yes or no yellow and dates teal, and a sample value.
- Search matches a field's name or its step's name, and underlines the part of a field's name that matched. The up and down arrows move through the fields and wrap, the pointer moves the highlight too, and Enter or a click puts the field in the input it was opened from.
- A field already in the input isn't added twice; the live region says so.
- A note under the list says where the fields come from, with the keys that work in it.
- In React, `fields` and `onFieldsChange` hold the inputs and what is mapped into each, `sources` is the earlier steps, and `open`, `query` and `active` can drive the picker from your own state.

### Accessibility

- Each input's box is a labelled group. Each + is labelled "Insert data into Body", with `aria-haspopup="dialog"` and `aria-expanded`, and each remove button "Remove email from Demo request form". Both show tooltips.
- The picker is a labelled dialog. Its search is a `combobox` that controls a `listbox` of options in labelled groups, and points at the highlighted field with `aria-activedescendant`. Each option is labelled with the field, its type and its step.
- A click on + puts the focus in the search. Escape closes the picker and gives the focus back to its +, and so does picking a field from the keyboard.
- Removing a token with the keyboard moves the focus to its input's +, so it never falls to the page.
- A polite live region says what was added or removed, like "Added reasons from Research and score to Body".
- With reduced motion new tokens appear and removed ones go without their animation.

## Usage in React

```tsx
import { DataPicker } from '@/components/designme/data-picker/DataPicker';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { DataPicker, type DataPickerField, type DataPickerSource } from './DataPicker';
import { useStory } from '../lib/useScript';

/* ---------- Data picker: a field comes out of the subject, then Body's picker searches "sc", moves down to the reasons
   and puts them in ---------- */
const SOURCES: DataPickerSource[] = [
  { id: 'form', title: 'Demo request form', kind: 'trigger', icon: 'file-text', fields: [{ name: 'name', type: 'text', sample: 'Priya Shah' }, { name: 'email', type: 'text', sample: 'priya@corvid.io' }, { name: 'company', type: 'text', sample: 'Corvid Analytics' }, { name: 'seats', type: 'number', sample: '240' }, { name: 'sent_at', type: 'date', sample: 'Nov 8, 10:41' }] },
  { id: 'lookup', title: 'Company lookup', kind: 'tool', icon: 'globe', fields: [{ name: 'employees', type: 'number', sample: '420' }, { name: 'industry', type: 'text', sample: 'Analytics software' }, { name: 'verified', type: 'bool', sample: 'true' }] },
  { id: 'research', title: 'Research and score', kind: 'ai', icon: 'spark', fields: [{ name: 'score', type: 'number', sample: '84' }, { name: 'tier', type: 'text', sample: 'Enterprise' }, { name: 'reasons', type: 'list', sample: '3 reasons' }, { name: 'company', type: 'object', sample: '{ 5 fields }' }] },
  { id: 'reply', title: 'Draft a reply', kind: 'ai', icon: 'edit', fields: [{ name: 'subject', type: 'text', sample: 'Your demo with Fernhill' }, { name: 'body', type: 'text', sample: 'Hi Priya, thanks for writing' }] }
];
const FIELDS: DataPickerField[] = [{ key: 'to', label: 'To', refs: ['form.email'] }, { key: 'subject', label: 'Subject', refs: ['reply.subject', 'form.company'] }, { key: 'body', label: 'Body', refs: ['reply.body'] }];

export default function DataPickerDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState(FIELDS);
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('[aria-label="Remove company from Demo request form"]');
    await wait(1000); press('[data-add="body"]');
    await wait(700); setQuery('s'); await wait(150); setQuery('sc');
    await wait(600); setActive(1); await wait(400); setActive(2);
    await wait(700); press('.dm-fpk-o.dm-on');
  });
  return (
    <div ref={ref} style={{ width: '100%', minHeight: 420 }}>
      <DataPicker sources={SOURCES} fields={fields} onFieldsChange={setFields} step={{ title: 'Send the reply', kind: 'app', icon: 'mail', position: 'Step 6 of 7' }}
        open={open} onOpenChange={setOpen} query={query} onQueryChange={setQuery} active={active} onActiveChange={setActive} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `sources` | `DataPickerSource[]` | The steps before this one, in order: the picker offers only their fields |
| `fields` (optional) | `DataPickerField[]` | The step's inputs and what is mapped into each |
| `defaultFields` (optional) | `DataPickerField[]` |  |
| `onFieldsChange` (optional) | `(fields: DataPickerField[]) => void` |  |
| `step` (optional) | `{ title: string; kind: DataPickerStepKind; icon?: IconName; position?: string }` | The step being set up, over its fields |
| `open` (optional) | `string \| null` | The key of the field whose picker is open, or null |
| `defaultOpen` (optional) | `string \| null` |  |
| `onOpenChange` (optional) | `(open: string \| null) => void` |  |
| `query` (optional) | `string` | What the search holds |
| `onQueryChange` (optional) | `(query: string) => void` |  |
| `active` (optional) | `number` | The option the arrows are on, counted through the filtered list |
| `onActiveChange` (optional) | `(active: number) => void` |  |
| `note` (optional) | `ReactNode` | Said under the list, like "From the 4 steps before Send the reply" |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import DataPicker from '../components/designme/data-picker/DataPicker.astro';
---
<DataPicker />
<DataPicker data-style="soft" class="my-class" />
```
It plays its demo; change `data-picker.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I show only the steps before this one?**

Pass them as `sources`, in order. The picker offers their fields and nothing else, so a step can never read data that doesn't exist yet.

**Can people type text around the tokens?**

Not in this component: each input holds tokens only. For text with fields inline, like instructions, use the instructions box in Step inspector.

**How are fields referred to?**

As `"<step id>.<field name>"`, like `research.score`. That is what `fields` holds for each input.

## Source

`DataPicker.tsx`, as `npx designme add data-picker --react` installs it:

```tsx
'use client';
import { useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Tip } from '../lib/motion';
import '../designme.css';
import './data-picker.css';

/** The kinds of step, each with its colour on its tile: the trigger orange, AI steps violet, tools teal, app steps and outputs
    blue, a branch yellow, a wait pink, an approval green */
export type DataPickerStepKind = 'trigger' | 'ai' | 'tool' | 'app' | 'output' | 'branch' | 'wait' | 'approval';
/** Each type has its colour: text blue, numbers green, lists orange, objects pink, yes or no yellow, dates teal */
export type DataPickerType = 'text' | 'number' | 'list' | 'object' | 'bool' | 'date';
/** An earlier step and what it hands on. A field is referred to as `"<step id>.<field name>"` */
export interface DataPickerSource {
  id: string;
  title: string;
  kind: DataPickerStepKind;
  icon?: IconName;
  fields: { name: string; type: DataPickerType; sample?: string }[];
}
/** One of the step's inputs and the fields mapped into it, in order */
export interface DataPickerField {
  key: string;
  label: string;
  refs: string[];
}

export interface DataPickerProps {
  /** The steps before this one, in order: the picker offers only their fields */
  sources: DataPickerSource[];
  /** The step's inputs and what is mapped into each */
  fields?: DataPickerField[];
  defaultFields?: DataPickerField[];
  onFieldsChange?: (fields: DataPickerField[]) => void;
  /** The step being set up, over its fields */
  step?: { title: string; kind: DataPickerStepKind; icon?: IconName; position?: string };
  /** The key of the field whose picker is open, or null */
  open?: string | null;
  defaultOpen?: string | null;
  onOpenChange?: (open: string | null) => void;
  /** What the search holds */
  query?: string;
  onQueryChange?: (query: string) => void;
  /** The option the arrows are on, counted through the filtered list */
  active?: number;
  onActiveChange?: (active: number) => void;
  /** Said under the list, like "From the 4 steps before Send the reply" */
  note?: ReactNode;
  className?: string;
}

const KIND_ICON: Record<DataPickerStepKind, IconName> = { trigger: 'bolt', ai: 'spark', tool: 'globe', app: 'send', output: 'hash', branch: 'branch', wait: 'clock', approval: 'user' };
const TONE: Record<DataPickerType, string> = { text: 'dm-b', number: 'dm-m', list: 'dm-p', object: 'dm-k', bool: 'dm-y', date: 'dm-t' };
const Tile = ({ kind, icon }: { kind: DataPickerStepKind; icon?: IconName }) => <span className="dm-fpk-ti" data-k={kind} aria-hidden="true"><Icon name={icon ?? KIND_ICON[kind]} size="xs" /></span>;
const mark = (t: string, v: string) => { const i = v ? t.toLowerCase().indexOf(v) : -1; return i < 0 ? t : <>{t.slice(0, i)}<mark>{t.slice(i, i + v.length)}</mark>{t.slice(i + v.length)}</>; };

/** Maps data from earlier steps into a step's inputs: each input holds tokens, the step and then its field, and a + opens a
    picker of what earlier steps hand on, grouped by step, with each field's type in colour and a sample, a search and the
    arrow keys. */
export function DataPicker({ sources, fields, defaultFields = [], onFieldsChange, step, open, defaultOpen = null, onOpenChange, query, onQueryChange, active, onActiveChange, note, className }: DataPickerProps) {
  const [list, setList] = useControllable(fields, defaultFields, onFieldsChange);
  const [openKey, setOpen] = useControllable<string | null>(open, defaultOpen, onOpenChange);
  const [q, setQ] = useControllable(query, '', onQueryChange);
  const [hi, setHi] = useControllable(active, 0, onActiveChange);
  const [said, setSaid] = useState('');
  // the fields mapped from the start show as they are; ones added later pop in
  const [first] = useState(() => new Set((fields ?? defaultFields).flatMap(f => f.refs.map(r => f.key + '|' + r))));
  const uid = useId().replace(/:/g, '');
  const root = useRef<HTMLDivElement>(null), pop = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null), lsRef = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<{ top: number; left: number } | null>(null);
  const of = (ref: string) => { const [s, f] = ref.split('.'); return { src: sources.find(x => x.id === s), f }; };

  const v = q.trim().toLowerCase();
  const groups = sources.map((src, si) => ({ src, si, fs: src.fields.filter(f => !v || f.name.toLowerCase().includes(v) || src.title.toLowerCase().includes(v)) })).filter(g => g.fs.length);
  const items = groups.flatMap(g => g.fs.map(f => g.src.id + '.' + f.name));
  const at = items.length ? ((hi % items.length) + items.length) % items.length : 0;
  const target = list.find(f => f.key === openKey);

  // the picker opens under the + of its field, inside the component
  useIsoLayoutEffect(() => {
    if (!openKey || !root.current || !pop.current) { setPlace(null); return; }
    const b = root.current.querySelector<HTMLElement>(`[data-add="${CSS.escape(openKey)}"]`); if (!b) return;
    const rr = root.current.getBoundingClientRect(), br = b.getBoundingClientRect();
    setPlace({ top: br.bottom - rr.top + 6, left: Math.max(-rr.left + 8, Math.min(br.right - rr.left - pop.current.offsetWidth, innerWidth - rr.left - pop.current.offsetWidth - 8)) });
  }, [openKey]);
  useIsoLayoutEffect(() => { lsRef.current?.querySelector('.dm-on')?.scrollIntoView({ block: 'nearest' }); }, [at, v]);
  // a click outside or Escape closes it, and the focus goes back to the + when it was inside
  useIsoLayoutEffect(() => {
    if (!openKey) return;
    const down = (e: PointerEvent) => { const t = e.target as Node; if (!pop.current?.contains(t) && !(t as Element).closest?.(`[data-add="${CSS.escape(openKey)}"]`)) setOpen(null); };
    document.addEventListener('pointerdown', down); return () => document.removeEventListener('pointerdown', down);
  }, [openKey]);
  const close = (focus: boolean) => { const k = openKey; setOpen(null); if (focus && k) root.current?.querySelector<HTMLElement>(`[data-add="${CSS.escape(k)}"]`)?.focus({ preventScroll: true }); };
  const openFor = (key: string, viaKeyboard: boolean) => { if (openKey === key) { close(false); return; } setQ(''); setHi(0); setOpen(key); setTimeout(() => input.current?.focus({ preventScroll: true }), viaKeyboard ? 0 : 30); };
  const pick = (ref: string | undefined) => {
    if (!ref || !target) return; const { src, f } = of(ref), inside = !!pop.current?.contains(document.activeElement);
    close(inside);
    if (target.refs.includes(ref)) { setSaid(`${target.label} already has ${f} from ${src?.title}`); return; }
    setList(list.map(x => x.key === target.key ? { ...x, refs: [...x.refs, ref] } : x)); setSaid(`Added ${f} from ${src?.title} to ${target.label}`);
  };
  const remove = (key: string, ref: string) => { const { src, f } = of(ref); setList(list.map(x => x.key === key ? { ...x, refs: x.refs.filter(r => r !== ref) } : x)); setSaid(`Removed ${f} from ${src?.title}`); };

  let n = 0;
  return (
    <div data-dm="" ref={root} className={cx('dm-fpk', className)}>
      {step && <div className="dm-fpk-hd"><Tile kind={step.kind} icon={step.icon} /><b>{step.title}</b>{step.position && <span className="dm-muted">{step.position}</span>}</div>}
      {list.map(fd => (
        <div className="dm-fpk-f" key={fd.key}>
          <span className="dm-fpk-l">{fd.label}</span>
          <div className="dm-fpk-box" role="group" aria-label={fd.label}>
            {fd.refs.length ? fd.refs.map(ref => { const { src, f } = of(ref); return (
              <span className={cx('dm-fpk-tok', !first.has(fd.key + '|' + ref) && 'dm-new')} key={ref}>
                {src && <Tile kind={src.kind} icon={src.icon} />}<span className="dm-s">{src?.title ?? ref.split('.')[0]}</span><span className="dm-sep" aria-hidden="true">›</span><span className="dm-f">{f}</span>
                <Tip label="Remove"><button type="button" className="dm-fpk-x" aria-label={`Remove ${f} from ${src?.title ?? ref.split('.')[0]}`} onClick={e => { remove(fd.key, ref); if (e.detail === 0) root.current?.querySelector<HTMLElement>(`[data-add="${CSS.escape(fd.key)}"]`)?.focus(); }}><Icon name="x" size="xs" /></button></Tip>
              </span>); }) : <span className="dm-fpk-ph">Pick data from an earlier step</span>}
            <Tip label="Insert data" off={openKey === fd.key}>
              <button type="button" className="dm-fpk-add" data-add={fd.key} aria-haspopup="dialog" aria-expanded={openKey === fd.key} aria-label={`Insert data into ${fd.label}`} onClick={e => openFor(fd.key, e.detail === 0)}><Icon name="plus" /></button>
            </Tip>
          </div>
        </div>
      ))}
      <div ref={pop} className={cx('dm-pop dm-fpk-pop', openKey && place && 'dm-open')} style={place ?? undefined} role="dialog" aria-label={target ? `Pick data for ${target.label}` : 'Pick data from an earlier step'} inert={!openKey}>
        <div className="dm-fpk-q">
          <Icon name="search" />
          <input ref={input} type="text" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls={`${uid}-ls`} aria-activedescendant={items.length ? `${uid}-o${at}` : undefined}
            placeholder="Find a field" aria-label="Find a field" autoComplete="off" spellCheck={false} value={q}
            onChange={e => { setQ(e.target.value); setHi(0); }}
            onKeyDown={e => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setHi(at + (e.key === 'ArrowDown' ? 1 : -1)); }
              else if (e.key === 'Enter') { e.preventDefault(); pick(items[at]); }
              else if (e.key === 'Escape') { e.preventDefault(); close(true); }
            }} />
        </div>
        <div className="dm-fpk-ls" id={`${uid}-ls`} role="listbox" aria-label="Fields from earlier steps" ref={lsRef}>
          {groups.length ? groups.map(({ src, si, fs }) => (
            <div role="group" aria-labelledby={`${uid}-g${si}`} key={src.id}>
              <div className="dm-fpk-g" id={`${uid}-g${si}`}><Tile kind={src.kind} icon={src.icon} /><b>{src.title}</b><span className="dm-n">Step {si + 1}</span></div>
              {fs.map(f => { const i = n++, ref = src.id + '.' + f.name; return (
                <div key={ref} className={cx('dm-fpk-o', i === at && 'dm-on')} role="option" id={`${uid}-o${i}`} aria-selected={i === at} aria-label={`${f.name}, ${f.type}, from ${src.title}`}
                  data-ref={ref} onPointerMove={() => { if (i !== at) setHi(i); }} onClick={() => pick(ref)}>
                  <span className="dm-k">{mark(f.name, v)}</span><span className={cx('dm-tag', TONE[f.type])}>{f.type}</span><span className="dm-ex">{f.sample}</span>
                </div>); })}
            </div>
          )) : <p className="dm-fpk-e">No field matches “{q.trim()}”</p>}
        </div>
        <p className="dm-fpk-ft"><span>{note ?? `From the ${sources.length} ${sources.length === 1 ? 'step' : 'steps'} before ${step?.title ?? 'this one'}`}</span><span className="dm-kh" aria-hidden="true"><span className="dm-kbd">↑</span> <span className="dm-kbd">↓</span> <span className="dm-kbd">↵</span></span></p>
      </div>
      <p className="dm-fpk-live" aria-live="polite">{said}</p>
    </div>
  );
}
```

## More in Workspace

- [Automation canvas](https://designme.dev/components/automation-canvas.md): A trigger, a few agent steps, and a run you can watch flow through.
- [Canvas toolbar](https://designme.dev/components/canvas-toolbar.md): A floating toolbar for a workflow canvas: run, pick a tool, comment, fit and zoom.
- [Step inspector](https://designme.dev/components/step-inspector.md): The settings of one step in an agent workflow, in sections that fold.
- [Run drawer](https://designme.dev/components/run-drawer.md): A workflow's run under its canvas: the steps, the log and the data.
- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
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
