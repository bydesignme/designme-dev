'use client';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import '../../designme.css';
import './multi-select.css';

export interface MultiSelectOption {
  value: string;
  /** Defaults to the value */
  label?: string;
  /** Quiet text at the end of the row, like how many files carry the tag */
  meta?: string;
}

export interface MultiSelectProps {
  /** Like "Tags" */
  label: string;
  options: MultiSelectOption[];
  /** What's picked, in the order it was picked */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** What's typed in the box. It filters the list */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Defaults to "Add a tag" */
  placeholder?: string;
  /** The quiet line under the box. Defaults to "Type to filter. Backspace removes the last tag." */
  hint?: string;
  /** Shown when nothing matches. Defaults to "No tags match" */
  empty?: string;
  /** The button beside the label that takes every pick off, shown while something is picked. Defaults to "Clear all" */
  clearLabel?: string;
  className?: string;
}

/** A combobox that keeps what you pick as chips. Typing filters the list, the arrow keys move through it, Enter picks
    or unpicks, Escape closes it, and Backspace in an empty box takes the last chip off. */
export function MultiSelect({ label, options, value, defaultValue = [], onValueChange, query, defaultQuery = '', onQueryChange, open, defaultOpen = false, onOpenChange,
  placeholder = 'Add a tag', hint = 'Type to filter. Backspace removes the last tag.', empty = 'No tags match', clearLabel = 'Clear all', className }: MultiSelectProps) {
  const id = 'dm-msc' + useId().replace(/:/g, '');
  const [picked, setPicked] = useControllable(value, defaultValue, onValueChange);
  const [q, setQ] = useControllable(query, defaultQuery, onQueryChange);
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [hi, setHi] = useState(0);
  // typing (or a new query from outside) starts the highlight at the first match again
  const [seenQ, setSeenQ] = useState(q);
  if (seenQ !== q) { setSeenQ(q); if (q) setHi(0); }
  const field = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null), list = useRef<HTMLDivElement>(null), root = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(76);
  const name = (v: string) => options.find(o => o.value === v)?.label ?? v;
  const shown = options.filter(o => !q.trim() || (o.label ?? o.value).toLowerCase().includes(q.trim().toLowerCase()));
  const at = Math.min(hi, Math.max(0, shown.length - 1));

  // the list sits under the box, which grows as the chips wrap
  useIsoLayoutEffect(() => { const f = field.current; if (f) setTop(f.offsetTop + f.offsetHeight + 6); }, [picked.length, isOpen]);
  // the highlighted row stays in view
  useEffect(() => { const o = list.current?.querySelector<HTMLElement>(`#${id}-o${at}`), l = list.current; if (!o || !l) return;
    if (o.offsetTop < l.scrollTop) l.scrollTop = o.offsetTop; else if (o.offsetTop + o.offsetHeight > l.scrollTop + l.clientHeight) l.scrollTop = o.offsetTop + o.offsetHeight - l.clientHeight; }, [at, id, isOpen]);
  // a click outside closes it
  useEffect(() => {
    if (!isOpen) return;
    const off = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', off); return () => document.removeEventListener('pointerdown', off);
  }, [isOpen, setOpen]);

  const toggle = (v: string) => {
    setPicked(picked.includes(v) ? picked.filter(x => x !== v) : [...picked, v]);
    setQ(''); setHi(Math.max(0, options.findIndex(o => o.value === v)));
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) { setOpen(true); setHi(0); return; }
      if (shown.length) setHi((at + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length);
    }
    else if (e.key === 'Enter') { e.preventDefault(); if (isOpen && shown[at]) toggle(shown[at].value); else setOpen(true); }
    else if (e.key === 'Escape') { if (isOpen) { e.preventDefault(); setOpen(false); } }
    else if (e.key === 'Backspace' && !q && picked.length) setPicked(picked.slice(0, -1));
    else if (e.key === 'Tab') setOpen(false);
  };

  return (
    <div ref={root} data-dm="" className={cx('dm-msc', className)}>
      {/* Clear all takes every chip off at once; the cursor goes back to the box, so the next tag can be typed straight away */}
      <div className="dm-msc-top">
        <label className="dm-msc-l" htmlFor={`${id}-q`}>{label}</label>
        {picked.length > 0 && <button type="button" className="dm-msc-clr" onMouseDown={e => e.preventDefault()} onClick={() => { setPicked([]); input.current?.focus(); }}>{clearLabel}</button>}
      </div>
      <div ref={field} className="dm-msc-f" onClick={e => { if ((e.target as Element).closest('.dm-msc-c')) return; input.current?.focus(); setOpen(true); }}>
        {picked.map(v => (
          <span key={v} className="dm-msc-c">{name(v)}
            <button type="button" aria-label={`Remove ${name(v)}`} onClick={e => { e.stopPropagation(); setPicked(picked.filter(x => x !== v)); }}><Icon name="x" size="xs" /></button>
          </span>
        ))}
        <input ref={input} id={`${id}-q`} className="dm-msc-q" role="combobox" aria-expanded={isOpen} aria-controls={`${id}-l`} aria-autocomplete="list" aria-haspopup="listbox"
          aria-activedescendant={isOpen && shown.length ? `${id}-o${at}` : undefined} value={q} placeholder={placeholder} spellCheck={false} autoComplete="off"
          onChange={e => { setQ(e.target.value); setHi(0); setOpen(true); }} onKeyDown={onKey} />
      </div>
      <div className={cx('dm-msc-pop', isOpen && 'dm-open')} style={{ top }}>
        <div ref={list} id={`${id}-l`} className="dm-msc-list" role="listbox" aria-multiselectable="true" aria-label={label}>
          {shown.length ? shown.map((o, i) => (
            <div key={o.value} id={`${id}-o${i}`} role="option" aria-selected={picked.includes(o.value)} className={cx('dm-msc-o', i === at && 'dm-hl')}
              onMouseMove={() => { if (i !== at) setHi(i); }} onMouseDown={e => e.preventDefault()} onClick={() => toggle(o.value)}>
              <span className="dm-bx"><Icon name="check" size="xs" /></span>{o.label ?? o.value}{o.meta && <span className="dm-n dm-num">{o.meta}</span>}
            </div>
          )) : <div className="dm-msc-none">{empty}</div>}
        </div>
      </div>
      {hint && <span className="dm-muted dm-msc-h">{hint}</span>}
    </div>
  );
}
