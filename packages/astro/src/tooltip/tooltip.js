// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, DM, I, hideTip, showTip, tipFor, tipNext } from '../core/core.js';
DM.def('tooltip', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{undo}', I('undo')).replace('{chat}', I('edit')).replace('{spark}', I('spark')).replace('{users}', I('users')).replace('{a1}', AV('MK','var(--dm-av-l)')).replace('{a2}', AV('DA','var(--dm-av-b)'));
  const P = [['MK','var(--dm-av-l)','Maya Kim','Design lead','Editing Pricing, frame 2'],['DA','var(--dm-av-b)','Design agent','Working for Maya','Auditing contrast, 2 of 6 checks']];
  const card = $('.ttp-card', r), ci = $('.ttp-ci', r), root = $('.ttp', r); let t;
  $$('.ttp-av', r).forEach(b => { b.onmouseenter = () => { clearTimeout(t); t = setTimeout(() => { const p = P[+b.dataset.card];
      ci.innerHTML = `<div class="ttp-ch">${AV(p[0], p[1])}<div><b>${p[2]}</b><span>${p[3]}</span></div></div><div class="ttp-cs">${p[0] === 'DA' ? '<span class="think on" style="color:var(--dm-accent-mark,var(--dm-accent))"><i></i><i></i><i></i><i></i></span>' : '<span class="dot"></span>'}${p[4]}</div>`;
      const rr = root.getBoundingClientRect(), br = b.getBoundingClientRect(); let x = br.left - rr.left + br.width / 2 - 115; x = Math.max(0, Math.min(x, rr.width - 230));
      card.style.left = x + 'px'; card.style.top = (br.bottom - rr.top + 10) + 'px'; card.classList.add('show'); }, 300); };
    b.onmouseleave = () => { clearTimeout(t); card.classList.remove('show'); }; });
  c.offs.push(() => clearTimeout(t));
  // once it has entered, it shows what it does: a shortcut tip, then the agent's card. Pointing at it takes over, as does
  // clicking, focusing or typing in it
  // what the demo opened goes when the pointer comes in, unless it is on that very control: the visitor's own hover decides
  // from then on, so no tip or card is left over from the demo over the one they point at
  let touched = false, shown = null;
  c.on(root, 'pointerenter', () => { touched = true;
    if (shown === 'tip' && tipFor && !tipNext && root.contains(tipFor) && !tipFor.matches(':hover')) hideTip();
    if (shown === 'card' && !$('.ttp-av:hover', r)){ clearTimeout(t); card.classList.remove('show'); }
    shown = null; });
  const go = () => { if (touched || c.mine) throw 'stop'; };
  c.run(async () => {
    await c.wait(1300); go(); if (tipFor) return;
    const ask = $('[data-tip-k="⌘J"]', r); showTip(ask); shown = 'tip'; await c.wait(1700); go(); if (tipFor === ask) hideTip(true); shown = null;
    await c.wait(500); go();
    const av = $('.ttp-av[data-card="1"]', r); av.onmouseenter(); shown = 'card'; await c.wait(2600); go(); av.onmouseleave(); shown = null;
  });
});
