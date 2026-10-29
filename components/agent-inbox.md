# Agent inbox

> Every run that needs you, is running or is done, in one list.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/agent-inbox

## Install

```sh
npx designme add agent-inbox          # HTML, CSS and JS, with the shared core
npx designme add agent-inbox --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Agent inbox puts every agent run in one list, grouped by what it needs from you: Needs you, Running and Done. A run waiting for you has Approve, a failed one has Retry, and the running ones have live clocks. When a run changes group it glides to its new place, so you can follow it.

### When to use it

- When several agents run at once and people need one place to see which ones are waiting for them.
- When some runs need a person's approval before they go on, like publishing a page.
- When a run can fail for a reason that a retry fixes, like a rate limit, and people should retry it from the list.
- When people want to see what finished recently, and when.

### What it does

- `runs` is the list. Each run has a `title`, the `agent` running it, a `group` of `needs`, `running` or `done`, and a `detail` line, like "Waiting for your approval" or "Editing frame 3 of 6".
- Each group shows its count, and a group with nothing in it is hidden. The line beside the title reads "2 need you", then "2 running" once nothing needs you, and "All clear · 4 done today" when every run is done.
- `onApprove` adds a filled Approve button to the runs that need you. A run with `failed` turns red and gets a white Retry button instead, through `onRetry`; `why` adds a tooltip on its detail line.
- A running run spins and its clock counts on from its `seconds`. A finished one shows a green check, when it `ended`, and its agent.
- Each row starts with the agent's first letter on its `color`.
- When a run moves to another group, every row and group title glides to its new place and the moving row rides above the rest.

### Accessibility

- Each group is a labelled `section`, and its runs form a list.
- Approve and Retry are buttons named for their run, like "Approve Publish the pricing page".
- The line beside the title is announced politely when it changes.
- With reduced motion the rows move without gliding.

## Usage in React

```tsx
import { AgentInbox } from '@/components/designme/agent-inbox/AgentInbox';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { AgentInbox, type InboxRun } from './AgentInbox';
import { useScript, useStory, useWait } from '../lib/useScript';

/* ---------- Agent inbox: approve the publish, retry the failed export, and watch both land in Done ---------- */
const COLOR: Record<string, string> = { 'Design agent': 'var(--dm-pl)', 'Build agent': 'var(--dm-pm)', 'Research agent': 'var(--dm-pt)', 'Copy agent': 'var(--dm-pp)', 'QA agent': 'var(--dm-pb)' };
const START: InboxRun[] = [
  { id: 'pub', title: 'Publish the pricing page', agent: 'Design agent', group: 'needs', detail: 'Waiting for your approval' },
  { id: 'tok', title: 'Export tokens to CSS', agent: 'Build agent', group: 'needs', failed: true, detail: 'Failed: rate limited by Figma', why: 'Figma answered 429 at 10:42. Safe to retry' },
  { id: 'cards', title: 'Rework the plan cards', agent: 'Design agent', group: 'running', detail: 'Editing frame 3 of 6', seconds: 102 },
  { id: 'cmp', title: 'Compare 3 competitor pages', agent: 'Research agent', group: 'running', detail: 'Reading page 3 of 3', seconds: 38 },
  { id: 'copy', title: 'Rewrite plan descriptions', agent: 'Copy agent', group: 'done', ended: '12m ago' },
  { id: 'aud', title: 'Audit pricing contrast', agent: 'QA agent', group: 'done', ended: '25m ago' }
].map(r => ({ ...r, color: COLOR[r.agent] }) as InboxRun);

export default function AgentInboxDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [runs, setRuns] = useState(START);
  // a run that moves goes to the top of its new group
  const move = (id: string, patch: Partial<InboxRun>) => setRuns(rs => { const r = { ...rs.find(x => x.id === id)!, ...patch }; return [r, ...rs.filter(x => x.id !== id)]; });

  // Approve starts the run and Retry tries a failed one again; either runs, then lands in Done
  const start = async (id: string, retry: boolean) => {
    move(id, { group: 'running', failed: false, seconds: 0, detail: retry ? 'Retrying the export' : 'Publishing to designme.studio/pricing' });
    await wait(retry ? 5000 : 4000);
    move(id, { group: 'done', ended: 'Just now' });
  };

  // the research run finishes on its own while you look
  useScript(async ({ wait }) => { await wait(6000); move('cmp', { group: 'done', ended: 'Just now' }); });

  // the preview's story: approve the publish, then retry the export
  useStory(ref, async ({ wait, press }) => {
    await wait(3000); press('[aria-label="Approve Publish the pricing page"]');
    await wait(2500); press('[aria-label="Retry Export tokens to CSS"]');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <AgentInbox runs={runs} onApprove={id => void start(id, false)} onRetry={id => void start(id, true)} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `runs` | `InboxRun[]` |  |
| `onApprove` (optional) | `(id: string) => void` | Adds Approve to the runs that need you and haven't failed |
| `onRetry` (optional) | `(id: string) => void` | Adds Retry to the runs that failed |
| `title` (optional) | `string` | Defaults to "Inbox" |
| `status` (optional) | `string` | The line beside the title. Defaults to "2 need you", then "2 running" once nothing needs you, then "All clear · 4 done today" |
| `className` (optional) | `string` |  |

## Questions

**Does Approve start the run?**

No. It calls `onApprove` with the run's id. Start the run in your own code and move it to `running`, then to `done` when it ends.

**Where does a moved run go in its group?**

Wherever it sits in `runs`. The demo puts a moved run first, so the latest change is at the top.

**Do the clocks need updating every second?**

No. Pass the `seconds` a run has been going and its clock counts on by itself. Pass a new value and it counts on from that.

**Can I name the groups differently?**

Not yet. The groups are Needs you, Running and Done; `title` and `status` change the header.

## Source

`AgentInbox.tsx`, as `npx designme add agent-inbox --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useIsoLayoutEffect, useReducedMotion, useSeconds } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Spin, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './agent-inbox.css';

export type InboxGroup = 'needs' | 'running' | 'done';

export interface InboxRun {
  id: string;
  /** What the run is for, like "Publish the pricing page" */
  title: string;
  /** Which agent runs it. Its first letter marks the row, and a finished run shows it under the title */
  agent: string;
  /** The mark's colour, like 'var(--dm-pl)'. Defaults to the accent */
  color?: string;
  group: InboxGroup;
  /** The line under the title: why it needs you, or what it is doing now. A finished run shows its agent instead */
  detail?: string;
  /** Marks a run that needs you because it failed: its row turns red and offers Retry instead of Approve */
  failed?: boolean;
  /** More on the failure, in a tooltip on its detail line */
  why?: string;
  /** How long a running run has been going, in seconds. Its clock counts on from here */
  seconds?: number;
  /** When a finished run ended, like "12m ago" */
  ended?: string;
}

export interface AgentInboxProps {
  runs: InboxRun[];
  /** Adds Approve to the runs that need you and haven't failed */
  onApprove?: (id: string) => void;
  /** Adds Retry to the runs that failed */
  onRetry?: (id: string) => void;
  /** Defaults to "Inbox" */
  title?: string;
  /** The line beside the title. Defaults to "2 need you", then "2 running" once nothing needs you, then "All clear · 4 done today" */
  status?: string;
  className?: string;
}

const GROUPS: [InboxGroup, string][] = [['needs', 'Needs you'], ['running', 'Running'], ['done', 'Done']];
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Every agent run in one list, grouped as Needs you, Running and Done, with live clocks on the running ones. Approve
    starts a run that waits for you and Retry tries a failed one again; a run that changes group glides to its place. */
export function AgentInbox({ runs, onApprove, onRetry, title = 'Inbox', status, className }: AgentInboxProps) {
  const reduce = useReducedMotion();
  const list = useRef<HTMLDivElement>(null);
  // what changes after the first render plays its entrance; what is there from the start just appears
  const ready = useRef(false);
  useEffect(() => { ready.current = true; }, []);
  // one tick a second drives every running clock: each counts on from the seconds it had when it was last given
  const tick = useSeconds(runs.some(r => r.group === 'running'));
  const base = useRef(new Map<string, { s: number; at: number }>());
  const secs = (r: InboxRun) => {
    const b = base.current.get(r.id), s = r.seconds ?? 0;
    if (!b || b.s !== s) { base.current.set(r.id, { s, at: tick }); return s; }
    return b.s + tick - b.at;
  };
  for (const id of [...base.current.keys()]) if (!runs.some(r => r.id === id && r.group === 'running')) base.current.delete(id);

  const need = runs.filter(r => r.group === 'needs').length, running = runs.filter(r => r.group === 'running').length, done = runs.filter(r => r.group === 'done').length;
  const line = status ?? (need ? `${need} need${need > 1 ? '' : 's'} you` : running ? `${running} running` : `All clear · ${done} done today`);

  // a run that changes group glides there: rows and group titles are measured after each move and eased from where
  // they were, the moving row rides above the rest, and a group that comes back fades in
  const where = useRef(new Map<string, number>());
  const groupOf = useRef(new Map<string, InboxGroup>());
  const sig = runs.map(r => r.id + ':' + r.group).join();
  useIsoLayoutEffect(() => {
    const box = list.current; if (!box) return;
    const top = box.getBoundingClientRect().top, next = new Map<string, number>();
    box.querySelectorAll<HTMLElement>('[data-k]').forEach(el => {
      const k = el.dataset.k!, y = el.getBoundingClientRect().top - top, was = where.current.get(k);
      next.set(k, y);
      if (reduce || !where.current.size) return;
      if (was === undefined) { el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260 }); return; }
      if (Math.abs(was - y) > 1) el.animate([{ transform: `translateY(${was - y}px)` }, { transform: 'none' }], { duration: 420, easing: getComputedStyle(box).getPropertyValue('--dm-ease').trim() || 'ease' });
      const moved = groupOf.current.get(k), now = runs.find(r => r.id === k)?.group;
      if (moved && now && moved !== now) { el.classList.add('dm-mv'); setTimeout(() => el.classList.remove('dm-mv'), 440); }
    });
    where.current = next;
    groupOf.current = new Map(runs.map(r => [r.id, r.group]));
  }, [sig]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div data-dm="" className={cx('dm-aib dm-panel', className)}>
      <div className="dm-aib-h"><b>{title}</b><span aria-live="polite"><Swap className="dm-muted dm-aib-st">{line}</Swap></span></div>
      <div ref={list}>
        {GROUPS.map(([g, name]) => {
          const rows = runs.filter(r => r.group === g);
          // a group with nothing in it goes away
          if (!rows.length) return null;
          return (
            <section key={g} className="dm-aib-g" aria-label={name}>
              <div className="dm-aib-gh" data-k={'h:' + g}><span>{name}</span><span className="dm-n">{rows.length}</span></div>
              <div className="dm-aib-gl" role="list">
                {rows.map(r => {
                  const col = r.color ?? 'var(--dm-accent)', fail = g === 'needs' && !!r.failed;
                  const detail = g === 'done' ? r.agent : r.detail ?? '';
                  return (
                    <div key={r.id} data-k={r.id} className={cx('dm-aib-i', fail && 'dm-fail')} role="listitem">
                      <span className="dm-aib-av" style={{ color: col, background: `color-mix(in srgb,${col} 13%,transparent)` }} aria-hidden="true">{r.agent.charAt(0)}</span>
                      <span className="dm-aib-t">
                        <b>{r.title}</b>
                        {fail && r.why ? <Tip label={r.why}><span><Swap>{detail}</Swap></span></Tip> : <Swap>{detail}</Swap>}
                      </span>
                      <Right key={g + (fail ? '!' : '')} run={r} group={g} fail={fail} secs={g === 'running' ? secs(r) : 0} fresh={ready.current} onApprove={onApprove} onRetry={onRetry} />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Right({ run, group, fail, secs, fresh, onApprove, onRetry }: { run: InboxRun; group: InboxGroup; fail: boolean; secs: number; fresh: boolean; onApprove?: (id: string) => void; onRetry?: (id: string) => void }) {
  // it plays its entrance when it mounts after the first render, as a run changes group, and not again on each clock tick
  const [e] = useState(() => fresh ? enter() : undefined);
  let body = null;
  if (group === 'needs') {
    if (fail && onRetry) body = <button type="button" className="dm-pill dm-sm dm-aib-go" aria-label={`Retry ${run.title}`} onClick={() => onRetry(run.id)}><Icon name="refresh" size="xs" />Retry</button>;
    else if (!fail && onApprove) body = <button type="button" className="dm-pill dm-primary dm-sm dm-aib-go" aria-label={`Approve ${run.title}`} onClick={() => onApprove(run.id)}>Approve</button>;
  } else if (group === 'running') body = <><Spin /><span className="dm-num">{clock(secs)}</span></>;
  else body = <><span className="dm-ok"><Icon name="ok" size="xs" /></span><span>{run.ended}</span></>;
  return <span className={cx('dm-aib-r', e?.className)} style={e?.style}>{body}</span>;
}
```

## More in Agent status

- [Thinking](https://designme.dev/components/thinking.md): The live trace, written as the agent works, then folded away.
- [Reasoning trail](https://designme.dev/components/reasoning-trail.md): The agent's plan, notes, sources and edits, after it thinks.
- [Agent lanes](https://designme.dev/components/agent-lanes.md): Several agents working in parallel, each with its own lane and hand-offs.
- [Agent tree](https://designme.dev/components/agent-tree.md): An orchestrator and its sub-agents, with cost rolled up per branch.
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
