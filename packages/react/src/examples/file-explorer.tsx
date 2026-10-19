'use client';
// The preview from designme.dev, rebuilt from the React component: the tree opens on the file being worked on.
import { FileExplorer, type FileExplorerNode } from '../components/file-explorer/FileExplorer';

const TREE: FileExplorerNode[] = [
  { name: 'src', children: [
    { name: 'components', children: [{ name: 'PlanCard.tsx', status: 'M' }, { name: 'PriceTag.tsx', status: 'A' }, { name: 'Button.tsx' }, { name: 'LegacyCTA.tsx', status: 'D' }] },
    { name: 'styles', children: [{ name: 'tokens.css', status: 'M' }, { name: 'globals.css' }] },
    { name: 'pages', children: [{ name: 'pricing.mdx', status: 'M' }, { name: 'index.mdx' }] }
  ] },
  { name: 'public', children: [{ name: 'og-pricing.png', status: 'A' }, { name: 'favicon.svg' }] },
  { name: 'package.json' }, { name: 'README.md' }
];

/* ---------- File explorer: the agent's changes marked, filter and "only changed" to narrow it down ---------- */
export default function FileExplorerDemo() {
  return (
    <div style={{ width: '100%' }}>
      <FileExplorer tree={TREE} defaultOpen={['src', 'src/components', 'src/styles']} defaultSelected="src/components/PlanCard.tsx" />
    </div>
  );
}
