'use client';
import { Fragment, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Tip } from '../../lib/motion';
import '../../designme.css';
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
