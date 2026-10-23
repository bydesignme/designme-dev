'use client';
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Swap, Tip } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
import './filter-menu.css';

/** One value a field can be filtered by */
export interface FilterMenuOption {
  value: string;
  /** How the menu names it, like "Past 7 days" */
  label: string;
  /** How a chip names it, like "7 days". Defaults to the label */
  chip?: string;
  /** A dot, avatar or icon before the label in the menu */
  glyph?: ReactNode;
}

/** A field the menu can filter on, like Status, Owner or Updated */
export interface FilterMenuField {
  key: string;
  label: string;
  icon?: IconName;
  /** The two ways a filter on it reads, the second when it's flipped. Defaults to "is" and "is not" */
  operators?: [string, string];
  options: FilterMenuOption[];
}

/** A filter in use. `negate` reads it the other way: "is not", or the field's second operator */
export interface FilterMenuFilter {
  field: string;
  value: string;
  negate?: boolean;
}

/** A row in the results under the filters */
export interface FilterMenuResult {
  id: string;
  title: string;
  /** The colour of the dot before it, like 'var(--dm-pb)', and what it means, like "Open" */
  dot?: { color: string; label: string };
  avatar?: { initials: string; color: string; label: string };
  /** The quiet text at the end, like "Today" or "3d" */
  meta?: string;
}

export interface FilterMenuProps {
  fields: FilterMenuField[];
  /** The filters in use, in the order they were added; one per field. Leave it out to let the menu keep them */
  filters?: FilterMenuFilter[];
  defaultFilters?: FilterMenuFilter[];
  onFiltersChange?: (filters: FilterMenuFilter[]) => void;
  /** How many items there are, and how many match the filters */
  total: number;
  count: number;
  /** The items' name, like "issues" */
  noun?: string;
  /** The number beside a value in the menu: how many items picking it would leave. Left out, no numbers show */
  countFor?: (field: string, value: string) => number;
  /** The first few matches, shown under the count */
  results?: FilterMenuResult[];
  /** Shown when nothing matches. Defaults to "No issues match these filters" with your noun */
  emptyLabel?: string;
  /** Defaults to "Filter" and "Clear all" */
  label?: string;
  clearLabel?: string;
  /** Whether the menu is open. Leave it out to let the Filter button, Escape and a click outside open and close it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** A Filter button that adds filters from a two-step menu (a field, then its value), the filters as removable chips whose
    operator flips with a click, and the number of matches with Clear all. */
export function FilterMenu({
  fields, filters, defaultFilters = [], onFiltersChange, total, count, noun = 'issues', countFor, results = [], emptyLabel,
  label = 'Filter', clearLabel = 'Clear all', open, defaultOpen = false, onOpenChange, className
}: FilterMenuProps) {
  const [list, setList] = useControllable(filters, defaultFilters, onFiltersChange);
  const menu = usePopover({ side: 'down', open, defaultOpen, onOpenChange });
  const pop = menu.pop.ref, trigger = menu.trigger.ref;
  const root = useRef<HTMLDivElement>(null);
  // the field whose values the menu shows, or null for the list of fields
  const [field, setField] = useState<string | null>(null);
  const from = useRef<string | null>(null);
  const focusTo = useRef<'first' | 'last' | 'value' | 'field' | null>(null);
  // chips already on screen keep still when the list changes; only a new one pops in
  const seen = useRef(new Set<string>());
  useEffect(() => { seen.current = new Set(list.map(f => f.field)); }, [list]);

  const fieldOf = (k: string) => fields.find(f => f.key === k);
  const opsOf = (f?: FilterMenuField) => f?.operators ?? ['is', 'is not'];
  const optOf = (f: FilterMenuFilter) => fieldOf(f.field)?.options.find(o => o.value === f.value);
  const items = () => Array.from(pop.current?.querySelectorAll<HTMLElement>('[role="menu"]:not([hidden]) [role^="menuitem"]') ?? []);
  // the menu always opens on its list of fields
  useEffect(() => { if (!menu.open) setField(null); }, [menu.open]);
  // after opening, or moving between the two steps, the focus goes where the keys asked
  useEffect(() => {
    const to = focusTo.current; if (!menu.open || !to) return;
    focusTo.current = null;
    const all = items();
    const pick = to === 'last' ? all[all.length - 1] : to === 'value' ? (all.find(x => x.getAttribute('aria-checked') === 'true') ?? all[1]) : to === 'field' ? all.find(x => x.dataset.k === from.current) : all[0];
    (pick ?? all[0])?.focus();
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const inside = () => !!pop.current?.contains(document.activeElement);
  const step = (k: string | null) => { if (inside()) focusTo.current = k ? 'value' : 'field'; from.current = field; setField(k); };
  const apply = (k: string, value: string) => {
    const had = inside();
    setList(list.some(f => f.field === k) ? list.map(f => (f.field === k ? { field: k, value } : f)) : [...list, { field: k, value }]);
    if (had) trigger.current?.focus();
    menu.closeSoon();
  };
  const remove = (k: string, e: MouseEvent<HTMLButtonElement>) => {
    const chip = e.currentTarget.closest('.dm-flm-ch'), next = (chip?.nextElementSibling ?? chip?.previousElementSibling)?.querySelector<HTMLElement>('.dm-flm-x');
    const had = chip?.contains(document.activeElement);
    setList(list.filter(f => f.field !== k));
    if (had) setTimeout(() => (next ?? trigger.current)?.focus());
  };
  const onTrigger = (e: MouseEvent) => { if (!menu.open && e.nativeEvent.isTrusted) focusTo.current = 'first'; menu.trigger.onClick(); };
  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault(); focusTo.current = e.key === 'ArrowUp' ? 'last' : 'first';
    if (menu.open) { const all = items(); (focusTo.current === 'last' ? all[all.length - 1] : all[0])?.focus(); focusTo.current = null; } else menu.setOpen(true);
  };
  // inside the menu: the arrow keys move and wrap, Home and End jump to the ends, the right arrow opens a field's values and
  // the left arrow goes back, Tab leaves it (Escape is the popover's)
  const onMenuKey = (e: KeyboardEvent) => {
    const all = items(), i = all.indexOf(document.activeElement as HTMLElement);
    const go = ({ ArrowDown: all[(i + 1) % all.length], ArrowUp: all[(i - 1 + all.length) % all.length], Home: all[0], End: all[all.length - 1] } as Record<string, HTMLElement | undefined>)[e.key];
    if (go) { e.preventDefault(); go.focus(); }
    else if (e.key === 'ArrowRight' && !field && all[i]?.dataset.k) { e.preventDefault(); step(all[i].dataset.k!); }
    else if (e.key === 'ArrowLeft' && field) { e.preventDefault(); step(null); }
    else if (e.key === 'Tab') setTimeout(() => menu.close());
  };

  const cur = field ? fieldOf(field) : undefined, on = list.find(f => f.field === field);
  return (
    <div data-dm="" ref={root} className={cx('dm-flm dm-panel', className)}>
      <div className="dm-flm-bar">
        <button {...menu.trigger} onClick={onTrigger} onKeyDown={onTriggerKey} type="button" className="dm-pill dm-line dm-sm dm-flm-tr"><Icon name="filter" />{label}</button>
        <div className="dm-flm-chips" role="list" aria-label="Filters">
          {list.map(f => {
            const fd = fieldOf(f.field), o = optOf(f); if (!fd || !o) return null;
            const ops = opsOf(fd), op = ops[+!!f.negate], other = ops[+!f.negate], text = `${fd.label} ${op} ${o.chip ?? o.label}`;
            return (
              <div key={f.field} className={cx('dm-flm-ch', seen.current.has(f.field) && 'dm-seen')} role="listitem">
                <span className="dm-k">{fd.label}</span>
                <Tip label={`Change to ${other}`}>
                  <button type="button" className="dm-op" aria-label={`${text}: change to ${other}`} onClick={() => setList(list.map(x => (x.field === f.field ? { ...x, negate: !x.negate } : x)))}>{op}</button>
                </Tip>
                <span className="dm-v">{o.chip ?? o.label}</span>
                <Tip label="Remove filter">
                  <button type="button" className="dm-x dm-flm-x" aria-label={`Remove filter ${text}`} onClick={e => remove(f.field, e)}><Icon name="x" size="xs" /></button>
                </Tip>
              </div>
            );
          })}
        </div>
      </div>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-flm-pop')} onKeyDown={onMenuKey}>
        <div className="dm-flm-lv" role="menu" aria-label={`${label} by`} hidden={!!field}>
          <div className="dm-ph" role="none">{label} by</div>
          {fields.map(fd => {
            const f = list.find(x => x.field === fd.key), o = f && optOf(f);
            return (
              <button key={fd.key} type="button" className="dm-mi" role="menuitem" aria-haspopup="menu" tabIndex={-1} data-k={fd.key} onClick={() => step(fd.key)}>
                {fd.icon && <Icon name={fd.icon} />}<span>{fd.label}</span>
                <span className="dm-r">{o ? (f.negate ? opsOf(fd)[1] + ' ' : '') + (o.chip ?? o.label) : ''}</span><Icon name="chev-r" size="xs" />
              </button>
            );
          })}
        </div>
        <div className="dm-flm-lv" role="menu" aria-label={cur?.label} hidden={!field}>
          {cur && <>
            <button type="button" className="dm-mi dm-flm-bk" role="menuitem" tabIndex={-1} aria-label="Back to all fields" onClick={() => step(null)}><Icon name="chev-l" size="xs" /><span>{cur.label}</span></button>
            <div className="dm-sep" role="separator" />
            {cur.options.map(o => (
              <button key={o.value} type="button" className="dm-mi" role="menuitemradio" aria-checked={on?.value === o.value} tabIndex={-1} onClick={() => apply(cur.key, o.value)}>
                {o.glyph}<span>{o.label}</span>{countFor && <span className="dm-r dm-num">{countFor(cur.key, o.value)}</span>}<span className="dm-ck"><Icon name="check" size="xs" /></span>
              </button>
            ))}
          </>}
        </div>
      </div>
      <div className="dm-flm-sum">
        <span aria-live="polite"><Swap className="dm-flm-ct dm-num">{list.length ? `${count} of ${total} ${noun}` : `${total} ${noun}`}</Swap></span>
        {list.length > 0 && <button type="button" className="dm-pill dm-ghost dm-sm dm-flm-clr" onClick={e => { const had = e.currentTarget === document.activeElement; setList([]); if (had) trigger.current?.focus(); }}>{clearLabel}</button>}
      </div>
      <div className="dm-flm-list">
        {count === 0 ? <div className="dm-flm-e">{emptyLabel ?? `No ${noun} match these filters`}</div> : <>
          {results.map((t, i) => (
            <div key={t.id} className="dm-flm-r dm-enter" style={{ animationDelay: i * 50 + 'ms' }}>
              {t.dot ? <span className="dm-dot" style={{ color: t.dot.color }} role="img" aria-label={t.dot.label} /> : <span />}
              <span className="dm-t">{t.title}</span>
              {t.avatar ? <span className="dm-av" style={{ background: t.avatar.color }} role="img" aria-label={t.avatar.label}>{t.avatar.initials}</span> : <span />}
              <span className="dm-a">{t.meta}</span>
            </div>
          ))}
          {count > results.length && <div className="dm-flm-more">and {count - results.length} more</div>}
        </>}
      </div>
    </div>
  );
}
