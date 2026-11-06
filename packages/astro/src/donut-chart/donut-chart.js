// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, stagger, tween } from '../core/core.js';
DM.def('donut-chart', (r, c) => {
  const D = [['Design reviews',14.2,'var(--dm-c1)'],['Code changes',9.6,'var(--dm-c2)'],['Research',6.1,'var(--dm-c3)'],['Copy edits',3.4,'var(--dm-c4)'],['Other',1.7,'var(--dm-faint)']];
  const tot = D.reduce((a, d) => a + d[1], 0), C = 2 * Math.PI * 48, gap = 2;
  const svg = $('svg', r), lg = $('.dnx-lg', r), ring = $('.dnx-ring', r), v = $('.dnx-v', r), l = $('.dnx-l', r);
  let off = 0;
  svg.innerHTML = D.map((d, i) => { const len = d[1] / tot * C; const s = `<circle cx="60" cy="60" r="48" stroke="${d[2]}" stroke-dasharray="0 ${C}" stroke-dashoffset="${-off}" data-i="${i}" data-len="${len - gap}"/>`; off += len; return s; }).join('');
  lg.innerHTML = D.map((d, i) => `<div class="dnx-r" data-i="${i}"><i style="background:${d[2]}"></i><span class="t">${d[0]}</span><span class="v num">${d[1]}h · ${Math.round(d[1] / tot * 100)}%</span></div>`).join('');
  const arcs = $$('circle', svg), rows = $$('.dnx-r', lg);
  const hl = i => { ring.classList.toggle('hov', i != null); arcs.forEach((a, j) => a.classList.toggle('hl', j === i)); rows.forEach((x, j) => x.classList.toggle('hl', j === i));
    if (i == null){ v.textContent = tot.toFixed(1) + 'h'; l.textContent = 'Agent time'; } else { v.textContent = D[i][1] + 'h'; l.textContent = D[i][0]; } };
  [...arcs, ...rows].forEach(el => { el.onmouseenter = () => hl(+el.dataset.i); el.onmouseleave = () => hl(null); });
  stagger(rows, 60, 150);
  v.textContent = '0.0h';
  c.later(260, () => { arcs.forEach((a, i) => c.later(i * 90, () => a.setAttribute('stroke-dasharray', `${a.dataset.len} ${C}`))); tween(0, tot, 1200, n => v.textContent = n.toFixed(1) + 'h'); });
});
