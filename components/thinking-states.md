# Thinking states

> Six thinking indicators to pick from, each with a status line.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/thinking-states

## Install

```sh
npx designme add thinking-states          # HTML, CSS and JS, with the shared core
npx designme add thinking-states --react  # React 19 component and its CSS
npx designme add thinking-states --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/thinking-states.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/thinking-states.json  # Astro
```

## About

Thinking states is a set of six indicators for the moment an agent is thinking, to pick from: Orbit, Morph, Scan, Stream, Matrix and Stack. Each pairs a small animated mark on a tile with one status line, like "Reading 3 files", that steps through what the agent is doing, and a quiet count of the seconds so far.

### When to use it

- While an agent works out an answer and there is nothing to show yet, in a chat thread or beside a panel.
- When you want one line that says what the agent is doing now, not a full trace of every step.
- When your product needs a thinking indicator of its own: pick the mark that suits it, from calm (Morph) to busy (Matrix).
- When the answer will be text, use Scan or Stream, whose lines of dots and typed line hint at what is coming.

### What it does

- `variant` picks the indicator. Five of them are grids of dots, each at its own density: `orbit` (5 by 5, a light running round the edge with a fading tail and a dot breathing in the middle, the line shimmering), `morph` (7 by 7, the dots drawing a rectangle, then a circle, then a triangle), `scan` (6 by 6, a column of light sweeping three lines of text in dots), `stream` (three lines of four dots, the same size as Matrix, that light up one by one, line by line, then fade out together, the line typed out behind a caret), `matrix` (a four by four grid of dots, each lighting up on its own beat) or `stack` (pages shuffling to the front).
- Pass `steps`, a list of status lines. Leave `current` out and they take turns every `interval` milliseconds (2600 by default), or set `current` to show the step your agent reports.
- A new line crossfades in, except in Stream, where it types out a letter at a time.
- `seconds` shows the time so far at the end of the line. Left out, it counts by itself; `false` hides it.
- Marks use the accent and everything else stays grey. In Soft the tile and marks are squircles; in Blueprint the tile is square with a hairline edge, marks tick in steps, Stream's caret is a block.
- On designme.dev the switch under the demo picks the variant, and the HTML install ships both the switch and every variant.

### Accessibility

- The status line is read from a polite live region (`role="status"`), so a screen reader hears each new step once, never each frame or each typed letter.
- The marks, the visible line and the seconds are hidden from screen readers, so nothing is read twice.
- With reduced motion turned on, every mark holds still in a pose that still reads (Matrix shows a lit pattern, Stack its three pages), the caret stays lit, the sweep goes and the line changes without typing or fading.

## Usage in React

```tsx
import { ThinkingStates } from '@/components/designme/thinking-states/ThinkingStates';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { ThinkingStates, type ThinkingVariant } from './ThinkingStates';
import { Seg } from '../lib/motion';
import { Demo } from '../lib/Demo';
import { useScript } from '../lib/useScript';

/* ---------- Thinking states: the agent's steps taking turns, the clock starting again with each new question ---------- */
const STEPS = ['Thinking', 'Reading 3 files', 'Searching the docs', 'Comparing 2 options', 'Drafting the answer'];
export default function ThinkingStatesDemo() {
  const [variant, setVariant] = useState<ThinkingVariant>('orbit');
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(0);
  useScript(async ({ wait }) => {
    for (;;) {
      setSeconds(0);
      for (let i = 0; i < STEPS.length; i++) { setCurrent(i); for (let t = 0; t < 26; t++) { await wait(100); if (t % 10 === 9) setSeconds(s => s + 1); } }
    }
  });
  return (
    <Demo switcher={<Seg label="Thinking state" value={variant} onChange={setVariant} options={[{ value: 'orbit', label: 'Orbit' }, { value: 'morph', label: 'Morph' }, { value: 'scan', label: 'Scan' }, { value: 'stream', label: 'Stream' }, { value: 'matrix', label: 'Matrix' }, { value: 'stack', label: 'Stack' }]} />}>
      <ThinkingStates variant={variant} steps={STEPS} current={current} seconds={seconds} />
    </Demo>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `variant` (optional) | `ThinkingVariant` | Which indicator: dots circling a core, a shape that morphs, a line scanning skeleton text, tokens with a typed line, a twinkling dot grid or shuffling pages |
| `steps` (optional) | `string[]` | The status lines, like "Reading 3 files". With more than one, they take turns every `interval` unless `current` is set |
| `current` (optional) | `number` | Index of the line to show. Leave it out to let the lines take turns by themselves |
| `interval` (optional) | `number` | Milliseconds each line shows for when they take turns by themselves |
| `seconds` (optional) | `number \| false` | Seconds shown at the end of the line. Counts by itself when left out; false hides it |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ThinkingStates from '../components/designme/thinking-states/ThinkingStates.astro';
---
<ThinkingStates />
<ThinkingStates data-style="soft" class="my-class" />
```
It plays its demo; change `thinking-states.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I show the step my agent is on?**

Pass your steps and set `current` to the index of the step the agent reports. Without `current`, the lines take turns by themselves every `interval` milliseconds.

**Which variant should I use?**

Orbit and Morph are calm and work anywhere. Scan and Stream suit answers that will be text. Matrix reads as busy computing, and Stack as reading files or sources.

**Can I hide the timer?**

Yes. Pass `seconds={false}`. Pass a number to show your own time instead of the count the component keeps.

## Source

`ThinkingStates.tsx`, as `npx designme add thinking-states --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useReducedMotion, useSeconds } from '../lib/hooks';
import { Swap } from '../lib/motion';
import '../designme.css';
import './thinking-states.css';

export type ThinkingVariant = 'orbit' | 'morph' | 'scan' | 'stream' | 'matrix' | 'stack';

export interface ThinkingStatesProps {
  /** Which indicator: dots circling a core, a shape that morphs, a line scanning skeleton text, tokens with a typed line,
      a twinkling dot grid or shuffling pages */
  variant?: ThinkingVariant;
  /** The status lines, like "Reading 3 files". With more than one, they take turns every `interval` unless `current` is set */
  steps?: string[];
  /** Index of the line to show. Leave it out to let the lines take turns by themselves */
  current?: number;
  /** Milliseconds each line shows for when they take turns by themselves */
  interval?: number;
  /** Seconds shown at the end of the line. Counts by itself when left out; false hides it */
  seconds?: number | false;
  className?: string;
}

type GridKind = 'orbit' | 'morph' | 'scan' | 'stream';
/* Orbit, Morph, Scan and Stream are drawn on a grid of dots, each at its own density (Orbit 5 by 5, Scan 6 by 6, Morph 7 by 7,
   Stream 4 by 3, the size of Matrix): which part each dot plays, and its place in the run as an animation delay */
const grid = (k: GridKind) => {
  const n = { orbit: 5, scan: 6, morph: 7, stream: 4 }[k], rows = k === 'stream' ? 3 : n, at = (x: number, y: number) => y * n + x;
  const cls: string[] = Array(n * rows).fill(''), dly: (number | null)[] = Array(n * rows).fill(null), pose = new Set<number>();
  const run = (order: number[], dur: number) => order.forEach((c, i) => { dly[c] = (i / order.length - 1) * dur; });
  if (k === 'orbit') {
    const ring: number[] = [];
    for (let x = 0; x < n; x++) ring.push(at(x, 0));
    for (let y = 1; y < n; y++) ring.push(at(n - 1, y));
    for (let x = n - 2; x >= 0; x--) ring.push(at(x, n - 1));
    for (let y = n - 2; y > 0; y--) ring.push(at(0, y));
    ring.forEach(c => { cls[c] = 'r'; }); run(ring, 1.6); cls[at(2, 2)] = 'c';
    [0, ring.length - 1, ring.length - 2].forEach(i => pose.add(ring[i]));
  } else if (k === 'scan') {
    const len = [6, 0, 5, 0, 3, 0];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const c = at(x, y); cls[c] = x < len[y] ? 'l' : 'b'; dly[c] = (x / n - 1) * 1.6; if (x === 2) pose.add(c); }
  } else if (k === 'morph') {
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const rect = y >= 1 && y <= 5, circ = (x - 3) ** 2 + (y - 3) ** 2 <= 10, tri = Math.abs(x - 3) <= y / 2;
      const c = at(x, y); cls[c] = 'm' + ((rect ? 1 : 0) | (circ ? 2 : 0) | (tri ? 4 : 0)); if (circ) pose.add(c);
      dly[c] = -(((c * 37 + 11) % 17) / 17) * .32;
    }
  } else {
    for (let y = 0; y < rows; y++) for (let x = 0; x < n; x++) { const c = at(x, y); cls[c] = 's' + c; if (y < 2) pose.add(c); }
  }
  return cls.map((x, c) => ({ cls: [x, pose.has(c) && 'p'].filter(Boolean).map(y => 'dm-' + y).join(' '), delay: dly[c] }));
};
const GRIDS = { orbit: grid('orbit'), morph: grid('morph'), scan: grid('scan'), stream: grid('stream') };
const Dots = ({ k }: { k: GridKind }) => (
  <span className="dm-ths-dg" data-k={k}>{GRIDS[k].map((d, i) => <i key={i} className={d.cls} style={d.delay != null ? { animationDelay: d.delay.toFixed(3) + 's' } : undefined} />)}</span>
);

const Mark = ({ variant }: { variant: ThinkingVariant }) => {
  switch (variant) {
    case 'morph': case 'scan': case 'stream': return <Dots k={variant} />;
    case 'matrix': return <span className="dm-ths-mtx">{Array.from({ length: 16 }, (_, i) => <i key={i} />)}</span>;
    case 'stack': return <span className="dm-ths-stk"><i /><i /><i /></span>;
    default: return <Dots k="orbit" />;
  }
};

/** Six thinking indicators to pick from, each a small mark beside a status line that steps through what the agent is doing. */
export function ThinkingStates({ variant = 'orbit', steps = ['Thinking'], current, interval = 2600, seconds, className }: ThinkingStatesProps) {
  const reduce = useReducedMotion();
  const [auto, setAuto] = useState(0);
  useEffect(() => {
    if (current !== undefined || steps.length < 2) return;
    const id = setInterval(() => setAuto(i => (i + 1) % steps.length), interval);
    return () => clearInterval(id);
  }, [current, steps.length, interval]);
  const text = steps[Math.max(0, Math.min(current ?? auto, steps.length - 1))] ?? '';
  const counted = useSeconds(seconds === undefined);
  const secs = seconds === false ? null : seconds ?? counted;
  // Stream types each new line out behind its caret; switching to Stream mid-line shows the line whole
  const stream = variant === 'stream';
  const [typed, setTyped] = useState(text.length);
  const last = useRef(text);
  useEffect(() => {
    const fresh = last.current !== text; last.current = text;
    if (!stream || reduce || !fresh) { setTyped(text.length); return; }
    let n = 0; setTyped(0);
    const id = setInterval(() => { n++; setTyped(n); if (n >= text.length) clearInterval(id); }, 32);
    return () => clearInterval(id);
  }, [text, stream, reduce]);
  return (
    <div data-dm="" data-v={variant} className={cx('dm-ths', className)}>
      <div className="dm-ths-row">
        <span className="dm-ths-mk" aria-hidden="true"><Mark variant={variant} /></span>
        <span className="dm-ths-l" aria-hidden="true">
          {stream ? <span className="dm-ths-tx">{text.slice(0, typed)}</span> : <Swap className={cx('dm-ths-tx', variant === 'orbit' && 'dm-shim')}>{text}</Swap>}
          {stream && <span className="dm-ths-car" />}
        </span>
        {secs !== null && <span className="dm-ths-t dm-num" aria-hidden="true">{secs}s</span>}
      </div>
      {/* a screen reader hears each new line once, never the letters as they type */}
      <span className="dm-ths-sr" role="status" aria-live="polite">{text}</span>
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

All components: https://designme.dev/llms.txt
