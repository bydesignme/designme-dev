// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, BRAND, DM, I, grow, html, stagger } from '../core/core.js';
DM.def('social-signin', (r, c) => {
  const P = [['Google','google'],['GitHub','github'],['Figma','figma'],['SSO','']];
  let last = 'Figma';
  const list = $('.ssi-list', r), root = $('.ssi', r);
  const mark = p => p[1] ? BRAND[p[1]] : I('lock','s');
  // the card fits what it shows at every moment (grow(), never a kept height): signing in, it eases to the welcome's height,
  // and back on Sign out. It starts once the card's entrance has ended, so it measures the card at its real size
  Promise.resolve().then(() => Promise.all(root.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && root.isConnected) c.offs.push(grow(root)); });
  const into = () => $(':scope>.dm-grow', root) || root;
  // each provider: its mark and its words centred together in every button, and the one used last with a plain grey Last
  // used tag apart at its end
  function paint(){
    list.innerHTML = P.map(p => `<button class="ssi-b${p[0] === last ? ' last-used' : ''}" data-p="${p[0]}" aria-label="Continue with ${p[0]}"><span class="mk">${mark(p)}</span><span class="lb"><span class="pre">Continue with </span>${p[0]}</span>${p[0] === last ? '<span class="tag last">Last used</span>' : ''}</button>`).join('');
    stagger($$('.ssi-b', list), 50);
    $$('.ssi-b', list).forEach(b => b.onclick = () => c.run(async () => {
      b.classList.add('busy'); b.setAttribute('aria-busy', 'true'); list.classList.add('wait'); $('.mk', b).innerHTML = '<span class="spin"></span>';
      await c.wait(1100); last = b.dataset.p;
      const box = into(), kids = [...box.children]; kids.forEach(k => k.hidden = true);
      const ok = html(`<div class="ssi-ok">${AV('MK','var(--dm-av-l)')}<b>Welcome back, Maya</b><span class="muted">Signed in with ${last}</span><button class="pill ghost sm">Sign out</button></div>`);
      box.appendChild(ok); stagger([...ok.children], 60);
      $('button', ok).onclick = () => { ok.remove(); kids.forEach(k => k.hidden = false); list.classList.remove('wait'); paint(); };
    }));
  }
  paint();
});
