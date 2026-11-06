// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, html, swap } from '../core/core.js';
DM.def('launch-checklist', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{play}', I('play','xs'));
  const C = [
    ['Contrast meets AA', null, 'All 14 text pairs pass'],
    ['Uses library tokens', '3 raw hex values in the FAQ', 'Swapped to color.text.muted'],
    ['Responsive at 375px', null, 'No overflow on 3 breakpoints'],
    ['Alt text on images', '2 icons have no label', 'Added labels from the layer names'],
    ['Links resolve', null, '12 of 12 links return 200'],
    ['Copy matches the brief', null, 'Prices and plan names match']
  ];
  const list = $('.lcx-list', r), bar = $('.lcx-bar', r), st = $('.lcx-st', r), run = $('.lcx-run', r);
  bar.innerHTML = C.map(() => '<i></i>').join(''); const segs = $$('i', bar);
  list.innerHTML = C.map(x => `<div class="lcx-r wait"><span class="g"><span class="lcx-ring"></span></span><span class="t">${x[0]}<span class="d"></span></span></div>`).join('');
  const rows = $$('.lcx-r', list);
  const G = { ok:`<span style="color:var(--dm-ok)">${I('ok')}</span>`, bad:`<span style="color:var(--dm-bad)">${I('alert')}</span>`, run:'<span class="spin"></span>' };
  function set(i, s, note){ const rw = rows[i]; rw.className = 'lcx-r ' + s; const g = $('.g', rw); g.innerHTML = G[s]; enter(g); swap($('.d', rw), note || ''); segs[i].className = s === 'run' ? 'run' : s; }
  function tally(){ const bad = rows.filter(x => x.classList.contains('bad')).length; swap(st, bad ? bad + ' to fix before shipping' : 'All clear, ready to ship'); if (!bad){ run.innerHTML = I('rocket','xs') + 'Ship it'; run.className = 'pill accent sm lcx-run'; run.onclick = () => { swap(st, 'Shipped to production'); run.disabled = true; }; } }
  run.onclick = () => c.run(async () => {
    run.disabled = true; swap(st, 'Checking');
    for (let i = 0; i < C.length; i++){
      set(i, 'run', 'Checking'); await c.wait(520 + Math.random() * 300);
      if (C[i][1]){ set(i, 'bad', C[i][1]); const f = html(`<button class="pill soft sm">${I('wand','xs')}Fix</button>`); rows[i].appendChild(f); enter(f);
        f.onclick = () => c.run(async () => { f.remove(); set(i, 'run', 'Fixing'); await c.wait(900); set(i, 'ok', C[i][2]); tally(); });
      } else set(i, 'ok', C[i][2]);
    }
    run.disabled = false; run.innerHTML = I('refresh','xs') + 'Run again'; tally();
    if (rows.some(x => x.classList.contains('bad'))) run.onclick = () => DM.mount(r.closest('.card'));
  });
  // the preview runs the checks once on its own after the entrance; the fixes are left for you
  c.auto(1300, () => { if (!run.disabled) run.click(); });
});
