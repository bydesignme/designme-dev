'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { CodeViewer, type CodeFile, type CodePiece, type CodeToken } from '../components/code-viewer/CodeViewer';
import { useScript } from './useScript';

/** Turns "<k>return</k> (" into highlight pieces, so the code below reads like code */
const hl = (src: string): CodePiece[] => src.split(/(<(?:k|s|f|cm|tg|at)>.*?<\/(?:k|s|f|cm|tg|at)>)/).filter(Boolean)
  .map(p => { const m = p.match(/^<(\w+)>(.*)<\/\1>$/); return m ? [m[1] as CodeToken, m[2]] : p; });

/* ---------- Code viewer: a changed file, and after a moment the agent explains one of its lines ---------- */
const FILES: CodeFile[] = [
  { name: 'PlanCard.tsx', lines: [
    { code: hl('<k>import</k> { Button } <k>from</k> <s>"@/ui/button"</s>;') },
    { code: '' },
    { code: hl('<k>export function</k> <f>PlanCard</f>({ plan }) {') },
    { code: hl('  <cm>// One CTA per card, annual price first</cm>'), changed: true, note: 'The agent removed the second link here. The design review said two CTAs split attention.' },
    { code: hl('  <k>return</k> (') },
    { code: hl('    <tg><Card</tg> <at>padding</at>=<s>"lg"</s><tg>></tg>') },
    { code: hl('      <tg><Price</tg> <at>value</at>={plan.annual} <at>was</at>={plan.monthly} <tg>/></tg>'), changed: true, note: 'Shows the monthly price crossed out next to the annual one. This is the change behind the 18% lift.' },
    { code: hl('      <tg><Button</tg> <at>variant</at>=<s>"primary"</s><tg>></tg>{plan.cta}<tg></Button></tg>'), changed: true, note: 'Swapped the custom button for the shared one, so it picks up the library tokens.' },
    { code: hl('    <tg></Card></tg>') },
    { code: '  );' },
    { code: '}' }
  ] },
  { name: 'tokens.css', lines: [
    { code: hl('<f>:root</f> {') },
    { code: hl('  --text-muted: <s>#5b6472</s>;'), changed: true, note: 'Was #c9cfd8. Contrast on white goes from 2.1 to 5.9, which passes AA.' },
    { code: hl('  --radius-card: <s>16px</s>;') },
    { code: hl('  --space-card: <s>24px</s>;'), changed: true, note: 'Matched to the 4px grid. Was 18px.' },
    { code: '}' }
  ] }
];

export default function CodeViewerDemo() {
  const [line, setLine] = useState<number | null>(null);
  useScript(async ({ wait }) => { await wait(1200); setLine(l => l ?? 6); });
  return <div style={{ width: '100%' }}><CodeViewer files={FILES} line={line} onLineChange={setLine} /></div>;
}
