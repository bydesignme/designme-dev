'use client';
// The animated preview from designme.dev, rebuilt from the React component: a bright blue fails with white text, the agent
// darkens it until it passes, then makes a scale from it.
import { useRef, useState } from 'react';
import { ColorPicker } from '../components/color-picker/ColorPicker';
import { useStory } from './useScript';

export default function ColorPickerDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState('#3c9e91');
  const [alpha, setAlpha] = useState(1);
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-cpk-sw button');
    await wait(2500); press('.dm-cpk-act .dm-soft');
    await wait(2500); press('.dm-cpk-act .dm-ghost');
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ColorPicker value={color} onValueChange={setColor} alpha={alpha} onAlphaChange={setAlpha} />
    </div>
  );
}
