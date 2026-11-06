// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, html, seg, swap } from '../core/core.js';
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
    '2026-10-19':[['10:00', 'Kickoff with Maya', 'Pricing v4 brief', 'var(--dm-pl)'], ['15:00', 'Brief the agents', 'Build and copy agents', 'var(--dm-pm)']],
    '2026-10-20':[['10:00', 'Wireframe review', 'Pricing v4, frames 1 to 6', 'var(--dm-pl)'], ['11:30', 'Copy for the plan cards', 'Copy agent', 'var(--dm-pt)'], ['14:00', 'Token audit', 'Build agent', 'var(--dm-pm)']],
    '2026-10-21':[['11:00', 'Copy pass', 'Plan cards and FAQ', 'var(--dm-pt)']],
    '2026-10-22':[['14:00', 'Design QA', 'Pricing v4, all frames', 'var(--dm-pb)'], ['16:30', 'Fix contrast issues', 'Build agent', 'var(--dm-pm)']],
    '2026-10-23':[['09:30', 'Pricing review with Maya', 'Pricing v4, frames 1 to 3', 'var(--dm-pl)'], ['13:00', 'Export tokens to CSS', 'Build agent', 'var(--dm-pm)'], ['16:00', 'Ship pricing v4', 'designme.studio/pricing', 'var(--dm-pb)']],
    '2026-10-24':[], '2026-10-25':[]
  };
  const POOL = [['Design crit', 'Pricing frames', 'var(--dm-pl)'], ['Token audit', 'Build agent', 'var(--dm-pm)'], ['Copy pass', 'Plan cards', 'var(--dm-pt)'], ['Stakeholder check-in', 'Weekly', 'var(--dm-pb)'],
    ['User interviews', 'Three sessions', 'var(--dm-pl)'], ['Conversion review', 'Trial to paid', 'var(--dm-pb)'], ['Research synthesis', 'Notes and quotes', 'var(--dm-pt)'], ['Fix review notes', 'Build agent', 'var(--dm-pm)']];
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
    day:[d => mo(d, { weekday:'long', month:'short', day:'numeric' }), d => { const e = evs(d); return e.length ? `<div class="sgc-day">${e.map(([t, n, x, col]) => `<div class="sgc-ev" style="--dm-c:${col}"><span class="num muted">${t}</span><i></i><span class="t">${n}<span>${x}</span></span></div>`).join('')}</div>` : '<div class="sgc-none">Nothing planned</div>'; }],
    week:[d => { const a = mon(d), b = at(a, 4); return mo(a, { month:'short', day:'numeric' }) + ' – ' + (a.getMonth() === b.getMonth() ? b.getDate() : mo(b, { month:'short', day:'numeric' })); },
      d => `<div class="sgc-wk">${Array.from({ length:5 }, (_, i) => at(mon(d), i)).map(x => { const ev = evs(x);
        return `<button class="sgc-wr${same(x, TODAY) ? ' now' : ''}${ev.length ? '' : ' none'}" data-d="${iso(x)}" aria-label="${mo(x, { weekday:'long', month:'long', day:'numeric' })}, ${ev.length ? ev.length + (ev.length === 1 ? ' event' : ' events') : 'nothing planned'}"><span class="d">${mo(x, { weekday:'short' })} ${x.getDate()}</span>${ev.length ? `<span class="e" style="--dm-c:${ev[0][3]}"><i></i><span>${ev[0][1]}</span></span>${ev.length > 1 ? `<span class="more">+${ev.length - 1} more</span>` : ''}` : '<span class="e">Nothing planned</span>'}</button>`; }).join('')}</div>`],
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
