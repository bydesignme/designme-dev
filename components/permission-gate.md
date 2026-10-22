# Permission gate

> The agent asks before it touches something new.

Agent components / Review and approve. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/permission-gate

## Install

```sh
npx designme add permission-gate          # HTML, CSS and JS, with the shared core
npx designme add permission-gate --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Permission gate is the card an agent shows when it wants to do something it has not been allowed to do yet, like editing Figma frames. The person ticks which scopes to grant, picks how long the permission lasts, and allows or declines, and they can revoke or undo that choice afterwards.

### When to use it

- When the agent is about to use a new tool or touch a new part of a workspace for the first time.
- When a request bundles several powers and people should be able to grant only some of them.
- When one of the scopes is risky, like publishing a shared library, and you want it flagged.
- When a permission should last only for this task or for today.

### What it does

- Each scope has a checkbox, a `label`, an optional `detail` line and an optional `risk` tag such as "Risky".
- A segmented control picks the duration. `durations` defaults to This task, Today and Always.
- The Allow button counts the ticked scopes, like "Allow 2 scopes". It reads "Pick a scope" and stays disabled when none are ticked.
- `onAllow` receives the ticked keys and the duration. Return a promise and the button shows a spinner until it settles.
- After allowing, the card shows what was granted and for how long, with an `allowedDetail` line that crossfades and a Revoke button.
- After Not now, the card shows `declinedTitle` and `declinedDetail` with an Undo button that brings the scopes back.

### Accessibility

- Each scope is a native checkbox inside its label, so the whole row is clickable and keyboard reachable.
- The duration picker is a group labelled "Duration" whose buttons use `aria-pressed`.
- The Allow button is a disabled button until at least one scope is ticked.

## Usage in React

```tsx
import { PermissionGate } from '@/components/designme/permission-gate/PermissionGate';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { PermissionGate, type PermissionStatus } from './PermissionGate';
import { Icon } from '../lib/icons';
import { useScript } from '../lib/useScript';

/* ---------- Permission gate: two scopes ticked; allow them and the agent reports back ---------- */
export default function PermissionGateDemo() {
  const [status, setStatus] = useState<PermissionStatus>('asking');
  const [detail, setDetail] = useState('Applying the pricing fixes now');
  useScript(async ({ wait }) => {
    if (status !== 'allowed') return;
    setDetail('Applying the pricing fixes now'); await wait(1400);
    setDetail('Done. 6 frames edited on a new page');
  }, [status]);
  return (
    <div style={{ width: '100%' }}>
      <PermissionGate icon={<Icon name="figma" />} title="Allow the agent to edit Figma?" subtitle="It needs this to apply the pricing fixes"
        scopes={[
          { key: 'read', label: 'Read frames', detail: 'Pricing, Checkout' },
          { key: 'edit', label: 'Edit frames', detail: 'Only on a new page' },
          { key: 'publish', label: 'Publish library', detail: 'Affects 4 other files', risk: 'Risky' }
        ]}
        defaultValue={['read', 'edit']} status={status} onStatusChange={setStatus}
        onAllow={() => new Promise<void>(res => setTimeout(res, 600))} allowedDetail={detail}
        declinedTitle="The agent will skip the Figma edits" declinedDetail="It will list the fixes in chat instead" />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `ReactNode` | The question, like "Allow the agent to edit Figma?" |
| `subtitle` (optional) | `ReactNode` | Why it asks |
| `icon` (optional) | `ReactNode` | Shown in the tile beside the question. Defaults to a shield |
| `scopes` | `PermissionScope[]` |  |
| `value` (optional) | `string[]` | Keys of the ticked scopes. Leave it out to let the checkboxes hold their own |
| `defaultValue` (optional) | `string[]` |  |
| `onValueChange` (optional) | `(keys: string[]) => void` |  |
| `durations` (optional) | `string[]` | How long the permission lasts. Defaults to This task, Today and Always |
| `duration` (optional) | `string` |  |
| `defaultDuration` (optional) | `string` |  |
| `onDurationChange` (optional) | `(duration: string) => void` |  |
| `status` (optional) | `PermissionStatus` | asking, allowed or declined. Leave it out to let the buttons move it |
| `defaultStatus` (optional) | `PermissionStatus` |  |
| `onStatusChange` (optional) | `(status: PermissionStatus) => void` |  |
| `onAllow` (optional) | `(keys: string[], duration: string) => void \| Promise<void>` | Called with the ticked scopes and the duration. Return a promise and the button spins until it settles |
| `onDecline` (optional) | `() => void` |  |
| `onRevoke` (optional) | `() => void` | Called by Revoke, after allowing |
| `onUndo` (optional) | `() => void` | Called by Undo, after declining |
| `allowedDetail` (optional) | `string` | The line under "Allowed …", like "Applying the pricing fixes now". Crossfades when it changes |
| `declinedTitle` (optional) | `ReactNode` | Shown after Not now |
| `declinedDetail` (optional) | `ReactNode` |  |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Questions

**Can the agent wait for the permission before it continues?**

Yes. Make `onAllow` return a promise that resolves once your agent has the grant. The button spins while it waits, then the card switches to the allowed state.

**How do I pre-tick the safe scopes?**

Pass their keys in `defaultValue`, or control the ticks with `value` and `onValueChange`. Scopes you leave out start unticked.

**What happens when the person presses Revoke?**

The allowed message fades out, the card returns to asking with the scopes shown again, and `onRevoke` is called so you can withdraw the grant.

**Can I use my own durations?**

Yes. Pass any list of strings as `durations`. The first one is picked by default unless you set `defaultDuration` or `duration`.

## Source

`PermissionGate.tsx`, as `npx designme add permission-gate --react` installs it:

```tsx
'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Seg, Spin, Swap } from '../lib/motion';
import '../designme.css';
import './permission-gate.css';

/** Something the agent is asking to be allowed to do */
export interface PermissionScope {
  key: string;
  /** Like "Edit frames" */
  label: string;
  /** The quiet line under it, like "Only on a new page" */
  detail?: string;
  /** A warning tag after it, like "Risky" */
  risk?: string;
}

export type PermissionStatus = 'asking' | 'allowed' | 'declined';

export interface PermissionGateProps {
  /** The question, like "Allow the agent to edit Figma?" */
  title: ReactNode;
  /** Why it asks */
  subtitle?: ReactNode;
  /** Shown in the tile beside the question. Defaults to a shield */
  icon?: ReactNode;
  scopes: PermissionScope[];
  /** Keys of the ticked scopes. Leave it out to let the checkboxes hold their own */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (keys: string[]) => void;
  /** How long the permission lasts. Defaults to This task, Today and Always */
  durations?: string[];
  duration?: string;
  defaultDuration?: string;
  onDurationChange?: (duration: string) => void;
  /** asking, allowed or declined. Leave it out to let the buttons move it */
  status?: PermissionStatus;
  defaultStatus?: PermissionStatus;
  onStatusChange?: (status: PermissionStatus) => void;
  /** Called with the ticked scopes and the duration. Return a promise and the button spins until it settles */
  onAllow?: (keys: string[], duration: string) => void | Promise<void>;
  onDecline?: () => void;
  /** Called by Revoke, after allowing */
  onRevoke?: () => void;
  /** Called by Undo, after declining */
  onUndo?: () => void;
  /** The line under "Allowed …", like "Applying the pricing fixes now". Crossfades when it changes */
  allowedDetail?: string;
  /** Shown after Not now */
  declinedTitle?: ReactNode;
  declinedDetail?: ReactNode;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

const DURATIONS = ['This task', 'Today', 'Always'];

/** The agent asks before it acts: pick the scopes and how long they last, then allow or decline. */
export function PermissionGate({
  title, subtitle, icon, scopes, value, defaultValue = [], onValueChange, durations = DURATIONS, duration, defaultDuration, onDurationChange,
  status, defaultStatus = 'asking', onStatusChange, onAllow, onDecline, onRevoke, onUndo, allowedDetail, declinedTitle = 'The agent will skip these changes',
  declinedDetail, bare = true, className
}: PermissionGateProps) {
  const [ticked, setTicked] = useControllable(value, defaultValue, onValueChange);
  const [dur, setDur] = useControllable(duration, defaultDuration ?? durations[0], onDurationChange);
  const [state, setState] = useControllable(status, defaultStatus, onStatusChange);
  const [waiting, setWaiting] = useState(false);
  // a revoked permission fades out before the scopes come back
  const [leaving, setLeaving] = useState(false);
  // the scopes play their entrance when they come back, not when the card first appears
  const [back, setBack] = useState(0);
  const [granted, setGranted] = useState(0);
  const n = ticked.length;

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => { setLeaving(false); setState('asking'); setBack(b => b + 1); onRevoke?.(); }, 300);
    return () => clearTimeout(t);
  }, [leaving]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (key: string) => setTicked(ticked.includes(key) ? ticked.filter(k => k !== key) : scopes.map(s => s.key).filter(k => k === key || ticked.includes(k)));
  const allow = async () => {
    if (!n || waiting) return;
    setWaiting(true); setGranted(n);
    try { await onAllow?.(ticked, dur); } finally { setWaiting(false); }
    setState('allowed');
  };
  const decline = () => { setState('declined'); onDecline?.(); };
  const undo = () => { setState('asking'); setBack(b => b + 1); onUndo?.(); };
  const again = (i: number) => (back ? { className: 'dm-enter', style: enter(i * 50).style, key: back } : { className: undefined, style: undefined, key: 0 });

  return (
    <div data-dm="" className={cx('dm-pgx', !bare && 'dm-panel', className)}>
      <div className="dm-pgx-h">
        <span className="dm-pgx-ic">{icon ?? <Icon name="shield" />}</span>
        <div className="dm-pgx-ht"><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div>
      </div>
      {state === 'asking' && (
        <>
          <div key={'sc' + again(0).key} className={cx('dm-pgx-sc', again(0).className)} style={again(0).style}>
            {scopes.map(s => (
              <label key={s.key} className="dm-pgx-o">
                <input type="checkbox" checked={ticked.includes(s.key)} onChange={() => toggle(s.key)} />
                <span className="dm-bx"><Icon name="check" size="xs" /></span>
                <span className="dm-t">{s.label}{s.detail && <span className="dm-d">{s.detail}</span>}</span>
                {s.risk && <span className="dm-tag dm-warn">{s.risk}</span>}
              </label>
            ))}
          </div>
          <div key={'du' + again(1).key} className={cx('dm-pgx-dur', again(1).className)} style={again(1).style}>
            <span className="dm-muted">For</span>
            <Seg label="Duration" value={dur} onChange={setDur} options={durations.map(d => ({ value: d, label: d }))} />
          </div>
          <div key={'f' + again(2).key} className={cx('dm-pgx-f', again(2).className)} style={again(2).style}>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-pgx-no" onClick={decline}>Not now</button>
            <button type="button" className="dm-pill dm-ink dm-sm dm-pgx-ok" disabled={!n} onClick={allow}>
              {waiting ? <Spin /> : <Swap>{n ? `Allow ${n} ${n > 1 ? 'scopes' : 'scope'}` : 'Pick a scope'}</Swap>}
            </button>
          </div>
        </>
      )}
      {state === 'allowed' && (
        <div className={cx('dm-pgx-done', leaving ? 'dm-leave' : 'dm-enter')}>
          <Icon name="ok" />
          <span className="dm-t">Allowed {granted || n} {(granted || n) > 1 ? 'scopes' : 'scope'} for {dur.toLowerCase()}{allowedDetail !== undefined && <Swap>{allowedDetail}</Swap>}</span>
          <button type="button" className="dm-pill dm-ghost dm-sm" onClick={() => setLeaving(true)}>Revoke</button>
        </div>
      )}
      {state === 'declined' && (
        <div className="dm-pgx-done dm-enter" style={{ background: 'var(--dm-chip)' }}>
          <Icon name="info" />
          <span className="dm-t">{declinedTitle}{declinedDetail && <span>{declinedDetail}</span>}</span>
          <button type="button" className="dm-pill dm-ghost dm-sm" onClick={undo}>Undo</button>
        </div>
      )}
    </div>
  );
}
```

## More in Review and approve

- [Change review](https://designme.dev/components/change-review.md): Accept or reject each change the agent made, file by file.
- [Plan review](https://designme.dev/components/plan-review.md): Check the agent's plan, edit steps, then let it run.
- [Decision prompt](https://designme.dev/components/decision-prompt.md): The agent asks a few quick questions before it starts.
- [Proposal card](https://designme.dev/components/proposal-card.md): A suggested change with confidence, alternatives and undo.
- [Design tuner](https://designme.dev/components/design-tuner.md): Tweak a component by hand or let the agent tune it.
- [Rewrite toolbar](https://designme.dev/components/rewrite-toolbar.md): Select a sentence and let the agent rewrite it in place.
- [Launch checklist](https://designme.dev/components/launch-checklist.md): The agent checks a design before it ships, and fixes what fails.

All components: https://designme.dev/llms.txt
