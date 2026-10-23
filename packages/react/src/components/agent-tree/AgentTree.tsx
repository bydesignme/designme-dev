'use client';
import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useSeconds } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Fold, Spin, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './agent-tree.css';

export type AgentNodeStatus = 'queued' | 'running' | 'done' | 'failed';

export interface AgentNode {
  id: string;
  /** Like "Design agent", or a step's name */
  name: string;
  /** Its task, or what it is doing now. It crossfades when it changes */
  task: string;
  status: AgentNodeStatus;
  /** What this node spent on its own, in dollars. A branch shows this plus everything under it */
  cost?: number;
  /** A way out of a failed step, shown as a button under its task */
  fix?: { label: string; onClick: () => void };
  children?: AgentNode[];
}

export interface AgentTreeProps {
  /** The orchestrator, with its agents and their steps as children */
  root: AgentNode;
  /** The run's goal, like "Redesign the pricing page" */
  title: string;
  /** The line under the title. Defaults to "Running", "1 step failed" or "Done", then the clock */
  status?: string;
  /** Seconds to show as m:ss. Leave it out to let the clock count until the root is done */
  seconds?: number;
  /** Shown under the tree once the root is done. Defaults to "Done in 0:14 · 3 agents · $0.66"; false hides it */
  summary?: string | false;
  /** Ids of the folded branches. Leave it out to let each branch fold itself */
  collapsed?: string[];
  defaultCollapsed?: string[];
  onCollapsedChange?: (ids: string[]) => void;
  /** Writes a cost. Defaults to dollars and cents, like "$0.12" */
  formatCost?: (dollars: number) => string;
  className?: string;
}

const CLS: Record<AgentNodeStatus, string> = { queued: 'dm-queued', running: 'dm-run', done: 'dm-done', failed: 'dm-fail' };
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const total = (n: AgentNode): number => (n.cost ?? 0) + (n.children ?? []).reduce((a, k) => a + total(k), 0);
const branch = (n: AgentNode) => !!n.children?.length;

/** How many times `value` has changed since the first render, so a glyph can play its entrance on a change but not on mount */
function useChanges<T>(value: T) {
  const [seen, setSeen] = useState({ value, n: 0 });
  if (Object.is(seen.value, value)) return seen.n;
  setSeen({ value, n: seen.n + 1 });
  return seen.n + 1;
}

function Glyph({ status }: { status: AgentNodeStatus }) {
  const moved = useChanges(status) > 0;
  const e = moved ? enter() : undefined;
  return (
    <span key={status} className={cx('dm-atr-g', e?.className)} style={e?.style} aria-hidden="true">
      {status === 'running' ? <Spin /> : status === 'done' ? <Icon name="ok" size="xs" /> : status === 'failed' ? <Icon name="alert" size="xs" /> : <span className="dm-dot" />}
    </span>
  );
}

/** An orchestrator and its sub-agents as a tree. Each row shows its task, status and cost; a branch's cost rolls up
    everything under it, and branches fold. The arrow keys move through it as in any tree view. */
export function AgentTree({ root, title, status, seconds, summary, collapsed, defaultCollapsed = [], onCollapsedChange, formatCost, className }: AgentTreeProps) {
  const [shut, setShut] = useControllable(collapsed, defaultCollapsed, onCollapsedChange);
  const [focus, setFocus] = useState(root.id);
  const treeRef = useRef<HTMLDivElement>(null);
  const finished = root.status === 'done';
  const counted = useSeconds(seconds === undefined && !finished);
  const secs = seconds ?? counted;
  const money = formatCost ?? ((v: number) => '$' + v.toFixed(2));

  const all: { n: AgentNode; lv: number; parent?: AgentNode }[] = [];
  (function walk(n: AgentNode, lv: number, parent?: AgentNode) { all.push({ n, lv, parent }); n.children?.forEach(k => walk(k, lv + 1, n)); })(root, 0);
  const failed = all.filter(x => x.n.status === 'failed').length;
  const line = status ?? (finished ? 'Done' : failed ? `${failed} step${failed > 1 ? 's' : ''} failed` : 'Running');
  const agents = root.children?.length ?? 0;
  const done = summary === undefined ? `Done in ${clock(secs)} · ${agents} agent${agents === 1 ? '' : 's'} · ${money(total(root))}` : summary;

  const isOpen = (n: AgentNode) => !shut.includes(n.id);
  const toggle = (n: AgentNode, open = !isOpen(n)) => { if (branch(n)) setShut(open ? shut.filter(id => id !== n.id) : [...shut, n.id]); };
  // the rows a person can reach: everything not inside a folded branch
  const visible = all.filter(x => { for (let p = x.parent; p; p = all.find(y => y.n === p)?.parent) if (!isOpen(p)) return false; return true; });
  const go = (n?: AgentNode) => { if (!n) return; setFocus(n.id); treeRef.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(n.id)}"]`)?.focus({ preventScroll: true }); };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = visible.findIndex(x => x.n.id === focus); if (i < 0) return;
    const { n, parent } = visible[i], open = branch(n) && isOpen(n);
    if (e.key === 'ArrowDown') go(visible[i + 1]?.n);
    else if (e.key === 'ArrowUp') go(visible[i - 1]?.n);
    else if (e.key === 'ArrowRight') { if (branch(n) && !open) toggle(n, true); else if (open) go(n.children![0]); }
    else if (e.key === 'ArrowLeft') { if (open) toggle(n, false); else go(parent); }
    else if (e.key === 'Enter' || e.key === ' ') toggle(n);
    else if (e.key === 'Home') go(visible[0].n);
    else if (e.key === 'End') go(visible[visible.length - 1].n);
    else return;
    e.preventDefault();
  };

  const node = (n: AgentNode, lv: number): ReactNode => {
    const sum = total(n), own = n.cost ?? 0, k = n.children?.length ?? 0;
    const cost = <span className="dm-atr-c dm-num">{n.status === 'queued' && !sum ? '–' : money(branch(n) ? sum : own)}</span>;
    const fx = n.status === 'failed' && n.fix ? enter() : undefined;
    return (
      <div key={n.id} role="none" style={{ '--dm-lv': lv } as CSSProperties}>
        <div data-id={n.id} className={cx('dm-atr-n', CLS[n.status])} role="treeitem" aria-level={lv + 1} aria-expanded={branch(n) ? isOpen(n) : undefined}
          tabIndex={focus === n.id ? 0 : -1}
          onClick={e => { if ((e.target as Element).closest('.dm-atr-fix')) return; setFocus(n.id); toggle(n); }}>
          {branch(n) ? <span className="dm-atr-tg" aria-hidden="true"><Icon name="chev-d" size="xs" /></span> : <span className="dm-atr-sp" />}
          <Glyph status={n.status} />
          <span className="dm-atr-t">
            <b>{n.name}</b><Swap>{n.task}</Swap>
            {fx && <button type="button" className={cx('dm-pill dm-sm dm-atr-fix', fx.className)} style={fx.style} onClick={n.fix!.onClick}>{n.fix!.label}</button>}
          </span>
          {branch(n) ? <Tip label={`Its own ${money(own)}, ${k} ${lv ? (k > 1 ? 'steps' : 'step') : (k > 1 ? 'agents' : 'agent')} ${money(sum - own)}`}>{cost}</Tip> : cost}
        </div>
        {branch(n) && (
          <Fold open={isOpen(n)} className="dm-atr-kids">
            <div role="group">{n.children!.map(c => node(c, lv + 1))}</div>
          </Fold>
        )}
      </div>
    );
  };

  const sum = finished && done !== false ? enter() : undefined;
  return (
    <div data-dm="" className={cx('dm-atr dm-panel', className)}>
      <div className="dm-atr-h">
        <div className="dm-atr-ht"><b>{title}</b><span className="dm-muted dm-atr-st"><span aria-live="polite"><Swap>{line}</Swap></span> · <span className="dm-num">{clock(secs)}</span></span></div>
        <span className="dm-atr-tot dm-num">{money(total(root))}</span>
      </div>
      <div ref={treeRef} className="dm-atr-tree" role="tree" aria-label="Agents" onKeyDown={onKey}>{node(root, 0)}</div>
      {sum && <div className={cx('dm-atr-sum', sum.className)} style={sum.style}><Icon name="ok" size="xs" /><span>{done}</span></div>}
    </div>
  );
}
