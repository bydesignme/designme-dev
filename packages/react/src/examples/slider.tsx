'use client';
// The animated preview from designme.dev, rebuilt from the React components: try the far end of Creativity, take the agent's
// recommendation, read fewer tool calls, then narrow the budget.
import { useRef, useState } from 'react';
import { RangeSlider, Slider, SliderGroup } from '../components/slider/Slider';
import { useStory } from './useScript';

const NAMES = ['Precise', 'Focused', 'Balanced', 'Playful', 'Creative'];
const SAMPLE = [
  'The export failed because the token expired. Renew it in Settings.',
  'The export failed: your access token expired. Renew it in Settings, then run it again.',
  "Your export didn't finish because its access token had expired. Renew it in Settings and try again.",
  'Your export tripped over an expired token. A quick renewal in Settings will get it moving.',
  'The export ran out of road when its token expired mid-trip. Renew it in Settings and send it on its way.'
];

export default function SliderDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [creativity, setCreativity] = useState(0.5);
  const [calls, setCalls] = useState(30);
  const [cost, setCost] = useState<[number, number]>([0.1, 0.6]);
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-sdx-stops button:last-child');
    await wait(3500); press('.dm-sdx-rec');
    await wait(2000); setCalls(20);
    await wait(2000); setCost([0.1, 0.35]);
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <SliderGroup>
        <Slider label="Creativity" min={0} max={1} step={0.05} bigStep={4} value={creativity} onValueChange={setCreativity} format={v => v.toFixed(2)}
          names={NAMES} stops={[{ value: 0, label: 'Precise' }, { value: 0.5, label: 'Balanced' }, { value: 1, label: 'Creative' }]}
          recommended={{ value: 0.4 }} description={SAMPLE[Math.round(creativity * 4)]} />
        <Slider label="Tool calls per run" min={10} max={50} step={10} bigStep={2} value={calls} onValueChange={setCalls} format={v => v + ' calls'} ticks />
        <RangeSlider label="Cost per run" min={0} max={1} step={0.05} bigStep={4} value={cost} onValueChange={setCost} format={v => '$' + v.toFixed(2)} />
      </SliderGroup>
    </div>
  );
}
