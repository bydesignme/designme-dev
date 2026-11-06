# Tools and connections

> The tools the agent can reach, and how much it may do with each.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/tool-connections

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

- Each row shows a service logo (`brand`) or an icon on a tinted tile, a name and a detail line.
- An Off, Ask or Allow switch per tool, defaulting to Ask; a tool set to Off is dimmed and not counted as connected.
- "Connect a tool" opens a menu of `available` tools not yet in the list; a picked tool joins with "Just connected" and Ask, and `onConnect` is called.
- Passing `onTest` adds a Test all button, and `testing` shows a spinner on it while a test runs. You report each tool's progress through its `status`: 'testing' puts a small spinner on its status dot, without changing its line.
- A tool with `status: 'error'` shows a Reconnect button that calls `onReconnect`, with a spinner while `status` is 'reconnecting'.
- The line under the title counts connected tools, or shows your own `status` text.

### Accessibility

- Each permission switch is a role="group" labelled with the tool name plus "permission", and its buttons use aria-pressed.
- Each permission option has a tooltip saying what it means, such as "Agent asks first", which also shows on keyboard focus.
- The "Connect a tool" button exposes aria-expanded and aria-haspopup, and its menu has role="menu"; Escape closes it and returns focus to the button.
- From the keyboard, Enter, Space or the down arrow opens a menu with the focus on its picked item, or its first (the up arrow, on its last); the arrow keys move through it and wrap, Home and End jump to the ends, Tab closes it and moves on, and closing it gives the focus back to its button.

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
  { key: 'analytics', name: 'Analytics', detail: 'Read only, last 90 days', icon: 'db', color: 'var(--dm-pt)', permission: 'ask' },
  { key: 'web', name: 'Web search', detail: 'Any public site', icon: 'globe', color: 'var(--dm-pb)', permission: 'allow' }
];
const MORE: ToolConnectionsTool[] = [
  { key: 'sheets', name: 'Google Sheets', icon: 'table', color: 'var(--dm-ok)' },
  { key: 'linear', name: 'Linear', icon: 'bell', color: 'var(--dm-pp)' },
  { key: 'gmail', name: 'Gmail', icon: 'mail', color: 'var(--dm-pr)' }
];

export default function ToolConnectionsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [tools, setTools] = useState(TOOLS);
  const [status, setStatus] = useState<string>();
  const [testing, setTesting] = useState(false);
  const wait = useWait();
  const latest = useRef(tools);
  useEffect(() => { latest.current = tools; });
  const patch = (key: string, p: Partial<ToolConnectionsTool>) => setTools(ts => ts.map(t => t.key === key ? { ...t, ...p } : t));

  // every tool the agent may use shows a small spinner at once, and they settle one by one; Slack's token has run out
  const fixed = useRef(new Set<string>());
  const test = async () => {
    const rows = latest.current.filter(t => t.permission !== 'off' && t.status !== 'error');
    setTesting(true); setStatus(`Testing ${rows.length} connections`);
    rows.forEach(t => patch(t.key, { status: 'testing' }));
    for (const t of rows) {
      await wait(600);
      patch(t.key, t.key === 'slack' && !fixed.current.has(t.key) ? { status: 'error', note: 'Token expired. Reconnect to use it' } : { status: 'ok' });
    }
    const bad = rows.some(t => t.key === 'slack' && !fixed.current.has(t.key)) ? 1 : 0;
    setTesting(false); setStatus(`${rows.length - bad} of ${rows.length} healthy`);
  };
  const reconnect = async (key: string) => {
    patch(key, { status: 'reconnecting' });
    await wait(900);
    const on = latest.current.filter(t => t.permission !== 'off').length;
    fixed.current.add(key); patch(key, { status: 'ok', note: undefined }); setStatus(`${on} of ${on} healthy`);
  };

  // the preview's story: test everything, find Slack's token expired, and reconnect it
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-hnx-test');
    await wait(4 * 600 + 1500); press('.dm-hnx-t.dm-err .dm-pill');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ToolConnections tools={tools} onToolsChange={ts => { setTools(ts); setStatus(undefined); }} available={MORE} onTest={test} testing={testing} onReconnect={reconnect} status={status} />
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
| `testing` (optional) | `boolean` | A test is running: Test all shows a spinner and waits |
| `onReconnect` (optional) | `(key: string) => void` | Called by the Reconnect button of a tool whose status is error |
| `title` (optional) | `string` |  |
| `status` (optional) | `string` | The line under the title. Defaults to how many tools are connected |
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

Handle `onTest` and update `tools`: set `testing`, and each tool's `status` to 'testing' (a small spinner on its dot), then to 'ok' or 'error'. A `note`, like "Token expired. Reconnect to use it", replaces the detail line while it is set.

**What does Reconnect do?**

It calls `onReconnect` with the tool's key. Set that tool's `status` to 'reconnecting' while you refresh the token, then back to 'ok' and the row comes back with its permission switch.

**How do I save permission changes?**

Pass `tools` and `onToolsChange`. Every switch change and newly connected tool comes back as the full updated list.

**Can I use a tool that has no logo?**

Yes. Leave out `brand` and set `icon` and `color`; the icon sits on a tile tinted with that colour.

## Source

`ToolConnections.tsx`, as `npx designme add tool-connections --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Brand, type BrandName } from '../lib/brands';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { enter, Spin, Swap, Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
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
          ? left.map(a => <button type="button" key={a.key} className="dm-mi" role="menuitem" onClick={() => connect(a)}>{a.brand ? <Brand name={a.brand} /> : a.icon && <Icon name={a.icon} size="xs" />}<span>{a.name}</span></button>)
          : <div className="dm-ph" style={{ padding: 8, fontSize: 12.5, color: 'var(--dm-muted)' }}>All tools connected</div>}
      </div>
    </div>
  );
}
```

## More in Workspace

- [Automation canvas](https://designme.dev/components/automation-canvas.md): A trigger, a few agent steps, and a run you can watch flow through.
- [Canvas toolbar](https://designme.dev/components/canvas-toolbar.md): A floating toolbar for a workflow canvas: run, pick a tool, comment, fit and zoom.
- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
- [Memory panel](https://designme.dev/components/memory-panel.md): What the agent remembers about your team, editable and removable.
- [Model compare](https://designme.dev/components/model-compare.md): Run one prompt on three models side by side and keep the best.
- [Agent builder](https://designme.dev/components/agent-builder.md): Describe an agent in a sentence and it drafts the rest: who it is, what it may do, what it knows, when it runs. Test it, save it, publish it.
- [Agent settings](https://designme.dev/components/agent-settings.md): How much the agent may do alone, with a save bar for changes.
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md): The files, sites and folders the agent knows, and how far each is indexed.
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md): Tasks the agent runs on a schedule, with their last result and a switch.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.
- [Workspace rail](https://designme.dev/components/workspace-rail.md): A slim app rail that opens into a labelled sidebar.

All components: https://designme.dev/llms.txt
