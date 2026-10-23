'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/cx';
import { useIsoLayoutEffect, useReducedMotion, useSeconds } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Spin, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './agent-inbox.css';

export type InboxGroup = 'needs' | 'running' | 'done';

export interface InboxRun {
  id: string;
  /** What the run is for, like "Publish the pricing page" */
  title: string;
  /** Which agent runs it. Its first letter marks the row, and a finished run shows it under the title */
  agent: string;
  /** The mark's colour, like 'var(--dm-pl)'. Defaults to the accent */
  color?: string;
  group: InboxGroup;
  /** The line under the title: why it needs you, or what it is doing now. A finished run shows its agent instead */
  detail?: string;
  /** Marks a run that needs you because it failed: its row turns red and offers Retry instead of Approve */
  failed?: boolean;
  /** More on the failure, in a tooltip on its detail line */
  why?: string;
  /** How long a running run has been going, in seconds. Its clock counts on from here */
  seconds?: number;
  /** When a finished run ended, like "12m ago" */
  ended?: string;
}

export interface AgentInboxProps {
  runs: InboxRun[];
  /** Adds Approve to the runs that need you and haven't failed */
  onApprove?: (id: string) => void;
  /** Adds Retry to the runs that failed */
  onRetry?: (id: string) => void;
  /** Defaults to "Inbox" */
  title?: string;
  /** The line beside the title. Defaults to "2 need you", or "All clear · 4 done today" */
  status?: string;
  className?: string;
}

const GROUPS: [InboxGroup, string, string][] = [['needs', 'Needs you', 'Nothing needs you'], ['running', 'Running', 'Nothing running'], ['done', 'Done', 'Nothing done yet']];
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Every agent run in one list, grouped as Needs you, Running and Done, with live clocks on the running ones. Approve
    starts a run that waits for you and Retry tries a failed one again; a run that changes group glides to its place. */
export function AgentInbox({ runs, onApprove, onRetry, title = 'Inbox', status, className }: AgentInboxProps) {
  const reduce = useReducedMotion();
  const list = useRef<HTMLDivElement>(null);
  // what changes after the first render plays its entrance; what is there from the start just appears
  const ready = useRef(false);
  useEffect(() => { ready.current = true; }, []);
  // one tick a second drives every running clock: each counts on from the seconds it had when it was last given
  const tick = useSeconds(runs.some(r => r.group === 'running'));
  const base = useRef(new Map<string, { s: number; at: number }>());
  const secs = (r: InboxRun) => {
    const b = base.current.get(r.id), s = r.seconds ?? 0;
    if (!b || b.s !== s) { base.current.set(r.id, { s, at: tick }); return s; }
    return b.s + tick - b.at;
  };
  for (const id of [...base.current.keys()]) if (!runs.some(r => r.id === id && r.group === 'running')) base.current.delete(id);

  const need = runs.filter(r => r.group === 'needs').length, done = runs.filter(r => r.group === 'done').length;
  const line = status ?? (need ? `${need} need${need > 1 ? '' : 's'} you` : `All clear · ${done} done today`);

  // a run that changes group glides there: rows and group titles are measured after each move and eased from where
  // they were, the moving row rides above the rest, and a line that appears fades in
  const where = useRef(new Map<string, number>());
  const groupOf = useRef(new Map<string, InboxGroup>());
  const sig = runs.map(r => r.id + ':' + r.group).join();
  useIsoLayoutEffect(() => {
    const box = list.current; if (!box) return;
    const top = box.getBoundingClientRect().top, next = new Map<string, number>();
    box.querySelectorAll<HTMLElement>('[data-k]').forEach(el => {
      const k = el.dataset.k!, y = el.getBoundingClientRect().top - top, was = where.current.get(k);
      next.set(k, y);
      if (reduce || !where.current.size) return;
      if (was === undefined) { el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260 }); return; }
      if (Math.abs(was - y) > 1) el.animate([{ transform: `translateY(${was - y}px)` }, { transform: 'none' }], { duration: 420, easing: getComputedStyle(box).getPropertyValue('--dm-ease').trim() || 'ease' });
      const moved = groupOf.current.get(k), now = runs.find(r => r.id === k)?.group;
      if (moved && now && moved !== now) { el.classList.add('dm-mv'); setTimeout(() => el.classList.remove('dm-mv'), 440); }
    });
    where.current = next;
    groupOf.current = new Map(runs.map(r => [r.id, r.group]));
  }, [sig]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div data-dm="" className={cx('dm-aib dm-panel', className)}>
      <div className="dm-aib-h"><b>{title}</b><span aria-live="polite"><Swap className="dm-muted dm-aib-st">{line}</Swap></span></div>
      <div ref={list}>
        {GROUPS.map(([g, name, none]) => {
          const rows = runs.filter(r => r.group === g);
          return (
            <section key={g} className="dm-aib-g" aria-label={name}>
              <div className="dm-aib-gh" data-k={'h:' + g}><span>{name}</span><span className="dm-n">{rows.length || ''}</span></div>
              <div className="dm-aib-gl" role="list">
                {rows.map(r => {
                  const col = r.color ?? 'var(--dm-accent)', fail = g === 'needs' && !!r.failed;
                  const detail = g === 'done' ? r.agent : r.detail ?? '';
                  return (
                    <div key={r.id} data-k={r.id} className={cx('dm-aib-i', fail && 'dm-fail')} role="listitem">
                      <span className="dm-aib-av" style={{ color: col, background: `color-mix(in srgb,${col} 13%,transparent)` }} aria-hidden="true">{r.agent.charAt(0)}</span>
                      <span className="dm-aib-t">
                        <b>{r.title}</b>
                        {fail && r.why ? <Tip label={r.why}><span><Swap>{detail}</Swap></span></Tip> : <Swap>{detail}</Swap>}
                      </span>
                      <Right key={g + (fail ? '!' : '')} run={r} group={g} fail={fail} secs={g === 'running' ? secs(r) : 0} fresh={ready.current} onApprove={onApprove} onRetry={onRetry} />
                    </div>
                  );
                })}
              </div>
              {!rows.length && <p className="dm-aib-none" data-k={'n:' + g}>{none}</p>}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Right({ run, group, fail, secs, fresh, onApprove, onRetry }: { run: InboxRun; group: InboxGroup; fail: boolean; secs: number; fresh: boolean; onApprove?: (id: string) => void; onRetry?: (id: string) => void }) {
  // it plays its entrance when it mounts after the first render, as a run changes group, and not again on each clock tick
  const [e] = useState(() => fresh ? enter() : undefined);
  let body = null;
  if (group === 'needs') {
    if (fail && onRetry) body = <button type="button" className="dm-pill dm-sm dm-aib-go" aria-label={`Retry ${run.title}`} onClick={() => onRetry(run.id)}><Icon name="refresh" size="xs" />Retry</button>;
    else if (!fail && onApprove) body = <button type="button" className="dm-pill dm-ink dm-sm dm-aib-go" aria-label={`Approve ${run.title}`} onClick={() => onApprove(run.id)}>Approve</button>;
  } else if (group === 'running') body = <><Spin /><span className="dm-num">{clock(secs)}</span></>;
  else body = <><span className="dm-ok"><Icon name="ok" size="xs" /></span><span>{run.ended}</span></>;
  return <span className={cx('dm-aib-r', e?.className)} style={e?.style}>{body}</span>;
}
