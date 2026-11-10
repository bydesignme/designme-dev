// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, DM, I, REDUCE, enter, html, menuOpen, openPop, popFocus, reflow, seg, stagger, swap } from '../core/core.js';
DM.def('kanban', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{(search|x|grid|list)\}/g, (m, k) => I(k, 'xs'));
  // the columns, each with a short name for the tabs a narrow board shows; In progress has a WIP limit of three
  const COLS = [{ k:'todo', t:'To do', s:'To do' }, { k:'doing', t:'In progress', s:'Doing', lim:3 }, { k:'done', t:'Done', s:'Done' }];
  const M = { MK:{ n:'Maya Kim', bg:'var(--dm-av-l)' }, JO:{ n:'Jonas Ortiz', bg:'var(--dm-av-m)' }, LP:{ n:'Lena Park', bg:'var(--dm-av-p)' }, DA:{ n:'Design agent', bg:'var(--dm-av-b)', agent:true } };
  const ME = 'MK', MK = Object.keys(M);
  const PRI = { urgent:'Urgent', high:'High', med:'Medium', low:'Low', none:'No priority' }, PK = Object.keys(PRI);
  const LABELS = ['Design', 'Copy', 'Code', 'Bug', 'A11y'];
  // due dates are days from today, so the overdue one is always overdue
  const day = n => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return d; };
  const fmt = n => n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : day(n).toLocaleDateString('en-US', { month:'short', day:'numeric' });
  const sub = (...a) => a.map(([t, d]) => ({ t, d:!!d }));
  let K = [
    { id:'DES-148', c:'todo', t:'Audit checkout for contrast', p:'high', l:['A11y'], who:['DA'], due:3, sub:sub(['List every text pair'], ['Check against 4.5:1'], ['Fix the failing pairs'], ['Write up the changes']) },
    { id:'DES-151', c:'todo', t:'Write release notes for pricing', p:'med', l:['Copy'], who:['MK'], due:2, cm:2 },
    { id:'DES-157', c:'todo', t:'Pricing toggle hides the yearly saving', p:'urgent', l:['Bug'], who:['JO'], due:1, cm:4, at:1 },
    { id:'DES-155', c:'todo', t:'Empty state for search', p:'low', l:['Design'], who:['LP'], at:2 },
    { id:'DES-142', c:'doing', t:'Export tokens to CSS', p:'high', l:['Code'], who:['DA'], at:1, run:.4, sub:sub(['Read the Figma variables', 1], ['Map colours to roles', 1], ['Write the CSS variables'], ['Check contrast pairs'], ['Open a pull request']) },
    { id:'DES-144', c:'doing', t:'Review annual plan copy', p:'med', l:['Copy'], who:['JO', 'MK'], due:-1, cm:5, sub:sub(['Headline', 1], ['Plan names', 1], ['Feature list'], ['Footnotes']) },
    { id:'DES-146', c:'doing', t:'Plan cards wrap at 768px', p:'high', l:['Design', 'Bug'], who:['LP'], due:0, cm:1, sub:sub(['Reproduce on a tablet', 1], ['Fix the grid'], ['Test at 744px']) },
    { id:'DES-139', c:'done', t:'One CTA per pricing card', p:'med', l:['Design'], who:['MK'], cm:3, sub:sub(['Pick the CTA', 1], ['Update the cards', 1]) },
    { id:'DES-137', c:'done', t:'Compare checkout flows', p:'low', l:['Design'], who:['LP'], at:3, sub:sub(['Collect five flows', 1], ['Note the steps', 1], ['Share the findings', 1]) }
  ];
  let next = 158;
  const box = $('.kbx', r), bd = $('.kbx-bd', r), wrap = $('.kbx-cols', r), live = $('.kbx-sr', r);
  // the person who drags, types, picks or reads is never overtaken by the agent: its timer waits while any of that is going on
  let dragging = false, editing = false;
  // what is filtered, folded, picked and open, and which column a narrow board shows
  const F = { q:'', who:new Set(), l:new Set(), p:new Set() }, shut = new Set(), sel = new Set();
  let view = 'board', cur = 'doing', peek = null, foc = null, menuFor = null, menuFrom = 'card', colFor = null, fmFor = null, anchor = null;
  const byId = id => K.find(k => k.id === id);
  const say = t => { live.textContent = ''; c.later(30, () => { live.textContent = t; }); };
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  /* ---------- the parts ---------- */
  const pb = p => p === 'urgent' ? '<span class="kbx-pu" aria-hidden="true">!</span>' : `<span class="kbx-pb" data-p="${p}" aria-hidden="true"><i></i><i></i><i></i></span>`;
  const avs = who => who.map(w => AV(w, M[w].bg)).join('');
  const done = k => (k.sub || []).filter(s => s.d).length;
  const step = k => (k.sub || []).find(s => !s.d)?.t || 'Wrapping up';
  const metaOf = k => {
    const n = k.sub?.length, d = done(k);
    return `${k.l.length ? `<span class="kbx-tags">${k.l.map(x => `<span class="tag">${x}</span>`).join('')}</span>` : ''}`
      + (k.due != null && k.c !== 'done' ? `<span class="kbx-mt${k.due < 0 ? ' late' : ''}" data-tip="${k.due < 0 ? 'Overdue' : 'Due'}">${I('cal', 'xs')}${fmt(k.due)}</span>` : '')
      + (n ? `<span class="kbx-mt${d === n ? ' ok' : ''}" data-tip="${d} of ${n} subtasks done"><span class="num">${d}/${n}</span><span class="kbx-sb"><i style="width:${d / n * 100}%"></i></span></span>` : '')
      + (k.cm ? `<span class="kbx-mt" data-tip="${k.cm} comment${k.cm > 1 ? 's' : ''}">${I('comment', 'xs')}<span class="num">${k.cm}</span></span>` : '')
      + (k.at ? `<span class="kbx-mt" data-tip="${k.at} file${k.at > 1 ? 's' : ''}">${I('clip', 'xs')}<span class="num">${k.at}</span></span>` : '');
  };
  const label = k => `${k.id}, ${k.t}. ${PRI[k.p]} priority${k.who.length ? ', ' + k.who.map(w => M[w].n).join(' and ') : ''}${k.due != null && k.c !== 'done' ? ', due ' + fmt(k.due) + (k.due < 0 ? ', overdue' : '') : ''}${k.run != null ? ', the agent is working on it' : ''}${sel.has(k.id) ? ', selected' : ''}`;
  const card = k => `<div class="kbx-k${k.run != null ? ' agent' : ''}${sel.has(k.id) ? ' sel' : ''}${peek === k.id ? ' open' : ''}" data-id="${k.id}" role="listitem" tabindex="-1" aria-label="${esc(label(k))}">`
    + `<div class="kbx-k1"><button class="kbx-sel" role="checkbox" aria-checked="${sel.has(k.id)}" aria-label="Select ${k.id}" tabindex="-1">${I('check', 'xs')}</button>`
    + `<button class="kbx-pri" data-pop=".kbx-pm" aria-haspopup="menu" aria-label="Priority: ${PRI[k.p]}" data-tip="${PRI[k.p]}" tabindex="-1">${pb(k.p)}</button>`
    + `<span class="kbx-id num">${k.id}</span><span class="kbx-sp"></span>`
    + `<button class="kbx-who" data-pop=".kbx-am" data-pop-align="end" aria-haspopup="menu" aria-label="Assignees: ${k.who.map(w => M[w].n).join(', ') || 'none'}" data-tip="${k.who.map(w => M[w].n).join(', ') || 'Assign'}" tabindex="-1">${k.who.length ? avs(k.who) : `<span class="none">${I('user', 'xs')}</span>`}</button>`
    + `<button class="kbx-mv" data-pop=".kbx-mp" data-pop-align="end" aria-haspopup="menu" aria-label="Move ${k.id}" data-tip="Move to" tabindex="-1">${I('more', 'xs')}</button></div>`
    + `<span class="t">${esc(k.t)}</span>`
    + (k.run != null ? `<div class="kbx-ag"><span class="think on"><i></i><i></i><i></i><i></i></span><span class="s">${step(k)}</span><span class="pc num">${Math.round(k.run * 100)}%</span></div><div class="kbx-pr"><i style="width:${k.run * 100}%"></i></div>` : '')
    + `<div class="kbx-m">${metaOf(k)}</div></div>`;

  /* ---------- the board's frame ---------- */
  wrap.innerHTML = COLS.map(cl => `<div class="kbx-c" data-col="${cl.k}"><div class="kbx-ch"><button class="ib kbx-tg" aria-expanded="true" aria-label="Fold ${cl.t}" data-tip="Fold">${I('chev-d', 'xs')}</button><b>${cl.t}</b><span class="n num"></span><span class="kbx-sp"></span><button class="ib kbx-cadd" aria-label="Add a card to ${cl.t}" data-tip="Add card">${I('plus', 'xs')}</button><button class="ib kbx-cmn" data-pop=".kbx-cm" data-pop-align="end" aria-haspopup="menu" aria-label="${cl.t} actions" data-tip="Column actions">${I('more', 'xs')}</button></div><div class="kbx-list" role="list" aria-label="${cl.t}"></div></div>`).join('');
  bd.insertAdjacentHTML('beforebegin', `<div class="kbx-bar"><div class="seg2 kbx-tabs" role="group" aria-label="Column">${COLS.map(cl => `<button aria-pressed="false" data-v="${cl.k}">${cl.s}<span class="n num"></span></button>`).join('')}</div><button class="ib kbx-add" aria-label="Add card" data-tip="Add card">${I('plus', 'xs')}</button></div>`);
  $('.kbx-fp', r).innerHTML = MK.map(w => `<button aria-pressed="false" data-who="${w}" aria-label="${M[w].n}" data-tip="${M[w].n}">${AV(w, M[w].bg)}</button>`).join('');
  $('.kbx-fl', r).insertAdjacentHTML('afterbegin', [['who', 'Assignee'], ['l', 'Label'], ['p', 'Priority']].map(([f, n]) => `<button class="chip sm kbx-f" data-f="${f}" data-pop=".kbx-fm" aria-haspopup="menu"><span class="k">${n}</span><span class="v"></span>${I('chev-d', 'xs')}</button>`).join(''));
  bd.insertAdjacentHTML('beforeend', `<div class="kbx-em" hidden><span class="ic">${I('filter')}</span><b>No cards match</b><span>Try another filter or search.</span><button class="pill line sm kbx-ec">Clear filters</button></div>`
    + `<div class="kbx-bk" inert><span class="n num"></span><span class="l">Move to</span>${COLS.map(cl => `<button class="pill ghost sm" data-to="${cl.k}"><span class="lg">${cl.t}</span><span class="sh">${cl.s}</span></button>`).join('')}<span class="sep"></span><button class="ib kbx-bx" aria-label="Clear the selection" data-tip="Clear" data-tip-k="Esc">${I('x', 'xs')}</button></div>`
    + `<aside class="kbx-pk" role="dialog" aria-label="Card details" inert></aside>`);
  const pop = (cls, label, body) => `<div class="pop kbx-pop ${cls}" role="menu" aria-label="${label}"><div class="ph">${label}</div>${body}</div>`;
  box.insertAdjacentHTML('beforeend',
    pop('kbx-mp', 'Move to', COLS.map(cl => `<button class="mi" role="menuitemradio" aria-checked="false" data-close data-to="${cl.k}"><span>${cl.t}</span><span class="ck">${I('check', 'xs')}</span></button>`).join(''))
    + pop('kbx-pm', 'Priority', PK.map(p => `<button class="mi" role="menuitemradio" aria-checked="false" data-close data-p="${p}">${pb(p)}<span>${PRI[p]}</span><span class="ck">${I('check', 'xs')}</span></button>`).join(''))
    + pop('kbx-am', 'Assignees', MK.map(w => `<button class="mi" role="menuitemcheckbox" aria-checked="false" data-who="${w}">${AV(w, M[w].bg)}<span>${M[w].n}${w === ME ? ' (you)' : ''}</span><span class="ck">${I('check', 'xs')}</span></button>`).join(''))
    + pop('kbx-cm', 'Column', `<button class="mi" role="menuitem" data-close data-a="add">${I('plus', 'xs')}<span>Add card</span></button><button class="mi" role="menuitem" data-close data-a="all">${I('check', 'xs')}<span>Select all</span></button><button class="mi" role="menuitem" data-close data-a="pri">${I('sort', 'xs')}<span>Sort by priority</span></button><button class="mi" role="menuitem" data-close data-a="due">${I('cal', 'xs')}<span>Sort by due date</span></button><div class="sep"></div><button class="mi" role="menuitem" data-close data-a="fold">${I('chev-l', 'xs')}<span>Fold column</span></button>`)
    + `<div class="pop kbx-pop kbx-fm" role="menu" aria-label="Filter"></div>`);
  const tabs = $('.kbx-tabs', r), bk = $('.kbx-bk', r), sheet = $('.kbx-pk', r), em = $('.kbx-em', r);
  const mp = $('.kbx-mp', r), pm = $('.kbx-pm', r), am = $('.kbx-am', r), cm = $('.kbx-cm', r), fm = $('.kbx-fm', r), q = $('.kbx-q input', r), qx = $('.kbx-qx', r);
  const menuOpen = () => $$('.kbx-pop', r).some(p => p.classList.contains('open'));
  const narrow = () => !!$('.kbx-bar', r).getClientRects().length;

  /* ---------- filters ---------- */
  const filtering = () => !!(F.q || F.who.size || F.l.size || F.p.size);
  const shows = k => k.keep || ((!F.q || (k.t + ' ' + k.id).toLowerCase().includes(F.q.toLowerCase()))
    && (!F.who.size || k.who.some(w => F.who.has(w))) && (!F.l.size || k.l.some(x => F.l.has(x))) && (!F.p.size || F.p.has(k.p)));
  const visible = col => K.filter(k => k.c === col && shows(k));

  /* ---------- painting ---------- */
  // the cards are drawn again after each change; the ones that stay glide from where they were to where they are now
  let painted = false;
  function paint(o = {}){
    // a filter or a search: the cards that still match glide to their new places, ones that come back fade in and ones
    // filtered out fade where they were
    if (o.filter && painted){ reflow(() => $$('.kbx-k', wrap), () => paint({ flip:false }), { by:'data-id', root:box }); return; }
    const had = document.activeElement && box.contains(document.activeElement) && document.activeElement.closest('.kbx-k');
    const keep = had ? had.dataset.id : null;
    const first = !REDUCE && painted && o.flip !== false ? new Map($$('.kbx-k', wrap).map(el => [el.dataset.id, el.getBoundingClientRect()])) : null;
    let shown = 0;
    COLS.forEach(cl => {
      const col = $(`.kbx-c[data-col="${cl.k}"]`, wrap), L = visible(cl.k), all = K.filter(k => k.c === cl.k).length; shown += L.length;
      $('.kbx-list', col).innerHTML = L.map(card).join('') || (filtering() ? '' : '<div class="kbx-none">No cards</div>');
      // the count, or with a limit how full the column is, which turns into a warning once it is over
      const n = $('.kbx-ch .n', col), over = cl.lim && all > cl.lim;
      n.innerHTML = over ? `<span class="tag warn" data-tip="Over the limit of ${cl.lim}">${I('alert', 'xs')}${all}/${cl.lim}</span>` : (filtering() && L.length !== all ? `${L.length} of ${all}` : cl.lim ? `${all}/${cl.lim}` : all);
      col.classList.toggle('shut', shut.has(cl.k)); col.classList.toggle('wip', !!over);
      const tg = $('.kbx-tg', col); tg.setAttribute('aria-expanded', !shut.has(cl.k)); tg.setAttribute('aria-label', (shut.has(cl.k) ? 'Open ' : 'Fold ') + cl.t); tg.dataset.tip = shut.has(cl.k) ? 'Open' : 'Fold';
      const tn = $(`[data-v="${cl.k}"] .n`, tabs); if (tn.textContent !== String(L.length)){ tn.textContent = L.length; if (painted) enter(tn); }
    });
    wrap.style.setProperty('--dm-kbx-gt', COLS.map(cl => shut.has(cl.k) ? '40px' : 'minmax(0,1fr)').join(' '));
    // nothing matches: one note in the middle of the board
    em.hidden = !(filtering() && !shown);
    const total = K.length, cnt = $('.kbx-cnt', r); cnt.textContent = filtering() ? `${shown} of ${total} cards` : `${total} cards`;
    $('.kbx-ti span', r).textContent = `Sprint 14 · ${K.filter(k => k.c === 'done').length} of ${total} done`;
    chips(); bulk(); roving(keep);
    if (first) $$('.kbx-k', wrap).forEach(el => { const a = first.get(el.dataset.id); if (!a){ if (painted && o.enter !== false) enter(el); return; } const b = el.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top; if (Math.abs(dx) > 1 || Math.abs(dy) > 1) el.animate([{ transform:`translate(${dx}px,${dy}px)` }, { transform:'none' }], { duration:420, easing:'cubic-bezier(.22,1,.36,1)' }); });
    if (peek) sheetPaint();
    painted = true;
  }
  // the filter chips say what they filter by; the facepile shows who is picked
  function chips(){
    const v = { who:[...F.who].map(w => M[w].n.split(' ')[0]), l:[...F.l], p:[...F.p].map(p => PRI[p]) };
    $$('.kbx-f', r).forEach(b => { const a = v[b.dataset.f]; b.classList.toggle('on', a.length > 0); $('.v', b).textContent = a.length ? (a.length > 1 ? a.length + ' picked' : a[0]) : ''; $('.k', b).textContent = { who:'Assignee', l:'Label', p:'Priority' }[b.dataset.f] + (a.length ? ':' : ''); });
    $$('.kbx-fp button', r).forEach(b => b.setAttribute('aria-pressed', F.who.has(b.dataset.who)));
    $('.kbx-fp', r).classList.toggle('some', F.who.size > 0);
    $('.kbx-clr', r).hidden = !filtering();
  }
  // the bar for picked cards, with the count
  function bulk(){
    [...sel].forEach(id => { if (!byId(id)) sel.delete(id); });
    const n = sel.size; box.classList.toggle('selecting', n > 0); bk.classList.toggle('on', n > 0); bk.inert = n === 0;
    if (n) $('.n', bk).textContent = n + ' selected';
  }
  // one card at a time is in the Tab order: the one last focused, or the first on show
  function roving(keep){
    const cards = $$('.kbx-k', wrap).filter(el => el.getClientRects().length);
    const to = cards.find(el => el.dataset.id === keep) || cards.find(el => el.dataset.id === foc) || cards[0];
    $$('.kbx-k', wrap).forEach(el => el.tabIndex = el === to ? 0 : -1);
    if (to) foc = to.dataset.id;
    if (keep && to && to.dataset.id === keep) to.focus({ preventScroll:true });
  }
  const cardEl = id => $(`.kbx-k[data-id="${id}"]`, wrap);
  const focusCard = (id, scroll = false) => { const el = cardEl(id); if (!el) return; foc = id; $$('.kbx-k', wrap).forEach(x => x.tabIndex = x === el ? 0 : -1); el.focus({ preventScroll:!scroll }); if (peek && peek !== id){ peek = id; sheetPaint(); markOpen(); } };
  const markOpen = () => $$('.kbx-k', wrap).forEach(el => el.classList.toggle('open', el.dataset.id === peek));

  /* ---------- moving cards ---------- */
  // to a column (at an index among its cards, or its end); a card in Done is no longer worked on
  function place(k, col, idx){
    K = K.filter(x => x !== k); const was = k.c; k.c = col; if (col === 'done') delete k.run;
    const same = K.filter(x => x.c === col), before = idx == null ? null : same[idx];
    before ? K.splice(K.indexOf(before), 0, k) : K.push(k);
    return was;
  }
  const colName = k => COLS.find(cl => cl.k === k).t;
  // a move that takes a column over its limit says so
  const limitNote = col => { const cl = COLS.find(x => x.k === col); return cl.lim && K.filter(k => k.c === col).length > cl.lim ? `, which is over its limit of ${cl.lim}` : ''; };
  function moveMany(ids, col){
    const ks = ids.map(byId).filter(Boolean).filter(k => k.c !== col); if (!ks.length) return;
    ks.forEach(k => place(k, col)); paint();
    say((ks.length === 1 ? `${ks[0].id} moved to ${colName(col)}` : `${ks.length} cards moved to ${colName(col)}`) + limitNote(col));
  }

  /* ---------- the narrow board's tabs ---------- */
  const segc = seg(tabs, v => show(v));
  function show(col){
    const was = cur; cur = col; $$('button', tabs).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === col)); segc.place();
    $$('.kbx-c', wrap).forEach(x => x.classList.toggle('on', x.dataset.col === col));
    if (was !== col && narrow() && view === 'board') enter($('.kbx-c.on', wrap));
    roving();
  }
  // what the person in the demo would do to follow the agent's card; once you take over, the board stays where you put it
  const follow = col => c.auto(0, () => show(col));

  /* ---------- the details sheet ---------- */
  function sheetPaint(){
    const k = byId(peek); if (!k){ closeSheet(); return; }
    const n = k.sub?.length || 0, d = done(k);
    sheet.setAttribute('aria-label', `${k.id} details`);
    sheet.innerHTML = `<div class="kbx-pk-h"><span class="kbx-id num">${k.id}</span><span class="kbx-sp"></span><button class="ib kbx-pk-x" aria-label="Close details" data-tip="Close" data-tip-k="Esc">${I('x', 'xs')}</button></div>`
      + `<div class="kbx-pk-t">${esc(k.t)}</div>`
      + (k.run != null ? `<div class="kbx-pk-ag"><div class="kbx-ag"><span class="think on"><i></i><i></i><i></i><i></i></span><span class="s">Design agent: ${step(k)}</span><span class="pc num">${Math.round(k.run * 100)}%</span></div><div class="kbx-pr"><i style="width:${k.run * 100}%"></i></div></div>` : '')
      + `<div class="kbx-pk-rows">`
      + `<div class="kbx-pk-r"><span class="k">Status</span><button class="kbx-pv" data-pop=".kbx-mp" aria-haspopup="menu" aria-label="Status: ${colName(k.c)}">${colName(k.c)}${I('chev-d', 'xs')}</button></div>`
      + `<div class="kbx-pk-r"><span class="k">Priority</span><button class="kbx-pv" data-pop=".kbx-pm" aria-haspopup="menu" aria-label="Priority: ${PRI[k.p]}">${priV(k)}</button></div>`
      + `<div class="kbx-pk-r"><span class="k">Assignees</span><button class="kbx-pv" data-pop=".kbx-am" aria-haspopup="menu" aria-label="Assignees: ${names(k) || 'none'}">${whoV(k)}</button></div>`
      + (k.due != null ? `<div class="kbx-pk-r"><span class="k">Due</span><span class="kbx-pv${k.due < 0 && k.c !== 'done' ? ' late' : ''}">${I('cal', 'xs')}${fmt(k.due)}${k.due < 0 && k.c !== 'done' ? ', overdue' : ''}</span></div>` : '')
      + (k.l.length ? `<div class="kbx-pk-r"><span class="k">Labels</span><span class="kbx-tags">${k.l.map(x => `<span class="tag">${x}</span>`).join('')}</span></div>` : '')
      + `</div>`
      + (n ? `<div class="kbx-pk-s"><b>Subtasks</b><span class="num">${d}/${n}</span><span class="kbx-sb"><i style="width:${d / n * 100}%"></i></span></div><div class="kbx-pk-cl" role="group" aria-label="Subtasks">${k.sub.map((s, i) => `<button class="kbx-ci" role="checkbox" aria-checked="${s.d}" data-i="${i}"${k.run != null ? ' disabled' : ''}><span class="kbx-cb">${I('check', 'xs')}</span><span>${esc(s.t)}</span></button>`).join('')}</div>` : '')
      + `<div class="kbx-pk-f"><span class="kbx-mt">${I('comment', 'xs')}${k.cm || 'No'} comment${k.cm === 1 ? '' : 's'}</span><span class="kbx-mt">${I('clip', 'xs')}${k.at || 'No'} file${k.at === 1 ? '' : 's'}</span></div>`;
  }
  const names = k => k.who.map(w => M[w].n).join(', ');
  const priV = k => `${pb(k.p)}${PRI[k.p]}${I('chev-d', 'xs')}`;
  const whoV = k => `${k.who.length ? `<span class="avs">${avs(k.who)}</span>${k.who.length > 1 ? k.who.length + ' people' : M[k.who[0]].n}` : 'Assign'}${I('chev-d', 'xs')}`;
  // a quick edit changes the card and the sheet where they are, so the menu it came from stays put
  function refresh(k){
    const el = cardEl(k.id);
    if (el){ const p = $('.kbx-pri', el), w = $('.kbx-who', el);
      p.innerHTML = pb(k.p); p.setAttribute('aria-label', `Priority: ${PRI[k.p]}`); p.dataset.tip = PRI[k.p];
      w.innerHTML = k.who.length ? avs(k.who) : `<span class="none">${I('user', 'xs')}</span>`; w.setAttribute('aria-label', `Assignees: ${names(k) || 'none'}`); w.dataset.tip = names(k) || 'Assign';
      el.setAttribute('aria-label', label(k)); }
    if (peek === k.id){ const pv = $('.kbx-pv[data-pop=".kbx-pm"]', sheet), av = $('.kbx-pv[data-pop=".kbx-am"]', sheet);
      if (pv){ pv.innerHTML = priV(k); pv.setAttribute('aria-label', `Priority: ${PRI[k.p]}`); }
      if (av){ av.innerHTML = whoV(k); av.setAttribute('aria-label', `Assignees: ${names(k) || 'none'}`); } }
  }
  function openSheet(id){
    peek = id; sheetPaint(); markOpen(); sheet.inert = false; sheet.classList.add('on');
    say(`${id} details open`);
  }
  function closeSheet(back){
    const id = peek; peek = null; sheet.classList.remove('on'); sheet.inert = true; markOpen();
    if (back && id) focusCard(id);
  }

  /* ---------- adding and renaming ---------- */
  function rename(el, k, fresh){
    const t = $('.t', el); editing = true; t.contentEditable = 'true'; t.focus({ preventScroll:true }); document.getSelection().selectAllChildren(t);
    const was = k.t;
    t.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter'){ e.preventDefault(); t.blur(); } if (e.key === 'Escape'){ t.textContent = was; t.blur(); } };
    t.onblur = () => { editing = false; t.contentEditable = 'false'; k.t = t.textContent.trim() || (fresh ? 'New card' : was); t.textContent = k.t; el.setAttribute('aria-label', label(k)); if (peek === k.id) sheetPaint(); c.later(0, () => focusCard(k.id)); };
  }
  function add(col){
    const k = { id:'DES-' + next++, c:col, t:'New card', p:'none', l:[], who:[ME], keep:true };
    shut.delete(col); K.push(k); if (narrow()) show(col); paint();
    const el = cardEl(k.id); if (el) rename(el, k, true);
  }

  /* ---------- the pointer: drag to move, click to open, shift-click to pick ---------- */
  let swallow = false, clickT = 0;
  c.on(wrap, 'pointerdown', e => {
    const el = e.target.closest('.kbx-k'); if (!el || e.button || editing || e.target.closest('button')) return;
    const k = byId(el.dataset.id), rc = el.getBoundingClientRect(), ox = e.clientX - rc.left, oy = e.clientY - rc.top;
    let ghost = null, ph = null, moved = false, gw = 0;
    const move = ev => {
      if (!moved && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) < 5) return;
      // the copy under the pointer is a card, in the list too, where it is as wide as a board's card
      if (!moved){ moved = true; dragging = true; ghost = el.cloneNode(true); ghost.classList.add('ghost'); ghost.classList.remove('sel', 'open'); ghost.removeAttribute('tabindex'); ghost.setAttribute('aria-hidden', 'true'); gw = view === 'list' ? Math.min(rc.width, 260) : rc.width; ghost.style.width = gw + 'px'; document.body.appendChild(ghost); el.classList.add('drag'); ph = html(`<div class="kbx-ph" style="height:${rc.height}px"></div>`); }
      ghost.style.left = ev.clientX - Math.min(ox, gw - 24) + 'px'; ghost.style.top = ev.clientY - (view === 'list' ? 16 : oy) + 'px';
      const col = document.elementsFromPoint(ev.clientX, ev.clientY).find(x => x.classList?.contains('kbx-c') && wrap.contains(x));
      $$('.kbx-c', wrap).forEach(x => x.classList.toggle('over', x === col));
      if (col){ const list = $('.kbx-list', col), sibs = $$('.kbx-k:not(.drag)', list); $('.kbx-none', list)?.remove(); const after = sibs.find(s => { const b = s.getBoundingClientRect(); return ev.clientY < b.top + b.height / 2; }); after ? list.insertBefore(ph, after) : list.appendChild(ph); }
    };
    const up = ev => { stop();
      dragging = false; if (!moved) return; swallow = true; c.later(0, () => { swallow = false; }); ghost.remove(); const col = ev.type === 'pointerup' && ph.isConnected ? ph.closest('.kbx-c') : null;
      // it lands before the card that follows the placeholder, or at the end of the column (after any a filter hides)
      if (col){ const list = $('.kbx-list', col), rest = [...list.children].filter(x => x === ph || (x.classList.contains('kbx-k') && !x.classList.contains('drag')));
        const nx = rest[rest.indexOf(ph) + 1], to = col.dataset.col, was = k.c;
        K = K.filter(x => x !== k); k.c = to; if (to === 'done') delete k.run;
        nx ? K.splice(K.indexOf(byId(nx.dataset.id)), 0, k) : K.push(k);
        if (was !== to) say(`${k.id} moved to ${colName(to)}` + limitNote(to)); }
      $$('.kbx-c', wrap).forEach(x => x.classList.remove('over')); ph.remove(); paint({ flip:false }); const n = cardEl(k.id); if (n && !REDUCE) n.animate([{ transform:'scale(1.04)' }, { transform:'none' }], { duration:350, easing:'cubic-bezier(.2,.8,.2,1)' }); };
    const stop = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up); };
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up);
    c.offs.push(() => { stop(); ghost?.remove(); });
  });
  c.on(wrap, 'click', e => {
    if (swallow) return;
    const shutCol = e.target.closest('.kbx-c.shut'); if (shutCol && !e.target.closest('.kbx-cmn') && !box.classList.contains('list') && !narrow()){ shut.delete(shutCol.dataset.col); paint(); return; }
    const b = e.target.closest('button'), el = e.target.closest('.kbx-k');
    if (b && b.closest('.kbx-ch')){ const col = b.closest('.kbx-c').dataset.col;
      if (b.classList.contains('kbx-tg')){ shut.has(col) ? shut.delete(col) : shut.add(col); paint(); say(`${colName(col)} ${shut.has(col) ? 'folded' : 'open'}`); }
      else if (b.classList.contains('kbx-cadd')) add(col);
      else if (b.classList.contains('kbx-cmn')) colFor = col;
      return; }
    if (!el) return; const k = byId(el.dataset.id);
    // the card's own buttons say which card their menu is for, and what is picked in it now
    if (b){ menuFor = k.id; menuFrom = 'card';
      if (b.classList.contains('kbx-sel')){ toggle(k.id); return; }
      checks(k); return; }
    if (e.shiftKey || e.metaKey || e.ctrlKey){ toggle(k.id, e.shiftKey); return; }
    if (el.querySelector('.t[contenteditable="true"]')) return;
    // a click on the title waits a moment, in case it is the first of a double-click that renames the card
    clearTimeout(clickT);
    if (e.target.closest('.t') && e.detail === 1){ clickT = setTimeout(() => open(k.id), 240); c.offs.push(() => clearTimeout(clickT)); return; }
    if (e.detail > 1) return;
    open(k.id);
  });
  const open = id => { foc = id; peek === id ? closeSheet() : openSheet(id); };
  c.on(wrap, 'dblclick', e => { const t = e.target.closest('.kbx-k .t'); if (!t || editing) return; clearTimeout(clickT); const el = t.closest('.kbx-k'); rename(el, byId(el.dataset.id)); });
  // shift-click picks the cards between the last one picked and this one, in the same column; Cmd or Ctrl-click one card
  function toggle(id, range){
    const k = byId(id), a = anchor && byId(anchor);
    if (range && a && a.c === k.c && a.id !== id && sel.has(a.id)){
      const L = visible(k.c), i = L.indexOf(a), j = L.indexOf(k);
      L.slice(Math.min(i, j), Math.max(i, j) + 1).forEach(x => sel.add(x.id));
    } else sel.has(id) ? sel.delete(id) : sel.add(id);
    anchor = id; repick(); say(`${sel.size} selected`);
  }
  // picking changes only the cards' look, not the board, so nothing moves
  function repick(){
    $$('.kbx-k', wrap).forEach(el => { const on = sel.has(el.dataset.id); el.classList.toggle('sel', on); $('.kbx-sel', el).setAttribute('aria-checked', on); el.setAttribute('aria-label', label(byId(el.dataset.id))); });
    bulk();
  }
  // what each menu shows as picked, for the card it is opened for
  function checks(k){
    $$('.mi', mp).forEach(m => m.setAttribute('aria-checked', m.dataset.to === k.c));
    $$('.mi', pm).forEach(m => m.setAttribute('aria-checked', m.dataset.p === k.p));
    $$('.mi', am).forEach(m => m.setAttribute('aria-checked', k.who.includes(m.dataset.who)));
  }
  // the sheet's fields open the same menus, for the card it shows
  c.on(sheet, 'click', e => {
    const b = e.target.closest('button'); if (!b) return; const k = byId(peek); if (!k) return;
    if (b.classList.contains('kbx-pk-x')){ closeSheet(true); return; }
    if (b.classList.contains('kbx-ci')){ const s = k.sub[+b.dataset.i]; s.d = !s.d; b.setAttribute('aria-checked', s.d); const d = done(k), n = k.sub.length;
      $('.kbx-pk-s .num', sheet).textContent = `${d}/${n}`; $('.kbx-pk-s .kbx-sb i', sheet).style.width = d / n * 100 + '%';
      const el = cardEl(k.id); if (el){ $('.kbx-m', el).innerHTML = metaOf(k); } say(`${s.t} ${s.d ? 'done' : 'not done'}, ${d} of ${n}`); return; }
    if (b.dataset.pop){ menuFor = k.id; menuFrom = 'sheet'; checks(k); }
  });
  c.on(sheet, 'keydown', e => { if (e.key === 'Escape' && !menuOpen()){ e.stopPropagation(); closeSheet(true); } });

  /* ---------- the menus ---------- */
  // picked with the keyboard, the focus goes back to the card once it is in its new place
  const fromKeys = m => m.closest('.pop').contains(document.activeElement);
  const refocus = (id, kb, pop) => { if (kb) c.later(140, () => { const f = menuFrom === 'sheet' && peek === id && $(`.kbx-pv[data-pop="${pop}"]`, sheet); f ? f.focus({ preventScroll:true }) : focusCard(id); }); };
  $$('.mi', mp).forEach(m => m.onclick = () => { const k = byId(menuFor), kb = fromKeys(m); if (!k) return; if (k.c === m.dataset.to) return refocus(k.id, kb, '.kbx-mp'); place(k, m.dataset.to); paint(); say(`${k.id} moved to ${colName(m.dataset.to)}`); if (narrow() && !peek) show(m.dataset.to); refocus(k.id, kb, '.kbx-mp'); });
  $$('.mi', pm).forEach(m => m.onclick = () => { const k = byId(menuFor), kb = fromKeys(m); if (!k) return; k.p = m.dataset.p; refresh(k); say(`${k.id} priority ${PRI[k.p]}`); refocus(k.id, kb, '.kbx-pm'); });
  $$('.mi', am).forEach(m => m.onclick = () => { const k = byId(menuFor); if (!k) return; const w = m.dataset.who; k.who = k.who.includes(w) ? k.who.filter(x => x !== w) : MK.filter(x => x === w || k.who.includes(x)); m.setAttribute('aria-checked', k.who.includes(w)); refresh(k); say(`${M[w].n} ${k.who.includes(w) ? 'assigned to' : 'removed from'} ${k.id}`); });
  $$('.mi', cm).forEach(m => m.onclick = () => { const col = colFor; if (!col) return; const a = m.dataset.a;
    if (a === 'add') return add(col);
    if (a === 'fold'){ shut.add(col); paint(); return; }
    if (a === 'all'){ visible(col).forEach(k => sel.add(k.id)); repick(); say(`${sel.size} selected`); return; }
    const rank = a === 'pri' ? k => PK.indexOf(k.p) : k => k.due == null ? 1e3 : k.due;
    const L = K.filter(k => k.c === col).sort((x, y) => rank(x) - rank(y)); K = K.filter(k => k.c !== col); L.forEach(k => K.push(k)); paint(); say(`${colName(col)} sorted by ${a === 'pri' ? 'priority' : 'due date'}`); });
  // a filter menu lists its field's values with how many cards each has; picks stay open so you can pick several
  function fill(f){
    fmFor = f; const opts = f === 'who' ? MK : f === 'l' ? LABELS : PK, set = F[f];
    const n = v => K.filter(k => f === 'who' ? k.who.includes(v) : f === 'l' ? k.l.includes(v) : k.p === v).length;
    fm.setAttribute('aria-label', { who:'Assignee', l:'Label', p:'Priority' }[f]);
    fm.innerHTML = `<div class="ph">${{ who:'Assignee', l:'Label', p:'Priority' }[f]}</div>` + opts.map(v => `<button class="mi" role="menuitemcheckbox" aria-checked="${set.has(v)}" data-v="${v}">${f === 'who' ? AV(v, M[v].bg) : f === 'p' ? pb(v) : ''}<span>${f === 'who' ? M[v].n : f === 'p' ? PRI[v] : v}</span><span class="r num">${n(v)}</span><span class="ck">${I('check', 'xs')}</span></button>`).join('');
    $$('.mi', fm).forEach(m => m.onclick = () => { const v = m.dataset.v; set.has(v) ? set.delete(v) : set.add(v); m.setAttribute('aria-checked', set.has(v)); refilter(); });
  }
  $$('.kbx-f', r).forEach(b => b.addEventListener('click', () => fill(b.dataset.f)));
  function refilter(){ K.forEach(k => delete k.keep); paint({ filter:true });const n = K.filter(shows).length; say(filtering() ? `${n} of ${K.length} cards shown` : `All ${K.length} cards shown`); }
  $$('.kbx-fp button', r).forEach(b => b.onclick = () => { const w = b.dataset.who; F.who.has(w) ? F.who.delete(w) : F.who.add(w); refilter(); });
  const clear = () => { F.q = ''; q.value = ''; qx.hidden = true; F.who.clear(); F.l.clear(); F.p.clear(); refilter(); };
  $('.kbx-clr', r).onclick = clear; $('.kbx-ec', r).onclick = () => { clear(); q.focus({ preventScroll:true }); };
  c.on(q, 'input', () => { F.q = q.value.trim(); qx.hidden = !q.value; refilter(); });
  c.on(q, 'keydown', e => { if (e.key === 'Escape' && q.value){ e.stopPropagation(); q.value = ''; F.q = ''; qx.hidden = true; refilter(); } });
  qx.onclick = () => { q.value = ''; F.q = ''; qx.hidden = true; refilter(); q.focus({ preventScroll:true }); };

  /* ---------- picked cards, moved together ---------- */
  $$('[data-to]', bk).forEach(b => b.onclick = () => { const ids = [...sel]; sel.clear(); anchor = null; moveMany(ids, b.dataset.to); });
  $('.kbx-bx', bk).onclick = () => { sel.clear(); anchor = null; repick(); say('Selection cleared'); roving(); $('.kbx-k[tabindex="0"]', wrap)?.focus({ preventScroll:true }); };

  /* ---------- Board or List ---------- */
  const vw = $('.kbx-vw', r);
  seg(vw, v => { if (v === view) return; const bar = $('.kbx-bar', r), h = wrap.getBoundingClientRect().height + (narrow() ? bar.offsetHeight + parseFloat(getComputedStyle(box).rowGap) : 0); view = v; box.classList.toggle('list', v === 'list');
    // the list keeps the board's height, so the component stays where it is in its stage
    wrap.style.minHeight = v === 'list' ? Math.round(h) + 'px' : ''; paint({ flip:false }); stagger($$('.kbx-k', wrap), 18); say(v === 'list' ? 'List view' : 'Board view'); });

  /* ---------- the keyboard ---------- */
  // arrows move between cards (up and down in a column, left and right across columns), Enter opens the details, Space
  // or x picks, m opens Move to, p the priority, a the assignees, Escape closes the details or clears what is picked
  c.on(wrap, 'keydown', e => {
    const el = e.target.closest('.kbx-k'); if (!el || editing || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = byId(el.dataset.id), onCard = e.target === el, key = e.key;
    const nav = id => { if (!id) return; e.preventDefault(); focusCard(id, true); };
    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'Home' || key === 'End'){
      const L = view === 'list' ? COLS.filter(cl => !shut.has(cl.k)).flatMap(cl => visible(cl.k)) : visible(k.c), i = L.indexOf(k);
      const to = key === 'Home' ? L[0] : key === 'End' ? L[L.length - 1] : L[i + (key === 'ArrowUp' ? -1 : 1)];
      if (to && e.shiftKey && (key === 'ArrowUp' || key === 'ArrowDown')){ sel.add(k.id); sel.add(to.id); anchor = to.id; repick(); say(`${sel.size} selected`); }
      e.preventDefault(); if (to) focusCard(to.id, true); return;
    }
    if ((key === 'ArrowLeft' || key === 'ArrowRight') && view === 'board'){
      e.preventDefault(); const d = key === 'ArrowLeft' ? -1 : 1, i = visible(k.c).indexOf(k);
      if (narrow()){ const ci = COLS.findIndex(cl => cl.k === k.c) + d, cl = COLS[ci]; if (!cl) return; show(cl.k); const L = visible(cl.k); if (L.length) focusCard(L[Math.min(i, L.length - 1)].id, true); return; }
      for (let ci = COLS.findIndex(cl => cl.k === k.c) + d; ci >= 0 && ci < COLS.length; ci += d){ const cl = COLS[ci]; if (shut.has(cl.k)) continue; const L = visible(cl.k); if (L.length) return nav(L[Math.min(i, L.length - 1)].id); }
      return;
    }
    if (!onCard) return;
    if (key === 'Enter'){ e.preventDefault(); open(k.id); if (peek) c.later(0, () => $('.kbx-pk-x', sheet)?.focus({ preventScroll:true })); return; }
    if (key === ' ' || key === 'x'){ e.preventDefault(); toggle(k.id); return; }
    if (key === 'F2'){ e.preventDefault(); rename(el, k); return; }
    const btn = { m:'.kbx-mv', p:'.kbx-pri', a:'.kbx-who' }[key.toLowerCase()];
    if (btn){ e.preventDefault(); const b = $(btn, el), pp = $(b.dataset.pop, r); menuFor = k.id; menuFrom = 'card'; checks(k); b.click(); if (openPop && openPop.pop === pp){ openPop.mine = true; popFocus(pp, 'first'); } return; }
    if (key === 'Escape'){ if (peek){ e.preventDefault(); closeSheet(); } else if (sel.size){ e.preventDefault(); sel.clear(); anchor = null; repick(); say('Selection cleared'); } }
  });
  // the board keeps the last card you were on as its one stop in the Tab order
  c.on(wrap, 'focusin', e => { const el = e.target.closest('.kbx-k'); if (el && e.target === el){ foc = el.dataset.id; $$('.kbx-k', wrap).forEach(x => x.tabIndex = x === el ? 0 : -1); } });
  c.on(box, 'keydown', e => { if (e.key === 'Escape' && sel.size && !menuOpen() && !e.target.closest('.kbx-k,.kbx-q')){ sel.clear(); anchor = null; repick(); say('Selection cleared'); } });
  $('.kbx-add', r).onclick = () => add(cur);

  paint(); show(cur);

  /* ---------- the demo: the design agent works through its cards ---------- */
  // every 600ms the agent's card fills a little and ticks off its subtasks; at the end it goes to Done and the agent picks up
  // its next card. It holds while the pointer rests on the board, and stops for good once you take over
  const busy = () => dragging || editing || menuOpen() || c.mine;
  c.every(600, () => { if (busy()) return; const k = K.find(x => x.run != null); if (!k) return;
    k.run = Math.min(1, k.run + .08); const n = k.sub.length, d = Math.min(n, Math.floor(k.run * n + 1e-9)); k.sub.forEach((s, i) => s.d = i < d);
    const el = cardEl(k.id);
    if (el && k.run < 1){ $('.kbx-pr i', el).style.width = k.run * 100 + '%'; $('.kbx-ag .pc', el).textContent = Math.round(k.run * 100) + '%'; const s = $('.kbx-ag .s', el); if (s.textContent !== step(k)) swap(s, step(k)); $('.kbx-m', el).innerHTML = metaOf(k); if (peek === k.id) sheetPaint(); }
    if (k.run >= 1){ place(k, 'done'); follow('done'); paint(); say(`The design agent finished ${k.id}`);
      const nx = K.find(x => x.c === 'todo' && x.who.includes('DA')); if (nx){ c.later(900, function pick(){ if (busy()){ if (!c.mine) c.later(300, pick); return; } place(nx, 'doing', 0); nx.run = 0; paint(); say(`The design agent started ${nx.id}`); c.later(700, () => follow('doing')); }); } } });
});
