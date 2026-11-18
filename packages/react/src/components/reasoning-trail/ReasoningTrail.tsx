'use client';
import { useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion, useSeconds } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Dot, enter, Fold, Pulse, reflowGlide, SourceChip, Swap, Think, type Source } from '../../lib/motion';
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
  /** What the agent has noted so far. Pass them as it finds them */
  notes?: string[];
  /** What the agent has read so far. Mark the one it is still reading with `reading` */
  sources?: Source[];
  /** The edits the agent has drafted so far */
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
/** A key for each item, the same from one render to the next as items are added: its text, and a count for a repeat */
const keysOf = (prefix: string, xs: string[] = []) => { const n = new Map<string, number>(); return xs.map(x => { const k = (n.get(x) ?? 0) + 1; n.set(x, k); return prefix + x + (k > 1 ? '#' + k : ''); }); };
/** Where `el` sits in `box` by layout, without the entrance or glide it may be in the middle of */
const place = (el: HTMLElement, box: HTMLElement) => {
  let x = 0, y = 0;
  for (let e: HTMLElement | null = el; e && e !== box; e = e.parentElement) {
    const t = getComputedStyle(e).transform;
    if (t && t !== 'none') { const m = new DOMMatrixReadOnly(t); x += m.m41; y += m.m42; }
  }
  const r = el.getBoundingClientRect(), b = box.getBoundingClientRect();
  return { x: r.left - b.left - x, y: r.top - b.top - y };
};

/** The agent's plan, notes, sources or edits, under a header it can fold away. Pick what it shows with `view`. */
export function ReasoningTrail({ running = false, seconds, title, plan, notes, sources, edits, view, defaultView, onViewChange, open, defaultOpen = true, onOpenChange, bare = true, className }: ReasoningTrailProps) {
  const counted = useSeconds(running && seconds === undefined);
  const secs = seconds ?? counted;
  const has = { plan: !!plan?.length, notes: !!notes?.length, sources: !!sources?.length, edits: !!edits?.length };
  const [picked] = useControllable(view, defaultView ?? VIEWS.find(v => has[v]) ?? 'plan', onViewChange);
  // while it runs, a view the agent hasn't added to yet says so ("No notes yet"); once it is done, a view with nothing in it
  // falls back to the first one that has something
  const tab = has[picked] || (running && picked !== 'plan') ? picked : VIEWS.find(v => has[v]) ?? picked;
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

  // what the view shows, as the items in it: switching views, or the agent adding to the one on screen, changes it
  const noteKeys = keysOf('n:', notes), sourceKeys = keysOf('s:', sources?.map(x => x.label)), editKeys = keysOf('e:', edits?.map(e => e.file));
  const keys = tab === 'notes' ? noteKeys : tab === 'sources' ? sourceKeys : tab === 'edits' ? editKeys : [];
  const sig = tab + '|' + (keys.length ? keys.join('\n') : 'none');

  // switching views, or a view taking in what the agent has just added, grows or shrinks the open trail to its new height
  // instead of jumping to it (from wherever an earlier change has it)
  const reduce = useReducedMotion();
  const bodyRef = useRef<HTMLDivElement>(null), seen = useRef({ sig: '', h: 0 }), anim = useRef<Animation | null>(null);
  useIsoLayoutEffect(() => {
    const el = bodyRef.current; if (!el) return;
    const a0 = anim.current, mine = a0?.playState === 'running' && (a0.effect as KeyframeEffect | null)?.target === el;
    if (seen.current.sig === sig) { if (!mine) seen.current.h = el.offsetHeight; return; }
    const from = mine ? el.offsetHeight : seen.current.h, was = seen.current.sig;
    a0?.cancel();
    const to = el.offsetHeight;
    seen.current = { sig, h: to };
    if (!was || !isOpen || reduce || clean || !from || Math.abs(from - to) < 1 || !el.animate) return;
    const cs = getComputedStyle(el), ms = parseFloat(cs.getPropertyValue('--dm-t')) * 1000 || 450;
    el.style.overflow = 'hidden';
    const a = el.animate([{ height: from + 'px' }, { height: to + 'px' }], { duration: ms, easing: cs.getPropertyValue('--dm-ease').trim() || 'ease' });
    a.onfinish = a.oncancel = () => { el.style.overflow = ''; if (anim.current === a) anim.current = null; };
    anim.current = a;
  });

  // a row that a new one lands above (a note found later that belongs higher up) glides down to its new place instead of
  // jumping there
  const places = useRef<{ sig: string; at: Map<string, { x: number; y: number }> }>({ sig: '', at: new Map() });
  useIsoLayoutEffect(() => {
    const box = bodyRef.current; if (!box) return;
    const rows = [...box.querySelectorAll<HTMLElement>('[data-key]')], at = new Map(rows.map(el => [el.dataset.key!, place(el, box)]));
    const was = places.current; places.current = { sig, at };
    if (reduce || was.sig === sig || was.sig.split('|')[0] !== tab || typeof box.animate !== 'function') return;
    rows.forEach(el => { const o = was.at.get(el.dataset.key!), p = at.get(el.dataset.key!)!; if (o) reflowGlide(el, o.x - p.x, o.y - p.y, box); });
  });

  // each item's entrance is set when it first shows: a view's first items follow one another 50ms apart, as a view does
  // when it opens, and one the agent adds later comes in at once
  const born = useRef({ tab, at: new Map<string, number>() });
  if (born.current.tab !== tab) born.current = { tab, at: new Map() };
  const firstPass = born.current.at.size === 0;
  const delay = (k: string, d: number) => { const m = born.current.at; if (!m.has(k)) m.set(k, firstPass ? d : 0); return m.get(k)!; };

  const body = () => {
    if (tab === 'plan') return plan?.map((p, i) => (
      <div key={'p' + i} className={cx('dm-rtr-li dm-enter', p.state === 'now' && 'dm-now', fresh.done.includes(i) && 'dm-just', fresh.now.includes(i) && 'dm-next-in')} data-s={p.state} style={enter(i * 50).style}>
        <span className="dm-g">{p.state === 'done' ? <span style={{ color: 'var(--dm-ok)', display: 'grid' }}><Icon name="check" size="xs" /></span> : p.state === 'now' ? <Pulse /> : <Dot color="var(--dm-faint)" />}<span className="dm-rtr-m" aria-hidden="true">{p.state === 'done' && TICK}</span></span>
        <span>{p.label}<span className="dm-d">{p.state === 'done' ? p.detail ?? 'Done' : p.state === 'now' ? 'Working' : 'Next'}</span></span>
      </div>));
    // a view with nothing in it yet says so, on the row the first one will take
    const none = (what: string) => (
      <div key="none" data-key="none" className="dm-rtr-li dm-enter" style={enter(delay('none', 0)).style}><span className="dm-g"><Dot color="var(--dm-faint)" /></span><span className="dm-muted">No {what} yet</span></div>);
    if (tab === 'notes') return notes?.length ? notes.map((t, i) => (
      <div key={noteKeys[i]} data-key={noteKeys[i]} className="dm-rtr-li dm-enter" style={enter(delay(noteKeys[i], i * 50)).style}><span className="dm-g"><Dot color="var(--dm-faint)" /></span><span>{t}</span></div>)) : none('notes');
    // the chips first shown come in as one row; one the agent reads later comes in by itself
    if (tab === 'sources') return sources?.length ? <div className="dm-rtr-src dm-enter">{/* the tips open below the chips, clear of the header above */}{sources.map((s, i) => {
      const own = delay(sourceKeys[i], -1) === 0;
      return <SourceChip key={sourceKeys[i]} source={s} tipSide="bottom" className={own ? 'dm-enter' : undefined} />; })}</div> : none('sources');
    return edits?.length ? edits.map((e, i) => (
      <div key={editKeys[i]} data-key={editKeys[i]} className="dm-enter" style={enter(delay(editKeys[i], i * 50)).style}>
        <div className="dm-rtr-li"><span className="dm-g"><Icon name="edit" size="xs" /></span><span>{e.file}{e.detail && <span className="dm-d">{e.detail}</span>}</span></div>
        <div className="dm-rtr-edit">{e.removed?.map((l, k) => <div key={'x' + k} className="dm-x">{l}</div>)}{e.added?.map((l, k) => <div key={'a' + k} className="dm-a">{l}</div>)}</div>
      </div>)) : none('edits');
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
