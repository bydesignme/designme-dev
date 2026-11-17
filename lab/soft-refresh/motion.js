/* Soft refreshed, motion: the entrances and state changes of the motion lab (motion.html), modelled on the vocabulary of
   the owner's reference shot: a seed that grows and hands off, satellites that slide out from behind the centre, measures
   that fill while their numbers count, ghosts that fill, size morphs instead of swaps, and blur as the glue. Smooth
   decelerating ease-outs, no overshoot, for entrances. Knobs, menus and presses are plush instead (owner, 17 Nov, from
   three clips): switch and segment knobs stretch toward where they travel and settle; menus grow out of their button
   like liquid through a gooey neck, morph out of it, or pop out around it as a speed dial; and an agent fills the task
   table under a soft aurora. Those use springs with a gentle overshoot.

   It runs in the lab page and works on our own component pages in its frames, on their own markup. Every animation in
   every frame (ours, the pages' own, CSS transitions) runs on one lab clock, so 0.5x slows all of it and a recording can
   step it frame by frame. A click inside a component during its entrance jumps the entrance to its end and stops the
   scripted beats; a click after it is just a click. Lab only, nothing ships from here. */
(() => {
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
// the motion tokens (ms, px and scales), the same numbers as motion.css
const T = { ease:'cubic-bezier(.22,1,.36,1)', out:'cubic-bezier(.16,1,.3,1)', fade:260, move:560, morph:600, count:900, press:160,
  stagger:70, chip:90, blur:4, ghost:.96, seed:.85, exit:.9, from:.4,
  // springs: w is the natural frequency (rad/s), z the damping ratio; z .62 overshoots about 8%, z .72 about 4%
  menu:{ w:15, z:.62, ms:560 }, knob:{ w:24, z:.72, ms:440 }, trail:{ w:17, z:.82, lag:55 }, dial:{ w:17, z:.58, ms:520 },
  stretch:1.35,                       // a knob grows to at most 1.35x its width while it travels
  goo:{ blur:7, a:22, b:-9, gap:26 },  // the goo filter: blur, then alpha x22 - 9; a menu settles 26px off its button
  aurora:1700 };
const blur = n => `blur(${n}px)`;
const C = { vt:0, speed:1, rec:false, tracks:new Map(), counters:[], events:[], frames:[] };

/* ---------------------------------------------------------------------------------------------------- the lab clock */
// an animation joins the clock paused, and the clock sets its time every frame
const track = (a, start = C.vt) => { C.tracks.set(a, start); a.pause(); a.currentTime = 0; };
const adopt = () => { for (const f of C.frames){ let d; try { d = f.contentDocument; } catch(e){ continue; }
  if (!d || !d.getAnimations) continue;
  for (const a of d.getAnimations()) if (!C.tracks.has(a) && a.playState !== 'finished' && a.playState !== 'idle') track(a); } };
const drive = () => {
  for (const [a, s] of C.tracks){
    if (a.playState === 'idle' || a.playState === 'finished'){ C.tracks.delete(a); continue; }
    const t = C.vt - s, end = a.effect ? a.effect.getComputedTiming().endTime : 0;
    if (end !== Infinity && t >= end){ a.finish(); C.tracks.delete(a); } else a.currentTime = Math.max(0, t);
  }
  C.counters = C.counters.filter(k => { k.take(); const done = !C.tracks.has(k.a); const p = done ? 1 : (k.a.effect.getComputedTiming().progress ?? 0);
    k.last = k.fmt(k.from + (k.to - k.from) * p); k.el.textContent = k.last; return !done; });
};
const runEvents = () => { const due = C.events.filter(e => e.t <= C.vt).sort((a, b) => a.t - b.t);
  if (!due.length) return; C.events = C.events.filter(e => !due.includes(e)); due.forEach(e => { try { e.fn(); } catch(x){ console.error(x); } }); };
// the pages' own scripted tweens run on performance.now and requestAnimationFrame: inside the frames both are put on the
// lab clock too, so a page's own count or line draw slows at 0.5x and steps with a recording like everything else
const virtualize = f => { const W = f.contentWindow; if (W._srmClock) return;
  const q = new Map(); let id = 0, skew = 0; const base = W.performance.now() - C.vt;
  W.performance.now = () => base + C.vt + skew;
  W.requestAnimationFrame = cb => { q.set(++id, cb); return id; };
  W.cancelAnimationFrame = i => q.delete(i);
  W._srmClock = { run(){ const cbs = [...q.values()]; q.clear(); const t = W.performance.now(); cbs.forEach(cb => { try { cb(t); } catch(e){ console.error(e); } }); },
    // run everything the page has queued to its end at once (its tweens land on their final values)
    flush(){ skew = 1e6; for (let i = 0; i < 6 && q.size; i++) this.run(); skew = 0; } };
};
const pageFrames = () => C.frames.forEach(f => { try { f.contentWindow._srmClock && f.contentWindow._srmClock.run(); } catch(e){} });
const advance = dt => { adopt(); C.vt += dt; runEvents(); pageFrames(); adopt(); drive(); };
let last = performance.now();
const tick = now => { const dt = Math.min(64, now - last); last = now; if (!C.rec) advance(dt * C.speed); requestAnimationFrame(tick); };
requestAnimationFrame(tick);

// at(f, ms, fn, kind): a step on the lab clock. 'fx' steps tidy up after an entrance and still run when it is cut short;
// 'beat' steps are the scripted demo and are dropped once a person clicks
const at = (f, ms, fn, kind = 'beat') => C.events.push({ f, t:C.vt + ms, fn, kind });
const A = (f, el, kf, o = {}) => { if (!el || !el.animate) return null;
  const opt = { duration:o.d ?? T.fade, delay:o.delay || 0, easing:o.e || T.ease, fill:o.fill || 'backwards' }; if (o.pseudo) opt.pseudoElement = o.pseudo;
  const a = el.animate(kf, opt);
  track(a); f._s.anims.add(a); f._s.live = true; return a; };
// a number counts up from 40% of its value to its value, on the measure's ease
// a page that counts its own number (from 0, a beat after it mounts) hands its value over: while the count runs, any
// value the page writes becomes the target
const count = (f, el, delay = 0, d = T.count) => { if (!el || REDUCE) return;
  const parse = t => { const m = t.trim().match(/^(\D*)([\d,]+)(.*)$/); return m && { pre:m[1], n:+m[2].replace(/,/g, ''), post:m[3] }; };
  const v = parse(el.textContent); if (!v) return;
  const k = { el, f, to:v.n, from:Math.round(v.n * T.from), pre:v.pre, post:v.post, last:null };
  k.fmt = x => k.pre + Math.round(x).toLocaleString('en-US') + k.post;
  const a = A(f, el, [], { d, delay, fill:'both' }); if (!a) return; k.a = a;
  k.take = () => { if (k.last === null || el.textContent === k.last) return; const w = parse(el.textContent);
    if (w && w.n >= k.to){ if (!k.to) k.from = Math.round(w.n * T.from); k.to = w.n; k.pre = w.pre; k.post = w.post; } };
  C.counters.push(k); };
// ghost in: from nothing, a touch small and blurred, to itself
const ghost = (f, el, delay, o = {}) => A(f, el, [{ opacity:0, transform:`scale(${o.s ?? T.ghost})`, filter:blur(o.b ?? T.blur) }, { opacity:1, transform:'none', filter:blur(0) }], { d:o.d ?? T.fade, delay });
// content fills in: fades up out of a light blur
const fill = (f, el, delay, d = T.fade) => A(f, el, [{ opacity:0, filter:blur(3), transform:'translateY(3px)' }, { opacity:1, filter:blur(0), transform:'none' }], { d, delay });

// a click inside a component cuts its entrance to the end and stops the scripted beats
const jump = f => {
  for (const a of f._s.anims) if (C.tracks.has(a)){ try { a.finish(); } catch(e){} C.tracks.delete(a); }
  f._s.anims.clear();
  C.counters = C.counters.filter(k => { if (k.f !== f) return true; k.el.textContent = k.fmt(k.to); return false; });
  const mine = C.events.filter(e => e.f === f); C.events = C.events.filter(e => e.f !== f);
  mine.filter(e => e.kind === 'fx').forEach(e => { try { e.fn(); } catch(x){} });
  f._s.live = false;
};

/* ---------------------------------------------------------------------------------------------------- springs */
// a damped spring from 0 to 1 at t seconds (it overshoots a little and settles); keyframes sample it every 16ms and run
// linear between the samples
const springAt = (t, { w, z }) => { if (t <= 0) return 0; const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t)); };
const springKF = (props, sp, ms) => { const n = Math.max(2, Math.round(ms / 16)), kf = [];
  for (let i = 0; i <= n; i++){ const p = i === n ? 1 : springAt(i / n * ms / 1000, sp), k = { offset:i / n };
    for (const [name, [a, b, u = 'px']] of Object.entries(props)) k[name] = (a + (b - a) * p) + u; kf.push(k); }
  return kf; };
const SA = (f, el, props, sp, o = {}) => A(f, el, springKF(props, sp, o.ms || sp.ms), { d:o.ms || sp.ms, delay:o.delay, e:'linear', fill:o.fill, pseudo:o.pseudo });
// a stretching knob: its leading edge springs ahead and its trailing edge follows a beat later on a softer spring, so the
// knob grows toward where it is going (to 1.35x at most), slides, and contracts with a small settle as it lands
const stretchKF = (from, to, ms) => { const n = Math.round(ms / 16), kf = [], dir = Math.sign((to.l + to.w / 2) - (from.l + from.w / 2)) || 1;
  const max = Math.max(from.w, to.w) * T.stretch, Lf = from.l, Rf = from.l + from.w, Lt = to.l, Rt = to.l + to.w;
  for (let i = 0; i <= n; i++){ const t = i / n * ms / 1000, pl = i === n ? 1 : springAt(t, T.knob), pt = i === n ? 1 : springAt(t - T.trail.lag / 1000, T.trail);
    let L, R;
    if (dir > 0){ R = Rf + (Rt - Rf) * pl; L = Lf + (Lt - Lf) * pt; if (R - L > max) L = R - max; }
    else { L = Lf + (Lt - Lf) * pl; R = Rf + (Rt - Rf) * pt; if (R - L > max) R = L + max; }
    // the knob never leaves its track: a leading edge that would overshoot squashes against the end instead
    R = Math.min(R, Math.max(Rf, Rt)); L = Math.max(L, Math.min(Lf, Lt));
    kf.push({ offset:i / n, left:L + 'px', width:Math.max(0, R - L) + 'px' }); }
  return kf; };

/* ---------------------------------------------------------------------------------------------------- plush */
const KN = '.seg2 .knob,.hnx-pm .kn,.asx-knob';
// knobs and switches stretch whenever the component moves them, whoever moves them (a click, the keyboard, a demo)
const watch = f => { const d = f.contentDocument, W = f.contentWindow, prev = new WeakMap();
  const rec = el => prev.set(el, { l:el.offsetLeft, w:el.offsetWidth });
  d.querySelectorAll(KN).forEach(rec);
  const mo = new W.MutationObserver(ms => { for (const m of ms){ const el = m.target;
    if (m.type === 'childList'){ m.addedNodes.forEach(n => { if (n.nodeType !== 1) return; if (n.matches(KN)) rec(n); n.querySelectorAll(KN).forEach(rec); }); continue; }
    if (m.attributeName === 'style' && el.matches(KN)){
      const p = prev.get(el), n = { l:el.offsetLeft, w:el.offsetWidth }; prev.set(el, n);
      if (p && !f._s.quiet && !REDUCE && (Math.abs(p.l - n.l) > .5 || Math.abs(p.w - n.w) > .5)) A(f, el, stretchKF(p, n, T.knob.ms), { d:T.knob.ms, e:'linear' });
    }
    if (m.attributeName === 'aria-checked' && el.classList.contains('toggle') && !f._s.quiet && !REDUCE){
      const on = el.getAttribute('aria-checked') === 'true', off = { l:2, w:14 }, onp = { l:14, w:14 };
      A(f, el, stretchKF(on ? off : onp, on ? onp : off, T.knob.ms).map(k => ({ offset:k.offset, transform:`translateX(${parseFloat(k.left) - 2}px)`, width:k.width })), { d:T.knob.ms, e:'linear', pseudo:'::after' });
    }
    if (m.attributeName === 'class' && el.classList.contains('pop')){
      const was = (m.oldValue || '').split(' ').includes('open'), is = el.classList.contains('open'); if (was === is) continue;
      const v = MENUS.find(x => el.matches(x.pop)); if (!v) continue;
      const btn = el.closest('.stage-in').querySelector(`[data-pop="${v.pop}"]`); if (!btn) continue;
      if (REDUCE) continue;
      (is ? v.open : v.close)(f, btn, el);
    }
  } });
  mo.observe(d.body, { subtree:true, childList:true, attributes:true, attributeOldValue:true, attributeFilter:['style', 'aria-checked', 'class'] });
};
const layer = f => (f.contentDocument.querySelector('.cp-demo') || f.contentDocument.body);
const popBox = pop => { const h = pop.offsetParent.getBoundingClientRect(); return { x:h.left + parseFloat(pop.style.left), y:h.top + parseFloat(pop.style.top), w:pop.offsetWidth, h:pop.offsetHeight }; };
const popRadius = pop => parseFloat(getComputedStyle(pop).borderTopLeftRadius) || 20;
const rectOf = el => { const r = el.getBoundingClientRect(); return { x:r.left, y:r.top, w:r.width, h:r.height }; };
const setRect = (el, r, rx) => { el.setAttribute('x', r.x); el.setAttribute('y', r.y); el.setAttribute('width', r.w); el.setAttribute('height', r.h); el.setAttribute('rx', rx); };

// the gooey menu: the menu grows out of its button like liquid. Both are drawn in an SVG layer under a goo filter (blur,
// then a hard alpha threshold), so while they are close they share one outline with a neck between them, which stretches,
// thins and snaps as the menu springs away. The real menu (crisp text) takes over as it settles; closing drains it back
const goo = f => { const d = f.contentDocument, L = d.createElement('div'); L.className = 'srm-goo';
  L.innerHTML = `<svg aria-hidden="true"><defs><filter id="srm-g" filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%"><feGaussianBlur in="SourceGraphic" stdDeviation="${T.goo.blur}" result="b"/><feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${T.goo.a} ${T.goo.b}" result="g"/><feComposite in="SourceGraphic" in2="g" operator="atop"/></filter></defs><g filter="url(#srm-g)"><rect class="b"/><rect class="p"/></g></svg>`;
  layer(f).appendChild(L); return L; };
const gooOpen = (f, btn, pop) => {
  f.contentDocument.querySelectorAll('.srm-goo').forEach(x => x.remove());
  const b = rectOf(btn), up = pop.getBoundingClientRect().top < b.y;
  pop.style.top = (parseFloat(pop.style.top) + (up ? -1 : 1) * (T.goo.gap - 6)) + 'px';
  pop.classList.add('srm-hide'); btn.classList.add('srm-up');
  const P = popBox(pop), L = goo(f), rb = L.querySelector('.b'), rp = L.querySelector('.p'), bg = getComputedStyle(btn).backgroundColor;
  setRect(rb, b, b.h / 2); rb.style.fill = bg === 'rgba(0, 0, 0, 0)' ? '' : bg;
  setRect(rp, P, popRadius(pop) * .8);
  SA(f, rp, { x:[b.x, P.x], y:[b.y, P.y], width:[b.w, P.w], height:[b.h, P.h], rx:[b.h / 2, popRadius(pop) * .8] }, T.menu);
  at(f, T.menu.ms * .5, () => pop.classList.remove('srm-hide'), 'fx');
  A(f, L, [{ opacity:1 }, { opacity:0 }], { d:200, delay:T.menu.ms * .62, fill:'forwards' });
  at(f, T.menu.ms * .62 + 210, () => L.remove(), 'fx');
};
const gooClose = (f, btn, pop) => {
  f.contentDocument.querySelectorAll('.srm-goo').forEach(x => x.remove());
  const b = rectOf(btn), P = popBox(pop), L = goo(f), rb = L.querySelector('.b'), rp = L.querySelector('.p'), bg = getComputedStyle(btn).backgroundColor;
  pop.classList.add('srm-hide'); at(f, 320, () => pop.classList.remove('srm-hide'), 'fx');
  setRect(rb, b, b.h / 2); rb.style.fill = bg === 'rgba(0, 0, 0, 0)' ? '' : bg;
  const sp = { ...T.menu, z:.8, ms:420 };
  setRect(rp, { x:b.x + b.w * .2, y:b.y + b.h * .2, w:b.w * .6, h:b.h * .6 }, b.h * .3);
  SA(f, rp, { x:[P.x, b.x + b.w * .2], y:[P.y, b.y + b.h * .2], width:[P.w, b.w * .6], height:[P.h, b.h * .6], rx:[popRadius(pop) * .8, b.h * .3] }, sp);
  at(f, sp.ms + 20, () => { L.remove(); btn.classList.remove('srm-up'); }, 'fx');
};
// the morphing menu: the button itself becomes the menu, its size and corners springing from the button's to the menu's
const morph = (f, btn, from, to, o) => { const m = f.contentDocument.createElement('div'); m.className = 'srm-morph' + (o.cls ? ' ' + o.cls : '');
  Object.assign(m.style, { left:to.x + 'px', top:to.y + 'px', width:to.w + 'px', height:to.h + 'px', borderRadius:o.r1 + 'px' });
  layer(f).appendChild(m);
  SA(f, m, { left:[from.x, to.x], top:[from.y, to.y], width:[from.w, to.w], height:[from.h, to.h], borderRadius:[o.r0, o.r1] }, o.sp || T.menu);
  return m; };
const morphOpen = (f, btn, pop) => { const b = rectOf(btn), P = popBox(pop), br = parseFloat(getComputedStyle(btn).borderTopLeftRadius) || b.h / 2;
  pop.classList.add('srm-hide');
  const hide = A(f, btn, [{ opacity:1 }, { opacity:0 }], { d:90, fill:'forwards' }); btn._hide = hide;
  const m = morph(f, btn, b, P, { r0:Math.min(br, b.h / 2), r1:popRadius(pop) });
  at(f, T.menu.ms * .55, () => pop.classList.remove('srm-hide'), 'fx');
  A(f, m, [{ opacity:1 }, { opacity:0 }], { d:160, delay:T.menu.ms * .6, fill:'forwards' });
  at(f, T.menu.ms * .6 + 170, () => m.remove(), 'fx');
};
const morphClose = (f, btn, pop) => { const b = rectOf(btn), P = popBox(pop), br = parseFloat(getComputedStyle(btn).borderTopLeftRadius) || b.h / 2;
  pop.classList.add('srm-hide'); at(f, 320, () => pop.classList.remove('srm-hide'), 'fx');
  const sp = { ...T.menu, z:.82, ms:440 }, m = morph(f, btn, P, b, { r0:popRadius(pop), r1:Math.min(br, b.h / 2), sp });
  at(f, sp.ms * .7, () => { if (btn._hide) btn._hide.cancel(); A(f, btn, [{ opacity:0 }, { opacity:1 }], { d:120 }); }, 'fx');
  A(f, m, [{ opacity:1 }, { opacity:0 }], { d:120, delay:sp.ms * .72, fill:'forwards' });
  at(f, sp.ms * .72 + 130, () => m.remove(), 'fx');
};
// the speed dial: the menu's options pop out of the + around it on a springy arc, each with its label, and the + turns
// into an x. A pick is the menu item's own click
const dialOpen = (f, btn, pop) => { const d = f.contentDocument; d.querySelectorAll('.srm-dial').forEach(x => x.remove());
  pop.classList.add('srm-hide');
  const ic = btn.querySelector('svg') || btn, c = rectOf(ic), cx = c.x + c.w / 2, cy = c.y + c.h / 2;
  const box = d.createElement('div'); box.className = 'srm-dial'; layer(f).appendChild(box);
  const items = [...pop.querySelectorAll('.mi')], n = items.length, R = 66;
  items.forEach((mi, i) => {
    const ang = (-100 + (n > 1 ? i * 80 / (n - 1) : 40)) * Math.PI / 180, dx = Math.cos(ang) * R, dy = Math.sin(ang) * R;
    const o = d.createElement('button'), label = (mi.querySelector('span') || mi).textContent.trim();
    o.className = 'srm-dot'; o.type = 'button'; o.setAttribute('aria-label', label);
    const sv = mi.querySelector('svg'); if (sv) o.appendChild(sv.cloneNode(true));
    const tip = d.createElement('span'); tip.className = 'srm-tip'; tip.textContent = label; o.appendChild(tip);
    Object.assign(o.style, { left:(cx - 17) + 'px', top:(cy - 17) + 'px', transform:`translate(${dx}px,${dy}px)` });
    o.addEventListener('click', () => mi.click());
    box.appendChild(o);
    const del = i * 60, kf = springKF({ _p:[0, 1, ''] }, T.dial, T.dial.ms).map(k => { const p = +k._p; return { offset:k.offset, transform:`translate(${dx * p}px,${dy * p}px) scale(${.3 + .7 * Math.min(1.08, p)})`, opacity:Math.min(1, p * 2) }; });
    A(f, o, kf, { d:T.dial.ms, delay:del, e:'linear' });
    A(f, tip, [{ opacity:0, transform:'translateX(-6px)', filter:blur(3) }, { opacity:1, transform:'none', filter:blur(0) }], { d:T.fade, delay:del + 220 });
  });
};
const dialClose = (f, btn, pop) => { const d = f.contentDocument, box = d.querySelector('.srm-dial'); if (!box) return;
  pop.classList.add('srm-hide'); at(f, 320, () => pop.classList.remove('srm-hide'), 'fx');
  [...box.children].forEach((o, i) => { const t = o.style.transform;
    A(f, o, [{ transform:t, opacity:1, filter:blur(0) }, { transform:'translate(0px,0px) scale(.3)', opacity:0, filter:blur(T.blur) }], { d:300, delay:(box.children.length - 1 - i) * 40, fill:'forwards', e:T.ease }); });
  at(f, 300 + box.children.length * 40 + 20, () => box.remove(), 'fx');
};
const MENUS = [{ pop:'.btx-mp', open:gooOpen, close:gooClose }, { pop:'.btx-sp', open:morphOpen, close:morphClose }, { pop:'.hnx-pop', open:dialOpen, close:dialClose }];

/* ---------------------------------------------------------------------------------------------------- AI fill */
// the task table, empty, with a prompt under it; Generate squishes and morphs into a spinner and Stop, the rows wait as
// skeletons, and a soft aurora sweeps up through the table and fills each row as it passes. Then Stop morphs into Clear.
// Soft now plays the same steps with its own look: the button swaps, and the rows rise in one after another
const ASK = '<div class="srm-ask"><span>Fill this table with the agent runs from today.</span><button class="pill primary sm srm-go" type="button">Generate</button></div>';
const fillSetup = (f, root) => { root.querySelectorAll('.srm-ask').forEach(x => x.remove()); root.insertAdjacentHTML('beforeend', ASK);
  root.querySelectorAll('.ttx-t tbody tr').forEach(tr => tr.classList.add('srm-sk'));
  const go = root.querySelector('.srm-go'); go.addEventListener('click', () => fillStep(f, root, go)); };
const relabel = (f, btn, html, cls) => { const w0 = btn.offsetWidth; btn.innerHTML = html; btn.className = cls; const w1 = btn.offsetWidth;
  if (f.dataset.k === 'new' && !REDUCE) A(f, btn, [{ width:w0 + 'px' }, { width:w1 + 'px' }], { d:320, e:T.ease }); };
const fillStep = (f, root, btn) => { const st = root.dataset.fill || 'idle', rows = [...root.querySelectorAll('.ttx-t tbody tr')], neu = f.dataset.k === 'new';
  if (st === 'idle'){
    root.dataset.fill = 'run'; relabel(f, btn, '<span class="spin" aria-hidden="true"></span>Stop', 'pill soft sm srm-go');
    const sc = root.querySelector('.ttx-sc'), H = sc.offsetHeight;
    if (neu && !REDUCE){
      const au = f.contentDocument.createElement('div'); au.className = 'srm-aur'; sc.appendChild(au);
      const D = T.aurora, start = 700;
      A(f, au, [{ transform:`translateY(${H}px)`, opacity:0 }, { opacity:1, offset:.18 }, { opacity:1, offset:.72 }, { transform:`translateY(${-H * 1.5}px)`, opacity:0 }], { d:D, delay:start, e:'cubic-bezier(.45,0,.35,1)', fill:'both' });
      // a row fills as the aurora's middle passes it, bottom row first
      rows.forEach(tr => { const y = (tr.offsetTop + tr.offsetHeight / 2) / H, pass = start + D * (.12 + (1 - y) * .45);
        at(f, pass, () => { if (root.dataset.fill !== 'run') return; tr.classList.remove('srm-sk'); [...tr.children].forEach((td, j) => A(f, td, [{ opacity:0, filter:blur(T.blur) }, { opacity:1, filter:blur(0) }], { d:T.fade + 80, delay:j * 30 })); }, 'fx'); });
      at(f, start + D, () => au.remove(), 'fx');
      at(f, start + D * .8, () => { if (root.dataset.fill === 'run'){ root.dataset.fill = 'done'; relabel(f, btn, 'Clear', 'pill line sm srm-go'); } }, 'fx');
    } else {
      at(f, 900, () => { if (root.dataset.fill !== 'run') return; rows.forEach((tr, i) => { tr.classList.remove('srm-sk'); if (!REDUCE) A(f, tr, [{ opacity:0, transform:'translateY(8px)', filter:blur(6) }, { opacity:1, transform:'none', filter:blur(0) }], { d:760, delay:i * 65, e:'cubic-bezier(.16,1,.3,1)' }); });
        root.dataset.fill = 'done'; relabel(f, btn, 'Clear', 'pill line sm srm-go'); }, 'fx');
    }
  } else {
    root.dataset.fill = 'idle'; root.querySelectorAll('.srm-aur').forEach(x => x.remove());
    rows.forEach(tr => tr.classList.add('srm-sk')); relabel(f, btn, 'Generate', 'pill primary sm srm-go');
  }
};
// the prompt bar and skeleton rows, the same on both sides (Soft has no skeleton style of its own yet)
const LAB_CSS = '.srm-ask{display:flex;align-items:center;gap:12px;padding:10px 10px 10px 16px;border-top:1px solid color-mix(in srgb,var(--dm-line) 50%,transparent);font-size:12.5px;color:var(--dm-muted)}'
  + '.srm-ask span{flex:1;min-width:0}.srm-go{min-width:0;overflow:hidden}'
  + '.ttx-t tbody tr.srm-sk td{color:transparent;position:relative}.ttx-t tbody tr.srm-sk td>*{visibility:hidden}'
  + '.ttx-t tbody tr.srm-sk td:not(.ck)::after{content:"";position:absolute;left:8px;right:28%;top:50%;height:8px;margin-top:-4px;border-radius:4px;background:var(--dm-chip);animation:srmsk 1.6s ease-in-out infinite}'
  + '.ttx-t tbody tr.srm-sk td.r::after{left:28%;right:8px}.ttx-t tbody tr.srm-sk td:last-child::after{right:16px}'
  + '@keyframes srmsk{50%{opacity:.5}}@media (prefers-reduced-motion:reduce){.ttx-t tbody tr.srm-sk td::after{animation:none}}';

/* ---------------------------------------------------------------------------------------------------- the components */
const lift = (f, root) => { root.style.opacity = ''; return A(f, root, [{ opacity:0, transform:`scale(${T.ghost})`, filter:blur(T.blur) }, { opacity:1, transform:'none', filter:blur(0) }], { d:T.fade + 80 }); };
// a height morph: the element opens from h0 to its own height, pushing what is under it down; its overflow is clipped
// while it opens and given back after
const grow = (f, root, h0, delay, d = T.morph) => {
  const H = root.offsetHeight, ov = root.style.overflow, mh = root.style.minHeight;
  root.style.overflow = 'hidden'; root.style.minHeight = '0px';
  A(f, root, [{ height:h0 + 'px' }, { height:H + 'px' }], { d, delay });
  at(f, delay + d + 10, () => { root.style.overflow = ov; root.style.minHeight = mh; }, 'fx');
};
const press = el => { if (el) el.click(); };

const FLOWS = {
  // Stat cards: the switcher first; the cards slide out from behind the first one, left to right, as empty cards that then
  // fill, their numbers counting and their sparklines drawing
  'stat-cards': {
    enter(f, root){
      ghost(f, root.querySelector('.scx-h .seg2'), 0, { s:.92, d:T.fade + 100 });
      const cards = [...root.querySelectorAll('.scx-c')], r0 = cards[0].getBoundingClientRect();
      cards.forEach((c, i) => { c.style.zIndex = cards.length - i; at(f, 2400, () => { c.style.zIndex = ''; }, 'fx'); });
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect(), del = 180 + i * T.chip;
        if (!i) A(f, c, [{ opacity:0, transform:`scale(${T.seed})`, filter:blur(T.blur) }, { opacity:1, transform:'none', filter:blur(0) }], { d:T.move, delay:del });
        else A(f, c, [{ opacity:0, transform:`translate(${r0.left - r.left}px,${r0.top - r.top}px) scale(${T.ghost})`, filter:blur(2) }, { opacity:1, offset:.45 }, { opacity:1, transform:'none', filter:blur(0) }], { d:T.move + 80, delay:del, e:T.out });
        const at2 = del + 360;
        [...c.children].forEach((k, j) => fill(f, k, at2 + j * 50));
        count(f, c.querySelector('.scx-v b'), at2);
        A(f, c.querySelector('.scx-sp svg'), [{ clipPath:'inset(0 100% 0 0)' }, { clipPath:'inset(0 0% 0 0)' }], { d:T.count, delay:at2 + 80 });
      });
    },
    beats(f, root){ at(f, 3000, () => press(root.querySelector('.scx-sg [data-v="2"]'))); at(f, 4600, () => press(root.querySelector('.scx-sg [data-v="1"]'))); }
  },
  // Line chart: the card opens from its header to its full height, the figure counts, the line draws and the area fades
  // up under it
  'line-chart': {
    enter(f, root){
      const hd = root.querySelector('.lnx-h');
      lift(f, root); grow(f, root, hd.offsetTop + hd.offsetHeight + 16, 140);
      [...root.querySelectorAll('.lnx-h>div:first-child>*, .lnx-k')].forEach((k, i) => fill(f, k, 80 + i * T.chip));
      count(f, root.querySelector('.lnx-v'), 200);
      root.querySelectorAll('.lnx-svg .gl').forEach((g, i) => A(f, g, [{ opacity:0 }, { opacity:1 }], { d:T.fade, delay:300 + i * 60 }));
      A(f, root.querySelector('.lnx-svg .lnr'), [{ width:'0px' }, { width:'320px' }], { d:T.count + 100, delay:380 });
      A(f, root.querySelector('.lnx-svg .ar'), [{ opacity:0, transform:'translateY(6px)' }, { opacity:1, transform:'none' }], { d:T.move, delay:780 });
      root.querySelectorAll('.lnx-ax span').forEach((s, i) => fill(f, s, 520 + i * 40));
    },
    beats(f, root){ at(f, 2800, () => press(root.querySelector('.lnx-k[data-s="1"]'))); at(f, 4200, () => press(root.querySelector('.lnx-k[data-s="1"]'))); }
  },
  // Task table: the agent fills it. The rows wait as skeletons under a prompt; Generate starts the fill (see AI fill)
  'task-table': {
    setup(f, root){ fillSetup(f, root); },
    enter(f, root){ lift(f, root); ghost(f, root.querySelector('.srm-ask .srm-go'), 200); fill(f, root.querySelector('.srm-ask span'), 140); },
    beats(f, root){ at(f, 1400, () => press(root.querySelector('.srm-go'))); at(f, 5800, () => press(root.querySelector('.srm-go'))); }
  },
  // Tools and connections: the list grows out of its header; the rows slide out from behind it one after another, and
  // each permission switch settles on its pick once its row has landed
  'tool-connections': {
    enter(f, root){
      const hd = root.querySelector('.hnx-h'), hb = hd.offsetTop + hd.offsetHeight, rows = [...root.querySelectorAll('.hnx-t')];
      lift(f, root); grow(f, root, hb + 12, 100, T.morph + 120);
      [...hd.querySelectorAll('b, .hnx-st, .hnx-test')].forEach((k, i) => fill(f, k, 60 + i * 60));
      rows.forEach((r, i) => {
        const del = 180 + i * 80;
        A(f, r, [{ opacity:0, transform:`translateY(${hb - r.offsetTop - 8}px) scale(${T.ghost})`, filter:blur(T.blur) }, { opacity:1, transform:'none', filter:blur(0) }], { d:T.move, delay:del, e:T.out });
        const kn = r.querySelector('.kn'), b0 = r.querySelector('.hnx-pm button');
        if (kn && b0 && parseFloat(kn.style.left) > 3) A(f, kn, stretchKF({ l:2, w:b0.offsetWidth }, { l:parseFloat(kn.style.left), w:parseFloat(kn.style.width) }, T.knob.ms), { d:T.knob.ms, delay:del + T.move - 240, e:'linear' });
      });
      ghost(f, root.querySelector('.hnx-add'), 180 + rows.length * 80 + 160);
    },
    beats(f, root){
      const r0 = () => root.querySelector('.hnx-t');
      at(f, 2200, () => press(r0() && r0().querySelectorAll('.hnx-pm button')[2]));
      at(f, 3000, () => press(root.querySelector('.hnx-add')));
      at(f, 4600, () => press(root.querySelector('.hnx-add')));
      at(f, 5400, () => press(r0() && r0().querySelectorAll('.hnx-pm button')[1]));
    }
  },
  // Buttons: each grows out of a small seed, left to right, its label filling in a beat later. Run agent opens into a
  // small panel (a width and height morph from the button) in the refreshed frame
  'buttons': {
    enter(f, root){
      [...root.querySelectorAll('.btx-row')].forEach((row, ri) => [...row.children].filter(k => !k.matches('.pop')).forEach((k, j) => {
        const del = ri * 110 + j * T.stagger;
        if (k.matches('.btx-l')){ fill(f, k, del); return; }
        A(f, k, [{ opacity:0, transform:'scale(.6)', filter:blur(T.blur) }, { opacity:1, transform:'none', filter:blur(0) }], { d:T.move - 80, delay:del });
        A(f, k, [{ color:'transparent' }, { color:getComputedStyle(k).color }], { d:T.fade, delay:del + 200 });
      }));
    },
    beats(f, root){
      at(f, 1500, () => press(root.querySelector('.btx-more')));
      at(f, 2900, () => press(root.querySelector('.btx-more')));
      at(f, 3700, () => press(root.querySelector('.btx-share')));
      at(f, 5100, () => press(root.querySelector('.btx-share')));
      at(f, 5900, () => press(root.querySelector('.btx-run')));
      at(f, 7500, () => { const x = root.querySelector('.srm-pn [data-x]'); press(x || root.querySelector('.btx-run')); });
    }
  },
  // Agent settings: the switches and the Autonomy knob stretch toward where they travel (see watch)
  'agent-settings': {
    enter(f, root){ lift(f, root); },
    beats(f, root){
      const tg = () => root.querySelectorAll('.toggle')[1], st = v => root.querySelector(`.asx-steps [data-v="${v}"]`);
      at(f, 1000, () => press(tg())); at(f, 1900, () => press(tg())); at(f, 2800, () => press(st(2))); at(f, 3800, () => press(st(1)));
    }
  },
  // Status pill: a seed dot grows into the pill; its mark, then its label (sliding in inside the growing width), then the
  // measure along its foot
  'status-pill': {
    enter(f, root){
      const p = root.querySelector('.spl-pill'), W = p.offsetWidth, H = p.offsetHeight, fl = root.querySelector('.spl-fill');
      A(f, p, [{ opacity:0, transform:'scale(.4)', filter:blur(T.blur) }, { opacity:1, transform:'none', filter:blur(0) }], { d:T.fade + 140 });
      A(f, p, [{ width:H + 'px' }, { width:W + 'px' }], { d:T.morph, delay:320 });
      ghost(f, root.querySelector('.spl-in .g'), 160, { s:.5 });
      A(f, root.querySelector('.spl-in .shim'), [{ opacity:0, transform:'translateX(-10px)', filter:blur(3) }, { opacity:1, transform:'none', filter:blur(0) }], { d:T.move - 100, delay:520 });
      if (fl) A(f, fl, [{ width:'0%' }, { width:fl.style.width || '8%' }], { d:T.count, delay:700 });
    },
    beats(){}
  }
};

// the panel Run agent opens into, in the refreshed Buttons frame: it starts as the button (its size, corners and fill)
// and morphs into the panel; its content fills in once it is nearly open. Closing runs it back and blurs the content out
function panel(f, btn){
  const d = btn.ownerDocument, root = btn.closest('.btx'); if (!root || root.querySelector('.srm-pn')) return;
  root.style.position = 'relative';
  const rb = root.getBoundingClientRect(), bb = btn.getBoundingClientRect(), bg = getComputedStyle(btn).backgroundColor, rad = bb.height / 2 + 'px';
  const pn = d.createElement('div'); pn.className = 'srm-pn'; pn.setAttribute('role', 'dialog'); pn.setAttribute('aria-label', 'Run agent');
  pn.innerHTML = '<b>Run agent</b><span class="muted">The Design agent works on this file. About 2 minutes, $0.40 at most.</span>'
    + '<div class="row"><button class="pill ghost sm" data-x>Cancel</button><button class="pill primary sm" data-x>Start run</button></div>';
  const W = Math.min(280, rb.width - (bb.left - rb.left));
  pn.style.cssText = `left:${bb.left - rb.left}px;top:${bb.top - rb.top}px;width:${W}px`;
  root.appendChild(pn); const H = pn.offsetHeight;
  const hide = A(f, btn, [{ opacity:1 }, { opacity:0 }], { d:120, fill:'forwards' });
  SA(f, pn, { width:[bb.width, W], height:[bb.height, H] }, T.menu);
  A(f, pn, [{ borderRadius:rad, backgroundColor:bg, boxShadow:'none' }, { offset:.6 }, {}], { d:T.menu.ms, e:T.ease });
  [...pn.children].forEach((k, i) => fill(f, k, 260 + i * 60));
  const close = () => { if (pn._out) return; pn._out = true;
    [...pn.children].forEach(k => A(f, k, [{ opacity:1, filter:blur(0) }, { opacity:0, filter:blur(T.blur) }], { d:160, fill:'forwards' }));
    A(f, pn, [{ width:W + 'px', height:H + 'px' }, { width:bb.width + 'px', height:bb.height + 'px', borderRadius:rad, backgroundColor:bg, boxShadow:'none' }], { d:T.morph - 120, delay:100, fill:'forwards' });
    at(f, 100 + T.morph - 160, () => { if (hide) hide.cancel(); A(f, btn, [{ opacity:0 }, { opacity:1 }], { d:120 }); }, 'fx');
    at(f, 100 + T.morph - 110, () => pn.remove(), 'fx');
  };
  pn.querySelectorAll('[data-x]').forEach(b => b.addEventListener('click', close));
}

/* ---------------------------------------------------------------------------------------------------- the frames */
// mount the component afresh and stop its scripted demo, so both sides start from the same state
const prep = f => {
  jump(f);
  const d = f.contentDocument, W = f.contentWindow, rp = d.getElementById('cp-replay');
  W.__srmMount = true; try { if (rp) rp.click(); } finally { W.__srmMount = false; }
  const card = d.querySelector('.pg-demo>.card'); if (card && card._c) card._c.mine = true;
  return d.querySelector('.pg-demo>.card>.stage-in>:not(template)');
};
// the refreshed side drops the page's own entrance before playing its own
// (finished, not cancelled: a page may wait for its entrance to end before it counts its numbers or draws its chart)
const clearEntrance = d => { d.getAnimations().forEach(a => { if (a.constructor.name === 'Animation' || a.animationName === 'enter'){ try { a.finish(); } catch(e){} } }); };
const replay = (id, o = {}) => C.frames.filter(f => f.dataset.id === id && f._s && f._s.ready).forEach(f => {
  let root; try { root = prep(f); } catch(e){ return; } if (!root) return;
  const fl = FLOWS[id], d = f.contentDocument;
  f._s.quiet = true; at(f, 400, () => { f._s.quiet = false; }, 'fx');
  if (fl.setup) fl.setup(f, root, d);
  // the refreshed side lands the page's own tweens at once, then plays its own entrance over the final values
  if (f.dataset.k === 'new'){
    clearEntrance(d);
    const go = () => { f.contentWindow._srmClock && f.contentWindow._srmClock.flush(); if (!REDUCE && fl.enter) fl.enter(f, root, d); };
    // what the page starts once its entrance has ended runs a task later; it is landed, then the new entrance plays
    if (o.sync) go(); else { root.style.visibility = 'hidden'; setTimeout(() => { root.style.visibility = ''; go(); }, 0); }
  }
  if (o.beats !== false) fl.beats(f, root, d);
});
const hook = f => {
  f._s = { anims:new Set(), live:false, ready:true };
  virtualize(f);
  // a component page mounts its demo afresh the first time it scrolls into view (an IntersectionObserver on the top
  // window's viewport), which would wipe the lab's state; from here on only the lab's own replays mount it
  try { f.contentWindow.eval('DM.mount = (function(o){ return function(card, again){ if (!window.__srmMount) return; return o.call(DM, card, again); }; })(DM.mount)'); } catch(e){}
  const d = f.contentDocument;
  // a real press during an entrance or the beats ends them; the press itself goes through
  d.addEventListener('pointerdown', e => { if (e.isTrusted && (f._s.live || C.events.some(x => x.f === f))) jump(f); }, true);
  const css = d.createElement('style'); css.textContent = LAB_CSS; d.body.appendChild(css);
  if (f.dataset.k === 'new') watch(f);
  if (f.dataset.k === 'new' && f.dataset.id === 'buttons') d.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('.btx-run'); if (!b) return; e.stopPropagation(); e.preventDefault(); panel(f, b); }, true);
};

window.SRM = {
  T, C, replay, hook,
  setFrames(fs){ C.frames = fs; },
  setSpeed(s){ C.speed = s; },
  // a recording drives the clock by hand: rec(true), then step(1000 / 60) before each frame
  rec(on){ C.rec = !!on; last = performance.now(); },
  step(ms){ advance(ms); },
  get live(){ return C.frames.some(f => f._s && f._s.live) || C.events.length > 0; }
};
// an entrance is over once none of its animations is left on the clock
setInterval(() => C.frames.forEach(f => { if (f._s && f._s.live && ![...f._s.anims].some(a => C.tracks.has(a))){ f._s.live = false; f._s.anims.clear(); } }), 200);
})();
