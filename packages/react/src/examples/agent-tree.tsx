'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AgentTree, type AgentNode } from '../components/agent-tree/AgentTree';
import { useScript, useStory } from './useScript';

/* ---------- Agent tree: the orchestrator splits the work between three agents, each agent between its steps. One step fails
   and the orchestrator reroutes it to a retry; the last step waits for a person to approve it ---------- */
type Row = Omit<AgentNode, 'children' | 'fix' | 'approval'> & { kids?: string[] };
const RUN: Record<string, Row> = {
  root: { id: 'root', name: 'Orchestrator', task: 'Splitting the work', status: 'running', icon: 'spark', kids: [] },
  res: { id: 'res', name: 'Research', task: '5 competitor pages', status: 'running', icon: 'globe', color: 'var(--dm-av-l)', kids: [] },
  res1: { id: 'res1', name: 'Read the pages', task: 'Reading 1 of 5', status: 'running', icon: 'file-text' },
  des: { id: 'des', name: 'Design', task: 'Plan cards in Figma', status: 'running', icon: 'palette', color: 'var(--dm-av-p)', kids: [] },
  des1: { id: 'des1', name: 'Update cards', task: 'Pricing v4', status: 'running', app: 'figma' },
  des2: { id: 'des2', name: 'Brand tokens', task: 'Colours and spacing', status: 'queued', app: 'figma' },
  des3: { id: 'des3', name: 'Retry tokens', task: 'Rerouted to accent.500', status: 'running', app: 'figma' },
  cop: { id: 'cop', name: 'Copy', task: 'Rewrite the plan blurbs', status: 'queued', icon: 'edit', color: 'var(--dm-av-m)', kids: [] },
  cop1: { id: 'cop1', name: 'Post to Slack', task: 'Needs your OK', status: 'waiting', app: 'slack', cost: .006, tokens: 140 }
};
// who joins under whom, in order
const UNDER: Record<string, string> = { res: 'root', des: 'root', cop: 'root', res1: 'res', des1: 'des', des2: 'des', des3: 'des', cop1: 'cop' };

export default function AgentTreeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<Record<string, Row>>({ root: RUN.root });
  const [fixable, setFixable] = useState(false);
  const fixed = useRef<() => void>(undefined), approved = useRef<() => void>(undefined), [canHold, setCanHold] = useState(true);
  const set = (id: string, patch: Partial<Row>) => setRows(r => ({ ...r, [id]: { ...r[id], ...patch } }));
  const join = (id: string, patch: Partial<Row> = {}) => setRows(r => { const p = UNDER[id]; return { ...r, [id]: { ...RUN[id], ...patch }, [p]: { ...r[p], kids: [...(r[p].kids ?? []), id] } }; });

  // what is running spends as it goes, so its cost and every total above it count up
  useEffect(() => {
    const id = setInterval(() => setRows(r => r.root.status === 'done' ? r : Object.fromEntries(Object.entries(r).map(([k, x]) => [k, x.status === 'running'
      ? { ...x, cost: (x.cost ?? 0) + (k === 'root' ? .0004 : .0014), tokens: (x.tokens ?? 0) + (k === 'root' ? 6 : 21) } : x]))), 100);
    return () => clearInterval(id);
  }, []);

  // the agents' work: it carries on after the visitor takes over, and then waits for them to approve the post
  useScript(async ({ wait }) => {
    await wait(300);
    for (const id of ['res', 'des', 'cop', 'res1', 'des1', 'des2']) { join(id); await wait(520); }
    set('root', { task: '3 agents at work' });
    await wait(300); set('res1', { task: 'Reading 3 of 5' });
    await wait(500); set('res1', { task: 'Reading 5 of 5' });
    await wait(450); set('res1', { status: 'done', task: '5 pages, 12k words' });
    await wait(350); set('res', { status: 'done', task: 'Notes in Pricing v4' });
    await wait(350); set('des1', { status: 'done', task: 'Pro and Team done' }); set('des2', { status: 'running', task: 'Matching colours' });
    await wait(1100); set('des2', { status: 'failed', task: 'Missing accent.600' }); setFixable(true);
    // the orchestrator reroutes it to a retry, unless a person takes the fix first
    await Promise.race([new Promise<void>(res => { fixed.current = res; }), wait(1300)]);
    setFixable(false); set('des2', { rerouted: true }); join('des3');
    await wait(1700); set('des3', { status: 'done', task: 'Used accent.500' });
    await wait(300); set('des', { status: 'done', task: 'Cards and tokens done' }); set('cop', { status: 'running', task: 'Writing 3 blurbs' });
    await wait(1200); set('cop', { task: '3 blurbs written' }); join('cop1');
    await new Promise<void>(res => { approved.current = res; });
    set('cop1', { status: 'done', task: 'Posted to #pricing' });
    await wait(350); set('cop', { status: 'done', task: '3 blurbs posted' });
    await wait(300); set('root', { status: 'done', task: 'Run finished' });
  });

  // the person in the demo approves the post a moment after it asks; this stops for good once the visitor takes over
  useStory(ref, async ({ wait, press }) => {
    for (let i = 0; i < 300 && !ref.current?.querySelector('.dm-atr-yes'); i++) await wait(100);
    await wait(1800); press('.dm-atr-yes');
  }, { hold: false });

  const node = (id: string): AgentNode => {
    const { kids, ...x } = rows[id];
    return { ...x, children: kids?.map(node),
      ...(id === 'des2' && fixable ? { fix: { label: 'Use accent.500', onClick: () => fixed.current?.() } } : {}),
      ...(id === 'cop1' ? { approval: { onApprove: () => approved.current?.(), onHold: canHold ? () => { set('cop1', { task: 'On hold' }); setCanHold(false); } : undefined } } : {}) };
  };
  // the room the tree keeps: the run at its tallest (every row in, and the approval under the last step), drawn once in a
  // hidden copy and measured, so the tree sits centred in its stage while it grows
  const full = (id: string): AgentNode => ({ ...RUN[id], children: Object.keys(UNDER).filter(k => UNDER[k] === id).map(full), ...(id === 'cop1' ? { approval: { onApprove: () => {}, onHold: () => {} } } : {}) });
  const ghost = useRef<HTMLDivElement>(null), [h, setH] = useState(0);
  useLayoutEffect(() => { const el = ghost.current?.firstElementChild; if (el) setH(Math.ceil(el.getBoundingClientRect().height)); }, []);

  return (
    <div ref={ref} style={{ width: '100%', position: 'relative' }}>
      {!h && <div ref={ghost} aria-hidden="true" inert style={{ position: 'absolute', inset: '0 0 auto', visibility: 'hidden', pointerEvents: 'none' }}><AgentTree root={full('root')} title="Redesign the pricing page" /></div>}
      <AgentTree root={node('root')} title="Redesign the pricing page" style={h ? { minHeight: h } : undefined} />
    </div>
  );
}
