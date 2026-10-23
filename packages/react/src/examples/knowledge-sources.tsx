'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { useStory } from './useScript';
import { KnowledgeSources, type KnowledgeSource, type KnowledgeSourcesFolder } from '../components/knowledge-sources/KnowledgeSources';

/* ---------- Knowledge sources: a website is added and waits its turn; a scanned PDF fails, is read again with OCR, and everything ends indexed ---------- */
type Src = KnowledgeSource & { ms: number; total: number; scan?: boolean };
const START: Src[] = [
  { key: 'docs', kind: 'folder', name: 'Product docs', count: 86, state: 'ready', synced: '2m ago', chunks: 642, total: 642, ms: 2500 },
  { key: 'play', kind: 'files', name: 'Sales playbooks', count: 18, unit: 'files', state: 'ready', synced: '1h ago', chunks: 318, total: 318, ms: 2500 },
  { key: 'pdf', kind: 'files', name: 'Brand book 2024.pdf', count: 24, state: 'queued', total: 48, ms: 19000, scan: true }
];
const FOLDERS: KnowledgeSourcesFolder[] = [{ key: 'specs', name: 'Design specs', detail: 'Google Drive' }, { key: 'research', name: 'Research notes', detail: 'Notion' }];
const SIZE: Record<string, [number, number]> = { specs: [57, 230], research: [31, 124] };

export default function KnowledgeSourcesDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [sources, setSources] = useState<Src[]>(START);
  const [folders, setFolders] = useState(FOLDERS);
  const [address, setAddress] = useState('');
  const patch = (key: string, p: Partial<Src>) => setSources(ss => ss.map(s => s.key === key ? { ...s, ...p } : s));
  const add = (s: Omit<Src, 'state'>) => setSources(ss => [...ss.filter(x => x.key !== s.key), { ...s, state: 'queued' }]);

  // one source indexes at a time and the rest wait in line; a scanned PDF stops where its text runs out until it is read with OCR
  useEffect(() => {
    const id = setInterval(() => setSources(ss => {
      let i = ss.findIndex(s => s.state === 'indexing');
      if (i < 0) { i = ss.findIndex(s => s.state === 'queued'); if (i < 0) return ss; return ss.map((s, k) => k === i ? { ...s, state: 'indexing', done: 0 } : s); }
      const s = ss[i], done = Math.min(s.count, (s.done ?? 0) + s.count * 100 / s.ms);
      const next: Src = s.scan && done >= 9 ? { ...s, state: 'failed', done: 9, error: 'Scanned PDF, no text found', fix: 'Retry with OCR' }
        : done >= s.count ? { ...s, state: 'ready', done, synced: 'just now', chunks: s.total } : { ...s, done };
      return ss.map((x, k) => k === i ? next : x);
    }), 100);
    return () => clearInterval(id);
  }, []);

  // the preview's story: add the docs site, which waits its turn, then read the scanned PDF again with OCR
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-ksx-add');
    await wait(1000); press('.dm-ksx-pop .dm-mi:nth-child(2)');
    await wait(500);
    const url = 'designme.dev/docs';
    for (let k = 1; k <= url.length; k++) { setAddress(url.slice(0, k)); await wait(50); }
    await wait(500); press('.dm-ksx-pop button[type="submit"]');
    const failed = () => ref.current?.querySelector('.dm-ksx-s[data-st="failed"]');
    for (let k = 0; k < 150 && !failed(); k++) await wait(100);
    await wait(1000); press('.dm-ksx-s[data-st="failed"] .dm-ksx-fx .dm-accent');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <KnowledgeSources
        sources={sources}
        address={address} onAddressChange={setAddress}
        onAddWebsite={a => add({ key: 'web:' + a, kind: 'web', name: a, count: 142, total: 196, ms: 4500 })}
        onUpload={fs => add({ key: 'up:' + fs.map(f => f.name).join(), kind: 'files', name: fs.length === 1 ? fs[0].name : fs.length + ' files', count: fs.length, unit: 'files', total: fs.length * 12, ms: 1500 })}
        folders={folders}
        onConnectFolder={k => { const f = folders.find(x => x.key === k)!; setFolders(fs => fs.filter(x => x.key !== k)); add({ key: k, kind: 'folder', name: f.name, count: SIZE[k][0], total: SIZE[k][1], ms: 3000 }); }}
        onFix={k => patch(k, { state: 'queued', scan: false, ms: 3000, note: 'Queued to read with OCR', error: undefined, fix: undefined })}
        onResync={k => patch(k, { state: 'queued', note: undefined })}
        onRemove={k => setSources(ss => ss.filter(s => s.key !== k))}
      />
    </div>
  );
}
