'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { ContextMeter, type UsageRow } from '../components/context-meter/ContextMeter';

/* ---------- Context meter: a ring beside the model opens usage; compact frees the context ---------- */
export default function ContextMeterDemo() {
  const [phase, setPhase] = useState<'full' | 'busy' | 'compact'>('full');
  const compact = () => {
    if (phase === 'compact') { setPhase('full'); return; }
    if (phase === 'busy') return;
    setPhase('busy'); setTimeout(() => setPhase('compact'), 900);
  };
  const rows: UsageRow[] = [
    { key: 'ctx', label: 'Context window', percent: phase === 'compact' ? 38 : 68,
      detail: phase === 'busy' ? 'Summarising the thread' : phase === 'compact' ? '76k of 200k tokens, 9 decisions kept' : '136k of 200k tokens',
      tip: 'Files 56k · Conversation 60k · Tool results 20k',
      action: { label: phase === 'busy' ? 'Compacting' : phase === 'compact' ? 'Undo' : 'Compact', onClick: compact } },
    { key: 'session', label: 'Session limit', percent: 4, detail: 'Resets in 4 hr 39 min' },
    { key: 'week', label: 'Weekly', percent: 16, detail: 'Resets Sun 10:00 PM' }
  ];
  return (
    <div style={{ width: '100%', maxWidth: 330, marginInline: 'auto' }}>
      <ContextMeter rows={rows} model="Opus 5.5" effort="Extra" onViewUsage={() => {}} />
    </div>
  );
}
