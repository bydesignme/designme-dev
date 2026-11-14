// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, html, swap, tip } from '../core/core.js';
DM.def('agent-tree', (r, c) => {
  // a welcome-email run. Nothing but the orchestrator is on screen at the start: each agent and step appears when it is
  // spawned, and its elbow draws in. cost and tok are what that node spends itself; a branch shows the rollup
  const money = v => '$' + (v < 0 ? 0 : v).toFixed(2);
  const fmtTok = n => { n = Math.max(0, Math.round(n)); if (n >= 10000) return Math.round(n / 1000) + 'k'; if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'; return String(n); };
  const clock = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  const G = { run:'<span class="spin"></span>', done:I('ok','xs'), fail:I('alert','xs'), wait:I('hand','xs'), queued:'<span class="dot"></span>' };
  const root = $('.atr', r), tree = $('.atr-tree', r), stEl = $('.atr-st', r), tot = $('.atr-tot', r), detail = $('.atr-detail', r);
  const chatLive = $('.atr-chat-live', r);
  const all = []; const seen = new Set();
  let booting = true, hover = null, selected = null, ended = 0, t0 = performance.now();
  const by = id => all.find(n => n.id === id);
  const sum = n => n.cost + n.kids.reduce((a, k) => a + sum(k), 0);
  const sumTok = n => n.tok + n.kids.reduce((a, k) => a + sumTok(k), 0);
  const kids = n => n.kids.length > 0;
  const elapsed = n => { if (!n.ran) return ''; const end = n.doneAt || performance.now(); return clock(Math.floor((end - n.ran) / 1000)); };
  const elbow = () => { const host = root.closest('[data-style]') || document.documentElement; return host.getAttribute('data-style') === 'soft' ? 8 : 0; };

  function rowEl(n){
    n.el = html(`<div class="atr-n ${n.s}" data-id="${n.id}" role="treeitem" aria-level="${n.lv + 1}" aria-selected="false" tabindex="-1"><span class="atr-sp"></span><span class="atr-g">${G[n.s]}</span><span class="atr-t"><span class="atr-nm"><b></b><span class="atr-time num"></span></span><span class="atr-task"></span></span><span class="atr-meta"><span class="atr-c num"></span><span class="atr-tok num"></span></span></div>`);
    $('.atr-nm b', n.el).textContent = n.n;
    $('.atr-task', n.el).textContent = n.t;
    return n.el;
  }
  function ensureKids(n){
    if (n.fold) return;
    const sp = $('.atr-sp', n.el);
    if (sp){ const tg = html(`<span class="atr-tg" aria-hidden="true">${I('chev-d','xs')}</span>`); sp.replaceWith(tg); }
    n.el.setAttribute('aria-expanded', 'true');
    n.fold = html('<div class="fold atr-kids"><div class="atr-nest"><svg class="atr-svg" aria-hidden="true"></svg></div></div>');
    n.nest = $('.atr-nest', n.fold);
    n.item.appendChild(n.fold);
  }
  function add(parent, spec){
    const n = { id:spec.id, n:spec.n, t:spec.t, s:spec.s || 'run', cost:spec.cost || 0, tok:spec.tok || 0, kids:[], parent, lv:parent ? parent.lv + 1 : 0, ran:0, doneAt:0, fold:null, nest:null };
    if (n.s === 'run' || n.s === 'wait' || n.s === 'fail') n.ran = performance.now();
    if (parent) parent.kids.push(n);
    all.push(n);
    n.item = html('<div class="atr-item"></div>');
    rowEl(n);
    n.item.appendChild(n.el);
    if (!parent) tree.appendChild(n.item);
    else { ensureKids(parent); parent.nest.appendChild(n.item); }
    if (!booting){ enter(n.el); schedule(); }
    return n;
  }
  function setStatus(n, s, t){
    n.s = s;
    if ((s === 'run' || s === 'wait' || s === 'fail') && !n.ran) n.ran = performance.now();
    if (s === 'done' || s === 'fail') n.doneAt = n.doneAt || performance.now();
    if (s === 'run') n.doneAt = 0;
    n.el.classList.remove('queued', 'run', 'done', 'fail', 'wait');
    n.el.classList.add(s);
    const g = $('.atr-g', n.el); g.innerHTML = G[s]; if (!booting) enter(g);
    if (t !== undefined){ n.t = t; swap($('.atr-task', n.el), t); }
    const ask = $('.atr-ask', n.el); if (ask && s !== 'fail' && s !== 'wait') ask.remove();
    if (!booting) schedule();
  }
  function showAsk(n, kind, label, onYes, noLabel){
    const old = $('.atr-ask', n.el); if (old) old.remove();
    const box = $('.atr-t', n.el);
    const ask = kind === 'fix'
      ? html('<span class="atr-ask"><button type="button" class="pill sm atr-fix"></button></span>')
      : html('<span class="atr-ask"><button type="button" class="pill primary sm atr-yes"></button><button type="button" class="pill sm atr-no"></button></span>');
    box.appendChild(ask);
    if (kind === 'fix'){ const b = $('.atr-fix', ask); b.textContent = label; b.onclick = e => { e.stopPropagation(); onYes(); }; }
    else {
      const yes = $('.atr-yes', ask), no = $('.atr-no', ask);
      yes.textContent = label; no.textContent = noLabel || 'Hold';
      yes.onclick = e => { e.stopPropagation(); onYes(); };
      no.onclick = e => { e.stopPropagation(); setStatus(n, 'wait', 'Held for you'); paint(); };
    }
    if (!booting){ enter(ask); schedule(); }
  }
  function lineage(id){ const out = new Set(); for (let p = id && by(id); p; p = p.parent) out.add(p.id); return out; }
  function applyPath(){
    const hot = lineage(hover || (selected && selected.id));
    const running = new Set();
    all.forEach(n => { if (n.s === 'run') for (let p = n; p; p = p.parent) running.add(p.id); });
    const tip = hover || (selected && selected.id);
    all.forEach(n => n.el.classList.toggle('path', n.id === tip));
    $$('.atr-wire', root).forEach(w => { w.classList.toggle('live', running.has(w.dataset.id)); w.classList.toggle('on', hot.has(w.dataset.id)); });
    $$('.atr-flow', root).forEach(w => { if (!running.has(w.dataset.id)) w.remove(); });
  }
  function layout(){
    const R = elbow();
    const running = new Set();
    all.forEach(n => { if (n.s === 'run') for (let p = n; p; p = p.parent) running.add(p.id); });
    const hot = lineage(hover || (selected && selected.id));
    $$('.atr-nest', root).forEach(nest => {
      const svg = $('.atr-svg', nest); if (!svg) return;
      const w = nest.clientWidth, h = nest.clientHeight;
      if (w < 2 || h < 2) return;
      const rail = (parseFloat(getComputedStyle(nest).paddingLeft) || 20) / 2;
      svg.setAttribute('width', String(w)); svg.setAttribute('height', String(h)); svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      const items = [...nest.children].filter(el => el.classList.contains('atr-item'));
      const keep = new Set();
      let prev = 0;
      items.forEach(item => {
        const row = $(':scope>.atr-n', item); if (!row) return;
        const id = row.dataset.id; keep.add(id);
        const nb = nest.getBoundingClientRect(), rb = row.getBoundingClientRect();
        const y = rb.top - nb.top + rb.height / 2;
        const r = Math.min(R, Math.max(0, y - prev - 1));
        const x = Math.max(rail + r + 10, rb.left - nb.left + 4);
        const turn = y - r;
        const d = r < 2
          ? 'M ' + rail + ' ' + prev + ' V ' + y + ' H ' + x
          : 'M ' + rail + ' ' + prev + ' V ' + turn + ' Q ' + rail + ' ' + y + ' ' + (rail + r) + ' ' + y + ' H ' + x;
        prev = r < 2 ? y : turn;
        let wire = svg.querySelector('.atr-wire[data-id="' + id + '"]');
        if (!wire){
          wire = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          wire.setAttribute('class', 'atr-wire'); wire.dataset.id = id; svg.appendChild(wire);
        }
        wire.setAttribute('d', d);
        const len = Math.max(1, Math.ceil(wire.getTotalLength()));
        if (!seen.has(id)){
          seen.add(id);
          if (!REDUCE){
            wire.style.setProperty('--dm-len', String(len));
            wire.classList.add('draw');
            wire.addEventListener('animationend', () => { wire.classList.remove('draw'); wire.style.removeProperty('--dm-len'); }, { once:true });
          }
        } else if (!wire.classList.contains('draw')) wire.style.removeProperty('--dm-len');
        else wire.style.setProperty('--dm-len', String(len));
        const st = by(id) && by(id).s;
        wire.classList.toggle('live', running.has(id) && st !== 'fail' && st !== 'wait');
        wire.classList.toggle('bad', st === 'fail');
        wire.classList.toggle('wait', st === 'wait');
        wire.classList.toggle('on', hot.has(id));
        let flow = svg.querySelector('.atr-flow[data-id="' + id + '"]');
        if (running.has(id) && !REDUCE){
          if (!flow){ flow = document.createElementNS('http://www.w3.org/2000/svg', 'path'); flow.setAttribute('class', 'atr-flow'); flow.dataset.id = id; svg.appendChild(flow); }
          flow.setAttribute('d', d);
        } else if (flow) flow.remove();
      });
      $$('.atr-wire, .atr-flow', svg).forEach(p => { if (!keep.has(p.dataset.id)) p.remove(); });
    });
    const tip = hover || (selected && selected.id);
    all.forEach(n => n.el.classList.toggle('path', n.id === tip));
  }
  let frame = 0;
  const schedule = () => { if (booting) return; cancelAnimationFrame(frame); frame = requestAnimationFrame(layout); };
  const ro = new ResizeObserver(schedule);
  function paint(){
    all.forEach(n => {
      const v = kids(n) ? sum(n) : n.cost, tk = kids(n) ? sumTok(n) : n.tok;
      const ce = $('.atr-c', n.el), te = $('.atr-tok', n.el), tm = $('.atr-time', n.el);
      const cost = n.s === 'queued' && v < 0.005 ? '–' : money(v);
      const tok = n.s === 'queued' && tk < 1 ? '' : fmtTok(tk);
      if (ce.textContent !== cost) ce.textContent = cost;
      if (te.textContent !== tok) te.textContent = tok;
      const elap = n.s === 'queued' || !n.ran ? '' : elapsed(n);
      const shown = n.s !== 'run' && elap === '0:00' ? '' : elap;
      if (tm.textContent !== shown) tm.textContent = shown;
      if (kids(n)) ce.dataset.tip = 'Its own ' + money(n.cost) + ', ' + n.kids.length + (n.lv ? (n.kids.length > 1 ? ' steps ' : ' step ') : (n.kids.length > 1 ? ' agents ' : ' agent ')) + money(sum(n) - n.cost) + (sumTok(n) ? ' · ' + fmtTok(sumTok(n)) + ' tokens' : '');
    });
    const total = all.length ? sum(all[0]) : 0;
    tot.textContent = money(total);
    const failed = all.filter(n => n.s === 'fail').length, waiting = all.filter(n => n.s === 'wait').length, finished = all[0] && all[0].s === 'done';
    const line = finished ? 'Done' : failed ? (failed + ' step' + (failed > 1 ? 's' : '') + ' failed') : waiting ? 'Needs you' : 'Running';
    const m = $('.m', stEl); if (m && m.textContent !== line && !m.classList.contains('out')) swap(m, line);
    const secs = Math.floor(((ended || performance.now()) - t0) / 1000);
    const ck = $('.ck', stEl); if (ck) ck.textContent = clock(secs);
    if (detail && selected){
      const n = selected, k = n.kids.length, own = money(n.cost), tk = sumTok(n);
      const rest = k ? ' · ' + k + (n.lv ? (k > 1 ? ' steps ' : ' step ') : (k > 1 ? ' agents ' : ' agent ')) + ' ' + money(sum(n) - n.cost) : '';
      const word = n.s === 'run' ? 'running' : n.s === 'wait' ? 'needs you' : n.s === 'fail' ? 'failed' : n.s === 'done' ? 'done' : 'queued';
      const text = n.n + ' · its own ' + own + rest + (tk ? ' · ' + fmtTok(tk) + ' tokens' : '') + ' · ' + word;
      if (detail.textContent !== text) detail.textContent = text;
    }
    if (chatLive){
      const mode = finished ? 'done' : failed ? 'fail' : waiting ? 'wait' : 'run';
      const label = finished ? 'Done' : failed ? 'A step failed' : waiting ? 'Needs you' : 'Working';
      chatLive.classList.remove('run', 'wait', 'fail', 'done'); chatLive.classList.add(mode);
      const lt = $('.atr-chat-lt', chatLive); if (lt && lt.textContent !== label) lt.textContent = label;
    }
  }
  function select(n){
    if (!n) return;
    selected = n;
    all.forEach(x => { x.el.tabIndex = x === n ? 0 : -1; x.el.setAttribute('aria-selected', x === n ? 'true' : 'false'); });
    paint(); applyPath();
  }
  function toggle(n, open){
    if (!kids(n)) return;
    const o = open ?? n.el.getAttribute('aria-expanded') !== 'true';
    n.el.setAttribute('aria-expanded', String(o));
    n.fold.classList.toggle('shut', !o); n.fold.inert = !o;
    schedule();
  }
  function wipe(){
    tree.textContent = '';
    const sm = $('.atr-sum', root); if (sm) sm.remove();
    all.splice(0, all.length); seen.clear(); selected = null; hover = null;
  }
  // the tallest moment: every branch open, the approval sitting under its step, and the summary underneath. Measured once,
  // hidden from the first paint, so the stage can keep the tree centred while it is still only the orchestrator
  function mountFull(){
    const T = add(null, { id:'root', n:'Brief', t:'Welcome email is ready', s:'done', cost:.04, tok:240 });
    const reader = add(T, { id:'reader', n:'Reader', t:'Notes and sends are in', s:'done', cost:.02, tok:90 });
    add(reader, { id:'r1', n:'Read the last 3 sends', t:'3 emails, 1.1k words', s:'done', cost:.05, tok:640 });
    add(reader, { id:'r2', n:'Pull the voice notes', t:'Tone, length, words to keep', s:'done', cost:.04, tok:380 });
    const writer = add(T, { id:'writer', n:'Writer', t:'Draft is in the voice notes', s:'done', cost:.03, tok:160 });
    add(writer, { id:'w1', n:'Draft the subject', t:'Four options, shortest wins', s:'done', cost:.04, tok:420 });
    const w2 = add(writer, { id:'w2', n:'Draft the body', t:'Runs past 90 words', s:'fail', cost:.06, tok:880 });
    showAsk(w2, 'fix', 'Trim to 90 words', () => {});
    const checker = add(T, { id:'checker', n:'Checker', t:'Approve the send', s:'wait', cost:.02, tok:120 });
    add(checker, { id:'c1', n:'Count the words and the tone', t:'86 words, tone matches', s:'done', cost:.04, tok:510 });
    showAsk(checker, 'wait', 'Approve send', () => {}, 'Hold');
    root.appendChild(html('<div class="atr-sum">' + I('ok','xs') + '<span>Done in 0:12 · 3 agents · $0.48 · 4.4k tokens</span></div>'));
  }
  mountFull();
  root._full = root.offsetHeight;
  wipe();
  booting = false;
  t0 = performance.now();
  const T = add(null, { id:'root', n:'Brief', t:'Splitting the welcome email', s:'run', cost:.02, tok:80 });
  select(T);
  ro.observe(root); c.offs.push(() => ro.disconnect());
  schedule();

  c.every(100, () => {
    if (ended) return;
    all.forEach(n => { if (n.s === 'run'){ n.cost += n.lv ? .0015 : .0005; n.tok += n.lv ? 22 : 8; } });
    paint();
  });
  paint();

  const visible = () => all.filter(n => { for (let p = n.parent; p; p = p.parent) if (p.fold && p.el.getAttribute('aria-expanded') === 'false') return false; return true; });
  c.on(tree, 'pointerover', e => { if (e.pointerType && e.pointerType !== 'mouse') return; const row = e.target.closest('.atr-n'); hover = row ? row.dataset.id : null; applyPath(); });
  c.on(tree, 'pointerleave', () => { hover = null; applyPath(); });
  c.on(tree, 'focusin', e => { const row = e.target.closest('.atr-n'); if (!row) return; const n = by(row.dataset.id); if (n) select(n); });
  c.on(tree, 'click', e => {
    if (e.target.closest('button')) return;
    const row = e.target.closest('.atr-n'); if (!row) return;
    const n = by(row.dataset.id); if (!n) return;
    select(n); toggle(n);
  });
  c.on(tree, 'keydown', e => {
    if (e.target.closest('button')) return;
    const v = visible(), i = v.findIndex(n => n.el === document.activeElement); if (i < 0) return;
    const n = v[i], open = n.el.getAttribute('aria-expanded') === 'true'; let go = null;
    if (e.key === 'ArrowDown') go = v[i + 1];
    else if (e.key === 'ArrowUp') go = v[i - 1];
    else if (e.key === 'ArrowRight'){ if (kids(n) && !open) toggle(n, true); else if (kids(n)) go = n.kids[0]; }
    else if (e.key === 'ArrowLeft'){ if (kids(n) && open) toggle(n, false); else go = n.parent; }
    else if (e.key === 'Home') go = v[0];
    else if (e.key === 'End') go = v[v.length - 1];
    else if (e.key === 'Enter' || e.key === ' '){ const yes = $('.atr-yes, .atr-fix', n.el); if (yes) yes.click(); else toggle(n); }
    else return;
    e.preventDefault();
    if (go){ select(go); go.el.focus({ preventScroll:true }); }
  });

  // the run grows itself. A draft runs long and offers a trim, then the checker waits for approval. Either way the demo
  // continues on its own unless a person has taken over
  let fixGo = null, yesGo = null;
  c.run(async () => {
    await c.wait(380);
    const reader = add(T, { id:'reader', n:'Reader', t:'Gathers the last sends and the voice notes', s:'run', cost:.01, tok:40 });
    await c.wait(420);
    const r1 = add(reader, { id:'r1', n:'Read the last 3 sends', t:'3 emails, 1.1k words', s:'run', cost:.02, tok:120 });
    await c.wait(980);
    setStatus(r1, 'done', '3 emails, 1.1k words');
    const r2 = add(reader, { id:'r2', n:'Pull the voice notes', t:'Tone, length, words to keep', s:'run', cost:.02, tok:80 });
    await c.wait(980);
    setStatus(r2, 'done'); setStatus(reader, 'done', 'Notes and sends are in');
    const writer = add(T, { id:'writer', n:'Writer', t:'Drafts the subject and the body', s:'run', cost:.02, tok:70 });
    const w1 = add(writer, { id:'w1', n:'Draft the subject', t:'Under 50 characters', s:'run', cost:.02, tok:140 });
    await c.wait(1100);
    setStatus(w1, 'done', 'Four options, shortest wins');
    const w2 = add(writer, { id:'w2', n:'Draft the body', t:'Under 90 words', s:'run', cost:.03, tok:220 });
    await c.wait(1100);
    setStatus(w2, 'fail', 'Runs past 90 words'); setStatus(writer, 'run', 'The draft runs long'); paint();
    await new Promise(res => { fixGo = () => { fixGo = null; res(); }; showAsk(w2, 'fix', 'Trim to 90 words', () => fixGo && fixGo()); c.auto(4500, () => fixGo && fixGo()); });
    setStatus(w2, 'run', 'Trimming it to 90 words'); setStatus(writer, 'run', 'Drafts the body'); paint();
    await c.wait(1000);
    setStatus(w2, 'done', '86 words, in the voice notes'); setStatus(writer, 'done', 'Draft is in the voice notes');
    const checker = add(T, { id:'checker', n:'Checker', t:'Checks length and tone', s:'run', cost:.01, tok:60 });
    const c1 = add(checker, { id:'c1', n:'Count the words and the tone', t:'Against the voice notes', s:'run', cost:.02, tok:180 });
    await c.wait(1000);
    setStatus(c1, 'done', '86 words, tone matches'); setStatus(checker, 'wait', 'Approve the send'); paint();
    await new Promise(res => { yesGo = () => { yesGo = null; res(); }; showAsk(checker, 'wait', 'Approve send', () => yesGo && yesGo(), 'Hold'); c.auto(4800, () => yesGo && yesGo()); });
    setStatus(checker, 'run', 'Sending is approved'); paint();
    await c.wait(860);
    setStatus(checker, 'done', 'Length and tone check out'); setStatus(T, 'done', 'Welcome email is ready');
    ended = performance.now(); paint();
    const agents = T.kids.length;
    const sm = html('<div class="atr-sum">' + I('ok','xs') + '<span></span></div>');
    $('span', sm).textContent = 'Done in ' + clock(Math.floor((ended - t0) / 1000)) + ' · ' + agents + ' agent' + (agents === 1 ? '' : 's') + ' · ' + money(sum(T)) + ' · ' + fmtTok(sumTok(T)) + ' tokens';
    root.appendChild(sm); enter(sm);
  });

  c.story(async s => {
    await s.beat(2);
    await s.until(() => by('r1'));
    hover = 'r1'; applyPath();
    await s.point(by('r1').el); await s.beat(3); hover = null; applyPath(); s.away();
    await s.until(() => $('.atr-fix', r)); await s.beat(5);
    await s.tap($('.atr-fix', r)); s.away();
    await s.until(() => $('.atr-yes', r)); await s.beat(5);
    await s.point(by('checker').el); hover = 'checker'; applyPath(); await s.beat(2);
    await s.tap($('.atr-yes', r)); hover = null; applyPath(); s.away();
    await s.until(() => ended); await s.beat(2);
    if (by('reader')){ await s.tap(by('reader').el); s.away(); }
    await s.beat(1);
  });
});
