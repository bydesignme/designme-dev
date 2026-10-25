// Static pages only: every route is written as a file (components/composer.html), which Cloudflare Pages serves at
// /components/composer. Styles are inlined and scripts are plain, so the output is self-contained HTML.
import { defineConfig } from 'astro/config';
import { createRequire } from 'node:module';
// hover styles apply only with a mouse, as on the homepage (tools/site/hover-gate.js), so a tap on a phone never leaves one stuck
const { plugin: hoverGate } = createRequire(import.meta.url)('../site/hover-gate.js');

export default defineConfig({
  site: 'https://designme.dev',
  outDir: './dist',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
  vite: { css: { postcss: { plugins: [hoverGate()] } } },
});
