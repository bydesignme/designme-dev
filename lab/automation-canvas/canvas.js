/* Automation canvas, with the Agent tree's lines (lab). The component is soft-2's Automation canvas (the same steps, picker,
   settings, selection, dragging, pan and zoom, and story); what changed is how it draws its wires and its run:
   - every wire is a DMFlow.route(): straight legs, corners cut at 45 degrees in Blueprint and rounded in Soft, recomputed
     every frame from where the steps, their marks and the + buttons are, so a dragged or gliding step never leaves its
     wire behind. A wire leaves a step's edge (or the trigger's disc) and ends 1px under the mark of the step it feeds.
   - wires are grey until a test run reaches them; then the accent tint draws along them, the flow band runs along each
     one into the step that is working, and that step's mark swaps from its ring to a spinner, then a tick or a cross.
   - the first test run after the component mounts fails at its last step (a timeout), so the cross and the red wires show;
     a second run passes. */
(() => {
  const REC = /[?&]rec\b/.test(location.search);
  // lab only: ?wires=curve draws the wires as the soft-2 component does (its bezier S-curves), to compare with the routes
  window.LAB_WIRES = new URLSearchParams(location.search).get('wires') === 'curve' ? 'curve' : 'routed';
  const CURVE = () => window.LAB_WIRES === 'curve';
  let go = !REC;
  // one frame clock for the page (DMFlow.loop); each mount adds its frame and takes it away when it stops
  const ticks = new Set(); let NOW = 0;
  DMFlow.loop((T, dt) => { NOW = T; ticks.forEach(f => { try { f(T, dt); } catch(e){ console.error(e); ticks.delete(f); } }); });
  const MR = s => DMFlow.markR(s), MK = 9, clamp = v => Math.max(0, Math.min(1, v)), ez = u => u * u * (3 - 2 * u);

DM.def('automation-canvas', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{play}', I('play','xs')).replace('{search}', I('search','xs')).replace(/\{(minus|plus|fit)\}/g, (m, n) => I(n));
  // sub: the connectors under a step, for the model it thinks with and the tools it may use
  const N = [
    { id:'t', ic:'clock', av:'p', t:'Schedule', d:'Mondays 9:00', y:.4, f:['When', ['Mondays 9:00','Every weekday','On new Figma version']] },
    { id:'a', app:'figma', t:'Read frames', d:'Pricing, Checkout', y:.22, f:['Frames', ['Pricing, Checkout','All frames','Changed this week']] },
    { id:'b', ic:'spark', av:'l', t:'Agent: audit', d:'Contrast, tokens', y:.58, f:['Checks', ['Contrast, tokens','Everything','Accessibility only']], sub:['model', 'tools'] },
    { id:'c', app:'slack', t:'Post summary', d:'#design in Slack', y:.4, f:['Channel', ['#design in Slack','Email the team','Linear ticket']] }
  ];
  N.forEach(n => n.ms = n.id === 't' ? 'src' : 'queued');
  // a wire: from, to, and for a model or a tool, which connector it hangs from
  const E = [['t','a'],['t','b'],['a','c'],['b','c']];
  const CAT = [
    { id:'tools', label:'Tools', av:'t', items:[
      { ic:'globe', t:'Search the web', desc:'Looks things up and keeps the top results', f:['Sources', ['Top results','News only','Our docs site']] },
      { ic:'file-text', t:'Read a doc', desc:'Pulls the text out of a doc or a PDF', f:['Doc', ['Brand guidelines','Release notes','Any shared doc']] },
      { ic:'eye', t:'Check contrast', desc:'Measures each text colour against its fill', f:['Level', ['WCAG AA','WCAG AAA','APCA']] } ] },
    { id:'logic', label:'Logic', av:'y', items:[
      { ic:'branch', t:'If / else', desc:'Sends the run one way or the other', f:['When', ['Any check fails','Over 5 issues','Always']] },
      { ic:'clock', t:'Wait', desc:'Pauses the run for a while', f:['For', ['1 hour','Until 9:00','1 day']] },
      { ic:'user', t:'Ask a person', desc:'Holds the run until someone approves', f:['Who', ['Design lead','Anyone on #design','The run owner']] } ] },
    { id:'actions', label:'Actions', av:'m', items:[
      { ic:'flag', t:'Create ticket', desc:'Files an issue with what the agent found', f:['Tracker', ['Design QA board','Linear, Web team','GitHub issues']] },
      { ic:'mail', t:'Send email', desc:'Emails a short summary to a list', f:['To', ['Design team','Product leads','Just me']] },
      { ic:'edit', t:'Update doc', desc:'Writes the results into a shared doc', f:['Doc', ['QA log','Weekly notes','Release checklist']] } ] },
    { id:'models', label:'Models', av:'b', items:[
      { ic:'bolt', t:'Fast model', desc:'Quick and cheap, for simple checks', f:['Model', ['Fast','Fast, low cost']] },
      { ic:'brain', t:'Reasoning model', desc:'Slower, thinks harder audits through', f:['Model', ['Reasoning','Reasoning, long context']] },
      { ic:'image', t:'Vision model', desc:'Reads screenshots and frames', f:['Model', ['Vision','Vision, high detail']] } ] }
  ];
  const OFFER = { out:['tools', 'logic', 'actions'], model:['models'], tools:['tools'] }, KIND = { model:'Model', tools:'Tools' };
  const MAX = () => narrow() ? 6 : 9;
  const cv = $('.acx-cv', r), nodes = $('.acx-nodes', r), pop = $('.acx-pop', r), st = $('.acx-st', r), live = $('.acx-live', r);
  const pk = $('.acx-pk', r), qi = $('.acx-qi', r), ls = $('.acx-ls', r), pd = $('.acx-pd', r);
  const vp = $('.acx-vp', r), world = $('.acx-world', r), mq = $('.acx-mq', r), zm = $('.acx-zm', r), zl = $('.acx-zl', r), zo = $('.acx-zo', r), zi = $('.acx-zi', r), fitB = $('.acx-fit', r), sr = $('.acx-sr', r);
  const L = DMFlow.layer(world);
  const say = t => { live.textContent = t; };
  const narrow = () => cv.clientWidth < 560;
  const tp = $('.acx-top', r), bar = $('.acx-bar', r);
  const safe = () => ({ T:tp.offsetTop + tp.offsetHeight - cv.offsetTop + 8, B:cv.clientHeight - bar.offsetTop + 8 });
  const band = y => { const H = cv.clientHeight, { T, B } = safe(); return (T + y * Math.max(0, H - T - B)) / H; };
  // wide: the trigger and the last step sit the same distance in from each side and the two middle steps halfway between
  const wide = (n, W, w) => { const pad = W < 800 ? 24 : Math.max(28, W * .06); return { x:{ t:pad + w / 2, a:W / 2, b:W / 2, c:W - pad - w / 2 }[n.id] / W, y:band(n.y) }; };
  // narrow: the run goes down the canvas: the trigger, then the two steps it starts side by side, then the step they both
  // feed. Each wire comes down into the mark on top of the step it feeds
  const NARROWAT = { t:['l', .03], a:['l', .28], b:['r', .28], c:['l', .58] };
  const pos = (n, W, w) => (narrow() ? n.um : n.uw) || (n.add ? null : narrow() ? { x:(NARROWAT[n.id][0] === 'l' ? 16 + w / 2 : W - 16 - w / 2) / W, y:Math.max(band(NARROWAT[n.id][1]), (safe().T + 4 + el(n.id).offsetHeight / 2) / cv.clientHeight) } : wide(n, W, w));
  // a step's tile: an app's colour logo, or a solid avatar colour with its ink
  const tile = (n, sz) => n.app ? `<span class="ic app">${ATX_BRAND[n.app]}</span>` : `<span class="ic fill" style="--a:var(--dm-av-${n.av});--ai:var(--dm-av-${n.av}-ink)">${I(n.ic, sz)}</span>`;
  const nodeHTML = n => `<button class="acx-n${n.kind ? ' sm' : ''}" data-id="${n.id}"><span class="dmf-g"></span>${tile(n, 'xs')}<span class="t"><b>${n.t}</b><span class="d">${n.d}</span></span></button>`;
  nodes.innerHTML = N.map(nodeHTML).join('');
  const el = id => $(`.acx-n[data-id="${id}"]`, nodes);
  const byId = id => N.find(n => n.id === id);
  const markOf = id => $(':scope > .dmf-g', el(id));
  const box = b => ({ l:b.offsetLeft, t:b.offsetTop, r:b.offsetLeft + b.offsetWidth, b:b.offsetTop + b.offsetHeight, w:b.offsetWidth, h:b.offsetHeight });
  // a box where it shows this frame (a drag's scale and every glide included), in the world's own space
  const lb = b => { const q = L.box(b); return { l:q.x, t:q.y, r:q.x + q.w, b:q.y + q.h, w:q.w, h:q.h, cx:q.cx, cy:q.cy }; };
  // a mark swaps at once, and its wires are redrawn in the same moment, so a wire never ends short of a mark that shrank
  let ready = false;
  const setMark = (n, s) => { n.ms = s; const m = el(n.id) && markOf(n.id); if (m) DMFlow.mark(m, s); if (ready) frame(NOW); };
  N.forEach(n => setMark(n, n.ms));

  /* ---------- the marks and ports ----------
     where a step's wire comes in: its left (wide) or its top (stacked, and always for a model or a tool). The trigger's
     disc sits where its wires leave: its right, or its foot when the canvas stacks */
  const entry = n => narrow() || n.kind ? 't' : (n.inW || 'l');
  const markSide = n => n.id === 't' ? (narrow() ? 'b' : 'r') : entry(n);
  const setSides = () => N.forEach(n => { const b = el(n.id); if (b && b.dataset.m !== markSide(n)) b.dataset.m = markSide(n); });
  // the x of a step's foot port, under its icon (from the board's offsets, for laying out)
  const footX = id => { const b = el(id), ic = $('.ic', b); return b.offsetLeft + ic.offsetLeft + ic.offsetWidth / 2; };
  // the same, where it shows this frame
  const footLive = id => lb($('.ic', el(id))).cx;
  // where the mark's centre sits from a step's left (for a top mark) or top (for a left mark): for placing a step so its wire
  // comes in straight
  const markIn = (n, w, h) => entry(n) === 't' ? (n.kind ? 22 : 26) : h / 2;

  /* ---------- the view, as in Canvas toolbar: zoom z and pan (px, py) ---------- */
  const Z = [.5, .67, .75, .9, 1, 1.25, 1.5, 2], ZMIN = Z[0], ZMAX = Z[Z.length - 1];
  let z = 1, px = 0, py = 0, lastT = '';
  const lim = v => Math.max(ZMIN, Math.min(ZMAX, v)), pct = () => Math.round(z * 100) + '%';
  const scr = B => ({ l:B.l * z + px, t:B.t * z + py, r:B.r * z + px, b:B.b * z + py, w:B.w * z, h:B.h * z });
  function apply(anim){
    const W = cv.clientWidth, H = cv.clientHeight;
    px = Math.round(Math.max(W / 2 - W * z, Math.min(W / 2, px)) * 100) / 100; py = Math.round(Math.max(H / 2 - H * z, Math.min(H / 2, py)) * 100) / 100;
    const t = `translate(${px}px,${py}px) scale(${z})`;
    if (t !== lastT){ if (lastT){ close(); closePk(); } lastT = t; cv.classList.toggle('anim', !!anim && !REDUCE); world.style.transform = t; }
    const g = 16 * z; cv.style.backgroundSize = `${g}px ${g}px`; cv.style.backgroundPosition = `${(W - 16) / 2 * z + px}px ${(H - 16) / 2 * z + py}px`;
    zl.textContent = pct(); zl.setAttribute('aria-label', `Zoom ${pct()}, reset to 100%`);
    zo.setAttribute('aria-disabled', z <= ZMIN + 1e-3); zi.setAttribute('aria-disabled', z >= ZMAX - 1e-3);
  }
  function zoomAt(nz, x, y, anim){ nz = lim(nz); const wx = (x - px) / z, wy = (y - py) / z; z = nz; px = x - wx * z; py = y - wy * z; apply(anim); }
  const zstep = d => { const s2 = d > 0 ? Z.find(x => x > z + 1e-3) : [...Z].reverse().find(x => x < z - 1e-3); return s2 === undefined ? z : s2; };
  function zoomBy(d){ const nz = zstep(d); if (nz === z) return; zoomAt(nz, cv.clientWidth / 2, cv.clientHeight / 2, true); say('Zoom ' + pct()); }
  function zoomReset(){ zoomAt(1, cv.clientWidth / 2, cv.clientHeight / 2, true); say('Zoom 100%'); }
  // fit: every step, its mark and its + in view, centred in the band between the name and Test run, never past 100%
  function fit(){
    const W = cv.clientWidth, { T, B } = safe(), H = cv.clientHeight - T - B, P = 24, bs = $$('.acx-n, .acx-h, .acx-sc', nodes).filter(b => b.dataset.on !== '0').map(box);
    if (!bs.length) return;
    const x0 = Math.min(...bs.map(b => b.l)) - MK, y0 = Math.min(...bs.map(b => b.t)) - MK, x1 = Math.max(...bs.map(b => b.r)) + MK, y1 = Math.max(...bs.map(b => b.b)) + MK;
    z = lim(Math.min((W - 2 * P) / (x1 - x0), (H - 2 * P) / (y1 - y0), 1));
    px = (W - (x1 - x0) * z) / 2 - x0 * z; py = T + (H - (y1 - y0) * z) / 2 - y0 * z;
    apply(true); say('Fit to screen, ' + pct());
  }

  /* ---------- the + handles and the connectors ---------- */
  const open = n => !n.kind && !E.some(e => e[0] === n.id && !e[2]);
  const knobs = {};
  function syncKnobs(){
    const full = N.length >= MAX();
    N.forEach(n => {
      const want = [...(open(n) && !full ? ['out'] : []), ...(full ? [] : n.sub || [])];
      Object.keys(knobs).filter(k => k.startsWith(n.id + ':') && !want.includes(k.split(':')[1])).forEach(k => { knobs[k].remove(); delete knobs[k]; });
      want.forEach(kind => {
        const k = n.id + ':' + kind; if (knobs[k]) return;
        const b = kind === 'out'
          ? html(`<button class="acx-h" aria-haspopup="dialog" aria-expanded="false" aria-label="Add a step after ${n.t}" data-tip="Add a step">${I('plus','xs')}</button>`)
          : html(`<button class="acx-sc" aria-haspopup="dialog" aria-expanded="false" aria-label="Add ${kind === 'model' ? 'a model' : 'a tool'} to ${n.t}" data-tip="Add ${kind === 'model' ? 'a model' : 'a tool'}">${I('plus','xs')}<span>${KIND[kind]}</span></button>`);
        b.dataset.for = n.id; b.dataset.k = kind; nodes.appendChild(b); knobs[k] = b;
        b.onclick = e => { e.stopPropagation(); pk.classList.contains('open') && pkFor === b ? closePk(true) : openPk(b, e.isTrusted); };
      });
    });
  }
  // where a step's output leaves it: its right side, or its foot (under its icon) when the canvas stacks or when there is no
  // room for another step to its right
  const roomR = B => B.r + MK + 48 + (cv.clientWidth < 800 ? 164 : 176) + 40 <= cv.clientWidth;
  const outAt = (B, n) => !narrow() && roomR(B) ? { x:B.r, y:B.t + B.h / 2, d:'r' } : { x:footX(n.id), y:B.b, d:'d' };
  // the connectors sit under the step: either side of its middle on a wide canvas, and to the right of its foot when it
  // stacks, so the wire leaving its foot keeps clear of them
  function subAt(n, kind){
    const B = box(el(n.id)), kinds = n.sub || [];
    const wOf = k => (knobs[n.id + ':' + k] || {}).offsetWidth || 64;
    if (narrow()){ const x0 = footX(n.id) + 14; let l = x0; for (const k of kinds){ if (k === kind) break; l += wOf(k) + 6; } return { l, t:B.b + 10, w:wOf(kind), h:24 }; }
    const cx = B.l + B.w / 2, g = 8, one = kinds.length < 2, l = one ? cx - wOf(kind) / 2 : kind === kinds[0] ? cx - g / 2 - wOf(kind) : cx + g / 2;
    return { l, t:B.b + 10, w:wOf(kind), h:24 };
  }
  function placeKnobs(){
    // on a narrow canvas the connectors drop their labels when they would run past the edge
    N.filter(n => n.sub).forEach(n => {
      const ks = n.sub.map(k => knobs[n.id + ':' + k]).filter(Boolean); if (!ks.length) return;
      ks.forEach(k => k.classList.remove('tight'));
      if (narrow()){ const s = subAt(n, n.sub[n.sub.length - 1]); if (s.l + s.w > cv.clientWidth - 6) ks.forEach(k => k.classList.add('tight')); }
    });
    Object.entries(knobs).forEach(([k, b]) => {
      const [id, kind] = k.split(':'), n = byId(id), B = box(el(id));
      if (kind === 'out'){ const o = outAt(B, n); b.style.left = (o.d === 'r' ? o.x + 10 : o.x - 10) + 'px'; b.style.top = (o.d === 'r' ? o.y - 10 : o.y + 10) + 'px'; }
      else { const s = subAt(n, kind); b.style.left = s.l + 'px'; b.style.top = s.t + 'px'; }
    });
  }

  /* ---------- wires ----------
     route(): the corner points of a wire from a port S (x, y and the way it leaves, 'r' or 'd') to a mark X (its centre, its
     radius and the side it is met on, 'l' or 't'). sb and tb are the two steps' boxes, for going round them when the target
     is behind. The wire ends 1px under the mark's edge */
  function route(S, sb, X, tb){
    const G = 20, M = MK, P = [[S.x, S.y]];
    const end = X.side === 'l' ? [X.x - X.r + 1, X.y] : [X.x, X.y - X.r + 1];
    const between = () => tb.t >= sb.b + 2 * G ? (sb.b + tb.t) / 2 : sb.t >= tb.b + 2 * G ? (tb.b + sb.t) / 2 : Math.max(sb.b, tb.b) + G;
    if (S.d === 'r' && X.side === 'l'){
      const gx = X.x - M;
      if (gx - S.x >= 8){ if (Math.abs(X.y - S.y) > .5){ const xm = (S.x + gx) / 2; P.push([xm, S.y], [xm, X.y]); } }
      else { const yb = between(), x1 = S.x + G, x2 = gx - G; P.push([x1, S.y], [x1, yb], [x2, yb], [x2, X.y]); }
    } else if (S.d === 'd' && X.side === 't'){
      const gy = X.y - M;
      if (gy - S.y >= 8){ if (Math.abs(X.x - S.x) > .5){ const ym = S.y + Math.min(G + 4, (gy - S.y) / 2); P.push([S.x, ym], [X.x, ym]); } }
      else {
        const y1 = S.y + G, y2 = gy - G, mid = (S.x + X.x) / 2, l0 = Math.min(sb.l, tb.l) - M - G, r0 = Math.max(sb.r, tb.r) + G;
        const lane = mid - l0 < r0 - mid ? l0 : r0; P.push([S.x, y1], [lane, y1], [lane, y2], [X.x, y2]);
      }
    } else if (S.d === 'r'){
      if (X.x - S.x >= 14 && X.y - M - S.y >= 14) P.push([X.x, S.y]);
      else { const x1 = S.x + G, ym = Math.min(X.y - M - G, Math.max(S.y, X.y - M - G)); P.push([x1, S.y], [x1, ym], [X.x, ym]); }
    } else {
      if (X.x - M - S.x >= 14 && X.y - S.y >= 14) P.push([S.x, X.y]);
      else { const y1 = S.y + G, lx = X.x - M - G; P.push([S.x, y1], [lx, y1], [lx, X.y]); }
    }
    P.push(end); return P;
  }
  const placed = n => !!el(n.id) && el(n.id).dataset.on !== '0';
  const key = (a, b) => a + '>' + b, geo = {};
  // the wire's start, this frame: the trigger's disc edge, a step's side or foot, or a connector's foot
  function portOf(e){
    const [a, b, kind] = e, A = el(a), AB = lb(A);
    if (kind){ const k = knobs[a + ':' + kind]; if (k && k.isConnected){ const K = lb(k); return { x:K.cx, y:K.b - 1, d:'d' }; }
      // the connector has gone (the canvas is full): the wire starts at the step's foot and runs down through where it was,
      // so it keeps the same course
      const s = subAt(byId(a), kind), x = s.l + s.w / 2; return { x, y:AB.b + 10 + 24 - 1, d:'d', pre:[x, AB.b - 1] }; }
    if (a === 't'){ const M = lb(markOf('t')), rr = MR('src') - 1; return narrow() ? { x:M.cx, y:M.cy + rr, d:'d' } : { x:M.cx + rr, y:M.cy, d:'r' }; }
    return entry(byId(b)) === 'l' ? { x:AB.r - 1, y:AB.cy, d:'r' } : { x:footLive(a), y:AB.b - 1, d:'d' };
  }
  function endOf(id){ const n = byId(id), M = lb(markOf(id)); return { x:M.cx, y:M.cy, r:MR(n.ms), side:entry(n) }; }
  // the soft-2 wire: a cubic that leaves the port along its direction and comes into the mark along the side it is met on,
  // each handle half the distance (24px at least); it ends 1px under the mark's edge
  function curve(S, X){
    const end = X.side === 'l' ? [X.x - X.r + 1, X.y] : [X.x, X.y - X.r + 1], dx = end[0] - S.x, dy = end[1] - S.y;
    const k0 = Math.max(24, Math.abs(S.d === 'd' ? dy : dx) / 2), k1 = Math.max(24, Math.abs(X.side === 'l' ? dx : dy) / 2);
    return [[S.x, S.y], S.d === 'r' ? [S.x + k0, S.y] : [S.x, S.y + k0], X.side === 'l' ? [end[0] - k1, end[1]] : [end[0], end[1] - k1], end];
  }
  const bez = (q, t) => { const u = 1 - t; return [0, 1].map(i => u * u * u * q[0][i] + 3 * u * u * t * q[1][i] + 3 * u * t * t * q[2][i] + t * t * t * q[3][i]); };
  // a wire's shape: its corner points (routed) or points along its curve (curved), and its path
  function shape(S, sb, X, tb){
    if (!CURVE()){ const P = route(S, sb, X, tb); if (S.pre) P.unshift(S.pre); return { P, d:DMFlow.route(P) }; }
    const q = curve(S, X), P = Array.from({ length:17 }, (_, i) => bez(q, i / 16)); if (S.pre) P.unshift(S.pre);
    return { P, d:(S.pre ? `M${S.pre[0]} ${S.pre[1]}L${q[0][0]} ${q[0][1]}` : `M${q[0][0]} ${q[0][1]}`) + `C${q[1].join(' ')} ${q[2].join(' ')} ${q[3].join(' ')}` };
  }
  const pathOf = e => shape(portOf(e), lb(el(e[0])), endOf(e[1]), lb(el(e[1])));
  const lenOf = P => P.reduce((s, p, i) => i ? s + Math.hypot(p[0] - P[i - 1][0], p[1] - P[i - 1][1]) : 0, 0);
  // each wire: its grey rail, the tint over it once a run reaches it, and its flow band. rv0 is when the rail starts drawing
  // in (on arrival, or when a step is added), t0 when the tint starts
  const wire = {};
  const wireOf = k => wire[k] || (wire[k] = { rail:DMFlow.line(L, 'rail'), top:DMFlow.line(L), bd:DMFlow.band(L, { loop:false }), st:'queued', t0:-1e9, rv0:-1e9, band:false, len:0 });
  const stub = {};
  function frame(T){
    if (!world.isConnected || c.seen === false) return;
    E.forEach(e => {
      const [a, b] = e; if (!placed(byId(a)) || !placed(byId(b))) return;
      const k = key(a, b), w = wireOf(k), { P, d } = pathOf(e); geo[k] = P; w.len = lenOf(P);
      const rv = REDUCE ? 1 : ez(clamp((T - w.rv0) / .45));
      w.rail.set(rv > .001 ? d : '', 'queued', rv);
      const tv = w.st === 'bad' || REDUCE ? 1 : ez(clamp((T - w.t0) / .45));
      w.top.set(w.st !== 'queued' && tv > .001 ? d : '', w.st, tv);
      if (w.band){ if (w.bd.tick(d, T)) w.band = false; }
    });
    // the short wires from a step to its + and its connectors; a connector's lights up while a run uses what hangs from it
    const want = new Set();
    Object.entries(knobs).forEach(([k, b]) => {
      const [id, kind] = k.split(':'), B = lb(el(id)), K = lb(b); let P;
      if (kind === 'out'){ const o = outAt(box(el(id)), byId(id)); P = o.d === 'r' ? [[B.r - 1, B.cy], [K.l + 1, K.cy]] : [[footLive(id), B.b - 1], [footLive(id), K.t + 1]]; }
      else P = [[K.cx, B.b - 1], [K.cx, K.t + 1]];
      want.add(k); const s = stub[k] || (stub[k] = { ln:DMFlow.line(L, 'rail'), rv0:NOW });
      const on = kind !== 'out' && E.some(e => e[0] === id && e[2] === kind && wire[key(e[0], e[1])] && wire[key(e[0], e[1])].st === 'on');
      const rv = REDUCE ? 1 : ez(clamp((T - s.rv0) / .3));
      s.ln.set(rv > .001 ? DMFlow.route(P) : '', on ? 'on' : 'queued', rv);
    });
    Object.keys(stub).filter(k => !want.has(k)).forEach(k => { stub[k].ln.remove(); delete stub[k]; });
  }
  ticks.add(frame); c.offs.push(() => ticks.delete(frame)); ready = true;
  const wires = () => placeKnobs();

  /* ---------- where a new step goes: as near as it can to just after what it hangs from (to the right of a step, under a
     connector, or under a step when the canvas stacks), lined up so its wire comes in straight, clear of every step, + and
     connector with room to spare, keeping off the wires already drawn, and inside the canvas ---------- */
  function spot(n){
    const W = cv.clientWidth, H = cv.clientHeight, me = el(n.id), w = me.offsetWidth, h = me.offsetHeight, M = 8;
    const e = E.find(x => x[1] === n.id), src = e[0];
    const a = e[2] ? (s => ({ x:s.l + s.w / 2, y:s.t + s.h, d:'d' }))(subAt(byId(src), e[2])) : outAt(box(el(src)), byId(src));
    const others = N.filter(x => x !== n && placed(x)).map(x => box(el(x.id)));
    const ks = Object.entries(knobs).filter(([k]) => { const id = k.split(':')[0]; return k !== src + ':out' && id !== n.id && placed(byId(id)); }).map(([, b]) => box(b));
    const Z0 = { l:(zm.offsetLeft - px) / z, t:(zm.offsetTop - py) / z, w:zm.offsetWidth / z, h:zm.offsetHeight / z }; Z0.r = Z0.l + Z0.w; Z0.b = Z0.t + Z0.h;
    const { T:sT, B:sB } = safe(), onBoard = (l, t, r2, b2) => ({ l:(l - px) / z, t:(t - py) / z, r:(r2 - px) / z, b:(b2 - py) / z });
    const obst = [...others, ...ks, Z0, onBoard(0, 0, tp.offsetLeft + tp.offsetWidth + 8, sT), onBoard(0, cv.clientHeight - sB, bar.offsetLeft + bar.offsetWidth + 8, cv.clientHeight)];
    // points along the wires already drawn
    const samples = Object.entries(geo).filter(([k]) => !k.split('>').includes(n.id)).flatMap(([, P]) => P.slice(1).flatMap((p, i) => Array.from({ length:6 }, (_, j) => [P[i][0] + (p[0] - P[i][0]) * (j + .5) / 6, P[i][1] + (p[1] - P[i][1]) * (j + .5) / 6])));
    const side = entry(n), mi = markIn(n, w, h);
    // just after its port, lined up with it: a step on the right has its middle level with the port; one underneath has
    // its mark right under it
    const want = a.d === 'r' ? [a.x + MK + 48 + w / 2, a.y] : [a.x - mi + w / 2, a.y + MK + 40 + h / 2];
    const inside = (p, b, m) => p[0] > b.l - m && p[0] < b.r + m && p[1] > b.t - m && p[1] < b.b + m;
    const ov = (A, B, m) => Math.max(0, Math.min(A.r, B.r + m) - Math.max(A.l, B.l - m)) * Math.max(0, Math.min(A.b, B.b + m) - Math.max(A.t, B.t - m));
    const at = (x, y) => ({ l:x, t:y, r:x + w, b:y + h, w, h });
    const markAt = B => side === 'l' ? { x:B.l, y:B.t + B.h / 2, r:MK, side } : { x:B.l + mi, y:B.t, r:MK, side };
    const score = B => {
      let sc = Math.hypot(B.l + w / 2 - want[0], B.t + h / 2 - want[1]);
      if (a.d === 'r' ? B.l < a.x + MK + 32 : B.t < a.y + MK + 32) sc += 250;
      sc += samples.filter(p => inside(p, B, 6)).length * 60;
      const P = shape(a, { l:a.x - 1, t:a.y - 1, r:a.x + 1, b:a.y + 1 }, markAt(B), B).P;
      for (let i = 1; i < P.length; i++) for (let j = 1; j < 8; j++){ const p = [P[i - 1][0] + (P[i][0] - P[i - 1][0]) * j / 8, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * j / 8]; if (others.some(o => inside(p, o, 18))) sc += 30; }
      return sc;
    };
    const fits = B => (n.kind || (narrow() ? B.b + 34 <= H - 4 : B.r + 34 <= W - 4 || B.b + 34 <= H - 4)) && B.l >= M + (side === 'l' ? MK : 0) && B.t >= M + (side === 't' ? MK : 0) && B.r <= W - M && B.b <= H - M;
    let best = null, bs = Infinity, soft = null, ss = Infinity;
    // first: exactly lined up with its port, if that spot is clear
    const exact = at(want[0] - w / 2, want[1] - h / 2);
    if (fits(exact) && !obst.some(o => ov(exact, o, 14))) best = exact;
    for (const G of [14, 4]){ if (best) break;
    for (let y = M; y + h <= H - M; y += 8) for (let x = M; x + w <= W - M; x += 8){
      const B = at(x, y); if (!fits(B)) continue;
      const sc = score(B), hit = obst.reduce((s2, o) => s2 + ov(B, o, G), 0);
      if (!hit){ if (sc < bs){ bs = sc; best = B; } }
      else if (hit * 10 + sc < ss){ ss = hit * 10 + sc; soft = B; }
    } }
    const B = best || soft || at(M + MK, M + MK);
    return { x:(B.l + w / 2) / W, y:(B.t + h / 2) / H };
  }
  function layout(){
    const W = cv.clientWidth, H = cv.clientHeight, small = W < 800, nw = Math.max(120, Math.min(156, (W - 52) / 2));
    // a model or a tool is a smaller step
    $$('.acx-n', nodes).forEach(b => b.style.width = (b.classList.contains('sm') ? (narrow() ? 116 : small ? 150 : 168) : narrow() ? nw : small ? 164 : 176) + 'px');
    // a step added on a wide canvas comes in from the left when it sits to the right of its step, or from above when it
    // went underneath (no room on the right)
    N.filter(n => n.add && !n.kind && !n.uw && !n.inW && !narrow()).forEach(n => { const s = E.find(x => x[1] === n.id)[0]; if (placed(byId(s))) n.inW = roomR(box(el(s))) ? 'l' : 't'; });
    setSides(); syncKnobs(); Object.keys(geo).forEach(k => delete geo[k]);
    const put = (n, p) => { const b = el(n.id); b.style.left = (p.x * W - b.offsetWidth / 2) + 'px'; b.style.top = (p.y * H - b.offsetHeight / 2) + 'px'; b.dataset.on = '1'; };
    N.forEach(n => { const p = pos(n, W, el(n.id).offsetWidth); if (p) put(n, p); else el(n.id).dataset.on = '0'; });
    N.filter(n => el(n.id).dataset.on === '0').forEach(n => {
      wires(); if (!narrow() && !n.kind && !n.inW){ const s = E.find(x => x[1] === n.id)[0]; n.inW = roomR(box(el(s))) ? 'l' : 't'; setSides(); }
      const p = spot(n); if (narrow()) n.um = p; else n.uw = p; put(n, p); });
    wires();
  }
  let selN = null;
  // a step's settings open as a small dialog beside it
  const uid = Math.random().toString(36).slice(2, 7);
  function config(n, key2){
    closePk();
    const b = el(n.id); selN = n;
    pop.innerHTML = `<h4 id="acx-h-${n.id}-${uid}">${n.t}</h4><div class="acx-fl"><span id="acx-f-${n.id}-${uid}">${n.f[0]}</span><button class="acx-dd" aria-haspopup="menu" aria-expanded="false" aria-labelledby="acx-f-${n.id}-${uid} acx-v-${n.id}-${uid}"><span id="acx-v-${n.id}-${uid}">${n.d}</span>${I('chev-d','xs')}</button><div class="acx-opts" role="menu" aria-labelledby="acx-f-${n.id}-${uid}">${n.f[1].map(o => `<button class="mi" role="menuitemradio" tabindex="-1" aria-checked="${o === n.d}"><span>${o}</span><span class="ck">${I('check','xs')}</span></button>`).join('')}</div></div><button class="pill soft sm acx-done">Done</button>`;
    pop.setAttribute('aria-labelledby', `acx-h-${n.id}-${uid}`);
    const W = cv.clientWidth, H = cv.clientHeight, pw = pop.offsetWidth || 240, ph = pop.offsetHeight || 150, G = 10, M = 6, OVER = 0;
    const me = scr(box(b)), others = $$('.acx-n', nodes).filter(x => x !== b).map(x => scr(box(x)));
    const cx = (me.l + me.r) / 2, cy = (me.t + me.b) / 2, cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const over = (x, y, o) => Math.max(0, Math.min(x + pw, o.r) - Math.max(x, o.l)) * Math.max(0, Math.min(y + ph, o.b) - Math.max(y, o.t));
    const ys = [me.t - 40, cy - ph / 2, me.t, me.b - ph, M, H - ph - M, H - ph + OVER], xs = [cx - pw / 2, me.l, me.r - pw, M, W - pw - M];
    const spots = [...ys.map(y => [me.r + G + MK, y]), ...ys.map(y => [me.l - pw - G - MK, y]), ...xs.map(x => [x, me.b + G]), ...xs.map(x => [x, me.t - ph - G - MK])]
      .flatMap(([x, y]) => [[cl(x, M, W - pw - M), cl(y, M, H - ph - M)], [cl(x, M, W - pw - M), cl(y, M, H - ph + OVER)]]);
    let best = null, bs = Infinity;
    for (const [x, y] of spots){ const hang = Math.max(0, y + ph - (H - M)); const sc = others.reduce((a2, o) => a2 + over(x, y, o), 0) + over(x, y, me) * 4 + hang * 20 + Math.hypot(x + pw / 2 - cx, y + ph / 2 - cy) / 100; if (sc < bs){ bs = sc; best = [x, y]; } }
    pop.style.left = best[0] + 'px'; pop.style.top = best[1] + 'px'; pop.style.position = 'absolute'; pop.classList.add('open'); pop.inert = false;
    const dd = $('.acx-dd', pop), ops = $('.acx-opts', pop), mis = $$('.mi', ops);
    const top0 = best[1];
    const fitP = () => { pop.style.top = Math.max(M, Math.min(top0, H + OVER - pop.offsetHeight)) + 'px'; };
    const list = (on, focus) => { ops.classList.toggle('open', on); dd.setAttribute('aria-expanded', on); fitP();
      if (on && focus){ const m = focus === 'last' ? mis[mis.length - 1] : mis.find(x => x.getAttribute('aria-checked') === 'true') || mis[0]; m.focus({ preventScroll:true }); }
      if (!on && ops.contains(document.activeElement)) dd.focus({ preventScroll:true }); };
    dd.onclick = e => { e.stopPropagation(); list(!ops.classList.contains('open'), e.isTrusted && !e.detail && 'first'); };
    dd.onkeydown = e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); list(true, e.key === 'ArrowUp' ? 'last' : 'first'); } };
    ops.onkeydown = e => { const i = mis.indexOf(document.activeElement), go2 = { ArrowDown:mis[(i + 1) % mis.length], ArrowUp:mis[(i - 1 + mis.length) % mis.length], Home:mis[0], End:mis[mis.length - 1] }[e.key];
      if (go2){ e.preventDefault(); go2.focus({ preventScroll:true }); } else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); list(false); } else if (e.key === 'Tab') list(false); };
    mis.forEach(m => m.onclick = e => { e.stopPropagation(); n.d = $('span', m).textContent; DMFlow.swap($('.d', b), n.d); DMFlow.swap($('span', dd), n.d); mis.forEach(x => x.setAttribute('aria-checked', x === m)); list(false); if (n.id === 't' && !running) status(n.d.replace('Mondays', 'Every Monday,')); });
    $('.acx-done', pop).onclick = () => close(true);
    if (key2) dd.focus({ preventScroll:true });
  }
  function close(back){ const b = selN && el(selN.id), was = pop.contains(document.activeElement); pop.classList.remove('open'); pop.inert = true; selN = null; if (b && (back || was)) b.focus({ preventScroll:true }); }
  pop.inert = true;
  c.on(pop, 'keydown', e => { if (e.key === 'Escape' && selN){ e.preventDefault(); close(true); } });
  /* ---------- selection and dragging ---------- */
  let sel = new Set();
  function select(ids){ sel = new Set(ids); N.forEach(n => { const b = el(n.id); if (b) b.classList.toggle('sel', sel.has(n.id)); }); }
  const picked = () => say(sel.size ? `${sel.size} of ${N.length} steps selected` : 'Nothing selected');
  let justDragged = false;
  function bind(n){
    const b = el(n.id);
    b.onclick = e => { e.stopPropagation(); if (justDragged){ justDragged = false; return; }
      if (e.shiftKey){ const s2 = new Set(sel); s2.has(n.id) ? s2.delete(n.id) : s2.add(n.id); select(s2); close(); closePk(); picked(); return; }
      select([n.id]); selN === n ? close() : config(n, e.isTrusted && !e.detail); };
    b.onkeydown = e => { if (e.key === 'Escape' && selN === n){ e.preventDefault(); close(); } };
    b.onpointerdown = e => {
      if (e.button || (e.pointerType === 'touch' && !engaged)) return; const sx = e.clientX, sy = e.clientY; let moved = false, group = [];
      const mv = ev => { const dx = (ev.clientX - sx) / z, dy = (ev.clientY - sy) / z;
        if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 4) return;
        if (!moved){ moved = true; if (!sel.has(n.id)) select([n.id]);
          group = N.filter(x => sel.has(x.id) && el(x.id)).map(x => { const e2 = el(x.id); return [x, e2, e2.offsetLeft, e2.offsetTop]; });
          group.forEach(g => g[1].classList.add('drag')); nodes.classList.add('drag'); close(); closePk(); b.setPointerCapture?.(e.pointerId); }
        const W = cv.clientWidth, H = cv.clientHeight;
        group.forEach(([, e2, ox, oy]) => { e2.style.left = Math.max(MK + 4, Math.min(W - e2.offsetWidth - MK - 4, ox + dx)) + 'px'; e2.style.top = Math.max(MK + 4, Math.min(H - e2.offsetHeight - MK - 4, oy + dy)) + 'px'; });
        wires(); };
      const up = () => { document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up);
        if (!moved) return; nodes.classList.remove('drag'); justDragged = true; setTimeout(() => justDragged = false, 50);
        group.forEach(([x, e2]) => { e2.classList.remove('drag'); const f = { x:(e2.offsetLeft + e2.offsetWidth / 2) / cv.clientWidth, y:(e2.offsetTop + e2.offsetHeight / 2) / cv.clientHeight }; if (narrow()) x.um = f; else x.uw = f; }); };
      document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up);
      c.offs.push(() => { document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up); });
    };
  }
  N.forEach(bind);
  c.on(cv, 'click', e => { if (!pop.contains(e.target) && !pk.contains(e.target)){ close(); closePk(); } });
  pop.onclick = e => e.stopPropagation();

  /* ---------- the step picker ---------- */
  let pkFor = null, act = -1, opts = [];
  ls.id = 'acx-ls-' + uid; qi.setAttribute('aria-controls', ls.id); pk.inert = true;
  const esc = t => t.replace(/[&<>"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[ch]);
  function paint(){
    const q = qi.value.trim().toLowerCase(), kind = pkFor.dataset.k;
    const groups = CAT.filter(g => OFFER[kind].includes(g.id)).map(g => ({ g, items:g.items.filter(it => !q || it.t.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)) })).filter(x => x.items.length);
    const mark = t => { const i = q ? t.toLowerCase().indexOf(q) : -1; return i < 0 ? esc(t) : esc(t.slice(0, i)) + '<mark>' + esc(t.slice(i, i + q.length)) + '</mark>' + esc(t.slice(i + q.length)); };
    let k = 0;
    ls.innerHTML = groups.length ? groups.map(({ g, items }) => `<div role="group" aria-labelledby="acx-g-${g.id}-${uid}"><div class="acx-gh" id="acx-g-${g.id}-${uid}">${g.label}</div>${items.map(it => { const i = k++; return `<div class="acx-o" role="option" aria-selected="false" id="acx-o-${uid}-${i}" aria-describedby="acx-od-${uid}-${i}" data-g="${g.id}" data-t="${esc(it.t)}">${tile({ ic:it.ic, av:g.av }, 'xs')}<span>${mark(it.t)}</span><span id="acx-od-${uid}-${i}" hidden>${esc(it.desc)}</span></div>`; }).join('')}</div>`).join('')
      : `<p class="acx-pe">No steps match “${esc(qi.value.trim())}”</p>`;
    opts = $$('.acx-o', ls);
    opts.forEach((o, i) => { o.onpointermove = () => { if (act !== i) hl(i, false); }; o.onclick = e => { e.stopPropagation(); add(o, e.isTrusted); }; });
    hl(opts.length ? 0 : -1, true);
  }
  const itemOf = o => CAT.find(g => g.id === o.dataset.g).items.find(it => it.t === o.dataset.t);
  function hl(i, scroll){
    act = i; opts.forEach((o, j) => { o.classList.toggle('on', j === i); o.setAttribute('aria-selected', j === i); });
    const o = opts[i]; qi.setAttribute('aria-activedescendant', o ? o.id : '');
    pd.textContent = o ? itemOf(o).desc : 'Try another word';
    if (o && scroll){ const t = o.offsetTop - ls.offsetTop, b2 = t + o.offsetHeight; if (t < ls.scrollTop) ls.scrollTop = t - 24; else if (b2 > ls.scrollTop + ls.clientHeight) ls.scrollTop = b2 - ls.clientHeight; }
  }
  function openPk(b, focus){
    close(); if (pkFor && pkFor !== b) pkFor.setAttribute('aria-expanded', 'false');
    pkFor = b; b.setAttribute('aria-expanded', 'true'); qi.value = ''; ls.scrollTop = 0; paint();
    const src = byId(b.dataset.for), kind = b.dataset.k;
    pk.setAttribute('aria-label', kind === 'out' ? `Add a step after ${src.t}` : `Add ${kind === 'model' ? 'a model' : 'a tool'} to ${src.t}`);
    const W = cv.clientWidth, H = cv.clientHeight, pw = pk.offsetWidth, ph = pk.offsetHeight, K = scr(box(b)), S = scr(box(el(src.id))), M = 6, G = 8, OVER = -M;
    const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v)), kx = K.l + K.w / 2, ky = K.t + K.h / 2;
    const over = (x, y, o) => Math.max(0, Math.min(x + pw, o.r) - Math.max(x, o.l)) * Math.max(0, Math.min(y + ph, o.b) - Math.max(y, o.t));
    const others = N.filter(n => n !== src && placed(n)).map(n => scr(box(el(n.id))));
    const ys = [ky - 40, K.t, K.b - ph, M, H - ph - M, H - ph + OVER], xs = [kx - pw / 2, K.l, K.r - pw, S.l, S.r - pw, M, W - pw - M];
    const spots = [...ys.map(y => [K.r + G, y]), ...ys.map(y => [Math.min(K.l, S.l) - pw - G, y]), ...xs.map(x => [x, Math.max(K.b, kind === 'out' && !narrow() ? S.b : K.b) + G]), ...xs.map(x => [x, Math.min(K.t, S.t) - ph - G])]
      .map(([x, y]) => [cl(x, M, W - pw - M), cl(y, M, H - ph + OVER)]);
    let best = spots[0], bs = Infinity;
    for (const [x, y] of spots){ const sc = others.reduce((a2, o) => a2 + over(x, y, o), 0) + (over(x, y, S) + over(x, y, K)) * 8 + Math.max(0, y + ph - (H - M)) * 20 + Math.hypot(x + pw / 2 - kx, y + ph / 2 - ky) / 100; if (sc < bs){ bs = sc; best = [x, y]; } }
    pk.style.left = best[0] + 'px'; pk.style.top = best[1] + 'px';
    pk.classList.add('open'); pk.inert = false;
    if (focus) qi.focus({ preventScroll:true });
  }
  function closePk(back){
    if (!pkFor) return; const b = pkFor, was = pk.contains(document.activeElement);
    pk.classList.remove('open'); pk.inert = true; b.setAttribute('aria-expanded', 'false'); pkFor = null;
    if (b.isConnected && (back || was)) b.focus({ preventScroll:true });
  }
  c.on(qi, 'input', paint);
  c.on(pk, 'keydown', e => {
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowUp'){ e.preventDefault(); if (opts.length) hl((act + (k === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length, true); }
    else if (k === 'Enter'){ e.preventDefault(); if (opts[act]) add(opts[act], true); }
    else if (k === 'Escape'){ e.preventDefault(); e.stopPropagation(); closePk(true); }
    else if (k === 'Tab') closePk();
  });
  pk.onclick = e => e.stopPropagation();
  c.on(document, 'pointerdown', e => { if (pkFor && !pk.contains(e.target) && e.target !== pkFor && !pkFor.contains(e.target)) closePk(); });
  // picking one adds the step, wired from the + or connector it was opened from: its wire draws in first, then the step
  // arrives at its end, and the focus moves on to it
  let seq = 0;
  function add(o, focus){
    const b = pkFor; if (!b) return;
    const it = itemOf(o), g = CAT.find(x => x.id === o.dataset.g), src = byId(b.dataset.for), kind = b.dataset.k === 'out' ? null : b.dataset.k;
    const n = { id:'n' + ++seq, ic:it.ic, av:g.av, t:it.t, d:it.f[1][0], f:it.f, add:true, kind, ms:'queued' };
    closePk(); N.push(n); E.push(kind ? [src.id, n.id, kind] : [src.id, n.id]);
    const nb = html(nodeHTML(n)); nodes.insertBefore(nb, $('.acx-h, .acx-sc', nodes)); setMark(n, 'queued'); bind(n);
    if (!REDUCE){ nb.classList.add('add'); nb.style.animationDelay = '.3s'; }
    layout();
    wireOf(key(src.id, n.id)).rv0 = NOW;
    $$('.acx-h, .acx-sc', nodes).forEach(x => { if (!x.dataset.seen){ x.dataset.seen = 1; if (!x.isSameNode(b)) x.classList.add('in'); x.style.animationDelay = '.5s'; if (stub[x.dataset.for + ':' + x.dataset.k]) stub[x.dataset.for + ':' + x.dataset.k].rv0 = NOW + .4; } });
    say(kind ? `${it.t} added to ${src.t}` : `${it.t} added after ${src.t}`);
    if (focus) nb.focus({ preventScroll:true });
  }

  /* ---------- moving around ---------- */
  sr.id = 'acx-k-' + uid; cv.setAttribute('aria-describedby', sr.id);
  zo.onclick = () => zoomBy(-1); zi.onclick = () => zoomBy(1); zl.onclick = zoomReset; fitB.onclick = fit;
  const pt = e => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  const touch = new Map(); let drag = null;
  const pinch = () => { const [a, b] = [...touch.values()]; return { d:Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, m:[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] }; };
  let engaged = false, lastKey = -1e9;
  const engage = () => { if (engaged) return; engaged = true; cv.classList.add('engaged'); };
  c.on(document, 'keydown', e => { if (e.isTrusted) lastKey = e.timeStamp; }, true);
  c.on(r, 'pointerdown', e => { if (e.isTrusted && e.pointerType !== 'touch') engage(); }, true);
  c.on(r, 'pointerup', e => { if (e.isTrusted && e.pointerType === 'touch') engage(); }, true);
  c.on(r, 'focusin', e => { if (e.isTrusted && e.timeStamp - lastKey < 100) engage(); }, true);
  c.on(vp, 'pointerdown', e => {
    if (e.target.closest('.acx-n, .acx-h, .acx-sc') || (e.button !== 0 && e.button !== 1) || (e.pointerType === 'touch' && !engaged)) return;
    e.preventDefault();
    if (e.isTrusted) cv.focus({ preventScroll:true });
    const p = pt(e);
    if (e.pointerType === 'touch'){
      touch.set(e.pointerId, p);
      if (touch.size === 2){ const q = pinch(); drag = { kind:'pinch', d0:q.d, m0:q.m, z0:z, px0:px, py0:py, moved:true }; }
      else if (touch.size === 1) drag = { kind:'pan', id:e.pointerId, p0:p, px0:px, py0:py, moved:false };
    } else drag = { kind:e.shiftKey && e.button === 0 ? 'box' : 'pan', id:e.pointerId, p0:p, px0:px, py0:py, base:new Set(sel), moved:false };
    if (drag && drag.kind === 'pan') cv.classList.add('pan');
    try { vp.setPointerCapture(e.pointerId); } catch(err){}
  });
  c.on(vp, 'pointermove', e => {
    if (!drag) return; const p = pt(e);
    if (touch.has(e.pointerId)) touch.set(e.pointerId, p);
    if (drag.kind === 'pinch'){
      if (touch.size < 2) return; const q = pinch(), nz = lim(drag.z0 * q.d / drag.d0), wx = (drag.m0[0] - drag.px0) / drag.z0, wy = (drag.m0[1] - drag.py0) / drag.z0;
      z = nz; px = q.m[0] - wx * z; py = q.m[1] - wy * z; apply(false); return;
    }
    if (e.pointerId !== drag.id) return;
    const dx = p[0] - drag.p0[0], dy = p[1] - drag.p0[1];
    if (!drag.moved && Math.hypot(dx, dy) < 3) return; drag.moved = true;
    if (drag.kind === 'pan'){ px = drag.px0 + dx; py = drag.py0 + dy; apply(false); return; }
    const x = Math.min(p[0], drag.p0[0]), y = Math.min(p[1], drag.p0[1]), w = Math.abs(dx), h = Math.abs(dy);
    mq.hidden = false; mq.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
    select([...drag.base, ...N.filter(n => placed(n) && (s2 => s2.r > x && s2.l < x + w && s2.b > y && s2.t < y + h)(scr(box(el(n.id))))).map(n => n.id)]);
  });
  const end = e => {
    touch.delete(e.pointerId);
    if (!drag) return;
    if (drag.kind === 'pinch'){ const [id, p] = [...touch.entries()][0] || []; drag = id === undefined ? null : { kind:'pan', id, p0:p, px0:px, py0:py, moved:true }; return; }
    if (e.pointerId !== drag.id) return;
    const k = drag.kind, m = drag.moved; drag = null; cv.classList.remove('pan'); mq.hidden = true;
    if (k === 'box') picked();
    else if (!m && e.type === 'pointerup' && sel.size){ select([]); picked(); }
  };
  c.on(vp, 'pointerup', end); c.on(vp, 'pointercancel', end);
  c.on(cv, 'wheel', e => {
    if (pk.contains(e.target) || pop.contains(e.target)) return;
    const zoomer = e.ctrlKey || e.metaKey; if (!zoomer && !engaged) return;
    e.preventDefault(); if (e.isTrusted) c.mine = true;
    if (zoomer) return zoomAt(z * Math.exp(-e.deltaY / 300), ...pt(e), false);
    const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? cv.clientHeight : 1;
    let dx = e.deltaX * k, dy = e.deltaY * k; if (e.shiftKey && !dx){ dx = dy; dy = 0; }
    px -= dx; py -= dy; apply(false);
  }, { passive:false });
  c.on(cv, 'pointerdown', () => cv.classList.add('ptr'), true); c.on(document, 'keydown', e => { if (!/^(Control|Meta|Shift|Alt)$/.test(e.key)) cv.classList.remove('ptr'); }, true);
  c.on(cv, 'keydown', e => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || pop.contains(e.target) || pk.contains(e.target) || /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    const k = e.key;
    if (k === '+' || k === '=') zoomBy(1);
    else if (k === '-' || k === '_') zoomBy(-1);
    else if (k === '0' || k === '1' || e.code === 'Digit0' || e.code === 'Digit1') fit();
    else if (e.target === cv && /^Arrow/.test(k)){ const d = e.shiftKey ? 120 : 40; px += k === 'ArrowLeft' ? d : k === 'ArrowRight' ? -d : 0; py += k === 'ArrowUp' ? d : k === 'ArrowDown' ? -d : 0; apply(true); }
    else if (k === 'Escape' && sel.size){ select([]); picked(); }
    else return;
    e.preventDefault();
  });
  c.on(nodes, 'focusin', e => {
    if (cv.classList.contains('ptr')) return;
    const t = e.target.closest('.acx-n, .acx-h, .acx-sc'); if (!t) return;
    const s2 = scr(box(t)), W = cv.clientWidth, H = cv.clientHeight, M = 16, { T, B } = safe();
    const dx = s2.l < M ? M - s2.l : s2.r > W - M ? W - M - s2.r : 0, dy = s2.t < T ? T - s2.t : s2.b > H - B ? H - B - s2.b : 0;
    if (dx || dy){ px += dx; py += dy; apply(true); }
  });
  c.on(vp, 'scroll', () => { vp.scrollLeft = vp.scrollTop = 0; });

  /* ---------- the run ----------
     A test run starts at the trigger. For each step in turn the tint draws along the wires into it, then the step works
     (a spinner on its mark) while the flow band runs along those wires into it, and its mark turns to a tick, or a cross
     when it fails. The agent's model and tools work while the agent does. The first test run after the component mounts
     fails at its last step (a timeout); the next one passes */
  let runId = 0, running = false, runs = 0;
  const status = (t, cls = '') => { DMFlow.swap(st, t); st.classList.toggle('dmf-shim', cls === 'run'); st.classList.toggle('fail', cls === 'fail'); };
  const into = id => E.filter(e => e[1] === id && placed(byId(e[0])) && placed(byId(id))).map(e => wireOf(key(e[0], e[1])));
  const tripOf = ids => Math.max(1.8, ...ids.flatMap(i => into(i).map(w => Math.min(3.4, Math.max(1.8, w.len / 170)))));
  const shim = (id, on) => { const d = $('.d', el(id)); if (d) d.classList.toggle('dmf-shim', on); };
  const runB = $('.acx-run', r);
  runB.onclick = () => c.run(async () => {
    const id = ++runId, wait = async ms => { await c.wait(ms); if (id !== runId) throw 'stop'; };
    const tint = ids => ids.forEach(i => into(i).forEach(w => { w.st = 'on'; w.t0 = NOW; }));
    const work = ids => ids.forEach(i => { setMark(byId(i), 'run'); shim(i, true); into(i).forEach(w => { w.bd.restart(); w.band = true; }); });
    const done = (i, s = 'done') => { setMark(byId(i), s); shim(i, false); };
    running = true; const fails = ++runs === 1, t0 = performance.now();
    try {
      close(); closePk();
      N.forEach(n => { if (n.id !== 't'){ setMark(n, 'queued'); shim(n.id, false); } });
      Object.values(wire).forEach(w => { w.st = 'queued'; w.band = false; w.bd.off(); });
      status('Running test', 'run');
      await wait(400);
      // the trigger starts the two steps after it; the agent's model and tools join in while it works
      const subs = E.filter(e => e[0] === 'b' && e[2]).map(e => e[1]);
      tint(['a', 'b']); await wait(480); work(['a', 'b']);
      const tA = tripOf(['a']) * 1000 + 250;
      let left = tA;
      if (subs.length){ await wait(360); tint(subs); await wait(480); work(subs); left -= 840; const tS = tripOf(subs) * 1000 + 250;
        await wait(Math.max(0, left)); done('a'); await wait(Math.max(0, tS - Math.max(0, left))); subs.forEach(x => done(x)); await wait(300); done('b'); }
      else { await wait(tA); done('a'); await wait(350); done('b'); }
      tint(['c']); await wait(480); work(['c']); await wait(tripOf(['c']) * 1000 + 250);
      if (fails){
        done('c', 'fail'); into('c').forEach(w => { w.st = 'bad'; });
        status('Post summary failed: Slack timed out', 'fail'); say('Test run failed at Post summary: Slack timed out'); return;
      }
      done('c');
      let at = 'c', nx;
      while ((nx = E.find(e => e[0] === at && !e[2]))){ const n2 = nx[1]; tint([n2]); await wait(480); work([n2]); await wait(tripOf([n2]) * 1000 + 250); done(n2); at = n2; }
      const s = `Test passed in ${((performance.now() - t0) / 1000).toFixed(1)}s`; status(s); say(s);
    } finally { if (id === runId) running = false; }
  });

  /* ---------- arrival: the trigger first; each wire draws in from its step towards the next, and the step it leads to
     arrives as the wire reaches it ---------- */
  layout(); apply(false); let lw = 0, ln = narrow();
  const depth = id => id === 't' ? 0 : id === 'a' || id === 'b' ? 1 : 2;
  if (!REDUCE){
    N.forEach(n => { const b = el(n.id); b.classList.add('acx-in'); b.style.animationDelay = [0, .5, 1][depth(n.id)] + 's'; });
    E.forEach(([a2, b2]) => { wireOf(key(a2, b2)).rv0 = NOW + [.15, .65][depth(a2)]; });
    $$('.acx-h, .acx-sc', nodes).forEach(b => { b.dataset.seen = 1; b.classList.add('in'); b.style.animationDelay = '1.35s'; });
    Object.keys(knobs).forEach(k => { const s = stub[k] || (stub[k] = { ln:DMFlow.line(L, 'rail'), rv0:0 }); s.rv0 = NOW + 1.1; });
  } else $$('.acx-h, .acx-sc', nodes).forEach(b => b.dataset.seen = 1);
  const ro = new ResizeObserver(() => { if (lw && Math.abs(cv.clientWidth - lw) > 2){ close(); closePk(); } lw = cv.clientWidth; if (ln !== narrow()){ ln = narrow(); z = 1; px = py = 0; } layout(); apply(false); }); ro.observe(cv); c.offs.push(() => ro.disconnect());

  /* ---------- the preview's story: a test run that fails at its last step, a second run that passes, then the person adds
     a step after the last one from its +, zooms in a step and fits the whole automation back in view ---------- */
  c.story(async s => {
    await s.until(() => go);
    await s.beat(3);
    await s.tap(runB); s.away();
    await s.until(() => !running); await s.beat(4);
    await s.tap(runB); s.away();
    await s.until(() => !running); await s.beat(2);
    const h = knobs['c:out']; if (!h) return;
    await s.tap(h); await s.beat(1.5);
    const o = opts.find(x => x.dataset.t === 'Create ticket'); if (!o) return;
    await s.point(o, false); hl(opts.indexOf(o), true); await s.beat(1.5);
    await s.tap(o); s.away(); await s.beat(3);
    await s.tap(zi); await s.beat(2);
    await s.tap(fitB); s.away(); await s.beat(2);
    window.LAB_DONE = true;
    // a recording plays once
    if (REC) throw 'stop';
  });
});

/* ---------- the page: style, theme, replay, and the recorder's hooks ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const d = document.documentElement, card = $('[data-c="automation-canvas"]');
  const mark = (sel, v) => $$(sel + ' button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
  mark('#sw-style', d.dataset.style === 'soft' ? 'soft' : 'bp');
  mark('#sw-theme', d.dataset.theme === 'dark' ? 'dark' : 'light');
  seg($('#sw-style'), v => { if (v === 'soft') d.dataset.style = 'soft'; else delete d.dataset.style; try { localStorage.setItem('dmui-style', v === 'soft' ? 'soft' : 'blueprint'); } catch(e){} });
  seg($('#sw-theme'), v => { d.dataset.theme = v; try { localStorage.setItem('dmui-theme', v); } catch(e){} });
  // lab only: compare the routed wires with soft-2's curves
  mark('#sw-wires', window.LAB_WIRES);
  seg($('#sw-wires'), v => { window.LAB_WIRES = v; const q = new URLSearchParams(location.search); if (v === 'curve') q.set('wires', 'curve'); else q.delete('wires');
    history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q.toString().replace(/=(&|$)/g, '$1') : '')); });
  $('#replay').addEventListener('click', () => { window.LAB_DONE = false; DM.mount(card, !!card._c); });
});
window.LAB = { start(){ window.LAB_DONE = false; go = true; const card = $('[data-c="automation-canvas"]'); DM.mount(card, !!card._c); } };
})();
