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
  c101:'kanban', c70:'pricing-cards', c72:'onboarding-checklist', c73:'stepper', c74:'set-limit', c75:'currency-converter'
};

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
  const rule = `.lib-sec .comp>.stage{min-height:var(--rh-${b},420px)}`;
  return i ? `@media (max-width:${HEIGHTS.bands[i - 1][1] - 1}px){${rule}}` : rule;
}).join('\n') + '\n</style>';
const heightsOf = id => !HEIGHTS || !HEIGHTS.heights[id] ? '' : ` style="${HEIGHTS.bands.map(([b], i) => `--rh-${b}:${HEIGHTS.heights[id][i]}px`).join(';')}"`;

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
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const done = [];
// card widths: a component drawn wide gets the full row; STRETCH ones get it too and widen to fill it, so every section
// pairs its half-width cards evenly; NARROW ones were wide on the old site but are narrow components
const REG_ITEMS = REGDIR ? JSON.parse(fs.readFileSync(path.join(REGDIR, 'index.json'), 'utf8')).items : [];
const STRETCH = ['code-viewer', 'workspace-rail'];
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
  const title = (body.match(/class="comp-title">([^<]*)</) || [])[1] || '', reg = (REG_ITEMS.find(x => x.title === title) || {}).name || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (HEIGHTS && !HEIGHTS.heights[id]) warn.push('no measured height for ' + id + ': run measure-heights.js');
  return `<article${attrs} data-v2="${id}" data-reg="${reg}"${heightsOf(id)}>${body}</article>`;
});
/* ---------- the agent components open with their strongest cards: Conversation comes first, and every section leads
   with what shows off an agent best. A wide card goes after an even number of half-width ones, so rows stay full ---------- */
const SECTIONS_FIRST = ['s-conversation', 's-status'];
const ORDER = {
  's-conversation': ['live-answer', 'composer', 'thread-panel', 'artifact-card', 'tool-call', 'voice-capture', 'response-versions', 'prompt-starters', 'attachment-tray', 'feedback-sheet'],
  's-status': ['thinking', 'reasoning-trail', 'agent-lanes', 'run-summary', 'action-log', 'agent-run-timeline', 'context-meter', 'error-recovery', 'run-queue', 'run-cost', 'toast-stack', 'toast', 'status-pill', 'step-loader'],
  's-review': ['change-review', 'plan-review', 'permission-gate', 'decision-prompt', 'proposal-card', 'design-tuner', 'rewrite-toolbar', 'launch-checklist'],
  's-data': ['code-viewer', 'citation-hover', 'source-stack', 'field-extraction', 'metric-insight', 'details-panel', 'task-table'],
  's-workspace': ['automation-canvas', 'command-palette', 'memory-panel', 'model-compare', 'agent-settings', 'file-explorer', 'workspace-rail']
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
  let no = 0; main = main.replace(/<span class="sec-no">\d+<\/span>/g, () => `<span class="sec-no">${String(++no).padStart(2, '0')}</span>`);
}
site = site.slice(0, mainA) + main + site.slice(mainB);
// the sidebar follows: its groups in section order, and its links in card order
{
  const grp = id => { const a = site.indexOf(`<div class="side-grp" data-s="${id}">`); if (a < 0) throw new Error('no side group ' + id); return a; };
  const [ga, gb] = SECTIONS_FIRST.map(grp), next = i => site.indexOf('<div class="side-grp" data-s="', i + 10), gEnd = next(ga);
  if (next(gb) !== ga) throw new Error('side groups not next to each other');
  site = site.slice(0, gb) + site.slice(ga, gEnd) + site.slice(gb, ga) + site.slice(gEnd);
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
  for (const [cid, id] of Object.entries(MAP)){ if (!CARDS[id] || !data[cid]) continue; data[cid] = { name:data[cid].name, ...regOne(id) }; }
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
    const hit = idx.items.find(x => x.title === siteNames[cid]), name = hit ? hit.name : slug(siteNames[cid]), file = path.join(REGDIR, name + '.json');
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
fs.writeFileSync(OUT, site);
console.log('swapped', done.length, 'cards; size', site.length);
const wideMis = Object.entries(MAP).filter(([cid, id]) => CARDS[id] && CARDS[id].cls.includes('wide') !== new RegExp(`<article class="comp wide"[^>]*id="${cid}"`).test(fs.readFileSync(SITE, 'utf8'))).map(([c, i]) => `${c}:${i}:${CARDS[i].cls.includes('wide') ? 'new wide' : 'site wide'}`);
console.log('width differences:', wideMis.join(' '));
warn.forEach(w => console.log('WARN', w));
