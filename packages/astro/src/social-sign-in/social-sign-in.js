// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, BRAND, DM, I, hold, html, release, stagger } from '../core/core.js';
DM.def('social-signin', (r, c) => {
  const P = [['Google','google'],['GitHub','github'],['Figma','figma'],['SSO','']];
  let last = 'Figma';
  const list = $('.ssi-list', r), root = $('.ssi', r);
  const mark = p => p[1] ? BRAND[p[1]] : I('lock','s');
  function paint(){
    list.innerHTML = P.map(p => `<button class="ssi-b${p[0] === last ? ' last-used' : ''}" data-p="${p[0]}"><span class="mk">${mark(p)}</span><span class="lb">Continue with ${p[0]}</span>${p[0] === last ? '<span class="last">Last used</span>' : ''}</button>`).join('') + '';
    stagger($$('.ssi-b', list), 50);
    $$('.ssi-b', list).forEach(b => b.onclick = () => c.run(async () => {
      b.classList.add('busy'); list.classList.add('wait'); $('.mk', b).innerHTML = '<span class="spin"></span>';
      await c.wait(1100); last = b.dataset.p;
      hold(root); const kids = [...root.children]; kids.forEach(k => k.hidden = true);
      const ok = html(`<div class="ssi-ok">${AV('MK','var(--dm-av-l)')}<b>Welcome back, Maya</b><span class="muted">Signed in with ${last}</span><button class="pill ghost sm">Sign out</button></div>`);
      root.appendChild(ok); stagger([...ok.children], 60);
      $('button', ok).onclick = () => { ok.remove(); release(root); kids.forEach(k => k.hidden = false); list.classList.remove('wait'); paint(); };
    }));
  }
  paint();
});
