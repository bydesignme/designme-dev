'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { PermissionGate, type PermissionStatus } from '../components/permission-gate/PermissionGate';
import { Icon } from '../lib/icons';
import { useScript } from './useScript';

/* ---------- Permission gate: two scopes ticked; allow them and the agent reports back ---------- */
export default function PermissionGateDemo() {
  const [status, setStatus] = useState<PermissionStatus>('asking');
  const [detail, setDetail] = useState('Applying the pricing fixes now');
  useScript(async ({ wait }) => {
    if (status !== 'allowed') return;
    setDetail('Applying the pricing fixes now'); await wait(1400);
    setDetail('Done. 6 frames edited on a new page');
  }, [status]);
  return (
    <div style={{ width: '100%' }}>
      <PermissionGate icon={<Icon name="figma" />} title="Allow the agent to edit Figma?" subtitle="It needs this to apply the pricing fixes"
        scopes={[
          { key: 'read', label: 'Read frames', detail: 'Pricing, Checkout' },
          { key: 'edit', label: 'Edit frames', detail: 'Only on a new page' },
          { key: 'publish', label: 'Publish library', detail: 'Affects 4 other files', risk: 'Risky' }
        ]}
        defaultValue={['read', 'edit']} status={status} onStatusChange={setStatus}
        onAllow={() => new Promise<void>(res => setTimeout(res, 600))} allowedDetail={detail}
        declinedTitle="The agent will skip the Figma edits" declinedDetail="It will list the fixes in chat instead" />
    </div>
  );
}
