# Context meter

> How full the context window is, with session and weekly limits, in one small popover.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/context-meter

## Install

```sh
npx designme add context-meter          # HTML, CSS and JS, with the shared core
npx designme add context-meter --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Context meter is a small ring next to the model name that shows how full the agent's context window is. Clicking it opens a usage popover with a bar for each limit, like the context window, the session limit and a weekly cap, each with a detail line and an optional action such as Compact.

### When to use it

- When long conversations can fill the model's context and people should see it coming before answers get worse.
- When your plan has session or weekly limits and people want to know how much is left and when it resets.
- When you offer a way to free up context, like compacting the thread, and want it next to the number it changes.

### What it does

- Each row in `rows` has a `label`, a `percent` from 0 to 100 and an optional `detail` line. The bar and its "N% used" count fill in a moment after the meter appears.
- From 90% a bar turns amber, and so does the ring when it is that full.
- A row's `tip` shows when you hover its bar, for example what is filling the context. A row's `action` adds a small button after its detail line, and its label crossfades when it changes.
- The ring follows the first row unless you pass `ring`. `model` and `effort` appear beside it.
- Clicking the ring opens and closes the popover. It starts open, and `open`, `defaultOpen` and `onOpenChange` let you control it.
- `onViewUsage` adds a button in the popover's corner that opens your usage page, and `title` replaces the "Usage" heading.

### Accessibility

- Each bar is a `role="meter"` with `aria-valuenow` from 0 to 100, labelled with its row label.
- The ring is a button with `aria-expanded` and a label like "Usage, 68% full".
- The popover is a `role="dialog"` named by its title, and it is `inert` while closed.

## Usage in React

```tsx
import { ContextMeter } from '@/components/designme/context-meter/ContextMeter';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { ContextMeter, type UsageRow } from './ContextMeter';

/* ---------- Context meter: a ring beside the model opens usage; compact frees the context ---------- */
export default function ContextMeterDemo() {
  const [phase, setPhase] = useState<'full' | 'busy' | 'compact'>('full');
  const compact = () => {
    if (phase === 'compact') { setPhase('full'); return; }
    if (phase === 'busy') return;
    setPhase('busy'); setTimeout(() => setPhase('compact'), 900);
  };
  const rows: UsageRow[] = [
    { key: 'ctx', label: 'Context window', percent: phase === 'compact' ? 38 : 68,
      detail: phase === 'busy' ? 'Summarising the thread' : phase === 'compact' ? '76k of 200k tokens, 9 decisions kept' : '136k of 200k tokens',
      tip: 'Files 56k · Conversation 60k · Tool results 20k',
      action: { label: phase === 'busy' ? 'Compacting' : phase === 'compact' ? 'Undo' : 'Compact', onClick: compact } },
    { key: 'session', label: 'Session limit', percent: 4, detail: 'Resets in 4 hr 39 min' },
    { key: 'week', label: 'Weekly', percent: 16, detail: 'Resets Sun 10:00 PM' }
  ];
  return (
    <div style={{ width: '100%', maxWidth: 330, marginInline: 'auto' }}>
      <ContextMeter rows={rows} model="Opus 5.5" effort="Extra" onViewUsage={() => {}} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `rows` | `UsageRow[]` |  |
| `ring` (optional) | `number` | How full the ring is, 0 to 100. Defaults to the first row |
| `title` (optional) | `string` |  |
| `model` (optional) | `string` | Shown beside the ring, like "Opus 5.5" |
| `effort` (optional) | `string` | Shown after the model, quieter, like "Extra" |
| `onViewUsage` (optional) | `() => void` | Adds a button in the corner that opens your usage page |
| `open` (optional) | `boolean` | Whether the popover is open. Leave it out to let the ring toggle it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I add a Compact button to the context row?**

Give that row an `action` with a `label` and an `onClick`. Change the label to something like "Compacting" while it runs, then update `percent` and `detail` when it is done.

**Can the ring show something other than the context window?**

Yes. By default it follows the first row, so either put the limit you care about first or pass `ring` with its own percentage.

**Does the popover close when I click outside it?**

No. Only the ring opens and closes it. Control `open` yourself if you want it to close on an outside click or on Escape.

## Source

`ContextMeter.tsx`, as `npx designme add context-meter --react` installs it:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useTween } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Swap, Tip } from '../lib/motion';
import '../designme.css';
import './context-meter.css';

export interface UsageRow {
  key: string;
  /** Like "Context window", "Session limit" or "Weekly" */
  label: string;
  /** 0 to 100. From 90 the bar turns amber */
  percent: number;
  /** The quiet line under the bar, like "136k of 200k tokens" or "Resets Sun 10:00 PM" */
  detail?: string;
  /** Shown when you hover the bar, like what is filling the context */
  tip?: string;
  /** A small button at the end of the detail line, like Compact */
  action?: { label: string; onClick: () => void };
}

export interface ContextMeterProps {
  rows: UsageRow[];
  /** How full the ring is, 0 to 100. Defaults to the first row */
  ring?: number;
  title?: string;
  /** Shown beside the ring, like "Opus 5.5" */
  model?: string;
  /** Shown after the model, quieter, like "Extra" */
  effort?: string;
  /** Adds a button in the corner that opens your usage page */
  onViewUsage?: () => void;
  /** Whether the popover is open. Leave it out to let the ring toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function Row({ row, ready }: { row: UsageRow; ready: boolean }) {
  const pct = Math.max(0, Math.min(100, row.percent)), shown = Math.round(useTween(ready ? pct : 0, 1000, 0));
  const bar = <span className="dm-ctm-tr" role="meter" aria-label={row.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><i style={{ width: (ready ? pct : 0) + '%' }} /></span>;
  return (
    <div className={cx('dm-ctm-r', pct >= 90 && 'dm-hot')}>
      <span className="dm-l">{row.label}</span>
      <span className="dm-p dm-num">{shown}% used</span>
      {row.tip ? <Tip label={row.tip}>{bar}</Tip> : bar}
      {(row.detail || row.action) && (
        <span className="dm-s">
          {row.detail && <Swap className="dm-t">{row.detail}</Swap>}
          {row.action && <button type="button" className="dm-ctm-go" onClick={row.action.onClick}><Swap>{row.action.label}</Swap></button>}
        </span>
      )}
    </div>
  );
}

/** How full the context window is, with any other limits, in one small popover that opens from a ring. */
export function ContextMeter({ rows, ring, title = 'Usage', model, effort, onViewUsage, open, defaultOpen = true, onOpenChange, className }: ContextMeterProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  // the bars and the ring fill in a moment after the meter appears
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);
  const fill = Math.max(0, Math.min(100, ring ?? rows[0]?.percent ?? 0));

  return (
    <div data-dm="" className={cx('dm-ctm', !isOpen && 'dm-shut', className)}>
      <div className="dm-ctm-pop dm-panel" role="dialog" aria-label={title} inert={!isOpen}>
        <div className="dm-ctm-ph">
          <b>{title}</b>
          {onViewUsage && <Tip label="View usage"><button type="button" className="dm-ib dm-ctm-ib" aria-label="View usage" onClick={onViewUsage}><Icon name="bars" /></button></Tip>}
        </div>
        <div className="dm-ctm-rows">{rows.map(r => <Row key={r.key} row={r} ready={ready} />)}</div>
      </div>
      <div className="dm-ctm-ft">
        {model && <span>{model}</span>}
        {effort && <span className="dm-muted">{effort}</span>}
        <button type="button" className="dm-ctm-ring" aria-expanded={isOpen} aria-label={`${title}, ${fill}% full`} onClick={() => setOpen(!isOpen)}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle className="dm-tr" cx="10" cy="10" r="7.5" />
            <circle className="dm-fl" cx="10" cy="10" r="7.5" pathLength={100} style={{ strokeDasharray: `${ready ? fill : 0} 100`, stroke: fill >= 90 ? 'var(--dm-warn)' : undefined }} />
          </svg>
        </button>
      </div>
    </div>
  );
}
```

## More in Agent status

- [Thinking](https://designme.dev/components/thinking.md): The live trace, written as the agent works, then folded away.
- [Reasoning trail](https://designme.dev/components/reasoning-trail.md): The agent's plan, notes, sources and edits, after it thinks.
- [Agent lanes](https://designme.dev/components/agent-lanes.md): Several agents working in parallel, each with its own lane and hand-offs.
- [Agent tree](https://designme.dev/components/agent-tree.md): An orchestrator and its sub-agents, with cost rolled up per branch.
- [Agent inbox](https://designme.dev/components/agent-inbox.md): Every run that needs you, is running or is done, in one list.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Grouped tasks with live progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.

All components: https://designme.dev/llms.txt
