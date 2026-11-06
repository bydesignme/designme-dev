// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, html, stagger, swap } from '../core/core.js';
DM.def('change-review', (r, c) => {
  const F = [
    { n:'PricingCard.tsx', h:[ { t:'Use the shared button', l:[['ctx',14,'  return ('],['del',15,'    <button className="cta-old">'],['add',15,'    <Button variant="primary">'],['ctx',16,'      {plan.cta}']] }, { t:'Drop the second CTA', l:[['del',22,'    <a href="/contact">Talk to sales</a>'],['ctx',22,'  </Card>']] } ] },
    { n:'tokens.css', h:[ { t:'Raise muted text contrast', l:[['ctx',8,':root {'],['del',9,'  --text-muted: #c9cfd8;'],['add',9,'  --text-muted: #5b6472;'],['ctx',10,'  --radius-card: 16px;']] } ] },
    { n:'pricing.mdx', h:[ { t:'Move the FAQ below the table', l:[['del',31,'<FAQ />'],['ctx',31,'<CompareTable />'],['add',32,'<FAQ />']] } ] }
  ];
  const files = $('.crx-files', r), diff = $('.crx-diff', r), fn = $('.crx-fn', r);
  let add = 0, del = 0; F.forEach(f => f.h.forEach(h => h.l.forEach(l => { if (l[0] === 'add') add++; if (l[0] === 'del') del++; h.s = h.s || ''; })));
  $('.crx-tot', r).innerHTML = `<span style="color:var(--dm-ok)">+${add}</span> <span style="color:var(--dm-bad)">−${del}</span>`;
  files.innerHTML = F.map((f, i) => `<button class="crx-f" data-i="${i}"><span class="ft ${f.n.endsWith('tsx') ? 're' : ''}">${f.n.split('.').pop().toUpperCase()}</span><span class="nm">${f.n}</span><span class="st"><span class="dot"></span></span></button>`).join('');
  let cur = 0;
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  function fileState(i){ const hs = F[i].h, b = $$('.crx-f', files)[i]; const all = s => hs.every(h => h.s === s); b.classList.toggle('kept', all('kept')); b.classList.toggle('undone', all('undone')); $('.st', b).innerHTML = all('kept') ? I('check','xs') : all('undone') ? I('undo','xs') : hs.some(h => h.s) ? '<span class="dot" style="color:var(--dm-accent-mark,var(--dm-accent))"></span>' : '<span class="dot"></span>'; }
  function show(i, quiet){
    cur = i; $$('.crx-f', files).forEach((b, j) => b.classList.toggle('on', j === i)); swap(fn, 'src/' + F[i].n);
    diff.innerHTML = F[i].h.map((h, k) => `<div class="crx-hk ${h.s}" data-k="${k}"><div class="crx-hh">${I('spark','xs')}<span>${h.t}</span><span class="sp"></span><button class="pill ghost hk-u" aria-pressed="${h.s === 'undone'}">Undo</button><button class="pill hk-k" aria-pressed="${h.s === 'kept'}">Keep</button></div>${h.l.map(l => `<div class="crx-l ${l[0]}"><span class="ln">${l[1]}</span><span class="c">${esc(l[2])}</span><button class="cm" aria-label="Comment on line" data-tip="Comment">${I('plus','xs')}</button></div>`).join('')}</div>`).join('');
    if (!quiet) stagger($$('.crx-hk', diff), 70);
    $$('.crx-hk', diff).forEach(hk => { const h = F[i].h[+hk.dataset.k];
      const setS = s => { h.s = h.s === s ? '' : s; hk.className = 'crx-hk ' + h.s; $('.hk-k', hk).setAttribute('aria-pressed', String(h.s === 'kept')); $('.hk-u', hk).setAttribute('aria-pressed', String(h.s === 'undone')); fileState(i); };
      $('.hk-k', hk).onclick = () => setS('kept'); $('.hk-u', hk).onclick = () => setS('undone');
      $$('.cm', hk).forEach(b => b.onclick = () => { const ln = b.closest('.crx-l'); if (ln.nextElementSibling?.classList.contains('crx-cmt')) return;
        const box = html(`<div class="crx-cmt"><input placeholder="Ask the agent about this line"><button class="pill accent sm">Send</button></div>`); ln.after(box); enter(box); const inp = $('input', box); inp.focus({ preventScroll:true });
        const send = () => { const v = inp.value.trim() || 'Why this change?'; box.className = 'crx-cmt sent'; box.innerHTML = `${I('at','xs')}<span>${esc(v)}</span>`; enter(box); };
        $('button', box).onclick = send; inp.onkeydown = e => { if (e.key === 'Enter') send(); if (e.key === 'Escape') box.remove(); }; });
    });
  }
  $$('.crx-f', files).forEach(b => b.onclick = () => show(+b.dataset.i));
  const bulk = s => { F[cur].h.forEach(h => h.s = s); fileState(cur); show(cur); if (s === 'kept' && cur < F.length - 1) c.later(500, () => show(cur + 1)); };
  $('.crx-ok', r).onclick = () => bulk('kept'); $('.crx-rej', r).onclick = () => bulk('undone');
  F.forEach((_, i) => fileState(i)); show(0, true);
});
