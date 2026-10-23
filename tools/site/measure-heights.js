// Measures how tall each card's stage gets while its component plays, and writes card-heights.json, which build.js turns
// into a min-height per card so nothing below a card moves as its component starts or grows.
// Each band of screen widths is measured at its narrowest width, where components wrap the most, in both styles.
// usage (from tools/site, after a build): node measure-heights.js     needs Playwright: PW=<path to playwright> or npm i playwright
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require(process.env.PW || 'playwright');

const ROOT = path.resolve(__dirname, '../..');
// the bands build.js writes: --rh-a for 1400px and wider, --rh-b down to 1181px, and so on. Phones get four, because a
// component wraps more on every narrower phone: measured at one width only, it sat off-centre on the others
// Tablets get six for the same reason: the wide cards keep growing until about 880px, and an iPad held upright is 744, 768,
// 820 or 834px wide
const BANDS = [['a', 1440], ['b', 1181], ['c', 961], ['d', 880], ['e', 834], ['f', 820], ['g', 768], ['h', 744], ['i', 641], ['j', 520], ['k', 430], ['l', 390], ['m', 360]];
// ONLY=d,e measures just those bands and keeps the rest from card-heights.json as it is
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
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
  // PW_EXEC points at a Chromium of your own, if Playwright's isn't installed
  const browser = await chromium.launch(process.env.PW_EXEC ? { executablePath: process.env.PW_EXEC } : {});
  const spill = [];
  // the stage keeps the taller of the two styles; the component's own height is kept per style, so each sits centred
  const out = {}, outHost = {}, outBp = {};
  if (ONLY){
    const old = JSON.parse(fs.readFileSync(path.join(__dirname, 'card-heights.json'), 'utf8'));
    BANDS.forEach(([b], i) => { if (ONLY.includes(b)) return; const j = old.bands.findIndex(([ob, ow]) => ob === b && ow === BANDS[i][1]); if (j < 0) throw new Error(`band ${b} isn't in card-heights.json: measure it too`);
      for (const [all, key] of [[out, 'heights'], [outHost, 'components'], [outBp, 'componentsBp']]) for (const id in old[key]) (all[id] || (all[id] = {}))[b] = old[key][id][j]; });
  }
  for (const [band, width] of BANDS) for (const style of STYLES){
    if (ONLY && !ONLY.includes(band)) continue;
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.addInitScript(s => { try { localStorage.setItem('dmui-style', s === 'soft' ? 'soft' : 'blueprint'); localStorage.setItem('dmui-theme', 'light'); } catch(e){} }, style);
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    // entrances (a fade up of a few pixels) play eight times as fast, so a component isn't measured taller than it gets
    // while its parts are still sliding into place; the story's own timers keep their pace
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Animation.enable'); await cdp.send('Animation.setPlaybackRate', { playbackRate: 8 });
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
      const max = new Map(), hmax = new Map(), out = new Map();
      for (let t = 0; t <= PLAY; t += EVERY){
        // the first look is a moment after the start, once the first frame has played
        await new Promise(r => setTimeout(r, EVERY));
        comps.forEach(c => { const h = c.querySelector(':scope>.stage').getBoundingClientRect().height; if (h > (max.get(c) || 0)) max.set(c, h);
          // the component's height is everything it draws below its top, open lists and popovers included, so its tallest
          // moment fits the stage and sits centred in it
          const sin = c.querySelector('.v2.stage-in'), top = sin.getBoundingClientRect().top; let bot = sin.getBoundingClientRect().bottom;
          // and anything that reaches above the component or past the sides of its stage, which the stage would cut off
          const sb = c.querySelector('.stage-inner').getBoundingClientRect(), o = out.get(c) || { up:0, side:0 };
          for (const e of sin.querySelectorAll('*')){
            if (e.closest('svg') && e.tagName !== 'svg') continue;
            const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0 || e.closest('.pop:not(.open),.hand')) continue;
            const b = e.getBoundingClientRect(); if (b.width < 1 || b.height < 1) continue;
            if (b.bottom > bot) bot = b.bottom;
            // (a part its own box cuts off, like a scanning beam or a scrolled list, doesn't count)
            let sc = false; for (let a = e.parentElement; a && a !== sin; a = a.parentElement){ const s = getComputedStyle(a); if (/(auto|scroll|hidden|clip)/.test(s.overflowX + s.overflowY)){ sc = true; break; } }
            if (!sc){ o.up = Math.max(o.up, top - b.top); o.side = Math.max(o.side, sb.left - b.left, b.right - sb.right); }
          }
          out.set(c, o);
          const hh = bot - top; if (hh > (hmax.get(c) || 0)) hmax.set(c, hh);
          // and the stage around it keeps its padding above and below
          const inner = c.querySelector('.stage-inner'), ics = getComputedStyle(inner), need = hh + parseFloat(ics.paddingTop) + parseFloat(ics.paddingBottom);
          if (need > (max.get(c) || 0)) max.set(c, need); });
      }
      return Object.fromEntries(comps.map(c => [c.dataset.v2, [Math.ceil(Math.max(max.get(c), base.get(c))), Math.ceil(hmax.get(c)), Math.round(out.get(c).up), Math.round(out.get(c).side)]]));
    }, { PLAY, EVERY });
    for (const [id, [h, hh, up, side]] of Object.entries(got)){
      if (up > 1 || side > 1) spill.push(`${id} at ${width}px in ${style}: ${up > 1 ? up + 'px above its top ' : ''}${side > 1 ? side + 'px past a side of its stage' : ''}`);
      const o = out[id] || (out[id] = {}), host = style === 'bp' ? outBp : outHost, oh = host[id] || (host[id] = {}); o[band] = Math.max(o[band] || 0, h); oh[band] = Math.max(oh[band] || 0, hh); }
    console.log(`${band} ${width}px ${style}: ${Object.keys(got).length} cards`);
    await page.close();
  }
  await browser.close(); server.close();
  const sorted = (o) => Object.fromEntries(Object.keys(o).sort().map(id => [id, BANDS.map(([b]) => o[id][b])]));
  fs.writeFileSync(path.join(__dirname, 'card-heights.json'), JSON.stringify({ bands: BANDS, heights: sorted(out), components: sorted(outHost), componentsBp: sorted(outBp) }, null, 1) + '\n');
  console.log('wrote card-heights.json');
  if (spill.length) console.log('Reaching outside the component (check these fit their stage):\n  ' + spill.join('\n  '));
})().catch(e => { console.error(e); process.exit(1); });
