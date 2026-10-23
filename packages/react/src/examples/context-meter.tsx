'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { ContextMeter, type ContextPart } from '../components/context-meter/ContextMeter';
import { useStory, useWait } from './useScript';

/* ---------- Context meter: what fills it, new tool output takes it close to the limit, Compact frees room ---------- */
const START: ContextPart[] = [
  { key: 'files', label: 'Files', tokens: 56200, items: 'Pricing.fig export 31.9k, PricingCard.tsx 18.2k, tokens.css 6.1k' },
  { key: 'tools', label: 'Tool output', tokens: 41800, items: 'Contrast check 17.4k, Figma frames 15.6k, grid audit 8.8k' },
  { key: 'chat', label: 'Chat', tokens: 32100, items: '48 turns with Maya Kim since 09:12' },
  { key: 'sys', label: 'Instructions', tokens: 6300, items: 'Studio guidelines 4.1k, pricing brief 2.2k' }
];
const LIMIT = 200000;
const sum = (ps: ContextPart[]) => ps.reduce((t, p) => t + p.tokens, 0);
const set = (ps: ContextPart[], key: string, tokens: number) => ps.map(p => p.key === key ? { ...p, tokens } : p);

export default function ContextMeterDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [parts, setParts] = useState(START);
  const [before, setBefore] = useState<ContextPart[] | null>(null);
  const [message, setMessage] = useState<{ text: string; tone: 'warn' | 'ok' }>();
  const [open, setOpen] = useState(true);
  const live = useRef(parts);
  useEffect(() => { live.current = parts; });
  const at = (ps: ContextPart[], key: string) => ps.find(p => p.key === key)!.tokens;
  // Compact turns older turns into a summary and trims old tool output
  const compact = async () => {
    await wait(1000);
    const next = set(set(parts, 'chat', 4600), 'tools', at(parts, 'tools') - 13700);
    setBefore(parts); setParts(next);
    setMessage({ text: `Freed ${((sum(parts) - sum(next)) / 1000).toFixed(1)}k tokens. 9 decisions kept`, tone: 'ok' });
  };
  const undo = () => { if (before) setParts(before); setBefore(null); setMessage(undefined); };
  // the preview's story: new tool output lands and takes it close to the limit, the person compacts, then shuts the panel
  useStory(ref, async ({ wait, press }) => {
    await wait(8000);
    const next = set(live.current, 'tools', at(live.current, 'tools') + 38500);
    setParts(next); setMessage({ text: `${Math.round(sum(next) / LIMIT * 100)}% full. Older turns start to drop at 200k`, tone: 'warn' });
    await wait(2000); press('.dm-ctm-go');
    await wait(3500); setOpen(false);
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ContextMeter parts={parts} limit={LIMIT} message={message?.text} messageTone={message?.tone} onCompact={compact} compacted={!!before} onUndo={undo}
        hint={before ? 'Older turns are now a summary' : undefined} open={open} onOpenChange={setOpen} />
    </div>
  );
}
