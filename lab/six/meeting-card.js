/* Meeting card in the six-component lab: the lab clock and the motion of the two new variants, run in the lab page and
   laid on the real component in its frames (/components/meeting-card.html, its own markup, copy and demo story).
   Soft refreshed follows the corrected motion rules (owner, 17 Nov: the seed, satellites and goo read as "weird,
   clipping, unnatural"): the card arrives whole and its pieces follow on a gentle cascade, done within 800ms; state
   changes happen in place (the chip eases to its new width, the minutes roll, the lines glide); the menu scales and fades
   out of the chevron. Nothing grows around its content, nothing is clipped, nothing bigger than a word is blurred.
   Clean takes the calm Access Grid vocabulary: the card rises 8px from .98, its pieces follow 40ms apart, and the menu
   scales and fades out of the chevron.
   Every frame runs on one lab clock: the page's own timers, frame loops, CSS transitions and animations and ours, so 0.5x
   slows all of it (the demo story included) and a recording can step it frame by frame. A press inside a card during its
   entrance lands the entrance at once. Lab only, nothing ships from here. */
(() => {
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const E = { soft:'cubic-bezier(.22,1,.36,1)', clean:'cubic-bezier(.23,1,.32,1)' };
const C = { vt:0, speed:1, rec:false, tracks:new Map(), timers:[], q:[], frames:[], nid:1e7, pre:new Set() };

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
// pre: what is read before the step's timers change anything (the chip's width as it is on screen)
const advance = dt => { C.pre.forEach(fn => fn()); C.vt += dt; runTimers(); runQ(); runRaf(); adopt(); drive(); };
let last = performance.now();
const tick = now => { const dt = Math.min(64, now - last); last = now; if (!C.rec) advance(dt * C.speed); requestAnimationFrame(tick); };
requestAnimationFrame(tick);

// at(f, ms, fn): a step on the lab clock; 'fx' steps tidy up after an entrance and still run when it is cut short
const at = (f, ms, fn, kind = 'fx') => C.q.push({ f, t:C.vt + ms, fn, kind });
const A = (f, el, kf, o = {}) => { if (!el || !el.animate) return null;
  const a = el.animate(kf, { duration:o.d ?? 260, delay:o.delay || 0, easing:o.e || E.soft, fill:o.fill || 'backwards' });
  track(a); f._s.anims.add(a); f._s.live = true; return a; };
const jump = f => {
  for (const a of f._s.anims) if (C.tracks.has(a)){ try { a.finish(); } catch(e){} C.tracks.delete(a); }
  f._s.anims.clear();
  const mine = C.q.filter(e => e.f === f); C.q = C.q.filter(e => e.f !== f);
  mine.filter(e => e.kind === 'fx').forEach(e => { try { e.fn(); } catch(x){} });
  f._s.live = false;
};
const rectOf = el => { const r = el.getBoundingClientRect(); return { x:r.left, y:r.top, w:r.width, h:r.height }; };
// a popover's box from its placed position (its own transform is mid-transition while it opens)
const popBox = pop => { const h = pop.offsetParent.getBoundingClientRect(); return { x:h.left + parseFloat(pop.style.left || 0), y:h.top + parseFloat(pop.style.top || 0), w:pop.offsetWidth, h:pop.offsetHeight }; };
// a menu scales and fades out of its trigger: its transform origin is the chevron's middle, whichever way it opens
const originAtTrigger = (W, pop, btn) => new W.MutationObserver(() => { if (!pop.classList.contains('open')) return;
  const p = popBox(pop), b = rectOf(btn); pop.style.transformOrigin = `${b.x + b.w / 2 - p.x}px ${b.y + b.h / 2 - p.y}px`;
}).observe(pop, { attributes:true, attributeFilter:['class'] });
// the card and its pieces arrive on one rhythm: the whole card first (opacity, a short rise, a touch of scale; its
// shadow moves with it), then its pieces a beat later, opacity and a few px of rise only. Transform and opacity only
const cascade = (f, root, parts, o) => {
  A(f, root, [{ opacity:0, transform:`translateY(8px) scale(${o.scale})` }, { opacity:1, transform:'none' }], { d:o.card, e:o.e });
  parts.filter(Boolean).forEach((p, i) => A(f, p, [{ opacity:0, transform:`translateY(${o.rise}px)` }, { opacity:1, transform:'none' }], { d:o.part, delay:o.first + i * o.step, e:o.e }));
};

/* ---------------------------------------------------------------------------------------------------- Soft refreshed */
// the entrance (owner, 17 Nov: one continuous entrance): the card arrives whole over 520ms; the title, chip, time line,
// track, people, copy button and Join follow 50ms apart, each 400ms. All of it is done by 800ms. Nothing grows, nothing
// is clipped, nothing is blurred
const PARTS = ['.mtx-t', '.mtx-st', '.mtx-sub', '.mtx-track', '.mtx-who', '.mtx-cp', '.mtx-jg'];
const enterSoft = (f, root) => cascade(f, root, PARTS.map(s => root.querySelector(s)), { scale:.985, card:520, rise:5, part:400, first:100, step:50, e:E.soft });

// a card freshly mounted (a replay, or the demo starting its story again) gets the refreshed state changes, all in place:
// the chip eases to each new state's width while the old words fade out and the new ones rise in; the minutes roll like an
// odometer; the menu scales and fades out of the chevron (CSS, with its origin set here)
const dressSoft = (f, root) => { const W = f.contentWindow, chip = root.querySelector('.mtx-st'), pop = root.querySelector('.mtx-pop'), jm = root.querySelector('.mtx-jm');
  if (chip){
    // the chip's width as it is on screen, read before each step of the clock, so a new state eases from exactly there
    const cs = getComputedStyle(chip), pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const seen = () => { if (!chip.isConnected){ C.pre.delete(seen); return; } chip._w = chip.getBoundingClientRect().width; }; C.pre.add(seen); seen();
    // the width the new state wants: its words' own width and the chip's padding
    const natural = () => { const k = [...chip.children].find(c => !c.classList.contains('lx-was')); return k ? k.getBoundingClientRect().width + pad : chip.offsetWidth; };
    const ours = n => n.nodeType !== 1 || n.classList.contains('lx-was');
    new W.MutationObserver(ms => { for (const m of ms){
      if (m.target === chip){
        if ([...m.addedNodes, ...m.removedNodes].every(ours)) continue;
        if (REDUCE) continue;
        // the old words fade out where they were
        const old = [...m.removedNodes].find(n => !ours(n));
        if (old){ const g = old.cloneNode(true); g.classList.remove('mtx-fade'); g.classList.add('lx-was'); g.querySelectorAll('.in').forEach(x => x.classList.remove('in')); g.querySelectorAll('.lx-out').forEach(x => x.remove()); chip.appendChild(g);
          A(f, g, [{ opacity:1 }, { opacity:0, transform:'translateY(-3px)' }], { d:80, e:E.soft, fill:'forwards' }); at(f, 90, () => g.remove()); }
        // then the chip eases to its new width with nothing inside it, and the new words rise in once it is there (CSS,
        // .mtx-fade), so no words are ever cut by the chip's edge
        if (chip._a){ chip._a.cancel(); C.tracks.delete(chip._a); }
        const w0 = chip._w, w1 = natural();
        if (w0 && Math.abs(w0 - w1) > 1) chip._a = A(f, chip, [{ width:w0 + 'px' }, { width:w1 + 'px' }], { d:260, delay:80, e:E.soft, fill:'backwards' });
        continue; }
      const roll = m.target.classList && m.target.classList.contains('mtx-roll') ? m.target : null; if (!roll) continue;
      // a new number in (the ghost of the old one leaving is ours, and so is its removal)
      const old = [...m.removedNodes].find(n => n.nodeType === 1 && !n.classList.contains('lx-out'));
      if (![...m.addedNodes].some(n => n.nodeType === 1 && !n.classList.contains('lx-out'))) continue;
      const w1 = roll.offsetWidth, w0 = roll._w || w1; roll._w = w1;
      if (REDUCE || !old) continue;
      const g = old.cloneNode(true); g.className = 'lx-out'; roll.appendChild(g);
      A(f, g, [{ transform:'none', opacity:1 }, { transform:'translateY(-80%)', opacity:0 }], { d:380, e:E.soft, fill:'forwards' });
      at(f, 390, () => g.remove());
      if (Math.abs(w0 - w1) > .5) A(f, roll, [{ width:w0 + 'px' }, { width:w1 + 'px' }], { d:300, e:E.soft });
    } }).observe(chip, { childList:true, subtree:true });
    const roll0 = chip.querySelector('.mtx-roll'); if (roll0) roll0._w = roll0.offsetWidth;
  }
  if (pop && jm) originAtTrigger(W, pop, jm);
};

/* ---------------------------------------------------------------------------------------------------- Clean */
// the calm entrance: the card fades and rises 8px from .98 over 520ms; its pieces follow 40ms apart, each rising 6px
const enterClean = (f, root) => {
  const empty = f.contentDocument.documentElement.hasAttribute('data-empty');
  cascade(f, root, empty ? [...root.querySelectorAll('.lx-em>*')] : PARTS.map(s => root.querySelector(s)), { scale:.98, card:520, rise:6, part:440, first:120, step:40, e:E.clean });
};
const EMPTY = '<div class="lx-em"><span class="lx-ghost" aria-hidden="true"><i class="t"></i><i class="c"></i><i class="r"></i><i class="a"></i><i class="a"></i><i class="a"></i><i class="j"></i></span>'
  + '<b>No meetings left today</b><span>Your calendar is clear until tomorrow.</span><button class="pill line sm" type="button"><svg class="i xs"><use href="#i-cal"/></svg>Schedule a meeting</button></div>';
const dressClean = (f, root) => { const W = f.contentWindow, pop = root.querySelector('.mtx-pop'), jm = root.querySelector('.mtx-jm');
  if (!root.querySelector('.lx-em')) root.insertAdjacentHTML('beforeend', EMPTY);
  if (pop && jm) originAtTrigger(W, pop, jm);
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
