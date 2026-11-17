/* Meeting card in the six-component lab: the lab clock and the motion of the two new variants, run in the lab page and
   laid on the real component in its frames (/components/meeting-card.html, its own markup, copy and demo story).
   Soft refreshed takes the plush vocabulary of the owner's references: the card grows out of its status chip (a seed),
   the people slide out from behind the first face (satellites), the time block widens into place with its times sliding
   in (a size morph), the now line glides in, the minutes roll, the chip morphs to each new state's width, and the Join
   chevron's menu grows out of it like liquid (goo). Clean takes the calm Access Grid vocabulary: the card rises 8px from
   .98, its pieces follow 40ms apart, and the menu scales and fades out of the chevron.
   Every frame runs on one lab clock: the page's own timers, frame loops, CSS transitions and animations and ours, so 0.5x
   slows all of it (the demo story included) and a recording can step it frame by frame. A press inside a card during its
   entrance lands the entrance at once. Lab only, nothing ships from here. */
(() => {
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const E = { soft:'cubic-bezier(.22,1,.36,1)', out:'cubic-bezier(.16,1,.3,1)', clean:'cubic-bezier(.23,1,.32,1)' };
const blur = n => `blur(${n}px)`;
const C = { vt:0, speed:1, rec:false, tracks:new Map(), timers:[], q:[], frames:[], nid:1e7 };

/* ---------------------------------------------------------------------------------------------------- the lab clock */
const track = a => { C.tracks.set(a, C.vt); try { a.pause(); a.currentTime = 0; } catch(e){} };
const adopt = () => { for (const f of C.frames){ let d; try { d = f.contentDocument; } catch(e){ continue; }
  if (!d || !d.getAnimations || !f._s) continue;
  for (const a of d.getAnimations()) if (!C.tracks.has(a) && a.playState !== 'finished' && a.playState !== 'idle') track(a); } };
const drive = () => { for (const [a, s] of C.tracks){
  if (a.playState === 'idle'){ C.tracks.delete(a); continue; }
  const t = C.vt - s, end = a.effect ? a.effect.getComputedTiming().endTime : 0;
  if (end !== Infinity && t >= end){ try { a.finish(); } catch(e){} C.tracks.delete(a); } else a.currentTime = Math.max(0, t);
} };
// the page's own timers and frame loops, inside each frame, move onto the lab clock (a real timer from before stays real)
const virtualize = f => { const W = f.contentWindow; if (W.__lab) return; W.__lab = true;
  const rCT = W.clearTimeout.bind(W), rCI = W.clearInterval.bind(W), rCA = W.cancelAnimationFrame.bind(W), base = W.performance.now() - C.vt;
  const raf = new Map(); W.__labRaf = raf;
  W.performance.now = () => base + C.vt;
  W.setTimeout = (fn, ms = 0, ...a) => { const id = ++C.nid; C.timers.push({ W, id, t:C.vt + Math.max(0, +ms || 0), fn, a }); return id; };
  W.setInterval = (fn, ms = 0, ...a) => { const id = ++C.nid, iv = Math.max(4, +ms || 0); C.timers.push({ W, id, t:C.vt + iv, fn, a, iv }); return id; };
  const clear = real => id => { if (id > 1e7){ const i = C.timers.findIndex(t => t.id === id); if (i >= 0) C.timers.splice(i, 1); } else real(id); };
  W.clearTimeout = clear(rCT); W.clearInterval = clear(rCI);
  W.requestAnimationFrame = cb => { const id = ++C.nid; raf.set(id, cb); return id; };
  W.cancelAnimationFrame = id => { if (!raf.delete(id)) rCA(id); };
};
const runTimers = () => { for (let n = 0; n < 400; n++){
  let due = null; for (const t of C.timers) if (t.t <= C.vt && (!due || t.t < due.t || (t.t === due.t && t.id < due.id))) due = t;
  if (!due) return;
  if (due.iv) due.t = Math.max(due.t + due.iv, C.vt - 200); else C.timers.splice(C.timers.indexOf(due), 1);
  if (due.W.closed){ C.timers.splice(C.timers.indexOf(due), 1); continue; }
  try { typeof due.fn === 'function' && due.fn.apply(due.W, due.a); } catch(e){ console.error(e); }
} };
const runQ = () => { const due = C.q.filter(e => e.t <= C.vt).sort((a, b) => a.t - b.t); if (!due.length) return;
  C.q = C.q.filter(e => !due.includes(e)); due.forEach(e => { try { e.fn(); } catch(x){ console.error(x); } }); };
const runRaf = () => C.frames.forEach(f => { try { const W = f.contentWindow, q = W.__labRaf; if (!q || !q.size) return;
  const cbs = [...q.values()]; q.clear(); const t = W.performance.now(); cbs.forEach(cb => { try { cb(t); } catch(e){ console.error(e); } }); } catch(e){} });
const advance = dt => { C.vt += dt; runTimers(); runQ(); runRaf(); adopt(); drive(); };
let last = performance.now();
const tick = now => { const dt = Math.min(64, now - last); last = now; if (!C.rec) advance(dt * C.speed); requestAnimationFrame(tick); };
requestAnimationFrame(tick);

// at(f, ms, fn): a step on the lab clock; 'fx' steps tidy up after an entrance and still run when it is cut short
const at = (f, ms, fn, kind = 'fx') => C.q.push({ f, t:C.vt + ms, fn, kind });
const A = (f, el, kf, o = {}) => { if (!el || !el.animate) return null;
  const a = el.animate(kf, { duration:o.d ?? 260, delay:o.delay || 0, easing:o.e || E.soft, fill:o.fill || 'backwards' });
  track(a); f._s.anims.add(a); f._s.live = true; return a; };
const fill = (f, el, delay, d = 300) => A(f, el, [{ opacity:0, filter:blur(3), transform:'translateY(3px)' }, { opacity:1, filter:blur(0), transform:'none' }], { d, delay });
const ghost = (f, el, delay, s = .9, d = 420) => A(f, el, [{ opacity:0, transform:`scale(${s})`, filter:blur(4) }, { opacity:1, transform:'none', filter:blur(0) }], { d, delay });
const jump = f => {
  for (const a of f._s.anims) if (C.tracks.has(a)){ try { a.finish(); } catch(e){} C.tracks.delete(a); }
  f._s.anims.clear();
  const mine = C.q.filter(e => e.f === f); C.q = C.q.filter(e => e.f !== f);
  mine.filter(e => e.kind === 'fx').forEach(e => { try { e.fn(); } catch(x){} });
  f._s.live = false;
};
// a damped spring from 0 to 1 at t seconds, sampled every 16ms into keyframes (menus only: a gentle overshoot)
const springAt = (t, { w, z }) => { if (t <= 0) return 0; const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t)); };
const springKF = (props, sp) => { const n = Math.max(2, Math.round(sp.ms / 16)), kf = [];
  for (let i = 0; i <= n; i++){ const p = i === n ? 1 : springAt(i / n * sp.ms / 1000, sp), k = { offset:i / n };
    for (const [name, [a, b]] of Object.entries(props)) k[name] = (a + (b - a) * p) + 'px'; kf.push(k); }
  return kf; };
const SA = (f, el, props, sp) => A(f, el, springKF(props, sp), { d:sp.ms, e:'linear' });
const MENU = { w:13, z:.72, ms:680 };

/* ---------------------------------------------------------------------------------------------------- geometry */
const rel = (el, to) => { const a = el.getBoundingClientRect(), b = to.getBoundingClientRect(); return { x:a.left - b.left, y:a.top - b.top, w:a.width, h:a.height }; };
const rectOf = el => { const r = el.getBoundingClientRect(); return { x:r.left, y:r.top, w:r.width, h:r.height }; };
// a popover's box from its placed position (its own transform is mid-transition while it opens)
const popBox = pop => { const h = pop.offsetParent.getBoundingClientRect(); return { x:h.left + parseFloat(pop.style.left || 0), y:h.top + parseFloat(pop.style.top || 0), w:pop.offsetWidth, h:pop.offsetHeight }; };
const setRect = (el, r, rx) => { el.setAttribute('x', r.x); el.setAttribute('y', r.y); el.setAttribute('width', r.w); el.setAttribute('height', r.h); el.setAttribute('rx', rx); };

/* ---------------------------------------------------------------------------------------------------- Soft refreshed */
// the entrance: a seed dot at the chip's place widens into the status chip; the card's surface grows out of that seed to
// the whole card; the title and time fill in; the track arrives as an empty shape, the meeting block widens into place and
// its times slide in from its middle; the now line glides in from the left; the faces slide out from behind the first one;
// the copy button and Join arrive last. Decelerating moves (560 to 760ms), blur as the glue, nothing bounces
const enterSoft = (f, root) => {
  const d = f.contentDocument, R = root.getBoundingClientRect(), cs = getComputedStyle(root);
  const chip = root.querySelector('.mtx-st'), cr = rel(chip, root), seed = { x:cr.x + cr.w - cr.h, y:cr.y, w:cr.h, h:cr.h };
  // the surface: the card's own fill, shadow and corners on a shape that starts as the seed
  const surf = d.createElement('span'); surf.className = 'lx-surf';
  Object.assign(surf.style, { background:cs.backgroundColor, boxShadow:cs.boxShadow, cornerShape:cs.getPropertyValue('corner-shape') || '' });
  root.classList.add('lx-in'); root.appendChild(surf);
  A(f, surf, [
    { left:seed.x + 'px', top:seed.y + 'px', width:seed.w + 'px', height:seed.h + 'px', borderRadius:seed.h / 2 + 'px', opacity:0, filter:blur(3) },
    { opacity:1, filter:blur(0), offset:.22 },
    { left:'0px', top:'0px', width:R.width + 'px', height:R.height + 'px', borderRadius:cs.borderTopLeftRadius, opacity:1, filter:blur(0) }
  ], { d:760, delay:180, e:E.out, fill:'both' });
  at(f, 960, () => { surf.remove(); root.classList.remove('lx-in'); });
  // the seed: a dot that widens into the chip, its words sliding in inside the growing width
  chip.style.overflow = 'hidden';
  A(f, chip, [{ width:cr.h + 'px', opacity:0, transform:'scale(.6)', filter:blur(4) }, { opacity:1, transform:'none', filter:blur(0), offset:.3 }, { width:cr.w + 'px', opacity:1, transform:'none', filter:blur(0) }], { d:680, e:E.soft });
  if (chip.firstElementChild) A(f, chip.firstElementChild, [{ opacity:0, transform:'translateX(-6px)', filter:blur(3) }, { opacity:1, transform:'none', filter:blur(0) }], { d:420, delay:260 });
  at(f, 700, () => { chip.style.overflow = ''; });
  fill(f, root.querySelector('.mtx-t'), 420); fill(f, root.querySelector('.mtx-sub'), 480);
  // the track as an empty shape, then the meeting block widening into place from its middle
  const tr = root.querySelector('.mtx-track'), blk = root.querySelector('.mtx-blk'), br = rel(blk, tr), nums = [...blk.querySelectorAll(':scope>.num')];
  ghost(f, tr, 480, .96, 380);
  A(f, blk, [{ left:(br.x + br.w / 2 - br.h / 2) + 'px', width:br.h + 'px', opacity:0 }, { opacity:1, offset:.2 }, { left:br.x + 'px', width:br.w + 'px', opacity:1 }], { d:680, delay:600, e:E.out });
  nums.forEach((n, i) => A(f, n, [{ opacity:0, transform:`translateX(${i ? -14 : 14}px)`, filter:blur(3) }, { opacity:1, transform:'none', filter:blur(0) }], { d:480, delay:820 + i * 40, e:E.out }));
  const now = root.querySelector('.mtx-now');
  if (now && !root.classList.contains('done')) A(f, now, [{ left:'0px', opacity:0 }, { opacity:1, offset:.3 }, { left:getComputedStyle(now).left, opacity:1 }], { d:780, delay:700, e:E.out });
  // the people: the first face from a seed, the others slide out from behind it
  const avs = [...root.querySelectorAll('.mtx-who .av')];
  if (avs.length){
    const x0 = avs[0].getBoundingClientRect().left;
    avs.forEach((a, i) => { a.style.position = 'relative'; a.style.zIndex = avs.length - i; });
    ghost(f, avs[0], 760, .85, 440);
    avs.slice(1).forEach((a, i) => A(f, a, [{ transform:`translateX(${x0 - a.getBoundingClientRect().left}px) scale(.9)`, opacity:0, filter:blur(2) }, { opacity:1, offset:.4 }, { transform:'none', opacity:1, filter:blur(0) }], { d:640, delay:840 + i * 70, e:E.out }));
    at(f, 840 + avs.length * 70 + 660, () => avs.forEach(a => { a.style.zIndex = ''; a.style.position = ''; }));
  }
  ghost(f, root.querySelector('.mtx-cp'), 1000, .8, 420);
  const jg = root.querySelector('.mtx-jg'), join = root.querySelector('.mtx-join');
  ghost(f, jg, 1060, .9, 460);
  if (join){ ghost(f, join.querySelector('.mk'), 1160, .5, 380); fill(f, join.querySelector('.lb'), 1220); }
  fill(f, root.querySelector('.mtx-jm svg'), 1260);
};

// the gooey menu: the menu grows out of the chevron like liquid. The chevron and the menu are drawn in one SVG layer under
// a goo filter (a blur, then a hard alpha threshold), so while they are close they share one outline with a neck between
// them, which stretches, thins and lets go as the menu springs away. The real menu, crisp, takes over as it settles
const gooLayer = d => { d.querySelectorAll('.lx-goo').forEach(x => x.remove());
  const L = d.createElement('div'); L.className = 'lx-goo';
  L.innerHTML = '<svg aria-hidden="true"><defs><filter id="lx-g" filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%"><feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b"/><feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="g"/><feComposite in="SourceGraphic" in2="g" operator="atop"/></filter></defs><g filter="url(#lx-g)"><rect class="b"/><rect class="p"/></g></svg>';
  (d.querySelector('.cp-demo') || d.body).appendChild(L); return L; };
const gooOpen = (f, btn, pop) => { const d = f.contentDocument, jg = btn.closest('.mtx-jg');
  const b = rectOf(btn), up = parseFloat(pop.style.top) < 0, r = parseFloat(getComputedStyle(pop).borderTopLeftRadius) || 16;
  // the menu settles a little further off the chevron, so the neck has room to show
  pop.style.top = (parseFloat(pop.style.top) + (up ? -12 : 12)) + 'px';
  pop.classList.add('lx-hide'); jg.classList.add('lx-up');
  const P = popBox(pop), L = gooLayer(d), rb = L.querySelector('.b'), rp = L.querySelector('.p');
  const seed = { x:b.x + 2, y:b.y + 2, w:b.w - 4, h:b.h - 4 };
  setRect(rb, seed, seed.h / 2); setRect(rp, P, r * .8);
  // the menu first swells out of the chevron while it is still attached to it, then lifts away to its place: the neck
  // between them stretches, thins and lets go (its size on a spring, its lift on a slow ease-in-out)
  const n = Math.round(MENU.ms / 16), kf = [], io = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const anchor = up ? seed.y + seed.h * .5 : seed.y + seed.h * .5;
  for (let i = 0; i <= n; i++){ const t = i / n, sz = i === n ? 1 : springAt(t * MENU.ms / 1000, MENU), l = io(Math.min(1, Math.max(0, (t - .16) / .62)));
    const w = seed.w + (P.w - seed.w) * sz, h = seed.h + (P.h - seed.h) * sz, x = seed.x + (P.x - seed.x) * sz;
    const yAttached = up ? anchor - h : anchor, y = yAttached + (P.y - yAttached) * l;
    kf.push({ offset:t, x:x + 'px', y:y + 'px', width:w + 'px', height:h + 'px', rx:(seed.h / 2 + (r * .8 - seed.h / 2) * sz) + 'px' }); }
  A(f, rp, kf, { d:MENU.ms, e:'linear' });
  at(f, MENU.ms * .66, () => pop.classList.remove('lx-hide'));
  A(f, L, [{ opacity:1 }, { opacity:0 }], { d:200, delay:MENU.ms * .78, fill:'forwards' });
  at(f, MENU.ms * .78 + 210, () => L.remove());
};
const gooClose = (f, btn, pop) => { const d = f.contentDocument, jg = btn.closest('.mtx-jg');
  const b = rectOf(btn), P = popBox(pop), r = parseFloat(getComputedStyle(pop).borderTopLeftRadius) || 16, L = gooLayer(d), rb = L.querySelector('.b'), rp = L.querySelector('.p');
  pop.classList.add('lx-hide'); at(f, 320, () => pop.classList.remove('lx-hide'));
  const seed = { x:b.x + 4, y:b.y + 4, w:b.w - 8, h:b.h - 8 }, sp = { w:15, z:.86, ms:440 };
  setRect(rb, seed, seed.h / 2); setRect(rp, seed, seed.h / 2);
  SA(f, rp, { x:[P.x, seed.x], y:[P.y, seed.y], width:[P.w, seed.w], height:[P.h, seed.h], rx:[r * .8, seed.h / 2] }, sp);
  A(f, L, [{ opacity:1 }, { opacity:0 }], { d:120, delay:sp.ms - 100, fill:'forwards' });
  at(f, sp.ms + 30, () => { L.remove(); jg.classList.remove('lx-up'); });
};

// a card freshly mounted (a replay, or the demo starting its story again) gets the refreshed state changes: the chip
// morphs to each new state's width, the minutes roll like an odometer, the chevron's menu grows out of it
const dressSoft = (f, root) => { const W = f.contentWindow, chip = root.querySelector('.mtx-st'), pop = root.querySelector('.mtx-pop'), jm = root.querySelector('.mtx-jm');
  if (chip){ chip._w = chip.offsetWidth;
    new W.MutationObserver(ms => { for (const m of ms){
      if (m.target === chip){ const w0 = chip._w, w1 = chip.offsetWidth; chip._w = w1;
        if (!REDUCE && w0 && Math.abs(w0 - w1) > 1){ chip.style.overflow = 'hidden'; A(f, chip, [{ width:w0 + 'px' }, { width:w1 + 'px' }], { d:560, e:E.soft }); at(f, 580, () => { chip.style.overflow = ''; }); }
        continue; }
      const roll = m.target.classList && m.target.classList.contains('mtx-roll') ? m.target : null; if (!roll) continue;
      // a new number in (the ghost of the old one leaving is ours, and so is its removal)
      const old = [...m.removedNodes].find(n => n.nodeType === 1 && !n.classList.contains('lx-out'));
      if (![...m.addedNodes].some(n => n.nodeType === 1 && !n.classList.contains('lx-out'))) continue;
      const w1 = roll.offsetWidth, w0 = roll._w || w1; roll._w = w1;
      if (REDUCE || !old) continue;
      const g = old.cloneNode(true); g.className = 'lx-out'; roll.appendChild(g);
      A(f, g, [{ transform:'none', opacity:1, filter:blur(0) }, { transform:'translateY(-80%)', opacity:0, filter:blur(2) }], { d:420, e:E.out, fill:'forwards' });
      at(f, 440, () => g.remove());
      if (Math.abs(w0 - w1) > .5) A(f, roll, [{ width:w0 + 'px' }, { width:w1 + 'px' }], { d:440, e:E.out });
      chip._w = chip.offsetWidth;
    } }).observe(chip, { childList:true, subtree:true });
    const roll0 = chip.querySelector('.mtx-roll'); if (roll0) roll0._w = roll0.offsetWidth;
  }
  if (pop && jm) new W.MutationObserver(ms => { for (const m of ms){
    const was = (m.oldValue || '').split(' ').includes('open'), is = pop.classList.contains('open'); if (was === is || REDUCE) continue;
    (is ? gooOpen : gooClose)(f, jm, pop);
  } }).observe(pop, { attributes:true, attributeFilter:['class'], attributeOldValue:true });
};

/* ---------------------------------------------------------------------------------------------------- Clean */
// the calm entrance: the card fades and rises 8px from .98 over 520ms; its pieces follow 40ms apart, each rising 6px
const enterClean = (f, root) => {
  A(f, root, [{ opacity:0, transform:'translateY(8px) scale(.98)' }, { opacity:1, transform:'none' }], { d:520, e:E.clean });
  const empty = f.contentDocument.documentElement.hasAttribute('data-empty');
  const parts = empty ? [...root.querySelectorAll('.lx-em>*')] : ['.mtx-t', '.mtx-st', '.mtx-sub', '.mtx-track', '.mtx-who', '.mtx-cp', '.mtx-jg'].map(s => root.querySelector(s));
  parts.forEach((p, i) => A(f, p, [{ opacity:0, transform:'translateY(6px)' }, { opacity:1, transform:'none' }], { d:440, delay:120 + i * 40, e:E.clean }));
};
const EMPTY = '<div class="lx-em"><span class="lx-ghost" aria-hidden="true"><i class="t"></i><i class="c"></i><i class="r"></i><i class="a"></i><i class="a"></i><i class="a"></i><i class="j"></i></span>'
  + '<b>No meetings left today</b><span>Your calendar is clear until tomorrow.</span><button class="pill line sm" type="button"><svg class="i xs"><use href="#i-cal"/></svg>Schedule a meeting</button></div>';
const dressClean = (f, root) => { const W = f.contentWindow, pop = root.querySelector('.mtx-pop'), jm = root.querySelector('.mtx-jm');
  if (!root.querySelector('.lx-em')) root.insertAdjacentHTML('beforeend', EMPTY);
  // the menu scales out of the chevron itself: its origin is the chevron's middle, whichever way the menu opens
  if (pop && jm) new W.MutationObserver(() => { if (!pop.classList.contains('open')) return;
    const p = popBox(pop), b = rectOf(jm); pop.style.transformOrigin = `${b.x + b.w / 2 - p.x}px ${b.y + b.h / 2 - p.y}px`;
  }).observe(pop, { attributes:true, attributeFilter:['class'] });
};

/* ---------------------------------------------------------------------------------------------------- the frames */
const rootOf = f => f.contentDocument.querySelector('.pg-demo>.card>.stage-in>.mtx');
const hook = f => {
  f._s = { anims:new Set(), live:false };
  virtualize(f);
  const W = f.contentWindow, d = f.contentDocument;
  // the page mounts its demo the first time it scrolls into view, which would wipe the lab's state; from here on only the
  // lab mounts it, and the demo's own "play again" (again = true)
  try { W.eval('DM.mount = (function(o){ return function(card, again){ if (!again && !window.__labMount) return; return o.call(DM, card, again); }; })(DM.mount)'); } catch(e){ console.error(e); }
  d.addEventListener('pointerdown', e => { if (e.isTrusted && f._s.live) jump(f); }, true);
  const st = d.querySelector('.pg-demo>.card>.stage-in');
  if (st) new W.MutationObserver(() => { const r = rootOf(f); if (r && r !== f._root) dress(f, r); }).observe(st, { childList:true });
};
const dress = (f, root) => { f._root = root;
  if (f.dataset.k === 'new') dressSoft(f, root);
  if (f.dataset.k === 'clean') dressClean(f, root);
  // the empty state stops the demo underneath it
  if (f.dataset.k === 'clean' && f.contentDocument.documentElement.hasAttribute('data-empty')){ const card = root.closest('.card'); if (card && card._c) card._c.mine = true; }
};
// mount the card afresh (its demo starts from the top) and play the frame's entrance: the page's own for Soft now, ours
// for the others (the page's is landed first)
const replay = f => { if (!f._s) return;
  jump(f);
  const d = f.contentDocument, W = f.contentWindow, card = d.querySelector('.pg-demo>.card[data-c]'); if (!card) return;
  d.querySelectorAll('.lx-goo').forEach(x => x.remove());
  W.__labMount = true; try { W.eval('DM.mount(document.querySelector(".pg-demo>.card[data-c]"))'); } catch(e){ console.error(e); } finally { W.__labMount = false; }
  const root = rootOf(f); if (!root) return;
  dress(f, root);
  if (f.dataset.k === 'now') return;
  d.getAnimations().forEach(a => { if (!(a instanceof W.CSSAnimation) && !(a instanceof W.CSSTransition)){ try { a.finish(); } catch(e){} C.tracks.delete(a); } });
  if (REDUCE) return;
  (f.dataset.k === 'new' ? enterSoft : enterClean)(f, root);
};
const setEmpty = (f, on) => { const r = f.contentDocument.documentElement;
  r.toggleAttribute('data-empty', on); replay(f); };

window.MC = {
  C, hook, replay, setEmpty, jump,
  setFrames(fs){ C.frames = fs; },
  setSpeed(s){ C.speed = s; },
  // a recording drives the clock by hand: rec(true), then step(1000 / 60) before each frame
  rec(on){ C.rec = !!on; last = performance.now(); },
  step(ms){ advance(ms); },
  // an entrance is over once none of its animations is left on the clock
  get live(){ return C.frames.some(f => f._s && f._s.live); }
};
setInterval(() => C.frames.forEach(f => { if (f._s && f._s.live && ![...f._s.anims].some(a => C.tracks.has(a))){ f._s.live = false; f._s.anims.clear(); } }), 200);
})();
