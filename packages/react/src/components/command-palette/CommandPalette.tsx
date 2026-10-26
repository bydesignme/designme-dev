'use client';
import { Fragment, useId, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Swap } from '../../lib/motion';
import '../../designme.css';
import './command-palette.css';

/** One command in the palette */
export interface CommandPaletteItem {
  /** The group it is listed under, like "Go to" */
  group: string;
  icon: IconName;
  /** What it does, like "Invite a teammate". Typing matches it letter by letter */
  label: string;
  /** Its shortcut, one key per entry, like ['⌘', 'J'] */
  keys?: string[];
}

export interface CommandPaletteProps {
  items: CommandPaletteItem[];
  /** What is typed in the box. Leave it out to let the box hold its own */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** Called when a command runs, by click or Enter */
  onRun?: (item: CommandPaletteItem) => void;
  /** Called with the typed text when the last row, "Ask the agent", runs */
  onAsk?: (query: string) => void;
  /** Called by Escape when the box is already empty */
  onClose?: () => void;
  placeholder?: string;
  /** The quiet text at the end of the footer. Defaults to what ran last */
  status?: string;
  /** Puts the cursor in the box when it appears */
  autoFocus?: boolean;
  className?: string;
}

// letters of the query, in order, anywhere in the label
const matches = (label: string, q: string) => {
  const l = label.toLowerCase(); let at = 0;
  for (const ch of q.toLowerCase()) { at = l.indexOf(ch, at); if (at < 0) return false; at++; }
  return true;
};
// every letter the query contains is marked, as on designme.dev
const marked = (label: string, q: string) => {
  if (!q) return label;
  const set = new Set(q.toLowerCase()), out: { t: string; m: boolean }[] = [];
  for (const ch of label) { const m = set.has(ch.toLowerCase()), last = out[out.length - 1]; if (last && !last.m && !m) last.t += ch; else out.push({ t: ch, m }); }
  return out.map((p, i) => p.m ? <mark key={i}>{p.t}</mark> : <Fragment key={i}>{p.t}</Fragment>);
};

/** Jump anywhere or hand a task to the agent from one box. Type to filter, arrows to move, Enter to run, Escape to clear. */
export function CommandPalette({ items, query, defaultQuery = '', onQueryChange, onRun, onAsk, onClose, placeholder = 'Search or ask the agent', status, autoFocus, className }: CommandPaletteProps) {
  const [q, setQ] = useControllable(query, defaultQuery, onQueryChange);
  const v = q.trim();
  const shown = items.filter(it => matches(it.label, v));
  const rows = v ? [...shown, null] : shown; // null is the "Ask the agent" row
  // the highlight goes back to the first row whenever the list changes
  const [hi, setHi] = useState({ at: 0, for: v });
  const at = hi.for === v ? Math.min(hi.at, Math.max(0, rows.length - 1)) : 0;
  const [ran, setRan] = useState('');

  const list = useRef<HTMLDivElement>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId(), reduce = useReducedMotion();
  const [top, setTop] = useState<{ for: string; px: number }>();
  useIsoLayoutEffect(() => {
    const b = btns.current[at], l = list.current; if (!b || !l) return;
    setTop({ for: v, px: b.offsetTop });
    if (b.offsetTop < l.scrollTop || b.offsetTop + 36 > l.scrollTop + l.clientHeight) l.scrollTo({ top: b.offsetTop - 40, behavior: reduce ? 'auto' : 'smooth' });
  }, [at, v, rows.length, reduce]);

  // while there is more list below, its last row fades out at the edge instead of being cut off by the footer
  const [more, setMore] = useState(false);
  const edge = () => { const l = list.current; if (l) setMore(l.scrollTop + l.clientHeight < l.scrollHeight - 2); };
  useIsoLayoutEffect(edge, [v, rows.length]);

  const move = (d: number) => { if (rows.length) setHi({ at: (at + d + rows.length) % rows.length, for: v }); };
  const run = (i: number) => {
    const row = rows[i], b = btns.current[i];
    if (row === undefined) return;
    if (row) { setRan('Ran: ' + row.label); onRun?.(row); } else { setRan('Sent to the agent'); onAsk?.(v); }
    b?.animate?.([{ transform: 'scale(1)' }, { transform: 'scale(.98)' }, { transform: 'scale(1)' }], { duration: 260, easing: 'ease-out' });
  };
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { move(1); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { move(-1); e.preventDefault(); }
    else if (e.key === 'Enter') run(at);
    else if (e.key === 'Escape') { if (q) setQ(''); else onClose?.(); }
  };

  let group = '';
  return (
    <div data-dm="" className={cx('dm-cpl dm-panel', className)}>
      <div className="dm-cpl-in">
        <Icon name="search" />
        {/* the box keeps the focus and points at the highlighted row, so the rows are not tab stops */}
        <input className="dm-cpl-q" placeholder={placeholder} aria-label="Command" spellCheck={false} autoFocus={autoFocus} value={q}
          role="combobox" aria-expanded aria-controls={`${id}-list`} aria-autocomplete="list" aria-activedescendant={rows.length ? `${id}-${at}` : undefined}
          onChange={e => setQ(e.target.value)} onKeyDown={key} />
        <span className="dm-kbd">esc</span>
      </div>
      <div className={cx('dm-cpl-list', more && 'dm-more')} role="listbox" id={`${id}-list`} aria-label="Commands" tabIndex={-1} ref={list} onScroll={edge}>
        {/* a new list starts the highlight afresh, so it jumps into place instead of sliding */}
        <span key={v} className="dm-cpl-hl" style={{ top: top?.for === v ? top.px : undefined }} />
        {rows.map((row, i) => {
          const head = row ? row.group : 'Ask';
          const g = head !== group ? <div className="dm-cpl-g">{(group = head)}</div> : null;
          return (
            <Fragment key={row ? row.group + row.label : '\u0000ask'}>
              {g}
              <button type="button" ref={el => { btns.current[i] = el; }} className={cx('dm-cpl-i', !row && 'dm-ask', i === at && 'dm-hl')}
                role="option" id={`${id}-${i}`} tabIndex={-1} aria-selected={i === at} onMouseEnter={() => setHi({ at: i, for: v })} onClick={() => run(i)}>
                <span className="dm-ic"><Icon name={row ? row.icon : 'up'} size="xs" /></span>
                <span className="dm-t">{row ? marked(row.label, v) : <>Ask the agent: “{v}”</>}</span>
                {row?.keys && <span className="dm-k">{row.keys.map((k, j) => <span key={j} className="dm-kbd">{k}</span>)}</span>}
              </button>
            </Fragment>
          );
        })}
      </div>
      <div className="dm-cpl-f dm-muted">
        <span><span className="dm-kbd">↑</span><span className="dm-kbd">↓</span> move</span>
        <span><span className="dm-kbd">↵</span> run</span>
        <Swap className="dm-cpl-st">{status ?? ran}</Swap>
      </div>
    </div>
  );
}
