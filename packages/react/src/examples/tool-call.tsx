'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { ToolCall, type ToolCallItem } from '../components/tool-call/ToolCall';
import { useScript } from './useScript';

/* ---------- Tool call: two calls run one after the other, then the answer comes in and the first call opens ---------- */
const CALLS: ToolCallItem[] = [
  { key: 'plans', icon: 'db', server: 'billing', name: 'list_plan_changes', state: 'queued', duration: '412 ms',
    input: { since: '2026-10-01' }, output: [{ plan: 'Pro', price: 24 }, { plan: 'Team', price: 48 }] },
  { key: 'edit', icon: 'edit', server: 'files', name: 'edit', state: 'queued', duration: '1.2 s',
    input: { path: 'Pricing.tsx', lines: 6 }, output: { changed: 6, saved: true } }
];
export default function ToolCallDemo() {
  const [calls, setCalls] = useState(CALLS);
  const [open, setOpen] = useState<string[]>([]);
  useScript(async ({ wait }) => {
    await wait(600);
    for (const k of CALLS.map(c => c.key)) {
      setCalls(cs => cs.map(c => c.key === k ? { ...c, state: 'running' } : c)); await wait(1300);
      setCalls(cs => cs.map(c => c.key === k ? { ...c, state: 'done' } : c));
    }
    setOpen(o => o.includes('plans') ? o.filter(k => k !== 'plans') : [...o, 'plans']);
  });
  return (
    <div style={{ width: '100%' }}>
      <ToolCall calls={calls} open={open} onOpenChange={setOpen}
        message="Checking which plans changed this month before I update the pricing page."
        reply="Two plans changed. I updated their prices and the yearly saving on the page." />
    </div>
  );
}
