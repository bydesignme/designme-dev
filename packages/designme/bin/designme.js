#!/usr/bin/env node
'use strict';
// designme: copies components from designme.dev into your project, no dependencies
const fs = require('fs'), path = require('path');
const REG = (process.env.DESIGNME_REGISTRY || 'https://designme.dev/r').replace(/\/$/, '');
const args = process.argv.slice(2), cmd = args[0];
const flag = (name, def) => { const i = args.indexOf('--' + name); return i > -1 && args[i + 1] ? args[i + 1] : def; };
const react = args.includes('--react');
// React components go where a React project keeps its components, the HTML ones into ./designme
const reactDir = fs.existsSync(path.join(process.cwd(), 'src')) ? 'src/components/designme' : 'components/designme';
const outDir = path.resolve(process.cwd(), flag('dir', react ? reactDir : 'designme'));
const c = { dim:s => `\x1b[2m${s}\x1b[0m`, bold:s => `\x1b[1m${s}\x1b[0m`, ok:s => `\x1b[32m${s}\x1b[0m`, err:s => `\x1b[31m${s}\x1b[0m` };

async function get(name){
  const src = `${REG}/${name}.json`;
  if (!/^https?:/.test(REG)) return JSON.parse(fs.readFileSync(src, 'utf8'));
  const r = await fetch(src);
  if (r.status === 404) throw new Error(`No component called "${name}". Run "npx designme list" to see them all.`);
  if (!r.ok) throw new Error(`Could not reach designme.dev (${r.status}). Try again in a moment.`);
  return r.json();
}
function write(file, content, force){
  const p = path.join(outDir, file);
  if (fs.existsSync(p) && !force) return false;
  fs.mkdirSync(path.dirname(p), { recursive:true }); fs.writeFileSync(p, content); return true;
}
function demo(item){
  const s = item.name;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${item.title}, Designme</title>
<link rel="stylesheet" href="../core/core.css">
<link rel="stylesheet" href="${s}.css">
</head>
<!-- Add data-style="soft" to <html> for the Soft style, and data-theme="dark" for dark mode -->
<body style="min-height:100vh;display:grid;place-items:center;padding:40px;background:var(--stage,#fafafa)">
<main class="stage-inner">
${item.files.find(f => f.path.endsWith('.html')).content}
</main>
<script src="../core/core.js"></script>
<script src="${s}.js"></script>
</body>
</html>
`;
}
async function addReact(names, force){
  const core = await get('react/core'), shared = Object.fromEntries(core.files.map(f => [f.path, f.content]));
  const examples = args.includes('--examples'), wrote = new Set();
  for (const n of names){
    try {
      const item = await get('react/' + n.toLowerCase());
      let added = false; for (const f of item.files) added = write(f.path, f.content, force) || added;
      const needs = examples ? item.example.needs : item.needs;
      for (const p of needs) if (!wrote.has(p)){ wrote.add(p); if (write(p, shared[p], force)) console.log(c.ok('+ ') + p + c.dim('  shared')); }
      if (examples) write(item.example.path, item.example.content, force);
      console.log(added ? c.ok('+ ') + c.bold(item.title) + c.dim(`  ${path.relative(process.cwd(), path.join(outDir, item.name))}/`) : c.dim(`= ${item.title} already added, use --force to replace it`));
      if (added) console.log(c.dim(`    import { ${item.component} } from '${importPath(path.join(outDir, item.name, item.component))}';`));
    } catch(e){ console.log(c.err('x ') + e.message); process.exitCode = 1; }
  }
  console.log(`\nNeeds React 19. Each component imports its own styles, so importing it is all it takes.`);
  console.log(c.dim(`Soft style: <html data-style="soft">, dark mode: <html data-theme="dark">. Load Inter and JetBrains Mono for the full look.`));
  console.log(c.dim(examples ? `Each component has a .example.tsx beside it that replays its demo from designme.dev.` : `Add --examples to get a .example.tsx beside each component that replays its demo.`));
}
// the import line to suggest: through the project's @/ alias when it has one (Next.js sets it up), else from the project root
function importPath(file){
  try {
    const ts = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'tsconfig.json'), 'utf8').replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, '').replace(/,(\s*[}\]])/g, '$1'));
    const to = ts.compilerOptions?.paths?.['@/*']?.[0];
    if (to){ const base = path.resolve(process.cwd(), ts.compilerOptions.baseUrl || '.', to.replace(/\*$/, '')), rel = path.relative(base, file); if (!rel.startsWith('..')) return '@/' + rel.split(path.sep).join('/'); }
  } catch(e){}
  return './' + path.relative(process.cwd(), file).split(path.sep).join('/');
}
async function add(names){
  if (!names.length){ console.log('Name at least one component, for example: npx designme add status-pill'); process.exit(1); }
  const force = args.includes('--force');
  if (react) return addReact(names, force);
  const core = await get('core');
  let coreNew = false; for (const f of core.files) coreNew = write(f.path, f.content, force) || coreNew;
  console.log(coreNew ? c.ok('+ ') + 'core ' + c.dim('(tokens, icons, sound and helpers)') : c.dim('= core already in place'));
  for (const n of names){
    try {
      const item = await get(n.toLowerCase());
      let added = false; for (const f of item.files) added = write(f.path, f.content, force) || added;
      write(`${item.name}/demo.html`, demo(item), force);
      console.log(added ? c.ok('+ ') + c.bold(item.title) + c.dim(`  ${path.relative(process.cwd(), path.join(outDir, item.name))}/`) : c.dim(`= ${item.title} already added, use --force to replace it`));
    } catch(e){ console.log(c.err('x ') + e.message); process.exitCode = 1; }
  }
  const rel = path.relative(process.cwd(), outDir) || '.';
  console.log(`\nOpen ${rel}/<component>/demo.html to see it working, then copy the markup into your page with:`);
  console.log(c.dim(`  <link rel="stylesheet" href="${rel}/core/core.css">  and each component's .css`));
  console.log(c.dim(`  <script src="${rel}/core/core.js"></script>  then each component's .js`));
  console.log(c.dim(`Soft style: <html data-style="soft">, dark mode: <html data-theme="dark">`));
  if (usesReact()) console.log(c.dim(`This looks like a React project: add --react for the React versions.`));
}
function usesReact(){
  try { const p = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')); return !!({ ...p.dependencies, ...p.devDependencies }).react; } catch(e){ return false; }
}
async function list(){
  const idx = await get('index'); let sec = '';
  for (const it of idx.items){ if (it.section !== sec){ sec = it.section; console.log('\n' + c.bold(sec)); } console.log(`  ${it.name.padEnd(26)}${c.dim(it.description)}`); }
  console.log(c.dim(`\n${idx.items.length} components. Add one with: npx designme add <name>, or add --react for React`));
}
function help(){
  console.log(`${c.bold('designme')} ${c.dim('free UI components for AI agent products, designme.dev')}

  npx designme add <name...>           copy components into ./designme
  npx designme add <name...> --react   copy the React versions into src/components/designme
  npx designme list                    show every component

  --react        React components (.tsx) for Next.js, Vite and Astro, instead of HTML, CSS and JS
  --examples     with --react, add an example beside each component that replays its demo
  --dir <path>   put them somewhere else
  --force        replace files you already have`);
}
(async () => {
  try {
    if (cmd === 'add') await add(args.slice(1).filter(a => !a.startsWith('--') && a !== flag('dir')));
    else if (cmd === 'list' || cmd === 'ls') await list();
    else help();
  } catch(e){ console.error(c.err(e.message)); process.exit(1); }
})();
