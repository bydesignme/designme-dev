// Everything the pages show, read at build time from files the site build already writes:
//   tools/pages/data/site.json   sections and cards in page order (from tools/site/build.js)
//   r/<name>.json, r/core.json    the HTML registry: each component's HTML, CSS and JS, and the shared core
//   r/react/<name>.json           the React registry: the component, its CSS and an example
//   tools/pages/content/<name>.json  the written copy for each page
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

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
// the designs a card's switch shows (Classic, first unless it says which), for the components that have them
// (tools/site/build.js, designsOf)
const DESIGNS = maybe('tools/pages/data/designs.json') || {};
const MEASURED = read('tools/site/card-heights.json'), HEIGHTS = MEASURED.heights;
export const BANDS = MEASURED.bands;

export const COMPONENTS = SECTIONS.flatMap(sec => sec.cards.map(card => {
  const html = read('r', card.reg + '.json'), rx = maybe('r/react', card.reg + '.json'), ax = maybe('r/astro', card.reg + '.json');
  const f = ext => (html.files.find(x => x.path.endsWith(ext)) || {}).content || '';
  const ifaces = rx ? propsOf(rx.files[0].content) : [];
  // the component's own interface first
  ifaces.sort((a, b) => (b.name === rx?.component + 'Props') - (a.name === rx?.component + 'Props'));
  return {
    ...card, slug:card.reg, url:`/components/${card.reg}`, section:sec,
    html:{ html:f('.html'), css:f('.css'), js:f('.js'), needs:html.dependencies || [] },
    react:rx && { component:rx.component, tsx:rx.files[0].content, css:rx.files[1]?.content || '', tsxPath:rx.files[0].path, cssPath:rx.files[1]?.path, example:rx.example?.content || '', props:ifaces },
    // the Astro version (packages/astro, r/astro): the .astro file the CLI installs beside the HTML version's CSS and script
    astro:ax && { component:ax.component, path:ax.files[0].path, code:ax.files[0].content },
    designs:DESIGNS[card.v2] || null,
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
      return /var\(--dm-accent\)/.test(x) ? x.replace(/var\(--dm-accent\)/g, get(sel, '--dm-accent', base)) : x; };
    out[style + '-' + theme] = { style, theme, surface:v('--dm-surface'), fg:v('--dm-fg'), chip:v('--dm-chip'), line:v('--dm-line'),
      accent:v('--dm-accent'), onAccent:v('--dm-on-accent'), accentFg:v('--dm-accent-fg'), accentMark:v('--dm-accent-mark'), accentBg:v('--dm-accent-bg') };
  }
  return out;
})();

// the site's fonts: Inter and JetBrains Mono, self-hosted. Every page's head has them, and so do the live previews in the docs,
// which are pages of their own inside a frame
export const FONT_CSS = `@font-face{font-family:Inter;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/inter-latin-400-normal.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}\n@font-face{font-family:Inter;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/inter-latin-500-normal.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}\n@font-face{font-family:Inter;font-style:normal;font-weight:600;font-display:swap;src:url(/fonts/inter-latin-600-normal.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}\n@font-face{font-family:Inter;font-style:normal;font-weight:700;font-display:swap;src:url(/fonts/inter-latin-700-normal.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}\n@font-face{font-family:"JetBrains Mono";font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/jetbrains-mono-latin-500-normal.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}`;

/* ---- the marks beside each way to install a component: HTML5, React and Astro, from Simple Icons (CC0; the marks belong to
   their owners), in their brand colours. React's cyan is too light for a mark on white, so light mode takes the darker teal
   react.dev itself uses there (--pg-react) ---- */
export const MARKS = {
  html:'<svg class="cp-mk" viewBox="0 0 24 24" aria-hidden="true"><path fill="#e34f26" d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0z"/><path fill="#fff" d="M8.531 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>',
  react:'<svg class="cp-mk" viewBox="0 0 24 24" aria-hidden="true"><path fill="var(--pg-react)" d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/></svg>',
  astro:'<svg class="cp-mk" viewBox="0 0 24 24" aria-hidden="true"><path fill="#bc52ee" d="M8.358 20.162c-1.186-1.07-1.532-3.316-1.038-4.944.856 1.026 2.043 1.352 3.272 1.535 1.897.283 3.76.177 5.522-.678.202-.098.388-.229.608-.36.166.473.209.95.151 1.437-.14 1.185-.738 2.1-1.688 2.794-.38.277-.782.525-1.175.787-1.205.804-1.531 1.747-1.078 3.119l.044.148a3.158 3.158 0 0 1-1.407-1.188 3.31 3.31 0 0 1-.544-1.815c-.004-.32-.004-.642-.048-.958-.106-.769-.472-1.113-1.161-1.133-.707-.02-1.267.411-1.415 1.09-.012.053-.028.104-.045.165h.002zm-5.961-4.445s3.24-1.575 6.49-1.575l2.451-7.565c.092-.366.36-.614.662-.614.302 0 .57.248.662.614l2.45 7.565c3.85 0 6.491 1.575 6.491 1.575L16.088.727C15.93.285 15.663 0 15.303 0H8.697c-.36 0-.615.285-.784.727l-5.516 14.99z"/></svg>',
};
// the shadcn CLI's address for each component's registry item (packages/astro/scripts/shadcn.mjs writes them)
export const shadcnUrl = (reg, astro = false) => `${SITE}/r/shadcn/${astro ? 'astro/' : ''}${reg}.json`;

// the header's "Your theme" option: the script that puts a pasted shadcn/Tailwind v4 theme over the demos through the theme bridge
// (tools/site/theme-bridge.js), inlined in every page's head so a saved theme is on before the page paints
export const THEME_JS = createRequire(import.meta.url)(path.join(ROOT, 'tools/site/theme-bridge.js')).previewScript({ out:'dm-' });
