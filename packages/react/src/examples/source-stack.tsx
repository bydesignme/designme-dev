'use client';
// The animated preview from designme.dev, rebuilt from the React component: the sources open a moment after the answer appears.
import { useState } from 'react';
import { SourceStack, type StackSource } from '../components/source-stack/SourceStack';
import { useScript } from './useScript';

const open = () => {};
const SOURCES: StackSource[] = [
  { kind: 'web', title: 'Baymard: pricing page UX', host: 'baymard.com', relevance: .92, mark: 'B', color: 'var(--dm-pb)', onOpen: open },
  { kind: 'web', title: 'Annual vs monthly anchoring study', host: 'cxl.com', relevance: .88, mark: 'C', color: '#d9480f', onOpen: open },
  { kind: 'file', title: 'Q3 conversion export.csv', host: 'Drive', relevance: .84, mark: 'CSV', color: 'var(--dm-pm)', onOpen: open },
  { kind: 'figma', title: 'Pricing v4, frame 2', host: 'Figma', relevance: .8, mark: 'F', color: 'var(--dm-pl)', onOpen: open },
  { kind: 'web', title: 'Stripe billing docs', host: 'stripe.com', relevance: .66, mark: 'S', color: '#635bff', onOpen: open },
  { kind: 'file', title: 'Pricing research notes', host: 'Notion', relevance: .61, mark: 'N', color: 'var(--dm-fg2)', onOpen: open },
  { kind: 'figma', title: 'Checkout flow', host: 'Figma', relevance: .52, mark: 'F', color: 'var(--dm-pl)', onOpen: open },
  { kind: 'web', title: 'NN/g on price framing', host: 'nngroup.com', relevance: .48, mark: 'N', color: 'var(--dm-fg2)', onOpen: open }
];

export default function SourceStackDemo() {
  const [isOpen, setOpen] = useState(false);
  useScript(async ({ wait }) => { await wait(1100); setOpen(true); });
  return (
    <div style={{ width: '100%' }}>
      <SourceStack sources={SOURCES} open={isOpen} onOpenChange={setOpen}>
        Annual plans convert about 18% better when the monthly price is shown crossed out next to them.
      </SourceStack>
    </div>
  );
}
