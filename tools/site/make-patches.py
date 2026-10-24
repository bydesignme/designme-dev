# Writes site-patches.json: [find, replace] pairs build.js applies to the site, each expected exactly once, plus extra CSS.
# They add the HTML / React switch to the code view and the detail page, and start a component before its thumbnail is taken.
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
P = []
def patch(find, repl): P.append([find, repl])

SW = '<div class="fw-sw" role="group" aria-label="Version"><button type="button" data-fw="html">HTML</button><button type="button" data-fw="react">React</button></div>'

# shared helpers, next to the code data they read
patch("""  const CODE = JSON.parse($('#code-data').textContent);
""", """  // the code behind each component lives in code-data.json, fetched once the page has loaded or the first time it is needed
  let CODE = null;
  const codeReady = () => codeReady.p || (codeReady.p = fetch('/code-data.json').then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => (CODE = d)).catch(e => { codeReady.p = null; throw e; }));
  addEventListener('load', () => setTimeout(() => codeReady().catch(() => {}), 1500));
  // the React version of each component comes from the registry npx designme add --react uses, fetched the first time it is shown
  const RX = {}, reactOf = name => RX[name] || (RX[name] = fetch(`/r/react/${name}.json`).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).catch(e => { delete RX[name]; throw e; }));
  const RX_TABS = { 'rx-tsx':'Component', 'rx-css':'CSS', 'rx-ex':'Example' };
  const rxText = (rx, t) => !rx ? 'Loading the React version…' : t === 'rx-tsx' ? rx.files[0].content : t === 'rx-css' ? rx.files[1].content : rx.example.content;
  const rxFile = (rx, t) => t === 'rx-tsx' ? rx.component + '.tsx' : t === 'rx-css' ? rx.name + '.css' : rx.component + '.example.tsx';
  const pascal = n => n.replace(/(?:^|-)(\\w)/g, (_, c) => c.toUpperCase());
  // the registry name, which the install command needs; a card's title doesn't always spell it
  const regName = cid => { const el = document.getElementById(cid); return (el && el.dataset.reg) || (el ? $('.comp-title', el).textContent : cid).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
  // HTML or React, remembered between visits and shared by the code view and the detail page
  const fw = { get(){ try { return localStorage.getItem('dm-code-fw') === 'react' ? 'react' : 'html'; } catch(e){ return 'html'; } }, set(v){ try { localStorage.setItem('dm-code-fw', v); } catch(e){} } };
""")

# ---------- code view (modal) ----------
patch("""<div class="cdm-note">Self-contained, needs only the shared core.</div><button class="cdm-cmd" id="cdm-cmd" title="Copy install command"><span class="d">$</span><span class="c" id="cdm-cmd-t"></span>${ic('content_copy','sm')}</button></div>""",
      """<div class="cdm-note"><span class="h-only">Self-contained, needs only the shared core.</span><span class="rx-only">A typed React component. It imports its own styles, and the install command adds the shared files it needs.</span></div><div class="cmd-row">""" + SW + """<button class="cdm-cmd" id="cdm-cmd" title="Copy install command"><span class="d">$</span><span class="c" id="cdm-cmd-t"></span>${ic('content_copy','sm')}</button></div></div>""")
patch("""<div class="cdm-tabs" role="tablist">${Object.keys(NAMES).map(t => `<button class="cdm-tab" role="tab" data-t="${t}">${NAMES[t]}</button>`).join('')}""",
      """<div class="cdm-tabs" role="tablist">${Object.keys(NAMES).map(t => `<button class="cdm-tab" role="tab" data-t="${t}">${NAMES[t]}</button>`).join('')}${Object.keys(RX_TABS).map(t => `<button class="cdm-tab" role="tab" data-t="${t}">${RX_TABS[t]}</button>`).join('')}""")
patch("""    const textFor = t => t === 'shared' ? '/* Shared core: tokens and base styles */\\n' + CODE._shared.css + '\\n\\n/* Shared core: icons, sound and helpers */\\n' + CODE._shared.js : CODE[id][t];
    function show(t){""", """    const textFor = t => !CODE && !t.startsWith('rx-') ? 'Loading the code…' : t === 'shared' ?'/* Shared core: tokens and base styles */\\n' + CODE._shared.css + '\\n\\n/* Shared core: icons and helpers */\\n' + CODE._shared.js : t.startsWith('rx-') ? rxText(rx, t) : CODE[id][t];
    let rx = null;
    // the path, note, install command and tabs follow the HTML or React choice
    function head(){
      const name = regName(id), react = fw.get() === 'react';
      m.classList.toggle('rx', react); $$('.fw-sw button', m).forEach(b => b.setAttribute('aria-pressed', String((b.dataset.fw === 'react') === react)));
      // a zero-width space after each slash lets a long path wrap at a folder on a phone
      $('#cdm-path', m).textContent = (react ? `components/designme/${name}/${rx ? rx.component : pascal(name)}.tsx` : `components/${name}.html`).replace(/\\//g, '/\\u200b');
      $('#cdm-cmd-t', m).textContent = `npx designme add ${name}${react ? ' --react' : ''}`;
    }
    function mode(v){ fw.set(v); head(); show(v === 'react' ? 'rx-tsx' : 'html'); if (v === 'react') load(); }
    async function load(){
      const want = id;
      try { const r = await reactOf(regName(want)); if (want !== id) return; rx = r; head(); if (tab.startsWith('rx-')) show(tab); }
      catch(e){ if (want === id && tab.startsWith('rx-')) pre.innerHTML = codeLines('// The React version could not be loaded. Try again in a moment.'); }
    }
    function show(t){""")
patch("""      id = cid; last = from; const c = CODE[cid], sl = slug(c.name);
      $('#cdm-t', m).textContent = c.name; $('#cdm-path', m).textContent = `components/${sl}.html`;
      $('#cdm-cmd-t', m).textContent = `npx designme add ${sl}`;
      show('html'); m.classList.add('open');""", """      id = cid; last = from; rx = null;
      $('#cdm-t', m).textContent = $('.comp-title', document.getElementById(cid)).textContent; mode(fw.get());
      if (!CODE) codeReady().then(() => { if (id === cid && !tab.startsWith('rx-')) show(tab); }, () => { if (id === cid && !tab.startsWith('rx-')) pre.innerHTML = codeLines('// The code could not be loaded. Try again in a moment.'); });
      m.classList.add('open');""")
patch("""      const t = e.target.closest('.cdm-tab'); if (t && t.dataset.t !== tab){ show(t.dataset.t); Sound.play('tab'); }""",
      """      const f = e.target.closest('.fw-sw button'); if (f){ if (f.dataset.fw !== fw.get()){ mode(f.dataset.fw); Sound.play('tab'); } return; }
      const t = e.target.closest('.cdm-tab'); if (t && t.dataset.t !== tab){ show(t.dataset.t); Sound.play('tab'); }""")
patch("""    $('#cdm-copy', m).addEventListener('click', async () => { if (await copyText(tab === 'shared' ? textFor('shared') : bundle(id))){ Sound.play('copy'); showToast('Copied ' + (tab === 'shared' ? 'shared core' : CODE[id].name)); } });""",
      """    // HTML copies the whole component in one go; React copies the file on show
    $('#cdm-copy', m).addEventListener('click', async () => { const react = tab.startsWith('rx-'); if (react ? !rx : !CODE) return; if (await copyText(tab === 'shared' || react ? textFor(tab) : bundle(id))){ Sound.play('copy'); showToast('Copied ' + (tab === 'shared' ? 'shared core' : react ? rxFile(rx, tab) : CODE[id].name)); } });""")

# ---------- detail page ----------
patch("""<div class="dv-code"><div class="dv-code-h"><div class="dv-tabs" role="tablist">${Object.keys(NAMES).map(t => `<button class="dv-tab" role="tab" data-t="${t}">${NAMES[t]}</button>`).join('')}</div>""",
      """<div class="dv-code" id="dv-code"><div class="dv-code-h">""" + SW + """<div class="dv-tabs" role="tablist">${Object.keys(NAMES).map(t => `<button class="dv-tab" role="tab" data-t="${t}">${NAMES[t]}</button>`).join('')}${Object.keys(RX_TABS).map(t => `<button class="dv-tab" role="tab" data-t="${t}">${RX_TABS[t]}</button>`).join('')}</div>""")
patch("""    let cur = null, ph = null, tab = 'html';""", """    let cur = null, ph = null, tab = 'html', rx = null;""")
patch("""    const textFor = t => t === 'shared' ? '/* Shared core: tokens and base styles */\\n' + CODE._shared.css + '\\n\\n/* Shared core: icons, sound and helpers */\\n' + CODE._shared.js : CODE[cur.id][t];""",
      """    const textFor = t => !CODE && !t.startsWith('rx-') ? 'Loading the code…' : t === 'shared' ? '/* Shared core: tokens and base styles */\\n' + CODE._shared.css + '\\n\\n/* Shared core: icons and helpers */\\n' + CODE._shared.js : t.startsWith('rx-') ? rxText(rx, t) : CODE[cur.id][t];""")
patch("""    function showCode(t){ tab = t; $$('.dv-tab', dv).forEach(b => b.setAttribute('aria-selected', b.dataset.t === t)); $('#dv-pre').innerHTML = codeLines(textFor(t)); $('#dv-pre').scrollTop = 0; }""",
      """    function showCode(t){ tab = t; $$('.dv-tab', dv).forEach(b => b.setAttribute('aria-selected', b.dataset.t === t)); $('#dv-pre').innerHTML = codeLines(textFor(t)); $('#dv-pre').scrollTop = 0; }
    // the install command and tabs follow the HTML or React choice
    function dvMode(v){
      fw.set(v); const react = v === 'react', name = regName(cur.id);
      $('#dv-code').classList.toggle('rx', react); $$('#dv-code .fw-sw button').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.fw === 'react') === react)));
      $('#dv-cmd-t').textContent = `npx designme add ${name}${react ? ' --react' : ''}`;
      showCode(react ? 'rx-tsx' : 'html'); if (react) dvLoad();
    }
    async function dvLoad(){
      const want = cur.id;
      try { const r = await reactOf(regName(want)); if (!cur || want !== cur.id) return; rx = r; if (tab.startsWith('rx-')) showCode(tab); }
      catch(e){ if (cur && want === cur.id && tab.startsWith('rx-')) $('#dv-pre').innerHTML = codeLines('// The React version could not be loaded. Try again in a moment.'); }
    }""")
patch("""      $('#dv-cmd-t').textContent = `npx designme add ${slug(name)}`;
""", "")
patch("""      showCode('html');
      const sibs""", """      rx = null; dvMode(fw.get());
      if (!CODE) codeReady().then(() => { if (cur === c && !tab.startsWith('rx-')) showCode(tab); }, () => { if (cur === c && !tab.startsWith('rx-')) $('#dv-pre').innerHTML = codeLines('// The code could not be loaded. Try again in a moment.'); });
      const sibs""")
patch("""      const t = e.target.closest('.dv-tab'); if (t && t.dataset.t !== tab){ showCode(t.dataset.t); Sound.play('tab'); }""",
      """      const f = e.target.closest('#dv-code .fw-sw button'); if (f){ if (f.dataset.fw !== fw.get()){ dvMode(f.dataset.fw); Sound.play('tab'); } return; }
      const t = e.target.closest('.dv-tab'); if (t && t.dataset.t !== tab){ showCode(t.dataset.t); Sound.play('tab'); }""")
patch("""    $('#dv-copy').addEventListener('click', async () => { if (await copyText(tab === 'shared' ? textFor('shared') : bundle(cur.id))){ Sound.play('copy'); showToast('Copied ' + (tab === 'shared' ? 'shared core' : CODE[cur.id].name)); } });""",
      """    $('#dv-copy').addEventListener('click', async () => { const react = tab.startsWith('rx-'); if (react ? !rx : !CODE) return; if (await copyText(tab === 'shared' || react ? textFor(tab) : bundle(cur.id))){ Sound.play('copy'); showToast('Copied ' + (tab === 'shared' ? 'shared core' : react ? rxFile(rx, tab) : CODE[cur.id].name)); } });""")

# ---------- thumbnails in "More in …" ----------
patch("""$$('#dv-more .dv-card').forEach(card => {
        const x = $('#' + card.dataset.id), main = x && x.querySelector('.stage-inner > :not(.code-btns)'); if (!main) return;""",
      """$$('#dv-more .dv-card').forEach(function snap(card){
        // a component that never scrolled into view has nothing to copy yet: start it, then take the snapshot
        const host = $('#' + card.dataset.id + ' .v2.stage-in');
        if (host && !host.children.length && !card.dataset.waited && window.V2){ card.dataset.waited = '1'; window.V2.replay(host.closest('.comp')); setTimeout(() => { if (card.isConnected) snap(card); }, 1400); return; }
        const x = $('#' + card.dataset.id), main = x && x.querySelector('.stage-inner > :not(.code-btns)'); if (!main) return;""")

# ---------- the greyed-out Webflow and Framer buttons leave the code toolbars ----------
SITE = open(os.path.join(HERE, 'site-main.html')).read()
def soon_before(marker):
    # the two coming-soon buttons that sit right before `marker`, exactly as the site has them
    j = SITE.index(marker); i = SITE.rindex('<button class="soon-btn"', 0, j); i = SITE.rindex('<button class="soon-btn"', 0, i)
    return SITE[i:j]
patch(soon_before('<button class="cdm-copy" id="cdm-copy">') + '<button class="cdm-copy" id="cdm-copy">', '<button class="cdm-copy" id="cdm-copy">')
patch(soon_before('<button class="dv-copy" id="dv-copy">') + '<button class="dv-copy" id="dv-copy">', '<button class="dv-copy" id="dv-copy">')
# a quiet line under the component page's code says they are coming
patch("""<pre class="cd-pre dv-pre" id="dv-pre"></pre></div>""", """<pre class="cd-pre dv-pre" id="dv-pre"></pre></div>
        <p class="dv-soon">Webflow and Framer exports are on the way. <a href="#/roadmap">See the roadmap</a></p>""")

# ---------- copy before the code has arrived ----------
patch("""  $$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const ok = await copyText(bundle(btn.closest('.comp').id));""", """  // a copy before the code has arrived waits for it; Safari only allows that through a ClipboardItem made during the click
  async function copyLater(get){
    if (CODE) return copyText(get());
    if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write){
      try { await navigator.clipboard.write([new ClipboardItem({ 'text/plain': codeReady().then(() => new Blob([get()], { type:'text/plain' })) })]); return true; } catch(e) {}
    }
    try { await codeReady(); } catch(e) { return false; }
    return copyText(get());
  }
  // the install command in the intro
  $$('[data-cmd]').forEach(b => b.addEventListener('click', async () => { if (await copyText(b.dataset.cmd)){ Sound.play('copy'); showToast('Install command copied'); } }));
  $$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const ok = await copyLater(() => bundle(btn.closest('.comp').id));""")

# ---------- the intro: one short line, the React install command, then a switch between the two sets ----------
RX_CMD = 'npx designme add live-answer --react'
patch("""<p>46 components for showing an agent's work, from status and conversation to review, sources and workspace, plus 32 app basics for the dashboard around it, designed and built by the <a href="https://designme.agency" target="_blank" rel="noopener">DesignMe</a> team.</p>""",
      """<p>103 free components in HTML or React, designed and built by <a href="https://designme.agency" target="_blank" rel="noopener">DesignMe</a>.</p>
  <div class="intro-get"><button class="cdm-cmd intro-cmd" data-cmd=\"""" + RX_CMD + """\" title="Copy install command"><span class="d">$</span><span class="c">""" + RX_CMD + """</span><span class="ms sm">content_copy</span></button></div>""")
# the two group introductions become one switch: Agent components or App basics
patch("""<div class="grp-intro"><span class="k">46 components</span><h2>Agent components</h2><p>Everything for showing an agent's work, from the first plan to the final summary.</p></div>""",
      """<div class="grp-sw" id="grp-sw" role="tablist" aria-label="Components"><span class="grp-ind" aria-hidden="true"></span><button role="tab" aria-selected="true" data-g="agent">Agent components</button><button role="tab" aria-selected="false" data-g="basics">App basics</button></div>""")
# where Agent components end, App basics follow on when the reader gets there
patch("""<div class="grp-intro"><span class="k">32 components</span><h2>App basics</h2><p>Charts, dates, forms and the standard pieces for building the dashboard around your agent.</p></div>""",
      """<div class="grp-end" id="grp-end" aria-hidden="true"></div><div class="grp-next" id="grp-next"><h2>App basics</h2></div>""")
# a search or the saved list looks across both sets
patch("""      const none = !shown;""", """      document.documentElement.classList.toggle('grp-all', !!q || mode === 'saved');
      const none = !shown;""")
patch("""  /* ---------- book a call button: fill grows from the pointer ---------- */""", """  /* ---------- Agent components or App basics: one set at a time, and App basics follow on where Agent components end ---------- */
  {
    const root = document.documentElement, sw = $('#grp-sw'), ind = $('.grp-ind', sw), next = $('#grp-next'), end = $('#grp-end');
    const cont = () => root.classList.contains('grp-cont'), both = () => cont() || root.classList.contains('grp-all');
    const place = () => { const b = $('[aria-selected="true"]', sw); if (b){ ind.style.left = b.offsetLeft + 'px'; ind.style.width = b.offsetWidth + 'px'; } };
    // the tab the switch shows, which is the set on screen
    const mark = g => { $$('button', sw).forEach(b => b.setAttribute('aria-selected', String(b.dataset.g === g))); place(); };
    const set = g => {
      root.classList.remove('grp-cont');
      if (root.dataset.grp !== g){ root.dataset.grp = g; setTimeout(() => dispatchEvent(new Event('resize')), 30); }
      mark(g);
    };
    root.dataset.grp = 'agent'; place();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    new ResizeObserver(place).observe(sw);
    sw.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || b.getAttribute('aria-selected') === 'true') return;
      Sound.play('tab');
      // with both sets on the page, the switch jumps between them
      if (cont()){ mark(b.dataset.g); (b.dataset.g === 'basics' ? next : sw).scrollIntoView({ block:'start', behavior:'smooth' }); return; }
      set(b.dataset.g);
      // from further down the page, the new set starts at the top
      if (sw.getBoundingClientRect().top < 0) sw.scrollIntoView({ block:'start' });
    });
    // nearing the end of Agent components brings App basics in below, before the reader gets there, so nothing on screen moves
    new IntersectionObserver(es => {
      if (!es[0].isIntersecting || root.dataset.grp !== 'agent' || both()) return;
      root.classList.add('grp-cont'); setTimeout(() => dispatchEvent(new Event('resize')), 30);
    }, { rootMargin:'0px 0px 700px 0px' }).observe(end);
    // while both are on the page, the switch follows the scroll
    addEventListener('scroll', () => {
      if (!cont()) return;
      const g = next.getBoundingClientRect().top < innerHeight * .4 ? 'basics' : 'agent', on = $('[aria-selected="true"]', sw);
      if (!on || on.dataset.g !== g) mark(g);
    }, { passive:true });
    // anything that points at a card or section in the other set switches to it first, unless both are showing
    const slugOf = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const follow = el => { if (both()) return; const sec = el && el.closest && el.closest('.lib-sec'); if (sec && sec.dataset.grp && sec.dataset.grp !== root.dataset.grp) set(sec.dataset.grp); };
    // the component page steps through both sets, so on its way out it shows the set its last component is in
    window.dmFollow = follow;
    const target = h => { if (/^#\\/./.test(h)) return $$('main .comp').find(c => slugOf(c.querySelector('.comp-title').textContent) === h.slice(2)); try { return h.length > 1 ? document.querySelector(h) : null; } catch(e){ return null; } };
    // anything below both sets (the questions, the footer) lays both sets out first, so the page has its full length before
    // the jump, and App basics can't arrive halfway down and push the target further away
    const below = el => !!el && !el.closest('.lib-sec') && !!($('main').compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
    const all = () => { if (both()) return; root.dataset.grp = 'agent'; root.classList.add('grp-cont'); dispatchEvent(new Event('resize')); };
    const go = el => { if (below(el)) all(); else follow(el); };
    document.addEventListener('click', e => { const a = e.target.closest('a[href^="#"],[data-id]'); if (a) go(a.dataset.id ? document.getElementById(a.dataset.id) : target(a.getAttribute('href'))); }, true);
    addEventListener('hashchange', () => go(target(location.hash)));
    addEventListener('popstate', () => go(target(location.hash)));
    go(target(location.hash));
  }
  /* ---------- book a call button: fill grows from the pointer ---------- */""")
# the phone menu's search counted one card too few
patch("""placeholder="Search ${$$('main .comp').length - 1} components\"""", """placeholder="Search ${$$('main .comp').length} components\"""")
patch("""from status pills and reasoning trails to tool calls and run summaries, plus app basics for the dashboard around them, in two styles with light and dark mode.""",
      """from status pills and reasoning trails to tool calls and run summaries, plus app basics for the dashboard around them, in HTML or React, in two styles with light and dark mode.""")
patch("""<meta property="og:description" content="Free UI components for AI agent products, in two styles with light and dark mode.""",
      """<meta property="og:description" content="Free UI components for AI agent products, in HTML or React, in two styles with light and dark mode.""")

# ---------- component page: an arrow either side, named on hover, and the plain arrow keys ----------
patch("""<button class="dv-ib" id="dv-x" aria-label="Close">${ic('close','sm')}</button></div>""",
      """<button class="dv-ib" id="dv-x" aria-label="Close">${ic('close','sm')}</button></div>
      <button class="dv-side l" id="dv-sl"><span class="dv-side-i">${ic('chevron_left','sm')}</span><span class="dv-side-t"><span class="k">Previous<kbd>←</kbd></span><span class="n"></span></span></button>
      <button class="dv-side r" id="dv-sr"><span class="dv-side-i">${ic('chevron_right','sm')}</span><span class="dv-side-t"><span class="k">Next<kbd>→</kbd></span><span class="n"></span></span></button>""")
patch("""      $('#dv-sec').textContent = secName;""", """      // the arrows name the components either side, in the order of the page
      { const o = order(), i = o.indexOf(c), at = k => o[(i + k + o.length) % o.length].querySelector('.comp-title').textContent;
        [['#dv-prev', '#dv-sl', 'Previous', at(-1), '←'], ['#dv-next', '#dv-sr', 'Next', at(1), '→']].forEach(([top, side, k, n, key]) => {
          $(top).title = `${k}: ${n} (${key})`; $(top).setAttribute('aria-label', `${k}: ${n}`);
          $('.n', $(side)).textContent = n; $(side).setAttribute('aria-label', `${k}: ${n}`); }); }
      $('#dv-sec').textContent = secName;""")
patch("""    const step = n => { const o = order(), i = o.indexOf(cur); open(o[(i + n + o.length) % o.length]); Sound.play('tab'); };""",
      """    const step = n => { const o = order(), i = o.indexOf(cur); open(o[(i + n + o.length) % o.length]); Sound.play('tab');
      // the next component comes in from the side it's on
      if (!reduce) [$('.dv-h', dv), $('#dv-slot')].forEach((el, k) => el.animate([{ opacity:0, transform:`translateX(${n * 28}px)` }, { opacity:1, transform:'none' }], { duration:460, delay:k * 50, easing:'cubic-bezier(.16,1,.3,1)', fill:'backwards' })); };""")
patch("""    $('#dv-prev').addEventListener('click', () => step(-1)); $('#dv-next').addEventListener('click', () => step(1));""",
      """    $('#dv-prev').addEventListener('click', () => step(-1)); $('#dv-next').addEventListener('click', () => step(1));
    $('#dv-sl').addEventListener('click', () => step(-1)); $('#dv-sr').addEventListener('click', () => step(1));
    // a click doesn't leave focus on an arrow, so the arrow keys that follow don't ring it; Tab still reaches them
    ['#dv-sl', '#dv-sr', '#dv-prev', '#dv-next'].forEach(id => $(id).addEventListener('pointerdown', e => e.preventDefault()));""")
# the plain arrow keys step too, unless they belong to a field, a tab list or the component itself (Alt and an arrow always step)
patch("""(e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.altKey) step(e.key === 'ArrowRight' ? 1 : -1);""",
      """(e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !e.ctrlKey && !e.metaKey && !e.shiftKey && (e.altKey || !e.target.closest('#dv-slot,[role="tablist"],[role="radiogroup"],[role="menu"],[role="slider"],.fw-sw'))){ if (e.target.closest('.dv-bar,.dv-side')) dv.focus({ preventScroll:true }); step(e.key === 'ArrowRight' ? 1 : -1); }""")
patch("""      ph.replaceWith(cur); const back = cur; cur = null; ph = null;""",
      """      ph.replaceWith(cur); const back = cur; cur = null; ph = null; if (window.dmFollow) window.dmFollow(back);""")

# the component page takes focus itself when it opens, not its first button, so the arrow keys don't ring that button
patch("""setTimeout(() => $('#dv-back').focus(), 80);""", """setTimeout(() => { dv.tabIndex = -1; dv.focus({ preventScroll:true }); }, 80);""")

# ---------- sound on every click and hover, through the site's own sound switch (off until someone turns it on) ----------
patch("""  ['pointerdown','keydown'].forEach(ev => document.addEventListener(ev, () => Sound.ensure(), {capture:true}));""",
      """  ['pointerdown','keydown'].forEach(ev => document.addEventListener(ev, () => Sound.ensure(), {capture:true}));
  /* every click and hover gets a sound: anything with a pointer cursor counts, so the components need nothing of their own.
     A click that already plays a sound of its own keeps just that one, a switch or a checkbox says on or off, and typing
     fields stay quiet. Hovers tick once per control, never while the page scrolls, and only for a mouse */
  {
    const FIELD = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]),textarea,select,[contenteditable="true"]';
    const live = el => !(el.disabled || el.getAttribute('aria-disabled') === 'true');
    // the control under the pointer: the nearest of the target and a few parents with a pointer cursor
    const control = t => { for (let el = t, k = 0; el && el.nodeType === 1 && k < 6; el = el.parentElement, k++){ if (el.matches(FIELD)) return null; const cur = getComputedStyle(el).cursor; if (cur === 'pointer') return el; if (cur === 'not-allowed') return null; } return null; };
    document.addEventListener('click', e => {
      if (!Sound.on || !e.isTrusted) return;
      const el = control(e.target); if (!el || !live(el)) return;
      const t0 = performance.now();
      // after the click's own handlers have run: a switch or checkbox reads its new state, anything that played a sound is left alone
      setTimeout(() => {
        if (Sound.last >= t0) return;
        const sw = el.closest('[role="switch"],[role="checkbox"],[role="menuitemcheckbox"],input[type="checkbox"]');
        if (sw) Sound.play(sw.matches('input') ? (sw.checked ? 'on' : 'off') : sw.getAttribute('aria-checked') === 'true' ? 'on' : 'off');
        else Sound.play('click');
      }, 0);
    }, true);
    let over = null, lastHover = 0, still = 0;
    const moved = () => { still = performance.now(); over = null; };
    addEventListener('scroll', moved, { capture:true, passive:true }); addEventListener('wheel', moved, { passive:true });
    document.addEventListener('pointerover', e => {
      if (!Sound.on || e.pointerType !== 'mouse') return;
      const el = control(e.target); if (el === over) return; over = el;
      const now = performance.now(); if (!el || !live(el) || now - still < 180 || now - lastHover < 60) return;
      lastHover = now; Sound.play('hover');
    }, { passive:true });
  }""")

# the sounds: recordings in one file instead of synthesised tones (see make-sounds.py)
patch("""    function ensure(){
      if (!ctx){
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        ctx = new AC(); master = ctx.createGain(); master.gain.value = .7;
        const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
    }
    function ready(){ return on && ctx && ctx.state === 'running'; }
    function tone({f=880, f2=null, type='sine', dur=.08, gain=.05, delay=0, attack=.004}){
      if (!ready()) return;
      const t = ctx.currentTime + delay, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + attack); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .03);
    }
    let nbuf = null;
    function noise({dur=.16, gain=.02, from=900, to=2600, q=1.2}){
      if (!ready()) return;
      if (!nbuf){ nbuf = ctx.createBuffer(1, ctx.sampleRate * .5, ctx.sampleRate); const d = nbuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
      const t = ctx.currentTime, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = nbuf; f.type = 'bandpass'; f.Q.value = q;
      f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + dur);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + dur * .35); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + dur + .02);
    }
    const fx = {
      tab:    () => tone({f:1500, f2:1050, dur:.045, gain:.035}),
      tick:   () => tone({f:2100, f2:1600, dur:.03, gain:.018}),
      select: () => { tone({f:660, dur:.07, gain:.035}); tone({f:990, dur:.09, gain:.03, delay:.045}); },
      pop:    () => tone({f:760, f2:1080, type:'triangle', dur:.1, gain:.04}),
      done:   () => { tone({f:784, type:'triangle', dur:.16, gain:.035}); tone({f:1175, type:'triangle', dur:.26, gain:.03, delay:.09}); },
      open:   () => noise({from:700, to:2400, dur:.2, gain:.022}),
      close:  () => noise({from:2400, to:700, dur:.18, gain:.02}),
      stream: () => tone({f:2800, dur:.012, gain:.006}),
      send:   () => tone({f:480, f2:1100, dur:.13, gain:.04}),
      fail:   () => tone({f:320, f2:230, type:'triangle', dur:.18, gain:.035}),
      on:     () => tone({f:880, f2:1320, dur:.07, gain:.03}),
      off:    () => tone({f:1320, f2:880, dur:.07, gain:.03}),
      copy:   () => { tone({f:1200, dur:.04, gain:.028}); tone({f:1700, dur:.05, gain:.028, delay:.045}); }
    };
    return {
      ensure,
      play: n => { try { fx[n] && fx[n](); } catch(e) {} },
      get on(){ return on; },
      set(v){ on = v; try { localStorage.setItem('dmui-sound', v ? 'on' : 'off'); } catch(e) {} }
    };
""", """    function ensure(){
      if (!ctx){
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        ctx = new AC(); master = ctx.createGain(); master.gain.value = .7;
        const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      if (on) load();
    }
    function ready(){ return on && ctx && ctx.state === 'running'; }
    /* recorded sounds rather than synthesised tones: Kenney's Interface Sounds and UI Audio (CC0), all in one file that is
       only fetched once sound is on. sounds/ui.json says where each one starts, how long it lasts and how loud it plays;
       tools/site/make-sounds.py builds both */
    let buf = null, map = null, loading = null;
    function load(){
      if (loading || !ctx) return loading;
      loading = Promise.all([fetch('/sounds/ui.json').then(r => r.json()), fetch('/sounds/ui.wav').then(r => r.arrayBuffer())])
        .then(([m, data]) => new Promise((res, rej) => ctx.decodeAudioData(data, res, rej)).then(b => { buf = b; map = m; }))
        .catch(() => { loading = null; });
      return loading;
    }
    // a touch of variation in pitch, so a run of hovers or clicks doesn't sound like a machine
    const VARY = { hover:.05, click:.04, tick:.04, tab:.03, stream:.08 };
    function sample(n){
      const s = map && map[n]; if (!s || !ready()) return;
      const src = ctx.createBufferSource(), g = ctx.createGain(), v = VARY[n] || 0;
      src.buffer = buf; src.playbackRate.value = 1 + (Math.random() * 2 - 1) * v; g.gain.value = s[2];
      src.connect(g); g.connect(master); src.start(ctx.currentTime, s[0], s[1]);
    }
    return {
      ensure,
      // a sound asked for while the file is still on its way plays when it lands, if that's soon enough to still belong
      play: n => { last = performance.now(); try { if (buf) sample(n); else if (on && load()){ const t = last; loading.then(() => { if (performance.now() - t < 400) sample(n); }); } } catch(e) {} },
      get last(){ return last; },
      get on(){ return on; },
      set(v){ on = v; try { localStorage.setItem('dmui-sound', v ? 'on' : 'off'); } catch(e) {} if (v) ensure(); }
    };
""")
patch("""    let ctx = null, master = null, on = false;""", """    let ctx = null, master = null, on = false, last = 0;""")

# sound starts muted on every visit; turning it on lasts until the page is closed
patch("""    // sound starts off and stays on once someone turns it on
    try { if (localStorage.getItem('dmui-sound') === 'on') on = true; } catch(e) {}
""", """    // sound starts muted on every visit; turning it on lasts until the page is closed
""")
patch("""      set(v){ on = v; try { localStorage.setItem('dmui-sound', v ? 'on' : 'off'); } catch(e) {} if (v) ensure(); }""",
      """      set(v){ on = v; if (v) ensure(); }""")

patch("""Your theme, style, sound setting and saved components""", """Your theme, style and accent colour""")
patch("""add it once for the tokens, icons, sound and helpers.""", """add it once for the tokens, icons and helpers.""")

# the card title is a link to the component's own page: a plain click opens the component here, as before, and a click
# meant for a new tab follows the link
patch("""      c.querySelector('.comp-title').addEventListener('click', () => { if (!dv.contains(c)) open(c); });""",
      """      c.querySelector('.comp-title').addEventListener('click', e => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return; e.preventDefault(); if (!dv.contains(c)) open(c); });""")

# ---------- restyle: Soft first, the site's pages in the sidebar, no saved list ----------
# Soft is the style a first visit opens in; a visitor who picks Blueprint keeps it
patch("""var st=localStorage.getItem("dmui-style");if(st)document.documentElement.setAttribute("data-style",st)""",
      """var st=localStorage.getItem("dmui-style")||"soft";if(st==="soft")document.documentElement.setAttribute("data-style",st)""")
# Changelog, Roadmap and FAQ leave the header for the top of the sidebar, under Library, the page you're on
patch("""  <nav class="top-links" aria-label="Site"><a href="#/changelog">Changelog</a><a href="#/roadmap">Roadmap</a><a href="#faq">FAQ</a></nav>\n""", "")
patch("""aria-label="Search components"><span class="kbd">/</span></label>""",
      """aria-label="Search components"><span class="kbd">/</span></label>
  <nav class="side-pages" aria-label="Site"><a class="side-p act" href="#components" aria-current="page"><span class="ms">dashboard</span>Library</a><a class="side-p" href="/docs/introduction"><span class="ms">description</span>Docs</a><a class="side-p" href="#/changelog"><span class="ms">history</span>Changelog</a><a class="side-p" href="#/roadmap"><span class="ms">trending_up</span>Roadmap</a><a class="side-p" href="#/faq"><span class="ms">help</span>FAQ</a></nav>""")

# Changelog and Roadmap keep the sidebar beside them (on wider screens), and the sidebar marks the page that's open
patch("""    document.addEventListener('click', e => {
      const a = e.target.closest('a[href="#/changelog"], a[href="#/roadmap"], a[href="#/privacy"]'); if (!a) return;""",
      """    // the sidebar's pages: Library, or the page open over it
    { const markSide = () => { const h = pv.classList.contains('open') ? location.hash : '#components';
        $$('.side-p').forEach(a => { const on = a.getAttribute('href') === h; a.classList.toggle('act', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }); };
      new MutationObserver(markSide).observe(pv, { attributes:true, attributeFilter:['class'] }); }
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href="#/changelog"], a[href="#/roadmap"], a[href="#/privacy"]'); if (!a) return;""")

# every component has its own page: a card's title and its expand button go there, and an old in-page address (/#/composer)
# forwards to it, instead of opening the old full-screen view
patch("""    function open(c, push = true){
      if (!c) return;
      const was = dv.classList.contains('open');""", """    function open(c, push = true){
      if (c && c.dataset.reg){ location.href = '/components/' + c.dataset.reg; return; }
      if (!c) return;
      const was = dv.classList.contains('open');""")
patch("""const b = document.createElement('button'); b.className = 'exp-btn'; b.title = 'Open full screen';
      b.setAttribute('aria-label', 'Open ' + c.querySelector('.comp-title').textContent + ' full screen');""",
      """const b = document.createElement('button'); b.className = 'exp-btn'; b.title = 'Open its page';
      b.setAttribute('aria-label', 'Open the ' + c.querySelector('.comp-title').textContent + ' page');""")

# ---------- FAQ: a page of its own, beside the sidebar like Changelog and Roadmap, with a way to ask or suggest more ----------
patch("""    const PAGES = { changelog:[changelog,'Changelog'], roadmap:[roadmap,'Roadmap'], privacy:[privacy,'Privacy'] };""",
      """    // the questions: the homepage's list moves onto this page while it's open (it keeps its open and close), and back after
    const faqHome = $('#faq');
    function faq(){
      inEl.innerHTML = `<div class="pv-h"><span class="dv-sec">FAQ</span><h1>Questions</h1><p>What people usually ask before they start using the library.</p></div><div class="faq-slot"></div>
        <div class="faq-more">
          <div class="faq-card"><b>Have a question we didn't answer?</b><p>Write to us and someone from the DesignMe team will reply.</p><a class="pv-btn" href="mailto:hello@designme.agency">Email hello@designme.agency</a></div>
          <div class="faq-card"><b>Missing a component?</b><p>Suggest it on the roadmap and upvote the ideas you want most.</p><a class="pv-btn" href="#/roadmap">Suggest a component</a></div>
        </div>`;
      $('.faq-slot', inEl).appendChild($('#faq-list'));
      pv._leave = () => faqHome.appendChild($('#faq-list'));
    }
    const PAGES = { changelog:[changelog,'Changelog'], roadmap:[roadmap,'Roadmap'], faq:[faq,'FAQ'], privacy:[privacy,'Privacy'] };""")
patch("""      const a = e.target.closest('a[href="#/changelog"], a[href="#/roadmap"], a[href="#/privacy"]'); if (!a) return;""",
      """      const a = e.target.closest('a[href="#/changelog"], a[href="#/roadmap"], a[href="#/faq"], a[href="#/privacy"]'); if (!a) return;""")
patch("""    const route = push => { const m = location.hash.match(/^#\\/(changelog|roadmap|privacy)$/); if (m) open(m[1], push); else close(false); };""",
      """    const route = push => { const m = location.hash.match(/^#\\/(changelog|roadmap|faq|privacy)$/); if (m) open(m[1], push); else close(false); };""")
patch("""    if (/^#\\/(changelog|roadmap|privacy)$/.test(location.hash)) setTimeout(() => route(false), 250);""",
      """    if (/^#\\/(changelog|roadmap|faq|privacy)$/.test(location.hash)) setTimeout(() => route(false), 250);""")
patch("""<div class="sf-links"><a href="#/changelog">Changelog</a><a href="#/roadmap">Roadmap</a><a href="#faq">FAQ</a>""",
      """<div class="sf-links"><a href="/docs/introduction">Docs</a><a href="#/changelog">Changelog</a><a href="#/roadmap">Roadmap</a><a href="#/faq">FAQ</a>""")
patch("""      <div class="m-links mi-in"><a href="#/changelog">Changelog</a><a href="#/roadmap">Roadmap</a><a href="#faq">FAQ</a></div>""",
      """      <div class="m-links mi-in"><a href="/docs/introduction">Docs</a><a href="#/changelog">Changelog</a><a href="#/roadmap">Roadmap</a><a href="#/faq">FAQ</a></div>""")
# answers that have to be true of the code
patch("""It needs the shared core once, which holds the tokens, icons, sound and small helpers,""", """It needs the shared core once, which holds the tokens, icons and small helpers,""")
patch("""They work with a keyboard, use proper roles and labels, and respect reduced motion.""",
      """They use proper roles and labels and respect reduced motion, and most work fully with a keyboard. A few, like Kanban and File explorer, are still getting their keyboard support.""")
patch("""Every week. Each release is listed in the """, """Often. Each release is listed in the """)

# ---------- a search from another page ----------
# the docs and component pages have the same sidebar search; pressing Enter there opens the library at /?q=<words>, which
# filters it here exactly as typing would
patch("""    sq.addEventListener('keydown', e => { if (e.key === 'Escape'){ sq.value = ''; query = ''; applyView(); sq.blur(); } });""",
      """    sq.addEventListener('keydown', e => { if (e.key === 'Escape'){ sq.value = ''; query = ''; applyView(); sq.blur(); } });
    { let q0 = ''; try { q0 = (new URLSearchParams(location.search).get('q') || '').trim(); } catch(e){}
      if (q0){ sq.value = q0; query = q0; applyView(); } }""")

# ---------- a card's buttons on a touch screen ----------
# with a mouse they appear over the stage on hover; a touch screen has no hover, so there they sit in the card's footer row,
# beside its name, as a row of icons that never covers the component or its text. Each keeps its name for screen readers
patch("""    function placeCodeBtns(){
      const soft = root.getAttribute('data-style') === 'soft';
      $$('.comp').forEach(c => {
        const btns = c.querySelector('.code-btns'); if (!btns) return;
        if (!btns._home){ btns._home = btns.parentElement; btns._next = btns.nextSibling; }
        const st = c.querySelector('.stage'); if (btns.parentElement !== st) st.appendChild(btns);
      });
    }
    placeCodeBtns();""", """    const touch = matchMedia('(hover: none)');
    const NAME = { anim:n => 'Animate ' + n, view:n => 'View the code of ' + n, copy:n => 'Copy the code of ' + n };
    function placeCodeBtns(){
      const soft = root.getAttribute('data-style') === 'soft';
      $$('.comp').forEach(c => {
        const btns = c.querySelector('.code-btns'); if (!btns) return;
        if (!btns._home){
          btns._home = btns.parentElement; btns._next = btns.nextSibling;
          // each label goes in a span the icon row can hide, and the button is named after the component
          const t = c.querySelector('.comp-title'), n = t ? t.textContent.trim() : '';
          $$('button', btns).forEach(b => {
            [...b.childNodes].forEach(x => { if (x.nodeType === 3 && x.textContent.trim()){ const s = document.createElement('span'); s.className = 'cb-l'; x.replaceWith(s); s.appendChild(x); } });
            const k = b.hasAttribute('data-anim') ? 'anim' : b.hasAttribute('data-view') ? 'view' : b.hasAttribute('data-copy') ? 'copy' : '';
            if (k && n) b.setAttribute('aria-label', NAME[k](n));
          });
        }
        const head = touch.matches && c.closest('main') && c.querySelector(':scope>.comp-head');
        if (head){ if (btns.parentElement !== head) head.insertBefore(btns, head.querySelector(':scope>.exp-btn,:scope>.save-btn')); return; }
        const st = c.querySelector('.stage'); if (btns.parentElement !== st) st.appendChild(btns);
      });
    }
    placeCodeBtns();
    if (touch.addEventListener) touch.addEventListener('change', placeCodeBtns);""")

CSS = """.comp-title a{color:inherit;text-decoration:inherit}
/* component page: an arrow either side of the component, halfway down the screen, centred in the space beside it.
   Hovering one names the component it goes to underneath it, never wider than that space, so nothing covers the component.
   Where the space gets too narrow for a name, the arrows in the top bar take over */
.dv-side{--gut:calc((100vw - 1180px) / 2 + 24px);position:fixed;top:50%;z-index:6;display:none;width:44px;height:44px;margin-top:-22px;border-radius:999px;background:var(--sh-card);color:var(--sh-dim);box-shadow:0 0 0 1px var(--sh-line),0 2px 10px rgba(17,19,24,.05);transition:box-shadow .25s ease,color .2s ease}
.dv-side:hover{color:var(--sh-text);box-shadow:0 0 0 1px var(--sh-line-2),0 6px 20px rgba(17,19,24,.08)}
.dv-side.l{left:calc(var(--gut) / 2 - 22px)}
.dv-side.r{right:calc(var(--gut) / 2 - 22px)}
.dv-side-i{display:grid;place-items:center;width:100%;height:100%}
.dv-side-i svg,.dv-side-i .ms{transition:transform .35s cubic-bezier(.16,1,.3,1)}
.dv-side.l:hover .dv-side-i svg,.dv-side.l:hover .dv-side-i .ms{transform:translateX(-2px)}
.dv-side.r:hover .dv-side-i svg,.dv-side.r:hover .dv-side-i .ms{transform:translateX(2px)}
.dv-side-t{position:absolute;top:100%;left:50%;display:flex;flex-direction:column;align-items:center;gap:2px;width:max-content;max-width:calc(var(--gut) - 32px);margin-top:12px;text-align:center;opacity:0;transform:translate(-50%,-4px);pointer-events:none;transition:opacity .2s ease,transform .35s cubic-bezier(.16,1,.3,1)}
.dv-side:hover .dv-side-t,.dv-side:focus-visible .dv-side-t{opacity:1;transform:translate(-50%,0)}
.dv-side-t .k{display:flex;align-items:center;gap:5px;font-size:11px;line-height:14px;color:var(--sh-dim)}
.dv-side-t .n{font-size:12.5px;line-height:16px;font-weight:500;color:var(--sh-text);overflow-wrap:anywhere}
.dv:focus{outline:none}
.dv-side-t kbd{font-family:inherit;font-size:10px;line-height:14px;font-weight:500;padding:0 4px;border-radius:4px;box-shadow:inset 0 0 0 1px var(--sh-line);color:var(--sh-dim)}
@media (min-width:1400px){ .dv-side{display:block} .dv-bar #dv-prev,.dv-bar #dv-next{display:none} }

/* a component's own page: the code panel is right below, so the preview keeps only Animate */
.dv-slot [data-view],.dv-slot [data-copy]{display:none}
.dv-soon{margin:10px 2px 0;font-size:12.5px;color:var(--sh-muted)}
.dv-soon a{color:var(--sh-dim);text-decoration:underline;text-underline-offset:2px}
.dv-soon a:hover{color:var(--sh-text)}
/* HTML or React in the code view and on the detail page */
.fw-sw{display:inline-flex;flex:none;gap:2px;padding:2px;border-radius:9px;background:var(--sh-stage);border:1px solid var(--sh-line)}
.fw-sw button{height:24px;padding:0 10px;border-radius:7px;font-size:12px;font-weight:500;color:var(--sh-dim);transition:background-color .2s,color .2s}
.fw-sw button:hover{color:var(--sh-text)}
.fw-sw button[aria-pressed="true"]{background:var(--sh-chip);color:var(--sh-text)}
.cmd-row{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:12px;min-width:0}
.cmd-row .cdm-cmd{margin-top:0;min-width:0}
.cdm .rx-only,.cdm.rx .h-only{display:none}
.cdm.rx .rx-only{display:inline}
.cdm .cdm-tab[data-t^="rx-"],.cdm.rx .cdm-tab:not([data-t^="rx-"]),.dv-code .dv-tab[data-t^="rx-"],.dv-code.rx .dv-tab:not([data-t^="rx-"]){display:none}
.cdm.rx .cdm-tab[data-t^="rx-"],.dv-code.rx .dv-tab[data-t^="rx-"]{display:inline-block}
.cdm.rx .cdm-foot{display:none}
/* ---------- a quieter page: white, no dots, cards without a frame ---------- */
:root{--sh-bg:#ffffff;--sh-stage:#fafafa;--sh-top:rgba(255,255,255,.86);--sh-dot:transparent;--sh-act:#fafafa;--sh-sw:#f3f3f3;--sh-sw-on:#ffffff}
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){--sh-bg:#111111;--sh-side:#111111;--sh-stage:#1c1c1c;--sh-top:rgba(17,17,17,.86);--sh-dot:transparent;--sh-act:#1d1d1d;--sh-sw:#1c1c1c;--sh-sw-on:#2a2a2a} }
:root[data-theme="dark"]{--sh-bg:#111111;--sh-side:#111111;--sh-stage:#1c1c1c;--sh-top:rgba(17,17,17,.86);--sh-dot:transparent;--sh-act:#1d1d1d;--sh-sw:#1c1c1c;--sh-sw-on:#2a2a2a}
body.ui,.dv,.pv{background-image:none}
/* the intro: a smaller, lighter heading and one short line */
.intro h1{font-size:26px;font-weight:600;line-height:1.2;letter-spacing:-.022em}
.intro p{margin-top:8px;font-size:14.5px}
.intro-get{display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px;margin-top:18px}
.intro-get .intro-cmd{margin-top:0;min-width:0;background:var(--sh-bg)}
.intro-cmd .c{color:var(--sh-text)}
@media (max-width:960px){ .intro h1{font-size:24px} }
/* Agent components or App basics */
/* a line between the intro and the components, from the sidebar's edge to the window's: it is placed against the window
   itself (nothing above the intro is positioned), so it never reaches past the edge. The layout is centred at up to 1440px,
   and its sidebar ends 264px in; on small screens the line runs edge to edge */
.content{--ig:30px}
body.ui .content .intro{padding-bottom:0}
.intro::after{content:"";display:block;position:absolute;left:calc((100% - min(100%, 1440px)) / 2 + 264px);right:0;height:1px;margin-top:var(--ig);background:var(--sh-line);pointer-events:none}
@media (max-width:960px){ .intro::after{left:0} }
@media (max-width:640px){ .content{--ig:22px} }
.grp-sw{position:relative;display:inline-flex;gap:2px;margin:calc(var(--ig) * 2 + 1px) 0 0;padding:3px;border-radius:11px;background:var(--sh-sw);corner-shape:round}
.grp-sw button{position:relative;z-index:1;height:32px;padding:0 15px;border-radius:8px;font-size:13.5px;font-weight:500;color:var(--sh-dim);transition:color .2s ease}
.grp-sw button:hover,.grp-sw button[aria-selected="true"]{color:var(--sh-text)}
.grp-ind{position:absolute;top:3px;bottom:3px;left:3px;border-radius:8px;background:var(--sh-sw-on);box-shadow:0 1px 2px rgba(17,19,24,.08),0 0 0 .5px rgba(17,19,24,.06);transition:left .4s cubic-bezier(.16,1,.3,1),width .4s cubic-bezier(.16,1,.3,1);corner-shape:round}
.grp-sw+.lib-sec .sec-head{padding-top:28px}
@media (max-width:640px){ .grp-sw{display:flex} .grp-sw button{flex:1;padding:0 8px} }
:root:not(.grp-all):not(.grp-cont):not([data-grp="basics"]) [data-grp="basics"],:root[data-grp="basics"]:not(.grp-all) [data-grp="agent"]{display:none}
:root:not(.grp-all):not(.grp-cont) .side-lbl{display:none}
/* App basics following on: a line from the sidebar to the window's edge, like the one under the intro, then their name */
.grp-end{height:1px;margin-bottom:-1px}
.grp-next{display:none;padding-top:64px}
:root.grp-cont:not(.grp-all) .grp-next{display:block}
.grp-next::before{content:"";display:block;position:absolute;left:calc((100% - min(100%, 1440px)) / 2 + 264px);right:0;height:1px;background:var(--sh-line);pointer-events:none}
.grp-next h2{margin:44px 0 0;font-size:22px;font-weight:600;letter-spacing:-.02em;color:var(--sh-text)}
@media (max-width:960px){ .grp-next::before{left:0} .grp-next{padding-top:48px} .grp-next h2{margin-top:32px} }
/* cards: the title sits on the page and the component on a grey stage, with its switch or hint inside it */
body.ui .lib-sec .grid{gap:44px 24px}
body.ui .comp{background:none;border:0;border-radius:0;overflow:visible}
body.ui .comp-head{padding:0 2px 12px}
body.ui .comp-title{font-size:14px;font-weight:600}
body.ui .comp-desc{font-size:13px}
body.ui .stage{padding:0}
body.ui .stage-inner{border-radius:14px 14px 0 0}
body.ui .comp-foot{justify-content:center;padding:2px 16px 16px;background:var(--sh-stage);border-radius:0 0 14px 14px;corner-shape:round}
body.ui .comp-foot .mono-xs{text-align:center}
body.ui .comp-foot .tabs{background:none;padding:0}
body.ui .comp-foot .tabs .ind{top:0;bottom:0;background:var(--sh-sw-on)}
.dv-slot .stage-inner{border-radius:14px 14px 0 0}
/* the component page's stage fills its card like a card in the grid, so it lines up with the grey strip under it */
body.ui .dv-slot .stage{padding:0}
body.ui .dv-slot .stage>.code-btns{top:10px;right:20px}
/* the sidebar: quieter type, and a selected row as light as the stage */
.side-a{font-size:13px}
.side-a:hover{background:var(--sh-act)}
.side-a.act{background:var(--sh-act);font-weight:400}
/* phones: the header is one 40px row from the first paint, before the script moves its controls into the menu, and the
   sidebar, which sits below the components, waits for the end of the page so it can't flash at the top while it loads */
@media (max-width:960px){
  body.ui .top .top-actions{min-height:40px}
  .top-actions #style-seg,.top-actions #theme-btn,.top-actions #sound-btn{display:none}
  body:not(:has(> #v2-js)) .side{display:none}
}
/* wider screens: the script adds the 36px accent dot beside the style switch, so its room is kept from the first paint and
   the header doesn't grow and push the page down when it arrives */
@media (min-width:961px){
  body.ui .top .top-actions{min-height:36px}
  body.ui .top .top-actions:not(:has(#acc)) #style-seg{margin-right:44px}
}
/* ================= restyle: a calm library. 14px type, lighter headings, small controls ================= */
/* each card is one light frame: the preview on its grey stage, and under it the name and one line */
body.ui .lib-sec .grid{gap:24px;align-items:stretch}
body.ui main .comp{display:flex;flex-direction:column;padding:5px;background:var(--sh-bg);border:1px solid var(--sh-line);border-radius:16px;corner-shape:round;transition:border-color .16s ease}
body.ui main .comp:hover{border-color:var(--sh-line-2)}
body.ui main .comp>.stage{order:1;flex:1 0 auto;display:flex;flex-direction:column}
body.ui main .comp>.stage>.stage-inner{flex:1 0 auto}
body.ui main .comp>.comp-foot{order:2}
body.ui main .comp>.comp-head{order:3;display:flex;align-items:center;gap:8px;padding:11px 6px 7px 10px}
body.ui main .comp-head>div{flex:1;min-width:0}
body.ui .comp-title{font-size:14px;font-weight:500;letter-spacing:0;line-height:20px}
body.ui .comp-desc{margin:1px 0 0;font-size:14px;line-height:20px;color:var(--sh-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.ui main .comp-head .exp-btn{align-self:center;margin-left:0;width:28px;height:28px}
/* the stage keeps its rounded corners inside the frame; the hint under it goes, the preview says it by itself */
body.ui main .stage-inner{border-radius:12px 12px 0 0}
body.ui main .comp-foot{min-height:12px;padding:0 12px 12px;border-radius:0 0 12px 12px}
body.ui main .comp-foot .mono-xs{display:none}
/* no saved list: the bookmark, its sidebar group and its filter are gone */
body.ui .save-btn,body.ui .side-saved,body.ui .flt-i[data-v="saved"]{display:none!important}
/* section names: the same size as a card's name, the line beside them like a card's line */
body.ui .lib-sec .sec-head{padding:40px 0 14px;margin-bottom:20px}
body.ui .sec-head .sec-no{font-size:12px}
body.ui .sec-head h2{font-size:14px;font-weight:500;letter-spacing:0;line-height:20px}
body.ui .sec-head p{font-size:14px;line-height:20px;color:var(--sh-dim);opacity:1}
.grp-next h2{font-size:14px;font-weight:500;letter-spacing:0}
/* the intro */
.intro h1{font-size:24px;font-weight:500;letter-spacing:-.02em}
.intro p{font-size:14px}
/* Agent components or App basics: a small switch */
.grp-sw{padding:2px;border-radius:9px}
.grp-sw button{height:28px;padding:0 12px;border-radius:7px;font-size:13px}
.grp-ind{top:2px;bottom:2px;left:2px;border-radius:7px}
/* the sidebar: the site's pages first, then the components, all at 14px */
.side-pages{display:flex;flex-direction:column;gap:1px;margin:0 0 20px}
.side-p{display:flex;align-items:center;gap:10px;height:32px;padding:0 10px;border-radius:8px;font-size:14px;color:var(--sh-dim);text-decoration:none;transition:background-color .16s ease,color .16s ease;corner-shape:round}
.side-p:hover{background:var(--sh-act);color:var(--sh-text)}
.side-p.act{background:var(--sh-chip);color:var(--sh-text);font-weight:500}
.side-p .ms{display:inline-grid;place-items:center;width:16px;height:16px;font-size:16px;color:var(--sh-muted)}
.side-p.act .ms{color:var(--sh-text)}
body.ui .side-h{font-size:14px;font-weight:500}
body.ui .side-a{font-size:14px}
body.ui .side-search input{font-size:14px}
.m-links a,.m-sec,.m-lbl,.m-cta .t,.nd-t,.content-empty .t,.faq-i,.faq-q{font-size:14px!important}
body.ui .faq h2{font-size:14px;font-weight:500;letter-spacing:0}
/* the header's controls: 28px, quieter */
body.ui .top .style-seg{height:28px;padding:2px}
body.ui .top .style-seg .seg-ind{top:2px;bottom:2px}
body.ui .top .style-seg button{height:24px;padding:0 10px;font-size:13px}
body.ui .top .acc-btn{width:28px;height:28px}
body.ui .top .theme-sw{width:52px;height:28px}
body.ui .top .theme-sw .ts-thumb{top:2px;left:2px;width:22px;height:22px}
body.ui .top .theme-sw[aria-checked="true"] .ts-thumb{transform:translateX(24px)}
body.ui .top .theme-sw .ts-ic .ms{font-size:14px}
body.ui .top .sound-btn,body.ui .top .flt-btn{height:28px}
body.ui .top .sound-btn{width:28px;padding:0;justify-content:center}
body.ui .top .flt-btn{padding:0 9px 0 11px;font-size:13px}
@media (min-width:961px){
  body.ui .top .top-actions{min-height:28px}
  body.ui .top .top-actions:not(:has(#acc)) #style-seg{margin-right:36px}
}
/* ================= round 2 ================= */
/* one width for every page: 1400px, the sidebar included */
.layout,.top-in{max-width:1400px}
@media (min-width:961px){
  .intro::after,.grp-next::before{left:calc((100% - min(100%, 1400px)) / 2 + 264px)}
  /* Changelog and Roadmap open beside the sidebar and under the header, which stay where they are */
  .pv{top:var(--hh);left:calc((100vw - min(100vw, 1400px)) / 2 + 264px)}
  .pv>.dv-bar{display:none}
}
/* lighter frames: the line is there, but quiet */
body.ui main .comp{border-color:color-mix(in srgb,var(--sh-line) 50%,transparent)}
body.ui main .comp:hover{border-color:var(--sh-line)}
/* the sidebar's icons move on hover: the grid turns, the clock winds back, the arrow climbs, the question mark tilts */
.side-p .ms svg{transition:transform .42s cubic-bezier(.34,1.56,.64,1)}
.side-p[href="#components"]:hover .ms svg{transform:rotate(90deg)}
.side-p[href="#/changelog"]:hover .ms svg{transform:rotate(-50deg)}
.side-p[href="#/roadmap"]:hover .ms svg{transform:translate(2px,-2px)}
.side-p[href="#/faq"]:hover .ms svg{animation:side-tilt .6s cubic-bezier(.36,0,.2,1)}
@keyframes side-tilt{30%{transform:rotate(-16deg)}65%{transform:rotate(10deg)}100%{transform:none}}
@media (prefers-reduced-motion:reduce){ .side-p .ms svg{transition:none;animation:none!important;transform:none!important} }
/* nothing on the site is heavier than medium, and nothing but a page's title is bigger than 14px */
body.ui :is(h1,h2,h3,h4,b,strong,button,.acc-t,.side-lbl,.st,.t,.nd-t,.chg-v,.chg-tag,.rm-st,.rm-t,.rm-n span,.su-btn,.cdm-copy,.cdm-shared,.dv-copy):not(.v2 *){font-weight:500}
body.ui :is(h2,h3,.rm-t,.nl-head h2):not(.v2 *){font-size:14px;letter-spacing:0}
/* calmer previews: each component sits small in the middle of its stage, with room all round */
/* the same room above and below, so a component at its tallest sits in the middle */
body.ui main .comp .stage-inner{padding:40px 16px}
@media (min-width:641px){ body.ui main .comp .stage-inner{padding:56px 48px} }
/* ================= round 3 ================= */
/* FAQ is a page of its own now: the homepage doesn't repeat it at the bottom */
body.ui section.faq{display:none}
@media (min-width:961px){
  /* Changelog, Roadmap and FAQ sit in the middle of the column between the sidebar's edge and the end of the header */
  .pv{padding-right:calc((100vw - min(100vw, 1400px)) / 2 + 32px)}
}
/* the roadmap's suggestion box: a field like the sidebar's search, and a button like the site's other buttons */
.rm-add{gap:8px;padding:0;border:0;border-radius:0;background:none}
.rm-add input{height:36px;padding:0 14px;border:1px solid var(--sh-line);border-radius:999px;background:var(--sh-card);transition:border-color .2s,box-shadow .2s}
.rm-add input:focus{border-color:var(--sh-blue);box-shadow:0 0 0 3px rgba(17,111,248,.12)}
.rm-add .su-btn,.su-btn{width:auto;height:36px;padding:0 16px;border-radius:999px;background:var(--sh-chip);border:1px solid var(--sh-line);color:var(--sh-text);font-size:14px;font-weight:500}
.su-btn:hover{opacity:1;border-color:var(--sh-line-2)}
/* the FAQ page: the list, then two ways to ask for more */
.faq-slot{margin-top:24px}
.faq-slot .faq-list{margin:0}
.faq-more{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:40px}
.faq-card{display:flex;flex-direction:column;align-items:flex-start;gap:4px;padding:16px;border:1px solid color-mix(in srgb,var(--sh-line) 50%,transparent);border-radius:16px;font-size:14px}
.faq-card b{font-weight:500;color:var(--sh-text)}
.faq-card p{margin:0 0 10px;color:var(--sh-dim)}
.pv-btn{display:inline-flex;align-items:center;height:32px;margin-top:auto;padding:0 14px;border-radius:999px;background:var(--sh-chip);border:1px solid var(--sh-line);color:var(--sh-text);font-size:14px;font-weight:500;text-decoration:none;transition:border-color .2s}
.pv-btn:hover{border-color:var(--sh-line-2)}
@media (max-width:640px){ .faq-more{grid-template-columns:minmax(0,1fr)} }
/* Changelog and Roadmap: the same title and text as every other page */
.pv-h h1{font-size:20px;font-weight:500;letter-spacing:-.01em}
.pv-h p{font-size:14px}
/* ================= round 4: phones and tablets ================= */
/* one gutter for every page edge: 24px on a tablet, 16px on a phone, for the header, the library, its sidebar and the pages
   that open over it (Changelog, Roadmap, FAQ) */
@media (max-width:960px){
  .top-in{padding:0 24px}
  .layout{padding:0 24px}
  .dv-bar{padding:8px 24px}
  .pv-in{padding:28px 24px 72px}
  /* the full list of components stays in the menu: under the cards it was a second, very long index after the footer */
  .side .side-nav{display:none}
  /* and its links to the pages repeat the footer's just above, so the sidebar ends the page with its credit line only,
     on the same edge as everything else */
  .side .side-pages{display:none}
  .side{padding:28px 0 40px}
  .side-foot{padding:0}
}
@media (max-width:640px){
  .top-in{padding:0 16px;gap:8px}
  .layout{padding:0 16px}
  .dv-bar{padding:8px 16px}
  .pv-in{padding:24px 16px 64px}
  .to-top{right:16px;bottom:16px}
}
/* section names on a narrow screen: the number and the name on one line, the line about them right under it */
@media (max-width:960px){
  .sec-head>div{row-gap:2px}
  body.ui .sec-head p{flex-basis:100%;margin-top:0}
  body.ui .lib-sec .sec-head{padding:40px 0 14px;margin-bottom:20px}
  .grp-sw+.lib-sec .sec-head{padding-top:28px}
}
/* a card's buttons on a touch screen: an icon row in the footer, beside the name, with the line about it under both.
   The script moves them there; until it has, they stay out of the stage so they never cover the component */
@media (hover:none){
  body.ui main .stage>.code-btns{display:none}
  body.ui main .comp>.comp-head{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;column-gap:0;padding:11px 4px 7px 10px}
  body.ui main .comp-head>div{display:contents}
  body.ui main .comp-head .comp-title{grid-row:1;grid-column:1;width:auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  body.ui main .comp-head .comp-desc{grid-row:2;grid-column:1/-1;margin:0;padding-right:6px}
  body.ui main .comp-head>.code-btns{grid-row:1;grid-column:2;display:flex;gap:0;margin:-8px 0 -8px 8px}
  body.ui main .comp-head>.exp-btn{grid-row:1;grid-column:3;width:36px;height:36px;margin:-8px 0}
  body.ui main .comp-head>.code-btns .cb-l,body.ui main .comp-head>.code-btns .vl{display:none}
  body.ui main .comp-head>.code-btns .ghost{display:inline-grid;place-items:center;width:36px;height:36px;padding:0;border:0;border-radius:999px;background:none;color:var(--sh-muted);box-shadow:none}
  body.ui main .comp-head>.code-btns .ghost:active,body.ui main .comp-head>.exp-btn:active{background:var(--sh-chip);color:var(--sh-text)}
  body.ui main .comp-head>.code-btns .anim-btn::after{display:none}
}
/* Pricing cards: the original page kept 62px under them, to balance buttons that once sat over the top of the stage; now
   they get the same room above and below as every other component */
body.ui main .comp[data-v2="pricing-cards"] .stage-inner{padding-bottom:40px!important}
@media (min-width:641px){ body.ui main .comp[data-v2="pricing-cards"] .stage-inner{padding-bottom:56px!important} }
/* the roadmap: a shipped idea gets a tag like the others */
.rm-st.shipped{background:rgba(22,163,74,.12);color:#15803d}
/* in dark mode the changelog and roadmap tags take light text on a stronger tint, so they read clearly on the dark page */
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]) .chg-tag.k-new{background:rgba(96,165,250,.18);color:#a5c8ff}:root:not([data-theme="light"]) .chg-tag.k-improved,:root:not([data-theme="light"]) .rm-st.progress{background:rgba(167,139,250,.2);color:#cbbcff}:root:not([data-theme="light"]) .chg-tag.k-fixed,:root:not([data-theme="light"]) .rm-st.shipped{background:rgba(74,222,128,.16);color:#8ee8ad}:root:not([data-theme="light"]) .rm-st.idea{background:rgba(251,191,36,.18);color:#fcd57a}:root:not([data-theme="light"]) .rm-st.planned{background:rgba(255,255,255,.08);color:#c8c8c8} }
:root[data-theme="dark"] .chg-tag.k-new{background:rgba(96,165,250,.18);color:#a5c8ff}:root[data-theme="dark"] .chg-tag.k-improved,:root[data-theme="dark"] .rm-st.progress{background:rgba(167,139,250,.2);color:#cbbcff}:root[data-theme="dark"] .chg-tag.k-fixed,:root[data-theme="dark"] .rm-st.shipped{background:rgba(74,222,128,.16);color:#8ee8ad}:root[data-theme="dark"] .rm-st.idea{background:rgba(251,191,36,.18);color:#fcd57a}:root[data-theme="dark"] .rm-st.planned{background:rgba(255,255,255,.08);color:#c8c8c8}
"""

# ---------- the accent: lime by default in Blueprint, and readable in any colour ----------
# Blueprint's default accent is lime. The accent has three roles: fills (--accent, with --on-accent on top), text and icons
# (--accent-fg, 4.5:1) and lines, rings and chart marks (--accent-mark, 3:1), both on the surface and on the chips it sits on.
# These sit outside the site layer so they win over the original page's own tokens
patch("""</head>""", """<style id="accent-roles">
:root:not([data-style="soft"]){--accent:#d4f84a;--accent-hi:#d4f84a;--accent-bg:rgba(212,248,74,.18);--accent-muted:#6c7e26;--accent-icon-bg:rgba(212,248,74,.14);--accent-icon-line:rgba(134,156,47,.45);--accent-fill:#f8fde6;--on-accent:#121212;--accent-fg:#111318;--accent-mark:#7a8e2b}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]):not([data-style="soft"]){--accent:#d4f84a;--accent-hi:#dcfa6a;--accent-bg:rgba(212,248,74,.12);--accent-muted:rgba(212,248,74,.55);--accent-icon-bg:rgba(212,248,74,.06);--accent-icon-line:rgba(212,248,74,.2);--accent-fill:#1c1f10;--accent-fg:#d4f84a;--accent-mark:#d4f84a}}
:root[data-theme="dark"]:not([data-style="soft"]){--accent:#d4f84a;--accent-hi:#dcfa6a;--accent-bg:rgba(212,248,74,.12);--accent-muted:rgba(212,248,74,.55);--accent-icon-bg:rgba(212,248,74,.06);--accent-icon-line:rgba(212,248,74,.2);--accent-fill:#1c1f10;--accent-fg:#d4f84a;--accent-mark:#d4f84a}
/* these sit outside the site's layers, so they apply to Blueprint only. Soft keeps its own blue for fills and marks; as text it
   takes a slightly deeper blue in light mode (a lighter one in dark), so it reads at 4.5:1 on chips and tinted rows too, and in
   dark mode the blue fill is too light for white text, so text on it is dark */
:root[data-style="soft"]{--on-accent:#ffffff;--accent-fg:#0f5fd5;--accent-mark:var(--accent)}
@media (prefers-color-scheme: dark){:root[data-style="soft"]:not([data-theme="light"]){--accent:#116ff8;--accent-2:#0f63de;--accent-hi:#116ff8;--ink:#116ff8;--ink-hover:#0f63de;--on-ink:#ffffff;--on-accent:#ffffff;--accent-fg:#9dc4ff}}
:root[data-style="soft"][data-theme="dark"]{--accent:#116ff8;--accent-2:#0f63de;--accent-hi:#116ff8;--ink:#116ff8;--ink-hover:#0f63de;--on-ink:#ffffff;--on-accent:#ffffff;--accent-fg:#9dc4ff}
</style>
</head>""")
# a picked colour gets the same treatment: the shades for text and for marks are worked out from it
patch("""'--pb-tx','--on-accent'];""", """'--pb-tx','--on-accent','--accent-fg','--accent-mark'];""")
patch("""    v['--on-accent'] = onWhite >= 3 ? '#ffffff' : '#120a02';""", """    // text on a fill: white or near-black, whichever APCA (the contrast model behind WCAG 3) says reads better. WCAG 2's ratio
    // favours black on saturated mid-tones like violet, where white reads far better. The fill then moves a little darker
    // (white text) or lighter (dark text) until its text also reaches 4.5:1 and Lc 60
    function apca(t, b){ var y = function(c){ var Y = .2126729 * Math.pow(c[0] / 255, 2.4) + .7151522 * Math.pow(c[1] / 255, 2.4) + .072175 * Math.pow(c[2] / 255, 2.4); return Y < .022 ? Y + Math.pow(.022 - Y, 1.414) : Y; };
      var yt = y(t), yb = y(b); if (Math.abs(yb - yt) < .0005) return 0; var s = yb > yt ? (Math.pow(yb, .56) - Math.pow(yt, .57)) * 1.14 : (Math.pow(yb, .65) - Math.pow(yt, .62)) * 1.14;
      return Math.abs(s) < .1 ? 0 : (s > 0 ? s - .027 : s + .027) * 100; }
    var fl = rgb(v['--accent'] || base), INK = [18,10,2], useW = Math.abs(apca(W, fl)) >= Math.abs(apca(INK, fl)), onC = useW ? W : INK;
    for (var j = 0; j <= 40; j += 2){ var f2 = mix(fl, useW ? K : W, j / 100); if (ratio(onC, f2) >= 4.5 && Math.abs(apca(onC, f2)) >= 60){ fl = f2; break; } }
    v['--accent'] = hex(fl); if (soft && !dark) v['--ink'] = v['--accent']; v['--on-accent'] = useW ? '#ffffff' : '#120a02';
    // as text it needs 4.5:1 and APCA Lc 60, and as lines and chart marks 3:1, on the surface and on the chips and tinted rows it
    // sits on: it is darkened on a light page (lightened on a dark one) until it gets there, and text falls back to the ink if
    // that takes more than 40%
    var fill = rgb(v['--accent'] || base), chip = dark ? [52,52,52] : [236,236,236], to = dark ? W : K;
    function ratio(a, b){ var x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
    function reach(need, cap, on, lc){ for (var i = 0; i <= 100; i += 2){ var m = mix(fill, to, i / 100); if (ratio(m, on) >= need && (!lc || Math.abs(apca(m, on)) >= lc)) return i / 100 <= cap ? hex(m) : null; } return null; }
    v['--accent-mark'] = reach(3, 1, chip); v['--accent-fg'] = reach(4.5, .4, mix(chip, fill, .12), 60) || (dark ? '#f2f2f2' : '#111318');""")
patch("""'Orange, the Blueprint default'""", """'Lime, the Blueprint default'""")
# a picked accent in Blueprint dark tints selected rows, chips and icon wells too, as lime does by default
patch("""if (!soft && dark){ v['--accent'] = hex(mix(c, W, .1)); v['--accent-hi'] = hex(mix(c, W, .16)); v['--accent-muted'] = rgba(c, .51); v['--accent-icon-line'] = rgba(c, .17); }""", """if (!soft && dark){ v['--accent'] = hex(mix(c, W, .1)); v['--accent-hi'] = hex(mix(c, W, .16)); v['--accent-muted'] = rgba(c, .51); v['--accent-icon-line'] = rgba(c, .17); v['--accent-bg'] = rgba(c, .12); v['--accent-icon-bg'] = rgba(c, .06); v['--accent-fill'] = hex(mix([18,18,18], c, .08)); }""")
# the accent picker's Default swatch is the style's own default, lime in Blueprint and blue in Soft, as a plain dot; the
# other swatch for that same colour is left out, and Orange, Blueprint's old default, moves to the end of the row
patch(""".acc-sw{position:relative;width:28px;height:28px;flex:none;border-radius:50%;background:var(--sw,#ff850d);""", """.acc-sw{position:relative;width:28px;height:28px;flex:none;border-radius:50%;background:var(--sw,#d4f84a);""")
patch(""".acc-sw[data-v="default"]{background:conic-gradient(#ff850d 0 50%,#116ff8 50% 100%)}
html[data-style="soft"] .acc-sw[data-v="default"]{background:conic-gradient(#116ff8 0 50%,#ff850d 50% 100%)}""", """.acc-sw[data-v="default"]{background:#d4f84a}
html[data-style="soft"] .acc-sw[data-v="default"]{background:#116ff8}
html:not([data-style="soft"]) .acc-sw[data-v="#d4f84a"],html[data-style="soft"] .acc-sw[data-v="#116ff8"]{display:none}""")
patch("""const SW = [['default','Default',null],['#ff850d','Orange'],['#116ff8','Blue'],['#7c5cff','Violet'],['#e8366f','Rose'],['#12a150','Green'],['#0ea5a4','Teal']];""", """const SW = [['default','Default',null],['#d4f84a','Lime'],['#116ff8','Blue'],['#7c5cff','Violet'],['#e8366f','Rose'],['#12a150','Green'],['#0ea5a4','Teal'],['#ff850d','Orange']];""")

# ---------- the GitHub pill: the repository's stars in the header ----------
# It shows the star count when GitHub answers, fetched once a session; until then, or when it doesn't (a private repository
# answers 404), it reads "Star on GitHub". The component pages' header has the same pill (tools/pages/src/layouts/Page.astro)
GH_MARK = '<path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>'
patch("""  <div class="top-actions">
    <div class="seg style-seg" id="style-seg\"""", """  <div class="top-actions">
    <a class="gh-pill" href="https://github.com/bydesignme/designme-dev" aria-label="Star designme.dev on GitHub" data-gh-stars><svg viewBox="0 0 24 24" aria-hidden="true">""" + GH_MARK + """</svg><span class="gh-l">Star on GitHub</span><span class="gh-n" hidden></span></a>
    <div class="seg style-seg" id="style-seg\"""")
patch("""</header>""", """</header>
<script>
// the GitHub pill: the star count once a session, or "Star on GitHub" when GitHub doesn't answer. A failed request is still
// logged by the browser itself; everything else is caught
(function(){
  var pills = document.querySelectorAll('[data-gh-stars]'), KEY = 'dm-gh-stars';
  if (!pills.length) return;
  var fmt = function(n){ return n < 1000 ? String(n) : n < 1e6 ? (Math.floor(n / 100) / 10) + 'k' : (Math.floor(n / 1e5) / 10) + 'm'; };
  var show = function(n){ pills.forEach(function(a){ var c = a.querySelector('.gh-n'); c.textContent = fmt(n); c.hidden = false; a.classList.add('has-n'); a.setAttribute('aria-label', 'Star designme.dev on GitHub, ' + n.toLocaleString('en') + ' stars'); }); };
  var saved = null; try { saved = sessionStorage.getItem(KEY); } catch(e){}
  if (saved !== null){ if (/^\\d+$/.test(saved)) show(+saved); return; }
  if (!window.fetch) return;
  var keep = function(v){ try { sessionStorage.setItem(KEY, v); } catch(e){} };
  fetch('https://api.github.com/repos/bydesignme/designme-dev').then(function(r){ return r.ok ? r.json() : null; }).then(function(d){
    var n = d && typeof d.stargazers_count === 'number' ? d.stargazers_count : null;
    keep(n === null ? '-' : String(n)); if (n !== null) show(n);
  }).catch(function(){ keep('-'); });
})();
</script>""")
CSS += """
/* the GitHub pill, like the header's other 28px controls; on a phone it sits beside the menu button */
body.ui .top .gh-pill{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 11px 0 9px;border:1px solid var(--sh-line);border-radius:999px;background:var(--sh-card);color:var(--sh-text);font-family:var(--sans);font-size:13px;font-weight:500;line-height:1;text-decoration:none;white-space:nowrap;transition:border-color .2s;corner-shape:round}
body.ui .top .gh-pill:hover{border-color:var(--sh-line-2)}
body.ui .top .gh-pill svg{display:block;width:14px;height:14px;flex:none}
body.ui .top .gh-pill .gh-n{font-variant-numeric:tabular-nums}
body.ui .top .gh-pill.has-n .gh-l{display:none}
@media (max-width:960px){ body.ui .top .gh-pill{height:32px;margin-right:8px;padding:0 12px 0 10px} }
/* the sidebar's Docs page: its icon lifts on hover, like the others move */
.side-p[href="/docs/introduction"]:hover .ms svg{transform:translateY(-2px)}
/* each group's list hangs off a thin rail, and the component in view gets a short bright segment on the rail, level with its
   row, over the same light fill as before (--sh-act), as in the docs' sidebar (tools/pages/src/components/SiteShell.astro).
   The list clips what overflows it while it folds, so the rail is drawn inside it rather than as its border, where the
   segment would be cut off */
.side-ul{border-left:0;padding-left:11px;background:linear-gradient(var(--sh-line-2),var(--sh-line-2)) 0 0/1px 100% no-repeat}
.side-ul .side-a{position:relative}
.side-ul .side-a.act::before{content:"";position:absolute;left:-11px;top:7px;bottom:7px;width:2px;border-radius:2px;background:var(--accent-mark)}
"""

# Blueprint stages carry a faint square grid, the one from the artifact card lab, at a fifth of its strength so it is
# only just there
CSS += """
:root:not([data-style="soft"]){--bp-grid:rgba(20,20,12,.018)}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]):not([data-style="soft"]){--bp-grid:rgba(255,255,255,.014)}}
:root[data-theme="dark"]:not([data-style="soft"]){--bp-grid:rgba(255,255,255,.014)}
:root:not([data-style="soft"]) body.ui .lib-sec .stage-inner{background-image:linear-gradient(var(--bp-grid) 1px,transparent 1px),linear-gradient(90deg,var(--bp-grid) 1px,transparent 1px);background-size:24px 24px;background-position:-1px -1px}
"""
# the rich text editor shipped, so the roadmap's own list (used when the live one can't load) says so
patch("""['editor','Rich text editor','A minimal editor with an inline AI menu.','planned','Conversation'],""", """['editor','Rich text editor','A minimal editor with an inline AI menu.','shipped','Conversation'],""")
json.dump({ 'patches': P, 'css': CSS },open(os.path.join(HERE, 'site-patches.json'), 'w'), indent=1)
print(len(P), 'patches')
