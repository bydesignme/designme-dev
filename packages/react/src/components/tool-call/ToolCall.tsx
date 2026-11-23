'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { enter, Fold, Swap } from '../../lib/motion';
import '../../designme.css';
import './tool-call.css';

/** Any value a tool takes or returns */
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export interface ToolCallItem {
  key: string;
  /** The tool's server or namespace, like "billing" */
  server?: string;
  /** The tool's name, like "list_plan_changes" */
  name: string;
  /** The icon in front of the call */
  icon?: IconName;
  /** queued waits, running spins, done shows the time it took and the output */
  state: 'queued' | 'running' | 'done';
  /** How long it took, like "412 ms". Shown once it is done */
  duration?: string;
  /** What the agent sent, shown as highlighted JSON */
  input?: Json;
  /** What came back, shown once it is done */
  output?: Json;
}

export interface ToolCallProps {
  /** The agent's message before the calls */
  message?: ReactNode;
  calls: ToolCallItem[];
  /** The agent's answer after the calls. It fades in once every call is done */
  reply?: ReactNode;
  /** Keys of the calls that are open. Leave it out to let each call toggle itself */
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (open: string[]) => void;
  className?: string;
}

/** JSON on one line per object, each array item on its own line, keys, strings and numbers in their own colours */
function JsonView({ value, depth = 0 }: { value: Json; depth?: number }): ReactNode {
  if (typeof value === 'string') return <span className="dm-s">"{value}"</span>;
  if (typeof value === 'number') return <span className="dm-n">{value}</span>;
  if (value === null || typeof value === 'boolean') return <span className="dm-k">{String(value)}</span>;
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    const pad = '\n' + '  '.repeat(depth + 1);
    return <>[ {value.map((v, i) => <span key={i}>{i ? ',' + pad : ''}<JsonView value={v} depth={depth + 1} /></span>)} ]</>;
  }
  const keys = Object.keys(value);
  if (!keys.length) return '{}';
  return <>{'{ '}{keys.map((k, i) => <span key={k}>{i ? ', ' : ''}<span className="dm-k">"{k}"</span>: <JsonView value={value[k]} depth={depth} /></span>)}{' }'}</>;
}

function Call({ call, open, onToggle, index }: { call: ToolCallItem; open: boolean; onToggle: () => void; index: number }) {
  const { state } = call;
  return (
    <div className={cx('dm-tcx-c dm-enter', open && 'dm-open')} style={enter(200 + index * 90).style}>
      <button type="button" className="dm-tcx-h" aria-expanded={open} onClick={onToggle}>
        <span className="dm-tcx-ic">{state === 'running' ? <span className="dm-radar" style={{ color: 'var(--dm-fg)' }} /> : <Icon name={call.icon ?? 'code'} size="xs" />}</span>
        <span className="dm-tcx-n">{call.server && <span>{call.server}.</span>}<b>{call.name}</b></span>
        <span className="dm-tcx-ms">
          <Swap>{state === 'done' ? call.duration ?? 'Done' : state === 'running' ? 'Running' : 'Queued'}</Swap>
          <span>{state === 'running'
            ? <span className="dm-spin" style={{ width: 10, height: 10 }} />
            : state === 'done' ? <span style={{ color: 'var(--dm-ok)' }}><Icon name="check" size="xs" /></span> : null}</span>
        </span>
        <Icon name="chev-d" size="xs" className="dm-tcx-chev" />
      </button>
      <Fold open={open}>
        <div className="dm-tcx-io">
          <div><div className="dm-tcx-l">Input</div><pre>{call.input === undefined ? '' : <JsonView value={call.input} />}</pre></div>
          <div><div className="dm-tcx-l">Output</div><pre>{state === 'done' && call.output !== undefined ? <JsonView value={call.output} /> : 'Waiting…'}</pre></div>
        </div>
      </Fold>
    </div>
  );
}

/** The tools an agent calls, with what went in and what came back, between its message and its answer. */
export function ToolCall({ message, calls, reply, open, defaultOpen = [], onOpenChange, className }: ToolCallProps) {
  const [openKeys, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const done = calls.length > 0 && calls.every(c => c.state === 'done');
  // the answer is laid out from the start and fades in a frame after the last call finishes
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!done) { setShown(false); return; }
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, [done]);
  const toggle = (key: string) => setOpen(openKeys.includes(key) ? openKeys.filter(k => k !== key) : [...openKeys, key]);

  return (
    <div data-dm="" className={cx('dm-tcx', className)}>
      {message && <p className="dm-msg">{message}</p>}
      <div className="dm-tcx-calls">
        {calls.map((c, i) => <Call key={c.key} call={c} index={i} open={openKeys.includes(c.key)} onToggle={() => toggle(c.key)} />)}
      </div>
      {reply && <p className={cx('dm-msg dm-tcx-end', shown && 'dm-in')} aria-hidden={!shown}>{reply}</p>}
    </div>
  );
}
