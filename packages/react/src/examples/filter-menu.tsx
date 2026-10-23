'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { FilterMenu, type FilterMenuField, type FilterMenuFilter } from '../components/filter-menu/FilterMenu';
import { useStory } from './useScript';

/* ---------- Filter menu: filter to open issues, then to Maya's, then take the status filter off ---------- */
const OWNERS: Record<string, [string, string]> = { MK: ['Maya Kim', 'var(--dm-pl)'], LP: ['Leo Park', 'var(--dm-pb)'], AR: ['Ana Ruiz', 'var(--dm-pm)'], SC: ['Sam Cole', 'var(--dm-pp)'] };
const STATUS: Record<string, [string, string]> = { open: ['Open', 'var(--dm-pb)'], prog: ['In progress', 'var(--dm-warn)'], done: ['Done', 'var(--dm-ok)'] };
// title, status, owner and days since the last update, most recent first
const ISSUES = ([
  ['Pricing toggle hides the yearly saving', 'open', 'MK', 0], ['Plan cards wrap at 768px', 'open', 'MK', 1], ['Checkout button loses its focus ring', 'open', 'MK', 3],
  ['Invoice email shows the wrong currency', 'open', 'MK', 9], ['Seat slider skips 25', 'open', 'LP', 0], ['Coupon field accepts expired codes', 'open', 'LP', 2],
  ['Dark logo has a white edge', 'open', 'AR', 1], ['FAQ accordion jumps on open', 'open', 'AR', 5], ['Trial banner covers the nav', 'open', 'SC', 0],
  ['EU tax line rounds down', 'open', 'SC', 12], ['Annual plan link goes to a 404', 'open', 'LP', 20], ['Move pricing copy into the CMS', 'prog', 'MK', 0],
  ['Comparison table for Team', 'prog', 'MK', 2], ['Prices in yen for Japan', 'prog', 'LP', 4], ['New hero illustration', 'prog', 'AR', 1],
  ['Track plan clicks', 'prog', 'SC', 6], ['Enterprise contact form', 'prog', 'MK', 15], ['Seat limits on the Free plan', 'prog', 'AR', 3],
  ['Ship the new plan names', 'done', 'MK', 1], ['Price flicker on load', 'done', 'MK', 8], ['Remove the Starter plan', 'done', 'LP', 3],
  ['Badge for the yearly discount', 'done', 'AR', 2], ['Retry failed Stripe webhooks', 'done', 'SC', 25], ['Refund policy link', 'done', 'SC', 10]
] as [string, string, string, number][]).map(([title, status, owner, age]) => ({ title, status, owner, age })).sort((a, b) => a.age - b.age);
type Issue = (typeof ISSUES)[number];

const FIELDS: FilterMenuField[] = [
  { key: 'status', label: 'Status', icon: 'target', options: Object.entries(STATUS).map(([value, [label, color]]) => ({ value, label, glyph: <span className="dm-dot" style={{ color }} /> })) },
  { key: 'owner', label: 'Owner', icon: 'user', options: Object.entries(OWNERS).map(([value, [label, color]]) => ({ value, label, glyph: <span className="dm-av" style={{ background: color }}>{value}</span> })) },
  { key: 'date', label: 'Updated', icon: 'cal', operators: ['within', 'older than'], options: [{ value: '1', label: 'Past day', chip: '1 day' }, { value: '7', label: 'Past 7 days', chip: '7 days' }, { value: '30', label: 'Past 30 days', chip: '30 days' }] }
];
const test = (t: Issue, f: FilterMenuFilter) => (f.field === 'status' ? t.status === f.value : f.field === 'owner' ? t.owner === f.value : t.age < +f.value) !== !!f.negate;

export default function FilterMenuDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<FilterMenuFilter[]>([]);
  const hits = ISSUES.filter(t => filters.every(f => test(t, f)));

  // the preview's story: filter to open issues, then to Maya's, and watch the count drop; then take the status filter off
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-flm-tr');
    await wait(1200); press('.dm-mi[data-k="status"]');
    await wait(1200); press('.dm-flm-lv:not([hidden]) .dm-mi[role="menuitemradio"]');
    await wait(2500); press('.dm-flm-tr');
    await wait(1200); press('.dm-mi[data-k="owner"]');
    await wait(1200); press('.dm-flm-lv:not([hidden]) .dm-mi[role="menuitemradio"]');
    await wait(2500); press('.dm-flm-x');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <FilterMenu fields={FIELDS} filters={filters} onFiltersChange={setFilters} total={ISSUES.length} count={hits.length}
        // each value says how many issues picking it would leave, with the other filters kept
        countFor={(field, value) => ISSUES.filter(t => filters.every(f => f.field === field || test(t, f)) && test(t, { field, value })).length}
        results={hits.slice(0, 4).map(t => ({
          id: t.title, title: t.title, meta: t.age ? t.age + 'd' : 'Today',
          dot: { color: STATUS[t.status][1], label: STATUS[t.status][0] }, avatar: { initials: t.owner, color: OWNERS[t.owner][1], label: OWNERS[t.owner][0] }
        }))} />
    </div>
  );
}
