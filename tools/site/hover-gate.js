// Hover only where there is one. A phone or tablet has no hover, but a tap leaves the tapped element in :hover until the
// next tap somewhere else, so a hover style sticks. Every rule whose selector uses :hover moves into
// @media (hover:hover) and (pointer:fine), at the same place in the cascade, so a mouse sees exactly what it saw before and
// a touch screen never sees a hover style. Rules that mix :hover with other states (.x:hover,.x.hl{...}) are split: the
// :hover selectors go into the media block and the rest stay where they were. :focus-visible styles stay as they are.
// :not(:hover) on its own isn't a hover style (it is true on a touch screen), so it is left alone; rules already inside a
// hover or pointer query are left alone too.
// Used by build.js (the homepage, the registry and core.css, and so the React CSS synced from them) and by the pages build
// (astro.config.mjs, as a PostCSS plugin, and src/lib/data.mjs for the CSS it inlines).
const postcss = require('postcss');

const MQ = '(hover:hover) and (pointer:fine)';
// what a selector says once :not(...) groups are taken out (one level of nested brackets inside them)
const bare = sel => sel.replace(/:not\((?:[^()]|\([^()]*\))*\)/g, '');
const hovers = sel => /:hover(?![\w-])/.test(bare(sel));
const gated = node => { for (let p = node.parent; p; p = p.parent) if (p.type === 'atrule' && /^(-webkit-)?media$/i.test(p.name) && /\b(any-)?hover\s*:|\b(any-)?pointer\s*:/.test(p.params)) return true; return false; };

function gateRoot(root){
  let n = 0;
  root.walkRules(rule => {
    if (rule.parent && rule.parent.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
    if (!rule.selector.includes(':hover') || gated(rule)) return;
    const sels = rule.selectors, hov = sels.filter(hovers);
    if (!hov.length) return;
    const rest = sels.filter(s => !hovers(s));
    const media = postcss.atRule({ name:'media', params:MQ, raws:{ afterName:' ', between:'' } });
    const inner = rule.clone({ selectors:hov }); media.append(inner); inner.raws.before = '';
    rule.after(media);
    if (rest.length) rule.selectors = rest; else rule.remove();
    n++;
  });
  return n;
}
/** the text of a stylesheet with its hover rules gated */
function hoverGate(text){ const root = postcss.parse(text); gateRoot(root); return root.toString(); }
/** the selectors in a stylesheet that still use :hover outside a hover query (none, once it has been through hoverGate) */
function ungated(text){ const out = []; postcss.parse(text).walkRules(r => { if (r.parent && r.parent.type === 'atrule' && /keyframes$/i.test(r.parent.name)) return; if (!gated(r)) out.push(...r.selectors.filter(hovers)); }); return out; }
/** the same as a PostCSS plugin, for Vite */
const plugin = () => ({ postcssPlugin:'designme-hover-gate', OnceExit(root){ gateRoot(root); } });
plugin.postcss = true;

module.exports = { hoverGate, ungated, plugin, MQ };
