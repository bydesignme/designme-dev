'use client';
import { useRef, type KeyboardEvent } from 'react';
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
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

const VIEWS: ReasoningTrailView[] = ['plan', 'notes', 'sources', 'edits'];

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

  // switching views grows or shrinks the open trail to its new height instead of jumping to it
  const reduce = useReducedMotion();
  const bodyRef = useRef<HTMLDivElement>(null), seen = useRef({ tab, h: 0 }), anim = useRef<Animation | null>(null);
  useIsoLayoutEffect(() => {
    const el = bodyRef.current; if (!el) return;
    if (anim.current?.playState === 'running' && seen.current.tab === tab) return;
    const to = el.offsetHeight, from = seen.current.h, moved = seen.current.tab !== tab;
    seen.current = { tab, h: to };
    if (!moved || !isOpen || reduce || !from || Math.abs(from - to) < 1 || !el.animate) return;
    const cs = getComputedStyle(el), ms = parseFloat(cs.getPropertyValue('--dm-t')) * 1000 || 450;
    anim.current?.cancel(); el.style.overflow = 'hidden';
    const a = el.animate([{ height: from + 'px' }, { height: to + 'px' }], { duration: ms, easing: cs.getPropertyValue('--dm-ease').trim() || 'ease' });
    a.onfinish = a.oncancel = () => { el.style.overflow = ''; if (anim.current === a) anim.current = null; };
    anim.current = a;
  });

  const body = () => {
    if (tab === 'plan') return plan?.map((p, i) => (
      <div key={'p' + i} className={cx('dm-rtr-li dm-enter', p.state === 'now' && 'dm-now')} style={enter(i * 50).style}>
        <span className="dm-g">{p.state === 'done' ? <span style={{ color: 'var(--dm-ok)', display: 'grid' }}><Icon name="check" size="xs" /></span> : p.state === 'now' ? <Pulse /> : <Dot color="var(--dm-faint)" />}</span>
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
    <div data-dm="" className={cx('dm-rtr', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <button type="button" className="dm-rtr-h" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)} onKeyDown={onHeadKey}>
        <Think on={running} className="dm-rtr-mark" />
        <Swap className={cx('dm-rtr-title', running && 'dm-shim')}>{head}</Swap>
        <span className="dm-rtr-time dm-num dm-muted">{running ? secs + 's' : ''}</span>
        <Icon name="chev-d" size="xs" className="dm-rtr-chev" />
      </button>
      <Fold open={isOpen} className="dm-rtr-fold">
        {/* keyed by view, so switching views plays the entrance again */}
        <div className="dm-rtr-body" key={tab} ref={bodyRef}>{body()}</div>
      </Fold>
    </div>
  );
}
