# Working on designme.dev

Standing decisions from the owner. Read them before changing anything, and check new work against them. They apply to
every session and every agent.

## Process
- Work on `staging`. Touch `main` only when the owner says "push live". No pull requests unless asked.
- Push in small batches and say what changed.
- Never ask for npm credentials. Don't make the repository public without the owner's say-so.
- Every claim in copy or docs must be true of the code.
- Don't copy other component libraries' designs, layouts, copy or mascots. Use standard UX patterns, not creative ones.
- Change only what was asked. If a change would bring back or alter something the owner didn't mention (a layout,
  a nav, a colour), ask first.

## Brand
- The DesignMe wordmark is fixed: never redraw, retype or restyle its letters. Use its existing vector paths as they
  are. Logo work may only change the ".dev" part, add an icon beside it, or show the same paths as an outline (a
  "blueprint" of the logo).

## Site structure
- Site navigation lives in the left sidebar: Library (the homepage, selected), Docs, Changelog, Roadmap and FAQ.
  There is no top nav in the header on any page. The header holds the logo, the GitHub stars pill, the style switch and
  the theme switch.
- The sidebar is the same on every page (homepage, Changelog, Roadmap, FAQ, Docs, component pages): the search field,
  the site links, the compact component groups, and the "work with us" CTA pinned bottom left. Moving between pages
  only moves the active state; nothing in the sidebar jumps or disappears.
- Hover and active fills in the sidebar are light and quiet. Don't make them darker or more saturated.
- The homepage is the component library. There is no separate components page.

## Layout
- Cards (a border, a fill, padding) are only for things you can click. Facts, requirements, frameworks, notes and
  descriptions are plain text or a plain list, one under another, with no card, border or padding.
- In-page links (tables of contents, section anchors) scroll smoothly, and not at all with reduced motion.

## Type and colour
- All text is 14px or smaller, and nothing is heavier than weight 500. Page titles (`.pg-h1`) are the one exception.
- No monospace fonts in the interface, keyboard hints included. Code blocks and inline code are the exception.
- Soft is the site's default style; Blueprint's default accent is lime `#d4f84a`. Primary buttons use the accent, with
  `--on-accent` icons and text on accent fills: dark on Blueprint's lime, white on Soft's blue.
- Greys: one neutral scale for the site chrome and Soft (no blue-tinted greys anywhere). Blueprint keeps its warm greys
  as their own named set.
- Primary buttons are `.pill.primary` (on the accent). There are no ink buttons for now.
- Accents have roles: `--accent` fills, `--accent-fg` text (4.5:1), `--accent-mark` lines, rings and chart marks (3:1),
  `--accent-bg` / `--sel` tints. Charts follow the accent.
- Every colour pairing must pass a contrast check before it ships: text 4.5:1 (WCAG 2) and APCA Lc 60 or more for
  small text, marks 3:1. Choose text on a fill with APCA; WCAG 2 alone picks black on saturated mid-tones like violet,
  which is hard to read.
- Highlights like "Everyone is free" use the accent tint (`--sel` with the accent as text), not a solid accent fill.

## Spacing and radius
- Use the spacing tokens (4px scale) and radius tokens for new and changed CSS. Existing off-scale values are snapped
  later in a separate pass, one category at a time, with before/after screenshots for the owner to review.

## Components
- Installed code must look like its style with no wrapper: Blueprint with no `data-style`, Soft with
  `data-style="soft"`. Nothing may depend on a page's demo stage.
- Demos (scripted autoplay) stop for good the moment a person clicks, focuses or types inside the component, and stay
  stopped until Animate/replay is pressed.
- Every component sits centred in its stage at every moment: its tallest state, its end state, and closed dropdowns.
  End states that are shorter keep their height with `hold()` / `release()`. Dropdowns use `centre()`: the closed field
  sits centred and glides up as its list opens.
- Each component ships in HTML (`soft-2/index.html`) and React (`packages/react`), with its docs copy in
  `tools/pages/content/<id>.json`. Change all three together.

## QA before every push
- Both styles (Soft and Blueprint), light and dark, at 1440, 768, 390 and 360.
- No console errors and no sideways scroll.
- The type rules above.
- Centring checked at every settled moment, not only the tallest one.
- Card heights re-measured (`COMPS=<ids> node tools/site/measure-heights.js`) when a component's height changes.

## Build
From `tools/site`: `npm run patches` (when `make-patches.py` changed), `npm run build`, `npm run react`, `npm run pages`.
`index.html`, `components/` and `docs/` are generated: edit the sources, not the output.
