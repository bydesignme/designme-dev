# Source stack

> Everything the agent read, folded into one quiet pill.

Agent components / Sources and output. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/source-stack

## Install

```sh
npx designme add source-stack          # HTML, CSS and JS, with the shared core
npx designme add source-stack --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Source stack sits under an agent's answer and folds every source it read into one small pill with a few favicons and a count. Open the pill to see the full list, filter it by kind, and see how much each source counted toward the answer.

### When to use it

- When an agent reads many sources and listing them all would push the answer out of view.
- When sources come from different places, like the web, files and Figma, and people want to narrow them down.
- When you want to show how relevant each source was without a long explanation.
- When people should be able to jump to any source from the list.

### What it does

- The pill shows the marks of the first four sources and a count like "8 sources". Clicking it opens and closes the list.
- Filter chips pick sources by `kind`. The defaults are All, Web, Files and Figma, and `filters` replaces them.
- Each row shows a coloured favicon `mark`, the `title`, the `host` and a small bar for `relevance` from 0 to 1, with the percentage in a tooltip.
- Sources with `onOpen` get an open button on their row.
- The answer itself can go in `children`, shown above the pill.
- Both the open state and the filter can be controlled with `open`, `filter` and their change handlers.

### Accessibility

- The pill is a button with `aria-expanded`.
- Filter chips are buttons with `aria-pressed` showing which one is active.
- Each relevance bar has `role="meter"` with `aria-label="Relevance"` and its value from 0 to 100.
- The open button has `aria-label="Open source"`, and the closed list is `inert` and `aria-hidden`.

## Usage in React

```tsx
import { SourceStack } from '@/components/designme/source-stack/SourceStack';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: the sources open a moment after the answer appears.
import { useState } from 'react';
import { SourceStack, type StackSource } from './SourceStack';
import { useScript } from '../lib/useScript';

const open = () => {};
const SOURCES: StackSource[] = [
  { kind: 'web', title: 'Baymard: pricing page UX', host: 'baymard.com', relevance: .92, mark: 'B', color: 'var(--dm-pb)', onOpen: open },
  { kind: 'web', title: 'Annual vs monthly anchoring study', host: 'cxl.com', relevance: .88, mark: 'C', color: '#d9480f', onOpen: open },
  { kind: 'file', title: 'Q3 conversion export.csv', host: 'Drive', relevance: .84, mark: 'CSV', color: 'var(--dm-pm)', onOpen: open },
  { kind: 'figma', title: 'Pricing v4, frame 2', host: 'Figma', relevance: .8, mark: 'F', color: 'var(--dm-pl)', onOpen: open },
  { kind: 'web', title: 'Stripe billing docs', host: 'stripe.com', relevance: .66, mark: 'S', color: '#635bff', onOpen: open },
  { kind: 'file', title: 'Pricing research notes', host: 'Notion', relevance: .61, mark: 'N', color: 'var(--dm-fg2)', onOpen: open },
  { kind: 'figma', title: 'Checkout flow', host: 'Figma', relevance: .52, mark: 'F', color: 'var(--dm-pl)', onOpen: open },
  { kind: 'web', title: 'NN/g on price framing', host: 'nngroup.com', relevance: .48, mark: 'N', color: 'var(--dm-fg2)', onOpen: open }
];

export default function SourceStackDemo() {
  const [isOpen, setOpen] = useState(false);
  useScript(async ({ wait }) => { await wait(1100); setOpen(true); });
  return (
    <div style={{ width: '100%' }}>
      <SourceStack sources={SOURCES} open={isOpen} onOpenChange={setOpen}>
        Annual plans convert about 18% better when the monthly price is shown crossed out next to them.
      </SourceStack>
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `children` (optional) | `ReactNode` | The answer the sources back up, shown above the pill |
| `sources` | `StackSource[]` |  |
| `filters` (optional) | `SourceFilter[]` | The chips above the list. Defaults to All, Web, Files and Figma |
| `filter` (optional) | `string` | The chosen filter. Leave it out to let the chips switch it |
| `defaultFilter` (optional) | `string` |  |
| `onFilterChange` (optional) | `(filter: string) => void` |  |
| `open` (optional) | `boolean` | Whether the list is open. Leave it out to let the pill toggle it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I add my own source kinds?**

Set `kind` on each source to any string and pass matching `filters`, like `{ value: 'slack', label: 'Slack' }`. Keep a filter with value `all` if you want a show-everything chip.

**Can I open the list as soon as the answer arrives?**

Yes. Pass `defaultOpen`, or control it with `open` and `onOpenChange`. The demo opens it a moment after the answer appears.

**What scale does relevance use?**

A number from 0 to 1. It is clamped to that range and shown as a bar and a percentage.

## Source

`SourceStack.tsx`, as `npx designme add source-stack --react` installs it:

```tsx
'use client';
import { useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Fold, Tip } from '../lib/motion';
import '../designme.css';
import './source-stack.css';

export interface StackSource {
  /** What kind of source it is. The filter chips pick by this, like 'web', 'file' or 'figma' */
  kind: string;
  title: string;
  /** Where it came from, like "baymard.com" or "Drive" */
  host: string;
  /** 0 to 1, drawn as a small bar */
  relevance: number;
  /** One to three letters in the favicon square, like "B" or "CSV" */
  mark: string;
  /** The favicon colour, any CSS colour, like '#635bff' or 'var(--dm-pl)' */
  color: string;
  /** Adds an open button that shows on hover */
  onOpen?: () => void;
}

export interface SourceFilter {
  /** 'all', or a source kind */
  value: string;
  label: string;
}

export interface SourceStackProps {
  /** The answer the sources back up, shown above the pill */
  children?: ReactNode;
  sources: StackSource[];
  /** The chips above the list. Defaults to All, Web, Files and Figma */
  filters?: SourceFilter[];
  /** The chosen filter. Leave it out to let the chips switch it */
  filter?: string;
  defaultFilter?: string;
  onFilterChange?: (filter: string) => void;
  /** Whether the list is open. Leave it out to let the pill toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const FILTERS: SourceFilter[] = [{ value: 'all', label: 'All' }, { value: 'web', label: 'Web' }, { value: 'file', label: 'Files' }, { value: 'figma', label: 'Figma' }];

/** An answer with its sources stacked in a pill. Open it to see each source, filter them, and how much each one counted. */
export function SourceStack({ children, sources, filters = FILTERS, filter, defaultFilter = 'all', onFilterChange, open, defaultOpen = false, onOpenChange, className }: SourceStackProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [f, setF] = useControllable(filter, defaultFilter, onFilterChange);
  // the list staggers in again each time it opens
  const [opened, setOpened] = useState(0);
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) { setWasOpen(isOpen); if (isOpen) setOpened(n => n + 1); }
  const items = sources.filter(s => f === 'all' || s.kind === f);

  return (
    <div data-dm="" className={cx('dm-ssx', className)}>
      {children !== undefined && <p className="dm-msg">{children}</p>}
      <button type="button" className="dm-ssx-pill" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
        <span className="dm-ssx-ics">{sources.slice(0, 4).map((s, i) => <span key={i} style={{ background: s.color }}>{s.mark[0]}</span>)}</span>
        <span className="dm-ssx-l">{sources.length} {sources.length === 1 ? 'source' : 'sources'}</span>
        <Icon name="chev-d" size="xs" />
      </button>
      <Fold open={isOpen} className="dm-ssx-box">
        <div className="dm-ssx-in">
          <div className="dm-ssx-fl">
            {filters.map(x => <button key={x.value} type="button" className={cx('dm-chip dm-sm', x.value === f && 'dm-on')} aria-pressed={x.value === f} onClick={() => setF(x.value)}>{x.label}</button>)}
          </div>
          <div className="dm-ssx-list" key={f + ':' + opened}>
            {items.map((s, i) => {
              const e = enter(i * 40), pct = Math.round(Math.max(0, Math.min(1, s.relevance)) * 100);
              return (
                <div key={s.title + i} className={cx('dm-ssx-s', e.className)} style={e.style}>
                  <span className="dm-fv" style={{ background: `color-mix(in srgb,${s.color} 14%,transparent)`, color: s.color }}>{s.mark}</span>
                  <span className="dm-t">{s.title}<span className="dm-h"> · {s.host}</span></span>
                  <Tip label={`Relevance ${pct}%`}><span className="dm-rel" role="meter" aria-label="Relevance" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><i style={{ width: pct + '%' }} /></span></Tip>
                  {s.onOpen && <Tip label="Open"><button type="button" className="dm-ib" aria-label="Open source" onClick={s.onOpen}><Icon name="ext" size="xs" /></button></Tip>}
                </div>
              );
            })}
          </div>
        </div>
      </Fold>
    </div>
  );
}
```

## More in Sources and output

- [Code viewer](https://designme.dev/components/code-viewer.md): Code the agent wrote, with line notes you can ask about.
- [Terminal stream](https://designme.dev/components/terminal-stream.md): Shell commands the agent runs, with their output as it streams in.
- [Citation hover card](https://designme.dev/components/citation-hover-card.md): Hover a citation to see the exact passage it came from.
- [Field extraction](https://designme.dev/components/field-extraction.md): The agent pulls fields out of a document and shows where each came from.
- [Metric insight](https://designme.dev/components/metric-insight.md): A number, its trend, and the agent's read on why it moved.
- [Details panel](https://designme.dev/components/details-panel.md): Properties of a run you can change in place.
- [Task table](https://designme.dev/components/task-table.md): Agent tasks in a sortable table with bulk actions.

All components: https://designme.dev/llms.txt
