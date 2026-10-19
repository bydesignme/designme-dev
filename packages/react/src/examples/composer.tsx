'use client';
// The interactive preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { Composer, type ComposerAttachment } from '../components/composer/Composer';
import { Icon, type IconName } from '../lib/icons';
import { Think } from '../lib/motion';
import { useScript, type Script } from './useScript';

/* ---------- Composer: add context, pick where it runs, dictate from a sample, send and get a reply ---------- */
const ADDS: Record<string, [IconName, string]> = { file: ['file-text', 'brief.pdf'], shot: ['image', 'Screenshot 10.42'], figma: ['figma', 'Pricing / Desktop'] };
const PROJECTS = ['acme-webapp', 'marketing-site', 'design-tokens'].map(p => ({ value: p, detail: '~/code/' + p }));
// the page can't use a microphone, so dictation plays this sample
const SAID = 'Can you tighten the spacing on the pricing cards and keep the buttons the same height? Then run the visual tests before you open the PR.';

type Msg = { id: number; from: 'you' | 'agent'; text: string; files?: string[]; thinking?: boolean };

export default function ComposerDemo() {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<ComposerAttachment[]>([]);
  const [thread, setThread] = useState<Msg[]>([]);
  const [dictating, setDictating] = useState(false);
  const script = useRef<Script>(null), take = useRef(0), ids = useRef(0), speaking = useRef(0);
  useScript(async s => { script.current = s; });

  const dictate = async () => {
    const s = script.current; if (!s) return;
    const mine = ++take.current;
    speaking.current = 0; setDictating(true);
    await s.wait(900);
    for (const w of SAID.split(' ')) {
      if (take.current !== mine) return;
      speaking.current = 6; setText(t => t + (t ? ' ' : '') + w);
      await s.wait(150 + Math.random() * 140 + (/[?.,]$/.test(w) ? 520 : 0));
    }
  };
  // one bar of the waveform: loud while a word was just said, quiet in between
  const level = () => {
    if (speaking.current <= 0) return 0;
    speaking.current--;
    return Math.min(1, .25 + Math.random() * .75 * (.6 + .4 * Math.sin(performance.now() / 90)));
  };
  const send = ({ text: said, attachments }: { text: string; attachments: ComposerAttachment[] }) => {
    const you: Msg = { id: ++ids.current, from: 'you', text: said, files: attachments.map(a => a.label) };
    const agent: Msg = { id: ++ids.current, from: 'agent', text: 'Thinking', thinking: true };
    setThread(t => [...t, you, agent].slice(-4));
    script.current?.wait(1700).then(() => setThread(t => t.map(m => m.id === agent.id ? { ...m, text: "On it. I'll start with the pricing cards.", thinking: false } : m)));
  };

  return (
    <div style={{ width: '100%' }}>
      <Composer value={text} onValueChange={setText} onSubmit={send}
        attachments={files} onAttachmentsChange={setFiles}
        onAdd={v => { const [icon, label] = ADDS[v]; setFiles(f => [...f, { key: v + ++ids.current, icon, label }]); }}
        projects={PROJECTS} handoffNote="2 cloud machines free · 4 hours left this month"
        onDictate={dictate} dictating={dictating} level={level} onDictationEnd={() => { take.current++; setDictating(false); }}
        thread={thread.map(m => m.from === 'you'
          ? <div key={m.id} className="dm-bub dm-enter">
              {m.files?.length ? <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: m.text ? 6 : 0 }}>{m.files.map((f, i) => <span key={i} className="dm-fchip"><Icon name="clip" size="xs" />{f}</span>)}</div> : null}
              {m.text}
            </div>
          : <div key={m.id + (m.thinking ? 't' : 'd')} className="dm-cpx-ag dm-enter">
              {m.thinking ? <><Think /><span className="dm-shim">{m.text}</span></> : <span>{m.text}</span>}
            </div>)} />
    </div>
  );
}
