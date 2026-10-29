# Introduction

> Designme.dev is a free library of UI components for products built around AI agents.

Designme.dev docs. The same page with navigation: https://designme.dev/docs/introduction

## What it is

108 free components: 68 for the agent itself, like status pills, reasoning trails, tool calls, permission gates, plan reviews and run summaries, and 40 app basics around it.

Every component plays as a demo on the [homepage](https://designme.dev/), and has a page of its own with its install command, React props, code and questions.

## Two styles, light and dark

### Soft

Quiet, rounded surfaces with a blue accent. designme.dev opens in Soft.

### Blueprint

The same components drawn as a technical sheet, with square corners, hairline edges and a lime accent.

Each style has a light and a dark theme. Switch them in the header of any page here. In your own project, two attributes on `<html>` pick them. See [Theming](https://designme.dev/docs/theming.md).

## What is in it

### Conversation

- [Live answer](https://designme.dev/components/live-answer.md)
- [Composer](https://designme.dev/components/composer.md)
- [Thread panel](https://designme.dev/components/thread-panel.md)
- [Artifact card](https://designme.dev/components/artifact-card.md)
- [Rich text editor](https://designme.dev/components/rich-text-editor.md)
- [Tool call](https://designme.dev/components/tool-call.md)
- [Voice capture](https://designme.dev/components/voice-capture.md)
- [Voice orb](https://designme.dev/components/voice-orb.md)
- [Answer action bar](https://designme.dev/components/answer-action-bar.md)
- [Response versions](https://designme.dev/components/response-versions.md)
- [Model picker](https://designme.dev/components/model-picker.md)
- [Prompt starters](https://designme.dev/components/prompt-starters.md)
- [Prompt library](https://designme.dev/components/prompt-library.md)
- [Attachment tray](https://designme.dev/components/attachment-tray.md)
- [Feedback sheet](https://designme.dev/components/feedback-sheet.md)

### Agent status

- [Thinking](https://designme.dev/components/thinking.md)
- [Reasoning trail](https://designme.dev/components/reasoning-trail.md)
- [Agent lanes](https://designme.dev/components/agent-lanes.md)
- [Agent tree](https://designme.dev/components/agent-tree.md)
- [Agent inbox](https://designme.dev/components/agent-inbox.md)
- [Browser session](https://designme.dev/components/browser-session.md)
- [Trace view](https://designme.dev/components/trace-view.md)
- [Run summary](https://designme.dev/components/run-summary.md)
- [Action log](https://designme.dev/components/action-log.md)
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md)
- [Context meter](https://designme.dev/components/context-meter.md)
- [Error and recovery](https://designme.dev/components/error-recovery.md)
- [Run queue](https://designme.dev/components/run-queue.md)
- [Run cost](https://designme.dev/components/run-cost.md)
- [Toast stack](https://designme.dev/components/toast-stack.md)
- [Toast](https://designme.dev/components/toast.md)
- [Status pill](https://designme.dev/components/status-pill.md)
- [Step loader](https://designme.dev/components/step-loader.md)

### Review and approve

- [Change review](https://designme.dev/components/change-review.md)
- [Plan review](https://designme.dev/components/plan-review.md)
- [Permission gate](https://designme.dev/components/permission-gate.md)
- [Hand-off to a person](https://designme.dev/components/human-handoff.md)
- [Decision prompt](https://designme.dev/components/decision-prompt.md)
- [Proposal card](https://designme.dev/components/proposal-card.md)
- [Design tuner](https://designme.dev/components/design-tuner.md)
- [Rewrite toolbar](https://designme.dev/components/rewrite-toolbar.md)
- [Launch checklist](https://designme.dev/components/launch-checklist.md)
- [Inline text diff](https://designme.dev/components/inline-text-diff.md)
- [Draft review](https://designme.dev/components/draft-review.md)
- [Steering](https://designme.dev/components/steering.md)
- [Eval results](https://designme.dev/components/eval-results.md)
- [Design review](https://designme.dev/components/design-review.md)

### Sources and output

- [Code viewer](https://designme.dev/components/code-viewer.md)
- [Terminal stream](https://designme.dev/components/terminal-stream.md)
- [Citation hover card](https://designme.dev/components/citation-hover-card.md)
- [Source stack](https://designme.dev/components/source-stack.md)
- [Field extraction](https://designme.dev/components/field-extraction.md)
- [Metric insight](https://designme.dev/components/metric-insight.md)
- [Details panel](https://designme.dev/components/details-panel.md)
- [Task table](https://designme.dev/components/task-table.md)

### Workspace

- [Automation canvas](https://designme.dev/components/automation-canvas.md)
- [Canvas toolbar](https://designme.dev/components/canvas-toolbar.md)
- [Step library](https://designme.dev/components/step-library.md)
- [Command palette](https://designme.dev/components/command-palette.md)
- [Memory panel](https://designme.dev/components/memory-panel.md)
- [Model compare](https://designme.dev/components/model-compare.md)
- [Agent settings](https://designme.dev/components/agent-settings.md)
- [Tools and connections](https://designme.dev/components/tool-connections.md)
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md)
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md)
- [File explorer](https://designme.dev/components/file-explorer.md)
- [Workspace rail](https://designme.dev/components/workspace-rail.md)

### Harness

- [Agent harness](https://designme.dev/components/agent-harness.md)

There are also 40 app basics, like charts, date pickers and forms, for the product around the agent. They are all in the [library](https://designme.dev/#s-charts).

## HTML or React

Every component comes in two versions. One is HTML, CSS and JavaScript on a small shared core that holds the tokens, icons and helpers. The other is a typed React component for React 19, with no dependencies beyond React, that works in Next.js, Vite and Astro.

Either way, the CLI copies the source into your project, so it is yours to change. See [Installation](https://designme.dev/docs/installation.md).

## Free and MIT licensed

Use the components in personal and commercial work. The code is MIT licensed, and built by [DesignMe](https://designme.agency).

Avatars, icons, flags, brand logos and fonts keep their own licences. They are listed under Credits in the [designme package on npm](https://www.npmjs.com/package/designme).

## Next steps

- [Installation](https://designme.dev/docs/installation.md): Add components to your project with the designme CLI, as HTML, CSS and JavaScript or as React components.
- [Theming](https://designme.dev/docs/theming.md): Switch between Soft and Blueprint, light and dark, and set your own accent and its roles.
- [Accessibility](https://designme.dev/docs/accessibility.md): The roles, keyboard support, touch tap areas, reduced motion and contrast work built into the components.
- [Using with AI](https://designme.dev/docs/using-with-ai.md): Point a coding agent at the Markdown copy of every page and at llms.txt, and prompt it to install components with the CLI.

## More docs

- [Installation](https://designme.dev/docs/installation.md): Add components to your project with the designme CLI, as HTML, CSS and JavaScript or as React components.
- [Theming](https://designme.dev/docs/theming.md): Switch between Soft and Blueprint, light and dark, and set your own accent and its roles.
- [Accessibility](https://designme.dev/docs/accessibility.md): The roles, keyboard support, touch tap areas, reduced motion and contrast work built into the components.
- [Using with AI](https://designme.dev/docs/using-with-ai.md): Point a coding agent at the Markdown copy of every page and at llms.txt, and prompt it to install components with the CLI.

All components: https://designme.dev/llms.txt
