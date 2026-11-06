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
  c110:'tool-connections', c111:'design-review', c112:'model-picker', c113:'answer-action-bar', c120:'inline-text-diff', c121:'draft-review', c114:'agent-tree', c115:'agent-inbox', c122:'voice-orb', c123:'prompt-library', c116:'steering', c117:'eval-results', c131:'knowledge-sources', c132:'scheduled-runs', c124:'segmented-control', c125:'otp-field', c126:'multi-select', c127:'profile-menu', c128:'filter-menu', c129:'browser-session', c130:'trace-view', c133:'terminal-stream', c134:'human-handoff', c135:'rich-text-editor',
  c140:'badge', c143:'context-switcher', c144:'banner'
};
Object.assign(MAP, { c141:'canvas-toolbar' });
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
  { cid:'c131', id:'knowledge-sources', reg:'knowledge-sources', title:'Knowledge sources', section:'Workspace', after:'c110', icon:'description' },
  { cid:'c132', id:'scheduled-runs', reg:'scheduled-runs', title:'Scheduled runs', section:'Workspace', after:'c131', icon:'schedule' },
  { cid:'c124', id:'segmented-control', reg:'segmented-control', title:'Segmented control', section:'Dates', after:'c46', icon:'splitscreen' },
  { cid:'c125', id:'otp-field', reg:'otp-field', title:'OTP field', section:'Forms and inputs', after:'c55', icon:'lock' },
  { cid:'c126', id:'multi-select', reg:'multi-select', title:'Multi-select', section:'Forms and inputs', after:'c57', icon:'tag' },
  { cid:'c127', id:'profile-menu', reg:'profile-menu', title:'Profile menu', section:'Collaboration', after:'c59', icon:'person' },
  { cid:'c128', id:'filter-menu', reg:'filter-menu', title:'Filter menu', section:'Collaboration', after:'c127', icon:'filter_list' },
  { cid:'c129', id:'browser-session', reg:'browser-session', title:'Browser session', section:'Agent status', after:'c7', icon:'search' },
  { cid:'c130', id:'trace-view', reg:'trace-view', title:'Trace view', section:'Agent status', after:'c129', icon:'filter_list' },
  { cid:'c133', id:'terminal-stream', reg:'terminal-stream', title:'Terminal stream', section:'Sources and output', after:'c18', icon:'terminal' },
  { cid:'c134', id:'human-handoff', reg:'human-handoff', title:'Hand-off to a person', section:'Review and approve', after:'c33', icon:'person' },
  { cid:'c135', id:'rich-text-editor', reg:'rich-text-editor', title:'Rich text editor', section:'Conversation', after:'c108', icon:'edit_note' },
  { cid:'c140', id:'badge', reg:'badge', title:'Badge', section:'Forms and inputs', after:'c49', icon:'tag' },
  { cid:'c143', id:'context-switcher', reg:'context-switcher', title:'Context switcher', section:'Collaboration', after:'c127', icon:'account_tree' },
  { cid:'c144', id:'banner', reg:'banner', title:'Banner', section:'Collaboration', after:'c56', icon:'stars' }
];
// a workflow canvas's toolbar, after Automation canvas
EXTRA.push(
  { cid:'c141', id:'canvas-toolbar', reg:'canvas-toolbar', title:'Canvas toolbar', section:'Workspace', after:'c16', icon:'tune' }
);
// twelve new components (owner, 4 Nov): the primitives in the app basics, the charts beside the charts, and the agent ones
// with the agent components. Each is listed once it is in soft-2/index.html; `next` is the card it follows in its section's
// order below (the agent sections have an ORDER), `after` the card it is cut from and placed after
const NEW = [
  { cid:'c150', id:'progress', title:'Progress and meter', section:'Forms and inputs', after:'c140', icon:'readiness_score' },
  { cid:'c151', id:'slider', title:'Slider', section:'Forms and inputs', after:'c150', icon:'tune' },
  { cid:'c158', id:'color-picker', title:'Colour picker', section:'Forms and inputs', after:'c126', icon:'stars' },
  // Carousel (owner, 4 Nov): Variant carousel and Image carousel as one component with a Variants / Images switch, in Variant
  // carousel's place beside Payment form, so the row stays even
  { cid:'c153', id:'carousel', title:'Carousel', section:'Forms and inputs', after:'c64', icon:'splitscreen' },
  { cid:'c152', id:'context-menu', title:'Context menu', section:'Collaboration', after:'c127', icon:'chat_bubble', next:'profile-menu' },
  { cid:'c156', id:'radial-goals', title:'Radial goals', section:'Charts and tables', after:'c43', icon:'donut' },
  { cid:'c157', id:'score-breakdown', title:'Score breakdown', section:'Charts and tables', after:'c65', icon:'readiness_score' },
  { cid:'c154', id:'radar-chart', title:'Eval radar', section:'Charts and tables', after:'c157', icon:'grid_on' },
  { cid:'c155', id:'scatter-chart', title:'Cost vs quality', section:'Charts and tables', after:'c154', icon:'trending_up' },
  { cid:'c160', id:'agent-phases', title:'Agent phases', section:'Agent status', after:'c60', icon:'history', next:'browser-session' },
  { cid:'c159', id:'web-search', title:'Web search', section:'Agent status', after:'c129', icon:'search', next:'browser-session' },
  { cid:'c161', id:'agent-builder', title:'Agent builder', section:'Workspace', after:'c38', icon:'settings', next:'model-compare' },
  // 4 Nov: Number field beside Filter menu, which sat alone in its row
  { cid:'c163', id:'number-field', title:'Number field', section:'Collaboration', after:'c128', icon:'tune', next:'filter-menu' },
  // 5 Nov: Image generation, wide, after Artifact card with what an agent makes (Thinking states, on its own branch, takes c164)
  { cid:'c165', id:'image-generation', title:'Image generation', section:'Conversation', after:'c108', icon:'stars', next:'artifact-card' },
  // 5 Nov: Thinking states, a choice of thinking indicators, after Step loader and its four loaders; wide like it, so the row stays full
  { cid:'c164', id:'thinking-states', title:'Thinking states', section:'Agent status', after:'c1', icon:'stars', next:'step-loader' }
];
// a card placed after a new one that isn't there yet goes where that one would have gone
for (const x of NEW){ let a = NEW.find(y => y.cid === x.after); while (a && !soft.includes(`data-c="${a.id}" id="c-${a.id}"`)){ x.after = a.after; a = NEW.find(y => y.cid === x.after); } }
NEW.splice(0, NEW.length, ...NEW.filter(x => soft.includes(`data-c="${x.id}" id="c-${x.id}"`)));
for (const x of NEW){ MAP[x.cid] = x.id; EXTRA.push({ cid:x.cid, id:x.id, reg:x.id, title:x.title, section:x.section, after:x.after, icon:x.icon }); }

/* ---------- read the Soft 2 page ---------- */
const cssA = soft.indexOf('<style>\n[hidden]') + '<style>'.length;
// on designme.dev the dark stage is a neutral #1c1c1c, so the components' dark greys drop their blue (Soft) and warm (Blueprint)
// tint and sit one step lighter than the stage, the same grey the site's panels used before
const NEUTRAL_DARK = { '--page':'#111111', '--stage':'#1c1c1c', '--surface':'#262626', '--raised':'#2c2c2c', '--fg':'#f2f2f2', '--fg2':'#c9c9c9',
  '--muted':'#c0c0c0', '--faint':'#555555', '--rail':'#414141', '--line':'#333333', '--chip':'#303030', '--hover':'#373737', '--press':'#3f3f3f',
  '--wash':'#2c2c2c', '--soft':'#323232', '--soft-h':'#3a3a3a', '--dis':'#737373', '--ink':'#f2f2f2', '--on-ink':'#161616', '--field-line':'#424242', '--field-line-strong':'#808080' };
function neutralDark(text){
  const root = postcss.parse(text);
  root.walkRules(rule => {
    if (!rule.selectors.every(sel => /^:root(\[data-style="bp"\])?(\[data-theme="dark"\]|:not\(\[data-theme="light"\]\))$/.test(sel.trim()))) return;
    rule.walkDecls(d => { if (NEUTRAL_DARK[d.prop]) d.value = NEUTRAL_DARK[d.prop]; });
  });
  return root.toString();
}
// the site's own styles (the original page and its patches) had blue-tinted greys; each becomes the neutral grey of the same
// luminance, so every contrast stays where it was. The chrome's three text greys take the steps of Soft's scale instead
// (--sh-muted's #8b8f99 was 3.2:1, #6a6a6a is 5.3:1), and none of them is used on a dark background
const NEUTRAL_SITE = { '#111318':'#121212', '#5b5f6b':'#525252', '#8b8f99':'#6a6a6a',
  '#080918':'#0a0a0a', '#17181d':'#181818', '#121317':'#131313', '#0b0c0f':'#0c0c0c', '#16171b':'#171717', '#111216':'#121212', '#a1a3ab':'#a3a3a3',
  '#76787f':'#787878', '#c3c6d1':'#c6c6c6', '#0c0e20':'#0f0f0f', '#070e1d':'#0e0e0e', '#0a0b1a':'#0c0c0c', '#0b0d1f':'#0e0e0e', '#f4f5f7':'#f5f5f5',
  '#e2e4ea':'#e4e4e4', '#4b5163':'#515151', '#f4f4f7':'#f4f4f4', '#6b6d7c':'#6e6e6e', '#f3f4f6':'#f4f4f4', '#9ca3af':'#a2a2a2', '#6b7280':'#727272',
  '#b3b8c4':'#b8b8b8', '#5d616c':'#616161', '#151821':'#181818', '#9a9aa6':'#9b9b9b', '#ededee':'#ededed', '#f1f1f3':'#f1f1f1',
  'rgba(17,19,24,':'rgba(18,18,18,', 'rgba(12,14,32,':'rgba(15,15,15,', 'rgba(8,9,24,':'rgba(10,10,10,', 'rgba(18,19,23,':'rgba(19,19,19,',
  'rgba(11,12,15,':'rgba(12,12,12,', 'rgba(244,244,247,':'rgba(244,244,244,' };
const neutralSite = text => text.replace(/#[0-9a-fA-F]{6}(?![0-9a-zA-Z])|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,/g, m => NEUTRAL_SITE[m.toLowerCase().replace(/\s+/g, '')] || m);
// the accent's roles: a fill stays var(--accent); text and icons in it take --accent-fg, and lines, borders, rings and chart marks
// take --accent-mark, each falling back to the accent. A light accent like lime then keeps its fills and stays readable as text
function accentRoles(text){
  const ROLE = { color:'fg', 'caret-color':'fg', 'text-decoration-color':'fg', 'text-decoration':'fg', 'text-emphasis-color':'fg' };
  return text.replace(/(^|[;{\s])((?:color|caret-color|text-decoration(?:-color)?|text-emphasis-color|stroke|fill|outline(?:-color)?|border(?:-[a-z-]+)?|box-shadow|column-rule(?:-color)?)\s*:)([^;{}]*)/g,
    (m, pre, prop, val) => pre + prop + val.replace(/(?<!--accent-(?:fg|mark),)var\(--accent\)/g, `var(--accent-${ROLE[prop.slice(0, -1).trim()] || 'mark'},var(--accent))`));
}
// hover styles apply only where there is a mouse (hover-gate.js): everything below, the homepage, the code viewer, the
// registry and core.css, and the React CSS synced from them, gets them gated
const { hoverGate, ungated } = require('./hover-gate');
const CSS = hoverGate(accentRoles(neutralDark(soft.slice(cssA, soft.indexOf('</style>', cssA)))));
/* the touch tap areas (the core's @media (pointer:coarse) block) draw on a control's ::before, or its ::after where the
   component already draws with the ::before. Every selector that draws with either has to be in that block's lists, so a new
   component's drawing is never replaced by a tap area */
{
  const root = postcss.parse(CSS); let hit = null; const used = { before:new Set(), after:new Set() };
  root.walkRules(r => {
    if (r.parent && r.parent.type === 'atrule' && /keyframes/.test(r.parent.name)) return;
    if (r.some(d => d.prop === '--dm-hit')){ hit = r; return; }
    if (!r.some(d => d.prop === 'content' && !/^(none|normal)$/.test(d.value.trim()))) return;
    for (const sel of r.selectors){ const m = sel.match(/^(.*?)::?(before|after)\s*$/); if (m && !/(^|[\s>+~(])\.(card|card-h|card-f|stage)(?![\w-])/.test(m[1])) used[m[2]].add(m[1].trim()); }
  });
  if (!hit) throw new Error('the touch tap area rule (--dm-hit) is missing from the core CSS');
  const list = (sel, k) => { const m = sel.match(k === 'before' ? /:not\(:where\((.*)\)\)::before$/ : /:not\(:where\((.*)\)\)::after$/); return m ? postcss.list.comma(m[1]).map(x => x.trim()) : []; };
  const listed = { before:new Set(hit.selectors.flatMap(x => list(x, 'before'))), after:new Set(hit.selectors.flatMap(x => list(x, 'after'))) };
  for (const k of ['before', 'after']){
    const miss = [...used[k]].filter(x => !listed[k].has(x));
    if (miss.length) throw new Error(`these draw with a ::${k}; add them to the touch tap area lists in soft-2/index.html: ${miss.join(', ')}`);
  }
}
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
// a component's DM.def block, with any helpers its section keeps just before it (like Voice orb's shader), so the code
// people copy runs on its own
const defOf = id => { const a = DEFS_JS.indexOf(`DM.def('${id}'`); if (a < 0) return ''; const b = DEFS_JS.indexOf('\n});', a) + 4;
  const h = DEFS_JS.lastIndexOf('/* ---------- ', a), he = h < 0 ? -1 : DEFS_JS.indexOf('*/\n', h);
  const start = he > 0 && he < a && !DEFS_JS.slice(he, a).includes('DM.def(') ? he + 3 : a;
  return DEFS_JS.slice(start, b).trim(); };

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
  // the touch tap areas are written for controls inside a stage; here that is the mount root
  sel = sel.replace(/^:where\(\.stage-in\) /, '.v2 ');
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
// the accent's roles come from the components' own tokens, the same declarations core.css and the React CSS are made from,
// so the cards and the component pages can't drift apart. A colour picked in the site's accent picker (window.dmAccent, which
// sets the roles on <html> and marks it .acc-on) takes over: a role with a fixed value steps aside while one is picked, and
// one worked out from the accent (like --accent-2, a color-mix of var(--accent)) stays and follows the picked colour
const ROLES = /^--(accent|accent-2|accent-bg|on-accent|accent-fg|accent-mark)$/;
const pickable = sel => sel === '.v2' ? ':root:not(.acc-on) .v2' : sel.replace(/^(:root\S*) \.v2$/, '$1:not(.acc-on) .v2');
css.walkRules(rule => {
  if (!rule.selectors.some(s => /\.v2$/.test(s)) || rule.selector.includes('.acc-on')) return;
  const fixed = []; rule.walkDecls(ROLES, d => { if (!/var\(/.test(d.value)) fixed.push(d); });
  if (!fixed.length) return;
  if (!rule.selectors.every(s => /^(:root\S* )?\.v2$/.test(s))) throw new Error('accent roles on a selector the picker can\'t step past: ' + rule.selector);
  const gated = rule.clone({ selectors:rule.selectors.map(pickable) }); gated.removeAll(); fixed.forEach(d => gated.append(d.clone()));
  fixed.forEach(d => d.remove()); rule.after(gated); if (!rule.nodes.length) rule.remove();
});
const scoped = css.toString();
const V2CSS = `/* ===== Soft 2 and Blueprint 2 components: scoped to .v2, so the site's styles and these never touch ===== */
:where(.v2, .v2 *:not(svg, svg *)), :where(.v2, .v2 *:not(svg, svg *))::before, :where(.v2, .v2 *:not(svg, svg *))::after, :where(.v2 *)::placeholder{all:revert}
/* svg is left out of the reset (it would drop presentation attributes), so its colour is reset on its own; the site's .s is a code colour */
:where(.v2) svg{color:inherit}
${scoped}
/* a card far from the screen is hidden and its animations paused (see dm-idle in the mount script) */
/* its contents are skipped entirely (no layout, paint or layers) while the stage keeps its measured height */
.comp.dm-idle .stage-in{content-visibility:hidden}
.comp.dm-idle .stage-in *,.comp.dm-idle .stage-in *::before,.comp.dm-idle .stage-in *::after{animation-play-state:paused!important}
/* base for the mount root, which sits inside the site's stage */
.v2{font-family:var(--sans);font-size:14px;line-height:1.5;color:var(--fg);font-weight:400;letter-spacing:normal;text-align:left;-webkit-font-smoothing:antialiased}
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
  const waiting = new Set($$('.comp[data-v2]'));
  // and keep following it when the component flips it itself, as Banner's demo does
  const mount = (comp, now) => { waiting.delete(comp); DM.mount(comp, now); syncTabs(comp);
    if (comp._tabsMo) comp._tabsMo.disconnect(); const sg = demoSeg(comp);
    if (sg){ comp._tabsMo = new MutationObserver(() => syncTabs(comp)); comp._tabsMo.observe(sg, { subtree:true, attributes:true, attributeFilter:['aria-pressed'] }); } };
  // a card mounts a quarter of a screen before it scrolls into view, so it has its component by the time it shows
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ io.unobserve(en.target); mount(en.target); } }), { rootMargin:'25% 0px' });
  // a card far from the screen stops drawing: its demo is hidden (the space it takes stays) and its CSS animations pause,
  // so a long visit never piles up a hundred running demos for the browser to paint. They pick up again a screen or so
  // before scrolling back into view. The height measuring script turns this off, since it reads every card at once
  if (!window.DM_NO_IDLE){ const idle = new IntersectionObserver(es => es.forEach(en => en.target.classList.toggle('dm-idle', !en.isIntersecting)), { rootMargin:'1000px 0px' }); $$('.comp[data-v2]').forEach(comp => idle.observe(comp)); }
  // the observers report a frame late, so a jump or a fling could land on a card that hasn't mounted yet, or is still
  // hidden, and paint it empty for a frame. As the page scrolls, any card on screen that hasn't mounted mounts at once and
  // shows without the entrance (which starts from nothing), and after a long jump any hidden card on screen shows again,
  // both in the same frame
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const near = (r, m) => r.height && r.bottom > -m && r.top < innerHeight + m;
    for (const comp of waiting) if (near(comp.getBoundingClientRect(), 0)){ io.unobserve(comp); mount(comp, true); }
    if (Math.abs(scrollY - lastY) > 400) $$('.comp.dm-idle').forEach(comp => { if (near(comp.getBoundingClientRect(), 200)) comp.classList.remove('dm-idle'); });
    lastY = scrollY;
  }, { passive:true });
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
  // the site's own hover styles are gated the same way as the components'
  own = hoverGate(own);
  site = site.slice(0, a) + '<style>\n@layer site{' + own + '\n}\n</style>\n<style id="v2-css">\n' + V2CSS + '</style>' + HEIGHTS_CSS + site.slice(b + 8);
}
/* ---------- site: React and Astro components have shipped (the FAQ answer and the roadmap's own list) ---------- */
for (const [a, b, n] of [
  ["React and Tailwind versions are in progress, and you can follow them on the <a href=\"#/roadmap\">roadmap</a>. Sign up and you will get them as soon as they land.",
   "Yes. Every component comes in HTML, React and Astro: run npx designme add with the component name and <span class=\"nowrap\">--react</span> or <span class=\"nowrap\">--astro</span>, and the component lands in your project with its styles. The React version works in Next.js and React apps, and the shadcn CLI can add either one. To give them your shadcn/ui or Tailwind v4 theme, add the theme bridge with <span class=\"nowrap\">--theme-bridge</span>. A version styled with Tailwind classes is in progress on the <a href=\"#/roadmap\">roadmap</a>.", null],
  ["['react','React and Tailwind versions','Every component as a typed React component styled with Tailwind.','progress','Code'],",
   "['react','React components','Every component as a typed React component for Next.js, React and Astro, with npx designme add <name> --react.','shipped','Code'],\n      ['astro','Astro components','Every component as an Astro component, with npx designme add <name> --astro.','shipped','Code'],\n      ['tailwind','Tailwind versions','Every component styled with Tailwind classes instead of its own CSS.','progress','Code'],", 1]
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
const NARROW = ['plan-review', 'form', 'payment-form'];
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
  // a new card is as wide as its component is drawn, whatever the card it was cut from
  const wide = C.cls.includes('wide') || STRETCH.includes(id) || (/class="comp wide"/.test(attrs) && !NARROW.includes(id) && !NEW.some(x => x.id === id));
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
  's-conversation': ['live-answer', 'composer', 'thread-panel', 'artifact-card', 'rich-text-editor', 'tool-call', 'voice-capture', 'voice-orb', 'answer-action-bar', 'response-versions', 'model-picker', 'prompt-starters', 'prompt-library', 'attachment-tray', 'feedback-sheet'],
  's-status': ['thinking', 'reasoning-trail', 'agent-lanes', 'agent-tree', 'agent-inbox', 'trace-view', 'browser-session', 'run-summary', 'agent-run-timeline', 'action-log', 'context-meter', 'error-recovery', 'run-queue', 'run-cost', 'toast-stack', 'toast', 'status-pill', 'step-loader'],
  's-review': ['change-review', 'plan-review', 'permission-gate', 'human-handoff', 'decision-prompt', 'proposal-card', 'design-tuner', 'rewrite-toolbar', 'launch-checklist', 'inline-text-diff', 'draft-review', 'steering', 'eval-results', 'design-review'],
  's-data': ['code-viewer', 'terminal-stream', 'citation-hover', 'source-stack', 'field-extraction', 'metric-insight', 'details-panel', 'task-table'],
  's-workspace': ['automation-canvas', 'command-palette', 'memory-panel', 'model-compare', 'agent-settings', 'tool-connections', 'knowledge-sources', 'scheduled-runs', 'file-explorer', 'workspace-rail'],
};
// Banner leads Collaboration (owner, 3 Nov); a half-width card further down fills the row the move opens (grid dense)
ORDER['s-collab'] = ['banner', 'comments', 'notifications', 'invite', 'reactions', 'profile-menu', 'context-switcher', 'filter-menu', 'ticket-list', 'kanban'];
// Canvas toolbar follows Automation canvas
ORDER['s-workspace'].splice(ORDER['s-workspace'].indexOf('automation-canvas') + 1, 0, 'canvas-toolbar');
// the new components in the sections that have an order
for (const x of NEW) if (x.next){ const sec = Object.values(ORDER).find(ids => ids.includes(x.next)); sec.splice(sec.indexOf(x.next) + 1, 0, x.id); }
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
// the sidebar's component groups are written from the main list, the same one the component pages' sidebar reads (through
// tools/pages/data/site.json, below): each section's group, in section order, with the section's name, its count, and a
// link to each of its cards in card order under the card's own title. So the sidebar and the page can't drift apart
{
  const grp = id => { const a = site.indexOf(`<div class="side-grp" data-s="${id}"`); if (a < 0) throw new Error('no side group ' + id); return a; };
  const [ga, gb] = SECTIONS_FIRST.map(grp), next = i => site.indexOf('<div class="side-grp" data-s="', i + 10), gEnd = next(ga);
  if (next(gb) !== ga) throw new Error('side groups not next to each other');
  site = site.slice(0, gb) + site.slice(ga, gEnd) + site.slice(gb, ga) + site.slice(gEnd);
  site = site.replace(/<div class="side-grp" data-s="([\w-]+)">/g, (m, id) => { if (!GRP[id]) throw new Error('no set for ' + id); return `<div class="side-grp" data-s="${id}" data-grp="${GRP[id]}">`; });
  const secs = [...main.matchAll(/<section class="lib-sec" id="([\w-]+)"[^>]*>([\s\S]*?)<\/section>/g)];
  const groups = (site.match(/<div class="side-grp" data-s="s-/g) || []).length;
  if (secs.length !== groups) throw new Error(`${secs.length} sections on the page but ${groups} groups in the sidebar`);
  for (const [, sid, body] of secs){
    const name = body.match(/<h2>([^<]*)<\/h2>/)[1];
    const cards = [...body.matchAll(/<article\b[^>]*\bid="(c\d+)"[^>]*>[\s\S]*?class="comp-title">([^<]*)</g)].map(([, cid, t]) => `<a class="side-a" href="#${cid}" data-c="${cid}">${t}</a>`);
    if (!cards.length) throw new Error('no cards in ' + sid);
    const g = grp(sid), head = site.indexOf('</button>', g), ul = site.indexOf('<div class="side-ul">', g) + '<div class="side-ul">'.length, end = site.indexOf('</div>', ul);
    const btn = site.slice(g, head).replace(/(<span class="nm">)[^<]*(<\/span>)/, (m, x, y) => x + name + y).replace(/(<span class="side-n">)\d+(<\/span>)/, (m, x, y) => x + cards.length + y);
    site = site.slice(0, g) + btn + site.slice(head, ul) + cards.join('') + site.slice(end);
  }
}
const missing = Object.keys(MAP).filter(k => !done.includes(k));
if (missing.length) warn.push('cards not swapped: ' + missing.join(','));

/* ---------- the code people copy or install: original CSS and JS, Blueprint by default and Soft with data-style="soft" ---------- */
const ELEM = /^(\*|button|input|textarea|select|b|strong|:focus-visible|\[hidden\])(?![\w-])/;
/* the style hangs off the page, never off a stage: Blueprint is the default, Soft is data-style="soft" on <html> or on any
   element around the components. So the base tokens (Soft's) also sit on any [data-style="soft"], and every Blueprint rule
   steps aside inside one. Blueprint's sweeping rules (every corner square, no blur, square svg shapes) reach only what the
   components draw: their card ([data-c]), the tooltip and the kanban drag ghost (both on <body>), never the rest of your page */
const SOFT_HERE = '[data-style="soft"]', NOT_SOFT = ':not(:where([data-style="soft"],[data-style="soft"] *))';
const DRAWN = ['[data-c]', '.tip', '.kbx-k.ghost'];
// adds a condition to the element a selector picks (its last compound), ahead of any pseudo-element
function onSubject(sel, cond){
  let depth = 0, start = 0;
  for (let i = 0; i < sel.length; i++){ const ch = sel[i]; if (ch === '(' || ch === '[') depth++; else if (ch === ')' || ch === ']') depth--; else if (!depth && /[\s>+~]/.test(ch)) start = i + 1; }
  let at = sel.length; depth = 0;
  for (let i = start; i < sel.length; i++){ const ch = sel[i]; if (ch === '(' || ch === '[') depth++; else if (ch === ')' || ch === ']') depth--; else if (!depth && sel.startsWith('::', i)){ at = i; break; } }
  return sel.slice(0, at) + cond + sel.slice(at);
}
function styleScope(sel){
  if (!sel.startsWith(':root')) return [sel];
  // the root's own conditions: [attr] and :not(...) right after :root
  let i = 5;
  for (;;){
    const close = sel[i] === '[' ? ']' : sel.startsWith(':not(', i) ? ')' : null; if (!close) break;
    let depth = 0; for (; i < sel.length; i++){ if (sel[i] === '(' || sel[i] === '[') depth++; else if (sel[i] === ')' || sel[i] === ']'){ if (!--depth){ i++; break; } } }
  }
  if (i < sel.length && !/\s/.test(sel[i])) return [sel];
  const attrs = sel.slice(5, i), rest = sel.slice(i).trim(), bp = attrs.includes(':not([data-style="soft"])');
  if (!rest) return bp ? [sel] : [sel, attrs ? `:root${attrs} ${SOFT_HERE}` : SOFT_HERE];
  if (!bp) return [sel];
  let r = rest;
  if (/^\*/.test(r)) r = `:where(${DRAWN.flatMap(x => [x, x + ' *']).join(',')})` + r.slice(1);
  else if (/^[a-z]/.test(r)) r = `:where(${DRAWN.join(',')}) ` + r;
  return [`:root${attrs} ${onSubject(r, NOT_SOFT)}`];
}
function regCss(text){
  const root = postcss.parse(text);
  root.walkRules(rule => {
    if (rule.parent.type === 'atrule' && /keyframes/.test(rule.parent.name)) return;
    const out = [...new Set(rule.selectors.map(sel => {
      sel = sel.trim().replace(/\[data-style="bp"\]/g, ':not([data-style="soft"])').replace(/^:where\(\.stage-in\) /, ':where([data-c]) ').replace(/\.stage:has\(\.dm\)>\.stage-in/g, '.stage-in:has(>.dm)');
      if (SHELL.test(sel)) return null;
      if (/(^|[\s>+~(])\.stage(?![\w-])/.test(sel)) return null;
      if (/(^|[\s>+~(])\.card(?![\w-])/.test(sel) && !/\.card\.(bare|wide) \.stage-in/.test(sel)) return null;
      // element resets only reach inside components, never the rest of your page
      if (ELEM.test(sel)) return ':where([data-c]) ' + sel; // :where keeps the reset as weak as a bare element selector
      return sel;
    }).filter(Boolean).flatMap(styleScope))];
    if (!out.length) rule.remove(); else rule.selectors = out;
  });
  root.walkAtRules('media', at => { if (!at.nodes || !at.nodes.length) at.remove(); });
  return root.toString().replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
const REG_CORE_CSS_SITE = `/* Designme shared core: tokens for Blueprint (default) and Soft (data-style="soft" on <html> or on any element around the components), light and dark (<html data-theme="dark">) */\n`
  + regCss(CSS.slice(0, CSS.indexOf('/* ---------- Status pill ---------- */')) + '\n' + CSS.slice(CSS.indexOf('/* ---------- Blueprint 2 ---------- */')))
  + `\n/* a component card: the template renders into .stage-in */\n[data-c]{width:440px;max-width:100%;font-family:var(--sans);font-size:14px;line-height:1.5;color:var(--fg);-webkit-font-smoothing:antialiased}\n[data-c].wide{width:720px}\n`;
const REG_CORE_JS_SITE = CORE_JS.trim() + `\n\n/* ---------- icons: the sprite every <use href="#i-..."> points at ---------- */\nconst SPRITE = ${JSON.stringify(SPRITE)};\n`
  + `/* ---------- mount: every card (a [data-c] with its .stage-in) starts its component when it scrolls into view ---------- */\ndocument.addEventListener('DOMContentLoaded', () => {\n  if (!document.getElementById('i-check')) document.body.insertAdjacentHTML('afterbegin', SPRITE);\n  document.body.appendChild(tip);\n  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ io.unobserve(en.target); DM.mount(en.target); } }), { threshold:.25 });\n  // a menu item inside a component can carry a data-c of its own (a colour), so only a card with a stage counts\n  $$('[data-c]').filter(card => $(':scope > .stage-in', card)).forEach(card => io.observe(card));\n});\n`;
/* the markup as you would write it: the component's template with its icons drawn in where the template keeps a {name}
   for them, the way its script draws them as it mounts. The script's own statements up to that replacement run here, on
   the template's text, with the core's icon and avatar helpers; the core mounts markup written out like this as it is */
const vm = require('vm');
const HELPERS = ['const I = ', 'const AV = ', 'const BRAND = ', 'const FLAG = ', 'const FLAGS = '].map(h => {
  const line = CORE_JS.split('\n').find(l => l.startsWith(h)); if (!line) throw new Error('core helper not found: ' + h); return line; }).join('\n');
const markupOf = id => {
  const C = CARDS[id], src = defOf(id), at = src.indexOf(`DM.def('${id}'`);
  if (at < 0 || !/\{[\w-]+\}/.test(C.tpl)) return C.tpl;
  const fn = acorn.parse(src.slice(at), { ecmaVersion:'latest' }).body[0].expression.arguments[1], body = fn.body.body;
  const k = body.findIndex(st => st.type === 'ExpressionStatement' && /^r\.innerHTML\s*=\s*r\.innerHTML/.test(src.slice(at).slice(st.start, st.end)));
  if (k < 0){ warn.push('no placeholder statement for ' + id); return C.tpl; }
  const run = body.slice(0, k + 1).map(st => src.slice(at).slice(st.start, st.end)).join('\n');
  const r = { innerHTML:C.tpl };
  try { vm.runInNewContext(`const REDUCE = false;\n${HELPERS}\n${run}`, { r, navigator:{ platform:'', userAgent:'' }, encodeURIComponent }); }
  catch(e){ warn.push(`placeholders of ${id} not drawn: ${e.message}`); return C.tpl; }
  if (/\{(?:[a-z][\w-]*)\}/.test(r.innerHTML.replace(/\$\{[^}]*\}/g, ''))) warn.push('placeholder left in ' + id + ': ' + r.innerHTML.match(/\{[a-z][\w-]*\}/)[0]);
  return r.innerHTML;
};
/* a design switch that is the homepage card's alone (<div class="dm …" data-designs="card">, its first design Classic, the
   component as it ships): the card shows the designs under review as its footer tabs, and the registry, the code view and
   the component page install Classic on its own, as it was */
const shipped = tpl => { const m = tpl.match(/^\s*<div class="dm [\w-]+" data-designs="card"><div class="dm-main">([\s\S]*?)<\/div>\s*<div class="demo">[\s\S]*<\/div>\s*$/); return m ? m[1] : tpl; };
const regHtml = id => { const C = CARDS[id], cls = ['card', ...C.cls.filter(c => c === 'wide' || c === 'bare')].join(' ');
  // the DesignMe smiley over the Agent harness greeting is the site's demo only: an install gets the empty mark slot (owner, 4 Nov)
  const inner = shipped(markupOf(id)).replace(/<svg class="ahx-brand"[\s\S]*?<\/svg>/, '').trim().split('\n').map(l => l.trim() ? '    ' + l : '').join('\n');
  return `<div class="${cls}" data-c="${id}">\n  <div class="stage-in">\n${inner}\n  </div>\n</div>\n`; };
/* the designs of a card with a data-designs="card" switch, for its component page (owner, 4 Nov: every state shows there
   too): the card with its switch (the template as the homepage has it), the designs' own CSS section and the block of script
   that adds them over Classic. The page loads them after the registry's files; npx designme add still installs Classic */
const designsOf = id => {
  const C = CARDS[id]; if (!/^\s*<div class="dm [\w-]+" data-designs="card">/.test(C.tpl)) return null;
  const cls = ['card', ...C.cls.filter(c => c === 'wide' || c === 'bare')].join(' ');
  const inner = markupOf(id).trim().split('\n').map(l => l.trim() ? '    ' + l : '').join('\n');
  const head = `/* ---------- ${C.title} designs ---------- */`, h = DEFS_JS.indexOf(head);
  if (h < 0){ warn.push('no designs script for ' + C.title); return null; }
  const a = DEFS_JS.indexOf('\n{\n', h) + 1, blk = acorn.parse(DEFS_JS.slice(a), { ecmaVersion:'latest' }).body[0];
  if (blk.type !== 'BlockStatement' || !DEFS_JS.slice(a, a + blk.end).includes(`DM.def('${id}'`)) { warn.push('designs script of ' + C.title + ' not found'); return null; }
  const css = SECTIONS[C.title + ' designs']; if (!css) warn.push('no designs CSS for ' + C.title);
  const names = [...C.tpl.matchAll(/<div class="demo"><div class="seg2"[^>]*>([\s\S]*?)<\/div><\/div>/g)].pop()[1].match(/data-v="[^"]+">[^<]*/g).map(x => x.split('>')[1].replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&'));
  return { names, html:`<div class="${cls}" data-c="${id}">\n  <div class="stage-in">\n${inner}\n  </div>\n</div>\n`,
    css:css ? regCss(css) : '', js:head + '\n' + DEFS_JS.slice(a, a + blk.end) + '\n' };
};
/* what the registry installs has --dm- CSS variables (token-prefix.js), so it never meets a page's own --accent or --muted; the
   site keeps its names. TOKENS is every variable the components use, from all of their CSS, scripts and markup */
const PRE = require('./token-prefix.js');
const TOKENS = PRE.tokens({ css:[REG_CORE_CSS_SITE, ...Object.values(SECTIONS)], all:[CORE_JS, DEFS_JS, ...Object.values(CARDS).map(C => C.tpl)] });
const dmCode = x => ({ ...x, html:PRE.html(x.html, TOKENS), css:PRE.css(x.css), js:PRE.js(x.js, TOKENS) });
const REG_CORE_CSS = PRE.css(REG_CORE_CSS_SITE), REG_CORE_JS = PRE.js(REG_CORE_JS_SITE, TOKENS);
const regOne = id => { const C = CARDS[id], sec = SECTIONS[C.title] || ''; if (!sec) warn.push('no CSS section for ' + C.title);
  return dmCode({ html:regHtml(id), css:`/* ---------- ${C.title} ---------- */\n` + regCss(sec), js:defOf(id) + '\n' }); };

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
  // then the pictures in the carousels' demos, which only the site shows (art/art.js), and the phone's DesignMe card (fab/fab.js)
  site = site.slice(0, end) + '<script id="v2-js">\n' + V2JS + '</script>\n<script src="/art/art.js" defer></script>\n<script src="/fab/fab.js" defer></script>\n' + site.slice(end);
}
/* ---------- site: the HTML / React switch in the code views, and thumbnails of components not yet started ---------- */
for (const [a, b] of SITE_PATCHES.patches){
  const count = site.split(a).length - 1;
  if (count !== 1) throw new Error(`site patch matched ${count} times: ${a.slice(0, 70)}`);
  site = site.replace(a, () => b);
}
/* ---------- Your theme: the script that puts a visitor's pasted shadcn/Tailwind v4 theme over the demos (theme-bridge.js),
   right after the head's script that picks the style, so a saved theme is on before the page paints ---------- */
{
  const at = site.indexOf('if(st==="soft"||st==="mine")'), end = at < 0 ? -1 : site.indexOf('</script>', at);
  if (end < 0) throw new Error("the head's style script (make-patches.py) no longer knows Your theme");
  site = site.slice(0, end + 9) + '\n<script>' + require('./theme-bridge.js').previewScript() + '</script>' + site.slice(end + 9);
}
// each card's title links to the component's own page (a plain click still opens it in place, see make-patches.py)
site = site.replace(/(<article\b[^>]*\bdata-reg="([\w-]+)"[^>]*>[\s\S]*?<h2 class="comp-title">)([^<]*)<\/h2>/g, (m, head, reg, t) => `${head}<a href="/components/${reg}">${t}</a></h2>`);
/* ---------- site: the old site stylesheet ships only the rules the page still uses ----------
   site-css-unused.txt lists the rules of the @layer site stylesheet that nothing on the page uses (see the file's header for
   how they were found). Each line starts with a hash of the rule as it stands here, with its @media or @supports, so a rule
   that has changed since the list was made keeps shipping. A comment left heading only removed rules goes with them */
{
  const key = n => { const at = []; for (let p = n.parent; p && p.type !== 'root'; p = p.parent) if (p.type === 'atrule') at.unshift(`@${p.name} ${p.params}`);
    return require('crypto').createHash('sha1').update(at.join('\n') + '\n' + n.toString()).digest('hex').slice(0, 12); };
  const unused = new Set(fs.readFileSync(path.join(__dirname, 'site-css-unused.txt'), 'utf8').split('\n').filter(l => /^[0-9a-f]{12}\t/.test(l)).map(l => l.slice(0, 12)));
  const a = site.indexOf('<style>\n@layer site{') + '<style>'.length, b = site.indexOf('</style>', a);
  if (a < 7) throw new Error('site stylesheet not found');
  const root = postcss.parse(site.slice(a, b)), gone = new Set(), hit = new Set();
  root.walk(n => { if (n.type === 'rule' || n.type === 'atrule' && /keyframes$/.test(n.name)){ const k = key(n); if (unused.has(k)){ gone.add(n); hit.add(k); } } });
  root.walk(n => { if (n.type !== 'comment') return;
    const next = []; for (let x = n.next(); x && x.type !== 'comment'; x = x.next()) next.push(x);
    if (next.length && next.every(x => gone.has(x))) gone.add(n); });
  const before = b - a, rules = [...gone].filter(n => n.type !== 'comment').length;
  gone.forEach(n => n.remove());
  // @media and @supports blocks left empty
  for (let again = true; again;){ again = false; root.walkAtRules(n => { if (n.nodes && !n.nodes.length){ n.remove(); again = true; } }); }
  const css = root.toString();
  site = site.slice(0, a) + css + site.slice(b);
  console.log(`site css: left out ${rules} unused rules, ${before - css.length} bytes; ${css.length} bytes ship`);
  if (hit.size < unused.size) warn.push(`${unused.size - hit.size} rules in site-css-unused.txt have changed or gone and were not left out`);
}
// nothing on the page, in the registry or in core.css keeps a hover style a touch screen could get stuck in
{
  const left = [...site.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].filter(m => !m[1].includes('${')).flatMap(m => ungated(m[1]))
    .concat(ungated(REG_CORE_CSS), ...Object.values(SECTIONS).map(ungated));
  if (left.length) throw new Error('hover styles outside (hover:hover) and (pointer:fine): ' + left.slice(0, 5).join(' | '));
}
// the site's own styles take the neutral greys (the components' styles, #v2-css, come from soft-2/index.html already neutral)
site = site.replace(/(<style(?![^>]*id="v2-css")[^>]*>)([\s\S]*?)(<\/style>)/g, (m, a, css, b) => a + neutralSite(css) + b);
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

> ${count} free, MIT-licensed UI components for products built around AI agents: status pills, reasoning trails, tool calls, permission gates, plan reviews, run summaries and more, plus the app basics around them (charts, dates, forms, tables). Each one comes as plain HTML, CSS and JS, as a typed React component with no dependencies beyond React, or as an Astro component, in two styles (Soft and Blueprint) with light and dark mode.

Install with the CLI, which copies each component's source into your project so you own it:

- HTML: \`npx designme add <name>\` adds the component and the shared core it needs.
- React: \`npx designme add <name> --react\` adds a \`.tsx\` component and its CSS. Needs React 19, and works with Next.js (App Router), Vite and Astro islands.
- Astro: \`npx designme add <name> --astro\` adds an \`.astro\` component with the HTML version's CSS and script, and the shared core.
- shadcn CLI: \`npx shadcn@latest add https://designme.dev/r/shadcn/<name>.json\` (React) or \`https://designme.dev/r/shadcn/astro/<name>.json\` (Astro).

Every CSS variable starts with \`--dm-\` in every version, and in the React version every class and animation name starts with \`dm-\` too, so the components sit beside Tailwind, shadcn/ui or any other CSS. Each component below links to its page as Markdown: what it is for, how to install and use it, its React props, questions and its React source. The same page with a live demo is at the same address without \`.md\`, and every component is on the homepage, https://designme.dev/.
`;
  // the docs pages that tools/pages builds, each as Markdown too
  const DOCS = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../pages/src/lib/docs-list.json'), 'utf8'));
  md += `\n## Docs\n\n` + DOCS.map(d => `- [${d.title}](https://designme.dev/docs/${d.slug}.md): ${d.desc}`).join('\n') + '\n';
  for (const g of Object.keys(SETS)){
    md += `\n## ${SETS[g]}\n`;
    for (const sec of secs.filter(x => x.grp === g && x.cards.length)){
      md += `\n### ${sec.title}\n\n${sec.about ? sec.about + '\n\n' : ''}`;
      md += sec.cards.map(c => `- [${c.t}](https://designme.dev/components/${c.reg}.md): ${c.d} Install: \`npx designme add ${c.reg}\``).join('\n') + '\n';
    }
  }
  md += `\n## Optional\n\n- [Component pages](https://designme.dev/components/composer): one page per component, at /components/<name>, with its demo, install, usage, props and code.\n- [The homepage](https://designme.dev/): every demo on one page, in both styles.\n- [Registry](https://designme.dev/r/react/composer.json): each component's React source as JSON, at /r/react/<name>.json (HTML at /r/<name>.json, Astro at /r/astro/<name>.json, shadcn items at /r/shadcn/<name>.json).\n`;
  if (count !== done.length) warn.push(`llms.txt lists ${count} of ${done.length} components`);
  // the same sections and cards, in page order, for the component pages that tools/pages builds
  const PAGES_DATA = path.resolve(__dirname, '../pages/data/site.json');
  fs.mkdirSync(path.dirname(PAGES_DATA), { recursive:true });
  const cardsAll = [...site.matchAll(/<article\b([^>]*)>[\s\S]*?class="comp-title">([\s\S]*?)<\/h2>[\s\S]*?class="comp-desc">([\s\S]*?)<\/p>/g)];
  const meta = {}; for (const [, attrs] of cardsAll){ const reg = (attrs.match(/data-reg="([\w-]+)"/) || [])[1]; if (reg) meta[reg] = { v2:(attrs.match(/data-v2="([\w-]+)"/) || [])[1], wide:/class="comp wide/.test(attrs) }; }
  // the sidebar's icons (the site's own Phosphor set, which the homepage draws in its sidebar in both styles), so the docs and
  // component pages draw the same Library, Docs, Changelog, Roadmap and FAQ rows
  const shell = JSON.parse(site.match(/const PH_SHELL = (\{.*?\});\n/)[1]), icons = {};
  for (const k of ['dashboard', 'description', 'history', 'trending_up', 'help', 'expand_more', 'search', 'terminal', 'tune', 'stars', 'check_circle', 'arrow_forward', 'arrow_back', 'code', 'content_copy']){
    if (!shell[k]) throw new Error('no sidebar icon called ' + k); icons[k] = shell[k];
  }
  // the foot of the homepage's sidebar (the DesignMe sticker, the credit line and Book a call), so every page pins the same one
  // to the bottom of its sidebar
  const sideFoot = (site.match(/<div class="side-foot">([\s\S]*?)<\/div>\s*<\/aside>/) || [])[1];
  if (!sideFoot || !sideFoot.includes('hire-btn')) throw new Error("the homepage's sidebar has no foot with Book a call");
  fs.writeFileSync(PAGES_DATA, JSON.stringify({ sets:SETS, logo:site.match(/<a[^>]*class="brand[^"]*"[\s\S]*?(<svg[\s\S]*?<\/svg>)<\/a>/)[1], icons, sideFoot:sideFoot.trim(), sections:secs.filter(x => x.cards.length).map(x => ({
    slug:x.id.replace(/^s-/, ''), ...x,
    cards:x.cards.map(c => ({ reg:c.reg, title:c.t, desc:c.d, ...meta[c.reg] })) })) }, null, 1));
  // the designs each card with a design switch shows on its component page, by component (designsOf, above)
  const designs = {}; for (const id of Object.keys(CARDS)){ const d = designsOf(id); if (d) designs[id] = dmCode(d); }
  fs.writeFileSync(path.resolve(path.dirname(PAGES_DATA), 'designs.json'), JSON.stringify(designs));
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
  const logo = site.match(/<a[^>]*class="brand[^"]*"[\s\S]*?(<svg[\s\S]*?<\/svg>)<\/a>/)[1];
  const fonts = [...site.matchAll(/@font-face\s*\{[^}]*inter-latin(?:-ext)?-(?:400|500|600)-normal[^}]*\}/g)].map(m => m[0]).join('\n');
  const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Page not found · Designme.dev</title><meta name="robots" content="noindex">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script>try{var t=localStorage.getItem('dmui-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
<style>
${fonts}
:root{--bg:#fff;--fg:#121212;--dim:#525252;--stage:#fafafa;--line:rgba(18,18,18,.08);--ink:#121212;--on-ink:#fff;color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#111111;--fg:#f2f2f2;--dim:#c9c9c9;--stage:#1c1c1c;--line:rgba(255,255,255,.08);--ink:#f5f5f5;--on-ink:#121212;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#111111;--fg:#f2f2f2;--dim:#c9c9c9;--stage:#1c1c1c;--line:rgba(255,255,255,.08);--ink:#f5f5f5;--on-ink:#121212;color-scheme:dark}
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
@media (hover:hover) and (pointer:fine){.hit:hover{background:color-mix(in srgb,var(--fg) 6%,var(--stage))}}
.hit div{flex:1;min-width:0}
.hit b{display:block;font-weight:500}
.hit span{display:block;color:var(--dim);font-size:13px}
.hit i{font-style:normal;color:var(--dim)}
.acts{display:flex;flex-wrap:wrap;gap:8px;margin:28px 0 0}
.btn{display:inline-flex;align-items:center;height:36px;padding:0 16px;border-radius:999px;font-weight:500;text-decoration:none;color:var(--fg);box-shadow:inset 0 0 0 1px var(--line)}
.btn.ink{background:var(--ink);color:var(--on-ink);box-shadow:none}
.btn:focus-visible,.hit:focus-visible{outline:2px solid var(--fg);outline-offset:2px}
/* Skip to content: out of sight until Tab reaches it (it is the first thing there), then a small pill top left */
.skip{position:fixed;top:8px;left:16px;z-index:10;display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:999px;background:var(--bg);color:var(--fg);box-shadow:inset 0 0 0 1px var(--line);font-weight:500;font-size:13px;line-height:1;text-decoration:none;white-space:nowrap;opacity:0;transform:translateY(-48px);pointer-events:none}
.skip:focus{opacity:1;transform:none;pointer-events:auto;outline:2px solid var(--focus,var(--fg));outline-offset:2px}
@media (prefers-reduced-motion:no-preference){.skip{transition:opacity .2s ease,transform .2s cubic-bezier(.16,1,.3,1)}}
main:focus{outline:none}
</style></head><body>
<a class="skip" href="#content">Skip to content</a>
<header><a href="/" aria-label="Designme.dev home">${logo}</a></header>
<main id="content" tabindex="-1">
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
