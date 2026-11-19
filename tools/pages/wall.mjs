// The pictures on the landing page's wall of every component: each component as it looks once its demo has played, in each
// style and theme, 480×300 (shown at 240×150), in public/components/wall/<style>-<theme>/<name>.webp. They are taken the
// way shots.mjs takes the component pages' thumbnails (the same moments and the same framing), but from one page per style
// and theme that plays every component at once, each the installed HTML, CSS and JS on the shared core, so the six sets
// take minutes rather than hours.
// usage (from tools/pages, after npm run build): PW=$(npm root -g)/playwright node wall.mjs [names...]
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

// one page that plays every component, each in a demo laid out as on its own page (ComponentPage.astro), on the site's stage
const page = (style, theme) => `<!doctype html><html lang="en"${style === 'bp' ? '' : ` data-style="${style}"`} data-theme="${theme}"><head><meta charset="utf-8">
<style>${FONT_CSS}</style>
<link rel="stylesheet" href="/components/assets/core.css">
${list.map(c => `<style>${c.html.css}</style>`).join('\n')}
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
${list.map(c => `<div class="cell" data-reg="${c.reg}"><div class="pg-demo stage-inner" style="--h-a:${c.height[0]}px">${c.html.html}</div></div>`).join('\n')}
<script>window.IntersectionObserver = class { constructor(cb){ this.cb = cb; } observe(el){ setTimeout(() => this.cb([{ target:el, isIntersecting:true, intersectionRatio:1 }], this), 0); } unobserve(){} disconnect(){} takeRecords(){ return []; } };</script>
<script src="/components/assets/core.js"></script>
${list.map(c => `<script>${c.html.js}</script>`).join('\n')}
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
for (const style of (process.env.STYLES || 'soft,bp,clean').split(',')) for (const theme of (process.env.THEMES || 'light,dark').split(',')){
  current = page(style, theme);
  const dir = path.join(OUT, `${style}-${theme}`); fs.mkdirSync(dir, { recursive:true });
  const ctx = await browser.newContext({ viewport:{ width:1056, height:1400 }, deviceScaleFactor:2, colorScheme:theme, reducedMotion:'no-preference' });
  const tab = await ctx.newPage();
  const errors = []; tab.on('pageerror', e => errors.push(e.message));
  await tab.goto(`${base}/__wall`, { waitUntil:'load' });
  await tab.evaluate(() => document.fonts.ready);
  // every component starts at once, and each stops at the moment its thumbnail shows, so the picture holds still
  await tab.evaluate(WAIT => new Promise(done => {
    const cards = [...document.querySelectorAll('.cell > .pg-demo > .card[data-c]')];
    cards.forEach(card => DM.mount(card));
    let left = cards.length;
    // once all have stopped and their last transitions have run, every animation holds still too (a spinner on its frame),
    // so the page stops painting and the pictures are quick to take
    cards.forEach(card => setTimeout(() => { if (card._c) card._c.stop(); if (!--left) setTimeout(() => { document.getAnimations().forEach(a => a.pause()); done(); }, 900); }, WAIT[card.closest('.cell').dataset.reg] || 6000));
  }), WAIT);
  for (const c of list){
    const r = await tab.evaluate(reg => {
      const cell = document.querySelector(`.cell[data-reg="${reg}"]`); cell.scrollIntoView({ block:'start' });
      const d = cell.querySelector('.pg-demo').getBoundingClientRect(), s = cell.querySelector('.pg-demo .stage-in');
      const k = (s.querySelector('.dm-main') ? [s.querySelector('.dm-main')] : [...s.children]).map(e => e.getBoundingClientRect()).filter(b => b.width && b.height);
      const x = Math.min(...k.map(b => b.left)), y = Math.min(...k.map(b => b.top)), X = Math.max(...k.map(b => b.right)), Y = Math.max(...k.map(b => b.bottom));
      // in the window's own coordinates: the cell is at its top, and the picture is taken of what the window shows
      const box = b => ({ x:b.x, y:b.y, width:b.width, height:b.height });
      return { demo:box(d), comp:box({ x, y, width:X - x, height:Y - y }) };
    }, c.reg);
    const clip = boxAround(r.comp, r.demo, 16 / 10, 40, TOP.has(c.reg));
    if (!(clip.width > 10 && clip.height > 10)){ console.log(`${style} ${theme}: ${c.reg} drew nothing to picture`); continue; }
    const png = await tab.screenshot({ clip, type:'png' });
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'png_pipe', '-i', '-', '-vf', 'scale=480:300:flags=lanczos', '-c:v', 'libwebp', '-quality', '74', path.join(dir, c.reg + '.webp')], { input:png });
  }
  if (errors.length) console.log(`${style} ${theme}: page errors: ${errors.slice(0, 3).join(' | ')}`);
  await ctx.close();
  console.log(`${style}-${theme}: ${list.length} pictures`);
}
await browser.close(); server.close();
