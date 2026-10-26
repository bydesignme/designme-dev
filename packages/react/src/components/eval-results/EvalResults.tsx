'use client';
import { useState } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Fold, Seg, Spin, Swap } from '../../lib/motion';
import '../../designme.css';
import './eval-results.css';

export type EvalStatus = 'queued' | 'running' | 'pass' | 'fail';
export type EvalFilter = 'all' | 'fail';

export interface EvalCase {
  id: string;
  /** What it checks, like "Prices match the billing table" */
  name: string;
  status: EvalStatus;
  /** How long it took, like "0.9s", shown once it has a result */
  time?: string;
  /** For a failed case: what should have come back */
  expected?: string;
  /** For a failed case: what came back instead */
  got?: string;
  /** For a failed case: where the expected answer comes from */
  source?: string;
  /** For a failed case: a white button under its details, like Use $24 and rerun */
  fix?: { label: string; onClick: () => void };
}

export interface EvalResultsProps {
  /** Like "Pricing copy evals" */
  title: string;
  /** The line under the title, like "Copy agent · 8 cases · run 2h ago" */
  subtitle?: string;
  cases: EvalCase[];
  /** Adds the run button */
  onRun?: () => void;
  /** Whether the whole suite is running: the button spins and the count reads "Running 3 of 8" */
  running?: boolean;
  /** Defaults to "Run evals" */
  runLabel?: string;
  /** How many passed the run before. Once the run settles, a tag compares with it, like "1 fewer than the last run" */
  previousPassed?: number;
  /** Which cases show: all of them, or only the failed ones */
  filter?: EvalFilter;
  defaultFilter?: EvalFilter;
  onFilterChange?: (filter: EvalFilter) => void;
  /** Ids of the failed cases that are open. Leave it out to let each one open itself */
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (ids: string[]) => void;
  className?: string;
}

/** How many times `value` has changed since the first render, so a glyph can play its entrance on a change but not on mount */
function useChanges<T>(value: T) {
  const [seen, setSeen] = useState({ value, n: 0 });
  if (Object.is(seen.value, value)) return seen.n;
  setSeen({ value, n: seen.n + 1 });
  return seen.n + 1;
}

function Glyph({ status }: { status: EvalStatus }) {
  const e = useChanges(status) > 0 ? enter() : undefined;
  return (
    <span key={status} className={cx('dm-evr-g', e?.className)} style={e?.style} aria-hidden="true">
      {status === 'running' ? <Spin /> : status === 'pass' ? <Icon name="ok" size="xs" /> : status === 'fail' ? <Icon name="alert" size="xs" /> : <span className="dm-dot" />}
    </span>
  );
}

const SEG: Record<EvalStatus, string | undefined> = { queued: undefined, running: 'dm-run', pass: 'dm-pass', fail: 'dm-fail' };

/** An eval suite's latest run: a bar segment per case, the pass count against the run before, and the cases, all or only
    the failed ones. A failed case opens to show what was expected and what came back, with a fix. */
export function EvalResults({ title, subtitle, cases, onRun, running = false, runLabel = 'Run evals', previousPassed, filter, defaultFilter = 'all', onFilterChange, open, defaultOpen = [], onOpenChange, className }: EvalResultsProps) {
  const [show, setShow] = useControllable(filter, defaultFilter, onFilterChange);
  const [opened, setOpened] = useControllable(open, defaultOpen, onOpenChange);
  const passed = cases.filter(k => k.status === 'pass').length, failed = cases.filter(k => k.status === 'fail').length;
  const settled = cases.every(k => k.status === 'pass' || k.status === 'fail');
  const count = settled ? `${passed} of ${cases.length} passed` : running ? `Running ${passed + failed + 1} of ${cases.length}` : 'Running the case again';
  const delta = !settled || running || previousPassed === undefined ? '' : passed === cases.length ? 'All passing'
    : passed < previousPassed ? `${previousPassed - passed} fewer than the last run` : passed > previousPassed ? `${passed - previousPassed} more than the last run` : '';
  const dl = delta ? enter() : undefined;

  return (
    <div data-dm="" className={cx('dm-evr dm-panel', className)}>
      <div className="dm-evr-h">
        <div className="dm-evr-ht"><b>{title}</b>{subtitle && <Swap className="dm-muted dm-evr-st">{subtitle}</Swap>}</div>
        {onRun && (
          <button type="button" className="dm-pill dm-primary dm-sm dm-evr-run" disabled={running} onClick={onRun}>
            {running ? <><Spin />Running</> : <><Icon name="play" size="xs" />{runLabel}</>}
          </button>
        )}
      </div>
      <div className="dm-evr-sum">
        <div className="dm-evr-segs" aria-hidden="true">{cases.map(k => <i key={k.id} className={SEG[k.status]} />)}</div>
        <div className="dm-evr-nums">
          <span aria-live="polite"><Swap className="dm-evr-pass dm-num">{count}</Swap></span>
          {delta && <span key={delta} className={cx('dm-tag dm-evr-dl', passed < (previousPassed ?? 0) ? 'dm-bad' : 'dm-ok', dl?.className)} style={dl?.style}>{delta}</span>}
        </div>
      </div>
      <div className="dm-evr-tabs">
        <Seg label="Show" value={show} onChange={setShow} options={[
          { value: 'all', label: <>All <span className="dm-n dm-num">{cases.length}</span></> },
          { value: 'fail', label: <>Failed <span className="dm-n dm-num">{failed}</span></> }
        ]} />
      </div>
      <div className="dm-evr-list" role="list" aria-label="Cases">
        {cases.map(k => {
          const fail = k.status === 'fail', isOpen = fail && opened.includes(k.id);
          const meta = <><Glyph status={k.status} /><span className="dm-evr-n">{k.name}</span><span className="dm-evr-tm dm-num">{k.status === 'pass' || fail ? k.time : ''}</span></>;
          return (
            <Fold key={k.id} open={show === 'all' || fail} className="dm-evr-w">
              <div className={cx('dm-evr-i', `dm-${k.status}`)} role="listitem">
                {fail ? (
                  <>
                    <button type="button" className="dm-evr-r" aria-expanded={isOpen} onClick={() => setOpened(isOpen ? opened.filter(id => id !== k.id) : [...opened, k.id])}>
                      {meta}<span className="dm-evr-ch"><Icon name="chev-d" size="xs" /></span>
                    </button>
                    <Fold open={isOpen} className="dm-evr-d">
                      <div className="dm-evr-dd">
                        {k.expected && <span className="dm-evr-kv"><span className="dm-k">Expected</span><span>{k.expected}</span></span>}
                        {k.got && <span className="dm-evr-kv"><span className="dm-k">Got</span><span className="dm-bad">{k.got}</span></span>}
                        {k.source && <span className="dm-evr-kv"><span className="dm-k">Source</span><span>{k.source}</span></span>}
                        {k.fix && <button type="button" className="dm-pill dm-sm dm-evr-fix" onClick={k.fix.onClick}>{k.fix.label}</button>}
                      </div>
                    </Fold>
                  </>
                ) : <div className="dm-evr-r">{meta}</div>}
              </div>
            </Fold>
          );
        })}
      </div>
      {show === 'fail' && !failed && <p className="dm-evr-none">No failed cases</p>}
    </div>
  );
}
