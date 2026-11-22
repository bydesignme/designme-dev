// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, REDUCE, stagger, tween } from '../core/core.js';
DM.def('donut-chart', (r, c) => {
  // the week's agent hours by kind of task, out of a 40-hour budget
  const D = [['Design reviews', 14.2, 'var(--dm-c1)'], ['Code changes', 9.6, 'var(--dm-c2)'], ['Research', 6.1, 'var(--dm-c3)'], ['Copy edits', 5.1, 'var(--dm-c4)']], MAX = 40, OF = 'of 40h this week';
  const tot = D.reduce((a, d) => a + d[1], 0);
  const svg = $('.dnx-svg', r), lg = $('.dnx-lg', r), g = $('.dnx-g', r), v = $('.dnx-v', r), l = $('.dnx-l', r), uid = 'dnx' + Math.random().toString(36).slice(2, 8);
  /* the half ring: centred on the middle of its base, the parts 4px apart. Its thickness and corner radius are the style's
     (--dnx-th, --dnx-cr: 18px and 4px, Clean 14px and 5px), read when it draws */
  const CX = 110, CY = 110, RO = 104, GAP = 4;
  let RI = 86, CR = 4;
  const geo = () => { const cs = getComputedStyle(svg); RI = RO - (parseFloat(cs.getPropertyValue('--dm-dnx-th')) || 18); CR = parseFloat(cs.getPropertyValue('--dm-dnx-cr')) || 4; };
  const P = (rho, a) => `${(CX + rho * Math.cos(a)).toFixed(2)} ${(CY - rho * Math.sin(a)).toFixed(2)}`;
  /* one part, from f0 to f1 of the sweep (left to right over the top). The corners are rounded by a stroke of their radius drawn
     round the part's shape inset by that radius, so the outline is the part's own and only its corners turn (Blueprint joins
     the stroke square, which gives the square part). gs and ge are the room left at each end: half the gap where it meets
     another part, nothing at the ring's own ends */
  const part = (f0, f1, gs, ge) => {
    const ts = Math.PI * (1 - f0), te = Math.PI * (1 - f1), ro = RO - CR, ri = RI + CR;
    let os = ts - Math.asin((gs + CR) / ro), oe = te + Math.asin((ge + CR) / ro), is = ts - Math.asin((gs + CR) / ri), ie = te + Math.asin((ge + CR) / ri);
    if (os < oe) os = oe = (os + oe) / 2;
    if (is < ie) is = ie = (is + ie) / 2;
    return `M${P(ro, os)}A${ro} ${ro} 0 0 1 ${P(ro, oe)}L${P(ri, ie)}A${ri} ${ri} 0 0 0 ${P(ri, is)}Z`;
  };
  const cum = []; let acc = 0; D.forEach(d => { cum.push([acc / MAX, (acc + d[1]) / MAX]); acc += d[1]; });
  /* Clean's inner shadow for the track (Clean's CSS turns it on through --dnx-in): a 1px ring just inside the edge and a soft
     shade from the top, each the track's own shape cut out of a blurred or shrunk copy of it */
  svg.style.setProperty('--dm-dnx-in', `url(#${uid}-in)`);
  svg.innerHTML = `<defs><filter id="${uid}-in" filterUnits="userSpaceOnUse" x="-4" y="-4" width="228" height="118" color-interpolation-filters="sRGB">`
    + `<feOffset in="SourceAlpha" dy="1" result="o"/><feGaussianBlur in="o" stdDeviation="1.5" result="b"/><feComposite in="SourceAlpha" in2="b" operator="out" result="e"/>`
    + `<feFlood class="dnx-in-s"/><feComposite in2="e" operator="in" result="s"/>`
    + `<feMorphology in="SourceAlpha" operator="erode" radius="1" result="k"/><feComposite in="SourceAlpha" in2="k" operator="out" result="q"/>`
    + `<feFlood class="dnx-in-r"/><feComposite in2="q" operator="in" result="r"/>`
    + `<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="s"/><feMergeNode in="r"/></feMerge></filter></defs>`
    + D.map((d, i) => `<path data-i="${i}" style="fill:${d[2]};stroke:${d[2]}"/>`).join('') + `<path class="tr"/>`;
  const arcs = $$('path[data-i]', svg), track = $('.tr', svg);
  // the parts sweep in to the front f, and the track fills what is left after it
  const draw = f => {
    geo();
    cum.forEach(([a, b], i) => { const e = Math.min(b, f); arcs[i].setAttribute('d', e > a + .004 ? part(a, e, a ? GAP / 2 : 0, e < 1 ? GAP / 2 : 0) : ''); });
    const end = Math.min(f, tot / MAX); track.setAttribute('d', end < .996 ? part(end, 1, end ? GAP / 2 : 0, 0) : '');
  };
  lg.innerHTML = `<i class="dnx-hv" aria-hidden="true"></i>` + D.map((d, i) => `<button type="button" class="dnx-r" data-i="${i}" aria-pressed="false"><i style="background:${d[2]}"></i><span class="t">${d[0]}</span><span class="v num">${d[1]}h</span></button>`).join('');
  lg.classList.add('gl');
  const rows = $$('.dnx-r', lg), hv = $('.dnx-hv', lg);
  /* what the middle shows: the part pointed at or focused, else the selected one, else the total. Clean's hover is one fill
     under the rows that glides to the row in question, appearing where it is the first time rather than sliding in */
  let hov = null, sel = null, swept = false, hvOn = false;
  const glide = i => {
    if (i == null){ hv.style.opacity = '0'; hvOn = false; return; }
    const y = rows[i].offsetTop, h = rows[i].offsetHeight;
    if (!hvOn){ hv.style.transition = 'none'; hv.style.transform = `translateY(${y}px)`; hv.style.height = h + 'px'; void hv.offsetWidth; hv.style.transition = ''; }
    else { hv.style.transform = `translateY(${y}px)`; hv.style.height = h + 'px'; }
    hv.style.opacity = '1'; hvOn = true;
  };
  const show = () => { const i = hov ?? sel; g.classList.toggle('hov', i != null);
    arcs.forEach((a, j) => a.classList.toggle('hl', j === i)); rows.forEach((x, j) => { x.classList.toggle('hl', j === i); x.classList.toggle('sel', j === sel); x.setAttribute('aria-pressed', String(j === sel)); });
    glide(hov);
    if (!swept) return;
    if (i == null){ v.textContent = tot.toFixed(1) + 'h'; l.textContent = OF; } else { v.textContent = D[i][1] + 'h'; l.textContent = D[i][0]; } };
  const pick = i => { sel = sel === i ? null : i; show(); };
  arcs.forEach(el => { el.onmouseenter = () => { hov = +el.dataset.i; show(); }; el.onmouseleave = () => { hov = null; show(); }; el.onclick = () => pick(+el.dataset.i); });
  // on the legend the pointer moving from row to row keeps the hover (the gap between rows included); it goes when it leaves
  rows.forEach(el => { el.onmouseenter = () => { hov = +el.dataset.i; show(); }; el.onclick = () => pick(+el.dataset.i);
    el.onfocus = () => { hov = +el.dataset.i; show(); }; el.onblur = e => { if (!rows.includes(e.relatedTarget)){ hov = null; show(); } };
    el.onkeydown = e => { if (e.key === 'Escape' && sel != null){ sel = null; show(); } }; });
  lg.onmouseleave = () => { const f = document.activeElement; if (!(lg.contains(f) && f.matches(':focus-visible'))){ hov = null; show(); } };
  stagger(rows, 60, 150);
  v.textContent = '0.0h'; l.textContent = OF; draw(0);
  // the parts sweep in once the gauge has risen into view, and the total counts up with them (a part pointed at meanwhile is
  // named in the middle once the count is done)
  c.later(260, () => tween(0, tot / MAX, REDUCE ? 1 : 1200, (f, p) => { draw(f); if (p >= 1){ swept = true; show(); } else v.textContent = (Math.min(f, tot / MAX) * MAX).toFixed(1) + 'h'; }, t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2));
});
