'use client';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useReducedMotion } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { avatarInk, enter, Fold, Spin, useMounted, useReflow } from '../../lib/motion';
import '../../designme.css';
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
  /** A button in the open row's note, like Draft email. Return a promise and it spins until it settles, then shows `doneLabel` */
  action?: { label: string; doneLabel?: string; onClick: (account: AccountTableAccount) => void | Promise<unknown> };
  placeholder?: string;
  /** Shown when nothing matches the search and filter */
  emptyLabel?: string;
  className?: string;
}

const TONE: Record<AccountTableTone, string> = { blue: 'dm-b', purple: 'dm-l', green: 'dm-m', orange: 'dm-p', red: 'dm-r', yellow: 'dm-y', pink: 'dm-k', teal: 'dm-t' };
const TONES: Record<string, AccountTableTone> = { Enterprise: 'purple', Pro: 'blue', Team: 'teal' };
const healthColor = (h: number) => h >= 80 ? 'var(--dm-atb-ok)' : h >= 60 ? 'var(--dm-atb-warn)' : 'var(--dm-atb-bad)';

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
        <table>
          <thead><tr><th>Account</th><th>Plan</th><th>Seats</th><th>Health</th><th className="dm-r">MRR</th></tr></thead>
          <tbody>
            {rows.length ? rows.map((a, i) => {
              const isOpen = opened === a.name, tone = planTones[a.plan], e = mounted ? undefined : enter(i * 35);
              return (
                <Fragment key={a.name}>
                  <tr data-key={a.name} className={cx('dm-row', isOpen && 'dm-open', e?.className)} style={e?.style} tabIndex={0} aria-expanded={isOpen}
                    onClick={() => toggle(a.name)} onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); toggle(a.name); } }}>
                    <td><span className="dm-nm"><span className="dm-lg" style={{ background: a.color, color: avatarInk(a.color) }}>{a.name[0]}</span>{a.name}</span></td>
                    <td><span className={cx('dm-tag', tone && TONE[tone])}>{a.plan}</span></td>
                    <td className="dm-num">{a.seats}</td>
                    <td><span className="dm-hb"><i><b style={{ width: a.health + '%', background: healthColor(a.health) }} /></i><span className="dm-num">{a.health}</span></span></td>
                    <td className="dm-r dm-num">{a.mrr}</td>
                  </tr>
                  {(isOpen || shut === a.name) && (
                    <Note name={a.name} open={isOpen} onGone={() => setShut(x => x === a.name ? null : x)}>
                          <div className="dm-atb-note dm-enter">
                            <Icon name="spark" size="xs" />
                            <span>{a.note}</span>
                            {action && (
                              <button type="button" className="dm-pill dm-soft dm-sm" onClick={e => { e.stopPropagation(); run(a); }}>
                                {draft === 'busy' ? <Spin /> : draft === 'done' ? <><Icon name="check" size="xs" />{action.doneLabel ?? 'Done'}</> : action.label}
                              </button>
                            )}
                          </div>
                    </Note>
                  )}
                </Fragment>
              );
            }) : <tr className="dm-atb-empty" data-key=" none"><td colSpan={5}>{emptyLabel}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
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
