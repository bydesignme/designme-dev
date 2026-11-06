// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, enter, html, swap } from '../core/core.js';
DM.def('agent-tree', (r, c) => {
  // the run: an orchestrator, its three agents and their steps. cost is what each spends on its own, in dollars; a branch
  // shows its own cost plus everything under it
  const T = { id:'root', n:'Orchestrator', t:'Plans the work and hands it out', cost:.04, s:'run', kids:[
    { id:'res', n:'Research agent', t:'Compare 3 competitor pricing pages', cost:.02, s:'done', kids:[
      { id:'res1', n:'Read the 3 pricing pages', t:'3 pages, 9.4k words', cost:.06, s:'done' },
      { id:'res2', n:'Summarise their plans', t:'Notes added to Pricing v4', cost:.04, s:'done' } ] },
    { id:'des', n:'Design agent', t:'Rework the plan cards in Figma', cost:.02, s:'run', kids:[
      { id:'des1', n:'Update the Pro card', t:'Pricing v4, frame 2', cost:.03, s:'run' },
      { id:'des2', n:'Update the Team card', t:'Pricing v4, frame 3', cost:0, s:'queued' },
      { id:'des3', n:'Apply library tokens', t:'Colour and spacing', cost:0, s:'queued' } ] },
    { id:'cop', n:'Copy agent', t:'Rewrite the plan descriptions', cost:0, s:'queued' } ] };
  const tree = $('.atr-tree', r), stEl = $('.atr-st', r), tot = $('.atr-tot', r), root = $('.atr', r);
  const all = []; (function walk(n, lv, p){ n.lv = lv; n.parent = p; all.push(n); (n.kids || []).forEach(k => walk(k, lv + 1, n)); })(T, 0, null);
  const by = id => all.find(n => n.id === id), kids = n => !!(n.kids && n.kids.length);
  const sum = n => n.cost + (n.kids || []).reduce((a, k) => a + sum(k), 0), money = v => '$' + v.toFixed(2);
  const G = { run:'<span class="spin"></span>', done:I('ok','xs'), fail:I('alert','xs'), queued:'<span class="dot"></span>' };
  function build(n){
    const row = html(`<div class="atr-n ${n.s}" role="treeitem" aria-level="${n.lv + 1}"${kids(n) ? ' aria-expanded="true"' : ''} tabindex="-1" style="--dm-lv:${n.lv}">${kids(n) ? `<span class="atr-tg" aria-hidden="true">${I('chev-d','xs')}</span>` : '<span class="atr-sp"></span>'}<span class="atr-g">${G[n.s]}</span><span class="atr-t"><b>${n.n}</b><span>${n.t}</span></span><span class="atr-c num"></span></div>`);
    n.el = row; const out = [row];
    if (kids(n)){ const f = html(`<div class="fold atr-kids" role="group" style="--dm-lv:${n.lv}"><div></div></div>`); n.kids.forEach(k => build(k).forEach(e => f.firstElementChild.appendChild(e))); n.fold = f; out.push(f); }
    return out;
  }
  build(T).forEach(e => tree.appendChild(e)); T.el.tabIndex = 0;
  // each branch folds by its row (or its chevron); folded, it keeps its total
  function toggle(n, open){
    if (!kids(n)) return; const o = open ?? n.el.getAttribute('aria-expanded') !== 'true';
    n.el.setAttribute('aria-expanded', o); n.fold.classList.toggle('shut', !o); n.fold.inert = !o;
  }
  function paint(){
    all.forEach(n => { const ce = $('.atr-c', n.el), v = kids(n) ? sum(n) : n.cost;
      ce.textContent = n.s === 'queued' && !v ? '–' : money(v);
      if (kids(n)){ const k = n.kids.length, what = n.lv ? (k > 1 ? ' steps ' : ' step ') : (k > 1 ? ' agents ' : ' agent ');
        ce.dataset.tip = `Its own ${money(n.cost)}, ${k}${what}${money(sum(n) - n.cost)}`; } });
    tot.textContent = money(sum(T));
  }
  // the line under the title: what the run is doing, and a clock
  const t0 = performance.now(); let ended = 0;
  const clock = () => { const s = Math.floor(((ended || performance.now()) - t0) / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  stEl.innerHTML = '<span class="m" aria-live="polite">Running</span> · <span class="num ck">0:00</span>';
  const setMode = m => swap($('.m', stEl), m);
  // whatever is running spends as it goes, so its cost and every total above it count up
  c.every(100, () => { all.forEach(n => { if (n.s === 'run') n.cost += n.lv ? .0016 : .0006; }); paint(); $('.ck', stEl).textContent = clock(); });
  paint();
  function step(n, s, t){ n.s = s; n.el.className = 'atr-n ' + s; const g = $('.atr-g', n.el); g.innerHTML = G[s]; enter(g); if (t !== undefined) swap($('.atr-t span', n.el), t); paint(); }
  // clicking a branch folds it; the arrow keys move through the tree as in any tree view
  c.on(tree, 'click', e => { const row = e.target.closest('.atr-n'); if (!row || e.target.closest('.atr-fix')) return; const n = all.find(x => x.el === row); all.forEach(x => x.el.tabIndex = x === n ? 0 : -1); toggle(n); });
  const visible = () => all.filter(n => { for (let p = n.parent; p; p = p.parent) if (p.el.getAttribute('aria-expanded') === 'false') return false; return true; });
  c.on(tree, 'keydown', e => {
    const v = visible(), i = v.findIndex(n => n.el === document.activeElement); if (i < 0) return;
    const n = v[i], open = n.el.getAttribute('aria-expanded') === 'true'; let go = null;
    if (e.key === 'ArrowDown') go = v[i + 1]; else if (e.key === 'ArrowUp') go = v[i - 1];
    else if (e.key === 'ArrowRight'){ if (kids(n) && !open) toggle(n, true); else if (kids(n)) go = n.kids[0]; }
    else if (e.key === 'ArrowLeft'){ if (kids(n) && open) toggle(n, false); else go = n.parent; }
    else if (e.key === 'Enter' || e.key === ' ') toggle(n);
    else if (e.key === 'Home') go = v[0]; else if (e.key === 'End') go = v[v.length - 1];
    else return;
    e.preventDefault(); if (go){ all.forEach(x => x.el.tabIndex = -1); go.el.tabIndex = 0; go.el.focus({ preventScroll:true }); }
  });
  // the run: the design agent works through its steps, one fails on a token the library doesn't have, and the fix it offers
  // waits for you
  c.run(async () => {
    await c.wait(2000); step(by('des1'), 'done'); step(by('des2'), 'run');
    await c.wait(2500); step(by('des2'), 'done'); step(by('des3'), 'run');
    await c.wait(2000);
    const tk = by('des3'); step(tk, 'fail', "color.accent.600 isn't in the library"); setMode('1 step failed');
    const fix = html(`<button class="pill sm atr-fix">Use color.accent.500</button>`); $('.atr-t', tk.el).appendChild(fix); enter(fix);
    await new Promise(res => { fix.onclick = res; });
    fix.remove(); step(tk, 'run', 'Using color.accent.500'); setMode('Running');
    await c.wait(2000); step(tk, 'done', 'Colour and spacing, from the library'); step(by('des'), 'done'); step(by('cop'), 'run');
    await c.wait(3000); step(by('cop'), 'done'); step(T, 'done'); ended = performance.now(); setMode('Done');
    const sm = html(`<div class="atr-sum">${I('ok','xs')}<span>Done in ${clock()} · 3 agents · ${money(sum(T))}</span></div>`); root.appendChild(sm); enter(sm);
  });
  // the finished research starts folded, as a done branch would
  toggle(by('res'), false);
  // the preview's story: read a branch's cost, take the fix when a step fails, and fold the design branch once it's done
  c.story(async s => {
    await s.beat(3);
    await s.point($('.atr-c', by('des').el)); await s.beat(4); s.away();
    await s.until(() => $('.atr-fix', r)); await s.beat(4);
    await s.tap($('.atr-fix', r)); s.away();
    await s.until(() => T.s === 'done'); await s.beat(2);
    await s.tap(by('des').el); s.away(); await s.beat(1);
  });
});
