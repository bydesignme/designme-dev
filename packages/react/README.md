# Designme components for React

React versions of the [designme.dev](https://designme.dev) components, for Next.js, React (Vite) and Astro. You copy the source into your project, the way shadcn/ui works, so it is yours to change.

They use the same markup and the same CSS as the site, so they look and move exactly like the previews on designme.dev, in both styles (Blueprint and Soft) and in light and dark. The difference is that each one takes props, so you drive it from your own state instead of a scripted demo.

Ported so far: Status pill, Step loader, Reasoning trail, Thinking, Context meter.

Preview: https://staging.designme-dev.pages.dev/packages/react/preview/

## Add them to a project

Needs React 19. Works in client components, React Server Component pages (Next.js App Router) and Astro islands.

1. Copy `src/` into your project, for example as `components/designme/`.
2. Import the styles once, near the root of your app: `designme.css`. Each component imports its own small CSS file itself.
3. Load Inter and JetBrains Mono (the components fall back to the system font if you don't).
4. Pick the look on `<html>`: Blueprint is the default, `data-style="soft"` switches to Soft, and `data-theme="dark"` or `data-theme="light"` fixes the theme (otherwise it follows the device).

Every class, CSS variable and animation name starts with `dm-` (`.dm-panel`, `--dm-accent`, `dm-enter`), so the components sit next to Tailwind, shadcn/ui or your own CSS without either side changing the other. To retheme them, override the variables, for example `:root { --dm-accent: #7c3aed }`.

```tsx
import { StatusPill } from '@/components/designme';

<StatusPill state="reading" label="Reading Figma frames" meta="2 of 4" />
```

### Next.js (App Router)

```tsx
// app/layout.tsx
import '@/components/designme/designme.css';
```

Every component file starts with `'use client'`, so you can render them straight from server components. With `next/font`, set the families on `<html>` or override `--dm-sans` and `--dm-mono` in your own CSS.

On the Pages Router, Next.js only allows global CSS in `pages/_app.tsx`, so import `designme.css` and each component's `.css` file there.

### React with Vite

```tsx
// src/main.tsx
import './components/designme/designme.css';
```

### Astro

Add the React integration (`npx astro add react`), import the styles in your layout, and hydrate the components that change over time:

```astro
---
import '../components/designme/designme.css';
import { StatusPill, ContextMeter } from '../components/designme';
---
<StatusPill state="done" label="Done" meta="4 files changed" />   <!-- static, no JavaScript -->
<ContextMeter client:visible rows={rows} model="Opus 5.5" />      <!-- interactive -->
```

## Components

### StatusPill

One live line for what the agent is doing. It fades between states and resizes to fit them.

| Prop | Type | |
|---|---|---|
| `state` | `'idle' \| 'thinking' \| 'reading' \| 'working' \| 'waiting' \| 'done'` | Glyph and colour. Running states shimmer |
| `label` | `string` | What is happening |
| `meta` | `string` | Quiet detail like `"2 of 4"`. Changes without restarting the pill |
| `file` | `{ name, type? }` | A file chip, like `{ name: 'PricingCard.tsx', type: 'tsx' }` |
| `action` | `{ label, onClick }` | A button for when the agent needs the person |
| `progress` | `number` | 0 to 100, the track along the bar variant |
| `variant` | `'pill' \| 'bar'` | |

### StepLoader

Named steps with a progress track. The row opens a list of every step.

`steps: { label, done? }[]`, `current: number` (steps.length means finished), `loader: 'radar' | 'dots' | 'ring' | 'bars'`, `doneLabel`, `open` / `defaultOpen` / `onOpenChange`.

### ReasoningTrail

The agent's plan, notes, sources and edits in one panel that folds away.

`running`, `seconds` (counts by itself when left out), `title`, `plan: { label, detail?, state: 'done' | 'now' | 'next' }[]`, `notes: string[]`, `sources: { label, kind?, tip? }[]`, `edits: { file, detail?, removed?, added? }[]`, `defaultTab`, `bare` (flat in a thread, the default), `open` / `defaultOpen` / `onOpenChange`.

### Thinking

The live trace, written step by step, then folded away.

`steps: { label, state: 'running' | 'done' | 'dead', mark?: 'dot' | 'search' | 'hollow', sub?, sources?, moreSources? }[]`, `running`, `seconds`, `summary`, `collapseWhenDone`, `open` / `defaultOpen` / `onOpenChange`. Change a step's `label` when it finishes and it crossfades.

### ContextMeter

A ring beside the model name that opens a small usage popover, like the one in Claude.

`rows: { key, label, percent, detail?, tip?, action? }[]` (context window, session limit, weekly, or any other limit), `ring` (defaults to the first row), `title`, `model`, `effort`, `onViewUsage`, `open` / `defaultOpen` / `onOpenChange`. A row turns amber from 90%.

## Examples

`src/examples/demos.tsx` rebuilds the animated previews from designme.dev with these components. They are a good place to see how to drive each one from state.

## Keeping in step with the site

The CSS and the icons are generated from the site's component registry, so a design change on designme.dev reaches these components with one command:

```sh
npm install      # only needed for the preview and the type check
npm run sync     # copies the latest styles and icons from ../../r
npm run check    # type check
npm run build    # rebuilds preview/
```
