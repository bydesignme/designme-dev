/* Agent run timeline, with the Agent tree's lines (lab). Uses core.js (DM.def, $, I, BRAND) and lab/flow (DMFlow).
   The run: a model step plans the change, its tool calls branch off it, a second model step edits the card and runs the
   tests (they fail once and run again), then the PR and the Slack post. Every step keeps its place on one time axis.
   Lines are drawn every frame from where the marks are: the rail is grey ahead of the run and the accent tint behind it,
   each tool call branches off the step that made it, and the flow band runs from the source down to the step at work.
   A new row opens its space, its line draws to it, then it rises in. Time runs on the DMFlow frame clock, so a clip
   recorder that drives requestAnimationFrame drives the whole run. */
(() => {
  const REC = /[?&]rec\b/.test(location.search);
  const PACE = 1, T_AX = 12, OPEN = .24, BR = .2, REACH = .3, LEAD = .5;
  // each kind: its name in the key, its icon there, and the palette slot its icons are tinted with
  const K = { model:['Model', 'brain', 'pl'], tool:['Tools', 'term', 'pt'], app:['Apps', 'grid', 'pp'] };
  // s: start, d: duration (run seconds); p: the step whose call this is; at: when the row appears (default: just before s);
  // sub: what the step is on, by seconds into it; end: its result
  const STEPS = [
    { id:'src', l:'Start', src:true },
    { id:'plan', l:'Plan the change', ic:'brain', k:'model', s:0, d:1.6, cost:.03, at:-.8, sub:[[0, 'Reading the request'], [.7, 'Planning 3 steps']], end:'Plan in 3 steps' },
    { id:'read', p:'plan', l:'Read 6 files', ic:'file-text', k:'tool', s:1.6, d:2.2, cost:.02, sub:[[0, 'Reading 1 of 6'], [.7, 'Reading 3 of 6'], [1.5, 'Reading 5 of 6']], end:'6 files, 840 lines' },
    { id:'fig', p:'plan', l:'Search Figma', ic:'@figma', k:'app', s:1.9, d:1.4, cost:.01, sub:[[0, 'Searching Pricing v4']], end:'3 frames found' },
    { id:'edit', l:'Edit PricingCard', ic:'edit', k:'model', s:4, d:2.4, cost:.06, at:.15, sub:[[0, 'Writing the change'], [1.2, 'Updating the plan cards']], end:'2 files changed' },
    { id:'test', p:'edit', l:'Run tests', ic:'term', k:'tool', s:6.5, d:1.5, cost:.01, fail:'2 tests failed', sub:[[0, 'Running 48 tests']] },
    { id:'re', p:'edit', l:'Run tests again', ic:'refresh', k:'tool', s:8.1, d:1.9, cost:.01, at:8.02, retry:true, sub:[[0, 'Running 48 tests']], end:'48 passed' },
    { id:'pr', l:'Open a PR on GitHub', ic:'@github', k:'app', s:10.1, d:1, cost:.02, at:.5, sub:[[0, 'Opening the PR']], end:'PR opened' },
    { id:'sl', l:'Post to Slack', ic:'@slack', k:'app', s:11.1, d:.6, cost:.01, at:.85, sub:[[0, 'Posting the summary']], end:'Summary posted' }
  ];
  const END = Math.max(...STEPS.filter(x => !x.src).map(x => x.s + x.d));
  const ez = u => 1 - Math.pow(1 - Math.min(1, Math.max(0, u)), 3);
  const lerp = (a, b, u) => a + (b - a) * u;
  const pct = v => v / T_AX * 100 + '%';

  // one frame clock for every mounted timeline (DMFlow.loop never stops, so it is started once)
  const LIVE = new Set();
  DMFlow.loop((T, dt) => { for (const f of LIVE) f(T, dt); });

  DM.def('agent-run-timeline', (r, c, card) => {
    const art = $('.art', r), rows = $('.art-rows', r), grid = $('.art-grid', r), now = $('.art-now', r), st = $('.art-s', r), foot = $('.art-f', r), tag = $('.art-tag', r);
    const go = !REC || (card && card._go); if (card) card._go = false;
    const TK = [0, 3, 6, 9, 12];
    $('.art-ticks', r).innerHTML = TK.map((t, i) => `<span class="${i % 2 ? 'q' : ''}" style="left:${pct(t)}">${t}s</span>`).join('');
    const ticks = $$('.art-ticks span', r);
    $('.art-key', r).innerHTML = Object.entries(K).map(([id, k]) => `<span role="listitem"><span class="art-kic${id === 'app' ? ' app' : ''}" style="--kt:var(--${k[2]});--kb:var(--${k[2]}-bg)" aria-hidden="true">${I(k[1], 'xs')}</span>${k[0]}<b class="num" data-k="${id}">0.0s</b></span>`).join('');
    const kb = Object.fromEntries($$('.art-key b', r).map(b => [b.dataset.k, b]));

    // the steps, in their places; each row starts closed and hidden
    const S = STEPS.map(x => ({ ...x, kids:[] }));
    const by = id => S.find(x => x.id === id);
    S.forEach(x => { x.parent = x.p ? by(x.p) : null; if (x.parent) x.parent.kids.push(x); x.lv = x.parent ? 1 : 0; if (x.at == null) x.at = x.s - LEAD; x.ph = 0; });
    for (const x of S){
      // the run's source is not a row: its mark sits at the top of the rail, on the time axis
      if (x.src){ x.el = $('.art-src', r); x.mk = $('.dmf-g', x.el); DMFlow.mark(x.mk, 'src'); x.state = 'src'; x.ph = 3; continue; }
      const k = K[x.k];
      const icon = x.src ? '' : `<span class="art-ic" aria-hidden="true">${x.ic[0] === '@' ? BRAND[x.ic.slice(1)] : I(x.ic, 'xs')}</span>`;
      const tip = x.src ? '' : `${x.l}: ${x.d.toFixed(1)}s, $${x.cost.toFixed(2)}${x.fail ? ', ' + x.fail : ''}`;
      x.el = html(`<div class="art-row${x.src ? ' src' : ''}" role="listitem" data-k="${x.k || 'src'}" data-s="${x.src ? 'src' : 'queued'}" style="--lv:${x.lv}${k ? `;--kt:var(--${k[2]});--kb:var(--${k[2]}-bg)` : ''}">
        <span class="art-lab"><span class="dmf-g"></span>${icon}<span class="art-tx"><span class="art-n">${x.l}</span>${x.src ? '' : '<span class="art-sub"></span>'}</span></span>
        <span class="art-lane">${x.src ? '' : `<span class="art-bar" style="left:${pct(x.s)}" data-tip="${tip}"></span>`}</span>
        <span class="art-d num"></span></div>`);
      x.mk = $('.dmf-g', x.el); x.sb = $('.art-sub', x.el); x.bar = $('.art-bar', x.el); x.dur = $('.art-d', x.el); x.nm = $('.art-n', x.el);
      DMFlow.mark(x.mk, x.src ? 'src' : 'queued'); x.state = x.src ? 'src' : 'queued';
      rows.appendChild(x.el);
    }
    const rowsOf = S.filter(x => !x.src);
    for (const x of rowsOf){ x.nh = x.el.offsetHeight; }
    for (const x of rowsOf){ x.el.classList.add('hid'); x.el.style.height = '0px'; }

    // the lines: a grey rail and its tinted part under each top-level step, and a branch for each call
    const L = DMFlow.layer(rows), TL = S.filter(x => !x.p);
    TL.forEach((A, i) => { A.next = TL[i + 1] || null; A.targets = [...A.kids, ...(A.next ? [A.next] : [])]; A.grey = DMFlow.line(L, 'rail'); A.tint = DMFlow.line(L); A.rf = 'start'; A.rt = 'start'; A.ru = 1; A.r0 = -1e9; });
    S.filter(x => x.p).forEach(x => { x.br = DMFlow.line(L); });
    const band = DMFlow.band(L);
    let bandTo = null;

    const state = (x, t) => x.src ? 'src' : t < x.s ? 'queued' : t < x.s + x.d ? 'run' : x.fail ? 'fail' : 'done';
    const subOf = (x, t) => {
      if (x.state === 'queued') return 'Queued';
      if (x.state === 'fail') return x.fail;
      if (x.state === 'done') return x.end;
      let s = x.sub[0][1]; for (const [o, v] of x.sub) if (t - x.s >= o) s = v; return s;
    };
    
    let t = -.9, running = false, finished = false, tEnd = 0, line = '', ft = '', live = '';
    const queue = S.filter(x => !x.src).sort((a, b) => a.at - b.at);
    let last = null;

    function paintStep(x){
      const s = state(x, t);
      if (s !== x.state){ x.state = s; x.el.dataset.s = s; DMFlow.mark(x.mk, s); }
      if (x.src) return;
      const w = Math.max(0, Math.min(x.d, t - x.s));
      x.bar.style.width = pct(w);
      const dv = t >= x.s ? w.toFixed(1) + 's' : '';
      if (x.dur.textContent !== dv) x.dur.textContent = dv;
      const sv = subOf(x, t);
      if (x._sv !== sv){ if (x._sv == null || x.ph < 3) x.sb.textContent = sv; else DMFlow.swap(x.sb, sv); x._sv = sv; }
      x.sb.classList.toggle('dmf-shim', s === 'run');
    }

    function frame(T, dt){
      if (c.dead){ LIVE.delete(frame); return; }
      if (running){ t = Math.min(END + .3, t + dt * PACE); }
      // rows appear one after another, each once the one before it is in
      const nx = queue[0];
      if (nx && running && t >= nx.at && (!last || last.ph >= 3)){ queue.shift(); last = nx; nx.ph = 1; nx.t1 = T; }
      for (const x of S){
        if (x.ph === 1){ const u = (T - x.t1) / OPEN; x.el.style.height = (x.nh * ez(u)) + 'px'; if (u >= 1){ x.el.style.height = ''; x.ph = 2; x.t2 = T; } }
        paintStep(x);
      }

      // where every mark is, this frame, in the rows' own space
      // a small corner at this size: the shared route() with a shorter reach (cut in Blueprint, round in Soft)
      const R = DMFlow.kind() === 'a' ? 10 : 8, G = {};
      for (const x of S) if (x.ph >= 1){ const b = L.box(x.mk); G[x.id] = { cx:b.cx, cy:b.cy, r:DMFlow.markR(x.state) }; }
      const src = S[0]; if (!G.src) return tail(T);
      const X0 = G.src.cx;
      const tgtY = (X) => X.p ? G[X.id].cy - R : G[X.id].cy - G[X.id].r + 1;

      for (const A of TL){
        if (!G[A.id] || A.ph < 3){ A.grey.set(''); A.tint.set(''); continue; }
        const y0 = G[A.id].cy + G[A.id].r - 1;
        // the rail under A draws down to each target in turn (a call's branch point, then the next step's mark)
        let full = y0, part = null;
        for (const X of A.targets) if (X.ph >= 2 && X.q >= 1) full = Math.max(full, tgtY(X));
        for (const X of A.targets){
          if (X.ph < 2 || X.q >= 1) continue;
          const y = tgtY(X);
          if (X.q0 == null){ X.q0 = T; X.qd = y <= full + 1 ? 0 : Math.min(.3, Math.max(.12, (y - full) / 520)); }
          X.q = X.qd ? Math.min(1, (T - X.q0) / X.qd) : 1;
          if (X.q >= 1){ full = Math.max(full, y); X.tq = T; } else if (!part) part = [y, X.q];
        }
        const end = part ? Math.max(full, lerp(full, part[0], ez(part[1]))) : full;
        A.grey.set(end - y0 > 2 ? `M${X0} ${y0}V${end}` : '', 'queued');
        // the tint follows the run: down to the furthest target that has started
        let want = 'start';
        if (A.state !== 'queued') for (const X of A.targets) if (X.ph >= 2 && X.q >= 1 && t >= X.s) want = X;
        if (want !== A.rt){ A.rf = A.ru >= 1 ? A.rt : A.rf; A.rt = want; A.ru = 0; A.r0 = T; }
        A.ru = Math.min(1, (T - A.r0) / REACH);
        const yOf = o => o === 'start' ? y0 : tgtY(o);
        const reach = Math.min(end, lerp(yOf(A.rf), yOf(A.rt), ez(A.ru)));
        A.reach = reach;
        A.tint.set(reach - y0 > 2 ? `M${X0} ${y0}V${reach}` : '', 'on');
        A.ok = A.ru >= 1 ? A.rt : null;
        // the calls branch off the rail once it reaches their point, then the row rises in
        for (const X of A.kids){
          if (!G[X.id] || X.ph < 2 || !(X.q >= 1)){ X.br.set(''); continue; }
          const g = G[X.id], yb = g.cy - R, lit = X.state !== 'queued' && reach >= yb - .5;
          // a call that is already at work waits for the tint to reach its point, so its branch draws in the tint
          if (X.b0 == null && (X.state === 'queued' || lit)) X.b0 = T;
          if (X.b0 == null){ X.br.set(''); continue; }
          const p = Math.min(1, (T - X.b0) / BR);
          X.br.set(DMFlow.route([[X0, yb], [X0, g.cy], [g.cx - g.r + 1, g.cy]], R), X.state === 'fail' ? 'bad' : lit ? 'on' : 'queued', p);
          X.lit = lit && p >= 1;
          if (p >= 1 && X.ph === 2) show(X, T);
        }
        // a top-level step rises in once the rail reaches its mark
        if (A.next && A.next.ph === 2 && A.next.q >= 1) show(A.next, T);
      }

      // the band: from the source's edge, down the rail, to the step at work, once its whole route is drawn and lit
      let tg = null; for (const x of S) if (x.ph >= 3 && x.state === 'run' && (!tg || x.s >= tg.s)) tg = x;
      if (tg !== bandTo){ bandTo = tg; band.restart(); }
      let d = null;
      if (tg){
        const top = tg.p ? tg.parent : tg, prev = TL[TL.indexOf(top) - 1];
        const ready = tg.p ? (tg.parent.ok === tg && tg.lit) : (prev && prev.ok === tg);
        if (ready){ const ys = G.src.cy + G.src.r - 1, g = G[tg.id];
          d = tg.p ? DMFlow.route([[X0, ys], [X0, g.cy], [g.cx, g.cy]], R) : DMFlow.route([[X0, ys], [X0, g.cy]], R); }
      }
      if (d) band.tick(d, T); else band.off();
      tail(T);
    }
    function show(x, T){ x.ph = 3; x.el.classList.remove('hid'); if (!REDUCE) x.el.classList.add('dmf-in'); }

    // the header, the key, the playhead and the footer
    function tail(T){
      const tt = Math.max(0, Math.min(t, END));
      grid.style.setProperty('--p', (tt / T_AX).toFixed(4));
      if (!finished) now.textContent = tt.toFixed(1) + 's';
      let cost = 0, n = 0, re = 0; const per = { model:0, tool:0, app:0 }, run = [];
      for (const x of S){ if (x.src || t < x.s) continue; const w = Math.min(x.d, t - x.s); n++; cost += x.cost * w / x.d; per[x.k] += w; if (x.retry) re++; if (x.state === 'run' && x.ph >= 3) run.push(x.l); }
      for (const k in per){ const v = per[k].toFixed(1) + 's'; if (kb[k].textContent !== v) kb[k].textContent = v; }
      const f = `<span>${I('clock', 'xs')}<span><b class="num">${tt.toFixed(1)}s</b> total</span></span><span>${I('dollar', 'xs')}<span><b class="num">$${cost.toFixed(2)}</b> cost</span></span><span>${I('layers', 'xs')}<span><b class="num">${n}</b> ${n === 1 ? 'step' : 'steps'}</span></span><span>${I('refresh', 'xs')}<span><b class="num">${re}</b> ${re === 1 ? 'retry' : 'retries'}</span></span>`;
      if (f !== ft){ foot.innerHTML = f; ft = f; }
      // between two steps the line keeps the last one's name, so it never flickers
      if (!finished && run.length && run.join(', ') !== line){ line = run.join(', '); DMFlow.swap(st, line); st.classList.add('dmf-shim'); }
      // the time on the playhead covers the axis labels it passes
      const b = now.getBoundingClientRect();
      ticks.forEach(el => { const x = el.getBoundingClientRect(); el.classList.toggle('hid', x.right > b.left - 4 && x.left < b.right + 4); });
      if (running && t >= END + .3) finish(T);
      if (finished && !REC && !c.mine && T - tEnd > 3.5 && !c._again){ c._again = true; DM.again(card); }
    }
    function finish(T){
      running = false; finished = true; tEnd = T;
      art.classList.remove('live'); art.classList.add('fin');
      now.innerHTML = I('check', 'xs') + END.toFixed(1) + 's';
      tag.className = 'art-tag tag ok'; tag.innerHTML = I('check', 'xs') + 'Done';
      st.classList.remove('dmf-shim');
      DMFlow.swap(st, `Finished in ${END.toFixed(1)}s, 1 retry`);
      sayIt('Run finished in ' + END.toFixed(1) + ' seconds, with 1 retry');
      window.LAB_DONE = true;
    }
    const sr = $('.art-live', r), sayIt = m => { if (sr) sr.textContent = m; };

    function start(){ running = true; art.classList.add('live'); window.LAB_DONE = false; }
    LIVE.add(frame); c.offs.push(() => LIVE.delete(frame));
    tail(0);
    if (go) start();
  });

  // the lab page's hook for the clip recorder: start (or restart) the run
  window.LAB = { start(){
    const card = $('[data-c="agent-run-timeline"]');
    const fire = () => { card._go = true; DM.mount(card, true); };
    if (card._c) fire(); else { const w = () => card._c ? fire() : requestAnimationFrame(w); w(); }
  } };
})();
