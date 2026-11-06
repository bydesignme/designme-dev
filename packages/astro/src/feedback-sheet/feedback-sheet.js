// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, html, swap } from '../core/core.js';
DM.def('feedback-sheet', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{up}', I('up-thumb')).replace('{dn}', I('down-thumb'));
  const up = $('.fbx-up', r), dn = $('.fbx-dn', r), box = $('.fbx-box', r), st = $('.fbx-st', r), go = $('.fbx-go', r), ta = $('.fbx-ta', r), chips = $$('.fbx-ch .chip', r);
  const ready = () => go.disabled = !(chips.some(x => x.classList.contains('on')) || ta.value.trim());
  chips.forEach(ch => ch.onclick = () => { ch.classList.toggle('on'); ready(); });
  ta.oninput = ready;
  up.onclick = () => { const on = !up.classList.contains('on'); up.classList.toggle('on', on); dn.classList.remove('on'); box.classList.add('shut'); swap(st, on ? 'Thanks, noted' : ''); };
  // the demo opens the sheet without taking the focus from wherever you are on the page
  const down = focus => { const on = !dn.classList.contains('on'); dn.classList.toggle('on', on); up.classList.remove('on'); box.classList.toggle('shut', !on); swap(st, ''); if (on && focus) c.later(350, () => ta.focus({ preventScroll:true })); };
  dn.onclick = e => down(e.isTrusted);
  $('.fbx-x', r).onclick = () => { box.classList.add('shut'); dn.classList.remove('on'); };
  go.onclick = () => c.run(async () => {
    go.innerHTML = '<span class="spin"></span>'; await c.wait(800);
    box.classList.add('shut'); await c.wait(300);
    const n = chips.filter(x => x.classList.contains('on')).length;
    const thx = html(`<div class="fbx-thx">${I('ok')}<span>Thanks. The agent will ${n ? 'avoid this' : 'use this'} next time in this project.</span></div>`);
    r.firstElementChild.appendChild(thx); enter(thx); swap(st, 'Feedback sent');
  });
  /* once it has entered, it rates the answer down and fills in the sheet by itself. Clicking, focusing or typing in it
     takes over, and what it had typed goes */
  c.run(async () => {
    await c.step(1500); down(false);
    await c.step(1000); chips[1].click();
    await c.step(700);
    await c.type(ta, 'Keep our 8px spacing scale', { ms:() => 34 + Math.random() * 40, each:ready, keep:true });
    await c.step(650); go.click();
  });
});
