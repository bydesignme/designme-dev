// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, BRAND, DM, I, REDUCE, copied, enter, hideTip, showTip, swap, tipFor } from '../core/core.js';
DM.def('buttons', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{link}', I('link','s')).replace('{slack}', BRAND.slack).replace('{down}', I('down','s')).replace('{spark}', I('spark','xs')).replace('{figma}', I('figma','xs')).replace(/\{copy\}/g, (m, o) => I('copy','xs')).replace('{more}', I('more','xs')).replace('{trash}', I('trash','xs')).replace('{bin}', I('trash','s')).replace('{dup}', I('copy','s')).replace('{edit}', I('edit','s')).replace('{folder}', I('folder','s'));
  const ld = $('.btx-load', r);
  /* busy buttons keep their colour; disabled styling is only for buttons you can't use */
  ld.onclick = () => c.run(async () => { if (ld._busy) return; ld._busy = true; ld.classList.add('busy'); ld.setAttribute('aria-busy', 'true'); ld.innerHTML = '<span class="spin"></span>Publishing'; await c.wait(1300); ld.classList.remove('busy'); ld.classList.add('ok'); ld.innerHTML = I('check','xs') + 'Published'; enter(ld.firstChild); await c.wait(1800); ld.classList.remove('ok'); ld.textContent = 'Publish'; ld._busy = false; ld.removeAttribute('aria-busy'); });
  const ask = $('.btx-ask', r);
  ask.onclick = () => c.run(async () => { if (ask._busy) return; ask._busy = true; ask.classList.add('busy'); ask.innerHTML = '<span class="think on"><i></i><i></i><i></i><i></i></span><span class="shim">Agent is working</span>';
    await c.wait(2200); ask.classList.remove('busy'); ask.classList.add('done'); ask.innerHTML = I('check','xs') + 'Draft ready'; enter(ask.firstChild);
    await c.wait(1800); ask.classList.remove('done'); ask.innerHTML = I('spark','xs') + 'Ask agent'; ask._busy = false; });
  const icp = $('.btx-icp', r); icp.onclick = () => copied(icp, 'https://designme.dev/p/pricing');
  /* Start free trial: a short wait, then a confirmed state */
  const tr = $('.btx-trial', r);
  tr.onclick = () => c.run(async () => { if (tr._busy) return; tr._busy = true; tr.setAttribute('aria-busy', 'true'); tr.innerHTML = '<span class="spin"></span>Starting'; await c.wait(1100); tr.innerHTML = I('check','xs') + 'Trial started'; enter(tr.firstChild); await c.wait(1800); swap(tr, 'Start free trial'); tr._busy = false; tr.removeAttribute('aria-busy'); });
  /* Run agent: shows the run time, turns into Stop while you hover it */
  const rn = $('.btx-run', r); let rt = 0, rtick = null, rdone = null;
  const idle = () => { clearInterval(rtick); clearTimeout(rdone); rn.classList.remove('busy'); rn.removeAttribute('aria-busy'); rn._run = false; };
  const rlabel = () => { if (!rn._run) return; rn.innerHTML = rn.matches(':hover') ? '<span class="sq"></span>Stop' : `<span class="spin"></span>Running <span class="num">${Math.floor(rt / 60)}:${String(rt % 60).padStart(2, '0')}</span>`; };
  rn.onclick = () => {
    if (rn._run){ idle(); rn.innerHTML = '<span class="sq"></span>Stopped'; c.later(1200, () => { if (!rn._run) swap(rn, 'Run agent'); }); return; }
    rn._run = true; rt = 0; rn.classList.add('busy'); rn.setAttribute('aria-busy', 'true'); rlabel();
    rtick = setInterval(() => { rt++; rlabel(); }, 1000);
    rdone = setTimeout(() => { idle(); rn.innerHTML = I('check','xs') + 'Run complete'; enter(rn.firstChild); c.later(1800, () => { if (!rn._run) swap(rn, 'Run agent'); }); }, 3200);
  };
  rn.onmouseenter = rlabel; rn.onmouseleave = rlabel;
  c.offs.push(idle);
  /* Preview: a toggle, live while it is on */
  const pv = $('.btx-pv', r);
  pv.onclick = () => { const on = pv.getAttribute('aria-pressed') !== 'true'; pv.setAttribute('aria-pressed', on); pv.innerHTML = on ? '<span class="btx-live"></span>Previewing' : 'Preview'; };
  /* Share: a small menu, the button says what happened */
  const sh = $('.btx-share', r);
  const said = (t, ms = 1600) => { sh.innerHTML = I('check','xs') + t; enter(sh.firstChild); clearTimeout(sh._t); sh._t = setTimeout(() => swap(sh, 'Share'), ms); };
  $$('.btx-sp .mi', r).forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.a;
    if (a === 'link'){ try { navigator.clipboard.writeText('https://designme.dev/p/pricing').catch(() => {}); } catch(e){} said('Link copied'); }
    else if (a === 'slack') said('Sent to #design');
    else { clearTimeout(sh._t); sh.innerHTML = '<span class="spin"></span>Exporting'; sh._t = setTimeout(() => said('PDF ready'), 1100); }
  }));
  c.offs.push(() => clearTimeout(sh._t));
  /* Open in Figma: a short wait while it opens, then it says where it went */
  const fg = $('.btx-fig', r);
  fg.onclick = () => c.run(async () => { if (fg._busy) return; fg._busy = true; fg.setAttribute('aria-busy', 'true'); fg.innerHTML = '<span class="spin"></span>Opening'; await c.wait(900);
    fg.innerHTML = I('ext','xs') + 'Opened in Figma'; enter(fg.firstChild); await c.wait(1800); swap(fg, I('figma','xs') + 'Open in Figma', true); await c.wait(200); fg._busy = false; fg.removeAttribute('aria-busy'); });
  /* More: a menu of actions; the button flashes a check and says what happened */
  const mo = $('.btx-more', r), moIc = mo.innerHTML;
  // no tooltip over its own open menu
  const mob = new MutationObserver(() => { if (mo.getAttribute('aria-expanded') === 'true'){ if (tipFor === mo) hideTip(true); delete mo.dataset.tip; } else if (!mo.classList.contains('done')) mo.dataset.tip = 'More'; });
  mob.observe(mo, { attributes:true, attributeFilter:['aria-expanded'] }); c.offs.push(() => mob.disconnect());
  $$('.btx-mp .mi', r).forEach(b => b.addEventListener('click', () => {
    clearTimeout(mo._t); c.later(140, () => { mo.innerHTML = I('check','xs'); mo.classList.add('done'); mo.dataset.tip = b.dataset.a; showTip(mo);
      mo._t = setTimeout(() => { mo.innerHTML = moIc; mo.classList.remove('done'); mo.dataset.tip = 'More'; if (tipFor === mo) hideTip(true); }, 1500); });
  }));
  c.offs.push(() => clearTimeout(mo._t));
  const cp = $('.btx-copy', r);
  cp.onclick = () => { copied(cp, 'https://designme.dev/p/pricing'); const t = cp.lastChild; t.textContent = 'Copied'; clearTimeout(cp._lt); cp._lt = setTimeout(() => { t.textContent = 'Copy link'; }, 1600); };
  const h = $('.btx-hold', r), lb = $('.lb', h); let t;
  // the label crossfades to Keep holding by hand, so an early release can cancel it before the text lands
  const start = e => { if (h.classList.contains('done')) return; h.classList.add('h'); lb.classList.add('sw', 'out'); clearTimeout(h._sw); h._sw = setTimeout(() => { lb.textContent = 'Keep holding'; lb.classList.remove('out'); }, REDUCE ? 0 : 170); t = setTimeout(() => { h.classList.remove('h'); h.classList.add('done'); lb.innerHTML = I('check','xs') + 'Deleted'; c.later(1800, () => { h.classList.remove('done'); lb.innerHTML = I('trash','xs') + 'Hold to delete'; }); }, 1200); };
  const end = () => { if (!h.classList.contains('h')) return; clearTimeout(t); clearTimeout(h._sw); lb.classList.remove('out'); h.classList.remove('h'); lb.innerHTML = I('trash','xs') + 'Hold to delete'; };
  h.onpointerdown = start; h.onpointerup = end; h.onpointerleave = end;
  h.onkeydown = e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat){ e.preventDefault(); start(); } };
  h.onkeyup = e => { if (e.key === ' ' || e.key === 'Enter') end(); }; h.onblur = end;
  c.offs.push(() => { clearTimeout(t); clearTimeout(h._sw); });
});
