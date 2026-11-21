/* Dashboard builder template: the data and every interaction. It runs after the shared core (core.js), so it uses the core's
   helpers ($, $$, I, html, seg, swap, tween, reflow, ctl, closePops) and its popovers (data-pop) and tooltips (data-tip). The
   store, its people and its numbers are made up.
   A dashboard is an ordered list of widgets, each one, two or three columns wide on a three-column grid, and as tall as its
   kind needs (a metric one row, a chart three, a table four). The grid places them in order, row by row, each in the first
   place after the one before it where it fits (the way CSS grid places items), so a list and a width are all a layout needs.
   Narrower screens take two columns, then one; a widget is never wider than the grid.
   A drag works out where the widget would land for every place in the list and picks the one nearest the pointer, so what
   the canvas shows never depends on what it showed a moment ago, and nothing flickers between two places.
   The widgets are the library's components, drawn with their classes: Stat cards (a metric), Line chart, Bar chart, Donut
   chart, Funnel, Activity heatmap, Top pages, Account table (recent orders) and Notifications (activity), and a note. */
(() => {
  const app = document.querySelector('.dbb'); if (!app) return;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const sum = a => a.reduce((t, x) => t + x, 0);
  let uid = 0;

  // the floppy disc of Save changes, drawn like the sprite's own icons (the shared sprite has none)
  document.body.insertAdjacentHTML('afterbegin', '<svg style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true"><symbol id="i-save" viewBox="0 0 24 24"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></symbol></svg>');

  // what a screen reader hears: each move, add, size and removal
  const live = $('#dbb-live', app);
  const say = t => { live.textContent = ''; setTimeout(() => { live.textContent = t; }, 40); };
  const coarse = matchMedia('(pointer:coarse)');
  const MT = v => (parseFloat(getComputedStyle(app).getPropertyValue(v)) || .3) * 1000;
  // the focus a script moves: after a mouse or a finger it shows no ring, not even when a modifier key follows (the core's giveBack)
  const refocus = el => { if (!el) return; typeof giveBack === 'function' ? giveBack(el) : el.focus({ preventScroll:true }); };

  /* ---------- people ---------- */
  const P = { MK:['Maya Kim', 'l'], TR:['Theo Reed', 't'], AN:['Ana Novak', 'p'], JB:['Jonah Brooks', 'm'], LC:['Lena Cole', 'b'], SP:['Sam Park', 'y'],
    AS:['Ana Silva', 'b'], TB:['Tom Becker', 'y'], HI:['Hana Ito', 'r'], OH:['Omar Haddad', 'm'], PS:['Priya Shah', 'l'], RF:['Ruby Fox', 'k'] };
  const av = k => `<span class="av" style="background:var(--dm-av-${P[k][1]});color:var(--dm-av-${P[k][1]}-ink)" aria-hidden="true">${k}</span>`;

  /* ---------- the store's numbers ---------- */
  const money = v => '$' + fmt(v), money2 = v => '$' + v.toFixed(2), pct = v => v.toFixed(1) + '%';
  // a metric: its icon, label, value, the change and whether that change is good, the comparison and its sparkline
  const MET = {
    revenue:{ ic:'dollar', k:'Revenue today', v:12480, f:money, ch:'+8.2%', good:true, vs:'Compared with yesterday', sp:[4, 5, 4.5, 6, 5.8, 7, 7.6, 8.4], c:1 },
    orders:{ ic:'list', k:'Orders today', v:183, f:fmt, ch:'+6.4%', good:true, vs:'Compared with yesterday', sp:[5, 4.6, 5.4, 5.2, 6.1, 6, 6.8, 7.2], c:2 },
    aov:{ ic:'coins', k:'Average order', v:68.2, f:money2, ch:'−2.1%', good:false, vs:'Compared with last week', sp:[7, 7.2, 6.8, 6.9, 6.4, 6.6, 6.2, 6.1], c:3 },
    conv:{ ic:'target', k:'Conversion', v:3.4, f:pct, ch:'+0.3 pt', good:true, vs:'Compared with last month', sp:[3, 3.6, 3.4, 4.2, 4.4, 4.1, 4.9, 5.2], c:4 },
    refunds:{ ic:'refresh', k:'Refunds this month', v:1240, f:money, ch:'−18%', good:true, vs:'Compared with last month', sp:[7, 6.4, 6.8, 5.6, 5.2, 4.6, 4.8, 3.9], c:5 },
    customers:{ ic:'users', k:'New customers', v:64, f:fmt, ch:'+12%', good:true, vs:'Compared with last week', sp:[3, 3.4, 4.2, 4, 4.8, 5.6, 5.4, 6.4], c:6 },
    returning:{ ic:'heart', k:'Returning customers', v:38, f:v => Math.round(v) + '%', ch:'+2.4 pt', good:true, vs:'Compared with last month', sp:[4.2, 4.4, 4.3, 4.8, 5, 5.1, 5.5, 5.6], c:2 },
    rating:{ ic:'star', k:'Average rating', v:4.7, f:v => v.toFixed(1) + ' of 5', ch:'+0.1', good:true, vs:'Compared with last month', sp:[6, 6.2, 6.1, 6.4, 6.3, 6.6, 6.7, 6.8], c:4 }
  };
  const MET_ORDER = Object.keys(MET);
  // the line chart: this period against the last, by day (hours), week (days) or month (days)
  const wave = (n, f) => Array.from({ length:n }, (_, i) => f(i));
  const bump = (x, c, w) => Math.exp(-((x - c) ** 2) / (2 * w * w));
  const DAY_A = wave(24, h => 120 + 1150 * bump(h, 12.5, 3.2) + 820 * bump(h, 20, 2.2) + 40 * Math.sin(h * 1.7));
  const DAY_B = wave(24, h => 110 + 980 * bump(h, 12, 3.4) + 700 * bump(h, 20.5, 2.4) + 36 * Math.cos(h * 1.3));
  const WK_A = [10240, 11810, 11120, 12930, 14610, 16240, 13420], WK_B = [9610, 10380, 10920, 11740, 12810, 14130, 12260];
  const MO_A = wave(30, d => 9600 + d * 120 + 2200 * (d % 7 === 4 || d % 7 === 5 ? 1 : 0) + 420 * Math.sin(d * 1.9));
  const MO_B = wave(30, d => 9100 + d * 70 + 1800 * (d % 7 === 4 || d % 7 === 5 ? 1 : 0) + 380 * Math.cos(d * 1.4));
  const RANGES = {
    day:{ a:DAY_A, b:DAY_B, la:'Today', lb:'Yesterday', ax:[[0, '12am'], [6, '6am'], [12, '12pm'], [18, '6pm'], [23, '11pm']], at:i => (i % 12 || 12) + (i < 12 ? 'am' : 'pm'), vs:'yesterday' },
    week:{ a:WK_A, b:WK_B, la:'This week', lb:'Last week', ax:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => [i, d]), at:i => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i], vs:'last week' },
    month:{ a:MO_A, b:MO_B, la:'November', lb:'October', ax:[[0, 'Nov 1'], [7, 'Nov 8'], [14, 'Nov 15'], [21, 'Nov 22'], [29, 'Nov 30']], at:i => 'Nov ' + (i + 1), vs:'October' }
  };
  const LINE = { revenue:{ k:'Revenue', f:money, s:1 }, visitors:{ k:'Visitors', f:fmt, s:.31 } };
  // orders by day, and by week of the month: online, marketplace and in person
  const BARS = {
    w:{ l:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], d:[[96, 31, 12], [112, 36, 14], [104, 30, 11], [126, 41, 15], [141, 47, 21], [158, 52, 34], [119, 38, 26]] },
    m:{ l:['Nov 1', 'Nov 8', 'Nov 15', 'Nov 22', 'Nov 29'], d:[[742, 236, 101], [806, 251, 118], [861, 274, 126], [902, 290, 133], [388, 121, 54]] }
  };
  const CHANNELS = [['Online store', 48.2, 'var(--dm-c1)'], ['Marketplace', 21.5, 'var(--dm-c2)'], ['Wholesale', 12.1, 'var(--dm-c3)'], ['In person', 6.4, 'var(--dm-c4)'], ['Other', 2, 'var(--dm-line-strong)']];
  const FUNNEL = { k:['Visited', 'Added to cart', 'Checked out', 'Paid'], drop:['', 'of visits end without a cart', 'of carts never reach checkout', 'of checkouts are never paid'],
    all:[24800, 4960, 2310, 1620], mobile:[16100, 2900, 1180, 760], desktop:[8700, 2060, 1130, 860] };
  const PRODUCTS = [['Linen throw', 412, 18], ['Stoneware mug', 388, 6], ['Oak serving board', 241, -4], ['Wool rug', 196, 31], ['Glass carafe', 164, -9]];
  const ORDERS = [['2048', 'AS', 'Paid', 142], ['2047', 'TB', 'Pending', 38.5], ['2046', 'HI', 'Refunded', 86], ['2045', 'OH', 'Paid', 214.9], ['2044', 'PS', 'Paid', 64], ['2043', 'RF', 'Pending', 119.4], ['2042', 'SP', 'Paid', 52]];
  const ST_TONE = { Paid:'ok', Pending:'warn', Refunded:'' };
  const ACTIVITY = [['Today', [['TR', 'refunded order <b>#2046</b>', '12 min ago'], ['AN', 'restocked <b>24 Linen throws</b>', '1 hour ago'], ['LC', 'published the <b>Winter sale</b> page', '3 hours ago']]],
    ['Earlier', [['JB', 'answered <b>6 product questions</b>', 'Yesterday'], ['SP', 'added <b>Glass carafe</b> to the store', 'Yesterday']]]];

  /* ---------- the widgets: the palette's order, each one's size and the component it is ---------- */
  const KINDS = {
    metric:{ n:'Metric', w:1, h:1, from:'Stat cards' },
    line:{ n:'Line chart', w:2, h:3, from:'Line chart' },
    bar:{ n:'Bar chart', w:2, h:3, from:'Bar chart' },
    donut:{ n:'Donut', w:1, h:3, from:'Donut chart' },
    funnel:{ n:'Funnel', w:1, h:3, from:'Funnel' },
    heat:{ n:'Heatmap', w:2, h:3, from:'Activity heatmap' },
    top:{ n:'Top list', w:1, h:3, from:'Top pages' },
    table:{ n:'Table', w:2, h:4, from:'Account table' },
    act:{ n:'Activity', w:1, h:4, from:'Notifications' },
    note:{ n:'Note', w:1, h:3, from:'Note' }
  };
  const titleOf = it => it.t === 'metric' ? MET[it.v].k : it.t === 'line' ? LINE[it.v || 'revenue'].k : { bar:'Orders by day', donut:'Sales by channel', funnel:'Checkout', heat:'Busiest hours', top:'Top products', table:'Recent orders', act:'Activity', note:'Winter sale' }[it.t];
  const W = (t, w, v) => ({ id:'w' + (++uid), t, w, v });
  const SHOWN = { all:['Everyone', 'users', 'Shown to everyone'], mgr:['Managers', 'shield', 'Shown to managers'], me:['Only me', 'lock', 'Only you can see it'] };
  // no dashboard opens on a band of stat cards (owner, 19 Nov): the metrics stand in a column beside the main chart
  const DASH = {
    overview:{ name:'Overview', shown:'all', items:[W('line', 2, 'revenue'), W('metric', 1, 'revenue'), W('metric', 1, 'orders'), W('metric', 1, 'aov'), W('table', 2), W('act', 1)] },
    sales:{ name:'Sales', shown:'mgr', items:[W('bar', 2), W('metric', 1, 'conv'), W('metric', 1, 'refunds'), W('metric', 1, 'customers'), W('heat', 2), W('funnel', 1), W('donut', 1), W('top', 1), W('note', 1)] },
    customers:{ name:'Customers', shown:'all', items:[W('metric', 1, 'customers'), W('line', 2, 'visitors'), W('metric', 1, 'returning'), W('metric', 1, 'rating'), W('table', 2), W('act', 1)] }
  };
  let cur = 'overview';

  /* ---------- the grid: order and widths in, places out ---------- */
  function pack(items, cols){
    const occ = new Set(), at = (x, y) => y * 16 + x; let cx = 0, cy = 0;
    return items.map(it => {
      const w = Math.min(it.w, cols), h = KINDS[it.t].h; let x = cx, y = cy;
      for (;;){
        if (x + w > cols){ x = 0; y++; continue; }
        let ok = true;
        for (let yy = y; yy < y + h && ok; yy++) for (let xx = x; xx < x + w; xx++) if (occ.has(at(xx, yy))){ ok = false; break; }
        if (ok) break; x++;
      }
      for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) occ.add(at(xx, yy));
      cx = x + w; cy = y;
      return { x, y, w, h };
    });
  }
  // the columns a grid of this width has room for: three, then two, then one
  const colsFor = wd => wd >= 600 ? 3 : wd >= 400 ? 2 : 1;

  /* ---------- drawing the widgets ---------- */
  const seg2 = (cls, label, opts, on) => `<div class="seg2 ${cls}" role="group" aria-label="${label}">${opts.map(([v, t]) => `<button aria-pressed="${v === on}" data-v="${v}">${t}</button>`).join('')}</div>`;
  const smooth = p => p.map((q, i) => { if (!i) return `M${q[0].toFixed(1)} ${q[1].toFixed(1)}`; const a = p[i - 1], m = (q[0] - a[0]) / 2; return `C${(a[0] + m).toFixed(1)} ${a[1].toFixed(1)} ${(q[0] - m).toFixed(1)} ${q[1].toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`; }).join(' ');
  const spark = s => { const lo = Math.min(...s) - .5, hi = Math.max(...s) + .5; return s.map((y, k) => `${k ? 'L' : 'M'}${(k / (s.length - 1) * 100).toFixed(1)} ${(28 - (y - lo) / (hi - lo) * 26).toFixed(1)}`).join(' '); };
  const MD = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

  const VIEWS = {
    metric:{
      html:it => { const m = MET[it.v]; return `<div class="scx-c panel dbb-p dbb-met"><div class="dbb-mt"><span class="scx-k"><span class="ic dbb-ic">${I(m.ic, 'xs')}</span><span class="t">${m.k}</span></span><div class="scx-v"><b class="num">${m.f(m.v)}</b><span class="tag scx-d num ${m.good ? 'ok' : 'bad'}" data-tip="${m.vs}">${m.ch}</span></div></div><div class="scx-sp" aria-hidden="true"><svg viewBox="0 0 100 30" preserveAspectRatio="none"><path stroke="var(--dm-c${m.c})" d="${spark(m.sp)}"/></svg></div></div>`; },
      draw:(el, it, o) => { if (!o.anim || REDUCE) return; const m = MET[it.v], b = $('b', el); tween(0, m.v, 900, v => { b.textContent = m.f(v); }).then(() => { b.textContent = m.f(m.v); });
        $('.scx-sp svg', el).animate([{ clipPath:'inset(-4px 100% -4px 0)' }, { clipPath:'inset(-4px 0% -4px 0)' }], { duration:1000, delay:200, easing:'cubic-bezier(.45,0,.2,1)', fill:'backwards' }); }
    },
    line:{
      html:(it, u) => { const L = LINE[it.v || 'revenue']; return `<div class="lnx panel dbb-p dbb-line"><div class="lnx-h"><div><span class="muted">${L.k}</span><b class="num lnx-v">0</b></div><div class="dbb-lr"><div class="lnx-lg"><button class="lnx-k on" data-s="0" aria-pressed="true"><i style="background:var(--dm-accent-mark,var(--dm-accent))"></i><span></span></button><button class="lnx-k on" data-s="1" aria-pressed="true"><i style="background:var(--dm-c2)"></i><span></span></button></div>${seg2('dbb-rg', 'Range', [['day', 'Day'], ['week', 'Week'], ['month', 'Month']], 'week')}</div></div><div class="lnx-ch"><svg class="lnx-svg" viewBox="0 0 320 140" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="lng-${u}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--dm-accent-mark,var(--dm-accent))" stop-opacity=".16"/><stop offset="1" stop-color="var(--dm-accent-mark,var(--dm-accent))" stop-opacity="0"/></linearGradient><clipPath id="lnc-${u}"><rect class="lnr" x="0" y="-10" width="320" height="160"/></clipPath></defs><g class="dbb-gl"></g><g clip-path="url(#lnc-${u})"><path class="ar" fill="url(#lng-${u})"/><path class="ln l1" stroke="var(--dm-c2)" stroke-dasharray="4 4"/><path class="ln l0" stroke="var(--dm-accent-mark,var(--dm-accent))"/></g></svg><div class="lnx-x"></div><span class="lnx-pt on" style="color:var(--dm-accent-mark,var(--dm-accent))"></span><span class="lnx-pt on" style="color:var(--dm-c2)"></span><div class="lnx-tt"><b class="num"></b><span></span></div></div><div class="lnx-ax muted num" aria-hidden="true"></div></div>`; },
      draw:(el, it, o) => {
        const L = LINE[it.v || 'revenue'], svg = $('.lnx-svg', el), ch = $('.lnx-ch', el), v = $('.lnx-v', el), tt = $('.lnx-tt', el), x = $('.lnx-x', el), pts = $$('.lnx-pt', ch), on = [true, true];
        let R, A, B, pa, pb;
        const total = () => sum(on[0] ? A : B);
        function draw(k, anim){
          R = RANGES[k]; A = R.a.map(n => n * L.s); B = R.b.map(n => n * L.s);
          const all = [...A, ...B], lo = Math.min(...all) * .92, hi = Math.max(...all) * 1.04, n = A.length - 1;
          const P = s => s.map((d, i) => [i / n * 320, 136 - (d - lo) / (hi - lo) * 128]); pa = P(A); pb = P(B);
          $('.dbb-gl', svg).innerHTML = [35, 70, 105].map(y => `<line class="gl" x1="0" x2="320" y1="${y}" y2="${y}"/>`).join('');
          $('.ar', svg).setAttribute('d', smooth(pa) + ' L320 140 L0 140 Z'); $('.l0', svg).setAttribute('d', smooth(pa)); $('.l1', svg).setAttribute('d', smooth(pb));
          $$('.lnx-k span', el).forEach((s, i) => { s.textContent = i ? R.lb : R.la; });
          $('.lnx-ax', el).innerHTML = R.ax.map(([i, t]) => `<span style="left:${i / n * 100}%"${i === n ? ' class="e"' : ''}>${t}</span>`).join('');
          if (anim && !REDUCE){ tween(0, 320, 1100, w => $('.lnr', svg).setAttribute('width', w), t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); tween(0, total(), 1100, n => { v.textContent = L.f(n); }).then(() => { v.textContent = L.f(total()); }); }
          else v.textContent = L.f(total());
        }
        draw('week', o.anim);
        if (!o.live) return;
        seg($('.dbb-rg', el), k => draw(k, true));
        ch.addEventListener('pointermove', e => {
          const b = ch.getBoundingClientRect(), n = A.length - 1, i = clamp(Math.round((e.clientX - b.left) / b.width * n), 0, n), px = i / n * b.width;
          x.style.left = px + 'px';
          [pa, pb].forEach((p, k) => { pts[k].style.left = px + 'px'; pts[k].style.top = p[i][1] / 140 * b.height + 'px'; pts[k].classList.toggle('on', on[k]); });
          const a = on[0] ? A[i] : B[i], dv = Math.round((A[i] / B[i] - 1) * 100);
          $('b', tt).textContent = L.f(a); $('span', tt).textContent = R.at(i) + (on[0] && on[1] ? `, ${dv < 0 ? '−' : '+'}${Math.abs(dv)}% on ${R.vs}` : '');
          const w = tt.offsetWidth; tt.style.left = Math.max(0, px + 12 + w <= b.width ? px + 12 : px - 12 - w) + 'px';
        });
        $$('.lnx-k', el).forEach(k => k.addEventListener('click', () => { const s = +k.dataset.s; if (on[s] && !on[1 - s]) return; on[s] = !on[s]; k.classList.toggle('on', on[s]); k.setAttribute('aria-pressed', on[s]); $('.l' + s, svg).classList.toggle('off', !on[s]); if (s === 0) $('.ar', svg).style.opacity = on[0] ? 1 : 0; v.textContent = L.f(total()); }));
      }
    },
    bar:{
      html:() => `<div class="bcx panel dbb-p dbb-bar"><div class="bcx-h"><div><span class="muted">Orders by day</span><b class="num bcx-v">0</b></div>${seg2('bcx-rg', 'Range', [['w', 'Week'], ['m', 'Month']], 'w')}</div><div class="bcx-ch">${BARS.w.l.map(() => '<div class="bcx-b"><div class="bcx-tt"></div><div class="bcx-st"><i></i></div><div class="bcx-l"></div></div>').join('')}</div></div>`,
      draw:(el, it, o) => {
        const ch = $('.bcx-ch', el), v = $('.bcx-v', el); let tot = 0;
        function draw(k, anim){
          const d = BARS[k], bars = $$('.bcx-b', ch), mx = Math.max(...d.d.map(sum)) * 1.08;
          bars.forEach((b, i) => { const x = d.d[i]; b.hidden = !x; if (!x) return; const s = sum(x);
            $('.bcx-l', b).textContent = d.l[i];
            $('.bcx-tt', b).innerHTML = `<b class="num">${fmt(s)} orders</b><span class="num">${fmt(x[0])} online</span><span class="num">${fmt(x[1])} marketplace</span><span class="num">${fmt(x[2])} in person</span>`;
            const st = $('.bcx-st', b), to = (s / mx).toFixed(3);
            if (anim && !REDUCE){ st.style.setProperty('--v', 0); setTimeout(() => st.style.setProperty('--v', to), 60 + i * 45); } else st.style.setProperty('--v', to); });
          const t = sum(d.d.map(sum));
          if (anim && !REDUCE) tween(tot, t, 900, n => { v.textContent = fmt(n); }).then(() => { v.textContent = fmt(t); }); else v.textContent = fmt(t);
          tot = t;
        }
        draw('w', o.anim);
        if (!o.live) return;
        seg($('.bcx-rg', el), k => draw(k, true));
        // a bar's readout sits beside it, level with its top, on whichever side has room, and follows it as it grows
        const place = b => { const tt = $('.bcx-tt', b), st = $('.bcx-st', b), H = ch.clientHeight, w = tt.offsetWidth, h = tt.offsetHeight, bl = b.offsetLeft, bw = b.offsetWidth, base = H - st.offsetTop - st.offsetHeight;
          tt.style.bottom = Math.max(base, Math.min(H - h, base + st.offsetHeight - h)) + 'px'; tt.style.left = Math.max(-bl, Math.min(ch.clientWidth - bl - w, bl + bw + 6 + w <= ch.clientWidth ? bw + 6 : -w - 6)) + 'px'; };
        let hot = null; const follow = () => { if (!hot) return; place(hot); requestAnimationFrame(follow); };
        $$('.bcx-b', ch).forEach(b => { b.addEventListener('pointerenter', () => { const was = hot; hot = b; if (!was) follow(); }); b.addEventListener('pointerleave', () => { if (hot === b) hot = null; }); });
      }
    },
    donut:{
      html:() => `<div class="dnx panel dbb-p dbb-dn"><div class="dbb-wh"><b>Sales by channel</b><span class="muted">This month</span></div><div class="dbb-dnb"><div class="dnx-ring"><svg viewBox="0 0 120 120" aria-hidden="true"></svg><div class="dnx-c"><b class="num dnx-v"></b><span class="muted dnx-l">All channels</span></div></div><div class="dnx-lg"></div></div></div>`,
      draw:(el, it, o) => {
        const tot = sum(CHANNELS.map(d => d[1])), C = 2 * Math.PI * 48, gap = 2, svg = $('svg', el), lg = $('.dnx-lg', el), ring = $('.dnx-ring', el), v = $('.dnx-v', el), l = $('.dnx-l', el);
        let off = 0;
        svg.innerHTML = CHANNELS.map((d, i) => { const len = d[1] / tot * C; const s = `<circle cx="60" cy="60" r="48" stroke="${d[2]}" stroke-dasharray="${o.anim && !REDUCE ? 0 : len - gap} ${C}" stroke-dashoffset="${-off}" data-i="${i}" data-len="${len - gap}"/>`; off += len; return s; }).join('');
        lg.innerHTML = CHANNELS.map((d, i) => `<div class="dnx-r" data-i="${i}"><i style="background:${d[2]}"></i><span class="t">${d[0]}</span><span class="v num">$${d[1].toFixed(1)}k</span></div>`).join('');
        const arcs = $$('circle', svg), rows = $$('.dnx-r', lg), whole = '$' + tot.toFixed(1) + 'k';
        v.textContent = whole;
        if (o.anim && !REDUCE) setTimeout(() => arcs.forEach((a, i) => setTimeout(() => a.setAttribute('stroke-dasharray', `${a.dataset.len} ${C}`), i * 90)), 200);
        if (!o.live) return;
        const hl = i => { ring.classList.toggle('hov', i != null); arcs.forEach((a, j) => a.classList.toggle('hl', j === i)); rows.forEach((x, j) => x.classList.toggle('hl', j === i));
          if (i == null){ v.textContent = whole; l.textContent = 'All channels'; } else { v.textContent = Math.round(CHANNELS[i][1] / tot * 100) + '%'; l.textContent = CHANNELS[i][0]; } };
        [...arcs, ...rows].forEach(x => { x.addEventListener('pointerenter', () => hl(+x.dataset.i)); x.addEventListener('pointerleave', () => hl(null)); });
      }
    },
    funnel:{
      html:() => `<div class="fnx panel dbb-p dbb-fn"><div class="fnx-h"><b>Checkout</b>${seg2('fnx-sg', 'Device', [['all', 'All'], ['mobile', 'Mobile'], ['desktop', 'Desktop']], 'all')}</div><div class="fnx-rows">${FUNNEL.k.map((k, i) => `<div class="fnx-r" style="--dm-fc:color-mix(in oklab,var(--dm-c1) ${100 - i * 30}%,var(--dm-c2))"><span class="k">${k}</span><div class="tr"><div class="bar" style="width:0"></div><span class="n num"></span></div><span class="v num"></span></div>`).join('')}</div><div class="fnx-ins"><span class="fnx-ic">${I('info', 'xs')}</span><span class="fnx-t"></span></div></div>`,
      draw:(el, it, o) => {
        const R = $$('.fnx-r', el), txt = $('.fnx-t', el);
        function draw(s, anim){
          const d = FUNNEL[s]; let worst = 1, wv = 1;
          d.forEach((n, i) => { if (i && n / d[i - 1] < wv){ wv = n / d[i - 1]; worst = i; } });
          R.forEach((row, i) => { const w = Math.max(6, d[i] / d[0] * 100), nn = $('.n', row), bar = $('.bar', row);
            if (anim && !REDUCE){ bar.style.transition = 'none'; bar.style.width = '0%'; void bar.offsetWidth; bar.style.transition = ''; setTimeout(() => { bar.style.width = w + '%'; }, 80 + i * 70); } else bar.style.width = w + '%';
            nn.classList.toggle('out', w < 24); nn.style.left = w < 24 ? `calc(${w}% + 8px)` : '10px'; nn.textContent = fmt(d[i]);
            $('.v', row).textContent = i ? '−' + Math.round((1 - d[i] / d[i - 1]) * 100) + '%' : '100%'; row.classList.toggle('drop', i === worst); });
          const t = `The biggest drop: ${Math.round((1 - wv) * 100)}% ${FUNNEL.drop[worst]}.`;
          anim ? swap(txt, t) : (txt.textContent = t);
        }
        draw('all', o.anim);
        if (o.live) seg($('.fnx-sg', el), s => draw(s, true));
      }
    },
    heat:{
      html:() => `<div class="hmx panel dbb-p dbb-hm"><div class="hmx-h"><div><b>Busiest hours</b><span class="muted hmx-st">Last 4 weeks</span></div>${seg2('hmx-sg', 'Show', [['orders', 'Orders'], ['visits', 'Visits']], 'orders')}</div><div class="hmx-wrap"><div class="hmx-sc"><div class="hmx-days muted" aria-hidden="true"><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span><span>Sun</span></div><div class="hmx-grid">${'<i style="--dm-a:0"></i>'.repeat(168)}</div><div class="hmx-f muted" aria-hidden="true"><span class="hmx-ax">12am</span><span class="hmx-ax x">3am</span><span class="hmx-ax">6am</span><span class="hmx-ax x">9am</span><span class="hmx-ax">12pm</span><span class="hmx-ax x">3pm</span><span class="hmx-ax">6pm</span><span class="hmx-ax x">9pm</span></div></div></div><div class="hmx-lg muted" aria-hidden="true">Less<i style="--dm-a:.08"></i><i style="--dm-a:.3"></i><i style="--dm-a:.55"></i><i style="--dm-a:.85"></i>More</div></div>`,
      draw:(el, it, o) => {
        const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], cells = $$('.hmx-grid i', el);
        const gen = w => cells.map((_, i) => { const d = Math.floor(i / 24), h = i % 24;
          let v = w === 'orders' ? .05 + .7 * bump(h, 12.5, 2.6) + .6 * bump(h, 20, 1.8) : .04 + .5 * bump(h, 13, 3.4) + .75 * bump(h, 21, 2.2);
          if (d >= 5) v *= w === 'orders' ? 1.25 : 1.1; return clamp(v + Math.sin(d * 7.1 + h * 3.3) * .1, 0, 1); });
        function draw(w, anim){ const D = gen(w); cells.forEach((c, i) => { const d = Math.floor(i / 24), h = i % 24, a = (D[i] * .9).toFixed(2);
          if (anim && !REDUCE) setTimeout(() => c.style.setProperty('--dm-a', a), (h + d) * 12); else c.style.setProperty('--dm-a', a);
          c.dataset.tip = `${DAYS[d]} ${(h % 12 || 12) + (h < 12 ? 'am' : 'pm')}: ${Math.round(D[i] * (w === 'orders' ? 26 : 340))} ${w}`; }); }
        draw('orders', o.anim);
        if (o.live) seg($('.hmx-sg', el), w => draw(w, true));
        // on a narrow card the grid scrolls sideways (Activity heatmap's phone layout): it starts on the evening hours
        const sc = $('.hmx-sc', el); requestAnimationFrame(() => { sc.scrollLeft = sc.scrollWidth; });
      }
    },
    top:{
      html:() => `<div class="tpx panel dbb-p dbb-top"><div class="tpx-h"><div><b>Top products</b><span class="muted tpx-sub">Units sold, last 30 days</span></div>${seg2('tpx-sg', 'Sort', [['v', 'Units'], ['c', 'Change']], 'v')}</div><div class="tpx-list" role="list">${PRODUCTS.map(p => `<div class="tpx-r" role="listitem"><span class="rk"></span><span class="pg"><span class="p">${p[0]}</span><span class="tr"><i></i></span></span><span class="n num">${fmt(p[1])}</span><span class="tag ch num ${p[2] >= 0 ? 'ok' : 'bad'}">${p[2] >= 0 ? '+' : '−'}${Math.abs(p[2])}%</span></div>`).join('')}</div></div>`,
      draw:(el, it, o) => {
        const rows = $$('.tpx-r', el), list = $('.tpx-list', el), mx = PRODUCTS[0][1], H = 48; let by = 'v', fits = 4;
        // the rows the card has room for show; a sort brings others up into them
        const sort = k => { by = k; const order = [...PRODUCTS].sort((a, b) => k === 'v' ? b[1] - a[1] : b[2] - a[2]);
          rows.forEach((row, i) => { const j = order.indexOf(PRODUCTS[i]), off = j >= fits; row.style.transform = `translateY(${j * H}px)`; $('.rk', row).textContent = j + 1; row.classList.toggle('dbb-off', off); row.setAttribute('aria-hidden', off); }); };
        const fit = () => { const n = clamp(Math.floor((list.clientHeight + 4) / H), 1, PRODUCTS.length); if (n !== fits){ fits = n; sort(by); } };
        sort('v'); fit(); new ResizeObserver(fit).observe(list);
        rows.forEach((row, i) => { const w = PRODUCTS[i][1] / mx * 100 + '%', bar = $('.tr i', row); if (o.anim && !REDUCE) setTimeout(() => { bar.style.width = w; }, 260 + i * 70); else { bar.style.transition = 'none'; bar.style.width = w; } });
        if (o.live) seg($('.tpx-sg', el), sort);
      }
    },
    table:{
      html:() => `<div class="atb panel dbb-p dbb-tb2"><div class="atb-h"><b class="dbb-tt">Recent orders</b><div class="atb-fl" role="group" aria-label="Status">${['All', 'Paid', 'Pending', 'Refunded'].map((s, i) => `<button class="chip sm${i ? '' : ' on'}" aria-pressed="${!i}" data-p="${i ? s : ''}">${s}</button>`).join('')}</div></div><div class="atb-sc"><table><thead><tr><th>Order</th><th>Customer</th><th>Status</th><th class="r">Total</th></tr></thead><tbody></tbody></table></div></div>`,
      draw:(el, it, o) => {
        const tb = $('tbody', el);
        const paint = p => { const L = ORDERS.filter(r => !p || r[2] === p).slice(0, 6);
          tb.innerHTML = L.length ? L.map(r => `<tr><td class="num">#${r[0]}</td><td><span class="nm">${av(r[1])}${P[r[1]][0]}</span></td><td><span class="tag ${ST_TONE[r[2]]}">${r[2]}</span></td><td class="r num">${money2(r[3])}</td></tr>`).join('') : '<tr class="atb-empty"><td colspan="4">No orders</td></tr>'; };
        paint('');
        if (!o.live) return;
        $$('.atb-fl .chip', el).forEach(b => b.addEventListener('click', () => { $$('.atb-fl .chip', el).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); paint(b.dataset.p); }));
      }
    },
    act:{
      html:() => `<div class="ntx panel dbb-p dbb-act"><div class="ntx-h"><b>Activity</b></div><div class="ntx-list">${ACTIVITY.map(([g, rows]) => `<div class="dbb-ag">${g}</div>${rows.map(([k, t, w]) => `<div class="ntx-n read"><span class="ic">${av(k)}</span><span class="t"><b>${P[k][0]}</b> ${t}<span>${w}</span></span></div>`).join('')}`).join('')}</div></div>`,
      draw:(el, it, o) => {
        if (o.anim && !REDUCE) stagger($$('.ntx-n', el), 50);
        // as many rows as the card has room for, and a day's label only over rows that show
        const list = $('.ntx-list', el), fit = () => {
          const kids = [...list.children], H = list.clientHeight; kids.forEach(k => { k.hidden = false; });
          kids.forEach(k => { if (k.offsetTop + k.offsetHeight > H + 1) k.hidden = true; });
          kids.forEach((k, i) => { if (k.classList.contains('dbb-ag')){ const nx = kids[i + 1]; k.hidden = !nx || nx.hidden || nx.classList.contains('dbb-ag'); } });
        };
        fit(); new ResizeObserver(fit).observe(list);
      }
    },
    note:{
      html:() => `<div class="panel dbb-p dbb-note"><div class="dbb-wh"><b>Winter sale</b><span class="muted">Note from Maya</span></div><div class="dbb-md"><p>${MD('Runs until **December 2**, with free shipping on orders over $50.')}</p><ul><li>${MD('Gift wrap is free on **Linen throws**')}</li><li>${MD('Restock **Wool rugs** before Friday')}</li><li>${MD('Last orders for Christmas: **December 18**')}</li></ul></div></div>`,
      draw:() => {}
    }
  };

  /* ---------- a grid on the page: its widgets, their places, and the empty cells behind them in edit mode ---------- */
  function Grid(el, edit){
    const g = { el, edit, items:[], cols:3 };
    g.cols = colsFor(el.clientWidth || 900);
    g.node = it => $(`.dbb-w[data-key="${it.id}"]`, el);
    g.metrics = () => { const cs = getComputedStyle(el), gap = parseFloat(cs.columnGap) || 12, R = parseFloat(cs.gridAutoRows) || 88, cw = (el.clientWidth - gap * (g.cols - 1)) / g.cols; return { gap, R, cw }; };
    g.box = p => { const { gap, R, cw } = g.metrics(); return { x:p.x * (cw + gap), y:p.y * (R + gap), w:p.w * cw + (p.w - 1) * gap, h:p.h * R + (p.h - 1) * gap }; };
    // every widget (and a placeholder for one on its way from the palette) in its place
    g.place = () => {
      const list = g.items, P = pack(list, g.cols); let rows = 0;
      list.forEach((it, i) => { const n = g.node(it); if (!n) return; const p = P[i]; n.style.gridColumn = `${p.x + 1} / span ${p.w}`; n.style.gridRow = `${p.y + 1} / span ${p.h}`; n.dataset.w = p.w; n.dataset.h = p.h; rows = Math.max(rows, p.y + p.h); });
      el.style.setProperty('--dbb-cols', g.cols);
      order(list);
      if (edit) cells(rows);
      return P;
    };
    // the page's order follows the list, so Tab and a screen reader meet the widgets as they are laid out. The widget that holds
    // the focus stays where it is in the page and the others move round it, so moving one from the keyboard never drops the focus
    function order(list){
      const nodes = list.map(g.node).filter(Boolean), now = $$('.dbb-w:not([data-ghost])', el);
      if (nodes.every((n, i) => now[i] === n)) return;
      const f = nodes.find(n => n.contains(document.activeElement)) || nodes[0], k = nodes.indexOf(f);
      for (let i = 0; i < k; i++) el.insertBefore(nodes[i], f);
      let ref = f; for (let i = k + 1; i < nodes.length; i++){ ref.after(nodes[i]); ref = nodes[i]; }
    }
    // the empty cells: under the widgets and two rows past the last, and enough to fill the canvas
    function cells(rows){
      const { R, gap } = g.metrics(), sc = el.closest('.dbb-cv'), fill = sc ? Math.ceil((sc.clientHeight - el.offsetTop) / (R + gap)) : 0;
      const n = Math.max(rows + 2, fill, 4) * g.cols, have = $$('.dbb-cell', el);
      if (have.length === n && el._cc === g.cols) return; el._cc = g.cols;
      have.forEach(c => c.remove());
      const f = document.createDocumentFragment();
      for (let i = 0; i < n; i++){ const c = document.createElement('i'); c.className = 'dbb-cell'; c.setAttribute('aria-hidden', 'true'); c.style.gridColumn = (i % g.cols) + 1; c.style.gridRow = Math.floor(i / g.cols) + 1; f.appendChild(c); }
      el.prepend(f);
    }
    // a change to the list or a width, eased: the widgets that stay glide to their new places, a new one fades in and one that
    // went fades out where it was (the core's reflow())
    g.move = (change, o = {}) => reflow(() => $$('.dbb-w', el), () => { change(); g.place(); }, { root:el, ...o });
    g.render = anim => {
      $$('.dbb-w', el).forEach(n => n.remove());
      g.items.forEach(it => el.appendChild(widget(it, { edit, anim })));
      g.place();
    };
    new ResizeObserver(() => { const c = colsFor(el.clientWidth); if (c !== g.cols){ g.cols = c; g.place(); if (edit) syncSizes(); } else if (edit) cells(Math.max(0, ...pack(g.items, g.cols).map(p => p.y + p.h))); }).observe(el);
    return g;
  }

  // one widget: the component's panel, and in edit mode the toolbar under it (move, remove and the width)
  function widget(it, { edit = false, anim = false } = {}){
    const u = ++uid, t = titleOf(it);
    const n = html(`<div class="dbb-w" role="listitem" data-key="${it.id}" data-t="${it.t}" aria-label="${esc(t)}">${VIEWS[it.t].html(it, u)}${edit ? `<div class="dbb-tb" role="group" aria-label="${esc(t)}"><button class="ib dbb-mv" aria-label="Move ${esc(t)}" aria-describedby="dbb-mvhelp" data-tip="Drag to move">${I('grip')}</button><button class="ib dbb-del" aria-label="Remove ${esc(t)}" data-tip="Remove">${I('trash')}</button><div class="seg2 dbb-sz" role="group" aria-label="Width of ${esc(t)}">${[[1, 'One column'], [2, 'Two columns'], [3, 'Full width, three columns']].map(([v, l]) => `<button aria-pressed="${it.w === v}" data-v="${v}" aria-label="${l}" data-tip="${l.split(',')[0]}"><i class="dbb-g g${v}" aria-hidden="true"></i></button>`).join('')}</div></div>` : ''}</div>`);
    const p = $('.dbb-p', n);
    if (edit){ p.inert = true; p.setAttribute('aria-hidden', 'true'); seg($('.dbb-sz', n), v => setWidth(it, +v)); }
    // drawn once it is on the page (every caller puts it there straight away), so its entrance plays where it is seen
    // in edit mode a widget's switches can't be used, but show their pick as they do on the dashboard
    queueMicrotask(() => { try { VIEWS[it.t].draw(p, it, { anim:anim && n.isConnected, live:!edit }); if (edit) $$('.seg2', p).forEach(s => seg(s)); } catch(e){ console.error(it.t, e); } });
    return n;
  }

  /* ---------- view mode ---------- */
  const vg = Grid($('.dbb-vg', app), false);
  const edBtn = $('.dbb-edit', app);
  function renderView(anim){
    const D = DASH[cur];
    $$('.dbb-nav [data-dash]', app).forEach(b => { const on = b.dataset.dash === cur; on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'); $('.dbb-lock', b).hidden = DASH[b.dataset.dash].shown !== 'me'; });
    $$('.dbb-tabs [data-dash]', app).forEach(b => b.setAttribute('aria-pressed', b.dataset.dash === cur));
    if (dashSeg) dashSeg.place();
    $('.dbb-vg', app).closest('.dbb-sc').querySelector('.dbb-sl').textContent = D.name;
    $('.dbb-vis', app).innerHTML = `${I(SHOWN[D.shown][1], 'xs')}<span>${SHOWN[D.shown][2]}</span>`;
    edBtn.setAttribute('aria-label', `Edit widgets on ${D.name}`);
    vg.items = D.items; vg.render(anim);
  }
  const go = k => { if (k === cur || mode !== 'view') return; cur = k; renderView(true); $('.dbb-main .dbb-sc', app).scrollTop = 0; };
  $$('.dbb-nav [data-dash]', app).forEach(b => b.addEventListener('click', () => go(b.dataset.dash)));
  const dashSeg = seg($('.dbb-tabs', app), k => go(k));

  /* ---------- edit mode ---------- */
  const ed = $('.dbb-ed', app), eg = Grid($('.dbb-eg', app), true), pal = $('.dbb-pal', app), tiles = $('.dbb-tiles', app), cv = $('.dbb-cv', app);
  let mode = 'view', draft = null;
  // the palette: each widget a small drawing of its component, monochrome with the accent, and its name under it
  const ART = {
    metric:'<rect class="g" x="10" y="10" width="20" height="4" rx="2"/><rect class="k" x="10" y="19" width="30" height="7" rx="2"/><rect class="t" x="43" y="19" width="12" height="7" rx="3.5"/><path class="a" d="M10 33 L20 31 L28 32 L38 28 L46 29 L54 25"/>',
    line:'<path class="gl" d="M6 14H58M6 23H58M6 32H58"/><path class="a2" d="M6 30 C14 28 18 24 26 25 S38 20 44 21 S54 16 58 15"/><path class="a" d="M6 31 C12 26 18 27 24 21 S34 22 40 15 S52 13 58 8"/>',
    bar:'<rect class="g" x="8" y="22" width="6" height="12" rx="1.5"/><rect class="g" x="18" y="16" width="6" height="18" rx="1.5"/><rect class="g" x="28" y="19" width="6" height="15" rx="1.5"/><rect class="a" x="38" y="9" width="6" height="25" rx="1.5"/><rect class="g" x="48" y="14" width="6" height="20" rx="1.5"/>',
    donut:'<circle class="ring" cx="32" cy="21" r="11"/><path class="arc" d="M32 10 A11 11 0 0 1 42.5 24.3"/>',
    funnel:'<rect class="a" x="10" y="8" width="44" height="5" rx="2.5"/><rect class="a o2" x="10" y="16" width="31" height="5" rx="2.5"/><rect class="a o3" x="10" y="24" width="19" height="5" rx="2.5"/><rect class="a o4" x="10" y="32" width="11" height="5" rx="2.5"/>',
    heat:[0, 1, 2, 3].map(r => [0, 1, 2, 3, 4, 5, 6].map(c => { const a = [.12, .3, .7, .45, .2, .85, .35][(c + r * 3) % 7]; return `<rect class="h" x="${9 + c * 6.8}" y="${9 + r * 6.8}" width="5.4" height="5.4" rx="1.2" style="--a:${a}"/>`; }).join('')).join(''),
    top:[0, 1, 2].map(r => `<rect class="g" x="10" y="${9 + r * 9}" width="22" height="3" rx="1.5"/><rect class="g2" x="10" y="${14 + r * 9}" width="44" height="2" rx="1"/><rect class="a" x="10" y="${14 + r * 9}" width="${[38, 27, 18][r]}" height="2" rx="1"/>`).join(''),
    table:'<rect class="g" x="8" y="9" width="48" height="4" rx="2"/>' + [0, 1, 2].map(r => `<rect class="g2" x="8" y="${17 + r * 7}" width="16" height="3" rx="1.5"/><rect class="g2" x="27" y="${17 + r * 7}" width="14" height="3" rx="1.5"/><rect class="${r === 1 ? 't' : 'g2'}" x="44" y="${17 + r * 7}" width="12" height="3" rx="1.5"/>`).join(''),
    act:[0, 1, 2].map(r => `<circle class="${r ? 'g' : 'a'}" cx="13" cy="${12 + r * 9}" r="3"/><rect class="g" x="20" y="${10 + r * 9}" width="${[30, 24, 34][r]}" height="3" rx="1.5"/><rect class="g2" x="20" y="${14.5 + r * 9}" width="14" height="2" rx="1"/>`).join(''),
    note:'<text class="aa" x="32" y="26.5" text-anchor="middle">Aa</text>'
  };
  tiles.innerHTML = Object.entries(KINDS).map(([t, k]) => `<div role="listitem"><button class="dbb-tile" data-t="${t}" aria-describedby="dbb-hint"><span class="dbb-art" aria-hidden="true"><span class="dbb-card"><svg viewBox="0 0 64 42">${ART[t]}</svg></span></span><span class="dbb-tn">${k.n}</span></button></div>`).join('');

  const same = (a, b) => JSON.stringify(a.items.map(x => [x.id, x.w])) + a.shown === JSON.stringify(b.items.map(x => [x.id, x.w])) + b.shown;
  const markDirty = () => { const d = draft && !same(draft, DASH[cur]); const s = $('.dbb-dirty', app), t = d ? 'Unsaved changes' : ''; if (s.textContent !== t) swap(s, t); };
  const shownMenu = $('#dbb-p-shown', app);
  shownMenu.innerHTML = Object.entries(SHOWN).map(([k, s]) => `<button class="mi" role="menuitemradio" aria-checked="false" tabindex="-1" data-v="${k}" data-close>${I(s[1])}<span>${s[0]}</span><span class="ck">${I('check', 'xs')}</span></button>`).join('');
  const syncShown = () => { $('#dbb-shv', app).textContent = SHOWN[draft.shown][0]; $$('[data-v]', shownMenu).forEach(b => b.setAttribute('aria-checked', b.dataset.v === draft.shown)); };
  $('#dbb-p-shown', app).addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (!b) return; draft.shown = b.dataset.v; syncShown(); markDirty(); say(`Shown to ${SHOWN[draft.shown][0].toLowerCase()}`); });
  // the width switches follow the grid: on one column there is nothing to choose
  function syncSizes(){ $$('.dbb-w', eg.el).forEach(n => { const it = eg.items.find(x => x.id === n.dataset.key); if (!it) return; $$('.dbb-sz button', n).forEach(b => b.setAttribute('aria-pressed', +b.dataset.v === it.w)); }); app.dataset.cols = eg.cols; }

  // quiet: the demo's own presses move no focus, so the app never takes the keyboard from a page that shows it in a frame
  function openEditor(quiet){
    if (mode !== 'view') return;
    closePops(); mode = 'edit'; app.dataset.mode = 'edit';
    draft = { items:DASH[cur].items.map(x => ({ ...x })), shown:DASH[cur].shown };
    $('#dbb-et', app).textContent = 'Edit ' + DASH[cur].name; $('.dbb-csl', app).textContent = DASH[cur].name;
    ed.hidden = false; syncShown(); markDirty();
    eg.items = draft.items; eg.cols = colsFor(eg.el.clientWidth); eg.render(false); syncSizes(); empty();
    cv.scrollTop = 0;
    if (!REDUCE) ed.animate([{ opacity:0, transform:'translateY(8px) scale(.99)' }, { opacity:1, transform:'none' }], { duration:MT('--dm-t-slow'), easing:getComputedStyle(app).getPropertyValue('--dm-ease').trim() || 'ease' });
    $('.dbb-view', app).inert = true;
    if (!quiet) $('#dbb-et', app).focus({ preventScroll:true });
  }
  function closeEditor(saved, quiet){
    if (mode !== 'edit') return;
    if (drag) cancelDrag(); if (kdrag) kcancel(true); sheet(false); closePops();
    if (saved){ DASH[cur].items = draft.items; DASH[cur].shown = draft.shown; }
    mode = 'view'; app.dataset.mode = 'view'; draft = null;
    $('.dbb-view', app).inert = false;
    renderView(false);
    const done = () => { ed.hidden = true; $$('.dbb-w', eg.el).forEach(n => n.remove()); };
    if (REDUCE) done(); else ed.animate([{ opacity:1 }, { opacity:0, transform:'translateY(6px) scale(.995)' }], { duration:MT('--dm-t'), easing:'ease-out' }).finished.then(done, done);
    if (!quiet) refocus(edBtn);
    if (saved) toast('ok', `Saved ${DASH[cur].name}`, SHOWN[DASH[cur].shown][2]);
  }
  edBtn.addEventListener('click', e => openEditor(!e.isTrusted));
  $('.dbb-save', app).addEventListener('click', e => closeEditor(true, !e.isTrusted));
  $('.dbb-cancel', app).addEventListener('click', e => closeEditor(false, !e.isTrusted));
  $('.dbb-x', app).addEventListener('click', e => closeEditor(false, !e.isTrusted));

  // an empty dashboard: Clean's empty state over the cells
  function empty(){
    let e = $('.dbb-empty', cv);
    if (draft && !draft.items.length){
      if (!e){ e = html(`<div class="dbb-empty cle-em" role="status"><span class="cle-art tiles" aria-hidden="true"></span><b>Nothing on ${esc(DASH[cur].name)} yet</b><span class="fine">Drag a widget here from the left, or press Enter on one.</span><span class="coarse">Tap a widget on the left to put it here.</span><span class="narrow">Use Add widget to put one here.</span></div>`); cv.appendChild(e); }
    } else if (e) e.remove();
  }

  /* ---------- changes: add, remove, width ---------- */
  // where a widget is, as a screen reader hears it: its row and column, or on one column its place in the list
  const spot = it => { const i = draft.items.indexOf(it), p = pack(draft.items, eg.cols)[i]; return eg.cols === 1 ? `place ${i + 1} of ${draft.items.length}` : `row ${p.y + 1}, column ${p.x + 1}`; };
  function nextMetric(){ const used = new Set(draft.items.filter(x => x.t === 'metric').map(x => x.v)); return MET_ORDER.find(k => !used.has(k)) || MET_ORDER[draft.items.length % MET_ORDER.length]; }
  const fresh = t => W(t, KINDS[t].w, t === 'metric' ? nextMetric() : t === 'line' ? (draft.items.some(x => x.t === 'line' && x.v === 'revenue') ? 'visitors' : 'revenue') : undefined);
  function add(t, at = draft.items.length, { focus = false, quiet = false } = {}){
    const it = fresh(t);
    eg.move(() => { draft.items.splice(at, 0, it); eg.el.appendChild(widget(it, { edit:true, anim:true })); });
    syncSizes(); empty(); markDirty();
    const n = eg.node(it);
    reveal(n);
    if (!quiet) say(`Added ${titleOf(it)}, ${spot(it)}.`);
    if (focus) $('.dbb-mv', n).focus({ preventScroll:true });
    return it;
  }
  function remove(it){
    const i = draft.items.indexOf(it); if (i < 0) return;
    const n = eg.node(it), had = n && n.contains(document.activeElement);
    eg.move(() => { draft.items.splice(i, 1); n && n.remove(); });
    empty(); markDirty();
    if (had){ const to = draft.items[Math.min(i, draft.items.length - 1)]; refocus(to ? $('.dbb-mv', eg.node(to)) : $('.dbb-csl', app)); }
    say(`Removed ${titleOf(it)}. Undo is in the message at the bottom.`);
    const d = draft;
    toast('bad', `Removed ${titleOf(it)}`, '', { t:'Undo', run:() => {
      if (draft !== d || draft.items.includes(it)) return;
      const at = Math.min(i, draft.items.length);
      eg.move(() => { draft.items.splice(at, 0, it); eg.el.appendChild(widget(it, { edit:true })); });
      syncSizes(); empty(); markDirty(); reveal(eg.node(it));
      say(`${titleOf(it)} is back, ${spot(it)}.`);
    } });
  }
  function setWidth(it, w){
    if (it.w === w) return;
    eg.move(() => { it.w = w; });
    syncSizes(); markDirty();
    say(`${titleOf(it)} is now ${w === 3 ? 'full width' : w === 1 ? 'one column wide' : 'two columns wide'}${eg.cols < w ? ' on wider screens' : ''}, ${spot(it)}.`);
  }
  // a widget that changed is brought into view in the canvas, eased unless motion is reduced
  // (the canvas scrolls itself: scrollIntoView would also move a page that shows the app in a frame)
  const reveal = n => { if (!n) return; const c = cv.getBoundingClientRect(), b = n.getBoundingClientRect(), pad = 16;
    const dy = b.top < c.top + pad ? b.top - c.top - pad : b.bottom > c.bottom - pad ? Math.min(b.bottom - c.bottom + pad, b.top - c.top - pad) : 0;
    if (dy) cv.scrollBy({ top:dy, behavior:REDUCE ? 'auto' : 'smooth' }); };

  // the toolbar's buttons and the palette's tiles
  eg.el.addEventListener('click', e => {
    const n = e.target.closest('.dbb-w'); if (!n || mode !== 'edit') return;
    const it = draft.items.find(x => x.id === n.dataset.key); if (!it) return;
    if (e.target.closest('.dbb-del')){ remove(it); return; }
  });
  tiles.addEventListener('click', e => {
    const b = e.target.closest('.dbb-tile'); if (!b) return;
    if (b._dragged){ b._dragged = false; return; }
    const t = b.dataset.t;
    if (pal.classList.contains('open')){ sheet(false); setTimeout(() => add(t), REDUCE ? 0 : 160); return; }
    add(t);
  });

  /* ---------- dragging: a widget across the grid, or a new one from the palette ---------- */
  let drag = null, pend = null, tpend = null, scrollRaf = 0;
  // the place in the list nearest the pointer: for every place the widget could go, where it would land, and the one whose
  // landing spot puts the pointer where it holds the widget. A place only changes when the new one is clearly nearer
  function bestIndex(cx, cy){
    const r = eg.el.getBoundingClientRect(), px = cx - r.left, py = cy - r.top, others = draft.items.filter(x => x !== drag.item);
    let best = -1, bd = Infinity, cd = Infinity;
    for (let i = 0; i <= others.length; i++){
      const L = others.slice(0, i).concat([drag.item], others.slice(i)), b = eg.box(pack(L, eg.cols)[i]);
      const ax = b.x + (drag.kind === 'add' ? b.w / 2 : Math.min(drag.gx, b.w - 12)), ay = b.y + (drag.kind === 'add' ? Math.min(b.h / 2, 60) : Math.min(drag.gy, b.h - 12));
      const d = Math.hypot(ax - px, ay - py);
      if (i === drag.idx) cd = d;
      if (d <= bd + .5){ bd = Math.min(d, bd); best = i; }
    }
    return drag.idx >= 0 && best !== drag.idx && cd - bd < 20 ? drag.idx : best;
  }
  const overCanvas = (x, y) => { const r = cv.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; };
  // the widget in hand: a copy that follows the pointer, over everything, while its place in the grid shows where it lands
  function liftOf(n, kind){
    const a = app.getBoundingClientRect(), b = n.getBoundingClientRect();
    const c = kind === 'add' ? n.cloneNode(true) : $('.dbb-p', n).cloneNode(true);
    // the copy's chart has its own gradient and clip ids: the original's sit under the hidden place it leaves, and a clip
    // drawn from a hidden element hides everything
    $$('[id]', c).forEach(e => { const id = e.id; e.id = id + '-l'; $$('[fill],[clip-path]', c).forEach(x => ['fill', 'clip-path'].forEach(a => { const v = x.getAttribute(a); if (v === `url(#${id})`) x.setAttribute(a, `url(#${id}-l)`); })); });
    const L = html('<div class="dbb-lift" aria-hidden="true"></div>'); L.appendChild(c); L.inert = true;
    L.dataset.kind = kind; Object.assign(L.style, { width:b.width + 'px', height:b.height + 'px' });
    app.appendChild(L); L._x = b.left - a.left; L._y = b.top - a.top; L.style.transform = `translate(${L._x}px,${L._y}px)`;
    requestAnimationFrame(() => L.classList.add('up'));
    return L;
  }
  const follow = (x, y) => { const a = app.getBoundingClientRect(); drag.lift._x = x - a.left - drag.gx; drag.lift._y = y - a.top - drag.gy; drag.lift.style.transform = `translate(${drag.lift._x}px,${drag.lift._y}px)`; };
  function beginMove(n, x, y, src){
    const it = draft.items.find(q => q.id === n.dataset.key); if (!it) return;
    closePops(); hideTips();
    const b = n.getBoundingClientRect();
    drag = { kind:'move', item:it, node:n, idx:draft.items.indexOf(it), from:draft.items.indexOf(it), gx:x - b.left, gy:y - b.top, src, x, y };
    drag.lift = liftOf(n, 'move'); n.classList.add('is-ph'); app.classList.add('dragging'); $$('.dbb-w.sel', eg.el).forEach(q => q.classList.remove('sel'));
    say(`Picked up ${titleOf(it)}.`);
    autoScroll();
  }
  function beginAdd(t, b, x, y, src){
    closePops(); hideTips();
    const it = fresh(t), art = $('.dbb-art', b), r = art.getBoundingClientRect();
    drag = { kind:'add', item:it, node:null, idx:-1, gx:x - r.left, gy:y - r.top, src, tile:b, x, y };
    drag.lift = liftOf(art, 'add'); drag.lift.insertAdjacentHTML('beforeend', `<span class="dbb-ln">${KINDS[t].n}</span>`);
    app.classList.add('dragging');
    autoScroll(); dragTo(x, y);
  }
  function dragTo(x, y){
    if (!drag) return; drag.x = x; drag.y = y; follow(x, y);
    if (drag.kind === 'add' && !overCanvas(x, y)){
      if (drag.node){ const n = drag.node; drag.node = null; drag.idx = -1; eg.move(() => { draft.items.splice(draft.items.indexOf(drag.item), 1); n.remove(); }); empty(); }
      return;
    }
    if (drag.kind === 'add' && !drag.node){
      // the new widget's place opens in the grid as soon as the pointer is over the canvas
      const i = bestIndex(x, y), n = html(`<div class="dbb-w is-ph is-new" data-key="${drag.item.id}" data-t="${drag.item.t}" aria-hidden="true"></div>`);
      drag.node = n; drag.idx = i;
      eg.move(() => { draft.items.splice(i, 0, drag.item); eg.el.appendChild(n); }, { enter:false });
      empty(); return;
    }
    const i = bestIndex(x, y);
    if (i !== drag.idx && i >= 0){ drag.idx = i; eg.move(() => { draft.items.splice(draft.items.indexOf(drag.item), 1); draft.items.splice(i, 0, drag.item); }); }
  }
  function drop(){
    if (!drag) return; const d = drag; drag = null; cancelAnimationFrame(scrollRaf); app.classList.remove('dragging');
    if (d.kind === 'add' && !d.node){
      // let go outside the canvas: the widget goes back to the palette
      settle(d.lift, d.tile.querySelector('.dbb-art'), true); say(`${KINDS[d.item.t].n} not added.`); return;
    }
    if (d.kind === 'add'){
      const n = widget(d.item, { edit:true, anim:true }); n.style.gridColumn = d.node.style.gridColumn; n.style.gridRow = d.node.style.gridRow;
      d.node.replaceWith(n); eg.place(); syncSizes(); markDirty();
      settle(d.lift, n, false, true);
      say(`Added ${titleOf(d.item)}, ${spot(d.item)}.`);
      return;
    }
    settle(d.lift, d.node, false, false, () => d.node.classList.remove('is-ph'));
    markDirty();
    say(d.idx === d.from ? `${titleOf(d.item)} dropped where it was.` : `Dropped ${titleOf(d.item)}, ${spot(d.item)}.`);
  }
  function cancelDrag(){
    if (!drag) return; const d = drag; drag = null; cancelAnimationFrame(scrollRaf); app.classList.remove('dragging');
    if (d.kind === 'add'){ if (d.node){ eg.move(() => { draft.items.splice(draft.items.indexOf(d.item), 1); d.node.remove(); }); empty(); } settle(d.lift, d.tile.querySelector('.dbb-art'), true); return; }
    if (d.idx !== d.from) eg.move(() => { draft.items.splice(draft.items.indexOf(d.item), 1); draft.items.splice(d.from, 0, d.item); });
    settle(d.lift, d.node, false, false, () => d.node.classList.remove('is-ph'));
    say(`${titleOf(d.item)} is back where it was.`);
  }
  // the copy in hand glides onto its place (or back to the palette) and goes
  function settle(L, to, back, fade, then){
    const a = app.getBoundingClientRect(), b = to.getBoundingClientRect(), dur = REDUCE ? 0 : MT('--dm-t');
    const end = () => { L.remove(); then && then(); };
    if (!dur){ end(); return; }
    const k = back ? 'scale(.9)' : '';
    L.classList.remove('up'); L.classList.add('land');
    const anim = L.animate([{ transform:`translate(${L._x}px,${L._y}px)`, width:L.style.width, height:L.style.height, opacity:1 },
      { transform:`translate(${b.left - a.left}px,${b.top - a.top}px) ${k}`, width:(back ? L.offsetWidth : b.width) + 'px', height:(back ? L.offsetHeight : b.height) + 'px', opacity:back || fade ? 0 : 1 }],
      { duration:dur, easing:getComputedStyle(app).getPropertyValue('--dm-ease').trim() || 'ease', fill:'forwards' });
    anim.finished.then(end, end);
  }
  // near the canvas's top or bottom edge the canvas scrolls, faster the nearer the pointer
  function autoScroll(){
    cancelAnimationFrame(scrollRaf);
    const step = () => {
      if (!drag) return;
      const r = cv.getBoundingClientRect(), y = drag.y, edge = 56;
      let v = 0; if (y < r.top + edge && y > r.top - 40) v = -Math.ceil((r.top + edge - y) / 5); else if (y > r.bottom - edge && y < r.bottom + 40) v = Math.ceil((y - (r.bottom - edge)) / 5);
      if (v && drag.kind === 'move' || v && overCanvas(drag.x, drag.y)){ const was = cv.scrollTop; cv.scrollTop += clamp(v, -18, 18); if (cv.scrollTop !== was) dragTo(drag.x, drag.y); }
      scrollRaf = requestAnimationFrame(step);
    };
    scrollRaf = requestAnimationFrame(step);
  }
  const hideTips = () => { if (typeof hideTip === 'function') hideTip(true); };

  // a pointer on a widget: a mouse or a pen picks it up once it moves a few pixels; a finger holds it for a moment first (a
  // quick swipe scrolls the canvas instead), and a tap selects it, which shows its toolbar
  eg.el.addEventListener('pointerdown', e => {
    if (mode !== 'edit' || e.button !== 0 || drag || kdrag) return;
    const n = e.target.closest('.dbb-w'); if (!n || n.classList.contains('is-ph')) return;
    if (e.target.closest('.dbb-tb button:not(.dbb-mv), .dbb-sz')) return;
    pend = { n, x:e.clientX, y:e.clientY, id:e.pointerId, type:e.pointerType, src:e.isTrusted ? 'person' : 'demo' };
    if (e.pointerType === 'touch') pend.tm = setTimeout(() => { if (!pend) return; const p = pend; pend = null; n.classList.add('held'); if (navigator.vibrate) try { navigator.vibrate(8); } catch(x){} beginMove(p.n, p.x, p.y, p.src); }, 420);
  });
  eg.el.addEventListener('contextmenu', e => { if (mode === 'edit' && (pend || drag) && coarse.matches) e.preventDefault(); });
  eg.el.addEventListener('touchmove', e => { if (drag) e.preventDefault(); }, { passive:false });
  tiles.addEventListener('pointerdown', e => {
    const b = e.target.closest('.dbb-tile'); if (!b || e.button !== 0 || e.pointerType === 'touch' || drag) return;
    b._dragged = false; tpend = { b, x:e.clientX, y:e.clientY, id:e.pointerId };
  });
  tiles.addEventListener('dragstart', e => e.preventDefault());
  addEventListener('pointermove', e => {
    if (pend && e.pointerId === pend.id){
      const d = Math.hypot(e.clientX - pend.x, e.clientY - pend.y);
      if (pend.type === 'touch'){ if (d > 10){ clearTimeout(pend.tm); pend = null; } }
      else if (d > 6){ const p = pend; pend = null; beginMove(p.n, p.x, p.y, p.src); dragTo(e.clientX, e.clientY); }
    }
    if (tpend && e.pointerId === tpend.id && Math.hypot(e.clientX - tpend.x, e.clientY - tpend.y) > 6){ const p = tpend; tpend = null; p.b._dragged = true; beginAdd(p.b.dataset.t, p.b, p.x, p.y, 'person'); dragTo(e.clientX, e.clientY); }
    if (drag && drag.src !== 'demo'){ e.preventDefault(); dragTo(e.clientX, e.clientY); }
  }, { passive:false });
  addEventListener('pointerup', e => {
    if (pend && e.pointerId === pend.id){ clearTimeout(pend.tm); const n = pend.n; pend = null; select(n); }
    tpend = null;
    if (drag && drag.src !== 'demo') drop();
    $$('.dbb-w.held', eg.el).forEach(n => n.classList.remove('held'));
  });
  addEventListener('pointercancel', e => { if (pend){ clearTimeout(pend.tm); pend = null; } tpend = null; if (drag && drag.src !== 'demo') cancelDrag(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && drag && drag.src !== 'demo'){ e.preventDefault(); e.stopPropagation(); cancelDrag(); } }, true);
  // one selected widget at a time; a tap anywhere else lets it go
  function select(n){ $$('.dbb-w.sel', eg.el).forEach(q => q !== n && q.classList.remove('sel')); n.classList.add('sel'); }
  document.addEventListener('pointerdown', e => { if (!e.target.closest || !e.target.closest('.dbb-eg .dbb-w')) $$('.dbb-w.sel', eg.el).forEach(q => q.classList.remove('sel')); }, true);

  /* ---------- the keyboard: a widget's move button picks it up, the arrow keys move it, Space or Enter drops it ---------- */
  let kdrag = null;
  function kplace(dir){
    const it = kdrag.item, i = draft.items.indexOf(it), n = draft.items.length;
    if (dir === 'ArrowLeft') return i > 0 ? i - 1 : -1;
    if (dir === 'ArrowRight') return i < n - 1 ? i + 1 : -1;
    // up and down: the nearest row above or below where the widget could land, nearest in column first
    const others = draft.items.filter(x => x !== it), p0 = pack(draft.items, eg.cols)[i]; let best = -1, by = 0, bx = 0;
    for (let j = 0; j < n; j++){
      if (j === i) continue;
      const p = pack(others.slice(0, j).concat([it], others.slice(j)), eg.cols)[j], dy = p.y - p0.y, dx = Math.abs(p.x - p0.x);
      if (dir === 'ArrowUp' ? dy >= 0 : dy <= 0) continue;
      if (best < 0 || Math.abs(dy) < by || (Math.abs(dy) === by && dx < bx)){ best = j; by = Math.abs(dy); bx = dx; }
    }
    return best;
  }
  function kpick(n){
    const it = draft.items.find(q => q.id === n.dataset.key); if (!it) return;
    kdrag = { item:it, node:n, from:draft.items.indexOf(it) }; n.classList.add('lifted'); hideTips();
    say(`Picked up ${titleOf(it)}, ${spot(it)}. Arrow keys move it, Space or Enter drops it, Escape puts it back.`);
  }
  function kmove(dir){
    const j = kplace(dir), it = kdrag.item;
    if (j < 0){ say(dir === 'ArrowUp' || dir === 'ArrowLeft' ? `${titleOf(it)} is first.` : `${titleOf(it)} is last.`); return; }
    eg.move(() => { draft.items.splice(draft.items.indexOf(it), 1); draft.items.splice(j, 0, it); });
    markDirty(); reveal(kdrag.node);
    say(`${titleOf(it)}, ${spot(it)}.`);
  }
  function kdrop(){ const k = kdrag; kdrag = null; k.node.classList.remove('lifted'); say(`Dropped ${titleOf(k.item)}, ${spot(k.item)}.`); }
  function kcancel(quiet){
    const k = kdrag; kdrag = null; k.node.classList.remove('lifted');
    if (draft.items.indexOf(k.item) !== k.from) eg.move(() => { draft.items.splice(draft.items.indexOf(k.item), 1); draft.items.splice(k.from, 0, k.item); });
    markDirty(); if (!quiet) say(`${titleOf(k.item)} is back where it was.`);
  }
  eg.el.addEventListener('keydown', e => {
    const mv = e.target.closest('.dbb-mv'); if (!mv || mode !== 'edit') return;
    const n = mv.closest('.dbb-w'), k = e.key;
    if (kdrag){
      if (k.startsWith('Arrow')){ e.preventDefault(); kmove(k); }
      else if (k === ' ' || k === 'Enter'){ e.preventDefault(); kdrop(); }
      else if (k === 'Escape'){ e.preventDefault(); e.stopPropagation(); kcancel(); }
      return;
    }
    if (k === ' ' || k === 'Enter'){ e.preventDefault(); kpick(n); }
    else if (k === 'Delete' || k === 'Backspace'){ e.preventDefault(); const it = draft.items.find(q => q.id === n.dataset.key); if (it) remove(it); }
  });
  eg.el.addEventListener('focusout', e => { if (kdrag && e.target === $('.dbb-mv', kdrag.node) && !kdrag.node.contains(e.relatedTarget)) kdrop(); });

  /* ---------- phones: the palette is a sheet from the bottom ---------- */
  const addw = $('.dbb-addw', app), scrim = $('.dbb-scrim', app);
  function sheet(on, quiet){
    if (pal.classList.contains('open') === on) return;
    pal.classList.toggle('open', on); scrim.classList.toggle('on', on);
    if (on){ pal.setAttribute('role', 'dialog'); pal.setAttribute('aria-modal', 'true'); pal.setAttribute('aria-label', 'Add widget'); $('.dbb-eb', app).classList.add('sheet'); $$('.dbb-cv, .dbb-eh, .dbb-addw', app).forEach(x => { x.inert = true; }); if (!quiet) refocus($('.dbb-tile', pal)); }
    else { pal.removeAttribute('role'); pal.removeAttribute('aria-modal'); pal.setAttribute('aria-label', 'Widgets'); $$('.dbb-cv, .dbb-eh, .dbb-addw', app).forEach(x => { x.inert = false; }); if (pal.contains(document.activeElement)) refocus(addw); }
  }
  addw.addEventListener('click', e => sheet(true, !e.isTrusted));
  scrim.addEventListener('click', () => sheet(false));
  $('.dbb-shx', app).addEventListener('click', () => sheet(false));
  pal.addEventListener('keydown', e => { if (e.key === 'Escape' && pal.classList.contains('open')){ e.stopPropagation(); sheet(false); } });

  /* ---------- toasts: what was saved or removed, with Undo ---------- */
  const toasts = $('.dbb-toasts', app);
  const TONE = { ok:['ok', 'var(--dm-ok)', 'var(--dm-ok-bg)'], bad:['trash', 'var(--dm-fg2)', 'var(--dm-chip)'] };
  function toast(kind, b, s = '', act = null){
    const [ic, col, bg] = TONE[kind];
    const t = html(`<div class="tst-t tst-in" role="status"><span class="g" style="color:${col};background:${bg}">${I(ic)}</span><div class="tx"><b>${esc(b)}</b>${s ? `<span>${esc(s)}</span>` : ''}</div><div class="acts">${act ? `<button class="pill ghost sm">${act.t}</button>` : ''}<button class="ib" aria-label="Dismiss" data-tip="Dismiss">${I('x')}</button></div></div>`);
    const out = () => { if (!t.isConnected || t.classList.contains('tst-out')) return; t.classList.add('tst-out'); setTimeout(() => t.remove(), 320); };
    $('.ib', t).onclick = out;
    if (act) $('.pill', t).onclick = () => { act.run(); out(); };
    toasts.appendChild(t); while (toasts.children.length > 3) toasts.firstElementChild.remove();
    let left = 6000, t0 = performance.now(), tm = setTimeout(out, left);
    t.addEventListener('pointerenter', () => { clearTimeout(tm); left -= performance.now() - t0; });
    t.addEventListener('pointerleave', () => { t0 = performance.now(); tm = setTimeout(out, Math.max(1200, left)); });
  }

  /* ---------- first paint ---------- */
  renderView(true);

  /* ---------- the demo: a short story, as the components' previews tell theirs. It opens the builder, drags a bar chart from
     the palette onto the dashboard, makes it full width and saves. A mouse resting on the app holds it where it is (the
     controller's waits), the first real click, key or touch in the app ends it for good, and with reduced motion it doesn't play ---------- */
  const c = ctl();
  const embedded = document.documentElement.hasAttribute('data-embed');
  if (!REDUCE && !/[?&]demo=0\b/.test(location.search)){
    app.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') c.held = true; });
    app.addEventListener('pointerleave', () => { if (c.held){ c.held = false; c.release(); } });
    const mine = e => { if (e.isTrusted && !c.own) c.mine = true; };
    ['pointerdown', 'keydown', 'input', 'click'].forEach(t => app.addEventListener(t, mine, true));
    // a focus that comes with the visitor's own key or pointer (a Tab into the app) is theirs too, as in the core's mount
    app.addEventListener('focusin', e => { if (e.isTrusted && typeof lastInput === 'number' && e.timeStamp - lastInput < 100) c.mine = true; }, true);
    let hand = null;
    const at = el => { const a = app.getBoundingClientRect(), b = el.getBoundingClientRect(); return [b.left - a.left + Math.min(b.width * .6, b.width - 10), b.top - a.top + b.height * .58]; };
    const put = (x, y, glide = true) => { if (!hand){ hand = html('<span class="hand dbb-hand" aria-hidden="true"><svg viewBox="0 0 18 18"><path d="M3 2l11.5 6.1-5 1.5-2.4 5z"/></svg></span>'); app.appendChild(hand); }
      if (!glide || !hand.classList.contains('on')){ hand.style.transition = 'none'; hand.style.transform = `translate(${x + 24}px,${y + 28}px)`; void hand.offsetWidth; hand.style.transition = ''; hand.classList.add('on'); }
      hand.style.transform = `translate(${x}px,${y}px)`; };
    const point = async el => { const [x, y] = at(el); put(x, y); await c.step(460); };
    const tap = async el => { await point(el); hand.classList.remove('down'); void hand.offsetWidth; hand.classList.add('down'); await c.step(160); c.own = (c.own || 0) + 1; try { el.click(); } finally { c.own--; } c.later(340, () => hand && hand.classList.remove('down')); };
    const away = () => { if (hand){ hand.classList.remove('on', 'down'); } };
    c.taken(() => { away(); if (drag && drag.src === 'demo') cancelDrag(); });
    c.run(async () => {
      // it starts once the app has settled, while the tab is open and the app is on screen
      await c.step(embedded ? 1200 : 1800);
      while (document.hidden) await c.step(300);
      if (mode !== 'view' || cur !== 'overview') return;
      await tap(edBtn); await c.step(700);
      if (getComputedStyle(addw).display !== 'none'){
        // a phone: Add widget opens the palette as a sheet, and a tap on Bar chart puts it at the end
        await tap(addw); await c.step(600); await tap($('.dbb-tile[data-t="bar"]', app)); await c.step(1400);
        await tap($('.dbb-save', app)); await c.step(700); away(); return;
      }
      // the bar chart: pressed in the palette, carried onto the canvas under the metrics, and let go
      const tile = $('.dbb-tile[data-t="bar"]', app); if (!tile.offsetParent) return;
      await point(tile); hand.classList.add('down'); await c.step(180);
      const a = app.getBoundingClientRect(), tb = tile.getBoundingClientRect(), [hx, hy] = at(tile);
      beginAdd('bar', tile, tb.left + tb.width / 2, tb.top + tb.height / 2, 'demo');
      const first = eg.node(draft.items.find(x => x.t === 'table')) || eg.el, fb = first.getBoundingClientRect();
      const tx = fb.left + Math.min(fb.width * .3, 160), ty = fb.top + 40, sx = hx + a.left, sy = hy + a.top, N = 46;
      hand.style.transition = 'none';
      for (let i = 1; i <= N; i++){
        const k = i / N, e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, x = sx + (tx - sx) * e, y = sy + (ty - sy) * e - Math.sin(k * Math.PI) * 30;
        hand.style.transform = `translate(${x - a.left}px,${y - a.top}px)`; dragTo(x, y); await c.step(18);
      }
      await c.step(380); hand.style.transition = ''; hand.classList.remove('down'); drop();
      await c.step(900);
      // full width: the new chart's widest size
      const n = eg.node(draft.items.find(x => x.t === 'bar')); if (!n) return;
      select(n); await c.step(500);
      await tap($('.dbb-sz [data-v="3"]', n)); await c.step(1300);
      await tap($('.dbb-save', app)); await c.step(700);
      away();
    }).finally(() => away());
  }
})();
