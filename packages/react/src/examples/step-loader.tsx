'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { StepLoader, type StepLoaderGlyph } from '../components/step-loader/StepLoader';
import { Seg } from '../lib/motion';
import { Demo } from './Demo';
import { useScript } from './useScript';

/* ---------- Step loader: four named steps, looping ---------- */
const STEPS = [
  { label: 'Reading Figma frames', done: 'Read 4 frames' }, { label: 'Matching tokens', done: 'Matched 18 tokens' },
  { label: 'Writing components', done: 'Wrote 3 components' }, { label: 'Checking contrast', done: 'Contrast passes' }
];
export default function StepLoaderDemo() {
  const [loader, setLoader] = useState<StepLoaderGlyph>('radar');
  const [current, setCurrent] = useState(0);
  useScript(async ({ wait }) => {
    for (;;) {
      for (let i = 0; i < STEPS.length; i++) { setCurrent(i); await wait(1900); }
      setCurrent(STEPS.length); await wait(3200);
      setCurrent(0); await wait(700);
    }
  });
  return (
    <Demo switcher={<Seg label="Loader" value={loader} onChange={setLoader} options={[{ value: 'radar', label: 'Radar' }, { value: 'dots', label: 'Dots' }, { value: 'ring', label: 'Ring' }, { value: 'bars', label: 'Bars' }]} />}>
      <StepLoader steps={STEPS} current={current} loader={loader} />
    </Demo>
  );
}
