/* Trace view, with the Agent tree's lines (lab). The run, its spans, the details and the story are the library's Trace view
   (soft-2/index.html, data-c="trace-view"); what changes is how the span tree is drawn:
   - every span branches off its parent's vertical line and ends 1px under its state mark (lab/flow: DMFlow.route, line, mark);
   - the root, where the run starts, is the source disc; a running span is a spinner, a finished one a tick, a failed one a cross;
   - the flow band runs from the root's edge down to the span that is running now, as one path through the marks;
   - every bar is the one accent tint, and a span's state is its mark, not its bar's colour.
   Lines are recomputed every frame from where the marks are, so they never lag a row that moved (the details opening, the
   stage re-centring). A line draws down its parent's line, then out to its row, before the row rises in. */
(() => {
  const REC = /[?&]rec\b/.test(location.search), FAIL = /[?&]fail\b/.test(location.search);
  const card = document.getElementById('c-trace-view');
  // the one frame clock for the lines and the run (DMFlow.loop); each mount hands it its frame
  let live = null;
  DMFlow.loop((T, dt) => { if (live && !live.c.dead) live.frame(T, dt); });

  DM.def('trace-view', (r, c) => {
    // the kinds of span, each with its mark (icon). The name is always on the mark, in a tooltip, and in the span's label
    const K = { agent:['Agent','cpu'], llm:['LLM call','spark'], tool:['Tool call','term'], ret:['Retrieval','search'] };
    // one run, in seconds from its start. A tool call that takes longer than SLOW seconds is flagged
    const SPAN = 5, SLOW = 2, PACE = 1.5;
    const S = [
      { id:'run', k:'agent', n:'Pricing research', s:0, d:4.82, lv:0, in:"Compare Northwind's plans with ours", out:'3 prices saved to Pricing research' },
      { id:'plan', k:'llm', n:'Plan the steps', s:.04, d:.62, tk:1240, lv:1, in:'The task and 2 earlier messages', out:'Search notes, fetch the page, summarise' },
      { id:'notes', k:'ret', n:'Search saved notes', s:.7, d:.38, tk:910, lv:1, in:'"northwind pricing", top 4', out:'4 notes, best match 0.82' },
      { id:'fetch', k:'tool', n:'fetch_page', s:1.12, d:2.46, tk:3120, lv:1, in:'GET northwind.app/pricing', out:'200 OK, 48 KB, 3 plans' },
      { id:'sum', k:'agent', n:'Summariser', s:3.62, d:1.02, lv:1, in:'The page and 4 notes', out:'A 120-word summary' },
      { id:'write', k:'llm', n:'Write the summary', s:3.66, d:.94, tk:2380, lv:2, in:'Page text and notes, 2,050 tokens', out:'120 words, 3 prices' },
      { id:'ans', k:'llm', n:'Final answer', s:4.66, d:.16, tk:560, lv:1, in:'The summary', out:'3 prices saved to Pricing research' }
    ];
    // ?fail: the notes search fails (the lab's look at a failed span); the run carries on without them
    if (FAIL) Object.assign(S[2], { fail:true, out:'Index timed out, no notes' });
    const END = Math.max(...S.map(x => x.s + x.d));
    S.forEach((x, i) => { x.kids = []; for (let j = i + 1; j < S.length && S[j].lv > x.lv; j++) x.kids.push(S[j]); });
    S.forEach((x, i) => { for (let j = i - 1; j >= 0; j--) if (S[j].lv === x.lv - 1){ x.up = S[j]; break; } });
    S.forEach(x => { x.sub = S.filter(y => y.up === x); });
    const root = $('.trv', r), rows = $('.trv-rows', r), stEl = $('.trv-st', r), tot = $('.trv-tot', r), dt = $('.trv-dt', r), dc = $('.trv-dc', r), lg = $('.trv-lg', r);
    // the key: every kind but the agents, with its icon and how many of its spans have started
    const KEYS = ['llm', 'tool', 'ret'];
    lg.innerHTML = KEYS.map(k => `<span role="listitem" class="z" data-k="${k}">${I(K[k][1], 'xs')}${K[k][0]} <b class="num">0</b></span>`).join('');
    $('.trv-sc', r).innerHTML = Array.from({ length:Math.ceil(SPAN / 2) }, (_, i) => `<span style="left:${i * 2 / SPAN * 100}%">${i * 2}s</span>`).join('');
    const sec = v => v.toFixed(2) + 's', tks = v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(Math.round(v));
    let T = 0, started = false, sel = null, said = '';
    S.forEach(x => {
      const [kind, icon] = K[x.k];
      x.el = html(`<button type="button" class="trv-r${x.lv ? '' : ' root'}" data-k="${x.k}" aria-expanded="false" style="--lv:${x.lv}" hidden><span class="trv-n"><span class="dmf-g"></span><span class="trv-k" data-tip="${kind}">${I(icon,'xs')}</span><span class="trv-nm">${x.n}</span></span><span class="trv-b"><i style="left:${x.s / SPAN * 100}%;width:${x.d / SPAN * 100}%"></i></span><span class="trv-tk num"></span><span class="trv-ms num"></span></button>`);
      x.mk = $('.dmf-g', x.el); x.ms = x.lv ? 'run' : 'src'; DMFlow.mark(x.mk, x.ms);
      x.el.onclick = () => open(x === sel ? null : x);
      rows.appendChild(x.el);
    });
    const took = x => Math.max(0, Math.min(T, x.s + x.d) - x.s);
    const used = x => x.k === 'agent' ? x.kids.reduce((a, k) => a + (k.k === 'agent' ? 0 : used(k)), 0) : x.tk * Math.min(1, took(x) / x.d);
    const vis = x => !x.el.hidden;

    // ---------- the run: rows, marks, numbers ----------
    let had = 0, txtAt = -1e9;
    function paint(){
      let shown = 0;
      // the times and token counts change ten times a second, not every frame: each change of text lays the page out
      const now = performance.now(), txt = T >= END || now - txtAt >= 100; if (txt) txtAt = now;
      S.forEach(x => {
        if (!started || T < x.s) return; shown++;
        if (x.el.hidden){ x.el.hidden = false; if (x.lv) x.el.classList.add('pre'); else rise(x); }
        const w = took(x), run = T < x.s + x.d, kind = K[x.k][0];
        x.el.classList.toggle('run', run);
        // the mark: the root keeps its source disc; a span spins while it runs and ticks (or crosses) when it ends
        if (x.lv){ const ms = run ? 'run' : x.fail ? 'fail' : 'done'; if (ms !== x.ms){ x.ms = ms; DMFlow.mark(x.mk, ms); x.el.classList.toggle('fail', ms === 'fail'); if (ms === 'fail') flag(x, 'bad', 'failed', 'The search index timed out'); } }
        const f = x.d ? w / x.d : 1; if (f !== x._f){ x._f = f; $('.trv-b i', x.el).style.setProperty('--f', f.toFixed(4)); }
        const say = txt || (!run && !x._fin); if (!run) x._fin = true;
        if (say){ const ms = sec(w), tk = tks(used(x)); if (x._ms !== ms){ x._ms = ms; $('.trv-ms', x.el).textContent = ms; } if (x._tk !== tk){ x._tk = tk; $('.trv-tk', x.el).textContent = tk; } }
        if (x.k === 'tool' && w > SLOW && !x.slow){ x.slow = true; x.el.classList.add('slow'); flag(x, 'warn', 'slow', `Over the ${SLOW}s budget for a tool call`); }
        if (say){ const al = `${x.n}, ${kind}, ${run ? 'running, ' : x.fail ? 'failed, ' : ''}${sec(w)}, ${Math.round(used(x)).toLocaleString('en-US')} tokens${x.slow ? ', slow' : ''}`; if (x._al !== al){ x._al = al; x.el.setAttribute('aria-label', al); } }
      });
      if (shown !== had){ had = shown;
        KEYS.forEach(k => { const n = S.filter(x => x.k === k && vis(x)).length, el = $(`[data-k="${k}"]`, lg), b = $('b', el); el.classList.toggle('z', !n); if (b.textContent !== String(n)) b.textContent = n; }); }
      root.style.setProperty('--now', Math.min(T, END) / SPAN); root.classList.toggle('live', started && T > 0 && T < END);
      if (txt) tot.textContent = sec(Math.min(T, END));
      const slow = S.filter(x => x.slow).length, bad = S.filter(x => x.fail && T >= x.s + x.d).length;
      const tail = [slow && `${slow} slow`, bad && `${bad} failed`].filter(Boolean).join(', ');
      const line = T >= END ? `Done · ${S.length} spans${tail ? ', ' + tail : ''}` : `Running · ${Math.max(1, shown)} span${shown > 1 ? 's' : ''}`;
      if (line !== said){ said = line; DMFlow.swap($('.m', stEl), line); }
      if (sel) fill();
    }
    // a row rises in once its line has drawn to it: its mark shows at once where the line ends, the rest rises in
    function rise(x){ x.el.classList.remove('pre'); x.risen = true; x.el.querySelectorAll('.trv-k,.trv-nm,.trv-n .tag,.trv-b i,.trv-tk,.trv-ms').forEach(p => p.classList.add('dmf-in')); }
    // a status chip on a span: slow (over budget) or failed. On a narrow card the time carries the same tooltip
    function flag(x, tone, t, why){
      const old = $('.tag', x.el); if (old) old.remove();
      const tg = html(`<span class="tag ${tone} dmf-in" data-tip="${why}">${t}</span>`); $('.trv-n', x.el).appendChild(tg);
      $('.trv-ms', x.el).dataset.tip = why;
    }

    // ---------- the lines ----------
    const L = DMFlow.layer(rows), band = DMFlow.band(L);
    S.forEach(x => { if (x.sub.length) x.trunk = DMFlow.line(L); if (x.up){ x.br = DMFlow.line(L); x.tr = 0; x.dr = 0; } });
    let LT = 0, bandTo = null, bandOff = false;
    // a corner turns at the style's reach (DMFlow.R), less only if a level is too narrow for it, and the same for every
    // state of the mark, so a branch never changes shape when its spinner turns into a tick
    const reach = (p, k) => Math.min(DMFlow.R(), k.g.cx - p.g.cx - 14);
    const edge = x => x.g.cy + DMFlow.markR(x.ms) - 1;
    function draw(dt){
      const fast = 1 - Math.exp(-dt * 20);
      S.forEach(x => { if (vis(x)) x.g = L.box(x.mk); });
      for (const p of S){
        if (!p.trunk) continue;
        const kids = p.sub.filter(vis);
        // a span's own line waits until its mark is on show, so no line ever starts from nothing
        if (!vis(p) || !kids.length || (p.lv && !p.risen)){ p.trunk.set(''); kids.forEach(k => k.br.set('')); continue; }
        const x0 = p.g.cx, y0 = edge(p);
        // the parent's line grows down to each child in turn; its end is worked out from where the rows are now, so it
        // never trails a branch that moved
        let end = y0, prevDone = true;
        for (const k of kids){
          if (prevDone) k.tr = k.tr + (1 - k.tr) * fast; if (k.tr > .995) k.tr = 1;
          const to = k.g.cy - reach(p, k); if (prevDone) end = end + (to - end) * k.tr;
          prevDone = prevDone && k.tr === 1;
          // then the branch draws out to the child's mark, ending 1px under it
          if (k.tr === 1){ k.dr = k.dr + (1 - k.dr) * fast; if (k.dr > .995) k.dr = 1; }
          const c = reach(p, k);
          if (k.dr > .97 && !k.risen) rise(k);
          if (k.dr < .03){ k.br.set(''); continue; }
          k.br.set(DMFlow.route([[x0, k.g.cy - c], [x0, k.g.cy], [k.g.cx - DMFlow.markR(k.ms) + 1, k.g.cy]], c), k.ms === 'fail' ? 'bad' : 'on', k.dr);
        }
        // a line only shows once it has some length, so a line just starting never leaves a dot under its parent
        p.trunk.set(end - y0 > 3 ? DMFlow.route([[x0, y0], [x0, end]]) : '', 'on');
      }
      // the flow: from the root's edge down to the span running now, one path through the marks between. It moves to a new
      // span only once that span's whole route is drawn, never runs to a span that failed, and stops when the run ends
      const leaf = started && T < END ? S.filter(x => x.lv && vis(x) && x.ms === 'run' && !x.sub.some(k => vis(k) && k.ms === 'run')).pop() : null;
      const chain = x => { const a = []; for (; x; x = x.up) a.unshift(x); return a; };
      if (leaf && chain(leaf).every(x => !x.lv || x.dr === 1)) bandTo = leaf;
      if (!started || T >= END || !bandTo || !vis(bandTo) || bandTo.ms === 'fail'){ if (!bandOff){ band.off(); bandOff = true; } return; }
      const ch = chain(bandTo); let d = '';
      for (let i = 1; i < ch.length; i++){
        const p = ch[i - 1], k = ch[i], c = reach(p, k);
        const seg = DMFlow.route([[p.g.cx, i === 1 ? edge(p) : p.g.cy], [p.g.cx, k.g.cy], [k.g.cx, k.g.cy]], c);
        d += i === 1 ? seg : seg.replace(/^M/, 'L');
      }
      bandOff = false; band.tick(d, LT);
    }

    // ---------- details ----------
    function open(x){
      if (sel) sel.el.setAttribute('aria-expanded', 'false');
      sel = x; dt.classList.toggle('shut', !x); dt.inert = !x; rows.classList.toggle('sel', !!x);
      if (!x) return;
      x.el.setAttribute('aria-expanded', 'true');
      const [kind, icon] = K[x.k];
      const tag = x.fail && T >= x.s + x.d ? '<span class="tag bad">failed</span>' : x.slow ? '<span class="tag warn">slow</span>' : '';
      dc.innerHTML = `<div class="trv-dh"><span class="trv-k">${I(icon,'xs')}</span><b>${x.n}</b>${tag}<button class="ib trv-x" aria-label="Close details" data-tip="Close">${I('x')}</button></div>
        <div class="trv-pos" aria-hidden="true"><i style="left:${x.s / SPAN * 100}%"></i></div>
        <div class="trv-kv"><div><span>Kind</span><b>${kind}</b></div><div><span>Starts at</span><b class="num">${sec(x.s)}</b></div><div><span>Latency</span><b class="num lt"></b></div><div><span>Tokens</span><b class="num tk"></b></div></div>
        <div class="trv-io"><span>Input</span><code>${x.in}</code><span>Output</span><code class="out"></code></div>`;
      $('.trv-x', dc).onclick = () => { const el = sel.el, back = dc.contains(document.activeElement); open(null); if (back) el.focus({ preventScroll:true }); };
      fill(); enter(dc);
    }
    function fill(){
      const x = sel, done = T >= x.s + x.d;
      $('.lt', dc).textContent = sec(took(x)); $('.tk', dc).textContent = Math.round(used(x)).toLocaleString('en-US'); $('.trv-pos i', dc).style.width = (took(x) / SPAN * 100) + '%';
      const o = $('.out', dc), t = done ? x.out : 'Running…'; if (o.textContent !== t) o.textContent = t;
    }
    // the arrow keys move between spans, and Escape shuts the details
    c.on(r, 'keydown', e => {
      if (e.key === 'Escape' && sel){ const el = sel.el; open(null); el.focus({ preventScroll:true }); return; }
      const v = S.filter(vis), i = v.findIndex(x => x.el === document.activeElement); if (i < 0) return;
      const go = e.key === 'ArrowDown' ? v[i + 1] : e.key === 'ArrowUp' ? v[i - 1] : e.key === 'Home' ? v[0] : e.key === 'End' ? v[v.length - 1] : undefined;
      if (go === undefined && !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault(); if (go) go.el.focus({ preventScroll:true });
    });
    stEl.innerHTML = '<span class="m">Starting</span>';

    // the frame: the run's clock moves on (one second of the run every PACE seconds), then the rows, then the lines, so for
    // no frame does a line point where a row is not
    live = { c, frame(t, d){ LT = t; if (started && T < END) T = Math.min(END, T + d / PACE); paint(); draw(d); } };
    c.later(600, () => { started = true; });

    // the preview's story: the fetch runs long and is flagged, the person reads why, opens it, then closes it
    c.story(async s => {
      const f = S.find(x => x.id === 'fetch');
      await s.until(() => f.slow); await s.beat(2);
      const tg = $('.tag', f.el); await s.point(tg.offsetWidth ? tg : $('.trv-ms', f.el)); await s.beat(3); s.away();
      await s.until(() => T >= END); await s.beat(1);
      await s.tap(f.el); s.away(); await s.beat(8);
      await s.tap($('.trv-x', r)); s.away(); await s.beat(2);
      window.LAB_DONE = true;
      // recorded once: ending here skips the replay
      if (REC) throw 'stop';
    });
  });

  // ---------- the page: style, theme, replay, and the recorder's handle ----------
  const d = document.documentElement;
  const pick = (sel, v) => $$(sel + ' button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
  pick('#sw-style', d.dataset.style === 'soft' ? 'soft' : 'bp');
  pick('#sw-theme', d.dataset.theme === 'dark' ? 'dark' : 'light');
  const start = () => { window.LAB_DONE = false; card.dataset.c = 'trace-view'; DM.mount(card, !!card._c); };
  seg($('#sw-style'), v => { if (v === 'soft') d.dataset.style = 'soft'; else delete d.dataset.style; try { localStorage.setItem('dmui-style', v); } catch(e){} });
  seg($('#sw-theme'), v => { d.dataset.theme = v; try { localStorage.setItem('dmui-theme', v); } catch(e){} });
  $('#replay').addEventListener('click', start);
  window.LAB = { start };
  // the core mounts every [data-c] card as it scrolls into view; with ?rec the recorder starts it instead
  if (!REC) card.dataset.c = 'trace-view';
})();
