'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { DesignTuner } from '../components/design-tuner/DesignTuner';
import { useScript, useTakeover } from './useScript';

/* ---------- Design tuner: drag the sliders, or let the agent tune each one in turn ---------- */
const START = { rad: 16, pad: 18, gap: 12, sh: .08 };
const KEYS = ['rad', 'pad', 'gap', 'sh'] as const;
export default function DesignTunerDemo() {
  const [values, setValues] = useState<Record<string, number>>(START);
  const [status, setStatus] = useState('Edited by you');
  const [active, setActive] = useState<string>();
  const [note, setNote] = useState<string>();
  const [runs, setRuns] = useState(0);
  const live = useRef(values), ref = useRef<HTMLDivElement>(null), mine = useTakeover(ref);
  useEffect(() => { live.current = values; });
  // the agent tunes once on its own, unless you take over first
  useScript(async ({ wait }) => { await wait(1600); if (!mine()) setRuns(r => r || 1); });
  // each run aims at the other set of values, so Tune again always has something to do
  useScript(async ({ wait }) => {
    if (runs <= 0) return;
    const target = runs % 2 ? { rad: 20, pad: 24, gap: 14, sh: .05 } : { rad: 12, pad: 20, gap: 10, sh: .1 };
    setStatus('Agent is tuning'); setNote(undefined);
    for (const k of KEYS) {
      setActive(k);
      const from = live.current[k], to = target[k], t0 = performance.now();
      for (let p = 0; p < 1;) { await wait(16); p = Math.min(1, (performance.now() - t0) / 650); setValues(v => ({ ...v, [k]: from + (to - from) * (1 - Math.pow(1 - p, 3)) })); }
      await wait(120); setActive(undefined);
    }
    setNote('Matched the 4px grid and your card tokens. Softer shadow so the CTA leads.');
    setStatus('Tuned by agent'); setRuns(r => -r);
  }, [runs > 0 ? runs : 0]);
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <DesignTuner values={values} onValuesChange={v => { setValues(v); setStatus('Edited by you'); }} status={status} active={active}
        tuning={runs > 0} note={note} actionLabel={runs ? 'Tune again' : 'Tune with agent'} onTune={() => setRuns(r => Math.abs(r) + 1)} />
    </div>
  );
}
