// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, seg, stagger, swap, tween } from '../core/core.js';
DM.def('stat-cards', (r, c) => {
  const S = [
    ['spark','Agent runs',[[412,12],[1730,18],[4980,22]],'',[3,4,4,5,6,5,7,8]],
    ['users','Active editors',[[318,4],[1130,9],[1620,31]],'',[5,5,6,6,6,7,7,8]],
    ['clock','Hours saved',[[96,15],[402,21],[1180,26]],'h',[2,3,3,4,5,6,6,8]],
    ['coins','Agent spend',[[84,-6],[341,-3],[960,8]],'$',[6,5,6,5,4,4,4,3]]
  ];
  const grid = $('.scx-grid', r); let per = 1;
  grid.innerHTML = S.map((s, i) => `<div class="scx-c panel"><span class="scx-k"><span class="ic">${I(s[0],'xs')}</span>${s[1]}</span><div class="scx-v"><b class="num">0</b><span class="scx-d num"></span></div><div class="scx-sp"><svg viewBox="0 0 100 30" preserveAspectRatio="none"><path stroke="var(--dm-c${i + 1})" d="M0 30 L100 30"/></svg></div></div>`).join('');
  const cards = $$('.scx-c', grid), cur = S.map(() => 0);
  const fmt = (s, v) => s[3] === '$' ? '$' + Math.round(v).toLocaleString('en-US') : Math.round(v).toLocaleString('en-US') + s[3];
  function draw(p){
    per = p; cards.forEach((el, i) => { const s = S[i], [val, ch] = s[2][p];
      tween(cur[i], val, 900, v => { cur[i] = v; $('b', el).textContent = fmt(s, v); });
      const d = $('.scx-d', el); d.className = 'tag scx-d num ' + (ch >= 0 ? 'ok up' : 'bad dn'); swap(d, (ch >= 0 ? '+' : '') + ch + '%');
      const pts = s[4].map((y, k) => { const yy = y + Math.sin(k * 1.7 + p * 2) * (p ? 1 : .5); return `${k === 0 ? 'M' : 'L'}${(k / 7 * 100).toFixed(1)} ${(29 - yy * 3.2).toFixed(1)}`; }).join(' ');
      $('path', el).setAttribute('d', pts); el.dataset.tip = ['vs previous 7 days','vs previous 30 days','vs last quarter'][p]; });
  }
  seg($('.scx-sg', r), v => draw(+v));
  stagger(cards, 70);
  c.later(240, () => draw(1));
  if (!REDUCE) cards.forEach((el, i) => $('.scx-sp svg', el).animate([{ clipPath:'inset(-4px 100% -4px 0)' }, { clipPath:'inset(-4px 0% -4px 0)' }], { duration:1000, delay:300 + i * 70, easing:'cubic-bezier(.45,0,.2,1)', fill:'backwards' }));
});
