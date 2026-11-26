'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { useStory, useWait } from './useScript';
import { ToolConnections, type ToolConnectionsTool } from '../components/tool-connections/ToolConnections';

/* ---------- Tools and connections: five tools with their permissions; Test all finds Slack's token expired, Reconnect fixes it ---------- */
const TOOLS: ToolConnectionsTool[] = [
  { key: 'figma', name: 'Figma', detail: 'Read and edit frames', brand: 'figma', permission: 'ask' },
  { key: 'github', name: 'GitHub', detail: 'designme/web, PRs only', brand: 'github', permission: 'off' },
  { key: 'slack', name: 'Slack', detail: '#design, #launch', brand: 'slack', permission: 'ask' },
  { key: 'analytics', name: 'Analytics', detail: 'Read only, last 90 days', icon: 'db', color: 'var(--dm-av-t)', permission: 'ask' },
  { key: 'web', name: 'Web search', detail: 'Any public site', icon: 'globe', color: 'var(--dm-av-b)', permission: 'allow' }
];
const MORE: ToolConnectionsTool[] = [
  { key: 'sheets', name: 'Google Sheets', icon: 'table', color: 'var(--dm-av-m)' },
  { key: 'linear', name: 'Linear', brand: 'linear' },
  { key: 'gmail', name: 'Gmail', brand: 'gmail' }
];

export default function ToolConnectionsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [tools, setTools] = useState(TOOLS);
  const [status, setStatus] = useState<string>();
  const [healthy, setHealthy] = useState(false);
  const [testing, setTesting] = useState(false);
  const wait = useWait();
  const latest = useRef(tools);
  useEffect(() => { latest.current = tools; });
  const patch = (key: string, p: Partial<ToolConnectionsTool>) => setTools(ts => ts.map(t => t.key === key ? { ...t, ...p } : t));

  // every tool the agent may use shows a small spinner at once, and they settle one by one; Slack's token has run out
  const fixed = useRef(new Set<string>());
  const test = async () => {
    const rows = latest.current.filter(t => t.permission !== 'off' && t.status !== 'error');
    setTesting(true); setHealthy(false); setStatus(`Testing ${rows.length} connections`);
    rows.forEach(t => patch(t.key, { status: 'testing' }));
    for (const t of rows) {
      await wait(600);
      patch(t.key, t.key === 'slack' && !fixed.current.has(t.key) ? { status: 'error', note: 'Token expired. Reconnect to use it' } : { status: 'ok' });
    }
    const bad = rows.some(t => t.key === 'slack' && !fixed.current.has(t.key)) ? 1 : 0;
    setTesting(false); setHealthy(!bad); setStatus(`${rows.length - bad} of ${rows.length} healthy`);
  };
  const reconnect = async (key: string) => {
    patch(key, { status: 'reconnecting' });
    await wait(900);
    const on = latest.current.filter(t => t.permission !== 'off').length;
    fixed.current.add(key); patch(key, { status: 'ok', note: undefined }); setHealthy(true); setStatus(`${on} of ${on} healthy`);
  };

  // the preview's story: test everything, find Slack's token expired, and reconnect it. A test at work keeps going under the
  // pointer, as designme.dev's does
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-hnx-test');
    await wait(4 * 600 + 1500); press('.dm-hnx-t.dm-err .dm-pill');
  }, { hold: false });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ToolConnections tools={tools} onToolsChange={ts => { setTools(ts); setStatus(undefined); setHealthy(false); }} available={MORE} onTest={test} testing={testing} onReconnect={reconnect} status={status} healthy={healthy} />
    </div>
  );
}
