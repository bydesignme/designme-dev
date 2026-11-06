// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, swap, tween } from '../core/core.js';
DM.def('radar-chart', (r, c) => {
  // six eval scores out of 100: this run against the baseline it is compared with
  const A = [['Accuracy', 88, 84], ['Instruction following', 86, 80], ['Tool use', 62, 78], ['Speed', 74, 66], ['Cost efficiency', 82, 58], ['Safety', 91, 90]];
  const WEAK = 70, N = A.length;
  const ch = $('.rdx-ch', r), svg = $('.rdx-svg', r), avg = $('.rdx-avg b', r), ro = $('.rdx-ro span', r), keys = $$('.rdx-k', r);
  const mean = k => Math.round(A.reduce((t, a) => t + a[k], 0) / N);
  ch.insertAdjacentHTML('beforeend', A.map((a, i) => `<button class="rdx-ax" data-i="${i}" tabindex="${i ? -1 : 0}" aria-label="${a[0]}: ${a[1]}, baseline ${a[2]}, ${a[1] >= a[2] ? 'up' : 'down'} ${Math.abs(a[1] - a[2])}${a[1] < WEAK ? ', weak' : ''}"><span class="n">${a[0]}</span><span class="v num"><b>${a[1]}</b><span>${a[1] >= a[2] ? '+' : '−'}${Math.abs(a[1] - a[2])}</span>${a[1] < WEAK ? '<span class="tag warn">Weak</span>' : ''}</span></button>`).join(''));
  const L = $$('.rdx-ax', ch);
  let grow = 0, drawn = 0, on = { cur:true, base:true }, hot = -1, G = null;
  // the geometry follows the chart's size, so the labels always sit outside the rings
  // on a narrow card the long names shorten, and the rings take whatever room the side labels leave
  const SHORT = ['Accuracy', 'Instructions', 'Tool use', 'Speed', 'Cost', 'Safety'];
  function geo(){ const W = ch.clientWidth, H = ch.clientHeight, narrow = W < 380;
    L.forEach((l, i) => { const t = narrow ? SHORT[i] : A[i][0], n = $('.n', l); if (n.textContent !== t) n.textContent = t; });
    const side = Math.max(...L.filter((l, i) => Math.abs(Math.cos(ang(i))) >= .2).map(l => l.offsetWidth));
    const R = Math.max(40, Math.min(H / 2 - 46, W / 2 - side - 14)); return { W, H, cx:W / 2, cy:H / 2, R }; }
  const ang = i => -Math.PI / 2 + i * 2 * Math.PI / N;
  const pt = (g, i, v) => [g.cx + Math.cos(ang(i)) * g.R * v / 100, g.cy + Math.sin(ang(i)) * g.R * v / 100];
  const poly = (g, k, s = 1) => A.map((a, i) => pt(g, i, a[k] * s).map(n => n.toFixed(1)).join(',')).join(' ');
  function draw(){
    G = geo(); const g = G; svg.setAttribute('viewBox', `0 0 ${g.W} ${g.H}`);
    svg.innerHTML = [25, 50, 75, 100].map(v => `<polygon class="ring${v === 100 ? ' out' : ''}" points="${A.map((a, i) => pt(g, i, v).join(',')).join(' ')}"/>`).join('')
      + A.map((a, i) => { const [x, y] = pt(g, i, 100); return `<line class="sp" x1="${g.cx}" y1="${g.cy}" x2="${x}" y2="${y}"/>`; }).join('')
      + `<polygon class="base${on.base ? '' : ' off'}" pathLength="100" style="stroke-dasharray:${drawn} 100" points="${poly(g, 2)}"/>`
      + `<polygon class="cur${on.cur ? '' : ' off'}" points="${poly(g, 1, grow)}"/>`
      + A.map((a, i) => { const [bx, by] = pt(g, i, a[2]), [x, y] = pt(g, i, a[1] * grow); return `<circle class="pt b${on.base && drawn >= 100 ? '' : ' off'}" r="2.5" cx="${bx}" cy="${by}"/><circle class="pt c${on.cur && grow > .98 ? '' : ' off'}${i === hot ? ' on' : ''}" r="3" cx="${x}" cy="${y}"/>`; }).join('');
    $$('.sp', svg).forEach((s, i) => s.classList.toggle('on', i === hot));
    L.forEach((l, i) => { const a = ang(i), x = g.cx + Math.cos(a) * (g.R + 12), y = g.cy + Math.sin(a) * (g.R + 12), cs = Math.cos(a), sn = Math.sin(a);
      const side = Math.abs(cs) < .2 ? 'm' : cs < 0 ? 'l' : 'r'; l.classList.remove('l', 'm', 'r'); l.classList.add(side);
      const w = l.offsetWidth, h = l.offsetHeight;
      l.style.left = (side === 'm' ? x - w / 2 : side === 'l' ? x - w : x) + 'px'; l.style.top = (Math.abs(sn) > .9 ? (sn < 0 ? y - h : y) : y - h / 2) + 'px'; });
  }
  const ro2 = new ResizeObserver(draw); ro2.observe(ch); c.offs.push(() => ro2.disconnect());
  // the line under the chart: the axis in hand with both scores and the change, or else the agent's note
  let note = `${I('spark','xs')}<span>Run 48 averages <b>${mean(1)}</b>, up ${mean(1) - mean(2)} on the baseline.</span>`;
  const show = i => { hot = i; L.forEach((l, j) => l.classList.toggle('on', j === i)); draw();
    if (i < 0){ swap(ro, note, true); return; }
    const [n, a, b] = A[i], d = a - b; swap(ro, `<span><b>${n}</b> ${a} now, ${b} before, <span class="${d < 0 ? 'dn' : 'up'}">${d < 0 ? '−' : '+'}${Math.abs(d)}</span>${a < WEAK ? ', below 70' : ''}</span>`, true); };
  L.forEach((l, i) => { c.on(l, 'pointerenter', e => { if (e.pointerType !== 'touch') show(i); }); c.on(l, 'focus', () => show(i)); c.on(l, 'click', () => show(i)); });
  c.on(ch, 'pointerleave', () => { if (!ch.contains(document.activeElement)) show(-1); });
  c.on(ch, 'focusout', e => { if (!ch.contains(e.relatedTarget)) show(-1); });
  // roving focus: one axis takes Tab, Left and Right (and Up and Down) go round the chart, Home and End to the first and last
  c.on(ch, 'keydown', e => { const i = L.indexOf(document.activeElement); if (i < 0) return;
    const to = { ArrowRight:i + 1, ArrowDown:i + 1, ArrowLeft:i - 1, ArrowUp:i - 1, Home:0, End:N - 1 }[e.key]; if (to == null) return;
    e.preventDefault(); const j = (to + N) % N; L.forEach((l, k) => l.tabIndex = k === j ? 0 : -1); L[j].focus(); });
  // the legend shows and hides a series; one always stays
  keys.forEach(k => k.onclick = () => { const s = k.dataset.s, o = s === 'cur' ? 'base' : 'cur'; if (on[s] && !on[o]) return; on[s] = !on[s]; k.setAttribute('aria-pressed', on[s]); draw(); });
  ro.innerHTML = '<span class="muted">Drawing the baseline</span>'; avg.textContent = '0';
  // the baseline draws itself, this run grows out of the middle, then the agent says what changed and points at tool use
  c.run(async () => {
    await c.wait(300);
    await tween(0, 100, 900, v => { drawn = v; draw(); });
    await c.wait(250);
    tween(0, mean(1), 1100, v => avg.textContent = Math.round(v));
    await tween(0, 1, 1100, v => { grow = v; draw(); });
    await c.wait(500);
    note = `${I('spark','xs')}<span>Cheaper and faster, <b>weaker at tool use</b> (−16). It skipped the search tool on 7 of 40 tasks.</span>`;
    if (hot < 0) swap(ro, note, true);
    const t = L[2]; t.classList.remove('hot'); void t.offsetWidth; t.classList.add('hot');
  });
  if (r === c.st) c.story(async s => {
    await s.beat(10);
    await s.point(L[2]); show(2); await s.beat(4);
    await s.point(L[4]); show(4); await s.beat(3);
    s.away(); show(-1); await s.beat(3);
  });
});
