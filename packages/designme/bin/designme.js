#!/usr/bin/env node
'use strict';
// designme: copies components from designme.dev into your project, no dependencies
const fs = require('fs'), path = require('path');
const REG = (process.env.DESIGNME_REGISTRY || 'https://designme.dev/r').replace(/\/$/, '');
const args = process.argv.slice(2), cmd = args[0];
const flag = (name, def) => { const i = args.indexOf('--' + name); return i > -1 && args[i + 1] ? args[i + 1] : def; };
const react = args.includes('--react'), astro = !react && args.includes('--astro'), bridge = args.includes('--theme-bridge');
// React and Astro components go where the project keeps its components, the HTML ones into ./designme
const reactDir = fs.existsSync(path.join(process.cwd(), 'src')) ? 'src/components/designme' : 'components/designme';
const outDir = path.resolve(process.cwd(), flag('dir', react || astro ? reactDir : 'designme'));
const c = { dim:s => `\x1b[2m${s}\x1b[0m`, bold:s => `\x1b[1m${s}\x1b[0m`, ok:s => `\x1b[32m${s}\x1b[0m`, err:s => `\x1b[31m${s}\x1b[0m` };

async function get(name){
  const src = `${REG}/${name}.json`;
  if (!/^https?:/.test(REG)) return JSON.parse(fs.readFileSync(src, 'utf8'));
  const r = await fetch(src), missing = `No component called "${name.replace(/^react\//, '')}". Run "npx designme list" to see them all.`;
  if (r.status === 404) throw new Error(missing);
  if (!r.ok) throw new Error(`Could not reach designme.dev (${r.status}). Try again in a moment.`);
  // the site answers an unknown path with its home page, not a 404
  const text = await r.text();
  if (!text.trimStart().startsWith('{')) throw new Error(missing);
  return JSON.parse(text);
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
<body style="min-height:100vh;display:grid;place-items:center;padding:40px;background:var(--dm-stage,#fafafa)">
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
  // a component made of others (the agent harness) brings them along
  const queue = names.map(n => n.toLowerCase()), seen = new Set(queue);
  for (const n of queue){
    try {
      const item = await get('react/' + n);
      for (const d of (examples ? item.example.components : item.components) || []) if (!seen.has(d)){ seen.add(d); queue.push(d); }
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
async function addAstro(names, force){
  const core = await get('astro/core');
  let coreNew = false; for (const f of core.files) coreNew = write(f.path, f.content, force) || coreNew;
  console.log(coreNew ? c.ok('+ ') + 'core ' + c.dim('(tokens, icons and the script that runs the components)') : c.dim('= core already in place'));
  // a component made of others (the agent harness) brings them along
  const queue = names.map(n => n.toLowerCase()), seen = new Set(queue);
  for (const n of queue){
    try {
      const item = await get('astro/' + n);
      for (const d of item.components || []) if (!seen.has(d)){ seen.add(d); queue.push(d); }
      let added = false; for (const f of item.files) added = write(f.path, f.content, force) || added;
      console.log(added ? c.ok('+ ') + c.bold(item.title) + c.dim(`  ${path.relative(process.cwd(), path.join(outDir, item.name))}/`) : c.dim(`= ${item.title} already added, use --force to replace it`));
      if (added) console.log(c.dim(`    import ${item.component} from '${astroImport(path.join(outDir, item.name, item.component + '.astro'))}';`));
    } catch(e){ console.log(c.err('x ') + e.message); process.exitCode = 1; }
  }
  console.log(`\nEach component brings its own styles and script, so importing it is all it takes. It plays its demo from designme.dev; change its .js to show your own data.`);
  console.log(c.dim(`Soft style: <ToolCall data-style="soft" /> or <html data-style="soft">, dark mode: <html data-theme="dark">. Load Inter and JetBrains Mono for the full look.`));
}
// the import to suggest for an Astro component: through the project's @/ alias when it has one, else from a page in src/pages
function astroImport(file){
  const via = importPath(file); if (via.startsWith('@/')) return via;
  const pages = path.join(process.cwd(), 'src', 'pages');
  return fs.existsSync(pages) ? path.relative(pages, file).split(path.sep).join('/') : via;
}
// the theme bridge: the components take their colours and corners from a shadcn/ui or Tailwind v4 theme. Opt-in, so it's only
// added with --theme-bridge
async function addBridge(force){
  const fw = react ? 'react' : astro ? 'astro' : 'html', item = await get('theme-bridge'), f = item.files.find(x => x.framework === fw);
  const at = fw === 'react' ? f.path : 'core/' + f.path, rel = path.relative(process.cwd(), path.join(outDir, at)).split(path.sep).join('/');
  console.log(write(at, f.content, force) ? c.ok('+ ') + 'theme bridge ' + c.dim(rel) : c.dim(`= theme bridge already in place, use --force to replace it`));
  console.log(c.dim(fw === 'html' ? `    <link rel="stylesheet" href="${rel}">  after the components' CSS` : `    import '${fw === 'astro' ? astroImport(path.join(outDir, at)) : importPath(path.join(outDir, at))}';  in your layout, after the components`));
  console.log(c.dim(`    It reads your theme's --background, --foreground, --primary, --border, --radius, --chart-1 to --chart-5 and the rest. Keep data-theme="dark" on <html> in step with .dark.`));
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
  const force = args.includes('--force');
  if (bridge && !names.length) return addBridge(force);
  if (!names.length){ console.log('Name at least one component, for example: npx designme add status-pill'); process.exit(1); }
  if (react || astro){ await (react ? addReact(names, force) : addAstro(names, force)); if (bridge) await addBridge(force); return; }
  const core = await get('core');
  let coreNew = false; for (const f of core.files) coreNew = write(f.path, f.content, force) || coreNew;
  console.log(coreNew ? c.ok('+ ') + 'core ' + c.dim('(tokens, icons and helpers)') : c.dim('= core already in place'));
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
  if (bridge) await addBridge(force);
  if (usesAstro()) console.log(c.dim(`This looks like an Astro project: add --astro for the Astro components.`));
  else if (usesReact()) console.log(c.dim(`This looks like a React project: add --react for the React versions.`));
}
// an Astro project has an astro.config file at its root
function usesAstro(){
  try { return fs.readdirSync(process.cwd()).some(f => /^astro\.config\.(m?js|cjs|m?ts|cts)$/.test(f)); } catch(e){ return false; }
}
function usesReact(){
  try { const p = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')); return !!({ ...p.dependencies, ...p.devDependencies }).react; } catch(e){ return false; }
}
async function list(){
  const idx = await get('index'); let sec = '';
  for (const it of idx.items){ if (it.section !== sec){ sec = it.section; console.log('\n' + c.bold(sec)); } console.log(`  ${it.name.padEnd(26)}${c.dim(it.description)}`); }
  console.log(c.dim(`\n${idx.items.length} components. Add one with: npx designme add <name>, or add --react for React or --astro for Astro`));
}
function help(){
  console.log(`${c.bold('designme')} ${c.dim('free UI components for AI agent products, designme.dev')}

  npx designme add <name...>           copy components into ./designme
  npx designme add <name...> --react   copy the React versions into src/components/designme
  npx designme add <name...> --astro   copy the Astro versions into src/components/designme
  npx designme list                    show every component

  --react          React components (.tsx) for Next.js, Vite and Astro, instead of HTML, CSS and JS
  --astro          Astro components (.astro), with the same markup, CSS and script as the HTML version
  --examples       with --react, add an example beside each component that replays its demo
  --theme-bridge   also add the theme bridge, so the components take a shadcn/ui or Tailwind v4 theme's
                   colours and corners (works without component names too)
  --dir <path>     put them somewhere else
  --force          replace files you already have`);
}
(async () => {
  try {
    if (cmd === 'add') await add(args.slice(1).filter(a => !a.startsWith('--') && a !== flag('dir')));
    else if (cmd === 'list' || cmd === 'ls') await list();
    else help();
  } catch(e){ console.error(c.err(e.message)); process.exit(1); }
})();
