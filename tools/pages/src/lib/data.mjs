// Everything the pages show, read at build time from files the site build already writes:
//   tools/pages/data/site.json   sections and cards in page order (from tools/site/build.js)
//   r/<name>.json, r/core.json    the HTML registry: each component's HTML, CSS and JS, and the shared core
//   r/react/<name>.json           the React registry: the component, its CSS and an example
//   tools/pages/content/<name>.json  the written copy for each page
import fs from 'node:fs';
import path from 'node:path';

// the build runs from tools/pages (npm run build), and the bundled copy of this file lives elsewhere, so the folder it runs
// from is the reliable way back to the repository
export const ROOT = path.resolve(process.cwd(), '../..');
if (!fs.existsSync(path.join(ROOT, 'tools/pages/data/site.json'))) throw new Error('run the pages build from tools/pages, after tools/site has built');
export const SITE = 'https://designme.dev';
const read = (...p) => JSON.parse(fs.readFileSync(path.join(ROOT, ...p), 'utf8'));
const maybe = (...p) => { const f = path.join(ROOT, ...p); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; };

const site = read('tools/pages/data/site.json');
export const SETS = site.sets;
export const LOGO = site.logo;
export const SECTIONS = site.sections.map(s => ({ ...s, set:SETS[s.grp], url:`/components/${s.slug}` }));

/* ---- the props of a React component, from its TypeScript interfaces and their doc comments ---- */
function propsOf(src){
  const out = [];
  for (const m of src.matchAll(/(?:\/\*\*([\s\S]*?)\*\/\s*)?export interface (\w+Props)\b([^{]*)\{/g)){
    let i = m.index + m[0].length, depth = 1, start = i;
    while (depth && i < src.length){ const ch = src[i++]; if (ch === '{') depth++; else if (ch === '}') depth--; }
    const body = src.slice(start, i - 1), props = [];
    // walk the members at the top level: an optional /** doc */, then name?: type;
    let j = 0, doc = '';
    while (j < body.length){
      const rest = body.slice(j), ws = rest.match(/^\s+/); if (ws){ j += ws[0].length; continue; }
      if (rest.startsWith('/**')){ const e = rest.indexOf('*/'); doc = rest.slice(3, e).replace(/^\s*\*\s?/gm, '').replace(/\s+/g, ' ').trim(); j += e + 2; continue; }
      if (rest.startsWith('//')){ j += rest.indexOf('\n') + 1 || rest.length; continue; }
      const nm = rest.match(/^(readonly\s+)?([\w$]+)(\?)?\s*:/);
      if (!nm){ j++; continue; }
      let k = nm[0].length, d = 0;
      while (k < rest.length){ const ch = rest[k]; if ('{(['.includes(ch)) d++; else if ('})]'.includes(ch)) d--; else if (ch === ';' && d === 0) break; else if (ch === '\n' && d === 0 && /^\s*(\/\*\*|[\w$]+\??\s*:)/.test(rest.slice(k + 1))) break; k++; }
      props.push({ name:nm[2], optional:!!nm[3], type:rest.slice(nm[0].length, k).trim().replace(/\s+/g, ' '), doc });
      doc = ''; j += k + 1;
    }
    const ext = m[3].match(/extends\s+(.+)/);
    out.push({ name:m[2], doc:(m[1] || '').replace(/^\s*\*\s?/gm, '').replace(/\s+/g, ' ').trim(), extends:ext ? ext[1].trim() : '', props });
  }
  return out;
}

/* ---- one record per component, in page order ---- */
const core = read('r/core.json');
export const CORE = { css:core.files.find(f => f.path.endsWith('.css')).content, js:core.files.find(f => f.path.endsWith('.js')).content };

// how tall each component gets while its demo plays (tools/site/measure-heights.js), widest layout first, phone last
const HEIGHTS = read('tools/site/card-heights.json').components;

export const COMPONENTS = SECTIONS.flatMap(sec => sec.cards.map(card => {
  const html = read('r', card.reg + '.json'), rx = maybe('r/react', card.reg + '.json');
  const f = ext => (html.files.find(x => x.path.endsWith(ext)) || {}).content || '';
  const ifaces = rx ? propsOf(rx.files[0].content) : [];
  // the component's own interface first
  ifaces.sort((a, b) => (b.name === rx?.component + 'Props') - (a.name === rx?.component + 'Props'));
  return {
    ...card, slug:card.reg, url:`/components/${card.reg}`, section:sec,
    html:{ html:f('.html'), css:f('.css'), js:f('.js'), needs:html.dependencies || [] },
    react:rx && { component:rx.component, tsx:rx.files[0].content, css:rx.files[1]?.content || '', tsxPath:rx.files[0].path, cssPath:rx.files[1]?.path, example:rx.example?.content || '', props:ifaces },
    copy:maybe('tools/pages/content', card.reg + '.json'),
    height:(HEIGHTS[card.v2] || [320, 0, 0, 0, 320]),
  };
}));
COMPONENTS.forEach((c, i) => { c.prev = COMPONENTS[(i - 1 + COMPONENTS.length) % COMPONENTS.length]; c.next = COMPONENTS[(i + 1) % COMPONENTS.length]; });

// components whose demo borrows other components' templates and scripts (the Agent harness tells its stories with them)
export function borrows(c){
  const names = new Set([...c.html.js.matchAll(/tplOf\('([\w-]+)'\)|DM\.defs\.([\w$]+)|\bcomp\('([\w-]+)'/g)].map(m => m[1] || m[2] || m[3]));
  return COMPONENTS.filter(x => x !== c && names.has(x.v2));
}

/* ---- the shared core for the demos: Blueprint's square corners and no-blur rules stay inside the demo,
   so the page around it keeps the site's own rounded controls ---- */
export function demoCoreCss(){
  let css = CORE.css;
  const B = ':root:not([data-style="soft"])';
  for (const [a, b] of [
    [`${B} *,${B} *::before,${B} *::after`, `${B} :is(.pg-demo,.tip) *,${B} :is(.pg-demo,.tip) *::before,${B} :is(.pg-demo,.tip) *::after,${B} .tip,${B} .tip::before,${B} .tip::after`],
  ]){
    if (!css.includes(a)) throw new Error('core.css changed: the Blueprint rule to scope is gone');
    css = css.split(a).join(b);
  }
  return css;
}
