// Measures how big each component gets while it plays, in each style, and writes wall-sizes.json: the landing page's wall
// (tools/pages/src/pages/index.astro) plays each component in its card, framed as its picture frames it (the component,
// 40px round it, at 16:10), at this size, so the component stays whole and in the middle of its card at every moment.
// It plays every component at once on the landing page itself (window.DM_WALL_MEASURE: the rows stand still, each card's
// frame at a component page's width) and keeps the widest and tallest each one shows.
// usage (from tools/site, after a build): node measure-wall.js     needs Playwright: PW=<path to playwright> or npm i playwright
// PLAY=60000 sets how long each style plays (ms); STYLES=clean measures one style and keeps the others as they are.
const fs = require('fs'), path = require('path');
const { chromium } = require(process.env.PW || 'playwright');

const ROOT = path.resolve(__dirname, '../..'), OUT = path.join(__dirname, 'wall-sizes.json');
const STYLES = process.env.STYLES ? process.env.STYLES.split(',') : ['bp', 'soft', 'clean'];
const PLAY = +(process.env.PLAY || 60000), EVERY = 100;

const TYPES = { '.html':'text/html', '.js':'text/javascript', '.json':'application/json', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg', '.woff2':'font/woff2' };
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
  const old = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  const out = {};
  for (const st of ['bp', 'soft', 'clean']) if (!STYLES.includes(st)) out[st] = old[st] || {};
  for (const style of STYLES){
    // wide enough for each row's cards to stand side by side on screen, so every component plays
    const page = await browser.newPage({ viewport: { width: 2800, height: 1200 } });
    await serve(page);
    await page.addInitScript(s => { window.DM_WALL_MEASURE = true; try { localStorage.setItem('dmui-style', s); localStorage.setItem('dmui-theme', 'light'); } catch(e){} }, style);
    await page.goto('http://dm.local/index.html', { waitUntil: 'load' });
    await page.mouse.move(0, 0);
    await page.evaluate(() => document.querySelector('.lp-rows').scrollIntoView({ block: 'center', behavior: 'instant' }));
    const max = await page.evaluate(async ({ PLAY, EVERY }) => {
      await document.fonts.ready;
      const max = {};
      for (let t = 0; t <= PLAY; t += EVERY){
        await new Promise(r => setTimeout(r, EVERY));
        const b = window.dmWallBoxes ? window.dmWallBoxes() : {};
        for (const [reg, [w, h]] of Object.entries(b)){ const m = max[reg] || (max[reg] = [0, 0]); m[0] = Math.max(m[0], w); m[1] = Math.max(m[1], h); }
      }
      return max;
    }, { PLAY, EVERY });
    const n = await page.evaluate(() => new Set([...document.querySelectorAll('.lp-wt')].map(a => a.dataset.reg)).size);
    if (Object.keys(max).length !== n) throw new Error(`${style}: only ${Object.keys(max).length} of ${n} components played`);
    out[style] = Object.fromEntries(Object.keys(max).sort().map(reg => [reg, max[reg]]));
    console.log(`${style}: ${Object.keys(max).length} components`);
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('wrote wall-sizes.json');
})().catch(e => { console.error(e); process.exit(1); });
