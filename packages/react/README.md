# Designme components for React

React versions of the [designme.dev](https://designme.dev) components, for Next.js, React (Vite) and Astro. You copy the source into your project, the way shadcn/ui works, so it is yours to change.

They use the same markup and the same CSS as the site, so they look and move exactly like the previews on designme.dev, in both styles (Blueprint and Soft) and in light and dark. The difference is that each one takes props, so you drive it from your own state instead of a scripted demo.

All 98 components are here, from Status pill to Currency converter, each with an example that replays its demo from the site.

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
4. Pick the look on `<html>`: Blueprint is the default, `data-style="soft"` switches to Soft, and `data-theme="dark"` or `data-theme="light"` fixes the theme (otherwise it follows the device).

Every class, CSS variable and animation name starts with `dm-` (`.dm-panel`, `--dm-accent`, `dm-enter`), so the components sit next to Tailwind, shadcn/ui or your own CSS without either side changing the other. To retheme them, override the variables, for example `:root { --dm-accent: #7c3aed }`.

The accent has three roles, so a light colour stays readable: `--dm-accent` is for fills (buttons, switches, selected states) with `--dm-on-accent` for text and icons on them, `--dm-accent-fg` is the accent as text and icons (aim for 4.5:1 on the surface), and `--dm-accent-mark` is lines, borders, focus rings and chart marks (3:1). Blueprint's default is lime: lime fills with dark icons, lime text and marks in dark mode, and in light mode ink text with a darker lime (`#869c2f`) for marks. When you set your own accent, set all four, for example `:root { --dm-accent: #ffe600; --dm-on-accent: #121212; --dm-accent-fg: #111318; --dm-accent-mark: #a39300 }`.

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

**ReasoningTrail** · `reasoning-trail/ReasoningTrail.tsx`  
The agent's plan, notes, sources and edits, after it thinks.  
`running`, `seconds` (counts by itself when left out), `title`, `plan: { label, detail?, state: 'done' | 'now' | 'next' }[]`, `notes: string[]`, `sources: { label, kind?, tip? }[]`, `edits: { file, detail?, removed?, added? }[]`, `view: 'plan' | 'notes' | 'sources' | 'edits'` / `defaultView` / `onViewChange`, `bare`, `open` / `defaultOpen` / `onOpenChange`.

**Thinking** · `thinking/Thinking.tsx`  
The live trace, written as the agent works, then folded away.  
`steps: { label, state: 'running' | 'retry' | 'done', result?, resultTip? }[]` (`result` is what the step found, or what it waits on while it retries; it opens under the step and crossfades), `running`, `seconds` (counts by itself when left out), `title` (the header while it runs), `summary` (the header once done: what the work came to), `collapseWhenDone`, `open` / `defaultOpen` / `onOpenChange`.

**ContextMeter** · `context-meter/ContextMeter.tsx`  
How full the context is and what fills it, with Compact to free room.  
`parts: { key, label, tokens, color?, items? }[]` (`items` is what's in it, shown on hover), `limit`, `warnAt` (share of the limit where the ring turns amber, 0.85 by default), `message` and `messageTone: 'warn' | 'ok'` (a line under the legend), `onCompact` (return a promise and the button spins), `compacted` and `onUndo`, `hint`, `open` / `defaultOpen` / `onOpenChange`. The numbers count to their new values; Escape shuts the panel.

**ActionLog** · `action-log/ActionLog.tsx`  
Every read, search, edit and command, logged as it runs.  
`actions: { icon, title, detail?, state: 'running' | 'done', time?, output? }[]` (title, detail and output take JSX; output lines in `dm-a` / `dm-x` spans read as added and removed), `title`, `running`, `status` (defaults to "Running step N", then "N steps, Xs"), `bare`. Each row opens to show its output.

**RunQueue** · `run-queue/RunQueue.tsx`  
Grouped tasks with live progress, retries and a compact view.  
`groups: { title, state, steps: { label, state, meta? }[], meta? }[]` with state `'queued' | 'running' | 'failed' | 'done'`, `density: 'detailed' | 'compact'` / `defaultDensity` / `onDensityChange`, `onRetry(group, step)`, `bare`.

**RunCost** · `run-cost/RunCost.tsx`  
Live credit and token spend, with a cap that pauses the run.  
`used`, `budget`, `capAt` (90), `capOn` / `defaultCapOn` / `onCapChange`, `status: 'idle' | 'running' | 'stopped' | 'paused' | 'spent'`, `statusLabel`, `rows: { label, value }[]`, `actionLabel`, `onAction`, `title`, `bare`.

**Toast** · `toast/Toast.tsx`  
One notification that changes shape with its state.  
`toast: { id, tone?: 'success' | 'error' | 'info' | 'loading', title, description?, action?: { label, onClick, variant?: 'ghost' | 'ink', busy? } } | null`, `onDismiss(id)`. A new `id` slides the new toast in and the old one out; the same `id` changes the text in place.

**ToastStack** · `toast-stack/ToastStack.tsx`  
Agent notifications that stack and fan out on hover.  
`toasts: { id, icon, tone?, title, detail?, time? }[]` (oldest first, the last one in front), `onDismiss(id)` (drop it from `toasts` and it slides away), `expanded` (fans out on hover when left out), `max` (6).

**RunSummary** · `run-summary/RunSummary.tsx`  
What the agent did, what changed and what needs you.  
`title`, `undoneTitle`, `subtitle`, `summary`, `stats: { label, value, prefix?, suffix?, decimals? }[]` (they count up), `changes: { file, added, removed }[]`, `needs: { key, text, action?: { label, onClick, busy? } }[]`, `onDetails`, `onOpenChanges`, `undone` / `defaultUndone` / `onUndoneChange`, `bare`.

**ErrorRecovery** · `error-recovery/ErrorRecovery.tsx`  
A failed step with retry, skip or hand over to a person.  
`title`, `status`, `steps: { label, state: 'done' | 'fail' | 'run' | 'wait' | 'skip' | 'hand', note? }[]`, `question`, `options: { value, label }[]`, `value` / `defaultValue` / `onValueChange`, `onContinue(value)`, `continueLabel`, `open` / `defaultOpen` / `onOpenChange` (the choices fold away on Continue), `bare`.

**AgentLanes** · `agent-lanes/AgentLanes.tsx`  
Several agents working in parallel, each with its own lane and hand-offs.  
`lanes: { key, name, icon, tone?, status: 'queued' | 'waiting' | 'working' | 'paused' | 'done', activity, steps?, done?, log?: { text, time? }[] }[]`, `title`, `seconds` (counts by itself when left out), `paused` / `defaultPaused` / `onPausedChange` (adds Pause all and Resume), `handoff: { from, to, what }` (clear it and the banner slides away), `expanded` / `defaultExpanded` / `onExpandedChange`, `bare`.

**AgentTree** · `agent-tree/AgentTree.tsx`  
An orchestrator and its sub-agents as a tree, with cost rolled up per branch.  
`root: { id, name, task, status: 'queued' | 'running' | 'done' | 'failed', cost?, fix?: { label, onClick }, children? }` (a branch shows its own cost plus everything under it, split on hover), `title`, `status` (defaults to Running, "1 step failed" or Done), `seconds` (counts by itself until the root is done), `summary` (defaults to "Done in 0:14 · 3 agents · $0.66"; `false` hides it), `collapsed` / `defaultCollapsed` / `onCollapsedChange`, `formatCost`. The arrow keys move through it as a tree view.

**AgentInbox** · `agent-inbox/AgentInbox.tsx`  
Every run that needs you, is running or is done, in one list.  
`runs: { id, title, agent, color?, group: 'needs' | 'running' | 'done', detail?, failed?, why?, seconds?, ended? }[]` (running clocks count on from `seconds`), `onApprove(id)`, `onRetry(id)` (each adds its button), `title`, `status` (defaults to "2 need you", "2 running" once nothing needs you, or "All clear · 4 done today"). A group with no runs is hidden, and a run that changes group glides to its new place.

**AgentRunTimeline** · `agent-run-timeline/AgentRunTimeline.tsx`  
Every model and tool step of a run on one time axis.  
`title`, `steps: { label, icon?, start, duration, color?, cost?, failed?, note? }[]`, `time` (seconds into the run; leave it out once finished), `span`, `ticks`, `status`, `stats: { value, label }[]` (defaults to total, cost, steps and retries), `bare`.

### Conversation

**LiveAnswer** · `live-answer/LiveAnswer.tsx`  
Answers that stream in with numbered sources and next steps.  
`turns: { key?, question?, state: 'waiting' | 'thinking' | 'answering' | 'done', text?, thoughts?, thoughtFor?, sources?: { n, title, detail?, tip?, mark?, color? }[] }[]` (in `text`, `[n]` cites source n and a blank line starts a paragraph; feed it as it grows for the word-by-word reveal; leave `question` out when the bubble is shown elsewhere, like in a chat), `followUps`, `onFollowUp`, `onRetry` (adds Try again), `onRate`, `onCopy`, `onSourceClick`.

**ThreadPanel** · `thread-panel/ThreadPanel.tsx`  
Switch between agent threads and reply in place.  
`threads: { id, title, color?, messages: { id?, from: 'user' | 'agent', text, sources?, thinking? }[] }[]`, `value` / `defaultValue` / `onValueChange` (the open thread), `onSend(text, threadId)`, `draft` / `defaultDraft` / `onDraftChange` (the reply being typed), `placeholder`, `bare`. `thinking: true` on a message shows a shimmering "Thinking".

**Composer** · `composer/Composer.tsx`  
Message input with attachments, what to work on, a mode and dictation.  
`value` / `defaultValue` / `onValueChange`, `placeholder`, `onSubmit({ text, attachments })`, `busy` and `onStop` (send turns into stop), `thread`, `attachments` / `defaultAttachments` / `onAttachmentsChange` (`{ key, label, icon?, status?: 'loading' | 'error' | 'ready' }`; send waits for every one to load), `addOptions` and `onAdd`, `onRetry(key)` (Try again on a failed one), `contexts` / `context` / `onContextChange` (what the agent works on), `modes` / `mode` / `onModeChange` (defaults to Ask, Edit and Plan), `tools` (more in the toolbar, before the mode), `onDictate`, `dictating`, `dictationSeconds`, `onDictationEnd(keep)`. Enter sends, Shift+Enter adds a line, Escape cancels dictation.

**VoiceCapture** · `voice-capture/VoiceCapture.tsx`  
Talk to the agent, then fix what it misheard before sending.  
`words: (string | { text, alternatives? })[]` (words with alternatives get a highlight and a "Did you mean" menu), `state` / `defaultState` / `onStateChange` (`'listening' | 'paused' | 'review' | 'sent' | 'cancelled'`), `seconds`, `level` (0 to 1, or a function read about 20 times a second, for example from an AnalyserNode), `status`, `onSend(text)`, `onFix(index, text)`, `onRecordAgain`. It never opens the microphone itself.

**VoiceOrb** · `voice-orb/VoiceOrb.tsx`  
A hands-free voice chat, with an orb that shows who is talking.  
`state: 'idle' | 'listening' | 'thinking' | 'speaking' | 'ended'` (the accent colour while it listens, violet while the agent speaks), `level` (0 to 1; the orb swells, its light flows faster and its glow brightens with it, so feed it from your audio or a made-up curve. The light inside is a small WebGL shader; without WebGL the orb keeps a plain gradient), `muted` / `onMutedChange` (listening shows as Muted and the mute button is pressed), `mutedNotice` (shows "You're muted" with Unmute, for someone talking while muted), `caption: { speaker, text, id? }` (each word fades in; a new `id` or speaker starts a new line), `hint`, `elapsed` (seconds), `onStart`, `onEnd`, `onRestart` (from the row once it has ended), `endedDetail`, `labels`. It never opens the microphone or plays sound itself.

**ToolCall** · `tool-call/ToolCall.tsx`  
Each tool the agent calls, with its input and output.  
`message`, `calls: { key, server?, name, icon?, state: 'queued' | 'running' | 'done', duration?, input?, output? }[]` (input and output are JSON values, shown highlighted), `reply` (fades in once every call is done), `open` / `defaultOpen` / `onOpenChange` (the keys of the open calls).

**ArtifactCard** · `artifact-card/ArtifactCard.tsx`  
A file the agent made, with a live preview and versions.  
`title`, `versions: { label, text, values, value?, change?, meta?, note? }[]`, `axis`, `range`, `icon`, `link` (adds Copy link), `href` (adds Open in a new tab), `onOpen` and `openLabel` (an open button that calls you instead, like opening the file beside a chat), `version` / `defaultVersion` / `onVersionChange`. The chart draws itself in and redraws when the version changes.

**ModelPicker** · `model-picker/ModelPicker.tsx`  
Pick a model by speed, quality and cost, and how hard it thinks.  
`models: { id, name, mark?, color?, note?, speed, quality, cost, speedDetail?, qualityDetail?, costDetail?, status?: 'ready' | 'checking' | 'busy', statusText? }[]` (speed, quality and cost from 1 to 5, drawn as five-step meters; the details show on hover; busy turns the row amber), `value` / `defaultValue` / `onValueChange` (called for any row, busy or not, so you can check the model first), `efforts: { label, detail? }[]` (defaults to Off, Low, Medium and High), `effort` / `defaultEffort` / `onEffortChange` (a small dropdown under the list), `suggestion: { text, actions: { label, onClick }[] }` (a way out when the picked model can't start), `note` (a confirmation with a green check), `label`, `open` / `defaultOpen` / `onOpenChange`. Arrow keys move through the models; Escape closes the list and focuses the trigger.

**PromptStarters** · `prompt-starters/PromptStarters.tsx`  
Suggested tasks that fill the composer in one click.  
`starters: { icon, tone?, title, description, prompt }[]`, `value` / `defaultValue` / `onValueChange` (the picked title), `onSend(prompt)`, `onShuffle` (shows Shuffle; pass a new set and it staggers in), `placeholder`, `sentLabel`.

**PromptLibrary** · `prompt-library/PromptLibrary.tsx`  
Saved prompts with blanks to fill in before they go to the agent.  
`prompts: { id, title, template, blanks }[]` (`template` writes each blank as `{key}`; `blanks` maps each key to `{ label, placeholder?, options?, error? }`: with `options` it is a dropdown that starts on the first, without it a text field), `title`, `subtitle`, `open` / `defaultOpen` / `onOpenChange` (the open prompt's id, or null for the list), `values` / `defaultValues` / `onValuesChange` (the open prompt's blanks by key), `onUse(text, prompt, values)` (only once every blank has a value; an empty one says what it needs), `onUndo`, `labels`.

**AttachmentTray** · `attachment-tray/AttachmentTray.tsx`  
Drop files for the agent and watch each one upload.  
`files: { id, name, size, progress }[]` (at 100 the ring turns into a check), `onFiles(files)` (dropped or picked), `onRemove(id)`, `title`, `action: { label, onClick }`, `accept`, `summary`, `dragging` (shows the drop zone as if a file were over it; the dashed edge stops and turns accent).

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

**ProposalCard** · `proposal-card/ProposalCard.tsx`  
A suggested change with confidence, alternatives and undo.  
`title`, `subtitle`, `icon`, `from: { color, label, badge?, tone? }`, `options: { color, label, badge?, tone?, name, description?, confidence }[]` (the agent's pick first), `value` / `defaultValue` / `onValueChange`, `open` / `defaultOpen` / `onOpenChange` (the other options), `status` / `defaultStatus` / `onStatusChange` (`'open' | 'accepted' | 'dismissed'`), `onAccept(option, index)`, `onDismiss`, `onUndo`, `acceptedLabel`, `dismissedLabel`, `confidenceLabel`, `bare` (on by default: it sits in the chat with no card; `false` draws the card).

**RewriteToolbar** · `rewrite-toolbar/RewriteToolbar.tsx`  
Select a sentence and let the agent rewrite it in place.  
`title`, `kind`, `sentences` / `defaultSentences` / `onSentencesChange`, `selected` / `defaultSelected` / `onSelectedChange`, `actions: { key, label, icon? }[]` (Clearer, Shorter and Friendlier by default), `onRewrite(sentence, action, index)` (returns the new sentence, or a promise of it; it is written in word by word, then Undo or Accept), `onAsk`, `askLabel`, `askShortcut`. A `ref` gives `rewrite(action)` (on the selected sentence), `accept()` and `undo()`, for driving it from outside.

**DesignTuner** · `design-tuner/DesignTuner.tsx`  
Tweak a component by hand or let the agent tune it.  
`params: { key, label, min, max, value, unit?, decimals? }[]`, `values` / `defaultValues` / `onValuesChange`, `title`, `status`, `active` (the slider the agent is moving), `tuning`, `note`, `actionLabel`, `onTune`, `preview(values, vars)` (your own preview; `vars` holds a `--dm-<key>` variable per value). Sliders drag or move with the arrow keys.

**PermissionGate** · `permission-gate/PermissionGate.tsx`  
The agent asks before it touches something new.  
`title`, `subtitle`, `icon`, `scopes: { key, label, detail?, risk?, riskDetail? }[]` (`riskDetail` is what the risk tag shows on hover), `value` / `defaultValue` / `onValueChange` (the ticked keys), `durations` (picked from a small dropdown in the footer), `durationDetails` (the line under each in its menu), `duration` / `defaultDuration` / `onDurationChange`, `status` / `defaultStatus` / `onStatusChange` (`'asking' | 'allowed' | 'declined'`), `onAllow(keys, duration)` (return a promise and the button spins until it settles), `onDecline`, `onRevoke`, `onUndo`, `allowedTitle` and `allowedDetail` (the two lines once allowed; both crossfade), `working` (a spinner on a neutral row while the agent works under the permission), `meta` (quiet text at the end of that row, like an elapsed time), `followUp` (a second ask mid-run for one more scope: the icon tile turns amber), `declineLabel` (defaults to Not now), `declinedTitle`, `declinedDetail`, `bare` (on by default: it sits in the chat with no card; `false` draws the card).

**LaunchChecklist** · `launch-checklist/LaunchChecklist.tsx`  
The agent checks a design before it ships, and fixes what fails.  
`checks: { label, state: 'wait' | 'run' | 'ok' | 'bad', note?, onFix? }[]`, `title`, `status`, `action: { label, icon?, accent?, disabled?, onClick }`, `bare`.

**InlineTextDiff** · `inline-text-diff/InlineTextDiff.tsx`  
The agent's edits to a piece of copy, accepted or rejected one by one.  
`title`, `parts: (string | { key, from, to, note? })[]` (the copy in order, with the edits between the plain runs; `note` marks an edit the agent isn't sure of and shows above its buttons), `decisions` / `defaultDecisions` / `onDecisionsChange` (`'accepted' | 'rejected'` per edit key), `doneLabel` (the line once every edit is decided), `labels`. Click an edit, or press Enter on it, to open its Accept and Reject toolbar; Escape closes it. Accept all and Reject all take every edit still waiting.

**DraftReview** · `draft-review/DraftReview.tsx`  
An email the agent drafted, to check and edit before it sends.  
`title`, `subtitle`, `to: { name, initials?, color? }[]`, `subject` / `onSubjectChange`, `body` (paragraphs split by blank lines; it stays editable, read edits from `onBodyChange(text)`), `attachments: { name, size?, loading? }[]`, `warning: { text, actions: { label, onClick, primary? }[] }` (folds open above the buttons, like an attachment the message mentions but nothing attached), `phase: 'draft' | 'sending' | 'undo' | 'sent' | 'scheduled' | 'discarded'`, `sendOptions: { key, label, detail? }[]` (now, tomorrow at 09:00 or Monday at 09:00 by default, from a dropdown beside Send; any key but `now` turns the button into Schedule), `sendOption` / `defaultSendOption` / `onSendOptionChange`, `onSend(option)`, `onDiscard`, `onUndo` (undoes a send in its window, cancels a scheduled one or brings back a discarded draft), `undoLeft` (seconds shown while the phase is `undo`), `labels`.

**Steering** · `steering/Steering.tsx`  
Change the agent's course while it works, without starting over.  
`title`, `steps: { id, title, detail?, status: 'queued' | 'running' | 'done', fromYou? }[]`, `messages: { id, from: 'you' | 'agent', text, state?: 'queued' | 'applied', warn?, actions?: { label, onClick }[], answer? }[]` (yours wait as `queued` until the agent takes them up; the agent's last action is filled, and `answer` takes the buttons' place), `onSend(text)`, `value` / `defaultValue` / `onValueChange`, `placeholder`, `status` (defaults to "Step 2 of 4" or Done), `seconds` (counts by itself until every step is done), `summary` (defaults to "Done in 0:14 · 1 change from you"; `false` hides it).

**EvalResults** · `eval-results/EvalResults.tsx`  
An eval run case by case, against the run before.  
`title`, `subtitle`, `cases: { id, name, status: 'queued' | 'running' | 'pass' | 'fail', time?, expected?, got?, source?, fix?: { label, onClick } }[]` (a failed case opens to show expected, got and source), `onRun` (adds the button), `running`, `runLabel`, `previousPassed` (adds "1 fewer than the last run" or "All passing" once the run settles), `filter: 'all' | 'fail'` / `defaultFilter` / `onFilterChange`, `open` / `defaultOpen` / `onOpenChange`.

**DesignReview** · `design-review/DesignReview.tsx`  
Checks run, a teammate asks for a change, the agent makes it, and you ship.  
`title`, `subtitle`, `icon`, `checks: { label, state: 'wait' | 'run' | 'ok' | 'bad', note? }[]`, `messages: { author: { name, initials?, color?, agent? }, verdict?: { label, tone?, icon?, busy? }, text? }[]` (oldest first), `phase: 'review' | 'approved' | 'shipping' | 'live' | 'scheduled'` (Ship turns on at `approved`), `note`, `waitingLabel`, `options: { key, label, detail? }[]` (to everyone, to 10% first or on Monday by default), `option` / `defaultOption` / `onOptionChange`, `onShip(option)`, `doneLabel`, `labels`.

**PlanReview** · `plan-review/PlanReview.tsx`  
Check the agent's plan, edit steps, then let it run.  
`title`, `steps` / `defaultSteps` / `onStepsChange` (`{ id, text, skipped?, edited?, state?: 'run' | 'retry' | 'done', detail? }[]`; `detail` is the line a step reports under it, and `retry` shows it waiting out a problem; people can edit a step in place, skip one or add one), `phase: 'review' | 'running' | 'done'`, `status`, `note`, `meta` (quiet text at the end of the header, like an elapsed time), `onApprove`, `onRequestChanges`, `onStop`, `onSeeChanges`, `bare` (on by default: it sits in the chat with no card; `false` draws the card).

**ChangeReview** · `change-review/ChangeReview.tsx`  
Accept or reject each change the agent made, file by file.  
`files: { name, path?, hunks: { key?, title, lines: { kind: 'add' | 'del' | 'ctx', line, text }[] }[] }[]`, `file` / `defaultFile` / `onFileChange`, `decisions` / `defaultDecisions` / `onDecisionsChange` (`'kept' | 'undone'` per hunk key), `onComment({ file, hunk, line, text })`, `title`. Keep all moves on to the next file.

### Sources and output

**SourceStack** · `source-stack/SourceStack.tsx`  
Everything the agent read, folded into one quiet pill.  
`children` (the answer above the pill), `sources: { kind, title, host, relevance, mark, color, onOpen? }[]` (relevance 0 to 1), `filters`, `filter` / `defaultFilter` / `onFilterChange`, `open` / `defaultOpen` / `onOpenChange`.

**MetricInsight** · `metric-insight/MetricInsight.tsx`  
A number, its trend, and the agent's read on why it moved.  
`label`, `ranges: { key, label, points, value, change, insight, marker?: { at, label } }[]`, `range` / `defaultRange` / `onRangeChange`, `format`, `formatChange`, `drivers: { label, percent, color? }[]`, `explaining` (shows "Looking into it"), `open` / `defaultOpen` / `onOpenChange`.

**TaskTable** · `task-table/TaskTable.tsx`  
Agent tasks in a sortable table with bulk actions.  
`tasks: { id, name, status: 'running' | 'failed' | 'queued' | 'paused' | 'done', agent: { name, initials, color }, cost, updated }[]`, `selected` / `defaultSelected` / `onSelectedChange` (ids), `sort` / `defaultSort` / `onSortChange` (`{ key, desc? }`), `onAction(action, ids)` (`'pause' | 'retry' | 'cancel'`; the selection clears after, and cancelled rows slide away first), `title`, `summary`, `empty` and `emptyAction: { label, onClick }` (shown when there are no tasks). Selecting rows turns the header into an action bar; rows glide when the order changes. On narrow screens it hides the cost and shows agents as avatars.

**CodeViewer** · `code-viewer/CodeViewer.tsx`  
Code the agent wrote, with line notes you can ask about.  
`files: { name, lines: { code, changed?, note? }[] }[]` (`code` is a string or tokens `[kind, text]` with kind `k | s | f | cm | tg | at`), `file` / `defaultFile` / `onFileChange`, `line` / `defaultLine` / `onLineChange` (the line whose note is open), `delay`, `unchangedNote`, `onCopy(text)`.

**DetailsPanel** · `details-panel/DetailsPanel.tsx`  
Properties of a run you can change in place.  
`title`, `kind`, `copyValue` and `copyLabel` (adds the copy button), `sections: { key, title, rows }[]`, `open` / `defaultOpen` / `onOpenChange` (open section keys). A row is text `{ key, label, value }`, a menu `{ type: 'select', options, value / defaultValue / onValueChange }`, a rolling number `{ type: 'number', value, format? }` or tags `{ type: 'tags', tags, onAdd?, addLabel? }`.

**CitationHoverCard** · `citation-hover-card/CitationHoverCard.tsx`  
Hover a citation to see the exact passage it came from.  
`text` (`[n]` cites source n; a blank line starts a paragraph), `sources: { mark, color, site, title, quote, meta?, href? }[]` (wrap the key part of `quote` in `<mark>`), `openLabel`, `onOpenSource(source, index)`, `open` / `onOpenChange` (the index of the citation whose card shows, or null). Hovering, focusing or tapping a citation shows its card.

**FieldExtraction** · `field-extraction/FieldExtraction.tsx`  
The agent pulls fields out of a document and shows where each came from.  
`page` (the document; wrap the source of each field in `<FieldZone field="key">`), `fields: { key, label, value, confidence, suggestion?, fixed? }[]` (under 0.6 it asks for a check), `reading` (runs the scan line), `status`, `checkHint`, `onFix(key, value)`, `title`, `sendLabel`, `sentLabel`, `sendState: 'idle' | 'sending' | 'sent'`, `onSend`.

### Workspace

**WorkspaceRail** · `workspace-rail/WorkspaceRail.tsx`  
A slim app rail that opens into a labelled sidebar.  
`items: { key, label, icon, badge? }[]`, `value` / `defaultValue` / `onValueChange`, `expanded` / `defaultExpanded` / `onExpandedChange`, `workspace: { name, detail?, logo? }`, `runs: { key, label, onClick? }[]`, `runsLabel`, `shortcut`, `children` (the page beside the rail).

**CommandPalette** · `command-palette/CommandPalette.tsx`  
Jump anywhere or hand a task to the agent from one box.  
`items: { group, icon, label, keys? }[]`, `query` / `defaultQuery` / `onQueryChange`, `onRun(item)`, `onAsk(query)` (the "Ask the agent" row shows whenever something is typed), `onClose` (Escape on an empty box; otherwise Escape clears it), `placeholder`, `status`, `autoFocus`. Typing filters and marks the matched letters; ↑ and ↓ move, Enter runs.

**AgentSettings** · `agent-settings/AgentSettings.tsx`  
How much the agent may do alone, with a save bar for changes.  
`value` / `defaultValue` / `onValueChange` (`{ autonomy, toggles, cap, instructions }`), `levels: { label, description }[]`, `toggles: { key, label, detail? }[]`, `caps`, `formatCap`, `capLabel`, `capDetail`, `onSave(value)` (return a promise to spin until it settles), `onReset`. Any change since the last save brings up the save bar.

**FileExplorer** · `file-explorer/FileExplorer.tsx`  
Project files, with the ones the agent touched marked.  
`tree: { name, status?: 'M' | 'A' | 'D', children? }[]`, `open` / `defaultOpen` / `onOpenChange` (open folder paths), `selected` / `defaultSelected` / `onSelectedChange`, `query` / `defaultQuery` / `onQueryChange`, `onlyChanged` / `defaultOnlyChanged` / `onOnlyChangedChange`, `summary(n)`, `fileIcon(name)`, `placeholder`.

**AutomationCanvas** · `automation-canvas/AutomationCanvas.tsx`  
A trigger, a few agent steps, and a run you can watch flow through.  
`name`, `tag`, `status`, `nodes: { id, icon, color, title, detail, x, y, narrow?, field?: { label, options }, state?: 'run' | 'done' }[]` (positions are fractions of the canvas), `edges: [from, to][]`, `flowing: [from, to][]` (the wires a run has reached: a soft light passes along each as it is added, and it stays lit), `balanced` (on by default: columns spread evenly so the wires match on both sides), `selected` / `defaultSelected` / `onSelectedChange`, `values` / `defaultValues` / `onValuesChange`, `onNodeMove(id, at, narrow)`, `onRun` (adds Test run), `runLabel`, `doneLabel`. Under 560px wide it stacks.

**MemoryPanel** · `memory-panel/MemoryPanel.tsx`  
What the agent remembers about your team, editable and removable.  
`title`, `icon`, `kinds: { value, label, color }[]`, `memories` / `defaultMemories` / `onMemoriesChange` (`{ id, kind, text, source?, isNew? }[]`), `filter` / `defaultFilter` / `onFilterChange`, `allLabel`, `countLabel(n)`, `editedSource`, `onEdit`, `onForget`, `onRestore`, `undoFor`, `bare`. Edit in place; Forget leaves an Undo row for a few seconds.

**ModelCompare** · `model-compare/ModelCompare.tsx`  
Run one prompt on three models side by side and keep the best.  
`models: { name, mark, color, description? }[]`, `columns` / `defaultColumns` / `onColumnsChange` (`{ id, model }[]`), `max`, `prompt` / `defaultPrompt` / `onPromptChange`, `asked`, `answers` (per column: `{ state: 'thinking' | 'answering' | 'done', text?, seconds?, tokensPerSecond?, cost? }`), `onSend(prompt, columns)`, `onRun(column)`, `chosen` / `defaultChosen` / `onChosenChange`, `placeholder`. Fastest and cheapest turn green once the answers settle.

**ToolConnections** · `tool-connections/ToolConnections.tsx`  
The tools the agent can reach, and how much it may do with each.  
`tools` / `defaultTools` / `onToolsChange` (`{ key, name, detail?, brand? or icon? and color?, permission?: 'off' | 'ask' | 'allow', status?: 'ok' | 'testing' | 'error' | 'reconnecting', note? }[]`), `available` and `onConnect(tool)` (the Connect a tool menu), `onTest` (adds Test all), `testing` (Test all shows a spinner while a test runs), `onReconnect(key)`, `title`, `status`.

**KnowledgeSources** · `knowledge-sources/KnowledgeSources.tsx`  
The files, sites and folders the agent knows, and how far each is indexed.  
`sources: { key, name, kind: 'files' | 'web' | 'folder', count, unit?: 'pages' | 'files', state: 'queued' | 'indexing' | 'ready' | 'failed', done?, synced?, error?, fix?, note?, chunks? }[]`, `onUpload(files)`, `onAddWebsite(address)`, `address` / `defaultAddress` / `onAddressChange`, `folders: { key, name, detail? }[]` and `onConnectFolder(key)` (the Add source menu shows each option you handle), `onResync(key)`, `onRemove(key)`, `onFix(key)` (the button a failed source shows, labelled with its `fix`), `title`, `status`. Indexing shows a bar and "64 of 142 pages"; the line under the title adds up the sources' `chunks`.

**ScheduledRuns** · `scheduled-runs/ScheduledRuns.tsx`  
Tasks the agent runs on a schedule, with their last result and a switch.  
`runs` / `defaultRuns` / `onRunsChange` (`{ key, name, schedule, next?, enabled?, result?: 'passed' | 'failed' | 'running' | 'never', ago?, error?, fix?, fixing?, brand? or icon? and color? }[]`), `onRunNow(key)` (adds Run now), `onFix(key)` (the button a failed run shows, labelled with its `fix`), `onCreate({ task, repeat, days, schedule, next })` (adds New schedule: Every day, Every Monday or Custom days), `time`, `hour`, `title`, `status`. The switch pauses a run: its row dims and says Paused.

### Harness

**AgentHarness** · `agent-harness/AgentHarness.tsx`  
An agent app made of the other components: chats down the side, tabs across the top, and New chat with a greeting, the Composer and suggestions. Nothing plays by itself: a chat changes when you change its blocks.  
`conversations: { id, title, state?: 'idle' | 'running' | 'waiting' | 'done', unread?, status?: { state, label, meta?, action?, review? }, context?, blocks, followUps? }[]` (the side list, newest first), `tabs` / `defaultTabs` / `onTabsChange` (`{ key, chat? }[]`, a tab without a chat is New chat; it starts with one), `tab` / `defaultTab` / `onTabChange` (the tab on screen), `suggestions: { icon, text }[]` (three at a time, Shuffle shows the next three; picking one sends its text), `onSend({ text, attachments }, conversationId, tabKey)` (null from New chat: return the id of the chat it started and the tab turns into it; nothing is sent while the chat on screen is running), `onFollowUp(text, conversationId)`, `greeting`, `heading`, `workspaces: { name, mark?, color? }[]` with `workspace` / `defaultWorkspace` / `onWorkspaceChange`, `panel: { title, icon?, link?, children } | null` and `onPanelClose` (the panel beside the chat, for an artifact), `model` (beside the context ring), `draft` / `defaultDraft` / `onDraftChange` (each tab keeps its own), `placeholders: { home?, reply?, working? }`, `composer` (the rest of the Composer's props). A block is `{ key, kind, … }`: `'user'` (`text`, `files?`), `'say'` (`text`, pass it as it grows and each word fades in), `'working'` (`text`, a passing line with the thinking mark), `'group'` (`label`, `state: 'running' | 'done'`, `seconds?`, `blocks`: the agent's work under one line, folded a moment after it is done), `'node'` (`node`), or a component's name with its `props`: `'thinking'`, `'tool-call'`, `'permission-gate'`, `'plan-review'`, `'action-log'`, `'run-summary'`, `'live-answer'`, `'source-stack'`, `'artifact-card'`, `'error-recovery'`, `'decision-prompt'`, `'agent-lanes'`, `'change-review'`. `status` drives the Status pill beside the tabs; `review: blockKey` adds a Review button that scrolls to that block, and `context` (0 to 100) fills the ring. Every chat stays mounted, so its components keep their state when you switch. The chat follows new messages until you scroll up. At phone width the chats slide in from the side and the tabs scroll. `npx designme add agent-harness --react` adds the components it uses too.

### Charts and tables

**LineChart** · `line-chart/LineChart.tsx`  
Two series over time with a hover readout and toggles.  
`label`, `series: { key, label, values, color? }[]` (the first is the main line with the fill, the others dashed), `points` (a name per point, for the readout), `axis`, `range`, `unit`, `compareLabel`, `format`, `visible` / `defaultVisible` / `onVisibleChange` (keys; one series always stays on). The lines draw in while the number counts up; hovering shows a readout.

**BarChart** · `bar-chart/BarChart.tsx`  
Weekly agent runs, split by outcome, with a range switch.  
`label`, `series: { label, tipLabel?, color? }[]` (stacking order), `ranges: { key, label, bars: { label, values }[] }[]` (more than one adds the switch), `range` / `defaultRange` / `onRangeChange`, `unit`, `format`.

**DonutChart** · `donut-chart/DonutChart.tsx`  
Where the agent's time went, by kind of task.  
`segments: { label, value, color? }[]`, `label` (under the total), `unit`, `format`, `active` / `defaultActive` / `onActiveChange` (hovering an arc or its row highlights both).

**FunnelChart** · `funnel-chart/FunnelChart.tsx`  
Signup to paid, with the biggest drop called out by the agent.  
`title`, `stages`, `views: { key, label, values, insight? }[]` (more than one adds the switch), `view` / `defaultView` / `onViewChange`, `shareLabel`, `startLabel`, `format`. The biggest drop is marked in red.

**TopPages** · `top-pages/TopPages.tsx`  
Most visited pages with share of traffic and a quick sort.  
`pages: { path, title, views, change, tip? }[]`, `title`, `period`, `site`, `sort` / `defaultSort` / `onSortChange` (`'views' | 'change'`).

**HealthScore** · `health-score/HealthScore.tsx`  
A design system score made of a few checks you can open.  
`checks: { key?, label, score, detail, fixable? }[]`, `title`, `score` (defaults to the average), `status`, `open` / `defaultOpen` / `onOpenChange`, `onFix(check, index)` (return a promise to spin until it settles).

**ActivityHeatmap** · `activity-heatmap/ActivityHeatmap.tsx`  
When the agent and the team were busy, by day and hour.  
`series: { key, label, values, max, unit, note? }[]` (168 values from 0 to 1, Monday 12am first), `value` / `defaultValue` / `onValueChange`, `title`, `period`. Each cell's tip reads like "Tuesday 9am: 12 runs".

**StatCards** · `stat-cards/StatCards.tsx`  
Four headline numbers with sparklines and a period switch.  
`stats: { key?, icon, label, values: { value, change, points }[], prefix?, suffix?, color? }[]` (one value per period), `periods: { label, compare? }[]`, `period` / `defaultPeriod` / `onPeriodChange`, `sparkRange`.

**AccountTable** · `account-table/AccountTable.tsx`  
Customer accounts with health, plan and an agent note per row.  
`accounts: { name, color, plan, seats, health, mrr, note? }[]` (health 0 to 100: green from 80, amber from 60), `plans`, `planTones`, `plan` / `defaultPlan` / `onPlanChange` (`''` is All), `query` / `defaultQuery` / `onQueryChange`, `open` / `defaultOpen` / `onOpenChange` (the open account's name), `action: { label, doneLabel?, onClick(account) }` (return a promise to spin until it settles), `placeholder`, `emptyLabel`.

### Dates

**DatePicker** · `date-picker/DatePicker.tsx`  
A field that opens a calendar, with quick picks and natural language.  
`value` / `defaultValue` / `onValueChange` (`Date | null`), `month` / `defaultMonth` / `onMonthChange`, `open` / `defaultOpen` / `onOpenChange`, `query` / `defaultQuery` / `onQueryChange` (typed text like "next friday" or "in 2 weeks" picks a day), `parse`, `today` (pass it when rendering on a server), `placeholder`, `queryPlaceholder`, `presets: { label, days }[]`, `format`, `locale`, `weekStartsOn: 0 | 1`. Arrow keys, Home, End and Page Up / Page Down move around the calendar.

**SegmentedControl** · `segmented-control/SegmentedControl.tsx`  
Switch between views of the same thing, with a sliding indicator.  
`options: { value, label }[]`, `value` / `defaultValue` / `onValueChange`, `label` (names the group), `as: 'tabs' | 'radio'` (tabs by default, for switching a panel: give the panel `id="<id>-panel"` and `aria-labelledby="<id>-<value>"`), `id`. ← and → move and pick, Home and End jump to the ends.

**DateRangePicker** · `date-range-picker/DateRangePicker.tsx`  
Pick a start and end across two months, or use a preset.  
`value` / `defaultValue` / `onValueChange` (`{ start, end }`, `end` is null while picking), `month` / `defaultMonth` / `onMonthChange` (the left month), `presets: { key, label, range(today) }[]` (defaults to `DateRangePickerPresets`), `today`, `onApply({ start, end })`, `format`, `locale`, `weekStartsOn`. Hovering previews the range.

**EventCalendar** · `event-calendar/EventCalendar.tsx`  
A week view where the agent finds a free slot for you.  
`events` / `defaultEvents` / `onEventsChange` (`{ id, title, start: Date, end: Date, tone?, people? }[]`), `week` (the first day shown), `days`, `startHour`, `hours`, `title`, `now`, `selected` / `defaultSelected` / `onSelectedChange` (the event whose card is open), `onPrepNotes(event)`, `onJoin`, `newEvent`, `askLabel` and `onAsk`, `finding`, `suggestions: { id, title, start, end }[]`, `onBook`, `onSkip`, `status`. Drag events in 15-minute steps, click free time to add one, click an event for its details.

**Agenda** · `agenda/Agenda.tsx`  
Today's schedule with a live now line and agent prep notes.  
`items: { key?, time, title, detail?, people?, past?, notes?, action?: { label, onClick? } }[]`, `title`, `subtitle`, `count`, `now` (the line sits after the last past item), `open` / `defaultOpen` / `onOpenChange`.

### Forms and inputs

**Buttons** · `buttons/Buttons.tsx`  
Every button style, with loading, success and hold-to-confirm states.  
`Buttons({ rows: { label, children }[] })` is the labelled sheet; the file also exports the buttons themselves. `Button`: `variant: 'accent' | 'ink' | 'soft' | 'line' | 'ghost'`, `size: 'sm' | 'md' | 'lg'`, `icon`, `busy` / `busyLabel` / `busyGlyph`, `done` / `doneLabel` / `doneIcon`, `success`, `pressed`, `tip`, `kbd`, `disabled`; an `onClick` that returns a promise runs the button by itself (busy, then done for `doneFor`, then back). `ButtonIcon`: `icon`, `label`, `kbd`, `fill`. `ButtonCopy`: `text`, `label`, `copiedLabel`, `tip`, `onCopy`. `ButtonMenu`: `label`, `items: { key, label, icon? or brand?, detail?, danger?, divider? }[]`, `onSelect(key)`, `status`, `align`, `open` / `defaultOpen` / `onOpenChange`. `ButtonIconMenu`: the same menu from an icon button: `icon`, `label`, `items`, `onSelect(key)`, `status`, `align`, `open` / `defaultOpen` / `onOpenChange`. `ButtonRun`: `state: 'idle' | 'running' | 'stopped' | 'complete'`, `seconds`, `onRun`, `onStop`. `ButtonHold`: `label`, `holdingLabel`, `doneLabel`, `onConfirm` (after holding 1.2s with a pointer, Space or Enter).

**Tooltip** · `tooltip/Tooltip.tsx`  
Quiet labels on hover, with shortcuts and a richer preview card.  
`groups: { key, icon, label, tip?, kbd?, onClick? }[][]` (toolbar buttons, a line between groups), `people: { key, initials, color, name, role, status, working? }[]` (hovering or focusing an avatar shows its card after `cardDelay`), `note`, `openTip` (a button key whose tip shows) and `openCard` (a person key whose card shows).

**SearchInput** · `search-input/SearchInput.tsx`  
Search with scoped filters, recent queries and an agent answer.  
`items: { icon, label, source }[]`, `sources: { key, label, icon }[]` (typing `@` lists them; picking one adds a filter chip), `recent: string[]`, `value` / `defaultValue` / `onValueChange`, `scope` / `defaultScope` / `onScopeChange`, `open` / `defaultOpen` / `onOpenChange`, `answer` (the agent's answer above the results; feed it as it grows), `filter(item, search)`, `onSelect(item)`, `onSubmit(search, scope)`, `placeholder`, `shortcut`, `emptyLabel`. ↑ and ↓ highlight, Enter picks, Escape closes, Backspace in an empty box removes the filter.

**CountrySelect** · `country-select/CountrySelect.tsx`  
A searchable select with country codes, currency and keyboard support.  
`countries: { code, name, currency, flag? }[]` (defaults to twelve countries with built-in flags), `value` / `defaultValue` / `onValueChange` (the country code), `open` / `defaultOpen` / `onOpenChange`, `query` / `defaultQuery` / `onQueryChange`, `label`, `hint`, `pickedHint(country)`, `placeholder`, `suggestedLabel`, `emptyLabel`. Typing filters by name or code; ↑, ↓, Enter and Escape work as in any select.

**MultiSelect** · `multi-select/MultiSelect.tsx`  
A combobox that filters as you type and keeps your picks as chips.  
`label`, `options: { value, label?, meta? }[]`, `value` / `defaultValue` / `onValueChange` (the picked values, in order), `query` / `defaultQuery` / `onQueryChange`, `open` / `defaultOpen` / `onOpenChange`, `placeholder`, `hint`, `empty`. ↑ and ↓ move through the list, Enter picks or unpicks, Escape closes it, and Backspace in an empty box removes the last chip.

**SocialSignIn** · `social-sign-in/SocialSignIn.tsx`  
One-tap providers that remember the last one you used.  
`providers: { key, label, brand? or icon? or letters? }[]` (defaults to Google, GitHub, Figma and SSO), `user: { name, initials, color? }`, `lastUsed` / `defaultLastUsed` / `onLastUsedChange`, `signedIn` / `defaultSignedIn` / `onSignedInChange`, `onSignIn(provider)` (return a promise and the button spins; resolving to false stays signed out), `onSignOut`, `onEmail`, `title`, `logo`, `emailLabel`.

**SignIn** · `sign-in/SignIn.tsx`  
Email first, then a one-time code that fills itself in.  
`email` / `defaultEmail` / `onEmailChange`, `onSendCode(email)` (return a promise to spin; a rejection's message shows under the field), `step` / `defaultStep` / `onStepChange` (`'email' | 'code' | 'done'`), `code` / `defaultCode` / `onCodeChange`, `codeLength`, `onVerify(code, email)` (return false for a wrong code), `resendIn`, `onResend`, `onSignedIn(email)`, and the titles and labels. A pasted or autofilled code spreads over the boxes.

**OtpField** · `otp-field/OtpField.tsx`  
A one-time code, one box per digit, that fills from a paste.  
`value` / `defaultValue` / `onValueChange`, `onComplete(code)` (once every box is filled), `status: 'idle' | 'checking' | 'error' | 'success'` (error shakes the boxes red and typing again starts the code over; success locks them green), `message`, `length` (6 by default, in two halves), `title`, `description`, `icon`, `footer` (like a resend link). The first box asks for `autocomplete="one-time-code"`; Backspace and the arrow keys move between boxes.

**Form** · `form/Form.tsx`  
A project brief with inline checks and an agent that drafts the rest.  
`fields: { key, label, type?: 'text' | 'textarea' | 'choice', placeholder?, maxLength?, rows?, options?, autoComplete?, validate?(value, values) }[]`, `values` / `defaultValues` / `onValuesChange`, `onDraft` (adds "Draft with agent"; drafted fields are marked Drafted beside their label until edited), `onSubmit(values)` (spins while pending; a rejection's message shows beside the button), `title`, `submitLabel`, `invalidMessage`, `draftedMessage`, `doneTitle(values)`, `doneDetail`. A `ref` gives `draft()`, which runs the agent's draft as if the button were pressed.

**PaymentForm** · `payment-form/PaymentForm.tsx`  
Card details with live formatting, brand detection and a clear total.  
`plan`, `description`, `seats`, `seatLabel`, `price`, `currency`, `yearlyDiscount`, `period` / `defaultPeriod` / `onPeriodChange` (`'monthly' | 'yearly'`), `card` / `defaultCard` / `onCardChange` (`{ number, expiry, cvc }`, formatted as typed), `onPay({ card, period, total })` (Processing while pending, then "Payment successful"), `note`. Card details only ever go to `onPay`.

### Collaboration

**Comments** · `comments/Comments.tsx`  
A design thread where you can @mention the agent and it replies.  
`title`, `pin`, `comments: { id, author: { name, initials, color, handle? }, text, time, agent?, thinking?, actions?: { label, primary?, onClick }[], resolution? }[]`, `people` (handles for the @ menu), `value` / `defaultValue` / `onValueChange` (the reply), `onSend(text)`, `placeholder`, `resolved` / `defaultResolved` / `onResolvedChange`. An agent reply's words fade in as `text` grows.

**Notifications** · `notifications/Notifications.tsx`  
An inbox where agent updates and mentions arrive live.  
`items` / `defaultItems` / `onItemsChange` (`{ id, kind, text, time, icon? and color?, or avatar?, read? }[]`, newest first), `filters`, `filter` / `defaultFilter` / `onFilterChange`, `title`, `markAllLabel`, `emptyLabel`. A new item drops in at the top and bumps the count.

**InviteToCollaborate** · `invite-to-collaborate/InviteToCollaborate.tsx`  
Add teammates by email as chips, set their role, send.  
`emails` / `defaultEmails` / `onEmailsChange`, `draft` / `defaultDraft` / `onDraftChange`, `validate`, `colors`, `roles: { label, detail? }[]`, `role` / `defaultRole` / `onRoleChange`, `suggestions: { email, initials, color }[]`, `members: { key?, name, detail?, initials, color, role, pending? }[]`, `onSend(emails, role)` (return a promise to spin until it settles), `link`, `copyLabel`, `copiedLabel`, `title`, `subtitle`, `placeholder`. Enter, a comma, Tab or a paste makes chips.

**Reactions** · `reactions/Reactions.tsx`  
Quick reactions on an agent update, with counts that pop.  
`author`, `time`, `message`, `icon`, `reactions` / `defaultReactions` / `onReactionsChange` (`{ emoji, count, people?, mine? }[]`), `emojis` (the picker), `meLabel`, `addLabel`. Clicking a reaction toggles yours and the count rolls; tips read like "You, Maya, Jon and 2 more", `bare` (on by default: it sits in the chat with no card; `false` draws the card).

**ProfileMenu** · `profile-menu/ProfileMenu.tsx`  
The account menu behind an avatar: switch workspace, theme, shortcuts and sign out.  
`user: { name, email, initials?, color? }`, `workspaces: { id, name, detail?, initial?, tint? }[]`, `workspace` / `defaultWorkspace` / `onWorkspaceChange`, `context` (the line under the workspace name), `dark` / `defaultDark` / `onDarkChange` (the theme switch only reports; apply the theme yourself), `themeLabel`, `shortcuts: { keys, label }[]` (defaults to the menu's own keys), `shortcutsOpen` / `defaultShortcutsOpen` / `onShortcutsOpenChange`, `signedIn` / `defaultSignedIn` / `onSignedInChange`, `note`, `open` / `defaultOpen` / `onOpenChange`. A `role="menu"` with `menuitemradio` workspaces and a `menuitemcheckbox` theme switch; the arrow keys, Home and End move through it, Escape closes it and gives the focus back to the avatar, and ? opens the shortcuts.

**FilterMenu** · `filter-menu/FilterMenu.tsx`  
Add filters from a menu, see them as chips, and watch the count change.  
`fields: { key, label, icon?, operators?, options: { value, label, chip?, glyph? }[] }[]`, `filters` / `defaultFilters` / `onFiltersChange` (`{ field, value, negate? }[]`, one per field), `total`, `count`, `noun`, `countFor(field, value)` (the number beside each value), `results: { id, title, dot?, avatar?, meta? }[]` (the first few matches), `emptyLabel`, `label`, `clearLabel`, `open` / `defaultOpen` / `onOpenChange`. The menu has two steps, a field and then its value; the right and left arrows move between them. Clicking a chip's operator flips it ("is" to "is not"), its × removes it.

**TicketList** · `ticket-list/TicketList.tsx`  
Support tickets the agent has triaged, with suggested replies.  
`tickets` / `defaultTickets` / `onTicketsChange` (`{ id, title, from, question?, reply?, priority?: 'urgent' | 'high' | 'normal' | 'low', assignee, waiting, status: 'open' | 'done' }[]`), `filter` / `defaultFilter` / `onFilterChange`, `open` / `defaultOpen` / `onOpenChange`, `onSend(ticket, reply)` (return a promise to spin; the ticket then moves to Solved), `title`, `filterLabels`, `emptyLabel`, `replyLabel`, `editLabel`, `sendLabel`.

**KanbanBoard** · `kanban-board/KanbanBoard.tsx`  
A board where you and the agent move cards, with drag and drop.  
`columns: { key, title }[]`, `cards` / `defaultCards` / `onCardsChange` (`{ id, column, title, tag?, assignee?, progress? }[]`; array order is column order; `progress` from 0 to 1 marks the agent's card), `onMove(id, column, index)`, `onDraggingChange(dragging)`, `newCard(column)`, `onRename(id, title)`, `addLabel`. Drag with the pointer; + adds a card with its title ready to type.

### Product

**PricingCards** · `pricing-cards/PricingCards.tsx`  
Three plans with a billing switch and a seat slider.  
`plans: { name, description?, price, priceLabel?, unit?, total?, features, action: { label, variant?: 'soft' | 'accent' | 'ink' }, popular?, fromSeats? }[]` (`price` is per editor per month, `0` is free and `null` is "Custom"; the outline moves to a plan once the editors reach its `fromSeats`), `period` / `defaultPeriod` / `onPeriodChange` (`'monthly' | 'yearly'`), `yearlyDiscount`, `seats` / `defaultSeats` / `onSeatsChange`, `minSeats`, `maxSeats`, `seatsLabel`, `popularLabel`, `onChoose(plan, { period, seats })`. Prices roll to their new value.

**OnboardingChecklist** · `onboarding-checklist/OnboardingChecklist.tsx`  
First steps with a progress ring, and the agent can do some for you.  
`steps: { key?, title, detail?, done?, automatic? }[]` (`automatic` adds "Do it for me"), `done` / `defaultDone` / `onDoneChange` (keys), `running` (keys the agent is working on), `onDoIt(step, index)` (return a promise; the step ticks itself off when it settles), `title`, `status`, `doneMessage`, `doItLabel`, `runningLabel`, `open` / `defaultOpen` / `onOpenChange`, `bare` (on by default: it sits in the chat with no card; `false` draws the card).

**Stepper** · `stepper/Stepper.tsx`  
A multi-step setup with a progress track that fills as you go.  
`steps: { label, title, description?, options?: { label, detail? }[], content?, defaultOption? }[]` (`content` replaces the options with your own fields), `step` / `defaultStep` / `onStepChange` (`steps.length` is the finished screen), `values` / `defaultValues` / `onValuesChange`, `onNext(step, values)` (return false to stay), `onFinish(values)`, `doneTitle`, `doneDetail`, `backLabel`, `nextLabel`, `finishLabel`, `restartLabel`, `bare` (on by default: it sits in the chat with no card; `false` draws the card).

**SetLimit** · `set-limit/SetLimit.tsx`  
A monthly agent budget with a draggable cap and a forecast.  
`value` / `defaultValue` / `onValueChange` (the cap), `min`, `max`, `step`, `spent` and `forecast` (the solid and striped bars), `mode` / `defaultMode` / `onModeChange` (`'pause' | 'ask' | 'keep'`, what happens at the limit), `title`, `subtitle`, `passesOn`, `format`, `message({ over, cap, left, mode })`, `editable` (on by default: click the figure and type a budget; Enter keeps it, Escape goes back). Drag on the bar or use the arrow keys on the knob.

**CurrencyConverter** · `currency-converter/CurrencyConverter.tsx`  
Show plan prices in local currency, with a swap and live rate.  
`currencies: { code, name, symbol?, rate, decimals? }[]` (rates against one base, defaulting to `CurrencyConverterCurrencies`; it never fetches anything), `amount` / `defaultAmount` / `onAmountChange`, `from` / `defaultFrom` / `onFromChange`, `to` / `defaultTo` / `onToChange`, `payLabel`, `seeLabel`, `updated`, `locale`. Swap carries the converted amount over.

## Examples

`src/examples/<name>.tsx` rebuilds each animated preview from designme.dev with the component, driven from React state. They are the quickest way to see how a component is meant to be fed. You don't need to copy them.

## Shared pieces

The components are built from a few small pieces in `src/lib`, exported from `src/index.ts` for your own use:

- `Icon` (97 line icons), `Brand` (Google, GitHub, Figma, Slack) and `Flag` (12 countries)
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
