'use client';
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Avatar, enter, Tip, useGrow } from '../../lib/motion';
import { useHoverGlide } from '../../lib/glide';
import '../../designme.css';
import './notifications.css';

export interface NotificationsItem {
  id: string;
  /** Which filter it belongs to, like 'agent' or 'mention' */
  kind: string;
  /** What happened. Wrap the subject in <b>, like <><b>Pricing audit</b> finished</> */
  text: ReactNode;
  /** Like "4 min ago" */
  time: string;
  /** An icon on a tinted tile, for things the agent did */
  icon?: IconName;
  /** What the icon's tile says: 'ok' (green), 'warn' (amber), 'bad' (red), 'accent' or 'neutral' (grey), each its status's
      tint with its icon in the status's text colour. neutral by default */
  tone?: 'ok' | 'warn' | 'bad' | 'accent' | 'neutral';
  /** A colour of your own for the icon instead of a tone, like 'var(--dm-pl)', on a tint of itself */
  color?: string;
  /** An avatar instead of an icon, for people */
  avatar?: { initials: string; color: string };
  read?: boolean;
}

export interface NotificationsFilter {
  /** 'all' shows everything; anything else shows the items of that kind */
  value: string;
  label: string;
}

export interface NotificationsProps {
  /** Newest first. A new id at the top drops in and bumps the count */
  items?: NotificationsItem[];
  defaultItems?: NotificationsItem[];
  /** Called when items are read or unread, one at a time or all at once */
  onItemsChange?: (items: NotificationsItem[]) => void;
  /** Called when an item is clicked, after it is marked read: open what it is about here */
  onOpen?: (item: NotificationsItem) => void;
  filters?: NotificationsFilter[];
  /** The open filter. Leave it out to let the tabs change it */
  filter?: string;
  defaultFilter?: string;
  onFilterChange?: (filter: string) => void;
  title?: string;
  markAllLabel?: string;
  emptyLabel?: string;
  /** The muted line under emptyLabel */
  emptyDetail?: string;
  /** The row action on a read item, "Mark as unread" by default */
  markUnreadLabel?: string;
  className?: string;
}

const FILTERS: NotificationsFilter[] = [{ value: 'all', label: 'All' }, { value: 'agent', label: 'Agent' }, { value: 'mention', label: 'Mentions' }];

/** An inbox where agent updates and mentions arrive live, under filter tabs. Click one to open it and mark it read; Mark as unread is on the row. */
export function Notifications({ items, defaultItems = [], onItemsChange, onOpen, filters = FILTERS, filter, defaultFilter = 'all', onFilterChange, title = 'Inbox', markAllLabel = 'Mark all read', emptyLabel = 'Nothing here yet', emptyDetail = 'New updates and mentions show up here', markUnreadLabel = 'Mark as unread', className }: NotificationsProps) {
  const [list, setList] = useControllable(items, defaultItems, onItemsChange);
  const [cur, setCur] = useControllable(filter, defaultFilter, onFilterChange);
  const shown = list.filter(x => cur === 'all' || x.kind === cur);
  const unread = list.filter(x => !x.read).length;

  // the rows painted together (on first show and on each filter) stagger in; ones that arrive later drop in on their own
  const [paint, setPaint] = useState(() => ({ filter: cur, ids: shown.map(x => x.id) }));
  if (paint.filter !== cur) setPaint({ filter: cur, ids: shown.map(x => x.id) });
  // a new item bumps the count
  const [known, setKnown] = useState(() => new Set(list.map(x => x.id)));
  const [bump, setBump] = useState(0);
  const fresh = list.filter(x => !known.has(x.id));
  if (fresh.length) { setKnown(new Set([...known, ...fresh.map(x => x.id)])); setBump(b => b + 1); }

  // Mark all read clears the dots one row after another
  const [pending, setPending] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const markAll = () => {
    const rows = shown.filter(x => !x.read).map(x => x.id);
    setPending(rows);
    rows.forEach((id, i) => timers.current.push(setTimeout(() => setPending(p => p.filter(x => x !== id)), i * 50)));
    setList(list.map(x => (x.read ? x : { ...x, read: true })));
  };
  const setRead = (id: string, read: boolean) => { if (list.some(x => x.id === id && !!x.read !== read)) setList(list.map(x => (x.id === id ? { ...x, read } : x))); };
  const open = (x: NotificationsItem) => { setRead(x.id, true); onOpen?.({ ...x, read: true }); };
  // the filter's tabs: the line under them slides to the picked one (placed at once the first time); Left and Right move between them
  const uid = useId(), tabsRef = useRef<HTMLDivElement>(null), placed = useRef(false);
  const [line, setLine] = useState<CSSProperties>({});
  useIsoLayoutEffect(() => {
    const el = tabsRef.current; if (!el) return;
    const place = () => { const t = el.querySelector<HTMLElement>('[aria-selected="true"]'); if (t && t.offsetWidth) { setLine({ left: t.offsetLeft, width: t.offsetWidth, transition: placed.current ? undefined : 'none' }); placed.current = true; } };
    place(); const ro = new ResizeObserver(place); ro.observe(el); return () => ro.disconnect();
  }, [cur, filters.length]);
  const tabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const d = ({ ArrowLeft: -1, ArrowRight: 1 } as Record<string, number>)[e.key]; if (!d) return;
    const i = filters.findIndex(f => f.value === cur), next = filters[(i + d + filters.length) % filters.length];
    e.preventDefault(); setCur(next.value); tabsRef.current?.querySelector<HTMLElement>(`[data-v="${next.value}"]`)?.focus();
  };
  // the card keeps no room for items to come: it eases taller as one arrives or a filter shows more, and shorter as it shows fewer
  const [root, inner] = useGrow();
  // Clean's one hover: a highlight that glides from item to item
  useHoverGlide(root, '.dm-ntx-n');

  return (
    <div data-dm="" ref={root} className={cx('dm-ntx dm-panel dm-growing', className)}>
      <div ref={inner} className="dm-grow">
      <div className="dm-ntx-h">
        {/* the inbox's mark, in the column the items' icons and avatars sit in */}
        <span className="dm-ntx-hi" aria-hidden="true"><Icon name="bell" /></span>
        <b>{title}</b>
        <span key={bump} className={cx('dm-ntx-ct dm-num', !unread && 'dm-z', bump > 0 && 'dm-bump')} aria-label={`${unread} unread`}>{unread}</span>
        <span className="dm-ntx-sp" />
        <button type="button" className="dm-pill dm-ghost dm-sm dm-ntx-all" onClick={markAll}>{markAllLabel}</button>
      </div>
      {/* the filter: underline tabs under the head, on a hairline that runs edge to edge */}
      <div className="dm-ntx-ut" role="tablist" aria-label="Filter" ref={tabsRef} onKeyDown={tabKey}>
        <span className="dm-ntx-ui" aria-hidden="true" style={line} />
        {filters.map(f => <button type="button" key={f.value} role="tab" id={`${uid}-${f.value}`} data-v={f.value} aria-selected={f.value === cur} tabIndex={f.value === cur ? 0 : -1} onClick={() => setCur(f.value)}>{f.label}</button>)}
      </div>
      <div key={paint.filter} className="dm-ntx-list" role="tabpanel" aria-labelledby={`${uid}-${cur}`}>
        {shown.length ? shown.map(x => {
          const at = paint.ids.indexOf(x.id), e = at >= 0 ? enter(at * 40) : null;
          return (
            // an item is the item itself (a click opens it and marks it read) and, where its unread dot sits, Mark as unread, a hollow
            // dot that shows on a read item under the pointer or with the focus in the row
            <div key={x.id} className={cx('dm-ntx-n', x.read && !pending.includes(x.id) && 'dm-read', e ? e.className : 'dm-new')} style={e?.style}>
              <button type="button" className="dm-ntx-o" onClick={() => open(x)}>
                <span className="dm-ic" data-tone={x.avatar || x.color ? undefined : x.tone ?? 'neutral'}
                  style={x.avatar || !x.color ? undefined : { color: x.color, background: `color-mix(in srgb,${x.color} 13%,transparent)` }}>
                  {x.avatar ? <Avatar initials={x.avatar.initials} color={x.avatar.color} /> : <Icon name={x.icon ?? 'bell'} size="xs" />}
                </span>
                <span className="dm-t">{x.text}<span>{x.time}</span></span>
                {!x.read && <span className="dm-ntx-sr">Unread</span>}
              </button>
              <span className="dm-ntx-m">
                <span className="dm-u" aria-hidden="true" />
                {x.read && <Tip label={markUnreadLabel}><button type="button" className="dm-ib dm-ntx-u" aria-label={markUnreadLabel} onClick={ev => { setRead(x.id, false); (ev.currentTarget.closest('.dm-ntx-n')?.querySelector('.dm-ntx-o') as HTMLElement | null)?.focus(); }}><i /></button></Tip>}
              </span>
            </div>
          );
        }) : (
          // an empty filter: a small sketch of a list, a title and one muted line
          <div className="dm-ntx-em"><span className="dm-ntx-em-art" aria-hidden="true" /><b>{emptyLabel}</b>{emptyDetail && <span>{emptyDetail}</span>}</div>
        )}
      </div>
      </div>
    </div>
  );
}
