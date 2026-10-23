'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { MultiSelect } from '../components/multi-select/MultiSelect';
import { useStory } from './useScript';

/* ---------- Multi-select: add Pricing, pick Tooltips by mistake and take it off with Backspace, then add Tokens ---------- */
// tags for the pricing page, and how many files carry each
const TAGS: [string, number][] = [['Accessibility', 14], ['Billing', 9], ['Copy', 22], ['Design system', 31], ['Launch', 12], ['Mobile', 18], ['Onboarding', 7], ['Pricing', 16], ['Research', 11], ['Tokens', 25], ['Tooltips', 6]];

export default function MultiSelectDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [tags, setTags] = useState(['Launch']);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  // the preview's story types and presses keys in the box without taking the focus
  useStory(ref, async ({ wait }) => {
    const key = (k: string) => ref.current?.querySelector('[role="combobox"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
    const type = async (t: string) => { for (const ch of t) { setQuery(q => q + ch); await wait(200); } };
    await wait(1500); setOpen(true);
    await wait(1000); await type('pri'); await wait(500); key('Enter');
    await wait(1000); await type('to'); await wait(500); key('ArrowDown');
    await wait(1000); key('Enter');
    await wait(1500); key('Backspace');
    await wait(1000); await type('tok'); await wait(500); key('Enter');
    await wait(1000); key('Escape');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <MultiSelect label="Tags" options={TAGS.map(([t, n]) => ({ value: t, meta: String(n) }))} value={tags} onValueChange={setTags}
        query={query} onQueryChange={setQuery} open={open} onOpenChange={setOpen} />
    </div>
  );
}
