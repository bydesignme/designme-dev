'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { TerminalStream, type TerminalCommand, type TerminalEdit, type TerminalEntry, type TerminalLine, type TerminalStatus } from '../components/terminal-stream/TerminalStream';
import { useScript, useStory } from './useScript';

/* ---------- Terminal stream: install, build, a failing test, the agent's fix, and the test passing ---------- */
const F = (n: string, kb: string) => 'dist/' + n.padEnd(22) + kb.padStart(6) + ' kB';
const ok = (text: string): TerminalLine => ({ text, tone: 'ok' }), bad = (text: string): TerminalLine => ({ text, tone: 'bad' }), mu = (text: string): TerminalLine => ({ text, tone: 'muted' });
const BUILD: TerminalLine[] = [mu('> acme-web@2.4.0 build'), mu('> vite build'), 'vite v6.2.1 building for production...', 'transforming...', ok('✓ 1284 modules transformed.'), 'rendering chunks...', 'computing gzip size...',
  ...([['index.html', '0.46'], ['assets/Home-1c9e.js', '3.12'], ['assets/Pricing-3f9a.js', '12.40'], ['assets/Cart-7b21.js', '9.86'], ['assets/Account-a04d.js', '7.31'], ['assets/Billing-52ce.js', '6.94'],
    ['assets/Bills-e8f3.js', '5.27'], ['assets/Team-0d6a.js', '4.88'], ['assets/Prefs-9a1b.js', '6.02'], ['assets/Docs-44f0.js', '8.15'], ['assets/Search-b7c2.js', '2.96'], ['assets/Modal-61de.js', '1.84'],
    ['assets/Chart-ef09.js', '21.73'], ['assets/Table-3a7e.js', '11.09'], ['assets/Form-c1d4.js', '4.41'], ['assets/Toast-8e2f.js', '1.12'], ['assets/dates-29bb.js', '18.30'], ['assets/vendor-8c1e.js', '98.12'],
    ['assets/index-4f2a.js', '42.31'], ['assets/index-9b7d.css', '18.92']].map(([n, kb]) => F(n, kb))), ok('✓ built in 6.1s')];
type Step = { cmd: string; ms: number; out: TerminalLine[]; exit?: number } | { note: string; ms: number } | { edit: string; add: number; del: number; ms: number; diff: string[] };
const RUN: Step[] = [
  { cmd: 'npm install', ms: 1900, out: ['added 412 packages in 1.9s', 'found 0 vulnerabilities'] },
  { cmd: 'npm run build', ms: 6100, out: BUILD },
  { cmd: 'npm test', ms: 3400, exit: 1, out: [mu('RUN  v3.0.5 ~/acme/web'), ok('✓ src/lib/cart.test.ts (14 tests)'), bad('× src/lib/price.test.ts (1 failed)'), bad('  × formats a yearly price'),
    ok('    Expected: "$240/yr"'), bad('    Received: "$240.00/yr"'), bad('Tests  1 failed | 23 passed (24)')] },
  { note: 'The test expects whole dollars, but formatPrice always adds cents. Dropping them for round amounts.', ms: 1500 },
  { edit: 'src/lib/price.ts', add: 2, del: 1, ms: 1500, diff: ['- return `$${n.toFixed(2)}/${per}`', '+ const v = Number.isInteger(n) ? String(n) : n.toFixed(2)', '+ return `$${v}/${per}`'] },
  { cmd: 'npm test', ms: 2900, out: [ok('✓ src/lib/cart.test.ts (14 tests)'), ok('✓ src/lib/price.test.ts (10 tests)'), ok('Tests  24 passed (24)')] }
];
const clock = (ms: number) => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const sec = (ms: number) => (ms / 1000).toFixed(1) + ' s';

export default function TerminalStreamDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [ms, setMs] = useState(0);
  const [status, setStatus] = useState<TerminalStatus>('running');
  const halt = useRef(false);

  // the agent's run: time passes in steps of a quarter second at most, so the clock keeps up, and Stop ends it at the next step
  useScript(async ({ wait }) => {
    let vt = 0, at = -1;
    const pass = async (t: number, each?: (d: number) => void) => {
      for (let d = 0; d < t;) { if (halt.current) return false; const s = Math.min(250, t - d); await wait(s); d += s; vt += s; setMs(vt); each?.(d); }
      return !halt.current;
    };
    const add = (e: TerminalEntry) => { at++; setEntries(l => [...l, e]); };
    const patch = (i: number, f: (e: TerminalEntry) => TerminalEntry) => setEntries(l => l.map((e, j) => (j === i ? f(e) : e)));
    const stopped = () => { patch(at, e => (e.kind === 'note' ? e : e.kind === 'edit' ? { ...e, status: 'stopped' } : { ...e, status: 'stopped', output: [...(e.output ?? []), mu('^C')] })); setStatus('stopped'); };
    let last = 0;
    for (const k of RUN) {
      if (!(await pass(200))) return setStatus('stopped');
      if ('note' in k) { add({ kind: 'note', text: k.note }); if (!(await pass(k.ms))) return setStatus('stopped'); continue; }
      if ('edit' in k) {
        add({ kind: 'edit', file: k.edit, status: 'running' });
        if (!(await pass(k.ms))) return stopped();
        patch(at, e => ({ ...(e as TerminalEdit), status: 'done', added: k.add, removed: k.del, diff: k.diff })); continue;
      }
      add({ command: k.cmd, status: 'running', output: [], duration: sec(0) });
      const per = k.ms / k.out.length; let t = 0;
      for (const line of k.out) {
        const done = await pass(per, d => patch(at, e => ({ ...(e as TerminalCommand), duration: sec(t + d) }))); t += per;
        if (!done) return stopped();
        patch(at, e => ({ ...(e as TerminalCommand), output: [...((e as TerminalCommand).output ?? []), line] }));
      }
      last = k.exit ?? 0;
      patch(at, e => ({ ...(e as TerminalCommand), duration: sec(k.ms), status: k.exit ? 'failed' : 'ok', exitCode: k.exit }));
    }
    setStatus(last ? 'failed' : 'passed');
  });

  // the person's part of the story, on the same beats as the site's: once the run is over, they copy it
  useStory(ref, async ({ wait, press }) => {
    await wait(20500); press('.dm-tmx-cp');
  }, { hold: false });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <TerminalStream cwd="~/acme/web" entries={entries} status={status} elapsed={clock(ms)} onStop={() => { halt.current = true; }} />
    </div>
  );
}
