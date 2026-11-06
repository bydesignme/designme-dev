// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, swap } from '../core/core.js';
DM.def('command-palette', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{search}', I('search'));
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
  function paint(){
    const v = q.value.trim(), re = v ? new RegExp('(' + v.split('').map(esc).join(').*?(') + ')', 'i') : null;
    const m = C.filter(x => !re || re.test(x[2]));
    // the rows play a short cascade only when the list changes, not on every letter that keeps it as it is
    const key = m.map(x => x[2]).join('|') + (v ? '|ask' : ''), fresh = key !== last; last = key;
    let h = '<span class="cpl-hl"></span>', g = '', n = 0;
    const cls = () => fresh ? ` in" style="animation-delay:${Math.min(n++, 6) * 28}ms` : '';
    m.forEach(x => { if (x[0] !== g){ g = x[0]; h += `<div class="cpl-g">${g}</div>`; } const label = v ? x[2].replace(new RegExp(v.split('').map(esc).join('|'), 'gi'), s => `<mark>${s}</mark>`) : x[2], t = TONE[x[0]];
      h += `<button class="cpl-i${cls()}" role="option" data-t="${x[2]}"><span class="ic" style="--dm-tc:var(--dm-${t});--dm-tb:var(--dm-${t}-bg)">${I(x[1],'xs')}</span><span class="t">${label}</span>${x[4] ? `<span class="h">${x[4]}</span>` : ''}${x[3] ? `<span class="k">${x[3].map(k => `<span class="kbd">${k}</span>`).join('')}</span>` : ''}</button>`; });
    if (v) h += `<div class="cpl-g">Ask</div><button class="cpl-i ask${cls()}" data-t="${v.replace(/"/g,'&quot;')}" data-ask="1"><span class="ic">${I('spark','xs')}</span><span class="t">Ask the agent <span class="q">“${v.replace(/</g,'&lt;')}”</span></span><span class="kbd ent">↵</span></button>`;
    list.innerHTML = h; items = $$('.cpl-i', list); hi = 0;
    // the search box keeps the focus and points at the highlighted row (aria-activedescendant), so the rows are not tab stops
    items.forEach((b, i) => { b.id = list.id + '-' + i; b.tabIndex = -1; b.setAttribute('role', 'option'); b.onmouseenter = () => move(i - hi); b.onclick = () => run(b); });
    if (!items.length) q.removeAttribute('aria-activedescendant'); move(0); edge();
  }
  function move(d){ if (!items.length) return; hi = (hi + d + items.length) % items.length; items.forEach((b, i) => { b.classList.toggle('hl', i === hi); b.setAttribute('aria-selected', i === hi); }); const b = items[hi], hl = $('.cpl-hl', list); q.setAttribute('aria-activedescendant', b.id); hl.style.top = b.offsetTop + 'px'; if (b.offsetTop < list.scrollTop || b.offsetTop + 36 > list.scrollTop + list.clientHeight) list.scrollTo({ top:b.offsetTop - 40, behavior:REDUCE ? 'auto' : 'smooth' }); }
  const edge = () => list.classList.toggle('more', list.scrollTop + list.clientHeight < list.scrollHeight - 2);
  c.on(list, 'scroll', edge, { passive:true });
  // a command that runs turns its tile into a spinner for a beat, then the footer says what ran
  function run(b){
    b.animate([{ transform:'scale(1)' },{ transform:'scale(.98)' },{ transform:'scale(1)' }], { duration:260, easing:'ease-out' });
    const ic = $('.ic', b), was = ic.innerHTML; ic.innerHTML = '<span class="spin"></span>';
    setTimeout(() => { if (ic.isConnected){ ic.innerHTML = was; enter(ic.firstElementChild); } swap(st, `<span class="dot"></span>${b.dataset.ask ? 'Sent to the agent' : 'Ran: ' + b.dataset.t}`, true); }, REDUCE ? 0 : 650);
  }
  q.oninput = paint;
  q.onkeydown = e => { if (e.key === 'ArrowDown'){ move(1); e.preventDefault(); } else if (e.key === 'ArrowUp'){ move(-1); e.preventDefault(); } else if (e.key === 'Enter' && items[hi]) run(items[hi]); else if (e.key === 'Escape'){ q.value = ''; paint(); } };
  paint();
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
