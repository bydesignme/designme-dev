/* 3a Dispatch: command first. Type or pick a task; it proposes who should take it, when it would be done and what it
   would cost, with two alternatives, and shows the pick on the schedule as a dashed block before you approve. Assign (or
   let it approve for you) and the task lands in that agent's lane, which runs against a moving "now". Queued blocks can be
   dragged to another lane or reordered, with the mouse or the keyboard (Enter picks up, arrows move, Enter drops, Escape
   puts it back). Each lane can be paused, or everyone at once. */
(function(){
const AG = [
  { id:'res', n:'Researcher', ic:'search', k:'b', rate:.014, v:'Researching' },
  { id:'wri', n:'Writer', ic:'edit', k:'l', rate:.009, v:'Writing' },
  { id:'des', n:'Designer', ic:'palette', k:'k', rate:.018, v:'Designing' },
  { id:'cod', n:'Coder', ic:'code', k:'t', rate:.022, v:'Coding' }
];
const BY = Object.fromEntries(AG.map(a => [a.id, a]));
const vars = a => `--a:var(--dm-p${a.k});--a-bg:var(--dm-p${a.k}-bg);--a-fill:var(--dm-av-${a.k});--a-ink:var(--dm-av-${a.k}-ink)`;
const KEY = {
  res:['research','find','compare','scan','survey','market','competitor','interview','source','why','churn'],
  wri:['write','draft','email','post','copy','article','notes','blog','summar','announce','reply','launch'],
  des:['design','image','hero','banner','deck','slide','chart','logo','mock','visual','icon'],
  cod:['fix','bug','error','500','test','code','api','deploy','form','crash','export','webhook']
};
const INBOX = [
  { ic:'hash', t:'Signup form throws a 500' },
  { ic:'file', t:'Q3 board deck charts' },
  { ic:'mail', t:'Reply to the pricing thread' }
];
const SPEED = 1.5;   // minutes of schedule per second
const fmt = m => { const h = 13 + Math.floor(m / 60), mm = Math.floor(((m % 60) + 60) % 60); return h + ':' + String(mm).padStart(2, '0'); };
const money = v => '$' + v.toFixed(2);
const esc = t => t.replace(/[&<>"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[ch]);

DM.PLAYS.add('dl3a');   // an agent at work: the demo keeps playing while the pointer rests on it

DM.def('dl3a', (st, c, card) => {
  const root = $('.dl3a', st);
  let nid = 0;
  const it = (t, d, state, s, w, e) => ({ id:'b' + (++nid), t, d, st:state, s:s ?? 0, w:w ?? 0, e:e ?? 0 });
  const L = {
    res:[ it('Churn interviews', 18, 'done', 0, 18, 18), it('Competitor pricing', 20, 'run', 18, 6), it('Market sizing', 24, 'q') ],
    wri:[ it('Release notes', 16, 'run', 12, 12), it('Help article', 22, 'q') ],
    des:[ it('Pricing page hero', 34, 'run', 14, 10) ],
    cod:[ it('Flaky test', 14, 'done', 2, 14, 16), it('Webhook retries', 34, 'run', 16, 6), it('Export to CSV', 30, 'q') ]
  };
  let now = 24, w0 = 0, span = 120, ppm = 4, gridKey = '';
  const paused = {};
  let auto = false, P = null, ghost = null, countdown = null;
  const els = new Map();
  let moving = false;   // a focused block is being moved to another lane: its blur is not the person leaving it
  const lanesEl = $('.dl3a-lanes', root), live = $('.dl3a-live', root);
  const input = $('.dl3a-in', root), form = $('.dl3a-cmd', root), pw = $('.dl3a-pw', root), prop = $('.dl3a-prop', root);
  const sw = $('.dl3a-auto .toggle', root), pauseAll = $('.dl3a-pa', root);
  const say = t => { live.textContent = ''; requestAnimationFrame(() => { live.textContent = t; }); };

  /* lanes */
  AG.forEach(a => lanesEl.insertAdjacentHTML('beforeend', `<div class="dl3a-row dl3a-ln" data-a="${a.id}" style="${vars(a)}">
    <div class="dl3a-who"><span class="dl3a-mk" aria-hidden="true">${I(a.ic)}</span><span class="dl3a-wt"><span class="dl3a-wn">${a.n}</span><span class="dl3a-ws">Idle</span></span></div>
    <div class="dl3a-tr" role="list" aria-label="${a.n}'s schedule"><span class="dl3a-past"></span><span class="dl3a-now"></span></div>
    <span class="dl3a-cost num">$0.00</span>
    <button class="ib dl3a-pz" type="button" aria-pressed="false" aria-label="Pause ${a.n}" data-tip="Pause ${a.n}">${I('pause', 's')}</button>
  </div>`));
  const lane = id => $(`.dl3a-ln[data-a="${id}"]`, lanesEl);
  const track = id => $('.dl3a-tr', lane(id));
  const laneOf = item => AG.find(a => L[a.id].includes(item)).id;

  /* times: finished work keeps its place, the running block ends when its remaining work is done, queued work follows */
  function relayout(id){
    let end = null;
    for (const x of L[id]){
      if (x.st === 'done'){ end = x.e; continue; }
      if (x.st === 'run'){ x.e = now + (x.d - x.w); end = x.e; continue; }
      x.s = Math.max(end ?? now, now); x.e = x.s + x.d; end = x.e;
    }
    return Math.max(end ?? now, now);
  }
  const laneEnd = id => relayout(id);

  function tick(ms){
    const m = ms * SPEED / 1000; now += m;
    for (const a of AG){
      const arr = L[a.id]; let run = arr.find(x => x.st === 'run');
      if (paused[a.id]) continue;
      if (!run){ const q = arr.find(x => x.st === 'q'); if (q){ q.st = 'run'; q.s = now; q.w = 0; run = q; } }
      if (run){ run.w += m; if (run.w >= run.d){ run.w = run.d; run.st = 'done'; run.e = now; const q = arr.find(x => x.st === 'q'); if (q){ q.st = 'run'; q.s = now; q.w = 0; } } }
    }
  }

  /* drawing */
  const setS = (el, k, v) => { if (el.style.getPropertyValue(k) !== v) el.style.setProperty(k, v); };
  const setT = (el, v) => { if (el.textContent !== v) el.textContent = v; };
  function grid(){
    const tw = track('res').clientWidth; if (!tw) return false;
    // the schedule scrolls under a fixed "now", a quarter of the way in, so the work slides into the past as it is done
    span = tw >= 420 ? 80 : 56;
    ppm = tw / span;
    w0 = now - span * .28;
    const key = tw + ':' + span; if (key !== gridKey){
      gridKey = key;
      $$('.dl3a-gl', root).forEach(g => g.remove());
      const ax0 = $('.dl3a-axt', root); $$('span:not(.now)', ax0).forEach(s => s.remove());
      for (let i = 0; i < 6; i++){
        AG.forEach(a => track(a.id).insertAdjacentHTML('afterbegin', '<span class="dl3a-gl"></span>'));
        ax0.insertAdjacentHTML('beforeend', '<span class="num"></span>');
      }
    }
    // a line and a time every quarter hour
    const first = Math.ceil(w0 / 15) * 15, ax = $('.dl3a-axt', root), labels = $$('span:not(.now)', ax);
    for (let i = 0; i < 6; i++){
      const m = first + i * 15, x = (m - w0) * ppm, show = x < tw - 2;
      AG.forEach(a => { const g = $$('.dl3a-gl', track(a.id))[i]; setS(g, 'left', x.toFixed(1) + 'px'); setS(g, 'opacity', show ? '1' : '0'); });
      const nearNow = Math.abs(m - now) * ppm < 34;
      setS(labels[i], 'left', x.toFixed(1) + 'px'); setT(labels[i], fmt(m)); setS(labels[i], 'opacity', show && !nearNow && x > 20 && x < tw - 26 ? '1' : '0');
    }
    return true;
  }
  function blockEl(x, a){
    const q = x.st === 'q', kind = q ? 'q' : 'x';
    let el = els.get(x.id);
    if (el && el.dataset.kind !== kind){ if (el === document.activeElement) el.blur(); el.remove(); el = null; }
    if (!el){
      el = document.createElement(q ? 'button' : 'span');
      el.dataset.kind = kind; el.dataset.id = x.id; el.className = 'dl3a-b';
      el.setAttribute('role', 'listitem');
      if (q){ el.type = 'button'; el.setAttribute('aria-roledescription', 'movable task'); }
      el.innerHTML = '<span></span>';
      els.set(x.id, el);
    }
    const tr = track(a.id);
    if (el.parentElement !== tr){ const f = el === document.activeElement; moving = true; try { tr.insertBefore(el, $('.dl3a-now', tr)); } finally { moving = false; } if (f) el.focus({ preventScroll:true }); }
    return el;
  }
  function paint(){
    if (!grid()) return;
    let spent = 0, booked = 0, running = 0;
    for (const a of AG){
      const end = relayout(a.id), ln = lane(a.id), tr = track(a.id);
      for (const x of L[a.id]){
        const el = blockEl(x, a);
        const left = Math.round((x.s - w0) * ppm * 10) / 10, wd = Math.max(6, (x.e - x.s) * ppm - 3);
        setS(el, 'left', left + 'px'); setS(el, 'width', wd.toFixed(1) + 'px');
        const cls = 'dl3a-b ' + x.st + (x.lift ? ' lift' : '') + (x.drag ? ' dragging' : '') + (x.fresh ? ' in' : '');
        if (el.className !== cls) el.className = cls;
        if (x.hide) setS(el, 'opacity', '0'); else if (el.style.opacity) el.style.opacity = '';
        if (x.st === 'run') setS(el, '--p', (x.w / x.d).toFixed(4));
        const ic = x.st === 'done' ? I('check', 's') : '';
        if (el.dataset.ic !== x.st){ el.dataset.ic = x.st; el.innerHTML = ic + '<span></span>'; }
        setT(el.lastElementChild, x.t);
        const cost = x.d * a.rate;
        const tip = `${x.t} · ${fmt(x.s)}–${fmt(x.e)} · ${money(cost)}`;
        if (el.dataset.tip !== tip){ el.dataset.tip = tip; el.setAttribute('aria-label', `${x.t}, ${a.n}, ${x.st === 'done' ? 'done' : x.st === 'run' ? 'running' : 'queued'}, ${fmt(x.s)} to ${fmt(x.e)}, ${money(cost)}${x.st === 'q' ? '. Press Enter to move it' : ''}`); }
        if (x.st === 'done') spent += x.d * a.rate;
        if (x.st === 'run'){ spent += x.w * a.rate; booked += (x.d - x.w) * a.rate; running++; }
        if (x.st === 'q') booked += x.d * a.rate;
      }
      // the proposal's dashed block, where the work would go
      let g = $('.dl3a-b.ghost', tr);
      if (ghost && ghost.a === a.id){
        if (!g){ g = html('<span class="dl3a-b ghost" aria-hidden="true">' + I('plus', 's') + '<span></span></span>'); tr.insertBefore(g, $('.dl3a-now', tr)); if (!REDUCE) g.animate([{ opacity:0 }, { opacity:1 }], { duration:260, easing:'ease-out' }); }
        setS(g, 'left', ((end - w0) * ppm).toFixed(1) + 'px'); setS(g, 'width', Math.max(24, ghost.d * ppm - 3).toFixed(1) + 'px');
        setT(g.lastElementChild, 'Done ' + fmt(end + ghost.d));
      } else if (g) g.remove();
      const pastW = Math.max(0, (now - w0) * ppm);
      setS($('.dl3a-past', tr), 'width', pastW.toFixed(1) + 'px');
      setS($('.dl3a-now', tr), 'left', pastW.toFixed(1) + 'px');
      const run = L[a.id].find(x => x.st === 'run'), ws = $('.dl3a-ws', ln);
      const word = paused[a.id] ? 'Paused' : run ? a.v + '…' : 'Idle';
      setT(ws, word);
      ws.classList.toggle('shim', !paused[a.id] && !!run); ws.classList.toggle('paused', !!paused[a.id]);
      const lc = L[a.id].reduce((v, x) => v + (x.st === 'done' ? x.d : x.st === 'run' ? x.w : 0) * a.rate, 0);
      setT($('.dl3a-cost', ln), money(lc));
    }
    const nowChip = $('.dl3a-axt .now', root);
    setT(nowChip, fmt(now)); setS(nowChip, 'left', ((now - w0) * ppm).toFixed(1) + 'px');
    setT($('.dl3a-sp', root), money(spent)); setT($('.dl3a-bk', root), money(booked));
    setT($('.dl3a-hm', root), `${AG.length} agents · ${running} running`);
  }

  /* the proposal */
  function score(text){
    const low = text.toLowerCase();
    return AG.map((a, i) => { const hits = KEY[a.id].filter(k => low.includes(k)).length; return { a, f:(hits ? .8 : .2) + hits * .05 - i * .001 }; }).sort((x, y) => y.f - x.f);
  }
  function propose(text, from){
    text = (text || '').trim(); if (!text) return;
    stopCountdown();
    const k = 0.9 + (text.length % 7) / 20;
    const opts = score(text).slice(0, 3).map((o, i) => { const d = Math.round([18, 28, 36][i] * k); return { a:o.a, d, eta:laneEnd(o.a.id) + d, cost:d * o.a.rate }; });
    P = { text, opts, sel:0, from };
    const box = $('.dl3a-opts', prop); box.innerHTML = '';
    opts.forEach((o, i) => box.insertAdjacentHTML('beforeend', `<button type="button" class="dl3a-opt" role="radio" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}" style="${vars(o.a)}">
      <span class="dl3a-mk" aria-hidden="true">${I(o.a.ic)}</span>
      <span class="dl3a-on">${o.a.n}${i === 0 ? '<span class="dl3a-best">Best fit</span>' : ''}</span>
      <span class="dl3a-om">Done <b class="num">${fmt(o.eta)}</b> · <b class="num">${money(o.cost)}</b></span>
      <span class="dl3a-rd" aria-hidden="true"></span></button>`));
    pick(0, false);
    pw.classList.add('open'); prop.inert = false;
    if (!REDUCE) $$('.dl3a-opt', box).forEach((b, i) => b.animate([{ opacity:0, transform:'translateY(6px)' }, { opacity:1, transform:'none' }], { duration:420, delay:80 + i * 60, easing:'cubic-bezier(.23,1,.32,1)', fill:'backwards' }));
    say(`Proposed: ${opts[0].a.n}, done ${fmt(opts[0].eta)}, ${money(opts[0].cost)}. Two alternatives.`);
    if (auto) startCountdown();
  }
  function pick(i, restart = true){
    if (!P) return; P.sel = i; const o = P.opts[i];
    $$('.dl3a-opt', prop).forEach((b, j) => { b.setAttribute('aria-checked', j === i); b.tabIndex = j === i ? 0 : -1; });
    $('.dl3a-ok', prop).textContent = 'Assign to ' + o.a.n;
    const q = L[o.a.id].filter(x => x.st !== 'done'), last = q[q.length - 1];
    const sayEl = $('.dl3a-say', prop);
    if (!countdown){ sayEl.classList.remove('shim'); sayEl.textContent = last ? `Starts ${fmt(laneEnd(o.a.id))}, after ${last.t}` : 'Starts now'; }
    ghost = { a:o.a.id, d:o.d };
    paint();
    if (restart && countdown) startCountdown();
  }
  function closeProp(){
    stopCountdown(); P = null; ghost = null; pw.classList.remove('open'); prop.inert = true; paint();
  }
  function startCountdown(){
    stopCountdown(); if (!P) return;
    const o = P.opts[P.sel], sayEl = $('.dl3a-say', prop);
    prop.classList.add('auto'); sayEl.textContent = `Assigning to ${o.a.n}…`; sayEl.classList.add('shim');
    const bar = $('.dl3a-cd i', prop), ms = 1800;
    countdown = { t0:performance.now(), ms, a:bar.animate([{ transform:'scaleX(0)' }, { transform:'scaleX(1)' }], { duration:REDUCE ? 1 : ms, easing:'linear', fill:'forwards' }) };
    const mine = countdown;
    c.later(ms, () => { if (countdown === mine) assign(); });
  }
  function stopCountdown(){
    if (countdown){ countdown.a.cancel(); countdown = null; }
    prop.classList.remove('auto');
    const sayEl = $('.dl3a-say', prop); if (sayEl) sayEl.classList.remove('shim');
  }
  function assign(){
    if (!P) return;
    stopCountdown();
    const o = P.opts[P.sel], from = $(`.dl3a-opt[data-i="${P.sel}"]`, prop), g = $('.dl3a-b.ghost', track(o.a.id));
    const x = it(P.text, o.d, 'q'); L[o.a.id].push(x);
    if (P.from) P.from.classList.add('gone');
    const text = P.text, a = o.a;
    if (!REDUCE && from && g){
      // the fly rides in the schedule, so it lands where the slot is even as the proposal above folds away
      const host = $('.dl3a-tl', root), S = host.getBoundingClientRect(), f = from.getBoundingClientRect(), t = g.getBoundingClientRect();
      const fly = html(`<span class="dl3a-fly" style="${vars(a)}">${I('plus', 's')}<span>${esc(text)}</span></span>`);
      host.appendChild(fly); x.hide = true;
      const an = fly.animate([
        { left:(f.left - S.left) + 'px', top:(f.top - S.top) + 'px', width:f.width + 'px', height:f.height + 'px', opacity:.0 },
        { opacity:1, offset:.15 },
        { left:(t.left - S.left) + 'px', top:(t.top - S.top) + 'px', width:t.width + 'px', height:t.height + 'px', opacity:1 }
      ], { duration:640, easing:'cubic-bezier(.23,1,.32,1)', fill:'forwards' });
      an.finished.then(() => { x.hide = false; paint(); fly.remove(); }).catch(() => fly.remove());
    }
    input.value = '';
    closeProp();
    say(`Assigned to ${a.n}: ${text}.`);
  }

  /* a discrete change (a move, a reorder) slides the blocks from where they were to where they now are */
  function flip(change){
    const before = new Map(); els.forEach((el, id) => { if (el.isConnected) before.set(id, el.getBoundingClientRect()); });
    change(); paint(); if (REDUCE) return;
    els.forEach((el, id) => { const b = before.get(id); if (!b || !el.isConnected) return; const a = el.getBoundingClientRect(), dx = b.left - a.left, dy = b.top - a.top;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) el.animate([{ transform:`translate(${dx}px,${dy}px)` }, { transform:'none' }], { duration:340, easing:'cubic-bezier(.23,1,.32,1)' }); });
  }
  /* moving queued work: to another lane, or earlier or later in its own */
  function moveItem(x, to, qi){
    const from = laneOf(x); L[from].splice(L[from].indexOf(x), 1);
    const arr = L[to], qs = arr.filter(y => y.st === 'q');
    if (qi >= qs.length) arr.push(x); else arr.splice(arr.indexOf(qs[Math.max(0, qi)]), 0, x);
  }
  const qIndex = x => L[laneOf(x)].filter(y => y.st === 'q').indexOf(x);
  function dropIndex(to, px, x){
    const tr = track(to).getBoundingClientRect();
    return L[to].filter(y => y.st === 'q' && y !== x).filter(y => tr.left + ((y.s + y.e) / 2 - w0) * ppm < px).length;
  }
  const D = { x:null, el:null, fly:null, dx:0, dy:0, over:null };
  function dragStart(x, el, px, py){
    const S = st.getBoundingClientRect(), b = el.getBoundingClientRect(), a = BY[laneOf(x)];
    D.x = x; D.el = el; D.dx = px - b.left; D.dy = py - b.top;
    D.fly = html(`<span class="dl3a-fly" style="${vars(a)};left:${b.left - S.left}px;top:${b.top - S.top}px;width:${b.width}px">${'<span>' + esc(x.t) + '</span>'}</span>`);
    st.appendChild(D.fly); x.drag = true; paint();
  }
  function dragMove(px, py){
    if (!D.x) return; const S = st.getBoundingClientRect();
    D.fly.style.left = (px - D.dx - S.left) + 'px'; D.fly.style.top = (py - D.dy - S.top) + 'px';
    const ln = lanesEl.contains(document.elementFromPoint(px, py)) ? document.elementFromPoint(px, py).closest('.dl3a-ln') : null;
    if (D.over !== ln){ if (D.over) D.over.classList.remove('over'); D.over = ln; if (ln) ln.classList.add('over'); }
  }
  function dragEnd(px, py){
    if (!D.x) return; const x = D.x, fly = D.fly, ln = D.over;
    if (ln){ const to = ln.dataset.a; flip(() => moveItem(x, to, dropIndex(to, px, x))); say(`${x.t} moved to ${BY[to].n}, position ${qIndex(x) + 1}.`); ln.classList.remove('over'); }
    x.drag = false; D.x = null; D.over = null; paint();
    const el = els.get(x.id), S = st.getBoundingClientRect(), t = el.getBoundingClientRect();
    if (REDUCE){ fly.remove(); return; }
    x.hide = true; paint();
    fly.animate([{}, { left:(t.left - S.left) + 'px', top:(t.top - S.top) + 'px', width:t.width + 'px' }], { duration:260, easing:'cubic-bezier(.23,1,.32,1)', fill:'forwards' })
      .finished.then(() => { x.hide = false; paint(); fly.remove(); }).catch(() => fly.remove());
  }
  c.on(lanesEl, 'pointerdown', e => {
    const el = e.target.closest('.dl3a-b.q'); if (!el || e.button !== 0) return;
    const x = [...Object.values(L)].flat().find(y => y.id === el.dataset.id); if (!x || x.st !== 'q') return;
    const sx = e.clientX, sy = e.clientY; let on = false;
    const mv = ev => { if (!on && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 4){ on = true; dragStart(x, el, sx, sy); } if (on) dragMove(ev.clientX, ev.clientY); };
    const up = ev => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); if (on) dragEnd(ev.clientX, ev.clientY); };
    addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up);
    c.offs.push(() => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); });
  });

  /* the keyboard: Enter or Space picks a queued block up, the arrows move it (up and down to another agent, left and right
     earlier or later), Enter or Space drops it, Escape puts it back where it was */
  let K = null;
  c.on(lanesEl, 'keydown', e => {
    const el = e.target.closest('.dl3a-b.q'); if (!el) return;
    const x = [...Object.values(L)].flat().find(y => y.id === el.dataset.id); if (!x) return;
    const k = e.key;
    if (!K && (k === 'Enter' || k === ' ')){ e.preventDefault(); K = { x, lane:laneOf(x), qi:qIndex(x) }; x.lift = true; el.setAttribute('aria-pressed', 'true'); paint(); say(`Picked up ${x.t}. Arrow keys move it, Enter drops it, Escape cancels.`); return; }
    if (!K || K.x !== x) return;
    if (k === 'Enter' || k === ' '){ e.preventDefault(); x.lift = false; K = null; el.setAttribute('aria-pressed', 'false'); paint(); say(`Dropped ${x.t} with ${BY[laneOf(x)].n}, position ${qIndex(x) + 1}.`); return; }
    if (k === 'Escape'){ e.preventDefault(); x.lift = false; const back = K; K = null; flip(() => moveItem(x, back.lane, back.qi)); el.setAttribute('aria-pressed', 'false'); say(`Put back. ${x.t} stays with ${BY[laneOf(x)].n}.`); return; }
    const cur = laneOf(x), ai = AG.findIndex(a => a.id === cur);
    if (k === 'ArrowUp' || k === 'ArrowDown'){ e.preventDefault(); const ni = ai + (k === 'ArrowUp' ? -1 : 1); if (ni < 0 || ni >= AG.length) return; flip(() => moveItem(x, AG[ni].id, qIndex(x))); say(`${AG[ni].n}, position ${qIndex(x) + 1}.`); }
    if (k === 'ArrowLeft' || k === 'ArrowRight'){ e.preventDefault(); const qi = qIndex(x) + (k === 'ArrowLeft' ? -1 : 1); const n = L[cur].filter(y => y.st === 'q').length; if (qi < 0 || qi >= n) return; flip(() => moveItem(x, cur, qi)); say(`Position ${qi + 1}.`); }
    const nel = els.get(x.id); if (nel && document.activeElement !== nel) nel.focus({ preventScroll:true });
  });
  c.on(lanesEl, 'focusout', e => { if (K && !moving && e.target.dataset && e.target.dataset.id === K.x.id && !lanesEl.contains(e.relatedTarget)){ K.x.lift = false; K = null; e.target.setAttribute('aria-pressed', 'false'); paint(); } });

  /* commands */
  c.on(form, 'submit', e => { e.preventDefault(); if (P && input.value.trim() === P.text) assign(); else propose(input.value); });
  $$('.dl3a-sg .chip', root).forEach((b, i) => c.on(b, 'click', () => { input.value = INBOX[i].t; propose(INBOX[i].t, b); }));
  c.on($('.dl3a-opts', prop), 'click', e => { const b = e.target.closest('.dl3a-opt'); if (b) pick(+b.dataset.i); });
  c.on($('.dl3a-opts', prop), 'keydown', e => {
    const b = e.target.closest('.dl3a-opt'); if (!b || !P) return;
    const n = P.opts.length, i = +b.dataset.i;
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)){ e.preventDefault(); const j = (i + (/Right|Down/.test(e.key) ? 1 : -1) + n) % n; pick(j); $(`.dl3a-opt[data-i="${j}"]`, prop).focus(); }
    if (e.key === 'Enter'){ e.preventDefault(); assign(); }
  });
  c.on($('.dl3a-ok', prop), 'click', assign);
  c.on($('.dl3a-no', prop), 'click', () => { closeProp(); say('Proposal dismissed.'); });
  c.on(sw, 'click', () => { auto = sw.getAttribute('aria-checked') !== 'true'; sw.setAttribute('aria-checked', auto); if (auto && P) startCountdown(); if (!auto) stopCountdown(), P && pick(P.sel, false); });
  c.on(lanesEl, 'click', e => {
    const b = e.target.closest('.dl3a-pz'); if (!b) return;
    const id = b.closest('.dl3a-ln').dataset.a; setPause(id, !paused[id]); syncAll();
  });
  function setPause(id, v){
    paused[id] = v; const b = $('.dl3a-pz', lane(id)), n = BY[id].n;
    b.setAttribute('aria-pressed', v); b.setAttribute('aria-label', (v ? 'Resume ' : 'Pause ') + n); b.dataset.tip = (v ? 'Resume ' : 'Pause ') + n;
    b.innerHTML = I(v ? 'play' : 'pause', 's');
  }
  function syncAll(){ const all = AG.every(a => paused[a.id]); pauseAll.lastChild.textContent = all ? 'Resume all' : 'Pause all'; pauseAll.firstElementChild.outerHTML = I(all ? 'play' : 'pause', 's'); paint(); }
  c.on(pauseAll, 'click', () => { const all = AG.every(a => paused[a.id]); AG.forEach(a => setPause(a.id, !all)); syncAll(); say(all ? 'Everyone resumed.' : 'Everyone paused.'); });
  prop.inert = true;

  /* the clock */
  let last = 0;
  c.loop(t => { const dt = last ? Math.min(100, t - last) : 0; last = t; tick(dt); paint(); });
  c.on(window, 'resize', () => { gridKey = ''; paint(); });
  paint();

  /* the demo: someone briefs the team, compares the alternatives on the schedule, assigns, turns on Approve for me, picks a
     bug from the inbox and drags it ahead of the export */
  const handDrag = async (s, el, tx, ty) => {
    await s.point(el, false);
    const x = [...Object.values(L)].flat().find(y => y.id === el.dataset.id); if (!x || x.st !== 'q') return;
    const hand = $('.hand', st), b = el.getBoundingClientRect();
    hand.classList.add('down');
    const px = b.left + Math.min(b.width * .62, b.width - 10), py = b.top + b.height * .58;
    dragStart(x, el, px, py);
    D.fly.style.transition = 'left .5s cubic-bezier(.22,1,.36,1),top .5s cubic-bezier(.22,1,.36,1)';
    await s.beat(.4);
    const S = st.getBoundingClientRect();
    hand.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1),opacity .16s';
    hand.style.transform = `translate(${tx - S.left}px,${ty - S.top}px)`;
    dragMove(tx, ty);
    await s.beat(1.4);
    D.fly.style.transition = ''; hand.style.transition = '';
    dragEnd(tx, ty); hand.classList.remove('down');
  };
  const again = () => {
    const out = st.animate([{ opacity:1 }, { opacity:0 }], { duration:320, easing:'ease-out', fill:'forwards' });
    out.finished.then(() => { if (card._c === c && !c.dead && !c.mine){ DM.mount(card, true); st.animate([{ opacity:0 }, { opacity:1 }], { duration:320, easing:'ease-out' }); } out.cancel(); }).catch(() => {});
  };
  c.story(async s => {
    await s.beat(.3);
    await s.point(input, false);
    await s.type(input, 'Draft the launch email for Friday', { n:.03 });
    await s.tap($('.dl3a-go', root));
    await s.beat(4);
    await s.tap($('.dl3a-opt[data-i="1"]', prop));
    await s.beat(3);
    await s.tap($('.dl3a-opt[data-i="0"]', prop));
    await s.beat(2);
    await s.tap($('.dl3a-ok', prop));
    await s.beat(3);
    await s.tap(sw);
    await s.beat(2);
    const chip = $$('.dl3a-sg .chip', root)[0];
    await s.tap(chip);
    await s.until(() => !P);
    await s.beat(3);
    const bug = L.cod.find(x => x.t === INBOX[0].t), exp = L.cod.find(x => x.t === 'Export to CSV');
    if (bug && exp && bug.st === 'q' && exp.st === 'q'){
      const eb = els.get(exp.id).getBoundingClientRect();
      await handDrag(s, els.get(bug.id), eb.left + 6, eb.top + eb.height / 2);
    }
    await s.beat(6);
    s.away();
    if (REDUCE) return;
    await s.beat(3);
    again();
  });
});
})();
