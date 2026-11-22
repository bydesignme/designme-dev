'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { CanvasToolbar, type CanvasToolbarEdge, type CanvasToolbarHandle, type CanvasToolbarNode } from '../components/canvas-toolbar/CanvasToolbar';
import { useScript, useStory } from './useScript';

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
