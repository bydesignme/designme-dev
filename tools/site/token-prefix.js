'use strict';
/* The installed components' CSS variables start with --dm-, as the React version's do (packages/react/scripts/sync.mjs), so they
   never meet a page's own: a shadcn/ui or Tailwind v4 page sets --accent, --muted, --border and the like on :root, and the
   core's tokens would overwrite them, or the page's theirs (owner, 4 Nov). The site keeps its own names: build.js runs this on
   what it writes to the registry (r/*.json, r/core.json) and on code-data.json only, so index.html is unchanged, and everything
   built from the registry (the component pages, the Astro components, the shadcn items) gets the --dm- names.
     css   every custom property, declared or read, becomes --dm-<name>, as React's sync does
     html  the tokens the components use (tokens(), below) wherever they appear in the markup: style="--x:…", var(--x)
     js    the same tokens, only inside string and template literals and regular expressions, so decrements (--i) and demo text
           that merely looks like a variable (a diff of someone's "--text-muted") stay as they are
   Names that already start with dm- (the core's --dm-hit) are left alone. Class names, keyframes and the data-style and
   data-theme attributes don't change. */
const acorn = require('acorn');

const NAME = /(?<![\w-])--(?!dm-)([a-zA-Z_][\w-]*)/g;

/** Every token the components use: each custom property their CSS declares or reads, and each one a script or the markup sets
    (setProperty, getPropertyValue or removeProperty, or a style attribute). A var() in a script's text alone doesn't count: some
    demos show code ("gap: var(--space-6)"), and that text stays as it is */
function tokens({ css = [], all = [] }){
  const out = new Set();
  for (const t of css) for (const m of t.matchAll(NAME)) out.add(m[1]);
  for (const t of all){
    for (const m of t.matchAll(/(?:set|get|remove)Property(?:Value)?\(\s*['"`]--(?!dm-)([a-zA-Z_][\w-]*)/g)) out.add(m[1]);
    for (const m of t.matchAll(/style=\\?["'][^"'<>]*?(?<![\w-])--(?!dm-)([a-zA-Z_][\w-]*)\s*:/g)) out.add(m[1]);
  }
  return out;
}
// a name that ends in a dash before a ${…} or a [ is the start of several tokens (var(--av-${p.av}), /--av-[a-z]/)
const known = (n, T) => T.has(n) || (/-$/.test(n) && [...T].some(t => t.startsWith(n)));
const css = text => text.replace(NAME, '--dm-$1');
const html = (text, T) => text.replace(NAME, (m, n) => known(n, T) ? '--dm-' + n : m);

function js(text, T){
  const parts = [];
  let at = 0;
  for (const t of acorn.tokenizer(text, { ecmaVersion: 'latest', allowHashBang: true })){
    const label = t.type.label;
    if (label !== 'string' && label !== 'template' && label !== 'regexp') continue;
    parts.push(text.slice(at, t.start));
    let raw = html(text.slice(t.start, t.end), T);
    // a token whose whole name comes from the script (var(--${l.t}), var(--${t}-bg)): the template piece ends in "--" right
    // before the ${…}, so the prefix goes there; it is always one of the core's tokens, which all carry --dm-
    if (label === 'template' && text.startsWith('${', t.end) && /(?<![\w-])--$/.test(raw)) raw = raw.slice(0, -2) + '--dm-';
    // and one joined on with + ('--' + p.k)
    if (label === 'string' && /^(['"])--\1$/.test(raw) && /^\s*\+/.test(text.slice(t.end))) raw = raw[0] + '--dm-' + raw[0];
    parts.push(raw);
    at = t.end;
  }
  parts.push(text.slice(at));
  return parts.join('');
}
module.exports = { tokens, css, html, js, NAME };
