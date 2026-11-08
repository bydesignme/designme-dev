'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { RunDrawer, type RunLogLine, type RunSpan, type RunDrawerState, type RunDrawerStep, type RunTab } from '../components/run-drawer/RunDrawer';
import { useStory } from './useScript';

/* ---------- Run drawer: a test run with one retry pauses for an approval, the person approves, then reads the errors and
   what the research handed on ---------- */
const STEPS: RunDrawerStep[] = [
  { id: 'form', title: 'Demo request form', kind: 'trigger', icon: 'file-text', input: { source: 'Website form', form: 'Book a demo' }, output: { name: 'Priya Shah', email: 'priya@corvid.io', company: 'Corvid Analytics', seats: 240 } },
  { id: 'research', title: 'Research and score', kind: 'ai', icon: 'spark', input: { company: 'Corvid Analytics', email: 'priya@corvid.io', seats: 240 }, output: { score: 84, tier: 'Enterprise', reasons: ['Asked for 240 seats', 'Support team use case', 'Series B and hiring'] } },
  { id: 'fit', title: 'Good fit?', kind: 'branch', icon: 'branch', input: { score: 84, rule: 'score is at least 70' }, output: { path: 'Yes' } },
  { id: 'reply', title: 'Draft a reply', kind: 'ai', icon: 'edit', input: { name: 'Priya Shah', reasons: '3 reasons' }, output: { subject: 'Your demo with Fernhill', body: 'Hi Priya, thanks for reaching out about 240 seats.' } },
  { id: 'approve', title: 'Rep approves', kind: 'approval', icon: 'user', input: { ask: ['Maya Kim', 'Theo Reed'], via: 'Slack message' }, output: { decision: 'Approved', by: 'You' } },
  { id: 'send', title: 'Send the reply', kind: 'app', icon: 'mail', input: { to: 'priya@corvid.io', subject: 'Your demo with Fernhill' }, output: { message_id: 'msg_8f2c41', sent: true } },
  { id: 'post', title: 'Post to Slack', kind: 'output', icon: 'hash', input: { channel: '#inbound-leads' }, output: { ts: '1731062520.4' } }
];
// the run up to the approval, then what follows it from the moment it is approved
const BEFORE: RunSpan[] = [
  { id: 'a', step: 'form', name: 'Demo request form', kind: 'trigger', icon: 'file-text', start: 0, end: .25 },
  { id: 'b', step: 'research', name: 'Research and score', kind: 'ai', icon: 'spark', start: .25, end: 6.3 },
  { id: 'b1', step: 'research', name: 'Sonnet 5.5, reads the input', kind: 'model', icon: 'spark', level: 1, start: .25, end: .85 },
  { id: 'b2', step: 'research', name: 'Company lookup', kind: 'tool', icon: 'globe', level: 1, start: .85, end: 2.35, state: 'bad' },
  { id: 'b3', step: 'research', name: 'Wait 2s, then try again', kind: 'retry', icon: 'refresh', level: 1, start: 2.35, end: 4.35 },
  { id: 'b4', step: 'research', name: 'Company lookup, try 2', kind: 'tool', icon: 'globe', level: 1, start: 4.35, end: 5.05 },
  { id: 'b5', step: 'research', name: 'Sonnet 5.5, writes the score', kind: 'model', icon: 'spark', level: 1, start: 5.05, end: 6.3 },
  { id: 'c', step: 'fit', name: 'Good fit?', kind: 'branch', icon: 'branch', start: 6.3, end: 6.4 },
  { id: 'd', step: 'reply', name: 'Draft a reply', kind: 'ai', icon: 'edit', start: 6.4, end: 7.6 },
  { id: 'd1', step: 'reply', name: 'Sonnet 5.5, writes the reply', kind: 'model', icon: 'spark', level: 1, start: 6.4, end: 7.6 }
];
const ASK = 7.6;
const LOG: RunLogLine[] = [
  { at: 0, level: 'info', title: 'Run started', message: 'Test run with Priya Shah, Corvid Analytics' },
  { at: .25, level: 'debug', title: 'Demo request form', message: 'New submission from priya@corvid.io' },
  { at: .85, level: 'debug', title: 'Sonnet 5.5, reads the input', message: '380 tokens' },
  { at: 2.35, level: 'error', title: 'Company lookup', message: '429 Too many requests' },
  { at: 2.35, level: 'warn', title: 'Company lookup', message: 'Trying again in 2s, try 2 of 2' },
  { at: 5.05, level: 'info', title: 'Company lookup', message: 'Found Corvid Analytics on try 2' },
  { at: 6.3, level: 'info', title: 'Research and score', message: 'Scored 84, Enterprise' },
  { at: 6.4, level: 'info', title: 'Good fit?', message: 'score is 84, at least 70, so it took Yes' },
  { at: 7.6, level: 'info', title: 'Draft a reply', message: 'Drafted "Your demo with Fernhill"' },
  { at: 7.6, level: 'warn', title: 'Rep approves', message: 'Waiting for Maya Kim or Theo Reed' }
];
const TOK: [number, number, number][] = [[.25, .85, 380], [5.05, 6.3, 1240], [6.4, 7.6, 980]];

export default function RunDrawerDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(2088);
  const [time, setTime] = useState(0);
  const [state, setState] = useState<RunDrawerState>('running');
  const [ok, setOk] = useState<number | null>(null);
  const [no, setNo] = useState<number | null>(null);
  const [tab, setTab] = useState<RunTab>('steps');
  const [level, setLevel] = useState<'all' | 'warn' | 'error'>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const end = ok == null ? null : ok + .95;
  // the run's clock: it keeps going while the approval waits, and stops at the end or when stopped
  useEffect(() => {
    if (state !== 'running' && state !== 'waiting') return;
    let raf = 0, last = 0;
    const go = (now: number) => {
      const dt = last ? Math.min(.1, (now - last) / 1000) : 0; last = now;
      setTime(t => { const v = t + dt; if (ok == null && v >= ASK && state === 'running') setState('waiting'); if (end != null && v >= end) { setState('passed'); return end; } return v; });
      raf = requestAnimationFrame(go);
    };
    raf = requestAnimationFrame(go); return () => cancelAnimationFrame(raf);
  }, [state, ok, end, run]);
  const approve = () => { setOk(time); setState('running'); };
  const ask: RunSpan = { id: 'e', step: 'approve', name: 'Rep approves', kind: 'approval', icon: 'user', start: ASK, end: ok ?? no ?? undefined, state: ok != null ? 'ok' : no != null ? 'bad' : 'wait' };
  const spans: RunSpan[] = [...BEFORE, ask,
    ...(ok == null ? [] : [{ id: 'f', step: 'send', name: 'Send the reply', kind: 'app' as const, icon: 'mail' as const, start: ok, end: ok + .55 }, { id: 'g', step: 'post', name: 'Post to Slack', kind: 'output' as const, icon: 'hash' as const, start: ok + .55, end: ok + .95 }])]
    .map(s => state === 'stopped' && (s.end == null || s.end > time) ? { ...s, end: Math.min(s.end ?? time, time), state: 'stop' as const } : s).filter(s => s.start <= time + 1e-6);
  const log: RunLogLine[] = [...LOG, ...(no == null ? [] : [{ at: no, level: 'error' as const, title: 'Rep approves', message: 'Rejected by you. Nothing was sent' }]), ...(ok == null ? [] : [{ at: ok, level: 'info' as const, title: 'Rep approves', message: 'Approved by you' }, { at: ok + .55, level: 'info' as const, title: 'Send the reply', message: 'Sent to priya@corvid.io' }, { at: ok + .95, level: 'info' as const, title: 'Post to Slack', message: 'Posted to #inbound-leads' }, { at: ok + .95, level: 'info' as const, title: 'Run passed', message: `${(ok + .95).toFixed(1)}s, 1 retry` }])];
  const tokens = Math.round(TOK.reduce((n, [a, b, k]) => n + k * Math.max(0, Math.min(1, (time - a) / (b - a))), 0));
  const again = () => { setRun(r => r + 1); setTime(0); setOk(null); setNo(null); setState('running'); setTab('steps'); setSelected(null); };

  useStory(ref, async ({ wait, press }) => {
    await wait(10000); press('.dm-rdr-ask [data-a="yes"]');
    await wait(2600); press('.dm-rdr-tabs button:nth-of-type(2)');
    await wait(1600); press('.dm-rdr-lvs button:nth-of-type(3)');
    await wait(1600); press('.dm-rdr-tabs button:nth-of-type(3)');
    await wait(1000); setSelected('research');
  }, { hold: false });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <RunDrawer runId={run} state={state} time={time} tokens={tokens} cost={tokens * .0000045} steps={STEPS} spans={spans} log={log}
        waiting={{ step: 'approve', title: 'Rep approves is waiting for you', detail: 'Live runs ask Maya Kim or Theo Reed in Slack. In a test, you decide.' }}
        onApprove={approve} onReject={() => { setNo(time); setState('failed'); }} onStop={() => setState('stopped')} onRunAgain={again}
        tab={tab} onTabChange={setTab} level={level} onLevelChange={setLevel} selected={selected} onSelectedChange={setSelected} />
    </div>
  );
}
