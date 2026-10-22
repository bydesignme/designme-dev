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

## Build

From this folder:

```sh
npm install          # acorn and postcss
npm run base         # writes site-main.html, the original page, from git history (needs a full clone, not a shallow one)
npm run patches      # only after editing make-patches.py: rewrites site-patches.json
npm run build        # writes ../../index.html, ../../code-data.json and ../../r/*.json
npm run react        # regenerates the React CSS, registry (r/react) and preview from the new build
```

After changing a component's size, or adding one, measure the cards again and rebuild:

```sh
PW=$(npm root -g)/playwright node measure-heights.js   # about five minutes; or npm i playwright and leave PW out
npm run build
```

`measure-heights.js` plays every component at the narrowest width of each layout (1400, 1181, 961, 641 and 360px) in
both styles and writes the tallest each card's stage and each component get to `card-heights.json`. The build gives every
card that height from the start, and the component its own tallest size inside it, so nothing below a card moves and a
component grows downwards instead of creeping up while it plays. The build warns about a card with no measurement.

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
- `site-main.html` is the original page, taken from git and not committed.
