// The landing page's bento (src/pages/index.astro): each component is its own card there, as wide as its stack, so how tall
// it gets is its own, not what the library measured in its stages. This plays every card on the landing page at the widths
// each layout of the bento has (both ends of a layout, where a stack's width changes with the window), in each style, and
// writes the most each one drew below its top, open lists and popovers included, to data/bento-heights.json. The page keeps
// that much room for each card, so nothing below it moves while it plays.
// usage (from tools/pages, after npm run build): PW=$(npm root -g)/playwright node bento.mjs, then build again
//   VERIFY=1 node bento.mjs   plays the page as built instead, and reports any card whose place grew or that reached past it
// needs Playwright (PW=<path>, or npm i playwright). Measure again when a component in the bento changes its look or its demo.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '../..');
const { chromium } = createRequire(import.meta.url)(process.env.PW || 'playwright');
// the layouts, as index.astro has them, and the widths each is measured at
const TIERS = [['t3', [1440]], ['t2', [1100, 1439]], ['t1', [641, 1099]], ['j', [520, 640]], ['k', [430, 519]], ['l', [390, 429]], ['m', [360, 389]]];
const STYLES = ['bp', 'soft', 'clean'], PLAY = +(process.env.PLAY || 24000), EVERY = 250, VERIFY = !!process.env.VERIFY;
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.json':'application/json', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg', '.woff2':'font/woff2' };
// the repository is served to the browser from disk: requests to http://dm.local/ are answered with its files (the templates'
// frame is left out, as it plays nothing in the bento), and anything else is left unanswered
const serve = page => page.route('**/*', route => {
  const u = new URL(route.request().url());
  if (u.host !== 'dm.local' || u.pathname.startsWith('/templates/')) return route.abort();
  const file = path.join(ROOT, decodeURIComponent(u.pathname).replace(/\/$/, '/index.html'));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return route.fulfill({ status:404, body:'' });
  return route.fulfill({ status:200, contentType:TYPES[path.extname(file)] || 'application/octet-stream', body:fs.readFileSync(file) });
});

const browser = await chromium.launch(process.env.PW_EXEC ? { executablePath:process.env.PW_EXEC } : {});
const out = {}, problems = [];
const jobs = []; for (const [tier, widths] of TIERS) for (const width of widths) for (const style of STYLES) jobs.push({ tier, width, style });
const worker = async () => { while (jobs.length){ const { tier, width, style } = jobs.shift();
  const page = await browser.newPage({ viewport:{ width, height:900 } });
  await serve(page);
  await page.addInitScript(() => { window.DM_NO_IDLE = true; });
  // every card counts as on screen, so each demo plays to its tallest moment
  await page.addInitScript(() => { window.IntersectionObserver = class { constructor(cb){ this.cb = cb; } observe(el){ setTimeout(() => this.cb([{ target:el, isIntersecting:true, intersectionRatio:1 }], this), 0); } unobserve(){} disconnect(){} takeRecords(){ return []; } }; });
  await page.addInitScript(s => { try { localStorage.setItem('dmui-style', s === 'bp' ? 'blueprint' : s); localStorage.setItem('dmui-theme', 'light'); } catch(e){} }, style);
  await page.goto('http://dm.local/index.html', { waitUntil:'load' });
  await page.evaluate(() => document.fonts.ready);
  // entrances play eight times as fast, so a card isn't measured taller than it gets while its parts slide into place
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Animation.enable'); await cdp.send('Animation.setPlaybackRate', { playbackRate:8 });
  const got = await page.evaluate(async ({ PLAY, EVERY, VERIFY }) => {
    // measured at their own height: no room kept for them
    if (!VERIFY){ const st = document.createElement('style'); st.textContent = '.lp-bt,.lp .lp-bt .lp-bc{min-height:0!important}'; document.head.appendChild(st); }
    await new Promise(r => setTimeout(r, 600));
    const tiles = [...document.querySelectorAll('.lp-bt')], max = new Map(), seen = new Map(), bad = [];
    const reach = box => { const top = box.getBoundingClientRect().top; let bot = box.getBoundingClientRect().bottom;
      for (const e of box.querySelectorAll('*')){
        if (e.closest('svg') && e.tagName !== 'svg') continue;
        const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0 || e.closest('.pop:not(.open),.hand')) continue;
        const b = e.getBoundingClientRect(); if (b.width < 1 || b.height < 1) continue;
        // a part its own box cuts off (a scrolled list, a clipped beam) reaches only as far down as that box
        let cut = Infinity; for (let a = e.parentElement; a && a !== box; a = a.parentElement){ const s = getComputedStyle(a); if (/(auto|scroll|hidden|clip)/.test(s.overflowX + s.overflowY)) cut = Math.min(cut, a.getBoundingClientRect().bottom); }
        bot = Math.max(bot, Math.min(b.bottom, cut));
      }
      return bot - top; };
    for (let t = 0; t <= PLAY; t += EVERY){
      await new Promise(r => setTimeout(r, EVERY));
      tiles.forEach(tile => { const box = tile.querySelector('.lp-bc'), reg = box.dataset.reg, h = reach(box);
        if (h > (max.get(reg) || 0)) max.set(reg, h);
        if (VERIFY){ const th = tile.getBoundingClientRect().height, f = tile.querySelector('.lp-bt-f').getBoundingClientRect(), tb = tile.getBoundingClientRect();
          const s = seen.get(reg) || { min:th, max:th }; s.min = Math.min(s.min, th); s.max = Math.max(s.max, th); seen.set(reg, s);
          if (tb.top + h + 36 > tb.bottom + 1) bad.push(`${reg} reached ${Math.round(tb.top + h + 36 - tb.bottom)}px past its place`); } });
    }
    if (VERIFY) seen.forEach((s, reg) => { if (s.max - s.min > .5) bad.push(`${reg}'s place grew ${Math.round(s.min)}-${Math.round(s.max)}px`); });
    return { heights:Object.fromEntries([...max].map(([k, v]) => [k, Math.ceil(v)])), bad:[...new Set(bad)] };
  }, { PLAY, EVERY, VERIFY });
  for (const [reg, h] of Object.entries(got.heights)){ const o = ((out[reg] || (out[reg] = {}))[style] || (out[reg][style] = {})); o[tier] = Math.max(o[tier] || 0, h); }
  got.bad.forEach(b => problems.push(`${style} ${width}: ${b}`));
  console.log(`${tier} ${width}px ${style}: ${Object.keys(got.heights).length} cards${got.bad.length ? ', ' + got.bad.length + ' problem(s)' : ''}`);
  await page.close();
} };
await Promise.all(Array.from({ length:+(process.env.N || 3) }, worker));
await browser.close();
if (VERIFY){ console.log(problems.length ? problems.join('\n') : 'every card stayed inside its place, and no place grew'); process.exit(problems.length ? 1 : 0); }
const file = path.join(HERE, 'data/bento-heights.json');
fs.writeFileSync(file, JSON.stringify({ tiers:TIERS, heights:Object.fromEntries(Object.keys(out).sort().map(k => [k, out[k]])) }, null, 1) + '\n');
console.log('wrote', path.relative(ROOT, file));
