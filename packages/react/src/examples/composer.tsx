'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { Composer, type ComposerAttachment } from '../components/composer/Composer';
import { Icon, type IconName } from '../lib/icons';
import { Think } from '../lib/motion';
import { useScript, useStory, type Script } from './useScript';

/* ---------- Composer: attach a frame that won't open, try again, write the ask, switch to Edit, send and get a reply ---------- */
const ADDS: Record<string, [IconName, string]> = { file: ['file-text', 'Spacing notes.pdf'], figma: ['figma', 'Pricing / Desktop'], shot: ['image', 'Screenshot 10.42'] };
const CONTEXTS = [
  { value: 'Pricing v4', detail: 'Figma, 6 frames', icon: 'figma' as const },
  { value: 'Checkout flow', detail: 'Figma, 4 frames', icon: 'figma' as const },
  { value: 'Marketing site', detail: 'Code, main branch', icon: 'code' as const }
];
// the page can't use a microphone, so dictation plays this sample
const SAID = 'Tighten the spacing on the plan cards and keep the buttons the same height';
const REPLY: Record<string, (ctx: string) => string> = {
  ask: ctx => `Looking at ${ctx}. I won't change anything.`,
  edit: ctx => `On it. I'll make the changes on a new page in ${ctx}.`,
  plan: ctx => `I'll write a plan for ${ctx} first, then wait for you.`
};

type Msg = { id: number; from: 'you' | 'agent'; text: string; files?: string[]; working?: boolean };

export default function ComposerDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');
  const [files, setFiles] = useState<ComposerAttachment[]>([]);
  const [ctx, setCtx] = useState('Pricing v4');
  const [mode, setMode] = useState('ask');
  const [thread, setThread] = useState<Msg[]>([]);
  const [dictating, setDictating] = useState(false);
  const script = useRef<Script>(null), take = useRef(0), ids = useRef(0), tries = useRef(0);
  useScript(async s => { script.current = s; });
  const live = useRef({ ctx, mode });
  useEffect(() => { live.current = { ctx, mode }; });

  // a file loads before it can be sent; the first Figma link can't be opened, and Try again fetches it
  const load = (key: string, kind: string) => {
    const fail = kind === 'figma' && tries.current++ === 0;
    setFiles(f => f.map(x => x.key === key ? { ...x, status: 'loading', label: ADDS[kind][1] } : x));
    script.current?.wait(1000).then(() => setFiles(f => f.map(x => x.key === key ? { ...x, status: fail ? 'error' : 'ready', label: fail ? ADDS[kind][1] + " can't be opened" : ADDS[kind][1] } : x)));
  };
  const add = (kind: string) => { const key = kind + ++ids.current; setFiles(f => [...f, { key, icon: ADDS[kind][0], label: ADDS[kind][1], status: 'loading' }]); load(key, kind); };

  const dictate = async () => {
    const s = script.current; if (!s) return;
    const mine = ++take.current;
    setDictating(true);
    await s.wait(700);
    for (const w of SAID.split(' ')) { if (take.current !== mine) return; setText(t => t + (t ? ' ' : '') + w); await s.wait(160 + Math.random() * 120); }
  };
  const send = ({ text: said, attachments }: { text: string; attachments: ComposerAttachment[] }) => {
    const you: Msg = { id: ++ids.current, from: 'you', text: said, files: attachments.map(a => a.label) };
    const agent: Msg = { id: ++ids.current, from: 'agent', text: 'Working', working: true };
    setThread(t => [...t, you, agent].slice(-4));
    const answer = REPLY[live.current.mode](live.current.ctx);
    script.current?.wait(1700).then(() => setThread(t => t.map(m => m.id === agent.id ? { ...m, text: answer, working: false } : m)));
  };

  // the preview's story: the person attaches a frame, it won't open, they try again, write the ask, switch to Edit and send
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); add('figma');
    await wait(2500); press('.dm-rt');
    await wait(1500);
    for (const w of 'Tighten the spacing on the plan cards'.split(' ')) { setText(t => t + (t ? ' ' : '') + w); await wait(150); }
    await wait(1000); press('.dm-cpx-mode');
    await wait(1500); press('.dm-pp-mode .dm-mi:nth-of-type(2)');
    await wait(1000); press('.dm-cpx-send');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <Composer value={text} onValueChange={setText} onSubmit={send}
        attachments={files} onAttachmentsChange={setFiles} onAdd={add}
        onRetry={key => { const f = files.find(x => x.key === key); if (f) load(key, f.key.replace(/\d+$/, '')); }}
        contexts={CONTEXTS} context={ctx} onContextChange={setCtx} mode={mode} onModeChange={setMode}
        onDictate={dictate} dictating={dictating} onDictationEnd={() => { take.current++; setDictating(false); }}
        thread={thread.map(m => m.from === 'you'
          ? <div key={m.id} className="dm-bub dm-enter">
              {m.files?.length ? <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: m.text ? 6 : 0 }}>{m.files.map((f, i) => <span key={i} className="dm-fchip"><Icon name="clip" size="xs" />{f}</span>)}</div> : null}
              {m.text}
            </div>
          : <div key={m.id + (m.working ? 'w' : 'd')} className="dm-cpx-ag dm-enter">
              {m.working ? <><Think /><span className="dm-shim">{m.text}</span></> : <span>{m.text}</span>}
            </div>)} />
    </div>
  );
}
