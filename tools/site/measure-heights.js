// Measures how tall each card's stage gets while its component plays, and writes card-heights.json, which build.js turns
// into a min-height per card so nothing below a card moves as its component starts or grows.
// Each band of screen widths is measured at its narrowest width, where components wrap the most, in both styles.
// usage (from tools/site, after a build): node measure-heights.js     needs Playwright: PW=<path to playwright> or npm i playwright
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require(process.env.PW || 'playwright');

const ROOT = path.resolve(__dirname, '../..');
// the bands build.js writes: --rh-a for 1400px and wider, --rh-b down to 1181px, and so on
const BANDS = [['a', 1440], ['b', 1181], ['c', 961], ['d', 641], ['e', 390]];
const STYLES = ['bp', 'soft'];
const PLAY = 24000, EVERY = 200;

const TYPES = { '.html':'text/html', '.js':'text/javascript', '.json':'application/json', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.woff2':'font/woff2' };
const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch();
  // the stage keeps the taller of the two styles; the component's own height is kept per style, so each sits centred
  const out = {}, outHost = {}, outBp = {};
  for (const [band, width] of BANDS) for (const style of STYLES){
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.addInitScript(s => { try { localStorage.setItem('dmui-style', s === 'soft' ? 'soft' : 'blueprint'); localStorage.setItem('dmui-theme', 'light'); } catch(e){} }, style);
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const got = await page.evaluate(async ({ PLAY, EVERY }) => {
      // the heights the site would give each stage without these numbers (some cards ask for more than the 420px default)
      const reserved = document.getElementById('card-heights'); if (reserved) reserved.disabled = true;
      // both sets of cards, Agent components and App basics, are laid out while they're measured
      document.documentElement.classList.add('grp-all');
      const comps = [...document.querySelectorAll('.lib-sec .comp[data-v2]')];
      const base = new Map(comps.map(c => [c, parseFloat(getComputedStyle(c.querySelector(':scope>.stage')).minHeight) || 0]));
      // then each stage at its own height: no minimum, and not stretched to match the card beside it
      const st = document.createElement('style');
      st.textContent = '.lib-sec .grid{align-items:start!important}.lib-sec .comp>.stage{min-height:0!important;flex:none!important}';
      document.head.appendChild(st);
      comps.forEach(c => window.V2.replay(c));
      // the stage's height, and the component's own: the component keeps its tallest size inside the stage, so it grows
      // downwards instead of creeping up as it plays
      const max = new Map(), hmax = new Map();
      for (let t = 0; t <= PLAY; t += EVERY){
        comps.forEach(c => { const h = c.querySelector(':scope>.stage').getBoundingClientRect().height; if (h > (max.get(c) || 0)) max.set(c, h);
          // the component's height is everything it draws below its top, open lists and popovers included, so its tallest
          // moment fits the stage and sits centred in it
          const sin = c.querySelector('.v2.stage-in'), top = sin.getBoundingClientRect().top; let bot = sin.getBoundingClientRect().bottom;
          for (const e of sin.querySelectorAll('*')){
            if (e.closest('svg') && e.tagName !== 'svg') continue;
            const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0 || e.closest('.pop:not(.open),.hand')) continue;
            const b = e.getBoundingClientRect(); if (b.width >= 1 && b.height >= 1 && b.bottom > bot) bot = b.bottom;
          }
          const hh = bot - top; if (hh > (hmax.get(c) || 0)) hmax.set(c, hh);
          // and the stage around it keeps its padding above and below
          const inner = c.querySelector('.stage-inner'), ics = getComputedStyle(inner), need = hh + parseFloat(ics.paddingTop) + parseFloat(ics.paddingBottom);
          if (need > (max.get(c) || 0)) max.set(c, need); });
        await new Promise(r => setTimeout(r, EVERY));
      }
      return Object.fromEntries(comps.map(c => [c.dataset.v2, [Math.ceil(Math.max(max.get(c), base.get(c))), Math.ceil(hmax.get(c))]]));
    }, { PLAY, EVERY });
    for (const [id, [h, hh]] of Object.entries(got)){ const o = out[id] || (out[id] = {}), host = style === 'bp' ? outBp : outHost, oh = host[id] || (host[id] = {}); o[band] = Math.max(o[band] || 0, h); oh[band] = Math.max(oh[band] || 0, hh); }
    console.log(`${band} ${width}px ${style}: ${Object.keys(got).length} cards`);
    await page.close();
  }
  await browser.close(); server.close();
  const sorted = (o) => Object.fromEntries(Object.keys(o).sort().map(id => [id, BANDS.map(([b]) => o[id][b])]));
  fs.writeFileSync(path.join(__dirname, 'card-heights.json'), JSON.stringify({ bands: BANDS, heights: sorted(out), components: sorted(outHost), componentsBp: sorted(outBp) }, null, 1) + '\n');
  console.log('wrote card-heights.json');
})().catch(e => { console.error(e); process.exit(1); });
