# Introduction

> Designme.dev is a free library of UI components for products built around AI agents.

Designme.dev docs. The same page with navigation: https://designme.dev/docs/introduction

## What it is

100 free components: 51 for the agent itself, like status pills, reasoning trails, agent trees, permission gates, plan reviews and run costs, and 49 app basics around it.

Every component plays as a demo in the [library](https://designme.dev/library), and has a page of its own with its install command, React props, code and questions.

## Two styles, light and dark

### Soft

Quiet, rounded surfaces with a blue accent. designme.dev opens in Soft in light mode.

### Blueprint

The same components drawn as a technical sheet, with square corners, hairline edges and a lime accent.

Each style has a light and a dark theme. Switch them in the header of any page here. In your own project, two attributes on `<html>` pick them. See [Theming](https://designme.dev/docs/theming.md).

## What is in it

### Conversation

- [Live answer](https://designme.dev/components/live-answer.md)
- [Composer](https://designme.dev/components/composer.md)
- [Artifact card](https://designme.dev/components/artifact-card.md)
- [Rich text editor](https://designme.dev/components/rich-text-editor.md)
- [Answer action bar](https://designme.dev/components/answer-action-bar.md)
- [Response versions](https://designme.dev/components/response-versions.md)
- [Model picker](https://designme.dev/components/model-picker.md)
- [Attachment tray](https://designme.dev/components/attachment-tray.md)
- [Feedback sheet](https://designme.dev/components/feedback-sheet.md)

### Agent status

- [Thinking](https://designme.dev/components/thinking.md)
- [Reasoning trail](https://designme.dev/components/reasoning-trail.md)
- [Agent lanes](https://designme.dev/components/agent-lanes.md)
- [Agent tree](https://designme.dev/components/agent-tree.md)
- [Agent inbox](https://designme.dev/components/agent-inbox.md)
- [Trace view](https://designme.dev/components/trace-view.md)
- [Web search](https://designme.dev/components/web-search.md)
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md)
- [Context meter](https://designme.dev/components/context-meter.md)
- [Run cost](https://designme.dev/components/run-cost.md)
- [Toast stack](https://designme.dev/components/toast-stack.md)
- [Toast](https://designme.dev/components/toast.md)
- [Status pill](https://designme.dev/components/status-pill.md)
- [Step loader](https://designme.dev/components/step-loader.md)
- [Thinking states](https://designme.dev/components/thinking-states.md)

### Review and approve

- [Plan review](https://designme.dev/components/plan-review.md)
- [Permission gate](https://designme.dev/components/permission-gate.md)
- [Decision prompt](https://designme.dev/components/decision-prompt.md)
- [Proposal card](https://designme.dev/components/proposal-card.md)
- [Rewrite toolbar](https://designme.dev/components/rewrite-toolbar.md)
- [Inline text diff](https://designme.dev/components/inline-text-diff.md)
- [Draft review](https://designme.dev/components/draft-review.md)
- [Eval results](https://designme.dev/components/eval-results.md)

### Sources and output

- [Terminal stream](https://designme.dev/components/terminal-stream.md)
- [Citation hover card](https://designme.dev/components/citation-hover-card.md)
- [Source stack](https://designme.dev/components/source-stack.md)
- [Metric insight](https://designme.dev/components/metric-insight.md)
- [Details panel](https://designme.dev/components/details-panel.md)
- [Task table](https://designme.dev/components/task-table.md)

### Workspace

- [Automation canvas](https://designme.dev/components/automation-canvas.md)
- [Canvas toolbar](https://designme.dev/components/canvas-toolbar.md)
- [Data picker](https://designme.dev/components/data-picker.md)
- [Run drawer](https://designme.dev/components/run-drawer.md)
- [Command palette](https://designme.dev/components/command-palette.md)
- [Memory panel](https://designme.dev/components/memory-panel.md)
- [Agent settings](https://designme.dev/components/agent-settings.md)
- [Tools and connections](https://designme.dev/components/tool-connections.md)
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md)
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md)
- [File explorer](https://designme.dev/components/file-explorer.md)
- [Workspace rail](https://designme.dev/components/workspace-rail.md)

### Harness

- [Agent harness](https://designme.dev/components/agent-harness.md)

There are also 49 app basics, like charts, date pickers and forms, for the product around the agent. They are all in the [library](https://designme.dev/library#s-charts).

## HTML, React or Astro

Every component comes in three versions. One is HTML, CSS and JavaScript on a small shared core that holds the tokens, icons and helpers. Another is a typed React component for React 19, with no dependencies beyond React, that works in Next.js, Vite and Astro islands. The third is an Astro component with the same markup, CSS and script as the HTML version.

Whichever you pick, the CLI copies the source into your project, so it is yours to change. See [Installation](https://designme.dev/docs/installation.md) and [Astro](https://designme.dev/docs/astro.md).

## Free and MIT licensed

Use the components in personal and commercial work. The code is MIT licensed, and built by [DesignMe](https://designme.agency).

Avatars, icons, flags, brand logos and fonts keep their own licences. They are listed under Credits in the [designme package on npm](https://www.npmjs.com/package/designme).

## Next steps

- [Installation](https://designme.dev/docs/installation.md): Add components with the designme CLI or the shadcn CLI, as HTML, CSS and JavaScript, React or Astro, and give them your Tailwind v4 theme.
- [Astro](https://designme.dev/docs/astro.md): Add the components to an Astro project as .astro files, with the same markup, CSS and script as the HTML version.
- [Theming](https://designme.dev/docs/theming.md): Switch between Blueprint, Soft and Clean, light and dark, and set your own accent and its roles.
- [Accessibility](https://designme.dev/docs/accessibility.md): The roles, keyboard support, touch tap areas, reduced motion and contrast work built into the components.
- [Using with AI](https://designme.dev/docs/using-with-ai.md): Point a coding agent at the Markdown copy of every page and at llms.txt, and prompt it to install components with the CLI.

## More docs

- [Installation](https://designme.dev/docs/installation.md): Add components with the designme CLI or the shadcn CLI, as HTML, CSS and JavaScript, React or Astro, and give them your Tailwind v4 theme.
- [Astro](https://designme.dev/docs/astro.md): Add the components to an Astro project as .astro files, with the same markup, CSS and script as the HTML version.
- [Theming](https://designme.dev/docs/theming.md): Switch between Blueprint, Soft and Clean, light and dark, and set your own accent and its roles.
- [Accessibility](https://designme.dev/docs/accessibility.md): The roles, keyboard support, touch tap areas, reduced motion and contrast work built into the components.
- [Using with AI](https://designme.dev/docs/using-with-ai.md): Point a coding agent at the Markdown copy of every page and at llms.txt, and prompt it to install components with the CLI.

All components: https://designme.dev/llms.txt
