// The pictures on the landing page's wall of every component, in each style and theme, 480×300 (shown at 240×150), in
// public/components/wall/<style>-<theme>/<name>.webp, framed the way shots.mjs frames the component pages' thumbnails.
//   node wall.mjs [names]         each component stopped at shots.mjs's moment for it. A page plays 25 components at once,
//                                 each the installed HTML, CSS and JS on the shared core, so the six sets take minutes
//   BEST=1 node wall.mjs names    for a component that moment catches thin (an answer not yet written, a closed picker): it
//                                 plays alone, and its picture is the moment it showed the most text in 40 seconds (the
//                                 answer written, the steps shown, the editor full)
// usage (from tools/pages, after npm run build): PW=$(npm root -g)/playwright [BEST=1] node wall.mjs [names...]
// needs Playwright (PW=<path>, or npm i playwright) and ffmpeg. Take them again after a component's look changes, then build.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { COMPONENTS, FONT_CSS } from './src/lib/data.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '../..');
const { chromium } = createRequire(import.meta.url)(process.env.PW || 'playwright');
const only = process.argv.slice(2), list = COMPONENTS.filter(c => !only.length || only.includes(c.reg));
const OUT = path.join(HERE, 'public/components/wall');

// how much a component says at once: the characters of its visible text (shown, not faded out, with a size), in the page
const METRIC = `window.dmWallMetric = card => { const st = card.querySelector('.stage-in'); if (!st) return 0; const tw = document.createTreeWalker(st, NodeFilter.SHOW_TEXT); let n, sum = 0;
  while ((n = tw.nextNode())){ const t = n.textContent.trim(); if (!t) continue; const e = n.parentElement; if (!e || e.closest('.hand,.tip,template')) continue;
    if (!e.checkVisibility({ checkOpacity:true, checkVisibilityCSS:true })) continue; const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue; sum += t.length; }
  return sum; };`;
// 25 components to a page, so each plays at its own pace and is sampled often; every page has every component's CSS and
// script, for the ones that borrow another's (Agent harness)
const BATCHES = []; for (let i = 0; i < list.length; i += 25) BATCHES.push(list.slice(i, i + 25));
// the moments and the framing shots.mjs uses for the thumbnails, read from it so the two never disagree
const SHOTS = fs.readFileSync(path.join(HERE, 'shots.mjs'), 'utf8');
const WAIT = {};
for (const m of SHOTS.matchAll(/(?:const WAIT = |Object\.assign\(WAIT, )(\{[^;]*?\})\)?;/g)) Object.assign(WAIT, Function('return (' + m[1] + ')')());
const TOP = new Set(Function('return ' + SHOTS.match(/const TOP = new Set\((\[[^\]]*\])\)/)[1])());
const boxAround = (comp, demo, ratio, pad, top = false) => {
  let w = comp.width + pad * 2, h = comp.height + pad * 2;
  if (w / h < ratio) w = h * ratio; else h = w / ratio;
  w = Math.min(w, demo.width); h = Math.min(h, demo.height, w / ratio); w = h * ratio;
  let x = comp.x + comp.width / 2 - w / 2, y = top && h < comp.height + pad * 2 ? comp.y - pad / 2 : comp.y + comp.height / 2 - h / 2;
  x = Math.max(demo.x, Math.min(x, demo.x + demo.width - w)); y = Math.max(demo.y, Math.min(y, demo.y + demo.height - h));
  return { x, y, width:w, height:h };
};

// one page that plays a batch of components, each in a demo laid out as on its own page (ComponentPage.astro), on the site's stage
const page = (style, theme, batch) => `<!doctype html><html lang="en"${style === 'bp' ? '' : ` data-style="${style}"`} data-theme="${theme}"><head><meta charset="utf-8">
<style>${FONT_CSS}</style>
<link rel="stylesheet" href="/components/assets/core.css">
${COMPONENTS.map(c => `<style>${c.html.css}</style>`).join('\n')}
<style>
html,body{margin:0;background:${theme === 'dark' ? '#1c1c1c' : '#fafafa'};${theme === 'dark' ? 'color-scheme:dark;' : ''}font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
:root[data-style="clean"] body{background:var(--dm-stage)}
.cell{width:1056px}
.pg-demo{display:grid;grid-template-columns:minmax(0,1fr);justify-items:center;padding:56px 24px;min-height:max(560px,calc(var(--h-a) + 112px))}
.pg-demo>.card{min-width:0;align-self:stretch;display:grid;place-items:center}
.pg-demo:has(>.card>.stage-in>.dm){padding-bottom:24px}
.pg-demo>.card:has(>.stage-in>.dm){display:flex;flex-direction:column;align-items:stretch}
.pg-demo>.card>.stage-in:has(>.dm){flex:1;display:flex}
.pg-demo>.card>.stage-in>.dm{flex:1}
.pg-demo>.card>.stage-in>.dm>.dm-main{margin-block:auto}
.pg-demo:has(>.card>.stage-in>:is(.acx,.ctb)){padding:0;justify-items:stretch}
.pg-demo>.card:has(>.stage-in>:is(.acx,.ctb)){width:100%;place-items:stretch}
.hand,.tip{visibility:hidden!important}
/* room under the last cell, so every cell can be scrolled to the top of the window */
body{padding-bottom:1400px}
</style></head><body>
${batch.map(c => `<div class="cell" data-reg="${c.reg}"><div class="pg-demo stage-inner" style="--h-a:${c.height[0]}px">${c.html.html}</div></div>`).join('\n')}
<script>window.IntersectionObserver = class { constructor(cb){ this.cb = cb; } observe(el){ setTimeout(() => this.cb([{ target:el, isIntersecting:true, intersectionRatio:1 }], this), 0); } unobserve(){} disconnect(){} takeRecords(){ return []; } };</script>
<script>${METRIC}</script>
<script src="/components/assets/core.js"></script>
${COMPONENTS.map(c => `<script>${c.html.js}</script>`).join('\n')}
</body></html>`;

let current = '';
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg', '.woff2':'font/woff2' };
const server = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/__wall'){ r.writeHead(200, { 'Content-Type':'text/html' }); return r.end(current); }
  const p = path.join(ROOT, u), f = [p, p + '.html', path.join(p, 'index.html')].find(x => x.startsWith(ROOT) && fs.existsSync(x) && fs.statSync(x).isFile());
  if (!f){ r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type':TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
// where a component sits in its cell, framed as shots.mjs frames it, in the window's own coordinates
const frameOf = (tab, reg) => tab.evaluate(reg => {
  const cell = document.querySelector(`.cell[data-reg="${reg}"]`); if (scrollY !== cell.offsetTop) cell.scrollIntoView({ block:'start' });
  const d = cell.querySelector('.pg-demo').getBoundingClientRect(), s = cell.querySelector('.pg-demo .stage-in');
  const k = (s.querySelector('.dm-main') ? [s.querySelector('.dm-main')] : [...s.children]).map(e => e.getBoundingClientRect()).filter(b => b.width && b.height);
  const x = Math.min(...k.map(b => b.left)), y = Math.min(...k.map(b => b.top)), X = Math.max(...k.map(b => b.right)), Y = Math.max(...k.map(b => b.bottom));
  return { demo:{ x:d.x, y:d.y, width:d.width, height:d.height }, comp:{ x, y, width:X - x, height:Y - y } };
}, reg);
const encode = (png, file) => execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'png_pipe', '-i', '-', '-vf', 'scale=480:300:flags=lanczos', '-c:v', 'libwebp', '-quality', '74', file], { input:png });
if (process.env.BEST){
  for (const style of (process.env.STYLES || 'soft,bp,clean').split(',')) for (const theme of (process.env.THEMES || 'light,dark').split(',')){
    const dir = path.join(OUT, `${style}-${theme}`); fs.mkdirSync(dir, { recursive:true });
    for (const c of list){
      current = page(style, theme, [c]);
      const ctx = await browser.newContext({ viewport:{ width:1056, height:1400 }, deviceScaleFactor:2, colorScheme:theme, reducedMotion:'no-preference' });
      const tab = await ctx.newPage();
      await tab.goto(`${base}/__wall`, { waitUntil:'load' }); await tab.evaluate(() => document.fonts.ready);
      await tab.evaluate(() => { const card = document.querySelector('.cell > .pg-demo > .card[data-c]'); DM.mount(card); window.dmWallStart = performance.now(); });
      // every 600ms: when it shows more than ever before (and still does 400ms later, so a fade has run), take its picture
      let best = -1, png = null;
      for (let t = 0; t < 40000; t = await tab.evaluate(() => performance.now() - window.dmWallStart)){
        await tab.waitForTimeout(600);
        const m = await tab.evaluate(() => window.dmWallMetric(document.querySelector('.cell > .pg-demo > .card[data-c]')));
        if (t < 2500 || m <= best) continue;
        await tab.waitForTimeout(400);
        const m2 = await tab.evaluate(() => window.dmWallMetric(document.querySelector('.cell > .pg-demo > .card[data-c]')));
        if (m2 < m) continue;
        const r = await frameOf(tab, c.reg), clip = boxAround(r.comp, r.demo, 16 / 10, 40, TOP.has(c.reg));
        if (!(clip.width > 10 && clip.height > 10)) continue;
        best = m; png = await tab.screenshot({ clip, type:'png' });
      }
      if (png) encode(png, path.join(dir, c.reg + '.webp'));
      console.log(`${style}-${theme} ${c.reg}: ${best} characters of text`);
      await ctx.close();
    }
  }
  await browser.close(); server.close(); process.exit(0);
}
for (const style of (process.env.STYLES || 'soft,bp,clean').split(',')) for (const theme of (process.env.THEMES || 'light,dark').split(',')){
  const dir = path.join(OUT, `${style}-${theme}`); fs.mkdirSync(dir, { recursive:true });
  for (const batch of BATCHES){
  current = page(style, theme, batch);
  const ctx = await browser.newContext({ viewport:{ width:1056, height:1400 }, deviceScaleFactor:2, colorScheme:theme, reducedMotion:'no-preference' });
  const tab = await ctx.newPage();
  const errors = []; tab.on('pageerror', e => errors.push(e.message));
  await tab.goto(`${base}/__wall`, { waitUntil:'load' });
  await tab.evaluate(() => document.fonts.ready);
  // every component starts at once, and each stops at its moment, so the picture holds still; once all have stopped and
  // their last transitions have run, every animation holds still too (a spinner on its frame), so the page stops painting
  // and the pictures are quick to take
  await tab.evaluate(WAIT => new Promise(done => {
    const cards = [...document.querySelectorAll('.cell > .pg-demo > .card[data-c]')];
    cards.forEach(card => DM.mount(card));
    let left = cards.length;
    cards.forEach(card => setTimeout(() => { if (card._c) card._c.stop(); if (!--left) setTimeout(() => { document.getAnimations().forEach(a => a.pause()); done(); }, 900); }, WAIT[card.closest('.cell').dataset.reg] || 6000));
  }), WAIT);
  for (const c of batch){
    const r = await frameOf(tab, c.reg), clip = boxAround(r.comp, r.demo, 16 / 10, 40, TOP.has(c.reg));
    if (!(clip.width > 10 && clip.height > 10)){ console.log(`${style} ${theme}: ${c.reg} drew nothing to picture`); continue; }
    encode(await tab.screenshot({ clip, type:'png' }), path.join(dir, c.reg + '.webp'));
  }
  if (errors.length) console.log(`${style} ${theme}: page errors: ${errors.slice(0, 3).join(' | ')}`);
  await ctx.close();
  }
  console.log(`${style}-${theme}: ${list.length} pictures`);
}
await browser.close(); server.close();
