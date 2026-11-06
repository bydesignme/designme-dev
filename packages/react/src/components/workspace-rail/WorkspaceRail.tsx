'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Swap, Think, Tip } from '../../lib/motion';
import '../../designme.css';
import './workspace-rail.css';

export interface WorkspaceRailItem {
  key: string;
  label: string;
  icon: IconName;
  /** A count on the icon, like unread messages. Clear it and it leaves */
  badge?: number;
}

export interface WorkspaceRailRun {
  key: string;
  /** What is running, like "Pricing audit" */
  label: string;
  onClick?: () => void;
}

export interface WorkspaceRailProps {
  items: WorkspaceRailItem[];
  /** The open item. Leave it out to let clicks pick it */
  value?: string;
  defaultValue?: string;
  onValueChange?: (key: string) => void;
  /** Whether the rail shows its labels. Leave it out to let the pin button toggle it */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** The workspace at the top. Defaults to DesignMe, Studio */
  workspace?: { name: string; detail?: string; logo?: ReactNode };
  /** Agent runs in progress, listed above the pin button */
  runs?: WorkspaceRailRun[];
  runsLabel?: string;
  /** The shortcut shown in the pin button's tooltip */
  shortcut?: string;
  /** The page beside the rail. Defaults to the open item's name over placeholder lines */
  children?: ReactNode;
  className?: string;
}

const LOGO = (
  <svg viewBox="-20 -83 799 799" aria-hidden="true" className="dm-logo"><path fill="currentColor" d="M149.497 283.784C149.477 284.047 149.474 284.311 149.487 284.575C156.385 340.034 183.548 391.116 225.9 428.196C267.989 465.044 322.188 485.532 378.414 485.855L379.743 485.859C436.453 485.868 491.188 465.353 533.619 428.212C575.912 391.194 603.062 340.216 610.018 284.856L610.018 281.512C610.008 277.337 608.324 273.315 605.303 270.335C602.277 267.351 598.155 265.656 593.837 265.656L165.647 265.656C161.338 265.656 157.226 267.349 154.21 270.331C151.198 273.309 149.524 277.326 149.523 281.491L149.523 283.437L149.497 283.784ZM114.378 247.395C118.396 247.391 122.254 245.919 125.214 243.29C128.063 240.759 129.887 237.33 130.396 233.629L130.396 233.35L130.437 232.917C136.355 171.634 165.162 114.754 211.202 73.3687C257.239 31.9859 317.206 9.06063 379.393 9.04448L379.396 9.04448C441.593 9.04583 501.574 31.964 547.624 73.3482C593.677 114.735 622.491 171.624 628.411 232.917L628.453 233.35L628.453 233.643C628.953 237.344 630.773 240.774 633.621 243.304C636.58 245.932 640.437 247.399 644.452 247.395L725.644 247.395C728.882 247.404 732.089 248.06 735.071 249.329C738.055 250.598 740.753 252.453 743.001 254.787C745.252 257.123 747.005 259.891 748.151 262.924C749.296 265.954 749.81 269.183 749.662 272.418L749.663 272.418C745.484 366.797 704.617 455.919 635.615 521.211C566.616 586.499 474.809 622.924 379.338 622.924C283.872 622.924 192.071 586.496 123.081 521.206C54.0935 455.917 13.2412 366.804 9.07133 272.438L9.07036 272.438L9.07036 272.436C9.07007 272.43 9.06967 272.423 9.06938 272.417L9.07036 272.417C8.92272 269.182 9.43655 265.953 10.5811 262.924C11.7276 259.89 13.481 257.123 15.7315 254.787C17.9805 252.452 20.6797 250.597 23.6622 249.329C26.6443 248.06 29.8504 247.404 33.0889 247.395L114.378 247.395Z" /></svg>
);

/** A count on an icon. When it is cleared it plays its exit before it goes */
function Badge({ count }: { count?: number }) {
  const [kept, setKept] = useState(count);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (count) { setKept(count); setLeaving(false); return; }
    setLeaving(true);
    const t = setTimeout(() => { setKept(undefined); setLeaving(false); }, 300);
    return () => clearTimeout(t);
  }, [count]);
  return kept ? <span className={cx('dm-bd', leaving && 'dm-leave')}>{kept}</span> : null;
}

/** A sidebar that folds to icons, with a sliding marker on the open item and the agent runs in progress. */
export function WorkspaceRail({ items, value, defaultValue, onValueChange, expanded, defaultExpanded = false, onExpandedChange,
  workspace, runs, runsLabel = 'Running', shortcut = '⌘B', children, className }: WorkspaceRailProps) {
  const [active, setActive] = useControllable(value, defaultValue ?? items[0]?.key ?? '', onValueChange);
  const [wide, setWide] = useControllable(expanded, defaultExpanded, onExpandedChange);
  const refs = useRef(new Map<string, HTMLButtonElement>());
  // the marker slides to the open item; it is placed after the first paint, so it slides in from the top as on the site
  const [top, setTop] = useState<number>();
  useEffect(() => { const b = refs.current.get(active); if (b) setTop(b.offsetTop); }, [active, items.length]);
  const ws = workspace ?? { name: 'DesignMe', detail: 'Studio' };
  const current = items.find(i => i.key === active);

  return (
    <div data-dm="" className={cx('dm-wrx dm-panel', wide && 'dm-wide', className)}>
      <nav className="dm-wrx-rail" aria-label="Workspace">
        <div className="dm-wrx-ws">
          <span className="dm-wrx-lg">{ws.logo ?? LOGO}</span>
          <span className="dm-wrx-lb"><b>{ws.name}</b>{ws.detail && <span className="dm-muted">{ws.detail}</span>}</span>
        </div>
        <div className="dm-wrx-nav">
          <span className="dm-wrx-ind" style={top === undefined ? undefined : { top }} />
          {items.map(it => (
            <Tip key={it.key} label={it.label} off={wide}>
              <button type="button" ref={el => { if (el) refs.current.set(it.key, el); else refs.current.delete(it.key); }}
                className={cx('dm-wrx-i', it.key === active && 'dm-on')} aria-label={it.label} aria-current={it.key === active ? 'page' : undefined}
                onClick={() => setActive(it.key)}>
                <Icon name={it.icon} /><Badge count={it.badge} /><span className="dm-wrx-lb">{it.label}</span>
              </button>
            </Tip>
          ))}
        </div>
        <div className="dm-wrx-sp" />
        {runs && runs.length > 0 && (
          <div className="dm-wrx-runs">
            <span className="dm-wrx-lbh">{runsLabel}</span>
            {runs.map(r => (
              <Tip key={r.key} label={r.label} off={wide}>
                <button type="button" className="dm-wrx-run" onClick={r.onClick}><Think /><span className="dm-wrx-lb">{r.label}</span></button>
              </Tip>
            ))}
          </div>
        )}
        <Tip label={wide ? 'Collapse' : 'Pin open'} kbd={shortcut}>
          <button type="button" className="dm-wrx-i dm-wrx-pin" aria-label="Pin sidebar" aria-expanded={wide} onClick={() => setWide(!wide)}>
            <Icon name="panel" /><span className="dm-wrx-lb">Collapse</span>
          </button>
        </Tip>
      </nav>
      <div className="dm-wrx-main">
        <div className="dm-wrx-mh"><Swap>{current?.label ?? ''}</Swap></div>
        {children ?? <div className="dm-wrx-sk"><i style={{ width: '70%' }} /><i style={{ width: '92%' }} /><i style={{ width: '56%' }} /><i className="dm-b" /></div>}
      </div>
    </div>
  );
}
