// Writes the same components as shadcn registry items (https://ui.shadcn.com/schema/registry-item.json), so the shadcn CLI
// can add them too:  npx shadcn@latest add https://designme.dev/r/shadcn/<name>.json         (React)
//                    npx shadcn@latest add https://designme.dev/r/shadcn/astro/<name>.json   (Astro)
//   r/shadcn/core.json, r/shadcn/astro/core.json                 the shared files, a registry dependency of every component
//   r/shadcn/theme-bridge.json, r/shadcn/astro/theme-bridge.json  the opt-in theme bridge
// Every file has a target under the project's components folder (@components/designme/…), laid out as `npx designme add`
// lays them out, so their relative imports hold. Read from r/react and r/astro, which the other scripts write first.
// usage: node scripts/shadcn.mjs   (from packages/astro)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reg = path.resolve(pkg, '../../r');
// where the items are served: designme.dev, or another address to try them from a local server
const BASE = (process.env.DESIGNME_SHADCN_BASE || 'https://designme.dev/r/shadcn').replace(/\/$/, '');
const out = path.join(reg, 'shadcn');
const read = rel => JSON.parse(fs.readFileSync(path.join(reg, rel + '.json'), 'utf8'));
const SCHEMA = 'https://ui.shadcn.com/schema/registry-item.json';
const index = read('index').items;
const bridge = read('theme-bridge');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'astro'), { recursive: true });
const json = (rel, data) => fs.writeFileSync(path.join(out, rel + '.json'), JSON.stringify({ $schema: SCHEMA, ...data }, null, 1) + '\n');
// a file at its place in the flat layout. Every one is a registry:file, which shadcn copies as it is: for code it would otherwise
// reprint it, which drops a file's leading comments (lib/hits.ts starts with // @ts-nocheck)
const fileOf = (p, content) => ({ path: `designme/${p}`, content, type: 'registry:file', target: `@components/designme/${p}` });

for (const fw of ['react', 'astro']){
  const at = fw === 'react' ? '' : 'astro/', url = n => `${BASE}/${at}${n}.json`;
  const core = read(`${fw}/core`);
  json(`${at}core`, {
    name: 'core', type: 'registry:lib', title: `Designme shared core (${fw === 'react' ? 'React' : 'Astro'})`,
    description: fw === 'react' ? 'The tokens, primitives and helpers every designme.dev React component imports: designme.css and lib/.' : 'The tokens, styles and script every designme.dev Astro component imports: core/designme.css and core/core.js.',
    files: core.files.map(f => fileOf(f.path, f.content)),
  });
  for (const it of index){
    const x = read(`${fw}/${it.name}`);
    json(`${at}${it.name}`, {
      name: it.name, type: 'registry:component', title: it.title, description: it.description,
      registryDependencies: [url('core'), ...(x.components || []).map(url)],
      files: x.files.map(f => fileOf(f.path, f.content)),
      docs: fw === 'react'
        ? `import { ${x.component} } from '@/components/designme/${it.name}/${x.component}'. Needs React 19. Soft style: data-style="soft" on <html>; dark mode: data-theme="dark".`
        : `import ${x.component} from '@/components/designme/${it.name}/${x.component}.astro'. Soft style: <${x.component} data-style="soft" /> or data-style="soft" on <html>; dark mode: data-theme="dark" on <html>.`,
    });
  }
  const b = bridge.files.find(f => f.framework === fw);
  const where = fw === 'react' ? 'theme-bridge.css' : 'core/theme-bridge.css';
  json(`${at}theme-bridge`, {
    name: 'theme-bridge', type: 'registry:file', title: 'Designme theme bridge', description: bridge.description,
    files: [fileOf(where, b.content)],
    docs: `Import components/designme/${where} after the components' CSS (for example in your layout). It changes only the designme components.`,
  });
}
console.log(`wrote r/shadcn: core, theme bridge and ${index.length} components, for React and Astro`);
