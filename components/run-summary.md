# Run summary

> What the agent did, what changed and what needs you.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/run-summary

## Install

```sh
npx designme add run-summary          # HTML, CSS and JS, with the shared core
npx designme add run-summary --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Run summary is the report an agent leaves when a run finishes: a one-line summary, a few headline numbers, the files it changed with lines added and removed, and anything that still needs the person. Buttons at the bottom open the changes or undo them all.

### When to use it

- At the end of an agent run, when people need to see at a glance what happened before they review the details.
- When the run changed files and people should see which ones and by how much.
- When the agent finished but left questions or checks that need a person.
- When people should be able to undo a whole run in one click.

### What it does

- `stats` like files, steps, tokens or cost count up from zero one after another, with an optional `prefix`, `suffix` and number of `decimals`.
- "What changed" lists each file in `changes` with its added and removed line counts.
- "Needs you" lists each item in `needs` with an optional action button. Setting `busy` on the action shows a spinner, and the item's text crossfades when it changes.
- "Open changes" calls `onOpenChanges`, and `onDetails` adds a menu button in the corner for the run's details.
- "Undo all" switches the card to its undone look, changes the title to `undoneTitle` and turns the button into Redo. Control it with `undone` and `onUndoneChange`.
- The rows come in one after another when the summary appears. It sits flat in a chat thread by default, and `bare={false}` gives it a card.

### Accessibility

- A "Needs you" action button sets `aria-busy` while it is busy.
- The corner details button is labelled "More" and shows a "Run details" tooltip on hover or keyboard focus.
- Under `prefers-reduced-motion: reduce`, the stats jump straight to their values instead of counting up.

## Usage in React

```tsx
import { RunSummary } from '@/components/designme/run-summary/RunSummary';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { RunSummary, type RunNeed } from './RunSummary';
import { useScript } from '../lib/useScript';

/* ---------- Run summary: the numbers roll in, Review settles the one thing left, Undo all takes it back ---------- */
export default function RunSummaryDemo() {
  const [need, setNeed] = useState<'open' | 'busy' | 'fixed'>('open');
  // Review spins for a second, then the question is answered
  useScript(async ({ wait }) => { if (need === 'busy') { await wait(1000); setNeed('fixed'); } }, [need]);
  const needs: RunNeed[] = [need === 'fixed'
    ? { key: 'badge', text: 'Badge moved above the price, nothing left to review' }
    : { key: 'badge', text: 'The yearly badge overlaps the price on mobile', action: { label: 'Review', busy: need === 'busy', onClick: () => setNeed('busy') } }];
  return (
    <div style={{ width: '100%' }}>
      <RunSummary subtitle="Finished in 12m 40s" summary="Tightened the pricing cards and moved them onto spacing tokens"
        stats={[{ label: 'files', value: 6 }, { label: 'steps', value: 14 }, { label: 'tokens', value: 182, suffix: 'k' }, { label: 'cost', value: 0.84, prefix: '$', decimals: 2 }]}
        changes={[{ file: 'PricingCard.tsx', added: 24, removed: 18 }, { file: 'tokens.css', added: 9, removed: 2 }, { file: 'Pricing.test.tsx', added: 31, removed: 0 }]}
        needs={needs} onDetails={() => {}} onOpenChanges={() => {}} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` (optional) | `string` | Defaults to "Run complete" |
| `undoneTitle` (optional) | `string` | The title once the changes are undone |
| `subtitle` (optional) | `string` | The quiet line under the title, like "Finished in 12m 40s" |
| `summary` (optional) | `ReactNode` | One line on what the run did |
| `stats` (optional) | `RunStat[]` |  |
| `changes` (optional) | `RunChange[]` | The files the run changed, under "What changed" |
| `needs` (optional) | `RunNeed[]` | What is left for the person, under "Needs you" |
| `onDetails` (optional) | `() => void` | Adds a button in the corner that opens the run's details |
| `onOpenChanges` (optional) | `() => void` | The main button, "Open changes" |
| `undone` (optional) | `boolean` | Whether the changes are undone. Leave it out to let "Undo all" toggle it |
| `defaultUndone` (optional) | `boolean` |  |
| `onUndoneChange` (optional) | `(undone: boolean) => void` |  |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Questions

**Does Undo all revert the files?**

No. It changes the card's state and calls `onUndoneChange(true)`. Your code reverts the changes, and Redo calls it again with false.

**How do I show that a "Needs you" item is being handled?**

Set `busy: true` on its `action` while you work on it, then replace its `text`, and drop the action, once it is resolved. The new text crossfades in.

**Can I show a cost with two decimals?**

Yes. Pass a stat like `{ label: 'cost', value: 0.84, prefix: '$', decimals: 2 }`.

## Source

`RunSummary.tsx`, as `npx designme add run-summary --react` installs it:

```tsx
'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useTween } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Spin, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './run-summary.css';

export interface RunStat {
  /** Like "files" or "cost" */
  label: string;
  /** Counts up from 0 when the summary appears */
  value: number;
  /** Before the number, like "$" */
  prefix?: string;
  /** After the number, like "k" */
  suffix?: string;
  /** Decimal places, like 2 for a cost */
  decimals?: number;
}

export interface RunChange {
  file: string;
  added: number;
  removed: number;
}

export interface RunNeed {
  key: string;
  /** What needs the person. Crossfades when it changes */
  text: string;
  /** A button at the end, like Review. busy swaps its label for a spinner */
  action?: { label: string; onClick: () => void; busy?: boolean };
}

export interface RunSummaryProps {
  /** Defaults to "Run complete" */
  title?: string;
  /** The title once the changes are undone */
  undoneTitle?: string;
  /** The quiet line under the title, like "Finished in 12m 40s" */
  subtitle?: string;
  /** One line on what the run did */
  summary?: ReactNode;
  stats?: RunStat[];
  /** The files the run changed, under "What changed" */
  changes?: RunChange[];
  /** What is left for the person, under "Needs you" */
  needs?: RunNeed[];
  /** Adds a button in the corner that opens the run's details */
  onDetails?: () => void;
  /** The main button, "Open changes" */
  onOpenChanges?: () => void;
  /** Whether the changes are undone. Leave it out to let "Undo all" toggle it */
  undone?: boolean;
  defaultUndone?: boolean;
  onUndoneChange?: (undone: boolean) => void;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

function Stat({ stat, delay }: { stat: RunStat; delay: number }) {
  // each number starts rolling a beat after the one before it
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), delay); return () => clearTimeout(t); }, [delay]);
  const v = useTween(go ? stat.value : 0, 1100, 0);
  return <span><b className="dm-num">{go ? (stat.prefix ?? '') + v.toFixed(stat.decimals ?? 0) + (stat.suffix ?? '') : '0'}</b> {stat.label}</span>;
}

/** What an agent run did, what it cost and what still needs the person, once it finishes. */
export function RunSummary({ title = 'Run complete', undoneTitle = 'Changes undone', subtitle, summary, stats, changes, needs, onDetails, onOpenChanges, undone, defaultUndone = false, onUndoneChange, bare = true, className }: RunSummaryProps) {
  const [isUndone, setUndone] = useControllable(undone, defaultUndone, onUndoneChange);
  // the glyph only plays its entrance once it has changed, not when the summary first appears
  const [seen, setSeen] = useState(isUndone);
  const [moved, setMoved] = useState(false);
  if (seen !== isUndone) { setSeen(isUndone); setMoved(true); }
  // the rows come in one after another, across both sections
  let row = 0;
  const next = () => enter(300 + row++ * 70);

  return (
    <div data-dm="" className={cx('dm-rsu', !bare && 'dm-panel', isUndone && 'dm-undone', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-rsu-h">
        <span className="dm-rsu-g" style={isUndone ? { background: 'var(--dm-chip)', color: 'var(--dm-fg2)' } : undefined}>
          <Icon key={isUndone ? 'undo' : 'check'} name={isUndone ? 'undo' : 'check'} className={moved ? 'dm-enter' : undefined} />
        </span>
        <div>
          <Swap className="dm-rsu-t">{isUndone ? undoneTitle : title}</Swap>
          {subtitle && <div className="dm-rsu-s dm-muted">{subtitle}</div>}
        </div>
        {onDetails && <Tip label="Run details"><button type="button" className="dm-ib dm-rsu-more" aria-label="More" onClick={onDetails}><Icon name="more" /></button></Tip>}
      </div>
      {summary && <p className="dm-rsu-title">{summary}</p>}
      {stats?.length ? <div className="dm-rsu-stats">{stats.map((s, i) => <Stat key={s.label} stat={s} delay={200 + i * 90} />)}</div> : null}
      {changes?.length ? (
        <div className="dm-rsu-sec">
          <div className="dm-rsu-l">What changed</div>
          {changes.map(c => {
            const e = next();
            return (
              <div key={c.file} className={cx('dm-rsu-it', e.className)} style={e.style}>
                <span className="dm-mono">{c.file}</span>
                <span className="dm-num"><i className={c.added ? 'dm-a' : 'dm-z'}>+{c.added}</i> <i className={c.removed ? 'dm-x' : 'dm-z'}>−{c.removed}</i></span>
              </div>
            );
          })}
        </div>
      ) : null}
      {needs?.length ? (
        <div className="dm-rsu-sec">
          <div className="dm-rsu-l">Needs you</div>
          {needs.map(n => {
            const e = next();
            return (
              <div key={n.key} className={cx('dm-rsu-it dm-rsu-need', e.className)} style={e.style}>
                <span className="dm-dot" style={{ color: 'var(--dm-warn)' }} />
                <Swap className="dm-rsu-nt">{n.text}</Swap>
                {n.action && <button type="button" className="dm-pill dm-soft dm-sm dm-rsu-fix" onClick={n.action.busy ? undefined : n.action.onClick} aria-busy={n.action.busy || undefined}>{n.action.busy ? <Spin /> : n.action.label}</button>}
              </div>
            );
          })}
        </div>
      ) : null}
      {(() => {
        const e = next();
        return (
          <div className={cx('dm-rsu-acts', e.className)} style={e.style}>
            <button type="button" className="dm-pill dm-ink dm-sm" onClick={onOpenChanges}>Open changes</button>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-rsu-undo" onClick={() => setUndone(!isUndone)}><Swap>{isUndone ? 'Redo' : 'Undo all'}</Swap></button>
          </div>
        );
      })()}
    </div>
  );
}
```

## More in Agent status

- [Thinking](https://designme.dev/components/thinking.md): The live trace, written as the agent works, then folded away.
- [Reasoning trail](https://designme.dev/components/reasoning-trail.md): The agent's plan, notes, sources and edits, after it thinks.
- [Agent lanes](https://designme.dev/components/agent-lanes.md): Several agents working in parallel, each with its own lane and hand-offs.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Grouped tasks with live progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.

All components: https://designme.dev/llms.txt
