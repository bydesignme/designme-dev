// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, stagger } from '../core/core.js';
DM.def('source-stack', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs'));
  const S = [
    ['web','Baymard: pricing page UX','baymard.com',.92,'B','var(--dm-pb)'],
    ['web','Annual vs monthly anchoring study','cxl.com',.88,'C','var(--dm-pp)'],
    ['file','Q3 conversion export.csv','Drive',.84,'CSV','var(--dm-pm)'],
    ['figma','Pricing v4, frame 2','Figma',.8,'F','var(--dm-pl)'],
    ['web','Stripe billing docs','stripe.com',.66,'S','var(--dm-pl)'],
    ['file','Pricing research notes','Notion',.61,'N','var(--dm-fg2)'],
    ['figma','Checkout flow','Figma',.52,'F','var(--dm-pl)'],
    ['web','NN/g on price framing','nngroup.com',.48,'N','var(--dm-fg2)']
  ];
  const pill = $('.ssx-pill', r), box = $('.ssx-box', r), list = $('.ssx-list', r);
  $('.ssx-ics', r).innerHTML = S.slice(0, 4).map(s => `<span style="background:${s[5]}">${s[4][0]}</span>`).join('');
  function paint(f){
    const items = S.filter(s => f === 'all' || s[0] === f);
    list.innerHTML = items.map(s => `<div class="ssx-s"><span class="fv" style="background:color-mix(in srgb,${s[5]} 14%,transparent);color:${s[5]}">${s[4]}</span><span class="t">${s[1]}<span class="h"> · ${s[2]}</span></span><span class="rel" data-tip="Relevance ${Math.round(s[3] * 100)}%"><i style="width:${s[3] * 100}%"></i></span><button class="ib" aria-label="Open source" data-tip="Open">${I('ext','xs')}</button></div>`).join('');
    stagger($$('.ssx-s', list), 40);
  }
  pill.onclick = () => { const open = box.classList.toggle('shut') === false; pill.setAttribute('aria-expanded', open); if (open) paint($('.ssx-fl .on', r).dataset.f); };
  $$('.ssx-fl .chip', r).forEach(ch => ch.onclick = () => { $$('.ssx-fl .chip', r).forEach(x => x.classList.toggle('on', x === ch)); paint(ch.dataset.f); });
  // the preview opens the sources once on its own, unless you take over first
  c.auto(1100, () => { if (pill.getAttribute('aria-expanded') === 'false') pill.click(); });
});
