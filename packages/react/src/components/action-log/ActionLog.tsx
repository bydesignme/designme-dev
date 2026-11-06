'use client';
import { useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { Icon, type IconName } from '../../lib/icons';
import { Dot, Fold, Spin, Swap } from '../../lib/motion';
import '../../designme.css';
import './action-log.css';

export interface Action {
  /** The tool's icon, like 'file-text', 'search', 'edit', 'term' or 'pr' */
  icon: IconName;
  /** What the agent did. Wrap file names in <code> */
  title: ReactNode;
  /** The quiet line under it, like "src/pages, 212 lines" */
  detail?: ReactNode;
  /** running shows a spinner, done a check and the time */
  state: 'running' | 'done';
  /** How long it took, like "0.4s". Shown once the action is done */
  time?: string;
  /** What opens under the row, like a diff or test output. Lines in <span className="dm-a"> or "dm-x" read as added or removed */
  output?: ReactNode;
}

export interface ActionLogProps {
  actions: Action[];
  title?: string;
  /** Shows a spinner in the header while true, and a green dot once false */
  running?: boolean;
  /** The words beside it. Defaults to "Running step N", then "N steps, Xs" */
  status?: string;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

function Row({ action }: { action: Action }) {
  const [open, setOpen] = useState(false);
  const done = action.state === 'done';
  return (
    <li className="dm-alg-it dm-enter">
      <button type="button" className="dm-alg-row" aria-expanded={action.output ? open : undefined} onClick={() => setOpen(!open)}>
        <span className="dm-alg-ic"><Icon name={action.icon} /></span>
        <span className="dm-alg-tx"><b>{action.title}</b>{action.detail && <span className="dm-d">{action.detail}</span>}</span>
        <span className="dm-alg-r">
          <span className="dm-num dm-ms">{done ? action.time : ''}</span>
          <span className="dm-g">{done
            ? <span key="ok" className="dm-enter" style={{ color: 'var(--dm-ok)' }}><Icon name="check" size="xs" /></span>
            : <span className="dm-spin" style={{ width: 10, height: 10 }} />}</span>
        </span>
      </button>
      {action.output && <Fold open={open} className="dm-alg-det"><pre>{action.output}</pre></Fold>}
    </li>
  );
}

/** Every tool call the agent makes, as a list that grows while it works. Each row opens to show its output. */
export function ActionLog({ actions, title = 'Agent activity', running = true, status, bare = true, className }: ActionLogProps) {
  const total = actions.reduce((s, a) => s + (parseFloat(a.time ?? '') || 0), 0);
  const words = status ?? (running
    ? actions.length ? `Running step ${actions.length}` : 'Running'
    : `${actions.length} steps${total ? `, ${total.toFixed(1)}s` : ''}`);
  return (
    <div data-dm="" className={cx('dm-alg', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-alg-h">
        <span className="dm-alg-t">{title}</span>
        {running
          ? <span key="run" className="dm-alg-st"><Spin /><Swap className="dm-alg-sum">{words}</Swap></span>
          : <span key="done" className="dm-alg-st dm-enter"><Dot color="var(--dm-ok)" /><span>{words}</span></span>}
      </div>
      <ol className="dm-alg-list">{actions.map((a, i) => <Row key={i} action={a} />)}</ol>
    </div>
  );
}
