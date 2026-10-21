'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { AutomationCanvas, type AutomationEdge, type AutomationNode } from '../components/automation-canvas/AutomationCanvas';
import { useScript } from './useScript';

const NODES: AutomationNode[] = [
  { id: 't', icon: 'clock', color: 'var(--dm-py)', title: 'Schedule', detail: 'Mondays 9:00', x: .14, y: .5, narrow: { x: .5, y: .13 }, field: { label: 'When', options: ['Mondays 9:00', 'Every weekday', 'On new Figma version'] } },
  { id: 'a', icon: 'figma', color: 'var(--dm-pl)', title: 'Read frames', detail: 'Pricing, Checkout', x: .4, y: .28, narrow: { x: .28, y: .42 }, field: { label: 'Frames', options: ['Pricing, Checkout', 'All frames', 'Changed this week'] } },
  { id: 'b', icon: 'spark', color: 'var(--dm-accent)', title: 'Agent: audit', detail: 'Contrast, tokens', x: .4, y: .72, narrow: { x: .72, y: .62 }, field: { label: 'Checks', options: ['Contrast, tokens', 'Everything', 'Accessibility only'] } },
  { id: 'c', icon: 'send', color: 'var(--dm-pm)', title: 'Post summary', detail: '#design in Slack', x: .78, y: .5, narrow: { x: .5, y: .88 }, field: { label: 'Channel', options: ['#design in Slack', 'Email the team', 'Linear ticket'] } }
];
const EDGES: AutomationEdge[] = [['t', 'a'], ['t', 'b'], ['a', 'c'], ['b', 'c']];

/* ---------- Automation canvas: drag the steps, change their settings, and test run the flow ---------- */
export default function AutomationCanvasDemo() {
  const [run, setRun] = useState(0);
  const [states, setStates] = useState<Record<string, AutomationNode['state']>>({});
  const [flowing, setFlowing] = useState<AutomationEdge[]>([]);
  const [status, setStatus] = useState('Every Monday, 9:00');
  // picking a new schedule rewrites the line in the corner
  const [trigger, setTrigger] = useState('Mondays 9:00');
  // one test run plays on its own, unless you start moving or changing steps first
  const yours = useRef(false);
  useScript(async ({ wait }) => { await wait(1600); if (!yours.current) setRun(r => r || 1); });

  // Test run lights each step in turn and sends a pulse along the wires between them
  useScript(async ({ wait }) => {
    if (!run) return;
    const mark = (id: string, s: AutomationNode['state']) => setStates(x => ({ ...x, [id]: s }));
    setStates({}); setFlowing([]); setStatus('Running test');
    mark('t', 'run'); await wait(600); mark('t', 'done');
    setFlowing([['t', 'a'], ['t', 'b']]); await wait(500); setFlowing([]);
    mark('a', 'run'); mark('b', 'run'); await wait(1100); mark('a', 'done'); await wait(400); mark('b', 'done');
    setFlowing([['a', 'c'], ['b', 'c']]); await wait(500); setFlowing([]);
    mark('c', 'run'); await wait(700); mark('c', 'done'); setStatus('Test passed in 3.4s');
  }, [run]);

  return (
    <div style={{ width: '100%' }} onPointerDownCapture={e => { if (e.isTrusted) yours.current = true; }}>
      <AutomationCanvas name="Weekly design QA" tag="On" status={status}
        nodes={NODES.map(n => ({ ...n, state: states[n.id] }))} edges={EDGES} flowing={flowing}
        onValuesChange={v => { if (v.t !== trigger) { setTrigger(v.t); setStatus(v.t.replace('Mondays', 'Every Monday,')); } }}
        onRun={() => setRun(r => r + 1)} />
    </div>
  );
}
