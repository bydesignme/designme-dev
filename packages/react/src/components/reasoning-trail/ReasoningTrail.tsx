'use client';
import { useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion, useSeconds } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Dot, enter, Fold, Pulse, SourceChip, Swap, Think, type Source } from '../../lib/motion';
import '../../designme.css';
import './reasoning-trail.css';

export interface PlanStep {
  label: string;
  /** Shown under a finished step, like "4 frames" */
  detail?: string;
  state: 'done' | 'now' | 'next';
}
export interface Edit {
  file: string;
  /** Like "2 lines" */
  detail?: string;
  removed?: string[];
  added?: string[];
}
export type ReasoningTrailView = 'plan' | 'notes' | 'sources' | 'edits';
/** The earlier name of ReasoningTrailView */
export type ReasoningTab = ReasoningTrailView;

export interface ReasoningTrailProps {
  /** Shimmers and counts seconds while true */
  running?: boolean;
  /** Seconds to show. Leave it out to let the trail count while it runs */
  seconds?: number;
  /** Header text. Defaults to "Reasoning" while running and "Reasoned for Ns" after */
  title?: string;
  plan?: PlanStep[];
  notes?: string[];
  sources?: Source[];
  edits?: Edit[];
  /** Which part of the trail it shows: the plan, the notes, the sources or the edits. Leave it out to start on the first one there is */
  view?: ReasoningTrailView;
  defaultView?: ReasoningTrailView;
  onViewChange?: (view: ReasoningTrailView) => void;
  /** Whether the trail is open. Leave it out to let the header toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own. In the Clean
   *  style it always has its card */
  bare?: boolean;
  className?: string;
}

const VIEWS: ReasoningTrailView[] = ['plan', 'notes', 'sources', 'edits'];

const TICK = <svg viewBox="0 0 24 24"><path pathLength={1} d="m5 12.5 4.5 4.5L19 7.5" /></svg>;
const count = (n: number, one: string) => `${n} ${one}${n === 1 ? '' : 's'}`;

/** The agent's plan, notes, sources or edits, under a header it can fold away. Pick what it shows with `view`. */
export function ReasoningTrail({ running = false, seconds, title, plan, notes, sources, edits, view, defaultView, onViewChange, open, defaultOpen = true, onOpenChange, bare = true, className }: ReasoningTrailProps) {
  const counted = useSeconds(running && seconds === undefined);
  const secs = seconds ?? counted;
  const has = { plan: !!plan?.length, notes: !!notes?.length, sources: !!sources?.length, edits: !!edits?.length };
  const [picked] = useControllable(view, defaultView ?? VIEWS.find(v => has[v]) ?? 'plan', onViewChange);
  // a view with nothing in it falls back to the first one that has something
  const tab = has[picked] ? picked : VIEWS.find(v => has[v]) ?? picked;
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const head = title ?? (running ? 'Reasoning' : `Reasoned for ${Math.max(secs, 1)}s`);
  // Enter and Space open and fold it as a click does, and aria-expanded always says which
  const onHeadKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key !== 'Enter' && e.key !== ' ') || e.altKey || e.ctrlKey || e.metaKey) return;
    e.preventDefault(); if (!e.repeat) setOpen(!isOpen);
  };

  // Clean: the trail is a card that grows with what it holds (as grow() on designme.dev): its height follows its content,
  // eased, as steps change, views switch and it folds. Soft and Blueprint keep their own sizing
  const rootRef = useRef<HTMLDivElement>(null), growRef = useRef<HTMLDivElement>(null), [clean, setClean] = useState(false);
  useIsoLayoutEffect(() => {
    const el = rootRef.current, w = growRef.current;
    if (!el || !w || (el.closest('[data-style]') as HTMLElement | null)?.dataset.style !== 'clean') return;
    setClean(true);
    if (typeof ResizeObserver === 'undefined') return;
    let first = true;
    const fit = () => {
      const cs = getComputedStyle(el), h = Math.ceil(w.offsetHeight + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth));
      if (first) { el.style.transition = 'none'; el.style.height = h + 'px'; void el.offsetHeight; el.style.transition = ''; first = false; }
      else el.style.height = h + 'px';
    };
    el.classList.add('dm-growing'); const ro = new ResizeObserver(fit); ro.observe(w); fit();
    return () => { ro.disconnect(); el.classList.remove('dm-growing'); el.style.height = ''; };
  }, []);

  // in Clean, a step that has just finished draws its tick and the rail down into the next, which starts to turn: each
  // plays once, when the plan moves on
  const states = plan?.map(p => p.state) ?? [], key = states.join(), prev = useRef<string[] | null>(null);
  const [fresh, setFresh] = useState<{ done: number[]; now: number[] }>({ done: [], now: [] });
  useIsoLayoutEffect(() => {
    const was = prev.current; prev.current = states; if (!was) return;
    setFresh({ done: states.flatMap((s, i) => s === 'done' && was[i] && was[i] !== 'done' ? [i] : []), now: states.flatMap((s, i) => s === 'now' && was[i] === 'next' ? [i] : []) });
  }, [key]);
  // the foot strip that closes a finished trail in Clean: how much of the plan is done, and what the agent read and changed
  const doneN = states.filter(s => s === 'done').length, allDone = !!plan?.length && doneN === plan.length;
  const footL = plan?.length ? (allDone ? `All ${count(plan.length, 'step')} done` : `${doneN} of ${count(plan.length, 'step')} done`) : '';
  const footR = [sources?.length ? count(sources.length, 'source') : '', edits?.length ? count(edits.length, 'edit') : ''].filter(Boolean).join(' · ');

  // switching views grows or shrinks the open trail to its new height instead of jumping to it
  const reduce = useReducedMotion();
  const bodyRef = useRef<HTMLDivElement>(null), seen = useRef({ tab, h: 0 }), anim = useRef<Animation | null>(null);
  useIsoLayoutEffect(() => {
    const el = bodyRef.current; if (!el) return;
    if (anim.current?.playState === 'running' && seen.current.tab === tab) return;
    const to = el.offsetHeight, from = seen.current.h, moved = seen.current.tab !== tab;
    seen.current = { tab, h: to };
    if (!moved || !isOpen || reduce || clean || !from || Math.abs(from - to) < 1 || !el.animate) return;
    const cs = getComputedStyle(el), ms = parseFloat(cs.getPropertyValue('--dm-t')) * 1000 || 450;
    anim.current?.cancel(); el.style.overflow = 'hidden';
    const a = el.animate([{ height: from + 'px' }, { height: to + 'px' }], { duration: ms, easing: cs.getPropertyValue('--dm-ease').trim() || 'ease' });
    a.onfinish = a.oncancel = () => { el.style.overflow = ''; if (anim.current === a) anim.current = null; };
    anim.current = a;
  });

  const body = () => {
    if (tab === 'plan') return plan?.map((p, i) => (
      <div key={'p' + i} className={cx('dm-rtr-li dm-enter', p.state === 'now' && 'dm-now', fresh.done.includes(i) && 'dm-just', fresh.now.includes(i) && 'dm-next-in')} data-s={p.state} style={enter(i * 50).style}>
        <span className="dm-g">{p.state === 'done' ? <span style={{ color: 'var(--dm-ok)', display: 'grid' }}><Icon name="check" size="xs" /></span> : p.state === 'now' ? <Pulse /> : <Dot color="var(--dm-faint)" />}<span className="dm-rtr-m" aria-hidden="true">{p.state === 'done' && TICK}</span></span>
        <span>{p.label}<span className="dm-d">{p.state === 'done' ? p.detail ?? 'Done' : p.state === 'now' ? 'Working' : 'Next'}</span></span>
      </div>));
    if (tab === 'notes') return notes?.map((t, i) => (
      <div key={'n' + i} className="dm-rtr-li dm-enter" style={enter(i * 50).style}><span className="dm-g"><Dot color="var(--dm-faint)" /></span><span>{t}</span></div>));
    if (tab === 'sources') return <div className="dm-rtr-src dm-enter">{/* the tips open below the chips, clear of the header above */}{sources?.map((s, i) => <SourceChip key={i} source={s} tipSide="bottom" />)}</div>;
    return edits?.map((e, i) => (
      <div key={'e' + i} className="dm-enter" style={enter(i * 50).style}>
        <div className="dm-rtr-li"><span className="dm-g"><Icon name="edit" size="xs" /></span><span>{e.file}{e.detail && <span className="dm-d">{e.detail}</span>}</span></div>
        <div className="dm-rtr-edit">{e.removed?.map((l, k) => <div key={'x' + k} className="dm-x">{l}</div>)}{e.added?.map((l, k) => <div key={'a' + k} className="dm-a">{l}</div>)}</div>
      </div>));
  };

  return (
    <div data-dm="" ref={rootRef} className={cx('dm-rtr', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div ref={growRef} className="dm-grow">
      <button type="button" className="dm-rtr-h" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)} onKeyDown={onHeadKey}>
        <Think on={running} className="dm-rtr-mark" />
        <Swap className={cx('dm-rtr-title', running && 'dm-shim')}>{head}</Swap>
        <span className="dm-rtr-time dm-num dm-muted">{running ? secs + 's' : ''}</span>
        <Icon name="chev-d" size="xs" className="dm-rtr-chev" />
      </button>
      <Fold open={isOpen} className="dm-rtr-fold">
        {/* keyed by view, so switching views plays the entrance again */}
        <div className="dm-rtr-body" key={tab} ref={bodyRef} data-v={tab}>{body()}</div>
        <Fold open={!running && !!(footL || footR)} className="dm-rtr-ff">
          <p className="dm-rtr-f">{allDone && <span className="dm-rtr-fk" aria-hidden="true">{TICK}</span>}<span className="dm-rtr-fd">{footL}</span><span className="dm-rtr-fs">{footR}</span></p>
        </Fold>
      </Fold>
      </div>
    </div>
  );
}
