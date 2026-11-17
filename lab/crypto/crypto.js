/* Crypto dashboard, a Soft collection for posts: charts drawn from data, a load choreography (cards rise in, the ticks fill
   to the score, lines draw, the bar grows, numbers count up), pointer readouts on every chart, controls that all answer,
   digits that roll, and quiet live motion (the price ticks, confirmations count, an alert fires now and then) that holds
   while the pointer is over its card and never runs with reduced motion */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = 'cubic-bezier(.22,1,.36,1)', SPRING = 'cubic-bezier(.34,1.36,.64,1)';
  const ICON = {
    plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    copy:'<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/></svg>',
    check:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    flip:'<svg viewBox="0 0 24 24"><path d="M8 4v15M4 15l4 4 4-4M16 20V5M12 9l4-4 4 4"/></svg>',
    bank:'<svg viewBox="0 0 24 24"><path d="M3 9.5L12 4l9 5.5M5 10v8M9.7 10v8M14.3 10v8M19 10v8M3 20h18"/></svg>',
    wallet:'<svg viewBox="0 0 24 24"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3M4 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 1 4 7.5z"/><circle cx="16" cy="13.5" r="1.2"/></svg>',
  };
  $$('[data-ic]').forEach(b => b.innerHTML = ICON[b.dataset.ic]);
  const money = (v, d = 2) => '$' + v.toLocaleString('en-US', { minimumFractionDigits:d, maximumFractionDigits:d });
  const pct = v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + '%';
  const chg = (el, v) => { el.textContent = pct(v); el.className = 'tag num ' + (v >= 0 ? 'ok' : 'bad'); };
  const fmtD = (d, time) => d.toLocaleDateString('en-GB', time ? { day:'numeric', month:'short' } : { day:'numeric', month:'short', year:'numeric' }) + (time ? ', ' + d.toTimeString().slice(0, 5) : '');
  // the board is scaled to the window; this turns a client x/y into board pixels inside an element
  const local = (el, e) => { const r = el.getBoundingClientRect(), k = r.width / el.offsetWidth || 1; return [(e.clientX - r.left) / k, (e.clientY - r.top) / k]; };
  let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

  /* motion helpers. tween: the load's counters (a replay cancels them). ani: one keyed animation at a time (a new one for the
     same key replaces it). Both run on requestAnimationFrame, and jump to the end with reduced motion */
  let RUN = 0;
  function tween(ms, f, ease = t => 1 - Math.pow(1 - t, 3)){ return new Promise(res => { if (REDUCE){ f(1); return res(); } const t0 = performance.now(), run = RUN;
    const s = () => { if (run !== RUN) return; const p = Math.min(1, (performance.now() - t0) / ms); f(ease(p)); p < 1 ? requestAnimationFrame(s) : res(); }; requestAnimationFrame(s); }); }
  const KEYS = {};
  const inOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, out3 = t => 1 - Math.pow(1 - t, 3);
  function ani(key, ms, f, ease = inOut){ const tok = KEYS[key] = {}; if (REDUCE){ f(1); return; } const t0 = performance.now();
    const s = () => { if (KEYS[key] !== tok) return; const p = Math.min(1, (performance.now() - t0) / ms); f(ease(p)); if (p < 1) requestAnimationFrame(s); }; requestAnimationFrame(s); }
  const wait = ms => { const run = RUN; return new Promise(r => setTimeout(() => run === RUN && r(), REDUCE ? 0 : ms)); };

  /* digits that roll: each digit becomes a column of 0 to 9 that slides to its value. A value with a different shape
     (more digits, a sign) is set in place, since nothing would line up to roll */
  const shape = s => s.replace(/\d/g, '0');
  function roll(el, str){
    el.setAttribute('aria-label', str);
    if (REDUCE){ el.textContent = str; el._r = str; return; }
    const built = el._r && $('.ds', el) && shape(el._r) === shape(str);
    if (!built){ const from = shape(el.textContent) === shape(str) ? el.textContent : str;
      el.innerHTML = [...from].map(c => /\d/.test(c) ? `<span class="dg" aria-hidden="true"><span class="ds" style="transform:translateY(-${c * 10}%)">${'0123456789'.split('').map(d => `<span>${d}</span>`).join('')}</span></span>` : `<span class="rl" aria-hidden="true">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
      el.offsetWidth; }
    [...str].forEach((c, i) => { if (/\d/.test(c)) el.children[i].firstChild.style.transform = `translateY(-${c * 10}%)`; });
    el._r = str;
  }
  // a smooth line through points (Catmull-Rom as cubic Béziers), and a resample so two lines can morph point for point
  const smooth = P => P.map((p, i) => { if (!i) return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    const a = P[i - 2] || P[i - 1], b = P[i - 1], c = p, d = P[i + 1] || p, t = .18;
    return `C${(b[0] + (c[0] - a[0]) * t).toFixed(1)} ${(b[1] + (c[1] - a[1]) * t).toFixed(1)} ${(c[0] - (d[0] - b[0]) * t).toFixed(1)} ${(c[1] - (d[1] - b[1]) * t).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`; }).join(' ');
  const resample = (P, M = 96) => Array.from({ length:M }, (_, j) => { const f = j / (M - 1) * (P.length - 1), i = Math.floor(f), t = f - i, a = P[i], b = P[Math.min(i + 1, P.length - 1)]; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; });
  const lerpPts = (A, B, t) => A.map((p, i) => [p[0] + (B[i][0] - p[0]) * t, p[1] + (B[i][1] - p[1]) * t]);
  const gridLines = (g, w, ys) => g.innerHTML = ys.map(y => `<line x1="0" x2="${w}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/>`).join('');
  // a seeded walk pinned to a start and an end value, its wiggle scaled to amp: every load draws the same charts
  const series = (n, sd, a, b, amp) => { let s = sd, v = 0; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const w = Array.from({ length:n }, () => (v += (r() - .5)));
    const noise = w.map((x, i) => x - (w[0] + (w[n - 1] - w[0]) * i / (n - 1))), m = Math.max(...noise.map(Math.abs)) || 1;
    return noise.map((x, i) => a + (b - a) * i / (n - 1) + x / m * amp); };
  // a tooltip over a chart point, flipped below when the point is near the top
  const placeTip = (tip, box, x, y, html) => { tip.innerHTML = html; tip.hidden = false; const w = tip.offsetWidth;
    tip.style.left = Math.max(w / 2 + 4, Math.min(box.offsetWidth - w / 2 - 4, x)) + 'px'; tip.style.top = y + 'px'; tip.classList.toggle('below', y < tip.offsetHeight + 18); };

  // every card lifts under the pointer (CSS) and holds its live motion while the pointer is on it
  $$('.cd').forEach(c => { c.addEventListener('pointerenter', () => c.classList.add('hold')); c.addEventListener('pointerleave', () => c.classList.remove('hold')); });

  /* 1. credit health: 72 ticks round a ring, filled to the score. Hovering sweeps the fill and the readout to the tick under
     the pointer and names its band; leaving eases them back to the score */
  const CR = { lo:300, hi:850, score:712, n:72 };
  const BANDS = [['Poor', 300, 579], ['Fair', 580, 669], ['Good', 670, 739], ['Very good', 740, 799], ['Excellent', 800, 850]];
  const ticksG = $('.ticks'), score = $('#score'), ring = $('#ring'), cof = $('#cof');
  const tv = i => CR.lo + i / (CR.n - 1) * (CR.hi - CR.lo), ti = v => Math.round((v - CR.lo) / (CR.hi - CR.lo) * (CR.n - 1));
  ticksG.innerHTML = Array.from({ length:CR.n }, (_, i) => { const a = (i / CR.n) * 2 * Math.PI - Math.PI / 2, c = Math.cos(a), s = Math.sin(a);
    return `<line x1="${(100 + 72 * c).toFixed(2)}" y1="${(100 + 72 * s).toFixed(2)}" x2="${(100 + 86 * c).toFixed(2)}" y2="${(100 + 86 * s).toFixed(2)}"/>`; }).join('');
  const ticks = $$('line', ticksG);
  const bandOf = v => BANDS.find(b => v <= b[2] + .5) || BANDS[BANDS.length - 1];
  let gv = CR.lo, gHover = false, gTo = CR.score;
  const gauge = v => { gv = v; const k = ti(v) + 1; ticks.forEach((t, i) => t.classList.toggle('on', i < k)); score.textContent = Math.round(v); };
  const sweep = (to, ms) => { if (to === gTo) return; gTo = to; const from = gv; ani('gauge', ms, t => gauge(from + (to - from) * t), out3); };
  $('.hit', ring).addEventListener('pointermove', e => {
    const [x, y] = local(ring, e), s = ring.offsetWidth / 200, a = Math.atan2(y / s - 100, x / s - 100) + Math.PI / 2;
    const i = Math.round(((a + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI) * CR.n) % CR.n, b = bandOf(tv(i));
    gHover = true; ticks.forEach((t, j) => { const v = tv(j); t.classList.toggle('hv', v >= b[1] - .5 && v <= b[2] + .5); });
    cof.textContent = b[0]; sweep(Math.round(tv(i)), 450);
  });
  $('.hit', ring).addEventListener('pointerleave', () => { gHover = false; ticks.forEach(t => t.classList.remove('hv')); cof.textContent = 'of 850'; sweep(CR.score, 500); });

  /* 2. portfolio value: 30 days, a soft accent area. The readout under the head, a guide, a dot and a tooltip follow the
     pointer */
  const PEND = new Date(2026, 10, 16, 14, 0);
  const PVR = {
    m:{ n:31, step:864e5, a:87070, amp:2300, seed:33, label:'Last 30 days' },
  };
  Object.values(PVR).forEach(r => r.v = series(r.n, r.seed, r.a, 94210.40, r.amp));
  const pc = $('#pc'), pvs = $('.pvs'), pvv = $('#pvv'), pvc = $('#pvc'), pvd = $('#pvd'), pvdot = $('#pvdot'), pmk = $('.mk', pvs), pvt = $('#pvt');
  let pvK = 'm', pvPts = [], PW = 0, PH = 0;
  const nice = (mn, mx) => { const raw = (mx - mn) / 3, st = [250, 500, 1000, 2000, 2500, 5000].find(s => s >= raw) || 5000; const lo = Math.floor(mn / st) * st, hi = Math.ceil(mx / st) * st; const t = []; for (let v = lo; v <= hi + 1; v += st) t.push(v); return t; };
  const kfmt = v => '$' + (v / 1000).toFixed(v % 1000 ? 1 : 0) + 'K';
  const pvGeom = k => { const r = PVR[k], T = nice(Math.min(...r.v), Math.max(...r.v)), lo = T[0], hi = T[T.length - 1], yOf = v => 6 + (1 - (v - lo) / (hi - lo)) * (PH - 12);
    return { T, yOf, pts:r.v.map((v, i) => [i / (r.n - 1) * PW, yOf(v)]) }; };
  const pvWrite = P => { $('.ln', pvs).setAttribute('d', smooth(P)); $('.ar', pvs).setAttribute('d', smooth(P) + ` L${PW} ${PH} L0 ${PH} Z`); };
  const drawPV = morph => { PW = pc.offsetWidth - 48; PH = pc.offsetHeight; pvs.setAttribute('viewBox', `0 0 ${PW} ${PH}`); pmk.setAttribute('y2', PH);
    const g = pvGeom(pvK), from = pvPts; pvPts = g.pts;
    gridLines($('.grid', pvs), PW, g.T.map(g.yOf));
    $('.ya', pc).innerHTML = g.T.slice().reverse().map(k => `<span style="top:${g.yOf(k).toFixed(1)}px">${kfmt(k)}</span>`).join('');
    if (morph && from.length && !REDUCE){ const A = resample(from), B = resample(pvPts); ani('pv', 450, t => pvWrite(t >= 1 ? pvPts : lerpPts(A, B, t)));
      $$('.ya span, .grid line', pc).forEach(el => el.animate([{ opacity:0 }, { opacity:1 }], { duration:400, easing:'ease-out' })); }
    else pvWrite(pvPts);
    showPV(); };
  const pvDate = (r, i) => fmtD(new Date(PEND - (r.n - 1 - i) * r.step), r.time);
  function showPV(i){ const r = PVR[pvK], last = i == null; i = last ? r.n - 1 : i;
    pvdot.style.left = pvPts[i][0] + 'px'; pvdot.style.top = pvPts[i][1] + 'px';
    pmk.setAttribute('x1', pvPts[i][0]); pmk.setAttribute('x2', pvPts[i][0]);
    if (last){ pvt.hidden = true; pvv.textContent = money(r.v[i]); chg(pvc, (r.v[i] / r.v[0] - 1) * 100); pvd.textContent = r.label; return; }
    pvv.textContent = money(r.v[i]); chg(pvc, (r.v[i] / r.v[0] - 1) * 100); pvd.textContent = pvDate(r, i);
    placeTip(pvt, pc, pvPts[i][0], pvPts[i][1], `<b class="num">${money(r.v[i])}</b><br><span class="mut num">${pvDate(r, i)}</span>`); }
  pc.addEventListener('pointermove', e => { const x = local(pc, e)[0], r = PVR[pvK]; pc.classList.add('hov'); showPV(Math.max(0, Math.min(r.n - 1, Math.round(x / PW * (r.n - 1))))); });
  pc.addEventListener('pointerleave', () => { pc.classList.remove('hov'); showPV(); });

  /* 3. the receipt: copy the ID, the confirmations count on */
  const cp = $('#cp'), cpt = $('#cpt'), conf = $('#conf');
  cp.onclick = () => { try { navigator.clipboard.writeText('58201744').catch(() => {}); } catch(e){} cp.innerHTML = ICON.check; cp.style.color = 'var(--dm-ok)'; cpt.classList.add('on');
    clearTimeout(cp._t); cp._t = setTimeout(() => { cp.innerHTML = ICON.copy; cp.style.color = ''; cpt.classList.remove('on'); }, 1600); };
  let confN = 12;

  /* primary buttons confirm in place, then return */
  $$('.act').forEach(b => { const bl = $('.bl', b), rest = bl.innerHTML;
    const swapTo = html => { bl.innerHTML = html; if (!REDUCE) bl.animate([{ opacity:0, transform:'translateY(6px)' }, { opacity:1, transform:'none' }], { duration:350, easing:EASE }); };
    b.addEventListener('click', () => { if (b._busy) return; b._busy = true; swapTo(ICON.check + b.dataset.done);
      setTimeout(() => { swapTo(rest); b._busy = false; }, 2400); }); });

  /* the segmented controls: the knob slides under the pressed button */
  const knob = seg => { const b = $('button[aria-pressed="true"]', seg), k = $('.knob', seg); k.style.left = b.offsetLeft + 'px'; k.style.width = b.offsetWidth + 'px'; };
  const press = (seg, b) => { $$('button', seg).forEach(x => { x.setAttribute('aria-pressed', x === b); x.setAttribute('aria-selected', x === b); }); knob(seg); };

  /* 4. your assets: one total over a plain list */
  const A = [
    ['BTC', 'Bitcoin', '0.6104 BTC', 39620.40, 1.9], ['ETH', 'Ethereum', '9.8165 ETH', 31240.10, 2.8], ['SOL', 'Solana', '40.571 SOL', 12918.65, 5.1],
    ['USDC', 'Stablecoins', '10,431.25 USDC', 10431.25, 0], ['EUR', 'Euro', '€8,420.30', 9765.20, -.3], ['GBP', 'Pound', '£1,880.40', 2470.80, .4], ['USD', 'Dollar', '$2,060.00', 2060, 0],
  ];
  const rows = $('#rows'), tot = $('#tot'), totV = A.reduce((s, a) => s + a[3], 0);
  rows.innerHTML = A.map(([t, n, u, v, c]) => `<div class="ar-r"><span class="tk">${t}</span><span class="nm">${n}<span class="num">${u}</span></span><span class="vv num">${money(v)}<span class="${c > 0 ? 'ok' : c < 0 ? 'bad' : ''}">${c ? pct(c) : '0.0%'}</span></span></div>`).join('');
  tot.textContent = money(totV);

  /* 5. the price: range tabs morph the line; the pointer reads a point; the 1D line ticks live, sliding a new point in */
  let END = new Date(2026, 10, 16, 14, 32), NOW = 318.42;
  const R = {
    d:{ n:49, step:30 * 6e4, a:309.75, amp:4, seed:9, axis:['15 Nov, 14:32', 'Now'] },
    w:{ n:43, step:4 * 36e5, a:296.20, amp:9, seed:14, axis:['9 Nov', 'Now'] },
    m:{ n:31, step:864e5, a:341.30, amp:14, seed:23, axis:['17 Oct', 'Now'] },
    y:{ n:53, step:7 * 864e5, a:142.10, amp:38, seed:5, axis:['Nov 2025', 'Now'] },
  };
  Object.values(R).forEach(r => r.v = series(r.n, r.seed, r.a, NOW, r.amp));
  const price = $('.price'), psw = $('#psw'), ps = $('.ps'), pval = $('#pval'), pchg = $('#pchg'), pdate = $('#pdate'), pdot = $('#pdot'), xmk = $('.mk', ps), rng = $('.rng'), ptt = $('#ptt'), plive = $('#plive');
  let cur = 'd', pPts = [], PSW = 0, PSH = 0;
  const pScale = v => { const mn = Math.min(...v), mx = Math.max(...v); return [mn, mx]; };
  const pY = ([mn, mx], v) => 8 + (1 - (v - mn) / ((mx - mn) || 1)) * (PSH - 16);
  const pGeom = v => { const s = pScale(v); return v.map((x, i) => [i / (v.length - 1) * PSW, pY(s, x)]); };
  const pya = $('#pya');
  const pAxis = sc => pya.innerHTML = [0, .5, 1].map(f => `<span style="top:${(8 + f * (PSH - 16)).toFixed(1)}px">$${Math.round(sc[1] - f * (sc[1] - sc[0]))}</span>`).join('');
  const pWrite = P => { const ln = $('.ln', ps); ln.setAttribute('d', smooth(P)); const e = ln.getPointAtLength(ln.getTotalLength()); plive.style.left = e.x + 'px'; plive.style.top = e.y + 'px'; };
  const pd = (r, i) => fmtD(new Date(END - (r.n - 1 - i) * r.step), r.step < 864e5);
  const pHead = i => { const r = R[cur], last = i == null; i = last ? r.n - 1 : i;
    if (last) roll(pval, money(r.v[i])); else pval.textContent = money(r.v[i]);
    chg(pchg, (r.v[i] / r.v[0] - 1) * 100); pdate.textContent = last ? fmtD(END, true) : pd(r, i); };
  const drawP = mode => { const r = R[cur]; PSW = psw.offsetWidth - 48; PSH = psw.offsetHeight; ps.setAttribute('viewBox', `0 0 ${PSW} ${PSH}`);
    const from = pPts; pPts = pGeom(r.v);
    gridLines($('.grid', ps), PSW, [0, .5, 1].map(f => 8 + f * (PSH - 16))); xmk.setAttribute('y2', PSH);
    $$('#pxa span').forEach((s, i) => s.textContent = r.axis[i]); pAxis(pScale(r.v));
    if (mode === 'morph' && from.length && !REDUCE){ const A = resample(from), B = resample(pPts); ani('p', 450, t => pWrite(t >= 1 ? pPts : lerpPts(A, B, t))); }
    else pWrite(pPts);
    pHead(); };
  psw.addEventListener('pointermove', e => { const x = local(psw, e)[0], r = R[cur], i = Math.max(0, Math.min(r.n - 1, Math.round(x / PSW * (r.n - 1))));
    psw.classList.add('hov'); pHead(i);
    pdot.style.left = pPts[i][0] + 'px'; pdot.style.top = pPts[i][1] + 'px'; xmk.setAttribute('x1', pPts[i][0]); xmk.setAttribute('x2', pPts[i][0]);
    placeTip(ptt, psw, pPts[i][0], pPts[i][1], `<b class="num">${money(r.v[i])}</b><br><span class="mut num">${pd(r, i)}</span>`); });
  psw.addEventListener('pointerleave', () => { psw.classList.remove('hov'); ptt.hidden = true; pHead(); });
  $$('button', rng).forEach(b => b.onclick = () => { if (b.dataset.r === cur) return; press(rng, b); cur = b.dataset.r; drawP('morph');
    if (!REDUCE) pchg.animate([{ opacity:0, transform:'scale(.9)' }, { opacity:1, transform:'none' }], { duration:350, easing:SPRING }); });
  // a live tick: a small step in the price, the digits roll; on 1D the line slides left as the new point comes in
  const tick = () => {
    const nv = Math.round(NOW * (1 + (rnd() - .47) * .005) * 100) / 100; NOW = nv; END = new Date(+END + 6e4);
    Object.entries(R).forEach(([k, r]) => { if (k !== 'd') r.v[r.n - 1] = nv; });
    const d = R.d, V = d.v, V2 = V.slice(1).concat(nv);
    if (cur === 'd' && !REDUCE){ const C = V.concat(nv), s0 = pScale(V), s1 = pScale(V2), n = V.length;
      ani('p', 500, t => { const s = [s0[0] + (s1[0] - s0[0]) * t, s0[1] + (s1[1] - s0[1]) * t]; pWrite(C.map((v, i) => [(i - t) / (n - 1) * PSW, pY(s, v)])); });
      d.v = V2; pPts = pGeom(V2); pHead(); pAxis(s1); }
    else { d.v = V2; drawP('morph'); }
  };

  /* 6. swap: the flip turns half a turn and the two sides trade places with a short slide */
  const SW = [{ c:'ETH', a:'0.50', bal:'Balance 9.817' }, { c:'SOL', a:'4.997', bal:'Balance 40.57' }], RATE = ['1 ETH = 9.994 SOL', '1 SOL = 0.1001 ETH'];
  let flipped = false, turns = 0;
  const flip = $('#flip'), sbs = $$('.sb'), rate = $('#rate');
  const paintSwap = () => { const o = flipped ? [SW[1], SW[0]] : SW;
    sbs.forEach((b, i) => { $('.sa', b).textContent = o[i].a; $('.cn', b).textContent = o[i].c; $('.bal', b).textContent = o[i].bal; });
    rate.textContent = RATE[flipped ? 1 : 0]; };
  flip.onclick = () => { flipped = !flipped; turns++; $('svg', flip).style.transform = `rotate(${turns * 180}deg)`;
    if (REDUCE) return paintSwap();
    const parts = i => [$('.sa', sbs[i]), $('.cn', sbs[i]), $('.bal', sbs[i])];
    sbs.forEach((b, i) => parts(i).concat(i ? [] : [rate]).forEach(el => el.animate([{ opacity:1, transform:'none' }, { opacity:0, transform:`translateY(${i ? -10 : 10}px)` }], { duration:180, easing:'ease-in', fill:'forwards' })));
    setTimeout(() => { paintSwap(); sbs.forEach((b, i) => parts(i).concat(i ? [] : [rate]).forEach(el => { el.getAnimations().forEach(a => a.cancel());
      el.animate([{ opacity:0, transform:`translateY(${i ? 10 : -10}px)` }, { opacity:1, transform:'none' }], { duration:320, easing:EASE }); })); }, 180); };

  /* 7. allocation: one stacked bar in the chart palette, the legend as a list; hovering either lifts the part, dims the rest
     and reads it */
  const AL = [['Bitcoin', 'var(--dm-c1)', 39620.40, '0.6104 BTC'], ['Ethereum', 'var(--dm-c2)', 31240.10, '9.8165 ETH'], ['Solana', 'var(--dm-c3)', 12918.65, '40.571 SOL'], ['Stablecoins', 'var(--dm-c4)', 10431.25, '10,431.25 USDC']];
  const ALT = AL.reduce((s, a) => s + a[2], 0), ab = $('#ab'), al = $('#al'), atip = $('#atip'), alloc = $('.alloc');
  ab.innerHTML = AL.map(([n, c, v]) => `<i style="background:${c};flex:${v} 1 0"></i>`).join('');
  al.innerHTML = AL.map(([n, c, v, u]) => `<div class="lr"><i style="background:${c}"></i><span class="n">${n}</span><span class="u mut num">${u}</span><span class="p num">${Math.round(v / ALT * 100)}%</span></div>`).join('');
  const segs = $$('i', ab), lrs = $$('.lr', al);
  const hl = k => { ab.classList.toggle('hv', k != null); al.classList.toggle('hv', k != null); segs.forEach((s, i) => s.classList.toggle('on', i === k)); lrs.forEach((s, i) => s.classList.toggle('on', i === k));
    if (k == null) return atip.hidden = true;
    const [n, c, v, u] = AL[k]; atip.innerHTML = `<i style="background:${c}"></i><b>${n}</b> · ${(v / ALT * 100).toFixed(1)}%<br><span class="mut num">${u}</span>`; atip.hidden = false;
    const s = segs[k], x = ab.offsetLeft + s.offsetLeft + s.offsetWidth / 2; atip.style.left = Math.max(12, Math.min(alloc.offsetWidth - atip.offsetWidth - 12, x - atip.offsetWidth / 2)) + 'px'; atip.style.top = ab.offsetTop - atip.offsetHeight - 10 + 'px'; };
  [segs, lrs].forEach(list => list.forEach((el, i) => { el.addEventListener('pointerenter', () => hl(i)); el.addEventListener('pointerleave', () => hl(null)); }));

  /* 8. price alerts: a switch on each; "+" slides a new one in at the top; now and then an alert fires and says so */
  const AR = [{ t:'BTC', n:'Bitcoin above $72,000', s:'Push and email', on:true }, { t:'ETH', n:'Ethereum below $3,000', s:'Push', on:true }, { t:'SOL', n:'Solana moves 5% in a day', s:'Push', on:false }, { t:'EUR', n:'Euro below $1.14', s:'Email, once a day', on:true }];
  const NEW = [{ t:'SOL', n:'Solana above $340', s:'Push' }, { t:'BTC', n:'Bitcoin below $60,000', s:'Push and email' }, { t:'ETH', n:'Ethereum above $3,400', s:'Push' }];
  const arows = $('#arows'), aon = $('#aon');
  const rowHTML = a => `<div class="al-r"><span class="tk">${a.t}</span><span class="nm">${a.n}<span class="sub"><span>${a.on ? a.s : 'Paused'}</span></span></span><button class="toggle" role="switch" aria-checked="${a.on}" aria-label="${a.n}"></button></div>`;
  const subTo = (row, text) => { const sub = $('.sub', row); while (sub.children.length > 1) sub.firstElementChild.remove(); const old = sub.lastElementChild; if (old && old.textContent === text) return;
    if (old){ old.getAnimations().forEach(a => a.cancel()); old.style.position = ''; }
    if (REDUCE){ sub.innerHTML = `<span>${text}</span>`; return; }
    const nu = document.createElement('span'); nu.textContent = text; nu.style.position = 'absolute'; nu.style.left = 0; nu.style.top = 0; sub.appendChild(nu);
    if (old) old.animate([{ transform:'none', opacity:1 }, { transform:'translateY(-100%)', opacity:0 }], { duration:350, easing:EASE, fill:'forwards' }).onfinish = () => { old.remove(); nu.style.position = ''; };
    nu.animate([{ transform:'translateY(100%)', opacity:0 }, { transform:'none', opacity:1 }], { duration:400, easing:EASE }); };
  const countOn = () => roll(aon, $$('.toggle[aria-checked="true"]', arows).length + ' on');
  const wire = row => { const a = row._a; row.onclick = () => { a.on = !a.on; $('.toggle', row).setAttribute('aria-checked', a.on); row.classList.remove('fired'); subTo(row, a.on ? a.s : 'Paused'); countOn(); }; };
  arows.innerHTML = AR.map(rowHTML).join(''); $$('.al-r', arows).forEach((r, i) => { r._a = AR[i]; wire(r); });
  countOn();
  let addN = 0;
  $('#add').onclick = () => { const a = Object.assign({ on:true }, NEW[addN++ % NEW.length]), t = document.createElement('div'); t.innerHTML = rowHTML(a); const row = t.firstChild; row._a = a; wire(row);
    arows.prepend(row); countOn();
    if (!REDUCE) row.animate([{ height:'0px', opacity:0, transform:'translateY(-8px)' }, { height:'56px', opacity:1, transform:'none' }], { duration:450, easing:EASE });
    $$('.al-r', arows).slice(7).forEach(r => r.remove()); };
  let fireI = 0;
  const fire = () => { const on = $$('.al-r', arows).filter(r => r._a.on && !r.classList.contains('fired')); if (!on.length) return; const row = on[fireI++ % on.length];
    row.classList.add('fired'); subTo(row, 'Triggered just now'); setTimeout(() => { if (!row.classList.contains('fired')) return; row.classList.remove('fired'); subTo(row, row._a.on ? row._a.s : 'Paused'); }, 6000); };

  /* quiet live motion: it starts once the load has settled, waits while the pointer is on its card, and never runs with
     reduced motion */
  let liveAt = 0;
  const live = (card, min, max, fn) => { if (REDUCE) return; const next = () => setTimeout(() => { if (performance.now() >= liveAt && !card.classList.contains('hold') && !document.hidden) fn(); next(); }, min + rnd() * (max - min)); next(); };
  live(price, 3000, 4000, tick);
  live($('.tx'), 5000, 7000, () => roll(conf, String(++confN)));
  live($('.alerts'), 11000, 14000, fire);

  /* the load choreography. Every WAAPI animation starts inside play() itself (the export scrubs them); counters run on
     requestAnimationFrame */
  const fade = (el, ms, delay, from = {}, to = {}) => { if (REDUCE || !el) return; el.animate([Object.assign({ opacity:0 }, from), Object.assign({ opacity:1, transform:'none', filter:'blur(0)' }, to)], { duration:ms, delay, easing:EASE, fill:'backwards' }); };
  function drawLine(el, ms, delay){ if (REDUCE) return; const L = el.getTotalLength();
    el.animate([{ strokeDasharray:`${L} ${L}`, strokeDashoffset:L }, { strokeDasharray:`${L} ${L}`, strokeDashoffset:0 }], { duration:ms, delay, easing:EASE, fill:'backwards' }); }
  const count = (el, delay, ms, a, b, fmt) => { el.textContent = fmt(REDUCE ? b : a); wait(delay).then(() => tween(ms, t => el.textContent = fmt(a + (b - a) * t))); };
  function play(){
    RUN++; liveAt = performance.now() + (REDUCE ? 0 : 9000);
    // cards rise in, in reading order
    $$('.cd').forEach((c, i) => fade(c, 700, 80 + i * 70, { transform:'translateY(16px) scale(.985)', filter:'blur(6px)' }));
    // the ticks fill to the score as it counts
    KEYS.gauge = null; gTo = CR.score; gauge(REDUCE ? CR.score : CR.lo);
    wait(450).then(() => tween(1500, t => gauge(CR.lo + (CR.score - CR.lo) * t), inOut));
    // portfolio: the line draws, the area and the end dot follow, the value counts from the range's start
    showPV(); drawLine($('.ln', pvs), 1400, 550); fade($('.ar', pvs), 800, 1100); fade(pvdot, 500, 1800, { transform:'scale(.4)' });
    count(pvv, 550, 1400, PVR[pvK].v[0], PVR[pvK].v[PVR[pvK].n - 1], money);
    // the receipt: the amount counts, the path and rows settle
    count($('#amt'), 600, 900, 0, .0418, v => v.toFixed(4) + ' ETH');
    $$('.pp, .dl div').forEach((r, i) => fade(r, 500, 650 + i * 60, { transform:'translateY(8px)' }));
    // assets
    $$('.ar-r', rows).forEach((r, i) => fade(r, 500, 700 + i * 60, { transform:'translateY(10px)', filter:'blur(3px)' }));
    count(tot, 650, 1200, totV * .94, totV, money);
    // the price line draws as the price counts to its last value; the live dot comes in after
    drawLine($('.ln', ps), 1100, 750); count(pval, 750, 1100, R[cur].v[0], NOW, money); fade(plive, 500, 1900, { transform:'scale(.4)' });
    // swap fields
    sbs.forEach((b, i) => fade(b, 500, 800 + i * 80, { transform:'translateY(8px)' })); fade(flip, 500, 1000, { transform:'scale(.6)' });
    // the bar grows from the left, a part at a time; the legend follows
    segs.forEach((s, i) => { if (!REDUCE) s.animate([{ transform:'scaleX(0)' }, { transform:'scaleX(1)' }], { duration:650, delay:900 + i * 80, easing:EASE, fill:'backwards' }); });
    lrs.forEach((r, i) => fade(r, 500, 1000 + i * 70, { transform:'translateY(8px)' }));
    // alerts
    $$('.al-r', arows).forEach((r, i) => fade(r, 500, 1000 + i * 70, { transform:'translateY(8px)' }));
  }

  /* the page: scale the artboard to the window, theme and replay */
  const board = $('#board'), fitEl = $('.fit');
  const scale = () => { const s = Math.min(1, (innerWidth - 48) / 1600); board.style.transform = `scale(${s})`; fitEl.style.height = 1200 * s + 48 + 'px'; };
  addEventListener('resize', scale); scale();
  const paint = () => $$('.seg button').forEach(b => b.setAttribute('aria-pressed', document.documentElement.dataset.theme === b.dataset.t));
  $$('.seg button').forEach(b => b.onclick = () => { document.documentElement.dataset.theme = b.dataset.t; try { localStorage.setItem('dmui-theme', b.dataset.t); } catch(e){} paint(); });
  paint();
  drawPV(false); drawP(); paintSwap(); knob(rng);
  // knobs measure text, so measure again once the fonts are in
  document.fonts && document.fonts.ready.then(() => knob(rng));
  // charts are drawn at their box's size; draw them again if a box changes (fonts settling, a resize)
  if (window.ResizeObserver) new ResizeObserver(() => { if (psw.offsetWidth - 48 !== PSW || psw.offsetHeight !== PSH) drawP(); if (pc.offsetWidth - 48 !== PW || pc.offsetHeight !== PH) drawPV(false); }).observe(document.getElementById('board'));
  $('#replay').onclick = () => { document.getAnimations().forEach(a => { if (a instanceof CSSAnimation || a instanceof CSSTransition) return; a.cancel(); }); play(); };
  play();
})();
