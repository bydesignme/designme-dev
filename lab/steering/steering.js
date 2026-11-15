/* ---------- Steering (lab: the flow-line treatment) ----------
   The run and its lines. The steps are the site's Steering demo as it is (four steps on the pricing page, a message that
   waits for the step in progress, a heads-up with Leave it / Redo); what is new is how it is drawn, with DMFlow:
   - the task is the run's source ('src'); a rail runs from its edge through every step's mark, tinted (--flow) up to the
     step in progress, grey after it, and the band runs down it to that step
   - a message joins the rail from below, a branch drawn in before the bubble rises in; grey while it waits
   - when it lands, its branch tints and the band carries it from the bubble's edge, round the corner and up the rail to
     the step it changes, whose mark and text swap at once as the band arrives
   Lines are recomputed every frame from where the marks are, and end 1px under them. */
(() => {
  const REC = /[?&]rec\b/.test(location.search);
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  // one frame clock for the page; each mount puts its own draw here
  let DRAW = null;
  DMFlow.loop(T => { if (DRAW) DRAW(T); });

  DM.def('steering', (r, c) => {
    r.innerHTML = r.innerHTML.replace('{up}', I('up', 'xs'));
    const root = $('.ste', r);
    // the run: four steps on the pricing page. A card step paints its card in the current accent, and remembers which,
    // so a change of mind can find the cards that already have the old one
    const S = [
      { id:'read', t:'Read Pricing v4', d:'3 frames, 14 layers', s:'done' },
      { id:'pro', card:'Pro', t:'Update the Pro card', s:'run', ms:7500 },
      { id:'team', card:'Team', t:'Update the Team card', d:'Pricing v4, frame 3', s:'queued', ms:3500 },
      { id:'ship', t:'Export to staging', d:'designme.studio/pricing', s:'queued', ms:2500 }
    ];
    const steps = $('.ste-steps', r), log = $('.ste-log', r), box = $('.ste-box', r), inp = $('input', box), go = $('.ste-go', r);
    const st = $('.ste-st', r), mode = $('.m', st), ck = $('.ck', st), src = $('.ste-h .dmf-g', r);
    let hue = 'violet', ended = false, running = false;
    const queue = [], M = [];
    const doing = x => x.card ? `Setting the accent to ${hue}` : x.d;
    DMFlow.mark(src, 'src');
    function row(x){
      x.el = html(`<li class="ste-s ${x.s}"><span class="dmf-g"></span><span class="ste-t"><b></b><span></span></span>${x.mine ? '<span class="tag b">From you</span>' : ''}</li>`);
      $('b', x.el).textContent = x.t;
      const sp = $('.ste-t span', x.el); sp.textContent = x.s === 'run' ? doing(x) : x.d || 'Pricing v4, frame 2'; sp.classList.toggle('dmf-shim', x.s === 'run');
      DMFlow.mark($('.dmf-g', x.el), x.s);
      return x.el;
    }
    S.forEach(x => steps.appendChild(row(x)));
    // a step changes state: its mark swaps at once (a tick draws itself) and its line of work swaps in place
    function set(x, s, d){
      x.s = s; x.el.classList.remove('run', 'done', 'queued'); x.el.classList.add(s);
      DMFlow.mark($('.dmf-g', x.el), s);
      const sp = $('.ste-t span', x.el); sp.classList.toggle('dmf-shim', s === 'run');
      if (d && d !== sp.textContent) DMFlow.swap(sp, d);
    }
    const next = () => S.find(y => y.s === 'run' || y.s === 'queued');
    const where = () => { const i = S.findIndex(x => x.s !== 'done'), t = ended || i < 0 ? 'Done' : `Step ${i + 1} of ${S.length}`; if (mode.textContent !== t) DMFlow.swap(mode, t); };
    // the clock runs until the last step is done
    const t0 = performance.now(); let tEnd = 0;
    const clock = () => { const s = Math.floor(((tEnd || performance.now()) - t0) / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
    c.every(250, () => { ck.textContent = clock(); });
    const until = async f => { while (!f()) await c.wait(50); };

    // ---------- the lines ----------
    const L = DMFlow.layer(root), rail = [], work = DMFlow.band(L);
    let land = null, Tnow = 0;
    const seg = i => rail[i] || (rail[i] = DMFlow.line(L));
    const R = DMFlow.markR;
    DRAW = T => {
      if (c.dead) return;
      Tnow = T;
      const a = L.box(src), rx = a.cx, vis = S.filter(x => !x.hid), g = vis.map(x => L.box($('.dmf-g', x.el)));
      // the rail: source edge to the first step, then mark to mark, each piece 1px under both marks it joins
      let y = a.cy + R('src') - 1, i = 0;
      vis.forEach((x, k) => { seg(i++).set(`M${rx} ${y}V${g[k].cy - R(x.s) + 1}`, x.s === 'queued' ? 'queued' : 'on'); y = g[k].cy + R(x.s) - 1; });
      for (; i < rail.length; i++) rail[i].set('');
      // your messages: the rail carries on from the last step's edge, and each message is a branch off it to its bubble
      let top = y;
      for (const m of M){
        const p = L.box(m.p), by = p.cy, bx = p.x + 1;
        m.ln.set(DMFlow.route([[rx, top], [rx, by], [bx, by]]), m.on ? 'on' : 'queued', m.rv == null ? 0 : Math.min(1, (T - m.rv) / .38));
        if (m.rv != null && T - m.rv >= .38 && !m.ready){ m.ready = true; m.el.classList.remove('pre'); m.el.classList.add('dmf-in'); }
        top = Math.max(top, by - DMFlow.R());
        m.geo = { bx, by };
      }
      // a correction landing: the band leaves the bubble's edge, turns onto the rail and runs up to the step it changes
      if (land){
        const m = land.m, t = L.box($('.dmf-g', land.x.el));
        const done = land.band.tick(DMFlow.route([[m.geo.bx, m.geo.by], [rx, m.geo.by], [rx, t.cy]]), T);
        if (done || RM.matches){ land.band.remove(); const f = land.res; land = null; f(); }
        work.off(); return;
      }
      // the work: the band runs from the source's edge down the rail to the step in progress
      const k = vis.findIndex(x => x.s === 'run');
      if (k < 0) work.off(); else work.tick(DMFlow.route([[rx, a.cy + R('src') - 1], [rx, g[k].cy]]), T);
    };
    const carry = (m, x) => new Promise(res => { land = { m, x, res, band:DMFlow.band(L, { loop:false }) }; });

    // ---------- the messages ----------
    // a message waits for the step in progress, then the agent takes it up before the next one
    const ready = () => { go.disabled = ended || !inp.value.trim(); };
    inp.oninput = ready;
    c.on(box, 'submit', e => {
      e.preventDefault(); const text = inp.value.trim(); if (!text || ended) return;
      inp.value = ''; ready();
      // the bubble takes its room unseen while its branch draws in, then rises in where the branch ends
      const el = html(`<div class="ste-me pre"><p></p><span class="ste-q"><span class="spin"></span>Applies after this step</span></div>`);
      $('p', el).textContent = text; log.appendChild(el);
      const m = { text, el, p:$('p', el), ln:DMFlow.line(L), on:false, rv:null, ready:false };
      M.push(m); m.rv = Tnow; queue.push(m);
      if (!running) apply();
    });
    // what the agent says back, with buttons when it needs you to choose
    function say(text, warn, acts){
      const a = html(`<div class="ste-ag${warn ? ' warn' : ''}">${warn ? I('alert', 'xs') : I('spark', 'xs')}<div class="t"><p></p>${acts ? '<div class="ste-acts"></div>' : ''}</div></div>`);
      $('p', a).textContent = text; log.appendChild(a); a.classList.add('dmf-in');
      if (acts) acts.forEach(([label, ink, fn]) => { const b = html(`<button class="pill sm ${ink ? 'primary' : 'ghost'}">${label}</button>`); b.onclick = () => { $('.ste-acts', a).replaceWith(html(`<span class="muted">${fn()}</span>`)); a.classList.remove('warn'); a.firstElementChild.outerHTML = I('spark', 'xs'); }; $('.ste-acts', a).appendChild(b); });
    }
    // between two steps the agent takes up what you sent: it lands on the next step, which starts on the new course
    async function apply(){
      while (queue.length){
        const q = queue[0];
        await until(() => q.ready);
        queue.shift();
        const left = S.some(x => x.s !== 'done'), tag = $('.ste-q', q.el);
        tag.innerHTML = I('check', 'xs') + (left ? 'Applied' : 'Noted'); enter(tag);
        q.on = true;
        if (!left){ say("The run had finished, so I'll keep this for the next one."); continue; }
        const accent = /blue|accent|library/i.test(q.text);
        if (accent) hue = 'library blue';
        const x = next();
        await carry(q, x);
        set(x, 'run', accent && x.card ? doing(x) : 'Following your note'); where();
        await c.wait(260);
        if (!accent){ say("Got it. I'll follow that from this step."); continue; }
        // a change of accent: what's still to come uses it, and a card already painted the old way is offered a redo
        const old = S.filter(y => y.card && y.s === 'done' && y.hue === 'violet' && !S.some(z => z.redo === y.id));
        if (!old.length){ say('Got it. From here the accent is color.accent.500 from the library.'); continue; }
        const names = old.map(y => y.card).join(' and ');
        say(`Got it. From here the accent is color.accent.500. The ${names} card${old.length > 1 ? 's are' : ' is'} already violet.`, true, [
          ['Leave it', false, () => `Kept the ${names} card as it is`],
          [`Redo the ${names} card${old.length > 1 ? 's' : ''}`, true, () => { old.forEach(redo); return `Added a step to redo the ${names} card${old.length > 1 ? 's' : ''}`; }]
        ]);
      }
    }
    // a redo goes in before the export if the export hasn't started, otherwise at the end. Its room opens first (the rail
    // stretches through it), then the row rises in and its mark sits on the rail
    function redo(x){
      const n = { id:'redo-' + x.id, redo:x.id, card:x.card, mine:true, t:`Redo the ${x.card} card`, d:'Accent to library blue', s:'queued', ms:2000, hid:true };
      const ship = S.find(y => y.id === 'ship'), at = ship.s === 'queued' ? S.indexOf(ship) : S.length;
      S.splice(at, 0, n); const li = row(n); li.classList.add('grow'); steps.insertBefore(li, S[at + 1] ? S[at + 1].el : null);
      requestAnimationFrame(() => requestAnimationFrame(() => { li.style.height = '48px'; li.style.paddingTop = li.style.paddingBottom = '5px'; }));
      c.later(RM.matches ? 0 : 420, () => { li.classList.remove('grow'); li.removeAttribute('style'); n.hid = false; li.classList.add('dmf-in'); });
      if (ended){ ended = false; tEnd = 0; $('.ste-sum', r)?.remove(); inp.disabled = false; inp.placeholder = 'Steer the agent while it works'; ready(); c.run(run); }
      where();
    }

    // ---------- the run ----------
    async function run(){
      running = true;
      for (let x = next(); x; x = next()){
        if (x.hid) await until(() => !x.hid);
        if (x.s !== 'run') set(x, 'run', doing(x));
        where();
        await c.wait(x.ms);
        if (x.card) x.hue = hue;
        set(x, 'done', x.card ? (x.hue === 'violet' ? 'Accent set to violet' : 'Accent set to library blue') : x.id === 'ship' ? 'Live on designme.studio/pricing' : x.d);
        where();
        await apply();
      }
      running = false; ended = true; tEnd = performance.now(); where();
      inp.disabled = true; inp.placeholder = 'The run has finished'; ready();
      const n = M.length;
      $('.ste-sum', r)?.remove();
      const sum = html(`<div class="ste-sum">${I('ok', 'xs')}<span>Done in ${clock()}${n ? ` · ${n} change${n > 1 ? 's' : ''} from you` : ''}</span></div>`);
      log.appendChild(sum); sum.classList.add('dmf-in');
      if (c.mine) c.later(1500, () => { window.LAB_DONE = true; });
    }
    c.run(run);
    // the preview's story: read what the agent is doing, tell it to use the library's blue, and have it redo the card
    // that was already violet. It stops for good at the visitor's first click, key, focus or typing inside
    c.story(async s => {
      await s.beat(2);
      await s.point($('.ste-t span', S[1].el), false); await s.beat(1);
      await s.tap(inp);
      // typed a few letters at a time, so a busy page (few, longer timers) types it as fast as a quiet one
      const msg = 'Use our library blue, not violet';
      await s.type(inp, msg.match(/.{1,3}/g), { n:.15, each:ready, keep:true });
      await s.beat(1); await s.tap(go); s.away();
      await s.until(() => $('.ste-acts .primary', r)); await s.beat(3);
      await s.tap($('.ste-acts .primary', r)); s.away();
      await s.until(() => ended); await s.beat(3);
      window.LAB_DONE = true;
      // the clip recorder plays it once
      if (REC) throw 'stop';
    });
  });

  // ---------- the page: mounting, style, theme and replay ----------
  const card = $('#steering');
  function start(){ window.LAB_DONE = false; card.dataset.c = 'steering'; DM.mount(card, !!card._c); }
  window.LAB = { start };
  // mounted here, after core's own start-up, so that ?rec leaves it unmounted until the recorder calls LAB.start()
  document.addEventListener('DOMContentLoaded', () => {
    const d = document.documentElement;
    const markSw = (sel, v) => $$(sel + ' button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
    markSw('#sw-style', d.dataset.style === 'soft' ? 'soft' : 'bp');
    markSw('#sw-theme', d.dataset.theme === 'dark' ? 'dark' : 'light');
    seg($('#sw-style'), v => { if (v === 'soft') d.dataset.style = 'soft'; else delete d.dataset.style; try { localStorage.setItem('dmui-style', v === 'soft' ? 'soft' : 'blueprint'); } catch(e){} });
    seg($('#sw-theme'), v => { d.dataset.theme = v; try { localStorage.setItem('dmui-theme', v); } catch(e){} });
    $('#replay').addEventListener('click', start);
    if (!REC) start();
  });
})();
