// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, carousel, seg, swap } from '../core/core.js';
/* a draft being made builds up out of pixels on a canvas over its frame (owner, 5 Nov): first a sparse grid of cells that
   twinkle in the picture's colours, a few in the accent; then the picture as coarse blocks that refine in four steps (6×4,
   12×8, 24×16, 48×32), each step settling in its own order (scattered, a diagonal wave, out from the middle, a scan from the
   left) with a short lift as each cell lands; then the picture itself comes into focus over the last step. One that fails
   glitches, loses its colour and falls apart into its error. The colours come from the photo once one is laid on the picture
   (on designme.dev, art/art.js) and otherwise from its gradient (--art), so an install builds up in the same colours. Soft
   rounds its cells by --rk (from the frame's corner), Blueprint keeps them square on a hairline grid.
   crsPixels(canvas, { g, pic, pace, on }) returns the field: step(ms) moves it on and draws, when(u) waits for a share of the
   way (0 to 1), fail() glitches it out, still() draws the coarse mosaic once, for reduced motion. on(percent, phase) hears
   the progress. It only draws when stepped, so whoever steps it decides when it runs */
function crsPixels(cv, { g = '', pic = null, pace = 1, on = () => {} } = {}){
  const x = cv.getContext('2d'); if (!x) return null;
  const SEED = 700 * pace, LV = [[6, 4, 460], [12, 8, 520], [24, 16, 560], [48, 32, 620]].map(([c, r, d]) => ({ c, r, d:d * pace })), END = SEED + LV.reduce((a, l) => a + l.d, 0);
  let at = SEED; for (const l of LV){ l.s = at; at += l.d; }
  // a seeded random, so each picture builds up its own way
  let h = 2166136261; for (const ch of g) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rnd = () => { h = h + 0x6D2B79F5 | 0; let t = Math.imul(h ^ h >>> 15, 1 | h); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  let w = 0, ht = 0, dpr = 1, base = null, bx = null, baked = -1, t = 0, pct = -1, photo = false, looked = 0, still = false, fail = null;
  const waits = [];
  const cl = v => v < 0 ? 0 : v > 1 ? 1 : v, out3 = p => 1 - (1 - p) ** 3, back = p => 1 + 2.2 * (p - 1) ** 3 + 1.2 * (p - 1) ** 2;
  // a colour as CSS, lifted by k: brighter in its own hue (a dark brown lifts to a warmer brown, not to grey), and a pale one
  // only as far as its brightest channel allows, so nothing flares to white
  const rgb = (c, k = 0) => { const m = Math.min(1 + k * 1.2, 255 / Math.max(1, c[0], c[1], c[2])); return `rgb(${c.map(v => Math.round(v * m + (255 - v * m) * k * .15)).join(',')})`; };
  /* the colours, as a 48×32 grid averaged down to each step. From the gradient: its stops painted the way CSS lays them
     out, with a little grain so the blocks don't read as stripes */
  function fromGradient(){
    const m = /linear-gradient\((.*)\)\s*$/i.exec(g.trim()); if (!m) return null;
    const parts = m[1].split(/,(?![^(]*\))/).map(p => p.trim()); let ang = 180;
    if (/deg$/.test(parts[0])) ang = parseFloat(parts.shift());
    else if (/^to /.test(parts[0])) ang = { 'to top':0, 'to right':90, 'to bottom':180, 'to left':270 }[parts.shift()] ?? 180;
    const st = parts.map(p => { const k = /^(#[0-9a-f]{3,8})(?:\s+(-?[\d.]+)%)?$/i.exec(p); return k && { c:k[1], at:k[2] != null ? +k[2] / 100 : null }; });
    if (st.length < 2 || st.some(s => !s)) return null;
    if (st[0].at == null) st[0].at = 0; if (st[st.length - 1].at == null) st[st.length - 1].at = 1;
    for (let i = 1; i < st.length; i++) if (st[i].at == null){ let j = i; while (st[j].at == null) j++; for (let k = i; k < j; k++) st[k].at = st[i - 1].at + (st[j].at - st[i - 1].at) * (k - i + 1) / (j - i + 1); }
    const W = 48, H = 32, o = document.createElement('canvas'); o.width = W; o.height = H; const ox = o.getContext('2d');
    const a = ang * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a), L = Math.abs(W * dx) + Math.abs(H * dy);
    const gr = ox.createLinearGradient(W / 2 - dx * L / 2, H / 2 - dy * L / 2, W / 2 + dx * L / 2, H / 2 + dy * L / 2);
    let last = 0; for (const s of st){ last = Math.max(last, cl(s.at)); gr.addColorStop(last, s.c); }
    ox.fillStyle = gr; ox.fillRect(0, 0, W, H);
    const d = ox.getImageData(0, 0, W, H).data, px = [];
    for (let i = 0; i < W * H; i++){ const k = .93 + rnd() * .1 + .04 * Math.sin(i % W * .5 + (i / W | 0) * .9); px.push([d[i * 4] * k, d[i * 4 + 1] * k, d[i * 4 + 2] * k].map(v => Math.min(255, v))); }
    return px;
  }
  // from the photo: covering the frame as the picture does, 96×64 averaged to 48×32
  function fromImage(im){
    const W = 96, H = 64, o = document.createElement('canvas'); o.width = W; o.height = H; const ox = o.getContext('2d');
    const fr = (cv.clientWidth / cv.clientHeight) || 1.5, ir = im.naturalWidth / im.naturalHeight;
    let sw = im.naturalWidth, sh = im.naturalHeight; if (ir > fr) sw = sh * fr; else sh = sw / fr;
    ox.imageSmoothingQuality = 'high'; ox.drawImage(im, (im.naturalWidth - sw) / 2, (im.naturalHeight - sh) / 2, sw, sh, 0, 0, W, H);
    let d; try { d = ox.getImageData(0, 0, W, H).data; } catch(e){ return null; }
    const px = [];
    for (let j = 0; j < 32; j++) for (let i = 0; i < 48; i++){ const c = [0, 0, 0]; for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]){ const k = ((j * 2 + b) * W + i * 2 + a) * 4; c[0] += d[k]; c[1] += d[k + 1]; c[2] += d[k + 2]; } px.push(c.map(v => v / 4)); }
    return px;
  }
  const grey = [150, 150, 150];
  function palette(px){
    if (!px) px = Array.from({ length:48 * 32 }, () => grey);
    LV.forEach(l => {
      const f = 48 / l.c; l.col = [];
      for (let j = 0; j < l.r; j++) for (let i = 0; i < l.c; i++){ const c = [0, 0, 0]; for (let b = 0; b < f; b++) for (let a = 0; a < f; a++){ const p = px[(j * f + b) * 48 + i * f + a]; c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; } l.col.push(c.map(v => v / f / f)); }
      l.css = l.col.map(c => rgb(c));
    });
    base = null;
  }
  /* each step's order: when each cell starts to land, from 0 to 1 */
  const ORD = [() => rnd(), (i, j, l) => (i / l.c + j / l.r) / 2, (i, j, l) => Math.hypot((i + .5) / l.c - .5, ((j + .5) / l.r - .5) * .67) / .6, (i, j, l) => i / l.c];
  LV.forEach((l, k) => { const o = []; for (let j = 0; j < l.r; j++) for (let i = 0; i < l.c; i++) o.push(cl(ORD[k](i, j, l) * .82 + rnd() * .18)); l.o = o; l.par = o.map((_, n) => k ? ((n / l.c | 0) >> 1) * LV[k - 1].c + ((n % l.c) >> 1) : -1); });
  // the sparse field before the blocks: a 24×16 grid, each cell twinkling at its own rate, one in twenty in the accent
  const TW = Array.from({ length:24 * 16 }, () => ({ ph:rnd() * 6.28, w:2.6 + rnd() * 3.4, ac:rnd() < .05 }));
  palette(fromGradient());

  // the look: corners from the frame's own (Soft scales them by --rk, Blueprint has none) and the theme's colours, read once
  const fig = cv.closest('figure') || cv.parentElement, R = parseFloat(getComputedStyle(fig).borderTopLeftRadius) || 0, cs = getComputedStyle(cv);
  const ACC = cs.getPropertyValue('--dm-accent').trim() || '#888', BAD = cs.getPropertyValue('--dm-bad').trim() || '#c33', LINE = cs.getPropertyValue('--dm-line').trim() || 'rgba(128,128,128,.3)';
  const geo = l => { const cw = w / l.c, ch = ht / l.r, gp = R ? Math.min(2.5, Math.max(1, cw * .07)) : 1, r = R ? Math.min(cw * .14, R * .3) : 0; return { cw, ch, gp, r }; };
  const snap = v => Math.round(v * dpr) / dpr;
  // a cell's slot (its share of the frame, gutter included) and the cell drawn in it, scaled about its middle
  const slot = (l, n, G) => { const i = n % l.c, j = n / l.c | 0, X = snap(i * G.cw), Y = snap(j * G.ch); return [X, Y, snap((i + 1) * G.cw) - X, snap((j + 1) * G.ch) - Y]; };
  const box = (c, l, n, G, s = 1) => { const [X0, Y0, W0, H0] = slot(l, n, G), cw = (W0 - G.gp) * s, ch = (H0 - G.gp) * s, X = X0 + (W0 - cw) / 2, Y = Y0 + (H0 - ch) / 2;
    if (G.r * s >= 1.2 && c.roundRect){ c.beginPath(); c.roundRect(X, Y, cw, ch, G.r * s); c.fill(); } else c.fillRect(X, Y, cw, ch); };
  function fit(){
    const cw = cv.clientWidth, ch = cv.clientHeight; if (!cw || !ch) return false;
    const d = Math.min(2, devicePixelRatio || 1);
    if (cw !== w || ch !== ht || d !== dpr){ w = cw; ht = ch; dpr = d; cv.width = Math.round(w * dpr); cv.height = Math.round(ht * dpr); base = null; }
    return true;
  }
  // the steps that have landed are kept on a second canvas, and each cell of the step landing now is painted onto it as it lands
  function bake(k){
    if (base && baked === k - 1) return;
    if (!base){ base = document.createElement('canvas'); bx = base.getContext('2d'); }
    base.width = cv.width; base.height = cv.height; bx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let q = 0; q < k; q++){ const l = LV[q], G = geo(l); for (let n = 0; n < l.css.length; n++){ bx.clearRect(...slot(l, n, G)); bx.fillStyle = l.css[n]; box(bx, l, n, G); } }
    baked = k - 1; LV[k].done = new Uint8Array(LV[k].c * LV[k].r);
  }
  function frame(){
    x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, ht);
    let k = LV.findIndex(l => t < l.s + l.d); if (k < 0) k = LV.length;
    // the twinkling field, thicker as it goes on, fading out as the first blocks land
    const fade = k === 0 ? cl(1 - (t - LV[0].s) / LV[0].d * 1.4) : 0;
    if (t < LV[0].s + LV[0].d && fade > 0){
      const dens = .08 + .5 * cl(t / SEED), l = { c:24, r:16 }, G = geo(l), s = t / 1000;
      if (!R){ x.globalAlpha = .5 * cl(t / 300) * fade; x.fillStyle = LINE; for (let i = 1; i < 24; i++) x.fillRect(snap(i * G.cw), 0, 1 / dpr, ht); for (let j = 1; j < 16; j++) x.fillRect(0, snap(j * G.ch), w, 1 / dpr); }
      for (let n = 0; n < TW.length; n++){
        const c = TW[n], a = cl((.5 + .5 * Math.sin(s * c.w + c.ph) - (1 - dens)) / dens); if (a < .03) continue;
        x.globalAlpha = cl(a * 2.5) * fade; x.fillStyle = c.ac ? ACC : LV[2].css[n]; box(x, l, n, G, .3 + .6 * a);
      }
      x.globalAlpha = 1;
    }
    if (k > 0 || t >= LV[0].s){
      const kk = Math.min(k, LV.length - 1);
      bake(kk); const l = LV[kk], G = geo(l), lt = (t - l.s) / l.d;
      // the cells of this step that have landed go onto the kept canvas; the ones landing now are drawn over it
      for (let n = 0; n < l.o.length; n++){ if (l.done[n] || cl((lt - l.o[n] * .72) / .28) < 1) continue; l.done[n] = 1; bx.clearRect(...slot(l, n, G)); bx.fillStyle = l.css[n]; box(bx, l, n, G); }
      x.drawImage(base, 0, 0, w, ht);
      if (k < LV.length) for (let n = 0; n < l.o.length; n++){
        if (l.done[n]) continue; const p = cl((lt - l.o[n] * .72) / .28); if (p <= 0) continue;
        const e = out3(p), lift = Math.sin(Math.PI * p) * .32, c = kk ? LV[kk - 1].col[l.par[n]] : null, own = l.col[n];
        const mix = c ? [0, 1, 2].map(q => c[q] + (own[q] - c[q]) * e) : own;
        if (kk) x.clearRect(...slot(l, n, G)); else x.globalAlpha = cl(p * 5);
        x.fillStyle = rgb(mix, lift); box(x, l, n, G, kk ? 1 : .35 + .65 * back(p)); x.globalAlpha = 1;
      }
      // all four steps in and the picture not here yet: a cell here and there lifts and settles while it finishes
      if (k >= LV.length && t > END + 250){ const l3 = LV[3], G3 = geo(l3), s = (t - END - 250) / 1000; for (let n = 0; n < l3.col.length; n += 7){ const a = Math.sin(s * 2.1 + TW[n % TW.length].ph * 3); if (a < .9) continue; x.fillStyle = rgb(l3.col[n], (a - .9) * 3); box(x, l3, n, G3); } }
    }
  }
  /* failing: the picture so far is kept, shaken in bands as it loses its colour, a few cells flash in the error colour, then
     it falls apart cell by cell */
  function glitch(){
    const q = fail.t / 520, dz = (fail.t - 520) / 460, W = cv.width, H = cv.height, bh = H / 16, cw = W / 24;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
    if (q < 1){
      if (fail.t - fail.roll > 60){ fail.roll = fail.t; fail.dx = fail.dx.map(() => rnd() < .15 + .5 * q ? Math.round((rnd() - .5) * 6) * cw : 0); fail.hot = Array.from({ length:3 + (rnd() * 4 | 0) }, () => [rnd() * 24 | 0, rnd() * 16 | 0]); }
      for (let j = 0; j < 16; j++){ x.drawImage(fail.snap, 0, j * bh, W, bh, fail.dx[j], j * bh, W, bh); x.globalAlpha = cl(q * 1.3); x.drawImage(fail.grey, 0, j * bh, W, bh, fail.dx[j], j * bh, W, bh); x.globalAlpha = 1; }
      x.fillStyle = BAD; x.globalAlpha = .9 * cl(q * 2); for (const [i, j] of fail.hot) x.fillRect(i * cw + 1, j * bh + 1, cw - 2, bh - 2); x.globalAlpha = 1;
    } else for (let n = 0; n < 24 * 16; n++){
      const p = cl((dz - fail.o[n] * .6) / .4), s = 1 - out3(p); if (s <= 0) continue;
      const i = n % 24, j = n / 24 | 0; x.globalAlpha = s; x.drawImage(fail.grey, i * cw, j * bh, cw, bh, i * cw + cw * (1 - s) / 2, j * bh + bh * (1 - s) / 2, cw * s, bh * s);
    }
    x.globalAlpha = 1;
  }
  function look(){
    // the photo, once one is laid on the picture: it is used if it loads before the first blocks land
    if (photo || !pic || t >= LV[0].s) return;
    const u = /url\(["']?([^"')]+)["']?\)/.exec(pic.style.backgroundImage || ''); if (!u) return;
    photo = true; const im = new Image(); im.crossOrigin = 'anonymous';
    im.onload = () => { if (t >= LV[0].s && !still) return; const px = fromImage(im); if (px){ palette(px); if (still) api.still(); } };
    im.src = u[1];
  }
  const api = {
    get u(){ return cl(t / END); },
    step(dt){
      if (fail){ fail.t += dt; if (fit()) glitch(); if (fail.t >= 980 && fail.res){ fail.res(); fail.res = null; } return; }
      t += dt; if (looked++ % 6 === 0) look();
      if (fit()) frame();
      const u = cl(t / END), p = Math.min(99, Math.floor(u * 100));
      if (p !== pct){ pct = p; on(p, t < SEED ? 'Sketching' : t < LV[2].s ? 'Blocking in' : t < END ? 'Refining' : 'Finishing'); }
      for (let i = waits.length - 1; i >= 0; i--) if (u >= waits[i].u){ waits[i].res(); waits.splice(i, 1); }
    },
    when:u => new Promise(res => waits.push({ u, res })),
    fail(){
      if (fail) return fail.p; fit();
      const snapC = document.createElement('canvas'); snapC.width = cv.width; snapC.height = cv.height; snapC.getContext('2d').drawImage(cv, 0, 0);
      const gr = document.createElement('canvas'); gr.width = cv.width; gr.height = cv.height; const gx = gr.getContext('2d'); gx.drawImage(cv, 0, 0); gx.globalCompositeOperation = 'saturation'; gx.fillStyle = '#808080'; gx.fillRect(0, 0, gr.width, gr.height); gx.globalCompositeOperation = 'destination-in'; gx.drawImage(cv, 0, 0);
      fail = { t:0, roll:-1e9, dx:Array(16).fill(0), hot:[], snap:snapC, grey:gr, o:Array.from({ length:24 * 16 }, () => rnd()) };
      fail.p = new Promise(res => { fail.res = res; });
      return fail.p;
    },
    // reduced motion: the 12×8 mosaic, drawn once (and again if the photo arrives)
    still(){
      still = true; look(); if (!fit()) return;
      const l = LV[1], G = geo(l); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, ht);
      for (let n = 0; n < l.css.length; n++){ x.fillStyle = l.css[n]; box(x, l, n, G); }
    }
  };
  look();
  return api;
}
DM.def('carousel', (r, c, card) => {
  r.innerHTML = r.innerHTML.replace(/\{chev-l\}/g, I('chev-l')).replace(/\{chev-r\}/g, I('chev-r'));
  const sg = $('.demo .seg2', r), box = { variants:$('.crs-c[data-type="variants"]', r), images:$('.crs-c[data-type="images"]', r) };
  // the pictures: each has words for a screen reader and g, a gradient of its colours that stands in for it. On designme.dev,
  // art/art.js lays the photo of the same name over it: photos from Pexels, free under the Pexels License
  // (https://www.pexels.com/license/), credited in art/README.md and never part of an install

  /* Variants: four drafts of one cover image, "mountains at golden hour": what each looks like, how long it took and p, how
     long it takes to build up here (1 is about three seconds). The last one fails once */
  const V = [
    { l:'Variant A', d:'Amber haze', t:'9s', p:1, art:'cover-a', g:'linear-gradient(#ffb35c,#d9733a 45%,#3a2116 70%)', alt:'Forested ridges in silhouette under an amber sky' },
    { l:'Variant B', d:'Alpenglow', t:'11s', p:1.2, art:'cover-b', g:'linear-gradient(#a9bccb,#e08a5c 50%,#3a2f2a 75%)', alt:'Rocky peaks lit pink by the low sun under a pale sky' },
    { l:'Variant C', d:'Lake at dusk', t:'7s', p:.85, art:'cover-c', g:'linear-gradient(#e6b46a,#b88650 50%,#1f1810 80%)', alt:'Mountains round a lake in a golden haze, dark firs in front' },
    { l:'Variant D', d:'Valley light', t:'14s', p:1.1, art:'cover-d', g:'linear-gradient(#c9b88f,#5f8f86 45%,#2f5a3a)', alt:'Sun rays over a green valley with a winding road, mountains all round', fail:1 }
  ];
  const vb = box.variants, vtr = $('.crs-tr', vb), sub = $('.crs-sub', vb), vsr = $('.crs-sr', vb);
  const st = V.map(() => 'wait'); let kept = -1, started = false;
  vtr.innerHTML = V.map((v, i) => `<div class="crs-s" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${V.length}"><figure class="crs-fig"><div class="crs-pv"></div><figcaption class="crs-f"><div><b>${v.l}</b><span class="muted"></span></div><span class="crs-x"></span></figcaption></figure></div>`).join('');
  const S = $$('.crs-s', vtr);
  const say = t => { vsr.textContent = t; };
  // the picture waits in its frame from the start, unseen, so the pixels can take its colours (and on designme.dev the photo)
  const pre = v => `<span class="crs-img pre" data-pic="${v.art}" style="--dm-art:${v.g}"></span>`;
  function draw(i){
    const v = V[i], s = S[i], pv = $('.crs-pv', s), meta = $('.crs-f .muted', s), x = $('.crs-x', s), k = st[i];
    pv.className = 'crs-pv' + (k === 'fail' ? ' fail' : '');
    pv.classList.toggle('gen', k === 'gen');
    const img = $('.crs-img', pv);
    if (k === 'wait' || k === 'gen'){
      if (!img || !img.classList.contains('pre')) pv.innerHTML = I('image', 'ph') + pre(v);
      if (k === 'gen' && !$('.crs-px', pv)) $('.crs-img', pv).insertAdjacentHTML('beforebegin', '<canvas class="crs-px" aria-hidden="true"></canvas>');
      meta.textContent = k === 'gen' ? 'Making' : 'Waiting'; x.innerHTML = k === 'gen' ? '<span class="tag"><span class="spin"></span>Making</span>' : '<span class="tag">Queued</span>';
    }
    else if (k === 'fail'){ pv.innerHTML = `${I('alert')}<b>Couldn't make this picture</b><span class="muted">The image model timed out</span><button class="pill line sm crs-retry">${I('refresh','xs')}Retry</button>`; meta.textContent = v.d; x.innerHTML = '<span class="tag bad">Failed</span>'; $('.crs-retry', pv).onclick = () => retry(i); }
    else {
      // the picture comes into focus over the last of the pixels, which go once it is in
      if (img && img.classList.contains('pre')){
        img.classList.remove('pre'); img.setAttribute('role', 'img'); img.setAttribute('aria-label', v.alt);
        const ph = $('.ph', pv); if (ph) ph.remove();
        const px = $('.crs-px', pv); if (px){ const rm = () => px.remove(); img.addEventListener('animationend', rm, { once:true }); c.later(1500, rm); }
      } else if (!img) pv.innerHTML = `<span class="crs-img" role="img" aria-label="${v.alt}" data-pic="${v.art}" style="--dm-art:${v.g}"></span>`;
      meta.textContent = `${v.d} · ${v.t}`; x.innerHTML = `<button class="pill line sm crs-keep" aria-pressed="${kept === i}">${kept === i ? I('check','xs') + 'Kept' : 'Keep'}</button>`; $('.crs-keep', x).onclick = () => keep(i);
    }
  }
  function keep(i){ if (st[i] !== 'ready') return; kept = kept === i ? -1 : i; vb.classList.toggle('kept', kept >= 0); S.forEach((s, j) => { s.classList.toggle('kept', j === kept); if (st[j] === 'ready') draw(j); }); swap(sub, kept >= 0 ? `Keeping ${V[kept].l}` : head()); say(kept >= 0 ? `Kept ${V[i].l}` : `${V[i].l} no longer kept`); }
  const head = () => { const done = st.filter(x => x === 'ready').length, bad = st.filter(x => x === 'fail').length, busy = st.some(x => x === 'wait' || x === 'gen'); return busy ? `Making ${V.length} variants, ${done} ready` : `${done} ready${bad ? `, ${bad} failed` : ''}`; };
  // a swipe, a drag, the arrows, the dots and the keys all move the one track; Enter on it keeps the draft in view
  const vk = carousel(c, vtr, { prev:$('.crs-prev', vb), next:$('.crs-next', vb), dots:$('.crs-dots', vb), dot:i => `Go to ${V[i].l}`, say:i => say(`${V[i].l}, ${i + 1} of ${V.length}`),
    key:e => { if (e.key === 'Enter'){ e.preventDefault(); keep(vk.stop.i); } } });
  /* the drafts being built share one frame loop. It runs only while one is building, the carousel is on screen or near it,
     the tab is open and no pointer holds the demo; otherwise it rests, looking again four times a second. Time only moves
     while it runs, so a held draft picks up where it was */
  const live = new Set(); let raf = 0, nap = 0, last = 0;
  const wake = () => { if (!raf && !nap && !c.dead && live.size) raf = requestAnimationFrame(tick); };
  const tick = t => {
    raf = 0; if (c.dead || !live.size){ last = 0; return; }
    if (c.seen === false || c.hold() || document.hidden){ last = 0; nap = setTimeout(() => { nap = 0; wake(); }, 250); return; }
    const dt = last ? Math.min(64, t - last) : 16; last = t;
    live.forEach(f => f.step(dt)); wake();
  };
  c.offs.push(() => { cancelAnimationFrame(raf); clearTimeout(nap); });
  // the agent makes all four at once, each at its own pace, once the drafts are first shown. Each builds up out of pixels and
  // comes into focus where its placeholder stood; the one that fails glitches out halfway. With reduced motion the frame
  // shows a still mosaic of the picture's colours until it lands
  async function make(i){
    const v = V[i], s = S[i], meta = $('.crs-f .muted', s);
    st[i] = 'gen'; draw(i); swap(sub, head());
    const f = crsPixels($('.crs-px', s), { g:v.g, pic:$('.crs-img', s), pace:v.p, on:(p, ph) => { if (st[i] === 'gen') meta.textContent = `${ph} · ${p}%`; } });
    const bad = v.fail === 1;
    if (!f || REDUCE){ if (f) f.still(); await new Promise(res => c.later(bad ? 1400 : 1800 * v.p, res)); }
    else { live.add(f); wake(); await f.when(bad ? .5 : 1); if (bad) await f.fail(); live.delete(f); }
    if (bad){ v.fail = 2; st[i] = 'fail'; draw(i); say(`${v.l} failed`); } else { st[i] = 'ready'; draw(i); say(`${v.l} ready`); }
    if (kept < 0) swap(sub, head());
  }
  function retry(i){ c.run(async () => { await make(i); }); }
  const startV = () => { if (started) return; started = true; V.forEach((v, i) => c.run(async () => { await c.wait(500 + i * 350); await make(i); })); };
  V.forEach((v, i) => draw(i));

  /* Images: six photos, each with a title and the colours in it */
  const P = [
    { art:'spiral-staircase', t:'Spiral staircase', m:'Bronze, cream and slate', g:'linear-gradient(135deg,#8a5a32,#d9a46a 50%,#5f6670)', alt:'Looking down a spiral staircase that coils in rings of bronze and cream' },
    { art:'minaret-sunset', t:'Minaret at sunset', m:'Sand, ochre and haze', g:'linear-gradient(#cfc6bd,#d59a52 45%,#7a4f2c)', alt:'A stone minaret above a plain of golden fields at sunset' },
    { art:'cat-apple-tree', t:'Cat in the apple tree', m:'Sky blue, leaf green and ginger', g:'linear-gradient(135deg,#3f8fe0,#7fb84a 50%,#e6a35a)', alt:'A ginger and white cat in an apple tree, reaching a paw toward an apple' },
    { art:'snowboarder', t:'Fresh snow', m:'Snow white, sky blue and black', g:'linear-gradient(#2f6fd6,#e8eef5 45%,#c9d3dd)', alt:'A snowboarder in a white jacket and blue goggles raising a hand among frosted trees' },
    { art:'shah-i-zinda', t:'Shah-i-Zinda', m:'Turquoise, sand and red', g:'linear-gradient(135deg,#1f8c9a,#d8b48a 50%,#b02a2a)', alt:'A woman in a red dress walking down a lane of turquoise-tiled tombs in Samarkand' },
    { art:'beach-signpost', t:'Beach signpost', m:'Turquoise, coral and peach', g:'linear-gradient(#5aa9e6,#2cc3c9 50%,#f2b08a)', alt:'A painted wooden signpost on a sandy cliff above a turquoise sea' }
  ];
  const ib = box.images, itr = $('.crs-tr', ib), isr = $('.crs-sr', ib);
  itr.innerHTML = P.map((p, i) => `<div class="crs-s" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${P.length}"><figure class="crs-fig"><div class="crs-pic" role="img" aria-label="${p.alt}" data-pic="${p.art}" style="--dm-art:${p.g}"></div><figcaption class="crs-cap"><b>${p.t}</b><span class="muted">${p.m}</span></figcaption></figure></div>`).join('');
  carousel(c, itr, { prev:$('.crs-prev', ib), next:$('.crs-next', ib), dots:$('.crs-dots', ib), dot:i => `Show ${P[i].t}`, say:i => { isr.textContent = `${P[i].t}, ${i + 1} of ${P.length}`; } });

  /* the switch: Variants or Images. The pick stays with the card, so the demo playing again or Replay keeps it */
  const keepIn = card || {};
  let type = keepIn._crsType === 'images' ? 'images' : 'variants';
  $$('button', sg).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === type));
  const show = (t, fade) => {
    Object.entries(box).forEach(([k, el]) => { el.hidden = k !== t; });
    if (fade && !REDUCE && box[t].animate) box[t].animate([{ opacity:0 }, { opacity:1 }], { duration:260, easing:'ease-out' });
    if (t === 'variants') startV();
  };
  show(type);
  seg(sg, v => { if (v === type) return; type = keepIn._crsType = v; show(v, true); });

  // the preview's story, for the type on show. Variants: once the four are in, flip to the third and keep it. Images: the
  // next two pictures, the last one from the dots, then back one. A switch to the other type ends it, and the next play is
  // the other type's
  if (r === c.st) c.story(async s => {
    const t0 = type, on = () => type === t0, b = box[t0];
    const step = async (el, n) => { if (!on()) throw 'switched'; await s.tap(el); s.away(); await s.beat(n); };
    try {
      if (t0 === 'variants'){
        await s.until(() => !on() || st.every(x => x === 'ready' || x === 'fail')); if (!on()) return; await s.beat(3);
        await step($('.crs-next', b), 2); await step($('.crs-next', b), 2);
        await step($('.crs-keep', S[2]), 5);
      } else {
        await s.beat(4);
        await step($('.crs-next', b), 4); await step($('.crs-next', b), 4);
        await step($$('.crs-dots button', b).pop(), 4); await step($('.crs-prev', b), 4);
      }
    } catch(e){ if (e !== 'switched') throw e; }
  });
});
