# Agent tree

> An orchestrator and the sub-agents it spawns, with the active path and cost rolled up.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/agent-tree

## Install

```sh
npx designme add agent-tree          # HTML, CSS and JS, with the shared core
npx designme add agent-tree --react  # React 19 component and its CSS
npx designme add agent-tree --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/agent-tree.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/agent-tree.json  # Astro
```

## About

Agent tree shows an orchestrator and the sub-agents it spawns, joined by elbows that draw in as each one appears. A short dash runs along the path to whatever is working. Every row has its task, a status and what it has spent, and each branch adds up its own cost and tokens and everything under it.

### When to use it

- When one agent splits a job across sub-agents and people need to see who started whom, and what is still queued.
- When a run spends money and tokens as it goes and people should see the cost per agent and per step, not just the total.
- When a step can fail, or stop to wait for approval, and the run should offer the fix or the approval in place.
- When the tree sits inside a chat or a side panel, and the heavy card around it would get in the way.
- When the tree gets long and finished branches should fold away.

### What it does

- `root` is the orchestrator. Each node has an `id`, a `name`, a `task`, a `status` of `queued`, `running`, `done`, `failed` or `waiting`, its own `cost` in dollars, its own `tokens`, and `children`.
- A child joins its parent with an elbow. The elbow draws in when the child appears. While a node is running, a short dash travels the path from the root to it. Hover or select a row and that path is marked back to the root, and a line under the title reads the row's own cost, the rollup and its tokens.
- A branch shows its own cost plus everything under it, and the same for tokens. Hover its cost to see the split, like "Its own $0.02, 2 steps $0.09 · 1.2k tokens". The total sits beside the title.
- A running node spins and its time counts up. A finished one turns to a green check, a failed one to a red alert on a red-tinted row, and a waiting one to a hand on an amber row. A changed `task` crossfades.
- `fix` adds a button under a failed step's task, like Trim to 90 words. `approval` adds Approve and, if you pass it, Hold, under a waiting step.
- `variant` is `panel` or `bare`. bare drops the surface and the shadow so the tree can sit in a chat or a side panel. `slim` hides the title and keeps the status line, for a tree whose chat header already names the run.
- Click a branch, or its chevron, to fold it. `collapsed`, `defaultCollapsed` and `onCollapsedChange` hold which branches are folded. `selected`, `defaultSelected` and `onSelectedChange` hold the row that is marked.
- The line under the title reads Running, Needs you, "1 step failed" or Done, with a clock that counts until the root is done, or shows `seconds`. Once the root is done a green line sums it up, like "Done in 0:12 · 3 agents · $0.48 · 4.4k tokens"; `summary` changes it or, set to `false`, hides it.

### Accessibility

- The rows form a tree with `role="tree"`. Each row is a `treeitem` with `aria-level` and `aria-selected`, and a branch has `aria-expanded`.
- Only one row is in the tab order. Up and Down move through the rows you can see, Right opens a branch or moves into it, Left closes it or moves to its parent, Home and End jump to the first and last row, and Enter or Space folds a branch, or presses Approve or the fix when that row is offering one.
- A folded branch is inert, so its rows can't be reached until it opens.
- The status line under the title, and the line for the selected row, are announced politely when they change.
- With reduced motion the elbows appear in place and the dash along the active path stays still.

## Usage in React

```tsx
import { AgentTree } from '@/components/designme/agent-tree/AgentTree';
```

### Example

```tsx
'use client';
// The animated preview: a welcome-email run that grows inside a chat, the way the tree sits in a product.
import { useEffect, useRef, useState } from 'react';
import { AgentTree, type AgentNode, type AgentNodeStatus } from './AgentTree';
import { useScript, useStory } from '../lib/useScript';

type Row = { name: string; task: string; status: AgentNodeStatus; cost: number; tokens: number; seconds: number; kids?: string[] };
type Patch = Partial<Row>;

const START: Record<string, Row> = {
  root: { name: 'Brief', task: 'Splitting the welcome email', status: 'running', cost: .02, tokens: 80, seconds: 0, kids: [] },
};

export default function AgentTreeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(START);
  const [ask, setAsk] = useState<'fix' | 'approve' | null>(null);
  const fixed = useRef<(() => void) | undefined>(undefined);
  const approved = useRef<(() => void) | undefined>(undefined);
  const set = (id: string, patch: Patch) => setRows(r => ({ ...r, [id]: { ...r[id], ...patch } }));
  const spawn = (parent: string, id: string, row: Row) => setRows(r => ({
    ...r,
    [parent]: { ...r[parent], kids: [...(r[parent].kids ?? []), id] },
    [id]: row,
  }));

  useEffect(() => {
    const id = setInterval(() => setRows(r => Object.fromEntries(Object.entries(r).map(([k, x]) => [k, x.status === 'running' ? { ...x, cost: x.cost + (k === 'root' ? .0005 : .0015), tokens: x.tokens + (k === 'root' ? 8 : 22), seconds: x.seconds + .1 } : x]))), 100);
    return () => clearInterval(id);
  }, []);

  useScript(async ({ wait }) => {
    await wait(380);
    spawn('root', 'reader', { name: 'Reader', task: 'Gathers the last sends and the voice notes', status: 'running', cost: .01, tokens: 40, seconds: 0, kids: [] });
    await wait(420);
    spawn('reader', 'r1', { name: 'Read the last 3 sends', task: '3 emails, 1.1k words', status: 'running', cost: .02, tokens: 120, seconds: 0 });
    await wait(980); set('r1', { status: 'done' });
    spawn('reader', 'r2', { name: 'Pull the voice notes', task: 'Tone, length, words to keep', status: 'running', cost: .02, tokens: 80, seconds: 0 });
    await wait(980); set('r2', { status: 'done' }); set('reader', { status: 'done', task: 'Notes and sends are in' });
    spawn('root', 'writer', { name: 'Writer', task: 'Drafts the subject and the body', status: 'running', cost: .02, tokens: 70, seconds: 0, kids: [] });
    spawn('writer', 'w1', { name: 'Draft the subject', task: 'Under 50 characters', status: 'running', cost: .02, tokens: 140, seconds: 0 });
    await wait(1100); set('w1', { status: 'done', task: 'Four options, shortest wins' });
    spawn('writer', 'w2', { name: 'Draft the body', task: 'Under 90 words', status: 'running', cost: .03, tokens: 220, seconds: 0 });
    await wait(1100); set('w2', { status: 'failed', task: 'Runs past 90 words' }); set('writer', { status: 'running', task: 'The draft runs long' }); setAsk('fix');
    await new Promise<void>(res => { fixed.current = () => { fixed.current = undefined; res(); }; wait(2600).then(() => fixed.current?.()); });
    setAsk(null); set('w2', { status: 'running', task: 'Trimming it to 90 words' }); set('writer', { status: 'running', task: 'Drafts the body' });
    await wait(1000); set('w2', { status: 'done', task: '86 words, in the voice notes' }); set('writer', { status: 'done', task: 'Draft is in the voice notes' });
    spawn('root', 'checker', { name: 'Checker', task: 'Checks length and tone', status: 'running', cost: .01, tokens: 60, seconds: 0, kids: [] });
    spawn('checker', 'c1', { name: 'Count the words and the tone', task: 'Against the voice notes', status: 'running', cost: .02, tokens: 180, seconds: 0 });
    await wait(1000); set('c1', { status: 'done', task: '86 words, tone matches' }); set('checker', { status: 'waiting', task: 'Approve the send' }); setAsk('approve');
    await new Promise<void>(res => { approved.current = () => { approved.current = undefined; res(); }; wait(2800).then(() => approved.current?.()); });
    setAsk(null); set('checker', { status: 'running', task: 'Sending is approved' });
    await wait(860); set('checker', { status: 'done', task: 'Length and tone check out' }); set('root', { status: 'done', task: 'Welcome email is ready' });
  });

  useStory(ref, async ({ wait, press }) => {
    await wait(7000); press('.dm-atr-fix');
    await wait(4500); press('.dm-atr-yes');
  }, { hold: false });

  const node = (id: string): AgentNode => {
    const x = rows[id];
    return {
      id, name: x.name, task: x.task, status: x.status, cost: x.cost, tokens: x.tokens, seconds: x.seconds,
      children: x.kids?.map(node),
      ...(id === 'w2' && ask === 'fix' ? { fix: { label: 'Trim to 90 words', onClick: () => fixed.current?.() } } : {}),
      ...(id === 'checker' && ask === 'approve' ? { approval: { approveLabel: 'Approve send', declineLabel: 'Hold', onApprove: () => approved.current?.(), onDecline: () => set('checker', { task: 'Held for you' }) } } : {}),
    };
  };

  const mode = rows.checker?.status === 'waiting' ? 'wait' : rows.w2?.status === 'failed' ? 'fail' : rows.root.status === 'done' ? 'done' : 'run';
  const live = mode === 'done' ? 'Done' : mode === 'fail' ? 'A step failed' : mode === 'wait' ? 'Needs you' : 'Working';

  return (
    <div ref={ref} className="dm-atr-chat dm-panel" data-dm="" style={{ width: '100%' }}>
      <div className="dm-atr-chat-h"><b>Welcome email</b><span className={`dm-atr-chat-live dm-${mode}`}><span className="dm-dot" /><span>{live}</span></span></div>
      <div className="dm-atr-chat-log">
        <p className="dm-atr-chat-me">Rewrite the welcome email. Keep it under 90 words and match the voice notes.</p>
        <div className="dm-atr-chat-ag">
          <AgentTree root={node('root')} title="Welcome email" variant="bare" slim />
        </div>
      </div>
      <div className="dm-atr-chat-box">Ask Brief</div>
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `root` | `AgentNode` | The orchestrator, with its agents and their steps as children |
| `title` | `string` | The run's goal, like "Welcome email" |
| `status` (optional) | `string` | The line under the title. Defaults to "Running", "Needs you", "1 step failed" or "Done", then the clock |
| `seconds` (optional) | `number` | Seconds to show as m:ss. Leave it out to let the clock count until the root is done |
| `summary` (optional) | `string \| false` | Shown under the tree once the root is done. Defaults to "Done in 0:12 · 3 agents · $0.48 · 4.4k tokens"; false hides it |
| `collapsed` (optional) | `string[]` | Ids of the folded branches. Leave it out to let each branch fold itself |
| `defaultCollapsed` (optional) | `string[]` |  |
| `onCollapsedChange` (optional) | `(ids: string[]) => void` |  |
| `selected` (optional) | `string` | The selected node's id. Leave it out and the tree keeps the last row a person chose |
| `defaultSelected` (optional) | `string` |  |
| `onSelectedChange` (optional) | `(id: string) => void` |  |
| `formatCost` (optional) | `(dollars: number) => string` | Writes a cost. Defaults to dollars and cents, like "$0.12" |
| `variant` (optional) | `'panel' \| 'bare'` | panel draws the surface. bare leaves it off so the tree can sit in a chat or a side panel |
| `slim` (optional) | `boolean` | Hides the title and keeps the status line, for a tree under a chat header that already names the run |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import AgentTree from '../components/designme/agent-tree/AgentTree.astro';
---
<AgentTree />
<AgentTree data-style="soft" class="my-class" />
```
It plays its demo; change `agent-tree.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Does it keep track of costs?**

No. Give each node the `cost` it spent on its own and the tree adds up the branches. Update the costs as your run reports them and the totals follow. `tokens` works the same way.

**Can it show more than three levels?**

Yes. Nodes can nest as deep as your run does. Each level steps in, and the elbow follows the row.

**What do the fix and approval buttons do?**

Whatever you pass. `fix.onClick` runs for a failed step. `approval.onApprove` runs for a waiting step, and `approval.onDecline` runs when someone presses Hold.

**Can it sit inside a chat?**

Yes. Pass `variant="bare"` and the tree drops its surface and shadow. `slim` hides the title when the chat header already names the run. The demo's In chat design is that tree inside a transcript.

**Can costs be in another currency?**

Yes. Pass `formatCost`, which gets each amount and returns the text to show.

## Source

`AgentTree.tsx`, as `npx designme add agent-tree --react` installs it:

```tsx
'use client';
import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion, useSeconds } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Fold, Spin, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './agent-tree.css';

export type AgentNodeStatus = 'queued' | 'running' | 'done' | 'failed' | 'waiting';

export interface AgentNode {
  id: string;
  /** Like "Writer", or a step's name */
  name: string;
  /** Its task, or what it is doing now. It crossfades when it changes */
  task: string;
  status: AgentNodeStatus;
  /** What this node spent on its own, in dollars. A branch shows this plus everything under it */
  cost?: number;
  /** Tokens this node spent on its own. A branch shows this plus everything under it */
  tokens?: number;
  /** Seconds this node has been running, or took. Leave it out and a running node counts on its own */
  seconds?: number;
  /** A way out of a failed step, shown as a button under its task */
  fix?: { label: string; onClick: () => void };
  /** Shown while the node is waiting. Approve continues, and Hold is optional */
  approval?: { approveLabel?: string; declineLabel?: string; onApprove: () => void; onDecline?: () => void };
  children?: AgentNode[];
}

export interface AgentTreeProps {
  /** The orchestrator, with its agents and their steps as children */
  root: AgentNode;
  /** The run's goal, like "Welcome email" */
  title: string;
  /** The line under the title. Defaults to "Running", "Needs you", "1 step failed" or "Done", then the clock */
  status?: string;
  /** Seconds to show as m:ss. Leave it out to let the clock count until the root is done */
  seconds?: number;
  /** Shown under the tree once the root is done. Defaults to "Done in 0:12 · 3 agents · $0.48 · 4.4k tokens"; false hides it */
  summary?: string | false;
  /** Ids of the folded branches. Leave it out to let each branch fold itself */
  collapsed?: string[];
  defaultCollapsed?: string[];
  onCollapsedChange?: (ids: string[]) => void;
  /** The selected node's id. Leave it out and the tree keeps the last row a person chose */
  selected?: string;
  defaultSelected?: string;
  onSelectedChange?: (id: string) => void;
  /** Writes a cost. Defaults to dollars and cents, like "$0.12" */
  formatCost?: (dollars: number) => string;
  /** panel draws the surface. bare leaves it off so the tree can sit in a chat or a side panel */
  variant?: 'panel' | 'bare';
  /** Hides the title and keeps the status line, for a tree under a chat header that already names the run */
  slim?: boolean;
  className?: string;
}

const CLS: Record<AgentNodeStatus, string> = { queued: 'dm-queued', running: 'dm-run', done: 'dm-done', failed: 'dm-fail', waiting: 'dm-wait' };
const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const fmtTok = (n: number) => { n = Math.max(0, Math.round(n)); if (n >= 10000) return Math.round(n / 1000) + 'k'; if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'; return String(n); };
const total = (n: AgentNode): number => (n.cost ?? 0) + (n.children ?? []).reduce((a, k) => a + total(k), 0);
const totalTok = (n: AgentNode): number => (n.tokens ?? 0) + (n.children ?? []).reduce((a, k) => a + totalTok(k), 0);
const branch = (n: AgentNode) => !!n.children?.length;

type Flat = { n: AgentNode; lv: number; parent?: AgentNode };
const walk = (n: AgentNode, lv: number, parent: AgentNode | undefined, out: Flat[]) => { out.push({ n, lv, parent }); n.children?.forEach(k => walk(k, lv + 1, n, out)); };

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
      {status === 'running' ? <Spin /> : status === 'done' ? <Icon name="ok" size="xs" /> : status === 'failed' ? <Icon name="alert" size="xs" /> : status === 'waiting' ? <Icon name="hand" size="xs" /> : <span className="dm-dot" />}
    </span>
  );
}

function NodeTime({ status, seconds }: { status: AgentNodeStatus; seconds?: number }) {
  const [tick, setTick] = useState(0);
  const own = seconds === undefined && status === 'running';
  useIsoLayoutEffect(() => {
    if (!own) return;
    const t0 = Date.now();
    const id = setInterval(() => setTick(Math.floor((Date.now() - t0) / 1000)), 1000);
    return () => clearInterval(id);
  }, [own, status]);
  const s = Math.floor(seconds ?? (own ? tick : 0));
  if (status !== 'running' && s < 1) return null;
  return <span className="dm-atr-time dm-num">{clock(s)}</span>;
}

/** An orchestrator and the sub-agents it spawns. Each child joins its parent through an elbow that draws in, the path to
    a running node carries a short dash, and a branch's cost and tokens roll up. Hover or select a row to mark its path
    back to the root. The arrow keys move through it as in any tree view. */
export function AgentTree({ root, title, status, seconds, summary, collapsed, defaultCollapsed = [], onCollapsedChange, selected, defaultSelected, onSelectedChange, formatCost, variant = 'panel', slim = false, className }: AgentTreeProps) {
  const [shut, setShut] = useControllable(collapsed, defaultCollapsed, onCollapsedChange);
  const [sel, setSel] = useControllable(selected, defaultSelected ?? root.id, onSelectedChange);
  const [focus, setFocus] = useState(root.id);
  const [hot, setHot] = useState<string | null>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const born = useRef(new Set<string>());
  const reduce = useReducedMotion();
  const finished = root.status === 'done';
  const counted = useSeconds(seconds === undefined && !finished);
  const secs = seconds ?? counted;
  const money = formatCost ?? ((v: number) => '$' + v.toFixed(2));

  const all: Flat[] = [];
  walk(root, 0, undefined, all);
  const byId = (id?: string | null) => all.find(x => x.n.id === id);
  const failed = all.filter(x => x.n.status === 'failed').length;
  const waiting = all.filter(x => x.n.status === 'waiting').length;
  const line = status ?? (finished ? 'Done' : failed ? `${failed} step${failed > 1 ? 's' : ''} failed` : waiting ? 'Needs you' : 'Running');
  const agents = root.children?.length ?? 0;
  const tokAll = totalTok(root);
  const done = summary === undefined
    ? `Done in ${clock(secs)} · ${agents} agent${agents === 1 ? '' : 's'} · ${money(total(root))}${tokAll ? ' · ' + fmtTok(tokAll) + ' tokens' : ''}`
    : summary;

  const isOpen = (n: AgentNode) => !shut.includes(n.id);
  const toggle = (n: AgentNode, open = !isOpen(n)) => { if (branch(n)) setShut(open ? shut.filter(id => id !== n.id) : [...shut, n.id]); };
  const visible = all.filter(x => { for (let p = x.parent; p; p = byId(p.id)?.parent) if (p && !isOpen(p)) return false; return true; });
  const go = (n?: AgentNode) => { if (!n) return; setFocus(n.id); setSel(n.id); treeRef.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(n.id)}"]`)?.focus({ preventScroll: true }); };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('button')) return;
    const i = visible.findIndex(x => x.n.id === focus); if (i < 0) return;
    const { n, parent } = visible[i], open = branch(n) && isOpen(n);
    let next: AgentNode | undefined;
    if (e.key === 'ArrowDown') next = visible[i + 1]?.n;
    else if (e.key === 'ArrowUp') next = visible[i - 1]?.n;
    else if (e.key === 'ArrowRight') { if (branch(n) && !open) toggle(n, true); else if (open) next = n.children![0]; }
    else if (e.key === 'ArrowLeft') { if (open) toggle(n, false); else next = parent; }
    else if (e.key === 'Home') next = visible[0].n;
    else if (e.key === 'End') next = visible[visible.length - 1].n;
    else if (e.key === 'Enter' || e.key === ' ') {
      const row = treeRef.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(n.id)}"]`);
      const yes = row?.querySelector<HTMLButtonElement>('.dm-atr-yes, .dm-atr-fix');
      if (yes) yes.click(); else toggle(n);
    } else return;
    e.preventDefault();
    if (next) go(next);
  };

  const chain = (id?: string | null) => { const s = new Set<string>(); for (let p = byId(id)?.n; p; p = byId(p.id)?.parent) s.add(p.id); return s; };
  const hotIds = chain(hot || sel);
  const liveIds = new Set<string>();
  all.forEach(({ n }) => { if (n.status === 'running') for (let p: AgentNode | undefined = n; p; p = byId(p.id)?.parent) liveIds.add(p.id); });

  // elbows are measured from the rows, then drawn into each branch's svg. A new elbow draws itself in once
  const sig = all.map(x => x.n.id + x.n.status + (branch(x.n) ? (isOpen(x.n) ? 'o' : 'c') : '') + (x.n.task.length % 1)).join('|') + '|' + (hot || '') + '|' + sel + (reduce ? 'r' : '');
  useIsoLayoutEffect(() => {
    const tree = treeRef.current; if (!tree) return;
    const host = tree.closest('[data-style]') || document.documentElement;
    const R = host.getAttribute('data-style') === 'soft' ? 8 : 0;
    const draw = () => {
      tree.querySelectorAll<HTMLElement>('.dm-atr-nest').forEach(nest => {
        const svg = nest.querySelector('svg'); if (!svg) return;
        const w = nest.clientWidth, h = nest.clientHeight;
        if (w < 2 || h < 2) return;
        const rail = (parseFloat(getComputedStyle(nest).paddingLeft) || 20) / 2;
        svg.setAttribute('width', String(w)); svg.setAttribute('height', String(h)); svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        const items = [...nest.children].filter(el => el.classList.contains('dm-atr-item'));
        const keep = new Set<string>();
        let prev = 0;
        items.forEach(item => {
          const row = item.querySelector<HTMLElement>(':scope > .dm-atr-n'); if (!row) return;
          const id = row.dataset.id || ''; keep.add(id);
          const nb = nest.getBoundingClientRect(), rb = row.getBoundingClientRect();
          const y = rb.top - nb.top + rb.height / 2;
          const r = Math.min(R, Math.max(0, y - prev - 1));
          const x = Math.max(rail + r + 10, rb.left - nb.left + 4);
          const turn = y - r;
          const d = r < 2
            ? `M ${rail} ${prev} V ${y} H ${x}`
            : `M ${rail} ${prev} V ${turn} Q ${rail} ${y} ${rail + r} ${y} H ${x}`;
          prev = r < 2 ? y : turn;
          const ns = 'http://www.w3.org/2000/svg';
          let wire = svg.querySelector<SVGPathElement>(`.dm-atr-wire[data-id="${CSS.escape(id)}"]`);
          if (!wire) {
            wire = document.createElementNS(ns, 'path');
            wire.setAttribute('class', 'dm-atr-wire'); wire.dataset.id = id; svg.appendChild(wire);
          }
          wire.setAttribute('d', d);
          const len = Math.max(1, Math.ceil(wire.getTotalLength()));
          if (!born.current.has(id)) {
            born.current.add(id);
            if (!reduce) {
              wire.style.setProperty('--dm-len', String(len));
              wire.classList.add('dm-draw');
              wire.addEventListener('animationend', () => { wire.classList.remove('dm-draw'); wire.style.removeProperty('--dm-len'); }, { once: true });
            }
          } else if (!wire.classList.contains('dm-draw')) wire.style.removeProperty('--dm-len');
          else wire.style.setProperty('--dm-len', String(len));
          const st = byId(id)?.n.status;
          wire.classList.toggle('dm-live', liveIds.has(id) && st !== 'failed' && st !== 'waiting');
          wire.classList.toggle('dm-bad', st === 'failed');
          wire.classList.toggle('dm-wait', st === 'waiting');
          wire.classList.toggle('dm-on', hotIds.has(id));
          let flow = svg.querySelector<SVGPathElement>(`.dm-atr-flow[data-id="${CSS.escape(id)}"]`);
          if (liveIds.has(id) && !reduce) {
            if (!flow) { flow = document.createElementNS(ns, 'path'); flow.setAttribute('class', 'dm-atr-flow'); flow.dataset.id = id; svg.appendChild(flow); }
            flow.setAttribute('d', d);
          } else if (flow) flow.remove();
        });
        svg.querySelectorAll<SVGPathElement>('.dm-atr-wire, .dm-atr-flow').forEach(p => { if (!keep.has(p.dataset.id || '')) p.remove(); });
      });
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(tree);
    return () => ro.disconnect();
  }, [sig]);

  const word = (s: AgentNodeStatus) => s === 'running' ? 'running' : s === 'waiting' ? 'needs you' : s === 'failed' ? 'failed' : s === 'done' ? 'done' : 'queued';
  const detailOf = (n: AgentNode, lv: number) => {
    const k = n.children?.length ?? 0, tk = totalTok(n);
    const rest = k ? ` · ${k} ${lv ? (k > 1 ? 'steps' : 'step') : (k > 1 ? 'agents' : 'agent')} ${money(total(n) - (n.cost ?? 0))}` : '';
    return `${n.name} · its own ${money(n.cost ?? 0)}${rest}${tk ? ' · ' + fmtTok(tk) + ' tokens' : ''} · ${word(n.status)}`;
  };
  const picked = byId(sel)?.n ?? root;

  const node = (n: AgentNode, lv: number): ReactNode => {
    const sum = total(n), own = n.cost ?? 0, tk = branch(n) ? totalTok(n) : (n.tokens ?? 0), k = n.children?.length ?? 0;
    const costText = n.status === 'queued' && sum < 0.005 ? '–' : money(branch(n) ? sum : own);
    const tokText = n.status === 'queued' && tk < 1 ? '' : fmtTok(tk);
    const cost = <span className="dm-atr-c dm-num">{costText}</span>;
    const tip = branch(n) ? `Its own ${money(own)}, ${k} ${lv ? (k > 1 ? 'steps' : 'step') : (k > 1 ? 'agents' : 'agent')} ${money(sum - own)}${totalTok(n) ? ' · ' + fmtTok(totalTok(n)) + ' tokens' : ''}` : '';
    const ask = n.status === 'waiting' && n.approval ? enter() : undefined;
    const fx = n.status === 'failed' && n.fix ? enter() : undefined;
    return (
      <div key={n.id} className="dm-atr-item" role="none">
        <div data-id={n.id} className={cx('dm-atr-n', CLS[n.status], (hot || sel) === n.id && 'dm-path')} role="treeitem" aria-level={lv + 1} aria-selected={sel === n.id}
          aria-expanded={branch(n) ? isOpen(n) : undefined} tabIndex={focus === n.id ? 0 : -1}
          onPointerEnter={e => { if (e.pointerType === 'mouse') setHot(n.id); }}
          onClick={e => { if ((e.target as Element).closest('button')) return; setFocus(n.id); setSel(n.id); toggle(n); }}>
          {branch(n) ? <span className="dm-atr-tg" aria-hidden="true"><Icon name="chev-d" size="xs" /></span> : <span className="dm-atr-sp" />}
          <Glyph status={n.status} />
          <span className="dm-atr-t">
            <span className="dm-atr-nm"><b>{n.name}</b><NodeTime status={n.status} seconds={n.seconds} /></span>
            <Swap className="dm-atr-task">{n.task}</Swap>
            {fx && <span className={cx('dm-atr-ask', fx.className)} style={fx.style}><button type="button" className="dm-pill dm-sm dm-atr-fix" onClick={n.fix!.onClick}>{n.fix!.label}</button></span>}
            {ask && (
              <span className={cx('dm-atr-ask', ask.className)} style={ask.style}>
                <button type="button" className="dm-pill dm-primary dm-sm dm-atr-yes" onClick={n.approval!.onApprove}>{n.approval!.approveLabel ?? 'Approve'}</button>
                {n.approval!.onDecline && <button type="button" className="dm-pill dm-sm dm-atr-no" onClick={n.approval!.onDecline}>{n.approval!.declineLabel ?? 'Hold'}</button>}
              </span>
            )}
          </span>
          <span className="dm-atr-meta">
            {tip ? <Tip label={tip}>{cost}</Tip> : cost}
            <span className="dm-atr-tok dm-num">{tokText}</span>
          </span>
        </div>
        {branch(n) && (
          <Fold open={isOpen(n)} className="dm-atr-kids">
            <div className="dm-atr-nest" role="group">
              <svg className="dm-atr-svg" aria-hidden="true" />
              {n.children!.map(c => node(c, lv + 1))}
            </div>
          </Fold>
        )}
      </div>
    );
  };

  const sum = finished && done !== false ? enter() : undefined;
  return (
    <div data-dm="" className={cx('dm-atr', variant === 'panel' && 'dm-panel', variant === 'bare' && 'dm-bare', slim && 'dm-atr-slim', className)}>
      <div className="dm-atr-h">
        <div className="dm-atr-ht"><b>{title}</b><span className="dm-muted dm-atr-st"><span aria-live="polite"><Swap>{line}</Swap></span> · <span className="dm-num">{clock(secs)}</span></span></div>
        <span className="dm-atr-tot dm-num">{money(total(root))}</span>
      </div>
      <p className="dm-atr-detail" aria-live="polite">{detailOf(picked, byId(picked.id)?.lv ?? 0)}</p>
      <div ref={treeRef} className="dm-atr-tree" role="tree" aria-label="Agents" onKeyDown={onKey}
        onPointerLeave={() => setHot(null)}>{node(root, 0)}</div>
      {sum && <div className={cx('dm-atr-sum', sum.className)} style={sum.style as CSSProperties}><Icon name="ok" size="xs" /><span>{done}</span></div>}
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
- [Web search](https://designme.dev/components/web-search.md): The agent's searches as a trail: what it asked, what came back, what it read or skipped, and the answer with its sources.
- [Agent phases](https://designme.dev/components/agent-phases.md): One line for which phase the agent is in, from thinking to done, that stops to ask you, says when it is slow, and folds to how long it took.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Agent jobs running, up next and done, with progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.
- [Thinking states](https://designme.dev/components/thinking-states.md): Six thinking indicators to pick from, each with a status line.

All components: https://designme.dev/llms.txt
