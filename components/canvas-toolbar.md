# Canvas toolbar

> A floating toolbar for a workflow canvas: run, pick a tool, comment, fit and zoom.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/canvas-toolbar

## Install

```sh
npx designme add canvas-toolbar          # HTML, CSS and JS, with the shared core
npx designme add canvas-toolbar --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Canvas toolbar is the floating toolbar of a workflow canvas, docked at the bottom centre. It has a handle to move it, Run (which turns into a red Stop while a run is going), the pointer tools Select, Hand and Lasso, Comment, Fit to screen, and zoom out and in with the zoom level between them. Every icon button shows its shortcut in its tooltip, and the shortcuts work while the canvas has the focus.

### When to use it

- When people build or edit an agent workflow on a canvas and need to move around it, pick steps and run it.
- When a run should be started and stopped from the same place people navigate the canvas from.
- When the canvas needs the usual canvas shortcuts, so people who know other editors can work without the mouse.
- Not for a short flow that fits on screen and never needs panning or zooming: Automation canvas is enough then.

### What it does

- Run starts a run and turns into Stop, on a red fill, until the run ends. In the demo the steps light up one after another along their wires and the run stops by itself; in React, `onRun` and `onStop` call you, and you set `running`, each node's `state` and the `lit` wires as your run goes.
- Select, Hand and Lasso are one radio group. Select picks a step with a click (Shift adds to the pick), moves the picked steps by dragging, and draws a box round steps on empty canvas; Hand pans; Lasso picks the steps inside the shape you draw. The middle mouse button pans with any tool.
- Comment is a toggle: the next click on the canvas drops a numbered pin there and turns it off. The HTML fires `canvas-comment` with the spot; in React `onComment` gets it, and `comments` holds the pins.
- Fit to screen fits every step in the room above the toolbar, at most 150%. On arrival, and when the canvas switches between wide and narrow, the view fits the steps at no more than 100%.
- Zoom out and Zoom in step through 25%, 33%, 50%, 67%, 75%, 90%, 100%, 125%, 150%, 200%, 300% and 400% round the middle of the view (`zoomSteps` changes them). The level between them resets to 100%. Ctrl or ⌘ with the scroll wheel, or a trackpad pinch, zooms at the pointer.
- Shortcuts: V Select, H Hand, L Lasso, C Comment, Shift+1 fit, Shift+0 100%, minus and plus zoom, the arrow keys pan the canvas (Shift for bigger steps), and Escape leaves Comment or clears the selection. They work while the focus is on the canvas or on the toolbar.
- The handle moves the toolbar anywhere on the canvas, by dragging or with the arrow keys while it has the focus; Home or a double click docks it again.
- The toolbar stays on one line. Below 440px wide, Comment and Fit to screen move into a More menu; below 360px, the zoom buttons and the level move there too.
- In HTML the component fires `canvas-run`, `canvas-stop` (with `finished`), `canvas-tool`, `canvas-zoom` and `canvas-comment` events. In React, `tool`, `commenting`, `view`, `selected` and the comments are each controlled or left to the component, and a ref can `panBy`, `zoomIn`, `zoomOut`, `zoomTo` and `fit`.

### Accessibility

- The canvas is a focusable group with the role description "canvas" and a label, described by a line that lists its shortcuts. A click on it gives it the focus.
- The toolbar has `role="toolbar"` and the label Canvas tools. Each icon button is labelled and shows its name and shortcut in a tooltip on hover and on keyboard focus.
- Select, Hand and Lasso are a `radiogroup` of `radio` buttons with `aria-checked`, and a single tab stop: the arrow keys move through them and pick each one, wrapping at the ends, and Home and End jump to the ends.
- Comment reports `aria-pressed`. Zoom out and Zoom in are `aria-disabled` at the ends of the range, so they keep their place and the focus. The level's name says the current zoom and that it resets to 100%.
- More is a menu button: Enter, Space or the down arrow open it on its first item, the arrows move and wrap, Escape closes it and gives the focus back. Comment is a `menuitemcheckbox` there.
- An `aria-live="polite"` region says the tool picked, the zoom level, how many steps are selected, where a comment went, and when a run starts, finishes or stops.
- With reduced motion on, the view moves at once instead of gliding.

## Usage in React

```tsx
import { CanvasToolbar } from '@/components/designme/canvas-toolbar/CanvasToolbar';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { CanvasToolbar, type CanvasToolbarEdge, type CanvasToolbarHandle, type CanvasToolbarNode } from './CanvasToolbar';
import { useScript, useStory } from '../lib/useScript';

// a support workflow: a row on a wide canvas, two by two on a narrow one
const NODES: CanvasToolbarNode[] = [
  { id: 'a', icon: 'bolt', color: 'var(--dm-py)', title: 'New ticket', detail: 'Trigger · inbox', x: 0, y: 48, narrow: { x: 0, y: 0 } },
  { id: 'b', icon: 'spark', color: 'var(--dm-accent-mark)', iconColor: 'var(--dm-accent-fg)', title: 'Classify', detail: 'Agent · intent', x: 208, y: 0, narrow: { x: 184, y: 0 } },
  { id: 'c', icon: 'search', color: 'var(--dm-pb)', title: 'Search docs', detail: 'Tool · help center', x: 416, y: 96, narrow: { x: 184, y: 104 } },
  { id: 'd', icon: 'edit', color: 'var(--dm-pm)', title: 'Draft reply', detail: 'Agent · for review', x: 624, y: 48, narrow: { x: 0, y: 104 } }
];
const EDGES: CanvasToolbarEdge[] = [['a', 'b'], ['b', 'c'], ['c', 'd']];

/* ---------- Canvas toolbar: take the hand and drag the workflow aside, zoom in twice, fit it back, then run it ---------- */
export default function CanvasToolbarDemo() {
  const ref = useRef<HTMLDivElement>(null), canvas = useRef<CanvasToolbarHandle>(null);
  const [run, setRun] = useState(0);
  const [states, setStates] = useState<Record<string, CanvasToolbarNode['state']>>({});
  const [lit, setLit] = useState<CanvasToolbarEdge[]>([]);

  // Run lights each step in turn along its wire, then stops by itself; Stop ends it early
  useScript(async ({ wait }) => {
    // stopped: the step that was running goes back to waiting, the ones done keep their tick
    if (run < 0) { setStates(s => Object.fromEntries(Object.entries(s).filter(([, v]) => v === 'done'))); return; }
    if (!run) return;
    setStates({}); setLit([]);
    for (let i = 0; i < NODES.length; i++) {
      const id = NODES[i].id;
      setStates(s => ({ ...s, [id]: 'run' })); await wait(i ? 700 : 450); setStates(s => ({ ...s, [id]: 'done' }));
      if (i < EDGES.length) { setLit(l => [...l, EDGES[i]]); await wait(250); }
    }
    await wait(500); setRun(0);
  }, [run]);

  // the preview's story. Your first click or key stops it, and the canvas is yours from wherever it got to
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-ctb-tools [data-t="hand"]');
    await wait(1000); canvas.current?.panBy(-140, 24);
    await wait(1500); canvas.current?.zoomIn();
    await wait(800); canvas.current?.zoomIn();
    await wait(1000); canvas.current?.fit();
    await wait(1000); press('.dm-ctb-tools [data-t="select"]');
    await wait(500); press('.dm-ctb-run');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <CanvasToolbar ref={canvas} nodes={NODES.map(n => ({ ...n, state: states[n.id] }))} edges={EDGES} lit={lit}
        running={run > 0} onRun={() => setRun(r => Math.abs(r) + 1)} onStop={() => setRun(r => -Math.abs(r) - 1)} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `nodes` | `CanvasToolbarNode[]` |  |
| `edges` (optional) | `CanvasToolbarEdge[]` |  |
| `lit` (optional) | `CanvasToolbarEdge[]` | The wires a run has reached; they light up in the accent |
| `running` (optional) | `boolean` | Whether a run is going: Run turns into Stop, on a red fill |
| `onRun` (optional) | `() => void` | Called by Run. The run is yours: set `running`, each node's state and `lit` as it goes, and `running` back to false |
| `onStop` (optional) | `() => void` | Called by Stop |
| `runLabel` (optional) | `string` |  |
| `stopLabel` (optional) | `string` |  |
| `tool` (optional) | `CanvasTool` | The pointer tool. Leave it out to let the toolbar and V, H and L pick it |
| `defaultTool` (optional) | `CanvasTool` |  |
| `onToolChange` (optional) | `(tool: CanvasTool) => void` |  |
| `commenting` (optional) | `boolean` | Whether Comment is on: the next click on the canvas places a comment there |
| `defaultCommenting` (optional) | `boolean` |  |
| `onCommentingChange` (optional) | `(on: boolean) => void` |  |
| `onComment` (optional) | `(at: CanvasPoint) => void` | Called where a comment was placed, in canvas pixels at 100%. The pins it shows are `comments` |
| `comments` (optional) | `CanvasPoint[]` | The pins on the canvas. Leave it out to let the canvas keep the ones placed |
| `view` (optional) | `CanvasView \| null` | Where the canvas looks. null fits every step in the room above the toolbar (at most 100%), which it does until someone pans or zooms, and again when the canvas switches between wide and narrow. Leave it out to let the canvas keep it |
| `defaultView` (optional) | `CanvasView \| null` |  |
| `onViewChange` (optional) | `(view: CanvasView \| null) => void` |  |
| `selected` (optional) | `string[]` | The selected steps, by id |
| `defaultSelected` (optional) | `string[]` |  |
| `onSelectedChange` (optional) | `(ids: string[]) => void` |  |
| `onNodesMove` (optional) | `(moves: Record<string, CanvasPoint>, narrow: boolean) => void` | Called when steps are dropped after a drag with Select, with where each now sits and whether the canvas was narrow |
| `zoomSteps` (optional) | `number[]` | The zoom levels the buttons and keys step through, from smallest to largest. Defaults to 25% to 400% |
| `label` (optional) | `string` | The canvas's accessible name |
| `ref` (optional) | `Ref<CanvasToolbarHandle>` | Moves the view from your code, as the buttons and keys do: `panBy`, `zoomIn`, `zoomOut`, `zoomTo`, `fit` |
| `children` (optional) | `ReactNode` | More, drawn on the canvas under the steps, in canvas pixels at 100% |
| `className` (optional) | `string` |  |

## Questions

**Does Run execute the workflow?**

No. In React it calls `onRun`; your code runs the steps, sets `running` and each node's `state`, and adds the wires it has reached to `lit`. The HTML demo plays a pretend run and fires `canvas-run` and `canvas-stop` for you to hook into.

**Can I draw my own canvas content?**

Yes. `nodes` and `edges` draw the step cards and their wires, and `children` is drawn on the canvas under them, in canvas pixels at 100%, so it pans and zooms with them.

**How do I keep the view between visits?**

Control `view` and save what `onViewChange` gives you: the zoom and the pan. Pass null to go back to fitting the steps.

**Why do some buttons move into More?**

So the toolbar never wraps or runs past a narrow canvas. Run and the three pointer tools always stay on the bar; Comment and Fit go first, then the zoom buttons.

## Source

`CanvasToolbar.tsx`, as `npx designme add canvas-toolbar --react` installs it:

```tsx
'use client';
import { useEffect, useId, useImperativeHandle, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode, type Ref } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './canvas-toolbar.css';

/** The pointer tool: Select picks and moves steps or draws a box round them, Hand pans, Lasso draws a shape round what it picks */
export type CanvasTool = 'select' | 'hand' | 'lasso';

/** Where the canvas looks: a point at (x, y) on the canvas shows at x * zoom + panX, y * zoom + panY */
export interface CanvasView {
  panX: number;
  panY: number;
  /** 1 is 100% */
  zoom: number;
}

/** A spot on the canvas, in canvas pixels at 100% */
export interface CanvasPoint {
  x: number;
  y: number;
}

/** One step on the canvas, drawn as a card */
export interface CanvasToolbarNode {
  id: string;
  icon: IconName;
  /** The icon's colour, like 'var(--dm-pb)'. Its tile is a light tint of it */
  color: string;
  /** The icon's own colour when it differs from its tile's, like 'var(--dm-accent-fg)' for an accent tile */
  iconColor?: string;
  /** Like "Classify" */
  title: string;
  /** The quiet line under the title, like "Agent · intent" */
  detail?: string;
  /** Where its top left corner sits, in canvas pixels at 100% */
  x: number;
  y: number;
  /** Where it sits when the canvas is narrower than 440px. Defaults to `x` and `y` */
  narrow?: CanvasPoint;
  /** 'run' rings it with a spinner, 'done' ticks it */
  state?: 'run' | 'done';
}

/** A wire from one step to another, by id */
export type CanvasToolbarEdge = [from: string, to: string];

/** What a ref on CanvasToolbar can do */
export interface CanvasToolbarHandle {
  /** Moves the view by this many screen pixels, gliding */
  panBy: (dx: number, dy: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  /** Zooms to a level, 1 being 100%, round the middle of the room above the toolbar */
  zoomTo: (zoom: number) => void;
  /** Fits every step in the room above the toolbar, at most 150% */
  fit: () => void;
}

export interface CanvasToolbarProps {
  nodes: CanvasToolbarNode[];
  edges?: CanvasToolbarEdge[];
  /** The wires a run has reached; they light up in the accent */
  lit?: CanvasToolbarEdge[];
  /** Whether a run is going: Run turns into Stop, on a red fill */
  running?: boolean;
  /** Called by Run. The run is yours: set `running`, each node's state and `lit` as it goes, and `running` back to false */
  onRun?: () => void;
  /** Called by Stop */
  onStop?: () => void;
  runLabel?: string;
  stopLabel?: string;
  /** The pointer tool. Leave it out to let the toolbar and V, H and L pick it */
  tool?: CanvasTool;
  defaultTool?: CanvasTool;
  onToolChange?: (tool: CanvasTool) => void;
  /** Whether Comment is on: the next click on the canvas places a comment there */
  commenting?: boolean;
  defaultCommenting?: boolean;
  onCommentingChange?: (on: boolean) => void;
  /** Called where a comment was placed, in canvas pixels at 100%. The pins it shows are `comments` */
  onComment?: (at: CanvasPoint) => void;
  /** The pins on the canvas. Leave it out to let the canvas keep the ones placed */
  comments?: CanvasPoint[];
  /** Where the canvas looks. null fits every step in the room above the toolbar (at most 100%), which it does until someone
   * pans or zooms, and again when the canvas switches between wide and narrow. Leave it out to let the canvas keep it */
  view?: CanvasView | null;
  defaultView?: CanvasView | null;
  onViewChange?: (view: CanvasView | null) => void;
  /** The selected steps, by id */
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  /** Called when steps are dropped after a drag with Select, with where each now sits and whether the canvas was narrow */
  onNodesMove?: (moves: Record<string, CanvasPoint>, narrow: boolean) => void;
  /** The zoom levels the buttons and keys step through, from smallest to largest. Defaults to 25% to 400% */
  zoomSteps?: number[];
  /** The canvas's accessible name */
  label?: string;
  /** Moves the view from your code, as the buttons and keys do: `panBy`, `zoomIn`, `zoomOut`, `zoomTo`, `fit` */
  ref?: Ref<CanvasToolbarHandle>;
  /** More, drawn on the canvas under the steps, in canvas pixels at 100% */
  children?: ReactNode;
  className?: string;
}

const NARROW = 440;
const STEPS = [.25, .33, .5, .67, .75, .9, 1, 1.25, 1.5, 2, 3, 4];
const NAMES: Record<CanvasTool, string> = { select: 'Select', hand: 'Hand', lasso: 'Lasso' };
const TOOLS: { t: CanvasTool; icon: IconName; tip: string; key: string }[] = [
  { t: 'select', icon: 'cursor', tip: 'Select', key: 'V' }, { t: 'hand', icon: 'hand', tip: 'Pan', key: 'H' }, { t: 'lasso', icon: 'lasso', tip: 'Lasso select', key: 'L' }
];
const inside = ([x, y]: number[], poly: number[][]) => {
  let k = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) k = !k; }
  return k;
};
const same = (a: CanvasToolbarEdge, b: CanvasToolbarEdge) => a[0] === b[0] && a[1] === b[1];

/** A workflow canvas with a floating toolbar docked at its foot: a handle that moves the toolbar, Run and Stop, the pointer
 * tools as one radio group, Comment, Fit to screen and zoom, each with its shortcut while the canvas has the focus. Below
 * 440px Comment and Fit move into More, and below 360px the zoom buttons follow. */
export function CanvasToolbar({
  nodes, edges = [], lit = [], running = false, onRun, onStop, runLabel = 'Run', stopLabel = 'Stop',
  tool: toolProp, defaultTool = 'select', onToolChange, commenting: cmProp, defaultCommenting = false, onCommentingChange, onComment, comments,
  view: viewProp, defaultView = null, onViewChange, selected, defaultSelected = [], onSelectedChange, onNodesMove,
  zoomSteps = STEPS, label = 'Workflow canvas', ref, children, className
}: CanvasToolbarProps) {
  const [tool, setToolRaw] = useControllable(toolProp, defaultTool, onToolChange);
  const [commenting, setCommenting] = useControllable(cmProp, defaultCommenting, onCommentingChange);
  const [viewSet, setView] = useControllable<CanvasView | null>(viewProp, defaultView, onViewChange);
  const [sel, setSel] = useControllable(selected, defaultSelected, onSelectedChange);
  const [pins, setPins] = useState<CanvasPoint[]>([]);
  const shownPins = comments ?? pins;
  const [say, setSay] = useState('');
  const reduce = useReducedMotion();
  const uid = useId();

  const root = useRef<HTMLDivElement>(null), cv = useRef<HTMLDivElement>(null), bar = useRef<HTMLDivElement>(null);
  const els = useRef<Record<string, HTMLDivElement | null>>({});
  const [size, setSize] = useState({ w: 0, h: 0, bar: 40, barW: 0 });
  const [dims, setDims] = useState<Record<string, { w: number; h: number }>>({});
  const narrow = size.w > 0 && size.w < NARROW;
  // where people dragged the steps, kept apart for the wide and the narrow layout
  const [moved, setMoved] = useState<{ wide: Record<string, CanvasPoint>; narrow: Record<string, CanvasPoint> }>({ wide: {}, narrow: {} });
  const pos = (n: CanvasToolbarNode): CanvasPoint => (narrow ? moved.narrow[n.id] ?? n.narrow : moved.wide[n.id]) ?? { x: n.x, y: n.y };
  const boxOf = (n: CanvasToolbarNode) => { const p = pos(n), d = dims[n.id] ?? { w: 160, h: 52 }; return { x: p.x, y: p.y, w: d.w, h: d.h }; };

  useIsoLayoutEffect(() => {
    const el = cv.current, b = bar.current; if (!el || !b) return;
    const read = () => setSize(s => {
      const n = { w: el.clientWidth, h: el.clientHeight, bar: b.offsetHeight, barW: b.offsetWidth };
      return s.w === n.w && s.h === n.h && s.bar === n.bar && s.barW === n.barW ? s : n;
    });
    read();
    const ro = new ResizeObserver(read); ro.observe(el); ro.observe(b);
    return () => ro.disconnect();
  }, []);
  useIsoLayoutEffect(() => {
    const next: Record<string, { w: number; h: number }> = {};
    for (const n of nodes) { const e = els.current[n.id]; next[n.id] = { w: e?.offsetWidth ?? 160, h: e?.offsetHeight ?? 52 }; }
    setDims(d => (nodes.every(n => d[n.id] && d[n.id].w === next[n.id].w && d[n.id].h === next[n.id].h) ? d : next));
  });

  /* ---------- the view ---------- */
  const MIN = zoomSteps[0], MAX = zoomSteps[zoomSteps.length - 1];
  const lim = (v: number) => Math.max(MIN, Math.min(MAX, v));
  // the room the workflow has: the canvas above the toolbar
  const roomH = size.h - size.bar - 20;
  const fitView = (cap: number): CanvasView => {
    if (!nodes.length || !size.w) return { panX: 0, panY: 0, zoom: 1 };
    const P = 24, bs = nodes.map(boxOf);
    const x0 = Math.min(...bs.map(b => b.x)), y0 = Math.min(...bs.map(b => b.y)), x1 = Math.max(...bs.map(b => b.x + b.w)), y1 = Math.max(...bs.map(b => b.y + b.h));
    const zoom = lim(Math.min((size.w - 2 * P) / (x1 - x0), (roomH - 2 * P) / (y1 - y0), cap));
    return { zoom, panX: (size.w - (x1 - x0) * zoom) / 2 - x0 * zoom, panY: (roomH - (y1 - y0) * zoom) / 2 - y0 * zoom };
  };
  const view = viewSet ?? fitView(1);
  const { panX, panY, zoom } = view;
  // a canvas that switches between wide and narrow fits the workflow again
  const wasNarrow = useRef(narrow);
  useEffect(() => { if (wasNarrow.current !== narrow) { wasNarrow.current = narrow; if (viewSet) setView(null); } }, [narrow]); // eslint-disable-line react-hooks/exhaustive-deps
  const [anim, setAnim] = useState(false);
  const go = (v: CanvasView, glide = true) => { setAnim(glide && !reduce); setView(v); };
  const pct = Math.round(zoom * 100) + '%';
  const zoomAt = (nz: number, cx: number, cy: number, glide = true) => {
    nz = lim(nz); const wx = (cx - panX) / zoom, wy = (cy - panY) / zoom;
    go({ zoom: nz, panX: cx - wx * nz, panY: cy - wy * nz }, glide);
  };
  const next = (d: number) => (d > 0 ? zoomSteps.find(x => x > zoom + 1e-3) : [...zoomSteps].reverse().find(x => x < zoom - 1e-3)) ?? zoom;
  const zoomBy = (d: number) => { const nz = next(d); if (nz === zoom) return; zoomAt(nz, size.w / 2, roomH / 2); setSay('Zoom ' + Math.round(nz * 100) + '%'); };
  const zoomReset = () => { zoomAt(1, size.w / 2, roomH / 2); setSay('Zoom 100%'); };
  const fitNow = () => { const v = fitView(1.5); go(v); setSay('Fit to screen, ' + Math.round(v.zoom * 100) + '%'); };
  const lo = zoom <= MIN + 1e-3, hi = zoom >= MAX - 1e-3;
  useImperativeHandle(ref, () => ({
    panBy: (dx, dy) => go({ zoom, panX: panX + dx, panY: panY + dy }),
    zoomIn: () => zoomBy(1), zoomOut: () => zoomBy(-1),
    zoomTo: z => { zoomAt(z, size.w / 2, roomH / 2); setSay('Zoom ' + Math.round(lim(z) * 100) + '%'); },
    fit: fitNow
  }));

  /* ---------- tools ---------- */
  const setTool = (t: CanvasTool, focus = false) => {
    setToolRaw(t); if (commenting) setCommenting(false); setSay(NAMES[t] + ' tool');
    if (focus) requestAnimationFrame(() => root.current?.querySelector<HTMLElement>(`[data-t="${t}"]`)?.focus({ preventScroll: true }));
  };
  const toggleComment = (on = !commenting) => { setCommenting(on); setSay(on ? 'Comment: click the canvas to place it' : 'Comment off'); };
  const toolKeys = (e: ReactKeyboardEvent) => {
    const i = TOOLS.findIndex(x => x.t === tool);
    const d = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
    const j = d ? (i + d + TOOLS.length) % TOOLS.length : e.key === 'Home' ? 0 : e.key === 'End' ? TOOLS.length - 1 : -1;
    if (j < 0) return; e.preventDefault(); e.stopPropagation(); setTool(TOOLS[j].t, true);
  };

  /* ---------- the canvas: drag to pan, box or lasso select, move steps; Comment drops a pin ---------- */
  const drag = useRef<{ kind: 'pan' | 'move' | 'box' | 'lasso'; p0: number[]; view: CanvasView; from: Record<string, CanvasPoint>; base: string[]; pts: number[][] } | null>(null);
  const [panning, setPanning] = useState(false);
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [lasso, setLasso] = useState<number[][] | null>(null);
  const pt = (e: { clientX: number; clientY: number }) => { const b = cv.current!.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  const screen = (n: CanvasToolbarNode) => { const b = boxOf(n); return { l: b.x * zoom + panX, t: b.y * zoom + panY, r: (b.x + b.w) * zoom + panX, b: (b.y + b.h) * zoom + panY }; };
  const down = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.button !== 1) return;
    const p = pt(e), node = (e.target as Element).closest<HTMLElement>('.dm-ctb-n');
    cv.current?.focus({ preventScroll: true }); e.preventDefault();
    if (commenting && e.button === 0) {
      const at = { x: Math.round((p[0] - panX) / zoom), y: Math.round((p[1] - panY) / zoom) };
      if (!comments) setPins(x => [...x, at]); onComment?.(at); setCommenting(false); setSay(`Comment ${shownPins.length + 1} placed`); return;
    }
    const kind = e.button === 1 || tool === 'hand' ? 'pan' : tool === 'select' ? (node ? 'move' : 'box') : 'lasso';
    let now = sel;
    if (kind === 'move') { const id = node!.dataset.id!; if (e.shiftKey) now = sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]; else if (!sel.includes(id)) now = [id]; if (now !== sel) setSel(now); }
    else if (kind !== 'pan' && !e.shiftKey && sel.length) { now = []; setSel(now); }
    drag.current = { kind, p0: p, view, from: Object.fromEntries(nodes.map(n => [n.id, pos(n)])), base: now, pts: [p] };
    if (kind === 'pan') setPanning(true);
    try { cv.current?.setPointerCapture(e.pointerId); } catch { /* the pointer has gone already */ }
  };
  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current; if (!d) return;
    const p = pt(e), dx = p[0] - d.p0[0], dy = p[1] - d.p0[1];
    if (d.kind === 'pan') go({ ...d.view, panX: d.view.panX + dx, panY: d.view.panY + dy }, false);
    else if (d.kind === 'move') {
      const layout = narrow ? 'narrow' : 'wide';
      setMoved(m => ({ ...m, [layout]: { ...m[layout], ...Object.fromEntries(sel.map(id => [id, { x: d.from[id].x + dx / zoom, y: d.from[id].y + dy / zoom }])) } }));
    } else if (d.kind === 'box') {
      const b = { x: Math.min(p[0], d.p0[0]), y: Math.min(p[1], d.p0[1]), w: Math.abs(dx), h: Math.abs(dy) }; setBox(b);
      setSel([...new Set([...d.base, ...nodes.filter(n => { const s = screen(n); return s.r > b.x && s.l < b.x + b.w && s.b > b.y && s.t < b.y + b.h; }).map(n => n.id)])]);
    } else {
      d.pts.push(p); setLasso([...d.pts]);
      setSel([...new Set([...d.base, ...nodes.filter(n => { const s = screen(n); return inside([(s.l + s.r) / 2, (s.t + s.b) / 2], d.pts); }).map(n => n.id)])]);
    }
  };
  const up = () => {
    const d = drag.current; if (!d) return; drag.current = null;
    setPanning(false); setBox(null); setLasso(null);
    if (d.kind === 'move' && sel.length) onNodesMove?.(Object.fromEntries(sel.map(id => [id, pos(nodes.find(n => n.id === id)!)])), narrow);
    if (d.kind !== 'pan') setSay(sel.length ? `${sel.length} of ${nodes.length} steps selected` : 'Nothing selected');
  };
  // Ctrl or ⌘ with the wheel, or a pinch, zooms at the pointer. It is added by hand so it can stop the page zooming
  const wheel = useRef<(e: WheelEvent) => void>(() => {});
  wheel.current = e => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); const p = pt(e); zoomAt(zoom * Math.exp(-e.deltaY / 300), p[0], p[1], false); };
  useEffect(() => { const el = cv.current; if (!el) return; const f = (e: WheelEvent) => wheel.current(e); el.addEventListener('wheel', f, { passive: false }); return () => el.removeEventListener('wheel', f); }, []);

  /* ---------- the keyboard ---------- */
  const menu = usePopover({ align: 'end', side: 'up' });
  const keys = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement;
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || t.closest('.dm-ctb-menu') || /^(INPUT|TEXTAREA)$/.test(t.tagName)) return;
    const k = e.key, low = k.length === 1 ? k.toLowerCase() : '';
    if (e.shiftKey && e.code === 'Digit1') fitNow();
    else if (e.shiftKey && e.code === 'Digit0') zoomReset();
    else if (k === '+' || k === '=') zoomBy(1);
    else if (k === '-' || k === '_') zoomBy(-1);
    else if (!e.shiftKey && low && 'vhl'.includes(low)) setTool(({ v: 'select', h: 'hand', l: 'lasso' } as const)[low as 'v' | 'h' | 'l'], t.getAttribute('role') === 'radio');
    else if (!e.shiftKey && low === 'c') toggleComment();
    else if (t === cv.current && /^Arrow/.test(k)) {
      const d = e.shiftKey ? 120 : 40;
      go({ zoom, panX: panX + (k === 'ArrowLeft' ? d : k === 'ArrowRight' ? -d : 0), panY: panY + (k === 'ArrowUp' ? d : k === 'ArrowDown' ? -d : 0) });
    } else if (k === 'Escape' && (commenting || sel.length)) { if (commenting) toggleComment(false); else { setSel([]); setSay('Nothing selected'); } }
    else return;
    e.preventDefault();
  };

  /* ---------- the handle moves the toolbar: drag it, or the arrow keys on it; Home or a double click docks it ---------- */
  const [off, setOff] = useState({ x: 0, y: 0 });
  const clampOff = (o: { x: number; y: number }) => {
    const ax = Math.max(0, (size.w - size.barW) / 2 - 8);
    return { x: Math.max(-ax, Math.min(ax, o.x)), y: Math.max(-Math.max(0, size.h - size.bar - 20), Math.min(0, o.y)) };
  };
  const shown = clampOff(off);
  const [barDrag, setBarDrag] = useState(false);
  const grab = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button) return; e.preventDefault();
    const sx = e.clientX - shown.x, sy = e.clientY - shown.y, h = e.currentTarget; setBarDrag(true);
    try { h.setPointerCapture(e.pointerId); } catch { /* the pointer has gone already */ }
    const mv = (ev: PointerEvent) => setOff(clampOff({ x: ev.clientX - sx, y: ev.clientY - sy }));
    const end = () => { setBarDrag(false); h.removeEventListener('pointermove', mv); h.removeEventListener('pointerup', end); h.removeEventListener('pointercancel', end); };
    h.addEventListener('pointermove', mv); h.addEventListener('pointerup', end); h.addEventListener('pointercancel', end);
  };
  const dock = () => { setOff({ x: 0, y: 0 }); setSay('Toolbar docked'); };
  const handleKeys = (e: ReactKeyboardEvent) => {
    const d = e.shiftKey ? 48 : 16, m = ({ ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, -d], ArrowDown: [0, d] } as Record<string, number[]>)[e.key];
    if (m) { e.preventDefault(); setOff(clampOff({ x: shown.x + m[0], y: shown.y + m[1] })); } else if (e.key === 'Home') { e.preventDefault(); dock(); }
  };

  // Run says so, and a run that ends on its own says it finished
  const wasRunning = useRef(running), stopped = useRef(false);
  useEffect(() => {
    if (wasRunning.current === running) return; wasRunning.current = running;
    setSay(running ? 'Running the workflow' : stopped.current ? 'Run stopped' : 'Run finished'); stopped.current = false;
  }, [running]);

  const wire = ([a, b]: CanvasToolbarEdge) => {
    const na = nodes.find(n => n.id === a), nb = nodes.find(n => n.id === b); if (!na || !nb) return '';
    const A = boxOf(na), B = boxOf(nb);
    // side to side when the next step is beside this one, top to bottom when it is under it
    if (Math.abs(B.x - A.x) >= Math.abs(B.y - A.y)) { const ltr = B.x > A.x, x1 = ltr ? A.x + A.w : A.x, x2 = ltr ? B.x : B.x + B.w, y1 = A.y + A.h / 2, y2 = B.y + B.h / 2, m = (x1 + x2) / 2; return `M${x1} ${y1}C${m} ${y1} ${m} ${y2} ${x2} ${y2}`; }
    const dn = B.y > A.y, y1 = dn ? A.y + A.h : A.y, y2 = dn ? B.y : B.y + B.h, x1 = A.x + A.w / 2, x2 = B.x + B.w / 2, m = (y1 + y2) / 2;
    return `M${x1} ${y1}C${x1} ${m} ${x2} ${m} ${x2} ${y2}`;
  };
  const g = 16 * zoom * (zoom < .5 ? 2 : 1);
  const item = (a: string, icon: IconName, text: string, kbd: string | null, act: () => void, opts: { ovf: 1 | 2; close?: boolean; checked?: boolean; disabled?: boolean; right?: string }) => (
    <button type="button" className="dm-mi" role={opts.checked === undefined ? 'menuitem' : 'menuitemcheckbox'} aria-checked={opts.checked} aria-disabled={opts.disabled || undefined}
      tabIndex={-1} data-a={a} data-ovf={opts.ovf} onClick={() => { if (opts.disabled) return; act(); if (opts.close) menu.closeSoon(); }}>
      <Icon name={icon} /><span>{text}</span>{kbd ? <span className="dm-kbd">{kbd}</span> : <span className="dm-r dm-num">{opts.right}</span>}
    </button>
  );

  return (
    <div ref={root} data-dm="" data-tool={tool} className={cx('dm-ctb', commenting && 'dm-cm', className)} onKeyDown={keys}>
      <div ref={cv} className={cx('dm-ctb-cv', anim && 'dm-anim', panning && 'dm-pan')} tabIndex={0} role="group" aria-roledescription="canvas" aria-label={label} aria-describedby={uid + '-k'}
        style={{ backgroundSize: `${g}px ${g}px`, backgroundPosition: `${panX}px ${panY}px` }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <div className="dm-ctb-world" style={{ transform: `translate(${panX}px,${panY}px) scale(${zoom})` }}>
          {children}
          <svg className="dm-ctb-w" aria-hidden="true">
            {edges.map(e => <path key={e.join('-')} className={lit.some(l => same(l, e)) ? 'dm-lit' : undefined} d={wire(e)} />)}
          </svg>
          <div className="dm-ctb-nodes">
            {nodes.map((n, i) => {
              const p = pos(n);
              return (
                <div key={n.id} ref={el => { els.current[n.id] = el; }} data-id={n.id} className={cx('dm-ctb-n dm-in', sel.includes(n.id) && 'dm-sel', n.state === 'run' && 'dm-run')}
                  style={{ left: p.x, top: p.y, animationDelay: i * 90 + 'ms' }}>
                  <span className="dm-ic" style={{ color: n.iconColor ?? n.color, background: `color-mix(in srgb,${n.color} 14%,transparent)` }}><Icon name={n.icon} size="xs" /></span>
                  <span className="dm-t"><b>{n.title}</b>{n.detail && <span>{n.detail}</span>}</span>
                  {n.state && <span className="dm-s" aria-hidden="true">{n.state === 'run' ? <span className="dm-spin" /> : <Icon name="check" size="xs" />}</span>}
                </div>
              );
            })}
          </div>
          {shownPins.map((c, i) => <span key={i} className="dm-ctb-pin" aria-hidden="true" style={{ left: c.x, top: c.y }}>{i + 1}</span>)}
        </div>
        <svg className="dm-ctb-lz" aria-hidden="true"><path d={lasso ? 'M' + lasso.map(q => q.map(Math.round).join(' ')).join('L') + 'Z' : ''} /></svg>
        {box && <div className="dm-ctb-mq" style={{ left: box.x, top: box.y, width: box.w, height: box.h }} />}
        <span className="dm-ctb-sr" id={uid + '-k'}>V, H and L pick a tool, C adds a comment, Shift 1 fits the workflow to the screen, minus and plus zoom, and the arrow keys move the view.</span>
      </div>
      <div ref={bar} className={cx('dm-ctb-bar', barDrag && 'dm-drag')} role="toolbar" aria-label="Canvas tools" style={{ ['--dm-dx' as string]: Math.round(shown.x) + 'px', ['--dm-dy' as string]: Math.round(shown.y) + 'px' }}>
        <Tip label="Drag to move"><button type="button" className="dm-ctb-b dm-ctb-hd" aria-label="Move toolbar" onPointerDown={grab} onDoubleClick={dock} onKeyDown={handleKeys}><Icon name="grip" /></button></Tip>
        <span className="dm-ctb-sep" />
        <button type="button" className={cx('dm-pill dm-primary dm-ctb-run', running && 'dm-stop')} onClick={() => { if (running) { stopped.current = true; onStop?.(); } else onRun?.(); }}>
          <Icon name={running ? 'stop' : 'play'} size="xs" /><span>{running ? stopLabel : runLabel}</span>
        </button>
        <span className="dm-ctb-sep" />
        <div className="dm-ctb-tools" role="radiogroup" aria-label="Tool" onKeyDown={toolKeys}>
          {TOOLS.map(x => (
            <Tip key={x.t} label={x.tip} kbd={x.key}>
              <button type="button" className="dm-ctb-b" role="radio" aria-checked={tool === x.t} tabIndex={tool === x.t ? 0 : -1} data-t={x.t} aria-label={NAMES[x.t]} onClick={() => setTool(x.t)}><Icon name={x.icon} /></button>
            </Tip>
          ))}
        </div>
        <span className="dm-ctb-sep" data-ovf="1" />
        <Tip label="Comment" kbd="C"><button type="button" className="dm-ctb-b dm-ctb-cm" data-ovf="1" aria-pressed={commenting} aria-label="Comment" onClick={() => toggleComment()}><Icon name="comment" /></button></Tip>
        <Tip label="Fit to screen" kbd="⇧1"><button type="button" className="dm-ctb-b dm-ctb-fit" data-ovf="1" aria-label="Fit to screen" onClick={fitNow}><Icon name="fit" /></button></Tip>
        <span className="dm-ctb-sep" data-ovf="2" />
        <Tip label="Zoom out" kbd="−"><button type="button" className="dm-ctb-b dm-ctb-zo" data-ovf="2" aria-label="Zoom out" aria-disabled={lo} onClick={() => zoomBy(-1)}><Icon name="minus" /></button></Tip>
        <Tip label="Zoom to 100%" kbd="⇧0"><button type="button" className="dm-ctb-z dm-num" data-ovf="2" aria-label={`Zoom ${pct}, reset to 100%`} onClick={zoomReset}>{pct}</button></Tip>
        <Tip label="Zoom in" kbd="+"><button type="button" className="dm-ctb-b dm-ctb-zi" data-ovf="2" aria-label="Zoom in" aria-disabled={hi} onClick={() => zoomBy(1)}><Icon name="plus" /></button></Tip>
        <Tip label="More" off={menu.open}><button type="button" {...menu.trigger} className="dm-ctb-b dm-ctb-more" aria-label="More tools"><Icon name="more" /></button></Tip>
      </div>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-ctb-menu')} role="menu" aria-label="More tools">
        {item('comment', 'comment', 'Comment', 'C', () => toggleComment(), { ovf: 1, close: true, checked: commenting })}
        {item('fit', 'fit', 'Fit to screen', '⇧1', fitNow, { ovf: 1, close: true })}
        {item('out', 'minus', 'Zoom out', '−', () => zoomBy(-1), { ovf: 2, disabled: lo })}
        {item('in', 'plus', 'Zoom in', '+', () => zoomBy(1), { ovf: 2, disabled: hi })}
        {item('reset', 'search', 'Zoom to 100%', null, zoomReset, { ovf: 2, close: true, right: pct })}
      </div>
      <p className="dm-ctb-live" aria-live="polite">{say}</p>
    </div>
  );
}
```

## More in Workspace

- [Automation canvas](https://designme.dev/components/automation-canvas.md): A trigger, a few agent steps, and a run you can watch flow through.
- [Step library](https://designme.dev/components/step-library.md): Search the steps a workflow can use, preview what each does, and add one.
- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
- [Memory panel](https://designme.dev/components/memory-panel.md): What the agent remembers about your team, editable and removable.
- [Model compare](https://designme.dev/components/model-compare.md): Run one prompt on three models side by side and keep the best.
- [Agent settings](https://designme.dev/components/agent-settings.md): How much the agent may do alone, with a save bar for changes.
- [Tools and connections](https://designme.dev/components/tool-connections.md): The tools the agent can reach, and how much it may do with each.
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md): The files, sites and folders the agent knows, and how far each is indexed.
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md): Tasks the agent runs on a schedule, with their last result and a switch.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.
- [Workspace rail](https://designme.dev/components/workspace-rail.md): A slim app rail that opens into a labelled sidebar.

All components: https://designme.dev/llms.txt
