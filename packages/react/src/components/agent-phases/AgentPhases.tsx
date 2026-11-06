'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useSeconds } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Fold, Radar, Swap, Think } from '../../lib/motion';
import '../../designme.css';
import './agent-phases.css';

export type AgentPhase = 'thinking' | 'searching' | 'reading' | 'waiting' | 'writing' | 'done';

export interface AgentPhasesProps {
  phase: AgentPhase;
  /** What the line says, like "Reading 3 articles". Defaults to the phase's name; once done, "Thought for 12s" */
  label?: string;
  /** Seconds so far. Counts by itself while left out (and stops while waiting for you) */
  seconds?: number;
  /** A step that failed: the line turns red and says so, with Retry */
  error?: { text: string; detail?: string; onRetry: () => void };
  /** Shown while the phase takes long: "Still working…", with Stop */
  slow?: { text: string; onStop?: () => void };
  /** What the agent waits for in the waiting phase, with Approve and Not now */
  ask?: { text: ReactNode; approveLabel?: string; onApprove: () => void; onDecline?: () => void };
  /** Seconds each phase took, by phase, for the list a finished line opens to */
  took?: Partial<Record<AgentPhase, number>>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const ORDER: AgentPhase[] = ['thinking', 'searching', 'reading', 'waiting', 'writing', 'done'];
const NAME: Record<AgentPhase, string> = { thinking: 'Thinking', searching: 'Searching', reading: 'Reading', waiting: 'Waiting for you', writing: 'Writing', done: 'Done' };
const KEY: Record<AgentPhase, string> = { thinking: 'think', searching: 'search', reading: 'read', waiting: 'wait', writing: 'write', done: 'done' };

/** One line for which phase the agent is in, from thinking to done: it stops to ask you, says when it is slow or failed, and folds to how long it took. */
export function AgentPhases({ phase, label, seconds, error, slow, ask, took = {}, open, defaultOpen = false, onOpenChange, className }: AgentPhasesProps) {
  const counted = useSeconds(seconds === undefined && phase !== 'done' && phase !== 'waiting');
  const secs = seconds ?? counted;
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const at = ORDER.indexOf(phase), done = phase === 'done';
  const p = error ? 'err' : KEY[phase];
  const line = error ? error.text : label ?? (done ? `Thought for ${secs}s` : NAME[phase]);
  const glyph = error ? <Icon name="alert" /> : { thinking: <Think />, searching: <Radar />, reading: <Icon name="file-text" />, waiting: <Icon name="hand" />, writing: <Icon name="edit" />, done: <Icon name="ok" /> }[phase];
  // only a change of phase is announced
  const [said, setSaid] = useState('');
  const last = useRef('');
  useEffect(() => { const t = error ? 'Error: ' + error.text : done ? `Done, thought for ${secs}s` : NAME[phase]; if (t !== last.current) { last.current = t; setSaid(t); } }, [phase, !!error]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div data-dm="" data-p={p} className={cx('dm-aph', className)}>
      <button type="button" className="dm-aph-h" aria-expanded={done && isOpen} aria-disabled={!done || undefined} onClick={() => { if (done) setOpen(!isOpen); }}>
        <span className="dm-aph-g" key={p}><span className="dm-enter" style={{ display: 'grid' }}>{glyph}</span></span>
        <Swap className={cx('dm-aph-l', !done && !error && phase !== 'waiting' && 'dm-shim')}>{line}</Swap>
        <span className="dm-aph-t dm-num">{done ? '' : secs + 's'}</span>
        <Icon name="chev-d" size="xs" className="dm-aph-chev" />
      </button>
      <div className="dm-aph-tr" aria-hidden="true">{ORDER.map((ph, j) => <i key={ph} className={cx(j === at && !done && 'dm-now')}>{j <= at && <b />}</i>)}</div>
      <div className="dm-aph-x">
        {error ? <div className="dm-aph-n dm-err dm-enter"><Icon name="alert" size="xs" /><span>{error.detail ?? error.text}</span><button type="button" className="dm-pill dm-line dm-sm" onClick={error.onRetry}><Icon name="refresh" size="xs" />Retry</button></div>
          : phase === 'waiting' && ask ? <div className="dm-aph-n dm-ask dm-enter"><span>{ask.text}</span><button type="button" className="dm-pill dm-primary dm-sm" onClick={ask.onApprove}>{ask.approveLabel ?? 'Approve'}</button>{ask.onDecline && <button type="button" className="dm-pill dm-ghost dm-sm" onClick={ask.onDecline}>Not now</button>}</div>
          : slow && !done ? <div className="dm-aph-n dm-enter"><Icon name="clock" size="xs" /><span>{slow.text}</span>{slow.onStop && <button type="button" className="dm-pill dm-line dm-sm" onClick={slow.onStop}><Icon name="stop" size="xs" />Stop</button>}</div> : null}
      </div>
      <Fold open={done && isOpen}>
        <ol className="dm-aph-list">{ORDER.slice(0, 5).filter(ph => took[ph] !== undefined).map(ph => <li key={ph}><Icon name="check" size="xs" /><span>{NAME[ph]}</span><span className="dm-num">{took[ph]}s</span></li>)}</ol>
      </Fold>
      <p className="dm-aph-sr" role="status">{said}</p>
    </div>
  );
}
