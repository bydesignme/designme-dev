# Designme components for Astro

Astro versions of the [designme.dev](https://designme.dev) components. They are generated from the site's HTML registry
(`r/*.json`), so each one has the same markup, the same CSS and the same script as the HTML version, run by the same shared
core. Nothing here is written by hand: change a component in `soft-2/index.html` and rebuild.

## Add them to a project

```sh
npx designme add tool-call buttons --astro
```

They land in `src/components/designme` (or `components/designme` when there is no `src`), with the shared core in `core/`:

```astro
---
import ToolCall from '../components/designme/tool-call/ToolCall.astro';
---
<ToolCall />
<ToolCall data-style="soft" class="my-call" />
```

Each component imports `core/designme.css` and its own `.css`, and its `<script>` imports its `.js`, which imports the helpers it
uses from `core/core.js`. Astro bundles each of them once per page, however many components use them. The core mounts every
component when it scrolls into view and plays its demo, as on designme.dev; to show your own data, change its `.js`.

- `data-style="soft"` on a component (or on `<html>`) draws it in Soft; without it, Blueprint.
- `data-theme="dark"` or `"light"` on `<html>` fixes the theme; without it the components follow the device.
- Every other attribute (`class`, `style`, `id`, `aria-*`) goes on the component's root element. The markup inside it is kept
  exactly as it is (`<Fragment is:raw>`).

The components use plain class names, like the HTML version, and every CSS variable they use starts with `--dm-`
(`--dm-accent`, `--dm-muted`, `--dm-rk`), the same names as the React version, so they never meet a page's own variables, such as
a shadcn/ui theme's `--accent` and `--muted`. To give the components your theme's colours and corners, add the theme bridge:
`npx designme add --astro --theme-bridge`.

## Files

- `scripts/sync.mjs` writes `src/` from the HTML registry (whose CSS variables `tools/site/build.js` already writes with `--dm-`): `src/core/` (the core's CSS, and its script as an ES module that
  exports its helpers) and `src/<name>/` (`<Name>.astro`, `<name>.css`, `<name>.js`), plus `playground/src/pages/index.astro`,
  every component on one page, and `manifest.json`.
- `scripts/registry.mjs` writes `r/astro/<name>.json` and `r/astro/core.json` for the CLI.
- `scripts/bridge.mjs` writes the theme bridge (`src/core/theme-bridge.css` and `r/theme-bridge.json`) from the table in
  `tools/site/theme-bridge.js`.
- `scripts/shadcn.mjs` writes shadcn registry items for the React and Astro versions to `r/shadcn/`.

From `tools/site`, `npm run astro` runs all four and builds the playground (`npm run check`), so a component Astro can't
compile stops the build. `npm run dev` here shows the playground.
