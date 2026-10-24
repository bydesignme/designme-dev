# Component pages

The pages beside the homepage, built with Astro: a page per component (`/components/composer`), a Markdown copy of each
(`/components/composer.md`) for AI tools, the docs (`/docs/introduction` and its `.md`), the sitemap and `_redirects`. The homepage lists every component, so there is no
separate list: `/components` redirects to it, and each old section page (`/components/status`) to its section there
(`/#s-status`).

The homepage itself is still built by `tools/site`. These pages read what that build writes, so build it first:

```sh
cd ../site && npm run build      # writes ../pages/data/site.json, the sections and cards in page order
cd ../pages && npm install
npm run build                    # builds into dist/, then copies components/ and sitemap.xml to the repository root and writes _redirects
```

(or `npm run pages` from `tools/site`). Cloudflare Pages serves the repository as it is, so the built pages are committed,
like `index.html`.

## What each page shows

- The live demo: the same HTML, CSS and JS that `npx designme add` installs, on the shared core. Blueprint's square
  corners stay inside the demo, so the page around it keeps the site's rounded controls (`demoCoreCss` in `src/lib/data.mjs`).
  The demo keeps the tallest the component gets (`tools/site/card-heights.json`), so nothing below it moves.
- Install commands, the written copy, usage in React, the props table (read from the component's TypeScript interfaces and
  their doc comments), the code, questions, the other components in its section, and previous and next.
- JSON-LD: the component as source code, its breadcrumbs, and its questions.

## Pictures

`shots.mjs` photographs every component from its own page once its demo has played, in the Soft style: a 640×400
thumbnail in light and dark for the cards (`public/components/thumbs`) and a 1200×630 picture for shared links
(`public/components/og`). They are committed. Take them again after a component's look changes, then build:

```sh
npm run build                                       # the pages the pictures are taken from
PW=$(npm root -g)/playwright node shots.mjs [names] # about 15 minutes for all 80; or npm i playwright and leave PW out
npm run build
```

## The written copy

`content/<name>.json` holds each page's own text: a summary, when to use it, what it does, accessibility facts and
questions. Every claim has to be true of the component's code; edit these files to change the text. A component without a
file still gets a page, with its one-line description.

## Files

- `src/lib/data.mjs` reads everything the pages show.
- `src/layouts/Page.astro` is the frame: head, header, footer, light and dark. The header has no links, like the
  homepage's: the logo leads home, and the site's pages are in the sidebar.
- `src/components/SiteShell.astro` lays out a docs page and a component page the same way: the sidebar (`SideNav.astro`:
  Library, Docs, Changelog, Roadmap and FAQ with the homepage's icons, then every component group), the page, and On this
  page on the right on wide screens. The page you're on gets a light fill and a short segment on the rail its list hangs
  from. Below 960px the sidebar becomes a menu above the page.
- `src/components/ComponentPage.astro` is the page under `/components/<name>`.
- `src/components/DocsPage.astro` is a docs page under `/docs/<page>`. Its text and visuals are blocks in `src/lib/docs.mjs`
  (titles and order in `src/lib/docs-list.json`, which `tools/site/build.js` also reads for `llms.txt`), drawn by
  `DocsBlocks.astro`: steps, tabs, file trees, the groups, live previews of a component in both styles, and the accent's
  roles (read from the shared core, so they match the code). Every claim there has to be true of the code, as with the
  written copy. `src/pages/docs/[slug].md.ts` writes their Markdown copies.
- `src/pages/components/[slug].md.ts` writes the Markdown copies;
  `src/pages/components/assets/` the shared core for the demos; `src/pages/sitemap.xml.ts` the sitemap.
- `shots.mjs` takes the pictures (see above).
- `publish.mjs` copies the build (`components/`, `docs/` and `sitemap.xml`) to the repository root and stops if the build holds
  anything it doesn't expect.

Astro is pinned to 7.3.8, the newest release that runs on Node 22.12.
