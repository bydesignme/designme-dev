# Launch checklist

> The agent checks a design before it ships, and fixes what fails.

Agent components / Review and approve. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/launch-checklist

## Install

```sh
npx designme add launch-checklist          # HTML, CSS and JS, with the shared core
npx designme add launch-checklist --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Launch checklist runs a list of pre-flight checks on a design before it ships, such as contrast, token use and alt text, and shows each result as it comes in. Failed checks get a Fix button so the agent can repair them, and the header button moves from running the checks to shipping.

### When to use it

- When an agent should verify a page or component against your rules before it goes live.
- When people need a quick summary of what still blocks a release.
- When the agent can fix some failures by itself and people should trigger each fix.
- When the final Ship it step should only be offered once every check passes.

### What it does

- Each check has a `label`, an optional `note` and a `state`: `wait`, `run`, `ok` or `bad`, each with its own glyph.
- A segmented bar at the top fills in with green and red as checks finish.
- The status line counts the checks, says Checking while one runs, then reports how many are left to fix or that all is clear. `status` overrides it.
- A failed check with `onFix` shows a Fix button. Set the check back to `run` while the agent fixes it.
- `action` adds a header button with a label, icon, `disabled` state and an `accent` colour for the step that ships.
- Notes crossfade when they change, so "Checking" can turn into the result in place.

### Accessibility

- The bar has `role="progressbar"`, labelled with the title, and its `aria-valuenow` counts the checks that have finished, passed or failed.
- Fix and the header action are real buttons, and the action can be disabled.

## Usage in React

```tsx
import { LaunchChecklist } from '@/components/designme/launch-checklist/LaunchChecklist';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { LaunchChecklist, type CheckState, type LaunchChecklistProps } from './LaunchChecklist';
import { useScript, useTakeover } from '../lib/useScript';

/* ---------- Launch checklist: six checks run in turn, two fail and get fixed, then it ships ---------- */
const CHECKS: [label: string, problem: string | null, result: string][] = [
  ['Contrast meets AA', null, 'All 14 text pairs pass'],
  ['Uses library tokens', '3 raw hex values in the FAQ', 'Swapped to color.text.muted'],
  ['Responsive at 375px', null, 'No overflow on 3 breakpoints'],
  ['Alt text on images', '2 icons have no label', 'Added labels from the layer names'],
  ['Links resolve', null, '12 of 12 links return 200'],
  ['Copy matches the brief', null, 'Prices and plan names match']
];
type Row = { state: CheckState; note?: string };
const fresh = (): Row[] => CHECKS.map(() => ({ state: 'wait' }));

export default function LaunchChecklistDemo() {
  const [rows, setRows] = useState<Row[]>(fresh);
  const [status, setStatus] = useState(`${CHECKS.length} checks`);
  const [phase, setPhase] = useState<'idle' | 'running' | 'checked' | 'shipped'>('idle');
  const [runs, setRuns] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  // the checks run once on its own, unless you take over first; the fixes are left for you
  const ref = useRef<HTMLDivElement>(null), mine = useTakeover(ref);
  useScript(async ({ wait }) => { await wait(1300); if (!mine()) setRuns(r => r || 1); });
  const set = (i: number, row: Row) => setRows(rs => rs.map((r, k) => k === i ? row : r));
  const tally = (rs: Row[]) => { const bad = rs.filter(r => r.state === 'bad').length; setStatus(bad ? `${bad} to fix before shipping` : 'All clear, ready to ship'); };

  useScript(async ({ wait }) => {
    if (!runs) return;
    setStatus('Checking'); setPhase('running');
    const out = fresh();
    for (let i = 0; i < CHECKS.length; i++) {
      set(i, { state: 'run', note: 'Checking' }); await wait(520 + Math.random() * 300);
      out[i] = CHECKS[i][1] ? { state: 'bad', note: CHECKS[i][1]! } : { state: 'ok', note: CHECKS[i][2] }; set(i, out[i]);
    }
    setPhase('checked'); tally(out);
  }, [runs]);

  const fix = (i: number) => {
    set(i, { state: 'run', note: 'Fixing' });
    timers.current.push(setTimeout(() => setRows(rs => { const next = rs.map((r, k) => k === i ? { state: 'ok' as const, note: CHECKS[i][2] } : r); tally(next); return next; }), 900));
  };
  const clear = phase === 'checked' && rows.every(r => r.state === 'ok');
  const action: LaunchChecklistProps['action'] =
    phase === 'shipped' ? { label: 'Ship it', icon: 'rocket', accent: true, disabled: true }
    : clear ? { label: 'Ship it', icon: 'rocket', accent: true, onClick: () => { setStatus('Shipped to production'); setPhase('shipped'); } }
    : phase === 'checked' ? { label: 'Run again', icon: 'refresh', onClick: () => { timers.current.forEach(clearTimeout); setRows(fresh()); setStatus(`${CHECKS.length} checks`); setPhase('idle'); setRuns(0); } }
    : { label: 'Run checks', icon: 'play', disabled: phase === 'running', onClick: () => setRuns(r => r + 1) };

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <LaunchChecklist title="Ready to ship pricing?" status={status} action={action}
        checks={rows.map((r, i) => ({ label: CHECKS[i][0], state: r.state, note: r.note, onFix: r.state === 'bad' ? () => fix(i) : undefined }))} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` (optional) | `string` | Like "Ready to ship pricing?" |
| `checks` | `LaunchCheck[]` |  |
| `status` (optional) | `string` | The line under the title. Defaults to a count of the checks, "Checking" while one runs, then what is left to fix |
| `action` (optional) | `{ label: string; icon?: IconName; /** The accent colour, for the step that ships */ accent?: boolean; disabled?: boolean; onClick?: () => void }` | The button beside the title, like Run checks, Run again or Ship it |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Questions

**Does the checklist run the checks itself?**

No. It shows the `checks` you pass. Your code or agent runs each check and updates its `state` and `note` as results arrive.

**How do I offer a fix for a failed check?**

Give that check an `onFix` handler while its state is `bad`. The Fix button calls it, and you can set the state to `run` with a note like "Fixing" until it passes.

**How do I switch the button to Ship it once everything passes?**

Change the `action` prop when all checks are `ok`, for example `{ label: 'Ship it', icon: 'rocket', accent: true }`. The demo does this.

## Source

`LaunchChecklist.tsx`, as `npx designme add launch-checklist --react` installs it:

```tsx
'use client';
import { cx } from '../lib/cx';
import { Icon, type IconName } from '../lib/icons';
import { enter, Spin, Swap } from '../lib/motion';
import '../designme.css';
import './launch-checklist.css';

export type CheckState = 'wait' | 'run' | 'ok' | 'bad';

export interface LaunchCheck {
  /** What is checked, like "Contrast meets AA" */
  label: string;
  /** wait (not run yet), run (checking or fixing now), ok or bad */
  state: CheckState;
  /** The quiet line under the label, like "All 14 text pairs pass" or what is wrong */
  note?: string;
  /** Shows a Fix button on a failed check */
  onFix?: () => void;
}

export interface LaunchChecklistProps {
  /** Like "Ready to ship pricing?" */
  title?: string;
  checks: LaunchCheck[];
  /** The line under the title. Defaults to a count of the checks, "Checking" while one runs, then what is left to fix */
  status?: string;
  /** The button beside the title, like Run checks, Run again or Ship it */
  action?: { label: string; icon?: IconName; /** The accent colour, for the step that ships */ accent?: boolean; disabled?: boolean; onClick?: () => void };
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

function Glyph({ state }: { state: CheckState }) {
  // a fresh glyph comes in each time the state changes; the wrapper takes the entrance so a spinner inside keeps turning
  const g = state === 'run' ? <Spin /> : state === 'ok' ? <span style={{ color: 'var(--dm-ok)', display: 'grid' }}><Icon name="ok" /></span>
    : state === 'bad' ? <span style={{ color: 'var(--dm-bad)', display: 'grid' }}><Icon name="alert" /></span> : <span className="dm-lcx-ring" />;
  return <span key={state} className={state === 'wait' ? undefined : 'dm-enter'} style={{ display: 'grid' }}>{g}</span>;
}

const summary = (checks: LaunchCheck[]) => {
  if (checks.some(c => c.state === 'run')) return 'Checking';
  if (checks.every(c => c.state === 'wait')) return `${checks.length} checks`;
  const bad = checks.filter(c => c.state === 'bad').length;
  return bad ? `${bad} to fix before shipping` : 'All clear, ready to ship';
};

/** Pre-flight checks before something ships, each with its result and a Fix for the ones that fail. */
export function LaunchChecklist({ title = 'Ready to ship?', checks, status, action, bare = true, className }: LaunchChecklistProps) {
  return (
    <div data-dm="" className={cx('dm-lcx', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-lcx-h">
        <div><b>{title}</b><Swap className="dm-muted dm-lcx-st">{status ?? summary(checks)}</Swap></div>
        {action && (
          <button type="button" className={cx('dm-pill dm-sm dm-lcx-run', action.accent ? 'dm-accent' : 'dm-ink')} disabled={action.disabled} onClick={action.onClick}>
            {action.icon && <Icon name={action.icon} size="xs" />}{action.label}
          </button>
        )}
      </div>
      <div className="dm-lcx-bar" role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={checks.length}
        aria-valuenow={checks.filter(c => c.state === 'ok' || c.state === 'bad').length}>
        {checks.map((c, i) => <i key={i} className={c.state === 'wait' ? undefined : 'dm-' + c.state} />)}
      </div>
      <div className="dm-lcx-list">
        {checks.map((c, i) => (
          <div key={i} className={cx('dm-lcx-r', 'dm-' + c.state)}>
            <span className="dm-g"><Glyph state={c.state} /></span>
            <span className="dm-t">{c.label}<Swap className="dm-d">{c.note ?? ''}</Swap></span>
            {c.state === 'bad' && c.onFix && (
              <button type="button" className="dm-pill dm-soft dm-sm dm-enter" style={enter().style} onClick={c.onFix}><Icon name="wand" size="xs" />Fix</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## More in Review and approve

- [Change review](https://designme.dev/components/change-review.md): Accept or reject each change the agent made, file by file.
- [Plan review](https://designme.dev/components/plan-review.md): Check the agent's plan, edit steps, then let it run.
- [Permission gate](https://designme.dev/components/permission-gate.md): The agent asks before it touches something new.
- [Hand-off to a person](https://designme.dev/components/human-handoff.md): The agent hands a conversation to a person, with what they need to pick it up.
- [Decision prompt](https://designme.dev/components/decision-prompt.md): The agent asks a few quick questions before it starts.
- [Proposal card](https://designme.dev/components/proposal-card.md): A suggested change with confidence, alternatives and undo.
- [Design tuner](https://designme.dev/components/design-tuner.md): Tweak a component by hand or let the agent tune it.
- [Rewrite toolbar](https://designme.dev/components/rewrite-toolbar.md): Select a sentence and let the agent rewrite it in place.
- [Inline text diff](https://designme.dev/components/inline-text-diff.md): The agent's edits to a piece of copy, accepted or rejected one by one.
- [Draft review](https://designme.dev/components/draft-review.md): An email the agent drafted, to check and edit before it sends.
- [Steering](https://designme.dev/components/steering.md): Change the agent's course while it works, without starting over.
- [Eval results](https://designme.dev/components/eval-results.md): An eval run case by case, against the run before.
- [Design review](https://designme.dev/components/design-review.md): Checks run, a teammate asks for a change, the agent makes it, and you ship.

All components: https://designme.dev/llms.txt
