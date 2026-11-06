// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, DM, I, REDUCE, enter, html, stagger, swap } from '../core/core.js';
DM.def('task-table', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{pause}', I('pause','xs')).replace('{refresh}', I('refresh','xs')).replace('{x}', I('x','xs'));
  const ST = { run:['Running','<span class="spin"></span>'], done:['Done', I('ok','xs')], fail:['Failed', I('alert','xs')], wait:['Queued','<span class="dot"></span>'], pause:['Paused', I('pause','xs')] };
  const SEED = [
    ['Audit pricing contrast','run','Design','DS','var(--dm-av-b)',0.42,2],
    ['Export tokens to CSS','done','Code','CO','var(--dm-av-m)',0.18,14],
    ['Sync Figma frames','fail','Design','DS','var(--dm-av-b)',0.07,26],
    ['Draft launch email','wait','Writer','WR','var(--dm-av-l)',0,31],
    ['Compare checkout flows','done','Research','RE','var(--dm-av-t)',0.66,48],
    ['Rename layers in Hero','run','Design','DS','var(--dm-av-b)',0.11,5]
  ];
  const seed = () => SEED.map((x, i) => ({ id:i, n:x[0], s:x[1], a:x[2], ai:x[3], ac:x[4], cost:x[5], up:x[6], sel:false }));
  let T = seed();
  const box = $('.ttx', r), tb = $('tbody', r), all = $('.ttx-all', r), sb = $('.ttx-sb', r), sum = $('.ttx-sum', r), cnt = $('.ttx-n', r);
  const ease = getComputedStyle(r).getPropertyValue('--dm-ease').trim() || 'ease';
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
  // rows glide to their new places: measured before and after the move, then eased from where they were
  function order(anim){
    const f = fields[key], list = [...T].sort((a, b) => { const x = f(a), y = f(b); return (x > y ? 1 : x < y ? -1 : 0) * (desc ? -1 : 1); });
    const first = anim && !REDUCE ? new Map(list.map(t => [t.id, rows.get(t.id).getBoundingClientRect().top])) : null;
    list.forEach(t => tb.appendChild(rows.get(t.id)));
    if (first) list.forEach(t => { const el = rows.get(t.id), d = first.get(t.id) - el.getBoundingClientRect().top; if (Math.abs(d) > 1) el.animate([{ transform:`translateY(${d}px)` }, { transform:'none' }], { duration:520, easing:ease }); });
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
    const go = () => { const first = new Map(T.map(t => [t.id, rows.get(t.id).getBoundingClientRect().top]));
      out.forEach(t => { rows.get(t.id).remove(); rows.delete(t.id); });
      if (!REDUCE) T.forEach(t => { const el = rows.get(t.id), d = first.get(t.id) - el.getBoundingClientRect().top; if (Math.abs(d) > 1) el.animate([{ transform:`translateY(${d}px)` }, { transform:'none' }], { duration:480, easing:ease }); });
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
