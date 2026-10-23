'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { TraceView, type TraceSpan } from '../components/trace-view/TraceView';
import { useStory } from './useScript';

/* ---------- Trace view: the run streams in, the page fetch runs long and turns amber, and the person opens it ---------- */
type Flat = Omit<TraceSpan, 'children'> & { duration: number; parent?: string };
const RUN: Flat[] = [
  { id: 'run', kind: 'agent', name: 'Pricing research', start: 0, duration: 4.82, input: "Compare Northwind's plans with ours", output: '3 prices saved to Pricing research' },
  { id: 'plan', parent: 'run', kind: 'llm', name: 'Plan the steps', start: .04, duration: .62, tokens: 1240, input: 'The task and 2 earlier messages', output: 'Search notes, fetch the page, summarise' },
  { id: 'notes', parent: 'run', kind: 'retrieval', name: 'Search saved notes', start: .7, duration: .38, tokens: 910, input: '"northwind pricing", top 4', output: '4 notes, best match 0.82' },
  { id: 'fetch', parent: 'run', kind: 'tool', name: 'fetch_page', start: 1.12, duration: 2.46, tokens: 3120, input: 'GET northwind.app/pricing', output: '200 OK, 48 KB, 3 plans' },
  { id: 'sum', parent: 'run', kind: 'agent', name: 'Summariser', start: 3.62, duration: 1.02, input: 'The page and 4 notes', output: 'A 120-word summary' },
  { id: 'write', parent: 'sum', kind: 'llm', name: 'Write the summary', start: 3.66, duration: .94, tokens: 2380, input: 'Page text and notes, 2,050 tokens', output: '120 words, 3 prices' },
  { id: 'ans', parent: 'run', kind: 'llm', name: 'Final answer', start: 4.66, duration: .16, tokens: 560, input: 'The summary', output: '3 prices saved to Pricing research' }
];
const END = 4.82, PACE = 1.5;

// the spans as they stand `t` seconds into the run: a running one has no duration yet, and its tokens count up
function at(t: number, parent?: string): TraceSpan[] {
  return RUN.filter(x => x.parent === parent && x.start <= t).map(({ parent: _, duration, tokens, ...x }) => {
    const done = t >= x.start + duration, kids = at(t, x.id);
    return { ...x, duration: done ? duration : undefined, tokens: tokens === undefined ? undefined : Math.round(tokens * Math.min(1, (t - x.start) / duration)), children: kids.length ? kids : undefined };
  });
}

export default function TraceViewDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  // the run streams in at a pace a person can follow: one second of the run every 1.5 seconds
  useEffect(() => {
    let raf = 0, t0 = 0;
    const go = (now: number) => { t0 ||= now; const v = Math.min(END, (now - t0) / 1000 / PACE); setT(v); if (v < END) raf = requestAnimationFrame(go); };
    const start = setTimeout(() => { raf = requestAnimationFrame(go); }, 600);
    return () => { clearTimeout(start); cancelAnimationFrame(raf); };
  }, []);

  // the preview's story: open the slow fetch once the run is done, read it, then close it
  useStory(ref, async ({ wait, press }) => {
    await wait(9000); press('[data-id="fetch"]');
    await wait(4500); press('.dm-trv-x');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <TraceView title="Pricing research" spans={at(t)} time={t < END ? t : undefined} axis={5} selected={open} onSelectedChange={setOpen} />
    </div>
  );
}
