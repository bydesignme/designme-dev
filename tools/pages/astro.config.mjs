// Static pages only: every route is written as a file (components/composer.html), which Cloudflare Pages serves at
// /components/composer. Styles are inlined and scripts are plain, so the output is self-contained HTML.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://designme.dev',
  outDir: './dist',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
