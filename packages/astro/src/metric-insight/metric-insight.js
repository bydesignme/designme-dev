// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, seg, stagger, swap, tween } from '../core/core.js';
DM.def('metric-insight', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{spark\}/g, I('spark','xs'));
  const D = {
    7:{ d:[22.8,23.1,22.9,24.6,25.4,25.9,26.3], v:26.3, ch:3.5, t:'Up all week. Most of the gain came from annual plans.' },
    30:{ d:[18.2,18.5,18.1,18.9,18.4,18.7,19.0,18.6,19.2,19.1,18.8,19.4,19.0,19.3,19.1,19.6,19.2,21.8,22.9,23.4,23.1,24.0,23.6,24.4,24.1,24.9,25.2,25.6,25.9,26.3], v:26.3, ch:8.1, t:'Jumped after the pricing page update on Sep 18.' },
    90:{ d:[17.1,17.6,17.4,18.0,17.8,18.3,18.1,18.6,18.2,18.9,19.4,22.1,24.0,25.5,26.3], v:26.3, ch:9.2, t:'Flat for two months, then a clear step up in September.' }
  };
  const ch = $('.mix-ch', r), l = $('.mix-l', r), a = $('.mix-a', r), x = $('.mix-x', r), dot = $('.mix-dot', r), n = $('.mix-n', r), dl = $('.mix-d', r), mk = $('.mix-mk', r);
  let pts = [], cur = 30, val = 0, chg = 0;
  function draw(k){
    const d = D[k].d, lo = Math.min(...d) - 1, hi = Math.max(...d) + 1;
    pts = d.map((v, i) => [i / (d.length - 1) * 300, 86 - (v - lo) / (hi - lo) * 80, v]);
    const p = pts.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ');
    l.setAttribute('d', p); a.setAttribute('d', p + ' L300 90 L0 90 Z');
    // reset to the hidden state without a transition (otherwise it reverses in the same frame and never draws), then draw in
    // the stroke doesn't scale with the stretched chart, so its dashes are measured on screen: use the line's on-screen length
    const sx = ch.clientWidth / 300, sy = ch.clientHeight / 90, len = pts.reduce((t, q, i) => i ? t + Math.hypot((q[0] - pts[i - 1][0]) * sx, (q[1] - pts[i - 1][1]) * sy) : 0, 0);
    [l, a, mk].forEach(e => e.style.transition = 'none'); ch.classList.remove('in'); l.style.strokeDasharray = ''; l.style.setProperty('--dm-len', Math.ceil(len) + 2);
    void ch.offsetWidth; [l, a, mk].forEach(e => e.style.transition = ''); requestAnimationFrame(() => ch.classList.add('in'));
    mk.style.display = k == 30 ? '' : 'none';
    tween(val, D[k].v, 900, v => { val = v; n.textContent = v.toFixed(1) + '%'; });
    tween(chg, D[k].ch, 900, v => { chg = v; dl.textContent = '+' + v.toFixed(1) + ' pts'; });
    swap($('.mix-t', r), D[k].t);
  }
  c.on(ch, 'pointermove', e => { const b = ch.getBoundingClientRect(), fx = (e.clientX - b.left) / b.width * 300; let best = pts[0]; pts.forEach(q => { if (Math.abs(q[0] - fx) < Math.abs(best[0] - fx)) best = q; });
    x.setAttribute('x1', best[0]); x.setAttribute('x2', best[0]); dot.style.left = best[0] / 300 * b.width + 'px'; dot.style.top = best[1] / 90 * b.height + 'px'; n.textContent = best[2].toFixed(1) + '%'; });
  c.on(ch, 'pointerleave', () => n.textContent = D[cur].v.toFixed(1) + '%');
  // once drawn, drop the dashes so a later resize can't cut the line short
  c.on(l, 'transitionend', e => { if (e.propertyName === 'stroke-dashoffset' && ch.classList.contains('in')) l.style.strokeDasharray = 'none'; });
  seg($('.mix-rg', r), v => { cur = +v; draw(cur); });
  $('b', mk).dataset.tip = 'Pricing page update shipped';
  const why = $('.mix-why', r), box = $('.mix-box', r), rs = $('.mix-rs', r);
  // the button is as wide as its words: a new label comes in and its width eases to fit (no room kept for a longer one)
  const label = h => { const w0 = why.getBoundingClientRect().width; why.innerHTML = h; const w1 = why.getBoundingClientRect().width;
    if (!REDUCE && w0 && Math.abs(w1 - w0) > .5){ const cs = getComputedStyle(r), t = cs.getPropertyValue('--dm-t').trim(); why.animate([{ width:w0 + 'px' }, { width:w1 + 'px' }], { duration:(t.endsWith('ms') ? parseFloat(t) : parseFloat(t) * 1000) || 340, easing:cs.getPropertyValue('--dm-ease').trim() || 'ease' }); } };
  why.onclick = () => c.run(async () => {
    if (!box.classList.contains('shut')){ box.classList.add('shut'); why.setAttribute('aria-expanded', 'false'); label('Why did it move?'); return; }
    // the words shimmer while the agent looks into it
    label('<span class="think on"><i></i><i></i><i></i><i></i></span><span class="shim">Looking into it</span>'); await c.wait(900);
    // the drivers, each a bar in the accent on a neutral track; what it could not explain is a grey that keeps 3:1 on the track
    const R = [['Annual plan shown first', 54], ['One CTA per card', 27], ['Seasonal traffic', 12], ['Unexplained', 7, 'var(--dm-muted)']];
    rs.innerHTML = R.map(q => `<div class="mix-r"><span class="t">${q[0]}</span><span class="bar"><i style="width:${q[1]}%${q[2] ? ';--dm-k:' + q[2] : ''}"></i></span><span class="v num">${q[1]}%</span></div>`).join('');
    box.classList.remove('shut'); why.setAttribute('aria-expanded', 'true'); stagger($$('.mix-r', rs), 60); label('Hide the breakdown');
  });
  c.later(400, () => draw(30));
});
