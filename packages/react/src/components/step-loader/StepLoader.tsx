'use client';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Bars, Dot, Fold, Radar, Spin, Swap, Think } from '../../lib/motion';
import './step-loader.css';

export interface Step {
  /** Shown while the step runs, like "Reading Figma frames" */
  label: string;
  /** Shown once it is done, like "Read 4 frames". Falls back to label */
  done?: string;
}

export type StepLoaderGlyph = 'radar' | 'dots' | 'ring' | 'bars';

export interface StepLoaderProps {
  steps: Step[];
  /** Index of the step running now. steps.length (or more) means every step is done */
  current: number;
  /** The loader beside the running step */
  loader?: StepLoaderGlyph;
  /** Label once every step is done */
  doneLabel?: string;
  /** Whether the list of every step is open. Leave it out to let the row toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const Loader = ({ kind }: { kind: StepLoaderGlyph }) =>
  kind === 'dots' ? <Think /> : kind === 'ring' ? <Spin /> : kind === 'bars' ? <Bars /> : <Radar />;

/** Named steps with a progress track. Click the row to see every step. */
export function StepLoader({ steps, current, loader = 'radar', doneLabel = 'Ready for review', open, defaultOpen = false, onOpenChange, className }: StepLoaderProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const n = steps.length, done = current >= n, at = Math.min(current, n - 1);
  return (
    <div data-dm="" className={cx('dm-stl', className)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <button type="button" className="dm-stl-row" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
        <span className="dm-stl-g">{done ? <span style={{ color: 'var(--dm-ok)', display: 'grid' }}><Icon name="ok" /></span> : <Loader kind={loader} />}</span>
        <span className="dm-stl-t"><Swap className={cx('dm-stl-lab', !done && 'dm-shim')}>{done ? doneLabel : steps[at].label}</Swap></span>
        <Swap className="dm-stl-n dm-num">{`${done ? n : at + 1}/${n}`}</Swap>
        <Icon name="chev-d" size="xs" className="dm-stl-chev" />
      </button>
      <div className="dm-stl-track" role="progressbar" aria-valuemin={0} aria-valuemax={n} aria-valuenow={done ? n : at}>
        {steps.map((_, i) => <i key={i} className={cx((done || i < current) && 'dm-on', !done && i === current && 'dm-run')} />)}
      </div>
      <Fold open={isOpen} className="dm-stl-fold">
        <ol className="dm-stl-list">
          {steps.map((s, i) => {
            const finished = done || i < current, running = !done && i === current;
            return (
              <li key={i} className={cx(finished && 'dm-done', running && 'dm-run')}>
                <span className="dm-g">{finished ? <span style={{ color: 'var(--dm-ok)', display: 'grid' }}><Icon name="check" size="xs" /></span> : running ? <Loader kind={loader} /> : <Dot color="var(--dm-faint)" />}</span>
                {finished ? s.done ?? s.label : s.label}
              </li>
            );
          })}
        </ol>
      </Fold>
    </div>
  );
}
