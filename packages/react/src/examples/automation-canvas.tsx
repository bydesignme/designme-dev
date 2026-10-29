'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { AutomationCanvas, type AutomationCatalog, type AutomationEdge, type AutomationNode, type AutomationStepGroup } from '../components/automation-canvas/AutomationCanvas';
import { useStory, useWait } from './useScript';

const NODES: AutomationNode[] = [
  { id: 't', icon: 'clock', color: 'var(--dm-py)', title: 'Schedule', detail: 'Mondays 9:00', x: .14, y: .4, narrow: { x: .27, y: .07 }, field: { label: 'When', options: ['Mondays 9:00', 'Every weekday', 'On new Figma version'] } },
  { id: 'a', icon: 'figma', color: 'var(--dm-pl)', title: 'Read frames', detail: 'Pricing, Checkout', x: .4, y: .22, narrow: { x: .27, y: .2 }, field: { label: 'Frames', options: ['Pricing, Checkout', 'All frames', 'Changed this week'] } },
  { id: 'b', icon: 'spark', color: 'var(--dm-accent)', title: 'Agent: audit', detail: 'Contrast, tokens', x: .4, y: .58, narrow: { x: .73, y: .33 }, field: { label: 'Checks', options: ['Contrast, tokens', 'Everything', 'Accessibility only'] }, connectors: ['model', 'tools'] },
  { id: 'c', icon: 'send', color: 'var(--dm-pm)', title: 'Post summary', detail: '#design in Slack', x: .78, y: .4, narrow: { x: .27, y: .64 }, field: { label: 'Channel', options: ['#design in Slack', 'Email the team', 'Linear ticket'] } }
];
const EDGES: AutomationEdge[] = [['t', 'a'], ['t', 'b'], ['a', 'c'], ['b', 'c']];

// the steps the picker offers: a + after a step offers tools, logic and actions; the agent's connectors offer their own
const TOOLS: AutomationStepGroup = { id: 'tools', label: 'Tools', color: 'var(--dm-pt)', items: [
  { id: 'web', icon: 'globe', title: 'Search the web', description: 'Looks things up and keeps the top results', detail: 'Top results', field: { label: 'Sources', options: ['Top results', 'News only', 'Our docs site'] } },
  { id: 'doc', icon: 'file-text', title: 'Read a doc', description: 'Pulls the text out of a doc or a PDF', detail: 'Brand guidelines', field: { label: 'Doc', options: ['Brand guidelines', 'Release notes', 'Any shared doc'] } },
  { id: 'contrast', icon: 'eye', title: 'Check contrast', description: 'Measures each text colour against its fill', detail: 'WCAG AA', field: { label: 'Level', options: ['WCAG AA', 'WCAG AAA', 'APCA'] } }
] };
const CATALOG: AutomationCatalog = {
  step: [
    TOOLS,
    { id: 'logic', label: 'Logic', color: 'var(--dm-py)', items: [
      { id: 'if', icon: 'branch', title: 'If / else', description: 'Sends the run one way or the other', detail: 'Any check fails', field: { label: 'When', options: ['Any check fails', 'Over 5 issues', 'Always'] } },
      { id: 'wait', icon: 'clock', title: 'Wait', description: 'Pauses the run for a while', detail: '1 hour', field: { label: 'For', options: ['1 hour', 'Until 9:00', '1 day'] } },
      { id: 'ask', icon: 'user', title: 'Ask a person', description: 'Holds the run until someone approves', detail: 'Design lead', field: { label: 'Who', options: ['Design lead', 'Anyone on #design', 'The run owner'] } }
    ] },
    { id: 'actions', label: 'Actions', color: 'var(--dm-pm)', items: [
      { id: 'ticket', icon: 'flag', title: 'Create ticket', description: 'Files an issue with what the agent found', detail: 'Design QA board', field: { label: 'Tracker', options: ['Design QA board', 'Linear, Web team', 'GitHub issues'] } },
      { id: 'email', icon: 'mail', title: 'Send email', description: 'Emails a short summary to a list', detail: 'Design team', field: { label: 'To', options: ['Design team', 'Product leads', 'Just me'] } },
      { id: 'doc-out', icon: 'edit', title: 'Update doc', description: 'Writes the results into a shared doc', detail: 'QA log', field: { label: 'Doc', options: ['QA log', 'Weekly notes', 'Release checklist'] } }
    ] }
  ],
  model: [{ id: 'models', label: 'Models', color: 'var(--dm-pl)', items: [
    { id: 'fast', icon: 'bolt', title: 'Fast model', description: 'Quick and cheap, for simple checks', detail: 'Fast', field: { label: 'Model', options: ['Fast', 'Fast, low cost'] } },
    { id: 'reason', icon: 'brain', title: 'Reasoning model', description: 'Slower, thinks harder audits through', detail: 'Reasoning', field: { label: 'Model', options: ['Reasoning', 'Reasoning, long context'] } },
    { id: 'vision', icon: 'image', title: 'Vision model', description: 'Reads screenshots and frames', detail: 'Vision', field: { label: 'Model', options: ['Vision', 'Vision, high detail'] } }
  ] }],
  tools: [TOOLS]
};

/* ---------- Automation canvas: add steps, drag them, change their settings, and test run the flow ---------- */
export default function AutomationCanvasDemo() {
  const [nodes, setNodes] = useState(NODES);
  const [edges, setEdges] = useState(EDGES);
  const [states, setStates] = useState<Record<string, AutomationNode['state']>>({});
  const [flowing, setFlowing] = useState<AutomationEdge[]>([]);
  const [status, setStatus] = useState('Every Monday, 9:00');
  // picking a new schedule rewrites the line in the corner
  const [trigger, setTrigger] = useState('Mondays 9:00');
  const seq = useRef(0), runId = useRef(0), now = useRef({ nodes, edges });
  now.current = { nodes, edges };
  const wait = useWait();

  // Test run lights each step in turn; a soft light passes along each wire the run reaches, and the wire stays lit. The
  // agent's model and tools light with it, and the steps added after the last one run in turn
  const run = async () => {
    const id = ++runId.current, w = async (ms: number) => { await wait(ms); if (id !== runId.current) throw 'stop'; };
    const mark = (k: string, s: AutomationNode['state']) => setStates(x => ({ ...x, [k]: s }));
    const { edges: E } = now.current, subs = E.filter(e => e[0] === 'b' && e[2]);
    try {
      setStates({}); setFlowing([]); setStatus('Running test');
      await w(220); mark('t', 'run'); await w(600); mark('t', 'done');
      setFlowing([['t', 'a'], ['t', 'b']]); await w(620);
      mark('a', 'run'); mark('b', 'run'); subs.forEach(e => mark(e[1], 'run')); setFlowing(f => [...f, ...subs]); await w(1100);
      mark('a', 'done'); subs.forEach(e => mark(e[1], 'done')); await w(400); mark('b', 'done');
      setFlowing(f => [...f, ['a', 'c'], ['b', 'c']]); await w(620);
      mark('c', 'run'); await w(700); mark('c', 'done');
      let at = 'c', s = 3.4, nx: AutomationEdge | undefined;
      while ((nx = E.find(e => e[0] === at && !e[2]))) { const e = nx; setFlowing(f => [...f, e]); await w(620); mark(e[1], 'run'); await w(700); mark(e[1], 'done'); at = e[1]; s += 1.3; }
      setStatus(`Test passed in ${s.toFixed(1)}s`);
    } catch (e) { if (e !== 'stop') throw e; }
  };

  // the preview's story: one test run, then the person adds a step after the last one from its +
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait: sw, press }) => {
    await sw(1600); press('.dm-acx-run');
    await sw(6200); press('.dm-acx-h');
    await sw(1500); press('.dm-acx-o[data-id="ticket"]');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <AutomationCanvas name="Weekly design QA" tag="On" status={status}
        nodes={nodes.map(n => ({ ...n, state: states[n.id] }))} edges={edges} flowing={flowing} catalog={CATALOG}
        onAddNode={(type, from, via, group) => {
          const id = 'n' + ++seq.current;
          setNodes(ns => [...ns, { id, icon: type.icon, color: group.color, title: type.title, detail: type.detail, field: type.field, attach: { to: from, via } }]);
          setEdges(es => [...es, via === 'out' ? [from, id] : [from, id, via]]);
        }}
        onValuesChange={v => { if (v.t !== trigger) { setTrigger(v.t); setStatus(v.t.replace('Mondays', 'Every Monday,')); } }}
        onRun={run} />
    </div>
  );
}
