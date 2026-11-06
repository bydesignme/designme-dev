// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, centre, hideTip, swap } from '../core/core.js';
DM.def('context-switcher', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{unfold\}/g, I('unfold','xs')).replace(/\{crumb\}/g, I('crumb')).replace('{more}', I('more')).replace('{search}', I('search','xs'));
  // the organisations this account is in, with their plans; each one's projects, and each project's environments. Each level
  // remembers what was picked in it (on), so an organisation brings back the project you were last in, and a project its
  // environment
  const KIND = { Production:'warning', Staging:'blue', Development:'neutral' };
  const envs = (...e) => e.map(([id, k]) => ({ id, name:id, b:[k, KIND[k]] }));
  const STD = () => envs(['live', 'Production'], ['staging', 'Staging'], ['sandbox', 'Development']);
  const ROOT = { on:'fernhill', items:[
    { id:'fernhill', name:'Fernhill Labs', t:'pb', b:['Pro', 'accent'], on:'triage', items:[
      { id:'triage', name:'Support triage agent', on:'eu-live', items:envs(['eu-live', 'Production'], ['us-live', 'Production'], ['staging', 'Staging'], ['sandbox', 'Development']) },
      { id:'invoice', name:'Invoice reader', b:['Beta', 'teal'], on:'staging', items:STD() },
      { id:'research', name:'Sales research agent', on:'live', items:STD() },
      { id:'onboard', name:'Onboarding copilot', b:['Paused', 'neutral'], on:'sandbox', items:STD() },
      { id:'notes', name:'Release notes writer', on:'live', items:STD() }
    ] },
    { id:'quillwork', name:'Quillwork', t:'pp', b:['Free', 'neutral'], on:'coach', items:[
      { id:'coach', name:'Essay coach', on:'live', items:STD() },
      { id:'cite', name:'Citation checker', b:['Beta', 'teal'], on:'staging', items:STD() }
    ] },
    { id:'otterline', name:'Otterline Health', t:'pm', b:['Enterprise', 'violet'], on:'intake', items:[
      { id:'intake', name:'Intake assistant', on:'live', items:STD() },
      { id:'claims', name:'Claims summariser', on:'live', items:STD() },
      { id:'handover', name:'Shift handover notes', b:['Beta', 'teal'], on:'sandbox', items:STD() }
    ] }
  ] };
  // the parts of the path, outermost first
  const KEYS = ['org', 'project', 'env'];
  const SEG = {
    org:{ label:'Organisation', noun:'organisation', many:'organisations', find:'Find an organisation', head:() => 'Your organisations' },
    project:{ label:'Project', noun:'project', many:'projects', find:'Find a project', head:() => `Projects in ${node(0).name}` },
    env:{ label:'Environment', noun:'environment', many:'environments', find:'Find an environment', head:() => `Environments of ${node(1).name}` }
  };
  // the level a part picks from, and what is picked there
  const parent = d => { let n = ROOT; for (let i = 0; i < d; i++) n = n.items.find(x => x.id === n.on); return n; };
  const node = d => { const p = parent(d); return p.items.find(x => x.id === p.on); };
  const box = $('.csw', r), bar = $('.csw-bar', r), pop = $('.csw-pop', r), q = $('.csw-q', r), list = $('.csw-list', r), mpop = $('.csw-mpop', r), more = $('.csw-more', r), live = $('.csw-live', r);
  const uid = Math.random().toString(36).slice(2, 7);
  list.id = 'csw-l-' + uid; q.setAttribute('aria-controls', list.id);
  const trig = k => $(`.csw-seg[data-k="${k}"] .csw-tr`, r);
  KEYS.forEach(k => trig(k).setAttribute('aria-controls', list.id));
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const badge = x => x.b ? `<span class="csw-bd"${x.b[1] && x.b[1] !== 'neutral' ? ` data-tone="${x.b[1]}"` : ''}>${esc(x.b[0])}</span>` : '';
  const tile = x => `<span class="csw-lg" data-t="${x.t}" aria-hidden="true">${esc(x.name[0])}</span>`;
  const named = (x, d) => `${SEG[KEYS[d]].label}: ${x.name}${x.b ? ', ' + x.b[0] : ''}`;

  /* ---- the bar: each part's name and badge, crossfading when they change ---- */
  function paint(first){
    KEYS.forEach((k, d) => {
      const x = node(d), tr = trig(k), nm = $('.csw-nm', tr), bh = $('.csw-bh', tr), lg = $('.csw-lg', tr);
      if (first){ nm.textContent = x.name; bh.innerHTML = badge(x); } else { swap(nm, x.name); swap(bh, badge(x), true); }
      if (lg){ lg.textContent = x.name[0]; lg.dataset.t = x.t; lg.setAttribute('aria-hidden', 'true'); }
      tr.setAttribute('aria-label', named(x, d));
    });
    c.later(REDUCE ? 0 : 220, tips);
  }
  // a name the ellipsis cuts short shows in full in a tooltip
  function tips(){ KEYS.forEach((k, d) => { const tr = trig(k), nm = $('.csw-nm', tr); if (nm.scrollWidth > nm.clientWidth + 1) tr.dataset.tip = node(d).name; else delete tr.dataset.tip; }); }
  // phone narrow (the CSS decides), only the last part shows and the … button stands in for the others
  const narrow = () => getComputedStyle($('.csw-mi', r)).display !== 'none';
  const anchor = k => !narrow() || k === KEYS[KEYS.length - 1] ? trig(k) : more;
  // under what opened it, inside the component's ends
  function place(el, at){
    const b = box.getBoundingClientRect(), a = at.getBoundingClientRect(), br = bar.getBoundingClientRect();
    el.style.left = Math.max(0, Math.min(a.left - b.left, b.width - el.offsetWidth)) + 'px';
    el.style.top = Math.round(br.bottom - b.top + 6) + 'px';
  }

  /* ---- a part's switcher: the search, the list, and Create new at the bottom ---- */
  let open = null, full = 0, hi = 0, opts = [], mopen = false, made = 0;
  function fill(reset){
    const S = SEG[open], d = KEYS.indexOf(open), p = parent(d), v = q.value.trim(), lv = v.toLowerCase();
    const m = p.items.filter(x => !lv || x.name.toLowerCase().includes(lv));
    list.innerHTML = `<div class="ph" role="presentation">${esc(S.head())}</div>`
      + (m.length ? m.map(x => `<div class="mi csw-o" role="option" id="${list.id}-${esc(x.id)}" aria-selected="${x.id === p.on}" data-id="${esc(x.id)}">${d === 0 ? tile(x) : ''}<span class="csw-on">${esc(x.name)}</span>${badge(x)}<span class="ck">${I('check','xs')}</span></div>`).join('')
        : `<div class="csw-none" role="presentation">No ${S.many} match “${esc(v)}”</div>`)
      + `<div class="sep" role="presentation"></div><div class="mi csw-o csw-new" role="option" id="${list.id}-new" aria-selected="false" data-new="1"${v ? '' : ` aria-label="Create new ${S.noun}"`}>${I('plus','xs')}<span class="csw-on">${v ? `Create “${esc(v)}”` : 'Create new…'}</span></div>`;
    opts = $$('.csw-o', list);
    // the highlight starts on the current one; once you type, on the first match
    hi = reset ? Math.max(0, opts.findIndex(o => o.getAttribute('aria-selected') === 'true')) : 0;
    opts.forEach((o, i) => { o.onmousemove = () => { if (hi !== i){ hi = i; move(0); } }; o.onmousedown = e => e.preventDefault(); o.onclick = () => pick(o); });
    move(0);
  }
  function move(by){
    if (!opts.length) return;
    hi = (hi + by + opts.length) % opts.length;
    opts.forEach((o, i) => o.classList.toggle('hl', i === hi));
    q.setAttribute('aria-activedescendant', opts[hi].id);
    // the list scrolls to keep it in view, never the page
    if (!hi){ list.scrollTop = 0; return; }
    const lr = list.getBoundingClientRect(), or = opts[hi].getBoundingClientRect();
    if (or.top < lr.top) list.scrollTop -= lr.top - or.top; else if (or.bottom > lr.bottom) list.scrollTop += or.bottom - lr.bottom;
  }
  function show(k, { focus = false } = {}){
    if (mopen) menu(false);
    if (open === k){ if (focus) q.focus({ preventScroll:true }); return; }
    if (open) hide(false, true);
    open = k; const S = SEG[k];
    q.value = ''; q.placeholder = S.find; q.setAttribute('aria-label', S.find); list.setAttribute('aria-label', S.many[0].toUpperCase() + S.many.slice(1));
    trig(k).setAttribute('aria-expanded', 'true'); q.setAttribute('aria-expanded', 'true');
    fill(true); hideTip(); place(pop, anchor(k)); pop.inert = false; pop.classList.add('open');
    // the bar makes room for the switcher at its fullest, before any filter, so it holds still while typing filters the list
    full = pop.offsetHeight; centred();
    if (focus) q.focus({ preventScroll:true });
  }
  // closing gives the focus back to the part's button (or the … button, on a phone) when it was in the switcher
  function hide(back, next){
    if (!open) return; const k = open; open = null;
    pop.classList.remove('open'); pop.inert = true; trig(k).setAttribute('aria-expanded', 'false'); q.setAttribute('aria-expanded', 'false'); q.removeAttribute('aria-activedescendant');
    if (back) anchor(k).focus({ preventScroll:true });
    // the bar waits for the list to fade before it glides back to the middle
    if (!next) c.later(REDUCE ? 0 : 180, centred);
    // once it has faded it goes back to the component's corner, so a narrower screen later never scrolls sideways to it
    c.later(320, () => { if (!open){ pop.style.left = '0px'; pop.style.top = '0px'; } });
  }
  // what changed, said once for screen readers: the part picked and the parts that came with it
  const say = d => { live.textContent = 'Switched to ' + KEYS.slice(d).map((k, i) => { const x = node(d + i); return `${i ? SEG[k].noun + ' ' : ''}${x.name}${x.b ? ` (${x.b[0]})` : ''}`; }).join(', '); };
  // every change also goes out as a context-change event from the component, with the part changed and the whole path
  const tell = k => box.dispatchEvent(new CustomEvent('context-change', { bubbles:true, detail:{ segment:k, path:Object.fromEntries(KEYS.map((kk, d) => [kk, node(d).id])) } }));
  function pick(o){
    if (!o || !open) return;
    const k = open, d = KEYS.indexOf(k), p = parent(d), back = pop.contains(document.activeElement);
    if (o.dataset.new) return create(k, q.value.trim(), back);
    const was = p.on; p.on = o.dataset.id; hide(back);
    if (p.on !== was){ paint(); say(d); tell(k); }
  }
  // Create new first sends a cancelable context-create event from the component, with the part and what was typed, so your
  // code can open its own form; left alone, it adds one by that name (an organisation with a first project) and picks it
  function create(k, name, back){
    const S = SEG[k], d = KEYS.indexOf(k), p = parent(d);
    const go = box.dispatchEvent(new CustomEvent('context-create', { bubbles:true, cancelable:true, detail:{ segment:k, name } }));
    hide(back); if (!go) return;
    const id = 'new-' + (++made), x = { id, name:name || `New ${S.noun}` };
    if (k === 'org') Object.assign(x, { t:'pl', b:['Free', 'neutral'], on:id + '-p', items:[{ id:id + '-p', name:'First project', on:'sandbox', items:STD() }] });
    else if (k === 'project') Object.assign(x, { on:'sandbox', items:STD() });
    else x.b = ['Development', KIND.Development];
    p.items.push(x); p.on = id; paint(); tell(k);
    live.textContent = `Created ${S.noun} ${x.name}`;
  }

  /* ---- the … menu, on a phone: the parts before the last, each opening its own switcher ---- */
  function menu(on, focus){
    if (on === mopen) return; mopen = on;
    if (on){
      if (open) hide(false, true);
      mpop.innerHTML = KEYS.slice(0, -1).map((k, d) => { const x = node(d); return `<button class="mi" role="menuitem" tabindex="-1" data-k="${k}">${d ? I('layers') : tile(x)}<span class="t"><b>${esc(x.name)}</b><span class="d">${SEG[k].label}</span></span>${badge(x)}</button>`; }).join('');
      $$('.mi', mpop).forEach(m => m.onclick = e => { menu(false); show(m.dataset.k, { focus:e.isTrusted }); });
      hideTip(); place(mpop, more); mpop.inert = false; mpop.classList.add('open'); more.setAttribute('aria-expanded', 'true'); centred();
      if (focus){ const it = $$('.mi', mpop); (focus === 'last' ? it[it.length - 1] : it[0]).focus({ preventScroll:true }); }
    } else {
      const back = mpop.contains(document.activeElement);
      mpop.classList.remove('open'); mpop.inert = true; more.setAttribute('aria-expanded', 'false');
      if (back) more.focus({ preventScroll:true });
      c.later(REDUCE ? 0 : 180, centred);
      c.later(320, () => { if (!mopen){ mpop.style.left = '0px'; mpop.style.top = '0px'; } });
    }
  }

  /* ---- the keyboard ---- */
  // on the bar, the left and right arrows move between the parts you can see
  const parts = () => [more, ...KEYS.map(trig)].filter(b => b.getClientRects().length);
  const sideways = e => { if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return false; const all = parts(), to = all[all.indexOf(e.currentTarget) + (e.key === 'ArrowLeft' ? -1 : 1)]; if (to){ e.preventDefault(); to.focus({ preventScroll:true }); } return true; };
  // a click, Enter or Space opens a part's switcher with the focus in its search; so do the down arrow (on the current one)
  // and the up arrow (on the last row). A story's tap opens it without moving the focus
  KEYS.forEach(k => {
    const tr = trig(k);
    tr.onclick = e => { if (open === k) hide(pop.contains(document.activeElement)); else show(k, { focus:e.isTrusted }); };
    tr.onkeydown = e => {
      if (sideways(e)) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); show(k, { focus:true }); if (e.key === 'ArrowUp'){ hi = opts.length - 1; move(0); } }
    };
  });
  more.onclick = e => menu(!mopen, e.isTrusted && 'first');
  more.onkeydown = e => { if (sideways(e)) return; if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); menu(true, e.key === 'ArrowUp' ? 'last' : 'first'); } };
  // in the search: the arrows move through the list and wrap, Home and End go to its ends, typing filters it, Enter picks,
  // Escape closes it and gives the focus back to the part. With nothing typed, the left and right arrows move to the part
  // before or after and open its switcher
  q.oninput = () => fill(false);
  q.onkeydown = e => {
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowUp'){ e.preventDefault(); move(k === 'ArrowDown' ? 1 : -1); }
    else if (k === 'Home' || k === 'End'){ e.preventDefault(); hi = k === 'Home' ? 0 : opts.length - 1; move(0); }
    else if (k === 'Enter'){ e.preventDefault(); pick(opts[hi]); }
    else if (k === 'Escape'){ e.preventDefault(); e.stopPropagation(); hide(true); }
    else if ((k === 'ArrowLeft' || k === 'ArrowRight') && !q.value){ const n = KEYS[KEYS.indexOf(open) + (k === 'ArrowLeft' ? -1 : 1)]; if (n){ e.preventDefault(); show(n, { focus:true }); } }
  };
  // in the … menu: the arrows move and wrap, Home and End jump to the ends, Escape closes it and Tab leaves it
  c.on(mpop, 'keydown', e => {
    const all = $$('.mi', mpop), i = all.indexOf(document.activeElement);
    const go = { ArrowDown:all[(i + 1) % all.length], ArrowUp:all[(i - 1 + all.length) % all.length], Home:all[0], End:all[all.length - 1] }[e.key];
    if (go){ e.preventDefault(); go.focus({ preventScroll:true }); }
    else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); menu(false); }
    else if (e.key === 'Tab') setTimeout(() => menu(false));
  });
  // Tab out of the switcher closes it; so does a press anywhere else, or a real resize
  c.on(pop, 'focusout', e => { if (open && e.relatedTarget && !pop.contains(e.relatedTarget) && e.relatedTarget !== trig(open)) hide(false); });
  c.on(document, 'pointerdown', e => { const t = e.target; if (pop.contains(t) || mpop.contains(t) || (box.contains(t) && t.closest('.csw-tr,.csw-more'))) return; hide(false); menu(false); });
  c.on(window, 'resize', e => { if (e.isTrusted){ hide(false); menu(false); } });
  const ro = new ResizeObserver(tips); ro.observe(bar); c.offs.push(() => ro.disconnect());

  // the bar sits centred on its own, and glides up as a switcher opens under it, so the two sit centred together
  const centred = centre(c, box, () => open ? Math.max(box.offsetHeight, pop.offsetTop + full) : mopen ? Math.max(box.offsetHeight, mpop.offsetTop + mpop.offsetHeight) : box.offsetHeight);
  pop.inert = true; mpop.inert = true; paint(true);
  if (document.fonts) document.fonts.ready.then(() => { if (!c.dead) tips(); });
  // the preview's story: open the project's switcher (through the … menu on a phone), search for "inv" and pick Invoice
  // reader; the environment follows it, from eu-live in Production to staging
  c.story(async s => {
    await s.beat(3);
    if (narrow()){ await s.tap(more); await s.beat(2); await s.tap($('.mi[data-k="project"]', mpop)); }
    else await s.tap(trig('project'));
    s.away(); await s.beat(2);
    await s.type(q, 'inv', { n:.4, each:() => { if (open) fill(false); } }); await s.beat(2);
    await s.tap(opts[hi]); s.away(); await s.beat(5);
  });
});
