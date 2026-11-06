# Astro

> Every component also comes as an Astro component, with the same markup, CSS and script as the HTML version.

Designme.dev docs. The same page with navigation: https://designme.dev/docs/astro

## Add components

### 1. Add them with the CLI

```sh
npx designme add tool-call buttons --astro
```

They land in `src/components/designme`, or `components/designme` when there is no `src` folder. The shared core, `core/designme.css` and `core/core.js`, is added once. Without `--astro`, the CLI says so when it finds an `astro.config` file in the folder you run it from.

Your project:

```text
src/components/designme/
  core/
    designme.css
    core.js
  tool-call/
    ToolCall.astro
    tool-call.css
    tool-call.js
  buttons/
    Buttons.astro
    buttons.css
    buttons.js
```

### 2. Use them in a page

```astro
---
import ToolCall from '../components/designme/tool-call/ToolCall.astro';
import Buttons from '../components/designme/buttons/Buttons.astro';
---
<ToolCall />
<Buttons data-style="soft" class="my-buttons" />
```

The CLI prints the import line for each component. It uses your `@/` alias when your `tsconfig.json` has one, and a path from `src/pages` when it doesn't.

The shadcn CLI can add them too, from `https://designme.dev/r/shadcn/astro/<name>.json`. See [Installation](https://designme.dev/docs/installation.md).

## How they work

### Markup

Each `.astro` file holds the component's markup exactly as the HTML version has it, inside `<Fragment is:raw>`, so Astro leaves it as it is. Its root element is the same `<div data-c>` the HTML version uses.

### Styles

The component imports `core/designme.css` and its own `.css` in its frontmatter. Astro bundles each stylesheet once per page.

### Script

Its `<script>` imports its `.js`, which is the HTML version's script with one line added: it imports the helpers it uses from `core/core.js`, the shared core as an ES module. Astro bundles each script once per page, however many times the component appears.

### Mounting

The core starts each component when it scrolls into view and plays its demo, as on designme.dev. A click, a key or typing inside it stops the demo for good. With Astro's client router (`<ClientRouter />`), the core also starts the components on each page it brings in, and stops the ones it takes away.

A component made of others, like the [Agent harness](https://designme.dev/components/agent-harness.md), imports them and places them hidden on the page, where its script finds their markup. The CLI adds them with it.

## Props

Each component has a typed `Props` interface: every attribute of a `<div>` (Astro's `HTMLAttributes<'div'>`), plus `data-style`. They all go on the component's root element.

| Prop | What it does |
| --- | --- |
| `data-style="soft"` | Draws the component in the Soft style. Leave it out for Blueprint, or for the style set on `<html>` |
| `class` | Added to the root element's own classes |
| `style`, `id`, `aria-*` and the rest | Set on the root element as they are |

`data-style` only takes `"soft"`: Blueprint is what the components draw without it. A component can be Soft on a Blueprint page, but not the other way round. See [Theming](https://designme.dev/docs/theming.md).

## Your own data

The Astro components play the demos from designme.dev. To show your own data, change the component's `.js` (and its markup in the `.astro` file), as you would with the HTML version.

To drive a component from your own state with props, use the React version as an island: `npx astro add react`, then `npx designme add <name> --react`, and hydrate it with a directive such as `client:visible`.

## Style, theme and fonts

- `data-style="soft"` on `<html>` makes every component Soft; on one component, just that one.
- `data-theme="dark"` or `data-theme="light"` on `<html>` fixes the theme. Without it, the components follow the device.
- Load Inter and JetBrains Mono for the full look. Without them, the components fall back to the system font.
- The components use plain class names, as the HTML version does, and CSS variables that start with `--dm-`, so they never meet your page's own. For a shadcn/ui or Tailwind v4 theme, add the theme bridge: `npx designme add --astro --theme-bridge`. See [Installation](https://designme.dev/docs/installation.md).

## More docs

- [Introduction](https://designme.dev/docs/introduction.md): What designme.dev is: free components for AI agent products, in HTML, React or Astro, in two styles with light and dark mode.
- [Installation](https://designme.dev/docs/installation.md): Add components with the designme CLI or the shadcn CLI, as HTML, CSS and JavaScript, React or Astro, and give them your Tailwind v4 theme.
- [Theming](https://designme.dev/docs/theming.md): Switch between Soft and Blueprint, light and dark, and set your own accent and its roles.
- [Accessibility](https://designme.dev/docs/accessibility.md): The roles, keyboard support, touch tap areas, reduced motion and contrast work built into the components.
- [Using with AI](https://designme.dev/docs/using-with-ai.md): Point a coding agent at the Markdown copy of every page and at llms.txt, and prompt it to install components with the CLI.

All components: https://designme.dev/llms.txt
