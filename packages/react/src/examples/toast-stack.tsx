'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ToastStack } from '../components/toast-stack/ToastStack';
import { DeckGlyph, type ToastData, type ToastStep } from '../components/toast/Toast';
import { Icon } from '../lib/icons';
import { useStory, useWait } from './useScript';

/* ---------- Toast stack: an agent's news as it comes. A job starts with its glyph at work, a success and a problem arrive; the
   story opens the stack, fixes the problem (the same card becomes its fix, then the result), drops the success and lets the
   stack fold back. Send notification sends more. An agent at work, so it keeps playing under the pointer ---------- */
const SEC = ['Cover', 'Agenda', 'Revenue', 'North', 'South', 'Plan vs actual', 'By region', 'Hiring', 'Open roles', 'Risks', 'Data move', 'Next steps'];
const POOL: Omit<ToastData, 'id' | 'actions'>[] = [
  { status: 'success', title: 'Frames synced', description: '6 frames from Pricing.fig', duration: 9000 },
  { status: 'info', title: 'PR #412 is ready', description: 'Use shared spacing tokens · 3 files', duration: 10000 },
  { status: 'warning', title: 'Budget at 80%', description: '1,600 of 2,000 credits', duration: 12000 },
  { status: 'success', title: 'Draft written', description: 'Launch email · 2 subject lines', duration: 9000 }
];
const TESTS = ['Cart total rounds down', 'Tax shows on the receipt', '40 other tests'];

export default function ToastStackDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [expanded, setExpanded] = useState<boolean | undefined>(undefined);
  const wait = useWait(), live = useRef(new Map<string, number>()), all = useRef<ToastData[]>([]);
  // one card per id: a known id changes in place, a new one comes in at the front; six at most
  const put = (t: ToastData) => { const l = all.current; all.current = (l.some(x => x.id === t.id) ? l.map(x => x.id === t.id ? t : x) : [...l, t]).slice(-6); setToasts(all.current); };
  const drop = (id: ToastData['id']) => { all.current = all.current.filter(x => x.id !== id); setToasts(all.current); };
  const run = (id: string) => { const n = (live.current.get(id) ?? 0) + 1; live.current.set(id, n); return () => live.current.get(id) === n && all.current.some(t => t.id === id); };

  /* a job the agent runs in the background: it reads the notes, outlines and drafts twelve slides; Stop pauses it */
  const job = (from = 0, made = 0) => {
    const id = 'job', ok = run(id);
    const L = ['Read the notes', 'Outline 12 slides', 'Draft the slides'];
    const steps = (at: number, s: ToastStep['status'], n: number): ToastStep[] => L.map((label, i) => ({ label, status: i < at ? 'done' : i === at ? s : 'waiting', detail: i === 2 && at >= 2 ? `${Math.min(n + (s === 'running' ? 1 : 0), 12)} of 12` : undefined }));
    let n = made;
    const stop = (at: number) => () => { run(id); put({ id, status: 'stopped', title: at === 2 ? `Stopped at slide ${n}` : 'Stopped before drafting', description: `${n} of 12 drafted · nothing lost`,
      glyph: <DeckGlyph phase={at ? 'outlining' : 'idle'} made={n} />, steps: steps(at, 'paused', n), announce: `Stopped. ${n} of 12 drafted. Resume or discard.`,
      actions: [{ label: 'Discard', onClick: () => drop(id) }, { label: 'Resume', variant: 'primary', onClick: () => job(at, n) }] }); };
    const say = 'Making slides from your notes';
    const done = () => put({ id, status: 'success', title: '12 slides ready', description: 'Q3 planning deck', glyph: <DeckGlyph phase="done" made={12} />, steps: steps(3, 'done', 12), duration: 12000,
      announce: '12 slides ready. Open the deck or undo it.', actions: [
        { label: 'Undo', onClick: () => put({ id, status: 'success', title: 'Deck removed', description: 'Your notes are unchanged', glyph: <DeckGlyph phase="gone" />, steps: steps(3, 'done', 12), duration: 6000, actions: [{ label: 'Redo', onClick: done }] }) },
        { label: 'Open', variant: 'primary', onClick: () => drop(id) }] });
    (async () => {
      if (from === 0) { put({ id, status: 'working', title: 'Reading your notes…', description: '3 sections · 212 words', glyph: <DeckGlyph phase="reading" />, steps: steps(0, 'running', 0), onStop: stop(0), announce: say }); await wait(1600); if (!ok()) return; }
      if (from <= 1) { put({ id, status: 'working', title: 'Outlining the deck…', description: '12 slides planned', glyph: <DeckGlyph phase="outlining" />, steps: steps(1, 'running', 0), onStop: stop(1), announce: say }); await wait(1200); if (!ok()) return; }
      for (; n < 12; n++) {
        put({ id, status: 'working', title: 'Drafting slides…', description: `Slide ${n + 1} of 12 · ${SEC[n]}`, glyph: <DeckGlyph phase="drafting" made={n} active={n} />, steps: steps(2, 'running', n), onStop: stop(2), announce: n >= 6 ? 'Half the slides are drafted' : say });
        await wait(380); if (!ok()) return;
      }
      done();
    })();
  };

  /* a problem the agent can fix: the card becomes its fix, then the result, in place */
  const tests = () => {
    const id = 'tests';
    const fail = () => put({ id, status: 'error', title: '2 tests failed', description: 'checkout.spec · the total is 1¢ off', announce: '2 tests failed in checkout.spec. Fix them or ignore them.',
      steps: TESTS.map((label, i) => ({ label, status: i < 2 ? 'failed' : 'done' })), actions: [{ label: 'Ignore', onClick: () => drop(id) }, { label: 'Fix', variant: 'primary', onClick: fix }] });
    const fix = async () => {
      const ok = run(id), stop = () => { run(id); fail(); };
      put({ id, status: 'working', title: 'Fixing 2 tests…', description: 'Rounding in cart.ts', steps: TESTS.map((label, i) => ({ label, status: i < 2 ? 'running' : 'done' })), onStop: stop, announce: 'Fixing 2 tests' });
      await wait(1700); if (!ok()) return;
      for (let i = 6; i <= 42; i += 6) { put({ id, status: 'working', title: 'Running checkout.spec…', description: `Passed ${i} of 42`, steps: TESTS.map(label => ({ label, status: 'done' })), onStop: stop, announce: 'Fixing 2 tests' }); await wait(200); if (!ok()) return; }
      put({ id, status: 'success', title: '42 tests passed', description: 'Fixed in cart.ts · 1 line', steps: TESTS.map(label => ({ label, status: 'done' })), duration: 10000,
        announce: '42 tests passed. Fixed in cart.ts.', actions: [{ label: 'View diff', onClick: () => drop(id) }] });
    };
    fail();
  };

  /* plain news, and what Send notification sends: one action at most, and a countdown */
  const sent = useRef(0);
  const news = (k = sent.current++) => {
    const id = 'n' + k, d = POOL[k % POOL.length];
    const act = d.title === 'PR #412 is ready' ? [{ label: 'Review', variant: 'primary' as const, onClick: () => drop(id) }]
      : d.title === 'Budget at 80%' ? [{ label: 'Raise cap', variant: 'warn' as const, onClick: () => put({ id, status: 'success', title: 'Cap raised to 3,000', description: '1,600 of 3,000 credits', duration: 6000 }) }] : undefined;
    put({ ...d, id, actions: act });
    return id;
  };

  useStory(ref, async s => {
    const until = async (f: () => boolean) => { while (!f()) await s.wait(100); };
    s.taken(() => setExpanded(undefined));
    await s.wait(500); job();
    await s.wait(1500); const frames = news(); sent.current = 1;
    await s.wait(1500); tests();
    await s.wait(1500); setExpanded(true);
    await s.wait(1500); s.press('.dm-tst-fi .dm-primary');
    await until(() => all.current.some(t => t.id === 'tests' && t.status === 'success'));
    await s.wait(1000); drop(frames);
    await s.wait(1500); setExpanded(undefined);
  }, { hold: false });

  return (
    <div ref={ref} style={{ width: '100%', minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
      <div style={{ marginBlock: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ToastStack toasts={toasts} expanded={expanded} onDismiss={id => drop(id)} />
      </div>
      <div data-dm=""><button type="button" className="dm-pill dm-line dm-sm" onClick={() => news()}><Icon name="bell" />Send notification</button></div>
    </div>
  );
}
