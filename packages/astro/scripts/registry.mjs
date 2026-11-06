// Writes the Astro registry that `npx designme add <name> --astro` reads, next to the site's own registry and the React one:
//   r/astro/core.json      the shared core: core/designme.css and core/core.js
//   r/astro/<name>.json    the component (<Name>.astro, <name>.css, <name>.js), and the other components it needs (Agent harness)
// Files are laid out flat, as the CLI writes them:  <dir>/core/*, <dir>/<name>/*
// usage: node scripts/registry.mjs   (from packages/astro, after scripts/sync.mjs)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(pkg, 'src');
const out = path.resolve(pkg, '../../r/astro');
const list = JSON.parse(fs.readFileSync(path.join(pkg, 'manifest.json'), 'utf8'));
const read = rel => fs.readFileSync(path.join(src, rel), 'utf8');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const json = (name, data) => fs.writeFileSync(path.join(out, name + '.json'), JSON.stringify(data, null, 1) + '\n');
const CORE = ['core/designme.css', 'core/core.js'];
json('core', { name: 'core', framework: 'astro', files: CORE.map(p => ({ path: p, content: read(p) })) });

for (const x of list){
  const files = [`${x.name}/${x.component}.astro`, `${x.name}/${x.name}.css`, `${x.name}/${x.name}.js`];
  json(x.name, {
    name: x.name, title: x.title, description: x.description, framework: 'astro', component: x.component,
    needs: CORE,
    ...(x.uses.length ? { components: x.uses } : {}),
    files: files.map(p => ({ path: p, content: read(p) }))
  });
}
console.log(`wrote r/astro: core and ${list.length} components`);
