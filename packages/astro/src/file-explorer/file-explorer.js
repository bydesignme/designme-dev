// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, grow, hoverGlide, reflow, stagger, swap } from '../core/core.js';
DM.def('file-explorer', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{search}', I('search','xs')).replace('{filter}', I('filter','xs'));
  // Clean's one hover: a highlight that glides from row to row (hoverGlide)
  c.offs.push(hoverGlide($('.fxp-tree', r), '.fxp-n', { keep:'.sel' }));
  const T = { n:'', k:[
    { n:'src', k:[
      { n:'components', k:[ { n:'PlanCard.tsx', s:'M' }, { n:'PriceTag.tsx', s:'A' }, { n:'Button.tsx' }, { n:'LegacyCTA.tsx', s:'D' } ] },
      { n:'styles', k:[ { n:'tokens.css', s:'M' }, { n:'globals.css' } ] },
      { n:'pages', k:[ { n:'pricing.mdx', s:'M' }, { n:'index.mdx' } ] }
    ]},
    { n:'public', k:[ { n:'og-pricing.png', s:'A' }, { n:'favicon.svg' } ] },
    { n:'package.json' }, { n:'README.md' }
  ]};
  const root = $('.fxp', r) || r, tree = $('.fxp-tree', r), inp = $('.fxp-s input', r), chB = $('.fxp-ch', r), st = $('.fxp-st', r), em = $('.fxp-em', r);
  // the folders open at first: the components the agent changed, with the other folders closed on their dots
  const open = new Set(['src','src/components']); let only = false, sel = 'src/components/PlanCard.tsx';
  const changed = n => n.s || (n.k && n.k.some(changed));
  const match = (n, q) => !q || n.n.toLowerCase().includes(q) || (n.k && n.k.some(k => match(k, q)));
  const ext = n => /\.(tsx)$/.test(n) ? 'code' : /\.css$/.test(n) ? 'palette' : /\.png|\.svg$/.test(n) ? 'image' : 'file-text';
  // each level steps in 14px from the top level's 9px, which puts its chevrons under the filter's search glyph
  function build(n, path, d, q){
    return n.k.filter(k => match(k, q) && (!only || changed(k))).map(k => {
      const p = path ? path + '/' + k.n : k.n, isD = !!k.k, op = isD && (open.has(p) || !!q || only);
      return `<button class="fxp-n${isD && op ? ' open' : ''}${p === sel ? ' sel' : ''}${k.s ? ' ' + k.s : ''}" data-p="${p}" ${isD ? `data-d="1" aria-expanded="${op}"` : `aria-selected="${p === sel}"`} style="padding-left:${9 + d * 14}px" role="treeitem"><span class="cv">${isD ? I('chev-r','xs') : ''}</span><span class="ic">${I(isD ? 'folder' : ext(k.n),'xs')}</span><span class="nm">${k.n}</span>${k.s ? `<span class="bd ${k.s}" aria-label="${{ M:'Modified', A:'Added', D:'Deleted' }[k.s]}">${k.s}</span>` : isD && changed(k) ? '<span class="ag" aria-hidden="true"></span>' : ''}</button>` + (isD ? `<div class="fxp-k${op ? '' : ' shut'}" role="group"${op ? '' : ' inert'}><div>${build(k, p, d + 1, q)}</div></div>` : '');
    }).join('');
  }
  // while there is more of the tree below, its last row fades at the edge instead of being cut off
  // (a row's entrance lifts it a few pixels, so less than half a row more doesn't count)
  const edge = () => tree.classList.toggle('more', tree.scrollTop + tree.clientHeight < tree.scrollHeight - 12);
  c.on(tree, 'scroll', edge, { passive:true }); c.on(tree, 'transitionend', edge); c.on(tree, 'animationend', edge);
  const ro = new ResizeObserver(edge); ro.observe(tree); c.offs.push(() => ro.disconnect());
  function paint(){
    const q = inp.value.trim().toLowerCase();
    tree.innerHTML = build(T, '', 0, q);
    // nothing matches: the empty state says so, and Clear filter brings the tree back
    em.hidden = !!tree.children.length; tree.hidden = !tree.children.length;
    if (!tree.children.length) $('span:not(.fxp-em-art)', em).textContent = `Nothing in the project is called “${inp.value.trim()}”.`;
    $$('.fxp-n', tree).forEach(b => b.onclick = () => {
      if (b.dataset.d){ const p = b.dataset.p, k = b.nextElementSibling; const o = !open.has(p); o ? open.add(p) : open.delete(p); b.classList.toggle('open', o); b.setAttribute('aria-expanded', o); k.classList.toggle('shut', !o); k.inert = !o; }
      else { sel = b.dataset.p; $$('.fxp-n:not([data-d])', tree).forEach(x => { x.classList.toggle('sel', x === b); x.setAttribute('aria-selected', x === b); }); swap(st, sel); }
    });
    requestAnimationFrame(edge);
  }
  // a filter or Only changed moves the rows: the ones that stay glide to their new places, new ones rise in out of a short blur
  // and the ones that go fade where they were (reflow(), motion pieces); the card eases to its new height
  const repaint = () => reflow(() => $$('.fxp-n', tree), paint, { by:'data-p', root, host:tree, blur:true });
  inp.oninput = repaint;
  $('.pill', em).onclick = () => { inp.value = ''; repaint(); inp.focus({ preventScroll:true }); };
  chB.onclick = () => { only = !only; chB.setAttribute('aria-pressed', only); swap(st, only ? '6 files changed by the agent' : sel); repaint(); };
  st.textContent = sel; paint(); stagger($$('.fxp-n', tree), 25);
  // the card grows as folders open and shrinks as they close or the filter narrows (owner, 17 Nov: no room kept for later)
  c.offs.push(grow(root));
});
