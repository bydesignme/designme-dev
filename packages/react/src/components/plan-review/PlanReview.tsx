'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Spin, Swap, SwapIcon, Think, Tip, useGrow } from '../../lib/motion';
import { useHoverGlide } from '../../lib/glide';
import '../../designme.css';
import './plan-review.css';

export interface PlanReviewStep {
  id: string;
  text: string;
  /** Left out of the plan; it stays in the list, struck through */
  skipped?: boolean;
  /** Marks a step the person rewrote */
  edited?: boolean;
  /** run while the agent works on it, retry while it waits out a problem (a rate limit, a timeout), done once it has */
  state?: 'run' | 'retry' | 'done';
  /** The line the step reports, under it: what it found, or what it waits on. Opens and crossfades when it changes */
  detail?: string;
}

export type PlanPhase = 'review' | 'running' | 'done';

export interface PlanReviewProps {
  /** Like "Plan: redesign the pricing page" */
  title: string;
  /** The steps. Leave `steps` out to let the person edit, skip and add steps on their own */
  steps?: PlanReviewStep[];
  defaultSteps?: PlanReviewStep[];
  onStepsChange?: (steps: PlanReviewStep[]) => void;
  /** review (steps can be edited), running (the agent works through them) or done */
  phase?: PlanPhase;
  /** The line under the title. Defaults to roughly how long the steps left in take (the list shows how many there are) */
  status?: string;
  /** The quiet line in the footer. Defaults to a hint for each phase */
  note?: string;
  /** Quiet text at the end of the header, like an elapsed time "0:04" */
  meta?: ReactNode;
  onApprove?: () => void;
  onRequestChanges?: () => void;
  onStop?: () => void;
  onSeeChanges?: () => void;
  /** Draws its own container (the default, as on designme.dev). Set true to sit it flat in a chat thread */
  bare?: boolean;
  className?: string;
}

// the foot never repeats the head: while the plan runs it has only Stop (owner, 18 Nov)
const NOTE: Record<PlanPhase, string> = { review: 'Click a step to edit it', running: '', done: '' };
let added = 0;

/** A plan the agent proposes before it starts: edit a step, skip it, add one, then approve. */
export function PlanReview({ title, steps, defaultSteps = [], onStepsChange, phase = 'review', status, note, meta, onApprove, onRequestChanges, onStop, onSeeChanges, bare = false, className }: PlanReviewProps) {
  // Clean's one hover glides from step to step
  const listRef = useRef<HTMLOListElement>(null);
  useHoverGlide(listRef, '.dm-plx-s');
  const [list, setList] = useControllable(steps, defaultSteps, onStepsChange);
  const live = useRef(list);
  useEffect(() => { live.current = list; });
  // each step remembers the words it came with, so "edited" shows only when they really changed
  const original = useRef(new Map<string, string>());
  list.forEach(s => { if (!original.current.has(s.id)) original.current.set(s.id, s.text); });
  // the rows stagger in once; after that the entrance comes off so a skipped step can fade
  const [entered, setEntered] = useState<Set<string>>(() => new Set());
  const first = useRef(new Set(list.map(s => s.id)));
  const focusId = useRef<string | null>(null);
  const textRefs = useRef(new Map<string, HTMLSpanElement>());

  useEffect(() => {
    const id = focusId.current, el = id && textRefs.current.get(id); if (!el) return;
    focusId.current = null; el.focus(); getSelection()?.selectAllChildren(el);
  });

  const update = (id: string, change: Partial<PlanReviewStep>) => setList(live.current.map(s => s.id === id ? { ...s, ...change } : s));
  const included = list.filter(s => !s.skipped);
  const editable = phase === 'review';
  let n = 0;
  // the panel grows with the plan (owner, 17 Nov): its height eases to its content, nothing kept for the final state
  const [growRef, growIn] = useGrow();

  return (
    <div data-dm="" ref={growRef} className={cx('dm-plx', 'dm-growing dm-mx-grow', !bare && 'dm-panel', className)}>
      <div className="dm-grow" ref={growIn}>
      <div className="dm-plx-h">
        <Think on={phase === 'running'} className="dm-plx-mk" />
        <div className="dm-plx-ht"><b>{title}</b><Swap className={cx('dm-muted dm-plx-st', phase === 'running' && 'dm-shim')}>{status ?? `About ${Math.max(1, Math.round(included.length * .8))} min`}</Swap></div>
        {meta !== undefined && <span className="dm-plx-tm dm-num">{meta}</span>}
      </div>
      <ol ref={listRef} className="dm-plx-list dm-mx-glide dm-mx-ic">
        {list.map((s, i) => {
          const num = s.skipped ? '–' : String(++n);
          const entering = !entered.has(s.id);
          return (
            <li key={s.id} className={cx('dm-plx-s', entering && 'dm-enter', s.skipped && 'dm-off', s.state && 'dm-' + s.state, s.edited && 'dm-edited')}
              style={entering ? { animationDelay: (first.current.has(s.id) ? 100 + i * 60 : 0) + 'ms' } : undefined}
              onAnimationEnd={e => { if (e.target === e.currentTarget) setEntered(prev => new Set(prev).add(s.id)); }}>
              <span className="dm-n">{s.state ? <SwapIcon id={s.state}>{s.state === 'done' ? <Icon name="check" size="xs" /> : s.state === 'run' ? <Spin /> : s.state === 'retry' ? <Icon name="clock" size="xs" /> : num}</SwapIcon> : num}</span>
              <span className="dm-b">
              <span className={cx('dm-t', s.state === 'run' && 'dm-shim')} ref={el => { if (el) textRefs.current.set(s.id, el); else textRefs.current.delete(s.id); }}
                contentEditable={editable} suppressContentEditableWarning spellCheck={false} role={editable ? 'textbox' : undefined} aria-label={editable ? `Step ${num}` : undefined}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
                onBlur={e => { const text = e.currentTarget.textContent ?? ''; if (text !== s.text) update(s.id, { text, edited: text.trim() !== original.current.get(s.id) }); }}>
                {s.text}
              </span>
              <span className={cx('dm-d', s.detail && 'dm-on', s.state === 'retry' && 'dm-warn')}><Swap className={s.state === 'run' && s.detail ? 'dm-shim' : undefined}>{s.detail ?? ''}</Swap></span>
              </span>
              {editable && (
                <Tip label={s.skipped ? 'Include step' : 'Skip step'}>
                  <button type="button" className="dm-ib dm-plx-x dm-mx-press" aria-label={s.skipped ? 'Include step' : 'Skip step'} onClick={() => update(s.id, { skipped: !s.skipped })}>
                    <SwapIcon id={s.skipped ? 'undo' : 'x'}><Icon name={s.skipped ? 'undo' : 'x'} size="xs" /></SwapIcon>
                  </button>
                </Tip>
              )}
            </li>
          );
        })}
      </ol>
      {editable && (
        <button type="button" className="dm-plx-add" onClick={() => { const id = `new-${++added}`; focusId.current = id; setList([...live.current, { id, text: 'New step' }]); }}>
          <Icon name="plus" size="xs" />Add a step
        </button>
      )}
      <div className="dm-plx-f" key={phase}>
        <Swap className="dm-muted dm-plx-n">{note ?? NOTE[phase]}</Swap>
        {phase === 'review' && <>
          <button type="button" className="dm-pill dm-ghost dm-sm dm-plx-chg dm-mx-press" onClick={onRequestChanges}>Ask for changes</button>
          <button type="button" className="dm-pill dm-primary dm-sm dm-plx-go" onClick={onApprove}>Approve plan</button>
        </>}
        {phase === 'running' && <button type="button" className="dm-pill dm-ghost dm-sm dm-plx-stop dm-mx-press dm-enter" style={{ animationDelay: '50ms' }} onClick={onStop}><Icon name="stop" size="xs" />Stop</button>}
        {phase === 'done' && <button type="button" className="dm-pill dm-line dm-sm dm-mx-press dm-enter" onClick={onSeeChanges}><Icon name="eye" size="xs" />See changes</button>}
      </div>
      </div>
    </div>
  );
}
