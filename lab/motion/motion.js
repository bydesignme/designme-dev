/* Motion packs (lab only, owner 17 Nov): one Agent tree run, six ways of moving it. Each pack below turns the rules of one
   motion skill from ui-skills.com into numbers; the run, the rows, the marks, the lines and the band are the same in all six.
   Everything runs on one virtual clock, so the six stay in sync, Replay all restarts them together, and slow motion (0.25x)
   slows every tween, the band, the spinners and the run's own timing alike. Principles only: no code copied from the skills. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- curves ----------
  // cubic-bezier(x1, y1, x2, y2) as a function of progress 0..1
  const bez = (x1, y1, x2, y2) => { const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const X = t => ((ax * t + bx) * t + cx) * t, dX = t => (3 * ax * t + 2 * bx) * t + cx, Yv = t => ((ay * t + by) * t + cy) * t;
    return x => { if (x <= 0) return 0; if (x >= 1) return 1; let t = x; for (let i = 0; i < 8; i++){ const e = X(t) - x, d = dX(t); if (Math.abs(e) < 1e-5 || !d) break; t -= e / d; }
      if (t < 0 || t > 1){ let lo = 0, hi = 1; t = x; for (let i = 0; i < 30; i++){ const v = X(t); if (Math.abs(v - x) < 1e-5) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; } } return Yv(t); }; };
  const LIN = x => Math.min(1, Math.max(0, x));
  const IO = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  // a spring as Apple describes it: response (seconds, how quick) and damping ratio (1 = no overshoot). Returns progress for
  // time in seconds, and how long it takes to settle
  const spring = (response, zeta) => { const w = 2 * Math.PI / response;
    const f = zeta >= 1 ? t => 1 - (1 + w * t) * Math.exp(-w * t)
      : (() => { const wd = w * Math.sqrt(1 - zeta * zeta); return t => 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + zeta * w / wd * Math.sin(wd * t)); })();
    let d = .05; while (d < 4 && (Math.abs(1 - f(d)) > .0015 || Math.abs(1 - f(d + .05)) > .0015)) d += .02; return { f, d }; };
  // a motion: { d: seconds, e: curve } or { spring: [response, damping] }
  const dur = m => m.spring ? spring(...m.spring).d : m.d;
  const prog = (m, t) => { if (m.spring){ const s = m.sp || (m.sp = spring(...m.spring)); return t >= s.d ? 1 : s.f(t); } return m.d ? m.e(Math.min(1, t / m.d)) : 1; };

  // ---------- the packs ----------
  const SO = bez(.22, 1, .36, 1), EMIL_OUT = bez(.23, 1, .32, 1), EMIL_IO = bez(.77, 0, .175, 1), POP = bez(.34, 1.36, .64, 1);
  const PACKS = [
    { id:'now', name:'Now', by:'The library today', rules:['Rows rise 8px out of a 3px blur over 560ms', 'Agents join one at a time, 450ms apart', 'Lines draw first, the row follows 120ms later', 'The band eases end to end at about 170px a second'],
      gap:[.45], row:{ d:.56, e:SO, y:8, b:3 }, sub:null, cost:null, line:{ k:13 }, lineLead:.12, swap:{ d:.46, e:SO, y:'60%', b:3 },
      mark:{ d:0 }, tick:{ d:.32, e:SO }, band:{ speed:170, e:x => .5 - Math.cos(Math.PI * x) / 2, min:1.8, max:3.4, rest:.35 }, foot:{ d:.56, e:SO, y:8, b:3 } },
    { id:'animate', name:'animate', by:'Emil Kowalski', rules:['A strong ease-out, cubic-bezier(.23, 1, .32, 1), on every entrance', 'Nothing over 300ms; entrances from scale .97, never from 0', 'Items entering together stagger 50ms', 'Constant motion (the band) is linear'],
      gap:[.05], row:{ d:.24, e:EMIL_OUT, y:4, s:.97 }, sub:null, cost:null, line:{ d:.25, e:EMIL_OUT }, lineLead:0, swap:{ d:.18, e:EMIL_OUT, y:4 },
      mark:{ d:.15, e:EMIL_OUT, s:.9 }, tick:{ d:.2, e:EMIL_OUT }, band:{ speed:220, e:LIN, min:1.2, max:2.4, rest:.5 }, foot:{ d:.24, e:EMIL_OUT, y:4, s:.97 } },
    { id:'choreograph', name:'choreograph', by:'Emil Kowalski', rules:['Cast roles: the row leads, its line of work supports, the cost only fades', 'Stagger shrinks along the group (60, 45, 35ms), never uniform', 'The line and its row move together, not one after the other', 'The finish is one short accent at the end, key line first'],
      gap:[.06, .045, .035], row:{ d:.27, e:EMIL_OUT, y:6 }, sub:{ at:.06, d:.2, e:EMIL_OUT, y:3 }, cost:{ at:.1, d:.16, e:LIN }, line:{ d:.27, e:EMIL_OUT }, lineLead:0,
      swap:{ d:.2, e:EMIL_OUT, y:3, out:.12 }, mark:{ d:.14, e:EMIL_OUT, s:.92 }, tick:{ d:.18, e:EMIL_OUT, at:.06 }, band:{ speed:200, e:EMIL_IO, min:1.4, max:2.8, rest:.6 }, foot:{ d:.22, e:EMIL_OUT, y:4, sub:.04 } },
    { id:'motion', name:'motion', by:'Raphael Salaja', rules:['Swaps cross-fade: scale .25 to 1, opacity, a 4px blur clearing', 'Changing text bridges with a 2px blur so it reads as one label', 'Entrances from scale .95 with opacity, under 300ms', 'Lists stagger under 50ms (30ms); movement on screen eases in and out'],
      gap:[.03], row:{ d:.22, e:EMIL_OUT, s:.95 }, sub:null, cost:null, line:{ d:.24, e:EMIL_OUT }, lineLead:0, swap:{ d:.2, e:EMIL_OUT, b:2, out:.14, ob:2 },
      mark:{ d:.22, e:EMIL_OUT, s:.25, b:4 }, tick:{ d:.22, e:EMIL_OUT }, band:{ speed:200, e:EMIL_IO, min:1.4, max:2.8, rest:.45 }, foot:{ d:.2, e:EMIL_OUT, s:.95 } },
    { id:'apple', name:'apple-design', by:'Emil Kowalski', rules:['Springs, not durations: response .4s, damping 1 (no overshoot)', 'Bounce only where a gesture carried momentum, so none here', 'Every motion starts from where things are and can be redirected', 'The band glides on a spring between the steps that are running'],
      gap:[.05], row:{ spring:[.4, 1], y:10 }, sub:null, cost:null, line:{ spring:[.35, 1] }, lineLead:0, swap:{ spring:[.3, 1], y:6 },
      mark:{ spring:[.3, 1], s:.85 }, tick:{ spring:[.28, 1] }, band:{ speed:180, spring:[1.6, 1], min:1.4, max:3, rest:.4 }, foot:{ spring:[.4, 1], y:10 } },
    { id:'polish', name:'transitions-polish', by:'Jakub Antalik', rules:['One smooth-out curve, cubic-bezier(.22, 1, .36, 1), for surfaces', 'Panel reveals 400ms from 8px and a 2px blur; text swaps 150ms, 4px, 2px blur', 'The success check pops in 500ms from an 8px blur on a slight overshoot', 'Stagger 40ms; closes faster than opens'],
      gap:[.04], row:{ d:.4, e:SO, y:8, b:2 }, sub:null, cost:null, line:{ d:.4, e:SO }, lineLead:0, swap:{ d:.15, e:IO, y:4, b:2 },
      mark:{ d:.5, e:POP, s:.6, b:8 }, tick:{ d:.35, e:SO, at:.12 }, band:{ speed:190, e:SO, min:1.4, max:3, rest:.4 }, foot:{ d:.5, e:POP, y:8, b:2 } },
  ];

  // ---------- the clock ----------
  const CLK = { t:0, speed:1, last:0 };
  const tweens = new Set();
  // tw(el, motion, from, to, apply?): animate el's o (opacity), y (px or %), s (scale) and b (blur px) between two states
  const style = (el, v) => { const y = typeof v.y === 'string' ? v.y : (v.y || 0) + 'px';
    el.style.transform = `translateY(${y}) scale(${v.s ?? 1})`; el.style.opacity = v.o ?? 1; el.style.filter = v.b ? `blur(${v.b}px)` : ''; };
  const lerp = (a, b, p) => a + (b - a) * p;
  function tw(el, m, from, to, at = 0, done){
    if (REDUCE || !m || !dur(m)){ style(el, to); done && done(); return; }
    const k = { el, m, from, to, t0:CLK.t + at, done }; tweens.add(k); style(el, from);
  }
  function step(dt){
    CLK.t += dt;
    for (const k of tweens){ const t = CLK.t - k.t0; if (t < 0) continue; const p = prog(k.m, t), v = {};
      for (const key of ['o', 'y', 's', 'b']){ const a = k.from[key], b = k.to[key]; if (a == null && b == null) continue;
        if (key === 'y' && (typeof a === 'string' || typeof b === 'string')){ const n = parseFloat(a || 0); v.y = lerp(n, parseFloat(b || 0), p) + '%'; }
        else v[key] = lerp(a ?? (key === 's' || key === 'o' ? 1 : 0), b ?? (key === 's' || key === 'o' ? 1 : 0), p); }
      style(k.el, v); if (t >= dur(k.m)){ style(k.el, k.to); tweens.delete(k); k.done && k.done(); } }
  }
  // a timer on the virtual clock
  const timers = new Set();
  const later = (s, fn) => { const k = { at:CLK.t + s, fn }; timers.add(k); return k; };
  const fire = () => { for (const k of [...timers]) if (CLK.t >= k.at){ timers.delete(k); k.fn(); } };

  // ---------- one demo ----------
  const IC = n => { const [vb, body] = ATX_ICONS[n]; return `<svg viewBox="${vb}" aria-hidden="true">${body}</svg>`; };
  const BR = n => ATX_BRAND[n].replace('<svg', '<svg class="brand"');
  const RUN = [
    { id:'root', n:'Orchestrator', t:'Splitting the work', ic:'spark', s:'run' },
    { id:'res', p:'root', n:'Research', t:'5 competitor pages', ic:'globe', av:'l' },
    { id:'res1', p:'res', n:'Read the pages', t:'Reading 1 of 5', ic:'file-text' },
    { id:'des', p:'root', n:'Design', t:'Plan cards in Figma', ic:'palette', av:'p' },
    { id:'des1', p:'des', n:'Update cards', t:'Pricing v4', app:'figma' },
    { id:'des2', p:'des', n:'Brand tokens', t:'Colours and spacing', app:'figma' },
    { id:'des3', p:'des', n:'Retry tokens', t:'Rerouted to accent.500', app:'figma' },
    { id:'cop', p:'root', n:'Copy', t:'Rewrite the plan blurbs', ic:'edit', av:'m' },
    { id:'cop1', p:'cop', n:'Post to Slack', t:'Queued', app:'slack' }
  ];
  const HL = [[0, 'l0'], [.19, 'l1'], [.541, 'c'], [.781, 'l2'], [1, 'l0']], BAND = 210, CORE = .541;
  const money = v => '$' + v.toFixed(2), clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

  function Demo(cell, P){
    this.cell = cell; this.P = P; this.st = $('.mo-st', cell); this.build();
  }
  Demo.prototype.build = function(){
    const P = this.P;
    this.st.innerHTML = `<div class="mo dmf"><div class="mo-h"><div class="mo-hd"><b class="mo-t">Redesign the pricing page</b><span class="mo-s"><span class="mo-dot"></span><span class="mo-m">Starting</span><span>·</span><span class="mo-tm">0:00</span></span></div><span class="mo-tot">$0.00</span></div><div class="mo-tree"></div><p class="mo-f"></p></div>`;
    this.el = $('.mo', this.st); this.tree = $('.mo-tree', this.el); this.foot = $('.mo-f', this.el);
    this.N = RUN.map(x => ({ ...x, s:x.s || 'queued', kids:[], cost:0, secs:0, on:!x.p, rv:x.p ? 0 : 1 }));
    const by = this.by = id => this.N.find(n => n.id === id);
    this.N.forEach(n => { n.parent = n.p ? by(n.p) : null; n.lv = n.parent ? n.parent.lv + 1 : 0; if (n.parent) n.parent.kids.push(n); });
    for (const n of this.N){
      const who = n.app ? `<span class="mo-av app">${BR(n.app)}</span>` : `<span class="mo-av${n.av || !n.lv ? '' : ' app'}"${n.av ? ` style="--a:var(--dm-av-${n.av});--ai:var(--dm-av-${n.av}-ink)"` : ''}>${IC(n.ic)}</span>`;
      n.el = document.createElement('div'); n.el.className = 'mo-n ' + n.s + (n.lv ? ' off' : ''); n.el.style.setProperty('--lv', n.lv);
      n.el.innerHTML = `<span class="dmf-g"></span>${who}<span class="mo-tx"><span class="mo-nm">${n.n}</span><span class="mo-sub"><span class="t">${n.t}</span></span></span><span class="mo-q"></span>`;
      n.g = $('.dmf-g', n.el); DMFlow.mark(n.g, n.lv ? n.s : 'src'); this.tree.appendChild(n.el);
    }
    this.L = DMFlow.layer(this.tree); this.lines = new Map(); this.bands = new Map();
    this.t0 = CLK.t; this.ended = 0; this.foot.innerHTML = ''; this.foot.style.visibility = 'hidden';
    // the room the run needs at its tallest is kept from the start (the rows are laid out, only hidden), so it sits centred
    this.foot.innerHTML = `<span class="dmf-g"></span><span>Done in <b>0:00</b> · 3 agents · <b>$0.00</b></span>`;
    this.script();
  };
  // the run, the same for every pack; when several join at once, the pack's stagger spaces them
  Demo.prototype.script = function(){
    const by = this.by, G = (ids, s) => ids.forEach((id, i) => this.spawn(by(id), s[i] || s[0], this.gap(i)));
    const at = (s, fn) => later(s, () => fn());
    at(.3, () => G(['res', 'des', 'cop'], ['run', 'run', 'queued']));
    at(1.45, () => G(['res1', 'des1', 'des2'], ['run', 'run', 'queued']));
    at(2.7, () => this.say(by('res1'), 'Reading 3 of 5'));
    at(3.2, () => this.say(by('res1'), 'Reading 5 of 5'));
    at(3.6, () => this.state(by('res1'), 'done', '5 pages, 12k words'));
    at(3.95, () => this.state(by('res'), 'done', 'Notes in Pricing v4'));
    at(4.25, () => { this.state(by('des1'), 'done', 'Pro and Team done'); this.state(by('des2'), 'run', 'Matching colours'); });
    at(5.35, () => this.state(by('des2'), 'fail', 'Missing accent.600'));
    at(6.1, () => { by('des2').el.classList.add('dim'); this.spawn(by('des3'), 'run', 0); });
    at(7.3, () => this.state(by('des3'), 'done', 'Used accent.500'));
    at(7.6, () => { this.state(by('des'), 'done', 'Cards and tokens done'); this.state(by('cop'), 'run', 'Writing 3 blurbs'); this.spawn(by('cop1'), 'queued', this.gap(1)); });
    at(8.7, () => { this.state(by('cop'), 'done', '3 blurbs written'); this.state(by('cop1'), 'run', 'Posting to #pricing'); });
    at(9.6, () => this.state(by('cop1'), 'done', 'Posted to #pricing'));
    at(9.95, () => this.finish());
  };
  // when the i-th of a group joins, after the ones before it
  Demo.prototype.gap = function(i){ const g = this.P.gap; let s = 0; for (let k = 0; k < i; k++) s += g[Math.min(k, g.length - 1)]; return s; };
  Demo.prototype.spawn = function(n, s, delay){
    const P = this.P;
    later(delay, () => {
      n.on = true; n.s = s; n.t0 = CLK.t; this.paint(n); DMFlow.mark(n.g, s);
      // the line to the row: drawn first and the row follows (Now), or both together (the packs)
      n.rv0 = CLK.t; n.rvLead = P.lineLead;
      later(P.lineLead, () => {
        n.el.classList.remove('off');
        const sub = $('.mo-sub', n.el), q = $('.mo-q', n.el);
        tw(n.el, P.row, { o:0, y:P.row.y || 0, s:P.row.s || 1, b:P.row.b || 0 }, { o:1, y:0, s:1, b:0 });
        if (P.sub){ tw(sub, P.sub, { o:0, y:P.sub.y || 0 }, { o:1, y:0 }, P.sub.at); }
        if (P.cost){ tw(q, P.cost, { o:0 }, { o:1 }, P.cost.at); }
      });
    });
  };
  Demo.prototype.paint = function(n){ n.el.classList.remove('queued', 'run', 'done', 'fail'); n.el.classList.add(n.s); };
  Demo.prototype.say = function(n, t){
    const P = this.P, sub = $('.mo-sub', n.el), cur = $('.t', sub);
    if (P.swap && P.swap.out && !REDUCE){ // the old text leaves while the new arrives
      const old = cur.cloneNode(true); old.classList.add('old'); sub.appendChild(old);
      tw(old, { d:P.swap.out, e:LIN }, { o:1, b:0 }, { o:0, b:P.swap.ob || 0, y:P.swap.y ? -P.swap.y : 0 }, 0, () => old.remove()); }
    cur.textContent = t;
    tw(cur, P.swap, { o:0, y:P.swap.y || 0, b:P.swap.b || 0 }, { o:1, y:0, b:0 });
  };
  Demo.prototype.state = function(n, s, t){
    const P = this.P; n.s = s; this.paint(n);
    DMFlow.mark(n.g, n.lv ? s : 'src');
    if (n.lv || s === 'done'){ if (!n.lv && s === 'done') DMFlow.mark(n.g, 'done');
      tw(n.g, P.mark, { o:0, s:P.mark.s || 1, b:P.mark.b || 0 }, { o:1, s:1, b:0 });
      const path = $('path', n.g); if (path && (s === 'done' || s === 'fail')){ path.style.strokeDasharray = 1; path.style.strokeDashoffset = 1;
        const k = { o:1 }, tk = P.tick; if (REDUCE){ path.style.strokeDashoffset = 0; } else later(tk.at || 0, () => this.draw(path, tk)); } }
    if (t) this.say(n, t);
  };
  // a tick draws itself on the pack's curve (stroke-dashoffset 1 to 0)
  Demo.prototype.draw = function(path, m){ const t0 = CLK.t, k = { el:path, m, t0, from:{}, to:{} };
    const tick = () => { const p = prog(m, CLK.t - t0); path.style.strokeDashoffset = 1 - p; if (CLK.t - t0 < dur(m)) later(0, tick); else path.style.strokeDashoffset = 0; }; tick(); };
  Demo.prototype.finish = function(){
    const P = this.P, root = this.by('root'); this.ended = CLK.t; this.state(root, 'done'); this.el.classList.add('done');
    $('.mo-m', this.el).textContent = 'Done';
    const g = $('.dmf-g', this.foot); DMFlow.mark(g, 'done'); const path = $('path', g); path.style.strokeDasharray = 1; path.style.strokeDashoffset = REDUCE ? 0 : 1;
    this.foot.style.visibility = ''; const el = (this.ended - this.t0);
    $$('b', this.foot)[0].textContent = clock(el); $$('b', this.foot)[1].textContent = money(this.sum(root));
    tw(this.foot, P.foot, { o:0, y:P.foot.y || 0, s:P.foot.s || 1, b:P.foot.b || 0 }, { o:1, y:0, s:1, b:0 });
    if (!REDUCE) later((P.foot.sub || 0) + .05, () => this.draw(path, P.tick));
  };
  Demo.prototype.sum = function(n){ return n.cost + n.kids.filter(k => k.on).reduce((a, k) => a + this.sum(k), 0); };
  // every frame: the numbers, the lines (from where the rows are now), the band
  Demo.prototype.frame = function(dt){
    const P = this.P;
    for (const n of this.N) if (n.on && n.s === 'run'){ n.cost += dt * (n.lv ? .0062 : .002); n.secs = CLK.t - n.t0; }
    for (const n of this.N) if (n.on && n.lv) $('.mo-q', n.el).textContent = n.s === 'queued' ? '' : (n.secs >= 1 ? Math.floor(n.secs) + 's · ' : '') + money(n.kids.length ? this.sum(n) : n.cost);
    const run = this.N.filter(n => n.on && n.lv && n.s === 'run').length;
    if (!this.ended){ $('.mo-m', this.el).textContent = (CLK.t - this.t0) < .3 ? 'Starting' : run + ' running'; $('.mo-tm', this.el).textContent = clock(CLK.t - this.t0); }
    $('.mo-tot', this.el).textContent = money(this.sum(this.by('root')));
    // the lines: each row's branch from its parent's mark, revealed on the pack's motion
    const L = this.L, box = el => L.box(el), R = DMFlow.R();
    for (const n of this.N){ if (!n.lv) continue;
      let ln = this.lines.get(n); if (!ln){ ln = DMFlow.line(L); this.lines.set(n, ln); }
      if (!n.on){ ln.set(''); continue; }
      const a = box(n.parent.g), b = box(n.g), pr = n.parent.lv ? n.parent.s : 'src';
      const d = DMFlow.route([[a.cx, a.cy + DMFlow.markR(pr) - 1], [a.cx, b.cy], [b.cx - DMFlow.markR(n.s) + 1, b.cy]]);
      // reveal: Now eases towards drawn each frame (exponential, k per second); the packs run their curve or spring
      if (P.line.k) n.rv = REDUCE ? 1 : n.rv + (1 - n.rv) * (1 - Math.exp(-dt * P.line.k)); else n.rv = REDUCE ? 1 : prog(P.line, CLK.t - n.rv0);
      ln.set(d, n.s === 'fail' ? 'bad' : n.s === 'queued' ? 'queued' : 'on', n.rv > .995 ? 1 : n.rv);
    }
    // the band: one per running leaf, from the source down its route, on the pack's speed and curve
    if (REDUCE) return;
    const leaves = this.N.filter(n => n.on && n.lv && n.s === 'run' && !n.kids.some(k => k.on && k.s === 'run'));
    const agentOf = n => { let x = n; while (x.lv > 1) x = x.parent; return x; };
    const want = new Map(); for (const n of leaves) if (n.rv > .97 && (n.lv < 2 || n.parent.rv > .97)) want.set(agentOf(n), n);
    for (const [ag, f] of this.bands) if (!want.has(ag)){ f.el.remove(); f.gr.remove(); this.bands.delete(ag); }
    for (const [ag, n] of want){
      const chain = []; for (let x = n; x; x = x.parent) chain.unshift(x);
      const pts = [], src = box(chain[0].g); pts.push([src.cx, src.cy + DMFlow.markR('src') - 1]);
      for (let i = 1; i < chain.length; i++){ const p = box(chain[i - 1].g), c = box(chain[i].g); pts.push([p.cx, c.cy], [c.cx, c.cy]); }
      const d = DMFlow.route(pts);
      let f = this.bands.get(ag);
      if (!f){ const id = 'mob' + Math.random().toString(36).slice(2, 8), gr = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gr.setAttribute('id', id); gr.setAttribute('gradientUnits', 'userSpaceOnUse');
        HL.forEach(([o, c]) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'stop'); s.setAttribute('class', c); s.setAttribute('offset', o); gr.append(s); }); L.defs.append(gr);
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'g'); el.setAttribute('class', 'dmf-band'); const core = document.createElementNS('http://www.w3.org/2000/svg', 'path'); core.setAttribute('stroke', `url(#${id})`); el.append(core); L.g.fx.append(el);
        f = { gr, el, core, start:null }; this.bands.set(ag, f); }
      f.core.setAttribute('d', d); const len = f.core.getTotalLength(), B = P.band;
      if (f.start == null || CLK.t - f.start >= f.trip + B.rest){ f.start = CLK.t; f.len0 = len; f.trip = Math.min(B.max, Math.max(B.min, len / B.speed)); f.m = B.spring ? { spring:[f.trip * .55, 1] } : null; }
      const u = (CLK.t - f.start) / f.trip;
      if (u >= 1){ f.el.style.opacity = 0; continue; }
      f.el.style.opacity = Math.min(1, u / .18, (1 - u) / .22).toFixed(3);
      const e = f.m ? prog(f.m, CLK.t - f.start) : B.e(u), at = Math.min(len, e * f.len0), t0 = at - BAND * CORE;
      f.core.style.strokeDasharray = `${BAND} ${len + BAND * 2}`; f.core.style.strokeDashoffset = -t0;
      const pa = alongP(f.core, len, t0), pb = alongP(f.core, len, t0 + BAND);
      f.gr.setAttribute('x1', pa.x); f.gr.setAttribute('y1', pa.y); f.gr.setAttribute('x2', pb.x + (pa.x === pb.x ? .01 : 0)); f.gr.setAttribute('y2', pb.y + (pa.y === pb.y ? .01 : 0));
    }
  };
  const alongP = (pth, len, t) => { if (t >= 0 && t <= len) return pth.getPointAtLength(t);
    const q = pth.getPointAtLength(t < 0 ? 0 : len), r = pth.getPointAtLength(t < 0 ? Math.min(len, 1) : Math.max(0, len - 1)), dx = q.x - r.x, dy = q.y - r.y, m = Math.hypot(dx, dy) || 1, k = t < 0 ? -t : t - len;
    return { x:q.x + dx / m * k, y:q.y + dy / m * k }; };

  // ---------- the page ----------
  const grid = $('.mo-grid'); let demos = [];
  grid.innerHTML = PACKS.map((p, i) => `<section class="mo-cell" data-i="${i}"><div class="mo-lab"><div class="h"><b>${p.name}</b><i>${p.by}</i><button class="mo-btn" data-replay="${i}">Replay</button></div><ul>${p.rules.map(r => `<li>${r}</li>`).join('')}</ul></div><div class="mo-st"></div></section>`).join('');
  const reset = i => { // drop this demo's tweens and timers, then build it again
    for (const k of [...tweens]) if (demos[i] && demos[i].el.contains(k.el)) tweens.delete(k);
    for (const k of [...timers]) if (k.owner === i) timers.delete(k);
    demos[i] = new Demo($(`.mo-cell[data-i="${i}"]`), PACKS[i]); };
  // timers are tagged with the demo that made them while it builds and runs
  const own = (i, fn) => { const add = timers.add.bind(timers); timers.add = k => { k.owner = i; return add(k); }; try { fn(); } finally { timers.add = add; } };
  const replayAll = () => { tweens.clear(); timers.clear(); demos = []; PACKS.forEach((p, i) => own(i, () => reset(i))); CLK.loopAt = CLK.t + 13; };
  // demo code schedules more timers while it runs, so each frame runs inside its own demo's tag
  function tick(now){
    const dt = CLK.last ? Math.min(.05, (now - CLK.last) / 1000) * CLK.speed : 0; CLK.last = now;
    step(dt);
    for (const k of [...timers]) if (CLK.t >= k.at){ timers.delete(k); own(k.owner, k.fn); }
    demos.forEach((d, i) => own(i, () => d.frame(dt)));
    // the spinners and shimmers (CSS animations) follow the clock's speed
    document.getAnimations().forEach(a => { if (a.playbackRate !== CLK.speed) a.playbackRate = CLK.speed; });
    if ($('#mo-loop').getAttribute('aria-pressed') === 'true' && CLK.t >= CLK.loopAt) replayAll();
    requestAnimationFrame(tick);
  }
  window.MO = { replayAll, CLK, PACKS, set speed(v){ CLK.speed = v; } };
  // the switches: style, theme, speed, loop
  const d = document.documentElement;
  const seg = (sel, get, set) => { const g = $(sel); const paint = () => $$('button', g).forEach(b => b.setAttribute('aria-pressed', get() === b.dataset.v));
    $$('button', g).forEach(b => b.onclick = () => { set(b.dataset.v); paint(); }); paint(); };
  seg('#mo-style', () => d.dataset.style === 'soft' ? 'soft' : 'bp', v => { if (v === 'bp') d.removeAttribute('data-style'); else d.dataset.style = 'soft'; try { localStorage.setItem('dmui-style', v); } catch(e){} replayAll(); });
  seg('#mo-theme', () => d.dataset.theme, v => { d.dataset.theme = v; try { localStorage.setItem('dmui-theme', v); } catch(e){} });
  seg('#mo-speed', () => String(CLK.speed), v => { CLK.speed = +v; });
  $('#mo-loop').onclick = e => { const b = e.currentTarget; b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); CLK.loopAt = CLK.t + 3; };
  $('#mo-all').onclick = replayAll;
  grid.addEventListener('click', e => { const b = e.target.closest('[data-replay]'); if (!b) return; const i = +b.dataset.replay; own(i, () => reset(i)); });
  if (!/[?&]rec\b/.test(location.search)) { replayAll(); requestAnimationFrame(tick); }
  else { window.MO.start = () => { replayAll(); requestAnimationFrame(tick); }; }
})();
