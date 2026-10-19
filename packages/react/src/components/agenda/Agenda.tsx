'use client';
import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Avatar, enter } from '../../lib/motion';
import '../../designme.css';
import './agenda.css';

export interface AgendaPerson {
  /** Like "MK" */
  initials: string;
  /** The avatar's colour, like 'var(--dm-pl)' */
  color: string;
}

export interface AgendaItem {
  /** Identifies the item for `open`. Defaults to its title */
  key?: string;
  /** Like "11:30" */
  time: string;
  /** Like "Agent demo" */
  title: string;
  /** The quiet line under the title, like "30 min, Zoom" */
  detail?: string;
  people?: AgendaPerson[];
  /** Already over: the item fades back, and the now line sits after the last one */
  past?: boolean;
  /** What the agent prepared, shown when the item opens. Items without notes don't open */
  notes?: ReactNode[];
  /** A button at the end of the notes, like "Join in 48 min" */
  action?: { label: string; onClick?: () => void };
}

export interface AgendaProps {
  items: AgendaItem[];
  /** Like "Today" */
  title?: string;
  /** Under the title, like "Monday, Oct 19" */
  subtitle?: string;
  /** The tag in the corner. Defaults to "4 events" */
  count?: string;
  /** The time on the now line, like "10:42". Leave it out for no line */
  now?: string;
  /** The item whose notes are open, by key. Leave it out to let each item toggle */
  open?: string | null;
  defaultOpen?: string | null;
  onOpenChange?: (key: string | null) => void;
  className?: string;
}

const keyOf = (item: AgendaItem) => item.key ?? item.title;

/** Today's events in order, with a line for now. Open one to see what the agent prepared for it. */
export function Agenda({ items, title = 'Today', subtitle, count, now, open, defaultOpen = null, onOpenChange, className }: AgendaProps) {
  const [opened, setOpened] = useControllable(open, defaultOpen, onOpenChange);
  // the now line goes after the last item that is over
  const lastPast = items.reduce((at, item, i) => item.past ? i : at, -1);
  // rows and the now line stagger in together, in the order they sit
  let n = 0;
  const row = (item: AgendaItem) => {
    const k = keyOf(item), isOpen = opened === k && !!item.notes?.length;
    const notes = item.notes ?? [];
    return (
      <button key={k} type="button" className={cx('dm-agx-e', item.past && 'dm-past', isOpen && 'dm-open', enter().className)} style={enter(n++ * 60).style}
        aria-expanded={notes.length ? isOpen : undefined} onClick={() => setOpened(isOpen || !notes.length ? null : k)}>
        <span className="dm-tm dm-num">{item.time}</span>
        <span className="dm-bar" />
        <span className="dm-t">
          <b>{item.title}</b>
          {item.detail && <span>{item.detail}</span>}
          {item.people?.length ? <span className="dm-who">{item.people.map((p, j) => <Avatar key={j} initials={p.initials} color={p.color} />)}</span> : null}
        </span>
        {isOpen && (
          <div className="dm-agx-prep">
            {notes.map((t, j) => <div key={j} {...enter(j * 60)}><Icon name="spark" size="xs" /><span>{t}</span></div>)}
            {item.action && <span className="dm-pill dm-accent dm-sm dm-agx-join dm-enter" style={enter(notes.length * 60).style}
              onClick={e => { if (item.action?.onClick) { e.stopPropagation(); item.action.onClick(); } }}>{item.action.label}</span>}
          </div>
        )}
      </button>
    );
  };

  return (
    <div data-dm="" className={cx('dm-agx dm-panel', className)}>
      <div className="dm-agx-h">
        <div><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div>
        <span className="dm-tag dm-b">{count ?? `${items.length} ${items.length === 1 ? 'event' : 'events'}`}</span>
      </div>
      <div className="dm-agx-list">
        {items.flatMap((item, i) => {
          const out = [row(item)];
          if (now && i === lastPast) out.push(<div key="now" className="dm-agx-now dm-enter" style={enter(n++ * 60).style}><i />{now}</div>);
          return out;
        })}
      </div>
    </div>
  );
}
