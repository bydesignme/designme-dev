TPLS["task-table"] = "<div class=\"ttx panel\" data-reveal=\"flat\">\n  <div class=\"ttx-hd\">\n    <div class=\"ttx-ti\"><b>Agent tasks</b><span class=\"muted num ttx-sum\">6 tasks, 2 running</span></div>\n    <div class=\"ttx-sb\" inert><span class=\"ttx-n num\">2 selected</span><button class=\"pill ghost sm\" data-a=\"pause\">{pause}Pause</button><button class=\"pill ghost sm\" data-a=\"retry\">{refresh}Retry</button><button class=\"pill ghost sm ttx-del\" data-a=\"cancel\">{x}Cancel</button><span class=\"ttx-sp\"></span><button class=\"pill ghost sm ttx-clr\">Clear</button></div>\n  </div>\n  <div class=\"ttx-sc\"><table class=\"ttx-t\">\n    <thead><tr><th class=\"ck\"><button class=\"ttx-cb ttx-all\" role=\"checkbox\" aria-checked=\"false\" aria-label=\"Select all\"></button></th><th><button class=\"ttx-s\" data-k=\"0\">Task</button></th><th><button class=\"ttx-s\" data-k=\"1\">Status</button></th><th><button class=\"ttx-s\" data-k=\"2\">Agent</button></th><th class=\"r\"><button class=\"ttx-s\" data-k=\"3\">Cost</button></th><th class=\"r\"><button class=\"ttx-s\" data-k=\"4\">Updated</button></th></tr></thead>\n    <tbody></tbody>\n  </table></div>\n</div>";
TPLS["details-panel"] = "<div class=\"dtp panel\">\n  <div class=\"dtp-h\"><span class=\"ft\">RUN</span><b>Pricing page redesign</b><button class=\"ib dtp-cp\" aria-label=\"Copy run ID\" data-tip=\"Copy run ID\">{link}</button></div>\n  <div class=\"dtp-sec\">\n    <button class=\"dtp-sh\" aria-expanded=\"true\">{chev}<span>Properties</span></button>\n    <div class=\"fold dtp-f1\"><div><div class=\"dtp-rows\">\n      <div class=\"dtp-r\"><span class=\"k\">Status</span><button class=\"dtp-v dtp-stat\" data-pop=\".dtp-pst\"><span class=\"dot\" style=\"color:var(--accent-mark,var(--accent))\"></span><span>In review</span></button>\n        <div class=\"pop dtp-pst\" role=\"menu\"><button class=\"mi\" role=\"menuitem\" data-close data-s=\"In progress\" data-col=\"var(--py)\"><span class=\"dot\" style=\"color:var(--py)\"></span><span>In progress</span></button><button class=\"mi\" role=\"menuitem\" data-close data-s=\"In review\" data-col=\"var(--accent-mark,var(--accent))\"><span class=\"dot\" style=\"color:var(--accent-mark,var(--accent))\"></span><span>In review</span></button><button class=\"mi\" role=\"menuitem\" data-close data-s=\"Shipped\" data-col=\"var(--ok)\"><span class=\"dot\" style=\"color:var(--ok)\"></span><span>Shipped</span></button></div></div>\n      <div class=\"dtp-r\"><span class=\"k\">Owner</span><button class=\"dtp-v dtp-own\" data-pop=\".dtp-pow\">{avm}<span>Maya Kim</span></button>\n        <div class=\"pop dtp-pow\" role=\"menu\"><button class=\"mi\" role=\"menuitem\" data-close data-o=\"Maya Kim\" data-i=\"MK\" data-col=\"var(--av-l)\">{avm}<span>Maya Kim</span></button><button class=\"mi\" role=\"menuitem\" data-close data-o=\"Jon Ortiz\" data-i=\"JO\" data-col=\"var(--av-m)\">{avj}<span>Jon Ortiz</span></button><button class=\"mi\" role=\"menuitem\" data-close data-o=\"Design agent\" data-i=\"DA\" data-col=\"var(--av-b)\">{ava}<span>Design agent</span></button></div></div>\n      <div class=\"dtp-r\"><span class=\"k\">Model</span><button class=\"dtp-v\" data-pop=\".dtp-pmo\"><span class=\"dtp-mo\">Opus</span>{chevd}</button>\n        <div class=\"pop dtp-pmo\" role=\"menu\"><button class=\"mi\" role=\"menuitem\" data-close data-m=\"Opus\"><span>Opus<span class=\"d\">Best for design</span></span></button><button class=\"mi\" role=\"menuitem\" data-close data-m=\"Sonnet\"><span>Sonnet<span class=\"d\">Faster, cheaper</span></span></button><button class=\"mi\" role=\"menuitem\" data-close data-m=\"Haiku\"><span>Haiku<span class=\"d\">Quick edits</span></span></button></div></div>\n      <div class=\"dtp-r\"><span class=\"k\">Due</span><span class=\"dtp-v num\">Oct 24</span></div>\n      <div class=\"dtp-r\"><span class=\"k\">Labels</span><span class=\"dtp-tags\"><span class=\"tag b\">Pricing</span><span class=\"tag p\">Web</span><button class=\"dtp-add\" aria-label=\"Add label\" data-tip=\"Add label\">{plus}</button></span></div>\n    </div></div></div>\n  </div>\n  <div class=\"dtp-sec\">\n    <button class=\"dtp-sh\" aria-expanded=\"true\">{chev}<span>Usage</span></button>\n    <div class=\"fold dtp-f2\"><div><div class=\"dtp-rows\">\n      <div class=\"dtp-r\"><span class=\"k\">Tokens</span><span class=\"dtp-v num dtp-tok\">0</span></div>\n      <div class=\"dtp-r\"><span class=\"k\">Cost</span><span class=\"dtp-v num dtp-cost\">$0.00</span></div>\n      <div class=\"dtp-r\"><span class=\"k\">Run time</span><span class=\"dtp-v num\">4m 12s</span></div>\n    </div></div></div>\n  </div>\n</div>";
TPLS["metric-insight"] = "<div class=\"mix panel\">\n  <div class=\"mix-h\"><span class=\"muted\">Trial to paid</span><div class=\"seg2 mix-rg\" role=\"group\" aria-label=\"Range\"><button aria-pressed=\"false\" data-v=\"7\">7d</button><button aria-pressed=\"true\" data-v=\"30\">30d</button><button aria-pressed=\"false\" data-v=\"90\">90d</button></div></div>\n  <div class=\"mix-v\"><b class=\"num mix-n\">0%</b><span class=\"tag ok mix-d num\">+0.0 pts</span></div>\n  <div class=\"mix-ch\"><svg class=\"mix-svg\" viewBox=\"0 0 300 90\" preserveAspectRatio=\"none\"><defs><linearGradient id=\"mixg\" x1=\"0\" x2=\"0\" y1=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"var(--accent-mark,var(--accent))\" stop-opacity=\".18\"/><stop offset=\"1\" stop-color=\"var(--accent-mark,var(--accent))\" stop-opacity=\"0\"/></linearGradient></defs><path class=\"mix-a\" fill=\"url(#mixg)\"/><path class=\"mix-l\" fill=\"none\" stroke=\"var(--accent-mark,var(--accent))\" stroke-width=\"2\" vector-effect=\"non-scaling-stroke\" stroke-linejoin=\"round\"/><line class=\"mix-x\" y1=\"0\" y2=\"90\" stroke=\"var(--faint)\" stroke-dasharray=\"2 3\" vector-effect=\"non-scaling-stroke\"/></svg><span class=\"mix-dot\"></span><span class=\"mix-mk\" style=\"left:58%\"><b>{spark}Sep 18</b></span></div>\n  <div class=\"mix-ins\"><span class=\"mix-ic\">{spark}</span><span class=\"mix-t\">Jumped after the pricing page update on Sep 18.</span></div>\n  <button class=\"pill soft sm mix-why\">Why did it move?</button>\n  <div class=\"fold shut mix-box\"><div><div class=\"mix-rs\"></div></div></div>\n</div>";
TPLS["field-extraction"] = "<div class=\"fex\">\n  <div class=\"fex-doc\">\n    <div class=\"fex-pg\">\n      <div class=\"fex-top\"><b>Northwind Studio</b><span class=\"muted\">Invoice</span></div>\n      <div class=\"fex-z\" data-z=\"no\"><span class=\"muted\">Invoice no.</span> <span class=\"num\">NW-2041</span></div>\n      <div class=\"fex-z\" data-z=\"date\"><span class=\"muted\">Issued</span> <span class=\"num\">3 Oct 2026</span></div>\n      <div class=\"fex-tb\">\n        <div class=\"fex-li\"><span>Design system audit</span><span class=\"num\">$4,800.00</span></div>\n        <div class=\"fex-li\"><span>Pricing page redesign</span><span class=\"num\">$6,200.00</span></div>\n        <div class=\"fex-li\"><span>Agent setup, 2 seats</span><span class=\"num\">$480.00</span></div>\n      </div>\n      <div class=\"fex-z fex-tot\" data-z=\"total\"><span>Total due</span><span class=\"num\">$11,480.00</span></div>\n      <div class=\"fex-z fex-smudge\" data-z=\"due\"><span class=\"muted\">Due by</span> <span class=\"num\">1? Nov 2026</span></div>\n    </div>\n  </div>\n  <div class=\"fex-side panel\">\n    <div class=\"fex-sh\"><b>Extracted fields</b><span class=\"muted fex-st\">Reading page 1</span></div>\n    <div class=\"fex-list\"></div>\n    <div class=\"fex-f\"><button class=\"pill primary sm fex-go\" disabled>Send to Sheets</button></div>\n  </div>\n</div>";
TPLS["source-stack"] = "<div class=\"ssx\">\n  <p class=\"msg\">Annual plans convert about 18% better when the monthly price is shown crossed out next to them.</p>\n  <button class=\"ssx-pill\" aria-expanded=\"false\"><span class=\"ssx-ics\"></span><span class=\"ssx-l\">8 sources</span>{chev}</button>\n  <div class=\"fold shut ssx-box\"><div><div class=\"ssx-in\">\n    <div class=\"ssx-fl\"><button class=\"chip sm on\" data-f=\"all\">All</button><button class=\"chip sm\" data-f=\"web\">Web</button><button class=\"chip sm\" data-f=\"file\">Files</button><button class=\"chip sm\" data-f=\"figma\">Figma</button></div>\n    <div class=\"ssx-list\"></div>\n  </div></div></div>\n</div>";
TPLS["citation-hover"] = "<div class=\"chx\">\n  <p class=\"msg chx-p\">Teams that show the annual price first see higher paid conversion<button class=\"chx-c\" data-i=\"0\">1</button>, and the effect is stronger when the monthly price stays visible beside it<button class=\"chx-c\" data-i=\"1\">2</button>. Your own data shows the same pattern since the September update<button class=\"chx-c\" data-i=\"2\">3</button>.</p>\n  <div class=\"chx-card panel keep\" role=\"dialog\" aria-label=\"Source\"><div class=\"chx-in\"></div></div>\n</div>";
TPLS["terminal-stream"] = "<div class=\"tmx panel\" data-reveal=\"flat\">\n  <div class=\"tmx-h\"><span class=\"tmx-ic\">{term}</span><span class=\"tmx-cwd\">~/acme/web</span><span class=\"tmx-st\"><span class=\"g\"><span class=\"spin\"></span></span><span class=\"tmx-sv num\">Starting</span></span><span class=\"sp\"></span><button class=\"pill ghost sm tmx-stop\" aria-label=\"Stop the running command\">{stop}Stop</button><button class=\"ib tmx-cp\" aria-label=\"Copy the output\" data-tip=\"Copy\">{copy}</button></div>\n  <div class=\"tmx-body\" role=\"log\" aria-label=\"Terminal output\" tabindex=\"0\"></div>\n  <div class=\"fold shut tmx-ff\"><div><div class=\"tmx-f\"><span class=\"g\"></span><span class=\"tmx-fs num\"></span></div></div></div>\n</div>";
TPLS["code-viewer"] = "<div class=\"cvx panel\" data-reveal=\"flat\">\n  <div class=\"cvx-h\"><div class=\"cvx-tabs\" role=\"tablist\"></div><span class=\"cvx-meta num\"></span><button class=\"ib cvx-cp\" aria-label=\"Copy file\" data-tip=\"Copy\">{copy}</button></div>\n  <div class=\"cvx-body\"><pre class=\"cvx-code\"></pre></div>\n</div>";

/* ---------- Source stack ---------- */
DM.def('source-stack', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs'));
  const S = [
    ['web','Baymard: pricing page UX','baymard.com',.92,'B','var(--pb)'],
    ['web','Annual vs monthly anchoring study','cxl.com',.88,'C','var(--pp)'],
    ['file','Q3 conversion export.csv','Drive',.84,'CSV','var(--pm)'],
    ['figma','Pricing v4, frame 2','Figma',.8,'F','var(--pl)'],
    ['web','Stripe billing docs','stripe.com',.66,'S','var(--pl)'],
    ['file','Pricing research notes','Notion',.61,'N','var(--fg2)'],
    ['figma','Checkout flow','Figma',.52,'F','var(--pl)'],
    ['web','NN/g on price framing','nngroup.com',.48,'N','var(--fg2)']
  ];
  const pill = $('.ssx-pill', r), box = $('.ssx-box', r), list = $('.ssx-list', r);
  $('.ssx-ics', r).innerHTML = S.slice(0, 4).map(s => `<span style="background:${s[5]}">${s[4][0]}</span>`).join('');
  function paint(f){
    const items = S.filter(s => f === 'all' || s[0] === f);
    list.innerHTML = items.map(s => `<div class="ssx-s"><span class="fv" style="background:color-mix(in srgb,${s[5]} 14%,transparent);color:${s[5]}">${s[4]}</span><span class="t">${s[1]}<span class="h"> · ${s[2]}</span></span><span class="rel" data-tip="Relevance ${Math.round(s[3] * 100)}%"><i style="width:${s[3] * 100}%"></i></span><button class="ib" aria-label="Open source" data-tip="Open">${I('ext','xs')}</button></div>`).join('');
    stagger($$('.ssx-s', list), 40);
  }
  pill.onclick = () => { const open = box.classList.toggle('shut') === false; pill.setAttribute('aria-expanded', open); if (open) paint($('.ssx-fl .on', r).dataset.f); };
  $$('.ssx-fl .chip', r).forEach(ch => ch.onclick = () => { $$('.ssx-fl .chip', r).forEach(x => x.classList.toggle('on', x === ch)); paint(ch.dataset.f); });
  // the preview opens the sources once on its own, unless you take over first
  c.auto(1100, () => { if (pill.getAttribute('aria-expanded') === 'false') pill.click(); });
});
/* ---------- Metric insight ---------- */
DM.def('metric-insight', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{spark\}/g, I('spark','xs'));
  const D = {
    7:{ d:[22.8,23.1,22.9,24.6,25.4,25.9,26.3], v:26.3, ch:3.5, t:'Up all week. Most of the gain came from annual plans.' },
    30:{ d:[18.2,18.5,18.1,18.9,18.4,18.7,19.0,18.6,19.2,19.1,18.8,19.4,19.0,19.3,19.1,19.6,19.2,21.8,22.9,23.4,23.1,24.0,23.6,24.4,24.1,24.9,25.2,25.6,25.9,26.3], v:26.3, ch:8.1, t:'Jumped after the pricing page update on Sep 18.' },
    90:{ d:[17.1,17.6,17.4,18.0,17.8,18.3,18.1,18.6,18.2,18.9,19.4,22.1,24.0,25.5,26.3], v:26.3, ch:9.2, t:'Flat for two months, then a clear step up in September.' }
  };
  const ch = $('.mix-ch', r), l = $('.mix-l', r), a = $('.mix-a', r), x = $('.mix-x', r), dot = $('.mix-dot', r), n = $('.mix-n', r), dl = $('.mix-d', r), mk = $('.mix-mk', r);
  let pts = [], cur = 30, val = 0, chg = 0;
  function draw(k){
    const d = D[k].d, lo = Math.min(...d) - 1, hi = Math.max(...d) + 1;
    pts = d.map((v, i) => [i / (d.length - 1) * 300, 86 - (v - lo) / (hi - lo) * 80, v]);
    const p = pts.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ');
    l.setAttribute('d', p); a.setAttribute('d', p + ' L300 90 L0 90 Z');
    // reset to the hidden state without a transition (otherwise it reverses in the same frame and never draws), then draw in
    // the stroke doesn't scale with the stretched chart, so its dashes are measured on screen: use the line's on-screen length
    const sx = ch.clientWidth / 300, sy = ch.clientHeight / 90, len = pts.reduce((t, q, i) => i ? t + Math.hypot((q[0] - pts[i - 1][0]) * sx, (q[1] - pts[i - 1][1]) * sy) : 0, 0);
    [l, a, mk].forEach(e => e.style.transition = 'none'); ch.classList.remove('in'); l.style.strokeDasharray = ''; l.style.setProperty('--len', Math.ceil(len) + 2);
    void ch.offsetWidth; [l, a, mk].forEach(e => e.style.transition = ''); requestAnimationFrame(() => ch.classList.add('in'));
    mk.style.display = k == 30 ? '' : 'none';
    tween(val, D[k].v, 900, v => { val = v; n.textContent = v.toFixed(1) + '%'; });
    tween(chg, D[k].ch, 900, v => { chg = v; dl.textContent = '+' + v.toFixed(1) + ' pts'; });
    swap($('.mix-t', r), D[k].t);
  }
  c.on(ch, 'pointermove', e => { const b = ch.getBoundingClientRect(), fx = (e.clientX - b.left) / b.width * 300; let best = pts[0]; pts.forEach(q => { if (Math.abs(q[0] - fx) < Math.abs(best[0] - fx)) best = q; });
    x.setAttribute('x1', best[0]); x.setAttribute('x2', best[0]); dot.style.left = best[0] / 300 * b.width + 'px'; dot.style.top = best[1] / 90 * b.height + 'px'; n.textContent = best[2].toFixed(1) + '%'; });
  c.on(ch, 'pointerleave', () => n.textContent = D[cur].v.toFixed(1) + '%');
  // once drawn, drop the dashes so a later resize can't cut the line short
  c.on(l, 'transitionend', e => { if (e.propertyName === 'stroke-dashoffset' && ch.classList.contains('in')) l.style.strokeDasharray = 'none'; });
  seg($('.mix-rg', r), v => { cur = +v; draw(cur); });
  $('b', mk).dataset.tip = 'Pricing page update shipped';
  const why = $('.mix-why', r), box = $('.mix-box', r), rs = $('.mix-rs', r);
  why.onclick = () => c.run(async () => {
    if (!box.classList.contains('shut')){ box.classList.add('shut'); why.setAttribute('aria-expanded', 'false'); swap(why, 'Why did it move?'); return; }
    why.innerHTML = '<span class="think on"><i></i><i></i><i></i><i></i></span>Looking into it'; await c.wait(900);
    const R = [['Annual plan shown first', 54, 'var(--accent-mark,var(--accent))'], ['One CTA per card', 27, 'var(--pl)'], ['Seasonal traffic', 12, 'var(--pt)'], ['Unexplained', 7, 'var(--faint)']];
    rs.innerHTML = R.map(q => `<div class="mix-r"><span class="dot" style="color:${q[2]}"></span><span class="t">${q[0]}</span><span class="bar"><i style="width:${q[1]}%;background:${q[2]}"></i></span><span class="v num">${q[1]}%</span></div>`).join('');
    box.classList.remove('shut'); why.setAttribute('aria-expanded', 'true'); stagger($$('.mix-r', rs), 60); swap(why, 'Hide the breakdown');
  });
  c.later(400, () => draw(30));
});
/* ---------- Task table ---------- */
DM.def('task-table', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{pause}', I('pause','xs')).replace('{refresh}', I('refresh','xs')).replace('{x}', I('x','xs'));
  const ST = { run:['Running','<span class="spin"></span>'], done:['Done', I('ok','xs')], fail:['Failed', I('alert','xs')], wait:['Queued','<span class="dot"></span>'], pause:['Paused', I('pause','xs')] };
  const SEED = [
    ['Audit pricing contrast','run','Design','DS','var(--av-b)',0.42,2],
    ['Export tokens to CSS','done','Code','CO','var(--av-m)',0.18,14],
    ['Sync Figma frames','fail','Design','DS','var(--av-b)',0.07,26],
    ['Draft launch email','wait','Writer','WR','var(--av-l)',0,31],
    ['Compare checkout flows','done','Research','RE','var(--av-t)',0.66,48],
    ['Rename layers in Hero','run','Design','DS','var(--av-b)',0.11,5]
  ];
  const seed = () => SEED.map((x, i) => ({ id:i, n:x[0], s:x[1], a:x[2], ai:x[3], ac:x[4], cost:x[5], up:x[6], sel:false }));
  let T = seed();
  const box = $('.ttx', r), tb = $('tbody', r), all = $('.ttx-all', r), sb = $('.ttx-sb', r), sum = $('.ttx-sum', r), cnt = $('.ttx-n', r);
  const ease = getComputedStyle(r).getPropertyValue('--ease').trim() || 'ease';
  const tick = I('check','xs').replace('class="i xs"', 'class="i xs ck-y"') + I('minus','xs').replace('class="i xs"', 'class="i xs ck-m"');
  all.innerHTML = tick;
  $$('.ttx-s', r).forEach(b => b.insertAdjacentHTML('beforeend', `<span class="ar">${I('chev-u','xs')}</span>`));
  let key = 4, desc = false;
  const fields = [t => t.n, t => ['run','fail','wait','pause','done'].indexOf(t.s), t => t.a, t => t.cost, t => t.up];
  const ago = m => m ? m + 'm ago' : 'Just now';
  const face = s => `${ST[s][1]}<span>${ST[s][0]}</span>`, pill = s => `<span class="sv">${face(s)}</span>`;
  // each row is made once and then kept: picking, sorting and actions change it in place, so it can ease between states
  const rows = new Map();
  function make(t){
    const tr = html(`<tr data-id="${t.id}"><td class="ck"><button class="ttx-cb" role="checkbox" aria-checked="false" aria-label="Select ${t.n}">${tick}</button></td><td class="nm">${t.n}</td><td><span class="ttx-st" data-s="${t.s}">${pill(t.s)}</span></td><td><span class="ag">${AV(t.ai, t.ac)}${t.a}</span></td><td class="r num">$${t.cost.toFixed(2)}</td><td class="r num up"><span>${ago(t.up)}</span></td></tr>`);
    tr.onclick = () => { t.sel = !t.sel; sync(); };
    rows.set(t.id, tr); return tr;
  }
  // rows glide to their new places, a short glide from where they are on screen, so sorting again mid-glide carries on
  // from there
  const glideRows = move => reflow(() => [...rows.values()], move, { by:'data-id', root:box, enter:false, leave:false });
  function order(anim){
    const f = fields[key], list = [...T].sort((a, b) => { const x = f(a), y = f(b); return (x > y ? 1 : x < y ? -1 : 0) * (desc ? -1 : 1); });
    const move = () => list.forEach(t => tb.appendChild(rows.get(t.id)));
    anim ? glideRows(move) : move();
    $$('.ttx-s', r).forEach(b => { b.classList.toggle('on', +b.dataset.k === key); b.classList.toggle('desc', desc); b.closest('th').setAttribute('aria-sort', +b.dataset.k === key ? (desc ? 'descending' : 'ascending') : 'none'); });
  }
  let said = '';
  function sync(){
    const n = T.filter(t => t.sel).length;
    T.forEach(t => { const tr = rows.get(t.id); tr.classList.toggle('sel', t.sel); $('.ttx-cb', tr).setAttribute('aria-checked', t.sel); });
    all.setAttribute('aria-checked', n === 0 ? 'false' : n === T.length ? 'true' : 'mixed');
    box.classList.toggle('selecting', n > 0); sb.inert = n === 0; if (n) cnt.textContent = n + ' selected';
    const run = T.filter(t => t.s === 'run').length, line = T.length ? `${T.length} task${T.length === 1 ? '' : 's'}, ${run} running` : 'No tasks';
    if (line !== said){ said ? swap(sum, line) : sum.textContent = line; said = line; }
  }
  const status = (t, s) => { t.s = s; const el = $('.ttx-st', rows.get(t.id)); el.dataset.s = s; el.innerHTML = `<span class="sv ttx-sin">${face(s)}</span>`; };
  // cancelled rows slide away and the rest close up; when nothing is left the table says so
  function leave(ids){
    const out = T.filter(t => ids.includes(t.id)); T = T.filter(t => !ids.includes(t.id));
    // the table's height as it was, for the empty state that takes the last rows' place
    const had = T.length ? 0 : box.getBoundingClientRect().height;
    const go = () => { glideRows(() => out.forEach(t => { rows.get(t.id).remove(); rows.delete(t.id); }));
      if (!T.length) empty(had); sync(); };
    if (REDUCE) return go();
    out.forEach(t => rows.get(t.id).classList.add('ttx-out'));
    c.later(250, go);
  }
  // the empty state keeps the height the table had, centred in it, so the card doesn't shrink to the top of its stage
  function empty(had){
    const tr = html(`<tr class="ttx-empty"><td colspan="6"><div class="ttx-em"><span class="ic">${I('check')}</span><b>No agent tasks</b><span>Everything has finished or been cancelled.</span><button class="pill ghost sm">${I('refresh','xs')}Bring them back</button></div></td></tr>`);
    tb.appendChild(tr); enter(tr);
    const d = had - box.getBoundingClientRect().height, td = tr.firstElementChild;
    if (d > 1){ const cs = getComputedStyle(td); td.style.paddingTop = parseFloat(cs.paddingTop) + d / 2 + 'px'; td.style.paddingBottom = parseFloat(cs.paddingBottom) + d / 2 + 'px'; }
    $('.pill', tr).onclick = e => { e.stopPropagation(); tr.remove(); T = seed(); T.forEach(make); order(false); sync(); stagger([...tb.children], 30); };
  }
  $$('.ttx-s', r).forEach(b => b.onclick = () => { const k = +b.dataset.k; if (k === key) desc = !desc; else { key = k; desc = false; } order(true); });
  all.onclick = () => { const on = all.getAttribute('aria-checked') !== 'true'; T.forEach(t => t.sel = on); sync(); };
  $('.ttx-clr', r).onclick = () => { T.forEach(t => t.sel = false); sync(); };
  $$('.ttx-sb [data-a]', r).forEach(b => b.onclick = () => {
    const a = b.dataset.a, ids = T.filter(t => t.sel).map(t => t.id);
    T.forEach(t => t.sel = false);
    if (a === 'cancel'){ sync(); leave(ids); return; }
    T.forEach(t => { if (!ids.includes(t.id)) return;
      if (a === 'pause' && (t.s === 'run' || t.s === 'wait')) status(t, 'pause');
      if (a === 'retry' && (t.s === 'fail' || t.s === 'pause')){ status(t, 'run'); t.up = 0; swap($('.up span', rows.get(t.id)), ago(0)); } });
    sync(); if (key === 1 || key === 4) c.later(320, () => order(true));
  });
  T.forEach(make); order(false); sync(); stagger([...tb.children], 30);
  // the preview picks two tasks and retries them, unless you start clicking first
  c.auto(1600, () => { if (T.some(t => t.sel)) return; T.forEach(t => t.sel = t.id === 2 || t.id === 5); sync();
    c.auto(1900, () => { if (T.filter(t => t.sel).length === 2) $('.ttx-sb [data-a="retry"]', r).click(); }); });
});
/* ---------- Code viewer ---------- */
DM.def('code-viewer', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{copy}', I('copy'));
  const F = [
    { n:'PlanCard.tsx', t:'re', src:[
      ['<k>import</k> { Button } <k>from</k> <s>"@/ui/button"</s>;',0],
      ['',0],
      ['<k>export function</k> <f>PlanCard</f>({ plan }) {',0],
      ['  <cm>// One CTA per card, annual price first</cm>',1,'The agent removed the second link here. The design review said two CTAs split attention.'],
      ['  <k>return</k> (',0],
      ['    <tg>&lt;Card</tg> <at>padding</at>=<s>"lg"</s><tg>&gt;</tg>',0],
      ['      <tg>&lt;Price</tg> <at>value</at>={plan.annual} <at>was</at>={plan.monthly} <tg>/&gt;</tg>',1,'Shows the monthly price crossed out next to the annual one. This is the change behind the 18% lift.'],
      ['      <tg>&lt;Button</tg> <at>variant</at>=<s>"primary"</s><tg>&gt;</tg>{plan.cta}<tg>&lt;/Button&gt;</tg>',1,'Swapped the custom button for the shared one, so it picks up the library tokens.'],
      ['    <tg>&lt;/Card&gt;</tg>',0],
      ['  );',0],
      ['}',0]
    ]},
    { n:'tokens.css', t:'', src:[
      ['<f>:root</f> {',0],
      ['  --text-muted: <s>#5b6472</s>;',1,'Was #c9cfd8. Contrast on white goes from 2.1 to 5.9, which passes AA.'],
      ['  --radius-card: <s>16px</s>;',0],
      ['  --space-card: <s>24px</s>;',1,'Matched to the 4px grid. Was 18px.'],
      ['}',0]
    ]}
  ];
  const tabs = $('.cvx-tabs', r), code = $('.cvx-code', r), meta = $('.cvx-meta', r);
  tabs.innerHTML = F.map((f, i) => `<button class="cvx-tab" role="tab" data-i="${i}">${f.n}</button>`).join('');
  const hl = s => s.replace(/<(k|s|f|cm|tg|at)>/g, '<span class="$1">').replace(/<\/(k|s|f|cm|tg|at)>/g, '</span>');
  let cur = 0;
  function show(i){
    cur = i; $$('.cvx-tab', tabs).forEach((t, j) => { t.classList.toggle('on', j === i); t.setAttribute('aria-selected', j === i); });
    code.innerHTML = F[i].src.map((l, k) => `<div class="cvx-l${l[1] ? ' new' : ''}" data-k="${k}" role="button" tabindex="0" aria-expanded="false"><span class="n">${k + 1}</span><span class="c">${hl(l[0]) || ' '}</span></div>`).join('');
    stagger($$('.cvx-l', code), 18); meta.innerHTML = `<b>+${F[i].src.filter(l => l[1]).length}</b> changed`;
    // each line is a button, as in React: Enter or Space asks about it too
    $$('.cvx-l', code).forEach(el => { el.onclick = () => ask(el); el.onkeydown = e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); ask(el); } }; });
  }
  // a note opens and closes its own height, so the code around it moves smoothly
  const fold = (n, open) => { const cs = getComputedStyle(n), ease = getComputedStyle(r).getPropertyValue('--ease').trim() || 'ease';
    const full = { height:cs.height, marginTop:cs.marginTop, marginBottom:cs.marginBottom, paddingTop:cs.paddingTop, paddingBottom:cs.paddingBottom, opacity:1, overflow:'hidden' };
    const none = { height:'0px', marginTop:'0px', marginBottom:'0px', paddingTop:'0px', paddingBottom:'0px', opacity:0, overflow:'hidden' };
    return n.animate(open ? [none, full] : [full, none], { duration:REDUCE ? 1 : 420, easing:ease }); };
  function ask(el){
    const k = +el.dataset.k, l = F[cur].src[k], open = el.classList.contains('on');
    $$('.cvx-note:not(.going)', code).forEach(n => { n.classList.add('going'); fold(n, false).onfinish = () => n.remove(); }); $$('.cvx-l', code).forEach(x => { x.classList.remove('on'); x.setAttribute('aria-expanded', 'false'); });
    if (open) return;
    el.classList.add('on'); el.setAttribute('aria-expanded', 'true');
    const note = html(`<div class="cvx-note">${I('spark','xs')}<span><span class="shim">Reading the line</span></span></div>`); el.after(note); fold(note, true);
    c.later(600, () => swap($('span', note), l[2] || 'Unchanged. The agent kept this line as it was.'));
  }
  $$('.cvx-tab', tabs).forEach(t => t.onclick = () => show(+t.dataset.i));
  const cp = $('.cvx-cp', r);
  cp.onclick = () => { const txt = F[cur].src.map(l => l[0].replace(/<[^>]+>/g, '').replace(/&lt;/g,'<').replace(/&gt;/g,'>')).join('\n'); copied(cp, txt); };
  show(0);
  // the preview asks about one line on its own, unless you take over first
  c.auto(1200, () => { if (!$('.cvx-note', code)) ask($$('.cvx-l', code)[6]); });
});
/* ---------- Terminal stream ---------- */
DM.def('terminal-stream', (r, c) => {
  const IC = { term:I('term'), stop:I('stop','xs'), copy:I('copy') };
  r.innerHTML = r.innerHTML.replace(/\{(\w+)\}/g, (m, k) => IC[k] || m);
  const root = $('.tmx', r), body = $('.tmx-body', r), st = $('.tmx-st', r), sv = $('.tmx-sv', r), stop = $('.tmx-stop', r), cp = $('.tmx-cp', r), ff = $('.tmx-ff', r), foot = $('.tmx-f', r);
  // what the agent does: each command with the lines it prints and how long it takes, then the one line where it says what
  // went wrong and the edit that fixes it. [text, tone] marks a line ok (green), bad (red) or mu (grey)
  const F = (n, kb) => 'dist/' + n.padEnd(22) + kb.padStart(6) + ' kB';
  const BUILD = [['> acme-web@2.4.0 build', 'mu'], ['> vite build', 'mu'], 'vite v6.2.1 building for production...', 'transforming...', ['✓ 1284 modules transformed.', 'ok'], 'rendering chunks...', 'computing gzip size...',
    ...[['index.html', '0.46'], ['assets/Home-1c9e.js', '3.12'], ['assets/Pricing-3f9a.js', '12.40'], ['assets/Cart-7b21.js', '9.86'], ['assets/Account-a04d.js', '7.31'], ['assets/Billing-52ce.js', '6.94'],
      ['assets/Bills-e8f3.js', '5.27'], ['assets/Team-0d6a.js', '4.88'], ['assets/Prefs-9a1b.js', '6.02'], ['assets/Docs-44f0.js', '8.15'], ['assets/Search-b7c2.js', '2.96'], ['assets/Modal-61de.js', '1.84'],
      ['assets/Chart-ef09.js', '21.73'], ['assets/Table-3a7e.js', '11.09'], ['assets/Form-c1d4.js', '4.41'], ['assets/Toast-8e2f.js', '1.12'], ['assets/dates-29bb.js', '18.30'], ['assets/vendor-8c1e.js', '98.12'],
      ['assets/index-4f2a.js', '42.31'], ['assets/index-9b7d.css', '18.92']].map(([n, kb]) => F(n, kb)), ['✓ built in 6.1s', 'ok']];
  const S = [
    { cmd:'npm install', ms:1900, out:['added 412 packages in 1.9s', 'found 0 vulnerabilities'] },
    { cmd:'npm run build', ms:6100, out:BUILD },
    { cmd:'npm test', ms:3400, exit:1, out:[['RUN  v3.0.5 ~/acme/web', 'mu'], ['✓ src/lib/cart.test.ts (14 tests)', 'ok'], ['× src/lib/price.test.ts (1 failed)', 'bad'], ['  × formats a yearly price', 'bad'],
      ['    Expected: "$240/yr"', 'ok'], ['    Received: "$240.00/yr"', 'bad'], ['Tests  1 failed | 23 passed (24)', 'bad']] },
    { note:'The test expects whole dollars, but formatPrice always adds cents. Dropping them for round amounts.', ms:1500 },
    { edit:'src/lib/price.ts', add:2, del:1, ms:1500, diff:["- return `$${n.toFixed(2)}/${per}`", '+ const v = Number.isInteger(n) ? String(n) : n.toFixed(2)', '+ return `$${v}/${per}`'] },
    { cmd:'npm test', ms:2900, out:[['✓ src/lib/cart.test.ts (14 tests)', 'ok'], ['✓ src/lib/price.test.ts (10 tests)', 'ok'], ['Tests  24 passed (24)', 'ok']] }
  ];
  // output longer than five lines folds to its last four, behind a button that says how many are hidden
  const TAIL = 4, GAP = 200;
  let vt = 0, halt = false, over = false;
  const log = [], ran = [];
  const clock = ms => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const sec = ms => (ms / 1000).toFixed(1) + ' s';
  // time passes in steps of a quarter second at most, so the clock in the header keeps up; false once Stop is pressed
  const pass = async (ms, each) => {
    for (let t = 0; t < ms;){ if (halt) return false; const d = Math.min(250, ms - t); await c.wait(d); t += d; vt += d; if (!over) sv.textContent = 'Running · ' + clock(vt); each && each(t); }
    return !halt;
  };
  // a command or an edit: what it is on the left, a spinner and its time on the right
  function row(mark, text){
    const el = html(`<div class="tmx-blk" data-s="run"><div class="tmx-cmd"><span class="tmx-p">${mark}</span><span class="tmx-c"></span><span class="tmx-m"><span class="g"><span class="spin"></span></span><span class="t num"></span></span></div></div>`);
    $('.tmx-c', el).textContent = text; body.appendChild(el); enter(el); return el;
  }
  function lines(el){
    const more = html(`<button class="tmx-more" aria-expanded="false" hidden>${I('chev-d','xs')}<span></span></button>`), hid = html('<div class="fold shut"><div class="tmx-o"></div></div>'), tail = html('<div class="tmx-o"></div>');
    const inner = hid.firstElementChild; hid.inert = true; el.append(more, hid, tail);
    const label = () => { const n = inner.children.length, open = !hid.classList.contains('shut'); $('span', more).textContent = open ? 'Show fewer lines' : `Show ${n} more line${n > 1 ? 's' : ''}`; more.setAttribute('aria-expanded', open); };
    more.onclick = () => { hid.inert = hid.classList.toggle('shut'); label(); };
    return ([text, tone]) => {
      const l = document.createElement('div'); l.className = 'tmx-l' + (tone ? ' ' + tone : ''); l.textContent = text; tail.appendChild(l);
      if (inner.children.length + tail.children.length > TAIL + 1) while (tail.children.length > TAIL) inner.appendChild(tail.firstElementChild);
      if (inner.children.length){ more.hidden = false; label(); }
    };
  }
  const halted = el => { $('.tmx-m .g', el).innerHTML = '<span class="tag">Stopped</span>'; el.dataset.s = 'stop'; };
  function finish(how){
    over = true; stop.hidden = true; root.classList.remove('live');
    st.classList.toggle('ok', how === 'passed'); st.classList.toggle('bad', how === 'failed'); $('.g', st).innerHTML = I(how === 'passed' ? 'check' : 'stop', 'xs'); sv.textContent = how === 'passed' ? 'Passed' : how === 'failed' ? 'Failed' : 'Stopped';
    // each command counts once, however many times it ran
    const n = new Set(ran).size;
    $('.tmx-fs', foot).textContent = `${n} command${n === 1 ? '' : 's'} · ${clock(vt)} · ${how}`;
    foot.className = 'tmx-f' + (how === 'stopped' ? ' stop' : how === 'failed' ? ' bad' : ''); $('.g', foot).innerHTML = I(how === 'passed' ? 'ok' : how === 'failed' ? 'alert' : 'stop');
    ff.classList.remove('shut');
  }
  // new output keeps the log on its newest line, unless the person has scrolled up to read; then it stays where they are
  let pinned = true;
  const stick = () => { if (pinned) body.scrollTop = body.scrollHeight; };
  c.on(body, 'scroll', () => { pinned = body.scrollTop + body.clientHeight >= body.scrollHeight - 24; });
  const mo = new MutationObserver(stick); mo.observe(body, { childList:true, subtree:true }); c.offs.push(() => mo.disconnect());
  const ro = new ResizeObserver(stick); ro.observe(body); c.offs.push(() => ro.disconnect());
  stop.onclick = () => { halt = true; };
  cp.onclick = () => copied(cp, log.join('\n'));
  root.classList.add('live');
  c.run(async () => {
    let last = 0;
    for (const k of S){
      if (!await pass(GAP)) return finish('stopped');
      if (k.note){
        const n = html(`<div class="tmx-note">${I('spark','xs')}<span class="shim"></span></div>`), w = $('span', n); w.textContent = k.note; body.appendChild(n); enter(n); log.push('# ' + k.note);
        const ok = await pass(k.ms); w.classList.remove('shim');
        if (!ok) return finish('stopped');
        continue;
      }
      if (k.edit){
        const el = row(I('edit','xs'), 'Edit ' + k.edit); el.dataset.s = 'edit';
        if (!await pass(k.ms)){ halted(el); return finish('stopped'); }
        $('.tmx-m', el).innerHTML = `<span class="add">+${k.add}</span><span class="del">−${k.del}</span>`; log.push(`# Edited ${k.edit} (+${k.add} −${k.del})`);
        const df = document.createElement('div'); df.className = 'tmx-df';
        k.diff.forEach((d, i) => { const l = document.createElement('div'); l.className = d[0] === '+' ? 'a' : d[0] === '-' ? 'd' : ''; l.textContent = d; df.appendChild(l); enter(l, i * 90); });
        el.appendChild(df); log.push(...k.diff);
        continue;
      }
      const el = row('$', k.cmd), t = $('.tmx-m .t', el), add = lines(el), per = k.ms / k.out.length;
      ran.push(k.cmd); log.push('$ ' + k.cmd); t.textContent = sec(0);
      let at = 0;
      for (const ln of k.out){
        const ok = await pass(per, d => { t.textContent = sec(at + d); }); at += per;
        if (!ok){ add(['^C', 'mu']); log.push('^C'); halted(el); return finish('stopped'); }
        const pair = Array.isArray(ln) ? ln : [ln, '']; add(pair); log.push(pair[0]);
      }
      t.textContent = sec(k.ms); last = k.exit || 0;
      $('.tmx-m .g', el).innerHTML = k.exit ? `<span class="tag bad">Exit ${k.exit}</span>` : `<span class="ok">${I('check','xs')}</span>`; el.dataset.s = k.exit ? 'bad' : 'ok';
    }
    finish(last ? 'failed' : 'passed');
  });
  // the preview's story: the agent runs, fails a test, fixes it and passes; then the person copies the whole run
  c.story(async s => {
    await s.until(() => over);
    await s.beat(2);
    await s.tap(cp); await s.beat(3);
  });
});
/* ---------- Details panel ---------- */
DM.def('details-panel', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{link}', I('link','xs')).replace(/\{chev\}/g, I('chev-r','xs')).replace('{chevd}', I('chev-d','xs')).replace('{plus}', I('plus','xs'))
    .replace(/\{avm\}/g, AV('MK','var(--av-l)')).replace('{avj}', AV('JO','var(--av-m)')).replace('{ava}', AV('DA','var(--av-b)'));
  const flash = el => { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); };
  $$('.pop', r).forEach(pp => $('.dtp', r).appendChild(pp));
  $$('.dtp-sh', r).forEach(b => b.onclick = () => { const f = b.nextElementSibling, open = f.classList.toggle('shut') === false; b.setAttribute('aria-expanded', open); });
  $$('.dtp-pst .mi', r).forEach(m => m.addEventListener('click', () => { const v = $('.dtp-stat', r); $('.dot', v).style.color = m.dataset.col; swap($('span:last-child', v), m.dataset.s); flash(v); }));
  $$('.dtp-pow .mi', r).forEach(m => m.addEventListener('click', () => { const v = $('.dtp-own', r); const av = $('.av', v); av.textContent = m.dataset.i; av.style.background = m.dataset.col; av.style.color = m.dataset.col.replace(')', '-ink)'); enter(av); swap($('span:last-child', v), m.dataset.o); flash(v); }));
  const cost = { Opus:[184200, 2.76], Sonnet:[184200, .55], Haiku:[184200, .15] }; let cc = 0, ct = 0;
  const setM = m => { tween(ct, cost[m][0], 800, v => { ct = v; $('.dtp-tok', r).textContent = Math.round(v).toLocaleString('en-US'); }); tween(cc, cost[m][1], 800, v => { cc = v; $('.dtp-cost', r).textContent = '$' + v.toFixed(2); }); };
  $$('.dtp-pmo .mi', r).forEach(m => m.addEventListener('click', () => { const v = $('.dtp-mo', r); swap(v, m.dataset.m); flash(v.parentElement); setM(m.dataset.m); }));
  const labels = [['Q4','y'],['A/B test','t'],['Urgent','r']]; let li = 0;
  $('.dtp-add', r).onclick = e => { if (li >= labels.length) return; const t = html(`<span class="tag ${labels[li][1]}">${labels[li][0]}</span>`); e.currentTarget.before(t); enter(t); li++; };
  const cp = $('.dtp-cp', r); cp.onclick = () => copied(cp, 'run_8f2a');
  // the run's tokens and cost count up once it has entered, unless a model you picked is counting already
  c.later(700, () => { if (!ct) setM('Opus'); });
});
/* ---------- Citation hover card ---------- */
DM.def('citation-hover', (r, c) => {
  const S = [
    ['B','#4a5a8a','baymard.com','Pricing page UX benchmark','Of 64 SaaS sites tested, those leading with the annual plan saw <mark>a 12 to 20% higher trial to paid rate</mark> than monthly first layouts.','Read 4 days ago'],
    ['C','#d9480f','cxl.com','Price anchoring in plan selection','When the monthly price stayed visible with a strike through, <mark>annual selection rose by a further 9 points</mark> in the anchored group.','Read 4 days ago'],
    ['CSV','var(--pm)','Drive','Q3 conversion export.csv','Rows 412 to 480: <mark>trial to paid moves from 18.6% to 26.3%</mark> between Sep 18 and Oct 17.','Your file']
  ];
  const card = $('.chx-card', r), inn = $('.chx-in', r), box = $('.chx', r), cites = $$('.chx-c', r);
  let cur = null, hideT, showT, back = false;
  /* the card exists only while a citation (or the card itself) is under the pointer */
  function show(b){
    clearTimeout(hideT); if (cur === b) return;
    const s = S[+b.dataset.i]; cur = b;
    cites.forEach(x => x.classList.toggle('on', x === b));
    inn.innerHTML = `<div class="chx-sh"><span class="fv" style="background:${s[1]}">${s[0][0]}</span><span>${s[2]}</span></div><div class="chx-t">${s[3]}</div><div class="chx-q">${s[4]}</div><div class="chx-f"><span>${s[5]}</span><a href="#" onclick="return false">Open source ${I('ext','xs')}</a></div>`;
    /* restart the entry each time, so it always rises from below in place and never slides sideways */
    card.classList.remove('show'); void card.offsetWidth;
    const br = box.getBoundingClientRect(), cr = b.getBoundingClientRect();
    const x = Math.max(0, Math.min(cr.left - br.left - 24, br.width - card.offsetWidth));
    card.style.left = x + 'px'; card.style.top = (cr.bottom - br.top + 8) + 'px';
    card.classList.add('show');
  }
  function hide(now){
    clearTimeout(hideT); clearTimeout(showT);
    const go = () => { card.classList.remove('show'); cur = null; cites.forEach(x => x.classList.remove('on')); };
    if (now) go(); else hideT = setTimeout(go, 140);
  }
  /* pointing at a citation shows its card, leaving it (and the card) hides it; focus shows it too, so the keyboard gets the
     same card. Touch has no hover: a tap shows the card, the next tap anywhere else hides it */
  const hover = e => e.pointerType !== 'touch';
  cites.forEach(b => {
    c.on(b, 'pointerenter', e => { if (!hover(e)) return; clearTimeout(showT); clearTimeout(hideT); showT = setTimeout(() => show(b), cur ? 0 : 90); });
    c.on(b, 'pointerleave', e => { if (!hover(e)) return; clearTimeout(showT); hide(); });
    c.on(b, 'focus', () => { if (back){ back = false; return; } show(b); }); c.on(b, 'blur', e => { if (!card.contains(e.relatedTarget)) hide(); });
    // Enter or Space opens the card with the focus on its link, so the keyboard can reach it; Escape brings the focus back
    c.on(b, 'click', e => { if (cur !== b) show(b); if (e.isTrusted && !e.detail){ const a = $('a', card); if (a) a.focus({ preventScroll:true }); } });
  });
  c.on(card, 'pointerenter', () => clearTimeout(hideT));
  c.on(card, 'pointerleave', e => { if (hover(e)) hide(); });
  c.on(card, 'focusout', e => { if (cur && !card.contains(e.relatedTarget) && e.relatedTarget !== cur) hide(); });
  /* Escape puts the card away while the focus or the pointer is on the answer, and leaves the focus where it was, or on its
     citation when it was in the card */
  c.on(document, 'keydown', e => { if (e.key === 'Escape' && cur && (box.contains(document.activeElement) || box.matches(':hover'))){ e.preventDefault(); const to = card.contains(document.activeElement) && cur; hide(true); if (to){ back = true; to.focus({ preventScroll:true }); } } });
  c.on(document, 'pointerdown', e => { if (!card.contains(e.target) && !e.target.closest('.chx-c')) hide(true); });
  c.on(window, 'resize', e => { if (e.isTrusted) hide(true); });
  c.offs.push(() => { clearTimeout(hideT); clearTimeout(showT); });
  // the preview shows one card on its own after the entrance, then puts it away, unless you are already pointing at a citation
  let mine = false; c.on(r, 'pointerover', e => { if (e.isTrusted) mine = true; }, true);
  c.run(async () => { await c.wait(1400); if (mine || cur) return; show(cites[0]); await c.wait(2800); if (!mine && cur === cites[0]) hide(); });
});
/* ---------- Field extraction ---------- */
DM.def('field-extraction', (r, c) => {
  const F = [['no','Invoice no.','NW-2041',.99],['date','Issued','2026-10-03',.97],['total','Total','$11,480.00',.98],['due','Due by','2026-11-1?',.41]];
  const list = $('.fex-list', r), st = $('.fex-st', r), go = $('.fex-go', r), doc = $('.fex-doc', r), pg = $('.fex-pg', r);
  const z = k => $(`.fex-z[data-z="${k}"]`, r);
  function row(f){
    const warn = f[3] < .6;
    const el = html(`<div class="fex-r${warn ? ' warn' : ''}" data-k="${f[0]}"><span class="k">${f[1]}</span><span class="v num">${f[2]}</span><span class="fex-cf">${warn ? `<button class="fex-fix" data-tip="${Math.round(f[3] * 100)}% sure, check it">${I('edit','xs')}Check</button>` : `<i><b style="width:${f[3] * 100}%"></b></i>${Math.round(f[3] * 100)}%`}</span></div>`);
    if (warn) z(f[0]).classList.add('warn');
    el.onmouseenter = () => z(f[0]).classList.add('hl'); el.onmouseleave = () => z(f[0]).classList.remove('hl');
    const fx = $('.fex-fix', el);
    if (fx) fx.onclick = () => { const v = $('.v', el); v.contentEditable = 'true'; v.textContent = '2026-11-1'; v.focus({ preventScroll:true }); const s = document.getSelection(); s.selectAllChildren(v); s.collapseToEnd(); z(f[0]).classList.add('hl'); swap(st, 'Type the day you see');
      const done = () => { v.contentEditable = 'false'; z(f[0]).classList.remove('hl', 'warn'); el.classList.remove('warn'); const cf = $('.fex-cf', el); cf.innerHTML = `<i><b style="width:100%"></b></i>Fixed`; enter(cf); go.disabled = false; swap(st, 'All fields confirmed'); };
      v.onkeydown = e => { if (e.key === 'Enter'){ e.preventDefault(); if (!/\d\d$/.test(v.textContent)) v.textContent = '2026-11-14'; done(); } }; v.onblur = () => { if (v.isContentEditable){ if (!/\d\d$/.test(v.textContent)) v.textContent = '2026-11-14'; done(); } }; };
    return el;
  }
  go.onclick = () => c.run(async () => { go.innerHTML = '<span class="spin"></span>'; await c.wait(800); go.innerHTML = I('check','xs') + 'Added to Invoices'; go.className = 'pill soft sm fex-go'; swap(st, '1 row added to Invoices 2026'); });
  c.run(async () => {
    const beam = html('<div class="fex-beam"></div>'); doc.appendChild(beam); await c.wait(300); beam.classList.add('go');
    for (const f of F){ await c.wait(560); const zz = z(f[0]); zz.classList.add('scan'); const el = row(f); list.appendChild(el); enter(el); c.later(500, () => zz.classList.remove('scan')); }
    await c.wait(400); swap(st, '1 field needs a look');
  });
});