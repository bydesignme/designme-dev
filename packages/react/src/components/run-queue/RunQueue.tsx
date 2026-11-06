'use client';
import { useRef, type CSSProperties } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Fold, Seg, Swap } from '../../lib/motion';
import '../../designme.css';
import './run-queue.css';

export type RunState = 'queued' | 'running' | 'failed' | 'done';

export interface RunStep {
  label: string;
  state: RunState;
  /** What the step came to, shown once it is done, like "3 of 3" or "4 articles" */
  meta?: string;
}

export interface RunJob {
  /** Keeps the job's row when the list changes order. Defaults to the title */
  id?: string;
  /** What the job is, like "Draft the launch email" */
  title: string;
  /** Who does it, like "Copy agent", under the title */
  agent?: string;
  /** The icon on the job's badge. Defaults to a spark */
  icon?: IconName;
  state: RunState;
  /** How far the job is, 0 to 1. Defaults to the share of its steps that are done */
  progress?: number;
  /** The time at the end of the row: when a waiting job starts ("in ~4s"), what is left of a running one ("12s left") or how long a done one took ("4.2s") */
  time?: string;
  /** The line after the agent while it runs. Defaults to the step running, or the one that failed */
  note?: string;
  steps?: RunStep[];
}

export type RunQueueDensity = 'detailed' | 'compact';

export interface RunQueueProps {
  jobs: RunJob[];
  /** The queue's name over its status line */
  title?: string;
  /** Overrides the status line. Defaults to "1 of 4 done", "1 step failed, waiting for Retry" or "All 4 done" */
  status?: string;
  /** The line under "All 4 jobs done" once every job is done, like "18.4s in all · 1 retry" */
  summary?: string;
  /** detailed lists the running job's steps, compact folds them away. Leave it out to let the switch change it */
  density?: RunQueueDensity;
  defaultDensity?: RunQueueDensity;
  onDensityChange?: (density: RunQueueDensity) => void;
  /** Called by the Retry button on a failed step, with the job's and the step's index. Without it, failed steps show no button */
  onRetry?: (job: number, step: number) => void;
  /** Sits flat in a chat thread, with no card. Defaults to false: the queue on its card, as on designme.dev */
  bare?: boolean;
  className?: string;
}

const live = (s: RunState) => s === 'running' || s === 'failed';
const share = (j: RunJob) => j.progress ?? (j.steps?.length ? j.steps.filter(s => s.state === 'done').length / j.steps.length : j.state === 'done' ? 1 : 0);

function StepGlyph({ state }: { state: RunState }) {
  if (state === 'running') return <span className="dm-spin" aria-hidden="true" />;
  if (state === 'failed') return <Icon name="x" size="xs" />;
  if (state === 'done') return <Icon name="check" size="xs" />;
  return <span className="dm-dot" aria-hidden="true" />;
}

/** A queue of agent jobs: the one running, raised with its steps, progress and time left; the ones up next; and the ones done. */
export function RunQueue({ jobs, title = 'Run queue', status, summary, density, defaultDensity = 'detailed', onDensityChange, onRetry, bare = false, className }: RunQueueProps) {
  const [dens, setDens] = useControllable(density, defaultDensity, onDensityChange);
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const done = jobs.filter(j => j.state === 'done').length, fin = jobs.length > 0 && done === jobs.length;
  const failed = jobs.some(j => j.state === 'failed');
  const line = status ?? (fin ? `All ${jobs.length} done` : failed ? '1 step failed, waiting for Retry' : `${done} of ${jobs.length} done`);
  const keyOf = (j: RunJob) => j.id ?? j.title;
  const part = (s: RunState) => live(s) ? 'run' : s === 'done' ? 'done' : 'next';

  /* a job that moves to another part of the queue glides there from where it was, and the jobs it passes glide with it */
  const was = useRef(new Map<string, { part: string; top: number; left: number }>());
  useIsoLayoutEffect(() => {
    const el = box.current; if (!el) return;
    const moved = jobs.some(j => { const w = was.current.get(keyOf(j)); return w && w.part !== part(j.state); });
    el.querySelectorAll<HTMLElement>('.dm-rq-j[data-k]').forEach(row => {
      const k = row.dataset.k!, w = was.current.get(k), b = row.getBoundingClientRect();
      if (moved && w && !reduce) { const dx = w.left - b.left, dy = w.top - b.top;
        if (Math.abs(dx) + Math.abs(dy) > 1) row.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' }); }
      was.current.set(k, { part: row.dataset.p!, top: b.top, left: b.left });
    });
  }, [jobs.map(j => keyOf(j) + ':' + part(j.state)).join()]);

  const row = (j: RunJob, ji: number) => {
    const p = Math.max(0, Math.min(1, share(j))), s = j.state === 'running' ? 'run' : j.state === 'failed' ? 'fail' : j.state === 'done' ? 'done' : 'wait';
    const at = j.steps?.find(x => x.state === 'failed') ?? j.steps?.find(x => x.state === 'running');
    const note = live(j.state) ? j.note ?? at?.label : undefined;
    return (
      <li key={keyOf(j)} className="dm-rq-j" data-s={s} data-k={keyOf(j)} data-p={part(j.state)}>
        <div className="dm-rq-jh">
          <span className="dm-rq-av" aria-hidden="true"><Icon name={j.icon ?? 'spark'} /></span>
          <span className="dm-rq-jt"><b>{j.title}</b><Swap className="dm-rq-js">{[j.agent, note].filter(Boolean).join(' · ')}</Swap></span>
          <span className="dm-rq-jm dm-num">
            {j.time && <span>{j.time}</span>}
            {j.state === 'done' && <span className="dm-ok"><Icon name="check" size="xs" /></span>}
          </span>
        </div>
        <div className="dm-rq-jb" aria-hidden="true">
          <div className="dm-rq-bar"><i style={{ '--dm-p': p } as CSSProperties} /></div>
          <span className="dm-rq-pc dm-num">{Math.round(p * 100)}%</span>
        </div>
        <Fold open={dens === 'detailed' && live(j.state) && !!j.steps?.length} className="dm-rq-sf">
          <ul className="dm-rq-steps">
            {j.steps?.map((x, si) => (
              <li key={si} className={cx('dm-rq-sp', x.state === 'queued' ? 'dm-wait' : x.state === 'running' ? 'dm-run' : x.state === 'failed' ? 'dm-fail' : 'dm-done')}>
                <span className="dm-g"><StepGlyph state={x.state} /></span>
                <span>{x.label}</span>
                <span className="dm-m">
                  {x.state === 'failed' && onRetry
                    ? <button type="button" className="dm-rq-retry dm-enter" onClick={() => onRetry(ji, si)}>Retry</button>
                    : x.state === 'done' && x.meta ? <Swap>{x.meta}</Swap> : null}
                </span>
              </li>
            ))}
          </ul>
        </Fold>
      </li>
    );
  };
  const of = (ps: string) => jobs.map((j, ji) => part(j.state) === ps ? row(j, ji) : null);
  const waiting = jobs.some(j => part(j.state) === 'next');

  return (
    <div ref={box} data-dm="" className={cx('dm-rq', !bare && 'dm-panel dm-keep', fin && 'dm-fin', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-rq-h">
        <div className="dm-rq-ht"><b>{title}</b><Swap className="dm-rq-st dm-num">{line}</Swap></div>
        <Seg label="Density" value={dens} onChange={setDens} options={[{ value: 'detailed', label: 'Detailed' }, { value: 'compact', label: 'Compact' }]} />
      </div>
      <div className="dm-rq-tot" aria-hidden="true">
        {jobs.map(j => <i key={keyOf(j)} className={cx(j.state === 'failed' && 'dm-fail')}><b style={{ '--dm-p': Math.max(0, Math.min(1, share(j))) } as CSSProperties} /></i>)}
      </div>
      <div className="dm-rq-b">
        <Fold open={fin} className="dm-rq-ff">
          <div className="dm-rq-sec">
            <div className={cx('dm-rq-fin', fin && 'dm-enter')}>
              <span className="dm-rq-av" aria-hidden="true"><Icon name="ok" /></span>
              <span className="dm-rq-jt"><b className="dm-rq-ft">{`All ${jobs.length} jobs done`}</b>{summary && <span className="dm-rq-js">{summary}</span>}</span>
            </div>
          </div>
        </Fold>
        <Fold open={!fin} className="dm-rq-rf">
          <div className="dm-rq-sec"><span className="dm-rq-l">Running</span><ul className="dm-rq-run" aria-label="Running">{of('run')}</ul></div>
        </Fold>
        <Fold open={!fin} className="dm-rq-nf">
          <div className="dm-rq-sec"><span className="dm-rq-l">Up next</span><ol className="dm-rq-next" aria-label="Up next">{waiting ? of('next') : null}</ol><p className="dm-rq-none">Nothing waiting</p></div>
        </Fold>
        <Fold open className="dm-rq-df">
          <div className="dm-rq-sec"><span className="dm-rq-l">Done <span className="dm-num">{done}</span></span><ul className="dm-rq-done" aria-label="Done">{done ? of('done') : null}</ul><p className="dm-rq-none">Nothing done yet</p></div>
        </Fold>
      </div>
    </div>
  );
}
