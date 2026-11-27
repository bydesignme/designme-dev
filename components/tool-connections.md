# Tools and connections

> The tools the agent can reach, and how much it may do with each.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/tool-connections

## Install

```sh
npx designme add tool-connections          # HTML, CSS and JS, with the shared core
npx designme add tool-connections --react  # React 19 component and its CSS
npx designme add tool-connections --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/tool-connections.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/tool-connections.json  # Astro
```

## About

A list of the tools and services an agent is connected to, each with a three-way permission switch: Off, Ask or Allow. People can test every connection, reconnect one that failed, and connect another tool from a menu. It answers the question "what can this agent touch, and does it need my OK first?"

### When to use it

- When your agent calls outside tools such as Figma, GitHub or Slack and people should control each one.
- When some tools should need approval while others run freely.
- When connections can expire and people need a way to spot and fix them.
- In an agent's settings or onboarding, where new tools get connected.

### What it does

- Each row shows a service logo (`brand`) on a white tile, or an `icon` on a vivid tile of its `color`, with a name and a detail line. In Clean the tiles are one neutral grey, and logos keep their own colours.
- A tool's state is a small dot after its name: green while it is connected, red once it has failed, and a turning ring while it is tested. A tool set to Off has no dot, and its tile and name dim.
- An Off, Ask or Allow switch per tool, defaulting to Ask; a tool set to Off is not counted as connected.
- "Connect a tool" opens a menu of `available` tools not yet in the list; a picked tool joins with "Just connected" and Ask, and `onConnect` is called. The menu opens under the button, or above it when there is no room below. It grows out of the button, its rows settling in one after another, and one highlight glides from row to row.
- Passing `onTest` adds a Test all button, and `testing` shows a spinner on it while a test runs; the button is as wide as its words and eases to the new ones. You report each tool's progress through its `status`: 'testing' turns its dot into a small ring, without changing its line.
- A test brings a line to the card's foot, beside Connect a tool: pass it as `status`, like "Testing 4 connections" while `testing` is set (it shimmers) and then "4 of 4 healthy", with `healthy` to lead it with the green tick. Without `status` there is none, since the rows already say what is connected.
- A tool with `status: 'error'` shows its note in red and a Reconnect button that calls `onReconnect`, with a spinner while `status` is 'reconnecting'.
- The card grows and shrinks with its rows, eased, and keeps no room for a state still to come.

### Accessibility

- The tools form a list. Each permission switch is a role="group" labelled with the tool name plus "permission", and its buttons use aria-pressed.
- Each permission option has a tooltip saying what it means, such as "Agent asks first", which also shows on keyboard focus.
- The "Connect a tool" button exposes aria-expanded and aria-haspopup, and its menu has role="menu"; Escape closes it and returns focus to the button.
- From the keyboard, Enter, Space or the down arrow opens a menu with the focus on its picked item, or its first (the up arrow, on its last); the arrow keys move through it and wrap, Home and End jump to the ends, Tab closes it and moves on, and closing it gives the focus back to its button.
- The test's line in the foot is announced politely when it changes.

## Usage in React

```tsx
import { ToolConnections } from '@/components/designme/tool-connections/ToolConnections';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { useStory, useWait } from '../lib/useScript';
import { ToolConnections, type ToolConnectionsTool } from './ToolConnections';

/* ---------- Tools and connections: five tools with their permissions; Test all finds Slack's token expired, Reconnect fixes it ---------- */
const TOOLS: ToolConnectionsTool[] = [
  { key: 'figma', name: 'Figma', detail: 'Read and edit frames', brand: 'figma', permission: 'ask' },
  { key: 'github', name: 'GitHub', detail: 'designme/web, PRs only', brand: 'github', permission: 'off' },
  { key: 'slack', name: 'Slack', detail: '#design, #launch', brand: 'slack', permission: 'ask' },
  { key: 'analytics', name: 'Analytics', detail: 'Read only, last 90 days', icon: 'db', color: 'var(--dm-av-t)', permission: 'ask' },
  { key: 'web', name: 'Web search', detail: 'Any public site', icon: 'globe', color: 'var(--dm-av-b)', permission: 'allow' }
];
const MORE: ToolConnectionsTool[] = [
  { key: 'sheets', name: 'Google Sheets', icon: 'table', color: 'var(--dm-av-m)' },
  { key: 'linear', name: 'Linear', brand: 'linear' },
  { key: 'gmail', name: 'Gmail', brand: 'gmail' }
];

export default function ToolConnectionsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [tools, setTools] = useState(TOOLS);
  const [status, setStatus] = useState<string>();
  const [healthy, setHealthy] = useState(false);
  const [testing, setTesting] = useState(false);
  const wait = useWait();
  const latest = useRef(tools);
  useEffect(() => { latest.current = tools; });
  const patch = (key: string, p: Partial<ToolConnectionsTool>) => setTools(ts => ts.map(t => t.key === key ? { ...t, ...p } : t));

  // every tool the agent may use shows a small spinner at once, and they settle one by one; Slack's token has run out
  const fixed = useRef(new Set<string>());
  const test = async () => {
    const rows = latest.current.filter(t => t.permission !== 'off' && t.status !== 'error');
    setTesting(true); setHealthy(false); setStatus(`Testing ${rows.length} connections`);
    rows.forEach(t => patch(t.key, { status: 'testing' }));
    for (const t of rows) {
      await wait(600);
      patch(t.key, t.key === 'slack' && !fixed.current.has(t.key) ? { status: 'error', note: 'Token expired. Reconnect to use it' } : { status: 'ok' });
    }
    const bad = rows.some(t => t.key === 'slack' && !fixed.current.has(t.key)) ? 1 : 0;
    setTesting(false); setHealthy(!bad); setStatus(`${rows.length - bad} of ${rows.length} healthy`);
  };
  const reconnect = async (key: string) => {
    patch(key, { status: 'reconnecting' });
    await wait(900);
    const on = latest.current.filter(t => t.permission !== 'off').length;
    fixed.current.add(key); patch(key, { status: 'ok', note: undefined }); setHealthy(true); setStatus(`${on} of ${on} healthy`);
  };

  // the preview's story: test everything, find Slack's token expired, and reconnect it. A test at work keeps going under the
  // pointer, as designme.dev's does
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-hnx-test');
    await wait(4 * 600 + 1500); press('.dm-hnx-t.dm-err .dm-pill');
  }, { hold: false });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ToolConnections tools={tools} onToolsChange={ts => { setTools(ts); setStatus(undefined); setHealthy(false); }} available={MORE} onTest={test} testing={testing} onReconnect={reconnect} status={status} healthy={healthy} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `tools` (optional) | `ToolConnectionsTool[]` | The connected tools. Leave it out to let the permission switches and Connect a tool change them |
| `defaultTools` (optional) | `ToolConnectionsTool[]` |  |
| `onToolsChange` (optional) | `(tools: ToolConnectionsTool[]) => void` |  |
| `available` (optional) | `ToolConnectionsTool[]` | Tools that can be connected, listed under Connect a tool. Ones already connected are left out |
| `onConnect` (optional) | `(tool: ToolConnectionsTool) => void` | Called with a tool picked from Connect a tool. It joins the list with "Just connected" and Ask |
| `onTest` (optional) | `() => void` | Adds a Test all button. Report progress through each tool's status and note |
| `testing` (optional) | `boolean` | A test is running: Test all shows a spinner and waits, and the test's line shimmers |
| `onReconnect` (optional) | `(key: string) => void` | Called by the Reconnect button of a tool whose status is error |
| `title` (optional) | `string` |  |
| `status` (optional) | `string` | A test's line, in the foot beside Connect a tool, like "4 of 4 healthy". It shimmers while `testing` is set. Left out, there is none: the rows already say what is connected |
| `healthy` (optional) | `boolean` | Leads the test's line with the green tick, as after a test that found every tool healthy |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ToolConnections from '../components/designme/tool-connections/ToolConnections.astro';
---
<ToolConnections />
<ToolConnections data-style="soft" class="my-class" />
```
It plays its demo; change `tool-connections.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I show a connection test in progress?**

Handle `onTest` and update `tools`: set `testing`, and each tool's `status` to 'testing' (a small turning ring after its name), then to 'ok' or 'error'. A `note`, like "Token expired. Reconnect to use it", replaces the detail line while it is set. Pass the result as `status`, like "4 of 4 healthy", with `healthy` when every tool passed.

**What does Reconnect do?**

It calls `onReconnect` with the tool's key. Set that tool's `status` to 'reconnecting' while you refresh the token, then back to 'ok' and the row comes back with its permission switch.

**How do I save permission changes?**

Pass `tools` and `onToolsChange`. Every switch change and newly connected tool comes back as the full updated list.

**Can I use a tool that has no logo?**

Yes. Leave out `brand` and set `icon` and `color`; the icon sits on a tile of that colour. One of the avatar colours, like 'var(--dm-av-t)', gives the icon that colour's own ink; any other colour gives it white.

## Source

`ToolConnections.tsx`, as `npx designme add tool-connections --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { Brand, type BrandName } from '../lib/brands';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { avatarInk, enter, mxT, Spin, Swap, Tip, useGrow } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
// its menus' rows glide in Clean
import '../lib/glide';
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
```

## More in Workspace

- [Tool rail](https://designme.dev/components/tool-rail.md): A board's tools in one vertical rail: pick one, and its name and key show on hover.
- [Zoom bar](https://designme.dev/components/zoom-bar.md): Undo, redo, zoom and fit in one floating bar for a canvas.
- [Run drawer](https://designme.dev/components/run-drawer.md): A workflow's run under its canvas: the steps, the log and the data.
- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
- [Memory panel](https://designme.dev/components/memory-panel.md): What the agent remembers about your team, editable and removable.
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md): The files, sites and folders the agent knows, and how far each is indexed.
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md): Tasks the agent runs on a schedule, with their last result and a switch.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.

All components: https://designme.dev/llms.txt
