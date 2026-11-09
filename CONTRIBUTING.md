# Contributing

Thanks for helping. Bug reports, fixes and component ideas are all welcome.

- Report a bug or ask for a component with the [issue forms](https://github.com/bydesignme/designme-dev/issues/new/choose).
- Report a security issue privately, as [SECURITY.md](SECURITY.md) says. Not in a public issue.
- Everyone here follows the [code of conduct](CODE_OF_CONDUCT.md).

## How the repository works

designme.dev is a static site. Cloudflare Pages serves this repository as it is, so the built files are committed.
Pushing `staging` deploys https://staging.designme-dev.pages.dev, and `main` deploys https://designme.dev. Open pull
requests against `staging`.

### Sources and generated files

Edit the sources. The build overwrites the generated files, so a change made there by hand is lost.

| To change | Edit |
| --- | --- |
| A component's markup, CSS or demo script | `soft-2/index.html` |
| A React component | `packages/react/src/components/<name>/<Name>.tsx` |
| A component's docs copy (summary, use, features, accessibility, questions) | `tools/pages/content/<id>.json` |
| The site's own UI (code view, component page, toolbars) | `tools/site/make-patches.py`, then `npm run patches` |
| Card widths, card order | `tools/site/build.js` |
| The component and docs pages | `tools/pages/src` (see `tools/pages/README.md`) |
| The CLI | `packages/designme/bin/designme.js` |

Each component ships in HTML (`soft-2/index.html`) and React (`packages/react`), with its docs copy in
`tools/pages/content/<id>.json`. Change all three together.

Generated, don't edit by hand:

- `index.html` and `assets/` (its styles and scripts), `404.html`, `llms.txt` and `code-data.json`
- `r/`: the HTML registry, plus `r/react`, `r/astro`, `r/shadcn` and `r/theme-bridge.json`
- `components/`, `docs/`, `sitemap.xml` and `_redirects`
- `packages/astro/src` and `packages/astro/manifest.json`
- In `packages/react`: each component's `.css`, `src/designme.css`, `src/index.ts`, and the icon, logo, flag and
  hit-area files in `src/lib` (the sync writes a "Generated" header on each)
- `tools/site/site-patches.json`, `tools/site/card-heights.json` and the pictures in
  `tools/pages/public/components` (generated, but committed so a build doesn't need Python or a browser)

Written by hand and served as they are: `_headers`, `robots.txt`, `og.png` and the favicons.

## Build

You need Node 22.12 or later (Astro 7.3.8 needs it), Python 3 for `npm run patches`, and a full clone, not a shallow
one: the build reads the original page from git history.

From `tools/site`:

```sh
npm install
npm run base      # once: writes site-main.html, the original page, from commit 56e4f0b (ignored by git)
npm run patches   # only after editing make-patches.py: rewrites site-patches.json
npm run build     # ../../index.html and ../../assets, code-data.json, r/*.json, llms.txt and 404.html
npm run react     # the React CSS and r/react, with a type check
npm run astro     # packages/astro, r/astro, r/shadcn and the theme bridge, then builds them all
npm run pages     # the component and docs pages, their Markdown copies and the sitemap
```

Run `npm install` once in `packages/react`, `packages/astro` and `tools/pages` before `react`, `astro` and `pages`.

`build` stops with an error if a site patch no longer matches exactly once, so a change to the original page can't slip
through. Hover rules are moved into `@media (hover:hover) and (pointer:fine)` by the build (`hover-gate.js`), so write
them as usual. CSS variables get their `--dm-` prefix only when the registry is written (`token-prefix.js`); the site's
own source keeps the short names.

### Other tools

- Card heights: after a component's height changes, measure it again, then rebuild:
  `COMPS=<ids> PW=$(npm root -g)/playwright node measure-heights.js` (from `tools/site`, needs Playwright).
- Component pictures: `PW=$(npm root -g)/playwright node shots.mjs [names]` from `tools/pages`, after a component's look
  changes.
- Sounds: `python3 make-sounds.py` from `tools/site` (needs ffmpeg and numpy).
- Carousel and Image generation photos (Pexels): `python3 art/get-photos.py` from the root (needs Pillow with WebP).

`tools/site/README.md`, `tools/pages/README.md`, `packages/react/README.md` and `packages/astro/README.md` explain each
part in more detail.

## Check before you push

Serve the repository and look at your change:

```sh
python3 -m http.server 8790   # from the repository root, then open http://localhost:8790/
```

- Both styles (Soft and Blueprint), light and dark, at 1440, 768, 390 and 360 px wide.
- No console errors and no sideways scroll.
- Text is 14px or smaller and no heavier than weight 500 (page titles are the exception).
- Each component sits centred in its stage at every settled moment, not only at its tallest.
- Card heights measured again when a component's height changed.
- Installed code looks like its style with no wrapper: Blueprint with no `data-style`, Soft with `data-style="soft"`.

The full design rules (colour, contrast, focus, fields, radius, demos) are in [.claude/CLAUDE.md](.claude/CLAUDE.md).
Every claim in docs or copy has to be true of the code.

## Proposing a component

1. Open a [component request](https://github.com/bydesignme/designme-dev/issues/new?template=component_request.yml)
   first, so we can agree on what it does before anyone builds it.
2. Use standard UX patterns. Don't copy another library's design, layout or copy.
3. A finished component has its HTML, CSS and demo script in `soft-2/index.html`, a React version in
   `packages/react` with typed props, and a docs copy in `tools/pages/content/<id>.json`, in both styles, light and
   dark.
4. Run the whole build, measure its card height, and check it as above.

## Releases

The CLI (`packages/designme`) is published to npm by GitHub Actions (`.github/workflows/publish.yml`) when a GitHub
release is published. npm trusts that workflow (trusted publishing), so there is no npm token in the repository. Bump
`version` in `packages/designme/package.json`, then publish a release whose tag is that version with a `v` in front
(`v1.0.0` for 1.0.0); the workflow stops if they don't match.

## Licence

By contributing, you agree that your work is released under the repository's [MIT licence](LICENSE).
