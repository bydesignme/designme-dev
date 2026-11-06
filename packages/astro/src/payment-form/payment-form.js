// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, enter, seg, tween } from '../core/core.js';
DM.def('payment-form', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{lock}', I('lock','xs'));
  const cn = $('.pyx-cn', r), ex = $('.pyx-ex', r), cv = $('.pyx-cv', r), br = $('.pyx-br', r);
  const BR = [[/^4/, 'VISA', '#1a1f71'], [/^5[1-5]/, 'MC', '#eb001b'], [/^3[47]/, 'AMEX', '#2e77bb']];
  cn.oninput = demo => { const d = cn.value.replace(/\D/g, '').slice(0, 16); cn.value = d.replace(/(.{4})/g, '$1 ').trim(); const b = BR.find(x => x[0].test(d));
    br.classList.toggle('on', !!b); if (b){ br.textContent = b[1]; br.style.background = b[2]; br.style.color = '#fff'; } cn.closest('.pyx-f').classList.remove('bad'); if (d.length === 16 && demo !== true) ex.focus({ preventScroll:true }); };
  ex.oninput = () => { let d = ex.value.replace(/\D/g, '').slice(0, 4); if (d.length === 1 && +d > 1) d = '0' + d; ex.value = d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d; ex.closest('.pyx-f').classList.remove('bad'); if (d.length === 4) cv.focus({ preventScroll:true }); };
  cv.oninput = () => { cv.value = cv.value.replace(/\D/g, ''); cv.closest('.pyx-f').classList.remove('bad'); };
  let per = 'y', tot = 691.2;
  function price(){ const unit = 24, sub = unit * 3, yr = per === 'y'; const t = yr ? sub * 12 * .8 : sub;
    $('.pyx-s', r).textContent = '$' + (yr ? sub * 12 : sub).toFixed(2); $('.pyx-d', r).textContent = yr ? '−$' + (sub * 12 * .2).toFixed(2) : '−$0.00'; $('.pyx-dc', r).classList.toggle('off', !yr);
    $('.pyx-u', r).textContent = yr ? '$24 × 12' : '$24';
    tween(tot, t, 600, v => { tot = v; $('.pyx-tot', r).textContent = '$' + v.toFixed(2); $('.pyx-gt', r).textContent = '$' + v.toFixed(2); }); }
  seg($('.pyx-per', r), v => { per = v; price(); });
  price();
  $('.pyx', r).onsubmit = e => { e.preventDefault(); let ok = true;
    [[cn, cn.value.replace(/\D/g, '').length === 16], [ex, /^\d\d \/ \d\d$/.test(ex.value)], [cv, cv.value.length >= 3]].forEach(([el, good]) => { if (!good){ ok = false; const f = el.closest('.pyx-f'); f.classList.remove('bad'); void f.offsetWidth; f.classList.add('bad'); } });
    if (!ok) return;
    c.run(async () => { const go = $('.pyx-go', r); go.innerHTML = '<span class="spin" style="border-color:rgba(255,255,255,.3);border-top-color:#fff"></span>Processing'; await c.wait(1200); go.classList.add('ok'); go.innerHTML = I('check','xs') + 'Payment successful'; enter(go.firstChild); }); };
  // the preview types a test card on its own; clicking, focusing or typing in it takes over, and what it had typed goes
  c.auto(1000, () => c.run(() => c.type(cn, '4242424242424242', { ms:45, each:() => cn.oninput(true) })));
});
