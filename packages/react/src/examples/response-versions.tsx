'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ResponseVersions } from '../components/response-versions/ResponseVersions';
import { useScript, type Script } from './useScript';

/* ---------- Response versions: the first answer streams in; regenerate writes another and the arrows page between them ---------- */
const POOL = [
  'Pricing that grows with your team. Start free, upgrade when the work gets serious.',
  'One plan per stage of your team. No seat math, no surprises on the invoice.',
  'Design faster with an agent on every plan. Pay for what you ship, not for seats.',
  'Simple pricing for teams who ship. Free to start, fair as you grow.'
];
export default function ResponseVersionsDemo() {
  const [versions, setVersions] = useState<string[]>(['']);
  const [version, setVersion] = useState(0);
  const [streaming, setStreaming] = useState(true);
  const [status, setStatus] = useState('');
  const script = useRef<Script>(null);

  // writes a version word by word, the way an answer streams in
  const stream = async ({ wait }: Script, at: number, text: string) => {
    await wait(260);
    let out = '';
    for (const w of text.split(' ')) { out += (out ? ' ' : '') + w; const now = out; setVersions(v => v.map((x, i) => i === at ? now : x)); await wait(45); }
  };
  useScript(async s => {
    script.current = s;
    await s.wait(300); await stream(s, 0, POOL[0]); setStreaming(false);
  });
  const regenerate = async () => {
    const s = script.current; if (!s || streaming) return;
    const at = versions.length;
    setStreaming(true); setStatus('Writing a new version');
    setVersions(v => [...v, '']); setVersion(at);
    await stream(s, at, POOL[at % POOL.length]);
    setStreaming(false); setStatus('');
  };

  return (
    <div style={{ width: '100%' }}>
      <ResponseVersions prompt="Write a headline for the pricing page" versions={versions} version={version} onVersionChange={setVersion}
        streaming={streaming} status={status} onRegenerate={regenerate} />
    </div>
  );
}
