// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, grow, hoverGlide, html, iconSwap, reflow, swap } from '../core/core.js';
DM.def('command-palette', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{search}', I('search'));
  // Clean's one hover: a highlight that glides from row to row (hoverGlide)
  c.offs.push(hoverGlide($('.cpl-list', r), '.cpl-i'));
  // [group, icon, label, keys, hint]; each group's tiles take its hue
  const C = [
    ['Agent','spark','Audit this page for contrast',['⌘','J'],'WCAG AA'],
    ['Agent','wand','Tidy layer names in the selection',null,'12 layers'],
    ['Agent','code','Export tokens as CSS variables',null,'tokens.css'],
    ['Go to','layers','Pricing v4',['G','P'],'Page'],
    ['Go to','figma','Checkout flow',null,'Figma file'],
    ['Go to','book','Memory',null,'Team notes'],
    ['Actions','users','Invite a teammate',null,'Acme Labs'],
    ['Actions','gear','Agent settings',['⌘',',']],
    ['Actions','palette','Switch theme',null,'Light']
  ];
  const TONE = { Agent:'pl', 'Go to':'pb', Actions:'pt' };
  const q = $('.cpl-q', r), list = $('.cpl-list', r), st = $('.cpl-st', r);
  list.id = 'cpl-l-' + Math.random().toString(36).slice(2, 7); list.setAttribute('aria-label', 'Commands'); list.tabIndex = -1;
  q.setAttribute('role', 'combobox'); q.setAttribute('aria-expanded', 'true'); q.setAttribute('aria-controls', list.id); q.setAttribute('aria-autocomplete', 'list');
  let items = [], hi = 0, last = C.map(x => x[2]).join('|');
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // the highlight is drawn once and kept, so it glides from the row it was on to the one a search leaves highlighted
  const hl = html('<span class="cpl-hl"></span>');
  function paint(){
    const v = q.value.trim(), re = v ? new RegExp('(' + v.split('').map(esc).join(').*?(') + ')', 'i') : null;
    const m = C.filter(x => !re || re.test(x[2]));
    // the list moves only when it changes, not on every letter that keeps it as it is: rows that stay glide to their new
    // places, new ones rise in out of a short blur and the ones that went fade where they were (reflow(), owner's trial of
    // 26 Nov), and the box eases to its new height (grow(), below)
    const key = m.map(x => x[2]).join('|') + (v ? '|ask' : ''), fresh = key !== last && !!items.length; last = key;
    let h = '', g = '';
    m.forEach(x => { if (x[0] !== g){ g = x[0]; h += `<div class="cpl-g" data-k="g:${g}">${g}</div>`; } const label = v ? x[2].replace(new RegExp(v.split('').map(esc).join('|'), 'gi'), s => `<mark>${s}</mark>`) : x[2], t = TONE[x[0]];
      h += `<button class="cpl-i" role="option" data-t="${x[2]}" data-k="${x[2]}"><span class="ic" style="--dm-tc:var(--dm-${t});--dm-tb:var(--dm-${t}-bg)">${I(x[1],'xs')}</span><span class="t">${label}</span>${x[4] ? `<span class="h">${x[4]}</span>` : ''}${x[3] ? `<span class="k">${x[3].map(k => `<span class="kbd">${k}</span>`).join('')}</span>` : ''}</button>`; });
    if (v) h += `<div class="cpl-g" data-k="g:Ask">Ask</div><button class="cpl-i ask" data-t="${v.replace(/"/g,'&quot;')}" data-k="ask" data-ask="1"><span class="ic">${I('spark','xs')}</span><span class="t">Ask the agent <span class="q">“${v.replace(/</g,'&lt;')}”</span></span><span class="kbd ent">↵</span></button>`;
    // (the rows are drawn again round the highlight, which stays where it is so its glide carries on)
    const draw = () => { [...list.children].forEach(x => { if (x !== hl) x.remove(); }); if (hl.parentNode !== list) list.prepend(hl); list.insertAdjacentHTML('beforeend', h); };
    if (fresh) reflow(() => $$('.cpl-i,.cpl-g', list), draw, { by:'data-k', root:list, host:list, blur:true }); else draw();
    items = $$('.cpl-i', list); hi = 0;
    // the search box keeps the focus and points at the highlighted row (aria-activedescendant), so the rows are not tab stops
    items.forEach((b, i) => { b.id = list.id + '-' + i; b.tabIndex = -1; b.setAttribute('role', 'option'); b.onmouseenter = () => move(i - hi); b.onclick = () => run(b); });
    if (!items.length) q.removeAttribute('aria-activedescendant'); move(0); edge();
  }
  function move(d){ if (!items.length) return; hi = (hi + d + items.length) % items.length; items.forEach((b, i) => { b.classList.toggle('hl', i === hi); b.setAttribute('aria-selected', i === hi); }); const b = items[hi]; q.setAttribute('aria-activedescendant', b.id); hl.style.top = b.offsetTop + 'px'; if (b.offsetTop < list.scrollTop || b.offsetTop + 36 > list.scrollTop + list.clientHeight) list.scrollTo({ top:b.offsetTop - 40, behavior:REDUCE ? 'auto' : 'smooth' }); }
  const edge = () => list.classList.toggle('more', list.scrollTop + list.clientHeight < list.scrollHeight - 2);
  c.on(list, 'scroll', edge, { passive:true });
  // a command that runs turns its tile into a spinner for a beat, then the footer says what ran
  // (nothing in it scales when pressed, owner 18 Nov)
  // (its glyph and the spinner crossfade, iconSwap(), and the footer's ↵ dips with it)
  function run(b){
    const ic = $('.ic', b), was = ic.innerHTML; key('Enter'); iconSwap(ic, () => { ic.innerHTML = '<span class="spin"></span>'; }, { inner:true });
    setTimeout(() => { if (ic.isConnected) iconSwap(ic, () => { ic.innerHTML = was; }, { inner:true }); swap(st, `<span class="dot"></span>${b.dataset.ask ? 'Sent to the agent' : 'Ran: ' + b.dataset.t}`, true); }, REDUCE ? 0 : 650);
  }
  // the key hints answer the keys: the one pressed (↑, ↓, ↵ or esc) dips for a moment, as a key cap does (owner's trial, 26 Nov)
  function key(k){ const el = $(`.kbd[data-k="${k}"]`, r); if (!el) return; el.classList.add('kp'); clearTimeout(el._kp); el._kp = setTimeout(() => el.classList.remove('kp'), 140); }
  q.oninput = paint;
  q.onkeydown = e => { if (/^(ArrowDown|ArrowUp|Escape)$/.test(e.key)) key(e.key); if (e.key === 'ArrowDown'){ move(1); e.preventDefault(); } else if (e.key === 'ArrowUp'){ move(-1); e.preventDefault(); } else if (e.key === 'Enter' && items[hi]) run(items[hi]); else if (e.key === 'Escape'){ q.value = ''; paint(); } };
  paint();
  // no room is kept for a longer list (owner, 18 Nov): the box is as tall as what it shows and eases to its new height as a
  // search narrows or widens it (grow(), centred in its stage), once its entrance (which scales it) has ended
  const pal = r.classList.contains('cpl') ? r : $('.cpl', r);
  if (pal && r === c.st) Promise.resolve().then(() => Promise.all(pal.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && pal.isConnected) c.offs.push(grow(pal)); });
  // the preview's story: someone types "tok" and runs the token export, then looks for "invi" and runs the invite; clicking,
  // focusing or typing in it takes over, and what it had typed goes
  c.story(async s => {
    await s.beat(3);
    await s.type(q, 'tok', { n:.36, each:paint });
    await s.beat(2); run(items[hi]); await s.beat(4);
    await s.type(q, '', { n:.36, each:paint, clear:true }); await s.beat(1);
    await s.type(q, 'invi', { n:.36, each:paint });
    await s.beat(2); run(items[hi]); await s.beat(4);
  });
});
