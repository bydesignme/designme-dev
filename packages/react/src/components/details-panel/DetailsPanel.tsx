'use client';
import { useEffect, useRef, useState, type AnimationEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/cx';
import { useControllable, useCopied, useTween } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Avatar, Fold, Swap, Tip } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
import './details-panel.css';

export interface DetailsPanelOption {
  value: string;
  label: string;
  /** A quieter line under the label in the menu, like "Best for design" */
  detail?: string;
  /** A coloured dot before the label, like 'var(--dm-ok)' */
  color?: string;
  /** An avatar before the label instead of a dot */
  avatar?: { initials: string; color: string };
}

export type DetailsPanelTone = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';
export interface DetailsPanelTag { label: string; tone?: DetailsPanelTone }

export type DetailsPanelRow =
  /** A plain value, like a date or a duration */
  | { key: string; label: string; type?: 'text'; value: ReactNode }
  /** A value picked from a menu */
  | { key: string; label: string; type: 'select'; options: DetailsPanelOption[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void;
      /** Shows a chevron after the value. Defaults to true when the options have no dots or avatars */
      chevron?: boolean }
  /** A number that rolls to its new value, like tokens or cost */
  | { key: string; label: string; type: 'number'; value: number;
      /** Turns the number into text. Defaults to a rounded number with thousands separators */
      format?: (n: number) => string }
  /** Labels, with an optional button to add one */
  | { key: string; label: string; type: 'tags'; tags: DetailsPanelTag[]; onAdd?: () => void; addLabel?: string };

export interface DetailsPanelSection {
  key: string;
  title: string;
  rows: DetailsPanelRow[];
}

export interface DetailsPanelProps {
  /** The title at the top, like "Pricing page redesign" */
  title: string;
  /** A short type tag before the title, like "RUN" */
  kind?: string;
  /** Adds a copy button that copies this, like a run ID */
  copyValue?: string;
  /** The copy button's tooltip */
  copyLabel?: string;
  sections: DetailsPanelSection[];
  /** Keys of the open sections. Leave it out to let the headers toggle them; every section starts open */
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (open: string[]) => void;
  className?: string;
}

const TONE: Record<DetailsPanelTone, string> = { blue: 'dm-b', purple: 'dm-l', green: 'dm-m', orange: 'dm-p', red: 'dm-r', yellow: 'dm-y', pink: 'dm-k', teal: 'dm-t' };
const count = (n: number) => Math.round(n).toLocaleString('en-US');

/** Flashes the accent behind a value when it changes, but not when it first shows */
function useFlash(value: unknown) {
  const [flash, setFlash] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setFlash(false);
    const f = requestAnimationFrame(() => setFlash(true));
    return () => cancelAnimationFrame(f);
  }, [value]);
  // only its own flash: the avatar's entrance bubbles up here too
  return { flash, onAnimationEnd: (e: AnimationEvent) => { if (e.target === e.currentTarget) setFlash(false); } };
}

function Mark({ option, entering }: { option: DetailsPanelOption; entering?: boolean }) {
  if (option.avatar) return <Avatar key={option.value} initials={option.avatar.initials} color={option.avatar.color} className={entering ? 'dm-enter' : undefined} />;
  if (option.color) return <span className="dm-dot" style={{ color: option.color }} />;
  return null;
}

function SelectRow({ row, host }: { row: Extract<DetailsPanelRow, { type: 'select' }>; host: HTMLElement | null }) {
  const [value, setValue] = useControllable(row.value, row.defaultValue ?? row.options[0]?.value ?? '', row.onValueChange);
  const menu = usePopover();
  const picked = row.options.find(o => o.value === value) ?? row.options[0];
  const { flash, onAnimationEnd } = useFlash(value);
  const [changed, setChanged] = useState(false);
  const chevron = row.chevron ?? !row.options.some(o => o.color || o.avatar);
  if (!picked) return null;
  return (
    <>
      <button type="button" {...menu.trigger} className={cx('dm-dtp-v', flash && 'dm-flash')} onAnimationEnd={onAnimationEnd}>
        <Mark option={picked} entering={changed} />
        <Swap>{picked.label}</Swap>
        {chevron && <Icon name="chev-d" size="xs" />}
      </button>
      {/* the menus sit on the panel itself, so the folding sections can't clip them */}
      {host && createPortal(
        <div {...menu.pop} className={menu.pop.className} role="menu" aria-label={row.label}>
          {row.options.map(o => (
            <button type="button" key={o.value} className="dm-mi" role="menuitem"
              onClick={() => { if (o.value !== value) { setChanged(true); setValue(o.value); } menu.closeSoon(); }}>
              <Mark option={o} />
              {o.detail ? <span>{o.label}<span className="dm-d">{o.detail}</span></span> : <span>{o.label}</span>}
            </button>
          ))}
        </div>, host)}
    </>
  );
}

function NumberRow({ row }: { row: Extract<DetailsPanelRow, { type: 'number' }> }) {
  const shown = useTween(row.value, 800);
  return <span className="dm-dtp-v dm-num">{(row.format ?? count)(shown)}</span>;
}

function TagsRow({ row }: { row: Extract<DetailsPanelRow, { type: 'tags' }> }) {
  // tags that arrive after the panel appears come in with the entrance
  const [initial] = useState(() => new Set(row.tags.map(t => t.label)));
  return (
    <span className="dm-dtp-tags">
      {row.tags.map(t => <span key={t.label} className={cx('dm-tag', t.tone && TONE[t.tone], !initial.has(t.label) && 'dm-enter')}>{t.label}</span>)}
      {row.onAdd && <Tip label={row.addLabel ?? 'Add label'}>
        <button type="button" className="dm-dtp-add" aria-label={row.addLabel ?? 'Add label'} onClick={row.onAdd}><Icon name="plus" size="xs" /></button>
      </Tip>}
    </span>
  );
}

function Row({ row, host }: { row: DetailsPanelRow; host: HTMLElement | null }) {
  return (
    <div className="dm-dtp-r">
      <span className="dm-k">{row.label}</span>
      {row.type === 'select' ? <SelectRow row={row} host={host} />
        : row.type === 'number' ? <NumberRow row={row} />
        : row.type === 'tags' ? <TagsRow row={row} />
        : <span className="dm-dtp-v dm-num">{row.value}</span>}
    </div>
  );
}

/** A record's properties in folding sections, edited in place from small menus. */
export function DetailsPanel({ title, kind, copyValue, copyLabel = 'Copy run ID', sections, open, defaultOpen, onOpenChange, className }: DetailsPanelProps) {
  const [shown, setShown] = useControllable(open, defaultOpen ?? sections.map(s => s.key), onOpenChange);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [copied, copy] = useCopied();
  const toggle = (key: string) => setShown(shown.includes(key) ? shown.filter(k => k !== key) : [...shown, key]);

  return (
    <div data-dm="" ref={setHost} className={cx('dm-dtp dm-panel', className)}>
      <div className="dm-dtp-h">
        {kind && <span className="dm-ft">{kind}</span>}
        <b>{title}</b>
        {copyValue !== undefined && (
          <Tip label={copied ? 'Copied to clipboard' : copyLabel} open={copied || undefined}>
            <button type="button" className={cx('dm-ib dm-dtp-cp', copied && 'dm-copied')} aria-label={copyLabel} onClick={() => copy(copyValue)}>
              <Icon name={copied ? 'check' : 'link'} size="xs" />
            </button>
          </Tip>
        )}
      </div>
      {sections.map(s => {
        const isOpen = shown.includes(s.key);
        return (
          <div key={s.key} className="dm-dtp-sec">
            <button type="button" className="dm-dtp-sh" aria-expanded={isOpen} onClick={() => toggle(s.key)}>
              <Icon name="chev-r" size="xs" /><span>{s.title}</span>
            </button>
            <Fold open={isOpen}>
              <div className="dm-dtp-rows">{s.rows.map(r => <Row key={r.key} row={r} host={host} />)}</div>
            </Fold>
          </div>
        );
      })}
    </div>
  );
}
