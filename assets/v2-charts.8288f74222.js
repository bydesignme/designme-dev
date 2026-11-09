TPLS["account-table"] = "<div class=\"atb panel\">\n  <div class=\"atb-h\"><div class=\"atb-s\">{search}<input placeholder=\"Search accounts\" aria-label=\"Search accounts\"></div><div class=\"atb-fl\"><button class=\"chip sm on\" data-p=\"\">All</button><button class=\"chip sm\" data-p=\"Team\">Team</button><button class=\"chip sm\" data-p=\"Pro\">Pro</button><button class=\"chip sm\" data-p=\"Enterprise\">Enterprise</button></div></div>\n  <div class=\"atb-sc\"><table><thead><tr><th>Account</th><th>Plan</th><th>Seats</th><th>Health</th><th class=\"r\">MRR</th></tr></thead><tbody></tbody></table></div>\n</div>";
TPLS["stat-cards"] = "<div class=\"scx\">\n  <div class=\"scx-h\"><div class=\"seg2 scx-sg\" role=\"group\" aria-label=\"Period\"><button aria-pressed=\"false\" data-v=\"0\">7 days</button><button aria-pressed=\"true\" data-v=\"1\">30 days</button><button aria-pressed=\"false\" data-v=\"2\">Quarter</button></div></div>\n  <div class=\"scx-grid\"></div>\n</div>";
TPLS["activity-heatmap"] = "<div class=\"hmx panel\">\n  <div class=\"hmx-h\"><div><b>Activity</b><span class=\"muted hmx-st\">Last 4 weeks</span></div><div class=\"seg2 hmx-sg\" role=\"group\" aria-label=\"Who\"><button aria-pressed=\"true\" data-v=\"agent\">Agent</button><button aria-pressed=\"false\" data-v=\"team\">Team</button></div></div>\n  <div class=\"hmx-wrap\"><div class=\"hmx-sc\"><div class=\"hmx-days muted\"><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span><span>Sun</span></div><div class=\"hmx-grid\"></div>\n  <div class=\"hmx-f muted\"><span class=\"hmx-ax\">12am</span><span class=\"hmx-ax x\">3am</span><span class=\"hmx-ax\">6am</span><span class=\"hmx-ax x\">9am</span><span class=\"hmx-ax\">12pm</span><span class=\"hmx-ax x\">3pm</span><span class=\"hmx-ax\">6pm</span><span class=\"hmx-ax x\">9pm</span></div></div></div>\n  <div class=\"hmx-lg muted\">Less<i style=\"--a:.08\"></i><i style=\"--a:.3\"></i><i style=\"--a:.55\"></i><i style=\"--a:.85\"></i>More</div>\n</div>";
TPLS["scatter-chart"] = "<div class=\"cvq panel\">\n  <div class=\"cvq-h\">\n    <div class=\"cvq-t\"><b>Cost vs quality</b><span class=\"muted\">48 runs this week, sized by tokens</span></div>\n    <div class=\"cvq-lg\"></div>\n  </div>\n  <div class=\"cvq-pl\" tabindex=\"0\" role=\"group\" aria-roledescription=\"scatter chart\" aria-label=\"Runs by cost and eval score. Arrow keys step through the runs\">\n    <svg class=\"cvq-svg\" aria-hidden=\"true\"></svg>\n    <div class=\"cvq-tt\"><b class=\"num\"></b><span></span></div>\n  </div>\n  <div class=\"cvq-ft\" aria-live=\"polite\"><span class=\"cvq-msg\"></span></div>\n</div>";
TPLS["radar-chart"] = "<div class=\"rdx panel\">\n  <div class=\"rdx-h\">\n    <div class=\"rdx-t\"><b>Eval scores</b><span class=\"muted\">Run 48 against run 41</span></div>\n    <div class=\"rdx-lg\"><button class=\"rdx-k\" aria-pressed=\"true\" data-s=\"cur\"><i class=\"c\"></i>This run</button><button class=\"rdx-k\" aria-pressed=\"true\" data-s=\"base\"><i class=\"b\"></i>Baseline</button></div>\n  </div>\n  <div class=\"rdx-ch\" role=\"group\" aria-label=\"Scores by axis. Left and Right move between axes\">\n    <svg class=\"rdx-svg\" aria-hidden=\"true\"></svg>\n    <span class=\"rdx-avg num\"><b>0</b><span class=\"muted\">average</span></span>\n  </div>\n  <div class=\"rdx-ro\" aria-live=\"polite\"><span></span></div>\n</div>";
TPLS["score-breakdown"] = "<div class=\"sbx panel\">\n  <div class=\"sbx-top\">\n    <div class=\"sbx-g\" role=\"meter\" aria-label=\"Quality score\" aria-valuemin=\"0\" aria-valuemax=\"100\"><svg viewBox=\"0 0 200 108\" aria-hidden=\"true\"></svg><div class=\"sbx-v\"><b class=\"num\">0</b><span class=\"muted\">of 100</span></div></div>\n    <div class=\"sbx-s\"><b>Support agent quality</b><span class=\"sbx-band\"><span class=\"muted sbx-bw\">Scoring</span><span class=\"tag ok num sbx-ch\" hidden></span></span></div>\n  </div>\n  <div class=\"sbx-list\"></div>\n</div>";
TPLS["health-score"] = "<div class=\"hsc-dm dm\"><div class=\"dm-main\">\n  <div class=\"hsc panel\" role=\"group\" aria-label=\"Account health\">\n    <div class=\"hsc-ac\"><b></b><span></span></div>\n    <div class=\"hsc-h\">\n      <div class=\"hsc-ring\" role=\"img\" aria-label=\"Health score\"><svg viewBox=\"0 0 44 44\" aria-hidden=\"true\"><circle class=\"tr\" cx=\"22\" cy=\"22\" r=\"18\"/><circle class=\"fl\" cx=\"22\" cy=\"22\" r=\"18\" stroke-dasharray=\"113.1\" stroke-dashoffset=\"113.1\"/></svg><b class=\"num\" aria-hidden=\"true\">0</b></div>\n      <div class=\"hsc-ht\"><b class=\"hsc-vd\"></b><span class=\"hsc-sub\"></span></div>\n      <span class=\"hsc-dl num\"></span>\n    </div>\n    <div class=\"hsc-l\"></div>\n    <div class=\"hsc-s\">{spark}<span class=\"hsc-st\"></span><button type=\"button\" class=\"pill primary sm hsc-go\"></button></div>\n    <p class=\"hsc-sr\" aria-live=\"polite\"></p>\n  </div>\n  </div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Account\"><button aria-pressed=\"false\" data-v=\"0\">Healthy</button><button aria-pressed=\"true\" data-v=\"1\">Watch</button><button aria-pressed=\"false\" data-v=\"2\">At risk</button></div></div>\n</div>";
TPLS["top-pages"] = "<div class=\"tpx panel\">\n  <div class=\"tpx-h\"><div><b>Top pages</b><span class=\"muted tpx-sub\"><span class=\"num tpx-tot\">0</span> views, last 30 days</span></div><div class=\"seg2 tpx-sg\" role=\"group\" aria-label=\"Sort\"><button aria-pressed=\"true\" data-v=\"v\">Views</button><button aria-pressed=\"false\" data-v=\"c\">Change</button></div></div>\n  <div class=\"tpx-list\"></div>\n</div>";
TPLS["funnel"] = "<div class=\"fnx panel\">\n  <div class=\"fnx-h\"><b>Signup to paid</b><div class=\"seg2 fnx-sg\" role=\"group\" aria-label=\"Segment\"><button aria-pressed=\"true\" data-v=\"all\">All</button><button aria-pressed=\"false\" data-v=\"team\">Teams</button><button aria-pressed=\"false\" data-v=\"solo\">Solo</button></div></div>\n  <div class=\"fnx-rows\"></div>\n  <div class=\"fnx-ins\"><span class=\"fnx-ic\">{spark}</span><span class=\"fnx-t\"></span></div>\n</div>";
TPLS["radial-goals"] = "<div class=\"rgx panel\">\n  <div class=\"rgx-h\">\n    <div class=\"rgx-t\"><b>Agent goals</b><span class=\"muted rgx-sub\">This week</span></div>\n    <div class=\"seg2 rgx-sg\" role=\"group\" aria-label=\"Range\"><button aria-pressed=\"true\" data-v=\"w\">Week</button><button aria-pressed=\"false\" data-v=\"m\">Month</button></div>\n  </div>\n  <div class=\"rgx-b\">\n    <div class=\"rgx-ring\"><svg viewBox=\"0 0 180 180\" aria-hidden=\"true\"></svg><div class=\"rgx-c\"><b class=\"num\">0%</b><span class=\"muted\">of targets</span></div></div>\n    <div class=\"rgx-lg\"></div>\n  </div>\n  <div class=\"rgx-sr\"><table><caption>Agent goals</caption><thead><tr><th>Agent</th><th>Done</th><th>Target</th><th>Share</th></tr></thead><tbody></tbody></table></div>\n</div>";
TPLS["donut-chart"] = "<div class=\"dnx panel\">\n  <div class=\"dnx-ring\"><svg viewBox=\"0 0 120 120\"></svg><div class=\"dnx-c\"><b class=\"num dnx-v\">0h</b><span class=\"muted dnx-l\">Agent time</span></div></div>\n  <div class=\"dnx-lg\"></div>\n</div>";
TPLS["bar-chart"] = "<div class=\"bcx panel\">\n  <div class=\"bcx-h\"><div><span class=\"muted\">Agent runs</span><b class=\"num bcx-v\">0</b></div><div class=\"seg2 bcx-rg\" role=\"group\" aria-label=\"Range\"><button aria-pressed=\"true\" data-v=\"w\">Week</button><button aria-pressed=\"false\" data-v=\"m\">Month</button></div></div>\n  <div class=\"bcx-ch\"></div>\n</div>";
TPLS["line-chart"] = "<div class=\"lnx panel\">\n  <div class=\"lnx-h\"><div><span class=\"muted\">Active editors</span><b class=\"num lnx-v\">0</b></div><div class=\"lnx-lg\"><button class=\"lnx-k on\" data-s=\"0\"><i style=\"background:var(--accent-mark,var(--accent))\"></i>This year</button><button class=\"lnx-k on\" data-s=\"1\"><i style=\"background:var(--c2)\"></i>Last year</button></div></div>\n  <div class=\"lnx-ch\"><svg class=\"lnx-svg\" viewBox=\"0 0 320 140\" preserveAspectRatio=\"none\"></svg><div class=\"lnx-x\"></div><div class=\"lnx-tt\"><b class=\"num\"></b><span></span></div></div>\n  <div class=\"lnx-ax muted num\"><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span></div>\n</div>";

/* ---------- Line chart ---------- */
DM.def('line-chart', (r, c) => {
  const A = [820,860,910,980,1040,1130,1210,1180,1320,1460,1540,1620], B = [610,640,660,700,690,760,800,790,850,880,910,960];
  const MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const svg = $('.lnx-svg', r), ch = $('.lnx-ch', r), x = $('.lnx-x', r), tt = $('.lnx-tt', r), v = $('.lnx-v', r);
  const lo = 500, hi = 1700, P = s => s.map((d, i) => [i / 11 * 320, 136 - (d - lo) / (hi - lo) * 128]);
  const smooth = p => p.map((q, i) => { if (!i) return `M${q[0]} ${q[1]}`; const a = p[i - 1], m = (q[0] - a[0]) / 2; return `C${a[0] + m} ${a[1]} ${q[0] - m} ${q[1]} ${q[0]} ${q[1]}`; }).join(' ');
  const pa = P(A), pb = P(B);
  svg.innerHTML = `<defs><linearGradient id="lng" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent-mark,var(--accent))" stop-opacity=".16"/><stop offset="1" stop-color="var(--accent-mark,var(--accent))" stop-opacity="0"/></linearGradient><clipPath id="lnc"><rect class="lnr" x="0" y="-10" width="0" height="160"/></clipPath></defs>` +
    [35, 70, 105].map(y => `<line class="gl" x1="0" x2="320" y1="${y}" y2="${y}"/>`).join('') +
    `<g clip-path="url(#lnc)"><path class="ar" d="${smooth(pa)} L320 140 L0 140 Z" fill="url(#lng)"/><path class="ln l1" d="${smooth(pb)}" stroke="var(--c2)" stroke-dasharray="4 4"/><path class="ln l0" d="${smooth(pa)}" stroke="var(--accent-mark,var(--accent))"/></g>`;
  ch.insertAdjacentHTML('beforeend', '<span class="lnx-pt on" style="color:var(--accent-mark,var(--accent))"></span><span class="lnx-pt on" style="color:var(--c2)"></span>');
  const pts = $$('.lnx-pt', ch), on = [true, true];
  // the line draws and the number counts once the chart has risen into view, so the draw is seen from its start
  v.textContent = '0';
  c.later(260, () => {
    tween(0, 320, 1300, w => $('.lnr', svg).setAttribute('width', w), t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    tween(0, A[11], 1300, n => v.textContent = Math.round(n).toLocaleString('en-US'));
  });
  c.on(ch, 'pointermove', e => { const b = ch.getBoundingClientRect(); const i = Math.max(0, Math.min(11, Math.round((e.clientX - b.left) / b.width * 11))); const px = i / 11 * b.width;
    x.style.left = px + 'px'; tt.style.left = Math.max(50, Math.min(px, b.width - 50)) + 'px';
    [pa, pb].forEach((p, k) => { pts[k].style.left = px + 'px'; pts[k].style.top = p[i][1] / 140 * b.height + 'px'; pts[k].classList.toggle('on', on[k]); });
    $('b', tt).textContent = (on[0] ? A[i].toLocaleString('en-US') : B[i].toLocaleString('en-US')) + ' editors'; const dv = Math.round((A[i] / B[i] - 1) * 100); $('span', tt).textContent = MO[i] + (on[0] && on[1] ? ', ' + (dv < 0 ? '−' : '+') + Math.abs(dv) + '% vs last year' : '');
    v.textContent = (on[0] ? A[i] : B[i]).toLocaleString('en-US'); });
  c.on(ch, 'pointerleave', () => v.textContent = (on[0] ? A[11] : B[11]).toLocaleString('en-US'));
  $$('.lnx-k', r).forEach(k => k.onclick = () => { const s = +k.dataset.s; if (on[s] && !on[1 - s]) return; on[s] = !on[s]; k.classList.toggle('on', on[s]); $('.l' + s, svg).classList.toggle('off', !on[s]); if (s === 0) $('.ar', svg).style.opacity = on[0] ? 1 : 0;
    // the big number rolls to the latest value of the line that is showing
    const from = +v.textContent.replace(/,/g, ''), to = on[0] ? A[11] : B[11]; if (from !== to) tween(from, to, 600, n => v.textContent = Math.round(n).toLocaleString('en-US')); });
});
/* ---------- Bar chart ---------- */
DM.def('bar-chart', (r, c) => {
  const D = {
    w:{ l:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], d:[[42,9,2],[51,12,3],[48,8,1],[63,10,4],[57,14,2],[18,3,0],[12,2,1]] },
    m:{ l:['W1','W2','W3','W4','W5','W6','W7'], d:[[180,40,9],[210,44,12],[236,51,8],[262,48,10],[251,39,6],[298,52,7],[321,47,5]] }
  };
  const ch = $('.bcx-ch', r), v = $('.bcx-v', r); let tot = 0;
  ch.innerHTML = D.w.l.map(() => `<div class="bcx-b"><div class="bcx-tt"><b class="num"></b><span></span></div><div class="bcx-st"><i></i></div><div class="bcx-l"></div></div>`).join('');
  const bars = $$('.bcx-b', ch);
  function draw(k){
    const d = D[k], mx = Math.max(...d.d.map(x => x[0] + x[1] + x[2])) * 1.08, H = ch.clientHeight - 22;
    bars.forEach((b, i) => { const x = d.d[i], s = x[0] + x[1] + x[2];
      c.later(i * 45, () => { $('.bcx-st i', b).style.height = Math.max(s ? 3 : 0, s / mx * H) + 'px'; });
      $('.bcx-l', b).textContent = d.l[i]; $('.bcx-tt b', b).textContent = s + ' runs'; $('.bcx-tt span', b).textContent = `${x[0]} shipped, ${x[1]} reviewed, ${x[2]} failed`; });
    const t = d.d.reduce((a, x) => a + x[0] + x[1] + x[2], 0); tween(tot, t, 900, n => { tot = n; v.textContent = Math.round(n).toLocaleString('en-US'); });
  }
  seg($('.bcx-rg', r), draw);
  c.later(280, () => draw('w'));
});
/* ---------- Donut chart ---------- */
DM.def('donut-chart', (r, c) => {
  const D = [['Design reviews',14.2,'var(--c1)'],['Code changes',9.6,'var(--c2)'],['Research',6.1,'var(--c3)'],['Copy edits',3.4,'var(--c4)'],['Other',1.7,'var(--faint)']];
  const tot = D.reduce((a, d) => a + d[1], 0), C = 2 * Math.PI * 48, gap = 2;
  const svg = $('svg', r), lg = $('.dnx-lg', r), ring = $('.dnx-ring', r), v = $('.dnx-v', r), l = $('.dnx-l', r);
  let off = 0;
  svg.innerHTML = D.map((d, i) => { const len = d[1] / tot * C; const s = `<circle cx="60" cy="60" r="48" stroke="${d[2]}" stroke-dasharray="0 ${C}" stroke-dashoffset="${-off}" data-i="${i}" data-len="${len - gap}"/>`; off += len; return s; }).join('');
  lg.innerHTML = D.map((d, i) => `<div class="dnx-r" data-i="${i}"><i style="background:${d[2]}"></i><span class="t">${d[0]}</span><span class="v num">${d[1]}h · ${Math.round(d[1] / tot * 100)}%</span></div>`).join('');
  const arcs = $$('circle', svg), rows = $$('.dnx-r', lg);
  const hl = i => { ring.classList.toggle('hov', i != null); arcs.forEach((a, j) => a.classList.toggle('hl', j === i)); rows.forEach((x, j) => x.classList.toggle('hl', j === i));
    if (i == null){ v.textContent = tot.toFixed(1) + 'h'; l.textContent = 'Agent time'; } else { v.textContent = D[i][1] + 'h'; l.textContent = D[i][0]; } };
  [...arcs, ...rows].forEach(el => { el.onmouseenter = () => hl(+el.dataset.i); el.onmouseleave = () => hl(null); });
  stagger(rows, 60, 150);
  v.textContent = '0.0h';
  c.later(260, () => { arcs.forEach((a, i) => c.later(i * 90, () => a.setAttribute('stroke-dasharray', `${a.dataset.len} ${C}`))); tween(0, tot, 1200, n => v.textContent = n.toFixed(1) + 'h'); });
});
/* ---------- Funnel ---------- */
DM.def('funnel', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{spark}', I('spark','xs'));
  const K = ['Signed up','Opened a file','Ran the agent','Invited a teammate','Paid'];
  const D = {
    all:{ n:[12400,9180,6420,2310,1490], t:'The biggest drop is after the first agent run. 64% never invite a teammate.' },
    team:{ n:[4100,3570,2980,1890,1210], t:'Teams convert well. Most drop off at payment, so the plan page matters most here.' },
    solo:{ n:[8300,5610,3440,420,280], t:'Solo users rarely invite anyone. Try a paid plan that does not need a team.' }
  };
  const rows = $('.fnx-rows', r), txt = $('.fnx-t', r);
  // the bars and counts move with the animations below rather than CSS transitions, so only the hover dim and the
  // count's colour keep a transition here
  rows.innerHTML = K.map((k, i) => `<div class="fnx-r" style="--fc:color-mix(in oklab,var(--c1) ${100 - i * 25}%,var(--c2))"><span class="k">${k}</span><div class="tr"><div class="bar" style="width:0;transition:opacity .3s"></div><span class="n num" style="transition:color .3s"></span></div><span class="v num"></span></div>`).join('');
  const R = $$('.fnx-r', rows);
  /* every draw writes the finished chart at once and the motion only plays over it: each bar and count glides from where
     it is to where it ends, on the page's clock. So the settled chart shows whatever happens on the way: a replay half
     way, a stop, or the card scrolling far off screen (where the homepage stops drawing it) and back */
  const glide = (el, prop, to, delay) => {
    const from = getComputedStyle(el)[prop]; if (el._g) el._g.cancel();
    el.style[prop] = to; el._g = null;
    if (REDUCE || from === getComputedStyle(el)[prop]) return;
    el._g = el.animate([{ [prop]:from }, { [prop]:to }], { duration:900, delay, easing:getComputedStyle(r).getPropertyValue('--ease').trim() || 'ease', fill:'backwards' });
  };
  // the note crossfades on a switch; the newest note is the one that lands, however quickly the segments change
  let note = 0;
  const say = t => { const id = ++note; if (txt.textContent === t && !txt.classList.contains('out')) return; txt.classList.add('sw', 'out'); setTimeout(() => { if (id !== note) return; txt.textContent = t; txt.classList.remove('out'); }, REDUCE ? 0 : 170); };
  function draw(s, wait = 0){
    const d = D[s].n; let worst = 1, wv = 1;
    d.forEach((n, i) => { if (i && n / d[i - 1] < wv){ wv = n / d[i - 1]; worst = i; } });
    R.forEach((row, i) => { const w = Math.max(6, d[i] / d[0] * 100), nn = $('.n', row);
      glide($('.bar', row), 'width', w + '%', wait + i * 70); nn.classList.toggle('out', w < 24); glide(nn, 'left', w < 24 ? `calc(${w}% + 8px)` : '10px', wait + i * 70);
      nn.textContent = d[i].toLocaleString('en-US');
      $('.v', row).textContent = i ? '−' + Math.round((1 - d[i] / d[i - 1]) * 100) + '%' : '100%'; row.classList.toggle('drop', i === worst); row.title = ''; $('.tr', row).dataset.tip = i ? Math.round(d[i] / d[0] * 1000) / 10 + '% of signups' : 'Starting point'; });
  }
  seg($('.fnx-sg', r), s => { draw(s); say(D[s].t); });
  // the first draw starts a moment after the funnel appears, the way it always has, and its note fades in after it
  draw('all', 280); txt.textContent = D.all.t; txt.classList.add('sw');
  if (!REDUCE) txt.animate([{ opacity:0, filter:'blur(3px)', transform:`translateY(${getComputedStyle(r).getPropertyValue('--motion').trim() === 'bp' ? -3 : 3}px)` }, { opacity:1, filter:'blur(0)', transform:'none' }], { duration:250, delay:450, easing:getComputedStyle(r).getPropertyValue('--ease').trim() || 'ease', fill:'backwards' });
});
/* ---------- Top pages ---------- */
DM.def('top-pages', (r, c) => {
  const P = [['/pricing','Pricing',18420,24],['/','Home',15210,3],['/components','Components',9870,41],['/docs/agent','Agent docs',6340,-8],['/blog/soft-ui','Soft UI, the post',4120,112],['/changelog','Changelog',2210,-14]];
  const list = $('.tpx-list', r), mx = P[0][2], tot = P.reduce((a, p) => a + p[2], 0), H = 50;
  list.innerHTML = P.map(p => `<div class="tpx-r" data-tip="designme.dev${p[0]}"><span class="rk"></span><span class="pg"><span class="p">${p[1]} <span class="muted">${p[0]}</span></span><span class="tr"><i></i></span></span><span class="n num">${p[2].toLocaleString('en-US')}</span><span class="tag ch num ${p[3] >= 0 ? 'ok' : 'bad'}">${p[3] >= 0 ? '+' : '−'}${Math.abs(p[3])}%</span></div>`).join('');
  const rows = $$('.tpx-r', list);
  function sort(k){
    const order = [...P].sort((a, b) => k === 'v' ? b[2] - a[2] : b[3] - a[3]);
    rows.forEach((row, i) => { const j = order.indexOf(P[i]); row.style.transform = `translateY(${j * H}px)`; $('.rk', row).textContent = j + 1; });
  }
  sort('v'); rows.forEach((row, i) => row.animate([{ opacity:0, filter:'blur(4px)' }, { opacity:1, filter:'blur(0)' }], { duration:450, delay:i * 50, easing:'ease-out', fill:'backwards' }));
  rows.forEach((row, i) => c.later(300 + i * 70, () => $('.tr i', row).style.width = P[i][2] / mx * 100 + '%'));
  $('.tpx-tot', r).textContent = '0';
  c.later(260, () => tween(0, tot, 1000, v => $('.tpx-tot', r).textContent = Math.round(v).toLocaleString('en-US')));
  seg($('.tpx-sg', r), sort);
});
/* ---------- Health score ---------- */
/* three accounts on Mon Nov 9. A factor's points add up to the score: contact 30, deals on time 25, win chance 25 and next
   step 20. Each factor has its status (ok, warn, bad), its figure and unit, a line for screen readers (say) and the lines its
   detail shows. The agent's suggestion has its button, what it says once done, and the factors it changes (after) */
const HSC = [
  { n:'Granite Peak Systems', seg:'Strategic, Americas', was:85,
    f:{
      contact:{ s:'ok', fig:'2d', unit:'ago', say:'last touch 2 days ago', pts:28, max:30,
        lines:['Last touch Nov 7, a pricing call with Dana Ruiz.', 'In touch every week for the last 6 weeks.'] },
      late:{ s:'ok', fig:'0', unit:'late', say:'no deal past its close date', pts:25, max:25,
        lines:['3 open deals, none past its close date.', 'Next to close: Platform renewal, Nov 24.'] },
      win:{ s:'ok', fig:'62%', unit:'', say:'62% across the open deals', pts:16, max:25,
        lines:['62% weighted across 3 open deals.', 'Up from 54% six weeks ago.'] },
      next:{ s:'ok', fig:'Thu', unit:'in 3 days', say:'pricing call on Thursday', pts:20, max:20,
        lines:['Pricing call, Thu Nov 12, 9am, with Dana Ruiz.'] }
    },
    sug:{ t:'The pricing call is on Thursday. Send Dana the updated quote before it.', b:'Draft email', ic:'mail',
      done:'Email to Dana drafted with the updated quote. It waits in your outbox for review.', tag:'Drafted' } },
  { n:'Fernway Travel', seg:'Mid-market, Asia Pacific', was:71,
    f:{
      contact:{ s:'warn', fig:'11d', unit:'ago', say:'quiet for 11 days', pts:18, max:30,
        lines:['Last touch Oct 29, an email to Sam Patel. No reply yet.', 'In touch in 5 of the last 6 weeks.'] },
      late:{ s:'ok', fig:'0', unit:'late', say:'no deal past its close date', pts:25, max:25,
        lines:['2 open deals, both before their close date.', 'Next to close: First contract, Dec 15.'] },
      win:{ s:'ok', fig:'61%', unit:'', say:'61% across the open deals', pts:15, max:25,
        lines:['61% weighted across 2 open deals.', 'Down from 66% six weeks ago.'] },
      next:{ s:'warn', fig:'None', unit:'booked', say:'no next step booked', pts:0, max:20,
        lines:['Nothing is booked with Fernway Travel.', 'Booking a meeting adds 20 points.'] }
    },
    sug:{ t:'Quiet for 11 days with nothing booked. Book a check-in with Sam this week.', b:'Book check-in', ic:'cal',
      done:'Check-in with Sam booked for Wed Nov 11, 10am. Health 58 to 78.', tag:'Booked',
      after:{ next:{ s:'ok', fig:'Wed', unit:'in 2 days', say:'check-in on Wednesday', pts:20,
        lines:['Check-in, Wed Nov 11, 10am, with Sam Patel.', 'Booked by the agent just now.'] } } } },
  { n:'Tidewell Energy', seg:'Enterprise, Asia Pacific', was:41,
    f:{
      contact:{ s:'bad', fig:'38d', unit:'ago', say:'quiet for 38 days', pts:0, max:30,
        lines:['Last touch Oct 2, a demo follow-up with Priya Shah.', 'In touch in 1 of the last 6 weeks.'] },
      late:{ s:'bad', fig:'1', unit:'late', say:'1 deal 6 days past its close date', pts:9, max:25,
        lines:['Renewal was due Nov 3 and is still open, 6 days late.', '1 of 2 open deals is past its close date.'] },
      win:{ s:'warn', fig:'33%', unit:'', say:'33% across the open deals', pts:8, max:25,
        lines:['33% weighted across 2 open deals.', 'Down from 52% six weeks ago.'] },
      next:{ s:'bad', fig:'6d', unit:'overdue', say:'next step overdue since Nov 3', pts:0, max:20,
        lines:['Renewal call, due Tue Nov 3. Not held or moved.'] }
    },
    sug:{ t:'38 days quiet and the renewal is 6 days late. Call Priya to reset the date.', b:'Book call', ic:'cal',
      done:'Call with Priya booked for Tue Nov 10, 9am. Health 17 to 37, still at risk.', tag:'Booked',
      after:{ next:{ s:'ok', fig:'Tue', unit:'tomorrow', say:'renewal call tomorrow', pts:20,
        lines:['Renewal call, Tue Nov 10, 9am, with Priya Shah.', 'Booked by the agent just now, in place of the overdue step.'] } } } }
];
DM.def('health-score', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{spark}', I('spark', 's'));
  // each account keeps what the agent did for it, so switching away and back shows the booking still there
  const AC = JSON.parse(JSON.stringify(HSC));
  const K = ['contact', 'late', 'win', 'next'], L = { contact:'Contact', late:'On time', win:'Win chance', next:'Next step' };
  const SW = { ok:'On track', warn:'Watch', bad:'At risk' }, VD = { ok:'Healthy', warn:'Watch', bad:'At risk' }, C = 2 * Math.PI * 18;
  const id = 'hsc' + Math.random().toString(36).slice(2, 7);
  let A = AC[1];
  const score = () => K.reduce((t, k) => t + A.f[k].pts, 0);
  const band = v => v >= 70 ? 'ok' : v >= 50 ? 'warn' : 'bad';
  const delta = v => (v - A.was >= 0 ? '+' : '−') + Math.abs(v - A.was) + ' in 30 days';
  const onTrack = () => { const n = K.filter(k => A.f[k].s === 'ok').length; return n === K.length ? `all ${n} on track` : `${n} of ${K.length} on track`; };
  // the weakest factor that is off track: the lowest share of its points, the first one on a tie. None when all are on track
  const weakest = () => K.filter(k => A.f[k].s !== 'ok').sort((a, b) => A.f[a].pts / A.f[a].max - A.f[b].pts / A.f[b].max || K.indexOf(a) - K.indexOf(b))[0];
  // a row and, right under it, the detail it opens
  const row = (k, i) => `<button type="button" class="hsc-t" data-k="${k}" aria-expanded="false" aria-controls="${id}-d${i}">
      <span class="hsc-k"><i class="hsc-dot"></i><span class="hsc-n">${L[k]}</span><span class="hsc-wk" aria-hidden="true">Weakest</span></span>
      <span class="hsc-v"><b class="num"></b><span></span></span>${I('chev-d', 'xs hsc-cv')}</button>
    <div class="fold shut hsc-d" id="${id}-d${i}" role="region" aria-label="${L[k]} details"><div><div class="hsc-dc"></div></div></div>`;
  const root = $('.hsc', r), list = $('.hsc-l', root);
  list.innerHTML = K.map(row).join('');
  const ring = $('.hsc-ring', root), fl = $('.fl', ring), num = $('b', ring), an = $('.hsc-ac b', root), as = $('.hsc-ac span', root);
  const vd = $('.hsc-vd', root), sub = $('.hsc-sub', root), dl = $('.hsc-dl', root), sr = $('.hsc-sr', root);
  const rows = $$('.hsc-t', root), regs = $$('.hsc-d', root), sug = $('.hsc-s', root), st = $('.hsc-st', sug);

  // ---- paint: the header, the rows and an open detail follow the factors. After the first time everything that changes
  // crossfades, the ring sweeps and the score counts to its new value
  let shown = 0, run = 0, open = null;
  function paint(first){
    const v = score(), b = band(v), w = weakest();
    root.dataset.v = b;
    ring.setAttribute('aria-label', `Health ${v} of 100, ${VD[b].toLowerCase()}, ${v - A.was >= 0 ? 'up' : 'down'} ${Math.abs(v - A.was)} in 30 days`);
    const sweep = () => { fl.style.strokeDashoffset = (C * (1 - v / 100)).toFixed(2); const t = ++run; tween(shown, v, 900, n => { if (t !== run) return; shown = n; num.textContent = Math.round(n); }); };
    first ? c.later(140, sweep) : sweep();
    const words = [VD[b], `Account health, ${onTrack()}`, delta(v)];
    [vd, sub, dl].forEach((el, i) => first ? el.textContent = words[i] : swap(el, words[i]));
    rows.forEach(t => {
      const k = t.dataset.k, f = A.f[k], fig = $('.hsc-v b', t), unit = $('.hsc-v span', t);
      t.dataset.s = f.s; t.toggleAttribute('data-weak', k === w);
      t.setAttribute('aria-label', `${L[k]}: ${f.say}. ${SW[f.s]}${k === w ? ', the weakest factor' : ''}`);
      if (first){ fig.textContent = f.fig; unit.textContent = f.unit; }
      else { swap(fig, f.fig); swap(unit, f.unit); }
    });
  }

  // ---- a row opens its detail right under it; one at a time
  function fill(k, how){
    const f = A.f[k], dc = $('.hsc-dc', regs[K.indexOf(k)]);
    dc.innerHTML = f.lines.map(l => `<p class="hsc-dp">${l}</p>`).join('') + `<p class="hsc-pt num"><span>${f.pts} of ${f.max} points</span><i></i><span>${SW[f.s]}</span></p>`;
    if (how === 'enter') enter(dc);
    else if (how === 'fade' && !REDUCE) dc.animate([{ opacity:0 }, { opacity:1 }], { duration:260, easing:'ease-out' });
  }
  function toggle(k){
    open = open === k ? null : k;
    if (open) fill(open, 'enter');
    regs.forEach((reg, j) => reg.classList.toggle('shut', K[j] !== open));
    rows.forEach(t => t.setAttribute('aria-expanded', String(t.dataset.k === open)));
  }
  rows.forEach(t => t.onclick = () => toggle(t.dataset.k));

  // ---- the agent's suggestion: its button works, shows it is busy, says what it did, and the factors it changes update.
  // The work belongs to the account it was pressed for, even if another account is showing by the time it lands
  const draw = (go, acct) => {
    if (!acct.busy){ go.disabled = false; go.removeAttribute('aria-busy'); go.style.width = ''; go.innerHTML = I(acct.sug.ic, 'xs') + acct.sug.b; return; }
    if (go.offsetWidth) go.style.width = go.offsetWidth + 'px';
    go.disabled = true; go.setAttribute('aria-busy', 'true'); go.innerHTML = '<span class="spin" aria-hidden="true"></span><span class="hsc-sr">Working</span>';
  };
  function control(){
    if (A.done) return html(`<span class="tag ok hsc-done" tabindex="-1">${I('check', 'xs')}${A.sug.tag}</span>`);
    const go = html('<button type="button" class="pill primary sm hsc-go"></button>'), acct = A;
    draw(go, acct); go.onclick = () => act(acct, go);
    return go;
  }
  function act(acct, go){
    if (acct.busy || acct.done) return;
    const had = document.activeElement === go;
    acct.busy = true; draw(go, acct);
    c.run(async () => {
      await c.wait(900);
      acct.busy = false; acct.done = true;
      const after = acct.sug.after || {};
      Object.keys(after).forEach(k => Object.assign(acct.f[k], after[k]));
      if (acct !== A) return;
      const n = control(); $('.hsc-go,.hsc-done', sug).replaceWith(n); enter(n); if (had) n.focus();
      swap(st, acct.sug.done);
      paint(false); if (open) fill(open, null);
      sr.textContent = acct.sug.done;
    });
  }

  // ---- an account: its name, its factors and its suggestion. Switching crossfades what changes, and an open row stays
  // open on the same factor of the new account
  function show(i, first){
    A = AC[i];
    const words = [A.n, A.seg, A.done ? A.sug.done : A.sug.t];
    [an, as, st].forEach((el, j) => first ? el.textContent = words[j] : swap(el, words[j]));
    const n = control(); $('.hsc-go,.hsc-done', sug).replaceWith(n); if (!first) enter(n);
    paint(first);
    if (open) fill(open, 'fade');
    if (!first) sr.textContent = `${A.n}, health ${score()} of 100, ${VD[band(score())].toLowerCase()}`;
  }
  const sg = $('.demo .seg2', r);
  seg(sg, v => show(+v));
  show(1, true);

  // the preview's story, once: Watch is showing, the person books the check-in the agent suggests and Next step turns green,
  // then they switch to the account at risk. After that it stays as it is, for the visitor
  c.story(async s => {
    await s.beat(5);
    await s.tap($('.hsc-go', sug)); s.away();
    await s.until(() => AC[1].done); await s.beat(5);
    await s.tap($$('button', sg)[2]); s.away();
    // played once: ending the story here, rather than returning, skips the core's replay loop
    throw 'stop';
  });
});
/* ---------- Activity heatmap ---------- */
DM.def('activity-heatmap', (r, c) => {
  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const grid = $('.hmx-grid', r), st = $('.hmx-st', r);
  const gen = (who) => { const a = []; for (let d = 0; d < 7; d++) for (let h = 0; h < 24; h++){
    let v = who === 'agent' ? (h >= 1 && h <= 5 ? .75 : h >= 9 && h <= 18 ? .45 : .15) : (h >= 9 && h <= 18 ? .65 : h >= 19 && h <= 22 ? .2 : .03);
    if (d >= 5) v *= who === 'agent' ? .8 : .2; if (who === 'agent' && d === 0 && h === 9) v = 1;
    v = Math.max(0, Math.min(1, v + (Math.sin(d * 7.1 + h * 3.3) * .18))); a.push(v); } return a; };
  const D = { agent:gen('agent'), team:gen('team') };
  grid.innerHTML = Array.from({ length:168 }, () => '<i style="--a:0"></i>').join('');
  const cells = $$('i', grid);
  function draw(w){ cells.forEach((el, i) => { const d = Math.floor(i / 24), h = i % 24, v = D[w][i]; c.later((h + d) * 14, () => el.style.setProperty('--a', (v * .9).toFixed(2)));
    const hr = (h % 12 || 12) + (h < 12 ? 'am' : 'pm'); el.dataset.tip = `${DAYS[d]} ${hr}: ${Math.round(v * (w === 'agent' ? 40 : 25))} ${w === 'agent' ? 'runs' : 'edits'}`; });
    swap(st, w === 'agent' ? 'Busiest overnight, when the queue runs' : 'Busiest 10am to 4pm on weekdays'); }
  seg($('.hmx-sg', r), draw);
  c.later(240, () => draw('agent'));
  // on a phone the grid scrolls sideways: it starts at the latest hours, and fades out on whichever side has more to see
  const sc = $('.hmx-sc', r);
  const edges = () => { const m = sc.scrollWidth - sc.clientWidth; sc.classList.toggle('ml', m > 1 && sc.scrollLeft > 1); sc.classList.toggle('mr', m > 1 && sc.scrollLeft < m - 1); };
  // it stays on the latest hours as the card settles its size, until the person scrolls it themselves
  let moved = false;
  const fit = () => { if (!moved) sc.scrollLeft = sc.scrollWidth; edges(); };
  c.on(sc, 'scroll', edges, { passive:true });
  ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(e => c.on(sc, e, () => { moved = true; }, { passive:true }));
  const ro = new ResizeObserver(fit); ro.observe(sc); ro.observe(grid); c.offs.push(() => ro.disconnect());
});
/* ---------- Stat cards ---------- */
DM.def('stat-cards', (r, c) => {
  const S = [
    ['spark','Agent runs',[[412,12],[1730,18],[4980,22]],'',[3,4,4,5,6,5,7,8]],
    ['users','Active editors',[[318,4],[1130,9],[1620,31]],'',[5,5,6,6,6,7,7,8]],
    ['clock','Hours saved',[[96,15],[402,21],[1180,26]],'h',[2,3,3,4,5,6,6,8]],
    ['coins','Agent spend',[[84,-6],[341,-3],[960,8]],'$',[6,5,6,5,4,4,4,3]]
  ];
  const grid = $('.scx-grid', r); let per = 1;
  grid.innerHTML = S.map((s, i) => `<div class="scx-c panel"><span class="scx-k"><span class="ic">${I(s[0],'xs')}</span>${s[1]}</span><div class="scx-v"><b class="num">0</b><span class="scx-d num"></span></div><div class="scx-sp"><svg viewBox="0 0 100 30" preserveAspectRatio="none"><path stroke="var(--c${i + 1})" d="M0 30 L100 30"/></svg></div></div>`).join('');
  const cards = $$('.scx-c', grid), cur = S.map(() => 0);
  const fmt = (s, v) => s[3] === '$' ? '$' + Math.round(v).toLocaleString('en-US') : Math.round(v).toLocaleString('en-US') + s[3];
  function draw(p){
    per = p; cards.forEach((el, i) => { const s = S[i], [val, ch] = s[2][p];
      tween(cur[i], val, 900, v => { cur[i] = v; $('b', el).textContent = fmt(s, v); });
      const d = $('.scx-d', el); d.className = 'tag scx-d num ' + (ch >= 0 ? 'ok up' : 'bad dn'); swap(d, (ch >= 0 ? '+' : '') + ch + '%');
      const pts = s[4].map((y, k) => { const yy = y + Math.sin(k * 1.7 + p * 2) * (p ? 1 : .5); return `${k === 0 ? 'M' : 'L'}${(k / 7 * 100).toFixed(1)} ${(29 - yy * 3.2).toFixed(1)}`; }).join(' ');
      $('path', el).setAttribute('d', pts); el.dataset.tip = ['vs previous 7 days','vs previous 30 days','vs last quarter'][p]; });
  }
  seg($('.scx-sg', r), v => draw(+v));
  stagger(cards, 70);
  c.later(240, () => draw(1));
  if (!REDUCE) cards.forEach((el, i) => $('.scx-sp svg', el).animate([{ clipPath:'inset(-4px 100% -4px 0)' }, { clipPath:'inset(-4px 0% -4px 0)' }], { duration:1000, delay:300 + i * 70, easing:'cubic-bezier(.45,0,.2,1)', fill:'backwards' }));
});
/* ---------- Account table ---------- */
DM.def('account-table', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{search}', I('search','xs'));
  const A = [
    ['Northwind','b','Enterprise',120,92,'$14,400','Expanding. Design team added 18 seats this month.'],
    ['Lumen Labs','l','Pro',14,48,'$672','Usage fell 40% after their lead designer left. Worth a check in.'],
    ['Fable & Co','m','Team',32,81,'$1,920','Steady. Asked about the Figma sync twice.'],
    ['Orbit','p','Pro',8,67,'$384','Trial of the agent ends Friday. 3 runs so far.'],
    ['Kite Health','r','Enterprise',64,88,'$7,680','Renewal in 6 weeks, champion is happy.'],
    ['Paper Plane','t','Team',21,34,'$1,260','Two failed payments. Billing contact bounced.']
  ];
  const tb = $('tbody', r), q = $('.atb-s input', r); let plan = '', open = null;
  const hc = h => h >= 80 ? 'var(--atb-ok)' : h >= 60 ? 'var(--atb-warn)' : 'var(--atb-bad)';
  function paint(anim){
    const s = q.value.trim().toLowerCase(), rows = A.filter(a => (!plan || a[2] === plan) && (!s || a[0].toLowerCase().includes(s)));
    tb.innerHTML = rows.length ? rows.map(a => `<tr class="row${open === a[0] ? ' open' : ''}" data-n="${a[0]}"><td><span class="nm"><span class="lg" style="background:var(--av-${a[1]});color:var(--av-${a[1]}-ink)">${a[0][0]}</span>${a[0]}</span></td><td><span class="tag ${a[2] === 'Enterprise' ? 'l' : a[2] === 'Pro' ? 'b' : 't'}">${a[2]}</span></td><td class="num">${a[3]}</td><td><span class="hb"><i><b style="width:${a[4]}%;background:${hc(a[4])}"></b></i><span class="num">${a[4]}</span></span></td><td class="r num">${a[5]}</td></tr>` + (open === a[0] ? `<tr class="det"><td colspan="5"><div class="fold"><div><div class="atb-note">${I('spark','xs')}<span>${a[6]}</span><button class="pill soft sm">Draft email</button></div></div></div></td></tr>` : '')).join('') : '<tr class="atb-empty"><td colspan="5">No accounts match</td></tr>';
    if (anim) stagger($$('tr.row', tb), 35);
    $$('tr.row', tb).forEach(tr => tr.onclick = () => { open = open === tr.dataset.n ? null : tr.dataset.n; paint(); const d = $('.atb-note', tb); if (d) enter(d); });
    const dr = $('.atb-note .pill', tb); if (dr) dr.onclick = e => { e.stopPropagation(); dr.innerHTML = '<span class="spin"></span>'; c.later(800, () => { dr.innerHTML = I('check','xs') + 'Draft ready'; }); };
  }
  q.oninput = () => paint(true);
  $$('.atb-fl .chip', r).forEach(ch => ch.onclick = () => { $$('.atb-fl .chip', r).forEach(x => x.classList.toggle('on', x === ch)); plan = ch.dataset.p; paint(true); });
  paint(true);
  // the preview opens one account's note on its own, unless you take over first
  c.auto(1200, () => { if (!open){ open = 'Lumen Labs'; paint(); enter($('.atb-note', tb)); } });
});
/* ---------- Eval radar ---------- */
DM.def('radar-chart', (r, c) => {
  // six eval scores out of 100: this run against the baseline it is compared with
  const A = [['Accuracy', 88, 84], ['Instruction following', 86, 80], ['Tool use', 62, 78], ['Speed', 74, 66], ['Cost efficiency', 82, 58], ['Safety', 91, 90]];
  const WEAK = 70, N = A.length;
  const ch = $('.rdx-ch', r), svg = $('.rdx-svg', r), avg = $('.rdx-avg b', r), ro = $('.rdx-ro span', r), keys = $$('.rdx-k', r);
  const mean = k => Math.round(A.reduce((t, a) => t + a[k], 0) / N);
  ch.insertAdjacentHTML('beforeend', A.map((a, i) => `<button class="rdx-ax" data-i="${i}" tabindex="${i ? -1 : 0}" aria-label="${a[0]}: ${a[1]}, baseline ${a[2]}, ${a[1] >= a[2] ? 'up' : 'down'} ${Math.abs(a[1] - a[2])}${a[1] < WEAK ? ', weak' : ''}"><span class="n">${a[0]}</span><span class="v num"><b>${a[1]}</b><span>${a[1] >= a[2] ? '+' : '−'}${Math.abs(a[1] - a[2])}</span>${a[1] < WEAK ? '<span class="tag warn">Weak</span>' : ''}</span></button>`).join(''));
  const L = $$('.rdx-ax', ch);
  let grow = 0, drawn = 0, on = { cur:true, base:true }, hot = -1, G = null;
  // the geometry follows the chart's size, so the labels always sit outside the rings
  // on a narrow card the long names shorten, and the rings take whatever room the side labels leave
  const SHORT = ['Accuracy', 'Instructions', 'Tool use', 'Speed', 'Cost', 'Safety'];
  function geo(){ const W = ch.clientWidth, H = ch.clientHeight, narrow = W < 380;
    L.forEach((l, i) => { const t = narrow ? SHORT[i] : A[i][0], n = $('.n', l); if (n.textContent !== t) n.textContent = t; });
    const side = Math.max(...L.filter((l, i) => Math.abs(Math.cos(ang(i))) >= .2).map(l => l.offsetWidth));
    const R = Math.max(40, Math.min(H / 2 - 46, W / 2 - side - 14)); return { W, H, cx:W / 2, cy:H / 2, R }; }
  const ang = i => -Math.PI / 2 + i * 2 * Math.PI / N;
  const pt = (g, i, v) => [g.cx + Math.cos(ang(i)) * g.R * v / 100, g.cy + Math.sin(ang(i)) * g.R * v / 100];
  const poly = (g, k, s = 1) => A.map((a, i) => pt(g, i, a[k] * s).map(n => n.toFixed(1)).join(',')).join(' ');
  function draw(){
    G = geo(); const g = G; svg.setAttribute('viewBox', `0 0 ${g.W} ${g.H}`);
    svg.innerHTML = [25, 50, 75, 100].map(v => `<polygon class="ring${v === 100 ? ' out' : ''}" points="${A.map((a, i) => pt(g, i, v).join(',')).join(' ')}"/>`).join('')
      + A.map((a, i) => { const [x, y] = pt(g, i, 100); return `<line class="sp" x1="${g.cx}" y1="${g.cy}" x2="${x}" y2="${y}"/>`; }).join('')
      + `<polygon class="base${on.base ? '' : ' off'}" pathLength="100" style="stroke-dasharray:${drawn} 100" points="${poly(g, 2)}"/>`
      + `<polygon class="cur${on.cur ? '' : ' off'}" points="${poly(g, 1, grow)}"/>`
      + A.map((a, i) => { const [bx, by] = pt(g, i, a[2]), [x, y] = pt(g, i, a[1] * grow); return `<circle class="pt b${on.base && drawn >= 100 ? '' : ' off'}" r="2.5" cx="${bx}" cy="${by}"/><circle class="pt c${on.cur && grow > .98 ? '' : ' off'}${i === hot ? ' on' : ''}" r="3" cx="${x}" cy="${y}"/>`; }).join('');
    $$('.sp', svg).forEach((s, i) => s.classList.toggle('on', i === hot));
    L.forEach((l, i) => { const a = ang(i), x = g.cx + Math.cos(a) * (g.R + 12), y = g.cy + Math.sin(a) * (g.R + 12), cs = Math.cos(a), sn = Math.sin(a);
      const side = Math.abs(cs) < .2 ? 'm' : cs < 0 ? 'l' : 'r'; l.classList.remove('l', 'm', 'r'); l.classList.add(side);
      const w = l.offsetWidth, h = l.offsetHeight;
      l.style.left = (side === 'm' ? x - w / 2 : side === 'l' ? x - w : x) + 'px'; l.style.top = (Math.abs(sn) > .9 ? (sn < 0 ? y - h : y) : y - h / 2) + 'px'; });
  }
  const ro2 = new ResizeObserver(draw); ro2.observe(ch); c.offs.push(() => ro2.disconnect());
  // the line under the chart: the axis in hand with both scores and the change, or else the agent's note
  let note = `${I('spark','xs')}<span>Run 48 averages <b>${mean(1)}</b>, up ${mean(1) - mean(2)} on the baseline.</span>`;
  const show = i => { hot = i; L.forEach((l, j) => l.classList.toggle('on', j === i)); draw();
    if (i < 0){ swap(ro, note, true); return; }
    const [n, a, b] = A[i], d = a - b; swap(ro, `<span><b>${n}</b> ${a} now, ${b} before, <span class="${d < 0 ? 'dn' : 'up'}">${d < 0 ? '−' : '+'}${Math.abs(d)}</span>${a < WEAK ? ', below 70' : ''}</span>`, true); };
  L.forEach((l, i) => { c.on(l, 'pointerenter', e => { if (e.pointerType !== 'touch') show(i); }); c.on(l, 'focus', () => show(i)); c.on(l, 'click', () => show(i)); });
  c.on(ch, 'pointerleave', () => { if (!ch.contains(document.activeElement)) show(-1); });
  c.on(ch, 'focusout', e => { if (!ch.contains(e.relatedTarget)) show(-1); });
  // roving focus: one axis takes Tab, Left and Right (and Up and Down) go round the chart, Home and End to the first and last
  c.on(ch, 'keydown', e => { const i = L.indexOf(document.activeElement); if (i < 0) return;
    const to = { ArrowRight:i + 1, ArrowDown:i + 1, ArrowLeft:i - 1, ArrowUp:i - 1, Home:0, End:N - 1 }[e.key]; if (to == null) return;
    e.preventDefault(); const j = (to + N) % N; L.forEach((l, k) => l.tabIndex = k === j ? 0 : -1); L[j].focus(); });
  // the legend shows and hides a series; one always stays
  keys.forEach(k => k.onclick = () => { const s = k.dataset.s, o = s === 'cur' ? 'base' : 'cur'; if (on[s] && !on[o]) return; on[s] = !on[s]; k.setAttribute('aria-pressed', on[s]); draw(); });
  ro.innerHTML = '<span class="muted">Drawing the baseline</span>'; avg.textContent = '0';
  // the baseline draws itself, this run grows out of the middle, then the agent says what changed and points at tool use
  c.run(async () => {
    await c.wait(300);
    await tween(0, 100, 900, v => { drawn = v; draw(); });
    await c.wait(250);
    tween(0, mean(1), 1100, v => avg.textContent = Math.round(v));
    await tween(0, 1, 1100, v => { grow = v; draw(); });
    await c.wait(500);
    note = `${I('spark','xs')}<span>Cheaper and faster, <b>weaker at tool use</b> (−16). It skipped the search tool on 7 of 40 tasks.</span>`;
    if (hot < 0) swap(ro, note, true);
    const t = L[2]; t.classList.remove('hot'); void t.offsetWidth; t.classList.add('hot');
  });
  if (r === c.st) c.story(async s => {
    await s.beat(10);
    await s.point(L[2]); show(2); await s.beat(4);
    await s.point(L[4]); show(4); await s.beat(3);
    s.away(); show(-1); await s.beat(3);
  });
});
/* ---------- Radial goals ---------- */
DM.def('radial-goals', (r, c) => {
  // each agent, what it counts, and what it did against its target this week and this month
  const A = [
    { n:'Support agent', u:'tickets', c:'var(--c1)', w:[412, 375], m:[1490, 1600] },
    { n:'QA agent', u:'checks', c:'var(--c3)', w:[136, 160], m:[702, 640] },
    { n:'Research agent', u:'reports', c:'var(--c4)', w:[18, 24], m:[71, 96] }
  ];
  const svg = $('.rgx-ring svg', r), ring = $('.rgx-ring', r), lg = $('.rgx-lg', r), cb = $('.rgx-c b', r), cl = $('.rgx-c .muted', r), sub = $('.rgx-sub', r), tb = $('.rgx-sr tbody', r);
  // three thick rings, 14 units wide with a 4 unit gap between them, leaving room in the middle for the readout
  const RAD = [78, 60, 42];
  svg.innerHTML = A.map((a, i) => `<g data-i="${i}" style="stroke:${a.c}"><circle class="tr" cx="90" cy="90" r="${RAD[i]}"/><circle class="fl" cx="90" cy="90" r="${RAD[i]}" pathLength="100" stroke-dasharray="0 100"/><circle class="ovb" cx="90" cy="90" r="${RAD[i]}" pathLength="100" stroke-dasharray="0 100"/><circle class="ov" cx="90" cy="90" r="${RAD[i]}" pathLength="100" stroke-dasharray="0 100"/><circle class="mk" r="4" cx="${90 + RAD[i]}" cy="90"/></g>`).join('');
  lg.innerHTML = A.map((a, i) => `<div class="rgx-r" data-i="${i}" tabindex="0"><i style="background:${a.c}"></i><span class="n">${a.n}</span><span class="p num"></span><span class="v num"></span></div>`).join('');
  const G = $$('g', svg), rows = $$('.rgx-r', lg);
  let k = 'w', focus = -1, shown = 0;
  const share = a => a[k][0] / a[k][1], pc = x => Math.round(x * 100) + '%';
  const overall = () => A.reduce((t, a) => t + share(a), 0) / A.length;
  function paint(){
    A.forEach((a, i) => { const s = share(a), g = G[i];
      // (a hair short of the share: a dash that ends exactly on a quarter of the circle draws a stray notch in Chrome)
      $('.fl', g).setAttribute('stroke-dasharray', `${Math.max(0, Math.min(1, s) * 100 - .01)} 100`);
      // past the target the ring goes round again from the top, and a marker sits where it ends
      const lap = Math.max(0, s - 1) * 100, cut = Math.min(3, lap), ovb = $('.ovb', g);
      $('.ov', g).setAttribute('stroke-dasharray', `${lap} 100`);
      // under the lap's end only, a band of the surface a little wider than the ring, so the end cuts into the ring under it
      ovb.setAttribute('stroke-dasharray', `${cut} 100`); ovb.setAttribute('stroke-dashoffset', -(lap - cut)); g.classList.toggle('lap', s > 1);
      const mk = $('.mk', g), an = (s > 1 ? s - 1 : s) * 2 * Math.PI; mk.setAttribute('cx', 90 + Math.cos(an) * RAD[i]); mk.setAttribute('cy', 90 + Math.sin(an) * RAD[i]); mk.style.stroke = a.c;
      const row = rows[i]; $('.p', row).innerHTML = s >= 1 ? `<span class="tag ok">${pc(s)}</span>` : pc(s); $('.v', row).textContent = `${a[k][0].toLocaleString('en-US')} / ${a[k][1].toLocaleString('en-US')} ${a.u}`;
      row.setAttribute('aria-label', `${a.n}: ${a[k][0]} of ${a[k][1]} ${a.u}, ${pc(s)} of target`); });
    tb.innerHTML = A.map(a => `<tr><th>${a.n}</th><td>${a[k][0]} ${a.u}</td><td>${a[k][1]}</td><td>${pc(share(a))}</td></tr>`).join('');
    centre();
    const on = A.filter(a => share(a) >= 1).length; swap(sub, `${k === 'w' ? 'This week' : 'This month'}, ${on} of ${A.length} on target`);
  }
  // the middle shows the overall share, or the agent in focus
  function centre(){ const t = focus < 0 ? overall() : share(A[focus]), from = shown; shown = t; tween(from, t, 600, x => cb.textContent = pc(x)); swap(cl, focus < 0 ? 'of targets' : A[focus].n.replace(' agent', '')); }
  const hl = i => { if (focus === i) return; focus = i; ring.classList.toggle('hov', i >= 0); G.forEach((g, j) => g.classList.toggle('on', j === i)); rows.forEach((x, j) => x.classList.toggle('on', j === i)); centre(); };
  [...G, ...rows].forEach(el => { const i = +el.dataset.i; c.on(el, 'pointerenter', e => { if (e.pointerType !== 'touch') hl(i); }); c.on(el, 'pointerleave', () => { if (!lg.contains(document.activeElement)) hl(-1); }); });
  rows.forEach((x, i) => { c.on(x, 'focus', () => hl(i)); c.on(x, 'blur', () => hl(-1)); });
  seg($('.rgx-sg', r), v => { k = v; paint(); });
  cb.textContent = '0%';
  c.later(260, paint);
  // the preview's story: read the agent furthest behind, then the one past its target, see the month, then back to the week
  if (r === c.st) c.story(async s => {
    await s.beat(5);
    await s.point(rows[2]); hl(2); await s.beat(3);
    await s.point(rows[0]); hl(0); await s.beat(3);
    hl(-1); await s.tap($('.rgx-sg [data-v="m"]', r)); await s.beat(4);
    await s.tap($('.rgx-sg [data-v="w"]', r)); s.away(); await s.beat(3);
  });
});
/* ---------- Cost vs quality ---------- */
DM.def('scatter-chart', (r, c) => {
  // the week's runs: cost per run in dollars, eval score in %, thousands of tokens, and the model. A few long tool loops cost a lot
  // for a middling score
  const M = [['Opus', 'var(--c1)', 'c'], ['Sonnet', 'var(--c2)', 's'], ['Haiku', 'var(--c3)', 't']];
  const rnd = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const R = [];
  for (let i = 0; i < 15; i++) R.push({ m:0, x:.3 + rnd(i, 1) * .22, y:85 + rnd(i, 2) * 12, t:28 + rnd(i, 3) * 30 });
  for (let i = 0; i < 18; i++) R.push({ m:1, x:.06 + rnd(i, 4) * .22, y:79 + rnd(i, 5) * 16, t:12 + rnd(i, 6) * 18 });
  for (let i = 0; i < 12; i++) R.push({ m:2, x:.02 + rnd(i, 7) * .08, y:64 + rnd(i, 8) * 20, t:5 + rnd(i, 9) * 8 });
  R.push({ m:0, x:.57, y:73, t:61, out:1 }, { m:0, x:.54, y:70, t:58, out:1 }, { m:1, x:.47, y:71, t:44, out:1 });
  R.forEach((p, i) => { p.id = 12 + i; p.x = Math.round(p.x * 100) / 100; p.y = Math.round(p.y); p.t = Math.round(p.t); });
  const pl = $('.cvq-pl', r), svg = $('.cvq-svg', r), tt = $('.cvq-tt', r), msg = $('.cvq-msg', r), ft = $('.cvq-ft', r), lg = $('.cvq-lg', r);
  const shape = (k, x, y, s) => k === 'c' ? `<circle cx="${x}" cy="${y}" r="${s}"/>` : k === 's' ? `<rect x="${x - s * .9}" y="${y - s * .9}" width="${s * 1.8}" height="${s * 1.8}" rx="${s * .25}"/>` : `<path d="M${x} ${y - s * 1.15}L${x + s * 1.05} ${y + s * .75}L${x - s * 1.05} ${y + s * .75}Z"/>`;
  lg.innerHTML = M.map((m, i) => `<button class="cvq-k" aria-pressed="true" data-m="${i}"><svg viewBox="-6 -6 12 12" style="fill:${m[1]}">${shape(m[2], 0, 0, 4.5)}</svg>${m[0]}</button>`).join('');
  const show = [true, true, true];
  let G = null, hot = -1, sel = null, box = null, rings = false, seen = 0, focusI = -1;
  const X0 = 0, X1 = .6, Y0 = 60, Y1 = 100;
  const med = a => { const s = [...a].sort((p, q) => p - q), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  // narrow charts (phones) drop the quadrant names and keep three ticks a side, so the runs have the room
  function geo(){ const W = pl.clientWidth, H = pl.clientHeight, n = W <= 340, l = n ? 38 : 44, b = 40, t = 6, rr = 8; return { W, H, n, l, b, t, rr, x:v => l + (v - X0) / (X1 - X0) * (W - l - rr), y:v => t + (1 - (v - Y0) / (Y1 - Y0)) * (H - t - b), vx:px => X0 + (px - l) / (W - l - rr) * (X1 - X0), vy:py => Y0 + (1 - (py - t) / (H - t - b)) * (Y1 - Y0) }; }
  const size = p => (3 + (p.t - 5) / 56 * 4.5) * (G && G.n ? .85 : 1);
  const vis = () => R.filter(p => show[p.m]);
  function draw(){
    const g = G = geo(), v = vis(), mx = med(v.map(p => p.x)), my = med(v.map(p => p.y));
    let s = '';
    // a few light gridlines and quiet tick labels; the axis titles sit well clear of the ticks
    [60, 80, 100].forEach(y => { s += `<line class="gl" x1="${g.l}" x2="${g.W - g.rr}" y1="${g.y(y)}" y2="${g.y(y)}"/><text x="${g.l - 6}" y="${g.y(y) + 3.5}" text-anchor="end">${y}</text>`; });
    const xt = g.n ? [0, .3, .6] : [0, .2, .4, .6];
    xt.forEach(x => { s += `<text x="${g.x(x)}" y="${g.H - g.b + 15}" text-anchor="${x === 0 ? 'start' : x === .6 ? 'end' : 'middle'}">$${x.toFixed(2)}</text>`; });
    s += `<line class="ax" x1="${g.l}" x2="${g.W - g.rr}" y1="${g.H - g.b}" y2="${g.H - g.b}"/>`;
    s += `<text class="at" x="${g.W - g.rr}" y="${g.H - 1}" text-anchor="end">Cost per run (USD)</text><text class="at" x="${-g.t}" y="9" transform="rotate(-90)" text-anchor="end">Eval score (%)</text>`;
    // the medians split it into four quadrants, each named in its corner (on a phone the lines stay and the names go)
    s += `<line class="md" x1="${g.x(mx)}" x2="${g.x(mx)}" y1="${g.t}" y2="${g.H - g.b}"/><line class="md" x1="${g.l}" x2="${g.W - g.rr}" y1="${g.y(my)}" y2="${g.y(my)}"/>`;
    if (!g.n) s += `<text class="q" x="${g.l + 6}" y="${g.t + 11}">Cheap, good</text><text class="q" x="${g.W - g.rr - 4}" y="${g.t + 11}" text-anchor="end">Costly, good</text><text class="q" x="${g.l + 6}" y="${g.H - g.b - 6}">Cheap, weaker</text><text class="q" x="${g.W - g.rr - 4}" y="${g.H - g.b - 6}" text-anchor="end">Costly, weaker</text>`;
    R.forEach((p, i) => { const m = M[p.m], cl = ['d', !show[p.m] || i >= seen ? 'off' : '', hot >= 0 && R[hot].m !== p.m && show[p.m] ? 'dim' : '', i === hot ? 'on' : '', sel && sel.includes(i) ? 'sel' : ''].filter(Boolean).join(' ');
      s += `<g class="${cl}" style="fill:${m[1]}">${shape(m[2], +g.x(p.x).toFixed(1), +g.y(p.y).toFixed(1), +size(p).toFixed(1))}</g>`; });
    if (rings) R.forEach(p => { if (p.out && show[p.m]) s += `<circle class="ring" cx="${g.x(p.x)}" cy="${g.y(p.y)}" r="${size(p) + 6}"/>`; });
    if (box) s += `<rect class="box" x="${Math.min(box[0], box[2])}" y="${Math.min(box[1], box[3])}" width="${Math.abs(box[2] - box[0])}" height="${Math.abs(box[3] - box[1])}" rx="3"/>`;
    svg.setAttribute('viewBox', `0 0 ${g.W} ${g.H}`); svg.innerHTML = s;
    // the tooltip sits over the dot in hand
    if (hot >= 0){ const p = R[hot], x = g.x(p.x), y = g.y(p.y) - size(p); $('b', tt).textContent = `$${p.x.toFixed(2)} · ${p.y}%`; $('span', tt).textContent = `Run ${p.id}, ${M[p.m][0]}, ${p.t}k tokens`;
      tt.classList.add('on'); const w = tt.offsetWidth; tt.style.left = Math.max(w / 2, Math.min(g.W - w / 2, x)) + 'px'; tt.style.top = y + 'px'; }
    else tt.classList.remove('on');
  }
  const ro = new ResizeObserver(draw); ro.observe(pl); c.offs.push(() => ro.disconnect());
  const say = (h, keep) => { if (!keep) asked++; swap(msg, h, true); };
  let asked = 0;
  const idle = () => `${I('spark','xs')}<span>Medians split the runs: <b>$${med(vis().map(p => p.x)).toFixed(2)}</b> and <b>${med(vis().map(p => p.y))}%</b>. Drag across the chart to select runs.</span>`;
  // a selection: how many, their averages, and a way to ask about them
  function selected(){
    if (!sel || !sel.length){ sel = null; say(idle()); draw(); return; }
    const ps = sel.map(i => R[i]), ax = ps.reduce((t, p) => t + p.x, 0) / ps.length, ay = ps.reduce((t, p) => t + p.y, 0) / ps.length;
    say(`<span><b>${ps.length} runs selected</b>, $${ax.toFixed(2)} and ${Math.round(ay)}% on average</span><button class="pill soft sm cvq-ask">${I('spark','xs')}Ask the agent why</button>`);
    // (a click on an empty spot, or Escape, clears the selection)
    setTimeout(() => { const a = $('.cvq-ask', ft); if (a) a.onclick = () => ask(ps); }, REDUCE ? 0 : 200);
    draw();
  }
  const ask = ps => c.run(async () => {
    const id = ++asked; swap(msg, `${I('spark','xs')}<span class="shim">Looking at ${ps.length} runs</span>`, true); await c.wait(1000); if (id !== asked) return;
    const by = M.map((m, i) => ps.filter(p => p.m === i).length), top = by.indexOf(Math.max(...by));
    const text = `Most are ${M[top][0]} runs on short tickets, with under 6 tool calls each. Sending tickets like these to ${M[top][0]} would cut their cost by about 40%.`;
    msg.innerHTML = `${I('spark','xs')}<span class="b"></span>`; const b = $('.b', msg), ws = text.split(' ');
    for (let i = 1; i <= ws.length; i++){ if (id !== asked) return; b.textContent = ws.slice(0, i).join(' '); await c.wait(45); }
  });
  // pointing snaps to the nearest dot within reach and dims the other models
  const near = (px, py) => { let best = -1, bd = 26 * 26; R.forEach((p, i) => { if (!show[p.m] || i >= seen) return; const dx = G.x(p.x) - px, dy = G.y(p.y) - py, d = dx * dx + dy * dy; if (d < bd){ bd = d; best = i; } }); return best; };
  const local = e => { const b = pl.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  let drag = null;
  c.on(pl, 'pointerdown', e => { if (e.button) return; const [x, y] = local(e); drag = { x, y, id:e.pointerId, moved:false }; });
  c.on(pl, 'pointermove', e => { const [x, y] = local(e);
    if (drag && (drag.moved || Math.abs(x - drag.x) + Math.abs(y - drag.y) > 5)){ if (!drag.moved){ drag.moved = true; pl.setPointerCapture(drag.id); hot = -1; } box = [drag.x, drag.y, Math.max(G.l, Math.min(G.W - G.rr, x)), Math.max(G.t, Math.min(G.H - G.b, y))]; draw(); return; }
    if (e.pointerType === 'touch') return; const i = near(x, y); if (i !== hot){ hot = i; draw(); } });
  c.on(pl, 'pointerleave', () => { if (!drag && hot >= 0 && document.activeElement !== pl){ hot = -1; draw(); } });
  const finish = () => { if (!drag) return; const d = drag; drag = null;
    if (d.moved){ const [a, b2, x2, y2] = box, lo = Math.min(a, x2), hi = Math.max(a, x2), top = Math.min(b2, y2), bot = Math.max(b2, y2);
      sel = R.map((p, i) => i).filter(i => show[R[i].m] && G.x(R[i].x) >= lo && G.x(R[i].x) <= hi && G.y(R[i].y) >= top && G.y(R[i].y) <= bot); selected(); }
    else { const i = hot; if (i < 0 && sel){ sel = null; box = null; selected(); } } };
  c.on(pl, 'pointerup', finish); c.on(pl, 'pointercancel', () => { drag = null; box = null; draw(); });
  // the keys step through the runs from cheapest to dearest; Escape clears a selection
  const order = () => R.map((p, i) => i).filter(i => show[R[i].m]).sort((a, b) => R[a].x - R[b].x || R[b].y - R[a].y);
  c.on(pl, 'keydown', e => { const o = order(); let k = o.indexOf(hot);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') k = Math.min(o.length - 1, k + 1); else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') k = Math.max(0, k < 0 ? 0 : k - 1);
    else if (e.key === 'Home') k = 0; else if (e.key === 'End') k = o.length - 1;
    else if (e.key === 'Escape' && sel){ sel = null; box = null; selected(); return; } else return;
    e.preventDefault(); hot = o[k]; draw(); const p = R[hot]; say(`<span><b>Run ${p.id}</b>, ${M[p.m][0]}: $${p.x.toFixed(2)}, ${p.y}%, ${p.t}k tokens. ${k + 1} of ${o.length}</span>`); });
  c.on(pl, 'blur', () => { if (hot >= 0){ hot = -1; draw(); } if (!sel) say(idle(), true); });
  $$('.cvq-k', lg).forEach(k => k.onclick = () => { const m = +k.dataset.m; if (show[m] && show.filter(Boolean).length === 1) return; show[m] = !show[m]; k.setAttribute('aria-pressed', show[m]); hot = -1; draw(); if (!sel) say(idle(), true); });
  msg.innerHTML = idle();
  // the dots fade in, the agent rings three runs that cost a lot for a middling score, then the person selects the cheap,
  // high scoring corner and asks why
  c.run(async () => { await c.wait(250); for (let i = 0; i <= R.length; i += 3){ seen = i; draw(); await c.wait(40); } seen = R.length; draw();
    await c.wait(700); rings = true; draw(); say(`${I('spark','xs')}<span><b>3 outliers</b> cost over $0.45 for a score under 75. Each one looped on the search tool.</span>`, true); });
  if (r === c.st) c.story(async s => {
    await s.beat(7);
    const a = [G.x(.03), G.y(97)], b = [G.x(.2), G.y(88)], pb = pl.getBoundingClientRect();
    await s.point(pl, false); const hand = $('.hand', c.st), hb = hand.parentElement.getBoundingClientRect();
    const put = (x, y) => { hand.style.transform = `translate(${pb.left - hb.left + x}px,${pb.top - hb.top + y}px)`; };
    put(...a); await s.beat(1); rings = false;
    await tween(0, 1, 900, t => { box = [a[0], a[1], a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; put(box[2], box[3]); draw(); });
    sel = R.map((p, i) => i).filter(i => R[i].x >= .03 && R[i].x <= .2 && R[i].y >= 88 && R[i].y <= 97); selected(); await s.beat(3);
    await s.tap($('.cvq-ask', ft)); s.away(); await s.beat(10);
  });
});
/* ---------- Score breakdown ---------- */
DM.def('score-breakdown', (r, c) => {
  // the factors, their weight (the points each can earn), the points earned, the agent's one-line note, and what it would change
  const F = [
    { n:'Accuracy', w:40, e:34, c:'var(--c1)', note:'2 wrong refund amounts in 120 tickets' },
    { n:'Speed', w:20, e:11, c:'var(--c2)', note:'Median reply 6.4s, target under 4s', fix:{ t:'Cache the search results between steps and run the two account lookups at once.', to:17, gain:'About 2.1s faster a reply', after:'Median reply 4.3s, close to the target' } },
    { n:'Cost', w:20, e:16, c:'var(--c3)', note:'$0.11 a ticket, budget $0.12' },
    { n:'Safety', w:20, e:19, c:'var(--c4)', note:'No policy breaks, 1 tone flag' }
  ];
  const LAST = 77;
  const g = $('.sbx-g', r), svg = $('svg', g), vb = $('.sbx-v b', r), bw = $('.sbx-bw', r), ch = $('.sbx-ch', r), list = $('.sbx-list', r);
  const total = () => F.reduce((t, f) => t + f.e, 0), band = s => s >= 90 ? 'Excellent' : s >= 75 ? 'Good' : s >= 60 ? 'Fair' : 'Needs work';
  const weakest = () => F.reduce((m, f, i) => f.e / f.w < F[m].e / F[m].w ? i : m, 0);
  // the gauge: a half circle split by weight, with a small gap between the segments
  const CX = 100, CY = 100, RAD = 86, GAP = .04;
  const at = a => [CX + Math.cos(a) * RAD, CY + Math.sin(a) * RAD];
  const arc = (a0, a1) => { const [x0, y0] = at(a0), [x1, y1] = at(a1); return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${RAD} ${RAD} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`; };
  let a = Math.PI; const SEG = F.map(f => { const span = f.w / 100 * Math.PI, s = [a + GAP / 2, a + span - GAP / 2]; a += span; return s; });
  svg.innerHTML = F.map((f, i) => `<g data-i="${i}"><path class="tr" d="${arc(...SEG[i])}"/><path class="fl" style="stroke:${f.c}" d=""/></g>`).join('');
  const G = $$('g', svg);
  const fill = (i, p) => { const [a0, a1] = SEG[i]; $('.fl', G[i]).setAttribute('d', p > 0 ? arc(a0, a0 + (a1 - a0) * Math.min(1, p)) : ''); };
  list.innerHTML = F.map((f, i) => `<div class="sbx-r" data-i="${i}"><button class="sbx-rh" aria-expanded="false"><i style="background:${f.c}"></i><span class="n"><span>${f.n}</span></span><span class="e num"></span><span class="bar"><i style="background:${f.c}"></i></span>${I('chev-r','xs')}<span class="sbx-nt">${f.note}</span></button><div class="fold shut"><div><div class="sbx-d"></div></div></div></div>`).join('');
  const R = $$('.sbx-r', list);
  let score = 0, shownFill = F.map(() => 0);
  function paint(ms = 700){
    const s = total(), w = weakest();
    tween(score, s, ms, x => { vb.textContent = Math.round(x); }); score = s;
    g.setAttribute('aria-valuenow', s); g.setAttribute('aria-valuetext', `${s} of 100, ${band(s).toLowerCase()}, ${s - LAST >= 0 ? 'up' : 'down'} ${Math.abs(s - LAST)} since last week`);
    swap(bw, band(s)); ch.hidden = false; ch.className = 'tag num sbx-ch ' + (s >= LAST ? 'ok' : 'bad'); swap(ch, `${s >= LAST ? '+' : '−'}${Math.abs(s - LAST)} since last week`);
    F.forEach((f, i) => { const row = R[i], from = shownFill[i], to = f.e / f.w; shownFill[i] = to; tween(from, to, ms + i * 120, p => fill(i, p));
      $('.e', row).textContent = `${f.e}/${f.w}`; $('.bar i', row).style.width = to * 100 + '%'; $('.sbx-nt', row).textContent = f.note;
      // the weakest factor is flagged in words
      const n = $('.n', row), tag = $('.tag', n); if (i === w && !tag) n.insertAdjacentHTML('beforeend', '<span class="tag warn">Weakest</span>'); if (i !== w && tag) tag.remove();
      $('.sbx-rh', row).setAttribute('aria-label', `${f.n}: ${f.e} of ${f.w} points${i === w ? ', weakest' : ''}. ${f.note}`); detail(i); });
  }
  // an open row: the note, and for the factor that can improve, Improve, which asks the agent for a proposal
  function detail(i){ const f = F[i], d = $('.sbx-d', R[i]); if (d.dataset.st === 'busy' || d.dataset.st === 'prop') return;
    const lost = f.w - f.e;
    d.innerHTML = `<span>${f.done ? f.done + ' ' : ''}${lost ? `Loses ${lost} of its ${f.w} points` : 'Full marks'}${i === weakest() && lost ? ', the most of any factor for its weight.' : '.'}</span>${f.fix ? `<span class="acts"><button class="pill soft sm sbx-imp">${I('wand','xs')}Improve</button></span>` : ''}`;
    const b = $('.sbx-imp', d); if (b) b.onclick = () => improve(i); }
  const improve = i => c.run(async () => { const f = F[i], d = $('.sbx-d', R[i]); d.dataset.st = 'busy';
    d.innerHTML = `<div class="sbx-pr"><span class="k">${I('spark','xs')}<span class="shim">Looking at 120 slow replies</span></span></div>`; enter(d.firstElementChild);
    await c.wait(1300);
    d.dataset.st = 'prop';
    d.innerHTML = `<div class="sbx-pr"><span class="k">${I('spark','xs')}Proposal</span><span>${f.fix.t}</span><span class="gain">${f.fix.gain}: ${f.n} <b class="num">${f.e} → ${f.fix.to}</b></span><span class="acts"><button class="pill primary sm sbx-ok">Apply</button><button class="pill ghost sm sbx-no">Not now</button></span></div>`;
    $('.sbx-ok', d).onclick = () => { f.e = f.fix.to; f.note = f.fix.after; f.done = 'Applied: search results are cached and the lookups run together.'; delete f.fix; d.dataset.st = ''; paint(900); };
    $('.sbx-no', d).onclick = () => { d.dataset.st = ''; detail(i); $('.sbx-imp', d) && $('.sbx-imp', d).focus({ preventScroll:true }); };
  });
  const open = (i, o) => { const row = R[i]; o = o ?? !row.classList.contains('open'); row.classList.toggle('open', o); $('.fold', row).classList.toggle('shut', !o); $('.sbx-rh', row).setAttribute('aria-expanded', o); };
  // a row and its segment light together, from either side
  const hl = i => { g.classList.toggle('hov', i >= 0); G.forEach((x, j) => x.classList.toggle('on', j === i)); R.forEach((x, j) => x.classList.toggle('on', j === i)); };
  R.forEach((row, i) => { $('.sbx-rh', row).onclick = () => open(i); c.on(row, 'pointerenter', e => { if (e.pointerType !== 'touch') hl(i); }); c.on(row, 'focusin', () => hl(i)); });
  G.forEach((x, i) => { c.on(x, 'pointerenter', e => { if (e.pointerType !== 'touch') hl(i); }); c.on(x, 'pointerleave', () => hl(-1)); });
  c.on(list, 'pointerleave', () => { if (!list.contains(document.activeElement)) hl(-1); });
  c.on(list, 'focusout', e => { if (!list.contains(e.relatedTarget)) hl(-1); });
  vb.textContent = '0';
  c.later(280, () => paint(1000));
  // the preview's story: the weakest factor opens, the agent proposes a fix, the person applies it and the score rises
  if (r === c.st) c.story(async s => {
    await s.beat(5);
    await s.tap($('.sbx-rh', R[1])); await s.beat(3);
    await s.tap($('.sbx-imp', R[1])); s.away();
    await s.until(() => $('.sbx-ok', R[1])); await s.beat(4);
    await s.tap($('.sbx-ok', R[1])); s.away(); await s.beat(6);
  });
});