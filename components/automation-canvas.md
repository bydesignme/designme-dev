# Automation canvas

> A trigger, a few agent steps, and a run you can watch flow through.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/automation-canvas

## Install

```sh
npx designme add automation-canvas          # HTML, CSS and JS, with the shared core
npx designme add automation-canvas --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Automation canvas draws an agent automation as cards joined by wires: a trigger, a few agent steps and where the result goes. People can drag the cards, click one to change its setting, and press Test run to watch the run light up each step and wire in turn.

### When to use it

- When people set up recurring agent workflows, like a weekly design check that posts to Slack.
- When a short flow is easier to understand as a picture than as a form.
- When each step has one main setting that people should be able to change in place.
- When you want to show a test run moving through the steps before the automation goes live.

### What it does

- Each node has an icon, a colour, a `title` and a `detail` line, placed by `x` and `y` as fractions of the canvas. `edges` wire nodes together by id.
- With `balanced` on (the default), nodes that share an `x` form a column and the columns spread evenly across the width.
- Cards can be dragged. Dropping one calls `onNodeMove` with its new centre. Below 560px wide the nodes stack down the canvas, using each node's `narrow` position if set.
- Clicking a node opens a popover with its `field`, a menu of options. Picking one updates the node's detail and calls `onValuesChange`.
- `onRun` adds a Test run button. Set each node's `state` to `run` or `done` and add wires to `flowing` as your run goes, and a soft light passes along each new wire.
- The header shows the automation's `name`, an optional green `tag` like "On" and a `status` line that crossfades.

### Accessibility

- Each node is a button with `aria-expanded` that shows whether its popover is open.
- The popover has `role="dialog"`, labelled with the node's title, and is `inert` while closed.
- Setting options use `role="menuitemradio"` with `aria-checked`, and the dropdown button has `aria-expanded`.
- The wires are `aria-hidden`, and the light along a wire is skipped when reduced motion is on.

## Usage in React

```tsx
import { AutomationCanvas } from '@/components/designme/automation-canvas/AutomationCanvas';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { AutomationCanvas, type AutomationEdge, type AutomationNode } from './AutomationCanvas';
import { useScript } from '../lib/useScript';

const NODES: AutomationNode[] = [
  { id: 't', icon: 'clock', color: 'var(--dm-py)', title: 'Schedule', detail: 'Mondays 9:00', x: .14, y: .5, narrow: { x: .5, y: .13 }, field: { label: 'When', options: ['Mondays 9:00', 'Every weekday', 'On new Figma version'] } },
  { id: 'a', icon: 'figma', color: 'var(--dm-pl)', title: 'Read frames', detail: 'Pricing, Checkout', x: .4, y: .28, narrow: { x: .28, y: .42 }, field: { label: 'Frames', options: ['Pricing, Checkout', 'All frames', 'Changed this week'] } },
  { id: 'b', icon: 'spark', color: 'var(--dm-accent)', title: 'Agent: audit', detail: 'Contrast, tokens', x: .4, y: .72, narrow: { x: .72, y: .62 }, field: { label: 'Checks', options: ['Contrast, tokens', 'Everything', 'Accessibility only'] } },
  { id: 'c', icon: 'send', color: 'var(--dm-pm)', title: 'Post summary', detail: '#design in Slack', x: .78, y: .5, narrow: { x: .5, y: .88 }, field: { label: 'Channel', options: ['#design in Slack', 'Email the team', 'Linear ticket'] } }
];
const EDGES: AutomationEdge[] = [['t', 'a'], ['t', 'b'], ['a', 'c'], ['b', 'c']];

/* ---------- Automation canvas: drag the steps, change their settings, and test run the flow ---------- */
export default function AutomationCanvasDemo() {
  const [run, setRun] = useState(0);
  const [states, setStates] = useState<Record<string, AutomationNode['state']>>({});
  const [flowing, setFlowing] = useState<AutomationEdge[]>([]);
  const [status, setStatus] = useState('Every Monday, 9:00');
  // picking a new schedule rewrites the line in the corner
  const [trigger, setTrigger] = useState('Mondays 9:00');
  // one test run plays on its own, unless you start moving or changing steps first
  const yours = useRef(false);
  useScript(async ({ wait }) => { await wait(1600); if (!yours.current) setRun(r => r || 1); });

  // Test run lights each step in turn; a soft light passes along each wire the run reaches, and the wire stays lit
  useScript(async ({ wait }) => {
    if (!run) return;
    const mark = (id: string, s: AutomationNode['state']) => setStates(x => ({ ...x, [id]: s }));
    setStates({}); setFlowing([]); setStatus('Running test');
    await wait(220); mark('t', 'run'); await wait(600); mark('t', 'done');
    setFlowing([['t', 'a'], ['t', 'b']]); await wait(620);
    mark('a', 'run'); mark('b', 'run'); await wait(1100); mark('a', 'done'); await wait(400); mark('b', 'done');
    setFlowing(f => [...f, ['a', 'c'], ['b', 'c']]); await wait(620);
    mark('c', 'run'); await wait(700); mark('c', 'done'); setStatus('Test passed in 3.4s');
  }, [run]);

  return (
    <div style={{ width: '100%' }} onPointerDownCapture={e => { if (e.isTrusted) yours.current = true; }}>
      <AutomationCanvas name="Weekly design QA" tag="On" status={status}
        nodes={NODES.map(n => ({ ...n, state: states[n.id] }))} edges={EDGES} flowing={flowing}
        onValuesChange={v => { if (v.t !== trigger) { setTrigger(v.t); setStatus(v.t.replace('Mondays', 'Every Monday,')); } }}
        onRun={() => setRun(r => r + 1)} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `name` | `string` | The automation's name, like "Weekly design QA" |
| `tag` (optional) | `string` | The green tag after the name, like "On". Leave it out to hide it |
| `status` (optional) | `string` | The quiet line on the right, like "Every Monday, 9:00". Crossfades when it changes |
| `nodes` | `AutomationNode[]` |  |
| `edges` | `AutomationEdge[]` |  |
| `flowing` (optional) | `AutomationEdge[]` | The wires a run has reached. A soft light passes along each one as it is added, and it stays lit while it is listed; clear the list when a new run starts |
| `balanced` (optional) | `boolean` | Spread the columns of cards evenly, with the first and last the same distance in from each side, so the wires on the left and right match at any width. Set false to place every card exactly at its x. Defaults to true |
| `selected` (optional) | `string \| null` | The node whose popover is open. Leave it out to let clicks pick it |
| `defaultSelected` (optional) | `string \| null` |  |
| `onSelectedChange` (optional) | `(id: string \| null) => void` |  |
| `values` (optional) | `Record<string, string>` | Each node's setting, by id. Leave it out to let the popovers keep them, starting from each node's detail |
| `defaultValues` (optional) | `Record<string, string>` |  |
| `onValuesChange` (optional) | `(values: Record<string, string>) => void` |  |
| `onNodeMove` (optional) | `(id: string, at: AutomationPoint, narrow: boolean) => void` | Called when a node is dropped after a drag, with where its centre ended up and whether the canvas was narrow |
| `onRun` (optional) | `() => void` | Adds the Test run button. The run itself is yours: drive it with each node's state and `flowing` |
| `runLabel` (optional) | `string` |  |
| `doneLabel` (optional) | `string` | The button that closes a popover |
| `className` (optional) | `string` |  |

## Questions

**Does Test run execute the automation?**

No. It calls `onRun`. Your code runs the steps and updates each node's `state` and the `flowing` list, which the canvas animates.

**How do I lay it out for small screens?**

Give nodes a `narrow` position. Below 560px the canvas uses those positions and wires top to bottom. Without them, nodes stack in a column down the middle.

**How do I save where people dragged the cards?**

Handle `onNodeMove(id, at, narrow)`. It reports the card's centre as fractions of the canvas and whether the narrow layout was in use, so you can store each layout separately.

**How do I reset the wires before a new run?**

Clear the `flowing` array when the run starts. Wires stay lit for as long as they are listed in it.

## Source

`AutomationCanvas.tsx`, as `npx designme add automation-canvas --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Swap } from '../lib/motion';
import '../designme.css';
import './automation-canvas.css';

/** A spot on the canvas, as fractions of its width and height */
export interface AutomationPoint {
  x: number;
  y: number;
}

/** One step of the automation, drawn as a card on the canvas */
export interface AutomationNode {
  id: string;
  icon: IconName;
  /** The icon's colour, like 'var(--dm-pl)'. Its tile is a light tint of it */
  color: string;
  /** Like "Read frames" */
  title: string;
  /** The setting shown under the title, like "Pricing, Checkout". The popover changes it */
  detail: string;
  /** Where the centre of the card sits, as fractions of the canvas width and height. With `balanced` (the default), cards
   * that share an x form a column, and the columns spread evenly from one side to the other */
  x: number;
  y: number;
  /** Where it sits when the canvas is narrower than 560px. Defaults to a column down the middle */
  narrow?: AutomationPoint;
  /** What its popover edits: a label and the choices, like { label: 'Frames', options: ['Pricing, Checkout', 'All frames'] } */
  field?: { label: string; options: string[] };
  /** 'run' rings it with a spinner, 'done' ticks it. Leave it out before a run */
  state?: 'run' | 'done';
}

/** A wire from one node to another, by id */
export type AutomationEdge = [from: string, to: string];

export interface AutomationCanvasProps {
  /** The automation's name, like "Weekly design QA" */
  name: string;
  /** The green tag after the name, like "On". Leave it out to hide it */
  tag?: string;
  /** The quiet line on the right, like "Every Monday, 9:00". Crossfades when it changes */
  status?: string;
  nodes: AutomationNode[];
  edges: AutomationEdge[];
  /** The wires a run has reached. A soft light passes along each one as it is added, and it stays lit while it is listed;
   * clear the list when a new run starts */
  flowing?: AutomationEdge[];
  /** Spread the columns of cards evenly, with the first and last the same distance in from each side, so the wires on
   * the left and right match at any width. Set false to place every card exactly at its x. Defaults to true */
  balanced?: boolean;
  /** The node whose popover is open. Leave it out to let clicks pick it */
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  /** Each node's setting, by id. Leave it out to let the popovers keep them, starting from each node's detail */
  values?: Record<string, string>;
  defaultValues?: Record<string, string>;
  onValuesChange?: (values: Record<string, string>) => void;
  /** Called when a node is dropped after a drag, with where its centre ended up and whether the canvas was narrow */
  onNodeMove?: (id: string, at: AutomationPoint, narrow: boolean) => void;
  /** Adds the Test run button. The run itself is yours: drive it with each node's state and `flowing` */
  onRun?: () => void;
  runLabel?: string;
  /** The button that closes a popover */
  doneLabel?: string;
  className?: string;
}

// under this width the nodes stack down the canvas and wire top to bottom
const NARROW = 560;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const same = (a: AutomationEdge, b: AutomationEdge) => a[0] === b[0] && a[1] === b[1];

/** An automation as cards and wires: drag the cards, click one to change its setting, and watch a run flow through it. */
export function AutomationCanvas({
  name, tag, status, nodes, edges, flowing = [], selected, defaultSelected = null, onSelectedChange, values, defaultValues, onValuesChange,
  balanced = true, onNodeMove, onRun, runLabel = 'Test run', doneLabel = 'Done', className
}: AutomationCanvasProps) {
  const [sel, setSel] = useControllable(selected, defaultSelected, onSelectedChange);
  const [vals, setVals] = useControllable(values, defaultValues ?? Object.fromEntries(nodes.map(n => [n.id, n.detail])), onValuesChange);
  const valueOf = (n: AutomationNode) => vals[n.id] ?? n.detail;

  const cv = useRef<HTMLDivElement>(null);
  const els = useRef<Record<string, HTMLButtonElement | null>>({});
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [heights, setHeights] = useState<Record<string, number>>({});
  // where people dropped the nodes, kept apart for the wide and the narrow layout
  const [moved, setMoved] = useState<{ wide: Record<string, AutomationPoint>; narrow: Record<string, AutomationPoint> }>({ wide: {}, narrow: {} });
  const [drag, setDrag] = useState<string | null>(null);
  const [optsOpen, setOptsOpen] = useState(false);
  // a drop ends in a click; this swallows it so the popover doesn't open
  const dropped = useRef(false);
  const stopDrag = useRef<() => void>(undefined);
  const close = useRef(() => setSel(null));
  useEffect(() => { close.current = () => setSel(null); });
  useEffect(() => () => stopDrag.current?.(), []);

  // the popover keeps showing the last node while it fades out
  const [popFor, setPopFor] = useState(sel);
  if (sel && sel !== popFor) setPopFor(sel);
  const [optsFor, setOptsFor] = useState(sel);
  if (optsFor !== sel) { setOptsFor(sel); setOptsOpen(false); }

  const narrow = !!size && size.w < NARROW;
  // cards narrow a little when a wide canvas is short of room for three columns of full-size cards
  const width = narrow || (!!size && size.w < 700) ? 150 : 176;
  const reduce = useReducedMotion();

  // the canvas size drives the layout; a change of width closes the popover, as the node it points at moves
  useIsoLayoutEffect(() => {
    const el = cv.current; if (!el) return;
    let last = 0;
    const fit = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (last && Math.abs(w - last) > 2) close.current();
      last = w;
      setSize(s => (s && s.w === w && s.h === h ? s : { w, h }));
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // on arrival the wires draw in once the steps have landed: each path gets its own length to draw along
  const svg = useRef<SVGSVGElement>(null);
  const [intro, setIntro] = useState(true);
  useEffect(() => { const t = setTimeout(() => setIntro(false), 1300); return () => clearTimeout(t); }, []);
  useIsoLayoutEffect(() => { if (intro) svg.current?.querySelectorAll('path').forEach(p => p.style.setProperty('--dm-l', String(Math.ceil(p.getTotalLength())))); });
  useIsoLayoutEffect(() => {
    const next: Record<string, number> = {};
    for (const n of nodes) next[n.id] = els.current[n.id]?.offsetHeight ?? 0;
    setHeights(h => (nodes.every(n => h[n.id] === next[n.id]) ? h : next));
  });

  // balanced: the distinct x values are columns, the first and last the same distance in from each side, the rest evenly between
  const cols = [...new Set(nodes.map(n => n.x))].sort((a, b) => a - b);
  const colX = (x: number) => {
    if (!balanced || !size || cols.length < 2) return x;
    const W = size.w, pad = Math.max(20, W * .06), first = pad + width / 2, last = W - pad - width / 2;
    return (first + (last - first) * cols.indexOf(x) / (cols.length - 1)) / W;
  };
  const at = (n: AutomationNode, i: number): AutomationPoint => narrow
    ? moved.narrow[n.id] ?? n.narrow ?? { x: .5, y: (i + 1) / (nodes.length + 1) }
    : moved.wide[n.id] ?? { x: colX(n.x), y: n.y };
  const boxes: Record<string, { left: number; top: number; w: number; h: number }> = {};
  nodes.forEach((n, i) => {
    const p = at(n, i), h = heights[n.id] || 56;
    boxes[n.id] = { left: p.x * (size?.w ?? 0) - width / 2, top: p.y * (size?.h ?? 0) - h / 2, w: width, h };
  });

  const wire = ([a, b]: AutomationEdge) => {
    const A = boxes[a], B = boxes[b]; if (!A || !B) return '';
    const ax = A.left + A.w / 2, ay = A.top + A.h / 2, bx = B.left + B.w / 2, by = B.top + B.h / 2;
    if (narrow) { const y1 = A.top + A.h, y2 = B.top, m = (y1 + y2) / 2; return `M${ax} ${y1} C${ax} ${m} ${bx} ${m} ${bx} ${y2}`; }
    const x1 = A.left + A.w, x2 = B.left, m = (x1 + x2) / 2;
    return `M${x1} ${ay} C${m} ${ay} ${m} ${by} ${x2} ${by}`;
  };

  const startDrag = (e: ReactPointerEvent<HTMLButtonElement>, id: string) => {
    if (e.button || !cv.current) return;
    const b = e.currentTarget, canvas = cv.current, sx = e.clientX, sy = e.clientY, ox = b.offsetLeft, oy = b.offsetTop, pointer = e.pointerId;
    const layout = narrow ? 'narrow' : 'wide';
    let on = false, last: AutomationPoint | null = null;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!on && Math.hypot(dx, dy) < 4) return;
      if (!on) { on = true; setDrag(id); close.current(); b.setPointerCapture?.(pointer); }
      const W = canvas.clientWidth, H = canvas.clientHeight;
      const left = clamp(ox + dx, 4, W - b.offsetWidth - 4), top = clamp(oy + dy, 4, H - b.offsetHeight - 4);
      const p = { x: (left + b.offsetWidth / 2) / W, y: (top + b.offsetHeight / 2) / H };
      last = p;
      setMoved(m => ({ ...m, [layout]: { ...m[layout], [id]: p } }));
    };
    const up = () => {
      stopDrag.current?.();
      if (!on) return;
      setDrag(null);
      dropped.current = true; setTimeout(() => { dropped.current = false; }, 50);
      if (last) onNodeMove?.(id, last, layout === 'narrow');
    };
    stopDrag.current = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); stopDrag.current = undefined; };
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up);
  };

  // a wire newly reached by a run gets one soft light passing along it
  const flowKey = flowing.map(e => e.join('-')).join(',');
  const lastFlow = useRef<string[]>([]);
  useEffect(() => {
    const now = flowKey ? flowKey.split(',') : [], added = now.filter(k => !lastFlow.current.includes(k)); lastFlow.current = now;
    if (reduce) return;
    added.forEach(k => {
      const p = svg.current?.querySelector<SVGPathElement>(`path[data-e="${k}"]`); if (!p) return;
      const L = p.getTotalLength(), len = Math.min(64, L * .4), q = p.cloneNode() as SVGPathElement;
      q.removeAttribute('data-e'); q.setAttribute('class', 'dm-pulse'); q.style.cssText = `stroke-dasharray:${len} ${L + len}`; svg.current?.appendChild(q);
      q.animate([{ strokeDashoffset: len, opacity: 0 }, { opacity: 1, offset: .18 }, { opacity: 1, offset: .78 }, { strokeDashoffset: -L, opacity: 0 }], { duration: 720, easing: 'cubic-bezier(.45,0,.25,1)' }).onfinish = () => q.remove();
    });
  }, [flowKey, reduce]);

  const pop = nodes.find(n => n.id === popFor);
  const pb = pop && boxes[pop.id];
  let px = 0, py = 0;
  if (pb && size) {
    px = pb.left + pb.w + 10; if (px + 240 > size.w) px = pb.left - 250; if (px < 6) px = 6;
    py = clamp(pb.top - 40, 6, size.h - 190);
  }
  const pick = (n: AutomationNode, v: string) => { setVals({ ...vals, [n.id]: v }); setOptsOpen(false); };

  return (
    <div data-dm="" className={cx('dm-acx', className)}>
      <div className="dm-acx-top">
        <span className="dm-acx-name">{name}</span>
        {tag && <span className="dm-tag dm-ok dm-acx-on">{tag}</span>}
        <span className="dm-acx-sp" />
        {status !== undefined && <Swap className="dm-muted dm-acx-st">{status}</Swap>}
        {onRun && <button type="button" className="dm-pill dm-ink dm-sm dm-acx-run" onClick={() => { setSel(null); onRun(); }}><Icon name="play" size="xs" />{runLabel}</button>}
      </div>
      <div className="dm-acx-cv" ref={cv} onClick={() => setSel(null)}>
        <svg ref={svg} className={cx('dm-acx-svg', intro && 'dm-intro')} aria-hidden="true">
          {size && edges.map(e => <path key={e.join('-')} data-e={e.join('-')} className={flowing.some(f => same(f, e)) ? 'dm-done' : undefined} d={wire(e)} />)}
        </svg>
        <div className="dm-acx-nodes">
          {nodes.map((n, i) => {
            const p = at(n, i), h = heights[n.id] || 56;
            return (
              <button type="button" key={n.id} ref={el => { els.current[n.id] = el; }} aria-expanded={sel === n.id}
                className={cx('dm-acx-n dm-acx-in', drag === n.id && 'dm-drag', sel === n.id && 'dm-sel', n.state === 'run' && 'dm-run')}
                style={{ animationDelay: i * 90 + 'ms', left: `calc(${p.x * 100}% - ${width / 2}px)`, top: `calc(${p.y * 100}% - ${h / 2}px)`, width: width === 176 ? undefined : width }}
                onPointerDown={ev => startDrag(ev, n.id)}
                onClick={ev => { ev.stopPropagation(); if (dropped.current) { dropped.current = false; return; } setSel(sel === n.id ? null : n.id); }}>
                <span className="dm-ic" style={{ color: n.color, background: `color-mix(in srgb,${n.color} 14%,transparent)` }}><Icon name={n.icon} size="xs" /></span>
                <span className="dm-t"><b>{n.title}</b><Swap className="dm-d">{valueOf(n)}</Swap></span>
                {/* the badge pops in once; after that its spinner turns into a check with a short crossfade */}
                {n.state && (
                  <span className="dm-s">
                    <span key={n.state} className="dm-acx-sv">
                      {n.state === 'run' ? <span className="dm-spin" style={{ width: 10, height: 10 }} /> : <span style={{ color: 'var(--dm-ok)', display: 'grid' }}><Icon name="check" size="xs" /></span>}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className={cx('dm-pop dm-acx-pop', !!sel && 'dm-open')} role="dialog" aria-label={pop?.title} inert={!sel} style={{ left: px, top: py }} onClick={e => e.stopPropagation()}>
          {pop && <>
            <h4>{pop.title}</h4>
            {pop.field && (
              <div className="dm-acx-fl">
                <span>{pop.field.label}</span>
                <button type="button" className="dm-acx-dd" aria-expanded={optsOpen} onClick={() => setOptsOpen(o => !o)}><Swap>{valueOf(pop)}</Swap><Icon name="chev-d" size="xs" /></button>
                <div className={cx('dm-acx-opts', optsOpen && 'dm-open')} role="menu">
                  {pop.field.options.map(o => (
                    <button type="button" key={o} className="dm-mi" role="menuitemradio" aria-checked={o === valueOf(pop)} onClick={() => pick(pop, o)}>
                      <span>{o}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button type="button" className="dm-pill dm-soft dm-sm dm-acx-done" onClick={() => setSel(null)}>{doneLabel}</button>
          </>}
        </div>
      </div>
    </div>
  );
}
```

## More in Workspace

- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
- [Memory panel](https://designme.dev/components/memory-panel.md): What the agent remembers about your team, editable and removable.
- [Model compare](https://designme.dev/components/model-compare.md): Run one prompt on three models side by side and keep the best.
- [Agent settings](https://designme.dev/components/agent-settings.md): How much the agent may do alone, with a save bar for changes.
- [Tools and connections](https://designme.dev/components/tool-connections.md): The tools the agent can reach, and how much it may do with each.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.
- [Workspace rail](https://designme.dev/components/workspace-rail.md): A slim app rail that opens into a labelled sidebar.

All components: https://designme.dev/llms.txt
