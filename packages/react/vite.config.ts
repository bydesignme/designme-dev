import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// the preview page builds into preview/, which Cloudflare serves next to the site
export default defineConfig({
  root: 'playground',
  base: './',
  plugins: [react()],
  build: { outDir: '../preview', emptyOutDir: true }
});
