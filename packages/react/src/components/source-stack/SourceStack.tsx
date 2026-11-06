'use client';
import { useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Fold, Tip } from '../../lib/motion';
import '../../designme.css';
import './source-stack.css';

export interface StackSource {
  /** What kind of source it is. The filter chips pick by this, like 'web', 'file' or 'figma' */
  kind: string;
  title: string;
  /** Where it came from, like "baymard.com" or "Drive" */
  host: string;
  /** 0 to 1, drawn as a small bar */
  relevance: number;
  /** One to three letters in the favicon square, like "B" or "CSV" */
  mark: string;
  /** The favicon colour, any CSS colour, like '#635bff' or 'var(--dm-pl)' */
  color: string;
  /** Adds an open button that shows on hover */
  onOpen?: () => void;
}

export interface SourceFilter {
  /** 'all', or a source kind */
  value: string;
  label: string;
}

export interface SourceStackProps {
  /** The answer the sources back up, shown above the pill */
  children?: ReactNode;
  sources: StackSource[];
  /** The chips above the list. Defaults to All, Web, Files and Figma */
  filters?: SourceFilter[];
  /** The chosen filter. Leave it out to let the chips switch it */
  filter?: string;
  defaultFilter?: string;
  onFilterChange?: (filter: string) => void;
  /** Whether the list is open. Leave it out to let the pill toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const FILTERS: SourceFilter[] = [{ value: 'all', label: 'All' }, { value: 'web', label: 'Web' }, { value: 'file', label: 'Files' }, { value: 'figma', label: 'Figma' }];

/** An answer with its sources stacked in a pill. Open it to see each source, filter them, and how much each one counted. */
export function SourceStack({ children, sources, filters = FILTERS, filter, defaultFilter = 'all', onFilterChange, open, defaultOpen = false, onOpenChange, className }: SourceStackProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [f, setF] = useControllable(filter, defaultFilter, onFilterChange);
  // the list staggers in again each time it opens
  const [opened, setOpened] = useState(0);
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) { setWasOpen(isOpen); if (isOpen) setOpened(n => n + 1); }
  const items = sources.filter(s => f === 'all' || s.kind === f);

  return (
    <div data-dm="" className={cx('dm-ssx', className)}>
      {children !== undefined && <p className="dm-msg">{children}</p>}
      <button type="button" className="dm-ssx-pill" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
        <span className="dm-ssx-ics">{sources.slice(0, 4).map((s, i) => <span key={i} style={{ background: s.color }}>{s.mark[0]}</span>)}</span>
        <span className="dm-ssx-l">{sources.length} {sources.length === 1 ? 'source' : 'sources'}</span>
        <Icon name="chev-d" size="xs" />
      </button>
      <Fold open={isOpen} className="dm-ssx-box">
        <div className="dm-ssx-in">
          <div className="dm-ssx-fl">
            {filters.map(x => <button key={x.value} type="button" className={cx('dm-chip dm-sm', x.value === f && 'dm-on')} aria-pressed={x.value === f} onClick={() => setF(x.value)}>{x.label}</button>)}
          </div>
          <div className="dm-ssx-list" key={f + ':' + opened}>
            {items.map((s, i) => {
              const e = enter(i * 40), pct = Math.round(Math.max(0, Math.min(1, s.relevance)) * 100);
              return (
                <div key={s.title + i} className={cx('dm-ssx-s', e.className)} style={e.style}>
                  <span className="dm-fv" style={{ background: `color-mix(in srgb,${s.color} 14%,transparent)`, color: s.color }}>{s.mark}</span>
                  <span className="dm-t">{s.title}<span className="dm-h"> · {s.host}</span></span>
                  <Tip label={`Relevance ${pct}%`}><span className="dm-rel" role="meter" aria-label="Relevance" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><i style={{ width: pct + '%' }} /></span></Tip>
                  {s.onOpen && <Tip label="Open"><button type="button" className="dm-ib" aria-label="Open source" onClick={s.onOpen}><Icon name="ext" size="xs" /></button></Tip>}
                </div>
              );
            })}
          </div>
        </div>
      </Fold>
    </div>
  );
}
