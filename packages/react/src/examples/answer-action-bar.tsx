'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { AnswerActionBar, type AnswerVersion } from '../components/answer-action-bar/AnswerActionBar';
import { useScript, useStory, useWait } from './useScript';

/* ---------- Answer action bar: listen, hear a wrong number, rate it down, say why, ride out a dropped connection, copy the fix ---------- */
// the versions a regenerate writes, in turn; $24 to $19 a month saves 21%, so the first one is wrong
const POOL: AnswerVersion[] = [
  { text: 'Pro is $24 a month, or $19 a month when billed yearly. That saves 15%, and yearly is the option the new pricing page shows first.', meta: 'Sonnet 5.5 · 6.2s' },
  { text: 'Pro is $24 a month, or $19 a month billed yearly, which saves 21%, or $60 a year. The new pricing page shows the yearly price first.', changed: '21%, or $60 a year.', meta: 'Sonnet 5.5 · 4.8s' },
  { text: 'Billed yearly, Pro drops from $24 to $19 a month: $60 back each year, about 21%. That is why the pricing page leads with yearly.', changed: '$60 back each year,', meta: 'Sonnet 5.5 · 5.1s' }
];

export default function AnswerActionBarDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [versions, setVersions] = useState<AnswerVersion[]>([{ ...POOL[0], text: '' }]);
  const [version, setVersion] = useState(0);
  const [streaming, setStreaming] = useState(true);
  const [status, setStatus] = useState('');
  const [tone, setTone] = useState<'warn' | 'ok'>();
  const failed = useRef(false);

  // a version streams in word by word
  const stream = async (i: number, v: AnswerVersion) => {
    setStreaming(true);
    const ws = v.text.split(' ');
    for (let k = 1; k <= ws.length; k++) { setVersions(vs => vs.map((x, j) => j === i ? { ...v, text: ws.slice(0, k).join(' ') } : x)); await wait(38); }
    setStreaming(false);
  };
  useScript(async ({ wait: w }) => { await w(300); await stream(0, POOL[0]); });

  // regenerate writes the next version; the first time after a thumbs down the connection drops once and is retried
  const regenerate = async (note?: string) => {
    if (streaming) return;
    const label = 'Writing a new version' + (note ? ' with your note' : '');
    setTone(undefined); setStatus(label); setStreaming(true);
    if (note && !failed.current) {
      failed.current = true; await wait(1200);
      for (let k = 2; k > 0; k--) { setTone('warn'); setStatus(`Couldn't reach Sonnet 5.5. Retrying in ${k}s`); await wait(1000); }
      setTone(undefined); setStatus(label);
    }
    const i = versions.length, v = POOL[Math.min(i, POOL.length - 1)];
    setVersions(vs => [...vs, { ...v, text: '' }]); setVersion(i);
    await stream(i, v);
    setTone('ok'); setStatus(i === 1 ? 'Version 2 fixes the saving: 21%, not 15%' : `Version ${i + 1} of ${i + 1}`);
  };

  // the preview's story: listen until the wrong number, pause, rate it down, pick why, then copy the fix
  useStory(ref, async ({ wait, press }) => {
    await wait(2900); press('.dm-aab-rd');
    await wait(4100); press('.dm-aab-rd');
    await wait(500); press('.dm-aab-dn');
    await wait(1500); press('.dm-aab-ch .dm-chip');
    await wait(400 + 1200 + 2000 + 1200 + 1500); press('.dm-aab-cp');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <AnswerActionBar question="How much do people save on the yearly Pro plan?" versions={versions} version={version} onVersionChange={setVersion}
        streaming={streaming} status={status} statusTone={tone} onRegenerate={() => void regenerate()}
        onReason={(_, reason) => { setTimeout(() => void regenerate(reason), 400); }}
        onCopy={() => { setTone('ok'); setStatus('Copied without the highlights'); }} />
    </div>
  );
}
