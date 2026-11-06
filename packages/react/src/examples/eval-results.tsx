'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { EvalResults, type EvalCase } from '../components/eval-results/EvalResults';
import { useStory, useWait } from './useScript';

/* ---------- Eval results: run the evals, see one fail against the last run, open it, take the fix, and see all eight pass ---------- */
// eight checks on the pricing page's copy. The price check fails after the copy agent's latest edit, until it's fixed
const CASES: EvalCase[] = [
  { id: 'seat', name: 'Names the Pro seat limit', time: '0.6s', status: 'pass' },
  { id: 'price', name: 'Prices match the billing table', time: '0.9s', status: 'pass', expected: '$24 a seat, billed yearly', got: '$29 a seat, billed yearly', source: 'Billing table, Pro row' },
  { id: 'yearly', name: 'Mentions the yearly discount', time: '0.5s', status: 'pass' },
  { id: 'unl', name: 'Makes no “unlimited” claims', time: '0.4s', status: 'pass' },
  { id: 'sso', name: 'Team plan lists SSO', time: '0.5s', status: 'pass' },
  { id: 'grade', name: 'Reads at grade 8 or below', time: '0.7s', status: 'pass' },
  { id: 'cta', name: 'One call to action per plan', time: '0.5s', status: 'pass' },
  { id: 'free', name: 'Free plan says no card is needed', time: '0.6s', status: 'pass' }
];

export default function EvalResultsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [cases, setCases] = useState(CASES);
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const fixed = useRef(false);
  const set = (id: string, status: EvalCase['status']) => setCases(cs => cs.map(k => k.id === id ? { ...k, status } : k));

  // a run checks the cases one after another; the price check fails until the copy is fixed
  const runAll = async () => {
    setRunning(true); setRan(true); setCases(cs => cs.map(k => ({ ...k, status: 'queued' })));
    for (const k of CASES) {
      set(k.id, 'running'); await wait(500);
      set(k.id, k.id === 'price' && !fixed.current ? 'fail' : 'pass');
    }
    setRunning(false);
  };
  // the fix changes the copy to the billing table's price and runs that case again
  const fix = async () => { fixed.current = true; set('price', 'running'); await wait(1000); set('price', 'pass'); };

  // the preview's story: run the evals, show the failed ones, open the price check and take its fix, then show them all
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-evr-run');
    await wait(4000 + 1500); press('.dm-seg2 button:last-of-type');
    await wait(1000); press('.dm-evr-i.dm-fail .dm-evr-r');
    await wait(1500); press('.dm-evr-fix');
    await wait(2000); press('.dm-seg2 button:first-of-type');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <EvalResults title="Pricing copy evals" subtitle={`Copy agent · 8 cases · run ${ran && !running ? 'just now' : '2h ago'}`}
        cases={cases.map(k => k.id === 'price' && k.status === 'fail' ? { ...k, fix: { label: 'Use $24 and rerun', onClick: () => void fix() } } : k)}
        onRun={() => void runAll()} running={running} runLabel={ran ? 'Run again' : 'Run evals'} previousPassed={ran ? 8 : undefined} />
    </div>
  );
}
