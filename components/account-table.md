# Account table

> Customer accounts with health, plan and an agent note per row.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/account-table

## Install

```sh
npx designme add account-table          # HTML, CSS and JS, with the shared core
npx designme add account-table --react  # React 19 component and its CSS
npx designme add account-table --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/account-table.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/account-table.json  # Astro
```

## About

A table of customer accounts with plan, seats, a health bar and monthly revenue, which people can search and filter by plan. Clicking a row opens a note on what the agent noticed about that account, with an optional button for the next step, such as drafting an email. It suits a customer success or sales view where an agent watches accounts for risk.

### When to use it

- When an agent monitors customer accounts and flags the ones that need attention.
- When account managers need to search and filter accounts by plan.
- When each account's agent finding should lead to one action, like drafting a check-in email.

### What it does

- Columns for account (with a coloured letter logo), plan tag, seats, health and MRR. Seats and MRR are right-aligned with their heads, and every other column's content starts where its head's words start.
- It reads as a table of columns: a hairline runs between every two columns, in every style, and the note under an open row spans them all. Drag a header's right edge to resize its column (double-click the edge for every column's natural width back); a column never goes under its minimum, and the table scrolls sideways once the columns outgrow it. Drag a header sideways to move its column (Account stays first). The order and widths last as long as the table is on screen.
- Health is a bar coloured green from 80, amber from 60 and red below.
- Give a logo one of the avatar colours, like `var(--dm-av-b)`, and its letter takes that colour's own ink, white or dark, so it keeps its contrast.
- A search box matches account names, and plan chips filter by plan; the chips default to the plans found in `accounts`.
- Clicking a row opens or closes the agent's `note` under it, as a detail row: it spans every column (the column lines stop at it and start again under it), in an inset panel of the style's quiet fill (in Clean its off-white with 10px corners), with its spark under the logos and its words on the names' column. It opens and shuts by its height, the open account keeps a quiet fill, and one row is open at a time. In Clean the search and the plan filters sit in the card's off-white head strip.
- An optional `action` button at the open note's right edge; if its `onClick` returns a promise the button shows a spinner and `busyLabel` in the loader's sweep, then the green tick and `doneLabel`, easing to each new width.
- Plan tags are coloured through `planTones`. When nothing matches, an empty state shows a small sketch of a table, `emptyLabel`, `emptyHint` and a `clearLabel` button that clears the search and the plan filter.
- A row's hover fill reaches a little past its words on both sides, with rounded corners, and the hairlines round it give way while it shows.

### Accessibility

- Each account row is focusable with tabIndex 0 (in the HTML version too), exposes aria-expanded, and opens or closes with Enter or Space.
- The plan filter is a role="group" labelled "Plan", and each chip uses aria-pressed.
- The search input is labelled with its placeholder text, "Search accounts" by default.
- Every header but Account takes the focus, and Alt with the left or right arrow moves its column one place. Each resize handle is a focusable `separator` labelled like "Resize Plan": the left and right arrows narrow or widen its column by 16px.

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
  { name: 'Northwind', color: 'var(--dm-av-b)', plan: 'Enterprise', seats: 120, health: 92, mrr: '$14,400', note: 'Expanding. Design team added 18 seats this month.' },
  { name: 'Lumen Labs', color: 'var(--dm-av-l)', plan: 'Pro', seats: 14, health: 48, mrr: '$672', note: 'Usage fell 40% after their lead designer left. Worth a check in.' },
  { name: 'Fable & Co', color: 'var(--dm-av-m)', plan: 'Team', seats: 32, health: 81, mrr: '$1,920', note: 'Steady. Asked about the Figma sync twice.' },
  { name: 'Orbit', color: 'var(--dm-av-p)', plan: 'Pro', seats: 8, health: 67, mrr: '$384', note: 'Trial of the agent ends Friday. 3 runs so far.' },
  { name: 'Kite Health', color: 'var(--dm-av-r)', plan: 'Enterprise', seats: 64, health: 88, mrr: '$7,680', note: 'Renewal in 6 weeks, champion is happy.' },
  { name: 'Paper Plane', color: 'var(--dm-av-t)', plan: 'Team', seats: 21, health: 34, mrr: '$1,260', note: 'Two failed payments. Billing contact bounced.' }
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
        action={{ label: 'Draft email', busyLabel: 'Drafting', doneLabel: 'Draft ready', onClick: () => new Promise(r => setTimeout(r, 800)) }} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `accounts` | `AccountTableAccount[]` |  |
| `plans` (optional) | `string[]` | The plan filters after All. Defaults to the plans in `accounts`, in the order they first appear |
| `planTones` (optional) | `Record<string, AccountTableTone>` | The tag colour for each plan. Defaults to Enterprise purple, Pro blue, Team teal |
| `plan` (optional) | `string` | The plan filter, or '' for All |
| `defaultPlan` (optional) | `string` |  |
| `onPlanChange` (optional) | `(plan: string) => void` |  |
| `query` (optional) | `string` | The search text. Matches account names |
| `defaultQuery` (optional) | `string` |  |
| `onQueryChange` (optional) | `(query: string) => void` |  |
| `open` (optional) | `string \| null` | The account whose row is open, or null |
| `defaultOpen` (optional) | `string \| null` |  |
| `onOpenChange` (optional) | `(name: string \| null) => void` |  |
| `action` (optional) | `{ label: string; busyLabel?: string; doneLabel?: string; onClick: (account: AccountTableAccount) => void \| Promise<unknown> }` | A button in the open row's note, like Draft email. Return a promise and it says `busyLabel` with a spinner until it settles, then `doneLabel` with a green tick. The button is as wide as its words and eases to each new width |
| `placeholder` (optional) | `string` |  |
| `emptyLabel` (optional) | `string` | The title of the empty state, when nothing matches the search and filter |
| `emptyHint` (optional) | `string` | The muted line under it |
| `clearLabel` (optional) | `string` | Its button, which clears the search and the plan filter |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import AccountTable from '../components/designme/account-table/AccountTable.astro';
---
<AccountTable />
<AccountTable data-style="soft" class="my-class" />
```
It plays its demo; change `account-table.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I add a "Draft email" button to the agent's note?**

Pass `action` with a `label`, an optional `busyLabel` and `doneLabel`, and an `onClick` that receives the account. Return a promise and the button says `busyLabel` with a spinner until it resolves, then shows the done label with a green tick. If it rejects, the button goes back to its label.

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
import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useReducedMotion } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { avatarInk, enter, Fold, Spin, useMounted, useReflow } from '../lib/motion';
import { useColumns } from '../lib/columns';

type AccountCol = 'account' | 'plan' | 'seats' | 'health' | 'mrr';
const COLS: { key: AccountCol; label: string; right?: boolean }[] = [
  { key: 'account', label: 'Account' }, { key: 'plan', label: 'Plan' }, { key: 'seats', label: 'Seats', right: true }, { key: 'health', label: 'Health' }, { key: 'mrr', label: 'MRR', right: true }
];
import '../designme.css';
import './account-table.css';

/** The tag colours a plan can take */
export type AccountTableTone = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

export interface AccountTableAccount {
  /** Also the account's key, and its first letter makes the logo */
  name: string;
  /** The logo's colour, like 'var(--dm-av-b)'. An avatar colour brings its own ink for the letter, any other colour takes white */
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
  /** The tag colour for each plan. Defaults to Enterprise purple, Pro blue, Team teal */
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
  /** A button in the open row's note, like Draft email. Return a promise and it says `busyLabel` with a spinner until it
      settles, then `doneLabel` with a green tick. The button is as wide as its words and eases to each new width */
  action?: { label: string; busyLabel?: string; doneLabel?: string; onClick: (account: AccountTableAccount) => void | Promise<unknown> };
  placeholder?: string;
  /** The title of the empty state, when nothing matches the search and filter */
  emptyLabel?: string;
  /** The muted line under it */
  emptyHint?: string;
  /** Its button, which clears the search and the plan filter */
  clearLabel?: string;
  className?: string;
}

const TONE: Record<AccountTableTone, string> = { blue: 'dm-b', purple: 'dm-l', green: 'dm-m', orange: 'dm-p', red: 'dm-r', yellow: 'dm-y', pink: 'dm-k', teal: 'dm-t' };
const TONES: Record<string, AccountTableTone> = { Enterprise: 'purple', Pro: 'blue', Team: 'teal' };
const healthColor = (h: number) => h >= 80 ? 'var(--dm-atb-ok)' : h >= 60 ? 'var(--dm-atb-warn)' : 'var(--dm-atb-bad)';

/** Accounts you can search and filter by plan; a row opens to show what the agent noticed. */
export function AccountTable({
  accounts, plans, planTones = TONES, plan, defaultPlan = '', onPlanChange, query, defaultQuery = '', onQueryChange,
  open, defaultOpen = null, onOpenChange, action, placeholder = 'Search accounts', emptyLabel = 'No accounts match',
  emptyHint = 'Try another name, or show every plan.', clearLabel = 'Show all accounts', className
}: AccountTableProps) {
  const [filter, setFilter] = useControllable(plan, defaultPlan, onPlanChange);
  const [text, setText] = useControllable(query, defaultQuery, onQueryChange);
  const [opened, setOpened] = useControllable(open, defaultOpen, onOpenChange);
  const tabs = plans ?? [...new Set(accounts.map(a => a.plan))];
  const s = text.trim().toLowerCase();
  const rows = accounts.filter(a => (!filter || a.plan === filter) && (!s || a.name.toLowerCase().includes(s)));

  // the rows stagger in once; after that a search or a plan filter glides the rows that still match to their new places,
  // fades new ones in and fades the ones filtered out where they were
  const box = useRef<HTMLDivElement>(null);
  useReflow(box, 'tbody > tr[data-key]');
  const mounted = useMounted();

  // an open row's note opens by its height and the rows under it ease down; it folds shut the same way, and goes once folded
  const [shut, setShut] = useState<string | null>(null);
  const [was, setWas] = useState(opened);
  if (was !== opened) { setWas(opened); if (was) setShut(was); }

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

  // the columns resize and move as in a spreadsheet; Account stays first, and every other header takes the keyboard's focus,
  // so Alt and an arrow move it
  const cols = useColumns<AccountCol>(COLS.map(c => c.key), { move: ['plan', 'seats', 'health', 'mrr'], min: { account: 150, plan: 96, seats: 72, health: 112, mrr: 88 }, name: k => COLS.find(c => c.key === k)!.label });
  const cell = (a: AccountTableAccount, k: AccountCol): ReactNode => {
    const tone = planTones[a.plan];
    switch (k) {
      case 'account': return <td key={k} data-col={k}><span className="dm-nm"><span className="dm-lg" style={{ background: a.color, color: avatarInk(a.color) }}>{a.name[0]}</span>{a.name}</span></td>;
      case 'plan': return <td key={k} data-col={k}><span className={cx('dm-tag', tone && TONE[tone])}>{a.plan}</span></td>;
      case 'seats': return <td key={k} data-col={k} className="dm-r dm-num">{a.seats}</td>;
      case 'health': return <td key={k} data-col={k}><span className="dm-hb"><i><b style={{ width: a.health + '%', background: healthColor(a.health) }} /></i><span className="dm-hv"><span className="dm-num">{a.health}</span></span></span></td>;
      default: return <td key={k} data-col={k} className="dm-r dm-num">{a.mrr}</td>;
    }
  };

  return (
    <div data-dm="" ref={box} className={cx('dm-atb dm-panel', className)}>
      <div className="dm-atb-h">
        <label className="dm-atb-s"><Icon name="search" size="xs" /><input placeholder={placeholder} aria-label={placeholder} value={text} onChange={e => setText(e.target.value)} /></label>
        <div className="dm-atb-fl" role="group" aria-label="Plan">
          {['', ...tabs].map(p => (
            <button type="button" key={p || 'all'} className={cx('dm-chip dm-sm', filter === p && 'dm-on')} aria-pressed={filter === p} onClick={() => setFilter(p)}>{p || 'All'}</button>
          ))}
        </div>
      </div>
      <div className="dm-atb-sc">
        <table {...cols.table} className={cx(cols.sized && 'dm-cols-rz')}>
          {cols.colgroup}
          <thead><tr>{cols.order.map(k => { const c = COLS.find(x => x.key === k)!; return <th key={k} {...cols.head(k)} className={c.right ? 'dm-r' : undefined} tabIndex={k === 'account' ? undefined : 0}>{c.label}{cols.handle(k)}</th>; })}</tr></thead>
          <tbody>
            {rows.length ? rows.map((a, i) => {
              const isOpen = opened === a.name, e = mounted ? undefined : enter(i * 35);
              return (
                <Fragment key={a.name}>
                  <tr data-key={a.name} className={cx('dm-row', isOpen && 'dm-open', e?.className)} style={e?.style} tabIndex={0} aria-expanded={isOpen}
                    onClick={() => toggle(a.name)} onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); toggle(a.name); } }}>
                    {cols.order.map(k => cell(a, k))}
                  </tr>
                  {(isOpen || shut === a.name) && (
                    <Note name={a.name} open={isOpen} onGone={() => setShut(x => x === a.name ? null : x)}>
                          <div className="dm-atb-note dm-enter">
                            <Icon name="spark" size="xs" />
                            <span>{a.note}</span>
                            {action && <ActionButton state={draft} action={action} onClick={() => run(a)} />}
                          </div>
                    </Note>
                  )}
                </Fragment>
              );
            }) : <tr className="dm-atb-empty" data-key=" none"><td colSpan={5}><div className="dm-atb-em">
              <span className="dm-atb-em-art" aria-hidden="true" /><b>{emptyLabel}</b>{emptyHint && <span>{emptyHint}</span>}
              <button type="button" className="dm-pill dm-line dm-sm" onClick={() => { setText(''); setFilter(''); }}>{clearLabel}</button>
            </div></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** The note's button: its words, then a spinner with the busy words in the loader's sweep, then the green tick with the done
    words. It is always as wide as its words and eases to each new width, so it never jumps or goes blank */
function ActionButton({ state, action, onClick }: { state: 'idle' | 'busy' | 'done'; action: NonNullable<AccountTableProps['action']>; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null), was = useRef<number | null>(null);
  const reduce = useReducedMotion();
  // the width it had before this state's words went in, read before the browser paints them
  const w0 = was.current;
  useLayoutEffect(() => {
    const b = ref.current; if (!b) return; const w1 = b.getBoundingClientRect().width; was.current = w1;
    if (reduce || w0 === null || Math.abs(w1 - w0) < .5 || !b.animate) return;
    const cs = getComputedStyle(b);
    b.animate([{ width: w0 + 'px' }, { width: w1 + 'px' }], { duration: (parseFloat(cs.getPropertyValue('--dm-t')) || .45) * 1000, easing: cs.getPropertyValue('--dm-ease').trim() || 'ease' });
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <button ref={ref} type="button" className="dm-pill dm-line dm-sm" aria-busy={state === 'busy'} onClick={e => { e.stopPropagation(); onClick(); }}>
      {state === 'busy' ? <><Spin /><span className="dm-shim">{action.busyLabel ?? 'Working'}</span></>
        : state === 'done' ? <><span className="dm-atb-done"><Icon name="check" size="xs" /></span>{action.doneLabel ?? 'Done'}</> : action.label}
    </button>
  );
}

/** The note under an open row: it mounts shut and folds open on the next frame; told to close, it folds shut and then goes */
function Note({ name, open, onGone, children }: { name: string; open: boolean; onGone: () => void; children: ReactNode }) {
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLTableRowElement>(null);
  useEffect(() => {
    if (open) { const f = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(f); }
    setOn(false);
    const ms = reduce || !ref.current ? 0 : (parseFloat(getComputedStyle(ref.current).getPropertyValue('--dm-t')) || .45) * 1000;
    const t = setTimeout(onGone, ms); return () => clearTimeout(t);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <tr ref={ref} className="dm-det" data-key={name + ' note'}>
      <td colSpan={5}><Fold open={on}>{children}</Fold></td>
    </tr>
  );
}
```

## More in Charts and tables

- [Line chart](https://designme.dev/components/line-chart.md): Today so far and projected, against yesterday, with a range switch, a project picker, toggles and a readout.
- [Bar chart](https://designme.dev/components/bar-chart.md): Weekly agent runs, split by outcome, with a range switch.
- [Donut chart](https://designme.dev/components/donut-chart.md): Where the agent's time went this week, as a gauge against its budget, with a part you can select.
- [Radial goals](https://designme.dev/components/radial-goals.md): Each agent's share of its own target as a ring, with the overall score in the middle.
- [Funnel chart](https://designme.dev/components/funnel-chart.md): Signup to paid, with the biggest drop called out by the agent.
- [Top pages](https://designme.dev/components/top-pages.md): Most visited pages with share of traffic and a quick sort.
- [Health score](https://designme.dev/components/health-score.md): An account's health: a score ring, four factors that open, and the agent's next move.
- [Score breakdown](https://designme.dev/components/score-breakdown.md): A score out of 100 whose gauge is split by what goes into it, with the weakest part flagged and a fix to try.
- [Eval radar](https://designme.dev/components/radar-chart.md): This run against the baseline on six eval scores, with the weak ones flagged.
- [Cost vs quality](https://designme.dev/components/scatter-chart.md): Every run as a dot by cost and eval score, sized by tokens, with quadrants and a drag to select.
- [Activity heatmap](https://designme.dev/components/activity-heatmap.md): When the agent and the team were busy, by day and hour.
- [Stat cards](https://designme.dev/components/stat-cards.md): Four headline numbers with sparklines and a period switch.

All components: https://designme.dev/llms.txt
