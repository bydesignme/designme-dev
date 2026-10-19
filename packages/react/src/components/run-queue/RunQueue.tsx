'use client';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Dot, Fold, Seg, Swap } from '../../lib/motion';
import '../../designme.css';
import './run-queue.css';

export type RunState = 'queued' | 'running' | 'failed' | 'done';

export interface RunStep {
  label: string;
  state: RunState;
  /** Quiet detail at the end once the step is done, like "3/3" or "4 articles". Defaults to "Done" */
  meta?: string;
}

export interface RunGroup {
  /** One task in the queue, like "Draft the launch email" */
  title: string;
  state: RunState;
  steps: RunStep[];
  /** Overrides the words at the end of the row, like "Retrying". Defaults to Queued, Running, "1 step failed" or Done */
  meta?: string;
}

export type RunQueueDensity = 'detailed' | 'compact';

export interface RunQueueProps {
  groups: RunGroup[];
  /** detailed lists every step under its task, compact folds them away. Leave it out to let the switch change it */
  density?: RunQueueDensity;
  defaultDensity?: RunQueueDensity;
  onDensityChange?: (density: RunQueueDensity) => void;
  /** Called by the Retry button on a failed step. Without it, failed steps show no button */
  onRetry?: (group: number, step: number) => void;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to put the list on a card */
  bare?: boolean;
  className?: string;
}

const groupMeta = (g: RunGroup) => {
  if (g.meta) return g.meta;
  if (g.state === 'failed') { const n = g.steps.filter(s => s.state === 'failed').length || 1; return `${n} step${n > 1 ? 's' : ''} failed`; }
  return g.state === 'running' ? 'Running' : g.state === 'done' ? 'Done' : 'Queued';
};

function GroupGlyph({ state }: { state: RunState }) {
  if (state === 'running') return <span className="dm-spin" style={{ color: 'var(--dm-fg)' }} />;
  if (state === 'failed') return <span style={{ color: 'var(--dm-bad)' }}><Icon name="alert" size="xs" /></span>;
  if (state === 'done') return <span style={{ color: 'var(--dm-ok)' }}><Icon name="check" size="xs" /></span>;
  return <Dot color="var(--dm-faint)" />;
}

function StepGlyph({ state }: { state: RunState }) {
  if (state === 'running') return <span className="dm-spin" style={{ width: 10, height: 10 }} />;
  if (state === 'failed') return <span style={{ color: 'var(--dm-bad)' }}><Icon name="x" size="xs" /></span>;
  if (state === 'done') return <span style={{ color: 'var(--dm-ok)' }}><Icon name="check" size="xs" /></span>;
  return <span className="dm-dot" style={{ color: 'var(--dm-faint)', width: 5, height: 5 }} />;
}

/** A queue of agent tasks, each with its own steps, a progress line and a retry for the step that failed. */
export function RunQueue({ groups, density, defaultDensity = 'detailed', onDensityChange, onRetry, bare = true, className }: RunQueueProps) {
  const [dens, setDens] = useControllable(density, defaultDensity, onDensityChange);
  const done = groups.filter(g => g.state === 'done').length;
  return (
    <div data-dm="" className={cx('dm-rq', className)}>
      <div className="dm-rq-top">
        <Seg label="Density" value={dens} onChange={setDens} options={[{ value: 'detailed', label: 'Detailed' }, { value: 'compact', label: 'Compact' }]} />
        <Swap className="dm-rq-all dm-muted dm-num">{`${done} of ${groups.length} done`}</Swap>
      </div>
      <div className={cx('dm-rq-list', !bare && 'dm-panel')} style={bare ? { paddingInline: 0 } : undefined}>
        {groups.map((g, gi) => {
          const finished = g.steps.filter(s => s.state === 'done').length;
          return (
            <div key={gi} className="dm-rq-g">
              <div className="dm-rq-gh">
                <span className="dm-g"><GroupGlyph state={g.state} /></span>
                <span>{g.title}</span>
                <Swap className="dm-m">{groupMeta(g)}</Swap>
              </div>
              <div className="dm-rq-bar"><i style={{ width: (g.steps.length ? finished / g.steps.length * 100 : 0) + '%' }} /></div>
              <Fold open={dens === 'detailed'}>
                {g.steps.map((s, si) => (
                  <div key={si} className={cx('dm-rq-sub', s.state === 'queued' && 'dm-wait')}>
                    <span className="dm-g"><StepGlyph state={s.state} /></span>
                    <span>{s.label}</span>
                    {s.state === 'failed' && onRetry
                      ? <span className="dm-m"><button type="button" className="dm-rq-retry" onClick={() => onRetry(gi, si)}>Retry</button></span>
                      : <Swap className="dm-m">{s.state === 'done' ? s.meta ?? 'Done' : ''}</Swap>}
                  </div>
                ))}
              </Fold>
            </div>
          );
        })}
      </div>
    </div>
  );
}
