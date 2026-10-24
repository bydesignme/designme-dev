'use client';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { enter, Fold } from '../../lib/motion';
import '../../designme.css';
import './search-input.css';

/** Something the box can find, like a Figma frame or a doc */
export interface SearchInputItem {
  icon: IconName;
  /** Its name. The part that matches the search is marked */
  label: string;
  /** Where it lives, like "Figma". A source filter keeps only the items whose source is its label */
  source: string;
}

/** A source you can narrow the search to by typing @ and its key, like @figma */
export interface SearchInputSource {
  key: string;
  /** Its name, like "Figma". It becomes the filter chip */
  label: string;
  icon: IconName;
}

export interface SearchInputProps {
  items: SearchInputItem[];
  /** Typing @ lists these, and picking one adds it as a filter chip */
  sources?: SearchInputSource[];
  /** Earlier searches, shown while the box is empty */
  recent?: string[];
  /** What is typed. Leave it out to let the box hold its own */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** The source filter, by label, or null. Backspace in an empty box removes it */
  scope?: string | null;
  defaultScope?: string | null;
  onScopeChange?: (scope: string | null) => void;
  /** Whether the box is lifted with its results open. Focus opens it and leaving closes it when you leave it out */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** An answer from the agent, shown above the results. Feed it as it grows and each new word fades in */
  answer?: string;
  /** Which items match the search. By default an item matches the whole search or any word longer than two letters */
  filter?: (item: SearchInputItem, search: string) => boolean;
  /** Called when a result is picked, by click or Enter */
  onSelect?: (item: SearchInputItem) => void;
  /** Called by Enter when no row is highlighted, with the search and the source filter */
  onSubmit?: (search: string, scope: string | null) => void;
  placeholder?: string;
  /** The key hint at the end of the empty box */
  shortcut?: string;
  /** What the list says when nothing matches */
  emptyLabel?: string;
  className?: string;
}

// words too common to match on, as on designme.dev
const STOP = ['why', 'did', 'the', 'how', 'what', 'does'];
const wordsOf = (search: string) => search.toLowerCase().split(/[^a-z0-9.]+/).filter(w => w.length > 2 && !STOP.includes(w));
const matchAny = (item: SearchInputItem, search: string) => {
  const l = item.label.toLowerCase();
  return !search || l.includes(search.toLowerCase()) || wordsOf(search).some(w => l.includes(w));
};
// marks the first place the word appears
const marked = (label: string, word: string): ReactNode => {
  const at = word ? label.toLowerCase().indexOf(word.toLowerCase()) : -1;
  return at < 0 ? label : <>{label.slice(0, at)}<mark>{label.slice(at, at + word.length)}</mark>{label.slice(at + word.length)}</>;
};

type Row = { kind: 'recent'; search: string } | { kind: 'source'; source: SearchInputSource } | { kind: 'item'; item: SearchInputItem };

const rowKey = (r: Row) => r.kind === 'item' ? 'i:' + r.item.label + '|' + r.item.source : r.kind === 'recent' ? 'r:' + r.search : 's:' + r.source.key;

/** Search with source filters, recent searches and an answer from the agent. Type @ to filter by source. */
export function SearchInput({ items, sources = [], recent = [], value, defaultValue = '', onValueChange, scope, defaultScope = null, onScopeChange,
  open, defaultOpen = false, onOpenChange, answer, filter = matchAny, onSelect, onSubmit, placeholder = 'Search frames, files and docs',
  shortcut = '⌘K', emptyLabel = 'No matches. Press Enter to ask the agent', className }: SearchInputProps) {
  const [text, setText] = useControllable(value, defaultValue, onValueChange);
  const [sc, setScope] = useControllable(scope, defaultScope, onScopeChange);
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const v = text.trim();
  const root = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null);
  const id = useId();

  // the results draw in again each time the box opens; while it stays open, only rows that weren't showing enter,
  // so typing doesn't restart the list, and the list eases to its new height
  const [opens, setOpens] = useState(0), [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) { setWasOpen(isOpen); if (isOpen) setOpens(opens + 1); }

  const at = /@\w*$/.test(v) && sources.length ? v.split('@').pop()!.toLowerCase() : null;
  const found = items.filter(it => (!sc || it.source === sc) && filter(it, v));
  const word = wordsOf(v).find(w => found.some(it => it.label.toLowerCase().includes(w))) || v;
  const mode = at !== null ? 'sources' : !v && !sc ? 'recent' : 'results';
  const rows: Row[] = mode === 'sources' ? sources.filter(s => s.key.startsWith(at!)).map(source => ({ kind: 'source', source }))
    : mode === 'recent' ? recent.map(search => ({ kind: 'recent', search }))
    : found.map(item => ({ kind: 'item', item }));
  const paint = `${opens}|${text}|${sc}`;
  const delays = useRef({ opens: -1, at: new Map<string, number>() });
  if (delays.current.opens !== opens) delays.current = { opens, at: new Map() };
  const shownKeys = new Set(rows.map(r => rowKey(r)));
  for (const k of [...delays.current.at.keys()]) if (!shownKeys.has(k)) delays.current.at.delete(k);
  let fresh = 0;
  const delayOf = (k: string) => { const at = delays.current.at; if (!at.has(k)) at.set(k, fresh++ * 25); return at.get(k)!; };
  const list = useRef<HTMLDivElement>(null), lastH = useRef(0), grow = useRef<Animation | null>(null), reduce = useReducedMotion();
  useIsoLayoutEffect(() => {
    const el = list.current; if (!el) { lastH.current = 0; return; }
    const from = grow.current?.playState === 'running' ? el.getBoundingClientRect().height : lastH.current;
    grow.current?.cancel(); grow.current = null;
    const to = el.getBoundingClientRect().height; lastH.current = to;
    if (!isOpen || !from || Math.abs(from - to) < 1 || reduce || !el.animate) return;
    grow.current = el.animate([{ height: from + 'px', boxSizing: 'border-box', overflow: 'hidden' }, { height: to + 'px', boxSizing: 'border-box', overflow: 'hidden' }], { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)' });
  });

  // the highlight only moves with the arrow keys, and starts afresh with each new list
  const [hi, setHi] = useState({ at: -1, for: paint });
  const cur = hi.for === paint && hi.at < rows.length ? hi.at : -1;

  // a click outside lowers the box, unless the cursor is still in it
  useEffect(() => {
    if (!isOpen) return;
    const down = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node) && document.activeElement !== input.current) setOpen(false); };
    document.addEventListener('pointerdown', down);
    return () => document.removeEventListener('pointerdown', down);
  }, [isOpen, setOpen]);

  const pick = (row: Row) => {
    if (row.kind === 'recent') setText(row.search);
    else if (row.kind === 'source') { setScope(row.source.label); setText(text.replace(/@\w*$/, '')); }
    else onSelect?.(row.item);
  };
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); if (!isOpen) setOpen(true);
      if (rows.length) setHi({ at: cur < 0 ? (e.key === 'ArrowDown' ? 0 : rows.length - 1) : (cur + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length, for: paint });
    } else if (e.key === 'Enter') { if (cur >= 0) pick(rows[cur]); else onSubmit?.(v, sc); }
    else if (e.key === 'Escape') { input.current?.blur(); setOpen(false); }
    else if (e.key === 'Backspace' && !text && sc) setScope(null);
  };
  // rows are picked on mousedown, so the cursor stays in the box
  const row = (r: Row, i: number, body: ReactNode) => {
    const k = rowKey(r), e = enter(delayOf(k));
    return (
      <button key={k} type="button" tabIndex={-1} id={`${id}-${i}`} role="option" aria-selected={i === cur} className={cx('dm-six-it', e.className, i === cur && 'dm-hl')} style={e.style}
        onMouseDown={ev => { ev.preventDefault(); pick(r); }}>{body}</button>
    );
  };

  const words = answer?.split(' ').filter(Boolean) ?? [];
  return (
    <div data-dm="" ref={root} className={cx('dm-six', className)}>
      <div className={cx('dm-six-box', isOpen && 'dm-f')}>
        <div className="dm-six-in">
          <Icon name="search" size="xs" />
          <span className="dm-six-chips">
            {sc && <span key={sc} className="dm-six-ch dm-enter">{sc}<button type="button" aria-label="Remove filter" onMouseDown={e => { e.preventDefault(); setScope(null); }}><Icon name="x" size="xs" /></button></span>}
          </span>
          <input ref={input} placeholder={placeholder} aria-label="Search" spellCheck={false} value={text} role="combobox" aria-expanded={isOpen}
            aria-controls={`${id}-list`} aria-autocomplete="list" aria-activedescendant={cur >= 0 ? `${id}-${cur}` : undefined}
            onChange={e => setText(e.target.value)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onKeyDown={key} />
          <span className="dm-kbd" hidden={!!v || !!sc}>{shortcut}</span>
          <button type="button" className="dm-ib dm-six-x" aria-label="Clear" hidden={!v && !sc} onMouseDown={e => { e.preventDefault(); setText(''); setScope(null); }}><Icon name="x" size="xs" /></button>
        </div>
        <Fold open={isOpen}>
          <div key={opens} ref={list} className="dm-six-res" id={`${id}-list`} role="listbox" aria-label="Results">
            {mode === 'sources' && <>
              <div className="dm-six-g">Filter by source</div>
              {rows.map((r, i) => r.kind === 'source' && row(r, i, <><span className="dm-ic"><Icon name={r.source.icon} size="xs" /></span>{r.source.label}<span className="dm-d">@{r.source.key}</span></>))}
            </>}
            {mode === 'recent' && !!rows.length && <>
              <div className="dm-six-g">Recent</div>
              {rows.map((r, i) => r.kind === 'recent' && row(r, i, <><span className="dm-ic"><Icon name="history" size="xs" /></span>{r.search}</>))}
            </>}
            {mode === 'results' && <>
              {answer !== undefined && <div className="dm-six-ans"><Icon name="spark" size="xs" /><span>{words.map((w, i) => <span key={i} className="dm-w">{w} </span>)}</span></div>}
              {rows.length ? <>
                <div className="dm-six-g">{rows.length} {rows.length === 1 ? 'result' : 'results'}</div>
                {rows.map((r, i) => r.kind === 'item' && row(r, i, <><span className="dm-ic"><Icon name={r.item.icon} size="xs" /></span><span>{marked(r.item.label, word)}</span><span className="dm-d">{r.item.source}</span></>))}
              </> : <div className="dm-six-g">{emptyLabel}</div>}
            </>}
          </div>
        </Fold>
      </div>
    </div>
  );
}
