TPLS["thinking-states"] = "<div class=\"ths-dm dm\"><div class=\"dm-main\">\n  <div class=\"ths mx-ic\" data-v=\"orbit\">\n    <div class=\"ths-row\">\n      <span class=\"ths-mk\" aria-hidden=\"true\"></span>\n      <span class=\"ths-w\"><span class=\"ths-l\" aria-hidden=\"true\"><span class=\"ths-tx shim\">Thinking</span><span class=\"ths-car\" hidden></span></span>\n      <span class=\"ths-t num\" aria-hidden=\"true\">0s</span></span>\n    </div>\n    <span class=\"ths-sr\" role=\"status\" aria-live=\"polite\">Thinking</span>\n  </div>\n  </div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Thinking state\"><button aria-pressed=\"true\" data-v=\"orbit\">Orbit</button><button aria-pressed=\"false\" data-v=\"morph\">Morph</button><button aria-pressed=\"false\" data-v=\"scan\">Scan</button><button aria-pressed=\"false\" data-v=\"stream\">Stream</button><button aria-pressed=\"false\" data-v=\"matrix\">Matrix</button><button aria-pressed=\"false\" data-v=\"stack\">Stack</button></div></div>\n</div>";
TPLS["step-loader"] = "<div class=\"stl dm mx-ic\"><div class=\"dm-main\">\n  <button class=\"stl-row mx-press\" aria-expanded=\"false\">\n    <span class=\"stl-g\"></span>\n    <span class=\"stl-t\"><span class=\"stl-lab shim\">Reading Figma frames</span></span>\n    <span class=\"stl-n num\">1/4</span>\n    <svg class=\"i xs stl-chev\"><use href=\"#v2i-chev-d\"/></svg>\n  </button>\n  <div class=\"stl-track\"><i></i><i></i><i></i><i></i></div>\n  <div class=\"fold shut stl-fold\"><div><ol class=\"stl-list mx-rows\"></ol></div></div>\n  </div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Loader\"><button aria-pressed=\"true\" data-v=\"radar\">Radar</button><button aria-pressed=\"false\" data-v=\"think\">Dots</button><button aria-pressed=\"false\" data-v=\"spin\">Ring</button><button aria-pressed=\"false\" data-v=\"bars\">Bars</button></div></div>\n</div>";
TPLS["status-pill"] = "<div class=\"spl dm\">\n  <div class=\"spl-stage dm-main\">\n    <div class=\"spl-pill\" aria-live=\"polite\"><div class=\"spl-in\"></div></div>\n  </div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Variant\"><button aria-pressed=\"true\" data-v=\"pill\">Pill</button><button aria-pressed=\"false\" data-v=\"bar\">Bar</button></div></div>\n</div>";
TPLS["toast"] = "<div class=\"tst dm\">\n  <div class=\"dm-main\"><div class=\"tst-slot\">\n    <button type=\"button\" class=\"pill line sm tst-make\"><svg class=\"i s\"><use href=\"#v2i-spark\"/></svg><span>Make slides</span></button>\n    <div class=\"tst-t\" hidden>\n      <div class=\"tst-hd\">\n        <span class=\"tst-dk idle\" aria-hidden=\"true\"><svg viewBox=\"0 0 64 40\"></svg></span>\n        <div class=\"tst-tx\"><span class=\"tst-ti\"></span><span class=\"tst-de\"></span></div>\n        <div class=\"tst-hb\">\n          <button type=\"button\" class=\"ib tst-more\" aria-expanded=\"false\" aria-label=\"Show the steps\" data-tip=\"Steps\"><svg class=\"i s\"><use href=\"#v2i-chev-d\"/></svg></button>\n          <button type=\"button\" class=\"ib tst-stop\" aria-label=\"Stop the job\" data-tip=\"Stop\"><svg class=\"i s\"><use href=\"#v2i-stop\"/></svg></button>\n          <button type=\"button\" class=\"ib tst-x\" aria-label=\"Close\" data-tip=\"Close\" hidden><svg class=\"tst-ring\" viewBox=\"0 0 28 28\" aria-hidden=\"true\" hidden><rect class=\"tst-tk\" x=\".75\" y=\".75\" width=\"26.5\" height=\"26.5\"/><rect class=\"tst-rn\" x=\".75\" y=\".75\" width=\"26.5\" height=\"26.5\" pathLength=\"100\"/></svg><svg class=\"i s\"><use href=\"#v2i-x\"/></svg></button>\n        </div>\n      </div>\n      <div class=\"fold shut tst-mf\"><div><ol class=\"tst-st\" aria-label=\"Steps\"></ol></div></div>\n      <div class=\"fold shut tst-ft\"><div><div class=\"tst-fi\"></div></div></div>\n    </div>\n    <div class=\"tst-sr\" role=\"status\" aria-live=\"polite\"></div>\n    <div class=\"tst-sr\" role=\"alert\" aria-live=\"assertive\"></div>\n  </div></div>\n</div>";
TPLS["toast-stack"] = "<div class=\"tsk dm\">\n  <div class=\"dm-main\"><div class=\"tsk-stack\" role=\"region\" aria-label=\"Notifications\"></div>\n    <div class=\"tst-sr\" role=\"status\" aria-live=\"polite\"></div>\n    <div class=\"tst-sr\" role=\"alert\" aria-live=\"assertive\"></div>\n  </div>\n  <div class=\"demo\"><button type=\"button\" class=\"pill line sm tsk-add\"><svg class=\"i s\"><use href=\"#v2i-bell\"/></svg>Send notification</button></div>\n</div>";
TPLS["context-meter"] = "<div class=\"ctm\" data-open=\"1\" data-pos=\"up\">\n  <button class=\"ctm-tg\" aria-expanded=\"true\" aria-label=\"Context\"><span class=\"ctm-ring\" aria-hidden=\"true\"><svg viewBox=\"0 0 20 20\"><circle class=\"tr\" cx=\"10\" cy=\"10\" r=\"7.5\"/><circle class=\"fl\" cx=\"10\" cy=\"10\" r=\"7.5\" pathLength=\"100\"/><circle class=\"fw\" cx=\"10\" cy=\"10\" r=\"7.5\" pathLength=\"100\"/><circle class=\"hl\" cx=\"10\" cy=\"10\" r=\"7.5\" pathLength=\"100\"/></svg></span><span><span class=\"ctm-pc num\">0%</span> of context used</span>{chev}</button>\n  <div class=\"ctm-pop panel\" role=\"region\" aria-label=\"What fills the context\">\n    <div class=\"ctm-ph\"><span>In context</span><span class=\"num\"><b class=\"ctm-tot\">0k</b> of 200k tokens</span></div>\n    <div class=\"ctm-bar\" aria-hidden=\"true\"></div>\n    <div class=\"ctm-leg mx-glide\"></div>\n    <div class=\"ctm-msg\" aria-live=\"polite\"><span></span></div>\n    <div class=\"ctm-f\"><span class=\"ctm-hint\">Summarises older turns</span><button class=\"pill line sm ctm-go mx-press\">Compact</button></div>\n  </div>\n</div>";
TPLS["agent-run-timeline"] = "<div class=\"art panel\">\n  <div class=\"art-h\"><span class=\"art-hi\" aria-hidden=\"true\"></span><div class=\"art-hd\"><div class=\"art-t\">Run 4821, update the pricing page</div><div class=\"art-s muted num\">Starting</div></div><span class=\"art-tag tag\"><span class=\"spin\" aria-hidden=\"true\"></span>Running</span></div>\n  <div class=\"art-key num\" role=\"list\" aria-label=\"Time by kind of step\"></div>\n  <div class=\"art-grid\">\n    <div class=\"art-axis\" aria-hidden=\"true\"><span></span><div class=\"art-ticks\"></div><span></span></div>\n    <div class=\"art-past\" aria-hidden=\"true\"></div>\n    <div class=\"art-rows\"></div>\n    <div class=\"art-head\" aria-hidden=\"true\"><i></i><span class=\"art-now num\">0.0s</span></div>\n  </div>\n  <div class=\"art-f muted num\"></div>\n</div>";
TPLS["web-search"] = "<div class=\"wsx panel mx-grow mx-ic\">\n  <button class=\"wsx-h mx-press\" aria-expanded=\"true\"><span class=\"wsx-ic\"><span class=\"spin\"></span></span><span class=\"wsx-st shim\">Searching the web</span><span class=\"wsx-marks\" aria-hidden=\"true\"></span>{chev}</button>\n  <div class=\"fold wsx-fold\"><div><div class=\"wsx-list\"></div></div></div>\n  <div class=\"wsx-ans\"></div>\n  <p class=\"wsx-sr\" role=\"status\"></p>\n</div>";
TPLS["reasoning-trail"] = "<div class=\"rtr-dm dm\"><div class=\"dm-main\"><div class=\"rtr panel mx-grow\">\n  <button class=\"rtr-h mx-press\" aria-expanded=\"true\">\n    <span class=\"think on rtr-mark\"><i></i><i></i><i></i><i></i></span>\n    <span class=\"rtr-title shim\">Reasoning</span><span class=\"rtr-time num muted\">0s</span>\n    <svg class=\"i xs rtr-chev\"><use href=\"#v2i-chev-d\"/></svg>\n  </button>\n  <div class=\"fold rtr-fold\"><div>\n    <div class=\"rtr-body\"></div>\n    <div class=\"fold rtr-ff shut\"><div><p class=\"rtr-f\"><span class=\"rtr-fk\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"m5 12.5 4.5 4.5L19 7.5\"/></svg></span><span class=\"rtr-fd\"></span><span class=\"rtr-fs\"></span></p></div></div>\n  </div></div>\n</div></div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"View\"><button aria-pressed=\"true\" data-v=\"plan\">Plan</button><button aria-pressed=\"false\" data-v=\"notes\">Notes</button><button aria-pressed=\"false\" data-v=\"sources\">Sources</button><button aria-pressed=\"false\" data-v=\"edits\">Edits</button></div></div>\n</div>";
TPLS["thinking"] = "<div class=\"tk mx-grow mx-ic\" data-open=\"1\">\n  <button class=\"tk-h\" aria-expanded=\"true\">\n    <span class=\"tk-mark\"><span class=\"think on\"><i></i><i></i><i></i><i></i></span></span>\n    <span class=\"tk-title shim\">Checking the pricing page</span><span class=\"tk-time num\">0s</span>\n    <svg class=\"i xs tk-chev\"><use href=\"#v2i-chev-d\"/></svg>\n  </button>\n  <div class=\"fold tk-fold\"><div><ol class=\"tk-list\" aria-live=\"polite\"></ol></div></div>\n</div>";
/* ---------- Status pill ---------- */
DM.def('status-pill', (r, c) => {
  const pill = $('.spl-pill', r), box = $('.spl-in', r), root = $('.spl', r);
  pill.insertAdjacentHTML('beforeend', '<div class="spl-track"><div class="spl-fill"></div></div>');
  const fill = $('.spl-fill', r);
  // the switch morphs in three beats, so the words and the shape never move at once: the line fades out with its track,
  // the pill changes shape while it's empty, then the new layout fades in with the track under it
  let morph = 0;
  seg($('.seg2', r), v => {
    const bar = v === 'bar', id = ++morph; if (root.classList.contains('bar') === bar) return;
    pill.style.width = pill.offsetWidth + 'px'; box.classList.add('out'); root.classList.add('mo');
    c.later(REDUCE ? 0 : 170, () => { if (id !== morph) return; root.classList.toggle('bar', bar); fit(); });
    c.later(REDUCE ? 0 : 430, () => { if (id !== morph) return; morph = 0; box.classList.remove('out'); root.classList.remove('mo'); });
  });
  /* both variants hug their content; the bar keeps a little extra room for its track. Neither is ever wider than the room
     it has (a phone): its words give way with an ellipsis */
  function fit(){
    box.style.width = 'max-content'; const w = box.scrollWidth; box.style.width = '';
    pill.style.width = Math.min(root.classList.contains('bar') ? Math.max(w + 24, 300) : w, pill.parentElement.clientWidth || Infinity) + 'px';
  }
  function set(htmlStr, pct){
    pill.style.width = pill.offsetWidth + 'px';
    box.classList.add('out');
    // mid-switch, the morph brings the line back once the shape has settled
    c.later(180, () => { box.innerHTML = htmlStr; if (!morph) box.classList.remove('out'); fit(); });
    if (pct !== undefined) fill.style.width = pct + '%';
  }
  const think = '<span class="think on"><i></i><i></i><i></i><i></i></span>';
  box.innerHTML = '<span class="g"><span class="dot" style="color:var(--faint)"></span></span><span class="fg2">Ready for a task</span><span class="end"></span>';
  requestAnimationFrame(fit);
  // and it fits again when its room changes
  if (window.ResizeObserver){ let rw = 0; const ro = new ResizeObserver(([e]) => { const w = Math.round(e.contentRect.width); if (w !== rw){ rw = w; fit(); } }); ro.observe(pill.parentElement); c.offs.push(() => ro.disconnect()); }
  const idle = '<span class="g"><span class="dot" style="color:var(--faint)"></span></span><span class="fg2">Ready for a task</span><span class="end"></span>';
  c.run(async () => { for (;;){
    await c.wait(1100);
    set(`<span class="g" style="color:var(--fg)">${think}</span><span class="shim">Thinking</span><span class="end"></span>`, 8); await c.wait(1800);
    set(`<span class="g" style="color:var(--fg)"><span class="radar"></span></span><span class="shim">Reading Figma frames</span><span class="m n">1 of 4</span><span class="end"></span>`, 22);
    await c.wait(400);
    // the count ticks over in place, under a steady line
    for (let i = 2; i <= 4; i++){ await c.wait(650); const n = $('.n', box); if (n) n.textContent = i + ' of 4'; fill.style.width = (22 + i * 8) + '%'; }
    await c.wait(700);
    set(`<span class="g" style="color:var(--fg)"><span class="spin"></span></span><span class="shim">Editing</span><span class="fchip" style="height:24px"><span class="ft re">TSX</span>PricingCard.tsx</span><span class="end"></span>`, 64); await c.wait(2000);
    set(`<span class="g" style="color:var(--warn-mark)"><span class="dot"></span></span><span>Waiting for your approval</span><button class="pill primary sm">Review</button>`, 72);
    /* waits for Review, and carries on by itself after a while so the loop never stalls; once you have taken over, it waits for you */
    await new Promise(res => { c.later(220, () => { const b = $('.pill', box); if (b) b.onclick = res; }); c.auto(8000, res); });
    set(`<span class="g" style="color:var(--fg)"><span class="spin"></span></span><span class="shim">Applying 4 changes</span><span class="end"></span>`, 88); await c.wait(1600);
    // done is a neutral line with the green tick (the mark green), and no elapsed time (owner, 18 Nov)
    set(`<span class="g" style="color:var(--ok-mark)">${I('ok')}</span><span>Done</span><span class="m">4 files changed</span><span class="end"></span>`, 100);
    await c.wait(3200); set(idle, 0);
  } });
});
/* ---------- Step loader ---------- */
DM.def('step-loader', (r, c) => {
  // the chevron comes from I(), so it points at the icons wherever the component is mounted (designme.dev's own icon ids)
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d', 'xs stl-chev'));
  const steps = [['Reading Figma frames','Read 4 frames'],['Matching tokens','Matched 18 tokens'],['Writing components','Wrote 3 components'],['Checking contrast','Contrast passes']];
  const row = $('.stl-row', r), lab = $('.stl-lab', r), n = $('.stl-n', r), g = $('.stl-g', r), bars = $$('.stl-track i', r), list = $('.stl-list', r), fold = $('.stl-fold', r);
  let kind = 'radar', cur = 0, done = false;
  const glyph = () => kind === 'radar' ? '<span class="radar"></span>' : kind === 'think' ? '<span class="think on"><i></i><i></i><i></i><i></i></span>' : kind === 'spin' ? '<span class="spin"></span>' : '<span class="bars3"><i></i><i></i><i></i></span>';
  // the rows stay and change in place: a mark that changes (the loader, the tick, the dot) crossfades (iconSwap()), and one
  // that stays keeps playing where it is
  const MARK = { ok:() => `<span class="stl-ok">${I('ok')}</span>`, check:() => `<span class="stl-ok">${I('check','xs')}</span>`, dot:() => '<span class="dot" style="color:var(--faint)"></span>' };
  const mark = (el, k) => { if (el.dataset.k === k) return; const first = !el.dataset.k; el.dataset.k = k; const put = () => { el.innerHTML = (MARK[k] || glyph)(); }; first ? put() : iconSwap(el, put); };
  list.innerHTML = steps.map(() => '<li><span class="g"></span> </li>').join('');
  const paint = () => {
    mark(g, done ? 'ok' : kind);
    [...list.children].forEach((li, i) => { const fin = i < cur || done;
      li.className = fin ? 'done' : i === cur ? 'run' : ''; mark(li.firstElementChild, fin ? 'check' : i === cur ? kind : 'dot'); li.lastChild.nodeValue = fin ? steps[i][1] : steps[i][0]; });
  };
  seg($('.seg2', r), v => { kind = v; paint(); });
  // the list's rows settle one after another as it opens (.mx-rows)
  row.onclick = () => { const o = fold.classList.toggle('shut'); row.setAttribute('aria-expanded', !o); list.classList.toggle('mx-play', !o); };
  paint();
  c.run(async () => {
    for (;;){
      for (cur = 0; cur < steps.length; cur++){
        bars[cur].classList.add('run'); paint();
        swap(lab, steps[cur][0]); swap(n, (cur + 1) + '/4');
        await c.wait(1900);
        bars[cur].classList.remove('run'); bars[cur].classList.add('on');
      }
      done = true; lab.classList.remove('shim'); swap(lab, 'Ready for review'); swap(n, '4/4'); paint();
      /* hold the finished state, then run the steps again */
      await c.wait(3200);
      // the pill says what runs again as the track empties, never "Ready for review" over an empty track
      done = false; cur = 0; bars.forEach(b => b.classList.remove('on', 'run')); lab.classList.add('shim'); swap(lab, steps[0][0]); swap(n, '1/4'); paint();
      await c.wait(700);
    }
  });
});
/* ---------- Thinking states ---------- */
DM.def('thinking-states', (r, c) => {
  const steps = ['Thinking', 'Reading 3 files', 'Searching the docs', 'Comparing 2 options', 'Drafting the answer'];
  const box = $('.ths', r), mk = $('.ths-mk', r), tx = $('.ths-tx', r), car = $('.ths-car', r), time = $('.ths-t', r), sr = $('.ths-sr', r);
  // Orbit, Morph, Scan and Stream as a grid of dots, each at its own density: which part each dot plays, and when
  const grid = k => {
    const n = { orbit:5, scan:6, morph:7, stream:4 }[k], rows = k === 'stream' ? 3 : n, at = (x, y) => y * n + x;
    const cls = Array(n * rows).fill(''), dly = Array(n * rows).fill(null), pose = new Set();
    const run = (order, dur) => order.forEach((c, i) => { dly[c] = ((i / order.length) - 1) * dur; });
    if (k === 'orbit'){
      const ring = [];
      for (let x = 0; x < n; x++) ring.push(at(x, 0));
      for (let y = 1; y < n; y++) ring.push(at(n - 1, y));
      for (let x = n - 2; x >= 0; x--) ring.push(at(x, n - 1));
      for (let y = n - 2; y > 0; y--) ring.push(at(0, y));
      ring.forEach(c => { cls[c] = 'r'; }); run(ring, 1.6); cls[at(2, 2)] = 'c';
      [0, ring.length - 1, ring.length - 2].forEach(i => pose.add(ring[i]));
    } else if (k === 'scan'){
      const len = [6, 0, 5, 0, 3, 0];
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++){ const c = at(x, y); cls[c] = x < len[y] ? 'l' : 'b'; dly[c] = (x / n - 1) * 1.6; if (x === 2) pose.add(c); }
    } else if (k === 'morph'){
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++){
        const rect = y >= 1 && y <= 5, circ = (x - 3) ** 2 + (y - 3) ** 2 <= 10, tri = Math.abs(x - 3) <= y / 2;
        const c = at(x, y); cls[c] = 'm' + ((rect ? 1 : 0) | (circ ? 2 : 0) | (tri ? 4 : 0)); if (circ) pose.add(c);
        dly[c] = -(((c * 37 + 11) % 17) / 17) * .32;
      }
    } else {
      for (let y = 0; y < rows; y++) for (let x = 0; x < n; x++){ const c = at(x, y); cls[c] = 's' + c; if (y < 2) pose.add(c); }
    }
    return `<span class="ths-dg" data-k="${k}">` + cls.map((x, c) => `<i class="${x}${pose.has(c) ? ' p' : ''}"${dly[c] != null ? ` style="animation-delay:${dly[c].toFixed(3)}s"` : ''}></i>`).join('') + '</span>';
  };
  // the mark each state draws on its tile
  const MARKS = {
    orbit:grid('orbit'),
    morph:grid('morph'),
    scan:grid('scan'),
    stream:grid('stream'),
    matrix:'<span class="ths-mtx">' + '<i></i>'.repeat(16) + '</span>',
    stack:'<span class="ths-stk"><i></i><i></i><i></i></span>'
  };
  let v = box.dataset.v || 'orbit', at = 0, secs = 0, typed = 0;
  // the agent's own pace: these waits are not shortened under reduced motion, so the line still changes every few seconds
  const pause = ms => new Promise(res => c.later(ms, res));
  // Stream types the line out behind its caret; the others crossfade it. Every state's line sweeps (.shim). A newer line cancels the typing
  const type = async t => {
    const k = ++typed; if (tx._sw){ clearTimeout(tx._sw.t); tx._sw = null; } tx.classList.remove('out'); tx.textContent = '';
    for (let i = 1; i <= t.length; i++){ await pause(32); if (k !== typed) return; tx.textContent = t.slice(0, i); }
  };
  const show = (t, fresh) => {
    car.hidden = v !== 'stream';
    if (v === 'stream' && fresh && !REDUCE) type(t);
    else { typed++; if (fresh) swap(tx, t); else { if (tx._sw){ clearTimeout(tx._sw.t); tx._sw = null; } tx.classList.remove('out'); tx.textContent = t; } }
    // a screen reader hears each new step once, never the letters as they type
    if (fresh) sr.textContent = t;
  };
  // (a new state's mark crossfades in for the last one, iconSwap())
  const pick = x => { v = x; box.dataset.v = x; if (mk.firstChild) iconSwap(mk, () => { mk.innerHTML = MARKS[x]; }); else mk.innerHTML = MARKS[x]; show(steps[at], false); };
  seg($('.seg2', r), pick);
  pick(v);
  c.every(1000, () => { secs++; time.textContent = secs + 's'; });
  let first = true;
  c.run(async () => {
    for (;;){
      for (at = 0; at < steps.length; at++){ show(steps[at], !first); first = false; await pause(2600); }
      // a fresh question: the clock starts again
      at = 0; secs = 0; time.textContent = '0s';
    }
  });
});
/* ---------- Reasoning trail ---------- */
DM.def('reasoning-trail', (r, c) => {
  const body = $('.rtr-body', r), head = $('.rtr-h', r), fold = $('.rtr-fold', r), title = $('.rtr-title', r), time = $('.rtr-time', r), mark = $('.rtr-mark', r);
  const rtr = $('.rtr', r), main = rtr.closest('.dm-main');
  let tab = 'plan', secs = 0, just = -1;
  const plan = [['Open the onboarding file','4 frames'],['Compare it with the design system','12 components'],['Find spacing that breaks the 8px grid','3 frames'],['Draft fixes for review','Ready']];
  const NOTES = ['The hero card uses 20px padding, every other card uses 24px.','Mobile frames already follow the grid, desktop drifted.','Two buttons use a hard-coded grey instead of a token.'];
  // each source's chip, and its tip while the agent reads it, once it has read it, and (Card.tsx) once it has edited it
  const SRC = [
    { k:'fig', mark:I('figma','xs'), label:'Onboarding.fig', reading:'Reading the frames in Figma', read:'Figma, 4 frames read' },
    { k:'ts', mark:'<span class="ft">TS</span>', label:'tokens.ts', reading:'Reading src/styles/tokens.ts', read:'src/styles/tokens.ts, 212 lines' },
    { k:'tsx', mark:'<span class="ft re">TSX</span>', label:'Card.tsx', reading:'Reading src/components/Card.tsx', read:'src/components/Card.tsx', edited:'src/components/Card.tsx, 2 edits' },
    { k:'web', mark:I('globe','xs'), label:'Spacing guide', reading:'Reading designme.dev/guide/spacing', read:'designme.dev/guide/spacing' }
  ];
  const EDITS = [
    `<div class="rtr-li" data-key="e0"><span class="g">${I('edit','xs')}</span><span>Card.tsx<span class="d">2 lines</span></span></div><div class="rtr-edit" data-key="e0d"><div class="x">padding: 20px;</div><div class="a">padding: var(--space-6);</div></div>`,
    `<div class="rtr-li" data-key="e1"><span class="g">${I('edit','xs')}</span><span>Button.tsx<span class="d">1 line</span></span></div><div class="rtr-edit" data-key="e1d"><div class="x">color: #8a8a8a;</div><div class="a">color: var(--text-dim);</div></div>`
  ];
  // where the run is: the plan steps done, the notes found (by their place in NOTES), each source's state (unread,
  // 'reading', 'read' or 'edited') and the edits drafted. Every view shows only what the run has made by then; END is
  // the finished trail
  const now = { done:0, end:false, notes:[], src:['reading'], edits:0 };
  const END = { done:plan.length, end:true, notes:[0, 1, 2], src:['read', 'read', 'edited', 'read'], edits:2 };
  // a view with nothing in it yet says so, on the row the first one will take
  const none = what => `<div class="rtr-li" data-key="none"><span class="g"><span class="dot" style="color:var(--faint)"></span></span><span class="muted">No ${what} yet</span></div>`;
  // each step carries Clean's own mark (.rtr-m) beside Soft's glyph; the style shows one of them. The step that has just
  // finished (just) and the one it hands on to play Clean's tick and rail once
  const tick = '<svg viewBox="0 0 24 24"><path pathLength="1" d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  const views = {
    plan: S => plan.map((p, i) => { const s = i < S.done ? 'done' : i === S.done && !S.end ? 'now' : 'next';
      return `<div class="rtr-li ${s === 'now' ? 'now' : ''}${i === just ? ' just' : ''}${i === just + 1 && s === 'now' ? ' next-in' : ''}" data-s="${s}"><span class="g">${i < S.done ? `<span style="color:var(--ok)">${I('check','xs')}</span>` : i === S.done && !S.end ? '<span class="pulse"></span>' : '<span class="dot" style="color:var(--faint)"></span>'}<span class="rtr-m" aria-hidden="true">${s === 'done' ? tick : ''}</span></span><span>${p[0]}<span class="d">${i < S.done ? p[1] : i === S.done && !S.end ? 'Working' : 'Next'}</span></span></div>`; }).join(''),
    notes: S => S.notes.length ? NOTES.map((t, i) => S.notes.includes(i) ? `<div class="rtr-li" data-key="n${i}"><span class="g"><span class="dot" style="color:var(--faint)"></span></span><span>${t}</span></div>` : '').join('') : none('notes'),
    // a source the agent is still reading shimmers, as the header does while it thinks
    sources: S => S.src.some(Boolean) ? `<div class="rtr-src" data-key="src">${SRC.map((x, i) => { const s = S.src[i]; return s ? `<button class="fchip lnk" data-key="s-${x.k}" data-tip-at="below" data-tip="${x[s]}">${x.mark}${s === 'reading' ? `<span class="shim">${x.label}</span>` : x.label}</button>` : ''; }).join('')}</div>` : none('sources'),
    edits: S => S.edits ? EDITS.slice(0, S.edits).join('') : none('edits')
  };
  const paint = anim => { body.dataset.v = tab; body.innerHTML = views[tab](now); if (anim) stagger(Array.from(body.children), 50); };
  // the view's new markup laid over what is on screen: an element that stays (known by its data-key) is kept, so a tip
  // open on a chip stays open, and only what changed in it is redrawn; new ones go in where they belong and gone ones come
  // out. Returns the new ones
  const morph = markup => {
    const t = document.createElement('template'); t.innerHTML = markup; const fresh = [];
    const same = (e, n) => e.innerHTML === n.innerHTML && [...n.attributes].every(a => a.name === 'class' || a.name === 'style' || e.getAttribute(a.name) === a.value);
    const walk = (have, want) => {
      const old = new Map([...have.children].map(e => [e.dataset.key, e]));
      [...want.children].forEach((n, i) => {
        let e = old.get(n.dataset.key);
        if (e){ old.delete(n.dataset.key);
          if (n.querySelector('[data-key]')) walk(e, n);
          else if (!same(e, n)){ for (const a of n.attributes) if (a.name !== 'class' && a.name !== 'style') e.setAttribute(a.name, a.value); e.innerHTML = n.innerHTML; if (tipFor === e) showTip(e); }
        } else { e = n; fresh.push(e); }
        if (have.children[i] !== e) have.insertBefore(e, have.children[i] || null);
      });
      old.forEach(e => e.remove());
    };
    walk(body, t.content); return fresh;
  };
  // Clean: the card grows with what it holds instead of keeping the room of its tallest view (grow()), and stays centred
  const clean = (r.closest('[data-style]') || document.documentElement).dataset.style === 'clean';
  // the header opens and folds the trail, by click, Enter or Space, and aria-expanded always says which
  let open = true;
  const setOpen = o => { open = o; fold.classList.toggle('shut', !o); fold.inert = !o; head.setAttribute('aria-expanded', o); };
  c.on(head, 'click', () => setOpen(!open));
  c.on(head, 'keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.altKey && !e.ctrlKey && !e.metaKey){ e.preventDefault(); if (!e.repeat) setOpen(!open); } });
  // the trail keeps the room of its tallest view, finished, so the tabs under it stay put and the trail sits centred above
  // them. A hidden copy measures each view at the trail's own width
  let fitW = 0;
  const fit = () => {
    const w = rtr.offsetWidth; if (!main || !w || w === fitW) return; fitW = w;
    const ghost = rtr.cloneNode(true), gb = $('.rtr-body', ghost);
    ghost.inert = true; ghost.setAttribute('aria-hidden', 'true'); $('.rtr-fold', ghost).classList.remove('shut');
    Object.assign(ghost.style, { position:'absolute', left:'0', top:'0', width:w + 'px', visibility:'hidden', pointerEvents:'none' });
    main.appendChild(ghost);
    let h = 0; for (const v in views){ gb.innerHTML = views[v](END); h = Math.max(h, ghost.offsetHeight); }
    ghost.remove(); main.style.minHeight = Math.ceil(h) + 'px'; main.style.justifyContent = 'center';
  };
  // switching views, or a view taking in what the run has just made, grows or shrinks the open trail to its new height
  // instead of jumping to it (from wherever an earlier change has it)
  const ease = from => {
    if (REDUCE || !open || clean) return; if (body._a) body._a.cancel();
    const to = body.offsetHeight; if (Math.abs(to - from) < 1) return;
    const cs = getComputedStyle(body), ms = parseFloat(cs.getPropertyValue('--t')) * 1000 || 450;
    body.style.overflow = 'hidden';
    body._a = body.animate([{ height:from + 'px' }, { height:to + 'px' }], { duration:ms, easing:cs.getPropertyValue('--ease').trim() || 'ease' });
    body._a.onfinish = body._a.oncancel = () => { body.style.overflow = ''; body._a = null; };
  };
  seg($('.seg2', r), v => { const from = body.offsetHeight; tab = v; paint(true); ease(from); });
  paint(true);
  // what the run has just made comes into the view on screen: new rows and chips come in as a view's do, and a row that a
  // new one lands above glides down to make room
  const update = () => {
    if (tab === 'plan') return;
    const from = body.offsetHeight; let fresh = [];
    reflow(() => $$('[data-key]:not(.rtr-src)', body), () => { fresh = morph(views[tab](now)); }, { root:rtr, enter:false, leave:false });
    fresh.forEach(el => enter(el));
    ease(from);
  };
  // grow() starts once the card's entrance has settled: it measures the content on screen, and the entrance's .98 scale
  // would otherwise leave the card that much short of it
  if (clean) requestAnimationFrame(() => { const run = []; for (let e = rtr; e; e = e.parentElement) run.push(...e.getAnimations().filter(a => a.effect && a.effect.getComputedTiming().endTime !== Infinity));
    Promise.all(run.map(a => a.finished.catch(() => {}))).then(() => { if (!c.dead) c.offs.push(grow(rtr)); }); });
  else {
    fit();
    const ro = new ResizeObserver(fit); ro.observe(main || rtr); c.offs.push(() => ro.disconnect());
    if (document.fonts) document.fonts.ready.then(() => { if (!c.dead){ fitW = 0; fit(); } });
  }
  c.every(1000, () => { if (!now.end){ secs++; time.textContent = secs + 's'; } });
  // a plan step finishes: in Clean its tick draws and the rail runs down into the next one
  const step = () => { now.done++; just = now.done - 1; if (tab === 'plan') paint(false); just = -1; };
  // the run, 1.5s a step: each source shows while the agent reads it, each note once the step that finds it is done, and
  // each edit as the last step drafts it
  c.run(async () => {
    // Open the onboarding file: it reads Onboarding.fig, and sees the hero card's padding is off
    await c.wait(1500); step(); now.src[0] = 'read'; now.notes.push(0);
    // Compare it with the design system: it reads tokens.ts, then Card.tsx, and finds the hard-coded grey
    now.src[1] = 'reading'; update();
    await c.wait(750); now.src[1] = 'read'; now.src[2] = 'reading'; update();
    await c.wait(750); step(); now.src[2] = 'read'; now.notes.push(2);
    // Find spacing that breaks the 8px grid: it reads the spacing guide, and finds where desktop drifted
    now.src[3] = 'reading'; update();
    await c.wait(1500); step(); now.src[3] = 'read'; now.notes.push(1); update();
    // Draft fixes for review: the edit to Card.tsx, then the one to Button.tsx
    await c.wait(400); now.edits = 1; now.src[2] = 'edited'; update();
    await c.wait(600); now.edits = 2; update();
    await c.wait(500);
    now.done = plan.length; now.end = true; title.classList.remove('shim'); mark.classList.remove('on'); swap(title, 'Reasoned for ' + Math.max(secs, 5) + 's'); time.textContent = ''; just = plan.length - 1; if (tab === 'plan') paint(false); just = -1;
    // Clean closes the trail with its foot strip: the plan done, and what the agent read and changed
    $('.rtr-fd', r).textContent = `All ${plan.length} steps done`; $('.rtr-fs', r).textContent = '4 sources · 2 edits';
    $('.rtr-ff', r).classList.remove('shut');
  });
});
/* ---------- Thinking ---------- */
DM.def('thinking', (r, c) => {
  const tk = $('.tk', r), list = $('.tk-list', r), title = $('.tk-title', r), time = $('.tk-time', r), head = $('.tk-h', r), fold = $('.tk-fold', r), mark = $('.tk-mark', r);
  // each step: what the agent does and what it found. Measuring the cards times out once, counts down and tries again
  const S = [
    ['Open Pricing v4 in Figma', '6 frames', 1300],
    ['Read the spacing tokens', 'tokens.css, 9 spacing values', 1200],
    ['Measure the plan cards', 'Off the 8px grid', 1400, { retry:"Figma didn't answer", tip:'Pro has an 18px gap, Team 22px and Enterprise 13px' }],
    ['Check text contrast', 'All 14 text pairs pass AA', 1100],
    ['Plan the fix', 'About 3 minutes of work', 1200]
  ];
  const setOpen = o => { tk.dataset.open = o ? '1' : '0'; fold.classList.toggle('shut', !o); head.setAttribute('aria-expanded', o); };
  head.onclick = () => setOpen(tk.dataset.open !== '1');
  // the trace grows with its steps in every style (grow(), started once its entrance has settled, so it measures the card
  // at its real size), and its header says what the work came to as the last step finishes, never after it (owner, 18 Nov).
  // Clean draws its finished mark as a tick on a green disc
  const ds = r.closest('[data-style]'), clean = !!ds && ds.dataset.style === 'clean';
  Promise.resolve().then(() => Promise.all(tk.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && tk.isConnected) c.offs.push(grow(tk)); });
  // (the template's chevron names the sprite's icon directly, which the homepage renames, so it is drawn through I())
  $('.tk-chev', r).outerHTML = I('chev-d', 'xs tk-chev');
  // the header becomes what the work came to
  // (the dots and the finished mark crossfade, iconSwap(); Clean draws its tick on its disc as before)
  const finish = () => { live = false; head.classList.add('tk-fin'); if (clean){ mark.innerHTML = I('check','xs'); enter(mark.firstElementChild); } else iconSwap(mark, () => { mark.innerHTML = I('ok'); }); title.classList.remove('shim'); swap(title, '3 cards to fix, 2 changes planned'); };
  // the line under a step opens and then crossfades; what the step found writes itself in a word at a time, and a tip on it
  // holds the detail
  const words = t => t.split(' ').map((w, i, a) => `<span class="w" style="animation-delay:${i * 45}ms">${w}${i < a.length - 1 ? ' ' : ''}</span>`).join('');
  // (warn: the step is waiting out a problem; its amber lands with its words, 170ms on as swap() writes them)
  const note = (li, text, tip, found, warn = false) => { const res = $('.res', li), sp = res.firstElementChild; res.classList.add('on');
    clearTimeout(sp._tone); const set = () => sp.classList.toggle('warn', warn);
    if (found){ set(); sp._sw = null; sp.classList.remove('out'); sp.innerHTML = tip ? `<span data-tip="${tip}">${words(text)}</span>` : words(text); }
    else { const lag = !REDUCE && !!sp.textContent.trim() && sp.textContent !== text; swap(sp, text); if (lag) sp._tone = setTimeout(set, 170); else set(); } };
  // (a step's mark crossfades on its tile, which keeps its fill: iconSwap(); Clean draws its disc and tick as before)
  const glyph = (li, g) => { const mk = $('.mk', li), put = () => { mk.innerHTML = g; }; if (clean){ put(); enter(mk.firstElementChild); } else iconSwap(mk, put, { inner:true }); };
  let secs = 0, live = true; c.every(1000, () => { if (live){ secs++; time.textContent = secs + 's'; } });
  c.run(async () => {
    await c.wait(600);
    for (const [lab, res, ms, x] of S){
      const li = html(`<li class="tk-st run"><span class="mk"><span class="spin"></span></span><div class="tx"><span class="tk-ln"><span class="lab shim">${lab}</span><span class="tk-dur num"></span></span><span class="res"><span></span></span></div></li>`);
      list.appendChild(li); enter(li);
      const l = $('.lab', li); let took = ms;
      await c.wait(ms);
      if (x && x.retry){
        li.classList.replace('run', 'retry'); l.classList.remove('shim'); glyph(li, I('clock','xs'));
        for (let k = 2; k > 0; k--){ note(li, `${x.retry}. Trying again in ${k}s`, null, false, true); await c.wait(1000); }
        li.classList.replace('retry', 'run'); l.classList.add('shim'); glyph(li, '<span class="spin"></span>'); note(li, 'Trying again'); await c.wait(900); took += 2900;
      }
      li.classList.replace('run', 'done'); l.classList.remove('shim'); glyph(li, I('check','xs')); note(li, res, x && x.tip, true);
      const t = $('.tk-dur', li); t.textContent = (took / 1000).toFixed(1) + 's'; enter(t);
    }
    // the header becomes what the work came to as the last step finishes, and folds the trace away
    finish();
    await c.wait(2500); setOpen(false);
  });
  // the preview's story: once it has folded, the person opens it again and reads what the cards measured
  if (r === c.st) c.story(async s => {
    await s.until(() => fold.classList.contains('shut')); await s.beat(2);
    await s.tap(head); await s.beat(2);
    await s.point($('.res [data-tip]', list)); await s.beat(3);
    s.away(); await s.beat(1);
  });
});
/* ---------- Context meter ---------- */
DM.def('context-meter', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs'));
  const LIMIT = 200;
  // what fills the context, in thousands of tokens; each part lists what's in it on hover. The parts take the chart palette's
  // accent, violet and teal; the instructions, the quiet part, a neutral grey that keeps 3:1 (green would be Blueprint's
  // accent again, and orange the warning)
  // (its tip lists what is in it; what arrives joins the list, and compacting leaves a summary in its place)
  const P = [
    { k:'files', l:'Files', v:32, c:'var(--c1)', tip:'Pricing.fig export 19.8k, PricingCard.tsx 8.1k, tokens.css 4.1k', after:[26, 'Pricing.fig export 19.8k, summary of older reads 6.2k'] },
    { k:'tools', l:'Tool output', v:24, c:'var(--c2)', tip:'Contrast check 11.2k, Figma frames 8.6k, grid audit 4.2k', after:[24, 'Contrast check 11.2k, summary of older output 12.8k'] },
    { k:'chat', l:'Chat', v:26, c:'var(--c6)', tip:'Turns with Maya Kim since 09:12', after:[8, 'Summary of 48 turns, 9 decisions kept'] },
    { k:'sys', l:'Instructions', v:6, c:'var(--muted)', tip:'Studio guidelines 3.9k, pricing brief 2.1k', after:[6, 'Studio guidelines 3.9k, pricing brief 2.1k'] }
  ];
  // what the chat adds as it goes on, one step at a time: [part, thousands of tokens, what it is]. The third takes it past 85%
  const STEPS = [[0, 22, 'brand-guide.pdf'], [1, 36, 'web search'], [2, 28, ''], [0, 10, 'checkout.fig']];
  const root = $('.ctm', r), tg = $('.ctm-tg', r), pop = $('.ctm-pop', r), arc = $('.ctm-ring .fl', r), pc = $('.ctm-pc', r), tot = $('.ctm-tot', r);
  const ring = $('.ctm-ring svg', r), warc = $('.ctm-ring .fw', r), shine = $('.ctm-ring .hl', r);
  const bar = $('.ctm-bar', r), leg = $('.ctm-leg', r), msg = $('.ctm-msg', r), go = $('.ctm-go', r), hint = $('.ctm-hint', r);
  bar.innerHTML = P.map(p => `<i data-k="${p.k}" style="--c:${p.c}"></i>`).join('');
  leg.innerHTML = P.map(p => `<div class="ctm-l" data-k="${p.k}" style="--c:${p.c}" data-tip="${p.tip}"><span class="sw"></span>${p.l}<span class="v num">0k</span></div>`).join('');
  const tips = () => P.forEach(p => { $(`.ctm-l[data-k="${p.k}"]`, leg).dataset.tip = p.tip; });
  const fmt = v => v.toFixed(1) + 'k', sum = () => P.reduce((t, p) => t + p.v, 0);
  // the numbers count to their new values; the bar, the ring and the percentage follow
  const shown = {}; let total = 0, hot = false, onHot = null;
  // the ring's moments (owner, 26 Nov, from its showcase): a step up sends a thin bright highlight once along the filled arc and
  // lifts the ring a touch; crossing 85% wipes the warning mark along the arc and nudges the pill; compacting wipes it back
  const easeIO = 'cubic-bezier(.65,0,.35,1)';
  const step = len => { if (REDUCE || !shine.animate) return;
    const seg = Math.min(9, len); shine.style.strokeDasharray = seg + ' 200';
    shine.animate([{ strokeDashoffset:0, opacity:0 }, { opacity:.9, offset:.5 }, { strokeDashoffset:-(len - seg), opacity:0 }], { duration:450, easing:easeIO });
    ring.animate([{ scale:1 }, { scale:1.06, offset:.2 }, { scale:1 }], { duration:350, easing:'cubic-bezier(.23,1,.32,1)' }); };
  const wipe = (on, len) => { (warc._a || { cancel(){} }).cancel(); warc.style.transition = 'none';
    if (on){ warc.style.opacity = '1'; warc.style.strokeDasharray = len + ' 100'; if (!REDUCE) warc._a = warc.animate([{ strokeDasharray:'0 100' }, { strokeDasharray:len + ' 100' }], { duration:200, easing:easeIO });
      if (!REDUCE) tg.animate([{ translate:'0 0' }, { translate:'3px 0', offset:.22 }, { translate:'-1.4px 0', offset:.6 }, { translate:'0 0' }], { duration:380, easing:'ease-out' }); }
    else { const from = parseFloat(warc.style.strokeDasharray) || 0; warc.style.strokeDasharray = '0 100';
      if (REDUCE){ warc.style.opacity = '0'; } else { const a = warc._a = warc.animate([{ strokeDasharray:from + ' 100' }, { strokeDasharray:'0 100' }], { duration:200, easing:easeIO }); a.onfinish = () => { if (!hot) warc.style.opacity = '0'; }; } }
    void warc.offsetWidth; warc.style.transition = ''; };
  function paint(ms = 900){
    const all = sum(), pct = Math.round(all / LIMIT * 100), up = all > total + .05 && total > 0, was = hot;
    P.forEach(p => { $(`i[data-k="${p.k}"]`, bar).style.width = (p.v / LIMIT * 100) + '%'; const el = $(`.ctm-l[data-k="${p.k}"] .v`, leg), from = shown[p.k] || 0; shown[p.k] = p.v; tween(from, p.v, ms, x => el.textContent = fmt(x)); });
    // the ring turns to the warning mark (and back) as the count passes 85%, not before
    const cross = x => { const h = Math.round(x / LIMIT * 100) >= 85; if (h === hot) return; hot = h; root.classList.toggle('hot', h); wipe(h, pct); if (h && onHot) onHot(); };
    const from = total; total = all; tween(from, all, ms, x => { tot.textContent = fmt(x); pc.textContent = Math.round(x / LIMIT * 100) + '%'; cross(x); });
    arc.style.strokeDasharray = pct + ' 100'; tg.setAttribute('aria-label', `Context, ${pct}% used`);
    if (hot && was) warc.style.strokeDasharray = pct + ' 100';
    if (up || from > all + .05) step(pct);
  }
  // a warning is a warning notice with the filled sign, and Compact, the action that resolves it, takes the warning tint
  const WARN = '<svg class="ctm-wi" viewBox="0 0 24 24" aria-hidden="true"><path class="a" d="M12 3.6 2.6 19.9h18.8z"/><path class="b" d="M12 9.6v4.4M12 17v.01"/></svg>';
  // (a warning already showing keeps its notice and only its words change)
  const say = (text, tone) => { const same = msg.classList.contains('on') && msg.classList.contains(tone) && $('span>span', msg);
    const h = `${tone === 'warn' ? WARN : I('ok','xs')}<span>${text}</span>`, shut = !msg.classList.contains('on');
    msg.className = 'ctm-msg on ' + tone; if (same) swap(same, text); else if (shut) msg.firstElementChild.innerHTML = h; else swap(msg.firstElementChild, h, true); go.classList.toggle('warn', tone === 'warn'); go.classList.toggle('line', tone !== 'warn'); };
  const hush = () => { msg.className = 'ctm-msg'; go.classList.remove('warn'); go.classList.add('line'); };
  // hovering a part lights its share of the bar, and one highlight glides from part to part (hoverGlide(), .mx-glide)
  c.offs.push(hoverGlide(leg, '.ctm-l'));
  c.on(leg, 'pointerover', e => { const l = e.target.closest('.ctm-l'); if (!l) return; bar.classList.add('hl'); $$('i', bar).forEach(i => i.classList.toggle('on', i.dataset.k === l.dataset.k)); });
  c.on(leg, 'pointerout', e => { if (!leg.contains(e.relatedTarget)) bar.classList.remove('hl'); });
  // the pill opens and shuts the panel; Escape shuts it while the pointer or the focus is on the meter
  // it opens above the pill, as it does under a composer. Away from a demo's stage (which keeps room for it) it opens below
  // instead when the window, or a box that clips it, has no room above and more below (as placePop does for menus)
  let full = 0;
  const side = () => {
    if (r.closest('.stage-in')) return 'up';
    full = Math.max(full, root.dataset.open === '1' ? pop.offsetHeight : 0, pop.scrollHeight);
    const room = popRoom(tg), b = tg.getBoundingClientRect(), need = full + 12, above = b.top - room.top, below = room.bottom - b.bottom;
    return above >= need || above >= below ? 'up' : 'down';
  };
  const setOpen = (o, back) => { if (o) root.dataset.pos = side(); root.dataset.open = o ? '1' : '0'; tg.setAttribute('aria-expanded', o); pop.inert = !o; if (back) tg.focus({ preventScroll:true }); };
  tg.onclick = () => setOpen(root.dataset.open !== '1');
  c.on(document, 'keydown', e => { if (e.key === 'Escape' && root.dataset.open === '1' && (root.contains(document.activeElement) || root.matches(':hover'))) setOpen(false, root.contains(document.activeElement)); });
  // the chat goes on: each step adds to one part (and to its tip), the ring grows a step and the share counts up; past 85% the
  // warning shows
  let stepAt = 0;
  function arrive(){ const st = STEPS[stepAt++]; if (!st) return; const p = P[st[0]]; p.v = +(p.v + st[1]).toFixed(1); if (st[2]) p.tip += `, ${st[2]} ${fmt(st[1])}`; tips(); paint(600);
    const pct = Math.round(sum() / LIMIT * 100), warn = () => say(`${pct}% full. Older turns start to drop at 200k`, 'warn');
    if (hot) warn(); else if (pct >= 85) onHot = () => { onHot = null; warn(); }; }
  // Compact turns older turns into a summary and trims old tool output; Undo puts them back
  const before = {}; let state = 'full';
  const run = html('<span class="ctm-run" role="status" hidden><span class="spin"></span><span class="shim">Compacting…</span></span>'); go.after(run);
  // the button is as wide as its words and eases to its new width when they change (owner, 18 Nov), on the motion pieces'
  // spring (mxWidth())
  const label = h => { const w0 = go.offsetWidth; go.innerHTML = h; if (!REDUCE && w0) mxWidth(go, w0); };
  go.onclick = () => c.run(async () => {
    if (go._busy) return; go._busy = true;
    if (state === 'full'){
      P.forEach(p => before[p.k] = [p.v, p.tip]); const was = sum();
      const had = document.activeElement === go; go.hidden = true; run.hidden = false;
      swap(hint, '<span class="shim">Summarising 48 turns</span>', true); await c.wait(1000);
      P.forEach(p => { p.v = p.after[0]; p.tip = p.after[1]; }); tips(); paint(1100);
      say(`Freed ${fmt(was - sum())} tokens. 9 decisions kept`, 'ok'); swap(hint, 'Older turns are now a summary');
      c.later(REDUCE ? 0 : 170, () => { run.hidden = true; go.innerHTML = 'Undo'; go.hidden = false; enter(go); if (had) go.focus({ preventScroll:true }); }); state = 'compact';
    } else {
      P.forEach(p => { [p.v, p.tip] = before[p.k]; }); tips(); paint(700); hush(); swap(hint, 'Summarises older turns'); c.later(REDUCE ? 0 : 170, () => label('Compact')); state = 'full';
    }
    go._busy = false;
  });
  // it opens on its real numbers; they only count when something changes
  paint(1); root.dataset.pos = side();
  // the preview's story: read what fills it, new tool output pushes it close to the limit, compact, then shut it
  if (r === c.st) c.story(async s => {
    await s.beat(3);
    await s.point($('.ctm-l[data-k="tools"]', leg)); await s.beat(3);
    await s.point($('.ctm-l[data-k="files"]', leg)); await s.beat(3);
    s.away(); await s.beat(1);
    for (let i = 0; i < STEPS.length; i++){ arrive(); await s.beat(i === 2 ? 4 : 2.4); }
    await s.beat(1);
    await s.tap(go); s.away(); await s.until(() => state === 'compact'); await s.beat(4);
    await s.tap(tg); s.away(); await s.beat(2);
  });
});
/* ---------- Toast ---------- */
// the Job toast (owner, 26 Nov): a job the agent runs in the background ("Make slides" from the notes) lives in one toast from
// start to finish. It is an agent at work, so its demo keeps playing under a resting pointer (DM.PLAYS); its timing goes
// through the controller (c.later), and what the visitor sets off keeps running once they take over
DM.def('toast', (r, c) => {
  const q = s => $(s, r);
  const make = q('.tst-make'), slot = q('.tst-slot'), T = q('.tst-t'), G = q('.tst-dk'), svg = q('.tst-dk svg'), tx = q('.tst-tx'), hb = q('.tst-hb');
  const ti = q('.tst-ti'), de = q('.tst-de'), moreB = q('.tst-more'), stopB = q('.tst-stop'), xB = q('.tst-x'), ring = q('.tst-ring'), rn = q('.tst-ring .tst-rn');
  const more = q('.tst-mf'), steps = q('.tst-st'), ft = q('.tst-ft'), ftIn = q('.tst-fi');
  const [polite, loud] = $$('.tst-sr', r);
  // the job's own clock: with reduced motion it still takes its time (a few hundred ms a step), so each state can be read
  const wait = ms => new Promise(res => c.later(REDUCE ? Math.min(ms, 400) : ms, res));
  const motion = () => { const cs = getComputedStyle(r), s = v => parseFloat(cs.getPropertyValue(v)) * 1000 || 340; return { ease:cs.getPropertyValue('--ease').trim() || 'ease', t:s('--t'), fast:s('--t-fast'), slow:s('--t-slow'), m:REVEAL[cs.getPropertyValue('--motion').trim()] || REVEAL.soft }; };
  const N = 12, SEC = ['Cover', 'Agenda', 'Revenue', 'North', 'South', 'Plan vs actual', 'By region', 'Hiring', 'Open roles', 'Risks', 'Data move', 'Next steps'];

  /* the glyph: a page for the notes, twelve dashed slots fanned round a point under it, twelve cards, and the tick */
  const ang = i => -32 + i * 64 / (N - 1);
  const card = (i, k) => `<g class="tst-cd${k}" style="--a:${ang(i).toFixed(2)}deg;--i:${i}"><rect class="tst-b" x="26" y="6" width="12" height="20" rx="2"/><path class="tst-l" d="M28.5 10h6M28.5 13.5h7M28.5 17h4.5" pathLength="8"/></g>`;
  svg.innerHTML = '<g class="tst-pg"><rect class="tst-pp" x="23.5" y="6.5" width="17" height="22" rx="2.5"/><path class="tst-pl" d="M27 12h10M27 15.5h8M27 19h10M27 22.5h6"/><path class="tst-sc" d="M25.5 10h13"/></g>'
    + '<g>' + Array.from({ length:N }, (_, i) => card(i, ' tst-gh')).join('') + '</g><g class="tst-fan">' + Array.from({ length:N }, (_, i) => card(i, '')).join('') + '</g>'
    + '<g class="tst-ok"><circle cx="41" cy="27" r="6.5"/><path d="M38.3 27.1l1.9 1.9 3.5-3.6"/></g>';
  const fan = $('.tst-fan', svg), cards = $$('.tst-fan .tst-cd', svg);
  // the card eases to its new height as its words wrap or its steps and footer come and go (grow(), centred in the stage)
  c.offs.push(grow(T));
  const fitNow = () => { T.style.transition = 'none'; T.style.height = T.firstElementChild.offsetHeight + 'px'; void T.offsetHeight; T.style.transition = ''; };
  // the card being drafted, or the one the check stopped on, comes to the front of the hand; the hand goes back in order after
  const order = () => cards.forEach(e => fan.appendChild(e));
  const glyph = k => { G.classList.remove('idle', 'read', 'plan', 'done', 'gone'); k.split(' ').filter(Boolean).forEach(x => G.classList.add(x)); };
  const cardAs = (i, k) => { const e = cards[i]; e.classList.remove('made', 'now', 'chk', 'bad'); if (k) e.classList.add(k);
    if (k === 'now' || k === 'bad') fan.appendChild(e); else if (k === 'made' && fan.lastElementChild === e) order(); };

  /* the steps, opened from the chevron; a step's mark sits in the glyph's column */
  const STEPS = ['Read the notes', 'Outline 12 slides', 'Draft the slides', 'Check the numbers'];
  steps.innerHTML = STEPS.map(s => `<li data-s="wait"><span class="tst-mk"><span class="tst-pend"></span></span><span class="tst-lb">${s}</span><span class="tst-vl"></span></li>`).join('');
  const rows = [...steps.children];
  const MK = { done:I('check'), now:'<span class="spin"></span>', bad:I('alert'), paused:I('pause'), wait:'<span class="tst-pend"></span>' };
  const stepAs = (i, s, v = '') => { const e = rows[i]; if (e.dataset.s !== s){ e.dataset.s = s; $('.tst-mk', e).innerHTML = MK[s]; } $('.tst-vl', e).textContent = v; };

  const S = { phase:'idle', n:0, tok:0, fixed:false, skipped:false, at:'read' };

  /* words that change cross-fade (swap); the words that say what is running sweep (.shim); a counter ticks over at once */
  const sayTi = (text, shim) => { if (ti.textContent === text && !ti._sw){ ti.classList.toggle('shim', !!shim); return; } swap(ti, text); c.later(REDUCE ? 0 : 170, () => ti.classList.toggle('shim', !!shim)); };
  const sayDe = (text, now) => { if (now){ if (de._sw){ clearTimeout(de._sw.t); de._sw = null; de.classList.remove('out'); } de.textContent = text; } else swap(de, text); };
  // announcements: progress politely, a problem at once
  const tell = (text, now) => { const el = now ? loud : polite; el.textContent = ''; c.later(60, () => { el.textContent = text; }); };

  /* the countdown on Close: a ring that drains; the pointer or the focus on the toast holds it, and it closes the toast */
  let cd = null;
  const held = () => T.matches(':hover') || T.contains(document.activeElement);
  const countdown = ms => { if (cd){ cd.cancel(); cd = null; } ring.toggleAttribute('hidden', !ms); if (!ms) return;
    cd = rn.animate([{ strokeDashoffset:0 }, { strokeDashoffset:100 }], { duration:ms, fill:'forwards', easing:'linear' });
    if (held()) cd.pause();
    cd.onfinish = () => { cd = null; dismiss(); }; };
  const holdT = () => { if (cd && cd.playState === 'running') cd.pause(); };
  const goT = () => { if (cd && cd.playState === 'paused' && !held()) cd.play(); };
  c.on(T, 'pointerenter', holdT); c.on(T, 'pointerleave', goT); c.on(T, 'focusin', holdT); c.on(T, 'focusout', () => c.later(0, goT));
  c.offs.push(() => { if (cd) cd.cancel(); });

  /* the footer's buttons for each state: the secondary white and outlined, the one that moves the job on the primary */
  const foot = acts => {
    if (!acts){ ft.classList.add('shut'); return; }
    const was = !ft.classList.contains('shut');
    ftIn.innerHTML = acts.map(([k, t]) => `<button type="button" class="pill sm ${k}${was ? ' in' : ''}">${t}</button>`).join('');
    [...ftIn.children].forEach((b, i) => b.addEventListener('click', acts[i][2]));
    ft.classList.remove('shut');
  };
  const btnOf = t => [...ftIn.querySelectorAll('button')].find(b => b.textContent === t);

  const P = {
    read:    { ti:'Reading your notes…', de:'3 sections · 212 words', work:1 },
    outline: { ti:'Outlining the deck…', de:'12 slides planned', work:1 },
    draft:   { ti:'Drafting slides…', de:() => `Slide ${Math.min(S.n + 1, N)} of 12 · ${SEC[Math.min(S.n, N - 1)]}`, work:1 },
    check:   { ti:'Checking the numbers…', de:'Against the Q3 sheet', work:1 },
    error:   { ti:'Slide 7 doesn’t match', de:'The sheet says 41k, not 14k', acts:[['line', 'Skip', () => skip()], ['primary', 'Fix slide 7', () => fix()]] },
    fix:     { ti:'Fixing slide 7…', de:'Using 41k from the sheet', work:1 },
    done:    { ti:'12 slides ready', de:() => S.skipped ? 'Q3 planning deck · 1 to check' : 'Q3 planning deck · 1 fixed', acts:[['line', 'Undo', () => undo()], ['primary', 'Open', () => openDeck()]], time:10000 },
    stopped: { ti:() => S.at === 'draft' ? `Stopped at slide ${S.n}` : S.at === 'check' ? 'Stopped while checking' : 'Stopped before drafting', de:() => `${S.n} of 12 drafted · nothing lost`, acts:[['line', 'Discard', () => discard()], ['primary', 'Resume', () => resume()]] },
    removed: { ti:'Deck removed', de:'Your notes are unchanged', acts:[['line', 'Redo', () => redo()]], time:6000 }
  };
  const val = v => typeof v === 'function' ? v() : v;
  const setPhase = p => {
    S.phase = p; const d = P[p];
    sayTi(val(d.ti), d.work); sayDe(val(d.de));
    stopB.hidden = !d.work; xB.hidden = !!d.work; moreB.hidden = p === 'removed';
    if (p === 'removed') toggleMore(false);
    foot(d.acts); countdown(d.time || 0);
    // the steps follow the job
    const sv = { read:['now', 'wait', 'wait', 'wait'], outline:['done', 'now', 'wait', 'wait'], draft:['done', 'done', 'now', 'wait'], check:['done', 'done', 'done', 'now'], error:['done', 'done', 'done', 'bad'], fix:['done', 'done', 'done', 'now'], done:['done', 'done', 'done', 'done'], removed:['done', 'done', 'done', 'done'] }[p];
    if (sv) sv.forEach((s, i) => stepAs(i, s, i === 2 && s === 'now' ? `${S.n} of 12` : i === 3 && (p === 'error' || p === 'fix') ? 'Slide 7' : ''));
    if (p === 'stopped'){ const at = ['read', 'outline', 'draft', 'check'].indexOf(S.at); rows.forEach((e, i) => stepAs(i, i < at ? 'done' : i === at ? 'paused' : 'wait', i === at && i === 2 ? `${S.n} of 12` : '')); }
  };

  /* it comes in: it grows out of the button that started it, in the same place, and its parts follow one after another; it
     goes back into the button when it is closed. Both ease with the style's own motion; with reduced motion they only fade */
  const box = el => { const sb = slot.getBoundingClientRect(), b = el.getBoundingClientRect();
    return { left:b.left - sb.left + 'px', top:b.top - sb.top + 'px', width:b.width + 'px', height:b.height + 'px', borderRadius:getComputedStyle(el).borderTopLeftRadius }; };
  const flyer = from => { const f = document.createElement('div'); f.className = 'tst-fly'; Object.assign(f.style, from); slot.appendChild(f); c.offs.push(() => f.remove()); return f; };
  const show = () => {
    T.getAnimations().forEach(a => a.cancel()); T.classList.remove('tst-out');
    const M = motion(), from = box(make);
    T.hidden = false; T.style.opacity = ''; make.classList.add('under'); fitNow();
    if (REDUCE){ T.animate([{ opacity:0 }, { opacity:1 }], { duration:M.fast }); return; }
    const to = box(T), fly = flyer(from); T.style.opacity = '0';
    const a = fly.animate([from, to], { duration:M.slow, easing:M.ease, fill:'forwards' });
    a.finished.then(() => {
      T.style.opacity = ''; fly.animate([{ opacity:1 }, { opacity:0 }], { duration:M.fast, fill:'forwards' }).finished.then(() => fly.remove(), () => fly.remove());
      [G, tx, hb].forEach((el, i) => { const [k] = M.m.part, { transform, ...look } = k;
        if (Object.keys(look).length) el.animate([{ offset:0, ...look }, {}], { duration:M.m.partMs, delay:i * M.m.step, easing:M.m.ease, fill:'backwards' });
        if (transform) el.animate([{ transform }, { transform:'none' }], { duration:M.m.partMs, delay:i * M.m.step, easing:M.m.ease, fill:'backwards' }); });
    }, () => fly.remove());
  };
  // the button comes back where the toast was
  const back = () => { make.classList.remove('under'); if (!REDUCE) make.animate([{ opacity:0, transform:'scale(.96)' }, { opacity:1, transform:'none' }], { duration:motion().t, easing:motion().ease }); };
  const exit = () => new Promise(res => {
    if (T.hidden){ res(); return; }
    const M = motion(), done = () => { T.hidden = true; T.style.transform = ''; T.style.opacity = ''; T.getAnimations().forEach(a => a.cancel()); back(); res(); };
    if (REDUCE){ T.animate([{ opacity:1 }, { opacity:0 }], { duration:M.fast, fill:'forwards' }); c.later(M.fast, done); return; }
    // its words fade at once, and the card eases back into the button
    const from = box(T); make.classList.remove('under'); const to = box(make); make.classList.add('under');
    const fly = flyer(from); T.animate([{ opacity:1 }, { opacity:0 }], { duration:M.fast * .6, fill:'forwards' });
    const a = fly.animate([from, to], { duration:M.t, easing:M.ease, fill:'forwards' });
    a.finished.then(() => { done(); fly.animate([{ opacity:1 }, { opacity:0 }], { duration:M.fast, fill:'forwards' }).finished.then(() => fly.remove(), () => fly.remove()); }, () => { fly.remove(); done(); });
  });
  const label = t => { make.querySelector('span').textContent = t; };
  /* Close, Escape or a swipe: a finished toast goes; a job still running carries on, and the button brings its toast back */
  const after = () => {
    if (P[S.phase] && P[S.phase].work) label('Show progress');
    else if (S.phase === 'stopped' || S.phase === 'error') label('Show job');
    else { S.phase = 'idle'; label('Make slides'); }
  };
  const dismiss = () => { if (T.hidden || closing) return; countdown(0); closing = true; after(); exit().then(() => { closing = false; }); };
  let closing = false;
  const toggleMore = open => { open = open ?? more.classList.contains('shut'); more.classList.toggle('shut', !open); moreB.setAttribute('aria-expanded', open); moreB.setAttribute('aria-label', open ? 'Hide the steps' : 'Show the steps'); moreB.dataset.tip = open ? 'Hide steps' : 'Steps'; };

  /* the job */
  const reset = () => { S.n = 0; S.fixed = false; S.skipped = false; cards.forEach((e, i) => cardAs(i)); order(); glyph('idle'); rows.forEach((e, i) => stepAs(i, 'wait')); toggleMore(false); };
  const start = () => {
    // a job whose toast was dismissed: the button brings its toast back
    if (!T.hidden || closing) return;
    // a job whose toast was closed before it finished, or that finished while it was closed: the button brings it back
    if (P[S.phase]){ label('Make slides'); show(); if (S.phase === 'done') countdown(P.done.time); return; }
    reset(); S.tok++; const tok = S.tok;
    label('Make slides'); setPhase('read'); glyph('read');
    show(); run(tok, 'read');
    tell('Making slides from your notes');
  };
  const live = tok => tok === S.tok && !c.dead;
  async function run(tok, from){
    if (from === 'read'){ S.at = 'read'; setPhase('read'); glyph('read'); await wait(1700); if (!live(tok)) return; from = 'outline'; }
    if (from === 'outline'){ S.at = 'outline'; setPhase('outline'); glyph('plan'); await wait(1300); if (!live(tok)) return; from = 'draft'; }
    if (from === 'draft'){
      S.at = 'draft'; setPhase('draft'); glyph('plan');
      while (S.n < N){
        const i = S.n; cardAs(i, 'now'); sayDe(val(P.draft.de), i > 0); stepAs(2, 'now', `${i + 1} of 12`);
        await wait(400); if (!live(tok)) return;
        cardAs(i, 'made'); S.n++;
        if (S.n === 6) tell('Half the slides are drafted');
      }
      from = 'check';
    }
    if (from === 'check' || from === 'recheck'){
      S.at = 'check'; setPhase('check'); glyph('plan');
      for (let i = from === 'recheck' ? 7 : 0; i < N; i++){
        if (i === 6 && !S.fixed && !S.skipped){ cardAs(i, 'bad'); setPhase('error'); tell('Slide 7 doesn’t match the sheet. Fix slide 7 or skip it.', true); return; }
        if (S.skipped && i === 6) continue;
        cardAs(i, 'chk'); await wait(120); if (!live(tok)) return; cardAs(i, 'made');
      }
    }
    cards.forEach((e, i) => { if (!(S.skipped && i === 6)) cardAs(i, 'made'); });
    await wait(150); if (!live(tok)) return;
    setPhase('done'); glyph('done'); if (T.hidden) label('Show job');
    tell('12 slides ready. Open the deck or undo it.');
  }
  const fix = async () => { S.tok++; const tok = S.tok; setPhase('fix'); cardAs(6, 'now'); tell('Fixing slide 7');
    await wait(1500); if (!live(tok)) return; S.fixed = true; cardAs(6, 'made'); run(tok, 'recheck'); };
  const skip = () => { S.skipped = true; S.tok++; run(S.tok, 'recheck'); };
  const stop = () => { if (!P[S.phase] || !P[S.phase].work) return; S.tok++;
    // stopping a fix goes back to the problem it was fixing
    if (S.phase === 'fix'){ cardAs(6, 'bad'); setPhase('error'); return; }
    cards.forEach((e, i) => { if (e.classList.contains('now') || e.classList.contains('chk')) cardAs(i, i < S.n ? 'made' : ''); });
    if (G.classList.contains('read')) glyph('idle');
    setPhase('stopped'); tell(`Stopped. ${S.n} of 12 drafted. Resume or discard.`); };
  const resume = () => { S.tok++; run(S.tok, S.at); };
  const discard = async () => { S.tok++; countdown(0); glyph('gone'); tell('Job discarded'); S.phase = 'idle'; label('Make slides'); await exit(); reset(); };
  const undo = () => { setPhase('removed'); glyph('gone'); tell('Deck removed. Your notes are unchanged.'); };
  const redo = () => { cards.forEach((e, i) => { if (!(S.skipped && i === 6)) cardAs(i, 'made'); }); glyph('done'); setPhase('done'); tell('Deck restored'); };
  const openDeck = async () => { countdown(0); tell('Opening the deck'); S.phase = 'idle'; label('Make slides'); await exit(); };

  c.on(make, 'click', start);
  c.on(moreB, 'click', () => toggleMore());
  c.on(stopB, 'click', stop);
  c.on(xB, 'click', dismiss);
  // Escape closes the toast while the focus is in it, and the focus goes back to the button that started it
  c.on(T, 'keydown', e => { if (e.key !== 'Escape' || T.hidden) return; const f = T.contains(document.activeElement); dismiss(); if (f) c.later(motion().t + 20, () => make.focus({ preventScroll:true })); });

  /* swipe it away: it follows the finger or the pointer sideways and goes once it has moved far enough, or eases back */
  let sw = null;
  c.on(T, 'pointerdown', e => { if (e.button || e.target.closest('button')) return; sw = { x:e.clientX, y:e.clientY, t:performance.now(), dx:0, id:e.pointerId, on:false }; });
  c.on(T, 'pointermove', e => { if (!sw || e.pointerId !== sw.id) return; const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
    if (!sw.on){ if (Math.abs(dx) < 6 || Math.abs(dy) > Math.abs(dx)) return; sw.on = true; T.setPointerCapture(e.pointerId); }
    sw.dx = dx; T.style.transform = `translateX(${dx}px)`; T.style.opacity = String(Math.max(.2, 1 - Math.abs(dx) / 260)); });
  const swEnd = e => { if (!sw || e.pointerId !== sw.id) return; const s = sw; sw = null; if (!s.on) return;
    const v = Math.abs(s.dx) / Math.max(1, performance.now() - s.t), M = motion();
    if (Math.abs(s.dx) > 90 || v > .6){ const dir = Math.sign(s.dx) || 1; countdown(0);
      const a = T.animate([{ transform:`translateX(${s.dx}px)`, opacity:T.style.opacity }, { transform:`translateX(${dir * 420}px)`, opacity:0 }], { duration:M.t, easing:M.ease, fill:'forwards' });
      after(); a.finished.then(() => { T.hidden = true; a.cancel(); T.style.transform = ''; T.style.opacity = ''; back(); }, () => {}); }
    else { T.animate([{ transform:`translateX(${s.dx}px)`, opacity:T.style.opacity }, { transform:'none', opacity:1 }], { duration:M.t, easing:M.ease }); T.style.transform = ''; T.style.opacity = ''; } };
  c.on(T, 'pointerup', swEnd); c.on(T, 'pointercancel', swEnd);

  /* the demo: the person makes slides, opens the steps, fixes the problem the check finds, tries Undo and Redo, then opens
     the deck */
  c.story(async s => {
    await s.beat(2);
    await s.tap(make);
    await s.beat(5);
    await s.tap(moreB);
    s.away();
    await s.until(() => S.n >= 9);
    await s.tap(moreB);
    s.away();
    await s.until(() => S.phase === 'error');
    await s.beat(3);
    await s.tap(btnOf('Fix slide 7'));
    s.away();
    await s.until(() => S.phase === 'done');
    await s.beat(4);
    await s.tap(btnOf('Undo'));
    await s.beat(3);
    await s.tap(btnOf('Redo'));
    s.away();
    await s.beat(5);
    await s.tap(btnOf('Open'));
    s.away();
  });
});
/* ---------- Toast stack ---------- */
// each toast in the stack is a Toast card (owner, 26 Nov): its head (a live glyph or a status mark, the words, Close with its
// countdown ring), its steps and its footer, swiped or Escaped away. The stack collapses into a deck and fans out under the
// pointer or the keyboard's focus; it reads each card's own height, and the cards and the stack ease together on the motion
// pieces' spring. Its demo is an agent's news as it comes, so it keeps playing under a resting pointer (DM.PLAYS): a job with
// its glyph at work, a success, a problem that becomes its fix in place, and one swiped away. Its timing goes through the
// controller (c.later, the story's beats), and what the visitor sets off keeps running once they take over
DM.def('toast-stack', (r, c) => {
  const stack = $('.tsk-stack', r), addB = $('.tsk-add', r), [polite, loud] = $$('.tst-sr', r);
  const wait = ms => new Promise(res => c.later(REDUCE ? Math.min(ms, 400) : ms, res));
  const motion = () => { const cs = getComputedStyle(r), s = v => parseFloat(cs.getPropertyValue(v)) * 1000 || 340; return { ease:cs.getPropertyValue('--ease').trim() || 'ease', t:s('--t'), fast:s('--t-fast'), tin:s('--t-in') }; };
  // collapsed, the two cards behind the front one peek out 8px each; fanned out, the four in front show, 8px apart; six at most
  const PEEK = 8, GAP = 8, FAN = 4, MAX = 6;
  const MARK = { success:I('ok'), error:I('alert'), warning:I('warn'), info:I('info'), stopped:I('pause'), working:'<span class="spin"></span>' };
  const STEP = { done:I('check'), now:'<span class="spin"></span>', bad:I('alert'), paused:I('pause'), wait:'<span class="tst-pend"></span>' };
  // announcements, through the stack's two live regions: news politely, a problem at once
  const tell = (text, now) => { const el = now ? loud : polite; el.textContent = ''; c.later(60, () => { el.textContent = text; }); };

  /* the stack fans out under a mouse, while the keyboard's focus is in it, on a tap, or while the demo's pointer rests on it */
  let cards = [], hover = false, focused = false, tapped = false, shown = false;
  const fanned = () => hover || focused || tapped || shown;
  const layout = () => {
    const fan = fanned(), front = cards.slice().reverse(), H0 = front.length ? front[0].h : 0;
    let y = 0;
    front.forEach((k, i) => {
      let t, h = k.h, o = 1;
      if (fan){ t = `translateY(${-y}px)`; if (i < FAN) y += k.h + GAP; else o = 0; }
      // the cards behind the front one take its height, so each peeks out by the same 8px whatever it holds
      else { const j = Math.min(i, 2); t = j ? `translateY(${-j * PEEK}px) scale(${1 - j * .05})` : 'translateY(0px)'; if (i) h = H0; if (i > 2) o = 0; }
      k.base = t; k.el.style.height = h + 'px'; k.el.style.zIndex = 100 - i;
      if (!k.fresh && !k.drag){ k.el.style.transform = t; k.el.style.opacity = o; }
      k.el.inert = fan ? i >= FAN : i > 0;
      k.el.classList.toggle('tsk-back', !fan && i > 0);
    });
    stack.style.setProperty('--tsk-h', (fan ? Math.max(0, y - GAP) : H0 + Math.min(Math.max(front.length - 1, 0), 2) * PEEK) + 'px');
    // the countdowns hold while the stack is open for reading
    cards.forEach(k => { if (!k.cd) return; if (fan) k.cd.pause(); else if (k.cd.playState === 'paused') k.cd.play(); });
  };
  c.on(stack, 'pointerenter', e => { if (e.pointerType === 'mouse'){ hover = true; layout(); } });
  c.on(stack, 'pointerleave', e => { if (e.pointerType === 'mouse'){ hover = false; layout(); } });
  c.on(stack, 'focusin', e => { if (!focused && e.target.matches(':focus-visible')){ focused = true; layout(); } });
  c.on(stack, 'focusout', e => { if (focused && !stack.contains(e.relatedTarget)){ focused = false; layout(); } });
  // touch has no hover: a tap on the deck opens it, a tap anywhere else closes it
  c.on(document, 'pointerdown', e => { if (e.pointerType === 'mouse') return; const on = stack.contains(e.target); if (on !== tapped && !(on && e.target.closest('button'))){ tapped = on; layout(); } });

  /* the job's glyph: Toast's hand of slides, dealt as each one is drafted */
  const N = 12, ang = i => -32 + i * 64 / (N - 1);
  const slide = (i, k) => `<g class="tst-cd${k}" style="--a:${ang(i).toFixed(2)}deg;--i:${i}"><rect class="tst-b" x="26" y="6" width="12" height="20" rx="2"/><path class="tst-l" d="M28.5 10h6M28.5 13.5h7M28.5 17h4.5" pathLength="8"/></g>`;
  const deck = '<span class="tst-dk idle" aria-hidden="true"><svg viewBox="0 0 64 40"><g class="tst-pg"><rect class="tst-pp" x="23.5" y="6.5" width="17" height="22" rx="2.5"/><path class="tst-pl" d="M27 12h10M27 15.5h8M27 19h10M27 22.5h6"/><path class="tst-sc" d="M25.5 10h13"/></g>'
    + '<g>' + Array.from({ length:N }, (_, i) => slide(i, ' tst-gh')).join('') + '</g><g class="tst-fan">' + Array.from({ length:N }, (_, i) => slide(i, '')).join('') + '</g>'
    + '<g class="tst-ok"><circle cx="41" cy="27" r="6.5"/><path d="M38.3 27.1l1.9 1.9 3.5-3.6"/></g></svg></span>';
  // look: idle, read, plan, done or gone; n slides drafted, the next one in the accent while drafting
  const glyph = (k, look, n = 0, now = false) => { const G = k.dk; G.setAttribute('class', 'tst-dk ' + look);
    $$('.tst-fan .tst-cd', G).forEach((e, i) => { e.classList.toggle('made', look !== 'gone' && i < n); e.classList.toggle('now', now && i === n); }); };

  /* a card: Toast's own markup */
  const make = job => {
    const el = html(`<div class="tst-t tsk-new"><div class="tsk-in">
      <div class="tst-hd">${job ? deck : '<span class="tst-g mx-ic" aria-hidden="true"></span>'}
        <div class="tst-tx"><span class="tst-ti"></span><span class="tst-de"></span></div>
        <div class="tst-hb">
          <button type="button" class="ib tst-more" aria-expanded="false" aria-label="Show the steps" data-tip="Steps" hidden>${I('chev-d')}</button>
          <button type="button" class="ib tst-stop" aria-label="Stop the job" data-tip="Stop" hidden>${I('stop')}</button>
          <button type="button" class="ib tst-x" aria-label="Close" data-tip="Close"><svg class="tst-ring" viewBox="0 0 28 28" aria-hidden="true" hidden><rect class="tst-tk" x=".75" y=".75" width="26.5" height="26.5"/><rect class="tst-rn" x=".75" y=".75" width="26.5" height="26.5" pathLength="100"/></svg>${I('x')}</button>
        </div>
      </div>
      <div class="fold shut tst-mf"><div><ol class="tst-st" aria-label="Steps"></ol></div></div>
      <div class="fold shut tst-ft"><div><div class="tst-fi"></div></div></div>
    </div></div>`);
    const q = s => $(s, el);
    const k = { el, inner:q('.tsk-in'), g:q('.tst-g'), dk:q('.tst-dk'), ti:q('.tst-ti'), de:q('.tst-de'), moreB:q('.tst-more'), stopB:q('.tst-stop'), xB:q('.tst-x'),
      ring:q('.tst-ring'), rn:q('.tst-rn'), mf:q('.tst-mf'), st:q('.tst-st'), ft:q('.tst-ft'), fi:q('.tst-fi'), h:0, d:{}, cd:null, base:'' };
    el.style.setProperty('--tst-gw', job ? '64px' : '20px');
    c.on(k.moreB, 'click', () => openSteps(k));
    c.on(k.stopB, 'click', () => k.d.onStop && k.d.onStop());
    c.on(k.xB, 'click', () => dismiss(k));
    // Escape closes the card the focus is in; the focus goes on to the next card's Close, or to the button that sends them
    c.on(el, 'keydown', e => { if (e.key === 'Escape'){ e.stopPropagation(); dismiss(k, 'escape'); } });
    swipe(k);
    return k;
  };
  const openSteps = (k, open) => { open = open ?? k.mf.classList.contains('shut'); k.mf.classList.toggle('shut', !open);
    k.moreB.setAttribute('aria-expanded', open); k.moreB.setAttribute('aria-label', open ? 'Hide the steps' : 'Show the steps'); k.moreB.dataset.tip = open ? 'Hide steps' : 'Steps'; };

  /* what a card says and offers: d = { status, title, desc, steps:[[label, state, detail]], acts:[[variant, label, fn]], time,
     onStop, say }. The same card changes in place: its words crossfade (a counter ticks over at once), its mark crossfades
     (iconSwap), its footer opens and shuts, and the card eases to its new height */
  const lead = x => { const m = (x || '').match(/^(\D*)\d/); return m ? m[1] : null; };
  const set = (k, d) => {
    const was = k.d, first = !was.title, working = d.status === 'working'; k.d = d;
    if (first){ k.ti.textContent = d.title; k.ti.classList.toggle('shim', working); }
    else { swap(k.ti, d.title); c.later(REDUCE ? 0 : 170, () => k.ti.classList.toggle('shim', k.d.status === 'working')); }
    if (first || (lead(was.desc) !== null && lead(was.desc) === lead(d.desc))){ if (k.de._sw){ clearTimeout(k.de._sw.t); k.de._sw = null; k.de.classList.remove('out'); } k.de.textContent = d.desc; }
    else swap(k.de, d.desc);
    if (k.g && k.g.dataset.s !== d.status){ const to = () => { k.g.dataset.s = d.status; k.g.innerHTML = MARK[d.status]; }; first ? to() : iconSwap(k.g, to); }
    k.stopB.hidden = !(working && d.onStop); k.xB.hidden = !k.stopB.hidden; k.moreB.hidden = !d.steps;
    if (d.steps){
      if (k.st.children.length !== d.steps.length) k.st.innerHTML = d.steps.map(() => '<li><span class="tst-mk"></span><span class="tst-lb"></span><span class="tst-vl"></span></li>').join('');
      d.steps.forEach(([lb, s, v = ''], i) => { const li = k.st.children[i]; if (li.dataset.s !== s){ li.dataset.s = s; $('.tst-mk', li).innerHTML = STEP[s]; } $('.tst-lb', li).textContent = lb; $('.tst-vl', li).textContent = v; });
    } else openSteps(k, false);
    if (!d.acts) k.ft.classList.add('shut');
    else if (d.acts !== was.acts){
      const open = !k.ft.classList.contains('shut');
      k.fi.innerHTML = d.acts.map(([v, t]) => `<button type="button" class="pill sm ${v}${open ? ' in' : ''}">${t}</button>`).join('');
      [...k.fi.children].forEach((b, i) => b.addEventListener('click', d.acts[i][2]));
      k.ft.classList.remove('shut');
    }
    countdown(k, working ? 0 : d.time || 0);
    // (say:false changes it quietly: a counter ticking, a step on the way; the milestones are announced)
    const say = d.say === false ? k.said : d.say || d.title; if (say !== k.said){ k.said = say; tell(say, d.status === 'error'); }
  };
  const btn = (k, t) => [...k.fi.querySelectorAll('button')].find(b => b.textContent === t);

  /* the countdown on Close: a ring that drains, held while the stack is open for reading (pointer or focus); it closes the card */
  const countdown = (k, ms) => { if (k.cd){ k.cd.cancel(); k.cd = null; } k.ring.toggleAttribute('hidden', !ms); if (!ms) return;
    k.cd = k.rn.animate([{ strokeDashoffset:0 }, { strokeDashoffset:100 }], { duration:ms, fill:'forwards', easing:'linear' });
    if (fanned()) k.cd.pause();
    k.cd.onfinish = () => { k.cd = null; dismiss(k, 'timeout'); }; };
  c.offs.push(() => cards.forEach(k => k.cd && k.cd.cancel()));

  /* a new card comes in at the front: it rises out of a short blur as the cards it covers step back and lose their words */
  const push = (d, job) => {
    const k = make(job); k.fresh = true; stack.appendChild(k.el); cards.push(k);
    set(k, d);
    k.h = k.inner.offsetHeight;
    const ro = new ResizeObserver(() => { const h = k.inner.offsetHeight; if (h && h !== k.h && !k.gone){ k.h = h; layout(); } }); ro.observe(k.inner); c.offs.push(() => ro.disconnect()); k.ro = ro;
    while (cards.length > MAX) dismiss(cards[0], 'drop');
    layout();
    requestAnimationFrame(() => requestAnimationFrame(() => { if (c.dead || k.gone) return; k.fresh = false; k.el.classList.remove('tsk-new'); layout(); }));
    return k;
  };
  /* a card goes: Close, its countdown or Escape fade it 8px down while the others close the gap; a swipe has carried it off */
  const dismiss = (k, how = 'close') => {
    if (k.gone) return; k.gone = true; countdown(k, 0); k.ro && k.ro.disconnect();
    const had = k.el.contains(document.activeElement);
    cards = cards.filter(x => x !== k); k.el.inert = true; k.el.classList.add('tsk-out');
    const end = () => k.el.remove();
    if (how === 'swipe') c.later(motion().t, end);
    else { const from = getComputedStyle(k.el).transform, t0 = from === 'none' ? '' : from;
      const a = k.el.animate(REDUCE ? [{ opacity:getComputedStyle(k.el).opacity }, { opacity:0 }] : [{ transform:t0 || 'none', opacity:getComputedStyle(k.el).opacity }, { transform:t0 + ' translateY(8px) scale(.98)', opacity:0 }], { duration:motion().tin, easing:motion().ease, fill:'forwards' });
      a.finished.then(end, end); }
    layout();
    if (had && how !== 'drop'){ const next = cards[cards.length - 1]; c.later(0, () => ((next && !next.xB.hidden ? next.xB : next && next.stopB) || addB).focus({ preventScroll:true })); }
  };

  /* swipe a card away: it follows the finger or the pointer sideways and goes once it has moved far enough, or eases back */
  const fling = (k, dx, v) => {
    if (Math.abs(dx) > 90 || v > .6){ const dir = Math.sign(dx) || 1, M = motion();
      // (with reduced motion it only fades where it was let go)
      k.el.animate([{ transform:`${k.base} translateX(${dx}px)`, opacity:k.el.style.opacity }, { transform:`${k.base} translateX(${REDUCE ? dx : dx + dir * 140}px)`, opacity:0 }], { duration:REDUCE ? M.fast : M.t, easing:M.ease, fill:'forwards' });
      k.drag = false; k.el.style.transition = ''; dismiss(k, 'swipe'); }
    else { k.drag = false; k.el.style.transition = ''; k.el.style.transform = k.base; k.el.style.opacity = 1; }
  };
  const drag = (k, dx) => { k.drag = true; k.el.style.transition = 'none'; k.el.style.transform = `${k.base} translateX(${dx}px)`; k.el.style.opacity = String(Math.max(.2, 1 - Math.abs(dx) / 260)); };
  const swipe = k => { let sw = null;
    c.on(k.el, 'pointerdown', e => { if (e.button || e.target.closest('button')) return; sw = { x:e.clientX, y:e.clientY, t:performance.now(), dx:0, id:e.pointerId, on:false }; });
    c.on(k.el, 'pointermove', e => { if (!sw || e.pointerId !== sw.id) return; const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
      if (!sw.on){ if (Math.abs(dx) < 6 || Math.abs(dy) > Math.abs(dx)) return; sw.on = true; k.el.setPointerCapture(e.pointerId); }
      sw.dx = dx; drag(k, dx); });
    const up = e => { if (!sw || e.pointerId !== sw.id) return; const s = sw; sw = null; if (s.on) fling(k, s.dx, Math.abs(s.dx) / Math.max(1, performance.now() - s.t)); };
    c.on(k.el, 'pointerup', up); c.on(k.el, 'pointercancel', up); };

  /* the news */
  const SEC = ['Cover', 'Agenda', 'Revenue', 'North', 'South', 'Plan vs actual', 'By region', 'Hiring', 'Open roles', 'Risks', 'Data move', 'Next steps'];
  // a job the agent runs in the background: it reads the notes, outlines and drafts twelve slides; Stop pauses it
  const job = () => {
    let tok = 0, n = 0, at = 0;
    const L = ['Read the notes', 'Outline 12 slides', 'Draft the slides'];
    const steps = (s, v) => L.map((lb, i) => [lb, i < at ? 'done' : i === at ? s : 'wait', i === 2 && i <= at && v ? v : '']);
    const work = (title, desc) => ({ status:'working', title, desc, steps:steps('now', at === 2 ? `${Math.min(n + 1, N)} of 12` : ''), onStop:stop, say:at ? false : 'Making slides from your notes' });
    const k = push({ status:'working', title:'Reading your notes…', desc:'3 sections · 212 words', steps:steps('now'), onStop:() => stop(), say:'Making slides from your notes' }, true);
    const live = t => t === tok && !k.gone && !c.dead;
    async function go(t){
      if (at === 0){ glyph(k, 'read'); set(k, work('Reading your notes…', '3 sections · 212 words')); await wait(1600); if (!live(t)) return; at = 1; }
      if (at === 1){ glyph(k, 'plan'); set(k, { ...work('Outlining the deck…', '12 slides planned'), say:false }); await wait(1200); if (!live(t)) return; at = 2; }
      while (n < N){ glyph(k, 'plan', n, true); set(k, { ...work('Drafting slides…', `Slide ${n + 1} of 12 · ${SEC[n]}`), say:n === 6 ? 'Half the slides are drafted' : false }); await wait(380); if (!live(t)) return; n++; }
      at = 3; glyph(k, 'done', N); done();
    }
    const done = () => set(k, { status:'success', title:'12 slides ready', desc:'Q3 planning deck', steps:steps('done'), time:12000, say:'12 slides ready. Open the deck or undo it.',
      acts:[['line', 'Undo', () => { glyph(k, 'gone'); set(k, { status:'success', title:'Deck removed', desc:'Your notes are unchanged', steps:steps('done'), time:6000, acts:[['line', 'Redo', () => { glyph(k, 'done', N); done(); }]] }); }], ['primary', 'Open', () => dismiss(k)]] });
    function stop(){ tok++; glyph(k, at ? 'plan' : 'idle', n); set(k, { status:'stopped', title:at === 2 ? `Stopped at slide ${n}` : 'Stopped before drafting', desc:`${n} of 12 drafted · nothing lost`, steps:steps('paused', `${n} of 12`), say:`Stopped. ${n} of 12 drafted. Resume or discard.`,
      acts:[['line', 'Discard', () => dismiss(k)], ['primary', 'Resume', () => go(++tok)]] }); }
    go(++tok);
    return k;
  };
  // a problem the agent can fix: the card becomes its fix, then the result, in place
  const tests = () => {
    let tok = 0;
    const T = [['Cart total rounds down', 'bad'], ['Tax shows on the receipt', 'bad'], ['40 other tests', 'done']];
    const fail = () => ({ status:'error', title:'2 tests failed', desc:'checkout.spec · the total is 1¢ off', steps:T, say:'2 tests failed in checkout.spec. Fix them or ignore them.',
      acts:[['line', 'Ignore', () => dismiss(k)], ['primary', 'Fix', () => fix()]] });
    const k = push(fail());
    async function fix(){ const t = ++tok, live = () => t === tok && !k.gone && !c.dead;
      const stop = () => { tok++; set(k, fail()); };
      set(k, { status:'working', title:'Fixing 2 tests…', desc:'Rounding in cart.ts', steps:T.map(([l, s]) => [l, s === 'bad' ? 'now' : s]), onStop:stop, say:'Fixing 2 tests' }); await wait(1700); if (!live()) return;
      for (let i = 6; i <= 42; i += 6){ set(k, { status:'working', title:'Running checkout.spec…', desc:`Passed ${i} of 42`, steps:T.map(([l]) => [l, 'done']), onStop:stop, say:false }); await wait(200); if (!live()) return; }
      set(k, { status:'success', title:'42 tests passed', desc:'Fixed in cart.ts · 1 line', steps:T.map(([l]) => [l, 'done']), time:10000, acts:[['line', 'View diff', () => dismiss(k)]], say:'42 tests passed. Fixed in cart.ts.' });
    }
    return k;
  };
  // plain news, and what Send notification sends: one action at most, and a countdown
  const POOL = [
    { status:'success', title:'Frames synced', desc:'6 frames from Pricing.fig', time:9000 },
    { status:'info', title:'PR #412 is ready', desc:'Use shared spacing tokens · 3 files', time:10000, acts:[['primary', 'Review', null]] },
    { status:'warning', title:'Budget at 80%', desc:'1,600 of 2,000 credits', time:12000, acts:[['warn', 'Raise cap', null]] },
    { status:'success', title:'Draft written', desc:'Launch email · 2 subject lines', time:9000 }
  ];
  let sent = 0;
  const news = (d = POOL[sent++ % POOL.length]) => { let k;
    const acts = d.acts && d.acts.map(([v, t]) => [v, t, () => t === 'Raise cap' ? set(k, { status:'success', title:'Cap raised to 3,000', desc:'1,600 of 3,000 credits', time:6000 }) : dismiss(k)]);
    k = push({ ...d, acts }); return k; };
  c.on(addB, 'click', () => news());

  /* the demo: a job starts, a success and a problem arrive; the pointer opens the stack, fixes the problem, swipes the success
     away, and leaves the stack to fold back */
  c.story(async s => {
    await s.beat(1);
    const J = job();
    await s.beat(3);
    const F = news(POOL[0]); sent = 1;
    await s.beat(3);
    const P = tests();
    await s.beat(3);
    await s.point(P.ti, false); shown = true; layout();
    await s.beat(3);
    await s.tap(btn(P, 'Fix'));
    await s.until(() => P.d.status === 'success');
    await s.beat(2);
    // the swipe: the pointer takes the synced frames' card and drags it off to the right
    if (!F.gone){
      await s.point(F.de, false);
      const hand = $('.hand', c.st), m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(hand ? hand.style.transform : '');
      if (hand){ hand.classList.add('down'); hand.style.transition = 'none'; }
      await tween(0, 120, REDUCE ? 1 : 360, dx => { if (c.mine || c.dead || F.gone) return; drag(F, dx); if (hand && m) hand.style.transform = `translate(${+m[1] + dx}px,${m[2]}px)`; }, t => t * t);
      if (hand){ hand.style.transition = ''; hand.classList.remove('down'); }
      if (c.mine || c.dead) throw 'stop';
      if (!F.gone) fling(F, 120, 1);
    }
    await s.beat(3);
    s.away(); shown = false; layout();
    await s.until(() => J.d.title === '12 slides ready');
    await s.beat(5);
  });
  // the visitor takes over: the stack follows their pointer and focus alone
  c.taken(() => { if (shown){ shown = false; layout(); } });
});
/* ---------- Agent run timeline ---------- */
DM.def('agent-run-timeline', (r, c) => {
  // each kind of step has a hue (a chart colour for its bar, the palette slot for its text and icon tint) and a name in the key.
  // Teal and orange take a little of their text slot, so the bars keep 3:1 on a light stage
  const K = { model:['Model', 'var(--c2)', 'pl'], tool:['Tools', 'color-mix(in srgb,var(--c6) 70%,var(--pt))', 'pt'], app:['Apps', 'color-mix(in srgb,var(--c4) 75%,var(--pp))', 'pp'] };
  // an icon starting with @ is an app's own mark
  const S = [
    { l:'Plan the change', ic:'brain', k:'model', s:0, d:1.6, cost:.03 },
    { l:'Read 6 files', ic:'file-text', k:'tool', s:1.6, d:2.2, cost:.02 },
    { l:'Search Figma', ic:'@figma', k:'app', s:1.9, d:1.4, cost:.01 },
    { l:'Edit PricingCard', ic:'edit', k:'model', s:4, d:2.4, cost:.06 },
    { l:'Run tests', ic:'term', k:'tool', s:6.5, d:1.5, cost:.01, fail:'2 failed' },
    { l:'Run tests again', ic:'refresh', k:'tool', s:8.1, d:1.9, cost:.01, retry:true },
    { l:'Open a PR on GitHub', ic:'@github', k:'app', s:10.1, d:1, cost:.02 },
    { l:'Post to Slack', ic:'@slack', k:'app', s:11.1, d:.6, cost:.01 }
  ];
  const T = 12, END = Math.max(...S.map(s => s.s + s.d)), PACE = 1.6, TK = [0, 3, 6, 9, 12];
  const art = $('.art', r), grid = $('.art-grid', r), rows = $('.art-rows', r), now = $('.art-now', r), head = $('.art-head', r), st = $('.art-s', r), foot = $('.art-f', r);
  $('.art-hi', r).innerHTML = I('bolt', 'xs');
  $('.art-ticks', r).innerHTML = TK.map(t => `<span style="left:${t / T * 100}%">${t}s</span>`).join('');
  const ticks = $$('.art-ticks span', r);
  $('.art-key', r).innerHTML = Object.entries(K).map(([id, k]) => `<span role="listitem" style="--k:${k[1]}"><i></i>${k[0]}<b data-k="${id}">0.0s</b></span>`).join('');
  const kb = Object.fromEntries($$('.art-key b', r).map(b => [b.dataset.k, b]));
  const pct = v => v / T * 100 + '%';
  S.forEach((s, i) => {
    const k = K[s.k], prev = S[i - 1];
    const link = s.retry && prev ? `<span class="art-link" aria-hidden="true" style="left:${pct(prev.s + prev.d)};width:${pct(s.s - prev.s - prev.d)}"></span>` : '';
    s.el = html(`<div class="art-row" data-k="${s.k}" data-s="wait" style="--k:${k[1]};--kt:var(--${k[2]});--kb:var(--${k[2]}-bg)"><span class="art-lab"><span class="art-ic" aria-hidden="true">${s.ic[0] === '@' ? BRAND[s.ic.slice(1)] : I(s.ic, 'xs')}</span><span class="t">${s.l}</span></span><span class="art-lane">${link}<span class="art-bar" style="left:${pct(s.s)}" data-tip="${s.l}: ${s.d.toFixed(1)}s, $${s.cost.toFixed(2)}${s.fail ? ', 2 tests failed' : ''}"><i></i></span></span><span class="art-d num"></span></div>`);
    s.bar = $('.art-bar', s.el); s.dur = $('.art-d', s.el); s.st = 'wait';
    rows.appendChild(s.el);
  });
  stagger($$('.art-row', r), 40);
  let line = '', ft = '';
  // the run as it stands t seconds in: bars, states, times, the key, the footer and the line under the title
  function draw(t){
    grid.style.setProperty('--p', (t / T).toFixed(4));
    let cost = 0, n = 0, re = 0; const per = { model:0, tool:0, app:0 }, live = [];
    S.forEach(s => {
      const w = Math.max(0, Math.min(s.d, t - s.s)), was = s.st;
      s.st = t < s.s ? 'wait' : t < s.s + s.d ? 'run' : s.fail ? 'fail' : 'done';
      s.bar.style.width = pct(w);
      s.dur.textContent = t >= s.s ? w.toFixed(1) + 's' : '';
      if (s.st !== was){
        s.el.dataset.s = s.st;
        if (s.st === 'fail'){ const tg = html(`<span class="tag bad">${s.fail}</span>`); $('.art-lab', s.el).appendChild(tg); enter(tg); }
        if (s.st === 'done'){ s.el.classList.remove('bump'); void s.el.offsetWidth; s.el.classList.add('bump'); }
      }
      if (t >= s.s){ n++; cost += s.cost * w / s.d; per[s.k] += w; }
      if (s.st === 'fail') re++;
      if (s.st === 'run') live.push(s.l);
    });
    for (const k in per) kb[k].textContent = per[k].toFixed(1) + 's';
    const f = `<span>${I('clock','xs')}<span><b>${Math.min(t, END).toFixed(1)}s</b> total</span></span><span>${I('dollar','xs')}<span><b>$${cost.toFixed(2)}</b> cost</span></span><span>${I('layers','xs')}<span><b>${n}</b> ${n === 1 ? 'step' : 'steps'}</span></span><span>${I('refresh','xs')}<span><b>${re}</b> ${re === 1 ? 'retry' : 'retries'}</span></span>`;
    if (f !== ft){ foot.innerHTML = f; ft = f; }
    // between two steps the line keeps the last one's name, so it never flickers
    if (live.length && live.join(', ') !== line){ line = live.join(', '); st.textContent = line; }
    now.textContent = t.toFixed(1) + 's';
    // the playhead is placed by the script as it moves (it is no column of the card)
    head.style.left = `calc(var(--lab) + (100% - var(--lab) - var(--dur)) * ${(t / T).toFixed(4)})`;
    // the time on the playhead covers the axis labels it passes
    const b = now.getBoundingClientRect();
    ticks.forEach(el => { const x = el.getBoundingClientRect(); el.classList.toggle('hid', x.right > b.left - 4 && x.left < b.right + 4); });
  }
  draw(0);
  c.run(async () => {
    await c.wait(500);
    art.classList.add('live'); st.classList.remove('muted'); st.classList.add('shim');
    // time moves on only while the demo isn't held, so a mouse resting on it stops the playhead where it is: a long gap
    // between two frames is a hold (or the card being away) ending, and counts as one frame
    await new Promise(res => { let t = 0, last = 0; c.loop(ts => { const dt = last && ts - last < 250 ? ts - last : 16; last = ts; t = Math.min(END, t + dt / 1000 * PACE); draw(t); if (t >= END){ res(); return false; } }); });
    art.classList.remove('live'); art.classList.add('fin');
    st.classList.remove('shim'); st.classList.add('muted');
    now.innerHTML = I('check','xs') + END.toFixed(1) + 's';
    const tag = $('.art-tag', r); tag.className = 'art-tag tag ok'; tag.innerHTML = I('check','xs') + 'Done'; enter(tag);
    // what the run did, not its time or retries again: the totals under the chart already say those (owner, 18 Nov)
    swap(st, 'Opened a PR and posted to Slack');
  });
});
/* ---------- Web search ---------- */
DM.def('web-search', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs'));
  // the searches: what was asked, how many results, how long it took, and the pages it opened. The first finds nothing and is
  // asked again in other words
  const Q = [
    { q:'stripe usage based billing limits 2026 enterprise tier', n:0, ms:'0.6s' },
    { q:'stripe usage-based billing limits', n:5, ms:'0.9s', from:0, p:[
      ['Usage-based billing', 'stripe.com', 'Oct 2026', 'read'], ['Meters and billing thresholds', 'stripe.com', 'Sep 2026', 'read', 1],
      ['How we moved 40k customers to usage billing', 'medium.com', 'Mar 2026', 'skim'], ['Why SaaS pricing is moving to usage', 'ft.com', 'Aug 2026', 'paywall'] ] },
    { q:'metronome vs orb usage billing', n:6, ms:'1.1s', p:[
      ['Metronome vs Orb: a fair comparison', 'metronome.com', 'Jul 2026', 'read', 2], ['Orb pricing and plans', 'withorb.com', 'Oct 2026', 'read'],
      ['orb-billing/examples: sending usage events', 'github.com', 'Jun 2026', 'read'], ['Anyone switched from Stripe Billing to Orb?', 'reddit.com', 'May 2026', 'blocked'] ] }
  ];
  const ST = { read:['Read', ''], skim:['Skimmed', ''], paywall:['Skipped: paywall', 'warn'], blocked:['Skipped: blocked', 'warn'], timeout:['Skipped: timeout', 'warn'] };
  const root = $('.wsx', r), head = $('.wsx-h', r), ic = $('.wsx-ic', r), st = $('.wsx-st', r), marks = $('.wsx-marks', r), fold = $('.wsx-fold', r), list = $('.wsx-list', r), ans = $('.wsx-ans', r), sr = $('.wsx-sr', r);
  const say = t => { sr.textContent = t; };
  // the card grows and shrinks with what it holds (grow()), eased and centred, in every style (owner, 18 Nov), instead of
  // keeping the height it had once the trail folds
  c.offs.push(grow(root));
  const setOpen = o => { head.setAttribute('aria-expanded', o); fold.classList.toggle('shut', !o); };
  head.onclick = () => setOpen(head.getAttribute('aria-expanded') !== 'true');
  const sites = [];
  const drawMarks = () => { const u = [...new Set(sites)]; marks.innerHTML = u.slice(0, 4).map(s => `<span data-s="${s}">${s[0].toUpperCase()}</span>`).join('') + (u.length > 4 ? `<span class="n">+${u.length - 4}</span>` : ''); };
  const qOpen = (el, o) => { const b = $('.wsx-qh', el), f = $('.fold', el); if (!f) return; b.setAttribute('aria-expanded', o); f.classList.toggle('shut', !o); };
  const pages = {};
  let done = false;
  c.run(async () => {
    await c.wait(500);
    for (const [k, q] of Q.entries()){
      const el = html(`<div class="wsx-q" data-k="${k}"><button class="wsx-qh mx-press${q.n ? '' : ' empty'}" aria-expanded="false">${I('search','xs')}<span class="t shim">${q.q}</span><span class="n shim">Searching</span><span class="tm num"></span>${I('chev-r','xs')}</button>${q.from != null ? `<span class="wsx-rw">${I('refresh','xs')}Asked again in other words</span>` : ''}${q.p ? '<div class="fold shut"><div><ul class="wsx-rs"></ul></div></div>' : ''}</div>`);
      // the head says what is happening; the query and its pages are in the rows under it, so it repeats neither (owner, 18 Nov)
      list.appendChild(el); enter(el); swap(st, 'Searching the web');
      const b = $('.wsx-qh', el); b.onclick = () => { if ($('.fold', el)) qOpen(el, b.getAttribute('aria-expanded') !== 'true'); };
      await c.wait(1100);
      $('.t', b).classList.remove('shim'); $('.tm', b).textContent = q.ms;
      const n = $('.n', b); n.classList.remove('shim'); n.textContent = q.n ? `${q.n} results` : 'No results'; n.classList.toggle('none', !q.n);
      b.setAttribute('aria-label', `${q.q}: ${q.n ? q.n + ' results' : 'no results'}, ${q.ms}`);
      say(q.n ? `${q.n} results for ${q.q}` : `No results for ${q.q}. Asking again in other words`);
      if (!q.p){ await c.wait(500); continue; }
      qOpen(el, true); const ul = $('.wsx-rs', el);
      swap(st, 'Reading the pages');
      for (const [t, d, when, s, cite] of q.p){
        const li = html(`<li class="wsx-r" tabindex="0" data-tip="${t} · ${d}"><span class="wsx-fav" aria-hidden="true">${d[0].toUpperCase()}</span><span class="tx"><span class="t">${t}</span><span class="d">${d} · ${when}</span></span><span class="tag"><span class="spin"></span><span class="shim">Reading</span></span></li>`);
        ul.appendChild(li); enter(li); sites.push(d); drawMarks(); if (cite) pages[cite] = { li, q:el, d };
        await c.wait(420);
        const g = $('.tag', li); g.className = 'tag ' + ST[s][1]; g.textContent = ST[s][0]; li.classList.toggle('skip', s !== 'read' && s !== 'skim');
        li.setAttribute('aria-label', `${t}, ${d}, ${when}: ${ST[s][0]}`);
      }
      await c.wait(500); qOpen(el, false);
    }
    // done: the trail folds to one line, and the answer streams in under it, citing its pages
    // (the spinner crossfades to the globe: iconSwap(), motion pieces)
    done = true; iconSwap(ic, () => { ic.innerHTML = I('globe','xs'); }, { inner:true }); st.classList.remove('shim');
    const read = Q.flatMap(q => q.p || []).filter(p => p[3] === 'read' || p[3] === 'skim').length;
    swap(st, `${Q.length} searches, ${read} pages read`); say(`Done: ${Q.length} searches, ${read} pages read`);
    await c.wait(400); setOpen(false);
    const A = 'Stripe caps metered usage at 100 million events a month for each meter [1]. Metronome and Orb both take events in bulk with no monthly cap [2]. At your volume Stripe still fits, with room to grow.'.split(' ');
    for (let i = 1; i <= A.length; i++){ ans.innerHTML = A.slice(0, i).join(' ').replace(/\[(\d)\]/g, (m, k) => `<button class="wsx-cite" data-n="${k}" aria-label="Source ${k}: ${$('.t', pages[k].li).textContent}, ${pages[k].d}" data-tip="${$('.t', pages[k].li).textContent} · ${pages[k].d}">${k}</button>`); await c.wait(50); }

  });
  // a citation lights the page it came from (and the query that found it), and its site's mark
  const light = k => { $$('.wsx-r.hl, .wsx-q.hl', r).forEach(x => x.classList.remove('hl')); $$('.wsx-marks span', r).forEach(x => x.classList.remove('hl')); $$('.wsx-cite', r).forEach(x => x.classList.toggle('on', x.dataset.n === k)); if (!k) return;
    const p = pages[k]; const shown = !$('.fold', p.q).classList.contains('shut') && head.getAttribute('aria-expanded') === 'true'; (shown ? p.li : p.q).classList.add('hl'); const m = $(`.wsx-marks span[data-s="${p.d}"]`, r); if (m) m.classList.add('hl'); };
  c.on(ans, 'pointerover', e => { const b = e.target.closest('.wsx-cite'); if (b) light(b.dataset.n); });
  c.on(ans, 'pointerout', e => { const b = e.target.closest('.wsx-cite'); if (b && !b.contains(e.relatedTarget)) light(null); });
  c.on(ans, 'focusin', e => { const b = e.target.closest('.wsx-cite'); if (b) light(b.dataset.n); });
  c.on(ans, 'focusout', () => light(null));
  // the preview's story: open the trail again, open the search that found source 2, and point at [2]
  if (r === c.st) c.story(async s => {
    await s.until(() => done && $('.wsx-cite[data-n="2"]', r)); await s.beat(4);
    await s.tap(head); await s.beat(2);
    await s.tap($('.wsx-q[data-k="2"] .wsx-qh', r)); await s.beat(2);
    const b = $('.wsx-cite[data-n="2"]', r); await s.point(b); light('2'); await s.beat(4);
    light(null); s.away(); await s.beat(2);
  });
});