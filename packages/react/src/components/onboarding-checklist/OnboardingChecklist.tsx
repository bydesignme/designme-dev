'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Fold, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './onboarding-checklist.css';

export interface OnboardingStep {
  /** Names the step in `done` and `running`. Defaults to the title */
  key?: string;
  /** Like "Connect Figma" */
  title: string;
  /** The quiet line under it, like "So the agent can read your frames" */
  detail?: string;
  /** Ticked off when the checklist starts, if `done` and `defaultDone` are left out */
  done?: boolean;
  /** Shows a "Do it for me" button on hover, which calls `onDoIt` */
  automatic?: boolean;
}

export interface OnboardingChecklistProps {
  steps: OnboardingStep[];
  /** Keys of the steps that are done. Leave it out to let the checkboxes tick them */
  done?: string[];
  defaultDone?: string[];
  onDoneChange?: (done: string[]) => void;
  /** Keys of the steps the agent is doing right now: a spinner in the checkbox and `runningLabel` under the title */
  running?: string[];
  /** "Do it for me" was pressed. Return a promise and the step shows as running until it settles, then ticks itself off */
  onDoIt?: (step: OnboardingStep, index: number) => void | Promise<unknown>;
  /** Like "Get set up" */
  title?: string;
  /** The line under the title. Defaults to "2 of 5 done", then "All done. Nice work" */
  status?: string;
  /** The note that comes in once every step is done */
  doneMessage?: ReactNode;
  doItLabel?: string;
  runningLabel?: string;
  /** Whether the list is open. Leave it out to let the chevron fold it away */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const RING = 100.5;
const keyOf = (s: OnboardingStep) => s.key ?? s.title;

/** A few first steps with a progress ring. The agent can do some of them for the person. */
export function OnboardingChecklist({ steps, done, defaultDone, onDoneChange, running, onDoIt, title = 'Get set up', status,
  doneMessage = 'You are all set. The agent will suggest what to try next.', doItLabel = 'Do it for me', runningLabel = 'The agent is on it',
  open, defaultOpen = true, onOpenChange, className }: OnboardingChecklistProps) {
  const [ticked, setTicked] = useControllable(done, defaultDone ?? steps.filter(s => s.done).map(keyOf), onDoneChange);
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  // steps started from "Do it for me" that are still waiting on onDoIt
  const [pending, setPending] = useState<string[]>([]);
  const latest = useRef(ticked);
  useEffect(() => { latest.current = ticked; });
  // the ring fills in a moment after the checklist appears
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  const n = steps.filter(s => ticked.includes(keyOf(s))).length, all = n === steps.length && n > 0;
  const toggle = (k: string) => setTicked(ticked.includes(k) ? ticked.filter(x => x !== k) : [...ticked, k]);
  const doIt = (s: OnboardingStep, i: number) => {
    const k = keyOf(s), out = onDoIt?.(s, i);
    if (!out || typeof (out as Promise<unknown>).then !== 'function') return;
    setPending(p => [...p, k]);
    (out as Promise<unknown>).then(
      () => { setPending(p => p.filter(x => x !== k)); if (!latest.current.includes(k)) setTicked([...latest.current, k]); },
      () => setPending(p => p.filter(x => x !== k)));
  };

  return (
    <div data-dm="" className={cx('dm-obx dm-panel', className)}>
      <div className="dm-obx-h">
        <svg className={cx('dm-obx-ring', ready && all && 'dm-full')} viewBox="0 0 40 40" role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={n}>
          <circle cx="20" cy="20" r="16" className="dm-tr" />
          <circle cx="20" cy="20" r="16" className="dm-fl" style={{ strokeDashoffset: ready ? RING * (1 - n / steps.length) : RING }} />
        </svg>
        <div className="dm-obx-ht"><b>{title}</b><Swap className="dm-muted dm-obx-st">{status ?? (all ? 'All done. Nice work' : `${n} of ${steps.length} done`)}</Swap></div>
        <Tip label={isOpen ? 'Collapse' : 'Expand'}>
          <button type="button" className={cx('dm-ib dm-obx-min', !isOpen && 'dm-shut')} aria-label={isOpen ? 'Collapse' : 'Expand'} aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}><Icon name="chev-d" size="xs" /></button>
        </Tip>
      </div>
      <Fold open={isOpen} className="dm-obx-fold">
        <div className="dm-obx-list">
          {steps.map((s, i) => {
            const k = keyOf(s), isDone = ticked.includes(k), run = !isDone && (pending.includes(k) || !!running?.includes(k));
            const e = enter(i * 50);
            return (
              <div key={k} className={cx('dm-obx-s', isDone && 'dm-done', run && 'dm-run', e.className)} style={e.style}>
                <button type="button" className="dm-obx-ck" role="checkbox" aria-checked={isDone} aria-label={s.title} onClick={() => toggle(k)}>
                  {run ? <span className="dm-spin" style={{ width: 14, height: 14 }} /> : <Icon name="check" size="xs" />}
                </button>
                <span className="dm-t"><b>{s.title}</b>{s.detail !== undefined && <Swap className={run ? 'dm-shim' : undefined}>{run ? runningLabel : s.detail}</Swap>}</span>
                {s.automatic && <button type="button" className="dm-pill dm-soft dm-sm" onClick={() => doIt(s, i)}><Icon name="spark" size="xs" />{doItLabel}</button>}
              </div>
            );
          })}
          {all && <div key="dn" className="dm-obx-dn dm-enter"><Icon name="ok" size="xs" />{doneMessage}</div>}
        </div>
      </Fold>
    </div>
  );
}
