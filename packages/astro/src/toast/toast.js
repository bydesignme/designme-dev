// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, ctl, html, seg, swap } from '../core/core.js';
DM.def('toast', (r, c) => {
  const slot = $('.tst-slot', r);
  // each state's icon, colours and words; its tone (data-tone) is what Clean colours: success green, error red, the rest grey
  const V = {
    ok:{ g:'ok', tone:'success', col:'var(--dm-ok)', bg:'var(--dm-ok-bg)', b:'Changes applied', s:'4 files updated in PricingCard', act:'<button class="pill ghost sm tst-undo">Undo</button>' },
    err:{ g:'alert', tone:'error', col:'var(--dm-bad)', bg:'var(--dm-bad-bg)', b:'Could not push to main', s:'The branch is protected', act:'<button class="pill ghost sm tst-retry">Retry</button>' },
    info:{ g:'info', tone:'info', col:'var(--dm-pb)', bg:'var(--dm-pb-bg)', b:'Preview is ready', s:'pricing-spacing.preview.app', act:'<button class="pill ghost sm">Open</button>' },
    load:{ g:'load', tone:'loading', col:'var(--dm-fg)', bg:'var(--dm-chip)', b:'Deploying preview', s:'Building 3 pages', act:'' }
  };
  let cur = null; const agent = ctl(); c.offs.push(() => agent.stop());
  // a pressed button never goes blank and keeps no room for what it turns into: it shows its new content and eases from its
  // old width to its new one (owner, 19 Nov)
  const relabel = (btn, inner) => { const w0 = btn.offsetWidth; btn.innerHTML = inner; const w1 = btn.offsetWidth, cs = getComputedStyle(btn);
    if (!REDUCE && Math.abs(w1 - w0) > .5) btn.animate([{ width:w0 + 'px' }, { width:w1 + 'px' }], { duration:(parseFloat(cs.getPropertyValue('--dm-t')) || .34) * 1000, easing:cs.getPropertyValue('--dm-ease').trim() || 'ease' }); };
  let show = function(k){
    const v = V[k];
    const t = html(`<div class="tst-t tst-in" role="status"><span class="g" data-tone="${v.tone}" style="color:${v.col};background:${v.bg}">${k === 'load' ? '<span class="spin"></span>' : I(v.g)}</span><div class="tx"><b${k === 'load' ? ' class="shim"' : ''}>${v.b}</b><span>${v.s}</span></div><div class="acts">${v.act}<button class="ib" aria-label="Dismiss" data-tip="Dismiss">${I('x')}</button></div><span class="life"></span></div>`);
    if (cur){ const old = cur; old.classList.add('tst-out'); setTimeout(() => old.remove(), 300); }
    slot.appendChild(t); cur = t;
    // words that run past two lines beside the action give it a row of its own under them
    const lines = new Set(), tw = document.createTreeWalker($('.tx', t), NodeFilter.SHOW_TEXT);
    for (let n; (n = tw.nextNode());){ const g = document.createRange(); g.selectNodeContents(n); [...g.getClientRects()].forEach(b => b.width > 1 && lines.add(Math.round(b.top / 4))); }
    if (v.act && lines.size > 2) t.classList.add('wrap');
    $('.ib', t).onclick = () => { t.classList.add('tst-out'); setTimeout(() => t.remove(), 300); cur = null; };
    const u = $('.tst-undo', t); if (u) u.onclick = () => { $('.tx b', t).textContent = 'Changes undone'; swap($('.tx span', t), 'PricingCard is back as it was');
      relabel(u, I('check')); u.classList.add('done'); u.setAttribute('aria-label', 'Undone'); u.setAttribute('aria-disabled', 'true'); u.onclick = null; };
    const rt = $('.tst-retry', t); if (rt) rt.onclick = () => { relabel(rt, '<span class="spin"></span>'); rt.setAttribute('aria-busy', 'true'); rt.onclick = null; setTimeout(() => { if (t.isConnected) show('ok'); }, 1200); };
    // a loading toast keeps loading under a resting mouse, as a loader does (DM.PLAYS): the deploy finishes on its own clock,
    // which nothing holds
    if (k === 'load') agent.later(2600, () => { if (cur === t) show('info'); });
    if (k === 'ok' || k === 'info'){
      // it times out like a real toast: hovering holds it, and when it runs out it leaves and the same one comes back (until
      // you take over: then it stays gone until you pick one). A toast with an action stays 10 seconds, long enough to reach it
      const life = $('.life', t).animate([{ transform:'scaleX(1)' }, { transform:'scaleX(0)' }], { duration:10000, fill:'forwards' });
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
