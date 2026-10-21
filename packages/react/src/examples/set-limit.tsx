'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { SetLimit } from '../components/set-limit/SetLimit';
import { useScript } from './useScript';

/* ---------- Set limit: the cap eases down from $200 to $170, past the forecast, and the warning comes in, unless someone
   drags the cap or types a budget first ---------- */
export default function SetLimitDemo() {
  const [cap, setCap] = useState(200);
  const touched = useRef(false);
  useScript(async ({ wait }) => {
    await wait(1500);
    const t0 = performance.now();
    for (let p = 0; p < 1 && !touched.current;) {
      await wait(16);
      p = Math.min(1, (performance.now() - t0) / 900);
      if (!touched.current) setCap(Math.round((200 - 30 * (1 - Math.pow(1 - p, 3))) / 10) * 10);
    }
  });
  return <div style={{ width: '100%' }} onPointerDownCapture={() => { touched.current = true; }} onFocusCapture={() => { touched.current = true; }}><SetLimit value={cap} onValueChange={setCap} /></div>;
}
