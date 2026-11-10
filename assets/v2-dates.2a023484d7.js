TPLS["agenda"] = "<div class=\"agx panel\">\n  <div class=\"agx-h\"><div><b>Today</b><span class=\"muted\">Monday, Oct 19</span></div><span class=\"tag b agx-n\">4 events</span></div>\n  <div class=\"agx-list\"></div>\n</div>";
TPLS["event-calendar"] = "<div class=\"ecx panel\">\n  <div class=\"ecx-h\"><b>Oct 19 – 23, 2026</b><span class=\"ecx-sp\"></span><span class=\"ecx-msg muted\"></span><button class=\"pill soft sm ecx-ask\">{spark}Find 45 min for a design review</button></div>\n  <div class=\"ecx-days\" role=\"group\" aria-label=\"Day\"></div>\n  <div class=\"ecx-sc\"><div class=\"ecx-grid\"><div class=\"ecx-tm\"></div></div></div>\n</div>";
TPLS["date-range-picker"] = "<div class=\"drx panel\">\n  <div class=\"drx-side\"><button class=\"drx-p\" data-p=\"7\">Last 7 days</button><button class=\"drx-p\" data-p=\"30\">Last 30 days</button><button class=\"drx-p\" data-p=\"q\">This quarter</button><button class=\"drx-p\" data-p=\"sp\">Since pricing launch</button></div>\n  <div class=\"drx-main\">\n    <div class=\"drx-top\"><div class=\"drx-in\"><span class=\"muted\">From</span><b class=\"drx-a\">–</b></div>{right}<div class=\"drx-in\"><span class=\"muted\">To</span><b class=\"drx-b\">–</b></div><span class=\"drx-n muted\"></span></div>\n    <div class=\"drx-cals\"><div class=\"drx-cal\" data-o=\"0\"></div><div class=\"drx-cal\" data-o=\"1\"></div></div>\n    <div class=\"drx-f\"><button class=\"pill ghost sm drx-clr\">Clear</button><button class=\"pill primary sm drx-ok\" disabled>Apply</button></div>\n  </div>\n</div>";
TPLS["segmented-control"] = "<div class=\"sgc panel\">\n  <div class=\"sgc-h\"><div class=\"sgc-ht\"><b>Pricing launch</b></div>\n    <div class=\"sgc-seg\" role=\"tablist\" aria-label=\"View\"><span class=\"sgc-k\" aria-hidden=\"true\"></span><button role=\"tab\" aria-selected=\"true\" data-v=\"day\">Day</button><button role=\"tab\" aria-selected=\"false\" tabindex=\"-1\" data-v=\"week\">Week</button><button role=\"tab\" aria-selected=\"false\" tabindex=\"-1\" data-v=\"month\">Month</button></div></div>\n  <div class=\"sgc-bar\"><span class=\"sgc-r\" aria-live=\"polite\">Friday, Oct 23</span><button class=\"pill ghost sm sgc-td\">Today</button><button class=\"ib sgc-pv\" aria-label=\"Previous day\"></button><button class=\"ib sgc-nx\" aria-label=\"Next day\"></button></div>\n  <div class=\"sgc-p\" role=\"tabpanel\" tabindex=\"0\"><div class=\"sgc-in\"></div></div>\n</div>";
TPLS["date-picker"] = "<div class=\"dpk\">\n  <button class=\"dpk-f\" data-pop=\".dpk-pop\" data-pop-pos=\"down\">{cal}<span class=\"dpk-val\">Pick a launch date</span>{chev}</button>\n  <div class=\"pop dpk-pop\" role=\"dialog\" aria-label=\"Choose a date\">\n    <input class=\"dpk-nl\" placeholder=\"Try “next friday” or “in 2 weeks”\" spellcheck=\"false\">\n    <div class=\"dpk-qk\"><button class=\"chip sm\" data-d=\"0\">Today</button><button class=\"chip sm\" data-d=\"1\">Tomorrow</button><button class=\"chip sm\" data-d=\"7\">In a week</button></div>\n    <div class=\"dpk-mh\"><button class=\"ib dpk-pv\" aria-label=\"Previous month\">{l}</button><b class=\"dpk-m\"></b><button class=\"ib dpk-nx\" aria-label=\"Next month\">{r}</button></div>\n    <div class=\"dpk-wd muted\"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>\n    <div class=\"dpk-vp\"><div class=\"dpk-g\"></div></div>\n  </div>\n</div>";

/* ---------- Date picker ---------- */
DM.def('date-picker', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{cal}', I('cal','xs')).replace('{chev}', I('chev-d','xs')).replace('{l}', I('chev-l','xs')).replace('{r}', I('chev-r','xs'));
  // today is the real today: the calendar opens on its month and the quick picks and typed dates count from it
  const now = new Date(), TODAY = new Date(now.getFullYear(), now.getMonth(), now.getDate()); let view = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1), sel = null;
  const g = $('.dpk-g', r), m = $('.dpk-m', r), val = $('.dpk-val', r), f = $('.dpk-f', r); let cursor = null;
  val.classList.add('ph');
  const same = (a, b) => a && b && a.toDateString() === b.toDateString();
  const fmt = d => d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' });
  function paint(dir){
    m.textContent = view.toLocaleDateString('en-US', { month:'long', year:'numeric' });
    const first = new Date(view.getFullYear(), view.getMonth(), 1), start = new Date(first); start.setDate(1 - ((first.getDay() + 6) % 7));
    // one day takes Tab, the one the arrows last reached, or the picked day, today or the 1st; the arrows move from it
    const inView = d => d && d.getMonth() === view.getMonth() && d.getFullYear() === view.getFullYear(), tab = [cursor, sel, TODAY].find(inView) || first;
    let h = ''; for (let i = 0; i < 42; i++){ const d = new Date(start); d.setDate(start.getDate() + i); h += `<button class="dpk-d${d.getMonth() !== view.getMonth() ? ' o' : ''}${same(d, TODAY) ? ' t' : ''}${same(d, sel) ? ' s' : ''}" data-t="${d.getTime()}" tabindex="${same(d, tab) ? 0 : -1}" aria-label="${fmt(d)}" aria-pressed="${!!same(d, sel)}"${same(d, TODAY) ? ' aria-current="date"' : ''}>${d.getDate()}</button>`; }
    g.innerHTML = h; if (dir){ g.classList.remove('in-l','in-r'); void g.offsetWidth; g.classList.add(dir < 0 ? 'in-l' : 'in-r'); }
    $$('.dpk-d', g).forEach(b => b.onclick = () => pick(new Date(+b.dataset.t)));
  }
  function pick(d, keep){ sel = d; val.classList.remove('ph'); swap(val, fmt(d)); if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()){ const dir = d > view ? 1 : -1; view = new Date(d.getFullYear(), d.getMonth(), 1); paint(dir); } else paint(); if (!keep) c.later(260, () => closePops()); }
  $('.dpk-pv', r).onclick = () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); paint(-1); };
  $('.dpk-nx', r).onclick = () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); paint(1); };
  $$('.dpk-qk .chip', r).forEach(b => b.onclick = () => { const d = new Date(TODAY); d.setDate(d.getDate() + +b.dataset.d); pick(d); });
  const W = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  $('.dpk-nl', r).oninput = e => { const s = e.target.value.toLowerCase().trim(); let d = null;
    const wd = W.findIndex(w => s.includes(w)); const n = s.match(/in (\d+) (day|week|month)s?/);
    if (n){ d = new Date(TODAY); if (n[2] === 'day') d.setDate(d.getDate() + +n[1]); if (n[2] === 'week') d.setDate(d.getDate() + n[1] * 7); if (n[2] === 'month') d.setMonth(d.getMonth() + +n[1]); }
    else if (wd >= 0){ d = new Date(TODAY); let add = (wd - d.getDay() + 7) % 7 || 7; if (s.includes('next') && add < 7) add += 0; d.setDate(d.getDate() + add); }
    else if (s === 'tomorrow'){ d = new Date(TODAY); d.setDate(d.getDate() + 1); }
    if (d) pick(d, true); };
  $('.dpk-nl', r).onkeydown = e => { if (e.key === 'Enter' && sel) closePops(); };
  // the keyboard in the calendar: the arrows move a day or a week, across months too; Home and End go to the start and end
  // of the week; Page Up and Page Down move a month, or a year with Shift; Enter or Space picks the day
  const dayBtn = d => $$('.dpk-d', g).find(b => same(new Date(+b.dataset.t), d));
  function goDay(d){
    cursor = d;
    if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()){ const dir = d > view ? 1 : -1; view = new Date(d.getFullYear(), d.getMonth(), 1); paint(dir); } else paint();
    const b = dayBtn(d); if (b) b.focus({ preventScroll:true });
  }
  c.on(g, 'keydown', e => {
    const b = e.target.closest('.dpk-d'); if (!b) return;
    const d = new Date(+b.dataset.t), wd = (d.getDay() + 6) % 7, at = n => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
    const mon = (y, mo) => new Date(y, mo, Math.min(d.getDate(), new Date(y, mo + 1, 0).getDate()));
    const n = { ArrowLeft:at(-1), ArrowRight:at(1), ArrowUp:at(-7), ArrowDown:at(7), Home:at(-wd), End:at(6 - wd),
      PageUp:e.shiftKey ? mon(d.getFullYear() - 1, d.getMonth()) : mon(d.getFullYear(), d.getMonth() - 1),
      PageDown:e.shiftKey ? mon(d.getFullYear() + 1, d.getMonth()) : mon(d.getFullYear(), d.getMonth() + 1) }[e.key];
    if (!n) return; e.preventDefault(); goDay(n);
  });
  // opened with the keyboard, the calendar takes the focus on the picked day, or today
  c.on(f, 'click', e => { if (e.isTrusted && !e.detail) requestAnimationFrame(() => { if (f.getAttribute('aria-expanded') !== 'true') return; cursor = null; paint(); const b = $('.dpk-d[tabindex="0"]', g); if (b) b.focus({ preventScroll:true }); }); });
  paint();
  // the field sits centred on its own, and glides up as the calendar opens under it, so the two sit centred together; on
  // closing, it waits for the calendar to fade before it glides back to the middle
  const box = $('.dpk', r), pop = $('.dpk-pop', r), isOpen = () => f.getAttribute('aria-expanded') === 'true';
  const centred = centre(c, box, () => isOpen() ? Math.max(box.offsetHeight, pop.offsetTop + pop.offsetHeight) : box.offsetHeight);
  const mo = new MutationObserver(() => isOpen() ? centred() : c.later(REDUCE ? 0 : 180, centred));
  mo.observe(f, { attributes:true, attributeFilter:['aria-expanded'] }); c.offs.push(() => mo.disconnect());
  // the preview opens it and types a date on its own; clicking, focusing or typing in it takes over, and what it had typed goes
  c.auto(800, () => { f.click(); c.run(async () => { const i = $('.dpk-nl', r); await c.step(500); await c.type(i, 'next friday', { ms:70, each:() => i.oninput({ target:i }) }); }); });
});
/* ---------- Segmented control ---------- */
DM.def('segmented-control', (r, c) => {
  const uid = Math.random().toString(36).slice(2, 7);
  const seg = $('.sgc-seg', r), knob = $('.sgc-k', r), tabs = $$('[role="tab"]', seg), panel = $('.sgc-p', r), range = $('.sgc-r', r);
  let inner = $('.sgc-in', r);
  tabs.forEach(t => { t.id = `sgc-${t.dataset.v}-${uid}`; t.setAttribute('aria-controls', 'sgc-p-' + uid); });
  panel.id = 'sgc-p-' + uid;
  // the pricing launch in October 2026, seen as a day, a week or a month. Today is Friday the 23rd
  const TODAY = new Date(2026, 9, 23, 12), DAY0 = 864e5;
  const at = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12), iso = d => d.toISOString().slice(0, 10);
  const same = (a, b) => iso(a) === iso(b);
  // launch week is written out; the days around it are drawn from the work that leads up to it and follows it
  const E = {
    '2026-10-19':[['10:00', 'Kickoff with Maya', 'Pricing v4 brief', 'var(--pl)'], ['15:00', 'Brief the agents', 'Build and copy agents', 'var(--pm)']],
    '2026-10-20':[['10:00', 'Wireframe review', 'Pricing v4, frames 1 to 6', 'var(--pl)'], ['11:30', 'Copy for the plan cards', 'Copy agent', 'var(--pt)'], ['14:00', 'Token audit', 'Build agent', 'var(--pm)']],
    '2026-10-21':[['11:00', 'Copy pass', 'Plan cards and FAQ', 'var(--pt)']],
    '2026-10-22':[['14:00', 'Design QA', 'Pricing v4, all frames', 'var(--pb)'], ['16:30', 'Fix contrast issues', 'Build agent', 'var(--pm)']],
    '2026-10-23':[['09:30', 'Pricing review with Maya', 'Pricing v4, frames 1 to 3', 'var(--pl)'], ['13:00', 'Export tokens to CSS', 'Build agent', 'var(--pm)'], ['16:00', 'Ship pricing v4', 'designme.studio/pricing', 'var(--pb)']],
    '2026-10-24':[], '2026-10-25':[]
  };
  const POOL = [['Design crit', 'Pricing frames', 'var(--pl)'], ['Token audit', 'Build agent', 'var(--pm)'], ['Copy pass', 'Plan cards', 'var(--pt)'], ['Stakeholder check-in', 'Weekly', 'var(--pb)'],
    ['User interviews', 'Three sessions', 'var(--pl)'], ['Conversion review', 'Trial to paid', 'var(--pb)'], ['Research synthesis', 'Notes and quotes', 'var(--pt)'], ['Fix review notes', 'Build agent', 'var(--pm)']];
  const TIMES = ['09:30', '10:00', '11:30', '13:00', '14:00', '15:30', '16:00'];
  function evs(d){
    const k = iso(d); if (E[k]) return E[k];
    const wd = d.getDay(); if (wd === 0 || wd === 6) return [];
    let h = Math.floor(d / DAY0) * 2654435761 >>> 0; const nx = m => { h = Math.imul(h ^ h >>> 15, 2246822519) >>> 0; return h % m; };
    const n = [0, 1, 1, 2, 2, 3][nx(6)], t = new Set(), out = [];
    while (t.size < n) t.add(TIMES[nx(TIMES.length)]);
    [...t].sort().forEach(tm => { const e = POOL[nx(POOL.length)]; out.push([tm, e[0], e[1], e[2]]); });
    return E[k] = out;
  }
  const mon = d => at(d, -((d.getDay() + 6) % 7));
  const mo = (d, o) => d.toLocaleDateString('en-US', o);
  const UNIT = { day:'day', week:'week', month:'month' };
  const V = {
    day:[d => mo(d, { weekday:'long', month:'short', day:'numeric' }), d => { const e = evs(d); return e.length ? `<div class="sgc-day">${e.map(([t, n, x, col]) => `<div class="sgc-ev" style="--c:${col}"><span class="num muted">${t}</span><i></i><span class="t">${n}<span>${x}</span></span></div>`).join('')}</div>` : '<div class="sgc-none">Nothing planned</div>'; }],
    week:[d => { const a = mon(d), b = at(a, 4); return mo(a, { month:'short', day:'numeric' }) + ' – ' + (a.getMonth() === b.getMonth() ? b.getDate() : mo(b, { month:'short', day:'numeric' })); },
      d => `<div class="sgc-wk">${Array.from({ length:5 }, (_, i) => at(mon(d), i)).map(x => { const ev = evs(x);
        return `<button class="sgc-wr${same(x, TODAY) ? ' now' : ''}${ev.length ? '' : ' none'}" data-d="${iso(x)}" aria-label="${mo(x, { weekday:'long', month:'long', day:'numeric' })}, ${ev.length ? ev.length + (ev.length === 1 ? ' event' : ' events') : 'nothing planned'}"><span class="d">${mo(x, { weekday:'short' })} ${x.getDate()}</span>${ev.length ? `<span class="e" style="--c:${ev[0][3]}"><i></i><span>${ev[0][1]}</span></span>${ev.length > 1 ? `<span class="more">+${ev.length - 1} more</span>` : ''}` : '<span class="e">Nothing planned</span>'}</button>`; }).join('')}</div>`],
    month:[d => mo(d, { month:'long', year:'numeric' }), d => { const a = new Date(d.getFullYear(), d.getMonth(), 1, 12), lead = (a.getDay() + 6) % 7, len = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      return `<div class="sgc-mo${lead + len > 35 ? ' r6' : ''}">${['M','T','W','T','F','S','S'].map(w => `<span class="w" aria-hidden="true">${w}</span>`).join('')}${'<span></span>'.repeat(lead)}${Array.from({ length:len }, (_, i) => { const x = at(a, i), n = evs(x).length;
        return `<button class="d num${n ? ' e' : ''}${same(x, TODAY) ? ' now' : ''}${same(x, sel) && !same(x, TODAY) ? ' on' : ''}" data-d="${iso(x)}" aria-label="${mo(x, { weekday:'long', month:'long', day:'numeric' })}, ${n ? n + (n === 1 ? ' event' : ' events') : 'nothing planned'}">${i + 1}</button>`; }).join('')}</div>`; }]
  };
  const pv = $('.sgc-pv', r), nxB = $('.sgc-nx', r), td = $('.sgc-td', r);
  // the knob slides to the picked tab and takes its width
  const place = () => { const t = tabs.find(x => x.getAttribute('aria-selected') === 'true'); knob.style.left = t.offsetLeft + 'px'; knob.style.width = t.offsetWidth + 'px'; };
  let cur = 'day', sel = TODAY, n = 0;
  // a day in the week or the month opens that day
  const bind = el => $$('[data-d]', el).forEach(b => b.onclick = () => { const [y, m, dd] = b.dataset.d.split('-').map(Number); sel = new Date(y, m - 1, dd, 12); pick(tabs[0], false, true); });
  // shows the view for the picked date: the range eases over and the new dates crossfade over the old ones, which stay
  // on screen until they have faded, so no frame is empty
  function show(){
    const v = cur;
    swap(range, V[v][0](sel)); pv.setAttribute('aria-label', 'Previous ' + UNIT[v]); nxB.setAttribute('aria-label', 'Next ' + UNIT[v]);
    const old = inner; inner = html(`<div class="sgc-in fresh">${V[v][1](sel)}</div>`); bind(inner);
    $$('.sgc-in.gone', panel).forEach(x => x.remove());
    old.classList.remove('fresh'); old.classList.add('gone'); old.inert = true; old.setAttribute('aria-hidden', 'true');
    panel.appendChild(inner);
    c.later(REDUCE ? 0 : 260, () => old.remove());
  }
  function pick(t, focus, force){
    tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; });
    panel.setAttribute('aria-labelledby', t.id); place();
    if (focus) t.focus({ preventScroll:true });
    if (t.dataset.v === cur && !force) return; cur = t.dataset.v; show();
  }
  // previous and next step by the view's unit; Today comes back to the 23rd
  const step = k => { sel = cur === 'day' ? at(sel, k) : cur === 'week' ? at(sel, 7 * k) : new Date(sel.getFullYear(), sel.getMonth() + k, 1, 12); show(); };
  pv.innerHTML = I('chev-l','xs'); nxB.innerHTML = I('chev-r','xs');
  pv.onclick = () => step(-1); nxB.onclick = () => step(1);
  td.onclick = () => { sel = TODAY; show(); };
  tabs.forEach(t => t.onclick = () => pick(t));
  // the arrow keys move along the tabs and pick as they go; Home and End jump to the ends
  seg.onkeydown = e => {
    const i = tabs.indexOf(document.activeElement); if (i < 0) return;
    const go = { ArrowRight:i + 1, ArrowLeft:i - 1, Home:0, End:tabs.length - 1 }[e.key]; if (go === undefined) return;
    e.preventDefault(); pick(tabs[(go + tabs.length) % tabs.length], true);
  };
  inner.innerHTML = V.day[1](sel); bind(inner); pick(tabs[0]);
  knob.style.transition = 'none'; requestAnimationFrame(() => { place(); requestAnimationFrame(() => { knob.style.transition = ''; }); });
  const ro = new ResizeObserver(place); ro.observe(seg); c.offs.push(() => ro.disconnect());
  // the preview's story: the week, then Tuesday opened from it, a step on to Wednesday, the month, and back to the week
  c.story(async s => {
    await s.beat(3);
    await s.tap(tabs[1]); s.away(); await s.beat(4);
    await s.tap($$('.sgc-wr', inner)[1]); s.away(); await s.beat(4);
    await s.tap(nxB); s.away(); await s.beat(3);
    await s.tap(tabs[2]); s.away(); await s.beat(4);
    await s.tap(tabs[1]); s.away(); await s.beat(3);
  });
});
/* ---------- Date range picker ---------- */
DM.def('date-range-picker', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{right}', I('right','xs'));
  const TODAY = new Date(2026, 9, 19); let base = new Date(2026, 8, 1), A = null, B = null, hov = null, cursor = null;
  const cals = $$('.drx-cal', r), ok = $('.drx-ok', r);
  const key = d => d.getFullYear() * 1e4 + d.getMonth() * 100 + d.getDate();
  const fmt = d => d ? d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : '–';
  /* From and To crossfade to the days picked, and always end on the latest ones: a pick that lands while the last one
     is still fading in (picking the same end again, two quick clicks, Enter twice) writes its day when the fade does */
  const put = (el, t) => { el._to = t; if (el._t || el.textContent === t) return; el.classList.add('sw', 'out');
    el._t = setTimeout(() => { el._t = 0; el.textContent = el._to; el.classList.remove('out'); }, REDUCE ? 0 : 170); };
  /* the days are built once per month view; selection and hover only change their classes */
  function build(){
    cals.forEach(cal => { const mo = new Date(base.getFullYear(), base.getMonth() + +cal.dataset.o, 1); const pad = (mo.getDay() + 6) % 7, days = new Date(mo.getFullYear(), mo.getMonth() + 1, 0).getDate();
      let h = `<h5>${mo.toLocaleDateString('en-US', { month:'long', year:'numeric' })}</h5><div class="drx-g">${['M','T','W','T','F','S','S'].map(w => `<span class="w">${w}</span>`).join('')}`;
      for (let i = 0; i < pad; i++) h += '<span class="drx-d e"></span>';
      for (let d = 1; d <= days; d++){ const dt = new Date(mo.getFullYear(), mo.getMonth(), d); h += `<button class="drx-d" data-t="${dt.getTime()}" data-k="${key(dt)}">${d}</button>`; }
      cal.innerHTML = h + '</div>'; });
    $$('.drx-d[data-t]', r).forEach(b => { b.onclick = () => click(new Date(+b.dataset.t)); b.onmouseenter = () => { if (A && !B){ hov = new Date(+b.dataset.t); deco(); } }; });
    deco();
  }
  function deco(){
    const end = B || hov, ka = A && key(A), kb = B && key(B), ke = end && key(end);
    $$('.drx-d[data-t]', r).forEach(b => { const k = +b.dataset.k; let cl = 'drx-d';
      if (A && k === ka) cl += ' a' + (end && ke > k ? ' ra' : '');
      if (B && k === kb) cl += ' b rb';
      if (A && end && k > ka && k < ke) cl += B ? ' in' : ' hv';
      if (!B && hov && A && k === ke && k > ka) cl += ' hv';
      if (b.className !== cl) b.className = cl; });
    // one day takes Tab: the one the arrows last reached, or the end, the start, today or the first day on show
    const days = $$('.drx-d[data-t]', r), on = [cursor, B, A, TODAY].map(d => d && days.find(b => +b.dataset.k === key(d))).find(Boolean) || days[0];
    days.forEach(b => { const t = b === on ? '0' : '-1'; if (b.getAttribute('tabindex') !== t) b.setAttribute('tabindex', t); });
    put($('.drx-a', r), fmt(A)); put($('.drx-b', r), fmt(B));
    const ins = $$('.drx-in', r); ins[0].classList.toggle('on', !A); ins[1].classList.toggle('on', !!A && !B);
    const n = A && B ? Math.round((B - A) / 864e5) + 1 : 0;
    $('.drx-n', r).textContent = n ? n + (n === 1 ? ' day' : ' days') : A ? 'Pick an end date' : 'Pick a start date';
    ok.disabled = !(A && B);
  }
  function click(d){ $$('.drx-p', r).forEach(x => x.classList.remove('on')); if (!A || B || d < A){ A = d; B = null; hov = null; } else { B = d; hov = null; } deco(); }
  $$('.drx-p', r).forEach(p => p.onclick = () => { $$('.drx-p', r).forEach(x => x.classList.toggle('on', x === p)); const v = p.dataset.p; B = new Date(TODAY);
    A = new Date(TODAY); if (v === '7') A.setDate(A.getDate() - 6); else if (v === '30') A.setDate(A.getDate() - 29); else if (v === 'q') A = new Date(2026, 9, 1); else A = new Date(2026, 8, 18);
    const nb = new Date(B.getFullYear(), B.getMonth() - 1, 1); hov = null; if (+nb !== +base){ base = nb; build(); } else deco(); stagger($$('.drx-d.in, .drx-d.a, .drx-d.b', r), 8); });
  $('.drx-clr', r).onclick = () => { A = B = hov = null; $$('.drx-p', r).forEach(x => x.classList.remove('on')); deco(); };
  ok.onclick = () => { ok.innerHTML = I('check','xs') + 'Applied'; c.later(1200, () => ok.textContent = 'Apply'); };
  c.on($('.drx-cals', r), 'mouseleave', () => { if (hov){ hov = null; deco(); } });
  // the keyboard in the calendars: the arrows move a day or a week, Home and End go to the start and end of the week, Page Up
  // and Page Down move a month, or a year with Shift, and the months on show follow; Enter or Space picks the day. While the
  // end is open, the range follows the focus as it does the pointer
  c.on($('.drx-cals', r), 'keydown', e => {
    const b = e.target.closest('.drx-d[data-t]'); if (!b) return;
    const d = new Date(+b.dataset.t), wd = (d.getDay() + 6) % 7, at = n => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
    const mon = (y, mo) => new Date(y, mo, Math.min(d.getDate(), new Date(y, mo + 1, 0).getDate()));
    const n = { ArrowLeft:at(-1), ArrowRight:at(1), ArrowUp:at(-7), ArrowDown:at(7), Home:at(-wd), End:at(6 - wd),
      PageUp:e.shiftKey ? mon(d.getFullYear() - 1, d.getMonth()) : mon(d.getFullYear(), d.getMonth() - 1),
      PageDown:e.shiftKey ? mon(d.getFullYear() + 1, d.getMonth()) : mon(d.getFullYear(), d.getMonth() + 1) }[e.key];
    if (!n) return; e.preventDefault(); cursor = n;
    const m0 = new Date(n.getFullYear(), n.getMonth(), 1), last = new Date(base.getFullYear(), base.getMonth() + 1, 1);
    if (A && !B && n > A) hov = n;
    if (m0 < base){ base = m0; build(); } else if (m0 > last){ base = new Date(m0.getFullYear(), m0.getMonth() - 1, 1); build(); } else deco();
    const to = $(`.drx-d[data-k="${key(n)}"]`, r); if (to) to.focus({ preventScroll:true });
  });
  build();
  c.later(900, () => $('.drx-p[data-p="sp"]', r).click());
});
/* ---------- Event calendar ---------- */
DM.def('event-calendar', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{spark}', I('spark','xs'));
  const DAYS = ['Mon 19','Tue 20','Wed 21','Thu 22','Fri 23'], H0 = 9;
  const EV = [[0,9,1,'Standup','b'],[0,13,1.5,'Pricing workshop','p'],[1,10,1,'1:1 with Maya','l'],[1,14,2,'Focus: checkout','t'],[2,9,1,'Standup','b'],[2,11.5,1,'Agent demo','y'],[3,9,1,'Standup','b'],[3,12,1,'Lunch & learn','m'],[3,15,1.5,'Launch review','r'],[4,10,1.5,'Planning','p']];
  const grid = $('.ecx-grid', r);
  // an hour's height (--ph): 44px, or 56px on a narrow calendar where each 28px row is half an hour. Places are written in it,
  // so events keep their times when the calendar narrows or widens
  const PX = () => parseFloat(getComputedStyle(grid).getPropertyValue('--ph')) || 44, at = h => `calc(var(--ph) * ${h - H0} + 1px)`, tall = n => `calc(var(--ph) * ${n} - 3px)`;
  // the time column: an hour a row (9am), or on a narrow calendar half an hour a row (9:00, 9:30)
  $('.ecx-tm', r).innerHTML = Array.from({ length:16 }, (_, i) => { const h = H0 + Math.floor(i / 2), h12 = h > 12 ? h - 12 : h; return i % 2 ? `<span class="hf"><i class="n">${h12}:30</i></span>` : `<span><i class="w">${h12}${h >= 12 ? 'pm' : 'am'}</i><i class="n">${h12}:00</i></span>`; }).join('');
  grid.insertAdjacentHTML('beforeend', DAYS.map((d, i) => `<div class="ecx-day"><div class="ecx-dh${i === 0 ? ' t' : ''}">${d.split(' ')[0]} <b>${d.split(' ')[1]}</b></div><div class="ecx-col" data-d="${i}"></div></div>`).join('') + '<div class="ecx-scan"></div>');
  const col = i => $(`.ecx-col[data-d="${i}"]`, grid);
  /* a narrow calendar shows one day: the row of days picks it, and an answer from the agent opens the day it found */
  const days = $('.ecx-days', r);
  days.innerHTML = DAYS.map((d, i) => `<button aria-pressed="false" data-d="${i}"${i === 0 ? ' class="t"' : ''} aria-label="${['Monday','Tuesday','Wednesday','Thursday','Friday'][i]} ${d.split(' ')[1]} October"><span>${d.split(' ')[0]}</span><b>${d.split(' ')[1]}</b></button>`).join('');
  let day = -1;
  const narrow = () => !!days.getClientRects().length;
  function showDay(i){
    if (i === day) return; const was = day; day = i;
    $$('button', days).forEach(b => b.setAttribute('aria-pressed', +b.dataset.d === i));
    $$('.ecx-day', grid).forEach((d, k) => d.classList.toggle('on', k === i));
    if (was >= 0 && narrow()){ closePop(); enter(col(i).parentElement); }
  }
  $$('button', days).forEach(b => b.onclick = () => showDay(+b.dataset.d));
  const tm = h => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60); return `${hh > 12 ? hh - 12 : hh}:${String(mm).padStart(2, '0')}`; };
  const ev = (e, cls = '') => html(`<button class="ecx-e ${cls}" style="top:${at(e[1])};height:${tall(e[2])};background:var(--p${e[4]}-bg);color:var(--p${e[4]})"><b>${e[3]}</b><span>${tm(e[1])} – ${tm(e[1] + e[2])}</span></button>`);
  const panel = $('.ecx', r), msg = $('.ecx-msg', r), pop = html('<div class="ecx-pop" role="dialog" aria-label="Event"></div>'); panel.appendChild(pop);
  const WHO = [['MK','var(--av-l)'],['JO','var(--av-m)'],['DA','var(--av-b)'],['AR','var(--av-p)']], DAYN = ['Mon','Tue','Wed','Thu','Fri'];
  let openFor = null;
  const say = t => swap(msg, t);
  // closing gives the focus back to the event when it was in the card
  const closePop = () => { const back = pop.contains(document.activeElement) && openFor; pop.classList.remove('open'); openFor = null; if (back && back.isConnected) back.focus({ preventScroll:true }); };
  /* the details card opens beside the event and stays inside the calendar */
  function openPop(el){
    const e = el._e; if (openFor === el){ closePop(); return; } openFor = el; const n = 2 + e[3].length % 3, fresh = e[3] === 'New event';
    pop.innerHTML = `<div class="ecx-ph"><i style="background:var(--p${e[4]})"></i>${fresh ? '<input class="ecx-ti" placeholder="Add a title" aria-label="Event title">' : `<b>${e[3]}</b>`}<button class="ib ecx-px" aria-label="Close" data-tip="Close">${I('x','xs')}</button></div><div class="ecx-pt">${DAYN[e[0]]} ${DAYS[e[0]].split(' ')[1]} Oct · ${tm(e[1])} – ${tm(e[1] + e[2])}</div><div class="ecx-pw">${WHO.slice(0, n).map(w => AV(w[0], w[1])).join('')}<span class="muted">${n} people</span></div><div class="ecx-pa">${fresh ? '<button class="pill line sm ecx-del">Discard</button><button class="pill primary sm ecx-save">Save</button>' : `<button class="pill soft sm ecx-prep">${I('spark','xs')}Prep notes</button><button class="pill primary sm">Join</button>`}</div>`;
    const pr = panel.getBoundingClientRect(), er = el.getBoundingClientRect(), w = 248;
    let x = er.right - pr.left + 8; if (x + w > pr.width - 8) x = er.left - pr.left - w - 8; x = Math.max(8, x);
    let y = er.top - pr.top; y = Math.max(8, Math.min(y, pr.height - pop.offsetHeight - 8));
    pop.style.left = x + 'px'; pop.style.top = y + 'px'; pop.classList.remove('open'); void pop.offsetWidth; pop.classList.add('open'); hideTip();
    $('.ecx-px', pop).onclick = closePop;
    const prep = $('.ecx-prep', pop); if (prep) prep.onclick = () => { prep.innerHTML = '<span class="think on"><i></i><i></i><i></i><i></i></span>Writing'; c.later(1200, () => { if (!prep.isConnected) return; const nt = html(`<div class="ecx-note">${I('spark','xs')}<span>Notes ready: last week's decisions and 3 open questions.</span></div>`); prep.closest('.ecx-pa').before(nt); enter(nt); prep.remove(); }); };
    const ti = $('.ecx-ti', pop); if (ti){ ti.focus({ preventScroll:true });
      const save = () => { const v = ti.value.trim() || 'Untitled'; e[3] = v; $('b', el).textContent = v; el.dataset.tip = v + ', ' + tm(e[1]); closePop(); say('Added ' + v + ', ' + DAYN[e[0]] + ' ' + tm(e[1])); };
      ti.onkeydown = k => { if (k.key === 'Enter') save(); if (k.key === 'Escape'){ el.remove(); closePop(); } };
      $('.ecx-save', pop).onclick = save; $('.ecx-del', pop).onclick = () => { el.remove(); closePop(); }; }
  }
  /* drag to another time or day, snapping to 15 minutes; a click without moving opens the details */
  const colX = i => col(i).getBoundingClientRect().left;
  function bind(el, e){ el._e = e; el.dataset.tip = e[3] + ', ' + tm(e[1]);
    // Enter or Space opens its card with the focus in it (a pointer opens it on release, below)
    el.onclick = k => { if (!k.isTrusted || k.detail) return; openPop(el); if (openFor === el){ const f = $('.ecx-ti', pop) || $('button', pop); if (f) f.focus({ preventScroll:true }); } };
    el.onpointerdown = d => { if (d.button || d.target.closest('.ecx-sg')) return; const sx = d.clientX, sy = d.clientY; let moved = false, nd = e[0], nh = e[1]; el.setPointerCapture(d.pointerId);
      el.onpointermove = m => { const dx = m.clientX - sx, dy = m.clientY - sy; if (!moved && Math.hypot(dx, dy) < 5) return; if (!moved){ moved = true; el.classList.add('drag'); closePop(); hideTip(); }
        nh = Math.max(H0, Math.min(H0 + 8 - e[2], e[1] + Math.round(dy / PX() * 4) / 4));
        const under = document.elementsFromPoint(m.clientX, m.clientY).find(x => x.classList && x.classList.contains('ecx-col')); if (under) nd = +under.dataset.d;
        el.style.transform = `translateX(${colX(nd) - colX(e[0])}px)`; el.style.top = at(nh); $('span', el).textContent = `${tm(nh)} – ${tm(nh + e[2])}`; };
      el.onpointerup = el.onpointercancel = () => { el.onpointermove = el.onpointerup = el.onpointercancel = null; if (!moved){ openPop(el); return; }
        el.classList.remove('drag'); el.style.transform = ''; const was = e[0] !== nd || e[1] !== nh; e[0] = nd; e[1] = nh; col(nd).appendChild(el); el.dataset.tip = e[3] + ', ' + tm(nh);
        if (was) say(`Moved ${e[3]} to ${DAYN[nd]} ${tm(nh)}`); }; }; }
  EV.forEach((e, i) => { const el = ev(e); col(e[0]).appendChild(el); enter(el, i * 30); bind(el, e); });
  showDay(0);
  /* now line on today's column */
  col(0).insertAdjacentHTML('beforeend', `<div class="ecx-now" style="top:calc(var(--ph) * ${10.7 - H0})" data-tip="Now, 10:42"></div>`);
  /* a dashed slot follows the pointer over free time; click it to add an event there */
  const ghost = html('<div class="ecx-ghost">+ New event</div>');
  $$('.ecx-col', grid).forEach(cl => {
    cl.onpointermove = m => { if (m.target !== cl || $('.ecx-e.drag', grid)){ ghost.remove(); return; } const h = H0 + Math.min(15, Math.floor((m.clientY - cl.getBoundingClientRect().top) / PX() * 2)) / 2;
      ghost.style.top = at(h); ghost._h = h; if (ghost.parentElement !== cl) cl.appendChild(ghost); };
    cl.onpointerleave = () => ghost.remove();
    cl.onclick = m => { if (m.target !== cl || ghost.parentElement !== cl) return; const e = [+cl.dataset.d, ghost._h, 1, 'New event', 'k']; ghost.remove(); const el = ev(e); cl.appendChild(el); enter(el); bind(el, e); openPop(el); };
  });
  c.on(document, 'pointerdown', d => { if (openFor && !pop.contains(d.target) && !openFor.contains(d.target)) closePop(); });
  c.on(document, 'keydown', k => { if (k.key === 'Escape') closePop(); });
  const ask = $('.ecx-ask', r);
  // the button keeps its spark, only the words crossfade
  const tell = t => swap(ask, I('spark','xs') + t, true);
  ask.onclick = () => c.run(async () => {
    $$('.ecx-e.sug', grid).forEach(x => x.remove());
    ask.innerHTML = '<span class="think on"><i></i><i></i><i></i><i></i></span>Checking 4 calendars'; const sc = $('.ecx-scan', grid); sc.classList.remove('go'); void sc.offsetWidth; sc.classList.add('go');
    await c.wait(1300);
    const S = [[2,13.5,.75,'Design review','b'],[4,13,.75,'Design review','b']];
    S.forEach((s, i) => { const el = ev(s, 'sug' + (i ? ' alt' : '')); if (!i) el.insertAdjacentHTML('beforeend', '<div class="ecx-sg"><button class="y">Book</button><button class="n">Other</button></div>'); col(s[0]).appendChild(el); el.style.animationDelay = i * 120 + 'ms'; el.style.height = 'auto'; el.style.minHeight = tall(s[2]); });
    ask.innerHTML = I('spark','xs') + 'Everyone is free Wed 1:30';
    showDay(S[0][0]);
    const best = $('.ecx-e.sug:not(.alt)', grid);
    $('.y', best).onclick = e => { e.stopPropagation(); best.classList.remove('sug'); best.style.background = 'var(--pb-bg)'; best.style.color = 'var(--pb)'; best.style.boxShadow = ''; $('.ecx-sg', best).remove(); enter(best); bind(best, S[0]); $$('.ecx-e.sug', grid).forEach(x => x.remove()); tell('Booked, invites sent to 4 people'); };
    $('.n', best).onclick = e => { e.stopPropagation(); const alt = $('.ecx-e.sug.alt', grid); best.remove(); alt.classList.remove('alt'); alt.insertAdjacentHTML('beforeend', '<div class="ecx-sg"><button class="y">Book</button></div>'); $('.y', alt).onclick = ev2 => { ev2.stopPropagation(); alt.classList.remove('sug'); alt.style.background = 'var(--pb-bg)'; alt.style.color = 'var(--pb)'; $('.ecx-sg', alt).remove(); bind(alt, S[1]); tell('Booked Fri 1:00, invites sent'); }; tell('Next best: Fri 1:00'); showDay(S[1][0]); };
  });
  // the preview asks the agent for a slot once on its own, unless you take over first
  c.auto(1200, () => ask.click());
});
/* ---------- Agenda ---------- */
DM.def('agenda', (r, c) => {
  const E = [
    ['9:00','Standup','15 min, Design team','b',[['MK','var(--av-l)'],['JO','var(--av-m)'],['AR','var(--av-p)']],null,1],
    ['11:30','Agent demo','30 min, Zoom','y',[['SL','var(--av-t)'],['MK','var(--av-l)']],['Demo flow: pricing audit, then the token export','Sam asked about cost limits last time, the cap is now $5'],0],
    ['1:00','Pricing workshop','90 min, Room 4','p',[['JO','var(--av-m)'],['AR','var(--av-p)'],['DK','var(--av-b)'],['MK','var(--av-l)']],['Trial to paid is up 8.1 pts since Sep 18','Open question: show monthly price crossed out on mobile too?','3 frames ready to review in Figma'],0],
    ['4:00','1:1 with Maya','30 min','l',[['MK','var(--av-l)']],['She wanted feedback on the checkout copy','Library publish is waiting on her approval'],0]
  ];
  const list = $('.agx-list', r);
  list.innerHTML = E.map((e, i) => `<button class="agx-e${e[6] ? ' past' : ''}" data-i="${i}"><span class="tm num">${e[0]}</span><span class="bar"></span><span class="t"><b>${e[1]}</b><span>${e[2]}</span><span class="who">${e[4].map(a => AV(a[0], a[1])).join('')}</span></span></button>`).join('');
  const rows = $$('.agx-e', list);
  rows[0].after(html('<div class="agx-now"><i></i>10:42</div>'));
  stagger([...list.children], 60);
  rows.forEach((el, i) => el.onclick = () => {
    const open = el.classList.contains('open'); rows.forEach(x => { x.classList.remove('open'); $('.agx-prep', x)?.remove(); });
    if (open || !E[i][5]) return;
    el.classList.add('open');
    const p = html(`<div class="agx-prep">${E[i][5].map(t => `<div>${I('spark','xs')}<span>${t}</span></div>`).join('')}${i === 1 ? '<span class="pill accent sm agx-join">Join in 48 min</span>' : ''}</div>`);
    el.appendChild(p); stagger([...p.children], 60);
  });
  // the preview opens one meeting on its own, unless you take over first
  c.auto(1000, () => rows[2].click());
});