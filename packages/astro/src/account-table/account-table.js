// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, stagger } from '../core/core.js';
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
  function paint(anim){
    const s = q.value.trim().toLowerCase(), rows = A.filter(a => (!plan || a[2] === plan) && (!s || a[0].toLowerCase().includes(s)));
    tb.innerHTML = rows.length ? rows.map(a => `<tr class="row${open === a[0] ? ' open' : ''}" data-n="${a[0]}"><td><span class="nm"><span class="lg" style="background:var(--dm-av-${a[1]});color:var(--dm-av-${a[1]}-ink)">${a[0][0]}</span>${a[0]}</span></td><td><span class="tag ${a[2] === 'Enterprise' ? 'l' : a[2] === 'Pro' ? 'b' : 't'}">${a[2]}</span></td><td class="num">${a[3]}</td><td><span class="hb"><i><b style="width:${a[4]}%;background:${hc(a[4])}"></b></i><span class="num">${a[4]}</span></span></td><td class="r num">${a[5]}</td></tr>` + (open === a[0] ? `<tr class="det"><td colspan="5"><div class="fold"><div><div class="atb-note">${I('spark','xs')}<span>${a[6]}</span><button class="pill soft sm">Draft email</button></div></div></div></td></tr>` : '')).join('') : '<tr class="atb-empty"><td colspan="5">No accounts match</td></tr>';
    if (anim) stagger($$('tr.row', tb), 35);
    $$('tr.row', tb).forEach(tr => tr.onclick = () => { open = open === tr.dataset.n ? null : tr.dataset.n; paint(); const d = $('.atb-note', tb); if (d) enter(d); });
    const dr = $('.atb-note .pill', tb); if (dr) dr.onclick = e => { e.stopPropagation(); dr.innerHTML = '<span class="spin"></span>'; c.later(800, () => { dr.innerHTML = I('check','xs') + 'Draft ready'; }); };
  }
  q.oninput = () => paint(true);
  $$('.atb-fl .chip', r).forEach(ch => ch.onclick = () => { $$('.atb-fl .chip', r).forEach(x => x.classList.toggle('on', x === ch)); plan = ch.dataset.p; paint(true); });
  paint(true);
  // the preview opens one account's note on its own, unless you take over first
  c.auto(1200, () => { if (!open){ open = 'Lumen Labs'; paint(); enter($('.atb-note', tb)); } });
});
