/* Sales CRM template: a CRM where an agent works beside the rep. It runs after the shared core (core.js), so it uses the
   core's helpers ($, $$, I, swap, tween, enter, stagger, seg, html) and its popovers (data-pop) and tooltips (data-tip).
   The accounts, people, deals and meetings are made up; everything else is worked out from them. An account's next step is
   its earliest booked meeting in the calendar, its health comes from how recently it was touched, whether a deal is past
   its close date and its win probability, and the agent's suggestions (a chip in the table, a row in the Agent inbox) come
   from the same data. Approving one changes the data, so the table, the inbox, the calendar, the board and the forecast
   always show the same numbers. */
(() => {
  const app = document.querySelector('.crm'); if (!app) return;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const sum = (a, f = x => x) => a.reduce((t, x) => t + f(x), 0);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  /* ---------- people, stages, regions and teams ---------- */
  const P = { MK:['Maya Kim', 'l'], AR:['Ari Reyes', 'p'], TR:['Theo Reed', 't'], JO:['Jon Ortiz', 'm'], LN:['Lena Novak', 'r'], IB:['Iris Bell', 'k'], DK:['Dev Kumar', 'b'], KM:['Kofi Mensah', 'y'] };
  const OWN = Object.keys(P);
  // the team has faces (Pexels portraits, on the site only: art/README.md); a customer's people keep their initials
  // each photo's file carries its Pexels id, so swapping a photo is never hidden by a cached copy
  const PHOTO = { MK:5876695, AR:3785077, TR:6274712, JO:5384445, LN:3786525, IB:3769021, DK:2379005, KM:7562313, NC:3777943 };
  const av = (id, cls = '') => `<span class="av ph${cls ? ' ' + cls : ''}" style="background:var(--dm-av-${P[id][1]});color:var(--dm-av-${P[id][1]}-ink)" aria-hidden="true"><img src="/art/people/${id}-${PHOTO[id]}.jpg" alt="" width="64" height="64" loading="lazy" decoding="async"></span>`;
  const first = id => P[id][0].split(' ')[0];
  const STAGES = [{ k:'disc', t:'Discovery', p:10 }, { k:'demo', t:'Demo', p:25 }, { k:'prop', t:'Proposal', p:50 }, { k:'nego', t:'Negotiation', p:75 }, { k:'won', t:'Closed won', p:100 }, { k:'lost', t:'Closed lost', p:0 }];
  // a deal is closed once it is won or lost; everything else is open pipeline
  const closed = d => d.st === 'won' || d.st === 'lost';
  const ST = Object.fromEntries(STAGES.map((s, i) => [s.k, { ...s, i }]));
  // a stage is a Task table status pill: Negotiation reads in the accent (it is the one in play), Closed won in green
  // each open stage has its own label colour (the core tag colours), the same wherever the stage shows; won and lost are
  // the ok and bad statuses
  const STH = { disc:'t', demo:'l', prop:'p', nego:'b' };
  const pill = k => `<span class="ttx-st crm-sg" data-s="${k === 'won' ? 'done' : k === 'lost' ? 'fail' : 'wait'}"${STH[k] ? ` data-h="${STH[k]}"` : ''}><span class="sv"><span class="dot"></span><span>${ST[k].t}</span></span></span>`;
  const REG = { na:{ t:'Americas', c:'var(--dm-c1)' }, emea:{ t:'Europe', c:'var(--dm-c2)' }, apac:{ t:'Asia Pacific', c:'var(--dm-c4)' } };
  const QUOTA = { MK:1300000, AR:850000, TR:1100000, JO:300000, LN:340000, IB:260000, DK:160000, KM:150000 };
  const TEAMS = [{ k:'key', t:'Key accounts', who:['MK', 'AR', 'TR'] }, { k:'grow', t:'Growth', who:['JO', 'LN', 'IB'] }, { k:'new', t:'New business', who:['DK', 'KM'] }];
  TEAMS.forEach(t => t.quota = t.who.reduce((a, o) => a + QUOTA[o], 0));
  // closed won earlier this quarter, on top of the won deals in the list below: each becomes two won deals on the owner's accounts
  const WON_BEFORE = { MK:190000, AR:110000, TR:140000, JO:70000, LN:90000, IB:50000, DK:30000, KM:24000 };
  const ACT = { Call:'comment', Email:'mail', Demo:'monitor', QBR:'users', Exec:'users', Pricing:'dollar', Legal:'shield', Security:'shield', Discovery:'search' };
  // a touch's meeting, and how long it runs in hours
  const TOUCH = { Call:['Call', .5], Demo:['Demo', 1], QBR:['QBR', 1], Exec:['Exec sync', .75], Pricing:['Pricing call', .75], Legal:['Legal review', .75], Security:['Security review', 1], Discovery:['Discovery call', .5] };

  /* ---------- dates: days from today, so the screen always reads as current ---------- */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dateOf = n => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };
  const DAYN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], DAYL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dow = n => dateOf(n).getDay(), isWork = n => dow(n) > 0 && dow(n) < 6;
  const fmtD = n => dateOf(n).toLocaleDateString('en-US', { month:'short', day:'numeric' });
  const fmtDW = n => DAYN[dow(n)] + ' ' + fmtD(n);
  const fmtM = n => dateOf(n).toLocaleDateString('en-US', { month:'long' });
  const workAfter = (n, k) => { let d = n; while (k > 0){ d++; if (isWork(d)) k--; } return d; };
  const workBefore = (n, k) => { let d = n; while (k > 0){ d--; if (isWork(d)) k--; } return d; };
  // a close date on a weekend moves to the Friday before, or to the Monday after when that Friday has gone
  const toWork = n => { if (isWork(n)) return n; const fri = n - (dow(n) === 6 ? 1 : 2); return n < 0 || fri >= 1 ? fri : n + (dow(n) === 6 ? 2 : 1); };
  // hours: 9:30 in a range, 9:30am on its own
  const tm = h => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60); return `${hh > 12 ? hh - 12 : hh}:${String(mm).padStart(2, '0')}`; };
  const tmA = h => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60); return `${hh > 12 ? hh - 12 : hh}${mm ? ':' + String(mm).padStart(2, '0') : ''}${hh >= 12 ? 'pm' : 'am'}`; };
  const money = v => '$' + Math.round(v).toLocaleString('en-US');
  const kmoney = v => v >= 1e6 ? '$' + parseFloat((v / 1e6).toFixed(2)) + 'M' : v >= 1e3 ? '$' + Math.round(v / 1e3) + 'k' : '$' + Math.round(v);
  // motion: the library's ease and durations, for the moves the CSS can't make (content that is swapped, not shown or hidden)
  const CS0 = getComputedStyle(app), EASE = CS0.getPropertyValue('--dm-ease').trim() || 'ease';
  const dur = (v, d) => { v = (v || '').trim(); return v.endsWith('ms') ? parseFloat(v) : v.endsWith('s') ? parseFloat(v) * 1000 : d; };
  const T = dur(CS0.getPropertyValue('--dm-t'), 300), TF = dur(CS0.getPropertyValue('--dm-t-fast'), 140);
  const glide = (el, from, ms = T) => { if (!el || REDUCE || !el.animate) return; el.animate([{ opacity:0, ...from }, { opacity:1, transform:'none' }], { duration:ms, easing:EASE }); };
  // an overlay (Jump to, Add account) fades out before it hides; opening it again while it fades takes it straight back. A phone's
  // preview sheet, which is shown by a class rather than hidden, only plays the fade (fadeCls)
  const fadeOut = (el, ms = 200) => { if (REDUCE){ el.hidden = true; return; } el._closing = true; el.classList.add('out'); clearTimeout(el._out); el._out = setTimeout(() => { el.hidden = true; el.classList.remove('out'); el._closing = false; }, ms); };
  const unfade = el => { clearTimeout(el._out); el.classList.remove('out'); el._closing = false; };
  const fadeCls = (el, ms = 200) => { if (REDUCE) return; el.classList.add('out'); clearTimeout(el._out); el._out = setTimeout(() => el.classList.remove('out'), ms); };
  const plural = (n, a, b = a + 's') => `${n} ${n === 1 ? a : b}`;
  const poss = n => n + (n.endsWith('s') ? "'" : "'s");

  /* ---------- the accounts and their deals (made up) ---------- */
  // name, segment, tags, owner, region, days since the last touch, its kind, deals: [name, stage, value in $k, closes in days, probability +/-]
  const RAW = [
    ['Halcyon Labs', 'Enterprise', ['Expansion', 'Pilot'], 'MK', 'na', 1, 'Demo', [['Platform expansion', 'nego', 184, 18, 5], ['Analytics pilot', 'demo', 42, 40, 0]]],
    ['Brightwater Health', 'Strategic', ['Renewal', 'More seats', 'Partner-led'], 'AR', 'na', 2, 'QBR', [['Renewal 2027', 'prop', 228, 30, 10], ['Care team seats', 'disc', 64, 75, 0], ['Partner bundle', 'won', 96, -12, 0]]],
    ['Pinecrest Logistics', 'Mid-market', ['First deal'], 'JO', 'emea', 4, 'Pricing', [['First contract', 'demo', 58, 45, 0]]],
    ['Corvid Analytics', 'Enterprise', ['Expansion', 'More seats', 'Reseller'], 'TR', 'na', 0, 'Call', [['Enterprise tier', 'nego', 176, 12, 8], ['Data add-on', 'prop', 88, 28, -5], ['Reseller bundle', 'disc', 40, 90, 0]]],
    ['Lumen Grid', 'Mid-market', ['More seats'], 'LN', 'emea', 9, 'Email', [['Seat upgrade', 'prop', 36, 26, -10]]],
    ['Saltmarsh Foods', 'SMB', ['First deal', 'Pilot'], 'DK', 'emea', 16, 'Discovery', [['Pilot', 'disc', 18, 60, 0], ['Starter plan', 'demo', 12, 50, 0]]],
    ['Ironbark Capital', 'Strategic', ['Expansion'], 'MK', 'na', 3, 'Exec', [['Global rollout', 'prop', 420, 48, 0], ['Risk module', 'won', 140, -30, 0]]],
    ['Tidewell Energy', 'Enterprise', ['Renewal', 'Partner-led'], 'AR', 'apac', 38, 'Legal', [['Renewal', 'nego', 265, -4, -40], ['Grid ops seats', 'demo', 75, 70, 0]]],
    ['Quillon Media', 'Mid-market', ['First deal', 'Reseller', 'Pilot'], 'IB', 'na', 6, 'Demo', [['First contract', 'demo', 66, 35, 0], ['Reseller pilot', 'disc', 24, 80, 0]]],
    ['Marrow & Finch', 'SMB', ['More seats'], 'KM', 'emea', 21, 'Email', [['Seat upgrade', 'disc', 22, 55, -5]]],
    ['Oakhaven Retail', 'Enterprise', ['Expansion', 'Renewal'], 'TR', 'na', 5, 'Pricing', [['Store rollout', 'nego', 96, 9, 10], ['Renewal', 'prop', 120, 40, 0]]],
    ['Fernway Travel', 'Mid-market', ['First deal'], 'JO', 'apac', 12, 'Call', [['First contract', 'disc', 48, 65, 0]]],
    ['Kestrel Robotics', 'Strategic', ['Pilot', 'Expansion', 'Partner-led'], 'MK', 'apac', 1, 'Security', [['Pilot to production', 'nego', 164, 6, 12], ['Fleet expansion', 'prop', 150, 52, 0], ['Security review', 'won', 60, -20, 0]]],
    ['Bluefin Insurance', 'Enterprise', ['Renewal'], 'LN', 'emea', 27, 'QBR', [['Renewal', 'prop', 142, -2, -30]]],
    ['Arbor & Vine', 'SMB', ['First deal', 'More seats'], 'DK', 'na', 44, 'Email', [['Starter', 'disc', 9, 85, -5]]],
    ['Cobalt Ridge', 'Mid-market', ['Expansion'], 'IB', 'na', 8, 'Demo', [['Expansion', 'demo', 72, 38, 5]]],
    ['Juniper Point', 'Enterprise', ['More seats', 'Reseller'], 'AR', 'emea', 3, 'Exec', [['More seats', 'prop', 96, 24, 5], ['Reseller deal', 'won', 54, -8, 0]]],
    ['Larkspur Mobility', 'Mid-market', ['Pilot'], 'KM', 'apac', 62, 'Call', [['Pilot', 'disc', 30, -10, -8]]],
    ['Granite Peak Systems', 'Strategic', ['Expansion', 'Renewal', 'Partner-led'], 'TR', 'na', 2, 'Pricing', [['Platform renewal', 'nego', 388, 15, 0], ['Expansion', 'prop', 164, 44, 0], ['Partner deal', 'demo', 90, 70, 0]]],
    ['Moss & Ember', 'SMB', ['First deal'], 'JO', 'emea', 19, 'Discovery', [['First contract', 'disc', 26, 58, 0]]],
    ['Wrenfield Pharma', 'Enterprise', ['Pilot', 'Expansion'], 'LN', 'na', 7, 'Security', [['Research pilot', 'prop', 118, 33, 0], ['Expansion', 'disc', 210, 95, 0]]],
    ['Driftwood Games', 'Mid-market', ['More seats', 'Partner-led'], 'IB', 'apac', 33, 'Email', [['Studio seats', 'demo', 44, -6, -10]]],
    ['Orchard Street Bank', 'Strategic', ['Renewal', 'Expansion'], 'MK', 'na', 11, 'Legal', [['Renewal', 'nego', 246, 21, 5], ['Wealth expansion', 'demo', 130, 60, 0]]],
    ['Velvet Hammer Studio', 'SMB', ['First deal', 'Reseller'], 'DK', 'emea', 4, 'Demo', [['Studio plan', 'won', 16, -3, 0], ['Reseller add-on', 'disc', 8, 48, 0]]],
  ];
  // the people on the buyer's side: two or three to an account, the first is the champion
  const FN = ['Priya', 'Marcus', 'Elena', 'Tomas', 'Grace', 'Omar', 'Hana', 'Luis', 'Sofia', 'Ben', 'Aisha', 'Nadia', 'Yuki', 'Carla', 'Felix', 'Amara', 'Jonas', 'Leah', 'Ravi', 'Ines'];
  const LN_ = ['Shah', 'Lindqvist', 'Moreau', 'Baker', 'Osei', 'Fischer', 'Tanaka', 'Romero', 'Walsh', 'Haddad', 'Brennan', 'Costa', 'Ikeda', 'Varga', 'Larsen', 'Duarte'];
  const ROLE = ['Head of operations', 'VP of finance', 'IT lead', 'Procurement lead', 'COO', 'Product lead', 'Head of data', 'CFO'];
  const peopleOf = i => Array.from({ length:2 + i % 2 }, (_, k) => ({ n:FN[(i * 3 + k * 7) % FN.length] + ' ' + LN_[(i * 5 + k * 3) % LN_.length], r:ROLE[(i + k * 3) % ROLE.length] }));
  const ini = n => n.split(' ').map(w => w[0]).join('');
  // a contact's avatar: the same --dm-av pairs as the owners', picked by their name so it never changes
  // a customer's people: initials in a quiet neutral circle (the team has photos)
  const avn = (n, cls = '') => `<span class="av crm-avn${cls ? ' ' + cls : ''}" aria-hidden="true">${ini(n)}</span>`;
  // twelve weeks of meetings, calls and emails: none since the last touch, a steady few before it
  const trendOf = (i, last) => { let s = i * 7919 + 17; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    return Array.from({ length:12 }, (_, w) => (11 - w) * 7 + 3 < last ? 0 : Math.round(1 + r() * 5 + (last < 10 ? w / 3 : 0))); };
  // what happened before the last touch: a proposal email four days earlier and a discovery call nine days before that
  const baseOf = c => [[c.lt, c.last, `${c.lt === 'Email' ? 'Email thread' : TOUCH[c.lt][0]} with ${c.ppl[0].n}`, P[c.own][0]],
    ['Email', c.last + 4, 'Sent the proposal and pricing', P[c.own][0]], ['Discovery', c.last + 13, `Discovery call, ${c.ppl.length + 1} people joined`, P[c.own][0]]];
  let CO = [], DE = [], nid = 0, did = 201;
  const probOf = d => d.st === 'won' ? 100 : d.st === 'lost' ? 0 : clamp(ST[d.st].p + d.adj, 5, 95);
  RAW.forEach((r, i) => {
    const c = { id:'c' + (nid++), n:r[0], seg:r[1], tags:[...r[2]], own:r[3], reg:r[4], last:r[5], lt:r[6], trend:trendOf(i, r[5]), log:[], ppl:peopleOf(i), i };
    c.base = baseOf(c);
    CO.push(c);
    r[7].forEach(x => DE.push({ id:'DL-' + (did++), co:c.id, n:x[0], st:x[1], v:x[2] * 1000, close:x[1] === 'won' ? x[3] : toWork(x[3]), adj:x[4], own:c.own }));
  });
  // the quarter so far (days since it began), and what each owner won earlier in it, as won deals on their own accounts, so the
  // board's Closed won column, the accounts' totals and the forecast all count the same deals
  const q0 = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1), qDay = Math.round((today - q0) / 864e5), WK = Math.floor(qDay / 7);
  const EARLY = ['Annual renewal', 'Seat add-on', 'Pilot extension', 'Support upgrade', 'Second team', 'Data connector'];
  OWN.forEach((o, k) => { const mine = CO.filter(c => c.own === o), part = [.58, .42];
    part.forEach((f, j) => { const c = mine[(k + j) % mine.length], back = 8 + ((k * 7 + j * 13) % Math.max(1, qDay - 9));
      DE.push({ id:'DL-' + (did++), co:c.id, n:EARLY[(k + j * 3) % EARLY.length], st:'won', v:Math.round(WON_BEFORE[o] * f / 1000) * 1000, close:-Math.min(back, qDay), adj:0, own:o }); }); });
  // lost this quarter, each at the stage it reached and with the reason the buyer gave: they count in no pipeline and no closed won
  const LOST = [['Pinecrest Logistics', 'Warehouse add-on', 34, 'prop', 'Chose a cheaper tool'], ['Fernway Travel', 'Agency pilot', 22, 'demo', 'No budget this year'],
    ['Lumen Grid', 'Analytics seats', 18, 'disc', 'Kept the tool they already use'], ['Cobalt Ridge', 'Second region', 40, 'nego', 'Project paused after a reorg'], ['Quillon Media', 'Studio bundle', 28, 'prop', 'Lost to a competitor on price']];
  LOST.forEach(([n, dn, v, at, why], k) => { const c = CO.find(x => x.n === n); DE.push({ id:'DL-' + (did++), co:c.id, n:dn, st:'lost', v:v * 1000, close:-Math.min(qDay, 4 + k * 6), adj:0, own:c.own, at, why }); });
  DE.forEach(d => d.p = probOf(d));
  const coOf = id => CO.find(c => c.id === id);
  const dealOf = id => DE.find(d => d.id === id);
  const slipping = d => !closed(d) && d.close < 0;
  const eom = Math.round((new Date(today.getFullYear(), today.getMonth() + 1, 0) - today) / 864e5), eoq = Math.round((new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 + 3, 0) - today) / 864e5);

  /* ---------- the calendar's meetings: booked next steps and the touches already held ---------- */
  // a meeting: account, deal, title, day (from today), start and length in hours, owner, and planned or held
  let MT = [], mid = 1;
  const busy = (own, day, h, dur, skip) => MT.some(m => m !== skip && m.own === own && m.day === day && h < m.h + m.dur && m.h < h + dur);
  const freeAt = (own, day, h, dur, avoid = []) => { for (let t = h; t + dur <= 17.5; t += .5) if (!busy(own, day, t, dur) && !avoid.some(a => a.own === own && a.day === day && t < a.h + a.vd && a.h < t + dur)) return t; return null; };
  const STEP = { disc:['Discovery call', .5], demo:['Demo', 1], prop:['Proposal review', .75], nego:['Pricing call', .75] };
  const NEGO = [['Pricing call', .75], ['Legal review', .75], ['Exec sync', 1]];
  const meet = o => { const m = { id:'m' + (mid++), st:'plan', ...o }; MT.push(m); return m; };
  // the agent's inbox items (built below, once the meetings are in)
  const IB = [];
  // a meeting's name in a sentence: lower case, except an acronym (QBR)
  const low = k => /^[A-Z]{2,}\b/.test(k) ? k : k.toLowerCase();
  const ltName = c => c.lt === 'Email' ? 'email' : low(TOUCH[c.lt][0]);
  function derive(){
    CO.forEach(c => {
      const mine = DE.filter(d => d.co === c.id), open = mine.filter(d => !closed(d));
      c.deals = open.length; c.value = sum(open, d => d.v); c.won = sum(mine.filter(d => d.st === 'won'), d => d.v);
      c.weighted = sum(open, d => d.v * d.p / 100);
      c.win = c.value ? Math.round(c.weighted / c.value * 100) : (c.won ? 100 : 0);
      c.st = open.length ? open.reduce((a, d) => ST[d.st].i > ST[a].i ? d.st : a, 'disc') : (c.won ? 'won' : 'disc');
      c.lead = open.slice().sort((a, b) => ST[b.st].i - ST[a.st].i || b.v - a.v)[0] || null;
      c.slip = open.filter(slipping).length;
      // the next step is the earliest planned meeting: overdue when its day has gone and nobody logged it
      c.next = MT.filter(m => m.co === c.id && m.st === 'plan' && !m.fresh).sort((a, b) => a.day - b.day || a.h - b.h)[0] || null;
      // health, out of 100: recent contact (35, gone after a month of silence), no deal past its close date (25), win probability
      // (25) and a next step booked (15; an overdue one counts for a third). The word follows the score, and a factor is named
      // as weak only when it is: quiet for more than a week, a deal past its close date, under 35% to win, no step or a late one
      const nx = c.next ? (c.next.day < 0 ? 1 / 3 : 1) : 0;
      c.hp = [Math.round(35 * clamp(1 - (c.last - 3) / 27, 0, 1)), c.slip ? 0 : 25, Math.round(c.win * .25), Math.round(15 * nx)];
      c.health = sum(c.hp); c.hb = c.health >= 70 ? 'ok' : c.health >= 50 ? 'mid' : 'bad';
      c.weak = [c.last > 7 && `quiet for ${c.last} days`, c.slip && (c.slip === 1 ? 'a deal past its close date' : `${c.slip} deals past their close dates`), c.lead && c.win < 35 && `${c.win}% to win`,
        !c.next ? 'no next step' : c.next.day < 0 && 'a late next step'].filter(Boolean);
    });
    CO.forEach(c => c.sug = sugOf(c));
  }
  // the plan at the start: an account touched in the last week has its next step booked within seven working days (before
  // its lead deal closes); an account with a deal past its close date has a step that was due a few days ago and never
  // happened; the rest have nothing booked. The touches already held go on the days they happened
  derive();
  CO.forEach(c => {
    const i = c.i, d = c.lead, slip = DE.find(x => x.co === c.id && slipping(x));
    if (c.lt !== 'Email' && c.last > 0 && isWork(-c.last)){ const [k, dur] = TOUCH[c.lt], h = freeAt(c.own, -c.last, 9 + (i * 5 % 14) / 2, dur); if (h != null) meet({ co:c.id, deal:d && d.id, kind:k, day:-c.last, h, dur, own:c.own, st:'held' }); }
    if (isWork(-(c.last + 13))){ const h = freeAt(c.own, -(c.last + 13), 10 + (i % 6) / 2, .5); if (h != null) meet({ co:c.id, deal:d && d.id, kind:'Discovery call', day:-(c.last + 13), h, dur:.5, own:c.own, st:'held' }); }
  });
  CO.forEach(c => {
    const i = c.i, d = c.lead; if (!d) return;
    const [kind, dur] = d.st === 'nego' ? NEGO[i % 3] : STEP[d.st];
    const slip = DE.find(x => x.co === c.id && slipping(x));
    if (c.last <= 7){
      let w = 1 + (i * 5 + 2) % 7;
      if (d.close > 1){ let n = 0; for (let x = 1; x < d.close; x++) if (isWork(x)) n++; w = clamp(Math.min(w, n), 1, 7); }
      const day = workAfter(0, w), h = freeAt(c.own, day, 9 + ((i * 4 + 3) % 15) / 2, dur) ?? freeAt(c.own, day, 9, dur);
      if (h != null) meet({ co:c.id, deal:d.id, kind, day, h, dur, own:c.own });
    } else if (slip){
      const [k2, d2] = slip.st === 'nego' ? NEGO[i % 3] : STEP[slip.st], day = workBefore(0, 1 + i % 4);
      meet({ co:c.id, deal:slip.id, kind:k2, day, h:freeAt(c.own, day, 10 + (i % 4), d2) ?? 9, dur:d2, own:c.own });
    }
  });

  /* ---------- the agent's inbox: what it prepared, to approve, edit or dismiss ---------- */
  // follow-ups drafted for accounts quiet for more than two weeks, new close dates for deals past theirs, and data fixes: a deal
  // a stage behind its last touch, and early deals still at their full probability after weeks of silence
  const ASKQ = { disc:'what would make this a priority this quarter', demo:'who else needs to see it before a proposal', prop:'what is left before sign-off', nego:'who signs and when', won:'how the rollout is going' };
  derive();
  CO.filter(c => c.last > 14 && !c.slip && c.lead).forEach(c => { const d = c.lead, fn = c.ppl[0].n.split(' ')[0];
    IB.push({ id:'ib-f-' + c.id, kind:'follow', co:c.id, deal:d.id, days:c.last, to:c.ppl[0].n, subj:`Picking up the ${d.n.toLowerCase()}`,
      body:`Hi ${fn}, it has been a few weeks since we last spoke about the ${d.n.toLowerCase()}. Is ${fmtM(d.close)} still the right time to decide? I can send ${d.st === 'disc' ? 'a short recording of the demo' : d.st === 'demo' ? 'the pricing we talked about' : 'an updated proposal'} this week if that helps.`, state:'wait' }); });
  DE.filter(slipping).sort((a, b) => a.close - b.close).reverse().forEach((d, k) => IB.push({ id:'ib-s-' + d.id, kind:'slip', co:d.co, deal:d.id, was:d.close, to:workAfter(0, 8 + k * 2), state:'wait' }));
  CO.forEach(c => { const d = c.lead; if (d && ST[d.st].i < ST.prop.i && (c.lt === 'Pricing' || c.lt === 'Legal')) IB.push({ id:'ib-x-' + d.id, kind:'fix', fix:'stage', co:c.id, deal:d.id, lt:c.lt, to:'prop', state:'wait' }); });
  DE.filter(d => (d.st === 'disc' || d.st === 'demo') && d.adj >= 0 && d.v >= 25000 && coOf(d.co).last > 14).forEach(d => IB.push({ id:'ib-p-' + d.id, kind:'fix', fix:'prob', co:d.co, deal:d.id, days:coOf(d.co).last, to:-10, state:'wait' }));
  const waiting = () => IB.filter(x => x.state === 'wait' && coOf(x.co) && dealOf(x.deal));

  // one suggestion per account, the most pressing first: a deal past its close date, a quiet account's drafted follow-up, a
  // step that is overdue, no step at all, a data fix, then a QBR for a strategic renewal
  function sugOf(c){
    const w = IB.filter(x => x.co === c.id && x.state === 'wait' && dealOf(x.deal));
    const s = w.find(x => x.kind === 'slip'), f = w.find(x => x.kind === 'follow'), x = w.find(y => y.kind === 'fix');
    if (s){ const d = dealOf(s.deal); return { k:'slip', label:'New close date', item:s, why:`${d.n} was due ${fmtD(d.close)} and is still open. The agent suggests ${fmtDW(s.to)}.` }; }
    if (f) return { k:'follow', label:'Send follow-up', item:f, why:`No touch for ${c.last} days. The agent drafted “${f.subj}” to ${f.to}.` };
    if (c.next && c.next.day < 0) return { k:'resched', label:'Reschedule', why:`The ${low(c.next.kind)} was due ${fmtDW(c.next.day)}. The agent finds ${first(c.own)}'s first free slot for it; you confirm the time.` };
    if (!c.next && c.lead) return { k:'book', label:'Book next step', why:`Nothing is booked. The agent finds ${first(c.own)}'s first free slot for a ${low(stepFor(c, 'book')[0])}; you confirm the time.` };
    if (x) return { k:'fix', label:x.fix === 'stage' ? 'Move to Proposal' : 'Lower win %', item:x, why:fixWhy(x) };
    if (c.seg === 'Strategic' && c.tags.includes('Renewal') && c.lead && !MT.some(m => m.co === c.id && m.st === 'plan' && m.kind === 'QBR')) return { k:'qbr', label:'Book QBR', why:'A strategic renewal with no QBR booked. The agent finds a slot in about two weeks; you confirm the time.' };
    return null;
  }
  const fixWhy = x => { const d = dealOf(x.deal), c = coOf(x.co);
    return x.fix === 'stage' ? `The last touch was a ${ltName({ lt:x.lt || c.lt })}, so the ${d.n.toLowerCase()} is past Demo.` : `No touch for ${x.days ?? c.last} days, so ${d.p}% looks high for the ${d.n.toLowerCase()}.`; };

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
    // a click anywhere else, or Escape, sends the toasts away; a click on a toast itself (its Undo, its ×) is handled above
    if (!toasts._away){ toasts._away = true; const t0 = () => performance.now();
      const away = () => $$('.tst-t:not(.tst-out)', toasts).forEach(x => { if (t0() - (x._born || 0) > 250){ x.classList.add('tst-out'); setTimeout(() => x.remove(), 320); } });
      document.addEventListener('pointerdown', e => { if (!toasts.contains(e.target)) away(); }, true);
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && toasts.children.length) away(); }); }
    t._born = performance.now();
    // it times out after six seconds, held while the pointer rests on it
    let left = 6000, t0 = performance.now(), tm0 = setTimeout(out, left);
    t.addEventListener('pointerenter', () => { clearTimeout(tm0); left -= performance.now() - t0; });
    t.addEventListener('pointerleave', () => { t0 = performance.now(); tm0 = setTimeout(out, Math.max(1200, left)); });
  }

  /* ---------- what the agent does when a suggestion is accepted: each returns its toast and its undo ---------- */
  // what a booking suggestion books: one rule for its label, its tooltip, its confirm card and the meeting itself
  function stepFor(c, kind){ if (kind === 'qbr') return ['QBR', 1]; if (kind === 'resched' && c.next) return [c.next.kind, c.next.dur]; return c.lead.st === 'nego' ? NEGO[c.i % 3] : STEP[c.lead.st]; }
  // the owner's free slots, in order: on the hour and half hour, working days, 9 to 5; skip moves on to a later one
  const firstSlot = (c, dur, from = workAfter(0, 1), skip = 0, avoid) => { for (let day = from, n = 0; n < 20; day++){ if (!isWork(day)) continue; n++;
      for (let h = 9; h + dur <= 17; h += .5){ if (busy(c.own, day, h, dur, avoid)) continue; if (skip-- <= 0) return { day, h }; } } return { day:from, h:9 }; };
  const slotFrom = kind => kind === 'qbr' ? workAfter(0, 9) : workAfter(0, 1);
  function run(kind, c, item, slot){
    const now = () => 'Just now';
    if (kind === 'follow'){
      const prev = [c.last, c.lt];
      c.log.unshift(['Email', 0, `Follow-up sent to ${item.to}: “${item.subj}”`, 'The agent, approved by Noah Cole']); c.last = 0; c.lt = 'Email'; c.trend[11]++; c._fresh = true;
      item.state = 'done'; item.res = 'Sent ' + now().toLowerCase();
      return { t:`Follow-up sent to ${item.to}`, s:`${c.n}: logged as an email, last touch is now today`, undo:() => { c.log.shift(); [c.last, c.lt] = prev; c.trend[11]--; item.state = 'wait'; } };
    }
    if (kind === 'slip'){
      const d = dealOf(item.deal), was = d.close; d.close = item.to; item.state = 'done'; item.res = 'Now closes ' + fmtD(item.to);
      return { t:`${c.n}: ${d.n.toLowerCase()} now closes ${fmtDW(item.to)}`, s:`It was due ${fmtD(was)}`, undo:() => { d.close = was; item.state = 'wait'; } };
    }
    if (kind === 'fix'){
      const d = dealOf(item.deal), was = [d.st, d.adj, d.p];
      if (item.fix === 'stage') setStage(d, item.to); else { d.adj += item.to; d.p = probOf(d); }
      item.state = 'done'; item.res = item.fix === 'stage' ? 'Moved to ' + ST[item.to].t : `Now ${d.p}%`;
      return { t:item.fix === 'stage' ? `${d.n} moved to ${ST[item.to].t}` : `${d.n} lowered to ${d.p}%`, s:`${c.n}, win probability ${was[2]}% to ${d.p}%`, undo:() => { [d.st, d.adj, d.p] = was; item.state = 'wait'; } };
    }
    if (kind === 'book' || kind === 'qbr'){
      const [k, dur] = stepFor(c, kind);
      const s = slot || firstSlot(c, dur, slotFrom(kind)), m = meet({ co:c.id, deal:c.lead.id, kind:k, day:s.day, h:s.h, dur, own:c.own, by:'agent' });
      return { t:`${k} booked with ${c.n}`, s:`${fmtDW(m.day)}, ${tmA(m.h)}, on ${first(c.own)}'s calendar`, m, undo:() => { MT = MT.filter(x => x !== m); } };
    }
    if (kind === 'resched'){
      const m = c.next, was = [m.day, m.h], s = slot || firstSlot(c, m.dur, workAfter(0, 1), 0, m); m.day = s.day; m.h = s.h;
      return { t:`${m.kind} with ${c.n} moved`, s:`From ${fmtD(was[0])} to ${fmtDW(m.day)}, ${tmA(m.h)}`, m, undo:() => { [m.day, m.h] = was; } };
    }
  }
  // the table's chip, the sheet's button and the inbox's Approve all come here
  // an inbox item keeps the words and figures it had when it was approved or dismissed (its snapshot), so Done never rewrites them
  function accept(c, sug, slot){
    if (sug.item) sug.item.snap = ibSnap(sug.item);
    const r = run(sug.k, c, sug.item, slot); if (!r) return;
    if (sug.item){ const u = r.undo; r.undo = () => { u(); sug.item.snap = null; }; sug.item.undo = r.undo; }
    refresh(); say(r.t);
    toast('ok', r.t, r.s, { label:'Undo', run:() => { r.undo(); if (sug.item) sug.item.undo = null; refresh(); } });
    const tr = $(`tr[data-id="${c.id}"]`, tbody); if (tr) $$('.crm-nx, .crm-hs, .crm-agc>*', tr).forEach((x, i) => enter(x, i * 40));
  }

  const CONFIRM = new Set(['follow', 'book', 'qbr', 'resched']);
  const cfm = $('#crm-p-cfm', app); let cfFor = null;
  function buildCfm(c, sug){
    const skip = cfFor && cfFor.c === c && cfFor.sug === sug ? cfFor.skip : 0; cfFor = { c, sug, skip };
    if (sug.k === 'follow'){ const x = sug.item;
      cfm.innerHTML = `<div class="crm-cfh"><b id="crm-cft">Follow-up to ${esc(x.to)}</b><span class="muted">${esc(c.n)}, drafted by the agent</span></div><div class="crm-cfs"><span class="muted">Subject</span> ${esc(x.subj)}</div><div class="crm-cfb">${esc(x.body)}</div>`
        + `<div class="crm-cfa"><button class="pill line sm" data-cf="edit" data-close>${I('edit', 'xs')}Edit</button><button class="pill primary sm" data-cf="go" data-close>${I('send', 'xs')}Send</button></div>`;
    } else {
      const [k, dur] = stepFor(c, sug.k), sl = firstSlot(c, dur, sug.k === 'resched' ? workAfter(0, 1) : slotFrom(sug.k), skip, sug.k === 'resched' ? c.next : undefined); cfFor.slot = sl;
      cfm.innerHTML = `<div class="crm-cfh"><b id="crm-cft">${sug.k === 'resched' ? 'Move the ' + low(k) : 'Book a ' + low(k)}</b><span class="muted">${esc(c.n)}, on ${esc(first(c.own))}'s calendar</span></div>`
        + `<div class="crm-cfslot">${I('cal', 'xs')}<b class="num">${fmtDW(sl.day)}, ${tm(sl.h)} – ${tmA(sl.h + dur)}</b>${skip ? '' : '<span class="muted">first free slot</span>'}</div>`
        + `<div class="crm-cfa"><button class="pill line sm" data-cf="next">${I('refresh', 'xs')}Pick another time</button><button class="pill primary sm" data-cf="go" data-close>${sug.k === 'resched' ? 'Move' : 'Book'}</button></div>`;
    }
    cfm.setAttribute('aria-labelledby', 'crm-cft');
  }
  cfm.addEventListener('click', e => {
    const b = e.target.closest('[data-cf]'); if (!b || !cfFor) return; const { c, sug } = cfFor;
    if (b.dataset.cf === 'next'){ e.stopPropagation(); cfFor.skip++; buildCfm(c, sug); glide($('.crm-cfslot', cfm), { transform:'translateY(3px)' }, 220); $('[data-cf="next"]', cfm).focus({ preventScroll:true }); return; }
    if (b.dataset.cf === 'go'){ const sl = cfFor.slot; cfFor = null; setTimeout(() => accept(c, sug, sl), 0); return; }
    if (b.dataset.cf === 'edit'){ const x = sug.item; cfFor = null; setTimeout(() => { closeSheet(); setView('inbox'); ibSel = x.id; edFor = x.id; renderInbox(); const ta = $('.crm-ta', ipv); if (ta){ ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); } }, 130); }
  });
  // the chip (or the sheet's button) opens the card; a keyboard opens it with the focus on its main button
  const sugGo = (c, btn, kb) => { if (!c.sug) return; if (!CONFIRM.has(c.sug.k)) return accept(c, c.sug); buildCfm(c, c.sug); if (kb) setTimeout(() => $('[data-cf="go"]', cfm)?.focus({ preventScroll:true }), 40); };

  /* ---------- the state of the filters, the selection and what is open ---------- */
  // A holds the filters as Filter menu's chips: a field, a value, and whether it reads the other way (is not, older than)
  const F = { A:[], q:'', S:[{ k:'value', desc:true }], said:'', own:new Set() };
  // the board starts with Closed lost hidden, as a chip in the hidden stages' dock
  const K = { own:new Set(), q:'', A:[], S:[{ k:'close', desc:false }], view:'board', shut:new Set(['lost']), tab:'disc', order:STAGES.map(s => s.k), draft:null };
  // the board's column order lasts the session (a reload keeps it; a new tab starts from the stages' order)
  try { const o = JSON.parse(sessionStorage.getItem('crm-col-order') || 'null'); if (Array.isArray(o) && o.length === STAGES.length && STAGES.every(s => o.includes(s.k))) K.order = o; } catch(e){}
  const saveOrder = () => { try { sessionStorage.setItem('crm-col-order', JSON.stringify(K.order)); } catch(e){} };
  const sel = new Set();
  let view = 'accounts', sheetFor = null, rowMenuFor = null, mvFor = null, stageFor = null;

  /* ---------- the filters: Filter menu ---------- */
  const openOf = c => DE.filter(d => d.co === c.id && !closed(d));
  const CLOSE = { week:['This week', d => d.close >= 0 && d.close <= 7], month:['This month or overdue', d => d.close <= eom], quarter:['This quarter', d => d.close >= 0 && d.close <= eoq], late:['Passed', d => d.close < 0] };
  const FL = {
    owner:{ l:'Owner', ic:'user', ops:['is', 'is not'], o:() => OWN.map(o => ({ v:o, l:P[o][0], g:av(o) })), test:(c, v) => c.own === v },
    stage:{ l:'Stage', ic:'layers', ops:['is', 'is not'], o:() => STAGES.map(s => ({ v:s.k, l:s.t, g:`<span class="dot crm-sd" data-s="${s.k}"></span>` })), test:(c, v) => c.st === v },
    close:{ l:'Close date', ic:'target', ops:['is', 'is not'], o:() => Object.entries(CLOSE).map(([v, x]) => ({ v, l:x[0] })), test:(c, v) => openOf(c).some(CLOSE[v][1]) },
    next:{ l:'Next step', ic:'cal', ops:['is', 'is not'], o:() => [{ v:'none', l:'Missing' }, { v:'late', l:'Overdue' }, { v:'week', l:'In 7 days' }], test:(c, v) => v === 'none' ? !c.next : v === 'late' ? !!c.next && c.next.day < 0 : !!c.next && c.next.day >= 0 && c.next.day <= 7 },
    last:{ l:'Last touch', ic:'history', ops:['within', 'older than'], o:() => [{ v:7, l:'7 days' }, { v:14, l:'14 days' }, { v:30, l:'30 days' }], test:(c, v) => c.last <= v },
    value:{ l:'Pipeline', ic:'dollar', ops:['over', 'up to'], o:() => [...new Set([50000, 100000, 250000, 500000, ...F.A.filter(f => f.k === 'value').map(f => f.v)])].sort((a, b) => a - b).map(v => ({ v, l:kmoney(v) })), test:(c, v) => c.value > v },
    health:{ l:'Health', ic:'gauge', ops:['is', 'is not'], o:() => [{ v:'ok', l:'Healthy' }, { v:'mid', l:'Watch' }, { v:'bad', l:'At risk' }], test:(c, v) => c.hb === v },
  };
  // the saved views in the sidebar are filters too
  const SAVED = { closing:['Closing this month', [{ k:'close', v:'month', neg:false }]], nostep:['No next step', [{ k:'next', v:'none', neg:false }]], quiet:['Quiet for 2+ weeks', [{ k:'last', v:14, neg:true }]] };
  const sameA = (X, Y) => X.length === Y.length && Y.every(x => X.some(a => a.k === x.k && a.v === x.v && a.neg === x.neg));
  const savedOn = () => Object.keys(SAVED).find(k => sameA(F.A, SAVED[k][1])) || null;
  const valOf = (k, v) => FL[k].o().find(o => o.v === v);
  const fmatch = (c, skip) => F.A.every(f => f.k === skip || FL[f.k].test(c, f.v) !== f.neg);
  const savedCount = k => CO.filter(c => SAVED[k][1].every(f => FL[f.k].test(c, f.v) !== f.neg)).length;

  /* ---------- Accounts: the table ---------- */
  const tbody = $('.crm-t tbody', app), tableBox = $('.crm-co', app), scroller = $('.crm-sc', app);
  const allBox = $('.ttx-all', app), sb = $('.crm-hd .ttx-sb', app);
  const tick = I('check', 'xs').replace('class="i xs"', 'class="i xs ck-y"') + I('minus', 'xs').replace('class="i xs"', 'class="i xs ck-m"');
  allBox.innerHTML = tick;
  $$('.crm-t .ttx-s', app).forEach(b => b.insertAdjacentHTML('beforeend', `<span class="ar">${I('chev-u', 'xs')}</span>`));
  // column widths, as in a spreadsheet (owner, 10 Nov): drag a header's right edge, or focus its handle and use the arrow
  // keys; a narrower column cuts its text short and the table scrolls sideways once the columns outgrow it. The widths last
  // the session; a double click on a handle gives every column its natural width back. Not on phones, where rows are cards
  {
    const tbl = $('.crm-t', app), heads = $$('thead th', tbl), cg = document.createElement('colgroup');
    cg.innerHTML = heads.map(() => '<col>').join(''); tbl.prepend(cg);
    const cols = $$('col', cg), RZ = [1, 2, 3, 4, 5, 6, 7], MIN = { 1:150 }, wide = matchMedia('(min-width:761px)');
    let colW = null; try { colW = JSON.parse(sessionStorage.getItem('crm-colw') || 'null'); if (!Array.isArray(colW) || colW.length !== heads.length) colW = null; } catch (e) {}
    const name = h => h.textContent.trim() || 'column';
    const apply = () => {
      if (!colW || !wide.matches){ tbl.classList.remove('rz'); cols.forEach(c => c.style.width = ''); tbl.style.width = ''; return; }
      cols.forEach((c, i) => c.style.width = i === cols.length - 1 ? '' : colW[i] + 'px');
      tbl.style.width = `max(100%, ${colW.slice(0, -1).reduce((a, b) => a + b, 0) + 48}px)`; tbl.classList.add('rz');
      RZ.forEach(i => { const h = $('.crm-rz', heads[i]); if (h) h.setAttribute('aria-valuenow', colW[i]); });
    };
    const measure = () => { if (!colW) colW = heads.map(h => Math.round(h.getBoundingClientRect().width)); };
    const save = () => { try { sessionStorage.setItem('crm-colw', JSON.stringify(colW)); } catch (e) {} };
    RZ.forEach(i => heads[i].insertAdjacentHTML('beforeend', `<span class="crm-rz" role="separator" aria-orientation="vertical" tabindex="0" aria-valuemin="${MIN[i] || 72}" aria-label="Resize ${esc(name(heads[i]))}" data-tip="Drag to resize, double click to reset" data-i="${i}"></span>`));
    tbl.addEventListener('pointerdown', e => { const g = e.target.closest('.crm-rz'); if (!g || e.button) return;
      e.preventDefault(); e.stopPropagation(); hideTip(); measure(); const i = +g.dataset.i, x0 = e.clientX, w0 = colW[i];
      g.setPointerCapture(e.pointerId); g.classList.add('on'); tbl.classList.add('rzing');
      const mv = ev => { colW[i] = Math.max(MIN[i] || 72, Math.round(w0 + ev.clientX - x0)); apply(); };
      const up = () => { g.removeEventListener('pointermove', mv); g.removeEventListener('pointerup', up); g.removeEventListener('pointercancel', up); g.classList.remove('on'); tbl.classList.remove('rzing'); save(); };
      g.addEventListener('pointermove', mv); g.addEventListener('pointerup', up); g.addEventListener('pointercancel', up); });
    tbl.addEventListener('click', e => { if (e.target.closest('.crm-rz')) e.stopPropagation(); }, true);
    tbl.addEventListener('dblclick', e => { if (!e.target.closest('.crm-rz')) return; colW = null; try { sessionStorage.removeItem('crm-colw'); } catch (er) {} apply(); });
    tbl.addEventListener('keydown', e => { const g = e.target.closest('.crm-rz'); if (!g || !/^Arrow(Left|Right)$/.test(e.key)) return;
      e.preventDefault(); e.stopPropagation(); measure(); const i = +g.dataset.i; colW[i] = Math.max(MIN[i] || 72, colW[i] + (e.key === 'ArrowRight' ? 16 : -16)); apply(); save(); });
    wide.addEventListener('change', apply); apply();
  }
  // the summary row (owner, 10 Nov): pinned to the table's foot as it scrolls, the count of accounts in view under Account and a
  // calculation under any other column, picked from the cell itself. Pipeline starts on its sum and Health on its average;
  // an empty cell offers one when the row is hovered. It follows the filters, the search and the columns' widths
  const n0 = v => typeof v === 'number' ? v.toLocaleString('en-US') : v;
  const med = a => { const b = [...a].sort((x, y) => x - y), m = b.length >> 1; return b.length ? (b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2) : 0; };
  const avgOf = (r, f) => r.length ? sum(r, f) / r.length : 0;
  const CALC = {
    stage:{ uniq:['Unique', r => [new Set(r.map(c => c.st)).size, 'stages']],
      top:['Most common', r => { const n = {}; r.forEach(c => n[c.st] = (n[c.st] || 0) + 1); const k = Object.keys(n).sort((a, b) => n[b] - n[a])[0]; return k ? [ST[k].t, 'most common'] : [0, 'accounts']; }] },
    next:{ none:['No next step', r => [r.filter(c => !c.next).length, 'without one']], late:['Overdue', r => [r.filter(c => c.next && c.next.day < 0).length, 'overdue']],
      week:['In 7 days', r => [r.filter(c => c.next && c.next.day >= 0 && c.next.day <= 7).length, 'in 7 days']] },
    owner:{ uniq:['Unique', r => [new Set(r.map(c => c.own)).size, 'owners']] },
    value:{ sum:['Sum', r => [kmoney(sum(r, c => c.value)), 'sum']], avg:['Average', r => [kmoney(avgOf(r, c => c.value)), 'average']], med:['Median', r => [kmoney(med(r.map(c => c.value))), 'median']],
      min:['Smallest', r => [kmoney(r.length ? Math.min(...r.map(c => c.value)) : 0), 'smallest']], max:['Largest', r => [kmoney(r.length ? Math.max(...r.map(c => c.value)) : 0), 'largest']] },
    health:{ avg:['Average', r => [Math.round(avgOf(r, c => c.health)), 'average']], med:['Median', r => [Math.round(med(r.map(c => c.health))), 'median']],
      min:['Lowest', r => [r.length ? Math.min(...r.map(c => c.health)) : 0, 'lowest']], risk:['At risk', r => [r.filter(c => c.hb === 'bad').length, 'at risk']] },
    agent:{ sug:['Suggestions', r => [r.filter(c => c.sug).length, 'suggested']] },
  };
  const calcOn = { value:'sum', health:'avg' };
  const tfKeys = [null, 'name', 'stage', 'next', 'owner', 'value', 'health', 'agent', null], colName = {};
  $$('.crm-t thead th', app).forEach((th, i) => { if (tfKeys[i]) colName[tfKeys[i]] = th.textContent.trim(); });
  const tfr = $('.crm-t', app).createTFoot().insertRow(); tfr.className = 'crm-tf';
  tfKeys.forEach((k, i) => { const td = document.createElement('td');
    if (i === 0) td.className = 'ck stk'; else if (k === 'name') td.className = 'stk2';
    if (k === 'name') td.innerHTML = '<span class="crm-tfc"></span>';
    else if (k) td.innerHTML = `<button class="crm-tfb" data-k="${k}" data-pop="#crm-p-calc" data-pop-pos="up" aria-haspopup="menu"></button>`;
    tfr.appendChild(td); });
  function paintCalcs(){
    $('.crm-tfc', tfr).innerHTML = `<b class="num">${rows.length}</b><span>${rows.length === 1 ? 'account' : 'accounts'}</span>`;
    $$('.crm-tfb', tfr).forEach(b => { const k = b.dataset.k, c = calcOn[k];
      if (c){ const [v, l] = CALC[k][c][1](rows); b.innerHTML = `<b class="num">${n0(v)}</b><span>${l}</span>`; b.classList.add('on'); b.setAttribute('aria-label', `${colName[k]}: ${n0(v)} ${l}. Change the calculation`); }
      else { b.innerHTML = `${I('plus', 'xs')}<span>Add calculation</span>`; b.classList.remove('on'); b.setAttribute('aria-label', `Add a calculation for ${colName[k]}`); } });
  }
  // the columns' order (owner, 10 Nov): drag a column's header sideways to move it; a line shows where it will land and the
  // column being moved is tinted. Account stays first, the checkbox and the row menu at the ends; the order lasts the
  // session. From the keyboard, Alt and an arrow on a header moves its column. Wide screens only: on phones rows are cards
  const COLS = { apply:() => {} };
  {
    const tbl = $('.crm-t', app), sc = $('.crm-sc', app), N = $$('thead th', tbl).length, MOV = [2, 3, 4, 5, 6, 7], wideQ = matchMedia('(min-width:761px)');
    let order = null; try { order = JSON.parse(sessionStorage.getItem('crm-colord') || 'null'); if (!Array.isArray(order) || order.length !== N) order = null; } catch (e) {}
    const cur = () => order && wideQ.matches ? order : [...Array(N).keys()];
    const lines = () => [$('colgroup', tbl), ...$$('tr', tbl)].filter(r => r && r.children.length === N);
    COLS.apply = () => { const o = cur(); lines().forEach(r => { [...r.children].forEach((c, i) => { if (c.dataset.ci == null) c.dataset.ci = i; });
      const by = {}; [...r.children].forEach(c => by[c.dataset.ci] = c); o.forEach(i => r.appendChild(by[i])); }); };
    const save = () => { try { sessionStorage.setItem('crm-colord', JSON.stringify(order)); } catch (e) {} };
    const moveTo = (ci, pos) => { order = [...cur()]; const from = order.indexOf(ci); order.splice(from, 1); order.splice(pos > from ? pos - 1 : pos, 0, ci); COLS.apply(); save(); };
    const cells = ci => $$(`[data-ci="${ci}"]`, tbl).filter(c => c.tagName !== 'COL');
    let drag = null, justDragged = false;
    tbl.addEventListener('pointerdown', e => {
      const th = e.target.closest('thead th'); if (!th || e.button || !wideQ.matches || e.target.closest('.crm-rz')) return;
      COLS.apply(); const ci = +th.dataset.ci; if (!MOV.includes(ci)) return;
      drag = { th, ci, x0:e.clientX, on:false, id:e.pointerId };
    });
    const ghost = document.createElement('div'); ghost.className = 'crm-cghost'; const bar = document.createElement('div'); bar.className = 'crm-cdi';
    window.addEventListener('pointermove', e => {
      if (!drag) return;
      if (!drag.on){ if (Math.abs(e.clientX - drag.x0) < 6) return; drag.on = true; hideTip(); tbl.classList.add('crm-coldrag'); cells(drag.ci).forEach(c => c.classList.add('crm-cdr'));
        ghost.textContent = drag.th.textContent.trim(); document.body.appendChild(ghost); sc.appendChild(bar); }
      ghost.style.transform = `translate(${e.clientX + 12}px,${e.clientY - 14}px)`;
      // where it lands: the gap between two movable columns nearest the pointer
      const hs = $$('thead th', tbl), pos = hs.map((h, i) => ({ h, i, ci:+h.dataset.ci })), mov = pos.filter(x => MOV.includes(x.ci));
      const first = mov[0].i, last = mov[mov.length - 1].i;
      let at = last + 1; for (const x of mov){ const r = x.h.getBoundingClientRect(); if (e.clientX < r.left + r.width / 2){ at = x.i; break; } }
      drag.at = at; const ref = at <= last ? hs[at].getBoundingClientRect().left : hs[last].getBoundingClientRect().right, sr = sc.getBoundingClientRect();
      bar.style.left = (ref - sr.left + sc.scrollLeft - 1) + 'px'; bar.style.height = Math.max(sc.scrollHeight, tbl.offsetHeight) + 'px';
      if (first < 0) drag.at = null;
    });
    const end = () => { if (!drag) return; const d = drag; drag = null;
      if (d.on){ justDragged = true; setTimeout(() => justDragged = false, 0); ghost.remove(); bar.remove(); tbl.classList.remove('crm-coldrag'); cells(d.ci).forEach(c => c.classList.remove('crm-cdr'));
        if (d.at != null) moveTo(d.ci, d.at); } };
    window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
    tbl.addEventListener('click', e => { if (justDragged && e.target.closest('thead')){ e.stopPropagation(); e.preventDefault(); justDragged = false; } }, true);
    tbl.addEventListener('keydown', e => { const th = e.target.closest('thead th'); if (!th || !e.altKey || !/^Arrow(Left|Right)$/.test(e.key) || !wideQ.matches) return;
      COLS.apply(); const ci = +th.dataset.ci; if (!MOV.includes(ci)) return; e.preventDefault(); e.stopPropagation();
      const o = cur(), p0 = o.indexOf(ci), slots = o.map((c, i) => MOV.includes(c) ? i : -1).filter(i => i >= 0), k = slots.indexOf(p0) + (e.key === 'ArrowLeft' ? -1 : 1);
      if (k < 0 || k >= slots.length) return; moveTo(ci, e.key === 'ArrowLeft' ? slots[k] : slots[k] + 1); e.target.focus({ preventScroll:true }); });
    wideQ.addEventListener('change', () => COLS.apply());
  }
  let calcFor = null;
  $$('.crm-tfb', tfr).forEach(b => b.addEventListener('click', () => {
    calcFor = b.dataset.k; const p = $('#crm-p-calc', app), cur = calcOn[calcFor];
    p.innerHTML = `<div class="ph" role="none">${esc(colName[calcFor])}</div>` + Object.entries(CALC[calcFor]).map(([id, [l, f]]) => mi(`data-c="${id}"`, `<span>${l}</span><span class="r num">${n0(f(rows)[0])}</span>`, 'menuitemradio', cur === id)).join('')
      + (cur ? `<div class="sep" role="separator"></div>` + mi('data-c=""', `${I('x', 's')}<span>None</span>`, 'menuitem') : '');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { if (m.dataset.c) calcOn[calcFor] = m.dataset.c; else delete calcOn[calcFor]; paintCalcs(); }));
  }));
  const SORTS = { value:['Pipeline', c => c.value, 'dollar', 'Low to high', 'High to low'], health:['Health', c => c.health, 'gauge', 'Low to high', 'High to low'], next:['Next step', c => c.next ? c.next.day * 100 + c.next.h : 1e6, 'cal', 'Soonest first', 'Latest first'], name:['Account', c => c.n.toLowerCase(), 'globe', 'A to Z', 'Z to A'], stage:['Stage', c => ST[c.st].i, 'layers', 'Earliest first', 'Latest first'], owner:['Owner', c => P[c.own][0], 'user', 'A to Z', 'Z to A'] };
  const ASC = ['name', 'owner', 'next'];
  const qOk = c => !F.q || (c.n + ' ' + c.seg + ' ' + c.tags.join(' ') + ' ' + P[c.own][0] + ' ' + c.ppl.map(p => p.n).join(' ')).toLowerCase().includes(F.q.toLowerCase());
  const matches = c => qOk(c) && fmatch(c) && (!F.own.size || F.own.has(c.own));
  // the owners' faces at the toolbar's start, the Pipeline board's quick filter: any number can be picked
  const acFp = $('.crm-afp', app);
  acFp.innerHTML = OWN.map(o => `<button aria-pressed="false" data-who="${o}" aria-label="${P[o][0]}" data-tip="${P[o][0]}">${av(o)}</button>`).join('');
  acFp.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; F.own.has(b.dataset.who) ? F.own.delete(b.dataset.who) : F.own.add(b.dataset.who); renderTable(); });
  const cmp = (x, y) => x > y ? 1 : x < y ? -1 : 0;
  const inView = () => {
    const by = F.S.map(r => [SORTS[r.k][1], r.desc ? -1 : 1]);
    return CO.filter(matches).sort((a, b) => { for (const [f, d] of by){ const x = cmp(f(a), f(b)) * d; if (x) return x; } return a.n.localeCompare(b.n); });
  };
  const sortLabel = () => SORTS[F.S[0].k][0] + (F.S.length > 1 ? ` +${F.S.length - 1}` : '');
  // a filter as its chip reads it, and how many accounts the view would show without it
  const fText = f => `${FL[f.k].l} ${FL[f.k].ops[+f.neg]} ${valOf(f.k, f.v).l}`;
  const relaxed = () => F.A.map(f => ({ f, n:CO.filter(c => qOk(c) && F.A.every(g => g === f || FL[g.k].test(c, g.v) !== g.neg)).length })).filter(x => x.n).sort((a, b) => b.n - a.n);
  // rows glide to their new places when the order or the filters change; rows that arrive fade up. Only the rows on screen
  // move, a long jump fades instead of sliding, and nothing moves with reduced motion
  const snapRows = () => { if (REDUCE || !tbody.firstElementChild) return null; const m = new Map(); $$('tr[data-id]', tbody).forEach(tr => m.set(tr.dataset.id, tr.getBoundingClientRect().top)); return m.size ? m : null; };
  const playRows = m => {
    if (!m || !scroller.offsetParent) return; const sc = scroller.getBoundingClientRect(); let k = 0;
    $$('tr[data-id]', tbody).forEach(tr => { const r = tr.getBoundingClientRect(); if (r.bottom < sc.top || r.top > sc.bottom) return;
      const was = m.get(tr.dataset.id), dy = was == null ? null : was - r.top;
      if (dy == null || Math.abs(dy) > sc.height) tr.animate([{ opacity:0, transform:'translateY(6px)' }, { opacity:1, transform:'none' }], { duration:260, delay:Math.min(k++, 10) * 16, easing:EASE, fill:'backwards' });
      else if (Math.abs(dy) > 1) tr.animate([{ transform:`translateY(${dy}px)` }, { transform:'none' }], { duration:340, easing:EASE }); });
  };
  // each segment and tag keeps one colour wherever it shows (the core tag's colours: blue, violet, green, orange, red, yellow, pink, teal)
  const HUE = { Strategic:'l', Enterprise:'b', 'Mid-market':'t', SMB:'k', Expansion:'m', Renewal:'p', 'More seats':'y', Pilot:'k', 'First deal':'b', 'Partner-led':'l', Reseller:'t', Champion:'m', 'Budget set':'y', 'Security review':'r', 'Multi-year':'p' };
  const chip = t => `<span class="tag ${HUE[t] || 'bltmprky'[[...t].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 8]}">${esc(t)}</span>`;
  // the next step: what it is and when, from the calendar; red when it is overdue or missing
  // the pipeline cell's second line: how many deals, or, while a close date filter is on, the deal it matched and when it closes
  const dueLine = c => { const f = F.A.find(x => x.k === 'close' && !x.neg); if (!f) return `<span class="muted">${plural(c.deals, 'open deal')}</span>`;
    const d = openOf(c).filter(CLOSE[f.v][1]).sort((a, b) => a.close - b.close)[0]; if (!d) return `<span class="muted">${plural(c.deals, 'open deal')}</span>`;
    return d.close < 0 ? `<span class="crm-due late">Overdue, due ${fmtD(d.close)}</span>` : `<span class="crm-due">Closes ${fmtD(d.close)}</span>`; };
  const nextCell = c => { const m = c.next;
    if (!m) return `<span class="crm-nx none"><span class="k">No next step</span><span class="d">Last touch ${c.last === 0 ? 'today' : c.last + 'd ago'}</span></span>`;
    const late = m.day < 0;
    return `<span class="crm-nx${late ? ' late' : ''}" data-m="${m.id}"><span class="k">${esc(m.kind)}</span><span class="d num">${late ? `Overdue, was ${fmtDW(m.day)}` : `${fmtDW(m.day)}, ${tmA(m.h)}`}</span></span>`; };
  // health: Health score's ring at row size, with its score and its verdict
  const HB = { ok:'Healthy', mid:'Watch', bad:'At risk' };
  const ring = (v, r) => { const C = 2 * Math.PI * r, w = r * 2 + 8; return `<svg viewBox="0 0 ${w} ${w}" aria-hidden="true"><circle class="tr" cx="${w / 2}" cy="${w / 2}" r="${r}"/><circle class="fl" cx="${w / 2}" cy="${w / 2}" r="${r}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - v / 100)).toFixed(1)}"/></svg>`; };
  const healthCell = c => `<span class="crm-hs" data-h="${c.hb}" data-tip="${HB[c.hb]}. Contact ${c.hp[0]} of 35, on time ${c.hp[1]} of 25, win chance ${c.hp[2]} of 25, next step ${c.hp[3]} of 15">${ring(c.health, 7)}<b class="num" aria-label="Health ${c.health} of 100, ${HB[c.hb].toLowerCase()}">${c.health}</b></span>`;
  const agentCell = c => c.sug ? `<button class="pill soft sm crm-ag" data-sug="${c.id}" tabindex="-1"${CONFIRM.has(c.sug.k) ? ' data-pop="#crm-p-cfm" data-pop-align="end" aria-haspopup="dialog"' : ''} data-tip="${esc(c.sug.why)}" aria-label="${esc(c.sug.label)}. ${esc(c.sug.why)}">${I('spark', 'xs')}<span>${c.sug.label}</span></button>` : '';
  const row = c => `<tr data-id="${c.id}" tabindex="-1" class="${sel.has(c.id) ? 'sel' : ''}${sheetFor === c.id ? ' open' : ''}" aria-label="${esc(c.n)}">`
    + `<td class="ck stk"><button class="ttx-cb" role="checkbox" aria-checked="${sel.has(c.id)}" aria-label="Select ${esc(c.n)}" tabindex="-1">${tick}</button></td>`
    + `<td class="stk2"><span class="nm"><span class="pfm-lg sm" aria-hidden="true">${esc(c.n[0])}</span><span class="tx"><span class="t" title="${esc(c.n)}">${esc(c.n)}</span><span class="s">${esc(c.seg)}</span></span></span></td>`
    + `<td>${pill(c.st)}</td><td>${nextCell(c)}</td><td><span class="ag">${av(c.own)}${esc(P[c.own][0])}</span></td>`
    + `<td class="r"><span class="crm-pv"><b class="num">${money(c.value)}</b>${dueLine(c)}</span></td><td class="crm-hc">${healthCell(c)}</td><td class="crm-agc">${agentCell(c)}</td>`
    + `<td class="r"><button class="ib crm-rm" data-pop="#crm-p-row" data-pop-align="end" aria-haspopup="menu" aria-label="Actions for ${esc(c.n)}" tabindex="-1">${I('more', 'xs')}</button></td></tr>`;
  let rows = [], focusId = null;
  function renderTable(){
    rows = inView(); const snap = snapRows();
    const rx = rows.length ? [] : relaxed().slice(0, 2);
    tbody.innerHTML = rows.length ? rows.map(row).join('') : `<tr class="crm-empty"><td colspan="9"><div class="ttx-em"><span class="ic">${I('filter')}</span><b>No accounts match all of these</b><span>${rx.length ? 'Drop one filter to see more.' : 'Try another filter or search.'}</span><span class="crm-relax">${rx.map(x => `<button class="pill line sm" data-relax="${x.f.k}" aria-label="Remove the filter ${esc(fText(x.f))}, ${plural(x.n, 'account')}">Drop “${esc(fText(x.f))}”<span class="num">${x.n}</span></button>`).join('')}<button class="pill ghost sm crm-clr2">Clear filters</button></span></div></td></tr>`;
    tbody.insertAdjacentHTML('beforeend', '<tr class="crm-fill" aria-hidden="true"><td colspan="9"></td></tr>');
    playRows(snap);
    // one row at a time is in the Tab order; the arrow keys move between them
    const keep = rows.find(c => c.id === focusId) || rows[0]; if (keep) $(`tr[data-id="${keep.id}"]`, tbody).tabIndex = 0;
    $$('.crm-t .ttx-s', app).forEach(b => { const on = b.dataset.k === F.S[0].k; b.classList.toggle('on', on); b.classList.toggle('desc', on && F.S[0].desc); b.closest('th').setAttribute('aria-sort', on ? (F.S[0].desc ? 'descending' : 'ascending') : 'none'); });
    swap($('.crm-sort .v', app), sortLabel());
    $$('button', acFp).forEach(b => b.setAttribute('aria-pressed', F.own.has(b.dataset.who))); acFp.classList.toggle('some', F.own.size > 0);
    syncSel(); chips(); counts(); paintCalcs(); COLS.apply();
  }
  function syncSel(){
    [...sel].forEach(id => { if (!coOf(id)) sel.delete(id); });
    $$('tr[data-id]', tbody).forEach(tr => { const on = sel.has(tr.dataset.id); tr.classList.toggle('sel', on); $('.ttx-cb', tr).setAttribute('aria-checked', on); });
    const n = rows.filter(c => sel.has(c.id)).length;
    allBox.setAttribute('aria-checked', !n ? 'false' : n === rows.length ? 'true' : 'mixed');
    tableBox.classList.toggle('selecting', sel.size > 0); sb.inert = !sel.size;
    if (sel.size) $('.ttx-n', sb).textContent = sel.size + ' selected';
  }
  // the filters as Filter menu's chips: the field, is or is not (press it to turn it round), the value and its x
  const fch = $('.crm-fch', app);
  function chips(){
    const have = new Set(F.A.map(f => f.k));
    $$('.flm-ch', fch).forEach(ch => { if (have.has(ch.dataset.k) || ch.classList.contains('gone')) return; chipLeave(ch); });
    F.A.forEach(f => {
      let ch = $(`.flm-ch[data-k="${f.k}"]:not(.gone)`, fch);
      if (!ch){ ch = html(`<div class="flm-ch" role="listitem" data-k="${f.k}"><span class="k">${FL[f.k].l}</span><button class="op"></button><span class="v"></span><button class="x">${I('x', 'xs')}</button></div>`); fch.appendChild(ch); }
      else ch.classList.add('seen');
      const o = valOf(f.k, f.v), op = FL[f.k].ops[+f.neg], text = `${FL[f.k].l} ${op} ${o.l}`;
      $('.op', ch).textContent = op; $('.v', ch).textContent = o.l;
      $('.op', ch).setAttribute('aria-label', `${text}: change to ${FL[f.k].ops[+!f.neg]}`); $('.op', ch).dataset.tip = `Change to ${FL[f.k].ops[+!f.neg]}`;
      $('.x', ch).setAttribute('aria-label', `Remove filter ${text}`); $('.x', ch).dataset.tip = 'Remove filter';
    });
    const on = F.A.length || F.q, cr = $('.crm-chips', app), was = cr.hidden;
    cr.hidden = !on; if (on && was) glide(cr, { transform:'translateX(-4px)' }, 240);
    const sv = $('.crm-save', app), canSave = F.A.length > 0 && !savedOn(); if (sv.hidden === canSave){ sv.hidden = !canSave; if (canSave) enter(sv); }
    $('.crm-clr', app).hidden = !on;
    $('.crm-inview', app).textContent = on ? `${rows.length} of ${CO.length}` : '';
    $('.crm-ftr', app).classList.toggle('on', F.A.length > 0);
    navCurrent();
  }
  fch.addEventListener('click', e => {
    const ch = e.target.closest('.flm-ch'); if (!ch) return; const k = ch.dataset.k;
    if (e.target.closest('.op')){ const f = F.A.find(x => x.k === k); f.neg = !f.neg; said(''); renderTable(); }
    if (e.target.closest('.x')){ const had = ch.contains(document.activeElement), next = ch.nextElementSibling || ch.previousElementSibling; F.A = F.A.filter(x => x.k !== k); hideTip(); said(''); renderTable(); if (had) ((next && $('.x', next)) || $('.crm-ftr', app)).focus({ preventScroll:true }); }
  });
  const clearFilters = () => { F.A = []; F.q = ''; F.own.clear(); const q = $('.crm-ask input', app); q.value = ''; $('.crm-ask .six-x', app).hidden = true; said(''); renderTable(); };
  $('.crm-clr', app).onclick = clearFilters;
  // the Filter menu: two steps, the fields and then the values of the one picked, each saying how many accounts it leaves
  const fpop = $('#crm-p-flt', app);
  function fstep(k, focus){
    if (!k){
      fpop.setAttribute('aria-label', 'Filter by');
      fpop.innerHTML = `<div class="ph" role="none">Filter by</div>` + Object.entries(FL).map(([key, f]) => { const a = F.A.find(x => x.k === key), o = a && valOf(key, a.v);
        return `<button class="mi" role="menuitem" aria-haspopup="menu" tabindex="-1" data-k="${key}">${I(f.ic)}<span>${f.l}</span><span class="r">${o ? `<i class="crm-fon" role="img" aria-label="In use: ${esc(f.ops[+a.neg] + ' ' + o.l)}"></i>` : ''}</span>${I('chev-r', 'xs')}</button>`; }).join('');
    } else {
      const f = FL[k], on = F.A.find(x => x.k === k);
      fpop.setAttribute('aria-label', f.l);
      fpop.innerHTML = `<button class="mi flm-bk" role="menuitem" tabindex="-1" aria-label="Back to all fields">${I('chev-l', 'xs')}<span>${f.l}</span></button><div class="sep" role="separator"></div>`
        + f.o().map(o => `<button class="mi" role="menuitemradio" aria-checked="${!!on && on.v === o.v}" tabindex="-1" data-close data-v="${o.v}">${o.g || ''}<span>${o.l}</span><span class="r num">${CO.filter(c => fmatch(c, k) && f.test(c, o.v)).length}</span><span class="ck">${I('check', 'xs')}</span></button>`).join('');
    }
    if (fpop.dataset.k !== (k || '')) glide(fpop, { transform:`translateX(${k ? 8 : -8}px)` }, 220);
    fpop.dataset.k = k || '';
    if (focus) setTimeout(() => { const m = k ? ($('.mi[aria-checked="true"]', fpop) || $$('.mi', fpop)[1]) : ($(`.mi[data-k="${focus}"]`, fpop) || $('.mi', fpop)); if (m) m.focus({ preventScroll:true }); });
  }
  $('.crm-ftr', app).addEventListener('click', () => fstep(null));
  fpop.addEventListener('click', e => {
    const m = e.target.closest('.mi'); if (!m) return; const kb = !e.detail;
    if (m.classList.contains('flm-bk') || m.dataset.k) e.stopPropagation();
    if (m.classList.contains('flm-bk')){ const from = fpop.dataset.k; fstep(null, kb || fpop.contains(document.activeElement) ? from : null); return; }
    if (m.dataset.k){ fstep(m.dataset.k, kb || fpop.contains(document.activeElement)); return; }
    const k = fpop.dataset.k, raw = m.dataset.v, v = k === 'last' || k === 'value' ? +raw : raw, f = F.A.find(x => x.k === k);
    if (f){ f.v = v; f.neg = false; } else F.A.push({ k, v, neg:false });
    $$('.mi[data-v]', fpop).forEach(x => x.setAttribute('aria-checked', x === m)); said(''); renderTable();
  });
  fpop.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' && !fpop.dataset.k){ const m = e.target.closest('.mi[data-k]'); if (m){ e.preventDefault(); e.stopPropagation(); fstep(m.dataset.k, true); } }
    else if (e.key === 'ArrowLeft' && fpop.dataset.k){ e.preventDefault(); e.stopPropagation(); fstep(null, fpop.dataset.k); }
  }, true);

  /* ---------- search, or ask in plain words: Search input's field and its answer line ---------- */
  const ask = $('.crm-ask input', app), askx = $('.crm-ask .six-x', app), ans = $('.crm-ans', app);
  const asked = t => t.trim().split(/\s+/).length >= 3;
  // the words the agent understands: each phrase becomes a filter and is taken out of the query; what is left, bar filler
  // words, is what it could not read, and the answer says so
  const FILLER = new Set('a an the and or with without that which who whose are is be been being in on of for to my our their me show find list get give see all any please only just accounts account deals deal companies company customers there have has having where what whats want i we us by at from it them those these some value worth pipeline total open'.split(' '));
  const AMT = { k:1e3, thousand:1e3, m:1e6, mn:1e6, million:1e6 };
  function parse(t0){
    let t = ' ' + t0.toLowerCase().replace(/[’]/g, "'") + ' '; const A = [];
    const take = re => { const m = t.match(re); if (!m) return null; t = t.slice(0, m.index) + ' '.repeat(m[0].length) + t.slice(m.index + m[0].length); return m; };
    // amounts: over, above, more than, at least, ≥ and > (and the opposites), with k or M
    let m;
    while ((m = take(/(over|above|more than|greater than|at least|>=|≥|>|under|below|less than|at most|<=|≤|<)\s*\$?\s*(\d[\d,]*(?:\.\d+)?)\s*(k|m|mn|thousand|million)?\b/))){
      const n = parseFloat(m[2].replace(/,/g, '')) * (AMT[m[3]] || 1), under = /under|below|less|most|<|≤/.test(m[1]); A.push({ k:'value', v:n, neg:under }); }
    const late = take(/\b(slipp\w*|overdue deals?|past (its|their|the) close( dates?)?|missed (its|their|the) close( dates?)?|close dates? (has |have )?passed)\b/);
    const cl = take(/\b(clos\w*)( (this|next|within the next|in the next) (week|month|quarter|7 days|30 days))?( or overdue)?\b/);
    if (late) A.push({ k:'close', v:'late', neg:false });
    else if (cl) A.push({ k:'close', v:/week|7 days/.test(cl[0]) ? 'week' : /quarter/.test(cl[0]) ? 'quarter' : 'month', neg:false });
    if (take(/\b(no|without|missing|lacking|lack|nothing)( a| an| any)? (next )?(steps?|meetings?|booked)\b|\bnothing (is )?booked\b|\bno follow.?up booked\b/)) A.push({ k:'next', v:'none', neg:false });
    else if (take(/\b(overdue|late|missed) (next )?steps?\b|\bsteps? (is |are |was )?(overdue|late)\b/)) A.push({ k:'next', v:'late', neg:false });
    let quiet = false; while (take(/\b(quiet|silent|gone cold|cold|no (contact|touch|reply|replies)|not (been )?(touched|contacted)|haven'?t (talked|heard|spoken)( to| from)?|(for )?(2|two)\+? weeks)\b/)) quiet = true;
    if (quiet) A.push({ k:'last', v:14, neg:true });
    if (take(/\b(at risk|at-risk|unhealthy|low health|poor health|risky)\b/)) A.push({ k:'health', v:'bad', neg:false });
    else if (take(/\b(on watch|watch|fair health|fair)\b/)) A.push({ k:'health', v:'mid', neg:false });
    else if (take(/\b(healthy|good health)\b/)) A.push({ k:'health', v:'ok', neg:false });
    const o = OWN.find(x => take(new RegExp('\\b' + first(x).toLowerCase() + "('s)?\\b"))); if (o) A.push({ k:'owner', v:o, neg:false });
    const st = STAGES.find(x => !closed({ st:x.k }) && take(new RegExp('\\b' + x.t.toLowerCase() + '\\b'))); if (st) A.push({ k:'stage', v:st.k, neg:false });
    const rest = t.split(/[^a-z0-9$%+&'-]+/).filter(w => w && !FILLER.has(w));
    return { A, rest };
  }
  const READ = { close:{ week:'a deal closing this week', month:'a deal closing this month or overdue', quarter:'a deal closing this quarter', late:'a deal past its close date' }, next:{ none:'no next step', late:'an overdue next step', week:'a step in the next 7 days' }, last:{ 14:'no touch in 14+ days' }, health:{ bad:'health at risk', mid:'health on watch', ok:'healthy' } };
  const readOf = f => f.k === 'owner' ? 'owned by ' + P[f.v][0] : f.k === 'stage' ? 'in ' + ST[f.v].t : f.k === 'value' ? `pipeline ${f.neg ? 'of ' + kmoney(f.v) + ' or less' : 'over ' + kmoney(f.v)}` : READ[f.k][f.v];
  function said(t){ const was = ans.hidden; F.said = t; ans.hidden = !t; if (t) $('.t', ans).textContent = t; if (t && was) glide(ans, { transform:'translateY(-4px)' }, 220); }
  function runAsk(){
    const t = ask.value.trim(); if (!t) return;
    const { A, rest } = parse(t), skipped = rest.length ? ` Ignored “${rest.join(' ')}”: no filter reads it.` : '';
    if (!A.length){ F.q = t; renderTable(); said(asked(t) ? `No filter matched “${t}”, so this searches names. Try “quiet accounts”, “closing this month”, “no next step” or “over 100k”.` : ''); return; }
    F.A = A; F.q = ''; ask.value = ''; askx.hidden = true; renderTable();
    const parts = A.map(readOf), list = parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0];
    const views = Object.keys(SAVED).filter(k => SAVED[k][1].every(x => A.some(a => a.k === x.k && a.v === x.v && a.neg === x.neg))).map(k => SAVED[k][0]);
    say(`${rows.length} accounts`); const rb = rows.length ? null : relaxed()[0];
    said(`${plural(rows.length, 'account')} with ${list}${rows.length && rows.length <= 3 ? `: ${rows.map(c => c.n).join(', ')}` : ''}. ${views.length ? `Applied ${views.length > 1 ? 'the saved views' : 'the saved view'} ${views.join(' and ')}${A.length > views.length ? ' and ' + plural(A.length - views.length, 'more filter') : ''}.` : 'Applied ' + plural(A.length, 'filter') + '.'}${rb ? ` Drop “${readOf(rb.f)}” and ${plural(rb.n, 'account')} ${rb.n === 1 ? 'matches' : 'match'}.` : ''}${skipped}`);
  }
  ask.addEventListener('input', () => { const t = ask.value.trim(); askx.hidden = !ask.value;
    // a question waits for Enter; a name filters as you type
    if (asked(t)){ if (F.q){ F.q = ''; renderTable(); } said('Press Enter and the agent turns this into filters.'); }
    else { F.q = t; if (F.said) said(''); renderTable(); } });
  ask.addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); runAsk(); } else if (e.key === 'Escape' && ask.value){ e.preventDefault(); e.stopPropagation(); askx.click(); } });
  askx.onclick = () => { ask.value = ''; F.q = ''; askx.hidden = true; said(''); renderTable(); ask.focus(); };
  $('.crm-ansx', ans).onclick = () => clearFilters();

  // sorting from the column headers: a second press turns the order round
  $$('.crm-t .ttx-s', app).forEach(b => b.onclick = () => { const k = b.dataset.k; if (k === F.S[0].k) F.S[0].desc = !F.S[0].desc; else F.S = [{ k, desc:!ASC.includes(k) }, ...F.S.filter(r => r.k !== k)]; renderTable(); if (sortPop.classList.contains('open')) paintSort(); });
  allBox.onclick = () => { const on = allBox.getAttribute('aria-checked') !== 'true'; rows.forEach(c => on ? sel.add(c.id) : sel.delete(c.id)); syncSel(); };
  $('.ttx-clr', sb).onclick = () => { sel.clear(); syncSel(); };
  const toggleSel = id => { sel.has(id) ? sel.delete(id) : sel.add(id); syncSel(); };
  tbody.addEventListener('click', e => {
    if (e.target.closest('.crm-clr2')) return clearFilters();
    const rl = e.target.closest('[data-relax]'); if (rl){ F.A = F.A.filter(x => x.k !== rl.dataset.relax); said(''); renderTable(); $('.crm-ftr', app).focus({ preventScroll:true }); return; }
    const tr = e.target.closest('tr[data-id]'); if (!tr) return;
    focusRow(tr, false);
    const c = coOf(tr.dataset.id);
    if (e.target.closest('.ttx-cb')) return toggleSel(c.id);
    if (e.target.closest('.crm-rm')){ rowMenuFor = c.id; buildRowMenu(); return; }
    if (e.target.closest('.crm-ag')){ hideTip(); sugGo(c, e.target.closest('.crm-ag'), !e.detail); return; }
    openSheet(c.id);
  });
  function focusRow(tr, move = true){ $$('tr[data-id]', tbody).forEach(x => x.tabIndex = x === tr ? 0 : -1); focusId = tr.dataset.id; if (move) tr.focus(); }
  tbody.addEventListener('keydown', e => {
    const tr = e.target.closest('tr[data-id]'); if (!tr || e.target !== tr) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); const n = e.key === 'ArrowDown' ? tr.nextElementSibling : tr.previousElementSibling; if (n && n.dataset.id) focusRow(n); }
    else if (e.key === 'Enter'){ e.preventDefault(); openSheet(tr.dataset.id, true); }
    else if (e.key === ' '){ e.preventDefault(); toggleSel(tr.dataset.id); }
    else if (e.key === 'a' || e.key === 'A'){ const c = coOf(tr.dataset.id); if (c.sug && CONFIRM.has(c.sug.k)){ e.preventDefault(); $('.crm-ag', tr).click(); setTimeout(() => $('[data-cf="go"]', cfm)?.focus({ preventScroll:true }), 40); return; } if (c.sug){ e.preventDefault(); accept(c, c.sug); const t = $(`tr[data-id="${c.id}"]`, tbody); if (t) focusRow(t); } }
  });

  // a chip on its way out fades where it stands, out of the row's flow, so the chips that stay or arrive take their places at once
  function chipLeave(ch){
    if (REDUCE) return ch.remove();
    const box = ch.parentElement, b = box.getBoundingClientRect(), r = ch.getBoundingClientRect();
    if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
    Object.assign(ch.style, { position:'absolute', left:(r.left - b.left + box.scrollLeft) + 'px', top:(r.top - b.top) + 'px', margin:0, pointerEvents:'none' });
    ch.classList.add('gone'); setTimeout(() => ch.remove(), 300);
  }
  /* ---------- menus: built as they open, updated in place while they are open ---------- */
  const ck = `<span class="ck">${I('check', 'xs')}</span>`;
  const onOpen = (s, fn) => $$(s, app).forEach(b => b.addEventListener('click', fn));
  const mi = (attrs, body, role = 'menuitemradio', checked = false, close = true) => `<button class="mi" role="${role}" aria-checked="${checked}" tabindex="-1"${close ? ' data-close' : ''} ${attrs}>${body}${role !== 'menuitem' ? ck : ''}</button>`;
  const pop = id => $('#' + id, app);
  // Sort: the rules in the order they apply, then the fields that can be added after them
  const sortPop = pop('crm-p-sort');
  // repainted a tick later, so the click that asked for it still lands inside the popover and doesn't close it
  const paintSoon = focus => setTimeout(() => paintSort(focus));
  function paintSort(focus){
    const rest = Object.keys(SORTS).filter(k => !F.S.some(r => r.k === k)), one = F.S.length === 1, dflt = one && F.S[0].k === 'value' && F.S[0].desc;
    sortPop.innerHTML = `<div class="ph" role="none">Sort by</div><div class="crm-srl" role="list">` + F.S.map((r, i) => { const S = SORTS[r.k];
      return `<div class="crm-srw" role="listitem" data-i="${i}">`
        + `<button class="crm-srg" data-a="grip" aria-label="Move ${S[0]}${one ? '' : ', Alt and an arrow key'}" tabindex="${one ? -1 : 0}"${one ? ' disabled' : ''}>${I('grip', 'xs')}</button>`
        + `<span class="crm-srf">${I(S[2], 'xs')}<span>${i ? 'then ' : ''}${S[0]}</span></span>`
        + `<button class="crm-srd" data-a="dir" aria-label="${S[0]}: ${r.desc ? S[4] : S[3]}. Switch the order">${I(r.desc ? 'down' : 'up', 'xs')}<span>${r.desc ? S[4] : S[3]}</span></button>`
        + (dflt ? '' : `<button class="crm-srx" data-a="rm" aria-label="${one ? `Stop sorting by ${S[0]}, back to the default order` : `Stop sorting by ${S[0]}`}" data-tip="${one ? 'Back to the default order' : 'Remove'}">${I('x', 'xs')}</button>`) + `</div>`; }).join('') + `</div>`
      + (rest.length ? `<div class="sep" role="separator"></div><div class="ph" role="none">Then by</div>` + rest.map(k => `<button class="mi" data-add="${k}">${I(SORTS[k][2])}<span>${SORTS[k][0]}</span>${I('plus', 'xs')}</button>`).join('') : '');
    if (focus) { const m = $(focus, sortPop); if (m) m.focus({ preventScroll:true }); }
  }
  const moveRule = (i, j) => { if (j < 0 || j >= F.S.length || i === j) return; const [r] = F.S.splice(i, 1); F.S.splice(j, 0, r); };
  onOpen('.crm-sort', () => paintSort());
  sortPop.addEventListener('click', e => {
    const add = e.target.closest('[data-add]'), b = e.target.closest('[data-a]');
    if (add){ const k = add.dataset.add; F.S.push({ k, desc:!ASC.includes(k) }); renderTable(); paintSoon(`.crm-srw[data-i="${F.S.length - 1}"] .crm-srd`); return; }
    if (!b || b.disabled) return; const i = +b.closest('.crm-srw').dataset.i;
    if (b.dataset.a === 'dir'){ F.S[i].desc = !F.S[i].desc; renderTable(); paintSoon(`.crm-srw[data-i="${i}"] .crm-srd`); }
    else if (b.dataset.a === 'rm'){ F.S.splice(i, 1); if (!F.S.length) F.S = [{ k:'value', desc:true }]; hideTip(); renderTable(); paintSoon(`.crm-srw[data-i="${Math.min(i, F.S.length - 1)}"] .crm-srd`); }
  });
  sortPop.addEventListener('keydown', e => { const g = e.target.closest('.crm-srg'); if (!g || !e.altKey || !/^Arrow(Up|Down)$/.test(e.key)) return;
    e.preventDefault(); e.stopPropagation(); const i = +g.closest('.crm-srw').dataset.i, j = i + (e.key === 'ArrowUp' ? -1 : 1); if (j < 0 || j >= F.S.length) return;
    moveRule(i, j); renderTable(); paintSoon(`.crm-srw[data-i="${j}"] .crm-srg`); });
  // drag a rule by its grip: the rows close up around it as it moves, and the table follows when it is let go
  sortPop.addEventListener('pointerdown', e => { const g = e.target.closest('.crm-srg'); if (!g || g.disabled || e.button) return;
    e.preventDefault(); const row = g.closest('.crm-srw'), list = row.parentElement, rows = $$('.crm-srw', list), from = +row.dataset.i, y0 = e.clientY, H = row.offsetHeight;
    let to = from; row.classList.add('drag'); g.setPointerCapture(e.pointerId);
    const mv = ev => { const dy = ev.clientY - y0; row.style.transform = `translateY(${dy}px)`;
      to = clamp(from + Math.round(dy / H), 0, rows.length - 1);
      rows.forEach((r, k) => { if (r === row) return; r.style.transform = k > from && k <= to ? `translateY(${-H}px)` : k < from && k >= to ? `translateY(${H}px)` : ''; }); };
    const up = () => { g.removeEventListener('pointermove', mv); g.removeEventListener('pointerup', up); g.removeEventListener('pointercancel', up);
      moveRule(from, to); renderTable(); paintSoon(`.crm-srw[data-i="${to}"] .crm-srg`); };
    g.addEventListener('pointermove', mv); g.addEventListener('pointerup', up); g.addEventListener('pointercancel', up);
  });
  // a row's own menu
  function buildRowMenu(){
    const c = coOf(rowMenuFor), p = pop('crm-p-row'); if (!c) return;
    p.innerHTML = `<div class="ph" role="none">${esc(c.n)}</div>` + mi('data-a="open"', `${I('panel', 's')}<span>Open details</span>`, 'menuitem')
      + (c.sug ? mi('data-a="sug"', `${I('spark', 's')}<span>${c.sug.label}</span>`, 'menuitem') : '')
      + mi('data-a="call"', `${I('comment', 's')}<span>Log a call</span>`, 'menuitem')
      + mi('data-a="select"', `${I('check', 's')}<span>${sel.has(c.id) ? 'Deselect' : 'Select'}</span>`, 'menuitem')
      + `<div class="sep" role="separator"></div>` + `<button class="mi bad" role="menuitem" tabindex="-1" data-close data-a="del">${I('trash', 's')}<span>Delete account</span></button>`;
    $$('.mi', p).forEach(m => m.addEventListener('click', () => {
      const a = m.dataset.a;
      if (a === 'open') setTimeout(() => openSheet(c.id, true), 130);
      if (a === 'sug' && c.sug) setTimeout(() => { const ch = $(`tr[data-id="${c.id}"] .crm-ag`, tbody); if (ch && CONFIRM.has(c.sug.k)){ ch.click(); setTimeout(() => $('[data-cf="go"]', cfm)?.focus({ preventScroll:true }), 40); } else accept(c, c.sug); }, 140);
      if (a === 'call') logActivity(c, 'Call');
      if (a === 'select') toggleSel(c.id);
      if (a === 'del') setTimeout(() => askDelete([c.id]), 130);
    }));
  }

  /* ---------- bulk actions on the picked rows ---------- */
  onOpen('[data-pop="#crm-p-assign"]', () => {
    const p = pop('crm-p-assign');
    p.innerHTML = `<div class="ph" role="none">Assign ${sel.size} to</div>` + OWN.map(o => mi(`data-o="${o}"`, `${av(o)}<span>${P[o][0]}</span>`, 'menuitem')).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => {
      const ids = [...sel], o = m.dataset.o, before = ids.map(id => [id, coOf(id).own]), mts = MT.filter(x => ids.includes(x.co) && x.st === 'plan').map(x => [x, x.own]);
      ids.forEach(id => { coOf(id).own = o; DE.filter(d => d.co === id && !closed(d)).forEach(d => d.own = o); }); mts.forEach(([x]) => x.own = o);
      sel.clear(); refresh();
      toast('ok', `${plural(ids.length, 'account')} assigned to ${P[o][0]}`, 'Their open deals and booked meetings moved with them', { label:'Undo', run:() => { before.forEach(([id, w]) => { const c = coOf(id); if (c){ c.own = w; DE.filter(d => d.co === id && !closed(d)).forEach(d => d.own = w); } }); mts.forEach(([x, w]) => x.own = w); refresh(); } });
    }));
  });
  onOpen('[data-pop="#crm-p-move"]', () => {
    const p = pop('crm-p-move');
    p.innerHTML = `<div class="ph" role="none">Move each lead deal to</div>` + STAGES.map(s => mi(`data-s="${s.k}"`, pill(s.k), 'menuitem')).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => {
      const moves = [...sel].map(coOf).filter(c => c && c.lead).map(c => [c.lead, c.lead.st]);
      moves.forEach(([d]) => setStage(d, m.dataset.s)); sel.clear(); refresh();
      toast('ok', `Moved ${plural(moves.length, 'deal')} to ${ST[m.dataset.s].t}`, 'The lead deal of each account you picked', { label:'Undo', run:() => { moves.forEach(([d, s]) => setStage(d, s)); refresh(); } });
    }));
  });
  $('[data-a="export"]', sb).onclick = () => exportCsv(CO.filter(c => sel.has(c.id)));
  $('[data-a="delete"]', sb).onclick = () => askDelete([...sel]);
  // deleting asks first: Decision prompt's question and summary rows, with Cancel and Delete; Escape or the shade cancels
  const dlw = $('.crm-delw', app), dlg = $('.crm-dlg', dlw); let dlBack = null, dlIds = null;
  function askDelete(ids){
    ids = ids.filter(id => coOf(id)); if (!ids.length) return;
    const cos = ids.map(coOf), ds = DE.filter(d => ids.includes(d.co)), op = ds.filter(d => !closed(d)), wn = ds.filter(d => d.st === 'won'), mt = MT.filter(m => ids.includes(m.co) && m.st === 'plan');
    dlIds = ids; dlBack = document.activeElement;
    dlg.innerHTML = `<div class="dpx-q" id="crm-dlq">Delete ${ids.length === 1 ? esc(cos[0].n) : plural(ids.length, 'account')}?</div>`
      + `<div class="dpx-sum" id="crm-dld">${ids.length > 1 ? `<div class="dpx-sr"><span>Accounts</span>${esc(cos.map(c => c.n).join(', '))}</div>` : ''}`
      + `<div class="dpx-sr"><span>Open deals</span>${plural(op.length, 'deal')}, ${money(sum(op, d => d.v))} of the open pipeline</div>`
      + `<div class="dpx-sr"><span>Closed deals</span>${wn.length ? `${plural(wn.length, 'won deal')}, ${money(sum(wn, d => d.v))} off this quarter's closed won` : 'None won'}${ds.length - op.length - wn.length ? `, ${ds.length - op.length - wn.length} lost` : ''}</div>`
      + `<div class="dpx-sr"><span>Meetings</span>${mt.length ? plural(mt.length, 'booked meeting') : 'None booked'}</div></div>`
      + `<div class="dpx-f"><span class="muted crm-dln">You can undo it right after.</span><button class="pill ghost sm" data-dl="no">Cancel</button><button class="pill sm crm-danger" data-dl="yes">${I('trash', 'xs')}Delete</button></div>`;
    unfade(dlw); dlw.hidden = false; setTimeout(() => $('[data-dl="no"]', dlg).focus(), 30);
  }
  const closeDel = () => { if (dlw.hidden || dlw._closing) return; fadeOut(dlw); if (dlBack && dlBack.isConnected) dlBack.focus({ preventScroll:true }); };
  dlw.addEventListener('click', e => { const b = e.target.closest('[data-dl]'); if (!b) return; const ids = dlIds; closeDel(); if (b.dataset.dl === 'yes') remove(ids); });
  dlw.addEventListener('pointerdown', e => { if (e.target === dlw) closeDel(); });
  // removed rows slide away, and Undo brings them back
  function remove(ids){
    const gone = ids.map(coOf).filter(Boolean), deals = DE.filter(d => ids.includes(d.co)), mts = MT.filter(m => ids.includes(m.co));
    const finish = () => { CO = CO.filter(c => !ids.includes(c.id)); DE = DE.filter(d => !ids.includes(d.co)); MT = MT.filter(m => !ids.includes(m.co)); ids.forEach(id => sel.delete(id)); if (ids.includes(sheetFor)) closeSheet(); refresh(); };
    const trs = ids.map(id => $(`tr[data-id="${id}"]`, tbody)).filter(Boolean);
    if (trs.length && !REDUCE){ trs.forEach(r => r.classList.add('ttx-out')); setTimeout(finish, 240); } else finish();
    toast('bad', gone.length === 1 ? `${gone[0].n} deleted` : `${gone.length} accounts deleted`, `${plural(deals.length, 'deal')} and ${plural(mts.length, 'meeting')} went with ${gone.length === 1 ? 'it' : 'them'}`, { label:'Undo', run:() => { CO.push(...gone.filter(c => !coOf(c.id))); DE.push(...deals.filter(d => !dealOf(d.id))); MT.push(...mts.filter(m => !MT.includes(m))); refresh(); } });
  }

  /* ---------- Export: the rows as a CSV file ---------- */
  function exportCsv(list){
    const out = [['Account', 'Segment', 'Tags', 'Stage', 'Owner', 'Region', 'Open deals', 'Pipeline value', 'Health', 'Next step', 'Next step date', 'Last touch'],
      ...list.map(c => [c.n, c.seg, c.tags.join('; '), ST[c.st].t, P[c.own][0], REG[c.reg].t, c.deals, c.value, c.health, c.next ? c.next.kind : '', c.next ? dateOf(c.next.day).toISOString().slice(0, 10) : '', dateOf(-c.last).toISOString().slice(0, 10)])];
    const csv = out.map(r => r.map(v => /[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : v).join(',')).join('\n');
    try {
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' })); a.download = 'larkfield-accounts.csv';
      app.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } catch(e){}
    toast('ok', `Exported ${plural(list.length, 'account')}`, 'larkfield-accounts.csv, ' + money(sum(list, c => c.value)) + ' in pipeline');
  }
  $('.crm-export', app).onclick = () => exportCsv(rows);

  /* ---------- the details sheet: Details panel, with Health score's gauge and checks ---------- */
  const sheet = $('.crm-sheet', app), dtp = $('.crm-dtp', app);
  const shut = new Set();
  // health starts folded to its one summary row; the rest start open
  shut.add('health');
  const section = (k, t, body, o = {}) => `<div class="dtp-sec crm-sec" data-k="${k}"><div class="crm-shr"><button class="dtp-sh" aria-expanded="${!shut.has(k)}" data-sec="${k}"${o.label ? ` aria-label="${o.label}"` : ''}>${I('chev-r', 'xs')}<span>${t}</span>${o.n != null ? `<span class="crm-sn num">${o.n}</span>` : ''}${o.aside || ''}</button>${o.act || ''}</div><div class="fold${shut.has(k) ? ' shut' : ''}"><div>${body}</div></div></div>`;
  const tlOf = c => [...c.log, ...c.base];
  const andList = a => a.length > 1 ? a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1] : a[0] || '';
  const HK = ['contact', 'late', 'win', 'next'], HL = { contact:'Contact', late:'On time', win:'Win chance', next:'Next step' }, HMAX = [35, 25, 25, 15];
  const HSW = { ok:'On track', warn:'Watch', bad:'At risk' }, HV = { ok:'ok', mid:'warn', bad:'bad' };
  let hscOpen = null, hscFor = null;
  // each factor: its status, the figure on its tile, and the lines its detail shows
  const factors = c => { const m = c.next;
    return {
      contact:{ s:c.last <= 7 ? 'ok' : c.last <= 14 ? 'warn' : 'bad', fig:c.last === 0 ? 'Today' : String(c.last), unit:c.last === 0 ? 'last touch' : plural(c.last, 'day').replace(/^\d+ /, '') + ' quiet',
        lines:[c.last === 0 ? `Touched today, ${esc(ltName(c))}` : `Last touch ${plural(c.last, 'day')} ago, ${esc(ltName(c))}`, 'Full points within three days of a touch, none after a month of quiet'] },
      late:{ s:c.slip ? 'bad' : 'ok', fig:c.slip ? String(c.slip) : 'All', unit:c.slip ? 'past close' : 'on time',
        lines:[c.slip ? `${plural(c.slip, 'deal')} past ${c.slip === 1 ? 'its' : 'their'} close date` : 'No deal past its close date', c.slip ? 'Move the close date or log what is holding it up' : 'Stays full while every open deal is inside its date'] },
      win:{ s:!c.lead ? 'warn' : c.win >= 50 ? 'ok' : c.win >= 35 ? 'warn' : 'bad', fig:c.lead ? c.win + '%' : 'None', unit:c.lead ? 'to win' : 'open',
        lines:[c.lead ? `${c.win}% across the open deals, weighted by value` : 'No open deal to weigh', c.lead ? `Lead deal: ${esc(c.lead.n)}, ${ST[c.lead.st].t}` : 'A new deal brings these points back'] },
      next:{ s:!m ? 'bad' : m.day < 0 ? 'warn' : 'ok', fig:!m ? 'None' : m.day < 0 ? 'Late' : fmtDW(m.day).split(' ')[0], unit:!m ? 'booked' : m.day < 0 ? 'since ' + fmtD(m.day) : low(m.kind),
        lines:[!m ? 'Nothing booked with this account' : m.day < 0 ? `${esc(m.kind)}, due ${fmtD(m.day)}, never logged` : `${esc(m.kind)}, ${fmtDW(m.day)}, ${tmA(m.h)}`, !m ? 'A booked step gives the full 15 points' : m.day < 0 ? 'A late step counts for a third' : 'Booked and on time'] }
    }; };
  const healthBlock = c => {
    const F = factors(c), v = c.health, b = HV[c.hb], C = 2 * Math.PI * 18, ok = HK.filter(k => F[k].s === 'ok').length;
    const w = HK.filter(k => F[k].s !== 'ok').sort((a, z) => c.hp[HK.indexOf(a)] / HMAX[HK.indexOf(a)] - c.hp[HK.indexOf(z)] / HMAX[HK.indexOf(z)] || HK.indexOf(a) - HK.indexOf(z))[0];
    const tile = (k, i) => `<button type="button" class="hsc-t" data-hk="${k}" data-s="${F[k].s}"${k === w ? ' data-weak' : ''} aria-expanded="${hscOpen === k}" aria-controls="crm-hd${i}" aria-label="${HL[k]}: ${F[k].fig} ${F[k].unit}. ${HSW[F[k].s]}${k === w ? ', the weakest factor' : ''}">`
      + `<span class="hsc-k"><i class="hsc-dot"></i><span class="hsc-n">${HL[k]}</span><span class="hsc-wk" aria-hidden="true">Weakest</span></span>`
      + `<span class="hsc-v"><b class="num">${F[k].fig}</b><span>${esc(F[k].unit)}</span></span>${I('chev-d', 'xs hsc-cv')}</button>`;
    // a row's details unfold right under it
    const region = j => { const k = hscOpen === HK[j] ? hscOpen : null, i = j;
      return `<div class="fold${k ? '' : ' shut'} hsc-d" id="crm-hd${j}" role="region" aria-label="${k ? HL[k] + ' details' : 'Details'}"><div><div class="hsc-dc">${k ? F[k].lines.map(l => `<p class="hsc-dp">${l}</p>`).join('') + `<p class="hsc-pt num"><span>${c.hp[i]} of ${HMAX[i]} points</span><i></i><span>${HSW[F[k].s]}</span></p>` : ''}</div></div></div>`; };
    return `<div class="hsc crm-shs" data-v="${b}" role="group" aria-label="Account health">`
      + `<div class="hsc-l crm-hrows">${HK.map((k, i) => k === 'next' ? '' : tile(k, i) + region(i)).join('')}</div></div>`;
  };
  function renderSheet(){
    const c = coOf(sheetFor); if (!c) return closeSheet();
    const mine = DE.filter(d => d.co === c.id).sort((a, b) => ST[b.st].i - ST[a.st].i || b.v - a.v), m = c.next;
    if (hscFor !== c.id){ hscFor = c.id; hscOpen = null; }
    const FX = factors(c), okN = HK.filter(k => FX[k].s === 'ok').length, RC = 2 * Math.PI * 7;
    const weak = HK.filter(k => k !== 'next' && FX[k].s !== 'ok').sort((a, z) => c.hp[HK.indexOf(a)] / HMAX[HK.indexOf(a)] - c.hp[HK.indexOf(z)] / HMAX[HK.indexOf(z)])[0];
    // the header: who it is, then the things you do most with an account, as secondary buttons (the agent's suggestion
    // below carries the one accent button)
    dtp.innerHTML = `<div class="dtp-h"><span class="pfm-lg" aria-hidden="true">${esc(c.n[0])}</span><span class="tx"><b id="crm-sh-t">${esc(c.n)}</b><span>${esc(c.seg)}, ${REG[c.reg].t}</span></span><button class="ib" data-a="link" aria-label="Copy a link to ${esc(c.n)}" data-tip="Copy link">${I('link', 's')}</button><button class="ib" data-a="close" aria-label="Close details" data-tip="Close" data-tip-k="Esc">${I('x', 's')}</button></div>`
      + `<div class="crm-sact"><button class="pill line sm" data-a="call">${I('comment', 'xs')}Log a call</button><button class="pill line sm" data-a="email">${I('mail', 'xs')}Log an email</button><button class="pill line sm" data-a="deal">${I('plus', 'xs')}Add deal</button></div>`
      + (c.sug ? `<div class="six-ans crm-sag">${I('spark', 'xs')}<span>${esc(c.sug.why)}</span><button class="pill primary sm" data-a="sug"${CONFIRM.has(c.sug.k) ? ' data-pop="#crm-p-cfm" data-pop-align="end" aria-haspopup="dialog"' : ''}>${c.sug.label}</button></div>` : '')
      + section('props', 'Properties', `<div class="dtp-rows">`
        + `<div class="dtp-r"><span class="k">Owner</span><button class="dtp-v" data-pop="#crm-p-sown" aria-haspopup="menu">${av(c.own)}<span>${esc(P[c.own][0])}</span>${I('chev-d', 'xs')}</button></div>`
        + `<div class="dtp-r"><span class="k">Stage</span><span class="dtp-v static">${pill(c.st)}</span></div>`
        + `<div class="dtp-r"><span class="k">Next step</span>${m ? `<button class="dtp-v crm-snx${m.day < 0 ? ' late' : ''}" data-a="cal" aria-label="${esc(m.kind)}, ${m.day < 0 ? 'overdue, ' : ''}${fmtDW(m.day)} ${tmA(m.h)}. Open in the calendar">${I('cal', 'xs')}<span>${esc(m.kind)}, ${m.day < 0 ? 'overdue since ' + fmtD(m.day) : fmtDW(m.day) + ', ' + tmA(m.h)}</span></button>` : `<span class="dtp-v static crm-snx none">No next step</span>`}</div>`
        + `<div class="dtp-r"><span class="k">Last touch</span><span class="dtp-v static">${c.last === 0 ? 'Today' : fmtD(-c.last)}, ${esc(ltName(c))}</span></div>`
        + `<div class="dtp-r"><span class="k">Region</span><span class="dtp-v static"><span class="dot" style="color:${REG[c.reg].c}"></span>${REG[c.reg].t}</span></div>`
        + `</div><div class="crm-tg"><span class="crm-tgk">Tags</span><span class="dtp-tags">${[c.seg, ...c.tags].map(chip).join('')}<button class="dtp-add" data-a="tag" aria-label="Add a tag" data-tip="Add tag">${I('plus', 'xs')}</button></span></div>`)
      // health folds to one row: the ring, the verdict and how many checks are on track; it opens to the checks
      + section('health', 'Health', healthBlock(c), { label:`Health ${c.health} of 100, ${HB[c.hb].toLowerCase()}, ${okN === 4 ? 'all 4 on track' : okN + ' of 4 on track'}${weak ? ', weakest ' + HL[weak].toLowerCase() : ''}`,
        aside:`<span class="crm-hsum"><span class="crm-hs" data-h="${c.hb}"><svg viewBox="0 0 22 22" aria-hidden="true"><circle class="tr" cx="11" cy="11" r="7"/><circle class="fl" cx="11" cy="11" r="7" stroke-dasharray="${RC.toFixed(1)}" stroke-dashoffset="${(RC * (1 - c.health / 100)).toFixed(1)}"/></svg><b class="num">${c.health}</b><span class="l">${HB[c.hb]}</span></span><span class="muted">${okN === 4 ? 'all 4 on track' : okN + ' of 4 on track'}</span></span>` })
      + section('deals', 'Deals', `<div class="crm-sum3"><span><b class="num">${kmoney(c.value)}</b> pipeline</span><span><b class="num">${kmoney(c.weighted)}</b> weighted</span><span><b class="num">${kmoney(c.won)}</b> won</span></div>`
        + (mine.length ? `<div class="crm-dl">${mine.map(d => `<button data-deal="${d.id}" data-pop="#crm-p-sstage" aria-haspopup="menu" aria-label="${esc(d.n)}, ${ST[d.st].t}, ${money(d.v)}${slipping(d) ? ', past its close date' : ''}. Change its stage"><span class="t">${esc(d.n)}<span class="w num${slipping(d) ? ' late' : ''}">${d.st === 'won' ? 'Won ' + fmtD(d.close) : (slipping(d) ? 'Was due ' : 'Closes ') + fmtD(d.close) + ', ' + d.p + '%'}</span></span>${pill(d.st)}<span class="num">${kmoney(d.v)}</span></button>`).join('')}</div>` : '<p class="muted">No deals yet.</p>'),
        { n:mine.length, act:`<button class="ib crm-sadd" data-a="deal" aria-label="Add a deal to ${esc(c.n)}" data-tip="Add deal">${I('plus', 'xs')}</button>` })
      + section('ppl', 'People', `<ul class="crm-ppl">${c.ppl.map((p, i) => `<li>${avn(p.n)}<span><b>${esc(p.n)}</b><span class="muted">${esc(p.r)}${i ? '' : ', champion'}${m && whoOf(m).includes(pkey(c.id, i)) ? `. In the ${esc(low(m.kind))}, ${fmtDW(m.day)}` : ''}</span></span></li>`).join('')}</ul>`
        + (m ? (t => t.length ? `<p class="crm-pj muted">Also in the ${esc(low(m.kind))}: ${esc(andList(t))}</p>` : '')(whoOf(m).filter(k => k.startsWith('o:') && k !== 'o:' + m.own).map(k => personOf(k).n)) : ''), { n:c.ppl.length })
      + section('act', 'Activity', `<ul class="crm-tl">${tlOf(c).slice(0, 5).map(([k, d, t, w], i) => `<li${i === 0 && c._fresh ? ' class="new"' : ''}><span class="ic">${I(ACT[k] || 'comment', 'xs')}</span><span>${esc(t)}<span class="w num">${d === 0 ? 'Today' : fmtD(-d)}, ${esc(w)}</span></span></li>`).join('')}</ul>`,
        { act:`<button class="ib crm-sadd" data-a="call" aria-label="Log a call with ${esc(c.n)}" data-tip="Log a call">${I('plus', 'xs')}</button>` });
    c._fresh = false;
    sheet.setAttribute('aria-labelledby', 'crm-sh-t');
  }
  function openSheet(id, focus = false){
    const was = sheetFor; sheetFor = id; shTouched = true; closeCalPop(); renderSheet();
    sheet.inert = false; sheet.classList.add('on'); app.classList.add('sh');
    $$('tr[data-id]', tbody).forEach(tr => tr.classList.toggle('open', tr.dataset.id === id));
    if (focus || (document.activeElement && document.activeElement.closest('tr[data-id],.kbx-k,.cpl,.ntx,.aib,.ecx'))) setTimeout(() => $('[data-a="close"]', dtp).focus({ preventScroll:true }), 60);
    if (was !== id && !REDUCE) dtp.animate([{ opacity:0, transform:'translateY(4px)' }, { opacity:1, transform:'none' }], { duration:240, easing:'ease-out' });
  }
  let sheetBack = null;
  function closeSheet(){
    if (!sheetFor) return;
    const id = sheetFor, inside = sheet.contains(document.activeElement); sheetFor = null; sheet.classList.remove('on'); sheet.inert = true; app.classList.remove('sh');
    $$('tr.open', tbody).forEach(tr => tr.classList.remove('open'));
    if (!inside) return;
    const tr = view === 'accounts' && $(`tr[data-id="${id}"]`, tbody); if (tr) return focusRow(tr);
    if (sheetBack && sheetBack.isConnected) sheetBack.focus({ preventScroll:true }); else $('#content', app).focus({ preventScroll:true });
  }
  // a click outside the sheet closes it (owner, 10 Nov), unless that click opened a record itself (another row, card or event
  // swaps what the sheet shows) or landed in a menu, popover, dialog or toast the sheet's own buttons opened
  let shBefore = null, shTouched = false;
  document.addEventListener('pointerdown', () => { shBefore = sheetFor; shTouched = false; }, true);
  document.addEventListener('click', e => {
    if (!sheetFor || sheetFor !== shBefore || shTouched || !e.isTrusted) return;
    const t = e.target; if (!t.isConnected || sheet.contains(t) || t.closest('.pop,[role="dialog"],[role="menu"],[role="listbox"],.tst,.crm-rtb,.pg-top,.cpl')) return;
    closeSheet();
  });
  // what had the focus before the sheet took it, to give it back on close
  app.addEventListener('focusin', e => { if (!sheet.contains(e.target)) sheetBack = e.target; });
  dtp.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const c = coOf(sheetFor);
    if (b.dataset.sec){ const f = b.closest('.dtp-sec').lastElementChild, open = f.classList.toggle('shut') === false; b.setAttribute('aria-expanded', open); open ? shut.delete(b.dataset.sec) : shut.add(b.dataset.sec); return; }
    if (b.dataset.deal){ stageFor = b.dataset.deal; buildStageMenu(); return; }
    if (b.dataset.hk){ const k = b.dataset.hk, was = hscOpen, row = x => x ? HK.indexOf(x) : -1; hscOpen = was === k ? null : k;
      const blk = $('.crm-shs', dtp), tmp = document.createElement('div'); tmp.innerHTML = healthBlock(c); const nb = tmp.firstElementChild;
      $$('.hsc-t', blk).forEach(t => t.setAttribute('aria-expanded', String(t.dataset.hk === hscOpen)));
      $$('.hsc-d', blk).forEach((reg, j) => { const fresh = $$('.hsc-d', nb)[j]; if (hscOpen && row(hscOpen) === j){ $('.hsc-dc', reg).innerHTML = $('.hsc-dc', fresh).innerHTML; reg.setAttribute('aria-label', fresh.getAttribute('aria-label')); if (row(was) === j && was) enter($('.hsc-dc', reg)); } reg.classList.toggle('shut', !(hscOpen && row(hscOpen) === j)); });
      return; }
    const a = b.dataset.a;
    if (a === 'close') closeSheet();
    if (a === 'link'){ const url = location.origin + location.pathname + '#' + c.id; (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).catch(() => {}); toast('ok', 'Link copied', c.n + ' opens with its details'); }
    if (a === 'tag'){ const next = ['Champion', 'Budget set', 'Security review', 'Multi-year'].find(t => !c.tags.includes(t)); if (next){ c.tags.push(next); renderSheet(); const t = $$('.dtp-tags .tag', dtp).pop(); enter(t); } }
    if (a === 'deal'){ setView('pipeline'); if (K.shut.has('disc')){ K.shut.delete('disc'); renderBoard(); } startDraft('disc'); return; }
    if (a === 'call') logActivity(c, 'Call');
    if (a === 'email') logActivity(c, 'Email', `Email to ${c.ppl[0].n}`);
    if (a === 'sug' && c.sug) sugGo(c, b, !e.detail);
    if (a === 'cal' && c.next){ const m = c.next; closeSheet(); showMeeting(m); }
  });
  function logActivity(c, kind, text){
    const prev = [c.last, c.lt];
    c.log.unshift([kind, 0, text || (kind === 'Call' ? `Call with ${c.ppl[0].n}` : 'Email sent'), 'Noah Cole']); c.last = 0; c.lt = kind; c.trend[11]++; c._fresh = true;
    refresh();
    toast('ok', kind === 'Call' ? 'Call logged' : 'Email logged', `${c.n}, last touch is now today`, { label:'Undo', run:() => { c.log.shift(); [c.last, c.lt] = prev; c.trend[11]--; refresh(); } });
  }
  // the owner menu is built as it opens; the sheet's button is drawn again each time, so this listens on the sheet
  dtp.addEventListener('click', e => {
    if (!e.target.closest('[data-pop="#crm-p-sown"]')) return;
    const c = coOf(sheetFor), p = pop('crm-p-sown');
    p.innerHTML = `<div class="ph" role="none">Owner</div>` + OWN.map(o => mi(`data-o="${o}"`, `${av(o)}<span>${P[o][0]}</span>`, 'menuitemradio', c.own === o)).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { const was = c.own; if (was === m.dataset.o) return; const mts = MT.filter(x => x.co === c.id && x.st === 'plan');
      c.own = m.dataset.o; DE.filter(d => d.co === c.id && !closed(d)).forEach(d => d.own = c.own); mts.forEach(x => x.own = c.own); refresh();
      toast('ok', `${c.n} is now ${first(c.own)}'s`, 'Its open deals and booked meetings moved too', { label:'Undo', run:() => { DE.filter(d => d.co === c.id && !closed(d)).forEach(d => d.own = was); mts.forEach(x => x.own = was); c.own = was; refresh(); } }); }));
  }, true);
  function buildStageMenu(){
    const d = dealOf(stageFor), p = pop('crm-p-sstage'); if (!d) return;
    p.innerHTML = `<div class="ph" role="none">Move ${esc(d.n)} to</div>` + STAGES.map(s => mi(`data-s="${s.k}"`, pill(s.k), 'menuitemradio', d.st === s.k)).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => moveDeal(d, m.dataset.s)));
  }

  /* ---------- moving a deal: the board, the sheet and the menus all come here ---------- */
  // a deal that is won closes today; moved back out, it gets its expected close date again
  function setStage(d, st){
    const to = closed({ st }), from = closed(d);
    if (to && !from){ d.was = d.close; d.close = 0; if (st === 'lost'){ d.at = d.st; d.why = d.why || 'Marked lost by Noah Cole'; } }
    if (!to && from && d.was != null){ d.close = d.was; d.was = null; }
    d.st = st; d.p = probOf(d);
  }
  function moveDeal(d, st){
    const was = d.st; if (was === st) return;
    setStage(d, st); refresh();
    const c = coOf(d.co);
    say(`${d.n} moved to ${ST[st].t}`);
    toast(st === 'won' ? 'ok' : 'info', st === 'won' ? `Won: ${c.n}, ${money(d.v)}` : st === 'lost' ? `Lost: ${c.n}, ${money(d.v)}` : `${d.n} moved to ${ST[st].t}`, st === 'won' ? `${d.n}. Added to this quarter's closed won` : st === 'lost' ? `${d.n}. Out of the open pipeline` : `${c.n}, win probability now ${d.p}%`, { label:'Undo', run:() => { setStage(d, was); refresh(); } });
  }

  /* ---------- Agent inbox: Agent inbox's grouped list on the left, the selected item's preview on the right ---------- */
  const ibv = $('.crm-ib', app), ibx = $('.crm-aib', app), igs = $('.aib-gs', ibx), ipv = $('.crm-ipv', app);
  const IBG = [['follow', 'Follow-ups drafted'], ['slip', 'Close dates passed'], ['fix', 'Data fixes'], ['done', 'Done']];
  const IBI = { follow:'mail', slip:'cal', fix:'wand' }, IBK = { follow:'Follow-up drafted', slip:'Close date passed', fix:'Data fix' };
  let ibSel = null, edFor = null, pvLast = null;
  const ibText = x => { if (x.state !== 'wait' && x.snap) return x.snap.t; const c = coOf(x.co), d = dealOf(x.deal);
    if (x.kind === 'follow') return [`Follow-up to ${x.to}, ${c.n}`, `Quiet for ${plural(x.days ?? c.last, 'day')}. “${x.subj}”`];
    if (x.kind === 'slip') return [`Move ${poss(c.n)} ${d.n.toLowerCase()} to ${fmtDW(x.to)}`, `It was due ${fmtD(x.was)} and is still in ${ST[d.st].t}, ${money(d.v)}`];
    return x.fix === 'stage' ? [`Move ${poss(c.n)} ${d.n.toLowerCase()} to ${ST[x.to].t}`, fixWhy(x)] : [`Lower ${poss(c.n)} ${d.n.toLowerCase()} from ${d.p}% to ${clamp(d.p + x.to, 5, 95)}%`, fixWhy(x)]; };
  // the list's order: what waits, group by group, then what is done
  const ibOrder = () => { const live = IB.filter(x => coOf(x.co) && dealOf(x.deal)), w = live.filter(x => x.state === 'wait');
    return [...['follow', 'slip', 'fix'].flatMap(k => w.filter(x => x.kind === k)), ...live.filter(x => x.state !== 'wait')]; };
  const ibOf = id => IB.find(x => x.id === id);
  const phone = () => matchMedia('(max-width:760px)').matches;
  function renderInbox(){
    const L = ibOrder(), w = L.filter(x => x.state === 'wait');
    if (!L.some(x => x.id === ibSel)) ibSel = (w[0] || L[0] || {}).id || null;
    igs.innerHTML = IBG.map(([k, n]) => { const G = L.filter(x => k === 'done' ? x.state !== 'wait' : x.state === 'wait' && x.kind === k); if (!G.length) return '';
      return `<section class="aib-g" data-g="${k}" aria-label="${n}"><div class="aib-gh"><span class="crm-gd" data-k="${k}" aria-hidden="true"></span><span>${n}</span><span class="n">${G.length}</span>${k !== 'done' && G.length > 1 ? `<button class="pill ghost sm crm-iall" data-ia="all" data-g="${k}" aria-label="Approve all ${G.length}: ${n.toLowerCase()}">Approve all</button>` : ''}</div><div class="aib-gl" role="list">${G.map(ibRow).join('')}</div></section>`; }).join('');
    swap($('.aib-st', ibx), w.length ? `${w.length} waiting for you` : 'All clear');
    if (!L.length) igs.innerHTML = `<div class="crm-ibe muted">Nothing waiting. The agent adds to this list as accounts go quiet or deals pass their close dates.</div>`;
    renderPreview();
  }
  // a row: its icon, what it is and why; the selected one is in the Tab order and the arrow keys move from it. The row's own
  // buttons are shortcuts for a mouse; the preview has the same actions, labelled, for the keyboard
  const ibRow = x => { const [b, s] = ibText(x), wait = x.state === 'wait', on = x.id === ibSel;
    return `<div class="aib-i crm-ii${wait ? '' : ' done'}${on ? ' on' : ''}" role="listitem" data-ib="${x.id}" data-k="${x.kind}"><span class="aib-av" data-k="${x.kind}" aria-hidden="true">${I(IBI[x.kind], 'xs')}</span><button class="aib-t crm-it" data-ia="sel" aria-current="${on}" tabindex="${on ? 0 : -1}"><b>${esc(b)}</b><span>${esc(s)}</span></button>`
      + `<span class="aib-r">${wait ? `<button class="ib" data-ia="dismiss" tabindex="-1" aria-label="Dismiss: ${esc(b)}" data-tip="Dismiss">${I('x', 'xs')}</button><button class="ib" data-ia="edit" tabindex="-1"${x.kind === 'follow' ? '' : ' data-pop="#crm-p-ied" data-pop-align="end" aria-haspopup="menu"'} aria-label="Edit: ${esc(b)}" data-tip="Edit">${I('edit', 'xs')}</button><button class="ib crm-iok" data-ia="ok" tabindex="-1" aria-label="Approve: ${esc(b)}" data-tip="Approve">${I('check', 'xs')}</button>`
        : `<span class="ok">${I(x.state === 'done' ? 'ok' : 'x', 'xs')}</span><span class="crm-ires">${esc(x.res)}</span>`}</span></div>`; };
  // the preview: the whole draft, or the deal and its dates, or the change and why, with the same actions
  const pvRow = (k, v) => `<div class="crm-pvr"><span class="k">${k}</span><span class="v">${v}</span></div>`;
  function renderPreview(){
    const x = ibOf(ibSel); ipv.dataset.ib = x ? x.id : '';
    if (!x){ ipv.innerHTML = `<div class="crm-pve muted">Nothing to preview.</div>`; return; }
    const c = coOf(x.co), d = dealOf(x.deal), wait = x.state === 'wait', [title] = ibText(x), ch = c.ppl.find(p => p.n === x.to) || c.ppl[0];
    const body = x.state !== 'wait' && x.snap ? x.snap.pv : pvBody(x);
    const acts = wait && x.kind === 'follow' ? `<div class="drf-f crm-drff"><button class="pill ghost sm" data-ia="dismiss">${I('trash', 'xs')}Discard</button><span class="sp"></span><span class="muted drf-when">Select text to rewrite it</span><button class="pill primary sm" data-ia="ok">${I('send', 'xs')}Send</button></div>`
      : wait ? `<button class="pill ghost" data-ia="dismiss">Dismiss</button><button class="pill soft" data-ia="edit"${x.kind === 'follow' ? '' : ' data-pop="#crm-p-ied" data-pop-align="end" aria-haspopup="menu"'}>${I('edit', 'xs')}Edit</button><button class="pill primary" data-ia="ok">${x.kind === 'follow' ? 'Approve and send' : 'Approve'}</button>`
      : `<span class="crm-pvres"><span class="ok">${I(x.state === 'done' ? 'ok' : 'x', 'xs')}</span>${esc(x.res)}</span>${x.undo ? `<button class="pill soft" data-ia="undo">${I('undo', 'xs')}Undo</button>` : ''}`;
    ipv.innerHTML = `<div class="crm-pvh"><span class="aib-av" data-k="${x.kind}" aria-hidden="true">${I(IBI[x.kind], 'xs')}</span><span class="crm-pvk" data-k="${x.kind}">${IBK[x.kind]}</span><span class="crm-sp"></span><button class="pill ghost sm" data-ia="open">${I('panel', 'xs')}Open account</button><button class="ib crm-pvx" data-ia="close" aria-label="Close the preview" data-tip="Close">${I('x', 's')}</button></div>`
      + `<h2 class="crm-pvt" id="crm-pvt" tabindex="-1">${esc(title)}</h2>${body}${wait && x.kind === 'follow' ? acts : `<div class="crm-pva">${acts}</div>`}`;
    ipv.setAttribute('aria-labelledby', 'crm-pvt');
    if (pvLast !== x.id + x.state){ if (pvLast) [...ipv.children].forEach((el, i) => glide(el, { transform:'translateY(4px)' }, T + i * 30)); pvLast = x.id + x.state; }
  }
  // the preview's body, from the live data while the item waits (frozen into its snapshot once it is decided)
  function pvBody(x, live = true){
    const c = coOf(x.co), d = dealOf(x.deal), ch = c.ppl.find(p => p.n === x.to) || c.ppl[0];
    let body = '';
    if (x.kind === 'follow'){
      const ed = live && x.state === 'wait';
      body = `<div class="drf crm-drf"><div class="drf-fs"><div class="drf-r"><span class="drf-l">To</span><span class="drf-p">${avn(ch.n)}${esc(ch.n)}</span><span class="muted crm-drr">${esc(ch.r)} at ${esc(c.n)}</span></div>`
        + `<div class="drf-r"><span class="drf-l">From</span><span class="drf-p">${av(c.own)}${esc(P[c.own][0])}</span></div>`
        + (ed ? `<label class="drf-r"><span class="drf-l">Subject</span><input class="drf-s crm-dsj" value="${esc(x.subj)}" aria-label="Subject" autocomplete="off"></label>` : `<div class="drf-r"><span class="drf-l">Subject</span><span>${esc(x.subj)}</span></div>`) + `</div>`
        + `<div class="drf-b crm-drb"${ed ? ' contenteditable="true" role="textbox" aria-multiline="true" aria-label="Message" spellcheck="false"' : ''}>${esc(x.body)}</div><div class="crm-sig">${esc(P[c.own][0])}</div></div>`
        + `<div class="crm-pvc muted">Quiet for ${plural(x.days ?? c.last, 'day')}. ${esc(d.n)}, ${ST[d.st].t}, ${money(d.v)}, closing ${fmtD(d.close)}.</div>`;
    } else if (x.kind === 'slip'){
      body = `<div class="crm-pvm">${pvRow('Account', `<span class="pfm-lg xs" aria-hidden="true">${esc(c.n[0])}</span><span>${esc(c.n)}</span>`)}${pvRow('Deal', `<span>${esc(d.n)}</span>${pill(d.st)}<span class="num">${money(d.v)}</span>`)}`
        + pvRow('Close date', `<span class="crm-was num">${fmtD(x.was)}</span>${I('right', 'xs')}<b class="num">${fmtDW(x.to)}</b>`) + pvRow('Win probability', `<span class="num">${d.p}%</span>`)
        + pvRow('Next step', c.next ? `<span${c.next.day < 0 ? ' class="crm-bad"' : ''}>${esc(c.next.kind)}, ${c.next.day < 0 ? 'overdue since ' + fmtD(c.next.day) : fmtDW(c.next.day)}</span>` : '<span class="crm-bad">None booked</span>')
        + pvRow('Owner', `${av(c.own)}<span>${esc(P[c.own][0])}</span>`) + `</div>`
        + `<div class="crm-pvc muted">${esc(d.n)} was due ${fmtD(x.was)} and is still in ${ST[d.st].t}. The last touch was ${c.last === 0 ? 'today' : plural(c.last, 'day') + ' ago'}, ${c.lt === 'Email' ? 'an email' : 'a ' + ltName(c)}. Approving moves the close date; the forecast and the board follow.</div>`;
    } else {
      const was = x.fix === 'stage' ? pill(d.st) : `<span class="num">${d.p}%</span>`, now = x.fix === 'stage' ? pill(x.to) : `<b class="num">${clamp(d.p + x.to, 5, 95)}%</b>`;
      body = `<div class="crm-pvm">${pvRow('Account', `<span class="pfm-lg xs" aria-hidden="true">${esc(c.n[0])}</span><span>${esc(c.n)}</span>`)}${pvRow('Deal', `<span>${esc(d.n)}</span><span class="num muted">${money(d.v)}</span>`)}`
        + pvRow(x.fix === 'stage' ? 'Stage' : 'Win probability', `${was}${I('right', 'xs')}${now}`) + `</div>`
        + `<div class="crm-pvc">${esc(fixWhy(x))} <span class="muted">Approving changes the deal; its weighted value in the forecast follows.</span></div>`;
    }
    return body;
  }
  function ibSnap(x){ return { t:ibText(x), pv:pvBody(x, false) }; }
  // a phone shows the list alone; picking a row opens its preview as a sheet over it
  const pvOpen = on => { const was = ibv.classList.contains('pv'); ibv.classList.toggle('pv', on); ipv.inert = phone() && !on; if (was && !on) fadeCls(ipv); };
  function ibSelect(id, focus){ ibSel = id; edFor = null; renderInbox(); if (focus === 'row') $(`[data-ib="${id}"] .crm-it`, igs)?.focus({ preventScroll:false }); }
  // Approve all: every waiting item of a group in one go, with one Undo for all of them
  function approveAll(k){
    const L = ibOrder().filter(x => x.state === 'wait' && x.kind === k); if (!L.length) return;
    const undos = L.map(x => { x.snap = ibSnap(x); const r = run(x.kind, coOf(x.co), x); const u = () => { r.undo(); x.snap = null; x.undo = null; }; x.undo = u; return u; });
    const nx = ibOrder().find(x => x.state === 'wait'); if (nx) ibSel = nx.id;
    refresh(); const n = IBG.find(g => g[0] === k)[1].toLowerCase();
    toast('ok', `Approved ${L.length} ${n.replace(/^(follow-ups|close dates|data fixes).*/, '$1')}`, k === 'follow' ? `${plural(L.length, 'email')} logged on the accounts` : k === 'slip' ? 'Their new close dates are on the board and in the forecast' : 'The deals are updated', { label:'Undo', run:() => { undos.reverse().forEach(u => u()); refresh(); } });
    $(`[data-ib="${ibSel}"] .crm-it`, igs)?.focus({ preventScroll:true });
  }
  function ibDo(x, a){
    const c = coOf(x.co), L = ibOrder().filter(y => y.state === 'wait'), i = L.indexOf(x), next = L[i + 1] || L[i - 1];
    if (a === 'ok'){ accept(c, { k:x.kind, item:x }); }
    else if (a === 'dismiss'){ x.snap = ibSnap(x); x.state = 'gone'; x.res = 'Dismissed'; x.undo = () => { x.state = 'wait'; x.snap = null; }; toast('info', 'Dismissed', ibText(x)[0], { label:'Undo', run:() => { x.state = 'wait'; x.snap = null; x.undo = null; refresh(); } }); }
    else if (a === 'undo' && x.undo){ x.undo(); x.undo = null; refresh(); return; }
    // the next waiting item takes the selection
    if (x.id === ibSel && next){ ibSel = next.id; edFor = null; }
    refresh();
  }
  ibv.addEventListener('click', e => {
    const b = e.target.closest('[data-ia]'); if (!b) return;
    if (b.dataset.ia === 'all') return approveAll(b.dataset.g);
    const el = b.closest('[data-ib]'), x = ibOf(el && el.dataset.ib), a = b.dataset.ia; if (!x) return;
    const inPv = ipv.contains(b), kb = !e.detail;
    if (a === 'sel'){ ibSelect(x.id, 'row'); if (phone()){ pvOpen(true); setTimeout(() => $('#crm-pvt', ipv)?.focus({ preventScroll:true }), 60); } return; }
    if (a === 'close'){ pvOpen(false); $(`[data-ib="${x.id}"] .crm-it`, igs)?.focus({ preventScroll:true }); return; }
    if (a === 'open'){ openSheet(x.co, kb); return; }
    if (a === 'edit'){
      if (x.id !== ibSel){ ibSel = x.id; edFor = null; renderInbox(); }
      if (x.kind === 'follow'){ renderPreview(); if (phone()) pvOpen(true); const db = $('.crm-drb', ipv); if (db){ db.focus(); const r = document.createRange(); r.selectNodeContents(db); r.collapse(false); const sl = getSelection(); sl.removeAllRanges(); sl.addRange(r); } }
      else buildEdit(x);
      return;
    }
    if (a === 'cancel' || a === 'save'){ if (a === 'save'){ const v = $('.crm-ta', ipv).value.trim(); if (v) x.body = v; } edFor = null; renderPreview(); $('[data-ia="edit"]', ipv)?.focus(); if (a === 'save') toast('ok', 'Draft saved', `Approve it to send it to ${x.to}`); return; }
    ibDo(x, a);
    // the focus stays where it was: on the preview's Approve for the next item, or on the selected row
    if (inPv && ipv.contains(document.activeElement) === false){ const n = $('[data-ia="ok"]', ipv) || $('[data-ia="open"]', ipv); if (n) n.focus({ preventScroll:true }); }
    else if (!inPv) $(`[data-ib="${ibSel}"] .crm-it`, igs)?.focus({ preventScroll:true });
  });
  // up and down move through the list, selecting as they go; Home and End jump to its ends
  igs.addEventListener('keydown', e => {
    const b = e.target.closest('.crm-it'); if (!b) return;
    const all = $$('.crm-it', igs), i = all.indexOf(b), to = { ArrowDown:all[i + 1], ArrowUp:all[i - 1], Home:all[0], End:all[all.length - 1] }[e.key];
    if (to){ e.preventDefault(); ibSelect(to.closest('[data-ib]').dataset.ib, 'row'); }
  });
  // the draft saves as you type, in the body and the subject
  ipv.addEventListener('input', e => { const x = ibOf(ipv.dataset.ib); if (!x) return;
    if (e.target.closest('.crm-drb')) x.body = e.target.closest('.crm-drb').innerText.replace(/\n{3,}/g, '\n\n').trim();
    else if (e.target.closest('.crm-dsj')){ x.subj = e.target.value; } });
  // Rewrite toolbar: select words in the draft and the agent rewrites them in place; the change shows as an inline diff
  // (struck out, then the new words) until you accept it or undo it (owner, 10 Nov: the library's components, in the inbox)
  const RW = { clear:'Clearer', short:'Shorter', warm:'Friendlier' };
  const RWR = {
    clear:[[/\bit has been\b/i, "it's been"], [/\bIs (\w+) still the right time to decide\?/, 'Are you still planning to decide in $1?'], [/\bI can send\b/, "I'll send"], [/ if that helps\b/, ' so you have it'], [/\bwe last spoke about\b/, 'we discussed']],
    short:[[/\bit has been a few weeks since we last spoke about\b/i, "it's been a few weeks since we discussed"], [/\bstill the right time to decide\b/, 'still the plan'], [/ if that helps\b/, ''], [/\bthat we talked about\b|\bwe talked about\b/, ''], [/\ba short recording of\b/, 'a recording of'], [/\ban updated proposal\b/, 'the updated proposal'], [/\bjust |\breally /g, '']],
    warm:[[/^(Hi [^,]+,) /, '$1 hope your week is going well. '], [/\bit has been\b/i, "it's been"], [/\bIs (\w+) still the right time to decide\?/, 'Is $1 still a good time for you to decide?'], [/\bI can send\b/, "I'd be happy to send"], [/ if that helps\b/, ' if that would help']],
  };
  const rewrite = (t, k) => { let o = t; RWR[k].forEach(([a, b]) => { o = o.replace(a, b); }); return o.replace(/ {2,}/g, ' ').replace(/ ([.,?])/g, '$1'); };
  const rtb = html(`<div class="rwx-tb crm-rtb" role="toolbar" aria-label="Rewrite" inert></div>`); app.append(rtb);
  const rtbHTML = `<button class="rwx-b" data-rw="clear">${I('spark', 'xs')}Clearer</button><button class="rwx-b" data-rw="short">Shorter</button><button class="rwx-b" data-rw="warm">Friendlier</button>`;
  let rwRange = null, rwDiff = null;
  const rtbAt = rect => { const w = rtb.offsetWidth, h = rtb.offsetHeight; rtb.style.left = clamp(rect.left + rect.width / 2 - w / 2, 8, innerWidth - w - 8) + 'px'; rtb.style.top = (rect.top - h - 8 < 8 ? rect.bottom + 8 : rect.top - h - 8) + 'px'; };
  const rtbHide = () => { if (rwDiff) return; rtb.classList.remove('show', 'act'); rtb.inert = true; rwRange = null; };
  function rtbShow(){
    if (rwDiff) return; const sl = getSelection(), db = $('.crm-drb[contenteditable]', ipv);
    if (!db || !sl.rangeCount || sl.isCollapsed || !db.contains(sl.anchorNode) || !db.contains(sl.focusNode) || sl.toString().trim().length < 3) return rtbHide();
    rwRange = sl.getRangeAt(0).cloneRange(); rtb.classList.remove('act'); rtb.innerHTML = rtbHTML; rtb.inert = false; rtbAt(rwRange.getBoundingClientRect()); rtb.classList.add('show');
  }
  ipv.addEventListener('mouseup', () => setTimeout(rtbShow, 0));
  ipv.addEventListener('keyup', e => { if (e.shiftKey || e.key === 'Shift') rtbShow(); });
  document.addEventListener('selectionchange', () => { if (rwRange && getSelection().isCollapsed && !rtb.contains(document.activeElement)) rtbHide(); });
  $('.crm-ipv', app).closest('.crm-ib')?.addEventListener('scroll', () => rtbHide(), true);
  const rwDone = keep => { if (!rwDiff) return; const { el, was, now } = rwDiff, db = el.closest('.crm-drb');
    el.replaceWith(document.createTextNode(keep ? now : was)); db.normalize(); db.contentEditable = 'true'; rwDiff = null; rtbHide();
    const x = ibOf(ipv.dataset.ib); if (x) x.body = db.innerText.trim(); db.focus({ preventScroll:true }); };
  rtb.addEventListener('mousedown', e => e.preventDefault());
  rtb.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.rw && rwRange){ const k = b.dataset.rw, was = rwRange.toString(), now = rewrite(was, k), r = rwRange;
      if (now === was){ rtb.classList.add('act'); rtb.innerHTML = `<span class="lbl">${I('check', 'xs')}Already ${RW[k].toLowerCase()} than that</span>`; rtbAt(r.getBoundingClientRect()); setTimeout(rtbHide, 1400); return; }
      rtb.classList.add('act'); rtb.innerHTML = `<span class="lbl"><span class="think on"><i></i><i></i><i></i><i></i></span>Rewriting</span>`; rtbAt(r.getBoundingClientRect());
      setTimeout(() => { const db = $('.crm-drb', ipv); if (!db || !db.contains(r.startContainer)) return rtbHide();
        const el = html(`<span class="itd-c crm-rwd"><del>${esc(was)}</del><ins>${esc(now)}</ins></span>`); r.deleteContents(); r.insertNode(el); db.contentEditable = 'false'; getSelection().removeAllRanges();
        rwDiff = { el, was, now }; rtb.innerHTML = `<span class="lbl">${I('check', 'xs')}${RW[k]}</span><button class="rwx-b" data-rw-x="undo">Undo</button><button class="pill accent sm" data-rw-x="ok">Accept</button>`;
        rtbAt(el.getBoundingClientRect()); enter(el); $('[data-rw-x="ok"]', rtb).focus({ preventScroll:true }); }, REDUCE ? 150 : 700);
      return; }
    if (b.dataset.rwX) rwDone(b.dataset.rwX === 'ok'); });
  rtb.addEventListener('keydown', e => { if (e.key === 'Escape'){ e.stopPropagation(); rwDiff ? rwDone(false) : rtbHide(); } });
  // Edit on a close date or a data fix: other dates, or other values
  function buildEdit(x){
    const p = pop('crm-p-ied'), d = dealOf(x.deal);
    if (x.kind === 'slip'){
      const opts = [workAfter(0, 5), workAfter(0, 10), toWork(eom), toWork(Math.round((new Date(today.getFullYear(), today.getMonth() + 2, 0) - today) / 864e5))].concat(x.to).sort((m, n) => m - n).filter((v, i, a) => a.indexOf(v) === i);
      p.innerHTML = `<div class="ph" role="none">New close date</div>` + opts.map(n => mi(`data-n="${n}"`, `<span>${fmtDW(n)}</span><span class="r num">in ${plural(n, 'day')}</span>`, 'menuitemradio', x.to === n)).join('');
      $$('.mi', p).forEach(m => m.addEventListener('click', () => { x.to = +m.dataset.n; renderInbox(); }));
    } else if (x.fix === 'stage'){
      p.innerHTML = `<div class="ph" role="none">Move to</div>` + STAGES.filter(s => !closed({ st:s.k }) && ST[s.k].i > ST[d.st].i).map(s => mi(`data-s="${s.k}"`, pill(s.k), 'menuitemradio', x.to === s.k)).join('');
      $$('.mi', p).forEach(m => m.addEventListener('click', () => { x.to = m.dataset.s; renderInbox(); }));
    } else {
      p.innerHTML = `<div class="ph" role="none">Lower to</div>` + [-5, -10, -15].map(n => mi(`data-n="${n}"`, `<span>${clamp(d.p + n, 5, 95)}%</span>`, 'menuitemradio', x.to === n)).join('');
      $$('.mi', p).forEach(m => m.addEventListener('click', () => { x.to = +m.dataset.n; renderInbox(); }));
    }
  }

  /* ---------- Calendar: Event calendar's week, Monday to Sunday, 8am to 6pm ---------- */
  const ecx = $('.crm-ecx', app), cgrid = $('.ecx-grid', ecx), cdays = $('.ecx-days', ecx), cmsg = $('.ecx-msg', ecx), plan = $('.crm-plan', ecx), H0 = 8, HN = 10;
  // the week on show starts on this week's Monday, weekends included, with today marked
  const baseMon = (() => { const d = dow(0); return d === 0 ? -6 : 1 - d; })();
  let wk = 0, cday = -1, SG = [];
  const mon = () => baseMon + wk * 7;
  const weekOf = (w = wk) => { const m0 = baseMon + w * 7; return [m0, m0 + 6]; };
  const inWeek = (n, w = wk) => { const [a, b] = weekOf(w); return n >= a && n <= b; };
  const weekLabel = (w = wk) => { const [a, b] = weekOf(w), sm = dateOf(a).getMonth() === dateOf(b).getMonth(); return `${fmtD(a)} to ${sm ? dateOf(b).getDate() : fmtD(b)}, ${dateOf(b).getFullYear()}`; };
  const at = h => `calc(var(--dm-ph) * ${h - H0} + 1px)`, tall = n => `calc(var(--dm-ph) * ${n} - 3px)`;
  const PX = () => parseFloat(getComputedStyle(cgrid).getPropertyValue('--dm-ph')) || 48;
  // the time column: an hour a row (8am), or on a narrow calendar half an hour a row (8:00, 8:30)
  $('.ecx-tm', ecx).innerHTML = Array.from({ length:HN * 2 }, (_, i) => { const h = H0 + Math.floor(i / 2), h12 = h > 12 ? h - 12 : h; return i % 2 ? `<span class="hf"><i class="n">${h12}:30</i></span>` : `<span><i class="w">${h12}${h >= 12 ? 'pm' : 'am'}</i><i class="n">${h12}:00</i></span>`; }).join('');
  $('.crm-leg', ecx).innerHTML = OWN.map(o => `<span><i style="background:var(--dm-p${P[o][1]})"></i>${first(o)}</span>`).join('');
  const closingOn = n => DE.filter(d => !closed(d) && d.close === n).sort((a, b) => b.v - a.v);
  const meetingsIn = (w = wk) => MT.filter(m => inWeek(m.day, w) && m.st === 'plan' && !m.fresh);
  // overlapping meetings share their column: each takes a lane, as wide as the busiest moment of its group allows
  function lanes(list){
    list.sort((a, b) => a.h - b.h || b.vd - a.vd);
    let g = [], end = -1; const groups = [];
    list.forEach(e => { if (g.length && e.h >= end){ groups.push(g); g = []; end = -1; } g.push(e); end = Math.max(end, e.h + e.vd); });
    if (g.length) groups.push(g);
    groups.forEach(gr => { const ends = []; gr.forEach(e => { let k = ends.findIndex(t => t <= e.h); if (k < 0){ k = ends.length; ends.push(0); } ends[k] = e.h + e.vd; e._l = k; }); gr.forEach(e => e._n = ends.length); });
  }
  const nowH = () => { const t = new Date(); return t.getHours() + t.getMinutes() / 60; };
  const isPast = m => m.st === 'held' || m.day < 0 || (m.day === 0 && m.h + m.dur <= nowH());
  const evLabel = m => { const c = coOf(m.co); return `${c.n}, ${m.kind}, ${fmtDW(m.day)} ${tmA(m.h)} to ${tmA(m.h + m.dur)}, ${P[m.own][0]}${m.st === 'plan' && m.day < 0 ? ', overdue' : m.st === 'held' ? ', held' : ''}`; };
  function evEl(m){
    const c = coOf(m.co), col = P[m.own][1], late = m.st === 'plan' && m.day < 0, n = m._n || 1;
    const tag = m.sug ? 'div' : 'button';
    const el = html(`<${tag} class="ecx-e crm-ev${m.sug ? ' sug' : ''}${!m.sug && m.dur <= .5 ? ' short' : ''}${late ? ' late' : ''}${m.st === 'held' ? ' held' : ''}${!m.sug && !late && isPast(m) ? ' past' : ''}" data-m="${m.id}" style="top:${at(m.h)};height:${tall(m.sug ? m.vd : m.dur)};left:calc(3px + (100% - 6px) * ${(m._l || 0) / n});width:calc((100% - 6px) / ${n} - ${n > 1 ? 2 : 0}px);${m.sug ? '' : `background:var(--dm-p${col}-bg);color:var(--dm-p${col})`}" ${m.sug ? ' role="group"' : ''} aria-label="${esc(m.sug ? 'Suggested: ' + low(m.kind) + ' with ' + c.n + ', ' + fmtDW(m.day) + ' ' + tmA(m.h) : evLabel(m))}"><b>${esc(c.n)}</b>${m.sug ? '' : `<span><span class="num">${tm(m.h)} – ${tm(m.h + m.dur)}</span> · ${late ? 'Overdue: ' : ''}${esc(m.kind)}</span>`}</${tag}>`);
    if (m.sug) el.insertAdjacentHTML('beforeend', `<span class="ecx-sg"><button class="y" data-sg="book" aria-label="Book a ${esc(low(m.kind))} with ${esc(c.n)}, ${fmtDW(m.day)} ${tmA(m.h)}">Book</button><button class="n crm-sgm" data-sg="more" data-pop="#crm-p-sg" aria-haspopup="menu" aria-label="More for ${esc(c.n)}" data-tip="Skip or open">${I('more', 'xs')}</button><i class="num">${tm(m.h)}</i></span>`);
    el._m = m;
    return el;
  }
  function renderCal(keep){
    if (!keep) closeCalPop();
    const m0 = mon();
    $$('.ecx-day, .ecx-scan', cgrid).forEach(x => x.remove());
    cgrid.insertAdjacentHTML('beforeend', [0, 1, 2, 3, 4, 5, 6].map(i => { const n = m0 + i, cl = closingOn(n);
      return `<div class="ecx-day${isWork(n) ? '' : ' we'}" data-d="${i}"><div class="ecx-dh${n === 0 ? ' t' : ''}">${DAYN[dow(n)]} <b>${dateOf(n).getDate()}</b></div><div class="crm-cls" aria-label="Closing ${fmtDW(n)}">${cl.slice(0, cl.length > 2 ? 1 : 2).map(d => { const c = coOf(d.co);
        return `<button class="crm-clb" data-co="${c.id}" data-tip="${esc(c.n)}: ${esc(d.n)}, ${money(d.v)}, ${ST[d.st].t}" aria-label="Closing ${fmtDW(n)}: ${esc(c.n)}, ${esc(d.n)}, ${money(d.v)}. Open the account">${I('target', 'xs')}<span>${esc(c.n)}</span></button>`; }).join('')}${cl.length > 2 ? `<button class="crm-clb more" data-pop="#crm-p-cls" data-day="${n}" aria-haspopup="menu" aria-label="${cl.length - 1} more closing ${fmtDW(n)}">+${cl.length - 1}</button>` : ''}</div><div class="ecx-col" data-d="${i}"></div></div>`; }).join('') + '<div class="ecx-scan"></div>');
    for (let i = 0; i < 7; i++){
      const n = m0 + i, list = MT.filter(m => m.day === n).concat(SG.filter(s => s.day === n));
      list.forEach(m => m.vd = m.sug ? Math.max(1, m.dur) : m.dur); lanes(list);
      const cl = $(`.ecx-col[data-d="${i}"]`, cgrid);
      list.forEach(m => { const el = evEl(m); cl.appendChild(el); bind(el); });
      if (n === 0){ const t = new Date(), h = t.getHours() + t.getMinutes() / 60; if (h >= H0 && h <= H0 + HN) cl.insertAdjacentHTML('beforeend', `<div class="ecx-now" style="top:calc(var(--dm-ph) * ${(h - H0).toFixed(3)})" data-tip="Now, ${tmA(Math.floor(h * 4) / 4)}"></div>`); }
    }
    // a narrow calendar shows one day: the row of days picks it
    cdays.innerHTML = [0, 1, 2, 3, 4, 5, 6].map(i => { const n = m0 + i, k = MT.filter(m => m.day === n && m.st !== 'held').length + SG.filter(s => s.day === n).length;
      return `<button aria-pressed="false" data-d="${i}"${n === 0 ? ' class="t"' : ''} aria-label="${DAYL[dow(n)]} ${fmtD(n)}, ${plural(k, 'meeting')}"><span>${DAYN[dow(n)]}</span><b>${dateOf(n).getDate()}</b></button>`; }).join('');
    if (cday < 0) cday = inWeek(0) ? -mon() : 0;
    fitHours();
    showDay(cday, false);
    counts(); paintCalHead();
  }
  const csc = $('.ecx-sc', ecx);
  function fitHours(){
    if (cdays.getClientRects().length){ cgrid.style.removeProperty('--dm-ph'); return; }
    const room = csc.clientHeight - 62; if (room > 0) cgrid.style.setProperty('--dm-ph', Math.max(40, Math.floor(room / HN)) + 'px');
  }
  new ResizeObserver(() => { if (view === 'calendar') fitHours(); }).observe(csc);
  function showDay(i, anim = true){
    const was = cday; cday = i; if (cv === 'day') paintCalHead();
    $$('button', cdays).forEach(b => b.setAttribute('aria-pressed', +b.dataset.d === i));
    $$('.ecx-day', cgrid).forEach((d, k) => d.classList.toggle('on', k === i));
    if (anim && was !== i && cdays.getClientRects().length){ closeCalPop(); enter($$('.ecx-day', cgrid)[i]); }
  }
  cdays.addEventListener('click', e => { const b = e.target.closest('button'); if (b) showDay(+b.dataset.d); });
  const goWeek = w => { const dir = Math.sign(w - wk); wk = w; cday = -1; SG = SG.filter(s => inWeek(s.day)); renderCal();
    if (dir) [$('.crm-wkt', ecx), ...$$('.ecx-day', cgrid), $('.ecx-days', ecx)].forEach(el => glide(el, { transform:`translateX(${dir * 14}px)` })); };
  $$('[data-wk]', ecx).forEach(b => b.onclick = () => { const st = +b.dataset.wk;
    if (cv === 'month'){ mo = st === 0 ? 0 : mo + st; renderMonth(st); return; }
    if (cv === 'day'){ goDay(st === 0 ? 0 : shownDay() + st, st); return; }
    goWeek(st === 0 ? 0 : wk + st); });

  /* ---------- the calendar's views: Day, Week and Month, and a date to go to (owner, 10 Nov) ---------- */
  let cv = 'week', mo = 0, jMo = 0;
  const mon0 = n => (dateOf(n).getFullYear() - today.getFullYear()) * 12 + dateOf(n).getMonth() - today.getMonth();
  const shownDay = () => cv === 'month' ? Math.round((new Date(today.getFullYear(), today.getMonth() + mo, 1) - today) / 864e5) : mon() + (cday < 0 ? (inWeek(0) ? -mon() : 0) : cday);
  const UNIT = { day:'day', week:'week', month:'month' };
  function paintCalHead(){
    const n = shownDay(), t = cv === 'day' ? `${DAYL[dow(n)]}, ${fmtD(n)}, ${dateOf(n).getFullYear()}` : cv === 'month' ? new Date(today.getFullYear(), today.getMonth() + mo, 1).toLocaleDateString('en-US', { month:'long', year:'numeric' }) : weekLabel();
    swap($('.crm-wkt', ecx), t);
    $('[data-wk="-1"]', ecx).setAttribute('aria-label', 'Previous ' + UNIT[cv]); $('[data-wk="-1"]', ecx).dataset.tip = 'Previous ' + UNIT[cv];
    $('[data-wk="1"]', ecx).setAttribute('aria-label', 'Next ' + UNIT[cv]); $('[data-wk="1"]', ecx).dataset.tip = 'Next ' + UNIT[cv];
  }
  // one day: its week, and the day picked in it
  function goDay(n, dir = 0){
    const w = Math.floor((n - baseMon) / 7); if (w !== wk){ wk = w; SG = SG.filter(x => inWeek(x.day)); }
    cday = n - baseMon - wk * 7; renderCal();
    if (dir && cv === 'day') glide($$('.ecx-day', cgrid)[cday], { transform:`translateX(${dir * 12}px)` }, 240);
  }
  const mview = $('.crm-mon', ecx), csc2 = $('.ecx-sc', ecx);
  function setCv(v, n){
    const from = shownDay(); cv = v; closeCalPop();
    $$('.crm-cvw button', ecx).forEach(b => b.setAttribute('aria-pressed', b.dataset.cv === v)); cvSeg.place();
    ecx.classList.toggle('vday', v === 'day'); ecx.classList.toggle('vmon', v === 'month');
    csc2.hidden = v === 'month'; mview.hidden = v !== 'month'; plan.hidden = v === 'month';
    const at0 = n != null ? n : from;
    if (v === 'month'){ mo = mon0(at0); renderMonth(); glide(mview, { transform:'scale(.99)' }, 220); }
    else { goDay(at0); glide(csc2, { transform:'scale(.995)' }, 220); }
  }
  // the view switch is Segmented control: its knob slides to the view picked, here or from Month's days and meetings
  const cvSeg = seg($('.crm-cvw', ecx), v => { if (v !== cv) setCv(v); });
  // Month: six weeks, each day with its first three meetings and how many more; a day opens in Day, a meeting opens its card
  function renderMonth(dir){
    const f = new Date(today.getFullYear(), today.getMonth() + mo, 1), lead = (f.getDay() + 6) % 7, n0 = Math.round((f - today) / 864e5) - lead;
    let g = '';
    for (let i = 0; i < 42; i++){ const n = n0 + i, d = dateOf(n), inM = d.getMonth() === f.getMonth(), L = MT.filter(m => m.day === n).sort((a, b) => a.h - b.h);
      g += `<div class="crm-mc${inM ? '' : ' o'}${n === 0 ? ' t' : ''}${isWork(n) ? '' : ' we'}"><button class="crm-mcd num" data-n="${n}" aria-label="${DAYL[dow(n)]} ${fmtD(n)}, ${plural(L.length, 'meeting')}. Open the day">${d.getDate()}</button>`
        + L.slice(0, 3).map(m => `<button class="crm-mce${isPast(m) ? ' past' : ''}" data-mm="${m.id}" style="--crm-mc:var(--dm-p${P[m.own][1]})" aria-label="${esc(evLabel(m))}"><i></i><span class="num">${tm(m.h)}</span><span class="t">${esc(coOf(m.co).n)}</span></button>`).join('')
        + (L.length > 3 ? `<button class="crm-mcm" data-n="${n}">${L.length - 3} more</button>` : '') + `</div>`; }
    mview.innerHTML = `<div class="crm-mwd muted">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(x => `<span>${x}</span>`).join('')}</div><div class="crm-mg">${g}</div>`;
    if (dir) glide($('.crm-mg', mview), { transform:`translateX(${dir * 14}px)` }, 240);
    paintCalHead();
  }
  mview.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.mm){ const m = MT.find(x => x.id === b.dataset.mm); if (!m) return; setCv('day', m.day); const el = $(`.ecx-e[data-m="${m.id}"]`, cgrid); if (el){ el.focus({ preventScroll:true }); openCalPop(el); } return; }
    if (b.dataset.n != null) setCv('day', +b.dataset.n); });
  // the date picker on the label: a month of days, today and the day on show marked; a pick goes there in the same view
  const jpk = pop('crm-p-jump');
  function paintJump(dir){
    const f = new Date(today.getFullYear(), today.getMonth() + jMo, 1), lead = (f.getDay() + 6) % 7, dim = new Date(f.getFullYear(), f.getMonth() + 1, 0).getDate(), on = shownDay();
    const wkA = cv === 'week' ? weekOf()[0] : null;
    let g = ''; for (let i = 0; i < lead; i++) g += '<span></span>';
    for (let d = 1; d <= dim; d++){ const n = Math.round((new Date(f.getFullYear(), f.getMonth(), d) - today) / 864e5), sel = cv === 'week' ? n >= wkA && n <= wkA + 6 : cv === 'day' && n === on;
      g += `<button class="dpk-d${sel ? ' s' : ''}${n === 0 ? ' t' : ''}${isWork(n) ? '' : ' o'}" data-n="${n}" aria-pressed="${sel}" aria-label="${DAYL[dow(n)]} ${fmtD(n)}">${d}</button>`; }
    jpk.innerHTML = `<div class="dpk-mh"><button class="ib" data-j="-1" aria-label="Previous month">${I('chev-l', 'xs')}</button><b>${f.toLocaleDateString('en-US', { month:'long', year:'numeric' })}</b><button class="ib" data-j="1" aria-label="Next month">${I('chev-r', 'xs')}</button></div>`
      + `<div class="dpk-wd muted"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div><div class="dpk-vp"><div class="dpk-g${dir ? (dir < 0 ? ' in-l' : ' in-r') : ''}">${g}</div></div>`
      + `<div class="crm-wa"><button class="pill line sm" data-n="0">Today</button></div>`;
  }
  onOpen('.crm-wkb', () => { jMo = cv === 'month' ? mo : mon0(shownDay()); paintJump(); setTimeout(() => $('.dpk-d.s, .dpk-d.t', jpk)?.focus({ preventScroll:true }), 40); });
  jpk.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.j){ e.stopPropagation(); jMo += +b.dataset.j; paintJump(+b.dataset.j); $(`[data-j="${b.dataset.j}"]`, jpk).focus(); return; }
    if (b.dataset.n == null) return; const n = +b.dataset.n; closePops(); $('.crm-wkb', ecx).focus({ preventScroll:true });
    if (cv === 'month'){ const was = mo; mo = mon0(n); renderMonth(Math.sign(mo - was)); } else if (cv === 'day') goDay(n, Math.sign(n - shownDay())); else { const w = Math.floor((n - baseMon) / 7); goWeek(w); } });
  // Plan follow-ups places slots on the week, so it opens the week first
  plan.addEventListener('click', () => { if (cv !== 'week') setCv('week'); }, true);
  // a meeting found elsewhere (the sheet's next step): its week, its day, and its card open
  function showMeeting(m){
    setView('calendar'); wk = Math.floor((m.day - baseMon) / 7); cday = (m.day - baseMon) - wk * 7; renderCal();
    const el = $(`.ecx-e[data-m="${m.id}"]`, cgrid); if (el){ el.scrollIntoView({ block:'nearest' }); el.focus({ preventScroll:true }); openCalPop(el); }
  }

  // the meeting's card: the account, the deal and its stage, the people, Prep with agent and Open account
  const cpop = html('<div class="ecx-pop crm-cpop" role="dialog" aria-label="Meeting"></div>'); ecx.appendChild(cpop);
  let popFor = null;
  const closeCalPop = () => { if (!popFor) return; const back = cpop.contains(document.activeElement) && popFor; const m = popFor._m; cpop.classList.remove('open'); popFor = null;
    if (m && m.fresh){ MT = MT.filter(x => x !== m); renderCal(); return; } if (back && back.isConnected) back.focus({ preventScroll:true }); };
  // who is in a meeting: its owner, then people from the account and from the team, saved with the meeting (m.who)
  const pkey = (co, i) => `c:${co}:${i}`;
  function personOf(k){
    if (k.startsWith('o:')){ const o = k.slice(2); return { k, n:P[o][0], r:k.slice(2) === 'NC' ? 'Head of sales' : 'Sales, Larkfield', av:av(o), team:true, own:o }; }
    const [, co, i] = k.split(':'), c = coOf(co), p = c && c.ppl[+i]; if (!p) return null;
    return { k, n:p.n, r:`${p.r}, ${c.n}`, av:avn(p.n), team:false };
  }
  const whoOf = m => { if (!m.who) m.who = ['o:' + m.own, ...coOf(m.co).ppl.slice(0, 2).map((p, i) => pkey(m.co, i))]; m.who = m.who.filter(k => personOf(k)); return m.who; };
  const namesOf = m => andList(whoOf(m).map(k => personOf(k).n.split(' ')[0]));
  const prepNote = m => { const c = coOf(m.co), d = dealOf(m.deal) || c.lead, inv = whoOf(m).map(personOf).filter(p => !p.team), ch = inv[0] || { n:c.ppl[0].n }, bits = [`With ${namesOf(m)}.`];
    if (d) bits.push(d.st === 'won' ? `${d.n} closed won, ${kmoney(d.v)}.` : d.st === 'lost' ? `${d.n} was lost: ${d.why}.` : `${d.n} is in ${ST[d.st].t} at ${d.p}%, ${kmoney(d.v)}, ${slipping(d) ? `and was due ${fmtD(d.close)}, so agree a new date` : `closing ${fmtD(d.close)}`}.`);
    bits.push(c.last === 0 ? 'Last touch was today.' : `Last touch was ${plural(c.last, 'day')} ago, ${c.lt === 'Email' ? 'an email' : 'a ' + ltName(c)}.`);
    const more = DE.filter(x => x.co === c.id && !closed(x) && x !== d); if (more.length) bits.push(`Also open: ${more.map(x => x.n.toLowerCase()).join(', ')}.`);
    bits.push(`Ask ${ch.n.split(' ')[0]} ${ASKQ[d ? d.st : 'disc']}.`);
    return bits.join(' '); };
  function placeCard(el){
    const pr = ecx.getBoundingClientRect(), er = el.getBoundingClientRect(), w = cpop.offsetWidth || 300;
    let x = er.right - pr.left + 8; if (x + w > pr.width - 8) x = er.left - pr.left - w - 8; x = clamp(x, 8, Math.max(8, pr.width - w - 8));
    let y = er.top - pr.top; y = Math.max(8, Math.min(y, pr.height - cpop.offsetHeight - 8));
    cpop.style.left = x + 'px'; cpop.style.top = y + 'px';
  }
  function openCalPop(el){
    const m = el._m; if (popFor === el){ closeCalPop(); return; }
    if (popFor && popFor._m.fresh && popFor._m !== m) closeCalPop();
    popFor = el; const c = coOf(m.co), d = dealOf(m.deal) || c.lead, col = P[m.own][1], done = !m.fresh && isPast(m);
    cpop.innerHTML = `<div class="ecx-ph"><i style="background:var(--dm-p${col})"></i>${m.fresh ? `<input class="ecx-ti" placeholder="Call" aria-label="Meeting title" value="">` : `<b>${esc(c.n)}</b>`}<button class="ib ecx-px" aria-label="Close" data-tip="Close">${I('x', 'xs')}</button></div>`
      + (m.fresh ? `<div class="ecx-pt"><button class="dtp-v crm-pacc" data-pop="#crm-p-acc" aria-haspopup="menu" aria-label="Account: ${esc(c.n)}. Change it"><span class="pfm-lg xs" aria-hidden="true">${esc(c.n[0])}</span><span>${esc(c.n)}</span>${I('chev-d', 'xs')}</button></div>` : `<div class="ecx-pt">${esc(m.kind)}${m.st === 'held' ? ', held' : m.day < 0 ? ', overdue' : ''}</div>`)
      + (m.st === 'held' ? `<div class="ecx-pt num">${fmtDW(m.day)}, ${tm(m.h)} – ${tm(m.h + m.dur)}</div>`
        : `<div class="ecx-pt"><button class="dtp-v crm-pwhen num" data-pop="#crm-p-when" aria-haspopup="dialog" aria-label="When: ${fmtDW(m.day)}, ${tmA(m.h)} to ${tmA(m.h + m.dur)}. Change it" data-tip="Change the date or time">${I('cal', 'xs')}<span>${fmtDW(m.day)}, ${tm(m.h)} – ${tm(m.h + m.dur)}</span></button></div>`)
      + (d ? `<div class="crm-pdl"><span class="t">${esc(d.n)}</span>${pill(d.st)}<span class="num">${kmoney(d.v)}</span></div>` : '')
      + `<div class="ecx-pw crm-pw">${peopleRow(m)}</div>`
      + `<div class="ecx-pa">${m.fresh ? `<button class="pill line sm" data-p="discard">Discard</button><button class="pill primary sm" data-p="save">Book</button>` : `<button class="pill line sm" data-p="open">Open account</button>${done ? `<button class="pill primary sm" data-p="log">Log the call</button>` : `<button class="pill soft sm ecx-ask ecx-prep" data-p="prep">${I('spark', 'xs')}Prep with agent</button>`}`}</div>`
      // Join call sits under the pair, on the text column, for every meeting still to come, as calendars show a call's link
      // (owner, 10 Nov: not a full-card button above the people)
      + (!m.fresh && !done ? `<div class="ecx-pa crm-pjn"><button class="pill primary sm" data-p="join">Join call</button></div>` : '');
    placeCard(el); cpop.classList.remove('open'); void cpop.offsetWidth; cpop.classList.add('open'); hideTip();
    const ti = $('.ecx-ti', cpop); if (ti){ ti.focus({ preventScroll:true }); ti.onkeydown = k => { if (k.key === 'Enter'){ k.preventDefault(); saveNew(); } }; }
  }
  // the people row: an overlapping avatar stack (each one removes its person; the organiser stays), a + that opens the picker,
  // and their first names
  const avsHtml = m => { const W = whoOf(m).map(personOf);
    return `<span class="crm-avs" role="list" aria-label="People">${W.map(p => p.k === 'o:' + m.own ? `<span class="crm-avb" role="listitem" data-k="${p.k}" data-tip="${esc(p.n)}, organiser" data-tip-at="below">${p.av}</span>`
        : `<button class="crm-avb" role="listitem" data-k="${p.k}" data-rm="${p.k}" aria-label="Remove ${esc(p.n)}" data-tip="Remove ${esc(p.n)}" data-tip-at="below">${p.av}<i class="x" aria-hidden="true">${I('x', 'xs')}</i></button>`).join('')}</span>`; };
  function peopleRow(m){
    return avsHtml(m) + `<button class="ib crm-padd" data-pop="#crm-p-ppl" data-pop-align="end" aria-haspopup="dialog" aria-label="Add people" data-tip="Add people">${I('plus', 'xs')}</button>`
      + `<span class="muted crm-pwn">${esc(namesOf(m))}</span>`;
  }
  // the row redrawn in place: a person who joins settles in, one who leaves fades out first
  function paintPeople(m, added, removed){
    const row = $('.crm-pw', cpop); if (!row) return;
    // only the stack and the names are redrawn, so the + keeps its place and the focus
    const draw = () => { $('.crm-avs', row).outerHTML = avsHtml(m); $('.crm-pwn', row).textContent = namesOf(m); if (added) enter($(`.crm-avb[data-k="${added}"]`, row)); glide($('.crm-pwn', row), { transform:'translateY(2px)' }, 200); };
    const gone = removed && $(`.crm-avb[data-k="${removed}"]`, row);
    if (gone && !REDUCE && gone.animate) gone.animate([{ opacity:1, transform:'none' }, { opacity:0, transform:'scale(.6)' }], { duration:160, easing:EASE }).finished.then(draw); else draw();
  }
  // the picker: the account's people first, then the team, each with its avatar, role and a check; a search; the arrow keys
  // move, Enter adds or removes, Escape closes
  const ppk = $('#crm-p-ppl', app), ppq = $('.crm-ppq', ppk), ppl = $('.crm-ppo', ppk); let ppFor = null, ppAt = 0;
  function buildPpl(m){
    ppFor = m; ppq.value = ''; ppAt = 0; paintPpl(); setTimeout(() => ppq.focus({ preventScroll:true }), 40);
  }
  function paintPpl(){
    const m = ppFor; if (!m) return; const c = coOf(m.co), q = ppq.value.trim().toLowerCase(), W = whoOf(m);
    const keys = [...c.ppl.map((p, i) => pkey(c.id, i)), ...OWN.map(o => 'o:' + o)].map(personOf).filter(p => !q || (p.n + ' ' + p.r).toLowerCase().includes(q));
    const grp = (t, L) => L.length ? `<div class="ph" role="presentation">${t}</div>` + L.map(p => `<div class="crm-po" role="option" id="crm-po-${p.k.replace(/[^a-z0-9]/gi, '')}" aria-selected="${W.includes(p.k)}" data-k="${p.k}"${p.k === 'o:' + m.own ? ' aria-disabled="true"' : ''}>${p.av}<span class="t"><b>${esc(p.n)}</b><span class="muted">${esc(p.k === 'o:' + m.own ? 'Organiser' : p.r)}</span></span><span class="ck">${I('check', 'xs')}</span></div>`).join('') : '';
    ppl.innerHTML = grp(`At ${esc(c.n)}`, keys.filter(p => !p.team)) + grp('Your team', keys.filter(p => p.team)) || '<div class="crm-ppe muted">Nobody matches</div>';
    hiPpl(0);
  }
  function hiPpl(d){
    const os = $$('.crm-po', ppl); if (!os.length){ ppq.removeAttribute('aria-activedescendant'); return; }
    ppAt = clamp(ppAt + d, 0, os.length - 1); os.forEach((o, i) => o.classList.toggle('hl', i === ppAt)); ppq.setAttribute('aria-activedescendant', os[ppAt].id); os[ppAt].scrollIntoView({ block:'nearest' });
  }
  function togglePerson(k){
    const m = ppFor; if (!m || k === 'o:' + m.own) return; const W = whoOf(m), on = W.includes(k);
    m.who = on ? W.filter(x => x !== k) : [...W, k];
    const o = $(`.crm-po[data-k="${k}"]`, ppl); if (o) o.setAttribute('aria-selected', !on);
    paintPeople(m, on ? null : k, on ? k : null); if (!m.fresh) refreshMeeting(m);
    say(`${personOf(k).n} ${on ? 'removed from' : 'added to'} the ${low(m.kind)}`);
  }
  ppl.addEventListener('click', e => { const o = e.target.closest('.crm-po'); if (o){ ppAt = $$('.crm-po', ppl).indexOf(o); hiPpl(0); togglePerson(o.dataset.k); } });
  ppq.addEventListener('input', () => { ppAt = 0; paintPpl(); });
  ppq.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); hiPpl(e.key === 'ArrowDown' ? 1 : -1); } else if (e.key === 'Enter'){ e.preventDefault(); const o = $$('.crm-po', ppl)[ppAt]; if (o) togglePerson(o.dataset.k); } });
  // a change to a booked meeting reaches the sheet's People list, the Prep note and the next step at once
  const refreshMeeting = m => { derive(); if (sheetFor === m.co) renderSheet(); };

  // the date and time: Date picker's month grid, then the start (in 15 minutes) and the length; it changes the meeting as you
  // pick, and a booked meeting's move toasts with Undo when the picker closes
  const wpk = $('#crm-p-when', app); let wFor = null, wMon = 0;
  function buildWhen(m){ wFor = { m, was:[m.day, m.h, m.dur] }; const d = dateOf(m.day); wMon = (d.getFullYear() - today.getFullYear()) * 12 + d.getMonth() - today.getMonth(); paintWhen(); setTimeout(() => $('.dpk-d.s', wpk)?.focus({ preventScroll:true }), 40); }
  function paintWhen(dir){
    const m = wFor.m, f = new Date(today.getFullYear(), today.getMonth() + wMon, 1), lead = (f.getDay() + 6) % 7, dim = new Date(f.getFullYear(), f.getMonth() + 1, 0).getDate();
    const off = dt => Math.round((dt - today) / 864e5);
    let g = ''; for (let i = 0; i < lead; i++) g += '<span></span>';
    for (let d = 1; d <= dim; d++){ const n = off(new Date(f.getFullYear(), f.getMonth(), d)); g += `<button class="dpk-d${n === m.day ? ' s' : ''}${n === 0 ? ' t' : ''}${isWork(n) ? '' : ' o'}" data-n="${n}" aria-pressed="${n === m.day}" aria-label="${DAYL[dow(n)]} ${fmtD(n)}">${d}</button>`; }
    wpk.innerHTML = `<div class="dpk-mh"><button class="ib" data-w="-1" aria-label="Previous month">${I('chev-l', 'xs')}</button><b>${f.toLocaleDateString('en-US', { month:'long', year:'numeric' })}</b><button class="ib" data-w="1" aria-label="Next month">${I('chev-r', 'xs')}</button></div>`
      + `<div class="dpk-wd muted"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div><div class="dpk-vp"><div class="dpk-g${dir ? (dir < 0 ? ' in-l' : ' in-r') : ''}">${g}</div></div>`
      + `<div class="crm-wt"><span class="k">Starts</span><button class="ib" data-t="-.25" aria-label="15 minutes earlier">${I('minus', 'xs')}</button><b class="num" aria-live="polite">${tmA(m.h)}</b><button class="ib" data-t=".25" aria-label="15 minutes later">${I('plus', 'xs')}</button></div>`
      + `<div class="crm-wt"><span class="k">Length</span><div class="seg2 crm-wl" role="group" aria-label="Length">${[.25, .5, .75, 1, 1.5].map(v => `<button aria-pressed="${m.dur === v}" data-l="${v}">${v < 1 ? v * 60 + 'm' : v + 'h'}</button>`).join('')}</div></div>`
      + `<div class="crm-wa"><button class="pill primary sm" data-close>Done</button></div>`;
  }
  wpk.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || !wFor) return; const m = wFor.m;
    if (b.dataset.w){ e.stopPropagation(); wMon += +b.dataset.w; paintWhen(+b.dataset.w); $(`[data-w="${b.dataset.w}"]`, wpk).focus(); return; }
    if (b.dataset.n != null){ e.stopPropagation(); m.day = +b.dataset.n; }
    else if (b.dataset.t){ e.stopPropagation(); m.h = clamp(m.h + +b.dataset.t, H0, H0 + HN - m.dur); }
    else if (b.dataset.l){ e.stopPropagation(); m.dur = +b.dataset.l; m.h = Math.min(m.h, H0 + HN - m.dur); }
    else return;
    const sel = b.dataset.n != null ? `[data-n="${b.dataset.n}"]` : b.dataset.t ? `[data-t="${b.dataset.t}"]` : `[data-l="${b.dataset.l}"]`;
    paintWhen(); $(sel, wpk)?.focus({ preventScroll:true }); moveCard(m);
  });
  // the calendar follows: the meeting's week, its new place, and the card stays open on it
  function moveCard(m){
    if (!inWeek(m.day)){ wk = Math.floor((m.day - baseMon) / 7); cday = -1; }
    if (cdays.getClientRects().length) cday = m.day - mon();
    renderCal(true);
    const el = $(`.ecx-e[data-m="${m.id}"]`, cgrid); if (el){ popFor = el; placeCard(el); }
    const w = $('.crm-pwhen span', cpop); if (w) w.textContent = `${fmtDW(m.day)}, ${tm(m.h)} – ${tm(m.h + m.dur)}`;
    if (!m.fresh) refreshMeeting(m);
  }
  // when the picker closes on a booked meeting that moved, one toast says so, with Undo
  new MutationObserver(() => { if (wpk.classList.contains('open') || !wFor) return; const { m, was } = wFor; wFor = null;
    if (m.fresh || (m.day === was[0] && m.h === was[1] && m.dur === was[2])) return; const c = coOf(m.co); refresh();
    toast('ok', `${m.kind} with ${c.n} moved`, `${fmtDW(m.day)}, ${tmA(m.h)} to ${tmA(m.h + m.dur)}, was ${fmtDW(was[0])} ${tmA(was[1])}`, { label:'Undo', run:() => { [m.day, m.h, m.dur] = was; refresh(); } }); }).observe(wpk, { attributes:true, attributeFilter:['class'] });

  function saveNew(){
    const m = popFor && popFor._m; if (!m || !m.fresh) return;
    const t = ($('.ecx-ti', cpop).value || '').trim(); m.kind = t || 'Call'; m.fresh = false; popFor = null; cpop.classList.remove('open');
    const c = coOf(m.co); refresh();
    toast('ok', `${m.kind} booked with ${c.n}`, `${fmtDW(m.day)}, ${tmA(m.h)}, on ${first(m.own)}'s calendar`, { label:'Undo', run:() => { MT = MT.filter(x => x !== m); refresh(); } });
    const el = $(`.ecx-e[data-m="${m.id}"]`, cgrid); if (el){ enter(el); el.focus({ preventScroll:true }); }
  }
  cpop.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; const m = popFor && popFor._m; if (!m) return;
    if (b.classList.contains('ecx-px') || b.dataset.p === 'discard'){ closeCalPop(); return; }
    if (b.dataset.p === 'save') return saveNew();
    if (b.dataset.p === 'open'){ const id = m.co; closeCalPop(); openSheet(id, true); return; }
    if (b.dataset.p === 'join'){ toast('info', `Joining the ${low(m.kind)}`, `${coOf(m.co).n}, with ${andList(whoOf(m).map(k => personOf(k)).filter(Boolean).map(x => x.n.split(' ')[0]))}. A template has no call to open`); closeCalPop(); return; }
    if (b.dataset.p === 'log'){ const c = coOf(m.co), was = m.st; m.st = 'held'; closeCalPop(); logActivity(c, 'Call', `${m.kind} with ${c.ppl[0].n}`); renderCal(); return; }
    if (b.dataset.p === 'prep'){ b.innerHTML = '<span class="think on"><i></i><i></i><i></i><i></i></span>Writing'; b.disabled = true;
      setTimeout(() => { if (!b.isConnected) return; const nt = html(`<div class="ecx-note">${I('spark', 'xs')}<span>${esc(prepNote(m))}</span></div>`); b.closest('.ecx-pa').before(nt); enter(nt); b.remove(); }, REDUCE ? 0 : 900); }
    if (b.classList.contains('crm-pacc')) buildAcc(m);
    if (b.classList.contains('crm-padd')) buildPpl(m);
    if (b.classList.contains('crm-pwhen')) buildWhen(m);
    if (b.dataset.rm){ const k = b.dataset.rm, W = whoOf(m); m.who = W.filter(x => x !== k); hideTip(); paintPeople(m, null, k); if (!m.fresh) refreshMeeting(m); say(`${personOf(k).n} removed`); setTimeout(() => $('.crm-padd', cpop)?.focus({ preventScroll:true }), 200); }
  });
  // a new meeting's account: the ones with nothing booked first
  function buildAcc(m){
    const p = pop('crm-p-acc'), L = CO.slice().sort((a, b) => (!!a.next - !!b.next) || b.value - a.value);
    p.innerHTML = `<div class="ph" role="none">Account</div>` + L.map(c => mi(`data-co="${c.id}"`, `<span class="pfm-lg xs" aria-hidden="true">${esc(c.n[0])}</span><span>${esc(c.n)}</span>${c.next ? '' : '<span class="r muted">No next step</span>'}`, 'menuitemradio', m.co === c.id)).join('');
    $$('.mi', p).forEach(x => x.addEventListener('click', () => { const c = coOf(x.dataset.co), t = $('.ecx-ti', cpop).value; m.co = c.id; m.own = c.own; m.deal = c.lead && c.lead.id; m.who = null; const el = popFor; popFor = null; const nel = evEl(m); el.replaceWith(nel); bind(nel); openCalPop(nel); $('.ecx-ti', cpop).value = t; }));
  }
  // drag a meeting to another time or day, snapping to 15 minutes; a click without moving opens its card
  const colAt = i => $(`.ecx-col[data-d="${i}"]`, cgrid);
  function bind(el){
    const m = el._m;
    el.onclick = k => { if (k.target.closest('.ecx-sg')) return; if (!k.isTrusted || k.detail) return; if (m.sug) return; openCalPop(el); const f = $('.ecx-ti', cpop) || $('button', cpop); if (popFor === el && f) f.focus({ preventScroll:true }); };
    el.onpointerdown = d => {
      if (d.button || d.target.closest('.ecx-sg') || m.sug) return;
      const sx = d.clientX, sy = d.clientY, i0 = (m.day - mon()); let moved = false, ni = i0, nh = m.h;
      if (m.st === 'held'){ el.onpointerup = () => { el.onpointerup = null; openCalPop(el); }; return; }
      el.setPointerCapture(d.pointerId);
      el.onpointermove = mv => { const dx = mv.clientX - sx, dy = mv.clientY - sy; if (!moved && Math.hypot(dx, dy) < 5) return; if (!moved){ moved = true; el.classList.add('drag'); if (popFor !== el || !m.fresh) closeCalPop(); hideTip(); }
        nh = clamp(m.h + Math.round(dy / PX() * 4) / 4, H0, H0 + HN - m.dur);
        const under = document.elementsFromPoint(mv.clientX, mv.clientY).find(x => x.classList && x.classList.contains('ecx-col')); if (under) ni = +under.dataset.d;
        el.style.transform = `translateX(${colAt(ni).getBoundingClientRect().left - colAt(i0).getBoundingClientRect().left}px)`; el.style.top = at(nh); $('span', el).textContent = `${m.kind}, ${tm(nh)}`; };
      el.onpointerup = el.onpointercancel = () => { el.onpointermove = el.onpointerup = el.onpointercancel = null; if (!moved){ openCalPop(el); return; }
        el.classList.remove('drag'); el.style.transform = '';
        const was = [m.day, m.h], day = mon() + ni; if (was[0] === day && was[1] === nh){ renderCal(); return; }
        m.day = day; m.h = nh;
        if (m.fresh){ renderCal(); const e2 = $(`.ecx-e[data-m="${m.id}"]`, cgrid); if (e2) openCalPop(e2); return; }
        const c = coOf(m.co); refresh();
        swap(cmsg, `Moved ${c.n} to ${DAYN[dow(day)]} ${tm(nh)}`);
        toast('ok', `${m.kind} with ${c.n} moved`, `${fmtDW(day)}, ${tmA(nh)}${was[0] !== day ? ', was ' + fmtDW(was[0]) : ', was ' + tmA(was[1])}`, { label:'Undo', run:() => { [m.day, m.h] = was; refresh(); } });
      };
    };
  }
  // click free time to add a meeting: a dashed slot follows the pointer, and a click there opens a new meeting's card
  const ghost = html('<div class="ecx-ghost">+ New meeting</div>');
  cgrid.addEventListener('pointermove', e => { const cl = e.target.classList && e.target.classList.contains('ecx-col') ? e.target : null; if (!cl || $('.ecx-e.drag', cgrid) || e.pointerType === 'touch'){ ghost.remove(); return; }
    const h = H0 + Math.min(HN * 2 - 1, Math.floor((e.clientY - cl.getBoundingClientRect().top) / PX() * 2)) / 2; ghost.style.top = at(h); ghost._h = h; if (ghost.parentElement !== cl) cl.appendChild(ghost); });
  cgrid.addEventListener('pointerleave', () => ghost.remove());
  cgrid.addEventListener('click', e => {
    const cb = e.target.closest('.crm-clb'); if (cb && cb.dataset.co){ openSheet(cb.dataset.co, !e.detail); return; }
    if (cb && cb.dataset.day){ buildCls(+cb.dataset.day); return; }
    const sg = e.target.closest('[data-sg]'); if (sg){ const m = sg.closest('.ecx-e')._m; if (sg.dataset.sg === 'book') bookSg(m); else if (sg.dataset.sg === 'more') buildSgMenu(m); return; }
    const cl = e.target.classList && e.target.classList.contains('ecx-col') ? e.target : null; if (!cl) return;
    const h = ghost.parentElement === cl ? ghost._h : H0 + Math.min(HN * 2 - 1, Math.floor((e.clientY - cl.getBoundingClientRect().top) / PX() * 2)) / 2; ghost.remove();
    if (h + .5 > H0 + HN) return;
    if (popFor) closeCalPop();
    const c = CO.slice().sort((a, b) => (!!a.next - !!b.next) || b.value - a.value)[0];
    const m = meet({ co:c.id, deal:c.lead && c.lead.id, kind:'Call', day:mon() + +cl.dataset.d, h, dur:.5, own:c.own, fresh:true });
    renderCal(); const el = $(`.ecx-e[data-m="${m.id}"]`, cgrid); if (el){ enter(el); openCalPop(el); }
  });
  function buildCls(n){
    const p = pop('crm-p-cls');
    p.innerHTML = `<div class="ph" role="none">Closing ${fmtDW(n)}</div>` + closingOn(n).map(d => mi(`data-co="${d.co}"`, `<span>${esc(coOf(d.co).n)}</span><span class="r num">${kmoney(d.v)}</span>`, 'menuitem')).join('');
    $$('.mi', p).forEach(x => x.addEventListener('click', () => setTimeout(() => openSheet(x.dataset.co, true), 130)));
  }
  // anything outside the open card closes it; its account menu and a toast's Undo don't count
  document.addEventListener('pointerdown', e => { if (popFor && !cpop.contains(e.target) && !popFor.contains(e.target) && !e.target.closest('.crm-pop,.tst-t')) closeCalPop(); });
  cpop.addEventListener('keydown', e => { if (e.key === 'Escape' && $('.pop.open', app)) e.stopPropagation(); });

  // Plan follow-ups: a slot this week for every account quiet for more than two weeks with nothing ahead, drawn dashed with
  // Book and Skip
  function planFollowUps(){
    closeCalPop();
    const soon = workAfter(0, isWork(0) ? 0 : 1), w0 = wk;
    if (weekOf()[1] < soon) wk = 0;
    const days = [0, 1, 2, 3, 4, 5, 6].map(i => mon() + i).filter(n => isWork(n) && n >= Math.max(1, soon));
    if (!days.length){ wk++; cday = -1; return planFollowUps(); }
    if (wk !== w0) cday = -1;
    const T = CO.filter(c => c.last > 14 && (!c.next || c.next.day < 0)).sort((a, b) => b.last - a.last);
    SG = [];
    T.forEach((c, i) => { const late = c.next && c.next.day < 0 ? c.next : null, dur = late ? late.dur : .5;
      for (let k = 0; k < days.length; k++){ const day = days[(i + k) % days.length], h = freeAt(c.own, day, 9 + (i % 4), dur, SG.map(x => ({ ...x, own:c.own })));
        if (h != null){ SG.push({ id:'s' + c.id, co:c.id, deal:c.lead && c.lead.id, own:c.own, day, h, dur, vd:Math.max(1, dur), kind:late ? late.kind : 'Follow-up call', sug:true }); break; } } });
    plan.disabled = true; $('span', plan).innerHTML = '';
    plan.insertAdjacentHTML('afterbegin', '<span class="think on"><i></i><i></i><i></i><i></i></span>'); $('.i', plan).style.display = 'none'; $('span:last-child', plan).textContent = `Checking ${plural(new Set(T.map(c => c.own)).size, 'calendar')}`;
    const done = () => { $('.think', plan)?.remove(); $('.i', plan).style.display = ''; $('span', plan).textContent = 'Plan follow-ups'; plan.disabled = false;
      renderCal(); swap(cmsg, SG.length ? `${plural(SG.length, 'slot')} for accounts quiet 14+ days` : 'Every quiet account has a step booked');
      const f = SG[0]; if (f) showDay(f.day - mon()); const b = $('.ecx-e.sug [data-sg="book"]', cgrid); if (b && document.activeElement === plan) b.focus({ preventScroll:true }); };
    if (REDUCE) return done();
    renderCal(); const sc = $('.ecx-scan', cgrid); sc.classList.remove('go'); void sc.offsetWidth; sc.classList.add('go'); sc.addEventListener('animationend', () => sc.classList.remove('go'), { once:true });
    setTimeout(done, 1200);
  }
  plan.onclick = planFollowUps;
  // booking a slot for an account whose step is overdue moves that step there; otherwise it books a follow-up call
  function bookSg(s){
    const c = coOf(s.co); SG = SG.filter(x => x !== s);
    const late = c.next && c.next.day < 0 ? c.next : null, was = late && [late.day, late.h, late.dur];
    const m = late || meet({ co:s.co, deal:s.deal, kind:s.kind, day:s.day, h:s.h, dur:s.dur, own:s.own, by:'agent' });
    if (late){ m.day = s.day; m.h = s.h; }
    refresh(); swap(cmsg, SG.length ? `Booked ${c.n}. ${plural(SG.length, 'slot')} left` : `Booked ${c.n}. All slots handled`);
    toast('ok', late ? `${m.kind} with ${c.n} moved` : `Follow-up call booked with ${c.n}`, `${fmtDW(m.day)}, ${tmA(m.h)}, on ${first(m.own)}'s calendar${late ? ', was due ' + fmtD(was[0]) : ''}`, { label:'Undo', run:() => { if (late) [m.day, m.h] = was; else MT = MT.filter(x => x !== m); SG.push(s); refresh(); } });
    const el = $(`.ecx-e[data-m="${m.id}"]`, cgrid); if (el) enter(el);
    const nb = $('.ecx-e.sug [data-sg="book"]', cgrid); if (nb && ecx.contains(document.activeElement) === false) return; if (nb) nb.focus({ preventScroll:true });
  }
  // a proposed slot's menu: Book, Skip, or the account
  function buildSgMenu(sl){
    const p = pop('crm-p-sg'), c = coOf(sl.co);
    p.innerHTML = `<div class="ph" role="none">${esc(c.n)}, ${fmtDW(sl.day)} ${tmA(sl.h)}</div>` + mi('data-s="book"', `${I('check', 's')}<span>Book this slot</span>`, 'menuitem') + mi('data-s="skip"', `${I('x', 's')}<span>Skip</span>`, 'menuitem') + mi('data-s="open"', `${I('panel', 's')}<span>Open ${esc(c.n)}</span>`, 'menuitem');
    $$('.mi', p).forEach(x => x.addEventListener('click', () => { const a = x.dataset.s; setTimeout(() => a === 'book' ? bookSg(sl) : a === 'skip' ? skipSg(sl) : openSheet(sl.co, true), 130); }));
  }
  function skipSg(s){ SG = SG.filter(x => x !== s); renderCal(); swap(cmsg, SG.length ? `Skipped ${coOf(s.co).n}. ${plural(SG.length, 'slot')} left` : 'All slots handled'); const nb = $('.ecx-e.sug [data-sg="book"]', cgrid); if (nb) nb.focus({ preventScroll:true }); }

  /* ---------- Pipeline: the Kanban board ---------- */
  const kb = $('.crm-kb', app), cols = $('.kbx-cols', kb), live = $('.kbx-sr', kb), kq = $('.kbx-hd .kbx-q input', kb), kqx = $('.kbx-hd .kbx-qx', kb);
  const say = t => { live.textContent = ''; setTimeout(() => live.textContent = t, 40); };
  // the board's filters (owner, 10 Nov): the same Filter menu as Accounts, with a deal's own fields: when it closes, its
  // amount, its win chance, its priority and its account. The owners' faces and the search sit beside it, as on Accounts
  const DFL = {
    close:{ l:'Close date', ic:'cal', ops:['is', 'is not'], o:() => [{ v:'week', l:'This week' }, { v:'month', l:'This month' }, { v:'quarter', l:'This quarter' }, { v:'late', l:'Date passed' }],
      test:(d, v) => v === 'late' ? slipping(d) : !closed(d) && d.close >= 0 && d.close <= (v === 'week' ? 7 : v === 'month' ? eom : eoq) },
    amt:{ l:'Amount', ic:'dollar', ops:['over', 'up to'], o:() => [50000, 100000, 250000].map(v => ({ v, l:kmoney(v) })), test:(d, v) => d.v > v },
    win:{ l:'Win chance', ic:'gauge', ops:['is', 'is not'], o:() => [{ v:'hi', l:'Over 60%' }, { v:'mid', l:'25 to 60%' }, { v:'lo', l:'Under 25%' }],
      test:(d, v) => v === 'hi' ? d.p > 60 : v === 'lo' ? d.p < 25 : d.p >= 25 && d.p <= 60 },
    pri:{ l:'Priority', ic:'flag', ops:['is', 'is not'], o:() => ['High', 'Medium', 'Low'].map(v => ({ v, l:v })), test:(d, v) => prioOf(d)[0] === v },
    acct:{ l:'Account', ic:'globe', ops:['is', 'is not'], o:() => CO.filter(c => DE.some(d => d.co === c.id)).sort((a, b) => a.n.localeCompare(b.n)).map(c => ({ v:c.id, l:c.n, g:`<span class="pfm-lg xs" aria-hidden="true">${esc(c.n[0])}</span>` })), test:(d, v) => d.co === v },
  };
  // the columns' totals (owner, 10 Nov): one calculation for every column, picked from any column's foot, as Attio does; the
  // list view's summary row shows the same one under Value
  const KCALC = { sum:['Sum', L => kmoney(sum(L, d => d.v))], wtd:['Weighted', L => kmoney(sum(L, d => d.v * d.p / 100))],
    avg:['Average', L => kmoney(L.length ? sum(L, d => d.v) / L.length : 0)],
    med:['Median', L => { const b = L.map(d => d.v).sort((x, y) => x - y), m = b.length >> 1; return kmoney(b.length ? (b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2) : 0); }],
    cnt:['Count', L => String(L.length)] };
  let kCalc = 'sum';
  function buildKCalc(){
    const p = $('#crm-p-calc', app), all = DE.filter(d => !K.shut.has(d.st) && dshows(d));
    p.innerHTML = `<div class="ph" role="none">Column totals</div>` + Object.entries(KCALC).map(([id, [l, f]]) => mi(`data-c="${id}"`, `<span>${l}</span><span class="r num">${f(all)}</span>`, 'menuitemradio', kCalc === id)).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { kCalc = m.dataset.c; renderBoard(); }));
  }
  kb.addEventListener('click', e => { if (e.target.closest('.crm-cfb')) buildKCalc(); }, true);
  // Sort for the board (owner, 10 Nov): the same rules as Accounts' Sort, any number, in order, each with its direction;
  // they order the cards inside every column. Close date, soonest first, is the board's own order and has no remove button
  const KSORTS = { close:['Close date', d => d.close, 'cal', 'Soonest first', 'Latest first'], amt:['Amount', d => d.v, 'dollar', 'Low to high', 'High to low'],
    win:['Win chance', d => d.p, 'gauge', 'Low to high', 'High to low'], pri:['Priority', d => ({ High:0, Medium:1, Low:2 })[prioOf(d)[0]], 'flag', 'High first', 'Low first'],
    acct:['Account', d => coOf(d.co).n.toLowerCase(), 'globe', 'A to Z', 'Z to A'], name:['Deal', d => d.n.toLowerCase(), 'coins', 'A to Z', 'Z to A'] };
  const KASC = ['close', 'pri', 'acct', 'name'], kcmp = (x, y) => x > y ? 1 : x < y ? -1 : 0;
  const kDefault = () => K.S.length === 1 && K.S[0].k === 'close' && !K.S[0].desc;
  const kSorted = (L, closedCol) => kDefault() ? L.sort((a, b) => (closedCol ? b.close - a.close : a.close - b.close) || b.v - a.v)
    : L.sort((a, b) => { for (const r of K.S){ const f = KSORTS[r.k][1], x = kcmp(f(a), f(b)) * (r.desc ? -1 : 1); if (x) return x; } return b.v - a.v; });
  const ksp = $('#crm-p-ksort', app), kSoon = focus => setTimeout(() => paintKSort(focus));
  const kSortLabel = () => KSORTS[K.S[0].k][0] + (K.S.length > 1 ? ` +${K.S.length - 1}` : '');
  function paintKSort(focus){
    const rest = Object.keys(KSORTS).filter(k => !K.S.some(r => r.k === k)), one = K.S.length === 1, dflt = kDefault();
    ksp.innerHTML = `<div class="ph" role="none">Sort cards by</div><div class="crm-srl" role="list">` + K.S.map((r, i) => { const S = KSORTS[r.k];
      return `<div class="crm-srw" role="listitem" data-i="${i}">`
        + `<button class="crm-srg" data-a="grip" aria-label="Move ${S[0]}${one ? '' : ', Alt and an arrow key'}" tabindex="${one ? -1 : 0}"${one ? ' disabled' : ''}>${I('grip', 'xs')}</button>`
        + `<span class="crm-srf">${I(S[2], 'xs')}<span>${i ? 'then ' : ''}${S[0]}</span></span>`
        + `<button class="crm-srd" data-a="dir" aria-label="${S[0]}: ${r.desc ? S[4] : S[3]}. Switch the order">${I(r.desc ? 'down' : 'up', 'xs')}<span>${r.desc ? S[4] : S[3]}</span></button>`
        + (dflt ? '' : `<button class="crm-srx" data-a="rm" aria-label="${one ? `Stop sorting by ${S[0]}, back to close date` : `Stop sorting by ${S[0]}`}" data-tip="${one ? 'Back to close date' : 'Remove'}">${I('x', 'xs')}</button>`) + `</div>`; }).join('') + `</div>`
      + (rest.length ? `<div class="sep" role="separator"></div><div class="ph" role="none">Then by</div>` + rest.map(k => `<button class="mi" data-add="${k}">${I(KSORTS[k][2])}<span>${KSORTS[k][0]}</span>${I('plus', 'xs')}</button>`).join('') : '');
    swap($('.crm-ksort .v', kb), kSortLabel());
    if (focus){ const m = $(focus, ksp); if (m) m.focus({ preventScroll:true }); }
  }
  const kMove = (i, j) => { if (j < 0 || j >= K.S.length || i === j) return; const [r] = K.S.splice(i, 1); K.S.splice(j, 0, r); };
  const kResort = () => { flipCards(renderBoard); swap($('.crm-ksort .v', kb), kSortLabel()); $('.crm-ksort', kb).classList.toggle('on', !kDefault()); };
  $('.crm-ksort', kb).addEventListener('click', () => paintKSort());
  ksp.addEventListener('click', e => {
    const add = e.target.closest('[data-add]'), b = e.target.closest('[data-a]');
    if (add){ const k = add.dataset.add; K.S.push({ k, desc:!KASC.includes(k) }); kResort(); kSoon(`.crm-srw[data-i="${K.S.length - 1}"] .crm-srd`); return; }
    if (!b || b.disabled) return; const i = +b.closest('.crm-srw').dataset.i;
    if (b.dataset.a === 'dir'){ K.S[i].desc = !K.S[i].desc; kResort(); kSoon(`.crm-srw[data-i="${i}"] .crm-srd`); }
    else if (b.dataset.a === 'rm'){ K.S.splice(i, 1); if (!K.S.length) K.S = [{ k:'close', desc:false }]; hideTip(); kResort(); kSoon(`.crm-srw[data-i="${Math.min(i, K.S.length - 1)}"] .crm-srd`); }
  });
  ksp.addEventListener('keydown', e => { const g = e.target.closest('.crm-srg'); if (!g || !e.altKey || !/^Arrow(Up|Down)$/.test(e.key)) return;
    e.preventDefault(); e.stopPropagation(); const i = +g.closest('.crm-srw').dataset.i, j = i + (e.key === 'ArrowUp' ? -1 : 1); if (j < 0 || j >= K.S.length) return;
    kMove(i, j); kResort(); kSoon(`.crm-srw[data-i="${j}"] .crm-srg`); });
  ksp.addEventListener('pointerdown', e => { const g = e.target.closest('.crm-srg'); if (!g || g.disabled || e.button) return;
    e.preventDefault(); const row = g.closest('.crm-srw'), rws = $$('.crm-srw', row.parentElement), from = +row.dataset.i, y0 = e.clientY, H = row.offsetHeight;
    let to = from; row.classList.add('drag'); g.setPointerCapture(e.pointerId);
    const mv = ev => { const dy = ev.clientY - y0; row.style.transform = `translateY(${dy}px)`; to = clamp(from + Math.round(dy / H), 0, rws.length - 1);
      rws.forEach((r, k) => { if (r === row) return; r.style.transform = k > from && k <= to ? `translateY(${-H}px)` : k < from && k >= to ? `translateY(${H}px)` : ''; }); };
    const up = () => { g.removeEventListener('pointermove', mv); g.removeEventListener('pointerup', up); g.removeEventListener('pointercancel', up);
      kMove(from, to); kResort(); kSoon(`.crm-srw[data-i="${to}"] .crm-srg`); };
    g.addEventListener('pointermove', mv); g.addEventListener('pointerup', up); g.addEventListener('pointercancel', up); });
  const dval = (k, v) => DFL[k].o().find(o => o.v === v);
  const dpass = (d, skip) => K.A.every(f => f.k === skip || DFL[f.k].test(d, f.v) !== f.neg);
  const dshows = (d, skip) => (!K.own.size || K.own.has(d.own)) && (!K.q || (d.n + ' ' + coOf(d.co).n + ' ' + d.id).toLowerCase().includes(K.q.toLowerCase())) && dpass(d, skip);
  $('.kbx-fp', kb).innerHTML = OWN.map(o => `<button aria-pressed="false" data-who="${o}" aria-label="${P[o][0]}" data-tip="${P[o][0]}">${av(o)}</button>`).join('');
  $('.kbx-tabs', kb).innerHTML = STAGES.map(s => `<button aria-pressed="${s.k === K.tab}" data-v="${s.k}">${s.k === 'won' ? 'Won' : s.k === 'lost' ? 'Lost' : s.t}<span class="n num"></span></button>`).join('');
  seg($('.kbx-tabs', kb), v => { K.tab = v; renderBoard(); });
  seg($('.kbx-vw', kb), v => { K.view = v; kb.classList.toggle('list', v === 'list'); renderBoard(); });
  cols.innerHTML = STAGES.map(s => `<div class="kbx-c" data-col="${s.k}" role="group" aria-label="${s.t}"><div class="kbx-ch"><span class="crm-sd" data-s="${s.k}" aria-hidden="true"></span><b>${s.t}</b><span class="tag crm-cnt num" aria-label="0 deals">0</span><span class="kbx-sp"></span>`
    + `<button class="ib crm-grip" aria-label="Move the ${s.t} column: drag it, or use the left and right arrows" data-tip="Drag, or press ← →" aria-keyshortcuts="ArrowLeft ArrowRight">${I('grip', 'xs')}</button>`
    + `<button class="ib kbx-cmn crm-cmn" data-pop="#crm-p-colm" data-pop-align="end" aria-haspopup="menu" aria-label="${s.t} actions" data-tip="Column actions">${I('more', 'xs')}</button>`
    + (closed({ st:s.k }) ? '' : `<button class="ib kbx-cadd crm-cadd" aria-label="Add a deal to ${s.t}" data-tip="Add deal">${I('plus', 'xs')}</button>`) + '</div>'
    + `<div class="kbx-list" role="list" aria-label="${s.t}"></div><div class="crm-cft"><button class="crm-cfb" data-col="${s.k}" data-pop="#crm-p-calc" data-pop-pos="up" aria-haspopup="menu"><span class="l">Sum</span><b class="num">$0</b></button></div></div>`).join('');
  const colOf = k => $(`.kbx-c[data-col="${k}"]`, cols);
  const whenOf = d => d.st === 'won' ? 'Won ' + fmtD(d.close) : d.st === 'lost' ? 'Lost ' + fmtD(d.close) : fmtD(d.close);
  // the list: one row per deal, in the columns of the list's header
  const listRow = d => { const c = coOf(d.co), late = slipping(d);
    return `<div class="kbx-k crm-lr${d.st === 'won' ? ' won' : ''}${d.st === 'lost' ? ' lost' : ''}${sheetFor === d.co ? ' open' : ''}" data-id="${d.id}" role="listitem" tabindex="-1" aria-label="${esc(d.n)}, ${esc(c.n)}, ${money(d.v)}, ${ST[d.st].t}${late ? ', past its close date' : ''}">`
      + `<span class="kbx-id num">${d.id}</span><span class="t">${esc(d.n)}</span><span class="co"><span class="pfm-lg xs" aria-hidden="true">${esc(c.n[0])}</span><span>${esc(c.n)}</span></span>`
      + `<span class="ow">${av(d.own)}<span>${esc(first(d.own))}</span></span><span class="cl num${late ? ' late' : ''}">${whenOf(d)}</span><span class="pr num">${closed(d) ? '' : d.p + '%'}</span><span class="v num">${money(d.v)}</span>`
      + `<button class="kbx-mv" data-pop="#crm-p-mv" data-pop-align="end" aria-haspopup="menu" aria-label="Move ${esc(d.n)}" data-tip="Move to" tabindex="-1">${I('more', 'xs')}</button></div>`; };
  const card = d => { const c = coOf(d.co), late = slipping(d);
    if (K.view === 'list') return listRow(d);
    return `<div class="kbx-k${d.st === 'won' ? ' won' : ''}${d.st === 'lost' ? ' lost' : ''}${sheetFor === d.co ? ' open' : ''}" data-id="${d.id}" role="listitem" tabindex="-1" aria-label="${esc(d.n)}, ${esc(c.n)}, ${money(d.v)}, ${ST[d.st].t}${late ? ', past its close date' : ''}">`
      + `<div class="kbx-k1"><span class="kbx-id num">${d.id}</span><span class="kbx-sp"></span><span class="kbx-who" data-tip="${P[d.own][0]}">${av(d.own)}</span><button class="kbx-mv" data-pop="#crm-p-mv" data-pop-align="end" aria-haspopup="menu" aria-label="Move ${esc(d.n)}" data-tip="Move to" tabindex="-1">${I('more', 'xs')}</button></div>`
      // the chips: its priority (open deals) and its account, side by side, the way Kanban board pairs a priority and a project
      + `<div class="kbx-tags crm-pri">${closed(d) ? '' : (pr => `<span class="tag ${pr[1]}">${pr[0]}</span>`)(prioOf(d))}<span class="crm-kacc"><span class="pfm-lg xs" aria-hidden="true">${esc(c.n[0])}</span><span class="crm-kan">${esc(c.n)}</span></span></div>`
      + `<div class="t">${esc(d.n)}</div>`
      + `<div class="kbx-m"><span class="kbx-mt v num">${money(d.v)}</span>`
      + `<span class="kbx-mt num${late ? ' late' : ''}">${I(late ? 'alert' : 'cal', 'xs')}${whenOf(d)}</span>${closed(d) ? '' : `<span class="kbx-mt num">${d.p}%</span>`}</div>${d.st === 'lost' && d.why ? `<div class="crm-why">${esc(d.why)}</div>` : ''}</div>`; };
  // the + puts a draft at the top of its column: write the deal's name, pick the account (the one touched last by default),
  // Enter or Add adds it with Undo, Escape or Cancel drops it
  const draftCard = () => { const dr = K.draft, c = coOf(dr.co);
    return `<div class="kbx-k crm-draft" role="listitem"><div class="t" contenteditable="true" role="textbox" aria-label="New deal's name" data-ph="Deal name">${esc(dr.name)}</div>`
      + `<div class="crm-drw"><button class="dtp-v crm-dacc" data-pop="#crm-p-acc" aria-haspopup="menu" aria-label="Account: ${esc(c.n)}. Change it"><span class="pfm-lg xs" aria-hidden="true">${esc(c.n[0])}</span><span>${esc(c.n)}</span>${I('chev-d', 'xs')}</button><span class="kbx-sp"></span>`
      + `<button class="pill ghost sm" data-dr="no">Cancel</button><button class="pill primary sm" data-dr="ok">Add</button></div></div>`; };
  // a deal's priority, as Kanban board's chips show it: High for a large, slipping or soon-closing deal, Medium for a sizeable
  // or likely one, Low for the rest; the core tag colours (orange, yellow, blue) as the component uses them
  const prioOf = d => d.v >= 200000 || slipping(d) || (d.close <= 14 && d.p >= 50) ? ['High', 'p'] : d.v >= 60000 || d.p >= 40 ? ['Medium', 'y'] : ['Low', 'b'];
  function startDraft(k){
    if (K.draft && K.draft.k === k){ focusDraft(); return; }
    const co = (sheetFor && coOf(sheetFor)) || CO.slice().sort((a, b) => a.last - b.last || b.value - a.value)[0];
    K.draft = { k, co:co.id, name:'' }; renderBoard(); const el = $('.crm-draft', cols); if (el) enter(el); focusDraft();
  }
  const focusDraft = () => { const t = $('.crm-draft .t', cols); if (!t) return; t.focus({ preventScroll:true }); const r = document.createRange(); r.selectNodeContents(t); r.collapse(false); const sl = getSelection(); sl.removeAllRanges(); sl.addRange(r); t.closest('.kbx-k').scrollIntoView({ block:'nearest' }); };
  function dropDraft(){ const k = K.draft && K.draft.k; K.draft = null; renderBoard(); const b = k && $('.crm-cadd', colOf(k)); if (b) b.focus({ preventScroll:true }); }
  function saveDraft(){
    const dr = K.draft; if (!dr) return; const name = dr.name.trim(); if (!name){ focusDraft(); swap($('.kbx-sr', kb), 'Give the deal a name first'); return; }
    const c = coOf(dr.co), d = { id:'DL-' + (did++), co:c.id, n:name, st:dr.k, v:25000, close:toWork(30), adj:0, own:c.own }; d.p = probOf(d); DE.push(d);
    K.draft = null; kFocus = d.id; refresh(); say(`${name} added to ${ST[dr.k].t}`);
    const el = $(`.kbx-k[data-id="${d.id}"]`, cols); if (el){ enter(el); $$('.kbx-k', cols).forEach(x => x.tabIndex = -1); el.tabIndex = 0; el.focus({ preventScroll:true }); }
    toast('ok', `${name} added to ${ST[dr.k].t}`, `${c.n}, ${money(d.v)}, closes ${fmtD(d.close)}`, { label:'Undo', run:() => { DE = DE.filter(x => x !== d); refresh(); } });
  }
  cols.addEventListener('input', e => { if (e.target.closest('.crm-draft .t') && K.draft) K.draft.name = e.target.textContent; });
  cols.addEventListener('keydown', e => { if (!e.target.closest('.crm-draft')) return;
    if (e.key === 'Enter' && e.target.closest('.t')){ e.preventDefault(); saveDraft(); }
    else if (e.key === 'Escape' && !$('.pop.open', app)){ e.preventDefault(); e.stopPropagation(); dropDraft(); } }, true);
  // the draft's account: the same Account menu as a new meeting's
  function buildDraftAcc(){
    const p = pop('crm-p-acc'), L = CO.slice().sort((a, b) => a.n.localeCompare(b.n));
    p.innerHTML = `<div class="ph" role="none">Account</div>` + L.map(c => mi(`data-co="${c.id}"`, `<span class="pfm-lg xs" aria-hidden="true">${esc(c.n[0])}</span><span>${esc(c.n)}</span>`, 'menuitemradio', K.draft.co === c.id)).join('');
    $$('.mi', p).forEach(x => x.addEventListener('click', () => { if (!K.draft) return; K.draft.co = x.dataset.co; const b = $('.crm-dacc', cols), c = coOf(x.dataset.co);
      if (b){ $('span:not(.pfm-lg)', b).textContent = c.n; $('.pfm-lg', b).textContent = c.n[0]; b.setAttribute('aria-label', `Account: ${c.n}. Change it`); } setTimeout(focusDraft, 140); }));
  }

  // moving a column: by the menu, the grip's arrow keys, or a drag (below). The others glide to their new places
  const visCols = () => STAGES.filter(s => !K.shut.has(s.k)).map(s => s.k).sort((a, b) => K.order.indexOf(a) - K.order.indexOf(b));
  // the board's filters (owners, search, close date): cards that stay glide to their new places, cards that come back fade up
  function flipCards(fn){
    if (REDUCE){ fn(); return; }
    const before = new Map($$('.kbx-k[data-id]', cols).filter(k => k.offsetParent).map(k => { const r = k.getBoundingClientRect(); return [k.dataset.id, [r.left, r.top]]; }));
    fn(); const vb = cols.getBoundingClientRect(); let n = 0;
    $$('.kbx-k[data-id]', cols).forEach(k => { if (!k.offsetParent) return; const r = k.getBoundingClientRect(); if (r.bottom < vb.top || r.top > innerHeight) return; const b = before.get(k.dataset.id);
      if (!b) k.animate([{ opacity:0, transform:'translateY(6px)' }, { opacity:1, transform:'none' }], { duration:240, delay:Math.min(n++, 8) * 18, easing:EASE, fill:'backwards' });
      else { const dx = b[0] - r.left, dy = b[1] - r.top; if (Math.abs(dx) > 1 || Math.abs(dy) > 1) k.animate([{ transform:`translate(${dx}px,${dy}px)` }, { transform:'none' }], { duration:320, easing:EASE }); } });
  }
  function flip(fn){
    const els = $$('.kbx-c', cols).filter(c => c.offsetParent), before = new Map(els.map(c => [c, c.getBoundingClientRect().left]));
    fn();
    if (REDUCE) return;
    els.forEach(c => { const dx = before.get(c) - c.getBoundingClientRect().left; if (Math.abs(dx) > 1) c.animate([{ transform:`translateX(${dx}px)` }, { transform:'none' }], { duration:280, easing:EASE }); });
  }
  function moveCol(k, dir, focus){
    const v = visCols(), i = v.indexOf(k), j = i + dir; if (i < 0 || j < 0 || j >= v.length) { say(`${ST[k].t} is already ${dir < 0 ? 'first' : 'last'}`); return; }
    const o = K.order.filter(x => x !== k), at = o.indexOf(v[j]); o.splice(dir > 0 ? at + 1 : at, 0, k);
    flip(() => { K.order = o; saveOrder(); renderBoard(); });
    say(`${ST[k].t} moved to position ${j + 1} of ${v.length}`);
    if (focus) $(`.${focus}`, colOf(k))?.focus({ preventScroll:true });
  }

  let kFocus = null;
  function renderBoard(){
    const filtering = K.own.size || K.q || K.A.length;
    const vis = DE.filter(d => !K.shut.has(d.st) && dshows(d)), vo = vis.filter(d => !closed(d)), vw = vis.filter(d => d.st === 'won'), vl = vis.filter(d => d.st === 'lost');
    K.sum = [`${vo.length} open · ${kmoney(sum(vo, d => d.v))}`, vw.length && `${vw.length} won`, vl.length && `${vl.length} lost`].filter(Boolean).join(' · ');
    $('.crm-kbsum', kb).textContent = K.sum;
    // the list's column headers, once, over the stage groups
    $('.crm-lhd', kb).hidden = K.view !== 'list';
    let shown = 0;
    STAGES.forEach(s => {
      const col = $(`.kbx-c[data-col="${s.k}"]`, cols), L = kSorted(DE.filter(d => d.st === s.k && dshows(d)), closed({ st:s.k }));
      if (!K.shut.has(s.k)) shown += L.length;
      $('.kbx-list', col).innerHTML = (K.draft && K.draft.k === s.k && K.view !== 'list' ? draftCard() : '') + (L.map(card).join('') || (filtering ? '' : '<div class="kbx-none">No deals</div>'));
      const cn = $('.crm-cnt', col); cn.textContent = L.length; cn.setAttribute('aria-label', plural(L.length, 'deal')); const kc = KCALC[kCalc]; $('.crm-cfb', col).innerHTML = `<span class="l">${kc[0]}</span><b class="num">${kc[1](L)}</b>`; $('.crm-cfb', col).setAttribute('aria-label', `${s.t}: ${kc[0].toLowerCase()} ${kc[1](L)}. Change the calculation`);
      col.classList.toggle('gone', K.shut.has(s.k)); col.classList.toggle('on', K.tab === s.k); col._sum = [L.length, kmoney(sum(L, d => d.v))];
      $(`.kbx-tabs [data-v="${s.k}"] .n`, kb).textContent = L.length;
    });
    // the columns (and the phone's stage tabs) stand in the session's order
    K.order.forEach(k => { const c = colOf(k); if (c && cols.lastElementChild !== c) cols.appendChild(c); const t = $(`.kbx-tabs [data-v="${k}"]`, kb); if (t) t.parentElement.appendChild(t); });
    // a hidden stage leaves the board for a chip by the filters: press the chip to bring the column back, or drop a card on it
    cols.style.setProperty('--dm-kbx-gt', STAGES.filter(s => !K.shut.has(s.k)).map(() => 'minmax(232px,1fr)').join(' ') || 'minmax(0,1fr)');
    const hid = STAGES.filter(s => K.shut.has(s.k)), dock = $('.crm-dock', kb), had = new Set($$('.crm-dk', dock).map(b => b.dataset.col));
    dock.hidden = !hid.length;
    $('.crm-dks', dock).innerHTML = hid.map(s => { const [n, v] = $(`.kbx-c[data-col="${s.k}"]`, cols)._sum;
      return `<button class="chip sm crm-dk" data-col="${s.k}" aria-label="Show ${s.t}, ${plural(n, 'deal')}, ${v}" data-tip="Show column, or drop a deal here"><span class="v">${s.t}</span><span class="k num">${n} · ${v}</span>${I('plus', 'xs')}</button>`; }).join('');
    $$('.crm-dk', dock).forEach(b => { if (!had.has(b.dataset.col)) enter(b); });
    // every stage hidden: say so, how much it hides, and offer them all back; filters that leave the board empty say whether
    // matching deals sit in hidden stages
    const allHid = K.shut.size === STAGES.length, ah = $('.crm-allhid', kb);
    ah.hidden = !allHid; if (allHid) $('.crm-ahn', ah).textContent = `That hides ${plural(DE.length, 'deal')}. Show them all, or pick a stage above.`;
    const inHid = DE.filter(d => K.shut.has(d.st) && dshows(d)).length;
    $('.kbx-em', kb).hidden = allHid || shown > 0 || !filtering;
    $('.kbx-em .crm-emn', kb).textContent = inHid ? `${plural(inHid, 'matching deal')} ${inHid === 1 ? 'sits' : 'sit'} in hidden stages.` : 'Try another owner, filter or search.';
    const onBoard = DE.filter(d => !K.shut.has(d.st)).length;
    $$('.kbx-fp button', kb).forEach(b => b.setAttribute('aria-pressed', K.own.has(b.dataset.who)));
    $('.kbx-fp', kb).classList.toggle('some', K.own.size > 0);
    kchips();
    // the list's summary row: what is in view, under the columns it sums up
    const ls = $('.crm-lsum', kb); ls.hidden = K.view !== 'list';
    if (K.view === 'list'){ const L = vis, up = L.filter(d => !closed(d) && d.close >= 0).sort((a, b) => a.close - b.close)[0], kc = KCALC[kCalc];
      ls.innerHTML = `<span></span><span class="t"><b class="num">${L.length}</b> ${L.length === 1 ? 'deal' : 'deals'}</span><span class="co"><b class="num">${new Set(L.map(d => d.co)).size}</b> accounts</span>`
        + `<span class="ow"><b class="num">${new Set(L.map(d => d.own)).size}</b> owners</span><span class="cl">${up ? `Next <b>${fmtD(up.close)}</b>` : ''}</span>`
        + `<span class="v"><button class="crm-cfb" data-pop="#crm-p-calc" data-pop-pos="up" aria-haspopup="menu" data-tip="Average win chance ${L.length ? Math.round(sum(L, d => d.p) / L.length) : 0}%" aria-label="${kc[0]} of the deals in view, ${kc[1](L)}. Change the calculation"><span class="l">${kc[0]}</span><b class="num">${kc[1](L)}</b></button></span>`; }
    $('.kbx-clr', kb).hidden = !filtering;
    const ks = $$('.kbx-k', cols), keep = ks.find(k => k.dataset.id === kFocus) || ks[0]; if (keep) keep.tabIndex = 0;
    if (view === 'pipeline') counts();
  }
  $('.crm-dock', kb).addEventListener('click', e => { const b = e.target.closest('.crm-dk'); if (!b || dragged) return; const k = b.dataset.col; K.shut.delete(k); renderBoard();
    const col = $(`.kbx-c[data-col="${k}"]`, cols); enter(col); col.scrollIntoView({ block:'nearest', inline:'nearest', behavior:REDUCE ? 'auto' : 'smooth' });
    swap($('.kbx-sr', kb), `${ST[k].t} shown`); const h = $('.crm-cmn', col); if (h) h.focus({ preventScroll:true }); });
  $('.kbx-fp', kb).addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; K.own.has(b.dataset.who) ? K.own.delete(b.dataset.who) : K.own.add(b.dataset.who); flipCards(renderBoard); });
  kq.addEventListener('input', () => { K.q = kq.value.trim(); kqx.hidden = !kq.value; flipCards(renderBoard); });
  kqx.onclick = () => { kq.value = ''; K.q = ''; kqx.hidden = true; flipCards(renderBoard); kq.focus(); };
  const clearBoard = () => { K.own.clear(); K.q = ''; K.A = []; kq.value = ''; kqx.hidden = true; flipCards(renderBoard); };
  $('.kbx-clr', kb).onclick = clearBoard; $('.crm-kbclr', kb).onclick = clearBoard;
  // the board's Filter menu: two steps, the fields and then the values of the one picked, each with how many deals it leaves
  const kfp = $('#crm-p-kflt', app), kfch = $('.crm-kfch', kb);
  function kstep(k, focus){
    if (!k){
      kfp.setAttribute('aria-label', 'Filter by');
      kfp.innerHTML = `<div class="ph" role="none">Filter by</div>` + Object.entries(DFL).map(([key, f]) => { const a = K.A.find(x => x.k === key), o = a && dval(key, a.v);
        return `<button class="mi" role="menuitem" aria-haspopup="menu" tabindex="-1" data-k="${key}">${I(f.ic)}<span>${f.l}</span><span class="r">${o ? `<i class="crm-fon" role="img" aria-label="In use: ${esc(f.ops[+a.neg] + ' ' + o.l)}"></i>` : ''}</span>${I('chev-r', 'xs')}</button>`; }).join('');
    } else {
      const f = DFL[k], on = K.A.find(x => x.k === k), base = DE.filter(d => !K.shut.has(d.st) && dshows(d, k));
      kfp.setAttribute('aria-label', f.l);
      kfp.innerHTML = `<button class="mi flm-bk" role="menuitem" tabindex="-1" aria-label="Back to all fields">${I('chev-l', 'xs')}<span>${f.l}</span></button><div class="sep" role="separator"></div>`
        + f.o().map(o => `<button class="mi" role="menuitemradio" aria-checked="${!!on && on.v === o.v}" tabindex="-1" data-close data-v="${o.v}">${o.g || ''}<span>${esc(o.l)}</span><span class="r num">${base.filter(d => f.test(d, o.v)).length}</span><span class="ck">${I('check', 'xs')}</span></button>`).join('');
    }
    if (kfp.dataset.k !== (k || '')) glide(kfp, { transform:`translateX(${k ? 8 : -8}px)` }, 220);
    kfp.dataset.k = k || '';
    if (focus) setTimeout(() => { const m = k ? ($('.mi[aria-checked="true"]', kfp) || $$('.mi', kfp)[1]) : ($(`.mi[data-k="${focus}"]`, kfp) || $('.mi', kfp)); if (m) m.focus({ preventScroll:true }); });
  }
  $('.crm-kftr', kb).addEventListener('click', () => kstep(null));
  kfp.addEventListener('click', e => {
    const m = e.target.closest('.mi'); if (!m) return; const kbd = !e.detail;
    if (m.classList.contains('flm-bk') || m.dataset.k) e.stopPropagation();
    if (m.classList.contains('flm-bk')){ const from = kfp.dataset.k; kstep(null, kbd || kfp.contains(document.activeElement) ? from : null); return; }
    if (m.dataset.k){ kstep(m.dataset.k, kbd || kfp.contains(document.activeElement)); return; }
    const k = kfp.dataset.k, v = k === 'amt' ? +m.dataset.v : m.dataset.v, f = K.A.find(x => x.k === k);
    if (f){ f.v = v; f.neg = false; } else K.A.push({ k, v, neg:false });
    $$('.mi[data-v]', kfp).forEach(x => x.setAttribute('aria-checked', x === m)); flipCards(renderBoard);
  });
  kfp.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' && !kfp.dataset.k){ const m = e.target.closest('.mi[data-k]'); if (m){ e.preventDefault(); e.stopPropagation(); kstep(m.dataset.k, true); } }
    else if (e.key === 'ArrowLeft' && kfp.dataset.k){ e.preventDefault(); e.stopPropagation(); kstep(null, kfp.dataset.k); }
  }, true);
  // the board's filters as Filter menu's chips: the field, is / is not (press to flip it), the value and a remove button
  function kchips(){
    const have = new Set(K.A.map(f => f.k));
    $$('.flm-ch', kfch).forEach(ch => { if (have.has(ch.dataset.k) || ch.classList.contains('gone')) return; chipLeave(ch); });
    K.A.forEach(f => {
      let ch = $(`.flm-ch[data-k="${f.k}"]:not(.gone)`, kfch);
      if (!ch){ ch = html(`<div class="flm-ch" role="listitem" data-k="${f.k}"><span class="k">${DFL[f.k].l}</span><button class="op"></button><span class="v"></span><button class="x">${I('x', 'xs')}</button></div>`); kfch.appendChild(ch); }
      const o = dval(f.k, f.v), op = DFL[f.k].ops[+f.neg], text = `${DFL[f.k].l} ${op} ${o.l}`;
      $('.op', ch).textContent = op; $('.v', ch).textContent = o.l;
      $('.op', ch).setAttribute('aria-label', `${text}: change to ${DFL[f.k].ops[+!f.neg]}`); $('.op', ch).dataset.tip = `Change to ${DFL[f.k].ops[+!f.neg]}`;
      $('.x', ch).setAttribute('aria-label', `Remove filter ${text}`); $('.x', ch).dataset.tip = 'Remove filter';
    });
    $('.crm-kftr', kb).classList.toggle('on', K.A.length > 0);
  }
  kfch.addEventListener('click', e => {
    const ch = e.target.closest('.flm-ch'); if (!ch) return; const k = ch.dataset.k;
    if (e.target.closest('.op')){ const f = K.A.find(x => x.k === k); f.neg = !f.neg; flipCards(renderBoard); }
    if (e.target.closest('.x')){ const had = ch.contains(document.activeElement), next = ch.nextElementSibling || ch.previousElementSibling; K.A = K.A.filter(x => x.k !== k); hideTip(); flipCards(renderBoard); if (had) ((next && $('.x', next)) || $('.crm-kftr', kb)).focus({ preventScroll:true }); }
  });
  cols.addEventListener('click', e => {
    if (dragged) return;
    const add = e.target.closest('.crm-cadd'); if (add){ startDraft(add.closest('.kbx-c').dataset.col); return; }
    const cm = e.target.closest('.crm-cmn'); if (cm){ buildColMenu(cm.closest('.kbx-c').dataset.col); return; }
    if (e.target.closest('.crm-grip')) return;
    const dr = e.target.closest('.crm-draft'); if (dr){ const b = e.target.closest('[data-dr]'); if (b) b.dataset.dr === 'ok' ? saveDraft() : dropDraft(); else if (e.target.closest('.crm-dacc')) buildDraftAcc(); return; }
    const el = e.target.closest('.kbx-k'); if (!el) return;
    kFocus = el.dataset.id;
    if (e.target.closest('.kbx-mv')){ mvFor = el.dataset.id; buildMoveMenu(); return; }
    openSheet(dealOf(el.dataset.id).co);
    $$('.kbx-k', cols).forEach(k => k.classList.toggle('open', k === el));
  });
  cols.addEventListener('keydown', e => {
    const g = e.target.closest('.crm-grip');
    if (g && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')){ e.preventDefault(); moveCol(g.closest('.kbx-c').dataset.col, e.key === 'ArrowLeft' ? -1 : 1, 'crm-grip'); return; }
    const el = e.target.closest('.kbx-k'); if (!el || e.target !== el) return;
    const ks = $$('.kbx-k', cols).filter(k => k.offsetParent), i = ks.indexOf(el);
    const go = n => { if (!n) return; e.preventDefault(); ks.forEach(k => k.tabIndex = -1); n.tabIndex = 0; kFocus = n.dataset.id; n.focus(); };
    if (e.key === 'ArrowDown') go(ks[i + 1]); else if (e.key === 'ArrowUp') go(ks[i - 1]);
    else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft'){ const c = el.closest('.kbx-c'), cs = $$('.kbx-c', cols).filter(x => x.offsetParent), n = cs[cs.indexOf(c) + (e.key === 'ArrowRight' ? 1 : -1)]; if (n) go($('.kbx-k', n)); }
    else if (e.key === 'Enter'){ e.preventDefault(); openSheet(dealOf(el.dataset.id).co, true); }
    else if (e.key === 'm' || e.key === 'M'){ e.preventDefault(); $('.kbx-mv', el).click(); }
  });
  function buildMoveMenu(){
    const d = dealOf(mvFor), p = pop('crm-p-mv'); if (!d) return;
    p.innerHTML = `<div class="ph" role="none">Move to</div>` + STAGES.map(s => mi(`data-s="${s.k}"`, pill(s.k), 'menuitemradio', d.st === s.k)).join('')
      + `<div class="sep" role="separator"></div>` + mi('data-open', `${I('panel', 's')}<span>Open ${esc(coOf(d.co).n)}</span>`, 'menuitem');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { if (m.hasAttribute('data-open')) setTimeout(() => openSheet(d.co, true), 130); else moveDeal(d, m.dataset.s); }));
  }
  // a column's menu: add a deal, move it left or right, hide it
  function hideCol(k){ K.shut.add(k); if (K.draft && K.draft.k === k) K.draft = null; renderBoard(); swap($('.kbx-sr', kb), `${ST[k].t} hidden. It waits by the filters, press it to show the column again`);
    const b = K.shut.size === STAGES.length ? $('.crm-allhid .pill', kb) : $(`.crm-dk[data-col="${k}"]`, kb); if (b) setTimeout(() => b.focus({ preventScroll:true }), 140); }
  function buildColMenu(k){
    const p = pop('crm-p-colm'), v = visCols(), i = v.indexOf(k);
    p.innerHTML = `<div class="ph" role="none">${ST[k].t}</div>` + (closed({ st:k }) ? '' : mi('data-c="add"', `${I('plus', 's')}<span>Add a deal</span>`, 'menuitem'))
      + mi(`data-c="left"${i <= 0 ? ' aria-disabled="true"' : ''}`, `${I('chev-l', 's')}<span>Move left</span>`, 'menuitem') + mi(`data-c="right"${i >= v.length - 1 ? ' aria-disabled="true"' : ''}`, `${I('chev-r', 's')}<span>Move right</span>`, 'menuitem')
      + `<div class="sep" role="separator"></div>` + mi('data-c="hide"', `${I('eye', 's')}<span>Hide column</span>`, 'menuitem');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { const c = m.dataset.c; if (m.getAttribute('aria-disabled') === 'true') return;
      setTimeout(() => c === 'add' ? startDraft(k) : c === 'hide' ? hideCol(k) : moveCol(k, c === 'left' ? -1 : 1, 'crm-cmn'), 130); }));
  }
  // every stage hidden: Show all stages brings the columns back in, with one Undo
  $('.crm-allhid .pill', kb).addEventListener('click', () => {
    const was = new Set(K.shut); K.shut.clear(); renderBoard();
    visCols().forEach((k, i) => enter(colOf(k), i * 50));
    say(`All ${STAGES.length} stages shown`); setTimeout(() => $('.crm-grip', colOf(visCols()[0]))?.focus({ preventScroll:true }), 60);
    toast('ok', 'All stages shown', `${plural(STAGES.length, 'column')} back on the board`, { label:'Undo', run:() => { K.shut = was; renderBoard(); } });
  });
  // dragging a column by its head (or its grip): a lifted copy follows the pointer, a dashed place shows where it will land,
  // the other columns glide aside, and on release the copy settles into the place
  cols.addEventListener('pointerdown', e => {
    const head = e.target.closest('.kbx-ch'); if (!head || e.button !== 0 || kb.classList.contains('list') || e.target.closest('button:not(.crm-grip)')) return;
    const col = head.closest('.kbx-c'), k = col.dataset.col, bd = $('.kbx-bd', kb); if (!$('.kbx-tabs', kb).closest('.kbx-bar') || getComputedStyle($('.kbx-bar', kb)).display !== 'none') return;
    let gh = null, moved = false, raf = 0, lx = e.clientX; const rc0 = col.getBoundingClientRect();
    const move = ev => {
      if (!moved && Math.abs(ev.clientX - e.clientX) < 6) return; lx = ev.clientX;
      if (!moved){ moved = true; hideTip(); closePops();
        const bb = bd.getBoundingClientRect(); gh = col.cloneNode(true); gh.classList.add('crm-cghost'); gh.removeAttribute('role'); gh.setAttribute('aria-hidden', 'true'); $$('[tabindex],button', gh).forEach(x => x.tabIndex = -1);
        Object.assign(gh.style, { left:rc0.left + 'px', top:rc0.top + 'px', width:rc0.width + 'px', height:Math.min(rc0.height, bb.bottom - rc0.top) + 'px' });
        kb.appendChild(gh); col.classList.add('crm-cph'); app.classList.add('crm-coldrag'); }
      gh.style.transform = `translateX(${ev.clientX - e.clientX}px) rotate(.6deg)`;
      // the place goes before the first other column whose middle is right of the pointer
      const others = $$('.kbx-c', cols).filter(c => c !== col && c.offsetParent), next = others.find(c => { const r = c.getBoundingClientRect(); return ev.clientX < r.left + r.width / 2; }) || null;
      if ((next ? next.previousElementSibling : cols.lastElementChild) !== col && !(next && next === col.nextElementSibling)){
        flip(() => { if (next) cols.insertBefore(col, next); else cols.appendChild(col); }); }
      if (!raf){ const tick = () => { const b = bd.getBoundingClientRect(), dx = lx < b.left + 48 ? -12 : lx > b.right - 48 ? 12 : 0; if (dx && gh){ bd.scrollLeft += dx; raf = requestAnimationFrame(tick); } else raf = 0; }; raf = requestAnimationFrame(tick); }
    };
    const up = () => {
      removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); cancelAnimationFrame(raf); raf = 0;
      if (!moved) return;
      dragged = true; setTimeout(() => dragged = false, 0);
      const to = col.getBoundingClientRect(), done = () => { gh.remove(); col.classList.remove('crm-cph'); app.classList.remove('crm-coldrag'); };
      K.order = [...$$('.kbx-c', cols)].map(c => c.dataset.col); saveOrder();
      const v = visCols(); say(`${ST[k].t} moved to position ${v.indexOf(k) + 1} of ${v.length}`);
      if (REDUCE || !gh.animate) return done();
      gh.animate([{ transform:gh.style.transform }, { transform:`translateX(${to.left - rc0.left}px)` }], { duration:220, easing:EASE, fill:'forwards' }).finished.then(done, done);
    };
    addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  });
  // dragging a card to another column, with a copy of it under the pointer
  let dragged = false;
  cols.addEventListener('pointerdown', e => {
    const el = e.target.closest('.kbx-k'); if (!el || e.button !== 0 || e.target.closest('button') || el.classList.contains('crm-draft') || kb.classList.contains('list')) return;
    if (e.pointerType === 'touch' && getComputedStyle(el).touchAction !== 'none') return;
    const d = dealOf(el.dataset.id), rc = el.getBoundingClientRect(), ox = e.clientX - rc.left, oy = e.clientY - rc.top, bd = $('.kbx-bd', kb);
    let gh = null, over = null, moved = false, raf = 0, lx = e.clientX;
    const at2 = (x, y) => { const t = document.elementFromPoint(x, y); return t && t.closest('.crm-kb .kbx-c, .crm-kb .crm-dk'); };
    const move = ev => {
      if (!moved && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) < 5) return;
      if (!moved){ moved = true; gh = el.cloneNode(true); gh.classList.add('ghost'); gh.classList.remove('open'); gh.removeAttribute('tabindex'); gh.setAttribute('aria-hidden', 'true'); gh.style.width = rc.width + 'px'; gh.style.height = rc.height + 'px'; gh.style.boxSizing = 'border-box'; $('.kbx-bd', kb).appendChild(gh); el.classList.add('drag'); closeSheet(); }
      gh.style.left = ev.clientX - ox + 'px'; gh.style.top = ev.clientY - oy + 'px'; lx = ev.clientX;
      const c = at2(ev.clientX, ev.clientY); if (c !== over){ if (over) over.classList.remove('over'); over = c; if (over && over.dataset.col !== d.st) over.classList.add('over'); }
      // near the board's edges it scrolls sideways
      if (!raf){ const tickS = () => { const b = bd.getBoundingClientRect(), dx = lx < b.left + 48 ? -12 : lx > b.right - 48 ? 12 : 0; if (dx && gh){ bd.scrollLeft += dx; raf = requestAnimationFrame(tickS); } else raf = 0; }; raf = requestAnimationFrame(tickS); }
    };
    const up = () => {
      removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); cancelAnimationFrame(raf); raf = 0;
      if (!moved) return;
      gh.remove(); el.classList.remove('drag'); if (over) over.classList.remove('over');
      dragged = true; setTimeout(() => dragged = false, 0);
      if (over && over.dataset.col !== d.st) moveDeal(d, over.dataset.col);
    };
    addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  });

  /* ---------- Forecast: the chart components, worked out from the deals ---------- */
  const fc = $('.crm-fc', app);
  const Q3 = { pipe:3920000, weighted:1880000, avg:131000 };
  const Q3W = [110, 260, 400, 540, 690, 840, 960, 1060, 1150, 1240, 1310, 1370, 1420].map(x => x * 1000);
  // every closed-won deal of the quarter with the day it closed (days from today): the same deals as the board's Closed won column
  const wonQ = () => DE.filter(d => d.st === 'won' && d.close >= -qDay);
  const wonEvents = () => wonQ().map(d => ({ at:Math.min(0, d.close), v:d.v }));
  const wonOf = who => sum(wonQ().filter(d => who.includes(d.own)), d => d.v);
  // commit: the weighted value of the deals in Proposal and Negotiation
  const commitOf = who => sum(DE.filter(d => (d.st === 'nego' || d.st === 'prop') && who.includes(d.own)), d => d.v * d.p / 100);
  const delta = (a, b) => { const p = Math.round((a / b - 1) * 1000) / 10; return `<span class="tag scx-d num ${p >= 0 ? 'ok' : 'bad'}">${p >= 0 ? '+' : '−'}${Math.abs(p)}%</span>`; };
  const sparkPath = (pts) => { const mx = Math.max(...pts), mn = Math.min(...pts); return pts.map((y, k) => `${k ? 'L' : 'M'}${(k / (pts.length - 1) * 100).toFixed(1)} ${(27 - (y - mn) / ((mx - mn) || 1) * 25).toFixed(1)}`).join(' '); };
  const lineOn = [true, true];
  let shownLine = null;
  function renderForecast(){
    const open = DE.filter(d => !closed(d)), pipe = sum(open, d => d.v), weighted = sum(open, d => d.v * d.p / 100), won = wonOf(OWN), avg = open.length ? pipe / open.length : 0;
    // the cumulative won by week, this quarter so far
    const EV = wonEvents(), A = Array.from({ length:WK + 1 }, (_, i) => sum(EV.filter(e => Math.floor((e.at + qDay) / 7) <= i), e => e.v));
    const S = [['chart', 'Open pipeline', pipe, Q3.pipe, [3.3, 3.5, 3.7, 3.8, 4.0, 4.1, pipe / 1e6], 'vs end of Q3'], ['target', 'Weighted forecast', weighted, Q3.weighted, [1.45, 1.6, 1.75, 1.85, 1.95, 2.05, weighted / 1e6], 'vs end of Q3'],
      ['ok', 'Closed won, Q4', won, Q3W[WK], A.map(v => v / 1e6), `vs week ${WK + 1} of Q3`], ['coins', 'Average open deal', avg, Q3.avg, [140, 136, 133, 131, 129, 127, avg / 1e3], 'vs end of Q3']];
    $('.scx-grid', fc).innerHTML = S.map((s, i) => `<div class="scx-c panel"><span class="scx-k"><span class="ic">${I(s[0], 'xs')}</span>${s[1]}</span><div class="scx-v"><b class="num">${kmoney(s[2])}</b>${delta(s[2], s[3])}<span class="crm-vs">${s[5]}</span></div><div class="scx-sp"><svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="crm-sg${i}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--dm-c${i + 1})" stop-opacity=".2"/><stop offset="1" stop-color="var(--dm-c${i + 1})" stop-opacity="0"/></linearGradient></defs><path class="ar" style="fill:url(#crm-sg${i})" d="${sparkPath(s[4])} L100 30 L0 30 Z"/><path stroke="var(--dm-c${i + 1})" d="${sparkPath(s[4])}"/></svg></div></div>`).join('');
    // the line chart: closed won day by day, from the quarter's first day to today, against Q3 at the same point (owner,
    // 10 Nov: the chart covers the quarter so far and ends at today on its right edge; the quarter-end forecast is a line of
    // text under the total, not half a chart)
    const N = Math.max(1, qDay), AD = Array.from({ length:N + 1 }, (_, d) => sum(EV.filter(e => e.at + qDay <= d), e => e.v));
    const q3At = d => { const w = Math.min(12, Math.floor(d / 7)), prev = w ? Q3W[w - 1] : 0; return prev + (Q3W[w] - prev) * ((d % 7) + 1) / 7; };
    const QD = AD.map((_, d) => q3At(d));
    const fcEnd = won + sum(DE.filter(d => !closed(d) && d.close <= eoq), d => d.v * d.p / 100);
    const hi = Math.max(AD[N], QD[N]) * 1.25, X = d => d / N * 320, Y = v => 136 - v / hi * 128;
    // Line chart's own drawing: a smooth curve through a point every few days, last quarter dashed (owner, 10 Nov)
    const step = Math.max(1, Math.round(N / 12)), SI = []; for (let d = 0; d < N; d += step) SI.push(d); SI.push(N);
    const smooth = p => p.map((q, i) => { if (!i) return `M${q[0].toFixed(1)} ${q[1].toFixed(1)}`; const a = p[i - 1], m = (q[0] - a[0]) / 2; return `C${(a[0] + m).toFixed(1)} ${a[1].toFixed(1)} ${(q[0] - m).toFixed(1)} ${q[1].toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`; }).join(' ');
    const pa = SI.map(d => [X(d), Y(AD[d])]), pb = SI.map(d => [X(d), Y(QD[d])]);
    const svg = $('.lnx-svg', fc);
    svg.innerHTML = `<defs><linearGradient id="crm-lng" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--dm-accent-mark,var(--dm-accent))" stop-opacity=".16"/><stop offset="1" stop-color="var(--dm-accent-mark,var(--dm-accent))" stop-opacity="0"/></linearGradient></defs>`
      + [35, 70, 105].map(y => `<line class="gl" x1="0" x2="320" y1="${y}" y2="${y}"/>`).join('')
      + `<path class="ar" d="${smooth(pa)} L320 140 L0 140 Z" fill="url(#crm-lng)" style="opacity:${lineOn[0] ? 1 : 0}"/><path class="ln l1${lineOn[1] ? '' : ' off'}" d="${smooth(pb)}" stroke="var(--dm-c2)" stroke-dasharray="4 4"/><path class="ln l0${lineOn[0] ? '' : ' off'}" d="${smooth(pa)}" stroke="var(--dm-accent-mark,var(--dm-accent))"/>`;
    // the axis: the quarter's first day, two dates between, and Today at the right edge
    $('.lnx-ax', fc).innerHTML = [0, Math.round(N / 3), Math.round(N * 2 / 3), N].map(d => `<span>${d === N ? 'Today' : fmtD(d - N)}</span>`).join('');
    const ch = $('.lnx-ch', fc); $$('.lnx-pt', ch).forEach(x => x.remove());
    ch.insertAdjacentHTML('beforeend', '<span class="lnx-pt on" style="color:var(--dm-accent-mark,var(--dm-accent))"></span><span class="lnx-pt on" style="color:var(--dm-c2)"></span>');
    $('.crm-fcst', fc).textContent = `${kmoney(fcEnd)} forecast`;
    const lv = $('.lnx-v', fc), latest = () => kmoney(won);
    if (shownLine === null || REDUCE) lv.textContent = latest(); else if (shownLine !== won) tween(shownLine, won, 700, n => lv.textContent = kmoney(n));
    shownLine = won;
    ch.onpointermove = ev => { const b = ch.getBoundingClientRect(), k = clamp(Math.round((ev.clientX - b.left) / b.width * (SI.length - 1)), 0, SI.length - 1), i = SI[k], px = X(i) / 320 * b.width;
      $('.lnx-x', ch).style.left = px + 'px'; $('.lnx-tt', ch).style.left = clamp(px, 70, b.width - 70) + 'px';
      const pts = $$('.lnx-pt', ch); [pa, pb].forEach((p, j) => { pts[j].classList.toggle('on', lineOn[j]); pts[j].style.left = px + 'px'; pts[j].style.top = p[k][1] / 140 * b.height + 'px'; });
      const a = AD[i], q = QD[i], when = i === N ? 'today' : fmtD(i - N);
      $('.lnx-tt b', ch).textContent = lineOn[0] ? `${kmoney(a)} won by ${when}` : `${kmoney(q)} by this point in Q3`;
      $('.lnx-tt span', ch).textContent = lineOn[0] && lineOn[1] ? `${a >= q ? '+' : '−'}${kmoney(Math.abs(a - q))} on Q3 at this point` : lineOn[0] ? 'This quarter' : 'Last quarter';
      lv.textContent = lineOn[0] ? kmoney(a) : latest(); };
    ch.onpointerleave = () => lv.textContent = latest();
    paintBars(); paintClosing();
    // radial goals: each team's closed won against its quota
    const RAD = [78, 60, 42], CS = ['var(--dm-c1)', 'var(--dm-c3)', 'var(--dm-c4)'];
    const share = t => wonOf(t.who) / t.quota;
    const rsvg = $('.rgx-ring svg', fc);
    if (!rsvg.children.length) rsvg.innerHTML = TEAMS.map((t, i) => `<g data-i="${i}" style="stroke:${CS[i]}"><circle class="tr" cx="90" cy="90" r="${RAD[i]}"/><circle class="fl" cx="90" cy="90" r="${RAD[i]}" pathLength="100" stroke-dasharray="0 100"/></g>`).join('');
    TEAMS.forEach((t, i) => $(`g[data-i="${i}"] .fl`, rsvg).setAttribute('stroke-dasharray', `${Math.max(0, Math.min(1, share(t)) * 100 - .01)} 100`));
    const lg = $('.rgx-lg', fc), pc = x => Math.round(x * 100) + '%';
    lg.innerHTML = TEAMS.map((t, i) => `<div class="rgx-r" data-i="${i}" tabindex="0" aria-label="${t.t}: ${kmoney(wonOf(t.who))} won, ${pc(share(t))} of a ${kmoney(t.quota)} quota, ${kmoney(commitOf(t.who))} more in commit" data-tip="${kmoney(commitOf(t.who))} more in commit"><i style="background:${CS[i]}"></i><span class="n">${t.t}</span><span class="p num">${share(t) >= 1 ? `<span class="tag ok">${pc(share(t))}</span>` : pc(share(t))}</span><span class="v num">${kmoney(wonOf(t.who))} won of ${kmoney(t.quota)}</span></div>`).join('');
    const all = sum(TEAMS, t => wonOf(t.who)) / sum(TEAMS, t => t.quota), cb = $('.rgx-c b', fc), cl = $('.rgx-c .muted', fc);
    const centreOn = i => { const ring = $('.rgx-ring', fc); ring.classList.toggle('hov', i >= 0); $$('g', rsvg).forEach((g, k) => g.classList.toggle('on', k === i)); $$('.rgx-r', lg).forEach((r, k) => r.classList.toggle('on', k === i)); cb.textContent = pc(i < 0 ? all : share(TEAMS[i])); cl.textContent = 'won'; };
    // the centre holds the percentage and one short word; the team being read is the legend row's highlight
    centreOn(-1);
    $$('.rgx-r', lg).forEach((r, i) => { r.onpointerenter = r.onfocus = () => centreOn(i); r.onpointerleave = r.onblur = () => centreOn(-1); });
    // funnel: how many deals reached each stage, every deal at the furthest stage it got to (a lost deal where it was lost)
    const FS = STAGES.filter(s => s.k !== 'lost'), fur = d => d.st === 'lost' ? ST[d.at || 'disc'].i : ST[d.st].i;
    const reach = FS.map(s => DE.filter(d => fur(d) >= ST[s.k].i).length);
    let worst = 1; reach.forEach((n, i) => { if (i && n / reach[i - 1] < reach[worst] / reach[worst - 1]) worst = i; });
    $('.crm-fnn', fc).textContent = `${DE.length} deals, each at the furthest stage it reached`;
    $('.fnx-rows', fc).innerHTML = FS.map((s, i) => { const w = Math.max(6, reach[i] / (reach[0] || 1) * 100);
      return `<div class="fnx-r${i === worst ? ' drop' : ''}" style="--dm-fc:color-mix(in oklab,var(--dm-c1) ${100 - i * 25}%,var(--dm-c2))"><span class="k">${s.k === 'won' ? 'Won' : s.t}</span><div class="tr" data-tip="${i ? Math.round(reach[i] / reach[0] * 100) + '% of all deals' : 'Every deal starts here'}"><div class="bar" style="width:${w}%"></div><span class="n num${w < 24 ? ' out' : ''}" style="left:${w < 24 ? `calc(${w}% + 8px)` : '10px'}">${reach[i]}</span></div><span class="v num">${i ? '−' + Math.round((1 - reach[i] / (reach[i - 1] || 1)) * 100) + '%' : '100%'}</span></div>`; }).join('');
    const held = DE.filter(d => fur(d) === worst - 1), lostThere = held.filter(d => d.st === 'lost').length;
    $('.fnx-t', fc).textContent = `The biggest drop is from ${FS[worst - 1].t.toLowerCase()} to ${FS[worst].t.toLowerCase()}: ${Math.round((1 - reach[worst] / reach[worst - 1]) * 100)}% of the deals that reached ${FS[worst - 1].t.toLowerCase()} got no further, ${held.length - lostThere} still open there and ${lostThere} lost.`;
    // Activity heatmap: the team's calls, meetings and emails by weekday over the last 12 weeks, the same touches as the
    // accounts' activity, or the follow-ups the agent drafted
    renderHeat();
    // quota attainment: Top pages' ranked rows, each rep's won against quota as the bar, the change on last week as the chip
    paintTop();
    paintFbn(); paintQsum(); paintAct();
  }
  // Bar chart: the open pipeline by when its deals close, week by week (the next 12) or month by month (up to 6, to the last
  // month a deal closes in), with the library chart's Week / Month switch (owner, 10 Nov); a deal past its close date counts in
  // the current week or month, as it still has to close
  let bcRange = 'w';
  function paintBars(){
    if (!$('.bcx-ch', fc)) return;
    const open = DE.filter(d => !closed(d)), bch = $('.bcx-ch', fc), wk0 = -((today.getDay() + 6) % 7), m0 = today.getFullYear() * 12 + today.getMonth();
    const B = Array.from({ length:bcRange === 'w' ? 12 : 6 }, () => ({ v:0, n:0, late:0 }));
    open.forEach(d => { let i; if (bcRange === 'w') i = Math.floor((Math.max(0, d.close) - wk0) / 7); else { const t = new Date(today); t.setDate(t.getDate() + Math.max(0, d.close)); i = t.getFullYear() * 12 + t.getMonth() - m0; }
      if (i < B.length){ B[i].v += d.v; B[i].n++; if (d.close < 0) B[i].late++; } });
    if (bcRange === 'm') while (B.length > 3 && !B[B.length - 1].v) B.pop();
    const mname = (i, f) => new Date(Math.floor((m0 + i) / 12), (m0 + i) % 12, 1).toLocaleString('en-US', { month:f });
    const lab = i => bcRange === 'w' ? `week of ${fmtD(wk0 + i * 7)}` : mname(i, 'long'), bmx = Math.max(...B.map(x => x.v), 1);
    bch.innerHTML = B.map((m, i) => `<div class="bcx-b" role="listitem" tabindex="0" aria-label="${lab(i)}: ${money(m.v)} in ${plural(m.n, 'open deal')}"><div class="bcx-tt"><b class="num">${kmoney(m.v)}</b><span>${plural(m.n, 'deal')}, ${lab(i)}${m.late ? `, ${m.late} past due` : ''}</span></div><div class="bcx-st" style="height:calc((100% - 20px) * ${Math.max(.015, m.v / bmx * .8).toFixed(3)})"><i></i></div><div class="bcx-l">${bcRange === 'w' ? (i % 3 ? '' : fmtD(wk0 + i * 7)) : mname(i, 'short')}</div></div>`).join('');
    $('.crm-bct', fc).textContent = `Pipeline by close ${bcRange === 'w' ? 'week' : 'month'}`;
    const big = B.reduce((x, m, i) => m.v > B[x].v ? i : x, 0);
    $('.crm-bcs', fc).textContent = bcRange === 'w' ? `${kmoney(sum(B.slice(0, 4), x => x.v))} in the next 4 weeks` : `${kmoney(sum(B, x => x.v))} open, most in ${mname(big, 'short')}`;
    if (!REDUCE) $$('.bcx-st', bch).forEach((x, i) => x.animate([{ transform:'scaleY(0)', transformOrigin:'bottom' }, { transform:'none', transformOrigin:'bottom' }], { duration:420, delay:i * 18, easing:EASE, fill:'backwards' }));
  }
  if ($('.crm-bc .bcx-rg', fc)) seg($('.crm-bc .bcx-rg', fc), v => { bcRange = v; paintBars(); });
  // Closing next: the next open deals by close date, the ones past their date first, as Agenda rows: the date, a rail in the
  // stage's colour, the deal and its account, and the amount with its win probability. A row opens the account
  const cnl = $('.crm-cnl', fc);
  const dayOf = n => { const t = new Date(today); t.setDate(t.getDate() + n); return t; };
  function paintClosing(){
    if (!cnl) return;
    const open = DE.filter(d => !closed(d)).sort((a, b) => a.close - b.close || b.v - a.v), next = open.filter(d => d.close >= 0).slice(0, 4), late = open.filter(d => d.close < 0).length;
    const soon = open.filter(d => d.close >= 0 && d.close <= 14);
    $('.crm-cns', fc).textContent = `${kmoney(sum(soon, d => d.v))} in the next 14 days`;
    const cn = $('.crm-cnn', fc); cn.textContent = late ? `${late} past due` : plural(soon.length, 'deal'); cn.classList.toggle('bad', !!late);
    cnl.innerHTML = next.map(d => { const c = coOf(d.co), t = dayOf(d.close), late = d.close < 0;
      return `<button class="agx-e crm-cne${late ? ' late' : ''}" role="listitem" data-co="${d.co}" aria-label="${esc(d.n)}, ${esc(c.n)}, ${money(d.v)}, ${late ? 'was due' : 'closes'} ${fmtD(d.close)}">`
        + `<span class="tm num"><b>${t.toLocaleDateString('en-US', { month:'short', day:'numeric' })}</b><span>${late ? 'Overdue' : d.close === 0 ? 'Today' : t.toLocaleDateString('en-US', { weekday:'short' })}</span></span>`
        + `<span class="bar crm-sd" data-s="${d.st}"></span>`
        + `<span class="t"><b>${esc(d.n)}</b><span>${esc(c.n)} · ${ST[d.st].t}</span></span>`
        + `<span class="crm-cna"><b class="num">${kmoney(d.v)}</b><span class="num">${d.p}%</span></span></button>`; }).join('');
  }
  if (cnl) cnl.addEventListener('click', e => { const r = e.target.closest('.crm-cne'); if (r) openSheet(r.dataset.co); });
  /* ---------- the forecast's banner, the quota card's figures and deal activity (owner, 10 Nov) ---------- */
  const fbn = $('.crm-sbn', app), FBART = "<g class=\"gds\"><path class=\"gd\" d=\"M135.6 59L42.1 113M151.2 68L57.6 122M166.8 77L73.2 131M182.4 86L88.8 140M197.9 95L104.4 149M135.6 59L197.9 95M120 68L182.4 104M104.4 77L166.8 113M88.8 86L151.2 122M73.2 95L135.6 131M57.6 104L120 140M42.1 113L104.4 149\"/></g><g class=\"z\" style=\"--z:0\"><path class=\"pl\" d=\"M135.6 21L166.8 39L166.8 95L151.2 104L120 86L120 30Z\"/><path class=\"ln\" style=\"--d:0\" pathLength=\"1\" d=\"M135.6 21L166.8 39L151.2 48L120 30Z\"/><path class=\"ln\" style=\"--d:1\" pathLength=\"1\" d=\"M166.8 39L166.8 95L151.2 104L120 86L120 30\"/><path class=\"ln\" style=\"--d:2\" pathLength=\"1\" d=\"M151.2 48L151.2 104\"/><path class=\"pl\" d=\"M120 44L151.2 62L151.2 104L135.6 113L104.4 95L104.4 53Z\"/><path class=\"ln\" style=\"--d:3\" pathLength=\"1\" d=\"M120 44L151.2 62L135.6 71L104.4 53Z\"/><path class=\"ln\" style=\"--d:4\" pathLength=\"1\" d=\"M151.2 62L151.2 104L135.6 113L104.4 95L104.4 53\"/><path class=\"ln\" style=\"--d:5\" pathLength=\"1\" d=\"M135.6 71L135.6 113\"/><path class=\"pl\" d=\"M104.4 67L135.6 85L135.6 113L120 122L88.8 104L88.8 76Z\"/><path class=\"ln\" style=\"--d:6\" pathLength=\"1\" d=\"M104.4 67L135.6 85L120 94L88.8 76Z\"/><path class=\"ln\" style=\"--d:7\" pathLength=\"1\" d=\"M135.6 85L135.6 113L120 122L88.8 104L88.8 76\"/><path class=\"ln\" style=\"--d:8\" pathLength=\"1\" d=\"M120 94L120 122\"/><path class=\"pl\" d=\"M88.8 90L120 108L120 122L104.4 131L73.2 113L73.2 99Z\"/><path class=\"ln\" style=\"--d:9\" pathLength=\"1\" d=\"M88.8 90L120 108L104.4 117L73.2 99Z\"/><path class=\"ln\" style=\"--d:10\" pathLength=\"1\" d=\"M120 108L120 122L104.4 131L73.2 113L73.2 99\"/><path class=\"ln\" style=\"--d:11\" pathLength=\"1\" d=\"M104.4 117L104.4 131\"/></g><g class=\"z\" style=\"--z:2\"><path class=\"ln ac\" style=\"--d:12\" pathLength=\"1\" d=\"M137.1 30.9V8.9h14l-4 5 4 5h-14\"/></g>";
  $('.bnx-art', fbn).innerHTML = `<svg class="bnx-svg" viewBox="0 0 240 160" width="240" height="160" focusable="false">${FBART}</svg>`;
  // X or Later folds the banner to a one-line row at the same spot; the row opens it again. Kept for the tab's session
  const fbm = $('.crm-sbm', app);
  try { if (sessionStorage.getItem('crm-fbn')){ fbn.hidden = true; fbm.hidden = false; } } catch(e){}
  fbm.onclick = () => { fbm.hidden = true; fbn.hidden = false; enter(fbn); try { sessionStorage.removeItem('crm-fbn'); } catch(e){} $('[data-fb="go"]', fbn).focus({ preventScroll:true }); };
  function paintFbn(){
    const open = DE.filter(d => !closed(d)), commit = commitOf(OWN), unsure = DE.filter(d => (d.st === 'prop' || d.st === 'nego') && d.p >= 30 && d.p <= 60).length;
    $('.crm-fbd', fbn).textContent = `The agent drafted ${kmoney(commit)} from ${open.length} open deals and flagged ${unsure} to check.`;
  }
  fbn.addEventListener('click', e => { const b = e.target.closest('[data-fb]'); if (!b) return;
    if (b.dataset.fb === 'go'){ setView('pipeline'); return; }
    fadeOut(fbn); try { sessionStorage.setItem('crm-fbn', 'min'); } catch(e){}
    setTimeout(() => { fbm.hidden = false; enter(fbm); fbm.focus({ preventScroll:true }); }, REDUCE ? 0 : 200); });
  paintFbn();
  function paintQsum(){
    const quota = sum(TEAMS, t => t.quota), w = wonOf(OWN), cm = commitOf(OWN), gap = Math.max(0, quota - w - cm);
    $('.crm-qsum', fc).innerHTML = [['Won', w], ['Commit', cm], ['Gap to quota', gap]].map(([k, v]) => `<div><span>${k}</span><b class="num">${kmoney(v)}</b></div>`).join('');
  }
  // deal activity: the deals that close this quarter, nearest to today first, filtered by stage, owner and amount, or searched;
  // a row (or its ⋯) opens its account
  const AF = { st:'all', own:'all', amt:'all', sort:'close', desc:false, q:'' }, ACTN = 8, abody = $('.crm-dat tbody', fc); let actPg = 0;
  const AOPT = {
    // a stage option is the stage's own chip, so the menu and the table share one colour code (owner, 10 Nov)
    st:[['all', 'Any stage'], ['open', 'Open'], ['soon', 'Closing in 14 days'], ...STAGES.map(x => [x.k, x.t])],
    own:[['all', 'Any owner'], ...OWN.map(o => [o, P[o][0]])],
    amt:[['all', 'Any amount'], ['s', 'Under $50k'], ['m', '$50k to $200k'], ['l', 'Over $200k']],
  };
  // one Filter (Filter menu: a field, then its values, the ones on shown as chips) and one Sort (a field and a direction), as the
  // accounts' toolbar does, instead of a button per field (owner, 10 Nov)
  const AFL = { st:['Stage', 'layers'], own:['Owner', 'user'], amt:['Amount', 'dollar'] };
  const AFI = { all:'', open:I('target', 'xs'), soon:I('clock', 'xs') };
  const ASORT = { close:['Close date', 'cal', 'Nearest first', 'Furthest first'], amt:['Amount', 'dollar', 'Smallest first', 'Largest first'], stage:['Stage', 'layers', 'Earliest first', 'Latest first'], name:['Deal name', 'coins', 'A to Z', 'Z to A'] };
  const ADESC = { close:false, amt:true, stage:false, name:false };
  const amtOk = (d, k) => k === 'all' || (k === 's' ? d.v < 50000 : k === 'm' ? d.v >= 50000 && d.v <= 200000 : d.v > 200000);
  const actRows = () => DE.filter(d => d.close >= -qDay && d.close <= eoq)
    .filter(d => AF.st === 'all' || (AF.st === 'open' ? !closed(d) : AF.st === 'soon' ? !closed(d) && d.close >= 0 && d.close <= 14 : d.st === AF.st))
    .filter(d => AF.own === 'all' || d.own === AF.own).filter(d => amtOk(d, AF.amt))
    .filter(d => !AF.q || (d.n + ' ' + coOf(d.co).n + ' ' + d.id + ' ' + P[d.own][0]).toLowerCase().includes(AF.q))
    .sort((a, b) => (AF.desc ? -1 : 1) * (AF.sort === 'amt' ? a.v - b.v : AF.sort === 'stage' ? ST[a.st].i - ST[b.st].i : AF.sort === 'name' ? a.n.localeCompare(b.n) : Math.abs(a.close) - Math.abs(b.close)) || Math.abs(a.close) - Math.abs(b.close) || b.v - a.v);
  const pageList = (n, at) => n <= 7 ? [...Array(n).keys()] : at < 4 ? [0, 1, 2, 3, 4, -1, n - 1] : at > n - 5 ? [0, -1, n - 5, n - 4, n - 3, n - 2, n - 1] : [0, -1, at - 1, at, at + 1, -1, n - 1];
  function paintAct(dir){
    const L = actRows(), pages = Math.max(1, Math.ceil(L.length / ACTN)); actPg = clamp(actPg, 0, pages - 1);
    const pg = L.slice(actPg * ACTN, actPg * ACTN + ACTN);
    abody.innerHTML = pg.length ? pg.map(d => { const c = coOf(d.co), when = d.close === 0 ? 'Today' : fmtD(d.close), k = d.st === 'won' ? ' won' : d.st === 'lost' ? ' lost' : '';
      return `<tr data-co="${c.id}" tabindex="0" aria-label="${esc(d.n)}, ${esc(c.n)}, ${ST[d.st].t}, closes ${when}, ${money(d.v)}. Open the account">`
        + `<td><span class="crm-dd"><span class="pfm-lg" aria-hidden="true">${esc(c.n[0])}</span><span class="crm-dtx"><span class="crm-dn">${esc(d.n)}</span><span class="crm-dsub">${esc(c.n)} · ${when}</span></span></span></td>`
        + `<td>${esc(c.n)}</td><td><span class="crm-do">${av(d.own)}${esc(P[d.own][0])}</span></td><td>${pill(d.st)}</td><td class="num">${when}</td>`
        + `<td class="r"><span class="crm-amt num${k}">${d.st === 'won' ? '+' : ''}${money(d.v)}</span></td>`
        + `<td class="r"><button class="ib crm-dmore" data-co="${c.id}" tabindex="-1" aria-label="Open ${esc(c.n)}" data-tip="Open account">${I('more', 'xs')}</button></td></tr>`; }).join('')
      : `<tr class="crm-dempty"><td colspan="7">No deals match these filters</td></tr>`;
    $('.crm-actn', fc).textContent = L.length;
    $('.crm-pgs', fc).innerHTML = pages > 1 ? pageList(pages, actPg).map(i => i < 0 ? '<span class="crm-pgx" aria-hidden="true">…</span>' : `<button class="crm-pgb num${i === actPg ? ' on' : ''}" data-p="${i}" aria-label="Page ${i + 1}"${i === actPg ? ' aria-current="page"' : ''}>${i + 1}</button>`).join('') : '';
    $('.crm-pgs', fc).insertAdjacentHTML('beforeend', pages > 1 ? `<span class="crm-pgm num">${actPg + 1} of ${pages}</span>` : '');
    $('[data-pg="-1"]', fc).disabled = actPg === 0; $('[data-pg="1"]', fc).disabled = actPg >= pages - 1;
    if (dir && !REDUCE) $$('tr', abody).forEach((tr, i) => tr.animate([{ opacity:0, transform:`translateY(${dir > 0 ? 4 : -4}px)` }, { opacity:1, transform:'none' }], { duration:220, delay:i * 14, easing:EASE, fill:'backwards' }));
  }
  // Filter: Filter menu's two steps, the fields and then the values of the one picked, each with how many deals it leaves
  const afp = $('#crm-p-af', app), ach = $('.crm-ach', fc);
  const aBody = (k, v, l) => k === 'own' ? `${av(v)}<span>${l}</span>` : k === 'st' && ST[v] ? pill(v) : `${k === 'st' ? AFI[v] : ''}<span>${l}</span>`;
  const aLeft = (k, v) => { const was = AF[k]; AF[k] = v; const n = actRows().length; AF[k] = was; return n; };
  function afStep(k, focus){
    if (!k) afp.innerHTML = `<div class="ph" role="none">Filter by</div>` + Object.entries(AFL).map(([key, [l, ic]]) => { const o = AF[key] !== 'all' && AOPT[key].find(x => x[0] === AF[key]);
      return `<button class="mi" role="menuitem" aria-haspopup="menu" tabindex="-1" data-k="${key}">${I(ic)}<span>${l}</span><span class="r">${o ? `<i class="crm-fon" role="img" aria-label="In use: ${esc(o[1])}"></i>` : ''}</span>${I('chev-r', 'xs')}</button>`; }).join('');
    else afp.innerHTML = `<button class="mi flm-bk" role="menuitem" tabindex="-1" aria-label="Back to all fields">${I('chev-l', 'xs')}<span>${AFL[k][0]}</span></button><div class="sep" role="separator"></div>`
      + AOPT[k].slice(1).map(([v, l]) => `<button class="mi" role="menuitemradio" aria-checked="${AF[k] === v}" tabindex="-1" data-close data-v="${v}">${aBody(k, v, l)}<span class="r num">${aLeft(k, v)}</span><span class="ck">${I('check', 'xs')}</span></button>`).join('');
    if (afp.dataset.k !== (k || '')) glide(afp, { transform:`translateX(${k ? 8 : -8}px)` }, 220);
    afp.dataset.k = k || '';
    if (focus) setTimeout(() => { const m = k ? ($('.mi[aria-checked="true"]', afp) || $$('.mi', afp)[1]) : ($(`.mi[data-k="${focus}"]`, afp) || $('.mi', afp)); if (m) m.focus({ preventScroll:true }); });
  }
  $('.crm-aft', fc).addEventListener('click', () => afStep(null));
  afp.addEventListener('click', e => {
    const m = e.target.closest('.mi'); if (!m) return; const kb = !e.detail;
    if (m.classList.contains('flm-bk') || m.dataset.k) e.stopPropagation();
    if (m.classList.contains('flm-bk')){ afStep(null, kb ? afp.dataset.k : null); return; }
    if (m.dataset.k){ afStep(m.dataset.k, kb || afp.contains(document.activeElement)); return; }
    AF[afp.dataset.k] = m.dataset.v; actPg = 0; aChips(); paintAct(1);
  });
  afp.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' && !afp.dataset.k){ const m = e.target.closest('.mi[data-k]'); if (m){ e.preventDefault(); e.stopPropagation(); afStep(m.dataset.k, true); } }
    else if (e.key === 'ArrowLeft' && afp.dataset.k){ e.preventDefault(); e.stopPropagation(); afStep(null, afp.dataset.k); }
  }, true);
  // the filters that are on, as Filter menu's chips under the head: the field, is, the value and its x
  function aChips(){
    const on = Object.keys(AFL).filter(k => AF[k] !== 'all');
    $$('.flm-ch', ach).forEach(ch => { if (on.includes(ch.dataset.k) || ch.classList.contains('gone')) return; chipLeave(ch); });
    on.forEach(k => { let ch = $(`.flm-ch[data-k="${k}"]:not(.gone)`, ach); const l = AOPT[k].find(x => x[0] === AF[k])[1];
      if (!ch){ ch = html(`<div class="flm-ch" role="listitem" data-k="${k}"><span class="k">${AFL[k][0]}</span><span class="op">is</span><span class="v"></span><button class="x">${I('x', 'xs')}</button></div>`); ach.appendChild(ch); } else ch.classList.add('seen');
      $('.v', ch).textContent = l; $('.x', ch).setAttribute('aria-label', `Remove filter ${AFL[k][0]} is ${l}`); $('.x', ch).dataset.tip = 'Remove filter'; });
    $('.crm-aft', fc).classList.toggle('on', on.length > 0);
  }
  ach.addEventListener('click', e => { const x = e.target.closest('.x'); if (!x) return; const ch = x.closest('.flm-ch'); AF[ch.dataset.k] = 'all'; hideTip(); actPg = 0; aChips(); paintAct(1); $('.crm-aft', fc).focus({ preventScroll:true }); });
  // Sort: one menu, the field and then the direction, in that field's own words
  onOpen('.crm-asort', () => { const p = pop('crm-p-as'), S = ASORT[AF.sort];
    p.innerHTML = `<div class="ph" role="none">Sort by</div>` + Object.entries(ASORT).map(([k, [l, ic]]) => mi(`data-s="${k}"`, `${I(ic)}<span>${l}</span>`, 'menuitemradio', AF.sort === k)).join('')
      + `<div class="sep" role="separator"></div>` + [false, true].map(d => mi(`data-d="${d}"`, `${I(d ? 'down' : 'up', 'xs')}<span>${S[d ? 3 : 2]}</span>`, 'menuitemradio', AF.desc === d)).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { if (m.dataset.s){ AF.sort = m.dataset.s; AF.desc = ADESC[AF.sort]; } else AF.desc = m.dataset.d === 'true';
      swap($('.crm-asort .v', fc), ASORT[AF.sort][0]); actPg = 0; paintAct(1); })); });
  const asq = $('.crm-asq input', fc);
  asq.addEventListener('input', () => { AF.q = asq.value.trim().toLowerCase(); actPg = 0; paintAct(); });
  $$('[data-pg]', fc).forEach(b => b.onclick = () => { actPg += +b.dataset.pg; paintAct(+b.dataset.pg); });
  $('.crm-pgs', fc).addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (!b) return; const to = +b.dataset.p, dir = Math.sign(to - actPg); actPg = to; paintAct(dir); });
  abody.addEventListener('click', e => { const tr = e.target.closest('tr[data-co]'); if (tr) openSheet(tr.dataset.co, true); });
  abody.addEventListener('keydown', e => { const tr = e.target.closest('tr[data-co]'); if (tr && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); openSheet(tr.dataset.co, true); } });
  // Top pages for quota attainment: the rows keep their place in the DOM and slide to their rank, as the library's do
  const tpl = $('.crm-tp .tpx-list', fc); let tpSort = 'v';
  // each rep's share of Q3's won at this week of the quarter (demo history, like Q3W): the chip compares Q4 with it
  const Q3PACE = { MK:1.12, AR:.84, TR:1.35, JO:.9, LN:1.18, IB:.72, DK:.66, KM:1.04 }, QSUM = sum(Object.values(QUOTA));
  const q3Rep = o => Math.round(Q3W[WK] * QUOTA[o] / QSUM * Q3PACE[o] / 1000) * 1000;
  function paintTop(){
    const R = OWN.map(o => { const w = wonOf([o]), q3 = q3Rep(o); return { o, w, q:QUOTA[o], c:q3 ? Math.round((w / q3 - 1) * 100) : null, add:w - q3, q3 }; });
    if (!tpl.children.length) tpl.innerHTML = R.map(r => `<div class="tpx-r" role="listitem" data-o="${r.o}"><span class="rk num"></span><span class="pg"><span class="p"></span><span class="tr"><i></i></span></span><span class="n num"></span><span class="tag ch num"></span></div>`).join('');
    const order = [...R].sort((a, b) => tpSort === 'v' ? b.w / b.q - a.w / a.q : (b.c ?? -1e9) - (a.c ?? -1e9) || b.add - a.add);
    R.forEach(r => { const row = $(`.tpx-r[data-o="${r.o}"]`, tpl), j = order.indexOf(r), pct = Math.round(r.w / r.q * 100);
      row.style.transform = `translateY(${Math.min(j, 5) * 50}px)`; $('.rk', row).textContent = j + 1; row.classList.toggle('crm-tpo', j >= 5); row.inert = j >= 5;
      $('.p', row).innerHTML = `${esc(P[r.o][0])} <span class="muted">${pct}% of ${kmoney(r.q)}</span>`;
      $('.n', row).textContent = kmoney(r.w);
      const ch = $('.ch', row), up = r.c === null ? r.w > 0 : r.c >= 0; ch.className = `tag ch num ${r.c === 0 || (r.c === null && !r.w) ? '' : up ? 'ok' : 'bad'}`;
      ch.textContent = r.c === null ? (r.w ? 'New' : '0%') : `${r.c > 0 ? '+' : r.c < 0 ? '−' : ''}${Math.abs(r.c)}%`;
      row.dataset.tip = `${kmoney(r.w)} won by week ${WK + 1}, against ${kmoney(r.q3)} by this point in Q3`;
      row.setAttribute('aria-label', `${P[r.o][0]}: ${money(r.w)} won, ${pct}% of a ${money(r.q)} quota, ${ch.textContent} on Q3 pace`);
      requestAnimationFrame(() => $('.tr i', row).style.width = Math.min(100, pct) + '%'); });
  }
  seg($('.crm-tp .tpx-sg', fc), v => { tpSort = v; paintTop(); });
  const hm = $('.crm-hm', fc), hmg = $('.hmx-grid', hm), WD = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let hmWho = 'team', hmShown = false;
  // the working part of the day, 6am to 10pm, sixteen hours a row (owner, 10 Nov: nobody works the whole 24)
  const HM0 = 6, HMN = 16;
  hmg.innerHTML = Array.from({ length:7 * HMN }, () => '<i style="--dm-a:0"></i>').join('');
  // Activity heatmap, the library's day-by-hour grid: the team's calls, meetings and emails of the last 12 weeks spread over the
  // working day (busiest mid-morning, Tuesday most), or the agent's follow-up drafts, which it writes overnight in a queue
  const hrW = (who, d, h) => who === 'team'
    ? (d > 4 ? .04 : [.22, .25, .23, .19, .11][d]) * (h < 7 || h > 19 ? .02 : h < 9 ? .35 : h < 12 ? 1 : h < 13 ? .55 : h < 17 ? .8 : .3)
    : (h < 8 ? 1 : h < 9 ? .45 : h >= 20 ? .8 : h >= 18 ? .45 : .12) * (d > 4 ? .6 : 1);
  const hrN = h => h === 0 ? '12am' : h < 12 ? h + 'am' : h === 12 ? '12pm' : (h - 12) + 'pm';
  function renderHeat(){
    const tot = hmWho === 'team' ? sum(CO, c => sum(c.trend)) : sum(CO, c => sum(c.trend, t => t === 0 ? 2 : t < 3 ? 1 : 0)) + 36;
    const Wt = []; for (let d = 0; d < 7; d++) for (let h = HM0; h < HM0 + HMN; h++) Wt.push(hrW(hmWho, d, h) * (1 + Math.sin(d * 5.3 + h * 2.1) * .15));
    const ws = sum(Wt), V = Wt.map(w => Math.round(w / ws * tot)), mx = Math.max(...V), cells = $$('i', hmg), best = V.indexOf(mx);
    cells.forEach((el, i) => { const d = Math.floor(i / HMN), h = HM0 + i % HMN, v = V[i];
      const set = () => el.style.setProperty('--dm-a', (.08 + v / (mx || 1) * .87).toFixed(2));
      if (REDUCE || hmShown) set(); else setTimeout(set, (h - HM0 + d) * 14);
      el.dataset.tip = `${WD[d]}s, ${hrN(h)}: ${v} ${hmWho === 'team' ? (v === 1 ? 'touch' : 'calls, meetings and emails') : (v === 1 ? 'follow-up drafted' : 'follow-ups drafted')}`; });
    hmShown = true;
    swap($('.hmx-st', hm), hmWho === 'team' ? `${sum(V).toLocaleString('en-US')} touches, busiest ${WD[Math.floor(best / HMN)].slice(0, 3)} ${hrN(HM0 + best % HMN)}` : `${sum(V).toLocaleString('en-US')} follow-ups drafted, mostly before 8am`);
  }
  seg($('.hmx-sg', hm), v => { hmWho = v; renderHeat(); });
  $$('.lnx-k', fc).forEach(k => k.onclick = () => { const s = +k.dataset.s; if (lineOn[s] && !lineOn[1 - s]) return; lineOn[s] = !lineOn[s]; k.classList.toggle('on', lineOn[s]); k.setAttribute('aria-pressed', lineOn[s]); renderForecast(); });

  /* ---------- views: the sidebar switches them, the header names the one on show with a live summary ---------- */
  const VIEWS = { accounts:'Accounts', inbox:'Agent inbox', calendar:'Calendar', pipeline:'Pipeline', forecast:'Forecast' };
  function setView(k){
    const was = view; view = k; app.dataset.view = k;
    Object.keys(VIEWS).forEach(v => $('#crm-v-' + v, app).hidden = v !== k);
    if (was !== k) glide($('#crm-v-' + k, app), { transform:'translateY(3px)' }, 220);
    swap($('.crm-h1t', app), VIEWS[k]);
    if (k !== 'calendar') closeCalPop();
    if (k === 'forecast'){ closeSheet(); renderForecast(); }
    if (k === 'pipeline') renderBoard();
    if (k === 'inbox') renderInbox(); else pvOpen(false);
    if (k === 'calendar' && was !== 'calendar') renderCal();
    counts(); drawer(false);
  }
  function navCurrent(){
    const sv = view === 'accounts' ? savedOn() : null;
    $$('.crm-side [data-go]', app).forEach(b => { const on = b.dataset.go === view && !sv; on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'); });
    $$('.crm-side [data-saved]', app).forEach(b => { const on = b.dataset.saved === sv; on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'); });
  }
  function counts(){
    const set = (k, v) => $$(`[data-count="${k}"]`, app).forEach(x => x.textContent = v);
    const open = DE.filter(d => !closed(d)), pipe = sum(open, d => d.v), slip = open.filter(slipping).length, w = waiting();
    set('accounts', CO.length); set('deals', open.length); set('meetings', meetingsIn(0).length);
    set('inbox', w.length || ''); $('.crm-wait', app).hidden = !w.length;
    Object.keys(SAVED).forEach(k => set(k, savedCount(k)));
    $('[data-go="inbox"]', app).setAttribute('aria-label', `Agent inbox, ${w.length} waiting`);
    const cnt = k => w.filter(x => x.kind === k).length;
    // each summary in full, and a shorter one for a phone's header
    const S = {
      accounts:[`${plural(CO.length, 'account')} · ${kmoney(pipe)} open · ${slip} slipping`, `${plural(CO.length, 'account')} · ${kmoney(pipe)} · ${slip} slipping`],
      inbox:w.length ? [[`${w.length} waiting`, cnt('follow') && plural(cnt('follow'), 'follow-up'), cnt('slip') && `${cnt('slip')} past close`, cnt('fix') && plural(cnt('fix'), 'data fix', 'data fixes')].filter(Boolean).join(' · '), `${w.length} waiting for you`] : ['Nothing waiting', 'Nothing waiting'],
      calendar:[`${weekLabel().replace(/, \d{4}$/, '')} · ${plural(meetingsIn().length, 'meeting')} · ${closingIn()} closing`, `${plural(meetingsIn().length, 'meeting')} · ${closingIn()} closing`],
      pipeline:[(K.own.size || K.q || K.A.length ? 'Shown: ' : '') + (K.sum || '').replace(/^(\d+) open · (\$[\d.]+[kM]?)/, (m, n, v) => `${plural(+n, 'open deal')} · ${v} open`), K.sum || ''],
      forecast:[`Q${Math.floor(today.getMonth() / 3) + 1} ${today.getFullYear()} · week ${clamp(WK + 1, 1, 13)} of 13 · ${kmoney(wonOf(OWN))} closed won`, `Week ${clamp(WK + 1, 1, 13)} of 13 · ${kmoney(wonOf(OWN))} won`],
    };
    swap($('.crm-sum', app), `<span class="lg">${S[view][0]}</span><span class="sh">${S[view][1]}</span>`, true);
    navCurrent();
  }
  const closingIn = () => { const [a, b] = weekOf(); return DE.filter(d => !closed(d) && d.close >= a && d.close <= b).length; };
  app.addEventListener('click', e => {
    const b = e.target.closest('.crm-side button'); if (!b) return;
    if (b.dataset.go){ if (b.dataset.go === 'accounts' && savedOn()){ F.A = []; said(''); renderTable(); } setView(b.dataset.go); }
    else if (b.dataset.unsave){ unsave(b.dataset.unsave); return; }
    else if (b.dataset.saved){ F.A = SAVED[b.dataset.saved][1].map(x => ({ ...x })); F.q = ''; ask.value = ''; askx.hidden = true; said(''); setView('accounts'); renderTable(); }
    if (b.closest('.crm-nav')) drawer(false);
  });
  const help = () => toast('info', 'Keyboard shortcuts', '⌘K or Ctrl K jumps, / searches or asks, arrows move through rows and cards, Enter opens, Space picks a row, A takes the agent’s suggestion, M moves a card, Esc closes');
  onOpen('.crm-wsb', () => {
    const p = pop('crm-p-ws'), cur = $('.crm-wst .t', app).textContent;
    p.innerHTML = `<div class="ph" role="none">Workspaces</div>` + [['L', 'Larkfield Sales', '8 people', 'pb'], ['P', 'Larkfield Partners', '3 people', 'pl']].map(w => mi(`data-n="${w[1]}"`, `<span class="pfm-lg" data-t="${w[3]}">${w[0]}</span><span>${w[1]}<span class="d">${w[2]}</span></span>`, 'menuitemradio', w[1] === cur)).join('');
    $$('.mi', p).forEach(m => m.addEventListener('click', () => { if (m.dataset.n === cur) return; const pt = m.dataset.n.includes('Partners'); $('.crm-wst .t', app).textContent = m.dataset.n; $('.crm-wst .s', app).textContent = pt ? '3 people' : '8 people'; $('.crm-wsb .pfm-lg', app).textContent = pt ? 'P' : 'L'; $('.crm-wsb .pfm-lg', app).dataset.t = pt ? 'pl' : 'pb'; toast('info', `Switched to ${m.dataset.n}`, 'The template shows the same accounts in both'); }));
  });
  // the sidebar is a drawer on tablets and phones, opened from the header
  const drawer = on => { app.classList.toggle('dr', on); if (on) setTimeout(() => $('.crm-side .ahx-cv[aria-current]', app)?.focus(), 80); };
  $('.crm-menu', app).onclick = () => drawer(true);
  $('.crm-scrim', app).onclick = () => drawer(false);
  $('.crm-shade', app).onclick = () => closeSheet();


  /* ---------- saved views: the filters in view saved under a name, in the sidebar with the others ---------- */
  // views a person saves last in this browser (localStorage, when it is allowed); a view is a name and its filters
  const UVK = 'crm-views';
  const viewsNav = $$('.crm-nav', app).pop();
  const storeViews = () => { try { localStorage.setItem(UVK, JSON.stringify(Object.keys(SAVED).filter(k => k[0] === 'u').map(k => ({ id:k, n:SAVED[k][0], A:SAVED[k][1] })))); } catch(e){} };
  const viewEl = k => html(`<div class="crm-uv" data-uv="${k}"><button class="ahx-cv" data-saved="${k}">${I('filter')}<span class="t">${esc(SAVED[k][0])}</span><span class="n num" data-count="${k}"></span></button><button class="ib crm-uvx" data-unsave="${k}" aria-label="Delete the view ${esc(SAVED[k][0])}" data-tip="Delete view">${I('x', 'xs')}</button></div>`);
  let uvN = 0;
  try { (JSON.parse(localStorage.getItem(UVK) || '[]') || []).forEach(v => {
    if (!v || !/^u\d+$/.test(v.id) || typeof v.n !== 'string' || !Array.isArray(v.A) || !v.A.length || !v.A.every(f => FL[f.k] && FL[f.k].test)) return;
    SAVED[v.id] = [v.n.slice(0, 40), v.A.map(f => ({ k:f.k, v:f.v, neg:!!f.neg }))]; uvN = Math.max(uvN, +v.id.slice(1)); viewsNav.appendChild(viewEl(v.id)); }); } catch(e){}
  // the name it suggests: the filters as the answer line reads them
  const viewName = () => { const t = F.A.map(readOf).join(', '); return (t[0] || '').toUpperCase() + t.slice(1, 40); };
  function saveView(name){
    const k = 'u' + (++uvN); SAVED[k] = [name, F.A.map(f => ({ ...f }))];
    const el = viewEl(k); viewsNav.appendChild(el); enter(el); storeViews(); counts(); chips();
    say(`Saved the view ${name}`);
    toast('ok', `Saved “${name}”`, 'It is in the sidebar with the other views', { label:'Undo', run:() => unsave(k, true) });
  }
  function unsave(k, quiet){
    const v = SAVED[k], el = $(`.crm-uv[data-uv="${k}"]`, app); if (!v) return; const on = savedOn() === k;
    delete SAVED[k]; storeViews();
    if (el){ if (el.contains(document.activeElement)) $('[data-go="accounts"]', app).focus({ preventScroll:true }); if (REDUCE || !el.animate) el.remove(); else { el.style.pointerEvents = 'none'; el.animate([{ opacity:1 }, { opacity:0, transform:'translateX(-6px)' }], { duration:180, easing:EASE, fill:'forwards' }).onfinish = () => el.remove(); } }
    counts(); chips(); if (on) navCurrent();
    if (!quiet) toast('ok', `Deleted “${v[0]}”`, 'Its filters stay on until you clear them', { label:'Undo', run:() => { SAVED[k] = v; const e2 = viewEl(k); viewsNav.appendChild(e2); enter(e2); storeViews(); counts(); chips(); } });
  }
  // Save view: a small dialog with the name, ready to type over; Enter saves, Escape or Cancel leaves it
  onOpen('.crm-save', () => {
    const p = pop('crm-p-save'), name = viewName();
    p.innerHTML = `<form class="crm-svf"><label class="crm-svl" for="crm-svn">Save these filters as a view</label><input id="crm-svn" class="crm-svi" value="${esc(name)}" maxlength="40" autocomplete="off" spellcheck="false" aria-describedby="crm-svd"><p class="crm-svd muted" id="crm-svd">${esc(F.A.map(fText).join(' · '))}</p><div class="crm-cfa"><button type="button" class="pill ghost sm" data-close>Cancel</button><button type="submit" class="pill primary sm">Save view</button></div></form>`;
    const i = $('.crm-svi', p); setTimeout(() => { i.focus({ preventScroll:true }); i.select(); }, 40);
    $('form', p).onsubmit = e => { e.preventDefault(); const n = i.value.trim() || name; closePops(); saveView(n); setTimeout(() => { if (!document.activeElement || document.activeElement === document.body || document.activeElement.closest('[hidden]')) $('.crm-ftr', app).focus({ preventScroll:true }); }, 0); };
  });

  /* ---------- search: what to ask, shown while the field is empty and focused ---------- */
  // each one is a question the field reads, shown with how many accounts it finds today; the ones that find none stay out
  const ASKS = ['accounts at risk', 'closing this month', 'no next step', 'quiet for 2 weeks', 'in negotiation over 250k', 'closing this month with no next step', 'healthy and over 500k', 'overdue next steps'];
  const sug = $('.crm-sug', app); let sugQuiet = false;
  const sugCount = t => { const { A } = parse(t); return A.length ? CO.filter(c => A.every(f => FL[f.k].test(c, f.v) !== f.neg)).length : 0; };
  function showSug(){
    if (!ask.value && view === 'accounts' && !sugQuiet){
      const L = ASKS.map(t => [t, sugCount(t)]).filter(x => x[1]).slice(0, 5);
      sug.innerHTML = `<div class="ph" role="none">Try asking</div>` + L.map(([t, n]) => `<button class="mi crm-sgi" data-q="${esc(t)}" tabindex="-1">${I('spark', 'xs')}<span>${esc(t[0].toUpperCase() + t.slice(1))}</span><span class="r num">${n}</span></button>`).join('');
      const hb = $('.crm-hd', app).getBoundingClientRect(), ab = $('.crm-ask', app).getBoundingClientRect(), cb = tableBox.getBoundingClientRect();
      sug.style.left = Math.max(8, ab.left - cb.left) + 'px'; sug.style.top = (ab.bottom - cb.top + 6) + 'px'; sug.style.width = Math.max(ab.width, 280) + 'px';
      sug.inert = false; sug.classList.add('open');
    } else hideSug();
  }
  const hideSug = () => { sug.classList.remove('open'); sug.inert = true; };
  hideSug();
  const pickSug = b => { ask.value = b.dataset.q; hideSug(); sugQuiet = true; ask.focus({ preventScroll:true }); runAsk(); sugQuiet = false; };
  ask.addEventListener('focus', showSug);
  ask.addEventListener('input', () => ask.value ? hideSug() : showSug());
  ask.addEventListener('blur', () => setTimeout(() => { if (!sug.contains(document.activeElement) && document.activeElement !== ask) hideSug(); }, 120));
  ask.addEventListener('keydown', e => { if (e.key === 'ArrowDown' && sug.classList.contains('open')){ e.preventDefault(); $('.crm-sgi', sug)?.focus(); } else if (e.key === 'Escape' && sug.classList.contains('open')){ e.preventDefault(); e.stopPropagation(); hideSug(); } });
  sug.addEventListener('mousedown', e => e.preventDefault());
  sug.addEventListener('click', e => { const b = e.target.closest('.crm-sgi'); if (b) pickSug(b); });
  sug.addEventListener('keydown', e => { const bs = $$('.crm-sgi', sug), i = bs.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); const j = i + (e.key === 'ArrowDown' ? 1 : -1); if (j < 0) ask.focus(); else bs[Math.min(j, bs.length - 1)].focus(); }
    else if (e.key === 'Escape' || e.key === 'Tab'){ if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); ask.focus(); } hideSug(); } });
  sug.addEventListener('focusout', () => setTimeout(() => { if (!sug.contains(document.activeElement) && document.activeElement !== ask) hideSug(); }, 120));
  addEventListener('resize', () => { if (sug.classList.contains('open')) showSug(); });


  /* ---------- notifications: Notifications ---------- */
  const ago = n => n >= 0 ? 'Today' : n === -1 ? 'Yesterday' : `${-n} days ago`;
  const lastWin = DE.filter(d => d.st === 'won' && RAW.some(r => r[0] === coOf(d.co).n && r[7].some(x => x[0] === d.n))).sort((a, b) => b.close - a.close)[0];
  const tideR = DE.find(d => coOf(d.co).n === 'Tidewell Energy' && d.n === 'Renewal');
  const NT = [
    { k:'deal', ic:'ok', col:'var(--dm-ok)', co:coOf(lastWin.co).n, t:`<b>${esc(coOf(lastWin.co).n)}</b> closed won: ${esc(lastWin.n)}, ${money(lastWin.v)}`, w:ago(lastWin.close) },
    { k:'men', av:'MK', co:'Halcyon Labs', t:'<b>Maya Kim</b> mentioned you on Halcyon Labs: "Can you join the pricing call?"', w:'40 min ago' },
    { k:'deal', ic:'alert', col:'var(--dm-warn)', co:'Tidewell Energy', t:`<b>Tidewell Energy</b> renewal passed its close date, ${fmtD(tideR.close)}`, w:ago(tideR.close) },
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
  nlist.addEventListener('click', e => { const b = e.target.closest('.ntx-n'); if (!b) return; const x = NT.find(n => n.co === b.dataset.co); x.read = true; paintN(); const c = CO.find(y => y.n === x.co); setTimeout(() => { if (c){ if (view === 'forecast') setView('accounts'); openSheet(c.id, true); } }, 140); b.setAttribute('data-close', ''); });
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

  /* ---------- jump to: Command palette ---------- */
  const over = $('.crm-cmd', app), q = $('.cpl-q', over), list = $('.cpl-list', over), st = $('.cpl-st', over);
  list.id = 'crm-cpl'; q.setAttribute('role', 'combobox'); q.setAttribute('aria-expanded', 'true'); q.setAttribute('aria-controls', list.id); q.setAttribute('aria-autocomplete', 'list');
  let items = [], hi = 0, back = null;
  const ACTIONS = () => [
    ['Go to', I('table', 'xs'), 'Accounts', 'Table', () => { F.A = []; renderTable(); setView('accounts'); }], ['Go to', I('spark', 'xs'), 'Agent inbox', waiting().length + ' waiting', () => setView('inbox')], ['Go to', I('cal', 'xs'), 'Calendar', 'Week', () => setView('calendar')],
    ['Go to', I('grid', 'xs'), 'Pipeline', 'Board', () => setView('pipeline')], ['Go to', I('chart', 'xs'), 'Forecast', 'Charts', () => setView('forecast')],
    ['Actions', I('spark', 'xs'), 'Plan follow-ups for quiet accounts', '', () => { setView('calendar'); planFollowUps(); }],
    ['Actions', I('plus', 'xs'), 'Add account', '', () => newAccount()], ['Actions', I('down', 'xs'), 'Export accounts in view', 'CSV', () => exportCsv(rows)],
    ['Actions', I('moon', 'xs'), isDark() ? 'Switch to light theme' : 'Switch to dark theme', '', () => th.click()],
  ];
  function paintCmd(){
    const v = q.value.trim().toLowerCase(), m = s => !v || s.toLowerCase().includes(v);
    const cos = CO.filter(c => m(c.n + ' ' + P[c.own][0] + ' ' + c.seg)).sort((a, b) => b.value - a.value).slice(0, v ? 6 : 4);
    const ds = v ? DE.filter(d => m(d.n + ' ' + coOf(d.co).n + ' ' + d.id)).slice(0, 5) : [];
    const R = [...ACTIONS().filter(a => m(a[2])).map(a => ({ g:a[0], ic:a[1], t:a[2], h:a[3], run:a[4] })),
      ...cos.map(c => ({ g:'Accounts', ic:`<span class="pfm-lg">${esc(c.n[0])}</span>`, t:c.n, h:`${kmoney(c.value)}, ${P[c.own][0]}`, run:() => { if (view === 'forecast') setView('accounts'); openSheet(c.id, true); } })),
      ...ds.map(d => ({ g:'Deals', ic:av(d.own), t:d.n, h:`${coOf(d.co).n}, ${ST[d.st].t}`, run:() => { setView('pipeline'); kFocus = d.id; renderBoard(); const el = $(`.kbx-k[data-id="${d.id}"]`, cols); if (el){ el.scrollIntoView({ block:'nearest', inline:'nearest' }); el.classList.add('open'); el.tabIndex = 0; el.focus(); } } }))];
    // nothing matched: ask the accounts table instead
    if (v && !R.length) R.push({ g:'Ask', ic:I('spark', 'xs'), t:`Ask the accounts: “${q.value.trim()}”`, h:'', run:() => { setView('accounts'); ask.value = q.value.trim(); askx.hidden = false; runAsk(); } });
    let h = '<span class="cpl-hl"></span>', g = '';
    R.forEach((x, i) => { if (x.g !== g){ g = x.g; h += `<div class="cpl-g" role="presentation">${g}</div>`; } h += `<button class="cpl-i" role="option" id="crm-cpl-${i}" tabindex="-1" data-i="${i}"><span class="ic">${x.ic}</span><span class="t">${esc(x.t)}</span>${x.h ? `<span class="h">${esc(x.h)}</span>` : ''}</button>`; });
    list.innerHTML = h; items = R; hi = 0; moveHi(0);
    st.innerHTML = plural(R.length, 'result');
  }
  function moveHi(d){ const bs = $$('.cpl-i', list); if (!bs.length){ q.removeAttribute('aria-activedescendant'); $('.cpl-hl', list).style.opacity = 0; return; } hi = (hi + d + bs.length) % bs.length; bs.forEach((b, i) => { b.classList.toggle('hl', i === hi); b.setAttribute('aria-selected', i === hi); }); const b = bs[hi], hl = $('.cpl-hl', list); hl.style.opacity = 1; hl.style.top = b.offsetTop + 'px'; q.setAttribute('aria-activedescendant', b.id); if (b.offsetTop < list.scrollTop + 30 || b.offsetTop + 36 > list.scrollTop + list.clientHeight) b.scrollIntoView({ block:'nearest' }); }
  const runItem = i => { const x = items[i]; closeCmd(false); if (x) x.run(); };
  function openCmd(){ if (over._closing) unfade(over); else if (!over.hidden) return; back = document.activeElement; over.hidden = false; q.value = ''; paintCmd(); drawer(false); closeCalPop(); q.focus(); }
  function closeCmd(restore = true){ if (over.hidden || over._closing) return; fadeOut(over); if (restore && back && back.isConnected) back.focus({ preventScroll:true }); }
  q.addEventListener('input', paintCmd);
  q.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); moveHi(e.key === 'ArrowDown' ? 1 : -1); } else if (e.key === 'Enter'){ e.preventDefault(); runItem(hi); } else if (e.key === 'Tab') e.preventDefault(); });
  list.addEventListener('click', e => { const b = e.target.closest('.cpl-i'); if (b) runItem(+b.dataset.i); });
  list.addEventListener('pointermove', e => { const b = e.target.closest('.cpl-i'); if (b && +b.dataset.i !== hi) moveHi(+b.dataset.i - hi); });
  over.addEventListener('pointerdown', e => { if (e.target === over) closeCmd(); });
  $('.crm-find', app).onclick = openCmd;

  /* ---------- Add account: Form ---------- */
  const nd = $('.crm-newd', app), form = $('form', nd), nin = $('[name="n"]', form), vin = $('[name="v"]', form);
  const SEGS = ['Enterprise', 'Mid-market', 'SMB', 'Strategic'];
  let nseg = null, nown = null, nback = null;
  const [segBox, ownBox] = $$('.fmx-ty', form);
  const paintPick = () => {
    // with nothing picked yet, the first chip is the radio group's Tab stop
    segBox.innerHTML = SEGS.map((s, i) => `<button type="button" class="chip sm${s === nseg ? ' on' : ''}" role="radio" aria-checked="${s === nseg}" tabindex="${s === nseg || (!nseg && !i) ? 0 : -1}" data-v="${s}">${s}</button>`).join('');
    ownBox.innerHTML = OWN.map((o, i) => `<button type="button" class="chip sm${o === nown ? ' on' : ''}" role="radio" aria-checked="${o === nown}" tabindex="${o === nown || (!nown && !i) ? 0 : -1}" data-v="${o}">${av(o)}${first(o)}</button>`).join('');
  };
  [segBox, ownBox].forEach((box, k) => {
    box.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; k ? nown = b.dataset.v : nseg = b.dataset.v; const fx = box.closest('.fmx-f'); fx.classList.remove('bad'); $('.er', fx)?.remove(); paintPick(); $$('.chip', box).find(x => x.dataset.v === b.dataset.v).focus(); });
    box.addEventListener('keydown', e => { const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0; if (!d) return; e.preventDefault(); const bs = $$('.chip', box), i = Math.max(-1, bs.findIndex(b => b.getAttribute('aria-checked') === 'true')); bs[((i < 0 && d < 0 ? 0 : i) + d + bs.length) % bs.length].click(); });
  });
  function newAccount(){ unfade(nd); nback = document.activeElement; nd.hidden = false; form.reset(); nseg = nown = null; $$('.fmx-f', form).forEach(f => { f.classList.remove('bad'); $('.er', f)?.remove(); }); paintPick(); drawer(false); setTimeout(() => nin.focus(), 30); }
  const closeNew = () => { if (nd.hidden || nd._closing) return; fadeOut(nd); if (nback && nback.isConnected) nback.focus({ preventScroll:true }); };
  $('.crm-new', app).onclick = newAccount;
  $('.crm-newx', form).onclick = closeNew;
  nd.addEventListener('pointerdown', e => { if (e.target === nd) closeNew(); });
  vin.addEventListener('blur', () => { const n = +vin.value.replace(/[^\d.]/g, ''); if (n) vin.value = money(n < 1000 ? n * 1000 : n); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = nin.value.trim(), f = nin.closest('.fmx-f');
    $$('.fmx-f', form).forEach(x => { x.classList.remove('bad'); $('.er', x)?.remove(); }); f.classList.toggle('bad', !name);
    if (!name){ f.insertAdjacentHTML('beforeend', '<span class="er">Give the account a name</span>'); nin.setAttribute('aria-invalid', 'true'); nin.focus(); return; }
    if (CO.some(c => c.n.toLowerCase() === name.toLowerCase())){ f.classList.add('bad'); f.insertAdjacentHTML('beforeend', `<span class="er">${esc(name)} is already an account</span>`); nin.focus(); return; }
    nin.removeAttribute('aria-invalid');
    // a segment and an owner are picked, never assumed
    const need = [[segBox, nseg, 'Pick a segment'], [ownBox, nown, 'Pick an owner']].filter(x => !x[1]);
    need.forEach(([box, , msg]) => { const fx = box.closest('.fmx-f'); fx.classList.add('bad'); fx.insertAdjacentHTML('beforeend', `<span class="er">${msg}</span>`); });
    if (need.length){ $('.chip', need[0][0]).focus(); return; }
    let v = +vin.value.replace(/[^\d.]/g, '') || 25000; if (v < 1000) v *= 1000;
    const i = nid, c = { id:'c' + (nid++), n:name, seg:nseg, tags:['First deal'], own:nown, reg:'na', last:0, lt:'Discovery', trend:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], log:[['Discovery', 0, 'Account added by Noah Cole', 'Noah Cole']], ppl:peopleOf(i), i, base:[] };
    CO.push(c); const d = { id:'DL-' + (did++), co:c.id, n:'First contract', st:'disc', v, close:toWork(60), adj:0, own:nown }; d.p = probOf(d); DE.push(d);
    fadeOut(nd); clearFilters(); setView('accounts'); refresh();
    const tr = $(`tr[data-id="${c.id}"]`, tbody); if (tr){ tr.scrollIntoView({ block:'nearest' }); enter(tr); focusRow(tr); }
    toast('ok', `${name} added`, `${P[nown][0]} owns it, with a ${money(v)} deal in Discovery. The agent suggests booking a first call`, { label:'Open', run:() => openSheet(c.id, true) });
  });

  /* ---------- keys: ⌘K, /, ?, and Escape closing one thing at a time ---------- */
  // on the window, so it runs before the core's Escape on the document: an open menu is the core's to close
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); over.hidden || over._closing ? openCmd() : closeCmd(); return; }
    if (e.key === 'Escape'){
      if ($('.pop.open', app) || e.target.closest?.('.crm-ta') || (e.target === ask && ask.value)) return;
      if (!over.hidden && !over._closing){ e.preventDefault(); closeCmd(); return; }
      if (!nd.hidden && !nd._closing){ e.preventDefault(); closeNew(); return; }
      if (!dlw.hidden && !dlw._closing){ e.preventDefault(); closeDel(); return; }
      if (popFor){ e.preventDefault(); closeCalPop(); return; }
      if (ibv.classList.contains('pv')){ pvOpen(false); $(`[data-ib="${ibSel}"] .crm-it`, igs)?.focus({ preventScroll:true }); return; }
      if (app.classList.contains('dr')){ drawer(false); $('.crm-menu', app).focus(); return; }
      if (sheetFor){ closeSheet(); return; }
      if (SG.length && view === 'calendar'){ SG = []; renderCal(); swap(cmsg, ''); return; }
      if (sel.size && view === 'accounts'){ sel.clear(); syncSel(); }
      return;
    }
    // Tab stays inside what covers the screen: the drawer, a phone's sheet or preview, the delete question, Add account
    if (e.key === 'Tab'){
      const box = !dlw.hidden && !dlw._closing ? dlg : !nd.hidden && !nd._closing ? form : app.classList.contains('dr') ? $('.crm-side', app)
        : sheetFor && matchMedia('(max-width:520px)').matches ? sheet : ibv.classList.contains('pv') && phone() ? ipv : null;
      if (box && !$('.pop.open', app)){
        const f = $$('button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])', box).filter(x => !x.disabled && x.getClientRects().length && !x.closest('[inert],[hidden]'));
        if (f.length){ const i = f.indexOf(document.activeElement);
          if (e.shiftKey && i <= 0){ e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && (i === f.length - 1 || i < 0)){ e.preventDefault(); f[0].focus(); } }
      }
    }
    const typing = e.target.closest && e.target.closest('input,textarea,[contenteditable="true"]');
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '/' && over.hidden && nd.hidden){ e.preventDefault(); if (view === 'pipeline') kq.focus(); else { if (view !== 'accounts') setView('accounts'); ask.focus(); } }
    if (e.key === '?' && over.hidden && nd.hidden){ e.preventDefault(); help(); }
  }, true);

  /* ---------- focus rings show for the keyboard only: a click or tap hides them until a key is pressed ---------- */
  document.addEventListener('pointerdown', () => app.dataset.ptr = '', true);
  document.addEventListener('keydown', e => { if (!['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) delete app.dataset.ptr; }, true);

  /* ---------- everything follows the data ---------- */
  function refresh(){ derive(); renderTable(); renderBoard(); renderInbox(); if (view === 'calendar') renderCal(); if (view === 'forecast') renderForecast(); if (sheetFor) renderSheet(); counts(); }
  const tsc = $('.crm-sc', app); tsc.addEventListener('scroll', () => tsc.classList.toggle('sx', tsc.scrollLeft > 2), { passive:true });
  // the account column sticks right after the checkbox column, however wide that column comes out, so nothing shows between them
  const stk = $('.crm-t th.stk', app); new ResizeObserver(() => $('.crm-t', app).style.setProperty('--crm-stk', stk.getBoundingClientRect().width + 'px')).observe(stk);
  derive(); renderTable(); renderBoard(); renderInbox(); setView('accounts'); stagger($$('tr[data-id]', tbody).slice(0, 16), 22);
  // a link to an account (#c3) opens it
  const h = location.hash.slice(1); if (h && coOf(h)) openSheet(h);
})();
