/* Fundraising CRM template: a founder's Series A workspace with an agent beside them. It runs after the shared core (core.js),
   so it uses the core's helpers ($, $$, I, swap, tween, enter, stagger, seg, html) and its popovers (data-pop) and tooltips
   (data-tip). The funds, partners, connectors, meetings, data room views and term sheets are made up; everything else is worked
   out from them: a fund's fit from its thesis, cheque range, stage focus, conflicts and the warmest path to it; what is committed
   from the funds in Committed; who has gone quiet from the data room's views; the agent's drafts, flags and risks from the same
   data. Moving a fund, approving a draft or accepting a term sheet changes the data, so every view shows the same numbers. */
(() => {
  const app = document.querySelector('.fr'); if (!app) return;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const sum = (a, f = x => x) => a.reduce((t, x) => t + f(x), 0);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const plural = (n, a, b = a + 's') => `${n} ${n === 1 ? a : b}`;
  const r2 = v => Math.round(v * 100) / 100;
  // money is held in millions of dollars: $7M, $1.75M, $750k
  const M = v => { v = r2(v); return Math.abs(v) >= 1 || v === 0 ? '$' + parseFloat(v.toFixed(2)) + 'M' : '$' + Math.round(v * 1000) + 'k'; };
  const andList = a => a.length > 1 ? a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1] : a[0] || '';
  const seeded = s => () => (s = (s * 16807) % 2147483647) / 2147483647;

  /* ---------- dates: days from today, so the screen always reads as current ---------- */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dateOf = n => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };
  const DAYN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], DAYL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dow = n => dateOf(n).getDay(), isWork = n => dow(n) > 0 && dow(n) < 6;
  const fmtD = n => dateOf(n).toLocaleDateString('en-US', { month:'short', day:'numeric' });
  const fmtDW = n => DAYN[dow(n)] + ' ' + fmtD(n);
  // a day in the past moves back to the working day before it, a day ahead forward to the next
  const toWork = n => { while (!isWork(n)) n += n > 0 ? 1 : -1; return n; };
  const workAfter = (n, k) => { let d = n; while (k > 0){ d++; if (isWork(d)) k--; } return d; };
  const ago = n => n <= 0 ? 'today' : n === 1 ? 'yesterday' : n + ' days ago';
  const inDays = n => n <= 0 ? 'today' : n === 1 ? 'tomorrow' : 'in ' + n + ' days';
  const tm = h => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60); return `${hh > 12 ? hh - 12 : hh}:${String(mm).padStart(2, '0')}`; };
  const tmA = h => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60); return `${hh > 12 ? hh - 12 : hh}${mm ? ':' + String(mm).padStart(2, '0') : ''}${hh >= 12 ? 'pm' : 'am'}`; };
  // the raise: kicked off seven weeks ago, closing in six
  const KICK = -49, CLOSE = 42, TARGET = 10, MAX = 12, POOL0 = .06;

  /* ---------- us: the founders, and the people who can make an intro ---------- */
  const TEAM = { AB:{ n:'Ada Brennan', c:'l', r:'CEO' }, SO:{ n:'Sam Okafor', c:'t', r:'CTO' } };
  const CON = {
    JP:{ n:'Jonah Pryce', c:'b', r:'Partner at Fernhill Capital, our seed lead' }, MT:{ n:'Mei Tanaka', c:'k', r:'Angel, our first cheque' },
    OH:{ n:'Owen Hale', c:'p', r:'Advisor, ran operations at a freight company' }, LF:{ n:'Lucia Ferro', c:'m', r:'Founder of Keelson' },
    DR:{ n:'Daniel Roux', c:'y', r:'CFO at Harlow Foods, a customer' }, NS:{ n:'Nadia Sorensen', c:'r', r:'Former colleague, now an operator in residence' } };
  const ini = n => n.split(' ').map(w => w[0]).join('');
  const avc = (n, c, cls = '') => `<span class="av${cls ? ' ' + cls : ''}" style="background:var(--dm-av-${c});color:var(--dm-av-${c}-ink)" aria-hidden="true">${ini(n)}</span>`;
  const avT = (id, cls) => avc(TEAM[id].n, TEAM[id].c, cls), avC = (id, cls) => avc(CON[id].n, CON[id].c, cls);
  const first = n => n.split(' ')[0];

  /* ---------- stages, sectors and what a fund backs ---------- */
  // a stage is a label, so each keeps one core tag colour wherever it shows
  const STAGES = [{ k:'res', t:'Researching', c:'y', p:.02 }, { k:'intro', t:'Intro asked', c:'p', p:.05 }, { k:'first', t:'First meeting', c:'b', p:.1 },
    { k:'partner', t:'Partner meeting', c:'l', p:.25 }, { k:'dd', t:'Diligence', c:'t', p:.45 }, { k:'ts', t:'Term sheet', c:'k', p:.75 },
    { k:'in', t:'Committed', c:'m', p:1 }, { k:'out', t:'Passed', c:'r', p:0 }];
  const ST = Object.fromEntries(STAGES.map((s, i) => [s.k, { ...s, i }]));
  const ACTIVE = ['res', 'intro', 'first', 'partner', 'dd', 'ts'];
  const stag = k => `<span class="tag ${ST[k].c}">${ST[k].t}</span>`;
  const SECT = { a:['AI agents', 'b'], s:['Supply chain', 't'], e:['Enterprise SaaS', 'l'], v:['Vertical AI', 'k'], f:['Fintech', 'y'], c:['Climate', 'm'], d:['Dev tools', 'p'], h:['Health', 'r'] };
  const OURS = ['a', 's', 'e', 'v'];
  const SECTL = { a:'AI agents', s:'supply chain', e:'enterprise SaaS', v:'vertical AI', f:'fintech', c:'climate', d:'dev tools', h:'health' };
  const sectag = k => `<span class="tag ${SECT[k][1]}">${SECT[k][0]}</span>`;
  const FOCUS = { S:'Seed', SA:'Seed and Series A', A:'Series A', AB:'Series A and B', B:'Series B and later' };

  /* ---------- the funds (made up) ---------- */
  // name, city, leads rounds, cheque from and to ($M), sectors, stage focus, a portfolio company that competes with us, stage,
  // the cheque we expect ($M), and which founder runs the relationship
  const RAW = [
    ['Fernhill Capital', 'Austin', 1, 1, 4, 'aev', 'SA', '', 'in', 1.5, 'AB'], ['Ashgrove Partners', 'Denver', 0, .25, 1, 'as', 'SA', '', 'in', .5, 'AB'],
    ['Saltgrass Ventures', 'Chicago', 0, .5, 2, 'se', 'A', '', 'in', 1, 'SO'], ['Ninefold Capital', 'Seattle', 0, .5, 1.5, 'ad', 'A', '', 'in', .75, 'AB'],
    ['Larchmont Ventures', 'San Francisco', 1, 5, 10, 'aev', 'A', '', 'ts', 7, 'AB'], ['Copperline Ventures', 'New York', 1, 6, 12, 'ase', 'AB', '', 'ts', 8, 'AB'],
    ['Northwind Capital', 'Boston', 1, 4, 8, 'se', 'A', '', 'dd', 6, 'AB'], ['Halden Ridge', 'London', 1, 3, 7, 'av', 'A', '', 'dd', 5, 'SO'],
    ['Quarry Lane Partners', 'San Francisco', 0, 1, 3, 'ae', 'AB', '', 'dd', 2, 'SO'], ['Stonecrop Ventures', 'New York', 1, 5, 10, 'se', 'A', 'Routewell', 'partner', 6, 'AB'],
    ['Wrenhaven Ventures', 'Los Angeles', 0, 1, 3, 'av', 'SA', '', 'partner', 1.5, 'SO'], ['Marlow Point Capital', 'Boston', 1, 4, 9, 'aes', 'A', '', 'partner', 5, 'AB'],
    ['Juniper Hollow Ventures', 'Austin', 0, .5, 2, 'sc', 'SA', '', 'partner', 1, 'SO'], ['Linden Row Partners', 'London', 1, 3, 8, 'ev', 'AB', '', 'partner', 5, 'AB'],
    ['Corran Bay Capital', 'Toronto', 0, 1, 2.5, 'ad', 'A', '', 'partner', 1.5, 'SO'], ['Glassmere Fund', 'Berlin', 1, 3, 6, 'av', 'A', '', 'first', 4, 'AB'],
    ['Amberfield Capital', 'San Francisco', 0, 1, 3, 'ae', 'SA', '', 'first', 2, 'SO'], ['Coldharbour Ventures', 'London', 1, 4, 10, 'es', 'AB', 'Stockbird', 'first', 6, 'AB'],
    ['Petrel Partners', 'Boston', 0, .5, 1.5, 'ah', 'SA', '', 'first', 1, 'SO'], ['Highmoor Ventures', 'Chicago', 1, 2, 5, 'sc', 'A', '', 'first', 3, 'AB'],
    ['Sablewood Partners', 'New York', 0, 1, 2, 'fe', 'A', '', 'first', 1, 'SO'], ['Oxlip Capital', 'Paris', 0, 1, 3, 'av', 'SA', '', 'first', 2, 'AB'],
    ['Duneholm Ventures', 'Amsterdam', 1, 3, 6, 'es', 'A', '', 'first', 4, 'SO'], ['Ollerton Capital', 'San Francisco', 1, 5, 12, 'ad', 'AB', '', 'intro', 6, 'AB'],
    ['Bellstrand Ventures', 'New York', 0, 1, 2, 'se', 'A', '', 'intro', 1, 'SO'], ['Ravenmoor Capital', 'London', 1, 4, 8, 'av', 'A', '', 'intro', 5, 'AB'],
    ['Quillfeather Capital', 'Austin', 0, .5, 1.5, 'fs', 'SA', '', 'intro', 1, 'SO'], ['Starling Gate Ventures', 'Boston', 1, 3, 7, 'ev', 'A', '', 'intro', 4, 'AB'],
    ['Wychwood Partners', 'Seattle', 0, 1, 3, 'ac', 'A', '', 'intro', 1.5, 'SO'], ['Ember Isle Capital', 'Miami', 0, .5, 2, 'fe', 'SA', '', 'intro', 1, 'AB'],
    ['Tidereach Partners', 'San Francisco', 1, 6, 15, 'ae', 'AB', '', 'res', 8, 'AB'], ['Kelderwick Ventures', 'Berlin', 0, 1, 3, 'as', 'A', '', 'res', 2, 'SO'],
    ['Harrowgate Ventures', 'New York', 1, 4, 10, 'sv', 'A', '', 'res', 6, 'AB'], ['Fallowmere Ventures', 'London', 0, 1, 2, 'cd', 'SA', '', 'res', 1, 'SO'],
    ['Thistledown Capital', 'Boston', 1, 3, 8, 'aev', 'A', '', 'res', 5, 'AB'], ['Morrow Hill Partners', 'Chicago', 0, .5, 1, 'eh', 'S', '', 'res', .5, 'SO'],
    ['Brightling Ventures', 'Los Angeles', 1, 5, 10, 'av', 'AB', '', 'res', 6, 'AB'], ['Cinderford Capital', 'Toronto', 0, 1, 3, 'sf', 'A', '', 'res', 1.5, 'SO'],
    ['Brackwater Partners', 'New York', 1, 5, 10, 'se', 'A', 'Routewell', 'out', 6, 'AB'], ['Kittering Ventures', 'San Francisco', 1, 8, 20, 'ae', 'B', '', 'out', 10, 'AB'],
    ['Meridale Capital', 'Boston', 0, 1, 2, 'fh', 'S', '', 'out', 1, 'SO'], ['Pellmore Growth', 'London', 1, 10, 25, 'e', 'B', '', 'out', 12, 'AB'],
  ];
  // why the passed funds passed, and how far each got
  const PASS = { 'Brackwater Partners':['partner', 'They back Routewell, which competes with us'], 'Kittering Ventures':['first', 'Too early for them: they lead at $5M ARR'],
    'Meridale Capital':['intro', 'Outside their thesis'], 'Pellmore Growth':['first', 'Series B and later only'] };
  // what is committed: amount, hard (signed) or soft-circled, and the day it came in
  const COMMIT = { 'Fernhill Capital':[1.5, true, -20], 'Ashgrove Partners':[.5, true, -16], 'Saltgrass Ventures':[1, false, -6], 'Ninefold Capital':[.75, false, -3] };
  // the term sheets: amount and pre-money ($M), the option pool top-up and whether it comes before the round, liquidation
  // preference and participation, the board, pro-rata, the no-shop in days, and the days it was received and expires
  const TERMS = {
    'Larchmont Ventures':{ amt:7, pre:42, pool:.10, poolPre:false, pref:'1x', part:'None', board:'2 founders, 1 Larchmont', prorata:'Major investors', noShop:30, rec:-6, exp:4 },
    'Copperline Ventures':{ amt:8, pre:40, pool:.15, poolPre:true, pref:'1x', part:'Participating, capped at 3x', board:'2 founders, 2 Copperline, 1 independent', prorata:'All investors', noShop:45, rec:-4, exp:3 } };
  // the funds that have gone quiet in the data room, and for how long
  const QUIET = { 'Northwind Capital':9, 'Linden Row Partners':12, 'Corran Bay Capital':8 };
  const FN = ['Lena', 'Marcus', 'Priya', 'Tomas', 'Grace', 'Omar', 'Hana', 'Luis', 'Sofia', 'Ben', 'Aisha', 'Noah', 'Yuki', 'Carla', 'Felix', 'Amara', 'Jonas', 'Leah', 'Ravi', 'Ines', 'Elliot', 'Maren', 'Kofi', 'Zara', 'Hugo', 'Nina', 'Isaac', 'Freya', 'Malik', 'Ivy', 'Rohan', 'Clara', 'Emil', 'Sana', 'Victor', 'Esme', 'Arjun', 'Tess', 'Callum', 'Rosa', 'Idris'];
  const LN = ['Park', 'Lindqvist', 'Moreau', 'Baker', 'Osei', 'Fischer', 'Romero', 'Walsh', 'Haddad', 'Costa', 'Ikeda', 'Varga', 'Larsen', 'Duarte', 'Okoye', 'Nakamura', 'Reyes', 'Hart', 'Sato', 'Klein', 'Novak', 'Quinn', 'Abbott', 'Mercer', 'Vance', 'Iqbal', 'Solberg', 'Achebe', 'Pereira', 'Lowe', 'Strand', 'Bauer', 'Ferris', 'Amari', 'Doyle', 'Kaur', 'Wilde'];
  const ROLES = ['General partner', 'Principal', 'Associate'];
  const AVS = ['b', 'm', 'p', 'y', 'k', 'r', 't', 'l'];
  const PORT = ['Quaystone', 'Halyard AI', 'Pivotwell', 'Sundial Ops', 'Lumora', 'Tessel', 'Fernway', 'Crateful', 'Inkline', 'Vantwise', 'Larkpoint', 'Mapletrace', 'Ploughshare', 'Ravelstack', 'Hollowtree', 'Corvane', 'Brightpath', 'Gridleaf', 'Parcelry', 'Kilnworks', 'Mosswell', 'Bramble Health', 'Orbitly', 'Tarnwick'];
  const RIVAL = { Routewell:'AI planning for freight and warehouses', Stockbird:'inventory agents for retailers' };
  const EXTRA = ['They like founders who sold into operations teams before.', 'They want a clear path to $100M in revenue.', 'They back technical founders early and stay through the B.',
    'They look for usage-based pricing that grows with the customer.', 'They favour companies with design partners in Europe and the US.', 'They avoid businesses with heavy services revenue.'];
  const used = new Set(); let pid = 0;
  const personName = (i, k) => { for (let t = 0; t < 40; t++){ const n = FN[(i * 3 + k * 11 + t) % FN.length] + ' ' + LN[(i * 7 + k * 5 + t * 3) % LN.length]; if (!used.has(n)){ used.add(n); return n; } } return 'Alex Moss'; };
  let FUNDS = RAW.map((r, i) => {
    const f = { id:'f' + i, i, n:r[0], city:r[1], leads:!!r[2], min:r[3], max:r[4], sec:[...r[5]], focus:r[6], conflict:r[7] || null, st:r[8], ask:r[9], own:r[10], log:[] };
    f.ppl = Array.from({ length:2 + i % 2 }, (_, k) => ({ id:'p' + (pid++), n:personName(i, k), r:ROLES[k], c:AVS[(i * 3 + k * 5) % 8], f:f.id }));
    f.lead = 0;
    f.port = Array.from({ length:4 + i % 3 }, (_, k) => PORT[(i * 5 + k * 7) % PORT.length]).filter((v, k, a) => a.indexOf(v) === k);
    if (f.conflict) f.port.splice(1, 0, f.conflict);
    f.thesis = `${f.leads ? 'Leads' : 'Joins'} ${FOCUS[f.focus]} rounds in ${andList(f.sec.map(s => SECTL[s]))}, with cheques of ${M(f.min)} to ${M(f.max)}. ${EXTRA[i % EXTRA.length]}`;
    if (PASS[f.n]){ f.reached = PASS[f.n][0]; f.why = PASS[f.n][1]; }
    if (COMMIT[f.n]){ const [a, h, d] = COMMIT[f.n]; f.commit = { amt:a, hard:h, day:d }; }
    if (TERMS[f.n]){ f.ts = { ...TERMS[f.n] }; f.ts.exp = toWork(f.ts.exp); f.ts.rec = toWork(f.ts.rec); }
    return f;
  });
  const fundOf = id => FUNDS.find(f => f.id === id);
  const fundBy = n => FUNDS.find(f => f.n === n);
  const short = f => f.n.replace(/ (Capital|Ventures|Partners|Fund|Growth)$/, '');
  const tile = (f, cls = '') => `<span class="pfm-lg${cls ? ' ' + cls : ''}" aria-hidden="true">${esc(f.n[0])}</span>`;
  const leadOf = f => f.ppl[f.lead];
  const avP = (p, cls) => avc(p.n, p.c, cls);
  // how far a fund got: its stage, or for a passed fund the stage it reached
  const reachIdx = f => f.st === 'out' ? ST[f.reached || 'res'].i : ST[f.st].i;

  /* ---------- warm paths: who in our network knows a partner, and how well ---------- */
  const bestPath = f => f.paths.slice().sort((x, y) => y.s - x.s || (x.to - y.to))[0] || null;
  const CK = Object.keys(CON), COLD = ['Morrow Hill Partners', 'Cinderford Capital'];
  FUNDS.forEach(f => {
    const i = f.i;
    if (f.n === 'Fernhill Capital'){ f.paths = []; f.intro = 'existing'; return; }
    if (COLD.includes(f.n)){ f.paths = []; f.intro = 'cold'; return; }
    const a = CK[(i * 5 + 1) % 6]; let b = CK[(i * 2 + 3) % 6]; if (b === a) b = CK[(i * 2 + 4) % 6];
    f.paths = [{ via:a, to:0, s:1 + (i * 7) % 3 }, { via:b, to:f.ppl.length > 2 ? 1 : 0, s:1 + (i + 2) % 3 }];
    if (f.n === 'Ashgrove Partners') f.paths[0] = { via:'JP', to:0, s:3 };
    f.intro = f.st === 'res' ? 'none' : reachIdx(f) === 1 ? 'asked' : 'made';
    if (f.st !== 'res') f.via = bestPath(f).via;
  });
  const STR = { 3:['Strong', 'high'], 2:['Good', 'med'], 1:['Weak', 'low'] };
  const strength = s => `<span class="fr-str" data-tip="${STR[s][0]} tie"><span class="kbx-pb" data-p="${STR[s][1]}" aria-hidden="true"><i></i><i></i><i></i></span><span>${STR[s][0]}</span></span>`;

  /* ---------- meetings: what each fund's stage says has happened, and what is booked ---------- */
  let MT = [], mid = 1;
  const KINDS = { first:['First meeting', .75, 'b'], partner:['Partner meeting', 1, 'l'], dd:['Diligence call', 1, 't'], ref:['Reference call', .75, 'k'] };
  const NOTES = {
    first:[p => `${p} liked the planning agent demo and asked how we price per site.`, p => `${p} pushed on gross margin. We walked through the path to 72%.`, p => `${p} wants retention by cohort before taking it to the partners.`, p => `${p} asked how much of the pilot work is services. Sent the breakdown after.`],
    partner:[p => `Full partnership. Questions on sales cycle length and the two European pilots. ${p} is the champion.`, p => `${p} presented it. One partner worried about services revenue, the rest were keen.`, p => `Good energy in the room. ${p} asked for two customer calls before diligence.`],
    dd:[p => `Walked ${p} through the model. They want cohort retention by quarter.`, p => `Customer call with Harlow Foods went well. ${p} wants one more reference.`, p => `Security and data review with ${p}. No blockers, a few questions on SOC 2 timing.`] };
  const busy = (day, h, dur, skip) => MT.some(m => m !== skip && m.day === day && h < m.h + m.dur && m.h < h + dur);
  const slot = (day, h, dur) => { for (let t = h, n = 0; n < 18; n++, t = 9 + ((t - 9 + 1.5) % 8.5)) if (!busy(day, t, dur)) return t; return h; };
  const meet = o => { const [kind, dur] = KINDS[o.k]; const m = { id:'m' + (mid++), kind, dur, st:o.day < 0 ? 'held' : 'plan', who:[o.own], ...o }; m.h = slot(m.day, m.h, m.dur); MT.push(m); return m; };
  // first meetings run through the raise, the funds furthest along first; partner meetings and diligence follow, so the
  // weeks fill up as the raise goes on
  const upFirst = f => f.st === 'first' && f.i % 2 === 1;
  const ORDER = FUNDS.filter(f => reachIdx(f) >= 2 && !upFirst(f) && f.st !== 'first').sort((a, b) => reachIdx(b) - reachIdx(a) || a.i - b.i);
  FUNDS.forEach(f => {
    const i = f.i, k = reachIdx(f), p = first(leadOf(f).n), hr = 9 + ((i * 5) % 14) / 2;
    if (k < 1) return;
    if (k === 1){ f.introDay = toWork(-2 - (i % 9)); return; }
    const j = ORDER.indexOf(f), up = upFirst(f);
    const d1 = up ? workAfter(0, 1 + i % 5) : f.st === 'first' ? toWork(-3 - (i % 5)) : toWork(-45 + Math.round(j * 33 / Math.max(1, ORDER.length - 1)));
    f.introDay = up ? toWork(-4 - (i % 6)) : toWork(d1 - 7 - (i % 4));
    const m = meet({ f:f.id, k:'first', day:d1, h:hr, own:f.own });
    if (!up) m.note = NOTES.first[i % 4](p);
    if (k >= 3){
      const up2 = f.st === 'partner' && i % 3 === 0;
      const d2 = up2 ? workAfter(0, 2 + i % 4) : toWork(Math.min(d1 + 9 + (i % 5), -2 - (i % 4)));
      const m2 = meet({ f:f.id, k:'partner', day:d2, h:10 + (i % 6), own:'AB' }); m2.who = ['AB', 'SO'];
      if (!up2) m2.note = NOTES.partner[i % 3](p);
      if (k >= 4){
        const d3 = toWork(Math.min(d2 + 6, -4)), d4 = toWork(Math.min(d2 + 11, -1));
        [d3, d4].forEach((d, jj) => { const x = meet({ f:f.id, k:'dd', day:d, h:11 + ((i + jj * 3) % 5), own:jj ? 'SO' : 'AB' }); x.note = NOTES.dd[(i + jj) % 3](p); });
      }
    }
  });
  FUNDS.filter(f => f.st === 'out').forEach(f => { const d = MT.filter(m => m.f === f.id).map(m => m.day); f.passDay = Math.min(-1, Math.max(f.introDay + 5, ...d.map(x => x + 4))); });
  // what is booked ahead: diligence calls, a reference call for the term sheet we lean to, and a few partner meetings
  [['Halden Ridge', 'dd', 2, 14], ['Quarry Lane Partners', 'dd', 3, 11], ['Larchmont Ventures', 'ref', 1, 16], ['Copperline Ventures', 'ref', 2, 9.5], ['Fernhill Capital', 'ref', 4, 15]].forEach(([n, k, w, h]) => { const f = fundBy(n); meet({ f:f.id, k, day:workAfter(0, w), h, own:'AB' }); });
  const meetsOf = f => MT.filter(m => m.f === f.id).sort((a, b) => a.day - b.day || a.h - b.h);

  /* ---------- the data room: documents, and who read what, for how long ---------- */
  const DOCS = [
    { id:'deck', l:'the Series A deck', n:'Series A deck', fo:'Deck and memo', ic:'file-text', meta:'24 pages, version 7', size:24, need:2, base:420 },
    { id:'memo', l:'the investment memo', n:'Investment memo', fo:'Deck and memo', ic:'file-text', meta:'9 pages', size:9, need:3, base:360 },
    { id:'model', l:'the financial model', n:'Financial model', fo:'Financials', ic:'table', meta:'6 tabs', size:6, need:3, base:840 },
    { id:'metrics', l:'the October metrics', n:'Monthly metrics, October', fo:'Financials', ic:'chart', meta:'12 pages', size:12, need:3, base:300 },
    { id:'cap', l:'the cap table', n:'Cap table', fo:'Financials', ic:'table', meta:'2 tabs', size:2, need:4, base:140 },
    { id:'demo', l:'the product demo', n:'Product demo', fo:'Product', ic:'play', meta:'14 minutes', size:14, need:2, base:540 },
    { id:'road', l:'the 2027 roadmap', n:'Roadmap 2027', fo:'Product', ic:'file-text', meta:'8 pages', size:8, need:3, base:240 },
    { id:'refs', l:'the customer references', n:'Customer references', fo:'Customers', ic:'users', meta:'3 pages', size:3, need:4, base:180 },
    { id:'contracts', l:'the contract summaries', n:'Contract summaries', fo:'Customers', ic:'file-text', meta:'6 pages', size:6, need:4, base:300 },
    { id:'sec', l:'the security overview', n:'Security overview', fo:'Legal and security', ic:'shield', meta:'11 pages', size:11, need:4, base:360 },
    { id:'inc', l:'the incorporation documents', n:'Incorporation documents', fo:'Legal and security', ic:'file-text', meta:'18 pages', size:18, need:5, base:120 } ];
  const FOLDERS = [...new Set(DOCS.map(d => d.fo))];
  const docOf = id => DOCS.find(d => d.id === id);
  // each view: the fund, the person, the document, the day, the seconds spent and how much of it they read
  let VW = [];
  FUNDS.forEach(f => {
    const k = f.st === 'in' ? 6 : reachIdx(f); if (k < 2) return;
    const fm = meetsOf(f).find(m => m.kind === 'First meeting'); if (!fm) return;
    const from0 = fm.st === 'held' ? fm.day : -4 - (f.i % 3), to = QUIET[f.n] ? -QUIET[f.n] : f.st === 'out' ? f.passDay : -(f.i % 3);
    const from = Math.min(from0, to - 2), r = seeded(f.i * 7919 + 13), kk = Math.min(k, 5);
    DOCS.filter(d => d.need <= kk || (QUIET[f.n] === 9 && d.id === 'memo')).forEach(d => {
      if (QUIET[f.n] === 9 && !['deck', 'model', 'memo'].includes(d.id)) return;
      f.ppl.forEach((p, pi) => {
        if (pi && r() < (d.need >= 4 ? .3 : .55)) return;
        const n = 1 + Math.floor(r() * (pi ? 2 : 3));
        for (let j = 0; j < n; j++){
          const day = Math.round(from + (to - from) * (n === 1 ? r() * .6 + .4 : j / (n - 1)));
          VW.push({ f:f.id, p:p.id, d:d.id, day:Math.min(0, Math.max(from, day)), s:Math.round(d.base * (.45 + r() * .9)), rd:clamp(.35 + r() * .75, .2, 1) });
        }
      });
    });
    // a quiet fund's last view is the deck
    if (QUIET[f.n]) VW.push({ f:f.id, p:leadOf(f).id, d:'deck', day:-QUIET[f.n], s:260, rd:.6 });
    else if (f.st !== 'out') VW.push({ f:f.id, p:leadOf(f).id, d:kk >= 3 ? 'model' : 'deck', day:to, s:Math.round(300 + r() * 400), rd:.8 });
  });
  const personOf = id => { for (const f of FUNDS){ const p = f.ppl.find(x => x.id === id); if (p) return p; } return null; };
  const viewsOf = f => VW.filter(v => v.f === f.id);
  const lastView = f => { const v = viewsOf(f); return v.length ? -Math.max(...v.map(x => x.day)) : null; };
  const lastDoc = f => { const v = viewsOf(f).sort((a, b) => b.day - a.day)[0]; return v ? docOf(v.d) : null; };
  const mins = s => s >= 3600 ? `${Math.floor(s / 3600)}h ${Math.round(s % 3600 / 60)}m` : `${Math.max(1, Math.round(s / 60))}m`;
  // quiet: still in play past the first meeting, with the room open, and no views in seven days or more
  const quietDays = f => { if (!['first', 'partner', 'dd', 'ts'].includes(f.st)) return 0; const l = lastView(f); return l != null && l >= 7 ? l : 0; };

  /* ---------- fit: thesis, cheque, stage focus, conflicts and the warmest path, out of 100 ---------- */
  const FITC = ['var(--dm-c1)', 'var(--dm-c2)', 'var(--dm-c3)', 'var(--dm-c4)', 'var(--dm-c5)'];
  function fitOf(f){
    const ov = f.sec.filter(s => OURS.includes(s)), bp = bestPath(f);
    const thesis = [6, 18, 28, 35][Math.min(3, ov.length)];
    const cheque = f.leads ? (f.max >= 8 ? 25 : f.max >= 6 ? 21 : f.max >= 4 ? 15 : 9) : (f.min <= 1 ? 16 : f.min <= 2 ? 12 : 6);
    const stage = { A:15, AB:12, SA:11, S:3, B:2 }[f.focus];
    const conf = f.conflict ? 0 : 15;
    const warm = f.intro === 'existing' ? 10 : bp ? [0, 4, 7, 10][bp.s] : 0;
    const F = [
      { n:'Thesis', w:35, e:thesis, note:ov.length ? `Backs ${andList(ov.map(s => SECT[s][0]))}` : 'None of our sectors' },
      { n:'Cheque size', w:25, e:cheque, note:f.leads ? `Leads with ${M(f.min)} to ${M(f.max)}` : `Follows with ${M(f.min)} to ${M(f.max)}` },
      { n:'Stage focus', w:15, e:stage, note:FOCUS[f.focus] },
      { n:'Conflicts', w:15, e:conf, note:f.conflict ? `Backs ${f.conflict}, a competitor` : 'No competing portfolio company' },
      { n:'Warm path', w:10, e:warm, note:f.intro === 'existing' ? 'Already an investor' : bp ? `${STR[bp.s][0]} tie through ${CON[bp.via].n}` : 'No one in our network knows them' } ];
    return { F, v:sum(F, x => x.e) };
  }
  FUNDS.forEach(f => f.fit = fitOf(f).v);

  /* ---------- the agent's inbox: drafts and fixes, built from the data ---------- */
  let IB = [];
  const pitch = 'Loomwise builds AI agents that plan supply for food and retail operators. Revenue is up 3.4x this year, with 14 customers in the US and Europe, and we are raising a $10M Series A.';
  function buildInbox(){
    FUNDS.filter(f => f.st === 'res').forEach(f => {
      const bp = bestPath(f), p = bp ? f.ppl[bp.to] : leadOf(f);
      if (bp) IB.push({ id:'ib-i-' + f.id, kind:'intro', f:f.id, via:bp.via, to:p.id, state:'wait', subj:`Intro to ${p.n} at ${f.n}?`,
        body:`Hi ${first(CON[bp.via].n)},\n\nWould you be up for introducing me to ${p.n} at ${f.n}? They ${f.leads ? 'lead' : 'join'} ${FOCUS[f.focus]} rounds in ${SECTL[f.sec[0]]}, and I think we are a strong fit.\n\nA short blurb you can forward:\n${pitch}\n\nThank you,\nAda` });
      else IB.push({ id:'ib-c-' + f.id, kind:'intro', f:f.id, via:null, to:p.id, state:'wait', subj:`Loomwise, Series A`,
        body:`Hi ${first(p.n)},\n\n${pitch}\n\nI saw ${f.n} back ${f.port[0]} and thought our work on planning would interest you. Could I send the deck?\n\nBest,\nAda` });
    });
    MT.filter(m => m.st === 'held' && m.day >= -4 && (m.kind === 'First meeting' || m.kind === 'Partner meeting')).forEach(m => { const f = fundOf(m.f); if (!ACTIVE.includes(f.st)) return; const p = leadOf(f);
      IB.push({ id:'ib-f-' + m.id, kind:'follow', f:f.id, to:p.id, state:'wait', subj:`Thank you, and what you asked for`,
        body:`Hi ${first(p.n)},\n\nThank you for the time ${m.day === -1 ? 'yesterday' : 'on ' + DAYL[dow(m.day)]}. As promised, the ${m.kind === 'First meeting' ? 'cohort retention and the pricing per site' : 'two customer contacts and the services breakdown'} are now in the data room.\n\nHappy to set up ${m.kind === 'First meeting' ? 'time with the partnership' : 'diligence calls'} whenever suits.\n\nBest,\nAda` }); });
    FUNDS.filter(f => quietDays(f)).forEach(f => { const p = leadOf(f), d = lastDoc(f);
      IB.push({ id:'ib-n-' + f.id, kind:'nudge', f:f.id, to:p.id, state:'wait', subj:`October numbers are in`,
        body:`Hi ${first(p.n)},\n\nQuick update: October closed at 3.4x revenue year on year, and two new customers went live. The numbers are in the data room next to ${d ? d.l : 'the deck'}.\n\nWe expect to pick a lead within two weeks. Is there anything you need from us?\n\nBest,\nAda` }); });
    FUNDS.filter(f => f.st === 'first' && meetsOf(f).some(m => m.kind === 'First meeting' && m.st === 'held') && f.fit >= 70).slice(0, 2).forEach(f => IB.push({ id:'ib-b-' + f.id, kind:'book', f:f.id, state:'wait' }));
    const hr = fundBy('Halden Ridge'); IB.push({ id:'ib-x-' + hr.id, kind:'fix', f:hr.id, to:'out', why:'They do not lead below $3M ARR', state:'wait' });
  }
  buildInbox();
  const waiting = () => IB.filter(x => x.state === 'wait' && fundOf(x.f));

  /* ---------- what is committed, and the round's numbers: one place, used by every view ---------- */
  const committed = () => FUNDS.filter(f => f.st === 'in' && f.commit);
  const hardM = () => sum(committed().filter(f => f.commit.hard), f => f.commit.amt);
  const softM = () => sum(committed().filter(f => !f.commit.hard), f => f.commit.amt);
  const totalM = () => r2(hardM() + softM());
  const sheets = () => FUNDS.filter(f => f.st === 'ts' && f.ts);
  const active = () => FUNDS.filter(f => ACTIVE.includes(f.st));
  // a sheet's numbers: post-money with the followers already in, and the pre-money left once a pool before the round is topped up
  const termsOf = f => { const t = f.ts, raise = t.amt + totalM(), post = t.pre + raise, top = t.poolPre ? Math.max(0, t.pool * post - POOL0 * t.pre) : 0;
    return { raise, post, eff:t.pre - top, top, dil:raise / post }; };
  const bestSheet = () => sheets().slice().sort((a, b) => termsOf(b).eff - termsOf(a).eff)[0] || null;
  const leadChosen = () => committed().find(f => f.ts) || null;
  const meetingsIn = (a, b) => MT.filter(m => m.day >= a && m.day <= b);
  const mon0 = -((dow(0) + 6) % 7);

  /* ---------- toasts: Toast ---------- */
  const toasts = $('.fr-toasts', app);
  const TONE = { ok:['ok', 'var(--dm-ok)', 'var(--dm-ok-bg)'], info:['info', 'var(--dm-pb)', 'var(--dm-pb-bg)'], warn:['warn', 'var(--dm-warn)', 'var(--dm-warn-bg)'], bad:['trash', 'var(--dm-bad)', 'var(--dm-bad-bg)'] };
  function toast(kind, b, s = '', act = null){
    const [ic, col, bg] = TONE[kind];
    const t = html(`<div class="tst-t tst-in" role="status"><span class="g" style="color:${col};background:${bg}">${I(ic)}</span><div class="tx"><b>${esc(b)}</b>${s ? `<span>${esc(s)}</span>` : ''}</div><div class="acts">${act ? `<button class="pill ghost sm">${esc(act.label)}</button>` : ''}<button class="ib" aria-label="Dismiss" data-tip="Dismiss">${I('x')}</button></div></div>`);
    const out = () => { if (!t.isConnected || t.classList.contains('tst-out')) return; t.classList.add('tst-out'); setTimeout(() => t.remove(), 320); };
    $('.ib', t).onclick = out;
    if (act) $('.pill', t).onclick = () => { act.run(); out(); };
    toasts.appendChild(t);
    while (toasts.children.length > 3) toasts.firstElementChild.remove();
    if (!toasts._away){ toasts._away = true;
      const away = () => $$('.tst-t:not(.tst-out)', toasts).forEach(x => { if (performance.now() - (x._born || 0) > 250){ x.classList.add('tst-out'); setTimeout(() => x.remove(), 320); } });
      document.addEventListener('pointerdown', e => { if (!toasts.contains(e.target)) away(); }, true);
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && toasts.children.length) away(); }); }
    t._born = performance.now();
    let left = 6000, t0 = performance.now(), tm0 = setTimeout(out, left);
    t.addEventListener('pointerenter', () => { clearTimeout(tm0); left -= performance.now() - t0; });
    t.addEventListener('pointerleave', () => { t0 = performance.now(); tm0 = setTimeout(out, Math.max(1200, left)); });
  }

  /* ---------- moving a fund: the board, the sheet, the menus and the agent all come here ---------- */
  function setStage(f, st){
    const was = { st:f.st, commit:f.commit && { ...f.commit }, intro:f.intro, why:f.why, reached:f.reached, passDay:f.passDay };
    if (st === 'in' && !f.commit) f.commit = { amt:f.ts ? f.ts.amt : f.ask, hard:!!f.ts, day:0 };
    if (st !== 'in') f.commit = null;
    if (st === 'out' && f.st !== 'out'){ f.reached = f.st; f.passDay = 0; f.why = f.why || 'Passed'; }
    if (st === 'ts' && !f.ts) f.ts = { amt:f.ask, pre:40, pool:.1, poolPre:false, pref:'1x', part:'None', board:`2 founders, 1 ${short(f)}`, prorata:'Major investors', noShop:30, rec:0, exp:10 };
    if (ST[st].i >= 1 && f.intro === 'none') f.intro = 'asked';
    f.st = st;
    return () => { f.st = was.st; f.commit = was.commit; f.intro = was.intro; f.why = was.why; f.reached = was.reached; f.passDay = was.passDay; };
  }
  function moveFund(f, st){
    if (f.st === st) return;
    const from = f.st, undo = setStage(f, st); refresh();
    say(`${f.n} moved to ${ST[st].t}`);
    const s = st === 'in' ? `${f.commit.hard ? 'Hard commit' : 'Soft-circled'}, ${M(f.commit.amt)}. ${M(totalM())} of ${M(TARGET)} committed` : st === 'out' ? `Out of the pipeline. ${plural(active().length, 'active fund')} left` : `From ${ST[from].t}`;
    toast(st === 'in' ? 'ok' : 'info', st === 'in' ? `${f.n} committed` : `${f.n} moved to ${ST[st].t}`, s, { label:'Undo', run:() => { undo(); refresh(); } });
  }

  /* ---------- the agent's actions: each returns its toast and its undo ---------- */
  const logOf = (f, k, t, day = 0) => f.log.unshift({ k, day, t, by:'Ada Brennan' });
  const freeSlot = (dur, from = 1) => { for (let day = workAfter(0, from), n = 0; n < 15; day++){ if (!isWork(day)) continue; n++; for (let h = 9.5; h + dur <= 17; h += .5) if (!busy(day, h, dur)) return { day, h }; } return { day:workAfter(0, from), h:10 }; };
  function run(x){
    const f = fundOf(x.f), p = x.to && personOf(x.to);
    if (x.kind === 'intro'){
      const undo = setStage(f, 'intro'), wasDay = f.introDay, wasVia = f.via; f.intro = 'asked'; f.introDay = 0; f.via = x.via;
      logOf(f, 'Email', x.via ? `Asked ${CON[x.via].n} for an intro to ${p.n}` : `Cold email to ${p.n}`); x.state = 'done'; x.res = x.via ? 'Asked ' + first(CON[x.via].n) : 'Sent';
      return { t:x.via ? `Intro request sent to ${CON[x.via].n}` : `Email sent to ${p.n}`, s:`${f.n} moved to Intro asked`, undo:() => { undo(); f.introDay = wasDay; f.via = wasVia; f.log.shift(); x.state = 'wait'; } };
    }
    if (x.kind === 'follow' || x.kind === 'nudge' || x.kind === 'reply'){
      const wasN = f.nudged; logOf(f, 'Email', `${x.kind === 'nudge' ? 'Nudge' : x.kind === 'reply' ? 'Term sheet reply' : 'Follow-up'} to ${p.n}: “${x.subj}”`); if (x.kind === 'nudge') f.nudged = 0;
      x.state = 'done'; x.res = 'Sent today';
      return { t:`${x.kind === 'nudge' ? 'Nudge' : x.kind === 'reply' ? 'Reply' : 'Follow-up'} sent to ${p.n}`, s:`${f.n}, logged as an email`, undo:() => { f.log.shift(); f.nudged = wasN; x.state = 'wait'; } };
    }
    if (x.kind === 'book'){
      const s = freeSlot(1, 2), m = meet({ f:f.id, k:'partner', day:s.day, h:s.h, own:'AB' }); m.who = ['AB', 'SO']; m.by = 'agent';
      const undo = setStage(f, 'partner'); x.state = 'done'; x.res = 'Booked ' + fmtD(m.day);
      return { t:`Partner meeting booked with ${f.n}`, s:`${fmtDW(m.day)}, ${tmA(m.h)}. ${f.n} moved to Partner meeting`, m, undo:() => { MT = MT.filter(y => y !== m); undo(); x.state = 'wait'; } };
    }
    if (x.kind === 'fix'){
      const undo = setStage(f, 'out'); f.why = x.why; x.state = 'done'; x.res = 'Moved to Passed';
      return { t:`${f.n} moved to Passed`, s:x.why, undo:() => { undo(); x.state = 'wait'; } };
    }
  }
  function approve(x){
    const r = run(x); if (!r) return;
    x.undo = r.undo; refresh(); say(r.t);
    toast('ok', r.t, r.s, { label:'Undo', run:() => { r.undo(); x.undo = null; refresh(); } });
  }
  const ibOf = (f, kinds) => IB.find(x => x.f === f.id && x.state === 'wait' && (!kinds || kinds.includes(x.kind)));

  /* ---------- the agent's read of a fund: the next step, its suggestion, and a prep note for the next meeting ---------- */
  function nextOf(f){
    const m = meetsOf(f).find(x => x.st === 'plan');
    if (m) return { m, t:m.kind, d:`${fmtDW(m.day)}, ${tmA(m.h)}` };
    const fm = meetsOf(f).filter(x => x.st === 'held').pop();
    const T = { res:['Ask for an intro', bestPath(f) ? `Through ${CON[bestPath(f).via].n}` : 'No warm path, write cold'], intro:['Wait for the intro', f.via ? `Asked ${first(CON[f.via].n)} ${ago(-(f.introDay || 0))}` : `Asked ${ago(-(f.introDay || 0))}`],
      first:['Book the partner meeting', fm ? `First meeting was ${fmtD(fm.day)}` : ''], partner:['Open diligence', fm ? `Partner meeting was ${fmtD(fm.day)}` : ''], dd:['Answer their questions', quietDays(f) ? `No views in ${quietDays(f)} days` : 'Retention by cohort, one more reference'],
      ts:['Decide on the term sheet', f.ts ? `Expires ${fmtDW(f.ts.exp)}` : ''], in:[f.commit && f.commit.hard ? 'Wire at close' : 'Get it in writing', f.commit ? `${M(f.commit.amt)} ${f.commit.hard ? 'signed' : 'soft-circled'} ${fmtD(f.commit.day)}` : ''], out:['None', f.why || ''] }[f.st];
    return { m:null, t:T[0], d:T[1], late:f.st === 'ts' && f.ts && f.ts.exp <= 3 };
  }
  function sugOf(f){
    const x = ibOf(f);
    if (x) return { label:{ intro:x.via ? 'Ask for the intro' : 'Send cold email', follow:'Send follow-up', nudge:'Send nudge', book:'Book partner meeting', fix:'Move to Passed', reply:'Send reply' }[x.kind], why:ibWhy(x), item:x };
    if (f.st === 'ts') return { label:'Compare term sheets', why:`${short(f)}'s sheet expires ${inDays(f.ts.exp)}. The agent compares it with the other${sheets().length > 2 ? 's' : ''}.`, go:'terms' };
    const n = nextOf(f); if (n.m && n.m.day <= 7) return { label:'Prep for the meeting', why:`${n.m.kind} ${n.m.day <= 1 ? inDays(n.m.day) : 'on ' + DAYL[dow(n.m.day)]}. The agent writes a prep note from what you know.`, prep:n.m };
    return null;
  }
  function prepNote(f, m){
    const p = leadOf(f), held = meetsOf(f).filter(x => x.st === 'held'), last = held[held.length - 1], v = viewsOf(f), bits = [];
    bits.push(`${m ? m.kind : 'Next meeting'} with ${p.n}${f.ppl.length > 1 ? ` and ${first(f.ppl[1].n)}` : ''}. ${f.n} ${f.leads ? 'leads' : 'joins'} with ${M(f.min)} to ${M(f.max)}; we expect ${M(f.ask)}.`);
    if (last && last.note) bits.push(`Last time (${fmtD(last.day)}): ${last.note}`);
    if (v.length){ const top = DOCS.map(d => ({ d, s:sum(v.filter(x => x.d === d.id), x => x.s) })).filter(x => x.s).sort((a, b) => b.s - a.s)[0]; bits.push(`They spent ${mins(sum(v, x => x.s))} in the data room, most on ${top.d.l}${quietDays(f) ? `, but nothing in ${quietDays(f)} days` : ''}.`); }
    if (f.conflict) bits.push(`They back ${f.conflict}, a competitor: keep the roadmap high level.`);
    bits.push(`Ask: ${f.st === 'first' || f.st === 'intro' ? 'what they need to take it to the partnership' : f.st === 'partner' ? 'who runs diligence and how long it takes' : f.st === 'dd' ? 'what stands between them and a term sheet' : 'whether they can match the best terms'}. Close with ${M(Math.max(0, TARGET - totalM()))} left to raise.`);
    return bits.join(' ');
  }

  /* ---------- the state of what is open, filtered and picked ---------- */
  const K = { own:new Set(), fit:'any', role:'any', sect:'any', quiet:false, view:'board', shut:new Set(['out']), tab:'first' };
  let view = 'round', sheetFor = null, mvFor = null, roomDoc = 'all', introFor = null, introTab = 'open', wk = 0, pinIntro = null;
  const say = t => { const live = $('.kbx-sr', app); live.textContent = ''; setTimeout(() => live.textContent = t, 40); };
  const ck = `<span class="ck">${I('check', 'xs')}</span>`;
  const mi = (attrs, body, role = 'menuitemradio', checked = false) => `<button class="mi" role="${role}" aria-checked="${checked}" tabindex="-1" data-close ${attrs}>${body}${role !== 'menuitem' ? ck : ''}</button>`;
  const pop = id => $('#' + id, app);
  const onOpen = (s, fn) => app.addEventListener('click', e => { if (e.target.closest(s)) fn(e.target.closest(s)); }, true);

  /* ---------- Round: the chart components, worked out from the funds ---------- */
  const rd = $('#fr-v-round', app);
  const W0 = KICK - ((dow(KICK) + 6) % 7);                 // the Monday of the kick-off week
  const weekIdx = d => Math.floor((d - W0) / 7), NOWK = weekIdx(0), WEEKS = weekIdx(CLOSE) + 1;
  const sparkPath = pts => { const mx = Math.max(...pts), mn = Math.min(...pts); return pts.map((y, k) => `${k ? 'L' : 'M'}${(k / (pts.length - 1) * 100).toFixed(1)} ${(28 - (y - mn) / ((mx - mn) || 1) * 24).toFixed(1)}`).join(' '); };
  const cumAt = w => sum(committed().filter(f => weekIdx(f.commit.day) <= w), f => f.commit.amt);
  const activeAt = w => FUNDS.filter(f => (f.introDay != null ? weekIdx(f.introDay) <= w : f.st === 'res') && !(f.st === 'out' && weekIdx(f.passDay) <= w) && !(f.st === 'in' && weekIdx(f.commit.day) <= w)).length;
  const mtgWeek = w => MT.filter(m => weekIdx(m.day) === w);
  let shownLine = null;
  const lineOn = [true, true];
  function renderRound(){
    const tot = totalM(), hard = hardM(), soft = softM(), act = active(), ts = sheets(), best = bestSheet();
    const thisWk = mtgWeek(NOWK).length, lastWk = mtgWeek(NOWK - 1).length;
    const wks = Array.from({ length:NOWK + 1 }, (_, w) => w);
    const lastCum = cumAt(NOWK - 2);
    const chip = (t, k = '') => `<span class="tag scx-d num${k ? ' ' + k : ''}">${t}</span>`;
    const S = [
      ['target', 'Committed', M(tot), tot > lastCum ? chip('+' + M(tot - lastCum), 'ok') : chip('No change'), wks.map(cumAt), `${M(hard)} hard, ${M(soft)} soft-circled. Up ${M(tot - lastCum)} in two weeks`, 'committed'],
      ['file-text', 'In term sheets', M(sum(ts, f => f.ts.amt)), chip(plural(ts.length, 'sheet')), wks.map(w => FUNDS.filter(f => f.ts && f.st !== 'out' && weekIdx(f.ts.rec) <= w).length), ts.length ? `Best effective pre-money ${M(termsOf(best).eff)}, from ${best.n}` : 'No sheets yet', 'sheets'],
      ['users', 'Active funds', String(act.length), chip(`of ${FUNDS.length}`), wks.map(activeAt), `${plural(FUNDS.filter(f => f.st === 'out').length, 'fund')} passed, ${committed().length} committed`, 'active'],
      ['cal', 'Meetings this week', String(thisWk), thisWk >= lastWk ? chip('+' + (thisWk - lastWk), 'ok') : chip('−' + (lastWk - thisWk), 'bad'), wks.map(w => mtgWeek(w).length), `${lastWk} last week`, 'meetings'] ];
    $('.scx-grid', rd).innerHTML = S.map((s, i) => `<div class="scx-c panel" data-tip="${esc(s[5])}" data-k="${s[6]}"><span class="scx-k"><span class="ic">${I(s[0], 'xs')}</span>${s[1]}</span><div class="scx-v"><b class="num">${s[2]}</b>${s[3]}</div><div class="scx-sp"><svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path stroke="var(--dm-c${i + 1})" d="${sparkPath(s[4])}"/></svg></div></div>`).join('');

    // committed against the target: hard, soft-circled and the best sheet on Progress's meter, with notches at the target and the most
    const cm = $('.fr-cmt', rd), mb = $('.fr-mb', cm), pc = v => (v / MAX * 100).toFixed(2) + '%', bt = best ? best.ts.amt : 0;
    $('.fl', mb).style.width = pc(hard); const sf = $('.fr-soft', mb); sf.style.left = pc(hard); sf.style.width = pc(soft);
    const tb = $('.fr-tsb', mb); tb.style.left = pc(tot); tb.style.width = pc(Math.min(bt, MAX - tot)); tb.dataset.tip = best ? `${best.n}'s sheet would add ${M(bt)}` : '';
    $('.fr-tg', mb).style.left = pc(TARGET); $('.fr-mx', mb).style.left = 'calc(100% - 2px)';
    mb.setAttribute('aria-valuenow', tot); mb.setAttribute('aria-label', `${M(tot)} committed of a ${M(TARGET)} target: ${M(hard)} hard and ${M(soft)} soft-circled`);
    $('.fr-ticks', cm).innerHTML = [0, 2.5, 5, 7.5, 10, 12].map(v => `<span style="left:${pc(v)}" class="${v === TARGET ? 'tg' : v === MAX ? 'mx' : ''}">${v === TARGET ? '<i class="w">Target </i>' + M(v) : v === MAX ? '<i class="w">Room to </i>' + M(v) : M(v)}</span>`).join('');
    swap($('.fr-cmts', cm), `${M(tot)} of ${M(TARGET)}, ${Math.round(tot / TARGET * 100)}%${best && !leadChosen() ? `. With ${short(best)}'s sheet: ${M(tot + bt)}` : ''}`);
    $('.fr-cl', cm).innerHTML = committed().sort((a, b) => b.commit.amt - a.commit.amt).map(f => `<button class="fr-cr" role="listitem" data-open="${f.id}" aria-label="${esc(f.n)}, ${M(f.commit.amt)}, ${f.commit.hard ? 'hard' : 'soft-circled'}. Open">${tile(f, 'sm')}<span class="n">${esc(f.n)}<span class="muted">${f.ts ? 'Lead, ' : ''}${esc(leadOf(f).n)}</span></span><span class="tag${f.commit.hard ? ' ok' : ''}">${f.commit.hard ? 'Hard' : 'Soft-circled'}</span><span class="d muted num">${fmtD(f.commit.day)}</span><b class="num" data-k="camt">${M(f.commit.amt)}</b></button>`).join('')
      + `<div class="fr-ctot"><span>Total committed</span><span class="muted num">${M(hard)} hard · ${M(soft)} soft</span><b class="num" data-k="ctot">${M(tot)}</b></div>`;

    // round goals: Radial goals' rings, each its share of the plan for this raise
    const pm = MT.filter(m => m.kind === 'Partner meeting' && m.st === 'held').length;
    const G = [['Committed', tot, TARGET, M(tot) + ' of ' + M(TARGET)], ['Partner meetings', pm, 12, `${pm} of 12 held`], ['Term sheets', ts.length + (leadChosen() ? 1 : 0), 3, `${ts.length + (leadChosen() ? 1 : 0)} of 3 wanted`]];
    const RAD = [78, 60, 42], CS = ['var(--dm-c1)', 'var(--dm-c3)', 'var(--dm-c4)'], rsvg = $('.rgx-ring svg', rd);
    if (!rsvg.children.length) rsvg.innerHTML = G.map((g, i) => `<g data-i="${i}" style="stroke:${CS[i]}"><circle class="tr" cx="90" cy="90" r="${RAD[i]}"/><circle class="fl" cx="90" cy="90" r="${RAD[i]}" pathLength="100" stroke-dasharray="0 100"/></g>`).join('');
    const share = g => Math.min(1, g[1] / g[2]);
    requestAnimationFrame(() => G.forEach((g, i) => $(`g[data-i="${i}"] .fl`, rsvg).setAttribute('stroke-dasharray', `${Math.max(0, share(g) * 100 - .01)} 100`)));
    const lg = $('.rgx-lg', rd), pcs = x => Math.round(x * 100) + '%', all = sum(G, share) / G.length;
    lg.innerHTML = G.map((g, i) => `<div class="rgx-r" data-i="${i}" tabindex="0" aria-label="${g[0]}: ${g[3]}, ${pcs(share(g))}"><i style="background:${CS[i]}"></i><span class="n">${g[0]}</span><span class="p num">${share(g) >= 1 ? `<span class="tag ok">${pcs(share(g))}</span>` : pcs(share(g))}</span><span class="v num">${g[3]}</span></div>`).join('');
    const cb = $('.rgx-c b', rd), cl = $('.rgx-c .muted', rd);
    const centreOn = i => { $('.rgx-ring', rd).classList.toggle('hov', i >= 0); $$('g', rsvg).forEach((g, k) => g.classList.toggle('on', k === i)); $$('.rgx-r', lg).forEach((r, k) => r.classList.toggle('on', k === i)); cb.textContent = pcs(i < 0 ? all : share(G[i])); cl.textContent = i < 0 ? 'of goals' : G[i][0]; };
    centreOn(-1);
    const behind = G.filter(g => share(g) < .5), ahead = G.filter(g => share(g) >= 1);
    swap($('.fr-gn span', rd), `${ahead.length ? `${andList(ahead.map(g => g[0]))} ${ahead.length > 1 ? 'are' : 'is'} at plan. ` : ''}${behind.length ? `${andList(behind.map(g => g[0]))} ${behind.length > 1 ? 'are' : 'is'} under half: ${G[0] === behind[0] ? `${M(TARGET - tot)} to go, and the best open sheet covers ${M(Math.min(bt, TARGET - tot))} of it.` : 'the agent books more partner meetings first.'}` : 'Every goal is past halfway.'}`);
    $$('.rgx-r', lg).forEach((r, i) => { r.onpointerenter = r.onfocus = () => centreOn(i); r.onpointerleave = r.onblur = () => centreOn(-1); });

    // the pipeline: Funnel's rows, how many funds reached each stage
    const FS = STAGES.filter(s => s.k !== 'out'), reach = FS.map(s => FUNDS.filter(f => (f.st === 'in' ? 6 : reachIdx(f)) >= ST[s.k].i).length);
    let worst = 1; reach.forEach((n, i) => { if (i > 1 && i < reach.length && n / reach[i - 1] < reach[worst] / reach[worst - 1]) worst = i; });
    $('.fr-fnn', rd).textContent = plural(FUNDS.length, 'fund');
    $('.fnx-rows', rd).innerHTML = FS.map((s, i) => { const w = Math.max(6, reach[i] / reach[0] * 100), now = FUNDS.filter(f => f.st === s.k).length;
      return `<div class="fnx-r${i === worst ? ' drop' : ''}" data-st="${s.k}" style="--dm-fc:color-mix(in oklab,var(--dm-c1) ${100 - i * 16}%,var(--dm-c2))"><span class="k">${s.t}</span><div class="tr" data-tip="${reach[i]} reached ${s.t.toLowerCase()}, ${now} ${now === 1 ? 'is' : 'are'} there now"><div class="bar" style="width:${w}%"></div><span class="n num${w < 24 ? ' out' : ''}" style="left:${w < 24 ? `calc(${w}% + 8px)` : '10px'}">${reach[i]}</span></div><span class="v num">${i ? '−' + Math.round((1 - reach[i] / (reach[i - 1] || 1)) * 100) + '%' : '100%'}</span></div>`; }).join('');
    $('.fnx-t', rd).textContent = `The biggest drop is from ${FS[worst - 1].t.toLowerCase()} to ${FS[worst].t.toLowerCase()}: ${Math.round((1 - reach[worst] / reach[worst - 1]) * 100)}% of funds stop there.`;

    // investor meetings a week: Bar chart, one accent, the kinds in the hover readout
    const wk = $('.fr-wk', rd), bars = Array.from({ length:NOWK + 2 }, (_, w) => mtgWeek(w)), hi = Math.max(...bars.map(b => b.length), 1);
    $('.bcx-v', wk).textContent = thisWk; $('.fr-wkn', wk).textContent = `Week ${NOWK + 1} of ${WEEKS}`;
    const by = (L, k) => L.filter(m => m.kind === k).length;
    $('.bcx-ch', wk).innerHTML = bars.map((L, w) => `<div class="bcx-b${w > NOWK ? ' fr-ahead' : ''}${w === NOWK ? ' fr-now' : ''}"><div class="bcx-tt"><b class="num">${plural(L.length, 'meeting')}${w > NOWK ? ' booked' : ''}</b><span>Week of ${fmtD(W0 + w * 7)}: ${by(L, 'First meeting')} first, ${by(L, 'Partner meeting')} partner, ${by(L, 'Diligence call') + by(L, 'Reference call')} diligence</span></div><div class="bcx-st"><i style="height:${(L.length / hi * 132).toFixed(1)}px"></i></div><span class="bcx-l num">${w === NOWK ? 'Now' : 'W' + (w + 1)}</span></div>`).join('');

    // top risks: what the agent sees in the data, worst first
    const R = risks();
    $('.fr-rl', rd).innerHTML = R.length ? R.slice(0, 5).map((r, i) => `<div class="fr-rk" role="listitem"><span class="ic ${r.sev}">${I(r.sev === 'bad' ? 'alert' : 'warn', 'xs')}</span><span class="t">${esc(r.t)}<span class="muted">${esc(r.s)}</span></span><button class="pill line sm" data-risk="${i}">${r.act}</button></div>`).join('') : '<p class="muted fr-none">Nothing stands out. The agent checks again as the data changes.</p>';
    rd._risks = R;

    // the timeline to close: the milestones on a rail, done up to today
    const T = timeline(), span = CLOSE - KICK, at = d => ((d - KICK) / span * 100).toFixed(2) + '%';
    $('.fr-rdone', rd).style.width = at(0); $('.fr-today', rd).style.left = at(0); $('.fr-today', rd).textContent = 'Today';
    $('.fr-ms', rd).innerHTML = T.map((m, i) => `<div class="fr-m${m.done ? ' done' : ''}${m.next ? ' next' : ''}" style="left:${at(m.d)}" data-i="${i}"><i></i><b>${m.t}</b><span class="num">${m.done ? 'Done ' : m.next ? 'Next, ' : ''}${fmtD(m.d)}</span></div>`).join('');
    swap($('.fr-tls', rd), `Close ${fmtDW(CLOSE)}, in ${Math.ceil(CLOSE / 7)} weeks. ${T.filter(m => m.done).length} of ${T.length} milestones done`);

    // committed over time against the plan: Line chart
    const X = w => w / (WEEKS - 1) * 320, hiL = MAX * 1.02, Y = v => 136 - v / hiL * 128;
    const A = Array.from({ length:NOWK + 1 }, (_, w) => cumAt(w)), P = Array.from({ length:WEEKS }, (_, w) => r2(TARGET * Math.min(1, w / (WEEKS - 2))));
    const smooth = p => p.map((q, i) => { if (!i) return `M${q[0]} ${q[1]}`; const a = p[i - 1], m = (q[0] - a[0]) / 2; return `C${a[0] + m} ${a[1]} ${q[0] - m} ${q[1]} ${q[0]} ${q[1]}`; }).join(' ');
    const step = p => p.map((q, i) => i ? `L${q[0]} ${p[i - 1][1]} L${q[0]} ${q[1]}` : `M${q[0]} ${q[1]}`).join(' ');
    const pa = A.map((v, i) => [X(i), Y(v)]), pb = P.map((v, i) => [X(i), Y(v)]);
    const ln = $('.fr-ln', rd), svg = $('.lnx-svg', ln);
    svg.innerHTML = `<defs><linearGradient id="fr-lng" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--dm-accent-mark,var(--dm-accent))" stop-opacity=".16"/><stop offset="1" stop-color="var(--dm-accent-mark,var(--dm-accent))" stop-opacity="0"/></linearGradient></defs>`
      + [Y(2.5), Y(5), Y(7.5), Y(10)].map(y => `<line class="gl" x1="0" x2="320" y1="${y}" y2="${y}"/>`).join('')
      + `<path class="ar" d="${step(pa)} L${X(A.length - 1)} 140 L0 140 Z" fill="url(#fr-lng)" style="opacity:${lineOn[0] ? 1 : 0}"/><path class="ln l1${lineOn[1] ? '' : ' off'}" d="${smooth(pb)}" stroke="var(--dm-c2)" stroke-dasharray="4 4"/><path class="ln l0${lineOn[0] ? '' : ' off'}" d="${step(pa)}" stroke="var(--dm-accent-mark,var(--dm-accent))"/>`;
    const ch = $('.lnx-ch', ln); $$('.lnx-pt', ch).forEach(x => x.remove());
    ch.insertAdjacentHTML('beforeend', '<span class="lnx-pt on" style="color:var(--dm-accent-mark,var(--dm-accent))"></span><span class="lnx-pt on" style="color:var(--dm-c2)"></span>');
    $('.lnx-ax', ln).innerHTML = [0, 3, 6, 9, WEEKS - 1].map(w => `<span>${w === NOWK ? 'Now' : fmtD(W0 + w * 7)}</span>`).join('');
    const lv = $('.lnx-v', ln);
    if (shownLine === null || REDUCE) lv.textContent = M(tot); else if (shownLine !== tot) tween(shownLine, tot, 700, n => lv.textContent = M(n));
    shownLine = tot;
    ch.onpointermove = ev => { const b = ch.getBoundingClientRect(), i = clamp(Math.round((ev.clientX - b.left) / b.width * (WEEKS - 1)), 0, WEEKS - 1), px = i / (WEEKS - 1) * b.width;
      $('.lnx-x', ch).style.left = px + 'px'; $('.lnx-tt', ch).style.left = clamp(px, 70, b.width - 70) + 'px';
      const pts = $$('.lnx-pt', ch); [pa, pb].forEach((p, k) => { const has = !!p[i] && lineOn[k]; pts[k].classList.toggle('on', has); if (p[i]){ pts[k].style.left = px + 'px'; pts[k].style.top = p[i][1] / 140 * b.height + 'px'; } });
      const a = A[i], q = P[i], mine = lineOn[0] && a != null;
      $('.lnx-tt b', ch).textContent = mine ? `${M(a)} by ${fmtD(W0 + i * 7 + 6)}` : `${M(q)} planned by ${fmtD(W0 + i * 7 + 6)}`;
      $('.lnx-tt span', ch).textContent = mine ? (lineOn[1] ? `${a >= q ? '+' : '−'}${M(Math.abs(a - q))} on the plan` : 'Committed') : a == null ? 'Not there yet' : 'The plan';
      lv.textContent = mine ? M(a) : M(tot); };
    ch.onpointerleave = () => lv.textContent = M(tot);
  }
  $$('.lnx-k', rd).forEach(k => k.onclick = () => { const s = +k.dataset.s; if (lineOn[s] && !lineOn[1 - s]) return; lineOn[s] = !lineOn[s]; k.classList.toggle('on', lineOn[s]); k.setAttribute('aria-pressed', lineOn[s]); renderRound(); });
  rd.addEventListener('click', e => {
    const o = e.target.closest('[data-open]'); if (o){ openSheet(o.dataset.open, !e.detail); return; }
    const r = e.target.closest('[data-risk]'); if (r){ const x = rd._risks[+r.dataset.risk]; if (x) x.run(); return; }
    const fr = e.target.closest('.fnx-r'); if (fr){ K.tab = fr.dataset.st; setView('investors'); const col = $(`.kbx-c[data-col="${fr.dataset.st}"]`, cols); if (col){ K.shut.delete(fr.dataset.st); renderBoard(); col.scrollIntoView({ block:'nearest', inline:'nearest', behavior:REDUCE ? 'auto' : 'smooth' }); enter(col); } }
  });
  function risks(){
    const R = [];
    sheets().forEach(f => { if (f.ts.exp <= 5) R.push({ sev:f.ts.exp <= 3 ? 'bad' : 'warn', w:10 - f.ts.exp, t:`${short(f)}'s term sheet expires ${inDays(f.ts.exp)}`, s:`${M(f.ts.amt)} at ${M(f.ts.pre)} pre-money, ${f.ts.noShop} days no-shop`, act:'Compare', run:() => setView('terms') }); });
    FUNDS.filter(f => quietDays(f)).sort((a, b) => ST[b.st].i - ST[a.st].i).forEach(f => { const d = lastDoc(f), x = ibOf(f, ['nudge']);
      R.push({ sev:ST[f.st].i >= 4 ? 'bad' : 'warn', w:quietDays(f) / 2 + ST[f.st].i, t:`${short(f)} hasn't opened ${d && d.id === 'deck' ? 'the deck' : 'the data room'} in ${quietDays(f)} days`, s:`${ST[f.st].t}, ${leadOf(f).n}${f.nudged === 0 ? '. Nudged today' : ''}`, act:x ? 'Nudge' : 'Open', run:() => x ? approve(x) : openSheet(f.id, true) }); });
    active().filter(f => f.conflict && ST[f.st].i >= 2).forEach(f => R.push({ sev:'warn', w:4, t:`${short(f)} backs ${f.conflict}, a competitor`, s:`${RIVAL[f.conflict]}. Keep the roadmap high level`, act:'Open', run:() => openSheet(f.id, true) }));
    const cp = sheets().find(f => /Participating/.test(f.ts.part)); if (cp) R.push({ sev:'warn', w:5, t:`${short(cp)} asks for participating preferred`, s:'They are paid back first and share in the rest', act:'What to say', run:() => { setView('terms'); ask(); } });
    const late = active().filter(f => ST[f.st].i >= 3 && f.leads).length; if (!leadChosen() && late < 4) R.push({ sev:'warn', w:3, t:`Only ${plural(late, 'possible lead')} past the partner meeting`, s:'Aim for four or more before you pick one', act:'Funds', run:() => { K.role = 'lead'; setView('investors'); renderBoard(); } });
    return R.sort((a, b) => (b.sev === 'bad') - (a.sev === 'bad') || b.w - a.w);
  }
  function timeline(){
    const held = k => MT.filter(m => m.kind === k && m.st === 'held').map(m => m.day), lc = leadChosen(), ts = sheets(), tsAll = FUNDS.filter(f => f.ts);
    const T = [{ t:'Kick-off', d:KICK, done:true }, { t:'First meetings', d:Math.min(...held('First meeting'), -40), done:true }, { t:'Partner meetings', d:Math.min(...held('Partner meeting'), -25), done:held('Partner meeting').length > 0 },
      { t:'Term sheets in', d:Math.min(...tsAll.map(f => f.ts.rec), -6), done:tsAll.length > 0 }, { t:'Pick a lead', d:lc ? lc.commit.day : Math.max(1, Math.min(...ts.map(f => f.ts.exp), 7)), done:!!lc },
      { t:'Confirmatory diligence', d:16, done:false }, { t:'Sign the documents', d:30, done:false }, { t:'Close and wire', d:CLOSE, done:false }];
    const n = T.find(m => !m.done); if (n) n.next = true;
    return T;
  }

  /* ---------- Investors: the Kanban board ---------- */
  const kb = $('.fr-kb', app), cols = $('.kbx-cols', kb);
  const FITS = [['any', 'Any'], ['70', '70 and up'], ['50', '50 and up'], ['low', 'Under 50']];
  const ROLE = [['any', 'Any'], ['lead', 'Could lead'], ['follow', 'Follows']];
  const fshows = f => (!K.own.size || K.own.has(f.own)) && (K.fit === 'any' || (K.fit === 'low' ? f.fit < 50 : f.fit >= +K.fit))
    && (K.role === 'any' || (K.role === 'lead' ? f.leads : !f.leads)) && (K.sect === 'any' || f.sec.includes(K.sect)) && (!K.quiet || quietDays(f) > 0);
  $('.kbx-fp', kb).innerHTML = Object.keys(TEAM).map(o => `<button aria-pressed="false" data-who="${o}" aria-label="${TEAM[o].n}'s funds" data-tip="${TEAM[o].n}'s funds">${avT(o)}</button>`).join('');
  $('.kbx-tabs', kb).innerHTML = STAGES.map(s => `<button aria-pressed="${s.k === K.tab}" data-v="${s.k}">${s.t.split(' ')[0]}<span class="n num"></span></button>`).join('');
  seg($('.kbx-tabs', kb), v => { K.tab = v; renderBoard(); });
  seg($('.kbx-vw', kb), v => { K.view = v; kb.classList.toggle('list', v === 'list'); renderBoard(); });
  cols.innerHTML = STAGES.map(s => `<div class="kbx-c" data-col="${s.k}"><div class="kbx-ch">${stag(s.k)}<span class="kbx-sp"></span><button class="ib fr-fold" aria-label="Fold ${s.t}" data-tip="Fold column">${I('minus', 'xs')}</button></div><div class="fr-chs muted num"><span class="n"></span><span class="s"></span></div><div class="kbx-list" role="list" aria-label="${s.t}"></div></div>`).join('');
  const card = f => { const n = nextOf(f), q = quietDays(f), lp = leadOf(f), exp = f.st === 'ts' && f.ts && f.ts.exp <= 5;
    return `<div class="kbx-k${sheetFor === f.id ? ' open' : ''}" data-id="${f.id}" role="listitem" tabindex="-1" aria-label="${esc(f.n)}, ${ST[f.st].t}, ${f.st === 'in' ? M(f.commit.amt) + ' committed' : M(f.ask) + ' expected'}, fit ${f.fit}${q ? ', quiet for ' + q + ' days' : ''}">`
      + `<div class="kbx-k1"><span class="fr-kn">${esc(f.n)}</span><button class="kbx-mv" data-pop="#fr-p-mv" data-pop-align="end" aria-haspopup="menu" aria-label="Move ${esc(f.n)}" data-tip="Move to" tabindex="-1">${I('more', 'xs')}</button></div>`
      + `<div class="fr-kp">${avP(lp)}<span>${esc(lp.n)}</span></div>`
      + `<div class="kbx-m"><span class="kbx-mt v num" data-k="${f.st === 'in' ? 'camt' : 'ask'}">${f.st === 'in' ? M(f.commit.amt) : f.ts && f.st === 'ts' ? M(f.ts.amt) : M(f.ask)}</span>${f.st === 'in' ? `<span class="tag${f.commit.hard ? ' ok' : ''}">${f.commit.hard ? 'Hard' : 'Soft'}</span>` : `<span class="kbx-mt fr-fit" data-tip="Fit ${f.fit} of 100">${f.fit}<span class="kbx-sb"><i style="width:${f.fit}%"></i></span></span>`}${f.leads ? '<span class="kbx-mt">Lead</span>' : ''}</div>`
      + (f.st === 'out' ? `<div class="kbx-m"><span class="kbx-mt fr-why">${esc(f.why || '')}</span></div>` : `<div class="kbx-m fr-knx"><span class="kbx-mt${n.late || exp ? ' late' : ''}">${I(n.m ? 'cal' : exp ? 'alert' : 'right', 'xs')}<span>${esc(exp ? `Expires ${inDays(f.ts.exp)}` : n.m ? `${n.t.replace(' meeting', '').replace(' call', '')} ${DAYN[dow(n.m.day)]} ${tmA(n.m.h)}` : n.t)}</span></span>${q ? `<span class="kbx-mt fr-q" data-tip="No data room views in ${q} days">${I('history', 'xs')}${q}d</span>` : ''}</div>`)
      + `</div>`; };
  let kFocus = null;
  function renderBoard(){
    const filtering = K.own.size || K.fit !== 'any' || K.role !== 'any' || K.sect !== 'any' || K.quiet;
    let shown = 0;
    STAGES.forEach(s => {
      const col = $(`.kbx-c[data-col="${s.k}"]`, cols), L = FUNDS.filter(f => f.st === s.k && fshows(f)).sort((a, b) => (s.k === 'in' ? b.commit.amt - a.commit.amt : b.fit - a.fit) || a.n.localeCompare(b.n));
      shown += L.length;
      $('.kbx-list', col).innerHTML = L.map(card).join('') || (filtering ? '' : '<div class="kbx-none">No funds</div>');
      $('.fr-chs .n', col).textContent = K.shut.has(s.k) && K.view === 'board' ? L.length : plural(L.length, 'fund');
      $('.fr-chs .s', col).textContent = s.k === 'out' ? '' : (s.k === 'in' ? '' : s.k === 'ts' ? 'offered ' : 'asks ') + M(sum(L, f => s.k === 'in' ? f.commit.amt : s.k === 'ts' && f.ts ? f.ts.amt : f.ask));
      $('.fr-chs .s', col).dataset.k = s.k === 'in' ? 'colin' : '';
      const sh = K.shut.has(s.k) && K.view === 'board'; col.classList.toggle('shut', sh); col.classList.toggle('on', K.tab === s.k);
      const fb = $('.fr-fold', col); fb.setAttribute('aria-label', (sh ? 'Open ' : 'Fold ') + s.t); fb.dataset.tip = sh ? 'Open column' : 'Fold column'; fb.innerHTML = I(sh ? 'plus' : 'minus', 'xs');
      $(`.kbx-tabs [data-v="${s.k}"] .n`, kb).textContent = L.length;
    });
    cols.style.setProperty('--dm-kbx-gt', STAGES.map(s => K.shut.has(s.k) && K.view === 'board' ? '44px' : 'minmax(148px,1fr)').join(' '));
    $('.kbx-em', kb).hidden = shown > 0 || !filtering;
    $('.kbx-cnt', kb).textContent = filtering ? `${shown} of ${FUNDS.length} funds` : plural(FUNDS.length, 'fund');
    $('.fr-kbsum', kb).textContent = `${active().length} active, ${M(totalM())} committed`;
    $$('.kbx-fp button', kb).forEach(b => b.setAttribute('aria-pressed', K.own.has(b.dataset.who)));
    $('.kbx-fp', kb).classList.toggle('some', K.own.size > 0);
    const chipV = (f, v, on) => { const b = $(`[data-f="${f}"]`, kb); $('.v', b).textContent = v; b.classList.toggle('on', on); };
    chipV('fit', FITS.find(x => x[0] === K.fit)[1], K.fit !== 'any'); chipV('role', ROLE.find(x => x[0] === K.role)[1], K.role !== 'any'); chipV('sect', K.sect === 'any' ? 'Any' : SECT[K.sect][0], K.sect !== 'any');
    const qf = $('.fr-qf', kb); qf.classList.toggle('on', K.quiet); qf.setAttribute('aria-pressed', K.quiet);
    $('.kbx-clr', kb).hidden = !filtering;
    const ks = $$('.kbx-k', cols), keep = ks.find(k => k.dataset.id === kFocus) || ks[0]; if (keep) keep.tabIndex = 0;
    navCurrent();
  }
  $('.kbx-fp', kb).addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; K.own.has(b.dataset.who) ? K.own.delete(b.dataset.who) : K.own.add(b.dataset.who); renderBoard(); });
  const clearBoard = () => { K.own.clear(); K.fit = 'any'; K.role = 'any'; K.sect = 'any'; K.quiet = false; renderBoard(); };
  $('.kbx-clr', kb).onclick = clearBoard; $('.fr-kbclr', kb).onclick = clearBoard;
  $('.fr-qf', kb).onclick = () => { K.quiet = !K.quiet; if (K.quiet) K.shut.delete('out'); renderBoard(); };
  const countIf = (key, v) => { const s = K[key]; K[key] = v; const n = FUNDS.filter(fshows).length; K[key] = s; return n; };
  onOpen('[data-f="fit"]', () => { const p = pop('fr-p-fit'); p.innerHTML = `<div class="ph" role="none">Fit score</div>` + FITS.map(([k, t]) => mi(`data-v="${k}"`, `<span>${t}</span><span class="r num">${countIf('fit', k)}</span>`, 'menuitemradio', K.fit === k)).join(''); $$('.mi', p).forEach(m => m.onclick = () => { K.fit = m.dataset.v; renderBoard(); }); });
  onOpen('[data-f="role"]', () => { const p = pop('fr-p-role'); p.innerHTML = `<div class="ph" role="none">Role in the round</div>` + ROLE.map(([k, t]) => mi(`data-v="${k}"`, `<span>${t}</span><span class="r num">${countIf('role', k)}</span>`, 'menuitemradio', K.role === k)).join(''); $$('.mi', p).forEach(m => m.onclick = () => { K.role = m.dataset.v; renderBoard(); }); });
  onOpen('[data-f="sect"]', () => { const p = pop('fr-p-sect'); p.innerHTML = `<div class="ph" role="none">Sector</div>` + mi('data-v="any"', `<span>Any</span><span class="r num">${countIf('sect', 'any')}</span>`, 'menuitemradio', K.sect === 'any') + Object.keys(SECT).map(k => mi(`data-v="${k}"`, `${sectag(k)}<span class="r num">${countIf('sect', k)}</span>`, 'menuitemradio', K.sect === k)).join(''); $$('.mi', p).forEach(m => m.onclick = () => { K.sect = m.dataset.v; renderBoard(); }); });
  cols.addEventListener('click', e => {
    if (dragged) return;
    const fold = e.target.closest('.fr-fold'), col = e.target.closest('.kbx-c');
    if (fold || (col && col.classList.contains('shut'))){ const k = col.dataset.col; K.shut.has(k) ? K.shut.delete(k) : K.shut.add(k); renderBoard(); swap($('.kbx-sr', kb), `${ST[k].t} ${K.shut.has(k) ? 'folded' : 'opened'}`); const b = $('.fr-fold', $(`.kbx-c[data-col="${k}"]`, cols)); if (b && fold) b.focus({ preventScroll:true }); return; }
    const el = e.target.closest('.kbx-k'); if (!el) return;
    kFocus = el.dataset.id;
    if (e.target.closest('.kbx-mv')){ mvFor = el.dataset.id; buildMoveMenu(); return; }
    openSheet(el.dataset.id);
  });
  cols.addEventListener('keydown', e => {
    const el = e.target.closest('.kbx-k'); if (!el || e.target !== el) return;
    const ks = $$('.kbx-k', cols).filter(k => k.offsetParent), i = ks.indexOf(el);
    const go = n => { if (!n) return; e.preventDefault(); ks.forEach(k => k.tabIndex = -1); n.tabIndex = 0; kFocus = n.dataset.id; n.focus(); };
    if (e.key === 'ArrowDown') go(ks[i + 1]); else if (e.key === 'ArrowUp') go(ks[i - 1]);
    else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft'){ const c = el.closest('.kbx-c'), cs = $$('.kbx-c', cols).filter(x => x.offsetParent && $('.kbx-k', x)), n = cs[cs.indexOf(c) + (e.key === 'ArrowRight' ? 1 : -1)]; if (n) go($('.kbx-k', n)); }
    else if (e.key === 'Enter'){ e.preventDefault(); openSheet(el.dataset.id, true); }
    else if (e.key === 'm' || e.key === 'M'){ e.preventDefault(); $('.kbx-mv', el).click(); }
  });
  function buildMoveMenu(){
    const f = fundOf(mvFor), p = pop('fr-p-mv'); if (!f) return;
    p.innerHTML = `<div class="ph" role="none">Move to</div>` + STAGES.map(s => mi(`data-s="${s.k}"`, stag(s.k), 'menuitemradio', f.st === s.k)).join('') + `<div class="sep" role="separator"></div>` + mi('data-open', `${I('panel', 's')}<span>Open ${esc(f.n)}</span>`, 'menuitem');
    $$('.mi', p).forEach(m => m.onclick = () => { if (m.hasAttribute('data-open')) setTimeout(() => openSheet(f.id, true), 130); else moveFund(f, m.dataset.s); });
  }
  // dragging a card to another column, with a copy of it under the pointer
  let dragged = false;
  cols.addEventListener('pointerdown', e => {
    const el = e.target.closest('.kbx-k'); if (!el || e.button !== 0 || e.target.closest('button') || kb.classList.contains('list')) return;
    if (e.pointerType === 'touch' && getComputedStyle(el).touchAction !== 'none') return;
    const f = fundOf(el.dataset.id), rc = el.getBoundingClientRect(), ox = e.clientX - rc.left, oy = e.clientY - rc.top, bd = $('.kbx-bd', kb);
    let gh = null, over = null, moved = false, raf = 0, lx = e.clientX;
    const at2 = (x, y) => { const t = document.elementFromPoint(x, y); return t && t.closest('.fr-kb .kbx-c'); };
    const move = ev => {
      if (!moved && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) < 5) return;
      if (!moved){ moved = true; gh = el.cloneNode(true); gh.classList.add('ghost'); gh.classList.remove('open'); gh.removeAttribute('tabindex'); gh.style.width = rc.width + 'px'; app.appendChild(gh); el.classList.add('drag'); closeSheet(); hideTip(); }
      gh.style.left = ev.clientX - ox + 'px'; gh.style.top = ev.clientY - oy + 'px'; lx = ev.clientX;
      const c = at2(ev.clientX, ev.clientY); if (c !== over){ if (over) over.classList.remove('over'); over = c; if (over && over.dataset.col !== f.st) over.classList.add('over'); }
      if (!raf){ const tickS = () => { const b = bd.getBoundingClientRect(), dx = lx < b.left + 48 ? -12 : lx > b.right - 48 ? 12 : 0; if (dx && gh){ bd.scrollLeft += dx; raf = requestAnimationFrame(tickS); } else raf = 0; }; raf = requestAnimationFrame(tickS); }
    };
    const up = () => {
      removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); cancelAnimationFrame(raf); raf = 0;
      if (!moved) return;
      el.classList.remove('drag'); if (over) over.classList.remove('over');
      dragged = true; setTimeout(() => dragged = false, 0);
      const to = over && over.dataset.col;
      if (to && to !== f.st){
        // the copy glides into the column it was dropped on, then the board redraws with the card in place
        const list = $('.kbx-list', over), lr = list.getBoundingClientRect();
        if (!REDUCE && !over.classList.contains('shut')){ gh.style.transition = 'left .22s var(--dm-ease),top .22s var(--dm-ease),transform .22s var(--dm-ease),opacity .22s'; gh.style.left = lr.left + 'px'; gh.style.top = lr.top + 'px'; gh.style.transform = 'none'; setTimeout(() => { gh.remove(); moveFund(f, to); const n = $(`.kbx-k[data-id="${f.id}"]`, cols); if (n) enter(n); }, 200); }
        else { gh.remove(); moveFund(f, to); }
      } else if (!REDUCE){ gh.style.transition = 'left .25s var(--dm-ease),top .25s var(--dm-ease),opacity .25s'; gh.style.left = rc.left + 'px'; gh.style.top = rc.top + 'px'; gh.style.opacity = '0'; setTimeout(() => gh.remove(), 240); }
      else gh.remove();
    };
    addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  });

  /* ---------- the fund's details: Details panel, with Score breakdown's gauge for the fit ---------- */
  const sheet = $('.fr-sheet', app), dtp = $('.fr-dtp', app);
  const shut = new Set(['conf', 'room']);
  const section = (k, t, body, extra = '') => `<div class="dtp-sec" data-s="${k}"><button class="dtp-sh" aria-expanded="${!shut.has(k)}" data-sec="${k}">${I('chev-r', 'xs')}<span>${t}</span>${extra}</button><div class="fold${shut.has(k) ? ' shut' : ''}"><div>${body}</div></div></div>`;
  let prepFor = null;
  // the fit gauge: a half circle split by weight, each part filled by what it earned
  const fitGauge = F => { const CX = 100, CY = 100, R = 86, GAP = .04, at = a => [CX + Math.cos(a) * R, CY + Math.sin(a) * R];
    const arc = (a0, a1) => { const [x0, y0] = at(a0), [x1, y1] = at(a1); return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`; };
    let a = Math.PI; return F.map((x, i) => { const span = x.w / 100 * Math.PI, s0 = a + GAP / 2, s1 = a + span - GAP / 2; a += span; return `<g data-i="${i}"><path class="tr" d="${arc(s0, s1)}"/>${x.e ? `<path class="fl" style="stroke:${FITC[i]}" d="${arc(s0, s0 + (s1 - s0) * x.e / x.w)}"/>` : ''}</g>`; }).join(''); };
  const fitBand = v => v >= 80 ? 'Strong fit' : v >= 65 ? 'Good fit' : v >= 50 ? 'Fair fit' : 'Weak fit';
  function renderSheet(){
    const f = fundOf(sheetFor); if (!f) return closeSheet();
    const lp = leadOf(f), fit = fitOf(f), n = nextOf(f), sug = sugOf(f), Ms = meetsOf(f), v = viewsOf(f), bp = bestPath(f), weak = fit.F.reduce((m, x, i) => x.e / x.w < fit.F[m].e / fit.F[m].w ? i : m, 0);
    const amt = f.st === 'in' ? M(f.commit.amt) : f.st === 'ts' && f.ts ? M(f.ts.amt) : M(f.ask);
    let h = `<div class="dtp-h">${tile(f)}<span class="tx"><b id="fr-sh-t">${esc(f.n)}</b><span>${esc(f.city)} · ${f.leads ? 'Leads rounds' : 'Follows'}</span></span><button class="ib" data-a="link" aria-label="Copy a link to ${esc(f.n)}" data-tip="Copy link">${I('link', 's')}</button><button class="ib" data-a="close" aria-label="Close details" data-tip="Close" data-tip-k="Esc">${I('x', 's')}</button></div>`
      + `<div class="fr-sum3"><div><span>Cheque range</span><b class="num">${M(f.min)} to ${M(f.max)}</b></div><div><span>${f.st === 'in' ? 'Committed' : f.st === 'ts' ? 'Term sheet' : 'Expected'}</span><b class="num" data-k="${f.st === 'in' ? 'camt' : 'ask'}">${amt}</b></div><div><span>Fit</span><b class="num">${f.fit}<span class="muted"> of 100</span></b></div></div>`;
    if (prepFor === f.id) h += `<div class="six-ans fr-prep">${I('spark', 'xs')}<span>${esc(prepNote(f, n.m))}</span><button class="ib" data-a="prepx" aria-label="Close the prep note" data-tip="Close">${I('x', 'xs')}</button></div>`;
    else if (sug) h += `<div class="six-ans fr-sag">${I('spark', 'xs')}<span>${esc(sug.why)}</span><button class="pill primary sm" data-a="sug">${sug.label}</button></div>`;
    h += section('props', 'Properties', `<div class="dtp-rows">`
        + `<div class="dtp-r"><span class="k">Stage</span><button class="dtp-v" data-pop="#fr-p-stage" aria-haspopup="menu" aria-label="Stage: ${ST[f.st].t}. Change it">${stag(f.st)}${I('chev-d', 'xs')}</button></div>`
        + `<div class="dtp-r"><span class="k">Lead partner</span><button class="dtp-v" data-pop="#fr-p-lead" aria-haspopup="menu" aria-label="Lead partner: ${esc(lp.n)}. Change it">${avP(lp)}<span>${esc(lp.n)}</span>${I('chev-d', 'xs')}</button></div>`
        + `<div class="dtp-r"><span class="k">Runs it</span><button class="dtp-v" data-pop="#fr-p-own" aria-haspopup="menu" aria-label="Runs the relationship: ${TEAM[f.own].n}. Change it">${avT(f.own)}<span>${TEAM[f.own].n}</span>${I('chev-d', 'xs')}</button></div>`
        + `<div class="dtp-r"><span class="k">Next step</span>${n.m ? `<button class="dtp-v fr-snx" data-a="cal" aria-label="${esc(n.t)}, ${esc(n.d)}. Open in Meetings">${I('cal', 'xs')}<span>${esc(n.t)}, ${esc(n.d)}</span></button>` : `<span class="dtp-v static fr-snx${n.late ? ' late' : ''}">${esc(n.t)}${n.d ? `<span class="muted">, ${esc(n.d)}</span>` : ''}</span>`}</div>`
        + `<div class="dtp-r"><span class="k">Last touch</span><span class="dtp-v static">${lastTouch(f)}</span></div>`
        + (f.st === 'in' ? `<div class="dtp-r"><span class="k">Commitment</span><span class="dtp-v static"><span class="seg2 fr-hs" role="group" aria-label="Commitment"><button aria-pressed="${!f.commit.hard}" data-v="soft">Soft-circled</button><button aria-pressed="${f.commit.hard}" data-v="hard">Hard</button></span></span></div>` : '')
        + `</div>`)
      + section('thesis', 'Thesis', `<p class="fr-th">${esc(f.thesis)}</p><div class="dtp-tags fr-tags">${f.sec.map(sectag).join('')}<span class="tag">${FOCUS[f.focus]}</span></div>`)
      + section('fit', `Fit, ${f.fit}`, `<div class="sbx fr-sbx"><div class="sbx-top"><div class="sbx-g" role="meter" aria-label="Fit" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${f.fit}"><svg viewBox="0 0 200 108" aria-hidden="true">${fitGauge(fit.F)}</svg><div class="sbx-v"><b class="num">${f.fit}</b><span class="muted">of 100</span></div></div><div class="sbx-s"><b>${fitBand(f.fit)}</b><span class="muted">Weakest: ${fit.F[weak].n.toLowerCase()}</span></div></div>`
        + `<div class="sbx-list">${fit.F.map((x, i) => `<div class="sbx-r" data-i="${i}"><div class="sbx-rh"><i style="background:${FITC[i]}"></i><span class="n"><span>${x.n}</span>${i === weak && x.e < x.w ? '<span class="tag warn">Weakest</span>' : ''}</span><span class="e num">${x.e}/${x.w}</span><span class="bar"><i style="width:${x.e / x.w * 100}%;background:${FITC[i]}"></i></span><span></span><span class="sbx-nt">${esc(x.note)}</span></div></div>`).join('')}</div></div>`)
      + section('conf', 'Portfolio conflicts', `<ul class="fr-pl">${f.port.map(c => `<li><span class="pfm-lg xs" aria-hidden="true">${c[0]}</span><span>${esc(c)}</span>${c === f.conflict ? `<span class="tag bad">Competes</span>` : ''}</li>`).join('')}</ul><p class="muted fr-pn">${f.conflict ? `${f.conflict} builds ${RIVAL[f.conflict]}.` : `None of their ${plural(f.port.length, 'company', 'companies')} here competes with us.`}</p>`, f.conflict ? '<span class="tag bad fr-shc">1</span>' : '')
      + section('ppl', `People, ${f.ppl.length}`, `<ul class="fr-ppl">${f.ppl.map((p, i) => { const pv = v.filter(x => x.p === p.id); return `<li>${avP(p)}<span><b>${esc(p.n)}</b><span class="muted">${p.r}${i === f.lead ? ', leads for us' : ''}${pv.length ? `, ${mins(sum(pv, x => x.s))} in the room` : ''}</span></span></li>`; }).join('')}</ul>`)
      + section('path', 'Intro path', pathBlock(f, bp))
      + section('mtg', `Meetings and notes, ${Ms.length}`, Ms.length || f.log.length ? `<ul class="fr-tl">${[...f.log.map(x => ({ k:x.k, day:x.day, t:x.t, w:x.by, log:true })), ...Ms.slice().reverse().map(m => ({ m, k:m.kind, day:m.day, t:m.note || (m.st === 'plan' ? 'Booked' : ''), w:m.who.map(o => first(TEAM[o].n)).join(' and ') }))].sort((a, b) => b.day - a.day).map(x => `<li${x.m && x.m.st === 'plan' ? ' class="plan"' : ''}><span class="ic">${I(x.log ? 'mail' : x.m.st === 'plan' ? 'cal' : 'users', 'xs')}</span><span><b>${esc(x.k)}</b>${x.t ? ` ${esc(x.t)}` : ''}<span class="w num">${x.m && x.m.st === 'plan' ? fmtDW(x.day) + ', ' + tmA(x.m.h) : x.day === 0 ? 'Today' : fmtD(x.day)}, ${esc(x.w)}</span></span></li>`).join('')}</ul>` : '<p class="muted fr-pn">No meetings yet.</p>')
      + section('room', `Data room${v.length ? ', ' + mins(sum(v, x => x.s)) : ''}`, v.length ? `<div class="fr-rv">${f.ppl.filter(p => v.some(x => x.p === p.id)).map(p => { const pv = v.filter(x => x.p === p.id), docs = [...new Set(pv.map(x => x.d))], s = sum(pv, x => x.s), mx = Math.max(...f.ppl.map(q => sum(v.filter(x => x.p === q.id), x => x.s)));
          return `<div class="fr-rvp">${avP(p)}<span class="t"><b>${esc(first(p.n))}</b><span class="muted">${plural(docs.length, 'document')}, last ${ago(-Math.max(...pv.map(x => x.day)))}</span></span><span class="fr-bar"><i style="width:${s / mx * 100}%"></i></span><span class="num">${mins(s)}</span></div>`; }).join('')}</div>${quietDays(f) ? `<p class="fr-pn fr-qn">${I('history', 'xs')}No views in ${quietDays(f)} days.</p>` : ''}` : `<p class="muted fr-pn">${ST[f.st].i >= 2 ? 'Nothing opened yet.' : 'The room opens after the first meeting.'}</p>`)
      + (f.ts ? section('ts', 'Term sheet', `<div class="dtp-rows">${[['Investment', M(f.ts.amt)], ['Pre-money', M(f.ts.pre)], ['Effective pre', M(termsOf(f).eff)], ['Participation', f.ts.part], ['No-shop', f.ts.noShop + ' days'], ['Expires', fmtDW(f.ts.exp)]].map(([k, x]) => `<div class="dtp-r"><span class="k">${k}</span><span class="dtp-v static num">${esc(x)}</span></div>`).join('')}</div>`) : '')
      + `<div class="fr-sact"><button class="pill soft sm fr-prepb" data-a="prep">${I('spark', 'xs')}${n.m ? 'Prep for ' + n.m.kind.toLowerCase() : 'Prep note'}</button><button class="pill line sm" data-a="note">${I('edit', 'xs')}Log a note</button></div>`;
    dtp.innerHTML = h;
    sheet.setAttribute('aria-labelledby', 'fr-sh-t');
    const hs = $('.fr-hs', dtp); if (hs) seg(hs, val => { const was = f.commit.hard; f.commit.hard = val === 'hard'; refresh(); toast('ok', `${f.n}: ${f.commit.hard ? 'hard commit' : 'soft-circled'}`, `${M(hardM())} hard, ${M(softM())} soft-circled`, { label:'Undo', run:() => { f.commit.hard = was; refresh(); } }); });
  }
  const lastTouch = f => { const d = Math.max(...[...meetsOf(f).filter(m => m.st === 'held').map(m => m.day), ...f.log.map(x => x.day), f.introDay != null ? f.introDay : -999, f.ts ? f.ts.rec : -999, f.commit ? f.commit.day : -999, f.st === 'out' && f.passDay != null ? f.passDay : -999]); return d === -999 ? 'Not yet' : d === 0 ? 'Today' : `${fmtD(d)}, ${ago(-d)}`; };
  function pathBlock(f, bp){
    if (f.intro === 'existing') return `<p class="fr-pn">Our seed lead. ${esc(leadOf(f).n)} sits on the board.</p>`;
    if (!f.paths.length) return `<p class="fr-pn muted">No one in our network knows them. The agent drafted a cold email to ${esc(leadOf(f).n)}.</p>`;
    const chain = (x, on) => { const p = f.ppl[x.to]; return `<div class="fr-chain${on ? ' on' : ''}">${avT('AB')}<i class="ln"></i>${avC(x.via)}<i class="ln"></i>${avP(p)}<span class="t"><b>${esc(first(CON[x.via].n))} to ${esc(first(p.n))}</b><span class="muted">${esc(CON[x.via].r)}</span></span>${strength(x.s)}</div>`; };
    const st = { none:'Not asked yet', asked:`Asked ${f.via ? first(CON[f.via].n) + ' ' : ''}${ago(-(f.introDay || 0))}`, made:`Introduced ${f.introDay != null ? fmtD(f.introDay) : ''}${f.via ? ' by ' + CON[f.via].n : ''}` }[f.intro] || '';
    return f.paths.slice().sort((a, b) => b.s - a.s).map((x, i) => chain(x, i === 0)).join('') + `<p class="fr-pn muted">${st}</p>`;
  }
  function openSheet(id, focus = false){
    const was = sheetFor; sheetFor = id; if (was !== id) prepFor = null; closeCalPop(); renderSheet();
    sheet.inert = false; sheet.classList.add('on'); app.classList.add('sh');
    $$('.kbx-k', cols).forEach(k => k.classList.toggle('open', k.dataset.id === id));
    if (focus || (document.activeElement && document.activeElement.closest('.kbx-k,.cpl,.aib,.ecx,.fr-rd,.fr-dr,.fr-int,.fr-ts'))) setTimeout(() => $('[data-a="close"]', dtp).focus({ preventScroll:true }), 60);
    if (was !== id && !REDUCE) dtp.animate([{ opacity:0, transform:'translateY(4px)' }, { opacity:1, transform:'none' }], { duration:240, easing:'ease-out' });
  }
  let sheetBack = null;
  function closeSheet(){
    if (!sheetFor) return;
    const id = sheetFor, inside = sheet.contains(document.activeElement); sheetFor = null; prepFor = null; sheet.classList.remove('on'); sheet.inert = true; app.classList.remove('sh');
    $$('.kbx-k.open', cols).forEach(k => k.classList.remove('open'));
    if (!inside) return;
    const k = view === 'investors' && $(`.kbx-k[data-id="${id}"]`, cols); if (k){ k.tabIndex = 0; return k.focus({ preventScroll:true }); }
    if (sheetBack && sheetBack.isConnected) sheetBack.focus({ preventScroll:true }); else $('#content', app).focus({ preventScroll:true });
  }
  app.addEventListener('focusin', e => { if (!sheet.contains(e.target)) sheetBack = e.target; });
  dtp.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const f = fundOf(sheetFor);
    if (b.dataset.sec){ const fo = b.nextElementSibling, open = fo.classList.toggle('shut') === false; b.setAttribute('aria-expanded', open); open ? shut.delete(b.dataset.sec) : shut.add(b.dataset.sec); return; }
    const a = b.dataset.a;
    if (a === 'close') closeSheet();
    if (a === 'link'){ const url = location.origin + location.pathname + '#' + f.id; (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).catch(() => {}); toast('ok', 'Link copied', f.n + ' opens with its details'); }
    if (a === 'sug'){ const s = sugOf(f); if (!s) return; if (s.item) approve(s.item); else if (s.go){ closeSheet(); setView(s.go); } else if (s.prep) prep(f, b); }
    if (a === 'prep') prep(f, b);
    if (a === 'prepx'){ prepFor = null; renderSheet(); }
    if (a === 'note'){ logOf(f, 'Note', `Called ${first(leadOf(f).n)}: still keen, waiting on their Monday partner meeting.`); refresh(); toast('ok', 'Note logged', `${f.n}, last touch is now today`, { label:'Undo', run:() => { f.log.shift(); refresh(); } }); const li = $('.fr-tl li', dtp); if (li) enter(li); }
    if (a === 'cal'){ const m = nextOf(f).m; if (m){ closeSheet(); showMeeting(m); } }
  });
  // the agent writes a prep note: a moment of thinking, then the note at the top of the sheet
  function prep(f, b){
    b.disabled = true; b.innerHTML = '<span class="think on"><i></i><i></i><i></i><i></i></span>Writing';
    setTimeout(() => { if (sheetFor !== f.id) return; prepFor = f.id; renderSheet(); const n = $('.fr-prep', dtp); if (n){ enter(n); dtp.closest('.fr-sheet').scrollTo({ top:0, behavior:REDUCE ? 'auto' : 'smooth' }); } }, REDUCE ? 0 : 900);
  }
  // the sheet's menus are built as they open
  dtp.addEventListener('click', e => {
    const b = e.target.closest('[data-pop]'); if (!b) return; const f = fundOf(sheetFor);
    if (b.dataset.pop === '#fr-p-stage'){ const p = pop('fr-p-stage'); p.innerHTML = `<div class="ph" role="none">Move ${esc(short(f))} to</div>` + STAGES.map(s => mi(`data-s="${s.k}"`, stag(s.k), 'menuitemradio', f.st === s.k)).join(''); $$('.mi', p).forEach(m => m.onclick = () => moveFund(f, m.dataset.s)); }
    if (b.dataset.pop === '#fr-p-lead'){ const p = pop('fr-p-lead'); p.innerHTML = `<div class="ph" role="none">Lead partner</div>` + f.ppl.map((q, i) => mi(`data-i="${i}"`, `${avP(q)}<span>${esc(q.n)}<span class="d">${q.r}</span></span>`, 'menuitemradio', f.lead === i)).join(''); $$('.mi', p).forEach(m => m.onclick = () => { const was = f.lead; if (was === +m.dataset.i) return; f.lead = +m.dataset.i; refresh(); toast('ok', `${leadOf(f).n} now leads for ${short(f)}`, 'Cards, drafts and prep notes follow', { label:'Undo', run:() => { f.lead = was; refresh(); } }); }); }
    if (b.dataset.pop === '#fr-p-own'){ const p = pop('fr-p-own'); p.innerHTML = `<div class="ph" role="none">Runs the relationship</div>` + Object.keys(TEAM).map(o => mi(`data-o="${o}"`, `${avT(o)}<span>${TEAM[o].n}<span class="d">${TEAM[o].r}</span></span>`, 'menuitemradio', f.own === o)).join(''); $$('.mi', p).forEach(m => m.onclick = () => { const was = f.own; if (was === m.dataset.o) return; f.own = m.dataset.o; refresh(); toast('ok', `${first(TEAM[f.own].n)} now runs ${short(f)}`, '', { label:'Undo', run:() => { f.own = was; refresh(); } }); }); }
  }, true);

  /* ---------- Intros: the warm paths, the network behind the fund picked, and the agent's email ---------- */
  const iv = $('#fr-v-intros', app), il = $('.fr-il', iv), net = $('.fr-net', iv), drf = $('.fr-drf', iv);
  const introList = () => {
    const L = FUNDS.filter(f => introTab === 'open' ? f.st === 'res' : introTab === 'asked' ? f.st === 'intro' : f.intro !== 'existing');
    return L.sort((a, b) => (introTab === 'all' ? ST[a.st].i - ST[b.st].i : 0) || b.fit - a.fit || a.n.localeCompare(b.n));
  };
  seg($('.fr-isg', iv), v => { introTab = v; introFor = null; renderIntros(); stagger($$('.fr-ir2', il).slice(0, 10), 22); });
  function renderIntros(){
    const L = introList(); if (!L.some(f => f.id === introFor) && !(pinIntro && introFor === pinIntro)) introFor = L[0] ? L[0].id : null;
    const open = FUNDS.filter(f => f.st === 'res'), cold = open.filter(f => !f.paths.length).length;
    swap($('.fr-ips', iv), `${plural(open.length - cold, 'warm path')} to ask, ${cold} cold, ${FUNDS.filter(f => f.st === 'intro').length} waiting`);
    il.innerHTML = L.length ? L.map(f => { const bp = bestPath(f), p = bp ? f.ppl[bp.to] : leadOf(f), x = ibOf(f, ['intro']);
      return `<button class="fr-ir2${f.id === introFor ? ' on' : ''}" role="option" aria-selected="${f.id === introFor}" data-f="${f.id}">${tile(f, 'sm')}<span class="t"><b>${esc(f.n)}</b><span class="muted">${esc(p.n)}, fit ${f.fit}</span></span>`
        + `<span class="fr-via">${bp ? `${avC(bp.via)}<span>${esc(first(CON[bp.via].n))}</span>` : '<span class="muted">No warm path</span>'}</span>${bp ? strength(bp.s) : '<span></span>'}`
        + `<span class="fr-ist">${f.st === 'res' ? (x ? `<span class="tag fr-dft">Draft ready</span>` : '') : f.st === 'intro' ? `<span class="muted">Asked ${ago(-(f.introDay || 0))}</span>` : stag(f.st)}</span></button>`; }).join('') : `<p class="muted fr-none">${introTab === 'open' ? 'Every warm path is asked. New funds you add to Researching show here.' : 'Nothing here.'}</p>`;
    renderNet(); renderDraft();
  }
  il.addEventListener('click', e => { const b = e.target.closest('.fr-ir2'); if (!b) return; introFor = b.dataset.f; pinIntro = null; $$('.fr-ir2', il).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); renderNet(); renderDraft(); if (!REDUCE){ enter(net); enter(drf, 60); } });
  il.addEventListener('keydown', e => { const b = e.target.closest('.fr-ir2'); if (!b || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return; e.preventDefault(); const n = e.key === 'ArrowDown' ? b.nextElementSibling : b.previousElementSibling; if (n){ n.focus(); n.click(); } });
  // the network: us on the left, the people we know in the middle, the fund's partners on the right; the warmest path is drawn
  // in the accent, every other tie in grey
  function renderNet(){
    const f = fundOf(introFor), svg = $('.fr-nsv', net), nodes = $('.fr-nodes', net);
    if (!f){ svg.innerHTML = ''; nodes.innerHTML = ''; $('.fr-nett', net).textContent = 'Network'; $('.fr-nets', net).textContent = ''; return; }
    const bp = bestPath(f), vias = [...new Set(f.paths.map(x => x.via))], others = CK.filter(c => !vias.includes(c)).slice(0, Math.max(0, 3 - vias.length));
    const mid = [...vias, ...others], H = 100, y = (i, n) => (n === 1 ? 42 : 8 + i * (72 / (n - 1)));
    const pos = { me:[6, 42] }; mid.forEach((c, i) => pos[c] = [42, y(i, mid.length)]); f.ppl.forEach((p, i) => pos[p.id] = [74, y(i, f.ppl.length)]);
    const lines = [...mid.map(c => ({ a:'me', b:c, on:bp && bp.via === c, dim:!vias.includes(c) })), ...f.paths.map(x => ({ a:x.via, b:f.ppl[x.to].id, on:bp && x === bp, s:x.s }))];
    svg.setAttribute('viewBox', `0 0 100 ${H}`); svg.setAttribute('preserveAspectRatio', 'none');
    svg.innerHTML = lines.sort((a, b) => a.on - b.on).map(l => `<line x1="${pos[l.a][0]}" y1="${pos[l.a][1]}" x2="${pos[l.b][0]}" y2="${pos[l.b][1]}" class="${l.on ? 'on' : l.dim ? 'dim' : ''}"${l.s ? ` stroke-dasharray="${l.s === 1 ? '2 3' : 'none'}"` : ''}/>`).join('');
    const node = (k, av, n, s, side, dim) => `<span class="fr-nd ${side}${dim ? ' dim' : ''}${bp && (k === bp.via || k === f.ppl[bp.to].id || k === 'me') ? ' on' : ''}" style="left:${pos[k][0]}%;top:${pos[k][1]}%">${av}<span class="t"><b>${esc(n)}</b><span class="muted">${esc(s)}</span></span></span>`;
    nodes.innerHTML = node('me', avT('AB'), 'You', 'Ada Brennan', 'l') + mid.map(c => node(c, avC(c), CON[c].n, vias.includes(c) ? CON[c].r.split(',')[0] : 'No tie to them', 'm', !vias.includes(c))).join('') + f.ppl.map(p => node(p.id, avP(p), p.n, p.r, 'r')).join('');
    swap($('.fr-nett', net), `How you reach ${short(f)}`);
    $('.fr-nets', net).textContent = bp ? `${plural(f.paths.length, 'path')}. The warmest goes through ${CON[bp.via].n}` : 'No one you know knows them';
  }
  // the agent's forwardable email: Draft review, with Discard and Approve and send
  function renderDraft(){
    const f = fundOf(introFor); drf.classList.remove('sent');
    if (!f){ drf.innerHTML = '<p class="muted fr-none">Pick a fund to see its intro.</p>'; return; }
    const x = IB.find(y => y.kind === 'intro' && y.f === f.id);
    const sent = x && x.state === 'done' && f.id === pinIntro, draft = x && x.state === 'wait' && f.st === 'res';
    if (!sent && !draft){
      const via = f.via ? CON[f.via] : null, res = f.st === 'res';
      drf.innerHTML = `<div class="drf-h"><span class="drf-ag">${I('users', 's')}</span><div class="drf-ht"><b>${res ? 'No draft' : f.st === 'intro' ? 'Waiting on the intro' : f.intro === 'existing' ? 'Existing investor' : 'Introduced'}</b><span class="muted">${res ? 'You discarded the agent\'s draft' : f.st === 'intro' ? `${via ? via.n + ' was' : 'They were'} asked ${ago(-(f.introDay || 0))}` : `${esc(short(f))} is in ${ST[f.st].t}`}</span></div>${stag(f.st)}</div>`
        + `<p class="fr-dp">${res ? `The agent can write it again from the warmest path.` : f.st === 'intro' ? `When ${via ? first(via.n) + ' makes' : 'they make'} the intro, mark it and the agent books a first meeting with ${esc(leadOf(f).n)} in the first free slot.` : `The intro is done. ${esc(nextOf(f).t)}${nextOf(f).d ? ', ' + esc(nextOf(f).d) : ''}.`}</p>`
        + `<div class="drf-f"><button class="pill line sm" data-d="open">${I('panel', 'xs')}Open ${esc(short(f))}</button><span class="sp"></span>${res && x ? `<button class="pill primary sm" data-d="again">${I('spark', 'xs')}Draft it again</button>` : f.st === 'intro' ? `<button class="pill primary sm" data-d="made">${I('check', 'xs')}Intro made, book a meeting</button>` : ''}</div>`;
      return;
    }
    const p = personOf(x.to), to = x.via ? CON[x.via] : p;
    drf.innerHTML = `<div class="drf-h"><span class="drf-ag">${I('spark', 's')}</span><div class="drf-ht"><b>${x.state !== 'wait' ? (x.via ? 'Intro request sent' : 'Cold email sent') : x.via ? 'Intro request, drafted by the agent' : 'Cold email, drafted by the agent'}</b><span class="muted">${x.via ? `Forwardable, with a blurb for ${esc(p.n)}` : 'No warm path, so it goes to the partner'}</span></div><span class="tag drf-tag">${x.state === 'wait' ? 'Not sent' : x.res}</span></div>`
      + `<div class="drf-fs"><div class="drf-r"><span class="drf-l">To</span><span class="drf-p">${x.via ? avC(x.via) : avP(p)}${esc(to.n)}</span></div><label class="drf-r"><span class="drf-l">Subject</span><input class="drf-s" value="${esc(x.subj)}" aria-label="Subject"></label></div>`
      + `<div class="drf-b" contenteditable="${x.state === 'wait'}" role="textbox" aria-multiline="true" aria-label="Message" spellcheck="false">${esc(x.body).replace(/\n/g, '<br>')}</div>`
      + (x.state === 'wait' ? `<div class="drf-f"><button class="pill ghost sm" data-d="dismiss">${I('trash', 'xs')}Discard</button><span class="sp"></span><span class="muted drf-when">Sends as Ada</span><button class="pill primary sm" data-d="send">${I('send', 'xs')}Approve and send</button></div>`
        : `<div class="drf-done">${I('ok', 's')}<span class="t"><b>${esc(x.res)}</b><span class="muted">${esc(short(f))} moved to ${ST[f.st].t}</span></span>${x.undo ? '<button class="pill sm" data-d="undo">Undo</button>' : ''}</div>`);
    drf.classList.toggle('sent', x.state !== 'wait');
    const save = () => { const b = $('.drf-b', drf), s = $('.drf-s', drf); if (b && x.state === 'wait'){ x.body = b.innerText.trim(); x.subj = s.value.trim() || x.subj; } };
    $('.drf-b', drf).addEventListener('blur', save); $('.drf-s', drf).addEventListener('change', save);
  }
  drf.addEventListener('click', e => {
    const b = e.target.closest('[data-d]'); if (!b) return; const f = fundOf(introFor), x = IB.find(y => y.kind === 'intro' && y.f === f.id);
    if (b.dataset.d === 'open') return openSheet(f.id, true);
    if (b.dataset.d === 'send'){ const s = $('.drf-s', drf); if (s) x.subj = s.value.trim() || x.subj; x.body = $('.drf-b', drf).innerText.trim(); pinIntro = f.id; approve(x); const d = $('.drf-done', drf); if (d) enter(d); return; }
    if (b.dataset.d === 'again'){ x.state = 'wait'; x.res = ''; refresh(); enter(drf); return; }
    if (b.dataset.d === 'dismiss'){ x.state = 'gone'; x.res = 'Discarded'; refresh(); toast('info', 'Draft discarded', f.n, { label:'Undo', run:() => { x.state = 'wait'; refresh(); } }); return; }
    if (b.dataset.d === 'undo' && x.undo){ x.undo(); x.undo = null; pinIntro = null; refresh(); return; }
    if (b.dataset.d === 'made'){ const s = freeSlot(.75, 1), m = meet({ f:f.id, k:'first', day:s.day, h:s.h, own:f.own }); m.by = 'agent'; const undo = setStage(f, 'first'), wi = f.intro; f.intro = 'made';
      refresh(); toast('ok', `First meeting booked with ${leadOf(f).n}`, `${fmtDW(m.day)}, ${tmA(m.h)}. ${f.n} moved to First meeting`, { label:'Undo', run:() => { MT = MT.filter(y => y !== m); undo(); f.intro = wi; refresh(); } }); }
  });

  /* ---------- Data room: the documents, the views per investor, the most read, and who went quiet ---------- */
  const dr = $('#fr-v-room', app), tree = $('.fxp-tree', dr), dtt = $('.fr-dtt', dr);
  const fshut = new Set();
  const DSORT = { s:'time' , desc:true };
  function renderRoom(){
    const tot = sum(VW, x => x.s);
    $('.fr-fxs', dr).textContent = `${plural(DOCS.length, 'document')}, ${plural(VW.length, 'view')}`;
    const row = d => { const n = VW.filter(x => x.d === d.id).length; return `<button class="fxp-n${roomDoc === d.id ? ' sel' : ''}" role="treeitem" aria-selected="${roomDoc === d.id}" data-doc="${d.id}" style="padding-left:28px"><span class="ic">${I(d.ic, 'xs')}</span><span class="nm">${esc(d.n)}</span><span class="fr-vc num" aria-label="${plural(n, 'view')}">${n}</span></button>`; };
    tree.innerHTML = `<button class="fxp-n${roomDoc === 'all' ? ' sel' : ''}" role="treeitem" aria-selected="${roomDoc === 'all'}" data-doc="all"><span class="cv"></span><span class="ic">${I('layers', 'xs')}</span><span class="nm">All documents</span><span class="fr-vc num">${VW.length}</span></button>`
      + FOLDERS.map(fo => `<div role="group" aria-label="${fo}"><button class="fxp-n${fshut.has(fo) ? '' : ' open'}" role="treeitem" aria-expanded="${!fshut.has(fo)}" data-fo="${esc(fo)}"><span class="cv">${I('chev-r', 'xs')}</span><span class="ic">${I('folder', 'xs')}</span><span class="nm">${fo}</span></button><div class="fxp-k${fshut.has(fo) ? ' shut' : ''}"><div>${DOCS.filter(d => d.fo === fo).map(row).join('')}</div></div></div>`).join('');
    $('.fxp-st', dr).textContent = `${mins(tot)} read in total`;
    renderDocTable(); renderQuiet(); renderMost();
  }
  tree.addEventListener('click', e => { const b = e.target.closest('.fxp-n'); if (!b) return;
    if (b.dataset.fo){ const fo = b.dataset.fo; fshut.has(fo) ? fshut.delete(fo) : fshut.add(fo); b.classList.toggle('open'); b.setAttribute('aria-expanded', !fshut.has(fo)); b.nextElementSibling.classList.toggle('shut'); return; }
    roomDoc = b.dataset.doc; $$('.fxp-n[data-doc]', tree).forEach(x => { x.classList.toggle('sel', x === b); x.setAttribute('aria-selected', x === b); }); renderDocTable(); stagger($$('tbody tr', dtt).slice(0, 12), 18); });
  function renderDocTable(){
    const d = roomDoc === 'all' ? null : docOf(roomDoc), V = d ? VW.filter(x => x.d === d.id) : VW;
    const funds = [...new Set(V.map(x => x.f))].map(fundOf), tot = sum(V, x => x.s);
    $('.fr-dh', dr).innerHTML = `<div class="fr-dht"><span class="ic">${I(d ? d.ic : 'layers', 's')}</span><span><b>${d ? esc(d.n) : 'All documents'}</b><span class="muted">${d ? `${d.fo}, ${d.meta}` : `${plural(DOCS.length, 'document')} in ${plural(FOLDERS.length, 'folder')}`}</span></span></div>`
      + `<div class="fr-dst">${[['Views', V.length], ['Funds', funds.length], ['Time read', mins(tot)], [d ? 'Read on average' : 'Gone quiet', d ? Math.round(sum(V, x => x.rd) / (V.length || 1) * 100) + '%' : FUNDS.filter(quietDays).length]].map(([k, v]) => `<div><span class="muted">${k}</span><b class="num"${k === 'Gone quiet' ? ' data-k="quiet"' : ''}>${v}</b></div>`).join('')}</div>`;
    // one row per person who opened it: their fund, views, time with a bar, how much they read, and when they last opened it
    const R = d ? [...new Set(V.map(x => x.p))].map(pid => { const p = personOf(pid), pv = V.filter(x => x.p === pid); return { f:fundOf(p.f), p, n:pv.length, s:sum(pv, x => x.s), rd:Math.max(...pv.map(x => x.rd)), last:-Math.max(...pv.map(x => x.day)) }; })
      : funds.map(f => { const fv = V.filter(x => x.f === f.id); return { f, p:null, n:fv.length, s:sum(fv, x => x.s), docs:new Set(fv.map(x => x.d)).size, last:-Math.max(...fv.map(x => x.day)) }; });
    const key = { time:r => r.s, views:r => r.n, last:r => -r.last, name:r => (r.p ? r.p.n : r.f.n).toLowerCase(), stage:r => ST[r.f.st].i };
    R.sort((a, b) => { const x = key[DSORT.s](a), y = key[DSORT.s](b); return (x > y ? 1 : x < y ? -1 : 0) * (DSORT.desc ? -1 : 1); });
    const mx = Math.max(...R.map(r => r.s), 1);
    const th = (k, t, cls = '') => `<th class="${cls}"><button class="ttx-s${DSORT.s === k ? ' on' + (DSORT.desc ? ' desc' : '') : ''}" data-k="${k}">${t}<span class="ar">${I('chev-u', 'xs')}</span></button></th>`;
    $('thead', dtt).innerHTML = `<tr>${th('name', d ? 'Person' : 'Fund')}${th('stage', 'Stage', 'fr-c-s')}${th('views', 'Views', 'r fr-c-v')}${th('time', 'Time read', 'fr-c-t')}<th class="fr-c-o">${d ? 'Read' : 'Opened'}</th>${th('last', 'Last opened', 'fr-c-l')}</tr>`;
    $('tbody', dtt).innerHTML = R.length ? R.map(r => { const q = quietDays(r.f);
      return `<tr data-id="${r.f.id}" tabindex="-1"><td><span class="fr-who">${r.p ? avP(r.p) : tile(r.f, 'sm')}<span class="tx"><b>${esc(r.p ? r.p.n : r.f.n)}</b><span class="muted">${esc(r.p ? r.f.n : leadOf(r.f).n)}</span></span></span></td><td>${stag(r.f.st)}</td><td class="r num">${r.n}</td>`
        + `<td><span class="fr-tr"><span class="fr-bar"><i style="width:${(r.s / mx * 100).toFixed(1)}%"></i></span><span class="num">${mins(r.s)}</span></span></td><td class="num">${r.p ? Math.round(r.rd * 100) + '%' : `${r.docs} of ${DOCS.length}`}</td><td class="num${q ? ' fr-late' : ''}">${q ? I('history', 'xs') : ''}${ago(r.last)}</td></tr>`; }).join('')
      : `<tr class="ttx-empty"><td colspan="6"><div class="ttx-em"><span class="ic">${I('eye')}</span><b>Nobody has opened it yet</b><span>It opens to funds in ${ST[STAGES[d.need].k].t} and later.</span></div></td></tr>`;
  }
  dtt.addEventListener('click', e => { const s = e.target.closest('.ttx-s'); if (s){ const k = s.dataset.k; if (DSORT.s === k) DSORT.desc = !DSORT.desc; else { DSORT.s = k; DSORT.desc = k !== 'name'; } renderDocTable(); return; }
    const tr = e.target.closest('tr[data-id]'); if (tr) openSheet(tr.dataset.id); });
  dtt.addEventListener('keydown', e => { const tr = e.target.closest('tr[data-id]'); if (!tr || e.target !== tr) return; if (e.key === 'Enter'){ e.preventDefault(); openSheet(tr.dataset.id, true); } if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); const n = e.key === 'ArrowDown' ? tr.nextElementSibling : tr.previousElementSibling; if (n){ tr.tabIndex = -1; n.tabIndex = 0; n.focus(); } } });
  function renderQuiet(){
    const Q = FUNDS.filter(quietDays).sort((a, b) => quietDays(b) - quietDays(a));
    $('.fr-ql', dr).innerHTML = Q.length ? Q.map(f => { const d = lastDoc(f), x = ibOf(f, ['nudge']);
      return `<div class="fr-qr" role="listitem">${tile(f, 'sm')}<button class="t" data-open="${f.id}"><b>${esc(f.n)}</b><span class="muted">Last opened ${d ? esc(d.l) : 'the room'} ${quietDays(f)} days ago</span></button><span class="fr-qa">${stag(f.st)}${x ? `<button class="pill line sm" data-nudge="${x.id}">${I('send', 'xs')}Nudge</button>` : `<span class="fr-ndg muted">${I('check', 'xs')}Nudged</span>`}</span></div>`; }).join('') : '<p class="muted fr-none">Every fund in play opened the room this week.</p>';
  }
  let mostBy = 'm';
  function renderMost(){
    const R = DOCS.map(d => { const V = VW.filter(x => x.d === d.id); return { d, m:Math.round(sum(V, x => x.s) / 60), f:new Set(V.map(x => x.f)).size }; }).sort((a, b) => b[mostBy] - a[mostBy]).slice(0, 6), mx = Math.max(...R.map(r => r[mostBy]), 1), tp = $('.fr-tp', dr);
    $('.tpx-tot', tp).textContent = Math.round(sum(VW, x => x.s) / 60).toLocaleString('en-US');
    $('.tpx-list', tp).innerHTML = R.map((r, i) => `<button class="tpx-r" data-doc="${r.d.id}" aria-label="${esc(r.d.n)}: ${r.m} minutes, ${plural(r.f, 'fund')}"><span class="rk num">${i + 1}</span><span class="pg"><span class="p">${esc(r.d.n)}</span><span class="tr"><i style="width:${(r[mostBy] / mx * 100).toFixed(1)}%"></i></span></span><span class="n num">${mostBy === 'm' ? r.m + 'm' : r.f}</span><span class="ch muted num">${mostBy === 'm' ? plural(r.f, 'fund') : r.m + 'm'}</span></button>`).join('');
  }
  seg($('.tpx-sg', dr), v => { mostBy = v; renderMost(); });
  dr.addEventListener('click', e => {
    const o = e.target.closest('[data-open]'); if (o) return openSheet(o.dataset.open, !e.detail);
    const n = e.target.closest('[data-nudge]'); if (n){ const x = IB.find(y => y.id === n.dataset.nudge); if (x) approve(x); return; }
    const t = e.target.closest('.tpx-r'); if (t){ roomDoc = t.dataset.doc; renderRoom(); }
  });

  /* ---------- Meetings: Event calendar's week, all seven days, filling the height ---------- */
  const ecx = $('.fr-ecx', app), cgrid = $('.ecx-grid', ecx), cdays = $('.ecx-days', ecx), cmsg = $('.ecx-msg', ecx), H0 = 8, HN = 11;
  let cday = -1;
  const mon = () => mon0 + wk * 7;
  const at = h => `calc(var(--dm-ph) * ${h - H0} + 1px)`, tall = n => `calc(var(--dm-ph) * ${n} - 3px)`;
  const PX = () => parseFloat(getComputedStyle(cgrid).getPropertyValue('--dm-ph')) || 48;
  cgrid.style.setProperty('--dm-days', 7);
  $('.ecx-tm', ecx).innerHTML = Array.from({ length:HN * 2 }, (_, i) => { const h = H0 + Math.floor(i / 2), h12 = h > 12 ? h - 12 : h; return i % 2 ? `<span class="hf"><i class="n">${h12}:30</i></span>` : `<span><i class="w">${h12}${h >= 12 ? 'pm' : 'am'}</i><i class="n">${h12}:00</i></span>`; }).join('');
  $('.fr-leg', ecx).innerHTML = Object.values(KINDS).map(k => `<span><i style="background:var(--dm-p${k[2]})"></i>${k[0]}</span>`).join('');
  const weekLabel = () => { const a = mon(), b = a + 6, sm = dateOf(a).getMonth() === dateOf(b).getMonth(); return `${fmtD(a)} to ${sm ? dateOf(b).getDate() : fmtD(b)}`; };
  function lanes(list){
    list.sort((a, b) => a.h - b.h || b.dur - a.dur);
    let g = [], end = -1; const groups = [];
    list.forEach(e => { if (g.length && e.h >= end){ groups.push(g); g = []; end = -1; } g.push(e); end = Math.max(end, e.h + e.dur); });
    if (g.length) groups.push(g);
    groups.forEach(gr => { const ends = []; gr.forEach(e => { let k = ends.findIndex(t => t <= e.h); if (k < 0){ k = ends.length; ends.push(0); } ends[k] = e.h + e.dur; e._l = k; }); gr.forEach(e => e._n = ends.length); });
  }
  const kindC = m => Object.values(KINDS).find(k => k[0] === m.kind)[2];
  function evEl(m){
    const f = fundOf(m.f), c = kindC(m), n = m._n || 1;
    const el = html(`<button class="ecx-e fr-ev${m.st === 'held' ? ' held' : ''}" data-m="${m.id}" style="top:${at(m.h)};height:${tall(m.dur)};left:calc(3px + (100% - 6px) * ${(m._l || 0) / n});width:calc((100% - 6px) / ${n} - ${n > 1 ? 2 : 0}px);background:var(--dm-p${c}-bg);color:var(--dm-p${c})" aria-label="${esc(f.n)}, ${m.kind}, ${fmtDW(m.day)} ${tmA(m.h)}${m.st === 'held' ? ', held' : ''}"><b>${esc(short(f))}</b><span>${m.kind.replace(' meeting', '').replace(' call', '')}, ${tm(m.h)}</span></button>`);
    el._m = m; return el;
  }
  function fitCal(){ const sc = $('.ecx-sc', ecx), h = sc.clientHeight; if (!h) return; const wide = cdays.getClientRects().length === 0 || getComputedStyle(cdays).display === 'none'; cgrid.style.setProperty('--dm-ph', Math.max(wide ? 40 : 56, Math.floor((h - (wide ? 33 : 9)) / HN)) + 'px'); }
  new ResizeObserver(() => { if (view === 'meetings') fitCal(); }).observe($('.ecx-sc', ecx));
  function renderCal(){
    closeCalPop();
    const m0 = mon();
    $('.fr-wkt', ecx).textContent = weekLabel();
    $$('.ecx-day', cgrid).forEach(x => x.remove());
    cgrid.insertAdjacentHTML('beforeend', [0, 1, 2, 3, 4, 5, 6].map(i => { const n = m0 + i; return `<div class="ecx-day${isWork(n) ? '' : ' fr-we'}" data-d="${i}"><div class="ecx-dh${n === 0 ? ' t' : ''}">${DAYN[dow(n)]} <b>${dateOf(n).getDate()}</b></div><div class="ecx-col" data-d="${i}"></div></div>`; }).join(''));
    for (let i = 0; i < 7; i++){
      const n = m0 + i, list = MT.filter(m => m.day === n); lanes(list);
      const cl = $(`.ecx-col[data-d="${i}"]`, cgrid);
      list.forEach(m => { const el = evEl(m); cl.appendChild(el); bind(el); });
      if (n === 0){ const t = new Date(), h = t.getHours() + t.getMinutes() / 60; if (h >= H0 && h <= H0 + HN) cl.insertAdjacentHTML('beforeend', `<div class="ecx-now" style="top:calc(var(--dm-ph) * ${(h - H0).toFixed(3)})"></div>`); }
    }
    cdays.innerHTML = [0, 1, 2, 3, 4, 5, 6].map(i => { const n = m0 + i, k = MT.filter(m => m.day === n).length; return `<button aria-pressed="false" data-d="${i}"${n === 0 ? ' class="t"' : ''} aria-label="${DAYL[dow(n)]} ${fmtD(n)}, ${plural(k, 'meeting')}"><span>${DAYN[dow(n)]}</span><b>${dateOf(n).getDate()}</b></button>`; }).join('');
    if (cday < 0) cday = wk === 0 ? -mon0 : 0;
    showDay(cday, false); fitCal(); counts();
  }
  function showDay(i, anim = true){ const was = cday; cday = i; $$('button', cdays).forEach(b => b.setAttribute('aria-pressed', +b.dataset.d === i)); $$('.ecx-day', cgrid).forEach((d, k) => d.classList.toggle('on', k === i)); if (anim && was !== i && cdays.getClientRects().length){ closeCalPop(); enter($$('.ecx-day', cgrid)[i]); } }
  cdays.addEventListener('click', e => { const b = e.target.closest('button'); if (b) showDay(+b.dataset.d); });
  $$('[data-wk]', ecx).forEach(b => b.onclick = () => { wk = +b.dataset.wk === 0 ? 0 : wk + +b.dataset.wk; cday = -1; renderCal(); stagger($$('.fr-ev', cgrid).slice(0, 20), 16); });
  function showMeeting(m){ setView('meetings'); wk = Math.floor((m.day - mon0) / 7); cday = m.day - mon(); renderCal(); const el = $(`.ecx-e[data-m="${m.id}"]`, cgrid); if (el){ el.scrollIntoView({ block:'nearest' }); el.focus({ preventScroll:true }); openCalPop(el); } }
  // a meeting's card: the fund, the kind, the people, the note or the agent's prep, and Open fund
  const cpop = html('<div class="ecx-pop fr-cpop" role="dialog" aria-label="Meeting"></div>'); ecx.appendChild(cpop);
  let popFor = null;
  function closeCalPop(){ if (!popFor) return; const back = cpop.contains(document.activeElement) && popFor; cpop.classList.remove('open'); popFor = null; if (back && back.isConnected) back.focus({ preventScroll:true }); }
  function openCalPop(el){
    const m = el._m; if (popFor === el){ closeCalPop(); return; }
    popFor = el; const f = fundOf(m.f), c = kindC(m);
    const who = [...m.who.map(o => avT(o)), ...f.ppl.slice(0, 2).map(p => avP(p))].join('');
    cpop.innerHTML = `<div class="ecx-ph"><i style="background:var(--dm-p${c})"></i><b>${esc(f.n)}</b><button class="ib ecx-px" aria-label="Close" data-tip="Close">${I('x', 'xs')}</button></div>`
      + `<div class="ecx-pt">${m.kind}${m.st === 'held' ? ', held' : ''}${m.by === 'agent' ? ', booked by the agent' : ''}</div><div class="ecx-pt num">${fmtDW(m.day)}, ${tm(m.h)} to ${tm(m.h + m.dur)}</div>`
      + `<div class="ecx-pw">${who}<span class="muted">${m.who.map(o => first(TEAM[o].n)).join(', ')}, ${f.ppl.slice(0, 2).map(p => esc(first(p.n))).join(', ')}</span></div>`
      + (m.note ? `<div class="ecx-note fr-mn">${I('edit', 'xs')}<span>${esc(m.note)}</span></div>` : '')
      + `<div class="ecx-pa"><button class="pill line sm" data-p="open">Open fund</button>${m.st === 'plan' ? `<button class="pill soft sm ecx-ask" data-p="prep">${I('spark', 'xs')}Prep with agent</button>` : ''}</div>`;
    const pr = ecx.getBoundingClientRect(), er = el.getBoundingClientRect(), w = cpop.offsetWidth || 288;
    let x = er.right - pr.left + 8; if (x + w > pr.width - 8) x = er.left - pr.left - w - 8; x = clamp(x, 8, Math.max(8, pr.width - w - 8));
    let y = er.top - pr.top; y = Math.max(8, Math.min(y, pr.height - cpop.offsetHeight - 8));
    cpop.style.left = x + 'px'; cpop.style.top = y + 'px'; cpop.classList.remove('open'); void cpop.offsetWidth; cpop.classList.add('open'); hideTip();
  }
  cpop.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; const m = popFor && popFor._m; if (!m) return;
    if (b.classList.contains('ecx-px')) return closeCalPop();
    if (b.dataset.p === 'open'){ const id = m.f; closeCalPop(); openSheet(id, true); return; }
    if (b.dataset.p === 'prep'){ b.innerHTML = '<span class="think on"><i></i><i></i><i></i><i></i></span>Writing'; b.disabled = true;
      setTimeout(() => { if (!b.isConnected) return; const y = Math.max(8, Math.min(parseFloat(cpop.style.top), ecx.clientHeight - cpop.offsetHeight - 160)); const nt = html(`<div class="ecx-note">${I('spark', 'xs')}<span>${esc(prepNote(fundOf(m.f), m))}</span></div>`); b.closest('.ecx-pa').before(nt); enter(nt); b.remove(); cpop.style.top = Math.max(8, Math.min(parseFloat(cpop.style.top), ecx.clientHeight - cpop.offsetHeight - 8)) + 'px'; }, REDUCE ? 0 : 900); }
  });
  document.addEventListener('pointerdown', e => { if (popFor && !cpop.contains(e.target) && !popFor.contains(e.target) && !e.target.closest('.fr-pop,.tst-t')) closeCalPop(); });
  // drag a booked meeting to another time or day, snapping to 15 minutes; a click without moving opens its card
  const colAt = i => $(`.ecx-col[data-d="${i}"]`, cgrid);
  function bind(el){
    const m = el._m;
    el.onclick = k => { if (!k.isTrusted || k.detail) return; openCalPop(el); const b = $('button', cpop); if (popFor === el && b) b.focus({ preventScroll:true }); };
    el.onpointerdown = d => {
      if (d.button) return;
      const sx = d.clientX, sy = d.clientY, i0 = m.day - mon(); let moved = false, ni = i0, nh = m.h;
      if (m.st === 'held'){ el.onpointerup = () => { el.onpointerup = null; openCalPop(el); }; return; }
      el.setPointerCapture(d.pointerId);
      el.onpointermove = mv => { const dx = mv.clientX - sx, dy = mv.clientY - sy; if (!moved && Math.hypot(dx, dy) < 5) return; if (!moved){ moved = true; el.classList.add('drag'); closeCalPop(); hideTip(); }
        nh = clamp(m.h + Math.round(dy / PX() * 4) / 4, H0, H0 + HN - m.dur);
        const under = document.elementsFromPoint(mv.clientX, mv.clientY).find(x => x.classList && x.classList.contains('ecx-col')); if (under) ni = +under.dataset.d;
        el.style.transform = `translateX(${colAt(ni).getBoundingClientRect().left - colAt(i0).getBoundingClientRect().left}px)`; el.style.top = at(nh); $('span', el).textContent = `${m.kind.replace(' meeting', '').replace(' call', '')}, ${tm(nh)}`; };
      el.onpointerup = el.onpointercancel = () => { el.onpointermove = el.onpointerup = el.onpointercancel = null; if (!moved){ openCalPop(el); return; }
        el.classList.remove('drag'); el.style.transform = '';
        const was = [m.day, m.h], day = mon() + ni; if ((was[0] === day && was[1] === nh) || day < 0){ renderCal(); if (day < 0) swap(cmsg, 'Meetings move to today or later'); return; }
        m.day = day; m.h = nh; const f = fundOf(m.f); refresh();
        swap(cmsg, `Moved ${short(f)} to ${DAYN[dow(day)]} ${tm(nh)}`);
        toast('ok', `${m.kind} with ${f.n} moved`, `${fmtDW(day)}, ${tmA(nh)}, was ${was[0] !== day ? fmtDW(was[0]) : tmA(was[1])}`, { label:'Undo', run:() => { [m.day, m.h] = was; refresh(); } });
        const e2 = $(`.ecx-e[data-m="${m.id}"]`, cgrid); if (e2) enter(e2);
      };
    };
  }

  /* ---------- Agent inbox: Agent inbox's groups and rows ---------- */
  const ibx = $('.fr-aib', app), igs = $('.aib-gs', ibx);
  const IBG = [['intro', 'Intro requests'], ['follow', 'Follow-ups after meetings'], ['nudge', 'Nudges for quiet funds'], ['reply', 'Term sheet replies'], ['book', 'Meetings to book'], ['fix', 'Pipeline fixes'], ['done', 'Done']];
  const IBS = { intro:['intro request'], follow:['follow-up'], nudge:['nudge'], reply:['reply', 'replies'], book:['meeting to book', 'meetings to book'], fix:['fix', 'fixes'] };
  const IBI = { intro:'users', follow:'mail', nudge:'history', reply:'file-text', book:'cal', fix:'wand' };
  let edFor = null;
  function ibWhy(x){
    const f = fundOf(x.f), p = x.to && personOf(x.to);
    if (x.kind === 'intro') return x.via ? `${CON[x.via].n} has a ${STR[(f.paths.find(y => y.via === x.via) || { s:2 }).s][0].toLowerCase()} tie to ${p.n}. The agent drafted a forwardable intro.` : `No one you know knows ${short(f)}. The agent drafted a cold email to ${p.n}.`;
    if (x.kind === 'follow') return `You met ${p.n} ${ago(-Math.max(...meetsOf(f).filter(m => m.st === 'held').map(m => m.day)))}. The agent drafted the thank-you with what they asked for.`;
    if (x.kind === 'nudge') return `${short(f)} hasn't opened the data room in ${quietDays(f)} days. The agent drafted a short update.`;
    if (x.kind === 'book') return `${short(f)} scored ${f.fit} and the first meeting went well. The agent books the partner meeting in the first free hour.`;
    if (x.kind === 'reply') return `A reply to ${short(f)}'s term sheet, from the comparison.`;
    return `${leadOf(f).n} said ${x.why.replace(/^They/, 'they')}. The agent suggests moving ${short(f)} to Passed.`;
  }
  const ibText = x => { const f = fundOf(x.f), p = x.to && personOf(x.to);
    if (x.kind === 'intro') return [x.via ? `Ask ${CON[x.via].n} for an intro to ${p.n}, ${f.n}` : `Cold email to ${p.n}, ${f.n}`, x.via ? `${STR[(f.paths.find(y => y.via === x.via) || { s:2 }).s][0]} tie. Forwardable, with a blurb for ${first(p.n)}. Fit ${f.fit}` : `No warm path. Fit ${f.fit}`];
    if (x.kind === 'follow' || x.kind === 'nudge' || x.kind === 'reply') return [`${x.kind === 'nudge' ? 'Nudge' : x.kind === 'reply' ? 'Reply' : 'Follow up with'} ${p.n}, ${f.n}`, `“${x.subj}”: ${x.body.split('\n').filter(Boolean)[1] || ''}`];
    if (x.kind === 'book') return [`Book a partner meeting with ${f.n}`, ibWhy(x)];
    return [`Move ${f.n} to Passed`, ibWhy(x)]; };
  const ibRow = x => { const [b, s] = ibText(x), wait = x.state === 'wait', f = fundOf(x.f), mail = ['intro', 'follow', 'nudge', 'reply'].includes(x.kind);
    return `<div class="aib-i fr-ii${wait ? '' : ' done'}" role="listitem" data-ib="${x.id}"><span class="aib-av" aria-hidden="true">${I(IBI[x.kind], 'xs')}</span><button class="aib-t fr-it" data-ia="open" aria-label="${esc(b)}. Open ${esc(f.n)}"><b>${esc(b)}</b><span>${esc(s)}</span></button>`
      + `<span class="aib-r">${wait ? `<button class="pill ghost sm" data-ia="dismiss" aria-label="Dismiss: ${esc(b)}">Dismiss</button>${mail ? `<button class="pill line sm" data-ia="edit" aria-label="Edit: ${esc(b)}">${I('edit', 'xs')}Edit</button>` : ''}<button class="pill primary sm" data-ia="ok" aria-label="Approve: ${esc(b)}">${mail ? 'Send' : 'Approve'}</button>`
        : `<span class="ok">${I(x.state === 'done' ? 'ok' : 'x', 'xs')}</span><span class="fr-ires">${esc(x.res)}</span>${x.undo ? `<button class="pill ghost sm" data-ia="undo" aria-label="Undo: ${esc(b)}">Undo</button>` : ''}`}</span></div>`
      + (edFor === x.id ? `<div class="fr-ied"><label class="fr-iel" for="fr-ta-${x.id}">Draft to ${esc(x.via ? CON[x.via].n : personOf(x.to).n)}</label><textarea class="fr-ta" id="fr-ta-${x.id}" rows="7">${esc(x.body)}</textarea><div class="fr-iea"><button class="pill ghost sm" data-ia="cancel">Cancel</button><button class="pill primary sm" data-ia="save">Save draft</button></div></div>` : ''); };
  function renderInbox(){
    const live = IB.filter(x => fundOf(x.f)), w = live.filter(x => x.state === 'wait');
    const grp = k => k === 'done' ? live.filter(x => x.state !== 'wait') : w.filter(x => x.kind === k);
    igs.innerHTML = IBG.map(([k, n]) => { const L = grp(k); if (!L.length) return ''; return `<section class="aib-g" data-g="${k}" aria-label="${n}"><div class="aib-gh"><span>${n}</span><span class="n">${L.length}</span></div><div class="aib-gl" role="list">${L.map(ibRow).join('')}</div></section>`; }).join('');
    swap($('.aib-st', ibx), w.length ? `${w.length} waiting for you` : 'All clear');
    if (!w.length && !igs.querySelector('[data-g="done"]')) igs.innerHTML = `<div class="fr-ibe muted">Nothing waiting. The agent drafts here as meetings end, funds go quiet and paths open up.</div>`;
  }
  igs.addEventListener('click', e => {
    const b = e.target.closest('[data-ia]'); if (!b) return;
    const el = b.closest('[data-ib]') || b.closest('.fr-ied').previousElementSibling, x = IB.find(y => y.id === el.dataset.ib), a = b.dataset.ia;
    if (a === 'open'){ if (x.kind === 'intro'){ introFor = x.f; introTab = fundOf(x.f).st === 'res' ? 'open' : 'all'; $$('.fr-isg button', iv).forEach(y => y.setAttribute('aria-pressed', y.dataset.v === introTab)); setView('intros'); } else openSheet(x.f); return; }
    if (a === 'edit'){ edFor = edFor === x.id ? null : x.id; renderInbox(); const ta = $('.fr-ta', igs); if (ta){ ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); enter(ta.closest('.fr-ied')); } return; }
    if (a === 'cancel' || a === 'save'){ if (a === 'save'){ const v = $('.fr-ta', igs).value.trim(); if (v) x.body = v; } edFor = null; renderInbox(); const r = $(`[data-ib="${x.id}"] [data-ia="edit"]`, igs); if (r) r.focus(); if (a === 'save') toast('ok', 'Draft saved', 'Send it when you are ready'); return; }
    const was = document.activeElement === b;
    if (a === 'ok') approve(x);
    if (a === 'dismiss'){ x.state = 'gone'; x.res = 'Dismissed'; x.undo = () => { x.state = 'wait'; }; refresh(); toast('info', 'Dismissed', ibText(x)[0], { label:'Undo', run:() => { x.state = 'wait'; x.undo = null; refresh(); } }); }
    if (a === 'undo' && x.undo){ x.undo(); x.undo = null; refresh(); }
    if (was){ const n = $('.aib-i:not(.done) [data-ia="ok"]', igs); (n || $('#content', app)).focus({ preventScroll:true }); }
  });
  igs.addEventListener('keydown', e => { if (e.key === 'Escape' && e.target.closest('.fr-ta')){ e.preventDefault(); e.stopPropagation(); $('[data-ia="cancel"]', igs).click(); } });

  /* ---------- Term sheets: side by side, the better term marked, and what to say ---------- */
  const tsv = $('#fr-v-terms', app), tst = $('.fr-tst', tsv), sayBox = $('.fr-say', tsv);
  function renderTerms(){
    const S = sheets(), lc = leadChosen();
    $('.fr-ask', tsv).hidden = S.length < 1;
    swap($('.fr-tss', tsv), lc ? `${lc.n} leads. ${S.length ? plural(S.length, 'other sheet') + ' still open' : 'No other sheets open'}` : S.length ? `${plural(S.length, 'sheet')} to answer. The first expires ${inDays(Math.min(...S.map(f => f.ts.exp)))}` : 'No term sheets yet');
    const all = [...(lc ? [lc] : []), ...S];
    if (!all.length){ $('thead', tst).innerHTML = ''; $('tbody', tst).innerHTML = `<tr><td class="fr-none muted">Term sheets show here as funds send them. Move a fund to Term sheet on the board to add one.</td></tr>`; return; }
    const T = all.map(termsOf);
    const best = (vals, hi = true) => { const v = vals.filter(x => x != null), b = hi ? Math.max(...v) : Math.min(...v); return vals.map(x => all.length > 1 && x === b && v.filter(y => y === b).length === 1); };
    const ROWS = [
      ['Investment', all.map(f => M(f.ts.amt)), best(all.map(f => f.ts.amt))],
      ['Pre-money valuation', all.map(f => M(f.ts.pre)), best(all.map(f => f.ts.pre))],
      ['Option pool', all.map(f => `Top up to ${Math.round(f.ts.pool * 100)}%, ${f.ts.poolPre ? 'before' : 'after'} the round`), best(all.map(f => f.ts.poolPre ? 0 : 1))],
      ['Effective pre-money', T.map(t => M(t.eff)), best(T.map(t => r2(t.eff))), 'After the pool top-up comes out of the pre-money'],
      ['Post-money', T.map(t => M(t.post)), all.map(() => false), `With the ${M(totalM() - (lc ? lc.commit.amt : 0))} already committed`],
      ['Round dilution', T.map(t => Math.round(t.dil * 1000) / 10 + '%'), best(T.map(t => Math.round(t.dil * 1000)), false)],
      ['Liquidation preference', all.map(f => f.ts.pref + ' ' + (f.ts.part === 'None' ? 'non-participating' : 'participating')), best(all.map(f => f.ts.part === 'None' ? 1 : 0))],
      ['Participation', all.map(f => f.ts.part), all.map(() => false)],
      ['Board', all.map(f => f.ts.board), best(all.map(f => -f.ts.board.split(',').length))],
      ['Pro-rata rights', all.map(f => f.ts.prorata), all.map(() => false)],
      ['No-shop', all.map(f => f.ts.noShop + ' days'), best(all.map(f => f.ts.noShop), false)],
      ['Expires', all.map(f => f === lc ? 'Signed' : fmtDW(f.ts.exp) + ', ' + inDays(f.ts.exp)), all.map(() => false)] ];
    $('thead', tst).innerHTML = `<tr><th class="k"><span class="pg-sr">Term</span></th>${all.map(f => `<th><div class="fr-tshd"><button class="fr-tsh" data-open="${f.id}">${tile(f)}<span><b>${esc(f.n)}</b><span class="muted">${esc(leadOf(f).n)}, received ${fmtD(f.ts.rec)}</span></span></button>${f === lc ? '<span class="tag ok">Leads the round</span>' : f.ts.exp <= 3 ? `<span class="tag bad">Expires ${inDays(f.ts.exp)}</span>` : `<span class="tag">Expires ${inDays(f.ts.exp)}</span>`}</div></th>`).join('')}</tr>`;
    $('tbody', tst).innerHTML = ROWS.map(([k, vals, win, tip]) => `<tr><th class="k" scope="row"${tip ? ` data-tip="${tip}"` : ''}>${k}</th>${vals.map((v, i) => `<td${win[i] ? ' class="win"' : ''}><span class="num">${esc(v)}</span>${win[i] ? `<span class="fr-better" aria-label="the better term">${I('check', 'xs')}Better</span>` : ''}</td>`).join('')}</tr>`).join('')
      + `<tr class="fr-tsa"><th class="k"></th>${all.map(f => `<td>${f === lc ? `<span class="muted">${M(f.commit.amt)} committed, hard</span>` : `<span class="fr-tsb2"><button class="pill line sm" data-reply="${f.id}">${I('mail', 'xs')}Draft reply</button>${lc ? '' : `<button class="pill primary sm" data-accept="${f.id}">Accept and lead</button>`}</span>`}</td>`).join('')}</tr>`;
  }
  // the agent's answer: which sheet is worth more, and what to say to each fund
  function sayText(){
    const S = sheets(), lc = leadChosen(); if (!S.length) return null;
    const by = S.slice().sort((a, b) => termsOf(b).eff - termsOf(a).eff), b = by[0], o = by[1], tb = termsOf(b), lines = [];
    if (o){ const to = termsOf(o);
      lines.push(`<b>${esc(short(b))} is worth more to you.</b> ${esc(short(o))}'s ${M(o.ts.amt)} looks bigger, but ${o.ts.poolPre ? `topping the pool up to ${Math.round(o.ts.pool * 100)}% before the round takes its effective pre-money to ${M(to.eff)}` : `its pre-money is ${M(o.ts.pre)}`}, against ${M(tb.eff)} from ${esc(short(b))}.`);
      const own = o.ts.amt / to.post; if (/Participating/.test(o.ts.part)) lines.push(`${esc(short(o))} asks for participating preferred: in a $60M sale they would take their ${M(o.ts.amt)} back and then ${Math.round(own * 100)}% of the rest, about ${M(o.ts.amt + (60 - o.ts.amt) * own)} instead of ${M(Math.max(o.ts.amt, 60 * own))}.`);
      lines.push(`<b>Say to ${esc(short(o))}:</b> “We'd like to compare like for like: 1x non-participating, and the pool top-up after the round. At that, a pre-money of ${M(Math.ceil(tb.eff))} or more would be competitive.”`); }
    lines.push(`<b>Say to ${esc(short(b))}:</b> “We'd like ${b.ts.noShop > 21 ? '21 days of no-shop instead of ' + b.ts.noShop : 'to close inside the no-shop'}, and room for ${M(Math.max(0, MAX - totalM() - b.ts.amt))} more from followers so we land at ${M(MAX)}.”`);
    const first2 = S.slice().sort((x, y) => x.ts.exp - y.ts.exp)[0];
    lines.push(`${esc(short(first2))}'s sheet expires ${inDays(first2.ts.exp)}, so reply to them first.${lc ? '' : ` If ${esc(short(b))} agrees, accepting it puts you at ${M(totalM() + b.ts.amt)} of ${M(TARGET)}.`}`);
    return { b, o, lines };
  }
  function ask(){
    const btn = $('.fr-ask', tsv), r = sayText(); if (!r) return;
    btn.disabled = true; $('span', btn).textContent = 'Comparing terms'; $('.i', btn).style.display = 'none'; btn.insertAdjacentHTML('afterbegin', '<span class="think on"><i></i><i></i><i></i><i></i></span>');
    setTimeout(() => {
      $('.think', btn)?.remove(); $('.i', btn).style.display = ''; $('span', btn).textContent = 'What do I say to these?'; btn.disabled = false;
      sayBox.hidden = false;
      sayBox.innerHTML = `<div class="fr-ph"><div><b>What to say</b><span class="muted">The agent's read of the sheets, from the numbers above</span></div><button class="ib" data-sx aria-label="Close" data-tip="Close">${I('x', 'xs')}</button></div><div class="six-ans fr-sayb">${I('spark', 'xs')}<div>${r.lines.map(l => `<p>${l}</p>`).join('')}</div></div>`
        + `<div class="fr-saya">${[r.o, r.b].filter(Boolean).map(f => `<button class="pill line sm" data-reply="${f.id}">${I('mail', 'xs')}Draft reply to ${esc(short(f))}</button>`).join('')}</div>`;
      enter(sayBox); sayBox.scrollIntoView({ block:'nearest', behavior:REDUCE ? 'auto' : 'smooth' });
    }, REDUCE ? 0 : 1000);
  }
  $('.fr-ask', tsv).onclick = ask;
  tsv.addEventListener('click', e => {
    const o = e.target.closest('[data-open]'); if (o) return openSheet(o.dataset.open, !e.detail);
    if (e.target.closest('[data-sx]')){ sayBox.hidden = true; return; }
    const rp = e.target.closest('[data-reply]'); if (rp){ const f = fundOf(rp.dataset.reply), r = sayText(), p = leadOf(f), isBest = r && r.b === f;
      const id = 'ib-r-' + f.id + '-' + IB.length;
      IB.push({ id, kind:'reply', f:f.id, to:p.id, state:'wait', subj:`Re: ${f.n} term sheet`, body:isBest ? `Hi ${first(p.n)},\n\nThank you for the term sheet. We are close. Two asks: 21 days of no-shop instead of ${f.ts.noShop}, and room for followers so the round lands at ${M(MAX)}.\n\nIf that works, we can sign this week.\n\nBest,\nAda` : `Hi ${first(p.n)},\n\nThank you for the term sheet. To compare like for like, could you look at 1x non-participating preferred and the pool top-up after the round?\n\nWe are deciding this week.\n\nBest,\nAda` });
      refresh(); toast('ok', `Reply to ${p.n} drafted`, 'It waits in the Agent inbox for you to send', { label:'Open', run:() => setView('inbox') }); return; }
    const ac = e.target.closest('[data-accept]'); if (ac){ const f = fundOf(ac.dataset.accept), undo = setStage(f, 'in'); f.commit = { amt:f.ts.amt, hard:true, day:0 }; sayBox.hidden = true; refresh();
      toast('ok', `${f.n} leads the round`, `${M(f.ts.amt)} hard. ${M(totalM())} of ${M(TARGET)} committed`, { label:'Undo', run:() => { undo(); refresh(); } }); }
  });

  /* ---------- views: the sidebar switches them, the header names the one on show with a live summary ---------- */
  const VIEWS = { round:'Round', investors:'Investors', intros:'Intros', room:'Data room', meetings:'Meetings', inbox:'Agent inbox', terms:'Term sheets' };
  function setView(k){
    const was = view; view = k; app.dataset.view = k;
    Object.keys(VIEWS).forEach(v => $('#fr-v-' + v, app).hidden = v !== k);
    swap($('.fr-h1t', app), VIEWS[k]);
    if (k !== 'meetings') closeCalPop();
    render(k);
    if (was !== k && !REDUCE){ const sec = $('#fr-v-' + k, app); sec.animate([{ opacity:0, transform:'translateY(6px)' }, { opacity:1, transform:'none' }], { duration:260, easing:'cubic-bezier(.22,1,.36,1)' }); }
    counts(); drawer(false);
  }
  function render(k){ if (k === 'round') renderRound(); if (k === 'investors') renderBoard(); if (k === 'intros') renderIntros(); if (k === 'room') renderRoom(); if (k === 'meetings') renderCal(); if (k === 'inbox') renderInbox(); if (k === 'terms') renderTerms(); }
  const SAVED = { quiet:() => { clearBoard(); K.quiet = true; K.shut.delete('out'); }, leads:() => { clearBoard(); K.role = 'lead'; K.fit = '70'; } };
  const savedOn = () => view !== 'investors' ? null : K.quiet && !K.own.size && K.fit === 'any' && K.role === 'any' && K.sect === 'any' ? 'quiet' : !K.quiet && !K.own.size && K.fit === '70' && K.role === 'lead' && K.sect === 'any' ? 'leads' : null;
  function navCurrent(){
    const sv = savedOn();
    $$('.fr-side [data-go]', app).forEach(b => { const on = b.dataset.go === view && !sv; on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'); });
    $$('.fr-side [data-saved]', app).forEach(b => { const on = b.dataset.saved === sv; on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'); });
  }
  function counts(){
    const set = (k, v) => $$(`[data-count="${k}"]`, app).forEach(x => x.textContent = v);
    const w = waiting(), act = active(), Q = FUNDS.filter(quietDays), tot = totalM(), ts = sheets(), wkM = meetingsIn(mon0, mon0 + 6);
    set('funds', FUNDS.length); set('intros', FUNDS.filter(f => f.st === 'res' && f.paths.length).length); set('docs', DOCS.length); set('meetings', wkM.length);
    set('inbox', w.length || ''); $('.fr-wait', app).hidden = !w.length; set('terms', ts.length || ''); set('quiet', Q.length || ''); set('leads', FUNDS.filter(f => f.leads && ACTIVE.includes(f.st) && f.fit >= 70).length);
    $('[data-go="inbox"]', app).setAttribute('aria-label', `Agent inbox, ${w.length} waiting`);
    const S = {
      round:[`<b data-k="sum-c">${M(tot)}</b> of ${M(TARGET)} committed · ${plural(act.length, 'active fund')} · closes ${fmtD(CLOSE)}`, `${M(tot)} of ${M(TARGET)} · ${act.length} active`],
      investors:[`${plural(FUNDS.length, 'fund')} · ${act.length} active · <b data-k="sum-c">${M(tot)}</b> committed`, `${act.length} active · ${M(tot)} in`],
      intros:[`${plural(FUNDS.filter(f => f.st === 'res' && f.paths.length).length, 'warm path')} to ask · ${FUNDS.filter(f => f.st === 'intro').length} waiting on intros`, `${FUNDS.filter(f => f.st === 'res').length} to ask`],
      room:[`${plural(DOCS.length, 'document')} · ${plural(VW.length, 'view')} · ${Q.length} gone quiet`, `${VW.length} views · ${Q.length} quiet`],
      meetings:[`${weekLabel()} · ${plural(meetingsIn(mon(), mon() + 6).length, 'meeting')}`, plural(meetingsIn(mon(), mon() + 6).length, 'meeting')],
      inbox:[w.length ? `${w.length} waiting · ${IBG.filter(([k]) => k !== 'done' && w.some(x => x.kind === k)).map(([k]) => plural(w.filter(x => x.kind === k).length, ...IBS[k])).join(' · ')}` : 'Nothing waiting', w.length ? `${w.length} waiting` : 'Nothing waiting'],
      terms:[ts.length ? `${plural(ts.length, 'term sheet')} · best effective pre-money ${M(termsOf(bestSheet()).eff)}` : leadChosen() ? `${leadChosen().n} leads` : 'No term sheets', `${ts.length} sheets`] };
    swap($('.fr-sum', app), `<span class="lg">${S[view][0]}</span><span class="sh">${S[view][1]}</span>`, true);
    navCurrent();
  }
  app.addEventListener('click', e => {
    const b = e.target.closest('.fr-side button'); if (!b) return;
    if (b.dataset.go){ if (b.dataset.go === 'investors' && savedOn()) clearBoard(); setView(b.dataset.go); if (b.dataset.go === 'investors') stagger($$('.kbx-k', cols).slice(0, 24), 14); }
    else if (b.dataset.saved){ SAVED[b.dataset.saved](); setView('investors'); renderBoard(); stagger($$('.kbx-k', cols).slice(0, 16), 22); }
    if (b.closest('.fr-nav')) drawer(false);
  });
  const help = () => toast('info', 'Keyboard shortcuts', '⌘K or Ctrl K searches, arrows move through cards and rows, Enter opens, M moves a card, Esc closes, ? shows this');
  onOpen('.fr-wsb', () => {
    const p = pop('fr-p-ws');
    p.innerHTML = `<div class="ph" role="none">Rounds</div>` + [['Series A', 'Raising now', true], ['Seed', 'Closed, $2.4M', false]].map(w => mi(`data-n="${w[0]}"`, `<span class="pfm-lg" data-t="pl">L</span><span>${w[0]}<span class="d">${w[1]}</span></span>`, 'menuitemradio', w[2])).join('');
    $$('.mi', p).forEach(m => m.onclick = () => { if (m.dataset.n !== 'Series A') toast('info', 'The seed round is closed', 'The template keeps the Series A open; its investors show here as Fernhill and Ashgrove'); });
  });
  const drawer = on => { app.classList.toggle('dr', on); if (on) setTimeout(() => $('.fr-side .ahx-cv[aria-current]', app)?.focus(), 80); };
  $('.fr-menu', app).onclick = () => drawer(true);
  $('.fr-scrim', app).onclick = () => drawer(false);
  $('.fr-shade', app).onclick = () => closeSheet();

  /* ---------- the profile menu: Profile menu, its theme switch drives the site's ---------- */
  const isDark = () => (document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';
  const th = $('#fr-p-me .pfm-th', app);
  onOpen('.fr-me', () => th.setAttribute('aria-checked', isDark()));
  th.onclick = () => { const b = document.querySelector(`[data-theme-set="${isDark() ? 'light' : 'dark'}"]`); if (b) b.click(); th.setAttribute('aria-checked', isDark()); };
  $('#fr-p-me [data-act="help"]', app).addEventListener('click', help);
  $('#fr-p-me [data-act="signout"]', app).addEventListener('click', () => toast('info', 'Still signed in', 'This is a template, so there is no account to leave'));

  /* ---------- search: Command palette ---------- */
  const over = $('.fr-cmd', app), q = $('.cpl-q', over), list = $('.cpl-list', over), stl = $('.cpl-st', over);
  list.id = 'fr-cpl'; q.setAttribute('role', 'combobox'); q.setAttribute('aria-expanded', 'true'); q.setAttribute('aria-controls', list.id); q.setAttribute('aria-autocomplete', 'list');
  let items = [], hi = 0, back = null;
  const ACTIONS = () => [
    ...Object.entries(VIEWS).map(([k, t]) => ['Go to', I({ round:'gauge', investors:'grid', intros:'users', room:'folder', meetings:'cal', inbox:'spark', terms:'file-text' }[k], 'xs'), t, k === 'inbox' ? waiting().length + ' waiting' : '', () => setView(k)]),
    ['Actions', I('spark', 'xs'), 'What do I say to the term sheets?', '', () => { setView('terms'); ask(); }],
    ['Actions', I('history', 'xs'), 'Show funds that went quiet', '', () => { SAVED.quiet(); setView('investors'); renderBoard(); }],
    ['Actions', I('moon', 'xs'), isDark() ? 'Switch to light theme' : 'Switch to dark theme', '', () => th.click()] ];
  function paintCmd(){
    const v = q.value.trim().toLowerCase(), m = s => !v || s.toLowerCase().includes(v);
    const fs = FUNDS.filter(f => m(f.n + ' ' + f.city + ' ' + f.sec.map(s => SECT[s][0]).join(' '))).sort((a, b) => ST[b.st].i - ST[a.st].i || b.fit - a.fit).slice(0, v ? 6 : 4);
    const ps = v ? FUNDS.flatMap(f => f.ppl.filter(p => m(p.n)).map(p => ({ p, f }))).slice(0, 5) : [];
    const R = [...ACTIONS().filter(a => m(a[2])).map(a => ({ g:a[0], ic:a[1], t:a[2], h:a[3], run:a[4] })),
      ...fs.map(f => ({ g:'Funds', ic:tile(f), t:f.n, h:`${ST[f.st].t}, fit ${f.fit}`, run:() => openSheet(f.id, true) })),
      ...ps.map(({ p, f }) => ({ g:'Partners', ic:avP(p), t:p.n, h:`${p.r}, ${f.n}`, run:() => openSheet(f.id, true) }))];
    let h = '<span class="cpl-hl"></span>', g = '';
    R.forEach((x, i) => { if (x.g !== g){ g = x.g; h += `<div class="cpl-g" role="presentation">${g}</div>`; } h += `<button class="cpl-i" role="option" id="fr-cpl-${i}" tabindex="-1" data-i="${i}"><span class="ic">${x.ic}</span><span class="t">${esc(x.t)}</span>${x.h ? `<span class="h">${esc(x.h)}</span>` : ''}</button>`; });
    if (!R.length) h += `<div class="cpl-e muted fr-none">No fund, partner or action matches “${esc(q.value.trim())}”</div>`;
    list.innerHTML = h; items = R; hi = 0; moveHi(0);
    stl.innerHTML = plural(R.length, 'result');
  }
  function moveHi(d){ const bs = $$('.cpl-i', list); if (!bs.length){ q.removeAttribute('aria-activedescendant'); $('.cpl-hl', list).style.opacity = 0; return; } hi = (hi + d + bs.length) % bs.length; bs.forEach((b, i) => { b.classList.toggle('hl', i === hi); b.setAttribute('aria-selected', i === hi); }); const b = bs[hi], hl = $('.cpl-hl', list); hl.style.opacity = 1; hl.style.top = b.offsetTop + 'px'; q.setAttribute('aria-activedescendant', b.id); if (b.offsetTop < list.scrollTop + 30 || b.offsetTop + 36 > list.scrollTop + list.clientHeight) b.scrollIntoView({ block:'nearest' }); }
  const runItem = i => { const x = items[i]; closeCmd(false); if (x) x.run(); };
  function openCmd(){ if (!over.hidden) return; back = document.activeElement; over.hidden = false; q.value = ''; paintCmd(); drawer(false); closeCalPop(); q.focus(); }
  function closeCmd(restore = true){ if (over.hidden) return; over.hidden = true; if (restore && back && back.isConnected) back.focus({ preventScroll:true }); }
  q.addEventListener('input', paintCmd);
  q.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); moveHi(e.key === 'ArrowDown' ? 1 : -1); } else if (e.key === 'Enter'){ e.preventDefault(); runItem(hi); } else if (e.key === 'Tab') e.preventDefault(); });
  list.addEventListener('click', e => { const b = e.target.closest('.cpl-i'); if (b) runItem(+b.dataset.i); });
  list.addEventListener('pointermove', e => { const b = e.target.closest('.cpl-i'); if (b && +b.dataset.i !== hi) moveHi(+b.dataset.i - hi); });
  over.addEventListener('pointerdown', e => { if (e.target === over) closeCmd(); });
  $('.fr-find', app).onclick = openCmd;

  /* ---------- keys: ⌘K, ?, and Escape closing one thing at a time ---------- */
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); over.hidden ? openCmd() : closeCmd(); return; }
    if (e.key === 'Escape'){
      if ($('.pop.open', app) || e.target.closest?.('.fr-ta')) return;
      if (!over.hidden){ e.preventDefault(); closeCmd(); return; }
      if (popFor){ e.preventDefault(); closeCalPop(); return; }
      if (app.classList.contains('dr')){ drawer(false); $('.fr-menu', app).focus(); return; }
      if (sheetFor){ closeSheet(); return; }
      if (view === 'terms' && !sayBox.hidden){ sayBox.hidden = true; return; }
      return;
    }
    const typing = e.target.closest && e.target.closest('input,textarea,[contenteditable="true"]');
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '?' && over.hidden){ e.preventDefault(); help(); }
  }, true);

  /* ---------- everything follows the data ---------- */
  function refresh(){ FUNDS.forEach(f => f.fit = fitOf(f).v); render(view); if (view !== 'investors') renderBoard(); if (sheetFor) renderSheet(); counts(); }
  // the hooks a test can read: every view's numbers come from these
  app.dmFr = { committed:totalM, hard:hardM, soft:softM, funds:() => FUNDS.length, active:() => active().length, quiet:() => FUNDS.filter(quietDays).length, sheets:() => sheets().length, waiting:() => waiting().length, byStage:k => FUNDS.filter(f => f.st === k).length };
  renderBoard(); setView('round');
  stagger($$('.scx-c, .fr-rd > .panel', rd), 40);
  // a link to a fund (#f4) opens it
  const hsh = location.hash.slice(1); if (hsh && fundOf(hsh)) openSheet(hsh);
})();
