// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, closePops, copied, hideTip, seg, showTip, tip, tipFor } from '../core/core.js';
/* the grain over a picture being made: grey specks of mixed strength on a clear square, drawn once and tiled */
let igxNoise = '';
function igxGrain(){
  if (igxNoise) return igxNoise;
  try {
    const n = 96, cv = document.createElement('canvas'); cv.width = cv.height = n;
    const x = cv.getContext('2d'), d = x.createImageData(n, n);
    for (let i = 0; i < d.data.length; i += 4){ const v = Math.random() < .5 ? 20 : 245; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 40 + Math.random() * 150; }
    x.putImageData(d, 0, 0); igxNoise = `url("${cv.toDataURL()}")`;
  } catch(e){ igxNoise = 'none'; }
  return igxNoise;
}
DM.def('image-generation', (r, c, card) => {
  r.innerHTML = r.innerHTML.replace(/\{i-([a-z-]+)\}/g, (m, n) => I(n));
  const box = $('.igx-in', r), feed = $('.igx-feed', r), ask = $('.igx-ask', r), empty = $('.igx-empty', r), runEl = $('.igx-run', r);
  const rt = $('.igx-rt', r), stepEls = $$('.igx-steps>span', r), pc = $('.igx-pc', r), tilesEl = $('.igx-tiles', r), meta = $('.igx-meta', r), sr = $('.igx-sr', r);
  const form = $('.igx-cmp', r), ta = $('.igx-ta', r), refsEl = $('.igx-refs', r), go = $('.igx-go', r), setBtn = $('.igx-set', r), mdlBtn = $('.igx-mdl', r);
  const galEl = $('.igx-gal', r), prsEl = $('.igx-prs', r), cn = $('.igx-cn', r), lbEl = $('.igx-lb', r);
  const panes = { gallery:$('.igx-gp', r), styles:$('.igx-sp', r) };
  if (!REDUCE) $('.igx', r).style.setProperty('--dm-noise', igxGrain());
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const say = t => { sr.textContent = t; };

  /* the pictures: words for a screen reader, a gradient of their colours (g) that stands in for each, and their shape (ar,
     width over height). On designme.dev, art/art.js lays the photo of the same name over the gradient: photos from Pexels,
     free under the Pexels License (https://www.pexels.com/license/), credited in art/README.md and never part of an install */
  const PIC = {
    'yellow-wall':{ ar:3/4, g:'linear-gradient(165deg,#ffec2e 0 55%,#f2c94a 70%,#5b80bd)', alt:'A laughing woman in a denim jacket and yellow sunglasses against a bright yellow wall' },
    'green-reach':{ ar:3/4, g:'radial-gradient(circle at 62% 40%,#e2cf3a 0 9%,transparent 17%),linear-gradient(#5aa34c,#3f9b50)', alt:'A man in a green T-shirt and yellow bucket hat reaching towards the camera in front of a green backdrop' },
    'magenta-pose':{ ar:3/4, g:'linear-gradient(140deg,#c534a8,#8a2399 50%,#2b102c)', alt:'A woman in a black strapless dress posing under pink light against a violet backdrop' },
    'white-blazer':{ ar:3/4, g:'radial-gradient(ellipse at 50% 72%,#f3efe8 0 20%,transparent 38%),linear-gradient(#ea6a38,#c9532f)', alt:'A man in a white blazer with black lapels standing against a rust orange wall' },
    'pink-dream':{ ar:4/5, g:'linear-gradient(#cdbbe8,#e6a9cb 55%,#b981c4)', alt:'A dreamlike digital landscape: a pink cloud floating over a lavender field beside a still pink lake' },
    'pink-tower':{ ar:2/3, g:'linear-gradient(90deg,#f6cdb7 0 34%,#3f95c9 34%)', alt:'The corner of a peach building with small windows against a clear blue sky' },
    'pink-window':{ ar:1, g:'radial-gradient(circle at 50% 56%,#5f7d4f 0 7%,transparent 8%),linear-gradient(#eba3ae,#df97a2)', alt:'A single small window with a green frame in a wide pink wall' },
    'clay-loops':{ ar:4/3, g:'radial-gradient(circle at 52% 50%,#e9bb5e 0 11%,transparent 21%),linear-gradient(135deg,#b56fd8,#e28bd2 50%,#7f93a4)', alt:'A 3D render of looping pink clay shapes around a yellow lump on a violet background' },
    'pastel-shapes':{ ar:4/3, g:'radial-gradient(circle at 62% 42%,#ff7f9d 0 11%,transparent 19%),linear-gradient(#e7e4e8,#d7d2de)', alt:'Pastel shapes stacked on light grey: a pink cylinder, a white cube, a lilac sphere and a violet cone' },
    'petal-face':{ ar:3/4, g:'radial-gradient(ellipse at 50% 50%,#e6b59c 0 24%,transparent 44%),linear-gradient(#2f6e6c,#1d4a4a)', alt:'A woman with her eyes closed, rose petals over one eye and green leaves over her mouth, against teal' },
    'retro-room':{ ar:2/3, g:'linear-gradient(#f68fc6,#4fb3f1 42%,#f6a43c 60%,#1b1b1b 82%)', alt:'A man in a sequinned jacket in a clear bubble chair, in a room painted with bright drips above a black and white checkerboard floor' },
    'ribbon-look':{ ar:3/4, g:'linear-gradient(135deg,#ececea,#9dbbdb 45%,#f4c431 68%,#ededeb)', alt:'A woman in pale denim sitting on a white block, wrapped in folded yellow, red and blue paper ribbons' },
    'light-leak':{ ar:4/3, g:'linear-gradient(120deg,#1f160a,#bd722c 45%,#ecc66b 60%,#3b2b17)', alt:'A close-up of a face in shadow with a rainbow of light falling across one eye' },
    'fruit-bowl':{ ar:1, g:'radial-gradient(circle at 50% 74%,#2aa8e2 0 17%,transparent 28%),radial-gradient(circle at 52% 46%,#a02e40 0 21%,transparent 38%),linear-gradient(#0d0d0d,#151515)', alt:'Red apples with green and red grapes in a bright blue bowl against black' },
    'framing-hands':{ ar:3/2, g:'linear-gradient(90deg,#2152c5,#ff6b4e 50%,#c9a8e8)', alt:'A woman in a coral suit framing the camera with her fingers, cobalt curtains and a lilac wall behind her' },
    'yellow-shapes':{ ar:3/2, g:'radial-gradient(ellipse at 50% 72%,#e2c34d 0 17%,transparent 33%),linear-gradient(#2c312e,#1f2321)', alt:'Mustard yellow cubes, cones and cylinders on the floor of a dark green-grey room' }
  };
  const SHAPE = { '1:1':1, '3:4':3 / 4, '16:9':16 / 9 };
  const shapeOf = ar => ({ 1:'1:1', .75:'3:4', .8:'4:5', .667:'2:3', 1.333:'4:3', 1.5:'3:2', 1.778:'16:9' })[Math.round(ar * 1000) / 1000] || '';
  // what each style draws from in this demo (a real model makes new pictures; these are the photos that suit the style)
  const SETS = { Editorial:['yellow-wall', 'green-reach', 'magenta-pose', 'white-blazer'], Poster:['pink-tower', 'pink-window', 'yellow-shapes', 'pastel-shapes'],
    Surreal:['pink-dream', 'petal-face', 'clay-loops', 'light-leak'], '35mm':['light-leak', 'framing-hands', 'fruit-bowl', 'ribbon-look'] };
  // a model's step, in ms: 30 steps make a picture, each picture at its own pace
  const MODELS = [{ n:'Studio 2', ms:200 }, { n:'Studio 2 Fast', ms:95 }, { n:'Studio 2 HD', ms:290 }];
  const PACE = [1, .8, 1.12, .9], STEPS = 30;
  // the style presets, each a picture and the styles it picks
  const PRESETS = [
    { n:'Studio editorial', d:'Bold backdrop, studio light', s:['Editorial'], pic:'framing-hands' },
    { n:'Colour block', d:'Flat colour, strong shapes', s:['Poster'], pic:'pink-tower' },
    { n:'Dreamscape', d:'Soft pastel, impossible places', s:['Surreal'], pic:'pink-dream' },
    { n:'Film portrait', d:'Grain and light leaks', s:['35mm', 'Editorial'], pic:'light-leak' },
    { n:'Soft 3D', d:'Clay forms in pastel light', s:['Surreal', 'Poster'], pic:'clay-loops' },
    { n:'Still life', d:'Objects on black, hard light', s:['35mm'], pic:'fruit-bowl' }
  ];
  let ids = 0;
  const made = (pic, prompt, styles, ar, o = {}) => ({ id:++ids, pic, prompt, styles, ar, vz:1, vo:'50% 50%', up:false, rate:0, ...o });
  // earlier pictures, newest first
  const gallery = [
    made('pink-dream', 'A pink cloud over a lavender field and a still lake', ['Surreal'], 4 / 5),
    made('framing-hands', 'Woman framing the camera with her hands, coral suit, cobalt curtains', ['Editorial'], 3 / 2),
    made('pink-tower', 'Peach building corner against a clear blue sky', ['Poster'], 2 / 3),
    made('petal-face', 'Portrait with rose petals and leaves on the face', ['Surreal'], 3 / 4),
    made('clay-loops', 'Soft clay loops in pink and lilac, 3D', ['Surreal', 'Poster'], 4 / 3),
    made('retro-room', 'A bubble chair in a candy-coloured room, checkerboard floor', ['Poster'], 2 / 3),
    made('pink-window', 'One small window in a pink wall, minimal', ['Poster'], 1),
    made('light-leak', 'Close-up with a rainbow light leak across the eye', ['35mm'], 4 / 3),
    made('ribbon-look', 'Denim look with paper ribbon sculptures, studio', ['Editorial'], 3 / 4),
    made('fruit-bowl', 'Apples and grapes in a blue bowl on black', ['35mm'], 1),
    made('pastel-shapes', 'Pastel geometric shapes stacked on grey', ['Poster'], 4 / 3),
    made('yellow-shapes', 'Yellow geometric solids in a dark room', ['Poster'], 3 / 2)
  ];
  const styles = new Set(['Editorial']), refs = [], used = {};
  let shape = '3:4', count = 4, model = 0, run = null, runs = 0, lb = null;
  // a picture's work goes on under the pointer, as an agent's does: these waits are never held
  const tick = ms => new Promise((res, rej) => { c.t.push(setTimeout(() => c.dead ? rej('stop') : res(), REDUCE ? Math.min(ms, 30) : ms)); });
  const metaOf = img => [shapeOf(img.ar), img.styles.join(', ') || 'No style', img.up ? 'Upscaled 2×' : ''].filter(Boolean).join(' · ');
  const layers = (img, size) => `<span class="igx-ly igx-b" data-pic="${img.pic}"${size}></span><span class="igx-ly igx-s" data-pic="${img.pic}"${size}></span>`;
  const look = img => `--dm-art:${PIC[img.pic].g};--dm-vz:${img.vz};--dm-vo:${img.vo}`;

  /* ---------- the run: the prompt as sent, its pictures, and how far they have come ---------- */
  const busy = () => !!run && run.items.some(t => t.st === 'wait' || t.st === 'gen');
  function paint(t){
    const s = t.el.style, p = t.k / STEPS;
    t.el.dataset.st = t.st;
    if (t.st === 'wait'){ s.setProperty('--dm-sc', 0); s.setProperty('--dm-gr', .5); $('.igx-tp', t.el).textContent = '0%'; }
    if (t.st === 'gen'){
      // Composing: dots of the picture's colours grow out of the grain, a step at a time
      const a = Math.min(1, p / .3), cell = 12;
      s.setProperty('--dm-cell', cell + 'px'); s.setProperty('--dm-dot', (a >= 1 ? cell : 1 + a * 7.5).toFixed(1) + 'px'); s.setProperty('--dm-sq', (a >= 1 ? cell : 2 + a * 9).toFixed(1) + 'px');
      // Adding detail: the blur lifts while the scan line comes down, leaving the detail behind it
      const b = Math.max(0, Math.min(1, (p - .3) / .52)), sc = Math.max(0, Math.min(1, (p - .34) / .46));
      s.setProperty('--dm-bl', (18 - b * 14).toFixed(1) + 'px'); s.setProperty('--dm-sc', sc.toFixed(3)); s.setProperty('--dm-lo', sc > 0 && sc < 1 ? 1 : 0);
      // Upscaling: the last softness and grain go
      const u = Math.max(0, Math.min(1, (p - .8) / .2));
      s.setProperty('--dm-sb', (3 * (1 - u)).toFixed(2) + 'px'); s.setProperty('--dm-gr', (.5 * (1 - p)).toFixed(3));
      $('.igx-tp', t.el).textContent = Math.round(p * 100) + '%';
    }
    if (t.st === 'done'){ s.setProperty('--dm-sc', 1); s.setProperty('--dm-sb', '0px'); s.setProperty('--dm-gr', 0); s.setProperty('--dm-lo', 0); }
    const o = $('.igx-o', t.el), n = run.items.indexOf(t) + 1;
    o.disabled = t.st !== 'done';
    o.setAttribute('aria-label', t.st === 'done' ? `Open picture ${n}: ${PIC[t.img.pic].alt}` : `Picture ${n}, ${t.st === 'fail' ? 'failed' : 'being made'}`);
  }
  let said = -1, headKey = '';
  function head(){
    const its = run.items, n = its.length, done = its.filter(t => t.st === 'done').length, bad = its.filter(t => t.st === 'fail').length, going = busy();
    const live = its.filter(t => t.st !== 'fail'), p = live.length ? live.reduce((a, t) => a + (t.st === 'done' ? 1 : t.k / STEPS), 0) / live.length : 0;
    const ph = !going ? 3 : p < .3 ? 0 : p < .8 ? 1 : 2;
    stepEls.forEach((el, k) => { el.className = k < ph ? 'done' : k === ph ? 'on' : ''; });
    pc.textContent = going ? Math.round(p * 100) + '%' : '';
    const pics = n === 1 ? 'picture' : `${n} pictures`;
    const key = going ? `g${n}` : bad ? `b${done}/${bad}` : `d${n}`;
    if (key !== headKey){
      headKey = key;
      rt.innerHTML = going ? `<span class="spin" aria-hidden="true"></span><span>Generating ${pics}</span>`
        : bad ? `${I('alert')}<span>${done} of ${n} ready, ${bad} failed</span>`
        : `${I('image')}<span>${n === 1 ? 'Picture' : pics[0].toUpperCase() + pics.slice(1)} ready in ${Math.max(1, Math.round((performance.now() - run.t0) / 1000))}s</span>`;
    }
    // said politely as each stage starts and once the run is through, never every step
    if (ph !== said){ said = ph; say(ph < 3 ? `${['Composing', 'Adding detail', 'Upscaling'][ph]}, ${pics}` : bad ? `${done} of ${n} ready, ${bad} failed. Retry is on the failed one` : `${n === 1 ? 'Picture' : pics} ready`); }
    go.dataset.tip = going ? 'Generating' : 'Generate'; canGo();
  }
  function fit(){
    if (!run) return;
    const W = tilesEl.clientWidth, H = tilesEl.clientHeight, n = run.items.length, g = 8; let best = [1, 1, -1, n];
    // the largest pictures win; between layouts that give the same size, the one with no gap in its last row, then the wider
    for (let cols = 1; cols <= n; cols++){
      const rows = Math.ceil(n / cols), w = Math.min((W - (cols - 1) * g) / cols, (H - (rows - 1) * g) / rows * run.ar), gap = cols * rows - n;
      if (w > best[2] + .5 || (w > best[2] - .5 && gap <= best[3])) best = [cols, rows, w, gap];
    }
    tilesEl.style.setProperty('--dm-cols', best[0]); tilesEl.style.setProperty('--dm-rows', best[1]);
  }
  const ro = new ResizeObserver(fit); ro.observe(tilesEl); c.offs.push(() => ro.disconnect());
  function draw(){
    ask.textContent = run.prompt; empty.hidden = true; runEl.hidden = false;
    meta.textContent = `${MODELS[run.model].n} · ${shapeOf(run.ar)} · ${run.styles.join(', ') || 'No style'}`;
    $$('.igx-acts [aria-pressed]', r).forEach(b => b.setAttribute('aria-pressed', 'false'));
    tilesEl.innerHTML = run.items.map((t, i) => `<figure class="igx-t" data-st="wait" style="--dm-ar:${run.ar};${look(t.img)}">
      <button type="button" class="igx-o" aria-haspopup="dialog" disabled>${layers(t.img, '')}<span class="igx-n"></span><span class="igx-l"><span></span><span></span></span></button>
      <span class="tag igx-tg"></span><span class="igx-tp num" aria-hidden="true">0%</span>
      <div class="igx-f">${I('alert')}<b>Couldn't finish</b><span>The model timed out</span><button type="button" class="pill line sm" data-a="retry" aria-label="Retry picture ${i + 1}">${I('refresh', 'xs')}Retry</button></div>
      <div class="igx-q"><button type="button" class="ib" data-a="vary" aria-label="Vary picture ${i + 1}" data-tip="Vary">${I('layers')}</button><button type="button" class="ib" data-a="upscale" aria-label="Upscale picture ${i + 1}" data-tip="Upscale">${I('max')}</button><button type="button" class="ib" data-a="download" aria-label="Download picture ${i + 1}" data-tip="Download">${I('down')}</button></div>
    </figure>`).join('');
    $$('.igx-t', tilesEl).forEach((el, i) => { run.items[i].el = el; paint(run.items[i]); });
    headKey = ''; said = -1; fit(); head();
  }
  async function make(t, rn){
    t.st = 'gen'; t.el.style.setProperty('--dm-stp', t.ms + 'ms'); paint(t); head();
    while (t.k < STEPS){
      await tick(t.ms); if (rn !== run) return;
      t.k++;
      if (t.failAt && t.k === t.failAt){ t.failAt = 0; t.st = 'fail'; paint(t); head(); return; }
      paint(t); head();
    }
    t.st = 'done'; t.el.style.setProperty('--dm-stp', '450ms'); paint(t); head();
    // a finished picture joins the gallery, at the top
    t.img.fresh = true; gallery.unshift(t.img); drawGallery();
  }
  function start(o){
    closePops(); closeLB(false);
    const st = o.styles, first = st[0] || 'Editorial', set = SETS[first];
    const off = used[first] || 0; if (!o.pics) used[first] = off + o.count;
    run = { id:++runs, prompt:o.prompt, styles:st, ar:o.ar, model, t0:performance.now(), items:[] };
    for (let i = 0; i < o.count; i++){
      const pic = o.pics ? o.pics[i] : set[(off + i) % set.length];
      // the demo's first run loses its third picture partway, to show Retry
      run.items.push({ img:made(pic, o.prompt, st, o.ar, o.look), st:'wait', k:0, ms:MODELS[model].ms * PACE[i % 4], failAt:run.id === 1 && i === 2 ? 17 : 0 });
    }
    draw();
    const rn = run;
    rn.items.forEach((t, i) => c.run(async () => { await tick(260 + i * 180); if (rn === run) await make(t, rn); }));
  }
  function generate(){
    const prompt = ta.value.trim(); if (!prompt || busy()) return;
    start({ prompt, styles:[...styles], ar:SHAPE[shape], count });
  }
  function retry(t){ t.k = 0; t.st = 'wait'; paint(t); head(); say(`Making picture ${run.items.indexOf(t) + 1} again`); const rn = run; c.run(async () => { await tick(200); if (rn === run) await make(t, rn); }); }
  // a variation keeps the picture and moves in on another part of it
  const CROPS = ['30% 35%', '70% 40%', '45% 70%', '60% 25%'];
  function vary(img){
    say('Making a variation');
    start({ prompt:img.prompt, styles:img.styles, ar:img.ar, count:1, pics:[img.pic], look:{ vz:1.22, vo:CROPS[(img.id + runs) % CROPS.length] } });
  }
  /* Upscale: wherever the picture shows (its tile, the larger view) the line sweeps down once and leaves it sharp */
  function upscale(img){
    const els = [...(run ? run.items.filter(t => t.img === img).map(t => t.el) : []), ...(lb && lb.img === img ? [$('.igx-lbs>.igx-t', lbEl)] : [])].filter(Boolean);
    els.forEach(el => { el.classList.remove('up'); void el.offsetWidth; el.classList.add('up'); });
    say('Upscaling');
    c.run(async () => {
      await tick(1700); img.up = true; els.forEach(el => { el.classList.remove('up'); const tg = $('.igx-tg', el); if (tg) tg.textContent = '2×'; });
      if (lb && lb.img === img) $('.igx-lbt .muted', lbEl).textContent = metaOf(img);
      say('Upscaled to twice the size');
    });
  }
  // on designme.dev a picture has a file to save (the photo art.js laid over it); an installed demo only has its gradient
  function download(img, btn, from){
    const lay = from && $('.igx-s', from), url = lay && (getComputedStyle(lay).backgroundImage.match(/url\("?([^")]+)"?\)/) || [])[1];
    if (url){ const a = document.createElement('a'); a.href = url; a.download = img.pic + '.webp'; document.body.appendChild(a); a.click(); a.remove(); }
    flash(btn, url ? 'Downloading' : 'No file in this demo');
  }
  function flash(btn, label){
    const use = $('use', btn), was = btn._fl || (btn._fl = { tip:btn.dataset.tip, href:use && use.getAttribute('href') });
    clearTimeout(was.t); if (use) use.setAttribute('href', was.href.replace(/-[a-z-]+$/, '-check')); btn.dataset.tip = label; showTip(btn); say(label);
    was.t = setTimeout(() => { if (use) use.setAttribute('href', was.href); if (was.tip === undefined) delete btn.dataset.tip; else btn.dataset.tip = was.tip; if (tipFor === btn) hideTip(true); }, 1600);
  }
  function reference(img, mine){
    if (!refs.includes(img)){ if (refs.length >= 3) refs.shift(); refs.push(img); }
    drawRefs(); say('Added as a reference'); if (mine) ta.focus({ preventScroll:true });
  }
  function drawRefs(){
    refsEl.innerHTML = refs.map((img, i) => `<span class="igx-ref" style="${look(img)}"><span class="igx-rp"><span class="igx-ly" data-pic="${img.pic}" data-pic-size="s"></span></span>Reference ${i + 1}<button type="button" class="ib" data-i="${i}" aria-label="Remove reference ${i + 1}" data-tip="Remove">${I('x', 'xs')}</button></span>`).join('');
  }
  c.on(refsEl, 'click', e => { const b = e.target.closest('[data-i]'); if (!b) return; refs.splice(+b.dataset.i, 1); drawRefs(); say('Reference removed'); if (e.isTrusted) ta.focus({ preventScroll:true }); });
  c.on(tilesEl, 'click', e => {
    const fig = e.target.closest('.igx-t'), t = run && run.items.find(x => x.el === fig); if (!t) return;
    const a = e.target.closest('[data-a]');
    if (!a){ if (e.target.closest('.igx-o') && t.st === 'done') openLB(run.items.filter(x => x.st === 'done').map(x => x.img), t.img, e.target.closest('.igx-o'), e.isTrusted); return; }
    ({ retry:() => retry(t), vary:() => vary(t.img), upscale:() => upscale(t.img), download:() => download(t.img, a, fig) })[a.dataset.a]();
  });
  const rateBtns = { up:$('.igx-acts .igx-up', r), dn:$('.igx-acts .igx-dn', r) };
  const rate = (k, btns, set) => { const on = btns[k].getAttribute('aria-pressed') !== 'true'; Object.entries(btns).forEach(([j, b]) => b.setAttribute('aria-pressed', j === k && on)); set(on ? (k === 'up' ? 1 : -1) : 0); say(on ? (k === 'up' ? 'Marked as good' : 'Marked as bad') : 'Rating removed'); };
  rateBtns.up.onclick = () => rate('up', rateBtns, v => { if (run) run.rate = v; });
  rateBtns.dn.onclick = () => rate('dn', rateBtns, v => { if (run) run.rate = v; });
  $('.igx-acts .igx-cp', r).onclick = e => run && copied(e.currentTarget, run.prompt, 'Prompt copied');

  /* ---------- the composer ---------- */
  const chips = $$('.igx-sc', r);
  function drawStyles(changed){
    chips.forEach(b => { const on = styles.has(b.dataset.s); b.setAttribute('aria-pressed', on); if (changed && changed.includes(b.dataset.s)){ b.classList.remove('hl'); void b.offsetWidth; b.classList.add('hl'); c.later(700, () => b.classList.remove('hl')); } });
    const same = p => p.s.length === styles.size && p.s.every(x => styles.has(x));
    $$('.igx-pr', prsEl).forEach((b, i) => b.setAttribute('aria-pressed', same(PRESETS[i])));
  }
  chips.forEach(b => b.onclick = () => { const s = b.dataset.s; styles.has(s) ? styles.delete(s) : styles.add(s); drawStyles(); });
  const setN = $('.igx-set-n', r), mdlN = $('.igx-mdl-n', r);
  const label = () => { setN.textContent = `${shape} · ${count}`; setBtn.setAttribute('aria-label', `Shape ${shape}, ${count === 1 ? '1 picture' : count + ' pictures'}`); };
  seg($('.igx-ars', r), v => { shape = v; label(); });
  seg($('.igx-cts', r), v => { count = +v; label(); });
  label();
  $$('.igx-pp-m .mi', r).forEach(b => b.addEventListener('click', () => { model = +b.dataset.m; $$('.igx-pp-m .mi', r).forEach(x => x.setAttribute('aria-checked', x === b)); mdlN.textContent = MODELS[model].n; }));
  const canGo = () => { go.disabled = !ta.value.trim() || busy(); };
  c.on(ta, 'input', canGo);
  c.on(ta, 'keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing){ e.preventDefault(); generate(); } });
  c.on(form, 'submit', e => { e.preventDefault(); generate(); });

  /* ---------- the side: the gallery, newest first, and the style presets ---------- */
  function drawGallery(){
    const was = document.activeElement && galEl.contains(document.activeElement) ? document.activeElement.dataset.id : null;
    // two columns: each picture goes under the shorter one, so the columns end close together
    const cols = [[], []], h = [0, 0];
    gallery.forEach(img => { const k = h[0] <= h[1] ? 0 : 1; cols[k].push(img); h[k] += 1 / img.ar + .06; });
    galEl.innerHTML = cols.map(col => `<div class="igx-col">${col.map(img => `<button type="button" class="igx-g${img.fresh ? ' new' : ''}" data-id="${img.id}" aria-haspopup="dialog" aria-label="${esc(PIC[img.pic].alt)}" style="--dm-ar:${img.ar};${look(img)}"><span class="igx-ly" data-pic="${img.pic}" data-pic-size="s"></span></button>`).join('')}</div>`).join('');
    gallery.forEach(img => { img.fresh = false; });
    cn.textContent = gallery.length;
    if (was){ const b = $(`[data-id="${was}"]`, galEl); if (b) b.focus({ preventScroll:true }); }
  }
  c.on(galEl, 'click', e => { const b = e.target.closest('.igx-g'); if (!b) return; const img = gallery.find(x => x.id === +b.dataset.id); if (img) openLB([...gallery], img, b, e.isTrusted); });
  prsEl.innerHTML = PRESETS.map(p => `<button type="button" class="igx-pr" aria-pressed="false" style="--dm-art:${PIC[p.pic].g}"><span class="igx-prp"><span class="igx-ly" data-pic="${p.pic}" data-pic-size="s"></span></span><span class="igx-prt"><b>${p.n}</b><span class="muted">${p.d}</span></span></button>`).join('');
  $$('.igx-pr', prsEl).forEach((b, i) => b.onclick = () => {
    const p = PRESETS[i], before = new Set(styles);
    styles.clear(); p.s.forEach(x => styles.add(x));
    drawStyles(['Editorial', 'Poster', 'Surreal', '35mm'].filter(x => before.has(x) !== styles.has(x)));
    say(`${p.n}: ${p.s.join(' and ')}`);
    // where the side takes the feed's place, picking a preset goes back to the prompt it changed
    if (getComputedStyle(vw).display !== 'none') view('create');
  });
  const tb = $('.igx-tb', r), vw = $('.igx-vw', r);
  const tbSeg = seg(tb, v => tab(v)), vwSeg = seg(vw, v => view(v));
  function tab(v){ Object.entries(panes).forEach(([k, el]) => { el.hidden = k !== v; }); $$('button', tb).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === v)); tbSeg.place(); }
  function view(v){ box.dataset.view = v; if (v !== 'create') tab(v); $$('button', vw).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === v)); vwSeg.place(); }

  /* ---------- the larger view: the picture as large as it fits, every action, Left and Right for the others ---------- */
  function openLB(list, img, from, mine){
    closePops(); hideTip(true);
    lb = { list, img, from }; drawLB();
    lbEl.hidden = false; lbEl.classList.remove('open'); void lbEl.offsetWidth; lbEl.classList.add('open');
    // the focus moves in only when a person opened it, so the demo never takes it from the page
    if (mine) $('.igx-lbx', lbEl).focus({ preventScroll:true });
  }
  function drawLB(){
    const { list, img } = lb, i = list.indexOf(img), P = PIC[img.pic];
    lbEl.setAttribute('aria-label', `Picture ${i + 1} of ${list.length}`);
    lbEl.innerHTML = `<div class="igx-lbh"><div class="igx-lbt"><b>${esc(img.prompt)}</b><span class="muted">${metaOf(img)}</span></div><span class="muted num">${i + 1} of ${list.length}</span><button type="button" class="ib igx-lbx" aria-label="Close" data-tip="Close" data-tip-k="Esc">${I('x')}</button></div>
      <div class="igx-lbb"><button type="button" class="pill line igx-lbn" data-a="prev" aria-label="Previous picture" data-tip="Previous"${i > 0 ? '' : ' disabled'}>${I('chev-l')}</button>
      <div class="igx-lbs"><figure class="igx-t" data-st="done" style="--dm-ar:${img.ar};${look(img)}">${layers(img, '')}<span class="igx-l" aria-hidden="true"><span></span><span></span></span><span class="tag igx-tg">${img.up ? '2×' : ''}</span></figure></div>
      <button type="button" class="pill line igx-lbn" data-a="next" aria-label="Next picture" data-tip="Next"${i < list.length - 1 ? '' : ' disabled'}>${I('chev-r')}</button></div>
      <div class="igx-lbf" role="toolbar" aria-label="Picture actions">
        <button type="button" class="pill line sm" data-a="upscale" aria-label="Upscale" data-tip="Upscale to twice the size">${I('max', 'xs')}<span class="igx-lbl">Upscale</span></button>
        <button type="button" class="pill line sm" data-a="vary" aria-label="Vary" data-tip="Make a variation">${I('layers', 'xs')}<span class="igx-lbl">Vary</span></button>
        <button type="button" class="pill line sm" data-a="ref" aria-label="Use as reference" data-tip="Use as reference">${I('clip', 'xs')}<span class="igx-lbl">Use as reference</span></button>
        <button type="button" class="pill line sm" data-a="download" aria-label="Download" data-tip="Download">${I('down', 'xs')}<span class="igx-lbl">Download</span></button>
        <span class="igx-sep" aria-hidden="true"></span>
        <button type="button" class="ib" data-a="like" aria-label="Good picture" aria-pressed="${img.rate === 1}" data-tip="Good picture">${I('up-thumb')}</button>
        <button type="button" class="ib" data-a="dislike" aria-label="Bad picture" aria-pressed="${img.rate === -1}" data-tip="Bad picture">${I('down-thumb')}</button>
      </div>`;
    const ss = $('.igx-lbs>.igx-t .igx-s', lbEl); ss.setAttribute('role', 'img'); ss.setAttribute('aria-label', P.alt);
    $('.igx-lbs>.igx-t .igx-b', lbEl).setAttribute('aria-hidden', 'true');
  }
  function step(d){ const i = lb.list.indexOf(lb.img) + d; if (i < 0 || i >= lb.list.length) return; lb.img = lb.list[i]; const f = document.activeElement && document.activeElement.dataset.a; drawLB(); const b = f && $(`[data-a="${f}"]`, lbEl); if (b && !b.disabled) b.focus({ preventScroll:true }); else if (f) $('.igx-lbx', lbEl).focus({ preventScroll:true }); }
  function closeLB(back){
    if (!lb) return; const from = lb.from; lb = null; lbEl.hidden = true; lbEl.classList.remove('open'); lbEl.innerHTML = ''; hideTip(true);
    if (back && from && from.isConnected) from.focus({ preventScroll:true });
  }
  c.on(lbEl, 'click', e => {
    if (!lb) return;
    if (e.target.closest('.igx-lbx')) return closeLB(e.isTrusted);
    const a = e.target.closest('[data-a]'); if (!a) return;
    const img = lb.img, k = a.dataset.a;
    if (k === 'prev') step(-1); else if (k === 'next') step(1);
    else if (k === 'upscale') upscale(img);
    else if (k === 'vary') vary(img);
    else if (k === 'ref'){ closeLB(false); reference(img, e.isTrusted); }
    else if (k === 'download') download(img, a, $('.igx-lbs>.igx-t', lbEl));
    else { const up = k === 'like', on = img.rate !== (up ? 1 : -1); img.rate = on ? (up ? 1 : -1) : 0; $$('[data-a="like"],[data-a="dislike"]', lbEl).forEach(b => b.setAttribute('aria-pressed', b.dataset.a === k && on)); say(on ? (up ? 'Marked as good' : 'Marked as bad') : 'Rating removed'); }
  });
  c.on(lbEl, 'keydown', e => {
    if (!lb) return;
    if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); closeLB(true); return; }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.target.closest('.igx-lbf')){ e.preventDefault(); step(e.key === 'ArrowLeft' ? -1 : 1); return; }
    // the focus stays inside while it is open
    if (e.key === 'Tab'){ const f = $$('button:not(:disabled)', lbEl); const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a){ e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z){ e.preventDefault(); a.focus(); } }
  });

  drawGallery(); drawStyles(); canGo();

  /* the preview's story: generate four portraits (one fails and is retried), upscale one, open another and use it as a
     reference, then pick a style preset */
  const shown = el => el && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
  c.story(async s => {
    await s.beat(2);
    await s.tap(go);
    await s.until(() => run && !busy()); await s.beat(1.5);
    const bad = run.items.find(t => t.st === 'fail');
    if (bad){ await s.tap($('[data-a="retry"]', bad.el)); await s.until(() => !busy()); await s.beat(1.5); }
    const t2 = run.items[1];
    if (t2){ t2.el.classList.add('hov'); c.taken(() => t2.el.classList.remove('hov')); await s.point($('[data-a="upscale"]', t2.el)); await s.beat(1); await s.tap($('[data-a="upscale"]', t2.el)); await s.beat(4); t2.el.classList.remove('hov'); }
    await s.tap($('.igx-o', run.items[0].el)); await s.beat(3);
    await s.tap($('[data-a="ref"]', lbEl)); await s.beat(2.5);
    const sb = [$('.igx-tb [data-v="styles"]', r), $('.igx-vw [data-v="styles"]', r)].find(shown);
    if (sb){ await s.tap(sb); await s.beat(2); await s.tap($$('.igx-pr', prsEl)[2]); await s.beat(3); }
  });
});
