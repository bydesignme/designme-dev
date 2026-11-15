/* ---------- Agent lanes, with drawn hand-offs (lab) ----------
   Classic's run (three agents, three steps each, two hand-offs), drawn with the shared flow treatment (lab/flow):
   - each lane is three step marks on a grey rail; as an agent finishes a step, the rail to its next step draws in the flow
     tint and the next mark starts
   - a hand-off is a line routed from the sender's last step down to the receiver's first step (DMFlow.route: Blueprint cuts
     the corners, Soft rounds them). It draws in, its sentence rises in beside it, then the flow band runs along it once; the
     receiver starts as the band arrives
   - the run starts at the Researcher's first step, which carries the source mark ('src')
   - every line is recomputed each frame from where the marks are, and ends 1px under the mark it meets
   The run keeps its own clock (agent time, in seconds), which stops while Pause all holds it; the frame clock is DMFlow.loop.
   With ?rec in the address the run waits for window.LAB.start(), and window.LAB_DONE turns true once it has ended */
(() => {
  const REC = /[?&]rec\b/.test(location.search);
  // one frame clock for the page; a mounted run listens to it while it lives
  // (window.LAB_FREEZE, for QA, stops both of a run's clocks while its lines are still drawn every frame)
  const tickers = new Set(); DMFlow.loop((T, dt) => tickers.forEach(f => f(T, window.LAB_FREEZE ? 0 : dt)));
  let GO = !REC;
  DM.PLAYS.add('agent-lanes');

  DM.def('agent-lanes', (r, c) => {
    r.innerHTML = r.innerHTML.replace('{users}', I('users')).replace('{pause}', I('pause', 'xs'));
    const L = [
      { n:'Researcher', ic:'search', t:'pb', acts:['Reading competitor sites', 'Comparing 5 pricing pages', 'Writing the brief'], log:['Read stripe.com/pricing', 'Read linear.app/pricing', 'Noted 3 patterns'] },
      { n:'Designer', ic:'palette', t:'pl', wait:'Waiting for the brief', acts:['Laying out pricing cards', 'Setting type and spacing', 'Exporting frames'], log:['Made 3 card variants', 'Applied spacing tokens', 'Exported 4 frames'] },
      { n:'Reviewer', ic:'eye', t:'pm', wait:'Waiting for the designer', acts:['Checking contrast', 'Checking copy', 'Signing off'], log:['Contrast passes AA', 'Fixed 2 lines of copy', 'Approved'] }
    ];
    const root = $('.aln', r), rows = $('.aln-rows', r), ct = $('.aln-ct', r), tt = $('.aln-t', r), pb = $('.aln-pause', r), clk = $('.aln-m', r), STEPS = L.length * 3;
    const FL = DMFlow.layer(rows);
    L.forEach((l, k) => {
      l.el = html(`<div class="aln-lane" data-s="queued" style="--c:var(--${l.t});--cb:var(--${l.t}-bg);--cm:var(--aln-${l.t},var(--${l.t}))"><button class="aln-row" type="button" aria-expanded="false" aria-controls="aln-d${k}"><span class="aln-av" aria-hidden="true">${I(l.ic)}</span><span class="aln-who"><span class="aln-n">${l.n}</span><span class="aln-a">${l.wait || 'Queued'}</span></span><span class="aln-sp" aria-hidden="true"><span class="dmf-g"></span><span class="dmf-g"></span><span class="dmf-g"></span></span><span class="aln-st"><span class="tag">Queued</span></span></button><div class="fold shut" id="aln-d${k}"><div><div class="aln-det"></div></div></div></div>`);
      rows.appendChild(l.el);
      const b = $('.aln-row', l.el), f = $('.fold', l.el);
      b.onclick = () => { const s = f.classList.toggle('shut'); b.setAttribute('aria-expanded', String(!s)); };
      l.marks = $$('.dmf-g', l.el); l.ms = [];
      l.marks.forEach((m, i) => { l.ms[i] = k === 0 && i === 0 ? 'src' : 'queued'; DMFlow.mark(m, l.ms[i]); });
      // the rail between two steps: grey underneath, the flow tint drawn over it as the agent moves on
      l.seg = [0, 1].map(() => ({ rail:DMFlow.line(FL, 'rail'), on:DMFlow.line(FL), p:0 }));
      l.rail = 0;
      // the lanes rise in one after another, each lifted above the lines while it moves
      l.el.style.animationDelay = k * 80 + 'ms'; l.el.classList.add('dmf-in');
      l.el.addEventListener('animationend', e => { if (e.target === l.el) l.el.classList.remove('dmf-in'); });
    });

    // ---------- clocks: UT always runs (entrances), RT is the agents' time and stops while paused ----------
    let UT = 0, RT = 0, paused = false, fin = false, steps = 0;
    const waits = [], tweens = [];
    const wait = s => new Promise(res => waits.push({ at:RT + s, res }));
    const ez = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    // o[k] eases from 0 to 1 over d seconds of a clock ('ut' or 'rt')
    const tween = (o, k, d, clock = 'rt', delay = 0) => new Promise(res => tweens.push({ o, k, d:REDUCE ? .01 : d, clock, t0:(clock === 'rt' ? RT : UT) + delay, res }));

    // ---------- the lines ----------
    const hs = [];   // the hand-offs drawn so far
    const R = s => DMFlow.markR(s);
    // a line drawn part way shows only once it has some length, so nothing leaves a dot where it starts
    const put = (ln, d, st, p) => { if (!d || p <= 0){ ln.set(''); return; } ln.set(d, st, p); if (p < 1 && ln.el.getTotalLength() * p < 2) ln.set(''); };
    function draw(){
      const G = L.map(l => l.marks.map((m, i) => { const b = FL.box(m); return { x:b.cx, y:b.cy, r:R(l.ms[i]) }; }));
      L.forEach((l, k) => l.seg.forEach((s, i) => {
        const a = G[k][i], b = G[k][i + 1], x0 = a.x + a.r - 1, x1 = b.x - b.r + 1;
        const d = x1 - x0 > .5 ? `M${x0} ${a.y}H${x1}` : '';
        put(s.rail, d, 'queued', Math.max(0, Math.min(1, l.rail * 2 - i))); put(s.on, d, 'on', s.p);   // the rail draws in as one line, left to right
      }));
      for (const h of hs){
        const s = G[L.indexOf(h.from)][2], t = G[L.indexOf(h.to)][0], f = FL.box(h.el), y = f.y + f.h / 2;
        const leg = [[s.x, s.y + s.r - 1], [s.x, y], [t.x, y]];
        put(h.line, DMFlow.route([...leg, [t.x, t.y - t.r + 1]]), 'on', h.rev);
        // the band runs the same route on, under the receiver's mark, to its centre: one piece, from the sender's edge
        if (h.phase === 'band'){ if (h.band.tick(DMFlow.route([...leg, [t.x, t.y]]), RT)){ h.phase = 'done'; h.arrived(); } }
        else h.band.off();
      }
    }
    const tick = (T, dt) => {
      if (c.dead) return;
      UT += dt; if (GO && !paused && !fin) RT += dt;
      window.LAB_RT = RT;   // the agents' clock, for the clip recorder and QA
      for (const w of waits.slice()) if (RT >= w.at - 1e-6){ waits.splice(waits.indexOf(w), 1); w.res(); }
      for (const w of tweens.slice()){ const u = Math.max(0, Math.min(1, ((w.clock === 'rt' ? RT : UT) - w.t0) / w.d)); w.o[w.k] = ez(u); if (u >= 1){ tweens.splice(tweens.indexOf(w), 1); w.res(); } }
      const s = Math.floor(RT), tx = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); if (clk.textContent !== tx) clk.textContent = tx;
      draw();
    };
    tickers.add(tick); c.offs.push(() => tickers.delete(tick));
    // the rails draw in once the lanes have risen
    L.forEach((l, k) => tween(l, 'rail', .6, 'ut', .3 + k * .08));

    // ---------- the lanes' words and states ----------
    const TAG = { queued:'<span class="tag">Queued</span>', waiting:`<span class="tag">${I('clock', 'xs')}Waiting</span>`, working:'<span class="tag"><span class="spin" aria-hidden="true"></span>Working</span>', paused:'<span class="tag warn">Paused</span>', done:`<span class="tag ok">${I('check', 'xs')}Done</span>` };
    const state = (l, s) => { l.el.dataset.s = s; const t = $('.aln-st', l.el); t.innerHTML = TAG[s]; enter(t.firstElementChild); };
    const act = (l, t, live) => { const a = $('.aln-a', l.el); a.classList.toggle('live', !!live); a.classList.toggle('dmf-shim', !!live && !paused); DMFlow.swap(a, t); };
    const mark = (l, i, s) => { l.ms[i] = s; DMFlow.mark(l.marks[i], s); draw(); };
    const count = () => swap(ct, `${steps} of ${STEPS} steps`);
    pb.onclick = () => {
      paused = !paused; root.classList.toggle('paused', paused);
      pb.innerHTML = I(paused ? 'play' : 'pause', 'xs') + (paused ? 'Resume' : 'Pause all'); swap(tt, paused ? 'All agents paused' : '3 agents working');
      L.forEach(l => { if (l.running){ state(l, paused ? 'paused' : 'working'); $('.aln-a', l.el).classList.toggle('dmf-shim', !paused); } });
    };

    // an agent does its three steps: each mark spins while it works and ticks when done, and the rail to the next step draws
    // in before the next one starts
    async function work(l){
      l.running = true; state(l, paused ? 'paused' : 'working');
      const det = $('.aln-det', l.el);
      for (let i = 0; i < 3; i++){
        if (i) await tween(l.seg[i - 1], 'p', .35);
        mark(l, i, 'run'); act(l, l.acts[i], true);
        await wait(1.5);
        mark(l, i, l === L[0] && i === 0 ? 'src' : 'done'); steps++; count();
        const d = html(`<div><span>${l.log[i]}</span><span class="muted num">${Math.round(RT)}s</span></div>`); det.appendChild(d); enter(d);
      }
      l.running = false; act(l, l.log[2]); state(l, 'done');
    }
    // a hand-off: its row opens and its line draws from the sender's last step to the receiver's first, the sentence rises in,
    // and the band runs the route once; the receiver starts as it arrives
    async function handoff(from, to, what){
      const h = { from, to, rev:0, phase:'draw', line:DMFlow.line(FL), band:DMFlow.band(FL, { loop:false }) };
      h.el = html(`<div class="fold shut aln-hf"><div><div class="aln-hand"><span class="aln-hx"><b>${from.n}</b> handed ${what} to <b>${to.n}</b></span></div></div></div>`);
      to.el.before(h.el); void h.el.offsetWidth; h.el.classList.remove('shut'); hs.push(h);
      await tween(h, 'rev', .8);
      h.el.classList.add('on'); $('.aln-hx', h.el).classList.add('dmf-in');
      await new Promise(res => { h.arrived = res; h.band.restart(); h.phase = 'band'; });
    }

    c.run(async () => {
      while (!GO) await new Promise(res => setTimeout(res, 50));
      await wait(.6);
      const r1 = work(L[0]); act(L[1], L[1].wait); state(L[1], 'waiting');
      await r1; await wait(.3); await handoff(L[0], L[1], 'the brief');
      act(L[2], L[2].wait); state(L[2], 'waiting');
      await work(L[1]); await wait(.3); await handoff(L[1], L[2], '4 frames');
      await work(L[2]);
      fin = true; root.classList.add('fin'); $('.aln-ic', r).innerHTML = I('ok'); enter($('.aln-ic', r).firstElementChild);
      swap(tt, 'All 3 agents finished'); pb.remove();
      await new Promise(res => setTimeout(res, 1200)); window.LAB_DONE = true;
    });
    // the story, once the run is done: someone opens the Designer's lane to read its log and shuts it, then the card plays
    // again (a recording ends with the run instead)
    if (!REC) c.story(async s => {
      await s.until(() => fin); await s.beat(3);
      await s.tap($('.aln-row', L[1].el)); s.away(); await s.beat(5);
      await s.tap($('.aln-row', L[1].el)); s.away(); await s.beat(2);
    });
  });

  // ---------- the page: mount, replay, style and theme ----------
  document.addEventListener('DOMContentLoaded', () => {
    const card = $('#aln-card'), d = document.documentElement;
    card.dataset.c = 'agent-lanes'; DM.mount(card);
    window.LAB = { start(){ GO = true; window.LAB_DONE = false; DM.mount(card); } };
    $('#replay').addEventListener('click', () => { window.LAB_DONE = false; DM.mount(card); });
    const mark = (sel, v) => $$(sel + ' button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
    mark('#sw-style', d.dataset.style === 'soft' ? 'soft' : 'bp'); mark('#sw-theme', d.dataset.theme === 'dark' ? 'dark' : 'light');
    // the pick goes in the address, so a reload or a shared link opens the same way
    const keep = (k, v) => { const q = new URLSearchParams(location.search); q.set(k, v); history.replaceState(null, '', '?' + q); };
    seg($('#sw-style'), v => { if (v === 'soft') d.dataset.style = 'soft'; else delete d.dataset.style; keep('style', v); });
    seg($('#sw-theme'), v => { d.dataset.theme = v; keep('theme', v); });
  });
})();
