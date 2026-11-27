# Zoom bar

> Undo, redo, zoom and fit in one floating bar for a canvas.

Components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/zoom-bar

## Install

```sh
npx designme add zoom-bar          # HTML, CSS and JS, with the shared core
npx designme add zoom-bar --react  # React 19 component and its CSS
npx designme add zoom-bar --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/zoom-bar.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/zoom-bar.json  # Astro
```

## About

Zoom bar is the floating view bar from the Whiteboard template: Undo and Redo, then Zoom out, the zoom level and Zoom in, then Fit to screen, in one raised pill. Minus and plus step the level it shows, a press on the level sets it back to 100%, and Undo, Redo and Fit press and call you, so your canvas does the work.

### When to use it

- When a board or canvas needs its undo history and its zoom in one place, out of the way in a corner.
- When people should always see how far in they are zoomed, and get back to 100% in one press.
- Next to Tool rail, which holds the tools while this holds the view.
- Not when the canvas already has a full toolbar with zoom in it: Canvas toolbar has its own.

### What it does

- Zoom out and Zoom in step through 25%, 33%, 50%, 67%, 75%, 90%, 100%, 125%, 150%, 200%, 300% and 400%. At 25% Zoom out greys out and at 400% Zoom in does, each keeping its place.
- The level between them shows the zoom as a percentage in tabular figures, and a press on it sets it back to 100%.
- Undo, Redo and Fit to screen show their hover and press and nothing more in HTML; in React `onUndo`, `onRedo` and `onFit` call you.
- Tooltips name each button with its shortcut (⌘Z, ⇧⌘Z, −, ⇧0, + and ⇧1). While the focus is in the bar, minus and plus step the level and Shift 0 resets it; bind the others in your app.
- Hover is the quiet row fill in the button's own shape, and a press shows at once as a deeper fill, with no scale.
- In React, `ZoomBar` takes `zoom` or `defaultZoom` (1 is 100%) and calls `onZoomChange` with the new level.

### Accessibility

- The bar is a `toolbar`, and every button has an `aria-label`; the level's says the zoom and that a press sets it to 100%.
- A greyed step is `aria-disabled`, so it stays in the tab order and keeps the focus where it was.
- Each new level is read out through a polite live region.

## Usage in React

```tsx
import { ZoomBar } from '@/components/designme/zoom-bar/ZoomBar';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ZoomBar } from './ZoomBar';
import { Demo } from '../lib/Demo';
import { useStory } from '../lib/useScript';

/* ---------- Zoom bar: zoom in twice, out once, undo, fit, and back to 100% ---------- */
export default function ZoomBarDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  useStory(ref, async ({ wait, press }) => {
    await wait(1000);
    for (const b of ['Zoom in', 'Zoom in', 'Zoom out', 'Undo', 'Fit to screen']) { await wait(1000); press(`button[aria-label="${b}"]`); }
    await wait(1000); press('.dm-zmb-z');
  });
  return <Demo ref={ref} switcher={null}><ZoomBar zoom={zoom} onZoomChange={setZoom} /></Demo>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `zoom` (optional) | `number` | The zoom level, 1 being 100%, when you keep it in your state |
| `defaultZoom` (optional) | `number` | The level at first, when the bar keeps it. Defaults to 1 |
| `onZoomChange` (optional) | `(zoom: number) => void` | Called with the level Zoom out, Zoom in or a press on the level (100%) sets |
| `steps` (optional) | `number[]` | The levels to step through, smallest first. Defaults to ZOOM_STEPS |
| `onUndo` (optional) | `() => void` |  |
| `onRedo` (optional) | `() => void` |  |
| `onFit` (optional) | `() => void` |  |
| `canUndo` (optional) | `boolean` | False greys Undo out. Defaults to true |
| `canRedo` (optional) | `boolean` | False greys Redo out. Defaults to true |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ZoomBar from '../components/designme/zoom-bar/ZoomBar.astro';
---
<ZoomBar />
<ZoomBar data-style="soft" class="my-class" />
```
It plays its demo; change `zoom-bar.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I connect it to my canvas?**

In React, keep the level in your state with `zoom` and `onZoomChange`, and scale your canvas by it; `onFit` is where you work out the level that fits and set it. In HTML, read the level from the `.zmb-zl` button's text and listen for clicks on `.zmb-undo`, `.zmb-redo` and `.zmb-fit`.

**Can I use other zoom steps?**

In React pass `steps`, a list of levels where 1 is 100%. In HTML change `STEPS` in its script.

**Why are Undo and Redo never greyed out?**

The bar doesn't know your history. In React pass `canUndo={false}` or `canRedo={false}` to grey one out when there is nothing to undo or redo.

## Source

`ZoomBar.tsx`, as `npx designme add zoom-bar --react` installs it:

```tsx
'use client';
import { useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Tip } from '../lib/motion';
import '../designme.css';
import './zoom-bar.css';

/** The levels Zoom out and Zoom in step through, as the Whiteboard's. 1 is 100% */
export const ZOOM_STEPS = [0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1, 1.25, 1.5, 2, 3, 4];

export interface ZoomBarProps {
  /** The zoom level, 1 being 100%, when you keep it in your state */
  zoom?: number;
  /** The level at first, when the bar keeps it. Defaults to 1 */
  defaultZoom?: number;
  /** Called with the level Zoom out, Zoom in or a press on the level (100%) sets */
  onZoomChange?: (zoom: number) => void;
  /** The levels to step through, smallest first. Defaults to ZOOM_STEPS */
  steps?: number[];
  onUndo?: () => void;
  onRedo?: () => void;
  onFit?: () => void;
  /** False greys Undo out. Defaults to true */
  canUndo?: boolean;
  /** False greys Redo out. Defaults to true */
  canRedo?: boolean;
  className?: string;
}

/** Undo, redo, zoom and fit in one floating bar for a canvas, from the Whiteboard template. Minus and plus step the level,
    a press on the level sets it to 100%; Undo, Redo and Fit call you */
export function ZoomBar({ zoom: zoomProp, defaultZoom = 1, onZoomChange, steps = ZOOM_STEPS, onUndo, onRedo, onFit, canUndo = true, canRedo = true, className }: ZoomBarProps) {
  const [zoom, setZoom] = useControllable(zoomProp, defaultZoom, onZoomChange);
  const [said, setSaid] = useState('');
  const pct = Math.round(zoom * 100) + '%';
  const lo = zoom <= steps[0] + 1e-3, hi = zoom >= steps[steps.length - 1] - 1e-3;
  const set = (z: number) => { setZoom(z); setSaid('Zoom ' + Math.round(z * 100) + '%'); };
  const step = (d: 1 | -1) => { const n = d > 0 ? steps.find(x => x > zoom + 1e-3) : [...steps].reverse().find(x => x < zoom - 1e-3); if (n !== undefined) set(n); };
  // minus, plus and Shift 0 step and reset the level while the focus is in the bar
  const onKey = (e: ReactKeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '-' || e.key === '−') { e.preventDefault(); step(-1); }
    else if (e.key === '+' || e.key === '=') { e.preventDefault(); step(1); }
    else if (e.shiftKey && (e.key === ')' || e.code === 'Digit0')) { e.preventDefault(); set(1); }
  };
  const off = (on: boolean, fn?: () => void) => () => { if (on) fn?.(); };
  return (
    <div className={cx('dm-zmb', className)} data-dm="">
      <div className="dm-zmb-bar" role="toolbar" aria-label="View" onKeyDown={onKey}>
        <Tip label="Undo" kbd="⌘Z"><button type="button" className="dm-zmb-b dm-mx-press" aria-label="Undo" aria-disabled={!canUndo} onClick={off(canUndo, onUndo)}><Icon name="undo" /></button></Tip>
        <Tip label="Redo" kbd="⇧⌘Z"><button type="button" className="dm-zmb-b dm-mx-press" aria-label="Redo" aria-disabled={!canRedo} onClick={off(canRedo, onRedo)}><Icon name="redo" /></button></Tip>
        <span className="dm-zmb-sep" aria-hidden="true" />
        <Tip label="Zoom out" kbd="−"><button type="button" className="dm-zmb-b dm-mx-press" aria-label="Zoom out" aria-disabled={lo} onClick={() => step(-1)}><Icon name="minus" /></button></Tip>
        <Tip label="Zoom to 100%" kbd="⇧0"><button type="button" className="dm-zmb-z dm-mx-press dm-num" aria-label={`Zoom ${pct}, zoom to 100%`} onClick={() => set(1)}>{pct}</button></Tip>
        <Tip label="Zoom in" kbd="+"><button type="button" className="dm-zmb-b dm-mx-press" aria-label="Zoom in" aria-disabled={hi} onClick={() => step(1)}><Icon name="plus" /></button></Tip>
        <span className="dm-zmb-sep" aria-hidden="true" />
        <Tip label="Fit to screen" kbd="⇧1"><button type="button" className="dm-zmb-b dm-mx-press" aria-label="Fit to screen" onClick={onFit}><Icon name="fit" /></button></Tip>
      </div>
      <p className="dm-zmb-live" aria-live="polite">{said}</p>
    </div>
  );
}
```

## More in Workspace

- [Tool rail](https://designme.dev/components/tool-rail.md): A board's tools in one vertical rail: pick one, and its name and key show on hover.
- [Run drawer](https://designme.dev/components/run-drawer.md): A workflow's run under its canvas: the steps, the log and the data.
- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
- [Memory panel](https://designme.dev/components/memory-panel.md): What the agent remembers about your team, editable and removable.
- [Tools and connections](https://designme.dev/components/tool-connections.md): The tools the agent can reach, and how much it may do with each.
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md): The files, sites and folders the agent knows, and how far each is indexed.
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md): Tasks the agent runs on a schedule, with their last result and a switch.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.

All components: https://designme.dev/llms.txt
