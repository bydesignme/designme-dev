// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, html, stagger, swap } from '../core/core.js';
DM.def('onboarding-checklist', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs')).replace('{check}', I('check','xs'));
  const S = [['Create your workspace','Done when you signed up',1,0],['Connect Figma','So the agent can read your frames',0,1],['Import your tokens','Colours, type and spacing',0,1],['Invite a teammate','Design is better together',0,0],['Run your first audit','Takes about a minute',0,1]];
  const list = $('.obx-list', r), st = $('.obx-st', r), ring = $('.obx-ring', r), rw = $('.obx-rw', r), fl = $('.obx-ring .fl', r);
  list.innerHTML = S.map((s, i) => `<div class="obx-s${s[2] ? ' done' : ''}" data-i="${i}"><button class="obx-ck" role="checkbox" aria-checked="${!!s[2]}" aria-label="${s[0]}">${I('check','xs')}</button><span class="t"><b>${s[0]}</b><span>${s[1]}</span></span>${s[3] ? `<button class="pill soft sm">${I('spark','xs')}Do it for me</button>` : ''}</div>`).join('');
  const rows = $$('.obx-s', list);
  function tally(){ const n = S.filter(s => s[2]).length; fl.style.strokeDashoffset = 100.5 * (1 - n / S.length); ring.classList.toggle('full', n === S.length); rw.classList.toggle('full', n === S.length); swap(st, n === S.length ? 'All done. Nice work' : n + ' of ' + S.length + ' done');
    if (n === S.length && !$('.obx-dn', list)){ const d = html(`<div class="obx-dn">${I('ok','xs')}You are all set. The agent will suggest what to try next.</div>`); list.appendChild(d); enter(d); } else if (n < S.length) $('.obx-dn', list)?.remove(); }
  const set = (i, v) => { S[i][2] = v; rows[i].classList.toggle('done', v); $('.obx-ck', rows[i]).setAttribute('aria-checked', v); tally(); };
  rows.forEach((row, i) => {
    $('.obx-ck', row).onclick = () => set(i, !S[i][2]);
    // the whole row ticks the step, not only its checkbox (its button does its own thing, and a running step waits)
    row.onclick = e => { if (e.target.closest('.obx-ck, .pill') || row.classList.contains('run')) return; set(i, !S[i][2]); };
    const p = $('.pill', row); if (p) p.onclick = () => c.run(async () => { row.classList.add('run'); const ck = $('.obx-ck', row); ck.innerHTML = '<span class="spin" style="width:14px;height:14px"></span>'; const sp = $('.t span', row), was = sp.textContent; swap(sp, 'The agent is on it'); sp.classList.add('shim');
      await c.wait(1400); ck.innerHTML = I('check','xs'); row.classList.remove('run'); sp.classList.remove('shim'); swap(sp, was); set(i, 1); });
  });
  const mn = $('.obx-min', r); mn.onclick = () => { const s = $('.obx-fold', r).classList.toggle('shut'); mn.classList.toggle('shut', s); mn.dataset.tip = s ? 'Expand' : 'Collapse'; };
  stagger(rows, 50); c.later(200, tally);
  // the preview has the agent connect Figma once on its own, unless you take over first
  c.auto(1300, () => $('.pill', rows[1]).click());
});
