// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, FLAG, I, REDUCE, centre, swap, tween } from '../core/core.js';
DM.def('currency-converter', (r, c) => {
  /* each currency's flag: the ones Country select draws, and the European Union's twelve stars, drawn here the same way */
  const CC = { USD:'US', GBP:'GB', JPY:'JP', CAD:'CA', AUD:'AU' };
  const EU = '<svg viewBox="0 0 640 480"><path fill="#039" d="M0 0h640v480H0z"/><path fill="#fc0" d="M320 53.3 326 71.8 345.4 71.8 329.7 83.1 335.7 101.6 320 90.2 304.3 101.6 310.3 83.1 294.6 71.8 314 71.8zM400 74.8 406 93.2 425.4 93.2 409.7 104.6 415.7 123 400 111.6 384.3 123 390.3 104.6 374.6 93.2 394 93.2zM458.6 133.3 464.6 151.8 483.9 151.8 468.3 163.1 474.2 181.6 458.6 170.2 442.9 181.6 448.9 163.1 433.2 151.8 452.6 151.8zM480 213.3 486 231.8 505.4 231.8 489.7 243.1 495.7 261.6 480 250.2 464.3 261.6 470.3 243.1 454.6 231.8 474 231.8zM458.6 293.3 464.6 311.8 483.9 311.8 468.3 323.1 474.2 341.6 458.6 330.2 442.9 341.6 448.9 323.1 433.2 311.8 452.6 311.8zM400 351.9 406 370.3 425.4 370.3 409.7 381.7 415.7 400.1 400 388.8 384.3 400.1 390.3 381.7 374.6 370.3 394 370.3zM320 373.3 326 391.8 345.4 391.8 329.7 403.1 335.7 421.6 320 410.2 304.3 421.6 310.3 403.1 294.6 391.8 314 391.8zM240 351.9 246 370.3 265.4 370.3 249.7 381.7 255.7 400.1 240 388.8 224.3 400.1 230.3 381.7 214.6 370.3 234 370.3zM181.4 293.3 187.4 311.8 206.8 311.8 191.1 323.1 197.1 341.6 181.4 330.2 165.8 341.6 171.7 323.1 156.1 311.8 175.4 311.8zM160 213.3 166 231.8 185.4 231.8 169.7 243.1 175.7 261.6 160 250.2 144.3 261.6 150.3 243.1 134.6 231.8 154 231.8zM181.4 133.3 187.4 151.8 206.8 151.8 191.1 163.1 197.1 181.6 181.4 170.2 165.8 181.6 171.7 163.1 156.1 151.8 175.4 151.8zM240 74.8 246 93.2 265.4 93.2 249.7 104.6 255.7 123 240 111.6 224.3 123 230.3 104.6 214.6 93.2 234 93.2z"/></svg>';
  const FL = k => `<span class="ccx-fl" data-k="${k}">${k === 'EUR' ? `<img class="flag" alt="" src="data:image/svg+xml,${encodeURIComponent(EU.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" '))}">` : FLAG(CC[k])}</span>`;
  r.innerHTML = r.innerHTML.replace(/\{chev\}/g, I('chev-d','xs')).replace('{swap}', I('sort','xs')).replace(/\{fl-(\w+)\}/g, (m, k) => FL(k));
  const RATE = { USD:1, EUR:.92, GBP:.79, JPY:149.6, CAD:1.37, AUD:1.52 };
  const NAME = { USD:'US dollar', EUR:'Euro', GBP:'Pound', JPY:'Yen', CAD:'Canadian dollar', AUD:'Australian dollar' };
  const SYM = { USD:'$', EUR:'€', GBP:'£', JPY:'¥', CAD:'C$', AUD:'A$' };
  let A = 'USD', B = 'EUR', out = 0;
  const a = $('.ccx-a', r), b = $('.ccx-b', r), rate = $('.ccx-rate', r), curs = $$('.ccx-cur', r);
  function calc(delay){ const n = parseFloat(a.value.replace(/[^\d.]/g, '')) || 0; const v = n / RATE[A] * RATE[B]; const dp = B === 'JPY' ? 0 : 2;
    const go = () => tween(out, v, 450, x => { out = x; b.textContent = SYM[B] + x.toLocaleString('en-US', { minimumFractionDigits:dp, maximumFractionDigits:dp }); }); delay ? c.later(delay, go) : go();
    rate.innerHTML = `<span class="dot"></span>1 ${A} = ${(RATE[B] / RATE[A]).toFixed(B === 'JPY' || A === 'JPY' ? 4 : 4)} ${B} · updated 2 min ago`; }
  function menus(){ [['.ccx-p1', 0], ['.ccx-p2', 1]].forEach(([sel, side]) => { const p = $(sel, r), cur = side ? B : A;
    p.innerHTML = Object.keys(RATE).map(k => `<button class="mi" role="menuitemradio" data-close data-k="${k}" aria-checked="${k === cur}">${FL(k)}<span class="cd">${k}</span><span>${NAME[k]}</span><span class="ck">${I('check','xs')}</span></button>`).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { if (side) B = m.dataset.k; else A = m.dataset.k; if (A === B){ if (side) A = Object.keys(RATE).find(x => x !== B); else B = Object.keys(RATE).find(x => x !== A); } paint(); })); }); }
  // the code rolls over to the new one while its flag changes at once
  const flag = (cur, k) => { const f = $('.ccx-fl', cur); if (f.dataset.k !== k) f.outerHTML = FL(k); };
  function paint(delay){ flag(curs[0], A); flag(curs[1], B); swap($('.cd', curs[0]), A); swap($('.cd', curs[1]), B); menus(); calc(delay); }
  a.oninput = () => { a.value = a.value.replace(/[^\d.]/g, ''); calc(); };
  a.onblur = () => { const n = parseFloat(a.value) || 0; a.value = n.toFixed(2); };
  const sw = $('.ccx-sw', r);
  sw.onclick = () => { sw.classList.toggle('go'); const n = out; [A, B] = [B, A]; a.value = (B === 'JPY' || A === 'JPY') ? (A === 'JPY' ? Math.round(n) : n.toFixed(2)) : n.toFixed(2); a.value = String(a.value); paint(); };
  paint(260);
  // the converter sits centred on its own, and glides up as a currency list opens under it, so the two sit centred together
  // instead of the list running off the stage; on closing, it waits for the list to fade before it glides back to the middle
  const box = $('.ccx', r), pops = $$('.pop', box), shown = () => pops.find(p => p.classList.contains('open'));
  const centred = centre(c, box, () => { const p = shown(); return p ? Math.max(box.offsetHeight, p.offsetTop + p.offsetHeight) : box.offsetHeight; });
  const mo = new MutationObserver(() => shown() ? centred() : c.later(REDUCE ? 0 : 180, centred));
  pops.forEach(p => mo.observe(p, { attributes:true, attributeFilter:['class'] })); c.offs.push(() => mo.disconnect());
  // once in view it converts a new amount, then swaps the two currencies. Clicking, focusing or typing in it takes over
  c.run(async () => {
    await c.step(1500);
    await c.type(a, '120', { ms:150, each:() => calc(), clear:true });
    await c.step(250); a.value = '120.00';
    await c.step(1300); sw.click();
  });
});
