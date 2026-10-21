'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { RunCost, type RunCostStatus } from '../components/run-cost/RunCost';

/* ---------- Run cost: the run starts by itself and burns credits until the cap pauses it; raise the cap to finish ---------- */
const BUDGET = 2000;

export default function RunCostDemo() {
  const [status, setStatus] = useState<RunCostStatus>('idle');
  const [capOn, setCapOn] = useState(true);
  const [n, setN] = useState({ used: 0, input: 0, output: 0, tools: 0 });
  // the ticker reads these without restarting
  const live = useRef({ n, capOn });
  useEffect(() => { live.current = { n, capOn }; });

  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(() => {
      const { n: p, capOn: cap } = live.current, limit = cap ? BUDGET * 0.9 : BUDGET;
      const next = { used: Math.min(BUDGET, p.used + 8 + Math.random() * 18), input: p.input + 120 + Math.random() * 220, output: p.output + 30 + Math.random() * 70, tools: p.tools + (Math.random() < 0.12 ? 1 : 0) };
      if (next.used >= limit) { next.used = limit; setStatus(limit < BUDGET ? 'paused' : 'spent'); }
      live.current.n = next; setN(next);
    }, 90);
    return () => clearInterval(id);
  }, [status]);

  // the run starts by itself once the card has settled, unless someone got there first
  const touched = useRef(false);
  useEffect(() => { const t = setTimeout(() => { if (!touched.current) setStatus(s => (s === 'idle' ? 'running' : s)); }, 1500); return () => clearTimeout(t); }, []);

  const act = () => {
    if (status === 'running') return setStatus('stopped');
    // Raise cap turns the pause off and carries on to the full budget
    if (status === 'paused') { setCapOn(false); live.current.capOn = false; }
    if (n.used >= BUDGET) setN({ used: 0, input: 0, output: 0, tools: 0 });
    setStatus('running');
  };

  return (
    <div style={{ width: '100%' }} onPointerDownCapture={() => { touched.current = true; }}>
      <RunCost used={n.used} budget={BUDGET} capOn={capOn} onCapChange={setCapOn} status={status} onAction={act}
        rows={[{ label: 'Input tokens', value: n.input }, { label: 'Output tokens', value: n.output }, { label: 'Tool calls', value: n.tools }]} />
    </div>
  );
}
