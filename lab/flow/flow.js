/* DMFlow: the Agent tree's lines, corners, flow band and state marks, shared by the lab pages that take its treatment
   (Agent lanes, Trace view, Automation canvas, Agent builder, Steering, Agent run timeline).

   The rules, from the Agent tree pilot:
   - Lines are one tint: the accent mixed into the surface (--flow) once something is running or done, the grey rail while
     queued, the bad colour only for a failure. Agent and brand colours stay on icons, never on lines.
   - A line leaves straight, then turns. Blueprint cuts each corner at 45 degrees (sharp joints, R 18px); Soft rounds it (a
     quadratic curve, R 14px). DMFlow.route() draws any polyline that way.
   - Lines end 1px under the mark they meet, so nothing floats or leaves a gap, and are recomputed every frame from where the
     elements are, so they never lag a row that moved.
   - The flow is one band (the owner's Figma highlight): 210px long, clear, light 50%, the accent at .541, light 70%, clear.
     It eases along a route to whatever is running (about 170px a second, 1.8 to 3.4s a trip, a .35s rest), fading in as it
     leaves and out as it arrives. No dots, glows, blur or pulsing. A route must be one piece: dashes restart per subpath.
   - Marks swap at once (spinner to tick, no fade from empty) and the tick draws itself.
   - Where a run starts (the source, the trigger, the orchestrator) the mark is 'src': a filled accent disc with a white
     border. Every line and band leaves from a mark's edge (markR), never its centre.
   - Marks sit above the lines: give whatever holds a mark a stacking order above the overlay (z-index 2) if it has a
     transform, filter or opacity animation, or the lines will paint over it. */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (t, a = {}) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  // 'a' angled (Blueprint) or 'b' rounded (Soft)
  const kind = () => document.documentElement.dataset.style === 'soft' ? 'b' : 'a';
  const R = () => kind() === 'a' ? 18 : 14;

  // a polyline with every inner corner cut at 45 degrees ('a') or rounded ('b'); r is the corner's reach along each leg
  function route(pts, r = R(), k = kind()){
    pts = pts.filter((p, i) => !i || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > .01);
    if (pts.length < 2) return '';
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++){
      const [px, py] = pts[i - 1], [cx, cy] = pts[i], [nx, ny] = pts[i + 1];
      const l1 = Math.hypot(cx - px, cy - py), l2 = Math.hypot(nx - cx, ny - cy);
      const c = Math.min(r, i === 1 ? l1 : l1 / 2, i === pts.length - 2 ? l2 : l2 / 2);
      const ax = cx - (cx - px) / l1 * c, ay = cy - (cy - py) / l1 * c, bx = cx + (nx - cx) / l2 * c, by = cy + (ny - cy) / l2 * c;
      d += `L${ax} ${ay}` + (k === 'a' ? `L${bx} ${by}` : `Q${cx} ${cy} ${bx} ${by}`);
    }
    const z = pts[pts.length - 1]; return d + `L${z[0]} ${z[1]}`;
  }
  // a branch off a vertical line at x0: down to y1, turning out to x1 (the Agent tree's branch)
  const branch = (x0, y0, x1, y1) => route([[x0, y0], [x0, y1], [x1, y1]]);

  // the overlay: an svg laid over host (position:relative), in host's own pixel space
  function layer(host){
    const svg = mk('svg', { class:'dmf-ln', 'aria-hidden':'true' }), defs = mk('defs');
    const g = { rail:mk('g'), lines:mk('g'), fx:mk('g') };
    svg.append(defs, g.rail, g.lines, g.fx); host.prepend(svg);
    // where an element is, in host space (immune to transforms and zoom on the page)
    const box = el => { const h = host.getBoundingClientRect(), s = h.width / (host.offsetWidth || h.width) || 1, b = el.getBoundingClientRect();
      return { x:(b.left - h.left) / s, y:(b.top - h.top) / s, w:b.width / s, h:b.height / s, cx:(b.left + b.width / 2 - h.left) / s, cy:(b.top + b.height / 2 - h.top) / s }; };
    return { svg, defs, g, box, host };
  }

  // a line: path + reveal. set(d) redraws it; state 'queued' | 'on' | 'bad'; reveal 0..1 draws it from its start
  function line(L, group = 'lines'){
    const p = mk('path', { class:'b' }); L.g[group].append(p);
    return { el:p, set(d, st = 'on', reveal = 1){
      p.setAttribute('d', d || ''); p.classList.toggle('on', st === 'on'); p.classList.toggle('bad', st === 'bad');
      if (!d) return; if (reveal >= 1){ p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; return; }
      const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len * (1 - Math.max(0, reveal)); },
      remove(){ p.remove(); } };
  }

  // the flow band along a route. tick(d, T) moves it for clock T (seconds); off() hides it
  const BAND = 210, CORE = .541, HL = [[0, 'l0'], [.19, 'l1'], [CORE, 'c'], [.781, 'l2'], [1, 'l0']];
  let pid = 0;
  const along = (pth, len, t) => { if (t >= 0 && t <= len) return pth.getPointAtLength(t);
    const q = pth.getPointAtLength(t < 0 ? 0 : len), r = pth.getPointAtLength(t < 0 ? Math.min(len, 1) : Math.max(0, len - 1)), dx = q.x - r.x, dy = q.y - r.y, m = Math.hypot(dx, dy) || 1, k = t < 0 ? -t : t - len;
    return { x:q.x + dx / m * k, y:q.y + dy / m * k }; };
  function band(L, o = {}){
    const id = 'dmfb' + (++pid), gr = mk('linearGradient', { id, gradientUnits:'userSpaceOnUse' });
    HL.forEach(([off, c]) => gr.append(mk('stop', { class:c, offset:off }))); L.defs.append(gr);
    const el = mk('g', { class:'dmf-band' }), core = mk('path', { stroke:`url(#${id})` }); el.append(core); L.g.fx.append(el);
    el.style.opacity = 0;
    const f = { start:null, len0:0, trip:0, loop:o.loop !== false };
    return {
      el,
      tick(d, T){
        if (!d){ el.style.opacity = 0; return false; }
        core.setAttribute('d', d); const len = core.getTotalLength();
        if (f.start == null || (f.loop && T - f.start >= f.trip + .35)){ f.start = T; f.len0 = len; f.trip = Math.min(3.4, Math.max(1.8, len / 170)); }
        const u = (T - f.start) / f.trip;
        if (u >= 1 || u < 0){ el.style.opacity = 0; return u >= 1; }
        el.style.opacity = Math.min(1, u / .18, (1 - u) / .22).toFixed(3);
        const at = Math.min(len, (.5 - Math.cos(Math.PI * u) / 2) * f.len0), t0 = at - BAND * CORE, t1 = t0 + BAND;
        core.style.strokeDasharray = `${BAND} ${len + BAND * 2}`; core.style.strokeDashoffset = -t0;
        const a = along(core, len, t0), b = along(core, len, t1);
        gr.setAttribute('x1', a.x); gr.setAttribute('y1', a.y); gr.setAttribute('x2', b.x + (a.x === b.x ? .01 : 0)); gr.setAttribute('y2', b.y + (a.y === b.y ? .01 : 0));
        return false;
      },
      // start the next trip now (for example when the route's target changes)
      restart(){ f.start = null; },
      off(){ el.style.opacity = 0; f.start = null; },
      remove(){ el.remove(); gr.remove(); }
    };
  }

  // a state mark: <span class="dmf-g"> with a ring (queued), spinner (run), tick (done), cross (fail) or the source disc (src). mark(el, s) swaps it at
  // once; a tick draws itself
  const TICK = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"/></svg>';
  const CROSS = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" pathLength="1"/></svg>';
  function mark(el, s){
    if (el.dataset.s === s) return; el.dataset.s = s;
    el.className = 'dmf-g ' + s;
    el.innerHTML = s === 'run' ? '<span class="spin"></span>' : s === 'done' ? TICK : s === 'fail' ? CROSS : s === 'src' ? '<span class="dot"></span>' : '<span class="ring"></span>';
    if (s === 'done' || s === 'fail'){ void el.offsetWidth; el.classList.add('drw'); }
  }
  // the visible radius of a mark in a state (lines end 1px under it)
  const markR = s => s === 'queued' ? 7 : s === 'run' ? 9.5 : s === 'src' ? 11 : 15;

  // swap a line of text in place (the Agent tree's step text)
  function swap(el, t){ el.textContent = t; el.classList.remove('dmf-sw'); void el.offsetWidth; el.classList.add('dmf-sw'); }

  // a clock in seconds that keeps time with requestAnimationFrame (the clip recorder drives rAF and performance.now)
  // returns a stop function
  function loop(fn){ let last = 0, T = 0, on = true; const f = t => { if (!on) return; const dt = last ? Math.min(.05, (t - last) / 1000) : 0; last = t; T += dt; fn(T, dt); requestAnimationFrame(f); }; requestAnimationFrame(f); return () => { on = false; }; }

  window.DMFlow = { kind, R, route, branch, layer, line, band, mark, markR, swap, loop, BAND };
})();
