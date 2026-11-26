// The site's share image, og.png at the root of the repository (1200×630): the picture X, Slack and the rest show for a link to
// the landing page or the library. It is rendered from the site itself, so it never shows a component as it used to be: the
// count and the title on the left, and a wall of real agent components on the right and below, each the installed HTML, CSS
// and JS on the shared core (as on a component page), in Blueprint dark, stopped at a moment that shows it whole.
// usage (from tools/pages, after npm run build): PW=$(npm root -g)/playwright node og.mjs     needs Playwright and ffmpeg
// Run it again when the count changes or a component on it changes its look.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { COMPONENTS, SECTIONS, SPLIT, FONT_CSS, LOGO } from './src/lib/data.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '../..');
const { chromium } = createRequire(import.meta.url)(process.env.PW || 'playwright');
const W = 1200, H = 630, SCALE = .72;
const total = COMPONENTS.length, agents = SECTIONS.filter(s => s.kind === 'agent').reduce((n, s) => n + s.cards.length, 0);

// the wall: columns of components, each column at its own x and starting height (page pixels before the wall is scaled),
// and each component stopped at a moment that shows it whole (ms after it starts; shots.mjs picks the same moments)
const COLS = [
  { x:40, y:560, items:[['trace-view', 11500]] },
  { x:930, y:10, items:[['agent-tree', 12000], ['permission-gate', 4200], ['run-cost', 6000]] },
  { x:1394, y:64, items:[['context-meter', 10500], ['live-answer', 6500]] },
];
const reg = name => {
  const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'r', name + '.json'), 'utf8'));
  const f = ext => (d.files.find(x => x.path.endsWith(ext)) || {}).content || '';
  return { name, html:f('.html'), css:f('.css'), js:f('.js') };
};
const items = COLS.flatMap(c => c.items.map(([n]) => reg(n)));
const page = `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8">
<style>${FONT_CSS}</style>
<link rel="stylesheet" href="/components/assets/core.css">
${items.map(x => `<style>${x.css}</style>`).join('\n')}
<style>
html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#111111;color-scheme:dark}
body{position:relative;font:14px/1.5 Inter,ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased;
  background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:24px 24px;background-position:-1px -1px}
.wall{position:absolute;left:0;top:0;width:${Math.ceil(W / SCALE)}px;height:${Math.ceil(H / SCALE)}px;transform:scale(${SCALE});transform-origin:0 0}
.col{position:absolute;display:flex;flex-direction:column;gap:24px}
.col>.stage-inner{display:grid;place-items:start}
.hand,.tip{display:none!important}
.hd{position:absolute;left:56px;top:52px;width:640px;color:#f2f2f2}
.L{display:block;height:24px;width:auto;overflow:visible}
.L .cons{display:none}.L .wm{fill:currentColor}.L .dev{fill:var(--dm-accent-fg)}
.kick{display:inline-flex;align-items:center;gap:10px;margin-top:36px;padding:6px 12px;border-radius:2px;background:#1c1c1c;box-shadow:inset 0 0 0 1px #333;color:#c9c9c9;font-size:18px;line-height:24px;font-weight:500}
.kick i{width:5px;height:5px;background:var(--dm-accent)}
h1{margin:22px 0 0;font-size:54px;line-height:1.06;font-weight:500;letter-spacing:-.035em;color:#f2f2f2;text-wrap:balance}
.sub{margin:16px 0 0;font-size:19px;line-height:1.45;color:#c9c9c9}
</style></head><body>
<div class="wall">${COLS.map((c, i) => `<div class="col" style="left:${c.x}px;top:${c.y}px">${c.items.map(([n]) => `<div class="stage-inner">${items.find(x => x.name === n).html}</div>`).join('')}</div>`).join('')}</div>
<div class="hd">${LOGO}
  <div class="kick">Free<i></i>MIT<i></i>${total} components</div>
  <h1>UI components for the AI agents in your product</h1>
  <p class="sub">${SPLIT ? `${agents} for the agent itself, in` : 'In'} HTML, React or Astro.</p>
</div>
<script src="/components/assets/core.js"></script>
${items.map(x => `<script>${x.js}</script>`).join('\n')}
</body></html>`;

// the repository as Cloudflare Pages serves it, and the composition at /__og
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg', '.woff2':'font/woff2' };
const server = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/__og'){ r.writeHead(200, { 'Content-Type':'text/html' }); return r.end(page); }
  const p = path.join(ROOT, u), f = [p, p + '.html', path.join(p, 'index.html')].find(x => x.startsWith(ROOT) && fs.existsSync(x) && fs.statSync(x).isFile());
  if (!f){ r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type':TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{ width:W, height:H }, deviceScaleFactor:2, colorScheme:'dark' });
const tab = await ctx.newPage();
const errors = []; tab.on('pageerror', e => errors.push(e.message)); tab.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await tab.goto(`${base}/__og`, { waitUntil:'load' });
await tab.evaluate(() => document.fonts.ready);
// every component starts at once, and each stops where it shows itself whole
const stops = Object.fromEntries(COLS.flatMap(c => c.items));
await tab.evaluate(stops => new Promise(done => {
  const cards = [...document.querySelectorAll('.wall [data-c]')];
  cards.forEach(card => DM.mount(card));
  let left = cards.length;
  cards.forEach(card => setTimeout(() => { if (card._c) card._c.stop(); if (!--left) setTimeout(done, 800); }, stops[card.dataset.c]));
}), stops);
if (errors.length) throw new Error('the share image page has errors: ' + errors.join(' | '));
const png = await tab.screenshot({ type:'png' });
const out = path.resolve(ROOT, process.env.OUT || 'og.png');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'png_pipe', '-i', '-', '-vf', `scale=${W}:${H}:flags=lanczos`, out], { input:png });
await browser.close(); server.close();
console.log(`${path.relative(ROOT, out)}: ${total} components, ${agents} for the agent; ${COLS.flatMap(c => c.items.map(([n]) => n)).join(', ')}`);
