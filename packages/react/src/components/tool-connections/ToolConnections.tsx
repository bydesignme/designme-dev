'use client';
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { Brand, type BrandName } from '../../lib/brands';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { avatarInk, enter, mxT, Spin, Swap, Tip, useGrow } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
// its menus' rows glide in Clean
import '../../lib/glide';
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
  /** A service's own logo, on a white tile. Wins over `icon` */
  brand?: BrandName;
  /** An icon on a vivid tile of `color`, for tools without a logo */
  icon?: IconName;
  /** The tile's colour, like 'var(--dm-av-t)'. The icon on it is white, or the colour's own ink for an avatar colour */
  color?: string;
  /** Defaults to ask */
  permission?: ToolConnectionsPermission;
  status?: ToolConnectionsStatus;
  /** Shown instead of the detail while it is set, like "Token expired. Reconnect to use it" */
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
  /** A test is running: Test all shows a spinner and waits, and the test's line shimmers */
  testing?: boolean;
  /** Called by the Reconnect button of a tool whose status is error */
  onReconnect?: (key: string) => void;
  title?: string;
  /** A test's line, in the foot beside Connect a tool, like "4 of 4 healthy". It shimmers while `testing` is set. Left out,
      there is none: the rows already say what is connected */
  status?: string;
  /** Leads the test's line with the green tick, as after a test that found every tool healthy */
  healthy?: boolean;
  className?: string;
}

const PERMS: { value: ToolConnectionsPermission; label: string; tip: string }[] = [
  { value: 'off', label: 'Off', tip: 'Agent cannot use it' },
  { value: 'ask', label: 'Ask', tip: 'Agent asks first' },
  { value: 'allow', label: 'Allow', tip: 'Agent uses it freely' }
];

/** A button that is as wide as its words and eases to its new width when they change, as on designme.dev */
function useEaseWidth(ref: RefObject<HTMLElement | null>, words: unknown) {
  const reduce = useReducedMotion(), was = useRef(0);
  useIsoLayoutEffect(() => {
    const b = ref.current; if (!b) return;
    const w1 = b.getBoundingClientRect().width, w0 = was.current; was.current = w1;
    if (w0 && !reduce && Math.abs(w1 - w0) > .5) b.animate([{ width: w0 + 'px' }, { width: w1 + 'px' }], { duration: mxT(b, 't-in', 360), easing: mxT(b, 'ease-spring', 'ease') });
  }, [words]);
}

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

/** The logo on a white tile, or the icon on a vivid tile of its colour */
const Mark = ({ tool }: { tool: ToolConnectionsTool }) => tool.brand
  ? <span className="dm-ic dm-brandic" aria-hidden="true"><Brand name={tool.brand} /></span>
  : <span className="dm-ic" style={{ background: tool.color ?? 'var(--dm-av-b)', color: avatarInk(tool.color ?? 'var(--dm-av-b)') ?? '#fff' }} aria-hidden="true">{tool.icon && <Icon name={tool.icon} size="xs" />}</span>;

/** Reconnect, as wide as its words; while it reconnects it keeps its width and spins */
function Reconnect({ busy, onClick }: { busy: boolean; onClick: () => void }) {
  // its width with its word, kept while the spinner takes the word's place; it keeps its colour and takes no second press
  const ref = useRef<HTMLButtonElement>(null), w = useRef<number>(0);
  useIsoLayoutEffect(() => { if (!busy && ref.current) w.current = ref.current.getBoundingClientRect().width; });
  return <button ref={ref} type="button" className="dm-pill dm-accent dm-sm dm-enter" style={busy && w.current ? { width: w.current } : undefined} aria-disabled={busy || undefined} aria-label={busy ? 'Reconnecting' : undefined} onClick={() => !busy && onClick()}>{busy ? <Spin /> : 'Reconnect'}</button>;
}

/** The tools the agent can reach, and how much it may do with each. */
export function ToolConnections({ tools, defaultTools = [], onToolsChange, available = [], onConnect, onTest, testing = false, onReconnect, title = 'Tools and connections', status, healthy = false, className }: ToolConnectionsProps) {
  const [list, setList] = useControllable(tools, defaultTools, onToolsChange);
  // a menu opens under its button, or above it when there is no room
  const menu = usePopover();
  const [root, inner] = useGrow();
  const test = useRef<HTMLButtonElement>(null);
  useEaseWidth(test, testing);
  const perm = (t: ToolConnectionsTool) => t.permission ?? 'ask';
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
    <div data-dm="" ref={root} className={cx('dm-hnx dm-panel dm-growing dm-mx-grow', className)}>
      <div ref={inner} className="dm-grow">
        <div className="dm-hnx-h">
          <span className="dm-hnx-hi" aria-hidden="true"><Icon name="link" size="xs" /></span>
          <div className="dm-hnx-ht"><b>{title}</b></div>
          {onTest && <button ref={test} type="button" className="dm-pill dm-ghost dm-sm dm-hnx-test dm-mx-press" onClick={onTest} disabled={testing}>{testing ? <><Spin /><span>Testing</span></> : <><Icon name="refresh" size="xs" /><span>Test all</span></>}</button>}
        </div>
        <div className="dm-hnx-list" role="list" aria-label="Tools">
          {list.map(t => {
            const at = first.indexOf(t.key), again = epoch[t.key] ?? 0;
            const motion = at >= 0 && !again ? enter(at * 50) : enter(0);
            const err = t.status === 'error' || t.status === 'reconnecting';
            return (
              <div key={t.key + ':' + again} role="listitem" className={cx('dm-hnx-t', motion.className, perm(t) === 'off' && 'dm-off', t.status === 'testing' && 'dm-chk', err && 'dm-err')} style={motion.style}>
                <Mark tool={t} />
                <span className="dm-t"><span className="dm-nm"><span>{t.name}</span><i className="dm-hnx-dot" aria-hidden="true" /></span><Swap className="dm-d">{t.note ?? t.detail ?? ''}</Swap></span>
                {err
                  ? <Reconnect busy={t.status === 'reconnecting'} onClick={() => t.status === 'error' && onReconnect?.(t.key)} />
                  : <Permission name={t.name} value={perm(t)} onChange={p => change(t.key, p)} />}
              </div>
            );
          })}
        </div>
        <div className="dm-hnx-ft">
          <button type="button" className="dm-hnx-add dm-mx-press" {...menu.trigger}><Icon name="plus" size="xs" />Connect a tool</button>
          {/* a test's progress and result, beside Connect a tool */}
          <span className="dm-muted dm-hnx-st" aria-live="polite">{status && <>{healthy && !testing && <Icon name="ok" size="xs" />}<Swap className={testing ? 'dm-shim' : undefined}>{status}</Swap></>}</span>
        </div>
        <div {...menu.pop} className={cx(menu.pop.className, 'dm-hnx-pop dm-mx-pop dm-mx-rows dm-mx-glide')} role="menu" aria-label="Connect a tool">
          {left.length
            ? left.map(a => <button type="button" key={a.key} className="dm-mi dm-mx-press" role="menuitem" onClick={() => connect(a)}>{a.brand ? <Brand name={a.brand} /> : a.icon && <Icon name={a.icon} size="xs" />}<span>{a.name}</span></button>)
            : <div className="dm-ph">All tools connected</div>}
        </div>
      </div>
    </div>
  );
}
