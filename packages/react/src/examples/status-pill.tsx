'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { StatusPill, type StatusPillProps } from '../components/status-pill/StatusPill';
import { Seg } from '../lib/motion';
import { Demo } from './Demo';
import { useScript } from './useScript';

/* ---------- Status pill: an agent run from thinking to done, waiting for Review on the way ---------- */
export default function StatusPillDemo() {
  const [variant, setVariant] = useState<'pill' | 'bar'>('pill');
  const [p, setP] = useState<StatusPillProps>({ state: 'idle', label: 'Ready for a task' });
  useScript(async ({ wait }) => {
    for (;;) {
      await wait(1100);
      setP({ state: 'thinking', label: 'Thinking', progress: 8 }); await wait(1800);
      setP({ state: 'reading', label: 'Reading Figma frames', meta: '1 of 4', progress: 22 }); await wait(400);
      for (let i = 2; i <= 4; i++) { await wait(650); setP({ state: 'reading', label: 'Reading Figma frames', meta: `${i} of 4`, progress: 22 + i * 8 }); }
      await wait(700);
      setP({ state: 'working', label: 'Editing', file: { name: 'PricingCard.tsx', type: 'tsx' }, progress: 64 }); await wait(2000);
      // waits for Review, and carries on by itself after a while so the loop never stalls
      await new Promise<void>(res => { setP({ state: 'waiting', label: 'Waiting for your approval', action: { label: 'Review', onClick: res }, progress: 72 }); wait(8000).then(res); });
      setP({ state: 'working', label: 'Applying 4 changes', progress: 88 }); await wait(1600);
      setP({ state: 'done', label: 'Done', meta: '4 files changed · 18s', progress: 100 }); await wait(3200);
      setP({ state: 'idle', label: 'Ready for a task', progress: 0 });
    }
  });
  return (
    <Demo switcher={<Seg label="Variant" value={variant} onChange={setVariant} options={[{ value: 'pill', label: 'Pill' }, { value: 'bar', label: 'Bar' }]} />}>
      <StatusPill {...p} variant={variant} />
    </Demo>
  );
}
