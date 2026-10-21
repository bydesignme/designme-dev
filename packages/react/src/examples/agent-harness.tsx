'use client';
// The animated preview from designme.dev, rebuilt from the React component: five conversations told with the other
// components. The first plays by itself; New chat starts any of them. An example of driving the harness from your own state.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AgentHarness, type AgentHarnessBlock, type AgentHarnessConversation, type AgentHarnessState, type AgentHarnessStatus
} from '../components/agent-harness/AgentHarness';
import type { AgentLane, LaneTone } from '../components/agent-lanes/AgentLanes';
import type { ArtifactVersion } from '../components/artifact-card/ArtifactCard';
import type { ChangedFile } from '../components/change-review/ChangeReview';
import type { DecisionQuestion } from '../components/decision-prompt/DecisionPrompt';
import type { RecoveryStep } from '../components/error-recovery/ErrorRecovery';
import type { AnswerSource, AnswerTurn } from '../components/live-answer/LiveAnswer';
import type { PlanReviewStep } from '../components/plan-review/PlanReview';
import type { Starter } from '../components/prompt-starters/PromptStarters';
import type { StackSource } from '../components/source-stack/SourceStack';
import type { ThinkingStep } from '../components/thinking/Thinking';
import type { ToolCallItem } from '../components/tool-call/ToolCall';
import { Icon, type IconName } from '../lib/icons';
import { Think } from '../lib/motion';
import { useWait } from './useScript';

type Conv = AgentHarnessConversation;
type Story = 'pricing' | 'team' | 'dropoff' | 'annual' | 'sync';

/* ---------- what the stories say and show ---------- */
const ASK: Record<Story, string> = {
  pricing: 'Tighten the pricing page: fix the spacing, check the plan prices, and apply the fixes in Figma.',
  team: 'Redesign the pricing page with a researcher, a designer and a reviewer.',
  dropoff: 'Where are people dropping off in onboarding?',
  annual: 'Why do annual plans convert better for us?',
  sync: "Sync this quarter's deals to the Pipeline 2026 sheet and post a summary in #sales."
};
const STARTERS: (Starter & { story: Story; name: string })[] = [
  { icon: 'grid', tone: 'blue', title: 'Audit a page', description: 'Fix the spacing and prices on the pricing page', story: 'pricing', name: 'Audit the pricing page',
    prompt: 'Audit the pricing page for spacing and contrast, then apply the fixes in Figma.' },
  { icon: 'chart', tone: 'teal', title: 'Explain a drop', description: 'Find where people leave onboarding', story: 'dropoff', name: 'Where people drop off', prompt: ASK.dropoff },
  { icon: 'table', tone: 'green', title: 'Sync a sheet', description: "Send this quarter's deals to Sheets", story: 'sync', name: 'Sync deals to the sheet', prompt: ASK.sync },
  { icon: 'users', tone: 'purple', title: 'Split the work', description: 'Three agents redesign the pricing page', story: 'team', name: 'Pricing with three agents', prompt: ASK.team }
];

type Thought = Omit<ThinkingStep, 'state' | 'label'> & { run: string; done: string; dead?: boolean; count?: number; ms: number };
const THOUGHTS: Thought[] = [
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
const CALLS: ToolCallItem[] = [
  { key: 'plans', icon: 'db', server: 'billing', name: 'list_plan_changes', state: 'queued', duration: '412 ms',
    input: { since: '2026-10-01' }, output: [{ plan: 'Pro', price: 24 }, { plan: 'Team', price: 48 }] },
  { key: 'edit', icon: 'edit', server: 'files', name: 'edit', state: 'queued', duration: '1.2 s', input: { path: 'Pricing.tsx', lines: 6 }, output: { changed: 6, saved: true } }
];
const PLAN = ['Read the pricing frames and the brand tokens', 'Compare against the three competitor pages', 'Simplify the plan cards to one CTA each',
  'Move the FAQ below the comparison table', 'Write a summary of every change'];
const QUESTIONS: DecisionQuestion[] = [
  { question: 'Which frames should the agent redesign?', label: 'Frames', options: [{ label: 'Pricing only', detail: '1 frame' }, { label: 'Pricing and checkout', detail: '3 frames' }, { label: 'The whole flow', detail: '9 frames' }] },
  { question: 'How bold can the changes be?', label: 'Scope', options: [{ label: 'Polish spacing and type', detail: 'Safe' }, { label: 'Rework the layout', detail: 'Medium' }, { label: 'Fresh direction', detail: 'Bold' }] },
  { question: 'Where should the result go?', label: 'Output', options: [{ label: 'New Figma page', detail: 'Keeps the original' }, { label: 'Branch in the repo', detail: 'Opens a PR' }, { label: 'Both', detail: 'Recommended' }] }
];
const LANES: { key: string; name: string; icon: IconName; tone: LaneTone; wait?: string; acts: string[]; log: string[] }[] = [
  { key: 'researcher', name: 'Researcher', icon: 'search', tone: 'blue', acts: ['Reading competitor sites', 'Comparing 5 pricing pages', 'Writing the brief'], log: ['Read stripe.com/pricing', 'Read linear.app/pricing', 'Noted 3 patterns'] },
  { key: 'designer', name: 'Designer', icon: 'palette', tone: 'purple', wait: 'Waiting for the brief', acts: ['Laying out pricing cards', 'Setting type and spacing', 'Exporting frames'], log: ['Made 3 card variants', 'Applied spacing tokens', 'Exported 4 frames'] },
  { key: 'reviewer', name: 'Reviewer', icon: 'eye', tone: 'green', wait: 'Waiting for the designer', acts: ['Checking contrast', 'Checking copy', 'Signing off'], log: ['Contrast passes AA', 'Fixed 2 lines of copy', 'Approved'] }
];
const FILES: ChangedFile[] = [
  { name: 'PricingCard.tsx', path: 'src/PricingCard.tsx', hunks: [
    { title: 'Use the shared button', lines: [{ kind: 'ctx', line: 14, text: '  return (' }, { kind: 'del', line: 15, text: '    <button className="cta-old">' }, { kind: 'add', line: 15, text: '    <Button variant="primary">' }, { kind: 'ctx', line: 16, text: '      {plan.cta}' }] },
    { title: 'Drop the second CTA', lines: [{ kind: 'del', line: 22, text: '    <a href="/contact">Talk to sales</a>' }, { kind: 'ctx', line: 22, text: '  </Card>' }] }
  ] },
  { name: 'tokens.css', path: 'src/tokens.css', hunks: [
    { title: 'Raise muted text contrast', lines: [{ kind: 'ctx', line: 8, text: ':root {' }, { kind: 'del', line: 9, text: '  --text-muted: #c9cfd8;' }, { kind: 'add', line: 9, text: '  --text-muted: #5b6472;' }, { kind: 'ctx', line: 10, text: '  --radius-card: 16px;' }] }
  ] },
  { name: 'pricing.mdx', path: 'src/pricing.mdx', hunks: [
    { title: 'Move the FAQ below the table', lines: [{ kind: 'del', line: 31, text: '<FAQ />' }, { kind: 'ctx', line: 31, text: '<CompareTable />' }, { kind: 'add', line: 32, text: '<FAQ />' }] }
  ] }
];
const ANSWER = 'Most people leave at the workspace step [1]. It asks for a team name before anyone has made anything, and five of eight people in interviews paused there [2]. Moving it after the first project, and filling the name from the email domain, should help [3].';
const FOLLOW: Record<string, string> = {
  'Show the drop-off by device': 'On mobile the workspace step loses 41% [1], on desktop 23% [1]. Most of the mobile drop comes from the keyboard covering the Continue button [3].',
  'Draft a fix for the workspace step': 'Ask for the team name after the first project, and fill it from the email domain so most people never type it [2]. On mobile, keep Continue above the keyboard [3], then compare the step again after a week [1].'
};
const THOUGHTS_LA = ['Read the funnel for the last 30 days', 'Matched the drop to the interview notes', 'Checked step 2 in Onboarding.fig'];
const ANSWER_SOURCES: AnswerSource[] = [
  { n: 1, mark: 'F', color: '#7a5af8', title: 'Funnel data', detail: 'Amplitude, last 30 days', tip: 'Funnel data, last 30 days' },
  { n: 2, mark: 'N', color: '#0ea5a4', title: 'Session notes', detail: 'Notion, 8 interviews', tip: 'Session notes from 8 interviews' },
  { n: 3, mark: 'S', color: '#f97316', title: 'Onboarding.fig', detail: 'Figma, step 2', tip: 'Onboarding.fig, step 2' }
];
const MONTHS = ['April', 'May', 'June', 'July', 'August', 'September'];
const VERSIONS: ArtifactVersion[] = [
  { text: 'First pass at churn by month, sources still to check.', values: [3.4, 3.9, 4.3, 4.1, 3.8, 3.6], meta: 'v1, edited yesterday', note: 'First draft' },
  { text: 'Churn rose in July, the spike lines up with the pricing change.', values: [3.4, 3.9, 4.1, 5.8, 4.7, 3.9], meta: 'v2, edited 1 hour ago', note: 'Added the July spike' },
  { text: 'Churn rose in July, then settled once onboarding emails went out.', values: [3.4, 3.9, 4.1, 5.8, 4.5, 3.1], meta: 'v3, edited 2 min ago', note: 'Final, with your fixes' }
].map((d, i) => {
  const last = d.values[d.values.length - 1], top = Math.max(...d.values);
  return { ...d, label: 'v' + (i + 1), value: last.toFixed(1) + '%', change: '−' + (top - last).toFixed(1) + ' pts since ' + MONTHS[d.values.indexOf(top)] };
});
const SOURCES: StackSource[] = [
  { kind: 'web', title: 'Baymard: pricing page UX', host: 'baymard.com', relevance: .92, mark: 'B', color: 'var(--dm-pb)' },
  { kind: 'web', title: 'Annual vs monthly anchoring study', host: 'cxl.com', relevance: .88, mark: 'C', color: '#d9480f' },
  { kind: 'file', title: 'Q3 conversion export.csv', host: 'Drive', relevance: .84, mark: 'CSV', color: 'var(--dm-pm)' },
  { kind: 'figma', title: 'Pricing v4, frame 2', host: 'Figma', relevance: .8, mark: 'F', color: 'var(--dm-pl)' },
  { kind: 'web', title: 'Stripe billing docs', host: 'stripe.com', relevance: .66, mark: 'S', color: '#635bff' },
  { kind: 'file', title: 'Pricing research notes', host: 'Notion', relevance: .61, mark: 'N', color: 'var(--dm-fg2)' },
  { kind: 'figma', title: 'Checkout flow', host: 'Figma', relevance: .52, mark: 'F', color: 'var(--dm-pl)' },
  { kind: 'web', title: 'NN/g on price framing', host: 'nngroup.com', relevance: .48, mark: 'N', color: 'var(--dm-fg2)' }
];
const RECOVERY = [{ value: 'retry', label: 'Ask for edit access, then retry' }, { value: 'skip', label: 'Skip it and post the summary' }, { value: 'hand', label: 'Hand it over to Maya' }];
const STALLED: RecoveryStep[] = [
  { label: 'Pull 1,240 deals from the CRM', state: 'done', note: 'Done in 8s' },
  { label: 'Write to the Pipeline 2026 sheet', state: 'fail', note: 'Error 403: the agent lost edit access to this sheet' },
  { label: 'Post the summary in #sales', state: 'wait' }
];
const user = (text: string): AgentHarnessBlock => ({ key: 'ask', kind: 'user', text });
const say = (key: string, text: string): AgentHarnessBlock => ({ key, kind: 'say', text });
const doneLanes = (): AgentLane[] => LANES.map((p, i) => ({ key: p.key, name: p.name, icon: p.icon, tone: p.tone, status: 'done', activity: p.log[2], done: 3,
  log: p.log.map((text, k) => ({ text, time: 6 + i * 16 + k * 5 + 's' })) }));

/* ---------- the four finished conversations open on their last state ---------- */
const FINISHED: Conv[] = [
  { id: 'team', title: 'Pricing with three agents', time: '12m', state: 'done', context: 58, status: { state: 'done', label: 'Ready to review', meta: '3 files' }, blocks: [
    user(ASK.team), say('s1', 'Three quick questions before I split the work.'),
    { key: 'dp', kind: 'decision-prompt', props: { questions: QUESTIONS, defaultAnswers: [0, 0, 0], startLabel: 'Starting the redesign', started: true, startedLabel: 'Started the redesign' } },
    say('s2', "I've handed the brief to three agents. Each one passes its work to the next."),
    { key: 'al', kind: 'agent-lanes', props: { lanes: doneLanes(), seconds: 51 } },
    say('s3', 'The reviewer signed off. Here are the changes, ready for you to keep or undo.'),
    { key: 'cr', kind: 'change-review', props: { files: FILES } }
  ] },
  { id: 'dropoff', title: 'Where people drop off', time: '1h', state: 'done', context: 24, status: { state: 'done', label: 'Answered', meta: '3 sources' }, blocks: [
    { key: 'la', kind: 'live-answer', props: { turns: [{ question: ASK.dropoff, state: 'done', text: ANSWER, thoughts: THOUGHTS_LA, thoughtFor: 2, sources: ANSWER_SOURCES }], followUps: Object.keys(FOLLOW) } },
    say('s1', 'I also put the numbers in a doc you can share with the team.'),
    { key: 'af', kind: 'artifact-card', props: { title: 'Churn analysis, Q3', versions: VERSIONS, defaultVersion: 2, axis: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], range: [2.6, 6.2], link: 'https://designme.dev/a/churn-q3', href: 'https://designme.dev/a/churn-q3' } }
  ] },
  { id: 'annual', title: 'Why annual converts better', time: '3h', state: 'done', context: 17, status: { state: 'done', label: 'Answered', meta: '8 sources' }, blocks: [
    user(ASK.annual),
    { key: 'ss', kind: 'source-stack', props: { sources: SOURCES, defaultOpen: true, children: 'Annual plans convert about 18% better when the monthly price is shown crossed out next to them.' } },
    say('s1', 'Want me to try the crossed-out monthly price on the pricing page?')
  ] },
  { id: 'sync', title: 'Sync deals to the sheet', time: '1d', state: 'done', unread: true, context: 31, status: { state: 'done', label: 'Recovered', meta: '1 retry' }, blocks: [
    user(ASK.sync),
    { key: 'er', kind: 'error-recovery', props: { title: 'Sync the pipeline to Sheets', status: 'Recovered', options: RECOVERY, open: false, steps: [
      { label: 'Pull 1,240 deals from the CRM', state: 'done', note: 'Done in 8s' }, { label: 'Write to the Pipeline 2026 sheet', state: 'done', note: 'Wrote 1,240 rows' },
      { label: 'Post the summary in #sales', state: 'done', note: 'Posted to 14 people' }] } },
    say('s1', 'All 1,240 deals are in the sheet, and the summary is posted in #sales.')
  ] }
];

export default function AgentHarnessDemo() {
  const [convs, setConvs] = useState<Conv[]>(() => [{ id: 'pricing', title: 'Redesign the pricing page', time: 'now', context: 4, blocks: [] }, ...FINISHED]);
  const [sel, setSel] = useState<string | null>('pricing');
  const [draft, setDraft] = useState('');
  const wait = useWait();
  // the preview drives itself until someone clicks or types in it; from then on every approval waits for them
  const touched = useRef(false);
  const live = useRef({ convs, sel, draft });
  useEffect(() => { live.current = { convs, sel, draft }; });
  const n = useRef(0);

  /* ---- small verbs the stories are written in ---- */
  const edit = (id: string, fn: (c: Conv) => Conv) => setConvs(cs => cs.map(c => c.id === id ? fn(c) : c));
  const put = (id: string, b: AgentHarnessBlock) => edit(id, c => ({ ...c, blocks: c.blocks.some(x => x.key === b.key) ? c.blocks.map(x => x.key === b.key ? b : x) : [...c.blocks, b] }));
  // merges into a component block's props
  const prop = (id: string, key: string, patch: object) => edit(id, c => ({ ...c, blocks: c.blocks.map(b => b.key === key && 'props' in b ? { ...b, props: { ...b.props, ...patch } } as AgentHarnessBlock : b) }));
  const read = <T,>(id: string, key: string) => (live.current.convs.find(c => c.id === id)?.blocks.find(b => b.key === key) as { props?: T } | undefined)?.props;
  const status = (id: string, s: AgentHarnessStatus) => {
    const state: AgentHarnessState = s.state === 'done' ? 'done' : s.state === 'waiting' ? 'waiting' : s.state === 'idle' ? 'idle' : 'running';
    edit(id, c => ({ ...c, status: s, state }));
  };
  const ctx = (id: string, context: number) => edit(id, c => ({ ...c, context }));
  const end = (id: string, label: string, meta?: string) => { status(id, { state: 'done', label, meta }); if (live.current.sel !== id) edit(id, c => ({ ...c, unread: true })); };
  const until = async (fn: () => boolean, ms = 120) => { while (!fn()) await wait(ms); };
  const auto = (ms: number, go: () => void) => { wait(ms).then(() => { if (!touched.current) go(); }); };
  const speak = async (id: string, key: string, text: string) => {
    let t = '';
    for (const w of text.split(' ')) { t += (t ? ' ' : '') + w; put(id, say(key, t)); await wait(26 + Math.random() * 30); }
    await wait(260);
  };
  const typeIn = async (text: string, words = false) => {
    let t = '';
    for (const p of words ? text.split(/(?<= )/) : [...text]) { t += p; setDraft(t); await wait(words ? 38 : 12 + Math.random() * 22); }
  };
  const ask = async (id: string, text: string, typed: boolean) => {
    // the conversation that plays first is typed into the composer and sent, the way a person starts one
    if (typed && live.current.sel === id && !touched.current && !live.current.draft) { await typeIn(text); await wait(380); setDraft(''); }
    put(id, user(text)); status(id, { state: 'thinking', label: 'Thinking' }); await wait(700);
  };

  /* ---- the stories ---- */
  const STORIES: Record<Story, (id: string, text: string, typed: boolean) => Promise<void>> = {
    async pricing(id, text, typed) {
      await ask(id, text, typed); ctx(id, 12);
      // the trace plays at twice its own pace here
      const steps: ThinkingStep[] = [], t0 = performance.now();
      const think = (running = true) => put(id, { key: 'tk', kind: 'thinking', props: { steps: steps.slice(), running, summary: '3 cards to fix · 2 steps', collapseWhenDone: true } });
      const tick = () => status(id, { state: 'thinking', label: 'Thinking', meta: Math.round((performance.now() - t0) / 1000) + 's' });
      think(); await wait(400);
      for (const th of THOUGHTS) {
        const { run, done, dead, count, ms, ...rest } = th;
        steps.push({ ...rest, label: run, state: 'running', sources: undefined, moreSources: undefined }); think(); tick();
        const at = steps.length - 1;
        if (th.sources) { await wait(275); steps[at] = { ...steps[at], sources: th.sources, moreSources: th.moreSources }; think(); }
        if (count) for (let k = 2; k <= count; k++) { await wait(ms / count / 2); steps[at] = { ...steps[at], label: `Reading ${k} of ${count} frames` }; think(); tick(); }
        else await wait(ms / 2);
        steps[at] = { ...steps[at], label: done, state: dead ? 'dead' : 'done' }; think(); tick();
      }
      await wait(250); think(false); ctx(id, 21); await wait(500);

      let calls = CALLS;
      const call = (open?: string[]) => put(id, { key: 'tc', kind: 'tool-call', props: { calls, open, message: 'Checking which plans changed this month before I update the pricing page.',
        reply: 'Two plans changed. I updated their prices and the yearly saving on the page.' } });
      call(); await wait(600);
      for (const c of CALLS) {
        calls = calls.map(x => x.key === c.key ? { ...x, state: 'running' } : x); call(); status(id, { state: 'reading', label: 'Calling tools', meta: c.name });
        await wait(1300); calls = calls.map(x => x.key === c.key ? { ...x, state: 'done' } : x); call();
      }
      call(['plans']); ctx(id, 28); await wait(700);

      await speak(id, 's1', 'The Figma frames still show the old prices. To fix them I need edit access to Pricing.fig.');
      const gate = (patch: object) => prop(id, 'pg', patch);
      put(id, { key: 'pg', kind: 'permission-gate', props: { icon: <Icon name="figma" />, title: 'Allow the agent to edit Figma?', subtitle: 'It needs this to apply the pricing fixes',
        scopes: [{ key: 'read', label: 'Read frames', detail: 'Pricing, Checkout' }, { key: 'edit', label: 'Edit frames', detail: 'Only on a new page' }, { key: 'publish', label: 'Publish library', detail: 'Affects 4 other files', risk: 'Risky' }],
        defaultValue: ['read', 'edit'], status: 'asking', allowedDetail: 'Applying the pricing fixes now', onStatusChange: (s: string) => gate({ status: s }),
        onAllow: () => new Promise<void>(res => setTimeout(res, 600)), declinedTitle: 'The agent will skip the Figma edits', declinedDetail: 'It will list the fixes in chat instead' } });
      status(id, { state: 'waiting', label: 'Needs access', review: 'pg' });
      auto(2600, () => { if (read<{ status: string }>(id, 'pg')?.status === 'asking') gate({ status: 'allowed' }); });
      await until(() => read<{ status: string }>(id, 'pg')?.status !== 'asking');
      if (read<{ status: string }>(id, 'pg')?.status === 'declined') { await wait(500); await speak(id, 's2', "No problem. I'll list the fixes here instead."); return end(id, 'Done', 'Nothing edited'); }
      status(id, { state: 'working', label: 'Editing Figma' }); await wait(1400); gate({ allowedDetail: 'Done. 6 frames edited on a new page' }); await wait(500);

      await speak(id, 's2', "Here's the plan for the rest. Change any step, or approve it and I'll start.");
      const stop = { now: false };
      const plan = (patch: object) => prop(id, 'pl', patch);
      put(id, { key: 'pl', kind: 'plan-review', props: { title: 'Plan: redesign the pricing page', steps: PLAN.map((t, i) => ({ id: 's' + i, text: t })), phase: 'review',
        onStepsChange: (steps: PlanReviewStep[]) => plan({ steps }), onRequestChanges: () => plan({ note: 'Tell the agent what to change in chat' }),
        onApprove: () => plan({ phase: 'running', note: undefined }), onStop: () => { stop.now = true; }, onSeeChanges: () => {} } });
      status(id, { state: 'waiting', label: 'Needs your approval', review: 'pl' }); ctx(id, 33);
      auto(3400, () => { if (read<{ phase: string }>(id, 'pl')?.phase === 'review') plan({ phase: 'running' }); });
      await until(() => read<{ phase: string }>(id, 'pl')?.phase === 'running');
      const on = (read<{ steps: PlanReviewStep[] }>(id, 'pl')?.steps ?? []).filter(s => !s.skipped);
      const mark = (sid: string, state: PlanReviewStep['state']) => edit(id, c => ({ ...c, blocks: c.blocks.map(b => b.key === 'pl' && b.kind === 'plan-review'
        ? { ...b, props: { ...b.props, steps: (b.props.steps ?? []).map(s => s.id === sid ? { ...s, state } : s) } } : b) }));
      for (let i = 0; i < on.length && !stop.now; i++) {
        mark(on[i].id, 'run'); plan({ status: `Step ${i + 1} of ${on.length}` }); status(id, { state: 'working', label: 'Running the plan', meta: `Step ${i + 1} of ${on.length}` });
        await wait(900); mark(on[i].id, 'done');
      }
      plan({ status: stop.now ? 'Stopped, progress kept' : 'Done. 4 frames updated', phase: 'done' });
      if (stop.now) { await speak(id, 's3', 'Stopped. The finished steps are kept.'); return end(id, 'Stopped', 'Progress kept'); }
      ctx(id, 42); await wait(600);

      await speak(id, 's3', "All done. Here's what changed.");
      put(id, { key: 'rs', kind: 'run-summary', props: { subtitle: 'Finished in 12m 40s', summary: 'Tightened the pricing cards and moved them onto spacing tokens',
        stats: [{ label: 'files', value: 6 }, { label: 'steps', value: 14 }, { label: 'tokens', value: 182, suffix: 'k' }, { label: 'cost', value: 0.84, prefix: '$', decimals: 2 }],
        changes: [{ file: 'PricingCard.tsx', added: 24, removed: 18 }, { file: 'tokens.css', added: 9, removed: 2 }, { file: 'Pricing.test.tsx', added: 31, removed: 0 }],
        needs: [{ key: 'badge', text: 'The yearly badge overlaps the price on mobile', action: { label: 'Review', onClick: () => {} } }], onDetails: () => {}, onOpenChanges: () => {} } });
      ctx(id, 46); await wait(1400); end(id, 'Done', '6 files changed');
    },

    async team(id, text, typed) {
      await ask(id, text, typed); ctx(id, 10);
      await speak(id, 's1', 'Three quick questions before I split the work.');
      const answers = () => read<{ answers: (number | null)[] }>(id, 'dp')?.answers ?? [];
      put(id, { key: 'dp', kind: 'decision-prompt', props: { questions: QUESTIONS, answers: [], onAnswersChange: (a: (number | null)[]) => prop(id, 'dp', { answers: a }), startLabel: 'Starting the redesign' } });
      status(id, { state: 'waiting', label: 'Needs your answers', review: 'dp' });
      while (answers().length < QUESTIONS.length) {
        const at = answers().length;
        auto(1500, () => { if (answers().length === at) prop(id, 'dp', { answers: [...answers(), 0] }); });
        await until(() => answers().length > at);
      }
      status(id, { state: 'working', label: 'Starting 3 agents' }); ctx(id, 18); await wait(1400);
      prop(id, 'dp', { started: true, startedLabel: 'Started the redesign' });
      await speak(id, 's2', "I've handed the brief to three agents. Each one passes its work to the next.");

      // the lanes play a little faster than on their own card
      let lanes: AgentLane[] = LANES.map(p => ({ key: p.key, name: p.name, icon: p.icon, tone: p.tone, status: 'queued', activity: p.wait ?? 'Queued', done: 0, log: [] }));
      let handoff: { from: string; to: string; what: string } | undefined, secs = 0;
      const show = () => put(id, { key: 'al', kind: 'agent-lanes', props: { lanes, handoff, seconds: secs } });
      const set = (key: string, patch: Partial<AgentLane> | ((l: AgentLane) => Partial<AgentLane>)) => { lanes = lanes.map(l => l.key === key ? { ...l, ...(typeof patch === 'function' ? patch(l) : patch) } : l); show(); };
      const t0 = performance.now(), clock = () => { const s = Math.floor((performance.now() - t0) / 1000); if (s !== secs) { secs = s; show(); status(id, { state: 'working', label: 'Agents working', meta: Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') }); } };
      const work = async (p: (typeof LANES)[number]) => {
        for (let i = 0; i < 3; i++) {
          set(p.key, { status: 'working', activity: p.acts[i], done: i });
          for (let t = 0; t < 900; t += 100) { await wait(100); clock(); }
          set(p.key, l => ({ done: i + 1, log: [...(l.log ?? []), { text: p.log[i], time: secs + 's' }] }));
        }
        set(p.key, { status: 'done', activity: p.log[2] });
      };
      const hand = async (from: string, to: string, what: string) => { handoff = { from, to, what }; show(); await wait(1000); handoff = undefined; show(); await wait(420); };
      show(); await wait(360);
      const first = work(LANES[0]); set('designer', { status: 'waiting' });
      await first; await hand('researcher', 'designer', 'the brief');
      await work(LANES[1]); await hand('designer', 'reviewer', '4 frames');
      await work(LANES[2]);
      ctx(id, 52); await wait(600);
      await speak(id, 's3', 'The reviewer signed off. Here are the changes, ready for you to keep or undo.');
      put(id, { key: 'cr', kind: 'change-review', props: { files: FILES } }); ctx(id, 58);
      await wait(900); end(id, 'Ready to review', '3 files');
    },

    async dropoff(id) {
      // the live answer brings the question with it
      ctx(id, 9);
      let turns: AnswerTurn[] = [];
      const show = (followUps?: string[]) => put(id, { key: 'la', kind: 'live-answer', props: { turns, followUps, onFollowUp: (q: string) => { followUp(q); } } });
      const answer = async (i: number, full: string) => {
        const set = (patch: Partial<AnswerTurn>) => { turns = turns.map((t, k) => k === i ? { ...t, ...patch } : t); show(); };
        set({ state: 'thinking', text: '' }); status(id, { state: 'thinking', label: 'Thinking' }); await wait(1300);
        set({ state: 'answering', thoughts: THOUGHTS_LA, thoughtFor: 2 }); status(id, { state: 'working', label: 'Answering' });
        let text = '';
        for (const tok of full.split(' ')) { text += (text ? ' ' : '') + tok; set({ text }); await wait(55 + Math.random() * 45); }
        set({ state: 'done', sources: ANSWER_SOURCES });
      };
      const followUp = async (q: string) => {
        turns = [...turns, { key: turns.length, question: q, state: 'waiting' }]; show();
        await wait(450); await answer(turns.length - 1, FOLLOW[q]); end(id, 'Answered', '3 sources');
      };
      turns = [{ key: 0, question: ASK.dropoff, state: 'waiting' }]; show();
      await answer(0, ANSWER); show(Object.keys(FOLLOW));
      ctx(id, 19); await wait(700);
      await speak(id, 's1', 'I also put the numbers in a doc you can share with the team.');
      status(id, { state: 'working', label: 'Writing the doc' });
      const doc = (version: number) => put(id, { key: 'af', kind: 'artifact-card', props: { title: 'Churn analysis, Q3', versions: VERSIONS, version, onVersionChange: v => { touched.current = true; doc(v); },
        axis: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], range: [2.6, 6.2], link: 'https://designme.dev/a/churn-q3', href: 'https://designme.dev/a/churn-q3' } });
      doc(0); ctx(id, 24);
      auto(2300, () => doc(1)); auto(4100, () => doc(2));
      await wait(4600); end(id, 'Answered', '3 sources');
    },

    async annual(id, text, typed) {
      await ask(id, text, typed); status(id, { state: 'reading', label: 'Reading 8 sources' }); ctx(id, 8);
      await wait(1500);
      const stack = (open: boolean) => put(id, { key: 'ss', kind: 'source-stack', props: { sources: SOURCES, open, onOpenChange: stack,
        children: 'Annual plans convert about 18% better when the monthly price is shown crossed out next to them.' } });
      stack(false); ctx(id, 17);
      await wait(1100); if (read<{ open: boolean }>(id, 'ss')?.open === false) stack(true);
      await wait(700);
      await speak(id, 's1', 'Want me to try the crossed-out monthly price on the pricing page?');
      end(id, 'Answered', '8 sources');
    },

    async sync(id, text, typed) {
      await ask(id, text, typed); status(id, { state: 'working', label: 'Syncing deals' }); ctx(id, 9);
      await wait(1200);
      let steps = STALLED, choice: string | null = null, sum = 'Stopped at step 2';
      const show = () => put(id, { key: 'er', kind: 'error-recovery', props: { title: 'Sync the pipeline to Sheets', status: sum, steps, options: RECOVERY, open: !choice, onContinue: go } });
      const step = (i: number, state: RecoveryStep['state'], note?: string) => { steps = steps.map((x, k) => k === i ? { ...x, state, note } : x); show(); };
      function go(v: string) { if (!choice) { choice = v; show(); } }
      show(); status(id, { state: 'waiting', label: 'Needs a decision', review: 'er' }); ctx(id, 14);
      auto(2600, () => go('retry'));
      await until(() => !!choice);
      if (choice === 'retry') {
        status(id, { state: 'working', label: 'Recovering' });
        step(1, 'run', 'Asking for edit access'); sum = 'Recovering'; show(); await wait(1200);
        step(1, 'run', 'Access granted, retrying'); await wait(1000);
        step(1, 'done', 'Wrote 1,240 rows'); step(2, 'run'); await wait(1000);
        step(2, 'done', 'Posted to 14 people'); sum = 'Recovered'; show();
        ctx(id, 31); await wait(600);
        await speak(id, 's1', 'All 1,240 deals are in the sheet, and the summary is posted in #sales.'); end(id, 'Recovered', '1 retry');
      } else if (choice === 'skip') {
        step(1, 'skip', 'Skipped, nothing was written'); step(2, 'run'); await wait(1000);
        step(2, 'done', 'Posted, with a note about the sheet'); sum = '2 of 3 done'; show(); await wait(600);
        await speak(id, 's1', 'The summary is posted in #sales. The sheet stays as it was until access is back.'); end(id, 'Done', '1 step skipped');
      } else {
        step(1, 'hand', 'Maya has the error, the logs and the last good state'); sum = 'Waiting on Maya'; show(); await wait(600);
        await speak(id, 's1', "Maya has the error and the logs. I'll pick it up again when she replies."); status(id, { state: 'waiting', label: 'Waiting on Maya' });
      }
    }
  };

  /* ---- starting, replying, switching ---- */
  const start = (story: Story, text: string, title: string) => {
    const id = 'c' + ++n.current;
    setConvs(cs => [{ id, title, time: 'now', state: 'running', context: 4, blocks: [] }, ...cs]); setSel(id);
    STORIES[story](id, text, false);
  };
  const reply = async (id: string, text: string, files: string[]) => {
    const k = 'r' + ++n.current;
    put(id, { key: k, kind: 'user', text, files });
    const agent = (node: ReactNode) => put(id, { key: k + 'a', kind: 'node', node: <div className="dm-cpx-ag dm-enter">{node}</div> });
    agent(<><Think /><span className="dm-shim">Thinking</span></>);
    await wait(1700); agent(<span>On it. I&apos;ll update this thread when it&apos;s done.</span>);
  };
  const pick = async (s: Starter) => {
    const st = STARTERS.find(x => x.title === s.title)!;
    setDraft(''); await typeIn(st.prompt, true); await wait(420); setDraft('');
    start(st.story, st.prompt, st.name);
  };

  // the first conversation plays once the card has come in
  useEffect(() => { wait(1300).then(() => STORIES.pricing('pricing', ASK.pricing, true)); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ width: '100%' }} onPointerDownCapture={e => { if (e.nativeEvent.isTrusted) touched.current = true; }} onKeyDownCapture={e => { if (e.nativeEvent.isTrusted) touched.current = true; }}>
      <AgentHarness conversations={convs} value={sel} onValueChange={id => { setSel(id); if (id) edit(id, c => ({ ...c, unread: false })); }}
        starters={STARTERS} onStarter={pick} model="Opus 5.5" draft={draft} onDraftChange={setDraft}
        onSend={({ text, attachments }, id) => {
          if (id) reply(id, text, attachments.map(a => a.label));
          else start('pricing', text || 'Have a look at these files.', (text.replace(/[.?!].*$/, '').split(/\s+/).slice(0, 5).join(' ') || 'New chat').replace(/^./, c => c.toUpperCase()));
        }}
        composer={{ projects: [{ value: 'acme-webapp', detail: '~/code/acme-webapp', icon: 'folder' }, { value: 'marketing-site', detail: '~/code/marketing-site', icon: 'folder' }] }} />
    </div>
  );
}
