// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, html, reflow, stagger } from '../core/core.js';
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
  const rows = new Map(A.map(a => [a[0], html(`<tr class="row" data-n="${a[0]}"><td><span class="nm"><span class="lg" style="background:var(--dm-av-${a[1]});color:var(--dm-av-${a[1]}-ink)">${a[0][0]}</span>${a[0]}</span></td><td><span class="tag ${a[2] === 'Enterprise' ? 'l' : a[2] === 'Pro' ? 'b' : 't'}">${a[2]}</span></td><td class="num">${a[3]}</td><td><span class="hb"><i><b style="width:${a[4]}%;background:${hc(a[4])}"></b></i><span class="num">${a[4]}</span></span></td><td class="r num">${a[5]}</td></tr>`)]));
  const none = html('<tr class="atb-empty" data-n=" none"><td colspan="5">No accounts match</td></tr>');
  let det = null;
  function note(a){
    const d = html(`<tr class="det" data-n="${a[0]} note"><td colspan="5"><div class="fold"><div><div class="atb-note">${I('spark','xs')}<span>${a[6]}</span><button class="pill soft sm">Draft email</button></div></div></div></td></tr>`);
    const dr = $('.pill', d); dr.onclick = e => { e.stopPropagation(); dr.innerHTML = '<span class="spin"></span>'; c.later(800, () => { dr.innerHTML = I('check','xs') + 'Draft ready'; }); };
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
    rows.forEach((tr, k) => tr.classList.toggle('open', k === open));
  }
  rows.forEach((tr, n) => tr.onclick = () => toggle(n));
  q.oninput = () => paint(true);
  $$('.atb-fl .chip', r).forEach(ch => ch.onclick = () => { $$('.atb-fl .chip', r).forEach(x => x.classList.toggle('on', x === ch)); plan = ch.dataset.p; paint(true); });
  paint(); stagger([...rows.values()], 35);
  // the preview opens one account's note on its own, unless you take over first
  c.auto(1200, () => { if (!open) toggle('Lumen Labs'); });
});
