'use client';
import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useReducedMotion, useTween } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Fold, Spin, Swap } from '../../lib/motion';
import '../../designme.css';
import './health-score.css';

export type HealthStatus = 'ok' | 'warn' | 'bad';

/** A factor's small trend: `dots` is one dot per period, filled when it happened (contact by week); `marks` is one mark per
    item, red when it is late (open deals); `spark` is a line of values, its last point in the factor's status */
export type HealthTrend = { kind: 'dots'; values: boolean[] } | { kind: 'marks'; values: boolean[] } | { kind: 'spark'; values: number[] };

export interface HealthFactor {
  /** Identifies the factor, for `open` */
  key: string;
  /** Like "Contact" */
  label: string;
  /** Its dot, its trend's mark and how the score counts it: on track, watch or at risk */
  status: HealthStatus;
  /** The figure, like "11d", "0", "61%" or "None" */
  value: string;
  /** Quieter words after the figure, like "ago", "late" or "booked" */
  unit?: string;
  /** What screen readers hear for the tile, like "quiet for 11 days" */
  summary: string;
  /** Its share of the score: `points` of `max`. The factors' points add up to the score unless you pass `score` */
  points: number;
  max: number;
  trend?: HealthTrend;
  /** The lines its detail shows when the tile is open */
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
  /** The open factor, by key, or null for none. Leave it out to let the tiles toggle themselves */
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

function Trend({ trend }: { trend: HealthTrend }) {
  if (trend.kind === 'dots') return <span className="dm-hsc-dots">{trend.values.map((on, i) => <i key={i} className={on ? 'dm-on' : undefined} />)}</span>;
  if (trend.kind === 'marks') return <span className="dm-hsc-bars">{trend.values.map((late, i) => <i key={i} className={late ? 'dm-late' : undefined} />)}</span>;
  const v = trend.values, lo = Math.min(...v), hi = Math.max(...v);
  const pt = v.map((y, i) => [2 + i * 52 / Math.max(1, v.length - 1), 3 + (1 - (y - lo) / (hi - lo || 1)) * 14]), e = pt[pt.length - 1];
  return (
    <svg className="dm-hsc-sp" viewBox="0 0 56 20">
      <polyline points={pt.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ')} />
      {e && <circle cx={e[0].toFixed(1)} cy={e[1].toFixed(1)} r="2.5" />}
    </svg>
  );
}

/** Crossfades a part when its id changes: the old one blurs out, the new one in (like Swap, for markup) */
function Fade({ id, children }: { id: string; children: ReactNode }) {
  const [shown, setShown] = useState({ id, children });
  const [out, setOut] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (id === shown.id) { setOut(false); if (children !== shown.children) setShown({ id, children }); return; }
    setOut(true);
    const t = setTimeout(() => { setShown({ id, children }); setOut(false); }, reduce ? 0 : 170);
    return () => clearTimeout(t);
  }, [id, children, shown, reduce]);
  return <span className={cx('dm-sw', out && 'dm-out')}>{shown.children}</span>;
}

/** An account's health: the score in a small ring with its verdict and change, a tile per factor with its figure and a small
    trend (open one for its detail), and the agent's next move with its button. Colour only marks state: the dots, the trend
    marks and the ring. Fits a 440px details sheet; under 360px of room the trends, the Weakest label and the button take their own lines. */
export function HealthScore({ account, label = 'Account health', period = '30 days', bands = [70, 50], verdicts, open, defaultOpen = null, onOpenChange, onAction, className }: HealthScoreProps) {
  const [opened, setOpened] = useControllable<string | null>(open, defaultOpen, onOpenChange);
  const reduce = useReducedMotion();
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
  // the trends draw in once, as the block arrives
  const grid = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduce || !grid.current) return;
    grid.current.querySelectorAll<HTMLElement>('.dm-hsc-tr > * > *').forEach((el, i) => el.animate?.(
      [{ clipPath: 'inset(-4px 100% -4px -4px)' }, { clipPath: 'inset(-4px -4px -4px -4px)' }],
      { duration: 700, delay: 260 + i * 70, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'backwards' }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const pairs: HealthFactor[][] = [];
  factors.forEach((f, i) => { if (i % 2 === 0) pairs.push([f]); else pairs[pairs.length - 1].push(f); });
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
      <div className="dm-hsc-g" ref={grid}>
        {pairs.map((pair, j) => {
          const here = pair.find(f => f.key === opened);
          return (
            <Fragment key={j}>
              {pair.map(f => (
                <button key={f.key} type="button" className="dm-hsc-t" data-s={f.status} data-weak={f === weak ? '' : undefined} aria-expanded={f.key === opened} aria-controls={`${ids}-${j}`}
                  aria-label={`${f.label}: ${f.summary}. ${WORD[f.status]}${f === weak ? ', the weakest factor' : ''}`} onClick={() => setOpened(f.key === opened ? null : f.key)}>
                  <span className="dm-hsc-k"><i className="dm-hsc-dot" /><span>{f.label}</span></span>
                  <span className="dm-hsc-wk" aria-hidden="true">Weakest</span>
                  <Icon name="chev-d" size="xs" className="dm-hsc-cv" />
                  <span className="dm-hsc-v"><b className="dm-num"><Swap>{f.value}</Swap></b><Swap>{f.unit ?? ''}</Swap></span>
                  <span className="dm-hsc-tr" aria-hidden="true">{f.trend && <Fade id={JSON.stringify(f.trend)}><Trend trend={f.trend} /></Fade>}</span>
                </button>
              ))}
              <Fold open={!!here} className="dm-hsc-d">
                <div id={`${ids}-${j}`} role="region" aria-label={here ? `${here.label} details` : 'Details'}>
                  {here && (
                    <div className="dm-hsc-dc dm-enter" key={who + here.key}>
                      {(here.detail ?? []).map((l, i) => <p key={i} className="dm-hsc-dp">{l}</p>)}
                      <p className="dm-hsc-pt dm-num"><span>{here.points} of {here.max} points</span><i /><span>{WORD[here.status]}</span></p>
                    </div>
                  )}
                </div>
              </Fold>
            </Fragment>
          );
        })}
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
