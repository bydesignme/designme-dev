'use client';
// The animated preview: a welcome-email run that grows inside a chat, the way the tree sits in a product.
import { useEffect, useRef, useState } from 'react';
import { AgentTree, type AgentNode, type AgentNodeStatus } from '../components/agent-tree/AgentTree';
import { useScript, useStory } from './useScript';

type Row = { name: string; task: string; status: AgentNodeStatus; cost: number; tokens: number; seconds: number; kids?: string[] };
type Patch = Partial<Row>;

const START: Record<string, Row> = {
  root: { name: 'Brief', task: 'Splitting the welcome email', status: 'running', cost: .02, tokens: 80, seconds: 0, kids: [] },
};

export default function AgentTreeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(START);
  const [ask, setAsk] = useState<'fix' | 'approve' | null>(null);
  const fixed = useRef<(() => void) | undefined>(undefined);
  const approved = useRef<(() => void) | undefined>(undefined);
  const set = (id: string, patch: Patch) => setRows(r => ({ ...r, [id]: { ...r[id], ...patch } }));
  const spawn = (parent: string, id: string, row: Row) => setRows(r => ({
    ...r,
    [parent]: { ...r[parent], kids: [...(r[parent].kids ?? []), id] },
    [id]: row,
  }));

  useEffect(() => {
    const id = setInterval(() => setRows(r => Object.fromEntries(Object.entries(r).map(([k, x]) => [k, x.status === 'running' ? { ...x, cost: x.cost + (k === 'root' ? .0005 : .0015), tokens: x.tokens + (k === 'root' ? 8 : 22), seconds: x.seconds + .1 } : x]))), 100);
    return () => clearInterval(id);
  }, []);

  useScript(async ({ wait }) => {
    await wait(380);
    spawn('root', 'reader', { name: 'Reader', task: 'Gathers the last sends and the voice notes', status: 'running', cost: .01, tokens: 40, seconds: 0, kids: [] });
    await wait(420);
    spawn('reader', 'r1', { name: 'Read the last 3 sends', task: '3 emails, 1.1k words', status: 'running', cost: .02, tokens: 120, seconds: 0 });
    await wait(980); set('r1', { status: 'done' });
    spawn('reader', 'r2', { name: 'Pull the voice notes', task: 'Tone, length, words to keep', status: 'running', cost: .02, tokens: 80, seconds: 0 });
    await wait(980); set('r2', { status: 'done' }); set('reader', { status: 'done', task: 'Notes and sends are in' });
    spawn('root', 'writer', { name: 'Writer', task: 'Drafts the subject and the body', status: 'running', cost: .02, tokens: 70, seconds: 0, kids: [] });
    spawn('writer', 'w1', { name: 'Draft the subject', task: 'Under 50 characters', status: 'running', cost: .02, tokens: 140, seconds: 0 });
    await wait(1100); set('w1', { status: 'done', task: 'Four options, shortest wins' });
    spawn('writer', 'w2', { name: 'Draft the body', task: 'Under 90 words', status: 'running', cost: .03, tokens: 220, seconds: 0 });
    await wait(1100); set('w2', { status: 'failed', task: 'Runs past 90 words' }); set('writer', { status: 'running', task: 'The draft runs long' }); setAsk('fix');
    await new Promise<void>(res => { fixed.current = () => { fixed.current = undefined; res(); }; wait(2600).then(() => fixed.current?.()); });
    setAsk(null); set('w2', { status: 'running', task: 'Trimming it to 90 words' }); set('writer', { status: 'running', task: 'Drafts the body' });
    await wait(1000); set('w2', { status: 'done', task: '86 words, in the voice notes' }); set('writer', { status: 'done', task: 'Draft is in the voice notes' });
    spawn('root', 'checker', { name: 'Checker', task: 'Checks length and tone', status: 'running', cost: .01, tokens: 60, seconds: 0, kids: [] });
    spawn('checker', 'c1', { name: 'Count the words and the tone', task: 'Against the voice notes', status: 'running', cost: .02, tokens: 180, seconds: 0 });
    await wait(1000); set('c1', { status: 'done', task: '86 words, tone matches' }); set('checker', { status: 'waiting', task: 'Approve the send' }); setAsk('approve');
    await new Promise<void>(res => { approved.current = () => { approved.current = undefined; res(); }; wait(2800).then(() => approved.current?.()); });
    setAsk(null); set('checker', { status: 'running', task: 'Sending is approved' });
    await wait(860); set('checker', { status: 'done', task: 'Length and tone check out' }); set('root', { status: 'done', task: 'Welcome email is ready' });
  });

  useStory(ref, async ({ wait, press }) => {
    await wait(7000); press('.dm-atr-fix');
    await wait(4500); press('.dm-atr-yes');
  }, { hold: false });

  const node = (id: string): AgentNode => {
    const x = rows[id];
    return {
      id, name: x.name, task: x.task, status: x.status, cost: x.cost, tokens: x.tokens, seconds: x.seconds,
      children: x.kids?.map(node),
      ...(id === 'w2' && ask === 'fix' ? { fix: { label: 'Trim to 90 words', onClick: () => fixed.current?.() } } : {}),
      ...(id === 'checker' && ask === 'approve' ? { approval: { approveLabel: 'Approve send', declineLabel: 'Hold', onApprove: () => approved.current?.(), onDecline: () => set('checker', { task: 'Held for you' }) } } : {}),
    };
  };

  const mode = rows.checker?.status === 'waiting' ? 'wait' : rows.w2?.status === 'failed' ? 'fail' : rows.root.status === 'done' ? 'done' : 'run';
  const live = mode === 'done' ? 'Done' : mode === 'fail' ? 'A step failed' : mode === 'wait' ? 'Needs you' : 'Working';

  return (
    <div ref={ref} className="dm-atr-chat dm-panel" data-dm="" style={{ width: '100%' }}>
      <div className="dm-atr-chat-h"><b>Welcome email</b><span className={`dm-atr-chat-live dm-${mode}`}><span className="dm-dot" /><span>{live}</span></span></div>
      <div className="dm-atr-chat-log">
        <p className="dm-atr-chat-me">Rewrite the welcome email. Keep it under 90 words and match the voice notes.</p>
        <div className="dm-atr-chat-ag">
          <AgentTree root={node('root')} title="Welcome email" variant="bare" slim />
        </div>
      </div>
      <div className="dm-atr-chat-box">Ask Brief</div>
    </div>
  );
}
