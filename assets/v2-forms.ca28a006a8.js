TPLS["form"] = "<form class=\"fmx panel\" novalidate>\n  <div class=\"fmx-h\"><b>New project brief</b><button type=\"button\" class=\"pill line sm fmx-ai\">{spark}Draft with agent</button></div>\n  <label class=\"fmx-f\"><span>Project name<i class=\"fmx-dr\" role=\"img\" aria-label=\"Drafted by the agent\" data-tip=\"Drafted by the agent\">{spark}</i></span><input name=\"n\" placeholder=\"Pricing refresh\" maxlength=\"40\"><em class=\"fmx-c num\">0/40</em></label>\n  <label class=\"fmx-f\"><span>Goal<i class=\"fmx-dr\" role=\"img\" aria-label=\"Drafted by the agent\" data-tip=\"Drafted by the agent\">{spark}</i></span><textarea name=\"g\" rows=\"2\" placeholder=\"What should change, and why?\"></textarea></label>\n  <div class=\"fmx-f\"><span>Type</span><div class=\"fmx-ty\"><button type=\"button\" class=\"chip sm\" data-v=\"web\" data-tone=\"b\">Website</button><button type=\"button\" class=\"chip sm\" data-v=\"app\" data-tone=\"l\">App</button><button type=\"button\" class=\"chip sm\" data-v=\"brand\" data-tone=\"p\">Brand</button></div></div>\n  <label class=\"fmx-f\"><span>Due<i class=\"fmx-dr\" role=\"img\" aria-label=\"Drafted by the agent\" data-tip=\"Drafted by the agent\">{spark}</i></span><input name=\"d\" type=\"text\" placeholder=\"Nov 14\"></label>\n  <div class=\"fmx-ft\"><span class=\"fmx-ms muted\"></span><button class=\"pill primary sm fmx-go\" type=\"submit\">Create brief</button></div>\n</form>";
TPLS["search-input"] = "<div class=\"six\">\n  <div class=\"six-box\">\n    <div class=\"six-in\"><svg class=\"i xs\"><use href=\"#v2i-search\"/></svg><span class=\"six-chips\"></span><input placeholder=\"Search frames, files and docs\" aria-label=\"Search\" spellcheck=\"false\"><span class=\"kbd six-k\">⌘K</span><button class=\"ib six-x\" aria-label=\"Clear\" hidden><svg class=\"i xs\"><use href=\"#v2i-x\"/></svg></button></div>\n  </div>\n  <div class=\"pop six-pop\"><div class=\"six-res\"></div></div>\n</div>";
TPLS["tooltip"] = "<div class=\"ttp\">\n  <div class=\"ttp-bar panel\">\n    <button class=\"ib\" aria-label=\"Undo\" data-tip=\"Undo\" data-tip-k=\"⌘Z\">{undo}</button>\n    <button class=\"ib\" aria-label=\"Comment\" data-tip=\"Comment\" data-tip-k=\"C\">{chat}</button>\n    <button class=\"ib\" aria-label=\"Ask agent\" data-tip=\"Ask the agent\" data-tip-k=\"⌘J\">{spark}</button>\n    <span class=\"ttp-sep\"></span>\n    <button class=\"ib\" aria-label=\"Share\" data-tip=\"Share with your team\">{users}</button>\n    <span class=\"ttp-sep\"></span>\n    <span class=\"ttp-avs\"><button class=\"ttp-av\" data-card=\"0\" aria-label=\"Maya Kim\"><span class=\"av\" style=\"background:var(--av-l);color:var(--av-l-ink)\" data-pic=\"MK-g03\">MK</span></button><button class=\"ttp-av\" data-card=\"1\" aria-label=\"Design agent\"><span class=\"av\" style=\"background:var(--av-b);color:var(--av-b-ink)\">DA</span></button></span>\n  </div>\n  <div class=\"ttp-card panel\" aria-hidden=\"true\"><div class=\"ttp-ci\"></div></div>\n</div>";

/* ---------- Tooltip ---------- */
DM.def('tooltip', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{undo}', I('undo')).replace('{chat}', I('edit')).replace('{spark}', I('spark')).replace('{users}', I('users')).replace('{a1}', AV('MK','var(--av-l)','MK-g03')).replace('{a2}', AV('DA','var(--av-b)'));
  const P = [['MK','var(--av-l)','Maya Kim','Design lead','Editing Pricing, frame 2','MK-g03'],['DA','var(--av-b)','Design agent','Working for Maya','Auditing contrast, 2 of 6 checks']];
  const card = $('.ttp-card', r), ci = $('.ttp-ci', r), root = $('.ttp', r); let t, on = null, raf = 0, at = '';
  // Clean's one hover: a highlight that glides from button to button (hoverGlide)
  c.offs.push(hoverGlide($('.ttp-bar', r), '.ib,.ttp-av'));
  /* the card sits centred on its avatar, or right-aligned to it (left-aligned on the left) where the stage's edge is near,
     under it when there is room in the stage and over it when there isn't */
  const place = b => {
    const rr = root.getBoundingClientRect(), br = b.getBoundingClientRect(), w = card.offsetWidth, h = card.offsetHeight;
    const st = root.closest('.stage-in'), sb = st ? (st.closest('.stage-inner') || st.parentElement).getBoundingClientRect() : { left:0, right:innerWidth, top:0, bottom:innerHeight };
    const lo = Math.max(0, sb.left) + 8, hi = Math.min(innerWidth, sb.right) - 8;
    let x = br.left + br.width / 2 - w / 2; if (x + w > hi) x = Math.max(lo, br.right - w); else if (x < lo) x = Math.min(hi - w, br.left);
    const down = br.bottom + 10 + h <= Math.min(innerHeight, sb.bottom) - 8 || br.top - 10 - h < Math.max(0, sb.top) + 8;
    card.classList.toggle('up', !down);
    card.style.left = Math.round(x - rr.left) + 'px'; card.style.top = Math.round((down ? br.bottom + 10 : br.top - 10 - h) - rr.top) + 'px';
  };
  // while it shows it goes where its avatar goes (owner, 19 Nov: nothing places a tooltip once and leaves it)
  const follow = () => { raf = 0; if (!on || c.dead) return; const b = on.getBoundingClientRect(), k = `${b.left},${b.top}`; if (k !== at){ at = k; place(on); } raf = requestAnimationFrame(follow); };
  const open = (b, now) => { clearTimeout(t); t = setTimeout(() => { const p = P[+b.dataset.card];
      ci.innerHTML = `<div class="ttp-ch">${AV(p[0], p[1], p[5])}<div><b>${p[2]}</b><span>${p[3]}</span></div></div><div class="ttp-cs">${p[0] === 'DA' ? '<span class="think on" style="color:var(--accent-mark,var(--accent))"><i></i><i></i><i></i><i></i></span><span class="shim">' + p[4] + '</span>' : '<span class="dot"></span>' + p[4]}</div>`;
      on = b; at = ''; place(b); card.classList.add('show'); card.removeAttribute('aria-hidden'); cancelAnimationFrame(raf); raf = requestAnimationFrame(follow); }, now ? 0 : 300); };
  const close = () => { clearTimeout(t); on = null; cancelAnimationFrame(raf); card.classList.remove('show'); card.setAttribute('aria-hidden', 'true'); };
  // a person's card opens on hover after a short wait, and at once on keyboard focus; it closes as the pointer or focus leaves
  $$('.ttp-av', r).forEach(b => { b.onmouseenter = () => open(b); b.onmouseleave = () => { if (b !== document.activeElement || !b.matches(':focus-visible')) close(); };
    b.onfocus = () => { if (b.matches(':focus-visible')) open(b, true); }; b.onblur = close; });
  c.offs.push(() => { clearTimeout(t); cancelAnimationFrame(raf); });
  // once it has entered, it shows what it does: a shortcut tip, then the agent's card. Pointing at it takes over, as does
  // clicking, focusing or typing in it
  // what the demo opened goes when the pointer comes in, unless it is on that very control: the visitor's own hover decides
  // from then on, so no tip or card is left over from the demo over the one they point at
  let touched = false, shown = null;
  c.on(root, 'pointerenter', () => { touched = true;
    if (shown === 'tip' && tipFor && !tipNext && root.contains(tipFor) && !tipFor.matches(':hover')) hideTip();
    if (shown === 'card' && !$('.ttp-av:hover', r)) close();
    shown = null; });
  const go = () => { if (touched || c.mine) throw 'stop'; };
  c.run(async () => {
    await c.wait(1300); go(); if (tipFor) return;
    const ask = $('[data-tip-k="⌘J"]', r); showTip(ask); shown = 'tip'; await c.wait(1700); go(); if (tipFor === ask) hideTip(true); shown = null;
    await c.wait(500); go();
    const av = $('.ttp-av[data-card="1"]', r); open(av); shown = 'card'; await c.wait(2600); go(); close(); shown = null;
  });
});
/* ---------- Search input ---------- */
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
    const gy = parseFloat(root.style.getPropertyValue('--gy')) || 0, now = new DOMMatrixReadOnly(getComputedStyle(root).transform).m42, dy = gy - now;
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
/* ---------- Form ---------- */
DM.def('form', (r, c) => {
  r.innerHTML = r.innerHTML.split('{spark}').join(I('spark','xs'));
  const form = $('.fmx', r), n = $('[name=n]', r), g = $('[name=g]', r), d = $('[name=d]', r), cnt = $('.fmx-c', r), ms = $('.fmx-ms', r);
  // the card grows with its messages and eases to the confirmation's height, keeping no room for either
  c.offs.push(grow(form));
  // a button whose words change eases to their width, with no room kept for the longer ones
  const label = (b, h) => { const w0 = b.offsetWidth; b.innerHTML = h; const w1 = b.offsetWidth, cs = getComputedStyle(form);
    if (!REDUCE && w0 && Math.abs(w1 - w0) > .5) b.animate([{ width:w0 + 'px' }, { width:w1 + 'px' }], { duration:(parseFloat(cs.getPropertyValue('--t')) || .34) * 1000, easing:cs.getPropertyValue('--ease').trim() || 'ease' }); };
  let type = null;
  n.oninput = () => { cnt.textContent = n.value.length + '/40'; clear(n); };
  g.oninput = () => clear(g); d.oninput = () => clear(d);
  const chips = $$('.fmx-ty .chip', r);
  chips.forEach(ch => ch.onclick = () => { type = ch.dataset.v; chips.forEach(x => x.classList.toggle('on', x === ch)); clear(ch.parentElement); });
  function clear(el){ const f = el.closest('.fmx-f'); f.classList.remove('bad', 'ai'); $('.er', f)?.remove(); }
  function bad(el, t){ const f = el.closest('.fmx-f'); if (f.classList.contains('bad')) return; f.classList.add('bad'); f.insertAdjacentHTML('beforeend', `<span class="er">${t}</span>`); }
  async function type_(el, s){ el.closest('.fmx-f').classList.add('ai'); el.value = ''; for (const ch of s){ el.value += ch; el.dispatchEvent(new Event('input')); el.closest('.fmx-f').classList.add('ai'); await c.wait(18); } }
  // the agent's draft: the button says Drafting with the highlight sweep while it types, then goes back to Draft with agent;
  // each field it filled shows its sparkle, and the foot line says it once in words
  let drafting = false;
  $('.fmx-ai', r).onclick = () => { if (drafting) return; drafting = true; c.run(async () => {
    const b = $('.fmx-ai', r); label(b, '<span class="think on"><i></i><i></i><i></i><i></i></span><span class="shim">Drafting</span>');
    if (!n.value) await type_(n, 'Pricing refresh');
    await type_(g, 'Lift trial to paid by showing annual plans first and keeping one CTA per card.');
    if (!type) chips[0].click();
    if (!d.value) await type_(d, 'Nov 14');
    label(b, I('spark','xs') + 'Draft with agent'); swap(ms, 'Review what the agent drafted'); drafting = false;
  }); };
  // the preview has the agent fill it in once on its own, unless you take over first. The agent's typing keeps going under the
  // pointer (DM.PLAYS); the press that starts it waits while a mouse rests on the card
  c.auto(1400, function go(){ if (c.mine) return; if (r.matches(':hover')) return c.later(250, go); if (!n.value) $('.fmx-ai', r).click(); });
  let sent = false;
  form.onsubmit = e => { e.preventDefault(); let ok = true;
    if (!n.value.trim()){ bad(n, 'Give it a name'); ok = false; }
    if (g.value.trim().length < 12){ bad(g, 'Add a sentence about the goal'); ok = false; }
    if (!type){ bad(chips[0], 'Pick a type'); ok = false; }
    if (!ok) return swap(ms, 'A few fields need a look');
    if (sent) return; sent = true;
    c.run(async () => { const go = $('.fmx-go', r); label(go, '<span class="spin"></span><span class="shim">Creating</span>'); await c.wait(800);
      // the fields give way to the confirmation, and the card eases to its height
      const into = $(':scope>.dm-grow', form) || form;
      [...into.children].forEach(k => k.hidden = true); const dn = html(`<div class="fmx-done" role="status">${I('ok')}<b>${n.value} created</b><span class="muted">The agent is gathering references now</span></div>`); into.appendChild(dn); stagger([...dn.children], 70); }); };
});