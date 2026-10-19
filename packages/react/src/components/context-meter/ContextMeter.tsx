'use client';
import { useEffect, useState } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useTween } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Swap, Tip } from '../../lib/motion';
import './context-meter.css';

export interface UsageRow {
  key: string;
  /** Like "Context window", "Session limit" or "Weekly" */
  label: string;
  /** 0 to 100. From 90 the bar turns amber */
  percent: number;
  /** The quiet line under the bar, like "136k of 200k tokens" or "Resets Sun 10:00 PM" */
  detail?: string;
  /** Shown when you hover the bar, like what is filling the context */
  tip?: string;
  /** A small button at the end of the detail line, like Compact */
  action?: { label: string; onClick: () => void };
}

export interface ContextMeterProps {
  rows: UsageRow[];
  /** How full the ring is, 0 to 100. Defaults to the first row */
  ring?: number;
  title?: string;
  /** Shown beside the ring, like "Opus 5.5" */
  model?: string;
  /** Shown after the model, quieter, like "Extra" */
  effort?: string;
  /** Adds a button in the corner that opens your usage page */
  onViewUsage?: () => void;
  /** Whether the popover is open. Leave it out to let the ring toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function Row({ row, ready }: { row: UsageRow; ready: boolean }) {
  const pct = Math.max(0, Math.min(100, row.percent)), shown = Math.round(useTween(ready ? pct : 0, 1000, 0));
  const bar = <span className="ctm-tr" role="meter" aria-label={row.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><i style={{ width: (ready ? pct : 0) + '%' }} /></span>;
  return (
    <div className={cx('ctm-r', pct >= 90 && 'hot')}>
      <span className="l">{row.label}</span>
      <span className="p num">{shown}% used</span>
      {row.tip ? <Tip label={row.tip}>{bar}</Tip> : bar}
      {(row.detail || row.action) && (
        <span className="s">
          {row.detail && <Swap className="t">{row.detail}</Swap>}
          {row.action && <button type="button" className="ctm-go" onClick={row.action.onClick}><Swap>{row.action.label}</Swap></button>}
        </span>
      )}
    </div>
  );
}

/** How full the context window is, with any other limits, in one small popover that opens from a ring. */
export function ContextMeter({ rows, ring, title = 'Usage', model, effort, onViewUsage, open, defaultOpen = true, onOpenChange, className }: ContextMeterProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  // the bars and the ring fill in a moment after the meter appears
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);
  const fill = Math.max(0, Math.min(100, ring ?? rows[0]?.percent ?? 0));

  return (
    <div data-dm="" className={cx('ctm', !isOpen && 'shut', className)}>
      <div className="ctm-pop panel keep" role="dialog" aria-label={title} inert={!isOpen}>
        <div className="ctm-ph">
          <b>{title}</b>
          {onViewUsage && <Tip label="View usage"><button type="button" className="ib ctm-ib" aria-label="View usage" onClick={onViewUsage}><Icon name="bars" /></button></Tip>}
        </div>
        <div className="ctm-rows">{rows.map(r => <Row key={r.key} row={r} ready={ready} />)}</div>
      </div>
      <div className="ctm-ft">
        {model && <span>{model}</span>}
        {effort && <span className="muted">{effort}</span>}
        <button type="button" className="ctm-ring" aria-expanded={isOpen} aria-label={`${title}, ${fill}% full`} onClick={() => setOpen(!isOpen)}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle className="tr" cx="10" cy="10" r="7.5" />
            <circle className="fl" cx="10" cy="10" r="7.5" pathLength={100} style={{ strokeDasharray: `${ready ? fill : 0} 100`, stroke: fill >= 90 ? 'var(--warn)' : undefined }} />
          </svg>
        </button>
      </div>
    </div>
  );
}
