'use client';
import { useEffect, useState } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useTween } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Fold, Spin, Swap } from '../../lib/motion';
import '../../designme.css';
import './health-score.css';

export interface HealthScoreCheck {
  /** Identifies the check. Defaults to its label */
  key?: string;
  /** Like "Contrast" */
  label: string;
  /** 0 to 100. From 90 it is green, from 80 the accent, below that red */
  score: number;
  /** One line under the check when it is open, like "2 text pairs below AA on the pricing page" */
  detail: string;
  /** Adds a Fix button to the open check */
  fixable?: boolean;
}

export interface HealthScoreProps {
  checks: HealthScoreCheck[];
  /** Beside the gauge, like "Design system health" */
  title?: string;
  /** The score in the gauge. Defaults to the average of the checks */
  score?: number;
  /** The line under the title. Defaults to "Good, 2 checks need work" from the checks */
  status?: string;
  /** The open checks, by key. Leave it out to let each row toggle itself */
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (open: string[]) => void;
  /** Called by a check's Fix button. Return a promise and the button spins until it settles; then update the check's score and detail */
  onFix?: (check: HealthScoreCheck, index: number) => void | Promise<unknown>;
  className?: string;
}

const ARC = 157;
const tone = (v: number) => v >= 90 ? 'var(--dm-hs-ok)' : v >= 80 ? 'var(--dm-accent)' : 'var(--dm-hs-bad)';
const keyOf = (c: HealthScoreCheck) => c.key ?? c.label;

function Check({ check, index, filled, open, onToggle, onFix }: { check: HealthScoreCheck; index: number; filled: boolean; open: boolean; onToggle: () => void; onFix?: HealthScoreProps['onFix'] }) {
  const shown = useTween(check.score, 700);
  const [busy, setBusy] = useState(false);
  const fix = async () => {
    if (busy) return;
    setBusy(true);
    try { await onFix?.(check, index); } finally { setBusy(false); }
  };
  return (
    <div className={cx('dm-hsx-c', open && 'dm-open')}>
      <button type="button" className="dm-hsx-ch" aria-expanded={open} onClick={onToggle}>
        <span className="dm-t">{check.label}</span>
        <span className="dm-bar"><i style={filled ? { width: check.score + '%', background: tone(check.score) } : { width: 0 }} /></span>
        <span className="dm-v dm-num">{Math.round(shown)}</span>
        <Icon name="chev-r" size="xs" />
      </button>
      <Fold open={open}>
        <div className="dm-hsx-d">
          <Swap>{check.detail}</Swap>
          {check.fixable && onFix && <button type="button" className="dm-pill dm-soft dm-sm" onClick={fix} aria-busy={busy}>{busy ? <Spin /> : <><Icon name="wand" size="xs" />Fix</>}</button>}
        </div>
      </Fold>
    </div>
  );
}

/** One score for a design system, with the checks behind it. Open a check to see why, and fix it from there. */
export function HealthScore({ checks, title = 'Design system health', score, status, open, defaultOpen = [], onOpenChange, onFix, className }: HealthScoreProps) {
  const [opened, setOpened] = useControllable(open, defaultOpen, onOpenChange);
  // the gauge and the bars fill in a moment after the card appears, the bars one after another
  const [filled, setFilled] = useState(0);
  useEffect(() => {
    const ts = [setTimeout(() => setFilled(n => Math.max(n, 1)), 200), ...checks.map((_, i) => setTimeout(() => setFilled(n => Math.max(n, i + 2)), 200 + i * 80))];
    return () => ts.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const total = Math.round(score ?? (checks.length ? checks.reduce((a, c) => a + c.score, 0) / checks.length : 0));
  const drawn = filled > 0;
  const shown = useTween(drawn ? total : 0, 1000, 0);
  const weak = checks.filter(c => c.score < 90).length;
  const line = status ?? (weak ? `${total >= 85 ? 'Good' : 'Fair'}, ${weak} ${weak > 1 ? 'checks need' : 'check needs'} work` : 'Excellent, all checks pass');
  const toggle = (k: string) => setOpened(opened.includes(k) ? opened.filter(x => x !== k) : [...opened, k]);

  return (
    <div data-dm="" className={cx('dm-hsx dm-panel', className)}>
      <div className="dm-hsx-top">
        <div className="dm-hsx-g" role="meter" aria-label={title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={total}>
          <svg viewBox="0 0 120 70" aria-hidden="true">
            <path d="M10 64a50 50 0 0 1 100 0" className="dm-tr" />
            <path d="M10 64a50 50 0 0 1 100 0" className="dm-fl" style={drawn ? { strokeDashoffset: ARC * (1 - total / 100), stroke: tone(total) } : undefined} />
          </svg>
          <div className="dm-hsx-v"><b className="dm-num">{Math.round(shown)}</b><span className="dm-muted">of 100</span></div>
        </div>
        <div className="dm-hsx-s"><b>{title}</b><Swap className="dm-muted dm-hsx-st">{line}</Swap></div>
      </div>
      <div className="dm-hsx-list">
        {checks.map((c, i) => <Check key={keyOf(c)} check={c} index={i} filled={filled > i + 1} open={opened.includes(keyOf(c))} onToggle={() => toggle(keyOf(c))} onFix={onFix} />)}
      </div>
    </div>
  );
}
