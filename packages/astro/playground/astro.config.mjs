// The playground: every Astro component on one page (src/pages/index.astro, written by scripts/sync.mjs). `npm run check`
// builds it, so a component Astro can't compile stops the build; `npm run dev` shows them all
import { defineConfig } from 'astro/config';
export default defineConfig({ outDir: '../dist', vite: { server: { fs: { allow: ['..'] } } } });
