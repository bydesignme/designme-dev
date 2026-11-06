'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { AgentTree, type AgentNode, type AgentNodeStatus } from '../components/agent-tree/AgentTree';
import { useScript, useStory } from './useScript';

/* ---------- Agent tree: the design agent works through its steps, one fails on a missing token, and the fix it offers waits for you;
   the finished research starts folded ---------- */
type Row = { name: string; task: string; status: AgentNodeStatus; cost: number; kids?: string[] };
// the run: an orchestrator, its three agents and their steps. cost is what each spends on its own, in dollars
const START: Record<string, Row> = {
  root: { name: 'Orchestrator', task: 'Plans the work and hands it out', status: 'running', cost: .04, kids: ['res', 'des', 'cop'] },
  res: { name: 'Research agent', task: 'Compare 3 competitor pricing pages', status: 'done', cost: .02, kids: ['res1', 'res2'] },
  res1: { name: 'Read the 3 pricing pages', task: '3 pages, 9.4k words', status: 'done', cost: .06 },
  res2: { name: 'Summarise their plans', task: 'Notes added to Pricing v4', status: 'done', cost: .04 },
  des: { name: 'Design agent', task: 'Rework the plan cards in Figma', status: 'running', cost: .02, kids: ['des1', 'des2', 'des3'] },
  des1: { name: 'Update the Pro card', task: 'Pricing v4, frame 2', status: 'running', cost: .03 },
  des2: { name: 'Update the Team card', task: 'Pricing v4, frame 3', status: 'queued', cost: 0 },
  des3: { name: 'Apply library tokens', task: 'Colour and spacing', status: 'queued', cost: 0 },
  cop: { name: 'Copy agent', task: 'Rewrite the plan descriptions', status: 'queued', cost: 0 }
};

export default function AgentTreeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(START);
  const [fixing, setFixing] = useState(false);
  const fixed = useRef<() => void>(undefined);
  const set = (id: string, patch: Partial<Row>) => setRows(r => ({ ...r, [id]: { ...r[id], ...patch } }));

  // whatever is running spends as it goes, so its cost and every total above it count up
  useEffect(() => {
    const id = setInterval(() => setRows(r => Object.fromEntries(Object.entries(r).map(([k, x]) => [k, x.status === 'running' ? { ...x, cost: x.cost + (k === 'root' ? .0006 : .0016) } : x]))), 100);
    return () => clearInterval(id);
  }, []);

  useScript(async ({ wait }) => {
    await wait(2000); set('des1', { status: 'done' }); set('des2', { status: 'running' });
    await wait(2500); set('des2', { status: 'done' }); set('des3', { status: 'running' });
    await wait(2000); set('des3', { status: 'failed', task: "color.accent.600 isn't in the library" }); setFixing(true);
    await new Promise<void>(res => { fixed.current = res; });
    setFixing(false); set('des3', { status: 'running', task: 'Using color.accent.500' });
    await wait(2000); set('des3', { status: 'done', task: 'Colour and spacing, from the library' }); set('des', { status: 'done' }); set('cop', { status: 'running' });
    await wait(3000); set('cop', { status: 'done' }); set('root', { status: 'done' });
  });

  // the preview's story: take the fix when a step fails, then fold the design branch once it's done
  useStory(ref, async ({ wait, press }) => {
    await wait(8500); press('.dm-atr-fix');
    await wait(6000); press('[data-id="des"]');
  }, { hold: false });

  const node = (id: string): AgentNode => {
    const x = rows[id];
    return { id, name: x.name, task: x.task, status: x.status, cost: x.cost, children: x.kids?.map(node),
      ...(id === 'des3' && fixing ? { fix: { label: 'Use color.accent.500', onClick: () => fixed.current?.() } } : {}) };
  };

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <AgentTree root={node('root')} title="Redesign the pricing page" defaultCollapsed={['res']} />
    </div>
  );
}
