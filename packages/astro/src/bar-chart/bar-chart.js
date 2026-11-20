// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, seg, tween } from '../core/core.js';
DM.def('bar-chart', (r, c) => {
  const D = {
    w:{ l:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], d:[[42,9,2],[51,12,3],[48,8,1],[63,10,4],[57,14,2],[18,3,0],[12,2,1]] },
    m:{ l:['W1','W2','W3','W4','W5','W6','W7'], d:[[180,40,9],[210,44,12],[236,51,8],[262,48,10],[251,39,6],[298,52,7],[321,47,5]] }
  };
  const ch = $('.bcx-ch', r), v = $('.bcx-v', r); let tot = 0;
  ch.innerHTML = D.w.l.map(() => `<div class="bcx-b"><div class="bcx-tt"></div><div class="bcx-st"><i></i></div><div class="bcx-l"></div></div>`).join('');
  const bars = $$('.bcx-b', ch);
  function draw(k){
    const d = D[k], mx = Math.max(...d.d.map(x => x[0] + x[1] + x[2])) * 1.08, H = ch.clientHeight - 22;
    bars.forEach((b, i) => { const x = d.d[i], s = x[0] + x[1] + x[2];
      c.later(i * 45, () => { $('.bcx-st i', b).style.height = Math.max(s ? 3 : 0, s / mx * H) + 'px'; });
      $('.bcx-l', b).textContent = d.l[i];
      // the readout: the bar's total, then each part on a line of its own, so it stays narrow enough to sit beside its bar
      $('.bcx-tt', b).innerHTML = `<b class="num">${s} runs</b><span class="num">${x[0]} shipped</span><span class="num">${x[1]} reviewed</span><span class="num">${x[2]} failed</span>`; });
    const t = d.d.reduce((a, x) => a + x[0] + x[1] + x[2], 0); tween(tot, t, 900, n => { tot = n; v.textContent = Math.round(n).toLocaleString('en-US'); });
  }
  // a bar's readout sits beside it, level with its top: on its right while it fits there, then on its left, and always inside
  // the chart (on a narrow one it may cover part of its own bar), over the bars and clear of the labels under them
  const place = b => { const tt = $('.bcx-tt', b), st = $('.bcx-st', b), H = ch.clientHeight, w = tt.offsetWidth, h = tt.offsetHeight, bl = b.offsetLeft, bw = b.offsetWidth, base = H - st.offsetTop - st.offsetHeight;
    tt.style.bottom = Math.max(base, Math.min(H - h, base + st.offsetHeight - h)) + 'px'; tt.style.left = Math.max(-bl, Math.min(ch.clientWidth - bl - w, bl + bw + 6 + w <= ch.clientWidth ? bw + 6 : -w - 6)) + 'px'; };
  // it follows its bar while the bar grows or the range changes under the pointer
  let hot = null;
  const follow = () => { if (!hot || c.dead) return; place(hot); requestAnimationFrame(follow); };
  bars.forEach(b => { c.on(b, 'pointerenter', () => { const was = hot; hot = b; if (!was) follow(); }); c.on(b, 'pointerleave', () => { if (hot === b) hot = null; }); });
  seg($('.bcx-rg', r), draw);
  c.later(280, () => draw('w'));
});
