// Rule checker for the library's components and templates (owner, 23 Nov: "do you really want me to go through 125
// components one by one in 3 styles and find these mistakes? Can it not be done with a simple rule???").
//
// Every component page (and every template) is opened in each style, theme and width. Its demo is sampled while it plays,
// then its rows and controls are hovered, its menus opened, and every drawn element is checked against these rules:
//   R1 Inset        what is drawn inside a shape keeps a minimum inset from the shape's edges (16px in a card, panel,
//                   popover or strip with controls; 6px in a row fill, field or button; 4px in a small chip or an icon
//                   button; never 0-3px). Full-bleed dividers and strips are exempt.
//   R2 Even         a single line of things in a bar, strip, row, chip or button has equal room above and below (±1px);
//                   things at both ends of a row have the same inset at both ends (±1px); a head or footer band has the same
//                   room on the hairline side as on the card's edge
//   R3 Baseline     words side by side on one line share a baseline (±0.5px), measured with a zero-size inline-block probe
//   R4 Shape        a shape rounded to 40% or more of its shorter side is a true circle or a clear pill
//   R5 Disabled     nothing inside a disabled control keeps an accent, status or strong fill or colour
//   R6 Visible fill a chip, selected or hover fill differs from what is behind it by at least as much as Clean's own chip
//   R7 Same look    buttons with one job (primary, secondary, ghost, icon, chip, key chip) have one look per style and theme
//   R8 Collisions   two sibling chips, buttons or tags are at least 4px apart and never overlap
// Each violation has the rule, the page, style, theme, width and moment, the selectors, the numbers and a 2x crop with the
// offending edges outlined (red: the shape, blue: what sits in it or beside it).
//
// usage (from the repo root, with the built site served on PORT):
//   node tools/site/check-rules.js
//   IDS=web-search,rich-text-editor STYLES=soft,bp,clean THEMES=light,dark WIDTHS=1440,390 JOBS=5 OUT=/tmp/rules node tools/site/check-rules.js
//   (IDS takes component ids, and template ids as templates/<id>; SECS and STEP set how long and how often the demo is
//   sampled; FRESH=1 ignores the results of an earlier run in OUT, which are otherwise kept and skipped; REPORT=1 only writes
//   the report from the runs already in OUT)
// It must report no Phase I violations outside the exceptions list before anything is shown to the owner.
const { chromium } = require(process.env.PW || 'playwright');
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');

const PORT = process.env.PORT || 8890, HOST = `http://127.0.0.1:${PORT}`;
const OUT = path.resolve(process.env.OUT || path.join(os.tmpdir(), 'check-rules'));
const STYLES = (process.env.STYLES || 'soft,bp,clean').split(',').filter(Boolean);
const THEMES = (process.env.THEMES || 'light,dark').split(',').filter(Boolean);
const WIDTHS = (process.env.WIDTHS || '1440,390').split(',').filter(Boolean).map(Number);
const SECS = +(process.env.SECS || 26), STEP = +(process.env.STEP || .5), MAXS = +(process.env.MAXS || 18), JOBS = +(process.env.JOBS || 4);
const HOVERS = +(process.env.HOVERS || 14), POPS = +(process.env.POPS || 3), SETTLE = +(process.env.SETTLE || 700);
const T0 = Date.parse('2026-11-23T09:00:00Z');
const STYLE_NAME = { soft:'Soft', bp:'Blueprint', clean:'Clean' };

// Phase II (owner, 21 and 22 Nov): left out of the Clean review, kept as they are on staging, reported after Phase I
const PHASE2 = new Set(['kanban-board', 'pricing-cards', 'stepper', 'scatter-chart', 'funnel-chart', 'top-pages', 'radar-chart',
  'agent-harness', 'bar-chart', 'radial-goals', 'canvas-toolbar', 'automation-canvas', 'data-picker', 'currency-converter',
  'payment-form', 'otp-field', 'number-field', 'slider', 'country-select', 'social-sign-in', 'carousel', 'date-range-picker',
  'invite-to-collaborate']);

// Exceptions: kept short, each with its reason. A violation that matches is still written to violations.json, marked
// with the reason, but is not counted.
const EXCEPTIONS = [
  { ids:['buttons'], rules:['R7'], reason:'Buttons shows every button variant side by side on purpose.' },
  { ids:['badge'], rules:['R7'], reason:'Badge shows every badge tone and size side by side on purpose.' },
  { ids:['event-calendar'], rules:['R1'], sel:/\.ecx-e\b/, reason:'Event calendar\'s events fill their slot in the grid edge to edge and keep a compact inset, as calendar events do.' },
];

// ---------------------------------------------------------------------------------------------------------------------
// In the page: the rules. Installed with addInitScript, so it is there on every page; everything it needs is inside it.
function rulesLib(){
  if (window.__rules) return;
  const R = window.__rules = {};
  const px = v => parseFloat(v) || 0;
  const EXCL = '.hand,.dm>.demo,.seg2,.cp-anim,.pg-live,script,style,template,noscript';
  let ROOT = null, OPT = {}, gcsC, visC, behC;
  const gcs = e => { let c = gcsC.get(e); if (!c){ c = getComputedStyle(e); gcsC.set(e, c); } return c; };

  // ---- colour: any computed colour to [r,g,b,a], composited, compared in OKLab (×100) --------------------------------
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently:true });
  const colC = new Map();
  const rgba = s => { if (!s || s === 'none') return [0, 0, 0, 0]; let c = colC.get(s); if (c) return c;
    const m = s.match(/^rgba?\(([^)]*)\)$/);
    if (m){ const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat); c = [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
    else if (s === 'transparent') c = [0, 0, 0, 0];
    else { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = s; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; c = [d[0], d[1], d[2], d[3] / 255]; }
    colC.set(s, c); return c; };
  const over = (a, b) => { const A = a[3], B = b[3], o = A + B * (1 - A); if (!o) return [0, 0, 0, 0]; return [0, 1, 2].map(i => (a[i] * A + b[i] * B * (1 - A)) / o).concat(o); };
  const lab = c => { const f = v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; const r = f(c[0]), g = f(c[1]), b = f(c[2]);
    const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b), m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b), s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
    return [.2104542553 * l + .7936177850 * m - .0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .8086757660 * s]; };
  const dE = (a, b) => { const x = lab(a), y = lab(b); return 100 * Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
  const chroma = c => { const x = lab(c); return 100 * Math.hypot(x[1], x[2]); };
  const hex = c => '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('') + (c[3] < .995 ? Math.round(c[3] * 255).toString(16).padStart(2, '0') : '');
  R.util = { rgba, over, dE, chroma, hex };

  // ---- what is on screen --------------------------------------------------------------------------------------------
  // (text kept for screen readers only, clipped to nothing with clip-path: inset(50%), is not on screen either)
  const vis = e => { if (!e || e === document.documentElement || e === document.body) return true; let v = visC.get(e); if (v !== undefined) return v;
    const cs = gcs(e); v = !(cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .1 || e.hidden || cs.clipPath === 'inset(50%)' || cs.contentVisibility === 'hidden') && (e === ROOT || vis(e.parentElement));
    if (v && e.matches(EXCL)) v = false; visC.set(e, v); return v; };
  const rect = b => ({ l:b.left, t:b.top, r:b.right, b:b.bottom });
  const W = q => q.r - q.l, H = q => q.b - q.t;
  const name = e => { if (!e || !e.tagName) return '?'; const c = typeof e.className === 'string' ? e.className.trim().split(/\s+/).filter(k => k && !/^(on|shim|in|out|is-|show)/.test(k)).slice(0, 2) : [];
    return c.length ? '.' + c.join('.') : e.tagName.toLowerCase(); };
  const words = e => { const t = (e.textContent || '').replace(/\s+/g, ' ').trim(); return t ? ` "${t.slice(0, 22)}${t.length > 22 ? '…' : ''}"` : ''; };
  const path = (e, ps) => { const p = e.parentElement && e.parentElement !== ROOT ? name(e.parentElement) + ' > ' : ''; return p + name(e) + (ps ? '::' + ps : ''); };

  // ---- animations: an element mid-transition is not judged, nor (when it moves) what is inside it ---------------------
  let unstable, unstablePs, moving;
  const markAnims = () => { unstable = new Set(); unstablePs = new Map(); moving = new Set();
    for (const a of document.getAnimations()){ if (a.playState !== 'running' || !a.effect || !a.effect.target) continue; const el = a.effect.target, t = a.effect.getComputedTiming();
      let props = ''; try { props = a.transitionProperty || a.effect.getKeyframes().map(k => Object.keys(k).join(' ')).join(' '); } catch(e){}
      const mv = /transform|translate|scale|rotate|opacity|top|left|right|bottom|inset|margin|all/.test(props), ps = a.effect.pseudoElement;
      if (t.iterations === Infinity && !/transform|translate|scale|rotate/.test(props)) continue;
      if (ps){ if (!unstablePs.has(el)) unstablePs.set(el, new Set()); unstablePs.get(el).add(ps.replace(/^:+/, '')); continue; }
      unstable.add(el); if (mv && t.iterations !== Infinity) moving.add(el); } };
  const psUnstable = (e, ps) => !!(unstablePs.get(e) && unstablePs.get(e).has(ps));
  const isMoving = e => { for (let a = e; a && a !== document.body; a = a.parentElement) if (moving.has(a)) return true; return false; };

  // ---- clipping: a thing's visible box, inside the scroll boxes and clips between it and the shape it sits in -------------
  // (a side cut by a scroll box or a clip between the thing and its shape is not an edge of the thing, so it is not measured;
  // words cut by their own box, an ellipsis, end at that box, which is measured)
  const clipTo = (e, q, stop, self) => { const r = Object.assign({}, q), cut = {}; for (let a = self ? e : e.parentElement; a && a !== stop && a !== document.body; a = a.parentElement){ const cs = gcs(a); if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
      const c = a.getBoundingClientRect(), own = self && a === e;
      for (const [k, v, f] of [['l', c.left, Math.max], ['t', c.top, Math.max], ['r', c.right, Math.min], ['b', c.bottom, Math.min]]){ const n = f(r[k], v); if (n !== r[k]){ if (!own && Math.abs(n - r[k]) > 1) cut[k] = true; r[k] = n; } } }
    return { r, cut }; };

  // ---- the drawn edges of an element: fill, border, rings and soft shadows ------------------------------------------------
  const PAGEBG = () => { const b = rgba(gcs(document.body).backgroundColor); return b[3] ? b : (OPT.theme === 'dark' ? [0, 0, 0, 1] : [255, 255, 255, 1]); };
  let backdrops = [];
  // what is directly behind an element: its ancestors' fills and any backdrop fill (a hover highlight drawn by a pseudo or a
  // sliding element) laid between them and it
  const behind = e => { let v = behC.get(e); if (v) return v; const layers = [];
    const b = e.getBoundingClientRect(), cxp = (b.left + b.right) / 2, cyp = (b.top + b.bottom) / 2;
    for (let a = e.parentElement; a; a = a.parentElement){
      for (const d of backdrops) if (d.host === a && d.el !== e && !(d.ps === '' && d.el.contains(e)) && cxp > d.edge.l && cxp < d.edge.r && cyp > d.edge.t && cyp < d.edge.b) layers.push(d.fc);
      const c = rgba(gcs(a).backgroundColor); if (c[3] > 0){ layers.push(c); if (c[3] >= .999) break; } }
    let base = PAGEBG(); for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base); behC.set(e, base); return base; };
  const shadows = s => s && s !== 'none' ? s.split(/,(?![^(]*\))/).map(x => { const col = (x.match(/rgba?\([^)]*\)|color\([^)]*\)|oklch\([^)]*\)|oklab\([^)]*\)|#[\da-f]+/i) || ['rgba(0,0,0,0)'])[0];
    const n = x.replace(col, '').replace('inset', '').trim().split(/\s+/).map(parseFloat); return { inset:/inset/.test(x), col:rgba(col), x:n[0] || 0, y:n[1] || 0, blur:n[2] || 0, spread:n[3] || 0 }; }) : [];
  const drawnEdges = (cs, bh) => {
    const clipText = /text/.test(cs.backgroundClip + ' ' + (cs.webkitBackgroundClip || ''));
    const fc = clipText ? [0, 0, 0, 0] : rgba(cs.backgroundColor), fill = fc[3] > .02 ? over(fc, bh) : null, fillDE = fill ? dE(fill, bh) : 0;
    const grad = !clipText && cs.backgroundImage && cs.backgroundImage !== 'none' && /gradient/.test(cs.backgroundImage) && !/repeating|linear-gradient\(([^,]*,)?\s*(rgba?\([^)]*\)|#\w+|var)[^,]*1px/.test(cs.backgroundImage);
    const sides = ['Top', 'Right', 'Bottom', 'Left'].map(s => px(cs[`border${s}Width`]) >= .5 && cs[`border${s}Style`] !== 'none' && rgba(cs[`border${s}Color`])[3] > .05 && dE(over(rgba(cs[`border${s}Color`]), bh), bh) >= 2);
    let ring = 0, ringDE = 0, inRing = 0, elev = false;
    for (const s of shadows(cs.boxShadow)){ if (s.col[3] < .02) continue; const d = dE(over(s.col, fill || bh), fill || bh);
      if (!s.x && !s.y && !s.blur && s.spread > 0 && d >= 2){ if (s.inset) inRing = Math.max(inRing, s.spread); else ring = Math.max(ring, s.spread); ringDE = Math.max(ringDE, d); }
      else if (!s.inset && s.blur > 0 && s.col[3] > .03) elev = true; }
    return { fc, fill, fillDE, grad, sides, all:sides.every(Boolean), some:sides.some(Boolean), ring, inRing, ringDE, elev,
      borderDE:sides.some(Boolean) ? Math.max(...['Top', 'Right', 'Bottom', 'Left'].map(s => dE(over(rgba(cs[`border${s}Color`]), bh), bh))) : 0 }; };
  const radiusOf = (cs, w, h) => { const v = cs.borderTopLeftRadius.split(' ')[0]; const r = /%/.test(v) ? px(v) / 100 * Math.min(w, h) : px(v); return Math.min(r, Math.min(w, h) / 2); };

  // things a script places by coordinates (a chart's bars and labels, a timeline's marks) sit where the data puts them
  const placed = (e, stop) => { for (let a = e; a && a !== stop && a !== ROOT; a = a.parentElement){ const st = a.getAttribute && a.getAttribute('style') || ''; if (/(^|;)\s*(left|width|clip-path|--x0?|--w|--l|--lv)\s*:/.test(st)) return true; } return false; };
  const CTL = 'button,a[href],input,select,textarea,summary,[role="button"],[role="option"],[role="menuitem"],[role="menuitemradio"],[role="menuitemcheckbox"],[role="tab"],[role="switch"],[role="checkbox"],[role="radio"],.pill,.ib,.tag,.chip,.kbd,.bdg';
  const CHIP = '.tag,.chip,.kbd,.bdg,[class*="chip"],[class*="-tag"]';
  const POPS = '.pop,.tip,[role="menu"],[role="listbox"],[role="dialog"],[role="tooltip"]';
  // the role of a shape, from what it is and its size; it sets the inset its contents keep (R1)
  const roleOf = (s) => { const e = s.el, w = W(s.edge), h = H(s.edge);
    if (w >= innerWidth * .95 && h >= innerHeight * .8) return 'page'; // a template's app frame: the window, not a card
    if (s.ps) return w <= 44 && h <= 44 ? 'tile' : h <= 120 && w >= 40 ? 'row' : 'card'; // a fill drawn behind a row (a hover or a selection)
    // (a small round or square thing, an avatar or an icon tile, is a tile, unless it is a control itself)
    if (w <= 44 && h <= 44 && Math.abs(w - h) <= 2 && !e.matches(CTL)) return 'tile';
    // (a file's thumbnail, a square up to 96px, carries its badges in its corners, as thumbnails do)
    if (w <= 96 && h <= 96 && Math.abs(w - h) <= 8 && !e.matches(CTL + ',' + POPS)) return 'thumb';
    // (a meter: a slim bar with no words, whose segments sit 2px in)
    if (h <= 24 && w >= 60 && !e.textContent.trim() && e.children.length) return 'track';
    // a menu: a popover of menu items, or a panel that is a list of options as wide as itself (Model picker's list)
    const menuish = () => [...e.querySelectorAll('[role="radiogroup"],[role="listbox"],[role="menu"]')].some(l => l.getBoundingClientRect().width >= w * .85 && [...l.children].filter(k => k.getBoundingClientRect().width >= w * .8).length >= 2);
    // (a segmented control: a track holding two or more buttons or tabs side by side; its segments sit 2-3px in, as usual)
    const segs = [...e.children].filter(k => k.matches('button,[role="tab"],[role="radio"],label') && k.getBoundingClientRect().height >= h - 12);
    if (segs.length >= 2 && h <= 48 && segs.every(k => Math.abs(k.getBoundingClientRect().top - segs[0].getBoundingClientRect().top) < 2)) return 'track';
    if (e.matches(POPS)) return menuish() || e.querySelectorAll('.mi,[role="menuitem"],[role="option"],[role="menuitemradio"],[role="menuitemcheckbox"]').length >= 2 ? 'menu' : h <= 56 ? 'bar' : 'card';
    // (a wide row a person clicks is a row whatever its height, one line or a few on a phone: its fill is a hover or a
    // selection, with no edge of its own, unlike a card)
    const edged = s.de.all || s.de.ring || s.de.inRing || s.de.elev;
    if ((h <= 96 || (!edged && h <= 160)) && (gcs(e).cursor === 'pointer' || e.matches('button,[role="option"],[role="radio"],[role="checkbox"],[role="menuitem"],li,label')) && s.host && w >= s.host.getBoundingClientRect().width * .6 && w >= 160) return 'row';
    if (e.matches('input,textarea,select')) return 'field';
    if (e.matches(CTL) || (e.closest(CTL) && h <= 40)){ if (w <= 44 && h <= 44 && !e.textContent.trim()) return 'icon'; if (h <= 22) return 'chip'; return h <= 64 ? 'control' : 'card'; }
    if (w <= 44 && h <= 44) return 'tile';
    if (e.matches('tr,thead,[role="row"]') || gcs(e).display === 'table-row') return 'row';
    if (h <= 22 && w <= 160) return 'chip';
    if (h <= 64) return w >= 120 ? 'row' : 'control';
    return menuish() ? 'menu' : 'card'; };
  // minimum inset of what is drawn inside a shape, per side, by role
  const MIN = { thumb:{ h:4, v:4 }, track:{ h:2, v:2 }, menu:{ h:4, v:4 }, bar:{ h:6, v:6 }, card:{ h:16, v:16 }, strip:{ h:16, v:16 }, band:{ h:16, v:6 }, row:{ h:6, v:4 }, control:{ h:6, v:3 }, field:{ h:6, v:3 }, chip:{ h:4, v:2 }, icon:{ h:4, v:4 } };

  // ---- text metrics --------------------------------------------------------------------------------------------------
  const fm = new Map();
  const metrics = (cs, text) => { const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`, k = font + '|' + text; let m = fm.get(k); if (m) return m;
    cx.font = font; const t = cx.measureText(text || 'Hx'); m = { asc:Math.round(t.fontBoundingBoxAscent), inkA:t.actualBoundingBoxAscent, inkD:t.actualBoundingBoxDescent }; fm.set(k, m); return m; };
  // the line box of a run of words (their line height, as CSS sets it), and the ink of its glyphs
  // (the browser rounds the half-leading above the words down, so the line box sits up to 1px higher round them than an even split)
  const lineBox = (cs, q) => { const lh = cs.lineHeight === 'normal' ? H(q) : px(cs.lineHeight), t = q.t - Math.floor((lh - H(q)) / 2); return { t, b:t + lh }; };

  // ---- one sample: every drawn element and every rule ------------------------------------------------------------------
  R.setup = opt => { OPT = opt; };
  const rootEl = () => document.querySelector(OPT.root);
  // R5 Disabled: inside a disabled control, nothing keeps an accent, status or strong fill, or a coloured mark or word
  const disabledCheck = V => { ROOT.querySelectorAll(':disabled,[aria-disabled="true"],.disabled,[data-disabled]').forEach(D => { if (!vis(D) || isMoving(D) || unstable.has(D)) return; const dcs = gcs(D), bh = behind(D);
    const dfill = rgba(dcs.backgroundColor)[3] > .02 ? over(rgba(dcs.backgroundColor), bh) : bh, dChrom = chroma(dfill) > 4 || chroma(rgba(dcs.color)) > 4;
    if (dChrom) return; // the control keeps its own colour (faded as a whole), so its parts match it
    D.querySelectorAll('*').forEach(e => { if (!vis(e) || unstable.has(e) || e.closest('svg') && e.tagName.toLowerCase() !== 'svg') return; const cs = gcs(e), b = e.getBoundingClientRect(); if (b.width < 2 || b.height < 2) return;
      const fc = rgba(cs.backgroundColor), f = fc[3] > .02 ? over(fc, behind(e)) : null, col = rgba(cs.color), stroke = e.tagName.toLowerCase() === 'svg' ? rgba(cs.color) : null;
      const why = f && chroma(f) > 6 ? `a ${hex(f)} fill` : f && dE(f, dfill) > 30 ? `a strong ${hex(f)} fill` : (e.childNodes.length && [...e.childNodes].some(k => k.nodeType === 3 && k.textContent.trim()) || stroke) && chroma(col) > 8 && col[3] > .3 ? `${hex(col)} ${stroke ? 'marks' : 'words'}` : null;
      if (why) V('R5', `${path(e)}${words(e)} keeps ${why} inside disabled ${path(D)}${words(D)}`, [path(D) + words(D), path(e) + words(e)], { fill:f ? hex(f) : null, color:hex(col), chroma:+chroma(f || col).toFixed(1), parentFill:hex(dfill) }, [rect(D.getBoundingClientRect()), rect(b)]); }); }); };

  R.sample = (moment, hover, quick) => {
    ROOT = rootEl(); if (!ROOT) return { error:'no root' };
    gcsC = new Map(); visC = new Map(); behC = new Map(); markAnims();
    // (a quick look, while the demo plays: only the disabled check, which needs no layout settled)
    if (quick){ backdrops = []; const out = []; disabledCheck((rule, msg, sels, nums, rects) => out.push({ rule, msg, sels, nums, rects:rects.map(q => ({ l:q.l, t:q.t, r:q.r, b:q.b })) })); return { out, looks:[] }; }
    const all = [...ROOT.querySelectorAll('*')].filter(e => !(e instanceof SVGElement && e.tagName.toLowerCase() !== 'svg') && vis(e));
    const out = [], items = [], shapes = [], hairs = [];
    const V = (rule, msg, sels, nums, rects, extra) => out.push(Object.assign({ rule, msg, sels, nums, rects:rects.map(q => ({ l:q.l, t:q.t, r:q.r, b:q.b })) }, extra || {}));

    // shapes, hairlines and backdrops
    backdrops = [];
    const mkShape = (e, ps, q, cs, de) => { const s = { el:e, ps, rect:q, edge:{ l:q.l - de.ring, t:q.t - de.ring, r:q.r + de.ring, b:q.b + de.ring }, cs, de, radius:radiusOf(cs, W(q), H(q)) };
      s.backdrop = !!ps || (/absolute|fixed/.test(cs.position) && !e.children.length && !e.textContent.trim() && W(q) >= 16 && H(q) >= 12);
      s.host = ps ? e : e.parentElement; s.role = roleOf(s); return s; };
    const isShapeDE = de => de.fillDE >= 1 || de.grad || de.all || de.ring > 0 || de.inRing > 0 || de.elev;
    // pseudo-element fills first, as backdrops: they paint between their host's fill and its contents
    for (const e of all){ const cs = gcs(e); if (cs.position === 'static') continue;
      for (const ps of ['before', 'after']){ if (psUnstable(e, ps)) continue; const q = getComputedStyle(e, '::' + ps);
        if (q.content === 'none' || q.display === 'none' || !/absolute|fixed/.test(q.position) || +q.opacity < .1 || q.visibility === 'hidden') continue;
        const eb = e.getBoundingClientRect(); let w = px(q.width), h = px(q.height), l = eb.left + px(cs.borderLeftWidth) + px(q.left) + px(q.marginLeft), t = eb.top + px(cs.borderTopWidth) + px(q.top) + px(q.marginTop);
        if (q.transform && q.transform !== 'none'){ const m = q.transform.match(/matrix\(([^)]*)\)/); if (m){ const [a, , , d, tx, ty] = m[1].split(',').map(parseFloat); const cxp = l + w / 2 + tx, cyp = t + h / 2 + ty; w *= a; h *= d; l = cxp - w / 2; t = cyp - h / 2; } }
        if (!(w > 2 && h > 2) || ![l, t].every(Number.isFinite)) continue;
        const bh = behind(e), de = drawnEdges(q, (() => { const c = rgba(cs.backgroundColor); return c[3] ? over(c, bh) : bh; })());
        if (!isShapeDE(de)) continue; const s = mkShape(e, ps, { l, t, r:l + w, b:t + h }, q, de); s.fillOver = de.fill; shapes.push(s); backdrops.push(Object.assign(s, { fc:rgba(q.backgroundColor) })); } }
    for (const e of all){ if (e === ROOT || e.tagName.toLowerCase() === 'svg') continue; const cs = gcs(e); const b = e.getBoundingClientRect(); if (b.width < 2 || b.height < 2) continue;
      if (unstable.has(e)) continue; const de = drawnEdges(cs, behind(e));
      // hairlines: a 1-2px line of fill, or one drawn edge (a border on one side), across a shape
      if ((b.height <= 2.5 || b.width <= 2.5) && (de.fillDE >= 2 || de.grad)){ hairs.push({ el:e, q:rect(b), horiz:b.height <= 2.5 }); continue; }
      if (de.some && !de.all && !(de.fillDE >= 1) && !de.ring && !de.inRing){ const [T, Rt, B, L] = de.sides; if (T) hairs.push({ el:e, q:{ l:b.left, r:b.right, t:b.top, b:b.top + px(cs.borderTopWidth) }, horiz:true, edgeOf:e }); if (B) hairs.push({ el:e, q:{ l:b.left, r:b.right, t:b.bottom - px(cs.borderBottomWidth), b:b.bottom }, horiz:true, edgeOf:e }); if (L) hairs.push({ el:e, q:{ l:b.left, r:b.left + px(cs.borderLeftWidth), t:b.top, b:b.bottom }, horiz:false, edgeOf:e }); if (Rt) hairs.push({ el:e, q:{ l:b.right - px(cs.borderRightWidth), r:b.right, t:b.top, b:b.bottom }, horiz:false, edgeOf:e }); continue; }
      if (!isShapeDE(de)) continue; const s = mkShape(e, '', rect(b), cs, de); if (s.backdrop){ s.fc = rgba(cs.backgroundColor); backdrops.push(s); } shapes.push(s); }
    const shapeOf = new Map(); shapes.forEach(s => { if (!s.ps) shapeOf.set(s.el, s); });
    // the shape a thing sits in: its nearest shape, or a backdrop under it that is smaller
    const area = q => W(q) * H(q);
    const containerOf = (el, q, self) => { let best = null; for (let a = self && !self.ps ? el.parentElement : el; a && a !== document.body; a = a.parentElement){ const s = shapeOf.get(a); if (s && s !== self){ best = s; break; } if (a === ROOT) break; }
      const cxp = (q.l + q.r) / 2, cyp = (q.t + q.b) / 2;
      for (const d of backdrops){ if (d === self || (self && self.ps && d.el === self.el && d.ps !== self.ps && false)) continue; if (!d.host || !d.host.contains(el)) continue; if (!d.ps && d.el.contains(el)) continue; if (self && self.ps && d.el === self.el) continue;
        if (!(cxp > d.edge.l && cxp < d.edge.r && cyp > d.edge.t && cyp < d.edge.b)) continue; if (self && area(d.edge) <= area(self.edge)) continue; if (!best || area(d.edge) < area(best.edge)) best = d; }
      return best; };
    shapes.forEach(s => { s.cont = containerOf(s.el, s.edge, s); });
    // strips: a full-width band with its own fill at a card's top or bottom; with a control in it, its contents keep 16px
    const fullW = (q, c) => { const k = 1.5 + (c.de.inRing || 0); return q.l <= c.rect.l + px(c.cs.borderLeftWidth) + k && q.r >= c.rect.r - px(c.cs.borderRightWidth) - k; };
    const fullH = (q, c) => { const k = 1.5 + (c.de.inRing || 0); return q.t <= c.rect.t + px(c.cs.borderTopWidth) + k && q.b >= c.rect.b - px(c.cs.borderBottomWidth) - k; };
    shapes.forEach(s => { const c = s.cont; if (!c || c.role !== 'card' || s.ps || s.role === 'tile' || !fullW(s.edge, c) || H(s.edge) > 120 || H(s.edge) < 24) return;
      if (s.el.matches('tr,thead,[role="row"]') || gcs(s.el).display === 'table-row') return;
      const atEdge = Math.abs(s.edge.t - c.rect.t) < 3 || Math.abs(s.edge.b - c.rect.b) < 3;
      if (atEdge && s.el.querySelector('button,.pill,.ib,select,input,[role="switch"]')) s.role = 'strip'; else s.role = s.role === 'card' ? 'card' : 'band'; });

    // drawn things: words, icons, images and the shapes themselves
    const tw = document.createTreeWalker(ROOT, NodeFilter.SHOW_TEXT); let n;
    while ((n = tw.nextNode())){ const e = n.parentElement; if (!e || !n.textContent.trim() || !vis(e) || e.closest('svg') || isMoving(e) || unstable.has(e)) continue; const cs = gcs(e);
      if (+cs.opacity < .1 || rgba(cs.color)[3] < .05 && !/text/.test(cs.backgroundClip + cs.webkitBackgroundClip)) continue;
      const rg = document.createRange(); rg.selectNodeContents(n); const lines = [...rg.getClientRects()].filter(b => b.width > 1 && b.height > 1);
      const m = metrics(cs, n.textContent.trim());
      lines.forEach((b, i) => { const q = rect(b), base = q.t + m.asc; items.push({ k:'text', el:e, node:n, q, ink:{ t:base - m.inkA, b:base + Math.min(m.inkD, H(q) - m.asc) }, lb:lineBox(cs, q), base, wraps:lines.length > 1, line:i, fs:px(cs.fontSize) }); }); }
    ROOT.querySelectorAll('svg').forEach(s => { if (s.parentElement && s.parentElement.closest('svg') || !vis(s) || isMoving(s)) return; const b = s.getBoundingClientRect(); if (b.width < 2 || b.height < 2) return;
      let q = rect(b); try { const bb = s.getBBox(), m = s.getScreenCTM(); if (m && (bb.width || bb.height)){ const pts = [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
        const cs = gcs(s), sw = cs.stroke && cs.stroke !== 'none' ? px(cs.strokeWidth) * Math.abs(m.a) / 2 : 0;
        q = { l:Math.max(b.left, Math.min(...pts.map(p => p[0])) - sw), r:Math.min(b.right, Math.max(...pts.map(p => p[0])) + sw), t:Math.max(b.top, Math.min(...pts.map(p => p[1])) - sw), b:Math.min(b.bottom, Math.max(...pts.map(p => p[1])) + sw) }; } } catch(e){}
      items.push({ k:'svg', el:s, q, box:rect(b) }); });
    ROOT.querySelectorAll('img,canvas,video').forEach(e => { if (!vis(e) || isMoving(e)) return; const b = e.getBoundingClientRect(); if (b.width > 2 && b.height > 2) items.push({ k:'img', el:e, q:rect(b), box:rect(b) }); });
    ROOT.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]):not([type="hidden"]),textarea').forEach(e => { if (!vis(e) || isMoving(e) || !(e.value || e.placeholder)) return; const cs = gcs(e), b = e.getBoundingClientRect(), l = b.left + px(cs.borderLeftWidth) + px(cs.paddingLeft), fs = px(cs.fontSize);
      items.push({ k:'field-text', el:e, q:{ l, r:l + 1, t:(b.top + b.bottom) / 2 - fs * .36, b:(b.top + b.bottom) / 2 + fs * .36 }, noRight:true, noV:true }); });
    hairs.forEach(h => items.push({ k:'hair', el:h.el, q:h.q, hair:h }));
    shapes.forEach(s => { if (!isMoving(s.el)) items.push({ k:'shape', el:s.el, q:s.edge, shape:s }); });
    items.forEach(it => { it.cont = it.k === 'shape' ? it.shape.cont : containerOf(it.el, it.q, null); });

    const stableShape = c => c && !isMoving(c.el) && !unstable.has(c.el) && !(c.ps && psUnstable(c.el, c.ps));
    const label = (it) => it.k === 'shape' ? path(it.el, it.shape.ps) + words(it.el) : it.k === 'text' ? path(it.el) + ` "${it.node.textContent.trim().slice(0, 22)}"` : path(it.el) + (it.k === 'svg' ? ' (icon)' : '');
    const sLabel = s => path(s.el, s.ps) + (s.ps ? '' : words(s.el));
    const exempt = (it, c) => { // full-bleed dividers and strips; dots and badges at a corner; floating layers
      if (it.k === 'hair' || it.k === 'shape'){ if (fullW(it.q, c) || fullH(it.q, c)) return true; }
      if (it.k === 'shape'){ const s = it.shape; if (W(s.edge) <= 10 && H(s.edge) <= 10) return true; if (s.backdrop) return true;
        if (s.el.matches(POPS) || /absolute|fixed/.test(s.cs.position) && s.role === 'card' && (s.edge.l < c.edge.l || s.edge.r > c.edge.r || s.edge.t < c.edge.t || s.edge.b > c.edge.b)) return true; }
      if (placed(it.el, c.el)) return true;
      if (it.k === 'svg' && W(it.box) <= 10 && H(it.box) <= 10) return true;
      // (an svg drawing a frame round its shape, a dashed drop zone's edge, is the shape's edge; a large svg hidden from screen
      // readers is an illustration, not layout)
      if (it.k === 'svg' && (W(it.box) >= W(c.edge) * .9 && H(it.box) >= H(c.edge) * .9 || W(it.box) >= 64 && H(it.box) >= 64 && it.el.getAttribute('aria-hidden') === 'true')) return true;
      if (it.k === 'img' && (fullW(it.q, c) || fullH(it.q, c) || W(it.q) >= W(c.edge) * .9)) return true; // a photo filling its frame
      // (a thing hung outside its shape, like a tab above a sheet or a label beside a bar, is not inside it)
      const ov = Math.max(0, Math.min(it.q.r, c.edge.r) - Math.max(it.q.l, c.edge.l)) * Math.max(0, Math.min(it.q.b, c.edge.b) - Math.max(it.q.t, c.edge.t));
      if (ov < .5 * W(it.q) * H(it.q)) return true;
      // (a drawing hidden from screen readers, like a miniature page in a preview, is art, not layout)
      const art = it.el.closest('[aria-hidden="true"]'); if (art && ROOT.contains(art) && art !== ROOT && !art.matches('svg') && art.contains(c.el)) return true;
      return false; };

    // R1 Inset: everything drawn inside a shape keeps the shape's minimum inset, by role (16 card, 6 row or control, 4 chip)
    // a side where a full-width or full-height part of the shape (a table, a calendar grid) meets the shape's edge: what that
    // part holds is laid out flush with the edge by design
    const flushSides = (it, c) => { const f = {}; for (let a = it.el.parentElement; a && a !== c.el && a !== ROOT; a = a.parentElement){ const b = rect(a.getBoundingClientRect());
        if (fullW(b, c)){ if (Math.abs(b.t - c.edge.t) <= 1.5) f.top = 1; if (Math.abs(b.b - c.edge.b) <= 1.5) f.bottom = 1; f.left = f.right = 1; }
        if (fullH(b, c)){ if (Math.abs(b.l - c.edge.l) <= 1.5) f.left = 1; if (Math.abs(b.r - c.edge.r) <= 1.5) f.right = 1; } }
      return f; };
    const r1 = () => { for (const it of items){ const c = it.cont; if (!c || !stableShape(c) || c.role === 'tile' || c.role === 'page' || Math.min(W(c.edge), H(c.edge)) < 12 || placed(c.el) || exempt(it, c)) continue;
      if (!c.ps && /^inline$/.test(gcs(c.el).display)) continue; // a highlight on words (new text, a mark) wraps them closely by design
      if (it.k === 'field-text' && (/center/.test(gcs(it.el).textAlign) || W(rect(it.el.getBoundingClientRect())) < 60)) continue;
      let mn = MIN[c.role] || MIN.control; const big = /card|strip|band|bar|menu/.test(c.role);
      const host = c.ps ? c.el : c.el, hcs = gcs(host), clipsSelf = hcs.overflowX !== 'visible' || hcs.overflowY !== 'visible';
      const { r:q, cut } = clipTo(it.el, it.k === 'text' ? { l:it.q.l, r:it.q.r, t:big ? it.lb.t : it.ink.t, b:big ? it.lb.b : it.ink.b } : it.q, clipsSelf ? host.parentElement : (c.ps ? c.el.parentElement : c.el), it.k === 'text');
      // (a round thing, an avatar or a dot, at the end of a pill sits as far in from the side as from the top and bottom)
      // (a button or a round thing inside a small shape (an avatar at the end of a pill, a send button inside a field, a key chip
      // at the end of a button) may sit as close to the side as it sits to the top and bottom: the corners stay concentric)
      if (it.k === 'shape' && !big && (it.shape.radius >= .4 * Math.min(W(it.q), H(it.q)) || it.el.matches('button,.pill,.ib,.kbd'))){ const v = Math.min(q.t - c.edge.t, c.edge.b - q.b); if (v >= 2) mn = { h:Math.min(mn.h, v - .5), v:mn.v }; }
      if (W(q) <= 0 || H(q) <= 0) continue;
      const ins = { left:q.l - c.edge.l, right:c.edge.r - q.r, top:q.t - c.edge.t, bottom:c.edge.b - q.b };
      if (cut.l) delete ins.left; if (cut.r) delete ins.right; if (cut.t) delete ins.top; if (cut.b) delete ins.bottom; if (it.noRight) delete ins.right; if (it.noV){ delete ins.top; delete ins.bottom; }
      const fl = flushSides(it, c); for (const k of Object.keys(fl)) if (ins[k] !== undefined && ins[k] >= -.5 && ins[k] <= 1.5) delete ins[k];
      // a strip's or band's words (no control) keep the side inset; up and down they follow the row rule
      const bad = Object.entries(ins).filter(([k, v]) => v < ((k === 'left' || k === 'right') ? mn.h : mn.v) - .5);
      if (!bad.length) continue;
      V('R1', `${label(it)} sits ${bad.map(([k, v]) => `${v.toFixed(1)}px from the ${k}`).join(', ')} of ${c.role} ${sLabel(c)} (${mn.h === mn.v ? mn.h + 'px' : mn.h + 'px across, ' + mn.v + 'px up and down'} expected)`,
        [sLabel(c), label(it)], Object.assign({ role:c.role, min:mn }, Object.fromEntries(bad.map(([k, v]) => [k, +v.toFixed(1)]))), [c.edge, q],
        { focus:[q, { l:bad.some(b => b[0] === 'left') ? c.edge.l : q.l, r:bad.some(b => b[0] === 'right') ? c.edge.r : q.r, t:bad.some(b => b[0] === 'top') ? c.edge.t : q.t, b:bad.some(b => b[0] === 'bottom') ? c.edge.b : q.b }] }); } };

    // the boxes R2 measures: words by their line box, filled controls by their box, icons by their box
    const r2box = it => it.k === 'text' ? { l:it.q.l, r:it.q.r, t:it.lb.t, b:it.lb.b } : it.k === 'svg' || it.k === 'img' ? it.box : it.q;
    const kids = new Map(); items.forEach(it => { if (!it.cont) return; if (!kids.has(it.cont)) kids.set(it.cont, []); kids.get(it.cont).push(it); });
    const decor = it => (it.k === 'shape' && (W(it.q) <= 10 && H(it.q) <= 10 || it.shape.backdrop)) || it.k === 'hair' || it.k === 'field-text' || (it.k !== 'text' && /absolute|fixed/.test(gcs(it.el).position)) || (it.k === 'svg' && W(it.box) <= 10 && H(it.box) <= 10);
    const oneLine = bs => bs.length && Math.max(...bs.map(b => b.t)) < Math.min(...bs.map(b => b.b)) - 1;
    // the last thing in a row is pinned to its end (so its inset is an edge, not a ragged line end)
    const pinned = (it, c) => { if (it.k !== 'text') { /* a control or icon */ } for (let x = it.el; x && x !== c.el && x !== ROOT; x = x.parentElement){ const p = x.parentElement; if (!p) break; const ps = gcs(p), xs = gcs(x);
        if (/flex/.test(ps.display) && !/column/.test(ps.flexDirection)){ const sib = [...p.children].filter(k => vis(k) && gcs(k).position !== 'absolute'); const i = sib.indexOf(x);
          if (/space-between|flex-end|^end|right/.test(ps.justifyContent) && i === sib.length - 1 && i > 0) return true;
          if (sib.slice(0, i).some(k => +gcs(k).flexGrow > 0)) return true; if (i > 0 && px(xs.marginLeft) > 12) return true; }
        if (/grid/.test(ps.display) && /end|right/.test(xs.justifySelf)) return true;
        if (it.k === 'text' && /right|end/.test(xs.textAlign) && !/inline/.test(xs.display)) return true;
        if (p === c.el) break; }
      return false; };
    // R2 Even: a single line of things in a bar, strip, head, footer, row, chip or button has equal room above and below;
    // things at both ends of a row have the same inset at both ends
    // (a shape with anything in it still moving or fading is not judged: its contents have not settled)
    const settling = c => [...c.el.querySelectorAll('*')].some(e => unstable.has(e) || moving.has(e));
    const r2 = () => { for (const [c, ks] of kids){ if (!stableShape(c) || c.role === 'tile' || c.role === 'page' || c.role === 'field' || H(c.edge) > 80 || H(c.edge) < 10 || settling(c)) continue;
      if (placed(c.el)) continue; const its = ks.filter(it => !decor(it) && !exempt(it, c)); if (!its.length) continue; const bs = its.map(r2box); if (!oneLine(bs)) continue;
      // (a full-width line or strip flush with the top or bottom, like a progress line along a card's foot, is that edge)
      let et = c.edge.t, eb = c.edge.b; for (const it of ks){ if (!(it.k === 'hair' || it.k === 'shape') || !fullW(it.q, c)) continue; if (Math.abs(it.q.b - c.edge.b) <= 1.5 && H(it.q) <= 6) eb = Math.min(eb, it.q.t); if (Math.abs(it.q.t - c.edge.t) <= 1.5 && H(it.q) <= 6) et = Math.max(et, it.q.b); }
      const top = Math.min(...bs.map(b => b.t)) - et, bot = eb - Math.max(...bs.map(b => b.b));
      if (top + bot > 40) continue; // a tall box with one line in it (a tile labelled at its top) is not a bar
      if (top >= -.5 && bot >= -.5 && Math.abs(top - bot) > 1.05) V('R2', `${sLabel(c)} has ${top.toFixed(1)}px above its contents and ${bot.toFixed(1)}px below`, [sLabel(c), its.map(label).slice(0, 3).join(' + ')], { top:+top.toFixed(1), bottom:+bot.toFixed(1) }, [c.edge, { l:Math.min(...bs.map(b => b.l)), r:Math.max(...bs.map(b => b.r)), t:Math.min(...bs.map(b => b.t)), b:Math.max(...bs.map(b => b.b)) }], { sub:'vertical' });
      if (W(c.edge) < 120 || c.role === 'chip' || c.role === 'control' || c.role === 'icon') continue;
      // (an icon or words in a bare button or select are measured by the control's box at the ends: its hover box is its edge)
      const hbox = it => { const k = it.el.closest('button,.pill,.ib,select,[role="button"]'); if (k && k !== c.el && c.el.contains(k)){ const b = rect(k.getBoundingClientRect()); if (!it.el.closest('.pill') || it.k !== 'text') return b; } return r2box(it); };
      const first = its.reduce((a, b) => hbox(a).l <= hbox(b).l ? a : b), last = its.reduce((a, b) => hbox(a).r >= hbox(b).r ? a : b);
      if (first === last || !pinned(last, c)) continue; const l = hbox(first).l - c.edge.l, r = c.edge.r - hbox(last).r; if (l > W(c.edge) * .25) continue;
      // (something drawn further out than the first or last thing, a spinner or a mark not measured here, makes them not the ends)
      const outer = [...c.el.querySelectorAll('*')].some(e => { if (!vis(e)) return false; const b = e.getBoundingClientRect(); return b.width > 3 && b.height > 3 && (b.left < hbox(first).l - 2 || b.right > hbox(last).r + 2) && b.width < W(c.edge) * .5; });
      if (!outer && l >= 0 && r >= 0 && Math.abs(l - r) > 1.05) V('R2', `${sLabel(c)} has its first thing ${l.toFixed(1)}px from the left and its last ${r.toFixed(1)}px from the right`, [sLabel(c), label(first) + ' … ' + label(last)], { left:+l.toFixed(1), right:+r.toFixed(1) }, [c.edge, hbox(first), hbox(last)], { sub:'horizontal' }); }
    // bands of a card: between its top, its full-width hairlines and its bottom. A head or footer band of one line has the
    // same room from the hairline as from the card's edge (owner: footers 12px under the hairline but 16px above the edge)
    for (const c of shapes){ if (c.role !== 'card' || !stableShape(c) || c.ps) continue; const ks = kids.get(c) || [];
      const lines = ks.filter(it => it.k === 'hair' && it.hair.horiz && W(it.q) >= W(c.edge) * .85).map(it => it.q);
      if (!lines.length) continue; lines.sort((a, b) => a.t - b.t);
      const cuts = [{ y:c.edge.t, edge:true }].concat(lines.map(q => ({ t:q.t, b:q.b }))).concat([{ y:c.edge.b, edge:true }]);
      for (let i = 0; i < cuts.length - 1; i++){ const A = cuts[i], B = cuts[i + 1]; if (A.edge && B.edge) continue; const y0 = A.edge ? A.y : A.b, y1 = B.edge ? B.y : B.t; if (y1 - y0 < 16 || y1 - y0 > 120) continue;
        const its = ks.filter(it => !decor(it) && !(it.k === 'shape' && it.shape.role === 'strip') && (r2box(it).t + r2box(it).b) / 2 > y0 && (r2box(it).t + r2box(it).b) / 2 < y1); if (!its.length) continue;
        if (!its.some(it => it.el.matches('button,.pill,.ib,select,input,[role="button"]') || it.el.closest('button,.pill,.ib'))) continue;
        const bs = its.map(r2box); if (!oneLine(bs)) continue; const top = Math.min(...bs.map(b => b.t)) - y0, bot = y1 - Math.max(...bs.map(b => b.b));
        if (top >= 0 && bot >= 0 && Math.abs(top - bot) > 1.05) V('R2', `${A.edge ? 'head' : B.edge ? 'footer' : 'band'} of ${sLabel(c)}: ${top.toFixed(1)}px from ${A.edge ? "the card's top" : 'the hairline'} to its contents, ${bot.toFixed(1)}px from them to ${B.edge ? "the card's bottom" : 'the hairline'}`,
          [sLabel(c), its.map(label).slice(0, 3).join(' + ')], { above:+top.toFixed(1), below:+bot.toFixed(1) }, [{ l:c.edge.l, r:c.edge.r, t:y0, b:y1 }, { l:Math.min(...bs.map(b => b.l)), r:Math.max(...bs.map(b => b.r)), t:Math.min(...bs.map(b => b.t)), b:Math.max(...bs.map(b => b.b)) }], { sub:'band' }); } } };

    // R3 Baseline: words side by side on one line share a baseline. Pairs are found by geometry (same shape, overlapping
    // lines, a common row no taller than a line and a half), then measured with a zero-size inline-block probe placed before
    // each run's words (in a run that is a flex or grid item of its own, the font's ascent from its line box instead)
    const r3 = () => { const texts = items.filter(it => it.k === 'text' && !it.wraps && !it.el.closest('button,.pill,.ib,.tag,.chip,.kbd,.bdg,select,[role="button"]') && !placed(it.el)), pairs = [];
      const lca = (a, b) => { for (let x = a; x; x = x.parentElement) if (x.contains(b)) return x; return null; };
      for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++){ const a = texts[i], b = texts[j]; if (a.el === b.el || a.cont !== b.cont) continue;
        const ov = Math.min(a.q.b, b.q.b) - Math.max(a.q.t, b.q.t); if (ov < .7 * Math.min(H(a.q), H(b.q))) continue; if (a.q.r > b.q.l && b.q.r > a.q.l) continue;
        if (Math.min(Math.abs(a.q.l - b.q.r), Math.abs(b.q.l - a.q.r)) > 160) continue;
        const p = lca(a.el, b.el); if (!p) continue; const pb = p.getBoundingClientRect(), ps = gcs(p), lh = Math.max(H(a.lb), H(b.lb));
        if (pb.height - px(ps.paddingTop) - px(ps.paddingBottom) - px(ps.borderTopWidth) - px(ps.borderBottomWidth) > Math.max(1.5 * lh, lh + 8)) continue;
        if ([a, b].some(t => /absolute|fixed/.test(gcs(t.el).position))) continue; pairs.push([a, b]); }
      if (!pairs.length) return; const runs = [...new Set(pairs.flat())], probes = [];
      for (const t of runs){ const p = t.node.parentNode, ps = gcs(p); if (/flex|grid/.test(ps.display)){ t.pbase = t.base; t.how = 'ascent'; continue; }
        const s = document.createElement('span'); s.setAttribute('aria-hidden', 'true'); s.style.cssText = 'display:inline-block;width:0;height:0;margin:0;padding:0;border:0;vertical-align:baseline'; p.insertBefore(s, t.node); probes.push([t, s]); }
      // (a probe gives a break opportunity before a word that overflows its column; if the words moved to another line with it,
      // the font's ascent is used instead)
      probes.forEach(([t, s]) => { const b = s.getBoundingClientRect().bottom, rg = document.createRange(); rg.selectNodeContents(t.node); const now = rg.getClientRects()[0];
        if (now && Math.abs(now.top - t.q.t) < .5 && Math.abs(now.left - t.q.l) < 2 && b > t.q.t && b < t.q.b){ t.pbase = b; t.how = 'probe'; } else { t.pbase = t.base; t.how = 'ascent'; } }); probes.forEach(([, s]) => s.remove());
      const seen = new Set(); for (const [a, b] of pairs){ const d = a.pbase - b.pbase; if (Math.abs(d) <= .5) continue; const k = a.el + '|' + b.el; if (seen.has(k)) continue; seen.add(k);
        const [hi, lo] = d < 0 ? [a, b] : [b, a];
        V('R3', `${label(hi)} (${hi.fs}px) has its baseline ${Math.abs(d).toFixed(1)}px higher than ${label(lo)} (${lo.fs}px) beside it`, [label(lo), label(hi)], { diff:+Math.abs(d).toFixed(2), sizes:[lo.fs, hi.fs], how:[lo.how, hi.how] },
          [{ l:lo.q.l, r:lo.q.r, t:lo.pbase - .5, b:lo.pbase + .5 }, { l:hi.q.l, r:hi.q.r, t:hi.pbase - .5, b:hi.pbase + .5 }]); } };

    // R4 Shape: rounded to 40% of its shorter side or more, a shape is a true circle or a clear pill, never in between
    const r4 = () => { for (const s of shapes){ if (!stableShape(s) || isMoving(s.el) || placed(s.el)) continue; const w = W(s.rect), h = H(s.rect); if (Math.min(w, h) < 10) continue;
      // (a squircle corner, as Soft draws them, reads as a rounded square until it is nearly half the side)
      const sq = /squircle/.test(s.cs.getPropertyValue('corner-shape') + s.cs.getPropertyValue('corner-top-left-shape'));
      if (s.radius < (sq ? .48 : .4) * Math.min(w, h)) continue; const d = Math.abs(w - h); if (d <= .5 || d >= 6) continue;
      V('R4', `${sLabel(s)} is ${w.toFixed(1)}×${h.toFixed(1)} with a ${s.radius.toFixed(1)}px radius: neither a circle nor a pill`, [sLabel(s)], { w:+w.toFixed(1), h:+h.toFixed(1), radius:+s.radius.toFixed(1) }, [s.rect]); } };

    const r5 = () => disabledCheck(V);

    // R6 Visible fill: a chip's, a selected item's or a hovered item's fill differs from what is behind it by at least the
    // difference Clean's own chip has in the same theme (OPT.ref, measured at the start of the run)
    const SEL = '[aria-selected="true"],[aria-pressed="true"],[aria-checked="true"],[aria-current]:not([aria-current="false"]),.on,.sel,.active,.is-on,.selected,[data-on="true"]';
    const r6 = () => { const thr = OPT.ref; if (!thr) return; const done = new Set();
      const test = (s, kind) => { if (done.has(s) || !stableShape(s) || isMoving(s.el)) return; done.add(s); const de = s.de; if (!(de.fill || de.fc && de.fc[3] > .02)) return;
        if (de.all && de.borderDE >= thr || de.ring && de.ringDE >= thr || de.inRing && de.ringDE >= thr) return; // its edge shows it
        if (de.fillDE < .3 || de.fillDE >= thr * .9) return;
        V('R6', `${kind} ${sLabel(s)} has a fill ${de.fillDE.toFixed(1)} from what is behind it (Clean's chip: ${thr.toFixed(1)})`, [sLabel(s)], { diff:+de.fillDE.toFixed(2), ref:+thr.toFixed(2), fill:hex(de.fill), kind }, [s.edge], { sub:kind }); };
      for (const s of shapes){ if (s.ps) continue; const e = s.el, h = H(s.edge);
        // (a small square tile with a letter or an icon, like a favicon or an avatar, is not a chip)
        if (e.matches(CHIP) || (h <= 32 && W(s.edge) > h * 1.3 && W(s.edge) <= 240 && e.textContent.trim() && !e.matches('input,textarea,select') && !de0(s))) test(s, 'chip');
        if (e.matches(SEL) && !e.matches(EXCL)) test(s, 'selected'); }
      if (hover){ const at = document.elementFromPoint(hover.x, hover.y); const cands = shapes.filter(s => hover.x > s.edge.l && hover.x < s.edge.r && hover.y > s.edge.t && hover.y < s.edge.b && (s.ps ? s.el.contains(at) || (at && at.contains(s.el)) : s.el.contains(at) || s.el === at || (s.backdrop && s.host && s.host.contains(at))));
        // (only a fill the hover brought: one the element did not have before the pointer came, as R.restAt noted)
        const hc = cands.filter(s => (s.backdrop || /row|control|chip|icon|field/.test(s.role)) && (s.ps ? (s.el.__restPs || {})[s.ps] : s.el.__restBg) !== (s.ps ? s.cs.backgroundColor + s.cs.opacity : s.cs.backgroundColor)).sort((a, b) => area(a.edge) - area(b.edge)); if (hc[0]) test(hc[0], 'hover'); } };
    const de0 = s => s.de.all || s.de.ring || s.de.inRing; // a chip-sized shape drawn by its edge is not a fill

    // R7 Same job, same look: the looks of buttons, chips and key chips, collected here and compared across components
    const looks = [];
    const r7 = () => { if (hover) return; ROOT.querySelectorAll('button,.pill,.ib,.tag,.chip,.kbd,.bdg,a.pill,[role="button"]').forEach(e => {
      if (!vis(e) || isMoving(e) || unstable.has(e) || e.matches(':disabled,[aria-disabled="true"]') || e.closest('.pop:not(.open)')) return;
      const cs = gcs(e), b = e.getBoundingClientRect(); if (b.width < 8 || b.height < 8) return;
      const txt = [...e.childNodes].some(k => k.nodeType === 3 && k.textContent.trim()) || [...e.children].some(k => !k.matches('svg,.kbd') && k.textContent.trim());
      const bh = behind(e), de = drawnEdges(cs, bh), cls = e.classList;
      let job = null;
      if (e.matches(SEL)) return; // a selected chip or button has its own look
      if (e.matches('.kbd')) job = 'key chip'; else if (e.matches('.chip')) job = 'chip'; else if (e.matches('.tag,.bdg')) job = 'tag';
      else if (cls.contains('pill')) job = cls.contains('primary') || cls.contains('accent') ? 'primary' : cls.contains('ghost') ? 'ghost' : cls.contains('warn') ? 'warning' : cls.contains('danger') ? 'danger' : 'secondary';
      else if (cls.contains('ib')) job = 'icon';
      else if (e.matches('button,[role="button"]') && !e.matches('[role="tab"],[role="option"],[role="menuitem"],[role="switch"],[role="checkbox"],[role="radio"]') && !e.closest('[role="tablist"],[role="radiogroup"],[role="menu"],[role="listbox"]') && b.height >= 28 && b.height <= 40 && b.width <= 260 && txt && radiusOf(cs, b.width, b.height) >= b.height / 2 - .5 && (de.fillDE >= 1 || de.all || de.ring || de.inRing)) job = chroma(de.fill || bh) > 6 ? 'primary' : 'secondary';
      if (!job || (job === 'secondary' && cls.contains('pill') && !txt)) return;
      const size = cls.contains('xs') ? 'xs' : cls.contains('sm') ? 'sm' : cls.contains('lg') ? 'lg' : 'md';
      const surf = dE(bh, OPT.cardBg || bh) < 2 ? 'card' : chroma(bh) > 6 ? 'accent' : 'tint';
      const neutral = chroma(de.fill || bh) < 4 && chroma(rgba(cs.color)) < 8;
      const look = { fill:de.fc[3] > .02 ? hex(de.fc) : 'none', edge:de.all ? `${px(cs.borderTopWidth)}px ${hex(rgba(cs.borderTopColor))}` : de.ring || de.inRing ? `ring ${de.ring || de.inRing}px` : 'none', h:Math.round(b.height),
        radius:radiusOf(cs, b.width, b.height) >= b.height / 2 - .5 ? 'pill' : Math.round(radiusOf(cs, b.width, b.height)) + 'px', color:hex(rgba(cs.color)) };
      if ((job === 'chip' || job === 'tag') && !neutral){ job = 'toned ' + job; delete look.fill; delete look.color; }
      looks.push({ job, size, surf, look, sel:path(e) + words(e), cls:[...cls].join(' '), q:rect(b) }); }); };

    // R8 Edge collisions: sibling chips, buttons and tags are at least 4px apart and never overlap
    const r8 = () => { for (const [c, ks] of kids){ const cs = ks.filter(it => it.k === 'shape' && !it.shape.backdrop && !it.shape.ps && it.el.matches('button,.pill,.ib,.tag,.chip,.kbd,.bdg,[role="button"],[class*="chip"]') && !it.el.matches('.mi,[role="menuitem"],[role="option"],[role="menuitemradio"],[role="tab"],li') && W(it.q) > 10 && H(it.q) > 10 && W(it.q) < W(c.edge) * .5 && !isMoving(it.el) && !placed(it.el, c.el));
      for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++){ const a = cs[i], b = cs[j]; if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const up2 = e => [e.parentElement, e.parentElement && e.parentElement.parentElement]; if (!up2(a.el).some(p => p && up2(b.el).includes(p))) continue;
        const qa = clipTo(a.el, a.q, c.el).r, qb = clipTo(b.el, b.q, c.el).r; if (W(qa) <= 2 || H(qa) <= 2 || W(qb) <= 2 || H(qb) <= 2) continue;
        const vo = Math.min(qa.b, qb.b) - Math.max(qa.t, qb.t), ho = Math.min(qa.r, qb.r) - Math.max(qa.l, qb.l); let gap = null;
        if (vo > 0 && ho > 0) gap = -Math.min(vo, ho); else if (vo > 0) gap = -ho; else if (ho > 0) gap = -vo; if (gap === null || gap >= 4) continue;
        // (buttons joined into one group, with square facing corners, touch by design)
        const [L, Rr] = a.q.l <= b.q.l ? [a, b] : [b, a]; if (gap >= 0 && vo > 0 && px(gcs(L.el).borderTopRightRadius) < 1 && px(gcs(Rr.el).borderTopLeftRadius) < 1) continue;
        V('R8', `${label(a)} and ${label(b)} are ${gap < 0 ? 'overlapping by ' + (-gap).toFixed(1) + 'px' : gap.toFixed(1) + 'px apart'} (4px or more expected)`, [label(a), label(b)].sort(), { gap:+gap.toFixed(1) }, [a.q, b.q]); } } };

    R.last = shapes.map(s => ({ sel:sLabel(s), role:s.role, cont:s.cont ? sLabel(s.cont) : null, stable:stableShape(s), edge:s.edge })); // for debugging
    for (const f of [r1, r2, r3, r4, r5, r6, r7, r8]){ try { f(); } catch(err){ out.push({ rule:'error', msg:f.name + ': ' + err.message, sels:[], nums:{}, rects:[] }); } }
    return { out, looks, n:{ shapes:shapes.length, items:items.length } };
  };

  // what the demo shows, in short: its elements' classes and shown state, and its words
  R.signature = () => { const r = rootEl(); if (!r) return ''; let h = 0; const add = s => { for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; };
    r.querySelectorAll('*').forEach(e => { add(typeof e.className === 'string' ? e.className : ''); add(e.hidden ? 'h' : ''); add(e.disabled ? 'd' : ''); add(e.getAttribute('aria-expanded') || ''); add(e.getAttribute('aria-selected') || ''); });
    add(r.textContent.replace(/\d+/g, '#')); return h + ':' + r.querySelectorAll('*').length; };
  // before the pointer comes: the fills under a point (on the elements themselves), so a hover's own fill can be told apart
  R.restAt = (x, y) => { for (const e of document.elementsFromPoint(x, y)){ const cs = getComputedStyle(e); e.__restBg = cs.backgroundColor; e.__restPs = {};
      for (const ps of ['before', 'after']){ const q = getComputedStyle(e, '::' + ps); e.__restPs[ps] = q.backgroundColor + q.opacity; } } };
  // things to hover: the outermost element under each pointer target, two of each kind (rows, buttons, options)
  R.hoverTargets = (max) => { ROOT = rootEl(); if (!ROOT) return []; gcsC = new Map(); visC = new Map();
    const groups = new Map();
    ROOT.querySelectorAll('*').forEach(e => { if (e instanceof SVGElement || !vis(e)) return; const cs = gcs(e), p = e.parentElement;
      const ptr = cs.cursor === 'pointer' && !(p && p !== ROOT && gcs(p).cursor === 'pointer'); if (!ptr && !e.matches('button,[role="option"],[role="menuitem"],[role="row"],tr,li')) return;
      if (e.matches(':disabled')) return; const b = e.getBoundingClientRect(); if (b.width < 8 || b.height < 8 || b.bottom < 0 || b.top > innerHeight || b.left < 0 || b.right > innerWidth) return;
      const k = (p ? name(p) : '') + '>' + name(e); if (!groups.has(k)) groups.set(k, []); groups.get(k).push({ x:(b.left + b.right) / 2, y:(b.top + b.bottom) / 2, sel:path(e) + words(e), w:b.width }); });
    // rows first (the widest), then the rest; the first and last of each kind
    const gs = [...groups.values()].sort((a, b) => b[0].w - a[0].w); const pick = [];
    for (const g of gs){ pick.push(g[0]); if (g.length > 1) pick.push(g[g.length - 1]); if (pick.length >= max) break; }
    return pick.slice(0, max); };
  // menus and things that open: their buttons
  R.popTargets = (max) => { ROOT = rootEl(); if (!ROOT) return []; gcsC = new Map(); visC = new Map();
    return [...ROOT.querySelectorAll('[data-pop],[aria-haspopup]:not([aria-haspopup="false"]),[aria-expanded="false"]')].filter(e => vis(e) && !e.matches(':disabled')).slice(0, max).map(e => { const b = e.getBoundingClientRect(); return { x:(b.left + b.right) / 2, y:(b.top + b.bottom) / 2, sel:path(e) + words(e) }; }).filter(t => t.y > 0 && t.y < innerHeight); };
  R.menuTargets = (max) => { ROOT = rootEl(); gcsC = new Map(); visC = new Map(); const pop = [...document.querySelectorAll('.pop.open,[role="menu"],[role="listbox"]')].find(p => vis(p) && p.getBoundingClientRect().height > 20); if (!pop) return [];
    return [...pop.querySelectorAll('button,[role="option"],[role="menuitem"],li')].filter(e => vis(e)).slice(0, max).map(e => { const b = e.getBoundingClientRect(); return { x:(b.left + b.right) / 2, y:(b.top + b.bottom) / 2, sel:path(e) + words(e) }; }).filter(t => t.y > 0 && t.y < innerHeight); };
  // Clean's own chip, as the reference for R6: a .chip on a panel in the stage, its fill against the panel
  R.reference = () => { const root = document.querySelector(OPT.root) || document.body, host = root.querySelector('.panel') || root; const p = document.createElement('span'); p.className = 'chip'; p.textContent = 'Chip';
    p.style.cssText = 'position:absolute;left:16px;top:16px'; host.appendChild(p); gcsC = new Map(); behC = new Map(); backdrops = []; const cs = getComputedStyle(p), bh = behind(p), f = over(rgba(cs.backgroundColor), bh);
    const r = { chipDE:dE(f, bh), chip:hex(f), panel:hex(bh), card:bh }; p.remove(); return r; };
}

// ---------------------------------------------------------------------------------------------------------------------
// In node: pages, jobs, samples, crops and the report
const listPages = () => {
  if (process.env.IDS) return process.env.IDS.split(',').filter(Boolean).map(id => id.startsWith('templates/') ? { id:id.slice(10), url:`/${id}.html`, tpl:true } : { id, url:`/components/${id}.html` });
  const dir = process.env.SITE || [path.resolve(__dirname, '../../components'), path.resolve(__dirname, '../../../clean-review/components')].find(d => fs.existsSync(d));
  const comps = dir ? fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => f.slice(0, -5)) : [];
  const tdir = dir && path.join(dir, '../templates'); const tpls = tdir && fs.existsSync(tdir) ? fs.readdirSync(tdir).filter(f => f.endsWith('.html')).map(f => f.slice(0, -5)) : [];
  return comps.map(id => ({ id, url:`/components/${id}.html` })).concat(tpls.map(id => ({ id, url:`/templates/${id}.html`, tpl:true })));
};
const keyOf = v => [v.rule, v.page, v.style, v.theme, v.w, ...v.sels.map(s => s.replace(/\d+(\.\d+)?/g, '#'))].join('|');
const hash = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 10);

async function newPage(browser, st, th, w, tpl){
  const ctx = await browser.newContext({ viewport:{ width:w, height:tpl ? (w < 600 ? 844 : 900) : 1200 }, deviceScaleFactor:2 });
  await ctx.addInitScript(([s, t]) => { try { localStorage.setItem('dmui-style', s); localStorage.setItem('dmui-theme', t); } catch(e){} }, [st, th]);
  await ctx.addInitScript(`(${rulesLib})()`);
  await ctx.route(/plausible|api\.github\.com|supabase|fonts\.g/, r => r.abort());
  // the page's clock runs as usual, and is held while a moment is sampled and its crops are taken, so a crop shows the
  // same moment as the sample
  const page = await ctx.newPage(); await page.clock.install({ time:T0 }); return { ctx, page };
}

// a 2x crop of the spot, with the offending edges outlined: red for the first rect (the shape), blue for the others
// a 2x crop of the spot, with the offending edges outlined: red for the first rect (the shape), blue for the others. The crop
// frames `focus` (the thing and the edges it is measured to) when given, else every rect; a spot outside the window is
// scrolled into it first (the page's clock is held, so nothing moves meanwhile)
async function crop(page, rects, file, focus){
  const vw = page.viewportSize(), U = qs => qs.reduce((a, q) => ({ l:Math.min(a.l, q.l), t:Math.min(a.t, q.t), r:Math.max(a.r, q.r), b:Math.max(a.b, q.b) }), { l:1e9, t:1e9, r:-1e9, b:-1e9 });
  let u = U(focus && focus.length ? focus : rects); const pad = 24; let dy = 0;
  if (u.t - pad < 0 || u.b + pad > vw.height){ dy = Math.round((u.t + u.b) / 2 - vw.height / 2); dy = await page.evaluate(d => { const y0 = scrollY; window.scrollTo(0, y0 + d); return scrollY - y0; }, dy); }
  const sh = q => ({ l:q.l, r:q.r, t:q.t - dy, b:q.b - dy }); rects = rects.map(sh); u = sh(u);
  const x = Math.max(0, Math.floor(u.l - pad)), y = Math.max(0, Math.floor(u.t - pad)), x2 = Math.min(vw.width, Math.ceil(u.r + pad)), y2 = Math.min(vw.height, Math.ceil(u.b + pad));
  if (x2 - x < 4 || y2 - y < 4){ if (dy) await page.evaluate(d => window.scrollBy(0, -d), dy); return null; }
  await page.evaluate(rs => { const o = document.createElement('div'); o.id = '__rules_ov'; o.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483647';
    rs.forEach((q, i) => { const d = document.createElement('div'); d.style.cssText = `position:fixed;left:${q.l}px;top:${q.t}px;width:${Math.max(.5, q.r - q.l)}px;height:${Math.max(.5, q.b - q.t)}px;outline:1px solid ${i ? '#0a6cff' : '#ff1f3d'};outline-offset:0`; o.appendChild(d); }); document.body.appendChild(o); }, rects);
  try { await page.screenshot({ path:file, clip:{ x, y, width:x2 - x, height:y2 - y }, animations:'allow', timeout:8000 }); } catch(e){ file = null; }
  await page.evaluate(d => { const o = document.getElementById('__rules_ov'); if (o) o.remove(); if (d) window.scrollBy(0, -d); }, dy);
  return file;
}

async function runJob(browser, job, ref){
  const { pg, st, th, w } = job, res = { page:pg.id, tpl:!!pg.tpl, style:st, theme:th, w, viol:{}, looks:[], errors:[], moments:0 };
  const { ctx, page } = await newPage(browser, st, th, w, pg.tpl);
  page.on('pageerror', e => res.errors.push(String(e.message).slice(0, 200)));
  const root = pg.tpl ? 'main.pg-app' : '.pg-demo > .card > .stage-in';
  try {
    await page.goto(HOST + pg.url, { waitUntil:'load', timeout:90000 });
    await page.evaluate(() => document.fonts.ready);
    const cardBg = ref.card;
    await page.evaluate(o => window.__rules.setup(o), { root, theme:th, style:st, ref:ref.chipDE, cardBg });
    if (!pg.tpl) await page.evaluate(() => { const d = document.querySelector('.cp-demo'); if (d){ const y = d.getBoundingClientRect().top + scrollY - 70; window.scrollTo(0, Math.max(0, y)); } });
    await page.mouse.move(1, 1);
    const tick = ms => page.waitForTimeout(ms);
    // hold the page's clock (its timers, frames and animations) while a moment is sampled and cropped, then let it go on
    const freeze = async () => { for (const ahead of [150, 600, 2000]){ try { const now = await page.evaluate(() => Date.now()); await page.clock.pauseAt(now + ahead); return; } catch(e){} } };
    const thaw = () => page.clock.resume().catch(() => {});
    const seenLooks = new Set(), hovered = new Set();
    const hoverNew = async (pre, max) => { const hv = (await page.evaluate(n => window.__rules.hoverTargets(n), 40)).filter(h => !hovered.has(h.sel.replace(/\d+/g, '#'))).slice(0, max);
      for (const h of hv){ hovered.add(h.sel.replace(/\d+/g, '#')); await page.evaluate(([x, y]) => window.__rules.restAt(x, y), [h.x, h.y]).catch(() => {}); await page.mouse.move(h.x, h.y, { steps:2 }); await tick(400); await take(`${pre}hover ${h.sel}`, h); }
      if (hv.length){ await page.mouse.move(1, 1); await tick(250); } return hv.length; };
    const take = async (moment, hover, quick) => { await freeze(); try { await takeHeld(moment, hover, quick); } finally { await thaw(); } };
    const takeHeld = async (moment, hover, quick) => {
      const r = await page.evaluate(([m, h, q]) => window.__rules.sample(m, h, q), [moment, hover || null, !!quick]).catch(e => ({ error:e.message }));
      if (!r || r.error){ res.errors.push(`${moment}: ${r && r.error}`); return; } res.moments++;
      for (const l of r.looks){ const k = JSON.stringify([l.job, l.size, l.surf, l.look, l.sel.replace(/\d+/g, '#')]); if (seenLooks.has(k)) continue; seenLooks.add(k); res.looks.push(Object.assign(l, { moment })); }
      for (const v of r.out){ if (v.rule === 'error'){ res.errors.push(v.msg); continue; }
        Object.assign(v, { page:pg.id, style:st, theme:th, w, moment }); const k = keyOf(v);
        if (res.viol[k]){ res.viol[k].count++; continue; }
        v.count = 1; v.key = k; v.id = hash(k); res.viol[k] = v;
        const f = path.join(OUT, 'crops', `${v.rule}-${pg.id}-${st}-${th}-${w}-${v.id}.png`);
        v.crop = await crop(page, v.rects, f, v.focus).then(x => x && path.relative(OUT, x)).catch(() => null); delete v.focus; } };
    const designs = pg.tpl ? 0 : await page.locator('.cp-demo .seg2 button').count();
    for (let d = 0; d < Math.max(1, designs); d++){
      let dn = '';
      if (designs){ const b = page.locator('.cp-demo .seg2 button').nth(d); dn = 'design ' + (await b.textContent()).trim() + ', '; if (d) { await b.click(); await page.mouse.move(1, 1); } }
      // the demo plays; whenever what it shows has changed (its classes, words or visible parts) and a second and a half has
      // passed since the last sample, it is left SETTLE ms to settle and sampled. Then whatever rows or controls are on screen
      // and not hovered yet, a few of them, are hovered so their fills show (the demo holds while the pointer rests on it)
      let hovers = 0, samples = 0, last = null, lastT = -9; const t0 = Date.now(), el = () => (Date.now() - t0) / 1000;
      // (a demo that has shown nothing new for 6 seconds has ended)
      let prev = null, changed = 0;
      while (el() < SECS && samples < MAXS){ await tick(STEP * 1000);
        const sig = await page.evaluate(() => window.__rules.signature()).catch(() => null);
        if (sig !== prev){ prev = sig; changed = el(); await take(`${dn}t=${el().toFixed(1)}s`, null, true); } else if (el() - changed > 6 && samples) break;
        if (sig === last || el() - lastT < 1.5) continue; await tick(SETTLE); last = await page.evaluate(() => window.__rules.signature()).catch(() => null); lastT = el(); samples++;
        const ts = `${dn}t=${el().toFixed(1)}s`; await take(ts);
        if (hovers < HOVERS) hovers += await hoverNew(`${ts}, `, Math.min(3, HOVERS - hovers)); }
    }
    await hoverNew('end, ', 4);
    // open: menus and things that unfold, each clicked, sampled, and its first options hovered
    const pops = await page.evaluate(n => window.__rules.popTargets(n), POPS);
    for (const p of pops){ await page.mouse.click(p.x, p.y); await tick(800); await take(`open ${p.sel}`);
      const mt = await page.evaluate(n => window.__rules.menuTargets(n), 3); for (const m of mt){ await page.evaluate(([x, y]) => window.__rules.restAt(x, y), [m.x, m.y]).catch(() => {}); await page.mouse.move(m.x, m.y, { steps:2 }); await tick(400); await take(`open ${p.sel}, hover ${m.sel}`, m); }
      await page.keyboard.press('Escape'); await page.mouse.move(1, 1); await tick(600); }
    await take('end');
  } catch(e){ res.errors.push('job: ' + e.message.slice(0, 300)); }
  await ctx.close().catch(() => {});
  if (!res.moments) throw new Error('nothing sampled: ' + res.errors.join('; ').slice(0, 200));
  res.viol = Object.values(res.viol); return res;
}

async function reference(browser, th){
  const { ctx, page } = await newPage(browser, 'clean', th, 1440, false);
  await page.goto(HOST + '/components/web-search.html', { waitUntil:'load' }); await page.evaluate(() => document.fonts.ready);
  await page.evaluate(o => window.__rules.setup(o), { root:'.pg-demo > .card > .stage-in', theme:th, style:'clean' });
  const r = await page.evaluate(() => window.__rules.reference()); await ctx.close();
  // the card surface of each style in this theme, for R7's "on a white card"
  const cards = {};
  for (const st of STYLES){ const { ctx:c2, page:p2 } = await newPage(browser, st, th, 1440, false); await p2.goto(HOST + '/components/web-search.html', { waitUntil:'load' });
    await p2.evaluate(o => window.__rules.setup(o), { root:'.pg-demo > .card > .stage-in', theme:th, style:st }); cards[st] = await p2.evaluate(() => window.__rules.reference().card); await c2.close(); }
  return Object.assign(r, { cards });
}

// R7: per style, theme, job, size and surface, the looks each component uses; the look most components use is the
// group's look, and every other look is reported with the components that use it
function sameLook(results){
  const groups = new Map();
  for (const r of results){ if (r.w !== 1440 && WIDTHS.includes(1440)) continue; for (const l of r.looks){ const g = [r.style, r.theme, l.job, l.size, l.surf].join('|'); if (!groups.has(g)) groups.set(g, new Map());
    const lk = JSON.stringify(l.look); const m = groups.get(g); if (!m.has(lk)) m.set(lk, new Map()); const pm = m.get(lk); if (!pm.has(r.page)) pm.set(r.page, Object.assign({ r }, l)); } }
  const out = [], summary = [];
  for (const [g, m] of groups){ const [style, theme, job, size, surf] = g.split('|'); const looks = [...m.entries()].map(([lk, pm]) => ({ look:JSON.parse(lk), pages:[...pm.keys()], ex:pm })).sort((a, b) => b.pages.length - a.pages.length);
    // (a group seen on one page only, or with one look, has nothing to compare)
    summary.push({ style, theme, job, size, surf, looks:looks.map(l => ({ look:l.look, pages:l.pages })) });
    if (looks.length < 2) continue; const main = looks[0];
    for (const l of looks.slice(1)) for (const [pg, ex] of l.ex){ const diff = Object.keys(Object.assign({}, main.look, l.look)).filter(k => main.look[k] !== l.look[k]).map(k => `${k} ${l.look[k]} (not ${main.look[k]})`);
      out.push({ rule:'R7', page:pg, tpl:ex.r.tpl, style, theme, w:ex.r.w, moment:ex.moment, sels:[ex.sel], msg:`${job} button (${size}, on a ${surf === 'card' ? 'card' : 'tinted surface'}) ${ex.sel} differs from the look ${main.pages.length} component(s) use: ${diff.join(', ')}`,
        nums:{ look:l.look, main:main.look, mainPages:main.pages.slice(0, 12), samePages:l.pages.slice(0, 12) }, rects:[ex.q], q:ex.q, count:1, cls:ex.cls }); } }
  out.forEach(v => { v.key = keyOf(v); v.id = hash(v.key); });
  return { out, summary };
}

// crops for R7 (the looks are compared after every page has run): each page is opened again and the button found by its
// classes and words
async function cropR7(browser, list){
  const by = new Map(); list.forEach(v => { const k = [v.page, v.tpl ? 1 : 0, v.style, v.theme, v.w].join('|'); if (!by.has(k)) by.set(k, []); by.get(k).push(v); });
  const work = [...by.entries()]; let i = 0;
  await Promise.all(Array.from({ length:JOBS }, async () => { while (i < work.length){ const [k, vs] = work[i++]; const [pg, tpl, st, th, w] = k.split('|');
    const { ctx, page } = await newPage(browser, st, th, +w, tpl === '1');
    try { await page.goto(HOST + (tpl === '1' ? `/templates/${pg}.html` : `/components/${pg}.html`), { waitUntil:'load', timeout:30000 });
      if (tpl !== '1') await page.evaluate(() => { const d = document.querySelector('.cp-demo'); if (d) window.scrollTo(0, Math.max(0, d.getBoundingClientRect().top + scrollY - 70)); });
      await page.mouse.move(1, 1);
      for (const v of vs){ const sel = '.' + v.cls.trim().split(/\s+/).map(c => CSS_ESC(c)).join('.'), want = (v.sels[0].match(/"(.*)"$/) || [, ''])[1].replace(/…$/, '');
        let q = null; for (let t = 0; t < 24 && !q; t++){ q = await page.evaluate(([s, wt, root]) => { const R = document.querySelector(root) || document.body; const e = [...R.querySelectorAll(s)].find(x => { const b = x.getBoundingClientRect(); return b.width > 4 && (!wt || x.textContent.replace(/\s+/g, ' ').trim().startsWith(wt)); }); if (!e) return null; const b = e.getBoundingClientRect(); return { l:b.left, t:b.top, r:b.right, b:b.bottom }; }, [sel, want, tpl === '1' ? 'main.pg-app' : '.pg-demo > .card > .stage-in']).catch(() => null); if (!q) await page.waitForTimeout(500); }
        if (q){ v.rects = [q]; v.crop = await crop(page, [q], path.join(OUT, 'crops', `R7-${pg}-${st}-${th}-${w}-${v.id}.png`)).then(x => x && path.relative(OUT, x)).catch(() => null); } } } catch(e){}
    await ctx.close().catch(() => {}); } }));
}
const CSS_ESC = s => s.replace(/([^\w-])/g, '\\$1');

function exceptionFor(v){ for (const x of EXCEPTIONS) if (x.ids.includes(v.page) && x.rules.includes(v.rule) && (!x.sel || v.sels.some(s => x.sel.test(s)))) return x.reason; return null; }

function report(all, ref, summary, errors){
  const label = v => `${STYLE_NAME[v.style] || v.style} ${v.theme} ${v.w}`;
  all.forEach(v => { v.phase = PHASE2.has(v.page) ? 'II' : 'I'; const x = exceptionFor(v); if (x) v.excepted = x; });
  const live = all.filter(v => !v.excepted), rules = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8'];
  const RN = { R1:'Inset', R2:'Even', R3:'Baseline', R4:'Shape', R5:'Disabled', R6:'Visible fill', R7:'Same job, same look', R8:'Edge collisions' };
  const spot = v => [v.rule, v.page, ...v.sels.map(s => s.replace(/\d+(\.\d+)?/g, '#'))].join('|');
  const md = [];
  md.push('# Rule check', '', `${new Date().toISOString().slice(0, 16).replace('T', ' ')}. Styles ${STYLES.map(s => STYLE_NAME[s]).join(', ')}; themes ${THEMES.join(', ')}; widths ${WIDTHS.join(', ')}.`, '');
  md.push(`R6 reference (Clean's chip against its panel): ${Object.entries(ref).map(([t, r]) => `${t} ${r.chipDE.toFixed(2)} (${r.chip} on ${r.panel})`).join('; ')}.`, '');
  md.push('A violation is one spot in one style, theme and width. A spot is the same selectors on one page, wherever it shows.', '');
  md.push('## Counts per rule', '', '| Rule | Phase I | Phase I spots | Phase II | Phase II spots | Excepted |', '|---|---|---|---|---|---|');
  for (const r of rules){ const p1 = live.filter(v => v.rule === r && v.phase === 'I'), p2 = live.filter(v => v.rule === r && v.phase === 'II');
    md.push(`| ${r} ${RN[r]} | ${p1.length} | ${new Set(p1.map(spot)).size} | ${p2.length} | ${new Set(p2.map(spot)).size} | ${all.filter(v => v.rule === r && v.excepted).length} |`); }
  md.push(`| All | ${live.filter(v => v.phase === 'I').length} | ${new Set(live.filter(v => v.phase === 'I').map(spot)).size} | ${live.filter(v => v.phase === 'II').length} | ${new Set(live.filter(v => v.phase === 'II').map(spot)).size} | ${all.filter(v => v.excepted).length} |`, '');
  for (const ph of ['I', 'II']){ const pages = [...new Set(live.filter(v => v.phase === ph).map(v => v.page))].map(p => [p, live.filter(v => v.page === p)]).sort((a, b) => b[1].length - a[1].length);
    md.push(`## Counts per component, Phase ${ph}`, '', '| Component | All | ' + rules.join(' | ') + ' |', '|---|---|' + rules.map(() => '---').join('|') + '|');
    pages.forEach(([p, vs]) => md.push(`| ${p} | ${vs.length} | ${rules.map(r => vs.filter(v => v.rule === r).length || '').join(' | ')} |`)); md.push(''); }
  md.push('## Exceptions', ''); EXCEPTIONS.forEach(x => md.push(`- ${x.ids.join(', ')} · ${x.rules.join(', ')}${x.sel ? ' · ' + x.sel : ''}: ${x.reason}`)); md.push('');
  for (const ph of ['I', 'II']){ md.push(`# Phase ${ph}`, '');
    for (const r of rules){ const vs = live.filter(v => v.rule === r && v.phase === ph); if (!vs.length) continue; md.push(`## ${r} ${RN[r]} (Phase ${ph}): ${vs.length}`, '');
      const pages = [...new Set(vs.map(v => v.page))].sort();
      for (const p of pages){ const pv = vs.filter(v => v.page === p); md.push(`### ${p} (${pv.length})`, ''); const spots = new Map(); pv.forEach(v => { const k = spot(v); if (!spots.has(k)) spots.set(k, []); spots.get(k).push(v); });
        for (const [, sv] of spots){ const v = sv[0]; md.push(`- ${v.msg}`, `  - where: ${sv.map(label).join('; ')}`, `  - first seen: ${v.moment}; numbers: \`${JSON.stringify(v.nums)}\``, `  - selectors: ${v.sels.map(s => '`' + s + '`').join(', ')}`, v.crop ? `  - crop: [${v.crop}](${v.crop})` : '  - crop: none'); }
        md.push(''); } } }
  if (errors.length){ md.push('# Errors while checking', ''); errors.slice(0, 200).forEach(e => md.push('- ' + e)); }
  fs.writeFileSync(path.join(OUT, 'violations.md'), md.join('\n') + '\n');
  fs.writeFileSync(path.join(OUT, 'violations.json'), JSON.stringify({ when:new Date().toISOString(), ref, styles:STYLES, themes:THEMES, widths:WIDTHS, exceptions:EXCEPTIONS.map(x => Object.assign({}, x, { sel:x.sel && String(x.sel) })), r7looks:summary,
    violations:all.map(v => { const o = Object.assign({}, v); delete o.key; delete o.q; return o; }) }, null, 1));
  const p1 = live.filter(v => v.phase === 'I');
  console.log(rules.map(r => `${r} ${live.filter(v => v.rule === r && v.phase === 'I').length}/${live.filter(v => v.rule === r && v.phase === 'II').length}`).join('  '));
  console.log(`${p1.length} Phase I violation(s), ${live.length - p1.length} Phase II, ${all.length - live.length} excepted. Report: ${path.join(OUT, 'violations.md')}`);
  return p1.length;
}

const main = async () => {
  fs.mkdirSync(path.join(OUT, 'crops'), { recursive:true }); fs.mkdirSync(path.join(OUT, 'jobs'), { recursive:true });
  if (process.env.FRESH) { for (const f of fs.readdirSync(path.join(OUT, 'jobs'))) fs.unlinkSync(path.join(OUT, 'jobs', f)); for (const f of fs.readdirSync(path.join(OUT, 'crops'))) fs.unlinkSync(path.join(OUT, 'crops', f)); }
  const browser = await chromium.launch();
  const ref = {}; for (const th of THEMES) ref[th] = await reference(browser, th);
  console.log('R6 reference, Clean chip against its panel:', Object.entries(ref).map(([t, r]) => `${t} ${r.chipDE.toFixed(2)}`).join(', '));
  const pages = listPages(), jobs = [];
  for (const pg of pages) for (const w of WIDTHS) for (const st of STYLES) for (const th of THEMES) jobs.push({ pg, st, th, w, file:path.join(OUT, 'jobs', `${pg.tpl ? 't-' : ''}${pg.id}-${st}-${th}-${w}.json`) });
  // (REPORT=1 writes the report from the runs already in OUT, without running any)
  // (a run that never sampled, its page timing out, is run again)
  const sampled = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')).moments > 0; } catch(e){ return false; } };
  const todo = process.env.REPORT ? [] : jobs.filter(j => !fs.existsSync(j.file) || !sampled(j.file)); let done = jobs.length - todo.length, next = 0; const t0 = Date.now();
  console.log(`${pages.length} pages, ${jobs.length} jobs, ${todo.length} to run, ${JOBS} at a time`);
  await Promise.all(Array.from({ length:Math.min(JOBS, todo.length) }, async (_, wi) => { let br = browser;
    while (next < todo.length){ const j = todo[next++]; let r;
      try { r = await runJob(br, j, Object.assign({}, ref[j.th], { card:ref[j.th].cards[j.st] })); } catch(e){ r = null; console.error('job failed', j.file, e.message); try { br = await chromium.launch(); } catch(e2){} if (!j.retried){ j.retried = 1; todo.push(j); } }
      if (r){ fs.writeFileSync(j.file, JSON.stringify(r)); done++; const el = (Date.now() - t0) / 1000; console.log(`[${done}/${jobs.length}] ${j.pg.id} ${j.st} ${j.th} ${j.w}: ${r.viol.length} violation(s)${r.errors.length ? ', ' + r.errors.length + ' error(s)' : ''} (${Math.round(el)}s)`); } } }));
  const results = jobs.filter(j => fs.existsSync(j.file)).map(j => JSON.parse(fs.readFileSync(j.file, 'utf8')));
  const all = results.flatMap(r => r.viol.map(v => Object.assign(v, { tpl:r.tpl })));
  const { out:r7, summary } = sameLook(results);
  const r7live = r7.filter(v => !exceptionFor(v)); if (r7live.length && !process.env.NOCROP7) await cropR7(browser, r7live);
  const errors = results.flatMap(r => r.errors.map(e => `${r.page} ${r.style} ${r.theme} ${r.w}: ${e}`));
  await browser.close();
  const n = report(all.concat(r7), Object.fromEntries(Object.entries(ref).map(([t, r]) => [t, { chipDE:r.chipDE, chip:r.chip, panel:r.panel }])), summary, errors);
  process.exit(n ? 1 : 0);
};
if (require.main === module) main(); else module.exports = { rulesLib, newPage };
