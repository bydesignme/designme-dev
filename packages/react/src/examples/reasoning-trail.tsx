'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { useIsoLayoutEffect } from '../lib/hooks';
import { ReasoningTrail, type Edit, type PlanStep, type ReasoningTrailProps, type ReasoningTrailView } from '../components/reasoning-trail/ReasoningTrail';
import { Seg, type Source } from '../lib/motion';
import { Demo } from './Demo';
import { useScript } from './useScript';

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
