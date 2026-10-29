# Scheduled runs

> Tasks the agent runs on a schedule, with their last result and a switch.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/scheduled-runs

## Install

```sh
npx designme add scheduled-runs          # HTML, CSS and JS, with the shared core
npx designme add scheduled-runs --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

A list of tasks an agent runs on a schedule, like a weekly design QA. Each row says its schedule in words, when it runs next and how its last run went, with Run now and an on/off switch. A run whose last attempt failed says why and can offer a fix, a paused one dims and says Paused, and New schedule makes another from Every day, Every Monday or Custom days.

### When to use it

- When people set an agent to repeat work, like checking pages every week or syncing tokens every morning.
- When people need to see at a glance which recurring runs passed and which failed.
- When a run fails for a reason people can fix, like an expired token, and should run again once it is fixed.
- When people want to pause a recurring run without deleting it.

### What it does

- Each run in `runs` shows its `name`, its `schedule` in words with its `next` run, and its last `result`: "Passed 5 days ago", "Failed: Figma token expired", "Running now" or "No runs yet".
- The dot on its icon follows the result: green when it passed, red when it failed, a turning ring while it runs, grey when it is paused or has never run. Its tile shows a service logo (`brand`) or an `icon` on a tint of its `color`.
- `onRunNow` adds a Run now button to each row; it is unavailable while the run is running or paused.
- The switch pauses and resumes a run (`enabled`), and the change comes back through `onRunsChange`. A paused row dims and reads "Paused" in place of its next run.
- A failed run with a `fix` shows a button with that label that calls `onFix`; set `fixing` to spin it.
- `onCreate` adds New schedule: a form with the task, Every day, Every Monday or Custom days, and a line saying when the first run would be. Create hands over the task, the days, the schedule in words and when it runs next.
- The line under the title reads like "3 active · 1 failed", adding "1 paused" when one is paused, or shows your own `status`.

### Accessibility

- The runs form a list. Each Run now button is named for its run, like "Run Weekly design QA now".
- Each switch has role="switch" and aria-checked, is named for its run, and has a Pause or Resume tooltip.
- New schedule opens a dialog; its Repeat options are a labelled group of pressed buttons, and the Custom days are buttons named in full, like "Wednesday".
- The line under the title is announced politely when it changes.
- With reduced motion, rows appear without their entrance and text changes without the crossfade.

## Usage in React

```tsx
import { ScheduledRuns } from '@/components/designme/scheduled-runs/ScheduledRuns';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { useStory, useWait } from '../lib/useScript';
import { ScheduledRuns, type ScheduledRun } from './ScheduledRuns';

/* ---------- Scheduled runs: run the design QA now, reconnect Figma so the token sync passes, pause the price check ---------- */
const RUNS: ScheduledRun[] = [
  { key: 'qa', name: 'Weekly design QA', schedule: 'Mondays at 9:00', next: 'Next in 2 days', result: 'passed', ago: '5 days ago', icon: 'palette', color: 'var(--dm-pl)' },
  { key: 'tokens', name: 'Sync tokens from Figma', schedule: 'Every day at 8:00', next: 'Next in 17h', result: 'failed', error: 'Figma token expired', fix: 'Reconnect Figma', brand: 'figma' },
  { key: 'price', name: 'Competitor price check', schedule: 'Fridays at 17:00', next: 'Next in 6 days', result: 'passed', ago: 'yesterday', icon: 'chart', color: 'var(--dm-pt)' }
];

export default function ScheduledRunsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [runs, setRuns] = useState(RUNS);
  const wait = useWait();
  const patch = (key: string, p: Partial<ScheduledRun>) => setRuns(rs => rs.map(r => r.key === key ? { ...r, ...p } : r));

  const runNow = async (key: string) => { patch(key, { result: 'running' }); await wait(3000); patch(key, { result: 'passed', ago: 'just now', error: undefined }); };
  // reconnecting takes a moment, then the run goes again straight away
  const fix = async (key: string) => { patch(key, { fixing: true }); await wait(900); patch(key, { fixing: false }); runNow(key); };

  // the preview's story: run the design QA and watch it pass, reconnect Figma so the token sync passes, then pause the price check
  useStory(ref, async ({ wait, press }) => {
    await wait(2000); press('.dm-shx-r:nth-child(1) .dm-shx-run');
    await wait(4000); press('.dm-shx-r:nth-child(2) .dm-shx-fx .dm-pill');
    await wait(5000); press('.dm-shx-r:nth-child(3) .dm-toggle');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ScheduledRuns runs={runs} onRunsChange={setRuns} onRunNow={runNow} onFix={fix}
        onCreate={n => setRuns(rs => [...rs, { key: 'new' + rs.length, name: n.task, schedule: n.schedule, next: n.next, result: 'never' }])} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `runs` (optional) | `ScheduledRun[]` |  |
| `defaultRuns` (optional) | `ScheduledRun[]` |  |
| `onRunsChange` (optional) | `(runs: ScheduledRun[]) => void` | Called when a switch pauses or resumes a run, with the whole list |
| `onRunNow` (optional) | `(key: string) => void` | Adds Run now to each row. Set the run's result to 'running' while it runs |
| `onFix` (optional) | `(key: string) => void` | Called by the fix button of a failed run |
| `onCreate` (optional) | `(run: ScheduledRunsNew) => void` | Adds New schedule: a task, Every day, Every Monday or Custom days, and Create |
| `time` (optional) | `string` | The time new schedules run at, in words. Defaults to "9:00" |
| `hour` (optional) | `number` | The hour of that time, so the form can say when the first run is. Defaults to 9 |
| `title` (optional) | `string` | Defaults to "Scheduled runs" |
| `status` (optional) | `string` | The line under the title. Defaults to "3 active · 1 failed · 1 paused", leaving out what is zero |
| `className` (optional) | `string` |  |

## Questions

**Does Run now start the run?**

No. It calls `onRunNow` with the run's key. Start it in your own code, set its `result` to 'running', and to 'passed' or 'failed' when it ends.

**How do I show a fix like reconnecting a service?**

Give the failed run a `fix` label, like "Reconnect Figma". When `onFix` is called, set `fixing` while you reconnect, then run it again and update its `result`.

**What time do new schedules run at?**

At `time`, 9:00 unless you change it, with `hour` set to match so the form can say when the first run is. The days come back as numbers, 0 for Monday to 6 for Sunday.

**Can I write schedules my own way?**

Yes. `schedule` and `next` are plain text, so "Weekdays at 8:30" or "Next tomorrow" work as well.

## Source

`ScheduledRuns.tsx`, as `npx designme add scheduled-runs --react` installs it:

```tsx
'use client';
import { useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { Brand, type BrandName } from '../lib/brands';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { enter, Fold, Seg, Spin, Swap, Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './scheduled-runs.css';

/** How its last run went. running while it runs now; never before its first run */
export type ScheduledRunResult = 'passed' | 'failed' | 'running' | 'never';

/** A task the agent runs on a schedule */
export interface ScheduledRun {
  key: string;
  /** Like "Weekly design QA" */
  name: string;
  /** The schedule in words, like "Mondays at 9:00" */
  schedule: string;
  /** When it runs next, like "Next in 2 days". A paused run says "Paused" instead */
  next?: string;
  /** On or paused. Defaults to on */
  enabled?: boolean;
  result?: ScheduledRunResult;
  /** When the last run ended, like "5 days ago", shown as "Passed 5 days ago" */
  ago?: string;
  /** Why the last run failed, like "Figma token expired" */
  error?: string;
  /** The label of a button that fixes a failed run, like "Reconnect Figma". It calls `onFix` */
  fix?: string;
  /** The fix is under way: its button spins */
  fixing?: boolean;
  /** A service's own logo. Wins over `icon` */
  brand?: BrandName;
  /** An icon on a tinted tile. Defaults to a clock */
  icon?: IconName;
  /** The icon's colour, which also tints its tile, like 'var(--dm-pl)' */
  color?: string;
}

/** What New schedule hands over: the task, and the days it runs on, 0 for Monday to 6 for Sunday */
export interface ScheduledRunsNew {
  task: string;
  repeat: 'day' | 'monday' | 'custom';
  days: number[];
  /** The schedule in words, like "Mon, Wed, Fri at 9:00" */
  schedule: string;
  /** When it first runs, from now, like "Next in 18h" */
  next: string;
}

export interface ScheduledRunsProps {
  runs?: ScheduledRun[];
  defaultRuns?: ScheduledRun[];
  /** Called when a switch pauses or resumes a run, with the whole list */
  onRunsChange?: (runs: ScheduledRun[]) => void;
  /** Adds Run now to each row. Set the run's result to 'running' while it runs */
  onRunNow?: (key: string) => void;
  /** Called by the fix button of a failed run */
  onFix?: (key: string) => void;
  /** Adds New schedule: a task, Every day, Every Monday or Custom days, and Create */
  onCreate?: (run: ScheduledRunsNew) => void;
  /** The time new schedules run at, in words. Defaults to "9:00" */
  time?: string;
  /** The hour of that time, so the form can say when the first run is. Defaults to 9 */
  hour?: number;
  /** Defaults to "Scheduled runs" */
  title?: string;
  /** The line under the title. Defaults to "3 active · 1 failed · 1 paused", leaving out what is zero */
  status?: string;
  className?: string;
}

const DAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const words = (ds: number[], time: string) => ds.length === 7 ? `Every day at ${time}` : ds.join() === '0,1,2,3,4' ? `Weekdays at ${time}`
  : ds.length === 1 ? `${FULL[ds[0]]}s at ${time}` : `${ds.map(d => DAY[d]).join(', ')} at ${time}`;
/** When the first run is, from now: in hours when it's within a day, otherwise in days */
function firstRun(ds: number[], hour: number) {
  const now = new Date(), today = (now.getDay() + 6) % 7;
  const at = ds.map(d => { const t = new Date(now); t.setDate(now.getDate() + ((d - today + 7) % 7)); t.setHours(hour, 0, 0, 0); if (t <= now) t.setDate(t.getDate() + 7); return t; })
    .sort((a, b) => +a - +b)[0];
  const h = Math.round((+at - +now) / 36e5);
  if (h < 24) return `First run in ${Math.max(1, h)}h`;
  const days = Math.round((new Date(at).setHours(0, 0, 0, 0) - new Date(now).setHours(0, 0, 0, 0)) / 864e5);
  return `First run in ${days} days`;
}

/** Recurring agent tasks: each with its schedule in words, when it runs next, how its last run went, Run now and an
    on/off switch. A paused one dims and says so; a failed one says why and can offer a fix; New schedule makes another. */
export function ScheduledRuns({ runs, defaultRuns = [], onRunsChange, onRunNow, onFix, onCreate, time = '9:00', hour = 9, title = 'Scheduled runs', status, className }: ScheduledRunsProps) {
  const [list, setList] = useControllable(runs, defaultRuns, onRunsChange);
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const menu = usePopover({ side: 'up' });
  const [task, setTask] = useState('');
  const [repeat, setRepeat] = useState<ScheduledRunsNew['repeat']>('day');
  const [custom, setCustom] = useState([0, 2, 4]);
  const days = repeat === 'day' ? [0, 1, 2, 3, 4, 5, 6] : repeat === 'monday' ? [0] : custom;
  // the form grows upwards from New schedule when Custom adds the days, so it is held by its bottom edge
  const [bottom, setBottom] = useState<CSSProperties>({});
  useIsoLayoutEffect(() => {
    const b = root.current?.querySelector<HTMLElement>('.dm-shx-add');
    if (menu.open && b && root.current) setBottom({ top: 'auto', bottom: root.current.clientHeight - b.offsetTop + 6 });
  }, [menu.open, repeat]);
  const [first] = useState(() => list.map(r => r.key));

  const on = (r: ScheduledRun) => r.enabled !== false;
  const active = list.filter(on).length, paused = list.length - active, failed = list.filter(r => on(r) && r.result === 'failed').length;
  const line = status ?? `${active} active` + (failed ? ` · ${failed} failed` : '') + (paused ? ` · ${paused} paused` : '');
  const toggle = (key: string) => setList(list.map(r => r.key === key ? { ...r, enabled: !on(r) } : r));
  const create = (e: FormEvent) => {
    e.preventDefault(); if (!task.trim() || !days.length) return;
    onCreate?.({ task: task.trim(), repeat, days, schedule: words(days, time), next: firstRun(days, hour).replace('First run', 'Next') });
    menu.close(); setTask('');
  };

  return (
    <div data-dm="" ref={root} className={cx('dm-shx dm-panel', className)}>
      <div className="dm-shx-h"><div><b>{title}</b><Swap className="dm-muted dm-shx-st">{line}</Swap></div></div>
      <div className="dm-shx-list" role="list" aria-label="Schedules">
        {list.map(r => {
          const at = first.indexOf(r.key), motion = enter(at >= 0 ? at * 50 : 0), running = r.result === 'running';
          const res = running ? 'Running now' : r.result === 'passed' ? 'Passed' + (r.ago ? ' ' + r.ago : '') : r.result === 'failed' ? 'Failed' + (r.error ? ': ' + r.error : '') : 'No runs yet';
          const st = running ? 'run' : r.result === 'passed' ? 'ok' : r.result === 'failed' ? 'bad' : 'none';
          const color = r.color ?? 'var(--dm-pb)';
          return (
            <div key={r.key} className={cx('dm-shx-r', motion.className, !on(r) && 'dm-off')} style={motion.style} role="listitem" data-st={st}>
              {r.brand
                ? <span className="dm-ic dm-brandic" aria-hidden="true"><Brand name={r.brand} /></span>
                : <span className="dm-ic" style={{ color, background: `color-mix(in srgb,${color} 12%,transparent)` }} aria-hidden="true"><Icon name={r.icon ?? 'clock'} size="xs" /></span>}
              <span className="dm-t">
                <span className="dm-nm">{r.name}</span>
                <Swap className="dm-d">{r.schedule + ' · ' + (on(r) ? r.next ?? '' : 'Paused')}</Swap>
                <span className="dm-res">{!running && (r.result === 'passed' || r.result === 'failed') && <Icon name={r.result === 'passed' ? 'ok' : 'alert'} size="xs" />}<Swap>{res}</Swap></span>
              </span>
              <span className="dm-shx-act">
                {onRunNow && <Tip label="Run now"><button type="button" className="dm-ib dm-shx-run" aria-label={`Run ${r.name} now`} disabled={running || !on(r)} onClick={() => onRunNow(r.key)}><Icon name="play" /></button></Tip>}
                <Tip label={on(r) ? 'Pause' : 'Resume'}><button type="button" className="dm-toggle" role="switch" aria-checked={on(r)} aria-label={r.name} onClick={() => toggle(r.key)} /></Tip>
              </span>
              <Fold open={r.result === 'failed' && !!r.fix} className="dm-shx-fx">
                <div><button type="button" className="dm-pill dm-accent dm-sm" onClick={() => !r.fixing && onFix?.(r.key)}>{r.fixing ? <><Spin />Reconnecting</> : r.fix}</button></div>
              </Fold>
            </div>
          );
        })}
      </div>
      {onCreate && <>
        <button type="button" className="dm-shx-add" {...menu.trigger} aria-haspopup="dialog" onClick={() => { menu.trigger.onClick(); if (!menu.open) requestAnimationFrame(() => field.current?.focus({ preventScroll: true })); }}><Icon name="plus" size="xs" />New schedule</button>
        <div {...menu.pop} style={{ ...menu.pop.style, ...bottom }} className={cx(menu.pop.className, 'dm-shx-pop')} role="dialog" aria-label="New schedule">
          <form className="dm-shx-f" onSubmit={create}>
            <h4>New schedule</h4>
            <input ref={field} className="dm-shx-in" value={task} onChange={e => setTask(e.target.value)} placeholder="What should the agent do?" aria-label="What should the agent do?" spellCheck={false} autoComplete="off" />
            <Seg className="dm-shx-rep" label="Repeat" value={repeat} onChange={setRepeat} options={[{ value: 'day', label: 'Every day' }, { value: 'monday', label: 'Every Monday' }, { value: 'custom', label: 'Custom' }]} />
            {repeat === 'custom' && (
              <div className="dm-shx-days" role="group" aria-label="Days">
                {DAY.map((d, i) => <button type="button" key={d} aria-pressed={custom.includes(i)} aria-label={FULL[i]} onClick={() => setCustom(c => c.includes(i) ? c.filter(x => x !== i) : [...c, i].sort())}>{d[0]}</button>)}
              </div>
            )}
            <div className="dm-shx-ff"><span className="dm-muted dm-shx-sum">{days.length ? firstRun(days, hour) : 'Pick at least one day'}</span><button type="submit" className="dm-pill dm-accent dm-sm" disabled={!task.trim() || !days.length}>Create</button></div>
          </form>
        </div>
      </>}
    </div>
  );
}
```

## More in Workspace

- [Automation canvas](https://designme.dev/components/automation-canvas.md): A trigger, a few agent steps, and a run you can watch flow through.
- [Canvas toolbar](https://designme.dev/components/canvas-toolbar.md): A floating toolbar for a workflow canvas: run, pick a tool, comment, fit and zoom.
- [Step library](https://designme.dev/components/step-library.md): Search the steps a workflow can use, preview what each does, and add one.
- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
- [Memory panel](https://designme.dev/components/memory-panel.md): What the agent remembers about your team, editable and removable.
- [Model compare](https://designme.dev/components/model-compare.md): Run one prompt on three models side by side and keep the best.
- [Agent settings](https://designme.dev/components/agent-settings.md): How much the agent may do alone, with a save bar for changes.
- [Tools and connections](https://designme.dev/components/tool-connections.md): The tools the agent can reach, and how much it may do with each.
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md): The files, sites and folders the agent knows, and how far each is indexed.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.
- [Workspace rail](https://designme.dev/components/workspace-rail.md): A slim app rail that opens into a labelled sidebar.

All components: https://designme.dev/llms.txt
