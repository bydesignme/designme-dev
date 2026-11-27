TPLS["event-calendar"] = "<div class=\"ecx panel\">\n  <div class=\"ecx-h\"><b>Oct 19 – 23, 2026</b><span class=\"ecx-sp\"></span><span class=\"ecx-msg muted\"></span><button class=\"pill soft sm ecx-ask mx-w\">{spark}Find 45 min for a design review</button></div>\n  <div class=\"ecx-days\" role=\"group\" aria-label=\"Day\"></div>\n  <div class=\"ecx-sc\"><div class=\"ecx-grid\"><div class=\"ecx-tm\"></div></div></div>\n</div>";
TPLS["date-picker"] = "<div class=\"dpk\">\n  <button class=\"dpk-f\" data-pop=\".dpk-pop\" data-pop-pos=\"down\">{cal}<span class=\"dpk-val\">Pick a launch date</span>{chev}</button>\n  <div class=\"pop dpk-pop\" role=\"dialog\" aria-label=\"Choose a date\">\n    <input class=\"dpk-nl\" placeholder=\"Try “next friday” or “in 2 weeks”\" spellcheck=\"false\">\n    <div class=\"dpk-qk\"><button class=\"chip sm\" data-d=\"0\">Today</button><button class=\"chip sm\" data-d=\"1\">Tomorrow</button><button class=\"chip sm\" data-d=\"7\">In a week</button></div>\n    <div class=\"dpk-mh\"><button class=\"ib dpk-pv\" aria-label=\"Previous month\">{l}</button><b class=\"dpk-m\"></b><button class=\"ib dpk-nx\" aria-label=\"Next month\">{r}</button></div>\n    <div class=\"dpk-wd muted\"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>\n    <div class=\"dpk-vp\"><div class=\"dpk-g\"></div></div>\n  </div>\n</div>";

/* ---------- Date picker ---------- */
DM.def('date-picker', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{cal}', I('cal','xs')).replace('{chev}', I('chev-d','xs')).replace('{l}', I('chev-l','xs')).replace('{r}', I('chev-r','xs'));
  // today is the real today: the calendar opens on its month and the quick picks and typed dates count from it
  const now = new Date(), TODAY = new Date(now.getFullYear(), now.getMonth(), now.getDate()); let view = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1), sel = null;
  const g = $('.dpk-g', r), m = $('.dpk-m', r), val = $('.dpk-val', r), f = $('.dpk-f', r); let cursor = null;
  // Clean's one hover: a neutral circle that glides from day to day (hoverGlide)
  c.offs.push(hoverGlide($('.dpk-vp', r), '.dpk-d', { keep:'.s' }));
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
  // (the wait is the glide's own transition delay, so a busy page can't hold the field up there longer than the fade)
  const mo = new MutationObserver(() => { box.style.transitionDelay = isOpen() || REDUCE ? '' : '.18s'; centred(); });
  mo.observe(f, { attributes:true, attributeFilter:['aria-expanded'] }); c.offs.push(() => mo.disconnect());
  // the preview opens it, types a date, and closes it on the day it found: the closed field shows the date, centred again.
  // Clicking, focusing or typing in it takes over, and what it had typed goes. One popover is open at a time on the page, so
  // the preview waits while another card's demo has its menu open, and never takes it from that card; if another card closes
  // this calendar while it types, the typing waits and goes on once the calendar is open again
  const free = async () => { for (let k = 0; k < 40 && openPop && openPop.pop !== pop; k++) await c.step(250); };
  const shown = async () => { if (isOpen()) return; await free(); f.click(); await c.step(400); };
  c.auto(800, () => c.run(async () => {
    const i = $('.dpk-nl', r); let typed = '';
    c.taken(() => { if (typed && i.isConnected && i.value === typed){ i.value = ''; i.oninput({ target:i }); } });
    await shown(); await c.step(100);
    for (const ch of 'next friday'){ await shown(); await c.step(70); typed += ch; i.value = typed; i.oninput({ target:i }); }
    typed = '';
    await shown(); await c.step(2400); if (isOpen()) closePops(); }));
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
  const panel = $('.ecx', r), msg = $('.ecx-msg', r), pop = html('<div class="ecx-pop mx-pop" role="dialog" aria-label="Event"></div>'); panel.appendChild(pop);
  const WHO = [['MK','var(--av-l)','MK-g03'],['JO','var(--av-m)','JO-g01'],['DA','var(--av-b)'],['AR','var(--av-p)','AR-g02']], DAYN = ['Mon','Tue','Wed','Thu','Fri'];
  let openFor = null;
  const say = t => swap(msg, t);
  // closing gives the focus back to the event when it was in the card
  const closePop = () => { const back = pop.contains(document.activeElement) && openFor; pop.classList.remove('open'); if (openFor) openFor.classList.remove('on'); openFor = null; if (back && back.isConnected) back.focus({ preventScroll:true }); };
  /* the details card opens beside the event and stays inside the calendar */
  function openPop(el){
    const e = el._e; if (openFor === el){ closePop(); return; } if (openFor) openFor.classList.remove('on'); openFor = el; el.classList.add('on'); const n = 2 + e[3].length % 3, fresh = e[3] === 'New event';
    pop.innerHTML = `<div class="ecx-ph"><i style="background:var(--p${e[4]})"></i>${fresh ? '<input class="ecx-ti" placeholder="Add a title" aria-label="Event title">' : `<b>${e[3]}</b>`}<button class="ib ecx-px mx-press" aria-label="Close" data-tip="Close">${I('x','xs')}</button></div><div class="ecx-pt">${DAYN[e[0]]} ${DAYS[e[0]].split(' ')[1]} Oct · ${tm(e[1])} – ${tm(e[1] + e[2])}</div><div class="ecx-pw">${WHO.slice(0, n).map(w => AV(w[0], w[1], w[2])).join('')}<span class="muted">${n} people</span></div><div class="ecx-pa">${fresh ? '<button class="pill line sm ecx-del mx-press">Discard</button><button class="pill primary sm ecx-save">Save</button>' : `<button class="pill line sm ecx-prep mx-press">${I('spark','xs')}Prep notes</button><button class="pill primary sm">Join</button>`}</div>`;
    const pr = panel.getBoundingClientRect(), er = el.getBoundingClientRect(), w = 248;
    let x = er.right - pr.left + 8; if (x + w > pr.width - 16) x = er.left - pr.left - w - 8; x = Math.max(16, x);
    let y = er.top - pr.top; y = Math.max(16, Math.min(y, pr.height - pop.offsetHeight - 24));
    // (it scales and fades from the event's side, where Clean's popovers start)
    pop.style.left = x + 'px'; pop.style.top = y + 'px'; pop.style.setProperty('--origin', (x > er.left - pr.left ? 'left' : 'right') + ' top');
    pop.classList.remove('open'); void pop.offsetWidth; pop.classList.add('open'); hideTip();
    $('.ecx-px', pop).onclick = closePop;
    // Prep notes: its words shimmer while the agent writes; then the notes arrive above the buttons and the button stays, with
    // the green tick in place of its spark
    // (the button eases to the width of what it says now: mxWidth(), motion pieces)
    const relabel = (b, h) => { const w0 = b.offsetWidth; b.innerHTML = h; if (!REDUCE && w0) mxWidth(b, w0); };
    const prep = $('.ecx-prep', pop); if (prep) prep.onclick = () => { if (prep._busy) return; prep._busy = true; relabel(prep, '<span class="think on"><i></i><i></i><i></i><i></i></span><span class="shim">Writing</span>'); c.later(1200, () => { if (!prep.isConnected) return; const nt = html(`<div class="ecx-note">${I('spark','xs')}<span>Last week's decisions and 3 open questions.</span></div>`); prep.closest('.ecx-pa').before(nt); enter(nt); relabel(prep, I('check','xs') + 'Prep notes'); prep.classList.add('done'); prep.setAttribute('aria-disabled', 'true'); }); };
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
    const w0 = ask.offsetWidth; ask.innerHTML = '<span class="think on"><i></i><i></i><i></i><i></i></span><span class="shim">Checking 4 calendars</span>'; if (!REDUCE && w0) mxWidth(ask, w0); const sc = $('.ecx-scan', grid); sc.classList.remove('go'); void sc.offsetWidth; sc.classList.add('go');
    await c.wait(1300);
    const S = [[2,13.5,.75,'Design review','b'],[4,13,.75,'Design review','b']];
    S.forEach((s, i) => { const el = ev(s, 'sug' + (i ? ' alt' : '')); if (!i) el.insertAdjacentHTML('beforeend', '<div class="ecx-sg"><button class="y">Book</button><button class="n">Other</button></div>'); col(s[0]).appendChild(el); el.style.animationDelay = i * 120 + 'ms'; el.style.height = 'auto'; el.style.minHeight = tall(s[2]); });
    { const w0 = ask.offsetWidth; ask.innerHTML = I('spark','xs') + 'Everyone is free Wed 1:30'; if (!REDUCE && w0) mxWidth(ask, w0); }
    showDay(S[0][0]);
    const best = $('.ecx-e.sug:not(.alt)', grid);
    $('.y', best).onclick = e => { e.stopPropagation(); best.classList.remove('sug'); best.style.background = 'var(--pb-bg)'; best.style.color = 'var(--pb)'; best.style.boxShadow = ''; $('.ecx-sg', best).remove(); enter(best); bind(best, S[0]); $$('.ecx-e.sug', grid).forEach(x => x.remove()); tell('Booked, invites sent to 4 people'); };
    $('.n', best).onclick = e => { e.stopPropagation(); const alt = $('.ecx-e.sug.alt', grid); best.remove(); alt.classList.remove('alt'); alt.insertAdjacentHTML('beforeend', '<div class="ecx-sg"><button class="y">Book</button></div>'); $('.y', alt).onclick = ev2 => { ev2.stopPropagation(); alt.classList.remove('sug'); alt.style.background = 'var(--pb-bg)'; alt.style.color = 'var(--pb)'; $('.ecx-sg', alt).remove(); bind(alt, S[1]); tell('Booked Fri 1:00, invites sent'); }; tell('Next best: Fri 1:00'); showDay(S[1][0]); };
  });
  // the preview asks the agent for a slot once on its own, unless you take over first
  c.auto(1200, () => ask.click());
});