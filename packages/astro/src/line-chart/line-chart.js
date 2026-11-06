// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, tween } from '../core/core.js';
DM.def('line-chart', (r, c) => {
  const A = [820,860,910,980,1040,1130,1210,1180,1320,1460,1540,1620], B = [610,640,660,700,690,760,800,790,850,880,910,960];
  const MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const svg = $('.lnx-svg', r), ch = $('.lnx-ch', r), x = $('.lnx-x', r), tt = $('.lnx-tt', r), v = $('.lnx-v', r);
  const lo = 500, hi = 1700, P = s => s.map((d, i) => [i / 11 * 320, 136 - (d - lo) / (hi - lo) * 128]);
  const smooth = p => p.map((q, i) => { if (!i) return `M${q[0]} ${q[1]}`; const a = p[i - 1], m = (q[0] - a[0]) / 2; return `C${a[0] + m} ${a[1]} ${q[0] - m} ${q[1]} ${q[0]} ${q[1]}`; }).join(' ');
  const pa = P(A), pb = P(B);
  svg.innerHTML = `<defs><linearGradient id="lng" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--dm-accent-mark,var(--dm-accent))" stop-opacity=".16"/><stop offset="1" stop-color="var(--dm-accent-mark,var(--dm-accent))" stop-opacity="0"/></linearGradient><clipPath id="lnc"><rect class="lnr" x="0" y="-10" width="0" height="160"/></clipPath></defs>` +
    [35, 70, 105].map(y => `<line class="gl" x1="0" x2="320" y1="${y}" y2="${y}"/>`).join('') +
    `<g clip-path="url(#lnc)"><path class="ar" d="${smooth(pa)} L320 140 L0 140 Z" fill="url(#lng)"/><path class="ln l1" d="${smooth(pb)}" stroke="var(--dm-c2)" stroke-dasharray="4 4"/><path class="ln l0" d="${smooth(pa)}" stroke="var(--dm-accent-mark,var(--dm-accent))"/></g>`;
  ch.insertAdjacentHTML('beforeend', '<span class="lnx-pt on" style="color:var(--dm-accent-mark,var(--dm-accent))"></span><span class="lnx-pt on" style="color:var(--dm-c2)"></span>');
  const pts = $$('.lnx-pt', ch), on = [true, true];
  // the line draws and the number counts once the chart has risen into view, so the draw is seen from its start
  v.textContent = '0';
  c.later(260, () => {
    tween(0, 320, 1300, w => $('.lnr', svg).setAttribute('width', w), t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    tween(0, A[11], 1300, n => v.textContent = Math.round(n).toLocaleString('en-US'));
  });
  c.on(ch, 'pointermove', e => { const b = ch.getBoundingClientRect(); const i = Math.max(0, Math.min(11, Math.round((e.clientX - b.left) / b.width * 11))); const px = i / 11 * b.width;
    x.style.left = px + 'px'; tt.style.left = Math.max(50, Math.min(px, b.width - 50)) + 'px';
    [pa, pb].forEach((p, k) => { pts[k].style.left = px + 'px'; pts[k].style.top = p[i][1] / 140 * b.height + 'px'; pts[k].classList.toggle('on', on[k]); });
    $('b', tt).textContent = (on[0] ? A[i].toLocaleString('en-US') : B[i].toLocaleString('en-US')) + ' editors'; const dv = Math.round((A[i] / B[i] - 1) * 100); $('span', tt).textContent = MO[i] + (on[0] && on[1] ? ', ' + (dv < 0 ? '−' : '+') + Math.abs(dv) + '% vs last year' : '');
    v.textContent = (on[0] ? A[i] : B[i]).toLocaleString('en-US'); });
  c.on(ch, 'pointerleave', () => v.textContent = (on[0] ? A[11] : B[11]).toLocaleString('en-US'));
  $$('.lnx-k', r).forEach(k => k.onclick = () => { const s = +k.dataset.s; if (on[s] && !on[1 - s]) return; on[s] = !on[s]; k.classList.toggle('on', on[s]); $('.l' + s, svg).classList.toggle('off', !on[s]); if (s === 0) $('.ar', svg).style.opacity = on[0] ? 1 : 0;
    // the big number rolls to the latest value of the line that is showing
    const from = +v.textContent.replace(/,/g, ''), to = on[0] ? A[11] : B[11]; if (from !== to) tween(from, to, 600, n => v.textContent = Math.round(n).toLocaleString('en-US')); });
});
