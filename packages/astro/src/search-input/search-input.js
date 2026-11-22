// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, centre, enter, grow, hoverGlide, placePop, popRoom, reflow } from '../core/core.js';
DM.def('search-input', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{search}', I('search','xs')).replace('{x}', I('x','xs'));
  // Clean's one hover: a highlight that glides from row to row (hoverGlide)
  c.offs.push(hoverGlide($('.six-pop', r), '.six-it'));
  const root = $('.six', r), box = $('.six-box', r), inp = $('.six-in input', r), pop = $('.six-pop', r), res = $('.six-res', r), chips = $('.six-chips', r), xB = $('.six-x', r), k = $('.six-k', r);
  const isOpen = () => pop.classList.contains('open');
  const ITEMS = [['figma','Pricing v4','Figma'],['figma','Pricing mobile','Figma'],['file-text','Pricing research notes','Notion'],['code','PricingCard.tsx','GitHub'],['figma','Checkout flow','Figma'],['file-text','Brand voice guide','Notion'],['code','tokens.css','GitHub']];
  const SC = { figma:'Figma', notion:'Notion', github:'GitHub' };
  let scope = null, at = null, ans = 0, grow = null, growTo = 0, hi = -1, lastPaint = 0;
  res.id = 'six-r-' + Math.random().toString(36).slice(2, 7); res.setAttribute('role', 'listbox'); res.setAttribute('aria-label', 'Suggestions');
  inp.setAttribute('role', 'combobox'); inp.setAttribute('aria-autocomplete', 'list'); inp.setAttribute('aria-expanded', 'false'); inp.setAttribute('aria-controls', res.id);
  // the agent's answer streams in word by word and keeps going while the question is still being typed
  const WS = 'Pricing changed on Sep 18: annual plans first, one CTA per card. Trial to paid is up 8.1 points since.'.split(' ');
  function paint(){
    // the list eases to its new height instead of jumping as the results change
    const h0 = isOpen() ? res.offsetHeight : 0; if (grow) grow.cancel();
    const v = inp.value.trim(); xB.hidden = !v && !scope; k.hidden = !!v || !!scope;
    let h = '', asking = false;
    if (/@\w*$/.test(v)){ const q = v.split('@').pop().toLowerCase(); h = '<div class="six-g">Filter by source</div>' + Object.entries(SC).filter(([key]) => key.startsWith(q)).map(([key, n]) => `<button class="six-it" data-sc="${n}"><span class="ic">${I(key === 'figma' ? 'figma' : key === 'github' ? 'code' : 'file-text','xs')}</span>${n}<span class="d">@${key}</span></button>`).join(''); }
    else if (!v && !scope){ h = '<div class="six-g">Recent</div>' + ['pricing contrast','checkout copy','tokens'].map(q => `<button class="six-it" data-q="${q}"><span class="ic">${I('history','xs')}</span>${q}</button>`).join(''); }
    else {
      const words = v.toLowerCase().split(/[^a-z0-9.]+/).filter(w => w.length > 2 && !['why','did','the','how','what','does'].includes(w)); const hit = i => !v || i[1].toLowerCase().includes(v.toLowerCase()) || words.some(w => i[1].toLowerCase().includes(w));
      const m = ITEMS.filter(i => (!scope || i[2] === scope) && hit(i)); const hw = words.find(w => m.some(i => i[1].toLowerCase().includes(w))) || v;
      // the answer shows once the agent has its first word, drawn with the words it already has, so the rows under it are
      // measured where they will stay
      asking = v.split(' ').length > 2 || v.endsWith('?');
      if (asking && ans) h += `<div class="six-ans">${I('spark','xs')}<span class="six-at">${WS.slice(0, ans).map(w => `<span class="w done">${w} </span>`).join('')}</span></div>`;
      h += m.length ? '<div class="six-g">Results</div>' + m.map(i => `<button class="six-it"><span class="ic">${I(i[0],'xs')}</span><span>${hw ? i[1].replace(new RegExp(hw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), s => `<mark>${s}</mark>`) : i[1]}</span><span class="d">${i[2]}</span></button>`).join('') : '<div class="six-g">No matches. Press Enter to ask the agent</div>';
    }
    // rows that were showing a moment ago glide to their new places as the answer line comes and goes or the results narrow,
    // new rows and the answer fade in, and rows that no longer match fade where they were, so typing never restarts the list.
    // Keys pressed faster than the rows could move (the preview types a letter every 45ms) redraw the list in place instead,
    // so no row is left behind its place, over another, while the next letter comes
    const draw = () => { res.innerHTML = h; [...res.children].forEach(x => x.dataset.key = x.matches('.six-ans') ? 'ans' : x.matches('.six-g') ? 'g' : x.textContent); };
    const t = performance.now(), quick = t - lastPaint < 150; lastPaint = t;
    if (quick){ const had = new Set([...res.children].map(x => x.dataset.key)); [...res.children].forEach(x => (x._rf || []).forEach(a => a.cancel())); draw(); [...res.children].forEach(x => { if (!had.has(x.dataset.key)) enter(x); }); }
    else reflow(() => [...res.children], draw, { root:pop });
    hi = -1; inp.removeAttribute('aria-activedescendant');
    $$('.six-it:not([data-ghost])', res).forEach((b, j) => { b.id = res.id + '-' + j; b.setAttribute('role', 'option'); b.setAttribute('aria-selected', 'false'); b.tabIndex = -1; });
    // a question gets an answer a word every 45ms; its first word brings the answer into the list
    if (asking){
      if (!at && ans < WS.length) at = c.every(45, () => { if (ans >= WS.length){ clearInterval(at); at = null; return; } const el = $('.six-ans:not([data-ghost]) .six-at', res); ans++; if (el) el.insertAdjacentHTML('beforeend', `<span class="w">${WS[ans - 1]} </span>`); else paint(); }); }
    else { if (at){ clearInterval(at); at = null; } ans = 0; }
    const h1 = res.offsetHeight;
    growTo = h1; if (h0 && h1 !== h0 && !REDUCE) grow = res.animate([{ height:h0 + 'px', boxSizing:'border-box', overflow:'hidden' }, { height:h1 + 'px', boxSizing:'border-box', overflow:'hidden' }], { duration:280, easing:'cubic-bezier(.22,1,.36,1)' });
    $$('.six-it[data-q]', res).forEach(b => b.onmousedown = e => { e.preventDefault(); inp.value = b.dataset.q; paint(); });
    $$('.six-it[data-sc]', res).forEach(b => b.onmousedown = e => { e.preventDefault(); scope = b.dataset.sc; inp.value = inp.value.replace(/@\w*$/, ''); chips.innerHTML = `<span class="six-ch">${scope}<button aria-label="Remove filter">${I('x','xs')}</button></span>`; enter(chips.firstChild); $('button', chips).onmousedown = ev => { ev.preventDefault(); scope = null; chips.innerHTML = ''; paint(); }; paint(); });
  }
  // the field sits centred on its own, and glides up as the list opens under it, so the two sit centred together. On a page of
  // your own the list opens over the field when the window has no room for it under the field (placePop), and keeps that side
  // while it is open, growing away from the field as the answer and the results come in
  let up = false;
  // (while the list eases to a new height, the field goes straight to where that height puts it, rather than chasing it)
  const listH = () => grow && grow.playState === 'running' ? pop.offsetHeight - res.offsetHeight + growTo : pop.offsetHeight;
  const centred = centre(c, root, () => isOpen() && !up ? box.offsetHeight + 6 + listH() : root.offsetHeight, [pop]);
  function place(){
    up = false; centred();
    const gy = parseFloat(root.style.getPropertyValue('--dm-gy')) || 0, now = new DOMMatrixReadOnly(getComputedStyle(root).transform).m42, dy = gy - now;
    const room = popRoom(box), b = box.getBoundingClientRect(), below = room.bottom - b.bottom - dy, above = b.top + dy - room.top;
    // (in a demo's stage the list always opens under the field, which glides up to make room for it)
    up = !r.closest('.stage-in') && below < pop.offsetHeight + 12 && above > below; if (up) centred();
    box.dataset.popPos = up ? 'up' : 'down'; placePop(box, pop);
    if (up){ pop.style.top = 'auto'; pop.style.bottom = 'calc(100% + 6px)'; } else pop.style.bottom = '';
  }
  // on closing, the field waits for the list to fade before it glides back to the middle
  function close(){ if (!isOpen()) return; pop.classList.remove('open'); inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); c.later(REDUCE ? 0 : 180, centred); }
  function shut(){ box.classList.remove('f'); close(); }
  const list = () => { if (isOpen()) return; pop.classList.add('open'); inp.setAttribute('aria-expanded', 'true'); place(); };
  inp.onfocus = () => { box.classList.add('f'); paint(); list(); };
  inp.onblur = shut;
  inp.oninput = () => { paint(); list(); };
  // the box is a combobox for the list under it: up and down move through the rows and wrap, Enter picks the highlighted
  // one, and Escape closes the list, keeping the focus in the box (a second Escape clears it)
  const light = k => { const all = $$('.six-it:not([data-ghost])', res); if (!all.length) return; hi = (k + all.length) % all.length;
    all.forEach((b, j) => { b.classList.toggle('hl', j === hi); b.setAttribute('aria-selected', j === hi); }); inp.setAttribute('aria-activedescendant', all[hi].id); all[hi].scrollIntoView({ block:'nearest' }); };
  inp.onkeydown = e => {
    if (e.key === 'Backspace' && !inp.value && scope){ scope = null; chips.innerHTML = ''; paint(); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); if (!isOpen()){ paint(); list(); } light(hi < 0 ? (e.key === 'ArrowDown' ? 0 : -1) : hi + (e.key === 'ArrowDown' ? 1 : -1)); }
    if (e.key === 'Enter' && hi >= 0 && isOpen()){ const b = $$('.six-it:not([data-ghost])', res)[hi]; if (b && b.onmousedown){ e.preventDefault(); b.onmousedown(e); } }
    if (e.key === 'Escape'){ e.preventDefault(); if (isOpen()) close(); else if (inp.value || scope){ inp.value = ''; scope = null; chips.innerHTML = ''; paint(); } } };
  xB.onmousedown = e => { e.preventDefault(); inp.value = ''; scope = null; chips.innerHTML = ''; paint(); };
  c.on(document, 'pointerdown', e => { if (!r.contains(e.target) && document.activeElement !== inp) shut(); });
  // the preview types a question on its own; clicking, focusing or typing in it takes over, and what it had typed goes
  c.auto(900, () => c.run(async () => { box.classList.add('f'); c.taken(() => { if (document.activeElement !== inp) shut(); }); paint(); list(); await c.step(600); await c.type(inp, 'why did pricing change?', { ms:45, each:paint }); }));
});
