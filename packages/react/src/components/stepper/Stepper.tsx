'use client';
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import '../../designme.css';
import './stepper.css';

export interface StepperOption {
  /** Like "Balanced" */
  label: string;
  /** The quiet line under it, like "Recommended" */
  detail?: string;
}

export interface StepperStep {
  /** The short name on the track, like "Agent" */
  label: string;
  /** The question at the top of the step, like "How should the agent work?" */
  title: string;
  /** The quiet line under the title */
  description?: string;
  /** The choices, one of which is picked. Leave them out and pass `content` for a step of your own */
  options?: StepperOption[];
  /** Your own fields for this step, shown under the title in place of the options */
  content?: ReactNode;
  /** The option picked to begin with. Defaults to the first */
  defaultOption?: number;
}

export interface StepperProps {
  steps: StepperStep[];
  /** The step on screen, from 0. steps.length shows the finished screen. Leave it out to let Back and Continue move it */
  step?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  /** The picked option of each step, by index */
  values?: number[];
  defaultValues?: number[];
  onValuesChange?: (values: number[]) => void;
  /** Called on Continue or Finish before moving on. Return false (or a promise of false) to stay on the step, for example to show an error */
  onNext?: (step: number, values: number[]) => boolean | void | Promise<boolean | void>;
  /** Called with the picks when the last step is finished */
  onFinish?: (values: number[]) => void;
  /** The finished screen's heading, like "You're set up" */
  doneTitle?: string;
  /** The line under it. Defaults to the picked options, joined with dots */
  doneDetail?: ReactNode;
  backLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  restartLabel?: string;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

/** A few steps of setup, one question at a time, with a track that fills in as you go. */
export function Stepper({ steps, step, defaultStep = 0, onStepChange, values, defaultValues, onValuesChange, onNext, onFinish,
  doneTitle = "You're set up", doneDetail, backLabel = 'Back', nextLabel = 'Continue', finishLabel = 'Finish', restartLabel = 'Start over', bare = true, className }: StepperProps) {
  const [cur, setCur] = useControllable(step, defaultStep, onStepChange);
  const [picks, setPicks] = useControllable(values, defaultValues ?? steps.map(s => s.defaultOption ?? 0), onValuesChange);
  // each move slides the new step in from the side it comes from; the first step just appears
  const [seen, setSeen] = useState({ step: cur, dir: 0, key: 0 });
  if (seen.step !== cur) setSeen({ step: cur, dir: cur > seen.step ? 1 : -1, key: seen.key + 1 });
  const [busy, setBusy] = useState(false);
  const finished = cur >= steps.length;

  const next = async () => {
    if (finished) { setCur(0); return; }
    if (onNext) {
      setBusy(true);
      try { if ((await onNext(cur, picks)) === false) return; } finally { setBusy(false); }
    }
    if (cur === steps.length - 1) onFinish?.(picks);
    setCur(cur + 1);
  };
  const pick = (i: number, k: number) => setPicks(steps.map((_, j) => (j === i ? k : picks[j] ?? 0)));
  const s = steps[cur];

  return (
    <div data-dm="" className={cx('dm-stx', !bare && 'dm-panel', className)}>
      <div className="dm-stx-track">
        {steps.map((st, i) => [
          // a finished step on the track takes you back to it
          <div key={'s' + i} className={cx('dm-stx-st', i === cur && 'dm-on', i < cur && 'dm-done')} aria-current={i === cur ? 'step' : undefined}
            {...(i < cur && { role: 'button', tabIndex: 0, onClick: () => setCur(i), onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCur(i); } } })}>
            <span className="dm-n">{i < cur ? <Icon name="check" size="xs" /> : i + 1}</span><span className="dm-lb">{st.label}</span>
          </div>,
          i < steps.length - 1 && <div key={'l' + i} className={cx('dm-stx-ln', i < cur && 'dm-full')}><i /></div>
        ])}
      </div>
      <div className="dm-stx-vp">
        <div key={seen.key} className={cx('dm-stx-body', seen.dir > 0 && 'dm-inr', seen.dir < 0 && 'dm-inl')}>
          {finished ? (
            <div className="dm-stx-dn">
              <Icon name="ok" />
              <b>{doneTitle}</b>
              <span className="dm-muted">{doneDetail ?? steps.map((st, k) => st.options?.[picks[k] ?? 0]?.label).filter(Boolean).join(' · ')}</span>
            </div>
          ) : (
            <>
              <h4>{s.title}</h4>
              {s.description && <p>{s.description}</p>}
              {s.content ?? (s.options && (
                <div className="dm-stx-opts" role="radiogroup" aria-label={s.title}>
                  {s.options.map((o, k) => (
                    <button type="button" key={k} role="radio" aria-checked={picks[cur] === k} className={cx('dm-stx-o', picks[cur] === k && 'dm-on')} onClick={() => pick(cur, k)}>
                      <b style={{ fontWeight: 500 }}>{o.label}</b>{o.detail && <span>{o.detail}</span>}
                    </button>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="dm-stx-f">
        <button type="button" className="dm-pill dm-ghost dm-sm dm-stx-bk" disabled={cur === 0} onClick={() => setCur(Math.max(0, cur - 1))}>{backLabel}</button>
        <button type="button" className="dm-pill dm-ink dm-sm dm-stx-nx" disabled={busy} onClick={next}>{finished ? restartLabel : cur === steps.length - 1 ? finishLabel : nextLabel}</button>
      </div>
    </div>
  );
}
