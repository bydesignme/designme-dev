# Reasoning trail

> The agent's plan, notes, sources and edits, after it thinks.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/reasoning-trail

## Install

```sh
npx designme add reasoning-trail          # HTML, CSS and JS, with the shared core
npx designme add reasoning-trail --react  # React 19 component and its CSS
npx designme add reasoning-trail --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/reasoning-trail.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/reasoning-trail.json  # Astro
```

## About

Reasoning trail is a foldable record of how an agent worked through a task: its plan, its notes, the sources it used and the edits it made. It sits in a chat thread under a header that reads "Reasoning" with a running clock, then "Reasoned for Ns" once the agent is done.

### When to use it

- When people want to check how the agent reached its answer before they trust it.
- When the agent follows a plan and you want each step to show as done, in progress or next.
- When the agent changed files and people should see the removed and added lines in place.
- When the reasoning should stay out of the way until someone opens it.

### What it does

- It shows one of four views, picked with `view`: plan, notes, sources or edits. While `running` is true, a notes, sources or edits view with nothing in it yet says so ("No notes yet"); once it is done, a view with nothing in it falls back to the first one that has content.
- Plan steps are done (a check and their `detail`), now (a pulse and "Working") or next (a grey dot and "Next"). In Clean they sit on a hairline rail that fills down as each step finishes: a green disc whose tick draws in, a turning ring for the step in hand and an outlined circle for the next.
- Notes are plain lines, sources are file and link chips with tooltips, and edits list each file with its removed and added lines. Pass them as the agent makes them, so each view shows only what it has made so far. A source marked `reading` shimmers, as the header does, until you pass it without.
- While `running` is true, the header shimmers and counts seconds, unless you pass `seconds`. `title` replaces the default header text.
- Clicking the header, or pressing Enter or Space on it, folds the trail open or shut, controlled with `open` and `onOpenChange` or left to the component. Switching views grows or shrinks the open trail to its new height and plays the entrance again. A note, source or edit added to the view on screen comes in by itself, the trail grows to take it, and a row it lands above glides down to make room.
- It sits flat in a chat thread by default, and `bare={false}` gives it a card of its own. In Clean it always has its card, which grows and shrinks with what it shows, and once `running` is false a foot strip sums the trail up: the plan steps done and how many sources and edits it has.

### Accessibility

- The header is a button with `aria-expanded`, which follows every click, Enter and Space.
- When folded, the body is `inert` and `aria-hidden`, so its chips leave the tab order.
- The thinking glyph and status dots are decorative and hidden from screen readers.

## Usage in React

```tsx
import { ReasoningTrail } from '@/components/designme/reasoning-trail/ReasoningTrail';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { useIsoLayoutEffect } from '../lib/hooks';
import { ReasoningTrail, type Edit, type PlanStep, type ReasoningTrailProps, type ReasoningTrailView } from './ReasoningTrail';
import { Seg, type Source } from '../lib/motion';
import { Demo } from '../lib/Demo';
import { useScript } from '../lib/useScript';

/* ---------- Reasoning trail: each view fills in as the run makes it, then the trail settles ---------- */
const VIEWS: ReasoningTrailView[] = ['plan', 'notes', 'sources', 'edits'];
const PLAN = [['Open the onboarding file', '4 frames'], ['Compare it with the design system', '12 components'], ['Find spacing that breaks the 8px grid', '3 frames'], ['Draft fixes for review', 'Ready']];
const NOTES = ['The hero card uses 20px padding, every other card uses 24px.', 'Mobile frames already follow the grid, desktop drifted.', 'Two buttons use a hard-coded grey instead of a token.'];
// each source, with its tip while the agent reads it, once it has read it and (Card.tsx) once it has edited it
type Read = 'reading' | 'read' | 'edited';
const SOURCES: (Omit<Source, 'tip' | 'reading'> & Partial<Record<Read, string>>)[] = [
  { label: 'Onboarding.fig', kind: 'figma', reading: 'Reading the frames in Figma', read: 'Figma, 4 frames read' },
  { label: 'tokens.ts', kind: 'ts', reading: 'Reading src/styles/tokens.ts', read: 'src/styles/tokens.ts, 212 lines' },
  { label: 'Card.tsx', kind: 'tsx', reading: 'Reading src/components/Card.tsx', read: 'src/components/Card.tsx', edited: 'src/components/Card.tsx, 2 edits' },
  { label: 'Spacing guide', kind: 'web', reading: 'Reading designme.dev/guide/spacing', read: 'designme.dev/guide/spacing' }
];
const EDITS: Edit[] = [{ file: 'Card.tsx', detail: '2 lines', removed: ['padding: 20px;'], added: ['padding: var(--space-6);'] }, { file: 'Button.tsx', detail: '1 line', removed: ['color: #8a8a8a;'], added: ['color: var(--text-dim);'] }];

// where the run is: the plan steps done, the notes found (by their place in NOTES), how far each source has got and the
// edits drafted. Each view shows only what the run has made by then
interface Run { done: number; notes: number[]; src: Read[]; edits: number }
const START: Run = { done: 0, notes: [], src: ['reading'], edits: 0 };
const END: Run = { done: PLAN.length, notes: [0, 1, 2], src: ['read', 'read', 'edited', 'read'], edits: 2 };
// the run, 1.5s a step: how long after the last beat, and where it is then
const BEATS: [number, Run][] = [
  // the file is open: Onboarding.fig read and the hero card's padding noted; on to tokens.ts
  [1500, { done: 1, notes: [0], src: ['read', 'reading'], edits: 0 }],
  // then Card.tsx
  [750, { done: 1, notes: [0], src: ['read', 'read', 'reading'], edits: 0 }],
  // compared with the design system: the hard-coded grey noted; on to the spacing guide
  [750, { done: 2, notes: [0, 2], src: ['read', 'read', 'read', 'reading'], edits: 0 }],
  // the grid checked: where desktop drifted noted
  [1500, { done: 3, notes: [0, 1, 2], src: ['read', 'read', 'read', 'read'], edits: 0 }],
  // the fixes drafted: Card.tsx, then Button.tsx
  [400, { done: 3, notes: [0, 1, 2], src: ['read', 'read', 'edited', 'read'], edits: 1 }],
  [600, { done: 3, notes: [0, 1, 2], src: ['read', 'read', 'edited', 'read'], edits: 2 }],
  [500, END]
];
const content = (r: Run): Pick<ReasoningTrailProps, 'notes' | 'sources' | 'edits'> => ({
  notes: NOTES.filter((_, i) => r.notes.includes(i)),
  sources: r.src.map((s, i) => { const { reading, read, edited, ...x } = SOURCES[i]; return { ...x, tip: { reading, read, edited }[s], reading: s === 'reading' }; }),
  edits: EDITS.slice(0, r.edits)
});

export default function ReasoningTrailDemo() {
  const [run, setRun] = useState(START);
  const [view, setView] = useState<ReasoningTrailView>('plan');
  // Clean's trail is a card that grows with each view instead (owner, 18 Nov: no room kept for a later state)
  const box = useRef<HTMLDivElement>(null), [clean, setClean] = useState(false);
  useIsoLayoutEffect(() => { setClean((box.current?.closest('[data-style]') as HTMLElement | null)?.dataset.style === 'clean'); }, []);
  // the agent's own work: it carries on after the visitor takes over, and while the pointer rests on it
  useScript(async ({ wait }) => { for (const [ms, r] of BEATS) { await wait(ms); setRun(r); } });
  const running = run.done < PLAN.length;
  const plan: PlanStep[] = PLAN.map(([label, detail], i) => ({ label, detail, state: i < run.done ? 'done' : i === run.done ? 'now' : 'next' }));
  return (
    <Demo switcher={<Seg label="View" value={view} onChange={setView} options={[{ value: 'plan', label: 'Plan' }, { value: 'notes', label: 'Notes' }, { value: 'sources', label: 'Sources' }, { value: 'edits', label: 'Edits' }]} />}>
      {/* the preview keeps the room of its tallest view, finished, so the switcher under it stays put: a hidden copy of each
          view sits in the same grid cell, and the trail you see is centred in it */}
      <div ref={box} style={{ display: 'grid', width: '100%' }}>
        {!clean && VIEWS.map(v => (
          <div key={v} aria-hidden="true" inert style={{ gridArea: '1 / 1', visibility: 'hidden', pointerEvents: 'none' }}>
            <ReasoningTrail plan={plan} view={v} seconds={0} {...content(END)} />
          </div>
        ))}
        <div style={{ gridArea: '1 / 1', alignSelf: 'center', minWidth: 0 }}>
          <ReasoningTrail running={running} plan={plan} view={view} {...content(run)} />
        </div>
      </div>
    </Demo>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `running` (optional) | `boolean` | Shimmers and counts seconds while true |
| `seconds` (optional) | `number` | Seconds to show. Leave it out to let the trail count while it runs |
| `title` (optional) | `string` | Header text. Defaults to "Reasoning" while running and "Reasoned for Ns" after |
| `plan` (optional) | `PlanStep[]` |  |
| `notes` (optional) | `string[]` | What the agent has noted so far. Pass them as it finds them |
| `sources` (optional) | `Source[]` | What the agent has read so far. Mark the one it is still reading with `reading` |
| `edits` (optional) | `Edit[]` | The edits the agent has drafted so far |
| `view` (optional) | `ReasoningTrailView` | Which part of the trail it shows: the plan, the notes, the sources or the edits. Leave it out to start on the first one there is |
| `defaultView` (optional) | `ReasoningTrailView` |  |
| `onViewChange` (optional) | `(view: ReasoningTrailView) => void` |  |
| `open` (optional) | `boolean` | Whether the trail is open. Leave it out to let the header toggle it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own. In the Clean style it always has its card |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ReasoningTrail from '../components/designme/reasoning-trail/ReasoningTrail.astro';
---
<ReasoningTrail />
<ReasoningTrail data-style="soft" class="my-class" />
```
It plays its demo; change `reasoning-trail.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Does the trail come with Plan, Notes, Sources and Edits tabs?**

No. The component shows whichever view you pass in `view`, and you supply the switcher. The designme.dev demo puts a segmented control under it. In Soft and Blueprint it keeps the room of the tallest view, so the control stays put as you switch; in Clean the card grows or shrinks to each view.

**How do I show progress through the plan?**

Pass `plan` as steps with `state` set to 'done', 'now' or 'next', and update them from your own state as the agent moves on. Add to `notes`, `sources` and `edits` as the agent makes them, mark the source it is still reading with `reading: true`, and set `running` to false when it finishes.

**What does an edit look like?**

An edit has a `file`, an optional `detail` like "2 lines", and `removed` and `added` arrays of lines. Removed lines are shown first, then added ones, under the file name.

## Source

`ReasoningTrail.tsx`, as `npx designme add reasoning-trail --react` installs it:

```tsx
'use client';
import { useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion, useSeconds } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Dot, enter, Fold, growFit, Pulse, reflowGlide, SourceChip, Swap, Think, type Source } from '../lib/motion';
import '../designme.css';
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
    el.classList.add('dm-growing'); const stop = growFit(el, w);
    return () => { stop(); el.classList.remove('dm-growing'); };
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
    <div data-dm="" ref={rootRef} className={cx('dm-rtr dm-mx-grow', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div ref={growRef} className="dm-grow">
      <button type="button" className="dm-rtr-h dm-mx-press" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)} onKeyDown={onHeadKey}>
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
```

## More in Agent status

- [Thinking](https://designme.dev/components/thinking.md): The live trace, written as the agent works, then folded away.
- [Agent lanes](https://designme.dev/components/agent-lanes.md): Several agents working in parallel, each with its own lane and hand-offs.
- [Agent tree](https://designme.dev/components/agent-tree.md): An orchestrator and its sub-agents, with cost rolled up per branch.
- [Agent inbox](https://designme.dev/components/agent-inbox.md): Every run that needs you, is running or is done, in one list.
- [Trace view](https://designme.dev/components/trace-view.md): One agent run as a waterfall of spans, with latency and tokens.
- [Web search](https://designme.dev/components/web-search.md): The agent's searches as a trail: what it asked, what came back, what it read or skipped, and the answer with its sources.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): A background job in one toast, from start to finish.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.
- [Thinking states](https://designme.dev/components/thinking-states.md): Six thinking indicators to pick from, each with a status line.

All components: https://designme.dev/llms.txt
