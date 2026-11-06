'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useTween } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Fold, Swap } from '../../lib/motion';
import '../../designme.css';
import './score-breakdown.css';

export interface ScoreFactor {
  key: string;
  /** Like "Speed" */
  label: string;
  /** The points it can earn; the weights add up to 100 */
  weight: number;
  /** The points it earned */
  earned: number;
  /** The agent's one-line note, like "Median reply 6.4s, target under 4s" */
  note: string;
  /** Adds an Improve button to the open row */
  improvable?: boolean;
  /** A line shown first in the open row, like what was changed */
  detail?: string;
}

export interface ScoreProposal {
  /** What the agent would change */
  text: ReactNode;
  /** What it would gain, like "About 2.1s faster a reply" */
  gain?: string;
  /** The points the factor would earn after it */
  to: number;
}

export interface ScoreBreakdownProps {
  factors: ScoreFactor[];
  title?: string;
  /** Last period's score, for the change beside the band word */
  previous?: number;
  /** What the change is measured against ("since last week") */
  since?: string;
  /** The open rows, by key */
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (open: string[]) => void;
  /** Called by Improve. Return the agent's proposal (or a promise of it); while it waits the row says the agent is looking */
  onImprove?: (factor: ScoreFactor) => ScoreProposal | Promise<ScoreProposal>;
  /** Called by Apply on a proposal; update the factor's `earned` and `note` */
  onApply?: (factor: ScoreFactor, proposal: ScoreProposal) => void;
  /** What the row says while the agent works on a proposal */
  improvingLabel?: string;
  className?: string;
}

const PAL = ['var(--dm-c1)', 'var(--dm-c2)', 'var(--dm-c3)', 'var(--dm-c4)', 'var(--dm-c5)', 'var(--dm-c6)'];
const band = (s: number) => s >= 90 ? 'Excellent' : s >= 75 ? 'Good' : s >= 60 ? 'Fair' : 'Needs work';
const CX = 100, CY = 100, RAD = 86, GAP = .04;
const at = (a: number) => [CX + Math.cos(a) * RAD, CY + Math.sin(a) * RAD];
const arc = (a0: number, a1: number) => { const [x0, y0] = at(a0), [x1, y1] = at(a1); return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${RAD} ${RAD} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`; };

function Segment({ a0, a1, share, color, on, onPoint }: { a0: number; a1: number; share: number; color: string; on: boolean; onPoint: (on: boolean) => void }) {
  const p = useTween(share, 900, 0);
  return (
    <g className={cx(on && 'dm-on')} onPointerEnter={e => { if (e.pointerType !== 'touch') onPoint(true); }} onPointerLeave={() => onPoint(false)}>
      <path className="dm-tr" d={arc(a0, a1)} />
      {p > 0 && <path className="dm-fl" style={{ stroke: color }} d={arc(a0, a0 + (a1 - a0) * Math.min(1, p))} />}
    </g>
  );
}

/** A score out of 100 whose gauge is split by what goes into it, each part filled by the points it earned, with the weakest flagged and an agent's fix one click away. */
export function ScoreBreakdown({ factors, title = 'Quality score', previous, since = 'since last week', open, defaultOpen = [], onOpenChange, onImprove, onApply, improvingLabel = 'Looking into it', className }: ScoreBreakdownProps) {
  const [opened, setOpened] = useControllable(open, defaultOpen, onOpenChange);
  const [hot, setHot] = useState(-1);
  const [drawn, setDrawn] = useState(false);
  const [props, setProps] = useState<Record<string, ScoreProposal | 'busy'>>({});
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 280); return () => clearTimeout(t); }, []);
  const total = factors.reduce((t, f) => t + f.earned, 0);
  const shown = useTween(drawn ? total : 0, 1000, 0);
  const weakest = factors.reduce((m, f, i) => f.earned / f.weight < factors[m].earned / factors[m].weight ? i : m, 0);
  let a = Math.PI;
  const seg = factors.map(f => { const span = f.weight / 100 * Math.PI, s = [a + GAP / 2, a + span - GAP / 2]; a += span; return s; });
  const d = previous === undefined ? null : total - previous;
  const improve = async (f: ScoreFactor) => {
    if (!onImprove) return;
    setProps(p => ({ ...p, [f.key]: 'busy' }));
    const pr = await onImprove(f); setProps(p => ({ ...p, [f.key]: pr }));
  };
  const drop = (k: string) => setProps(p => { const n = { ...p }; delete n[k]; return n; });
  return (
    <div data-dm="" className={cx('dm-sbx dm-panel', className)}>
      <div className="dm-sbx-top">
        <div className={cx('dm-sbx-g', hot >= 0 && 'dm-hov')} role="meter" aria-label={title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={total}
          aria-valuetext={`${total} of 100, ${band(total).toLowerCase()}${d === null ? '' : `, ${d >= 0 ? 'up' : 'down'} ${Math.abs(d)} ${since}`}`}>
          <svg viewBox="0 0 200 108" aria-hidden="true">
            {factors.map((f, i) => <Segment key={f.key} a0={seg[i][0]} a1={seg[i][1]} share={drawn ? f.earned / f.weight : 0} color={PAL[i % PAL.length]} on={i === hot} onPoint={o => setHot(o ? i : -1)} />)}
          </svg>
          <div className="dm-sbx-v"><b className="dm-num">{Math.round(shown)}</b><span className="dm-muted">of 100</span></div>
        </div>
        <div className="dm-sbx-s"><b>{title}</b>
          <span className="dm-sbx-band"><Swap className="dm-muted">{drawn ? band(total) : 'Scoring'}</Swap>{d !== null && drawn && <span className={cx('dm-tag dm-num', d >= 0 ? 'dm-ok' : 'dm-bad')}>{d >= 0 ? '+' : '−'}{Math.abs(d)} {since}</span>}</span>
        </div>
      </div>
      <div className="dm-sbx-list" onPointerLeave={e => { if (!e.currentTarget.contains(document.activeElement)) setHot(-1); }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHot(-1); }}>
        {factors.map((f, i) => {
          const isOpen = opened.includes(f.key), lost = f.weight - f.earned, pr = props[f.key];
          return (
            <div key={f.key} className={cx('dm-sbx-r', i === hot && 'dm-on', isOpen && 'dm-open')} onPointerEnter={e => { if (e.pointerType !== 'touch') setHot(i); }} onFocus={() => setHot(i)}>
              <button type="button" className="dm-sbx-rh" aria-expanded={isOpen} aria-label={`${f.label}: ${f.earned} of ${f.weight} points${i === weakest ? ', weakest' : ''}. ${f.note}`}
                onClick={() => setOpened(isOpen ? opened.filter(k => k !== f.key) : [...opened, f.key])}>
                <i style={{ background: PAL[i % PAL.length] }} /><span className="dm-n"><span>{f.label}</span>{i === weakest && <span className="dm-tag dm-warn">Weakest</span>}</span>
                <span className="dm-e dm-num">{f.earned}/{f.weight}</span><span className="dm-bar"><i style={{ background: PAL[i % PAL.length], width: drawn ? f.earned / f.weight * 100 + '%' : 0 }} /></span>
                <Icon name="chev-r" size="xs" /><span className="dm-sbx-nt">{f.note}</span>
              </button>
              <Fold open={isOpen}>
                <div className="dm-sbx-d">
                  {pr === 'busy' ? <div className="dm-sbx-pr dm-enter"><span className="dm-k"><Icon name="spark" size="xs" /><span className="dm-shim">{improvingLabel}</span></span></div>
                    : pr ? <div className="dm-sbx-pr"><span className="dm-k"><Icon name="spark" size="xs" />Proposal</span><span>{pr.text}</span>
                        <span className="dm-gain">{pr.gain ? pr.gain + ': ' : ''}{f.label} <b className="dm-num">{f.earned} → {pr.to}</b></span>
                        <span className="dm-acts"><button type="button" className="dm-pill dm-primary dm-sm" onClick={() => { drop(f.key); onApply?.(f, pr); }}>Apply</button><button type="button" className="dm-pill dm-ghost dm-sm" onClick={() => drop(f.key)}>Not now</button></span></div>
                    : <><span>{f.detail ? f.detail + ' ' : ''}{lost ? `Loses ${lost} of its ${f.weight} points` : 'Full marks'}{i === weakest && lost ? ', the most of any factor for its weight.' : '.'}</span>
                        {f.improvable && onImprove && <span className="dm-acts"><button type="button" className="dm-pill dm-soft dm-sm" onClick={() => improve(f)}><Icon name="wand" size="xs" />Improve</button></span>}</>}
                </div>
              </Fold>
            </div>
          );
        })}
      </div>
    </div>
  );
}
