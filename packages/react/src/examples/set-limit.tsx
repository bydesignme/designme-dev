'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { SetLimit } from '../components/set-limit/SetLimit';
import { useScript } from './useScript';

/* ---------- Set limit: the cap eases down from $200 to $170, past the forecast, and the warning comes in ---------- */
export default function SetLimitDemo() {
  const [cap, setCap] = useState(200);
  useScript(async ({ wait }) => {
    await wait(1500);
    const t0 = performance.now();
    for (let p = 0; p < 1;) {
      await wait(16);
      p = Math.min(1, (performance.now() - t0) / 900);
      setCap(Math.round((200 - 30 * (1 - Math.pow(1 - p, 3))) / 10) * 10);
    }
  });
  return <div style={{ width: '100%' }}><SetLimit value={cap} onValueChange={setCap} /></div>;
}
