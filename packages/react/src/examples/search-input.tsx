'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { SearchInput, type SearchInputItem, type SearchInputSource } from '../components/search-input/SearchInput';
import { useStory } from './useScript';

const ITEMS: SearchInputItem[] = [
  { icon: 'figma', label: 'Pricing v4', source: 'Figma' }, { icon: 'figma', label: 'Pricing mobile', source: 'Figma' },
  { icon: 'file-text', label: 'Pricing research notes', source: 'Notion' }, { icon: 'code', label: 'PricingCard.tsx', source: 'GitHub' },
  { icon: 'figma', label: 'Checkout flow', source: 'Figma' }, { icon: 'file-text', label: 'Brand voice guide', source: 'Notion' },
  { icon: 'code', label: 'tokens.css', source: 'GitHub' }
];
const SOURCES: SearchInputSource[] = [{ key: 'figma', label: 'Figma', icon: 'figma' }, { key: 'notion', label: 'Notion', icon: 'file-text' }, { key: 'github', label: 'GitHub', icon: 'code' }];
const RECENT = ['pricing contrast', 'checkout copy', 'tokens'];
const ANSWER = 'Pricing changed on Sep 18: annual plans first, one CTA per card. Trial to paid is up 8.1 points since.'.split(' ');

/* ---------- Search input: the box lifts, then someone asks a question and the agent answers above the results ---------- */
export default function SearchInputDemo() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [answer, setAnswer] = useState('');
  // the preview types a question on its own; clicking, focusing or typing in it takes over, and what it had typed goes
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait, taken }) => {
    await wait(900); setOpen(true);
    await wait(600);
    let typed = '', typing = true;
    taken(() => { if (typing) setValue(''); });
    for (const ch of 'why did pricing change?') { typed += ch; setValue(typed); await wait(45); }
    typing = false;
  });
  // a question gets an answer, a word every 45ms, which keeps going while the question is still being typed
  const v = value.trim(), asking = v.split(' ').length > 2 || v.endsWith('?');
  useEffect(() => {
    if (!asking) { setAnswer(''); return; }
    let n = 0;
    const id = setInterval(() => { n++; setAnswer(ANSWER.slice(0, n).join(' ')); if (n >= ANSWER.length) clearInterval(id); }, 45);
    return () => clearInterval(id);
  }, [asking]);
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <SearchInput items={ITEMS} sources={SOURCES} recent={RECENT} value={value} onValueChange={setValue} open={open} onOpenChange={setOpen}
        answer={asking ? answer : undefined} />
    </div>
  );
}
