# Account table

> Customer accounts with health, plan and an agent note per row.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/account-table

## Install

```sh
npx designme add account-table          # HTML, CSS and JS, with the shared core
npx designme add account-table --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

A table of customer accounts with plan, seats, a health bar and monthly revenue, which people can search and filter by plan. Clicking a row opens a note on what the agent noticed about that account, with an optional button for the next step, such as drafting an email. It suits a customer success or sales view where an agent watches accounts for risk.

### When to use it

- When an agent monitors customer accounts and flags the ones that need attention.
- When account managers need to search and filter accounts by plan.
- When each account's agent finding should lead to one action, like drafting a check-in email.

### What it does

- Columns for account (with a coloured letter logo), plan tag, seats, health and MRR.
- Health is a bar coloured green from 80, amber from 60 and red below.
- A search box matches account names, and plan chips filter by plan; the chips default to the plans found in `accounts`.
- Clicking a row opens or closes the agent's `note` under it; one row is open at a time.
- An optional `action` button in the open note; if its `onClick` returns a promise the button spins, then shows `doneLabel`.
- Plan tags are coloured through `planTones`, and `emptyLabel` shows when nothing matches.

### Accessibility

- Each account row is focusable with tabIndex 0, exposes aria-expanded, and opens or closes with Enter or Space.
- The plan filter is a role="group" labelled "Plan", and each chip uses aria-pressed.
- The search input is labelled with its placeholder text, "Search accounts" by default.

## Usage in React

```tsx
import { AccountTable } from '@/components/designme/account-table/AccountTable';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: the rows come in, then the agent opens the account it is worried about.
import { useRef, useState } from 'react';
import { AccountTable, type AccountTableAccount } from './AccountTable';
import { useStory } from '../lib/useScript';

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
  // the preview opens one account's note on its own, unless you take over first
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait }) => { await wait(1200); setOpen(o => o ?? 'Lumen Labs'); });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <AccountTable accounts={ACCOUNTS} plans={['Team', 'Pro', 'Enterprise']} open={open} onOpenChange={setOpen}
        action={{ label: 'Draft email', doneLabel: 'Draft ready', onClick: () => new Promise(r => setTimeout(r, 800)) }} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `accounts` | `AccountTableAccount[]` |  |
| `plans` (optional) | `string[]` | The plan filters after All. Defaults to the plans in `accounts`, in the order they first appear |
| `planTones` (optional) | `Record<string, AccountTableTone>` | The tag colour for each plan. Defaults to Enterprise orange, Pro blue, Team teal |
| `plan` (optional) | `string` | The plan filter, or '' for All |
| `defaultPlan` (optional) | `string` |  |
| `onPlanChange` (optional) | `(plan: string) => void` |  |
| `query` (optional) | `string` | The search text. Matches account names |
| `defaultQuery` (optional) | `string` |  |
| `onQueryChange` (optional) | `(query: string) => void` |  |
| `open` (optional) | `string \| null` | The account whose row is open, or null |
| `defaultOpen` (optional) | `string \| null` |  |
| `onOpenChange` (optional) | `(name: string \| null) => void` |  |
| `action` (optional) | `{ label: string; doneLabel?: string; onClick: (account: AccountTableAccount) => void \| Promise<unknown> }` | A button in the open row's note, like Draft email. Return a promise and it spins until it settles, then shows `doneLabel` |
| `placeholder` (optional) | `string` |  |
| `emptyLabel` (optional) | `string` | Shown when nothing matches the search and filter |
| `className` (optional) | `string` |  |

## Questions

**How do I add a "Draft email" button to the agent's note?**

Pass `action` with a `label`, an optional `doneLabel` and an `onClick` that receives the account. Return a promise and the button spins until it resolves, then shows the done label. If it rejects, the button goes back to its label.

**Can the agent open a row by itself?**

Yes. Control `open` with the account's name and update it from your own state, for example when the agent flags an account. Set it to null to close all rows.

**Does the table sort or format MRR for me?**

No. Rows appear in the order of `accounts`, and `mrr` is shown as the string you pass, so format it first, like "$14,400".

**Can I put links or formatting in the note?**

Yes. `note` takes any React node, so it can hold links, bold text or other elements.

## Source

`AccountTable.tsx`, as `npx designme add account-table --react` installs it:

```tsx
'use client';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Spin } from '../lib/motion';
import '../designme.css';
import './account-table.css';

/** The tag colours a plan can take */
export type AccountTableTone = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

export interface AccountTableAccount {
  /** Also the account's key, and its first letter makes the logo */
  name: string;
  /** The logo's colour, like '#2f6fde' */
  color: string;
  plan: string;
  seats: number;
  /** 0 to 100. Green from 80, amber from 60, red below */
  health: number;
  /** Already formatted, like "$14,400" */
  mrr: string;
  /** What the agent noticed, shown when the row opens */
  note?: ReactNode;
}

export interface AccountTableProps {
  accounts: AccountTableAccount[];
  /** The plan filters after All. Defaults to the plans in `accounts`, in the order they first appear */
  plans?: string[];
  /** The tag colour for each plan. Defaults to Enterprise orange, Pro blue, Team teal */
  planTones?: Record<string, AccountTableTone>;
  /** The plan filter, or '' for All */
  plan?: string;
  defaultPlan?: string;
  onPlanChange?: (plan: string) => void;
  /** The search text. Matches account names */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** The account whose row is open, or null */
  open?: string | null;
  defaultOpen?: string | null;
  onOpenChange?: (name: string | null) => void;
  /** A button in the open row's note, like Draft email. Return a promise and it spins until it settles, then shows `doneLabel` */
  action?: { label: string; doneLabel?: string; onClick: (account: AccountTableAccount) => void | Promise<unknown> };
  placeholder?: string;
  /** Shown when nothing matches the search and filter */
  emptyLabel?: string;
  className?: string;
}

const TONE: Record<AccountTableTone, string> = { blue: 'dm-b', purple: 'dm-l', green: 'dm-m', orange: 'dm-p', red: 'dm-r', yellow: 'dm-y', pink: 'dm-k', teal: 'dm-t' };
const TONES: Record<string, AccountTableTone> = { Enterprise: 'orange', Pro: 'blue', Team: 'teal' };
const healthColor = (h: number) => h >= 80 ? 'var(--dm-ok)' : h >= 60 ? 'var(--dm-warn)' : 'var(--dm-bad)';

/** Accounts you can search and filter by plan; a row opens to show what the agent noticed. */
export function AccountTable({
  accounts, plans, planTones = TONES, plan, defaultPlan = '', onPlanChange, query, defaultQuery = '', onQueryChange,
  open, defaultOpen = null, onOpenChange, action, placeholder = 'Search accounts', emptyLabel = 'No accounts match', className
}: AccountTableProps) {
  const [filter, setFilter] = useControllable(plan, defaultPlan, onPlanChange);
  const [text, setText] = useControllable(query, defaultQuery, onQueryChange);
  const [opened, setOpened] = useControllable(open, defaultOpen, onOpenChange);
  const tabs = plans ?? [...new Set(accounts.map(a => a.plan))];
  const s = text.trim().toLowerCase();
  const rows = accounts.filter(a => (!filter || a.plan === filter) && (!s || a.name.toLowerCase().includes(s)));

  // the rows stagger in again whenever the search or the filter changes
  const look = `${filter}\u0000${s}`;
  const [seen, setSeen] = useState(look);
  const [pass, setPass] = useState(0);
  if (seen !== look) { setSeen(look); setPass(p => p + 1); }

  // the action button resets whenever another row opens
  const [draft, setDraft] = useState<'idle' | 'busy' | 'done'>('idle');
  const [draftFor, setDraftFor] = useState(opened);
  if (draftFor !== opened) { setDraftFor(opened); setDraft('idle'); }
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const run = (a: AccountTableAccount) => {
    if (!action || draft === 'busy') return;
    const r = action.onClick(a);
    if (r && typeof (r as Promise<unknown>).then === 'function') {
      setDraft('busy');
      (r as Promise<unknown>).then(() => { if (alive.current) setDraft('done'); }, () => { if (alive.current) setDraft('idle'); });
    } else setDraft('done');
  };

  const toggle = (name: string) => setOpened(opened === name ? null : name);

  return (
    <div data-dm="" className={cx('dm-atb dm-panel', className)}>
      <div className="dm-atb-h">
        <label className="dm-atb-s"><Icon name="search" size="xs" /><input placeholder={placeholder} aria-label={placeholder} value={text} onChange={e => setText(e.target.value)} /></label>
        <div className="dm-atb-fl" role="group" aria-label="Plan">
          {['', ...tabs].map(p => (
            <button type="button" key={p || 'all'} className={cx('dm-chip dm-sm', filter === p && 'dm-on')} aria-pressed={filter === p} onClick={() => setFilter(p)}>{p || 'All'}</button>
          ))}
        </div>
      </div>
      <div className="dm-atb-sc">
        <table>
          <thead><tr><th>Account</th><th>Plan</th><th>Seats</th><th>Health</th><th className="dm-r">MRR</th></tr></thead>
          <tbody key={pass}>
            {rows.length ? rows.map((a, i) => {
              const isOpen = opened === a.name, tone = planTones[a.plan];
              return (
                <Fragment key={a.name}>
                  <tr className={cx('dm-row', isOpen && 'dm-open', enter(i * 35).className)} style={enter(i * 35).style} tabIndex={0} aria-expanded={isOpen}
                    onClick={() => toggle(a.name)} onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); toggle(a.name); } }}>
                    <td><span className="dm-nm"><span className="dm-lg" style={{ backgroundColor: a.color }}>{a.name[0]}</span>{a.name}</span></td>
                    <td><span className={cx('dm-tag', tone && TONE[tone])}>{a.plan}</span></td>
                    <td className="dm-num">{a.seats}</td>
                    <td><span className="dm-hb"><i><b style={{ width: a.health + '%', background: healthColor(a.health) }} /></i><span className="dm-num">{a.health}</span></span></td>
                    <td className="dm-r dm-num">{a.mrr}</td>
                  </tr>
                  {isOpen && (
                    <tr className="dm-det">
                      <td colSpan={5}>
                        <div className="dm-fold"><div>
                          <div className="dm-atb-note dm-enter">
                            <Icon name="spark" size="xs" />
                            <span>{a.note}</span>
                            {action && (
                              <button type="button" className="dm-pill dm-soft dm-sm" onClick={e => { e.stopPropagation(); run(a); }}>
                                {draft === 'busy' ? <Spin /> : draft === 'done' ? <><Icon name="check" size="xs" />{action.doneLabel ?? 'Done'}</> : action.label}
                              </button>
                            )}
                          </div>
                        </div></div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            }) : <tr className="dm-atb-empty"><td colSpan={5}>{emptyLabel}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

## More in Charts and tables

- [Line chart](https://designme.dev/components/line-chart.md): Two series over time with a hover readout and toggles.
- [Bar chart](https://designme.dev/components/bar-chart.md): Weekly agent runs, split by outcome, with a range switch.
- [Donut chart](https://designme.dev/components/donut-chart.md): Where the agent's time went, by kind of task.
- [Funnel chart](https://designme.dev/components/funnel-chart.md): Signup to paid, with the biggest drop called out by the agent.
- [Top pages](https://designme.dev/components/top-pages.md): Most visited pages with share of traffic and a quick sort.
- [Health score](https://designme.dev/components/health-score.md): A design system score made of a few checks you can open.
- [Activity heatmap](https://designme.dev/components/activity-heatmap.md): When the agent and the team were busy, by day and hour.
- [Stat cards](https://designme.dev/components/stat-cards.md): Four headline numbers with sparklines and a period switch.

All components: https://designme.dev/llms.txt
