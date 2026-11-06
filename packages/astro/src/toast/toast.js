// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, html, seg, swap } from '../core/core.js';
DM.def('toast', (r, c) => {
  const slot = $('.tst-slot', r);
  const V = {
    ok:{ g:'ok', col:'var(--dm-ok)', bg:'var(--dm-ok-bg)', b:'Changes applied', s:'4 files updated in PricingCard', act:'<button class="pill ghost sm tst-undo">Undo</button>' },
    err:{ g:'alert', col:'var(--dm-bad)', bg:'var(--dm-bad-bg)', b:'Could not push to main', s:'The branch is protected', act:'<button class="pill primary sm tst-retry">Retry</button>' },
    info:{ g:'info', col:'var(--dm-pb)', bg:'var(--dm-pb-bg)', b:'Preview is ready', s:'pricing-spacing.preview.app', act:'<button class="pill ghost sm">Open</button>' },
    load:{ g:'load', col:'var(--dm-fg)', bg:'var(--dm-chip)', b:'Deploying preview', s:'Building 3 pages', act:'' }
  };
  let cur = null;
  let show = function(k){
    const v = V[k];
    const t = html(`<div class="tst-t tst-in" role="status"><span class="g" style="color:${v.col};background:${v.bg}">${k === 'load' ? '<span class="spin"></span>' : I(v.g)}</span><div class="tx"><b>${v.b}</b><span>${v.s}</span></div><div class="acts">${v.act}<button class="ib" aria-label="Dismiss" data-tip="Dismiss">${I('x')}</button></div><span class="life"></span></div>`);
    if (cur){ const old = cur; old.classList.add('tst-out'); setTimeout(() => old.remove(), 300); }
    slot.appendChild(t); cur = t;
    $('.ib', t).onclick = () => { t.classList.add('tst-out'); setTimeout(() => t.remove(), 300); cur = null; };
    const u = $('.tst-undo', t); if (u) u.onclick = () => { $('.tx b', t).textContent = 'Changes undone'; swap($('.tx span', t), 'PricingCard is back as it was'); u.remove(); };
    const rt = $('.tst-retry', t); if (rt) rt.onclick = () => { rt.innerHTML = '<span class="spin"></span>'; setTimeout(() => { if (t.isConnected) show('ok'); }, 1200); };
    if (k === 'load') c.later(2600, () => { if (cur === t) show('info'); });
    if (k === 'ok' || k === 'info'){
      // it times out like a real toast: hovering holds it, and when it runs out it leaves and the same one comes back (until
      // you take over: then it stays gone until you pick one)
      const life = $('.life', t).animate([{ transform:'scaleX(1)' }, { transform:'scaleX(0)' }], { duration:5200, fill:'forwards' });
      t.addEventListener('pointerenter', () => life.pause()); t.addEventListener('pointerleave', () => life.play());
      life.finished.then(() => { if (cur !== t || c.dead) return; t.classList.add('tst-out'); cur = null; setTimeout(() => t.remove(), 300); c.auto(1100, () => { if (!cur) show(k); }); }).catch(() => {});
    }
  }
  const sg = $('.seg2', r), knob = seg(sg, v => show(v));
  const sync = k => { $$('button', sg).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === k)); knob.place(); };
  const show0 = show; show = k => { sync(k); show0(k); };
  // a state picked before this first one lands stays
  c.later(400, () => { if (!cur) show('ok'); });
});
