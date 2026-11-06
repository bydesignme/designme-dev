// Writes the Tailwind v4 / shadcn theme bridge (the table is tools/site/theme-bridge.js), an opt-in file:
//   src/core/theme-bridge.css   the HTML and Astro version, beside the core
//   r/theme-bridge.json         what `npx designme add --theme-bridge` reads: the HTML and Astro file, and the React one (dm- names)
// usage: node scripts/bridge.mjs   (from packages/astro)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const pkg = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { bridge, NAMES } = createRequire(import.meta.url)('../../../tools/site/theme-bridge.js');
const html = bridge({ out: 'dm-' }), react = bridge({ out: 'dm-', scope: '[data-dm]' });
fs.writeFileSync(path.join(pkg, 'src/core/theme-bridge.css'), html);
fs.writeFileSync(path.resolve(pkg, '../../r/theme-bridge.json'), JSON.stringify({
  name: 'theme-bridge', title: 'Theme bridge',
  description: `Opt-in: the components take their colours and corners from a shadcn/ui or Tailwind v4 theme (${NAMES.map(n => '--' + n).join(', ')}).`,
  files: [
    { path: 'theme-bridge.css', framework: 'html', content: html },
    { path: 'theme-bridge.css', framework: 'astro', content: html },
    { path: 'theme-bridge.css', framework: 'react', content: react }
  ]
}, null, 1) + '\n');
console.log(`wrote the theme bridge: ${NAMES.length} theme variables`);
