// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, DM, I, html, seg, stagger } from '../core/core.js';
DM.def('notifications', (r, c) => {
  let N = [
    { k:'agent', ic:'ok', col:'var(--dm-ok)', t:'<b>Pricing audit</b> finished. 2 fixes ready to review', w:'4 min ago' },
    { k:'men', av:['MK','var(--dm-av-l)'], t:'<b>Maya</b> mentioned you in Checkout flow', w:'20 min ago' },
    { k:'agent', ic:'alert', col:'var(--dm-warn)', t:'<b>Token export</b> paused at the $5 cap', w:'1 hour ago' },
    { k:'men', av:['JO','var(--dm-av-m)'], t:'<b>Jon</b> asked for your review on PR #284', w:'2 hours ago', read:true }
  ];
  const list = $('.ntx-list', r), ct = $('.ntx-ct', r); let f = 'all';
  const count = (bump) => { const n = N.filter(x => !x.read).length; ct.textContent = n; ct.classList.toggle('z', !n); if (bump){ ct.classList.remove('bump'); void ct.offsetWidth; ct.classList.add('bump'); } };
  const row = x => `<button class="ntx-n${x.read ? ' read' : ''}"><span class="ic" ${x.ic ? `style="color:${x.fg || x.col};background:color-mix(in srgb,${x.col} 13%,transparent)"` : ''}>${x.ic ? I(x.ic,'xs') : AV(x.av[0], x.av[1])}</span><span class="t">${x.t}<span>${x.w}</span></span><span class="u"></span></button>`;
  function paint(anim){ const L = N.filter(x => f === 'all' || x.k === f); list.innerHTML = L.length ? L.map(row).join('') : '<div class="ntx-e">Nothing here yet</div>';
    $$('.ntx-n', list).forEach((b, i) => b.onclick = () => { L[i].read = !L[i].read; b.classList.toggle('read', L[i].read); count(); });
    if (anim) stagger($$('.ntx-n', list), 40); count(); }
  seg($('.ntx-tabs .seg2', r), v => { f = v; paint(true); });
  $('.ntx-all', r).onclick = () => { N.forEach(x => x.read = true); $$('.ntx-n', list).forEach((b, i) => c.later(i * 50, () => b.classList.add('read'))); count(); };
  paint(true);
  const incoming = [{ k:'agent', ic:'spark', col:'var(--dm-accent-mark,var(--dm-accent))', fg:'var(--dm-accent-fg,var(--dm-accent))', t:'<b>Weekly design QA</b> started on 12 frames', w:'Just now' }, { k:'men', av:['AR','var(--dm-av-p)'], t:'<b>Ari</b> replied: “Looks great, ship it”', w:'Just now' }];
  // two items arrive while you watch; once you click or type in the inbox the preview leaves it to you, so a tab you
  // picked or a Mark all read stays as you left it
  incoming.forEach((x, i) => c.later(2200 + i * 2600, () => { if (c.mine) return; N.unshift(x); if (f === 'all' || f === x.k){ const el = html(row(x)); el.classList.add('new'); list.prepend(el); $('.ntx-e', list)?.remove(); el.onclick = () => { x.read = !x.read; el.classList.toggle('read', x.read); count(); }; } count(true); }));
});
