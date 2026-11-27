TPLS["stat-cards"] = "<div class=\"scx\">\n  <div class=\"scx-h\"><b class=\"scx-t\">Workspace</b><div class=\"seg2 scx-sg\" role=\"group\" aria-label=\"Period\"><button aria-pressed=\"false\" data-v=\"0\">7 days</button><button aria-pressed=\"true\" data-v=\"1\">30 days</button><button aria-pressed=\"false\" data-v=\"2\">Quarter</button></div></div>\n  <div class=\"scx-grid\"></div>\n</div>";

/* ---------- Stat cards ---------- */
DM.def('stat-cards', (r, c) => {
  // icon, label, [value, change %] for each period, unit, the sparkline's shape, and whether lower is better: spend falling is
  // good news, so its chip is green when it falls and red when it rises
  const S = [
    ['spark','Agent runs',[[412,12],[1730,18],[4980,22]],'',[3,4,4,5,6,5,7,8]],
    ['users','Active editors',[[318,4],[1130,9],[1620,31]],'',[5,5,6,6,6,7,7,8]],
    ['clock','Hours saved',[[96,15],[402,21],[1180,26]],'h',[2,3,3,4,5,6,6,8]],
    ['coins','Agent spend',[[84,-6],[341,-3],[960,8]],'$',[6,5,6,5,4,4,4,3],true]
  ];
  const CMP = ['vs previous 7 days','vs previous 30 days','vs last quarter'];
  const grid = $('.scx-grid', r), uid = Math.random().toString(36).slice(2, 7); let per = 1;
  // each sparkline is its line and, under it, the area down to the axis, which Clean fills with the line's colour fading to nothing
  grid.innerHTML = S.map((s, i) => `<div class="scx-c panel"><span class="scx-k"><span class="ic">${I(s[0],'xs')}</span>${s[1]}</span><div class="scx-v"><b class="num">0</b><span class="scx-d num"></span><span class="scx-sr"></span></div><div class="scx-sp"><svg viewBox="0 0 100 30" preserveAspectRatio="none" style="color:var(--c${i + 1})"><defs><linearGradient id="scx-${uid}-${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".22"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs><path class="ar" style="fill:url(#scx-${uid}-${i})" d="M0 30 L100 30 Z"/><path class="ln" stroke="var(--c${i + 1})" d="M0 30 L100 30"/></svg></div></div>`).join('');
  const cards = $$('.scx-c', grid), cur = S.map(() => 0);
  const fmt = (s, v) => s[3] === '$' ? '$' + Math.round(v).toLocaleString('en-US') : Math.round(v).toLocaleString('en-US') + s[3];
  function draw(p){
    per = p; cards.forEach((el, i) => { const s = S[i], [val, ch] = s[2][p];
      tween(cur[i], val, 900, v => { cur[i] = v; $('b', el).textContent = fmt(s, v); });
      // the chip: green when the change is good news, red when it isn't, with a true minus sign; pointing at it says what it
      // is measured against, and screen readers hear it after the number
      const good = s[5] ? ch <= 0 : ch >= 0, txt = (ch > 0 ? '+' : ch < 0 ? '\u2212' : '') + Math.abs(ch) + '%';
      const d = $('.scx-d', el); d.className = 'tag scx-d num ' + (good ? 'ok' : 'bad') + (ch >= 0 ? ' up' : ' dn'); swap(d, txt); d.dataset.tip = CMP[p];
      $('.scx-sr', el).textContent = CMP[p];
      const pts = s[4].map((y, k) => { const yy = y + Math.sin(k * 1.7 + p * 2) * (p ? 1 : .5); return `${k === 0 ? 'M' : 'L'}${(k / 7 * 100).toFixed(1)} ${(29 - yy * 3.2).toFixed(1)}`; }).join(' ');
      $('path.ln', el).setAttribute('d', pts); $('path.ar', el).setAttribute('d', pts + ' L100 30 L0 30 Z'); });
  }
  seg($('.scx-sg', r), v => draw(+v));
  stagger(cards, 70);
  c.later(240, () => draw(1));
  if (!REDUCE) cards.forEach((el, i) => $('.scx-sp svg', el).animate([{ clipPath:'inset(-4px 100% -4px 0)' }, { clipPath:'inset(-4px 0% -4px 0)' }], { duration:1000, delay:300 + i * 70, easing:'cubic-bezier(.45,0,.2,1)', fill:'backwards' }));
});