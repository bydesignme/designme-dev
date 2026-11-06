'use client';
// The preview from designme.dev, rebuilt from the React component: three files to review, hunk by hunk.
import { ChangeReview, type ChangedFile } from '../components/change-review/ChangeReview';

const FILES: ChangedFile[] = [
  { name: 'PricingCard.tsx', path: 'src/PricingCard.tsx', hunks: [
    { title: 'Use the shared button', lines: [{ kind: 'ctx', line: 14, text: '  return (' }, { kind: 'del', line: 15, text: '    <button className="cta-old">' }, { kind: 'add', line: 15, text: '    <Button variant="primary">' }, { kind: 'ctx', line: 16, text: '      {plan.cta}' }] },
    { title: 'Drop the second CTA', lines: [{ kind: 'del', line: 22, text: '    <a href="/contact">Talk to sales</a>' }, { kind: 'ctx', line: 22, text: '  </Card>' }] }
  ] },
  { name: 'tokens.css', path: 'src/tokens.css', hunks: [
    { title: 'Raise muted text contrast', lines: [{ kind: 'ctx', line: 8, text: ':root {' }, { kind: 'del', line: 9, text: '  --text-muted: #c9cfd8;' }, { kind: 'add', line: 9, text: '  --text-muted: #5b6472;' }, { kind: 'ctx', line: 10, text: '  --radius-card: 16px;' }] }
  ] },
  { name: 'pricing.mdx', path: 'src/pricing.mdx', hunks: [
    { title: 'Move the FAQ below the table', lines: [{ kind: 'del', line: 31, text: '<FAQ />' }, { kind: 'ctx', line: 31, text: '<CompareTable />' }, { kind: 'add', line: 32, text: '<FAQ />' }] }
  ] }
];

export default function ChangeReviewDemo() {
  return <div style={{ width: '100%' }}><ChangeReview files={FILES} /></div>;
}
