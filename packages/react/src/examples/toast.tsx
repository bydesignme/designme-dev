'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { Toast, type ToastData } from '../components/toast/Toast';
import { Seg } from '../lib/motion';
import { Demo } from './Demo';
import { useTakeover } from './useScript';

/* ---------- Toast: four states; Undo and Retry change the toast, loading turns into the preview link, and a toast with a timer leaves when it runs out ---------- */
type Kind = 'ok' | 'err' | 'info' | 'load';

export default function ToastDemo() {
  const [kind, setKind] = useState<Kind>('ok');
  const [toast, setToast] = useState<ToastData | null>(null);
  const current = useRef<ToastData['id'] | null>(null);
  const next = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ref = useRef<HTMLDivElement>(null), mine = useTakeover(ref);
  const later = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => { timers.current.forEach(clearTimeout); if (life.current) clearTimeout(life.current.t); }, []);

  const update = (id: number, patch: Partial<ToastData>) => setToast(t => (t && t.id === id ? { ...t, ...patch } : t));
  // success and info time out like real toasts: hovering holds the timer, and when it runs out the toast leaves and comes
  // back (until you take over: then it stays gone until you pick one)
  const life = useRef<{ t?: ReturnType<typeof setTimeout>; id: number; k: Kind; left: number; at: number } | null>(null);
  const arm = (id: number, k: Kind, ms: number) => {
    if (life.current) clearTimeout(life.current.t);
    life.current = { id, k, left: ms, at: Date.now(), t: setTimeout(() => {
      if (current.current !== id) return;
      current.current = null; setToast(null); life.current = null;
      later(1100, () => { if (current.current === null && !mine()) show(k); });
    }, ms) };
  };
  const hold = (on: boolean) => {
    const l = life.current; if (!l || current.current !== l.id) return;
    if (on) { clearTimeout(l.t); l.left -= Date.now() - l.at; } else arm(l.id, l.k, Math.max(400, l.left));
  };
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
    if (k === 'ok' || k === 'info') arm(id, k, 5200); else if (life.current) { clearTimeout(life.current.t); life.current = null; }
    if (k === 'load') {
      setToast({ id, tone: 'loading', title: 'Deploying preview', description: 'Building 3 pages' });
      later(2600, () => { if (current.current === id) show('info'); });
    }
  };
  useEffect(() => { const t = setTimeout(() => show('ok'), 400); return () => clearTimeout(t); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Demo ref={ref} switcher={<Seg label="State" value={kind} onChange={show} options={[{ value: 'ok', label: 'Success' }, { value: 'err', label: 'Error' }, { value: 'info', label: 'Info' }, { value: 'load', label: 'Loading' }]} />}>
      <div style={{ display: 'contents' }} onPointerEnter={() => hold(true)} onPointerLeave={() => hold(false)}>
        <Toast toast={toast} onDismiss={() => { current.current = null; setToast(null); }} />
      </div>
    </Demo>
  );
}
