# Reasoning trail

> The agent's plan, notes, sources and edits, after it thinks.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/reasoning-trail

## Install

```sh
npx designme add reasoning-trail          # HTML, CSS and JS, with the shared core
npx designme add reasoning-trail --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Reasoning trail is a foldable record of how an agent worked through a task: its plan, its notes, the sources it used and the edits it made. It sits in a chat thread under a header that reads "Reasoning" with a running clock, then "Reasoned for Ns" once the agent is done.

### When to use it

- When people want to check how the agent reached its answer before they trust it.
- When the agent follows a plan and you want each step to show as done, in progress or next.
- When the agent changed files and people should see the removed and added lines in place.
- When the reasoning should stay out of the way until someone opens it.

### What it does

- It shows one of four views, picked with `view`: plan, notes, sources or edits. A view with nothing in it falls back to the first one that has content.
- Plan steps are done (a check and their `detail`), now (a pulse and "Working") or next (a grey dot and "Next").
- Notes are plain lines, sources are file and link chips with tooltips, and edits list each file with its removed and added lines.
- While `running` is true, the header shimmers and counts seconds, unless you pass `seconds`. `title` replaces the default header text.
- Clicking the header folds the trail open or shut, controlled with `open` and `onOpenChange` or left to the component. Switching views plays the entrance again.
- It sits flat in a chat thread by default, and `bare={false}` gives it a card of its own.

### Accessibility

- The header is a button with `aria-expanded`.
- When folded, the body is `inert` and `aria-hidden`, so its chips leave the tab order.
- The thinking glyph and status dots are decorative and hidden from screen readers.

## Usage in React

```tsx
import { ReasoningTrail } from '@/components/designme/reasoning-trail/ReasoningTrail';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { ReasoningTrail, type PlanStep, type ReasoningTrailView } from './ReasoningTrail';
import { Seg } from '../lib/motion';
import { Demo } from '../lib/Demo';
import { useScript } from '../lib/useScript';

/* ---------- Reasoning trail: the plan fills in, then the trail settles ---------- */
const PLAN = [['Open the onboarding file', '4 frames'], ['Compare it with the design system', '12 components'], ['Find spacing that breaks the 8px grid', '3 frames'], ['Draft fixes for review', 'Ready']];
export default function ReasoningTrailDemo() {
  const [done, setDone] = useState(0);
  const [view, setView] = useState<ReasoningTrailView>('plan');
  useScript(async ({ wait }) => { for (let i = 1; i <= PLAN.length; i++) { await wait(1500); setDone(i); } });
  const running = done < PLAN.length;
  const plan: PlanStep[] = PLAN.map(([label, detail], i) => ({ label, detail, state: i < done ? 'done' : i === done ? 'now' : 'next' }));
  return (
    <Demo switcher={<Seg label="View" value={view} onChange={setView} options={[{ value: 'plan', label: 'Plan' }, { value: 'notes', label: 'Notes' }, { value: 'sources', label: 'Sources' }, { value: 'edits', label: 'Edits' }]} />}>
      <ReasoningTrail running={running} plan={plan} view={view}
        notes={['The hero card uses 20px padding, every other card uses 24px.', 'Mobile frames already follow the grid, desktop drifted.', 'Two buttons use a hard-coded grey instead of a token.']}
        sources={[{ label: 'Onboarding.fig', kind: 'figma', tip: 'Figma, 4 frames read' }, { label: 'tokens.ts', kind: 'ts', tip: 'src/styles/tokens.ts, 212 lines' }, { label: 'Card.tsx', kind: 'tsx', tip: 'src/components/Card.tsx, 2 edits' }, { label: 'Spacing guide', kind: 'web', tip: 'designme.dev/guide/spacing' }]}
        edits={[{ file: 'Card.tsx', detail: '2 lines', removed: ['padding: 20px;'], added: ['padding: var(--space-6);'] }, { file: 'Button.tsx', detail: '1 line', removed: ['color: #8a8a8a;'], added: ['color: var(--text-dim);'] }]} />
    </Demo>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `running` (optional) | `boolean` | Shimmers and counts seconds while true |
| `seconds` (optional) | `number` | Seconds to show. Leave it out to let the trail count while it runs |
| `title` (optional) | `string` | Header text. Defaults to "Reasoning" while running and "Reasoned for Ns" after |
| `plan` (optional) | `PlanStep[]` |  |
| `notes` (optional) | `string[]` |  |
| `sources` (optional) | `Source[]` |  |
| `edits` (optional) | `Edit[]` |  |
| `view` (optional) | `ReasoningTrailView` | Which part of the trail it shows: the plan, the notes, the sources or the edits. Leave it out to start on the first one there is |
| `defaultView` (optional) | `ReasoningTrailView` |  |
| `onViewChange` (optional) | `(view: ReasoningTrailView) => void` |  |
| `open` (optional) | `boolean` | Whether the trail is open. Leave it out to let the header toggle it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Questions

**Does the trail come with Plan, Notes, Sources and Edits tabs?**

No. The component shows whichever view you pass in `view`, and you supply the switcher. The designme.dev demo puts a segmented control next to it.

**How do I show progress through the plan?**

Pass `plan` as steps with `state` set to 'done', 'now' or 'next', and update them from your own state as the agent moves on. Set `running` to false when it finishes.

**What does an edit look like?**

An edit has a `file`, an optional `detail` like "2 lines", and `removed` and `added` arrays of lines. Removed lines are shown first, then added ones, under the file name.

## Source

`ReasoningTrail.tsx`, as `npx designme add reasoning-trail --react` installs it:

```tsx
'use client';
import { cx } from '../lib/cx';
import { useControllable, useSeconds } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Dot, enter, Fold, Pulse, SourceChip, Swap, Think, type Source } from '../lib/motion';
import '../designme.css';
import './reasoning-trail.css';

export interface PlanStep {
  label: string;
  /** Shown under a finished step, like "4 frames" */
  detail?: string;
  state: 'done' | 'now' | 'next';
}
export interface Edit {
  file: string;
  /** Like "2 lines" */
  detail?: string;
  removed?: string[];
  added?: string[];
}
export type ReasoningTrailView = 'plan' | 'notes' | 'sources' | 'edits';
/** The earlier name of ReasoningTrailView */
export type ReasoningTab = ReasoningTrailView;

export interface ReasoningTrailProps {
  /** Shimmers and counts seconds while true */
  running?: boolean;
  /** Seconds to show. Leave it out to let the trail count while it runs */
  seconds?: number;
  /** Header text. Defaults to "Reasoning" while running and "Reasoned for Ns" after */
  title?: string;
  plan?: PlanStep[];
  notes?: string[];
  sources?: Source[];
  edits?: Edit[];
  /** Which part of the trail it shows: the plan, the notes, the sources or the edits. Leave it out to start on the first one there is */
  view?: ReasoningTrailView;
  defaultView?: ReasoningTrailView;
  onViewChange?: (view: ReasoningTrailView) => void;
  /** Whether the trail is open. Leave it out to let the header toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

const VIEWS: ReasoningTrailView[] = ['plan', 'notes', 'sources', 'edits'];

/** The agent's plan, notes, sources or edits, under a header it can fold away. Pick what it shows with `view`. */
export function ReasoningTrail({ running = false, seconds, title, plan, notes, sources, edits, view, defaultView, onViewChange, open, defaultOpen = true, onOpenChange, bare = true, className }: ReasoningTrailProps) {
  const counted = useSeconds(running && seconds === undefined);
  const secs = seconds ?? counted;
  const has = { plan: !!plan?.length, notes: !!notes?.length, sources: !!sources?.length, edits: !!edits?.length };
  const [picked] = useControllable(view, defaultView ?? VIEWS.find(v => has[v]) ?? 'plan', onViewChange);
  // a view with nothing in it falls back to the first one that has something
  const tab = has[picked] ? picked : VIEWS.find(v => has[v]) ?? picked;
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const head = title ?? (running ? 'Reasoning' : `Reasoned for ${Math.max(secs, 1)}s`);

  const body = () => {
    if (tab === 'plan') return plan?.map((p, i) => (
      <div key={'p' + i} className={cx('dm-rtr-li dm-enter', p.state === 'now' && 'dm-now')} style={enter(i * 50).style}>
        <span className="dm-g">{p.state === 'done' ? <span style={{ color: 'var(--dm-ok)', display: 'grid' }}><Icon name="check" size="xs" /></span> : p.state === 'now' ? <Pulse /> : <Dot color="var(--dm-faint)" />}</span>
        <span>{p.label}<span className="dm-d">{p.state === 'done' ? p.detail ?? 'Done' : p.state === 'now' ? 'Working' : 'Next'}</span></span>
      </div>));
    if (tab === 'notes') return notes?.map((t, i) => (
      <div key={'n' + i} className="dm-rtr-li dm-enter" style={enter(i * 50).style}><span className="dm-g"><Dot color="var(--dm-faint)" /></span><span>{t}</span></div>));
    if (tab === 'sources') return <div className="dm-rtr-src dm-enter">{sources?.map((s, i) => <SourceChip key={i} source={s} />)}</div>;
    return edits?.map((e, i) => (
      <div key={'e' + i} className="dm-enter" style={enter(i * 50).style}>
        <div className="dm-rtr-li"><span className="dm-g"><Icon name="edit" size="xs" /></span><span>{e.file}{e.detail && <span className="dm-d">{e.detail}</span>}</span></div>
        <div className="dm-rtr-edit">{e.removed?.map((l, k) => <div key={'x' + k} className="dm-x">{l}</div>)}{e.added?.map((l, k) => <div key={'a' + k} className="dm-a">{l}</div>)}</div>
      </div>));
  };

  return (
    <div data-dm="" className={cx('dm-rtr', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <button type="button" className="dm-rtr-h" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
        <Think on={running} className="dm-rtr-mark" />
        <Swap className={cx('dm-rtr-title', running && 'dm-shim')}>{head}</Swap>
        <span className="dm-rtr-time dm-num dm-muted">{running ? secs + 's' : ''}</span>
        <Icon name="chev-d" size="xs" className="dm-rtr-chev" />
      </button>
      <Fold open={isOpen} className="dm-rtr-fold">
        {/* keyed by view, so switching views plays the entrance again */}
        <div className="dm-rtr-body" key={tab}>{body()}</div>
      </Fold>
    </div>
  );
}
```

## More in Agent status

- [Thinking](https://designme.dev/components/thinking.md): The live trace, written as the agent works, then folded away.
- [Agent lanes](https://designme.dev/components/agent-lanes.md): Several agents working in parallel, each with its own lane and hand-offs.
- [Agent tree](https://designme.dev/components/agent-tree.md): An orchestrator and its sub-agents, with cost rolled up per branch.
- [Agent inbox](https://designme.dev/components/agent-inbox.md): Every run that needs you, is running or is done, in one list.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
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
