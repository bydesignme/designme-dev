'use client';
// The animated preview from designme.dev, rebuilt from the React component: one sentence, the fields fill in (the avatar takes a
// colour and a shape), one test email while the avatar thinks, save, publish.
import { useRef, useState } from 'react';
import { AgentBuilder, type AgentBuilderProps, type AgentDraft, type AgentSection } from '../components/agent-builder/AgentBuilder';
import { useStory, useWait } from './useScript';

const EMPTY: AgentDraft = { name: '', purpose: '', color: 'accent', instructions: '', model: 'Haiku 5', effort: 'med', trigger: 'chat', triggerDetail: 'When someone messages it',
  tools: [{ key: 'gmail', label: 'Gmail', brand: 'gmail', level: 'read' }, { key: 'linear', label: 'Linear', brand: 'linear', level: 'read' }, { key: 'slack', label: 'Slack', brand: 'slack', level: 'read' }], knowledge: [] };
const DRAFT: Record<AgentSection, Partial<AgentDraft>> = {
  id: { name: 'Support triage', purpose: 'Sorts incoming support emails and routes them to the right team' },
  ins: { instructions: 'Read each new email. Tag it Billing, Bug or How-to, set its priority, and route it to that team. Draft a reply for billing refunds but never send money without asking.' },
  model: { model: 'Sonnet 5', effort: 'med' },
  tools: { tools: [{ key: 'gmail', label: 'Gmail', brand: 'gmail', level: 'act' }, { key: 'linear', label: 'Linear', brand: 'linear', level: 'act' }, { key: 'slack', label: 'Slack', brand: 'slack', level: 'ask' }] },
  know: { knowledge: [{ label: 'Refund policy.pdf', icon: 'file-text' }, { label: 'Help centre', icon: 'globe' }, { label: 'Team routing.csv', icon: 'table' }] },
  trig: { trigger: 'event', triggerDetail: 'When an email arrives at support@' }
};
const TRIG = { chat: 'When someone messages it', sched: 'Every weekday at 9:00', event: 'When an email arrives at support@' };

export default function AgentBuilderDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [desc, setDesc] = useState('');
  const [value, setValue] = useState(EMPTY);
  const [drafting, setDrafting] = useState<AgentSection | null>(null);
  const [drafted, setDrafted] = useState<AgentSection[]>([]);
  const [status, setStatus] = useState<AgentBuilderProps['status']>('empty');
  const [publishing, setPublishing] = useState(false);
  const [test, setTest] = useState<AgentBuilderProps['test']>();
  const draft = async () => {
    for (const k of Object.keys(DRAFT) as AgentSection[]) {
      setDrafting(k); await wait(550); setValue(v => ({ ...v, ...DRAFT[k] }));
      // it names the agent, then picks its avatar's colour and shape
      if (k === 'id') { await wait(350); setValue(v => ({ ...v, color: 'violet' })); await wait(350); setValue(v => ({ ...v, shape: 'circle' })); }
      setDrafted(d => d.includes(k) ? d : [...d, k]);
    }
    setDrafting(null); setStatus('dirty');
  };
  const runTest = async () => {
    setTest({ email: { subject: 'I was charged twice for October', body: 'Hi, my card shows two charges of $48 on Oct 3. Can you refund one? Maya', from: 'maya@lumen.co · sample' }, reply: 'busy' });
    await wait(2000);
    setTest(t => t && { ...t, reply: { tags: [{ label: 'Billing' }, { label: 'High priority', tone: 'warn' }, { label: 'Routed to Billing' }], text: 'Duplicate charge of $48 on Oct 3. I drafted a refund reply and will ask before sending it, as the instructions say.' } });
  };
  const publish = async () => { setPublishing(true); await wait(800); setPublishing(false); setStatus('live'); };
  useStory(ref, async ({ wait, press, taken }) => {
    await wait(1000);
    const text = 'Triage support emails';
    taken(() => setDesc(''));
    for (let i = 1; i <= text.length; i++) { setDesc(text.slice(0, i)); await wait(60); }
    await wait(500); press('.dm-abx-askr .dm-pill');
    await wait(5000); press('.dm-abx-bar .dm-pill:first-of-type');
    await wait(4000); press('.dm-abx-bar .dm-pill:nth-of-type(2)');
    await wait(1000); press('.dm-abx-bar .dm-primary');
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <AgentBuilder value={value} description={desc} onDescriptionChange={setDesc} onDraft={() => { void draft(); }} drafting={drafting} drafted={drafted} status={status}
        onChange={(v, section) => { setValue({ ...v, triggerDetail: TRIG[v.trigger] }); setDrafted(d => d.filter(x => x !== section)); if (status !== 'empty') setStatus('dirty'); }}
        onSave={() => setStatus('saved')} onPublish={publish} publishing={publishing} onTest={() => { void runTest(); }} test={test} />
    </div>
  );
}
