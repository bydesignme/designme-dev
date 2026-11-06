// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, hideTip, html, placePop, swap } from '../core/core.js';
DM.def('filter-menu', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{filter}', I('filter'));
  const OWN = { MK:'Maya Kim', LP:'Leo Park', AR:'Ana Ruiz', SC:'Sam Cole' };
  const ST = { open:'Open', prog:'In progress', done:'Done' };
  // the issues: title, status, owner and days since the last update, most recent first
  const T = [
    ['Pricing toggle hides the yearly saving', 'open', 'MK', 0], ['Plan cards wrap at 768px', 'open', 'MK', 1], ['Checkout button loses its focus ring', 'open', 'MK', 3],
    ['Invoice email shows the wrong currency', 'open', 'MK', 9], ['Seat slider skips 25', 'open', 'LP', 0], ['Coupon field accepts expired codes', 'open', 'LP', 2],
    ['Dark logo has a white edge', 'open', 'AR', 1], ['FAQ accordion jumps on open', 'open', 'AR', 5], ['Trial banner covers the nav', 'open', 'SC', 0],
    ['EU tax line rounds down', 'open', 'SC', 12], ['Annual plan link goes to a 404', 'open', 'LP', 20], ['Move pricing copy into the CMS', 'prog', 'MK', 0],
    ['Comparison table for Team', 'prog', 'MK', 2], ['Prices in yen for Japan', 'prog', 'LP', 4], ['New hero illustration', 'prog', 'AR', 1],
    ['Track plan clicks', 'prog', 'SC', 6], ['Enterprise contact form', 'prog', 'MK', 15], ['Seat limits on the Free plan', 'prog', 'AR', 3],
    ['Ship the new plan names', 'done', 'MK', 1], ['Price flicker on load', 'done', 'MK', 8], ['Remove the Starter plan', 'done', 'LP', 3],
    ['Badge for the yearly discount', 'done', 'AR', 2], ['Retry failed Stripe webhooks', 'done', 'SC', 25], ['Refund policy link', 'done', 'SC', 10]
  ].map(([t, s, o, a]) => ({ t, s, o, a })).sort((x, y) => x.a - y.a);
  // the fields a filter can use, the two ways each one reads, and its values. A value's c is how a chip says it
  const F = {
    status:{ l:'Status', ic:'target', ops:['is', 'is not'], o:Object.entries(ST).map(([v, l]) => ({ v, l, g:`<span class="dot" data-s="${v}"></span>` })), test:(t, v) => t.s === v },
    owner:{ l:'Owner', ic:'user', ops:['is', 'is not'], o:Object.entries(OWN).map(([v, l]) => ({ v, l, g:`<span class="av" data-o="${v}">${v}</span>` })), test:(t, v) => t.o === v },
    date:{ l:'Updated', ic:'cal', ops:['within', 'older than'], o:[{ v:1, l:'Past day', c:'1 day' }, { v:7, l:'Past 7 days', c:'7 days' }, { v:30, l:'Past 30 days', c:'30 days' }], test:(t, v) => t.a < v }
  };
  const tr = $('.flm-tr', r), pop = $('.flm-pop', r), l1 = $('.flm-l1', r), l2 = $('.flm-l2', r), chips = $('.flm-chips', r), ct = $('.flm-ct', r), clr = $('.flm-clr', r), list = $('.flm-list', r);
  // the filters in the order they were added: field, value, and whether it reads the other way (is not, older than)
  let A = [];
  const val = (k, v) => F[k].o.find(o => o.v === v);
  const match = (t, skip) => A.every(f => f.k === skip || F[f.k].test(t, f.v) !== f.neg);
  const age = a => a ? a + 'd' : 'Today';
  l1.insertAdjacentHTML('beforeend', Object.entries(F).map(([k, f]) => `<button class="mi" role="menuitem" aria-haspopup="menu" tabindex="-1" data-k="${k}">${I(f.ic)}<span>${f.l}</span><span class="r"></span>${I('chev-r','xs')}</button>`).join(''));
  const fields = $$('.mi', l1);
  function paint(){
    // chips: one per field, a new one pops in and the ones already there keep still
    const have = new Set(A.map(f => f.k));
    $$('.flm-ch', chips).forEach(ch => { if (!have.has(ch.dataset.k)) ch.remove(); });
    A.forEach(f => {
      let ch = $(`.flm-ch[data-k="${f.k}"]`, chips);
      if (!ch){ ch = html(`<div class="flm-ch" role="listitem" data-k="${f.k}"><span class="k">${F[f.k].l}</span><button class="op"></button><span class="v"></span><button class="x" data-tip="Remove filter">${I('x','xs')}</button></div>`); chips.appendChild(ch); wire(ch); }
      else ch.classList.add('seen');
      const o = val(f.k, f.v), op = F[f.k].ops[+f.neg], text = `${F[f.k].l} ${op} ${o.c || o.l}`;
      $('.op', ch).textContent = op; $('.v', ch).textContent = o.c || o.l;
      $('.op', ch).setAttribute('aria-label', `${text}: change to ${F[f.k].ops[+!f.neg]}`); $('.op', ch).dataset.tip = `Change to ${F[f.k].ops[+!f.neg]}`;
      $('.x', ch).setAttribute('aria-label', `Remove filter ${text}`);
    });
    // the menu shows each field's value, if it has one
    fields.forEach(m => { const f = A.find(x => x.k === m.dataset.k), o = f && val(f.k, f.v); $('.r', m).textContent = o ? (f.neg ? F[f.k].ops[1] + ' ' : '') + (o.c || o.l) : ''; });
    const hit = T.filter(t => match(t)), n = hit.length;
    swap(ct, A.length ? `${n} of ${T.length} issues` : `${T.length} issues`); clr.hidden = !A.length;
    // the four most recently updated, and how many more
    const old = new Set($$('.flm-r', list).map(x => x.dataset.t));
    list.innerHTML = n ? hit.slice(0, 4).map(t => `<div class="flm-r" data-t="${t.t}"><span class="dot" data-s="${t.s}" aria-label="${ST[t.s]}" role="img"></span><span class="t">${t.t}</span><span class="av" data-o="${t.o}" aria-label="${OWN[t.o]}" role="img">${t.o}</span><span class="a">${age(t.a)}</span></div>`).join('') + (n > 4 ? `<div class="flm-more">and ${n - 4} more</div>` : '')
      : '<div class="flm-e">No issues match these filters</div>';
    $$('.flm-r', list).forEach((x, i) => { if (!old.has(x.dataset.t)) enter(x, i * 50); });
  }
  function wire(ch){
    const k = ch.dataset.k;
    $('.op', ch).onclick = () => { const f = A.find(x => x.k === k); f.neg = !f.neg; paint(); };
    $('.x', ch).onclick = () => {
      const had = ch.contains(document.activeElement), next = ch.nextElementSibling || ch.previousElementSibling;
      A = A.filter(x => x.k !== k); hideTip(); paint();
      if (had) ((next && $('.x', next)) || tr).focus({ preventScroll:true });
    };
  }
  clr.onclick = () => { const had = clr === document.activeElement; A = []; paint(); if (had) tr.focus({ preventScroll:true }); };
  // the menu has two steps: the fields, then the values of the one picked. Each value says how many issues it would leave.
  // It opens and closes on its own rather than through the page's shared popover, so a story playing in the card beside it
  // can't close it. Closing it while the focus is inside gives the focus back to the Filter button
  let field = null;
  const items = () => $$('.mi', field ? l2 : l1), isOpen = () => pop.classList.contains('open');
  // the focus is the one highlight: a row the demo's pointer left lit goes dark
  const focusItem = m => { if (!m) return; $$('.mi', pop).forEach(x => { x.tabIndex = x === m ? 0 : -1; x.classList.remove('hl'); }); m.focus({ preventScroll:true }); };
  function show(on, focus){
    if (on && !isOpen()){ step(null); hideTip(); placePop(tr, pop); }
    pop.classList.toggle('open', on); pop.inert = !on; tr.setAttribute('aria-expanded', on);
    if (on && focus){ const all = items(); focusItem(focus === 'last' ? all[all.length - 1] : all[0]); }
    if (!on && pop.contains(document.activeElement)) tr.focus({ preventScroll:true });
  }
  function step(k){
    const had = pop.contains(document.activeElement), from = field;
    field = k; l1.hidden = !!k; l2.hidden = !k;
    if (k){
      const f = F[k], on = A.find(x => x.k === k);
      l2.setAttribute('aria-label', f.l);
      l2.innerHTML = `<button class="mi flm-bk" role="menuitem" tabindex="-1" aria-label="Back to all fields">${I('chev-l','xs')}<span>${f.l}</span></button><div class="sep" role="separator"></div>`
        + f.o.map(o => `<button class="mi" role="menuitemradio" aria-checked="${!!on && on.v === o.v}" tabindex="-1" data-v="${o.v}">${o.g || ''}<span>${o.l}</span><span class="r num">${T.filter(t => match(t, k) && f.test(t, o.v)).length}</span><span class="ck">${I('check','xs')}</span></button>`).join('');
      $('.flm-bk', l2).onclick = () => step(null);
      $$('.mi[data-v]', l2).forEach(m => m.onclick = () => {
        const v = k === 'date' ? +m.dataset.v : m.dataset.v, f = A.find(x => x.k === k);
        if (f){ f.v = v; f.neg = false; } else A.push({ k, v, neg:false });
        $$('.mi[data-v]', l2).forEach(x => x.setAttribute('aria-checked', x === m)); paint();
        // the pick shows for a moment before the menu fades
        c.later(120, () => show(false));
      });
    }
    if (had) focusItem(k ? ($('.mi[aria-checked="true"]', l2) || $$('.mi', l2)[1]) : $(`.mi[data-k="${from}"]`, l1) || fields[0]);
  }
  fields.forEach(m => m.onclick = () => step(m.dataset.k));
  // a click, Enter, Space or the down arrow opens it with the focus on the first field, the up arrow on the last.
  // A story's tap opens it without moving the focus
  c.on(tr, 'click', e => show(!isOpen(), e.isTrusted && 'first'));
  c.on(tr, 'keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); show(true, e.key === 'ArrowUp' ? 'last' : 'first'); } });
  c.on(document, 'pointerdown', e => { if (isOpen() && !pop.contains(e.target) && !tr.contains(e.target)) show(false); });
  c.on(window, 'resize', e => { if (e.isTrusted) show(false); });
  // inside the menu: the arrow keys move and wrap, Home and End jump to the ends, the right arrow opens a field's values
  // and the left arrow goes back, Escape closes it and Tab leaves it
  c.on(pop, 'keydown', e => {
    const all = items(), i = all.indexOf(document.activeElement);
    const go = { ArrowDown:all[(i + 1) % all.length], ArrowUp:all[(i - 1 + all.length) % all.length], Home:all[0], End:all[all.length - 1] }[e.key];
    if (go){ e.preventDefault(); focusItem(go); }
    else if (e.key === 'ArrowRight' && !field && all[i]){ e.preventDefault(); step(all[i].dataset.k); }
    else if (e.key === 'ArrowLeft' && field){ e.preventDefault(); step(null); }
    else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); show(false); }
    else if (e.key === 'Tab') setTimeout(() => show(false));
  });
  show(false); paint();
  // the preview's story: filter to open issues, then to Maya's, and watch the count drop; then take the status filter off
  c.story(async s => {
    await s.beat(3); await s.tap(tr); await s.beat(2);
    await s.tap($('.mi[data-k="status"]', l1)); await s.beat(2);
    await s.tap($('.mi[data-v="open"]', l2)); s.away(); await s.beat(4);
    await s.tap(tr); await s.beat(2);
    await s.tap($('.mi[data-k="owner"]', l1)); await s.beat(2);
    await s.tap($('.mi[data-v="MK"]', l2)); s.away(); await s.beat(4);
    await s.tap($('.flm-ch[data-k="status"] .x', chips)); s.away(); await s.beat(4);
  });
});
