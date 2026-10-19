'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { ErrorRecovery, type RecoveryStep } from '../components/error-recovery/ErrorRecovery';
import { useScript } from './useScript';

/* ---------- Error and recovery: step 2 failed; pick how to carry on and the run plays it out ---------- */
const OPTIONS = [
  { value: 'retry', label: 'Ask for edit access, then retry' },
  { value: 'skip', label: 'Skip it and post the summary' },
  { value: 'hand', label: 'Hand it over to Maya' }
];
export default function ErrorRecoveryDemo() {
  const [steps, setSteps] = useState<RecoveryStep[]>([
    { label: 'Pull 1,240 deals from the CRM', state: 'done', note: 'Done in 8s' },
    { label: 'Write to the Pipeline 2026 sheet', state: 'fail', note: 'Error 403: the agent lost edit access to this sheet' },
    { label: 'Post the summary in #sales', state: 'wait' }
  ]);
  const [status, setStatus] = useState('Stopped at step 2');
  const [choice, setChoice] = useState<string | null>(null);
  const set = (i: number, state: RecoveryStep['state'], note?: string) => setSteps(s => s.map((x, k) => k === i ? { ...x, state, note } : x));
  // plays out the chosen recovery once Continue is pressed
  useScript(async ({ wait }) => {
    if (choice === 'retry') {
      set(1, 'run', 'Asking for edit access'); setStatus('Recovering'); await wait(1200);
      set(1, 'run', 'Access granted, retrying'); await wait(1000);
      set(1, 'done', 'Wrote 1,240 rows'); set(2, 'run'); await wait(1000);
      set(2, 'done', 'Posted to 14 people'); setStatus('Recovered');
    } else if (choice === 'skip') {
      set(1, 'skip', 'Skipped, nothing was written'); set(2, 'run'); await wait(1000);
      set(2, 'done', 'Posted, with a note about the sheet'); setStatus('2 of 3 done');
    } else if (choice === 'hand') {
      set(1, 'hand', 'Maya has the error, the logs and the last good state'); setStatus('Waiting on Maya');
    }
  }, [choice]);
  return (
    <div style={{ width: '100%' }}>
      <ErrorRecovery title="Sync the pipeline to Sheets" status={status} steps={steps} options={OPTIONS} onContinue={setChoice} />
    </div>
  );
}
