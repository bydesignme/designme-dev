// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, BRAND, DM, I, REDUCE, copied, enter, hideTip, html, showTip, swap, tipFor } from '../core/core.js';
DM.def('buttons', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{link}', I('link','s')).replace('{slack}', BRAND.slack).replace('{down}', I('down','s')).replace('{spark}', I('spark','xs')).replace('{figma}', I('figma','xs')).replace(/\{copy\}/g, (m, o) => I('copy','xs')).replace('{more}', I('more','xs')).replace(/\{trash\}/g, I('trash','xs')).replace('{bin}', I('trash','s')).replace('{dup}', I('copy','s')).replace('{edit}', I('edit','s')).replace('{folder}', I('folder','s'));
  /* a button is as wide as its words (owner, 18 Nov): when they change, whoever changes them (a click here, swap(), copied()),
     it eases from the width it showed to its new one, at the style's pace, instead of keeping room for its longest label */
  const cssV = v => getComputedStyle(r).getPropertyValue(v).trim();
  const ro = new ResizeObserver(es => es.forEach(e => { e.target._w = e.target.getBoundingClientRect().width; }));
  const mo = new MutationObserver(ms => new Set(ms.map(m => (m.target.nodeType === 1 ? m.target : m.target.parentElement).closest('.pill'))).forEach(b => {
    if (!b) return;
    const from = b._w; b.getAnimations().forEach(a => { if (a.id === 'fit') a.cancel(); });
    const to = b.getBoundingClientRect().width; b._w = to;
    if (REDUCE || !from || Math.abs(to - from) < .5) return;
    const s = cssV('--dm-t'), a = b.animate([{ width:from + 'px' }, { width:to + 'px' }], { duration:(s.endsWith('ms') ? parseFloat(s) : parseFloat(s) * 1000) || 340, easing:cssV('--dm-ease') || 'ease' }); a.id = 'fit';
  }));
  $$('.btx-row .pill', r).forEach(b => { b._w = b.getBoundingClientRect().width; ro.observe(b); mo.observe(b, { childList:true, characterData:true, subtree:true }); });
  c.offs.push(() => { ro.disconnect(); mo.disconnect(); });
  /* done: the outlined face with the vivid green tick in place of the icon, at the same size, and no green fill (owner, 18 Nov);
     undone() puts back the face it had */
  const done = (b, words, el = b) => {
    if (!b._was){ b._was = ['primary', 'accent', 'soft'].find(k => b.classList.contains(k)) || (b.classList.contains('line') ? '-' : '+'); if (b._was !== '-'){ if (b._was !== '+') b.classList.remove(b._was); b.classList.add('line'); } }
    b.classList.add('btx-ok'); el.innerHTML = I('check','xs') + words; enter(el.firstChild);
  };
  const undone = b => { b.classList.remove('btx-ok'); if (b._was && b._was !== '-'){ b.classList.remove('line'); if (b._was !== '+') b.classList.add(b._was); } b._was = null; };
  const ld = $('.btx-load', r);
  /* busy buttons keep their colour; disabled styling is only for buttons you can't use */
  ld.onclick = () => c.run(async () => { if (ld._busy) return; ld._busy = true; ld.classList.add('busy'); ld.setAttribute('aria-busy', 'true'); ld.innerHTML = '<span class="spin"></span>Publishing'; await c.wait(1300); ld.classList.remove('busy'); ld.removeAttribute('aria-busy'); done(ld, 'Published'); await c.wait(1800); undone(ld); ld.textContent = 'Publish'; ld._busy = false; });
  const ask = $('.btx-ask', r);
  ask.onclick = () => c.run(async () => { if (ask._busy) return; ask._busy = true; ask.classList.add('busy'); ask.setAttribute('aria-busy', 'true'); ask.innerHTML = '<span class="think on"><i></i><i></i><i></i><i></i></span><span class="shim">Agent is working</span>';
    await c.wait(2200); ask.classList.remove('busy'); ask.removeAttribute('aria-busy'); done(ask, 'Draft ready');
    await c.wait(1800); undone(ask); ask.innerHTML = I('spark','xs') + 'Ask agent'; ask._busy = false; });
  const icp = $('.btx-icp', r); icp.onclick = () => copied(icp, 'https://designme.dev/p/pricing');
  /* Start free trial: a short wait, then a confirmed state */
  const tr = $('.btx-trial', r);
  tr.onclick = () => c.run(async () => { if (tr._busy) return; tr._busy = true; tr.classList.add('busy'); tr.setAttribute('aria-busy', 'true'); tr.innerHTML = '<span class="spin"></span>Starting'; await c.wait(1100); tr.classList.remove('busy'); tr.removeAttribute('aria-busy'); done(tr, 'Trial started'); await c.wait(1800); undone(tr); swap(tr, 'Start free trial'); tr._busy = false; });
  /* Run agent: shows the run time, turns into Stop while you hover it. Stop keeps the running width, so the button never
     narrows away from the pointer on it */
  const rn = $('.btx-run', r); let rt = 0, rtick = null, rdone = null;
  const idle = () => { clearInterval(rtick); clearTimeout(rdone); rn.classList.remove('busy'); rn.removeAttribute('aria-busy'); rn.style.minWidth = ''; rn._run = false; };
  const rlabel = () => { if (!rn._run) return; const stop = rn.matches(':hover'); rn.style.minWidth = stop ? rn.getBoundingClientRect().width + 'px' : ''; rn.innerHTML = stop ? '<span class="sq"></span>Stop' : `<span class="spin"></span>Running <span class="num">${Math.floor(rt / 60)}:${String(rt % 60).padStart(2, '0')}</span>`; };
  rn.onclick = () => {
    if (rn._run){ idle(); rn.innerHTML = '<span class="sq"></span>Stopped'; c.later(1200, () => { if (!rn._run) swap(rn, 'Run agent'); }); return; }
    undone(rn); rn._run = true; rt = 0; rn.classList.add('busy'); rn.setAttribute('aria-busy', 'true'); rlabel();
    rtick = setInterval(() => { rt++; rlabel(); }, 1000);
    rdone = setTimeout(() => { idle(); done(rn, 'Run complete'); c.later(1800, () => { if (!rn._run){ undone(rn); swap(rn, 'Run agent'); } }); }, 3200);
  };
  rn.onmouseenter = rlabel; rn.onmouseleave = rlabel;
  c.offs.push(idle);
  /* Preview: a toggle, live while it is on */
  const pv = $('.btx-pv', r);
  pv.onclick = () => { const on = pv.getAttribute('aria-pressed') !== 'true'; pv.setAttribute('aria-pressed', on); pv.innerHTML = on ? '<span class="btx-live"></span>Previewing' : 'Preview'; };
  /* Share: a small menu, the button says what happened */
  const sh = $('.btx-share', r);
  const said = (t, ms = 1600) => { done(sh, t); clearTimeout(sh._t); sh._t = setTimeout(() => { undone(sh); swap(sh, 'Share'); }, ms); };
  $$('.btx-sp .mi', r).forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.a;
    if (a === 'link'){ try { navigator.clipboard.writeText('https://designme.dev/p/pricing').catch(() => {}); } catch(e){} said('Link copied'); }
    else if (a === 'slack') said('Sent to #design');
    else { clearTimeout(sh._t); undone(sh); sh.innerHTML = '<span class="spin"></span>Exporting'; sh._t = setTimeout(() => said('PDF ready'), 1100); }
  }));
  c.offs.push(() => clearTimeout(sh._t));
  /* Open in Figma: a short wait while it opens, then it says where it went */
  const fg = $('.btx-fig', r);
  fg.onclick = () => c.run(async () => { if (fg._busy) return; fg._busy = true; fg.classList.add('busy'); fg.setAttribute('aria-busy', 'true'); fg.innerHTML = '<span class="spin"></span>Opening'; await c.wait(900);
    fg.classList.remove('busy'); fg.innerHTML = I('ext','xs') + 'Opened in Figma'; enter(fg.firstChild); await c.wait(1800); swap(fg, I('figma','xs') + 'Open in Figma', true); await c.wait(200); fg._busy = false; fg.removeAttribute('aria-busy'); });
  /* More: a menu of actions; the button flashes the green tick and says what happened */
  const mo2 = $('.btx-more', r), moIc = mo2.innerHTML;
  // no tooltip over its own open menu
  const mob = new MutationObserver(() => { if (mo2.getAttribute('aria-expanded') === 'true'){ if (tipFor === mo2) hideTip(true); delete mo2.dataset.tip; } else if (!mo2.classList.contains('done')) mo2.dataset.tip = 'More'; });
  mob.observe(mo2, { attributes:true, attributeFilter:['aria-expanded'] }); c.offs.push(() => mob.disconnect());
  $$('.btx-mp .mi', r).forEach(b => b.addEventListener('click', () => {
    clearTimeout(mo2._t); c.later(140, () => { mo2.innerHTML = I('check','xs'); mo2.classList.add('done'); mo2.dataset.tip = b.dataset.a; showTip(mo2);
      mo2._t = setTimeout(() => { mo2.innerHTML = moIc; mo2.classList.remove('done'); mo2.dataset.tip = 'More'; if (tipFor === mo2) hideTip(true); }, 1500); });
  }));
  c.offs.push(() => clearTimeout(mo2._t));
  const cp = $('.btx-copy', r);
  cp.onclick = () => { copied(cp, 'https://designme.dev/p/pricing'); const t = cp.lastChild; t.textContent = 'Copied'; clearTimeout(cp._lt); cp._lt = setTimeout(() => { t.textContent = 'Copy link'; }, 1600); };
  // its words, and their white copy on the fill, change together
  const h = $('.btx-hold', r), lbs = $$('.lb', h), lb = lbs[0], words = html => lbs.forEach(l => { l.innerHTML = html; }); let t;
  // the label crossfades to Keep holding by hand, so an early release can cancel it before the text lands
  const start = e => { if (h.classList.contains('btx-ok')) return; h.classList.add('h'); lbs.forEach(l => l.classList.add('sw', 'out')); clearTimeout(h._sw); h._sw = setTimeout(() => { words('Keep holding'); lbs.forEach(l => l.classList.remove('out')); }, REDUCE ? 0 : 170); t = setTimeout(() => { h.classList.remove('h'); done(h, 'Deleted', lb); lbs[1].innerHTML = lb.innerHTML; c.later(1800, () => { undone(h); words(I('trash','xs') + 'Hold to delete'); }); }, 1200); };
  const end = () => { if (!h.classList.contains('h')) return; clearTimeout(t); clearTimeout(h._sw); lbs.forEach(l => l.classList.remove('out')); h.classList.remove('h'); words(I('trash','xs') + 'Hold to delete'); };
  h.onpointerdown = start; h.onpointerup = end; h.onpointerleave = end;
  h.onkeydown = e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat){ e.preventDefault(); start(); } };
  h.onkeyup = e => { if (e.key === ' ' || e.key === 'Enter') end(); }; h.onblur = end;
  c.offs.push(() => { clearTimeout(t); clearTimeout(h._sw); });
});
