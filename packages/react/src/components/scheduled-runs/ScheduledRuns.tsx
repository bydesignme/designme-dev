'use client';
import { useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { Brand, type BrandName } from '../../lib/brands';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { enter, Fold, Seg, Spin, Swap, Tip } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
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
