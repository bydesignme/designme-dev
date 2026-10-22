# Agent harness

> Every component working together in one agent app.

Agent components / Harness. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/agent-harness

## Install

```sh
npx designme add agent-harness          # HTML, CSS and JS, with the shared core
npx designme add agent-harness --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

A complete agent chat app assembled from the other designme components: chats down the side, open chats as tabs, a New chat screen with suggestions, and a panel that opens beside the chat. Each chat is a list of blocks you drive from your own state, such as the person's message, the agent's words, a folded group of its work, or a component like a tool call or a permission gate. Use it as the starting point for a whole agent screen.

### When to use it

- When you are building an agent chat app and want the full layout wired up from the start.
- When the agent's replies mix text with plans, tool calls, approvals, diffs and artifacts.
- When people work on several chats at once and need tabs, unread marks and a running state per chat.
- As a reference for how the individual components fit together in one product.

### What it does

- Each conversation's `blocks` can be 'user', 'say', 'working', 'group', 'node', or one of thirteen components such as 'tool-call', 'permission-gate', 'plan-review' and 'change-review', each taking that component's own props.
- A 'group' block stays open while its state is 'running' and folds into its label a moment after it is 'done', unless the person opened it.
- Tabs for open chats, with + for New chat and × to close; each tab keeps its own draft in the composer.
- New chat shows a greeting, the `heading`, the Composer and three `suggestions` at a time, with Shuffle when there are more than three.
- `onSend` gets the message, the chat id (null from New chat) and the tab; return a new chat id from New chat and the tab becomes that chat. Nothing is sent while the chat on screen is running.
- A status pill beside the tabs, a context ring in the composer, a workspace switcher, chat search, `followUps` under the last block and a side `panel` with copy link and close.

### Accessibility

- Open chats are a role="tablist" labelled "Open chats", each tab role="tab" with aria-selected; the chat list and side panel are labelled aside elements.
- Escape closes the chat drawer on narrow screens, then the side panel through `onPanelClose`; in the chat search box it closes the search.
- Chats that are not on screen stay mounted but are aria-hidden and inert, and the status pill is an aria-live="polite" region.
- Auto-scrolling and the composer's move from New chat to the foot of the chat skip their animation when the user prefers reduced motion.

## Usage in React

```tsx
import { AgentHarness } from '@/components/designme/agent-harness/AgentHarness';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component. Nothing plays by itself: New chat shows suggestions, and a
// story plays once when one is picked or a message is sent. Every approval waits for a click, and the five past chats open on
// their last state. An example of driving the harness from your own state.
import { useEffect, useRef, useState } from 'react';
import {
  AgentHarness, type AgentHarnessBlock, type AgentHarnessConversation, type AgentHarnessPanel, type AgentHarnessState,
  type AgentHarnessStatus, type AgentHarnessTab
} from './AgentHarness';
import type { Action } from '../action-log/ActionLog';
import type { AgentLane, LaneTone } from '../agent-lanes/AgentLanes';
import type { ArtifactVersion } from '../artifact-card/ArtifactCard';
import type { ChangedFile } from '../change-review/ChangeReview';
import type { DecisionQuestion } from '../decision-prompt/DecisionPrompt';
import type { RecoveryStep } from '../error-recovery/ErrorRecovery';
import type { AnswerSource, AnswerTurn } from '../live-answer/LiveAnswer';
import type { PlanReviewStep } from '../plan-review/PlanReview';
import type { StackSource } from '../source-stack/SourceStack';
import type { ThinkingStep } from '../thinking/Thinking';
import type { ToolCallItem } from '../tool-call/ToolCall';
import { Icon, type IconName } from '../lib/icons';
import { useWait } from '../lib/useScript';

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
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `conversations` | `AgentHarnessConversation[]` | The chats down the side, newest first |
| `tabs` (optional) | `AgentHarnessTab[]` | The open tabs, in order. Leave it out to let the harness keep them; it starts with one New chat tab |
| `defaultTabs` (optional) | `AgentHarnessTab[]` |  |
| `onTabsChange` (optional) | `(tabs: AgentHarnessTab[]) => void` |  |
| `tab` (optional) | `string` | The key of the tab on screen |
| `defaultTab` (optional) | `string` |  |
| `onTabChange` (optional) | `(tab: string) => void` |  |
| `suggestions` (optional) | `AgentHarnessSuggestion[]` | New chat's suggestions. Three show at a time, and Shuffle shows the next three |
| `onSend` (optional) | `(message: { text: string; attachments: ComposerAttachment[] }, conversation: string \| null, tab: string) => string \| void` | Called with what the person sends or the suggestion they pick, the chat it goes to (null from New chat) and the tab. From New chat, return the id of the chat it started and the tab turns into that chat. Nothing is sent while the chat on screen is running |
| `onFollowUp` (optional) | `(text: string, conversation: string) => void` | Called when the person picks one of a chat's follow-ups |
| `greeting` (optional) | `string` | The grey line over New chat's heading. Defaults to good morning, afternoon or evening |
| `heading` (optional) | `string` | Defaults to "What should the agent work on?" |
| `workspaces` (optional) | `AgentHarnessWorkspace[]` | The workspace switcher at the top of the side |
| `workspace` (optional) | `string` | The name of the workspace shown. Defaults to the first |
| `defaultWorkspace` (optional) | `string` |  |
| `onWorkspaceChange` (optional) | `(name: string) => void` |  |
| `panel` (optional) | `AgentHarnessPanel \| null` | Opens the panel beside the chat. On a wide harness the chats fold away while it is open |
| `onPanelClose` (optional) | `() => void` | Called by the panel's close button and by Escape |
| `model` (optional) | `string` | Shown beside the context ring, like the model's name |
| `draft` (optional) | `string` | The text in the composer. Leave it out to let the harness keep it; each tab keeps its own draft |
| `defaultDraft` (optional) | `string` |  |
| `onDraftChange` (optional) | `(draft: string) => void` |  |
| `placeholders` (optional) | `{ home?: string; reply?: string; working?: string }` | The composer's placeholder on New chat, in a chat, and while the agent works |
| `composer` (optional) | `Omit<ComposerProps, 'value' \| 'defaultValue' \| 'onValueChange' \| 'onSubmit' \| 'thread' \| 'tools' \| 'className' \| 'placeholder'>` | Anything else for the composer: projects, environments, attachments, effort, dictation |
| `className` (optional) | `string` |  |

## Questions

**How do I stream the agent's reply into a chat?**

Add a block with `kind: 'say'` and keep updating its `text` with the words so far; each new word fades in. The chat follows new content until the person scrolls up, and their own next message brings it back to the bottom.

**How do I show the agent's work without flooding the chat?**

Wrap tool calls and other steps in a block with `kind: 'group'`, a `label` and `state: 'running'`. When you set `state` to 'done' (and optionally `seconds`), it folds into one line the person can open again.

**Can the agent wait for approval before it continues?**

Yes. Add a 'permission-gate' or 'plan-review' block with that component's props, set the conversation's `state` to 'waiting', and give `status` a `review` key so the status pill shows a Review button that scrolls to it. Continue from the component's own callbacks.

**Does it work on a phone?**

Yes. At 620px wide or less, the chat list slides in as a drawer over the chat and the tabs scroll sideways.

## Source

`AgentHarness.tsx`, as `npx designme add agent-harness --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useCopied, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Fold, Spin, Swap, Think, Tip, enter } from '../lib/motion';
import { usePopover } from '../lib/popover';
import { ActionLog, type ActionLogProps } from '../action-log/ActionLog';
import { AgentLanes, type AgentLanesProps } from '../agent-lanes/AgentLanes';
import { ArtifactCard, type ArtifactCardProps } from '../artifact-card/ArtifactCard';
import { ChangeReview, type ChangeReviewProps } from '../change-review/ChangeReview';
import { Composer, type ComposerAttachment, type ComposerProps } from '../composer/Composer';
import { DecisionPrompt, type DecisionPromptProps } from '../decision-prompt/DecisionPrompt';
import { ErrorRecovery, type ErrorRecoveryProps } from '../error-recovery/ErrorRecovery';
import { LiveAnswer, type LiveAnswerProps } from '../live-answer/LiveAnswer';
import { PermissionGate, type PermissionGateProps } from '../permission-gate/PermissionGate';
import { PlanReview, type PlanReviewProps } from '../plan-review/PlanReview';
import { RunSummary, type RunSummaryProps } from '../run-summary/RunSummary';
import { SourceStack, type SourceStackProps } from '../source-stack/SourceStack';
import { StatusPill, type StatusPillProps } from '../status-pill/StatusPill';
import { Thinking, type ThinkingProps } from '../thinking/Thinking';
import { ToolCall, type ToolCallProps } from '../tool-call/ToolCall';
import '../designme.css';
import '../live-answer/live-answer.css';
import '../context-meter/context-meter.css';
import './agent-harness.css';

/** One message in a chat: what the person asked, what the agent said, its work, or one of the components it works through */
export type AgentHarnessBlock = { key: string } & (
  /** The person's message, as a bubble */
  | { kind: 'user'; text: string; files?: string[] }
  /** The agent's words. Pass the text so far and each new word fades in as it arrives */
  | { kind: 'say'; text: string }
  /** A passing line with the thinking mark, while the agent does something quick, like "Reading 8 sources" */
  | { kind: 'working'; text: string }
  /** The agent's work under one line: open while it runs, folded into its label a moment after it is done. The person can open it again */
  | { kind: 'group'; label: string; state: 'running' | 'done'; seconds?: number; blocks: AgentHarnessBlock[] }
  | { kind: 'thinking'; props: ThinkingProps }
  | { kind: 'tool-call'; props: ToolCallProps }
  | { kind: 'permission-gate'; props: PermissionGateProps }
  | { kind: 'plan-review'; props: PlanReviewProps }
  | { kind: 'action-log'; props: ActionLogProps }
  | { kind: 'run-summary'; props: RunSummaryProps }
  | { kind: 'live-answer'; props: LiveAnswerProps }
  | { kind: 'source-stack'; props: SourceStackProps }
  | { kind: 'artifact-card'; props: ArtifactCardProps }
  | { kind: 'error-recovery'; props: ErrorRecoveryProps }
  | { kind: 'decision-prompt'; props: DecisionPromptProps }
  | { kind: 'agent-lanes'; props: AgentLanesProps }
  | { kind: 'change-review'; props: ChangeReviewProps }
  /** Anything else, as it is */
  | { kind: 'node'; node: ReactNode }
);

/** running shows a spinner beside the chat and holds new messages back, waiting an amber dot (the agent needs the person), done nothing */
export type AgentHarnessState = 'idle' | 'running' | 'waiting' | 'done';

/** What the status pill beside the tabs says while the chat is on screen */
export interface AgentHarnessStatus extends Pick<StatusPillProps, 'state' | 'label' | 'meta' | 'action'> {
  /** The key of a block the agent is waiting on. Adds a Review button that scrolls to it */
  review?: string;
}

export interface AgentHarnessConversation {
  id: string;
  title: string;
  state?: AgentHarnessState;
  /** A quiet dot for a chat that changed since it was last open. Clear it when it is opened */
  unread?: boolean;
  status?: AgentHarnessStatus;
  /** How full its context is, 0 to 100, drawn as the ring in the composer */
  context?: number;
  blocks: AgentHarnessBlock[];
  /** Suggested next messages, shown under the last block. Picking one calls onFollowUp */
  followUps?: string[];
}

/** An open tab. Without a chat it is New chat */
export interface AgentHarnessTab {
  key: string;
  chat?: string;
}

/** A suggestion on New chat. Picking it sends its text */
export interface AgentHarnessSuggestion {
  icon: IconName;
  text: string;
}

export interface AgentHarnessWorkspace {
  name: string;
  /** The letter on its tile. Defaults to the name's first letter */
  mark?: string;
  /** The tile's colour. Defaults to ink */
  color?: string;
}

/** What the panel beside the chat shows, like an artifact opened from its card */
export interface AgentHarnessPanel {
  title: string;
  icon?: IconName;
  /** Adds a button that copies this link */
  link?: string;
  children: ReactNode;
}

export interface AgentHarnessProps {
  /** The chats down the side, newest first */
  conversations: AgentHarnessConversation[];
  /** The open tabs, in order. Leave it out to let the harness keep them; it starts with one New chat tab */
  tabs?: AgentHarnessTab[];
  defaultTabs?: AgentHarnessTab[];
  onTabsChange?: (tabs: AgentHarnessTab[]) => void;
  /** The key of the tab on screen */
  tab?: string;
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
  /** New chat's suggestions. Three show at a time, and Shuffle shows the next three */
  suggestions?: AgentHarnessSuggestion[];
  /**
   * Called with what the person sends or the suggestion they pick, the chat it goes to (null from New chat) and the tab.
   * From New chat, return the id of the chat it started and the tab turns into that chat. Nothing is sent while the chat
   * on screen is running
   */
  onSend?: (message: { text: string; attachments: ComposerAttachment[] }, conversation: string | null, tab: string) => string | void;
  /** Called when the person picks one of a chat's follow-ups */
  onFollowUp?: (text: string, conversation: string) => void;
  /** The grey line over New chat's heading. Defaults to good morning, afternoon or evening */
  greeting?: string;
  /** Defaults to "What should the agent work on?" */
  heading?: string;
  /** The workspace switcher at the top of the side */
  workspaces?: AgentHarnessWorkspace[];
  /** The name of the workspace shown. Defaults to the first */
  workspace?: string;
  defaultWorkspace?: string;
  onWorkspaceChange?: (name: string) => void;
  /** Opens the panel beside the chat. On a wide harness the chats fold away while it is open */
  panel?: AgentHarnessPanel | null;
  /** Called by the panel's close button and by Escape */
  onPanelClose?: () => void;
  /** Shown beside the context ring, like the model's name */
  model?: string;
  /** The text in the composer. Leave it out to let the harness keep it; each tab keeps its own draft */
  draft?: string;
  defaultDraft?: string;
  onDraftChange?: (draft: string) => void;
  /** The composer's placeholder on New chat, in a chat, and while the agent works */
  placeholders?: { home?: string; reply?: string; working?: string };
  /** Anything else for the composer: projects, environments, attachments, effort, dictation */
  composer?: Omit<ComposerProps, 'value' | 'defaultValue' | 'onValueChange' | 'onSubmit' | 'thread' | 'tools' | 'className' | 'placeholder'>;
  className?: string;
}

// an artifact and a diff keep their card in the chat; every other component sits on the chat itself
const BOXED = new Set(['artifact-card', 'change-review']);
const IDLE: AgentHarnessStatus = { state: 'idle', label: 'Ready for a task' };
const NARROW = 620;
let made = 0;
const newTab = (): AgentHarnessTab => ({ key: 'tab-' + ++made });

function Message({ b }: { b: AgentHarnessBlock }) {
  switch (b.kind) {
    case 'thinking': return <Thinking {...b.props} />;
    case 'tool-call': return <ToolCall {...b.props} />;
    case 'permission-gate': return <PermissionGate {...b.props} />;
    case 'plan-review': return <PlanReview {...b.props} />;
    case 'action-log': return <ActionLog {...b.props} />;
    case 'run-summary': return <RunSummary {...b.props} />;
    case 'live-answer': return <LiveAnswer {...b.props} />;
    case 'source-stack': return <SourceStack {...b.props} />;
    case 'artifact-card': return <ArtifactCard {...b.props} />;
    case 'error-recovery': return <ErrorRecovery {...b.props} />;
    case 'decision-prompt': return <DecisionPrompt {...b.props} />;
    case 'agent-lanes': return <AgentLanes {...b.props} />;
    case 'change-review': return <ChangeReview {...b.props} />;
    case 'node': return <>{b.node}</>;
    default: return null;
  }
}

/** The agent's work under one line: open while it runs, folded into its summary a moment after, unless the person opened it */
function Group({ b }: { b: Extract<AgentHarnessBlock, { kind: 'group' }> }) {
  const done = b.state === 'done';
  const [open, setOpen] = useState(!done);
  const mine = useRef(false);
  useEffect(() => {
    if (!done) { setOpen(true); return; }
    if (mine.current) return;
    const t = setTimeout(() => setOpen(false), 1200);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <div className="dm-ahx-wk dm-enter" data-block={b.key}>
      <button type="button" className="dm-ahx-wh" aria-expanded={open} onClick={() => { mine.current = true; setOpen(!open); }}>
        <span className="dm-g">{done ? <Icon key="ok" name="check" size="xs" className="dm-enter" /> : <Spin />}</span>
        <Swap className={cx('dm-t', !done && 'dm-shim')}>{b.label}</Swap>
        {done && b.seconds !== undefined && <span className="dm-m dm-num">{b.seconds}s</span>}
        <Icon name="chev-d" size="xs" />
      </button>
      <Fold open={open} className="dm-ahx-wb"><div className="dm-ahx-wl">{b.blocks.map(x => <Block key={x.key} b={x} />)}</div></Fold>
    </div>
  );
}

function Block({ b }: { b: AgentHarnessBlock }) {
  if (b.kind === 'user') return (
    <div className="dm-bub dm-enter" data-block={b.key}>
      {b.files?.length ? <div className="dm-ahx-fs">{b.files.map(f => <span key={f} className="dm-fchip"><Icon name="clip" size="xs" />{f}</span>)}</div> : null}
      {b.text}
    </div>
  );
  if (b.kind === 'say') return <p className="dm-msg dm-ahx-say" data-block={b.key}>{b.text.split(' ').map((w, i) => <span key={i} className="dm-w">{w} </span>)}</p>;
  if (b.kind === 'working') return (
    <div className="dm-lva-th dm-enter" data-block={b.key}><span style={{ color: 'var(--dm-fg2)', display: 'grid' }}><Think /></span><span className="dm-shim">{b.text}</span></div>
  );
  if (b.kind === 'group') return <Group b={b} />;
  return <div className={cx('dm-ahx-msg dm-enter', BOXED.has(b.kind) && 'dm-box')} data-block={b.key}><Message b={b} /></div>;
}

/** The quiet mark on a chat's row and tab: unread, running or waiting on the person */
const Mark = ({ c }: { c?: AgentHarnessConversation }) => (
  <span className="dm-ahx-mk">
    {!c ? null : c.unread ? <span key="u" className="dm-dot dm-enter" style={{ color: 'var(--dm-accent)' }} />
      : c.state === 'running' ? <span key="r" className="dm-spin dm-enter" />
        : c.state === 'waiting' ? <span key="w" className="dm-dot dm-enter" style={{ color: 'var(--dm-warn)' }} /> : null}
  </span>
);

const greet = () => { const h = new Date().getHours(); return h < 5 || h >= 18 ? 'Good evening' : h < 12 ? 'Good morning' : 'Good afternoon'; };

/**
 * An agent app made only of the other components: chats down the side, tabs across the top, and New chat with a greeting,
 * the Composer and a few suggestions. Nothing plays by itself: the person picks a suggestion or sends a message, and the chats
 * are lists of blocks you drive from your own state, each a bubble, the agent's words, its work folded under one line, or one
 * of the components with its own props. A chat opens in a tab, × closes it, + opens New chat. At phone width the chats slide
 * in from the side and the tabs scroll. The chat follows new messages until the person scrolls up.
 */
export function AgentHarness({
  conversations, tabs, defaultTabs, onTabsChange, tab, defaultTab, onTabChange, suggestions = [], onSend, onFollowUp,
  greeting, heading = 'What should the agent work on?', workspaces = [], workspace, defaultWorkspace, onWorkspaceChange,
  panel, onPanelClose, model, draft, defaultDraft = '', onDraftChange, placeholders, composer, className
}: AgentHarnessProps) {
  const [first] = useState(() => defaultTabs?.length ? defaultTabs : [newTab()]);
  const [open, setOpen] = useControllable(tabs, first, onTabsChange);
  const [active, setActive] = useControllable(tab, defaultTab ?? first[0].key, onTabChange);
  const [text, setText] = useControllable(draft, defaultDraft, onDraftChange);
  const [ws, setWs] = useControllable(workspace, defaultWorkspace ?? workspaces[0]?.name ?? '', onWorkspaceChange);
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null), feed = useRef<HTMLDivElement>(null), tabsEl = useRef<HTMLDivElement>(null);
  const cols = useRef(new Map<string, HTMLDivElement>());
  const wsMenu = usePopover();
  const [side, setSide] = useState(true), [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false), [query, setQuery] = useState('');
  const si = useRef<HTMLInputElement>(null);
  useEffect(() => { if (search) si.current?.focus({ preventScroll: true }); }, [search]);
  const [shift, setShift] = useState(0);
  const [hello, setHello] = useState(greeting ?? '');
  useEffect(() => { if (!greeting) setHello(greet()); }, [greeting]);

  const at = open.find(t => t.key === active) ?? open[0];
  const cur = at?.chat ? conversations.find(c => c.id === at.chat) ?? null : null;
  const home = !at?.chat;
  const status = cur?.status ?? IDLE, ctx = cur ? cur.context ?? 0 : 0, busy = cur?.state === 'running';
  const narrow = () => (root.current?.clientWidth ?? 1000) <= NARROW;

  /* the composer's settings live here, so they stay put when it moves between New chat and the foot of a chat */
  const cp = composer ?? {};
  const [att, setAtt] = useControllable(cp.attachments, cp.defaultAttachments ?? [], cp.onAttachmentsChange);
  const [proj, setProj] = useControllable(cp.project, cp.defaultProject ?? cp.projects?.[0]?.value ?? '', cp.onProjectChange);
  const [env, setEnv] = useControllable(cp.environment, cp.defaultEnvironment ?? cp.environments?.[0]?.value ?? '', cp.onEnvironmentChange);
  const [cloud, setCloud] = useControllable(cp.handoff, cp.defaultHandoff ?? false, cp.onHandoffChange);
  const [eff, setEff] = useControllable(cp.effort, cp.defaultEffort ?? 'medium', cp.onEffortChange);

  /* each tab keeps its own draft */
  const drafts = useRef(new Map<string, string>());
  const goTo = (key: string) => {
    if (key === active) return;
    drafts.current.set(active, text); setActive(key); setText(drafts.current.get(key) ?? '');
  };

  /* ---- tabs ---- */
  // a chat comes to the front if it is open, takes over an untouched New chat tab, or opens a tab beside the one on screen
  const openChat = (id: string) => {
    setDrawer(false);
    const has = open.find(t => t.chat === id); if (has) return goTo(has.key);
    if (at && !at.chat && !text.trim()) return setOpen(open.map(t => t.key === at.key ? { ...t, chat: id } : t));
    const t = { ...newTab(), chat: id }, i = open.findIndex(x => x.key === at?.key);
    setOpen([...open.slice(0, i + 1), t, ...open.slice(i + 1)]); goTo(t.key);
  };
  const fresh = () => {
    setDrawer(false);
    const h = open.find(t => !t.chat); if (h) return goTo(h.key);
    const t = newTab(), i = open.findIndex(x => x.key === at?.key);
    setOpen([...open.slice(0, i + 1), t, ...open.slice(i + 1)]); goTo(t.key);
  };
  const close = (key: string) => {
    const i = open.findIndex(t => t.key === key), rest = open.filter(t => t.key !== key);
    drafts.current.delete(key);
    if (!rest.length) { const t = newTab(); setOpen([t]); setActive(t.key); setText(''); return; }
    setOpen(rest);
    if (key === active) { const next = rest[Math.min(i, rest.length - 1)].key; setActive(next); setText(drafts.current.get(next) ?? ''); }
  };
  // the tab on screen is always in view, also when the status pill beside the tabs grows
  useEffect(() => {
    const box = tabsEl.current; if (!box) return;
    const keep = (now: boolean) => {
      const el = box.querySelector<HTMLElement>(`[data-tab="${CSS.escape(active)}"]`); if (!el) return;
      const l = el.offsetLeft, r = l + el.offsetWidth;
      if (l < box.scrollLeft || r > box.scrollLeft + box.clientWidth) box.scrollTo({ left: l < box.scrollLeft ? l - 4 : r - box.clientWidth + 4, behavior: reduce || now ? 'auto' : 'smooth' });
    };
    keep(false);
    const ro = new ResizeObserver(() => keep(true)); ro.observe(box);
    return () => ro.disconnect();
  }, [active, open.length, reduce]);

  /* ---- sending ---- */
  const send = (message: { text: string; attachments: ComposerAttachment[] }) => {
    if (busy || !at) return;
    setText(''); drafts.current.delete(at.key);
    const id = onSend?.(message, cur?.id ?? null, at.key);
    if (home && typeof id === 'string') setOpen(open.map(t => t.key === at.key ? { ...t, chat: id } : t));
  };
  // Enter does nothing while the agent works in the chat on screen
  const hold = (e: KeyboardEvent) => { if (busy && e.key === 'Enter' && !e.shiftKey && (e.target as HTMLElement).tagName === 'TEXTAREA') { e.preventDefault(); e.stopPropagation(); } };

  /* ---- following the chat: it keeps to the newest message until you scroll up, and picks up again at the bottom ---- */
  const stick = useRef(true), ours = useRef(0), seen = useRef<string | null>(null);
  useEffect(() => {
    const f = feed.current, col = cur ? cols.current.get(cur.id) : null; if (!f || !col) return;
    stick.current = true; f.scrollTop = f.scrollHeight - f.clientHeight; ours.current = f.scrollTop;
    // a chat comes in with the shared entrance when you switch to it
    if (seen.current !== null && seen.current !== cur!.id) { col.classList.remove('dm-enter'); void col.offsetWidth; col.classList.add('dm-enter'); }
    seen.current = cur!.id;
    let raf = 0;
    const step = () => {
      const d = f.scrollHeight - f.clientHeight - f.scrollTop;
      if (!stick.current || d < 1) { raf = 0; return; }
      f.scrollTop += reduce ? d : Math.max(1, Math.ceil(d * .16)); ours.current = f.scrollTop; raf = requestAnimationFrame(step);
    };
    const ro = new ResizeObserver(() => { if (!raf && stick.current) raf = requestAnimationFrame(step); });
    ro.observe(col);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, [cur?.id, reduce]); // eslint-disable-line react-hooks/exhaustive-deps
  // the person's own message brings the chat back to the bottom
  const lastUser = cur?.blocks.filter(b => b.kind === 'user').length ?? 0;
  useEffect(() => { stick.current = true; }, [lastUser]);
  const onScroll = () => { const f = feed.current; if (f && Math.abs(f.scrollTop - ours.current) > 2) stick.current = f.scrollHeight - f.clientHeight - f.scrollTop < 40; };
  const look = (key: string) => {
    const f = feed.current, el = cur && cols.current.get(cur.id)?.querySelector(`[data-block="${CSS.escape(key)}"]`); if (!f || !el) return;
    stick.current = false;
    f.scrollTo({ top: f.scrollTop + el.getBoundingClientRect().top - f.getBoundingClientRect().top - 12, behavior: reduce ? 'auto' : 'smooth' });
  };
  const pill: StatusPillProps = { state: status.state, label: status.label, meta: status.meta,
    action: status.action ?? (status.review ? { label: 'Review', onClick: () => look(status.review!) } : undefined) };

  /* ---- the composer glides from the middle of New chat to the foot of the chat it starts ---- */
  const was = useRef<{ tab: string; home: boolean; top: number; left: number } | null>(null);
  useIsoLayoutEffect(() => {
    const r = root.current, el = r?.querySelector<HTMLElement>('.dm-cpx'); if (!r || !el) return;
    const rr = r.getBoundingClientRect(), b = el.getBoundingClientRect(), top = b.top - rr.top, left = b.left - rr.left;
    const w = was.current;
    if (w && w.tab === active && w.home && !home && !reduce && Math.abs(w.top - top) > 2) {
      const bp = getComputedStyle(r).getPropertyValue('--dm-motion').trim() === 'bp';
      el.animate([{ transform: `translate(${w.left - left}px,${w.top - top}px)` }, { transform: 'none' }], { duration: bp ? 360 : 640, easing: bp ? 'cubic-bezier(.65,0,.25,1)' : 'cubic-bezier(.22,1,.36,1)' });
    }
    was.current = { tab: active, home, top, left };
  }, [active, home]);

  /* ---- the panel: it keeps what it showed while it folds shut, and the chats fold away while it is open on a wide harness ---- */
  const kept = useRef<AgentHarnessPanel | null>(null);
  if (panel) kept.current = panel;
  const shown = panel ?? kept.current;
  const folded = useRef(false);
  useEffect(() => {
    if (panel && !narrow() && side) { setSide(false); folded.current = true; }
    if (!panel && folded.current) { setSide(true); folded.current = false; }
  }, [!!panel]); // eslint-disable-line react-hooks/exhaustive-deps
  const [copied, copy] = useCopied();
  // Escape closes the chats on a phone, then the panel
  const escape = (e: KeyboardEvent) => { if (e.key !== 'Escape') return; if (drawer) setDrawer(false); else if (panel) onPanelClose?.(); };

  const q = query.trim().toLowerCase(), listed = conversations.filter(c => !q || c.title.toLowerCase().includes(q));
  const three = suggestions.length ? [0, 1, 2].slice(0, suggestions.length).map(i => suggestions[(shift + i) % suggestions.length]) : [];
  const wsNow = workspaces.find(w => w.name === ws) ?? workspaces[0];
  const tile = (w: AgentHarnessWorkspace) => ({ background: w.color ?? 'var(--dm-ink)', color: w.color ? '#fff' : 'var(--dm-on-ink)' });
  const ph = home ? placeholders?.home ?? 'Ask the agent to do something' : busy ? placeholders?.working ?? 'The agent is working…' : placeholders?.reply ?? 'Reply';
  const box = (
    <Composer {...cp} value={text} onValueChange={setText} onSubmit={send} placeholder={ph}
      attachments={att} onAttachmentsChange={setAtt} project={proj} onProjectChange={setProj} environment={env} onEnvironmentChange={setEnv}
      handoff={cloud} onHandoffChange={setCloud} effort={eff} onEffortChange={setEff}
      tools={
        <div className="dm-ctm-ft">
          {model && <span>{model}</span>}
          <Tip label={`Context ${ctx}% full`}>
            <button type="button" className="dm-ctm-ring" aria-label={`Context, ${ctx}% full`}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <circle className="dm-tr" cx="10" cy="10" r="7.5" />
                <circle className="dm-fl" cx="10" cy="10" r="7.5" pathLength={100} style={{ strokeDasharray: `${ctx} 100`, opacity: ctx ? undefined : 0 }} />
              </svg>
            </button>
          </Tip>
        </div>
      } />
  );

  return (
    <div data-dm="" ref={root} onKeyDownCapture={hold} onKeyDown={escape}
      className={cx('dm-ahx dm-panel', !side && 'dm-ns', drawer && 'dm-dr', panel && 'dm-pn', busy && 'dm-busy', className)}>
      <aside className="dm-ahx-side" aria-label="Chats">
        <div className="dm-ahx-ws">
          {wsNow && (
            <button type="button" className="dm-ahx-wsb" {...wsMenu.trigger}>
              <span className="dm-ahx-lg" style={tile(wsNow)}>{wsNow.mark ?? wsNow.name.charAt(0)}</span><Swap className="dm-t">{wsNow.name}</Swap><Icon name="chev-d" size="xs" />
            </button>
          )}
          <Tip label="Hide chats"><button type="button" className="dm-ib dm-ahx-hide" aria-label="Hide chats" onClick={() => narrow() ? setDrawer(false) : setSide(false)}><Icon name="panel" /></button></Tip>
        </div>
        <button type="button" className="dm-ahx-nav dm-ahx-new" onClick={fresh}><Icon name="edit" /><span>New chat</span></button>
        <div className="dm-ahx-lh">
          <span>Chats</span>
          <Tip label="Search chats"><button type="button" className="dm-ib dm-ahx-sb" aria-label="Search chats" onClick={() => { setSearch(!search); if (search) setQuery(''); }}><Icon name="search" /></button></Tip>
        </div>
        <Fold open={search} className="dm-ahx-sf">
          <input className="dm-ahx-si" type="search" placeholder="Search chats" aria-label="Search chats" value={query} onChange={e => setQuery(e.target.value)}
            ref={si}
            onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); setSearch(false); setQuery(''); } }} />
        </Fold>
        <div className="dm-ahx-list">
          {listed.map(c => (
            <button key={c.id} type="button" className="dm-ahx-cv dm-enter" aria-current={c.id === cur?.id} onClick={() => openChat(c.id)}>
              <span className="dm-t">{c.title}</span><Mark c={c} />
            </button>
          ))}
          {!listed.length && <p className="dm-ahx-none">No chats match</p>}
        </div>
      </aside>
      <div className={cx('dm-ahx-main', home && 'dm-home')}>
        <div className="dm-ahx-top">
          <Tip label="Show chats"><button type="button" className="dm-ib dm-ahx-menu" aria-label="Show chats" onClick={() => narrow() ? setDrawer(true) : setSide(true)}><Icon name="panel" /></button></Tip>
          <div ref={tabsEl} className="dm-ahx-tabs" role="tablist" aria-label="Open chats">
            {open.map(t => {
              const c = t.chat ? conversations.find(x => x.id === t.chat) : undefined;
              return (
                <div key={t.key} data-tab={t.key} className={cx('dm-ahx-tab dm-enter', t.key === at?.key && 'dm-on')}>
                  <button type="button" className="dm-ahx-tb" role="tab" aria-selected={t.key === at?.key} onClick={() => goTo(t.key)}>
                    <Mark c={c} /><Swap className="dm-t">{c?.title ?? 'New chat'}</Swap>
                  </button>
                  <Tip label="Close tab"><button type="button" className="dm-ahx-tx" aria-label="Close tab" onClick={() => close(t.key)}><Icon name="x" /></button></Tip>
                </div>
              );
            })}
          </div>
          <Tip label="New chat"><button type="button" className="dm-ib dm-ahx-plus" aria-label="New chat" onClick={fresh}><Icon name="plus" /></button></Tip>
          <StatusPill {...pill} className="dm-ahx-spl" />
        </div>
        <div className="dm-ahx-body">
          <div ref={feed} className="dm-ahx-feed" onScroll={onScroll} onWheel={e => { if (e.deltaY < 0) stick.current = false; }}>
            <div className="dm-ahx-cols">
              {/* every chat stays mounted, so its components keep their state; only the one on screen takes up room */}
              {conversations.map(c => (
                <div key={c.id} ref={el => { if (el) cols.current.set(c.id, el); else cols.current.delete(c.id); }}
                  className={cx('dm-ahx-col', c.id !== cur?.id && 'dm-off')} aria-hidden={c.id !== cur?.id} inert={c.id !== cur?.id}>
                  {c.blocks.map(b => <Block key={b.key} b={b} />)}
                  {c.followUps?.length ? (
                    <div className="dm-lva-fu">
                      {c.followUps.map((f, i) => <button type="button" key={f} {...enter(i * 90)} onClick={() => { if (c.state !== 'running') onFollowUp?.(f, c.id); }}><Icon name="chev-r" size="xs" />{f}</button>)}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <div className="dm-ahx-bot">{!home && box}</div>
          <div className="dm-ahx-home" inert={!home}>
            <div className="dm-ahx-hw">
              <div className="dm-ahx-hi"><span>{hello}</span><h4>{heading}</h4></div>
              <div className="dm-ahx-slot">{home && box}</div>
              {three.length > 0 && (
                <div className="dm-ahx-sg">
                  {three.map((s, i) => (
                    <button key={shift + ':' + i} type="button" className="dm-ahx-sr dm-enter" style={{ animationDelay: i * 50 + 'ms' }} onClick={() => send({ text: s.text, attachments: [] })}>
                      <Icon name={s.icon} /><span>{s.text}</span>
                    </button>
                  ))}
                </div>
              )}
              {suggestions.length > 3 && (
                <div className="dm-ahx-hf">
                  <button type="button" className="dm-pill dm-ghost dm-sm dm-ahx-shf" onClick={() => setShift((shift + 3) % suggestions.length)}><Icon name="refresh" size="xs" />Shuffle suggestions</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <aside className="dm-ahx-pane" aria-label={shown?.title ?? 'Panel'} aria-hidden={!panel} inert={!panel}>
        {shown && (
          <div className="dm-ahx-pi">
            <div className="dm-ahx-ph">
              <Icon name={shown.icon ?? 'file-text'} /><span className="dm-t">{shown.title}</span>
              {shown.link && <Tip label={copied ? 'Copied to clipboard' : 'Copy link'} open={copied || undefined}><button type="button" className={cx('dm-ib', copied && 'dm-copied')} aria-label="Copy link" onClick={() => copy(shown.link!)}><Icon name={copied ? 'check' : 'link'} /></button></Tip>}
              <Tip label="Close"><button type="button" className="dm-ib" aria-label="Close panel" onClick={onPanelClose}><Icon name="x" /></button></Tip>
            </div>
            <div className="dm-ahx-pb">{shown.children}</div>
          </div>
        )}
      </aside>
      <div className="dm-ahx-scrim" onClick={() => setDrawer(false)} />
      <div {...wsMenu.pop} className={cx(wsMenu.pop.className, 'dm-ahx-wsp')} role="menu">
        {workspaces.map(w => (
          <button key={w.name} type="button" className="dm-mi" role="menuitemradio" aria-checked={w.name === wsNow?.name} onClick={() => { setWs(w.name); wsMenu.closeSoon(); }}>
            <span className="dm-ahx-lg" style={tile(w)}>{w.mark ?? w.name.charAt(0)}</span><span>{w.name}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

All components: https://designme.dev/llms.txt
