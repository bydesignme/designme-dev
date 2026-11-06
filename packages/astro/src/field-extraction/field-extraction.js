// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, enter, html, swap } from '../core/core.js';
DM.def('field-extraction', (r, c) => {
  const F = [['no','Invoice no.','NW-2041',.99],['date','Issued','2026-10-03',.97],['total','Total','$11,480.00',.98],['due','Due by','2026-11-1?',.41]];
  const list = $('.fex-list', r), st = $('.fex-st', r), go = $('.fex-go', r), doc = $('.fex-doc', r), pg = $('.fex-pg', r);
  const z = k => $(`.fex-z[data-z="${k}"]`, r);
  function row(f){
    const warn = f[3] < .6;
    const el = html(`<div class="fex-r${warn ? ' warn' : ''}" data-k="${f[0]}"><span class="k">${f[1]}</span><span class="v num">${f[2]}</span><span class="fex-cf">${warn ? `<button class="fex-fix" data-tip="${Math.round(f[3] * 100)}% sure, check it">${I('edit','xs')}Check</button>` : `<i><b style="width:${f[3] * 100}%"></b></i>${Math.round(f[3] * 100)}%`}</span></div>`);
    if (warn) z(f[0]).classList.add('warn');
    el.onmouseenter = () => z(f[0]).classList.add('hl'); el.onmouseleave = () => z(f[0]).classList.remove('hl');
    const fx = $('.fex-fix', el);
    if (fx) fx.onclick = () => { const v = $('.v', el); v.contentEditable = 'true'; v.textContent = '2026-11-1'; v.focus({ preventScroll:true }); const s = document.getSelection(); s.selectAllChildren(v); s.collapseToEnd(); z(f[0]).classList.add('hl'); swap(st, 'Type the day you see');
      const done = () => { v.contentEditable = 'false'; z(f[0]).classList.remove('hl', 'warn'); el.classList.remove('warn'); const cf = $('.fex-cf', el); cf.innerHTML = `<i><b style="width:100%"></b></i>Fixed`; enter(cf); go.disabled = false; swap(st, 'All fields confirmed'); };
      v.onkeydown = e => { if (e.key === 'Enter'){ e.preventDefault(); if (!/\d\d$/.test(v.textContent)) v.textContent = '2026-11-14'; done(); } }; v.onblur = () => { if (v.isContentEditable){ if (!/\d\d$/.test(v.textContent)) v.textContent = '2026-11-14'; done(); } }; };
    return el;
  }
  go.onclick = () => c.run(async () => { go.innerHTML = '<span class="spin"></span>'; await c.wait(800); go.innerHTML = I('check','xs') + 'Added to Invoices'; go.className = 'pill soft sm fex-go'; swap(st, '1 row added to Invoices 2026'); });
  c.run(async () => {
    const beam = html('<div class="fex-beam"></div>'); doc.appendChild(beam); await c.wait(300); beam.classList.add('go');
    for (const f of F){ await c.wait(560); const zz = z(f[0]); zz.classList.add('scan'); const el = row(f); list.appendChild(el); enter(el); c.later(500, () => zz.classList.remove('scan')); }
    await c.wait(400); swap(st, '1 field needs a look');
  });
});
