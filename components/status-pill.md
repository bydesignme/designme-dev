# Status pill

> One live line for what the agent is doing right now.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/status-pill

## Install

```sh
npx designme add status-pill          # HTML, CSS and JS, with the shared core
npx designme add status-pill --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Status pill is a single line that tells people what the agent is doing right now, such as thinking, reading files or waiting for approval. It fades between states and resizes to fit the new text, and it can hold a button for the moment the agent needs a person.

### When to use it

- When people need a glanceable signal of the agent's current step, in a header, a chat footer or over a canvas.
- When the agent pauses for approval and you want a Review button right where people are already looking.
- When a task reports small counts like "2 of 4" that tick over without restarting the line.
- When you want a slim progress track under the status in a wider bar.

### What it does

- Six states: `idle`, `thinking`, `reading`, `working`, `waiting` and `done`, each with its own glyph and colour.
- The label shimmers while the state is thinking, reading or working.
- A new `state`, `label`, `file` or `action` fades the old line out before the new one comes in. Changing only `meta` or `progress` updates at once.
- `file` adds a chip with a type badge, like TSX or PDF. `action` adds a button that calls your `onClick`.
- `variant="bar"` makes it taller with a `progress` track (0 to 100) along the bottom. Switching variants morphs in steps so text and shape never move together.
- The width is measured from the content, so the pill always hugs its text.

### Accessibility

- The pill is an `aria-live="polite"` region, so each new status is read out.
- The state glyphs are marked `aria-hidden`, so screen readers hear the label text, not the animation.
- With reduced motion turned on, the fade and the pill-to-bar morph happen at once, and the shimmer is removed.

## Usage in React

```tsx
import { StatusPill } from '@/components/designme/status-pill/StatusPill';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { StatusPill, type StatusPillProps } from './StatusPill';
import { Seg } from '../lib/motion';
import { Demo } from '../lib/Demo';
import { useScript } from '../lib/useScript';

/* ---------- Status pill: an agent run from thinking to done, waiting for Review on the way ---------- */
export default function StatusPillDemo() {
  const [variant, setVariant] = useState<'pill' | 'bar'>('pill');
  const [p, setP] = useState<StatusPillProps>({ state: 'idle', label: 'Ready for a task' });
  useScript(async ({ wait }) => {
    for (;;) {
      await wait(1100);
      setP({ state: 'thinking', label: 'Thinking', progress: 8 }); await wait(1800);
      setP({ state: 'reading', label: 'Reading Figma frames', meta: '1 of 4', progress: 22 }); await wait(400);
      for (let i = 2; i <= 4; i++) { await wait(650); setP({ state: 'reading', label: 'Reading Figma frames', meta: `${i} of 4`, progress: 22 + i * 8 }); }
      await wait(700);
      setP({ state: 'working', label: 'Editing', file: { name: 'PricingCard.tsx', type: 'tsx' }, progress: 64 }); await wait(2000);
      // waits for Review, and carries on by itself after a while so the loop never stalls
      await new Promise<void>(res => { setP({ state: 'waiting', label: 'Waiting for your approval', action: { label: 'Review', onClick: res }, progress: 72 }); wait(8000).then(res); });
      setP({ state: 'working', label: 'Applying 4 changes', progress: 88 }); await wait(1600);
      setP({ state: 'done', label: 'Done', meta: '4 files changed · 18s', progress: 100 }); await wait(3200);
      setP({ state: 'idle', label: 'Ready for a task', progress: 0 });
    }
  });
  return (
    <Demo switcher={<Seg label="Variant" value={variant} onChange={setVariant} options={[{ value: 'pill', label: 'Pill' }, { value: 'bar', label: 'Bar' }]} />}>
      <StatusPill {...p} variant={variant} />
    </Demo>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `state` (optional) | `StatusPillState` | Picks the glyph and colour. thinking, reading and working shimmer while they run |
| `label` | `string` | What the agent is doing, in a few words |
| `meta` (optional) | `string` | Quiet detail after the label, like "2 of 4". Changing only this does not restart the pill |
| `file` (optional) | `{ name: string; type?: string }` | A file chip after the label, like { name: 'PricingCard.tsx', type: 'tsx' } |
| `action` (optional) | `{ label: string; onClick: () => void }` | A button at the end, for when the agent needs the person |
| `progress` (optional) | `number` | 0 to 100, drawn as a track along the bottom of the bar variant |
| `variant` (optional) | `'pill' \| 'bar'` | pill hugs its content, bar is taller and leaves room for the progress track |
| `className` (optional) | `string` |  |

## Questions

**How do I update a counter like "2 of 4" without the pill flashing?**

Put the count in `meta` and keep `state` and `label` the same. Only changes to state, label, file or the action label trigger the fade.

**Can the agent wait for approval before it continues?**

Yes. Set `state="waiting"` with an `action` such as `{ label: 'Review', onClick }`, and resume the agent from that handler. The demo does exactly this.

**Why doesn't my progress show up?**

The progress track belongs to the bar variant. Pass `variant="bar"` together with `progress` from 0 to 100; values outside that range are clamped.

## Source

`StatusPill.tsx`, as `npx designme add status-pill --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Dot, Radar, Spin, Think } from '../lib/motion';
import '../designme.css';
import './status-pill.css';

export type StatusPillState = 'idle' | 'thinking' | 'reading' | 'working' | 'waiting' | 'done';

export interface StatusPillProps {
  /** Picks the glyph and colour. thinking, reading and working shimmer while they run */
  state?: StatusPillState;
  /** What the agent is doing, in a few words */
  label: string;
  /** Quiet detail after the label, like "2 of 4". Changing only this does not restart the pill */
  meta?: string;
  /** A file chip after the label, like { name: 'PricingCard.tsx', type: 'tsx' } */
  file?: { name: string; type?: string };
  /** A button at the end, for when the agent needs the person */
  action?: { label: string; onClick: () => void };
  /** 0 to 100, drawn as a track along the bottom of the bar variant */
  progress?: number;
  /** pill hugs its content, bar is taller and leaves room for the progress track */
  variant?: 'pill' | 'bar';
  className?: string;
}

const LIVE: StatusPillState[] = ['thinking', 'reading', 'working'];
const FT: Record<string, string> = { tsx: 'dm-re', jsx: 'dm-re', csv: 'dm-csv', pdf: 'dm-pdf', fig: 'dm-fg' };

function Glyph({ state }: { state: StatusPillState }) {
  if (state === 'thinking') return <span className="dm-g" style={{ color: 'var(--dm-fg)' }}><Think /></span>;
  if (state === 'reading') return <span className="dm-g" style={{ color: 'var(--dm-fg)' }}><Radar /></span>;
  if (state === 'working') return <span className="dm-g" style={{ color: 'var(--dm-fg)' }}><Spin /></span>;
  if (state === 'waiting') return <span className="dm-g" style={{ color: 'var(--dm-warn)' }}><Dot /></span>;
  if (state === 'done') return <span className="dm-g" style={{ color: 'var(--dm-ok)' }}><Icon name="ok" /></span>;
  return <span className="dm-g"><Dot color="var(--dm-faint)" /></span>;
}

/** One live line for what the agent is doing right now. It fades between states and resizes to fit them. */
export function StatusPill(props: StatusPillProps) {
  const { variant = 'pill', progress = 0, className } = props;
  const reduce = useReducedMotion();
  // a new state, label, file or action fades the old line out before the new one comes in;
  // changes to meta, progress or the action's handler show straight away
  const keyOf = (p: StatusPillProps) => [p.state ?? 'idle', p.label, p.file?.name ?? '', p.action?.label ?? ''].join('\u0000');
  const key = keyOf(props);
  const [prev, setPrev] = useState(props);
  const latest = useRef(props);
  useEffect(() => { latest.current = props; });
  const prevKey = keyOf(prev), fading = key !== prevKey;
  const view = fading ? prev : props, state = view.state ?? 'idle';
  useEffect(() => {
    if (!fading) return;
    const t = setTimeout(() => setPrev(latest.current), reduce ? 0 : 180);
    return () => clearTimeout(t);
  }, [key, prevKey, reduce]);

  // switching between pill and bar morphs in three beats, so the words and the shape never move at once: the line fades
  // out with its track, the shape changes while it's empty, then the new layout fades in with the track under it
  const [shape, setShape] = useState(variant);
  const [morphing, setMorphing] = useState(false);
  const shapeRef = useRef(variant);
  useEffect(() => {
    if (variant === shapeRef.current) return;
    if (reduce){ shapeRef.current = variant; setShape(variant); return; }
    setMorphing(true);
    const a = setTimeout(() => { shapeRef.current = variant; setShape(variant); }, 170);
    const b = setTimeout(() => setMorphing(false), 430);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [variant, reduce]);

  // the pill always hugs its content; the bar keeps a little extra room for its track
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>();
  useIsoLayoutEffect(() => {
    const el = box.current; if (!el) return;
    const fit = () => { el.style.width = 'max-content'; const w = el.scrollWidth; el.style.width = ''; setWidth(shape === 'bar' ? Math.max(w + 24, 300) : w); };
    fit();
    document.fonts?.ready.then(fit);
  }, [prevKey, shape, view.meta]);

  return (
    <div data-dm="" className={cx('dm-spl', shape === 'bar' && 'dm-bar', morphing && 'dm-mo', className)}>
      <div className="dm-spl-pill" style={{ width: width ?? (shape === 'bar' ? 300 : 'max-content') }} aria-live="polite">
        <div ref={box} className={cx('dm-spl-in', (fading || morphing) && 'dm-out')}>
          <Glyph state={state} />
          <span className={LIVE.includes(state) ? 'dm-shim' : state === 'idle' ? 'dm-fg2' : undefined}>{view.label}</span>
          {view.file && <span className="dm-fchip" style={{ height: 24 }}>{view.file.type && <span className={cx('dm-ft', FT[view.file.type])}>{view.file.type.toUpperCase()}</span>}{view.file.name}</span>}
          {view.meta && <span className="dm-m">{view.meta}</span>}
          {view.action
            ? <button type="button" className="dm-pill dm-ink dm-sm" onClick={() => props.action?.onClick()}>{view.action.label}</button>
            : <span className="dm-end" />}
        </div>
        <div className="dm-spl-track"><div className="dm-spl-fill" style={{ width: Math.max(0, Math.min(100, progress)) + '%' }} /></div>
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
- [Context meter](https://designme.dev/components/context-meter.md): How full the context window is, with session and weekly limits, in one small popover.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Grouped tasks with live progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.

All components: https://designme.dev/llms.txt
