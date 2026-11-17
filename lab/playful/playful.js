/* Playful lab: a tiny spring engine and the three components' motion. No libraries.
   Springs: semi-implicit Euler, sub-stepped for stability; each spring has a target, a stiffness k and damping c. Low damping
   is the jelly overshoot, high stiffness the snap. Reduced motion: every spring jumps to its target and nothing loops */
(() => {
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  class Spring {
    constructor(v = 0, k = 200, c = 16){ this.x = v; this.v = 0; this.t = v; this.k = k; this.c = c; }
    step(dt){ const n = 4, h = dt / n; for (let i = 0; i < n; i++){ const f = -this.k * (this.x - this.t) - this.c * this.v; this.v += f * h; this.x += this.v * h; }
      if (REDUCE){ this.x = this.t; this.v = 0; } return Math.abs(this.v) > .0005 || Math.abs(this.x - this.t) > .0005; }
    set(v){ this.x = this.t = v; this.v = 0; }
  }
  // one loop for everything that is moving; a tick returns true while it still moves
  const live = new Set(); let raf = 0, last = 0;
  const loop = t => { const dt = Math.min(.034, (t - last) / 1000) || .016; last = t; for (const f of [...live]) if (!f(dt)) live.delete(f); raf = live.size ? requestAnimationFrame(loop) : 0; };
  const kick = f => { live.add(f); if (!raf){ last = performance.now(); raf = requestAnimationFrame(loop); } };
  const anim = (el, kf, o) => REDUCE ? null : el.animate(kf, o);
  const JELLY = 'cubic-bezier(.34,1.56,.64,1)', OUT = 'cubic-bezier(.22,1,.36,1)';

  /* ---------- 1. puffy keys and the glassy primary: magnetic hover, puff, squash and a jelly release ---------- */
  $$('[data-spring]').forEach(el => {
    const mx = new Spring(0, 220, 15), my = new Spring(0, 220, 15), sx = new Spring(1, 520, 12), sy = new Spring(1, 520, 12);
    let down = false, over = false;
    const tick = dt => { const a = [mx, my, sx, sy].map(s => s.step(dt)).some(Boolean);
      el.style.setProperty('--mx', mx.x.toFixed(2) + 'px'); el.style.setProperty('--my', my.x.toFixed(2) + 'px');
      el.style.setProperty('--sx', sx.x.toFixed(4)); el.style.setProperty('--sy', sy.x.toFixed(4)); return a; };
    const rest = () => { const p = down ? [1.1, .86] : over ? [1.04, 1.04] : [1, 1]; sx.t = p[0]; sy.t = p[1]; kick(tick); };
    el.addEventListener('pointermove', e => { const b = el.getBoundingClientRect(), dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2);
      mx.t = clamp(dx * .22, -9, 9); my.t = clamp(dy * .3, -7, 7); kick(tick); });
    el.addEventListener('pointerenter', () => { over = true; rest();
      const sh = $('.pf-sheen', el); if (sh) anim(sh, [{ transform:'translateX(-120%)' }, { transform:'translateX(120%)' }], { duration:750, easing:OUT }); });
    el.addEventListener('pointerleave', () => { over = false; down = false; mx.t = 0; my.t = 0; rest(); });
    const press = () => { down = true; sx.k = sy.k = 900; sx.c = sy.c = 22; rest(); };
    const release = () => { down = false; sx.k = sy.k = 520; sx.c = sy.c = 9; rest(); setTimeout(() => { sx.c = sy.c = 12; }, 500); };
    el.addEventListener('pointerdown', press); el.addEventListener('pointerup', release);
    el.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !down){ press(); } });
    el.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') release(); });
  });

  /* ---------- 2. the score gauge: a sticky glass knob that follows the pointer round the arc, stretches as it travels and
     springs back to the score with a jelly overshoot; the digits roll; the whole gauge leans toward the pointer ---------- */
  const sc = $('.pf-score');
  if (sc){
    const svg = $('.pf-g', sc), CX = 130, CY = 138, R = 100, LO = 300, HI = 850, SCORE = 660;
    const pt = (f, r = R) => { const a = Math.PI + f * Math.PI; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; };
    const arc = (f0, f1, r = R) => { const [x0, y0] = pt(f0, r), [x1, y1] = pt(f1, r); return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
    [[0, .26], [.3, .52], [.56, .76], [.8, 1]].forEach(([a, b], i) => $(`.pf-arc.a${i + 1}`, sc).setAttribute('d', arc(a, b)));
    $('.pf-shine', sc).setAttribute('d', arc(.02, .98, R + 4));
    $('.pf-dots', sc).innerHTML = Array.from({ length:23 }, (_, i) => { const [x, y] = pt(i / 22, 70); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.6"/>`; }).join('');
    const BAND = [[580, 'Needs work', 'var(--coral)'], [670, 'Average', 'var(--yel)'], [740, 'Good', 'var(--lil)'], [Infinity, 'Excellent', 'var(--mint)']];
    const band = s => BAND.find(b => s < b[0]);
    const fOf = s => (s - LO) / (HI - LO);
    const knob = $('.pf-knob', sc), kb = $('.pf-kb', sc), kc = $('.pf-kc', sc), gw = $('.pf-gw', sc), bandEl = $('.pf-band', sc);
    // the digits: three rolling columns, each a spring toward its digit
    const rolls = $$('.pf-v .roll', sc).map(r => { r.innerHTML = `<span>${Array.from({ length:10 }, (_, i) => `<i>${i}</i>`).join('')}</span>`; return { el:r.firstElementChild, s:new Spring(0, 170, 17) }; });
    const fk = new Spring(0, 120, 7.5), ro = new Spring(0, 200, 13), gx = new Spring(0, 160, 14), gy = new Spring(0, 160, 14);
    let shownBand = '';
    const paint = () => {
      const f = clamp(fk.x, -.04, 1.04), [x, y] = pt(f, R + ro.x), a = Math.PI + f * Math.PI;
      // stretch along the arc with the speed, squeeze across it (volume kept), as squash and stretch does
      const st = 1 + clamp(Math.abs(fk.v) * .55, 0, .45), sq = 1 / Math.sqrt(st);
      knob.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(a * 180 / Math.PI + 90).toFixed(1)})`);
      kb.setAttribute('rx', (17 * st).toFixed(2)); kb.setAttribute('ry', (17 * sq).toFixed(2));
      gw.setAttribute('transform', `translate(${gx.x.toFixed(2)} ${gy.x.toFixed(2)})`);
      const s = Math.round(LO + clamp(f, 0, 1) * (HI - LO)), d = String(s).padStart(3, '0');
      rolls.forEach((r, i) => { r.s.t = +d[i]; if (REDUCE) r.s.x = r.s.t; r.el.style.transform = `translateY(${(-r.s.x).toFixed(3)}em)`; });
      const b = band(s); kc.style.fill = b[2];
      if (b[1] !== shownBand){ shownBand = b[1]; bandEl.textContent = b[1]; anim(bandEl, [{ transform:'translateY(6px) scale(.9)', opacity:0 }, { transform:'none', opacity:1 }], { duration:420, easing:JELLY }); }
      sc.setAttribute('aria-label', `Credit score ${s}, ${b[1].toLowerCase()}`);
    };
    const tick = dt => { const m = [fk, ro, gx, gy, ...rolls.map(r => r.s)].map(s => s.step(dt)).some(Boolean); paint(); return m || rolls.some(r => Math.abs(r.s.x - r.s.t) > .0005); };
    const toSvg = e => { const b = svg.getBoundingClientRect(), k = 260 / b.width; return [(e.clientX - b.left) * k, (e.clientY - b.top) * k]; };
    sc.addEventListener('pointermove', e => {
      const [px, py] = toSvg(e), dx = px - CX, dy = py - CY, dist = Math.hypot(dx, dy);
      fk.t = dy < 0 ? clamp((Math.atan2(dy, dx) + Math.PI) / Math.PI, 0, 1) : (dx < 0 ? 0 : 1);
      ro.t = clamp((dist - R) * .35, -12, 12);
      const b = sc.getBoundingClientRect(); gx.t = clamp((e.clientX - (b.left + b.width / 2)) * .03, -6, 6); gy.t = clamp((e.clientY - (b.top + b.height / 2)) * .03, -5, 5);
      kick(tick); });
    const home = () => { fk.t = fOf(SCORE); ro.t = 0; gx.t = 0; gy.t = 0; kick(tick); };
    sc.addEventListener('pointerleave', home);
    sc.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight'){ e.preventDefault(); fk.t = clamp(fk.t + (e.key === 'ArrowRight' ? .04 : -.04), 0, 1); kick(tick); } if (e.key === 'Escape') home(); });
    sc.addEventListener('blur', home);
    // the entrance: the knob sweeps up from the bottom of the scale and lands on the score with a jiggle
    fk.set(0); paint(); setTimeout(home, 500);
    window.__pfScore = { home };
  }

  /* ---------- 3. Status pill and its queue: a morphing pill (width on a spring), text that rolls, a squishy colour blob, a
     liquid progress fill, a confetti pop when done, and an elastic reorder as finished steps sink to the bottom ---------- */
  const STEPS = [['Reading 6 files', 'var(--lil)', '1.2s'], ['Comparing 3 pricing pages', 'var(--yel)', '2.1s'], ['Editing PricingCard', 'var(--coral)', '1.6s'], ['Running 14 tests', 'var(--lil)', '1.4s']];
  const DONE = ['Done, 4 steps in 6.3s', 'var(--mint)'];
  const STEP_MS = 1700;
  const TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  let run = 0;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  // Soft: the library's Status pill, as it moves today
  function soft(id){
    const pill = $('.sf-pill'), t = $('.sf-pt'), q = $('.sf-q');
    q.innerHTML = STEPS.map(s => `<li><i></i><span>${s[0]}</span></li>`).join(''); pill.classList.remove('done'); t.textContent = 'Starting';
    const lis = $$('li', q), set = txt => { if (REDUCE){ t.textContent = txt; return; } t.classList.add('out'); setTimeout(() => { if (id !== run) return; t.textContent = txt; t.classList.remove('out'); }, 200); };
    return async i => { if (i < STEPS.length){ lis.forEach((l, k) => { l.className = k < i ? 'done' : k === i ? 'run' : ''; }); set(STEPS[i][0]); }
      else { lis.forEach(l => l.className = 'done'); set(DONE[0]); pill.classList.add('done'); } };
  }
  // Playful
  function playful(id){
    const pill = $('.pf-pill'), pt = $('.pf-pt'), blob = $('.pf-blob'), fill = $('.pf-fill'), q = $('.pf-q'), box = $('.pf-agent');
    pill.classList.remove('done'); blob.style.setProperty('--c', 'var(--lil)');
    pt.innerHTML = '<span class="cur">Starting</span>';
    q.innerHTML = STEPS.map((s, i) => `<li data-i="${i}"><b>${TICK}</b><span>${s[0]}</span><em>${s[2]}</em></li>`).join('');
    const w = new Spring(0, 260, 17), p = new Spring(0, 90, 13);
    const meas = txt => { const m = document.createElement('span'); m.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:500 14px var(--dm-sans)'; m.textContent = txt; box.appendChild(m); const v = m.offsetWidth; m.remove(); return 8 + 32 + 10 + v + 22; };
    w.set(meas('Starting')); pill.style.width = w.x + 'px'; fill.style.width = '0%';
    const tick = dt => { const m = [w, p].map(s => s.step(dt)).some(Boolean); if (id !== run) return false; pill.style.width = w.x.toFixed(1) + 'px'; fill.style.width = (p.x * 100).toFixed(2) + '%'; return m; };
    const roll = txt => {
      const old = $('.cur', pt), nu = document.createElement('span'); nu.className = 'cur'; nu.textContent = txt; pt.appendChild(nu);
      if (old){ old.className = ''; const a = anim(old, [{ transform:'translateY(0)', opacity:1, filter:'blur(0)' }, { transform:'translateY(-110%)', opacity:0, filter:'blur(2px)' }], { duration:260, easing:'ease-in', fill:'forwards' }); if (a) a.onfinish = () => old.remove(); else old.remove(); }
      anim(nu, [{ transform:'translateY(110%)', opacity:0 }, { transform:'translateY(0)', opacity:1 }], { duration:560, easing:JELLY, fill:'backwards' });
      w.t = meas(txt); kick(tick);
    };
    const squish = c => { blob.style.setProperty('--c', c); anim(blob, [{ transform:'scale(1)' }, { transform:'scale(1.28,.74)' }, { transform:'scale(.86,1.16)' }, { transform:'scale(1.06,.95)' }, { transform:'scale(1)' }], { duration:620, easing:'ease-out' }); };
    // an elastic reorder: the finished step sinks to the bottom, the others rise; each glides from where it was on a jelly curve
    const sink = i => {
      const lis = $$('li', q), first = new Map(lis.map(l => [l, l.getBoundingClientRect().top]));
      const li = q.querySelector(`li[data-i="${i}"]`); li.className = 'done'; q.appendChild(li);
      $$('li', q).forEach(l => { const d = first.get(l) - l.getBoundingClientRect().top; if (!d) return;
        anim(l, l === li ? [{ transform:`translateY(${d}px) scale(1.04,.92)` }, { transform:'translateY(0) scale(1)' }] : [{ transform:`translateY(${d}px)` }, { transform:'translateY(0)' }], { duration:680, easing:JELLY }); });
      anim($('b', li), [{ transform:'scale(.3)' }, { transform:'scale(1.25)' }, { transform:'scale(1)' }], { duration:520, easing:JELLY });
    };
    const confetti = () => { if (REDUCE) return; const b = blob.getBoundingClientRect(), o = box.getBoundingClientRect(), C = ['#9b7bff', '#ffc93d', '#43d39e', '#ff7a6b'];
      for (let k = 0; k < 12; k++){ const d = document.createElement('i'); d.className = 'pf-pop'; d.style.background = C[k % 4]; d.style.left = (b.left - o.left + b.width / 2 - 4) + 'px'; d.style.top = (b.top - o.top + b.height / 2 - 4) + 'px'; box.appendChild(d);
        const a = k / 12 * Math.PI * 2, r = 34 + (k % 3) * 10; anim(d, [{ transform:'translate(0,0) scale(1)', opacity:1 }, { transform:`translate(${Math.cos(a) * r}px,${Math.sin(a) * r}px) scale(.2)`, opacity:0 }], { duration:700 + (k % 3) * 120, easing:OUT }).onfinish = () => d.remove(); } };
    return async i => {
      if (i < STEPS.length){
        if (i > 0) sink(i - 1);
        const cur = q.querySelector(`li[data-i="${i}"]`); $$('li', q).forEach(l => { if (l !== cur && l.className === 'run') l.className = ''; }); cur.className = 'run';
        roll(STEPS[i][0]); squish(STEPS[i][1]); p.t = (i + .5) / STEPS.length; kick(tick);
      } else {
        sink(STEPS.length - 1); roll(DONE[0]); squish(DONE[1]); pill.classList.add('done'); p.t = 1; kick(tick);
        setTimeout(confetti, 120);
        anim(pill, [{ transform:'scale(1)' }, { transform:'scale(1.06,.94)' }, { transform:'scale(.98,1.03)' }, { transform:'scale(1)' }], { duration:620, easing:'ease-out' });
      }
    };
  }
  // the switch: a liquid knob that stretches as it travels and lands with a bounce
  const sw = $('.pf-sw');
  if (sw){ const k = $('.pf-knob2', sw), x = new Spring(22, 300, 15);
    const tick = dt => { const m = x.step(dt), st = 1 + clamp(Math.abs(x.v) * .0025, 0, .5); k.style.transformOrigin = x.v > 0 ? 'right center' : 'left center'; k.style.transform = `translateX(${x.x.toFixed(2)}px) scaleX(${st.toFixed(3)}) scaleY(${(1 / Math.sqrt(st)).toFixed(3)})`; return m; };
    tick(0);
    sw.onclick = () => { const on = sw.getAttribute('aria-checked') !== 'true'; sw.setAttribute('aria-checked', on); x.t = on ? 22 : 0; kick(tick); };
  }
  // both sides play the same run, in step
  async function play(){
    const id = ++run, a = soft(id), b = playful(id);
    await wait(900);
    for (let i = 0; i <= STEPS.length; i++){ if (id !== run) return; a(i); b(i); await wait(i < STEPS.length ? STEP_MS : 3200); }
    if (id === run && !REDUCE) play();
  }
  const re = document.getElementById('re3'); if (re) re.onclick = play;
  play();
})();
