// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, BRAND, DM, I, REDUCE, enter, html, seg, stagger, swap } from '../core/core.js';
DM.def('memory-panel', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{book}', I('book')).replace('{spark}', I('spark','xs'));
  // where a memory came from: an app's own mark, or an icon for something said in chat or an edit
  const ICON = { chat:'comment', edit:'edit' };
  const mark = s => BRAND[s] || I(ICON[s] || s, 'xs');
  const KIND = { brand:['Brand', 'var(--dm-pl)'], process:['Process', 'var(--dm-pt)'] };
  let M = [
    ['brand','Primary buttons use the accent blue, never black','figma','Pricing review in Figma, Sep 12'],
    ['brand','Headlines stay under eight words','chat','You told the agent, Aug 30'],
    ['process','Ask Maya before publishing to the shared library','slack','A thread in #design-system, Sep 4'],
    ['brand','Card radius is 16px on web, 12px in the app','github','tokens.css on GitHub, Sep 18'],
    ['process','Run the launch checklist before every PR','notion','Launch checklist in Notion, Sep 20'],
    ['process','File design bugs in the Design QA project','linear','DES-214 in Linear, Sep 26'],
    ['brand','No em dashes in product copy','drive','Voice and tone guide in Drive, Oct 2']
  ].map((m, i) => ({ id:i, k:m[0], t:m[1], from:m[2], s:m[3] }));
  const list = $('.mmx-list', r), st = $('.mmx-st', r), srcs = $('.mmx-srcs', r), fi = $('.mmx-fi', r), ft = $('.mmx-ft', r);
  let f = 'all', nid = 100;
  // the count, and the apps the memories came from
  const count = () => { swap(st, M.length + (M.length === 1 ? ' memory' : ' memories')); srcs.innerHTML = [...new Set(M.map(m => m.from).filter(s => BRAND[s]))].map(s => `<span>${BRAND[s]}</span>`).join(''); };
  const meta = m => `<span class="k">${KIND[m.k][0]}</span><span aria-hidden="true">·</span><span class="s">${m.s}</span>${m.isNew ? '<span class="tag nw">New</span>' : ''}${m.used ? '<span class="tag nw">Used</span>' : ''}`;
  const rowOf = m => $(`.mmx-m[data-id="${m.id}"]`, list);
  function item(m){
    const el = html(`<div class="mmx-m${m.isNew ? ' new' : ''}${m.learn ? ' learn' : ''}" data-id="${m.id}" style="--dm-k:${KIND[m.k][1]}"><span class="mmx-src" aria-hidden="true">${m.learn ? '<span class="spin"></span>' : mark(m.from)}</span><span class="mmx-b"><span class="t${m.learn ? ' shim' : ''}" spellcheck="false">${m.t}</span><span class="mmx-meta">${meta(m)}</span></span><span class="acts"><button class="ib ed" aria-label="Edit" data-tip="Edit">${I('edit','xs')}</button><button class="ib rm" aria-label="Forget" data-tip="Forget">${I('trash','xs')}</button></span></div>`);
    const t = $('.t', el);
    $('.ed', el).onclick = () => { t.contentEditable = 'true'; t.focus({ preventScroll:true }); const s = document.getSelection(); s.selectAllChildren(t); s.collapseToEnd();
      const done = () => { t.contentEditable = 'false'; m.t = t.textContent.trim() || m.t; m.s = 'Edited by you, just now'; m.from = 'edit'; t.textContent = m.t; update(m); count(); };
      t.onkeydown = e => { if (e.key === 'Enter'){ e.preventDefault(); t.blur(); } }; t.onblur = done; };
    $('.rm', el).onclick = () => { const i = M.indexOf(m); M.splice(i, 1); count();
      const g = html(`<div class="mmx-gone"><span>Forgot “${m.t.slice(0, 32)}${m.t.length > 32 ? '…' : ''}”</span><button>Undo</button></div>`); el.replaceWith(g); enter(g);
      const tm = setTimeout(() => { g.classList.add('leave'); setTimeout(() => g.remove(), 320); }, 4000);
      $('button', g).onclick = () => { clearTimeout(tm); M.splice(i, 0, m); count(); const n = item(m); g.replaceWith(n); enter(n); }; };
    return el;
  }
  // a memory's row catches up with its data: its source, its text once it has been learned, its tags and its highlight
  function update(m, pulse){
    const el = rowOf(m); if (!el) return;
    const src = $('.mmx-src', el), t = $('.t', el);
    if (!m.learn && el.classList.contains('learn')){ el.classList.remove('learn'); t.classList.remove('shim'); swap(t, m.t); src.innerHTML = mark(m.from); enter(src.firstElementChild); }
    else if (t.contentEditable !== 'true') src.innerHTML = mark(m.from);
    el.classList.toggle('new', !!m.isNew);
    $('.mmx-meta', el).innerHTML = meta(m);
    if (pulse){ el.classList.remove('use'); void el.offsetWidth; el.classList.add('use'); }
  }
  function paint(){ list.innerHTML = ''; M.filter(m => f === 'all' || m.k === f).forEach(m => list.appendChild(item(m))); stagger([...list.children], 40); }
  // a row that arrives opens its own height, so the panel grows smoothly instead of jumping
  const grow = el => { if (REDUCE) return; const cs = getComputedStyle(el), gap = parseFloat(getComputedStyle(list).rowGap) || 0, ease = getComputedStyle(r).getPropertyValue('--dm-ease').trim() || 'ease';
    el.animate([{ height:'0px', paddingTop:'0px', paddingBottom:'0px', marginBottom:-gap + 'px', opacity:0, filter:'blur(4px)', overflow:'hidden' }, { height:cs.height, paddingTop:cs.paddingTop, paddingBottom:cs.paddingBottom, marginBottom:'0px', opacity:1, filter:'blur(0px)', overflow:'hidden' }], { duration:560, easing:ease }); };
  seg($('.mmx-tab', r), v => { f = v; paint(); });
  count(); paint();
  // the preview: the agent learns a rule from your edit in Figma, then drafts an email in Gmail with three memories, which
  // pulse as it reads them. Every state lives in the memories' data, so switching tabs keeps it; taking over settles it
  c.run(async () => {
    await c.step(2200);
    const m = { id:nid++, k:'brand', t:'Learning from your edit in Pricing v4', from:'figma', s:'Just now', learn:true };
    const learnt = () => Object.assign(m, { learn:false, t:'Use “Start free” instead of “Sign up” on CTAs', s:'Your edit in Pricing v4, just now' });
    c.taken(() => { if (m.learn){ learnt(); update(m); } if (ft.classList.contains('shim')){ ft.classList.remove('shim'); fi.innerHTML = I('spark','xs'); swap(ft, 'Used in 14 answers this week'); } });
    M.unshift(m); count(); if (f === 'brand' || f === 'all'){ const el = item(m); list.prepend(el); grow(el); }
    await c.step(1500);
    learnt(); m.isNew = true; update(m);
    await c.step(2600);
    m.isNew = false; m.s = 'Your edit in Figma, today'; update(m);
    await c.step(1000);
    fi.innerHTML = BRAND.gmail; enter(fi.firstElementChild);
    ft.classList.add('shim'); swap(ft, 'Drafting the launch email in Gmail');
    await c.step(1100);
    let n = 0;
    for (const id of [m.id, 1, 6]){ const x = M.find(y => y.id === id); if (!x) continue; x.used = true; n++; update(x, true); await c.step(700); }
    ft.classList.remove('shim'); swap(ft, `Used ${n} ${n === 1 ? 'memory' : 'memories'} in the launch email draft`);
  });
});
