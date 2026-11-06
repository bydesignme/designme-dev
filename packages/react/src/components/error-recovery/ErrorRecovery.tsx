'use client';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Dot, Fold, Spin, Swap } from '../../lib/motion';
import '../../designme.css';
import './error-recovery.css';

export type RecoveryStepState = 'done' | 'fail' | 'run' | 'wait' | 'skip' | 'hand';

export interface RecoveryStep {
  label: string;
  /** done, fail (red note), run (spinner), wait (not started), skip (struck through) or hand (passed to a person) */
  state: RecoveryStepState;
  /** The quiet line under the step, like "Done in 8s" or the error. Crossfades when it changes */
  note?: string;
}

export interface RecoveryOption {
  value: string;
  label: string;
}

export interface ErrorRecoveryProps {
  /** What the agent was doing, like "Sync the pipeline to Sheets" */
  title: string;
  /** Where the run stands, like "Stopped at step 2". Crossfades when it changes */
  status?: string;
  steps: RecoveryStep[];
  /** The question above the choices */
  question?: string;
  /** The ways the agent can carry on */
  options: RecoveryOption[];
  /** The chosen option. Leave it out to let the choices hold their own selection */
  value?: string;
  /** Defaults to the first option */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the chosen option when Continue is pressed */
  onContinue?: (value: string) => void;
  continueLabel?: string;
  /** Whether the choices show. Leave it out and they fold away once Continue is pressed */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

function Glyph({ state }: { state: RecoveryStepState }) {
  if (state === 'done') return <span style={{ color: 'var(--dm-ok)' }}><Icon name="check" size="xs" /></span>;
  if (state === 'fail') return <span style={{ color: 'var(--dm-bad)' }}><Icon name="alert" size="xs" /></span>;
  if (state === 'run') return <Spin />;
  if (state === 'skip') return <span className="dm-muted"><Icon name="chev-r" size="xs" /></span>;
  if (state === 'hand') return <span style={{ color: 'var(--dm-pl)' }}><Icon name="user" size="xs" /></span>;
  return <Dot color="var(--dm-faint)" />;
}

/** A run that hit an error, with the steps around it and a choice of how the agent should carry on. */
export function ErrorRecovery({ title, status, steps, question = 'How should the agent continue?', options, value, defaultValue, onValueChange, onContinue, continueLabel = 'Continue', open, defaultOpen = true, onOpenChange, bare = true, className }: ErrorRecoveryProps) {
  const [pick, setPick] = useControllable(value, defaultValue ?? options[0]?.value ?? '', onValueChange);
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);

  return (
    <div data-dm="" className={cx('dm-erx', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-erx-h">
        <span className="dm-erx-t">{title}</span>
        {status !== undefined && <Swap className="dm-erx-s dm-muted">{status}</Swap>}
      </div>
      <div className="dm-erx-list">
        {steps.map((s, i) => (
          <div key={i} className={cx('dm-erx-row', 'dm-' + s.state)}>
            {/* keyed by state and note, so a new state plays its entrance like the site does */}
            <span className="dm-g"><span key={s.state + '\u0000' + (s.note ?? '')} className="dm-enter" style={{ display: 'grid' }}><Glyph state={s.state} /></span></span>
            <span className="dm-tx">{s.label}<Swap className="dm-d">{s.note ?? ''}</Swap></span>
          </div>
        ))}
      </div>
      <Fold open={isOpen} className="dm-erx-box">
        <div className="dm-erx-in">
          <div className="dm-erx-q">{question}</div>
          <div className="dm-erx-opts" role="radiogroup" aria-label={question}>
            {options.map(o => (
              <button type="button" key={o.value} className={cx('dm-erx-o', o.value === pick && 'dm-on')} role="radio" aria-checked={o.value === pick} onClick={() => setPick(o.value)}>
                <i /><span>{o.label}</span>
              </button>
            ))}
          </div>
          <button type="button" className="dm-pill dm-primary dm-sm dm-erx-go" onClick={() => { setOpen(false); onContinue?.(pick); }}>{continueLabel}</button>
        </div>
      </Fold>
    </div>
  );
}
