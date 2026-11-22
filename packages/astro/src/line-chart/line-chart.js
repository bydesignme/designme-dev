// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, reveal, seg, tween } from '../core/core.js';
DM.def('line-chart', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs'));
  const root = $('.lnx', r), ch = $('.lnx-ch', r), svg = $('.lnx-svg', r), yl = $('.lnx-y', r), ax = $('.lnx-ax', r), tt = $('.lnx-tt', r);
  const mark = $('.lnx-now', r), guide = $('.lnx-x', r), [pc, pm] = $$('.lnx-pt', r), pk = $('.lnx-pk', r), pp = $('.lnx-pp', r), live = $('p.lnx-sr', r), tab = $('.lnx-sr table', r);
  // the projects the picker offers: name, mark, the mark's colour, and how big each is next to the website
  const PJ = [['Website', 'W', 'b', 1], ['Mobile app', 'M', 'l', .58], ['Docs', 'D', 'm', .27]];
  // a small seeded wobble, so each project's numbers differ but are the same on every visit
  const wob = (s, i) => { const x = Math.sin(s * 91.7 + i * 12.9898) * 43758.5453; return x - Math.floor(x) - .5; };
  const HRS = Array.from({ length:24 }, (_, h) => (h % 12 || 12) + (h < 12 ? 'am' : 'pm'));
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  // editors at work: an hour of today (it is 2pm on Thursday 19 November), a day of this week, a day of this month. November
  // starts on a Sunday and October on a Thursday, so their weekends fall on different days
  const RG = {
    d:{ pts:HRS, ax:HRS, now:14, a:'Today', b:'Yesterday', each:'Hour', what:'today against yesterday', grid:[1, 2, 3, 4, 6, 12],
      base:[110, 80, 64, 58, 62, 96, 210, 460, 820, 1120, 1290, 1360, 1180, 1260, 1330, 1250, 1130, 960, 720, 510, 360, 260, 190, 140], ka:1.05, kb:.93 },
    w:{ pts:DAYS, ax:DAYS.map(d => d.slice(0, 3)), now:3, a:'This week', b:'Last week', each:'Day', what:'this week against last week', grid:[1],
      base:[4380, 4720, 4610, 4890, 4420, 1680, 1240], ka:1.04, kb:.92 },
    m:{ pts:Array.from({ length:30 }, (_, d) => 'Nov ' + (d + 1)), ax:Array.from({ length:30 }, (_, d) => 'Nov ' + (d + 1)), now:18, a:'This month', b:'Last month', each:'Day', what:'this month against last month', grid:[1, 7, 14],
      base:Array.from({ length:30 }, (_, d) => d % 7 === 0 || d % 7 === 6 ? 1500 : 4500), baseB:Array.from({ length:30 }, (_, d) => (4 + d) % 7 === 0 || (4 + d) % 7 === 6 ? 1450 : 4400), ka:1.02, kb:.95 }
  };
  /* the rest of the period is projected from now: the latest value carried forward along the shape the period before took over
     the same points (the month along its own weekdays, as October's weekends fall on other dates) */
  const data = (p, k) => { const g = RG[k], [, , , sz] = PJ[p];
    const va = g.base.slice(0, g.now + 1).map((v, i) => Math.round(v * g.ka * sz * (1 + wob(p + 1, i) * .14)));
    const vb = (g.baseB || g.base).map((v, i) => Math.round(v * g.kb * sz * (1 + wob(p + 7, i) * .14)));
    const shape = g.baseB ? g.base.map((v, i) => v * (1 + wob(p + 13, i) * .06)) : vb;
    return { ...g, va, vb, vp:vb.map((_, i) => i < g.now ? null : Math.round(va[g.now] * shape[i] / shape[g.now])) }; };
  const fmt = n => n.toLocaleString('en-US');
  const kf = n => n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);
  // the top of the scale: a round step that gives three or four bands above zero, with a little room over the highest value
  const scale = m => { const raw = m / 4, p = 10 ** Math.floor(Math.log10(raw || 1)), s = [1, 2, 2.5, 5, 10].map(k => k * p).find(k => k >= raw); return { s, top:Math.ceil(m * 1.04 / s) * s }; };
  const uid = 'lnx' + Math.random().toString(36).slice(2, 8);
  let pj = 0, rg = 'd', D = null, S = null, shown = 1, at = -1, clip = null;
  // which lines show: the legend turns each on and off, and one always stays on
  const on = { a:true, p:true, b:true }, keys = $$('.lnx-k', r);
  // where things go: the points spread over the plot's width, less the ring's half when the line ends on the last point
  const geo = () => { const W = ch.clientWidth, H = ch.clientHeight, n = D.pts.length - 1, xr = W - (D.now === n ? 6 : 0);
    return { W, H, n, xr, X:i => i / n * xr, Y:v => H - v / S.top * H }; };
  function draw(){
    if (!D || !ch.clientWidth) return;
    const { W, H, n, xr, X, Y } = geo(), A = D.va;
    const path = vs => vs.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join('');
    // a gridline every few points, as many as fit about 40px apart
    const k = D.grid.find(g => g * xr / n >= 40) || D.grid[D.grid.length - 1];
    const gl = []; for (let i = 0; i <= n; i += k){ const x = Math.round(X(i)) + .5; gl.push(`<line class="gl" x1="${x}" x2="${x}" y1="0" y2="${H}"/>`); }
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const P = D.vp.slice(D.now), pPath = P.map((v, j) => `${j ? 'L' : 'M'}${X(D.now + j).toFixed(1)} ${Y(v).toFixed(1)}`).join('');
    svg.innerHTML = `<defs><linearGradient id="${uid}g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:var(--dm-lnx-line);stop-opacity:var(--dm-lnx-fill)"/><stop offset="1" style="stop-color:var(--dm-lnx-line);stop-opacity:0"/></linearGradient>`
      + `<linearGradient id="${uid}p" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:var(--dm-lnx-line);stop-opacity:var(--dm-lnx-pfill)"/><stop offset="1" style="stop-color:var(--dm-lnx-line);stop-opacity:0"/></linearGradient>`
      + `<clipPath id="${uid}c"><rect x="-8" y="-8" height="${H + 16}" width="${(W + 16) * shown}"/></clipPath></defs>` + gl.join('')
      + `<g clip-path="url(#${uid}c)"><path class="cmp" d="${path(D.vb)}"/>`
      + (P.length > 1 ? `<path class="par" d="${pPath}L${X(n).toFixed(1)} ${H}L${X(D.now).toFixed(1)} ${H}Z" fill="url(#${uid}p)"/>` : '')
      + `<path class="ar" d="${path(A)}L${X(D.now).toFixed(1)} ${H}L0 ${H}Z" fill="url(#${uid}g)"/>${P.length > 1 ? `<path class="prj" d="${pPath}"/>` : ''}<path class="ln" d="${path(A)}"/></g>`;
    clip = $('rect', svg);
    mark.style.left = X(D.now) + 'px'; mark.style.top = Y(A[D.now]) + 'px'; mark.style.opacity = shown * (W + 16) - 8 >= X(D.now) ? 1 : 0;
    // the values on the left, top to bottom
    yl.innerHTML = Array.from({ length:S.top / S.s + 1 }, (_, j) => `<span>${kf(S.top - j * S.s)}</span>`).join('');
    // the axis: the first and last points, and Now under its own point (or the last point named Now when the line ends there)
    ax.innerHTML = `<span class="lnx-a">${D.ax[0]}</span><span class="lnx-z${D.now === n ? ' lnx-nw' : ''}">${D.now === n ? 'Now' : D.ax[n]}</span>${D.now < n ? '<span class="lnx-nw">Now</span>' : ''}<span class="lnx-tk"></span>`;
    const put = (el, x) => { const w = el.offsetWidth; el.style.left = Math.max(0, Math.min(xr - w, x - w / 2)) + 'px'; };
    const z = $('.lnx-z', ax);
    const nw = $('.lnx-nw:not(.lnx-z)', ax); if (nw){ put(nw, X(D.now)); [$('.lnx-a', ax), z].forEach(l => l.classList.toggle('lnx-hid', near(l, nw))); }
    if (at >= 0) show(at);
  }
  // two labels on the axis touch when their boxes come within 6px
  const near = (a, b) => { const p = a.offsetLeft, q = b.offsetLeft; return p < q + b.offsetWidth + 6 && q < p + a.offsetWidth + 6; };
  // a point's readout: the guide, a ring on each line, the card beside the guide on the side with room, and the point's chip
  function place(i){ const { X, Y } = geo(), x = X(i);
    [pm, pc].forEach(p => p.style.left = x + 'px');
    pm.style.top = Y(i <= D.now ? D.va[i] : D.vp[i]) + 'px'; pc.style.top = Y(D.vb[i]) + 'px'; }
  function show(i, say){
    if (!D) return; at = i; place(i);
    // up to now the reading is this period's own; after now it is the projection
    const { W, H, xr, X, Y } = geo(), x = X(i), ahead = i > D.now, has = ahead ? on.p : on.a, mv = ahead ? D.vp[i] : D.va[i], ml = ahead ? 'Projected' : D.a;
    root.classList.add('on'); guide.style.left = x + 'px';
    pm.classList.toggle('on', has && i !== D.now); pc.classList.toggle('on', on.b);
    $('.lnx-tt-h', tt).textContent = D.pts[i];
    const [ra, rb] = $$('.lnx-tt-r', tt); ra.hidden = !has; ra.classList.toggle('p', ahead);
    if (has){ $('span', ra).textContent = ml; $('b', ra).textContent = fmt(mv); }
    rb.hidden = !on.b; $('span', rb).textContent = D.b; $('b', rb).textContent = fmt(D.vb[i]);
    // beside the guide on the side with room; on a plot too narrow for either side, centred over the point and above it
    // (or under it when it sits high), so the card never covers the point it reads
    const w = tt.offsetWidth, h = tt.offsetHeight, gap = 12, py = Y(has ? mv : D.vb[i]), side = x + gap + w <= W ? x + gap : x - gap - w >= 0 ? x - gap - w : null;
    tt.style.left = (side ?? Math.max(0, Math.min(W - w, x - w / 2))) + 'px';
    tt.style.top = (side != null ? Math.max(0, Math.min(H - h, py - h / 2)) : py - gap - h >= -8 ? py - gap - h : py + gap) + 'px';
    const tk = $('.lnx-tk', ax); tk.textContent = D.ax[i]; const tw = tk.offsetWidth; tk.style.left = Math.max(0, Math.min(xr - tw, x - tw / 2)) + 'px';
    $$('span:not(.lnx-tk)', ax).forEach(l => l.classList.toggle('lnx-off', l.classList.contains('lnx-hid') || near(l, tk)));
    if (say) live.textContent = `${D.pts[i]}: ` + [has && `${ml} ${fmt(mv)}`, on.b && `${D.b} ${fmt(D.vb[i])}`].filter(Boolean).join(', ');
  }
  function hide(){ at = -1; root.classList.remove('on'); $$('span:not(.lnx-tk)', ax).forEach(l => l.classList.toggle('lnx-off', l.classList.contains('lnx-hid'))); }
  // a range or a project picked: the numbers change at once and the lines draw in again from the left
  let tok = 0;
  function load(){
    D = data(pj, rg); S = scale(Math.max(...D.va, ...D.vb, ...D.vp.filter(v => v != null)));
    const p = PJ[pj], mk = $('.lnx-mk', pk);
    mk.textContent = p[1]; mk.style.cssText = `--dm-mk:var(--dm-av-${p[2]});--dm-mk-ink:var(--dm-av-${p[2]}-ink)`; $('.lnx-pn', pk).textContent = p[0];
    pk.setAttribute('aria-label', 'Project: ' + p[0]);
    $$('.mi', pp).forEach((m, k) => m.setAttribute('aria-checked', k === pj));
    ch.setAttribute('aria-label', `Active editors on ${p[0]}, ${D.what}, the rest projected. The arrow keys read each ${D.each.toLowerCase()}`);
    tab.innerHTML = `<caption>Active editors on ${p[0]}, ${D.what}, the rest projected</caption><tr><th scope="col">${D.each}</th><th scope="col">${D.a}</th><th scope="col">Projected</th><th scope="col">${D.b}</th></tr>`
      + D.pts.map((t, i) => `<tr><th scope="row">${t}</th><td>${i <= D.now ? fmt(D.va[i]) : ''}</td><td>${i > D.now ? fmt(D.vp[i]) : ''}</td><td>${fmt(D.vb[i])}</td></tr>`).join('');
    $('span', keys[0]).textContent = D.a; $('span', keys[2]).textContent = D.b;
    if (at > D.pts.length - 1) at = D.now;
    draw();
  }
  function reveal(){
    const k = ++tok; shown = REDUCE ? 1 : 0; draw(); if (shown) return;
    tween(0, 1, 1100, t => { if (k !== tok) return; shown = t; if (!clip || !clip.isConnected) return; const { W, X } = geo(); clip.setAttribute('width', (W + 16) * t); mark.style.opacity = t * (W + 16) - 8 >= X(D.now) ? 1 : 0; }, t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  }
  pp.innerHTML = PJ.map((p, k) => `<button class="mi" role="menuitemradio" aria-checked="${k === pj}" data-close data-k="${k}"><span class="lnx-mk" style="--dm-mk:var(--dm-av-${p[2]});--dm-mk-ink:var(--dm-av-${p[2]}-ink)" aria-hidden="true">${p[1]}</span><span>${p[0]}</span><span class="ck">${I('check','xs')}</span></button>`).join('');
  $$('.mi', pp).forEach(m => m.addEventListener('click', () => { const k = +m.dataset.k; if (k === pj) return; pj = k; load(); reveal(); }));
  seg($('.lnx-rg', r), v => { if (v === rg) return; rg = v; load(); reveal(); });
  keys.forEach(k => k.onclick = () => { const s = k.dataset.s; if (on[s] && !Object.keys(on).some(o => o !== s && on[o])) return; on[s] = !on[s];
    k.setAttribute('aria-pressed', on[s]); root.classList.toggle('lnx-no' + s, !on[s]); if (at >= 0) show(at); });
  // the pointer, a finger or the keyboard reads the nearest point
  const idx = e => { const b = ch.getBoundingClientRect(), { n, xr } = geo(); return Math.max(0, Math.min(n, Math.round((e.clientX - b.left) / xr * n))); };
  c.on(ch, 'pointermove', e => show(idx(e)));
  c.on(ch, 'pointerdown', e => show(idx(e)));
  c.on(ch, 'pointerleave', e => { if (e.pointerType !== 'touch' && !ch.matches(':focus-visible')) hide(); });
  c.on(ch, 'focus', () => { if (ch.matches(':focus-visible')) show(at < 0 ? D.now : at, true); });
  c.on(ch, 'blur', hide);
  c.on(ch, 'keydown', e => { const n = D.pts.length - 1, i = at < 0 ? D.now : at;
    const to = { ArrowLeft:i - 1, ArrowRight:i + 1, Home:0, End:n }[e.key];
    if (e.key === 'Escape' && at >= 0){ e.preventDefault(); hide(); return; }
    if (to == null) return; e.preventDefault(); show(Math.max(0, Math.min(n, to)), true); });
  const ro = new ResizeObserver(() => draw()); ro.observe(ch); c.offs.push(() => ro.disconnect());
  // the lines draw in once the chart has risen into view, so the draw is seen from its start
  shown = 0; load();
  c.later(260, reveal);
  // the demo reads a few points along today, switches to the week, then picks another project
  // a readout the demo left showing goes when the visitor takes over, unless they are reading the plot themselves
  c.taken(() => { if (!ch.matches(':hover,:focus-visible')) hide(); });
  c.story(async s => {
    // the demo's pointer goes to the point first, and only then does the readout move there
    const aim = $('.lnx-aim', r);
    const read = async i => { const { X, Y } = geo(); aim.style.left = X(i) + 'px'; aim.style.top = Y(i <= D.now ? D.va[i] : D.vp[i]) + 'px'; await s.point(aim, false); show(i); await s.beat(1.4); };
    await s.beat(4);
    // (the reading past Now is two points on, so on a phone its chip stays clear of the axis's last label)
    for (const i of [D.now - 6, D.now - 3, D.now, D.now + 2]) await read(i);
    hide(); s.away(); await s.beat(1);
    await s.tap($('.lnx-rg [data-v="w"]', r)); await s.beat(3);
    await read(D.now + 1); hide(); s.away(); await s.beat(1);
    await s.tap(pk); await s.beat(1.4);
    await s.tap($('.mi[data-k="1"]', pp)); await s.beat(3.5);
    await read(D.now); hide(); s.away(); await s.beat(1);
  });
});
