/* Sales CRM template: the data and every interaction. It runs after the shared core (core.js), so it uses the core's
   helpers ($, $$, I, swap, tween, enter, stagger, seg, html) and its popovers (data-pop) and tooltips (data-tip). The
   companies, people and deals are made up. Every figure on the screen (the table's sums, the board's columns, the forecast)
   is worked out from the deals, so moving a deal, assigning an owner or adding a company changes all of them. */
(() => {
  const app = document.querySelector('.crm'); if (!app) return;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const sum = (a, f = x => x) => a.reduce((t, x) => t + f(x), 0);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  /* ---------- people, stages, pipelines and teams ---------- */
  const P = { MK:['Maya Kim', 'l'], AR:['Ari Reyes', 'p'], TR:['Theo Reed', 't'], JO:['Jon Ortiz', 'm'], LN:['Lena Novak', 'r'], IB:['Iris Bell', 'k'], DK:['Dev Kumar', 'b'], KM:['Kofi Mensah', 'y'] };
  const OWN = Object.keys(P);
  const av = (id, cls = '') => `<span class="av${cls ? ' ' + cls : ''}" style="background:var(--dm-av-${P[id][1]});color:var(--dm-av-${P[id][1]}-ink)" aria-hidden="true">${id}</span>`;
  const first = id => P[id][0].split(' ')[0];
  const STAGES = [{ k:'disc', t:'Discovery', p:10 }, { k:'demo', t:'Demo', p:25 }, { k:'prop', t:'Proposal', p:50 }, { k:'nego', t:'Negotiation', p:75 }, { k:'won', t:'Closed won', p:100 }];
  const ST = Object.fromEntries(STAGES.map((s, i) => [s.k, { ...s, i }]));
  // a stage is a Task table status pill: Negotiation reads in the accent (it is the one in play), Closed won in green
  const pill = k => `<span class="ttx-st" data-s="${k === 'won' ? 'done' : k === 'nego' ? 'run' : 'wait'}"><span class="sv"><span class="dot"></span><span>${ST[k].t}</span></span></span>`;
  const REG = { na:{ t:'North America', c:'var(--dm-c1)' }, emea:{ t:'EMEA enterprise', c:'var(--dm-c2)' }, apac:{ t:'APAC expansion', c:'var(--dm-c4)' } };
  const QUOTA = { MK:1300000, AR:850000, TR:1100000, JO:300000, LN:340000, IB:260000, DK:160000, KM:150000 };
  const TEAMS = [{ k:'strat', t:'Strategic AEs', who:['MK', 'AR', 'TR'] }, { k:'mid', t:'Mid-market', who:['JO', 'LN', 'IB'] }, { k:'sdr', t:'SDR team', who:['DK', 'KM'] }];
  TEAMS.forEach(t => t.quota = t.who.reduce((a, o) => a + QUOTA[o], 0));
  // closed won earlier this quarter, on top of the won deals in the list below: each becomes two won deals on the owner's accounts
  const WON_BEFORE = { MK:190000, AR:110000, TR:140000, JO:70000, LN:90000, IB:50000, DK:30000, KM:24000 };
  const ACT = { Call:'comment', Email:'mail', Demo:'monitor', QBR:'users', Exec:'users', Pricing:'dollar', Legal:'shield', Security:'shield', Discovery:'search' };

  /* ---------- dates: days from today, so the screen always reads as current ---------- */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dateOf = n => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };
  const fmtD = n => dateOf(n).toLocaleDateString('en-US', { month:'short', day:'numeric' });
  const money = v => '$' + Math.round(v).toLocaleString('en-US');
  const kmoney = v => v >= 1e6 ? '$' + parseFloat((v / 1e6).toFixed(2)) + 'M' : v >= 1e3 ? '$' + Math.round(v / 1e3) + 'k' : '$' + Math.round(v);

  /* ---------- the companies and their deals (made up) ---------- */
  // name, segment, tags, owner, pipeline, days since the last interaction, its kind, deals: [name, stage, value in $k, closes in days, probability +/-]
  const RAW = [
    ['Halcyon Labs', 'Enterprise', ['Expansion', 'Pilot'], 'MK', 'na', 1, 'Demo', [['Platform expansion', 'nego', 184, 18, 5], ['Analytics pilot', 'demo', 42, 40, 0]]],
    ['Brightwater Health', 'Strategic', ['Renewal', 'Upsell', 'Co-sell'], 'AR', 'na', 2, 'QBR', [['Renewal 2027', 'prop', 228, 30, 10], ['Care team seats', 'disc', 64, 75, 0], ['Co-sell with partner', 'won', 96, -12, 0]]],
    ['Pinecrest Logistics', 'Mid-market', ['New logo'], 'JO', 'emea', 4, 'Pricing', [['First contract', 'demo', 58, 45, 0]]],
    ['Corvid Analytics', 'Enterprise', ['Expansion', 'Upsell', 'Partner'], 'TR', 'na', 0, 'Call', [['Enterprise tier', 'nego', 312, 12, 8], ['Data add-on', 'prop', 88, 28, -5], ['Partner bundle', 'disc', 40, 90, 0]]],
    ['Lumen Grid', 'Mid-market', ['Upsell'], 'LN', 'emea', 9, 'Email', [['Seat upgrade', 'prop', 36, 26, -10]]],
    ['Saltmarsh Foods', 'SMB', ['New logo', 'Pilot'], 'DK', 'emea', 16, 'Discovery', [['Pilot', 'disc', 18, 60, 0], ['Starter plan', 'demo', 12, 50, 0]]],
    ['Ironbark Capital', 'Strategic', ['Expansion'], 'MK', 'na', 3, 'Exec', [['Global rollout', 'prop', 420, 48, 0], ['Risk module', 'won', 140, -30, 0]]],
    ['Tidewell Energy', 'Enterprise', ['Renewal', 'Co-sell'], 'AR', 'apac', 38, 'Legal', [['Renewal', 'nego', 265, -4, -40], ['Grid ops seats', 'demo', 75, 70, 0]]],
    ['Quillon Media', 'Mid-market', ['New logo', 'Partner', 'Pilot'], 'IB', 'na', 6, 'Demo', [['New logo', 'demo', 66, 35, 0], ['Partner pilot', 'disc', 24, 80, 0]]],
    ['Marrow & Finch', 'SMB', ['Upsell'], 'KM', 'emea', 21, 'Email', [['Upsell', 'disc', 22, 55, -5]]],
    ['Oakhaven Retail', 'Enterprise', ['Expansion', 'Renewal'], 'TR', 'na', 5, 'Pricing', [['Store rollout', 'nego', 198, 9, 10], ['Renewal', 'prop', 120, 40, 0]]],
    ['Fernway Travel', 'Mid-market', ['New logo'], 'JO', 'apac', 12, 'Call', [['First contract', 'disc', 48, 65, 0]]],
    ['Kestrel Robotics', 'Strategic', ['Pilot', 'Expansion', 'Co-sell'], 'MK', 'apac', 1, 'Security', [['Pilot to production', 'nego', 356, 6, 12], ['Fleet expansion', 'prop', 150, 52, 0], ['Security review', 'won', 60, -20, 0]]],
    ['Bluefin Insurance', 'Enterprise', ['Renewal'], 'LN', 'emea', 27, 'QBR', [['Renewal', 'prop', 142, -2, -30]]],
    ['Arbor & Vine', 'SMB', ['New logo', 'Upsell'], 'DK', 'na', 44, 'Email', [['Starter', 'disc', 9, 85, -5]]],
    ['Cobalt Ridge', 'Mid-market', ['Expansion'], 'IB', 'na', 8, 'Demo', [['Expansion', 'demo', 72, 38, 5]]],
    ['Juniper Point', 'Enterprise', ['Upsell', 'Partner'], 'AR', 'emea', 3, 'Exec', [['Upsell', 'prop', 96, 24, 5], ['Partner deal', 'won', 54, -8, 0]]],
    ['Larkspur Mobility', 'Mid-market', ['Pilot'], 'KM', 'apac', 62, 'Call', [['Pilot', 'disc', 30, -10, -8]]],
    ['Granite Peak Systems', 'Strategic', ['Expansion', 'Renewal', 'Co-sell'], 'TR', 'na', 2, 'Pricing', [['Platform renewal', 'nego', 388, 15, 0], ['Expansion', 'prop', 164, 44, 0], ['Co-sell', 'demo', 90, 70, 0]]],
    ['Moss & Ember', 'SMB', ['New logo'], 'JO', 'emea', 19, 'Discovery', [['First contract', 'disc', 26, 58, 0]]],
    ['Wrenfield Pharma', 'Enterprise', ['Pilot', 'Expansion'], 'LN', 'na', 7, 'Security', [['Research pilot', 'prop', 118, 33, 0], ['Expansion', 'disc', 210, 95, 0]]],
    ['Driftwood Games', 'Mid-market', ['Upsell', 'Co-sell'], 'IB', 'apac', 33, 'Email', [['Studio seats', 'demo', 44, -6, -10]]],
    ['Orchard Street Bank', 'Strategic', ['Renewal', 'Expansion'], 'MK', 'na', 11, 'Legal', [['Renewal', 'nego', 246, 21, 5], ['Wealth expansion', 'demo', 130, 60, 0]]],
    ['Velvet Hammer Studio', 'SMB', ['New logo', 'Partner'], 'DK', 'emea', 4, 'Demo', [['Studio plan', 'won', 16, -3, 0], ['Partner add-on', 'disc', 8, 48, 0]]],
  ];
  // twelve weeks of meetings, calls and emails: none since the last interaction, a steady few before it
  const trendOf = (i, last) => { let s = i * 7919 + 17; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    return Array.from({ length:12 }, (_, w) => (11 - w) * 7 + 3 < last ? 0 : Math.round(1 + r() * 5 + (last < 10 ? w / 3 : 0))); };
  let CO = [], DE = [], nid = 0, did = 201;
  const probOf = d => d.st === 'won' ? 100 : clamp(ST[d.st].p + d.adj, 5, 95);
  RAW.forEach((r, i) => {
    const c = { id:'c' + (nid++), n:r[0], seg:r[1], tags:[...r[2]], own:r[3], reg:r[4], last:r[5], lt:r[6], trend:trendOf(i, r[5]), log:[] };
    CO.push(c);
    r[7].forEach(x => DE.push({ id:'DL-' + (did++), co:c.id, n:x[0], st:x[1], v:x[2] * 1000, close:x[3], adj:x[4], own:c.own }));
  });
  // the quarter so far (days since it began), and what each owner won earlier in it, as won deals on their own accounts, so the
  // board's Closed won column, the companies' totals and the forecast all count the same deals
  const q0 = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1), qDay = Math.round((today - q0) / 864e5), WK = Math.floor(qDay / 7);
  const EARLY = ['Annual renewal', 'Seat add-on', 'Pilot extension', 'Support upgrade', 'Second team', 'Data connector'];
  OWN.forEach((o, k) => { const mine = CO.filter(c => c.own === o), part = [.58, .42];
    part.forEach((f, j) => { const c = mine[(k + j) % mine.length], back = 8 + ((k * 7 + j * 13) % Math.max(1, qDay - 9));
      DE.push({ id:'DL-' + (did++), co:c.id, n:EARLY[(k + j * 3) % EARLY.length], st:'won', v:Math.round(WON_BEFORE[o] * f / 1000) * 1000, close:-Math.min(back, qDay), adj:0, own:o }); }); });
  DE.forEach(d => d.p = probOf(d));
  const coOf = id => CO.find(c => c.id === id);
  const dealOf = id => DE.find(d => d.id === id);

  // what each company's row shows, worked out from its deals
  function derive(){
    CO.forEach(c => {
      const mine = DE.filter(d => d.co === c.id), open = mine.filter(d => d.st !== 'won');
      c.deals = open.length; c.value = sum(open, d => d.v); c.won = sum(mine.filter(d => d.st === 'won'), d => d.v);
      c.weighted = sum(open, d => d.v * d.p / 100);
      c.win = c.value ? Math.round(c.weighted / c.value * 100) : (c.won ? 100 : 0);
      c.st = open.length ? open.reduce((a, d) => ST[d.st].i > ST[a].i ? d.st : a, 'disc') : (c.won ? 'won' : 'disc');
      c.lead = open.slice().sort((a, b) => ST[b.st].i - ST[a.st].i || b.v - a.v)[0] || null;
    });
  }

  /* ---------- toasts: Toast ---------- */
  const toasts = $('.crm-toasts', app);
  const TONE = { ok:['ok', 'var(--dm-ok)', 'var(--dm-ok-bg)'], info:['info', 'var(--dm-pb)', 'var(--dm-pb-bg)'], warn:['warn', 'var(--dm-warn)', 'var(--dm-warn-bg)'], bad:['trash', 'var(--dm-bad)', 'var(--dm-bad-bg)'] };
  function toast(kind, b, s = '', act = null){
    const [ic, col, bg] = TONE[kind];
    const t = html(`<div class="tst-t tst-in" role="status"><span class="g" style="color:${col};background:${bg}">${I(ic)}</span><div class="tx"><b>${esc(b)}</b>${s ? `<span>${esc(s)}</span>` : ''}</div><div class="acts">${act ? `<button class="pill ghost sm">${esc(act.label)}</button>` : ''}<button class="ib" aria-label="Dismiss" data-tip="Dismiss">${I('x')}</button></div></div>`);
    const out = () => { if (!t.isConnected || t.classList.contains('tst-out')) return; t.classList.add('tst-out'); setTimeout(() => t.remove(), 320); };
    $('.ib', t).onclick = out;
    if (act) $('.pill', t).onclick = () => { act.run(); out(); };
    toasts.appendChild(t);
    while (toasts.children.length > 3) toasts.firstElementChild.remove();
    // it times out after six seconds, held while the pointer rests on it
    let left = 6000, t0 = performance.now(), tm = setTimeout(out, left);
    t.addEventListener('pointerenter', () => { clearTimeout(tm); left -= performance.now() - t0; });
    t.addEventListener('pointerleave', () => { t0 = performance.now(); tm = setTimeout(out, Math.max(1200, left)); });
  }

  /* ---------- the state of the filters, the selection and what is open ---------- */
  const F = { sort:'value', desc:true, own:new Set(), stage:new Set(), last:90, q:'', reg:null, calc:null };
  const K = { own:new Set(), q:'', close:'any', view:'board', shut:new Set(), tab:'disc' };
  const sel = new Set();
  let tab = 'companies', sheetFor = null, rowMenuFor = null, mvFor = null, stageFor = null;

  /* ---------- Companies: the table ---------- */
  const tbody = $('.crm-t tbody', app), tableBox = $('.crm-co', app), scroller = $('.crm-sc', app);
  const allBox = $('.ttx-all', app), sb = $('.crm-hd .ttx-sb', app);
  const tick = I('check', 'xs').replace('class="i xs"', 'class="i xs ck-y"') + I('minus', 'xs').replace('class="i xs"', 'class="i xs ck-m"');
  allBox.innerHTML = tick;
  $$('.crm-t .ttx-s', app).forEach(b => b.insertAdjacentHTML('beforeend', `<span class="ar">${I('chev-u', 'xs')}</span>`));
  const SORTS = { value:['Pipeline value', c => c.value], win:['Win probability', c => c.win], deals:['Open deals', c => c.deals], last:['Last interaction', c => -c.last], name:['Company name', c => c.n.toLowerCase()], stage:['Stage', c => ST[c.st].i], owner:['Account owner', c => P[c.own][0]], trend:['Activity', c => sum(c.trend.slice(-4))] };
  const LASTS = [[7, 'Last 7 days'], [30, 'Last 30 days'], [90, 'Last 90 days'], [0, 'Any time']];
  const matches = c => (!F.q || (c.n + ' ' + c.seg + ' ' + c.tags.join(' ') + ' ' + P[c.own][0]).toLowerCase().includes(F.q.toLowerCase()))
    && (!F.own.size || F.own.has(c.own)) && (!F.stage.size || F.stage.has(c.st)) && (!F.last || c.last <= F.last) && (!F.reg || c.reg === F.reg);
  const inView = () => {
    const f = SORTS[F.sort][1];
    return CO.filter(matches).sort((a, b) => { const x = f(a), y = f(b); return (x > y ? 1 : x < y ? -1 : 0) * (F.desc ? -1 : 1) || a.n.localeCompare(b.n); });
  };
  // each segment and tag keeps one colour wherever it shows (the core tag's colours: blue, violet, green, orange, red, yellow, pink, teal)
  const HUE = { Strategic:'l', Enterprise:'b', 'Mid-market':'t', SMB:'k', Expansion:'m', Renewal:'p', Upsell:'y', Pilot:'k', 'New logo':'b', 'Co-sell':'l', Partner:'t', Champion:'m', 'Budget set':'y', 'Security review':'r', 'Multi-year':'p' };
  const chip = t => `<span class="tag ${HUE[t] || 'bltmprky'[[...t].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 8]}">${esc(t)}</span>`;
  const tags = c => { const all = [c.seg, ...c.tags], shown = all.slice(0, 2), more = all.slice(2);
    return `<span class="crm-tags">${shown.map(chip).join('')}${more.length ? `<span class="tag more" data-tip="${esc(more.join(', '))}">+${more.length}</span>` : ''}</span>`; };
  // win probability as Progress's segments: ten to a bar, the last one part filled
  const winBar = w => `<span class="crm-win" data-w="${w < 30 ? 'lo' : 'ok'}"><span class="prg-seg" role="img" aria-label="${w}% win probability">${Array.from({ length:10 }, (_, i) => `<i><b style="--dm-f:${clamp((w - i * 10) / 10, 0, 1)}"></b></i>`).join('')}</span><span class="p num">${w}%</span></span>`;
  const spark = c => { const mx = Math.max(6, ...c.trend), n = sum(c.trend);
    return `<span class="crm-spark" data-tip="${n} touches in 12 weeks, ${c.trend[11]} this week" aria-label="${n} touches in 12 weeks" role="img">${c.trend.map(v => `<i${v ? '' : ' class="z"'} style="height:${v ? Math.max(14, v / mx * 100) : 9}%"></i>`).join('')}</span>`; };
  const lastCell = c => `<span class="crm-last${c.last > 30 ? ' old' : ''}">${I('cal', 'xs')}<span class="num">${c.last === 0 ? 'Today' : fmtD(-c.last)}</span><span class="muted">${esc(c.lt)}</span></span>`;
  const row = c => `<tr data-id="${c.id}" tabindex="-1" class="${sel.has(c.id) ? 'sel' : ''}${sheetFor === c.id ? ' open' : ''}" aria-label="${esc(c.n)}">`
    + `<td class="ck stk"><button class="ttx-cb" role="checkbox" aria-checked="${sel.has(c.id)}" aria-label="Select ${esc(c.n)}" tabindex="-1">${tick}</button></td>`
    + `<td class="stk2"><span class="nm"><span class="pfm-lg sm" aria-hidden="true">${esc(c.n[0])}</span><span title="${esc(c.n)}">${esc(c.n)}</span></span></td>`
    + `<td>${tags(c)}</td><td>${pill(c.st)}</td><td><span class="ag">${av(c.own)}${esc(P[c.own][0])}</span></td>`
    + `<td class="r num">${c.deals}</td><td class="r num val">${money(c.value)}</td><td>${winBar(c.win)}</td><td>${spark(c)}</td><td>${lastCell(c)}</td>`
    + `<td class="r"><button class="ib crm-rm" data-pop="#crm-p-row" data-pop-align="end" aria-haspopup="menu" aria-label="Actions for ${esc(c.n)}" tabindex="-1">${I('more', 'xs')}</button></td></tr>`;
  let view = [], focusId = null;
  function renderTable(){
    view = inView();
    tbody.innerHTML = view.length ? view.map(row).join('') : `<tr class="crm-empty"><td colspan="11"><div class="ttx-em"><span class="ic">${I('filter')}</span><b>No companies match</b><span>Try another owner, stage or search.</span><button class="pill ghost sm crm-clr2">Clear filters</button></div></td></tr>`;
    // one row at a time is in the Tab order; the arrow keys move between them
    const keep = view.find(c => c.id === focusId) || view[0]; if (keep) $(`tr[data-id="${keep.id}"]`, tbody).tabIndex = 0;
    $$('.crm-t .ttx-s', app).forEach(b => { const on = b.dataset.k === F.sort; b.classList.toggle('on', on); b.classList.toggle('desc', on && F.desc); b.closest('th').setAttribute('aria-sort', on ? (F.desc ? 'descending' : 'ascending') : 'none'); });
    // the footer: the rows in view, added up
    $('.crm-fn', app).innerHTML = `<b>${view.length}</b> ${view.length === 1 ? 'company' : 'companies'} in view`;
    $('.crm-fdeals', app).innerHTML = `<b>${sum(view, c => c.deals)}</b>`;
    const tot = sum(view, c => c.value);
    $('.crm-fsum', app).innerHTML = `<span class="muted">Sum</span> <b>${money(tot)}</b>`;
    $('.crm-favg', app).innerHTML = view.length ? `<span class="muted">Avg</span> <b>${Math.round(sum(view, c => c.win) / view.length)}%</b>` : '';
    const vs = view.map(c => c.value).sort((a, b) => a - b), CALC = calcs();
    $('.crm-fcalc', app).innerHTML = F.calc && view.length ? `<span class="k">${CALC[F.calc][0]}</span> <b class="num">${CALC[F.calc][1](vs, view)}</b>` : '';
    syncSel(); chips(); counts();
  }
  const calcs = () => ({
    median:['Median', vs => money(vs.length % 2 ? vs[(vs.length - 1) / 2] : (vs[vs.length / 2 - 1] + vs[vs.length / 2]) / 2)],
    max:['Largest', vs => money(vs[vs.length - 1])],
    weighted:['Weighted', (vs, v) => money(sum(v, c => c.weighted))],
    won:['Won', (vs, v) => money(sum(v, c => c.won))],
  });
  function syncSel(){
    [...sel].forEach(id => { if (!coOf(id)) sel.delete(id); });
    $$('tr[data-id]', tbody).forEach(tr => { const on = sel.has(tr.dataset.id); tr.classList.toggle('sel', on); $('.ttx-cb', tr).setAttribute('aria-checked', on); });
    const n = view.filter(c => sel.has(c.id)).length;
    allBox.setAttribute('aria-checked', !n ? 'false' : n === view.length ? 'true' : 'mixed');
    tableBox.classList.toggle('selecting', sel.size > 0); sb.inert = !sel.size;
    if (sel.size) $('.ttx-n', sb).textContent = sel.size + ' selected';
  }
  // the filter chips say what they filter by, and turn into white tiles once they filter
  function chips(){
    const set = (f, v, on) => { const b = $(`.crm-fbar .kbx-f[data-f="${f}"]`, app); $('.v', b).textContent = v; b.classList.toggle('on', on); };
    set('sort', SORTS[F.sort][0], false);
    set('owner', !F.own.size ? 'All' : F.own.size === 1 ? P[[...F.own][0]][0] : F.own.size + ' people', F.own.size > 0);
    set('stage', !F.stage.size ? 'Any' : F.stage.size === 1 ? ST[[...F.stage][0]].t : F.stage.size + ' stages', F.stage.size > 0);
    set('last', LASTS.find(l => l[0] === F.last)[1].replace('Last ', ''), F.last !== 90);
    // a pipeline picked in the sidebar is a Filter menu chip, with its x
    $('.crm-pipechip', app).innerHTML = F.reg ? `<span class="flm-ch seen"><span class="k">Pipeline is</span><span class="op" aria-hidden="true"></span><span class="v">${REG[F.reg].t}</span><button class="x" aria-label="Remove the pipeline filter" data-tip="Remove">${I('x', 'xs')}</button></span>` : '';
    const x = $('.crm-pipechip .x', app); if (x) x.onclick = () => { F.reg = null; renderTable(); };
    $('.crm-clr', app).hidden = !(F.own.size || F.stage.size || F.last !== 90 || F.q || F.reg);
    // the sidebar marks the team or pipeline whose filter is on
    $$('.crm-teams .ahx-cv', app).forEach(b => { const t = TEAMS.find(x => x.k === b.dataset.team); b.setAttribute('aria-pressed', String(F.own.size === t.who.length && t.who.every(w => F.own.has(w)))); });
    $$('.crm-pipes .ahx-cv', app).forEach(b => b.setAttribute('aria-pressed', String(F.reg === b.dataset.reg)));
  }
  const clearFilters = () => { F.own.clear(); F.stage.clear(); F.last = 90; F.q = ''; F.reg = null; const q = $('.crm-q input', app); q.value = ''; $('.crm-q .kbx-qx', app).hidden = true; renderTable(); };
  $('.crm-clr', app).onclick = clearFilters;
  // the table's search
  { const q = $('.crm-q input', app), x = $('.crm-q .kbx-qx', app);
    q.addEventListener('input', () => { F.q = q.value.trim(); x.hidden = !q.value; renderTable(); });
    x.onclick = () => { q.value = ''; F.q = ''; x.hidden = true; renderTable(); q.focus(); }; }
  // sorting from the column headers: a second press turns the order round
  $$('.crm-t .ttx-s', app).forEach(b => b.onclick = () => { const k = b.dataset.k; if (k === F.sort) F.desc = !F.desc; else { F.sort = k; F.desc = !['name', 'owner'].includes(k); } renderTable(); });
  allBox.onclick = () => { const on = allBox.getAttribute('aria-checked') !== 'true'; view.forEach(c => on ? sel.add(c.id) : sel.delete(c.id)); syncSel(); };
  $('.ttx-clr', sb).onclick = () => { sel.clear(); syncSel(); };
  const toggleSel = id => { sel.has(id) ? sel.delete(id) : sel.add(id); syncSel(); };
  tbody.addEventListener('click', e => {
    if (e.target.closest('.crm-clr2')) return clearFilters();
    const tr = e.target.closest('tr[data-id]'); if (!tr) return;
    focusRow(tr, false);
    if (e.target.closest('.ttx-cb')) return toggleSel(tr.dataset.id);
    if (e.target.closest('.crm-rm')){ rowMenuFor = tr.dataset.id; buildRowMenu(); return; }
    openSheet(tr.dataset.id);
  });
  function focusRow(tr, move = true){ $$('tr[data-id]', tbody).forEach(x => x.tabIndex = x === tr ? 0 : -1); focusId = tr.dataset.id; if (move) tr.focus(); }
  tbody.addEventListener('keydown', e => {
    const tr = e.target.closest('tr[data-id]'); if (!tr || e.target !== tr) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); const n = e.key === 'ArrowDown' ? tr.nextElementSibling : tr.previousElementSibling; if (n && n.dataset.id) focusRow(n); }
    else if (e.key === 'Enter'){ e.preventDefault(); openSheet(tr.dataset.id); }
    else if (e.key === ' '){ e.preventDefault(); toggleSel(tr.dataset.id); }
  });

  /* ---------- menus: built as they open, updated in place while they are open ---------- */
  const ck = `<span class="ck">${I('check', 'xs')}</span>`;
  const onOpen = (sel, fn) => $$(sel, app).forEach(b => b.addEventListener('click', fn));
  const mi = (attrs, body, role = 'menuitemradio', checked = false, close = true) => `<button class="mi" role="${role}" aria-checked="${checked}" tabindex="-1"${close ? ' data-close' : ''} ${attrs}>${body}${role !== 'menuitem' ? ck : ''}</button>`;
  const pop = id => $('#' + id, app);
  // Sort by: the field, then the order
  onOpen('[data-f="sort"]', () => {
    const p = pop('crm-p-sort');
    p.innerHTML = `<div class="ph" role="none">Sort by</div>` + Object.entries(SORTS).filter(([k]) => k !== 'trend').map(([k, s]) => mi(`data-k="${k}"`, `<span>${s[0]}</span>`, 'menuitemradio', F.sort === k)).join('')
      + `<div class="sep" role="separator"></div>` + mi('data-o="desc"', `${I('down', 's')}<span>${F.sort === 'name' || F.sort === 'owner' ? 'Z to A' : 'High to low'}</span>`, 'menuitemradio', F.desc) + mi('data-o="asc"', `${I('up', 's')}<span>${F.sort === 'name' || F.sort === 'owner' ? 'A to Z' : 'Low to high'}</span>`, 'menuitemradio', !F.desc);
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { if (m.dataset.k){ F.sort = m.dataset.k; F.desc = !['name', 'owner'].includes(m.dataset.k); } else F.desc = m.dataset.o === 'desc'; renderTable(); }));
  });
  // Owner and Stage: several at once, so their menus stay open as you tick
  const multi = (id, set, items, label) => {
    const p = pop(id);
    p.innerHTML = `<div class="ph" role="none">${label}</div>` + items.map(([k, body]) => mi(`data-k="${k}"`, body, 'menuitemcheckbox', set.has(k), false)).join('')
      + `<div class="sep" role="separator"></div>` + mi('data-clear', `${I('x', 's')}<span>Show all</span>`, 'menuitem', false, true);
    $$('.mi', p).forEach(m => m.addEventListener('click', () => {
      if (m.hasAttribute('data-clear')) set.clear(); else set.has(m.dataset.k) ? set.delete(m.dataset.k) : set.add(m.dataset.k);
      $$('.mi[data-k]', p).forEach(x => x.setAttribute('aria-checked', set.has(x.dataset.k))); renderTable();
    }));
  };
  onOpen('[data-f="owner"]', () => multi('crm-p-owner', F.own, OWN.map(o => [o, `${av(o)}<span>${P[o][0]}</span><span class="r num">${CO.filter(c => c.own === o).length}</span>`]), 'Account owner'));
  onOpen('[data-f="stage"]', () => multi('crm-p-stage', F.stage, STAGES.map(s => [s.k, `${pill(s.k)}<span class="r num">${CO.filter(c => c.st === s.k).length}</span>`]), 'Stage'));
  onOpen('[data-f="last"]', () => {
    const p = pop('crm-p-last');
    p.innerHTML = `<div class="ph" role="none">Last interaction</div>` + LASTS.map(([d, t]) => mi(`data-d="${d}"`, `<span>${t}</span><span class="r num">${CO.filter(c => !d || c.last <= d).length}</span>`, 'menuitemradio', F.last === d)).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { F.last = +m.dataset.d; renderTable(); }));
  });
  // the footer's Add calculation
  onOpen('.crm-addcalc', () => {
    const p = pop('crm-p-calc'), C = calcs();
    p.innerHTML = `<div class="ph" role="none">Add a calculation</div>` + Object.entries(C).map(([k, c]) => mi(`data-k="${k}"`, `<span>${c[0]} pipeline value</span>`.replace('Weighted pipeline value', 'Weighted forecast').replace('Won pipeline value', 'Closed won'), 'menuitemradio', F.calc === k)).join('')
      + (F.calc ? `<div class="sep" role="separator"></div>` + mi('data-k=""', `${I('x', 's')}<span>Remove calculation</span>`, 'menuitem') : '');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { F.calc = m.dataset.k || null; renderTable(); }));
  });
  // a row's own menu
  function buildRowMenu(){
    const c = coOf(rowMenuFor), p = pop('crm-p-row'); if (!c) return;
    p.innerHTML = `<div class="ph" role="none">${esc(c.n)}</div>` + mi('data-a="open"', `${I('panel', 's')}<span>Open details</span>`, 'menuitem') + mi('data-a="call"', `${I('comment', 's')}<span>Log a call</span>`, 'menuitem')
      + mi('data-a="select"', `${I('check', 's')}<span>${sel.has(c.id) ? 'Deselect' : 'Select'}</span>`, 'menuitem')
      + `<div class="sep" role="separator"></div>` + `<button class="mi bad" role="menuitem" tabindex="-1" data-close data-a="del">${I('trash', 's')}<span>Delete company</span></button>`;
    $$('.mi', p).forEach(m => m.addEventListener('click', () => {
      const a = m.dataset.a;
      if (a === 'open') setTimeout(() => openSheet(c.id), 130);
      if (a === 'call') logActivity(c, 'Call');
      if (a === 'select') toggleSel(c.id);
      if (a === 'del') remove([c.id]);
    }));
  }

  /* ---------- bulk actions on the picked rows ---------- */
  onOpen('[data-pop="#crm-p-assign"]', () => {
    const p = pop('crm-p-assign');
    p.innerHTML = `<div class="ph" role="none">Assign ${sel.size} to</div>` + OWN.map(o => mi(`data-o="${o}"`, `${av(o)}<span>${P[o][0]}</span>`, 'menuitem')).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => {
      const ids = [...sel], before = ids.map(id => [id, coOf(id).own]), o = m.dataset.o;
      ids.forEach(id => { coOf(id).own = o; DE.filter(d => d.co === id).forEach(d => d.own = o); });
      sel.clear(); refresh();
      toast('ok', `${ids.length} ${ids.length === 1 ? 'company' : 'companies'} assigned to ${P[o][0]}`, 'Their open deals moved with them', { label:'Undo', run:() => { before.forEach(([id, w]) => { const c = coOf(id); if (c){ c.own = w; DE.filter(d => d.co === id).forEach(d => d.own = w); } }); refresh(); } });
    }));
  });
  onOpen('[data-pop="#crm-p-move"]', () => {
    const p = pop('crm-p-move');
    p.innerHTML = `<div class="ph" role="none">Move each lead deal to</div>` + STAGES.map(s => mi(`data-s="${s.k}"`, pill(s.k), 'menuitem')).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => {
      const moves = [...sel].map(coOf).filter(c => c && c.lead).map(c => [c.lead, c.lead.st]);
      moves.forEach(([d]) => setStage(d, m.dataset.s)); sel.clear(); refresh();
      toast('ok', `Moved ${moves.length} ${moves.length === 1 ? 'deal' : 'deals'} to ${ST[m.dataset.s].t}`, 'The lead deal of each company you picked', { label:'Undo', run:() => { moves.forEach(([d, s]) => setStage(d, s)); refresh(); } });
    }));
  });
  $('[data-a="export"]', sb).onclick = () => exportCsv(CO.filter(c => sel.has(c.id)));
  $('[data-a="delete"]', sb).onclick = () => remove([...sel]);
  // removed rows slide away, and Undo brings them back
  function remove(ids){
    const gone = ids.map(coOf).filter(Boolean), deals = DE.filter(d => ids.includes(d.co));
    const finish = () => { CO = CO.filter(c => !ids.includes(c.id)); DE = DE.filter(d => !ids.includes(d.co)); ids.forEach(id => sel.delete(id)); if (ids.includes(sheetFor)) closeSheet(); refresh(); };
    const rows = ids.map(id => $(`tr[data-id="${id}"]`, tbody)).filter(Boolean);
    if (rows.length && !REDUCE){ rows.forEach(r => r.classList.add('ttx-out')); setTimeout(finish, 240); } else finish();
    toast('bad', gone.length === 1 ? `${gone[0].n} deleted` : `${gone.length} companies deleted`, `${deals.length} ${deals.length === 1 ? 'deal' : 'deals'} went with ${gone.length === 1 ? 'it' : 'them'}`, { label:'Undo', run:() => { CO.push(...gone.filter(c => !coOf(c.id))); DE.push(...deals.filter(d => !dealOf(d.id))); refresh(); } });
  }

  /* ---------- Export: the rows as a CSV file ---------- */
  function exportCsv(list){
    const rows = [['Company', 'Segment', 'Tags', 'Stage', 'Owner', 'Pipeline', 'Open deals', 'Pipeline value', 'Win probability', 'Last interaction', 'Type'],
      ...list.map(c => [c.n, c.seg, c.tags.join('; '), ST[c.st].t, P[c.own][0], REG[c.reg].t, c.deals, c.value, c.win + '%', dateOf(-c.last).toISOString().slice(0, 10), c.lt])];
    const csv = rows.map(r => r.map(v => /[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : v).join(',')).join('\n');
    try {
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' })); a.download = 'larkfield-companies.csv';
      app.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } catch(e){}
    toast('ok', `Exported ${list.length} ${list.length === 1 ? 'company' : 'companies'}`, 'larkfield-companies.csv, ' + money(sum(list, c => c.value)) + ' in pipeline');
  }
  $('.crm-export', app).onclick = () => exportCsv(view);

  /* ---------- the details sheet: Details panel ---------- */
  const sheet = $('.crm-sheet', app), dtp = $('.crm-dtp', app);
  const shut = new Set();
  const section = (k, t, body) => `<div class="dtp-sec"><button class="dtp-sh" aria-expanded="${!shut.has(k)}" data-sec="${k}">${I('chev-r', 'xs')}<span>${t}</span></button><div class="fold${shut.has(k) ? ' shut' : ''}"><div>${body}</div></div></div>`;
  const tlOf = c => {
    const own = P[c.own][0], base = [[c.lt, c.last, `${c.lt === 'Email' ? 'Email thread' : c.lt === 'Call' ? 'Call' : c.lt + ' meeting'} with the ${c.seg === 'SMB' ? 'founder' : 'buying group'}`, own],
      ['Email', c.last + 4, 'Sent the proposal and pricing', own], ['Discovery', c.last + 13, 'Discovery call, 4 people joined', own]];
    return [...c.log, ...base];
  };
  function renderSheet(){
    const c = coOf(sheetFor); if (!c) return closeSheet();
    const mine = DE.filter(d => d.co === c.id).sort((a, b) => ST[b.st].i - ST[a.st].i || b.v - a.v);
    dtp.innerHTML = `<div class="dtp-h"><span class="pfm-lg" aria-hidden="true">${esc(c.n[0])}</span><span class="tx"><b id="crm-sh-t">${esc(c.n)}</b><span>${esc(c.seg)}, ${REG[c.reg].t}</span></span><button class="ib" data-a="link" aria-label="Copy a link to ${esc(c.n)}" data-tip="Copy link">${I('link', 's')}</button><button class="ib" data-a="close" aria-label="Close details" data-tip="Close" data-tip-k="Esc">${I('x', 's')}</button></div>`
      + `<div class="crm-sum3"><div><span>Pipeline</span><b class="num">${kmoney(c.value)}</b></div><div><span>Weighted</span><b class="num">${kmoney(c.weighted)}</b></div><div><span>Closed won</span><b class="num">${kmoney(c.won)}</b></div></div>`
      + section('props', 'Properties', `<div class="dtp-rows">`
        + `<div class="dtp-r"><span class="k">Account owner</span><button class="dtp-v" data-pop="#crm-p-sown" aria-haspopup="menu">${av(c.own)}<span>${esc(P[c.own][0])}</span>${I('chev-d', 'xs')}</button></div>`
        + `<div class="dtp-r"><span class="k">Stage</span><span class="dtp-v static">${pill(c.st)}</span></div>`
        + `<div class="dtp-r"><span class="k">Pipeline</span><span class="dtp-v static"><span class="dot" style="color:${REG[c.reg].c}"></span>${REG[c.reg].t}</span></div>`
        + `<div class="dtp-r crm-tg"><span class="k">Tags</span><span class="dtp-tags">${[c.seg, ...c.tags].map(chip).join('')}<button class="dtp-add" data-a="tag" aria-label="Add a tag" data-tip="Add tag">${I('plus', 'xs')}</button></span></div>`
        + `<div class="dtp-r"><span class="k">Win probability</span><span class="dtp-v static">${winBar(c.win)}</span></div>`
        + `<div class="dtp-r"><span class="k">Last interaction</span><span class="dtp-v static">${lastCell(c)}</span></div></div>`)
      + section('deals', `Deals, ${mine.length}`, mine.length ? `<div class="crm-dl">${mine.map(d => `<button data-deal="${d.id}" data-pop="#crm-p-sstage" aria-haspopup="menu" aria-label="${esc(d.n)}, ${ST[d.st].t}, ${money(d.v)}. Change its stage"><span class="t">${esc(d.n)}</span>${pill(d.st)}<span class="num">${kmoney(d.v)}</span></button>`).join('')}</div>` : '<p class="muted">No deals yet.</p>')
      + section('act', 'Activity', `<ul class="crm-tl">${tlOf(c).slice(0, 5).map(([k, d, t, w], i) => `<li${i === 0 && c._fresh ? ' class="new"' : ''}><span class="ic">${I(ACT[k] || 'comment', 'xs')}</span><span>${esc(t)}<span class="w num">${d === 0 ? 'Today' : fmtD(-d)}, ${esc(w)}</span></span></li>`).join('')}</ul>`)
      + `<div class="crm-sact"><button class="pill line sm" data-a="call">${I('comment', 'xs')}Log a call</button><button class="pill primary sm" data-a="email">${I('mail', 'xs')}Email the champion</button></div>`;
    c._fresh = false;
    sheet.setAttribute('aria-labelledby', 'crm-sh-t');
  }
  function openSheet(id, focus = false){
    const was = sheetFor; sheetFor = id; renderSheet();
    sheet.inert = false; sheet.classList.add('on'); app.classList.add('sh');
    $$('tr[data-id]', tbody).forEach(tr => tr.classList.toggle('open', tr.dataset.id === id));
    if (focus || (document.activeElement && document.activeElement.closest('tr[data-id],.kbx-k,.cpl,.ntx'))) setTimeout(() => $('[data-a="close"]', dtp).focus({ preventScroll:true }), 60);
    if (was !== id && !REDUCE) dtp.animate([{ opacity:0, transform:'translateY(4px)' }, { opacity:1, transform:'none' }], { duration:240, easing:'ease-out' });
  }
  function closeSheet(){
    if (!sheetFor) return;
    const id = sheetFor; sheetFor = null; sheet.classList.remove('on'); sheet.inert = true; app.classList.remove('sh');
    $$('tr.open', tbody).forEach(tr => tr.classList.remove('open'));
    const tr = $(`tr[data-id="${id}"]`, tbody); if (tr && sheet.contains(document.activeElement)) focusRow(tr);
  }
  dtp.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const c = coOf(sheetFor);
    if (b.dataset.sec){ const f = b.nextElementSibling, open = f.classList.toggle('shut') === false; b.setAttribute('aria-expanded', open); open ? shut.delete(b.dataset.sec) : shut.add(b.dataset.sec); return; }
    if (b.dataset.deal){ stageFor = b.dataset.deal; buildStageMenu(); return; }
    const a = b.dataset.a;
    if (a === 'close') closeSheet();
    if (a === 'link'){ const url = location.origin + location.pathname + '#' + c.id; (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).catch(() => {}); toast('ok', 'Link copied', c.n + ' opens with its details'); }
    if (a === 'tag'){ const next = ['Champion', 'Budget set', 'Security review', 'Multi-year'].find(t => !c.tags.includes(t)); if (next){ c.tags.push(next); renderSheet(); renderTable(); const t = $$('.dtp-tags .tag', dtp).pop(); enter(t); } }
    if (a === 'call') logActivity(c, 'Call');
    if (a === 'email'){ logActivity(c, 'Email', 'Email to the champion, follow-up on the proposal'); }
  });
  function logActivity(c, kind, text){
    const prev = [c.last, c.lt];
    c.log.unshift([kind, 0, text || (kind === 'Call' ? 'Call logged with the buying group' : 'Email sent'), 'Nina Cole']); c.last = 0; c.lt = kind; c.trend[11]++; c._fresh = true;
    refresh();
    toast('ok', kind === 'Call' ? 'Call logged' : 'Email sent', `${c.n}, last interaction is now today`, { label:'Undo', run:() => { c.log.shift(); [c.last, c.lt] = prev; c.trend[11]--; refresh(); } });
  }
  // the owner menu is built as it opens; the sheet's button is drawn again each time, so this listens on the sheet
  dtp.addEventListener('click', e => {
    if (!e.target.closest('[data-pop="#crm-p-sown"]')) return;
    const c = coOf(sheetFor), p = pop('crm-p-sown');
    p.innerHTML = `<div class="ph" role="none">Account owner</div>` + OWN.map(o => mi(`data-o="${o}"`, `${av(o)}<span>${P[o][0]}</span>`, 'menuitemradio', c.own === o)).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { const was = c.own; if (was === m.dataset.o) return; c.own = m.dataset.o; DE.filter(d => d.co === c.id && d.own === was).forEach(d => d.own = c.own); refresh();
      toast('ok', `${c.n} is now ${first(c.own)}'s`, 'Owner changed from ' + P[was][0], { label:'Undo', run:() => { DE.filter(d => d.co === c.id && d.own === c.own).forEach(d => d.own = was); c.own = was; refresh(); } }); }));
  }, true);
  function buildStageMenu(){
    const d = dealOf(stageFor), p = pop('crm-p-sstage'); if (!d) return;
    p.innerHTML = `<div class="ph" role="none">Move ${esc(d.n)} to</div>` + STAGES.map(s => mi(`data-s="${s.k}"`, pill(s.k), 'menuitemradio', d.st === s.k)).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => moveDeal(d, m.dataset.s)));
  }

  /* ---------- moving a deal: the board, the sheet and the menus all come here ---------- */
  // a deal that is won closes today; moved back out, it gets its expected close date again
  function setStage(d, st){
    if (st === 'won' && d.st !== 'won'){ d.was = d.close; d.close = 0; }
    if (st !== 'won' && d.st === 'won' && d.was != null){ d.close = d.was; d.was = null; }
    d.st = st; d.p = probOf(d);
  }
  function moveDeal(d, st){
    const was = d.st; if (was === st) return;
    setStage(d, st); refresh();
    const c = coOf(d.co);
    say(`${d.n} moved to ${ST[st].t}`);
    toast(st === 'won' ? 'ok' : 'info', st === 'won' ? `Won: ${c.n}, ${money(d.v)}` : `${d.n} moved to ${ST[st].t}`, st === 'won' ? `${d.n}. Added to this quarter's closed won` : `${c.n}, win probability now ${d.p}%`, { label:'Undo', run:() => { setStage(d, was); refresh(); } });
  }

  /* ---------- Deals: the Kanban board ---------- */
  const kb = $('.crm-kb', app), cols = $('.kbx-cols', kb), live = $('.kbx-sr', kb), kq = $('.kbx-hd .kbx-q input', kb), kqx = $('.kbx-hd .kbx-qx', kb);
  const say = t => { live.textContent = ''; setTimeout(() => live.textContent = t, 40); };
  const CLOSES = [['any', 'Any time'], ['month', 'This month'], ['quarter', 'This quarter'], ['overdue', 'Overdue']];
  const eom = Math.round((new Date(today.getFullYear(), today.getMonth() + 1, 0) - today) / 864e5), eoq = Math.round((new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 + 3, 0) - today) / 864e5);
  const slipping = d => d.st !== 'won' && d.close < 0;
  const dshows = d => (!K.own.size || K.own.has(d.own)) && (!K.q || (d.n + ' ' + coOf(d.co).n + ' ' + d.id).toLowerCase().includes(K.q.toLowerCase()))
    && (K.close === 'any' || (K.close === 'overdue' ? slipping(d) : d.st !== 'won' && d.close >= 0 && d.close <= (K.close === 'month' ? eom : eoq)));
  $('.kbx-fp', kb).innerHTML = OWN.map(o => `<button aria-pressed="false" data-who="${o}" aria-label="${P[o][0]}" data-tip="${P[o][0]}">${av(o)}</button>`).join('');
  $('.kbx-tabs', kb).innerHTML = STAGES.map(s => `<button aria-pressed="${s.k === K.tab}" data-v="${s.k}">${s.k === 'won' ? 'Won' : s.t}<span class="n num"></span></button>`).join('');
  seg($('.kbx-tabs', kb), v => { K.tab = v; renderBoard(); });
  seg($('.kbx-vw', kb), v => { K.view = v; kb.classList.toggle('list', v === 'list'); renderBoard(); });
  cols.innerHTML = STAGES.map(s => `<div class="kbx-c" data-col="${s.k}"><div class="kbx-ch"><b>${s.t}</b><span class="n num"></span><span class="s num"></span><button class="ib crm-hide" aria-label="Hide ${s.t}" data-tip="Hide column">${I('minus', 'xs')}</button></div><div class="kbx-list" role="list" aria-label="${s.t}"></div></div>`).join('');
  const card = d => { const c = coOf(d.co), late = slipping(d);
    return `<div class="kbx-k${d.st === 'won' ? ' won' : ''}${sheetFor === d.co ? ' open' : ''}" data-id="${d.id}" role="listitem" tabindex="-1" aria-label="${esc(d.n)}, ${esc(c.n)}, ${money(d.v)}, ${ST[d.st].t}">`
      + `<div class="kbx-k1"><span class="kbx-id num">${d.id}</span><span class="kbx-sp"></span><span class="kbx-who" data-tip="${P[d.own][0]}">${av(d.own)}</span><button class="kbx-mv" data-pop="#crm-p-mv" data-pop-align="end" aria-haspopup="menu" aria-label="Move ${esc(d.n)}" data-tip="Move to" tabindex="-1">${I('more', 'xs')}</button></div>`
      + `<div class="t">${esc(d.n)}</div>`
      + `<div class="kbx-m"><span class="kbx-mt co"><span class="pfm-lg xs" aria-hidden="true">${esc(c.n[0])}</span>${esc(c.n)}</span><span class="kbx-mt v num">${money(d.v)}</span>`
      + `<span class="kbx-mt num${late ? ' late' : ''}">${I(late ? 'alert' : 'cal', 'xs')}${d.st === 'won' ? 'Won ' + fmtD(d.close) : fmtD(d.close)}</span>${d.st !== 'won' ? `<span class="kbx-mt num">${d.p}%</span>` : ''}</div></div>`; };
  let kFocus = null;
  function renderBoard(){
    const open = DE.filter(d => d.st !== 'won');
    $('.crm-kbsum', kb).textContent = `${open.length} open deals, ${kmoney(sum(open, d => d.v))}`;
    const filtering = K.own.size || K.q || K.close !== 'any';
    let shown = 0;
    STAGES.forEach(s => {
      const col = $(`.kbx-c[data-col="${s.k}"]`, cols), L = DE.filter(d => d.st === s.k && dshows(d)).sort((a, b) => (s.k === 'won' ? b.close - a.close : a.close - b.close) || b.v - a.v);
      shown += L.length;
      $('.kbx-list', col).innerHTML = L.map(card).join('') || (filtering ? '' : '<div class="kbx-none">No deals</div>');
      $('.kbx-ch .n', col).textContent = L.length; $('.kbx-ch .s', col).textContent = kmoney(sum(L, d => d.v));
      col.classList.toggle('gone', K.shut.has(s.k)); col.classList.toggle('on', K.tab === s.k); col._sum = [L.length, kmoney(sum(L, d => d.v))];
      $(`.kbx-tabs [data-v="${s.k}"] .n`, kb).textContent = L.length;
    });
    // a hidden stage leaves the board for a chip by the filters: press the chip to bring the column back, or drop a card on it
    cols.style.setProperty('--dm-kbx-gt', STAGES.filter(s => !K.shut.has(s.k)).map(() => 'minmax(216px,1fr)').join(' ') || 'minmax(0,1fr)');
    const hid = STAGES.filter(s => K.shut.has(s.k)), dock = $('.crm-dock', kb), had = new Set($$('.crm-dk', dock).map(b => b.dataset.col));
    dock.hidden = !hid.length;
    $('.crm-dks', dock).innerHTML = hid.map(s => { const [n, v] = $(`.kbx-c[data-col="${s.k}"]`, cols)._sum;
      return `<button class="chip sm crm-dk" data-col="${s.k}" aria-label="Show ${s.t}, ${n} ${n === 1 ? 'deal' : 'deals'}, ${v}" data-tip="Show column, or drop a deal here"><span class="v">${s.t}</span><span class="k num">${n} · ${v}</span>${I('plus', 'xs')}</button>`; }).join('');
    $$('.crm-dk', dock).forEach(b => { if (!had.has(b.dataset.col)) enter(b); });
    $('.kbx-em', kb).hidden = shown > 0 || !filtering;
    $('.kbx-cnt', kb).textContent = filtering ? `${shown} of ${DE.length} deals` : `${DE.length} deals`;
    $$('.kbx-fp button', kb).forEach(b => b.setAttribute('aria-pressed', K.own.has(b.dataset.who)));
    $('.kbx-fp', kb).classList.toggle('some', K.own.size > 0);
    const cb = $('[data-f="close"]', kb); $('.v', cb).textContent = CLOSES.find(x => x[0] === K.close)[1]; cb.classList.toggle('on', K.close !== 'any');
    $('.kbx-clr', kb).hidden = !filtering;
    const ks = $$('.kbx-k', cols), keep = ks.find(k => k.dataset.id === kFocus) || ks[0]; if (keep) keep.tabIndex = 0;
  }
  $('.crm-dock', kb).addEventListener('click', e => { const b = e.target.closest('.crm-dk'); if (!b || dragged) return; const k = b.dataset.col; K.shut.delete(k); renderBoard();
    const col = $(`.kbx-c[data-col="${k}"]`, cols); enter(col); col.scrollIntoView({ block:'nearest', inline:'nearest', behavior:REDUCE ? 'auto' : 'smooth' });
    swap($('.kbx-sr', kb), `${ST[k].t} shown`); const h = $('.crm-hide', col); if (h) h.focus({ preventScroll:true }); });
  $('.kbx-fp', kb).addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; K.own.has(b.dataset.who) ? K.own.delete(b.dataset.who) : K.own.add(b.dataset.who); renderBoard(); });
  kq.addEventListener('input', () => { K.q = kq.value.trim(); kqx.hidden = !kq.value; renderBoard(); });
  kqx.onclick = () => { kq.value = ''; K.q = ''; kqx.hidden = true; renderBoard(); kq.focus(); };
  const clearBoard = () => { K.own.clear(); K.q = ''; K.close = 'any'; kq.value = ''; kqx.hidden = true; renderBoard(); };
  $('.kbx-clr', kb).onclick = clearBoard; $('.crm-kbclr', kb).onclick = clearBoard;
  onOpen('[data-f="close"]', () => {
    const p = pop('crm-p-close');
    p.innerHTML = `<div class="ph" role="none">Close date</div>` + CLOSES.map(([k, t]) => mi(`data-k="${k}"`, `<span>${t}</span><span class="r num">${k === 'any' ? DE.length : DE.filter(d => { const s = K.close; K.close = k; const r = dshows(d); K.close = s; return r; }).length}</span>`, 'menuitemradio', K.close === k)).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { K.close = m.dataset.k; renderBoard(); }));
  });
  cols.addEventListener('click', e => {
    if (dragged) return;
    const hide = e.target.closest('.crm-hide');
    if (hide){ const k = hide.closest('.kbx-c').dataset.col; K.shut.add(k); renderBoard(); swap($('.kbx-sr', kb), `${ST[k].t} hidden. It waits by the filters, press it to show the column again`);
      const b = $(`.crm-dk[data-col="${k}"]`, kb); if (b) b.focus({ preventScroll:true }); return; }
    const el = e.target.closest('.kbx-k'); if (!el) return;
    kFocus = el.dataset.id;
    if (e.target.closest('.kbx-mv')){ mvFor = el.dataset.id; buildMoveMenu(); return; }
    openSheet(dealOf(el.dataset.id).co);
    $$('.kbx-k', cols).forEach(k => k.classList.toggle('open', k === el));
  });
  cols.addEventListener('keydown', e => {
    const el = e.target.closest('.kbx-k'); if (!el || e.target !== el) return;
    const ks = $$('.kbx-k', cols).filter(k => k.offsetParent), i = ks.indexOf(el);
    const go = n => { if (!n) return; e.preventDefault(); ks.forEach(k => k.tabIndex = -1); n.tabIndex = 0; kFocus = n.dataset.id; n.focus(); };
    if (e.key === 'ArrowDown') go(ks[i + 1]); else if (e.key === 'ArrowUp') go(ks[i - 1]);
    else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft'){ const c = el.closest('.kbx-c'), cs = $$('.kbx-c', cols), n = cs[cs.indexOf(c) + (e.key === 'ArrowRight' ? 1 : -1)]; if (n) go($('.kbx-k', n)); }
    else if (e.key === 'Enter'){ e.preventDefault(); openSheet(dealOf(el.dataset.id).co, true); }
    else if (e.key === 'm' || e.key === 'M'){ e.preventDefault(); $('.kbx-mv', el).click(); }
  });
  function buildMoveMenu(){
    const d = dealOf(mvFor), p = pop('crm-p-mv'); if (!d) return;
    p.innerHTML = `<div class="ph" role="none">Move to</div>` + STAGES.map(s => mi(`data-s="${s.k}"`, pill(s.k), 'menuitemradio', d.st === s.k)).join('')
      + `<div class="sep" role="separator"></div>` + mi('data-open', `${I('panel', 's')}<span>Open ${esc(coOf(d.co).n)}</span>`, 'menuitem');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { if (m.hasAttribute('data-open')) setTimeout(() => openSheet(d.co, true), 130); else moveDeal(d, m.dataset.s); }));
  }
  // dragging a card to another column, with a copy of it under the pointer
  let dragged = false;
  cols.addEventListener('pointerdown', e => {
    const el = e.target.closest('.kbx-k'); if (!el || e.button !== 0 || e.target.closest('button') || kb.classList.contains('list')) return;
    if (e.pointerType === 'touch' && getComputedStyle(el).touchAction !== 'none') return;
    const d = dealOf(el.dataset.id), rc = el.getBoundingClientRect(), ox = e.clientX - rc.left, oy = e.clientY - rc.top, bd = $('.kbx-bd', kb);
    let ghost = null, over = null, moved = false, raf = 0, lx = e.clientX;
    const at = (x, y) => { const t = document.elementFromPoint(x, y); return t && t.closest('.crm-kb .kbx-c, .crm-kb .crm-dk'); };
    const move = ev => {
      if (!moved && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) < 5) return;
      if (!moved){ moved = true; ghost = el.cloneNode(true); ghost.classList.add('ghost'); ghost.classList.remove('open'); ghost.removeAttribute('tabindex'); ghost.style.width = rc.width + 'px'; app.appendChild(ghost); el.classList.add('drag'); closeSheet(); }
      ghost.style.left = ev.clientX - ox + 'px'; ghost.style.top = ev.clientY - oy + 'px'; lx = ev.clientX;
      const c = at(ev.clientX, ev.clientY); if (c !== over){ if (over) over.classList.remove('over'); over = c; if (over && over.dataset.col !== d.st) over.classList.add('over'); }
      // near the board's edges it scrolls sideways
      if (!raf){ const tickS = () => { const b = bd.getBoundingClientRect(), dx = lx < b.left + 48 ? -12 : lx > b.right - 48 ? 12 : 0; if (dx && ghost){ bd.scrollLeft += dx; raf = requestAnimationFrame(tickS); } else raf = 0; }; raf = requestAnimationFrame(tickS); }
    };
    const up = () => {
      removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); cancelAnimationFrame(raf); raf = 0;
      if (!moved) return;
      ghost.remove(); el.classList.remove('drag'); if (over) over.classList.remove('over');
      dragged = true; setTimeout(() => dragged = false, 0);
      if (over && over.dataset.col !== d.st) moveDeal(d, over.dataset.col);
    };
    addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  });

  /* ---------- Forecast: the chart components, worked out from the deals ---------- */
  const fc = $('.crm-fc', app);
  const Q3 = { pipe:3920000, weighted:1880000, avg:96000 };
  const Q3W = [110, 260, 400, 540, 690, 840, 960, 1060, 1150, 1240, 1310, 1370, 1420].map(x => x * 1000);
  // every closed-won deal of the quarter with the day it closed (days from today): the same deals as the board's Closed won column
  const wonQ = () => DE.filter(d => d.st === 'won' && d.close >= -qDay);
  const wonEvents = () => wonQ().map(d => ({ at:Math.min(0, d.close), v:d.v }));
  const wonOf = who => sum(wonQ().filter(d => who.includes(d.own)), d => d.v);
  // commit: the weighted value of the deals in Proposal and Negotiation
  const commitOf = who => sum(DE.filter(d => (d.st === 'nego' || d.st === 'prop') && who.includes(d.own)), d => d.v * d.p / 100);
  const delta = (a, b) => { const p = Math.round((a / b - 1) * 1000) / 10; return `<span class="tag scx-d num ${p >= 0 ? 'ok' : 'bad'}">${p >= 0 ? '+' : '−'}${Math.abs(p)}%</span>`; };
  const sparkPath = (pts) => { const mx = Math.max(...pts), mn = Math.min(...pts); return pts.map((y, k) => `${k ? 'L' : 'M'}${(k / (pts.length - 1) * 100).toFixed(1)} ${(28 - (y - mn) / ((mx - mn) || 1) * 24).toFixed(1)}`).join(' '); };
  const lineOn = [true, true];
  let shownLine = null;
  function renderForecast(){
    const open = DE.filter(d => d.st !== 'won'), pipe = sum(open, d => d.v), weighted = sum(open, d => d.v * d.p / 100), won = wonOf(OWN), avg = open.length ? pipe / open.length : 0;
    // the cumulative won by week, this quarter so far
    const EV = wonEvents(), A = Array.from({ length:WK + 1 }, (_, i) => sum(EV.filter(e => Math.floor((e.at + qDay) / 7) <= i), e => e.v));
    const S = [['chart', 'Open pipeline', pipe, Q3.pipe, [3.4, 3.6, 3.5, 3.8, 3.9, 4.0, pipe / 1e6], 'Compared with the end of Q3'], ['target', 'Weighted forecast', weighted, Q3.weighted, [1.5, 1.6, 1.7, 1.65, 1.8, 1.9, weighted / 1e6], 'Compared with the end of Q3'],
      ['ok', 'Closed won, Q4', won, Q3W[WK], A.map(v => v / 1e6), `Compared with week ${WK + 1} of Q3`], ['coins', 'Average open deal', avg, Q3.avg, [88, 91, 90, 94, 95, 97, avg / 1e3], 'Compared with the end of Q3']];
    $('.scx-grid', fc).innerHTML = S.map((s, i) => `<div class="scx-c panel" data-tip="${s[5]}"><span class="scx-k"><span class="ic">${I(s[0], 'xs')}</span>${s[1]}</span><div class="scx-v"><b class="num">${kmoney(s[2])}</b>${delta(s[2], s[3])}</div><div class="scx-sp"><svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path stroke="var(--dm-c${i + 1})" d="${sparkPath(s[4])}"/></svg></div></div>`).join('');
    // the line chart: closed won by week, this quarter against last
    const hi = Math.max(Q3W[12], won) * 1.08, X = i => i / 12 * 320, Y = v => 136 - v / hi * 128;
    const smooth = p => p.map((q, i) => { if (!i) return `M${q[0]} ${q[1]}`; const a = p[i - 1], m = (q[0] - a[0]) / 2; return `C${a[0] + m} ${a[1]} ${q[0] - m} ${q[1]} ${q[0]} ${q[1]}`; }).join(' ');
    const pa = A.map((v, i) => [X(i), Y(v)]), pb = Q3W.map((v, i) => [X(i), Y(v)]);
    const svg = $('.lnx-svg', fc);
    svg.innerHTML = `<defs><linearGradient id="crm-lng" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--dm-accent-mark,var(--dm-accent))" stop-opacity=".16"/><stop offset="1" stop-color="var(--dm-accent-mark,var(--dm-accent))" stop-opacity="0"/></linearGradient></defs>`
      + [35, 70, 105].map(y => `<line class="gl" x1="0" x2="320" y1="${y}" y2="${y}"/>`).join('')
      + `<line class="crm-now" x1="${X(A.length - 1)}" x2="${X(A.length - 1)}" y1="6" y2="140"/>`
      + `<path class="ar" d="${smooth(pa)} L${X(A.length - 1)} 140 L0 140 Z" fill="url(#crm-lng)" style="opacity:${lineOn[0] ? 1 : 0}"/><path class="ln l1${lineOn[1] ? '' : ' off'}" d="${smooth(pb)}" stroke="var(--dm-c2)" stroke-dasharray="4 4"/><path class="ln l0${lineOn[0] ? '' : ' off'}" d="${smooth(pa)}" stroke="var(--dm-accent-mark,var(--dm-accent))"/>`;
    const ch = $('.lnx-ch', fc); $$('.lnx-pt, .crm-nowl', ch).forEach(x => x.remove());
    ch.insertAdjacentHTML('beforeend', `<span class="crm-nowl" style="left:${(A.length - 1) / 12 * 100}%">Today</span>`);
    ch.insertAdjacentHTML('beforeend', '<span class="lnx-pt on" style="color:var(--dm-accent-mark,var(--dm-accent))"></span><span class="lnx-pt on" style="color:var(--dm-c2)"></span>');
    const lv = $('.lnx-v', fc), latest = () => kmoney(won);
    if (shownLine === null || REDUCE) lv.textContent = latest(); else if (shownLine !== won) tween(shownLine, won, 700, n => lv.textContent = kmoney(n));
    shownLine = won;
    ch.onpointermove = ev => { const b = ch.getBoundingClientRect(), i = clamp(Math.round((ev.clientX - b.left) / b.width * 12), 0, 12), px = i / 12 * b.width;
      $('.lnx-x', ch).style.left = px + 'px'; $('.lnx-tt', ch).style.left = clamp(px, 70, b.width - 70) + 'px';
      const pts = $$('.lnx-pt', ch); [pa, pb].forEach((p, k) => { const has = !!p[i] && lineOn[k]; pts[k].classList.toggle('on', has); if (p[i]){ pts[k].style.left = px + 'px'; pts[k].style.top = p[i][1] / 140 * b.height + 'px'; } });
      const a = A[i], q = Q3W[i];
      const mine = lineOn[0] && a != null;
      $('.lnx-tt b', ch).textContent = mine ? kmoney(a) + ' won by week ' + (i + 1) : kmoney(q) + ' by week ' + (i + 1) + ' of Q3';
      $('.lnx-tt span', ch).textContent = mine ? (lineOn[1] ? `${a >= q ? '+' : '−'}${kmoney(Math.abs(a - q))} on Q3 at this point` : 'This quarter') : a == null ? 'This quarter is not there yet' : 'Last quarter';
      lv.textContent = mine ? kmoney(a) : latest(); };
    ch.onpointerleave = () => lv.textContent = latest();
    // radial goals: each team's closed won and commit against its quota
    const RAD = [78, 60, 42], CS = ['var(--dm-c1)', 'var(--dm-c3)', 'var(--dm-c4)'];
    const share = t => wonOf(t.who) / t.quota;
    const rsvg = $('.rgx-ring svg', fc);
    if (!rsvg.children.length) rsvg.innerHTML = TEAMS.map((t, i) => `<g data-i="${i}" style="stroke:${CS[i]}"><circle class="tr" cx="90" cy="90" r="${RAD[i]}"/><circle class="fl" cx="90" cy="90" r="${RAD[i]}" pathLength="100" stroke-dasharray="0 100"/></g>`).join('');
    TEAMS.forEach((t, i) => $(`g[data-i="${i}"] .fl`, rsvg).setAttribute('stroke-dasharray', `${Math.max(0, Math.min(1, share(t)) * 100 - .01)} 100`));
    const lg = $('.rgx-lg', fc), pc = x => Math.round(x * 100) + '%';
    lg.innerHTML = TEAMS.map((t, i) => `<div class="rgx-r" data-i="${i}" tabindex="0" aria-label="${t.t}: ${kmoney(wonOf(t.who))} won, ${pc(share(t))} of a ${kmoney(t.quota)} quota, ${kmoney(commitOf(t.who))} more in commit" data-tip="${kmoney(commitOf(t.who))} more in commit"><i style="background:${CS[i]}"></i><span class="n">${t.t}</span><span class="p num">${share(t) >= 1 ? `<span class="tag ok">${pc(share(t))}</span>` : pc(share(t))}</span><span class="v num">${kmoney(wonOf(t.who))} won of ${kmoney(t.quota)}</span></div>`).join('');
    const all = sum(TEAMS, t => wonOf(t.who)) / sum(TEAMS, t => t.quota), cb = $('.rgx-c b', fc), cl = $('.rgx-c .muted', fc);
    const centreOn = i => { const ring = $('.rgx-ring', fc); ring.classList.toggle('hov', i >= 0); $$('g', rsvg).forEach((g, k) => g.classList.toggle('on', k === i)); $$('.rgx-r', lg).forEach((r, k) => r.classList.toggle('on', k === i)); cb.textContent = pc(i < 0 ? all : share(TEAMS[i])); cl.textContent = i < 0 ? 'of quota won' : TEAMS[i].t; };
    centreOn(-1);
    $$('.rgx-r', lg).forEach((r, i) => { r.onpointerenter = r.onfocus = () => centreOn(i); r.onpointerleave = r.onblur = () => centreOn(-1); });
    // funnel: how many deals reached each stage
    const reach = STAGES.map(s => DE.filter(d => ST[d.st].i >= ST[s.k].i).length);
    let worst = 1; reach.forEach((n, i) => { if (i && n / reach[i - 1] < reach[worst] / reach[worst - 1]) worst = i; });
    $('.crm-fnn', fc).textContent = `${DE.length} deals`;
    $('.fnx-rows', fc).innerHTML = STAGES.map((s, i) => { const w = Math.max(6, reach[i] / (reach[0] || 1) * 100);
      return `<div class="fnx-r${i === worst ? ' drop' : ''}" style="--dm-fc:color-mix(in oklab,var(--dm-c1) ${100 - i * 25}%,var(--dm-c2))"><span class="k">${s.k === 'won' ? 'Won' : s.t}</span><div class="tr" data-tip="${i ? Math.round(reach[i] / reach[0] * 100) + '% of all deals' : 'Every deal starts here'}"><div class="bar" style="width:${w}%"></div><span class="n num${w < 24 ? ' out' : ''}" style="left:${w < 24 ? `calc(${w}% + 8px)` : '10px'}">${reach[i]}</span></div><span class="v num">${i ? '−' + Math.round((1 - reach[i] / (reach[i - 1] || 1)) * 100) + '%' : '100%'}</span></div>`; }).join('');
    $('.fnx-t', fc).textContent = `The biggest drop is from ${STAGES[worst - 1].t.toLowerCase()} to ${STAGES[worst].t.toLowerCase()}: ${Math.round((1 - reach[worst] / reach[worst - 1]) * 100)}% of deals stop there.`;
    // Activity heatmap: the team's calls, meetings and emails by weekday over the last 12 weeks, the same touches as the
    // companies' Activity column (each week's total spread over its days), or the follow-ups the agent drafted
    renderHeat();
    // quota by owner: Progress's meter, with a notch at the quota
    $('.crm-owl', fc).innerHTML = OWN.map(o => ({ o, w:wonOf([o]), m:commitOf([o]) })).sort((a, b) => b.w / QUOTA[b.o] - a.w / QUOTA[a.o]).map(({ o, w, m }) => { const p = w / QUOTA[o], pm = Math.max(0, Math.min(1 - Math.min(1, p), m / QUOTA[o]));
      return `<div class="crm-ow">${av(o)}<span class="n">${P[o][0]}</span><span class="p num">${kmoney(w)} <span class="muted">of ${kmoney(QUOTA[o])}</span></span><div class="prg-mb${p >= 1 ? ' ok' : ''}" role="meter" aria-label="${P[o][0]}: ${kmoney(w)} won, ${Math.round(p * 100)}% of quota, ${kmoney(m)} more in commit" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.min(100, Math.round(p * 100))}" data-tip="${kmoney(m)} more in commit"><i class="fl" style="width:${Math.min(100, p * 100)}%"></i><i class="crm-cm" style="left:${Math.min(100, p * 100)}%;width:${pm * 100}%"></i></div></div>`; }).join('');
  }
  const hm = $('.crm-hm', fc), hmg = $('.hmx-grid', hm), WD = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], DAYW = [.22, .25, .23, .19, .11];
  let hmWho = 'team', hmShown = false;
  hmg.innerHTML = Array.from({ length:60 }, () => '<i style="--dm-a:0"></i>').join('');
  $('.hmx-f', hm).innerHTML = [11, 8, 5, 2].map(w => `<span>${fmtD(-((today.getDay() + 6) % 7) - w * 7)}</span>`).join('');
  function renderHeat(){
    // a week's touches: every company's Activity for that week; the agent's drafts follow the accounts that went quiet
    const wk = w => hmWho === 'team' ? sum(CO, c => c.trend[w]) : sum(CO, c => c.trend[w] === 0 ? 2 : c.trend[w] < 3 ? 1 : 0) + 3;
    const V = []; for (let d = 0; d < 5; d++) for (let w = 0; w < 12; w++) V.push(Math.round(wk(w) * DAYW[d] * (1 + Math.sin(d * 5.3 + w * 2.1) * .18)));
    const mx = Math.max(...V), cells = $$('i', hmg), tot = sum(V);
    cells.forEach((el, i) => { const d = Math.floor(i / 12), w = i % 12, v = V[i], monday = -((today.getDay() + 6) % 7) - (11 - w) * 7;
      const set = () => el.style.setProperty('--dm-a', (v / mx * .9).toFixed(2));
      if (REDUCE || hmShown) set(); else setTimeout(set, (w + d) * 18);
      el.dataset.tip = `${WD[d]}, week of ${fmtD(monday)}: ${v} ${hmWho === 'team' ? (v === 1 ? 'touch' : 'calls, meetings and emails') : (v === 1 ? 'follow-up drafted' : 'follow-ups drafted')}`; });
    hmShown = true;
    const best = DAYW.indexOf(Math.max(...DAYW));
    swap($('.hmx-st', hm), hmWho === 'team' ? `${tot.toLocaleString('en-US')} touches in 12 weeks, busiest on ${WD[best]}s` : `${tot.toLocaleString('en-US')} follow-ups drafted for quiet accounts`);
  }
  seg($('.hmx-sg', hm), v => { hmWho = v; renderHeat(); });
  $$('.lnx-k', fc).forEach(k => k.onclick = () => { const s = +k.dataset.s; if (lineOn[s] && !lineOn[1 - s]) return; lineOn[s] = !lineOn[s]; k.classList.toggle('on', lineOn[s]); k.setAttribute('aria-pressed', lineOn[s]); renderForecast(); });

  /* ---------- tabs: Segmented control ---------- */
  const tabs = $$('.crm-seg [role="tab"]', app), knob = $('.crm-seg .sgc-k', app);
  const place = () => { const b = tabs.find(t => t.getAttribute('aria-selected') === 'true'); knob.style.left = b.offsetLeft + 'px'; knob.style.width = b.offsetWidth + 'px'; };
  new ResizeObserver(place).observe($('.crm-seg', app));
  const TITLES = { companies:'Companies', deals:'Deals', forecast:'Forecast' };
  function setTab(k, focus = false){
    tab = k; app.dataset.tab = k;
    tabs.forEach(t => { const on = t.dataset.v === k; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
    ['companies', 'deals', 'forecast'].forEach(v => $('#crm-v-' + v, app).hidden = v !== k);
    swap($('.crm-h1t', app), TITLES[k]);
    $$('.crm-nav [data-go]', app).forEach(b => { if (b.dataset.rep) return; b.toggleAttribute('aria-current', false); if (b.dataset.go === k) b.setAttribute('aria-current', 'true'); });
    place(); if (k === 'forecast') { closeSheet(); renderForecast(); } if (k === 'deals') renderBoard();
    counts(); drawer(false);
  }
  tabs.forEach(t => t.addEventListener('click', () => setTab(t.dataset.v)));
  $('.crm-seg', app).addEventListener('keydown', e => { const i = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true'), d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return; e.preventDefault(); setTab(tabs[(i + d + tabs.length) % tabs.length].dataset.v, true); });

  /* ---------- the sidebar ---------- */
  $('.crm-teams', app).innerHTML = TEAMS.map(t => `<button class="ahx-cv" data-team="${t.k}" aria-pressed="false">${I('users')}<span class="t">${t.t}</span><span class="n num">${t.who.length}</span></button>`).join('');
  $('.crm-pipes', app).innerHTML = Object.entries(REG).map(([k, r]) => `<button class="ahx-cv" data-reg="${k}" aria-pressed="false"><span class="dot" style="color:${r.c}"></span><span class="t">${r.t}</span><span class="n num" data-count="reg-${k}"></span></button>`).join('');
  function counts(){
    const set = (k, v) => $$(`[data-count="${k}"]`, app).forEach(x => x.textContent = v);
    set('companies', CO.length); set('deals', DE.filter(d => d.st !== 'won').length); set('slip', DE.filter(slipping).length);
    Object.keys(REG).forEach(k => set('reg-' + k, CO.filter(c => c.reg === k).length));
    const open = DE.filter(d => d.st !== 'won');
    $('.crm-ctx', app).textContent = tab === 'companies' ? `${CO.length} companies, ${kmoney(sum(CO, c => c.value))} open` : tab === 'deals' ? `${open.length} open, ${kmoney(sum(open, d => d.v * d.p / 100))} weighted` : `Q4 ${today.getFullYear()}, week ${clamp(Math.ceil((today - new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1)) / 6048e5), 1, 13)} of 13`;
  }
  app.addEventListener('click', e => {
    const b = e.target.closest('.crm-side button'); if (!b) return;
    if (b.dataset.team){ const t = TEAMS.find(x => x.k === b.dataset.team), on = b.getAttribute('aria-pressed') === 'true'; F.own = new Set(on ? [] : t.who); setTab('companies'); renderTable(); }
    else if (b.dataset.reg){ F.reg = F.reg === b.dataset.reg ? null : b.dataset.reg; setTab('companies'); renderTable(); }
    else if (b.dataset.rep === 'slip'){ K.close = 'overdue'; K.own.clear(); setTab('deals'); }
    else if (b.dataset.go) setTab(b.dataset.go);
    else if (b.dataset.act === 'invite'){ (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject()).catch(() => {}); toast('ok', 'Invite link copied', 'Anyone with it can join Larkfield Sales'); }
    else if (b.dataset.act === 'billing') toast('info', 'Billing is not part of the template', 'Your trial has 14 days left');
    else if (b.dataset.act === 'help') help();
    if (b.closest('.crm-nav,.crm-sfoot')) drawer(false);
  });
  const help = () => toast('info', 'Keyboard shortcuts', '⌘K or Ctrl K search, / filters the table, arrows move through rows and cards, Enter opens, Space picks a row, M moves a card, Esc closes');
  onOpen('.crm-wsb', () => {
    const p = pop('crm-p-ws'), cur = $('.crm-wst .t', app).textContent;
    p.innerHTML = `<div class="ph" role="none">Workspaces</div>` + [['L', 'Larkfield Sales', '8 members', 'pb'], ['P', 'Larkfield Partners', '3 members', 'pl']].map(w => mi(`data-n="${w[1]}"`, `<span class="pfm-lg" data-t="${w[3]}">${w[0]}</span><span>${w[1]}<span class="d">${w[2]}</span></span>`, 'menuitemradio', w[1] === cur)).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { if (m.dataset.n === cur) return; $('.crm-wst .t', app).textContent = m.dataset.n; $('.crm-wsb .pfm-lg', app).textContent = m.dataset.n[0] === 'L' && m.dataset.n.includes('Partners') ? 'P' : 'L'; $('.crm-wsb .pfm-lg', app).dataset.t = m.dataset.n.includes('Partners') ? 'pl' : 'pb'; toast('info', `Switched to ${m.dataset.n}`, 'The template shows the same pipeline in both'); }));
  });
  // the drawer, on tablets and phones
  const drawer = on => { app.classList.toggle('dr', on); if (on) setTimeout(() => $('.crm-side .ahx-cv[aria-current="true"]', app)?.focus(), 80); };
  $('.crm-menu', app).onclick = () => drawer(true);
  $('.crm-scrim', app).onclick = () => drawer(false);
  $('.crm-shade', app).onclick = () => closeSheet();

  /* ---------- notifications: Notifications ---------- */
  const NT = [
    { k:'deal', ic:'ok', col:'var(--dm-ok)', co:'Kestrel Robotics', t:'<b>Kestrel Robotics</b> passed its security review. $60,000 closed won', w:'12 min ago' },
    { k:'men', av:'MK', co:'Halcyon Labs', t:'<b>Maya Kim</b> mentioned you on Halcyon Labs: "Can you join the pricing call?"', w:'40 min ago' },
    { k:'deal', ic:'alert', col:'var(--dm-warn)', co:'Tidewell Energy', t:'<b>Tidewell Energy</b> renewal is past its close date', w:'2 hours ago' },
    { k:'men', av:'TR', co:'Granite Peak Systems', t:'<b>Theo Reed</b> asked you to review the Granite Peak proposal', w:'Yesterday' },
    { k:'deal', ic:'chart', col:'var(--dm-pb)', co:'Orchard Street Bank', t:'<b>Orchard Street Bank</b> moved to Negotiation', w:'Yesterday', read:true },
  ];
  const ntf = pop('crm-p-ntf'), nlist = $('.ntx-list', ntf), nct = $('.ntx-ct', ntf), bell = $('.crm-bell', app); let nf = 'all';
  function paintN(){
    const L = NT.filter(x => nf === 'all' || x.k === nf), n = NT.filter(x => !x.read).length;
    nlist.innerHTML = L.length ? L.map(x => `<button class="ntx-n${x.read ? ' read' : ''}" data-co="${esc(x.co)}"><span class="ic" ${x.ic ? `style="color:${x.col};background:color-mix(in srgb,${x.col} 13%,transparent)"` : ''}>${x.ic ? I(x.ic, 'xs') : av(x.av)}</span><span class="t">${x.t}<span>${x.w}</span></span><span class="u"></span></button>`).join('') : '<div class="ntx-e">Nothing here</div>';
    nct.textContent = n; nct.classList.toggle('z', !n); bell.classList.toggle('read', !n);
    bell.setAttribute('aria-label', n ? `Notifications, ${n} unread` : 'Notifications');
  }
  nlist.addEventListener('click', e => { const b = e.target.closest('.ntx-n'); if (!b) return; const x = NT.find(n => n.co === b.dataset.co); x.read = true; paintN(); const c = CO.find(c => c.n === x.co); setTimeout(() => { if (c){ if (tab === 'forecast') setTab('companies'); openSheet(c.id, true); } }, 140); b.setAttribute('data-close', ''); });
  $('.ntx-all', ntf).onclick = () => { NT.forEach(x => x.read = true); paintN(); };
  seg($('.ntx-tabs .seg2', ntf), v => { nf = v; paintN(); });
  paintN();

  /* ---------- the profile menu: Profile menu, its theme switch drives the site's ---------- */
  const isDark = () => (document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';
  const th = $('#crm-p-me .pfm-th', app);
  onOpen('.crm-me', () => th.setAttribute('aria-checked', isDark()));
  th.onclick = () => { const b = document.querySelector(`[data-theme-set="${isDark() ? 'light' : 'dark'}"]`); if (b) b.click(); th.setAttribute('aria-checked', isDark()); };
  $('#crm-p-me [data-act="help"]', app).addEventListener('click', help);
  $('#crm-p-me [data-act="signout"]', app).addEventListener('click', () => toast('info', 'Still signed in', 'This is a template, so there is no account to leave'));

  /* ---------- search: Command palette ---------- */
  const over = $('.crm-cmd', app), q = $('.cpl-q', over), list = $('.cpl-list', over), st = $('.cpl-st', over);
  list.id = 'crm-cpl'; q.setAttribute('role', 'combobox'); q.setAttribute('aria-expanded', 'true'); q.setAttribute('aria-controls', list.id); q.setAttribute('aria-autocomplete', 'list');
  let items = [], hi = 0, back = null;
  const ACTIONS = () => [
    ['Go to', I('table', 'xs'), 'Companies', 'Table', () => setTab('companies')], ['Go to', I('grid', 'xs'), 'Deals board', 'Board', () => setTab('deals')], ['Go to', I('chart', 'xs'), 'Forecast', 'Charts', () => setTab('forecast')],
    ['Actions', I('plus', 'xs'), 'New company', '', () => newCompany()], ['Actions', I('down', 'xs'), 'Export companies in view', 'CSV', () => exportCsv(view)],
    ['Actions', I('moon', 'xs'), isDark() ? 'Switch to light theme' : 'Switch to dark theme', '', () => th.click()],
    ['Actions', I('flag', 'xs'), 'Show slipping deals', DE.filter(slipping).length + ' deals', () => { K.close = 'overdue'; setTab('deals'); }],
  ];
  function paintCmd(){
    const v = q.value.trim().toLowerCase(), m = s => !v || s.toLowerCase().includes(v);
    const cos = CO.filter(c => m(c.n + ' ' + P[c.own][0] + ' ' + c.seg)).sort((a, b) => b.value - a.value).slice(0, v ? 6 : 4);
    const ds = v ? DE.filter(d => m(d.n + ' ' + coOf(d.co).n + ' ' + d.id)).slice(0, 5) : [];
    const R = [...ACTIONS().filter(a => m(a[2])).map(a => ({ g:a[0], ic:a[1], t:a[2], h:a[3], run:a[4] })),
      ...cos.map(c => ({ g:'Companies', ic:`<span class="pfm-lg">${esc(c.n[0])}</span>`, t:c.n, h:`${kmoney(c.value)}, ${P[c.own][0]}`, run:() => { if (tab === 'forecast') setTab('companies'); openSheet(c.id, true); } })),
      ...ds.map(d => ({ g:'Deals', ic:av(d.own), t:d.n, h:`${coOf(d.co).n}, ${ST[d.st].t}`, run:() => { setTab('deals'); kFocus = d.id; renderBoard(); const el = $(`.kbx-k[data-id="${d.id}"]`, cols); if (el){ el.scrollIntoView({ block:'nearest', inline:'nearest' }); el.classList.add('open'); el.tabIndex = 0; el.focus(); } } }))];
    // the agent-free fallback: a search of the table
    if (v && !R.length) R.push({ g:'Search', ic:I('search', 'xs'), t:`Filter companies by “${q.value.trim()}”`, h:'', run:() => { setTab('companies'); const i = $('.crm-q input', app); i.value = q.value.trim(); i.dispatchEvent(new Event('input')); } });
    let h = '<span class="cpl-hl"></span>', g = '';
    R.forEach((x, i) => { if (x.g !== g){ g = x.g; h += `<div class="cpl-g" role="presentation">${g}</div>`; } h += `<button class="cpl-i" role="option" id="crm-cpl-${i}" tabindex="-1" data-i="${i}"><span class="ic">${x.ic}</span><span class="t">${esc(x.t)}</span>${x.h ? `<span class="h">${esc(x.h)}</span>` : ''}</button>`; });
    list.innerHTML = h; items = R; hi = 0; moveHi(0);
    st.innerHTML = `${R.length} ${R.length === 1 ? 'result' : 'results'}`;
  }
  function moveHi(d){ const bs = $$('.cpl-i', list); if (!bs.length){ q.removeAttribute('aria-activedescendant'); $('.cpl-hl', list).style.opacity = 0; return; } hi = (hi + d + bs.length) % bs.length; bs.forEach((b, i) => { b.classList.toggle('hl', i === hi); b.setAttribute('aria-selected', i === hi); }); const b = bs[hi], hl = $('.cpl-hl', list); hl.style.opacity = 1; hl.style.top = b.offsetTop + 'px'; q.setAttribute('aria-activedescendant', b.id); if (b.offsetTop < list.scrollTop + 30 || b.offsetTop + 36 > list.scrollTop + list.clientHeight) b.scrollIntoView({ block:'nearest' }); }
  const runItem = i => { const x = items[i]; closeCmd(false); if (x) x.run(); };
  function openCmd(){ if (!over.hidden) return; back = document.activeElement; over.hidden = false; q.value = ''; paintCmd(); drawer(false); q.focus(); }
  function closeCmd(restore = true){ if (over.hidden) return; over.hidden = true; if (restore && back && back.isConnected) back.focus({ preventScroll:true }); }
  q.addEventListener('input', paintCmd);
  q.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); moveHi(e.key === 'ArrowDown' ? 1 : -1); } else if (e.key === 'Enter'){ e.preventDefault(); runItem(hi); } else if (e.key === 'Escape'){ e.preventDefault(); closeCmd(); } else if (e.key === 'Tab') e.preventDefault(); });
  list.addEventListener('click', e => { const b = e.target.closest('.cpl-i'); if (b) runItem(+b.dataset.i); });
  list.addEventListener('pointermove', e => { const b = e.target.closest('.cpl-i'); if (b && +b.dataset.i !== hi) moveHi(+b.dataset.i - hi); });
  over.addEventListener('pointerdown', e => { if (e.target === over) closeCmd(); });
  $('.crm-find', app).onclick = openCmd;

  /* ---------- New company: Form ---------- */
  const nd = $('.crm-newd', app), form = $('form', nd), nin = $('[name="n"]', form), vin = $('[name="v"]', form);
  const SEGS = ['Enterprise', 'Mid-market', 'SMB', 'Strategic'];
  let nseg = 'Mid-market', nown = 'JO', nback = null;
  const [segBox, ownBox] = $$('.fmx-ty', form);
  const paintPick = () => {
    segBox.innerHTML = SEGS.map(s => `<button type="button" class="chip sm${s === nseg ? ' on' : ''}" role="radio" aria-checked="${s === nseg}" tabindex="${s === nseg ? 0 : -1}" data-v="${s}">${s}</button>`).join('');
    ownBox.innerHTML = OWN.slice(0, 6).map(o => `<button type="button" class="chip sm${o === nown ? ' on' : ''}" role="radio" aria-checked="${o === nown}" tabindex="${o === nown ? 0 : -1}" data-v="${o}">${av(o)}${first(o)}</button>`).join('');
  };
  [segBox, ownBox].forEach((box, k) => {
    box.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; k ? nown = b.dataset.v : nseg = b.dataset.v; paintPick(); $$('.chip', box).find(x => x.dataset.v === b.dataset.v).focus(); });
    box.addEventListener('keydown', e => { const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0; if (!d) return; e.preventDefault(); const bs = $$('.chip', box), i = bs.findIndex(b => b.getAttribute('aria-checked') === 'true'); bs[(i + d + bs.length) % bs.length].click(); });
  });
  function newCompany(){ nback = document.activeElement; nd.hidden = false; form.reset(); $$('.fmx-f', form).forEach(f => { f.classList.remove('bad'); $('.er', f)?.remove(); }); paintPick(); drawer(false); setTimeout(() => nin.focus(), 30); }
  const closeNew = () => { if (nd.hidden) return; nd.hidden = true; if (nback && nback.isConnected) nback.focus({ preventScroll:true }); };
  $('.crm-new', app).onclick = newCompany;
  $('.crm-newx', form).onclick = closeNew;
  nd.addEventListener('pointerdown', e => { if (e.target === nd) closeNew(); });
  form.addEventListener('keydown', e => { if (e.key === 'Escape'){ e.preventDefault(); closeNew(); } });
  vin.addEventListener('blur', () => { const n = +vin.value.replace(/[^\d.]/g, ''); if (n) vin.value = money(n < 1000 ? n * 1000 : n); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = nin.value.trim(), f = nin.closest('.fmx-f');
    $('.er', f)?.remove(); f.classList.toggle('bad', !name);
    if (!name){ f.insertAdjacentHTML('beforeend', '<span class="er">Give the company a name</span>'); nin.setAttribute('aria-invalid', 'true'); nin.focus(); return; }
    if (CO.some(c => c.n.toLowerCase() === name.toLowerCase())){ f.classList.add('bad'); f.insertAdjacentHTML('beforeend', `<span class="er">${esc(name)} is already in the table</span>`); nin.focus(); return; }
    nin.removeAttribute('aria-invalid');
    let v = +vin.value.replace(/[^\d.]/g, '') || 25000; if (v < 1000) v *= 1000;
    const c = { id:'c' + (nid++), n:name, seg:nseg, tags:['New logo'], own:nown, reg:'na', last:0, lt:'Discovery', trend:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], log:[['Discovery', 0, 'Company added by Nina Cole', 'Nina Cole']] };
    CO.push(c); const d = { id:'DL-' + (did++), co:c.id, n:'First contract', st:'disc', v, close:60, adj:0, own:nown }; d.p = probOf(d); DE.push(d); derive();
    nd.hidden = true; clearFilters(); setTab('companies'); refresh();
    const tr = $(`tr[data-id="${c.id}"]`, tbody); if (tr){ tr.scrollIntoView({ block:'nearest' }); enter(tr); focusRow(tr); }
    toast('ok', `${name} added`, `${P[nown][0]} owns it, with a ${money(v)} deal in Discovery`, { label:'Open', run:() => openSheet(c.id, true) });
  });

  /* ---------- keys: ⌘K, /, Escape ---------- */
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); over.hidden ? openCmd() : closeCmd(); return; }
    if (e.key === 'Escape'){
      if ($('.pop.open', app)) return; // the core shuts the open menu first
      if (!over.hidden){ closeCmd(); return; }
      if (!nd.hidden){ closeNew(); return; }
      if (app.classList.contains('dr')){ drawer(false); $('.crm-menu', app).focus(); return; }
      if (sheetFor){ closeSheet(); return; }
      if (sel.size && tab === 'companies'){ sel.clear(); syncSel(); }
      return;
    }
    const typing = e.target.closest && e.target.closest('input,textarea,[contenteditable="true"]');
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '/' && over.hidden && nd.hidden){ e.preventDefault(); if (tab === 'deals') kq.focus(); else { setTab('companies'); $('.crm-q input', app).focus(); } }
    if (e.key === '?' && over.hidden && nd.hidden){ e.preventDefault(); help(); }
  }, true);

  /* ---------- everything follows the data ---------- */
  function refresh(){ derive(); renderTable(); renderBoard(); if (tab === 'forecast') renderForecast(); if (sheetFor) renderSheet(); counts(); }
  const tsc = $('.crm-sc', app); tsc.addEventListener('scroll', () => tsc.classList.toggle('sx', tsc.scrollLeft > 2), { passive:true });
  // the company column sticks right after the checkbox column, however wide that column comes out, so nothing shows between them
  const stk = $('.crm-t th.stk', app); new ResizeObserver(() => $('.crm-t', app).style.setProperty('--crm-stk', stk.getBoundingClientRect().width + 'px')).observe(stk);
  derive(); renderTable(); renderBoard(); setTab('companies'); stagger($$('tr[data-id]', tbody).slice(0, 16), 22);
  // a link to a company (#c3) opens it
  const h = location.hash.slice(1); if (h && coOf(h)) openSheet(h);
  // the knob and the board's columns are placed once the fonts are in
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
})();
