# designme

Free UI components for AI agent products, 122 of them (72 agent components plus 50 app basics), from [designme.dev](https://designme.dev). Each one comes as plain HTML, CSS and JavaScript, as a React component or as an Astro component, in two styles, Blueprint and Soft, with light and dark mode.

```
npx designme add status-pill thinking composer
npx designme list
```

Needs Node 18 or later.

Components land in `./designme`, with the shared core added once. Every component gets a `demo.html` you can open straight away. Every CSS variable they use starts with `--dm-` (`--dm-accent`, `--dm-muted`), as in the React and Astro versions, so they never meet your page's own.

## React

Every component also comes as a typed React component for Next.js, React (Vite) and Astro:

```
npx designme add status-pill thinking composer --react
```

They land in `src/components/designme` (or `components/designme` when there is no `src`), with only the shared files they need: `designme.css` and a few helpers in `lib/`. Each component imports its own styles, so importing it is all it takes:

```tsx
import { StatusPill } from '@/components/designme/status-pill/StatusPill';

<StatusPill state="reading" label="Reading Figma frames" meta="2 of 4" />
```

Needs React 19. Add `--examples` for a `.example.tsx` beside each component that replays its demo from designme.dev. Every class, CSS variable and animation name starts with `dm-`, so they sit beside Tailwind, shadcn/ui or your own CSS without clashing.

## Astro

Every component also comes as an Astro component, with the same markup, CSS and script as the HTML version:

```
npx designme add tool-call buttons --astro
```

They land in `src/components/designme` (or `components/designme` when there is no `src`), with the shared core in `core/`. Each component brings its own styles and script, so importing it is all it takes:

```astro
---
import ToolCall from '../components/designme/tool-call/ToolCall.astro';
---
<ToolCall data-style="soft" />
```

`data-style="soft"` draws one in the Soft style; without it, Blueprint. Any other attribute, like `class` or `style`, goes on its root element. The component plays its demo from designme.dev; change its `.js` to show your own data.

## shadcn CLI

The React and Astro versions are also shadcn registry items:

```
npx shadcn@latest add https://designme.dev/r/shadcn/tool-call.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/tool-call.json
```

## Theme bridge

`--theme-bridge` also adds `theme-bridge.css`, which gives the components the colours and corners of a shadcn/ui or Tailwind v4 theme (`--background`, `--foreground`, `--primary`, `--border`, `--radius`, `--chart-1` and the rest). Load it after the components' CSS. It is opt-in: without it the components keep their own look.

```
npx designme add --astro --theme-bridge
```

## Options

- `--react` React components instead of HTML, CSS and JavaScript
- `--astro` Astro components instead of HTML, CSS and JavaScript
- `--theme-bridge` also add the theme bridge (works without component names too)
- `--examples` with `--react`, an example beside each component
- `--dir <path>` put them somewhere else
- `--force` replace files you already have

Docs: [designme.dev/docs](https://designme.dev/docs). Source and issues: [github.com/bydesignme/designme-dev](https://github.com/bydesignme/designme-dev).

Built by [DesignMe](https://designme.agency). MIT licence.

## Credits

The components you add bring country flags from flag-icons (MIT) and brand marks from Simple Icons (CC0) and Devicon (MIT), plus Google's own Gmail and Drive logos. Brand names and logos belong to their owners. The full list is in [NOTICE.md](https://github.com/bydesignme/designme-dev/blob/main/NOTICE.md).
