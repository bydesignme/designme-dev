// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, html, seg, swap, tween } from '../core/core.js';
/* three accounts on Mon Nov 9. A factor's points add up to the score: contact 30, deals on time 25, win chance 25 and next
   step 20. Each factor has its status (ok, warn, bad), its figure and unit, a line for screen readers (say), a small trend
   (contact by week, a mark per open deal, win chance by week) and the lines its detail shows. The agent's suggestion has its
   button, what it says once done, and the factors it changes (after) */
const HSC = [
  { n:'Granite Peak Systems', seg:'Strategic, Americas', was:85,
    f:{
      contact:{ s:'ok', fig:'2d', unit:'ago', say:'last touch 2 days ago', pts:28, max:30, tr:['dots', [1, 1, 1, 1, 1, 1]],
        lines:['Last touch Nov 7, a pricing call with Dana Ruiz.', 'In touch every week for the last 6 weeks.'] },
      late:{ s:'ok', fig:'0', unit:'late', say:'no deal past its close date', pts:25, max:25, tr:['bars', [0, 0, 0]],
        lines:['3 open deals, none past its close date.', 'Next to close: Platform renewal, Nov 24.'] },
      win:{ s:'ok', fig:'62%', unit:'', say:'62% across the open deals', pts:16, max:25, tr:['spark', [54, 55, 57, 58, 60, 62]],
        lines:['62% weighted across 3 open deals.', 'Up from 54% six weeks ago.'] },
      next:{ s:'ok', fig:'Thu', unit:'in 3 days', say:'pricing call on Thursday', pts:20, max:20, tr:null,
        lines:['Pricing call, Thu Nov 12, 9am, with Dana Ruiz.'] }
    },
    sug:{ t:'The pricing call is on Thursday. Send Dana the updated quote before it.', b:'Draft email', ic:'mail',
      done:'Email to Dana drafted with the updated quote. It waits in your outbox for review.', tag:'Drafted' } },
  { n:'Fernway Travel', seg:'Mid-market, Asia Pacific', was:71,
    f:{
      contact:{ s:'warn', fig:'11d', unit:'ago', say:'quiet for 11 days', pts:18, max:30, tr:['dots', [1, 1, 1, 1, 1, 0]],
        lines:['Last touch Oct 29, an email to Sam Patel. No reply yet.', 'In touch in 5 of the last 6 weeks.'] },
      late:{ s:'ok', fig:'0', unit:'late', say:'no deal past its close date', pts:25, max:25, tr:['bars', [0, 0]],
        lines:['2 open deals, both before their close date.', 'Next to close: First contract, Dec 15.'] },
      win:{ s:'ok', fig:'61%', unit:'', say:'61% across the open deals', pts:15, max:25, tr:['spark', [66, 66, 65, 64, 62, 61]],
        lines:['61% weighted across 2 open deals.', 'Down from 66% six weeks ago.'] },
      next:{ s:'warn', fig:'None', unit:'booked', say:'no next step booked', pts:0, max:20, tr:null,
        lines:['Nothing is booked with Fernway Travel.', 'Booking a meeting adds 20 points.'] }
    },
    sug:{ t:'Quiet for 11 days with nothing booked. Book a check-in with Sam this week.', b:'Book check-in', ic:'cal',
      done:'Check-in with Sam booked for Wed Nov 11, 10am. Health 58 to 78.', tag:'Booked',
      after:{ next:{ s:'ok', fig:'Wed', unit:'in 2 days', say:'check-in on Wednesday', pts:20,
        lines:['Check-in, Wed Nov 11, 10am, with Sam Patel.', 'Booked by the agent just now.'] } } } },
  { n:'Tidewell Energy', seg:'Enterprise, Asia Pacific', was:41,
    f:{
      contact:{ s:'bad', fig:'38d', unit:'ago', say:'quiet for 38 days', pts:0, max:30, tr:['dots', [1, 0, 0, 0, 0, 0]],
        lines:['Last touch Oct 2, a demo follow-up with Priya Shah.', 'In touch in 1 of the last 6 weeks.'] },
      late:{ s:'bad', fig:'1', unit:'late', say:'1 deal 6 days past its close date', pts:9, max:25, tr:['bars', [1, 0]],
        lines:['Renewal was due Nov 3 and is still open, 6 days late.', '1 of 2 open deals is past its close date.'] },
      win:{ s:'warn', fig:'33%', unit:'', say:'33% across the open deals', pts:8, max:25, tr:['spark', [52, 50, 46, 41, 36, 33]],
        lines:['33% weighted across 2 open deals.', 'Down from 52% six weeks ago.'] },
      next:{ s:'bad', fig:'6d', unit:'overdue', say:'next step overdue since Nov 3', pts:0, max:20, tr:null,
        lines:['Renewal call, due Tue Nov 3. Not held or moved.'] }
    },
    sug:{ t:'38 days quiet and the renewal is 6 days late. Call Priya to reset the date.', b:'Book call', ic:'cal',
      done:'Call with Priya booked for Tue Nov 10, 9am. Health 17 to 37, still at risk.', tag:'Booked',
      after:{ next:{ s:'ok', fig:'Tue', unit:'tomorrow', say:'renewal call tomorrow', pts:20,
        lines:['Renewal call, Tue Nov 10, 9am, with Priya Shah.', 'Booked by the agent just now, in place of the overdue step.'] } } } }
];
DM.def('health-score', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{spark}', I('spark', 's'));
  // each account keeps what the agent did for it, so switching away and back shows the booking still there
  const AC = JSON.parse(JSON.stringify(HSC));
  const K = ['contact', 'late', 'win', 'next'], L = { contact:'Contact', late:'On time', win:'Win chance', next:'Next step' };
  const SW = { ok:'On track', warn:'Watch', bad:'At risk' }, VD = { ok:'Healthy', warn:'Watch', bad:'At risk' }, C = 2 * Math.PI * 18;
  const id = 'hsc' + Math.random().toString(36).slice(2, 7);
  let A = AC[1];
  const score = () => K.reduce((t, k) => t + A.f[k].pts, 0);
  const band = v => v >= 70 ? 'ok' : v >= 50 ? 'warn' : 'bad';
  const delta = v => (v - A.was >= 0 ? '+' : '−') + Math.abs(v - A.was) + ' in 30 days';
  const onTrack = () => { const n = K.filter(k => A.f[k].s === 'ok').length; return n === K.length ? `all ${n} on track` : `${n} of ${K.length} on track`; };
  // the weakest factor that is off track: the lowest share of its points, the first one on a tie. None when all are on track
  const weakest = () => K.filter(k => A.f[k].s !== 'ok').sort((a, b) => A.f[a].pts / A.f[a].max - A.f[b].pts / A.f[b].max || K.indexOf(a) - K.indexOf(b))[0];
  const trend = f => {
    if (!f.tr) return '';
    const [k, v] = f.tr;
    if (k === 'dots') return `<span class="hsc-dots">${v.map(x => `<i${x ? ' class="on"' : ''}></i>`).join('')}</span>`;
    if (k === 'bars') return `<span class="hsc-bars">${v.map(x => `<i${x ? ' class="late"' : ''}></i>`).join('')}</span>`;
    const lo = Math.min(...v), hi = Math.max(...v), pt = v.map((y, i) => [2 + i * 52 / (v.length - 1), 3 + (1 - (y - lo) / (hi - lo || 1)) * 14]), e = pt[pt.length - 1];
    return `<svg class="hsc-sp" viewBox="0 0 56 20"><polyline points="${pt.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ')}"/><circle cx="${e[0].toFixed(1)}" cy="${e[1].toFixed(1)}" r="2.5"/></svg>`;
  };
  const tile = (k, i) => `<button type="button" class="hsc-t" data-k="${k}" aria-expanded="false" aria-controls="${id}-d${i < 2 ? 0 : 1}">
      <span class="hsc-k"><i class="hsc-dot"></i><span>${L[k]}</span></span><span class="hsc-wk" aria-hidden="true">Weakest</span>${I('chev-d', 'xs hsc-cv')}
      <span class="hsc-v"><b class="num"></b><span></span></span><span class="hsc-tr" aria-hidden="true"></span></button>`;
  const region = j => `<div class="fold shut hsc-d" id="${id}-d${j}" role="region" aria-label="Details"><div><div class="hsc-dc"></div></div></div>`;
  const root = $('.hsc', r), g = $('.hsc-g', root);
  g.innerHTML = tile(K[0], 0) + tile(K[1], 1) + region(0) + tile(K[2], 2) + tile(K[3], 3) + region(1);
  const ring = $('.hsc-ring', root), fl = $('.fl', ring), num = $('b', ring), an = $('.hsc-ac b', root), as = $('.hsc-ac span', root);
  const vd = $('.hsc-vd', root), sub = $('.hsc-sub', root), dl = $('.hsc-dl', root), sr = $('.hsc-sr', root);
  const tiles = $$('.hsc-t', root), regs = $$('.hsc-d', root), sug = $('.hsc-s', root), st = $('.hsc-st', sug);

  // ---- paint: the header, the tiles and an open detail follow the factors. After the first time everything that changes
  // crossfades, the ring sweeps and the score counts to its new value
  let shown = 0, run = 0, open = null;
  function paint(first){
    const v = score(), b = band(v), w = weakest();
    root.dataset.v = b;
    ring.setAttribute('aria-label', `Health ${v} of 100, ${VD[b].toLowerCase()}, ${v - A.was >= 0 ? 'up' : 'down'} ${Math.abs(v - A.was)} in 30 days`);
    const sweep = () => { fl.style.strokeDashoffset = (C * (1 - v / 100)).toFixed(2); const t = ++run; tween(shown, v, 900, n => { if (t !== run) return; shown = n; num.textContent = Math.round(n); }); };
    first ? c.later(140, sweep) : sweep();
    const words = [VD[b], `Account health, ${onTrack()}`, delta(v)];
    [vd, sub, dl].forEach((el, i) => first ? el.textContent = words[i] : swap(el, words[i]));
    tiles.forEach(t => {
      const k = t.dataset.k, f = A.f[k], fig = $('.hsc-v b', t), unit = $('.hsc-v span', t), tr = $('.hsc-tr', t), tx = trend(f);
      t.dataset.s = f.s; t.toggleAttribute('data-weak', k === w);
      t.setAttribute('aria-label', `${L[k]}: ${f.say}. ${SW[f.s]}${k === w ? ', the weakest factor' : ''}`);
      if (first){ fig.textContent = f.fig; unit.textContent = f.unit; tr.innerHTML = tx; }
      else { swap(fig, f.fig); swap(unit, f.unit); if (tr._tx !== tx) swap(tr, tx, true); }
      tr._tx = tx;
    });
  }

  // ---- a tile opens its detail under its pair; one at a time
  function fill(k, how){
    const f = A.f[k], i = K.indexOf(k), reg = regs[i < 2 ? 0 : 1], dc = $('.hsc-dc', reg);
    dc.innerHTML = f.lines.map(l => `<p class="hsc-dp">${l}</p>`).join('') + `<p class="hsc-pt num"><span>${f.pts} of ${f.max} points</span><i></i><span>${SW[f.s]}</span></p>`;
    reg.setAttribute('aria-label', L[k] + ' details');
    if (how === 'enter') enter(dc);
    else if (how === 'fade' && !REDUCE) dc.animate([{ opacity:0 }, { opacity:1 }], { duration:260, easing:'ease-out' });
  }
  function toggle(k){
    const was = open; open = open === k ? null : k;
    const ri = open ? (K.indexOf(open) < 2 ? 0 : 1) : -1, wasRi = was ? (K.indexOf(was) < 2 ? 0 : 1) : -1;
    if (open) fill(open, wasRi === ri ? 'enter' : null);
    regs.forEach((reg, j) => reg.classList.toggle('shut', j !== ri));
    tiles.forEach(t => t.setAttribute('aria-expanded', String(t.dataset.k === open)));
  }
  tiles.forEach(t => t.onclick = () => toggle(t.dataset.k));

  // ---- the agent's suggestion: its button works, shows it is busy, says what it did, and the factors it changes update.
  // The work belongs to the account it was pressed for, even if another account is showing by the time it lands
  const draw = (go, acct) => {
    if (!acct.busy){ go.disabled = false; go.removeAttribute('aria-busy'); go.style.width = ''; go.innerHTML = I(acct.sug.ic, 'xs') + acct.sug.b; return; }
    if (go.offsetWidth) go.style.width = go.offsetWidth + 'px';
    go.disabled = true; go.setAttribute('aria-busy', 'true'); go.innerHTML = '<span class="spin" aria-hidden="true"></span><span class="hsc-sr">Working</span>';
  };
  function control(){
    if (A.done) return html(`<span class="tag ok hsc-done" tabindex="-1">${I('check', 'xs')}${A.sug.tag}</span>`);
    const go = html('<button type="button" class="pill primary sm hsc-go"></button>'), acct = A;
    draw(go, acct); go.onclick = () => act(acct, go);
    return go;
  }
  function act(acct, go){
    if (acct.busy || acct.done) return;
    const had = document.activeElement === go;
    acct.busy = true; draw(go, acct);
    c.run(async () => {
      await c.wait(900);
      acct.busy = false; acct.done = true;
      const after = acct.sug.after || {};
      Object.keys(after).forEach(k => Object.assign(acct.f[k], after[k]));
      if (acct !== A) return;
      const n = control(); $('.hsc-go,.hsc-done', sug).replaceWith(n); enter(n); if (had) n.focus();
      swap(st, acct.sug.done);
      paint(false); if (open) fill(open, null);
      sr.textContent = acct.sug.done;
    });
  }

  // ---- an account: its name, its factors and its suggestion. Switching crossfades what changes, and an open detail stays
  // open on the same factor of the new account
  function show(i, first){
    A = AC[i];
    const words = [A.n, A.seg, A.done ? A.sug.done : A.sug.t];
    [an, as, st].forEach((el, j) => first ? el.textContent = words[j] : swap(el, words[j]));
    const n = control(); $('.hsc-go,.hsc-done', sug).replaceWith(n); if (!first) enter(n);
    paint(first);
    if (open) fill(open, 'fade');
    if (!first) sr.textContent = `${A.n}, health ${score()} of 100, ${VD[band(score())].toLowerCase()}`;
  }
  const sg = $('.demo .seg2', r);
  seg(sg, v => show(+v));
  show(1, true);
  // the trends draw in once the tiles have arrived
  if (!REDUCE) $$('.hsc-tr', root).forEach((el, i) => el.firstElementChild && el.firstElementChild.animate(
    [{ clipPath:'inset(-4px 100% -4px -4px)' }, { clipPath:'inset(-4px -4px -4px -4px)' }],
    { duration:700, delay:260 + i * 70, easing:'cubic-bezier(.45,0,.2,1)', fill:'backwards' }));

  // the preview's story, once: Watch is showing, the person books the check-in the agent suggests and Next step turns green,
  // then they switch to the account at risk. After that it stays as it is, for the visitor
  c.story(async s => {
    await s.beat(5);
    await s.tap($('.hsc-go', sug)); s.away();
    await s.until(() => AC[1].done); await s.beat(5);
    await s.tap($$('button', sg)[2]); s.away();
    // played once: ending the story here, rather than returning, skips the core's replay loop
    throw 'stop';
  });
});
