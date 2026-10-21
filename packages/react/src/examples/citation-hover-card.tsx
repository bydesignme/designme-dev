'use client';
// The preview from designme.dev, rebuilt from the React component. Hover, focus or tap a citation to see its source.
import { useState } from 'react';
import { CitationHoverCard, type CitationHoverCardSource } from '../components/citation-hover-card/CitationHoverCard';
import { useScript } from './useScript';

const SOURCES: CitationHoverCardSource[] = [
  { mark: 'B', color: '#4a5a8a', site: 'baymard.com', title: 'Pricing page UX benchmark', meta: 'Read 4 days ago',
    quote: <>Of 64 SaaS sites tested, those leading with the annual plan saw <mark>a 12 to 20% higher trial to paid rate</mark> than monthly first layouts.</> },
  { mark: 'C', color: '#d9480f', site: 'cxl.com', title: 'Price anchoring in plan selection', meta: 'Read 4 days ago',
    quote: <>When the monthly price stayed visible with a strike through, <mark>annual selection rose by a further 9 points</mark> in the anchored group.</> },
  { mark: 'C', color: 'var(--dm-pm)', site: 'Drive', title: 'Q3 conversion export.csv', meta: 'Your file',
    quote: <>Rows 412 to 480: <mark>trial to paid moves from 18.6% to 26.3%</mark> between Sep 18 and Oct 17.</> }
];

export default function CitationHoverCardDemo() {
  // shows the first card once on its own, then puts it away, unless you are already pointing at a citation
  const [open, setOpen] = useState<number | null>();
  useScript(async ({ wait }) => {
    await wait(1400); setOpen(o => o === undefined ? 0 : o);
    await wait(2800); setOpen(o => o === 0 ? null : o);
  });
  return (
    <div style={{ width: '100%' }}>
      <CitationHoverCard sources={SOURCES} open={open} onOpenChange={setOpen}
        text="Teams that show the annual price first see higher paid conversion[1], and the effect is stronger when the monthly price stays visible beside it[2]. Your own data shows the same pattern since the September update[3]." />
    </div>
  );
}
