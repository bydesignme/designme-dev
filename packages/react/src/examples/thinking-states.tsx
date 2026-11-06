'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { ThinkingStates, type ThinkingVariant } from '../components/thinking-states/ThinkingStates';
import { Seg } from '../lib/motion';
import { Demo } from './Demo';
import { useScript } from './useScript';

/* ---------- Thinking states: the agent's steps taking turns, the clock starting again with each new question ---------- */
const STEPS = ['Thinking', 'Reading 3 files', 'Searching the docs', 'Comparing 2 options', 'Drafting the answer'];
export default function ThinkingStatesDemo() {
  const [variant, setVariant] = useState<ThinkingVariant>('orbit');
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(0);
  useScript(async ({ wait }) => {
    for (;;) {
      setSeconds(0);
      for (let i = 0; i < STEPS.length; i++) { setCurrent(i); for (let t = 0; t < 26; t++) { await wait(100); if (t % 10 === 9) setSeconds(s => s + 1); } }
    }
  });
  return (
    <Demo switcher={<Seg label="Thinking state" value={variant} onChange={setVariant} options={[{ value: 'orbit', label: 'Orbit' }, { value: 'morph', label: 'Morph' }, { value: 'scan', label: 'Scan' }, { value: 'stream', label: 'Stream' }, { value: 'matrix', label: 'Matrix' }, { value: 'stack', label: 'Stack' }]} />}>
      <ThinkingStates variant={variant} steps={STEPS} current={current} seconds={seconds} />
    </Demo>
  );
}
