// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, cols, enter, html, reflow, stagger } from '../core/core.js';
DM.def('account-table', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{search}', I('search','xs'));
  const A = [
    ['Northwind','b','Enterprise',120,92,'$14,400','Expanding. Design team added 18 seats this month.'],
    ['Lumen Labs','l','Pro',14,48,'$672','Usage fell 40% after their lead designer left. Worth a check in.'],
    ['Fable & Co','m','Team',32,81,'$1,920','Steady. Asked about the Figma sync twice.'],
    ['Orbit','p','Pro',8,67,'$384','Trial of the agent ends Friday. 3 runs so far.'],
    ['Kite Health','r','Enterprise',64,88,'$7,680','Renewal in 6 weeks, champion is happy.'],
    ['Paper Plane','t','Team',21,34,'$1,260','Two failed payments. Billing contact bounced.']
  ];
  const tb = $('tbody', r), q = $('.atb-s input', r); let plan = '', open = null;
  const hc = h => h >= 80 ? 'var(--dm-atb-ok)' : h >= 60 ? 'var(--dm-atb-warn)' : 'var(--dm-atb-bad)';
  // each row is made once and kept, so a search or a plan filter can ease it between places; the note under an open row
  // is its own row, keyed after it
  const rows = new Map(A.map(a => [a[0], html(`<tr class="row" data-n="${a[0]}" tabindex="0" aria-expanded="false"><td><span class="nm"><span class="lg" style="background:var(--dm-av-${a[1]});color:var(--dm-av-${a[1]}-ink)">${a[0][0]}</span>${a[0]}</span></td><td><span class="tag ${a[2] === 'Enterprise' ? 'l' : a[2] === 'Pro' ? 'b' : 't'}">${a[2]}</span></td><td class="r num">${a[3]}</td><td><span class="hb"><i><b style="width:${a[4]}%;background:${hc(a[4])}"></b></i><span class="num">${a[4]}</span></span></td><td class="r num">${a[5]}</td></tr>`)]));
  const none = html('<tr class="atb-empty" data-n=" none"><td colspan="5"><div class="atb-em"><span class="atb-em-art" aria-hidden="true"></span><b>No accounts match</b><span>Try another name, or show every plan.</span><button class="pill soft sm">Show all accounts</button></div></td></tr>');
  $('.pill', none).onclick = () => { q.value = ''; plan = ''; pick($('.atb-fl .chip[data-p=""]', r)); paint(true); };
  let det = null;
  function note(a){
    const d = html(`<tr class="det" data-n="${a[0]} note"><td colspan="5"><div class="fold"><div><div class="atb-note">${I('spark','xs')}<span>${a[6]}</span><button class="pill soft sm">Draft email</button></div></div></div></td></tr>`);
    // pressed, it says Drafting with the loader's sweep, then Draft ready with the green tick; it is always as wide as its
    // words, easing to each new width, and never goes blank
    const dr = $('.pill', d);
    const label = h => { const w0 = dr.getBoundingClientRect().width; dr.innerHTML = h; const w1 = dr.getBoundingClientRect().width;
      if (!REDUCE && w0 && Math.abs(w1 - w0) > .5) dr.animate([{ width:w0 + 'px' }, { width:w1 + 'px' }], { duration:(parseFloat(getComputedStyle(dr).getPropertyValue('--dm-t')) || .45) * 1000, easing:getComputedStyle(dr).getPropertyValue('--dm-ease').trim() || 'ease' }); };
    dr.onclick = e => { e.stopPropagation(); if (dr.dataset.s) return; dr.dataset.s = 'busy'; label('<span class="spin"></span><span class="shim">Drafting</span>');
      c.later(900, () => { dr.dataset.s = 'done'; label(`<span class="atb-done">${I('check','xs')}</span>Draft ready`); }); };
    return d;
  }
  // the rows that match, in order, with the open row's note under it
  function paint(anim){
    const s = q.value.trim().toLowerCase(), L = A.filter(a => (!plan || a[2] === plan) && (!s || a[0].toLowerCase().includes(s)));
    // a note still folding shut stays under its row
    const draw = () => { const keep = $$('tr.det.going', tb); tb.replaceChildren(...(L.length ? L.flatMap(a => [rows.get(a[0]), ...(det && open === a[0] ? [det] : [])]) : [none]));
      keep.forEach(x => { if (x._row.isConnected) x._row.after(x); }); };
    if (anim) reflow(() => $$('tr[data-n]', tb), draw, { by:'data-n', root:$('.atb', r) }); else draw();
    rows.forEach((tr, n) => tr.classList.toggle('open', n === open));
  }
  // a row opens its note by its height, and the rows under it ease down; another row, or the same one again, folds it shut
  function toggle(n){
    if (det){ const d = det, f = $('.fold', d); d.classList.add('going'); d.removeAttribute('data-n'); f.classList.add('shut'); setTimeout(() => d.remove(), REDUCE ? 0 : (parseFloat(getComputedStyle(r).getPropertyValue('--dm-t')) || .45) * 1000); det = null; }
    open = open === n ? null : n;
    if (open){ det = note(A.find(a => a[0] === open)); det._row = rows.get(open); const f = $('.fold', det); f.classList.add('shut'); rows.get(open).after(det); void f.offsetHeight; f.classList.remove('shut'); enter($('.atb-note', det)); }
    rows.forEach((tr, k) => { tr.classList.toggle('open', k === open); tr.setAttribute('aria-expanded', k === open); });
  }
  // a row opens with a click, or with Enter or Space once it has the focus
  rows.forEach((tr, n) => { tr.onclick = () => toggle(n); tr.onkeydown = e => { if ((e.key === 'Enter' || e.key === ' ') && e.target === tr){ e.preventDefault(); toggle(n); } }; });
  q.oninput = () => paint(true);
  const pick = ch => $$('.atb-fl .chip', r).forEach(x => { x.classList.toggle('on', x === ch); x.setAttribute('aria-pressed', x === ch); });
  $$('.atb-fl .chip', r).forEach(ch => ch.onclick = () => { pick(ch); plan = ch.dataset.p; paint(true); });
  paint(); stagger([...rows.values()], 35);
  // the columns resize and move as in a spreadsheet (owner, 10 and 21 Nov); Account stays first, and every other header takes
  // the keyboard's focus, so Alt and an arrow move it
  $$('thead th', r).forEach((th, i) => { if (i) th.tabIndex = 0; });
  c.offs.push(cols($('table', r), { move:[1, 2, 3, 4], min:{ 0:150, 1:96, 2:72, 3:112, 4:88 } }));
  // the rows come in once: a row a search or a filter puts back glides to its place and never plays its entrance again (in
  // Clean and Blueprint the entrance runs under its own name, which enter() doesn't clear)
  rows.forEach(tr => { const done = e => { if (e.target !== tr) return; tr.classList.remove('enter'); tr.removeEventListener('animationend', done); }; tr.addEventListener('animationend', done); });
  // the preview opens one account's note on its own, unless you take over first
  c.auto(1200, () => { if (!open) toggle('Lumen Labs'); });
});
