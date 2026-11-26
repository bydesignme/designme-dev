// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, hoverGlide, mxT, reflow, stagger } from '../core/core.js';
DM.def('source-stack', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs'));
  const S = [
    ['web','Baymard: pricing page UX','baymard.com',.92,'B','var(--dm-av-b)'],
    ['web','Annual vs monthly anchoring study','cxl.com',.88,'C','var(--dm-av-r)'],
    ['file','Q3 conversion export.csv','Drive',.84,'CSV','var(--dm-av-m)'],
    ['figma','Pricing v4, frame 2','Figma',.8,'F','var(--dm-av-l)'],
    ['web','Stripe billing docs','stripe.com',.66,'S','var(--dm-av-k)'],
    ['file','Pricing research notes','Notion',.61,'N','var(--dm-av-t)'],
    ['figma','Checkout flow','Figma',.52,'F','var(--dm-av-l)'],
    ['web','NN/g on price framing','nngroup.com',.48,'N','var(--dm-av-y)']
  ];
  // each source's mark on its own vivid fill, with that fill's ink: white, or a dark ink of its hue where white would fail
  const ink = col => col.replace(')', '-ink)');
  const pill = $('.ssx-pill', r), box = $('.ssx-box', r), list = $('.ssx-list', r);
  if (!r.closest('.ahx')) c.offs.push(hoverGlide(list, '.ssx-s'));
  $('.ssx-ics', r).innerHTML = S.slice(0, 4).map(s => `<span style="background:${s[5]};color:${ink(s[5])}">${s[4][0]}</span>`).join('');
  const draw = f => {
    const items = S.filter(s => f === 'all' || s[0] === f);
    list.innerHTML = items.map(s => `<div class="ssx-s" data-key="${s[1]}"><span class="fv" style="background:${s[5]};color:${ink(s[5])}">${s[4]}</span><span class="t"><span>${s[1]}</span><span class="h"> · ${s[2]}</span></span><span class="rel" data-tip="Relevance ${Math.round(s[3] * 100)}%"><i style="width:${s[3] * 100}%"></i></span><button class="ib mx-press" aria-label="Open source" data-tip="Open">${I('ext','xs')}</button></div>`).join('');
  };
  function paint(f){ draw(f); stagger($$('.ssx-s', list), 40); }
  // a filter moves the rows: the sources that stay glide to their new places, new ones rise in out of a short blur and the
  // ones that go fade where they were (reflow()), and the list eases to its new height on the spring (motion pieces)
  const refilter = f => { const h0 = list.offsetHeight;
    reflow(() => $$('.ssx-s', list), () => draw(f), { root:$('.ssx', r) || r, host:list, blur:true });
    const h1 = list.offsetHeight; if (REDUCE || Math.abs(h1 - h0) < 1) return;
    list.style.overflow = 'clip'; const a = list.animate([{ height:h0 + 'px' }, { height:h1 + 'px' }], { duration:mxT(list, '--dm-t-in', 360) * 1.4, easing:mxT(list, '--dm-ease-spring', 'ease') });
    a.onfinish = a.oncancel = () => { list.style.overflow = ''; }; };
  pill.onclick = () => { const open = box.classList.toggle('shut') === false; pill.setAttribute('aria-expanded', open); if (open) paint($('.ssx-fl .on', r).dataset.f); };
  $$('.ssx-fl .chip', r).forEach(ch => ch.onclick = () => { $$('.ssx-fl .chip', r).forEach(x => x.classList.toggle('on', x === ch)); refilter(ch.dataset.f); });
  // the preview opens the sources once on its own, unless you take over first
  c.auto(1100, () => { if (pill.getAttribute('aria-expanded') === 'false') pill.click(); });
});
