// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, swap, tween } from '../core/core.js';
DM.def('health-score', (r, c) => {
  const K = [['Token usage',96,'All colours come from the library'],['Contrast',88,'2 text pairs below AA on the pricing page',1],['Component reuse',74,'11 detached instances in Checkout',1],['Naming',91,'Layer names follow the convention']];
  const list = $('.hsx-list', r), fl = $('.hsx-g .fl', r), vb = $('.hsx-v b', r), st = $('.hsx-st', r);
  let score = 0;
  const col = v => v >= 90 ? 'var(--dm-hs-ok)' : v >= 80 ? 'var(--dm-accent-mark,var(--dm-accent))' : 'var(--dm-hs-bad)';
  const tl = $('.hsx-s b', r);
  // the gauge shows one value at a time: the overall score, or the check under the pointer or the keyboard focus
  let shown = -1, run = 0;
  function gauge(v){ fl.style.strokeDashoffset = 157 * (1 - v / 100); fl.style.stroke = col(v); const id = ++run, from = score; tween(from, v, 700, n => { if (id === run){ score = n; vb.textContent = Math.round(n); } }); }
  function total(){ if (shown >= 0) return; const t = Math.round(K.reduce((a, k) => a + k[1], 0) / K.length); gauge(t); swap(tl, 'Design system health'); const n = K.filter(k => k[1] < 90).length; swap(st, n ? (t >= 85 ? 'Good' : 'Fair') + ', ' + n + (n > 1 ? ' checks need' : ' check needs') + ' work' : 'Excellent, all checks pass'); }
  function show(i){ if (shown === i) return; shown = i; if (i < 0) return total(); gauge(K[i][1]); swap(tl, K[i][0]); swap(st, K[i][2]); }
  list.innerHTML = K.map(k => `<div class="hsx-c"><button class="hsx-ch"><span class="t">${k[0]}</span><span class="bar"><i style="width:0"></i></span><span class="v num">${k[1]}</span>${I('chev-r','xs')}</button><div class="fold shut"><div><div class="hsx-d"><span>${k[2]}</span>${k[3] ? `<button class="pill soft sm">${I('wand','xs')}Fix</button>` : ''}</div></div></div></div>`).join('');
  $$('.hsx-c', list).forEach((el, i) => {
    $('.hsx-ch', el).onclick = () => { const o = !el.classList.contains('open'); el.classList.toggle('open', o); $('.fold', el).classList.toggle('shut', !o); };
    // pointing at a check (or tabbing to it) swings the gauge to its score and names it; leaving the list swings back
    c.on(el, 'pointerenter', e => { if (e.pointerType !== 'touch') show(i); });
    c.on(el, 'focusin', () => show(i));
    const bar = () => { const b = $('.bar i', el); b.style.width = K[i][1] + '%'; b.style.background = col(K[i][1]); };
    c.later(300 + i * 80, bar);
    const fx = $('.hsx-d .pill', el);
    if (fx) fx.onclick = () => c.run(async () => { fx.innerHTML = '<span class="spin"></span>'; await c.wait(900); K[i][1] = i === 1 ? 97 : 93; K[i][3] = 0; K[i][2] = i === 1 ? 'Fixed. Both pairs now pass AA' : 'Fixed. Reattached 11 instances'; bar(); tween(+$('.v', el).textContent, K[i][1], 700, n => $('.v', el).textContent = Math.round(n)); swap($('.hsx-d span', el), K[i][2]); fx.remove(); if (shown === i){ shown = -2; show(i); } else total(); });
  });
  c.on(list, 'pointerleave', () => { if (!list.contains(document.activeElement)) show(-1); });
  c.on(list, 'focusout', e => { if (!list.contains(e.relatedTarget) && !list.matches(':hover')) show(-1); });
  c.later(280, total);
});
