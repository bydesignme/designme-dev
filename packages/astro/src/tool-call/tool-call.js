// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, html, stagger, swap } from '../core/core.js';
DM.def('tool-call', (r, c) => {
  const calls = [
    { ic:'db', n:'billing', f:'list_plan_changes', ms:'412 ms', inp:'{ <span class="k">"since"</span>: <span class="s">"2026-10-01"</span> }', out:'[ { <span class="k">"plan"</span>: <span class="s">"Pro"</span>, <span class="k">"price"</span>: <span class="n">24</span> },\n  { <span class="k">"plan"</span>: <span class="s">"Team"</span>, <span class="k">"price"</span>: <span class="n">48</span> } ]' },
    { ic:'edit', n:'files', f:'edit', ms:'1.2 s', inp:'{ <span class="k">"path"</span>: <span class="s">"Pricing.tsx"</span>, <span class="k">"lines"</span>: <span class="n">6</span> }', out:'{ <span class="k">"changed"</span>: <span class="n">6</span>, <span class="k">"saved"</span>: <span class="k">true</span> }' }
  ];
  const host = $('.tcx-calls', r);
  calls.forEach(k => {
    k.el = html(`<div class="tcx-c"><button class="tcx-h" aria-expanded="false"><span class="tcx-ic">${I(k.ic,'xs')}</span><span class="tcx-n"><span>${k.n}.</span><b>${k.f}</b></span><span class="tcx-ms"><span class="tt">Queued</span><span class="g"></span></span><svg class="i xs tcx-chev"><use href="#i-chev-d"/></svg></button><div class="fold shut"><div><div class="tcx-io"><div><div class="tcx-l">Input</div><pre>${k.inp}</pre></div><div><div class="tcx-l">Output</div><pre class="out">Waiting…</pre></div></div></div></div></div>`);
    host.appendChild(k.el);
    const b = $('.tcx-h', k.el), f = $('.fold', k.el);
    b.onclick = () => { const s = f.classList.toggle('shut'); k.el.classList.toggle('open', !s); b.setAttribute('aria-expanded', !s); };
  });
  stagger($$('.tcx-c', r), 90, 200);
  c.run(async () => {
    await c.wait(600);
    for (const k of calls){
      $('.g', k.el).innerHTML = '<span class="spin" style="width:10px;height:10px"></span>'; swap($('.tt', k.el), 'Running');
      $('.tcx-ic', k.el).innerHTML = '<span class="radar" style="color:var(--dm-fg)"></span>';
      await c.wait(1300);
      $('.tcx-ic', k.el).innerHTML = I(k.ic,'xs'); $('pre.out', k.el).innerHTML = k.out;
      $('.g', k.el).innerHTML = `<span style="color:var(--dm-ok)">${I('check','xs')}</span>`; swap($('.tt', k.el), k.ms);
    }
    $('.tcx-end', r).classList.add('in');
    // the preview opens the first call to show what came back, unless you have taken over
    if (!c.mine) $('.tcx-h', calls[0].el).click();
  });
});
