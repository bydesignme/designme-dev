'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { ContextMeter, type ContextPart } from '../components/context-meter/ContextMeter';
import { useStory, useWait } from './useScript';

/* ---------- Context meter: what fills it, the chat takes it step by step past 85%, Compact frees room ---------- */
const START: ContextPart[] = [
  { key: 'files', label: 'Files', tokens: 32000, items: 'Pricing.fig export 19.8k, PricingCard.tsx 8.1k, tokens.css 4.1k' },
  { key: 'tools', label: 'Tool output', tokens: 24000, items: 'Contrast check 11.2k, Figma frames 8.6k, grid audit 4.2k' },
  { key: 'chat', label: 'Chat', tokens: 26000, items: 'Turns with Maya Kim since 09:12' },
  { key: 'sys', label: 'Instructions', tokens: 6000, items: 'Studio guidelines 3.9k, pricing brief 2.1k' }
];
// what the chat adds, one step at a time: [part, tokens, what it is]. The third takes it past 85%
const STEPS: [string, number, string][] = [['files', 22000, 'brand-guide.pdf'], ['tools', 36000, 'web search'], ['chat', 28000, ''], ['files', 10000, 'checkout.fig']];
// compacting leaves a summary in place of older turns, reads and output
const AFTER: Record<string, [number, string]> = {
  files: [26000, 'Pricing.fig export 19.8k, summary of older reads 6.2k'], tools: [24000, 'Contrast check 11.2k, summary of older output 12.8k'],
  chat: [8000, 'Summary of 48 turns, 9 decisions kept'], sys: [6000, 'Studio guidelines 3.9k, pricing brief 2.1k']
};
const LIMIT = 200000;
const sum = (ps: ContextPart[]) => ps.reduce((t, p) => t + p.tokens, 0);
const add = (ps: ContextPart[], [key, tokens, what]: [string, number, string]) => ps.map(p => p.key === key ? { ...p, tokens: p.tokens + tokens, items: what ? `${p.items}, ${what} ${(tokens / 1000).toFixed(1)}k` : p.items } : p);

export default function ContextMeterDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [parts, setParts] = useState(START);
  const [before, setBefore] = useState<ContextPart[] | null>(null);
  const [message, setMessage] = useState<{ text: string; tone: 'warn' | 'ok' }>();
  const [open, setOpen] = useState(true);
  const live = useRef(parts);
  useEffect(() => { live.current = parts; });
  // Compact turns older turns, reads and tool output into a summary
  const compact = async () => {
    await wait(1000);
    const next = parts.map(p => AFTER[p.key] ? { ...p, tokens: AFTER[p.key][0], items: AFTER[p.key][1] } : p);
    setBefore(parts); setParts(next);
    setMessage({ text: `Freed ${((sum(parts) - sum(next)) / 1000).toFixed(1)}k tokens. 9 decisions kept`, tone: 'ok' });
  };
  const undo = () => { if (before) setParts(before); setBefore(null); setMessage(undefined); };
  // the preview's story: the chat goes on, step by step, past 85% (the warning shows as the count passes it), the person
  // compacts, then shuts the panel
  useStory(ref, async ({ wait, press }) => {
    await wait(6000);
    for (const [i, st] of STEPS.entries()) {
      const next = add(live.current, st), pct = Math.round(sum(next) / LIMIT * 100), was = Math.round(sum(live.current) / LIMIT * 100);
      setParts(next);
      if (pct >= 85) { if (was < 85) await wait(300); setMessage({ text: `${pct}% full. Older turns start to drop at 200k`, tone: 'warn' }); }
      await wait(i === 2 ? 1700 : 1200);
    }
    await wait(500); press('.dm-ctm-go');
    await wait(3500); setOpen(false);
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ContextMeter parts={parts} limit={LIMIT} message={message?.text} messageTone={message?.tone} onCompact={compact} compacted={!!before} onUndo={undo}
        hint={before ? 'Older turns are now a summary' : undefined} busyHint="Summarising 48 turns" open={open} onOpenChange={setOpen} />
    </div>
  );
}
