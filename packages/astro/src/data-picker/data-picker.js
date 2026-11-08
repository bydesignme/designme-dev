// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, centre, closePops } from '../core/core.js';
DM.def('data-picker', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)(?:\.(xs))?\}/g, (m, k, z) => I(k, z || 's'));
  const uid = 'fpk' + Math.random().toString(36).slice(2, 7);
  const box = $('.fpk', r), pop = $('.fpk-pop', r), q = $('.fpk-q input', r), ls = $('.fpk-ls', r), live = $('.fpk-live', r);
  // each data type has its colour: text blue, numbers green, lists orange, objects pink, yes or no yellow, dates teal
  const TY = { text:'b', number:'m', list:'p', object:'k', bool:'y', date:'t' };
  // the steps before Send the reply, in their order, and what each hands on: [field, type, sample]
  const S = [
    { id:'form', t:'Demo request form', k:'trigger', ic:'file-text', f:[['name', 'text', 'Priya Shah'], ['email', 'text', 'priya@corvid.io'], ['company', 'text', 'Corvid Analytics'], ['seats', 'number', '240'], ['sent_at', 'date', 'Nov 8, 10:41']] },
    { id:'lookup', t:'Company lookup', k:'tool', ic:'globe', f:[['employees', 'number', '420'], ['industry', 'text', 'Analytics software'], ['verified', 'bool', 'true']] },
    { id:'research', t:'Research and score', k:'ai', ic:'spark', f:[['score', 'number', '84'], ['tier', 'text', 'Enterprise'], ['reasons', 'list', '3 reasons'], ['company', 'object', '{ 5 fields }']] },
    { id:'reply', t:'Draft a reply', k:'ai', ic:'edit', f:[['subject', 'text', 'Your demo with Fernhill'], ['body', 'text', 'Hi Priya, thanks for writing']] }
  ];
  const F = { to:{ l:'To', v:['form.email'] }, subject:{ l:'Subject', v:['reply.subject', 'form.company'] }, body:{ l:'Body', v:['reply.body'] } };
  let target = null, items = [], hi = 0;
  ls.id = uid + '-ls'; q.setAttribute('aria-controls', ls.id);
  const say = t => { live.textContent = ''; c.later(40, () => { live.textContent = t; }); };
  const of = ref => { const [s, f] = ref.split('.'); return { st:S.find(x => x.id === s), f }; };
  const tokHTML = ref => { const { st, f } = of(ref);
    return `<span class="fpk-tok" data-ref="${ref}"><span class="fpk-ti" data-k="${st.k}" aria-hidden="true">${I(st.ic, 'xs')}</span><span class="s">${st.t}</span><span class="sep" aria-hidden="true">›</span><span class="f">${f}</span><button class="fpk-x" aria-label="Remove ${f} from ${st.t}" data-tip="Remove">${I('x', 'xs')}</button></span>`; };
  const addB = k => `<button class="fpk-add" data-f="${k}" data-pop=".fpk-pop" data-pop-pos="down" data-pop-align="end" aria-haspopup="dialog" aria-expanded="false" aria-label="Insert data into ${F[k].l}" data-tip="Insert data">${I('plus', 's')}</button>`;
  const paintField = k => { $(`.fpk-f[data-f="${k}"] .fpk-box`, r).innerHTML = (F[k].v.length ? F[k].v.map(tokHTML).join('') : '<span class="fpk-ph">Pick data from an earlier step</span>') + addB(k); };
  Object.keys(F).forEach(paintField);
  const mark = (t, v) => { const i = v ? t.toLowerCase().indexOf(v) : -1; return i < 0 ? t : t.slice(0, i) + '<mark>' + t.slice(i, i + v.length) + '</mark>' + t.slice(i + v.length); };
  function paint(){
    const v = q.value.trim().toLowerCase(); let h = '', n = 0; items = [];
    S.forEach((st, si) => {
      const fs = st.f.filter(([f]) => !v || f.toLowerCase().includes(v) || st.t.toLowerCase().includes(v)); if (!fs.length) return;
      h += `<div role="group" aria-labelledby="${uid}-g${si}"><div class="fpk-g" id="${uid}-g${si}"><span class="fpk-ti" data-k="${st.k}" aria-hidden="true">${I(st.ic, 'xs')}</span><b>${st.t}</b><span class="n">Step ${si + 1}</span></div>`
        + fs.map(([f, t, ex]) => { const ref = st.id + '.' + f, i = n++; items.push(ref);
          return `<div class="fpk-o" role="option" id="${uid}-o${i}" aria-selected="false" data-i="${i}" aria-label="${f}, ${t}, from ${st.t}"><span class="k">${mark(f, v)}</span><span class="tag ${TY[t]}">${t}</span><span class="ex">${ex}</span></div>`; }).join('') + '</div>';
    });
    ls.innerHTML = h || `<p class="fpk-e">No field matches “${q.value.trim().replace(/</g, '&lt;')}”</p>`;
    hi = 0; move(0);
  }
  function move(d){
    const os = $$('.fpk-o', ls); if (!os.length){ q.removeAttribute('aria-activedescendant'); return; }
    hi = (hi + d + os.length) % os.length;
    os.forEach((o, i) => { o.classList.toggle('on', i === hi); o.setAttribute('aria-selected', String(i === hi)); });
    q.setAttribute('aria-activedescendant', os[hi].id); os[hi].scrollIntoView({ block:'nearest' });
  }
  function pick(i){
    const ref = items[i]; if (!ref || !target) return; const k = target, { st, f } = of(ref);
    closePops();
    if (F[k].v.includes(ref)){ say(`${F[k].l} already has ${f} from ${st.t}`); return; }
    F[k].v.push(ref);
    const bx = $(`.fpk-f[data-f="${k}"] .fpk-box`, r), add = $('.fpk-add', bx), ph = $('.fpk-ph', bx); if (ph) ph.remove();
    add.insertAdjacentHTML('beforebegin', tokHTML(ref)); if (!REDUCE) add.previousElementSibling.classList.add('new');
    say(`Added ${f} from ${st.t} to ${F[k].l}`);
  }
  function remove(tk, mine){
    const k = tk.closest('.fpk-f').dataset.f, ref = tk.dataset.ref, { st, f } = of(ref), add = $('.fpk-add', tk.parentElement);
    F[k].v = F[k].v.filter(x => x !== ref);
    tk.classList.add('out'); tk.inert = true;
    setTimeout(() => { tk.remove(); if (!F[k].v.length) add.insertAdjacentHTML('beforebegin', '<span class="fpk-ph">Pick data from an earlier step</span>'); }, REDUCE ? 0 : 280);
    if (mine) add.focus({ preventScroll:true });
    say(`Removed ${f} from ${st.t}`);
  }
  // the picker opens from a field's +, on that field's data; a click puts the focus in its search
  c.on(r, 'click', e => {
    const b = e.target.closest('button');
    if (b && b.matches('.fpk-add')){ target = b.dataset.f; pop.setAttribute('aria-label', `Pick data for ${F[target].l}`); q.value = ''; paint(); if (e.isTrusted) setTimeout(() => { if (pop.classList.contains('open')) q.focus({ preventScroll:true }); }, 30); return; }
    if (b && b.matches('.fpk-x')){ remove(b.closest('.fpk-tok'), e.isTrusted); return; }
    const o = e.target.closest('.fpk-o'); if (o) pick(+o.dataset.i);
  });
  c.on(ls, 'pointermove', e => { const o = e.target.closest('.fpk-o'); if (o && +o.dataset.i !== hi){ hi = +o.dataset.i; move(0); } });
  c.on(q, 'input', paint);
  // in the search the arrows move through the fields and wrap, Enter puts the one picked in, Escape closes (the core)
  c.on(q, 'keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); move(e.key === 'ArrowDown' ? 1 : -1); } else if (e.key === 'Enter'){ e.preventDefault(); pick(hi); } });
  // the fields sit centred, and glide up as the picker opens under one of them
  const centred = centre(c, box, () => pop.classList.contains('open') ? Math.max(box.offsetHeight, pop.offsetTop + pop.offsetHeight) : box.offsetHeight);
  const mo = new MutationObserver(() => { if (pop.classList.contains('open')) centred(); else c.later(REDUCE ? 0 : 180, centred); });
  mo.observe(pop, { attributes:true, attributeFilter:['class'] }); c.offs.push(() => mo.disconnect());
  // the preview's story: take a field out of the subject, then open Body's picker, search for "sc" (the score, and every
  // field of Research and score), move down to the reasons with the arrows and put them in
  c.story(async s => {
    await s.beat(3);
    await s.tap($('.fpk-tok[data-ref="form.company"] .fpk-x', r)); await s.beat(2);
    await s.tap($('.fpk-add[data-f="body"]', r)); await s.beat(1.4);
    await s.type(q, 'sc', { each:paint, n:.3 }); await s.beat(1.2);
    for (let i = 0; i < 2; i++){ move(1); await s.beat(.8); }
    await s.beat(.6); await s.tap($('.fpk-o.on', r)); await s.beat(2.4);
  });
});
