import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// the playground shows every component with its example, for working on them locally (npm run dev). It isn't published:
// each component's page on designme.dev shows its demo, its React usage and its code
export default defineConfig({
  root: 'playground',
  base: './',
  plugins: [react()],
  server: { fs: { allow: ['../../..'] } },
  build: { outDir: '../dist', emptyOutDir: true }
});
