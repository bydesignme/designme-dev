/* Agent builder, lab: the library's component (soft-2/index.html, data-c="agent-builder") as it is, with its test run
   drawn as a flow. Pressing Test runs a sample email through the agent: the email (the trigger, the run's source) connects
   down to the agent, and the agent to each step it takes, what it reads and what it does in each tool. Each connector draws
   in before the step it leads to appears; the flow band runs along them into whatever is executing; marks swap from queued
   to running to a tick, or a cross when a tool is only allowed to Read. Lines come from lab/flow (DMFlow): DMFlow.route()
   corners, recomputed every frame from where the marks are, ending 1px under them.
   The page: ?style=bp|soft&theme=light|dark; ?fail plays the story with Linear set to Read, so the test fails; ?rec does not
   start on its own. window.LAB.start() plays it; window.LAB_DONE turns true when the story ends. */
const REC = /[?&]rec\b/.test(location.search), FAIL = /[?&]fail\b/.test(location.search);
// one frame clock for the page; each mounted builder draws in it while it is mounted
const abxDraws = new Set();
DMFlow.loop((T, dt) => abxDraws.forEach(f => f(T, dt)));
let abxGo = !REC;

DM.def('agent-builder', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{(spark|alert|play)\}/g, (m, k) => I(k, 'xs'));
  const $r = s => $(s, r);
  const root = $r('.abx'), desc = $r('#abx-desc'), go = $r('.abx-go'), name = $r('.abx-name'), purp = $r('.abx-purp'), ins = $r('.abx-ta'), sel = $r('.abx-sel'), err = $r('.abx-err');
  const tools = $r('.abx-tools'), kn = $r('.abx-kn'), trd = $r('.abx-trd'), st = $r('.abx-st'), test = $r('.abx-test'), save = $r('.abx-save'), pub = $r('.abx-pub'), log = $r('.abx-log'), cs = $r('.abx-cs'), sr = $r('.abx-sr');
  const S = k => $(`.abx-s[data-s="${k}"]`, r);
  // Dotto, the agent's avatar: a dark LED screen in a bezel of the agent's colour, a 5 by 5 grid of dots drawing its eyes and
  // smile. Each one carries only the outline in use; its colour is --m on the builder, so every Dotto in it changes at once
  const SHAPES = { circle:['M4 32A28 28 0 1 0 60 32A28 28 0 1 0 4 32Z', 'M10.5 32A21.5 21.5 0 1 0 53.5 32A21.5 21.5 0 1 0 10.5 32Z'], squircle:['M60 32C60 58.5 58.5 60 32 60S4 58.5 4 32 5.5 4 32 4 60 5.5 60 32Z', 'M53.5 32C53.5 52.3 52.3 53.5 32 53.5S10.5 52.3 10.5 32 11.7 10.5 32 10.5 53.5 11.7 53.5 32Z'] };
  const SHAPE_N = { circle:'Circle', squircle:'Squircle' };
  const COLS = [['accent', 'Accent', 'var(--accent)'], ['blue', 'Blue', '#116ff8'], ['violet', 'Violet', '#7c4dff'], ['orange', 'Orange', '#f76700'], ['green', 'Green', '#00a876']];
  // it starts as an accent squircle (owner, 4 Nov: squircle and circle only)
  const look = { color:'accent', shape:'squircle' };
  let mood = 'idle';
  const dots = (cls, cells) => cells.map(([x, y]) => `<circle${cls ? ` class="${cls}"` : ''} cx="${19 + x * 6.5}" cy="${19 + y * 6.5}" r="${cls ? 2.75 : 1.3}"/>`).join('');
  const GRID = [...Array(25)].map((_, i) => [i % 5, i / 5 | 0]);
  const mascot = () => { const [bz, sc] = SHAPES[look.shape];
    return `<svg class="abx-mascot" viewBox="0 0 64 64" data-shape="${look.shape}" data-state="${mood}" aria-hidden="true" focusable="false"><path class="bz" d="${bz}"/><path class="sc" d="${sc}"/>`
      + `<g class="dg">${dots('', GRID)}</g><g class="lk">${dots('on tp', [[1, 1], [3, 1]])}${dots('on', [[1, 2], [3, 2]])}</g>`
      + `<g class="id">${dots('on', [[0, 3], [4, 3], [1, 4], [2, 4], [3, 4]])}</g><g class="th">${dots('on ld l1', [[1, 4]])}${dots('on ld l2', [[2, 4]])}${dots('on ld l3', [[3, 4]])}</g></svg>`; };
  const av = $r('.abx-av'), sw = $r('.abx-sw'), shp = $r('.abx-shp');
  av.innerHTML = mascot(); av.setAttribute('role', 'img');
  $r('.abx-ch').insertAdjacentHTML('afterbegin', mascot());
  // a change of colour, shape or mood reaches every Dotto in the builder: the avatar, the test chat's header and replies, Live
  function paint(){
    root.style.setProperty('--m', COLS.find(x => x[0] === look.color)[2]);
    const [bz, sc] = SHAPES[look.shape];
    $$('.abx-mascot', r).forEach(m => { m.dataset.shape = look.shape; m.dataset.state = mood; $('.bz', m).setAttribute('d', bz); $('.sc', m).setAttribute('d', sc); });
    av.setAttribute('aria-label', `Avatar: ${COLS.find(x => x[0] === look.color)[1]}, ${SHAPE_N[look.shape].toLowerCase()}`);
  }
  // the pickers are radio groups: a click picks, the arrow keys move and pick (and wrap), Home and End go to the ends, and only
  // the picked one is in the tab order
  function radios(g, on){
    const all = () => $$('[role="radio"]', g), shown = () => all().filter(b => !b.hidden);
    const pick = (v, by) => { const t = all().find(b => b.dataset.v === v); if (!t || t.hidden) v = shown()[0].dataset.v;
      all().forEach(b => { const y = b.dataset.v === v; b.setAttribute('aria-checked', String(y)); b.tabIndex = y ? 0 : -1; }); on(v, by); };
    c.on(g, 'click', e => { const b = e.target.closest('[role="radio"]'); if (b) pick(b.dataset.v, true); });
    c.on(g, 'keydown', e => { const l = shown(), i = l.indexOf(document.activeElement), d = { ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1 }[e.key];
      const to = d ? l[(i + d + l.length) % l.length] : e.key === 'Home' ? l[0] : e.key === 'End' ? l[l.length - 1] : null;
      if (to){ e.preventDefault(); to.focus(); pick(to.dataset.v, true); } });
    return v => pick(v, false);
  }
  sw.innerHTML = COLS.map(([v, n, x]) => `<button role="radio" aria-checked="false" tabindex="-1" aria-label="${n}" data-tip="${n}" data-v="${v}" style="--s:${x}"></button>`).join('');
  // a colour the accent already is shows once, as the accent
  const ink = v => { const t = document.createElement('i'); t.hidden = true; t.style.color = v; root.appendChild(t); const x = getComputedStyle(t).color; t.remove(); return x; };
  const acc = ink('var(--accent)');
  COLS.slice(1).forEach(([v, , x]) => { if (ink(x) === acc) $(`[data-v="${v}"]`, sw).hidden = true; });
  shp.innerHTML = Object.entries(SHAPE_N).map(([v, n]) => `<button role="radio" aria-checked="false" tabindex="-1" aria-label="${n}" data-tip="${n}" data-v="${v}"><svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="${SHAPES[v][0]}"/></svg></button>`).join('');
  // the shape switch slides its knob like the other switches; its first placing is instant
  const knob = document.createElement('span'); knob.className = 'knob'; shp.prepend(knob);
  const place = () => { const b = $('[aria-checked="true"]', shp); if (b){ knob.style.left = b.offsetLeft + 'px'; knob.style.width = b.offsetWidth + 'px'; } };
  const setColor = radios(sw, (v, by) => { look.color = v; paint(); if (by) edited('id'); });
  const setShape = radios(shp, (v, by) => { look.shape = v; place(); paint(); if (by) edited('id'); });
  setColor(look.color); setShape(look.shape);
  requestAnimationFrame(() => { knob.style.transition = 'none'; place(); void knob.offsetWidth; knob.style.transition = ''; });
  new ResizeObserver(place).observe(shp);
  const think = on => { mood = on ? 'thinking' : 'idle'; paint(); };
  // tools, each with what the agent may do there: read, ask first, or act
  const T = [['gmail', 'Gmail'], ['linear', 'Linear'], ['slack', 'Slack']];
  tools.innerHTML = T.map(([k, n]) => `<div class="abx-tl" data-t="${k}">${BRAND[k]}<span class="n">${n}</span><div class="seg2" role="group" aria-label="${n}: what it may do"><button aria-pressed="true" data-v="read">Read</button><button aria-pressed="false" data-v="ask">Ask</button><button aria-pressed="false" data-v="act">Act</button></div></div>`).join('');
  const segs = {}; $$('.abx-tl', tools).forEach(t => segs[t.dataset.t] = seg($('.seg2', t), () => edited('tools')));
  const setSeg = (el, v) => { const b = $(`button[data-v="${v}"]`, el); $$('button', el).forEach(x => x.setAttribute('aria-pressed', x === b)); };
  const TRIG = { chat:'When someone messages it', sched:'Every weekday at 9:00', event:'When an email arrives at support@' };
  seg($r('.abx-trs'), v => { swap(trd, TRIG[v]); edited('trig'); });
  seg($r('.abx-eff'), () => edited('model'));
  kn.innerHTML = '<span class="muted" style="font-size:12px">Nothing yet</span>';
  // what the person has changed since it was drafted: the Drafted tag goes, and the form has unsaved changes
  const tag = k => $('.abx-dt', S(k));
  let state = 'empty';
  const status = (t, cls) => { st.innerHTML = t; st.className = 'abx-st ' + (cls || 'muted'); };
  function edited(k){ const t = tag(k); if (t) t.remove(); if (state !== 'empty'){ state = 'dirty'; status('Unsaved changes'); } valid(); }
  [[name, 'id'], [purp, 'id'], [ins, 'ins'], [sel, 'model']].forEach(([el, k]) => c.on(el, 'input', () => edited(k)));
  c.on(sel, 'change', () => edited('model'));
  // a name is needed to save or publish
  err.id = 'abx-err-' + Math.random().toString(36).slice(2, 8); name.setAttribute('aria-describedby', err.id);
  function valid(){ const ok = !!name.value.trim() || state === 'empty'; err.hidden = ok; name.setAttribute('aria-invalid', String(!ok)); save.disabled = !ok || state === 'empty' || state === 'saved' || state === 'live'; pub.disabled = !ok || state === 'empty' || state === 'live'; return ok; }
  valid(); test.disabled = true;
  // drafting: the agent fills each section in turn from the one sentence, and marks it Drafted
  const D = {
    // it names the agent, then picks its colour and its shape
    id:async () => { name.value = 'Support triage'; purp.value = 'Sorts incoming support emails and routes them to the right team'; await c.wait(350); setColor('violet'); await c.wait(350); setShape('circle'); },
    ins:() => { ins.value = 'Read each new email. Tag it Billing, Bug or How-to, set its priority, and route it to that team. Draft a reply for billing refunds but never send money without asking.'; },
    model:() => { sel.value = 'Sonnet 5'; setSeg($r('.abx-eff'), 'med'); },
    tools:() => { setSeg($('.seg2', $('[data-t="gmail"]', tools)), 'act'); setSeg($('.seg2', $('[data-t="linear"]', tools)), 'act'); setSeg($('.seg2', $('[data-t="slack"]', tools)), 'ask'); },
    know:() => { kn.innerHTML = `<span class="tag">${I('file-text','xs')}Refund policy.pdf</span><span class="tag">${I('globe','xs')}Help centre</span><span class="tag">${I('table','xs')}Team routing.csv</span>`; },
    trig:() => { $$('.abx-trs button', r).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === 'event')); $r('.abx-trs').dispatchEvent(new Event('resize')); swap(trd, TRIG.event); }
  };
  let drafting = false;
  go.onclick = () => c.run(async () => {
    if (drafting) return; if (!desc.value.trim()){ desc.focus(); return; }
    drafting = true; go.disabled = true; go.innerHTML = '<span class="spin"></span>Drafting'; sr.textContent = 'Drafting the agent';
    const keys = Object.keys(D); keys.forEach(k => S(k).classList.add('wait'));
    for (const k of keys){ const s = S(k); s.classList.remove('wait'); s.classList.add('busy'); await c.wait(550); await D[k](); s.classList.remove('busy');
      if (!tag(k)){ const t = html(`<span class="abx-dt">${I('spark','xs')}Drafted</span>`); $('.abx-sh', s).insertBefore(t, $('.abx-sh .muted', s)); enter(t); } }
    // the trigger switch was redrawn from code, so its knob is placed again
    const tk = $('.abx-trs .knob', r), tb = $('.abx-trs [aria-pressed="true"]', r); if (tk && tb){ tk.style.left = tb.offsetLeft + 'px'; tk.style.width = tb.offsetWidth + 'px'; }
    $$('.abx-tl .seg2', tools).forEach(g => { const k = $('.knob', g), b = $('[aria-pressed="true"]', g); if (k && b){ k.style.left = b.offsetLeft + 'px'; k.style.width = b.offsetWidth + 'px'; } });
    const ek = $('.abx-eff .knob', r), eb = $('.abx-eff [aria-pressed="true"]', r); if (ek && eb){ ek.style.left = eb.offsetLeft + 'px'; ek.style.width = eb.offsetWidth + 'px'; }
    state = 'dirty'; status('Drafted, not saved'); go.disabled = false; go.className = 'pill line sm abx-go'; go.innerHTML = `${I('refresh','xs')}Draft again`; test.disabled = false; drafting = false; valid(); sr.textContent = 'Drafted. Check the fields, then test it';
  });

  // ---------- the test run, drawn as a flow ----------
  // the email is the run's source; the agent hangs under it, and each step the agent takes hangs off the agent's line.
  // A connector draws in before the step it leads to appears, one at a time; the band runs along them to what is executing
  const perm = k => { const b = $(`[data-t="${k}"] .seg2 [aria-pressed="true"]`, tools); return b ? b.dataset.v : 'read'; };
  const DUR = .2;
  let F = null, testing = false;
  function node(cls, inner, s){
    const el = html(`<div class="abx-n ${cls} ${s}"><span class="dmf-g" aria-hidden="true"></span>${inner}</div>`);
    F.run.appendChild(el); const n = { el, g:$('.dmf-g', el), s, conns:[], shown:false }; DMFlow.mark(n.g, s); return n;
  }
  const conn = (group = 'lines') => { const l = DMFlow.line(F.L, group); return { l, rv:0 }; };
  // a node's state: its mark swaps at once, its line of text swaps in place and shimmers while it runs
  function setS(n, s, t){
    n.s = s; n.el.classList.remove('queued', 'run', 'done', 'fail', 'src'); n.el.classList.add(s); DMFlow.mark(n.g, s);
    const sp = $('.abx-nt .s', n.el); if (!sp) return;
    if (t != null) DMFlow.swap(sp, t);
    sp.classList.toggle('dmf-shim', s === 'run');
  }
  // a node appears once the line to it is drawn: its mark at once, where the line already ends, and the rest rising in
  function show(n){ n.shown = true; n.el.classList.remove('pre'); [...n.el.children].forEach(k => { if (k !== n.g) k.classList.add('dmf-in'); }); }
  function frame(now, dt){
    if (!F || !F.run.isConnected) return;
    const R = DMFlow.R(), B = n => { const b = F.L.box(n.g); b.r = DMFlow.markR(n.s); return b; };
    // drawing in: the connectors in order, one at a time; a step rises in once the line to it is drawn
    for (const n of F.nodes){
      if (n.shown) continue;
      const c = n.conns.find(c => c.rv < 1);
      if (c){ c.rv = Math.min(1, c.rv + dt / (REDUCE ? .001 : DUR)); break; }
      show(n);
    }
    const put = (c, d, s) => c.rv <= .02 ? c.l.set('') : c.l.set(d, s, 1 - Math.pow(1 - c.rv, 2));
    const t = B(F.trig), y0 = t.cy + t.r - 1;
    let d = '', ready = false;
    if (F.agent){
      const a = B(F.agent), x = a.cx;
      // the email to the agent
      put(F.agent.conns[0], DMFlow.route([[t.cx, y0], [x, a.cy - a.r + 1]]), 'on');
      // the agent's line, a piece from one branch to the next (grey until the run reaches past it), and a branch to each step
      let y = a.cy + a.r - 1;
      F.steps.forEach((n, i) => {
        const b = B(n), yj = b.cy - R, past = F.steps.slice(i).some(k => k.s !== 'queued');
        put(n.conns[0], DMFlow.route([[x, y], [x, yj]]), past ? 'on' : 'queued');
        put(n.conns[1], DMFlow.branch(x, yj, b.cx - b.r + 1, b.cy), n.s === 'queued' ? 'queued' : n.s === 'fail' ? 'bad' : 'on');
        y = yj;
      });
      // the band: from the email's mark, down the line, into what is executing (under its mark), once all of that is drawn
      const g = F.target;
      if (g === F.agent){ ready = F.agent.conns[0].rv >= 1; d = DMFlow.route([[t.cx, y0], [x, a.cy]]); }
      else if (g){ const i = F.steps.indexOf(g), b = B(g);
        ready = F.agent.conns[0].rv >= 1 && F.steps.slice(0, i + 1).every(k => k.conns.every(c => c.rv >= 1));
        d = DMFlow.route([[t.cx, y0], [x, b.cy], [b.cx, b.cy]]); }
    }
    // once the run ends the band finishes the trip it is on, then goes
    if (d && ready){ if (F.band.tick(d, now) && F.ending){ F.band.off(); F.target = null; } }
    else F.band.off();
  }
  abxDraws.add(frame); c.offs.push(() => abxDraws.delete(frame));

  // a test: a sample email goes in, and the agent works through it, step by step
  const EMAIL = `<div class="abx-em"><b>I was charged twice for October</b><span>Hi, my card shows two charges of $48 on Oct 3. Can you refund one? Maya</span><span class="muted">maya@lumen.co · sample</span></div>`;
  test.onclick = () => c.run(async () => {
    if (testing) return; testing = true; test.disabled = true; swap(cs, 'Testing with a sample email');
    // what it will do: read the refund policy (when it has it), then route the email in Linear and draft a reply in Gmail.
    // A tool it may only Read fails its step
    const P = [];
    if ($('.tag', kn)) P.push({ k:'kb', who:I('file-text', 'xs'), n:'Refund policy.pdf', plan:'Check the refund rules', go:'Checking the refund rules', ok:'Duplicate charges are refunded' });
    P.push({ k:'linear', who:BRAND.linear, n:'Linear', plan:'Route it to a team', go:'Routing it to Billing', ok:'Routed to Billing' });
    P.push({ k:'gmail', who:BRAND.gmail, n:'Gmail', plan:'Draft a reply', go:'Drafting a refund reply', ok:'Reply drafted, asks to send' });
    const run = html('<div class="abx-run" role="list" aria-label="Test run"></div>');
    log.replaceChildren(run);
    F = { run, L:DMFlow.layer(run), nodes:[], steps:[], agent:null, target:null, ending:false };
    F.band = DMFlow.band(F.L);
    F.trig = node('trig', EMAIL, 'src'); show(F.trig);
    await c.wait(700);
    // the agent: the line from the email draws in, then it appears, reading
    think(true);
    const ag = F.agent = node('pre', `${mascot()}<span class="abx-nt"><b>Support triage</b><span class="s">Reading the email</span></span>`, 'run');
    ag.conns = [conn()]; F.nodes.push(ag); F.target = ag; setS(ag, 'run');
    await c.wait(1300);
    think(false);
    // it sorts the email, and lays out its steps, queued
    const sub = $('.abx-nt .s', ag.el); sub.classList.remove('dmf-shim', 'dmf-sw'); sub.classList.add('tags');
    sub.innerHTML = '<span class="tag">Billing</span><span class="tag warn">High priority</span>'; void sub.offsetWidth; sub.classList.add('dmf-sw');
    for (const p of P){
      const n = node('lv1 pre', `<span class="abx-nt"><b>${p.who}<span>${p.n}</span></b><span class="s">${p.plan}</span></span>`, 'queued');
      n.el.setAttribute('role', 'listitem');
      // the agent's line goes first (on top), so where a branch leaves it the line runs on unbroken
      n.conns = [conn('lines'), conn('rail')]; F.nodes.push(n); F.steps.push(n);
      const ls = F.L.g.lines; ls.insertBefore(n.conns[0].l.el, ls.firstChild);
      await c.wait(240);
    }
    await c.wait(400);
    const bad = [];
    for (let i = 0; i < P.length; i++){
      const p = P[i], n = F.steps[i];
      while (!n.shown) await c.wait(40);
      setS(n, 'run', p.go); F.target = n; sr.textContent = p.go;
      await c.wait(p.k === 'kb' ? 1000 : 1200);
      const ok = p.k === 'kb' || perm(p.k) !== 'read';
      setS(n, ok ? 'done' : 'fail', ok ? p.ok : 'Allowed to read only'); if (!ok) bad.push(p.n);
      await c.wait(320);
    }
    // the agent ends with the tests' verdict, and says what it would do
    F.ending = true; setS(ag, bad.length ? 'fail' : 'done');
    const many = bad.length > 1, names = bad.join(' and ');
    const rp = html(`<p class="abx-rpl${bad.length ? ' fail' : ''}"></p>`);
    rp.textContent = bad.length ? `${names} ${many ? 'are' : 'is'} set to Read, so I could not finish. Set ${many ? 'them' : 'it'} to Ask or Act, then test again.` : 'Duplicate charge of $48 on Oct 3. I drafted a refund reply and will ask before sending it, as the instructions say.';
    run.appendChild(rp); rp.classList.add('dmf-in');
    swap(cs, bad.length ? 'The test found a problem' : 'The test passed');
    sr.textContent = bad.length ? `Test failed: ${names} ${many ? 'are' : 'is'} set to Read` : 'Test done: Billing, high priority, routed to Billing';
    testing = false; test.disabled = false;
  });
  save.onclick = () => { if (!valid()) { name.focus(); return; } state = 'saved'; status(`${I('check','xs')}Saved`); sr.textContent = 'Saved'; valid(); };
  pub.onclick = () => c.run(async () => { if (!valid()) { name.focus(); return; } pub.innerHTML = '<span class="spin"></span>Publishing'; await c.wait(800); state = 'live'; status(`${mascot()}<span class="tag ok">Live</span>`, 'muted'); pub.textContent = 'Published'; valid(); sr.textContent = 'Published. The agent is live'; });
  // the preview's story: one sentence, the fields fill in, one test email, save, publish. With ?fail it sets Linear to
  // Read before the test, so the test fails there. With ?rec it waits for LAB.start(), and plays once
  if (r === c.st && abxGo) c.story(async s => {
    window.LAB_DONE = false;
    await s.beat(2);
    await s.point(desc, false); await s.type(desc, 'Triage support emails', { n:.12 }); await s.beat(1);
    await s.tap(go); s.away();
    await s.until(() => !drafting && state === 'dirty'); await s.beat(3);
    if (FAIL){ await s.tap($('[data-t="linear"] [data-v="read"]', tools)); await s.beat(1); }
    await s.tap(test); s.away(); await s.until(() => F && F.ending && !testing); await s.beat(4);
    await s.tap(save); await s.beat(2);
    await s.tap(pub); s.away(); await s.until(() => state === 'live'); await s.beat(6);
    window.LAB_DONE = true;
    if (REC) throw 'stop';
  });
});

/* ---------- the page: style, theme, replay, and the clip recorder's handle ---------- */
{
  const d = document.documentElement, card = $('[data-c="agent-builder"]');
  const mark = (sel, v) => $$(sel + ' button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
  mark('#sw-style', d.dataset.style === 'soft' ? 'soft' : 'bp');
  mark('#sw-theme', d.dataset.theme === 'dark' ? 'dark' : 'light');
  seg($('#sw-style'), v => { if (v === 'soft') d.dataset.style = 'soft'; else delete d.dataset.style; try { localStorage.setItem('dmui-style', v); } catch(e){} });
  seg($('#sw-theme'), v => { d.dataset.theme = v; try { localStorage.setItem('dmui-theme', v); } catch(e){} });
  const start = () => { abxGo = true; window.LAB_DONE = false; const go = () => card._c ? DM.mount(card, true) : requestAnimationFrame(go); go(); };
  $('#replay').addEventListener('click', start);
  window.LAB = { start };
}
