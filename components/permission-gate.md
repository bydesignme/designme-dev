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
- When the agent is already running and reaches something it needs one more scope for, so it asks again for just that scope.
- When one of the scopes is risky, like publishing a shared library, and you want it flagged.
- When a permission should last only for this task or for today.

### What it does

- Each scope has a checkbox, a `label`, an optional `detail` line and an optional `risk` tag such as "Risky".
- A segmented control picks the duration. `durations` defaults to This task, Today and Always.
- The Allow button counts the ticked scopes, like "Allow 2 scopes". It reads "Pick a scope" and stays disabled when none are ticked.
- `onAllow` receives the ticked keys and the duration. Return a promise and the button shows a spinner until it settles.
- After allowing, the card shows what was granted and for how long, with an `allowedDetail` line that crossfades and a Revoke button. `allowedTitle` replaces the first line, like "Done. 6 frames edited on a new page".
- While the agent works under the permission, `working` shows a spinner on a neutral row instead of the green check, and `meta` adds quiet text at the end of it, like an elapsed time.
- `followUp` marks a second ask in the middle of a run, for one more scope: the icon tile turns amber, and `declineLabel` can say what declining means, like "Skip this frame". A scope's `riskDetail` is what its risk tag shows on hover.
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
import { useEffect, useRef, useState } from 'react';
import { PermissionGate, type PermissionScope, type PermissionStatus } from './PermissionGate';
import { Icon } from '../lib/icons';
import { useStory, useWait } from '../lib/useScript';

/* ---------- Permission gate: hold back the risky scope, allow the rest, and grant it when the agent needs it for one frame ---------- */
const FIRST: PermissionScope[] = [
  { key: 'read', label: 'Read frames', detail: 'Pricing, Checkout' },
  { key: 'edit', label: 'Edit frames', detail: 'Only on a new page' },
  { key: 'publish', label: 'Publish library', detail: 'Affects 4 other files', risk: 'Risky', riskDetail: 'Checkout, Marketing site, Email kit and Docs use this library' }
];
const MORE: PermissionScope[] = [{ key: 'publish', label: 'Publish library', detail: 'Updates Checkout, Marketing site, Email kit and Docs', risk: 'Risky' }];
// the frames the agent edits once it may. Plan toggle is a library component, so editing it needs Publish library
const FRAMES = ['Hero', 'Plan cards', 'Compare table', 'FAQ', 'Plan toggle', 'Checkout summary'], LIB = 4;
const clock = (ms: number) => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

export default function PermissionGateDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [more, setMore] = useState(false);
  const [value, setValue] = useState(['read', 'edit']);
  const [duration, setDuration] = useState('This task');
  const [status, setStatus] = useState<PermissionStatus>('asking');
  const [working, setWorking] = useState(false);
  const [title, setTitle] = useState<string>();
  const [detail, setDetail] = useState<string>();
  const run = useRef({ granted: 0, publish: false, skip: false, done: 0, id: 0 });
  // the clock counts the agent's working time only, not the time it waits for you
  const [ms, setMs] = useState(0);
  useEffect(() => {
    if (!working) return;
    const from = performance.now() - ms, t = setInterval(() => setMs(performance.now() - from), 250);
    return () => clearInterval(t);
  }, [working]); // eslint-disable-line react-hooks/exhaustive-deps

  // the agent works through the frames under what it was given, and stops to ask when it reaches one it may not touch
  const work = async () => {
    const r = run.current, id = ++r.id;
    setStatus('allowed'); setWorking(true); setTitle(undefined);
    while (r.done < FRAMES.length) {
      if (r.done === LIB && !r.publish && !r.skip) { setWorking(false); setMore(true); setValue(['publish']); setStatus('asking'); return; }
      setDetail(r.done === LIB && r.skip ? `Skipping ${FRAMES[r.done]}` : `Editing ${FRAMES[r.done]} · ${r.done + 1} of ${FRAMES.length}`);
      await wait(900); if (r.id !== id) return;
      r.done++;
    }
    setWorking(false);
    setTitle(`Done. ${r.skip ? FRAMES.length - 1 : FRAMES.length} frames edited on a new page`);
    setDetail(r.skip ? 'Plan toggle skipped, it needs Publish library' : 'Plan toggle published to the library');
  };

  // the preview's story: the person ticks the risky scope, reads what it touches, leaves it off, allows, then grants it for one frame
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); setValue(['read', 'edit', 'publish']);
    await wait(2500); setValue(['read', 'edit']);
    await wait(1000); press('.dm-pgx-ok');
    await wait(500 + 4 * 900 + 2000); press('.dm-pgx-ok');
  });

  const r = run.current;
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <PermissionGate icon={<Icon name="figma" />}
        title={more ? 'Also allow Publish library?' : 'Allow the agent to edit Figma?'}
        subtitle={more ? `${FRAMES[LIB]}, frame ${LIB + 1} of ${FRAMES.length}, is a library component` : 'It needs this to apply the pricing fixes'}
        scopes={more ? MORE : FIRST} value={value} onValueChange={setValue} duration={duration} onDurationChange={setDuration}
        status={status} onStatusChange={setStatus} followUp={more} declineLabel={more ? 'Skip this frame' : 'Not now'}
        onAllow={async keys => { r.granted += keys.length; if (keys.includes('publish')) r.publish = true; await wait(500); setMore(false); void work(); }}
        onDecline={() => { if (!more) return; r.skip = true; setMore(false); void work(); }}
        onRevoke={() => { run.current = { granted: 0, publish: false, skip: false, done: 0, id: r.id + 1 }; setValue(['read', 'edit']); setMs(0); setWorking(false); }}
        working={working} meta={clock(ms)} allowedDetail={detail}
        allowedTitle={title ?? `Allowed ${r.granted} ${r.granted > 1 ? 'scopes' : 'scope'} for ${duration.toLowerCase()}`}
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
| `allowedTitle` (optional) | `string` | Replaces "Allowed 2 scopes for this task", like "Done. 6 frames edited on a new page". Crossfades when it changes |
| `working` (optional) | `boolean` | The agent is still working under the permission: a spinner on a neutral row instead of the green check |
| `meta` (optional) | `ReactNode` | Quiet text at the end of the allowed row, like an elapsed time "0:04" |
| `followUp` (optional) | `boolean` | A follow-up ask in the middle of a run, for one more scope: the icon tile turns amber |
| `declineLabel` (optional) | `string` | The decline button. Defaults to "Not now"; a follow-up ask might say "Skip this frame" |
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
import { enter, Seg, Spin, Swap, Tip } from '../lib/motion';
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
  /** What the risk tag reveals on hover, like "Checkout, Marketing site, Email kit and Docs use this library" */
  riskDetail?: string;
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
  /** Replaces "Allowed 2 scopes for this task", like "Done. 6 frames edited on a new page". Crossfades when it changes */
  allowedTitle?: string;
  /** The agent is still working under the permission: a spinner on a neutral row instead of the green check */
  working?: boolean;
  /** Quiet text at the end of the allowed row, like an elapsed time "0:04" */
  meta?: ReactNode;
  /** A follow-up ask in the middle of a run, for one more scope: the icon tile turns amber */
  followUp?: boolean;
  /** The decline button. Defaults to "Not now"; a follow-up ask might say "Skip this frame" */
  declineLabel?: string;
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
  status, defaultStatus = 'asking', onStatusChange, onAllow, onDecline, onRevoke, onUndo, allowedDetail, allowedTitle, working = false, meta, followUp = false,
  declineLabel = 'Not now', declinedTitle = 'The agent will skip these changes', declinedDetail, bare = true, className
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
    <div data-dm="" className={cx('dm-pgx', !bare && 'dm-panel', followUp && state === 'asking' && 'dm-esc', className)}>
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
                {s.risk && (s.riskDetail ? <Tip label={s.riskDetail}><span className="dm-tag dm-warn">{s.risk}</span></Tip> : <span className="dm-tag dm-warn">{s.risk}</span>)}
              </label>
            ))}
          </div>
          <div key={'du' + again(1).key} className={cx('dm-pgx-dur', again(1).className)} style={again(1).style}>
            <span className="dm-muted">For</span>
            <Seg label="Duration" value={dur} onChange={setDur} options={durations.map(d => ({ value: d, label: d }))} />
          </div>
          <div key={'f' + again(2).key} className={cx('dm-pgx-f', again(2).className)} style={again(2).style}>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-pgx-no" onClick={decline}>{declineLabel}</button>
            <button type="button" className="dm-pill dm-ink dm-sm dm-pgx-ok" disabled={!n} onClick={allow}>
              {waiting ? <Spin /> : <Swap>{n ? `Allow ${n} ${n > 1 ? 'scopes' : 'scope'}` : 'Pick a scope'}</Swap>}
            </button>
          </div>
        </>
      )}
      {state === 'allowed' && (
        <div className={cx('dm-pgx-done', working ? 'dm-run' : 'dm-ok', leaving ? 'dm-leave' : 'dm-enter')}>
          <span className="dm-g">{working ? <Spin /> : <Icon name="ok" />}</span>
          <span className="dm-t">
            <b className="dm-pgx-a"><Swap>{allowedTitle ?? `Allowed ${granted || n} ${(granted || n) > 1 ? 'scopes' : 'scope'} for ${dur.toLowerCase()}`}</Swap></b>
            {allowedDetail !== undefined && <Swap>{allowedDetail}</Swap>}
          </span>
          {meta !== undefined && <span className="dm-pgx-tm dm-num">{meta}</span>}
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
- [Design review](https://designme.dev/components/design-review.md): Checks run, a teammate asks for a change, the agent makes it, and you ship.

All components: https://designme.dev/llms.txt
