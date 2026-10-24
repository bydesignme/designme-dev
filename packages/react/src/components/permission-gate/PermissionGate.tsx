'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Spin, Swap, Tip } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
import './permission-gate.css';

/** Something the agent is asking to be allowed to do */
export interface PermissionScope {
  key: string;
  /** Like "Edit frames" */
  label: string;
  /** The quiet line under it, like "Only on a new page" */
  detail?: string;
  /** A warning tag after it, like "Risky" */
  risk?: string;
  /** What the risk tag reveals on hover, like "Checkout, Marketing site, Email kit and Docs use this library" */
  riskDetail?: string;
}

export type PermissionStatus = 'asking' | 'allowed' | 'declined';

export interface PermissionGateProps {
  /** The question, like "Allow the agent to edit Figma?" */
  title: ReactNode;
  /** Why it asks */
  subtitle?: ReactNode;
  /** Shown in the tile beside the question. Defaults to a shield */
  icon?: ReactNode;
  scopes: PermissionScope[];
  /** Keys of the ticked scopes. Leave it out to let the checkboxes hold their own */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (keys: string[]) => void;
  /** How long the permission lasts, picked from a small dropdown in the footer. Defaults to This task, Today and Always */
  durations?: string[];
  /** The quiet line under each duration in its menu, by duration, like { Today: 'Until midnight' } */
  durationDetails?: Record<string, string>;
  duration?: string;
  defaultDuration?: string;
  onDurationChange?: (duration: string) => void;
  /** asking, allowed or declined. Leave it out to let the buttons move it */
  status?: PermissionStatus;
  defaultStatus?: PermissionStatus;
  onStatusChange?: (status: PermissionStatus) => void;
  /** Called with the ticked scopes and the duration. Return a promise and the button spins until it settles */
  onAllow?: (keys: string[], duration: string) => void | Promise<void>;
  onDecline?: () => void;
  /** Called by Revoke, after allowing */
  onRevoke?: () => void;
  /** Called by Undo, after declining */
  onUndo?: () => void;
  /** The line under "Allowed …", like "Applying the pricing fixes now". Crossfades when it changes */
  allowedDetail?: string;
  /** Replaces "Allowed 2 scopes for this task", like "Done. 6 frames edited". Crossfades when it changes */
  allowedTitle?: string;
  /** The agent is still working under the permission: a spinner on a neutral row instead of the green check */
  working?: boolean;
  /** Quiet text at the end of the allowed row, like an elapsed time "0:04" */
  meta?: ReactNode;
  /** A follow-up ask in the middle of a run, for one more scope: the icon tile turns amber */
  followUp?: boolean;
  /** The decline button. Defaults to "Not now"; a follow-up ask might say "Skip this frame" */
  declineLabel?: string;
  /** Shown after Not now */
  declinedTitle?: ReactNode;
  declinedDetail?: ReactNode;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

const DURATIONS = ['This task', 'Today', 'Always'];
const DETAILS: Record<string, string> = { 'This task': 'Until the task is done', Today: 'Until midnight', Always: 'Until you revoke it' };
// "For this task" in the menu and "for this task" after Allowed; Always reads as it is
const durLabel = (d: string) => /^always$/i.test(d) ? d : 'For ' + d.toLowerCase();
const durSpan = (d: string) => /^always$/i.test(d) ? 'always' : 'for ' + d.toLowerCase();

/** The agent asks before it acts: pick the scopes and how long they last, then allow or decline. */
export function PermissionGate({
  title, subtitle, icon, scopes, value, defaultValue = [], onValueChange, durations = DURATIONS, durationDetails = DETAILS, duration, defaultDuration, onDurationChange,
  status, defaultStatus = 'asking', onStatusChange, onAllow, onDecline, onRevoke, onUndo, allowedDetail, allowedTitle, working = false, meta, followUp = false,
  declineLabel = 'Not now', declinedTitle = 'The agent will skip these changes', declinedDetail, bare = true, className
}: PermissionGateProps) {
  const [ticked, setTicked] = useControllable(value, defaultValue, onValueChange);
  const [dur, setDur] = useControllable(duration, defaultDuration ?? durations[0], onDurationChange);
  const durMenu = usePopover();
  const [state, setState] = useControllable(status, defaultStatus, onStatusChange);
  const [waiting, setWaiting] = useState(false);
  // a revoked permission fades out before the scopes come back
  const [leaving, setLeaving] = useState(false);
  // the scopes play their entrance when they come back, not when the card first appears
  const [back, setBack] = useState(0);
  const [granted, setGranted] = useState(0);
  // the scopes give way to a shorter result row: the gate keeps the height it had and centres the row in it, until Revoke or Undo
  const root = useRef<HTMLDivElement>(null);
  const [held, setHeld] = useState<number>();
  const hold = () => setHeld(h => h ?? root.current?.offsetHeight);
  const n = ticked.length;

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => { setLeaving(false); setHeld(undefined); setState('asking'); setBack(b => b + 1); onRevoke?.(); }, 300);
    return () => clearTimeout(t);
  }, [leaving]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (key: string) => setTicked(ticked.includes(key) ? ticked.filter(k => k !== key) : scopes.map(s => s.key).filter(k => k === key || ticked.includes(k)));
  const allow = async () => {
    if (!n || waiting) return;
    setWaiting(true); setGranted(n);
    try { await onAllow?.(ticked, dur); } finally { setWaiting(false); }
    hold(); setState('allowed');
  };
  const decline = () => { hold(); setState('declined'); onDecline?.(); };
  const undo = () => { setHeld(undefined); setState('asking'); setBack(b => b + 1); onUndo?.(); };
  const again = (i: number) => (back ? { className: 'dm-enter', style: enter(i * 50).style, key: back } : { className: undefined, style: undefined, key: 0 });

  return (
    <div data-dm="" ref={root} className={cx('dm-pgx', !bare && 'dm-panel', followUp && state === 'asking' && 'dm-esc', held && 'dm-held', className)} style={held ? { minHeight: held } : undefined}>
      <div className="dm-pgx-h">
        <span className="dm-pgx-ic">{icon ?? <Icon name="shield" />}</span>
        <div className="dm-pgx-ht"><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div>
      </div>
      {state === 'asking' && (
        <>
          <div key={'sc' + again(0).key} className={cx('dm-pgx-sc', again(0).className)} style={again(0).style}>
            {scopes.map(s => (
              <label key={s.key} className="dm-pgx-o">
                <input type="checkbox" checked={ticked.includes(s.key)} onChange={() => toggle(s.key)} />
                <span className="dm-bx"><Icon name="check" size="xs" /></span>
                <span className="dm-t">{s.label}{s.detail && <span className="dm-d">{s.detail}</span>}</span>
                {s.risk && (s.riskDetail ? <Tip label={s.riskDetail}><span className="dm-tag dm-warn">{s.risk}</span></Tip> : <span className="dm-tag dm-warn">{s.risk}</span>)}
              </label>
            ))}
          </div>
          <div key={'f' + again(1).key} className={cx('dm-pgx-f', again(1).className)} style={again(1).style}>
            <button {...durMenu.trigger} type="button" className="dm-pgx-db" aria-label="How long"><Swap className="dm-pgx-dv">{durLabel(dur)}</Swap><Icon name="chev-d" size="xs" /></button>
            <span className="dm-sp" />
            <button type="button" className="dm-pill dm-ghost dm-sm dm-pgx-no" onClick={decline}>{declineLabel}</button>
            <button type="button" className="dm-pill dm-ink dm-sm dm-pgx-ok" disabled={!n} onClick={allow}>
              {waiting ? <Spin /> : <Swap>{n ? `Allow ${n} ${n > 1 ? 'scopes' : 'scope'}` : 'Pick a scope'}</Swap>}
            </button>
          </div>
        </>
      )}
      <div {...durMenu.pop} className={cx(durMenu.pop.className, 'dm-pgx-pop')} role="menu" aria-label="How long">
        {durations.map(d => (
          <button key={d} type="button" className="dm-mi" role="menuitemradio" aria-checked={d === dur} onClick={() => { setDur(d); durMenu.closeSoon(); }}>
            <span>{durLabel(d)}{durationDetails[d] && <span className="dm-d">{durationDetails[d]}</span>}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
          </button>
        ))}
      </div>
      {state === 'allowed' && (
        <div className={cx('dm-pgx-done', working ? 'dm-run' : 'dm-ok', leaving ? 'dm-leave' : 'dm-enter')}>
          <span className="dm-g">{working ? <Spin /> : <Icon name="ok" />}</span>
          <span className="dm-t">
            <b className="dm-pgx-a"><Swap>{allowedTitle ?? `Allowed ${granted || n} ${(granted || n) > 1 ? 'scopes' : 'scope'} ${durSpan(dur)}`}</Swap></b>
            {allowedDetail !== undefined && <Swap>{allowedDetail}</Swap>}
          </span>
          {meta !== undefined && <span className="dm-pgx-tm dm-num">{meta}</span>}
          <button type="button" className="dm-pill dm-ghost dm-sm" onClick={() => setLeaving(true)}>Revoke</button>
        </div>
      )}
      {state === 'declined' && (
        <div className="dm-pgx-done dm-enter" style={{ background: 'var(--dm-chip)' }}>
          <Icon name="info" />
          <span className="dm-t">{declinedTitle}{declinedDetail && <span>{declinedDetail}</span>}</span>
          <button type="button" className="dm-pill dm-ghost dm-sm" onClick={undo}>Undo</button>
        </div>
      )}
    </div>
  );
}
