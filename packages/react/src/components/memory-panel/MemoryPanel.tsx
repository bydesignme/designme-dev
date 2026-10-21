'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Dot, Seg, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './memory-panel.css';

/** A group of memories, with its own filter tab and dot colour */
export interface MemoryKind {
  value: string;
  /** Its tab, like "Brand" */
  label: string;
  /** The dot before its memories, like 'var(--dm-pb)' */
  color: string;
}

/** Something the agent remembers */
export interface MemoryItem {
  id: string | number;
  /** Which kind it is, by value */
  kind: string;
  /** What it remembers, like "Headlines stay under eight words" */
  text: string;
  /** Where it came from, like "You told the agent, Aug 30" */
  source?: string;
  /** Highlights it as just learned */
  isNew?: boolean;
}

export interface MemoryPanelProps {
  /** Like "Team memory" */
  title?: ReactNode;
  icon?: IconName;
  kinds: MemoryKind[];
  /** Every memory, newest first. Leave it out to let Edit and Forget keep their own list */
  memories?: MemoryItem[];
  defaultMemories?: MemoryItem[];
  onMemoriesChange?: (memories: MemoryItem[]) => void;
  /** The tab that is showing: 'all' or a kind's value */
  filter?: string;
  defaultFilter?: string;
  onFilterChange?: (filter: string) => void;
  /** The first tab */
  allLabel?: string;
  /** The line under the title, like "7 memories" */
  countLabel?: (count: number) => string;
  /** The source an edited memory gets */
  editedSource?: string;
  /** Called with the memory after an edit */
  onEdit?: (memory: MemoryItem) => void;
  /** Called when a memory is forgotten. It can still come back with Undo for `undoFor` ms */
  onForget?: (memory: MemoryItem) => void;
  /** Called when Undo brings a forgotten memory back */
  onRestore?: (memory: MemoryItem) => void;
  /** How long Undo stays, in ms */
  undoFor?: number;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

interface Gone { m: MemoryItem; at: number; leaving: boolean }

const plural = (n: number) => `${n} ${n === 1 ? 'memory' : 'memories'}`;

/** What the agent remembers about the team, filtered by kind, each memory editable in place or forgotten with an undo. */
export function MemoryPanel({
  title = 'Team memory', icon = 'book', kinds, memories, defaultMemories = [], onMemoriesChange, filter, defaultFilter = 'all', onFilterChange,
  allLabel = 'All', countLabel = plural, editedSource = 'Edited by you, just now', onEdit, onForget, onRestore, undoFor = 4000, bare = true, className
}: MemoryPanelProps) {
  const [list, setList] = useControllable(memories, defaultMemories, onMemoriesChange);
  const [f, setF] = useControllable(filter, defaultFilter, onFilterChange);
  const [gone, setGone] = useState<Gone[]>([]);
  const [editing, setEditing] = useState<MemoryItem['id'] | null>(null);
  const timers = useRef(new Map<MemoryItem['id'], ReturnType<typeof setTimeout>>());
  const edit = useRef<HTMLSpanElement>(null);
  const colour = (kind: string) => kinds.find(k => k.value === kind)?.color ?? 'var(--dm-faint)';

  // a new tab repaints the list: the rows stagger in again and any Undo goes away
  const [paint, setPaint] = useState(0);
  const order = useRef(new Map<MemoryItem['id'], number>());
  const first = useRef(true);
  useIsoLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    timers.current.forEach(clearTimeout); timers.current.clear();
    order.current.clear(); setGone([]); setPaint(p => p + 1);
  }, [f]);
  useEffect(() => { const t = timers.current; return () => t.forEach(clearTimeout); }, []);

  // editing starts with the caret at the end of the text
  useIsoLayoutEffect(() => {
    const t = edit.current; if (editing === null || !t) return;
    t.focus();
    const s = document.getSelection(); s?.selectAllChildren(t); s?.collapseToEnd();
  }, [editing]);

  const commit = (m: MemoryItem, text: string) => {
    const next = { ...m, text: text.trim() || m.text, source: editedSource };
    setEditing(null);
    setList(list.map(x => (x.id === m.id ? next : x)));
    onEdit?.(next);
  };
  const forget = (m: MemoryItem) => {
    const at = list.indexOf(m);
    setList(list.filter(x => x !== m)); onForget?.(m);
    order.current.delete(m.id);
    setGone(g => [...g, { m, at, leaving: false }]);
    timers.current.set(m.id, setTimeout(() => {
      setGone(g => g.map(x => (x.m === m ? { ...x, leaving: true } : x)));
      timers.current.set(m.id, setTimeout(() => { setGone(g => g.filter(x => x.m !== m)); timers.current.delete(m.id); }, 320));
    }, undoFor));
  };
  const restore = (g: Gone) => {
    clearTimeout(timers.current.get(g.m.id)); timers.current.delete(g.m.id);
    setGone(x => x.filter(y => y !== g));
    const next = [...list]; next.splice(Math.min(g.at, next.length), 0, g.m);
    setList(next); onRestore?.(g.m);
  };

  // forgotten memories hold their place with an Undo until it times out
  const rows: ({ m: MemoryItem; g?: undefined } | { g: Gone; m?: undefined })[] = list.map(m => ({ m }));
  for (const g of gone) rows.splice(Math.min(g.at, rows.length), 0, { g });
  const shown = rows.filter(r => f === 'all' || (r.m ?? r.g.m).kind === f);
  // rows that were there when the tab painted stagger in; anything that arrives later comes in on its own
  if (!order.current.size) shown.forEach((r, i) => { if (r.m) order.current.set(r.m.id, i); });
  const delay = (id: MemoryItem['id']) => (order.current.get(id) ?? 0) * 40 + 'ms';
  // a memory the agent learns while the panel is open opens its own height, so the panel grows instead of jumping
  const reduce = useReducedMotion(), grown = useRef(new WeakSet<HTMLElement>());
  const grow = (el: HTMLDivElement | null) => {
    if (!el || grown.current.has(el)) return; grown.current.add(el);
    if (reduce || !el.animate) return;
    const cs = getComputedStyle(el), ease = cs.getPropertyValue('--dm-ease').trim() || 'ease';
    el.animate([{ height: '0px', paddingTop: '0px', paddingBottom: '0px', opacity: 0, filter: 'blur(4px)', overflow: 'hidden' },
      { height: cs.height, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, opacity: 1, filter: 'blur(0px)', overflow: 'hidden' }], { duration: 560, easing: ease });
  };

  return (
    <div data-dm="" className={cx('dm-mmx', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-mmx-h">
        <span className="dm-mmx-ic"><Icon name={icon} /></span>
        <div className="dm-mmx-ht"><b>{title}</b><Swap className="dm-muted dm-mmx-st">{countLabel(list.length)}</Swap></div>
        <div className="dm-mmx-tab" style={{ display: 'flex' }}>
          <Seg label="Filter" value={f} onChange={setF} options={[{ value: 'all', label: allLabel }, ...kinds.map(k => ({ value: k.value, label: k.label }))]} />
        </div>
      </div>
      <div className="dm-mmx-list">
        {shown.map(r => {
          if (r.g) {
            const { m, leaving } = r.g;
            return (
              <div key={`${paint}-gone-${m.id}`} className={cx('dm-mmx-gone', leaving ? 'dm-leave' : 'dm-enter')}>
                <span>Forgot “{m.text.slice(0, 32)}{m.text.length > 32 ? '…' : ''}”</span>
                <button type="button" onClick={() => restore(r.g)}>Undo</button>
              </div>
            );
          }
          const m = r.m, arriving = !!m.isNew && !order.current.has(m.id);
          return (
            <div key={`${paint}-${m.id}`} ref={arriving ? grow : undefined} className={cx('dm-mmx-m', !arriving && 'dm-enter', m.isNew && 'dm-new')} style={arriving ? undefined : { animationDelay: delay(m.id) }}>
              <Dot color={colour(m.kind)} />
              {editing === m.id
                ? <span key="edit" ref={edit} className="dm-t" spellCheck={false} contentEditable suppressContentEditableWarning
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
                    onBlur={e => commit(m, e.currentTarget.textContent ?? '')}>{m.text}</span>
                : <span key="view" className="dm-t" spellCheck={false}>{m.text}{m.source && <span className="dm-src">{m.source}</span>}</span>}
              <span className="dm-acts">
                <Tip label="Edit"><button type="button" className="dm-ib" aria-label="Edit" onClick={() => setEditing(m.id)}><Icon name="edit" size="xs" /></button></Tip>
                <Tip label="Forget"><button type="button" className="dm-ib" aria-label="Forget" onClick={() => forget(m)}><Icon name="trash" size="xs" /></button></Tip>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
