'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { useScript, useWait } from './useScript';
import { ToolConnections, type ToolConnectionsTool } from '../components/tool-connections/ToolConnections';

/* ---------- Agent harness: five tools with their permissions; Test all finds Slack's token expired, Reconnect fixes it ---------- */
const TOOLS: ToolConnectionsTool[] = [
  { key: 'figma', name: 'Figma', detail: 'Read and edit frames', brand: 'figma', permission: 'ask' },
  { key: 'github', name: 'GitHub', detail: 'designme/web, PRs only', brand: 'github', permission: 'off' },
  { key: 'slack', name: 'Slack', detail: '#design, #launch', brand: 'slack', permission: 'ask' },
  { key: 'analytics', name: 'Analytics', detail: 'Read only, last 90 days', icon: 'db', color: 'var(--dm-pt)', permission: 'ask' },
  { key: 'web', name: 'Web search', detail: 'Any public site', icon: 'globe', color: 'var(--dm-pb)', permission: 'allow' }
];
const MORE: ToolConnectionsTool[] = [
  { key: 'sheets', name: 'Google Sheets', icon: 'table', color: 'var(--dm-ok)' },
  { key: 'linear', name: 'Linear', icon: 'bell', color: 'var(--dm-pp)' },
  { key: 'gmail', name: 'Gmail', icon: 'mail', color: 'var(--dm-pr)' }
];

export default function ToolConnectionsDemo() {
  const [tools, setTools] = useState(TOOLS);
  const [status, setStatus] = useState<string>();
  const wait = useWait();
  const latest = useRef(tools);
  useEffect(() => { latest.current = tools; });
  const patch = (key: string, p: Partial<ToolConnectionsTool>) => setTools(ts => ts.map(t => t.key === key ? { ...t, ...p } : t));

  // checks every tool the agent may use, one after another; Slack's token has run out
  const test = async () => {
    const rows = latest.current.filter(t => t.permission !== 'off' && t.status !== 'error');
    for (const t of rows) {
      patch(t.key, { status: 'testing', note: 'Testing' });
      await wait(420);
      patch(t.key, t.key === 'slack' ? { status: 'error', note: 'Token expired. Reconnect' } : { status: 'ok', note: undefined });
    }
    const bad = rows.filter(t => t.key === 'slack').length;
    setStatus(`${rows.length - bad} of ${rows.length} healthy`);
  };
  const reconnect = async (key: string) => {
    patch(key, { status: 'reconnecting' });
    await wait(800);
    patch(key, { status: 'ok', note: undefined }); setStatus(undefined);
  };

  // the connections are tested once on its own; Reconnect is left for you
  const yours = useRef(false);
  useScript(async ({ wait }) => { await wait(1800); if (!yours.current) await test(); });

  return (
    <div style={{ width: '100%' }} onPointerDownCapture={e => { if (e.isTrusted) yours.current = true; }}>
      <ToolConnections tools={tools} onToolsChange={ts => { setTools(ts); setStatus(undefined); }} available={MORE} onTest={test} onReconnect={reconnect} status={status} />
    </div>
  );
}
