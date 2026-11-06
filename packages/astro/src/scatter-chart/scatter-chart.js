// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, swap, tween } from '../core/core.js';
DM.def('scatter-chart', (r, c) => {
  // the week's runs: cost per run in dollars, eval score in %, thousands of tokens, and the model. A few long tool loops cost a lot
  // for a middling score
  const M = [['Opus', 'var(--dm-c1)', 'c'], ['Sonnet', 'var(--dm-c2)', 's'], ['Haiku', 'var(--dm-c3)', 't']];
  const rnd = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const R = [];
  for (let i = 0; i < 15; i++) R.push({ m:0, x:.3 + rnd(i, 1) * .22, y:85 + rnd(i, 2) * 12, t:28 + rnd(i, 3) * 30 });
  for (let i = 0; i < 18; i++) R.push({ m:1, x:.06 + rnd(i, 4) * .22, y:79 + rnd(i, 5) * 16, t:12 + rnd(i, 6) * 18 });
  for (let i = 0; i < 12; i++) R.push({ m:2, x:.02 + rnd(i, 7) * .08, y:64 + rnd(i, 8) * 20, t:5 + rnd(i, 9) * 8 });
  R.push({ m:0, x:.57, y:73, t:61, out:1 }, { m:0, x:.54, y:70, t:58, out:1 }, { m:1, x:.47, y:71, t:44, out:1 });
  R.forEach((p, i) => { p.id = 12 + i; p.x = Math.round(p.x * 100) / 100; p.y = Math.round(p.y); p.t = Math.round(p.t); });
  const pl = $('.cvq-pl', r), svg = $('.cvq-svg', r), tt = $('.cvq-tt', r), msg = $('.cvq-msg', r), ft = $('.cvq-ft', r), lg = $('.cvq-lg', r);
  const shape = (k, x, y, s) => k === 'c' ? `<circle cx="${x}" cy="${y}" r="${s}"/>` : k === 's' ? `<rect x="${x - s * .9}" y="${y - s * .9}" width="${s * 1.8}" height="${s * 1.8}" rx="${s * .25}"/>` : `<path d="M${x} ${y - s * 1.15}L${x + s * 1.05} ${y + s * .75}L${x - s * 1.05} ${y + s * .75}Z"/>`;
  lg.innerHTML = M.map((m, i) => `<button class="cvq-k" aria-pressed="true" data-m="${i}"><svg viewBox="-6 -6 12 12" style="fill:${m[1]}">${shape(m[2], 0, 0, 4.5)}</svg>${m[0]}</button>`).join('');
  const show = [true, true, true];
  let G = null, hot = -1, sel = null, box = null, rings = false, seen = 0, focusI = -1;
  const X0 = 0, X1 = .6, Y0 = 60, Y1 = 100;
  const med = a => { const s = [...a].sort((p, q) => p - q), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  // narrow charts (phones) drop the quadrant names and keep three ticks a side, so the runs have the room
  function geo(){ const W = pl.clientWidth, H = pl.clientHeight, n = W <= 340, l = n ? 38 : 44, b = 40, t = 6, rr = 8; return { W, H, n, l, b, t, rr, x:v => l + (v - X0) / (X1 - X0) * (W - l - rr), y:v => t + (1 - (v - Y0) / (Y1 - Y0)) * (H - t - b), vx:px => X0 + (px - l) / (W - l - rr) * (X1 - X0), vy:py => Y0 + (1 - (py - t) / (H - t - b)) * (Y1 - Y0) }; }
  const size = p => (3 + (p.t - 5) / 56 * 4.5) * (G && G.n ? .85 : 1);
  const vis = () => R.filter(p => show[p.m]);
  function draw(){
    const g = G = geo(), v = vis(), mx = med(v.map(p => p.x)), my = med(v.map(p => p.y));
    let s = '';
    // a few light gridlines and quiet tick labels; the axis titles sit well clear of the ticks
    [60, 80, 100].forEach(y => { s += `<line class="gl" x1="${g.l}" x2="${g.W - g.rr}" y1="${g.y(y)}" y2="${g.y(y)}"/><text x="${g.l - 6}" y="${g.y(y) + 3.5}" text-anchor="end">${y}</text>`; });
    const xt = g.n ? [0, .3, .6] : [0, .2, .4, .6];
    xt.forEach(x => { s += `<text x="${g.x(x)}" y="${g.H - g.b + 15}" text-anchor="${x === 0 ? 'start' : x === .6 ? 'end' : 'middle'}">$${x.toFixed(2)}</text>`; });
    s += `<line class="ax" x1="${g.l}" x2="${g.W - g.rr}" y1="${g.H - g.b}" y2="${g.H - g.b}"/>`;
    s += `<text class="at" x="${g.W - g.rr}" y="${g.H - 1}" text-anchor="end">Cost per run (USD)</text><text class="at" x="${-g.t}" y="9" transform="rotate(-90)" text-anchor="end">Eval score (%)</text>`;
    // the medians split it into four quadrants, each named in its corner (on a phone the lines stay and the names go)
    s += `<line class="md" x1="${g.x(mx)}" x2="${g.x(mx)}" y1="${g.t}" y2="${g.H - g.b}"/><line class="md" x1="${g.l}" x2="${g.W - g.rr}" y1="${g.y(my)}" y2="${g.y(my)}"/>`;
    if (!g.n) s += `<text class="q" x="${g.l + 6}" y="${g.t + 11}">Cheap, good</text><text class="q" x="${g.W - g.rr - 4}" y="${g.t + 11}" text-anchor="end">Costly, good</text><text class="q" x="${g.l + 6}" y="${g.H - g.b - 6}">Cheap, weaker</text><text class="q" x="${g.W - g.rr - 4}" y="${g.H - g.b - 6}" text-anchor="end">Costly, weaker</text>`;
    R.forEach((p, i) => { const m = M[p.m], cl = ['d', !show[p.m] || i >= seen ? 'off' : '', hot >= 0 && R[hot].m !== p.m && show[p.m] ? 'dim' : '', i === hot ? 'on' : '', sel && sel.includes(i) ? 'sel' : ''].filter(Boolean).join(' ');
      s += `<g class="${cl}" style="fill:${m[1]}">${shape(m[2], +g.x(p.x).toFixed(1), +g.y(p.y).toFixed(1), +size(p).toFixed(1))}</g>`; });
    if (rings) R.forEach(p => { if (p.out && show[p.m]) s += `<circle class="ring" cx="${g.x(p.x)}" cy="${g.y(p.y)}" r="${size(p) + 6}"/>`; });
    if (box) s += `<rect class="box" x="${Math.min(box[0], box[2])}" y="${Math.min(box[1], box[3])}" width="${Math.abs(box[2] - box[0])}" height="${Math.abs(box[3] - box[1])}" rx="3"/>`;
    svg.setAttribute('viewBox', `0 0 ${g.W} ${g.H}`); svg.innerHTML = s;
    // the tooltip sits over the dot in hand
    if (hot >= 0){ const p = R[hot], x = g.x(p.x), y = g.y(p.y) - size(p); $('b', tt).textContent = `$${p.x.toFixed(2)} · ${p.y}%`; $('span', tt).textContent = `Run ${p.id}, ${M[p.m][0]}, ${p.t}k tokens`;
      tt.classList.add('on'); const w = tt.offsetWidth; tt.style.left = Math.max(w / 2, Math.min(g.W - w / 2, x)) + 'px'; tt.style.top = y + 'px'; }
    else tt.classList.remove('on');
  }
  const ro = new ResizeObserver(draw); ro.observe(pl); c.offs.push(() => ro.disconnect());
  const say = (h, keep) => { if (!keep) asked++; swap(msg, h, true); };
  let asked = 0;
  const idle = () => `${I('spark','xs')}<span>Medians split the runs: <b>$${med(vis().map(p => p.x)).toFixed(2)}</b> and <b>${med(vis().map(p => p.y))}%</b>. Drag across the chart to select runs.</span>`;
  // a selection: how many, their averages, and a way to ask about them
  function selected(){
    if (!sel || !sel.length){ sel = null; say(idle()); draw(); return; }
    const ps = sel.map(i => R[i]), ax = ps.reduce((t, p) => t + p.x, 0) / ps.length, ay = ps.reduce((t, p) => t + p.y, 0) / ps.length;
    say(`<span><b>${ps.length} runs selected</b>, $${ax.toFixed(2)} and ${Math.round(ay)}% on average</span><button class="pill soft sm cvq-ask">${I('spark','xs')}Ask the agent why</button>`);
    // (a click on an empty spot, or Escape, clears the selection)
    setTimeout(() => { const a = $('.cvq-ask', ft); if (a) a.onclick = () => ask(ps); }, REDUCE ? 0 : 200);
    draw();
  }
  const ask = ps => c.run(async () => {
    const id = ++asked; swap(msg, `${I('spark','xs')}<span class="shim">Looking at ${ps.length} runs</span>`, true); await c.wait(1000); if (id !== asked) return;
    const by = M.map((m, i) => ps.filter(p => p.m === i).length), top = by.indexOf(Math.max(...by));
    const text = `Most are ${M[top][0]} runs on short tickets, with under 6 tool calls each. Sending tickets like these to ${M[top][0]} would cut their cost by about 40%.`;
    msg.innerHTML = `${I('spark','xs')}<span class="b"></span>`; const b = $('.b', msg), ws = text.split(' ');
    for (let i = 1; i <= ws.length; i++){ if (id !== asked) return; b.textContent = ws.slice(0, i).join(' '); await c.wait(45); }
  });
  // pointing snaps to the nearest dot within reach and dims the other models
  const near = (px, py) => { let best = -1, bd = 26 * 26; R.forEach((p, i) => { if (!show[p.m] || i >= seen) return; const dx = G.x(p.x) - px, dy = G.y(p.y) - py, d = dx * dx + dy * dy; if (d < bd){ bd = d; best = i; } }); return best; };
  const local = e => { const b = pl.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  let drag = null;
  c.on(pl, 'pointerdown', e => { if (e.button) return; const [x, y] = local(e); drag = { x, y, id:e.pointerId, moved:false }; });
  c.on(pl, 'pointermove', e => { const [x, y] = local(e);
    if (drag && (drag.moved || Math.abs(x - drag.x) + Math.abs(y - drag.y) > 5)){ if (!drag.moved){ drag.moved = true; pl.setPointerCapture(drag.id); hot = -1; } box = [drag.x, drag.y, Math.max(G.l, Math.min(G.W - G.rr, x)), Math.max(G.t, Math.min(G.H - G.b, y))]; draw(); return; }
    if (e.pointerType === 'touch') return; const i = near(x, y); if (i !== hot){ hot = i; draw(); } });
  c.on(pl, 'pointerleave', () => { if (!drag && hot >= 0 && document.activeElement !== pl){ hot = -1; draw(); } });
  const finish = () => { if (!drag) return; const d = drag; drag = null;
    if (d.moved){ const [a, b2, x2, y2] = box, lo = Math.min(a, x2), hi = Math.max(a, x2), top = Math.min(b2, y2), bot = Math.max(b2, y2);
      sel = R.map((p, i) => i).filter(i => show[R[i].m] && G.x(R[i].x) >= lo && G.x(R[i].x) <= hi && G.y(R[i].y) >= top && G.y(R[i].y) <= bot); selected(); }
    else { const i = hot; if (i < 0 && sel){ sel = null; box = null; selected(); } } };
  c.on(pl, 'pointerup', finish); c.on(pl, 'pointercancel', () => { drag = null; box = null; draw(); });
  // the keys step through the runs from cheapest to dearest; Escape clears a selection
  const order = () => R.map((p, i) => i).filter(i => show[R[i].m]).sort((a, b) => R[a].x - R[b].x || R[b].y - R[a].y);
  c.on(pl, 'keydown', e => { const o = order(); let k = o.indexOf(hot);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') k = Math.min(o.length - 1, k + 1); else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') k = Math.max(0, k < 0 ? 0 : k - 1);
    else if (e.key === 'Home') k = 0; else if (e.key === 'End') k = o.length - 1;
    else if (e.key === 'Escape' && sel){ sel = null; box = null; selected(); return; } else return;
    e.preventDefault(); hot = o[k]; draw(); const p = R[hot]; say(`<span><b>Run ${p.id}</b>, ${M[p.m][0]}: $${p.x.toFixed(2)}, ${p.y}%, ${p.t}k tokens. ${k + 1} of ${o.length}</span>`); });
  c.on(pl, 'blur', () => { if (hot >= 0){ hot = -1; draw(); } if (!sel) say(idle(), true); });
  $$('.cvq-k', lg).forEach(k => k.onclick = () => { const m = +k.dataset.m; if (show[m] && show.filter(Boolean).length === 1) return; show[m] = !show[m]; k.setAttribute('aria-pressed', show[m]); hot = -1; draw(); if (!sel) say(idle(), true); });
  msg.innerHTML = idle();
  // the dots fade in, the agent rings three runs that cost a lot for a middling score, then the person selects the cheap,
  // high scoring corner and asks why
  c.run(async () => { await c.wait(250); for (let i = 0; i <= R.length; i += 3){ seen = i; draw(); await c.wait(40); } seen = R.length; draw();
    await c.wait(700); rings = true; draw(); say(`${I('spark','xs')}<span><b>3 outliers</b> cost over $0.45 for a score under 75. Each one looped on the search tool.</span>`, true); });
  if (r === c.st) c.story(async s => {
    await s.beat(7);
    const a = [G.x(.03), G.y(97)], b = [G.x(.2), G.y(88)], pb = pl.getBoundingClientRect();
    await s.point(pl, false); const hand = $('.hand', c.st), hb = hand.parentElement.getBoundingClientRect();
    const put = (x, y) => { hand.style.transform = `translate(${pb.left - hb.left + x}px,${pb.top - hb.top + y}px)`; };
    put(...a); await s.beat(1); rings = false;
    await tween(0, 1, 900, t => { box = [a[0], a[1], a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; put(box[2], box[3]); draw(); });
    sel = R.map((p, i) => i).filter(i => R[i].x >= .03 && R[i].x <= .2 && R[i].y >= 88 && R[i].y <= 97); selected(); await s.beat(3);
    await s.tap($('.cvq-ask', ft)); s.away(); await s.beat(10);
  });
});
