'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ToastStack, type StackToast } from '../components/toast-stack/ToastStack';
import { Icon } from '../lib/icons';
import { useScript } from './useScript';

/* ---------- Toast stack: three notifications arrive, the button sends more, hover fans them out ---------- */
const POOL: Omit<StackToast, 'id'>[] = [
  { icon: 'ok', tone: 'ok', title: 'Tests passed', detail: '42 of 42 in 38s' },
  { icon: 'pr', tone: 'merge', title: 'PR #412 is ready', detail: 'Use shared spacing tokens' },
  { icon: 'figma', tone: 'purple', title: 'Frames synced', detail: '6 frames from Pricing.fig' },
  { icon: 'warn', tone: 'warn', title: 'Budget at 80%', detail: '1,600 of 2,000 credits' },
  { icon: 'spark', tone: 'blue', title: 'Draft written', detail: 'Launch email, 2 subject lines' }
];
export default function ToastStackDemo() {
  const [toasts, setToasts] = useState<StackToast[]>([]);
  const sent = useRef(0);
  const add = () => {
    const n = sent.current++;
    setToasts(list => {
      // keeps the six newest; the newest says "now" and the older ones age by two minutes each
      const next = [...list, { ...POOL[n % POOL.length], id: n }].slice(-6);
      return next.map((t, i) => ({ ...t, time: i === next.length - 1 ? 'now' : (next.length - 1 - i) * 2 + 'm' }));
    });
  };
  useScript(async ({ wait }) => { for (let i = 0; i < 3; i++) { await wait(i ? 700 : 400); add(); } });
  return (
    <div style={{ width: '100%', minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
      <div style={{ marginBlock: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ToastStack toasts={toasts} onDismiss={id => setToasts(list => list.filter(t => t.id !== id))} />
      </div>
      <div data-dm=""><button type="button" className="dm-pill dm-soft dm-sm" onClick={add}><Icon name="bell" />Send notification</button></div>
    </div>
  );
}
