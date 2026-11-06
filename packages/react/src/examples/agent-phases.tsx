'use client';
// The animated preview from designme.dev, rebuilt from the React component: the search times out and is retried, reading is
// slow, the agent asks before offering a refund, and the finished line opens to the phases.
import { useEffect, useRef, useState } from 'react';
import { AgentPhases, type AgentPhase } from '../components/agent-phases/AgentPhases';
import { useStory, useWait } from './useScript';

export default function AgentPhasesDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [phase, setPhase] = useState<AgentPhase>('thinking');
  const [label, setLabel] = useState<string | undefined>('Thinking about the question');
  const [failed, setFailed] = useState(false);
  const [slow, setSlow] = useState(false);
  const [open, setOpen] = useState(false);
  const [took, setTook] = useState<Partial<Record<AgentPhase, number>>>({});
  const answer = useRef<((v: boolean) => void) | null>(null);
  const until = (f: (done: (v: boolean) => void) => void) => new Promise<boolean>(res => f(res));
  // the agent's work, which goes on whatever the visitor does; it waits for a person only to retry and to approve
  useEffect(() => { void (async () => {
    await wait(1600); setTook({ thinking: 2 });
    setPhase('searching'); setLabel('Searching the help centre'); await wait(1300);
    setFailed(true); await until(res => { answer.current = res; }); setFailed(false);
    setLabel('Searching the help centre again'); await wait(1200); setTook(t => ({ ...t, searching: 4 }));
    setPhase('reading'); setLabel('Reading 3 articles'); await wait(1800); setSlow(true); await wait(2200); setSlow(false); setTook(t => ({ ...t, reading: 4 }));
    setPhase('waiting'); setLabel(undefined);
    const ok = await until(res => { answer.current = res; });
    setTook(t => ({ ...t, waiting: 2 }));
    setPhase('writing'); setLabel(ok ? 'Writing the reply with the refund' : 'Writing the reply without a refund'); await wait(2000); setTook(t => ({ ...t, writing: 2 }));
    setPhase('done'); setLabel(undefined);
  })(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const reply = (v: boolean) => { const f = answer.current; answer.current = null; f?.(v); };
  // the person in the preview: retry, approve, then open the finished line
  useStory(ref, async ({ wait, press }) => {
    await wait(4400); press('.dm-aph-n .dm-pill');
    await wait(9000); press('.dm-aph-n .dm-primary');
    await wait(3500); press('.dm-aph-h');
  }, { hold: false });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <AgentPhases phase={phase} label={label} took={took} open={open} onOpenChange={setOpen}
        error={failed ? { text: 'The search timed out', detail: "The help centre didn't answer in 10s", onRetry: () => reply(true) } : undefined}
        slow={slow ? { text: 'Still working, the refund policy is a long page' } : undefined}
        ask={{ text: 'Offer Maya a refund of $48?', onApprove: () => reply(true), onDecline: () => reply(false) }} />
    </div>
  );
}
