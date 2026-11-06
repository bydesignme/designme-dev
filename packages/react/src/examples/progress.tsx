'use client';
// The animated preview from designme.dev, rebuilt from the React component: a run starts, its steps fill, the fourth step
// times out and is retried, while the credits meter crosses 75% and then 90%.
import { useEffect, useRef, useState } from 'react';
import { Progress, type ProgressState, type ProgressStep } from '../components/progress/Progress';
import { useStory, useWait } from './useScript';

const STEPS: ProgressStep[] = [
  { label: 'Reading the sitemap', unit: 'Pages', total: 48 }, { label: 'Fetching pages', unit: 'Pages', total: 48 },
  { label: 'Indexing files', unit: 'Files', total: 2000 }, { label: 'Writing embeddings', unit: 'Chunks', total: 6400 }, { label: 'Checking links', unit: 'Links', total: 310 }
];

export default function ProgressDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ProgressState>('indeterminate');
  const [step, setStep] = useState(0);
  const [sub, setSub] = useState(0);
  const [credits, setCredits] = useState(7000);
  const live = useRef(state); live.current = state;
  const run = useRef(0);
  // the agent's run goes on whatever the visitor does; only the person in the preview (the Retry press) stops when they take over
  const wait = useWait();
  const go = async () => {
    const id = ++run.current;
    setState('indeterminate'); setStep(0); setSub(0); setCredits(7000);
    await wait(1800); if (id !== run.current) return;
    setState('running');
    let failed = false;
    for (let s = 0; s < STEPS.length; s++) {
      setStep(s); setSub(0);
      for (let k = 1; k <= 12; k++) {
        await wait(150);
        while (live.current === 'paused') await wait(100);
        if (id !== run.current) return;
        if (s === 3 && k === 6 && !failed) {
          failed = true; setState('error');
          while (live.current === 'error') await wait(100);
          await wait(400);
        }
        setSub(k / 12); setCredits(c => c + 38);
      }
    }
    setState('complete');
  };
  useEffect(() => { void go(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // the person in the preview retries the failed step; an agent at work keeps working under the pointer
  useStory(ref, async ({ wait, press }) => {
    while (live.current !== 'error') await wait(100);
    await wait(1500); press('.dm-prg-ll .dm-pill');
  }, { hold: false });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <Progress title="Indexing the docs" state={state} steps={STEPS} step={step} stepProgress={sub} error="The embeddings service timed out"
        valueText={state === 'complete' ? 'Indexed 2,000 files' : undefined}
        onPause={() => setState('paused')} onResume={() => setState('running')} onRetry={() => setState('running')} onRestart={() => { void go(); }}
        meter={{ label: 'Credits this month', value: credits, max: 10000, unit: 'credits', note: 'Resets Dec 1', dangerLabel: 'Almost out' }} />
    </div>
  );
}
