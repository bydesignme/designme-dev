'use client';
import { useState, type KeyboardEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Think } from '../../lib/motion';
import '../../designme.css';
import './decision-prompt.css';

export interface DecisionOption {
  label: string;
  /** Quiet text at the end of the row, like "3 frames" or "Recommended" */
  detail?: string;
}
export interface DecisionQuestion {
  question: string;
  /** A short name for the question in the summary, like "Scope" */
  label: string;
  options: DecisionOption[];
}

export interface DecisionPromptProps {
  questions: DecisionQuestion[];
  /** The answers so far, an option's index or null for a skipped question. Leave it out to let Continue and Skip fill it */
  answers?: (number | null)[];
  defaultAnswers?: (number | null)[];
  onAnswersChange?: (answers: (number | null)[]) => void;
  /** Called once every question is answered, with the picked option's index for each, or null where the person skipped */
  onComplete?: (answers: (number | null)[]) => void;
  /** What the summary says for a skipped question */
  skippedLabel?: string;
  /** The line under the summary while the agent gets going */
  startLabel?: string;
  /** The agent has got going: the line under the summary settles with a check */
  started?: boolean;
  /** What that line says once started. Defaults to startLabel */
  startedLabel?: string;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

/** The agent asks a few quick questions before it starts. Number keys pick, Enter continues. */
export function DecisionPrompt({
  questions, answers: value, defaultAnswers = [], onAnswersChange, onComplete, skippedLabel = 'Agent decides', startLabel = 'Starting',
  started = false, startedLabel, bare = true, className
}: DecisionPromptProps) {
  const [answers, setAnswers] = useControllable(value, defaultAnswers, onAnswersChange);
  const [sel, setSel] = useState(0);
  const n = questions.length, at = answers.length, done = at >= n, q = questions[Math.min(at, n - 1)];

  const next = (skipped = false) => {
    if (done) return;
    const all = [...answers, skipped ? null : sel];
    setAnswers(all); setSel(0);
    if (all.length >= n) onComplete?.(all);
  };
  const key = (e: KeyboardEvent) => {
    if (done) return;
    const count = q.options.length;
    if (/^[1-9]$/.test(e.key) && +e.key <= count) { setSel(+e.key - 1); e.preventDefault(); }
    else if (e.key === 'Enter') { next(); e.preventDefault(); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { setSel((sel + (e.key === 'ArrowDown' ? 1 : count - 1)) % count); e.preventDefault(); }
  };

  return (
    <div data-dm="" className={cx('dm-dpx', !bare && 'dm-panel', className)} tabIndex={0} onKeyDown={key}>
      <div className="dm-dpx-h">
        <span className="dm-dpx-k dm-muted dm-num">{done ? 'All set' : `Question ${at + 1} of ${n}`}</span>
        <div className="dm-dpx-dots" aria-hidden="true">{questions.map((_, i) => <i key={i} className={cx(!done && i === at && 'dm-on', (done || i < at) && 'dm-done')} />)}</div>
      </div>
      {/* keyed by question, so each one plays its entrance */}
      <div className="dm-dpx-body" key={done ? 'sum' : at} aria-live="polite">
        {done ? (
          <div className="dm-dpx-sum">
            {questions.map((x, i) => (
              <div key={i} className={cx('dm-dpx-sr', enter().className)} style={enter(i * 70).style}>
                <span>{x.label}</span>{answers[i] === null ? skippedLabel : x.options[answers[i]!]?.label}
              </div>
            ))}
            <div className={cx('dm-dpx-run', enter().className)} style={enter(n * 70).style}>{started
              ? <><span style={{ color: 'var(--dm-ok)' }}><Icon name="check" size="xs" /></span><span>{startedLabel ?? startLabel}</span></>
              : <><Think /><span className="dm-shim">{startLabel}</span></>}</div>
          </div>
        ) : (
          <>
            <div className="dm-dpx-q dm-enter">{q.question}</div>
            <div role="radiogroup" aria-label={q.question}>
              {q.options.map((o, i) => (
                <button key={i} type="button" role="radio" aria-checked={i === sel} className={cx('dm-dpx-o', i === sel && 'dm-on', enter().className)} style={enter(60 + i * 50).style}
                  onClick={() => setSel(i)} onDoubleClick={() => next()}>
                  <span className="dm-kbd">{i + 1}</span>{o.label}{o.detail && <span className="dm-d">{o.detail}</span>}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <div className={cx('dm-dpx-f', done && 'dm-leave')} inert={done}>
        <button type="button" className="dm-pill dm-ghost dm-sm dm-dpx-skip" onClick={() => next(true)}>Skip</button>
        <button type="button" className="dm-pill dm-primary dm-sm dm-dpx-go" onClick={() => next()}>Continue <span className="dm-kbd">↵</span></button>
      </div>
    </div>
  );
}
