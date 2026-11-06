// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, DM, I, enter, html, swap } from '../core/core.js';
DM.def('design-review', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{palette}', I('palette')).replace('{chev}', I('chev-d','xs')).replace(/\{chk\}/g, I('check','xs'));
  const C = [['Visual diff','2 of 6 screens changed'],['Library tokens','All from the library'],['Contrast','AA on every screen']];
  const box = $('.drv-checks', r), rv = $('.drv-rv', r), go = $('.drv-go', r), dd = $('.drv-dd', r), st = $('.drv-st', r), tag = $('.drv-tag', r), root = $('.drv', r);
  box.innerHTML = C.map(x => `<div class="drv-c"><span class="g"><span class="drv-ring"></span></span><span class="t">${x[0]}</span><span class="d"></span></div>`).join('');
  const rows = $$('.drv-c', box);
  const DONE = { 'Ship to everyone':'Live for every visitor', 'Ship to 10% first':'Live for 10% of visitors. Everyone tomorrow', 'Ship on Monday':'Ships on Monday at 09:00' };
  // one message in the review: who, a tag, and what they said
  const msg = (who, tg, text) => { const m = html(`<div class="drv-m">${who === 'agent' ? `<span class="drv-ag">${I('spark','xs')}</span>` : AV('MK','var(--dm-av-l)')}<div class="drv-mb"><span class="drv-mn"><b>${who === 'agent' ? 'Design agent' : 'Maya Kim'}</b>${tg}</span>${text ? `<p>${text}</p>` : ''}</div></div>`); $('.drv-wt', rv)?.remove(); rv.appendChild(m); enter(m); return m; };
  $$('.drv-pop .mi', r).forEach(m => m.addEventListener('click', () => { $$('.drv-pop .mi', r).forEach(x => x.setAttribute('aria-checked', x === m)); swap(go, m.dataset.m); }));
  go.onclick = () => c.run(async () => {
    const how = go.textContent; go.disabled = dd.disabled = true; swap(go, 'Shipping'); swap(st, 'Publishing 6 screens'); await c.wait(1000);
    const later = how === 'Ship on Monday';
    root.classList.toggle('live', !later); tag.className = 'tag ' + (later ? 'b' : 'ok') + ' drv-tag'; swap(tag, later ? 'Scheduled' : 'Live');
    const f = $('.drv-f', r); f.innerHTML = `<span class="drv-done">${I(later ? 'clock' : 'ok')}<span>${DONE[how]}</span></span>`; enter(f.firstElementChild);
  });
  c.run(async () => {
    await c.wait(500);
    for (let i = 0; i < rows.length; i++){
      const g = $('.g', rows[i]); g.innerHTML = '<span class="spin"></span>'; swap($('.d', rows[i]), 'Running');
      await c.wait(650 + i * 120);
      g.innerHTML = `<span style="color:var(--dm-ok);display:grid">${I('ok','xs')}</span>`; enter(g.firstElementChild); swap($('.d', rows[i]), C[i][1]);
    }
    swap(st, 'Waiting on Maya'); await c.wait(900);
    msg('maya', '<span class="tag warn">Changes requested</span>', 'Start the plan toggle on yearly. Most people pick it.');
    swap(st, 'The agent is on it'); await c.wait(1200);
    const a = msg('agent', '<span class="tag drv-wk"><span class="spin"></span>Updating</span>', '');
    await c.wait(1300);
    swap($('.drv-wk', a), 'Updated'); const p = html('<p>The toggle starts on yearly on all 6 screens.</p>'); $('.drv-mb', a).appendChild(p); enter(p);
    await c.wait(1100);
    msg('maya', `<span class="tag ok">${I('check','xs')}Approved</span>`, '');
    swap(st, 'Approved by Maya'); tag.className = 'tag ok drv-tag'; swap(tag, 'Approved');
    go.disabled = dd.disabled = false; enter($('.drv-mg', r));
  });
});
