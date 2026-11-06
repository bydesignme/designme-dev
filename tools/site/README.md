# Site build

`index.html` at the root of this repository is generated. It is the original designme.dev page (commit `56e4f0b`) with every
component card swapped for its Soft 2 / Blueprint 2 version from `soft-2/index.html`, plus a few edits to the site's own UI.
The same build writes the HTML registry in `r/` that `npx designme add` downloads.

Don't edit `index.html` or `r/*.json` by hand: the next build overwrites them.

## Where to change things

| To change | Edit |
| --- | --- |
| A component (markup, CSS, demo script) | `soft-2/index.html` |
| The site's own UI (code view, component page, intro, toolbars) | `make-patches.py`, then `npm run patches` |
| Card widths, card order, the React copy in the FAQ and roadmap | `build.js` |
| The React components | `packages/react` (see its README) |
| The Astro components, the shadcn items and the theme bridge | generated: `packages/astro` (see its README); the bridge's table is `theme-bridge.js` |
| The component pages at `/components`, and their written copy | `tools/pages` (see its README) |

Hover styles are gated in the build, not by hand: `hover-gate.js` moves every `:hover` rule into
`@media (hover:hover) and (pointer:fine)`, so a tap on a phone never leaves one stuck. `build.js` runs it on the components'
CSS (and so the registry, `core.css` and the React CSS) and on the site's own, `../pages/astro.config.mjs` runs it on the
pages' styles, and the builds stop if a `:hover` rule is left outside it. Write hover rules as usual.

The original page's stylesheet (with `make-patches.py`'s CSS, in `@layer site`) ships only the rules the site still uses.
`site-css-unused.txt` lists the rest, and `build.js` leaves them out of `index.html`. Its header says how the list was
made. Each line starts with a hash of the rule, so a listed rule that you change ships again. A new rule always ships.

## Build

From this folder:

```sh
npm install          # acorn and postcss
npm run base         # writes site-main.html, the original page, from git history (needs a full clone, not a shallow one)
npm run patches      # only after editing make-patches.py: rewrites site-patches.json
npm run build        # writes ../../index.html, ../../code-data.json, ../../r/*.json, ../../llms.txt and ../../404.html
npm run react        # regenerates the React CSS and registry (r/react) from the new build, and type-checks them
npm run astro        # regenerates the Astro components (packages/astro), r/astro, r/shadcn and the theme bridge, and builds them all
npm run pages        # builds the component pages, their Markdown copies and the sitemap (see ../pages/README.md)
```

After changing a component's size, or adding one, measure the cards again and rebuild:

```sh
PW=$(npm root -g)/playwright node measure-heights.js   # about half an hour; or npm i playwright and leave PW out
ONLY=k,l,m PW=$(npm root -g)/playwright node measure-heights.js   # just those bands (here the phones), keeping the rest
COMPS=run-summary PW=$(npm root -g)/playwright node measure-heights.js   # just those components, keeping every other one
npm run build
```

Add `PW_EXEC=/path/to/chromium` to use a Chromium of your own. `measure-heights.js` plays every component at a series of
widths (1440, where the 1400px layout stops growing, then 1181 and 961; 880, 834, 820, 768, 744 and 641 for tablets; 520,
430, 390 and 360 for phones; each width covers the screens from it up to the next) in both styles, and writes to
`card-heights.json` the tallest each card's stage gets and the tallest each component gets in each style, open lists and
popovers included. Phones and tablets get several widths because a component wraps more on every narrower screen, so a
height measured at one width leaves it off-centre at another. Entrances play eight times as fast while it measures, so a
part still sliding into place doesn't count as height. The build gives every card that height from the start, and the
component its own tallest size inside it, so nothing below a card moves, a component grows downwards instead of creeping
up while it plays, and at its tallest it sits in the middle of its stage, with the same room above and below. The build
warns about a card with no measurement, and the measuring lists anything that reaches above a component or past the sides
of its stage.

The site's sounds are recordings from Kenney's Interface Sounds and UI Audio packs (CC0, in `sounds-src` with their
licences). `make-sounds.py` puts the ones in use into `sounds/ui.wav`, with `sounds/ui.json` saying where each starts and
how loud it plays, and writes the page at `/lab/sounds` that plays each one beside its alternatives. To swap a sound,
change its file in `SET` and run it again (it needs ffmpeg and numpy):

```sh
python3 make-sounds.py
```

`build` stops with an error if a site patch no longer matches exactly once, so a change to the original page can't
slip through unnoticed.

Then check the site locally before pushing:

```sh
cd ../.. && python3 -m http.server 8790
# open http://localhost:8790/ in Blueprint and Soft, light and dark, at desktop and phone widths
```

Pushing `staging` deploys https://staging.designme-dev.pages.dev; `main` deploys https://designme.dev.

## Files

- `build.js` does the build. Its comments explain each step.
- `make-patches.py` writes `site-patches.json`: find-and-replace pairs for the site's own UI, each of which must match
  exactly once, plus the CSS those edits need.
- `site-patches.json` is generated, but committed so a build doesn't need Python.
- `measure-heights.js` writes `card-heights.json`, the height each card keeps, committed for the same reason.
- The build also writes `llms.txt`, a Markdown index of every component for AI tools, and `404.html`, which Cloudflare
  Pages serves with a 404 for any address that isn't a file (without it, every address got the homepage). The 404 page
  knows every component, so a mistyped address like `/composer` offers the Composer page. `robots.txt` is written by
  hand; `sitemap.xml` comes from `tools/pages`. The build also writes `../pages/data/site.json` for those pages, and
  links each card's title on the homepage to its page.
- `site-main.html` is the original page, taken from git and not committed.
