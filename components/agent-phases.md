# Agent phases

> One line for which phase the agent is in, from thinking to done, that stops to ask you, says when it is slow, and folds to how long it took.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/agent-phases

## Install

```sh
npx designme add agent-phases          # HTML, CSS and JS, with the shared core
npx designme add agent-phases --react  # React 19 component and its CSS
npx designme add agent-phases --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/agent-phases.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/agent-phases.json  # Astro
```

## About

One line that says which phase the agent is in: Thinking, Searching, Reading, Waiting for you, Writing and Done, each with its own glyph, over a track of six segments that fill phase by phase. When the agent needs a decision it stops the clock and asks, with Approve and Not now; when a phase runs long it says it is still working and offers Stop; when a step fails the line turns red and offers Retry. Once done it reads "Thought for 12s" and opens to the time each phase took.

### When to use it

- Above an agent's reply, when people only need to know what stage it is at rather than every step.
- When the agent can stop to ask for approval in the middle of its work.
- Where the detailed trace (Thinking or Reasoning trail) would be too much, as a lighter companion to them.

### What it does

- Six phases, each with a glyph: turning dots, a radar, a page, a hand, a pen and a check. The phase's words shimmer while it lasts.
- A track of six short segments: done phases fill in the accent, the phase in hand breathes, and the whole track turns green once done.
- A timer that counts seconds by itself (or takes `seconds`) and pauses while it waits for you.
- `ask`: in the waiting phase a tinted box asks the question, with Approve (primary) and Not now.
- `slow`: a quiet line with a clock, "Still working…", and Stop when `onStop` is set.
- `error`: the glyph and the line turn red, with the detail and Retry under it.
- Done: the line reads "Thought for 12s" and becomes a button that opens the list of phases with the time each took (`took`).

### Accessibility

- A role="status" region announces each change of phase (and an error, and Done with the time), never every second.
- Once done the line is a button with aria-expanded; before that it is marked aria-disabled.
- Approve, Not now, Stop and Retry are real buttons, reached with Tab.
- With reduced motion the turning dots, the radar and the breathing segment stand still.

## Usage in React

```tsx
import { AgentPhases } from '@/components/designme/agent-phases/AgentPhases';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: the search times out and is retried, reading is
// slow, the agent asks before offering a refund, and the finished line opens to the phases.
import { useEffect, useRef, useState } from 'react';
import { AgentPhases, type AgentPhase } from './AgentPhases';
import { useStory, useWait } from '../lib/useScript';

export default function AgentPhasesDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [phase, setPhase] = useState<AgentPhase>('thinking');
  const [label, setLabel] = useState<string | undefined>('Thinking about the question');
  const [failed, setFailed] = useState(false);
  const [slow, setSlow] = useState(false);
  const [open, setOpen] = useState(false);
  const [took, setTook] = useState<Partial<Record<AgentPhase, number>>>({});
  const answer = useRef<((v: boolean) => void) | null>(null);
  const until = (f: (done: (v: boolean) => void) => void) => new Promise<boolean>(res => f(res));
  // the agent's work, which goes on whatever the visitor does; it waits for a person only to retry and to approve
  useEffect(() => { void (async () => {
    await wait(1600); setTook({ thinking: 2 });
    setPhase('searching'); setLabel('Searching the help centre'); await wait(1300);
    setFailed(true); await until(res => { answer.current = res; }); setFailed(false);
    setLabel('Searching the help centre again'); await wait(1200); setTook(t => ({ ...t, searching: 4 }));
    setPhase('reading'); setLabel('Reading 3 articles'); await wait(1800); setSlow(true); await wait(2200); setSlow(false); setTook(t => ({ ...t, reading: 4 }));
    setPhase('waiting'); setLabel(undefined);
    const ok = await until(res => { answer.current = res; });
    setTook(t => ({ ...t, waiting: 2 }));
    setPhase('writing'); setLabel(ok ? 'Writing the reply with the refund' : 'Writing the reply without a refund'); await wait(2000); setTook(t => ({ ...t, writing: 2 }));
    setPhase('done'); setLabel(undefined);
  })(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const reply = (v: boolean) => { const f = answer.current; answer.current = null; f?.(v); };
  // the person in the preview: retry, approve, then open the finished line
  useStory(ref, async ({ wait, press }) => {
    await wait(4400); press('.dm-aph-n .dm-pill');
    await wait(9000); press('.dm-aph-n .dm-primary');
    await wait(3500); press('.dm-aph-h');
  }, { hold: false });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <AgentPhases phase={phase} label={label} took={took} open={open} onOpenChange={setOpen}
        error={failed ? { text: 'The search timed out', detail: "The help centre didn't answer in 10s", onRetry: () => reply(true) } : undefined}
        slow={slow ? { text: 'Still working, the refund policy is a long page' } : undefined}
        ask={{ text: 'Offer Maya a refund of $48?', onApprove: () => reply(true), onDecline: () => reply(false) }} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `phase` | `AgentPhase` |  |
| `label` (optional) | `string` | What the line says, like "Reading 3 articles". Defaults to the phase's name; once done, "Thought for 12s" |
| `seconds` (optional) | `number` | Seconds so far. Counts by itself while left out (and stops while waiting for you) |
| `error` (optional) | `{ text: string; detail?: string; onRetry: () => void }` | A step that failed: the line turns red and says so, with Retry |
| `slow` (optional) | `{ text: string; onStop?: () => void }` | Shown while the phase takes long: "Still working…", with Stop |
| `ask` (optional) | `{ text: ReactNode; approveLabel?: string; onApprove: () => void; onDecline?: () => void }` | What the agent waits for in the waiting phase, with Approve and Not now |
| `took` (optional) | `Partial<Record<AgentPhase, number>>` | Seconds each phase took, by phase, for the list a finished line opens to |
| `open` (optional) | `boolean` |  |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import AgentPhases from '../components/designme/agent-phases/AgentPhases.astro';
---
<AgentPhases />
<AgentPhases data-style="soft" class="my-class" />
```
It plays its demo; change `agent-phases.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How is this different from Thinking?**

Thinking lists each step the agent takes and what it found. Agent phases says only which of six phases it is in, in one line, and handles the moments it needs you.

**Can I skip a phase?**

Yes. Move `phase` straight to the next one you need; the track fills up to it. Leave a phase out of `took` and it is left out of the finished list.

**When should I show the slow line?**

Whenever your agent decides a phase is taking long, for example after twice its usual time. Pass `slow` then, and clear it when the phase moves on.

## Source

`AgentPhases.tsx`, as `npx designme add agent-phases --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useSeconds } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Fold, Radar, Swap, Think } from '../lib/motion';
import '../designme.css';
import './agent-phases.css';

export type AgentPhase = 'thinking' | 'searching' | 'reading' | 'waiting' | 'writing' | 'done';

export interface AgentPhasesProps {
  phase: AgentPhase;
  /** What the line says, like "Reading 3 articles". Defaults to the phase's name; once done, "Thought for 12s" */
  label?: string;
  /** Seconds so far. Counts by itself while left out (and stops while waiting for you) */
  seconds?: number;
  /** A step that failed: the line turns red and says so, with Retry */
  error?: { text: string; detail?: string; onRetry: () => void };
  /** Shown while the phase takes long: "Still working…", with Stop */
  slow?: { text: string; onStop?: () => void };
  /** What the agent waits for in the waiting phase, with Approve and Not now */
  ask?: { text: ReactNode; approveLabel?: string; onApprove: () => void; onDecline?: () => void };
  /** Seconds each phase took, by phase, for the list a finished line opens to */
  took?: Partial<Record<AgentPhase, number>>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const ORDER: AgentPhase[] = ['thinking', 'searching', 'reading', 'waiting', 'writing', 'done'];
const NAME: Record<AgentPhase, string> = { thinking: 'Thinking', searching: 'Searching', reading: 'Reading', waiting: 'Waiting for you', writing: 'Writing', done: 'Done' };
const KEY: Record<AgentPhase, string> = { thinking: 'think', searching: 'search', reading: 'read', waiting: 'wait', writing: 'write', done: 'done' };

/** One line for which phase the agent is in, from thinking to done: it stops to ask you, says when it is slow or failed, and folds to how long it took. */
export function AgentPhases({ phase, label, seconds, error, slow, ask, took = {}, open, defaultOpen = false, onOpenChange, className }: AgentPhasesProps) {
  const counted = useSeconds(seconds === undefined && phase !== 'done' && phase !== 'waiting');
  const secs = seconds ?? counted;
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const at = ORDER.indexOf(phase), done = phase === 'done';
  const p = error ? 'err' : KEY[phase];
  const line = error ? error.text : label ?? (done ? `Thought for ${secs}s` : NAME[phase]);
  const glyph = error ? <Icon name="alert" /> : { thinking: <Think />, searching: <Radar />, reading: <Icon name="file-text" />, waiting: <Icon name="hand" />, writing: <Icon name="edit" />, done: <Icon name="ok" /> }[phase];
  // only a change of phase is announced
  const [said, setSaid] = useState('');
  const last = useRef('');
  useEffect(() => { const t = error ? 'Error: ' + error.text : done ? `Done, thought for ${secs}s` : NAME[phase]; if (t !== last.current) { last.current = t; setSaid(t); } }, [phase, !!error]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div data-dm="" data-p={p} className={cx('dm-aph', className)}>
      <button type="button" className="dm-aph-h" aria-expanded={done && isOpen} aria-disabled={!done || undefined} onClick={() => { if (done) setOpen(!isOpen); }}>
        <span className="dm-aph-g" key={p}><span className="dm-enter" style={{ display: 'grid' }}>{glyph}</span></span>
        <Swap className={cx('dm-aph-l', !done && !error && phase !== 'waiting' && 'dm-shim')}>{line}</Swap>
        <span className="dm-aph-t dm-num">{done ? '' : secs + 's'}</span>
        <Icon name="chev-d" size="xs" className="dm-aph-chev" />
      </button>
      <div className="dm-aph-tr" aria-hidden="true">{ORDER.map((ph, j) => <i key={ph} className={cx(j === at && !done && 'dm-now')}>{j <= at && <b />}</i>)}</div>
      <div className="dm-aph-x">
        {error ? <div className="dm-aph-n dm-err dm-enter"><Icon name="alert" size="xs" /><span>{error.detail ?? error.text}</span><button type="button" className="dm-pill dm-line dm-sm" onClick={error.onRetry}><Icon name="refresh" size="xs" />Retry</button></div>
          : phase === 'waiting' && ask ? <div className="dm-aph-n dm-ask dm-enter"><span>{ask.text}</span><button type="button" className="dm-pill dm-primary dm-sm" onClick={ask.onApprove}>{ask.approveLabel ?? 'Approve'}</button>{ask.onDecline && <button type="button" className="dm-pill dm-ghost dm-sm" onClick={ask.onDecline}>Not now</button>}</div>
          : slow && !done ? <div className="dm-aph-n dm-enter"><Icon name="clock" size="xs" /><span>{slow.text}</span>{slow.onStop && <button type="button" className="dm-pill dm-line dm-sm" onClick={slow.onStop}><Icon name="stop" size="xs" />Stop</button>}</div> : null}
      </div>
      <Fold open={done && isOpen}>
        <ol className="dm-aph-list">{ORDER.slice(0, 5).filter(ph => took[ph] !== undefined).map(ph => <li key={ph}><Icon name="check" size="xs" /><span>{NAME[ph]}</span><span className="dm-num">{took[ph]}s</span></li>)}</ol>
      </Fold>
      <p className="dm-aph-sr" role="status">{said}</p>
    </div>
  );
}
```

## More in Agent status

- [Thinking](https://designme.dev/components/thinking.md): The live trace, written as the agent works, then folded away.
- [Reasoning trail](https://designme.dev/components/reasoning-trail.md): The agent's plan, notes, sources and edits, after it thinks.
- [Agent lanes](https://designme.dev/components/agent-lanes.md): Several agents working in parallel, each with its own lane and hand-offs.
- [Agent tree](https://designme.dev/components/agent-tree.md): An orchestrator and the sub-agents it spawns, with the active path and cost rolled up.
- [Agent inbox](https://designme.dev/components/agent-inbox.md): Every run that needs you, is running or is done, in one list.
- [Trace view](https://designme.dev/components/trace-view.md): One agent run as a waterfall of spans, with latency and tokens.
- [Browser session](https://designme.dev/components/browser-session.md): The agent browsing for you, step by step, with Pause and Take over.
- [Web search](https://designme.dev/components/web-search.md): The agent's searches as a trail: what it asked, what came back, what it read or skipped, and the answer with its sources.
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
