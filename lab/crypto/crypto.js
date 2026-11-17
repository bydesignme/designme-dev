/* Crypto dashboard, a Soft collection for posts: charts drawn from data, a load choreography (cards rise in, the ticks fill
   to the score, lines draw, the bar grows, numbers count up), hover readouts, range and asset tabs, a swap, alert switches
   and a copyable ID */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = 'cubic-bezier(.22,1,.36,1)';
  const ICON = {
    plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    copy:'<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/></svg>',
    check:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    flip:'<svg viewBox="0 0 24 24"><path d="M8 4v15M4 15l4 4 4-4M16 20V5M12 9l4-4 4 4"/></svg>',
    bank:'<svg viewBox="0 0 24 24"><path d="M3 9.5L12 4l9 5.5M5 10v8M9.7 10v8M14.3 10v8M19 10v8M3 20h18"/></svg>',
    wallet:'<svg viewBox="0 0 24 24"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3M4 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 1 4 7.5z"/><circle cx="16" cy="13.5" r="1.2"/></svg>',
  };
  $$('[data-ic]').forEach(b => b.innerHTML = ICON[b.dataset.ic]);
  const NS = 'http://www.w3.org/2000/svg';
  const money = (v, d = 2) => '$' + v.toLocaleString('en-US', { minimumFractionDigits:d, maximumFractionDigits:d });
  const pct = v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + '%';
  const chg = (el, v) => { el.textContent = pct(v); el.className = 'tag num ' + (v >= 0 ? 'ok' : 'bad'); };
  // the board is scaled to the window; this turns a client x/y into board pixels inside an element
  const local = (el, e) => { const r = el.getBoundingClientRect(), k = r.width / el.offsetWidth || 1; return [(e.clientX - r.left) / k, (e.clientY - r.top) / k]; };

  // a seeded walk pinned to a start and an end value, its wiggle scaled to amp: every load draws the same charts
  const series = (n, seed, a, b, amp) => { let s = seed, v = 0; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const w = Array.from({ length:n }, () => (v += (r() - .5)));
    const noise = w.map((x, i) => x - (w[0] + (w[n - 1] - w[0]) * i / (n - 1))), m = Math.max(...noise.map(Math.abs)) || 1;
    return noise.map((x, i) => a + (b - a) * i / (n - 1) + x / m * amp); };
  // a smooth line through points (Catmull-Rom as cubic Béziers)
  const smooth = P => P.map((p, i) => { if (!i) return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    const a = P[i - 2] || P[i - 1], b = P[i - 1], c = p, d = P[i + 1] || p, t = .18;
    return `C${(b[0] + (c[0] - a[0]) * t).toFixed(1)} ${(b[1] + (c[1] - a[1]) * t).toFixed(1)} ${(c[0] - (d[0] - b[0]) * t).toFixed(1)} ${(c[1] - (d[1] - b[1]) * t).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`; }).join(' ');
  const gridLines = (g, w, ys) => g.innerHTML = ys.map(y => `<line x1="0" x2="${w}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/>`).join('');

  /* 1. credit health: 72 ticks round a ring, filled up to the score; hovering a band names it */
  const CR = { lo:300, hi:850, score:712, n:72 };
  const BANDS = [['Poor', 300, 579], ['Fair', 580, 669], ['Good', 670, 739], ['Very good', 740, 799], ['Excellent', 800, 850]];
  const ticksG = $('.ticks'), score = $('#score'), ring = $('#ring'), ctip = $('#ctip'), credit = $('.credit');
  const tv = i => CR.lo + i / (CR.n - 1) * (CR.hi - CR.lo);
  ticksG.innerHTML = Array.from({ length:CR.n }, (_, i) => { const a = (i / CR.n) * 2 * Math.PI - Math.PI / 2, c = Math.cos(a), s = Math.sin(a);
    return `<line x1="${(100 + 72 * c).toFixed(2)}" y1="${(100 + 72 * s).toFixed(2)}" x2="${(100 + 86 * c).toFixed(2)}" y2="${(100 + 86 * s).toFixed(2)}"/>`; }).join('');
  const ticks = $$('line', ticksG), ON = Math.round((CR.score - CR.lo) / (CR.hi - CR.lo) * (CR.n - 1)) + 1;
  const fillTicks = k => ticks.forEach((t, i) => t.classList.toggle('on', i < k));
  const bandOf = v => BANDS.find(b => v <= b[2] + .5) || BANDS[BANDS.length - 1];
  $('.hit', ring).addEventListener('pointermove', e => {
    const [x, y] = local(ring, e), s = ring.offsetWidth / 200, a = Math.atan2(y / s - 100, x / s - 100) + Math.PI / 2;
    const i = Math.round(((a + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI) * CR.n) % CR.n, b = bandOf(tv(i));
    ticks.forEach((t, j) => { const v = tv(j); t.classList.toggle('hv', v >= b[1] - .5 && v <= b[2] + .5); });
    const here = CR.score >= b[1] && CR.score <= b[2];
    ctip.innerHTML = `<b>${b[0]}</b> · ${b[1]} to ${b[2]}${here ? '<br><span class="mut">Your score, ' + CR.score + '</span>' : ''}`; ctip.hidden = false;
    const [cx, cy] = local(credit, e); ctip.style.left = Math.min(cx + 14, credit.offsetWidth - ctip.offsetWidth - 8) + 'px'; ctip.style.top = Math.max(8, cy - ctip.offsetHeight - 10) + 'px';
  });
  $('.hit', ring).addEventListener('pointerleave', () => { ctip.hidden = true; ticks.forEach(t => t.classList.remove('hv')); });

  /* 2. portfolio value: 30 days, a soft accent area; the head's readout follows the pointer */
  const PV = series(31, 33, 87070, 94210.4, 2300), PV_D = i => new Date(2026, 9, 17 + i);
  const pc = $('#pc'), pvs = $('.pvs'), pvv = $('#pvv'), pvc = $('#pvc'), pvd = $('#pvd'), pvdot = $('#pvdot'), pmk = $('.mk', pvs);
  const PLO = 84000, PHI = 96000;
  let pvPts = [], PW = 0, PH = 0;
  const drawPV = () => { PW = pvs.clientWidth || pc.offsetWidth - 48; PH = pc.offsetHeight; pvs.setAttribute('viewBox', `0 0 ${PW} ${PH}`);
    const yOf = v => 6 + (1 - (v - PLO) / (PHI - PLO)) * (PH - 12);
    pvPts = PV.map((v, i) => [i / (PV.length - 1) * PW, yOf(v)]);
    $('.ln', pvs).setAttribute('d', smooth(pvPts)); $('.ar', pvs).setAttribute('d', smooth(pvPts) + ` L${PW} ${PH} L0 ${PH} Z`);
    gridLines($('.grid', pvs), PW, [84, 88, 92, 96].map(k => yOf(k * 1000)));
    $('.ya', pc).innerHTML = [96, 92, 88, 84].map(k => `<span style="top:${yOf(k * 1000).toFixed(1)}px">$${k}K</span>`).join(''); };
  const fmtPV = v => money(v);
  const showPV = i => { const last = i == null; i = last ? PV.length - 1 : i;
    pvdot.style.left = pvPts[i][0] + 'px'; pvdot.style.top = pvPts[i][1] + 'px';
    pmk.setAttribute('x1', pvPts[i][0]); pmk.setAttribute('x2', pvPts[i][0]); pmk.style.opacity = last ? 0 : 1;
    pvv.textContent = fmtPV(PV[i]); chg(pvc, (PV[i] / PV[0] - 1) * 100);
    pvd.textContent = last ? 'Last 30 days, to 16 Nov' : PV_D(i).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) + ', since 17 Oct'; };
  pc.addEventListener('pointermove', e => { const x = local(pc, e)[0]; let i = 0, best = 1e9; pvPts.forEach((p, k) => { const d = Math.abs(p[0] - x); if (d < best){ best = d; i = k; } }); showPV(i); });
  pc.addEventListener('pointerleave', () => showPV());

  /* 3. the receipt: copy the ID */
  const cp = $('#cp');
  cp.onclick = () => { try { navigator.clipboard.writeText('58201744').catch(() => {}); } catch(e){} cp.innerHTML = ICON.check + '<span>Copied</span>'; cp.style.color = 'var(--dm-ok)';
    clearTimeout(cp._t); cp._t = setTimeout(() => { cp.innerHTML = ICON.copy; cp.style.color = ''; }, 1600); };
  const steps = $$('#tl li'), stepTo = k => steps.forEach((s, i) => s.classList.toggle('done', i < k));

  /* the segmented controls: the knob sits under the pressed button */
  const knob = seg => { const b = $('button[aria-pressed="true"]', seg), k = $('.knob', seg); k.style.left = b.offsetLeft + 'px'; k.style.width = b.offsetWidth + 'px'; };
  const press = (seg, b) => { $$('button', seg).forEach(x => { x.setAttribute('aria-pressed', x === b); x.setAttribute('aria-selected', x === b); }); knob(seg); };

  /* 4. your assets: one total, a plain list, three views */
  const A = [
    ['BTC', 'Bitcoin', '0.6104 BTC', 39620.40, 1.9, 'crypto'], ['ETH', 'Ethereum', '9.8165 ETH', 31240.10, 2.8, 'crypto'],
    ['SOL', 'Solana', '40.571 SOL', 12918.65, 5.1, 'crypto'], ['USDC', 'Stablecoins', '10,431.25 USDC', 10431.25, 0, 'crypto'],
    ['EUR', 'Euro', '€8,420.30', 9765.20, -.3, 'cash'], ['GBP', 'Pound', '£1,880.40', 2470.80, .4, 'cash'], ['USD', 'Dollar', '$2,060.00', 2060, 0, 'cash'],
  ];
  const WEEK = { all:612.40, crypto:631.80, cash:-19.40 };
  const rows = $('#rows'), tot = $('#tot'), tabs = $('.assets .tabs');
  const sum = k => A.filter(a => k === 'all' || a[5] === k).reduce((s, a) => s + a[3], 0);
  const paintRows = (k, anim) => { const list = A.filter(a => k === 'all' || a[5] === k);
    rows.innerHTML = list.map(([t, n, u, v, c]) => `<div class="ar-r"><span class="tk">${t}</span><span class="nm">${n}<span class="num">${u}</span></span><span class="vv num">${money(v)}<span class="${c > 0 ? 'ok' : c < 0 ? 'bad' : ''}">${c ? pct(c) : '0.0%'}</span></span></div>`).join('');
    $('.assets .hd .mut').textContent = list.length + ' holdings';
    const g = $('.assets .gain .tag'), w = WEEK[k]; g.textContent = (w >= 0 ? '+' : '−') + money(Math.abs(w)); g.className = 'tag num ' + (w >= 0 ? 'ok' : 'bad');
    if (anim && !REDUCE){ $$('.ar-r', rows).forEach((r, i) => r.animate([{ opacity:0, transform:'translateY(8px)' }, { opacity:1, transform:'none' }], { duration:420, delay:i * 40, easing:EASE, fill:'backwards' }));
      const from = parseFloat(tot.textContent.replace(/[$,]/g, '')), to = sum(k); tween(600, t => tot.textContent = money(from + (to - from) * t)); }
    else tot.textContent = money(sum(k)); };
  $$('button', tabs).forEach(b => b.onclick = () => { press(tabs, b); paintRows(b.dataset.v, true); });

  /* 5. the price: range tabs switch the line; the head reads the hovered point */
  const END = new Date(2026, 10, 16, 14, 32), NOW = 318.42;
  const R = {
    d:{ n:49, step:30 * 6e4, a:309.75, amp:4, seed:9, axis:['15 Nov, 14:32', 'Now'] },
    w:{ n:43, step:4 * 36e5, a:296.20, amp:9, seed:14, axis:['9 Nov', 'Now'] },
    m:{ n:31, step:864e5, a:341.30, amp:14, seed:23, axis:['17 Oct', 'Now'] },
    y:{ n:53, step:7 * 864e5, a:142.10, amp:38, seed:5, axis:['Nov 2025', 'Now'] },
  };
  Object.values(R).forEach(r => r.v = series(r.n, r.seed, r.a, NOW, r.amp));
  const psw = $('#psw'), ps = $('.ps'), pval = $('#pval'), pchg = $('#pchg'), pdate = $('#pdate'), pdot = $('#pdot'), xmk = $('.mk', ps), rng = $('.rng');
  let cur = 'd', pPts = [];
  const pd = (r, i) => { const d = new Date(END - (r.n - 1 - i) * r.step);
    return r.step < 864e5 ? d.toLocaleDateString('en-GB', { day:'numeric', month:'short' }) + ', ' + d.toTimeString().slice(0, 5) : d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }); };
  const drawP = anim => { const r = R[cur], W = psw.offsetWidth, H = psw.offsetHeight; ps.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const mn = Math.min(...r.v), mx = Math.max(...r.v), yOf = v => 8 + (1 - (v - mn) / (mx - mn)) * (H - 16);
    pPts = r.v.map((v, i) => [i / (r.n - 1) * W, yOf(v)]);
    const ln = $('.ln', ps); ln.setAttribute('d', smooth(pPts)); gridLines($('.grid', ps), W, [0, .5, 1].map(f => 8 + f * (H - 16)));
    $$('#pxa span').forEach((s, i) => s.textContent = r.axis[i]);
    xmk.setAttribute('y2', H); showP();
    if (anim) drawLine(ln, 700, 0); };
  const showP = i => { const r = R[cur], last = i == null; i = last ? r.n - 1 : i;
    pval.textContent = money(r.v[i]); chg(pchg, (r.v[i] / r.v[0] - 1) * 100); pdate.textContent = last ? '16 Nov, 14:32' : pd(r, i);
    pdot.style.left = pPts[i][0] + 'px'; pdot.style.top = pPts[i][1] + 'px'; xmk.setAttribute('x1', pPts[i][0]); xmk.setAttribute('x2', pPts[i][0]); };
  psw.addEventListener('pointermove', e => { const x = local(psw, e)[0], r = R[cur]; showP(Math.max(0, Math.min(r.n - 1, Math.round(x / psw.offsetWidth * (r.n - 1))))); });
  psw.addEventListener('pointerleave', () => showP());
  $$('button', rng).forEach(b => b.onclick = () => { press(rng, b); cur = b.dataset.r; drawP(!REDUCE); });

  /* 6. swap: the flip trades the two sides */
  const SW = [{ c:'ETH', a:'0.50', bal:'Balance 9.817' }, { c:'SOL', a:'4.997', bal:'Balance 40.57' }], RATE = ['1 ETH = 9.994 SOL', '1 SOL = 0.1001 ETH'];
  let flipped = false;
  const flip = $('#flip'), sbs = $$('.sb');
  const paintSwap = () => { const o = flipped ? [SW[1], SW[0]] : SW;
    sbs.forEach((b, i) => { $('.sa', b).textContent = o[i].a; $('.cn', b).textContent = o[i].c; $('.bal', b).textContent = o[i].bal; });
    $('#rate').textContent = RATE[flipped ? 1 : 0]; };
  flip.onclick = () => { flipped = !flipped; flip.classList.toggle('r', flipped);
    if (REDUCE) return paintSwap();
    sbs.forEach((b, i) => { const els = [$('.sa', b), $('.cn', b), $('.bal', b)], dy = i ? -10 : 10;
      els.forEach(el => el.animate([{ opacity:1, transform:'none' }, { opacity:0, transform:`translateY(${dy}px)` }], { duration:160, easing:'ease-in' }).onfinish = () => {}); });
    setTimeout(() => { paintSwap(); sbs.forEach((b, i) => [$('.sa', b), $('.cn', b), $('.bal', b)].forEach(el => el.animate([{ opacity:0, transform:`translateY(${i ? 10 : -10}px)` }, { opacity:1, transform:'none' }], { duration:320, easing:EASE }))); }, 150); };

  /* 7. allocation: one stacked bar in the chart palette, the legend as a list; hovering either reads one part */
  const AL = [['Bitcoin', 'var(--dm-c1)', 39620.40, '0.6104 BTC'], ['Ethereum', 'var(--dm-c2)', 31240.10, '9.8165 ETH'], ['Solana', 'var(--dm-c3)', 12918.65, '40.571 SOL'], ['Stablecoins', 'var(--dm-c4)', 10431.25, '10,431.25 USDC']];
  const ALT = AL.reduce((s, a) => s + a[2], 0), ab = $('#ab'), al = $('#al'), atip = $('#atip'), alloc = $('.alloc');
  ab.innerHTML = AL.map(([n, c, v]) => `<i style="background:${c};flex:${v} 1 0"></i>`).join('');
  al.innerHTML = AL.map(([n, c, v, u]) => `<div class="lr"><i style="background:${c}"></i><span class="n">${n}</span><span class="u mut num">${u}</span><span class="p num">${Math.round(v / ALT * 100)}%</span><span class="v num">${money(v)}</span></div>`).join('');
  const segs = $$('i', ab), lrs = $$('.lr', al);
  const hl = k => { ab.classList.toggle('hv', k != null); al.classList.toggle('hv', k != null); segs.forEach((s, i) => s.classList.toggle('on', i === k)); lrs.forEach((s, i) => s.classList.toggle('on', i === k));
    if (k == null) return atip.hidden = true;
    const [n, c, v, u] = AL[k]; atip.innerHTML = `<i style="background:${c}"></i><b>${n}</b> · ${(v / ALT * 100).toFixed(1)}%<br><span class="num">${money(v)} · ${u}</span>`; atip.hidden = false;
    const s = segs[k], x = ab.offsetLeft + s.offsetLeft + s.offsetWidth / 2; atip.style.left = Math.max(12, Math.min(alloc.offsetWidth - atip.offsetWidth - 12, x - atip.offsetWidth / 2)) + 'px'; atip.style.top = ab.offsetTop - atip.offsetHeight - 8 + 'px'; };
  [segs, lrs].forEach(list => list.forEach((el, i) => { el.addEventListener('pointerenter', () => hl(i)); el.addEventListener('pointerleave', () => hl(null)); }));

  /* 8. price alerts: a switch on each */
  const AR = [['BTC', 'Bitcoin above $72,000', 'Push and email', true], ['ETH', 'Ethereum below $3,000', 'Push', true], ['SOL', 'Solana moves 5% in a day', 'Push', false], ['EUR', 'Euro below $1.14', 'Email, once a day', true]];
  const arows = $('#arows'), aon = $('#aon');
  arows.innerHTML = AR.map(([t, n, s, on], i) => `<div class="al-r" data-i="${i}"><span class="tk">${t}</span><span class="nm">${n}<span>${on ? s : 'Paused'}</span></span><button class="toggle" role="switch" aria-checked="${on}" aria-label="${n}"></button></div>`).join('');
  const countOn = () => aon.textContent = $$('.toggle[aria-checked="true"]', arows).length + ' on';
  $$('.al-r', arows).forEach(r => r.onclick = () => { const b = $('.toggle', r), on = b.getAttribute('aria-checked') !== 'true', a = AR[+r.dataset.i];
    b.setAttribute('aria-checked', on); $('.nm span', r).textContent = on ? a[2] : 'Paused'; countOn(); });
  countOn();

  /* the load choreography. Every WAAPI animation starts inside play() itself (the export scrubs them); counters run on
     requestAnimationFrame */
  let RUN = 0;
  function tween(ms, f, ease = t => 1 - Math.pow(1 - t, 3)){ return new Promise(res => { if (REDUCE){ f(1); return res(); } const t0 = performance.now(), run = RUN;
    const s = () => { if (run !== RUN) return; const p = Math.min(1, (performance.now() - t0) / ms); f(ease(p)); p < 1 ? requestAnimationFrame(s) : res(); }; requestAnimationFrame(s); }); }
  const wait = ms => { const run = RUN; return new Promise(r => setTimeout(() => run === RUN && r(), REDUCE ? 0 : ms)); };
  function drawLine(el, ms, delay){ if (REDUCE) return; const L = el.getTotalLength();
    el.animate([{ strokeDasharray:`${L} ${L}`, strokeDashoffset:L }, { strokeDasharray:`${L} ${L}`, strokeDashoffset:0 }], { duration:ms, delay, easing:EASE, fill:'backwards' }); }
  const fade = (el, ms, delay, from = {}, to = {}) => { if (REDUCE || !el) return; el.animate([Object.assign({ opacity:0 }, from), Object.assign({ opacity:1, transform:'none', filter:'blur(0)' }, to)], { duration:ms, delay, easing:EASE, fill:'backwards' }); };
  const count = (el, delay, ms, a, b, fmt) => { el.textContent = fmt(REDUCE ? b : a); wait(delay).then(() => tween(ms, t => el.textContent = fmt(a + (b - a) * t))); };
  const inOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  async function play(){
    RUN++;
    // cards rise in, in reading order
    $$('.cd').forEach((c, i) => fade(c, 700, 80 + i * 70, { transform:'translateY(16px) scale(.985)', filter:'blur(6px)' }));
    // the ticks fill to the score as it counts
    fillTicks(REDUCE ? ON : 0); score.textContent = REDUCE ? CR.score : CR.lo;
    wait(450).then(() => tween(1500, t => { fillTicks(Math.round(ON * t)); score.textContent = Math.round(CR.lo + (CR.score - CR.lo) * t); }, inOut));
    // portfolio: the line draws, the area and the end dot follow, the value counts from the month's start
    showPV(); drawLine($('.ln', pvs), 1400, 550); fade($('.ar', pvs), 800, 1100); fade(pvdot, 500, 1800, { transform:'scale(.4)' });
    count(pvv, 550, 1400, PV[0], PV[PV.length - 1], fmtPV);
    // the receipt: the amount counts, the path and rows settle, the steps tick through
    count($('#amt'), 600, 900, 0, .0418, v => v.toFixed(4) + ' ETH');
    $$('.pp, .dl div').forEach((r, i) => fade(r, 500, 650 + i * 60, { transform:'translateY(8px)' }));
    stepTo(REDUCE ? 3 : 0); [900, 1300, 1700].forEach((ms, i) => wait(ms).then(() => stepTo(i + 1)));
    // assets
    $$('.ar-r', rows).forEach((r, i) => fade(r, 500, 700 + i * 60, { transform:'translateY(10px)', filter:'blur(3px)' }));
    count(tot, 650, 1200, sum('all') * .94, sum(tabs.querySelector('[aria-pressed="true"]').dataset.v), money);
    // the price line draws as the price counts to its last value
    drawLine($('.ln', ps), 1100, 750); count(pval, 750, 1100, R[cur].v[0], NOW, money);
    // swap fields
    sbs.forEach((b, i) => fade(b, 500, 800 + i * 90, { transform:'translateY(8px)' })); fade(flip, 500, 1000, { transform:'scale(.6)' });
    // the bar grows from the left, a part at a time; the legend follows
    segs.forEach((s, i) => { if (!REDUCE) s.animate([{ transform:'scaleX(0)' }, { transform:'scaleX(1)' }], { duration:650, delay:900 + i * 140, easing:EASE, fill:'backwards' }); });
    lrs.forEach((r, i) => fade(r, 500, 1000 + i * 80, { transform:'translateY(8px)' }));
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
  drawPV(); paintRows('all'); drawP(false); paintSwap(); knob(tabs); knob(rng);
  // knobs and charts measure text, so measure again once the fonts are in
  document.fonts && document.fonts.ready.then(() => { knob(tabs); knob(rng); });
  $('#replay').onclick = () => { document.getAnimations().forEach(a => a.cancel()); play(); };
  play();
})();
