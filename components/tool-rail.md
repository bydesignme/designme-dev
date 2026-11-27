# Tool rail

> A board's tools in one vertical rail: pick one, and its name and key show on hover.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/tool-rail

## Install

```sh
npx designme add tool-rail          # HTML, CSS and JS, with the shared core
npx designme add tool-rail --react  # React 19 component and its CSS
npx designme add tool-rail --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/tool-rail.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/tool-rail.json  # Astro
```

## About

Tool rail is the vertical rail of tools from the Whiteboard template: Select and Pan, then Sticky note, Pen, Eraser, Shape, Connector and Text, then Comment, in three groups split by short lines. One tool is picked at a time. The picked tool sits on a soft accent tint (in Clean, its neutral selected fill), and each tool shows its name and its letter in a tooltip on hover.

### When to use it

- When a board, a canvas or a drawing surface needs its tools within reach at the edge of the screen.
- When people switch tools often and should always see which one is on.
- When the tools fall into a few groups (moving round, making things, talking about them) that a line can split.
- Not for actions that happen at once, like undo or zoom: Zoom bar holds those.

### What it does

- The nine tools are one radio group: a click picks a tool and unpicks the one before. The rail only shows the pick; what each tool does on your board is yours to wire up.
- Each tool's tooltip shows its name and letter: V Select, H Pan, S Sticky note, P Pen, E Eraser, R Shape, A Connector, T Text, C Comment.
- While the focus is in the rail, the arrow keys move the pick up and down it (wrapping at the ends) and a tool's letter picks that tool. The rail listens to no keys outside it.
- Hover is the quiet row fill in the button's own shape, and a press shows at once as a deeper fill, with no scale.
- The rail is Canvas toolbar's bar stood on its end: the same 32px buttons, the same raised pill with its shadow, square in Blueprint and plush squircles in Soft.
- In React, `ToolRail` takes `value` or `defaultValue` and calls `onChange` with the tool's id (`select`, `hand`, `sticky`, `pen`, `eraser`, `shape`, `arrow`, `text` or `comment`).

### Accessibility

- The rail is a `toolbar` with `aria-orientation="vertical"`, and the tools are a `radiogroup` of `radio` buttons, each with `aria-checked` and an `aria-label`.
- Only the picked tool is in the tab order; the arrow keys reach the others, the way a radio group works.
- The dividers are `aria-hidden`, so a screen reader hears only the tools.

## Usage in React

```tsx
import { ToolRail } from '@/components/designme/tool-rail/ToolRail';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ToolRail, type ToolRailTool } from './ToolRail';
import { Demo } from '../lib/Demo';
import { useStory } from '../lib/useScript';

/* ---------- Tool rail: try the pen, a sticky note and a comment, then back to Select ---------- */
export default function ToolRailDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<ToolRailTool>('select');
  useStory(ref, async ({ wait, press }) => {
    await wait(1000);
    for (const t of ['pen', 'sticky', 'comment', 'select']) { await wait(2000); press(`.dm-tlr-b[data-t="${t}"]`); }
  });
  return <Demo ref={ref} switcher={null}><ToolRail value={tool} onChange={setTool} /></Demo>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `value` (optional) | `ToolRailTool` | The picked tool, when you keep it in your state |
| `defaultValue` (optional) | `ToolRailTool` | The tool picked at first, when the rail keeps it. Defaults to 'select' |
| `onChange` (optional) | `(tool: ToolRailTool) => void` | Called with the tool a click, an arrow key or a tool's letter picks |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ToolRail from '../components/designme/tool-rail/ToolRail.astro';
---
<ToolRail />
<ToolRail data-style="soft" class="my-class" />
```
It plays its demo; change `tool-rail.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I make the letters work anywhere on my board?**

Listen for the keys on your board and set the tool yourself: in React pass `value` and change it from your handler; in HTML click the tool's button (`.tlr-b[data-t="pen"]`) from yours. The rail answers its letters only while it has the focus.

**Can I lay it out across instead of down?**

The rail is drawn down the side, as on the Whiteboard. For tools across the bottom of a canvas, Canvas toolbar is the horizontal bar.

**Why does Clean show a grey fill on the picked tool?**

Clean keeps its controls monochrome: the picked tool takes its one neutral selected fill, where Soft and Blueprint use the accent tint.

## Source

`ToolRail.tsx`, as `npx designme add tool-rail --react` installs it:

```tsx
'use client';
import { Fragment, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Tip } from '../lib/motion';
import '../designme.css';
import './tool-rail.css';

/** A tool on the rail, by its id */
export type ToolRailTool = 'select' | 'hand' | 'sticky' | 'pen' | 'eraser' | 'shape' | 'arrow' | 'text' | 'comment';

// the Whiteboard's tools in their three groups: moving round, making things, talking about them
const GROUPS: { t: ToolRailTool; icon: IconName; name: string; key: string }[][] = [
  [{ t: 'select', icon: 'cursor', name: 'Select', key: 'V' }, { t: 'hand', icon: 'hand', name: 'Pan', key: 'H' }],
  [{ t: 'sticky', icon: 'sticky', name: 'Sticky note', key: 'S' }, { t: 'pen', icon: 'pen', name: 'Pen', key: 'P' }, { t: 'eraser', icon: 'eraser', name: 'Eraser', key: 'E' },
    { t: 'shape', icon: 'shape', name: 'Shape', key: 'R' }, { t: 'arrow', icon: 'connector', name: 'Connector', key: 'A' }, { t: 'text', icon: 'text', name: 'Text', key: 'T' }],
  [{ t: 'comment', icon: 'comment', name: 'Comment', key: 'C' }]
];
const ALL = GROUPS.flat();

export interface ToolRailProps {
  /** The picked tool, when you keep it in your state */
  value?: ToolRailTool;
  /** The tool picked at first, when the rail keeps it. Defaults to 'select' */
  defaultValue?: ToolRailTool;
  /** Called with the tool a click, an arrow key or a tool's letter picks */
  onChange?: (tool: ToolRailTool) => void;
  className?: string;
}

/** A board's tools in one vertical rail, one picked at a time, from the Whiteboard template. The arrows and each tool's
    letter pick a tool while the focus is in the rail */
export function ToolRail({ value, defaultValue = 'select', onChange, className }: ToolRailProps) {
  const [tool, setTool] = useControllable(value, defaultValue, onChange);
  const bar = useRef<HTMLDivElement>(null);
  const pick = (t: ToolRailTool) => {
    setTool(t);
    bar.current?.querySelector<HTMLButtonElement>(`[data-t="${t}"]`)?.focus();
  };
  const onKey = (e: ReactKeyboardEvent) => {
    const d = ({ ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 } as Record<string, number>)[e.key];
    const at = ALL.findIndex(x => x.t === (document.activeElement as HTMLElement | null)?.dataset.t);
    const next = d ? ALL[(at + d + ALL.length) % ALL.length] : !e.metaKey && !e.ctrlKey && !e.altKey ? ALL.find(x => x.key.toLowerCase() === e.key.toLowerCase()) : undefined;
    if (!next) return;
    e.preventDefault(); pick(next.t);
  };
  return (
    <div className={cx('dm-tlr', className)} data-dm="">
      <div ref={bar} className="dm-tlr-bar" role="toolbar" aria-label="Tools" aria-orientation="vertical" onKeyDown={onKey}>
        <div className="dm-tlr-tools" role="radiogroup" aria-label="Tool">
          {GROUPS.map((g, i) => (
            <Fragment key={i}>
              {i > 0 && <span className="dm-tlr-sep" aria-hidden="true" />}
              {g.map(x => (
                <Tip key={x.t} label={x.name} kbd={x.key}>
                  <button type="button" className="dm-tlr-b dm-mx-press" role="radio" aria-checked={tool === x.t} tabIndex={tool === x.t ? 0 : -1} data-t={x.t} aria-label={x.name} onClick={() => setTool(x.t)}><Icon name={x.icon} /></button>
                </Tip>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## More in Workspace

- [Zoom bar](https://designme.dev/components/zoom-bar.md): Undo, redo, zoom and fit in one floating bar for a canvas.
- [Run drawer](https://designme.dev/components/run-drawer.md): A workflow's run under its canvas: the steps, the log and the data.
- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
- [Memory panel](https://designme.dev/components/memory-panel.md): What the agent remembers about your team, editable and removable.
- [Tools and connections](https://designme.dev/components/tool-connections.md): The tools the agent can reach, and how much it may do with each.
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md): The files, sites and folders the agent knows, and how far each is indexed.
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md): Tasks the agent runs on a schedule, with their last result and a switch.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.

All components: https://designme.dev/llms.txt
