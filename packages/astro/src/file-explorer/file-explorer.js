// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, stagger, swap } from '../core/core.js';
DM.def('file-explorer', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{search}', I('search','xs')).replace('{filter}', I('filter','xs'));
  const T = { n:'', k:[
    { n:'src', k:[
      { n:'components', k:[ { n:'PlanCard.tsx', s:'M' }, { n:'PriceTag.tsx', s:'A' }, { n:'Button.tsx' }, { n:'LegacyCTA.tsx', s:'D' } ] },
      { n:'styles', k:[ { n:'tokens.css', s:'M' }, { n:'globals.css' } ] },
      { n:'pages', k:[ { n:'pricing.mdx', s:'M' }, { n:'index.mdx' } ] }
    ]},
    { n:'public', k:[ { n:'og-pricing.png', s:'A' }, { n:'favicon.svg' } ] },
    { n:'package.json' }, { n:'README.md' }
  ]};
  const tree = $('.fxp-tree', r), inp = $('.fxp-s input', r), chB = $('.fxp-ch', r), st = $('.fxp-st', r);
  const open = new Set(['src','src/components','src/styles']); let only = false, sel = 'src/components/PlanCard.tsx';
  const changed = n => n.s || (n.k && n.k.some(changed));
  const match = (n, q) => !q || n.n.toLowerCase().includes(q) || (n.k && n.k.some(k => match(k, q)));
  const ext = n => /\.(tsx)$/.test(n) ? 'code' : /\.css$/.test(n) ? 'palette' : /\.png|\.svg$/.test(n) ? 'image' : 'file-text';
  function build(n, path, d, q){
    return n.k.filter(k => match(k, q) && (!only || changed(k))).map(k => {
      const p = path ? path + '/' + k.n : k.n, isD = !!k.k, op = isD && (open.has(p) || !!q || only);
      return `<button class="fxp-n${isD && op ? ' open' : ''}${p === sel ? ' sel' : ''}${k.s ? ' ' + k.s : ''}" data-p="${p}" ${isD ? 'data-d="1"' : ''} style="padding-left:${6 + d * 14}px" role="treeitem"><span class="cv">${isD ? I('chev-r','xs') : ''}</span><span class="ic">${I(isD ? 'folder' : ext(k.n),'xs')}</span><span class="nm">${k.n}</span>${k.s ? `<span class="bd ${k.s}">${k.s}</span>` : isD && changed(k) ? '<span class="ag"></span>' : ''}</button>` + (isD ? `<div class="fxp-k${op ? '' : ' shut'}"><div>${build(k, p, d + 1, q)}</div></div>` : '');
    }).join('');
  }
  function paint(){
    tree.innerHTML = build(T, '', 0, inp.value.trim().toLowerCase());
    $$('.fxp-n', tree).forEach(b => b.onclick = () => {
      if (b.dataset.d){ const p = b.dataset.p, k = b.nextElementSibling; const o = !open.has(p); o ? open.add(p) : open.delete(p); b.classList.toggle('open', o); k.classList.toggle('shut', !o); }
      else { sel = b.dataset.p; $$('.fxp-n', tree).forEach(x => x.classList.toggle('sel', x === b)); swap(st, sel); }
    });
  }
  inp.oninput = paint;
  chB.onclick = () => { only = !only; chB.classList.toggle('on', only); swap(st, only ? '6 files changed by the agent' : sel); paint(); stagger($$('.fxp-n', tree), 25); };
  st.textContent = sel; paint(); stagger($$('.fxp-n', tree), 25);
});
