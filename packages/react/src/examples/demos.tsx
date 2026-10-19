'use client';
// The animated previews from designme.dev, rebuilt from the React components.
// Each one shows how to drive a component from your own state.
import { useState } from 'react';
import { StatusPill, type StatusPillProps } from '../components/status-pill/StatusPill';
import { StepLoader, type StepLoaderGlyph } from '../components/step-loader/StepLoader';
import { ReasoningTrail, type PlanStep } from '../components/reasoning-trail/ReasoningTrail';
import { Thinking, type ThinkingStep } from '../components/thinking/Thinking';
import { ContextMeter, type UsageRow } from '../components/context-meter/ContextMeter';
import { Seg } from '../lib/motion';
import { useScript } from './useScript';

/* ---------- Status pill: an agent run from thinking to done, waiting for Review on the way ---------- */
export function StatusPillDemo() {
  const [variant, setVariant] = useState<'pill' | 'bar'>('pill');
  const [p, setP] = useState<StatusPillProps>({ state: 'idle', label: 'Ready for a task' });
  useScript(async ({ wait }) => {
    for (;;) {
      await wait(1100);
      setP({ state: 'thinking', label: 'Thinking', progress: 8 }); await wait(1800);
      setP({ state: 'reading', label: 'Reading Figma frames', meta: '1 of 4', progress: 22 }); await wait(400);
      for (let i = 2; i <= 4; i++) { await wait(650); setP({ state: 'reading', label: 'Reading Figma frames', meta: `${i} of 4`, progress: 22 + i * 8 }); }
      await wait(700);
      setP({ state: 'working', label: 'Editing', file: { name: 'PricingCard.tsx', type: 'tsx' }, progress: 64 }); await wait(2000);
      // waits for Review, and carries on by itself after a while so the loop never stalls
      await new Promise<void>(res => { setP({ state: 'waiting', label: 'Waiting for your approval', action: { label: 'Review', onClick: res }, progress: 72 }); wait(8000).then(res); });
      setP({ state: 'working', label: 'Applying 4 changes', progress: 88 }); await wait(1600);
      setP({ state: 'done', label: 'Done', meta: '4 files changed · 18s', progress: 100 }); await wait(3200);
      setP({ state: 'idle', label: 'Ready for a task', progress: 0 });
    }
  });
  return (
    <Demo switcher={<Seg label="Variant" value={variant} onChange={setVariant} options={[{ value: 'pill', label: 'Pill' }, { value: 'bar', label: 'Bar' }]} />}>
      <StatusPill {...p} variant={variant} />
    </Demo>
  );
}

/* ---------- Step loader: four named steps, looping ---------- */
const STEPS = [
  { label: 'Reading Figma frames', done: 'Read 4 frames' }, { label: 'Matching tokens', done: 'Matched 18 tokens' },
  { label: 'Writing components', done: 'Wrote 3 components' }, { label: 'Checking contrast', done: 'Contrast passes' }
];
export function StepLoaderDemo() {
  const [loader, setLoader] = useState<StepLoaderGlyph>('radar');
  const [current, setCurrent] = useState(0);
  useScript(async ({ wait }) => {
    for (;;) {
      for (let i = 0; i < STEPS.length; i++) { setCurrent(i); await wait(1900); }
      setCurrent(STEPS.length); await wait(3200);
      setCurrent(0); await wait(700);
    }
  });
  return (
    <Demo switcher={<Seg label="Loader" value={loader} onChange={setLoader} options={[{ value: 'radar', label: 'Radar' }, { value: 'dots', label: 'Dots' }, { value: 'ring', label: 'Ring' }, { value: 'bars', label: 'Bars' }]} />}>
      <StepLoader steps={STEPS} current={current} loader={loader} />
    </Demo>
  );
}

/* ---------- Reasoning trail: the plan fills in, then the trail settles ---------- */
const PLAN = [['Open the onboarding file', '4 frames'], ['Compare it with the design system', '12 components'], ['Find spacing that breaks the 8px grid', '3 frames'], ['Draft fixes for review', 'Ready']];
export function ReasoningTrailDemo() {
  const [done, setDone] = useState(0);
  useScript(async ({ wait }) => { for (let i = 1; i <= PLAN.length; i++) { await wait(1500); setDone(i); } });
  const running = done < PLAN.length;
  const plan: PlanStep[] = PLAN.map(([label, detail], i) => ({ label, detail, state: i < done ? 'done' : i === done ? 'now' : 'next' }));
  return (
    <div style={{ width: '100%' }}>
      <ReasoningTrail running={running} plan={plan}
        notes={['The hero card uses 20px padding, every other card uses 24px.', 'Mobile frames already follow the grid, desktop drifted.', 'Two buttons use a hard-coded grey instead of a token.']}
        sources={[{ label: 'Onboarding.fig', kind: 'figma', tip: 'Figma, 4 frames read' }, { label: 'tokens.ts', kind: 'ts', tip: 'src/styles/tokens.ts, 212 lines' }, { label: 'Card.tsx', kind: 'tsx', tip: 'src/components/Card.tsx, 2 edits' }, { label: 'Spacing guide', kind: 'web', tip: 'designme.dev/guide/spacing' }]}
        edits={[{ file: 'Card.tsx', detail: '2 lines', removed: ['padding: 20px;'], added: ['padding: var(--space-6);'] }, { file: 'Button.tsx', detail: '1 line', removed: ['color: #8a8a8a;'], added: ['color: var(--text-dim);'] }]} />
    </div>
  );
}

/* ---------- Thinking: the trace is written step by step, then folds away ---------- */
type Plan = Omit<ThinkingStep, 'state' | 'label'> & { run: string; done: string; dead?: boolean; count?: number; ms: number };
const THOUGHTS: Plan[] = [
  { mark: 'search', run: 'Searching the design system', done: 'Searched the design system', ms: 1600,
    sources: [{ label: 'Pricing.fig', kind: 'figma', tip: 'Figma, 6 frames read' }, { label: 'tokens.ts', kind: 'ts', tip: 'src/styles/tokens.ts, 212 lines' }, { label: 'PricingCard.tsx', kind: 'tsx', tip: 'src/components/PricingCard.tsx' }, { label: 'Contrast guide', kind: 'web', tip: 'w3.org, WCAG 2.2 contrast' }],
    moreSources: [{ label: 'Button.tsx', kind: 'tsx', tip: 'src/components/Button.tsx' }, { label: 'globals.css', kind: 'css', tip: 'src/styles/globals.css' }] },
  { run: 'Reading 1 of 6 frames', done: 'Read 6 frames from Pricing.fig', count: 6, ms: 1500 },
  { run: 'Checking if the old grid is in the tokens', done: "Dead end: the old grid isn't in tokens.ts", dead: true, ms: 1400 },
  { run: 'Mapping every spacing value', done: 'Mapped 9 spacing values', ms: 1300 },
  { run: 'Comparing desktop and mobile', done: 'Compared desktop and mobile', sub: true, ms: 1100 },
  { run: 'Finding values off the 8px grid', done: '3 values break the 8px grid', sub: true, ms: 1000 },
  { run: 'Merging both breakpoints', done: 'Merged both breakpoints', mark: 'hollow', ms: 1000 },
  { run: 'Spotting cards that need a fix', done: 'Found 3 cards to fix', ms: 1200 },
  { run: 'Drafting the fix', done: 'Drafted a 2-step fix', ms: 1300 }
];
export function ThinkingDemo() {
  const [steps, setSteps] = useState<ThinkingStep[]>([]);
  const [running, setRunning] = useState(true);
  useScript(async ({ wait }) => {
    await wait(800);
    const out: ThinkingStep[] = [];
    const show = () => setSteps(out.slice());
    for (const t of THOUGHTS) {
      const { run, done, dead, count, ms, ...rest } = t;
      out.push({ ...rest, label: run, state: 'running', sources: undefined, moreSources: undefined }); show();
      const at = out.length - 1;
      if (t.sources) { await wait(550); out[at] = { ...out[at], sources: t.sources, moreSources: t.moreSources }; show(); }
      if (count) for (let n = 2; n <= count; n++) { await wait(ms / count); out[at] = { ...out[at], label: `Reading ${n} of ${count} frames` }; show(); }
      else await wait(ms);
      out[at] = { ...out[at], label: done, state: dead ? 'dead' : 'done' }; show();
    }
    await wait(500); setRunning(false);
  });
  return <div style={{ width: '100%' }}><Thinking steps={steps} running={running} summary="3 cards to fix · 2 steps" /></div>;
}

/* ---------- Context meter: a ring beside the model opens usage; compact frees the context ---------- */
export function ContextMeterDemo() {
  const [phase, setPhase] = useState<'full' | 'busy' | 'compact'>('full');
  const compact = () => {
    if (phase === 'compact') { setPhase('full'); return; }
    if (phase === 'busy') return;
    setPhase('busy'); setTimeout(() => setPhase('compact'), 900);
  };
  const rows: UsageRow[] = [
    { key: 'ctx', label: 'Context window', percent: phase === 'compact' ? 38 : 68,
      detail: phase === 'busy' ? 'Summarising the thread' : phase === 'compact' ? '76k of 200k tokens, 9 decisions kept' : '136k of 200k tokens',
      tip: 'Files 56k · Conversation 60k · Tool results 20k',
      action: { label: phase === 'busy' ? 'Compacting' : phase === 'compact' ? 'Undo' : 'Compact', onClick: compact } },
    { key: 'session', label: 'Session limit', percent: 4, detail: 'Resets in 4 hr 39 min' },
    { key: 'week', label: 'Weekly', percent: 16, detail: 'Resets Sun 10:00 PM' }
  ];
  return (
    <div style={{ width: '100%', maxWidth: 330, marginLeft: 'auto' }}>
      <ContextMeter rows={rows} model="Opus 5.5" effort="Extra" onViewUsage={() => {}} />
    </div>
  );
}

/** The component in the middle, its variant switch underneath, like the cards on designme.dev */
function Demo({ children, switcher }: { children: React.ReactNode; switcher: React.ReactNode }) {
  return (
    <div style={{ width: '100%', minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
      <div style={{ marginBlock: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{children}</div>
      <div data-dm="">{switcher}</div>
    </div>
  );
}
