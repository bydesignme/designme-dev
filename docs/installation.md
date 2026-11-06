# Installation

> Add components with the designme CLI, as HTML, React or Astro. It copies their source into your project, so you own it.

Designme.dev docs. The same page with navigation: https://designme.dev/docs/installation

## Before you start

### Node 18 or later

To run the CLI.

### React 19

For the React components.

### An Astro project

For the Astro components. We build and test them with Astro 7.3.

Find a component's install name on its page, or list them all:

```sh
npx designme list
```

## Add components

### HTML, CSS and JavaScript

#### 1. Add them

```sh
npx designme add status-pill thinking composer
```

Each component lands in its own folder in `./designme`, with its `.html`, `.css` and `.js`. The shared core, `core/core.css` and `core/core.js`, is added once. Every component also gets a `demo.html` you can open straight away.

Your project:

```text
designme/
  core/
    core.css
    core.js
  status-pill/
    status-pill.html
    status-pill.css
    status-pill.js
    demo.html
  thinking/
    thinking.html
    thinking.css
    thinking.js
    demo.html
  composer/
    composer.html
    composer.css
    composer.js
    demo.html
```

#### 2. Load them in a page

Load the core and the component's files, and copy in the markup from its `.html`:

```html
<link rel="stylesheet" href="designme/core/core.css">
<link rel="stylesheet" href="designme/status-pill/status-pill.css">

<!-- the markup from designme/status-pill/status-pill.html -->

<script src="designme/core/core.js"></script>
<script src="designme/status-pill/status-pill.js"></script>
```

#### 3. Give them your data

The core renders each component when it scrolls into view and plays its demo. To feed one your own data, change its `.js`, or use the React version, which takes props.

Every CSS variable the components use starts with `--dm-` (`--dm-accent`, `--dm-muted`), as in React, so they never meet your page's own, like a shadcn/ui theme's `--accent` and `--muted`.

### React

#### 1. Add them

```sh
npx designme add status-pill thinking composer --react
```

They land in `src/components/designme`, or `components/designme` when there is no `src` folder. Only the shared files they need come with them: `designme.css` and a few helpers in `lib/`.

Your project:

```text
src/components/designme/
  designme.css
  lib/
    cx.ts
    hits.ts
    hooks.ts
    icons.tsx
    motion.tsx
    popover.tsx
  status-pill/
    StatusPill.tsx
    status-pill.css
  thinking/
    Thinking.tsx
    thinking.css
  composer/
    Composer.tsx
    composer.css
```

#### 2. Import them

Each component imports its own styles, so importing it is all it takes:

```tsx
import { StatusPill } from '@/components/designme/status-pill/StatusPill';

<StatusPill state="reading" label="Reading Figma frames" meta="2 of 4" />
```

#### 3. Drive them from your state

Every component takes `className`. Anything a person can change has a controlled pair, like `value` and `onValueChange`, and a `default…` prop for leaving it to the component. Each component's page lists its props.

Load Inter and JetBrains Mono for the full look. Without them, the components fall back to the system font.

Every class, CSS variable and animation name starts with `dm-` (`.dm-panel`, `--dm-accent`), so the components sit beside Tailwind, shadcn/ui or your own CSS without clashing.

### Astro

#### 1. Add them

```sh
npx designme add status-pill thinking composer --astro
```

They land in `src/components/designme`, or `components/designme` when there is no `src` folder, with the shared core in `core/`. Each component is an `.astro` file with the HTML version's `.css` and `.js` beside it.

Your project:

```text
src/components/designme/
  core/
    designme.css
    core.js
  status-pill/
    StatusPill.astro
    status-pill.css
    status-pill.js
  thinking/
    Thinking.astro
    thinking.css
    thinking.js
  composer/
    Composer.astro
    composer.css
    composer.js
```

#### 2. Use them in a page

Each component brings its own styles and script, so importing it is all it takes:

```astro
---
import StatusPill from '../components/designme/status-pill/StatusPill.astro';
---
<StatusPill />
<StatusPill data-style="soft" />
```

It plays its demo from designme.dev. To show your own data, change its `.js`. See [Astro](https://designme.dev/docs/astro.md).

## shadcn CLI

Every component is also a shadcn registry item, in its React and Astro versions, so the shadcn CLI can add it to a project set up for shadcn/ui (one with a `components.json`):

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/status-pill.json
```

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/astro/status-pill.json
```

The files land in a `designme` folder in your components folder (the `components` alias in `components.json`), laid out as the designme CLI lays them out. The shared core comes along as a registry dependency, and a component made of others, like the Agent harness, brings them too. The files are copied as they are.

## Theme bridge

The theme bridge is a small CSS file that gives the components the colours and corners of a shadcn/ui or Tailwind v4 theme. It is opt-in: without it, the components keep their own look.

```sh
npx designme add status-pill --astro --theme-bridge
npx designme add --react --theme-bridge   # just the bridge
```

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/theme-bridge.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/theme-bridge.json
```

It lands beside the shared core: `designme/core/theme-bridge.css` for HTML, `src/components/designme/core/theme-bridge.css` for Astro and `src/components/designme/theme-bridge.css` for React. Load it after the components' CSS, for example in your layout:

```astro
---
import '../components/designme/core/theme-bridge.css';
---
```

It reads these variables from your theme and sets our tokens from them, the same names in HTML, React and Astro, on the components only, never on the rest of the page:

| Your theme | Our tokens |
| --- | --- |
| `--background` | `--dm-page`, `--dm-stage` |
| `--card` | `--dm-surface`, `--dm-wash` |
| `--popover` | `--dm-raised` |
| `--foreground` | `--dm-fg`, `--dm-fg2`, `--dm-hover`, `--dm-press`, `--dm-row` |
| `--muted-foreground` | `--dm-fg2`, `--dm-muted` |
| `--border` | `--dm-line`, `--dm-rail` |
| `--input` | `--dm-field-line` |
| `--ring` | `--dm-field-line-strong`, `--dm-focus` |
| `--secondary` | `--dm-chip`, `--dm-soft`, `--dm-dis-fill`, `--dm-hover`, `--dm-press`, `--dm-wash` |
| `--primary` | `--dm-accent`, `--dm-accent-fg`, `--dm-accent-mark`, `--dm-accent-2`, `--dm-accent-bg`, `--dm-sel` |
| `--primary-foreground` | `--dm-on-accent`, `--dm-accent-2` |
| `--destructive` | `--dm-bad` |
| `--chart-1` | `--dm-c1` |
| `--chart-2` | `--dm-c2` |
| `--chart-3` | `--dm-c3` |
| `--chart-4` | `--dm-c4` |
| `--chart-5` | `--dm-c5` |
| `--radius` | `--dm-r-card`, `--dm-r-lg`, `--dm-r-in`, `--dm-r-box`, `--dm-r-box-sq`, `--dm-r-sm`, `--dm-r-field`, `--dm-r-field-sq`, `--dm-r-xs`, `--dm-r-tag`, `--dm-r-tag-sq` |

- Dark mode: a shadcn theme sets its dark values on `.dark`, and the bridge passes them on. Keep `data-theme="dark"` on `<html>` in step with `.dark`, so the components' other tokens, like the status colours and shadows, switch too.
- Corners: `--radius` sets Soft's named radii. Blueprint keeps its square corners, and the corners a component works out from `--dm-rk` keep Soft's own scale.
- Contrast: the accent's text and marks take your `--primary` as it is, so check that it reads on your cards.
- Your theme's own `--accent`, `--muted` and the rest stay as they are for your page: our tokens all start with `--dm-`.

On designme.dev, pick Your theme in the style switch in the header (or in the menu on a phone) to paste a theme: the demos on the homepage and on the component pages preview with it through the same bridge. It stays in your browser. While a pasted theme is on, the accent picker is hidden, as it would do nothing; Reset in the panel forgets the theme and brings it back.

## Frameworks

### Next.js

App Router: every component file starts with `'use client'`, so you can render them from server components.

Pages Router: import `designme.css` and each component's `.css` in `pages/_app.tsx`, and delete the two CSS imports at the top of those components.

### React with Vite

Nothing extra to set up.

### Astro

Use the Astro components (`--astro`), which need no integration. See [Astro](https://designme.dev/docs/astro.md).

Or use the React components as islands: add the React integration with `npx astro add react`, and hydrate the components that change over time, for example with `client:visible`.

## Options

| Option | What it does |
| --- | --- |
| `--react` | React components instead of HTML, CSS and JavaScript |
| `--astro` | Astro components instead of HTML, CSS and JavaScript |
| `--theme-bridge` | Also add the theme bridge. Works without component names too |
| `--examples` | With `--react`, an example beside each component that replays its demo from designme.dev |
| `--dir <path>` | Put the files somewhere else |
| `--force` | Replace files you already have |

The CLI downloads each component from designme.dev and skips files that are already there. `--force` replaces them with the current version, including any changes you made.

## More docs

- [Introduction](https://designme.dev/docs/introduction.md): What designme.dev is: free components for AI agent products, in HTML, React or Astro, in two styles with light and dark mode.
- [Astro](https://designme.dev/docs/astro.md): Add the components to an Astro project as .astro files, with the same markup, CSS and script as the HTML version.
- [Theming](https://designme.dev/docs/theming.md): Switch between Soft and Blueprint, light and dark, and set your own accent and its roles.
- [Accessibility](https://designme.dev/docs/accessibility.md): The roles, keyboard support, touch tap areas, reduced motion and contrast work built into the components.
- [Using with AI](https://designme.dev/docs/using-with-ai.md): Point a coding agent at the Markdown copy of every page and at llms.txt, and prompt it to install components with the CLI.

All components: https://designme.dev/llms.txt
