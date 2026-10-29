# Agent tree

> An orchestrator and its sub-agents, with cost rolled up per branch.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/agent-tree

## Install

```sh
npx designme add agent-tree          # HTML, CSS and JS, with the shared core
npx designme add agent-tree --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Agent tree shows an orchestrator and the sub-agents it hands work to, as a tree a person can fold. Every row has its task, a status and what it has spent, and each branch adds up its own cost and everything under it, so you can see where the money went. When a step fails, its row turns red and offers the fix in place.

### When to use it

- When one agent splits a job across sub-agents and people need to see who is doing what, and what is still queued.
- When a run spends money as it goes and people should see the cost per agent and per step, not just the total.
- When a step can fail and the run should wait for a person to take the fix it offers.
- When the tree gets long and finished branches should fold away.

### What it does

- `root` is the orchestrator; each node has a `name`, a `task`, a `status` of `queued`, `running`, `done` or `failed`, its own `cost` in dollars, and `children`.
- A branch shows its own cost plus everything under it. Hover its cost to see the split, like "Its own $0.02, 3 steps $0.26". The total sits beside the title.
- A running node spins, a finished one turns to a green check, and a failed one to a red alert on a red-tinted row. A changed `task` crossfades.
- `fix` adds a white button under a failed step's task, like Use color.accent.500.
- Click a branch, or its chevron, to fold it. `collapsed`, `defaultCollapsed` and `onCollapsedChange` hold which branches are folded.
- The line under the title reads Running, "1 step failed" or Done, with a clock that counts until the root is done, or shows `seconds`. Once the root is done a green line sums it up, like "Done in 0:14 · 3 agents · $0.66"; `summary` changes it or, set to `false`, hides it.

### Accessibility

- The rows form a tree with `role="tree"`. Each row is a `treeitem` with `aria-level`, and a branch has `aria-expanded`.
- Only one row is in the tab order. Up and Down move through the rows you can see, Right opens a branch or moves into it, Left closes it or moves to its parent, Home and End jump to the first and last row, and Enter or Space folds a branch.
- A folded branch is inert, so its rows can't be reached until it opens.
- The status line under the title is announced politely when it changes.

## Usage in React

```tsx
import { AgentTree } from '@/components/designme/agent-tree/AgentTree';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { AgentTree, type AgentNode, type AgentNodeStatus } from './AgentTree';
import { useScript, useStory } from '../lib/useScript';

/* ---------- Agent tree: the design agent works through its steps, one fails on a missing token, and the fix it offers waits for you;
   the finished research starts folded ---------- */
type Row = { name: string; task: string; status: AgentNodeStatus; cost: number; kids?: string[] };
// the run: an orchestrator, its three agents and their steps. cost is what each spends on its own, in dollars
const START: Record<string, Row> = {
  root: { name: 'Orchestrator', task: 'Plans the work and hands it out', status: 'running', cost: .04, kids: ['res', 'des', 'cop'] },
  res: { name: 'Research agent', task: 'Compare 3 competitor pricing pages', status: 'done', cost: .02, kids: ['res1', 'res2'] },
  res1: { name: 'Read the 3 pricing pages', task: '3 pages, 9.4k words', status: 'done', cost: .06 },
  res2: { name: 'Summarise their plans', task: 'Notes added to Pricing v4', status: 'done', cost: .04 },
  des: { name: 'Design agent', task: 'Rework the plan cards in Figma', status: 'running', cost: .02, kids: ['des1', 'des2', 'des3'] },
  des1: { name: 'Update the Pro card', task: 'Pricing v4, frame 2', status: 'running', cost: .03 },
  des2: { name: 'Update the Team card', task: 'Pricing v4, frame 3', status: 'queued', cost: 0 },
  des3: { name: 'Apply library tokens', task: 'Colour and spacing', status: 'queued', cost: 0 },
  cop: { name: 'Copy agent', task: 'Rewrite the plan descriptions', status: 'queued', cost: 0 }
};

export default function AgentTreeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(START);
  const [fixing, setFixing] = useState(false);
  const fixed = useRef<() => void>(undefined);
  const set = (id: string, patch: Partial<Row>) => setRows(r => ({ ...r, [id]: { ...r[id], ...patch } }));

  // whatever is running spends as it goes, so its cost and every total above it count up
  useEffect(() => {
    const id = setInterval(() => setRows(r => Object.fromEntries(Object.entries(r).map(([k, x]) => [k, x.status === 'running' ? { ...x, cost: x.cost + (k === 'root' ? .0006 : .0016) } : x]))), 100);
    return () => clearInterval(id);
  }, []);

  useScript(async ({ wait }) => {
    await wait(2000); set('des1', { status: 'done' }); set('des2', { status: 'running' });
    await wait(2500); set('des2', { status: 'done' }); set('des3', { status: 'running' });
    await wait(2000); set('des3', { status: 'failed', task: "color.accent.600 isn't in the library" }); setFixing(true);
    await new Promise<void>(res => { fixed.current = res; });
    setFixing(false); set('des3', { status: 'running', task: 'Using color.accent.500' });
    await wait(2000); set('des3', { status: 'done', task: 'Colour and spacing, from the library' }); set('des', { status: 'done' }); set('cop', { status: 'running' });
    await wait(3000); set('cop', { status: 'done' }); set('root', { status: 'done' });
  });

  // the preview's story: take the fix when a step fails, then fold the design branch once it's done
  useStory(ref, async ({ wait, press }) => {
    await wait(8500); press('.dm-atr-fix');
    await wait(6000); press('[data-id="des"]');
  });

  const node = (id: string): AgentNode => {
    const x = rows[id];
    return { id, name: x.name, task: x.task, status: x.status, cost: x.cost, children: x.kids?.map(node),
      ...(id === 'des3' && fixing ? { fix: { label: 'Use color.accent.500', onClick: () => fixed.current?.() } } : {}) };
  };

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <AgentTree root={node('root')} title="Redesign the pricing page" defaultCollapsed={['res']} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `root` | `AgentNode` | The orchestrator, with its agents and their steps as children |
| `title` | `string` | The run's goal, like "Redesign the pricing page" |
| `status` (optional) | `string` | The line under the title. Defaults to "Running", "1 step failed" or "Done", then the clock |
| `seconds` (optional) | `number` | Seconds to show as m:ss. Leave it out to let the clock count until the root is done |
| `summary` (optional) | `string \| false` | Shown under the tree once the root is done. Defaults to "Done in 0:14 · 3 agents · $0.66"; false hides it |
| `collapsed` (optional) | `string[]` | Ids of the folded branches. Leave it out to let each branch fold itself |
| `defaultCollapsed` (optional) | `string[]` |  |
| `onCollapsedChange` (optional) | `(ids: string[]) => void` |  |
| `formatCost` (optional) | `(dollars: number) => string` | Writes a cost. Defaults to dollars and cents, like "$0.12" |
| `className` (optional) | `string` |  |

## Questions

**Does it keep track of costs?**

No. Give each node the `cost` it spent on its own and the tree adds up the branches. Update the costs as your run reports them and the totals follow.

**Can it show more than three levels?**

Yes. Nodes can nest as deep as your run does; each level indents a step further, with a guide line down the side.

**What does the fix button do?**

Whatever you pass as its `onClick`. In the demo it lets the failed step run again with the token the library has.

**Can costs be in another currency?**

Yes. Pass `formatCost`, which gets each amount and returns the text to show.

## Source

`AgentTree.tsx`, as `npx designme add agent-tree --react` installs it:

```tsx
'use client';
import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useSeconds } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Fold, Spin, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './agent-tree.css';

export type AgentNodeStatus = 'queued' | 'running' | 'done' | 'failed';

export interface AgentNode {
  id: string;
  /** Like "Design agent", or a step's name */
  name: string;
  /** Its task, or what it is doing now. It crossfades when it changes */
  task: string;
  status: AgentNodeStatus;
  /** What this node spent on its own, in dollars. A branch shows this plus everything under it */
  cost?: number;
  /** A way out of a failed step, shown as a button under its task */
  fix?: { label: string; onClick: () => void };
  children?: AgentNode[];
}

export interface AgentTreeProps {
  /** The orchestrator, with its agents and their steps as children */
  root: AgentNode;
  /** The run's goal, like "Redesign the pricing page" */
  title: string;
  /** The line under the title. Defaults to "Running", "1 step failed" or "Done", then the clock */
  status?: string;
  /** Seconds to show as m:ss. Leave it out to let the clock count until the root is done */
  seconds?: number;
  /** Shown under the tree once the root is done. Defaults to "Done in 0:14 · 3 agents · $0.66"; false hides it */
  summary?: string | false;
  /** Ids of the folded branches. Leave it out to let each branch fold itself */
  collapsed?: string[];
  defaultCollapsed?: string[];
  onCollapsedChange?: (ids: string[]) => void;
  /** Writes a cost. Defaults to dollars and cents, like "$0.12" */
  formatCost?: (dollars: number) => string;
  className?: string;
}

const CLS: Record<AgentNodeStatus, string> = { queued: 'dm-queued', running: 'dm-run', done: 'dm-done', failed: 'dm-fail' };
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const total = (n: AgentNode): number => (n.cost ?? 0) + (n.children ?? []).reduce((a, k) => a + total(k), 0);
const branch = (n: AgentNode) => !!n.children?.length;

/** How many times `value` has changed since the first render, so a glyph can play its entrance on a change but not on mount */
function useChanges<T>(value: T) {
  const [seen, setSeen] = useState({ value, n: 0 });
  if (Object.is(seen.value, value)) return seen.n;
  setSeen({ value, n: seen.n + 1 });
  return seen.n + 1;
}

function Glyph({ status }: { status: AgentNodeStatus }) {
  const moved = useChanges(status) > 0;
  const e = moved ? enter() : undefined;
  return (
    <span key={status} className={cx('dm-atr-g', e?.className)} style={e?.style} aria-hidden="true">
      {status === 'running' ? <Spin /> : status === 'done' ? <Icon name="ok" size="xs" /> : status === 'failed' ? <Icon name="alert" size="xs" /> : <span className="dm-dot" />}
    </span>
  );
}

/** An orchestrator and its sub-agents as a tree. Each row shows its task, status and cost; a branch's cost rolls up
    everything under it, and branches fold. The arrow keys move through it as in any tree view. */
export function AgentTree({ root, title, status, seconds, summary, collapsed, defaultCollapsed = [], onCollapsedChange, formatCost, className }: AgentTreeProps) {
  const [shut, setShut] = useControllable(collapsed, defaultCollapsed, onCollapsedChange);
  const [focus, setFocus] = useState(root.id);
  const treeRef = useRef<HTMLDivElement>(null);
  const finished = root.status === 'done';
  const counted = useSeconds(seconds === undefined && !finished);
  const secs = seconds ?? counted;
  const money = formatCost ?? ((v: number) => '$' + v.toFixed(2));

  const all: { n: AgentNode; lv: number; parent?: AgentNode }[] = [];
  (function walk(n: AgentNode, lv: number, parent?: AgentNode) { all.push({ n, lv, parent }); n.children?.forEach(k => walk(k, lv + 1, n)); })(root, 0);
  const failed = all.filter(x => x.n.status === 'failed').length;
  const line = status ?? (finished ? 'Done' : failed ? `${failed} step${failed > 1 ? 's' : ''} failed` : 'Running');
  const agents = root.children?.length ?? 0;
  const done = summary === undefined ? `Done in ${clock(secs)} · ${agents} agent${agents === 1 ? '' : 's'} · ${money(total(root))}` : summary;

  const isOpen = (n: AgentNode) => !shut.includes(n.id);
  const toggle = (n: AgentNode, open = !isOpen(n)) => { if (branch(n)) setShut(open ? shut.filter(id => id !== n.id) : [...shut, n.id]); };
  // the rows a person can reach: everything not inside a folded branch
  const visible = all.filter(x => { for (let p = x.parent; p; p = all.find(y => y.n === p)?.parent) if (!isOpen(p)) return false; return true; });
  const go = (n?: AgentNode) => { if (!n) return; setFocus(n.id); treeRef.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(n.id)}"]`)?.focus({ preventScroll: true }); };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = visible.findIndex(x => x.n.id === focus); if (i < 0) return;
    const { n, parent } = visible[i], open = branch(n) && isOpen(n);
    if (e.key === 'ArrowDown') go(visible[i + 1]?.n);
    else if (e.key === 'ArrowUp') go(visible[i - 1]?.n);
    else if (e.key === 'ArrowRight') { if (branch(n) && !open) toggle(n, true); else if (open) go(n.children![0]); }
    else if (e.key === 'ArrowLeft') { if (open) toggle(n, false); else go(parent); }
    else if (e.key === 'Enter' || e.key === ' ') toggle(n);
    else if (e.key === 'Home') go(visible[0].n);
    else if (e.key === 'End') go(visible[visible.length - 1].n);
    else return;
    e.preventDefault();
  };

  const node = (n: AgentNode, lv: number): ReactNode => {
    const sum = total(n), own = n.cost ?? 0, k = n.children?.length ?? 0;
    const cost = <span className="dm-atr-c dm-num">{n.status === 'queued' && !sum ? '–' : money(branch(n) ? sum : own)}</span>;
    const fx = n.status === 'failed' && n.fix ? enter() : undefined;
    return (
      <div key={n.id} role="none" style={{ '--dm-lv': lv } as CSSProperties}>
        <div data-id={n.id} className={cx('dm-atr-n', CLS[n.status])} role="treeitem" aria-level={lv + 1} aria-expanded={branch(n) ? isOpen(n) : undefined}
          tabIndex={focus === n.id ? 0 : -1}
          onClick={e => { if ((e.target as Element).closest('.dm-atr-fix')) return; setFocus(n.id); toggle(n); }}>
          {branch(n) ? <span className="dm-atr-tg" aria-hidden="true"><Icon name="chev-d" size="xs" /></span> : <span className="dm-atr-sp" />}
          <Glyph status={n.status} />
          <span className="dm-atr-t">
            <b>{n.name}</b><Swap>{n.task}</Swap>
            {fx && <button type="button" className={cx('dm-pill dm-sm dm-atr-fix', fx.className)} style={fx.style} onClick={n.fix!.onClick}>{n.fix!.label}</button>}
          </span>
          {branch(n) ? <Tip label={`Its own ${money(own)}, ${k} ${lv ? (k > 1 ? 'steps' : 'step') : (k > 1 ? 'agents' : 'agent')} ${money(sum - own)}`}>{cost}</Tip> : cost}
        </div>
        {branch(n) && (
          <Fold open={isOpen(n)} className="dm-atr-kids">
            <div role="group">{n.children!.map(c => node(c, lv + 1))}</div>
          </Fold>
        )}
      </div>
    );
  };

  const sum = finished && done !== false ? enter() : undefined;
  return (
    <div data-dm="" className={cx('dm-atr dm-panel', className)}>
      <div className="dm-atr-h">
        <div className="dm-atr-ht"><b>{title}</b><span className="dm-muted dm-atr-st"><span aria-live="polite"><Swap>{line}</Swap></span> · <span className="dm-num">{clock(secs)}</span></span></div>
        <span className="dm-atr-tot dm-num">{money(total(root))}</span>
      </div>
      <div ref={treeRef} className="dm-atr-tree" role="tree" aria-label="Agents" onKeyDown={onKey}>{node(root, 0)}</div>
      {sum && <div className={cx('dm-atr-sum', sum.className)} style={sum.style}><Icon name="ok" size="xs" /><span>{done}</span></div>}
    </div>
  );
}
```

## More in Agent status

- [Thinking](https://designme.dev/components/thinking.md): The live trace, written as the agent works, then folded away.
- [Reasoning trail](https://designme.dev/components/reasoning-trail.md): The agent's plan, notes, sources and edits, after it thinks.
- [Agent lanes](https://designme.dev/components/agent-lanes.md): Several agents working in parallel, each with its own lane and hand-offs.
- [Agent inbox](https://designme.dev/components/agent-inbox.md): Every run that needs you, is running or is done, in one list.
- [Trace view](https://designme.dev/components/trace-view.md): One agent run as a waterfall of spans, with latency and tokens.
- [Browser session](https://designme.dev/components/browser-session.md): The agent browsing for you, step by step, with Pause and Take over.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Grouped tasks with live progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.

All components: https://designme.dev/llms.txt
