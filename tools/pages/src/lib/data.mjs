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
// the foot of the homepage's sidebar: the DesignMe sticker and credit line, and Book a call (tools/site/build.js copies it)
export const SIDE_FOOT = site.sideFoot || '';
// a section lives on the homepage, which lists every component; /components/<section> redirects there (see publish.mjs)
export const SECTIONS = site.sections.map(s => ({ ...s, set:SETS[s.grp], url:`/#${s.id}` }));

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
// the core's tap areas for touch screens (fitHits): every page runs it for its own controls (the sidebar, the menu, the header),
// and a component page's core.js finds it already running and uses it
export const HITS_JS = (() => {
  const a = CORE.js.indexOf('/* ---------- touch: tap areas that never overlap'), end = 'window.dmFitHits = fit; return fit;\n})();', b = CORE.js.indexOf(end, a);
  if (a < 0 || b < 0) throw new Error("core.js: the tap areas' script (fitHits) is gone");
  return '(function(){\n' + CORE.js.slice(a, b + end.length) + '\n})();';
})();

// how tall each card's stage gets while its demo plays, popovers included (tools/site/measure-heights.js), widest layout
// first, the narrowest phone last: the demo keeps that height, as the homepage's cards do. BANDS names each one and the
// screen width it was measured at
const MEASURED = read('tools/site/card-heights.json'), HEIGHTS = MEASURED.heights;
export const BANDS = MEASURED.bands;

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
    height:(HEIGHTS[card.v2] || BANDS.map(() => 420)),
  };
}));
COMPONENTS.forEach((c, i) => { c.prev = COMPONENTS[(i - 1 + COMPONENTS.length) % COMPONENTS.length]; c.next = COMPONENTS[(i + 1) % COMPONENTS.length]; });

// components whose demo borrows other components' templates and scripts (the Agent harness tells its stories with them)
export function borrows(c){
  const names = new Set([...c.html.js.matchAll(/tplOf\('([\w-]+)'\)|DM\.defs\.([\w$]+)|\bcomp\('([\w-]+)'/g)].map(m => m[1] || m[2] || m[3]));
  return COMPONENTS.filter(x => x !== c && names.has(x.v2));
}

/* ---- the shared core for the demos: served as it is installed. Blueprint's sweeping rules (square corners, no blur) reach
   only what the components draw (their [data-c] card, the tooltip), so the page around a demo keeps the site's own rounded
   controls without the demo depending on its stage ---- */
export function demoCoreCss(){
  return CORE.css;
}

// the sidebar's icons: the homepage's own (tools/site/build.js copies them into site.json)
export const ICONS = site.icons || {};
export const icon = (name, cls = '') => {
  if (!ICONS[name]) throw new Error('no icon called ' + name + ': add it to the list in tools/site/build.js');
  return `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">${ICONS[name]}</svg>`;
};

/* ---- the accent's roles in each style and theme, read from the shared core, so the docs show what the code sets ---- */
export const ACCENTS = (() => {
  const blocks = [...CORE.css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]*)\{([^{}]*)\}/g)].map(m => ({ sel:m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim(), body:m[2] }));
  // a block is found by any selector in its list (Soft's tokens also sit on [data-style="soft"]); the last block that sets the
  // property wins, as in the cascade
  const has = (b, sel, prop) => b.sel.split(',').map(x => x.trim()).includes(sel) && new RegExp(`(^|;)\\s*${prop}\\s*:`).test(b.body);
  const get = (sel, prop, base) => {
    const b = blocks.filter(x => has(x, sel, prop)).pop() || (base && blocks.filter(x => has(x, base, prop)).pop());
    if (!b) throw new Error(`core.css: no ${prop} for ${sel}`);
    return b.body.match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`))[1].trim();
  };
  const SEL = {
    soft:{ light:':root', dark:':root[data-theme="dark"]' },
    bp:{ light:':root:not([data-style="soft"])', dark:':root:not([data-style="soft"])[data-theme="dark"]' },
  };
  const out = {};
  for (const [style, themes] of Object.entries(SEL)) for (const [theme, sel] of Object.entries(themes)){
    // Blueprint sets only what differs from the base, so a role it leaves to the base (like the tint, worked out from the
    // accent) is read there, with the accent filled in
    const base = SEL.soft[theme];
    const v = p => { let x = get(sel, p, base); const r = x.match(/^var\((--[\w-]+)\)$/); if (r) x = get(sel, r[1], base);
      return /var\(--accent\)/.test(x) ? x.replace(/var\(--accent\)/g, get(sel, '--accent', base)) : x; };
    out[style + '-' + theme] = { style, theme, surface:v('--surface'), fg:v('--fg'), chip:v('--chip'), line:v('--line'),
      accent:v('--accent'), onAccent:v('--on-accent'), accentFg:v('--accent-fg'), accentMark:v('--accent-mark'), accentBg:v('--accent-bg') };
  }
  return out;
})();

// the site's fonts: Inter and JetBrains Mono, self-hosted. Every page's head has them, and so do the live previews in the docs,
// which are pages of their own inside a frame
export const FONT_CSS = `@font-face{font-family:Inter;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/inter-latin-400-normal.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}\n@font-face{font-family:Inter;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/inter-latin-500-normal.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}\n@font-face{font-family:Inter;font-style:normal;font-weight:600;font-display:swap;src:url(/fonts/inter-latin-600-normal.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}\n@font-face{font-family:Inter;font-style:normal;font-weight:700;font-display:swap;src:url(/fonts/inter-latin-700-normal.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}\n@font-face{font-family:"JetBrains Mono";font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/jetbrains-mono-latin-500-normal.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}`;
