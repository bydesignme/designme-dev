'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ResponseVersions } from '../components/response-versions/ResponseVersions';
import { useScript, useTakeover, type Script } from './useScript';

/* ---------- Response versions: the first answer streams in, then one regenerate plays by itself; the arrows page between them ---------- */
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
  const ref = useRef<HTMLDivElement>(null), mine = useTakeover(ref), count = useRef(1);
  useScript(async s => {
    script.current = s;
    await s.wait(300); await stream(s, 0, POOL[0]); setStreaming(false);
    // then one regenerate plays by itself, so the version count and arrows show what they do, unless you have taken over
    await s.wait(1900); if (!mine() && count.current === 1) await regenerate(true);
  });
  const regenerate = async (auto = false) => {
    const s = script.current; if (!s || (streaming && !auto)) return;
    const at = count.current++;
    setStreaming(true); setStatus('Writing a new version');
    setVersions(v => [...v, '']); setVersion(at);
    await stream(s, at, POOL[at % POOL.length]);
    setStreaming(false); setStatus('');
  };

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ResponseVersions prompt="Write a headline for the pricing page" versions={versions} version={version} onVersionChange={setVersion}
        streaming={streaming} status={status} onRegenerate={() => regenerate()} />
    </div>
  );
}
