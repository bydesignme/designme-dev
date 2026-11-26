// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, BRAND, DM, I, REDUCE, grow, hoverGlide, html, reveal } from '../core/core.js';
/* the lines and the flow, drawn every frame from where the marks are. The tree's rows are treeitems (.atr-n, with data-id
   and data-s) whose mark is .atr-g (data-m); atrLines reads them from the page, so whatever draws the rows (this script,
   or React) gets the same lines. A row that appears after the start opens its space (data-ph="open"), its parent's line
   draws down to it and its branch out to its mark (data-ph="wait"), then it rises in (data-ph="in"), one row at a time.
   A parent's line is a grey rail with its tinted part over it, down to the last child that has started; a branch takes the
   tint once the tint has reached it, the grey while its child is queued, and the bad colour for a failed child. Each
   agent's band eases from the run's source to the step that agent is on, once that whole route is drawn */
const ATR_TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"/></svg>';
const ATR_CROSS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" pathLength="1"/></svg>';
// what a mark holds in each state (a finished disc is the mark itself, with its tick or cross)
const atrMark = m => m === 'run' ? '<span class="atr-spin"></span>' : m === 'wait' ? '<span class="atr-wt"></span>' : m === 'done' ? ATR_TICK : m === 'fail' ? ATR_CROSS : m === 'src' ? '' : '<span class="atr-ring"></span>';
// a mark's visible radius: rings and spinners are 14px; finished discs and the waiting mark carry a 2px cut-out border
const atrMarkR = m => m === 'done' || m === 'fail' || m === 'src' || m === 'wait' ? 9 : 7;
const atrEz = u => 1 - Math.pow(1 - Math.min(1, Math.max(0, u)), 3);
// the way on under a row closes its height as it goes, so the tree shrinks with it smoothly instead of jumping (owner, 17 Nov)
const atrDrop = el => { el.classList.add('atr-gone'); if (REDUCE || !el.animate || !el.isConnected) return el.remove();
  el.inert = true; el.animate([{ height:el.offsetHeight + 'px', opacity:1 }, { height:'0px', paddingBottom:'0px', opacity:0 }], { duration:320, easing:'cubic-bezier(.22,1,.36,1)', fill:'forwards' }).finished.then(() => el.remove(), () => el.remove()); };
function atrLines(tree){
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a = {}) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  // the svg is the tree's first child (one is made if the markup has none)
  let svg = tree.querySelector(':scope>.atr-ln'); if (!svg){ svg = mk('svg', { class:'atr-ln', 'aria-hidden':'true' }); tree.prepend(svg); }
  const defs = mk('defs'), gRail = mk('g'), gLine = mk('g'), gBand = mk('g'); svg.replaceChildren(defs, gRail, gLine, gBand);
  const uid = 'atr' + (atrLines.n = (atrLines.n || 0) + 1), host = tree.closest('.atr') || tree;
  // OPEN: a row's space opening; BR: a branch drawing out; TINT: the tint gliding down to a step that starts; GO: a line
  // drawing back in as its branch folds
  const OPEN = .22, BR = .16, TINT = .3, GO = .14, BAND = 210, CORE = .541, STOPS = [[0, 'l0'], [.19, 'l1'], [CORE, 'c'], [.781, 'l2'], [1, 'l0']];
  const S = new Map(), bands = new Map(), queue = [];
  let T = 0, last = 0, booted = false, prev = null, bn = 0;
  const shown = x => x.ph === 'in' || x.ph === 'shown';
  const folded = x => { for (let p = x.parent; p; p = p.parent) if (p.el.getAttribute('aria-expanded') === 'false') return true; return false; };
  // a line that is cut short is drawn from its start: reveal 0 to 1
  const draw = (p, d, cls, reveal = 1) => {
    p.setAttribute('d', reveal > .001 ? d : ''); p.setAttribute('class', cls);
    if (reveal >= 1 || !d){ p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; return; }
    const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len * (1 - reveal);
  };
  const restart = (el, a) => { el.removeAttribute(a); void el.offsetWidth; el.setAttribute(a, ''); };
  // reads the rows on the page: new ones, ones that went, their parents and children, and the marks and text that changed
  function sync(){
    const els = [...tree.querySelectorAll('.atr-n')].filter(el => !el.closest('[hidden]')), seen = new Set();
    for (const el of els){
      const id = el.dataset.id; seen.add(id);
      let x = S.get(id);
      if (!x || x.el !== el){
        if (x) gone(x);
        x = { id, el, q:0, b:0, ph:'shown', rt:null, rf:null, r0:-1e9, fol:false };
        // rows there from the start are drawn at once; later ones open, draw and rise, one at a time
        if (booted && !REDUCE){ x.ph = 'open'; el.dataset.ph = 'open'; el.style.height = '0px'; queue.push(x); }
        else { x.q = 1; x.b = 1; x.boot = true; el.removeAttribute('data-ph'); el.style.height = ''; }
        S.set(id, x);
      }
      x.st = el.dataset.s; x.g = el.querySelector(':scope>.atr-b>.atr-r>.atr-g'); x.sub = el.querySelector(':scope>.atr-b>.atr-r .atr-sub');
      // a mark swaps at once and a tick or cross draws itself; a line of text that changes rises into place
      const m = x.g ? x.g.dataset.m : '';
      if (x.m !== undefined && m !== x.m && (m === 'done' || m === 'fail') && !REDUCE) restart(x.g, 'data-drw');
      x.m = m;
      const t = x.sub ? x.sub.textContent : '';
      if (x.t !== undefined && t !== x.t && x.ph === 'shown' && !REDUCE) restart(x.sub, 'data-sw');
      x.t = t;
    }
    for (const x of [...S.values()]) if (!seen.has(x.id)) gone(x);
    for (const x of S.values()){ const p = x.el.parentElement && x.el.parentElement.closest('.atr-n'); x.parent = p && S.get(p.dataset.id) || null; x.kids = []; }
    for (const el of els){ const x = S.get(el.dataset.id); if (x.parent) x.parent.kids.push(x); }
    booted = true;
  }
  function gone(x){ for (const k of ['pr', 'pt', 'pb']) if (x[k]) x[k].remove(); S.delete(x.id); const i = queue.indexOf(x); if (i >= 0) queue.splice(i, 1); }

  function frame(t){
    const dt = last ? Math.max(0, Math.min(.05, (t - last) / 1000)) : 0; last = Math.max(last, t); T += dt;
    sync();
    const red = REDUCE, cs = getComputedStyle(host), R = parseFloat(cs.getPropertyValue('--dm-atr-r')) || 8, cut = cs.getPropertyValue('--dm-atr-cut').trim() === '1';
    // one row's space opens at a time, once the row before it has risen in and its parent is there
    if (red) for (const x of queue.splice(0)){ x.ph = 'shown'; x.el.removeAttribute('data-ph'); x.el.style.height = ''; x.q = x.b = 1; }
    if (!prev || !S.has(prev.id) || shown(prev)){
      const nx = queue[0];
      if (nx && (!nx.parent || shown(nx.parent))){ queue.shift(); prev = nx; nx.ph = 'opening'; nx.t1 = T; nx.el.style.height = ''; nx.nh = nx.el.offsetHeight; nx.el.style.height = '0px'; }
    }
    for (const x of S.values()) if (x.ph === 'opening'){
      const u = (T - x.t1) / OPEN;
      if (u >= 1){ x.el.style.height = ''; x.ph = 'wait'; x.el.dataset.ph = 'wait'; } else x.el.style.height = (x.nh * atrEz(u)).toFixed(2) + 'px';
    }
    // where every mark is this frame, in the tree's own space (a zoom or a transform on the page doesn't move the lines)
    const tb = tree.getBoundingClientRect(), sc = tb.width / (tree.offsetWidth || tb.width) || 1;
    for (const x of S.values()){ const b = x.g.getBoundingClientRect(); x.cx = (b.left + b.width / 2 - tb.left) / sc; x.cy = (b.top + b.height / 2 - tb.top) / sc; x.r = atrMarkR(x.m); }
    const corner = (x0, y, x1) => cut ? `L${x1} ${y}` : `Q${x0} ${y} ${x1} ${y}`;
    for (const P of S.values()){
      if (!P.kids.length && !P.pr) continue;
      if (!P.pr){ P.pr = mk('path', { 'data-p':P.id }); gRail.append(P.pr); P.pt = mk('path', { 'data-p':P.id }); gLine.append(P.pt); }
      const x0 = P.cx, y0 = P.cy + P.r - 1;
      // the rail draws down to each child in turn as its space opens, and back up as a branch folds
      let cur = y0, end = y0;
      for (const k of P.kids){
        const want = k.ph !== 'open' && k.ph !== 'opening' && !folded(k), y = k.cy - R;
        if (want && k.q < 1){ if (k.q0 == null){ k.qd = red ? 0 : Math.min(.26, Math.max(.1, (y - cur) / 520)); k.q0 = T - k.q * k.qd; } k.q = k.qd ? Math.min(1, (T - k.q0) / k.qd) : 1; }
        else if (!want){ k.q0 = null; k.q = red ? 0 : Math.max(0, k.q - dt / GO); }
        k.on = want;
        if (k.q > 0){ cur = k.q >= 1 ? y : cur + (y - cur) * atrEz(k.q); end = Math.max(end, cur); }
      }
      draw(P.pr, end - y0 > 2 ? `M${x0} ${y0}V${end}` : '', 'r');
      // the tint: down to the last child that has started. It follows the rail down to a child that joins already at work,
      // and glides down to one that starts later
      let to = null; for (const k of P.kids) if (k.q > 0 && k.st !== 'queued') to = k;
      if (to !== P.rt){ P.rf = P.ru >= 1 || P.boot ? P.rt : P.rf; P.rt = to; P.r0 = P.boot ? -1e9 : T; P.fol = !!to && to.q < 1; }
      P.ru = P.fol || red ? 1 : Math.min(1, (T - P.r0) / TINT);
      const yOf = k => k && S.has(k.id) ? k.cy - R : y0, reach = Math.min(end, yOf(P.rf) + (yOf(P.rt) - yOf(P.rf)) * atrEz(P.ru));
      draw(P.pt, reach - y0 > 2 ? `M${x0} ${y0}V${reach}` : '', 'on');
      // each branch draws out once the rail is at it (and, for a child at work, the tint too); then its row rises in
      for (const k of P.kids){
        if (!k.pb){ k.pb = mk('path', { 'data-k':k.id }); gLine.append(k.pb); }
        const y = k.cy - R; k.lit = k.st !== 'queued' && reach >= y - .5;
        if (k.on && k.q >= 1){ if (k.b0 == null && (k.st === 'queued' || k.lit)) k.b0 = T - k.b * BR; if (k.b0 != null) k.b = red ? 1 : Math.min(1, (T - k.b0) / BR); }
        else if (!k.on){ k.b0 = null; k.b = red ? 0 : Math.max(0, k.b - dt / GO); }
        // (a cut corner starts half a line's width up the parent's line, so its sharp joint is drawn whole, with no notch)
        draw(k.pb, `M${x0} ${cut ? y - .75 : y}` + (cut ? `L${x0} ${y}` : '') + corner(x0, k.cy, x0 + R) + `L${k.cx - k.r + 1} ${k.cy}`, k.st === 'fail' ? 'bad' : k.lit ? 'on' : 'r', k.b);
        if (k.ph === 'wait' && k.b >= 1){ k.ph = 'in'; k.el.dataset.ph = 'in'; k.tin = T; }
      }
      P.boot = false;
    }
    for (const x of S.values()) if (x.ph === 'in' && T - x.tin > .6){ x.ph = 'shown'; x.el.removeAttribute('data-ph'); }
    // the bands: one per agent, to the step it is working on now (the last running step under it with nothing running
    // under that). A band belongs to its agent, so when one step finishes and the next starts it carries on; when its agent
    // has nothing running it finishes the trip it is on and goes
    const root = [...S.values()].find(x => !x.parent), agentOf = x => { while (x.parent && x.parent.parent) x = x.parent; return x; };
    const want = new Map();
    for (const x of S.values()) if (x.parent && x.st === 'run' && shown(x) && !x.kids.some(k => k.st === 'run' && shown(k))) want.set(agentOf(x).id, x);
    for (const [id, f] of bands) if (!want.has(id)) f.end = true;
    for (const [id, x] of want){ let f = bands.get(id); if (!f) f = band(id); f.to = x; f.end = false; }
    for (const [id, f] of bands){
      const chain = []; for (let x = f.to; x; x = x.parent) chain.unshift(x);
      const ready = root && chain[0] === root && chain.slice(1).every(x => S.has(x.id) && x.q >= 1 && x.b >= 1 && x.lit && shown(x) && !folded(x));
      if (!ready || red){ f.el.style.opacity = 0; f.start = null; if (f.end){ f.el.remove(); f.gr.remove(); bands.delete(id); } continue; }
      // one route from the source's edge, down each line and along each branch to the next mark's centre (under the mark),
      // in one piece: dashes start again on every piece of a path
      let d = `M${root.cx} ${root.cy + root.r - 1}`, px = root.cx;
      for (const x of chain.slice(1)){ d += `L${px} ${x.cy - R}` + corner(px, x.cy, px + R) + `L${x.cx} ${x.cy}`; px = x.cx; }
      f.core.setAttribute('d', d); const len = f.core.getTotalLength();
      // a trip: about 170px a second, 1.8 to 3.4s, eased at both ends, fading in as it leaves and out as it arrives, then
      // a short rest. A band whose agent has nothing left running ends with the trip it is on
      if (f.start == null || (!f.end && T - f.start >= f.trip + .35)){ if (f.end){ f.el.remove(); f.gr.remove(); bands.delete(id); continue; } f.start = T; f.len0 = len; f.trip = Math.min(3.4, Math.max(1.8, len / 170)); }
      const u = (T - f.start) / f.trip;
      if (u >= 1){ f.el.style.opacity = 0; if (f.end){ f.el.remove(); f.gr.remove(); bands.delete(id); } continue; }
      f.el.style.opacity = Math.min(1, u / .18, (1 - u) / .22).toFixed(3);
      const at = Math.min(len, (.5 - Math.cos(Math.PI * u) / 2) * f.len0), t0 = at - BAND * CORE, a = along(f.core, len, t0), b = along(f.core, len, t0 + BAND);
      f.core.style.strokeDasharray = `${BAND} ${len + BAND * 2}`; f.core.style.strokeDashoffset = -t0;
      f.gr.setAttribute('x1', a.x); f.gr.setAttribute('y1', a.y); f.gr.setAttribute('x2', b.x + (a.x === b.x ? .01 : 0)); f.gr.setAttribute('y2', b.y + (a.y === b.y ? .01 : 0));
    }
  }
  // a point on the route, carried on past either end in the route's own direction there (the band's gradient runs from its
  // back end to its front, which can be off the route while it leaves or arrives)
  function along(p, len, t){
    if (t >= 0 && t <= len) return p.getPointAtLength(t);
    const q = p.getPointAtLength(t < 0 ? 0 : len), r = p.getPointAtLength(t < 0 ? Math.min(len, 1) : Math.max(0, len - 1)), dx = q.x - r.x, dy = q.y - r.y, m = Math.hypot(dx, dy) || 1, k = t < 0 ? -t : t - len;
    return { x:q.x + dx / m * k, y:q.y + dy / m * k };
  }
  function band(id){
    const gid = `${uid}-b${++bn}`, gr = mk('linearGradient', { id:gid, gradientUnits:'userSpaceOnUse' });
    STOPS.forEach(([o, k]) => gr.append(mk('stop', { class:k, offset:o }))); defs.append(gr);
    const el = mk('g', { class:'atr-bd', 'data-a':id }), core = mk('path', { stroke:`url(#${gid})` }); el.append(core); el.style.opacity = 0; gBand.append(el);
    const f = { el, gr, core, start:null, end:false, to:null }; bands.set(id, f); return f;
  }
  // a row's phase: open (its space is opening), wait (its line is drawing to it), in (rising in) or shown
  return { sync, frame, phase:id => (S.get(id) || {}).ph };
}
DM.def('agent-tree', (r, c) => {
  // the run: the orchestrator splits the work between three agents, and each agent between its steps. Each agent has its
  // avatar colour (av) and icon (ic); each step the app it works in (app) or an icon. s is the state it joins in and t what
  // it is on. One step fails and the orchestrator reroutes it to a retry; the last one waits for a person to approve it
  const RUN = [
    { id:'root', n:'Orchestrator', t:'Splitting the work', ic:'spark', s:'run' },
    { id:'res', p:'root', n:'Research', t:'5 competitor pages', ic:'globe', av:'l' },
    { id:'res1', p:'res', n:'Read the pages', t:'Reading 1 of 5', ic:'file-text' },
    { id:'des', p:'root', n:'Design', t:'Plan cards in Figma', ic:'palette', av:'p' },
    { id:'des1', p:'des', n:'Update cards', t:'Pricing v4', app:'figma' },
    { id:'des2', p:'des', n:'Brand tokens', t:'Colours and spacing', app:'figma' },
    { id:'des3', p:'des', n:'Retry tokens', t:'Rerouted to accent.500', app:'figma' },
    { id:'cop', p:'root', n:'Copy', t:'Rewrite the plan blurbs', ic:'edit', av:'m' },
    { id:'cop1', p:'cop', n:'Post to Slack', t:'Needs your OK', app:'slack', cost:.006, tok:140 }
  ];
  const root = $('.atr', r), tree = $('.atr-tree', r), meta = $('.atr-m', r), time = $('.atr-time', r), tot = $('.atr-tot', r), foot = $('.atr-f', r), sr = $('.atr-sr', r);
  // Clean's one hover glides from row to row, and the picked agent keeps its stronger fill (Agent harness keeps its own)
  if (!r.closest('.ahx')) c.offs.push(hoverGlide(tree, '.atr-b', { keep:'[aria-selected="true"]>.atr-b' }));
  const N = RUN.map(x => ({ cost:0, tok:0, ...x, s:x.s || 'queued', kids:[], secs:0, t0:0 })), by = id => N.find(n => n.id === id);
  N.forEach(n => { n.parent = n.p ? by(n.p) : null; n.lv = n.parent ? n.parent.lv + 1 : 0; if (n.parent) n.parent.kids.push(n); });
  const money = v => '$' + v.toFixed(2), clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const toks = v => v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : String(Math.round(v));
  const here = n => !n.el.hidden, under = n => n.kids.filter(here);
  const sum = n => n.cost + under(n).reduce((a, k) => a + sum(k), 0), sumTok = n => n.tok + under(n).reduce((a, k) => a + sumTok(k), 0);
  const word = { queued:'queued', run:'running', wait:'needs you', done:'done', fail:'failed' };

  // the rows, all built at the start and hidden until each joins the run
  const build = n => {
    const who = n.app ? `<span class="atr-av app" aria-hidden="true">${BRAND[n.app]}</span>` : `<span class="atr-av${n.av || !n.lv ? '' : ' app'}" aria-hidden="true"${n.av ? ` style="--dm-a:var(--dm-av-${n.av});--dm-ai:var(--dm-av-${n.av}-ink)"` : ''}>${I(n.ic, 'xs')}</span>`;
    const m = n.lv ? n.s : 'src';
    n.el = html(`<div class="atr-n" role="treeitem" aria-level="${n.lv + 1}" aria-selected="false" tabindex="${n.lv ? -1 : 0}" data-id="${n.id}" data-s="${n.s}" style="--dm-lv:${n.lv}"><div class="atr-b"><div class="atr-r"><span class="atr-g" data-m="${m}" aria-hidden="true">${atrMark(m)}</span>${who}<span class="atr-w"><span class="atr-tx"><span class="atr-nm"></span>${n.kids.length ? `<span class="atr-tg mx-press" aria-hidden="true">${I('chev-d', 'xs')}</span>` : ''}<span class="atr-sub"></span></span><span class="atr-q num"><span class="atr-c"></span></span></span></div></div></div>`);
    $('.atr-nm', n.el).textContent = n.n; $('.atr-sub', n.el).textContent = n.t;
    n.tg = $('.atr-tg', n.el); if (n.tg) n.tg.hidden = true;
    if (n.kids.length){ n.fold = html('<div class="fold atr-kids"><div role="group"></div></div>'); n.kids.forEach(k => n.fold.firstElementChild.appendChild(build(k))); n.el.appendChild(n.fold); }
    if (n.lv) n.el.hidden = true;
    return n.el;
  };
  tree.appendChild(build(N[0]));
  const T = N[0];

  // the tree grows with its rows (owner, 17 Nov: no room reserved for a later state): the panel opens at the height of what it
  // holds and eases taller as each row arrives, and shorter as a branch folds, staying centred in its stage (grow())
  c.offs.push(grow(root));

  const L = atrLines(tree);
  c.loop(t => { L.frame(t); });

  // the numbers: each row's time and cost (a branch adds up everything under it, split in its tooltip), the run's total and
  // clock in the header, and the selected row's split under the tree
  let t0 = performance.now(), ended = 0, sel = null;
  function paint(){
    for (const n of N){
      if (!here(n)) continue;
      // (the cost keeps its element, so its tooltip stays while it counts)
      const q = $(':scope>.atr-b .atr-q', n.el), ce = $('.atr-c', q), k = under(n), v = k.length ? sum(n) : n.cost;
      let se = $('.atr-sec', q);
      if (n.secs >= 1 && !se){ se = html('<span class="atr-sec"><span></span><span aria-hidden="true"> ·</span></span>'); q.prepend(se); } else if (n.secs < 1 && se){ se.remove(); se = null; }
      if (se && se.firstChild.textContent !== Math.floor(n.secs) + 's') se.firstChild.textContent = Math.floor(n.secs) + 's';
      const c$ = n.s === 'queued' && !v ? '' : money(v); if (ce.textContent !== c$) ce.textContent = c$;
      if (k.length) ce.dataset.tip = `Its own ${money(n.cost)}, ${k.length} ${n.lv ? (k.length === 1 ? 'step' : 'steps') : (k.length === 1 ? 'agent' : 'agents')} ${money(sum(n) - n.cost)}`;
      const label = `${n.n}, ${word[n.s]}, ${$(':scope>.atr-b .atr-sub', n.el).textContent}${v ? ', ' + money(v) : ''}`;
      if (n.el.getAttribute('aria-label') !== label) n.el.setAttribute('aria-label', label);
    }
    tot.textContent = money(sum(T));
    const run = N.filter(n => here(n) && n.lv && n.s === 'run').length, wait = N.some(n => here(n) && n.s === 'wait');
    const fail = N.filter(n => here(n) && n.s === 'fail' && !n.el.hasAttribute('data-dim')).length;
    const st = ended ? 'Done' : wait ? 'Needs you' : fail && !run ? `${fail} failed` : run ? `${run} running` : N.some(n => n.lv && n.s === 'done') ? 'Wrapping up' : 'Starting';
    if (meta.textContent !== st) meta.textContent = st;
    root.dataset.s = ended ? 'done' : wait ? 'wait' : fail && !run ? 'fail' : 'run';
    time.textContent = clock(((ended || performance.now()) - t0) / 1000);
    const x = sel || T, kx = under(x), own = kx.length ? ` · its own ${money(x.cost)} · ${kx.length} ${x.lv ? (kx.length === 1 ? 'step' : 'steps') : (kx.length === 1 ? 'agent' : 'agents')} ${money(sum(x) - x.cost)}` : ` · ${money(x.cost)}`;
    const f = `<b></b>${own} · ${toks(sumTok(x))} tokens`;
    if (foot._f !== f + x.n){ foot._f = f + x.n; foot.innerHTML = f; foot.firstChild.textContent = x.n; }
  }
  // what is running spends as it goes, and its time counts
  c.every(100, () => {
    if (ended) return; const now = performance.now();
    for (const n of N) if (here(n) && n.s === 'run'){ n.cost += n.lv ? .0014 : .0004; n.tok += n.lv ? 21 : 6; n.secs = (now - n.t0) / 1000; }
    paint();
  });

  // states: a mark swaps at once (the line engine draws its tick in), and a new line of text rises into place
  function set(n, s, t){
    if (s === 'run' && n.s !== 'run') n.t0 = performance.now() - n.secs * 1000;
    n.s = s; n.el.dataset.s = s;
    const m = n.lv ? s : s === 'fail' ? 'fail' : 'src', g = $(':scope>.atr-b .atr-g', n.el);
    if (g.dataset.m !== m){ g.dataset.m = m; g.innerHTML = atrMark(m); }
    if (t !== undefined) $(':scope>.atr-b .atr-sub', n.el).textContent = t;
    if (s !== 'wait' && s !== 'fail') ask(n, null);
    paint(); L.frame(performance.now());
  }
  const say = (n, t) => { $(':scope>.atr-b .atr-sub', n.el).textContent = t; paint(); };
  const until = async f => { while (!f()) await c.wait(50); };
  // a new row joins: its parent shows its chevron, and the line engine opens its space, draws its line and lets it rise in
  async function arrive(n, s, t){
    set(n, s, t); n.el.hidden = false; L.frame(performance.now()); if (s === 'run') n.t0 = performance.now();
    const p = n.parent; if (p && !p.el.hasAttribute('aria-expanded')){ p.el.setAttribute('aria-expanded', 'true'); p.tg.hidden = false; }
    paint(); await until(() => { const ph = L.phase(n.id); return ph === 'in' || ph === 'shown'; });
  }
  // the way on, in place under a row: a fix for a failed step, or Approve and Hold for one that needs a person
  function ask(n, how){
    const old = $(':scope>.atr-b>.atr-ask:not(.atr-gone)', n.el); if (old) atrDrop(old);
    if (!how) return;
    const box = html(`<div class="atr-ask">${how.map(([k, label]) => `<button type="button" class="pill sm ${k === 'yes' ? 'primary' : 'line'} atr-${k}">${label}</button>`).join('')}</div>`);
    $(':scope>.atr-b', n.el).appendChild(box);
    return box;
  }
  const tell = m => { sr.textContent = m; };

  // the keyboard: one row in the tab order; Up and Down move through the rows you can see (and select them), Right opens
  // a branch or moves into it, Left closes it or moves to its parent, Home and End jump to the ends. Enter or Space on a row
  // with a way on moves to its first button; Escape there comes back to the row
  const open = n => n.el.getAttribute('aria-expanded') !== 'false';
  const visible = () => N.filter(n => { if (!here(n) || ['open', 'opening', 'wait'].includes(L.phase(n.id))) return false; for (let p = n.parent; p; p = p.parent) if (!open(p)) return false; return true; })
    .sort((a, b) => a.el.compareDocumentPosition(b.el) & 4 ? -1 : 1);
  function pick(n, focus){
    sel = n; for (const x of N){ x.el.tabIndex = x === n ? 0 : -1; x.el.setAttribute('aria-selected', String(x === n)); }
    if (focus) n.el.focus({ preventScroll:true }); paint();
  }
  function fold(n, o){
    if (!under(n).length) return;
    n.el.setAttribute('aria-expanded', String(o)); n.fold.classList.toggle('shut', !o); n.fold.inert = !o;
    if (!o && n.fold.contains(document.activeElement)) pick(n, true);
  }
  c.on(tree, 'click', e => {
    const row = e.target.closest('.atr-n'); if (!row || e.target.closest('button')) return;
    const n = N.find(x => x.el === row);
    if (e.target.closest('.atr-tg')){ fold(n, !open(n)); return; }
    pick(n, true);
  });
  c.on(tree, 'keydown', e => {
    if (e.target.closest('button')){ if (e.key === 'Escape'){ const n = N.find(x => x.el === e.target.closest('.atr-n')); if (n){ e.preventDefault(); pick(n, true); } } return; }
    const v = visible(), i = v.findIndex(n => n.el === e.target); if (i < 0) return;
    const n = v[i], k = under(n).length; let go = null;
    if (e.key === 'ArrowDown') go = v[i + 1]; else if (e.key === 'ArrowUp') go = v[i - 1];
    else if (e.key === 'ArrowRight'){ if (k && !open(n)) fold(n, true); else if (k) go = under(n)[0]; }
    else if (e.key === 'ArrowLeft'){ if (k && open(n)) fold(n, false); else go = n.parent; }
    else if (e.key === 'Home') go = v[0]; else if (e.key === 'End') go = v[v.length - 1];
    else if (e.key === 'Enter' || e.key === ' '){ const b = $(':scope>.atr-b>.atr-ask button', n.el); if (b) b.focus(); else pick(n, true); }
    else return;
    e.preventDefault(); if (go) pick(go, true);
  });

  // the run: agents join one at a time and split their work; the research reads its pages while the design agent works
  // through its cards. One step fails on a token the library doesn't have, and the orchestrator reroutes it to a retry (a
  // person can take the fix first). The copy agent's post waits for a person: the story presses Approve, and without the
  // story the person in the demo does after a while, unless the visitor has taken over, who then approves it themselves
  c.run(async () => {
    await c.wait(300);
    await arrive(by('res'), 'run'); await arrive(by('des'), 'run'); await arrive(by('cop'), 'queued'); say(T, '3 agents at work');
    await arrive(by('res1'), 'run'); await arrive(by('des1'), 'run'); await arrive(by('des2'), 'queued');
    await c.wait(300); say(by('res1'), 'Reading 3 of 5');
    await c.wait(500); say(by('res1'), 'Reading 5 of 5');
    await c.wait(450); set(by('res1'), 'done', '5 pages, 12k words');
    await c.wait(350); set(by('res'), 'done', 'Notes in Pricing v4');
    await c.wait(350); set(by('des1'), 'done', 'Pro and Team done'); set(by('des2'), 'run', 'Matching colours');
    await c.wait(1100);
    const tk = by('des2'); set(tk, 'fail', 'Missing accent.600'); tell(`${tk.n} failed: Missing accent.600`);
    await new Promise(res => { $('.atr-fix', ask(tk, [['fix', 'Use accent.500']])).onclick = () => res(); c.later(1300, res); });
    ask(tk, null); tk.el.setAttribute('data-dim', ''); paint();
    await arrive(by('des3'), 'run', 'Rerouted to accent.500');
    await c.wait(1200); set(by('des3'), 'done', 'Used accent.500');
    await c.wait(300); set(by('des'), 'done', 'Cards and tokens done'); set(by('cop'), 'run', 'Writing 3 blurbs');
    await c.wait(1200); say(by('cop'), '3 blurbs written');
    const ps = by('cop1'); await arrive(ps, 'wait', 'Needs your OK');
    tell(`${ps.n} needs you`);
    await new Promise(res => {
      const box = ask(ps, [['yes', 'Approve'], ['no', 'Hold']]);
      $('.atr-yes', box).onclick = () => res();
      $('.atr-no', box).onclick = e => { say(ps, 'On hold'); e.currentTarget.remove(); $('.atr-yes', box).focus({ preventScroll:true }); };
      c.auto(2600, () => res());
    });
    set(ps, 'done', 'Posted to #pricing');
    await c.wait(350); set(by('cop'), 'done', '3 blurbs posted');
    await c.wait(300); set(T, 'done', 'Run finished'); ended = performance.now(); paint(); tell('Run finished');
  });
  // the preview's story: read how a branch's cost splits, then approve the post
  c.story(async s => {
    await s.until(() => here(by('des2')) && L.phase('des2') === 'shown'); await s.beat(2);
    await s.point($(':scope>.atr-b .atr-c', by('des').el)); await s.beat(3); s.away();
    await s.until(() => $('.atr-yes', r)); await s.beat(3);
    await s.tap($('.atr-yes', r)); s.away();
    await s.until(() => ended);
  });
  paint();
});
