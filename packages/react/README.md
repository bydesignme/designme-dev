# Designme components for React

React versions of the [designme.dev](https://designme.dev) components, for Next.js, React (Vite) and Astro. You copy the source into your project, the way shadcn/ui works, so it is yours to change.

They use the same markup and the same CSS as the site, so they look and move exactly like the previews on designme.dev, in both styles (Blueprint and Soft) and in light and dark. The difference is that each one takes props, so you drive it from your own state instead of a scripted demo.

All 125 components are here, from Status pill to Currency converter, each with an example that replays its demo from the site.

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
4. Pick the look on `<html>`: Blueprint is the default, `data-style="soft"` switches to Soft (on `<html>`, or on any element around the components to make just those Soft; tooltips sit on the page and keep its style), and `data-theme="dark"` or `data-theme="light"` fixes the theme (otherwise it follows the device).

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
`running`, `seconds` (counts by itself when left out), `title`, `plan: { label, detail?, state: 'done' | 'now' | 'next' }[]`, `notes: string[]`, `sources: { label, kind?, tip? }[]`, `edits: { file, detail?, removed?, added? }[]`, `view: 'plan' | 'notes' | 'sources' | 'edits'` / `defaultView` / `onViewChange`, `bare`, `open` / `defaultOpen` / `onOpenChange`.

**Thinking** · `thinking/Thinking.tsx`  
The live trace, written as the agent works, then folded away.  
`steps: { label, state: 'running' | 'retry' | 'done', result?, resultTip?, time? }[]` (`result` is what the step found, or what it waits on while it retries; it opens under the step and crossfades, and writes itself in a word at a time once the step is done; `time` shows at the right of a done step, and the line to the next step turns green), `running`, `seconds` (counts by itself when left out), `title` (the header while it runs), `summary` (the header once done: what the work came to), `collapseWhenDone`, `open` / `defaultOpen` / `onOpenChange`.

**AgentPhases** · `agent-phases/AgentPhases.tsx`  
One line for which phase the agent is in, from thinking to done.  
`phase: 'thinking' | 'searching' | 'reading' | 'waiting' | 'writing' | 'done'`, `label`, `seconds` (counts by itself, pausing while waiting), `error: { text, detail?, onRetry }`, `slow: { text, onStop? }`, `ask: { text, approveLabel?, onApprove, onDecline? }` (shown while waiting), `took` (seconds per phase, listed once done), `open` / `defaultOpen` / `onOpenChange`.

**ContextMeter** · `context-meter/ContextMeter.tsx`  
How full the context is and what fills it, with Compact to free room.  
`parts: { key, label, tokens, color?, items? }[]` (`items` is what's in it, shown on hover), `limit`, `warnAt` (share of the limit where the ring turns orange, 0.85 by default), `message` and `messageTone: 'warn' | 'ok'` (a line under the legend), `onCompact` (return a promise and the button spins), `compacted` and `onUndo`, `hint`, `open` / `defaultOpen` / `onOpenChange`. The numbers count to their new values; Escape shuts the panel.

**ActionLog** · `action-log/ActionLog.tsx`  
Every read, search, edit and command, logged as it runs.  
`actions: { icon, title, detail?, state: 'running' | 'done', time?, output? }[]` (title, detail and output take JSX; output lines in `dm-a` / `dm-x` spans read as added and removed), `title`, `running`, `status` (defaults to "Running step N", then "N steps, Xs"), `bare`. Each row opens to show its output.

**RunQueue** · `run-queue/RunQueue.tsx`  
Agent jobs running, up next and done, with progress, retries and a compact view.  
`jobs: { id?, title, agent?, icon?, state, progress?, time?, note?, steps?: { label, state, meta? }[] }[]` with state `'queued' | 'running' | 'failed' | 'done'` (running and failed jobs show under Running, queued under Up next, done under Done; a job glides between them), `title`, `status`, `summary` (under "All N jobs done" once every job is done), `density: 'detailed' | 'compact'` / `defaultDensity` / `onDensityChange`, `onRetry(job, step)`, `bare`.

**RunCost** · `run-cost/RunCost.tsx`  
Live credit and token spend, with a cap that pauses the run.  
`used`, `budget`, `capAt` (90), `capOn` / `defaultCapOn` / `onCapChange`, `status: 'idle' | 'running' | 'stopped' | 'paused' | 'spent'`, `statusLabel`, `rows: { label, value }[]`, `actionLabel`, `onAction`, `title`, `bare`.

**Toast** · `toast/Toast.tsx`  
One notification that changes shape with its state.  
`toast: { id, tone?: 'success' | 'error' | 'info' | 'loading', title, description?, action?: { label, onClick, variant?: 'ghost' | 'primary', busy? } } | null`, `onDismiss(id)`. A new `id` slides the new toast in and the old one out; the same `id` changes the text in place.

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
`lanes: { key, name, icon, tone?, status: 'queued' | 'waiting' | 'working' | 'paused' | 'done', activity, steps?, done?, progress?, log?: { text, time? }[] }[]` (`tone` colours the lane's badge, track, tag and stretch of relay line; `progress`, 0 to 1, fills the step in hand), `title`, `seconds` (counts by itself when left out), `paused` / `defaultPaused` / `onPausedChange` (adds Pause all and Resume), `handoff: { from, to, what }` (a light runs down the relay line to the next badge and the stretch stays lit; clear it and its line slides away), `expanded` / `defaultExpanded` / `onExpandedChange`, `bare`.

**AgentTree** · `agent-tree/AgentTree.tsx`  
An orchestrator and the sub-agents it spawns, joined by elbows, with cost and tokens rolled up per branch.  
`root: { id, name, task, status: 'queued' | 'running' | 'done' | 'failed' | 'waiting', cost?, tokens?, seconds?, fix?: { label, onClick }, approval?: { approveLabel?, declineLabel?, onApprove, onDecline? }, children? }` (a branch shows its own cost and tokens plus everything under it, split on hover; a new child draws its elbow in, and a dash runs along the path to a running node), `title`, `status` (defaults to Running, Needs you, "1 step failed" or Done), `seconds` (counts by itself until the root is done), `summary` (defaults to "Done in 0:12 · 3 agents · $0.48 · 4.4k tokens"; `false` hides it), `collapsed` / `defaultCollapsed` / `onCollapsedChange`, `selected` / `defaultSelected` / `onSelectedChange`, `formatCost`, `variant: 'panel' | 'bare'` (bare drops the surface so it can sit in a chat), `slim` (hides the title). Hover or select a row to mark its path back to the root. The arrow keys move through it as a tree view.

**AgentInbox** · `agent-inbox/AgentInbox.tsx`  
Every run that needs you, is running or is done, in one list.  
`runs: { id, title, agent, color?, group: 'needs' | 'running' | 'done', detail?, failed?, why?, seconds?, ended? }[]` (running clocks count on from `seconds`), `onApprove(id)`, `onRetry(id)` (each adds its button), `title`, `status` (defaults to "2 need you", "2 running" once nothing needs you, or "All clear · 4 done today"). A group with no runs is hidden, and a run that changes group glides to its new place.

**BrowserSession** · `browser-session/BrowserSession.tsx`  
The agent browsing for you, step by step, with Pause and Take over.  
`title`, `url` (the address bar), `search` (marks `url` as a search), `children` (the page, 156px tall: a screenshot or live view, or a wireframe drawn with the `dm-bws-pg` classes), `cursor: { x, y, down? } | null` (the agent's pointer over the page), `steps: { label, state: 'queued' | 'running' | 'waiting' | 'done', detail? }[]`, `ask: { label, onAllow }` (under the waiting step, beside Take over), `paused` / `defaultPaused` / `onPausedChange`, `inControl` / `defaultInControl` / `onInControlChange` (Take over and Hand back; the page is only usable while the person has it), `seconds` (counts by itself while it browses), `status` (defaults to Browsing, Paused, Needs you, You have control or Done), `summary` (shown once every step is done).

**WebSearch** · `web-search/WebSearch.tsx`  
The agent's searches as a trail, with the answer and its sources.  
`queries: { key, query, status: 'searching' | 'done', results?, time?, rewritten?, pages?: { title, domain, date?, status: 'reading' | 'read' | 'skimmed' | 'paywall' | 'blocked' | 'timeout', cite? }[] }[]`, `done` (folds the trail to its summary), `answer` (cite pages as [1], [2]), `open` / `onOpenChange`, `bare`.

**TraceView** · `trace-view/TraceView.tsx`  
One agent run as a waterfall of spans, with latency and tokens.  
`title`, `spans: { id, name, kind: 'agent' | 'llm' | 'tool' | 'retrieval', start, duration?, tokens?, input?, output?, children? }[]` (an agent span without `tokens` adds up the spans under it; guides join each span to its parent, and a key counts the spans of each kind), `time` (seconds into the run while it streams, marked by a playhead; leave out `duration` on a span still running and its bar glows as it grows), `axis` (seconds the axis covers), `slowAfter` (a tool call over it turns amber and is tagged slow; 2 by default), `status`, `selected` / `defaultSelected` / `onSelectedChange` (the span whose input, output, latency and tokens show under the waterfall). The arrow keys move between spans and Escape closes the details.

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
A file the agent made, with its versions, Open, Copy and Download.  
`variant: 'compact' | 'preview' | 'inline' | 'stack'` (a row, a card with its first page, a chip inside a message, or a stack of its versions), `versions: { title, meta, note?, content, summary? }[]` (oldest first; `content` is the Markdown, or CSV, that the reader shows, Copy copies and Download saves), `version` / `defaultVersion` / `onVersionChange` (a menu of every version, newest first; the stack lays its sheets out instead), `state: 'writing' | 'ready'` with `status` and `progress` (a spinner and the status line while writing; the actions come in when it's ready), `kind`, `icon`, `fileName`, `ext`, `onOpen` and `openLabel` (opens the file your own way instead of the card's reader, which covers its nearest positioned ancestor), `onCopy`, `onDownload`.

**ImageGeneration** · `image-generation/ImageGeneration.tsx`  
A prompt with styles, shape and count, pictures that resolve out of grain, and a gallery of earlier ones.  
`onGenerate(request, update)` (makes the pictures: `request` is `{ prompt, styles, shape, count, model, references, variationOf?, retry? }`, and you call `update(slot, { progress, image, error })` as each goes; send `image` as soon as there is anything to show, even only a `placeholder`, and the effect, dots then blur and a scan line then sharp, plays over it; Retry and Vary call it again for one picture), `onAction(action, image)` (`'upscale'` (return a promise and the sweep waits for it), `'download'`, `'reference'`, `'like'`, `'dislike'`), `title` and `section` (the header), `prompt` / `defaultPrompt` / `onPromptChange`, `styles` (the chips; Editorial, Poster, Surreal and 35mm by default) with `selectedStyles` / `defaultSelectedStyles` / `onSelectedStylesChange`, `shape: '1:1' | '3:4' | '16:9'` / `defaultShape` / `onShapeChange`, `count` (1 to 4) / `defaultCount` / `onCountChange`, `models: { key, label, description?, icon? }[]` with `model` / `defaultModel` / `onModelChange`, `gallery` (earlier pictures, newest first; finished ones join at the top), `presets: { key, label, description?, styles, image? }[]` (the Styles tab; picking one sets the chips), `tab` / `defaultTab` / `onTabChange`. Each picture is `{ key, src?, alt, placeholder?, ratio?, prompt?, styles? }`. A picture opens larger in a dialog over the component with Upscale, Vary, Use as reference, Download and its own thumbs.

**RichTextEditor** · `rich-text-editor/RichTextEditor.tsx`  
A minimal editor with an inline AI menu that streams a suggestion to accept or discard.  
`value` / `defaultValue` / `onValueChange` (HTML in a few tags: `p`, `h2`, `ul`, `ol`, `li`, `blockquote`, and `b`, `i`, `code` and `a href` inside them; anything else is cleaned out, as on paste), `onChange` (the same as `onValueChange`), `placeholder`, `label` (the text box's name, Draft by default), `hint`, `ai({ action, text, before, after, document, signal })` (return a string, a promise of one, or an async iterable of chunks to stream it in; defaults to a demo that streams canned text, and `false` hides the AI), `aiActions: { key, label, icon?, kind?: 'swap' | 'add' }[]` (defaults to Improve writing, Make shorter, Fix grammar and Continue writing), `onSuggestion({ action, text, accepted })`. A ref can `type`, `select`, `format`, `ask`, `accept`, `discard`, `undo` and `redo`. Shortcuts: ⌘B, ⌘I, ⌘E (code), ⌘K (link), ⌘⌥1 (heading), ⌘⇧8, ⌘⇧7 and ⌘⇧9 (lists and quote), ⌘J (the AI menu), or / at the start of a line; Tab or Enter accepts a suggestion and Escape discards it.

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

**HumanHandoff** · `human-handoff/HumanHandoff.tsx`  
The agent hands a conversation to a person, with what they need to pick it up.  
`title`, `reason` (why it handed off), `assignee: { name, initials?, color?, team?, presence?, tone?: 'ok' | 'warn' } | null` (null while it finds someone; `finding: { title, detail? }` fills the row meanwhile), `people` (adds Reassign, a small menu of who else can take it) and `onReassign(person)`, `secondsLeft` ("Reply due in 14 min", orange under five minutes, overdue at 0) and `targetSeconds` (the bar's whole window, 900 by default), `summary`, `facts: { label, value }[]`, `link: { label, href?, onClick?, tip? }` (the whole conversation), `message` and `messageLabel` (what the customer was told), `onMessageChange(text)` (adds Edit; the message turns editable, then Save or Cancel), `edited`, `status: { tone?: 'wait' | 'warn' | 'ok', title, detail?, person? }` (the row at the foot: a spinner while it waits, orange with an alert, green with the person's avatar), `labels`. The two columns stack below 600px.

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

**TerminalStream** · `terminal-stream/TerminalStream.tsx`  
Shell commands the agent runs, with their output as it streams in.  
`cwd`, `entries` (oldest first: a command `{ command, output?, status: 'running' | 'ok' | 'failed' | 'stopped', exitCode?, duration? }`, a note `{ kind: 'note', text }` for what the agent says between commands, or an edit `{ kind: 'edit', file, added?, removed?, diff?, status?: 'running' | 'done' | 'stopped' }` (`diff` is the changed lines, each starting with - or +, shown under it on red and green tints); an output line is a string or `{ text, tone?: 'ok' | 'bad' | 'muted' }`), `status: 'running' | 'passed' | 'failed' | 'stopped'` (left out, it follows the entries), `elapsed` (beside Running in the header, and in the summary), `summary` (defaults to "3 commands · 0:18 · passed", counting each command once however many times it ran; `false` hides it), `tail` (output longer than `tail` + 1 lines folds to its last `tail`, 4 by default, behind "Show 24 more lines"), `onStop` (adds Stop while it runs), `onCopy(text)`, `labels`. Output wraps inside the panel, so long lines never scroll the page sideways.

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
`items: { group, icon, label, keys?, hint?, tone? }[]` (`tone` colours the icon tile, `hint` is a quiet word after the label), `query` / `defaultQuery` / `onQueryChange`, `onRun(item)`, `onAsk(query)` (the "Ask the agent" row shows whenever something is typed), `onClose` (Escape on an empty box; otherwise Escape clears it), `placeholder`, `status`, `autoFocus`. Typing filters and marks the matched letters; ↑ and ↓ move, Enter runs, and the command's tile spins for a beat.

**AgentSettings** · `agent-settings/AgentSettings.tsx`  
How much the agent may do alone, with a save bar for changes.  
`value` / `defaultValue` / `onValueChange` (`{ autonomy, toggles, cap, instructions }`), `levels: { label, description }[]`, `toggles: { key, label, detail? }[]`, `caps`, `formatCap`, `capLabel`, `capDetail`, `onSave(value)` (return a promise to spin until it settles), `onReset`. Any change since the last save brings up the save bar.

**AgentBuilder** · `agent-builder/AgentBuilder.tsx`  
Describe an agent in a sentence and it drafts the rest; test it, save it, publish it.  
`value: { name, purpose, icon, instructions, model, effort, tools: { key, label, brand?, level: 'read' | 'ask' | 'act' }[], knowledge, trigger: 'chat' | 'sched' | 'event', triggerDetail? }`, `onChange(value, section)`, `description` / `onDescriptionChange`, `onDraft`, `drafting` (the section in hand), `drafted` (sections with a Drafted tag), `status: 'empty' | 'dirty' | 'saved' | 'live'`, `onSave`, `onPublish`, `publishing`, `onTest`, `test: { email, reply? }`, `models`, `icons`.

**FileExplorer** · `file-explorer/FileExplorer.tsx`  
Project files, with the ones the agent touched marked.  
`tree: { name, status?: 'M' | 'A' | 'D', children? }[]`, `open` / `defaultOpen` / `onOpenChange` (open folder paths), `selected` / `defaultSelected` / `onSelectedChange`, `query` / `defaultQuery` / `onQueryChange`, `onlyChanged` / `defaultOnlyChanged` / `onOnlyChangedChange`, `summary(n)`, `fileIcon(name)`, `placeholder`.

**AutomationCanvas** · `automation-canvas/AutomationCanvas.tsx`  
A trigger, a few agent steps, and a run you can watch flow through.  
`name`, `tag`, `status`, `nodes: { id, icon, color, title, detail, x?, y?, narrow?, field?: { label, options }, state?: 'run' | 'done', connectors?: ('model' | 'tools')[], attach?: { to, via } }[]` (positions are fractions of the canvas, the height counted between the name over its top and Test run over its foot; a node with `attach` is placed by the canvas), `edges: [from, to, via?][]`, `flowing: [from, to][]` (the wires a run has reached: a soft light passes along each as it is added, and it stays lit), `balanced` (on by default: columns spread evenly so the wires match on both sides), `selected` / `defaultSelected` / `onSelectedChange`, `values` / `defaultValues` / `onValuesChange`, `onNodeMove(id, at, narrow)`, `catalog: { step, model?, tools? }` (groups of step types: with it, an open output gets a + and each connector opens the step picker), `onAddNode(type, from, via, group)`, `maxNodes`, `searchLabel`, `onRun` (adds Test run, over the bottom left with `status` beside it), `runLabel`, `doneLabel`. The canvas fills the height it is given, 560px when nothing gives it one. Under 560px wide it stacks, 640px tall.

**CanvasToolbar** · `canvas-toolbar/CanvasToolbar.tsx`  
A floating toolbar for a workflow canvas: run, pick a tool, comment, fit and zoom.  
`nodes: { id, icon, color, iconColor?, title, detail?, x, y, narrow?, state?: 'run' | 'done' }[]` (positions in canvas pixels at 100%; `narrow` is used below 440px), `edges: [from, to][]`, `lit` (the wires a run has reached), `running`, `onRun`, `onStop`, `runLabel`, `stopLabel`, `tool: 'select' | 'hand' | 'lasso'` / `defaultTool` / `onToolChange`, `commenting` / `defaultCommenting` / `onCommentingChange`, `onComment({ x, y })` and `comments` (the pins), `view: { panX, panY, zoom } | null` / `defaultView` / `onViewChange` (null fits the steps), `selected` / `defaultSelected` / `onSelectedChange`, `onNodesMove(moves, narrow)`, `zoomSteps`, `label`, `children` (drawn on the canvas under the steps). The toolbar is fixed at the bottom centre, and the canvas fills the height it is given, 560px when nothing gives it one (520px below 440px wide). A ref can `panBy`, `zoomIn`, `zoomOut`, `zoomTo` and `fit`. Shortcuts while the canvas or toolbar has the focus: V, H and L for the tools, C to comment, ⇧1 to fit, ⇧0 for 100%, − and + to zoom, the arrow keys to pan, Escape to leave Comment or clear the selection. Below 440px Comment and Fit move into More, below 360px the zoom buttons too.

**StepInspector** · `step-inspector/StepInspector.tsx`  
The settings of one step in an agent workflow, in sections that fold.  
`step: StepConfig` (`title`, `kind: 'trigger' | 'ai' | 'tool' | 'app' | 'output' | 'branch' | 'wait' | 'approval'` (its tile's colour), `icon`, `position`, and by kind: `model`, `instructions` (text and `{ ref }` parts), `tools`, `inputs: { name, ref }[]`, `outputs: { name, type, sample }[]`, `retries`, `backoff: 'fixed' | 'doubling'`, `timeLimit`, `onFail`, `rule: { ref, op, value }`, `yes`, `no`, `approvers`, `askIn`, `shows`, `expire`, `then`, `off`), `sources` (the earlier steps and their fields; a ref is `"<step id>.<field>"`, and one they don't give is flagged), `onChange(step)`, `onTest`, `testing`, `status` / `statusOk` (the line under the name), `choices` (each choice's options), `toolOptions`, `people`, `open` / `defaultOpen` / `onOpenChange` (the open sections), `actions` (more buttons in the head).

**DataPicker** · `data-picker/DataPicker.tsx`  
Map a field from earlier steps into a step's input.  
`sources: { id, title, kind, icon?, fields: { name, type: 'text' | 'number' | 'list' | 'object' | 'bool' | 'date', sample? }[] }[]` (only the steps before this one), `fields` / `defaultFields` / `onFieldsChange` (`{ key, label, refs }[]`, each ref `"<step id>.<field>"`), `step` (the step on top), `open` / `defaultOpen` / `onOpenChange` (the input whose picker is open), `query` / `onQueryChange`, `active` / `onActiveChange` (the highlighted option), `note`. Types and step kinds are coloured; the arrows, Enter and Escape work in the search.

**RunDrawer** · `run-drawer/RunDrawer.tsx`  
A workflow's run under its canvas: the steps, the log and the data.  
`runId`, `label`, `state: 'running' | 'waiting' | 'passed' | 'failed' | 'stopped'`, `time`, `tokens`, `cost`, `steps: { id, title, kind, icon?, input?, output? }[]`, `spans: { id, step, name, kind, icon?, level?: 0 | 1, start, end?, state?: 'ok' | 'bad' | 'wait' | 'stop' }[]` (a kind of `retry` is the hatched wait before a retry), `log: { at, level: 'debug' | 'info' | 'warn' | 'error', title, message? }[]`, `waiting: { step, title, detail? }` with `onApprove` / `onReject`, `onStop`, `onRunAgain`, `tab` / `defaultTab` / `onTabChange`, `level` / `defaultLevel` / `onLevelChange` (the log's filter), `follow` / `defaultFollow` / `onFollowChange`, `expanded` / `defaultExpanded` / `onExpandedChange`, `height` / `defaultHeight` / `onHeightChange`, `selected` / `defaultSelected` / `onSelectedChange`, `canvas` (what sits over the drawer: the steps as a strip by default, `null` for the drawer alone).

**MemoryPanel** · `memory-panel/MemoryPanel.tsx`  
What the agent remembers about your team, editable and removable.  
`title`, `icon`, `kinds: { value, label, color }[]`, `memories` / `defaultMemories` / `onMemoriesChange` (`{ id, kind, text, source?, isNew? }[]`), `filter` / `defaultFilter` / `onFilterChange`, `allLabel`, `countLabel(n)`, `editedSource`, `onEdit`, `onForget`, `onRestore`, `undoFor`, `bare`. Edit in place; Forget leaves an Undo row for a few seconds.

**ModelCompare** · `model-compare/ModelCompare.tsx`  
Run one prompt on three models side by side and keep the best.  
`models: { name, mark, color, markText?, description? }[]`, `columns` / `defaultColumns` / `onColumnsChange` (`{ id, model }[]`), `min` (2), `max` (3), `prompt` / `defaultPrompt` / `onPromptChange`, `asked`, `answers` (per column: `{ state: 'thinking' | 'answering' | 'done', text?, tokens?, seconds?, tokensPerSecond?, cost? }`), `onSend(prompt, columns)`, `onRun(column)`, `chosen` / `defaultChosen` / `onChosenChange`, `placeholder`. The prompt field and Run sit on top and the answers in columns on one surface, stacking below 540px wide; each column's header swaps its model and shows time, tokens and cost once done, the fastest and cheapest a step darker. Use this answer gives the chosen column the accent's tint.

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
An agent app made of the other components: chats down the side, tabs across the top, and New chat with your mark and a greeting over the Composer at the foot. Nothing plays by itself: a chat changes when you change its blocks.  
`conversations: { id, title, state?: 'idle' | 'running' | 'waiting' | 'done', unread?, status?: { state, label, meta?, action?, review? }, context?, blocks, followUps? }[]` (the side list, newest first), `tabs` / `defaultTabs` / `onTabsChange` (`{ key, chat? }[]`, a tab without a chat is New chat; it starts with one), `tab` / `defaultTab` / `onTabChange` (the tab on screen), `onSend({ text, attachments }, conversationId, tabKey)` (null from New chat: return the id of the chat it started and the tab turns into it; nothing is sent while the chat on screen is running), `onFollowUp(text, conversationId)`, `greeting`, `heading`, `workspaces: { name, mark?, color? }[]` with `workspace` / `defaultWorkspace` / `onWorkspaceChange`, `panel: { title, icon?, link?, children } | null` and `onPanelClose` (the panel beside the chat, for an artifact), `model` (beside the context ring), `draft` / `defaultDraft` / `onDraftChange` (each tab keeps its own), `placeholders: { home?, reply?, working? }`, `composer` (the rest of the Composer's props). A block is `{ key, kind, … }`: `'user'` (`text`, `files?`), `'say'` (`text`, pass it as it grows and each word fades in), `'working'` (`text`, a passing line with the thinking mark), `'group'` (`label`, `state: 'running' | 'done'`, `seconds?`, `blocks`: the agent's work under one line, folded a moment after it is done), `'node'` (`node`), or a component's name with its `props`: `'thinking'`, `'tool-call'`, `'permission-gate'`, `'plan-review'`, `'action-log'`, `'run-summary'`, `'live-answer'`, `'source-stack'`, `'artifact-card'`, `'error-recovery'`, `'decision-prompt'`, `'agent-lanes'`, `'change-review'`. `status` drives the Status pill beside the tabs; `review: blockKey` adds a Review button that scrolls to that block, and `context` (0 to 100) fills the ring. Every chat stays mounted, so its components keep their state when you switch. The chat follows new messages until you scroll up. At phone width the chats slide in from the side and the tabs scroll. `npx designme add agent-harness --react` adds the components it uses too.

### Charts and tables

**LineChart** · `line-chart/LineChart.tsx`  
Two series over time with a hover readout and toggles.  
`label`, `series: { key, label, values, color? }[]` (the first is the main line with the fill, the others dashed), `points` (a name per point, for the readout), `axis`, `range`, `unit`, `compareLabel`, `format`, `visible` / `defaultVisible` / `onVisibleChange` (keys; one series always stays on). The lines draw in while the number counts up; hovering shows a readout.

**BarChart** · `bar-chart/BarChart.tsx`  
Weekly agent runs, split by outcome, with a range switch.  
`label`, `series: { label, tipLabel?, color? }[]` (the parts of each bar, in order; the hover readout breaks a bar down by them), `ranges: { key, label, bars: { label, values }[] }[]` (more than one adds the switch), `range` / `defaultRange` / `onRangeChange`, `unit`, `format`, `stacked` (off by default: one bar in the accent with no legend; on, each bar is a stack of its parts in the palette's colours, with a legend).

**DonutChart** · `donut-chart/DonutChart.tsx`  
Where the agent's time went, by kind of task.  
`segments: { label, value, color? }[]`, `label` (under the total), `unit`, `format`, `active` / `defaultActive` / `onActiveChange` (hovering an arc or its row highlights both).

**RadialGoals** · `radial-goals/RadialGoals.tsx`  
Each agent's share of its own target as a ring.  
`goals: { key, label, unit, value, target, color? }[]` (outermost first; past its target a ring goes round again with a marker), `title`, `subtitle`, `ranges` / `range` / `onRangeChange`.

**FunnelChart** · `funnel-chart/FunnelChart.tsx`  
Signup to paid, with the biggest drop called out by the agent.  
`title`, `stages`, `views: { key, label, values, insight? }[]` (more than one adds the switch), `view` / `defaultView` / `onViewChange`, `shareLabel`, `startLabel`, `format`. The biggest drop is marked in red.

**TopPages** · `top-pages/TopPages.tsx`  
Most visited pages with share of traffic and a quick sort.  
`pages: { path, title, views, change, tip? }[]`, `title`, `period`, `site`, `sort` / `defaultSort` / `onSortChange` (`'views' | 'change'`).

**HealthScore** · `health-score/HealthScore.tsx`  
An account's health: a score ring, four factors that open, and the agent's next move.  
`account: { name?, segment?, factors, score?, previous?, suggestion? }` (pass another account, or the same one changed, and the ring sweeps, the score counts and what changed crossfades), with `factors: { key, label, status: 'ok' | 'warn' | 'bad', value, unit?, summary, points, max, detail? }[]` (one row each; the score defaults to the points added up; the weakest factor off track is labelled Weakest; `trend` is still accepted but ignored) and `suggestion: { text, action, icon?, done?, doneText?, doneLabel? }`, `label` ("Account health"), `period` ("30 days"), `bands` (`[70, 50]`: Healthy, Watch, At risk), `verdicts`, `open` / `defaultOpen` / `onOpenChange` (the open factor's key, or null), `onAction(account)` (return a promise to spin until it settles, then pass the account back with `suggestion.done`). Fits a 440px details sheet.

**ScoreBreakdown** · `score-breakdown/ScoreBreakdown.tsx`  
A score whose gauge is split by its weighted factors, with the weakest flagged and a fix to apply.  
`factors: { key, label, weight, earned, note, improvable?, detail? }[]`, `title`, `previous`, `since`, `open` / `defaultOpen` / `onOpenChange`, `onImprove(factor)` (returns `{ text, gain?, to }`), `onApply(factor, proposal)`, `improvingLabel`.

**RadarChart** · `radar-chart/RadarChart.tsx`  
A run against its baseline on five to seven eval scores.  
`axes: { label, short?, value, baseline }[]`, `title`, `subtitle`, `seriesLabels`, `weakBelow` (70), `note`, `pulse` (an axis to call out).

**ScatterChart** · `scatter-chart/ScatterChart.tsx`  
Runs as dots by cost and quality, sized by tokens, with median quadrants and a drag to select.  
`runs: { id, series, x, y, size }[]`, `series: { key, label, color?, shape? }[]`, `xDomain`, `yDomain`, `xTicks`, `yTicks`, `xTitle`, `yTitle`, `formatX`, `formatY`, `formatSize`, `quadrants`, `ringed`, `note`, `selected` / `onSelectedChange`, `onAsk(runs)`.

**ActivityHeatmap** · `activity-heatmap/ActivityHeatmap.tsx`  
When the agent and the team were busy, by day and hour.  
`series: { key, label, values, max, unit, note? }[]` (168 values from 0 to 1, Monday 12am first), `value` / `defaultValue` / `onValueChange`, `title`, `period`. Each cell's tip reads like "Tuesday 9am: 12 runs". In a narrow card (a phone) the grid scrolls sideways in bigger cells, starting at the latest hours.

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
`Buttons({ rows: { label, children }[] })` is the labelled sheet; the file also exports the buttons themselves. `Button`: `variant: 'primary' | 'accent' | 'soft' | 'line' | 'ghost'` (`'ink'`, the old name for `'primary'`, still works), `size: 'sm' | 'md' | 'lg'`, `icon`, `busy` / `busyLabel` / `busyGlyph`, `done` / `doneLabel` / `doneIcon`, `success`, `pressed`, `tip`, `kbd`, `disabled`; an `onClick` that returns a promise runs the button by itself (busy, then done for `doneFor`, then back). `ButtonIcon`: `icon`, `label`, `kbd`, `fill`. `ButtonCopy`: `text`, `label`, `copiedLabel`, `tip`, `onCopy`. `ButtonMenu`: `label`, `items: { key, label, icon? or brand?, detail?, danger?, divider? }[]`, `onSelect(key)`, `status`, `align`, `open` / `defaultOpen` / `onOpenChange`. `ButtonIconMenu`: the same menu from an icon button: `icon`, `label`, `items`, `onSelect(key)`, `status`, `align`, `open` / `defaultOpen` / `onOpenChange`. `ButtonRun`: `state: 'idle' | 'running' | 'stopped' | 'complete'`, `seconds`, `onRun`, `onStop`. `ButtonHold`: `label`, `holdingLabel`, `doneLabel`, `onConfirm` (after holding 1.2s with a pointer, Space or Enter).

**Badge** · `badge/Badge.tsx`  
Labels for plans and status, with a dot, an icon or a remove button.  
`children` (the label), `tone: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'blue' | 'violet' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal'` (text on its own tint; neutral by default), `size: 'sm' | 'md'` (20px or 24px tall), `dot`, `icon` (an icon name or your own element), `onRemove` (adds a remove button named "Remove" and the label), `removeLabel`. Soft draws it as a pill; Blueprint squares it, sets it in capitals and gives it a hairline in its own colour.

**Progress** · `progress/Progress.tsx`  
A run as a ring, steps and a bar, with a meter that warns in words.  
`title`, `state: 'indeterminate' | 'running' | 'paused' | 'error' | 'complete'`, `steps: { label, unit, total }[]`, `step`, `stepProgress` (0 to 1), `valueText`, `error`, `onPause`, `onResume`, `onRetry`, `onRestart`, `meter: { label, value, max, unit?, warnAt?, dangerAt?, dangerLabel?, note? }`.

**Slider**, **RangeSlider**, **SliderGroup** · `slider/Slider.tsx`  
Named stops, ticks, a range and the agent's recommended value.  
`Slider`: `label`, `min`, `max`, `step`, `bigStep`, `value` / `defaultValue` / `onValueChange`, `format`, `names`, `stops: { value, label }[]`, `ticks`, `recommended: { value, label? }`, `description`. `RangeSlider`: `label`, `min`, `max`, `step`, `bigStep`, `value` / `defaultValue` / `onValueChange` (a pair), `format`, `thumbLabels`, `showEnds`.

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

**ColorPicker** · `color-picker/ColorPicker.tsx`  
Pick a colour, check its contrast, and let the agent fix it or make a scale.  
`value` / `defaultValue` / `onValueChange` (hex), `alpha` / `onAlphaChange` (shows the opacity rail), `swatches`, `ink`, `onScale(steps)`. Also exports `contrast`, `parseHex` and `makeScale`.

**SocialSignIn** · `social-sign-in/SocialSignIn.tsx`  
One-tap providers that remember the last one you used.  
`providers: { key, label, brand? or icon? or letters? }[]` (defaults to Google, GitHub, Figma and SSO), `user: { name, initials, color? }`, `lastUsed` / `defaultLastUsed` / `onLastUsedChange`, `signedIn` / `defaultSignedIn` / `onSignedInChange`, `onSignIn(provider)` (return a promise and the button spins; resolving to false stays signed out), `onSignOut`, `onEmail`, `title`, `logo`, `emailLabel`.

**SignIn** · `sign-in/SignIn.tsx`  
Email first, then the one-time code from the email, copied or typed in.  
`email` / `defaultEmail` / `onEmailChange`, `onSendCode(email)` (return a promise to spin; a rejection's message shows under the field), `step` / `defaultStep` / `onStepChange` (`'email' | 'code' | 'done'`), `code` / `defaultCode` / `onCodeChange`, `codeLength`, `onVerify(code, email)` (return false for a wrong code), `inbox` (`{ code, from?, text?, copyLabel?, copiedLabel? }`: the email with the code arrives at the top of the code screen with Copy code) and `onCopyCode(code)`, `resendIn`, `onResend`, `onSignedIn(email)`, and the titles and labels. A pasted or autofilled code spreads over the boxes.

**OtpField** · `otp-field/OtpField.tsx`  
A one-time code, one box per digit, that fills from a paste.  
`value` / `defaultValue` / `onValueChange`, `onComplete(code)` (once every box is filled), `status: 'idle' | 'checking' | 'error' | 'success'` (error shakes the boxes red and typing again starts the code over; success locks them green), `message`, `length` (6 by default, in two halves), `title`, `description`, `icon`, `footer` (like a resend link). The first box asks for `autocomplete="one-time-code"`; Backspace and the arrow keys move between boxes.

**Form** · `form/Form.tsx`  
A project brief with inline checks and an agent that drafts the rest.  
`fields: { key, label, type?: 'text' | 'textarea' | 'choice', placeholder?, maxLength?, rows?, options?, autoComplete?, validate?(value, values) }[]`, `values` / `defaultValues` / `onValuesChange`, `onDraft` (adds "Draft with agent"; drafted fields are marked Drafted beside their label until edited), `onSubmit(values)` (spins while pending; a rejection's message shows beside the button), `title`, `submitLabel`, `invalidMessage`, `draftedMessage`, `doneTitle(values)`, `doneDetail`. A `ref` gives `draft()`, which runs the agent's draft as if the button were pressed.

**PaymentForm** · `payment-form/PaymentForm.tsx`  
Card details with live formatting, brand detection and a clear total.  
`plan`, `description`, `seats`, `seatLabel`, `price`, `currency`, `yearlyDiscount`, `period` / `defaultPeriod` / `onPeriodChange` (`'monthly' | 'yearly'`), `card` / `defaultCard` / `onCardChange` (`{ number, expiry, cvc }`, formatted as typed), `onPay({ card, period, total })` (Processing while pending, then "Payment successful"), `note`. Card details only ever go to `onPay`.

**Carousel** · `carousel/Carousel.tsx`  
Drafts the agent made to keep one of, or a gallery of pictures, on one swipeable track.  
`type: 'variants' | 'images'`. Both: `index` / `defaultIndex` / `onIndexChange` (the first slide in view), `slideWidth` ("80%" for images and "84%" for variants peek the next one in, "100%" shows one at a time, a number is pixels), `align` (`'start'` or `'center'`), `gap`, `arrows` (true), `dots` (true). Variants: `title`, `variants: { key, label, meta?, status: 'queued' | 'generating' | 'ready' | 'failed', image?: { src?, alt, placeholder? }, content?, error? }[]` (a ready `image` comes into focus in a 3:2 frame; `placeholder` is a CSS background drawn under it, like a gradient of its colours; `content` shows anything else instead), `subtitle`, `kept` / `defaultKept` / `onKeptChange`, `onRetry(key)`; Enter on the track keeps the variant in view. Images: `images: { key, src?, alt, title, caption?, placeholder?, width? }[]` (`width` overrides `slideWidth` for that slide), `label` ("Gallery"), `height` (one picture height for slides of mixed widths; otherwise 3:2). It scrolls natively (swipe, trackpad, a mouse drag); Left and Right, Home and End move it when the track has the focus. The track is `lib/carousel.ts`.

### Collaboration

**Comments** · `comments/Comments.tsx`  
A design thread where you can @mention the agent and it replies.  
`title`, `pin`, `comments: { id, author: { name, initials, color, handle? }, text, time, agent?, thinking?, actions?: { label, primary?, onClick }[], resolution?, agrees? }[]` (the first starts the thread, the rest are replies indented under it), `people` (handles for the @ menu), `value` / `defaultValue` / `onValueChange` (the reply), `onSend(text)`, `placeholder`, `resolved` / `defaultResolved` / `onResolvedChange`, `agreed` / `defaultAgreed` / `onAgreedChange` (ids of the comments you agreed with). Each comment's Agree button shows on hover or keyboard focus. An agent reply's words fade in as `text` grows.

**Notifications** · `notifications/Notifications.tsx`  
An inbox where agent updates and mentions arrive live.  
`items` / `defaultItems` / `onItemsChange` (`{ id, kind, text, time, icon? and color?, or avatar?, read? }[]`, newest first), `filters`, `filter` / `defaultFilter` / `onFilterChange`, `title`, `markAllLabel`, `emptyLabel`. A new item drops in at the top and bumps the count.

**Banner** · `banner/Banner.tsx`  
An announcement on a tint of its tone, with its own line drawing and a dismiss.  
`tone: 'accent' | 'neutral' | 'blue' | 'violet' | 'green' | 'amber'` (the tint, and the colour of the eyebrow and the drawing), `art: 'layers' | 'steps' | 'tools' | 'path'` or your own SVG element (shown at 240 by 160 and cropped by its area; give its lines `className="dm-ln"` and `pathLength={1}` to draw them in), or `null` for none, `eyebrow`, `title`, `description`, `action: { label, onClick?, href? }` (the primary button, on the accent), `secondary` (the same, as a quieter link), `onDismiss`, `dismissible`, `open` / `defaultOpen` / `onOpenChange`, `undo` (after a dismiss a line with Undo keeps its place; a string changes its words, `false` leaves nothing), `label`. The drawing draws itself in, and shows at once with reduced motion; in a column narrower than 480px it becomes a strip across the top.

**InviteToCollaborate** · `invite-to-collaborate/InviteToCollaborate.tsx`  
Add teammates by email as chips, set their role, send.  
`emails` / `defaultEmails` / `onEmailsChange`, `draft` / `defaultDraft` / `onDraftChange`, `validate`, `colors`, `roles: { label, detail? }[]`, `role` / `defaultRole` / `onRoleChange`, `suggestions: { email, initials, color }[]`, `members: { key?, name, detail?, initials, color, role, pending? }[]`, `onSend(emails, role)` (return a promise to spin until it settles), `link`, `copyLabel`, `copiedLabel`, `title`, `subtitle`, `placeholder`. Enter, a comma, Tab or a paste makes chips.

**Reactions** · `reactions/Reactions.tsx`  
Quick reactions on an agent update, with counts that pop.  
`author`, `time`, `message`, `icon`, `reactions` / `defaultReactions` / `onReactionsChange` (`{ emoji, count, people?, mine? }[]`), `emojis` (the picker), `meLabel`, `addLabel`. Clicking a reaction toggles yours and the count rolls; tips read like "You, Maya, Jon and 2 more", `bare` (on by default: it sits in the chat with no card; `false` draws the card).

**ProfileMenu** · `profile-menu/ProfileMenu.tsx`  
The account menu behind an avatar: switch workspace, theme, shortcuts and sign out.  
`user: { name, email, initials?, color? }`, `workspaces: { id, name, detail?, initial?, tint? }[]`, `workspace` / `defaultWorkspace` / `onWorkspaceChange`, `context` (the line under the workspace name), `dark` / `defaultDark` / `onDarkChange` (the theme switch only reports; apply the theme yourself), `themeLabel`, `shortcuts: { keys, label }[]` (defaults to the menu's own keys), `shortcutsOpen` / `defaultShortcutsOpen` / `onShortcutsOpenChange`, `signedIn` / `defaultSignedIn` / `onSignedInChange`, `note`, `open` / `defaultOpen` / `onOpenChange`. A `role="menu"` with `menuitemradio` workspaces and a `menuitemcheckbox` theme switch; the arrow keys, Home and End move through it, Escape closes it and gives the focus back to the avatar, and ? opens the shortcuts.

**ContextMenu** · `context-menu/ContextMenu.tsx`  
A menu on right-click, long-press, Shift+F10 or the Menu key, with a submenu.  
`items: { key, label, icon?, shortcut?, checked?, danger?, confirmLabel?, items?, separator? }[]`, `onSelect(key, item)`, `label`, `targetLabel`, `targetClassName`, `children` (what you right-click).

**ContextSwitcher** · `context-switcher/ContextSwitcher.tsx`  
The organisation, project and environment you are in, each part a searchable switcher.  
`segments: { key, label, items, heading?, placeholder?, noun?, plural? }[]` (outermost first; `items` is `{ id, name, badge?: string | { label, tone? }, tile?, isDefault? }[]`, or a function of the parts before it, so picking an organisation brings its projects), `value` / `defaultValue` / `onChange(value, { key, item })` (the id picked in each part, by key; the parts after a pick keep their item if their new list has it, and take its `isDefault` or first item otherwise), `onCreate(key, query)` (adds Create new… at the bottom of each list), `open` / `defaultOpen` / `onOpenChange` (the key of the open part, or null), `query` / `defaultQuery` / `onQueryChange`, `label`. Enter, Space or the down arrow opens a part with the focus in its search; the arrows, Home and End move through the list, typing filters it, Escape gives the focus back, and the left and right arrows move between parts. Narrow, the names shorten with an ellipsis (shown in full in a tooltip); phone narrow, only the last part shows and a … menu holds the others.

**FilterMenu** · `filter-menu/FilterMenu.tsx`  
Add filters from a menu, see them as chips, and watch the count change.  
`fields: { key, label, icon?, operators?, options: { value, label, chip?, glyph? }[] }[]`, `filters` / `defaultFilters` / `onFiltersChange` (`{ field, value, negate? }[]`, one per field), `total`, `count`, `noun`, `countFor(field, value)` (the number beside each value), `results: { id, title, dot?, avatar?, meta? }[]` (the first few matches), `emptyLabel`, `label`, `clearLabel`, `open` / `defaultOpen` / `onOpenChange`. The menu has two steps, a field and then its value; the right and left arrows move between them. Clicking a chip's operator flips it ("is" to "is not"), its × removes it.

**NumberField**, **NumberFieldGroup** · `number-field/NumberField.tsx`  
Type a number or step it with minus and plus, with units, limits and a word when a value is changed to fit.  
`NumberField`: `label`, `min`, `max`, `step`, `bigStep` (10), `value` / `defaultValue` / `onValueChange`, `decimals`, `prefix` ("$"), `unit` ("min"), `valueText(value)`, `hint` (the range by default), `buttonLabels` (["Decrease", "Increase"]). Hold minus or plus to repeat; Up and Down step, Shift or Page Up/Down ten; a typed value is rounded to the step and kept in range on Enter or blur, and the hint says what changed. `NumberFieldGroup`: `title`, `description`, `summary`, `children`.

**TicketList** · `ticket-list/TicketList.tsx`  
Support tickets the agent has triaged, with suggested replies.  
`tickets` / `defaultTickets` / `onTicketsChange` (`{ id, title, from, question?, reply?, priority?: 'urgent' | 'high' | 'normal' | 'low', assignee, waiting, status: 'open' | 'done' }[]`), `filter` / `defaultFilter` / `onFilterChange`, `open` / `defaultOpen` / `onOpenChange`, `onSend(ticket, reply)` (return a promise to spin; the ticket then moves to Solved), `title`, `filterLabels`, `emptyLabel`, `replyLabel`, `editLabel`, `sendLabel`.

**KanbanBoard** · `kanban-board/KanbanBoard.tsx`
A sprint board where you and the agent move cards, with filters, details and keyboard moves.
`title`, `subtitle`, `columns: { key, title, short?, limit?, done? }[]` (`limit` is a WIP limit with a warning chip once it is over; cards in a `done` column show no due date), `members: { id, name, initials, color, agent? }[]` (the facepile, the Assignee filter and each card's people menu), `labels`, `labelTones` (`{ [label]: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal' }`; by default each label takes the next colour in the order of `labels`), `cards` / `defaultCards` / `onCardsChange` (`{ id, code?, column, title, priority?: 'urgent' | 'high' | 'medium' | 'low' | 'none', project?, labels?, assignees?, due? ('YYYY-MM-DD'), subtasks?: { title, done? }[], comments?, attachments?, progress?, activity? }[]`; array order is column order; a card shows its priority as a coloured chip beside a grey `project` chip and its labels; `progress` from 0 to 1 marks the agent's card), `onMove(id, column, index)`, `onChange(card)` (title, priority, people or subtasks changed), `onRename(id, title)`, `open` / `defaultOpen` / `onOpen` (the card in the details sheet), `filters` / `defaultFilters` / `onFiltersChange` (`{ query, assignees, labels, priorities }`), `view` / `defaultView` / `onViewChange` (`'board' | 'list'`), `collapsed` / `defaultCollapsed` / `onCollapsedChange`, `selected` / `defaultSelected` / `onSelectedChange`, `onDraggingChange(dragging)`, `newCard(column)`, `today`, `addLabel`, `column` / `defaultColumn` / `onColumnChange` (the column a board under 640px shows). Drag to move or reorder; click a card for its details and checklist; Shift- or Cmd-click to pick several and move them from the bar; arrows, Enter, Space, m, p, a and F2 from the keyboard.

### Product

**PricingCards** · `pricing-cards/PricingCards.tsx`  
Three plans with a billing switch and a seat slider.  
`plans: { name, description?, price, priceLabel?, unit?, total?, features, action: { label, variant?: 'soft' | 'accent' | 'primary' }, popular?, fromSeats? }[]` (`price` is per editor per month, `0` is free and `null` is "Custom"; the outline moves to a plan once the editors reach its `fromSeats`), `period` / `defaultPeriod` / `onPeriodChange` (`'monthly' | 'yearly'`), `yearlyDiscount`, `seats` / `defaultSeats` / `onSeatsChange`, `minSeats`, `maxSeats`, `seatsLabel`, `popularLabel`, `onChoose(plan, { period, seats })`. Prices roll to their new value.

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
`currencies: { code, name, symbol?, rate, decimals?, flag? }[]` (rates against one base, defaulting to `CurrencyConverterCurrencies`; it never fetches anything), `amount` / `defaultAmount` / `onAmountChange`, `from` / `defaultFrom` / `onFromChange`, `to` / `defaultTo` / `onToChange`, `payLabel`, `seeLabel`, `updated`, `locale`. Swap carries the converted amount over.

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
