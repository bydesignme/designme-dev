// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, seg, tween } from '../core/core.js';
DM.def('bar-chart', (r, c) => {
  const D = {
    w:{ l:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], d:[[42,9,2],[51,12,3],[48,8,1],[63,10,4],[57,14,2],[18,3,0],[12,2,1]] },
    m:{ l:['W1','W2','W3','W4','W5','W6','W7'], d:[[180,40,9],[210,44,12],[236,51,8],[262,48,10],[251,39,6],[298,52,7],[321,47,5]] }
  };
  const ch = $('.bcx-ch', r), v = $('.bcx-v', r); let tot = 0;
  ch.innerHTML = D.w.l.map(() => `<div class="bcx-b"><div class="bcx-tt"><b class="num"></b><span></span></div><div class="bcx-st"><i></i></div><div class="bcx-l"></div></div>`).join('');
  const bars = $$('.bcx-b', ch);
  function draw(k){
    const d = D[k], mx = Math.max(...d.d.map(x => x[0] + x[1] + x[2])) * 1.08, H = ch.clientHeight - 22;
    bars.forEach((b, i) => { const x = d.d[i], s = x[0] + x[1] + x[2];
      c.later(i * 45, () => { $('.bcx-st i', b).style.height = Math.max(s ? 3 : 0, s / mx * H) + 'px'; });
      $('.bcx-l', b).textContent = d.l[i]; $('.bcx-tt b', b).textContent = s + ' runs'; $('.bcx-tt span', b).textContent = `${x[0]} shipped, ${x[1]} reviewed, ${x[2]} failed`; });
    const t = d.d.reduce((a, x) => a + x[0] + x[1] + x[2], 0); tween(tot, t, 900, n => { tot = n; v.textContent = Math.round(n).toLocaleString('en-US'); });
  }
  seg($('.bcx-rg', r), draw);
  c.later(280, () => draw('w'));
});
