'use client';
import { useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { mxIn, mxOut, Think, useGrow } from '../../lib/motion';
import { giveBack } from '../../lib/popover';
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
  /** The line that takes the buttons' place, under the summary, while the agent gets going */
  startLabel?: string;
  /** The agent has got going: that line settles with a green check */
  started?: boolean;
  /** What that line says once started. Defaults to startLabel */
  startedLabel?: string;
  /** Draws its own container (the default, as on designme.dev). Set true to sit it flat in a chat thread */
  bare?: boolean;
  className?: string;
}

/** The agent asks a few quick questions before it starts. Number keys pick, Enter continues. */
export function DecisionPrompt({
  questions, answers: value, defaultAnswers = [], onAnswersChange, onComplete, skippedLabel = 'Agent decides', startLabel = 'Starting',
  started = false, startedLabel, bare = false, className
}: DecisionPromptProps) {
  const [answers, setAnswers] = useControllable(value, defaultAnswers, onAnswersChange);
  const [sel, setSel] = useState(0);
  const n = questions.length, at = answers.length, done = at >= n, q = questions[Math.min(at, n - 1)];

  // no room is kept for the next question or the summary: the card grows and shrinks with them
  const [root, inner] = useGrow();
  // the question answered leaves to the side first, quickly, and the next one comes in from the other, piece by piece, as the
  // card eases to its height (motion pieces); after the last, the head, the question and the buttons leave before the summary
  // rises in. A key pressed while it turns waits for it
  const turning = useRef(false);
  const next = (skipped = false) => {
    if (done || turning.current) return;
    const all = [...answers, skipped ? null : sel], el = root.current, last = all.length >= n;
    const commit = () => {
      setAnswers(all); setSel(0);
      if (last) {
        // the buttons give way to the line saying the agent has started: a focus that was on them comes back to the card
        if (root.current?.querySelector('.dm-dpx-f')?.contains(document.activeElement)) giveBack(root.current);
        onComplete?.(all);
      }
    };
    const going = el ? [...(el.querySelector('.dm-dpx-body')?.children ?? []), ...(last ? [el.querySelector('.dm-dpx-k'), ...(el.querySelector('.dm-dpx-f')?.children ?? [])] : [])] : [];
    if (!going.length) return commit();
    turning.current = true;
    mxOut(going, { x: -12 }).then(() => {
      turning.current = false; commit();
      // (anything a held answer leaves in place comes back)
      requestAnimationFrame(() => going.forEach(g => { const m = g as HTMLElement & { _mx?: Animation[] }; if (g?.isConnected && m._mx?.[0]?.playState === 'finished') m._mx.forEach(a => a.cancel()); }));
    });
  };
  const body = useRef<HTMLDivElement>(null), foot = useRef<HTMLDivElement>(null), seen = useRef(at);
  useIsoLayoutEffect(() => {
    if (seen.current === at) return; seen.current = at;
    const b = body.current; if (!b) return;
    if (done) mxIn([...b.querySelectorAll('.dm-dpx-sr'), foot.current?.querySelector('.dm-dpx-run')], { step: 50 });
    else mxIn([b.querySelector('.dm-dpx-q'), ...b.querySelectorAll('.dm-dpx-o')], { x: 12, base: 20 });
  }, [at, done]);
  const key = (e: KeyboardEvent) => {
    if (done || turning.current) return;
    const count = q.options.length;
    if (/^[1-9]$/.test(e.key) && +e.key <= count) { setSel(+e.key - 1); e.preventDefault(); }
    else if (e.key === 'Enter') { next(); e.preventDefault(); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { setSel((sel + (e.key === 'ArrowDown' ? 1 : count - 1)) % count); e.preventDefault(); }
  };

  return (
    <div data-dm="" ref={root} className={cx('dm-dpx', !bare && 'dm-panel', 'dm-growing dm-mx-grow', done && 'dm-done', className)} tabIndex={0} onKeyDown={key}>
      <div ref={inner} className="dm-grow">
      <div className="dm-dpx-h">
        <span className="dm-dpx-k dm-muted dm-num">{done ? 'All set' : `Question ${at + 1} of ${n}`}</span>
        {/* once every question is answered the steps are over: the dots fade away where they are, keeping their room */}
        <div className={cx('dm-dpx-dots', done && 'dm-gone')} aria-hidden="true">{questions.map((_, i) => <i key={i} className={cx(!done && i === at && 'dm-on', (done || i < at) && 'dm-done')} />)}</div>
      </div>
      {/* keyed by question, so each one is drawn afresh and plays its entrance */}
      <div ref={body} className="dm-dpx-body" key={done ? 'sum' : at} aria-live="polite">
        {done ? (
          <div className="dm-dpx-sum">
            {questions.map((x, i) => (
              <div key={i} className="dm-dpx-sr">
                <span>{x.label}</span>{answers[i] === null ? skippedLabel : x.options[answers[i]!]?.label}
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* the next question plays its entrance (above); the first is drawn from the start, so a frame that doesn't animate yet
                (a small live preview off screen) still shows it */}
            <div className="dm-dpx-q">{q.question}</div>
            <div className="dm-dpx-opts" role="radiogroup" aria-label={q.question}>
              {q.options.map((o, i) => (
                <button key={i} type="button" role="radio" aria-checked={i === sel} className={cx('dm-dpx-o dm-mx-press', i === sel && 'dm-on')}
                  onClick={() => setSel(i)} onDoubleClick={() => next()}>
                  <span className="dm-kbd">{i + 1}</span>{o.label}{o.detail && <span className="dm-d">{o.detail}</span>}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {/* once every question is answered, the line saying the agent has started takes the buttons' place */}
      <div ref={foot} className={cx('dm-dpx-f', done && 'dm-run')}>
        {done ? (
          <div className="dm-dpx-run" aria-live="polite">{started
            ? <><span className="dm-dpx-ok"><Icon name="check" size="xs" /></span><span>{startedLabel ?? startLabel}</span></>
            : <><Think /><span className="dm-shim">{startLabel}</span></>}</div>
        ) : (
          <>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-dpx-skip" onClick={() => next(true)}>Skip</button>
            <button type="button" className="dm-pill dm-primary dm-sm dm-dpx-go" onClick={() => next()}>Continue <span className="dm-kbd">↵</span></button>
          </>
        )}
      </div>
      </div>
      {/* the head goes once every question is answered, so this line tells screen readers */}
      <p className="dm-dpx-live" aria-live="polite">{done ? 'All questions answered' : ''}</p>
    </div>
  );
}
