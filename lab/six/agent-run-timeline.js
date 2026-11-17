/* Agent run timeline, three ways (lab/six). Without ?f this is the comparison page: three frames side by side (Soft now,
   the library's own component page; Soft refreshed; Clean), Light/Dark, 1x/0.5x and Replay. With ?f=refresh or ?f=clean
   it is the component inside one of the new frames: the library's Agent run timeline (same run, steps, times, costs and
   key) with that variant's look and motion.

   One lab clock drives every frame: timers, requestAnimationFrame, performance.now and every animation in the frame
   (CSS animations and transitions and scripted ones) run on virtual time, so 0.5x slows all three frames and a
   recording can step them frame by frame. The Soft now frame gets the clock before its own scripts run.

   Motion (owner, 17 Nov, after the review of the first Soft refreshed motion: one continuous entrance, nothing clipped,
   no blur bigger than a word, no filters, changes in place, springs only on presses):
   Soft refreshed  the card arrives whole (fades and settles 8px up from .985, 520ms on (.22,1,.36,1)); its header, key,
                   axis, rows and footer follow on a gentle cascade, done in about 800ms. Fill while counting: each bar
                   grows from its start while its time counts. Done ticks draw in; the failed run's chip fades in beside its
                   bar; at the end the playhead's label and the tag glide to their new widths while their words swap in
                   place, and the footer's placeholders fill as the totals count up together on one 900ms ease.
   Clean           the same story, crisper: monochrome bars (ink, dark grey, mid grey), each waiting step's planned span as
                   a hatch, the card rising 8px from .98 with its pieces 40ms apart rising 6px, no blur.
   Reduced motion shows the finished run at once. Lab only, nothing ships from here. */
(() => {
'use strict';
const Q = new URLSearchParams(location.search), F = Q.get('f');
const ID = 'agent-run-timeline', NAME = 'Agent run timeline';

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
    ['refresh', 'Soft refreshed', 'one entrance, bars that fill while counting'],
    ['clean', 'Clean', 'monochrome bars, a hatch for waiting']
  ];
  document.body.innerHTML = `<header><b>${NAME}</b><span>Soft now, Soft refreshed, Clean</span><a href="./">All six</a><span class="sp"></span>
    <div class="seg" id="spd" role="group" aria-label="Speed"><button type="button" data-v="1">1x</button><button type="button" data-v="0.5">0.5x</button></div>
    <div class="seg" id="thm" role="group" aria-label="Theme"><button type="button" data-v="light">Light</button><button type="button" data-v="dark">Dark</button></div>
    <button class="btn" id="replay" type="button">${RP}Replay</button></header>
  <main><p class="note"><b>Every model and tool step of a run on one time axis.</b> Soft refreshed arrives in one soft movement with
    its rows close behind, then grows each step's bar from its start while its time counts; done ticks draw in, and at the end
    the tag turns to Done and the totals count up. Bars are one blue in three tones. Clean plays the same run in black, white
    and grey, with each waiting step's planned span as a hatch. Hover a row for its time and cost; pick a kind in the key to
    pick out its steps.</p>
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
  brain:'<path d="M9.5 4.5a2.5 2.5 0 0 0-2.5 2.5 3 3 0 0 0-2.2 5 3 3 0 0 0 1.7 5A3 3 0 0 0 12 18V6.5a2 2 0 0 0-2.5-2zM14.5 4.5A2.5 2.5 0 0 1 17 7a3 3 0 0 1 2.2 5 3 3 0 0 1-1.7 5A3 3 0 0 1 12 18"/>',
  'file-text':'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 16.5h6"/>',
  edit:'<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  term:'<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="m7 10 3 2.5L7 15M12.5 15.5H17"/>',
  refresh:'<path d="M20 12a8 8 0 1 1-2.4-5.7M20 4v4.5h-4.5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  dollar:'<path d="M12 3v18M16.5 7.5c-.6-1.6-2.3-2.5-4.5-2.5-2.5 0-4.3 1.2-4.3 3.2 0 4.6 9 2.4 9 7.2 0 2-1.9 3.4-4.7 3.4-2.4 0-4.2-1-4.8-2.8"/>',
  layers:'<path d="m12 3.5 9 4.8-9 4.8-9-4.8z"/><path d="m3 12.3 9 4.8 9-4.8M3 16.3l9 4.8 9-4.8"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5" pathLength="1"/>'
};
const I = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
const BRAND = {"figma": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 128 128\"><path fill=\"#0acf83\" d=\"M45.5 129c11.9 0 21.5-9.6 21.5-21.5V86H45.5C33.6 86 24 95.6 24 107.5S33.6 129 45.5 129zm0 0\"/><path fill=\"#a259ff\" d=\"M24 64.5C24 52.6 33.6 43 45.5 43H67v43H45.5C33.6 86 24 76.4 24 64.5zm0 0\"/><path fill=\"#f24e1e\" d=\"M24 21.5C24 9.6 33.6 0 45.5 0H67v43H45.5C33.6 43 24 33.4 24 21.5zm0 0\"/><path fill=\"#ff7262\" d=\"M67 0h21.5C100.4 0 110 9.6 110 21.5S100.4 43 88.5 43H67zm0 0\"/><path fill=\"#1abcfe\" d=\"M110 64.5c0 11.9-9.6 21.5-21.5 21.5S67 76.4 67 64.5 76.6 43 88.5 43 110 52.6 110 64.5zm0 0\"/></svg>", "slack": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 128 128\"><path d=\"M27.255 80.719c0 7.33-5.978 13.317-13.309 13.317C6.616 94.036.63 88.049.63 80.719s5.987-13.317 13.317-13.317h13.309zm6.709 0c0-7.33 5.987-13.317 13.317-13.317s13.317 5.986 13.317 13.317v33.335c0 7.33-5.986 13.317-13.317 13.317-7.33 0-13.317-5.987-13.317-13.317zm0 0\" fill=\"#de1c59\"/><path d=\"M47.281 27.255c-7.33 0-13.317-5.978-13.317-13.309C33.964 6.616 39.951.63 47.281.63s13.317 5.987 13.317 13.317v13.309zm0 6.709c7.33 0 13.317 5.987 13.317 13.317s-5.986 13.317-13.317 13.317H13.946C6.616 60.598.63 54.612.63 47.281c0-7.33 5.987-13.317 13.317-13.317zm0 0\" fill=\"#35c5f0\"/><path d=\"M100.745 47.281c0-7.33 5.978-13.317 13.309-13.317 7.33 0 13.317 5.987 13.317 13.317s-5.987 13.317-13.317 13.317h-13.309zm-6.709 0c0 7.33-5.987 13.317-13.317 13.317s-13.317-5.986-13.317-13.317V13.946C67.402 6.616 73.388.63 80.719.63c7.33 0 13.317 5.987 13.317 13.317zm0 0\" fill=\"#2eb57d\"/><path d=\"M80.719 100.745c7.33 0 13.317 5.978 13.317 13.309 0 7.33-5.987 13.317-13.317 13.317s-13.317-5.987-13.317-13.317v-13.309zm0-6.709c-7.33 0-13.317-5.987-13.317-13.317s5.986-13.317 13.317-13.317h33.335c7.33 0 13.317 5.986 13.317 13.317 0 7.33-5.987 13.317-13.317 13.317zm0 0\" fill=\"#ebb02e\"/></svg>", "github": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12\"/></svg>"};

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
  const bez = (x1, y1, x2, y2) => { const f = (a, b, t) => ((1 - 3 * b + 3 * a) * t + (3 * b - 6 * a)) * t * t + 3 * a * t;
    return x => { let lo = 0, hi = 1, t = x; for (let i = 0; i < 24; i++){ const v = f(x1, x2, t); if (Math.abs(v - x) < 1e-4) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; } return f(y1, y2, t); }; };
  const EZ = SOFT ? bez(.22, 1, .36, 1) : bez(.23, 1, .32, 1);

  document.body.innerHTML = `<div class="sxs"><div id="sx-root" data-c="${ID}"></div></div>`;
  const mount = $('#sx-root');
  let gen = 0;
  const wait = ms => { const g = gen; return new Promise((res, rej) => setTimeout(() => g === gen ? res() : rej('stop'), REDUCE ? 0 : ms)); };
  const tween = (ms, ease, fn, delay = 0) => new Promise(res => { const g = gen;
    if (REDUCE || !ms){ fn(1); res(); return; }
    const t0 = performance.now() + delay;
    const f = () => { if (g !== gen) return res(); const p = Math.max(0, Math.min(1, (performance.now() - t0) / ms)); fn(ease(p)); if (p < 1) requestAnimationFrame(f); else res(); };
    requestAnimationFrame(f); });
  function swap(box, html){
    const old = box.lastElementChild;
    if (old && old.innerHTML === html) return;
    const nu = document.createElement('span'); nu.innerHTML = html; box.appendChild(nu);
    if (!old) return;
    if (REDUCE){ old.remove(); return; }
    // in place: the old words fade and lift away, the new rise 4px (3px in Clean); Soft lets a word clear from a 2px blur
    const far = SOFT ? 4 : 3, bl = SOFT ? 'blur(2px)' : 'blur(0px)';
    const a = A(old, [{ opacity:1, transform:'none', filter:'blur(0px)' }, { opacity:0, transform:`translateY(${-far}px)`, filter:bl }], SOFT ? 180 : 150, { fill:'forwards', e:E.io });
    a.onfinish = a.oncancel = () => old.remove();
    A(nu, [{ opacity:0, transform:`translateY(${far}px)`, filter:bl }, { opacity:1, transform:'none', filter:'blur(0px)' }], SOFT ? 320 : 240, { delay:40, e:E.ez });
  }
  // a chip's width glides to fit its new content (300ms) while the content swaps in place
  function morph(el, box, html){
    const w0 = el.getBoundingClientRect().width;
    const probe = el.cloneNode(true); probe.style.cssText = 'position:absolute;visibility:hidden;width:auto;left:0;top:0';
    const pb = probe.querySelector('.' + box.className.split(' ')[0]); pb.innerHTML = `<span>${html}</span>`;
    el.parentElement.appendChild(probe); const w1 = probe.getBoundingClientRect().width; probe.remove();
    swap(box, html); el.style.width = w1 + 'px';
    if (w0 && Math.abs(w1 - w0) > .5) A(el, [{ width:w0 + 'px' }, { width:w1 + 'px' }], SOFT ? 300 : 260, { e:E.ez });
  }
  const draw = (svg, delay = 0) => { for (const p of $$('path', svg)) A(p, [{ strokeDasharray:'1', strokeDashoffset:1 }, { strokeDasharray:'1', strokeDashoffset:0 }], SOFT ? 420 : 320, { delay, e:E.ez }); };

  // the run (the library's): each kind of step has a tone and a name in the key; an icon starting with @ is an app's mark
  const K = { model:'Model', tool:'Tools', app:'Apps' };
  const S = [
    { l:'Plan the change', ic:'brain', k:'model', s:0, d:1.6, cost:.03 },
    { l:'Read 6 files', ic:'file-text', k:'tool', s:1.6, d:2.2, cost:.02 },
    { l:'Search Figma', ic:'@figma', k:'app', s:1.9, d:1.4, cost:.01 },
    { l:'Edit PricingCard', ic:'edit', k:'model', s:4, d:2.4, cost:.06 },
    { l:'Run tests', ic:'term', k:'tool', s:6.5, d:1.5, cost:.01, fail:'2 failed' },
    { l:'Run tests again', ic:'refresh', k:'tool', s:8.1, d:1.9, cost:.01, retry:true },
    { l:'Open a PR on GitHub', ic:'@github', k:'app', s:10.1, d:1, cost:.02 },
    { l:'Post to Slack', ic:'@slack', k:'app', s:11.1, d:.6, cost:.01 }
  ];
  const T = 12, END = Math.max(...S.map(s => s.s + s.d)), PACE = 1.6, TK = [0, 3, 6, 9, 12];
  const pct = v => v / T * 100 + '%';
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const TOT = { t:END, cost:S.reduce((a, s) => a + s.cost, 0), n:S.length, re:S.filter(s => s.fail).length };

  let root, grid, rows, head, nowEl, ticks, sub, tag, tagSw, keyB, foot, tip, line, t, kSel, tipFor, endShown;

  function build(){
    mount.innerHTML = `<div class="sxa panel">
      <div class="sxa-h"><div class="sxa-hd"><div class="sxa-t">Run 4821, update the pricing page</div><div class="sxa-s num"><span>Starting</span></div></div>
        <span class="sxa-tag" data-s="run"><span class="sxa-tg-ic" aria-hidden="true"><span class="sxa-spin"></span></span><span class="sxa-sw"><span>Running</span></span></span></div>
      <div class="sxa-key num" role="group" aria-label="Time by kind of step; pick one to pick out its steps">${Object.entries(K).map(([k, n]) => `<button type="button" class="sxa-k" data-k="${k}" aria-pressed="false"><i aria-hidden="true"></i>${n}<b>0.0s</b></button>`).join('')}</div>
      <div class="sxa-grid">
        <div class="sxa-axis" aria-hidden="true"><span></span><div class="sxa-ticks">${TK.map(x => `<span style="left:${x / T * 100}%">${x}s</span>`).join('')}</div><span></span></div>
        <div class="sxa-past" aria-hidden="true"></div>
        <div class="sxa-rows" role="list" aria-label="Steps"></div>
        <div class="sxa-head" aria-hidden="true"><i></i><span class="sxa-now num"><span class="sxa-nsw"><span>0.0s</span></span></span></div>
      </div>
      <div class="sxa-f num">${[['clock', 'total'], ['dollar', 'cost'], ['layers', 'steps'], ['refresh', 'retry']].map(([ic, w]) => `<span class="sxa-fi">${I(ic)}<span><b class="sxa-fv">0</b> <span class="sxa-fw">${w}</span></span></span>`).join('')}</div>
      <div class="sxa-tip" aria-hidden="true"></div></div>`;
    root = $('.sxa', mount); grid = $('.sxa-grid', root); rows = $('.sxa-rows', root); head = $('.sxa-head', root); nowEl = $('.sxa-now', root);
    ticks = $$('.sxa-ticks span', root); sub = $('.sxa-s', root); tag = $('.sxa-tag', root); tagSw = $('.sxa-sw', tag); foot = $('.sxa-f', root); tip = $('.sxa-tip', root);
    keyB = Object.fromEntries($$('.sxa-k', root).map(b => [b.dataset.k, b]));
    S.forEach((s, i) => {
      const prev = S[i - 1];
      const link = s.retry && prev ? `<span class="sxa-link" aria-hidden="true" style="left:${pct(prev.s + prev.d)};width:${pct(s.s - prev.s - prev.d)}"></span>` : '';
      s.el = h(`<div class="sxa-row" role="listitem" data-k="${s.k}" data-s="wait"><span class="sxa-lab"><span class="sxa-ic" aria-hidden="true">${s.ic[0] === '@' ? BRAND[s.ic.slice(1)] : I(s.ic)}</span><span class="t">${s.l}</span></span><span class="sxa-lane">${link}<span class="sxa-plan" style="left:${pct(s.s)};width:${pct(s.d)}"></span><span class="sxa-bar" style="left:${pct(s.s)}"></span></span><span class="sxa-d num"><span class="sxa-tk" aria-hidden="true"></span><span class="sxa-dn"></span></span></div>`);
      s.bar = $('.sxa-bar', s.el); s.dn = $('.sxa-dn', s.el); s.tk = $('.sxa-tk', s.el); s.lab = $('.sxa-lab', s.el); s.st = 'wait'; s.link = $('.sxa-link', s.el);
      rows.appendChild(s.el);
    });
    t = 0; kSel = null; tipFor = null; endShown = false; line = '';
  }

  // the run as it stands t seconds in: bars grow from their start while their times count, states change, the key counts
  function paint(){
    grid.style.setProperty('--p', (t / T).toFixed(4));
    const per = { model:0, tool:0, app:0 }, live = [];
    S.forEach(s => {
      const w = Math.max(0, Math.min(s.d, t - s.s)), was = s.st;
      s.st = t < s.s ? 'wait' : t < s.s + s.d ? 'run' : s.fail ? 'fail' : 'done';
      s.bar.style.width = pct(w);
      const dn = t >= s.s ? w.toFixed(1) + 's' : ''; if (s.dn.textContent !== dn) s.dn.textContent = dn;
      if (s.st !== was) change(s, was);
      if (t >= s.s) per[s.k] += w;
      if (s.st === 'run') live.push(s.l);
    });
    for (const k in per){ const b = $('b', keyB[k]), v = per[k].toFixed(1) + 's'; if (b.textContent !== v) b.textContent = v; }
    if (live.length && live.join(', ') !== line){ line = live.join(', '); swap(sub, line); }
    const n = t.toFixed(1) + 's', ns = $('.sxa-nsw', nowEl); if (!endShown && ns.lastElementChild.textContent !== n) ns.lastElementChild.textContent = n;
    // the time on the playhead covers the axis labels it passes
    const b = nowEl.getBoundingClientRect();
    ticks.forEach(el => { const x = el.getBoundingClientRect(); el.classList.toggle('hid', x.right > b.left - 4 && x.left < b.right + 4); });
  }
  // a step's state changes: a done tick draws in; a failed run gets its chip beside its bar, fading in; a retry's link fades in
  function change(s, was){
    s.el.dataset.s = s.st;
    if (s.st === 'run'){ if (s.link) A(s.link, [{ opacity:0 }, { opacity:1 }], 320, { e:E.ez }); }
    if (s.st === 'done'){ s.tk.innerHTML = I('check'); draw(s.tk); A(s.dn, [{ transform:'translateX(4px)' }, { transform:'none' }], SOFT ? 420 : 300, { e:E.ez }); }
    if (s.st === 'fail'){
      const c = h(`<span class="sxa-chip" style="left:calc(${pct(s.s + s.d)} + 6px)"><span class="sxa-csw"><span>${s.fail}</span></span></span>`); $('.sxa-lane', s.el).appendChild(c);
      A(c, [{ opacity:0, transform:'translateY(4px)' }, { opacity:1, transform:'none' }], SOFT ? 360 : 280, { e:E.ez });
    }
  }

  // the end: the playhead turns into the finish, the tag morphs from Running to Done, the line under the title slides to
  // the summary, and the footer's ghosts fill as its numbers count up together on one ease
  async function finish(){
    endShown = true; root.classList.add('fin'); root.classList.remove('live');
    const ns = $('.sxa-nsw', nowEl); nowEl.classList.add('done');
    morph(nowEl, ns, `${I('check')}${END.toFixed(1)}s`); draw($('svg', ns.lastElementChild), 120);
    tag.dataset.s = 'done';
    const ic = $('.sxa-tg-ic', tag); ic.innerHTML = I('check'); draw(ic, 100);
    A(ic, [{ transform:'scale(.7)', opacity:0 }, { transform:'none', opacity:1 }], 300, { e:E.ez });
    morph(tag, tagSw, 'Done');
    line = ''; swap(sub, `Finished in ${END.toFixed(1)}s, ${plural(TOT.re, 'retry', 'retries')}`);
    await wait(SOFT ? 260 : 160);
    const fv = $$('.sxa-fv', foot), fw = $$('.sxa-fw', foot), vals = [TOT.t, TOT.cost, TOT.n, TOT.re];
    const fmt = [v => v.toFixed(1) + 's', v => '$' + v.toFixed(2), v => String(Math.round(v)), v => String(Math.round(v))];
    const words = [null, null, ['step', 'steps'], ['retry', 'retries']];
    foot.classList.add('fl'); foot.classList.remove('gh');
    $$('.sxa-fi', foot).forEach((e, i) => A(e, [{ opacity:.4, transform:'translateY(3px)' }, { opacity:1, transform:'none' }], SOFT ? 440 : 400, { delay:i * (SOFT ? 70 : 40), e:E.out }));
    await Promise.all(fv.map((e, i) => tween(900, EZ, p => { const v = fmt[i](vals[i] * p); e.textContent = v; if (words[i]) fw[i].textContent = words[i][+v === 1 ? 0 : 1]; }, i * (SOFT ? 70 : 40))));
    foot.classList.remove('fl');
    root.setAttribute('aria-label', `Run 4821 finished in ${END.toFixed(1)}s, $${TOT.cost.toFixed(2)}, ${TOT.n} steps, ${plural(TOT.re, 'retry', 'retries')}`);
  }

  // the entrance: the card arrives whole (it fades and settles 8px up from .985 in Soft refreshed, from .98 in Clean, 520ms)
  // and its pieces follow on a gentle cascade, fading and rising 4px (6px in Clean): the header, the key, the axis, the rows
  // 30ms apart and the footer. Done in about 800ms. The footer waits as placeholders (hairline outlines in Clean) for the end
  function entrance(){
    foot.classList.add('gh');
    if (REDUCE) return 0;
    const rs = $$('.sxa-row', root), far = SOFT ? 4 : 6;
    A(root, [{ opacity:0, transform:`translateY(8px) scale(${SOFT ? .985 : .98})` }, { opacity:1, transform:'none' }], 520, { e:E.ez });
    const parts = [[$('.sxa-h', root), 0], [$('.sxa-key', root), 40], [$('.sxa-axis', root), 80], ...rs.map((e, i) => [e, 120 + i * 30]), [foot, 120 + rs.length * 30]];
    parts.forEach(([e, d]) => A(e, [{ opacity:0, transform:`translateY(${far}px)` }, { opacity:1, transform:'none' }], 400, { delay:60 + d, e:E.ez }));
    return 60 + 120 + rs.length * 30 + 400;
  }

  // hover a row (or its bar) for its time and cost; the readout scales from .96 at the bar (Soft refreshed) or rises 4px (Clean)
  function showTip(s){
    if (tipFor === s) return; tipFor = s;
    const w = Math.max(0, Math.min(s.d, t - s.s));
    tip.textContent = `${s.l} · ${(s.st === 'wait' ? s.d : w).toFixed(1)}s${s.st === 'wait' ? ' planned' : ''} · $${(s.st === 'wait' ? s.cost : s.cost * w / s.d).toFixed(2)}${s.fail && s.st === 'fail' ? ' · 2 tests failed' : ''}`;
    const lane = $('.sxa-lane', s.el).getBoundingClientRect(), pr = root.getBoundingClientRect(), tw = tip.offsetWidth;
    const bx = lane.left - pr.left + lane.width * (s.s + Math.max(w, s.st === 'wait' ? s.d : w) / 2) / T;
    const x = Math.max(8, Math.min(pr.width - tw - 8, bx - tw / 2)), y = lane.top - pr.top - 26;
    tip.style.left = x + 'px'; tip.style.top = y + 'px'; tip.style.transformOrigin = `${bx - x}px 100%`;
    tip.getAnimations().forEach(a => a.cancel()); tip.style.opacity = 1;
    A(tip, SOFT ? [{ opacity:0, transform:'scale(.96)' }, { opacity:1, transform:'none' }] : [{ opacity:0, transform:'translateY(4px)' }, { opacity:1, transform:'none' }], SOFT ? 200 : 180, { e:E.ez });
  }
  function hideTip(){
    if (!tipFor) return; tipFor = null; tip.getAnimations().forEach(a => a.cancel());
    if (REDUCE){ tip.style.opacity = 0; return; }
    const a = A(tip, SOFT ? [{ opacity:1 }, { opacity:0, transform:'scale(.96)' }] : [{ opacity:1 }, { opacity:0 }], 130, { fill:'forwards', e:E.io });
    a.onfinish = () => { if (!tipFor){ tip.style.opacity = 0; a.cancel(); } };
  }
  function wire(){
    rows.addEventListener('pointerover', e => { const r = e.target.closest('.sxa-row'); if (r) showTip(S.find(s => s.el === r)); });
    rows.addEventListener('pointerleave', hideTip);
    // the key's chips pick out one kind: its steps stay, the others step back
    $$('.sxa-k', root).forEach(b => b.onclick = () => {
      kSel = kSel === b.dataset.k ? null : b.dataset.k;
      $$('.sxa-k', root).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.k === kSel)));
      if (kSel) root.dataset.pick = kSel; else delete root.dataset.pick;
    });
  }

  const report = () => { try { if (parent !== window && parent.__sxck) parent.__sxck.sizes[F] = Math.ceil(root.offsetHeight) + 24; } catch(e){} };

  async function start(){
    gen++; build(); wire(); report();
    const lead = entrance();
    if (REDUCE){ t = END; paint(); await finish(); return; }
    paint();
    await wait(lead + 400);
    root.classList.add('live');
    // the playhead moves on the clock; the run keeps going while the pointer rests on it (an agent at work)
    const g = gen;
    await new Promise(res => { let last = performance.now(); const f = now => { if (g !== gen) return res();
      t = Math.min(END, t + (now - last) / 1000 * PACE); last = now; paint(); if (t >= END) return res(); requestAnimationFrame(f); }; requestAnimationFrame(f); });
    if (g !== gen) return;
    await finish();
  }

  window.__replay = () => { start().catch(e => { if (e !== 'stop') console.error(e); }); };
  const go = () => { window.__replay(); new ResizeObserver(report).observe(document.body); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();
}

if (F === 'refresh' || F === 'clean') frame(); else host();
})();
