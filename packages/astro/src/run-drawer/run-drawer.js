// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, html, seg } from '../core/core.js';
DM.def('run-drawer', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)(?:\.(xs))?\}/g, (m, k, z) => I(k, z || 's'));
  const uid = 'rdr' + Math.random().toString(36).slice(2, 7);
  const frame = $('.rdr', r), dw = $('.rdr-dw', r), flow = $('.rdr-flow', r), tg = $('.rdr-tg', r), stT = $('.rdr-st', r), idT = $('.rdr-id', r), meta = $('.rdr-meta', r);
  const bd = $('.rdr-b', r), rowsEl = $('.rdr-rows', r), sc = $('.rdr-sc', r), logEl = $('.rdr-log', r), cnt = $('.rdr-lf .n', r), ds = $('.rdr-ds', r), io = $('.rdr-io', r);
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
    const key = span * 100 + step; if (key !== R.ax){ R.ax = key; rowsEl.style.setProperty('--dm-rdr-g', (step / span * 100) + '%'); sc.innerHTML = Array.from({ length:Math.floor(span / step) }, (_, i) => `<span style="left:${i * step / span * 100}%">${i * step}s</span>`).join(''); }
    sps.forEach(p => {
      let el = R.rows.get(p);
      if (!el){
        el = html(`<button class="rdr-r" data-s="${p.s}" data-k="${p.k}" data-lv="${p.lv}" style="--dm-lv:${p.lv}" aria-pressed="${p.s === picked}"><span class="rdr-n"><span class="rdr-ti" data-k="${p.k}" aria-hidden="true">${I(p.ic, 'xs')}</span><span class="rdr-nm">${p.t}</span></span><span class="rdr-bt"><i></i></span><span class="rdr-ms num"></span></button>`);
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
      if (el) el.insertAdjacentHTML('afterend', `<div class="rdr-ask${REDUCE ? '' : ' in'}" role="group" aria-label="${x.t} waits for you"><span class="rdr-ti" data-k="approval" aria-hidden="true">${I('user', 'xs')}</span><span class="tx"><b>${x.t} is waiting for you</b><span>Live runs ask ${x.ask} in Slack. In a test, you decide.</span></span><span class="acts"><button class="pill primary sm" data-a="yes">${I('check', 'xs')}Approve</button><button class="pill line sm" data-a="no">Reject</button></span></div>`); }
    if (R.st !== 'wait' && ask) ask.remove();
    // the log, a line at a time, its levels in colour
    const L = R.log.filter(l => l.at <= t + 1e-6).sort((a, b) => a.at - b.at);
    for (; R.logN < L.length; R.logN++){ const l = L[R.logN];
      const li = html(`<li class="rdr-l" data-l="${l.l}"><span class="t num">${stamp(l.at)}</span><span class="lv tag" data-l="${l.l}">${l.l}</span><span class="m"><b>${l.b}</b> <span>${l.m}</span></span></li>`);
      li.hidden = lvl !== 'all' && l.l !== lvl; logEl.appendChild(li); if (!force && !REDUCE && !li.hidden) li.classList.add('in'); }
    filterLog(false);
    // the newest line in view while the run is followed
    if (follow && (R.st === 'run' || R.st === 'wait' || force)){ if (tab === 'steps'){ const b = rowsEl.lastElementChild; if (b && b.offsetTop + b.offsetHeight > bd.scrollTop + bd.clientHeight) bd.scrollTop = b.offsetTop + b.offsetHeight - bd.clientHeight + 6; } if (tab === 'log') bd.scrollTop = bd.scrollHeight; }
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
    if (b.matches('.rdr-nd') && tab === 'steps'){ const row = $(`.rdr-r[data-s="${b.dataset.s}"]`, rowsEl); if (row) bd.scrollTop = Math.max(0, row.offsetTop - 34); }
  });
  // Steps, Log and Data; the log's level filter
  const tabs = seg($('.rdr-tabs', r), v => { tab = v; $$('.rdr-v', r).forEach(x => x.hidden = x.dataset.v !== v); bd.scrollTop = 0; if (v === 'data') paintData(); if (v === 'log' && follow && R.st === 'run') bd.scrollTop = bd.scrollHeight; });
  seg($('.rdr-lvs', r), v => { lvl = v; filterLog(true); });
  c.on(followB, 'click', () => { follow = !follow; followB.setAttribute('aria-pressed', String(follow)); followB.dataset.tip = follow ? 'Follow the run' : 'Stay put'; say(follow ? 'Following the run' : 'Staying put'); });
  // the drawer folds down to its head, and drags taller from its top edge (or the arrow keys on it)
  const maxH = () => Math.max(160, frame.clientHeight - 64);
  const setH = h => { h = Math.round(Math.max(120, Math.min(maxH(), h))); dw.style.setProperty('--dm-rdr-h', h + 'px'); grip.setAttribute('aria-valuenow', h); grip.setAttribute('aria-valuemax', maxH()); };
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
