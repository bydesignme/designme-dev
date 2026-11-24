TPLS["thinking-states"] = "<div class=\"ths-dm dm\"><div class=\"dm-main\">\n  <div class=\"ths\" data-v=\"orbit\">\n    <div class=\"ths-row\">\n      <span class=\"ths-mk\" aria-hidden=\"true\"></span>\n      <span class=\"ths-l\" aria-hidden=\"true\"><span class=\"ths-tx shim\">Thinking</span><span class=\"ths-car\" hidden></span></span>\n      <span class=\"ths-t num\" aria-hidden=\"true\">0s</span>\n    </div>\n    <span class=\"ths-sr\" role=\"status\" aria-live=\"polite\">Thinking</span>\n  </div>\n  </div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Thinking state\"><button aria-pressed=\"true\" data-v=\"orbit\">Orbit</button><button aria-pressed=\"false\" data-v=\"morph\">Morph</button><button aria-pressed=\"false\" data-v=\"scan\">Scan</button><button aria-pressed=\"false\" data-v=\"stream\">Stream</button><button aria-pressed=\"false\" data-v=\"matrix\">Matrix</button><button aria-pressed=\"false\" data-v=\"stack\">Stack</button></div></div>\n</div>";
TPLS["step-loader"] = "<div class=\"stl dm\"><div class=\"dm-main\">\n  <button class=\"stl-row\" aria-expanded=\"false\">\n    <span class=\"stl-g\"></span>\n    <span class=\"stl-t\"><span class=\"stl-lab shim\">Reading Figma frames</span></span>\n    <span class=\"stl-n num\">1/4</span>\n    <svg class=\"i xs stl-chev\"><use href=\"#v2i-chev-d\"/></svg>\n  </button>\n  <div class=\"stl-track\"><i></i><i></i><i></i><i></i></div>\n  <div class=\"fold shut stl-fold\"><div><ol class=\"stl-list\"></ol></div></div>\n  </div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Loader\"><button aria-pressed=\"true\" data-v=\"radar\">Radar</button><button aria-pressed=\"false\" data-v=\"think\">Dots</button><button aria-pressed=\"false\" data-v=\"spin\">Ring</button><button aria-pressed=\"false\" data-v=\"bars\">Bars</button></div></div>\n</div>";
TPLS["status-pill"] = "<div class=\"spl dm\">\n  <div class=\"spl-stage dm-main\">\n    <div class=\"spl-pill\" aria-live=\"polite\"><div class=\"spl-in\"></div></div>\n  </div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Variant\"><button aria-pressed=\"true\" data-v=\"pill\">Pill</button><button aria-pressed=\"false\" data-v=\"bar\">Bar</button></div></div>\n</div>";
TPLS["toast"] = "<div class=\"tst dm\">\n  <div class=\"dm-main\"><div class=\"tst-slot\" aria-live=\"polite\"></div></div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"State\"><button aria-pressed=\"true\" data-v=\"ok\">Success</button><button aria-pressed=\"false\" data-v=\"err\">Error</button><button aria-pressed=\"false\" data-v=\"info\">Info</button><button aria-pressed=\"false\" data-v=\"load\">Loading</button></div></div>\n</div>";
TPLS["toast-stack"] = "<div class=\"tsk dm\">\n  <div class=\"dm-main\"><div class=\"tsk-stack\" aria-live=\"polite\"></div></div>\n  <div class=\"demo\"><button class=\"pill soft sm tsk-add\"><svg class=\"i s\"><use href=\"#v2i-bell\"/></svg>Send notification</button></div>\n</div>";
TPLS["context-meter"] = "<div class=\"ctm\" data-open=\"1\">\n  <button class=\"ctm-tg\" aria-expanded=\"true\" aria-label=\"Context\"><span class=\"ctm-ring\" aria-hidden=\"true\"><svg viewBox=\"0 0 20 20\"><circle class=\"tr\" cx=\"10\" cy=\"10\" r=\"7.5\"/><circle class=\"fl\" cx=\"10\" cy=\"10\" r=\"7.5\" pathLength=\"100\"/></svg></span><span><span class=\"ctm-pc num\">0%</span> of context used</span>{chev}</button>\n  <div class=\"ctm-pop panel\" role=\"region\" aria-label=\"What fills the context\">\n    <div class=\"ctm-ph\"><span>In context</span><span class=\"num\"><b class=\"ctm-tot\">0k</b> of 200k tokens</span></div>\n    <div class=\"ctm-bar\" aria-hidden=\"true\"></div>\n    <div class=\"ctm-leg\"></div>\n    <div class=\"ctm-msg\" aria-live=\"polite\"><span></span></div>\n    <div class=\"ctm-f\"><span class=\"ctm-hint\">Summarises older turns</span><button class=\"pill line sm ctm-go\">Compact</button></div>\n  </div>\n</div>";
TPLS["agent-run-timeline"] = "<div class=\"art panel\">\n  <div class=\"art-h\"><span class=\"art-hi\" aria-hidden=\"true\"></span><div class=\"art-hd\"><div class=\"art-t\">Run 4821, update the pricing page</div><div class=\"art-s muted num\">Starting</div></div><span class=\"art-tag tag\"><span class=\"spin\" aria-hidden=\"true\"></span>Running</span></div>\n  <div class=\"art-key num\" role=\"list\" aria-label=\"Time by kind of step\"></div>\n  <div class=\"art-grid\">\n    <div class=\"art-axis\" aria-hidden=\"true\"><span></span><div class=\"art-ticks\"></div><span></span></div>\n    <div class=\"art-past\" aria-hidden=\"true\"></div>\n    <div class=\"art-rows\"></div>\n    <div class=\"art-head\" aria-hidden=\"true\"><i></i><span class=\"art-now num\">0.0s</span></div>\n  </div>\n  <div class=\"art-f muted num\"></div>\n</div>";
TPLS["browser-session"] = "<div class=\"bws panel\">\n  <div class=\"bws-h\"><div class=\"bws-ht\"><b>Pricing research</b><span class=\"muted bws-st\" aria-live=\"polite\"></span></div><div class=\"bws-ctl\"><button class=\"ib bws-pause\" aria-label=\"Pause\" data-tip=\"Pause\">{pause}</button><button class=\"pill line sm bws-take\" aria-pressed=\"false\">Take over</button></div></div>\n  <div class=\"bws-win\"><div class=\"bws-bar\"><span class=\"bws-dots\" aria-hidden=\"true\"><i></i><i></i><i></i></span><div class=\"bws-url\">{search}<span></span></div></div><div class=\"bws-vp\"></div></div>\n  <ol class=\"bws-steps\" aria-label=\"Steps\"></ol>\n</div>";
TPLS["web-search"] = "<div class=\"wsx panel\">\n  <button class=\"wsx-h\" aria-expanded=\"true\"><span class=\"wsx-ic\"><span class=\"spin\"></span></span><span class=\"wsx-st shim\">Searching the web</span><span class=\"wsx-marks\" aria-hidden=\"true\"></span>{chev}</button>\n  <div class=\"fold wsx-fold\"><div><div class=\"wsx-list\"></div></div></div>\n  <div class=\"wsx-ans\"></div>\n  <p class=\"wsx-sr\" role=\"status\"></p>\n</div>";
TPLS["reasoning-trail"] = "<div class=\"rtr-dm dm\"><div class=\"dm-main\"><div class=\"rtr panel\">\n  <button class=\"rtr-h\" aria-expanded=\"true\">\n    <span class=\"think on rtr-mark\"><i></i><i></i><i></i><i></i></span>\n    <span class=\"rtr-title shim\">Reasoning</span><span class=\"rtr-time num muted\">0s</span>\n    <svg class=\"i xs rtr-chev\"><use href=\"#v2i-chev-d\"/></svg>\n  </button>\n  <div class=\"fold rtr-fold\"><div>\n    <div class=\"rtr-body\"></div>\n    <div class=\"fold rtr-ff shut\"><div><p class=\"rtr-f\"><span class=\"rtr-fk\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"m5 12.5 4.5 4.5L19 7.5\"/></svg></span><span class=\"rtr-fd\"></span><span class=\"rtr-fs\"></span></p></div></div>\n  </div></div>\n</div></div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"View\"><button aria-pressed=\"true\" data-v=\"plan\">Plan</button><button aria-pressed=\"false\" data-v=\"notes\">Notes</button><button aria-pressed=\"false\" data-v=\"sources\">Sources</button><button aria-pressed=\"false\" data-v=\"edits\">Edits</button></div></div>\n</div>";
TPLS["thinking"] = "<div class=\"tk\" data-open=\"1\">\n  <button class=\"tk-h\" aria-expanded=\"true\">\n    <span class=\"tk-mark\"><span class=\"think on\"><i></i><i></i><i></i><i></i></span></span>\n    <span class=\"tk-title shim\">Checking the pricing page</span><span class=\"tk-time num\">0s</span>\n    <svg class=\"i xs tk-chev\"><use href=\"#v2i-chev-d\"/></svg>\n  </button>\n  <div class=\"fold tk-fold\"><div><ol class=\"tk-list\" aria-live=\"polite\"></ol></div></div>\n</div>";
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
  const paint = () => {
    g.innerHTML = done ? `<span class="stl-ok">${I('ok')}</span>` : glyph();
    list.innerHTML = steps.map((s, i) => `<li class="${i < cur || done ? 'done' : i === cur ? 'run' : ''}"><span class="g">${i < cur || done ? `<span class="stl-ok">${I('check','xs')}</span>` : i === cur ? glyph() : '<span class="dot" style="color:var(--faint)"></span>'}</span>${i < cur || done ? s[1] : s[0]}</li>`).join('');
  };
  seg($('.seg2', r), v => { kind = v; paint(); });
  row.onclick = () => { const o = fold.classList.toggle('shut'); row.setAttribute('aria-expanded', !o); };
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
  const pick = x => { v = x; box.dataset.v = x; mk.innerHTML = MARKS[x]; show(steps[at], false); };
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
  const finish = () => { live = false; head.classList.add('tk-fin'); mark.innerHTML = clean ? I('check','xs') : I('ok'); enter(mark.firstElementChild); title.classList.remove('shim'); swap(title, '3 cards to fix, 2 changes planned'); };
  // the line under a step opens and then crossfades; what the step found writes itself in a word at a time, and a tip on it
  // holds the detail
  const words = t => t.split(' ').map((w, i, a) => `<span class="w" style="animation-delay:${i * 45}ms">${w}${i < a.length - 1 ? ' ' : ''}</span>`).join('');
  // (warn: the step is waiting out a problem; its amber lands with its words, 170ms on as swap() writes them)
  const note = (li, text, tip, found, warn = false) => { const res = $('.res', li), sp = res.firstElementChild; res.classList.add('on');
    clearTimeout(sp._tone); const set = () => sp.classList.toggle('warn', warn);
    if (found){ set(); sp._sw = null; sp.classList.remove('out'); sp.innerHTML = tip ? `<span data-tip="${tip}">${words(text)}</span>` : words(text); }
    else { const lag = !REDUCE && !!sp.textContent.trim() && sp.textContent !== text; swap(sp, text); if (lag) sp._tone = setTimeout(set, 170); else set(); } };
  const glyph = (li, g) => { const mk = $('.mk', li); mk.innerHTML = g; enter(mk.firstElementChild); };
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
  const P = [
    { k:'files', l:'Files', v:56.2, c:'var(--c1)', tip:'Pricing.fig export 31.9k, PricingCard.tsx 18.2k, tokens.css 6.1k' },
    { k:'tools', l:'Tool output', v:41.8, c:'var(--c2)', tip:'Contrast check 17.4k, Figma frames 15.6k, grid audit 8.8k' },
    { k:'chat', l:'Chat', v:32.1, c:'var(--c6)', tip:'48 turns with Maya Kim since 09:12' },
    { k:'sys', l:'Instructions', v:6.3, c:'var(--muted)', tip:'Studio guidelines 4.1k, pricing brief 2.2k' }
  ];
  const root = $('.ctm', r), tg = $('.ctm-tg', r), pop = $('.ctm-pop', r), arc = $('.ctm-ring .fl', r), pc = $('.ctm-pc', r), tot = $('.ctm-tot', r);
  const bar = $('.ctm-bar', r), leg = $('.ctm-leg', r), msg = $('.ctm-msg', r), go = $('.ctm-go', r), hint = $('.ctm-hint', r);
  bar.innerHTML = P.map(p => `<i data-k="${p.k}" style="--c:${p.c}"></i>`).join('');
  leg.innerHTML = P.map(p => `<div class="ctm-l" data-k="${p.k}" style="--c:${p.c}" data-tip="${p.tip}"><span class="sw"></span>${p.l}<span class="v num">0k</span></div>`).join('');
  const fmt = v => v.toFixed(1) + 'k', sum = () => P.reduce((t, p) => t + p.v, 0);
  // the numbers count to their new values; the bar, the ring and the percentage follow
  const shown = {}; let total = 0;
  function paint(ms = 900){
    const all = sum(), pct = Math.round(all / LIMIT * 100);
    P.forEach(p => { $(`i[data-k="${p.k}"]`, bar).style.width = (p.v / LIMIT * 100) + '%'; const el = $(`.ctm-l[data-k="${p.k}"] .v`, leg), from = shown[p.k] || 0; shown[p.k] = p.v; tween(from, p.v, ms, x => el.textContent = fmt(x)); });
    const from = total; total = all; tween(from, all, ms, x => { tot.textContent = fmt(x); pc.textContent = Math.round(x / LIMIT * 100) + '%'; });
    arc.style.strokeDasharray = pct + ' 100'; root.classList.toggle('hot', pct >= 85); tg.setAttribute('aria-label', `Context, ${pct}% used`);
  }
  // a warning is a warning notice with the filled sign, and Compact, the action that resolves it, takes the warning tint
  const WARN = '<svg class="ctm-wi" viewBox="0 0 24 24" aria-hidden="true"><path class="a" d="M12 3.6 2.6 19.9h18.8z"/><path class="b" d="M12 9.6v4.4M12 17v.01"/></svg>';
  const say = (text, tone) => { msg.className = 'ctm-msg on ' + tone; swap(msg.firstElementChild, `${tone === 'warn' ? WARN : I('ok','xs')}<span>${text}</span>`, true); go.classList.toggle('warn', tone === 'warn'); go.classList.toggle('line', tone !== 'warn'); };
  const hush = () => { msg.className = 'ctm-msg'; go.classList.remove('warn'); go.classList.add('line'); };
  // hovering a part lights its share of the bar
  c.on(leg, 'pointerover', e => { const l = e.target.closest('.ctm-l'); if (!l) return; bar.classList.add('hl'); $$('i', bar).forEach(i => i.classList.toggle('on', i.dataset.k === l.dataset.k)); });
  c.on(leg, 'pointerout', e => { if (!leg.contains(e.relatedTarget)) bar.classList.remove('hl'); });
  // the pill opens and shuts the panel; Escape shuts it while the pointer or the focus is on the meter
  const setOpen = (o, back) => { root.dataset.open = o ? '1' : '0'; tg.setAttribute('aria-expanded', o); pop.inert = !o; if (back) tg.focus({ preventScroll:true }); };
  tg.onclick = () => setOpen(root.dataset.open !== '1');
  c.on(document, 'keydown', e => { if (e.key === 'Escape' && root.dataset.open === '1' && (root.contains(document.activeElement) || root.matches(':hover'))) setOpen(false, root.contains(document.activeElement)); });
  // new tool output lands and takes the context close to its limit
  function arrive(){ P[1].v = +(P[1].v + 38.5).toFixed(1); paint(700); say(`${Math.round(sum() / LIMIT * 100)}% full. Older turns start to drop at 200k`, 'warn'); }
  // Compact turns older turns into a summary and trims old tool output; Undo puts them back
  const before = {}; let state = 'full';
  const run = html('<span class="ctm-run" role="status" hidden><span class="spin"></span><span class="shim">Compacting…</span></span>'); go.after(run);
  // the button is as wide as its words and eases to its new width when they change (owner, 18 Nov)
  const label = h => { const w0 = go.getBoundingClientRect().width; go.innerHTML = h; const w1 = go.getBoundingClientRect().width;
    if (!REDUCE && w0 && Math.abs(w1 - w0) > .5) go.animate([{ width:w0 + 'px' }, { width:w1 + 'px' }], { duration:340, easing:'cubic-bezier(.23,1,.32,1)' }); };
  go.onclick = () => c.run(async () => {
    if (go._busy) return; go._busy = true;
    if (state === 'full'){
      P.forEach(p => before[p.k] = p.v); const was = sum();
      const had = document.activeElement === go; go.hidden = true; run.hidden = false;
      swap(hint, '<span class="shim">Summarising 48 turns</span>', true); await c.wait(1000);
      P[2].v = 4.6; P[1].v = +(P[1].v - 13.7).toFixed(1); paint(1100);
      say(`Freed ${fmt(was - sum())} tokens. 9 decisions kept`, 'ok'); swap(hint, 'Older turns are now a summary');
      c.later(REDUCE ? 0 : 170, () => { run.hidden = true; go.innerHTML = 'Undo'; go.hidden = false; enter(go); if (had) go.focus({ preventScroll:true }); }); state = 'compact';
    } else {
      P.forEach(p => p.v = before[p.k]); paint(700); hush(); swap(hint, 'Summarises older turns'); c.later(REDUCE ? 0 : 170, () => label('Compact')); state = 'full';
    }
    go._busy = false;
  });
  // it opens on its real numbers; they only count when something changes
  paint(1);
  // the preview's story: read what fills it, new tool output pushes it close to the limit, compact, then shut it
  if (r === c.st) c.story(async s => {
    await s.beat(3);
    await s.point($('.ctm-l[data-k="tools"]', leg)); await s.beat(3);
    await s.point($('.ctm-l[data-k="files"]', leg)); await s.beat(3);
    s.away(); await s.beat(1);
    arrive(); await s.beat(4);
    await s.tap(go); s.away(); await s.until(() => state === 'compact'); await s.beat(4);
    await s.tap(tg); s.away(); await s.beat(2);
  });
});
/* ---------- Browser session ---------- */
DM.def('browser-session', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{pause}', I('pause')).replace('{search}', I('search','xs'));
  const root = $('.bws', r), stEl = $('.bws-st', r), vp = $('.bws-vp', r), url = $('.bws-url', r), list = $('.bws-steps', r);
  const pauseB = $('.bws-pause', r), takeB = $('.bws-take', r);
  // the steps the agent planned, and the pages it passes through, drawn small: a search, the site, its pricing page
  const S = [{ t:'Search "northwind pricing"' }, { t:'Open northwind.app' }, { t:'Click "Pricing"' }, { t:'Read the plans table' }, { t:'Extract prices' }];
  const NAV = on => `<div class="bws-nav"><b>Northwind</b><span>Product</span><span data-k="pricing"${on ? ' class="on"' : ''}>Pricing</span><span>Docs</span></div>`;
  const PAGES = {
    search:`<div class="bws-pg"><div class="bws-q">${I('search','xs')}<span>northwind pricing</span></div>
      <div class="bws-res"><b data-k="site">Northwind · Docs your team reads</b><span>northwind.app</span></div>
      <div class="bws-res"><b>Northwind review: is it worth it?</b><span>softwarenotes.io</span></div>
      <div class="bws-res"><b>Northwind alternatives</b><span>stackcompare.com</span></div></div>`,
    home:`<div class="bws-pg">${NAV(false)}<div class="bws-hd">Docs your team actually reads</div><span class="bws-ln" style="width:92%"></span><span class="bws-ln" style="width:68%"></span><span class="bws-cta">Start free</span></div>`,
    pricing:`<div class="bws-pg">${NAV(true)}<div class="bws-hd">Plans and pricing</div><span class="bws-ln" style="width:78%"></span>
      <div class="bws-tb"><div><span>Plan</span><span>Per seat, monthly</span></div><div><span>Starter</span><span class="num">$8</span></div><div><span>Team</span><span class="num">$16</span></div><div><span>Business</span><span class="num">$32</span></div></div><span class="bws-ln" style="width:64%"></span><span class="bws-ln" style="width:40%"></span></div>`
  };
  const G = { queued:'<span class="dot"></span>', run:'<span class="spin"></span>', wait:I('alert','xs'), done:I('ok','xs') };
  S.forEach(x => { x.el = html(`<li class="bws-s queued"><span class="g">${G.queued}</span><span class="bws-t"><span>${x.t}</span><span class="d" hidden></span></span></li>`); list.appendChild(x.el); });
  function step(i, s, d){
    const x = S[i], de = $('.d', x.el); if (x.s === s && de.textContent === (d || '')) return;
    x.s = s; x.el.className = 'bws-s ' + s; const g = $('.g', x.el); g.innerHTML = G[s]; enter(g);
    if (s === 'run' || s === 'wait') x.el.setAttribute('aria-current', 'step'); else x.el.removeAttribute('aria-current');
    if (!d){ de.hidden = true; de.textContent = ''; } else if (de.hidden){ de.textContent = d; de.hidden = false; enter(de); } else swap(de, d);
  }
  // the page's cookie banner waits below the fold of the viewport, and the agent's own pointer above it
  const ck = html('<div class="bws-ck"><span>This site uses cookies</span><button type="button">Reject all</button><button type="button">Accept all</button></div>');
  const cur = html('<span class="bws-cur" aria-hidden="true"><svg viewBox="0 0 14 14"><path d="M2 1.5l9.5 5-4.2 1.2-2 4.3z"/></svg></span>');
  vp.append(ck, cur);
  function page(k, u){
    const old = $('.bws-pg', vp), pg = html(PAGES[k]); vp.insertBefore(pg, ck); if (old) old.remove(); enter(pg);
    $('svg', url).outerHTML = I(k === 'search' ? 'search' : 'lock', 'xs'); swap($('span', url), u);
  }
  // the person can pause the agent or take the page over; either holds it wherever it is, and it waits for them when
  // the page blocks it
  let paused = false, you = false, blocked = false, finished = false, secs = 0, unblock = null;
  const held = () => paused || you;
  async function act(ms){ for (let left = ms; left > 0;){ await c.wait(100); if (!held()) left -= 100; } }
  async function aim(el){
    const v = vp.getBoundingClientRect(), b = el.getBoundingClientRect(), x = b.left - v.left + Math.min(b.width * .5, 36), y = b.top - v.top + b.height * .6;
    if (!cur.classList.contains('on')){ cur.style.transition = 'none'; cur.style.transform = `translate(${x + 30}px,${y + 40}px)`; void cur.offsetWidth; cur.style.transition = ''; cur.classList.add('on'); }
    cur.style.transform = `translate(${x}px,${y}px)`; el.classList.add('aim');
    await act(800); cur.classList.add('down'); await act(200); cur.classList.remove('down'); el.classList.remove('aim');
  }
  const clock = () => Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');
  stEl.innerHTML = '<span class="m">Browsing</span> · <span class="num ck">0:00</span>';
  c.every(1000, () => { if (!held() && !blocked && !finished){ secs++; $('.ck', stEl).textContent = clock(); } });
  function update(){
    root.classList.toggle('you', you); root.classList.toggle('paused', paused && !you);
    swap($('.m', stEl), finished ? 'Done' : you ? 'You have control' : paused ? 'Paused' : blocked ? 'Needs you' : 'Browsing');
    const pl = paused ? 'Resume' : 'Pause'; pauseB.innerHTML = I(paused ? 'play' : 'pause'); pauseB.setAttribute('aria-label', pl); pauseB.dataset.tip = pl;
    pauseB.disabled = you || finished; takeB.disabled = finished;
    takeB.setAttribute('aria-pressed', you); takeB.textContent = you ? 'Hand back' : 'Take over';
    // while the person has the page, its buttons are theirs and the agent's pointer steps aside
    vp.inert = !you; cur.style.visibility = you ? 'hidden' : '';
    const ask = $('.bws-ask', r);
    if (blocked && !you && !ask) showAsk(); else if ((!blocked || you) && ask) ask.remove();
    if (blocked) step(3, 'wait', you ? 'Close the banner, then hand back' : 'A cookie banner covers the table');
  }
  function showAsk(){
    const ask = html('<div class="bws-ask"><button class="pill primary sm bws-allow">Allow closing it</button><button class="pill soft sm bws-you">Take over</button></div>');
    $('.bws-t', S[3].el).appendChild(ask); enter(ask);
    $('.bws-allow', ask).onclick = () => c.run(async () => {
      // the agent closes it the privacy-friendly way, with Reject all
      blocked = false; update(); step(3, 'run', 'Closing the banner');
      await aim($('button', ck)); ck.classList.remove('on'); unblock();
    });
    $('.bws-you', ask).onclick = () => takeB.click();
  }
  pauseB.onclick = () => { paused = !paused; update(); };
  takeB.onclick = () => { you = !you; if (you) paused = false; update(); };
  // with the page in hand, either banner button closes it
  $$('button', ck).forEach(b => b.onclick = () => { if (!you || !blocked) return; ck.classList.remove('on'); blocked = false; update(); unblock(); });
  // the run: search, open the site, go to pricing and scroll to the table, where a cookie banner covers it and the agent
  // asks before touching it. Once it is gone, it reads the table and takes the three prices
  c.run(async () => {
    page('search', 'northwind pricing'); step(0, 'run');
    await act(1800); step(0, 'done'); step(1, 'run');
    await aim($('[data-k="site"]', vp)); page('home', 'northwind.app');
    await act(1200); step(1, 'done'); step(2, 'run');
    await aim($('[data-k="pricing"]', vp)); page('pricing', 'northwind.app/pricing');
    await act(1000); step(2, 'done'); step(3, 'run');
    await act(600);
    const pg = $('.bws-pg', vp); pg.style.transform = `translateY(${-Math.max(0, Math.min(pg.offsetHeight - vp.clientHeight, $('.bws-tb', pg).offsetTop - 8))}px)`;
    await act(1200); ck.classList.add('on'); await act(500);
    blocked = true; update();
    await new Promise(res => { unblock = res; });
    step(3, 'run');
    await act(1400); step(3, 'done', '3 plans, priced per seat'); step(4, 'run', '0 of 3 prices');
    const cells = $$('.bws-tb .num', vp);
    for (let i = 0; i < cells.length; i++){ await aim(cells[i]); cells[i].classList.add('hit'); step(4, 'run', `${i + 1} of 3 prices`); }
    await act(500); cur.classList.remove('on');
    finished = true; step(4, 'done', '$8, $16 and $32 per seat'); update();
    const sm = html(`<div class="bws-sum">${I('ok','xs')}<span>Done · 3 prices saved to Pricing research</span></div>`); root.appendChild(sm); enter(sm);
  });
  update();
  // the preview's story: the agent stops at the cookie banner, the person allows it to close it, and it finishes
  c.story(async s => {
    await s.until(() => $('.bws-allow', r)); await s.beat(3);
    await s.tap($('.bws-allow', r)); s.away();
    await s.until(() => finished); await s.beat(3);
  });
});
/* ---------- Toast ---------- */
DM.def('toast', (r, c) => {
  const slot = $('.tst-slot', r);
  // each state's icon, colours and words; its tone (data-tone) is what Clean colours: success green, error red, the rest grey
  const V = {
    ok:{ g:'ok', tone:'success', col:'var(--ok)', bg:'var(--ok-bg)', b:'Changes applied', s:'4 files updated in PricingCard', act:'<button class="pill ghost sm tst-undo">Undo</button>' },
    err:{ g:'alert', tone:'error', col:'var(--bad)', bg:'var(--bad-bg)', b:'Could not push to main', s:'The branch is protected', act:'<button class="pill ghost sm tst-retry">Retry</button>' },
    info:{ g:'info', tone:'info', col:'var(--pb)', bg:'var(--pb-bg)', b:'Preview is ready', s:'pricing-spacing.preview.app', act:'<button class="pill ghost sm">Open</button>' },
    load:{ g:'load', tone:'loading', col:'var(--fg)', bg:'var(--chip)', b:'Deploying preview', s:'Building 3 pages', act:'' }
  };
  let cur = null; const agent = ctl(); c.offs.push(() => agent.stop());
  // a pressed button never goes blank and keeps no room for what it turns into: it shows its new content and eases from its
  // old width to its new one (owner, 19 Nov)
  const relabel = (btn, inner) => { const w0 = btn.offsetWidth; btn.innerHTML = inner; const w1 = btn.offsetWidth, cs = getComputedStyle(btn);
    if (!REDUCE && Math.abs(w1 - w0) > .5) btn.animate([{ width:w0 + 'px' }, { width:w1 + 'px' }], { duration:(parseFloat(cs.getPropertyValue('--t')) || .34) * 1000, easing:cs.getPropertyValue('--ease').trim() || 'ease' }); };
  let show = function(k){
    const v = V[k];
    const t = html(`<div class="tst-t tst-in" role="status"><span class="g" data-tone="${v.tone}" style="color:${v.col};background:${v.bg}">${k === 'load' ? '<span class="spin"></span>' : I(v.g)}</span><div class="tx"><b${k === 'load' ? ' class="shim"' : ''}>${v.b}</b><span>${v.s}</span></div><div class="acts">${v.act}<button class="ib" aria-label="Dismiss" data-tip="Dismiss">${I('x')}</button></div><span class="life"></span></div>`);
    if (cur){ const old = cur; old.classList.add('tst-out'); setTimeout(() => old.remove(), 300); }
    slot.appendChild(t); cur = t;
    // words that run past two lines beside the action give it a row of its own under them
    const lines = new Set(), tw = document.createTreeWalker($('.tx', t), NodeFilter.SHOW_TEXT);
    for (let n; (n = tw.nextNode());){ const g = document.createRange(); g.selectNodeContents(n); [...g.getClientRects()].forEach(b => b.width > 1 && lines.add(Math.round(b.top / 4))); }
    if (v.act && lines.size > 2) t.classList.add('wrap');
    $('.ib', t).onclick = () => { t.classList.add('tst-out'); setTimeout(() => t.remove(), 300); cur = null; };
    const u = $('.tst-undo', t); if (u) u.onclick = () => { $('.tx b', t).textContent = 'Changes undone'; swap($('.tx span', t), 'PricingCard is back as it was');
      relabel(u, I('check')); u.classList.add('done'); u.setAttribute('aria-label', 'Undone'); u.setAttribute('aria-disabled', 'true'); u.onclick = null; };
    const rt = $('.tst-retry', t); if (rt) rt.onclick = () => { relabel(rt, '<span class="spin"></span>'); rt.setAttribute('aria-busy', 'true'); rt.onclick = null; setTimeout(() => { if (t.isConnected) show('ok'); }, 1200); };
    // a loading toast keeps loading under a resting mouse, as a loader does (DM.PLAYS): the deploy finishes on its own clock,
    // which nothing holds
    if (k === 'load') agent.later(2600, () => { if (cur === t) show('info'); });
    if (k === 'ok' || k === 'info'){
      // it times out like a real toast: hovering holds it, and when it runs out it leaves and the same one comes back (until
      // you take over: then it stays gone until you pick one). A toast with an action stays 10 seconds, long enough to reach it
      const life = $('.life', t).animate([{ transform:'scaleX(1)' }, { transform:'scaleX(0)' }], { duration:10000, fill:'forwards' });
      t.addEventListener('pointerenter', () => life.pause()); t.addEventListener('pointerleave', () => life.play());
      life.finished.then(() => { if (cur !== t || c.dead) return; t.classList.add('tst-out'); cur = null; setTimeout(() => t.remove(), 300); c.auto(1100, () => { if (!cur) show(k); }); }).catch(() => {});
    }
  }
  const sg = $('.seg2', r), knob = seg(sg, v => show(v));
  const sync = k => { $$('button', sg).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === k)); knob.place(); };
  const show0 = show; show = k => { sync(k); show0(k); };
  // a state picked before this first one lands stays
  c.later(400, () => { if (!cur) show('ok'); });
});
/* ---------- Toast stack ---------- */
DM.def('toast-stack', (r, c) => {
  const stack = $('.tsk-stack', r);
  // each with its tone (data-tone): Clean colours only the status ones, ok and warn, and shows the rest grey
  const pool = [
    ['ok','var(--ok)','var(--ok-bg)','Tests passed','42 of 42 in 38s','ok'],
    ['pr','var(--merge)','var(--merge-bg)','PR #412 is ready','Use shared spacing tokens','merge'],
    ['figma','var(--pl)','var(--pl-bg)','Frames synced','6 frames from Pricing.fig','purple'],
    ['warn','var(--warn)','var(--warn-bg)','Budget at 80%','1,600 of 2,000 credits','warn'],
    ['spark','var(--pb)','var(--pb-bg)','Draft written','Launch email, 2 subject lines','blue']
  ];
  // the stack fans out under the pointer, or while the focus is in it; a toast that can't be seen can't take the focus
  let items = [], n = 0, hover = false, focused = false;
  function layout(){
    const fan = hover || focused; let y = 0;
    // as a new toast starts to rise into place, the toasts it covers lose their words at once (Clean shows them through no
    // blur): .tsk-under, until the stack fans out
    const front = items[items.length - 1]; if (front && front._new){ front._new = false; if (!fan) items.forEach(it => it !== front && it.classList.add('tsk-under')); }
    const hs = items.map(it => it.offsetHeight);
    stack.style.setProperty('--fanh', (hs.slice(-4).reduce((a, b) => a + b + 8, 0) - 8 || 96) + 'px');
    // the deck's own height: the front toast and the two that peek out above it (Clean sizes the stack to it)
    stack.style.setProperty('--deckh', Math.ceil(items.slice(-3).reverse().reduce((m, it, k) => Math.max(m, it.offsetHeight * (1 - k * .05) + k * 10), 0)) + 'px');
    stack.classList.toggle('fan', fan);
    items.slice().reverse().forEach((it, i) => {
      if (fan){ it.style.transform = `translateY(${-y}px)`; it.style.opacity = i > 3 ? 0 : 1; it.style.filter = 'none'; if (i < 3) y += hs[items.length - 1 - i] + 8; }
      else { const k = Math.min(i, 3); it.style.transform = `translateY(${-k * 10}px) scale(${1 - k * .05})`; it.style.opacity = i > 2 ? 0 : 1 - k * .15; it.style.filter = i ? 'blur(.3px)' : 'none'; }
      it.style.zIndex = 100 - i; it.inert = fan ? i > 3 : i > 0; if (fan || !i) it.classList.remove('tsk-under');
    });
  }
  function add(){
    const p = pool[n++ % pool.length];
    const el = html(`<div class="tsk-c"><span class="g" data-tone="${p[5]}" style="color:${p[1]};background:${p[2]}">${I(p[0])}</span><div class="tx"><b>${p[3]}</b><span>${p[4]}</span></div><span class="t">now</span><button class="ib" aria-label="Dismiss" data-tip="Dismiss">${I('x')}</button></div>`);
    el.style.transform = 'translateY(24px) scale(.96)'; el.style.opacity = 0; el.style.filter = 'blur(6px)';
    el._new = true;
    stack.appendChild(el); items.push(el);
    $('.ib', el).onclick = () => { items = items.filter(x => x !== el); el.style.opacity = 0; el.style.transform += ' translateX(30px)'; setTimeout(() => el.remove(), 400); layout(); };
    if (items.length > 6){ const old = items.shift(); old.remove(); }
    requestAnimationFrame(() => requestAnimationFrame(layout));
    items.forEach((it, i) => { if (i < items.length - 1){ const t = $('.t', it); t.textContent = (items.length - 1 - i) * 2 + 'm'; } });
  }
  c.on(stack, 'pointerenter', () => { hover = true; layout(); });
  c.on(stack, 'pointerleave', () => { hover = false; layout(); });
  c.on(stack, 'focusin', () => { if (!focused){ focused = true; layout(); } });
  c.on(stack, 'focusout', e => { if (!stack.contains(e.relatedTarget)){ focused = false; layout(); } });
  $('.tsk-add', r).onclick = add;
  c.run(async () => {
    for (let i = 0; i < 3; i++){ await c.wait(i ? 700 : 400); add(); }
    // then a new one now and then, held back while the stack is fanned out under the pointer, until you take over
    for (;;){ await c.step(3800); if (!hover && !focused) add(); }
  });
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
      const el = html(`<div class="wsx-q" data-k="${k}"><button class="wsx-qh${q.n ? '' : ' empty'}" aria-expanded="false">${I('search','xs')}<span class="t shim">${q.q}</span><span class="n shim">Searching</span><span class="tm num"></span>${I('chev-r','xs')}</button>${q.from != null ? `<span class="wsx-rw">${I('refresh','xs')}Asked again in other words</span>` : ''}${q.p ? '<div class="fold shut"><div><ul class="wsx-rs"></ul></div></div>' : ''}</div>`);
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
    done = true; ic.innerHTML = I('globe','xs'); st.classList.remove('shim');
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