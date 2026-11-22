// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, FLAG, I, REDUCE, centre } from '../core/core.js';
DM.def('country-select', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs'));
  const C = [
    ['United States','US',['#b22234','#fff','#3c3b6e'],1,'USD'],['United Kingdom','GB',['#012169','#fff','#c8102e'],0,'GBP'],['Germany','DE',['#000','#dd0000','#ffce00'],1,'EUR'],['France','FR',['#0055a4','#fff','#ef4135'],0,'EUR'],
    ['Netherlands','NL',['#ae1c28','#fff','#21468b'],1,'EUR'],['Ireland','IE',['#169b62','#fff','#ff883e'],0,'EUR'],['Italy','IT',['#009246','#fff','#ce2b37'],0,'EUR'],['Japan','JP',['#fff','#bc002d','#fff'],0,'JPY'],
    ['Canada','CA',['#d80621','#fff','#d80621'],0,'CAD'],['Spain','ES',['#aa151b','#f1bf00','#aa151b'],1,'EUR'],['Sweden','SE',['#006aa7','#fecc00','#006aa7'],1,'SEK'],['Australia','AU',['#012169','#fff','#e4002b'],0,'AUD']
  ];
  const f = $('.csx-f', r), pop = $('.csx-pop', r), q = $('.csx-q', r), list = $('.csx-list', r), h = $('.csx-h', r);
  let sel = C[1], hi = 0, opts = [];
  const flag = co => `<span class="csx-fl">${FLAG(co[1])}</span>`;
  /* the name and the hint crossfade to the country picked and always end on the latest one, so the name never stays on
     an earlier country while the flag (swapped at once) shows the new one */
  const put = (el, t) => { el._to = t; if (el._t || el.textContent === t) return; el.classList.add('sw', 'out');
    el._t = setTimeout(() => { el._t = 0; el.textContent = el._to; el.classList.remove('out'); }, REDUCE ? 0 : 170); };
  function setSel(co){ sel = co; $('.csx-fl', f).outerHTML = flag(co); put($('.csx-v', f), co[0]); put(h, 'Prices shown in ' + co[4]); }
  function paint(){
    const v = q.value.trim().toLowerCase(); const m = C.filter(co => !v || co[0].toLowerCase().includes(v) || co[1].toLowerCase() === v);
    list.innerHTML = (v ? '' : '<div class="csx-g">Suggested</div>') + m.map(co => `<button class="csx-o" role="option" id="${list.id}-${co[1]}" tabindex="-1" aria-selected="${co === sel}" data-c="${co[1]}">${flag(co)}${co[0]}<span class="cd">${co[4]}</span><span class="ck">${I('check','xs')}</span></button>`).join('') || '<div class="csx-g">No country found</div>';
    opts = $$('.csx-o', list); hi = Math.max(0, opts.findIndex(o => o.dataset.c === sel[1])); move(0);
    opts.forEach((o, i) => { o.onmouseenter = () => { hi = i; move(0); }; o.onclick = () => { setSel(C.find(x => x[1] === o.dataset.c)); close(); }; });
  }
  function move(d){ if (!opts.length){ q.removeAttribute('aria-activedescendant'); return; } hi = (hi + d + opts.length) % opts.length; opts.forEach((o, i) => o.classList.toggle('hl', i === hi)); opts[hi].scrollIntoView({ block:'nearest' }); q.setAttribute('aria-activedescendant', opts[hi].id); }
  list.id = 'csx-l-' + Math.random().toString(36).slice(2, 7); q.setAttribute('role', 'combobox'); q.setAttribute('aria-autocomplete', 'list'); q.setAttribute('aria-expanded', 'true'); q.setAttribute('aria-controls', list.id);
  // the field sits centred on its own, and glides up once as the list opens; it makes room for the list at its tallest,
  // so it holds still while typing filters the list
  const box = $('.csx', r), full = () => pop.offsetHeight - list.offsetHeight + parseFloat(getComputedStyle(list).maxHeight);
  const centred = centre(c, box, () => pop.classList.contains('open') ? Math.max(box.offsetHeight, pop.offsetTop + full()) : box.offsetHeight);
  function open(demo){ pop.classList.add('open'); f.setAttribute('aria-expanded', 'true'); q.value = ''; paint(); centred(); if (!demo) q.focus({ preventScroll:true }); }
  // on closing, the field waits for the list to fade before it glides back to the middle
  function close(){ pop.classList.remove('open'); f.setAttribute('aria-expanded', 'false'); c.later(REDUCE ? 0 : 180, centred); }
  f.onclick = () => pop.classList.contains('open') ? close() : open();
  q.oninput = paint;
  // in the search box the arrows move through the countries and wrap, Enter picks, and Escape closes the list and gives the
  // focus back to the field (Home and End stay with the text)
  q.onkeydown = e => { if (e.key === 'ArrowDown'){ move(1); e.preventDefault(); } else if (e.key === 'ArrowUp'){ move(-1); e.preventDefault(); } else if (e.key === 'Enter'){ e.preventDefault(); if (opts[hi]){ opts[hi].click(); f.focus({ preventScroll:true }); } } else if (e.key === 'Escape'){ e.preventDefault(); close(); f.focus({ preventScroll:true }); } };
  // Tab out of the list closes it
  c.on(pop, 'focusout', e => { if (pop.classList.contains('open') && e.relatedTarget && !pop.contains(e.relatedTarget) && e.relatedTarget !== f) close(); });
  // the field opens the list with the down and up arrows too, or takes the focus into it when it is already open
  c.on(f, 'keydown', e => { if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return; e.preventDefault(); if (pop.classList.contains('open')) q.focus({ preventScroll:true }); else open(); });
  c.on(document, 'pointerdown', e => { if (!r.contains(e.target)) close(); });
  $('.csx-v', f).textContent = sel[0]; f.insertAdjacentHTML('afterbegin', ''); $('.csx-fl', f).outerHTML = flag(sel);
  // the preview's story: open the list, type "ger", and pick Germany, which closes it on the new country. It stops at the
  // visitor's first click or key in the component, so it never types into their search or picks over their choice
  c.later(900, () => c.run(async () => { const on = () => { if (c.mine) throw 'stop'; };
    on(); open(true); await c.wait(500); for (const ch of 'ger'){ on(); q.value += ch; paint(); await c.wait(160); } await c.wait(1100); on(); if (opts[hi]) opts[hi].click(); }));
});
