'use client';
// The preview from designme.dev, rebuilt from the React component. Nothing plays by itself: New chat shows suggestions, and a
// story plays once when one is picked or a message is sent. Every approval waits for a click, and the five past chats open on
// their last state. An example of driving the harness from your own state.
import { useEffect, useRef, useState } from 'react';
import {
  AgentHarness, type AgentHarnessBlock, type AgentHarnessConversation, type AgentHarnessPanel, type AgentHarnessState,
  type AgentHarnessStatus, type AgentHarnessTab
} from '../components/agent-harness/AgentHarness';
import type { Action } from '../components/action-log/ActionLog';
import type { AgentLane, LaneTone } from '../components/agent-lanes/AgentLanes';
import type { ArtifactVersion } from '../components/artifact-card/ArtifactCard';
import type { ChangedFile } from '../components/change-review/ChangeReview';
import type { DecisionQuestion } from '../components/decision-prompt/DecisionPrompt';
import type { RecoveryStep } from '../components/error-recovery/ErrorRecovery';
import type { AnswerSource, AnswerTurn } from '../components/live-answer/LiveAnswer';
import type { PlanReviewStep } from '../components/plan-review/PlanReview';
import type { StackSource } from '../components/source-stack/SourceStack';
import type { ThinkingStep } from '../components/thinking/Thinking';
import type { ToolCallItem } from '../components/tool-call/ToolCall';
import { Icon, type IconName } from '../lib/icons';
import { useWait } from './useScript';

type Conv = AgentHarnessConversation;
type Story = 'pricing' | 'team' | 'dropoff' | 'annual' | 'sync';
/** A source of a short answer: its letter, colour, title and where it came from */
type Src = [string, string, string, string];

/* ---------- what the stories say and show ---------- */
const S: Record<Story, { ask: string; title: string; fresh: string; icon: IconName }> = {
  pricing: { ask: 'Tighten the spacing and prices on the pricing page', title: 'Pricing page fixes', fresh: 'Pricing spacing and prices', icon: 'grid' },
  team: { ask: 'Redesign the pricing page with three agents', title: 'Pricing with three agents', fresh: 'Three agents on pricing', icon: 'users' },
  dropoff: { ask: 'Where are people dropping off in onboarding?', title: 'Onboarding drop-off', fresh: 'Where onboarding loses people', icon: 'chart' },
  annual: { ask: 'Why do annual plans convert better for us?', title: 'Why annual converts', fresh: 'Annual vs monthly conversion', icon: 'coins' },
  sync: { ask: "Sync this quarter's deals to the pipeline sheet", title: 'Sync deals to Sheets', fresh: "This quarter's deals to Sheets", icon: 'table' }
};
const KEYS = Object.keys(S) as Story[];
const HUE = ['#3b82f6', '#7a5af8', '#0ea5a4', '#f97316', '#16a34a'];
// a message that names a story plays it; anything else gets an honest answer
const ROUTE: [Story, RegExp][] = [['team', /\b(agents?|researchers?|designers?|reviewers?|split)\b/i], ['sync', /\b(sync|deals?|sheets?|pipeline|crm|sales)\b/i],
  ['annual', /\b(annual|yearly|monthly|convert|conversions?)\b/i], ['dropoff', /\b(drop|dropping|onboarding|funnel|leav(e|ing)|activation|sign-?ups?)\b/i],
  ['pricing', /\b(pric(e|es|ing)|spacing|figma|audit|tighten|grid)\b/i]];
const route = (v: string) => KEYS.find(k => S[k].ask === v) ?? ROUTE.find(x => x[1].test(v))?.[0];
const GEN = "This preview only runs five example chats, so I can't look into that one for real. I can fix the pricing page [1], split a redesign between three agents [2], find where onboarding loses people [3], explain why annual plans convert [4] or sync deals to a sheet [5].";
// a follow-up gets a short answer with its sources
const FU: Record<string, [string, Src[]]> = {
  'What still needs me?': ['Just the yearly badge. It overlaps the price on mobile [1], and moving it changes the height of every card [2], so I left that call to you.',
    [['F', '#7a5af8', 'Pricing.fig', 'Mobile frame, 390px'], ['T', '#3b82f6', 'PricingCard.tsx', 'src/components']]],
  'Which spacing tokens did you use?': ['Three of them: space-4 inside each card [1], space-6 between cards and space-8 around the grid [1]. No frame uses the old 20px gap any more [2].',
    [['T', '#3b82f6', 'tokens.ts', 'src/styles'], ['F', '#7a5af8', 'Pricing.fig', '6 frames']]],
  'What did the researcher find?': ['Three patterns across five competitor pages [1]: one plan highlighted, yearly prices shown per month, and a single button on each card [2]. The designer used all three.',
    [['N', '#0ea5a4', 'Research brief', 'Notion'], ['S', '#635bff', 'stripe.com/pricing', 'Web']]],
  'Who signed off?': ['The reviewer agent [1]. Contrast passes AA on every card, and it fixed two lines of copy [2]. Merging still needs a person.',
    [['R', '#16a34a', 'Review notes', 'Reviewer agent'], ['C', '#f97316', 'Contrast report', '14 text pairs']]],
  'Try it on the pricing page': ['I made a variant with the monthly price crossed out next to the annual one [1], set up as an A/B test for half of your visitors [2]. Nothing goes live until you start it.',
    [['F', '#7a5af8', 'Pricing v5', 'Figma'], ['E', '#f97316', 'Experiment draft', '50/50 split']]],
  'How sure are you?': ['Fairly. The CXL study [1] and our Q3 export [2] point the same way, but our sample is small: 312 annual sign-ups. A two-week test would settle it.',
    [['C', '#d9480f', 'Annual vs monthly anchoring', 'cxl.com'], ['Q', '#16a34a', 'Q3 conversion export.csv', 'Drive']]],
  'Who can edit the sheet now?': ['You, Maya and the agent can edit it [1]. The 14 people in #sales can view it [2].',
    [['P', '#16a34a', 'Pipeline 2026', 'Sharing settings'], ['#', '#db2777', '#sales', 'Slack, 14 people']]],
  'Run this every Monday': ["Scheduled. Every Monday at 9:00 I'll sync the week's deals and post the summary in #sales [1]. You can pause it any time from Automations [2].",
    [['A', '#3b82f6', 'Weekly pipeline sync', 'Automation'], ['#', '#db2777', '#sales', 'Slack, 14 people']]]
};
const FOLLOW: Record<Story, string[] | undefined> = {
  pricing: ['What still needs me?', 'Which spacing tokens did you use?'], team: ['What did the researcher find?', 'Who signed off?'], dropoff: undefined,
  annual: ['Try it on the pricing page', 'How sure are you?'], sync: ['Who can edit the sheet now?', 'Run this every Monday']
};
const sourcesOf = (src: Src[]): AnswerSource[] => src.map((s, i) => ({ n: i + 1, mark: s[0], color: s[1], title: s[2], detail: s[3], tip: s[2] }));

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
const doneThoughts = (): ThinkingStep[] => THOUGHTS.map(({ run, done, dead, count, ms, ...rest }) => ({ ...rest, label: done, state: dead ? 'dead' : 'done' }));
const CALLS: ToolCallItem[] = [
  { key: 'plans', icon: 'db', server: 'billing', name: 'list_plan_changes', state: 'queued', duration: '412 ms',
    input: { since: '2026-10-01' }, output: [{ plan: 'Pro', price: 24 }, { plan: 'Team', price: 48 }] },
  { key: 'edit', icon: 'edit', server: 'files', name: 'edit', state: 'queued', duration: '1.2 s', input: { path: 'Pricing.tsx', lines: 6 }, output: { changed: 6, saved: true } }
];
const CALL_TEXT = { message: 'Checking which plans changed this month before I update the pricing page.', reply: 'Two plans changed. I updated their prices and the yearly saving on the page.' };
const ACTIONS: Omit<Action, 'state'>[] = [
  { icon: 'file-text', title: <>Read <code>Pricing.tsx</code></>, detail: 'src/pages, 212 lines', time: '0.4s', output: 'export function Pricing() {\n  return <Grid cols={3} gap={20}>…' },
  { icon: 'search', title: <>Searched Figma for <code>Button</code></>, detail: '6 matches in Components.fig', time: '1.1s', output: 'Button / Primary\nButton / Secondary\nButton / Ghost  +3' },
  { icon: 'edit', title: <>Edited <code>PricingCard.tsx</code></>, detail: <><span style={{ color: 'var(--dm-add)' }}>+18</span> <span style={{ color: 'var(--dm-del)' }}>−7</span> lines</>, time: '2.3s',
    output: <><span className="dm-x">− gap: 20px;</span>{'\n'}<span className="dm-a">+ gap: var(--space-6);</span></> },
  { icon: 'term', title: <>Ran <code>npm test</code></>, detail: '24 tests passed', time: '3.2s', output: '✓ PricingCard renders 3 plans\n✓ toggles yearly billing\n24 passed, 0 failed' },
  { icon: 'pr', title: 'Opened a pull request', detail: '#412, Use shared spacing tokens', time: '0.6s', output: 'feat/pricing-spacing → main\n3 commits, ready for review' }
];
const GATE = {
  icon: <Icon name="figma" />, title: 'Allow the agent to edit Figma?', subtitle: 'It needs this to apply the pricing fixes',
  scopes: [{ key: 'read', label: 'Read frames', detail: 'Pricing, Checkout' }, { key: 'edit', label: 'Edit frames', detail: 'Only on a new page' }, { key: 'publish', label: 'Publish library', detail: 'Affects 4 other files', risk: 'Risky' }],
  defaultValue: ['read', 'edit'], declinedTitle: 'The agent will skip the Figma edits', declinedDetail: 'It will list the fixes in chat instead'
};
const PLAN = ['Read the pricing frames and the brand tokens', 'Compare against the three competitor pages', 'Simplify the plan cards to one CTA each',
  'Move the FAQ below the comparison table', 'Write a summary of every change'];
const SUMMARY = { subtitle: 'Finished in 12m 40s', summary: 'Tightened the pricing cards and moved them onto spacing tokens',
  stats: [{ label: 'files', value: 6 }, { label: 'steps', value: 14 }, { label: 'tokens', value: 182, suffix: 'k' }, { label: 'cost', value: 0.84, prefix: '$', decimals: 2 }],
  changes: [{ file: 'PricingCard.tsx', added: 24, removed: 18 }, { file: 'tokens.css', added: 9, removed: 2 }, { file: 'Pricing.test.tsx', added: 31, removed: 0 }],
  needs: [{ key: 'badge', text: 'The yearly badge overlaps the price on mobile', action: { label: 'Review', onClick: () => {} } }], onDetails: () => {}, onOpenChanges: () => {} };
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
const LA_FOLLOW: Record<string, string> = {
  'Show the drop-off by device': 'On mobile the workspace step loses 41% [1], on desktop 23% [1]. Most of the mobile drop comes from the keyboard covering the Continue button [3].',
  'Draft a fix for the workspace step': 'Ask for the team name after the first project, and fill it from the email domain so most people never type it [2]. On mobile, keep Continue above the keyboard [3], then compare the step again after a week [1].'
};
const THOUGHTS_LA = ['Read the funnel for the last 30 days', 'Matched the drop to the interview notes', 'Checked step 2 in Onboarding.fig'];
const ANSWER_SOURCES: AnswerSource[] = [
  { n: 1, mark: 'F', color: '#7a5af8', title: 'Funnel data', detail: 'Amplitude, last 30 days', tip: 'Funnel data, last 30 days' },
  { n: 2, mark: 'N', color: '#0ea5a4', title: 'Session notes', detail: 'Notion, 8 interviews', tip: 'Session notes from 8 interviews' },
  { n: 3, mark: 'S', color: '#f97316', title: 'Onboarding.fig', detail: 'Figma, step 2', tip: 'Onboarding.fig, step 2' }
];
const MONTHS = ['April', 'May', 'June', 'July', 'August', 'September'], AXIS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const VERSIONS: ArtifactVersion[] = [
  { text: 'First pass at churn by month, sources still to check.', values: [3.4, 3.9, 4.3, 4.1, 3.8, 3.6], meta: 'v1, edited yesterday', note: 'First draft' },
  { text: 'Churn rose in July, the spike lines up with the pricing change.', values: [3.4, 3.9, 4.1, 5.8, 4.7, 3.9], meta: 'v2, edited 1 hour ago', note: 'Added the July spike' },
  { text: 'Churn rose in July, then settled once onboarding emails went out.', values: [3.4, 3.9, 4.1, 5.8, 4.5, 3.1], meta: 'v3, edited 2 min ago', note: 'Final, with your fixes' }
].map((d, i) => {
  const last = d.values[d.values.length - 1], top = Math.max(...d.values);
  return { ...d, label: 'v' + (i + 1), value: last.toFixed(1) + '%', change: '−' + (top - last).toFixed(1) + ' pts since ' + MONTHS[d.values.indexOf(top)] };
});
const DOC = { title: 'Churn analysis, Q3', versions: VERSIONS, axis: AXIS, range: [2.6, 6.2] as [number, number], link: 'https://designme.dev/a/churn-q3', openLabel: 'Open beside the chat' };
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
const STACK_TEXT = 'Annual plans convert about 18% better when the monthly price is shown crossed out next to them.';
const RECOVERY = [{ value: 'retry', label: 'Ask for edit access, then retry' }, { value: 'skip', label: 'Skip it and post the summary' }, { value: 'hand', label: 'Hand it over to Maya' }];
const STALLED: RecoveryStep[] = [
  { label: 'Pull 1,240 deals from the CRM', state: 'done', note: 'Done in 8s' },
  { label: 'Write to the Pipeline 2026 sheet', state: 'fail', note: 'Error 403: the agent lost edit access to this sheet' },
  { label: 'Post the summary in #sales', state: 'wait' }
];
const NOTES = {
  gate: "I can't change the frames without access. Allow it above, or pick Not now and I'll list the fixes here.",
  plan: "Noted. Edit a step above to match, or approve the plan as it is and I'll start.",
  ask: "Pick an answer above, or press Skip and I'll decide for you.",
  recover: "Choose how I should carry on above, and I'll pick it up from there.",
  maya: "Maya hasn't replied yet. I'll carry on as soon as she does."
};
const doneLanes = (): AgentLane[] => LANES.map((p, i) => ({ key: p.key, name: p.name, icon: p.icon, tone: p.tone, status: 'done', activity: p.log[2], done: 3,
  log: p.log.map((text, k) => ({ text, time: 6 + i * 16 + k * 5 + 's' })) }));

/* ---------- the five past chats, on their last state ---------- */
const user = (text: string): AgentHarnessBlock => ({ key: 'ask', kind: 'user', text });
const say = (key: string, text: string): AgentHarnessBlock => ({ key, kind: 'say', text });
const PAST = (openDoc: () => void): Conv[] => [
  { id: 'pricing', title: S.pricing.title, state: 'done', context: 46, status: { state: 'done', label: 'Done', meta: '6 files changed' }, followUps: FOLLOW.pricing, blocks: [
    user(S.pricing.ask),
    { key: 'g1', kind: 'group', label: 'Checked 6 frames and 2 plan prices', state: 'done', seconds: 11, blocks: [
      { key: 'tk', kind: 'thinking', props: { steps: doneThoughts(), running: false, seconds: 9, summary: '3 cards to fix · 2 steps', defaultOpen: false } },
      { key: 'tc', kind: 'tool-call', props: { calls: CALLS.map(c => ({ ...c, state: 'done' })), defaultOpen: ['plans'], ...CALL_TEXT } }
    ] },
    say('s1', 'Three cards break the 8px grid, and the Figma frames still show the old prices. To fix them I need edit access to Pricing.fig.'),
    { key: 'pg', kind: 'permission-gate', props: { ...GATE, defaultStatus: 'allowed', allowedDetail: 'Done. 6 frames edited on a new page' } },
    { key: 'g2', kind: 'group', label: 'Edited 6 frames and opened a pull request', state: 'done', seconds: 6, blocks: [
      { key: 'al', kind: 'action-log', props: { actions: ACTIONS.map(a => ({ ...a, state: 'done' })), running: false } }
    ] },
    say('s2', "Here's the plan for the rest of the redesign. Change any step, or approve it and I'll start."),
    { key: 'pl', kind: 'plan-review', props: { title: 'Plan: redesign the pricing page', phase: 'done', status: 'Done. 4 frames updated', steps: PLAN.map((t, i) => ({ id: 's' + i, text: t, state: 'done' })), onSeeChanges: () => {} } },
    say('s3', "All done. Here's what changed."),
    { key: 'rs', kind: 'run-summary', props: SUMMARY }
  ] },
  { id: 'team', title: S.team.title, state: 'done', context: 58, status: { state: 'done', label: 'Ready to review', meta: '3 files' }, followUps: FOLLOW.team, blocks: [
    user(S.team.ask), say('s1', 'Three quick questions before I split the work.'),
    { key: 'dp', kind: 'decision-prompt', props: { questions: QUESTIONS, defaultAnswers: [0, 0, 0], startLabel: 'Starting the redesign', started: true, startedLabel: 'Started the redesign' } },
    say('s2', "I've handed the brief to three agents. Each one passes its work to the next."),
    { key: 'al', kind: 'agent-lanes', props: { lanes: doneLanes(), seconds: 51 } },
    say('s3', 'The reviewer signed off. Here are the changes, ready for you to keep or undo.'),
    { key: 'cr', kind: 'change-review', props: { files: FILES } }
  ] },
  { id: 'dropoff', title: S.dropoff.title, state: 'done', context: 24, status: { state: 'done', label: 'Answered', meta: '3 sources' }, blocks: [
    { key: 'la', kind: 'live-answer', props: { turns: [{ question: S.dropoff.ask, state: 'done', text: ANSWER, thoughts: THOUGHTS_LA, thoughtFor: 2, sources: ANSWER_SOURCES }], followUps: Object.keys(LA_FOLLOW) } },
    say('s1', "I also put last quarter's churn numbers in a doc you can share with the team."),
    { key: 'af', kind: 'artifact-card', props: { ...DOC, defaultVersion: 2, onOpen: openDoc } }
  ] },
  { id: 'annual', title: S.annual.title, state: 'done', context: 17, status: { state: 'done', label: 'Answered', meta: '8 sources' }, followUps: FOLLOW.annual, blocks: [
    user(S.annual.ask),
    { key: 'ss', kind: 'source-stack', props: { sources: SOURCES, defaultOpen: true, children: STACK_TEXT } },
    say('s1', 'Want me to try the crossed-out monthly price on the pricing page?')
  ] },
  { id: 'sync', title: S.sync.title, state: 'done', unread: true, context: 31, status: { state: 'done', label: 'Recovered', meta: '1 retry' }, followUps: FOLLOW.sync, blocks: [
    user(S.sync.ask),
    { key: 'er', kind: 'error-recovery', props: { title: 'Sync the pipeline to Sheets', status: 'Recovered', options: RECOVERY, open: false, steps: [
      { label: 'Pull 1,240 deals from the CRM', state: 'done', note: 'Done in 8s' }, { label: 'Write to the Pipeline 2026 sheet', state: 'done', note: 'Wrote 1,240 rows' },
      { label: 'Post the summary in #sales', state: 'done', note: 'Posted to 14 people' }] } },
    say('s1', 'All 1,240 deals are in the sheet, and the summary is posted in #sales.')
  ] }
];

/* ---------- the artifact, opened beside the chat ---------- */
const W = 300, H = 56;
const curve = (p: [number, number][]) => p.reduce((d, q, k, a) => {
  if (!k) return `M${q[0]} ${q[1]}`;
  const p0 = a[k - 2] || a[k - 1], p1 = a[k - 1], p3 = a[k + 1] || q, t = .18;
  return d + ` C${p1[0] + (q[0] - p0[0]) * t} ${p1[1] + (q[1] - p0[1]) * t} ${q[0] - (p3[0] - p1[0]) * t} ${q[1] - (p3[1] - p1[1]) * t} ${q[0]} ${q[1]}`;
}, '');
function DocPanel({ v }: { v: ArtifactVersion }) {
  const [lo, hi] = DOC.range, d = curve(v.values.map((y, k): [number, number] => [k / (v.values.length - 1) * W, 52 - (y - lo) / (hi - lo) * 46]));
  return (
    <>
      <div className="dm-afx-doc dm-enter" style={{ animationDelay: '140ms' }}>
        <div className="dm-afx-dh">{DOC.title}</div>
        <div className="dm-afx-dp">{v.text}</div>
        <div className="dm-afx-kp"><b className="dm-num dm-afx-v">{v.value}</b><span className="dm-afx-d">{v.change}</span></div>
        <svg className="dm-afx-ch" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true"><path className="dm-ar" d={`${d} L${W} ${H} L0 ${H} Z`} /><path className="dm-ln" d={d} /></svg>
        <div className="dm-afx-ax">{AXIS.map(a => <span key={a}>{a}</span>)}</div>
      </div>
      <div className="dm-ahx-pn dm-enter" style={{ animationDelay: '210ms' }}>
        <b>What moved it</b><p>The July spike lines up with the pricing change on July 3. Churn settled once the onboarding emails went out in August.</p>
        <b>Sources</b><p>Billing export for Q3, retention in Amplitude, and the onboarding email stats.</p>
      </div>
    </>
  );
}

/* ---------- blocks live in a tree: a group holds the work under it ---------- */
const find = (bs: AgentHarnessBlock[], key: string): AgentHarnessBlock | undefined => {
  for (const b of bs) { if (b.key === key) return b; if (b.kind === 'group') { const x = find(b.blocks, key); if (x) return x; } }
};
const mapTree = (bs: AgentHarnessBlock[], key: string, fn: (b: AgentHarnessBlock) => AgentHarnessBlock | null): AgentHarnessBlock[] =>
  bs.flatMap(b => b.key === key ? (fn(b) ?? []) : b.kind === 'group' ? [{ ...b, blocks: mapTree(b.blocks, key, fn) }] : [b]);
const think: AgentHarnessStatus = { state: 'thinking', label: 'Thinking' };

export default function AgentHarnessDemo() {
  const [version, setVersion] = useState(2);
  const [panel, setPanel] = useState<'doc' | null>(null);
  const [convs, setConvs] = useState<Conv[]>(() => PAST(() => setPanel('doc')));
  const [tabs, setTabs] = useState<AgentHarnessTab[]>([{ key: 'new' }]);
  const [tab, setTab] = useState('new');
  const wait = useWait();
  const live = useRef({ convs, tabs, tab });
  useEffect(() => { live.current = { convs, tabs, tab }; });
  const notes = useRef<Record<string, string>>({});
  const n = useRef(0);

  /* ---- small verbs the stories are written in ---- */
  const edit = (id: string, fn: (c: Conv) => Conv) => setConvs(cs => cs.map(c => c.id === id ? fn(c) : c));
  const put = (id: string, b: AgentHarnessBlock, into?: string) => edit(id, c => ({ ...c, blocks: find(c.blocks, b.key) ? mapTree(c.blocks, b.key, () => b)
    : into ? mapTree(c.blocks, into, g => g.kind === 'group' ? { ...g, blocks: [...g.blocks, b] } : g) : [...c.blocks, b] }));
  const patch = (id: string, key: string, fn: (b: AgentHarnessBlock) => AgentHarnessBlock | null) => edit(id, c => ({ ...c, blocks: mapTree(c.blocks, key, fn) }));
  // merges into a component block's props
  const prop = (id: string, key: string, more: object) => patch(id, key, b => 'props' in b ? { ...b, props: { ...b.props, ...more } } as AgentHarnessBlock : b);
  const read = <T,>(id: string, key: string) => (find(live.current.convs.find(c => c.id === id)?.blocks ?? [], key) as { props?: T } | undefined)?.props;
  const status = (id: string, s: AgentHarnessStatus) => {
    const state: AgentHarnessState = s.state === 'done' ? 'done' : s.state === 'waiting' ? 'waiting' : s.state === 'idle' ? 'idle' : 'running';
    edit(id, c => ({ ...c, status: s, state }));
  };
  const onScreen = (id: string) => live.current.tabs.find(t => t.key === live.current.tab)?.chat === id;

  /* what a story can do: say something, bring in a component, gather work under one line, wait on the person, and keep the pill honest */
  const turn = (id: string, text: string, files: string[] = []) => {
    const r = 'r' + ++n.current + '-';
    const t = {
      text, k: (key: string) => r + key, wait,
      until: async (fn: () => boolean, ms = 120) => { while (!fn()) await wait(ms); },
      status: (s: AgentHarnessStatus) => status(id, s),
      // waiting on the person: the pill offers Review, and a message sent meanwhile gets this note back
      hold: (key: string, label: string, note: string) => { notes.current[id] = note; status(id, { state: 'waiting', label, review: r + key }); },
      ctx: (context: number) => edit(id, c => ({ ...c, context })),
      put: (b: AgentHarnessBlock, into?: string) => put(id, { ...b, key: r + b.key } as AgentHarnessBlock, into && r + into),
      prop: (key: string, more: object) => prop(id, r + key, more),
      read: <T,>(key: string) => read<T>(id, r + key),
      async ask(quiet = false) {
        put(id, { key: r + 'ask', kind: 'user', text, files });
        if (!quiet) { status(id, think); await wait(700); }
      },
      async say(key: string, words: string) {
        let s = '';
        for (const w of words.split(' ')) { s += (s ? ' ' : '') + w; put(id, { key: r + key, kind: 'say', text: s }); await wait(26 + Math.random() * 30); }
        await wait(260);
      },
      working(key: string, words: string) { put(id, { key: r + key, kind: 'working', text: words }); return () => patch(id, r + key, () => null); },
      // the agent's work under one line, folded into its summary when it is done
      group(key: string, label: string) {
        put(id, { key: r + key, kind: 'group', label, state: 'running', blocks: [] });
        const t0 = performance.now();
        return { done: (l: string) => patch(id, r + key, b => ({ ...b, label: l, state: 'done', seconds: Math.max(1, Math.round((performance.now() - t0) / 1000)) }) as AgentHarnessBlock) };
      },
      // a short answer in the Live answer's own shape, under the person's bubble
      async answer(key: string, words: string, src: Src[], thoughts: string[], onSource?: (s: AnswerSource) => void) {
        let turnNow: AnswerTurn = { key: 0, state: 'thinking' };
        const show = () => put(id, { key: r + key, kind: 'live-answer', props: { turns: [turnNow], onSourceClick: onSource } });
        show(); status(id, think); await wait(1100);
        turnNow = { ...turnNow, state: 'answering', thoughts, thoughtFor: 1, text: '' }; show(); status(id, { state: 'working', label: 'Answering' });
        let s = '';
        for (const w of words.split(' ')) { s += (s ? ' ' : '') + w; turnNow = { ...turnNow, text: s }; show(); await wait(40 + Math.random() * 40); }
        turnNow = { ...turnNow, state: 'done', sources: sourcesOf(src) }; show();
      },
      end(label: string, meta?: string, followUps?: string[]) {
        status(id, { state: 'done', label, meta });
        edit(id, c => ({ ...c, followUps, unread: !onScreen(id) }));
      }
    };
    return t;
  };
  type T = ReturnType<typeof turn>;

  /* ---- the stories ---- */
  const STORIES: Record<Story, (t: T) => Promise<void>> = {
    async pricing(t) {
      await t.ask(); t.ctx(12);
      const g = t.group('g1', 'Checking the pricing page');
      // the trace plays at twice its own pace here
      const steps: ThinkingStep[] = [], t0 = performance.now();
      const trace = (running = true) => t.put({ key: 'tk', kind: 'thinking', props: { steps: steps.slice(), running, summary: '3 cards to fix · 2 steps', collapseWhenDone: true } }, 'g1');
      const tick = () => t.status({ state: 'thinking', label: 'Thinking', meta: Math.round((performance.now() - t0) / 1000) + 's' });
      trace(); await t.wait(400);
      for (const th of THOUGHTS) {
        const { run, done, dead, count, ms, ...rest } = th;
        steps.push({ ...rest, label: run, state: 'running', sources: undefined, moreSources: undefined }); trace(); tick();
        const at = steps.length - 1;
        if (th.sources) { await t.wait(275); steps[at] = { ...steps[at], sources: th.sources, moreSources: th.moreSources }; trace(); }
        if (count) for (let k = 2; k <= count; k++) { await t.wait(ms / count / 2); steps[at] = { ...steps[at], label: `Reading ${k} of ${count} frames` }; trace(); tick(); }
        else await t.wait(ms / 2);
        steps[at] = { ...steps[at], label: done, state: dead ? 'dead' : 'done' }; trace(); tick();
      }
      await t.wait(250); trace(false); t.ctx(21); await t.wait(400);
      let calls = CALLS;
      const call = (open?: string[]) => t.put({ key: 'tc', kind: 'tool-call', props: { calls, open, ...CALL_TEXT } }, 'g1');
      call(); await t.wait(600);
      for (const c of CALLS) {
        calls = calls.map(x => x.key === c.key ? { ...x, state: 'running' } : x); call(); t.status({ state: 'reading', label: 'Calling tools', meta: c.name });
        await t.wait(1300); calls = calls.map(x => x.key === c.key ? { ...x, state: 'done' } : x); call();
      }
      call(['plans']); g.done('Checked 6 frames and 2 plan prices'); t.ctx(28); await t.wait(700);

      await t.say('s1', 'Three cards break the 8px grid, and the Figma frames still show the old prices. To fix them I need edit access to Pricing.fig.');
      const gate = (more: object) => t.prop('pg', more);
      t.put({ key: 'pg', kind: 'permission-gate', props: { ...GATE, status: 'asking', allowedDetail: 'Applying the pricing fixes now', onStatusChange: s => gate({ status: s }),
        onAllow: () => new Promise<void>(res => setTimeout(res, 600)) } });
      t.hold('pg', 'Needs access', NOTES.gate);
      const answered = () => t.read<{ status: string }>('pg')?.status;
      await t.until(() => answered() === 'allowed' || answered() === 'declined');
      if (answered() === 'declined') { await t.wait(500); await t.say('s2', 'No problem. To fix it by hand, move the three cards onto the 8px grid and update the Pro and Team prices.'); return t.end('Done', 'Nothing edited'); }
      t.wait(1400).then(() => gate({ allowedDetail: 'Done. 6 frames edited on a new page' }));
      const g2 = t.group('g2', 'Applying the fixes');
      let acts: Action[] = [];
      const log = (running = true) => t.put({ key: 'al', kind: 'action-log', props: { actions: acts, running } }, 'g2');
      for (let i = 0; i < ACTIONS.length; i++) {
        acts = [...acts, { ...ACTIONS[i], state: 'running' }]; log(); t.status({ state: 'working', label: 'Applying the fixes', meta: `Step ${i + 1} of 5` });
        await t.wait(665); acts = acts.map((a, k) => k === i ? { ...a, state: 'done' } : a); log();
      }
      log(false); g2.done('Edited 6 frames and opened a pull request'); t.ctx(36); await t.wait(600);

      await t.say('s2', "Here's the plan for the rest of the redesign. Change any step, or approve it and I'll start.");
      const stop = { now: false };
      const plan = (more: object) => t.prop('pl', more);
      t.put({ key: 'pl', kind: 'plan-review', props: { title: 'Plan: redesign the pricing page', steps: PLAN.map((x, i) => ({ id: 's' + i, text: x })), phase: 'review',
        onStepsChange: (steps: PlanReviewStep[]) => plan({ steps }), onRequestChanges: () => plan({ note: 'Tell the agent what to change in chat' }),
        onApprove: () => plan({ phase: 'running', note: undefined }), onStop: () => { stop.now = true; }, onSeeChanges: () => {} } });
      t.hold('pl', 'Needs your approval', NOTES.plan); t.ctx(40);
      await t.until(() => t.read<{ phase: string }>('pl')?.phase === 'running');
      // the approved plan is fixed while it runs, so its steps are kept here
      let ps = t.read<{ steps: PlanReviewStep[] }>('pl')?.steps ?? [];
      const on = ps.filter(s => !s.skipped);
      const step = (sid: string, state: PlanReviewStep['state']) => { ps = ps.map(s => s.id === sid ? { ...s, state } : s); plan({ steps: ps }); };
      for (let i = 0; i < on.length && !stop.now; i++) {
        step(on[i].id, 'run'); plan({ status: `Step ${i + 1} of ${on.length}` }); t.status({ state: 'working', label: 'Running the plan', meta: `Step ${i + 1} of ${on.length}` });
        await t.wait(900); step(on[i].id, 'done');
      }
      plan({ status: stop.now ? 'Stopped, progress kept' : 'Done. 4 frames updated', phase: 'done' });
      if (stop.now) { await t.say('s3', 'Stopped. The finished steps are kept.'); return t.end('Stopped', 'Progress kept'); }
      t.ctx(44); await t.wait(600);
      await t.say('s3', "All done. Here's what changed.");
      t.put({ key: 'rs', kind: 'run-summary', props: SUMMARY }); t.ctx(46);
      await t.wait(1200); t.end('Done', '6 files changed', FOLLOW.pricing);
    },

    async team(t) {
      await t.ask(); t.ctx(10);
      await t.say('s1', 'Three quick questions before I split the work.');
      const answers = () => t.read<{ answers: (number | null)[] }>('dp')?.answers ?? [];
      t.put({ key: 'dp', kind: 'decision-prompt', props: { questions: QUESTIONS, answers: [], onAnswersChange: (a: (number | null)[]) => t.prop('dp', { answers: a }), startLabel: 'Starting the redesign' } });
      t.hold('dp', 'Needs your answers', NOTES.ask);
      await t.until(() => answers().length >= QUESTIONS.length);
      t.status({ state: 'working', label: 'Starting 3 agents' }); t.ctx(18); await t.wait(1400);
      t.prop('dp', { started: true, startedLabel: 'Started the redesign' });
      await t.say('s2', "I've handed the brief to three agents. Each one passes its work to the next.");
      // the lanes play a little faster than on their own card
      let lanes: AgentLane[] = LANES.map(p => ({ key: p.key, name: p.name, icon: p.icon, tone: p.tone, status: 'queued', activity: p.wait ?? 'Queued', done: 0, log: [] }));
      let handoff: { from: string; to: string; what: string } | undefined, secs = 0;
      const show = () => t.put({ key: 'al', kind: 'agent-lanes', props: { lanes, handoff, seconds: secs } });
      const set = (key: string, more: Partial<AgentLane> | ((l: AgentLane) => Partial<AgentLane>)) => { lanes = lanes.map(l => l.key === key ? { ...l, ...(typeof more === 'function' ? more(l) : more) } : l); show(); };
      const t0 = performance.now(), clock = () => { const s = Math.floor((performance.now() - t0) / 1000); if (s !== secs) { secs = s; show(); t.status({ state: 'working', label: 'Agents working', meta: Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') }); } };
      const work = async (p: (typeof LANES)[number]) => {
        for (let i = 0; i < 3; i++) {
          set(p.key, { status: 'working', activity: p.acts[i], done: i });
          for (let ms = 0; ms < 900; ms += 100) { await t.wait(100); clock(); }
          set(p.key, l => ({ done: i + 1, log: [...(l.log ?? []), { text: p.log[i], time: secs + 's' }] }));
        }
        set(p.key, { status: 'done', activity: p.log[2] });
      };
      const hand = async (from: string, to: string, what: string) => { handoff = { from, to, what }; show(); await t.wait(1000); handoff = undefined; show(); await t.wait(420); };
      show(); t.status({ state: 'working', label: 'Agents working', meta: '0:00' }); await t.wait(360);
      const first = work(LANES[0]); set('designer', { status: 'waiting' });
      await first; await hand('researcher', 'designer', 'the brief');
      await work(LANES[1]); await hand('designer', 'reviewer', '4 frames');
      await work(LANES[2]);
      t.ctx(52); await t.wait(600);
      await t.say('s3', 'The reviewer signed off. Here are the changes, ready for you to keep or undo.');
      t.put({ key: 'cr', kind: 'change-review', props: { files: FILES } }); t.ctx(58);
      await t.wait(800); t.end('Ready to review', '3 files', FOLLOW.team);
    },

    async dropoff(t) {
      // the live answer brings the question with it, and its own follow-ups
      t.ctx(9);
      let turns: AnswerTurn[] = [];
      const show = (followUps?: string[]) => t.put({ key: 'la', kind: 'live-answer', props: { turns, followUps, onFollowUp: (q: string) => { followUp(q); } } });
      const answer = async (i: number, full: string) => {
        const set = (more: Partial<AnswerTurn>) => { turns = turns.map((x, k) => k === i ? { ...x, ...more } : x); show(); };
        set({ state: 'thinking', text: '' }); t.status(think); await t.wait(1300);
        set({ state: 'answering', thoughts: THOUGHTS_LA, thoughtFor: 2 }); t.status({ state: 'working', label: 'Answering' });
        let text = '';
        for (const tok of full.split(' ')) { text += (text ? ' ' : '') + tok; set({ text }); await t.wait(55 + Math.random() * 45); }
        set({ state: 'done', sources: ANSWER_SOURCES });
      };
      const followUp = async (q: string) => {
        turns = [...turns, { key: turns.length, question: q, state: 'waiting' }]; show();
        await t.wait(450); await answer(turns.length - 1, LA_FOLLOW[q]); t.end('Answered', '3 sources');
      };
      turns = [{ key: 0, question: t.text, state: 'waiting' }]; show();
      await answer(0, ANSWER); show(Object.keys(LA_FOLLOW));
      t.ctx(19); await t.wait(700);
      await t.say('s1', "I also put last quarter's churn numbers in a doc you can share with the team.");
      t.status({ state: 'working', label: 'Writing the doc' });
      // the agent writes the doc in three versions, unless the person picks one first
      let picked = false;
      const doc = (v: number) => { t.put({ key: 'af', kind: 'artifact-card', props: { ...DOC, version: v, onVersionChange: x => { picked = true; doc(x); }, onOpen: () => { setVersion(v); setPanel('doc'); } } }); };
      doc(0); t.ctx(24);
      t.wait(2300).then(() => { if (!picked) doc(1); }); t.wait(4100).then(() => { if (!picked) doc(2); });
      await t.wait(4600); t.end('Answered', '3 sources');
    },

    async annual(t) {
      await t.ask(); t.ctx(8);
      const gone = t.working('w', 'Reading 8 sources'); t.status({ state: 'reading', label: 'Reading 8 sources' });
      await t.wait(1700); gone();
      const stack = (open: boolean) => t.put({ key: 'ss', kind: 'source-stack', props: { sources: SOURCES, open, onOpenChange: stack, children: STACK_TEXT } });
      stack(false); t.ctx(17);
      await t.wait(1100); if (t.read<{ open: boolean }>('ss')?.open === false) stack(true);
      await t.wait(600);
      await t.say('s1', 'Want me to try the crossed-out monthly price on the pricing page?');
      t.end('Answered', '8 sources', FOLLOW.annual);
    },

    async sync(t) {
      await t.ask(); t.ctx(9);
      const gone = t.working('w', 'Syncing 1,240 deals'); t.status({ state: 'working', label: 'Syncing deals' });
      await t.wait(1500); gone();
      let steps = STALLED, choice: string | null = null, sum = 'Stopped at step 2';
      const show = () => t.put({ key: 'er', kind: 'error-recovery', props: { title: 'Sync the pipeline to Sheets', status: sum, steps, options: RECOVERY, open: !choice, onContinue: go } });
      const step = (i: number, state: RecoveryStep['state'], note?: string) => { steps = steps.map((x, k) => k === i ? { ...x, state, note } : x); show(); };
      function go(v: string) { if (!choice) { choice = v; show(); } }
      show(); t.hold('er', 'Needs a decision', NOTES.recover); t.ctx(14);
      await t.until(() => !!choice);
      if (choice === 'retry') {
        t.status({ state: 'working', label: 'Recovering' });
        step(1, 'run', 'Asking for edit access'); sum = 'Recovering'; show(); await t.wait(1200);
        step(1, 'run', 'Access granted, retrying'); await t.wait(1000);
        step(1, 'done', 'Wrote 1,240 rows'); step(2, 'run'); await t.wait(1000);
        step(2, 'done', 'Posted to 14 people'); sum = 'Recovered'; show();
        t.ctx(31); await t.wait(600);
        await t.say('s1', 'All 1,240 deals are in the sheet, and the summary is posted in #sales.'); t.end('Recovered', '1 retry', FOLLOW.sync);
      } else if (choice === 'skip') {
        step(1, 'skip', 'Skipped, nothing was written'); step(2, 'run'); await t.wait(1000);
        step(2, 'done', 'Posted, with a note about the sheet'); sum = '2 of 3 done'; show(); t.ctx(31); await t.wait(600);
        await t.say('s1', 'The summary is posted in #sales. The sheet stays as it was until access is back.'); t.end('Done', '1 step skipped');
      } else {
        step(1, 'hand', 'Maya has the error, the logs and the last good state'); sum = 'Waiting on Maya'; show(); t.ctx(31); await t.wait(600);
        await t.say('s1', "Maya has the error and the logs. I'll pick it up again when she replies."); t.hold('er', 'Waiting on Maya', NOTES.maya);
      }
    }
  };

  /* ---- opening, sending, following up ---- */
  // a chat comes to the front if it is open, or opens a tab beside the one on screen
  const openChat = (id: string) => {
    const { tabs: ts, tab: cur } = live.current, has = ts.find(t => t.chat === id);
    if (has) return setTab(has.key);
    const key = 'tab-' + id + '-' + ++n.current, i = ts.findIndex(t => t.key === cur);
    setTabs([...ts.slice(0, i + 1), { key, chat: id }, ...ts.slice(i + 1)]); setTab(key);
  };
  // anything else gets an honest answer: this preview only knows its five example chats
  const generic = async (t: T) => {
    await t.ask();
    await t.answer('a', GEN, KEYS.map((k, i) => [S[k].title[0], HUE[i], S[k].title, 'Example chat']), ['Read your message', 'Looked through the five example chats', 'None of them covers this yet'],
      s => openChat(KEYS[s.n - 1]));
    t.end('Answered', '5 examples', KEYS.slice().sort(() => Math.random() - .5).slice(0, 2).map(k => S[k].ask));
  };
  // what the person sends in a chat: a follow-up, one of the stories, or anything else
  const converse = (id: string, text: string, files: string[] = []) => {
    const c = live.current.convs.find(x => x.id === id);
    edit(id, x => ({ ...x, followUps: undefined }));
    // while the agent waits on an answer above, a message gets a short note back and the story keeps waiting
    if (c?.state === 'waiting') { const t = turn(id, text, files); (async () => { await t.ask(true); await wait(600); await t.say('n', notes.current[id] ?? "I'll pick that up once you've answered above."); })(); return; }
    const f = FU[text] as [string, Src[]] | undefined, s = !f && route(text);
    const t = turn(id, text, files);
    status(id, think);
    (f ? (async () => { await t.ask(); await t.answer('a', f[0], f[1], ['Read the chat so far', 'Checked the sources']); t.end('Answered', f[1].length + ' sources'); })()
      : s ? STORIES[s](t) : generic(t)).catch(e => console.error(e));
  };
  const start = (text: string, files: string[]) => {
    const s = KEYS.find(k => S[k].ask === text);
    // a chat started now gets a title of its own, beside the past chat of the same story
    const title = s ? S[s].fresh : (w => w ? w[0].toUpperCase() + w.slice(1) : 'New chat')(text.replace(/[.?!][\s\S]*$/, '').split(/\s+/).slice(0, 5).join(' '));
    const id = 'c' + ++n.current;
    setConvs(cs => [{ id, title, state: 'running', status: think, context: 4, blocks: [] }, ...cs]);
    // the new chat is in the list before the story writes to it
    setTimeout(() => converse(id, text, files));
    return id;
  };

  // opening a chat clears its unread dot
  const seen = (ts: AgentHarnessTab[], key: string) => { const id = ts.find(t => t.key === key)?.chat; if (id) edit(id, c => c.unread ? { ...c, unread: false } : c); };
  const docPanel: AgentHarnessPanel | null = panel === 'doc' ? { title: DOC.title, link: DOC.link, children: <DocPanel v={VERSIONS[version]} /> } : null;
  return (
    <div style={{ width: '100%' }}>
      <AgentHarness conversations={convs} tabs={tabs} onTabsChange={ts => { setTabs(ts); seen(ts, tab); }} tab={tab} onTabChange={key => { setTab(key); seen(tabs, key); }}
        suggestions={KEYS.map(k => ({ icon: S[k].icon, text: S[k].ask }))}
        onSend={({ text, attachments }, id) => {
          const files = attachments.map(a => a.label), v = text || 'Have a look at these files.';
          if (id) { converse(id, v, files); return; }
          return start(v, files);
        }}
        onFollowUp={(text, id) => converse(id, text)}
        workspaces={[{ name: 'DesignMe Studio', mark: 'D' }, { name: 'Personal', mark: 'P', color: 'var(--dm-pl)' }]}
        panel={docPanel} onPanelClose={() => setPanel(null)} model="Opus 5.5"
        composer={{ projects: [{ value: 'acme-webapp', detail: '~/code/acme-webapp', icon: 'folder' }, { value: 'marketing-site', detail: '~/code/marketing-site', icon: 'folder' }] }} />
    </div>
  );
}
