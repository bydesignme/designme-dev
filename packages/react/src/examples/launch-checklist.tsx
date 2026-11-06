'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { LaunchChecklist, type CheckState, type LaunchChecklistProps } from '../components/launch-checklist/LaunchChecklist';
import { useScript, useTakeover } from './useScript';

/* ---------- Launch checklist: six checks run in turn, two fail and get fixed, then it ships ---------- */
const CHECKS: [label: string, problem: string | null, result: string][] = [
  ['Contrast meets AA', null, 'All 14 text pairs pass'],
  ['Uses library tokens', '3 raw hex values in the FAQ', 'Swapped to color.text.muted'],
  ['Responsive at 375px', null, 'No overflow on 3 breakpoints'],
  ['Alt text on images', '2 icons have no label', 'Added labels from the layer names'],
  ['Links resolve', null, '12 of 12 links return 200'],
  ['Copy matches the brief', null, 'Prices and plan names match']
];
type Row = { state: CheckState; note?: string };
const fresh = (): Row[] => CHECKS.map(() => ({ state: 'wait' }));

export default function LaunchChecklistDemo() {
  const [rows, setRows] = useState<Row[]>(fresh);
  const [status, setStatus] = useState(`${CHECKS.length} checks`);
  const [phase, setPhase] = useState<'idle' | 'running' | 'checked' | 'shipped'>('idle');
  const [runs, setRuns] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  // the checks run once on its own, unless you take over first; the fixes are left for you
  const ref = useRef<HTMLDivElement>(null), mine = useTakeover(ref);
  useScript(async ({ wait }) => { await wait(1300); if (!mine()) setRuns(r => r || 1); });
  const set = (i: number, row: Row) => setRows(rs => rs.map((r, k) => k === i ? row : r));
  const tally = (rs: Row[]) => { const bad = rs.filter(r => r.state === 'bad').length; setStatus(bad ? `${bad} to fix before shipping` : 'All clear, ready to ship'); };

  useScript(async ({ wait }) => {
    if (!runs) return;
    setStatus('Checking'); setPhase('running');
    const out = fresh();
    for (let i = 0; i < CHECKS.length; i++) {
      set(i, { state: 'run', note: 'Checking' }); await wait(520 + Math.random() * 300);
      out[i] = CHECKS[i][1] ? { state: 'bad', note: CHECKS[i][1]! } : { state: 'ok', note: CHECKS[i][2] }; set(i, out[i]);
    }
    setPhase('checked'); tally(out);
  }, [runs]);

  const fix = (i: number) => {
    set(i, { state: 'run', note: 'Fixing' });
    timers.current.push(setTimeout(() => setRows(rs => { const next = rs.map((r, k) => k === i ? { state: 'ok' as const, note: CHECKS[i][2] } : r); tally(next); return next; }), 900));
  };
  const clear = phase === 'checked' && rows.every(r => r.state === 'ok');
  const action: LaunchChecklistProps['action'] =
    phase === 'shipped' ? { label: 'Ship it', icon: 'rocket', accent: true, disabled: true }
    : clear ? { label: 'Ship it', icon: 'rocket', accent: true, onClick: () => { setStatus('Shipped to production'); setPhase('shipped'); } }
    : phase === 'checked' ? { label: 'Run again', icon: 'refresh', onClick: () => { timers.current.forEach(clearTimeout); setRows(fresh()); setStatus(`${CHECKS.length} checks`); setPhase('idle'); setRuns(0); } }
    : { label: 'Run checks', icon: 'play', disabled: phase === 'running', onClick: () => setRuns(r => r + 1) };

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <LaunchChecklist title="Ready to ship pricing?" status={status} action={action}
        checks={rows.map((r, i) => ({ label: CHECKS[i][0], state: r.state, note: r.note, onFix: r.state === 'bad' ? () => fix(i) : undefined }))} />
    </div>
  );
}
