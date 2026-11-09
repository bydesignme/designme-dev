'use client';
import { Fragment, useEffect, useId, useRef, useState } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useTween } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Fold, Spin, Swap } from '../../lib/motion';
import '../../designme.css';
import './health-score.css';

export type HealthStatus = 'ok' | 'warn' | 'bad';

/** @deprecated The rows no longer draw a trend (owner, 9 Nov): kept so existing data still type-checks, and ignored */
export type HealthTrend = { kind: 'dots'; values: boolean[] } | { kind: 'marks'; values: boolean[] } | { kind: 'spark'; values: number[] };

export interface HealthFactor {
  /** Identifies the factor, for `open` */
  key: string;
  /** Like "Contact" */
  label: string;
  /** Its dot and how the score counts it: on track, watch or at risk */
  status: HealthStatus;
  /** The figure, like "11d", "0", "61%" or "None" */
  value: string;
  /** Quieter words after the figure, like "ago", "late" or "booked" */
  unit?: string;
  /** What screen readers hear for the row, like "quiet for 11 days" */
  summary: string;
  /** Its share of the score: `points` of `max`. The factors' points add up to the score unless you pass `score` */
  points: number;
  max: number;
  /** @deprecated Ignored: the rows no longer draw a trend */
  trend?: HealthTrend;
  /** The lines its detail shows when the row is open */
  detail?: string[];
}

export interface HealthSuggestion {
  /** The agent's next move, like "Quiet for 11 days with nothing booked. Book a check-in with Sam this week." */
  text: string;
  /** The button's label, like "Book check-in" */
  action: string;
  icon?: IconName;
  /** Once true, the button gives way to a done chip and `doneText` replaces `text` */
  done?: boolean;
  doneText?: string;
  /** The chip's label, like "Booked". Defaults to "Done" */
  doneLabel?: string;
}

export interface HealthAccount {
  /** Shown above the score when set. Leave it out in a sheet that already names the account */
  name?: string;
  /** A line under the name, like "Mid-market, Asia Pacific" */
  segment?: string;
  factors: HealthFactor[];
  /** 0 to 100. Defaults to the factors' points added up */
  score?: number;
  /** The score a period ago, for the change beside the verdict, like "−13 in 30 days" */
  previous?: number;
  suggestion?: HealthSuggestion;
}

export interface HealthScoreProps {
  /** The account the block shows. Pass another one (or the same one, changed) and the ring sweeps, the score counts and
      what changed crossfades */
  account: HealthAccount;
  /** Starts the line under the verdict, like "Account health, 2 of 4 on track" */
  label?: string;
  /** The change's period, like "30 days" */
  period?: string;
  /** The verdict's lower bounds: [Healthy from, Watch from]. Below the second it is At risk */
  bands?: [number, number];
  /** The verdict words, by status */
  verdicts?: Partial<Record<HealthStatus, string>>;
  /** The open factor, by key, or null for none. Leave it out to let the rows toggle themselves */
  open?: string | null;
  defaultOpen?: string | null;
  onOpenChange?: (key: string | null) => void;
  /** Called by the suggestion's button. Return a promise and the button spins until it settles; then pass the account back
      with `suggestion.done` set and the factors it changed */
  onAction?: (account: HealthAccount) => void | Promise<unknown>;
  className?: string;
}

const RING = 2 * Math.PI * 18;
const WORD: Record<HealthStatus, string> = { ok: 'On track', warn: 'Watch', bad: 'At risk' };

/** An account's health: the score in a small ring with its verdict and change, a row per factor under a hairline with its
    status dot and figure (open one for its detail, right under it), and the agent's next move with its button. Colour only
    marks state: the dots and the ring. Fits a 440px details sheet; under 360px of room the button goes under the agent's line. */
export function HealthScore({ account, label = 'Account health', period = '30 days', bands = [70, 50], verdicts, open, defaultOpen = null, onOpenChange, onAction, className }: HealthScoreProps) {
  const [opened, setOpened] = useControllable<string | null>(open, defaultOpen, onOpenChange);
  const { factors, suggestion: sug } = account;
  const score = Math.round(account.score ?? factors.reduce((t, f) => t + f.points, 0));
  const band: HealthStatus = score >= bands[0] ? 'ok' : score >= bands[1] ? 'warn' : 'bad';
  const verdict = { ok: 'Healthy', warn: 'Watch', bad: 'At risk', ...verdicts }[band];
  const onTrack = factors.filter(f => f.status === 'ok').length;
  const line = `${label}, ${onTrack === factors.length ? `all ${onTrack}` : `${onTrack} of ${factors.length}`} on track`;
  const change = account.previous === undefined ? null : score - account.previous;
  // the weakest factor that is off track: the lowest share of its points, the first one on a tie
  const weak = factors.filter(f => f.status !== 'ok').reduce<HealthFactor | null>((w, f) => !w || f.points / (f.max || 1) < w.points / (w.max || 1) ? f : w, null);

  // the ring fills and the score counts a moment after the block appears; after that they follow the account
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 140); return () => clearTimeout(t); }, []);
  const shown = useTween(drawn ? score : 0, 900, 0);
  // the button is busy for the account it was pressed for; done is the account's own (suggestion.done)
  const who = account.name ?? '';
  const [busy, setBusy] = useState<string | null>(null);
  const btn = useRef<HTMLButtonElement>(null), chip = useRef<HTMLSpanElement>(null), had = useRef(false);
  const [width, setWidth] = useState<number | undefined>();
  const act = async () => {
    if (busy !== null || !onAction || sug?.done) return;
    had.current = document.activeElement === btn.current;
    setWidth(btn.current?.offsetWidth); setBusy(who);
    try { await onAction(account); } finally { setBusy(b => (b === who ? null : b)); setWidth(undefined); }
  };
  const done = !!sug?.done;
  useEffect(() => { if (done && had.current) { had.current = false; chip.current?.focus(); } }, [done]);
  // what changes is announced once: the agent's work when it lands
  const [say, setSay] = useState('');
  const wasDone = useRef(done), wasWho = useRef(who);
  useEffect(() => {
    if (done && !wasDone.current && wasWho.current === who && sug) setSay(sug.doneText ?? sug.text);
    wasDone.current = done; wasWho.current = who;
  }, [done, who, sug]);

  const ids = 'dm-hsc' + useId();

  return (
    <div data-dm="" className={cx('dm-hsc dm-panel', className)} data-v={band} role="group" aria-label={label}>
      {account.name && <div className="dm-hsc-ac"><b><Swap>{account.name}</Swap></b>{account.segment && <Swap>{account.segment}</Swap>}</div>}
      <div className="dm-hsc-h">
        <div className="dm-hsc-ring" role="img" aria-label={`Health ${score} of 100, ${verdict.toLowerCase()}${change === null ? '' : `, ${change >= 0 ? 'up' : 'down'} ${Math.abs(change)} in ${period}`}`}>
          <svg viewBox="0 0 44 44" aria-hidden="true">
            <circle className="dm-tr" cx="22" cy="22" r="18" />
            <circle className="dm-fl" cx="22" cy="22" r="18" strokeDasharray={RING.toFixed(2)} style={{ strokeDashoffset: (RING * (1 - (drawn ? score : 0) / 100)).toFixed(2) }} />
          </svg>
          <b className="dm-num" aria-hidden="true">{Math.round(shown)}</b>
        </div>
        <div className="dm-hsc-ht"><Swap className="dm-hsc-vd">{verdict}</Swap><Swap className="dm-hsc-sub">{line}</Swap></div>
        {change !== null && <Swap className="dm-hsc-dl dm-num">{`${change >= 0 ? '+' : '−'}${Math.abs(change)} in ${period}`}</Swap>}
      </div>
      <div className="dm-hsc-l">
        {factors.map((f, j) => (
          <Fragment key={f.key}>
            <button type="button" className="dm-hsc-t" data-s={f.status} data-weak={f === weak ? '' : undefined} aria-expanded={f.key === opened} aria-controls={`${ids}-${j}`}
              aria-label={`${f.label}: ${f.summary}. ${WORD[f.status]}${f === weak ? ', the weakest factor' : ''}`} onClick={() => setOpened(f.key === opened ? null : f.key)}>
              <span className="dm-hsc-k"><i className="dm-hsc-dot" /><span className="dm-hsc-n">{f.label}</span><span className="dm-hsc-wk" aria-hidden="true">Weakest</span></span>
              <span className="dm-hsc-v"><b className="dm-num"><Swap>{f.value}</Swap></b><Swap>{f.unit ?? ''}</Swap></span>
              <Icon name="chev-d" size="xs" className="dm-hsc-cv" />
            </button>
            <Fold open={f.key === opened} className="dm-hsc-d">
              <div id={`${ids}-${j}`} role="region" aria-label={`${f.label} details`}>
                {f.key === opened && (
                  <div className="dm-hsc-dc dm-enter" key={who + f.key}>
                    {(f.detail ?? []).map((l, i) => <p key={i} className="dm-hsc-dp">{l}</p>)}
                    <p className="dm-hsc-pt dm-num"><span>{f.points} of {f.max} points</span><i /><span>{WORD[f.status]}</span></p>
                  </div>
                )}
              </div>
            </Fold>
          </Fragment>
        ))}
      </div>
      {sug && (
        <div className="dm-hsc-s">
          <Icon name="spark" />
          <Swap className="dm-hsc-st">{done ? sug.doneText ?? sug.text : sug.text}</Swap>
          {done
            ? <span key={who + ':done'} ref={chip} className="dm-tag dm-ok dm-hsc-done dm-enter" tabIndex={-1}><Icon name="check" size="xs" />{sug.doneLabel ?? 'Done'}</span>
            : onAction && <button key={who} ref={btn} type="button" className="dm-pill dm-primary dm-sm dm-hsc-go dm-enter" onClick={act} disabled={busy === who} aria-busy={busy === who || undefined}
                style={busy === who && width ? { width } : undefined}>
                {busy === who ? <><Spin /><span className="dm-hsc-sr">Working</span></> : <>{sug.icon && <Icon name={sug.icon} size="xs" />}{sug.action}</>}
              </button>}
        </div>
      )}
      <p className="dm-hsc-sr" aria-live="polite">{say}</p>
    </div>
  );
}
