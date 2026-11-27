TPLS["file-explorer"] = "<div class=\"fxp panel mx-grow\" data-reveal=\"flat\">\n  <div class=\"fxp-h\"><div class=\"fxp-s\"><svg class=\"i xs\"><use href=\"#v2i-search\"/></svg><input placeholder=\"Filter files\" aria-label=\"Filter files\" spellcheck=\"false\"></div><button class=\"ib fxp-ch mx-press\" aria-label=\"Only changed\" aria-pressed=\"false\" data-tip=\"Only changed files\"><svg class=\"i xs\"><use href=\"#v2i-filter\"/></svg></button></div>\n  <div class=\"fxp-tree mx-glide\" role=\"tree\" aria-label=\"Files\"></div>\n  <div class=\"fxp-em\" hidden><span class=\"fxp-em-art\" aria-hidden=\"true\"></span><b>No matching files</b><span></span><button class=\"pill line sm mx-press\">Clear filter</button></div>\n  <div class=\"fxp-f muted\"><span class=\"fxp-st\"></span></div>\n</div>";
TPLS["scheduled-runs"] = "<div class=\"shx panel mx-grow\" data-reveal=\"flat\">\n  <div class=\"shx-h\"><span class=\"shx-hi\" aria-hidden=\"true\"><svg class=\"i xs\"><use href=\"#v2i-clock\"/></svg></span><div><b>Scheduled runs</b></div></div>\n  <div class=\"shx-list\" role=\"list\" aria-label=\"Schedules\"></div>\n  <div class=\"shx-ft\"><button class=\"shx-add mx-press\" data-pop=\".shx-pop\" aria-haspopup=\"dialog\" aria-expanded=\"false\"><svg class=\"i xs\"><use href=\"#v2i-plus\"/></svg>New schedule</button></div>\n  <div class=\"pop shx-pop mx-pop\" role=\"dialog\" aria-label=\"New schedule\"><form class=\"shx-f\">\n    <h4>New schedule</h4>\n    <input class=\"shx-in\" placeholder=\"What should the agent do?\" aria-label=\"What should the agent do?\" spellcheck=\"false\" autocomplete=\"off\">\n    <div class=\"seg2 shx-rep\" role=\"group\" aria-label=\"Repeat\"><button type=\"button\" aria-pressed=\"true\" data-v=\"day\">Every day</button><button type=\"button\" aria-pressed=\"false\" data-v=\"mon\">Every Monday</button><button type=\"button\" aria-pressed=\"false\" data-v=\"custom\">Custom</button></div>\n    <div class=\"shx-days\" role=\"group\" aria-label=\"Days\" hidden></div>\n    <div class=\"shx-ff\"><span class=\"muted shx-sum\"></span><button class=\"pill accent sm shx-mk\" type=\"submit\" disabled>Create</button></div>\n  </form></div>\n</div>";
TPLS["knowledge-sources"] = "<div class=\"ksx panel mx-grow\" data-reveal=\"flat\">\n  <div class=\"ksx-h\"><span class=\"ksx-hi\" aria-hidden=\"true\"><svg class=\"i xs\"><use href=\"#v2i-book\"/></svg></span><div><b>Knowledge sources</b><span class=\"muted ksx-st\" aria-live=\"polite\"></span></div></div>\n  <div class=\"ksx-list mx-glide\" role=\"list\" aria-label=\"Sources\"></div>\n  <div class=\"ksx-em\"><span class=\"ksx-em-art\" aria-hidden=\"true\"></span><b>No sources yet</b><span>Add files, a website or a folder, and the agent reads them.</span><button class=\"pill line sm ksx-add2 mx-press\" data-pop=\".ksx-pop\" aria-haspopup=\"menu\" aria-expanded=\"false\"><svg class=\"i xs\"><use href=\"#v2i-plus\"/></svg>Add source</button></div>\n  <div class=\"ksx-ft\"><button class=\"ksx-add mx-press\" data-pop=\".ksx-pop\" aria-haspopup=\"menu\" aria-expanded=\"false\"><svg class=\"i xs\"><use href=\"#v2i-plus\"/></svg>Add source</button></div>\n  <div class=\"pop ksx-pop mx-pop mx-rows mx-glide\" role=\"menu\" aria-label=\"Add source\"></div>\n  <div class=\"pop ksx-mpop mx-pop mx-rows mx-glide\" role=\"menu\" aria-label=\"Source actions\"><button class=\"mi ksx-rs mx-press\" role=\"menuitem\" data-close>{refresh}Re-sync</button><div class=\"sep\"></div><button class=\"mi del ksx-rm mx-press\" role=\"menuitem\" data-close>{trash}Remove</button></div>\n  <input class=\"ksx-file\" type=\"file\" multiple hidden>\n</div>";
TPLS["tool-connections"] = "<div class=\"hnx panel mx-grow\" data-reveal=\"flat\">\n  <div class=\"hnx-h\"><span class=\"hnx-hi\" aria-hidden=\"true\"><svg class=\"i xs\"><use href=\"#v2i-link\"/></svg></span><div class=\"hnx-ht\"><b>Tools and connections</b></div><button class=\"pill ghost sm hnx-test mx-press\"><svg class=\"i xs\"><use href=\"#v2i-refresh\"/></svg><span>Test all</span></button></div>\n  <div class=\"hnx-list\" role=\"list\" aria-label=\"Tools\"></div>\n  <div class=\"hnx-ft\"><button class=\"hnx-add mx-press\" data-pop=\".hnx-pop\" aria-haspopup=\"menu\" aria-expanded=\"false\"><svg class=\"i xs\"><use href=\"#v2i-plus\"/></svg>Connect a tool</button><span class=\"muted hnx-st\" aria-live=\"polite\"></span></div>\n  <div class=\"pop hnx-pop mx-pop mx-rows mx-glide\" role=\"menu\" aria-label=\"Connect a tool\"></div>\n</div>";
TPLS["memory-panel"] = "<div class=\"mmx panel mx-grow mx-ic\" data-reveal=\"flat\">\n  <div class=\"mmx-h\"><span class=\"mmx-ic\"><svg class=\"i s\"><use href=\"#v2i-book\"/></svg></span><b class=\"mmx-ht\">Team memory</b><div class=\"seg2 mmx-tab\" role=\"group\" aria-label=\"Filter\"><button aria-pressed=\"true\" data-v=\"all\">All</button><button aria-pressed=\"false\" data-v=\"brand\">Brand</button><button aria-pressed=\"false\" data-v=\"process\">Process</button></div></div>\n  <div class=\"mmx-list mx-glide\"></div>\n  <div class=\"mmx-f\" aria-live=\"polite\"><span class=\"mmx-fi\" aria-hidden=\"true\">{spark}</span><span class=\"mmx-ft\">Used in 14 answers this week</span></div>\n</div>";
TPLS["command-palette"] = "<div class=\"cpl panel mx-ic mx-grow\" data-reveal=\"pop\">\n  <div class=\"cpl-in\">{search}<input class=\"cpl-q\" placeholder=\"Search or ask the agent\" aria-label=\"Command\" spellcheck=\"false\"><span class=\"kbd\" data-k=\"Escape\">esc</span></div>\n  <div class=\"cpl-list\" role=\"listbox\"></div>\n  <div class=\"cpl-f muted mx-foot\"><span class=\"cpl-st\"></span><span><span class=\"kbd\" data-k=\"ArrowUp\">↑</span><span class=\"kbd\" data-k=\"ArrowDown\">↓</span> move</span><span><span class=\"kbd\" data-k=\"Enter\">↵</span> run</span></div>\n</div>";
TPLS["run-drawer"] = "<div class=\"rdr\" data-reveal=\"flat\">\n  <div class=\"rdr-cv\"><div class=\"rdr-flow\" role=\"group\" aria-label=\"Steps of the workflow\"></div></div>\n  <div class=\"rdr-dw\" role=\"region\" aria-label=\"Run\">\n    <div class=\"rdr-grip\" role=\"separator\" aria-orientation=\"horizontal\" aria-label=\"Resize the run drawer\" tabindex=\"0\" aria-valuemin=\"120\" aria-valuemax=\"408\" aria-valuenow=\"312\"><i></i></div>\n    <div class=\"rdr-h\">\n      <button class=\"rdr-tg mx-press\" aria-expanded=\"true\">{chev-u.xs}<span><span class=\"w\">Test run </span><span class=\"rdr-id num\">#2088</span></span><span class=\"rdr-st tag run\"><span class=\"spin\"></span>Running</span></button>\n      <span class=\"rdr-meta num\"></span>\n      <span class=\"rdr-sp\"></span>\n      <div class=\"seg2 rdr-tabs\" role=\"group\" aria-label=\"Show\"><button aria-pressed=\"true\" data-v=\"steps\">Steps</button><button aria-pressed=\"false\" data-v=\"log\">Log</button><button aria-pressed=\"false\" data-v=\"data\">Data</button></div>\n      <button class=\"pill ghost sm rdr-stop mx-press\" aria-label=\"Stop the run\" data-tip=\"Stop the run\">{stop.xs}<span>Stop</span></button>\n      <button class=\"pill ghost sm rdr-again mx-press\" aria-label=\"Run again\" data-tip=\"Run again\" hidden>{refresh.xs}<span>Run again</span></button>\n      <button class=\"ib rdr-follow mx-press\" aria-pressed=\"true\" aria-label=\"Follow the run\" data-tip=\"Follow the run\">{target}</button>\n    </div>\n    <div class=\"rdr-b\">\n      <div class=\"rdr-v\" data-v=\"steps\"><div class=\"rdr-ax\" aria-hidden=\"true\"><span>Step</span><span class=\"rdr-sc\"></span><span class=\"ms\">Time</span></div><div class=\"rdr-rows mx-glide\" role=\"group\" aria-label=\"Steps of the run\"></div></div>\n      <div class=\"rdr-v\" data-v=\"log\" hidden><div class=\"rdr-lf\"><div class=\"seg2 rdr-lvs\" role=\"group\" aria-label=\"Level\"><button aria-pressed=\"true\" data-v=\"all\">All</button><button aria-pressed=\"false\" data-v=\"warn\">Warnings</button><button aria-pressed=\"false\" data-v=\"error\">Errors</button></div><span class=\"n num\"></span></div><ol class=\"rdr-log\" aria-label=\"Run log\"></ol></div>\n      <div class=\"rdr-v\" data-v=\"data\" hidden><div class=\"rdr-data\"><div class=\"rdr-ds mx-glide\" role=\"group\" aria-label=\"Steps\"></div><div class=\"rdr-io\"></div></div></div>\n    </div>\n    <p class=\"rdr-live\" aria-live=\"polite\"></p>\n  </div>\n</div>";
TPLS["zoom-bar"] = "<div class=\"zmb\">\n  <div class=\"zmb-bar\" role=\"toolbar\" aria-label=\"View\">\n    <button class=\"zmb-b mx-press zmb-undo\" aria-label=\"Undo\" data-tip=\"Undo\" data-tip-k=\"⌘Z\">{undo}</button>\n    <button class=\"zmb-b mx-press zmb-redo\" aria-label=\"Redo\" data-tip=\"Redo\" data-tip-k=\"⇧⌘Z\">{redo}</button>\n    <span class=\"zmb-sep\" aria-hidden=\"true\"></span>\n    <button class=\"zmb-b mx-press zmb-zo\" aria-label=\"Zoom out\" data-tip=\"Zoom out\" data-tip-k=\"−\">{minus}</button>\n    <button class=\"zmb-z mx-press num zmb-zl\" aria-label=\"Zoom 100%, zoom to 100%\" data-tip=\"Zoom to 100%\" data-tip-k=\"⇧0\">100%</button>\n    <button class=\"zmb-b mx-press zmb-zi\" aria-label=\"Zoom in\" data-tip=\"Zoom in\" data-tip-k=\"+\">{plus}</button>\n    <span class=\"zmb-sep\" aria-hidden=\"true\"></span>\n    <button class=\"zmb-b mx-press zmb-fit\" aria-label=\"Fit to screen\" data-tip=\"Fit to screen\" data-tip-k=\"⇧1\">{fit}</button>\n  </div>\n  <p class=\"zmb-live\" aria-live=\"polite\"></p>\n</div>";
TPLS["tool-rail"] = "<div class=\"tlr\">\n  <div class=\"tlr-bar\" role=\"toolbar\" aria-label=\"Tools\" aria-orientation=\"vertical\">\n    <div class=\"tlr-tools\" role=\"radiogroup\" aria-label=\"Tool\">\n      <button class=\"tlr-b mx-press\" role=\"radio\" aria-checked=\"true\" data-t=\"select\" aria-label=\"Select\" data-tip=\"Select\" data-tip-k=\"V\">{cursor}</button>\n      <button class=\"tlr-b mx-press\" role=\"radio\" aria-checked=\"false\" tabindex=\"-1\" data-t=\"hand\" aria-label=\"Pan\" data-tip=\"Pan\" data-tip-k=\"H\">{hand}</button>\n      <span class=\"tlr-sep\" aria-hidden=\"true\"></span>\n      <button class=\"tlr-b mx-press\" role=\"radio\" aria-checked=\"false\" tabindex=\"-1\" data-t=\"sticky\" aria-label=\"Sticky note\" data-tip=\"Sticky note\" data-tip-k=\"S\">{sticky}</button>\n      <button class=\"tlr-b mx-press\" role=\"radio\" aria-checked=\"false\" tabindex=\"-1\" data-t=\"pen\" aria-label=\"Pen\" data-tip=\"Pen\" data-tip-k=\"P\">{pen}</button>\n      <button class=\"tlr-b mx-press\" role=\"radio\" aria-checked=\"false\" tabindex=\"-1\" data-t=\"eraser\" aria-label=\"Eraser\" data-tip=\"Eraser\" data-tip-k=\"E\">{eraser}</button>\n      <button class=\"tlr-b mx-press\" role=\"radio\" aria-checked=\"false\" tabindex=\"-1\" data-t=\"shape\" aria-label=\"Shape\" data-tip=\"Shape\" data-tip-k=\"R\">{shape}</button>\n      <button class=\"tlr-b mx-press\" role=\"radio\" aria-checked=\"false\" tabindex=\"-1\" data-t=\"arrow\" aria-label=\"Connector\" data-tip=\"Connector\" data-tip-k=\"A\">{connector}</button>\n      <button class=\"tlr-b mx-press\" role=\"radio\" aria-checked=\"false\" tabindex=\"-1\" data-t=\"text\" aria-label=\"Text\" data-tip=\"Text\" data-tip-k=\"T\">{text}</button>\n      <span class=\"tlr-sep\" aria-hidden=\"true\"></span>\n      <button class=\"tlr-b mx-press\" role=\"radio\" aria-checked=\"false\" tabindex=\"-1\" data-t=\"comment\" aria-label=\"Comment\" data-tip=\"Comment\" data-tip-k=\"C\">{comment}</button>\n    </div>\n  </div>\n</div>";

/* ---------- Command palette ---------- */
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
      h += `<button class="cpl-i" role="option" data-t="${x[2]}" data-k="${x[2]}"><span class="ic" style="--tc:var(--${t});--tb:var(--${t}-bg)">${I(x[1],'xs')}</span><span class="t">${label}</span>${x[4] ? `<span class="h">${x[4]}</span>` : ''}${x[3] ? `<span class="k">${x[3].map(k => `<span class="kbd">${k}</span>`).join('')}</span>` : ''}</button>`; });
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
/* ---------- File explorer ---------- */
DM.def('file-explorer', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{search}', I('search','xs')).replace('{filter}', I('filter','xs'));
  // Clean's one hover: a highlight that glides from row to row (hoverGlide)
  c.offs.push(hoverGlide($('.fxp-tree', r), '.fxp-n', { keep:'.sel' }));
  const T = { n:'', k:[
    { n:'src', k:[
      { n:'components', k:[ { n:'PlanCard.tsx', s:'M' }, { n:'PriceTag.tsx', s:'A' }, { n:'Button.tsx' }, { n:'LegacyCTA.tsx', s:'D' } ] },
      { n:'styles', k:[ { n:'tokens.css', s:'M' }, { n:'globals.css' } ] },
      { n:'pages', k:[ { n:'pricing.mdx', s:'M' }, { n:'index.mdx' } ] }
    ]},
    { n:'public', k:[ { n:'og-pricing.png', s:'A' }, { n:'favicon.svg' } ] },
    { n:'package.json' }, { n:'README.md' }
  ]};
  const root = $('.fxp', r) || r, tree = $('.fxp-tree', r), inp = $('.fxp-s input', r), chB = $('.fxp-ch', r), st = $('.fxp-st', r), em = $('.fxp-em', r);
  // the folders open at first: the components the agent changed, with the other folders closed on their dots
  const open = new Set(['src','src/components']); let only = false, sel = 'src/components/PlanCard.tsx';
  const changed = n => n.s || (n.k && n.k.some(changed));
  const match = (n, q) => !q || n.n.toLowerCase().includes(q) || (n.k && n.k.some(k => match(k, q)));
  const ext = n => /\.(tsx)$/.test(n) ? 'code' : /\.css$/.test(n) ? 'palette' : /\.png|\.svg$/.test(n) ? 'image' : 'file-text';
  // each level steps in 14px from the top level's 9px, which puts its chevrons under the filter's search glyph
  function build(n, path, d, q){
    return n.k.filter(k => match(k, q) && (!only || changed(k))).map(k => {
      const p = path ? path + '/' + k.n : k.n, isD = !!k.k, op = isD && (open.has(p) || !!q || only);
      return `<button class="fxp-n${isD && op ? ' open' : ''}${p === sel ? ' sel' : ''}${k.s ? ' ' + k.s : ''}" data-p="${p}" ${isD ? `data-d="1" aria-expanded="${op}"` : `aria-selected="${p === sel}"`} style="padding-left:${9 + d * 14}px" role="treeitem"><span class="cv">${isD ? I('chev-r','xs') : ''}</span><span class="ic">${I(isD ? 'folder' : ext(k.n),'xs')}</span><span class="nm">${k.n}</span>${k.s ? `<span class="bd ${k.s}" aria-label="${{ M:'Modified', A:'Added', D:'Deleted' }[k.s]}">${k.s}</span>` : isD && changed(k) ? '<span class="ag" aria-hidden="true"></span>' : ''}</button>` + (isD ? `<div class="fxp-k${op ? '' : ' shut'}" role="group"${op ? '' : ' inert'}><div>${build(k, p, d + 1, q)}</div></div>` : '');
    }).join('');
  }
  // while there is more of the tree below, its last row fades at the edge instead of being cut off
  // (a row's entrance lifts it a few pixels, so less than half a row more doesn't count)
  const edge = () => tree.classList.toggle('more', tree.scrollTop + tree.clientHeight < tree.scrollHeight - 12);
  c.on(tree, 'scroll', edge, { passive:true }); c.on(tree, 'transitionend', edge); c.on(tree, 'animationend', edge);
  const ro = new ResizeObserver(edge); ro.observe(tree); c.offs.push(() => ro.disconnect());
  function paint(){
    const q = inp.value.trim().toLowerCase();
    tree.innerHTML = build(T, '', 0, q);
    // nothing matches: the empty state says so, and Clear filter brings the tree back
    em.hidden = !!tree.children.length; tree.hidden = !tree.children.length;
    if (!tree.children.length) $('span:not(.fxp-em-art)', em).textContent = `Nothing in the project is called “${inp.value.trim()}”.`;
    $$('.fxp-n', tree).forEach(b => b.onclick = () => {
      if (b.dataset.d){ const p = b.dataset.p, k = b.nextElementSibling; const o = !open.has(p); o ? open.add(p) : open.delete(p); b.classList.toggle('open', o); b.setAttribute('aria-expanded', o); k.classList.toggle('shut', !o); k.inert = !o; }
      else { sel = b.dataset.p; $$('.fxp-n:not([data-d])', tree).forEach(x => { x.classList.toggle('sel', x === b); x.setAttribute('aria-selected', x === b); }); swap(st, sel); }
    });
    requestAnimationFrame(edge);
  }
  // a filter or Only changed moves the rows: the ones that stay glide to their new places, new ones rise in out of a short blur
  // and the ones that go fade where they were (reflow(), motion pieces); the card eases to its new height
  const repaint = () => reflow(() => $$('.fxp-n', tree), paint, { by:'data-p', root, host:tree, blur:true });
  inp.oninput = repaint;
  $('.pill', em).onclick = () => { inp.value = ''; repaint(); inp.focus({ preventScroll:true }); };
  chB.onclick = () => { only = !only; chB.setAttribute('aria-pressed', only); swap(st, only ? '6 files changed by the agent' : sel); repaint(); };
  st.textContent = sel; paint(); stagger($$('.fxp-n', tree), 25);
  // the card grows as folders open and shrinks as they close or the filter narrows (owner, 17 Nov: no room kept for later)
  c.offs.push(grow(root));
});
/* ---------- Tool rail ---------- */
DM.def('tool-rail', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)\}/g, (m, k) => I(k));
  const bs = $$('.tlr-b', r), keys = Object.fromEntries(bs.map(b => [b.dataset.tipK.toLowerCase(), b]));
  // one tool at a time, like radio buttons: the picked one is checked and is the one Tab stops on
  const pick = b => bs.forEach(x => { const on = x === b; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
  bs.forEach(b => c.on(b, 'click', () => pick(b)));
  // the arrows move the pick along the rail, and a tool's letter picks it, while the focus is in the rail
  c.on($('.tlr-bar', r), 'keydown', e => {
    const d = { ArrowDown:1, ArrowRight:1, ArrowUp:-1, ArrowLeft:-1 }[e.key];
    const n = d ? bs[(bs.indexOf(document.activeElement) + d + bs.length) % bs.length] : !e.metaKey && !e.ctrlKey && !e.altKey && keys[e.key.toLowerCase()];
    if (!n) return; e.preventDefault(); pick(n); n.focus();
  });
  // the preview's story: try the pen, a sticky note and a comment, then back to Select
  const t = k => $(`.tlr-b[data-t="${k}"]`, r);
  c.story(async s => {
    await s.beat(2);
    await s.point(t('pen')); await s.beat(1.5); await s.tap(t('pen')); await s.beat(2.5);
    await s.point(t('sticky')); await s.beat(1.5); await s.tap(t('sticky')); await s.beat(2.5);
    await s.tap(t('comment')); await s.beat(2.5);
    await s.tap(t('select')); s.away(); await s.beat(2);
  });
});
/* ---------- Zoom bar ---------- */
DM.def('zoom-bar', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)\}/g, (m, k) => I(k));
  const zo = $('.zmb-zo', r), zi = $('.zmb-zi', r), zl = $('.zmb-zl', r), live = $('.zmb-live', r);
  // the levels minus and plus step through, as the Whiteboard's
  const STEPS = [.25, .33, .5, .67, .75, .9, 1, 1.25, 1.5, 2, 3, 4];
  let z = 1;
  const paint = say => { const p = Math.round(z * 100) + '%';
    zl.textContent = p; zl.setAttribute('aria-label', `Zoom ${p}, zoom to 100%`);
    zo.setAttribute('aria-disabled', String(z <= STEPS[0])); zi.setAttribute('aria-disabled', String(z >= STEPS[STEPS.length - 1]));
    if (say) live.textContent = 'Zoom ' + p; };
  const step = d => { const n = d > 0 ? STEPS.find(x => x > z + .001) : [...STEPS].reverse().find(x => x < z - .001); if (n){ z = n; paint(true); } };
  c.on(zo, 'click', () => step(-1)); c.on(zi, 'click', () => step(1)); c.on(zl, 'click', () => { z = 1; paint(true); });
  // minus, plus and Shift 0 step and reset the level while the focus is in the bar
  c.on($('.zmb-bar', r), 'keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const a = e.key === '-' || e.key === '−' ? () => step(-1) : e.key === '+' || e.key === '=' ? () => step(1) : e.shiftKey && (e.key === ')' || e.code === 'Digit0') ? () => { z = 1; paint(true); } : null;
    if (a){ e.preventDefault(); a(); }
  });
  paint();
  // the preview's story: zoom in twice, out once, undo, fit, and back to 100%
  c.story(async s => {
    await s.beat(2);
    await s.tap(zi); await s.beat(1.5); await s.tap(zi); await s.beat(2);
    await s.tap(zo); await s.beat(2);
    await s.point($('.zmb-undo', r)); await s.beat(1); await s.tap($('.zmb-undo', r)); await s.beat(2);
    await s.tap($('.zmb-fit', r)); await s.beat(2);
    await s.tap(zl); s.away(); await s.beat(2);
  });
});
/* ---------- Run drawer ---------- */
DM.def('run-drawer', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)(?:\.(xs))?\}/g, (m, k, z) => I(k, z || 's'));
  const uid = 'rdr' + Math.random().toString(36).slice(2, 7);
  const frame = $('.rdr', r), dw = $('.rdr-dw', r), flow = $('.rdr-flow', r), tg = $('.rdr-tg', r), stT = $('.rdr-st', r), idT = $('.rdr-id', r), meta = $('.rdr-meta', r);
  // where a row sits in the scrolling body (its offsets add up to the body: the list, which the gliding highlight positions, is
  // an offset parent of its own)
  const topIn = el => { let y = 0; for (let e = el; e && e !== bd && bd.contains(e); e = e.offsetParent) y += e.offsetTop; return y; };
  const bd = $('.rdr-b', r), rowsEl = $('.rdr-rows', r), sc = $('.rdr-sc', r), logEl = $('.rdr-log', r), cnt = $('.rdr-lf .n', r), ds = $('.rdr-ds', r), io = $('.rdr-io', r);
  // its motion pieces (26 Nov): one highlight glides from step to step in both lists, in every style; the picked step keeps its
  // own fill
  if (!r.closest('.ahx')) ['.rdr-rows', '.rdr-ds'].forEach(s => c.offs.push(hoverGlide($(s, r), s === '.rdr-rows' ? '.rdr-r' : 'button', { keep:'[aria-pressed="true"]' })));
  const stopB = $('.rdr-stop', r), againB = $('.rdr-again', r), followB = $('.rdr-follow', r), grip = $('.rdr-grip', r), live = $('.rdr-live', r);
  bd.id = uid + '-b'; tg.setAttribute('aria-controls', bd.id);
  // the workflow: each step with what it took in and handed on; an AI step's model and tool calls are its kids, as
  // [kind, name, icon, seconds, tokens, error]; the lookup is rate limited once, so it waits and tries again
  const STEPS = [
    { id:'form', t:'Demo request form', k:'trigger', ic:'file-text', d:.25, in:{ source:'Website form', form:'Book a demo' }, out:{ name:'Priya Shah', email:'priya@corvid.io', company:'Corvid Analytics', seats:240 }, log:['debug', 'New submission from priya@corvid.io'] },
    { id:'research', t:'Research and score', k:'ai', ic:'spark', in:{ company:'Corvid Analytics', email:'priya@corvid.io', seats:240 }, out:{ score:84, tier:'Enterprise', reasons:['Asked for 240 seats', 'Support team use case', 'Series B and hiring'] }, log:['info', 'Scored 84, Enterprise'],
      kids:[['model', 'Sonnet 5.5, reads the input', 'spark', .6, 380], ['tool', 'Company lookup', 'globe', 1.5, 0, '429 Too many requests'], ['retry', 'Wait 2s, then try again', 'refresh', 2], ['tool', 'Company lookup, try 2', 'globe', .7], ['model', 'Sonnet 5.5, writes the score', 'spark', 1.25, 1240]] },
    { id:'fit', t:'Good fit?', k:'branch', ic:'branch', d:.1, in:{ score:84, rule:'score is at least 70' }, out:{ path:'Yes' }, log:['info', 'score is 84, at least 70, so it took Yes'] },
    { id:'reply', t:'Draft a reply', k:'ai', ic:'edit', in:{ name:'Priya Shah', reasons:'3 reasons' }, out:{ subject:'Your demo with Fernhill', body:'Hi Priya, thanks for reaching out about 240 seats.' }, log:['info', 'Drafted "Your demo with Fernhill"'],
      kids:[['model', 'Sonnet 5.5, writes the reply', 'spark', 1.2, 980]] },
    { id:'approve', t:'Rep approves', k:'approval', ic:'user', ask:'Maya Kim or Theo Reed', in:{ ask:['Maya Kim', 'Theo Reed'], via:'Slack message', shows:'reply.body' }, out:{ decision:'Approved', by:'You' } },
    { id:'send', t:'Send the reply', k:'app', ic:'mail', d:.55, in:{ to:'priya@corvid.io', subject:'Your demo with Fernhill' }, out:{ message_id:'msg_8f2c41', sent:true }, log:['info', 'Sent to priya@corvid.io'] },
    { id:'post', t:'Post to Slack', k:'output', ic:'hash', d:.4, in:{ channel:'#inbound-leads', text:'Priya Shah at Corvid Analytics scored 84' }, out:{ ts:'1731062520.4' }, log:['info', 'Posted to #inbound-leads'] }
  ];
  const byId = id => STEPS.find(x => x.id === id);
  flow.innerHTML = STEPS.map((x, i) => (i ? '<span class="rdr-wire" aria-hidden="true"></span>' : '') + `<button class="rdr-nd" data-s="${x.id}" aria-pressed="false" aria-label="${x.t}" data-tip="${x.t}"><span class="rdr-ti" data-k="${x.k}" aria-hidden="true">${I(x.ic, 'xs')}</span><span class="t">${x.t}</span><span class="rdr-ns" aria-hidden="true">${I('check', 'xs')}</span></button>`).join('');
  let run = 2087, R = null, tab = 'steps', lvl = 'all', follow = true, picked = null, last = 0;
  const say = t => { live.textContent = ''; c.later(40, () => { live.textContent = t; }); };
  const secs = v => (v < 10 ? v.toFixed(1) : Math.round(v)) + 's';
  const stamp = v => { const m = Math.floor(v / 60), s = v - m * 60; return String(m).padStart(2, '0') + ':' + s.toFixed(2).padStart(5, '0'); };
  // a run: its spans (one per step and per model or tool call) and its log, planned up to the step that waits for a person
  function plan(from, t0){
    for (let i = from; i < STEPS.length; i++){
      const x = STEPS[i];
      if (x.ask){ R.sp.push({ s:x.id, t:x.t, k:x.k, ic:x.ic, lv:0, a:t0, e:null, st:'wait' }); R.log.push({ at:t0, l:'warn', b:x.t, m:`Waiting for ${x.ask}` }); R.pause = { i, at:t0 }; return; }
      if (!x.kids){ R.sp.push({ s:x.id, t:x.t, k:x.k, ic:x.ic, lv:0, a:t0, e:t0 + x.d, st:'ok' }); t0 += x.d; R.log.push({ at:t0, l:x.log[0], b:x.t, m:x.log[1] }); continue; }
      const p = { s:x.id, t:x.t, k:x.k, ic:x.ic, lv:0, a:t0, e:null, st:'ok' }; R.sp.push(p);
      for (const [k, t, ic, d, tok, err] of x.kids){
        R.sp.push({ s:x.id, t, k, ic, lv:1, a:t0, e:t0 + d, st:err ? 'bad' : 'ok', tok, err });
        if (k === 'model') R.log.push({ at:t0 + d, l:'debug', b:t, m:`${tok.toLocaleString('en-US')} tokens` });
        if (err) R.log.push({ at:t0 + d, l:'error', b:t, m:err });
        if (k === 'retry') R.log.push({ at:t0, l:'warn', b:'Company lookup', m:'Trying again in 2s, try 2 of 2' });
        if (k === 'tool' && !err) R.log.push({ at:t0 + d, l:'info', b:'Company lookup', m:'Found Corvid Analytics on try 2' });
        t0 += d;
      }
      p.e = t0; R.log.push({ at:t0, l:x.log[0], b:x.t, m:x.log[1] });
    }
    R.end = t0; R.log.push({ at:t0, l:'info', b:'Run passed', m:`${secs(t0)}, 1 retry` });
  }
  function start(){
    R = { id:++run, t:0, st:'run', sp:[], log:[], pause:null, end:null, rows:new Map(), logN:0 };
    R.log.push({ at:0, l:'info', b:'Run started', m:'Test run with Priya Shah, Corvid Analytics' });
    plan(0, 0); rowsEl.innerHTML = ''; logEl.innerHTML = ''; picked = null; idT.textContent = '#' + R.id;
    stopB.hidden = false; againB.hidden = true; paint(true); say(`Test run #${R.id} started`);
  }
  const node = id => $(`.rdr-nd[data-s="${id}"]`, flow);
  function stateOf(sp, t){ if (sp.st === 'stop') return 'stop'; if (sp.e == null) return R.st === 'stopped' ? 'stop' : sp.st; return t < sp.e ? (sp.k === 'retry' ? 'retry' : 'run') : sp.st; }
  // the canvas, the timeline, the log, the data and the head all follow the run's clock
  function paint(force){
    const t = R.t, sps = R.sp.filter(x => x.a <= t + 1e-6);
    // the steps on the canvas: the one under way ringed, a retry or a wait amber, done ones ticked
    STEPS.forEach((x, i) => {
      const mine = sps.filter(p => p.s === x.id), main = mine.find(p => p.lv === 0);
      let st = '';
      if (main){ const ms = stateOf(main, t);
        if (ms === 'run'){ const cur = mine.filter(p => p.lv === 1).pop(); st = cur && (cur.k === 'retry' || (cur.st === 'bad' && t >= cur.e)) ? 'retry' : 'run'; } else st = ms; }
      const el = node(x.id); if (el.dataset.st !== st){ el.dataset.st = st; if (st === 'run' && follow && R.st === 'run'){ const l = el.offsetLeft - flow.clientWidth / 2 + el.offsetWidth / 2; flow.scrollTo({ left:l, behavior:REDUCE ? 'auto' : 'smooth' }); } }
      const w = el.previousElementSibling; if (w) w.classList.toggle('done', !!main);
    });
    // the timeline's axis grows with the run
    const span = Math.max(10, Math.ceil((t + .5) / 2) * 2), wpx = sc.clientWidth || 240, step = [2, 5, 10, 20].find(x => span / x * 34 <= wpx) || 20;
    const key = span * 100 + step; if (key !== R.ax){ R.ax = key; rowsEl.style.setProperty('--rdr-g', (step / span * 100) + '%'); sc.innerHTML = Array.from({ length:Math.floor(span / step) }, (_, i) => `<span style="left:${i * step / span * 100}%">${i * step}s</span>`).join(''); }
    sps.forEach(p => {
      let el = R.rows.get(p);
      if (!el){
        el = html(`<button class="rdr-r" data-s="${p.s}" data-k="${p.k}" data-lv="${p.lv}" style="--lv:${p.lv}" aria-pressed="${p.s === picked}"><span class="rdr-n"><span class="rdr-ti" data-k="${p.k}" aria-hidden="true">${I(p.ic, 'xs')}</span><span class="rdr-nm">${p.t}</span></span><span class="rdr-bt"><i></i></span><span class="rdr-ms num"></span></button>`);
        R.rows.set(p, el); rowsEl.appendChild(el); if (!force && !REDUCE) el.classList.add('in');
      }
      const st = stateOf(p, t), e = p.e == null ? t : Math.min(p.e, t);
      el.dataset.st = st; el.classList.toggle('run', st === 'run');
      const i = $('.rdr-bt i', el); i.style.left = (p.a / span * 100) + '%'; i.style.width = Math.max(.6, (e - p.a) / span * 100) + '%';
      $('.rdr-ms', el).textContent = st === 'wait' ? 'Waiting' : st === 'bad' && p.e != null ? 'Failed' : st === 'stop' ? 'Stopped' : secs(e - p.a);
      el.setAttribute('aria-label', `${p.t}, ${{ run:'running', retry:'waiting to try again', wait:'waiting for approval', bad:'failed', stop:'stopped', ok:'done' }[st]}, ${secs(e - p.a)}`);
    });
    // a person's yes, under the step that waits for it
    const ask = $('.rdr-ask', rowsEl);
    if (R.st === 'wait' && !ask){ const p = R.sp[R.sp.length - 1], x = byId(p.s), el = R.rows.get(p);
      if (el) el.insertAdjacentHTML('afterend', `<div class="rdr-ask${REDUCE ? '' : ' in'}" role="group" aria-label="${x.t} waits for you"><svg class="rdr-sgi" viewBox="0 0 24 24" aria-hidden="true"><path class="a" d="M12 3.6 2.6 19.9h18.8z"/><path class="b" d="M12 9.6v4.4M12 17v.01"/></svg><span class="tx"><b>${x.t} is waiting for you</b><span>Live runs ask ${x.ask} in Slack. In a test, you decide.</span></span><span class="acts"><button class="pill line sm" data-a="no">Reject</button><button class="pill warn sm" data-a="yes">${I('check', 'xs')}Approve</button></span></div>`); }
    if (R.st !== 'wait' && ask) ask.remove();
    // the log, a line at a time, its levels in colour
    const L = R.log.filter(l => l.at <= t + 1e-6).sort((a, b) => a.at - b.at);
    for (; R.logN < L.length; R.logN++){ const l = L[R.logN];
      const li = html(`<li class="rdr-l" data-l="${l.l}"><span class="t num">${stamp(l.at)}</span><span class="lv tag" data-l="${l.l}">${l.l}</span><span class="m"><b>${l.b}</b> <span>${l.m}</span></span></li>`);
      li.hidden = lvl !== 'all' && l.l !== lvl; logEl.appendChild(li); if (!force && !REDUCE && !li.hidden) li.classList.add('in'); }
    filterLog(false);
    // the newest line in view while the run is followed
    if (follow && (R.st === 'run' || R.st === 'wait' || force)){ if (tab === 'steps'){ const b = rowsEl.lastElementChild; if (b && topIn(b) + b.offsetHeight > bd.scrollTop + bd.clientHeight) bd.scrollTop = topIn(b) + b.offsetHeight - bd.clientHeight + 6; } if (tab === 'log') bd.scrollTop = bd.scrollHeight; }
    // the head: the run's state, its time, tokens and cost
    const tag = { run:['run', '<span class="spin"></span>Running'], wait:['warn', 'Waiting'], ok:['ok', 'Passed'], bad:['bad', 'Failed'], stopped:['', 'Stopped'] }[R.st];
    if (stT.dataset.s !== R.st){ stT.dataset.s = R.st; stT.className = 'rdr-st tag ' + tag[0]; stT.innerHTML = tag[1]; }
    const tok = Math.round(R.sp.filter(p => p.tok && p.a <= t).reduce((n, p) => n + p.tok * Math.min(1, (t - p.a) / (p.e - p.a)), 0));
    meta.textContent = [secs(t), tok ? `${(tok / 1000).toFixed(1)}k tokens` : '', tok ? `$${(tok * .0000045).toFixed(3)}` : ''].filter(Boolean).join(', ');
    if (tab === 'data' && (force || Math.floor(t * 2) !== R.dq)){ R.dq = Math.floor(t * 2); paintData(); }
  }
  function filterLog(anim){ let n = 0; $$('.rdr-l', logEl).forEach(li => { const show = lvl === 'all' || li.dataset.l === lvl; if (li.hidden === show){ li.hidden = !show; if (show && anim && !REDUCE){ li.classList.remove('in'); void li.offsetWidth; li.classList.add('in'); } } if (show) n++; });
    cnt.textContent = `${n} ${n === 1 ? 'line' : 'lines'}`;
    let e = $('.rdr-le', logEl.parentElement); if (!n && !e){ logEl.insertAdjacentHTML('afterend', `<p class="rdr-le">No ${lvl === 'warn' ? 'warnings' : 'errors'} in this run.</p>`); } if (n && e) e.remove(); }
  // the data each finished step took in and handed on, as JSON
  const json = o => JSON.stringify(o, null, 2).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/("[^"]*")(\s*:)?|\b(-?\d+(?:\.\d+)?|true|false|null)\b/g, (m, s, colon, n) => s ? (colon ? `<span class="k">${s}</span>${colon}` : `<span class="s">${s}</span>`) : `<span class="n">${n}</span>`);
  function paintData(){
    const t = R.t, done = STEPS.filter(x => R.sp.some(p => p.s === x.id && p.lv === 0 && p.e != null && p.e <= t + 1e-6 && p.st === 'ok'));
    if (!done.length){ ds.innerHTML = ''; io.innerHTML = '<p class="rdr-de">No step has finished yet.</p>'; return; }
    const cur = done.find(x => x.id === picked) || done[done.length - 1];
    ds.innerHTML = done.map(x => `<button data-s="${x.id}" aria-pressed="${x === cur}"><span class="rdr-ti" data-k="${x.k}" aria-hidden="true">${I(x.ic, 'xs')}</span><span>${x.t}</span></button>`).join('');
    const out = x => x.id === 'approve' ? { decision:R.ok === false ? 'Rejected' : 'Approved', by:'You' } : x.out;
    io.innerHTML = `<h4>Input</h4><pre class="rdr-json" tabindex="0" aria-label="${cur.t} input">${json(cur.in)}</pre><h4>Output</h4><pre class="rdr-json" tabindex="0" aria-label="${cur.t} output">${json(out(cur))}</pre>`;
  }
  const pick = id => { picked = id; $$('.rdr-r', rowsEl).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.s === id))); $$('.rdr-nd', flow).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.s === id))); if (tab === 'data') paintData(); };
  function decide(ok){
    if (!R || R.st !== 'wait') return; const p = R.sp[R.sp.length - 1], x = byId(p.s); p.e = R.t; p.st = ok ? 'ok' : 'bad';
    if (ok){ R.log.push({ at:R.t, l:'info', b:x.t, m:'Approved by you' }); R.st = 'run'; R.ok = true; plan(R.pause.i + 1, R.t); R.pause = null; say(`${x.t}: approved. The run carries on`); }
    else { R.ok = false; R.log.push({ at:R.t, l:'error', b:x.t, m:'Rejected by you. Nothing was sent' }); R.st = 'bad'; R.end = R.t; finish(); }
    paint();
  }
  function finish(){ stopB.hidden = true; againB.hidden = false; say(R.st === 'ok' ? `Test run passed in ${secs(R.t)}` : R.st === 'bad' ? 'Test run failed' : 'Run stopped'); }
  // the run's clock, at the pace of a real one; while a step waits for a person the clock runs on and its bar grows
  c.loop(ts => {
    const dt = last ? Math.min(.1, (ts - last) / 1000) : 0; last = ts;
    if (!R || (R.st !== 'run' && R.st !== 'wait')) return;
    R.t += dt;
    if (R.st === 'wait'){ paint(); return; }
    if (R.pause && R.t >= R.pause.at){ R.t = R.pause.at; R.st = 'wait'; say(`${byId(R.sp[R.sp.length - 1].s).t} is waiting for you to approve`); }
    if (R.end != null && R.t >= R.end){ R.t = R.end; R.st = 'ok'; paint(); finish(); return; }
    paint();
  });
  c.on(stopB, 'click', () => { if (!R || (R.st !== 'run' && R.st !== 'wait')) return;
    R.sp = R.sp.filter(p => p.a <= R.t); R.sp.forEach(p => { if (p.e == null || p.e > R.t){ p.e = R.t; p.st = 'stop'; } });
    R.log = R.log.filter(l => l.at <= R.t); R.log.push({ at:R.t, l:'warn', b:'Run stopped', m:`You stopped it at ${secs(R.t)}` }); R.st = 'stopped'; R.pause = null; R.end = R.t; paint(); finish(); if (againB) againB.focus({ preventScroll:true }); });
  c.on(againB, 'click', e => { start(); if (e.isTrusted) stopB.focus({ preventScroll:true }); });
  c.on(r, 'click', e => {
    const a = e.target.closest('.rdr-ask [data-a]'); if (a) return decide(a.dataset.a === 'yes');
    const b = e.target.closest('.rdr-r, .rdr-nd, .rdr-ds button'); if (!b) return;
    pick(b.dataset.s);
    if (b.matches('.rdr-nd') && tab === 'steps'){ const row = $(`.rdr-r[data-s="${b.dataset.s}"]`, rowsEl); if (row) bd.scrollTop = Math.max(0, topIn(row) - 34); }
  });
  // Steps, Log and Data; the log's level filter
  const tabs = seg($('.rdr-tabs', r), v => { tab = v; $$('.rdr-v', r).forEach(x => x.hidden = x.dataset.v !== v); bd.scrollTop = 0; if (v === 'data') paintData(); if (v === 'log' && follow && R.st === 'run') bd.scrollTop = bd.scrollHeight; });
  seg($('.rdr-lvs', r), v => { lvl = v; filterLog(true); });
  c.on(followB, 'click', () => { follow = !follow; followB.setAttribute('aria-pressed', String(follow)); followB.dataset.tip = follow ? 'Follow the run' : 'Stay put'; say(follow ? 'Following the run' : 'Staying put'); });
  // the drawer folds down to its head, and drags taller from its top edge (or the arrow keys on it)
  const maxH = () => Math.max(160, frame.clientHeight - 64);
  const setH = h => { h = Math.round(Math.max(120, Math.min(maxH(), h))); dw.style.setProperty('--rdr-h', h + 'px'); grip.setAttribute('aria-valuenow', h); grip.setAttribute('aria-valuemax', maxH()); };
  const fold = open => { dw.classList.add('anim'); dw.classList.toggle('shut', !open); tg.setAttribute('aria-expanded', String(open)); c.later(REDUCE ? 0 : 500, () => dw.classList.remove('anim')); };
  c.on(tg, 'click', () => fold(dw.classList.contains('shut')));
  let g = null;
  c.on(grip, 'pointerdown', e => { g = { y:e.clientY, h:dw.classList.contains('shut') ? 45 : dw.getBoundingClientRect().height }; grip.setPointerCapture(e.pointerId); grip.classList.add('on'); dw.classList.add('drag'); if (dw.classList.contains('shut')){ dw.classList.remove('shut'); tg.setAttribute('aria-expanded', 'true'); } });
  c.on(grip, 'pointermove', e => { if (g) setH(g.h - (e.clientY - g.y)); });
  const up = () => { g = null; grip.classList.remove('on'); dw.classList.remove('drag'); }; c.on(grip, 'pointerup', up); c.on(grip, 'pointercancel', up);
  c.on(grip, 'keydown', e => { const cur = dw.getBoundingClientRect().height, d = { ArrowUp:24, ArrowDown:-24 }[e.key]; let h = null;
    if (d) h = cur + d; if (e.key === 'Home') h = 120; if (e.key === 'End') h = maxH(); if (h == null) return; e.preventDefault(); if (dw.classList.contains('shut')) fold(true); setH(h); });
  setH(312);
  start();
  // the preview's story: approve the step the run waits on, then read the log, its errors, and what the research handed on
  c.story(async s => {
    await s.until(() => R.st === 'wait'); await s.beat(2.4);
    await s.tap($('.rdr-ask [data-a="yes"]', r));
    await s.until(() => R.st === 'ok'); await s.beat(1.6);
    await s.tap($('.rdr-tabs [data-v="log"]', r)); await s.beat(2.4);
    await s.tap($('.rdr-lvs [data-v="error"]', r)); await s.beat(2.4);
    await s.tap($('.rdr-tabs [data-v="data"]', r)); await s.beat(1.4);
    await s.tap($('.rdr-ds [data-s="research"]', r)); await s.beat(3);
  });
});
/* ---------- Memory panel ---------- */
DM.def('memory-panel', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{book}', I('book')).replace('{spark}', I('spark','xs'));
  // where a memory came from: an app's own mark, or an icon for something said in chat or an edit
  const ICON = { chat:'comment', edit:'edit' };
  const mark = s => BRAND[s] || I(ICON[s] || s, 'xs');
  const KIND = { brand:['Brand', 'var(--pl)'], process:['Process', 'var(--pt)'] };
  let M = [
    ['brand','Primary buttons use the accent blue, never black','figma','Pricing review in Figma, Sep 12'],
    ['brand','Headlines stay under eight words','chat','You told the agent, Aug 30'],
    ['process','Ask Maya before publishing to the shared library','slack','A thread in #design-system, Sep 4'],
    ['brand','Card radius is 16px on web, 12px in the app','github','tokens.css on GitHub, Sep 18'],
    ['process','Run the launch checklist before every PR','notion','Launch checklist in Notion, Sep 20'],
    ['process','File design bugs in the Design QA project','linear','DES-214 in Linear, Sep 26'],
    ['brand','No em dashes in product copy','drive','Voice and tone guide in Drive, Oct 2']
  ].map((m, i) => ({ id:i, k:m[0], t:m[1], from:m[2], s:m[3] }));
  const list = $('.mmx-list', r), fi = $('.mmx-fi', r), ft = $('.mmx-ft', r);
  if (!r.closest('.ahx')) c.offs.push(hoverGlide(list, '.mmx-m'));
  let f = 'all', nid = 100;
  // the head names the panel only: a count of the memories and a row of their sources' marks repeated what the list shows
  const count = () => {};
  const meta = m => `<span class="k">${KIND[m.k][0]}</span><span aria-hidden="true">·</span><span class="s">${m.s}</span>${m.isNew ? '<span class="tag nw">New</span>' : ''}${m.used ? '<span class="tag nw">Used</span>' : ''}`;
  const rowOf = m => $(`.mmx-m[data-id="${m.id}"]`, list);
  function item(m){
    const el = html(`<div class="mmx-m${m.learn ? ' learn' : ''}" data-id="${m.id}" style="--k:${KIND[m.k][1]}"><span class="mmx-src" aria-hidden="true">${m.learn ? '<span class="spin"></span>' : mark(m.from)}</span><span class="mmx-b"><span class="t${m.learn ? ' shim' : ''}" spellcheck="false">${m.t}</span><span class="mmx-meta">${meta(m)}</span></span><span class="acts"><button class="ib ed mx-press" aria-label="Edit" data-tip="Edit">${I('edit','xs')}</button><button class="ib rm mx-press" aria-label="Forget" data-tip="Forget">${I('trash','xs')}</button></span></div>`);
    const t = $('.t', el);
    $('.ed', el).onclick = () => { t.contentEditable = 'true'; t.focus({ preventScroll:true }); const s = document.getSelection(); s.selectAllChildren(t); s.collapseToEnd();
      const done = () => { t.contentEditable = 'false'; m.t = t.textContent.trim() || m.t; m.s = 'Edited by you, just now'; m.from = 'edit'; t.textContent = m.t; update(m); count(); };
      t.onkeydown = e => { if (e.key === 'Enter'){ e.preventDefault(); t.blur(); } }; t.onblur = done; };
    $('.rm', el).onclick = () => { const i = M.indexOf(m); M.splice(i, 1); count();
      const g = html(`<div class="mmx-gone"><span>Forgot “${m.t.slice(0, 32)}${m.t.length > 32 ? '…' : ''}”</span><button>Undo</button></div>`); el.replaceWith(g); enter(g);
      const tm = setTimeout(() => { g.classList.add('leave'); setTimeout(() => g.remove(), 320); }, 4000);
      $('button', g).onclick = () => { clearTimeout(tm); M.splice(i, 0, m); count(); const n = item(m); g.replaceWith(n); enter(n); }; };
    return el;
  }
  // a memory's row catches up with its data: its source, its text once it has been learned, its tags and its highlight
  function update(m, pulse){
    const el = rowOf(m); if (!el) return;
    const src = $('.mmx-src', el), t = $('.t', el);
    if (!m.learn && el.classList.contains('learn')){ el.classList.remove('learn'); t.classList.remove('shim'); swap(t, m.t); iconSwap(src, () => { src.innerHTML = mark(m.from); }, { inner:true }); }
    else if (t.contentEditable !== 'true') src.innerHTML = mark(m.from);
    $('.mmx-meta', el).innerHTML = meta(m);
    if (pulse){ el.classList.remove('use'); void el.offsetWidth; el.classList.add('use'); }
  }
  const draw = () => { list.innerHTML = ''; M.filter(m => f === 'all' || m.k === f).forEach(m => list.appendChild(item(m))); };
  function paint(){ draw(); stagger([...list.children], 40); }
  // a row that arrives opens its own height, so the panel grows smoothly instead of jumping
  const growRow = el => { if (REDUCE) return; const cs = getComputedStyle(el), gap = parseFloat(getComputedStyle(list).rowGap) || 0, ease = getComputedStyle(r).getPropertyValue('--ease').trim() || 'ease', blur = getComputedStyle(r).getPropertyValue('--motion').trim() === 'clean' ? 0 : 4;
    el.animate([{ height:'0px', paddingTop:'0px', paddingBottom:'0px', marginBottom:-gap + 'px', opacity:0, filter:`blur(${blur}px)`, overflow:'hidden' }, { height:cs.height, paddingTop:cs.paddingTop, paddingBottom:cs.paddingBottom, marginBottom:'0px', opacity:1, filter:'blur(0px)', overflow:'hidden' }], { duration:560, easing:ease }); };
  // a filter moves the rows: the memories that stay glide to their new places, new ones rise in out of a short blur and the
  // ones that go fade where they were (reflow(), motion pieces), as the panel eases to its new height
  seg($('.mmx-tab', r), v => { f = v; reflow(() => $$('.mmx-m', list), draw, { by:'data-id', root:list.closest('.mmx') || r, host:list, blur:true }); });
  count(); paint();
  // no room is kept for the memory still to come (owner, 17 Nov): the panel grows as the new one opens its row, and as a filter
  // or a forgotten memory changes the list (grow(), centred in its stage), once its entrance (which scales it) has ended
  const mroot = r.classList.contains('mmx') ? r : $('.mmx', r);
  if (mroot && r === c.st) Promise.resolve().then(() => Promise.all(mroot.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && mroot.isConnected) c.offs.push(grow(mroot)); });
  // the preview: the agent learns a rule from your edit in Figma, then drafts an email in Gmail with three memories, which
  // pulse as it reads them. Every state lives in the memories' data, so switching tabs keeps it; taking over settles it
  c.run(async () => {
    await c.step(2200);
    const m = { id:nid++, k:'brand', t:'Learning from your edit in Pricing v4', from:'figma', s:'Just now', learn:true };
    const learnt = () => Object.assign(m, { learn:false, t:'Use “Start free” instead of “Sign up” on CTAs', s:'Your edit in Pricing v4, just now' });
    c.taken(() => { if (m.learn){ learnt(); update(m); } if (ft.classList.contains('shim')){ ft.classList.remove('shim'); iconSwap(fi, () => { fi.innerHTML = I('spark','xs'); }, { inner:true }); swap(ft, 'Used in 14 answers this week'); } });
    M.unshift(m); count(); if (f === 'brand' || f === 'all'){ const el = item(m); list.prepend(el); growRow(el); }
    await c.step(1500);
    learnt(); m.isNew = true; update(m);
    await c.step(2600);
    m.isNew = false; m.s = 'Your edit in Figma, today'; update(m);
    await c.step(1000);
    iconSwap(fi, () => { fi.innerHTML = BRAND.gmail; }, { inner:true });
    ft.classList.add('shim'); swap(ft, 'Drafting the launch email in Gmail');
    await c.step(1100);
    let n = 0;
    for (const id of [m.id, 1, 6]){ const x = M.find(y => y.id === id); if (!x) continue; x.used = true; n++; update(x, true); await c.step(700); }
    ft.classList.remove('shim'); swap(ft, `Used ${n} ${n === 1 ? 'memory' : 'memories'} in the launch email draft`);
  });
});
/* ---------- Tools and connections ---------- */
DM.def('tool-connections', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{refresh}', I('refresh','xs')).replace('{plus}', I('plus','xs')).replace('{link}', I('link','xs'));
  // [mark, name, detail, tile colour (a vivid avatar colour, for a mark without a logo), permission 0 Off, 1 Ask, 2 Allow]
  let T = [
    ['@figma','Figma','Read and edit frames','',1],
    ['@github','GitHub','designme/web, PRs only','',0],
    ['@slack','Slack','#design, #launch','',1],
    ['db','Analytics','Read only, last 90 days','t',1],
    ['globe','Web search','Any public site','b',2]
  ];
  const ADD = [['table','Google Sheets','m'],['@linear','Linear',''],['@gmail','Gmail','']];
  const root = $('.hnx', r) || r, list = $('.hnx-list', r), st = $('.hnx-st', r), pop = $('.hnx-pop', r);
  const PM = ['Off','Ask','Allow'];
  // a tool's mark: its logo on a white tile, or its icon on a vivid tile of its colour, with white or the colour's own ink
  const mark = (m, k) => m[0] === '@' ? `<span class="ic brandic" aria-hidden="true">${BRAND[m.slice(1)]}</span>` : `<span class="ic" style="background:var(--av-${k});color:var(--av-${k}-ink)" aria-hidden="true">${I(m,'xs')}</span>`;
  function row(t){
    const el = html(`<div class="hnx-t${t[4] === 0 ? ' off' : ''}" role="listitem">${mark(t[0], t[3])}<span class="t"><span class="nm"><span>${t[1]}</span><i class="hnx-dot" aria-hidden="true"></i></span><span class="d">${t[2]}</span></span><div class="hnx-pm" role="group" aria-label="${t[1]} permission"><span class="kn"></span>${PM.map((p, i) => `<button aria-pressed="${i === t[4]}" data-tip="${['Agent cannot use it','Agent asks first','Agent uses it freely'][i]}">${p}</button>`).join('')}</div></div>`);
    const g = $('.hnx-pm', el), kn = $('.kn', g), bs = $$('button', g);
    // the knob slides when a choice changes; when the row first appears it is simply in place
    const place = now => { const b = bs[t[4]]; if (now) kn.style.transition = 'none'; kn.style.left = b.offsetLeft + 'px'; kn.style.width = b.offsetWidth + 'px'; if (now){ void kn.offsetWidth; kn.style.transition = ''; } };
    bs.forEach((b, i) => b.onclick = () => { t[4] = i; bs.forEach((x, j) => x.setAttribute('aria-pressed', j === i)); place(); el.classList.toggle('off', i === 0); count(); });
    // a click with the mouse doesn't take focus, so it never leaves a focus ring; the keyboard still reaches every option
    bs.forEach(b => b.onmousedown = e => e.preventDefault());
    requestAnimationFrame(() => place(true)); new ResizeObserver(() => place(true)).observe(g);
    el._t = t; return el;
  }
  // a test's line, in the foot beside Connect a tool, never a count that repeats the list (the owner's notes on batch 2):
  // while it runs, what it tests, in words that shimmer; once it has run, how many are healthy, with the green tick when
  // every one is. A change to a switch makes that result old, so the line goes again
  const write = (h, now) => { if (now) st.innerHTML = h; else swap(st, h, true); };
  const count = now => write('', now);
  const healthy = (ok, n) => write((ok === n ? I('ok','xs') : '') + `<span>${ok} of ${n} healthy</span>`);
  T.forEach(t => list.appendChild(row(t))); stagger([...list.children], 50); count(true);
  function menu(){ pop.innerHTML = ADD.length ? ADD.map((a, i) => `<button class="mi mx-press" role="menuitem" data-close data-i="${i}">${a[0][0] === '@' ? BRAND[a[0].slice(1)] : I(a[0],'xs')}<span>${a[1]}</span></button>`).join('') : '<div class="ph">All tools connected</div>';
    $$('.mi', pop).forEach(m => m.addEventListener('click', () => { const a = ADD.splice(+m.dataset.i, 1)[0]; const t = [a[0], a[1], 'Just connected', a[2], 1]; T.push(t); const el = row(t); list.appendChild(el); enter(el); count(); menu(); })); }
  menu();
  // a menu opens over the card from its button: down when it fits below, up when it doesn't and fits above or has more room
  // there (as placePop), within the stage's room, so it never spills over the card's caption under the stage (as Artifact
  // card's version menu). The side is set on the button just before the menu is placed
  const side = (btn, pop) => { const room = popRoom(btn), st = btn.closest('.stage-inner') || btn.closest('.stage');
    if (st){ const sr = st.getBoundingClientRect(), cs = getComputedStyle(st); room.top = Math.max(room.top, sr.top + parseFloat(cs.paddingTop)); room.bottom = Math.min(room.bottom, sr.bottom - parseFloat(cs.paddingBottom)); }
    const br = btn.getBoundingClientRect(), need = pop.offsetHeight + 12, below = room.bottom - br.bottom, above = br.top - room.top;
    btn.dataset.popPos = below < need && (above >= need || above > below) ? 'up' : 'down'; };
  const add = $('.hnx-add', r); c.on(add, 'click', () => { if (!pop.classList.contains('open')) side(add, pop); });
  // Test all: every connected tool's dot turns at once, and they settle one by one; only a failure changes its line. The
  // button is as wide as its words and eases to the new ones
  const test = $('.hnx-test', r);
  // (on the motion pieces' spring: mxWidth())
  const label = h => { const w0 = test.offsetWidth; test.innerHTML = h; if (!REDUCE && w0) mxWidth(test, w0); };
  const idle = I('refresh','xs') + '<span>Test all</span>';
  test.onclick = () => c.run(async () => {
    const rows = [...list.children].filter(el => el._t[4] > 0);
    test.disabled = true; label('<span class="spin"></span><span>Testing</span>'); write(`<span class="shim">Testing ${rows.length} connections</span>`);
    rows.forEach(el => el.classList.add('chk'));
    for (const el of rows){ await c.wait(600); el.classList.remove('chk');
      // the row turns red with its new words, not before them
      if (el._t[1] === 'Slack' && !el._t.ok){ el._bad = true; swap($('.d', el), 'Token expired. Reconnect to use it'); c.later(REDUCE ? 0 : 170, () => el.classList.add('err')); }
    }
    test.disabled = false; label(idle);
    healthy(rows.filter(el => !el._bad).length, rows.length);
    const bad = [...list.children].find(el => el._bad);
    // a second test finds the row already offering Reconnect, so it keeps that button
    const pm = bad && $('.hnx-pm', bad);
    if (pm){ const b = html(`<button class="pill accent sm">Reconnect</button>`); pm.replaceWith(b); enter(b);
      // while it reconnects it keeps its colour and its width, with a spinner in place of its word, and takes no second press
      b.onclick = () => c.run(async () => { if (b.getAttribute('aria-disabled')) return; b.setAttribute('aria-disabled', 'true'); b.setAttribute('aria-label', 'Reconnecting');
        const w0 = b.getBoundingClientRect().width; b.innerHTML = '<span class="spin"></span>'; b.style.width = w0 + 'px';
        await c.wait(900); bad.classList.remove('err'); bad._t.ok = true; const n = row(bad._t); bad.replaceWith(n); enter(n);
        const on = [...list.children].filter(el => el._t[4] > 0).length; healthy(on, on); }); }
  });
  // the card grows with its rows, and eases when a line wraps or Reconnect takes a switch's place (owner, 17 Nov: no room
  // kept for a later state)
  c.offs.push(grow(root));
  // the preview's story: test everything, Slack's token has expired, reconnect it, and every connection is healthy
  c.story(async s => {
    await s.beat(3);
    await s.tap(test); s.away();
    await s.until(() => $('.hnx-t.err .pill', list)); await s.beat(3);
    await s.tap($('.hnx-t.err .pill', list)); s.away();
    await s.until(() => !$('.hnx-t.err', list)); await s.beat(1);
  });
});
/* ---------- Knowledge sources ---------- */
DM.def('knowledge-sources', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{plus\}/g, I('plus','xs')).replace('{refresh}', I('refresh','xs')).replace('{trash}', I('trash','xs')).replace('{book}', I('book','xs'));
  // Clean's one hover: a highlight that glides from row to row (hoverGlide)
  c.offs.push(hoverGlide($('.ksx-list', r), '.ksx-s'));
  // a source's type gives it its icon, on a vivid tile of its colour: uploaded files, a website the agent crawls, or a
  // connected folder of docs
  const KIND = { files:['file-text','p'], web:['globe','b'], folder:['folder','m'] };
  // a connected folder and a set of uploads are ready, and a PDF is being read. One source indexes at a time and the rest
  // wait in line; a source's chunks count once it has been indexed. `ms` is how long a full pass takes in this preview
  const S = [
    { kind:'folder', name:'Product docs', n:86, unit:'pages', chunks:642, st:'ready', ago:'2m ago', had:true, ms:2500 },
    { kind:'files', name:'Sales playbooks', n:18, unit:'files', chunks:318, st:'ready', ago:'1h ago', had:true, ms:2500 },
    { kind:'files', name:'Brand book 2024.pdf', n:24, unit:'pages', chunks:48, st:'queued', ms:19000, fail:{ at:9, why:'Scanned PDF, no text found', fix:'Retry with OCR' } }
  ];
  const FOLDERS = [['Design specs', 'Google Drive', 57, 230], ['Research notes', 'Notion', 31, 124]];
  const root = $('.ksx', r) || r, list = $('.ksx-list', r), st = $('.ksx-st', r), pop = $('.ksx-pop', r), mpop = $('.ksx-mpop', r), file = $('.ksx-file', r);
  // Add source sits under the list, and in the empty state once every source is gone; both open the same menu
  const add = $('.ksx-add', r), adds = $$('.ksx-add,.ksx-add2', r); let from = add;
  const fmt = n => n.toLocaleString('en-US');
  const of = (n, unit) => fmt(n) + ' ' + (n === 1 ? unit.slice(0, -1) : unit);
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  // the line under a source's name, led by its state's mark: a tick once indexed, a clock while it waits, a sign when it failed
  const line = x => x.st === 'queued' ? I('clock','xs') + `<span>${x.ocr ? 'Queued to read with OCR' : 'Queued'}</span>`
    : x.st === 'failed' ? I('alert','xs') + `<span>${esc(x.fail.why)}</span>` : I('ok','xs') + `<span>${of(x.n, x.unit)} · Synced ${x.ago}</span>`;
  function row(x){
    const [ic, k] = KIND[x.kind];
    x.el = html(`<div class="ksx-s" role="listitem"><span class="ic" style="background:var(--av-${k});color:var(--av-${k}-ink)" aria-hidden="true">${I(ic,'xs')}</span><span class="t"><span class="nm"></span><span class="d"></span></span><button class="ib ksx-more mx-press" aria-haspopup="menu" aria-expanded="false" data-tip="More" data-pop=".ksx-mpop" data-pop-align="end">${I('more')}</button><div class="ksx-fx fold shut" inert><div><div><button class="pill accent sm ksx-fix"></button><button class="pill ghost sm ksx-del mx-press">Remove</button></div></div></div></div>`);
    $('.nm', x.el).textContent = x.name; $('.ksx-more', x.el).setAttribute('aria-label', 'Actions for ' + x.name);
    $('.ksx-fix', x.el).onclick = () => { x.ocr = true; x.st = 'queued'; x.ms = 3000; paint(x); next(); };
    $('.ksx-del', x.el).onclick = () => remove(x);
    paint(x, true); return x.el;
  }
  // the progress bar and its count, while a source is being indexed; the count shimmers, as every line of a process at work
  function prog(x){
    const bar = $('.ksx-bar', x.el); if (!bar) return; const k = Math.floor(x.done);
    $('i', bar).style.width = k / x.n * 100 + '%'; bar.setAttribute('aria-valuenow', k);
    $('.num', x.el).textContent = fmt(k) + ' of ' + of(x.n, x.unit);
  }
  function paint(x, now){
    const d = $('.d', x.el); x.el.dataset.st = x.st;
    // the bar goes through the same swap as the line before it, so a line still swapping in can't land on top of it
    if (x.st === 'indexing'){ const bar = `<span class="ksx-bar" role="progressbar" aria-label="Indexing ${x.name.replace(/[<&"]/g, '')}" aria-valuemin="0" aria-valuemax="${x.n}"><i style="width:0"></i></span><span class="num shim"></span>`; if (now){ d.innerHTML = bar; prog(x); } else swap(d, bar, true); }
    else if (now) d.innerHTML = line(x); else swap(d, line(x), true);
    const fx = $('.ksx-fx', x.el), on = x.st === 'failed';
    if (on) $('.ksx-fix', x.el).textContent = x.fail.fix;
    fx.classList.toggle('shut', !on); fx.inert = !on;
  }
  // the line under the title says what the list doesn't: how much of it the agent can search, once it is indexed
  const total = () => `${fmt(S.reduce((a, x) => a + (x.had ? x.chunks : 0), 0))} chunks indexed`;
  const counts = now => { if (now) st.textContent = total(); else swap(st, total()); };
  // the one being indexed moves on every tick; a scanned PDF stops where its text runs out, until it is read with OCR
  function next(){
    if (S.some(x => x.st === 'indexing')) return;
    const x = S.find(y => y.st === 'queued'); if (!x) return;
    x.st = 'indexing'; x.done = 0; paint(x);
  }
  c.every(100, () => {
    const x = S.find(y => y.st === 'indexing'); if (!x) return;
    x.done = Math.min(x.n, x.done + x.n * 100 / x.ms);
    if (x.fail && !x.ocr && x.done >= x.fail.at){ x.st = 'failed'; paint(x); counts(); return next(); }
    prog(x);
    if (x.done >= x.n){ x.st = 'ready'; x.ago = 'just now'; x.had = true; paint(x); counts(); next(); }
  });
  function addSource(x){ x.st = 'queued'; S.push(x); list.appendChild(row(x)); enter(x.el); counts(); next(); }
  function remove(x){
    const i = S.indexOf(x); if (i < 0) return; S.splice(i, 1); counts(); next();
    x.el.classList.add('leave'); c.later(REDUCE ? 0 : 340, () => x.el.remove());
  }
  S.forEach(x => list.appendChild(row(x))); stagger([...list.children], 50); counts(true); next();
  // Re-sync and Remove act on the row whose button opened the menu; a source still waiting or indexing can't be re-synced yet
  let cur = null;
  c.on(list, 'click', e => { const b = e.target.closest('.ksx-more'); if (!b) return; cur = S.find(x => x.el.contains(b)); $('.ksx-rs', mpop).disabled = !cur || cur.st === 'queued' || cur.st === 'indexing'; if (!mpop.classList.contains('open')) side(b, mpop); });
  $('.ksx-rs', mpop).onclick = () => { if (!cur || !S.includes(cur)) return; cur.st = 'queued'; cur.ms = cur.ocr ? 3000 : cur.fail ? 19000 : 2500; paint(cur); next(); };
  $('.ksx-rm', mpop).onclick = () => cur && remove(cur);
  // Add source: upload files (the file picker), add a website (its address), or connect a folder (from the ones offered)
  function view(v){
    pop.classList.toggle('mx-sw', pop.classList.contains('open'));
    if (v === 'web') pop.innerHTML = `<form class="ksx-web"><div class="ph">Add a website</div><div class="ksx-in">${I('globe','xs')}<input placeholder="example.com/docs" aria-label="Website address" spellcheck="false" autocomplete="off"><button class="pill accent sm" type="submit">Add</button></div></form>`;
    else if (v === 'folder') pop.innerHTML = '<div class="ph">Connect a folder</div>' + (FOLDERS.length ? FOLDERS.map((f, i) => `<button class="mi mx-press" role="menuitem" data-close data-i="${i}">${I('folder','xs')}<span>${f[0]}<span class="d">${f[1]}</span></span></button>`).join('') : '<div class="ph">All folders connected</div>');
    else pop.innerHTML = [['upload', 'Upload files', 'files'], ['globe', 'Add a website', 'web'], ['folder', 'Connect a folder', 'folder']].map(([ic, t, k]) => `<button class="mi mx-press" role="menuitem" data-v="${k}"${k === 'files' ? ' data-close' : ''}>${I(ic,'xs')}<span>${t}</span></button>`).join('');
  }
  view('main');
  // a menu opens over the card from its button: down when it fits below, up when it doesn't and fits above or has more room
  // there (as placePop), within the stage's room, so it never spills over the card's caption under the stage (as Artifact
  // card's version menu). The side is set on the button just before the menu is placed
  const side = (btn, pop) => { const room = popRoom(btn), st = btn.closest('.stage-inner') || btn.closest('.stage');
    if (st){ const sr = st.getBoundingClientRect(), cs = getComputedStyle(st); room.top = Math.max(room.top, sr.top + parseFloat(cs.paddingTop)); room.bottom = Math.min(room.bottom, sr.bottom - parseFloat(cs.paddingBottom)); }
    const br = btn.getBoundingClientRect(), need = pop.offsetHeight + 12, below = room.bottom - br.bottom, above = br.top - room.top;
    btn.dataset.popPos = below < need && (above >= need || above > below) ? 'up' : 'down'; };
  adds.forEach(b => c.on(b, 'click', () => { from = b; if (!pop.classList.contains('open')){ view('main'); side(b, pop); } }));
  // a step inside the menu swaps its content after the click has been handled, so the click still counts as inside it. The
  // menu keeps the side it opened on: one that opened upwards grows upwards, held by its bottom edge
  const replace = () => { if (!(pop.style.getPropertyValue('--origin') || '').startsWith('bottom')) side(from, pop); placePop(from, pop); };
  c.on(pop, 'click', e => {
    const m = e.target.closest('.mi'); if (!m) return;
    if (m.dataset.v === 'files') return file.click();
    if (m.dataset.v){ const v = m.dataset.v, mine = e.isTrusted; c.later(0, () => { view(v); replace(); if (mine && v === 'web') $('input', pop).focus({ preventScroll:true }); }); return; }
    if (m.dataset.i){ const f = FOLDERS.splice(+m.dataset.i, 1)[0]; addSource({ kind:'folder', name:f[0], n:f[2], unit:'pages', chunks:f[3], ms:3000 }); }
  });
  c.on(pop, 'submit', e => {
    e.preventDefault(); const inp = $('input', pop), v = inp.value.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!v) return inp.focus();
    closePops(); addSource({ kind:'web', name:v, n:142, unit:'pages', chunks:196, ms:4500 });
  });
  file.onchange = () => { const fs = [...file.files]; if (!fs.length) return;
    addSource({ kind:'files', name:fs.length === 1 ? fs[0].name : fs.length + ' files', n:fs.length, unit:'files', chunks:fs.length * 12, ms:1500 }); file.value = ''; };
  // the card grows with its rows and shrinks as they go (owner, 17 Nov: no room kept for a later state)
  c.offs.push(grow(root));
  // the preview's story: add the docs site, which waits its turn; the PDF turns out to be a scan, so read it with OCR, and
  // everything ends up indexed
  c.story(async s => {
    const pdf = S[2];
    await s.beat(3);
    await s.tap(add); await s.beat(2);
    await s.tap($('.mi[data-v="web"]', pop)); await s.beat(1);
    const inp = $('input', pop);
    await s.type(inp, 'designme.dev/docs', { n:.1, keep:true });
    await s.beat(1);
    await s.tap($('button[type="submit"]', pop)); s.away();
    await s.until(() => pdf.st === 'failed'); await s.beat(2);
    await s.tap($('.ksx-fix', pdf.el)); s.away();
    await s.until(() => S.every(x => x.st === 'ready')); await s.beat(1);
  });
});
/* ---------- Scheduled runs ---------- */
DM.def('scheduled-runs', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{plus}', I('plus','xs')).replace('{clock}', I('clock','xs'));
  // in this preview it is Saturday afternoon, so Monday at 9:00 is two days off, and every new schedule runs at 9:00. A run's
  // mark is its tool's logo, or its icon on a vivid tile of its colour
  const R = [
    { mark:'palette', col:'l', name:'Weekly design QA', when:'Mondays at 9:00', next:'Next in 2 days', on:true, res:'ok', ago:'5 days ago' },
    { mark:'@figma', name:'Sync tokens from Figma', when:'Every day at 8:00', next:'Next in 17h', on:true, res:'bad', why:'Figma token expired', fix:'Reconnect Figma' },
    { mark:'chart', col:'t', name:'Competitor price check', when:'Fridays at 17:00', next:'Next in 6 days', on:true, res:'ok', ago:'yesterday' }
  ];
  const root = $('.shx', r) || r, list = $('.shx-list', r), add = $('.shx-add', r), pop = $('.shx-pop', r), form = $('.shx-f', r);
  const inp = $('.shx-in', r), days = $('.shx-days', r), sum = $('.shx-sum', r), mk = $('.shx-mk', r);
  function row(x){
    const ic = x.mark[0] === '@' ? `<span class="ic brandic" aria-hidden="true">${BRAND[x.mark.slice(1)]}</span>` : `<span class="ic" style="background:var(--av-${x.col});color:var(--av-${x.col}-ink)" aria-hidden="true">${I(x.mark,'xs')}</span>`;
    x.el = html(`<div class="shx-r" role="listitem">${ic}<span class="t"><span class="nm"></span><span class="d"></span><span class="res"></span></span><span class="shx-act"><button class="ib shx-run mx-press" data-tip="Run now">${I('play')}</button><button class="toggle" role="switch"></button></span><div class="shx-fx fold shut" inert><div><div><button class="pill accent sm shx-fix"></button></div></div></div></div>`);
    $('.nm', x.el).textContent = x.name; $('.shx-run', x.el).setAttribute('aria-label', 'Run ' + x.name + ' now'); $('.toggle', x.el).setAttribute('aria-label', x.name);
    $('.shx-run', x.el).onclick = () => run(x);
    $('.toggle', x.el).onclick = () => { x.on = !x.on; paint(x); };
    $('.shx-fix', x.el).onclick = () => fix(x);
    paint(x, true); return x.el;
  }
  // the result line, led by its mark: a tick when it passed, a sign when it failed, a turning ring while it runs (its words
  // shimmer, as every line of a process at work)
  function paint(x, now){
    const el = x.el, put = (e, t, h) => now ? (h ? e.innerHTML = t : e.textContent = t) : swap(e, t, h);
    el.classList.toggle('off', !x.on); el.dataset.st = x.run ? 'run' : x.res || 'none';
    const tg = $('.toggle', el); tg.setAttribute('aria-checked', x.on); tg.dataset.tip = x.on ? 'Pause' : 'Resume';
    put($('.d', el), x.when + ' · ' + (x.on ? x.next : 'Paused'));
    const res = document.createElement('span'); res.textContent = x.run ? 'Running now' : x.res === 'ok' ? 'Passed ' + x.ago : x.res === 'bad' ? 'Failed: ' + x.why : 'No runs yet';
    if (x.run) res.className = 'shim';
    put($('.res', el), (x.run ? '<span class="spin" aria-hidden="true"></span>' : x.res ? I(x.res === 'ok' ? 'ok' : 'alert', 'xs') : '') + res.outerHTML, true);
    $('.shx-run', el).disabled = !!x.run || !x.on;
    const fx = $('.shx-fx', el), on = x.res === 'bad' && !x.run, b = $('.shx-fix', el);
    if (on && !x.fixing){ b.textContent = x.fix; b.removeAttribute('aria-disabled'); }
    fx.classList.toggle('shut', !on); fx.inert = !on;
  }
  // Run now: the result's ring turns while it runs, then it passes
  function run(x){
    if (x.run) return; x.run = true; paint(x);
    c.later(3000, () => { x.run = false; x.res = 'ok'; x.ago = 'just now'; paint(x); });
  }
  // the fix for a failed run reconnects, then runs it again straight away. The button is as wide as its words and eases to
  // the new ones
  function fix(x){
    if (x.fixing) return; x.fixing = true; const b = $('.shx-fix', x.el), w0 = b.getBoundingClientRect().width;
    // it keeps its colour while it reconnects, and takes no second press
    b.setAttribute('aria-disabled', 'true'); b.innerHTML = '<span class="spin"></span>Reconnecting'; const w1 = b.getBoundingClientRect().width;
    const cs = getComputedStyle(b), t = cs.getPropertyValue('--t').trim();
    if (!REDUCE && Math.abs(w1 - w0) > .5) b.animate([{ width:w0 + 'px' }, { width:w1 + 'px' }], { duration:(t.endsWith('ms') ? parseFloat(t) : parseFloat(t) * 1000) || 340, easing:cs.getPropertyValue('--ease').trim() || 'ease' });
    c.later(900, () => { x.fixing = false; run(x); });
  }
  // the head is the title alone: no count that repeats what the rows say (the owner's notes on batch 2)
  R.forEach(x => list.appendChild(row(x))); stagger([...list.children], 50);
  // New schedule: a task in words and how often. Custom picks the days; the line under it says when the first run is
  const DAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  days.innerHTML = DAY.map((d, i) => `<button type="button" aria-pressed="${i === 0 || i === 2 || i === 4}" aria-label="${FULL[i]}">${d[0]}</button>`).join('');
  let rep = 'day';
  const picked = () => rep === 'day' ? [0, 1, 2, 3, 4, 5, 6] : rep === 'mon' ? [0] : $$('button', days).map((b, i) => b.getAttribute('aria-pressed') === 'true' ? i : -1).filter(i => i >= 0);
  const when = ds => ds.length === 7 ? 'Every day at 9:00' : ds.join() === '0,1,2,3,4' ? 'Weekdays at 9:00' : ds.length === 1 ? FULL[ds[0]] + 's at 9:00' : ds.map(d => DAY[d]).join(', ') + ' at 9:00';
  // today is Saturday (5) after 9:00, so tomorrow's run is 18 hours off and the rest whole days
  const next = ds => { const n = Math.min(...ds.map(d => (d - 5 + 7) % 7 || 7)); return n === 1 ? 'Next in 18h' : `Next in ${n} days`; };
  function form1(){ const ds = picked(); sum.textContent = ds.length ? next(ds).replace('Next', 'First run') : 'Pick at least one day'; mk.disabled = !inp.value.trim() || !ds.length; }
  // a menu opens over the card from its button: down when it fits below, up when it doesn't and fits above or has more room
  // there (as placePop), within the stage's room, so it never spills over the card's caption under the stage (as Artifact
  // card's version menu). The side is set on the button just before the menu is placed
  const side = (btn, pop) => { const room = popRoom(btn), st = btn.closest('.stage-inner') || btn.closest('.stage');
    if (st){ const sr = st.getBoundingClientRect(), cs = getComputedStyle(st); room.top = Math.max(room.top, sr.top + parseFloat(cs.paddingTop)); room.bottom = Math.min(room.bottom, sr.bottom - parseFloat(cs.paddingBottom)); }
    const br = btn.getBoundingClientRect(), need = pop.offsetHeight + 12, below = room.bottom - br.bottom, above = br.top - room.top;
    btn.dataset.popPos = below < need && (above >= need || above > below) ? 'up' : 'down'; };
  // the form keeps the side it opened on: one that opened upwards grows upwards, held by its bottom edge
  const replace = () => { if (!(pop.style.getPropertyValue('--origin') || '').startsWith('bottom')) side(add, pop); placePop(add, pop); };
  seg($('.shx-rep', r), v => { rep = v; days.hidden = v !== 'custom'; form1(); if (pop.classList.contains('open')) replace(); });
  $$('button', days).forEach(b => b.onclick = () => { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); form1(); });
  inp.oninput = form1; form1();
  c.on(add, 'click', e => { if (pop.classList.contains('open')) return; side(add, pop); if (e.isTrusted) c.later(0, () => inp.focus({ preventScroll:true })); });
  c.on(form, 'submit', e => {
    e.preventDefault(); const ds = picked(); if (!inp.value.trim() || !ds.length) return;
    const x = { mark:'clock', col:'b', name:inp.value.trim(), when:when(ds), next:next(ds), on:true, res:null };
    R.push(x); list.appendChild(row(x)); enter(x.el); closePops(); inp.value = ''; form1();
  });
  // the card grows with its rows, and eases as a fix folds open or shut (owner, 17 Nov: no room kept for a later state)
  c.offs.push(grow(root));
  // the preview's story: run the design QA now and watch it pass, reconnect Figma so the token sync passes again, then
  // pause the price check
  c.story(async s => {
    const [qa, fig, price] = R;
    await s.beat(3);
    await s.point($('.shx-run', qa.el)); await s.beat(1);
    await s.tap($('.shx-run', qa.el)); s.away();
    await s.until(() => !qa.run && qa.ago === 'just now'); await s.beat(2);
    await s.tap($('.shx-fix', fig.el)); s.away();
    await s.until(() => !fig.run && fig.res === 'ok'); await s.beat(2);
    await s.tap($('.toggle', price.el)); s.away(); await s.beat(3);
  });
});