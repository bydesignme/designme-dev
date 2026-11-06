// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, swap } from '../core/core.js';
DM.def('workspace-rail', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{panel}', I('panel'));
  const N = [['home','Home',0],['spark','Agent',2],['layers','Projects',0],['figma','Frames',0],['book','Memory',0],['gear','Settings',0]];
  const nav = $('.wrx-nav', r), ind = $('.wrx-ind', r), root = $('.wrx', r), mh = $('.wrx-mh', r);
  nav.insertAdjacentHTML('beforeend', N.map((n, i) => `<button class="wrx-i${i === 1 ? ' on' : ''}" data-i="${i}" aria-label="${n[1]}" data-tip="${n[1]}">${I(n[0])}${n[2] ? `<span class="bd">${n[2]}</span>` : ''}<span class="wrx-lb">${n[1]}</span></button>`).join(''));
  $('.wrx-runs', r).insertAdjacentHTML('beforeend', ['Pricing audit','Token export'].map(t => `<button class="wrx-run" data-tip="${t}"><span class="think on"><i></i><i></i><i></i><i></i></span><span class="wrx-lb">${t}</span></button>`).join(''));
  const items = $$('.wrx-i[data-i]', nav);
  function go(b){ items.forEach(x => x.classList.toggle('on', x === b)); ind.style.top = b.offsetTop + 'px'; swap(mh, N[+b.dataset.i][1]); const bd = $('.bd', b); if (bd){ bd.classList.add('leave'); c.later(300, () => bd.remove()); } }
  items.forEach(b => b.onclick = () => go(b));
  const tipSync = () => $$('[data-tip]', $('.wrx-rail', r)).forEach(el => { if (!el.dataset.t0) el.dataset.t0 = el.dataset.tip; if (root.classList.contains('wide') && !el.classList.contains('wrx-pin')) el.removeAttribute('data-tip'); else el.dataset.tip = el.dataset.t0; });
  $('.wrx-pin', r).onclick = () => { root.classList.toggle('wide'); const w = root.classList.contains('wide'); $('.wrx-pin', r).dataset.t0 = w ? 'Collapse' : 'Pin open'; tipSync(); };
  mh.textContent = 'Agent'; requestAnimationFrame(() => ind.style.top = items[1].offsetTop + 'px');
  // the preview pins the rail open once on its own, unless you take over first
  c.auto(1500, () => { root.classList.add('wide'); $('.wrx-pin', r).dataset.t0 = 'Collapse'; tipSync(); });
});
