// Alignment and fit check for the library's cards (owner, 18 Nov: "how can I make sure you're not making them again and again").
// Plays each card, in every design it can switch to, and samples it while it plays. It reports:
//   columns  a row's leading mark, first words or last control that sits 1 to 8px off the same edge or centre line in
//            another row of the card (a near miss reads as misaligned; equal or clearly different is fine)
//   centres  parts of one single-line row (icon, words, a button) whose centres differ by more than 2px
//   buttons  buttons side by side whose drawn heights differ (an outer ring counts as part of the height)
//   menus    a menu or popover cut off by the stage or page around the component when its button opens it
//   ring     a focus ring drawn after a mouse click followed by a modifier key (a screenshot shortcut)
//   centring the component off centre in its stage by more than 3px at a settled moment
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
  if (sin.getAnimations({ subtree:true }).some(a => a.playState === 'running' && a.effect && a.effect.getComputedTiming().iterations !== Infinity)) return { skip:true };
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
    const b = e.getBoundingClientRect(); if (b.width < 6 || b.height < 6 || b.width > 64) return; A.push({ k:'mark', e, b }); });
  const bare = e => { const cs = getComputedStyle(e); return cs.backgroundColor === 'rgba(0, 0, 0, 0)' && cs.backgroundImage === 'none' && cs.boxShadow === 'none' && parseFloat(cs.borderTopWidth) === 0; };
  // a button that is a whole row of a list (as wide as the list it sits in, like a chat in a side list) is measured by what it
  // shows, as a bare one is: its hover or selection fill reaches out round its words by design, so the fill is not its edge
  const listRow = e => { const p = e.parentElement, w = e.getBoundingClientRect().width; return !!p && w > 120 && w >= p.clientWidth - 1 && [...p.children].filter(k => k.matches('button')).length > 2; };
  const inner = e => { const r = document.createRange(); r.selectNodeContents(e); const b = r.getBoundingClientRect(); return b.width ? b : e.getBoundingClientRect(); };
  sin.querySelectorAll('button,.pill,.ib,.tag,[role="switch"]').forEach(e => { if (!card.contains(e) || !vis(e) || e.closest('.pop') || (e.parentElement && e.parentElement.closest('button,.pill,.tag'))) return; const b = e.getBoundingClientRect(); if (b.width < 8 || b.height < 8 || b.width > C.width * .6) return; A.push({ k:'ctl', e, b:bare(e) || listRow(e) ? inner(e) : b, box:b }); });
  const tw = document.createTreeWalker(card, NodeFilter.SHOW_TEXT); let n;
  const sets = e => { const cs = getComputedStyle(e), pe = e.parentElement, ps = pe && getComputedStyle(pe);
    if (/center/.test(cs.textAlign) || (ps && /grid|flex/.test(ps.display) && (/center/.test(ps.justifyContent) || /center/.test(ps.justifyItems) || /center/.test(ps.placeItems))) || (/grid|flex/.test(cs.display) && /center/.test(cs.justifyContent + cs.justifyItems))) return 'centre';
    if (/right|end/.test(cs.textAlign) || (ps && /flex/.test(ps.display) && /end|space-between/.test(ps.justifyContent) && [...pe.children].filter(k => k.offsetParent).pop() === e)) return 'right';
    return 'left'; };
  const placed = e => { for (let a = e; a && a !== card; a = a.parentElement) if (/(^|;)\s*(left|--x0)\s*:/.test(a.getAttribute('style') || '')) return true; return false; };
  while ((n = tw.nextNode())){ const e = n.parentElement; if (!n.textContent.trim() || !vis(e) || e.closest('button,.pill,.tag,.pop,.hand') || placed(e)) continue; const r = document.createRange(); r.selectNodeContents(n); const lines = [...r.getClientRects()].filter(b => b.width > 2), set = sets(e); lines.forEach(b => A.push({ k:'text', e, b, set, wraps:lines.length > 1 })); }
  // rows: anchors that share a line
  const rows = []; A.sort((a, b) => a.b.top - b.b.top);
  for (const a of A){ const cy = (a.b.top + a.b.bottom) / 2; const r = rows.find(r => cy > r.top && cy < r.bottom); if (r){ r.items.push(a); r.top = Math.min(r.top, a.b.top); r.bottom = Math.max(r.bottom, a.b.bottom); } else rows.push({ top:a.b.top, bottom:a.b.bottom, items:[a] }); }
  rows.forEach(r => r.items.sort((a, b) => a.b.left - b.b.left));
  const near = (x, y) => { const d = Math.abs(x - y); return d > .75 && d <= 8; };
  // bands: a head or foot strip (a full-width band with its own fill at the card's top or bottom) lines up within itself;
  // its controls sit 8px from the card's edges by design, so they are not held to the content's 16px edge
  const cbg = getComputedStyle(card).backgroundColor;
  const strips = [...card.querySelectorAll('*')].filter(e => { const b = e.getBoundingClientRect(), cs = getComputedStyle(e); return vis(e) && b.width > C.width - 4 && b.height > 20 && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== cbg && (Math.abs(Math.min(b.bottom, C.bottom) - C.bottom) < 3 || Math.abs(b.top - C.top) < 3); });
  const band = (a, row) => { const cy = (a.b.top + a.b.bottom) / 2; const s = strips.find(s => { const r = s.getBoundingClientRect(); return cy > r.top && cy < Math.min(r.bottom, C.bottom); }); if (s) return strips.indexOf(s);
    const corner = row && row.items.some(x => x.k === 'ctl' && ((x.box || x.b).right > C.right - 9.5) && ((x.box || x.b).bottom > C.bottom - 9.5 || (x.box || x.b).top < C.top + 9.5));
    return corner ? ((C.bottom - cy) < (cy - C.top) ? 'foot' : 'head') : -1; };
  // a right edge counts for controls, and for words set against the right (a number, a time, a status), not for ragged text
  // (a tag at the end of a row with a hover fill sits inside the fill's padding, so it is not held to a button's edge)
  const rightSet = a => a && ((a.k === 'ctl' && !a.e.matches('.tag')) || (a.k === 'text' && a.set === 'right' && !a.wraps));
  // columns: the first mark, first words and last control of each row, against every other row's
  const lead = rows.map(r => ({ mark:r.items.find(a => a.k === 'mark'), text:r.items.find(a => a.k === 'text' && a.set === 'left'), last:[...r.items].reverse().find(a => a.k === 'ctl' || a.k === 'text') }));
  lead.forEach((l, i) => { l.band = band(rows[i].items[0], rows[i]); });
  for (let i = 0; i < lead.length; i++) for (let j = i + 1; j < lead.length; j++){
    const a = lead[i], b = lead[j]; if (a.band !== b.band) continue;
    if (a.mark && b.mark){ const ca = (a.mark.b.left + a.mark.b.right) / 2, cb = (b.mark.b.left + b.mark.b.right) / 2; if (near(ca, cb) && near(a.mark.b.left, b.mark.b.left)) out.push(`columns: marks ${Math.round(ca - C.left)} and ${Math.round(cb - C.left)} (centres) ${name(a.mark.e)} / ${name(b.mark.e)}`); }
    if (a.text && b.text && near(a.text.b.left, b.text.b.left) && !(a.mark && b.mark && a.mark.b.left < a.text.b.left && b.mark.b.left > b.text.b.left)) out.push(`columns: words start at ${Math.round(a.text.b.left - C.left)} and ${Math.round(b.text.b.left - C.left)} ${name(a.text.e)} / ${name(b.text.e)}`);
    if (rightSet(a.last) && rightSet(b.last) && near(a.last.b.right, b.last.b.right)) out.push(`columns: right edges at ${Math.round(C.right - a.last.b.right)} and ${Math.round(C.right - b.last.b.right)} from the card's edge ${name(a.last.e)} / ${name(b.last.e)}`);
  }
  // centres: single-line rows of a flex container
  sin.querySelectorAll('*').forEach(e => { if (!card.contains(e) || !vis(e)) return; const cs = getComputedStyle(e); if (!/flex/.test(cs.display) || cs.flexDirection !== 'row' || !/center|baseline/.test(cs.alignItems)) return;
    const kids = [...e.children].filter(k => vis(k) && k.getBoundingClientRect().height > 4); if (kids.length < 2) return;
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
  return { out };
}

(async () => {
  // the library's cards: /library.html since the landing page took / (19 Nov), or / on a build from before then
  const LIB = await fetch(`http://127.0.0.1:${port}/library.html`, { method:'HEAD' }).then(r => r.ok ? '/library.html' : '/', () => '/');
  const b = await chromium.launch(); const report = []; let issues = 0;
  for (const st of styles) for (const th of themes){
    const p = await b.newPage({ viewport:{ width:W, height:1000 } });
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
        for (let t = 0; t < SECS * 2; t++){ await p.waitForTimeout(500); const r = await p.evaluate(sample, id); if (r.skip) continue; r.out.forEach(x => seen.set(x, (seen.get(x) || 0) + 1)); }
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
          r.forEach(x => seen.set(x, (seen.get(x) || 0) + 1)); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
        }
        issues += seen.size;
        report.push(`${id}${nt ? ' design ' + d : ''} ${st} ${th}: ${seen.size ? seen.size + ' issue(s)' : 'ok'}` + [...seen].map(([k, v]) => `\n    ${k}${v > 1 ? '  (' + v + ' samples)' : ''}`).join(''));
        if (nt && d < nt - 1) await p.evaluate(id => window.V2 && window.V2.replay && window.V2.replay(document.querySelector(`.comp[data-v2="${id}"]`)), id).catch(() => {});
      }
    }
    await p.close();
  }
  await b.close(); console.log(report.join('\n')); console.log(issues ? `\n${issues} issue(s)` : '\nno issues'); process.exit(issues ? 1 : 0);
})();
