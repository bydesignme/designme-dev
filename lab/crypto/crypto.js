/* Crypto dashboard, a Soft collection for posts: charts drawn from data, a load choreography (cards rise in, the gauge's
   knob sweeps, lines draw, bars grow, numbers count up), hover readouts, tabs and copy */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = 'cubic-bezier(.22,1,.36,1)';
  const ICON = {
    trash:'<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
    edit:'<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4"/></svg>',
    plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    copy:'<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>',
    check:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    chev:'<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
  };
  $$('[data-ic]').forEach(b => b.innerHTML = ICON[b.dataset.ic]);

  // a seeded walk, so every load draws the same charts
  const walk = (n, seed, drift, vol, start = 50) => { let s = seed, v = start; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; return Array.from({ length:n }, () => (v += drift + (r() - .5) * vol)); };
  // a smooth line through points (Catmull-Rom as cubic Béziers)
  const smooth = P => P.map((p, i) => { if (!i) return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    const a = P[i - 2] || P[i - 1], b = P[i - 1], c = p, d = P[i + 1] || p, t = .18;
    return `C${(b[0] + (c[0] - a[0]) * t).toFixed(1)} ${(b[1] + (c[1] - a[1]) * t).toFixed(1)} ${(c[0] - (d[0] - b[0]) * t).toFixed(1)} ${(c[1] - (d[1] - b[1]) * t).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`; }).join(' ');
  const fit = (vals, w, h, pad = 4) => { const mn = Math.min(...vals), mx = Math.max(...vals); return vals.map((v, i) => [i / (vals.length - 1) * w, pad + (1 - (v - mn) / ((mx - mn) || 1)) * (h - pad * 2)]); };

  /* 1. the credit health gauge: four bands round a 220 degree arc, a dotted inner arc, the knob at the score */
  const G = { cx:200, cy:200, r:150, a0:200, sweep:220, lo:300, hi:850, score:712 };
  const BANDS = [['Poor', '300 to 579', 0, .34, '#f0616d'], ['Fair', '580 to 669', .36, .58, '#f7c948'], ['Good', '670 to 739', .6, .8, 'var(--vi)'], ['Excellent', '740 to 850', .82, 1, 'var(--gn)']];
  const P = (f, r = G.r) => { const t = (G.a0 - G.sweep * f) * Math.PI / 180; return [G.cx + r * Math.cos(t), G.cy - r * Math.sin(t)]; };
  const arc = (f0, f1, r = G.r) => { const a = P(f0, r), b = P(f1, r); return `M${a[0].toFixed(1)} ${a[1].toFixed(1)}A${r} ${r} 0 ${(f1 - f0) * G.sweep > 180 ? 1 : 0} 1 ${b[0].toFixed(1)} ${b[1].toFixed(1)}`; };
  const gs = $('.gs'), segs = $('.segs', gs), knob = $('.knob', gs), score = $('#score');
  segs.innerHTML = BANDS.map(([n, rg, f0, f1, c], i) => `<path class="seg-p" data-i="${i}" d="${arc(f0, f1)}" pathLength="1" style="stroke:${c}"/>`).join('');
  $('.dots', gs).innerHTML = Array.from({ length:34 }, (_, i) => { const p = P(i / 33, 116); return `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="1.7"/>`; }).join('');
  const fScore = (G.score - G.lo) / (G.hi - G.lo);
  const setKnob = f => { const p = P(f); knob.setAttribute('transform', `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)})`); };
  const gtip = $('#gtip');
  $$('.seg-p', segs).forEach(p => {
    p.addEventListener('pointerenter', () => { const b = BANDS[+p.dataset.i]; gtip.innerHTML = `<i style="background:${b[4]}"></i><b>${b[0]}</b> · ${b[1]}`; gtip.hidden = false; });
    p.addEventListener('pointermove', e => { const r = $('.gauge').getBoundingClientRect(), k = r.width / $('.gauge').offsetWidth; gtip.style.left = (e.clientX - r.left) / k + 12 + 'px'; gtip.style.top = (e.clientY - r.top) / k - 36 + 'px'; });
    p.addEventListener('pointerleave', () => gtip.hidden = true);
  });

  /* 2. the price card: an area sparkline, and a readout that follows the pointer */
  const PRICE = (w => w.map(v => 309.75 + (v - w[0]) * (318.42 - 309.75) / (w[w.length - 1] - w[0])))(walk(40, 9, .2, 5, 300)), PDATE = i => { const m = Math.round((PRICE.length - 1 - i) * 36); const d = new Date(2026, 10, 16, 14, 32 - m); return d.toLocaleDateString('en-GB', { day:'numeric', month:'short' }) + ', ' + d.toTimeString().slice(0, 5); };
  const pPts = fit(PRICE, 400, 80, 8), ps = $('.ps');
  $('.ln', ps).setAttribute('d', smooth(pPts)); $('.ar', ps).setAttribute('d', smooth(pPts) + ' L400 90 L0 90 Z');
  const price = $('.price'), pval = $('#pval'), pchg = $('#pchg'), pdate = $('#pdate'), pdot = $('#pdot');
  const pLast = PRICE[PRICE.length - 1], pFirst = PRICE[0];
  const showP = i => { const v = PRICE[i], ch = (v / pFirst - 1) * 100;
    pval.textContent = '$' + v.toFixed(2); pchg.textContent = (ch >= 0 ? '+' : '−') + Math.abs(ch).toFixed(1) + '%'; pchg.className = 'tag num ' + (ch >= 0 ? 'ok' : 'bad'); pdate.textContent = PDATE(i); };
  price.addEventListener('pointermove', e => { const r = ps.getBoundingClientRect(), cr = price.getBoundingClientRect(), k = cr.width / price.offsetWidth;
    const i = Math.max(0, Math.min(PRICE.length - 1, Math.round((e.clientX - r.left) / r.width * (PRICE.length - 1)))); showP(i);
    pdot.style.left = (r.left - cr.left) / k + pPts[i][0] / 400 * r.width / k + 'px'; pdot.style.top = (r.top - cr.top) / k + pPts[i][1] / 80 * r.height / k + 'px'; });
  price.addEventListener('pointerleave', () => showP(PRICE.length - 1));

  /* 5 and 6. the coin cards' chart feet */
  const coin = (sel, seed, drift) => { const v = walk(18, seed, drift, 6), pts = fit(v, 300, 64, 6), sv = $(sel + ' .cl');
    $('.ln', sv).setAttribute('d', smooth(pts)); $('.ar', sv).setAttribute('d', smooth(pts) + ' L300 70 L0 70 Z'); };
  coin('.coin.up', 11, .9); coin('.coin.down', 5, -.8);

  /* 7. portfolio value: a hatched area under the line, a readout on a marker */
  const PV = (w => { const mn = Math.min(...w), mx = Math.max(...w); return w.map(v => 70400 + (v - mn) / (mx - mn) * 23800); })(walk(30, 3, 1.1, 10, 40));
  const pvs = $('.pvs'), pc = $('#pc'), W = 360, H = 220, X0 = 52, LO = 70000, HI = 104000, yOf = v => 8 + (1 - (v - LO) / (HI - LO)) * (H - 16);
  const pvPts = PV.map((v, i) => [X0 + i / (PV.length - 1) * (W - X0), yOf(v)]);
  $('.ya', pc).innerHTML = [100, 90, 80, 70].map(k => `<span style="top:${(yOf(k * 1000) / H * 100).toFixed(2)}%">$${k}K</span>`).join('');
  $('.ln', pvs).setAttribute('d', smooth(pvPts)); $('.hatch', pvs).setAttribute('d', smooth(pvPts) + ` L${W} ${H} L${X0} ${H} Z`);
  const pvdot = $('#pvdot'), pvro = $('#pvro'), mk = $('.mk', pvs);
  const PVD = i => { const d = new Date(2026, 10, 1 + Math.round(i / 2.2), 9); return d.toLocaleDateString('en-GB', { day:'numeric', month:'short' }) + ', 09:00'; };
  const showPV = i => { const r = pc.getBoundingClientRect(), k = r.width / pc.offsetWidth || 1, x = pvPts[i][0] / W * pc.offsetWidth, y = pvPts[i][1] / H * pc.offsetHeight;
    pvdot.style.left = x + 'px'; pvdot.style.top = y + 'px'; mk.setAttribute('x1', pvPts[i][0]); mk.setAttribute('x2', pvPts[i][0]); mk.setAttribute('y1', pvPts[i][1]);
    pvro.style.left = Math.max(100, Math.min(pc.offsetWidth - 100, x)) + 'px'; pvro.style.top = y + 'px';
    const v = PV[i], ch = (PV[i] / PV[Math.max(0, i - 3)] - 1) * 100;
    $('.rd', pvro).textContent = PVD(i); $('.rv b', pvro).textContent = v.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 });
    const t = $('.rv .tag', pvro); t.textContent = (ch >= 0 ? '+' : '−') + Math.abs(ch).toFixed(1) + '%'; t.className = 'tag num ' + (ch >= 0 ? 'ok' : 'bad'); };
  const PV0 = 18;
  pc.addEventListener('pointermove', e => { const r = pc.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W;
    let i = 0, best = 1e9; pvPts.forEach((p, k) => { const d = Math.abs(p[0] - x); if (d < best){ best = d; i = k; } }); showPV(i); });
  pc.addEventListener('pointerleave', () => showPV(PV0));

  /* 4. assets: three tabs, rows with a mini sparkline and the change */
  const ROWS = {
    all:[['Ethereum', '$31,240.10', 2.8, 21], ['Euro', '€8,420.30', -.3, 4], ['Solana', '$12,918.65', 5.1, 13]],
    crypto:[['Bitcoin', '$40,112.40', 1.9, 8], ['Ethereum', '$31,240.10', 2.8, 21], ['Solana', '$12,918.65', 5.1, 13]],
    cash:[['Euro', '€8,420.30', -.3, 4], ['Pound', '£3,104.90', .4, 17], ['Dollar', '$2,060.00', 0, 9]],
  };
  const rows = $('#rows');
  const paintRows = (k, anim) => { rows.innerHTML = ROWS[k].map(([n, v, ch, seed]) => { const pts = fit(walk(14, seed, ch / 3, 5), 64, 24, 3);
    return `<div class="ar-r ${ch >= 0 ? 'up' : 'down'}"><b>${n}</b><svg viewBox="0 0 64 24" aria-hidden="true"><path d="${smooth(pts)}"/></svg><span class="v num">${v}</span><span class="tag num ${ch > 0 ? 'ok' : ch < 0 ? 'bad' : ''}" ${ch === 0 ? 'style="background:var(--dm-chip);color:var(--dm-muted)"' : ''}>${ch > 0 ? '+' : ch < 0 ? '−' : ''}${Math.abs(ch).toFixed(1)}%</span></div>`; }).join('');
    if (anim && !REDUCE) $$('.ar-r', rows).forEach((r, i) => r.animate([{ opacity:0, transform:'translateY(8px)', filter:'blur(3px)' }, { opacity:1, transform:'none', filter:'blur(0)' }], { duration:420, delay:i * 45, easing:EASE, fill:'backwards' })); };
  paintRows('all');
  $$('.tabs button').forEach(b => b.onclick = () => { $$('.tabs button').forEach(x => x.setAttribute('aria-selected', x === b)); paintRows(b.dataset.v, true); });

  /* 8. messages */
  const CH = [['MK', 'Maya Kim', 'Sent the Q4 staking report, have a look', 'l'], ['TR', 'Theo Reed', 'Can we move the wallet review to 3pm?', 't'], ['IB', 'Iris Bell', 'The ETH swap went through, all good', 'p'], ['KM', 'Kofi Mensah', 'Coffee before the fund call tomorrow?', 'y'], ['LN', 'Lena Novak', 'New tax export is ready in your drive', 'r']];
  $('#chats').innerHTML = CH.map(([i, n, t, c]) => `<div class="cm"><span class="av" style="background:var(--dm-av-${c});color:var(--dm-av-${c}-ink)">${i}</span><span class="t"><b>${n}</b><span>${t}</span></span><span class="cv">${ICON.chev}</span></div>`).join('');

  /* 3. copy the transaction id */
  const cp = $('#cp');
  cp.onclick = () => { try { navigator.clipboard.writeText('58201744'); } catch(e){} cp.innerHTML = ICON.check + '<span>Copied</span>'; cp.style.color = 'var(--dm-ok)';
    clearTimeout(cp._t); cp._t = setTimeout(() => { cp.innerHTML = ICON.copy; cp.style.color = ''; }, 1600); };

  /* 9. allocation: six hatched stacked bars on a hatched track */
  const AL = [['Jun', .42, .16, .12], ['Jul', .2, .58, .08], ['Aug', .6, .06, .1], ['Sep', .14, .1, .32], ['Oct', .38, .12, .36], ['Nov', .1, .06, .06]];
  const bars = $('#bars'), atip = $('#atip');
  bars.innerHTML = AL.map(([m, y, k, l]) => `<div class="bc" data-m="${m}"><i class="y" style="height:${y * 100}%"></i><i class="k" style="height:${k * 100}%"></i><i class="l" style="height:${l * 100}%"></i></div>`).join('');
  $$('.bc', bars).forEach((b, i) => {
    b.addEventListener('pointerenter', () => { const [m, y, k, l] = AL[i], t = 94.2 * (y + k + l) / 1.2; b.classList.add('on');
      atip.innerHTML = `<b>${m}</b> · $${t.toFixed(1)}K<br><i class="y"></i>Stablecoins ${Math.round(y * 100)}%<br><i class="k"></i>Ethereum ${Math.round(k * 100)}%<br><i class="l"></i>Bitcoin ${Math.round(l * 100)}%`;
      const a = $('.alloc'); atip.hidden = false; atip.style.left = Math.min(b.offsetLeft + b.offsetWidth + 8, a.offsetWidth - 170) + 'px'; atip.style.top = b.offsetTop + 30 + 'px'; });
    b.addEventListener('pointerleave', () => { b.classList.remove('on'); atip.hidden = true; });
  });

  /* the load choreography */
  let RUN = 0;
  const tween = (ms, f, ease = t => 1 - Math.pow(1 - t, 3)) => new Promise(res => { if (REDUCE){ f(1); return res(); } const t0 = performance.now(), run = RUN;
    const s = () => { if (run !== RUN) return; const p = Math.min(1, (performance.now() - t0) / ms); f(ease(p)); p < 1 ? requestAnimationFrame(s) : res(); }; requestAnimationFrame(s); });
  const wait = ms => { const run = RUN; return new Promise(r => setTimeout(() => run === RUN && r(), REDUCE ? 0 : ms)); };
  const draw = (el, ms, delay) => { if (REDUCE) return; const L = el.getTotalLength ? el.getTotalLength() : 1;
    el.animate([{ strokeDasharray:`${L} ${L}`, strokeDashoffset:L }, { strokeDasharray:`${L} ${L}`, strokeDashoffset:0 }], { duration:ms, delay, easing:EASE, fill:'backwards' }); };
  const fade = (el, ms, delay, from = {}, to = {}) => { if (REDUCE || !el) return; el.animate([Object.assign({ opacity:0 }, from), Object.assign({ opacity:1, transform:'none', filter:'blur(0)' }, to)], { duration:ms, delay, easing:EASE, fill:'backwards' }); };
  async function play(){
    RUN++;
    // cards rise in column by column, row by row
    const cards = [0, 1, 2].flatMap(r => $$('.col').map(c => c.children[r]));
    cards.forEach((c, i) => fade(c, 700, 80 + i * 60, { transform:'translateY(16px) scale(.985)', filter:'blur(6px)' }));
    // the gauge: bands draw one after another, the knob sweeps to the score while the number counts up
    $$('.seg-p', segs).forEach((p, i) => { if (REDUCE) return; p.animate([{ strokeDasharray:'0 1', opacity:0 }, { opacity:1, offset:.12 }, { strokeDasharray:'1 0', opacity:1 }], { duration:520, delay:300 + i * 180, easing:EASE, fill:'backwards' }); });
    fade($('.dots', gs), 600, 300);
    setKnob(0); score.textContent = G.lo;
    wait(500).then(() => tween(1500, t => { setKnob(fScore * t); score.textContent = Math.round(G.lo + (G.score - G.lo) * t); }, t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2));
    // lines draw, areas and readouts follow
    draw($('.ln', ps), 1100, 500); fade($('.ar', ps), 700, 900);
    $$('.coin .ln').forEach((l, i) => draw(l, 900, 650 + i * 200)); $$('.coin .ar').forEach((a, i) => fade(a, 600, 1100 + i * 200));
    $$('.coin .tag').forEach((t, i) => fade(t, 500, 1300 + i * 200, { transform:'scale(.8)', filter:'blur(6px)' }));
    draw($('.ln', pvs), 1300, 800); fade($('.hatch', pvs), 700, 1400);
    showPV(PV0); fade(pvdot, 500, 1900, { transform:'scale(.4)', filter:'blur(4px)' });
    fade(pvro, 500, 1950, { transform:'translate(-50%,calc(-100% - 6px))', filter:'blur(4px)' }, { transform:'translate(-50%,calc(-100% - 16px))' });
    fade(mk, 400, 1800);
    // assets rows, chats rows
    $$('.ar-r', rows).forEach((r, i) => fade(r, 500, 700 + i * 70, { transform:'translateY(10px)', filter:'blur(3px)' }));
    $$('.cm').forEach((r, i) => fade(r, 500, 800 + i * 60, { transform:'translateY(10px)', filter:'blur(3px)' }));
    // the transaction: the plus pops, the amount counts
    fade($('.plus'), 650, 600, { transform:'scale(.6)', filter:'blur(8px)' });
    const amt = $('.amt'); amt.textContent = '+0.0000 ETH'; wait(700).then(() => tween(900, t => amt.textContent = '+' + (.0418 * t).toFixed(4) + ' ETH'));
    // bars grow from the floor, a band at a time
    $$('.bc', bars).forEach((b, i) => $$('i', b).forEach((s, j) => { if (REDUCE) return; s.animate([{ transform:'scaleY(0)' }, { transform:'scaleY(1)' }], { duration:650, delay:700 + i * 70 + j * 120, easing:EASE, fill:'backwards' }); }));
    // the price counts to its last value
    if (!REDUCE) pval.textContent = '$' + (pLast * .9).toFixed(2);
    wait(500).then(() => tween(1100, t => pval.textContent = '$' + (pLast * (.9 + .1 * t)).toFixed(2)));
  }
  showP(PRICE.length - 1);

  /* the page: scale the artboard to the window, theme and replay */
  const board = $('#board'), fitEl = $('.fit');
  const scale = () => { const s = Math.min(1, (innerWidth - 48) / 1600); board.style.transform = `scale(${s})`; fitEl.style.height = 1200 * s + 48 + 'px'; };
  addEventListener('resize', scale); scale();
  const paint = () => $$('.seg button').forEach(b => b.setAttribute('aria-pressed', document.documentElement.dataset.theme === b.dataset.t));
  $$('.seg button').forEach(b => b.onclick = () => { document.documentElement.dataset.theme = b.dataset.t; try { localStorage.setItem('dmui-theme', b.dataset.t); } catch(e){} paint(); });
  paint();
  $('#replay').onclick = () => { document.getAnimations().forEach(a => a.cancel()); play(); };
  play();
})();
