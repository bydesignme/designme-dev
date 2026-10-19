'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { AgentSettings, type AgentSettingsValue } from '../components/agent-settings/AgentSettings';
import { useScript } from './useScript';

/* ---------- Agent settings: Slack summaries get switched on, and the save bar comes up ---------- */
export default function AgentSettingsDemo() {
  const [value, setValue] = useState<AgentSettingsValue>({
    autonomy: 1, toggles: { memory: true, slack: false }, cap: 5, instructions: 'Use our tokens only. Keep copy short and friendly.'
  });
  useScript(async ({ wait }) => {
    await wait(1400);
    setValue(v => ({ ...v, toggles: { ...v.toggles, slack: !v.toggles.slack } }));
  });
  return (
    <div style={{ width: '100%' }}>
      <AgentSettings value={value} onValueChange={setValue}
        toggles={[{ key: 'memory', label: 'Use team memory', detail: 'Brand rules and past decisions' }, { key: 'slack', label: 'Post a summary in Slack', detail: '#design, after each run' }]}
        onSave={() => new Promise<void>(res => setTimeout(res, 600))} />
    </div>
  );
}
