// Measures how tall each card in the landing page's bento gets while its component plays, at the bento's own widths, in
// all three styles, and writes bento-heights.json. The landing page (tools/pages/src/pages/index.astro) gives each card
// that height, so a card never moves the cards under it, and its component sits centred in it at every moment.
// usage (from tools/site, after a build): node measure-bento.js     needs Playwright: PW=<path to playwright> or npm i playwright
// PLAY=60000 sets how long each page plays (ms); STYLES=clean measures one style and keeps the others as they are.
const fs = require('fs'), path = require('path');
const { chromium } = require(process.env.PW || 'playwright');

const ROOT = path.resolve(__dirname, '../..'), OUT = path.join(__dirname, 'bento-heights.json');
// each band is measured at its narrowest width, where a card is narrowest and its component wraps the most:
// a 1440 and wider (three stacks, the bento at its widest), b 1100 to 1439 (two stacks), c 768 to 1099 (one, 720px wide),
// d 641 to 767, then the phones: e 520 to 640, f 430 to 519, g 390 to 429, h below 390
const BANDS = [['a', 1440], ['b', 1100], ['c', 768], ['d', 641], ['e', 520], ['f', 430], ['g', 390], ['h', 360]];
const STYLES = process.env.STYLES ? process.env.STYLES.split(',') : ['bp', 'soft', 'clean'];
const PLAY = +(process.env.PLAY || 60000), EVERY = 100;

const TYPES = { '.html':'text/html', '.js':'text/javascript', '.json':'application/json', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.woff2':'font/woff2' };
// the repository is served to the browser from disk: requests to http://dm.local/ are answered with its files
const serve = page => page.route('**/*', route => {
  const u = new URL(route.request().url());
  if (u.host !== 'dm.local') return route.abort();
  let file = path.join(ROOT, decodeURIComponent(u.pathname).replace(/\/$/, '/index.html'));
  if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return route.fulfill({ status: 404, body: '' });
  return route.fulfill({ status: 200, contentType: TYPES[path.extname(file)] || 'application/octet-stream', body: fs.readFileSync(file) });
});

(async () => {
  const browser = await chromium.launch(process.env.PW_EXEC ? { executablePath: process.env.PW_EXEC } : {});
  const old = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : null;
  const out = { bands: BANDS };
  for (const st of ['bp', 'soft', 'clean']) if (!STYLES.includes(st)){
    if (!old || old.bands.map(x => x.join()).join() !== BANDS.map(x => x.join()).join()) throw new Error('bento-heights.json has other bands: measure every style');
    out[st] = old[st];
  }
  const jobs = []; for (const style of STYLES) for (const [band, width] of BANDS) jobs.push({ style, band, width });
  const got = {};
  const run = async ({ style, band, width }) => {
    // tall enough for every card to be on screen, so all of them load and play together
    const page = await browser.newPage({ viewport: { width, height: width >= 1100 ? 2800 : 9000 } });
    await serve(page);
    await page.addInitScript(s => { try { localStorage.setItem('dmui-style', s); localStorage.setItem('dmui-theme', 'light'); } catch(e){} }, style);
    await page.goto('http://dm.local/index.html', { waitUntil: 'load' });
    await page.mouse.move(0, 0);
    const h = await page.evaluate(async ({ PLAY, EVERY }) => {
      await document.fonts.ready;
      const max = {};
      for (let t = 0; t <= PLAY; t += EVERY){
        await new Promise(r => setTimeout(r, EVERY));
        document.querySelectorAll('.lp-bt .lp-bc').forEach(b => { const c = b.querySelector(':scope>.card'); if (!c) return;
          const v = c.getBoundingClientRect().height; if (v > (max[b.dataset.reg] || 0)) max[b.dataset.reg] = v; });
      }
      return max;
    }, { PLAY, EVERY });
    const n = page.evaluate(() => document.querySelectorAll('.lp-bt').length);
    if (Object.keys(h).length !== await n) throw new Error(`${style} ${width}px: only ${Object.keys(h).length} cards loaded`);
    for (const [reg, v] of Object.entries(h)) ((got[style] || (got[style] = {}))[reg] || (got[style][reg] = {}))[band] = Math.ceil(v);
    console.log(`${style} ${band} ${width}px: ${Object.keys(h).length} cards`);
    await page.close();
  };
  const q = jobs.slice();
  await Promise.all([0, 1, 2, 3].map(async () => { for (;;){ const j = q.shift(); if (!j) return; await run(j); } }));
  await browser.close();
  // from c down, the bento is one stack and each band is narrower than the one before, so a card never keeps less room
  // than it does in a wider band (a demo that didn't reach its tallest moment in one run still gets it)
  const one = BANDS.findIndex(([b]) => b === 'c');
  for (const st of STYLES) out[st] = Object.fromEntries(Object.keys(got[st]).sort().map(reg => [reg, BANDS.map(([b]) => got[st][reg][b])
    .map((v, i, r) => i > one ? Math.max(...r.slice(one, i + 1)) : v)]));
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('wrote bento-heights.json');
})().catch(e => { console.error(e); process.exit(1); });
