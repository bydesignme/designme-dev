'use client';
import { useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Tip } from '../../lib/motion';
import '../../designme.css';
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
