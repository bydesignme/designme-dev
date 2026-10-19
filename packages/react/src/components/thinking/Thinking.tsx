'use client';
import { useEffect, useState } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useSeconds } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Fold, Pulse, SourceChip, Swap, Think, Tip, type Source } from '../../lib/motion';
import './thinking.css';

export interface ThinkingStep {
  /** What the agent is doing, then what it did. Change it when the step finishes and it crossfades */
  label: string;
  /** running shimmers, done settles, dead marks a path that went nowhere */
  state: 'running' | 'done' | 'dead';
  /** The mark a finished step keeps: a dot (default), a search glass, or a hollow ring */
  mark?: 'dot' | 'search' | 'hollow';
  /** Indents the step under the one before it */
  sub?: boolean;
  /** Files or pages this step read, shown as chips */
  sources?: Source[];
  /** Sources hidden behind a "+N more" chip */
  moreSources?: Source[];
}

export interface ThinkingProps {
  steps: ThinkingStep[];
  /** Shimmers, counts seconds and keeps the trace open while true */
  running: boolean;
  /** Seconds to show. Leave it out to let it count while running */
  seconds?: number;
  /** A last line once thinking is done, like "3 cards to fix · 2 steps" */
  summary?: string;
  /** Folds the trace away a moment after it finishes */
  collapseWhenDone?: boolean;
  /** Whether the trace is open. Leave it out to let the header toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function Chips({ sources, more }: { sources: Source[]; more?: Source[] }) {
  const [all, setAll] = useState(false);
  return (
    <div className="dm-tk-chips">
      {sources.map((s, i) => <SourceChip key={i} source={s} {...enter(i * 80)} />)}
      {more?.length ? (all
        ? more.map((s, i) => <SourceChip key={'m' + i} source={s} />)
        : <Tip label={more.map(s => s.label).join(', ')}><button type="button" className="dm-tk-more" onClick={() => setAll(true)}>+{more.length} more</button></Tip>) : null}
    </div>
  );
}

function Mark({ step }: { step: ThinkingStep }) {
  if (step.state === 'running') return <Pulse />;
  // keyed so the finished mark plays its entrance once
  if (step.state === 'dead') return <span key="dead" className="dm-enter" style={{ display: 'grid' }}><Icon name="x" size="xs" /></span>;
  if (step.mark === 'search') return <span key="search" className="dm-enter" style={{ display: 'grid' }}><Icon name="search" size="xs" /></span>;
  if (step.mark === 'hollow') return <span key="hollow" className="dm-ring dm-enter" />;
  return <span key="dot" className="dm-dot dm-enter" />;
}

/** The live trace, written as the agent works, then folded away. */
export function Thinking({ steps, running, seconds, summary, collapseWhenDone = true, open, defaultOpen = true, onOpenChange, className }: ThinkingProps) {
  const counted = useSeconds(running && seconds === undefined);
  const secs = seconds ?? counted;
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  // once it finishes, the trace waits a beat and folds itself away
  useEffect(() => {
    if (running || !collapseWhenDone || !steps.length) return;
    const t = setTimeout(() => setOpen(false), 2200);
    return () => clearTimeout(t);
  }, [running, collapseWhenDone, steps.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const fin = !running && summary !== undefined;

  return (
    <div data-dm="" className={cx('dm-tk', className)} data-open={isOpen ? '1' : '0'}>
      <button type="button" className="dm-tk-h" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
        <span className="dm-tk-mark"><Think on={running} /></span>
        <Swap className={cx('dm-tk-title', running && 'dm-shim')}>{running ? 'Thinking' : `Thought for ${Math.max(secs, 1)}s`}</Swap>
        <span className="dm-tk-time dm-num">{running ? secs + 's' : ''}</span>
        <Icon name="chev-d" size="xs" className="dm-tk-chev" />
      </button>
      <Fold open={isOpen} className="dm-tk-fold">
        <ol className="dm-tk-list" aria-live="polite">
          {steps.map((s, i) => (
            <li key={i} className={cx('dm-tk-st dm-enter', s.state === 'running' && 'dm-run', s.sub && 'dm-sub', s.state === 'dead' && 'dm-dead')}>
              {s.sub && <span className="dm-curve" />}
              <span className="dm-mk"><Mark step={s} /></span>
              <span className={cx('dm-rl', (i < steps.length - 1 || fin) && 'dm-on')} />
              <div className="dm-tx">
                <Swap className={cx('dm-lab', s.state === 'running' && 'dm-shim')}>{s.label}</Swap>
                {s.sources?.length ? <Chips sources={s.sources} more={s.moreSources} /> : null}
              </div>
            </li>
          ))}
          {fin && (
            <li className="dm-tk-st dm-tk-fin dm-enter">
              <span className="dm-mk"><Icon name="ok" /></span>
              <div className="dm-tx"><span><span className="dm-lab">Finished thinking</span>{summary && <span className="dm-sum">{summary}</span>}</span></div>
            </li>
          )}
        </ol>
      </Fold>
    </div>
  );
}
