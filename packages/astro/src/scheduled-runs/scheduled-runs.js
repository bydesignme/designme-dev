// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, BRAND, DM, I, REDUCE, closePops, enter, grow, html, placePop, popRoom, seg, stagger, swap } from '../core/core.js';
DM.def('scheduled-runs', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{plus}', I('plus','xs')).replace('{clock}', I('clock','xs'));
  // in this preview it is Saturday afternoon, so Monday at 9:00 is two days off, and every new schedule runs at 9:00. A run's
  // mark is its tool's logo, or its icon on a vivid tile of its colour
  const R = [
    { mark:'palette', col:'l', name:'Weekly design QA', when:'Mondays at 9:00', next:'Next in 2 days', on:true, res:'ok', ago:'5 days ago' },
    { mark:'@figma', name:'Sync tokens from Figma', when:'Every day at 8:00', next:'Next in 17h', on:true, res:'bad', why:'Figma token expired', fix:'Reconnect Figma' },
    { mark:'chart', col:'t', name:'Competitor price check', when:'Fridays at 17:00', next:'Next in 6 days', on:true, res:'ok', ago:'yesterday' }
  ];
  const root = $('.shx', r) || r, list = $('.shx-list', r), add = $('.shx-add', r), pop = $('.shx-pop', r), form = $('.shx-f', r);
  const inp = $('.shx-in', r), days = $('.shx-days', r), sum = $('.shx-sum', r), mk = $('.shx-mk', r);
  function row(x){
    const ic = x.mark[0] === '@' ? `<span class="ic brandic" aria-hidden="true">${BRAND[x.mark.slice(1)]}</span>` : `<span class="ic" style="background:var(--dm-av-${x.col});color:var(--dm-av-${x.col}-ink)" aria-hidden="true">${I(x.mark,'xs')}</span>`;
    x.el = html(`<div class="shx-r" role="listitem">${ic}<span class="t"><span class="nm"></span><span class="d"></span><span class="res"></span></span><span class="shx-act"><button class="ib shx-run" data-tip="Run now">${I('play')}</button><button class="toggle" role="switch"></button></span><div class="shx-fx fold shut" inert><div><div><button class="pill accent sm shx-fix"></button></div></div></div></div>`);
    $('.nm', x.el).textContent = x.name; $('.shx-run', x.el).setAttribute('aria-label', 'Run ' + x.name + ' now'); $('.toggle', x.el).setAttribute('aria-label', x.name);
    $('.shx-run', x.el).onclick = () => run(x);
    $('.toggle', x.el).onclick = () => { x.on = !x.on; paint(x); };
    $('.shx-fix', x.el).onclick = () => fix(x);
    paint(x, true); return x.el;
  }
  // the result line, led by its mark: a tick when it passed, a sign when it failed, a turning ring while it runs (its words
  // shimmer, as every line of a process at work)
  function paint(x, now){
    const el = x.el, put = (e, t, h) => now ? (h ? e.innerHTML = t : e.textContent = t) : swap(e, t, h);
    el.classList.toggle('off', !x.on); el.dataset.st = x.run ? 'run' : x.res || 'none';
    const tg = $('.toggle', el); tg.setAttribute('aria-checked', x.on); tg.dataset.tip = x.on ? 'Pause' : 'Resume';
    put($('.d', el), x.when + ' · ' + (x.on ? x.next : 'Paused'));
    const res = document.createElement('span'); res.textContent = x.run ? 'Running now' : x.res === 'ok' ? 'Passed ' + x.ago : x.res === 'bad' ? 'Failed: ' + x.why : 'No runs yet';
    if (x.run) res.className = 'shim';
    put($('.res', el), (x.run ? '<span class="spin" aria-hidden="true"></span>' : x.res ? I(x.res === 'ok' ? 'ok' : 'alert', 'xs') : '') + res.outerHTML, true);
    $('.shx-run', el).disabled = !!x.run || !x.on;
    const fx = $('.shx-fx', el), on = x.res === 'bad' && !x.run, b = $('.shx-fix', el);
    if (on && !x.fixing){ b.textContent = x.fix; b.removeAttribute('aria-disabled'); }
    fx.classList.toggle('shut', !on); fx.inert = !on;
  }
  // Run now: the result's ring turns while it runs, then it passes
  function run(x){
    if (x.run) return; x.run = true; paint(x);
    c.later(3000, () => { x.run = false; x.res = 'ok'; x.ago = 'just now'; paint(x); });
  }
  // the fix for a failed run reconnects, then runs it again straight away. The button is as wide as its words and eases to
  // the new ones
  function fix(x){
    if (x.fixing) return; x.fixing = true; const b = $('.shx-fix', x.el), w0 = b.getBoundingClientRect().width;
    // it keeps its colour while it reconnects, and takes no second press
    b.setAttribute('aria-disabled', 'true'); b.innerHTML = '<span class="spin"></span>Reconnecting'; const w1 = b.getBoundingClientRect().width;
    const cs = getComputedStyle(b), t = cs.getPropertyValue('--dm-t').trim();
    if (!REDUCE && Math.abs(w1 - w0) > .5) b.animate([{ width:w0 + 'px' }, { width:w1 + 'px' }], { duration:(t.endsWith('ms') ? parseFloat(t) : parseFloat(t) * 1000) || 340, easing:cs.getPropertyValue('--dm-ease').trim() || 'ease' });
    c.later(900, () => { x.fixing = false; run(x); });
  }
  // the head is the title alone: no count that repeats what the rows say (the owner's notes on batch 2)
  R.forEach(x => list.appendChild(row(x))); stagger([...list.children], 50);
  // New schedule: a task in words and how often. Custom picks the days; the line under it says when the first run is
  const DAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  days.innerHTML = DAY.map((d, i) => `<button type="button" aria-pressed="${i === 0 || i === 2 || i === 4}" aria-label="${FULL[i]}">${d[0]}</button>`).join('');
  let rep = 'day';
  const picked = () => rep === 'day' ? [0, 1, 2, 3, 4, 5, 6] : rep === 'mon' ? [0] : $$('button', days).map((b, i) => b.getAttribute('aria-pressed') === 'true' ? i : -1).filter(i => i >= 0);
  const when = ds => ds.length === 7 ? 'Every day at 9:00' : ds.join() === '0,1,2,3,4' ? 'Weekdays at 9:00' : ds.length === 1 ? FULL[ds[0]] + 's at 9:00' : ds.map(d => DAY[d]).join(', ') + ' at 9:00';
  // today is Saturday (5) after 9:00, so tomorrow's run is 18 hours off and the rest whole days
  const next = ds => { const n = Math.min(...ds.map(d => (d - 5 + 7) % 7 || 7)); return n === 1 ? 'Next in 18h' : `Next in ${n} days`; };
  function form1(){ const ds = picked(); sum.textContent = ds.length ? next(ds).replace('Next', 'First run') : 'Pick at least one day'; mk.disabled = !inp.value.trim() || !ds.length; }
  // a menu opens over the card from its button: down when it fits below, up when it doesn't and fits above or has more room
  // there (as placePop), within the stage's room, so it never spills over the card's caption under the stage (as Artifact
  // card's version menu). The side is set on the button just before the menu is placed
  const side = (btn, pop) => { const room = popRoom(btn), st = btn.closest('.stage-inner') || btn.closest('.stage');
    if (st){ const sr = st.getBoundingClientRect(), cs = getComputedStyle(st); room.top = Math.max(room.top, sr.top + parseFloat(cs.paddingTop)); room.bottom = Math.min(room.bottom, sr.bottom - parseFloat(cs.paddingBottom)); }
    const br = btn.getBoundingClientRect(), need = pop.offsetHeight + 12, below = room.bottom - br.bottom, above = br.top - room.top;
    btn.dataset.popPos = below < need && (above >= need || above > below) ? 'up' : 'down'; };
  // the form keeps the side it opened on: one that opened upwards grows upwards, held by its bottom edge
  const replace = () => { if (!(pop.style.getPropertyValue('--dm-origin') || '').startsWith('bottom')) side(add, pop); placePop(add, pop); };
  seg($('.shx-rep', r), v => { rep = v; days.hidden = v !== 'custom'; form1(); if (pop.classList.contains('open')) replace(); });
  $$('button', days).forEach(b => b.onclick = () => { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); form1(); });
  inp.oninput = form1; form1();
  c.on(add, 'click', e => { if (pop.classList.contains('open')) return; side(add, pop); if (e.isTrusted) c.later(0, () => inp.focus({ preventScroll:true })); });
  c.on(form, 'submit', e => {
    e.preventDefault(); const ds = picked(); if (!inp.value.trim() || !ds.length) return;
    const x = { mark:'clock', col:'b', name:inp.value.trim(), when:when(ds), next:next(ds), on:true, res:null };
    R.push(x); list.appendChild(row(x)); enter(x.el); closePops(); inp.value = ''; form1();
  });
  // the card grows with its rows, and eases as a fix folds open or shut (owner, 17 Nov: no room kept for a later state)
  c.offs.push(grow(root));
  // the preview's story: run the design QA now and watch it pass, reconnect Figma so the token sync passes again, then
  // pause the price check
  c.story(async s => {
    const [qa, fig, price] = R;
    await s.beat(3);
    await s.point($('.shx-run', qa.el)); await s.beat(1);
    await s.tap($('.shx-run', qa.el)); s.away();
    await s.until(() => !qa.run && qa.ago === 'just now'); await s.beat(2);
    await s.tap($('.shx-fix', fig.el)); s.away();
    await s.until(() => !fig.run && fig.res === 'ok'); await s.beat(2);
    await s.tap($('.toggle', price.el)); s.away(); await s.beat(3);
  });
});
