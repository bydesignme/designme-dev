'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useTween } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Spin, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './run-summary.css';

export interface RunStat {
  /** Like "files" or "cost" */
  label: string;
  /** Counts up from 0 when the summary appears */
  value: number;
  /** Before the number, like "$" */
  prefix?: string;
  /** After the number, like "k" */
  suffix?: string;
  /** Decimal places, like 2 for a cost */
  decimals?: number;
}

export interface RunChange {
  file: string;
  added: number;
  removed: number;
}

export interface RunNeed {
  key: string;
  /** What needs the person. Crossfades when it changes */
  text: string;
  /** A button at the end, like Review. busy swaps its label for a spinner */
  action?: { label: string; onClick: () => void; busy?: boolean };
}

export interface RunSummaryProps {
  /** Defaults to "Run complete" */
  title?: string;
  /** The title once the changes are undone */
  undoneTitle?: string;
  /** The quiet line under the title, like "Finished in 12m 40s" */
  subtitle?: string;
  /** One line on what the run did */
  summary?: ReactNode;
  stats?: RunStat[];
  /** The files the run changed, under "What changed" */
  changes?: RunChange[];
  /** What is left for the person, under "Needs you" */
  needs?: RunNeed[];
  /** Adds a button in the corner that opens the run's details */
  onDetails?: () => void;
  /** The main button, "Open changes" */
  onOpenChanges?: () => void;
  /** Whether the changes are undone. Leave it out to let "Undo all" toggle it */
  undone?: boolean;
  defaultUndone?: boolean;
  onUndoneChange?: (undone: boolean) => void;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

function Stat({ stat, delay }: { stat: RunStat; delay: number }) {
  // each number starts rolling a beat after the one before it
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), delay); return () => clearTimeout(t); }, [delay]);
  const v = useTween(go ? stat.value : 0, 1100, 0);
  return <span><b className="dm-num">{go ? (stat.prefix ?? '') + v.toFixed(stat.decimals ?? 0) + (stat.suffix ?? '') : '0'}</b> {stat.label}</span>;
}

/** What an agent run did, what it cost and what still needs the person, once it finishes. */
export function RunSummary({ title = 'Run complete', undoneTitle = 'Changes undone', subtitle, summary, stats, changes, needs, onDetails, onOpenChanges, undone, defaultUndone = false, onUndoneChange, bare = true, className }: RunSummaryProps) {
  const [isUndone, setUndone] = useControllable(undone, defaultUndone, onUndoneChange);
  // the glyph only plays its entrance once it has changed, not when the summary first appears
  const [seen, setSeen] = useState(isUndone);
  const [moved, setMoved] = useState(false);
  if (seen !== isUndone) { setSeen(isUndone); setMoved(true); }
  // the rows come in one after another, across both sections
  let row = 0;
  const next = () => enter(300 + row++ * 70);

  return (
    <div data-dm="" className={cx('dm-rsu', !bare && 'dm-panel', isUndone && 'dm-undone', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-rsu-h">
        <span className="dm-rsu-g" style={isUndone ? { background: 'var(--dm-chip)', color: 'var(--dm-fg2)' } : undefined}>
          <Icon key={isUndone ? 'undo' : 'check'} name={isUndone ? 'undo' : 'check'} className={moved ? 'dm-enter' : undefined} />
        </span>
        <div>
          <Swap className="dm-rsu-t">{isUndone ? undoneTitle : title}</Swap>
          {subtitle && <div className="dm-rsu-s dm-muted">{subtitle}</div>}
        </div>
        {onDetails && <Tip label="Run details"><button type="button" className="dm-ib dm-rsu-more" aria-label="More" onClick={onDetails}><Icon name="more" /></button></Tip>}
      </div>
      {summary && <p className="dm-rsu-title">{summary}</p>}
      {stats?.length ? <div className="dm-rsu-stats">{stats.map((s, i) => <Stat key={s.label} stat={s} delay={200 + i * 90} />)}</div> : null}
      {changes?.length ? (
        <div className="dm-rsu-sec">
          <div className="dm-rsu-l">What changed</div>
          {changes.map(c => {
            const e = next();
            return (
              <div key={c.file} className={cx('dm-rsu-it', e.className)} style={e.style}>
                <span className="dm-mono">{c.file}</span>
                <span className="dm-num"><i className={c.added ? 'dm-a' : 'dm-z'}>+{c.added}</i> <i className={c.removed ? 'dm-x' : 'dm-z'}>−{c.removed}</i></span>
              </div>
            );
          })}
        </div>
      ) : null}
      {needs?.length ? (
        <div className="dm-rsu-sec">
          <div className="dm-rsu-l">Needs you</div>
          {needs.map(n => {
            const e = next();
            return (
              <div key={n.key} className={cx('dm-rsu-it dm-rsu-need', e.className)} style={e.style}>
                <span className="dm-dot" style={{ color: 'var(--dm-warn-mark)' }} />
                <Swap className="dm-rsu-nt">{n.text}</Swap>
                {n.action && <button type="button" className="dm-pill dm-soft dm-sm dm-rsu-fix" onClick={n.action.busy ? undefined : n.action.onClick} aria-busy={n.action.busy || undefined}>{n.action.busy ? <Spin /> : n.action.label}</button>}
              </div>
            );
          })}
        </div>
      ) : null}
      {(() => {
        const e = next();
        return (
          <div className={cx('dm-rsu-acts', e.className)} style={e.style}>
            <button type="button" className="dm-pill dm-primary dm-sm" onClick={onOpenChanges}>Open changes</button>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-rsu-undo" onClick={() => setUndone(!isUndone)}><Swap>{isUndone ? 'Redo' : 'Undo all'}</Swap></button>
          </div>
        );
      })()}
    </div>
  );
}
