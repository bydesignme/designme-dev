// Alignment and fit check for the library's cards (owner, 18 Nov: "how can I make sure you're not making them again and again").
// Plays each card, in every design it can switch to, and samples it while it plays. It reports:
//   columns  a row's leading mark, first words or last control that sits 1 to 8px off the same edge or centre line in
//            another row of the card (a near miss reads as misaligned; equal or clearly different is fine)
//   centres  parts of one single-line row (icon, words, a button) whose centres differ by more than 2px
//   buttons  buttons side by side whose drawn heights differ (an outer ring counts as part of the height)
//   menus    a menu or popover cut off by the stage or page around the component when its button opens it
//   ring     a focus ring drawn after a mouse click followed by a modifier key (a screenshot shortcut)
//   centring the component off centre in its stage by more than 3px at a settled moment
//   strips   in Clean, a head or foot strip's controls more than 1px off 16px from the strip's top and bottom
//   insets   the card's content more than 2.5px further from one edge than another, in every style (head and foot strips
//            and edges they cover are left out)
//   baseline words side by side on one line (a title and its muted time or count, a label and its value, a name and its role)
//            whose baselines differ by more than 0.5px, whatever their sizes
// usage (from the repo root, after a build, with a server on PORT, default 8790):
//   IDS=permission-gate,model-picker node tools/site/check-align.js     STYLES=clean,soft,blueprint THEMES=light,dark W=1440 SECS=16
// Nothing reaches the owner until it reports no issues for every style and theme.
const { chromium } = require(process.env.PW || 'playwright');
const ids = (process.env.IDS || '').split(',').filter(Boolean), port = process.env.PORT || 8790, W = +(process.env.W || 1440);
const styles = (process.env.STYLES || 'clean,soft,blueprint').split(','), themes = (process.env.THEMES || 'light,dark').split(','), SECS = +(process.env.SECS || 16);
if (!ids.length) { console.error('IDS=<card ids> required'); process.exit(2); }

// runs in the page: every check on one card, at one moment
function sample(id){
  const comp = document.querySelector(`.comp[data-v2="${id}"]`), sin = comp.querySelector('.v2.stage-in');
  const out = [];
  // (while something in the card plays, only the baselines are checked, so a card whose demo never settles, like Agent lanes'
  // tracks, still has its head checked; two words are compared unless something between them and the row they share is
  // moving: an animation of position or size on one of them and not the other. A fade, a colour, a pseudo-element's
  // highlight gliding behind a list, or a move of the whole row does not shift one word against the other)
  const running = sin.getAnimations({ subtree:true }).filter(a => a.playState === 'running' && a.effect && a.effect.getComputedTiming().iterations !== Infinity);
  const shifts = a => { if (a.effect.pseudoElement) return false; const props = a.transitionProperty ? [a.transitionProperty] : a.effect.getKeyframes().flatMap(k => Object.keys(k)); return props.some(q => /^(transform|translate|scale|rotate|top|left|right|bottom|inset|margin|padding|width|height|min|max|grid|flex|gap|line-height|font-size|letter-spacing|all)/i.test(q.replace(/[A-Z]/g, c => '-' + c.toLowerCase()))); };
  const moving = running.filter(shifts).map(a => a.effect.target).filter(Boolean);
  // (text kept for screen readers only, clipped to nothing with clip-path: inset(50%), is not on screen either)
  const vis = e => { for (let a = e; a && a !== sin; a = a.parentElement){ const cs = getComputedStyle(a); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .1 || a.hidden || a.matches('.hand,.tip') || cs.clipPath === 'inset(50%)') return false; } return true; };
  const name = e => (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : e.tagName.toLowerCase()) + (e.textContent && e.textContent.trim() ? ` "${e.textContent.trim().slice(0, 18)}"` : '');
  // the card: the outermost element with a radius and an edge
  const card = [...sin.querySelectorAll('*')].find(e => { const cs = getComputedStyle(e); return parseFloat(cs.borderTopLeftRadius) >= 8 && (cs.boxShadow !== 'none' || parseFloat(cs.borderTopWidth) > 0) && e.getBoundingClientRect().width > 200 && !e.closest('.pop,.hand,button'); }) || sin;
  const C = card.getBoundingClientRect();
  // anchors: marks (icons, tiles, boxes, avatars), words (one text line each) and controls (buttons, pills, tags)
  const A = [];
  const isCtl = e => e.matches('button,.pill,.ib,.tag,[role="switch"],select,input:not([type="checkbox"]):not([type="radio"]):not([type="file"])');
  sin.querySelectorAll('svg,.bx,.av,[class$="-ic"],[class*="-ic "],[class$="-mk"],[class*="-mk "],[class$="-av"],[class*="-av "]').forEach(e => {
    if (!card.contains(e) || !vis(e) || (e.closest('svg') && e.tagName.toLowerCase() !== 'svg') || e.closest('button,.pill,.tag,.pop')) return;
    const b = e.getBoundingClientRect(); if (b.width < 6 || b.height < 6 || b.width > 64) return;
    // an icon in a tile of its own (a small square box with a fill, an edge or a ring and nothing else in it) is measured by
    // its tile, whatever the tile's class is called
    const t = e.parentElement; if (t && t !== card && t.children.length === 1 && !t.matches('button,.pill,.tag')){ const tb = t.getBoundingClientRect(), ts = getComputedStyle(t);
      if (tb.width >= 16 && tb.width <= 64 && Math.abs(tb.width - tb.height) <= 4 && (ts.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(ts.borderTopWidth) > 0 || ts.boxShadow !== 'none')){ if (!A.some(x => x.e === t)) A.push({ k:'mark', e:t, b:tb }); return; } }
    A.push({ k:'mark', e, b }); });
  const bare = e => { const cs = getComputedStyle(e); return cs.backgroundColor === 'rgba(0, 0, 0, 0)' && cs.backgroundImage === 'none' && cs.boxShadow === 'none' && parseFloat(cs.borderTopWidth) === 0; };
  const inner = e => { const r = document.createRange(); r.selectNodeContents(e); const b = r.getBoundingClientRect(); return b.width ? b : e.getBoundingClientRect(); };
  // a button that is a whole row of a list (as wide as the list it sits in, like a chat in a side list) is measured by what it
  // shows, as a bare one is: its hover or selection fill reaches out round its words by design, so the fill is not its edge
  const listRow = e => { const p = e.parentElement, w = e.getBoundingClientRect().width; return !!p && w > 120 && w >= p.clientWidth - 1 && [...p.children].filter(k => k.matches('button')).length > 2; };
  // words and controls a script places by coordinates (a chart's axis labels round a radar, a point's label) sit where the chart's
  // geometry puts them, not on the card's columns, so they are left out of the column checks
  const placed = e => { for (let a = e; a && a !== card; a = a.parentElement) if (/(^|;)\s*(left|--x0)\s*:/.test(a.getAttribute('style') || '')) return true; return false; };
  // baselines (owner, 23 Nov: Agent lanes' "0:05" sat 2px above "3 agents working"): words that sit side by side on one line
  // share one baseline, whatever their sizes. A row with align-items:center centres each box, so a 12.5px time beside a 14px
  // title ends up with its baseline higher; the centres check above can't see that, since the centres do match.
  //  - each run of words (a text node on one line) is measured by its baseline: a zero-size probe placed in the text's
  //    parent right before the words lands on the words' baseline. The probe is an empty inline with a font size of 0, so its
  //    box is a point on the baseline; an inline-block would be measured the same way but adds a place where the line may
  //    break, which can push it onto a line of its own (". Every plan" after "team" in a diff; words wider than their column).
  //    When the parent is a flex or grid box, or has display:contents, its loose words are an anonymous item of their own, so
  //    they are wrapped for the moment, with the probe, in an element with every property unset (an anonymous item's look).
  //    Every probe is put in first and read after, in one layout, then everything is put back as it was
  //  - two runs are on one line when their boxes overlap vertically by at least a third of the smaller, and each sits in a
  //    one-line part of the row: the child of their nearest common ancestor holding each run has no words on another line
  //    (a title over a subtitle, centred against a time beside them, is not one line). A time set squarely beside the title
  //    of such a two-line part (two thirds of its height on the title's line) is on the title's line
  //  - words inside buttons, chips and tags are left out (they are centred in their own box: a button, a pill, a tag, or any
  //    element with its own fill, edge or ring up to 30px tall and 160px wide), and so are runs that wrap (a paragraph),
  //    raised or lowered on purpose (sup, sub), drawn in an SVG or over one (a score inside its ring), or placed by a chart's
  //    coordinates
  function baselines(){
    const shadeOn = cs => cs.boxShadow !== 'none' && cs.boxShadow.split(/,(?![^(]*\))/).some(s => !/rgba\([^)]*,\s*0\)|transparent/.test(s));
    // (and words drawn over a graphic, like a score inside its ring, are the graphic's label, not words on a line)
    // (a small graphic, up to 96px: a tree's or a chart's drawing laid over a whole list is not a mark)
    const over = (e, b) => [...e.children].some(k => k.tagName.toLowerCase() === 'svg' && (q => q.width <= 96 && q.height <= 96 && q.left <= b.left && q.right >= b.right && q.top <= b.top && q.bottom >= b.bottom)(k.getBoundingClientRect()));
    const chip = (e, b) => { for (let a = e; a && a !== card; a = a.parentElement){ if (a.matches('button,.pill,.tag,.chip,.fchip,[role="button"],[role="tab"],[role="option"],[role="switch"],kbd,code,sup,sub') || over(a, b)) return true;
      // (a fill clipped to the words, like the loader's highlight sweep, is the words' colour, not a chip's fill)
      const cs = getComputedStyle(a), q = a.getBoundingClientRect(), txt = /text/.test(cs.backgroundClip + cs.webkitBackgroundClip);
      if (q.height <= 30 && q.width <= 160 && (((cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none') && !txt) || parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0 || shadeOn(cs))) return true; } return false; };
    const runs = [], w2 = document.createTreeWalker(card, NodeFilter.SHOW_TEXT); let t2;
    // (words faded out for the moment, like a status line crossfading, still hold their line: they are not measured, but they
    // count when deciding whether a part of a row is one line)
    const laid = e => { for (let a = e; a && a !== sin; a = a.parentElement){ const cs = getComputedStyle(a); if (cs.display === 'none' || cs.visibility === 'hidden' || a.hidden || cs.clipPath === 'inset(50%)') return false; } return true; };
    while ((t2 = w2.nextNode())){ const e = t2.parentElement; if (!t2.textContent.trim() || !laid(e) || e.closest('svg,.pop,.hand,.tip') || placed(e)) continue;
      const r = document.createRange(); r.selectNodeContents(t2); const ls = [...r.getClientRects()].filter(b => b.width > 2 && b.height > 2); if (!ls.length) continue;
      const tops = new Set(ls.map(b => Math.round(b.top))), b = r.getBoundingClientRect();
      runs.push({ n:t2, e, b, wraps:tops.size > 1, skip:tops.size > 1 || !vis(e) || chip(e, b) }); }
    const ov = (x, y) => Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top);
    const cand = runs.filter(r => !r.skip);
    if (cand.length > 1){
      const unset = 'all:unset!important;', made = [];
      cand.forEach(r => { const p = document.createElement('dm-baseline-probe'); p.style.cssText = unset + 'display:inline!important;font-size:0!important;line-height:0!important;vertical-align:baseline!important';
        let lay = r.e; while (lay.parentElement && getComputedStyle(lay).display === 'contents') lay = lay.parentElement;
        if (lay !== r.e || /flex|grid|box/.test(getComputedStyle(r.e).display)){ const w = document.createElement('dm-baseline-wrap'); w.style.cssText = unset; r.n.before(w); w.append(p, r.n); made.push(() => { w.before(r.n); w.remove(); }); }
        else { r.n.before(p); made.push(() => p.remove()); }
        r.p = p; });
      cand.forEach(r => { r.base = r.p.getBoundingClientRect().top; });
      made.reverse().forEach(f => f());
      // the child of `top` that holds node x (x itself when it sits right in `top`)
      const under = (top, x) => { let a = x; while (a && a.parentNode !== top) a = a.parentNode; return a; };
      const oneLine = (item, r) => item.nodeType === 3 || runs.every(q => !item.contains(q.n) || (!q.wraps && ov(q.b, r.b) > 0));
      // (a part of two or three lines, up to 48px, like a title over its subtitle: words beside it that sit squarely on one of
      // its lines, two thirds of their height on it, share that line's baseline; words centred between its lines do not)
      const block = item => item.nodeType !== 3 && item.getBoundingClientRect().height <= 48 && runs.every(q => !item.contains(q.n) || !q.wraps);
      const said = (r) => `"${r.n.textContent.trim().slice(0, 24)}"`;
      for (let i = 0; i < cand.length; i++) for (let j = i + 1; j < cand.length; j++){
        const a = cand[i], b = cand[j], o = ov(a.b, b.b) / Math.min(a.b.height, b.b.height); if (o < 1 / 3 || moving.some(m => m.contains(a.e) !== m.contains(b.e))) continue;
        const d = Math.abs(a.base - b.base); if (d <= .5) continue;
        let top = a.e; while (top && !top.contains(b.n)) top = top.parentElement; if (!top || !card.contains(top)) continue;
        const ia = under(top, a.n), ib = under(top, b.n), la = oneLine(ia, a), lb = oneLine(ib, b);
        // (words that straddle two lines of the row, centred against a name over its detail laid out as separate parts, are on
        // neither line unless two thirds of them sit on one)
        const straddle = (x, y) => runs.some(q => q !== x && q !== y && top.contains(q.n) && ov(q.b, x.b) <= 0 && ov(q.b, y.b) > 0);
        if (o < 2 / 3 && (straddle(a, b) || straddle(b, a))) continue;
        if (!(la && lb) && !(o >= 2 / 3 && (la || block(ia)) && (lb || block(ib)))) continue;
        const [l, r] = a.b.left <= b.b.left ? [a, b] : [b, a];
        out.push(`baseline: ${said(l)} vs ${said(r)} off by ${d.toFixed(1)}px`); }
    }
  }
  if (running.length){ baselines(); return { out }; }
  sin.querySelectorAll('button,.pill,.ib,.tag,[role="switch"]').forEach(e => { if (!card.contains(e) || !vis(e) || e.closest('.pop') || placed(e) || (e.parentElement && e.parentElement.closest('button,.pill,.tag'))) return; const b = e.getBoundingClientRect(); if (b.width < 8 || b.height < 8 || b.width > C.width * .6) return; A.push({ k:'ctl', e, b:bare(e) || listRow(e) ? inner(e) : b, box:b }); });
  const tw = document.createTreeWalker(card, NodeFilter.SHOW_TEXT); let n;
  const sets = e => { const cs = getComputedStyle(e), pe = e.parentElement, ps = pe && getComputedStyle(pe);
    if (/center/.test(cs.textAlign) || (ps && /grid|flex/.test(ps.display) && (/center/.test(ps.justifyContent) || /center/.test(ps.justifyItems) || /center/.test(ps.placeItems))) || (/grid|flex/.test(cs.display) && /center/.test(cs.justifyContent + cs.justifyItems))) return 'centre';
    if (/right|end/.test(cs.textAlign) || (ps && /flex/.test(ps.display) && /end|space-between/.test(ps.justifyContent) && [...pe.children].filter(k => k.offsetParent).pop() === e)) return 'right';
    return 'left'; };
  while ((n = tw.nextNode())){ const e = n.parentElement; if (!n.textContent.trim() || !vis(e) || e.closest('button,.pill,.tag,.pop,.hand') || placed(e)) continue; const r = document.createRange(); r.selectNodeContents(n); const lines = [...r.getClientRects()].filter(b => b.width > 2), set = sets(e); lines.forEach(b => A.push({ k:'text', e, b, set, wraps:lines.length > 1 })); }
  // rows: anchors that share a line
  const rows = []; A.sort((a, b) => a.b.top - b.b.top);
  for (const a of A){ const cy = (a.b.top + a.b.bottom) / 2; const r = rows.find(r => cy > r.top && cy < r.bottom); if (r){ r.items.push(a); r.top = Math.min(r.top, a.b.top); r.bottom = Math.max(r.bottom, a.b.bottom); } else rows.push({ top:a.b.top, bottom:a.b.bottom, items:[a] }); }
  rows.forEach(r => r.items.sort((a, b) => a.b.left - b.b.left));
  const near = (x, y) => { const d = Math.abs(x - y); return d > .75 && d <= 8; };
  // strips: a head or foot strip (a full-width band with its own fill at the card's top or bottom). Its controls sit on the
  // content's 16px column like every other row (owner, 21 Nov, replacing the 18 Nov 8px for strip controls), so a strip's
  // rows are held to the same columns as the content's; the strips are still found, for the insets check below
  const cbg = getComputedStyle(card).backgroundColor;
  const strips = [...card.querySelectorAll('*')].filter(e => { const b = e.getBoundingClientRect(), cs = getComputedStyle(e); return vis(e) && b.width > C.width - 4 && b.height > 20 && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== cbg && (Math.abs(Math.min(b.bottom, C.bottom) - C.bottom) < 3 || Math.abs(b.top - C.top) < 3); });
  const band = () => -1;
  // strip controls (owner, 23 Nov, replacing the 8px of 18 Nov): in Clean, a head or foot strip's controls sit 16px from the
  // strip's outer edge (the card's) and 16px from its hairline, as they sit 16px from the card's sides; measured by each control's
  // box (a select's hover box too: it lines up by its words only at the sides). Strips holding words alone aren't measured here
  if (document.documentElement.dataset.style === 'clean') strips.filter(s => !strips.some(t => t !== s && s.contains(t))).forEach(s => {
    const sb = s.getBoundingClientRect(), cs = getComputedStyle(s), top = sb.top + parseFloat(cs.borderTopWidth), bot = Math.min(sb.bottom, C.bottom) - parseFloat(cs.borderBottomWidth);
    // (a control inside a drawn track or field, like a segment of a switch or a field's Send, is measured by that track or field)
    const drawnIn = e => { for (let q = e.parentElement; q && q !== s; q = q.parentElement){ const cs = getComputedStyle(q); if ((cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== getComputedStyle(s).backgroundColor) || parseFloat(cs.borderTopWidth) > 0 || /inset/.test(cs.boxShadow)) return q.getBoundingClientRect(); } return null; };
    const ctl = [...s.querySelectorAll('button,.pill,.ib,[role="switch"],select,input:not([type="checkbox"]):not([type="radio"]):not([type="file"])')].filter(e => vis(e) && !e.matches('.tag') && !e.closest('.pop') && e.getBoundingClientRect().height > 8).map(e => drawnIn(e) || e.getBoundingClientRect()); if (!ctl.length) return;
    // (a strip one row tall has both measured; a taller one, with words above its buttons, the edge its controls sit by; a band
    // taller than 120px with a fill of its own, like a canvas, is a panel, not a strip)
    // (words in the strip count too, by their line box: two lines of words beside a select sit 16px from the edges, the select
    // on their centre line)
    const words = A.filter(a => a.k === 'text' && s.contains(a.e)).map(a => { const lh = parseFloat(getComputedStyle(a.e).lineHeight), hl = lh > a.b.height ? (lh - a.b.height) / 2 : 0; return { top:a.b.top - hl, bottom:a.b.bottom + hl }; });
    const all = ctl.concat(words), t = Math.min(...all.map(r => r.top)) - top, b = bot - Math.max(...all.map(r => r.bottom)); if (bot - top > 120) return;
    if (bot - top <= 64 ? Math.abs(t - 16) > 1 || Math.abs(b - 16) > 1 : Math.abs(Math.min(t, b) - 16) > 1) out.push(`strips: ${name(s)} has its controls and words ${Math.round(t)}px from its top and ${Math.round(b)}px from its bottom (16 expected)`); });
  // a right edge counts for controls, and for words set against the right (a number, a time, a status), not for ragged text
  // (a tag at the end of a row with a hover fill sits inside the fill's padding, so it is not held to a button's edge)
  // (a button that is a whole row of a list is measured by its words, and their end is ragged, so it has no right edge)
  const rightSet = a => a && ((a.k === 'ctl' && !a.e.matches('.tag') && !(a.b !== a.box && listRow(a.e))) || (a.k === 'text' && a.set === 'right' && !a.wraps));
  // columns: the first mark, first words and last control of each row, against every other row's
  const lead = rows.map(r => ({ mark:r.items.find(a => a.k === 'mark'), text:r.items.find(a => a.k === 'text' && a.set === 'left'), last:[...r.items].reverse().find(a => a.k === 'ctl' || a.k === 'text'), first:r.items.find(a => a.k === 'mark' || (a.k === 'ctl' && !a.e.matches('.tag') && a.b === a.box)) }));
  lead.forEach((l, i) => { l.band = band(rows[i].items[0], rows[i]); });
  for (let i = 0; i < lead.length; i++) for (let j = i + 1; j < lead.length; j++){
    const a = lead[i], b = lead[j]; if (a.band !== b.band) continue;
    if (a.mark && b.mark){ const ca = (a.mark.b.left + a.mark.b.right) / 2, cb = (b.mark.b.left + b.mark.b.right) / 2; if (near(ca, cb) && near(a.mark.b.left, b.mark.b.left)) out.push(`columns: marks ${Math.round(ca - C.left)} and ${Math.round(cb - C.left)} (centres) ${name(a.mark.e)} / ${name(b.mark.e)}`); }
    if (a.text && b.text && near(a.text.b.left, b.text.b.left) && !(a.mark && b.mark && a.mark.b.left < a.text.b.left && b.mark.b.left > b.text.b.left)) out.push(`columns: words start at ${Math.round(a.text.b.left - C.left)} and ${Math.round(b.text.b.left - C.left)} ${name(a.text.e)} / ${name(b.text.e)}`);
    // a row that starts with a drawn control (a strip's outlined button; not a bare select, whose words line up instead)
    // against a row that starts with a mark: their left edges
    const fa = a.first, fb = b.first; if (fa && fb && fa.k !== fb.k && fa.b.left - C.left < C.width / 3 && fb.b.left - C.left < C.width / 3){ const la = fa.b.left, lb = fb.b.left; if (near(la, lb)) out.push(`columns: left edges at ${Math.round(la - C.left)} and ${Math.round(lb - C.left)} from the card's edge ${name(fa.e)} / ${name(fb.e)}`); }
    if (rightSet(a.last) && rightSet(b.last) && near(a.last.b.right, b.last.b.right)) out.push(`columns: right edges at ${Math.round(C.right - a.last.b.right)} and ${Math.round(C.right - b.last.b.right)} from the card's edge ${name(a.last.e)} / ${name(b.last.e)}`);
  }
  // centres: single-line rows of a flex container
  sin.querySelectorAll('*').forEach(e => { if (!card.contains(e) || !vis(e)) return; const cs = getComputedStyle(e); if (!/flex/.test(cs.display) || cs.flexDirection !== 'row' || !/center|baseline/.test(cs.alignItems)) return;
    let kids = [...e.children].filter(k => vis(k) && k.getBoundingClientRect().height > 4); if (kids.length < 2) return;
    // (a row that wraps, like a foot whose buttons go under its select on a phone, is held to one centre line per line it makes:
    // the parts on the first line)
    if (cs.flexWrap !== 'nowrap'){ const t0 = Math.min(...kids.map(k => k.getBoundingClientRect().top)), b0 = Math.min(...kids.map(k => k.getBoundingClientRect().bottom)); kids = kids.filter(k => k.getBoundingClientRect().top < b0 && k.getBoundingClientRect().bottom > t0); if (kids.length < 2) return; }
    const cy = kids.map(k => { const b = k.getBoundingClientRect(); if (b.height > 34) return null; if (!k.children.length && k.textContent.trim()){ const r = document.createRange(); r.selectNodeContents(k); const t = r.getBoundingClientRect(); return (t.top + t.bottom) / 2; } return (b.top + b.bottom) / 2; }).filter(v => v !== null);
    if (cy.length >= 2 && Math.max(...cy) - Math.min(...cy) > 2) out.push(`centres: ${name(e)} parts differ by ${(Math.max(...cy) - Math.min(...cy)).toFixed(1)}px`); });
  // buttons: drawn height of buttons side by side
  const btns = A.filter(a => a.k === 'ctl' && a.e.matches('button,.pill') && !a.e.matches('.tag'));
  const ring = e => Math.max(0, ...getComputedStyle(e).boxShadow.split(/,(?![^(]*\))/).filter(s => s.trim() && !/inset/.test(s)).map(s => { const v = s.replace(/rgba?\([^)]*\)|#[\da-f]+/gi, '').trim().split(/\s+/).map(parseFloat); return v.length >= 4 && !v[0] && !v[1] && !v[2] ? v[3] : 0; }));
  for (let i = 0; i < btns.length; i++) for (let j = i + 1; j < btns.length; j++){ const a = btns[i], b = btns[j]; const ca = (a.b.top + a.b.bottom) / 2, cb = (b.b.top + b.b.bottom) / 2; if (Math.abs(ca - cb) > 3 || a.e.parentElement !== b.e.parentElement) continue;
    const ha = a.b.height + 2 * ring(a.e), hb = b.b.height + 2 * ring(b.e); if (Math.abs(ha - hb) > 1 && (getComputedStyle(a.e).backgroundColor !== 'rgba(0, 0, 0, 0)' || ring(a.e)) && (getComputedStyle(b.e).backgroundColor !== 'rgba(0, 0, 0, 0)' || ring(b.e))) out.push(`buttons: ${name(a.e)} ${ha.toFixed(1)}px and ${name(b.e)} ${hb.toFixed(1)}px tall side by side`); }
  // centring in the stage
  const st = comp.querySelector(':scope>.stage').getBoundingClientRect(), si = sin.getBoundingClientRect();
  const off = ((si.top - st.top) - (st.bottom - si.bottom)) / 2; if (Math.abs(off) > 3) out.push(`centring: ${off > 0 ? 'low' : 'high'} by ${Math.abs(off).toFixed(0)}px`);
  // insets: how far the card's content sits from each of its edges, in every style (owner, 21 Nov: a Task table row's fill 8px
  // from the bottom against 16px at the sides, the Funnel's insight 7px from the bottom against 20). Content is every anchor
  // above plus the fills inside the card (a highlighted row, a quote box), each clipped to the scroll box it sits in; lines of
  // 2px or less, fills as wide as the card and the head and foot strips are left out (they meet the edges by design), and an
  // edge a strip covers is not measured
  // (a slim pill or bar found as the card, like an inline chip, has its own padding by design, so it isn't measured)
  if (card !== sin && C.height >= 60){
    const clip = (e, b) => { let r = { left:b.left, right:b.right, top:b.top, bottom:b.bottom }; for (let a = e.parentElement; a && a !== card; a = a.parentElement){ const cs = getComputedStyle(a); if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue; const q = a.getBoundingClientRect(); r = { left:Math.max(r.left, q.left), right:Math.min(r.right, q.right), top:Math.max(r.top, q.top), bottom:Math.min(r.bottom, q.bottom) }; } return r; };
    const inStrip = e => strips.some(s => s.contains(e));
    // What is measured is what is drawn (alignment pass, 23 Nov):
    //  - a bare control with words (a ghost button, a disclosure, no fill at rest) by its words, as the columns check measures
    //    it: its hover box reaches out round them by design (Stop's word on the content's edge)
    //  - a bare icon button, and a hover ring kept ready at rest (a transparent shadow), by its hover box or by its glyph,
    //    whichever sits on the content's edge: the library has both (Clean's icon buttons with their box on the edge, a
    //    corner Close with its glyph on it), so the card is held to the closer reading
    //  - words by their line box (their line height, as CSS padding sets them), not the font's own box
    //  - left-set words that wrap by the column they are set in (their block's content edge); left-set words that don't wrap
    //    are not measured on the right, since a line's ragged end is not an edge
    //  - a fill a ::before or ::after draws (a header's tile under its mark) by that fill
    //  - a dialog placed over the words (an edit's bar) floats over the card's edge as a menu does, so it is left out
    const fl = e => { const d = e.closest('[role="dialog"]'); return !!d && d !== card && card.contains(d); };
    const clear = s => /rgba\([^)]*,\s*0\)|transparent/.test(s), shade = cs => cs.boxShadow !== 'none' && cs.boxShadow.split(/,(?![^(]*\))/).some(s => !clear(s));
    const blockRight = e => { for (let a = e; a && a !== card; a = a.parentElement){ const cs = getComputedStyle(a); if (!/inline/.test(cs.display)){ const q = a.getBoundingClientRect(); return q.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth); } } return C.right; };
    const drawn = a => { if (a.k === 'ctl') return !bare(a.e) ? a.box || a.b : a.e.textContent.trim() ? meet(a.b, a.box) : Object.assign({}, rect(a.box), { alt:rect(a.b) }); if (a.k !== 'text') return a.b;
      const lh = parseFloat(getComputedStyle(a.e).lineHeight), hl = lh > a.b.height ? (lh - a.b.height) / 2 : 0;
      return { left:a.b.left, right:a.set === 'left' && a.wraps ? blockRight(a.e) : a.b.right, top:a.b.top - hl, bottom:a.b.bottom + hl, noRight:a.set === 'left' && !a.wraps }; };
    const rect = b => ({ left:b.left, right:b.right, top:b.top, bottom:b.bottom });
    // (a bare control's words within its own box: words it keeps for screen readers, clipped away, are not drawn)
    const meet = (w, x) => ({ left:Math.max(w.left, x.left), right:Math.min(w.right, x.right), top:Math.max(w.top, x.top), bottom:Math.min(w.bottom, x.bottom) });
    const boxes = A.filter(a => !inStrip(a.e) && !fl(a.e)).map(a => { const d = drawn(a); return Object.assign(clip(a.e, d), { noRight:d.noRight, alt:d.alt && clip(a.e, d.alt) }); });
    const fill = (cs, cbgOk) => !((cs.backgroundColor === 'rgba(0, 0, 0, 0)' || (!cbgOk && cs.backgroundColor === cbg)) && !(parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0) && !shade(cs));
    // a row's hover or selected fill reaches 8px out round the row, into the padding, while the row's content keeps the card's
    // 16px column (owner, 26 Nov: "none of the padding makes sense again", on Agent tree's rows pushed 8px in to keep their
    // fills inside it). Such a fill (half the card wide or more, no edge or lift of its own, a quiet inset ring at most, its
    // content 6px or more inside it) is not the content's edge: what it holds is measured as it is
    // (what it holds is read from what is drawn: its words, icons and filled marks, not the boxes they sit in)
    const rowFill = (e, b, cs) => { if (b.width < Math.min(120, C.width * .5) || b.height > 160 || b.left - C.left < 6 || C.right - b.right < 6) return false;
      if (parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0) return false;
      if (cs.boxShadow !== 'none' && cs.boxShadow.split(/,(?![^(]*\))/).some(s => !/inset/.test(s) && !clear(s))) return false;
      if (!e.textContent.trim()) return false;
      let l = Infinity, r = -Infinity; const take = q => { if (q.width > 0 && q.height > 0){ l = Math.min(l, q.left); r = Math.max(r, q.right); } };
      const tw = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())){ if (!n.textContent.trim() || !vis(n.parentElement)) continue; const g = document.createRange(); g.selectNodeContents(n); take(g.getBoundingClientRect()); }
      e.querySelectorAll('svg,img').forEach(k => { if (!k.closest('svg svg') && vis(k)) take(k.getBoundingClientRect()); });
      e.querySelectorAll('*').forEach(k => { if (k.closest('svg') || !vis(k)) return; const kb = k.getBoundingClientRect(); if (kb.width > b.width * .6) return; if (fill(getComputedStyle(k), true)) take(kb); });
      return l < Infinity && l - b.left >= 6 && b.right - r >= 6; };
    card.querySelectorAll('*').forEach(e => { if (!vis(e) || inStrip(e) || fl(e) || e.closest('.pop,.hand,.tip')) return; const cs = getComputedStyle(e);
      if (cs.position !== 'static') for (const ps of ['::before', '::after']){ const q = getComputedStyle(e, ps); if (q.content === 'none' || q.display === 'none' || q.position !== 'absolute' || +q.opacity < .1 || !fill(q, true)) continue;
        const eb = e.getBoundingClientRect(), w = parseFloat(q.width), h = parseFloat(q.height), l = eb.left + parseFloat(cs.borderLeftWidth) + parseFloat(q.left) + parseFloat(q.marginLeft), t = eb.top + parseFloat(cs.borderTopWidth) + parseFloat(q.top) + parseFloat(q.marginTop);
        if (w > 2 && h > 2 && w < C.width - 4 && [l, t].every(Number.isFinite)) boxes.push(clip(e, { left:l, right:l + w, top:t, bottom:t + h })); }
      const b = e.getBoundingClientRect(); if (b.height <= 2 || b.width <= 2 || b.width > C.width - 4) return;
      if (!fill(cs)){ const g = ring(e); if (g && !A.some(x => x.e === e)) boxes.push(Object.assign(clip(e, { left:b.left - g, right:b.right + g, top:b.top - g, bottom:b.bottom + g }), { alt:clip(e, b) })); return; }
      if (rowFill(e, b, cs)) return;
      boxes.push(clip(e, b)); });
    const measure = alt => { const live = boxes.map(r => alt && r.alt ? Object.assign({}, r.alt, { noRight:r.noRight }) : r).filter(r => r.right - r.left > 1 && r.bottom - r.top > 1); if (!live.length) return null;
      const rl = live.filter(r => !r.noRight), rmax = rl.length ? Math.max(...rl.map(r => r.right)) : -Infinity;
      const sT = strips.some(s => Math.abs(s.getBoundingClientRect().top - C.top) < 3), sB = strips.some(s => Math.abs(Math.min(s.getBoundingClientRect().bottom, C.bottom) - C.bottom) < 3);
      const ins = { left:Math.min(...live.map(r => r.left)) - C.left, right:rmax < C.left + C.width * .66 ? null : C.right - rmax, top:sT ? null : Math.min(...live.map(r => r.top)) - C.top, bottom:sB ? null : C.bottom - Math.max(...live.map(r => r.bottom)) };
      const vals = Object.values(ins).filter(v => v !== null); return { ins, spread:Math.max(...vals) - Math.min(...vals) }; };
    const m = [measure(false), measure(true)].filter(Boolean).sort((x, y) => x.spread - y.spread)[0];
    if (m && m.spread > 2.5) out.push(`insets: ${Object.entries(m.ins).map(([k, v]) => `${k} ${v === null ? (k === 'right' ? 'ragged' : 'strip') : Math.round(v)}`).join(', ')}`);
  }
  baselines();
  return { out };
}

(async () => {
  // the library's cards: /library.html since the landing page took / (19 Nov), or / on a build from before then
  const LIB = await fetch(`http://127.0.0.1:${port}/library.html`, { method:'HEAD' }).then(r => r.ok ? '/library.html' : '/', () => '/');
  const b = await chromium.launch(); const report = []; let issues = 0;
  for (const st of styles) for (const th of themes){
    // (generous waits: on a busy machine a tab can take more than the default 30s to settle before it can be clicked)
    const p = await b.newPage({ viewport:{ width:W, height:1000 } }); p.setDefaultTimeout(120000);
    await p.addInitScript(([s, t]) => { try { localStorage.setItem('dmui-style', s); localStorage.setItem('dmui-theme', t); } catch(e){} }, [st, th]);
    await p.route(/plausible|api\.github\.com|supabase|fonts\.g/, r => r.abort());
    // (both groups of the library on show, so an App basics card is checked as it plays, not hidden behind the group switch)
    await p.goto(`http://127.0.0.1:${port}${LIB}`, { waitUntil:'load' }); await p.evaluate(() => { document.documentElement.classList.add('grp-all'); return document.fonts.ready; });
    for (const id of ids){
      const card = p.locator(`.comp[data-v2="${id}"]`); await card.evaluate(e => e.scrollIntoView({ block:'center' })); await p.waitForTimeout(300);
      const tabs = card.locator('.comp-foot [data-tabs] button'), nt = await tabs.count();
      for (let d = 0; d < Math.max(1, nt); d++){
        if (nt) await tabs.nth(d).click(); await p.mouse.move(0, 0);
        const seen = new Map();
        // (a baseline issue is counted once however its words change while the demo plays: a clock ticking beside a title is one
        // issue, not one per second; it is reported with the words it first had)
        const add = x => { const k = /^baseline:/.test(x) ? x.replace(/\d/g, '#') : x, v = seen.get(k); v ? v[1]++ : seen.set(k, [x, 1]); };
        for (let t = 0; t < SECS * 2; t++){ await p.waitForTimeout(500); const r = await p.evaluate(sample, id); if (r.skip) continue; r.out.forEach(add); }
        // menus: each popover button, clicked with the mouse, then a modifier key pressed (the ring check)
        const pops = card.locator('.v2.stage-in [data-pop]');
        for (let k = 0; k < await pops.count(); k++){
          const bt = pops.nth(k); if (!(await bt.isVisible())) continue; const bb = await bt.boundingBox(); if (!bb) continue;
          await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(450);
          await p.keyboard.down('Shift'); await p.keyboard.up('Shift');
          const r = await bt.evaluate(btn => { const pop = btn.closest('.stage-in').querySelector('.pop.open'); const res = []; const name = btn.className;
            if (getComputedStyle(btn).outlineStyle !== 'none') res.push(`ring: ${name} shows a focus ring after a click and a modifier key`);
            if (pop){ const pr = pop.getBoundingClientRect(); let top = 0, bottom = innerHeight; for (let a = btn.closest('.stage-in').parentElement; a && a !== document.documentElement; a = a.parentElement){ if (getComputedStyle(a).overflowY === 'visible') continue; const r = a.getBoundingClientRect(); top = Math.max(top, r.top); bottom = Math.min(bottom, r.bottom); }
              if (pr.top < top - 1 || pr.bottom > bottom + 1) res.push(`menus: ${pop.className.split(' ').slice(0, 2).join('.')} is cut off by ${Math.round(Math.max(top - pr.top, pr.bottom - bottom))}px`); }
            return res; });
          r.forEach(add); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
        }
        issues += seen.size;
        report.push(`${id}${nt ? ' design ' + d : ''} ${st} ${th}: ${seen.size ? seen.size + ' issue(s)' : 'ok'}` + [...seen.values()].map(([k, v]) => `\n    ${k}${v > 1 ? '  (' + v + ' samples)' : ''}`).join(''));
        if (nt && d < nt - 1) await p.evaluate(id => window.V2 && window.V2.replay && window.V2.replay(document.querySelector(`.comp[data-v2="${id}"]`)), id).catch(() => {});
      }
    }
    await p.close();
  }
  await b.close(); console.log(report.join('\n')); console.log(issues ? `\n${issues} issue(s)` : '\nno issues'); process.exit(issues ? 1 : 0);
})();
