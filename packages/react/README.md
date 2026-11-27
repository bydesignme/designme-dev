# Designme components for React

React versions of the [designme.dev](https://designme.dev) components, for Next.js, React (Vite) and Astro. You copy the source into your project, the way shadcn/ui works, so it is yours to change.

They use the same markup and the same CSS as the site, so they look and move exactly like the previews on designme.dev, in all three styles (Blueprint, Soft and Clean) and in light and dark. The difference is that each one takes props, so you drive it from your own state instead of a scripted demo.

All 45 components are here, from Live answer to Set limit, each with an example that replays its demo from the site.

Each one has a page on designme.dev with its demo, its React usage, its props and its code, at `https://designme.dev/components/<name>`. To see them all running locally, run `npm run dev` here.

## Add them to a project

Needs React 19. Works in client components, React Server Component pages (Next.js App Router) and Astro islands.

The quickest way is the CLI, which copies the components you name and only the shared files they need:

```sh
npx designme add status-pill thinking composer --react
```

Or by hand:

1. Copy `src/` into your project, for example as `components/designme/`.
2. That's all for the styles: each component imports the shared `designme.css` and its own small CSS file, in that order, and your bundler loads each file once.
3. Load Inter and JetBrains Mono (the components fall back to the system font if you don't).
4. Pick the look on `<html>`: Blueprint is the default, `data-style="soft"` switches to Soft and `data-style="clean"` to Clean (on `<html>`, or on any element around the components to make just those Soft or Clean; tooltips sit on the page and keep its style), and `data-theme="dark"` or `data-theme="light"` fixes the theme (otherwise it follows the device).

Every class, CSS variable and animation name starts with `dm-` (`.dm-panel`, `--dm-accent`, `dm-enter`), so the components sit next to Tailwind, shadcn/ui or your own CSS without either side changing the other. To retheme them, override the variables with `!important`, for example `:root { --dm-accent: #7c3aed !important }`. Each style and theme sets its tokens with a more specific selector, so a plain `:root` rule only reaches Soft in light mode.

The accent has three roles, so a light colour stays readable: `--dm-accent` is for fills (buttons, switches, selected states) with `--dm-on-accent` for text and icons on them, `--dm-accent-fg` is the accent as text and icons (aim for 4.5:1), and `--dm-accent-mark` is lines, borders and chart marks (3:1), both on the surface and on the grey chips and tinted rows they sit on. Fields and focus rings are grey, never the accent: a field has a dimmed edge, `--dm-field-line`, that steps up to `--dm-field-line-strong` while it has the focus, and the keyboard focus ring on every other control uses `--dm-focus`, which is `--dm-field-line-strong` unless you set it. Blueprint's default is lime: lime fills with dark icons, lime text and marks in dark mode, and in light mode ink text with a green (`#1daa51`) for marks. When you set your own accent, set all of its roles, plus `--dm-accent-2` (fills on hover) and `--dm-accent-bg` (tints), for example `:root { --dm-accent: #ffe600 !important; --dm-accent-2: #f2d900 !important; --dm-accent-bg: #fffbd6 !important; --dm-on-accent: #121212 !important; --dm-accent-fg: #111318 !important; --dm-accent-mark: #988900 !important }`.

```tsx
import { StatusPill } from '@/components/designme';

<StatusPill state="reading" label="Reading Figma frames" meta="2 of 4" />
```

### Next.js (App Router)

Every component file starts with `'use client'`, so you can render them straight from server components. With `next/font`, set the families on `<html>` or override `--dm-sans` and `--dm-mono` in your own CSS.

On the Pages Router, Next.js only allows global CSS in `pages/_app.tsx`: import `designme.css` and the `.css` files of the components you use there, and delete the two CSS import lines at the top of each of those components.

### React with Vite

Nothing extra to set up.

### Astro

Add the React integration (`npx astro add react`) and hydrate the components that change over time:

```astro
---
import { StatusPill, ContextMeter } from '../components/designme';
---
<StatusPill state="done" label="Done" meta="4 files changed" />   <!-- static, no JavaScript -->
<ContextMeter client:visible rows={rows} model="Opus 5.5" />      <!-- interactive -->
```

## Components

Grouped as on designme.dev. Every component also takes `className`, and anything a person can change has a controlled pair (`value` / `onValueChange`) and a `default…` prop for leaving it to the component.

### Agent status

**StatusPill** · `status-pill/StatusPill.tsx`  
One live line for what the agent is doing right now.  
`state: 'idle' | 'thinking' | 'reading' | 'working' | 'waiting' | 'done'` (picks the glyph and colour; running states shimmer), `label`, `meta` (quiet detail like "2 of 4", changes without restarting the pill), `file: { name, type? }`, `action: { label, onClick }`, `progress` (0 to 100, the track along the bar), `variant: 'pill' | 'bar'`. It fades between states and resizes to fit them.

**StepLoader** · `step-loader/StepLoader.tsx`  
Named steps with a progress track and four loaders.  
`steps: { label, done? }[]`, `current` (`steps.length` means finished), `loader: 'radar' | 'dots' | 'ring' | 'bars'`, `doneLabel`, `open` / `defaultOpen` / `onOpenChange`.

**ThinkingStates** · `thinking-states/ThinkingStates.tsx`  
Six thinking indicators to pick from, each with a status line.  
`variant: 'orbit' | 'morph' | 'scan' | 'stream' | 'matrix' | 'stack'` (the mark beside the line: dots circling a core, a shape that morphs, a line scanning skeleton text, tokens with the line typed behind a caret, a twinkling dot grid, shuffling pages), `steps: string[]` (status lines; with more than one they take turns every `interval` ms, 2600 by default, unless `current` is set), `current`, `seconds` (counts by itself when left out; `false` hides it). Each new line is announced once to screen readers.

**ReasoningTrail** · `reasoning-trail/ReasoningTrail.tsx`  
The agent's plan, notes, sources and edits, after it thinks.  
`running`, `seconds` (counts by itself when left out), `title`, `plan: { label, detail?, state: 'done' | 'now' | 'next' }[]`, `notes: string[]`, `sources: { label, kind?, tip?, reading? }[]`, `edits: { file, detail?, removed?, added? }[]` (pass notes, sources and edits as the agent makes them; while `running`, a view with none yet says so, and a source with `reading` shimmers), `view: 'plan' | 'notes' | 'sources' | 'edits'` / `defaultView` / `onViewChange`, `bare`, `open` / `defaultOpen` / `onOpenChange`.

**Thinking** · `thinking/Thinking.tsx`  
The live trace, written as the agent works, then folded away.  
`steps: { label, state: 'running' | 'retry' | 'done', result?, resultTip?, time? }[]` (`result` is what the step found, or what it waits on while it retries; it opens under the step and crossfades, and writes itself in a word at a time once the step is done; `time` shows at the right of a done step, and the line to the next step turns green), `running`, `seconds` (counts by itself when left out), `title` (the header while it runs), `summary` (the header once done: what the work came to), `collapseWhenDone`, `open` / `defaultOpen` / `onOpenChange`.

**ContextMeter** · `context-meter/ContextMeter.tsx`  
How full the context is and what fills it, with Compact to free room.  
`parts: { key, label, tokens, color?, items? }[]` (`items` is what's in it, shown on hover), `limit`, `warnAt` (share of the limit where the ring turns orange, 0.85 by default), `message` and `messageTone: 'warn' | 'ok'` (a line under the legend), `onCompact` (return a promise and the button spins), `compacted` and `onUndo`, `hint`, `open` / `defaultOpen` / `onOpenChange`. The numbers count to their new values; Escape shuts the panel.

**RunCost** · `run-cost/RunCost.tsx`  
Live credit and token spend, with a cap that pauses the run.  
`used`, `budget`, `capAt` (90), `capOn` / `defaultCapOn` / `onCapChange`, `status: 'idle' | 'running' | 'stopped' | 'paused' | 'spent'`, `statusLabel`, `rows: { label, value }[]`, `actionLabel`, `onAction`, `title`, `bare`.

**Toast** · `toast/Toast.tsx`  
A background job in one toast, from start to finish.  
`toast: { id, status?: 'working' | 'success' | 'error' | 'warning' | 'stopped' | 'info', title, description?, glyph?, steps?: { label, status, detail? }[], actions?: { label, onClick, variant?: 'primary' | 'secondary' | 'warn' }[], onStop?, duration?, announce? } | null`, `onDismiss(id, reason)`, `from` (the button it grows out of), `stepsOpen` / `defaultStepsOpen` / `onStepsOpenChange`. The same `id` changes the card in place; a new `id` brings in a new toast. Also exports `ToastCard` (one card on its own) and `DeckGlyph`.

**ToastStack** · `toast-stack/ToastStack.tsx`  
Agent notifications that stack and fan out on hover.  
`toasts: ToastData[]` (Toast's toasts, oldest first, the last one in front; the same `id` changes a card in place), `onDismiss(id, reason)` (`close`, `timeout`, `swipe` or `escape`), `expanded` (fans out under the pointer, the focus or a tap when left out), `max` (6). Each card is a `ToastCard`, so `npx designme add toast-stack --react` adds Toast too.

**AgentLanes** · `agent-lanes/AgentLanes.tsx`  
Several agents working in parallel, each with its own lane and hand-offs.  
`lanes: { key, name, icon, tone?, status: 'queued' | 'waiting' | 'working' | 'paused' | 'done', activity, steps?, done?, progress?, log?: { text, time? }[] }[]` (`tone` colours the lane's badge, track, tag and stretch of relay line; `progress`, 0 to 1, fills the step in hand), `title`, `seconds` (counts by itself when left out), `paused` / `defaultPaused` / `onPausedChange` (adds Pause all and Resume), `handoff: { from, to, what }` (a light runs down the relay line to the next badge and the stretch stays lit; clear it and its line slides away), `expanded` / `defaultExpanded` / `onExpandedChange`, `bare`.

**AgentTree** · `agent-tree/AgentTree.tsx`  
An orchestrator and its sub-agents, with cost rolled up per branch.  
`root: { id, name, task, status: 'queued' | 'running' | 'waiting' | 'done' | 'failed', color?, icon?, app?, cost?, tokens?, seconds?, rerouted?, fix?: { label, onClick }, approval?: { approveLabel?, holdLabel?, onApprove, onHold? }, children? }` (a node added after the first render draws its line in, then rises in; a branch's cost adds up everything under it, split on hover), `title`, `status` (defaults to "3 running", "Needs you", "1 failed", "Wrapping up" or "Done"), `seconds` (counts by itself until the root is done), `collapsed` / `defaultCollapsed` / `onCollapsedChange`, `selected` / `defaultSelected` / `onSelectedChange` (the node whose cost split and tokens show under the tree), `formatCost`, `variant: 'panel' | 'bare'`, `slim` (hides the header), `style`. The arrow keys move through it as a tree view.

**AgentInbox** · `agent-inbox/AgentInbox.tsx`  
Every run that needs you, is running or is done, in one list.  
`runs: { id, title, agent, color?, group: 'needs' | 'running' | 'done', detail?, failed?, why?, seconds?, ended? }[]` (running clocks count on from `seconds`), `onApprove(id)`, `onRetry(id)` (each adds its button), `title`. Each group shows its count, a group with no runs is hidden, and a run that changes group glides to its new place.

**WebSearch** · `web-search/WebSearch.tsx`  
The agent's searches as a trail, with the answer and its sources.  
`queries: { key, query, status: 'searching' | 'done', results?, time?, rewritten?, pages?: { title, domain, date?, status: 'reading' | 'read' | 'skimmed' | 'paywall' | 'blocked' | 'timeout', cite? }[] }[]`, `done` (folds the trail to its summary), `answer` (cite pages as [1], [2]), `open` / `onOpenChange`, `bare`.

**TraceView** · `trace-view/TraceView.tsx`  
One agent run as a waterfall of spans, with latency and tokens.  
`title` (the run's name, in the head with its total tokens and time), `spans: { id, name, kind: 'agent' | 'llm' | 'tool' | 'retrieval', start, duration?, tokens?, input?, output?, children? }[]` (the run's steps at the top level; an agent span without `tokens` adds up the spans under it; guides join each span to its parent, and a key counts the spans of each kind), `time` (seconds into the run while it streams, marked by a playhead; leave out `duration` on a span still running and its bar grows up to `time`), `axis` (seconds the axis covers), `slowAfter` (a tool call over it turns amber and is tagged slow; 2 by default), `status`, `selected` / `defaultSelected` / `onSelectedChange` (the span whose input, output, latency and tokens show under the waterfall). The arrow keys move between spans and Escape closes the details.

**AgentRunTimeline** · `agent-run-timeline/AgentRunTimeline.tsx`  
Every model and tool step of a run on one time axis.  
`title`, `steps: { label, icon?, start, duration, color?, cost?, failed?, note? }[]`, `time` (seconds into the run; leave it out once finished), `span`, `ticks`, `status`, `stats: { value, label }[]` (defaults to total, cost, steps and retries), `bare`.

### Conversation

**LiveAnswer** · `live-answer/LiveAnswer.tsx`  
Answers that stream in with numbered sources and next steps.  
`turns: { key?, question?, state: 'waiting' | 'thinking' | 'answering' | 'done', text?, thoughts?, thoughtFor?, sources?: { n, title, detail?, tip?, mark?, color? }[] }[]` (in `text`, `[n]` cites source n and a blank line starts a paragraph; feed it as it grows for the word-by-word reveal; leave `question` out when the bubble is shown elsewhere, like in a chat), `followUps`, `onFollowUp`, `onRetry` (adds Try again), `onRate`, `onCopy`, `onSourceClick`.

**Composer** · `composer/Composer.tsx`  
Message input with attachments, what to work on, a mode and dictation.  
`value` / `defaultValue` / `onValueChange`, `placeholder`, `onSubmit({ text, attachments })`, `busy` and `onStop` (send turns into stop), `thread`, `attachments` / `defaultAttachments` / `onAttachmentsChange` (`{ key, label, icon?, status?: 'loading' | 'error' | 'ready' }`; send waits for every one to load), `addOptions` and `onAdd`, `onRetry(key)` (Try again on a failed one), `contexts` / `context` / `onContextChange` (what the agent works on), `modes` / `mode` / `onModeChange` (defaults to Ask, Edit and Plan), `tools` (more in the toolbar, before the mode), `onDictate`, `dictating`, `dictationSeconds`, `onDictationEnd(keep)`. Enter sends, Shift+Enter adds a line, Escape cancels dictation.

**ModelPicker** · `model-picker/ModelPicker.tsx`  
Pick a model by speed, quality and cost, and how hard it thinks.  
`models: { id, name, mark?, color?, note?, speed, quality, cost, speedDetail?, qualityDetail?, costDetail?, status?: 'ready' | 'checking' | 'busy', statusText? }[]` (speed, quality and cost from 1 to 5, drawn as five-step meters; the details show on hover; busy turns the row amber), `value` / `defaultValue` / `onValueChange` (called for any row, busy or not, so you can check the model first), `efforts: { label, detail? }[]` (defaults to Off, Low, Medium and High), `effort` / `defaultEffort` / `onEffortChange` (a small dropdown under the list), `suggestion: { text, actions: { label, onClick }[] }` (a way out when the picked model can't start), `note` (a confirmation with a green check), `label`, `open` / `defaultOpen` / `onOpenChange`. Arrow keys move through the models; Escape closes the list and focuses the trigger.

**AttachmentTray** · `attachment-tray/AttachmentTray.tsx`  
Drop files for the agent and watch each one upload.  
`files: { id, name, size, progress, reading?, detail? }[]` (the ring and a wash in the file type's colour fill as it uploads, and at 100 the ring turns into a check; `reading` shimmers "Reading" while the agent reads it, then `detail` says what it found), `onFiles(files)` (dropped or picked), `onRemove(id)`, `title`, `action: { label, onClick }`, `accept`, `summary`, `dragging` (shows the drop zone as if a file were over it: the dashed edge marches in the accent and rings spread from the badge).

**AnswerActionBar** · `answer-action-bar/AnswerActionBar.tsx`  
Copy, regenerate, rate and listen to an answer from one row under it.  
`question`, `versions: { text, changed?, meta?, rating? }[]` (`changed` is a phrase in the text to highlight, `meta` the quiet text after the bar), `version` / `defaultVersion` / `onVersionChange` (the pager appears with a second version), `streaming` (new words fade in; paging and reading wait), `onRegenerate`, `onCopy(text)` (copy turns into a check), `onRate(index, rating)` (one rating per version), `reasons` and `onReason(index, reason)` (a thumbs down asks why), `status` and `statusTone: 'warn' | 'ok'`, `reading` / `defaultReading` / `onReadingChange` (`'idle' | 'playing' | 'paused'`: playing lights each word in turn on its own clock, `secondsPerWord`, default 0.28; it doesn't speak, so connect your own text to speech), `bare`. Left and Right move between the buttons.

**ResponseVersions** · `response-versions/ResponseVersions.tsx`  
Regenerate an answer and flip between versions.  
`prompt`, `versions: string[]`, `version` / `defaultVersion` / `onVersionChange`, `streaming` (new words fade in and paging waits), `status`, `onRegenerate`, `onCopy`, `bare`.

**FeedbackSheet** · `feedback-sheet/FeedbackSheet.tsx`  
Rate an answer and tell the agent what missed.  
`children` (the answer being rated), `rating` / `defaultRating` / `onRatingChange` (`'up' | 'down' | null`), `question`, `reasons`, `placeholder`, `note`, `onSubmit({ reasons, comment })` (return a promise to show a spinner until it settles), `thanks(feedback)`, `bare`, and for driving it from outside: `open` / `defaultOpen` / `onOpenChange`, `selected` / `defaultSelected` / `onSelectedChange`, `comment` / `defaultComment` / `onCommentChange`, `typing`, `sending`, `sent` / `onSentChange`.

### Review and approve

**DecisionPrompt** · `decision-prompt/DecisionPrompt.tsx`  
The agent asks a few quick questions before it starts.  
`questions: { question, label, options: { label, detail? }[] }[]`, `answers` / `defaultAnswers` / `onAnswersChange` (the picked index per question so far, or null if skipped), `onComplete(answers)`, `skippedLabel`, `startLabel`, `started` and `startedLabel` (the line under the summary settles with a check). Number keys pick, arrow keys move, Enter continues, `bare` (on by default: it sits in the chat with no card; `false` draws the card).

**PermissionGate** · `permission-gate/PermissionGate.tsx`  
The agent asks before it touches something new.  
`title`, `subtitle`, `icon`, `scopes: { key, label, detail?, risk?, riskDetail? }[]` (`riskDetail` is what the risk tag shows on hover), `value` / `defaultValue` / `onValueChange` (the ticked keys), `durations` (picked from a small dropdown in the footer), `durationDetails` (the line under each in its menu), `duration` / `defaultDuration` / `onDurationChange`, `status` / `defaultStatus` / `onStatusChange` (`'asking' | 'allowed' | 'declined'`), `onAllow(keys, duration)` (return a promise and the button spins until it settles), `onDecline`, `onRevoke`, `onUndo`, `allowedTitle` and `allowedDetail` (the two lines once allowed; both crossfade), `working` (a spinner on a neutral row while the agent works under the permission), `meta` (quiet text at the end of that row, like an elapsed time), `followUp` (a second ask mid-run for one more scope: the icon tile turns amber), `declineLabel` (defaults to Not now), `declinedTitle`, `declinedDetail`, `bare` (on by default: it sits in the chat with no card; `false` draws the card).

**InlineTextDiff** · `inline-text-diff/InlineTextDiff.tsx`  
The agent's edits to a piece of copy, accepted or rejected one by one.  
`title`, `parts: (string | { key, from, to, note? })[]` (the copy in order, with the edits between the plain runs; `note` marks an edit the agent isn't sure of and shows above its buttons), `decisions` / `defaultDecisions` / `onDecisionsChange` (`'accepted' | 'rejected'` per edit key), `doneLabel` (the line once every edit is decided), `labels`. Click an edit, or press Enter on it, to open its Accept and Reject toolbar; Escape closes it. Accept all and Reject all take every edit still waiting.

**PlanReview** · `plan-review/PlanReview.tsx`  
Check the agent's plan, edit steps, then let it run.  
`title`, `steps` / `defaultSteps` / `onStepsChange` (`{ id, text, skipped?, edited?, state?: 'run' | 'retry' | 'done', detail? }[]`; `detail` is the line a step reports under it, and `retry` shows it waiting out a problem; people can edit a step in place, skip one or add one), `phase: 'review' | 'running' | 'done'`, `status`, `note`, `meta` (quiet text at the end of the header, like an elapsed time), `onApprove`, `onRequestChanges`, `onStop`, `onSeeChanges`, `bare` (on by default: it sits in the chat with no card; `false` draws the card).

**ActionCards** · `action-cards/ActionCards.tsx`  
What is waiting on the person, as a row of cards: each with its title, a line of detail, its button and a small animated picture of what the button opens.  
`cards: ActionCard[]` (`id`, `title`, `detail`, `action` (the button's words), `onAction`, `picture`; three forecast cards when left out). Three across from 900px wide, stacked below.

### Sources and output

**SourceStack** · `source-stack/SourceStack.tsx`  
Everything the agent read, folded into one quiet pill.  
`children` (the answer above the pill), `sources: { kind, title, host, relevance, mark, color, onOpen? }[]` (relevance 0 to 1), `filters`, `filter` / `defaultFilter` / `onFilterChange`, `open` / `defaultOpen` / `onOpenChange`.

**TerminalStream** · `terminal-stream/TerminalStream.tsx`  
Shell commands the agent runs, with their output as it streams in.  
`cwd`, `entries` (oldest first: a command `{ command, output?, status: 'running' | 'ok' | 'failed' | 'stopped', exitCode?, duration? }`, a note `{ kind: 'note', text }` for what the agent says between commands, or an edit `{ kind: 'edit', file, added?, removed?, diff?, status?: 'running' | 'done' | 'stopped' }` (`diff` is the changed lines, each starting with - or +, shown under it on red and green tints); an output line is a string or `{ text, tone?: 'ok' | 'bad' | 'muted' }`), `status: 'running' | 'passed' | 'failed' | 'stopped'` (left out, it follows the entries), `elapsed` (beside Running in the header, and in the summary), `summary` (defaults to "3 commands · 0:18 · passed", counting each command once however many times it ran; `false` hides it), `tail` (output longer than `tail` + 1 lines folds to its last `tail`, 4 by default, behind "Show 24 more lines"), `onStop` (adds Stop while it runs), `onCopy(text)`, `labels`. Output wraps inside the panel, so long lines never scroll the page sideways.

**CitationHoverCard** · `citation-hover-card/CitationHoverCard.tsx`  
Hover a citation to see the exact passage it came from.  
`text` (`[n]` cites source n; a blank line starts a paragraph), `sources: { mark, color, site, title, quote, meta?, href? }[]` (wrap the key part of `quote` in `<mark>`), `openLabel`, `onOpenSource(source, index)`, `open` / `onOpenChange` (the index of the citation whose card shows, or null). Hovering, focusing or tapping a citation shows its card.

### Workspace

**CommandPalette** · `command-palette/CommandPalette.tsx`  
Jump anywhere or hand a task to the agent from one box.  
`items: { group, icon, label, keys?, hint?, tone? }[]` (`tone` colours the icon tile, `hint` is a quiet word after the label), `query` / `defaultQuery` / `onQueryChange`, `onRun(item)`, `onAsk(query)` (the "Ask the agent" row shows whenever something is typed), `onClose` (Escape on an empty box; otherwise Escape clears it), `placeholder`, `status`, `autoFocus`. Typing filters and marks the matched letters; ↑ and ↓ move, Enter runs, and the command's tile spins for a beat.

**FileExplorer** · `file-explorer/FileExplorer.tsx`  
Project files, with the ones the agent touched marked.  
`tree: { name, status?: 'M' | 'A' | 'D', children? }[]`, `open` / `defaultOpen` / `onOpenChange` (open folder paths), `selected` / `defaultSelected` / `onSelectedChange`, `query` / `defaultQuery` / `onQueryChange`, `onlyChanged` / `defaultOnlyChanged` / `onOnlyChangedChange`, `summary(n)`, `fileIcon(name)`, `placeholder`.

**RunDrawer** · `run-drawer/RunDrawer.tsx`  
A workflow's run under its canvas: the steps, the log and the data.  
`runId`, `label`, `state: 'running' | 'waiting' | 'passed' | 'failed' | 'stopped'`, `time`, `tokens`, `cost`, `steps: { id, title, kind, icon?, input?, output? }[]`, `spans: { id, step, name, kind, icon?, level?: 0 | 1, start, end?, state?: 'ok' | 'bad' | 'wait' | 'stop' }[]` (a kind of `retry` is the hatched wait before a retry), `log: { at, level: 'debug' | 'info' | 'warn' | 'error', title, message? }[]`, `waiting: { step, title, detail? }` with `onApprove` / `onReject`, `onStop`, `onRunAgain`, `tab` / `defaultTab` / `onTabChange`, `level` / `defaultLevel` / `onLevelChange` (the log's filter), `follow` / `defaultFollow` / `onFollowChange`, `expanded` / `defaultExpanded` / `onExpandedChange`, `height` / `defaultHeight` / `onHeightChange`, `selected` / `defaultSelected` / `onSelectedChange`, `canvas` (what sits over the drawer: the steps as a strip by default, `null` for the drawer alone).

**MemoryPanel** · `memory-panel/MemoryPanel.tsx`  
What the agent remembers about your team, editable and removable.  
`title`, `icon`, `kinds: { value, label, color }[]`, `memories` / `defaultMemories` / `onMemoriesChange` (`{ id, kind, text, source?, isNew? }[]`), `filter` / `defaultFilter` / `onFilterChange`, `allLabel`, `countLabel(n)`, `editedSource`, `onEdit`, `onForget`, `onRestore`, `undoFor`, `bare`. Edit in place; Forget leaves an Undo row for a few seconds.

**ToolConnections** · `tool-connections/ToolConnections.tsx`  
The tools the agent can reach, and how much it may do with each.  
`tools` / `defaultTools` / `onToolsChange` (`{ key, name, detail?, brand? or icon? and color?, permission?: 'off' | 'ask' | 'allow', status?: 'ok' | 'testing' | 'error' | 'reconnecting', note? }[]`), `available` and `onConnect(tool)` (the Connect a tool menu), `onTest` (adds Test all), `testing` (Test all shows a spinner while a test runs), `onReconnect(key)`, `title`, `status`.

**KnowledgeSources** · `knowledge-sources/KnowledgeSources.tsx`  
The files, sites and folders the agent knows, and how far each is indexed.  
`sources: { key, name, kind: 'files' | 'web' | 'folder', count, unit?: 'pages' | 'files', state: 'queued' | 'indexing' | 'ready' | 'failed', done?, synced?, error?, fix?, note?, chunks? }[]`, `onUpload(files)`, `onAddWebsite(address)`, `address` / `defaultAddress` / `onAddressChange`, `folders: { key, name, detail? }[]` and `onConnectFolder(key)` (the Add source menu shows each option you handle), `onResync(key)`, `onRemove(key)`, `onFix(key)` (the button a failed source shows, labelled with its `fix`), `title`, `status`. Indexing shows a bar and "64 of 142 pages"; the line under the title adds up the sources' `chunks`.

**ScheduledRuns** · `scheduled-runs/ScheduledRuns.tsx`  
Tasks the agent runs on a schedule, with their last result and a switch.  
`runs` / `defaultRuns` / `onRunsChange` (`{ key, name, schedule, next?, enabled?, result?: 'passed' | 'failed' | 'running' | 'never', ago?, error?, fix?, fixing?, brand? or icon? and color? }[]`), `onRunNow(key)` (adds Run now), `onFix(key)` (the button a failed run shows, labelled with its `fix`), `onCreate({ task, repeat, days, schedule, next })` (adds New schedule: Every day, Every Monday or Custom days), `time`, `hour`, `title`, `status`. The switch pauses a run: its row dims and says Paused.

**ToolRail** · `tool-rail/ToolRail.tsx`  
A board's tools in one vertical rail: pick one, and its name and key show on hover.  
`value` / `defaultValue` / `onChange` (`'select' | 'hand' | 'sticky' | 'pen' | 'eraser' | 'shape' | 'arrow' | 'text' | 'comment'`). The arrow keys and each tool's letter pick a tool while the rail has focus.

**ZoomBar** · `zoom-bar/ZoomBar.tsx`  
Undo, redo, zoom and fit in one floating bar for a canvas.  
`zoom` / `defaultZoom` (1) / `onZoomChange`, `steps` (the levels − and + step through, 25% to 400%), `onUndo`, `onRedo`, `onFit`, `canUndo`, `canRedo`. Pressing the level sets it back to 100%.

### Charts and tables

**StatCards** · `stat-cards/StatCards.tsx`  
Four headline numbers with sparklines and a period switch.  
`stats: { key?, icon, label, values: { value, change, points }[], prefix?, suffix?, color? }[]` (one value per period), `periods: { label, compare? }[]`, `period` / `defaultPeriod` / `onPeriodChange`, `sparkRange`.

### Dates

**DatePicker** · `date-picker/DatePicker.tsx`  
A field that opens a calendar, with quick picks and natural language.  
`value` / `defaultValue` / `onValueChange` (`Date | null`), `month` / `defaultMonth` / `onMonthChange`, `open` / `defaultOpen` / `onOpenChange`, `query` / `defaultQuery` / `onQueryChange` (typed text like "next friday" or "in 2 weeks" picks a day), `parse`, `today` (pass it when rendering on a server), `placeholder`, `queryPlaceholder`, `presets: { label, days }[]`, `format`, `locale`, `weekStartsOn: 0 | 1`. Arrow keys, Home, End and Page Up / Page Down move around the calendar.

**EventCalendar** · `event-calendar/EventCalendar.tsx`  
A week view where the agent finds a free slot for you.  
`events` / `defaultEvents` / `onEventsChange` (`{ id, title, start: Date, end: Date, tone?, people? }[]`), `week` (the first day shown), `days`, `startHour`, `hours`, `title`, `now`, `selected` / `defaultSelected` / `onSelectedChange` (the event whose card is open), `onPrepNotes(event)`, `onJoin`, `newEvent`, `askLabel` and `onAsk`, `finding`, `suggestions: { id, title, start, end }[]`, `onBook`, `onSkip`, `status`. Drag events in 15-minute steps, click free time to add one, click an event for its details.

### Forms and inputs

**Form** · `form/Form.tsx`  
A project brief with inline checks and an agent that drafts the rest.  
`fields: { key, label, type?: 'text' | 'textarea' | 'choice', placeholder?, maxLength?, rows?, options?, autoComplete?, validate?(value, values) }[]`, `values` / `defaultValues` / `onValuesChange`, `onDraft` (adds "Draft with agent"; drafted fields are marked Drafted beside their label until edited), `onSubmit(values)` (spins while pending; a rejection's message shows beside the button), `title`, `submitLabel`, `invalidMessage`, `draftedMessage`, `doneTitle(values)`, `doneDetail`. A `ref` gives `draft()`, which runs the agent's draft as if the button were pressed.

### Collaboration

**ContextMenu** · `context-menu/ContextMenu.tsx`  
A menu on right-click, long-press, Shift+F10 or the Menu key, with a submenu.  
`items: { key, label, icon?, shortcut?, checked?, danger?, confirmLabel?, items?, separator? }[]`, `onSelect(key, item)`, `label`, `targetLabel`, `targetClassName`, `children` (what you right-click).

### Product

**SetLimit** · `set-limit/SetLimit.tsx`  
A monthly agent budget with a draggable cap and a forecast.  
`value` / `defaultValue` / `onValueChange` (the cap), `min`, `max`, `step`, `spent` and `forecast` (the solid and striped bars), `mode` / `defaultMode` / `onModeChange` (`'pause' | 'ask' | 'keep'`, what happens at the limit), `title`, `subtitle`, `passesOn`, `format`, `message({ over, cap, left, mode })`, `editable` (on by default: click the figure and type a budget; Enter keeps it, Escape goes back). Drag on the bar or use the arrow keys on the knob.

## Examples

`src/examples/<name>.tsx` rebuilds each animated preview from designme.dev with the component, driven from React state. They are the quickest way to see how a component is meant to be fed. You don't need to copy them.

## Shared pieces

The components are built from a few small pieces in `src/lib`, exported from `src/index.ts` for your own use:

- `Icon` (113 line icons), `Brand` (Google, GitHub, Figma, Slack, Notion, Linear, Gmail, Google Drive) and `Flag` (12 countries)
- `Tip` (tooltips, with `kbd` for a shortcut and `open` for feedback like "Copied"), `Seg` (segmented switch), `Swap` (text that crossfades), `Fold` (a panel that folds by its height), `Avatar`, `SourceChip` and the status glyphs `Think`, `Spin`, `Radar`, `Pulse`, `Bars` and `Dot`
- `usePopover` (a menu placed under its button, closed by a click outside, Escape or a resize), `useCopied`, `useControllable`, `useTween`, `useSeconds` and `useReducedMotion`
- `lib/calendar.ts` (date maths for the pickers) and `lib/chart.ts` (number formatting and staggering for the charts)

## Keeping in step with the site

The CSS and the icons are generated from the site's component registry, so a design change on designme.dev reaches these components with one command:

```sh
npm install      # only needed for the playground and the type check
npm run sync     # copies the latest styles, icons, logos and flags from ../../r and rewrites src/index.ts
npm run check    # type check
npm run dev      # the playground: every component with its example, at localhost
npm run registry # rewrites ../../r/react, what npx designme add --react installs
```
