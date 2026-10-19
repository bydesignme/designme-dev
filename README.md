# designme.dev

Free UI components for AI agent products, built by DesignMe. Live at https://designme.dev.

- `index.html` is the whole site, with every component's HTML, CSS and JavaScript inside it.
- `r/` is the component registry the `designme` npm package downloads from (`npx designme add <name>`).
- `r/react/` is the React registry, generated from `packages/react` by `npm run registry` there (`npx designme add <name> --react`).
- `packages/designme/` is the source of that npm package.
- `packages/react/` holds the React versions of every component and their preview page.
- `_headers`, `robots.txt`, `sitemap.xml`, `og.png` and the favicons are served as they are by Cloudflare Pages.

Every push to `main` deploys to Cloudflare Pages. The `lab-wip` branch keeps the parked Lab page.

MIT licence, see `LICENSE` for the licence and third-party credits.
