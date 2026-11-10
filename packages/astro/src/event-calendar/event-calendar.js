// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, DM, I, enter, hideTip, html, openPop, swap } from '../core/core.js';
DM.def('event-calendar', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{spark}', I('spark','xs'));
  const DAYS = ['Mon 19','Tue 20','Wed 21','Thu 22','Fri 23'], H0 = 9;
  const EV = [[0,9,1,'Standup','b'],[0,13,1.5,'Pricing workshop','p'],[1,10,1,'1:1 with Maya','l'],[1,14,2,'Focus: checkout','t'],[2,9,1,'Standup','b'],[2,11.5,1,'Agent demo','y'],[3,9,1,'Standup','b'],[3,12,1,'Lunch & learn','m'],[3,15,1.5,'Launch review','r'],[4,10,1.5,'Planning','p']];
  const grid = $('.ecx-grid', r);
  // an hour's height (--ph): 44px, or 56px on a narrow calendar where each 28px row is half an hour. Places are written in it,
  // so events keep their times when the calendar narrows or widens
  const PX = () => parseFloat(getComputedStyle(grid).getPropertyValue('--dm-ph')) || 44, at = h => `calc(var(--dm-ph) * ${h - H0} + 1px)`, tall = n => `calc(var(--dm-ph) * ${n} - 3px)`;
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
  const ev = (e, cls = '') => html(`<button class="ecx-e ${cls}" style="top:${at(e[1])};height:${tall(e[2])};background:var(--dm-p${e[4]}-bg);color:var(--dm-p${e[4]})"><b>${e[3]}</b><span>${tm(e[1])} – ${tm(e[1] + e[2])}</span></button>`);
  const panel = $('.ecx', r), msg = $('.ecx-msg', r), pop = html('<div class="ecx-pop" role="dialog" aria-label="Event"></div>'); panel.appendChild(pop);
  const WHO = [['MK','var(--dm-av-l)'],['JO','var(--dm-av-m)'],['DA','var(--dm-av-b)'],['AR','var(--dm-av-p)']], DAYN = ['Mon','Tue','Wed','Thu','Fri'];
  let openFor = null;
  const say = t => swap(msg, t);
  // closing gives the focus back to the event when it was in the card
  const closePop = () => { const back = pop.contains(document.activeElement) && openFor; pop.classList.remove('open'); openFor = null; if (back && back.isConnected) back.focus({ preventScroll:true }); };
  /* the details card opens beside the event and stays inside the calendar */
  function openPop(el){
    const e = el._e; if (openFor === el){ closePop(); return; } openFor = el; const n = 2 + e[3].length % 3, fresh = e[3] === 'New event';
    pop.innerHTML = `<div class="ecx-ph"><i style="background:var(--dm-p${e[4]})"></i>${fresh ? '<input class="ecx-ti" placeholder="Add a title" aria-label="Event title">' : `<b>${e[3]}</b>`}<button class="ib ecx-px" aria-label="Close" data-tip="Close">${I('x','xs')}</button></div><div class="ecx-pt">${DAYN[e[0]]} ${DAYS[e[0]].split(' ')[1]} Oct · ${tm(e[1])} – ${tm(e[1] + e[2])}</div><div class="ecx-pw">${WHO.slice(0, n).map(w => AV(w[0], w[1])).join('')}<span class="muted">${n} people</span></div><div class="ecx-pa">${fresh ? '<button class="pill line sm ecx-del">Discard</button><button class="pill primary sm ecx-save">Save</button>' : `<button class="pill soft sm ecx-prep">${I('spark','xs')}Prep notes</button><button class="pill primary sm">Join</button>`}</div>`;
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
  col(0).insertAdjacentHTML('beforeend', `<div class="ecx-now" style="top:calc(var(--dm-ph) * ${10.7 - H0})" data-tip="Now, 10:42"></div>`);
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
    $('.y', best).onclick = e => { e.stopPropagation(); best.classList.remove('sug'); best.style.background = 'var(--dm-pb-bg)'; best.style.color = 'var(--dm-pb)'; best.style.boxShadow = ''; $('.ecx-sg', best).remove(); enter(best); bind(best, S[0]); $$('.ecx-e.sug', grid).forEach(x => x.remove()); tell('Booked, invites sent to 4 people'); };
    $('.n', best).onclick = e => { e.stopPropagation(); const alt = $('.ecx-e.sug.alt', grid); best.remove(); alt.classList.remove('alt'); alt.insertAdjacentHTML('beforeend', '<div class="ecx-sg"><button class="y">Book</button></div>'); $('.y', alt).onclick = ev2 => { ev2.stopPropagation(); alt.classList.remove('sug'); alt.style.background = 'var(--dm-pb-bg)'; alt.style.color = 'var(--dm-pb)'; $('.ecx-sg', alt).remove(); bind(alt, S[1]); tell('Booked Fri 1:00, invites sent'); }; tell('Next best: Fri 1:00'); showDay(S[1][0]); };
  });
  // the preview asks the agent for a slot once on its own, unless you take over first
  c.auto(1200, () => ask.click());
});
