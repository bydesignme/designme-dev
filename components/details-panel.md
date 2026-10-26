# Details panel

> Properties of a run you can change in place.

Agent components / Sources and output. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/details-panel

## Install

```sh
npx designme add details-panel          # HTML, CSS and JS, with the shared core
npx designme add details-panel --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Details panel lists the properties of an agent run, like its status, owner, model, labels, tokens and cost, in sections that fold open and closed. People change values in place from small menus, and numbers such as cost roll to their new value when they update.

### When to use it

- When a run, task or document needs a sidebar of properties next to the main view.
- When people should be able to reassign an owner, change the status or switch the model without leaving the page.
- When usage figures like tokens and cost update while the agent works.
- When someone needs to copy an ID, like a run ID, to share or look up.

### What it does

- Four row types: `text` for plain values, `select` for a menu, `number` for values that roll, and `tags` for labels.
- Select options can show a coloured dot, an avatar with initials, or a quieter `detail` line in the menu. The value flashes briefly when it changes.
- Number rows roll to each new value and use `format` to turn it into text, for example a dollar amount.
- Tag rows show coloured labels and an optional add button that calls `onAdd`. New tags come in with a short entrance.
- Sections fold open and closed from their headers. All start open unless you set `defaultOpen` or control `open`.
- `copyValue` adds a copy button by the title that shows "Copied to clipboard" after a click.

### Accessibility

- Each section header is a button with `aria-expanded`, and closed sections are `inert` and `aria-hidden`.
- Select values are buttons with `aria-haspopup="menu"` and `aria-expanded`. The menu has `role="menu"` and its options are `menuitem`s.
- Escape closes an open menu and returns focus to its button.
- From the keyboard, Enter, Space or the down arrow opens a menu with the focus on its picked item, or its first (the up arrow, on its last); the arrow keys move through it and wrap, Home and End jump to the ends, Tab closes it and moves on, and closing it gives the focus back to its button.
- The copy and add buttons have `aria-label`s taken from `copyLabel` and `addLabel`.

## Usage in React

```tsx
import { DetailsPanel } from '@/components/designme/details-panel/DetailsPanel';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { DetailsPanel, type DetailsPanelTag } from './DetailsPanel';
import { useScript } from '../lib/useScript';

/* ---------- Details panel: menus change the run in place, the model sets tokens and cost, + adds labels ---------- */
const COST: Record<string, [number, number]> = { Opus: [184200, 2.76], Sonnet: [184200, .55], Haiku: [184200, .15] };
const MORE: DetailsPanelTag[] = [{ label: 'Q4', tone: 'yellow' }, { label: 'A/B test', tone: 'teal' }, { label: 'Urgent', tone: 'red' }];

export default function DetailsPanelDemo() {
  const [model, setModel] = useState('Opus');
  const [usage, setUsage] = useState<[number, number]>([0, 0]);
  const [tags, setTags] = useState<DetailsPanelTag[]>([{ label: 'Pricing', tone: 'blue' }, { label: 'Web', tone: 'orange' }]);
  // the usage counts up a moment after the panel appears, unless a model you picked is counting already
  useScript(async ({ wait }) => { await wait(700); setUsage(u => (u[0] ? u : COST.Opus)); });
  const pickModel = (m: string) => { setModel(m); setUsage(COST[m]); };
  const added = tags.length - 2;

  return (
    <div style={{ width: '100%' }}>
      <DetailsPanel kind="RUN" title="Pricing page redesign" copyValue="run_8f2a" copyLabel="Copy run ID"
        sections={[
          { key: 'props', title: 'Properties', rows: [
            { key: 'status', label: 'Status', type: 'select', defaultValue: 'In review', options: [
              { value: 'In progress', label: 'In progress', color: 'var(--dm-py)' },
              { value: 'In review', label: 'In review', color: 'var(--dm-accent)' },
              { value: 'Shipped', label: 'Shipped', color: 'var(--dm-ok)' }] },
            { key: 'owner', label: 'Owner', type: 'select', defaultValue: 'Maya Kim', options: [
              { value: 'Maya Kim', label: 'Maya Kim', avatar: { initials: 'MK', color: 'var(--dm-pl)' } },
              { value: 'Jon Ortiz', label: 'Jon Ortiz', avatar: { initials: 'JO', color: 'var(--dm-pm)' } },
              { value: 'Design agent', label: 'Design agent', avatar: { initials: 'DA', color: 'var(--dm-pb)' } }] },
            { key: 'model', label: 'Model', type: 'select', value: model, onValueChange: pickModel, options: [
              { value: 'Opus', label: 'Opus', detail: 'Best for design' },
              { value: 'Sonnet', label: 'Sonnet', detail: 'Faster, cheaper' },
              { value: 'Haiku', label: 'Haiku', detail: 'Quick edits' }] },
            { key: 'due', label: 'Due', value: 'Oct 24' },
            { key: 'labels', label: 'Labels', type: 'tags', tags, onAdd: () => { if (added < MORE.length) setTags(t => [...t, MORE[added]]); } }
          ] },
          { key: 'usage', title: 'Usage', rows: [
            { key: 'tokens', label: 'Tokens', type: 'number', value: usage[0] },
            { key: 'cost', label: 'Cost', type: 'number', value: usage[1], format: n => '$' + n.toFixed(2) },
            { key: 'time', label: 'Run time', value: '4m 12s' }
          ] }
        ]} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | The title at the top, like "Pricing page redesign" |
| `kind` (optional) | `string` | A short type tag before the title, like "RUN" |
| `copyValue` (optional) | `string` | Adds a copy button that copies this, like a run ID |
| `copyLabel` (optional) | `string` | The copy button's tooltip |
| `sections` | `DetailsPanelSection[]` |  |
| `open` (optional) | `string[]` | Keys of the open sections. Leave it out to let the headers toggle them; every section starts open |
| `defaultOpen` (optional) | `string[]` |  |
| `onOpenChange` (optional) | `(open: string[]) => void` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I react when someone picks a new model?**

Give the select row `value` and `onValueChange`. In the demo, changing the model also updates the tokens and cost rows, which roll to the new numbers.

**Why don't select menus get cut off by the folding sections?**

The menus are rendered into the panel itself through a portal, so a section's fold can't clip them.

**Can a select show people instead of coloured dots?**

Yes. Give each option an `avatar` with `initials` and a `color`. The chevron is hidden by default when options have dots or avatars, and `chevron` lets you force it.

## Source

`DetailsPanel.tsx`, as `npx designme add details-panel --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type AnimationEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../lib/cx';
import { useControllable, useCopied, useTween } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Avatar, Fold, Swap, Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './details-panel.css';

export interface DetailsPanelOption {
  value: string;
  label: string;
  /** A quieter line under the label in the menu, like "Best for design" */
  detail?: string;
  /** A coloured dot before the label, like 'var(--dm-ok)' */
  color?: string;
  /** An avatar before the label instead of a dot */
  avatar?: { initials: string; color: string };
}

export type DetailsPanelTone = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';
export interface DetailsPanelTag { label: string; tone?: DetailsPanelTone }

export type DetailsPanelRow =
  /** A plain value, like a date or a duration */
  | { key: string; label: string; type?: 'text'; value: ReactNode }
  /** A value picked from a menu */
  | { key: string; label: string; type: 'select'; options: DetailsPanelOption[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void;
      /** Shows a chevron after the value. Defaults to true when the options have no dots or avatars */
      chevron?: boolean }
  /** A number that rolls to its new value, like tokens or cost */
  | { key: string; label: string; type: 'number'; value: number;
      /** Turns the number into text. Defaults to a rounded number with thousands separators */
      format?: (n: number) => string }
  /** Labels, with an optional button to add one */
  | { key: string; label: string; type: 'tags'; tags: DetailsPanelTag[]; onAdd?: () => void; addLabel?: string };

export interface DetailsPanelSection {
  key: string;
  title: string;
  rows: DetailsPanelRow[];
}

export interface DetailsPanelProps {
  /** The title at the top, like "Pricing page redesign" */
  title: string;
  /** A short type tag before the title, like "RUN" */
  kind?: string;
  /** Adds a copy button that copies this, like a run ID */
  copyValue?: string;
  /** The copy button's tooltip */
  copyLabel?: string;
  sections: DetailsPanelSection[];
  /** Keys of the open sections. Leave it out to let the headers toggle them; every section starts open */
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (open: string[]) => void;
  className?: string;
}

const TONE: Record<DetailsPanelTone, string> = { blue: 'dm-b', purple: 'dm-l', green: 'dm-m', orange: 'dm-p', red: 'dm-r', yellow: 'dm-y', pink: 'dm-k', teal: 'dm-t' };
const count = (n: number) => Math.round(n).toLocaleString('en-US');

/** Flashes the accent behind a value when it changes, but not when it first shows */
function useFlash(value: unknown) {
  const [flash, setFlash] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setFlash(false);
    const f = requestAnimationFrame(() => setFlash(true));
    return () => cancelAnimationFrame(f);
  }, [value]);
  // only its own flash: the avatar's entrance bubbles up here too
  return { flash, onAnimationEnd: (e: AnimationEvent) => { if (e.target === e.currentTarget) setFlash(false); } };
}

function Mark({ option, entering }: { option: DetailsPanelOption; entering?: boolean }) {
  if (option.avatar) return <Avatar key={option.value} initials={option.avatar.initials} color={option.avatar.color} className={entering ? 'dm-enter' : undefined} />;
  if (option.color) return <span className="dm-dot" style={{ color: option.color }} />;
  return null;
}

function SelectRow({ row, host }: { row: Extract<DetailsPanelRow, { type: 'select' }>; host: HTMLElement | null }) {
  const [value, setValue] = useControllable(row.value, row.defaultValue ?? row.options[0]?.value ?? '', row.onValueChange);
  const menu = usePopover();
  const picked = row.options.find(o => o.value === value) ?? row.options[0];
  const { flash, onAnimationEnd } = useFlash(value);
  const [changed, setChanged] = useState(false);
  const chevron = row.chevron ?? !row.options.some(o => o.color || o.avatar);
  if (!picked) return null;
  return (
    <>
      <button type="button" {...menu.trigger} className={cx('dm-dtp-v', flash && 'dm-flash')} onAnimationEnd={onAnimationEnd}>
        <Mark option={picked} entering={changed} />
        <Swap>{picked.label}</Swap>
        {chevron && <Icon name="chev-d" size="xs" />}
      </button>
      {/* the menus sit on the panel itself, so the folding sections can't clip them */}
      {host && createPortal(
        <div {...menu.pop} className={menu.pop.className} role="menu" aria-label={row.label}>
          {row.options.map(o => (
            <button type="button" key={o.value} className="dm-mi" role="menuitem"
              onClick={() => { if (o.value !== value) { setChanged(true); setValue(o.value); } menu.closeSoon(); }}>
              <Mark option={o} />
              {o.detail ? <span>{o.label}<span className="dm-d">{o.detail}</span></span> : <span>{o.label}</span>}
            </button>
          ))}
        </div>, host)}
    </>
  );
}

function NumberRow({ row }: { row: Extract<DetailsPanelRow, { type: 'number' }> }) {
  const shown = useTween(row.value, 800);
  return <span className="dm-dtp-v dm-num">{(row.format ?? count)(shown)}</span>;
}

function TagsRow({ row }: { row: Extract<DetailsPanelRow, { type: 'tags' }> }) {
  // tags that arrive after the panel appears come in with the entrance
  const [initial] = useState(() => new Set(row.tags.map(t => t.label)));
  return (
    <span className="dm-dtp-tags">
      {row.tags.map(t => <span key={t.label} className={cx('dm-tag', t.tone && TONE[t.tone], !initial.has(t.label) && 'dm-enter')}>{t.label}</span>)}
      {row.onAdd && <Tip label={row.addLabel ?? 'Add label'}>
        <button type="button" className="dm-dtp-add" aria-label={row.addLabel ?? 'Add label'} onClick={row.onAdd}><Icon name="plus" size="xs" /></button>
      </Tip>}
    </span>
  );
}

function Row({ row, host }: { row: DetailsPanelRow; host: HTMLElement | null }) {
  return (
    <div className="dm-dtp-r">
      <span className="dm-k">{row.label}</span>
      {row.type === 'select' ? <SelectRow row={row} host={host} />
        : row.type === 'number' ? <NumberRow row={row} />
        : row.type === 'tags' ? <TagsRow row={row} />
        : <span className="dm-dtp-v dm-num">{row.value}</span>}
    </div>
  );
}

/** A record's properties in folding sections, edited in place from small menus. */
export function DetailsPanel({ title, kind, copyValue, copyLabel = 'Copy run ID', sections, open, defaultOpen, onOpenChange, className }: DetailsPanelProps) {
  const [shown, setShown] = useControllable(open, defaultOpen ?? sections.map(s => s.key), onOpenChange);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [copied, copy] = useCopied();
  const toggle = (key: string) => setShown(shown.includes(key) ? shown.filter(k => k !== key) : [...shown, key]);

  return (
    <div data-dm="" ref={setHost} className={cx('dm-dtp dm-panel', className)}>
      <div className="dm-dtp-h">
        {kind && <span className="dm-ft">{kind}</span>}
        <b>{title}</b>
        {copyValue !== undefined && (
          <Tip label={copied ? 'Copied to clipboard' : copyLabel} open={copied || undefined}>
            <button type="button" className={cx('dm-ib dm-dtp-cp', copied && 'dm-copied')} aria-label={copyLabel} onClick={() => copy(copyValue)}>
              <Icon name={copied ? 'check' : 'link'} size="xs" />
            </button>
          </Tip>
        )}
      </div>
      {sections.map(s => {
        const isOpen = shown.includes(s.key);
        return (
          <div key={s.key} className="dm-dtp-sec">
            <button type="button" className="dm-dtp-sh" aria-expanded={isOpen} onClick={() => toggle(s.key)}>
              <Icon name="chev-r" size="xs" /><span>{s.title}</span>
            </button>
            <Fold open={isOpen}>
              <div className="dm-dtp-rows">{s.rows.map(r => <Row key={r.key} row={r} host={host} />)}</div>
            </Fold>
          </div>
        );
      })}
    </div>
  );
}
```

## More in Sources and output

- [Code viewer](https://designme.dev/components/code-viewer.md): Code the agent wrote, with line notes you can ask about.
- [Terminal stream](https://designme.dev/components/terminal-stream.md): Shell commands the agent runs, with their output as it streams in.
- [Citation hover card](https://designme.dev/components/citation-hover-card.md): Hover a citation to see the exact passage it came from.
- [Source stack](https://designme.dev/components/source-stack.md): Everything the agent read, folded into one quiet pill.
- [Field extraction](https://designme.dev/components/field-extraction.md): The agent pulls fields out of a document and shows where each came from.
- [Metric insight](https://designme.dev/components/metric-insight.md): A number, its trend, and the agent's read on why it moved.
- [Task table](https://designme.dev/components/task-table.md): Agent tasks in a sortable table with bulk actions.

All components: https://designme.dev/llms.txt
