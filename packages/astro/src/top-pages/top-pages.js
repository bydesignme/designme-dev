// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, seg, tween } from '../core/core.js';
DM.def('top-pages', (r, c) => {
  const P = [['/pricing','Pricing',18420,24],['/','Home',15210,3],['/components','Components',9870,41],['/docs/agent','Agent docs',6340,-8],['/blog/soft-ui','Soft UI, the post',4120,112],['/changelog','Changelog',2210,-14]];
  const list = $('.tpx-list', r), mx = P[0][2], tot = P.reduce((a, p) => a + p[2], 0), H = 50;
  list.innerHTML = P.map(p => `<div class="tpx-r" data-tip="designme.dev${p[0]}"><span class="rk"></span><span class="pg"><span class="p">${p[1]} <span class="muted">${p[0]}</span></span><span class="tr"><i></i></span></span><span class="n num">${p[2].toLocaleString('en-US')}</span><span class="tag ch num ${p[3] >= 0 ? 'ok' : 'bad'}">${p[3] >= 0 ? '+' : '−'}${Math.abs(p[3])}%</span></div>`).join('');
  const rows = $$('.tpx-r', list);
  function sort(k){
    const order = [...P].sort((a, b) => k === 'v' ? b[2] - a[2] : b[3] - a[3]);
    rows.forEach((row, i) => { const j = order.indexOf(P[i]); row.style.transform = `translateY(${j * H}px)`; $('.rk', row).textContent = j + 1; });
  }
  sort('v'); rows.forEach((row, i) => row.animate([{ opacity:0, filter:'blur(4px)' }, { opacity:1, filter:'blur(0)' }], { duration:450, delay:i * 50, easing:'ease-out', fill:'backwards' }));
  rows.forEach((row, i) => c.later(300 + i * 70, () => $('.tr i', row).style.width = P[i][2] / mx * 100 + '%'));
  $('.tpx-tot', r).textContent = '0';
  c.later(260, () => tween(0, tot, 1000, v => $('.tpx-tot', r).textContent = Math.round(v).toLocaleString('en-US')));
  seg($('.tpx-sg', r), sort);
});
