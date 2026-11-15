/* Agent tree explorations: the run and its lines. The page sets data-v="a" (angled) or "b" (bold) on .atx.
   The run spawns its agents one at a time, each line drawing down and out to its row before the row rises in; one step
   fails, the orchestrator reroutes it, and the run finishes. Lines are redrawn every frame from where the rows are. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  // data-v="auto": Soft draws the rounded lines (b), Blueprint the angled ones (a), both in one accent tint
  const root = $('.atx'), V = root.dataset.v === 'auto' ? (document.documentElement.dataset.style === 'soft' ? 'b' : 'a') : root.dataset.v, tree = $('.atx-tree', root);
  root.classList.add('v-' + V);
  const IC = (n, cls = '') => { const [vb, body] = ATX_ICONS[n]; return `<svg class="i ${cls}" viewBox="${vb}" aria-hidden="true">${body}</svg>`; };
  const AV = { l:'var(--dm-av-l)', p:'var(--dm-av-p)', m:'var(--dm-av-m)' };
  const N = [
    { id:'root', n:'Orchestrator', t:'Splits the work', ic:'spark', s:'run' },
    { id:'res', p:'root', n:'Research', t:'5 competitor pages', ic:'globe', av:'l' },
    { id:'res1', p:'res', n:'Read the pages', t:'Reading 1 of 5', ic:'file-text' },
    { id:'des', p:'root', n:'Design', t:'Plan cards in Figma', ic:'palette', av:'p' },
    { id:'des1', p:'des', n:'Update cards', t:'Pricing v4', app:'figma' },
    { id:'des2', p:'des', n:'Brand tokens', t:'Colours and spacing', app:'figma' },
    { id:'des3', p:'des', n:'Retry tokens', t:'Rerouted to .500', app:'figma' },
    { id:'cop', p:'root', n:'Copy', t:'Rewrite the plan blurbs', ic:'edit', av:'m' }
  ];
  const by = id => N.find(n => n.id === id);
  N.forEach(n => { n.parent = n.p ? by(n.p) : null; n.lv = n.parent ? n.parent.lv + 1 : 0; n.kids = []; n.s = n.s || 'queued'; n.cost = 0; n.secs = 0; });
  N.forEach(n => n.parent && n.parent.kids.push(n));
  const mark = s => s === 'run' ? '<span class="spin"></span>' : s === 'done' ? IC('check') : s === 'fail' ? IC('x') : '<span class="ring"></span>';
  for (const n of N){
    const who = n.app ? `<span class="atx-av app">${ATX_BRAND[n.app]}</span>` : n.av || !n.lv ? `<span class="atx-av" style="${n.av ? `--a:${AV[n.av]};--ai:var(--dm-av-${n.av}-ink)` : ''}">${IC(n.ic)}</span>` : `<span class="atx-av app">${IC(n.ic)}</span>`;
    n.el = document.createElement('div'); n.el.className = 'atx-n ' + n.s; n.el.style.setProperty('--lv', n.lv);
    n.el.innerHTML = `<span class="atx-g">${mark(n.s)}</span>${who}<span class="atx-tx"><b>${n.n}</b><span>${n.t}</span></span><span class="atx-q"></span>`;
    if (n.lv) n.el.hidden = true; tree.appendChild(n.el);
  }
  const shown = n => !n.el.hidden;
  const money = v => '$' + v.toFixed(2), secs = s => Math.floor(s) + 's';
  const sum = n => n.cost + n.kids.filter(shown).reduce((a, k) => a + sum(k), 0);
  function state(n, s, t){
    n.s = s; n.el.className = 'atx-n ' + s + (n.el.classList.contains('dim') ? ' dim' : '');
    const g = $('.atx-g', n.el); g.innerHTML = mark(s); g.classList.remove('drw');
    if (s === 'done'){ g.querySelectorAll('path,polyline').forEach(e => e.setAttribute('pathLength', 1)); void g.offsetWidth; g.classList.add('drw'); }
    if (t){ const sp = $('.atx-tx span', n.el); sp.textContent = t; sp.classList.remove('sw'); void sp.offsetWidth; sp.classList.add('sw'); }
    if (typeof draw === 'function' && svg) draw(0);
  }
  const say = (n, t) => { const sp = $('.atx-tx span', n.el); sp.textContent = t; sp.classList.remove('sw'); void sp.offsetWidth; sp.classList.add('sw'); };
  function spawn(n, s){ n.el.hidden = false; n.s = s || n.s; state(n, n.s); n.t0 = performance.now(); n.el.classList.add('in'); n.el.style.animationDelay = '120ms'; draw(0); }

  // ---------- the lines ----------
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a = {}) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const svg = mk('svg', { class:'atx-ln', 'aria-hidden':'true' }), defs = mk('defs'); svg.append(defs); tree.prepend(svg);
  let pid = 0;
  const easeIO = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
  // the highlight, as the owner drew it in Figma (Flow detail, 4x): a 210px band along the line, the dot at its core;
  // clear, light at 50%, the colour, light at 70%, clear
  const BAND = 210, CORE = .541, HL = [[0, 'l0'], [.19, 'l1'], [CORE, 'c'], [.781, 'l2'], [1, 'l0']];
  // a point on the path, carried on past either end along the path's own direction there
  const along = (pth, len, t) => { if (t >= 0 && t <= len) return pth.getPointAtLength(t);
    const q = pth.getPointAtLength(t < 0 ? 0 : len), r = pth.getPointAtLength(t < 0 ? Math.min(len, 1) : Math.max(0, len - 1)), dx = q.x - r.x, dy = q.y - r.y, m = Math.hypot(dx, dy) || 1, k = t < 0 ? -t : t - len;
    return { x:q.x + dx / m * k, y:q.y + dy / m * k }; };
  const gTrunk = mk('g'), gBr = mk('g'), gJn = mk('g'), gFx = mk('g'); svg.append(gTrunk, gBr, gJn, gFx);
  const geo = {};       // where each node's mark is, this frame
  const ease = (v, to, a) => v == null ? to : v + (to - v) * a;
  let last = 0, T = 0;
  const lines = new Map();
  function line(p){
    if (lines.has(p)) return lines.get(p);
    const id = 'g' + p.id, gr = mk('linearGradient', { id, gradientUnits:'userSpaceOnUse', x1:0, x2:0 }), st = ['f', 'f', 'g', 'g'].map(c => mk('stop', { class:c }));
    gr.append(...st); defs.append(gr);
    const trunk = mk('path', { class:'b on', stroke:V === 'b' ? `url(#${id})` : '' }); gTrunk.append(trunk);
    const L = { gr, st, trunk, end:null, reach:null }; lines.set(p, L); return L;
  }
  // a pulse (B) or packets of work (A) along the path from the orchestrator down to each running step
  const flows = new Map();
  function hop(p, k){ // the path from a parent's mark to a child's, through the bend
    const a = geo[p.id], b = geo[k.id]; if (!a || !b) return '';
    const R = V === 'a' ? 18 : (parseFloat(getComputedStyle(root).getPropertyValue('--r')) || 0);
    return V === 'a' ? `V${b.cy - R}L${a.cx + R} ${b.cy}H${b.cx - b.r + 1}` : `V${b.cy - R}Q${a.cx} ${b.cy} ${a.cx + R} ${b.cy}H${b.cx - b.r + 1}`;
  }
  // draw(dt): the lines for where the rows are now. Each frame eases them on by dt; a row arriving or changing state redraws
  // them at once with dt 0, so for no frame does a line point where a row used to be
  function frame(t){ const dt = last ? Math.min(.05, (t - last) / 1000) : 0; last = t; T += dt; draw(dt); requestAnimationFrame(frame); }
  function draw(dt){
    const fast = 1 - Math.exp(-dt * 13), slow = 1 - Math.exp(-dt * 6);
    const tr = tree.getBoundingClientRect(), R = V === 'a' ? 18 : (parseFloat(getComputedStyle(root).getPropertyValue('--r')) || 0);
    // positions in the tree's own space, so a zoom or scale on the page doesn't move the lines off their rows
    const sc = tr.width / (tree.offsetWidth || tr.width) || 1;
    for (const n of N){ if (!shown(n)) continue; const g = $('.atx-g', n.el).getBoundingClientRect(); geo[n.id] = { cx:(g.left + g.width / 2 - tr.left) / sc, cy:(g.top + g.height / 2 - tr.top) / sc, top:(g.top - tr.top) / sc, bottom:(g.bottom - tr.top) / sc, left:(g.left - tr.left) / sc };
      const rt = n.s === 'queued' ? 7 : n.s === 'run' ? 9.5 : 15; n.rr = n.rr == null ? rt : n.rr + (rt - n.rr) * fast; geo[n.id].r = n.rr; }
    gJn.replaceChildren();
    for (const p of N){
      if (!p.kids.length || !shown(p)) continue; const L = line(p), a = geo[p.id], x0 = a.cx, y0 = a.cy + a.r - 1;
      let endT = y0, reachT = y0;
      for (const k of p.kids){ if (!shown(k)) continue; const b = geo[k.id]; endT = Math.max(endT, b.cy - R); if (k.s !== 'queued') reachT = Math.max(reachT, b.cy); }
      // the line eases down only towards a child that is new; children it already reaches pull it along at once when rows move
      let held = y0; for (const k of p.kids) if (shown(k) && k.dr > .5) held = Math.max(held, geo[k.id].cy - R);
      L.end = Math.max(ease(L.end, endT, fast), Math.min(held, endT)); L.reach = ease(L.reach, Math.min(reachT, endT), slow);
      // a line only shows once it has some length, so a line just starting never leaves a dot under its parent
      const span = L.end - y0; L.trunk.setAttribute('d', span > 4 ? `M${x0} ${y0}V${L.end}` : '');
      if (V === 'b' && span > 4){ const r = Math.min(1, Math.max(0, (L.reach - y0) / span)), f = Math.min(1 - r, 34 / span);
        L.gr.setAttribute('y1', y0); L.gr.setAttribute('y2', L.end); [0, r, Math.min(1, r + f), 1].forEach((o, i) => L.st[i].setAttribute('offset', o)); }
      for (const k of p.kids){
        if (!k.br){ k.br = mk('path', { class:'b' }); gBr.append(k.br); k.dr = 0; }
        if (!shown(k)){ k.br.setAttribute('d', ''); continue; }
        const b = geo[k.id], reached = L.end >= b.cy - R - 1;
        k.dr = ease(k.dr, reached ? 1 : 0, fast * .85); if (k.dr < .04){ k.br.setAttribute('d', ''); continue; }
        k.br.classList.toggle('on', k.s !== 'queued' && k.s !== 'fail'); k.br.classList.toggle('bad', k.s === 'fail');
        const d = V === 'a' ? `M${x0} ${b.cy - R}L${x0 + R} ${b.cy}H${b.cx - b.r + 1}` : `M${x0} ${b.cy - R}Q${x0} ${b.cy} ${x0 + R} ${b.cy}H${b.cx - b.r + 1}`;
        k.br.setAttribute('d', d); const len = k.br.getTotalLength(); k.br.style.strokeDasharray = len; k.br.style.strokeDashoffset = len * (1 - k.dr);
      }
    }
    // the flows: every running step that has nothing running under it gets one, along its whole path from the top
    const leaves = N.filter(n => shown(n) && n.s === 'run' && n.lv && !n.kids.some(k => shown(k) && k.s === 'run'));
    // one band per agent, from the top down to the step that agent is working on now. It belongs to the agent, not the step,
    // so when a step finishes and the next starts it carries on instead of starting again
    const agentOf = n => { let x = n; while (x.lv > 1) x = x.parent; return x; };
    const want = new Map(); for (const n of leaves) want.set(agentOf(n), n);
    const f0 = ag => flows.get(ag);
    for (const [ag, f] of flows) if (!want.has(ag)){ f.el.remove(); f.gr.remove(); flows.delete(ag); }
    for (const [ag, n] of want){
      const chain = []; for (let x = n; x; x = x.parent) chain.unshift(x);
      if (!chain.every(x => geo[x.id])) continue;
      // a band starts only once its whole route is drawn
      if (!chain.every(x => !x.lv || (x.br && x.dr > .97))){ if (f0(ag)) f0(ag).el.style.opacity = 0; continue; }
      // one continuous route: each leg runs on under the step's mark (whose solid face hides it) to its centre, where the next
      // leg leaves; dashes restart on every separate piece of a path, so it has to be one piece
      let d = `M${geo.root.cx} ${geo.root.cy}`; for (let i = 1; i < chain.length; i++) d += hop(chain[i - 1], chain[i]) + `H${geo[chain[i].id].cx}`;
      let f = flows.get(ag);
      if (!f){ const id = 'pg' + (++pid), gr = mk('linearGradient', { id, gradientUnits:'userSpaceOnUse' }); HL.forEach(([o, c]) => gr.append(mk('stop', { class:c, offset:o }))); defs.append(gr);
        f = { gr, el:mk('g', { class:'pulse' }), start:null }; f.core = mk('path', { class:'core', stroke:`url(#${id})` }); f.el.append(f.core); f.el.style.setProperty('--fc', 'var(--run)'); gFx.append(f.el); flows.set(ag, f); }
      f.core.setAttribute('d', d); const len = f.core.getTotalLength();
      // a trip: about 170px a second, eased gently at both ends, fading in as it leaves and out as it arrives, then a short rest
      if (f.start == null || T - f.start >= f.trip + .35){ f.start = T; f.len0 = len; f.trip = Math.min(3.4, Math.max(1.8, len / 170)); }
      const u = (T - f.start) / f.trip;
      if (u >= 1){ f.el.style.opacity = 0; continue; }
      f.el.style.opacity = Math.min(1, u / .18, (1 - u) / .22).toFixed(3);
      const at = Math.min(len, (.5 - Math.cos(Math.PI * u) / 2) * f.len0);
      // the band: BAND long, its core at CORE; it rides the path, its gradient running from its back end to its front
      const t0 = at - BAND * CORE, t1 = t0 + BAND;
      f.core.style.strokeDasharray = `${BAND} ${len + BAND * 2}`; f.core.style.strokeDashoffset = -t0;
      const a = along(f.core, len, t0), b = along(f.core, len, t1);
      f.gr.setAttribute('x1', a.x); f.gr.setAttribute('y1', a.y); f.gr.setAttribute('x2', b.x + (a.x === b.x ? .01 : 0)); f.gr.setAttribute('y2', b.y + (a.y === b.y ? .01 : 0));
    }
  }
  requestAnimationFrame(frame);

  // ---------- the numbers ----------
  const t0 = performance.now(); let ended = 0;
  const meta = $('.atx-m', root), ey = $('.atx-ey b', root);
  setInterval(() => { const now = performance.now();
    for (const n of N) if (n.s === 'run' && shown(n)){ n.cost += n.lv ? .0016 : .0005; n.secs = (now - n.t0) / 1000; }
    for (const n of N) if (shown(n)) $('.atx-q', n.el).textContent = n.s === 'queued' ? '' : (n.secs >= 1 ? secs(n.secs) + ' · ' : '') + money(n.kids.length ? sum(n) : n.cost);
    const run = N.filter(n => shown(n) && n.lv && n.s === 'run').length, el = ((ended || now) - t0) / 1000;
    meta.innerHTML = `${ended ? 'Done' : run + ' running'} · <span class="num">${Math.floor(el / 60)}:${String(Math.floor(el % 60)).padStart(2, '0')}</span> · <span class="num">${money(sum(by('root')))}</span>`;
  }, 250);

  // ---------- the run ----------
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function run(){
    by('root').t0 = performance.now();
    await wait(250); spawn(by('res'), 'run');
    await wait(450); spawn(by('des'), 'run');
    await wait(450); spawn(by('cop'), 'queued');
    await wait(450); spawn(by('res1'), 'run');
    await wait(450); spawn(by('des1'), 'run');
    await wait(450); spawn(by('des2'), 'queued');
    await wait(500); say(by('res1'), 'Reading 3 of 5');
    await wait(500); say(by('res1'), 'Reading 5 of 5');
    await wait(400); state(by('res1'), 'done', '5 pages, 12k words');
    await wait(350); state(by('res'), 'done', 'Notes in Pricing v4');
    await wait(300); state(by('des1'), 'done', 'Pro and Team done'); state(by('des2'), 'run', 'Matching colours');
    await wait(1100); state(by('des2'), 'fail', 'Missing accent.600');
    await wait(800); by('des2').el.classList.add('dim'); spawn(by('des3'), 'run');
    await wait(1300); state(by('des3'), 'done', 'Used accent.500');
    await wait(300); state(by('des'), 'done', 'Cards and tokens done'); state(by('cop'), 'run', 'Writing 3 blurbs');
    await wait(1300); state(by('cop'), 'done', '3 blurbs rewritten');
    await wait(300); state(by('root'), 'done', 'Run finished'); ended = performance.now(); root.classList.add('done'); ey.textContent = 'Run complete';
    window.ATX_DONE = true;
  }
  window.ATX = { start:run };
  if (!/[?&]rec\b/.test(location.search)) setTimeout(run, 400);
})();
