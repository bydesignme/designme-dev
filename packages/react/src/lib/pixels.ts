'use client';
/* Carousel's pixel field, the same as designme.dev's: while an agent makes a picture, its frame builds up out of pixels on a
   canvas. First a sparse grid of cells twinkles in the picture's colours, a few in the accent; then the picture comes in as
   coarse blocks that refine in four steps (6×4, 12×8, 24×16, 48×32), each step settling in its own order (scattered, a
   diagonal wave, out from the middle, a scan from the left) with a short lift as each cell lands; then the picture itself
   comes into focus over the last step. One that fails glitches, loses its colour and falls apart into its error.
   The colours come from the picture's `src` when it can be read (same origin, or served with CORS) and otherwise from its
   `placeholder` gradient, so a picture with no `src` still builds up in its own colours. Soft rounds the cells by its corner
   scale (read from the frame's corner); Blueprint keeps them square on a hairline grid.
   It only draws when stepped, so whoever steps it decides when it runs */

export type PixelPhase = 'Sketching' | 'Blocking in' | 'Refining' | 'Finishing';

export interface PixelFieldOptions {
  /** The picture's placeholder, a CSS linear-gradient of hex colours, like "linear-gradient(#ffb35c,#d9733a 45%,#3a2116)" */
  gradient?: string;
  /** The picture itself, to take the colours from once it loads */
  src?: string;
  /** How long it takes: 1 is about three seconds, 2 twice that */
  pace?: number;
  /** Hears the progress, as a whole percent (0 to 99) and what it is doing */
  onProgress?: (percent: number, phase: PixelPhase) => void;
}

export interface PixelField {
  /** Moves it on by `ms` and draws */
  step: (ms: number) => void;
  /** How far along it is, in milliseconds, and where it ends */
  readonly t: number;
  readonly end: number;
  /** Glitches it out; resolves once it has fallen apart (about a second of steps) */
  fail: () => Promise<void>;
  /** Draws the 12×8 mosaic once and stays, for reduced motion */
  still: () => void;
}

type RGB = number[];
interface Level { c: number; r: number; d: number; s: number; col: RGB[]; css: string[]; o: number[]; par: number[]; done: Uint8Array }
interface Geo { cw: number; ch: number; gp: number; r: number }
interface Fail { t: number; roll: number; dx: number[]; hot: number[][]; snap: HTMLCanvasElement; grey: HTMLCanvasElement; o: number[]; p: Promise<void>; res: (() => void) | null }

const cl = (v: number) => v < 0 ? 0 : v > 1 ? 1 : v, out3 = (p: number) => 1 - (1 - p) ** 3, back = (p: number) => 1 + 2.2 * (p - 1) ** 3 + 1.2 * (p - 1) ** 2;
// a colour as CSS, lifted by k: brighter in its own hue (a dark brown lifts to a warmer brown, not to grey), and a pale one
// only as far as its brightest channel allows, so nothing flares to white
const rgb = (c: RGB, k = 0) => { const m = Math.min(1 + k * 1.2, 255 / Math.max(1, c[0], c[1], c[2])); return `rgb(${c.map(v => Math.round(v * m + (255 - v * m) * k * .15)).join(',')})`; };
const canvas = (w: number, h: number) => { const o = document.createElement('canvas'); o.width = w; o.height = h; return o; };

export function pixelField(cv: HTMLCanvasElement, { gradient = '', src, pace = 1, onProgress }: PixelFieldOptions = {}): PixelField | null {
  const x = cv.getContext('2d'); if (!x) return null;
  const SEED = 700 * pace;
  const LV: Level[] = ([[6, 4, 460], [12, 8, 520], [24, 16, 560], [48, 32, 620]] as const).map(([c, r, d]) => ({ c, r, d: d * pace, s: 0, col: [], css: [], o: [], par: [], done: new Uint8Array(c * r) }));
  let at = SEED; for (const l of LV) { l.s = at; at += l.d; }
  const END = at;
  // a seeded random, so each picture builds up its own way
  let h = 2166136261; for (const ch of gradient) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rnd = () => { h = h + 0x6D2B79F5 | 0; let t = Math.imul(h ^ h >>> 15, 1 | h); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  let w = 0, ht = 0, dpr = 1, base: HTMLCanvasElement | null = null, bx: CanvasRenderingContext2D | null = null, baked = -1, t = 0, pct = -1, still = false, fail: Fail | null = null;

  /* the colours, as a 48×32 grid averaged down to each step. From the gradient: its stops painted the way CSS lays them out,
     with a little grain so the blocks don't read as stripes */
  function fromGradient(): RGB[] | null {
    const m = /linear-gradient\((.*)\)\s*$/i.exec(gradient.trim()); if (!m) return null;
    const parts = m[1].split(/,(?![^(]*\))/).map(p => p.trim()); let ang = 180;
    if (/deg$/.test(parts[0])) ang = parseFloat(parts.shift()!);
    else if (/^to /.test(parts[0])) ang = ({ 'to top': 0, 'to right': 90, 'to bottom': 180, 'to left': 270 } as Record<string, number>)[parts.shift()!] ?? 180;
    const st = parts.map(p => { const k = /^(#[0-9a-f]{3,8})(?:\s+(-?[\d.]+)%)?$/i.exec(p); return k ? { c: k[1], at: k[2] != null ? +k[2] / 100 : null as number | null } : null; });
    if (st.length < 2 || st.some(s => !s)) return null;
    const S = st as { c: string; at: number | null }[];
    if (S[0].at == null) S[0].at = 0;
    if (S[S.length - 1].at == null) S[S.length - 1].at = 1;
    for (let i = 1; i < S.length; i++) if (S[i].at == null) { let j = i; while (S[j].at == null) j++; for (let k = i; k < j; k++) S[k].at = S[i - 1].at! + (S[j].at! - S[i - 1].at!) * (k - i + 1) / (j - i + 1); }
    const W = 48, H = 32, ox = canvas(W, H).getContext('2d'); if (!ox) return null;
    const a = ang * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a), L = Math.abs(W * dx) + Math.abs(H * dy);
    const gr = ox.createLinearGradient(W / 2 - dx * L / 2, H / 2 - dy * L / 2, W / 2 + dx * L / 2, H / 2 + dy * L / 2);
    let last = 0; for (const s of S) { last = Math.max(last, cl(s.at!)); gr.addColorStop(last, s.c); }
    ox.fillStyle = gr; ox.fillRect(0, 0, W, H);
    const d = ox.getImageData(0, 0, W, H).data, px: RGB[] = [];
    for (let i = 0; i < W * H; i++) { const k = .93 + rnd() * .1 + .04 * Math.sin(i % W * .5 + (i / W | 0) * .9); px.push([d[i * 4] * k, d[i * 4 + 1] * k, d[i * 4 + 2] * k].map(v => Math.min(255, v))); }
    return px;
  }
  // from the picture: covering the frame as it does, 96×64 averaged to 48×32. A picture the page may not read gives nothing
  function fromImage(im: HTMLImageElement): RGB[] | null {
    const W = 96, H = 64, ox = canvas(W, H).getContext('2d'); if (!ox) return null;
    const fr = (cv.clientWidth / cv.clientHeight) || 1.5, ir = im.naturalWidth / im.naturalHeight;
    let sw = im.naturalWidth, sh = im.naturalHeight; if (ir > fr) sw = sh * fr; else sh = sw / fr;
    ox.imageSmoothingQuality = 'high'; ox.drawImage(im, (im.naturalWidth - sw) / 2, (im.naturalHeight - sh) / 2, sw, sh, 0, 0, W, H);
    let d: Uint8ClampedArray; try { d = ox.getImageData(0, 0, W, H).data; } catch { return null; }
    const px: RGB[] = [];
    for (let j = 0; j < 32; j++) for (let i = 0; i < 48; i++) { const c = [0, 0, 0]; for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const k = ((j * 2 + b) * W + i * 2 + a) * 4; c[0] += d[k]; c[1] += d[k + 1]; c[2] += d[k + 2]; } px.push(c.map(v => v / 4)); }
    return px;
  }
  function palette(px: RGB[] | null) {
    const all = px ?? Array.from({ length: 48 * 32 }, () => [150, 150, 150]);
    for (const l of LV) {
      const f = 48 / l.c; l.col = [];
      for (let j = 0; j < l.r; j++) for (let i = 0; i < l.c; i++) { const c = [0, 0, 0]; for (let b = 0; b < f; b++) for (let a = 0; a < f; a++) { const p = all[(j * f + b) * 48 + i * f + a]; c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; } l.col.push(c.map(v => v / f / f)); }
      l.css = l.col.map(c => rgb(c));
    }
    base = null;
  }
  /* each step's order: when each cell starts to land, from 0 to 1 */
  const ORD: ((i: number, j: number, l: Level) => number)[] = [() => rnd(), (i, j, l) => (i / l.c + j / l.r) / 2, (i, j, l) => Math.hypot((i + .5) / l.c - .5, ((j + .5) / l.r - .5) * .67) / .6, (i, _j, l) => i / l.c];
  LV.forEach((l, k) => { for (let j = 0; j < l.r; j++) for (let i = 0; i < l.c; i++) l.o.push(cl(ORD[k](i, j, l) * .82 + rnd() * .18)); l.par = l.o.map((_, n) => k ? ((n / l.c | 0) >> 1) * LV[k - 1].c + ((n % l.c) >> 1) : -1); });
  // the sparse field before the blocks: a 24×16 grid, each cell twinkling at its own rate, one in twenty in the accent
  const TW = Array.from({ length: 24 * 16 }, () => ({ ph: rnd() * 6.28, w: 2.6 + rnd() * 3.4, ac: rnd() < .05 }));
  palette(fromGradient());

  // the look: corners from the frame's own (Soft scales them, Blueprint has none) and the theme's colours, read once
  const fig = cv.closest('figure') ?? cv.parentElement ?? cv, R = parseFloat(getComputedStyle(fig).borderTopLeftRadius) || 0, cs = getComputedStyle(cv);
  const ACC = cs.getPropertyValue('--dm-accent').trim() || '#888', BAD = cs.getPropertyValue('--dm-bad').trim() || '#c33', LINE = cs.getPropertyValue('--dm-line').trim() || 'rgba(128,128,128,.3)';
  const geo = (l: { c: number; r: number }): Geo => { const cw = w / l.c, ch = ht / l.r; return { cw, ch, gp: R ? Math.min(2.5, Math.max(1, cw * .07)) : 1, r: R ? Math.min(cw * .14, R * .3) : 0 }; };
  const snap = (v: number) => Math.round(v * dpr) / dpr;
  // a cell's slot (its share of the frame, gutter included) and the cell drawn in it, scaled about its middle
  const slot = (l: { c: number }, n: number, G: Geo): [number, number, number, number] => { const i = n % l.c, j = n / l.c | 0, X = snap(i * G.cw), Y = snap(j * G.ch); return [X, Y, snap((i + 1) * G.cw) - X, snap((j + 1) * G.ch) - Y]; };
  const box = (c: CanvasRenderingContext2D, l: { c: number }, n: number, G: Geo, s = 1) => {
    const [X0, Y0, W0, H0] = slot(l, n, G), cw = (W0 - G.gp) * s, ch = (H0 - G.gp) * s, X = X0 + (W0 - cw) / 2, Y = Y0 + (H0 - ch) / 2;
    if (G.r * s >= 1.2 && c.roundRect) { c.beginPath(); c.roundRect(X, Y, cw, ch, G.r * s); c.fill(); } else c.fillRect(X, Y, cw, ch);
  };
  function fit() {
    const cw = cv.clientWidth, ch = cv.clientHeight; if (!cw || !ch) return false;
    const d = Math.min(2, devicePixelRatio || 1);
    if (cw !== w || ch !== ht || d !== dpr) { w = cw; ht = ch; dpr = d; cv.width = Math.round(w * dpr); cv.height = Math.round(ht * dpr); base = null; }
    return true;
  }
  // the steps that have landed are kept on a second canvas, and each cell of the step landing now is painted onto it as it lands
  function bake(k: number): CanvasRenderingContext2D {
    if (base && bx && baked === k - 1) return bx;
    if (!base || !bx) { base = canvas(cv.width, cv.height); bx = base.getContext('2d')!; }
    base.width = cv.width; base.height = cv.height; bx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let q = 0; q < k; q++) { const l = LV[q], G = geo(l); for (let n = 0; n < l.css.length; n++) { bx.clearRect(...slot(l, n, G)); bx.fillStyle = l.css[n]; box(bx, l, n, G); } }
    baked = k - 1; LV[k].done = new Uint8Array(LV[k].c * LV[k].r);
    return bx;
  }
  function frame(c: CanvasRenderingContext2D) {
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, ht);
    let k = LV.findIndex(l => t < l.s + l.d); if (k < 0) k = LV.length;
    // the twinkling field, thicker as it goes on, fading out as the first blocks land
    const fade = k === 0 ? cl(1 - (t - LV[0].s) / LV[0].d * 1.4) : 0;
    if (fade > 0) {
      const dens = .08 + .5 * cl(t / SEED), l = { c: 24, r: 16 }, G = geo(l), s = t / 1000;
      if (!R) { c.globalAlpha = .5 * cl(t / 300) * fade; c.fillStyle = LINE; for (let i = 1; i < 24; i++) c.fillRect(snap(i * G.cw), 0, 1 / dpr, ht); for (let j = 1; j < 16; j++) c.fillRect(0, snap(j * G.ch), w, 1 / dpr); }
      for (let n = 0; n < TW.length; n++) {
        const tw = TW[n], a = cl((.5 + .5 * Math.sin(s * tw.w + tw.ph) - (1 - dens)) / dens); if (a < .03) continue;
        c.globalAlpha = cl(a * 2.5) * fade; c.fillStyle = tw.ac ? ACC : LV[2].css[n]; box(c, l, n, G, .3 + .6 * a);
      }
      c.globalAlpha = 1;
    }
    if (t < LV[0].s) return;
    const kk = Math.min(k, LV.length - 1), b = bake(kk), l = LV[kk], G = geo(l), lt = (t - l.s) / l.d;
    // the cells of this step that have landed go onto the kept canvas; the ones landing now are drawn over it
    for (let n = 0; n < l.o.length; n++) { if (l.done[n] || cl((lt - l.o[n] * .72) / .28) < 1) continue; l.done[n] = 1; b.clearRect(...slot(l, n, G)); b.fillStyle = l.css[n]; box(b, l, n, G); }
    c.drawImage(base!, 0, 0, w, ht);
    if (k < LV.length) for (let n = 0; n < l.o.length; n++) {
      if (l.done[n]) continue; const p = cl((lt - l.o[n] * .72) / .28); if (p <= 0) continue;
      const e = out3(p), lift = Math.sin(Math.PI * p) * .32, par = kk ? LV[kk - 1].col[l.par[n]] : null, own = l.col[n];
      const mix = par ? [0, 1, 2].map(q => par[q] + (own[q] - par[q]) * e) : own;
      if (kk) c.clearRect(...slot(l, n, G)); else c.globalAlpha = cl(p * 5);
      c.fillStyle = rgb(mix, lift); box(c, l, n, G, kk ? 1 : .35 + .65 * back(p)); c.globalAlpha = 1;
    }
    // all four steps in and the picture not here yet: a cell here and there lifts and settles while it finishes
    if (k >= LV.length && t > END + 250) { const l3 = LV[3], G3 = geo(l3), s = (t - END - 250) / 1000; for (let n = 0; n < l3.col.length; n += 7) { const a = Math.sin(s * 2.1 + TW[n % TW.length].ph * 3); if (a < .9) continue; c.fillStyle = rgb(l3.col[n], (a - .9) * 3); box(c, l3, n, G3); } }
  }
  /* failing: the picture so far is kept, shaken in bands as it loses its colour, a few cells flash in the error colour, then
     it falls apart cell by cell */
  function glitch(c: CanvasRenderingContext2D, f: Fail) {
    const q = f.t / 520, dz = (f.t - 520) / 460, W = cv.width, H = cv.height, bh = H / 16, cw = W / 24;
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
    if (q < 1) {
      if (f.t - f.roll > 60) { f.roll = f.t; f.dx = f.dx.map(() => rnd() < .15 + .5 * q ? Math.round((rnd() - .5) * 6) * cw : 0); f.hot = Array.from({ length: 3 + (rnd() * 4 | 0) }, () => [rnd() * 24 | 0, rnd() * 16 | 0]); }
      for (let j = 0; j < 16; j++) { c.drawImage(f.snap, 0, j * bh, W, bh, f.dx[j], j * bh, W, bh); c.globalAlpha = cl(q * 1.3); c.drawImage(f.grey, 0, j * bh, W, bh, f.dx[j], j * bh, W, bh); c.globalAlpha = 1; }
      c.fillStyle = BAD; c.globalAlpha = .9 * cl(q * 2); for (const [i, j] of f.hot) c.fillRect(i * cw + 1, j * bh + 1, cw - 2, bh - 2);
    } else for (let n = 0; n < 24 * 16; n++) {
      const p = cl((dz - f.o[n] * .6) / .4), s = 1 - out3(p); if (s <= 0) continue;
      const i = n % 24, j = n / 24 | 0; c.globalAlpha = s; c.drawImage(f.grey, i * cw, j * bh, cw, bh, i * cw + cw * (1 - s) / 2, j * bh + bh * (1 - s) / 2, cw * s, bh * s);
    }
    c.globalAlpha = 1;
  }
  const drawStill = () => {
    if (!fit()) return;
    const l = LV[1], G = geo(l); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, ht);
    for (let n = 0; n < l.css.length; n++) { x.fillStyle = l.css[n]; box(x, l, n, G); }
  };
  // the picture's own colours, if it loads before the first blocks land
  if (src) {
    const im = new Image(); im.crossOrigin = 'anonymous';
    im.onload = () => { if (t >= LV[0].s && !still) return; const px = fromImage(im); if (px) { palette(px); if (still) drawStill(); } };
    im.src = src;
  }
  return {
    get t() { return t; },
    end: END,
    step(dt) {
      if (fail) { fail.t += dt; if (fit()) glitch(x, fail); if (fail.t >= 980 && fail.res) { fail.res(); fail.res = null; } return; }
      t += dt;
      if (fit()) frame(x);
      const p = Math.min(99, Math.floor(cl(t / END) * 100));
      if (p !== pct) { pct = p; onProgress?.(p, t < SEED ? 'Sketching' : t < LV[2].s ? 'Blocking in' : t < END ? 'Refining' : 'Finishing'); }
    },
    fail() {
      if (fail) return fail.p;
      fit();
      const snapC = canvas(cv.width, cv.height); snapC.getContext('2d')?.drawImage(cv, 0, 0);
      const grey = canvas(cv.width, cv.height), gx = grey.getContext('2d');
      if (gx) { gx.drawImage(cv, 0, 0); gx.globalCompositeOperation = 'saturation'; gx.fillStyle = '#808080'; gx.fillRect(0, 0, grey.width, grey.height); gx.globalCompositeOperation = 'destination-in'; gx.drawImage(cv, 0, 0); }
      let res: () => void = () => {};
      const p = new Promise<void>(r => { res = r; });
      fail = { t: 0, roll: -1e9, dx: Array(16).fill(0), hot: [], snap: snapC, grey, o: Array.from({ length: 24 * 16 }, () => rnd()), p, res };
      return p;
    },
    still() { still = true; drawStill(); }
  };
}
