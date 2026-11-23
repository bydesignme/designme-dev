// System audit: how consistent the component library really is (owner, 23 Nov: "I don't want to have ten different
// secondary button styles, 10 different spacing values, padding that's all over the place, it has to look clean").
//
// It plays every card's component page (/components/<page>.html) in each style and theme, at each width, through every
// design the card can switch to, and at a few settled moments of its demo it reads what the browser actually draws:
//
//   buttons   every clickable control, sorted into primary, secondary (filled), secondary (outlined), ghost, icon
//             button, warning action, chip, segment and link (by its classes first, then by its look). For each kind:
//             height, padding at the sides, radius, fill, edge (border or ring), text colour, font, icon size, the gap
//             between icon and words, and the whole look as one line (so "how many secondary buttons" is one count).
//             Also the gap between buttons side by side.
//   insets    the room from each card's edge (inside its border) to its content, per side; and the padding of boxes
//             inside a card (a quote, a field group, an inner panel)
//   heads     head and foot: the room above and below their controls (Soft and Blueprint from the hairline, Clean from the
//             strip's edge), their height and their side insets, and the whole as one line
//   rows      rows of a list (three or more alike, stacked): height, padding at the sides, the gap between a row's leading
//             mark and its words, the gap between rows
//   gaps      flex and grid gaps, and margins, inside the component
//   radii     cards, fields, rows, chips, popovers
//   hover     the hover look (real mouse, 1440 only: phones have no hover) and the selected look of everything
//             clickable, menus opened; same approach as the hover and selected audit of 23 Nov
//   type      font size / line height / weight per role: title, body, meta (muted), control label
//   lines     hairlines and borders: width and colour per role (card edge, divider, field, box, ring)
//
// For every category it keeps each distinct value, how many elements use it, and which components and selectors they are
// in. It writes report.json (everything) and report.md (per style and theme, each category's values most used first, and
// the flags): a value used by only one or two components is flagged as a likely one-off, and a spacing value off the 4px
// scale is flagged, each with its component and selector.
//
// The Buttons and Badge cards show their variants on purpose: they are reported on their own ("showcase") and never count
// as drift.
//
// Use it as a gate: run it on a build before anything is shown to the owner, with SPEC=<spec.json>, the values the owner
// agreed. Every element whose value isn't in the spec is listed under "Off spec" with its component, selector, what it is now
// and what it would become: that list is the fix list, and it must be empty (or each entry explained) before showing work.
// A change may not add a distinct value either: compare the "Distinct values" table with the last run.
//
// spec.json: { "All": { "<category>": { "<kind> · <what>": [allowed values] } }, "Soft": {...}, "Blueprint": {...},
// "Clean": {...} }. Categories and "<kind> · <what>" are as report.md names them (buttons, insets, heads, rows, gaps, radii,
// hover, type, lines); a kind of "*" matches every kind. A style's own list replaces All's for the same key. Values are
// compared as written in the report; numbers also match within 0.5px.
//
// usage (from the repo root, after a build, with the built site served on PORT):
//   PORT=8890 IDS=all node tools/site/audit-system.js
//   PORT=8890 IDS=permission-gate,model-picker STYLES=clean THEMES=light WIDTHS=1440 OUT=/some/dir node tools/site/audit-system.js
// env:
//   IDS      card ids, comma separated, or "all" for the Phase I list below (default all)
//   STYLES   clean,soft,blueprint (default all three)      THEMES  light,dark (default both)
//   WIDTHS   1440,390 (default both)                       SAMPLES seconds into each design's demo to sample (default 1.5,5,10)
//   HOVER    0 to skip the hover pass (default on, at the widest width only)
//   CONC     pages run side by side (default 4)            OUT     folder for report.json and report.md (default .)
//   RESUME   1 to take each card's records from OUT/raw when an earlier run measured it (each card's records are cached
//            there as it finishes; a card that failed isn't, so a rerun with RESUME=1 measures only what is missing)
//   SPEC     the agreed spec (spec.json, see above): adds the "Off spec" lists
//   FROM     earlier report.json files, comma separated: measure nothing, merge them (each later one replaces the cards it
//            measured, so a rerun of the changed cards updates a full run), check against SPEC and write the reports into OUT
//   PW       where Playwright is, if it isn't found on its own
// Exit code: 0. This is a measuring tool; the gate is reading its counts and its off-spec lists.
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const { chromium } = (() => { for (const m of [process.env.PW, 'playwright', '/opt/node-tools/node_modules/playwright'].filter(Boolean)) { try { return require(m); } catch (e) {} } throw new Error('Playwright not found: set PW=<path to playwright>'); })();

// Phase I cards (CLAUDE.md, "Clean": what is left once Phase II has taken its list)
const PHASE1 = 'model-picker,permission-gate,agent-lanes,reasoning-trail,attachment-tray,trace-view,agent-inbox,composer,thinking,rich-text-editor,response-versions,feedback-sheet,answer-action-bar,web-search,toast-stack,toast,thinking-states,plan-review,step-loader,decision-prompt,proposal-card,rewrite-toolbar,inline-text-diff,draft-review,eval-results,terminal-stream,citation-hover,source-stack,metric-insight,details-panel,task-table,data-picker,run-drawer,command-palette,memory-panel,agent-settings,agent-tree,run-cost,agent-run-timeline,context-meter,status-pill,meeting-card,tool-connections,knowledge-sources,scheduled-runs,file-explorer,workspace-rail,line-chart,donut-chart,health-score,score-breakdown,activity-heatmap,stat-cards,account-table,date-picker,segmented-control,event-calendar,agenda,buttons,badge,progress,tooltip,search-input,multi-select,sign-in,form,banner,comments,notifications,reactions,profile-menu,context-menu,context-switcher,filter-menu,ticket-list,set-limit';
// cards whose page name differs from their id
const PAGE = { 'citation-hover':'citation-hover-card', harness:'agent-harness', funnel:'funnel-chart', 'social-signin':'social-sign-in', invite:'invite-to-collaborate', kanban:'kanban-board' };
// cards that show variants on purpose
const SHOWCASE = new Set(['buttons', 'badge']);
// values that are spacing (held to the 4px scale)
const SPACING = new Set(['padding x', 'icon gap', 'gap', 'left', 'right', 'top', 'bottom', 'above', 'below', 'padding', 'mark to words', 'between rows', 'flex gap', 'grid gap', 'margin', 'side by side']);

const port = process.env.PORT || 8790, OUT = process.env.OUT || '.';
const ids = (!process.env.IDS || process.env.IDS === 'all' ? PHASE1 : process.env.IDS).split(',').map(s => s.trim()).filter(Boolean);
const styles = (process.env.STYLES || 'soft,blueprint,clean').split(','), themes = (process.env.THEMES || 'light,dark').split(',');
const widths = (process.env.WIDTHS || '1440,390').split(',').map(Number), SAMPLES = (process.env.SAMPLES || '1.5,5,10').split(',').map(Number);
const HOVER = process.env.HOVER !== '0', CONC = +(process.env.CONC || 4);
const STYLE_KEY = { soft:'soft', clean:'clean', blueprint:'bp', bp:'bp' }, STYLE_NAME = { soft:'Soft', clean:'Clean', blueprint:'Blueprint', bp:'Blueprint' };

/* ------------------------------------------------------------------------------------------------------------------ */
/* In the page: helpers shared by the measuring functions, installed once per page load as window.__A                   */
/* ------------------------------------------------------------------------------------------------------------------ */
function install(){
  const A = window.__A = {};
  const cv = document.createElement('canvas').getContext('2d', { willReadFrequently:true });
  // any CSS colour (color-mix, oklab, color(srgb ...)) as rgb() or rgba(), or 'none' when fully clear
  A.col = c => { if (!c || c === 'transparent' || c === 'rgba(0, 0, 0, 0)') return 'none'; cv.clearRect(0, 0, 1, 1); cv.fillStyle = '#000'; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); const d = cv.getImageData(0, 0, 1, 1).data; if (!d[3]) return 'none'; return d[3] === 255 ? `rgb(${d[0]},${d[1]},${d[2]})` : `rgba(${d[0]},${d[1]},${d[2]},${(d[3] / 255).toFixed(2)})`; };
  A.px = v => Math.round(parseFloat(v) * 2) / 2;
  A.r = v => Math.round(v * 2) / 2;
  A.root = () => document.querySelector('.cp-demo .stage-in');
  // parts of the page around the component that aren't it: the demo's hand, tooltips, the design switch, its template
  A.skip = e => !!e.closest('.hand,.tip,template,.cp-anim,.dm>.demo,[aria-label$=" design"]');
  A.vis = e => { const sin = A.root(); for (let a = e; a && a !== sin; a = a.parentElement){ const cs = getComputedStyle(a); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .1 || a.hidden || cs.clipPath === 'inset(50%)' || (cs.position === 'absolute' && parseFloat(cs.width) <= 1 && parseFloat(cs.height) <= 1)) return false; } const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
  // a selector a person can find in the source: the element's tag and first two classes, after its nearest classed ancestor
  A.cls = e => { const c = typeof e.className === 'string' ? e.className : (e.className && e.className.baseVal) || ''; return c.trim().split(/\s+/).filter(x => x && !/^(on|open|sel|in|out|show|hide|growing|done|run|active|hg|is-.*)$/.test(x)).slice(0, 2); };
  A.sel = e => { const own = e.tagName.toLowerCase() + A.cls(e).map(c => '.' + c).join(''); let p = e.parentElement; for (; p && p !== A.root(); p = p.parentElement) if (A.cls(p).length) break; return (p && p !== A.root() ? '.' + A.cls(p)[0] + ' ' : '') + own; };
  // a path of child indexes from the stage, to find the same element again (the visual sheet uses it)
  A.path = e => { const sin = A.root(), out = []; for (let a = e; a && a !== sin; a = a.parentElement){ out.unshift([...a.parentElement.children].indexOf(a)); } return out.join('.'); };
  A.at = p => { let a = A.root(); for (const i of String(p).split('.').filter(x => x !== '')) { a = a && a.children[+i]; } return a; };
  A.txt = e => (e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28);
  A.clear = s => /rgba\([^)]*,\s*0\)|transparent/.test(s);
  A.shade = cs => cs.boxShadow !== 'none' && cs.boxShadow.split(/,(?![^(]*\))/).some(s => !A.clear(s));
  // a ring drawn with box-shadow (0 0 0 Npx), inset or not: its width and colour
  A.ring = cs => { if (cs.boxShadow === 'none') return null; for (const s of cs.boxShadow.split(/,(?![^(]*\))/)){ const c = (s.match(/rgba?\([^)]*\)|color\([^)]*\)|oklab\([^)]*\)|#[\da-f]+/i) || [''])[0]; const v = s.replace(c, '').replace('inset', '').trim().split(/\s+/).map(parseFloat); if (v.length >= 4 && !v[0] && !v[1] && !v[2] && v[3] > 0 && A.col(c) !== 'none') return { w:v[3], c:A.col(c), inset:/inset/.test(s) }; } return null; };
  // a fill, a gradient's colours included (Clean draws its buttons' fills as gradients)
  A.fill = cs => { const bg = A.col(cs.backgroundColor); if (cs.backgroundImage === 'none' || !/gradient/.test(cs.backgroundImage)) return bg; const cs2 = [...new Set((cs.backgroundImage.match(/rgba?\([^)]*\)|color\([^)]*\)|oklab\([^)]*\)|#[\da-f]{3,8}/gi) || []).map(A.col))]; return (bg !== 'none' ? bg + ' + ' : '') + 'gradient ' + cs2.join(' → '); };
  A.bare = cs => A.col(cs.backgroundColor) === 'none' && cs.backgroundImage === 'none' && !A.shade(cs) && !(parseFloat(cs.borderTopWidth) > 0 && A.col(cs.borderTopColor) !== 'none');
  // the words of an element, as one box (or null when it has none on show)
  A.words = e => { const tw = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let n, b = null; while ((n = tw.nextNode())){ if (!n.textContent.trim() || !A.vis(n.parentElement)) continue; const r = document.createRange(); r.selectNodeContents(n); for (const q of r.getClientRects()){ if (q.width < 1) continue; b = b ? { left:Math.min(b.left, q.left), right:Math.max(b.right, q.right), top:Math.min(b.top, q.top), bottom:Math.max(b.bottom, q.bottom) } : { left:q.left, right:q.right, top:q.top, bottom:q.bottom }; } } return b; };
  A.CTL = 'button,a[href],[role="button"],[role="tab"],[role="radio"]:not(input),[role="switch"],.pill,.ib,.chip,summary,select';
  A.FIELD = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]):not([type="hidden"]),textarea,select,[contenteditable="true"],[role="combobox"],[role="textbox"]';
  // the accent fill and Clean's ink button fill, to tell a primary button by its look
  const rs = getComputedStyle(document.documentElement);
  A.accent = [A.col(rs.getPropertyValue('--accent').trim()), A.col(rs.getPropertyValue('--btn-bg').trim())].filter(c => c && c !== 'none');
  // a control's kind: its classes first, then its look
  A.kind = (e, rootW) => {
    const cs = getComputedStyle(e), r = e.getBoundingClientRect(), w = A.words(e), bg = A.col(cs.backgroundColor);
    // (what a person sees decides, so a .pill.ghost drawn with an edge counts as an outlined secondary; the classes only
    // decide where the look can't: primary, warning, chip, segment, link)
    if (e.matches('[role="switch"],input[type="checkbox"],input[type="radio"]')) return 'toggle';
    if (e.matches('.mi,[role="option"],[role^="menuitem"],[role="treeitem"],[role="row"]')) return 'row';
    if (r.width > rootW * .5 && r.height >= 28) return 'row';
    if (e.closest('.seg2,.seg,[role="tablist"],[role="radiogroup"]') || e.matches('[role="tab"],[role="radio"]')) return 'segment';
    if (e.matches('.pill.warn')) return 'warning action';
    if (e.matches('.pill.primary,.pill.accent')) return 'primary';
    if (e.matches('.chip,.tag,[class*="chip"]')) return 'chip';
    if (e.matches('a[href]') || /underline/.test(cs.textDecorationLine)) return 'link';
    if (e.matches('.ib') || (!w && e.querySelector('svg'))) return 'icon button';
    if (e.matches('select')) return 'field';
    if (A.bare(cs)) return w ? 'ghost' : 'icon button';
    if (A.accent.includes(bg)) return 'primary';
    const edge = (parseFloat(cs.borderTopWidth) > 0 && A.col(cs.borderTopColor) !== 'none') || A.ring(cs);
    if (r.height <= 24 && r.width < 160 && !e.matches('.pill')) return 'chip';
    if (edge && (bg === 'none' || bg === A.col(getComputedStyle(e.parentElement).backgroundColor) || /^rgb\(25[0-5],25[0-5],25[0-5]\)$/.test(bg))) return 'secondary (outlined)';
    return 'secondary (filled)';
  };
  // the cards in the component: the outermost boxes with an edge (a border all round, a ring or a shadow) at least 160 by 48
  A.cards = () => {
    const sin = A.root(); const all = [...sin.querySelectorAll('*')].filter(e => { if (A.skip(e) || e.matches(A.CTL + ',' + A.FIELD + ',.pop,[role="menu"],[role="listbox"],svg,svg *,img,li,tr,td,th')) return false; const b = e.getBoundingClientRect(); if (b.width < 160 || b.height < 48) return false; const cs = getComputedStyle(e);
      const four = ['Top', 'Right', 'Bottom', 'Left'].every(s => parseFloat(cs['border' + s + 'Width']) > 0 && A.col(cs['border' + s + 'Color']) !== 'none');
      return (four || A.shade(cs)) && A.vis(e); });
    return all.filter(e => !all.some(o => o !== e && o.contains(e)));
  };
  // what the content of a card draws: words (by their line box), marks, controls, and fills or boxes inside it, each cut
  // to the scroll box it sits in. Fills as wide as the card (a strip, a table) and lines of 2px or less meet the edges by
  // design and aren't content
  A.drawn = card => {
    const C = card.getBoundingClientRect(), out = [];
    const clip = (e, b) => { let r = { left:b.left, right:b.right, top:b.top, bottom:b.bottom }; for (let a = e.parentElement; a && a !== card; a = a.parentElement){ const cs = getComputedStyle(a); if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue; const q = a.getBoundingClientRect(); r = { left:Math.max(r.left, q.left), right:Math.min(r.right, q.right), top:Math.max(r.top, q.top), bottom:Math.min(r.bottom, q.bottom) }; } return r.right - r.left > 1 && r.bottom - r.top > 1 ? r : null; };
    const push = (e, b, k, ragged) => { const r = clip(e, b); if (r) out.push(Object.assign(r, { e, k, ragged })); };
    const inCtl = e => e.closest(A.CTL);
    const tw = document.createTreeWalker(card, NodeFilter.SHOW_TEXT); let n;
    while ((n = tw.nextNode())){ const e = n.parentElement; if (!n.textContent.trim() || A.skip(e) || e.closest('.pop,[role="menu"],[role="listbox"]') || !A.vis(e)) continue; const ctl = inCtl(e); if (ctl && !A.bare(getComputedStyle(ctl))) continue;
      const r = document.createRange(); r.selectNodeContents(n); const lines = [...r.getClientRects()].filter(q => q.width > 1); const cs = getComputedStyle(e), lh = parseFloat(cs.lineHeight);
      const right = /right|end/.test(cs.textAlign) || (() => { const p = e.parentElement, ps = p && getComputedStyle(p); return ps && /flex/.test(ps.display) && /end|space-between/.test(ps.justifyContent) && [...p.children].filter(k => k.offsetParent).pop() === e; })() || /center/.test(cs.textAlign);
      lines.forEach(q => { const hl = lh > q.height ? (lh - q.height) / 2 : 0; push(e, { left:q.left, right:q.right, top:q.top - hl, bottom:q.bottom + hl }, 'text', !right && lines.length < 2); }); }
    card.querySelectorAll('*').forEach(e => { if (A.skip(e) || e.closest('.pop,[role="menu"],[role="listbox"]') || (e.closest('svg') && e.tagName.toLowerCase() !== 'svg')) return; if (!A.vis(e)) return; const b = e.getBoundingClientRect(), cs = getComputedStyle(e);
      if (e.matches('svg,img,canvas,video,.av,input,textarea,select')){ if (b.width >= 4 && b.height >= 4) push(e, b, 'mark'); return; }
      if (b.height <= 2 || b.width <= 2 || b.width >= C.width - 4) return;
      if (e.matches(A.CTL) && A.bare(cs)) return;
      // (a box counts by a fill, a ring or shadow, or an edge all round; a line on one side is a divider, not content)
      const four = ['Top', 'Right', 'Bottom', 'Left'].every(s => parseFloat(cs['border' + s + 'Width']) > 0);
      if (e.matches(A.CTL) ? !A.bare(cs) : A.col(cs.backgroundColor) !== 'none' || /gradient/.test(cs.backgroundImage) || A.shade(cs) || four) push(e, b, e.matches(A.CTL) ? 'ctl' : 'box'); });
    return out;
  };
  // a card's inner edges (inside its border)
  A.inner = card => { const C = card.getBoundingClientRect(), cs = getComputedStyle(card); return { left:C.left + parseFloat(cs.borderLeftWidth), right:C.right - parseFloat(cs.borderRightWidth), top:C.top + parseFloat(cs.borderTopWidth), bottom:C.bottom - parseFloat(cs.borderBottomWidth), width:C.width, height:C.height }; };
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* In the page: one sample of the component as it stands. Returns records [cat, kind, prop, value, sel, path, txt]     */
/* ------------------------------------------------------------------------------------------------------------------ */
function sample(){
  const A = window.__A, sin = A.root(); if (!sin) return { recs:[] };
  // a moment counts as settled when no entrance or move is running in the component (a one-off animation of 1.2s or less;
  // a longer one is a timer or a progress bar, like a toast's life line, and runs while the component is at rest)
  if (sin.getAnimations({ subtree:true }).some(a => { if (a.playState !== 'running' || !a.effect) return false; const t = a.effect.getComputedTiming(); return t.iterations !== Infinity && t.activeDuration <= 1200; })) return { busy:true };
  const R = [], rec = (cat, kind, prop, value, e, extra) => R.push([cat, kind, prop, value, e ? A.sel(e) : '', e ? A.path(e) : '', e ? A.txt(e) : '', extra || null]);
  const cards = A.cards(), roots = cards.length ? cards : [sin.firstElementChild || sin];
  const rootW = Math.max(...roots.map(r => r.getBoundingClientRect().width));
  const fmt = v => `${A.r(v)}`;

  /* buttons ------------------------------------------------------------------------------------------------------- */
  const ctls = [...sin.querySelectorAll(A.CTL)].filter(e => !A.skip(e) && A.vis(e) && !(e.parentElement && e.parentElement.closest(A.CTL) && !e.parentElement.closest(A.CTL).matches('.seg2,.seg,[role="tablist"],[role="radiogroup"]')) && e.getBoundingClientRect().width >= 8 && e.getBoundingClientRect().height >= 8 && !e.closest('.pop:not(.open)'));
  const kinds = new Map();
  ctls.forEach(e => {
    const k = A.kind(e, rootW); kinds.set(e, k); if (k === 'row' || k === 'toggle' || k === 'field') return;
    const cs = getComputedStyle(e), b = e.getBoundingClientRect(), ring = A.ring(cs), w = A.words(e);
    const bw = parseFloat(cs.borderTopWidth), edge = bw > 0 && A.col(cs.borderTopColor) !== 'none' ? `${A.px(bw)}px ${A.col(cs.borderTopColor)}` : ring ? `ring ${A.px(ring.w)}px ${ring.c}` : 'none';
    const pl = A.px(cs.paddingLeft), pr = A.px(cs.paddingRight), rad = cs.borderTopLeftRadius, rr = parseFloat(rad) >= b.height / 2 - .5 ? 'pill' : `${A.px(rad)}px`;
    const shape = rr + (cs.cornerShape && cs.cornerShape !== 'round' && rr !== 'pill' ? ' ' + cs.cornerShape : '');
    const svg = [...e.querySelectorAll('svg')].find(A.vis); const sb = svg && svg.getBoundingClientRect();
    const font = `${A.px(cs.fontSize)}px ${cs.fontWeight}`;
    const vals = { height:`${A.r(b.height)}`, 'padding x':pl === pr ? `${pl}` : `${pl} / ${pr}`, radius:shape, fill:A.fill(cs), edge, text:A.col(cs.color), font };
    if (svg) vals['icon size'] = `${A.r(sb.width)}x${A.r(sb.height)}`;
    // (the gap between icon and words, when they share a line)
    if (svg && w && sb.top < w.bottom && sb.bottom > w.top) vals['icon gap'] = `${A.r(sb.right <= w.left + 1 ? w.left - sb.right : sb.left - w.right)}`;
    for (const [p, v] of Object.entries(vals)) rec('buttons', k, p, v, e);
    // the whole look, as one value: what a person sees as "one button style"
    rec('buttons', k, 'look', `${vals.height} tall · pad ${vals['padding x']} · ${shape} · fill ${vals.fill} · edge ${edge} · text ${vals.text} · ${font}`, e);
  });
  // buttons side by side: neighbours in one parent, on one line
  const parents = new Map(); ctls.forEach(e => { const k = kinds.get(e); if (['row', 'toggle', 'segment', 'field'].includes(k)) return; const p = e.parentElement; if (!parents.has(p)) parents.set(p, []); parents.get(p).push(e); });
  // (more than 32px apart is two ends of a row, not a group of buttons)
  parents.forEach(list => { if (list.length < 2) return; list.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    for (let i = 1; i < list.length; i++){ const a = list[i - 1].getBoundingClientRect(), b = list[i].getBoundingClientRect(); if (Math.abs((a.top + a.bottom) / 2 - (b.top + b.bottom) / 2) > 3 || b.left < a.right - 1 || b.left - a.right > 32) continue; rec('buttons', 'side by side', 'side by side', fmt(b.left - a.right), list[i], `${kinds.get(list[i - 1])} + ${kinds.get(list[i])}`); } });

  /* cards: insets, inner boxes, heads and feet --------------------------------------------------------------------- */
  const isClean = document.documentElement.dataset.style === 'clean';
  cards.forEach(card => {
    const I = A.inner(card), cs = getComputedStyle(card), D = A.drawn(card); if (!D.length) return;
    const left = Math.min(...D.map(d => d.left)) - I.left, top = Math.min(...D.map(d => d.top)) - I.top, bottom = I.bottom - Math.max(...D.map(d => d.bottom));
    const rs = D.filter(d => !d.ragged), rmax = rs.length ? Math.max(...rs.map(d => d.right)) : -Infinity, right = rmax < I.left + I.width * .66 ? null : I.right - rmax;
    rec('insets', 'card', 'left', fmt(left), card); if (right !== null) rec('insets', 'card', 'right', fmt(right), card); rec('insets', 'card', 'top', fmt(top), card); rec('insets', 'card', 'bottom', fmt(bottom), card);
    rec('insets', 'card', 'padding', [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(A.px).join(' '), card);
    rec('radii', 'card', 'radius', `${A.px(cs.borderTopLeftRadius)}px` + (cs.cornerShape && cs.cornerShape !== 'round' ? ' ' + cs.cornerShape : ''), card);
    // boxes inside the card (a quote, a group, an inner panel): their padding
    card.querySelectorAll('*').forEach(e => { if (A.skip(e) || e.matches(A.CTL + ',' + A.FIELD + ',svg,svg *,img,.av') || e.closest(A.CTL) || !A.vis(e)) return; const b = e.getBoundingClientRect(); if (b.width < 80 || b.height < 32 || b.width >= I.width - 4) return; const q = getComputedStyle(e); if (A.bare(q)) return;
      rec('insets', 'inner box', 'padding', [q.paddingTop, q.paddingRight, q.paddingBottom, q.paddingLeft].map(A.px).join(' '), e); });
    // heads and feet. A strip: a full-width band with its own fill at the card's top or bottom. A hairline head or foot: a
    // line across the card near its top or bottom, with content beyond it
    const cbg = A.col(cs.backgroundColor);
    const strips = [...card.querySelectorAll('*')].filter(e => { if (A.skip(e) || !A.vis(e)) return false; const b = e.getBoundingClientRect(), q = getComputedStyle(e), bg = A.col(q.backgroundColor); return b.width >= I.width - 4 && b.height > 20 && b.height <= 120 && bg !== 'none' && bg !== cbg && (Math.abs(b.top - I.top) < 3 || Math.abs(Math.min(b.bottom, I.bottom) - I.bottom) < 3); }).filter((e, i, a) => !a.some(o => o !== e && o.contains(e)));
    const regions = [];
    // (a strip is measured inside its own edges: its hairline is its edge)
    strips.forEach(s => { const b = s.getBoundingClientRect(), q = getComputedStyle(s); regions.push({ where:Math.abs(b.top - I.top) < 3 && b.height < I.height / 2 ? 'head' : 'foot', how:'strip', top:Math.max(b.top, I.top) + parseFloat(q.borderTopWidth), bottom:Math.min(b.bottom, I.bottom) - parseFloat(q.borderBottomWidth), e:s }); });
    const lines = [];
    card.querySelectorAll('*').forEach(e => { if (A.skip(e) || !A.vis(e) || e.closest(A.CTL) || strips.some(s => s === e)) return; const b = e.getBoundingClientRect(); if (b.width < I.width * .8) return; const q = getComputedStyle(e);
      if (parseFloat(q.borderTopWidth) > 0 && A.col(q.borderTopColor) !== 'none') lines.push({ y:b.top + parseFloat(q.borderTopWidth), e });
      if (parseFloat(q.borderBottomWidth) > 0 && A.col(q.borderBottomColor) !== 'none') lines.push({ y:b.bottom, e, under:true });
      if (b.height <= 2 && A.col(q.backgroundColor) !== 'none') lines.push({ y:b.bottom, e }); });
    if (!regions.some(r => r.where === 'foot')){ const f = lines.filter(l => l.y > I.top + I.height * .4 && I.bottom - l.y <= 120 && I.bottom - l.y > 12 && D.some(d => d.top >= l.y - .5)).sort((a, b) => b.y - a.y)[0]; if (f) regions.push({ where:'foot', how:'hairline', top:f.y, bottom:I.bottom, e:f.e }); }
    if (!regions.some(r => r.where === 'head')){ const h = lines.filter(l => l.y < I.top + I.height * .6 && l.y - I.top <= 100 && l.y - I.top > 12 && D.some(d => d.bottom <= l.y + .5)).sort((a, b) => a.y - b.y)[0]; if (h) regions.push({ where:'head', how:'hairline', top:I.top, bottom:h.y - (h.under ? parseFloat(getComputedStyle(h.e).borderBottomWidth) : 0), e:h.e }); }
    regions.forEach(g => { const inR = D.filter(d => (d.top + d.bottom) / 2 > g.top && (d.top + d.bottom) / 2 < g.bottom && !(d.k === 'box' && d.right - d.left >= I.width - 8)); if (!inR.length) return;
      const above = Math.min(...inR.map(d => d.top)) - g.top, below = g.bottom - Math.max(...inR.map(d => d.bottom)), l = Math.min(...inR.map(d => d.left)) - I.left;
      const rr = inR.filter(d => !d.ragged), r0 = rr.length ? I.right - Math.max(...rr.map(d => d.right)) : null, r = r0 !== null && r0 < I.width / 3 ? r0 : null, hasCtl = inR.some(d => d.k === 'ctl' || (d.e.closest && d.e.closest(A.CTL)));
      const kind = `${g.where} (${g.how})`;
      rec('heads', kind, 'above', fmt(above), g.e); rec('heads', kind, 'below', fmt(below), g.e); rec('heads', kind, 'height', fmt(g.bottom - g.top), g.e); rec('heads', kind, 'left', fmt(l), g.e); if (r !== null) rec('heads', kind, 'right', fmt(r), g.e);
      rec('heads', kind, 'look', `${A.r(g.bottom - g.top)} tall · ${fmt(above)} above · ${fmt(below)} below · ${fmt(l)} left · ${r === null ? 'ragged' : fmt(r)} right${hasCtl ? '' : ' · words only'}`, g.e, { card:A.path(card), top:g.top, bottom:g.bottom }); });
  });

  /* rows ------------------------------------------------------------------------------------------------------------ */
  const seenRow = new Set();
  roots.forEach(root => root.querySelectorAll('*').forEach(p => { if (A.skip(p) || p.closest('.pop:not(.open)') || !A.vis(p)) return;
    const kids = [...p.children].filter(k => A.vis(k) && !A.skip(k)); if (kids.length < 3) return;
    const sig = k => k.tagName + '.' + (A.cls(k)[0] || ''); const groups = new Map(); kids.forEach(k => { const s = sig(k); if (!groups.has(s)) groups.set(s, []); groups.get(s).push(k); });
    groups.forEach(list => { if (list.length < 3) return; const bs = list.map(k => k.getBoundingClientRect());
      if (bs.some(b => b.width < rootW * .4 || b.height < 20 || b.height > 120)) return;
      for (let i = 1; i < bs.length; i++) if (bs[i].top < bs[i - 1].bottom - 1 || Math.abs(bs[i].left - bs[0].left) > 2) return;
      list.forEach((k, i) => { if (seenRow.has(k)) return; seenRow.add(k); const q = getComputedStyle(k), b = bs[i];
        rec('rows', 'row', 'height', fmt(b.height), k); rec('rows', 'row', 'padding x', A.px(q.paddingLeft) === A.px(q.paddingRight) ? `${A.px(q.paddingLeft)}` : `${A.px(q.paddingLeft)} / ${A.px(q.paddingRight)}`, k);
        if (parseFloat(q.borderTopLeftRadius) > 0) rec('radii', 'row', 'radius', `${A.px(q.borderTopLeftRadius)}px`, k);
        if (i) rec('rows', 'row', 'between rows', fmt(b.top - bs[i - 1].bottom), k);
        // the leading mark (icon, tile, checkbox, avatar) and the words after it
        const mark = [...k.querySelectorAll('svg,img,.av,input[type="checkbox"],[class$="-ic"],[class*="-ic "],[class$="-mk"],[class*="-mk "],[role="checkbox"]')].find(m => A.vis(m) && !(m.closest('svg') && m.tagName.toLowerCase() !== 'svg') && m.getBoundingClientRect().width <= 48);
        if (mark){ const mb = mark.getBoundingClientRect(); if (mb.left - b.left < 40){ let tile = mark; const t = mark.parentElement; if (t && t !== k && t.children.length === 1 && !A.bare(getComputedStyle(t)) && t.getBoundingClientRect().width <= 48) tile = t; const tb = tile.getBoundingClientRect();
          const tw = document.createTreeWalker(k, NodeFilter.SHOW_TEXT); let n, first = null; while ((n = tw.nextNode())){ if (!n.textContent.trim() || tile.contains(n.parentElement) || !A.vis(n.parentElement)) continue; const r = document.createRange(); r.selectNodeContents(n); const q2 = [...r.getClientRects()].find(x => x.width > 1 && x.left >= tb.right - 1); if (q2 && (!first || q2.left < first.left)) first = q2; }
          if (first && first.top < tb.bottom && first.bottom > tb.top) rec('rows', 'row', 'mark to words', fmt(first.left - tb.right), k); } }
      }); });
  }));

  /* gaps ------------------------------------------------------------------------------------------------------------ */
  roots.forEach(root => [root, ...root.querySelectorAll('*')].forEach(e => { if (A.skip(e) || (e.closest('svg') && e.tagName.toLowerCase() !== 'svg') || !A.vis(e)) return; const q = getComputedStyle(e);
    const kids = [...e.children].filter(k => A.vis(k)); if (kids.length >= 2){
      if (/flex/.test(q.display)){ const row = /row/.test(q.flexDirection); const main = row ? q.columnGap : q.rowGap; if (main !== 'normal' && parseFloat(main) > 0) rec('gaps', row ? 'flex row' : 'flex column', 'flex gap', `${A.px(main)}`, e); if (q.flexWrap !== 'nowrap'){ const cross = row ? q.rowGap : q.columnGap; if (cross !== 'normal' && parseFloat(cross) > 0) rec('gaps', 'flex wrap', 'flex gap', `${A.px(cross)}`, e); } }
      else if (/grid/.test(q.display)){ for (const [k, v] of [['grid columns', q.columnGap], ['grid rows', q.rowGap]]) if (v !== 'normal' && parseFloat(v) > 0) rec('gaps', k, 'grid gap', `${A.px(v)}`, e); } }
    if (e !== root){ const mt = parseFloat(q.marginTop) || 0, mb = parseFloat(q.marginBottom) || 0, ml = parseFloat(q.marginLeft) || 0, mr = parseFloat(q.marginRight) || 0;
      if (mt) rec('gaps', 'margin (vertical)', 'margin', `${A.px(mt)}`, e); if (mb) rec('gaps', 'margin (vertical)', 'margin', `${A.px(mb)}`, e);
      // (auto margins push things apart and aren't spacing values)
      if (ml && !/auto/.test(q.marginLeft)) rec('gaps', 'margin (horizontal)', 'margin', `${A.px(ml)}`, e); if (mr && !/auto/.test(q.marginRight)) rec('gaps', 'margin (horizontal)', 'margin', `${A.px(mr)}`, e); } }));

  /* radii: fields, chips, popovers (cards and rows above) ------------------------------------------------------------ */
  sin.querySelectorAll(A.FIELD).forEach(f => { if (A.skip(f) || !A.vis(f)) return; let d = f; for (let a = f; a && a !== sin; a = a.parentElement){ if (!A.bare(getComputedStyle(a))){ d = a; break; } if (a.getBoundingClientRect().height > f.getBoundingClientRect().height + 24) break; }
    const q = getComputedStyle(d); if (A.bare(q)) return; rec('radii', 'field', 'radius', `${A.px(q.borderTopLeftRadius)}px` + (q.cornerShape && q.cornerShape !== 'round' ? ' ' + q.cornerShape : ''), d); });
  sin.querySelectorAll('.chip,.tag,.bdg,[class*="badge"],[class*="chip"]').forEach(c => { if (A.skip(c) || !A.vis(c) || (c.parentElement && c.parentElement.closest('.chip,.tag,.bdg'))) return; const q = getComputedStyle(c), b = c.getBoundingClientRect(); if (A.bare(q) || b.height > 36) return; rec('radii', 'chip', 'radius', parseFloat(q.borderTopLeftRadius) >= b.height / 2 - .5 ? 'pill' : `${A.px(q.borderTopLeftRadius)}px` + (q.cornerShape && q.cornerShape !== 'round' ? ' ' + q.cornerShape : ''), c); });
  // popovers: their radius is read whether they are open or not (it doesn't depend on layout)
  sin.querySelectorAll('.pop,[role="menu"],[role="listbox"],[role="dialog"]').forEach(p => { if (A.skip(p) || (p.parentElement && p.parentElement.closest('.pop,[role="menu"],[role="listbox"]'))) return; const q = getComputedStyle(p); if (A.bare(q)) return; rec('radii', 'popover', 'radius', `${A.px(q.borderTopLeftRadius)}px` + (q.cornerShape && q.cornerShape !== 'round' ? ' ' + q.cornerShape : ''), p); });

  /* type ------------------------------------------------------------------------------------------------------------ */
  const texts = new Map(); const tw = document.createTreeWalker(sin, NodeFilter.SHOW_TEXT); let n;
  while ((n = tw.nextNode())){ const e = n.parentElement; if (!n.textContent.trim() || texts.has(e) || A.skip(e) || e.closest('svg') && !e.closest('svg text,text') || !A.vis(e)) continue; texts.set(e, getComputedStyle(e)); }
  // body colour: the style's text colour (--fg); words in a quieter colour than it are meta
  const bodyCol = A.col(getComputedStyle(document.documentElement).getPropertyValue('--fg').trim());
  const lum = c => { const m = (c.match(/[\d.]+/g) || []).map(Number); if (m.length < 3) return 0; const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(m[0]) + .7152 * f(m[1]) + .0722 * f(m[2]); };
  const pageBg = A.col(getComputedStyle(document.body).backgroundColor), dark = lum(pageBg) < .2;
  texts.forEach((q, e) => { const col = A.col(q.color);
    const role = e.closest(A.CTL + ',label,.tag,.chip') ? 'control label' : +q.fontWeight >= 500 || /^H\d$/.test(e.tagName) ? 'title' : col !== bodyCol && (dark ? lum(col) < lum(bodyCol) : lum(col) > lum(bodyCol)) ? 'meta' : 'body';
    rec('type', role, 'style', `${A.px(q.fontSize)}px / ${q.lineHeight === 'normal' ? 'normal' : A.px(q.lineHeight) + 'px'} / ${q.fontWeight}`, e);
    rec('type', role, 'colour', col, e); });

  /* hairlines and borders ------------------------------------------------------------------------------------------- */
  const cardSet = new Set(cards);
  // (a control's own edge is under buttons, and a spinner's ring or a dot is a mark, not a line)
  sin.querySelectorAll('*').forEach(e => { if (A.skip(e) || (e.closest('svg')) || !A.vis(e) || (e.parentElement && e.parentElement.closest(A.CTL)) || /50%/.test(getComputedStyle(e).borderTopLeftRadius) || e.matches('.spin,[class*="spin"]')) return; const q = getComputedStyle(e), b = e.getBoundingClientRect(); const ctl = e.matches(A.CTL);
    const sides = ['Top', 'Right', 'Bottom', 'Left'].filter(s => parseFloat(q['border' + s + 'Width']) > 0 && q['border' + s + 'Style'] !== 'none' && A.col(q['border' + s + 'Color']) !== 'none');
    const role = cardSet.has(e) ? 'card edge' : e.matches(A.FIELD) ? 'field' : ctl ? null : sides.length === 4 ? 'box' : 'divider';
    if (sides.length && role) rec('lines', role, 'line', `${A.px(q['border' + sides[0] + 'Width'])}px ${A.col(q['border' + sides[0] + 'Color'])}`, e);
    const ring = A.ring(q); if (ring && !ctl) rec('lines', cardSet.has(e) ? 'card edge' : e.matches(A.FIELD) ? 'field' : 'ring', 'line', `ring ${A.px(ring.w)}px ${ring.c}`, e);
    if (!ctl && !e.children.length && (b.height <= 2 && b.width >= 24 || b.width <= 2 && b.height >= 24) && A.col(q.backgroundColor) !== 'none') rec('lines', 'divider', 'line', `${A.r(Math.min(b.width, b.height))}px ${A.col(q.backgroundColor)} (drawn)`, e); });

  return { recs:R };
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* In the page: the hover pass. Every hoverable thing in the component (and in each menu it opens), hovered with the real */
/* mouse; its look at rest and on hover, and the rest look of what is selected                                           */
/* ------------------------------------------------------------------------------------------------------------------ */
function hoverCollect(sel){
  const A = window.__A, root = document.querySelector(sel); if (!root) return 0;
  const S = 'button,a[href],[role="button"],[role="option"],[role="menuitem"],[role="menuitemradio"],[role="menuitemcheckbox"],[role="tab"],[role="radio"],[role="switch"],.mi,.chip,summary,label[for],[tabindex="0"]';
  const set = new Set(); root.querySelectorAll(S).forEach(e => set.add(e));
  root.querySelectorAll('*').forEach(e => { if (!set.has(e) && getComputedStyle(e).cursor === 'pointer' && !(e.parentElement && e.parentElement.closest(S)) && !e.closest('svg')) set.add(e); });
  // anything a :hover rule styles (rows with a hover but no pointer and the like)
  if (!window.__hsel){ const sels = new Set();
    const walk = rules => { for (const r of rules){ try { if (r.media && !matchMedia(r.media.mediaText).matches) continue; if (r.cssRules && !r.selectorText){ walk(r.cssRules); continue; } if (!r.selectorText || !r.selectorText.includes(':hover')) continue;
      for (const s0 of r.selectorText.split(/,(?![^(]*\))/)){ const s = s0.trim(), i = s.indexOf(':hover'); if (i < 0) continue; let j = i + 6; for (; j < s.length && !/[\s>+~]/.test(s[j]); j++); const q = s.slice(0, j).replace(/::?(before|after)/g, '').replace(/:hover/g, ''); try { document.querySelector(q); sels.add(q); } catch(e){} } } catch(e){} } };
    for (const sh of document.styleSheets){ try { walk(sh.cssRules); } catch(e){} } window.__hsel = [...sels]; }
  for (const q of window.__hsel){ try { root.querySelectorAll(q).forEach(e => set.add(e)); } catch(e){} }
  window.__c = []; const per = new Map(); const rootW = Math.max(...A.cards().map(c => c.getBoundingClientRect().width), 200);
  for (const e of set){
    if (e === root || e.matches('html,body,.stage-in') || e.contains(A.root()) || A.skip(e) || !A.vis(e)) continue;
    if ([...set].some(o => o !== e && o.contains(e) && o.matches('.mi,[role="option"],[role^="menuitem"]'))) continue;
    const r = e.getBoundingClientRect(); if (r.width < 8 || r.height < 8 || e.disabled || e.getAttribute('aria-disabled') === 'true') continue;
    // (three of each kind of thing is enough: a list of twenty alike rows says the same as three)
    const k = A.cls(e).join('.') + '|' + (e.parentElement ? A.cls(e.parentElement).join('.') : ''); const c = per.get(k) || 0; if (c >= 3) continue; per.set(k, c + 1);
    window.__c.push({ e, kind:A.kind(e, rootW), trn:getComputedStyle(e).transition, real:e.matches(S) || getComputedStyle(e).cursor === 'pointer' });
  }
  // (a part of a row, like its words or its checkbox, hovers with the row: the row's look is the one that counts)
  const rowsIn = window.__c.filter(x => x.kind === 'row').map(x => x.e); window.__c = window.__c.filter(x => !rowsIn.some(r => r !== x.e && r.contains(x.e)));
  return window.__c.length;
}
function hoverLook(i){
  const A = window.__A, it = window.__c[i]; if (!it || !it.e.isConnected) return null; const e = it.e;
  const g = s => ({ bg:A.col(s.backgroundColor), bi:s.backgroundImage === 'none' ? '' : 'image', sh:A.shade(s) ? s.boxShadow : '', bd:parseFloat(s.borderTopWidth) ? `${A.px(s.borderTopWidth)}px ${A.col(s.borderTopColor)}` : '', tf:s.transform === 'none' ? '' : s.transform, rad:s.borderTopLeftRadius, op:s.opacity, col:A.col(s.color), w:s.width, h:s.height, trn:s.transition });
  const cs = getComputedStyle(e), r = e.getBoundingClientRect();
  const ps = k => { const s = getComputedStyle(e, k); return s.content !== 'none' && s.content !== 'normal' ? g(s) : null; };
  let glide = null; const L = e.closest('.hg[data-hg]'); if (L){ const s = getComputedStyle(L, L.dataset.hg === 'b' ? '::before' : '::after'); glide = { bg:A.col(s.backgroundColor), op:s.opacity, rad:s.borderTopLeftRadius, h:s.height, trn:s.transition }; }
  const selected = e.matches('[aria-pressed="true"],[aria-selected="true"],[aria-checked="true"],[aria-current]:not([aria-current="false"]),.on,.sel,.active,.is-on,.picked');
  return { el:g(cs), be:ps('::before'), af:ps('::after'), glide, W:r.width, H:r.height, sel:A.sel(e), path:A.path(e), txt:A.txt(e), kind:it.kind, selected, real:it.real };
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* In node: one page at one style, theme and width, through every card                                                  */
/* ------------------------------------------------------------------------------------------------------------------ */
// a hover or selected look as one line: what fills, in what shape, how it eases in; or what else changes
function describe(rest, hov){
  const shape = (rad, h) => { const r = parseFloat(rad) || 0; return r >= parseFloat(h) / 2 - .5 ? 'pill' : `${Math.round(r * 2) / 2}px`; };
  const dur = t => { const m = (t || '').match(/(background-color|background|opacity|all)\s+([\d.]+)(m?s)/); return m ? `${Math.round(parseFloat(m[2]) * (m[3] === 's' ? 1000 : 1))}ms` : 'instant'; };
  if (!hov) return null; const parts = [];
  if (hov.glide && rest && rest.glide && (hov.glide.op !== rest.glide.op || hov.glide.bg !== rest.glide.bg) && hov.glide.bg !== 'none' && +hov.glide.op > 0) parts.push(`fill ${hov.glide.bg} · ${shape(hov.glide.rad, hov.glide.h)} (gliding) · ${dur(hov.glide.trn)}`);
  for (const k of ['be', 'af']) if (!parts.length && hov[k] && (!rest || !rest[k] || rest[k].bg !== hov[k].bg || rest[k].op !== hov[k].op) && hov[k].bg !== 'none' && +hov[k].op > 0) parts.push(`fill ${hov[k].bg} · ${shape(hov[k].rad, hov[k].h)} · ${dur(hov[k].trn)}`);
  if (!parts.length && rest && hov.el.bg !== rest.el.bg && hov.el.bg !== 'none') parts.push(`fill ${hov.el.bg} · ${shape(hov.el.rad, hov.el.h)} · ${dur(hov.el.trn)}`);
  if (rest){ if (hov.el.bd !== rest.el.bd) parts.push(`edge ${hov.el.bd || 'none'}`); if (hov.el.sh !== rest.el.sh) parts.push('shadow or ring'); if (hov.el.tf !== rest.el.tf || hov.el.w !== rest.el.w) parts.push('moves or resizes'); if (!parts.length && hov.el.col !== rest.el.col) parts.push('text colour only'); }
  return parts.join(' · ') || 'no visible hover';
}
function restLook(l){
  const shape = (rad, h) => { const r = parseFloat(rad) || 0; return r >= parseFloat(h) / 2 - .5 ? 'pill' : `${Math.round(r * 2) / 2}px`; };
  const p = []; for (const k of ['el', 'be', 'af']){ const s = l[k]; if (s && s.bg !== 'none' && +s.op > 0) { p.push(`fill ${s.bg} · ${shape(s.rad, s.h)}`); break; } }
  if (l.el.bd) p.push(`edge ${l.el.bd}`); if (l.el.sh) p.push('ring or shadow'); return p.join(' · ') || `text ${l.el.col} only`;
}

async function stopDemo(p){ await p.evaluate(() => { const card = document.querySelector('.pg-demo > .card[data-c]'); if (card && card._c) card._c.mine = true; }); }
const NOTR = () => { let s = document.getElementById('__notr'); if (!s){ s = document.createElement('style'); s.id = '__notr'; s.textContent = '*,*::before,*::after{transition:none!important;animation-play-state:paused!important}'; document.head.append(s); } };
const TR = () => { const s = document.getElementById('__notr'); if (s) s.remove(); };

async function hoverPass(p, sel, base, add){
  const n = await p.evaluate(hoverCollect, sel); if (!n) return;
  // (the transition is read first, then turned off, so each look is read at once)
  const trn = []; for (let i = 0; i < n; i++) trn.push(await p.evaluate(i => { const it = window.__c[i]; if (!it) return {}; const L = it.e.closest('.hg[data-hg]'); return { el:getComputedStyle(it.e).transition, be:getComputedStyle(it.e, '::before').transition, af:getComputedStyle(it.e, '::after').transition, glide:L ? getComputedStyle(L, L.dataset.hg === 'b' ? '::before' : '::after').transition : '' }; }, i));
  await p.evaluate(NOTR); await p.mouse.move(2, 2); await p.waitForTimeout(60);
  for (let i = 0; i < n; i++){ try {
    const pos = await p.evaluate(i => { const it = window.__c[i]; if (!it || !it.e.isConnected) return null; const e = it.e; let r = e.getBoundingClientRect(); if (r.top < 0 || r.bottom > innerHeight){ e.scrollIntoView({ block:'center' }); r = e.getBoundingClientRect(); } const x = r.left + Math.min(r.width / 2, r.width - 3), y = r.top + r.height / 2, t = document.elementFromPoint(x, y); return { x, y, ok:!!t && (e === t || e.contains(t)) }; }, i);
    if (!pos || !pos.ok) continue;
    await p.mouse.move(2, 2); await p.waitForTimeout(20); const rest = await p.evaluate(hoverLook, i);
    await p.mouse.move(pos.x, pos.y); await p.waitForTimeout(50); const hov = await p.evaluate(hoverLook, i); await p.mouse.move(2, 2);
    if (!rest || !hov) continue;
    // the transition the fill eases with is the one read before transitions were turned off
    const tr = trn[i] || {}; hov.el.trn = tr.el || ''; if (hov.be) hov.be.trn = tr.be || ''; if (hov.af) hov.af.trn = tr.af || ''; if (hov.glide) hov.glide.trn = tr.glide || '';
    const kind = rest.kind === 'row' || rest.kind === 'field' ? (base.menu ? 'menu row' : 'row') : rest.kind, look = describe(rest, hov);
    // (a part found only through a :hover rule, that isn't a control and shows nothing on hover, is a part of something else)
    if (look === 'no visible hover' && !rest.real) continue;
    add({ ...base, cat:'hover', kind, prop:'hover', value:look, sel:rest.sel, path:rest.path, txt:rest.txt });
    if (rest.selected) add({ ...base, cat:'hover', kind, prop:'selected', value:restLook(rest), sel:rest.sel, path:rest.path, txt:rest.txt });
  } catch (e) {} }
  await p.evaluate(TR);
}

async function menus(p, base, add){
  const trig = await p.evaluate(() => { const r = document.querySelector('.cp-demo .stage-in'); window.__t = [...r.querySelectorAll('[data-pop],[aria-haspopup]:not([aria-haspopup="false"])')].filter(b => b.getClientRects().length && !window.__A.skip(b) && !b.matches('a[href]')); return window.__t.length; });
  for (let k = 0; k < trig; k++){ try {
    const pos = await p.evaluate(k => { const e = window.__t[k]; if (!e.isConnected) return null; e.scrollIntoView({ block:'center' }); const r = e.getBoundingClientRect(); return { x:r.left + r.width / 2, y:r.top + r.height / 2, name:window.__A.txt(e) }; }, k); if (!pos) continue;
    await p.mouse.click(pos.x, pos.y); await p.waitForTimeout(450);
    const open = await p.evaluate(() => { const r = document.querySelector('.cp-demo .stage-in'); const vis = e => { for (let a = e; a; a = a.parentElement){ const cs = getComputedStyle(a); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .1) return false; } return e.getClientRects().length > 0; };
      const pop = r.querySelector('.pop.open') || [...r.querySelectorAll('[role="menu"],[role="listbox"],.pop')].find(vis); document.querySelectorAll('[data-audit-pop]').forEach(x => x.removeAttribute('data-audit-pop')); if (!pop) return false; pop.setAttribute('data-audit-pop', ''); return true; });
    if (open) await hoverPass(p, '[data-audit-pop]', { ...base, menu:pos.name }, add);
    await p.keyboard.press('Escape'); await p.waitForTimeout(250);
    const still = await p.evaluate(k => { const e = window.__t[k]; if (!e.isConnected || e.getAttribute('aria-expanded') !== 'true') return null; const r = e.getBoundingClientRect(); return { x:r.left + r.width / 2, y:r.top + r.height / 2 }; }, k);
    if (still){ await p.mouse.click(still.x, still.y); await p.waitForTimeout(300); } await p.mouse.move(2, 2);
  } catch (e) {} }
}

// one card at one style, theme and width: every record it gave, each element's value once (raw/<style>-<theme>-<width>/<id>.json.gz)
const rawFile = (st, th, W, id) => path.join(OUT, 'raw', `${st}-${th}-${W}`, `${id}.json.gz`);
async function runCard(ctx, st, th, W, id, log){
  const url = `http://127.0.0.1:${port}/components/${PAGE[id] || id}.html`, recs = new Map();
  const keep = r => { const k = [r.design, r.menu || '', r.path, r.cat, r.kind, r.prop, r.value].join('|'); if (!recs.has(k)) recs.set(k, r); };
  // (a fresh page for every design, and three tries: a busy machine can take a while to load a page)
  const open = async () => { for (let k = 0; ; k++){ const p = await ctx.newPage(); try { await p.route(/plausible|api\.github\.com|supabase|fonts\.g|\/thumbs\//, r => r.abort()); await p.goto(url, { waitUntil:'load', timeout:120000 }); await p.waitForSelector('.cp-demo .stage-in', { timeout:60000 }); await p.evaluate(() => document.fonts.ready); return p; } catch (e) { await p.close().catch(() => {}); if (k >= 2) throw e; } } };
  let p = await open(); const designs = await p.locator('.cp-demo [aria-label$=" design"] button').allTextContents(); await p.close();
  let failed = 0;
  for (let d = 0; d < Math.max(1, designs.length); d++) for (let tries = 0; tries < 3; tries++){ p = null; try {
    p = await open(); await p.evaluate(install);
    await p.evaluate(() => document.querySelector('.cp-demo').scrollIntoView({ block:'start' }));
    if (designs.length) await p.locator('.cp-demo [aria-label$=" design"] button').nth(d).click({ timeout:60000 });
    await p.mouse.move(2, 2);
    const design = designs.length ? designs[d].trim() : '', base = { st, th, W, id, design, show:SHOWCASE.has(id) }, got = [], t0 = Date.now();
    for (const s of SAMPLES){
      const wait = s * 1000 - (Date.now() - t0); if (wait > 0) await p.waitForTimeout(wait);
      let r; for (let k = 0; k < 8; k++){ r = await p.evaluate(sample); if (!r.busy) break; await p.waitForTimeout(250); }
      if (!r || r.busy) continue;
      for (const x of r.recs) got.push({ ...base, t:s, cat:x[0], kind:x[1], prop:x[2], value:x[3], sel:x[4], path:x[5], txt:x[6], extra:x[7] });
    }
    if (HOVER && W === Math.max(...widths)){ await stopDemo(p); await p.waitForTimeout(300); await p.evaluate(() => document.querySelector('.cp-demo .stage-in').setAttribute('data-audit-root', ''));
      const h = r => got.push(r); await hoverPass(p, '[data-audit-root]', { ...base, t:'end', menu:'' }, h); await menus(p, { ...base, t:'end' }, h); }
    got.forEach(keep); await p.close(); break;
  } catch (e) { if (p) await p.close().catch(() => {}); log(`${st} ${th} ${W} ${id} design ${d}: ${e.message.split('\n')[0]}${tries < 2 ? ', trying again' : ', gave up'}`); if (tries === 2) failed++; } }
  const f = rawFile(st, th, W, id); fs.mkdirSync(path.dirname(f), { recursive:true });
  // (a card that failed in any design isn't cached, so a rerun with RESUME=1 measures it again)
  if (!failed) fs.writeFileSync(f, zlib.gzipSync(JSON.stringify([...recs.values()])));
  log(`${st} ${th} ${W} ${id}${designs.length ? ' · ' + designs.length + ' designs' : ''}${failed ? ' · FAILED ' + failed : ''}`);
  return [...recs.values()];
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* In node: tallying, flags and the reports                                                                            */
/* ------------------------------------------------------------------------------------------------------------------ */
const CATS = { buttons:'Buttons', insets:'Card insets', heads:'Heads and footers', rows:'Rows', gaps:'Gaps', radii:'Radii', hover:'Hover and selected fills', type:'Type', lines:'Hairlines and borders' };
const T = {}; // T[bucket][st th][cat][kind][prop][value] = { n:Set(elements), comps:Map(comp -> Map(sel -> n)), ex }
function add(r){
  const bucket = r.show ? 'showcase' : 'main', sth = `${STYLE_NAME[r.st]} ${r.th}`;
  const node = (((((T[bucket] = T[bucket] || {})[sth] = T[bucket][sth] || {})[r.cat] = T[bucket][sth][r.cat] || {})[r.kind] = T[bucket][sth][r.cat][r.kind] || {})[r.prop] = T[bucket][sth][r.cat][r.kind][r.prop] || {});
  const v = node[r.value] = node[r.value] || { n:new Set(), comps:new Map(), ex:null };
  // an element counts once however many moments it was seen at: its card, design, width and place in the component
  v.n.add(`${r.id}|${r.design}|${r.W}|${r.path}|${r.menu || ''}`);
  const comp = r.design ? `${r.id} (${r.design})` : r.id; if (!v.comps.has(comp)) v.comps.set(comp, new Map()); const m = v.comps.get(comp); m.set(r.sel, (m.get(r.sel) || 0) + 1);
  if (!v.ex || (r.W === 1440 && v.ex.W !== 1440)) v.ex = { id:r.id, design:r.design, W:r.W, t:r.t, path:r.path, sel:r.sel, txt:r.txt, menu:r.menu || '', extra:r.extra || null };
}
const onScale = v => { const m = String(v).match(/-?[\d.]+/g); return !m || m.every(x => Math.round(Math.abs(+x)) % 4 === 0); };
function tables(){
  const out = {};
  for (const [bucket, B] of Object.entries(T)) for (const [sth, S] of Object.entries(B)) for (const [cat, C] of Object.entries(S)) for (const [kind, K] of Object.entries(C)) for (const [prop, P] of Object.entries(K)){
    const vals = Object.entries(P).map(([value, v]) => { const counts = {}; v.n.forEach(k => { const [id, design] = k.split('|'), c = design ? `${id} (${design})` : id; counts[c] = (counts[c] || 0) + 1; });
      return { value, count:v.n.size, counts, components:[...v.comps.keys()].sort(), where:Object.fromEntries([...v.comps].map(([c, m]) => [c, [...m.keys()]])), example:v.ex }; });
    (((out[bucket] = out[bucket] || {})[sth] = out[bucket][sth] || {})[cat] = out[bucket][sth][cat] || {})[`${kind} · ${prop}`] = flag(prop, vals);
  }
  return out;
}
// most used first, and the flags: a one-off (one or two components, where more use the same thing) and spacing off the 4px scale
function flag(prop, vals){
  vals.sort((a, b) => b.count - a.count || b.components.length - a.components.length);
  const comps = new Set(vals.flatMap(v => v.components.map(c => c.replace(/ \(.*\)$/, ''))));
  vals.forEach(v => { const cs = new Set(v.components.map(c => c.replace(/ \(.*\)$/, ''))); v.flags = []; if (cs.size <= 2 && vals.length > 1 && comps.size > 2) v.flags.push('one-off'); if (SPACING.has(prop) && !onScale(v.value)) v.flags.push('off 4px scale'); });
  return vals;
}
// reports merged: each later report replaces the cards it measured (so a rerun of the changed cards updates a full run)
function merge(list){
  const R = JSON.parse(JSON.stringify(list[0]));
  for (const r of list.slice(1)){ const cover = new Set(r.meta.ids), mine = c => cover.has(c.replace(/ \(.*\)$/, ''));
    for (const bucket of ['main', 'showcase']){ const B = R[bucket] = R[bucket] || {};
      for (const S of Object.values(B)) for (const C of Object.values(S)) for (const [kp, vals] of Object.entries(C)){
        C[kp] = vals.map(v => { for (const c of v.components.filter(mine)){ v.count -= (v.counts || {})[c] || 0; delete v.where[c]; if (v.counts) delete v.counts[c]; } v.components = v.components.filter(c => !mine(c)); if (v.example && cover.has(v.example.id)) v.example = null; return v; }).filter(v => v.components.length); }
      for (const [sth, S] of Object.entries(r[bucket] || {})) for (const [cat, C] of Object.entries(S)) for (const [kp, vals] of Object.entries(C)){
        const into = ((B[sth] = B[sth] || {})[cat] = B[sth][cat] || {})[kp] = (B[sth][cat] || {})[kp] || [];
        for (const v of vals){ const o = into.find(x => x.value === v.value); if (!o){ into.push(JSON.parse(JSON.stringify(v))); continue; }
          o.count += v.count; o.counts = Object.assign(o.counts || {}, v.counts); Object.assign(o.where, v.where); o.components = [...new Set(o.components.concat(v.components))].sort(); o.example = o.example || v.example; } } }
    R.meta.ids = [...new Set(R.meta.ids.concat(r.meta.ids))]; }
  for (const bucket of ['main', 'showcase']) for (const S of Object.values(R[bucket] || {})) for (const C of Object.values(S)) for (const [kp, vals] of Object.entries(C)){ const prop = kp.split(' · ').pop(); C[kp] = flag(prop, vals); if (!C[kp].length) delete C[kp]; }
  return R;
}
// the spec, and every value off it, with what it would become
const SPEC = process.env.SPEC ? JSON.parse(fs.readFileSync(process.env.SPEC, 'utf8')) : null;
const num = v => { const m = String(v).match(/^-?[\d.]+$/); return m ? +v : null; };
function offSpec(R){
  if (!SPEC) return null; const out = {};
  for (const [sth, S] of Object.entries(R.main || {})){ const style = sth.split(' ')[0]; out[sth] = [];
    for (const [cat, C] of Object.entries(S)) for (const [kp, vals] of Object.entries(C)){
      const [kind, prop] = kp.split(' · '), pick = o => o && o[cat] && (o[cat][kp] || o[cat]['* · ' + prop]);
      const allowed = pick(SPEC[style]) || pick(SPEC.All); if (!allowed) continue;
      for (const v of vals){ const n = num(v.value); if (allowed.some(a => String(a) === v.value || (n !== null && num(a) !== null && Math.abs(num(a) - n) <= .5))) continue;
        const nums = allowed.map(num).filter(x => x !== null), becomes = n !== null && nums.length ? String(nums.reduce((a, b) => Math.abs(b - n) < Math.abs(a - n) ? b : a)) : allowed.length === 1 ? String(allowed[0]) : 'one of ' + allowed.join(', ');
        out[sth].push({ cat, what:kp, now:v.value, becomes, count:v.count, where:v.where }); } } }
  return out;
}
function markdown(R){
  const L = [], sths = Object.keys(R.main || {}), cell = v => v === undefined ? '-' : v;
  const M = R.meta || { port, ids, styles, themes, widths, samples:SAMPLES, hover:HOVER, date:new Date().toISOString() };
  L.push('# System audit', '', `Built site on port ${M.port}, ${M.date.slice(0, 10)}. ${M.ids.length} cards, ${M.styles.join(', ')} × ${M.themes.join(', ')} at ${M.widths.join(' and ')}px, through every design, sampled at ${M.samples.join(', ')}s into each demo${M.hover ? `; hover with the real mouse at ${Math.max(...M.widths)}px, menus opened` : ''}.`, '',
    'Each value counts the elements that use it (an element counts once however many moments it was seen at). "one-off": used by one or two components only. "off 4px": a spacing value off the 4px scale. Buttons and Badge show variants on purpose and are counted apart, under Showcase.', '');
  // headline: distinct values per category and style
  L.push('## Distinct values per category', '', `| category · what | ${sths.join(' | ')} |`, `|---|${sths.map(() => '---').join('|')}|`);
  const keys = new Set(); sths.forEach(s => Object.entries(R.main[s]).forEach(([cat, C]) => Object.keys(C).forEach(k => keys.add(cat + '\u0000' + k))));
  [...keys].sort((a, b) => Object.keys(CATS).indexOf(a.split('\u0000')[0]) - Object.keys(CATS).indexOf(b.split('\u0000')[0]) || a.localeCompare(b)).forEach(k => { const [cat, kp] = k.split('\u0000'); L.push(`| ${CATS[cat]} · ${kp} | ${sths.map(s => cell(R.main[s][cat] && R.main[s][cat][kp] && R.main[s][cat][kp].length)).join(' | ')} |`); });
  L.push('');
  const block = (title, S, depth) => { L.push(`${depth} ${title}`, '');
    for (const cat of Object.keys(CATS)){ if (!S[cat]) continue; L.push(`${depth}# ${CATS[cat]}`, '');
      for (const [kp, vals] of Object.entries(S[cat]).sort()){ L.push(`**${kp}** (${vals.length} distinct)`, '');
        vals.slice(0, 14).forEach(v => L.push(`- \`${v.value}\` × ${v.count} · ${v.components.length} comp${v.flags.length ? ' · **' + v.flags.join(', ') + '**' : ''} · ${v.components.slice(0, 6).join(', ')}${v.components.length > 6 ? ` +${v.components.length - 6}` : ''}`));
        if (vals.length > 14) L.push(`- … ${vals.length - 14} more (report.json)`); L.push(''); } } };
  for (const s of sths) block(s, R.main[s], '##');
  // flags, with component and selector
  L.push('## Flags', '');
  for (const s of sths){ L.push(`### ${s}`, ''); for (const cat of Object.keys(CATS)){ const C = R.main[s][cat]; if (!C) continue; const fl = [];
    for (const [kp, vals] of Object.entries(C)) for (const v of vals) if (v.flags.length) fl.push(`- ${kp} \`${v.value}\` (${v.flags.join(', ')}): ${Object.entries(v.where).slice(0, 4).map(([c, sels]) => `${c} \`${sels.slice(0, 2).join('`, `')}\``).join('; ')}${Object.keys(v.where).length > 4 ? ' …' : ''}`);
    if (fl.length) L.push(`#### ${CATS[cat]} (${fl.length})`, '', ...fl, ''); } }
  if (R.offspec){ L.push('## Off spec (the fix list)', '', `Checked against ${process.env.SPEC}.`, '');
    for (const [s, list] of Object.entries(R.offspec)){ L.push(`### ${s} (${list.reduce((a, x) => a + x.count, 0)} elements)`, '');
      for (const cat of Object.keys(CATS)){ const l = list.filter(x => x.cat === cat); if (!l.length) continue; L.push(`#### ${CATS[cat]}`, '', '| component | selector | what | now | becomes |', '|---|---|---|---|---|');
        l.forEach(x => Object.entries(x.where).forEach(([c, sels]) => L.push(`| ${c} | \`${sels.slice(0, 3).join('`, `')}\` | ${x.what} | \`${x.now}\` | \`${x.becomes}\` |`))); L.push(''); } } }
  if (R.showcase) for (const s of Object.keys(R.showcase)) block(`Showcase (Buttons, Badge): ${s}`, R.showcase[s], '##');
  return L.join('\n');
}

(async () => {
  if (process.env.FROM){ const R = merge(process.env.FROM.split(',').map(f => JSON.parse(fs.readFileSync(f, 'utf8')))); R.offspec = offSpec(R); fs.mkdirSync(OUT, { recursive:true });
    fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(R)); fs.writeFileSync(path.join(OUT, 'report.md'), markdown(R)); console.log(`checked ${process.env.FROM} against ${process.env.SPEC || 'no spec'}`); return; }
  const b = await chromium.launch();
  const log = m => process.stdout.write(m + '\n');
  // every card at every style, theme and width is one job; RESUME=1 takes a job's records from the cache when it has them
  const jobs = []; for (const st of styles) for (const th of themes) for (const W of widths) for (const id of ids) jobs.push([st, th, W, id]);
  const ctxs = new Map(), ctxFor = async (st, th, W) => { const k = `${st}|${th}|${W}`; if (!ctxs.has(k)) ctxs.set(k, (async () => { const c = await b.newContext({ viewport:{ width:W, height:W > 800 ? 1000 : 844 }, deviceScaleFactor:1 });
    await c.addInitScript(([s, t]) => { try { localStorage.setItem('dmui-style', s); localStorage.setItem('dmui-theme', t); } catch(e){} }, [STYLE_KEY[st], th]); return c; })()); return ctxs.get(k); };
  let i = 0; await Promise.all(Array.from({ length:Math.min(CONC, jobs.length) }, async () => { while (i < jobs.length){ const [st, th, W, id] = jobs[i++]; const f = rawFile(st, th, W, id);
    const recs = process.env.RESUME === '1' && fs.existsSync(f) ? JSON.parse(zlib.gunzipSync(fs.readFileSync(f))) : await runCard(await ctxFor(st, th, W), st, th, W, id, log).catch(e => (log(`${st} ${th} ${W} ${id}: ${e.message.split('\n')[0]}`), []));
    recs.forEach(add); } }));
  await b.close();
  const R = { meta:{ port, ids, styles, themes, widths, samples:SAMPLES, hover:HOVER, date:new Date().toISOString() }, ...tables() }; R.offspec = offSpec(R); fs.mkdirSync(OUT, { recursive:true });
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(R));
  fs.writeFileSync(path.join(OUT, 'report.md'), markdown(R));
  log(`wrote ${path.join(OUT, 'report.json')} and report.md`);
})();
