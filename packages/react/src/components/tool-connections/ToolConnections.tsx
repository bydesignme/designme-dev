'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Brand, type BrandName } from '../../lib/brands';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { enter, Spin, Swap, Tip } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
import './tool-connections.css';

/** off: the agent cannot use it, ask: it asks first, allow: it uses it freely */
export type ToolConnectionsPermission = 'off' | 'ask' | 'allow';

/** ok, testing while a check runs, error when it failed (the row offers Reconnect), reconnecting while that runs */
export type ToolConnectionsStatus = 'ok' | 'testing' | 'error' | 'reconnecting';

/** A tool or connection the agent can reach */
export interface ToolConnectionsTool {
  key: string;
  /** Like "Figma" */
  name: string;
  /** The quiet line under it, like "Read and edit frames" */
  detail?: string;
  /** A service's own logo. Wins over `icon` */
  brand?: BrandName;
  /** An icon on a tinted tile, for tools without a logo */
  icon?: IconName;
  /** The icon's colour, which also tints its tile, like 'var(--dm-pt)' */
  color?: string;
  /** Defaults to ask */
  permission?: ToolConnectionsPermission;
  status?: ToolConnectionsStatus;
  /** Shown instead of the detail while it is set, like "Testing" or "Token expired. Reconnect" */
  note?: string;
}

export interface ToolConnectionsProps {
  /** The connected tools. Leave it out to let the permission switches and Connect a tool change them */
  tools?: ToolConnectionsTool[];
  defaultTools?: ToolConnectionsTool[];
  onToolsChange?: (tools: ToolConnectionsTool[]) => void;
  /** Tools that can be connected, listed under Connect a tool. Ones already connected are left out */
  available?: ToolConnectionsTool[];
  /** Called with a tool picked from Connect a tool. It joins the list with "Just connected" and Ask */
  onConnect?: (tool: ToolConnectionsTool) => void;
  /** Adds a Test all button. Report progress through each tool's status and note */
  onTest?: () => void;
  /** A test is running: Test all shows a spinner and waits */
  testing?: boolean;
  /** Called by the Reconnect button of a tool whose status is error */
  onReconnect?: (key: string) => void;
  title?: string;
  /** The line under the title. Defaults to how many tools are connected */
  status?: string;
  className?: string;
}

const PERMS: { value: ToolConnectionsPermission; label: string; tip: string }[] = [
  { value: 'off', label: 'Off', tip: 'Agent cannot use it' },
  { value: 'ask', label: 'Ask', tip: 'Agent asks first' },
  { value: 'allow', label: 'Allow', tip: 'Agent uses it freely' }
];

/** The three-way permission switch, with a knob that slides to the pick */
function Permission({ name, value, onChange }: { name: string; value: ToolConnectionsPermission; onChange: (p: ToolConnectionsPermission) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState<CSSProperties>({});
  // the knob slides when the choice changes; when the row first appears it is simply in place
  const placed = useRef(false);
  useIsoLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const place = () => { const b = el.querySelector<HTMLElement>('[aria-pressed="true"]'); if (b){ setKnob({ left: b.offsetLeft, width: b.offsetWidth, transition: placed.current ? undefined : 'none' }); placed.current = true; } };
    place();
    const ro = new ResizeObserver(place); ro.observe(el);
    return () => ro.disconnect();
  }, [value]);
  return (
    <div className="dm-hnx-pm" role="group" aria-label={name + ' permission'} ref={ref}>
      <span className="dm-kn" style={knob} />
      {PERMS.map(p => <Tip key={p.value} label={p.tip}><button type="button" aria-pressed={p.value === value} onClick={() => onChange(p.value)} onMouseDown={e => e.preventDefault()}>{p.label}</button></Tip>)}
    </div>
  );
}

/** The logo, or the icon on its tinted tile, with a dot for its state */
const Mark = ({ tool }: { tool: ToolConnectionsTool }) => tool.brand
  ? <span className="dm-ic dm-brandic"><Brand name={tool.brand} /></span>
  : <span className="dm-ic" style={tool.color ? { color: tool.color, background: `color-mix(in srgb,${tool.color} 12%,transparent)` } : undefined}>{tool.icon && <Icon name={tool.icon} size="xs" />}</span>;

/** The tools the agent can reach, and how much it may do with each. */
export function ToolConnections({ tools, defaultTools = [], onToolsChange, available = [], onConnect, onTest, testing = false, onReconnect, title = 'Tools and connections', status, className }: ToolConnectionsProps) {
  const [list, setList] = useControllable(tools, defaultTools, onToolsChange);
  const menu = usePopover({ side: 'up' });
  const perm = (t: ToolConnectionsTool) => t.permission ?? 'ask';
  const connected = list.filter(t => perm(t) !== 'off').length;
  const left = available.filter(a => !list.some(t => t.key === a.key));

  // rows there from the start come in one after another; a row connected later, or back from Reconnect, comes in on its own
  const [first] = useState(() => list.map(t => t.key));
  const [epoch, setEpoch] = useState<Record<string, number>>({});
  const was = useRef<Record<string, ToolConnectionsStatus | undefined>>({});
  useEffect(() => {
    const back = list.filter(t => was.current[t.key] === 'reconnecting' && t.status !== 'reconnecting' && t.status !== 'error').map(t => t.key);
    if (back.length) setEpoch(e => ({ ...e, ...Object.fromEntries(back.map(k => [k, (e[k] ?? 0) + 1])) }));
    was.current = Object.fromEntries(list.map(t => [t.key, t.status]));
  }, [list]);

  const change = (key: string, p: ToolConnectionsPermission) => setList(list.map(t => t.key === key ? { ...t, permission: p } : t));
  const connect = (tool: ToolConnectionsTool) => {
    menu.closeSoon();
    setList([...list, { ...tool, detail: 'Just connected', permission: 'ask' }]);
    onConnect?.(tool);
  };

  return (
    <div data-dm="" className={cx('dm-hnx dm-panel', className)}>
      <div className="dm-hnx-h">
        <div><b>{title}</b><Swap className="dm-muted dm-hnx-st">{status ?? connected + ' connected'}</Swap></div>
        {onTest && <button type="button" className="dm-pill dm-ghost dm-sm dm-hnx-test" onClick={onTest} disabled={testing}>{testing ? <><Spin />Testing</> : <><Icon name="refresh" size="xs" />Test all</>}</button>}
      </div>
      <div className="dm-hnx-list">
        {list.map(t => {
          const at = first.indexOf(t.key), again = epoch[t.key] ?? 0;
          const motion = at >= 0 && !again ? enter(at * 50) : enter(0);
          return (
            <div key={t.key + ':' + again} className={cx('dm-hnx-t', motion.className, perm(t) === 'off' && 'dm-off', t.status === 'testing' && 'dm-chk', (t.status === 'error' || t.status === 'reconnecting') && 'dm-err')} style={motion.style}>
              <Mark tool={t} />
              <span className="dm-t">{t.name}<Swap>{t.note ?? t.detail ?? ''}</Swap></span>
              {t.status === 'error' || t.status === 'reconnecting'
                ? <button type="button" className="dm-pill dm-accent dm-sm dm-enter" onClick={() => t.status === 'error' && onReconnect?.(t.key)}>{t.status === 'reconnecting' ? <Spin /> : 'Reconnect'}</button>
                : <Permission name={t.name} value={perm(t)} onChange={p => change(t.key, p)} />}
            </div>
          );
        })}
      </div>
      <button type="button" className="dm-hnx-add" {...menu.trigger}><Icon name="plus" size="xs" />Connect a tool</button>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-hnx-pop')} role="menu">
        {left.length
          ? left.map(a => <button type="button" key={a.key} className="dm-mi" onClick={() => connect(a)}>{a.brand ? <Brand name={a.brand} /> : a.icon && <Icon name={a.icon} size="xs" />}<span>{a.name}</span></button>)
          : <div className="dm-ph" style={{ padding: 8, fontSize: 12.5, color: 'var(--dm-muted)' }}>All tools connected</div>}
      </div>
    </div>
  );
}
