/* Agent tree, three ways (lab/six). Without ?f this is the comparison page: three frames side by side (Soft now, the
   library's own component page; Soft refreshed; Clean), Light/Dark, 1x/0.5x and Replay. With ?f=refresh or ?f=clean it
   is the component inside one of the new frames: the library's Agent tree (same run, rows, copy, keyboard and story)
   with that variant's motion.

   One lab clock drives every frame: timers, requestAnimationFrame, performance.now and every animation in the frame
   (CSS animations and transitions and scripted ones) run on virtual time, so 0.5x slows all three frames and a
   recording can step them frame by frame. The Soft now frame gets the clock before its own scripts run (its page is
   written into the frame after the clock is in).

   Motion (owner, 17 Nov, after the review of the first Soft refreshed motion: one continuous entrance, nothing clipped,
   no blur bigger than a word, no filters, changes in place, springs only on presses):
   Soft refreshed  the card arrives whole (fades and settles 8px up from .985, 520ms on (.22,1,.36,1)) and its pieces follow
                   50ms apart, done in about 750ms. A joining row takes its place at once while the rows under it glide down
                   (FLIP, so no box grows and nothing is clipped) and fades in settling 6px from just above, its line drawing
                   in; marks shrink and grow in place and ticks draw; words swap in place rising 4px out of a 2px blur; the
                   status chip's width glides to its new words; a folded branch fades, then the rows under it glide up.
                   Presses spring (refresh.css). The card keeps its tallest height, so its edge never moves.
   Clean           the same mechanics, crisper: the card rises 8px from .98, pieces 40ms apart rising 6px, rows rise from
                   below, no blur at all, hairlines and monochrome.
   Reduced motion shows each state at once. Lab only, nothing ships. */
(() => {
'use strict';
const Q = new URLSearchParams(location.search), F = Q.get('f');
const ID = 'agent-tree', NAME = 'Agent tree';

/* ============================================================================================== the lab clock */
function makeClock(){
  const C = { vt:0, speed:1, rec:false, wins:[], sizes:{} };
  C.install = W => {
    if (W.__ck) return;
    const timers = new Map(), rafs = new Map(); let seq = 0;
    const p0 = W.performance.now(), d0 = W.Date.now(), v0 = C.vt, now = () => p0 + (C.vt - v0);
    try { W.performance.now = now; } catch(e){}
    try { W.Date.now = () => d0 + (C.vt - v0); } catch(e){}
    W.setTimeout = (fn, ms, ...a) => { const id = ++seq; timers.set(id, { t:C.vt + Math.max(0, +ms || 0), fn, a, s:id }); return id; };
    W.setInterval = (fn, ms, ...a) => { const id = ++seq, iv = Math.max(10, +ms || 0); timers.set(id, { t:C.vt + iv, fn, a, iv, s:id }); return id; };
    W.clearTimeout = W.clearInterval = id => { timers.delete(id); };
    W.requestAnimationFrame = cb => { const id = ++seq; rafs.set(id, cb); return id; };
    W.cancelAnimationFrame = id => { rafs.delete(id); };
    W.__ck = { timers, rafs, now, tracked:new Map() };
    C.wins.push(W);
  };
  const step = W => {
    const k = W.__ck; if (!k) return;
    // the timers due by now, in time order (one may queue another that is already due)
    for (let g = 0; g < 400; g++){
      let best = null, id = 0;
      for (const [i, x] of k.timers) if (x.t <= C.vt && (!best || x.t < best.t || (x.t === best.t && x.s < best.s))){ best = x; id = i; }
      if (!best) break;
      if (best.iv){ best.t += best.iv; if (best.t <= C.vt) best.t = C.vt + best.iv; } else k.timers.delete(id);
      try { if (typeof best.fn === 'function') best.fn(...best.a); } catch(e){ console.error(e); }
    }
    if (k.rafs.size){ const cbs = [...k.rafs.values()], t = k.now(); k.rafs.clear(); for (const cb of cbs) try { cb(t); } catch(e){ console.error(e); } }
    // every animation in the frame joins the clock paused, and the clock sets its time
    const d = W.document; if (!d || !d.getAnimations) return;
    for (const a of d.getAnimations()) if (!k.tracked.has(a) && a.playState !== 'finished' && a.playState !== 'idle'){
      k.tracked.set(a, C.vt - Math.max(0, Math.min(40, +a.currentTime || 0))); a.pause(); }
    for (const [a, s] of k.tracked){
      if (a.playState === 'idle' || a.playState === 'finished'){ k.tracked.delete(a); continue; }
      let end = Infinity; try { end = a.effect.getComputedTiming().endTime; } catch(e){}
      const t = C.vt - s;
      if (t >= end){ try { a.finish(); } catch(e){} k.tracked.delete(a); } else a.currentTime = Math.max(0, t);
    }
  };
  C.advance = dt => {
    C.vt += dt;
    C.wins = C.wins.filter(W => { try { return !W.closed && !!W.document; } catch(e){ return false; } });
    for (const W of C.wins) try { step(W); } catch(e){ console.error(e); }
  };
  let last = performance.now();
  const loop = now => { const dt = Math.min(50, now - last); last = now; if (!C.rec) C.advance(dt * C.speed); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  return C;
}

/* ================================================================================================ the host page */
function host(){
  const CK = window.__sxck = makeClock();
  const dark = () => document.documentElement.dataset.t === 'dark';
  const RP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>';
  const COLS = [
    ['now', 'Soft now', 'the library today'],
    ['refresh', 'Soft refreshed', 'one entrance, rows that glide in place'],
    ['clean', 'Clean', 'monochrome, hairlines, rise and stagger']
  ];
  document.body.innerHTML = `<header><b>${NAME}</b><span>Soft now, Soft refreshed, Clean</span><a href="./">All six</a><span class="sp"></span>
    <div class="seg" id="spd" role="group" aria-label="Speed"><button type="button" data-v="1">1x</button><button type="button" data-v="0.5">0.5x</button></div>
    <div class="seg" id="thm" role="group" aria-label="Theme"><button type="button" data-v="light">Light</button><button type="button" data-v="dark">Dark</button></div>
    <button class="btn" id="replay" type="button">${RP}Replay</button></header>
  <main><p class="note"><b>The orchestrator splits the work, and the tree grows as its agents join.</b> Soft refreshed arrives in one
    soft movement with its pieces close behind; each agent takes its place while the rows under it glide down, and fades in as
    its line draws; marks, words and the status chip change in place. Clean plays the same run in black, white and grey,
    crisper and flatter. Hover a branch's cost for its split, fold a branch with its chevron, pick a row for its tokens, fix the
    failed step or approve the post yourself (the demo then leaves the choices to you until Replay). Agents keep working while
    the pointer rests on them.</p>
  <section class="row" aria-label="${NAME}, three ways">${COLS.map(([k, n, s]) => `<div class="cell"><div class="lb"><b>${n}</b><span>${s}</span></div><iframe data-k="${k}" title="${NAME}, ${n}"></iframe></div>`).join('')}</section></main>
  <div class="cur" aria-hidden="true"><svg viewBox="0 0 22 22" width="22" height="22"><path d="M3 2l14 8.2-6.1 1.4L8 17.6z" fill="#111" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg></div>`;
  const frames = [...document.querySelectorAll('iframe')], fr = k => frames.find(f => f.dataset.k === k);
  const nowUrl = new URL(`../../components/${ID}.html`, location.href).href;
  // the library's page shows only its demo, on its own stage with 12px around it, without its Animate button and the
  // designs switch under it (Classic is the component); its demo sits at the top like the other two
  const ONLY = 'html{overflow:hidden!important;scrollbar-gutter:auto!important}body{visibility:hidden!important}'
    + '.cp-demo{visibility:visible!important;position:fixed!important;inset:0!important;z-index:100;margin:0!important;border-radius:0!important;overflow:hidden;background:var(--dm-stage)!important}'
    + '.cp-anim{display:none!important}.cp-demo .pg-demo{min-height:100%!important;padding:12px!important;align-content:start!important}'
    + '.pg-demo>.card{align-items:start!important;align-content:start!important;--sw:0px!important}.dm>.demo{display:none!important}body>.tip{visibility:visible!important}';
  const dressNow = () => { try { const r = fr('now').contentDocument.documentElement; r.setAttribute('data-style', 'soft'); r.setAttribute('data-theme', dark() ? 'dark' : 'light'); } catch(e){} };
  const dressMine = f => { try { f.contentDocument.documentElement.setAttribute('data-theme', dark() ? 'dark' : 'light'); } catch(e){} };
  async function loadNow(){
    const f = fr('now'); f.style.opacity = 0;
    let src = ''; try { src = await (await fetch(nowUrl)).text(); } catch(e){ return; }
    let keep = null; try { keep = localStorage.getItem('dmui-style'); localStorage.setItem('dmui-style', 'soft'); } catch(e){}
    const W = f.contentWindow, d = f.contentDocument;
    d.open();
    try { W.history.replaceState(null, '', nowUrl); } catch(e){}
    CK.install(W);
    d.write(src); d.close();
    try { if (keep === null) localStorage.removeItem('dmui-style'); else localStorage.setItem('dmui-style', keep); } catch(e){}
    const st = d.createElement('style'); st.textContent = ONLY; (d.body || d.documentElement).appendChild(st);
    dressNow();
    const show = () => { f.style.opacity = 1; f.dataset.ready = Date.now(); };
    if (d.readyState === 'complete') show(); else W.addEventListener('load', show, { once:true });
  }
  const loadMine = f => { f.style.opacity = 0; f.onload = () => { dressMine(f); f.style.opacity = 1; }; f.src = `${ID}.html?f=${f.dataset.k}&t=${dark() ? 'dark' : 'light'}`; };
  // every frame is as tall as the tallest of the three at its tallest moment, so nothing scrolls and the three line up
  const needNow = () => { try { const st = fr('now').contentDocument.querySelector('.pg-demo>.card>.stage-in>:not(template)'); return st ? Math.ceil(st.getBoundingClientRect().height) + 24 : 0; } catch(e){ return 0; } };
  const fit = () => { const n = Math.max(needNow(), CK.sizes.refresh || 0, CK.sizes.clean || 0); if (!n) return;
    frames.forEach(f => { if (parseFloat(f.style.getPropertyValue('--h')) !== n) f.style.setProperty('--h', n + 'px'); }); };
  setInterval(fit, 250);
  const paint = () => {
    document.querySelectorAll('#thm button').forEach(b => b.setAttribute('aria-pressed', String(dark() === (b.dataset.v === 'dark'))));
    document.querySelectorAll('#spd button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.v === CK.speed)));
  };
  document.querySelectorAll('#thm button').forEach(b => b.onclick = () => {
    document.documentElement.dataset.t = b.dataset.v; try { localStorage.setItem('dmui-theme', b.dataset.v); } catch(e){}
    paint(); dressNow(); frames.forEach(f => f.dataset.k !== 'now' && dressMine(f)); });
  document.querySelectorAll('#spd button').forEach(b => b.onclick = () => { CK.speed = +b.dataset.v; paint(); });
  const replay = () => frames.forEach(f => { try {
    if (f.dataset.k === 'now'){ const b = f.contentDocument.getElementById('cp-replay'); if (b) b.click(); }
    else f.contentWindow.__replay && f.contentWindow.__replay();
  } catch(e){} });
  document.getElementById('replay').onclick = replay;
  paint(); loadNow(); frames.filter(f => f.dataset.k !== 'now').forEach(loadMine);
  // for recordings: stop the clock's own pace, step it by hand, and show a pointer
  const cur = document.querySelector('.cur');
  window.__sx = { CK, replay,
    rec(on){ CK.rec = !!on; },
    step(ms){ CK.advance(ms); },
    cursor(x, y, down, on = true){ cur.style.left = x + 'px'; cur.style.top = y + 'px'; cur.classList.toggle('dn', !!down); cur.classList.toggle('on', !!on); },
    ready(){ return frames.every(f => f.style.opacity === '1') && !!CK.sizes.refresh && !!CK.sizes.clean; } };
}

/* ============================================================================================ icons and marks */
const ICON = {
  spark:'<path d="M12 3.5c.6 4.3 2.2 5.9 6.5 6.5-4.3.6-5.9 2.2-6.5 6.5-.6-4.3-2.2-5.9-6.5-6.5 4.3-.6 5.9-2.2 6.5-6.5zM18.5 15c.3 2 1 2.7 3 3-2 .3-2.7 1-3 3-.3-2-1-2.7-3-3 2-.3 2.7-1 3-3z"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 3 2.6 15 0 18M12 3c-2.6 3-2.6 15 0 18"/>',
  'file-text':'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 16.5h6"/>',
  palette:'<path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.4 0 1.8-1 1.4-2-.5-1.2.3-2.5 1.6-2.5h2a3.5 3.5 0 0 0 3.5-3.5c0-5-3.8-9-8.5-9z"/><circle cx="7.8" cy="11" r="1"/><circle cx="10.5" cy="7.3" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  edit:'<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  'chev-d':'<path d="m6 9 6 6 6-6"/>'
};
const I = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
const BRAND = {"figma":"<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 128 128\"><path fill=\"#0acf83\" d=\"M45.5 129c11.9 0 21.5-9.6 21.5-21.5V86H45.5C33.6 86 24 95.6 24 107.5S33.6 129 45.5 129zm0 0\"/><path fill=\"#a259ff\" d=\"M24 64.5C24 52.6 33.6 43 45.5 43H67v43H45.5C33.6 86 24 76.4 24 64.5zm0 0\"/><path fill=\"#f24e1e\" d=\"M24 21.5C24 9.6 33.6 0 45.5 0H67v43H45.5C33.6 43 24 33.4 24 21.5zm0 0\"/><path fill=\"#ff7262\" d=\"M67 0h21.5C100.4 0 110 9.6 110 21.5S100.4 43 88.5 43H67zm0 0\"/><path fill=\"#1abcfe\" d=\"M110 64.5c0 11.9-9.6 21.5-21.5 21.5S67 76.4 67 64.5 76.6 43 88.5 43 110 52.6 110 64.5zm0 0\"/></svg>","slack":"<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 128 128\"><path d=\"M27.255 80.719c0 7.33-5.978 13.317-13.309 13.317C6.616 94.036.63 88.049.63 80.719s5.987-13.317 13.317-13.317h13.309zm6.709 0c0-7.33 5.987-13.317 13.317-13.317s13.317 5.986 13.317 13.317v33.335c0 7.33-5.986 13.317-13.317 13.317-7.33 0-13.317-5.987-13.317-13.317zm0 0\" fill=\"#de1c59\"/><path d=\"M47.281 27.255c-7.33 0-13.317-5.978-13.317-13.309C33.964 6.616 39.951.63 47.281.63s13.317 5.987 13.317 13.317v13.309zm0 6.709c7.33 0 13.317 5.987 13.317 13.317s-5.986 13.317-13.317 13.317H13.946C6.616 60.598.63 54.612.63 47.281c0-7.33 5.987-13.317 13.317-13.317zm0 0\" fill=\"#35c5f0\"/><path d=\"M100.745 47.281c0-7.33 5.978-13.317 13.309-13.317 7.33 0 13.317 5.987 13.317 13.317s-5.987 13.317-13.317 13.317h-13.309zm-6.709 0c0 7.33-5.987 13.317-13.317 13.317s-13.317-5.986-13.317-13.317V13.946C67.402 6.616 73.388.63 80.719.63c7.33 0 13.317 5.987 13.317 13.317zm0 0\" fill=\"#2eb57d\"/><path d=\"M80.719 100.745c7.33 0 13.317 5.978 13.317 13.309 0 7.33-5.987 13.317-13.317 13.317s-13.317-5.987-13.317-13.317v-13.309zm0-6.709c-7.33 0-13.317-5.987-13.317-13.317s5.986-13.317 13.317-13.317h33.335c7.33 0 13.317 5.986 13.317 13.317 0 7.33-5.987 13.317-13.317 13.317zm0 0\" fill=\"#ebb02e\"/></svg>"};
const TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"/></svg>';
const CROSS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" pathLength="1"/></svg>';

/* ============================================================================================ the component */
function frame(){
  try { if (parent !== window && parent.__sxck) parent.__sxck.install(window); } catch(e){}
  const SOFT = F === 'refresh';
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const E = SOFT ? { ez:'cubic-bezier(.22,1,.36,1)', out:'cubic-bezier(.16,1,.3,1)', io:'cubic-bezier(.65,0,.35,1)' }
                 : { ez:'cubic-bezier(.23,1,.32,1)', out:'cubic-bezier(.23,1,.32,1)', io:'cubic-bezier(.65,0,.35,1)' };
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const h = s => { const t = document.createElement('template'); t.innerHTML = s.trim(); return t.content.firstElementChild; };
  const A = (el, kf, d, o = {}) => (REDUCE || !el) ? null : el.animate(kf, { duration:d, delay:o.delay || 0, easing:o.e || E.ez, fill:o.fill || 'backwards' });
  // a cubic-bezier, for the scripted tweens (line draws), on the same curves as the animations
  const bez = (x1, y1, x2, y2) => { const f = (a, b, t) => ((1 - 3 * b + 3 * a) * t + (3 * b - 6 * a)) * t * t + 3 * a * t;
    return x => { let lo = 0, hi = 1, t = x; for (let i = 0; i < 24; i++){ const v = f(x1, x2, t); if (Math.abs(v - x) < 1e-4) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; } return f(y1, y2, t); }; };
  const EZ = SOFT ? bez(.22, 1, .36, 1) : bez(.23, 1, .32, 1), IO = bez(.65, 0, .35, 1);

  document.body.innerHTML = `<div class="sxs"><div id="sx-root" data-c="${ID}"></div></div>`;
  const mount = $('#sx-root');
  let gen = 0, iv = [];
  const wait = ms => { const g = gen; return new Promise((res, rej) => setTimeout(() => g === gen ? res() : rej('stop'), REDUCE ? Math.min(ms, 40) : ms)); };
  const tween = (ms, ease, fn, delay = 0) => new Promise(res => { const g = gen;
    if (REDUCE || !ms){ fn(1); res(); return; }
    const t0 = performance.now() + delay;
    const f = () => { if (g !== gen) return res(); const p = Math.max(0, Math.min(1, (performance.now() - t0) / ms)); fn(ease(p)); if (p < 1) requestAnimationFrame(f); else res(); };
    requestAnimationFrame(f); });

  // a line of words swaps in place: the old one fades and lifts away, the new one rises 4px into its place (Soft
  // refreshed lets a word clear from a 2px blur, the only blur in the component; Clean rises 3px with no blur)
  function swap(box, html){
    const old = box.lastElementChild;
    if (old && old.innerHTML === html) return;
    const nu = document.createElement('span'); nu.innerHTML = html; box.appendChild(nu);
    if (!old) return;
    if (REDUCE){ old.remove(); return; }
    const far = SOFT ? 4 : 3, bl = SOFT ? 'blur(2px)' : 'blur(0px)';
    const a = A(old, [{ opacity:1, transform:'none', filter:'blur(0px)' }, { opacity:0, transform:`translateY(${-far}px)`, filter:bl }], SOFT ? 180 : 150, { fill:'forwards', e:E.io });
    a.onfinish = a.oncancel = () => old.remove();
    A(nu, [{ opacity:0, transform:`translateY(${far}px)`, filter:bl }, { opacity:1, transform:'none', filter:'blur(0px)' }], SOFT ? 320 : 240, { delay:40, e:E.ez });
  }

  // FLIP: a change to the rows (one joins, a branch folds, a way on opens under a row) lands at once in the layout, and
  // every row and the footer that moved glide from where they were to where they are now. No box grows around content,
  // nothing is clipped; the card keeps its tallest height from the start, so its edge never moves
  function flip(fn, ms = SOFT ? 460 : 380){
    const els = $$('.sxt-b,.sxt-f', root).filter(e => e.getClientRects().length);
    const y0 = new Map(els.map(e => [e, e.getBoundingClientRect().top]));
    fn();
    if (REDUCE) return;
    for (const [e, y] of y0){ if (!e.isConnected || !e.getClientRects().length) continue;
      const dy = y - e.getBoundingClientRect().top;
      if (Math.abs(dy) > .5) e.animate([{ transform:`translateY(${dy}px)` }, { transform:'translateY(0px)' }], { duration:ms, easing:E.ez, composite:'add' }); }
  }

  // the run: the orchestrator splits the work between three agents, and each agent between its steps (the library's run)
  const RUN = [
    { id:'root', n:'Orchestrator', t:'Splitting the work', ic:'spark', s:'run' },
    { id:'res', p:'root', n:'Research', t:'5 competitor pages', ic:'globe' },
    { id:'res1', p:'res', n:'Read the pages', t:'Reading 1 of 5', ic:'file-text' },
    { id:'des', p:'root', n:'Design', t:'Plan cards in Figma', ic:'palette' },
    { id:'des1', p:'des', n:'Update cards', t:'Pricing v4', app:'figma' },
    { id:'des2', p:'des', n:'Brand tokens', t:'Colours and spacing', app:'figma' },
    { id:'des3', p:'des', n:'Retry tokens', t:'Rerouted to accent.500', app:'figma' },
    { id:'cop', p:'root', n:'Copy', t:'Rewrite the plan blurbs', ic:'edit' },
    { id:'cop1', p:'cop', n:'Post to Slack', t:'Needs your OK', app:'slack' }
  ];
  const money = v => '$' + v.toFixed(2), clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const toks = v => v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : String(Math.round(v));
  const word = { queued:'queued', run:'running', wait:'needs you', done:'done', fail:'failed' };

  let N, T, root, tree, svg, chipEl, chipSw, timeEl, totEl, foot, sr, tip, sel, ended, t0, auto, chipText;
  const by = id => N.find(n => n.id === id);
  const here = n => !n.el.hidden, under = n => n.kids.filter(here);
  const sum = n => n.cost + under(n).reduce((a, k) => a + sum(k), 0), sumTok = n => n.tok + under(n).reduce((a, k) => a + sumTok(k), 0);
  const open = n => n.el.getAttribute('aria-expanded') !== 'false';

  function build(n){
    const av = n.app ? `<span class="sxt-av" aria-hidden="true">${BRAND[n.app]}</span>` : `<span class="sxt-av${n.lv ? '' : ' root'}" aria-hidden="true">${I(n.ic)}</span>`;
    n.el = h(`<div class="sxt-n" role="treeitem" aria-level="${n.lv + 1}" aria-selected="false" tabindex="${n.lv ? -1 : 0}" data-s="${n.s}" style="--lv:${n.lv}"><div class="sxt-b"><div class="sxt-r"><span class="sxt-g" aria-hidden="true"></span>${av}<span class="sxt-tx"><span class="sxt-nm"></span>${n.kids.length ? `<span class="sxt-tg" aria-hidden="true">${I('chev-d')}</span>` : ''}<span class="sxt-sub"><span></span></span></span><span class="sxt-q num"><span class="sxt-sec"></span><span class="sxt-c"></span></span></div></div></div>`);
    n.b = n.el.firstElementChild; n.g = $('.sxt-g', n.b); n.av = $('.sxt-av', n.b); n.sub = $('.sxt-sub', n.b); n.c = $('.sxt-c', n.b); n.sec = $('.sxt-sec', n.b); n.tg = $('.sxt-tg', n.b);
    $('.sxt-nm', n.b).textContent = n.n; n.sub.firstElementChild.textContent = n.t;
    if (n.tg) n.tg.hidden = true;
    mark(n, n.lv ? n.s : 'src', false);
    if (n.kids.length){ n.box = h('<div class="sxt-kids" role="group"></div>'); n.kids.forEach(k => n.box.appendChild(build(k))); n.el.appendChild(n.box); }
    if (n.lv) n.el.hidden = true;
    return n.el;
  }

  // the mark swaps in place: the old one shrinks and fades, the new one grows to its size, and a tick or cross draws in
  function mark(n, m, anim = true){
    if (n.m === m) return; n.m = m;
    const html = m === 'run' ? '<span class="sxt-spin"></span>' : m === 'wait' ? '<span class="sxt-wt"></span>' : m === 'done' ? `<span class="sxt-fill ok">${TICK}</span>`
      : m === 'fail' ? `<span class="sxt-fill bad">${CROSS}</span>` : m === 'src' ? '<span class="sxt-fill src"></span>' : '<span class="sxt-ring"></span>';
    const old = n.g.firstElementChild, nu = h(html); n.g.appendChild(nu);
    if (!old) return;
    if (!anim || REDUCE){ old.remove(); return; }
    const a = A(old, [{ opacity:1, transform:'none' }, { opacity:0, transform:'scale(.7)' }], SOFT ? 160 : 140, { fill:'forwards', e:E.io });
    a.onfinish = a.oncancel = () => old.remove();
    A(nu, [{ opacity:0, transform:'scale(.7)' }, { opacity:1, transform:'none' }], SOFT ? 300 : 220, { delay:60, e:E.ez });
    for (const p of $$('path', nu)) A(p, [{ strokeDasharray:'1', strokeDashoffset:1 }, { strokeDasharray:'1', strokeDashoffset:0 }], SOFT ? 400 : 320, { delay:SOFT ? 160 : 100, e:E.ez });
  }

  // the header's status chip: its width glides to fit its new words (300ms) while the words swap in place
  function chip(text, s){
    if (chipText === text && chipEl.dataset.s === s) return;
    const w0 = chipEl.getBoundingClientRect().width;
    chipEl.dataset.s = s;
    if (chipText !== text){
      chipText = text;
      const probe = chipEl.cloneNode(true); probe.style.cssText = 'position:absolute;visibility:hidden;width:auto;left:0;top:0';
      $('.sxt-sw', probe).innerHTML = '<span></span>'; $('.sxt-sw>span', probe).textContent = text;
      chipEl.parentElement.appendChild(probe); const w1 = probe.getBoundingClientRect().width; probe.remove();
      swap(chipSw, text.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
      chipEl.style.width = w1 + 'px';
      if (w0 && Math.abs(w1 - w0) > .5) A(chipEl, [{ width:w0 + 'px' }, { width:w1 + 'px' }], SOFT ? 300 : 260, { e:E.ez });
    }
  }

  // the numbers: each row's time and cost (a branch adds up everything under it), the run's total and clock, the status
  // chip and the selected row's split under the tree
  function paint(){
    for (const n of N){
      if (!here(n)) continue;
      const k = under(n), v = k.length ? sum(n) : n.cost;
      const se = n.secs >= 1 ? Math.floor(n.secs) + 's ·' : '';
      if (n.sec.textContent !== se) n.sec.textContent = se;
      const c$ = n.s === 'queued' && !v ? '' : money(v); if (n.c.textContent !== c$) n.c.textContent = c$;
      if (k.length) n.c.dataset.tip = `Its own ${money(n.cost)} · ${k.length} ${n.lv ? (k.length === 1 ? 'step' : 'steps') : (k.length === 1 ? 'agent' : 'agents')} ${money(sum(n) - n.cost)}`;
      const label = `${n.n}, ${word[n.s]}, ${n.sub.lastElementChild.textContent}${v ? ', ' + money(v) : ''}`;
      if (n.el.getAttribute('aria-label') !== label) n.el.setAttribute('aria-label', label);
    }
    totEl.textContent = money(sum(T));
    const run = N.filter(n => here(n) && n.lv && n.s === 'run').length, waitN = N.some(n => here(n) && n.s === 'wait');
    const fail = N.filter(n => here(n) && n.s === 'fail' && !n.el.hasAttribute('data-dim')).length;
    const st = ended ? 'Done' : waitN ? 'Needs you' : fail && !run ? `${fail} failed` : run ? `${run} running` : N.some(n => n.lv && n.s === 'done') ? 'Wrapping up' : 'Starting';
    chip(st, ended ? 'done' : waitN ? 'wait' : fail && !run ? 'fail' : 'run');
    timeEl.textContent = clock(((ended || performance.now()) - t0) / 1000);
    const x = sel || T, kx = under(x);
    const own = kx.length ? ` · its own ${money(x.cost)} · ${kx.length} ${x.lv ? (kx.length === 1 ? 'step' : 'steps') : (kx.length === 1 ? 'agent' : 'agents')} ${money(sum(x) - x.cost)}` : ` · ${money(x.cost)}`;
    const f = `<b>${x.n}</b>${own} · ${toks(sumTok(x))} tokens`;
    if (foot._who !== x){ const first = !foot._who; foot._who = x; if (first) foot.innerHTML = `<span>${f}</span>`; else swap(foot, f); }
    else if (foot.lastElementChild.innerHTML !== f) foot.lastElementChild.innerHTML = f;
  }

  // states: the mark morphs, a new line of words slides into place
  function set(n, s, t){
    if (s === 'run' && n.s !== 'run') n.t0 = performance.now() - n.secs * 1000;
    n.s = s; n.el.dataset.s = s;
    mark(n, n.lv ? s : s === 'fail' ? 'fail' : 'src', here(n));
    if (t !== undefined) say(n, t);
    if (s !== 'wait' && s !== 'fail') ask(n, null);
    paint();
  }
  function say(n, t){ if (n.sub.lastElementChild.textContent === t) return; if (here(n)) swap(n.sub, t.replace(/</g, '&lt;')); else n.sub.lastElementChild.textContent = t; }

  // a row joins: it takes its place at once, the rows under it glide down to make room, and it fades in, settling 6px
  // (from just above in Soft refreshed, as if it came from the row before; rising from below in Clean) while its line
  // draws in. Nothing is clipped and no box grows
  async function arrive(n){
    const p = n.parent;
    if (p && p.tg && p.tg.hidden){ p.tg.hidden = false; p.el.setAttribute('aria-expanded', 'true'); A(p.tg, [{ opacity:0, transform:'scale(.7)' }, { opacity:1, transform:'none' }], 280, { e:E.ez }); }
    n.d = 0;
    if (REDUCE || (p && !open(p))){ n.el.hidden = false; n.d = 1; paint(); return; }
    flip(() => { n.el.hidden = false; paint(); });
    A(n.b, [{ opacity:0, transform:`translateY(${SOFT ? -6 : 6}px)` }, { opacity:1, transform:'none' }], SOFT ? 440 : 440, { delay:SOFT ? 80 : 60, e:E.ez });
    tween(SOFT ? 420 : 380, EZ, v => { n.d = v; }, 60);
    await wait(SOFT ? 480 : 460);
  }
  async function grow(n, s, t){ set(n, s, t); await arrive(n); }

  // the way on, in place under a row: a fix for a failed step, or Approve and Hold. It takes its place under the row, the
  // rows under it glide down, and its buttons fade in rising 4px, 50ms apart (40ms in Clean); it leaves the same way back
  function ask(n, how){
    if (n.ask){ const box = n.ask; n.ask = null;
      if (REDUCE) box.remove();
      else { const a = A(box, [{ opacity:1 }, { opacity:0 }], 140, { fill:'forwards', e:E.io });
        a.onfinish = a.oncancel = () => { if (box.isConnected) flip(() => box.remove()); }; } }
    if (!how) return null;
    const box = h(`<div class="sxt-ask"><div>${how.map(([k, label]) => `<button type="button" class="pill sm ${k === 'yes' ? 'primary' : 'line'} sxt-${k}">${label}</button>`).join('')}</div></div>`);
    flip(() => n.b.appendChild(box)); n.ask = box;
    $$('button', box).forEach((b, i) => A(b, [{ opacity:0, transform:'translateY(4px)' }, { opacity:1, transform:'none' }], 400, { delay:80 + i * (SOFT ? 50 : 40), e:E.ez }));
    return box;
  }

  // folding a branch: its rows fade, lifting 4px, then leave the layout while the rows under them glide up; opening it,
  // the rows take their places, the rows under them glide down, and they fade in settling 4px, 50ms apart (40ms in Clean).
  // Their lines retract and draw again
  async function fold(n, o){
    if (!under(n).length || open(n) === o) return;
    n.el.setAttribute('aria-expanded', String(o));
    const g = n.box, kids = under(n), desc = [];
    const walk = x => under(x).forEach(k => { desc.push(k); walk(k); }); walk(n);
    if (!o && g.contains(document.activeElement)) pick(n, true);
    const mine = n._f = (n._f || 0) + 1, myGen = gen;
    kids.forEach(k => k.el.getAnimations().forEach(a => a.cancel()));
    if (REDUCE){ g.classList.toggle('shut', !o); g.inert = !o; desc.forEach(k => { k.d = o ? 1 : 0; }); return; }
    g.inert = !o;
    if (!o){
      kids.forEach(k => A(k.el, [{ opacity:1, transform:'none' }, { opacity:0, transform:'translateY(-4px)' }], 160, { fill:'forwards', e:E.io }));
      desc.forEach(k => { const d0 = k.d; tween(160, x => x, v => { k.d = d0 * (1 - v); }); });
      await wait(170);
      if (myGen !== gen || n._f !== mine) return;
      flip(() => { g.classList.add('shut'); kids.forEach(k => k.el.getAnimations().forEach(a => a.cancel())); });
    } else {
      flip(() => g.classList.remove('shut'));
      kids.forEach((k, i) => A(k.el, [{ opacity:0, transform:'translateY(-4px)' }, { opacity:1, transform:'none' }], 400, { delay:60 + i * (SOFT ? 50 : 40), e:E.ez }));
      desc.forEach(k => { const d0 = k.d; tween(SOFT ? 420 : 380, EZ, v => { k.d = Math.max(d0, v); }, 80); });
    }
  }

  // the lines: from a parent's mark down and into each child's mark, drawn as far as the child has arrived (d); grey
  // rails, the line into a running or waiting row in a quiet accent (ink in Clean), a failed one in a quiet red
  function lines(){
    if (!svg || !svg.isConnected) return;
    // where each mark is now, glides included (the card's own entrance scale taken out)
    const tr = tree.getBoundingClientRect(), k = tree.offsetWidth ? tr.width / tree.offsetWidth : 1;
    const pos = el => { const r = el.getBoundingClientRect(); return [(r.left + r.width / 2 - tr.left) / k, (r.top + r.height / 2 - tr.top) / k]; };
    const shut = n => { for (let p = n.parent; p; p = p.parent) if (p.box.classList.contains('shut')) return true; return false; };
    const P = { r:'', on:'', bad:'' };
    for (const n of N){
      if (!n.parent || !here(n) || !(n.d > 0) || shut(n)) continue;
      const [px, py] = pos(n.parent.g), [cx, cy] = pos(n.g), R = 6;
      const c = n.s === 'run' || n.s === 'wait' ? 'on' : n.s === 'fail' && !n.el.hasAttribute('data-dim') ? 'bad' : 'r';
      const d = Math.max(0, Math.min(1, n.d));
      P[c] += `<path pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${(1 - d).toFixed(4)}" d="M${px} ${py + 9}V${Math.max(py + 9, cy - R)}Q${px} ${cy} ${px + R} ${cy}H${cx - 9}"/>`;
    }
    const html = `<g class="r">${P.r}</g><g class="on">${P.on}</g><g class="bad">${P.bad}</g>`;
    if (svg._h !== html){ svg._h = html; svg.innerHTML = html; }
  }
  const lineLoop = () => { lines(); requestAnimationFrame(lineLoop); };

  // a row picked with the mouse or keys: its split shows under the tree
  function pick(n, focus){
    sel = n; for (const x of N){ x.el.tabIndex = x === n ? 0 : -1; x.el.setAttribute('aria-selected', String(x === n)); }
    if (focus) n.el.focus({ preventScroll:true }); paint();
  }
  const visible = () => N.filter(n => { if (!here(n)) return false; for (let p = n.parent; p; p = p.parent) if (!open(p)) return false; return true; })
    .sort((a, b) => a.el.compareDocumentPosition(b.el) & 4 ? -1 : 1);

  // the cost's readout: it scales from .96 out of the cost (Soft refreshed) or rises 4px (Clean); it closes in 130ms
  let tipFor = null;
  function showTip(el){
    tipFor = el; tip.textContent = el.dataset.tip;
    const r = el.getBoundingClientRect(), pr = root.getBoundingClientRect(), w = tip.offsetWidth;
    const x = Math.max(4, Math.min(pr.width - w - 4, r.left - pr.left + r.width - w)), y = r.top - pr.top - 30;
    tip.style.left = x + 'px'; tip.style.top = y + 'px'; tip.style.transformOrigin = `${r.left - pr.left + r.width / 2 - x}px 100%`;
    tip.getAnimations().forEach(a => a.cancel());
    if (REDUCE){ tip.style.opacity = 1; return; }
    tip.style.opacity = 1;
    A(tip, SOFT ? [{ opacity:0, transform:'scale(.96)' }, { opacity:1, transform:'none' }] : [{ opacity:0, transform:'translateY(4px)' }, { opacity:1, transform:'none' }], SOFT ? 200 : 180, { e:E.ez });
  }
  function hideTip(){
    if (!tipFor) return; tipFor = null;
    tip.getAnimations().forEach(a => a.cancel());
    if (REDUCE){ tip.style.opacity = 0; return; }
    const a = A(tip, SOFT ? [{ opacity:1 }, { opacity:0, transform:'scale(.96)' }] : [{ opacity:1 }, { opacity:0 }], 130, { fill:'forwards', e:E.io });
    a.onfinish = () => { if (!tipFor){ tip.style.opacity = 0; a.cancel(); } };
  }

  // the entrance: the card arrives whole (it fades and settles 8px up from .985 in Soft refreshed, 520ms; from .98 in
  // Clean), and its pieces follow on a gentle cascade, fading and rising 5px (6px in Clean), 50ms apart (40ms in Clean).
  // Done in about 750ms. No seed, no clip, no blur
  function entrance(){
    if (REDUCE) return 0;
    const parts = [...$$('.sxt-t,.sxt-s,.sxt-tot', root), T.b, foot];
    A(root, [{ opacity:0, transform:`translateY(8px) scale(${SOFT ? .985 : .98})` }, { opacity:1, transform:'none' }], 520, { e:E.ez });
    parts.forEach((e, i) => A(e, [{ opacity:0, transform:`translateY(${SOFT ? 5 : 6}px)` }, { opacity:1, transform:'none' }], SOFT ? 420 : 440, { delay:80 + i * (SOFT ? 50 : 40), e:E.ez }));
    return 80 + parts.length * (SOFT ? 50 : 40) + 420;
  }

  // the tallest the card gets (every row in, and the approval under the last step), for the frame's height
  function tallest(){
    const hid = N.filter(n => n.el.hidden); hid.forEach(n => { n.el.hidden = false; });
    const tg = N.filter(n => n.tg && n.tg.hidden); tg.forEach(n => { n.tg.hidden = false; });
    // (a way on that is open now, and a folded branch, are set aside while it measures, so each row is counted once)
    const real = $$('.sxt-ask', root); real.forEach(e => { e.style.display = 'none'; });
    const shut = N.filter(n => n.box && n.box.classList.contains('shut')); shut.forEach(n => n.box.classList.remove('shut'));
    const b = h('<div class="sxt-ask"><div><button type="button" class="pill sm primary">Approve</button></div></div>'); by('cop1').b.appendChild(b);
    const v = root.offsetHeight; b.remove(); hid.forEach(n => { n.el.hidden = true; }); tg.forEach(n => { n.tg.hidden = true; });
    real.forEach(e => { e.style.display = ''; }); shut.forEach(n => n.box.classList.add('shut'));
    return v;
  }
  // the card keeps its tallest height from the start, so it never grows as rows join (the footer sits under the tree)
  const report = () => { root.style.minHeight = ''; const v = Math.ceil(tallest()); root.style.minHeight = v + 'px';
    try { if (parent !== window && parent.__sxck) parent.__sxck.sizes[F] = v + 24; } catch(e){} };

  function start(){
    gen++; iv.forEach(clearInterval); iv = []; tipFor = null;
    mount.innerHTML = `<div class="sxt panel" data-s="run">
      <div class="sxt-h"><div class="sxt-hd"><b class="sxt-t">Redesign the pricing page</b><span class="sxt-s"><span class="sxt-st" data-s="run"><i class="sxt-dot" aria-hidden="true"></i><span class="sxt-sw"><span>Starting</span></span></span><span class="sxt-time num">0:00</span></span></div><span class="sxt-tot num">$0.00</span></div>
      <div class="sxt-tree" role="tree" aria-label="Agents"><svg class="sxt-ln" aria-hidden="true"></svg></div>
      <p class="sxt-f"></p><p class="sxt-sr" role="status"></p><div class="sxt-tip" aria-hidden="true"></div></div>`;
    root = $('.sxt', mount); tree = $('.sxt-tree', root); svg = $('.sxt-ln', root); chipEl = $('.sxt-st', root); chipSw = $('.sxt-sw', root);
    timeEl = $('.sxt-time', root); totEl = $('.sxt-tot', root); foot = $('.sxt-f', root); sr = $('.sxt-sr', root); tip = $('.sxt-tip', root);
    chipText = 'Starting'; sel = null; ended = 0; auto = true;
    N = RUN.map(x => ({ cost:0, tok:0, ...x, s:x.s || 'queued', kids:[], secs:0, t0:0, d:0, m:'' }));
    N.forEach(n => { n.parent = n.p ? by(n.p) : null; n.lv = n.parent ? n.parent.lv + 1 : 0; if (n.parent) n.parent.kids.push(n); });
    T = N[0]; T.d = 1;
    tree.appendChild(build(T));
    foot._who = null;
    t0 = performance.now(); paint(); report();
    const lead = entrance();
    t0 = performance.now() + lead;
    wire();
    const g = gen;
    iv.push(setInterval(() => {
      if (g !== gen || ended) return; const now = performance.now(); if (now < t0) return;
      for (const n of N) if (here(n) && n.s === 'run'){ n.cost += n.lv ? .0014 : .0004; n.tok += n.lv ? 21 : 6; n.secs = (now - n.t0) / 1000; }
      paint();
    }, 100));
    story(lead).catch(e => { if (e !== 'stop') console.error(e); });
  }

  // the run (the library's): agents join one at a time and split their work. One design step fails on a token the library
  // doesn't have and is rerouted to a retry (a person can take the fix first); the post waits for a person. Without a
  // person, the demo takes the fix and approves the post after a while; once someone clicks, focuses or types in the
  // component, those choices are theirs until Replay
  async function story(lead){
    await wait(lead + 300); T.t0 = performance.now();
    await grow(by('res'), 'run'); await grow(by('des'), 'run'); await grow(by('cop'), 'queued'); say(T, '3 agents at work');
    await grow(by('res1'), 'run'); await grow(by('des1'), 'run'); await grow(by('des2'), 'queued');
    await wait(300); say(by('res1'), 'Reading 3 of 5');
    await wait(500); say(by('res1'), 'Reading 5 of 5');
    await wait(450); set(by('res1'), 'done', '5 pages, 12k words');
    await wait(350); set(by('res'), 'done', 'Notes in Pricing v4');
    await wait(350); set(by('des1'), 'done', 'Pro and Team done'); set(by('des2'), 'run', 'Matching colours');
    await wait(1100);
    const tk = by('des2'); set(tk, 'fail', 'Missing accent.600'); sr.textContent = `${tk.n} failed: Missing accent.600`;
    await new Promise((res, rej) => { const g = gen; $('.sxt-fix', ask(tk, [['fix', 'Use accent.500']])).onclick = () => res();
      setTimeout(() => { if (g !== gen) rej('stop'); else if (auto) res(); }, REDUCE ? 40 : 1300); });
    ask(tk, null); tk.el.setAttribute('data-dim', ''); paint();
    await grow(by('des3'), 'run', 'Rerouted to accent.500');
    await wait(1200); set(by('des3'), 'done', 'Used accent.500');
    await wait(300); set(by('des'), 'done', 'Cards and tokens done'); set(by('cop'), 'run', 'Writing 3 blurbs');
    await wait(1200); say(by('cop'), '3 blurbs written');
    const ps = by('cop1'); await grow(ps, 'wait', 'Needs your OK');
    sr.textContent = `${ps.n} needs you`;
    await new Promise((res, rej) => {
      const box = ask(ps, [['yes', 'Approve'], ['no', 'Hold']]), g = gen;
      $('.sxt-yes', box).onclick = () => res();
      $('.sxt-no', box).onclick = e => { say(ps, 'On hold'); e.currentTarget.remove(); $('.sxt-yes', box).focus({ preventScroll:true }); };
      const later = () => setTimeout(() => { if (g !== gen) rej('stop'); else if (auto) res(); else later(); }, REDUCE ? 40 : 2600);
      later();
    });
    set(ps, 'done', 'Posted to #pricing');
    await wait(350); set(by('cop'), 'done', '3 blurbs posted');
    await wait(300); set(T, 'done', 'Run finished'); ended = performance.now(); paint(); sr.textContent = 'Run finished';
  }

  // the mouse and the keys (the library's tree keys): Up and Down move through the rows you can see, Right opens a branch or
  // moves into it, Left closes it or moves to its parent, Home and End jump; Enter or Space on a row with a way on moves to
  // its first button, Escape there comes back to the row
  function wire(){
    const mine = e => { if (e.isTrusted) auto = false; };
    root.addEventListener('pointerdown', mine, true); root.addEventListener('keydown', mine, true); root.addEventListener('focusin', mine, true);
    tree.addEventListener('click', e => {
      const row = e.target.closest('.sxt-n'); if (!row || e.target.closest('button')) return;
      const n = N.find(x => x.el === row);
      if (e.target.closest('.sxt-tg')){ fold(n, !open(n)); return; }
      pick(n, true);
    });
    tree.addEventListener('keydown', e => {
      if (e.target.closest('button')){ if (e.key === 'Escape'){ const n = N.find(x => x.el === e.target.closest('.sxt-n')); if (n){ e.preventDefault(); pick(n, true); } } return; }
      const v = visible(), i = v.findIndex(n => n.el === e.target); if (i < 0) return;
      const n = v[i], k = under(n).length; let go = null;
      if (e.key === 'ArrowDown') go = v[i + 1]; else if (e.key === 'ArrowUp') go = v[i - 1];
      else if (e.key === 'ArrowRight'){ if (k && !open(n)) fold(n, true); else if (k) go = under(n)[0]; }
      else if (e.key === 'ArrowLeft'){ if (k && open(n)) fold(n, false); else go = n.parent; }
      else if (e.key === 'Home') go = v[0]; else if (e.key === 'End') go = v[v.length - 1];
      else if (e.key === 'Enter' || e.key === ' '){ const b = n.ask && $('button', n.ask); if (b) b.focus(); else pick(n, true); }
      else return;
      e.preventDefault(); if (go) pick(go, true);
    });
    tree.addEventListener('pointerover', e => { const c = e.target.closest('.sxt-c[data-tip]'); if (c && c !== tipFor) showTip(c); });
    tree.addEventListener('pointerout', e => { const c = e.target.closest('.sxt-c[data-tip]'); if (c && !c.contains(e.relatedTarget)) hideTip(); });
  }

  window.__replay = start;
  requestAnimationFrame(lineLoop);
  const go = () => { start(); new ResizeObserver(report).observe(document.body); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();
}

if (F === 'refresh' || F === 'clean') frame(); else host();
})();
