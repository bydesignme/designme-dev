TPLS["source-stack"] = "<div class=\"ssx\">\n  <p class=\"msg\">Annual plans convert about 18% better when the monthly price is shown crossed out next to them.</p>\n  <button class=\"ssx-pill\" aria-expanded=\"false\"><span class=\"ssx-ics\"></span><span class=\"ssx-l\">8 sources</span>{chev}</button>\n  <div class=\"fold shut ssx-box\"><div><div class=\"ssx-in\">\n    <div class=\"ssx-fl\"><button class=\"chip sm on\" data-f=\"all\">All</button><button class=\"chip sm\" data-f=\"web\">Web</button><button class=\"chip sm\" data-f=\"file\">Files</button><button class=\"chip sm\" data-f=\"figma\">Figma</button></div>\n    <div class=\"ssx-list\"></div>\n  </div></div></div>\n</div>";
TPLS["citation-hover"] = "<div class=\"chx\">\n  <p class=\"msg chx-p\">Teams that show the annual price first see higher paid conversion<button class=\"chx-c\" data-i=\"0\">1</button>, and the effect is stronger when the monthly price stays visible beside it<button class=\"chx-c\" data-i=\"1\">2</button>. Your own data shows the same pattern since the September update<button class=\"chx-c\" data-i=\"2\">3</button>.</p>\n  <div class=\"chx-card panel keep\" role=\"dialog\" aria-label=\"Source\"><div class=\"chx-in\"></div></div>\n</div>";
TPLS["terminal-stream"] = "<div class=\"tmx panel\" data-reveal=\"flat\">\n  <div class=\"tmx-h\"><span class=\"tmx-ic\">{term}</span><span class=\"tmx-cwd\">~/acme/web</span><span class=\"tmx-st\"><span class=\"g\"><span class=\"spin\"></span></span><span class=\"tmx-sv num\">Starting</span></span><span class=\"sp\"></span><button class=\"pill ghost sm tmx-stop\" aria-label=\"Stop the running command\">{stop}Stop</button><button class=\"ib tmx-cp\" aria-label=\"Copy the output\" data-tip=\"Copy\">{copy}</button></div>\n  <div class=\"tmx-body\" role=\"log\" aria-label=\"Terminal output\" tabindex=\"0\"></div>\n  <div class=\"fold shut tmx-ff\"><div><div class=\"tmx-f\"><span class=\"g\"></span><span class=\"tmx-fs num\"></span></div></div></div>\n</div>";

/* ---------- Source stack ---------- */
DM.def('source-stack', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs'));
  const S = [
    ['web','Baymard: pricing page UX','baymard.com',.92,'B','var(--av-b)'],
    ['web','Annual vs monthly anchoring study','cxl.com',.88,'C','var(--av-r)'],
    ['file','Q3 conversion export.csv','Drive',.84,'CSV','var(--av-m)'],
    ['figma','Pricing v4, frame 2','Figma',.8,'F','var(--av-l)'],
    ['web','Stripe billing docs','stripe.com',.66,'S','var(--av-k)'],
    ['file','Pricing research notes','Notion',.61,'N','var(--av-t)'],
    ['figma','Checkout flow','Figma',.52,'F','var(--av-l)'],
    ['web','NN/g on price framing','nngroup.com',.48,'N','var(--av-y)']
  ];
  // each source's mark on its own vivid fill, with that fill's ink: white, or a dark ink of its hue where white would fail
  const ink = col => col.replace(')', '-ink)');
  const pill = $('.ssx-pill', r), box = $('.ssx-box', r), list = $('.ssx-list', r);
  if (!r.closest('.ahx')) c.offs.push(hoverGlide(list, '.ssx-s'));
  $('.ssx-ics', r).innerHTML = S.slice(0, 4).map(s => `<span style="background:${s[5]};color:${ink(s[5])}">${s[4][0]}</span>`).join('');
  function paint(f){
    const items = S.filter(s => f === 'all' || s[0] === f);
    list.innerHTML = items.map(s => `<div class="ssx-s"><span class="fv" style="background:${s[5]};color:${ink(s[5])}">${s[4]}</span><span class="t"><span>${s[1]}</span><span class="h"> · ${s[2]}</span></span><span class="rel" data-tip="Relevance ${Math.round(s[3] * 100)}%"><i style="width:${s[3] * 100}%"></i></span><button class="ib" aria-label="Open source" data-tip="Open">${I('ext','xs')}</button></div>`).join('');
    stagger($$('.ssx-s', list), 40);
  }
  pill.onclick = () => { const open = box.classList.toggle('shut') === false; pill.setAttribute('aria-expanded', open); if (open) paint($('.ssx-fl .on', r).dataset.f); };
  $$('.ssx-fl .chip', r).forEach(ch => ch.onclick = () => { $$('.ssx-fl .chip', r).forEach(x => x.classList.toggle('on', x === ch)); paint(ch.dataset.f); });
  // the preview opens the sources once on its own, unless you take over first
  c.auto(1100, () => { if (pill.getAttribute('aria-expanded') === 'false') pill.click(); });
});
/* ---------- Terminal stream ---------- */
DM.def('terminal-stream', (r, c) => {
  const IC = { term:I('term'), stop:I('stop','xs'), copy:I('copy') };
  r.innerHTML = r.innerHTML.replace(/\{(\w+)\}/g, (m, k) => IC[k] || m);
  const root = $('.tmx', r), body = $('.tmx-body', r), st = $('.tmx-st', r), sv = $('.tmx-sv', r), stop = $('.tmx-stop', r), cp = $('.tmx-cp', r), ff = $('.tmx-ff', r), foot = $('.tmx-f', r);
  // no room is kept for output still to come (owner, 17 Nov): the terminal grows as lines arrive, up to its 420px, once its
  // entrance has played; then the output scrolls. Installed inside something else, it sizes to its content as it is
  if (r === c.st) Promise.resolve().then(() => Promise.all(root.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && root.isConnected) c.offs.push(grow(root)); });
  // what the agent does: each command with the lines it prints and how long it takes, then the one line where it says what
  // went wrong and the edit that fixes it. [text, tone] marks a line ok (green), bad (red) or mu (grey)
  const F = (n, kb) => 'dist/' + n.padEnd(22) + kb.padStart(6) + ' kB';
  const BUILD = [['> acme-web@2.4.0 build', 'mu'], ['> vite build', 'mu'], 'vite v6.2.1 building for production...', 'transforming...', ['✓ 1284 modules transformed.', 'ok'], 'rendering chunks...', 'computing gzip size...',
    ...[['index.html', '0.46'], ['assets/Home-1c9e.js', '3.12'], ['assets/Pricing-3f9a.js', '12.40'], ['assets/Cart-7b21.js', '9.86'], ['assets/Account-a04d.js', '7.31'], ['assets/Billing-52ce.js', '6.94'],
      ['assets/Bills-e8f3.js', '5.27'], ['assets/Team-0d6a.js', '4.88'], ['assets/Prefs-9a1b.js', '6.02'], ['assets/Docs-44f0.js', '8.15'], ['assets/Search-b7c2.js', '2.96'], ['assets/Modal-61de.js', '1.84'],
      ['assets/Chart-ef09.js', '21.73'], ['assets/Table-3a7e.js', '11.09'], ['assets/Form-c1d4.js', '4.41'], ['assets/Toast-8e2f.js', '1.12'], ['assets/dates-29bb.js', '18.30'], ['assets/vendor-8c1e.js', '98.12'],
      ['assets/index-4f2a.js', '42.31'], ['assets/index-9b7d.css', '18.92']].map(([n, kb]) => F(n, kb)), ['✓ built in 6.1s', 'ok']];
  const S = [
    { cmd:'npm install', ms:1900, out:['added 412 packages in 1.9s', 'found 0 vulnerabilities'] },
    { cmd:'npm run build', ms:6100, out:BUILD },
    { cmd:'npm test', ms:3400, exit:1, out:[['RUN  v3.0.5 ~/acme/web', 'mu'], ['✓ src/lib/cart.test.ts (14 tests)', 'ok'], ['× src/lib/price.test.ts (1 failed)', 'bad'], ['  × formats a yearly price', 'bad'],
      ['    Expected: "$240/yr"', 'ok'], ['    Received: "$240.00/yr"', 'bad'], ['Tests  1 failed | 23 passed (24)', 'bad']] },
    { note:'The test expects whole dollars, but formatPrice always adds cents. Dropping them for round amounts.', ms:1500 },
    { edit:'src/lib/price.ts', add:2, del:1, ms:1500, diff:["- return `$${n.toFixed(2)}/${per}`", '+ const v = Number.isInteger(n) ? String(n) : n.toFixed(2)', '+ return `$${v}/${per}`'] },
    { cmd:'npm test', ms:2900, out:[['✓ src/lib/cart.test.ts (14 tests)', 'ok'], ['✓ src/lib/price.test.ts (10 tests)', 'ok'], ['Tests  24 passed (24)', 'ok']] }
  ];
  // output longer than five lines folds to its last four, behind a button that says how many are hidden
  const TAIL = 4, GAP = 200;
  let vt = 0, halt = false, over = false;
  const log = [], ran = [];
  const clock = ms => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const sec = ms => (ms / 1000).toFixed(1) + ' s';
  // time passes in steps of a quarter second at most, so the clock in the header keeps up; false once Stop is pressed
  const pass = async (ms, each) => {
    for (let t = 0; t < ms;){ if (halt) return false; const d = Math.min(250, ms - t); await c.wait(d); t += d; vt += d; if (!over) sv.textContent = 'Running · ' + clock(vt); each && each(t); }
    return !halt;
  };
  // a command or an edit: its $ (or the edit's pencil) in the marks' column, what it is, and a spinner and its time on the right
  function row(mark, text){
    const el = html(`<div class="tmx-blk" data-s="run"><div class="tmx-cmd">${mark === '$' ? '<code class="tmx-p">$</code>' : `<span class="tmx-p">${mark}</span>`}<code class="tmx-c"></code><span class="tmx-m"><span class="g"><span class="spin"></span></span><span class="t num"></span></span></div></div>`);
    $('.tmx-c', el).textContent = text; body.appendChild(el); enter(el); return el;
  }
  function lines(el){
    const more = html(`<button class="tmx-more" aria-expanded="false" hidden>${I('chev-d','xs')}<span></span><i class="sp"></i></button>`), hid = html('<div class="fold shut"><code class="tmx-o"></code></div>'), tail = html('<code class="tmx-o"></code>');
    const inner = hid.firstElementChild; hid.inert = true; el.append(more, hid, tail);
    const label = () => { const n = inner.children.length, open = !hid.classList.contains('shut'); $('span', more).textContent = open ? 'Show fewer lines' : `Show ${n} more line${n > 1 ? 's' : ''}`; more.setAttribute('aria-expanded', open); };
    more.onclick = () => { hid.inert = hid.classList.toggle('shut'); label(); };
    return ([text, tone]) => {
      const l = document.createElement('span'); l.className = 'tmx-l' + (tone ? ' ' + tone : ''); l.textContent = text; tail.appendChild(l);
      if (inner.children.length + tail.children.length > TAIL + 1) while (tail.children.length > TAIL) inner.appendChild(tail.firstElementChild);
      if (inner.children.length){ more.hidden = false; label(); }
    };
  }
  const halted = el => { $('.tmx-m .g', el).innerHTML = '<span class="tag">Stopped</span>'; el.dataset.s = 'stop'; };
  function finish(how){
    over = true; stop.hidden = true; root.classList.remove('live'); sv.classList.remove('shim');
    st.classList.toggle('ok', how === 'passed'); st.classList.toggle('bad', how === 'failed'); $('.g', st).innerHTML = I(how === 'passed' ? 'check' : 'stop', 'xs'); sv.textContent = how === 'passed' ? 'Passed' : how === 'failed' ? 'Failed' : 'Stopped';
    // each command counts once, however many times it ran; how it went is the header's tag, so the summary doesn't say it
    // again, and a finished line has no clock (owner, 18 Nov)
    const n = new Set(ran).size;
    $('.tmx-fs', foot).textContent = `Ran ${n} command${n === 1 ? '' : 's'}`;
    foot.className = 'tmx-f' + (how === 'stopped' ? ' stop' : how === 'failed' ? ' bad' : ''); $('.g', foot).innerHTML = I(how === 'passed' ? 'ok' : how === 'failed' ? 'alert' : 'stop');
    ff.classList.remove('shut');
  }
  // new output keeps the log on its newest line, unless the person has scrolled up to read; then it stays where they are
  let pinned = true;
  const stick = () => { if (pinned) body.scrollTop = body.scrollHeight; };
  c.on(body, 'scroll', () => { pinned = body.scrollTop + body.clientHeight >= body.scrollHeight - 24; });
  const mo = new MutationObserver(stick); mo.observe(body, { childList:true, subtree:true }); c.offs.push(() => mo.disconnect());
  const ro = new ResizeObserver(stick); ro.observe(body); c.offs.push(() => ro.disconnect());
  stop.onclick = () => { halt = true; };
  cp.onclick = () => copied(cp, log.join('\n'));
  root.classList.add('live'); sv.classList.add('shim');
  c.run(async () => {
    let last = 0;
    for (const k of S){
      if (!await pass(GAP)) return finish('stopped');
      if (k.note){
        const n = html(`<div class="tmx-note">${I('spark','xs')}<span class="shim"></span></div>`), w = $('span', n); w.textContent = k.note; body.appendChild(n); enter(n); log.push('# ' + k.note);
        const ok = await pass(k.ms); w.classList.remove('shim');
        if (!ok) return finish('stopped');
        continue;
      }
      if (k.edit){
        const el = row(I('edit','xs'), 'Edit ' + k.edit); el.dataset.s = 'edit';
        if (!await pass(k.ms)){ halted(el); return finish('stopped'); }
        $('.tmx-m', el).innerHTML = `<span class="add">+${k.add}</span><span class="del">−${k.del}</span>`; log.push(`# Edited ${k.edit} (+${k.add} −${k.del})`);
        const df = document.createElement('code'); df.className = 'tmx-df';
        k.diff.forEach((d, i) => { const l = document.createElement('span'); l.className = d[0] === '+' ? 'a' : d[0] === '-' ? 'd' : ''; l.textContent = d; df.appendChild(l); enter(l, i * 90); });
        el.appendChild(df); log.push(...k.diff);
        continue;
      }
      const el = row('$', k.cmd), t = $('.tmx-m .t', el), add = lines(el), per = k.ms / k.out.length;
      ran.push(k.cmd); log.push('$ ' + k.cmd); t.textContent = sec(0);
      let at = 0;
      for (const ln of k.out){
        const ok = await pass(per, d => { t.textContent = sec(at + d); }); at += per;
        if (!ok){ add(['^C', 'mu']); log.push('^C'); halted(el); return finish('stopped'); }
        const pair = Array.isArray(ln) ? ln : [ln, '']; add(pair); log.push(pair[0]);
      }
      t.textContent = sec(k.ms); last = k.exit || 0;
      $('.tmx-m .g', el).innerHTML = k.exit ? `<span class="tag bad">Exit ${k.exit}</span>` : `<span class="ok">${I('check','xs')}</span>`; el.dataset.s = k.exit ? 'bad' : 'ok';
    }
    finish(last ? 'failed' : 'passed');
  });
  // the preview's story: the agent runs, fails a test, fixes it and passes; then the person copies the whole run
  c.story(async s => {
    await s.until(() => over);
    await s.beat(2);
    await s.tap(cp); await s.beat(3);
  });
});
/* ---------- Citation hover card ---------- */
DM.def('citation-hover', (r, c) => {
  const S = [
    ['B','var(--av-b)','baymard.com','Pricing page UX benchmark','Of 64 SaaS sites tested, those leading with the annual plan saw <mark>a 12 to 20% higher trial to paid rate</mark> than monthly first layouts.','Read 4 days ago'],
    ['C','var(--av-r)','cxl.com','Price anchoring in plan selection','When the monthly price stayed visible with a strike through, <mark>annual selection rose by a further 9 points</mark> in the anchored group.','Read 4 days ago'],
    ['CSV','var(--av-l)','Drive','Q3 conversion export.csv','Rows 412 to 480: <mark>trial to paid moves from 18.6% to 26.3%</mark> between Sep 18 and Oct 17.','Your file']
  ];
  const card = $('.chx-card', r), inn = $('.chx-in', r), box = $('.chx', r), cites = $$('.chx-c', r);
  let cur = null, hideT, showT, back = false;
  /* the card exists only while a citation (or the card itself) is under the pointer */
  function show(b){
    clearTimeout(hideT); if (cur === b) return;
    const s = S[+b.dataset.i]; cur = b;
    cites.forEach(x => x.classList.toggle('on', x === b));
    inn.innerHTML = `<div class="chx-sh"><span class="fv" style="background:${s[1]};color:${s[1].replace(')', '-ink)')}">${s[0][0]}</span><span>${s[2]}</span></div><div class="chx-t">${s[3]}</div><div class="chx-q">${s[4]}</div><div class="chx-f"><span>${s[5]}</span><a href="#" onclick="return false">Open source ${I('ext','xs')}</a></div>`;
    /* restart the entry each time, so it always grows in place and never slides sideways. It opens below its citation when
       it fits there and above it when it doesn't (placePop), so the stage or the page never cuts it off, and it stays inside
       the answer's column */
    card.classList.remove('show'); void card.offsetWidth;
    placePop(b, card);
    card.style.left = Math.max(0, Math.min(parseFloat(card.style.left) || 0, box.clientWidth - card.offsetWidth)) + 'px';
    card.classList.add('show');
  }
  function hide(now){
    clearTimeout(hideT); clearTimeout(showT);
    const go = () => { card.classList.remove('show'); cur = null; cites.forEach(x => x.classList.remove('on')); };
    if (now) go(); else hideT = setTimeout(go, 140);
  }
  /* pointing at a citation shows its card, leaving it (and the card) hides it; focus shows it too, so the keyboard gets the
     same card. Touch has no hover: a tap shows the card, the next tap anywhere else hides it */
  const hover = e => e.pointerType !== 'touch';
  cites.forEach(b => {
    c.on(b, 'pointerenter', e => { if (!hover(e)) return; clearTimeout(showT); clearTimeout(hideT); showT = setTimeout(() => show(b), cur ? 0 : 90); });
    c.on(b, 'pointerleave', e => { if (!hover(e)) return; clearTimeout(showT); hide(); });
    c.on(b, 'focus', () => { if (back){ back = false; return; } show(b); }); c.on(b, 'blur', e => { if (!card.contains(e.relatedTarget)) hide(); });
    // Enter or Space opens the card with the focus on its link, so the keyboard can reach it; Escape brings the focus back
    c.on(b, 'click', e => { if (cur !== b) show(b); if (e.isTrusted && !e.detail){ const a = $('a', card); if (a) a.focus({ preventScroll:true }); } });
  });
  c.on(card, 'pointerenter', () => clearTimeout(hideT));
  c.on(card, 'pointerleave', e => { if (hover(e)) hide(); });
  c.on(card, 'focusout', e => { if (cur && !card.contains(e.relatedTarget) && e.relatedTarget !== cur) hide(); });
  /* Escape puts the card away while the focus or the pointer is on the answer, and leaves the focus where it was, or on its
     citation when it was in the card */
  c.on(document, 'keydown', e => { if (e.key === 'Escape' && cur && (box.contains(document.activeElement) || box.matches(':hover'))){ e.preventDefault(); const to = card.contains(document.activeElement) && cur; hide(true); if (to){ back = true; to.focus({ preventScroll:true }); } } });
  c.on(document, 'pointerdown', e => { if (!card.contains(e.target) && !e.target.closest('.chx-c')) hide(true); });
  c.on(window, 'resize', e => { if (e.isTrusted) hide(true); });
  c.offs.push(() => { clearTimeout(hideT); clearTimeout(showT); });
  // the preview shows one card on its own after the entrance, then puts it away, unless you are already pointing at a citation
  let mine = false; c.on(r, 'pointerover', e => { if (e.isTrusted) mine = true; }, true);
  c.run(async () => { await c.wait(1400); if (mine || cur) return; show(cites[0]); await c.wait(2800); if (!mine && cur === cites[0]) hide(); });
});