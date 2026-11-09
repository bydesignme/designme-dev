TPLS["currency-converter"] = "<div class=\"ccx panel\">\n  <div class=\"ccx-row\"><div class=\"ccx-in\"><span class=\"muted\">You pay</span><input class=\"ccx-a num\" value=\"24.00\" inputmode=\"decimal\" aria-label=\"Amount\"></div><button class=\"ccx-cur\" data-pop=\".ccx-p1\" data-pop-align=\"end\" data-pop-pos=\"down\">{fl-USD}<span class=\"cd\">USD</span>{chev}</button></div>\n  <button class=\"ccx-sw\" aria-label=\"Swap currencies\" data-tip=\"Swap\">{swap}</button>\n  <div class=\"ccx-row\"><div class=\"ccx-in\"><span class=\"muted\">They see</span><b class=\"ccx-b num\">0</b></div><button class=\"ccx-cur\" data-pop=\".ccx-p2\" data-pop-align=\"end\" data-pop-pos=\"down\">{fl-EUR}<span class=\"cd\">EUR</span>{chev}</button></div>\n  <div class=\"ccx-rate muted num\"></div>\n  <div class=\"pop ccx-p1\" role=\"menu\"></div><div class=\"pop ccx-p2\" role=\"menu\"></div>\n</div>";
TPLS["set-limit"] = "<div class=\"slx panel\">\n  <div class=\"slx-h\"><div><b>Monthly agent budget</b><span class=\"muted\">Resets Nov 1</span></div><label class=\"num slx-v\" data-tip=\"Type a budget\"><span class=\"cur\">$</span><input class=\"slx-in\" inputmode=\"numeric\" autocomplete=\"off\" aria-label=\"Monthly budget, in dollars\" value=\"200\"></label></div>\n  <div class=\"slx-bar\"><div class=\"slx-used\"></div><div class=\"slx-fc\"></div><button class=\"slx-k\" role=\"slider\" aria-label=\"Budget cap\" aria-valuemin=\"50\" aria-valuemax=\"500\"><span class=\"slx-tt num\">$200</span></button></div>\n  <div class=\"slx-lg muted\"><span><i style=\"background:var(--accent-mark,var(--accent))\"></i>Spent <b class=\"num slx-sp\">$128</b></span><span><i class=\"fc\"></i>Forecast <b class=\"num slx-fv\">$184</b></span></div>\n  <div class=\"slx-warn\"></div>\n  <div class=\"slx-opt\"><span class=\"muted\">At the limit</span><div class=\"seg2 slx-sg\" role=\"group\" aria-label=\"At the limit\"><button aria-pressed=\"true\" data-v=\"pause\">Pause runs</button><button aria-pressed=\"false\" data-v=\"ask\">Ask me</button><button aria-pressed=\"false\" data-v=\"keep\">Keep going</button></div></div>\n</div>";
TPLS["stepper"] = "<div class=\"stx\">\n  <div class=\"stx-track\"></div>\n  <div class=\"stx-vp\"><div class=\"stx-body\"></div></div>\n  <div class=\"stx-f\"><button class=\"pill ghost sm stx-bk\">Back</button><button class=\"pill primary sm stx-nx\">Continue</button></div>\n</div>";
TPLS["onboarding-checklist"] = "<div class=\"obx\">\n  <div class=\"obx-h\"><span class=\"obx-rw\"><svg class=\"obx-ring\" viewBox=\"0 0 40 40\"><circle cx=\"20\" cy=\"20\" r=\"16\" class=\"tr\"/><circle cx=\"20\" cy=\"20\" r=\"16\" class=\"fl\"/></svg><span class=\"obx-rk\">{check}</span></span><div class=\"obx-ht\"><b>Get set up</b><span class=\"muted obx-st\">0 of 5 done</span></div><button class=\"ib obx-min\" aria-label=\"Collapse\" data-tip=\"Collapse\">{chev}</button></div>\n  <div class=\"fold obx-fold\"><div><div class=\"obx-list\"></div></div></div>\n</div>";
TPLS["pricing-cards"] = "<div class=\"pcx\">\n  <div class=\"pcx-top\"><div class=\"seg2 pcx-per\" role=\"group\" aria-label=\"Billing\"><button aria-pressed=\"false\" data-v=\"m\">Monthly</button><button aria-pressed=\"true\" data-v=\"y\">Yearly <span class=\"tag ok\">−20%</span></button></div>\n    <label class=\"pcx-seats\"><span class=\"muted\">Editors</span><input type=\"range\" min=\"1\" max=\"50\" value=\"5\" aria-label=\"Editors\"><b class=\"num pcx-sn\">5</b></label></div>\n  <div class=\"pcx-grid\"></div>\n</div>";

/* ---------- Pricing cards ---------- */
DM.def('pricing-cards', (r, c) => {
  const P = [
    { n:'Starter', d:'For trying the agent', m:0, f:['1 project','50 agent runs a month','Figma import'], cta:'Start free' },
    { n:'Pro', d:'For growing design teams', m:24, f:['Unlimited projects','1,000 runs per editor','Shared tokens and memory','Priority models'], cta:'Start free trial', hot:1 },
    { n:'Enterprise', d:'For design orgs', m:null, f:['SSO and audit log','Custom spend caps','Dedicated support'], cta:'Talk to us' }
  ];
  const grid = $('.pcx-grid', r), rng = $('.pcx-seats input', r), sn = $('.pcx-sn', r);
  let per = 'y', seats = 5; const shown = P.map(() => 0);
  grid.innerHTML = P.map(p => `<div class="pcx-c panel${p.hot ? ' hot' : ''}">${p.hot ? '<span class="tag b bd">Most popular</span>' : ''}<span class="nm">${p.n}</span><span class="ds">${p.d}</span><div class="pcx-pr"><b class="num"></b><s class="num"></s><span></span></div><div class="pcx-tot num"></div><div class="pcx-li">${p.f.map(x => `<span>${I('check','xs')}${x}</span>`).join('')}</div><button class="pill ${p.hot ? 'primary' : 'line'}">${p.cta}</button></div>`).join('');
  const cards = $$('.pcx-c', grid);
  // the outlined card is the recommended one, and only its button is primary
  const ctas = () => cards.forEach(el => { const b = $('.pill', el), on = el.classList.contains('hot'); b.classList.toggle('primary', on); b.classList.toggle('line', !on); });
  function upd(){
    P.forEach((p, i) => { const el = cards[i], b = $('.pcx-pr b', el), s = $('.pcx-pr s', el), u = $('.pcx-pr span', el), tt = $('.pcx-tot', el);
      if (p.m === null){ b.textContent = 'Custom'; s.textContent = ''; u.textContent = 'billed yearly'; tt.textContent = 'Volume pricing from 25 editors'; return; }
      const unit = per === 'y' ? p.m * .8 : p.m;
      const go = () => tween(shown[i], unit, 500, v => { shown[i] = v; b.textContent = '$' + (Number.isInteger(unit) ? Math.round(v) : v.toFixed(2)); });
      // the first time, the prices count up once the cards are in view
      if (first){ b.textContent = '$0'; c.later(260, go); } else go();
      s.textContent = per === 'y' && p.m ? '$' + p.m : ''; u.textContent = p.m ? 'per editor, per month' : 'forever';
      swap(tt, p.m ? `$${(unit * seats * (per === 'y' ? 12 : 1)).toLocaleString('en-US', { maximumFractionDigits:0 })} ${per === 'y' ? 'billed yearly' : 'a month'} for ${seats} editor${seats > 1 ? 's' : ''}` : 'Up to 2 editors'); });
  }
  seg($('.pcx-per', r), v => { per = v; upd(); });
  rng.oninput = () => { seats = +rng.value; sn.textContent = seats; P.forEach((p, i) => { if (!p.m) return; const tt = $('.pcx-tot', cards[i]); const unit = per === 'y' ? p.m * .8 : p.m; tt.textContent = `$${(unit * seats * (per === 'y' ? 12 : 1)).toLocaleString('en-US', { maximumFractionDigits:0 })} ${per === 'y' ? 'billed yearly' : 'a month'} for ${seats} editor${seats > 1 ? 's' : ''}`; });
    cards[2].classList.toggle('hot', seats >= 25); cards[1].classList.toggle('hot', seats < 25); ctas(); };
  let first = true; stagger(cards, 80); upd(); first = false;
  // once in view it shows the switch at work: monthly, then back to yearly. Touching it takes over
  const flip = v => $(`.pcx-per button[data-v="${v}"]`, r).click();
  c.auto(1900, () => flip('m')); c.auto(3900, () => flip('y'));
});
/* ---------- Onboarding checklist ---------- */
DM.def('onboarding-checklist', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs')).replace('{check}', I('check','xs'));
  const S = [['Create your workspace','Done when you signed up',1,0],['Connect Figma','So the agent can read your frames',0,1],['Import your tokens','Colours, type and spacing',0,1],['Invite a teammate','Design is better together',0,0],['Run your first audit','Takes about a minute',0,1]];
  const list = $('.obx-list', r), st = $('.obx-st', r), ring = $('.obx-ring', r), rw = $('.obx-rw', r), fl = $('.obx-ring .fl', r);
  list.innerHTML = S.map((s, i) => `<div class="obx-s${s[2] ? ' done' : ''}" data-i="${i}"><button class="obx-ck" role="checkbox" aria-checked="${!!s[2]}" aria-label="${s[0]}">${I('check','xs')}</button><span class="t"><b>${s[0]}</b><span>${s[1]}</span></span>${s[3] ? `<button class="pill soft sm">${I('spark','xs')}Do it for me</button>` : ''}</div>`).join('');
  const rows = $$('.obx-s', list);
  function tally(){ const n = S.filter(s => s[2]).length; fl.style.strokeDashoffset = 100.5 * (1 - n / S.length); ring.classList.toggle('full', n === S.length); rw.classList.toggle('full', n === S.length); swap(st, n === S.length ? 'All done. Nice work' : n + ' of ' + S.length + ' done');
    if (n === S.length && !$('.obx-dn', list)){ const d = html(`<div class="obx-dn">${I('ok','xs')}You are all set. The agent will suggest what to try next.</div>`); list.appendChild(d); enter(d); } else if (n < S.length) $('.obx-dn', list)?.remove(); }
  const set = (i, v) => { S[i][2] = v; rows[i].classList.toggle('done', v); $('.obx-ck', rows[i]).setAttribute('aria-checked', v); tally(); };
  rows.forEach((row, i) => {
    $('.obx-ck', row).onclick = () => set(i, !S[i][2]);
    // the whole row ticks the step, not only its checkbox (its button does its own thing, and a running step waits)
    row.onclick = e => { if (e.target.closest('.obx-ck, .pill') || row.classList.contains('run')) return; set(i, !S[i][2]); };
    const p = $('.pill', row); if (p) p.onclick = () => c.run(async () => { row.classList.add('run'); const ck = $('.obx-ck', row); ck.innerHTML = '<span class="spin" style="width:14px;height:14px"></span>'; const sp = $('.t span', row), was = sp.textContent; swap(sp, 'The agent is on it'); sp.classList.add('shim');
      await c.wait(1400); ck.innerHTML = I('check','xs'); row.classList.remove('run'); sp.classList.remove('shim'); swap(sp, was); set(i, 1); });
  });
  const mn = $('.obx-min', r); mn.onclick = () => { const s = $('.obx-fold', r).classList.toggle('shut'); mn.classList.toggle('shut', s); mn.dataset.tip = s ? 'Expand' : 'Collapse'; };
  stagger(rows, 50); c.later(200, tally);
  // the preview has the agent connect Figma once on its own, unless you take over first
  c.auto(1300, () => $('.pill', rows[1]).click());
});
/* ---------- Stepper ---------- */
DM.def('stepper', (r, c) => {
  const S = [
    ['Workspace','Name your workspace','This is what your team will see.',[['Studio','Small team'],['Agency','Many clients'],['In-house','One product']]],
    ['Agent','How should the agent work?','You can change this any time.',[['Ask first','Safest'],['Balanced','Recommended'],['Autopilot','Fastest']]],
    ['Connect','Where do your designs live?','Pick one to start.',[['Figma','Frames and tokens'],['GitHub','Code and PRs'],['Both','Full loop']]]
  ];
  const stx = $('.stx', r), track = $('.stx-track', r), body = $('.stx-body', r), bk = $('.stx-bk', r), nx = $('.stx-nx', r);
  let cur = 0, pick = [0, 1, 2];
  track.innerHTML = S.map((s, i) => `<div class="stx-st" data-i="${i}"><span class="n">${i + 1}</span><span class="lb">${s[0]}</span></div>` + (i < S.length - 1 ? '<div class="stx-ln"><i></i></div>' : '')).join('');
  const sts = $$('.stx-st', track), lns = $$('.stx-ln', track);
  function show(i, dir){
    cur = i; sts.forEach((s, j) => { s.classList.toggle('on', j === i); s.classList.toggle('done', j < i); $('.n', s).innerHTML = j < i ? I('check','xs') : j + 1; });
    lns.forEach((l, j) => l.classList.toggle('full', j < i));
    if (i >= S.length){
      if (!stx.classList.contains('fin')) hold(stx);
      body.innerHTML = `<div class="stx-dn"><span class="stx-ok"><svg viewBox="0 0 44 44" aria-hidden="true"><circle class="c" cx="22" cy="22" r="20"/><path class="k" d="M14 22.5l5.5 5.5L30.5 16.5"/></svg></span><b>You're set up</b><span class="muted">${S.map((s, k) => s[3][pick[k]][0]).join(' · ')}</span></div>`;
      bk.disabled = true; nx.textContent = 'Start over'; stx.classList.add('fin');
      // arriving here from Finish is the moment to celebrate; the screen itself doesn't slide
      if (dir > 0){ const dn = $('.stx-dn', body); dn.classList.add('go'); enter($('b', dn), 260); enter($('.muted', dn), 340); burst($('.stx-ok', dn)); }
      return;
    }
    else { if (stx.classList.contains('fin')){ stx.classList.remove('fin'); release(stx); } const s = S[i]; body.innerHTML = `<h4>${s[1]}</h4><p>${s[2]}</p><div class="stx-opts">${s[3].map((o, k) => `<button class="stx-o${pick[i] === k ? ' on' : ''}" data-k="${k}"><b style="font-weight:500">${o[0]}</b><span>${o[1]}</span></button>`).join('')}</div>`;
      $$('.stx-o', body).forEach(b => b.onclick = () => { pick[i] = +b.dataset.k; $$('.stx-o', body).forEach(x => x.classList.toggle('on', x === b)); });
      bk.disabled = i === 0; nx.textContent = i === S.length - 1 ? 'Finish' : 'Continue'; }
    if (dir){ body.classList.remove('inr','inl'); void body.offsetWidth; body.classList.add(dir > 0 ? 'inr' : 'inl'); }
  }
  // a short burst of confetti from the check, in the accent and a few brand colours, falling as it fades
  function burst(at){
    if (REDUCE) return;
    const bp = getComputedStyle(r).getPropertyValue('--motion').trim() === 'bp';
    const box = document.createElement('span'); box.className = 'stx-conf'; at.appendChild(box);
    const COL = ['var(--accent-mark,var(--accent))', 'var(--ok)', 'var(--c2)', 'var(--c4)', 'var(--c5)', 'var(--c6)'], N = 22;
    for (let k = 0; k < N; k++){
      const p = document.createElement('i'), round = k % 3 === 0, a = -Math.PI / 2 + (k / (N - 1) - .5) * Math.PI * 1.5 + Math.sin(k * 7.3) * .18;
      const d = 46 + (k * 37 % 30), w = round ? 5 : 3 + k % 2, h = round ? 5 : 7 + k % 3;
      p.className = round ? 'd' : ''; p.style.width = w + 'px'; p.style.height = h + 'px'; p.style.marginLeft = -w / 2 + 'px'; p.style.marginTop = -h / 2 + 'px'; p.style.background = COL[k % COL.length];
      box.appendChild(p);
      const x = Math.cos(a) * d, y = Math.sin(a) * d, r0 = k * 47 % 180, spin = (k % 2 ? 1 : -1) * (180 + k * 23 % 200), ms = (bp ? 760 : 1150) + k * 13 % 220;
      p.animate([
        { opacity:1, transform:`translate(0,0) rotate(${r0}deg) scale(.6)` },
        { opacity:1, transform:`translate(${x}px,${y}px) rotate(${r0 + spin * .5}deg) scale(1)`, offset:.42 },
        { opacity:0, transform:`translate(${x * 1.18}px,${y + 46}px) rotate(${r0 + spin}deg) scale(.9)` }
      ], { duration:ms, delay:120 + k % 4 * 18, easing:bp ? 'cubic-bezier(.65,0,.25,1)' : 'cubic-bezier(.16,1,.3,1)', fill:'both' });
    }
    c.later(1700, () => box.remove());
  }
  nx.onclick = () => cur >= S.length ? show(0, -1) : show(cur + 1, 1);
  bk.onclick = () => show(Math.max(0, cur - 1), -1);
  sts.forEach((s, i) => s.onclick = () => { if (i < cur) show(i, -1); });
  show(0);
});
/* ---------- Set limit ---------- */
DM.def('set-limit', (r, c) => {
  const bar = $('.slx-bar', r), k = $('.slx-k', r), tt = $('.slx-tt', r), v = $('.slx-v', r), used = $('.slx-used', r), fc = $('.slx-fc', r), warn = $('.slx-warn', r);
  const MIN = 50, MAX = 500, SPENT = 128, FC = 184; let cap = 200, mode = 'pause';
  const pct = x => (x - MIN) / (MAX - MIN) * 100;
  const vin = $('.slx-in', r), fit = () => { vin.style.width = Math.max(1, vin.value.length) + 'ch'; };
  function upd(anim){
    k.style.left = pct(cap) + '%'; tt.textContent = '$' + cap; k.setAttribute('aria-valuenow', cap);
    // while someone types, the field keeps what they typed
    if (document.activeElement !== vin){ vin.value = cap; fit(); }
    used.style.width = Math.min(100, SPENT / cap * pct(cap)) + '%'; fc.style.width = Math.min(pct(cap), FC / cap * pct(cap)) + '%';
    const over = FC > cap;
    const h = over ? `<span class="w">${I('alert','xs')}Forecast passes your cap around Oct 27. Runs will ${mode === 'pause' ? 'pause' : mode === 'ask' ? 'wait for you' : 'keep going'}.</span>` : `<span class="o">${I('ok','xs')}<span>On track. About <span class="slx-left">$${cap - FC}</span> left at month end.</span></span>`;
    // a new message comes in with the entrance; while it stays the same, only the amount left follows the cap
    if (warn.dataset.h !== String(over) + mode){ warn.dataset.h = String(over) + mode; warn.innerHTML = h; enter(warn.firstChild); }
    else if (!over) $('.slx-left', warn).textContent = '$' + (cap - FC);
  }
  const at = e => { glide++; const b = bar.getBoundingClientRect(); cap = Math.round((MIN + (MAX - MIN) * Math.max(0, Math.min(1, (e.clientX - b.left) / b.width))) / 10) * 10; upd(); };
  bar.onpointerdown = e => { bar.setPointerCapture(e.pointerId); k.classList.add('drag'); at(e); bar.onpointermove = at; };
  bar.onpointerup = bar.onpointercancel = () => { k.classList.remove('drag'); bar.onpointermove = null; };
  // a change from the keys or the field shows the amount over the knob for a moment, so it can be followed there too
  let sayT = 0; const say = () => { k.classList.add('say'); clearTimeout(sayT); sayT = setTimeout(() => k.classList.remove('say'), 1200); };
  k.onkeydown = e => { if (e.key === 'ArrowRight' || e.key === 'ArrowUp'){ cap = Math.min(MAX, cap + 10); upd(); say(); e.preventDefault(); } if (e.key === 'ArrowLeft' || e.key === 'ArrowDown'){ cap = Math.max(MIN, cap - 10); upd(); say(); e.preventDefault(); } };
  seg($('.slx-sg', r), m => { mode = m; upd(); });
  // typing a budget: the cap glides to it while it's in range; Enter or leaving the field keeps it (held to the range), Escape goes back
  let glide = 0, before = cap;
  const goTo = n => { const id = ++glide, from = cap; say(); tween(from, n, 450, x => { if (id === glide){ cap = Math.round(x); upd(); } }); };
  const commit = () => { const n = vin.value === '' ? before : Math.max(MIN, Math.min(MAX, parseInt(vin.value, 10))); vin.value = n; fit(); if (n !== cap) goTo(n); };
  // a click selects the whole figure at once, so typing replaces it
  v.addEventListener('pointerdown', e => { if (document.activeElement !== vin){ e.preventDefault(); vin.focus({ preventScroll:true }); } });
  vin.onfocus = () => { before = cap; vin.select(); };
  vin.oninput = () => { vin.value = vin.value.replace(/\D/g, '').slice(0, 4); fit(); const n = +vin.value; if (vin.value && n >= MIN && n <= MAX) goTo(n); };
  vin.onkeydown = e => {
    if (e.key === 'Enter'){ e.preventDefault(); vin.blur(); }
    else if (e.key === 'Escape'){ vin.value = before; goTo(before); vin.blur(); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowDown'){ e.preventDefault(); const n = Math.max(MIN, Math.min(MAX, (parseInt(vin.value, 10) || cap) + (e.key === 'ArrowUp' ? 10 : -10))); vin.value = n; fit(); goTo(n); }
  };
  vin.onblur = commit;
  used.style.width = 0; fc.style.width = 0; k.style.left = pct(cap) + '%'; fit();
  // the line under the bar takes one line or two, so the panel stays centred in the room its stage keeps for it
  const root = $('.slx', r); centre(c, root, () => root.offsetHeight);
  c.later(200, () => upd());
  // the preview lowers the cap once on its own, unless you take over first
  c.auto(1500, () => tween(200, 170, 900, x => { if (!c.mine){ cap = Math.round(x / 10) * 10; upd(); } }));
});
/* ---------- Currency converter ---------- */
DM.def('currency-converter', (r, c) => {
  /* each currency's flag: the ones Country select draws, and the European Union's twelve stars, drawn here the same way */
  const CC = { USD:'US', GBP:'GB', JPY:'JP', CAD:'CA', AUD:'AU' };
  const EU = '<svg viewBox="0 0 640 480"><path fill="#039" d="M0 0h640v480H0z"/><path fill="#fc0" d="M320 53.3 326 71.8 345.4 71.8 329.7 83.1 335.7 101.6 320 90.2 304.3 101.6 310.3 83.1 294.6 71.8 314 71.8zM400 74.8 406 93.2 425.4 93.2 409.7 104.6 415.7 123 400 111.6 384.3 123 390.3 104.6 374.6 93.2 394 93.2zM458.6 133.3 464.6 151.8 483.9 151.8 468.3 163.1 474.2 181.6 458.6 170.2 442.9 181.6 448.9 163.1 433.2 151.8 452.6 151.8zM480 213.3 486 231.8 505.4 231.8 489.7 243.1 495.7 261.6 480 250.2 464.3 261.6 470.3 243.1 454.6 231.8 474 231.8zM458.6 293.3 464.6 311.8 483.9 311.8 468.3 323.1 474.2 341.6 458.6 330.2 442.9 341.6 448.9 323.1 433.2 311.8 452.6 311.8zM400 351.9 406 370.3 425.4 370.3 409.7 381.7 415.7 400.1 400 388.8 384.3 400.1 390.3 381.7 374.6 370.3 394 370.3zM320 373.3 326 391.8 345.4 391.8 329.7 403.1 335.7 421.6 320 410.2 304.3 421.6 310.3 403.1 294.6 391.8 314 391.8zM240 351.9 246 370.3 265.4 370.3 249.7 381.7 255.7 400.1 240 388.8 224.3 400.1 230.3 381.7 214.6 370.3 234 370.3zM181.4 293.3 187.4 311.8 206.8 311.8 191.1 323.1 197.1 341.6 181.4 330.2 165.8 341.6 171.7 323.1 156.1 311.8 175.4 311.8zM160 213.3 166 231.8 185.4 231.8 169.7 243.1 175.7 261.6 160 250.2 144.3 261.6 150.3 243.1 134.6 231.8 154 231.8zM181.4 133.3 187.4 151.8 206.8 151.8 191.1 163.1 197.1 181.6 181.4 170.2 165.8 181.6 171.7 163.1 156.1 151.8 175.4 151.8zM240 74.8 246 93.2 265.4 93.2 249.7 104.6 255.7 123 240 111.6 224.3 123 230.3 104.6 214.6 93.2 234 93.2z"/></svg>';
  const FL = k => `<span class="ccx-fl" data-k="${k}">${k === 'EUR' ? `<img class="flag" alt="" src="data:image/svg+xml,${encodeURIComponent(EU.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" '))}">` : FLAG(CC[k])}</span>`;
  r.innerHTML = r.innerHTML.replace(/\{chev\}/g, I('chev-d','xs')).replace('{swap}', I('sort','xs')).replace(/\{fl-(\w+)\}/g, (m, k) => FL(k));
  const RATE = { USD:1, EUR:.92, GBP:.79, JPY:149.6, CAD:1.37, AUD:1.52 };
  const NAME = { USD:'US dollar', EUR:'Euro', GBP:'Pound', JPY:'Yen', CAD:'Canadian dollar', AUD:'Australian dollar' };
  const SYM = { USD:'$', EUR:'€', GBP:'£', JPY:'¥', CAD:'C$', AUD:'A$' };
  let A = 'USD', B = 'EUR', out = 0;
  const a = $('.ccx-a', r), b = $('.ccx-b', r), rate = $('.ccx-rate', r), curs = $$('.ccx-cur', r);
  function calc(delay){ const n = parseFloat(a.value.replace(/[^\d.]/g, '')) || 0; const v = n / RATE[A] * RATE[B]; const dp = B === 'JPY' ? 0 : 2;
    const go = () => tween(out, v, 450, x => { out = x; b.textContent = SYM[B] + x.toLocaleString('en-US', { minimumFractionDigits:dp, maximumFractionDigits:dp }); }); delay ? c.later(delay, go) : go();
    rate.innerHTML = `<span class="dot"></span>1 ${A} = ${(RATE[B] / RATE[A]).toFixed(B === 'JPY' || A === 'JPY' ? 4 : 4)} ${B} · updated 2 min ago`; }
  function menus(){ [['.ccx-p1', 0], ['.ccx-p2', 1]].forEach(([sel, side]) => { const p = $(sel, r), cur = side ? B : A;
    p.innerHTML = Object.keys(RATE).map(k => `<button class="mi" role="menuitemradio" data-close data-k="${k}" aria-checked="${k === cur}">${FL(k)}<span class="cd">${k}</span><span>${NAME[k]}</span><span class="ck">${I('check','xs')}</span></button>`).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { if (side) B = m.dataset.k; else A = m.dataset.k; if (A === B){ if (side) A = Object.keys(RATE).find(x => x !== B); else B = Object.keys(RATE).find(x => x !== A); } paint(); })); }); }
  // the code rolls over to the new one while its flag changes at once
  const flag = (cur, k) => { const f = $('.ccx-fl', cur); if (f.dataset.k !== k) f.outerHTML = FL(k); };
  function paint(delay){ flag(curs[0], A); flag(curs[1], B); swap($('.cd', curs[0]), A); swap($('.cd', curs[1]), B); menus(); calc(delay); }
  a.oninput = () => { a.value = a.value.replace(/[^\d.]/g, ''); calc(); };
  a.onblur = () => { const n = parseFloat(a.value) || 0; a.value = n.toFixed(2); };
  const sw = $('.ccx-sw', r);
  sw.onclick = () => { sw.classList.toggle('go'); const n = out; [A, B] = [B, A]; a.value = (B === 'JPY' || A === 'JPY') ? (A === 'JPY' ? Math.round(n) : n.toFixed(2)) : n.toFixed(2); a.value = String(a.value); paint(); };
  paint(260);
  // the converter sits centred on its own, and glides up as a currency list opens under it, so the two sit centred together
  // instead of the list running off the stage; on closing, it waits for the list to fade before it glides back to the middle
  const box = $('.ccx', r), pops = $$('.pop', box), shown = () => pops.find(p => p.classList.contains('open'));
  const centred = centre(c, box, () => { const p = shown(); return p ? Math.max(box.offsetHeight, p.offsetTop + p.offsetHeight) : box.offsetHeight; });
  const mo = new MutationObserver(() => shown() ? centred() : c.later(REDUCE ? 0 : 180, centred));
  pops.forEach(p => mo.observe(p, { attributes:true, attributeFilter:['class'] })); c.offs.push(() => mo.disconnect());
  // once in view it converts a new amount, then swaps the two currencies. Clicking, focusing or typing in it takes over
  c.run(async () => {
    await c.step(1500);
    await c.type(a, '120', { ms:150, each:() => calc(), clear:true });
    await c.step(250); a.value = '120.00';
    await c.step(1300); sw.click();
  });
});