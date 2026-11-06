// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, seg, swap } from '../core/core.js';
DM.def('activity-heatmap', (r, c) => {
  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const grid = $('.hmx-grid', r), st = $('.hmx-st', r);
  const gen = (who) => { const a = []; for (let d = 0; d < 7; d++) for (let h = 0; h < 24; h++){
    let v = who === 'agent' ? (h >= 1 && h <= 5 ? .75 : h >= 9 && h <= 18 ? .45 : .15) : (h >= 9 && h <= 18 ? .65 : h >= 19 && h <= 22 ? .2 : .03);
    if (d >= 5) v *= who === 'agent' ? .8 : .2; if (who === 'agent' && d === 0 && h === 9) v = 1;
    v = Math.max(0, Math.min(1, v + (Math.sin(d * 7.1 + h * 3.3) * .18))); a.push(v); } return a; };
  const D = { agent:gen('agent'), team:gen('team') };
  grid.innerHTML = Array.from({ length:168 }, () => '<i style="--dm-a:0"></i>').join('');
  const cells = $$('i', grid);
  function draw(w){ cells.forEach((el, i) => { const d = Math.floor(i / 24), h = i % 24, v = D[w][i]; c.later((h + d) * 14, () => el.style.setProperty('--dm-a', (v * .9).toFixed(2)));
    const hr = (h % 12 || 12) + (h < 12 ? 'am' : 'pm'); el.dataset.tip = `${DAYS[d]} ${hr}: ${Math.round(v * (w === 'agent' ? 40 : 25))} ${w === 'agent' ? 'runs' : 'edits'}`; });
    swap(st, w === 'agent' ? 'Busiest overnight, when the queue runs' : 'Busiest 10am to 4pm on weekdays'); }
  seg($('.hmx-sg', r), draw);
  c.later(240, () => draw('agent'));
  // on a phone the grid scrolls sideways: it starts at the latest hours, and fades out on whichever side has more to see
  const sc = $('.hmx-sc', r);
  const edges = () => { const m = sc.scrollWidth - sc.clientWidth; sc.classList.toggle('ml', m > 1 && sc.scrollLeft > 1); sc.classList.toggle('mr', m > 1 && sc.scrollLeft < m - 1); };
  // it stays on the latest hours as the card settles its size, until the person scrolls it themselves
  let moved = false;
  const fit = () => { if (!moved) sc.scrollLeft = sc.scrollWidth; edges(); };
  c.on(sc, 'scroll', edges, { passive:true });
  ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(e => c.on(sc, e, () => { moved = true; }, { passive:true }));
  const ro = new ResizeObserver(fit); ro.observe(sc); ro.observe(grid); c.offs.push(() => ro.disconnect());
});
