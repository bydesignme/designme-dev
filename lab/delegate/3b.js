/* 3b Team canvas: agents as nodes on a small map, joined by the lines their work is handed along. Drag a task from the
   tray onto an agent (or press the task, then press the agent; from the keyboard Enter picks it up, the arrows choose an
   agent, Enter drops and Escape cancels). The agent's ring fills as it works and its spend ticks up; when its step is done
   the work travels along the line to the next agent. Autopilot hands each new task to the agent its route starts with.
   Each agent can be paused. */
(function(){
const AG = [
  { id:'res', n:'Researcher', ic:'search', k:'b', d:2.6, rate:.09, v:'Researching' },
  { id:'wri', n:'Writer', ic:'edit', k:'l', d:3, rate:.06, v:'Drafting' },
  { id:'ana', n:'Analyst', ic:'chart', k:'p', d:2.6, rate:.08, v:'Analysing' },
  { id:'des', n:'Designer', ic:'palette', k:'k', d:2.8, rate:.11, v:'Designing' },
  { id:'rev', n:'Reviewer', ic:'eye', k:'t', d:2, rate:.05, v:'Reviewing' }
];
const BY = Object.fromEntries(AG.map(a => [a.id, a]));
const EDGES = [['res', 'wri'], ['res', 'ana'], ['wri', 'des'], ['ana', 'des'], ['des', 'rev']];
const PATH = { res:['res', 'wri', 'des', 'rev'], wri:['wri', 'des', 'rev'], ana:['ana', 'des', 'rev'], des:['des', 'rev'], rev:['rev'] };
const vars = a => `--a:var(--dm-p${a.k});--a-bg:var(--dm-p${a.k}-bg);--a-fill:var(--dm-av-${a.k});--a-ink:var(--dm-av-${a.k}-ink)`;
const money = v => '$' + v.toFixed(2);
const esc = t => t.replace(/[&<>"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[ch]);
const RING = 100;

DM.PLAYS.add('dl3b');   // an agent at work: the demo keeps playing while the pointer rests on it

DM.def('dl3b', (st, c, card) => {
  const root = $('.dl3b', st), grid = $('.dl3b-grid', root), svg = $('.dl3b-svg', root), cv = $('.dl3b-cv', root);
  const toks = $('.dl3b-toks', root), dock = $('.dl3b-dock', root), hint = $('.dl3b-hint', root), live = $('.dl3b-live', root);
  const sw = $('.dl3b-auto .toggle', root);
  const say = t => { live.textContent = ''; requestAnimationFrame(() => { live.textContent = t; }); };
  let tid = 0, spent = 1.12, done = 0, auto = false;
  const N = {};   // node state: queue of {task}, run {task, w}, paused, note
  AG.forEach(a => { N[a.id] = { q:[], run:null, paused:false, note:null, spent:0 }; });
  const task = (t, ic, route) => ({ id:'t' + (++tid), t, ic, route, step:0 });

  /* nodes */
  AG.forEach(a => grid.insertAdjacentHTML('beforeend', `<div class="dl3b-n" data-a="${a.id}" style="${vars(a)}" role="group" aria-label="${a.n}" tabindex="-1">
    <span class="dl3b-mk"><svg class="dl3b-ring" viewBox="0 0 68 68" aria-hidden="true"><rect class="tk" x="1.5" y="1.5" width="65" height="65" rx="32.5" pathLength="100"/><rect class="pg" x="1.5" y="1.5" width="65" height="65" rx="32.5" pathLength="100"/></svg><span class="dl3b-tile" aria-hidden="true">${I(a.ic)}</span><span class="dl3b-badge num" aria-hidden="true"></span></span>
    <span class="dl3b-nx"><span class="dl3b-nn">${a.n}</span>
    <span class="dl3b-ns"><span>Idle</span></span>
    <span class="dl3b-nf"><span class="dl3b-cost num">$0.00</span><button type="button" class="ib dl3b-pz" aria-pressed="false" aria-label="Pause ${a.n}" data-tip="Pause ${a.n}">${I('pause', 's')}</button></span></span>
  </div>`));
  const node = id => $(`.dl3b-n[data-a="${id}"]`, grid);

  /* the lines: drawn from where the nodes are, so they follow any layout */
  const NS = 'http://www.w3.org/2000/svg';
  const paths = {};
  function lines(){
    const C = cv.getBoundingClientRect(), M = svg.getBoundingClientRect(); if (!M.width) return;
    svg.setAttribute('viewBox', `0 0 ${M.width} ${M.height}`);
    svg.innerHTML = '';
    // each line runs between two rings: out of the sender's side, into the receiver's side or, when it is well below,
    // into its top (the words sit under each ring, so nothing leaves from the bottom)
    // when the words sit beside the rings (narrow), the lines run from ring to ring top to bottom instead
    const at = id => { const r = $('.dl3b-mk', node(id)).getBoundingClientRect(); return { x:r.left + r.width / 2 - M.left, y:r.top + r.height / 2 - M.top, r:r.width / 2 + 5 }; };
    const down = getComputedStyle(node('res')).flexDirection === 'row';
    EDGES.forEach(([f, t]) => {
      const a = at(f), b = at(t), dx = b.x - a.x, dy = b.y - a.y, s = Math.sign(dx) || 1;
      let d, x1, y1, x2, y2;
      if (down){ x1 = a.x; y1 = a.y + a.r; x2 = b.x; y2 = b.y - b.r; const m = (y2 - y1) / 2; d = `M${x1} ${y1} C${x1} ${y1 + m} ${x2} ${y2 - m} ${x2} ${y2}`; }
      else { x1 = a.x + s * a.r; y1 = a.y; x2 = b.x - s * b.r; y2 = b.y; const m = (x2 - x1) / 2; d = `M${x1} ${y1} C${x1 + m} ${y1} ${x2 - m} ${y2} ${x2} ${y2}`; }
      const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', 'dl3b-e'); svg.appendChild(p);
      paths[f + '>' + t] = p;
      [[x1, y1], [x2, y2]].forEach(([x, y]) => { const o = document.createElementNS(NS, 'circle'); o.setAttribute('cx', x); o.setAttribute('cy', y); o.setAttribute('r', 3); o.setAttribute('class', 'dl3b-port'); svg.appendChild(o); });
    });
    void C;
  }
  const ro = new ResizeObserver(() => lines()); ro.observe(cv); c.offs.push(() => ro.disconnect());

  /* work moving along a line: the line lights in the sender's colour from end to end, a dot carries the work, then the
     line goes back to grey and the work joins the next agent's queue */
  function handoff(from, to, t){
    const p = paths[from + '>' + to];
    const arrive = () => { N[to].q.push(t); paint(); };
    if (!p || REDUCE){
      if (p){ const lit = p.cloneNode(); lit.setAttribute('class', 'dl3b-lit'); lit.setAttribute('style', vars(BY[from])); svg.appendChild(lit); lit.animate([{ opacity:0 }, { opacity:1, offset:.3 }, { opacity:0 }], { duration:900 }).finished.then(() => lit.remove()).catch(() => {}); }
      c.later(REDUCE ? 300 : 0, arrive); return;
    }
    const len = p.getTotalLength(), lit = p.cloneNode();
    lit.setAttribute('class', 'dl3b-lit'); lit.setAttribute('style', vars(BY[from]) + `;stroke-dasharray:${len};stroke-dashoffset:${len}`);
    svg.appendChild(lit);
    const short = t.t.split(' ').slice(0, 2).join(' ');
    const chip = html(`<span class="dl3b-pkt" style="${vars(BY[from])}"><i></i>${esc(short)}</span>`);
    $('.dl3b-map', root).appendChild(chip);
    const cw = chip.offsetWidth, ch = chip.offsetHeight;
    const ms = 1100, t0 = performance.now();
    const step = now => {
      if (c.dead) return;
      const k = Math.min(1, (now - t0) / ms), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2, pt = p.getPointAtLength(len * e);
      lit.style.strokeDashoffset = len * (1 - e);
      chip.style.transform = `translate(${pt.x - cw / 2}px,${pt.y - ch / 2}px)`;
      chip.style.opacity = Math.max(0, Math.min(1, k * 6, (.92 - k) * 8));
      if (k < 1) requestAnimationFrame(step);
      else { chip.remove(); arrive(); lit.animate([{ opacity:1 }, { opacity:0 }], { duration:520, easing:'ease-out', fill:'forwards' }).finished.then(() => lit.remove()).catch(() => {}); }
    };
    requestAnimationFrame(step);
  }

  /* the clock: each agent takes the next piece of work from its queue, works it, and passes it on */
  function tick(dt){
    for (const a of AG){
      const s = N[a.id];
      if (s.note && (s.note.t -= dt) <= 0) s.note = null;
      if (s.paused) continue;
      if (!s.run && s.q.length){ s.run = { task:s.q.shift(), w:0 }; s.note = null; }
      if (!s.run) continue;
      s.run.w += dt; spent += dt * a.rate; s.spent += dt * a.rate;
      if (s.run.w >= a.d){
        const t = s.run.task; s.run = null; t.step++;
        const nx = t.route[t.step];
        if (nx){ s.note = { t:1.1, text:'Sent to ' + BY[nx].n }; handoff(a.id, nx, t); }
        else { done++; s.note = { t:2.4, text:t.t, ok:true }; say(`${t.t} is done.`); const el = node(a.id); if (!REDUCE){ el.classList.remove('in'); void el.offsetWidth; el.classList.add('in'); } }
      }
    }
  }
  const setT = (el, v) => { if (el.textContent !== v) el.textContent = v; };
  function paint(){
    let running = 0;
    for (const a of AG){
      const s = N[a.id], el = node(a.id), ns = $('.dl3b-ns', el), pg = $('.pg', el);
      if (s.run) running++;
      const k = s.run ? Math.min(1, s.run.w / a.d) : s.note && s.note.ok ? 1 : 0;
      pg.style.strokeDashoffset = (RING * (1 - k)).toFixed(2);
      pg.classList.toggle('ok', !s.run && !!(s.note && s.note.ok));
      const word = s.paused ? 'Paused' : s.run ? a.v + '…' : s.note ? s.note.text : 'Idle';
      const key = word + (s.note && s.note.ok && !s.run ? '+ok' : '') + (s.run && !s.paused ? '+shim' : '');
      if (ns.dataset.k !== key){
        ns.dataset.k = key;
        ns.innerHTML = (s.note && s.note.ok && !s.run && !s.paused ? I('check', 's') : '') + `<span class="${s.run && !s.paused ? 'shim' : ''}">${esc(word)}</span>`;
        ns.classList.toggle('paused', s.paused);
      }
      setT($('.dl3b-cost', el), money(s.spent));
      setT($('.dl3b-badge', el), s.q.length ? String(s.q.length) : '');
      const tip = s.run ? s.run.task.t + (s.q.length ? ` · ${s.q.length} waiting` : '') : s.q.length ? `${s.q.length} waiting` : '';
      const mk = $('.dl3b-mk', el); if (tip){ if (mk.dataset.tip !== tip) mk.dataset.tip = tip; } else if (mk.dataset.tip) delete mk.dataset.tip;
      el.setAttribute('aria-label', `${a.n}: ${word}${s.run ? ', ' + s.run.task.t + ', ' + Math.round(k * 100) + '%' : ''}, ${money(s.spent)} spent${s.q.length ? ', ' + s.q.length + ' waiting' : ''}`);
    }
    setT($('.dl3b-hm', root), `${running} working · ${done} done`);
    setT($('.dl3b-spv', root), money(spent));
    const n = $$('.dl3b-tok:not(.out)', toks).length, dl = $('.dl3b-dl', root), dk = n ? 'n' + n : '0';
    if (dl.dataset.k !== dk){ dl.dataset.k = dk; dl.innerHTML = n ? `<b class="num">${n}</b> waiting` : 'Nothing waiting'; }
  }

  /* handing a task to an agent: the token flies into the agent's mark and joins its queue */
  function routeFrom(t, id){ const i = t.route.indexOf(id); return i >= 0 ? t.route.slice(i) : PATH[id]; }
  function dispatch(tok, id, from){
    const t = tok._t; t.route = routeFrom(t, id); t.step = 0;
    const el = node(id);
    if (!REDUCE){
      const S = st.getBoundingClientRect(), b = (from || tok).getBoundingClientRect(), m = $('.dl3b-mk', el).getBoundingClientRect();
      const fly = from || html(`<span class="dl3b-fly">${I(t.ic, 's')}<span>${esc(t.t)}</span></span>`);
      if (!from){ fly.style.left = (b.left - S.left) + 'px'; fly.style.top = (b.top - S.top) + 'px'; st.appendChild(fly); }
      const fb = fly.getBoundingClientRect();
      const dx = m.left + m.width / 2 - (fb.left + fb.width / 2), dy = m.top + m.height / 2 - (fb.top + fb.height / 2);
      fly.style.transition = 'none';
      fly.animate([{ transform:'none', opacity:1 }, { transform:`translate(${dx}px,${dy}px) scale(.18)`, opacity:0 }], { duration:560, easing:'cubic-bezier(.5,0,.2,1)', fill:'forwards' })
        .finished.then(() => { fly.remove(); N[id].q.push(t); el.classList.remove('in'); void el.offsetWidth; el.classList.add('in'); paint(); }).catch(() => fly.remove());
    } else { if (from) from.remove(); N[id].q.push(t); }
    removeTok(tok);
    say(`${t.t} handed to ${BY[id].n}.`);
    paint();
  }
  function removeTok(tok){
    if (tok === K) endCarry(false);
    tok.classList.add('out'); tok.disabled = true;
    const go = () => { tok.remove(); paint(); if (!$('.dl3b-tok', toks)) setHint(); };
    if (REDUCE) go(); else setTimeout(go, 220);
  }
  function addTok(t, anim){
    const b = html(`<button type="button" class="pill line sm dl3b-tok" aria-pressed="false"><svg class="i s g" aria-hidden="true"><use href="#i-grip"/></svg><svg class="i s src" aria-hidden="true"><use href="#i-${t.ic}"/></svg><span>${esc(t.t)}</span></button>`);
    b._t = t; b.setAttribute('aria-label', `${t.t}. Press to pick up, then choose an agent`);
    toks.appendChild(b); if (anim && !REDUCE) b.classList.add('in');
    setHint(); paint(); return b;
  }
  function setHint(){
    const any = $('.dl3b-tok:not(.out)', toks);
    hint.classList.toggle('shim', auto && !!any);
    setT(hint, !any ? '' : auto ? 'Handing out…' : K ? 'Now press the agent who should take it' : 'Drop work on whoever should take it');
  }

  /* the pointer: drag a token onto a node; a press without a drag picks it up instead (see carry) */
  const D = { tok:null, fly:null, dx:0, dy:0, over:null };
  const nodeAt = (x, y) => { const e = document.elementFromPoint(x, y); return e && grid.contains(e) ? e.closest('.dl3b-n') : null; };
  function dragStart(tok, px, py){
    const S = st.getBoundingClientRect(), b = tok.getBoundingClientRect(), t = tok._t;
    D.tok = tok; D.dx = px - b.left; D.dy = py - b.top;
    D.fly = html(`<span class="dl3b-fly">${I(t.ic, 's')}<span>${esc(t.t)}</span></span>`);
    D.fly.style.left = (b.left - S.left) + 'px'; D.fly.style.top = (b.top - S.top) + 'px';
    st.appendChild(D.fly); tok.classList.add('dragging');
  }
  function dragMove(px, py){
    if (!D.tok) return; const S = st.getBoundingClientRect();
    D.fly.style.left = (px - D.dx - S.left) + 'px'; D.fly.style.top = (py - D.dy - S.top) + 'px';
    const n = nodeAt(px, py); if (n !== D.over){ if (D.over) D.over.classList.remove('over'); D.over = n; if (n) n.classList.add('over'); }
  }
  function dragEnd(){
    if (!D.tok) return; const tok = D.tok, fly = D.fly, n = D.over;
    D.tok = null; D.over = null; tok.classList.remove('dragging');
    if (n){ n.classList.remove('over'); dispatch(tok, n.dataset.a, fly); return; }
    const S = st.getBoundingClientRect(), b = tok.getBoundingClientRect();
    if (REDUCE){ fly.remove(); return; }
    fly.style.transition = 'left .3s cubic-bezier(.23,1,.32,1),top .3s cubic-bezier(.23,1,.32,1)';
    fly.style.left = (b.left - S.left) + 'px'; fly.style.top = (b.top - S.top) + 'px';
    setTimeout(() => fly.remove(), 320);
  }
  c.on(toks, 'pointerdown', e => {
    const tok = e.target.closest('.dl3b-tok'); if (!tok || tok.disabled || e.button !== 0) return;
    const sx = e.clientX, sy = e.clientY; let on = false;
    const mv = ev => { if (!on && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 4){ on = true; if (K) endCarry(false); dragStart(tok, sx, sy); } if (on) dragMove(ev.clientX, ev.clientY); };
    const up = () => { off(); if (on){ dragEnd(); tok._dragged = true; setTimeout(() => { tok._dragged = false; }, 0); } };
    const off = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); };
    addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up); c.offs.push(off);
  });

  /* carry: press a token to pick it up (mouse, touch or keyboard), then press an agent to hand it over. From the keyboard
     the arrows move between agents, Enter or Space drops, Escape puts it back */
  let K = null;
  function startCarry(tok){
    K = tok; tok.setAttribute('aria-pressed', 'true'); root.classList.add('carrying');
    $$('.dl3b-n', grid).forEach(n => n.setAttribute('role', 'button'));
    setHint(); say(`Picked up ${tok._t.t}. Choose an agent: arrow keys move, Enter hands it over, Escape cancels.`);
  }
  function endCarry(back){
    const tok = K; if (!tok) return; K = null; tok.setAttribute('aria-pressed', 'false'); root.classList.remove('carrying');
    $$('.dl3b-n', grid).forEach(n => { n.setAttribute('role', 'group'); n.classList.remove('carry-on'); });
    setHint(); if (back){ tok.focus({ preventScroll:true }); say('Put back.'); }
  }
  c.on(toks, 'click', e => {
    const tok = e.target.closest('.dl3b-tok'); if (!tok || tok.disabled || tok._dragged) return;
    if (K === tok){ endCarry(true); return; }
    if (K) endCarry(false);
    startCarry(tok);
    if (e.detail === 0){ const first = node(tok._t.route[0]) || node('res'); first.focus({ preventScroll:true }); first.classList.add('carry-on'); }
  });
  c.on(grid, 'click', e => { if (!K || e.target.closest('.dl3b-pz')) return; const n = e.target.closest('.dl3b-n'); if (n) dispatch(K, n.dataset.a); });
  const ORDER = ['res', 'wri', 'ana', 'des', 'rev'];
  c.on(grid, 'keydown', e => {
    const n = e.target.closest('.dl3b-n'); if (!K || !n || e.target !== n) return;
    const i = ORDER.indexOf(n.dataset.a);
    if (/^Arrow/.test(e.key)){ e.preventDefault(); const j = (i + (/Right|Down/.test(e.key) ? 1 : -1) + ORDER.length) % ORDER.length; n.classList.remove('carry-on'); const m = node(ORDER[j]); m.classList.add('carry-on'); m.focus({ preventScroll:true }); say(BY[ORDER[j]].n); }
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); n.classList.remove('carry-on'); const tok = K; dispatch(tok, n.dataset.a); const nx = $('.dl3b-tok:not(.out)', toks); if (nx) nx.focus({ preventScroll:true }); }
    if (e.key === 'Escape'){ e.preventDefault(); endCarry(true); }
  });
  c.on(grid, 'focusout', e => { const n = e.target.closest && e.target.closest('.dl3b-n'); if (n && e.target === n) n.classList.remove('carry-on'); });
  c.on(document, 'keydown', e => { if (K && e.key === 'Escape' && !grid.contains(e.target)) endCarry(true); });

  /* pausing an agent, and autopilot */
  c.on(grid, 'click', e => {
    const b = e.target.closest('.dl3b-pz'); if (!b) return;
    const id = b.closest('.dl3b-n').dataset.a, s = N[id]; s.paused = !s.paused;
    b.setAttribute('aria-pressed', s.paused); b.setAttribute('aria-label', (s.paused ? 'Resume ' : 'Pause ') + BY[id].n); b.dataset.tip = (s.paused ? 'Resume ' : 'Pause ') + BY[id].n;
    b.innerHTML = I(s.paused ? 'play' : 'pause', 's'); paint(); say(`${BY[id].n} ${s.paused ? 'paused' : 'resumed'}.`);
  });
  c.on(sw, 'click', () => { auto = sw.getAttribute('aria-checked') !== 'true'; sw.setAttribute('aria-checked', auto); setHint(); say(auto ? 'Autopilot on: new tasks go to the first agent on their route.' : 'Autopilot off.'); });
  c.every(1100, () => { if (!auto) return; const tok = $$('.dl3b-tok:not(.out)', toks).find(t => t !== K && t !== D.tok); if (tok) dispatch(tok, tok._t.route[0]); });

  /* the starting state: two agents already at work */
  N.wri.run = { task:task('Release notes', 'file', ['wri', 'des', 'rev']), w:.6 }; N.wri.spent = .44;
  N.des.run = { task:task('Hero image refresh', 'image', ['des', 'rev']), w:1.2 }; N.des.spent = .52;
  N.res.spent = .16;
  const T1 = addTok(task('Launch post for Friday', 'mail', ['res', 'wri', 'des', 'rev']));
  const T2 = addTok(task('Q3 churn numbers', 'table', ['ana', 'des', 'rev']));
  addTok(task('Competitor pricing scan', 'globe', ['res', 'ana', 'des', 'rev']));
  let last = 0;
  c.loop(t => { const dt = last ? Math.min(100, t - last) / 1000 : 0; last = t; tick(dt); paint(); });
  paint();

  /* the demo: two tasks dragged onto agents, autopilot on, a new task arrives and goes by itself, and the work runs along
     the lines to the reviewer */
  const handDrag = async (s, tok, id) => {
    if (!tok.isConnected || tok.disabled) return;
    await s.point(tok, false);
    const hand = $('.hand', st), b = tok.getBoundingClientRect();
    hand.classList.add('down');
    const px = b.left + Math.min(b.width * .62, b.width - 10), py = b.top + b.height * .58;
    dragStart(tok, px, py);
    D.fly.style.transition = 'left .62s cubic-bezier(.22,1,.36,1),top .62s cubic-bezier(.22,1,.36,1)';
    await s.beat(.4);
    const S = st.getBoundingClientRect(), m = $('.dl3b-mk', node(id)).getBoundingClientRect();
    const tx = m.left + m.width / 2 + 30, ty = m.top + m.height / 2 + 4;
    hand.style.transition = 'transform .62s cubic-bezier(.22,1,.36,1),opacity .16s';
    hand.style.transform = `translate(${tx - S.left}px,${ty - S.top}px)`;
    D.fly.style.left = (tx - D.dx - S.left) + 'px'; D.fly.style.top = (ty - D.dy - S.top) + 'px';
    await s.beat(.7);
    const n = node(id); D.over = n; n.classList.add('over');
    await s.beat(.6);
    hand.style.transition = ''; hand.classList.remove('down');
    dragEnd();
  };
  const idle = () => AG.every(a => !N[a.id].run && !N[a.id].q.length) && !$('.dl3b-tok', toks) && !$('.dl3b-lit', svg);
  const again = () => {
    const out = st.animate([{ opacity:1 }, { opacity:0 }], { duration:320, easing:'ease-out', fill:'forwards' });
    out.finished.then(() => { if (card._c === c && !c.dead && !c.mine){ DM.mount(card, true); st.animate([{ opacity:0 }, { opacity:1 }], { duration:320, easing:'ease-out' }); } out.cancel(); }).catch(() => {});
  };
  c.story(async s => {
    await s.beat(1);
    await handDrag(s, T1, 'res');
    await s.beat(2);
    await handDrag(s, T2, 'ana');
    await s.beat(2);
    await s.tap(sw);
    s.away();
    await s.beat(5);
    addTok(task('Pricing page FAQ', 'hash', ['wri', 'des', 'rev']), true);
    say('A new task came in: Pricing page FAQ.');
    const t0 = performance.now();
    await s.until(() => idle() || performance.now() - t0 > 16000);
    await s.beat(3);
    if (REDUCE) return;
    again();
  });
});
})();
