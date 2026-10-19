'use client';
// The preview from designme.dev, rebuilt from the React component: the rows come in, then the agent opens the account it is worried about.
import { useState } from 'react';
import { AccountTable, type AccountTableAccount } from '../components/account-table/AccountTable';
import { useScript } from './useScript';

const ACCOUNTS: AccountTableAccount[] = [
  { name: 'Northwind', color: '#2f6fde', plan: 'Enterprise', seats: 120, health: 92, mrr: '$14,400', note: 'Expanding. Design team added 18 seats this month.' },
  { name: 'Lumen Labs', color: '#7a4ce0', plan: 'Pro', seats: 14, health: 48, mrr: '$672', note: 'Usage fell 40% after their lead designer left. Worth a check in.' },
  { name: 'Fable & Co', color: '#0f9a6e', plan: 'Team', seats: 32, health: 81, mrr: '$1,920', note: 'Steady. Asked about the Figma sync twice.' },
  { name: 'Orbit', color: '#e2681c', plan: 'Pro', seats: 8, health: 67, mrr: '$384', note: 'Trial of the agent ends Friday. 3 runs so far.' },
  { name: 'Kite Health', color: '#d03a5f', plan: 'Enterprise', seats: 64, health: 88, mrr: '$7,680', note: 'Renewal in 6 weeks, champion is happy.' },
  { name: 'Paper Plane', color: '#3c8d9e', plan: 'Team', seats: 21, health: 34, mrr: '$1,260', note: 'Two failed payments. Billing contact bounced.' }
];

/* ---------- Account table: search, plan filters, and a row that opens on what the agent noticed ---------- */
export default function AccountTableDemo() {
  const [open, setOpen] = useState<string | null>(null);
  useScript(async ({ wait }) => { await wait(1200); setOpen(o => o ?? 'Lumen Labs'); });
  return (
    <div style={{ width: '100%' }}>
      <AccountTable accounts={ACCOUNTS} plans={['Team', 'Pro', 'Enterprise']} open={open} onOpenChange={setOpen}
        action={{ label: 'Draft email', doneLabel: 'Draft ready', onClick: () => new Promise(r => setTimeout(r, 800)) }} />
    </div>
  );
}
