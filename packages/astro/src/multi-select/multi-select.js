// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, centre, hoverGlide, html, placePop, popRoom } from '../core/core.js';
DM.def('multi-select', (r, c) => {
  const uid = Math.random().toString(36).slice(2, 7);
  // tags for the pricing page, and how many files carry each
  const T = [['Accessibility', 14], ['Billing', 9], ['Copy', 22], ['Design system', 31], ['Launch', 12], ['Mobile', 18], ['Onboarding', 7], ['Pricing', 16], ['Research', 11], ['Tokens', 25], ['Tooltips', 6]];
  const f = $('.msc-f', r), q = $('.msc-q', r), pop = $('.msc-pop', r), list = $('.msc-list', r), key = $('.msc-key', r), label = $('.msc-l', r);
  c.offs.push(hoverGlide(list, '.msc-o'));
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
  // the list hangs 6px under the box, which grows as the chips wrap; opened over the box, it stands 6px over it
  let up = false;
  const place = () => { if (up){ pop.style.top = 'auto'; pop.style.bottom = (box.offsetHeight - f.offsetTop + 6) + 'px'; } else { pop.style.top = (f.offsetTop + f.offsetHeight + 6) + 'px'; pop.style.bottom = ''; } };
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
  // the box sits centred on its own, and glides up as the list opens, so the two sit centred together at every moment, as
  // typing narrows the list too. The list's place comes from the box, not its top mid-move, so chips wrapping onto a new
  // line move both together
  const box = $('.msc', r), full = () => pop.offsetHeight - list.offsetHeight + parseFloat(getComputedStyle(list).maxHeight);
  const centred = centre(c, box, () => isOpen() && !up ? Math.max(box.offsetHeight, f.offsetTop + f.offsetHeight + 6 + pop.offsetHeight) : box.offsetHeight, [pop]);
  // the list opens under the box; on a page of your own, over it when the window has no room under the box (placePop)
  function drop(){
    up = false; centred();
    const gy = parseFloat(box.style.getPropertyValue('--dm-gy')) || 0, now = new DOMMatrixReadOnly(getComputedStyle(box).transform).m42, dy = gy - now;
    const room = popRoom(f), b = f.getBoundingClientRect(), below = room.bottom - b.bottom - dy, above = b.top + dy - room.top;
    // (in a demo's stage the list always opens under the field, which glides up to make room for it)
    up = !r.closest('.stage-in') && below < full() + 12 && above > below; if (up) centred();
    f.dataset.popPos = up ? 'up' : 'down'; placePop(f, pop); place();
  }
  function open(){ if (isOpen()) return; pop.classList.add('open'); q.setAttribute('aria-expanded', 'true'); hi = 0; paint(); drop(); }
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
