'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ZoomBar } from '../components/zoom-bar/ZoomBar';
import { Demo } from './Demo';
import { useStory } from './useScript';

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
