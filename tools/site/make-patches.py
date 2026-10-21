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
    function show(t){""", """    const textFor = t => !CODE && !t.startsWith('rx-') ? 'Loading the code…' : t === 'shared' ?'/* Shared core: tokens and base styles */\\n' + CODE._shared.css + '\\n\\n/* Shared core: icons, sound and helpers */\\n' + CODE._shared.js : t.startsWith('rx-') ? rxText(rx, t) : CODE[id][t];
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
      """    const textFor = t => !CODE && !t.startsWith('rx-') ? 'Loading the code…' : t === 'shared' ? '/* Shared core: tokens and base styles */\\n' + CODE._shared.css + '\\n\\n/* Shared core: icons, sound and helpers */\\n' + CODE._shared.js : t.startsWith('rx-') ? rxText(rx, t) : CODE[cur.id][t];""")
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

# ---------- the intro: the real count, and React ----------
RX_CMD = 'npx designme add live-answer --react'
patch("""<p>46 components for showing an agent's work, from status and conversation to review, sources and workspace, plus 32 app basics for the dashboard around it, designed and built by the <a href="https://designme.agency" target="_blank" rel="noopener">DesignMe</a> team.</p>""",
      """<p>47 components for showing an agent's work, from conversation and status to review, sources and workspace, plus 32 app basics for the dashboard around it. All 79 come in HTML or React, designed and built by the <a href="https://designme.agency" target="_blank" rel="noopener">DesignMe</a> team.</p>
  <div class="intro-get"><button class="cdm-cmd intro-cmd" data-cmd=\"""" + RX_CMD + """\" title="Copy install command"><span class="d">$</span><span class="c">""" + RX_CMD + """</span><span class="ms sm">content_copy</span></button><a class="intro-rx" href="/packages/react/preview/">See all 79 in React<span class="ms sm">arrow_forward</span></a></div>""")
patch("""<span class="k">46 components</span><h2>Agent components</h2>""", """<span class="k">47 components</span><h2>Agent components</h2>""")
# the phone menu's search counted one card too few
patch("""placeholder="Search ${$$('main .comp').length - 1} components\"""", """placeholder="Search ${$$('main .comp').length} components\"""")
patch("""from status pills and reasoning trails to tool calls and run summaries, plus app basics for the dashboard around them, in two styles with light and dark mode.""",
      """from status pills and reasoning trails to tool calls and run summaries, plus app basics for the dashboard around them, in HTML or React, in two styles with light and dark mode.""")
patch("""<meta property="og:description" content="Free UI components for AI agent products, in two styles with light and dark mode.""",
      """<meta property="og:description" content="Free UI components for AI agent products, in HTML or React, in two styles with light and dark mode.""")

CSS = """
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
/* intro: the React install command and the React preview */
.intro-get{display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px;margin-top:18px}
.intro-get .intro-cmd{margin-top:0;min-width:0;background:var(--sh-card)}
.intro-cmd .c{color:var(--sh-text)}
.intro-rx{display:inline-flex;align-items:center;gap:4px;font-size:13.5px;font-weight:500;color:var(--sh-text);text-decoration:none;border-bottom:1px solid var(--sh-line-2);transition:border-color .2s}
.intro-rx:hover{border-color:var(--sh-text)}
.intro-rx .ms{color:var(--sh-muted)}
/* phones: the header is one 40px row from the first paint, before the script moves its controls into the menu, and the
   sidebar, which sits below the components, waits for the end of the page so it can't flash at the top while it loads */
@media (max-width:960px){
  body.ui .top .top-actions{min-height:40px}
  .top-actions #style-seg,.top-actions #theme-btn,.top-actions #sound-btn{display:none}
  body:not(:has(> #v2-js)) .side{display:none}
}
"""
json.dump({ 'patches': P, 'css': CSS }, open(os.path.join(HERE, 'site-patches.json'), 'w'), indent=1)
print(len(P), 'patches')
