// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, centre, html } from '../core/core.js';
DM.def('multi-select', (r, c) => {
  const uid = Math.random().toString(36).slice(2, 7);
  // tags for the pricing page, and how many files carry each
  const T = [['Accessibility', 14], ['Billing', 9], ['Copy', 22], ['Design system', 31], ['Launch', 12], ['Mobile', 18], ['Onboarding', 7], ['Pricing', 16], ['Research', 11], ['Tokens', 25], ['Tooltips', 6]];
  const f = $('.msc-f', r), q = $('.msc-q', r), pop = $('.msc-pop', r), list = $('.msc-list', r), key = $('.msc-key', r), label = $('.msc-l', r);
  q.id = 'msc-q-' + uid; label.htmlFor = q.id; list.id = 'msc-l-' + uid; q.setAttribute('aria-controls', list.id);
  let picked = ['Launch'], hi = 0, opts = [];
  const clr = $('.msc-clr', r);
  // the chips sit in the box before the input, each with its own remove button
  function chips(){
    $$('.msc-c', f).forEach(ch => ch.remove());
    picked.forEach(t => { const ch = html(`<span class="msc-c" data-t="${t}">${t}<button aria-label="Remove ${t}">${I('x','xs')}</button></span>`); $('button', ch).onclick = e => { e.stopPropagation(); remove(t); }; f.insertBefore(ch, q); });
    clr.hidden = !picked.length;
    place();
  }
  const place = () => { pop.style.top = (f.offsetTop + f.offsetHeight + 6) + 'px'; };
  function paint(){
    const v = q.value.trim().toLowerCase(), m = T.filter(([t]) => !v || t.toLowerCase().includes(v));
    list.innerHTML = m.length ? m.map(([t, n], i) => `<div class="msc-o" role="option" id="msc-o-${i}-${uid}" aria-selected="${picked.includes(t)}" data-t="${t}"><span class="bx">${I('check','xs')}</span>${t}<span class="n num">${n}</span></div>`).join('') : '<div class="msc-none">No tags match</div>';
    opts = $$('.msc-o', list); hi = Math.min(hi, Math.max(0, opts.length - 1)); move(0);
    opts.forEach((o, i) => { o.onmousemove = () => { if (hi !== i){ hi = i; move(0); } }; o.onmousedown = e => e.preventDefault(); o.onclick = () => toggle(o.dataset.t); });
  }
  function move(d){
    if (!opts.length){ q.removeAttribute('aria-activedescendant'); return; }
    hi = (hi + d + opts.length) % opts.length; opts.forEach((o, i) => o.classList.toggle('hl', i === hi));
    q.setAttribute('aria-activedescendant', opts[hi].id);
    const o = opts[hi], top = o.offsetTop, bot = top + o.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top; else if (bot > list.scrollTop + list.clientHeight) list.scrollTop = bot - list.clientHeight;
  }
  const isOpen = () => pop.classList.contains('open');
  // the box sits centred on its own, and glides up once as the list opens; it makes room for the list at its tallest, so it
  // holds still while typing filters the list. The list's place comes from the box, not its top mid-move, so chips
  // wrapping onto a new line move both together
  const box = $('.msc', r), full = () => pop.offsetHeight - list.offsetHeight + parseFloat(getComputedStyle(list).maxHeight);
  const centred = centre(c, box, () => isOpen() ? Math.max(box.offsetHeight, f.offsetTop + f.offsetHeight + 6 + full()) : box.offsetHeight);
  function open(){ if (isOpen()) return; place(); pop.classList.add('open'); q.setAttribute('aria-expanded', 'true'); hi = 0; paint(); centred(); }
  // on closing, the box waits for the list to fade before it glides back to the middle
  function close(){ pop.classList.remove('open'); q.setAttribute('aria-expanded', 'false'); q.removeAttribute('aria-activedescendant'); c.later(REDUCE ? 0 : 180, centred); }
  // Enter or a click picks a tag, or unpicks one already picked; the box clears for the next one
  function toggle(t){ picked = picked.includes(t) ? picked.filter(x => x !== t) : [...picked, t]; q.value = ''; chips(); paint(); hi = Math.max(0, opts.findIndex(o => o.dataset.t === t)); move(0); }
  function remove(t){ const ch = $(`.msc-c[data-t="${t}"]`, f); picked = picked.filter(x => x !== t); if (ch && !REDUCE){ ch.classList.add('go'); c.later(220, () => { chips(); if (isOpen()) paint(); }); } else { chips(); if (isOpen()) paint(); } }
  // a click on the box opens the list; only a real click takes the focus, so the preview never moves the page
  f.onclick = e => { if (e.target.closest('.msc-c')) return; if (e.isTrusted) q.focus({ preventScroll:true }); open(); };
  q.oninput = () => { open(); hi = 0; paint(); };
  q.onkeydown = e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); if (!isOpen()) return open(); move(e.key === 'ArrowDown' ? 1 : -1); }
    else if (e.key === 'Enter'){ e.preventDefault(); if (isOpen() && opts[hi]) toggle(opts[hi].dataset.t); else open(); }
    else if (e.key === 'Escape'){ if (isOpen()){ e.preventDefault(); close(); } }
    else if (e.key === 'Backspace' && !q.value && picked.length) remove(picked[picked.length - 1]);
    else if (e.key === 'Tab') close();
  };
  c.on(document, 'pointerdown', e => { if (!r.contains(e.target)) close(); });
  // Clear all takes every chip off at once; the cursor goes back to the box, so the next tag can be typed straight away
  clr.onmousedown = e => e.preventDefault();
  clr.onclick = e => { picked = []; chips(); if (isOpen()) paint(); if (e.isTrusted) q.focus({ preventScroll:true }); };
  chips();
  // the preview's story types and presses keys in the box without taking the focus, and shows each key as it goes
  const press = async (s, k, label) => { key.textContent = label || k; key.classList.add('on'); q.dispatchEvent(new KeyboardEvent('keydown', { key:k, bubbles:true })); await s.beat(2); key.classList.remove('on'); };
  const type = (s, text) => s.type(q, text, { n:.4, each:() => q.oninput(), keep:true });
  // the preview's story: add Pricing, pick Tooltips by mistake and take it off with Backspace, then add Tokens
  c.story(async s => {
    await s.beat(3);
    await s.tap(f); open(); s.away(); await s.beat(2);
    await type(s, 'pri'); await s.beat(1);
    await press(s, 'Enter');
    await type(s, 'to'); await s.beat(1);
    await press(s, 'ArrowDown', '↓');
    await press(s, 'Enter'); await s.beat(1);
    await press(s, 'Backspace');
    await type(s, 'tok'); await s.beat(1);
    await press(s, 'Enter');
    await press(s, 'Escape', 'Esc'); await s.beat(2);
  });
});
