'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { Toast, type ToastData } from '../components/toast/Toast';
import { Seg } from '../lib/motion';
import { Demo } from './Demo';

/* ---------- Toast: four states; Undo and Retry change the toast, loading turns into the preview link ---------- */
type Kind = 'ok' | 'err' | 'info' | 'load';

export default function ToastDemo() {
  const [kind, setKind] = useState<Kind>('ok');
  const [toast, setToast] = useState<ToastData | null>(null);
  const current = useRef<ToastData['id'] | null>(null);
  const next = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const update = (id: number, patch: Partial<ToastData>) => setToast(t => (t && t.id === id ? { ...t, ...patch } : t));
  const show = (k: Kind) => {
    const id = ++next.current;
    current.current = id; setKind(k);
    if (k === 'ok') setToast({ id, tone: 'success', title: 'Changes applied', description: '4 files updated in PricingCard',
      action: { label: 'Undo', onClick: () => update(id, { title: 'Changes undone', description: 'PricingCard is back as it was', action: undefined }) } });
    if (k === 'err') setToast({ id, tone: 'error', title: 'Could not push to main', description: 'The branch is protected',
      action: { label: 'Retry', variant: 'ink', onClick: () => {
        setToast(t => (t && t.id === id && t.action ? { ...t, action: { ...t.action, busy: true } } : t));
        later(1200, () => { if (current.current === id) show('ok'); });
      } } });
    if (k === 'info') setToast({ id, tone: 'info', title: 'Preview is ready', description: 'pricing-spacing.preview.app', action: { label: 'Open', onClick: () => {} } });
    if (k === 'load') {
      setToast({ id, tone: 'loading', title: 'Deploying preview', description: 'Building 3 pages' });
      later(2600, () => { if (current.current === id) show('info'); });
    }
  };
  useEffect(() => { const t = setTimeout(() => show('ok'), 400); return () => clearTimeout(t); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Demo switcher={<Seg label="State" value={kind} onChange={show} options={[{ value: 'ok', label: 'Success' }, { value: 'err', label: 'Error' }, { value: 'info', label: 'Info' }, { value: 'load', label: 'Loading' }]} />}>
      <Toast toast={toast} onDismiss={() => { current.current = null; setToast(null); }} />
    </Demo>
  );
}
