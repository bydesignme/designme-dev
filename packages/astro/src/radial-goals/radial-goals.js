// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, centre, seg, swap, tween } from '../core/core.js';
DM.def('radial-goals', (r, c) => {
  // each agent, what it counts, and what it did against its target this week and this month
  const A = [
    { n:'Support agent', u:'tickets', c:'var(--dm-c1)', w:[412, 375], m:[1490, 1600] },
    { n:'QA agent', u:'checks', c:'var(--dm-c3)', w:[136, 160], m:[702, 640] },
    { n:'Research agent', u:'reports', c:'var(--dm-c4)', w:[18, 24], m:[71, 96] }
  ];
  const svg = $('.rgx-ring svg', r), ring = $('.rgx-ring', r), lg = $('.rgx-lg', r), cb = $('.rgx-c b', r), cl = $('.rgx-c .muted', r), sub = $('.rgx-sub', r), tb = $('.rgx-sr tbody', r);
  // three thick rings, 14 units wide with a 4 unit gap between them, leaving room in the middle for the readout
  const RAD = [78, 60, 42];
  svg.innerHTML = A.map((a, i) => `<g data-i="${i}" style="stroke:${a.c}"><circle class="tr" cx="90" cy="90" r="${RAD[i]}"/><circle class="fl" cx="90" cy="90" r="${RAD[i]}" pathLength="100" stroke-dasharray="0 100"/><circle class="ovb" cx="90" cy="90" r="${RAD[i]}" pathLength="100" stroke-dasharray="0 100"/><circle class="ov" cx="90" cy="90" r="${RAD[i]}" pathLength="100" stroke-dasharray="0 100"/><circle class="mk" r="4" cx="${90 + RAD[i]}" cy="90"/></g>`).join('');
  lg.innerHTML = A.map((a, i) => `<div class="rgx-r" data-i="${i}" tabindex="0"><i style="background:${a.c}"></i><span class="n">${a.n}</span><span class="p num"></span><span class="v num"></span></div>`).join('');
  const G = $$('g', svg), rows = $$('.rgx-r', lg);
  let k = 'w', focus = -1, shown = 0;
  const share = a => a[k][0] / a[k][1], pc = x => Math.round(x * 100) + '%';
  const overall = () => A.reduce((t, a) => t + share(a), 0) / A.length;
  function paint(){
    A.forEach((a, i) => { const s = share(a), g = G[i];
      // (a hair short of the share: a dash that ends exactly on a quarter of the circle draws a stray notch in Chrome)
      $('.fl', g).setAttribute('stroke-dasharray', `${Math.max(0, Math.min(1, s) * 100 - .01)} 100`);
      // past the target the ring goes round again from the top, and a marker sits where it ends
      const lap = Math.max(0, s - 1) * 100, cut = Math.min(3, lap), ovb = $('.ovb', g);
      $('.ov', g).setAttribute('stroke-dasharray', `${lap} 100`);
      // under the lap's end only, a band of the surface a little wider than the ring, so the end cuts into the ring under it
      ovb.setAttribute('stroke-dasharray', `${cut} 100`); ovb.setAttribute('stroke-dashoffset', -(lap - cut)); g.classList.toggle('lap', s > 1);
      const mk = $('.mk', g), an = (s > 1 ? s - 1 : s) * 2 * Math.PI; mk.setAttribute('cx', 90 + Math.cos(an) * RAD[i]); mk.setAttribute('cy', 90 + Math.sin(an) * RAD[i]); mk.style.stroke = a.c;
      const row = rows[i]; $('.p', row).innerHTML = s >= 1 ? `<span class="tag ok">${pc(s)}</span>` : pc(s); $('.v', row).textContent = `${a[k][0].toLocaleString('en-US')} / ${a[k][1].toLocaleString('en-US')} ${a.u}`;
      row.setAttribute('aria-label', `${a.n}: ${a[k][0]} of ${a[k][1]} ${a.u}, ${pc(s)} of target`); });
    tb.innerHTML = A.map(a => `<tr><th>${a.n}</th><td>${a[k][0]} ${a.u}</td><td>${a[k][1]}</td><td>${pc(share(a))}</td></tr>`).join('');
    centre();
    const on = A.filter(a => share(a) >= 1).length; swap(sub, `${k === 'w' ? 'This week' : 'This month'}, ${on} of ${A.length} on target`);
  }
  // the middle shows the overall share, or the agent in focus
  function centre(){ const t = focus < 0 ? overall() : share(A[focus]), from = shown; shown = t; tween(from, t, 600, x => cb.textContent = pc(x)); swap(cl, focus < 0 ? 'of targets' : A[focus].n.replace(' agent', '')); }
  const hl = i => { if (focus === i) return; focus = i; ring.classList.toggle('hov', i >= 0); G.forEach((g, j) => g.classList.toggle('on', j === i)); rows.forEach((x, j) => x.classList.toggle('on', j === i)); centre(); };
  [...G, ...rows].forEach(el => { const i = +el.dataset.i; c.on(el, 'pointerenter', e => { if (e.pointerType !== 'touch') hl(i); }); c.on(el, 'pointerleave', () => { if (!lg.contains(document.activeElement)) hl(-1); }); });
  rows.forEach((x, i) => { c.on(x, 'focus', () => hl(i)); c.on(x, 'blur', () => hl(-1)); });
  seg($('.rgx-sg', r), v => { k = v; paint(); });
  cb.textContent = '0%';
  c.later(260, paint);
  // the preview's story: read the agent furthest behind, then the one past its target, see the month, then back to the week
  if (r === c.st) c.story(async s => {
    await s.beat(5);
    await s.point(rows[2]); hl(2); await s.beat(3);
    await s.point(rows[0]); hl(0); await s.beat(3);
    hl(-1); await s.tap($('.rgx-sg [data-v="m"]', r)); await s.beat(4);
    await s.tap($('.rgx-sg [data-v="w"]', r)); s.away(); await s.beat(3);
  });
});
