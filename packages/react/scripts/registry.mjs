// Writes the React registry that `npx designme add <name> --react` reads, next to the site's own registry:
//   r/react/core.json      every shared file (designme.css, lib/*, and the two helpers the examples use)
//   r/react/<name>.json    the component and its CSS, the shared files it needs, and its example
// Files are laid out flat, as the CLI writes them:  <dir>/designme.css, <dir>/lib/*, <dir>/<name>/<Name>.tsx
// usage: node scripts/registry.mjs   (from packages/react)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(pkg, 'src');
const out = path.resolve(pkg, '../../r/react');
const index = JSON.parse(fs.readFileSync(path.resolve(pkg, '../../r/index.json'), 'utf8'));
const read = rel => fs.readFileSync(path.join(src, rel), 'utf8');

/* ---------- the shared files, by their path in the flat layout ---------- */
const core = {};
core['designme.css'] = read('designme.css');
for (const f of fs.readdirSync(path.join(src, 'lib'))) core['lib/' + f] = read('lib/' + f);
// the examples' helpers live in lib too, so an example can sit beside its component
core['lib/useScript.ts'] = read('examples/useScript.ts');
core['lib/Demo.tsx'] = read('examples/Demo.tsx');

/** The shared files a set of files needs, following imports through lib */
const imports = text => [...text.matchAll(/(?:from|import) '([^']+)'/g)].map(m => m[1]).filter(s => s.startsWith('.'));
function needs(files) {
  const found = new Set(), queue = Object.entries(files);
  while (queue.length) {
    const [at, text] = queue.shift();
    for (const spec of imports(text)) {
      const base = path.posix.normalize(path.posix.join(path.posix.dirname(at), spec));
      const hit = [base, base + '.ts', base + '.tsx'].find(p => p in core);
      if (hit && !found.has(hit)) { found.add(hit); queue.push([hit, core[hit]]); }
      else if (!hit && !(base in files) && !Object.keys(files).some(f => f.replace(/\.tsx?$/, '') === base)) throw new Error(`${at}: can't resolve ${spec}`);
    }
  }
  return [...found].sort();
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const json = (name, data) => fs.writeFileSync(path.join(out, name + '.json'), JSON.stringify(data, null, 1) + '\n');
json('core', { name: 'core', framework: 'react', files: Object.entries(core).map(([p, content]) => ({ path: p, content })) });

let n = 0;
for (const item of index.items) {
  const dir = path.join(src, 'components', item.name);
  const tsx = fs.readdirSync(dir).find(f => /^[A-Z].*\.tsx$/.test(f));
  if (!tsx) throw new Error(`${item.name}: no component file`);
  const comp = tsx.replace(/\.tsx$/, '');
  // components sit one folder below the shared files instead of two
  const files = {
    [`${item.name}/${tsx}`]: read(`components/${item.name}/${tsx}`).replaceAll("'../../lib/", "'../lib/").replaceAll("'../../designme.css'", "'../designme.css'"),
    [`${item.name}/${item.name}.css`]: read(`components/${item.name}/${item.name}.css`)
  };
  const example = read(`examples/${item.name}.tsx`)
    .replaceAll(`'../components/${item.name}/${comp}'`, `'./${comp}'`)
    .replaceAll("'./useScript'", "'../lib/useScript'").replaceAll("'./Demo'", "'../lib/Demo'");
  const examplePath = `${item.name}/${comp}.example.tsx`;
  json(item.name, {
    name: item.name, title: item.title, description: item.description, framework: 'react', component: comp,
    needs: needs(files),
    files: Object.entries(files).map(([p, content]) => ({ path: p, content })),
    example: { path: examplePath, content: example, needs: needs({ ...files, [examplePath]: example }) }
  });
  n++;
}
console.log(`wrote r/react: core and ${n} components`);
