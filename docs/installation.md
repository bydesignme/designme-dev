# Installation

> Add components with the designme CLI. It copies their source into your project, so you own it.

Designme.dev docs. The same page with navigation: https://designme.dev/docs/installation

## Before you start

### Node 18 or later

To run the CLI.

### React 19

For the React components.

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

> Every class, CSS variable and animation name starts with `dm-`, so the components sit beside Tailwind, shadcn/ui or your own CSS without clashing.

## Frameworks

### Next.js

App Router: every component file starts with `'use client'`, so you can render them from server components.

Pages Router: import `designme.css` and each component's `.css` in `pages/_app.tsx`, and delete the two CSS imports at the top of those components.

### React with Vite

Nothing extra to set up.

### Astro

Add the React integration with `npx astro add react`. Hydrate the components that change over time, for example with `client:visible`.

## Options

| Option | What it does |
| --- | --- |
| `--react` | React components instead of HTML, CSS and JavaScript |
| `--examples` | With `--react`, an example beside each component that replays its demo from designme.dev |
| `--dir <path>` | Put the files somewhere else |
| `--force` | Replace files you already have |

The CLI downloads each component from designme.dev and skips files that are already there. `--force` replaces them with the current version, including any changes you made.

## More docs

- [Introduction](https://designme.dev/docs/introduction.md): What designme.dev is: free components for AI agent products, in HTML or React, in two styles with light and dark mode.
- [Theming](https://designme.dev/docs/theming.md): Switch between Soft and Blueprint, light and dark, and set your own accent and its roles.
- [Accessibility](https://designme.dev/docs/accessibility.md): The roles, keyboard support, touch tap areas, reduced motion and contrast work built into the components.
- [Using with AI](https://designme.dev/docs/using-with-ai.md): Point a coding agent at the Markdown copy of every page and at llms.txt, and prompt it to install components with the CLI.

All components: https://designme.dev/llms.txt
