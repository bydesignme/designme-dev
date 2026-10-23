// Pictures of every component, taken from its own page once its demo has played, in the Soft style:
//   public/components/thumbs/<name>-light.webp and -dark.webp   640×400, for the cards on section and component pages
//   public/components/og/<name>.jpg                              1200×630, the picture a shared link shows
// usage (from tools/pages, after npm run build): PW=$(npm root -g)/playwright node shots.mjs [names...]
// needs Playwright (PW=<path>, or npm i playwright) and ffmpeg. Run it again after a component's look changes, then build.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '../..');
const { chromium } = createRequire(import.meta.url)(process.env.PW || 'playwright');
const site = JSON.parse(fs.readFileSync(path.join(HERE, 'data/site.json'), 'utf8'));
const only = process.argv.slice(2);
const names = site.sections.flatMap(s => s.cards.map(c => c.reg)).filter(n => !only.length || only.includes(n));
// most demos have settled after 6 seconds; these cycle, so they are taken at a moment that shows them whole. The longer
// stories are taken at the end that tells them: Design review once approved, Model picker once Sonnet on high is set,
// and Answer action bar on its second version, Inline text diff while the edit the agent isn't sure of says why, Agent tree
// once the run is done, folded and summed up, and Agent inbox with the publish approved and the failed export still waiting for Retry.
// Voice orb is taken while the agent answers, Prompt library once every blank is filled in, Steering once the run is done with
// your change in it, and Eval results with the run in and the price check failing. Knowledge sources is taken with the scanned PDF
// failed and offering OCR while the new website indexes, and Scheduled runs with the design QA running beside the failed token sync.
// Segmented control shows the month, OTP field the verified code, and Multi-select its list open with two tags picked.
// Profile menu is taken open on Acme Labs with the theme switched, and Filter menu with both filters on and 4 of 24 issues left
// your change in it, and Eval results with the run in and the price check failing. Terminal stream is taken once the run has
// passed and summed itself up, and Hand-off to a person once Alex has it and the agent is paused
const WAIT = { toast:2600, 'status-pill':3300, 'design-review':9500, 'model-picker':13000, 'answer-action-bar':17000, composer:18000, thinking:11000, 'context-meter':10500, 'inline-text-diff':9500, 'agent-tree':16500, 'agent-inbox':5000, 'voice-orb':8500, 'prompt-library':12000, steering:16800, 'eval-results':7000, 'knowledge-sources':8200, 'scheduled-runs':4000, 'segmented-control':7000, 'otp-field':10800, 'multi-select':5500, 'profile-menu':11500, 'filter-menu':12500, 'browser-session':9500, 'trace-view':11500, 'terminal-stream':20000, 'human-handoff':15500 };
const OUT = { thumbs:path.join(HERE, 'public/components/thumbs'), og:path.join(HERE, 'public/components/og') };
Object.values(OUT).forEach(d => fs.mkdirSync(d, { recursive:true }));

// the repository as Cloudflare Pages serves it: a file, or the same name with .html
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg', '.woff2':'font/woff2' };
const server = http.createServer((q, r) => {
  const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  const f = [p, p + '.html', path.join(p, 'index.html')].find(x => x.startsWith(ROOT) && fs.existsSync(x) && fs.statSync(x).isFile());
  if (!f){ r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type':TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// a box of the given shape around the component, inside the demo, in page pixels
const boxAround = (comp, demo, ratio, pad) => {
  let w = comp.width + pad * 2, h = comp.height + pad * 2;
  if (w / h < ratio) w = h * ratio; else h = w / ratio;
  w = Math.min(w, demo.width); h = Math.min(h, demo.height, w / ratio); w = h * ratio;
  let x = comp.x + comp.width / 2 - w / 2, y = comp.y + comp.height / 2 - h / 2;
  x = Math.max(demo.x, Math.min(x, demo.x + demo.width - w)); y = Math.max(demo.y, Math.min(y, demo.y + demo.height - h));
  return { x, y, width:w, height:h };
};
const encode = (png, out, w, h, args) => execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'png_pipe', '-i', '-', '-vf', `scale=${w}:${h}:flags=lanczos`, ...args, out], { input:png });

const browser = await chromium.launch();
for (const theme of ['light', 'dark']){
  const ctx = await browser.newContext({ viewport:{ width:1280, height:1000 }, deviceScaleFactor:2, colorScheme:theme });
  await ctx.addInitScript(t => { try { localStorage.setItem('dmui-style', 'soft'); localStorage.setItem('dmui-theme', t); } catch(e){} }, theme);
  for (const name of names){
    const page = await ctx.newPage();
    await page.goto(`${base}/components/${name}`, { waitUntil:'load' });
    // the header, the bar and a story's pointer are hidden, and a short demo gets room for a picture of the right shape
    await page.addStyleTag({ content:'.cp-anim,.pg-top,.cp-bar,.hand{visibility:hidden!important}.pg-demo{min-height:max(560px,calc(var(--h-a) + 112px))!important}' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(WAIT[name] || 6000);
    const r = await page.evaluate(() => {
      const d = document.querySelector('.cp-demo').getBoundingClientRect(), s = document.querySelector('.pg-demo .stage-in');
      // a component in a demo frame (.dm) is pictured without the switcher under it
      const k = (s.querySelector('.dm-main') ? [s.querySelector('.dm-main')] : [...s.children]).map(e => e.getBoundingClientRect()).filter(b => b.width && b.height);
      const x = Math.min(...k.map(b => b.left)), y = Math.min(...k.map(b => b.top)), X = Math.max(...k.map(b => b.right)), Y = Math.max(...k.map(b => b.bottom));
      const box = b => ({ x:b.x + scrollX, y:b.y + scrollY, width:b.width, height:b.height });
      return { demo:box(d), comp:box({ x, y, width:X - x, height:Y - y }) };
    });
    const thumb = await page.screenshot({ clip:boxAround(r.comp, r.demo, 16 / 10, 40), type:'png' });
    encode(thumb, path.join(OUT.thumbs, `${name}-${theme}.webp`), 640, 400, ['-c:v', 'libwebp', '-quality', '82']);
    if (theme === 'light'){
      const og = await page.screenshot({ clip:boxAround(r.comp, r.demo, 1200 / 630, 56), type:'png' });
      encode(og, path.join(OUT.og, `${name}.jpg`), 1200, 630, ['-q:v', '3']);
    }
    await page.close();
    process.stdout.write(`${theme} ${name}\n`);
  }
  await ctx.close();
}
await browser.close(); server.close();
console.log('pictures written for', names.length, 'components');
