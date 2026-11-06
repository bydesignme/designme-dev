// Writes the Astro versions of the designme.dev components from the HTML registry the site publishes (r/*.json), so the two
// stay one component: the same markup, the same CSS and the same script, run by the same shared core.
//   src/core/designme.css             the shared core's CSS (r/core.json's core.css, as it is)
//   src/core/core.js                  the shared core's script (core.js) as an ES module: the same code, with its helpers exported
//   src/<name>/<Name>.astro           the component: its markup, with a typed Props interface for the root element
//   src/<name>/<name>.css             its own CSS (r/<name>.json, as it is)
//   src/<name>/<name>.js              its own script (r/<name>.json, as it is), importing the core helpers it uses
//   playground/src/pages/index.astro  every component on one page, which `npm run check` builds
// The files are laid out as `npx designme add <name> --astro` writes them, so the registry (scripts/registry.mjs) copies them flat.
// usage: node scripts/sync.mjs   (from packages/astro)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const pkg = path.resolve(here, '..');
const reg = path.resolve(pkg, '../../r');
// acorn comes with the site build (tools/site), which always runs before this
const acorn = createRequire(path.resolve(pkg, '../../tools/site/package.json'))('acorn');
const read = name => JSON.parse(fs.readFileSync(path.join(reg, name + '.json'), 'utf8'));
const file = (item, ext) => item.files.find(f => f.path.endsWith('.' + ext)).content;
const write = (rel, text) => { const p = path.join(pkg, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); };

const COMPONENTS = read('index').items;
const HEAD_CSS = '/* Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync. */\n';
const HEAD_JS = '// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.\n';

/* ---------- names a script declares at its top level ---------- */
function topNames(src){
  const out = new Set(), add = p => {
    if (!p) return;
    if (p.type === 'Identifier') out.add(p.name);
    else if (p.type === 'ObjectPattern') p.properties.forEach(x => add(x.type === 'RestElement' ? x.argument : x.value));
    else if (p.type === 'ArrayPattern') p.elements.forEach(add);
    else if (p.type === 'AssignmentPattern') add(p.left);
    else if (p.type === 'RestElement') add(p.argument);
  };
  for (const st of acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'script' }).body){
    if (st.type === 'VariableDeclaration') st.declarations.forEach(d => add(d.id));
    else if ((st.type === 'FunctionDeclaration' || st.type === 'ClassDeclaration') && st.id) out.add(st.id.name);
  }
  return out;
}
// the names a script uses: every identifier that isn't a property after a dot
function usedNames(src){
  const out = new Set(); let prev = null;
  for (const t of acorn.tokenizer(src, { ecmaVersion: 'latest' })){
    if (t.type.label === 'name' && !(prev && prev.type.label === '.')) out.add(t.value);
    // template literals: the tokenizer gives the ${…} parts as tokens of their own, so they are counted too
    prev = t;
  }
  return out;
}

/* ---------- shared core ---------- */
const core = read('core');
const coreCss = file(core, 'css'), coreJs = file(core, 'js');
const EXPORTS = [...topNames(coreJs)].sort();
write('src/core/designme.css', HEAD_CSS + coreCss);
// The HTML core is a classic script whose top-level names every component's script shares. As a module, Astro bundles it once
// per page however many components use it, and each component's script imports the helpers it uses from it. The core still
// mounts every card ([data-c] with its .stage-in) once the page has loaded, as on designme.dev. It also mounts them when Astro's
// client router (<ClientRouter />) brings in a page without loading it (astro:page-load, which comes after the new page's
// scripts have run), and stops the demos of the cards it took away; a card it has seen already is left as it is
const MOUNT = `document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('i-check')) document.body.insertAdjacentHTML('afterbegin', SPRITE);
  document.body.appendChild(tip);
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ io.unobserve(en.target); DM.mount(en.target); } }), { threshold:.25 });
  // a menu item inside a component can carry a data-c of its own (a colour), so only a card with a stage counts
  $$('[data-c]').filter(card => $(':scope > .stage-in', card)).forEach(card => io.observe(card));
});
`;
if (coreJs.split(MOUNT).length !== 2) throw new Error("core.js: the block that mounts the cards changed; update MOUNT in scripts/sync.mjs");
const MOUNT_ASTRO = `/* ---------- mount: every card (a [data-c] with its .stage-in) starts its component when it scrolls into view, once the page
   has loaded, and again for the cards a page brings in through Astro's client router (astro:page-load) ---------- */
const watched = new Set();
const mountAll = () => {
  if (!document.getElementById('i-check')) document.body.insertAdjacentHTML('afterbegin', SPRITE);
  if (!tip.isConnected) document.body.appendChild(tip);
  // the cards the router took away stop their demos
  for (const card of watched) if (!card.isConnected){ if (card._c) card._c.stop(); watched.delete(card); }
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ io.unobserve(en.target); DM.mount(en.target); } }), { threshold:.25 });
  // a menu item inside a component can carry a data-c of its own (a colour), so only a card with a stage counts
  $$('[data-c]').filter(card => !watched.has(card) && $(':scope > .stage-in', card)).forEach(card => { watched.add(card); io.observe(card); });
};
document.addEventListener('DOMContentLoaded', mountAll);
document.addEventListener('astro:page-load', mountAll);
`;
write('src/core/core.js', HEAD_JS + '// The shared core of designme.dev (core.js), as an ES module: the same code, with its helpers exported for the components\' scripts.\n'
  + '// Only the last block differs: it also mounts the cards a page brings in through Astro\'s client router.\n'
  + coreJs.replace(/\/\* ---------- mount: every card[^\n]*\n/, '').replace(MOUNT, () => MOUNT_ASTRO).replace(/\n?$/, '\n') + `\nexport { ${EXPORTS.join(', ')} };\n`);

/* ---------- components ---------- */
// which component each card id (data-c) belongs to: a few cards have a shorter id than their registry name
const byId = {};
const items = COMPONENTS.map(it => {
  const html = read(it.name), rx = fs.existsSync(path.join(reg, 'react', it.name + '.json')) ? read('react/' + it.name) : null;
  const m = file(html, 'html').match(/^<div class="([^"]*)" data-c="([^"]*)">\n {2}<div class="stage-in">\n([\s\S]*)\n {2}<\/div>\n<\/div>\n$/);
  if (!m) throw new Error(`${it.name}: its markup isn't a card with a stage`);
  if (/<\/Fragment|<script|<style/i.test(m[3])) throw new Error(`${it.name}: markup Astro would not keep as it is`);
  // the React version's name, so both read the same in a project (StatusPill.tsx, StatusPill.astro)
  const comp = rx ? rx.component : it.name.replace(/(^|-)([a-z0-9])/g, (x, a, c) => c.toUpperCase());
  const x = { ...it, comp, cls: m[1].split(' '), id: m[2], markup: m[3].split('\n').map(l => l.replace(/^ {4}/, '')).join('\n'), css: file(html, 'css'), js: file(html, 'js') };
  byId[x.id] = x.name;
  return x;
});
for (const x of items){
  // a component that tells its story with others (Agent harness) finds their markup on the page, so it brings them along,
  // hidden, as designme.dev does
  x.uses = [...new Set([...x.js.matchAll(/tplOf\('([\w-]+)'\)|DM\.defs\.([\w$]+)|\bcomp\('([\w-]+)'/g)].map(m => byId[m[1] || m[2] || m[3]]).filter(n => n && n !== x.name))].sort();
  const own = topNames(x.js), used = usedNames(x.js);
  const imports = EXPORTS.filter(n => used.has(n) && !own.has(n));
  const clash = [...own].filter(n => EXPORTS.includes(n));
  if (clash.length) throw new Error(`${x.name}: declares ${clash.join(', ')}, which the core declares too`);
  write(`src/${x.name}/${x.name}.css`, HEAD_CSS + x.css);
  write(`src/${x.name}/${x.name}.js`, HEAD_JS + (imports.length ? `import { ${imports.join(', ')} } from '../core/core.js';\n` : `import '../core/core.js';\n`) + x.js);
  const lent = x.uses.map(n => items.find(y => y.name === n));
  const rootCls = x.cls.map(c => `'${c}'`).join(', ');
  write(`src/${x.name}/${x.comp}.astro`, `---
${HEAD_JS}// ${x.title}: ${x.description}
// The markup, CSS and script are designme.dev's own, run by the shared core in ../core, which mounts the component when it scrolls
// into view and plays its demo. To show your own data, change ${x.name}.js. The markup is kept exactly as it is (is:raw).
import type { HTMLAttributes } from 'astro/types';
import '../core/designme.css';
import './${x.name}.css';
${lent.map(y => `import ${y.comp} from '../${y.name}/${y.comp}.astro';\n`).join('')}
export interface Props extends HTMLAttributes<'div'> {
  /** "soft" draws it in the Soft style. Leave it out for Blueprint, or for the style set on <html> (data-style="soft") */
  'data-style'?: 'soft';
}
const { class: className, ...rest } = Astro.props;
---
<div class:list={[${rootCls}, className]} data-c="${x.id}" {...rest}>
  <div class="stage-in"><Fragment is:raw>
${x.markup}
  </Fragment></div>
</div>
${lent.length ? `<!-- the components it tells its story with: their markup, hidden, where its script finds it -->
<div hidden aria-hidden="true">
${lent.map(y => `  <${y.comp} />\n`).join('')}</div>
` : ''}<script>
  import './${x.name}.js';
</script>
`);
}
// a component that isn't in the registry any more leaves no folder behind
for (const d of fs.readdirSync(path.join(pkg, 'src'))) if (d !== 'core' && !items.some(x => x.name === d)) fs.rmSync(path.join(pkg, 'src', d), { recursive: true });

/* ---------- the playground: every component on one page ---------- */
write('playground/src/pages/index.astro', `---
${HEAD_JS}${items.map(x => `import ${x.comp} from '../../../src/${x.name}/${x.comp}.astro';`).join('\n')}
---
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Designme for Astro</title>
<style>
body{margin:0;padding:40px 16px;background:var(--dm-stage);color:var(--dm-fg);font-family:var(--dm-sans)}
section{display:grid;justify-items:center;gap:16px;padding:48px 0;border-bottom:1px solid var(--dm-line)}
h2{margin:0;font-size:14px;font-weight:500}
</style>
</head>
<body>
${items.map(x => `<section id="${x.name}"><h2>${x.title}</h2><${x.comp} /></section>`).join('\n')}
</body>
</html>
`);
console.log(`synced core (${EXPORTS.length} exports) and ${items.length} Astro components`);
fs.writeFileSync(path.join(pkg, 'manifest.json'), JSON.stringify(items.map(x => ({ name: x.name, title: x.title, description: x.description, component: x.comp, id: x.id, uses: x.uses })), null, 1) + '\n');
