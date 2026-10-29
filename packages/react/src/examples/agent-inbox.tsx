'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { AgentInbox, type InboxRun } from '../components/agent-inbox/AgentInbox';
import { useScript, useStory, useWait } from './useScript';

/* ---------- Agent inbox: approve the publish, retry the failed export, and watch both land in Done ---------- */
const COLOR: Record<string, string> = { 'Design agent': 'var(--dm-av-l)', 'Build agent': 'var(--dm-av-m)', 'Research agent': 'var(--dm-av-t)', 'Copy agent': 'var(--dm-av-p)', 'QA agent': 'var(--dm-av-b)' };
const START: InboxRun[] = [
  { id: 'pub', title: 'Publish the pricing page', agent: 'Design agent', group: 'needs', detail: 'Waiting for your approval' },
  { id: 'tok', title: 'Export tokens to CSS', agent: 'Build agent', group: 'needs', failed: true, detail: 'Failed: rate limited by Figma', why: 'Figma answered 429 at 10:42. Safe to retry' },
  { id: 'cards', title: 'Rework the plan cards', agent: 'Design agent', group: 'running', detail: 'Editing frame 3 of 6', seconds: 102 },
  { id: 'cmp', title: 'Compare 3 competitor pages', agent: 'Research agent', group: 'running', detail: 'Reading page 3 of 3', seconds: 38 },
  { id: 'copy', title: 'Rewrite plan descriptions', agent: 'Copy agent', group: 'done', ended: '12m ago' },
  { id: 'aud', title: 'Audit pricing contrast', agent: 'QA agent', group: 'done', ended: '25m ago' }
].map(r => ({ ...r, color: COLOR[r.agent] }) as InboxRun);

export default function AgentInboxDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [runs, setRuns] = useState(START);
  // a run that moves goes to the top of its new group
  const move = (id: string, patch: Partial<InboxRun>) => setRuns(rs => { const r = { ...rs.find(x => x.id === id)!, ...patch }; return [r, ...rs.filter(x => x.id !== id)]; });

  // Approve starts the run and Retry tries a failed one again; either runs, then lands in Done
  const start = async (id: string, retry: boolean) => {
    move(id, { group: 'running', failed: false, seconds: 0, detail: retry ? 'Retrying the export' : 'Publishing to designme.studio/pricing' });
    await wait(retry ? 5000 : 4000);
    move(id, { group: 'done', ended: 'Just now' });
  };

  // the research run finishes on its own while you look
  useScript(async ({ wait }) => { await wait(6000); move('cmp', { group: 'done', ended: 'Just now' }); });

  // the preview's story: approve the publish, then retry the export
  useStory(ref, async ({ wait, press }) => {
    await wait(3000); press('[aria-label="Approve Publish the pricing page"]');
    await wait(2500); press('[aria-label="Retry Export tokens to CSS"]');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <AgentInbox runs={runs} onApprove={id => void start(id, false)} onRetry={id => void start(id, true)} />
    </div>
  );
}
