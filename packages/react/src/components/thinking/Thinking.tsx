'use client';
import { useEffect, useRef } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion, useSeconds } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Fold, Spin, Swap, Think, Tip } from '../../lib/motion';
import '../../designme.css';
import './thinking.css';

export interface ThinkingStep {
  /** What the agent does, like "Measure the plan cards" */
  label: string;
  /** running spins and shimmers, retry waits out a problem in amber, done turns into a check */
  state: 'running' | 'retry' | 'done';
  /** What the step found, or what it waits on, under it: "3 cards are off the 8px grid". Opens and crossfades when it changes */
  result?: string;
  /** More detail shown when you hover the result, like the measured values */
  resultTip?: string;
  /** How long the step took, like "1.3s", shown at its right once it is done */
  time?: string;
}

export interface ThinkingProps {
  steps: ThinkingStep[];
  /** Spins, counts seconds and keeps the trace open while true */
  running: boolean;
  /** Seconds to show. Leave it out to let it count while running */
  seconds?: number;
  /** The header while it runs, like "Checking the pricing page" */
  title?: string;
  /** The header once it is done: what the work came to, like "3 cards to fix, 2 changes planned". Defaults to the number of steps */
  summary?: string;
  /** Folds the trace away a moment after it finishes */
  collapseWhenDone?: boolean;
  /** Whether the trace is open. Leave it out to let the header toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** A line that settles in place when its words change, sharpening out of a soft blur. While it shimmers it just takes the new words */
function Settle({ children, shimmer, className }: { children: string; shimmer: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef({ text: children, shimmer });
  const reduce = useReducedMotion();
  useIsoLayoutEffect(() => {
    const el = ref.current, was = prev.current; prev.current = { text: children, shimmer };
    if (!el) return;
    // the shimmer draws the words in a clear colour; going straight to the solid colour stops it fading in from nothing
    if (was.shimmer && !shimmer){ el.style.transition = 'none'; void el.offsetWidth; requestAnimationFrame(() => { el.style.transition = ''; }); }
    if (shimmer || reduce || was.text === children) return;
    const bp = getComputedStyle(el).getPropertyValue('--dm-motion').trim() === 'bp';
    el.animate(bp ? [{ opacity: .6 }, { opacity: 1 }] : [{ opacity: .6, filter: 'blur(1.5px)' }, { opacity: 1, filter: 'blur(0)' }],
      { duration: bp ? 220 : 460, easing: bp ? 'steps(3, end)' : 'cubic-bezier(.22,1,.36,1)' });
  }, [children, shimmer]);
  return <span ref={ref} className={cx(shimmer && 'dm-shim', className)}>{children}</span>;
}

/** What a finished step found, written in a word at a time */
function Words({ text }: { text: string }) {
  const w = text.split(' ');
  return <>{w.map((x, i) => <span key={i} className="dm-w" style={{ animationDelay: `${i * 45}ms` }}>{x}{i < w.length - 1 ? ' ' : ''}</span>)}</>;
}

function Mark({ state }: { state: ThinkingStep['state'] }) {
  if (state === 'running') return <Spin />;
  // keyed so each new mark plays its entrance once
  return <span key={state} className="dm-enter" style={{ display: 'grid' }}><Icon name={state === 'retry' ? 'clock' : 'check'} size="xs" /></span>;
}

/** The live trace: each step the agent takes on a line that turns green as they finish, and what each found, then a header
    that says what the work came to, folded away. */
export function Thinking({ steps, running, seconds, title = 'Working on it', summary, collapseWhenDone = true, open, defaultOpen = true, onOpenChange, className }: ThinkingProps) {
  const counted = useSeconds(running && seconds === undefined);
  const secs = seconds ?? counted;
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  // once it finishes, the trace waits a beat and folds itself away
  useEffect(() => {
    if (running || !collapseWhenDone || !steps.length) return;
    const t = setTimeout(() => setOpen(false), 2500);
    return () => clearTimeout(t);
  }, [running, collapseWhenDone, steps.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const done = !running && steps.length > 0;

  return (
    <div data-dm="" className={cx('dm-tk', className)} data-open={isOpen ? '1' : '0'}>
      <button type="button" className={cx('dm-tk-h', done && 'dm-tk-fin')} aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
        <span className="dm-tk-mark">{done ? <span key="ok" {...enter()} style={{ display: 'grid' }}><Icon name="ok" /></span> : <Think on={running} />}</span>
        <Settle className="dm-tk-title" shimmer={running}>{done ? summary ?? `${steps.length} ${steps.length === 1 ? 'step' : 'steps'}` : title}</Settle>
        <span className="dm-tk-time dm-num">{secs + 's'}</span>
        <Icon name="chev-d" size="xs" className="dm-tk-chev" />
      </button>
      <Fold open={isOpen} className="dm-tk-fold">
        <ol className="dm-tk-list" aria-live="polite">
          {steps.map((s, i) => (
            <li key={i} className={cx('dm-tk-st dm-enter', s.state === 'running' ? 'dm-run' : 'dm-' + s.state)}>
              <span className="dm-mk"><Mark state={s.state} /></span>
              <div className="dm-tx">
                <span className="dm-tk-ln">
                  <Settle className="dm-lab" shimmer={s.state === 'running'}>{s.label}</Settle>
                  {s.state === 'done' && s.time && <span key="t" className="dm-tk-dur dm-num dm-enter">{s.time}</span>}
                </span>
                <span className={cx('dm-res', s.result && 'dm-on')}>
                  {s.state === 'done' && s.result
                    ? <span key={'w' + s.result}>{s.resultTip ? <Tip label={s.resultTip}><span tabIndex={0} data-tip=""><Words text={s.result} /></span></Tip> : <Words text={s.result} />}</span>
                    : <Swap>{s.result ?? ''}</Swap>}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </Fold>
    </div>
  );
}
