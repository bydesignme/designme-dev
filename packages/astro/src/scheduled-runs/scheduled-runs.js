// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, BRAND, DM, I, closePops, enter, html, placePop, seg, stagger, swap } from '../core/core.js';
DM.def('scheduled-runs', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{plus}', I('plus','xs'));
  // in this preview it is Saturday afternoon, so Monday at 9:00 is two days off, and every new schedule runs at 9:00
  const R = [
    { mark:'palette', col:'var(--dm-pl)', name:'Weekly design QA', when:'Mondays at 9:00', next:'Next in 2 days', on:true, res:'ok', ago:'5 days ago' },
    { mark:'@figma', name:'Sync tokens from Figma', when:'Every day at 8:00', next:'Next in 17h', on:true, res:'bad', why:'Figma token expired', fix:'Reconnect Figma' },
    { mark:'chart', col:'var(--dm-pt)', name:'Competitor price check', when:'Fridays at 17:00', next:'Next in 6 days', on:true, res:'ok', ago:'yesterday' }
  ];
  const list = $('.shx-list', r), st = $('.shx-st', r), add = $('.shx-add', r), pop = $('.shx-pop', r), form = $('.shx-f', r);
  const inp = $('.shx-in', r), days = $('.shx-days', r), sum = $('.shx-sum', r), mk = $('.shx-mk', r);
  function row(x){
    const ic = x.mark[0] === '@' ? `<span class="ic brandic" aria-hidden="true">${BRAND[x.mark.slice(1)]}</span>` : `<span class="ic" style="color:${x.col};background:color-mix(in srgb,${x.col} 12%,transparent)" aria-hidden="true">${I(x.mark,'xs')}</span>`;
    x.el = html(`<div class="shx-r" role="listitem">${ic}<span class="t"><span class="nm"></span><span class="d"></span><span class="res"></span></span><span class="shx-act"><button class="ib shx-run" data-tip="Run now">${I('play')}</button><button class="toggle" role="switch"></button></span><div class="shx-fx fold shut" inert><div><div><button class="pill accent sm shx-fix"></button></div></div></div></div>`);
    $('.nm', x.el).textContent = x.name; $('.shx-run', x.el).setAttribute('aria-label', 'Run ' + x.name + ' now'); $('.toggle', x.el).setAttribute('aria-label', x.name);
    $('.shx-run', x.el).onclick = () => run(x);
    $('.toggle', x.el).onclick = () => { x.on = !x.on; paint(x); counts(); };
    $('.shx-fix', x.el).onclick = () => fix(x);
    paint(x, true); return x.el;
  }
  function paint(x, now){
    const el = x.el, put = (e, t, h) => now ? (h ? e.innerHTML = t : e.textContent = t) : swap(e, t, h);
    el.classList.toggle('off', !x.on); el.dataset.st = x.run ? 'run' : x.res || 'none';
    const tg = $('.toggle', el); tg.setAttribute('aria-checked', x.on); tg.dataset.tip = x.on ? 'Pause' : 'Resume';
    put($('.d', el), x.when + ' · ' + (x.on ? x.next : 'Paused'));
    const res = document.createElement('span'); res.textContent = x.run ? 'Running now' : x.res === 'ok' ? 'Passed ' + x.ago : x.res === 'bad' ? 'Failed: ' + x.why : 'No runs yet';
    put($('.res', el), (!x.run && x.res ? I(x.res === 'ok' ? 'ok' : 'alert', 'xs') : '') + res.outerHTML, true);
    $('.shx-run', el).disabled = !!x.run || !x.on;
    const fx = $('.shx-fx', el), on = x.res === 'bad' && !x.run, b = $('.shx-fix', el);
    if (on && !x.fixing) b.textContent = x.fix;
    fx.classList.toggle('shut', !on); fx.inert = !on;
  }
  function counts(now){
    const on = R.filter(x => x.on).length, off = R.length - on, bad = R.filter(x => x.on && x.res === 'bad' && !x.run).length;
    const t = `${on} active` + (bad ? ` · ${bad} failed` : '') + (off ? ` · ${off} paused` : '');
    if (now) st.textContent = t; else swap(st, t);
  }
  // Run now: the dot on its icon turns while it runs, then it passes
  function run(x){
    if (x.run) return; x.run = true; paint(x); counts();
    c.later(3000, () => { x.run = false; x.res = 'ok'; x.ago = 'just now'; paint(x); counts(); });
  }
  // the fix for a failed run reconnects, then runs it again straight away
  function fix(x){
    if (x.fixing) return; x.fixing = true; $('.shx-fix', x.el).innerHTML = '<span class="spin"></span>Reconnecting';
    c.later(900, () => { x.fixing = false; run(x); });
  }
  R.forEach(x => list.appendChild(row(x))); stagger([...list.children], 50); counts(true);
  // New schedule: a task in words and how often. Custom picks the days; the line under it says when the first run is
  const DAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  days.innerHTML = DAY.map((d, i) => `<button type="button" aria-pressed="${i === 0 || i === 2 || i === 4}" aria-label="${FULL[i]}">${d[0]}</button>`).join('');
  let rep = 'day';
  const picked = () => rep === 'day' ? [0, 1, 2, 3, 4, 5, 6] : rep === 'mon' ? [0] : $$('button', days).map((b, i) => b.getAttribute('aria-pressed') === 'true' ? i : -1).filter(i => i >= 0);
  const when = ds => ds.length === 7 ? 'Every day at 9:00' : ds.join() === '0,1,2,3,4' ? 'Weekdays at 9:00' : ds.length === 1 ? FULL[ds[0]] + 's at 9:00' : ds.map(d => DAY[d]).join(', ') + ' at 9:00';
  // today is Saturday (5) after 9:00, so tomorrow's run is 18 hours off and the rest whole days
  const next = ds => { const n = Math.min(...ds.map(d => (d - 5 + 7) % 7 || 7)); return n === 1 ? 'Next in 18h' : `Next in ${n} days`; };
  function form1(){ const ds = picked(); sum.textContent = ds.length ? next(ds).replace('Next', 'First run') : 'Pick at least one day'; mk.disabled = !inp.value.trim() || !ds.length; }
  seg($('.shx-rep', r), v => { rep = v; days.hidden = v !== 'custom'; form1(); if (pop.classList.contains('open')) placePop(add, pop); });
  $$('button', days).forEach(b => b.onclick = () => { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); form1(); });
  inp.oninput = form1; form1();
  c.on(add, 'click', e => { if (!pop.classList.contains('open') && e.isTrusted) c.later(0, () => inp.focus({ preventScroll:true })); });
  c.on(form, 'submit', e => {
    e.preventDefault(); const ds = picked(); if (!inp.value.trim() || !ds.length) return;
    const x = { mark:'clock', col:'var(--dm-pb)', name:inp.value.trim(), when:when(ds), next:next(ds), on:true, res:null };
    R.push(x); list.appendChild(row(x)); enter(x.el); counts(); closePops(); inp.value = ''; form1();
  });
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
