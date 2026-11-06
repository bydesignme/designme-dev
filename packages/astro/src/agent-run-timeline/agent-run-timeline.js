// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, BRAND, DM, I, enter, html, stagger, swap } from '../core/core.js';
DM.def('agent-run-timeline', (r, c) => {
  // each kind of step has a hue (a chart colour for its bar, the palette slot for its text and icon tint) and a name in the key.
  // Teal and orange take a little of their text slot, so the bars keep 3:1 on a light stage
  const K = { model:['Model', 'var(--dm-c2)', 'pl'], tool:['Tools', 'color-mix(in srgb,var(--dm-c6) 70%,var(--dm-pt))', 'pt'], app:['Apps', 'color-mix(in srgb,var(--dm-c4) 75%,var(--dm-pp))', 'pp'] };
  // an icon starting with @ is an app's own mark
  const S = [
    { l:'Plan the change', ic:'brain', k:'model', s:0, d:1.6, cost:.03 },
    { l:'Read 6 files', ic:'file-text', k:'tool', s:1.6, d:2.2, cost:.02 },
    { l:'Search Figma', ic:'@figma', k:'app', s:1.9, d:1.4, cost:.01 },
    { l:'Edit PricingCard', ic:'edit', k:'model', s:4, d:2.4, cost:.06 },
    { l:'Run tests', ic:'term', k:'tool', s:6.5, d:1.5, cost:.01, fail:'2 failed' },
    { l:'Run tests again', ic:'refresh', k:'tool', s:8.1, d:1.9, cost:.01, retry:true },
    { l:'Open a PR on GitHub', ic:'@github', k:'app', s:10.1, d:1, cost:.02 },
    { l:'Post to Slack', ic:'@slack', k:'app', s:11.1, d:.6, cost:.01 }
  ];
  const T = 12, END = Math.max(...S.map(s => s.s + s.d)), PACE = 1.6, TK = [0, 3, 6, 9, 12];
  const art = $('.art', r), grid = $('.art-grid', r), rows = $('.art-rows', r), now = $('.art-now', r), st = $('.art-s', r), foot = $('.art-f', r);
  $('.art-ticks', r).innerHTML = TK.map(t => `<span style="left:${t / T * 100}%">${t}s</span>`).join('');
  const ticks = $$('.art-ticks span', r);
  $('.art-key', r).innerHTML = Object.entries(K).map(([id, k]) => `<span role="listitem" style="--dm-k:${k[1]}"><i></i>${k[0]}<b data-k="${id}">0.0s</b></span>`).join('');
  const kb = Object.fromEntries($$('.art-key b', r).map(b => [b.dataset.k, b]));
  const pct = v => v / T * 100 + '%';
  S.forEach((s, i) => {
    const k = K[s.k], prev = S[i - 1];
    const link = s.retry && prev ? `<span class="art-link" aria-hidden="true" style="left:${pct(prev.s + prev.d)};width:${pct(s.s - prev.s - prev.d)}"></span>` : '';
    s.el = html(`<div class="art-row" data-k="${s.k}" data-s="wait" style="--dm-k:${k[1]};--dm-kt:var(--dm-${k[2]});--dm-kb:var(--dm-${k[2]}-bg)"><span class="art-lab"><span class="art-ic" aria-hidden="true">${s.ic[0] === '@' ? BRAND[s.ic.slice(1)] : I(s.ic, 'xs')}</span><span class="t">${s.l}</span></span><span class="art-lane">${link}<span class="art-bar" style="left:${pct(s.s)}" data-tip="${s.l}: ${s.d.toFixed(1)}s, $${s.cost.toFixed(2)}${s.fail ? ', 2 tests failed' : ''}"><i></i></span></span><span class="art-d num"></span></div>`);
    s.bar = $('.art-bar', s.el); s.dur = $('.art-d', s.el); s.st = 'wait';
    rows.appendChild(s.el);
  });
  stagger($$('.art-row', r), 40);
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  let line = '', ft = '';
  // the run as it stands t seconds in: bars, states, times, the key, the footer and the line under the title
  function draw(t){
    grid.style.setProperty('--dm-p', (t / T).toFixed(4));
    let cost = 0, n = 0, re = 0; const per = { model:0, tool:0, app:0 }, live = [];
    S.forEach(s => {
      const w = Math.max(0, Math.min(s.d, t - s.s)), was = s.st;
      s.st = t < s.s ? 'wait' : t < s.s + s.d ? 'run' : s.fail ? 'fail' : 'done';
      s.bar.style.width = pct(w);
      s.dur.textContent = t >= s.s ? w.toFixed(1) + 's' : '';
      if (s.st !== was){
        s.el.dataset.s = s.st;
        if (s.st === 'fail'){ const tg = html(`<span class="tag bad">${s.fail}</span>`); $('.art-lab', s.el).appendChild(tg); enter(tg); }
        if (s.st === 'done'){ s.el.classList.remove('bump'); void s.el.offsetWidth; s.el.classList.add('bump'); }
      }
      if (t >= s.s){ n++; cost += s.cost * w / s.d; per[s.k] += w; }
      if (s.st === 'fail') re++;
      if (s.st === 'run') live.push(s.l);
    });
    for (const k in per) kb[k].textContent = per[k].toFixed(1) + 's';
    const f = `<span>${I('clock','xs')}<span><b>${Math.min(t, END).toFixed(1)}s</b> total</span></span><span>${I('dollar','xs')}<span><b>$${cost.toFixed(2)}</b> cost</span></span><span>${I('layers','xs')}<span><b>${n}</b> ${n === 1 ? 'step' : 'steps'}</span></span><span>${I('refresh','xs')}<span><b>${re}</b> ${re === 1 ? 'retry' : 'retries'}</span></span>`;
    if (f !== ft){ foot.innerHTML = f; ft = f; }
    // between two steps the line keeps the last one's name, so it never flickers
    if (live.length && live.join(', ') !== line){ line = live.join(', '); st.textContent = line; }
    now.textContent = t.toFixed(1) + 's';
    // the time on the playhead covers the axis labels it passes
    const b = now.getBoundingClientRect();
    ticks.forEach(el => { const x = el.getBoundingClientRect(); el.classList.toggle('hid', x.right > b.left - 4 && x.left < b.right + 4); });
  }
  draw(0);
  c.run(async () => {
    await c.wait(500);
    art.classList.add('live'); st.classList.remove('muted'); st.classList.add('shim');
    // time moves on only while the demo isn't held, so a mouse resting on it stops the playhead where it is: a long gap
    // between two frames is a hold (or the card being away) ending, and counts as one frame
    await new Promise(res => { let t = 0, last = 0; c.loop(ts => { const dt = last && ts - last < 250 ? ts - last : 16; last = ts; t = Math.min(END, t + dt / 1000 * PACE); draw(t); if (t >= END){ res(); return false; } }); });
    art.classList.remove('live'); art.classList.add('fin');
    st.classList.remove('shim'); st.classList.add('muted');
    now.innerHTML = I('check','xs') + END.toFixed(1) + 's';
    const tag = $('.art-tag', r); tag.className = 'art-tag tag ok'; tag.innerHTML = I('check','xs') + 'Done'; enter(tag);
    swap(st, `Finished in ${END.toFixed(1)}s, ${plural(S.filter(s => s.fail).length, 'retry', 'retries')}`);
  });
});
