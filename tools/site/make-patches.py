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
      """<p>81 free components in HTML or React, designed and built by <a href="https://designme.agency" target="_blank" rel="noopener">DesignMe</a>.</p>
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
    document.addEventListener('click', e => { const a = e.target.closest('a[href^="#"],[data-id]'); if (a) follow(a.dataset.id ? document.getElementById(a.dataset.id) : target(a.getAttribute('href'))); }, true);
    addEventListener('hashchange', () => follow(target(location.hash)));
    addEventListener('popstate', () => follow(target(location.hash)));
    follow(target(location.hash));
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
  <nav class="side-pages" aria-label="Site"><a class="side-p act" href="#components" aria-current="page"><span class="ms">dashboard</span>Library</a><a class="side-p" href="#/changelog"><span class="ms">history</span>Changelog</a><a class="side-p" href="#/roadmap"><span class="ms">trending_up</span>Roadmap</a><a class="side-p" href="#faq"><span class="ms">help</span>FAQ</a></nav>""")

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
"""
json.dump({ 'patches': P, 'css': CSS }, open(os.path.join(HERE, 'site-patches.json'), 'w'), indent=1)
print(len(P), 'patches')
