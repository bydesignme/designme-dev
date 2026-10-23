// Builds the staging site: the live designme.dev page with every component swapped for its
// Soft 2 / Blueprint 2 version from soft-2/index.html. The site's own UI is left as it is.
// usage (from tools/site, see README.md): node build.js <site index.html> <soft-2 index.html> <out.html> [<registry dir>]
const fs = require('fs'), path = require('path');
// edits to the site's own UI, written by make-patches.py
const SITE_PATCHES = JSON.parse(fs.readFileSync(path.join(__dirname, 'site-patches.json'), 'utf8'));
const postcss = require('postcss'), acorn = require('acorn');
const [SITE, SOFT, OUT, REGDIR] = process.argv.slice(2);
let site = fs.readFileSync(SITE, 'utf8');
const soft = fs.readFileSync(SOFT, 'utf8');
const warn = [];

/* ---------- site card -> new component ---------- */
const MAP = {
  c22:'status-pill', c1:'step-loader', c2:'reasoning-trail', c60:'thinking', c23:'context-meter', c7:'action-log', c5:'run-queue',
  c27:'run-cost', c58:'toast', c28:'toast-stack', c106:'run-summary', c109:'error-recovery', c26:'agent-lanes', c67:'agent-run-timeline',
  c3:'live-answer', c8:'thread-panel', c6:'composer', c24:'voice-capture', c107:'tool-call', c108:'artifact-card', c29:'prompt-starters',
  c30:'attachment-tray', c31:'response-versions', c32:'feedback-sheet', c4:'decision-prompt', c9:'proposal-card', c20:'rewrite-toolbar',
  c19:'design-tuner', c33:'permission-gate', c34:'launch-checklist', c105:'plan-review', c11:'change-review', c10:'source-stack',
  c17:'metric-insight', c13:'task-table', c18:'code-viewer', c66:'details-panel', c68:'citation-hover', c36:'field-extraction',
  c14:'workspace-rail', c15:'command-palette', c38:'agent-settings', c39:'file-explorer', c16:'automation-canvas', c69:'memory-panel',
  c71:'model-compare', c99:'harness', c41:'line-chart', c42:'bar-chart', c43:'donut-chart', c102:'funnel', c103:'top-pages',
  c65:'health-score', c45:'activity-heatmap', c44:'stat-cards', c12:'account-table', c46:'date-picker', c47:'date-range-picker',
  c62:'event-calendar', c63:'agenda', c49:'buttons', c52:'tooltip', c53:'search-input', c57:'country-select', c51:'social-signin',
  c55:'sign-in', c50:'form', c64:'payment-form', c54:'comments', c56:'notifications', c61:'invite', c59:'reactions', c104:'ticket-list',
  c101:'kanban', c70:'pricing-cards', c72:'onboarding-checklist', c73:'stepper', c74:'set-limit', c75:'currency-converter',
  c110:'tool-connections', c111:'design-review', c112:'model-picker', c113:'answer-action-bar', c120:'inline-text-diff', c121:'draft-review', c114:'agent-tree', c115:'agent-inbox', c122:'voice-orb', c123:'prompt-library', c116:'steering', c117:'eval-results', c127:'profile-menu', c128:'filter-menu'
};
// cards the original page never had: each is cut from a sibling card's markup, renamed, and placed after it
const EXTRA = [
  { cid:'c110', id:'tool-connections', reg:'tool-connections', title:'Tools and connections', section:'Workspace', after:'c38', icon:'link' },
  { cid:'c111', id:'design-review', reg:'design-review', title:'Design review', section:'Review and approve', after:'c34', icon:'group' },
  { cid:'c112', id:'model-picker', reg:'model-picker', title:'Model picker', section:'Conversation', after:'c6', icon:'tune' },
  { cid:'c113', id:'answer-action-bar', reg:'answer-action-bar', title:'Answer action bar', section:'Conversation', after:'c31', icon:'thumb_up' },
  { cid:'c120', id:'inline-text-diff', reg:'inline-text-diff', title:'Inline text diff', section:'Review and approve', after:'c34', icon:'spellcheck' },
  { cid:'c121', id:'draft-review', reg:'draft-review', title:'Draft review', section:'Review and approve', after:'c34', icon:'alternate_email' },
  { cid:'c114', id:'agent-tree', reg:'agent-tree', title:'Agent tree', section:'Agent status', after:'c26', icon:'account_tree' },
  { cid:'c115', id:'agent-inbox', reg:'agent-inbox', title:'Agent inbox', section:'Agent status', after:'c114', icon:'notifications' },
  { cid:'c122', id:'voice-orb', reg:'voice-orb', title:'Voice orb', section:'Conversation', after:'c24', icon:'graphic_eq' },
  { cid:'c123', id:'prompt-library', reg:'prompt-library', title:'Prompt library', section:'Conversation', after:'c29', icon:'edit_note' },
  { cid:'c116', id:'steering', reg:'steering', title:'Steering', section:'Review and approve', after:'c121', icon:'shuffle' },
  { cid:'c117', id:'eval-results', reg:'eval-results', title:'Eval results', section:'Review and approve', after:'c116', icon:'readiness_score' },
  { cid:'c127', id:'profile-menu', reg:'profile-menu', title:'Profile menu', section:'Collaboration', after:'c59', icon:'person' },
  { cid:'c128', id:'filter-menu', reg:'filter-menu', title:'Filter menu', section:'Collaboration', after:'c127', icon:'filter_list' }
];

/* ---------- read the Soft 2 page ---------- */
const cssA = soft.indexOf('<style>\n[hidden]') + '<style>'.length;
// on designme.dev the dark stage is a neutral #1c1c1c, so the components' dark greys drop their blue (Soft) and warm (Blueprint)
// tint and sit one step lighter than the stage, the same grey the site's panels used before
const NEUTRAL_DARK = { '--page':'#111111', '--stage':'#1c1c1c', '--surface':'#262626', '--raised':'#2c2c2c', '--fg':'#f2f2f2', '--fg2':'#ababab',
  '--muted':'#8c8c8c', '--faint':'#555555', '--rail':'#414141', '--line':'#333333', '--chip':'#303030', '--hover':'#373737', '--press':'#3f3f3f',
  '--wash':'#2c2c2c', '--soft':'#323232', '--soft-h':'#3a3a3a', '--dis':'#5f5f5f', '--ink':'#f2f2f2', '--on-ink':'#161616' };
function neutralDark(text){
  const root = postcss.parse(text);
  root.walkRules(rule => {
    if (!rule.selectors.every(sel => /^:root(\[data-style="bp"\])?(\[data-theme="dark"\]|:not\(\[data-theme="light"\]\))$/.test(sel.trim()))) return;
    rule.walkDecls(d => { if (NEUTRAL_DARK[d.prop]) d.value = NEUTRAL_DARK[d.prop]; });
  });
  return root.toString();
}
const CSS = neutralDark(soft.slice(cssA, soft.indexOf('</style>', cssA)));
const spriteM = soft.match(/<svg xmlns="http:\/\/www.w3.org\/2000\/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">[\s\S]*?<\/svg>/);
const SPRITE = spriteM[0];
const scrA = soft.indexOf('<script>', spriteM.index + SPRITE.length) + '<script>'.length;
const SCRIPT = soft.slice(scrA, soft.lastIndexOf('</script>'));
const bootA = SCRIPT.indexOf('/* ---------- boot ---------- */');
const defsA = SCRIPT.indexOf('/* ---------- Status pill ---------- */', bootA);
const CORE_JS = SCRIPT.slice(0, bootA), BOOT_JS = SCRIPT.slice(bootA, defsA), DEFS_JS = SCRIPT.slice(defsA);

const CARDS = {};
for (const m of soft.matchAll(/<article class="card([^"]*)" data-c="([^"]+)" id="c-[^"]+">([\s\S]*?)<\/article>/g)){
  const body = m[3];
  CARDS[m[2]] = {
    cls: m[1].trim().split(/\s+/).filter(Boolean),
    title: body.match(/<h3>([^<]*)<\/h3>/)[1],
    desc: body.match(/<h3>[^<]*<\/h3><p>([\s\S]*?)<\/p>/)[1],
    tpl: body.slice(body.indexOf('<template>') + 10, body.indexOf('</template>')),
    hint: (body.match(/<div class="card-f"><span>([\s\S]*?)<\/span>/) || [, ''])[1]
  };
}

/* per component CSS sections and DM.def blocks, for the code viewer */
const SECTIONS = {};
{ const re = /\/\* -+ (.+?) -+ \*\/\n/g; let m, prev = null;
  while ((m = re.exec(CSS))){ if (prev) SECTIONS[prev.name] = CSS.slice(prev.end, m.index).trim(); prev = { name:m[1], end:m.index + m[0].length }; }
  if (prev) SECTIONS[prev.name] = CSS.slice(prev.end).trim(); }
const defOf = id => { const a = DEFS_JS.indexOf(`DM.def('${id}'`); if (a < 0) return ''; const b = DEFS_JS.indexOf('\n});', a) + 4; return DEFS_JS.slice(a, b); };

/* ---------- CSS: scope everything to .v2, keyed to the site's style and theme ---------- */
const SHELL = /(^|[\s>+~(,])(\.wrap|\.top|\.ctrls|\.acc|\.acc-[\w-]+|\.sec-h|\.grp-h|\.grid|\.card-h|\.card-f|\.replay|\.seg(?![\w-])|body|html)(?![\w-])/;
function rootPart(sel){
  // ":root[...]:not(...)" at the start, the site uses data-style="soft" where this page uses data-style="bp"
  const m = sel.match(/^:root((?:\[[^\]]*\]|:not\([^)]*\))*)/);
  if (!m) return null;
  let attrs = m[1].replace(/\[data-style="bp"\]/g, ':not([data-style="soft"])');
  return { root: ':root' + attrs, rest: sel.slice(m[0].length).trim(), plain: !attrs };
}
function scopeSel(sel){
  sel = sel.trim();
  // the stage wrappers of the gallery map onto the mount root, which carries .v2
  sel = sel.replace(/\.card\.bare \.stage-in/g, '.v2.stage-in.bare').replace(/\.card\.wide \.stage-in/g, '.v2.stage-in.wide')
           .replace(/\.stage:has\(\.dm\)>\.stage-in/g, '.v2.stage-in:has(>.dm)').replace(/^\.stage-in\b/, '.v2.stage-in');
  if (SHELL.test(sel)) return null;
  if (/(^|[\s>+~(])\.(card|stage)(?![\w-])/.test(sel)){ warn.push('dropped page selector: ' + sel); return null; }
  const r = rootPart(sel);
  if (r){
    if (!r.rest) return r.plain ? '.v2' : r.root + ' .v2';
    if (SHELL.test(r.rest)) return null;
    return (r.plain ? '' : r.root + ' ') + (r.rest.startsWith('.v2') ? r.rest : '.v2 ' + r.rest);
  }
  if (sel.startsWith('.v2')) return sel;
  return '.v2 ' + sel;
}
const css = postcss.parse(CSS);
const KF = new Map();
css.walkAtRules('keyframes', at => { const n = at.params.trim(); KF.set(n, 'v2-' + n); at.params = 'v2-' + n; });
css.walkDecls(d => {
  if (/^animation(-name)?$/.test(d.prop)) d.value = d.value.replace(/(^|[\s,])([\w-]+)(?=$|[\s,])/g, (m, p, w) => p + (KF.get(w) || w));
  if (d.value.includes('var(--on-accent)')) d.value = d.value.replace(/var\(--on-accent\)/g, 'var(--on-accent,#fff)');
});
css.walkRules(rule => {
  if (rule.parent.type === 'atrule' && /keyframes/.test(rule.parent.name)) return;
  const out = [...new Set(rule.selectors.map(scopeSel).filter(Boolean))];
  if (!out.length) rule.remove(); else rule.selectors = out;
});
css.walkAtRules('media', at => { if (!at.nodes || !at.nodes.length) at.remove(); });
// the accent comes from the site's accent picker; only the shades derived from it are set here
css.walkRules(rule => {
  if (!rule.selectors.some(s => /\.v2$/.test(s))) return;
  rule.walkDecls(/^--(accent|accent-2|accent-bg|on-accent)$/, d => d.remove());
});
const scoped = css.toString();
const V2CSS = `/* ===== Soft 2 and Blueprint 2 components: scoped to .v2, so the site's styles and these never touch ===== */
:where(.v2, .v2 *:not(svg, svg *)), :where(.v2, .v2 *:not(svg, svg *))::before, :where(.v2, .v2 *:not(svg, svg *))::after, :where(.v2 *)::placeholder{all:revert}
/* svg is left out of the reset (it would drop presentation attributes), so its colour is reset on its own; the site's .s is a code colour */
:where(.v2) svg{color:inherit}
${scoped}
/* base for the mount root, which sits inside the site's stage */
.v2{font-family:var(--sans);font-size:14px;line-height:1.5;color:var(--fg);font-weight:400;letter-spacing:normal;text-align:left;-webkit-font-smoothing:antialiased;
  --accent-2:color-mix(in srgb,var(--accent) 86%,#000);--accent-bg:color-mix(in srgb,var(--accent) 9%,transparent)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .v2{--accent-2:color-mix(in srgb,var(--accent) 84%,#fff);--accent-bg:color-mix(in srgb,var(--accent) 13%,transparent)}}
:root[data-theme="dark"] .v2{--accent-2:color-mix(in srgb,var(--accent) 84%,#fff);--accent-bg:color-mix(in srgb,var(--accent) 13%,transparent)}
.v2.stage-in{display:block}
.v2-layer{position:static}
/* the variant switch lives in the card footer on the site */
.v2 .dm>.demo{display:none}
.v2-host{overflow:visible}
`;

/* ---------- JS: the same code, sealed in one function, mounted into the site's cards ---------- */
let core = CORE_JS
  .replace(/href="#i-\$\{/g, 'href="#v2i-${').replace(/'#i-check'/g, "'#v2i-check'")
  .replace(/closest\('\.card'\)/g, "closest('.comp')")
  .replace("const id = card.dataset.c, st = $('.stage-in', card)", "const id = card.dataset.v2, st = $('.stage-in', card)")
  .replace("const el = e.target.closest('[data-tip]'); if (!el || el === tipFor) return;", "const el = e.target.closest('.v2 [data-tip]'); if (!el || el === tipFor) return;")
  .replace("const el = e.target.closest('[data-tip]'); if (el && !el.contains(e.relatedTarget)) hideTip();", "const el = e.target.closest('.v2 [data-tip]'); if (el && !el.contains(e.relatedTarget)) hideTip();")
  .replace("const el = e.target.closest('[data-tip]'); if (el && el.matches(':focus-visible')) showTip(el);", "const el = e.target.closest('.v2 [data-tip]'); if (el && el.matches(':focus-visible')) showTip(el);")
  .replace("const btn = e.target.closest('[data-pop]');", "const btn = e.target.closest('.v2 [data-pop]');");
const defs = DEFS_JS.replace(/href="#i-/g, 'href="#v2i-').replace(/closest\('\.card'\)/g, "closest('.comp')")
  // the kanban drag ghost floats in the components' own layer, where their styles reach it
  .replace('document.body.appendChild(ghost)', "(document.querySelector('.v2-layer') || document.body).appendChild(ghost)");
if (!defs.includes(".v2-layer') || document.body).appendChild(ghost)")) throw new Error('ghost patch failed');
for (const [a, b] of [["e.target.closest('.v2 [data-tip]')", 3], ["closest('.v2 [data-pop]')", 1], ['card.dataset.v2', 1]]) if (core.split(a).length - 1 !== b) throw new Error('core patch failed: ' + a);
if (/#i-/.test(core + defs)) throw new Error('icon id left over');
const V2JS = `/* ===== Soft 2 and Blueprint 2 components ===== */
(function(){
${core}
${defs}
/* ---------- on designme.dev: each card mounts its component when it scrolls into view ---------- */
{
  const layer = document.createElement('div'); layer.className = 'v2 v2-layer'; layer.appendChild(tip); document.body.appendChild(layer);
  const demoSeg = comp => $('.stage-in .dm>.demo .seg2', comp);
  // the card footer tabs follow the component's own variant switch
  const syncTabs = comp => {
    const g = $('.comp-foot [data-tabs]', comp), sg = demoSeg(comp); if (!g || !sg) return;
    const on = $('[aria-pressed="true"]', sg); let moved = false;
    $$('.tab', g).forEach(t => { const v = String(!!on && t.dataset.v === on.dataset.v); if (t.getAttribute('aria-selected') !== v){ t.setAttribute('aria-selected', v); moved = true; } });
    if (moved) dispatchEvent(new Event('resize'));
  };
  const mount = comp => { DM.mount(comp); syncTabs(comp); };
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ io.unobserve(en.target); mount(en.target); } }), { threshold:.2 });
  $$('.comp[data-v2]').forEach(comp => {
    io.observe(comp);
    const g = $('.comp-foot [data-tabs]', comp);
    if (g) g.addEventListener('click', e => {
      const b = e.target.closest('.tab'); if (!b) return;
      if (!comp._c){ io.unobserve(comp); mount(comp); }
      const sb = $(\`.stage-in .dm>.demo .seg2 button[data-v="\${b.dataset.v}"]\`, comp);
      if (sb && sb.getAttribute('aria-pressed') !== 'true') sb.click();
    });
  });
  // the card's Animate button replays the component from the start
  window.V2 = { replay: comp => { io.unobserve(comp); mount(comp); } };
}
})();
`;

/* ---------- site script: drop the old components' code, keep everything that runs the site ---------- */
{
  const tag = "<script>\n(function(){\n  'use strict'; // keeps each";
  const a = site.indexOf(tag) + '<script>'.length, b = site.indexOf('</script>', a);
  let js = site.slice(a, b);
  const ast = acorn.parse(js, { ecmaVersion:'latest', sourceType:'script', locations:true });
  const body = ast.body[0].expression.callee.body.body;
  const base = site.slice(0, a).split('\n').length - 1; // acorn line 1 is this line of the live file
  // old component code, by line range in the live index.html (inclusive)
  const DROP = [[7531,7866],[7899,8535],[8562,8903],[8925,9225],[9230,9230],[9235,9686],[9861,10074],[10195,10716],[10750,10851],[10862,10868],[11395,11425],[11612,11733],[11768,11768],[11770,11958]];
  const drop = st => { const ln = st.loc.start.line + base; return DROP.some(([x, y]) => ln >= x && ln <= y); };
  const cut = body.filter(drop).map(st => [st.start, st.end]);
  for (let i = cut.length - 1; i >= 0; i--) js = js.slice(0, cut[i][0]) + js.slice(cut[i][1]);
  // the card's Animate button replays a new component instead of the generic entrance
  const p = "function play(comp){\n      const stage";
  if (!js.includes(p)) throw new Error('play() not found');
  js = js.replace(p, "function play(comp){\n      if (comp && comp.dataset.v2 && window.V2){ window.V2.replay(comp); return; }\n      const stage");
  site = site.slice(0, a) + js + site.slice(b);
  console.log('dropped statements:', cut.length);
}

/* ---------- card heights: each card keeps the tallest height its component reaches, measured by measure-heights.js, so
   nothing below it moves as the component starts and plays. Unlayered, so it outranks the site's own minimums ---------- */
const HEIGHTS = fs.existsSync(path.join(__dirname, 'card-heights.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'card-heights.json'), 'utf8')) : null;
const HEIGHTS_CSS = !HEIGHTS ? '' : '\n<style id="card-heights">\n' + HEIGHTS.bands.map(([b, w], i) => {
  // Soft's height for the component, and Blueprint's where it was measured on its own
  const rule = `.lib-sec .comp>.stage{min-height:var(--rh-${b},420px)}.lib-sec .comp>.stage .v2.stage-in{min-height:var(--rc-${b},0px)}:root:not([data-style="soft"]) .lib-sec .comp>.stage .v2.stage-in{min-height:var(--rcb-${b},var(--rc-${b},0px))}`;
  return i ? `@media (max-width:${HEIGHTS.bands[i - 1][1] - 1}px){${rule}}` : rule;
}).join('\n') + '\n</style>';
// the card's stage keeps its tallest height, and inside it the component keeps its own, so it grows downwards as it plays
const heightsOf = id => !HEIGHTS || !HEIGHTS.heights[id] ? '' : ` style="${HEIGHTS.bands.map(([b], i) => `--rh-${b}:${HEIGHTS.heights[id][i]}px` + (HEIGHTS.components ? `;--rc-${b}:${HEIGHTS.components[id][i]}px` : '') + (HEIGHTS.componentsBp && HEIGHTS.componentsBp[id] ? `;--rcb-${b}:${HEIGHTS.componentsBp[id][i]}px` : '')).join(';')}"`;

/* ---------- site: keep the site's own CSS below the components' ---------- */
{
  const a = site.indexOf('<style>\n/* fonts are hosted on designme.dev itself');
  if (a < 0) throw new Error('site style not found');
  const b = site.indexOf('</style>', a);
  // the chat's .ask rules are !important, which beats the components even from a lower layer, and the Command palette has an .ask row
  let own = site.slice(a + 7, b);
  const asks = (own.match(/\.ask (>|b)/g) || []).length;
  own = own.replace(/\.ask (>|b)/g, '.ask:not(.v2 *) $1');
  if (asks !== 4) throw new Error(`expected 4 .ask rules in the site css, found ${asks}`);
  own += '\n/* a card that spans the row can leave a gap after an odd card; let the next one fill it */\n.grid{grid-auto-flow:row dense}';
  own += SITE_PATCHES.css;
  site = site.slice(0, a) + '<style>\n@layer site{' + own + '\n}\n</style>\n<style id="v2-css">\n' + V2CSS + '</style>' + HEIGHTS_CSS + site.slice(b + 8);
}
/* ---------- site: React components have shipped ---------- */
for (const [a, b, n] of [
  ["React and Tailwind versions are in progress, and you can follow them on the <a href=\"#/roadmap\">roadmap</a>. Sign up and you will get them as soon as they land.",
   "Yes. Every component has a React version for Next.js, React and Astro: run npx designme add with the component name and --react, and the component lands in your project with its styles. A Tailwind version is in progress on the <a href=\"#/roadmap\">roadmap</a>.", null],
  ["['react','React and Tailwind versions','Every component as a typed React component styled with Tailwind.','progress','Code'],",
   "['react','React components','Every component as a typed React component for Next.js, React and Astro, with npx designme add <name> --react.','shipped','Code'],\n      ['tailwind','Tailwind versions','Every component styled with Tailwind classes instead of its own CSS.','progress','Code'],", 1]
]) {
  const count = site.split(a).length - 1;
  if (!count || (n && count !== n)) throw new Error('React copy not found: ' + a.slice(0, 50));
  site = site.split(a).join(b);
}
site = site.replace('<body class="ui">', '<body class="ui">\n' + SPRITE.replace(/id="i-/g, 'id="v2i-'));

/* ---------- site: swap each card's preview ---------- */
const mainA = site.indexOf('<main id="components"'), mainB = site.indexOf('</main>', mainA);
let main = site.slice(mainA, mainB);
for (const x of EXTRA){
  const m = main.match(new RegExp(`<article[^>]*\\bid="${x.after}"[^>]*>[\\s\\S]*?</article>`)); if (!m) throw new Error('no card ' + x.after);
  const card = m[0].replace(`id="${x.after}"`, `id="${x.cid}"`).replace(/(class="comp-title">)[^<]*/, '$1' + x.title).replace(/(<span class="ibox"><span class="ms">)[^<]*/, '$1' + x.icon);
  main = main.replace(m[0], () => m[0] + '\n  ' + card);
}
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const done = [];
// card widths: a component drawn wide gets the full row; STRETCH ones get it too and widen to fill it, so every section
// pairs its half-width cards evenly; NARROW ones were wide on the old site but are narrow components
const REG_ITEMS = REGDIR ? JSON.parse(fs.readFileSync(path.join(REGDIR, 'index.json'), 'utf8')).items : [];
const STRETCH = ['code-viewer'];
const NARROW = ['plan-review', 'form'];
main = main.replace(/<article([^>]*\bid="(c\d+)"[^>]*)>([\s\S]*?)<\/article>/g, (all, attrs, cid, body) => {
  const id = MAP[cid]; if (!id) return all;
  const C = CARDS[id]; if (!C){ warn.push('no card for ' + id); return all; }
  // description follows the new component, the title stays the site's
  body = body.replace(/(<p class="comp-desc">)[\s\S]*?(<\/p>)/, (m, a, b) => a + C.desc + b);
  const sA = body.indexOf('<div class="stage"><div class="stage-inner dots" data-demo>'), fA = body.indexOf('<div class="comp-foot">');
  if (sA < 0 || fA < 0) throw new Error('card shape ' + cid);
  const cls = ['v2', 'stage-in', ...C.cls.filter(c => c === 'wide' || c === 'bare'), ...(STRETCH.includes(id) ? ['wide'] : [])].join(' ');
  const stage = `<div class="stage"><div class="stage-inner dots v2-host" data-demo><div class="${cls}"></div></div></div>\n    `;
  const codeBtns = body.slice(fA).match(/<div class="code-btns">[\s\S]*?<\/div>/)[0];
  // a variant switch inside the component becomes the footer tabs, otherwise the footer says what to try
  const sw = C.tpl.match(/<div class="demo"><div class="seg2" role="group" aria-label="([^"]*)">([\s\S]*?)<\/div><\/div>/);
  let left;
  if (sw){
    const tabs = [...sw[2].matchAll(/<button aria-pressed="(true|false)" data-v="([^"]+)">([^<]*)<\/button>/g)]
      .map(t => `        <button class="tab" role="tab" aria-selected="${t[1]}" data-v="${t[2]}">${t[3]}</button>`).join('\n');
    left = `<div class="tabs" role="tablist" aria-label="${sw[1]}" data-tabs="v2-${id}">\n${tabs}\n      </div>`;
  } else left = `<span class="mono-xs">${C.hint}</span>`;
  const foot = `<div class="comp-foot">\n      ${left}\n      ${codeBtns}\n    </div>\n    <template>${C.tpl}</template>\n  `;
  body = body.slice(0, sA) + stage + foot;
  done.push(cid);
  const wide = C.cls.includes('wide') || STRETCH.includes(id) || (/class="comp wide"/.test(attrs) && !NARROW.includes(id));
  attrs = attrs.replace(/class="comp( wide)?"/, wide ? 'class="comp wide"' : 'class="comp"');
  // the registry name the install command and the React code view need; a title doesn't always spell it
  const extra = EXTRA.find(x => x.cid === cid);
  const title = (body.match(/class="comp-title">([^<]*)</) || [])[1] || '', reg = (extra && extra.reg) || (REG_ITEMS.find(x => x.title === title) || {}).name || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (HEIGHTS && !HEIGHTS.heights[id]) warn.push('no measured height for ' + id + ': run measure-heights.js');
  return `<article${attrs} data-v2="${id}" data-reg="${reg}"${heightsOf(id)}>${body}</article>`;
});
/* ---------- the agent components open with their strongest cards: Conversation comes first, and every section leads
   with what shows off an agent best. A wide card goes after an even number of half-width ones, so rows stay full ---------- */
const SECTIONS_FIRST = ['s-conversation', 's-status'], GRP = {};
const ORDER = {
  's-conversation': ['live-answer', 'composer', 'thread-panel', 'artifact-card', 'tool-call', 'voice-capture', 'voice-orb', 'answer-action-bar', 'response-versions', 'model-picker', 'prompt-starters', 'prompt-library', 'attachment-tray', 'feedback-sheet'],
  's-status': ['thinking', 'reasoning-trail', 'agent-lanes', 'agent-tree', 'agent-inbox', 'run-summary', 'action-log', 'agent-run-timeline', 'context-meter', 'error-recovery', 'run-queue', 'run-cost', 'toast-stack', 'toast', 'status-pill', 'step-loader'],
  's-review': ['change-review', 'plan-review', 'permission-gate', 'decision-prompt', 'proposal-card', 'design-tuner', 'rewrite-toolbar', 'launch-checklist', 'inline-text-diff', 'draft-review', 'steering', 'eval-results', 'design-review'],
  's-data': ['code-viewer', 'citation-hover', 'source-stack', 'field-extraction', 'metric-insight', 'details-panel', 'task-table'],
  's-workspace': ['automation-canvas', 'command-palette', 'memory-panel', 'model-compare', 'agent-settings', 'tool-connections', 'file-explorer', 'workspace-rail']
};
{
  const secRe = id => new RegExp(`<section class="lib-sec" id="${id}">[\\s\\S]*?</section>`);
  for (const [sid, ids] of Object.entries(ORDER)){
    const m = main.match(secRe(sid)); if (!m) throw new Error('no section ' + sid);
    const arts = [...m[0].matchAll(/<article[\s\S]*?<\/article>/g)];
    const got = arts.map(a => (a[0].match(/data-v2="([^"]+)"/) || [])[1]);
    if (got.length !== ids.length || ids.some(id => !got.includes(id))) throw new Error(`${sid} order lists ${ids.join(',')} but has ${got.join(',')}`);
    const a = arts[0].index, b = arts[arts.length - 1].index + arts[arts.length - 1][0].length;
    // nothing but whitespace between the cards, so they can move freely
    const gaps = arts.slice(1).map((x, i) => m[0].slice(arts[i].index + arts[i][0].length, x.index));
    if (gaps.some(g => g.trim())) throw new Error(sid + ': something sits between the cards');
    const sorted = ids.map(id => arts[got.indexOf(id)][0]).join(gaps[0]);
    main = main.replace(m[0], () => m[0].slice(0, a) + sorted + m[0].slice(b));
  }
  // Conversation before Agent status, and the section numbers follow
  const [x, y] = SECTIONS_FIRST.map(id => main.match(secRe(id))[0]);
  const ix = main.indexOf(main.match(secRe(SECTIONS_FIRST[1]))[0]), iy = main.indexOf(x);
  if (!(ix < iy)) throw new Error('sections already moved');
  main = main.slice(0, ix) + x + main.slice(ix + y.length, iy) + y + main.slice(iy + x.length);
  // two sets on the page, Agent components and App basics, shown one at a time: each section knows its set, and each set
  // numbers its sections from 01
  const cut = main.indexOf('<h2>App basics</h2>'); if (cut < 0) throw new Error('App basics heading not found');
  const mark = part => { let no = 0; return part.replace(/<section class="lib-sec" id="([\w-]+)">/g, (m, id) => (GRP[id] = GRP.cur, m.replace('>', ` data-grp="${GRP.cur}">`)))
    .replace(/<span class="sec-no">\d+<\/span>/g, () => `<span class="sec-no">${String(++no).padStart(2, '0')}</span>`); };
  GRP.cur = 'agent'; const head = mark(main.slice(0, cut)); GRP.cur = 'basics'; main = head + mark(main.slice(cut));
}
site = site.slice(0, mainA) + main + site.slice(mainB);
// the sidebar follows: its groups in section order, and its links in card order
{
  // a new card's link goes after its sibling's, and its section counts one more
  for (const x of EXTRA){
    const link = `<a class="side-a" href="#${x.after}" data-c="${x.after}">`, at = site.indexOf(link); if (at < 0) throw new Error('no side link ' + x.after);
    const close = site.indexOf('</a>', at) + 4;
    site = site.slice(0, close) + `<a class="side-a" href="#${x.cid}" data-c="${x.cid}">${x.title}</a>` + site.slice(close);
    const n = site.lastIndexOf('<span class="side-n">', at) + '<span class="side-n">'.length, e = site.indexOf('<', n);
    site = site.slice(0, n) + (+site.slice(n, e) + 1) + site.slice(e);
  }
  const grp = id => { const a = site.indexOf(`<div class="side-grp" data-s="${id}"`); if (a < 0) throw new Error('no side group ' + id); return a; };
  const [ga, gb] = SECTIONS_FIRST.map(grp), next = i => site.indexOf('<div class="side-grp" data-s="', i + 10), gEnd = next(ga);
  if (next(gb) !== ga) throw new Error('side groups not next to each other');
  site = site.slice(0, gb) + site.slice(ga, gEnd) + site.slice(gb, ga) + site.slice(gEnd);
  site = site.replace(/<div class="side-grp" data-s="([\w-]+)">/g, (m, id) => { if (!GRP[id]) throw new Error('no set for ' + id); return `<div class="side-grp" data-s="${id}" data-grp="${GRP[id]}">`; });
  for (const [sid, ids] of Object.entries(ORDER)){
    const a = site.indexOf('<div class="side-ul">', grp(sid)) + '<div class="side-ul">'.length, b = site.indexOf('</div>', a);
    const links = site.slice(a, b).match(/<a class="side-a"[^>]*>[^<]*<\/a>/g);
    const cidOf = id => (main.match(new RegExp(`id="(c\\d+)"[^>]*data-v2="${id}"`)) || [])[1];
    const out = ids.map(id => { const l = links.find(x => x.includes(`data-c="${cidOf(id)}"`)); if (!l) throw new Error('no side link for ' + id); return l; });
    if (out.length !== links.length) throw new Error('side links of ' + sid);
    site = site.slice(0, a) + out.join('') + site.slice(b);
  }
}
const missing = Object.keys(MAP).filter(k => !done.includes(k));
if (missing.length) warn.push('cards not swapped: ' + missing.join(','));

/* ---------- the code people copy or install: original CSS and JS, Blueprint by default and Soft with data-style="soft" ---------- */
const ELEM = /^(\*|button|input|textarea|select|:focus-visible|\[hidden\])(?![\w-])/;
function regCss(text){
  const root = postcss.parse(text);
  root.walkRules(rule => {
    if (rule.parent.type === 'atrule' && /keyframes/.test(rule.parent.name)) return;
    const out = [...new Set(rule.selectors.map(sel => {
      sel = sel.trim().replace(/\[data-style="bp"\]/g, ':not([data-style="soft"])').replace(/\.stage:has\(\.dm\)>\.stage-in/g, '.stage-in:has(>.dm)');
      if (SHELL.test(sel)) return null;
      if (/(^|[\s>+~(])\.stage(?![\w-])/.test(sel)) return null;
      if (/(^|[\s>+~(])\.card(?![\w-])/.test(sel) && !/\.card\.(bare|wide) \.stage-in/.test(sel)) return null;
      // element resets only reach inside components, never the rest of your page
      if (ELEM.test(sel)) return ':where([data-c]) ' + sel; // :where keeps the reset as weak as a bare element selector
      return sel;
    }).filter(Boolean))];
    if (!out.length) rule.remove(); else rule.selectors = out;
  });
  root.walkAtRules('media', at => { if (!at.nodes || !at.nodes.length) at.remove(); });
  return root.toString().replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
const REG_CORE_CSS = `/* Designme shared core: tokens for Blueprint (default) and Soft (<html data-style="soft">), light and dark (<html data-theme="dark">) */\n`
  + regCss(CSS.slice(0, CSS.indexOf('/* ---------- Status pill ---------- */')) + '\n' + CSS.slice(CSS.indexOf('/* ---------- Blueprint 2 ---------- */')))
  + `\n/* a component card: the template renders into .stage-in */\n[data-c]{width:440px;max-width:100%;font-family:var(--sans);font-size:14px;line-height:1.5;color:var(--fg);-webkit-font-smoothing:antialiased}\n[data-c].wide{width:720px}\n`;
const REG_CORE_JS = CORE_JS.trim() + `\n\n/* ---------- icons: the sprite every <use href="#i-..."> points at ---------- */\nconst SPRITE = ${JSON.stringify(SPRITE)};\n`
  + `/* ---------- mount: every [data-c] card renders its template when it scrolls into view ---------- */\ndocument.addEventListener('DOMContentLoaded', () => {\n  if (!document.getElementById('i-check')) document.body.insertAdjacentHTML('afterbegin', SPRITE);\n  document.body.appendChild(tip);\n  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ io.unobserve(en.target); DM.mount(en.target); } }), { threshold:.25 });\n  $$('[data-c]').forEach(card => io.observe(card));\n});\n`;
const regHtml = id => { const C = CARDS[id], cls = ['card', ...C.cls.filter(c => c === 'wide' || c === 'bare')].join(' ');
  return `<div class="${cls}" data-c="${id}">\n  <div class="stage-in"></div>\n  <template>\n${C.tpl.trim()}\n  </template>\n</div>\n`; };
const regOne = id => { const C = CARDS[id], sec = SECTIONS[C.title] || ''; if (!sec) warn.push('no CSS section for ' + C.title);
  return { html:regHtml(id), css:`/* ---------- ${C.title} ---------- */\n` + regCss(sec), js:defOf(id) + '\n' }; };

/* ---------- code viewer and copy: the new code, in code-data.json next to the page, which fetches it when it needs it ---------- */
{
  const open = '<script type="application/json" id="code-data">';
  const a = site.indexOf(open), b = site.indexOf('</script>', a);
  if (a < 0) throw new Error('code data not found');
  const data = JSON.parse(site.slice(a + open.length, b));
  for (const [cid, id] of Object.entries(MAP)){ if (!CARDS[id]) continue; const x = EXTRA.find(e => e.cid === cid); if (!data[cid] && !x) continue; data[cid] = { name:x ? x.title : data[cid].name, ...regOne(id) }; }
  data._shared = { css:REG_CORE_CSS, js:REG_CORE_JS };
  fs.writeFileSync(path.join(path.dirname(OUT), 'code-data.json'), JSON.stringify(data));
  site = site.slice(0, a) + site.slice(b + '</script>'.length).replace(/^\n/, '');
}

/* ---------- the registry npx designme add downloads from ---------- */
if (REGDIR){
  // same layout as the files already there: Python style separators, no trailing newline
  const pyDump = v => Array.isArray(v) ? '[' + v.map(pyDump).join(', ') + ']' : v && typeof v === 'object' ? '{' + Object.entries(v).map(([k, x]) => JSON.stringify(k) + ': ' + pyDump(x)).join(', ') + '}' : JSON.stringify(v);
  const idx = JSON.parse(fs.readFileSync(path.join(REGDIR, 'index.json'), 'utf8'));
  const siteNames = {}; for (const m of fs.readFileSync(SITE, 'utf8').matchAll(/<article[^>]*\bid="(c\d+)"[^>]*>[\s\S]*?class="comp-title">([^<]*)</g)) siteNames[m[1]] = m[2];
  const slug = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  let n = 0;
  for (const [cid, id] of Object.entries(MAP)){
    const extra = EXTRA.find(x => x.cid === cid);
    if (extra && !idx.items.some(x => x.name === extra.reg)){
      // a new component: its own registry entry, listed after the card it follows
      // it follows a card of the original page, or another new one
      const after = idx.items.findIndex(x => x.title === (siteNames[extra.after] || (EXTRA.find(e => e.cid === extra.after) || {}).title));
      idx.items.splice(after + 1, 0, { name:extra.reg, title:extra.title, section:extra.section, description:CARDS[id].desc });
      fs.writeFileSync(path.join(REGDIR, extra.reg + '.json'), pyDump({ name:extra.reg, title:extra.title, section:extra.section, description:CARDS[id].desc, dependencies:['core'], files:[] }));
    }
    const hit = extra ? idx.items.find(x => x.name === extra.reg) : idx.items.find(x => x.title === siteNames[cid]), name = hit ? hit.name : slug(siteNames[cid]), file = path.join(REGDIR, name + '.json');
    if (!fs.existsSync(file)){ warn.push('no registry entry ' + name); continue; }
    const old = JSON.parse(fs.readFileSync(file, 'utf8')), one = regOne(id);
    const item = { ...old, description:CARDS[id].desc, files:[
      { path:`${name}/${name}.html`, content:one.html }, { path:`${name}/${name}.css`, content:one.css }, { path:`${name}/${name}.js`, content:one.js } ] };
    fs.writeFileSync(file, pyDump(item)); n++;
    const it = idx.items.find(x => x.name === name); if (it) it.description = CARDS[id].desc;
  }
  const corePath = path.join(REGDIR, 'core.json'), core = JSON.parse(fs.readFileSync(corePath, 'utf8'));
  core.files = [{ path:'core/core.css', content:REG_CORE_CSS }, { path:'core/core.js', content:REG_CORE_JS }];
  fs.writeFileSync(corePath, pyDump(core));
  fs.writeFileSync(path.join(REGDIR, 'index.json'), JSON.stringify(idx, null, 1));
  console.log('registry entries written:', n);
}

/* ---------- the components' script goes last ---------- */
{
  const end = site.lastIndexOf('</body>');
  site = site.slice(0, end) + '<script id="v2-js">\n' + V2JS + '</script>\n' + site.slice(end);
}
/* ---------- site: the HTML / React switch in the code views, and thumbnails of components not yet started ---------- */
for (const [a, b] of SITE_PATCHES.patches){
  const count = site.split(a).length - 1;
  if (count !== 1) throw new Error(`site patch matched ${count} times: ${a.slice(0, 70)}`);
  site = site.replace(a, () => b);
}
// each card's title links to the component's own page (a plain click still opens it in place, see make-patches.py)
site = site.replace(/(<article\b[^>]*\bdata-reg="([\w-]+)"[^>]*>[\s\S]*?<h2 class="comp-title">)([^<]*)<\/h2>/g, (m, head, reg, t) => `${head}<a href="/components/${reg}">${t}</a></h2>`);
fs.writeFileSync(OUT, site);
console.log('swapped', done.length, 'cards; size', site.length);

/* ---------- llms.txt: a plain Markdown index of every component for AI tools, in the page's own order ---------- */
{
  const text = h => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
  const SETS = { agent:'Agent components', basics:'App basics' };
  const secs = [...site.matchAll(/<section class="lib-sec" id="([\w-]+)" data-grp="(\w+)">([\s\S]*?)<\/section>/g)].map(([, id, grp, body]) => ({
    id, grp, title:text(body.match(/<h2>([\s\S]*?)<\/h2>/)[1]), about:text((body.match(/<div class="sec-head">[\s\S]*?<p>([\s\S]*?)<\/p>/) || [, ''])[1]),
    cards:[...body.matchAll(/<article\b[^>]*\bdata-reg="([\w-]+)"[^>]*>[\s\S]*?class="comp-title">([\s\S]*?)<\/h2>[\s\S]*?class="comp-desc">([\s\S]*?)<\/p>/g)].map(([, reg, t, d]) => ({ reg, t:text(t), d:text(d) })) }));
  const count = secs.reduce((n, x) => n + x.cards.length, 0);
  let md = `# Designme.dev

> ${count} free, MIT-licensed UI components for products built around AI agents: status pills, reasoning trails, tool calls, permission gates, plan reviews, run summaries and more, plus the app basics around them (charts, dates, forms, tables). Each one comes as plain HTML, CSS and JS, or as a typed React component with no dependencies beyond React, in two styles (Soft and Blueprint) with light and dark mode.

Install with the CLI, which copies each component's source into your project so you own it:

- HTML: \`npx designme add <name>\` adds the component and the shared core it needs.
- React: \`npx designme add <name> --react\` adds a \`.tsx\` component and its CSS. Needs React 19, and works with Next.js (App Router), Vite and Astro islands.

Every class, CSS variable and animation name starts with \`dm-\` in the React version, so the components sit beside Tailwind or any other CSS. Each component below links to its page as Markdown: what it is for, how to install and use it, its React props, questions and its React source. The same page with a live demo is at the same address without \`.md\`, and every component is listed at https://designme.dev/components.
`;
  for (const g of Object.keys(SETS)){
    md += `\n## ${SETS[g]}\n`;
    for (const sec of secs.filter(x => x.grp === g && x.cards.length)){
      md += `\n### ${sec.title}\n\n${sec.about ? sec.about + '\n\n' : ''}`;
      md += sec.cards.map(c => `- [${c.t}](https://designme.dev/components/${c.reg}.md): ${c.d} Install: \`npx designme add ${c.reg}\``).join('\n') + '\n';
    }
  }
  md += `\n## Optional\n\n- [Component pages](https://designme.dev/components/composer): one page per component, at /components/<name>, with its demo, install, usage, props and code.\n- [The homepage](https://designme.dev/): every demo on one page, in both styles.\n- [Registry](https://designme.dev/r/react/composer.json): each component's React source as JSON, at /r/react/<name>.json (HTML at /r/<name>.json).\n`;
  if (count !== done.length) warn.push(`llms.txt lists ${count} of ${done.length} components`);
  // the same sections and cards, in page order, for the component pages that tools/pages builds
  const PAGES_DATA = path.resolve(__dirname, '../pages/data/site.json');
  fs.mkdirSync(path.dirname(PAGES_DATA), { recursive:true });
  const cardsAll = [...site.matchAll(/<article\b([^>]*)>[\s\S]*?class="comp-title">([\s\S]*?)<\/h2>[\s\S]*?class="comp-desc">([\s\S]*?)<\/p>/g)];
  const meta = {}; for (const [, attrs] of cardsAll){ const reg = (attrs.match(/data-reg="([\w-]+)"/) || [])[1]; if (reg) meta[reg] = { v2:(attrs.match(/data-v2="([\w-]+)"/) || [])[1], wide:/class="comp wide/.test(attrs) }; }
  fs.writeFileSync(PAGES_DATA, JSON.stringify({ sets:SETS, logo:site.match(/<a[^>]*class="brand"[\s\S]*?(<svg[\s\S]*?<\/svg>)<\/a>/)[1], sections:secs.filter(x => x.cards.length).map(x => ({
    slug:x.id.replace(/^s-/, ''), ...x,
    cards:x.cards.map(c => ({ reg:c.reg, title:c.t, desc:c.d, ...meta[c.reg] })) })) }, null, 1));
  fs.writeFileSync(path.join(path.dirname(OUT), 'llms.txt'), md);
  console.log('llms.txt:', count, 'components in', secs.filter(x => x.cards.length).length, 'sections');
}

/* ---------- 404.html: unknown URLs get a real 404 (without it Cloudflare Pages answers every URL with the homepage).
   It knows every component, so /components/composer or /composer offers the Composer page ---------- */
{
  const text = h => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
  const slug = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const list = [...site.matchAll(/<article\b[^>]*\bdata-reg="([\w-]+)"[^>]*>[\s\S]*?class="comp-title">([\s\S]*?)<\/h2>[\s\S]*?class="comp-desc">([\s\S]*?)<\/p>/g)]
    .map(([, reg, t, d]) => ({ r:reg, s:slug(text(t)), t:text(t), d:text(d) }));
  const logo = site.match(/<a[^>]*class="brand"[\s\S]*?(<svg[\s\S]*?<\/svg>)<\/a>/)[1];
  const fonts = [...site.matchAll(/@font-face\s*\{[^}]*inter-latin(?:-ext)?-(?:400|500|600)-normal[^}]*\}/g)].map(m => m[0]).join('\n');
  const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Page not found · Designme.dev</title><meta name="robots" content="noindex">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script>try{var t=localStorage.getItem('dmui-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
<style>
${fonts}
:root{--bg:#fff;--fg:#111318;--dim:#5b5f6b;--stage:#fafafa;--line:rgba(17,19,24,.08);--ink:#111318;--on-ink:#fff;color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0b0c0f;--fg:#ededee;--dim:#a1a3ab;--stage:#16171b;--line:rgba(255,255,255,.08);--ink:#f5f5f4;--on-ink:#111318;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0b0c0f;--fg:#ededee;--dim:#a1a3ab;--stage:#16171b;--line:rgba(255,255,255,.08);--ink:#f5f5f4;--on-ink:#111318;color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;flex-direction:column;background:var(--bg);color:var(--fg);font:14px/1.55 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
header{padding:18px 24px;border-bottom:1px solid var(--line)}
header a{display:inline-block;color:var(--fg)}
header svg{display:block;height:21px;width:auto}
main{flex:1;width:100%;max-width:560px;margin:0 auto;padding:12vh 24px 64px}
.code{font:500 12px/1 "JetBrains Mono",ui-monospace,Menlo,monospace;color:var(--dim);letter-spacing:.04em}
h1{margin:10px 0 8px;font-size:26px;line-height:1.2;font-weight:600;letter-spacing:-.02em}
p{margin:0;color:var(--dim)}
p code{font:12.5px ui-monospace,Menlo,monospace;color:var(--fg);background:var(--stage);padding:2px 6px;border-radius:6px;word-break:break-all}
.hits{display:grid;gap:8px;margin:28px 0 0}
.hit{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:14px;background:var(--stage);color:var(--fg);text-decoration:none;transition:background .2s}
.hit:hover{background:color-mix(in srgb,var(--fg) 6%,var(--stage))}
.hit div{flex:1;min-width:0}
.hit b{display:block;font-weight:500}
.hit span{display:block;color:var(--dim);font-size:13px}
.hit i{font-style:normal;color:var(--dim)}
.acts{display:flex;flex-wrap:wrap;gap:8px;margin:28px 0 0}
.btn{display:inline-flex;align-items:center;height:36px;padding:0 16px;border-radius:999px;font-weight:500;text-decoration:none;color:var(--fg);box-shadow:inset 0 0 0 1px var(--line)}
.btn.ink{background:var(--ink);color:var(--on-ink);box-shadow:none}
.btn:focus-visible,.hit:focus-visible{outline:2px solid var(--fg);outline-offset:2px}
</style></head><body>
<header><a href="/" aria-label="Designme.dev home">${logo}</a></header>
<main>
  <div class="code">404</div>
  <h1>Page not found</h1>
  <p>There's no page at <code id="where">this address</code>.</p>
  <div class="hits" id="hits" hidden></div>
  <div class="acts"><a class="btn ink" href="/">All components</a><a class="btn" href="/#/changelog">Changelog</a></div>
</main>
<script>
(function(){
  var C = ${JSON.stringify(list)};
  var where = location.pathname + location.search; document.getElementById('where').textContent = where;
  // the last part of the address, as a component's name: an exact match first, then names that contain it
  var q = decodeURIComponent(location.pathname).toLowerCase().replace(/\\.(html?|json|md)$/, '').split('/').filter(Boolean).pop() || '';
  q = q.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!q) return;
  var exact = C.filter(function(c){ return c.s === q || c.r === q; });
  var hits = exact.length ? exact : q.length > 2 ? C.filter(function(c){ return c.s.indexOf(q) > -1 || c.r.indexOf(q) > -1; }).slice(0, 4) : [];
  if (!hits.length) return;
  var box = document.getElementById('hits'); box.hidden = false;
  hits.forEach(function(c){
    var a = document.createElement('a'); a.className = 'hit'; a.href = '/components/' + c.r;
    var d = document.createElement('div'), b = document.createElement('b'), s = document.createElement('span'), i = document.createElement('i');
    b.textContent = (exact.length ? 'Looking for ' : '') + c.t + (exact.length ? '?' : ''); s.textContent = c.d; i.textContent = '\\u2192';
    d.appendChild(b); d.appendChild(s); a.appendChild(d); a.appendChild(i); box.appendChild(a);
  });
})();
</script>
</body></html>
`;
  fs.writeFileSync(path.join(path.dirname(OUT), '404.html'), page);
  console.log('404.html:', list.length, 'components it can point to');
}
const wideMis = Object.entries(MAP).filter(([cid, id]) => CARDS[id] && CARDS[id].cls.includes('wide') !== new RegExp(`<article class="comp wide"[^>]*id="${cid}"`).test(fs.readFileSync(SITE, 'utf8'))).map(([c, i]) => `${c}:${i}:${CARDS[i].cls.includes('wide') ? 'new wide' : 'site wide'}`);
console.log('width differences:', wideMis.join(' '));
warn.forEach(w => console.log('WARN', w));
