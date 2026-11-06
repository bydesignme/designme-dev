// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, hold, html, swap } from '../core/core.js';
DM.def('web-search', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs'));
  // the searches: what was asked, how many results, how long it took, and the pages it opened. The first finds nothing and is
  // asked again in other words
  const Q = [
    { q:'stripe usage based billing limits 2026 enterprise tier', n:0, ms:'0.6s' },
    { q:'stripe usage-based billing limits', n:5, ms:'0.9s', from:0, p:[
      ['Usage-based billing', 'stripe.com', 'Oct 2026', 'read'], ['Meters and billing thresholds', 'stripe.com', 'Sep 2026', 'read', 1],
      ['How we moved 40k customers to usage billing', 'medium.com', 'Mar 2026', 'skim'], ['Why SaaS pricing is moving to usage', 'ft.com', 'Aug 2026', 'paywall'] ] },
    { q:'metronome vs orb usage billing', n:6, ms:'1.1s', p:[
      ['Metronome vs Orb: a fair comparison', 'metronome.com', 'Jul 2026', 'read', 2], ['Orb pricing and plans', 'withorb.com', 'Oct 2026', 'read'],
      ['orb-billing/examples: sending usage events', 'github.com', 'Jun 2026', 'read'], ['Anyone switched from Stripe Billing to Orb?', 'reddit.com', 'May 2026', 'blocked'] ] }
  ];
  const ST = { read:['Read', ''], skim:['Skimmed', ''], paywall:['Skipped: paywall', 'warn'], blocked:['Skipped: blocked', 'warn'], timeout:['Skipped: timeout', 'warn'] };
  const root = $('.wsx', r), head = $('.wsx-h', r), ic = $('.wsx-ic', r), st = $('.wsx-st', r), marks = $('.wsx-marks', r), fold = $('.wsx-fold', r), list = $('.wsx-list', r), ans = $('.wsx-ans', r), sr = $('.wsx-sr', r);
  const say = t => { sr.textContent = t; };
  const setOpen = o => { head.setAttribute('aria-expanded', o); fold.classList.toggle('shut', !o); };
  head.onclick = () => setOpen(head.getAttribute('aria-expanded') !== 'true');
  const sites = [];
  const drawMarks = () => { const u = [...new Set(sites)]; marks.innerHTML = u.slice(0, 4).map(s => `<span data-s="${s}">${s[0].toUpperCase()}</span>`).join('') + (u.length > 4 ? `<span class="n">+${u.length - 4}</span>` : ''); };
  const qOpen = (el, o) => { const b = $('.wsx-qh', el), f = $('.fold', el); if (!f) return; b.setAttribute('aria-expanded', o); f.classList.toggle('shut', !o); };
  const pages = {};
  let done = false;
  c.run(async () => {
    await c.wait(500);
    for (const [k, q] of Q.entries()){
      const el = html(`<div class="wsx-q" data-k="${k}"><button class="wsx-qh${q.n ? '' : ' empty'}" aria-expanded="false">${I('search','xs')}<span class="t shim">${q.q}</span><span class="n">Searching</span><span class="tm num"></span>${I('chev-r','xs')}</button>${q.from != null ? `<span class="wsx-rw">${I('refresh','xs')}Asked again in other words</span>` : ''}${q.p ? '<div class="fold shut"><div><ul class="wsx-rs"></ul></div></div>' : ''}</div>`);
      list.appendChild(el); enter(el); swap(st, `Searching for “${q.q}”`);
      const b = $('.wsx-qh', el); b.onclick = () => { if ($('.fold', el)) qOpen(el, b.getAttribute('aria-expanded') !== 'true'); };
      await c.wait(1100);
      $('.t', b).classList.remove('shim'); $('.tm', b).textContent = q.ms;
      const n = $('.n', b); n.textContent = q.n ? `${q.n} results` : 'No results'; n.classList.toggle('none', !q.n);
      b.setAttribute('aria-label', `${q.q}: ${q.n ? q.n + ' results' : 'no results'}, ${q.ms}`);
      say(q.n ? `${q.n} results for ${q.q}` : `No results for ${q.q}. Asking again in other words`);
      if (!q.p){ await c.wait(500); continue; }
      qOpen(el, true); const ul = $('.wsx-rs', el);
      swap(st, `Reading ${q.p.length} pages`);
      for (const [t, d, when, s, cite] of q.p){
        const li = html(`<li class="wsx-r" tabindex="0" data-tip="${t} · ${d}"><span class="wsx-fav" aria-hidden="true">${d[0].toUpperCase()}</span><span class="tx"><span class="t">${t}</span><span class="d">${d} · ${when}</span></span><span class="tag"><span class="spin"></span>Reading</span></li>`);
        ul.appendChild(li); enter(li); sites.push(d); drawMarks(); if (cite) pages[cite] = { li, q:el, d };
        await c.wait(420);
        const g = $('.tag', li); g.className = 'tag ' + ST[s][1]; g.textContent = ST[s][0]; li.classList.toggle('skip', s !== 'read' && s !== 'skim');
        li.setAttribute('aria-label', `${t}, ${d}, ${when}: ${ST[s][0]}`);
      }
      await c.wait(500); qOpen(el, false);
    }
    // done: the trail folds to one line, and the answer streams in under it, citing its pages
    done = true; ic.innerHTML = I('globe','xs'); st.classList.remove('shim');
    const read = Q.flatMap(q => q.p || []).filter(p => p[3] === 'read' || p[3] === 'skim').length;
    swap(st, `${Q.length} searches, ${read} pages read`); say(`Done: ${Q.length} searches, ${read} pages read`);
    await c.wait(400); hold(root); setOpen(false);
    const A = 'Stripe caps metered usage at 100 million events a month for each meter [1]. Metronome and Orb both take events in bulk with no monthly cap [2]. At your volume Stripe still fits, with room to grow.'.split(' ');
    for (let i = 1; i <= A.length; i++){ ans.innerHTML = A.slice(0, i).join(' ').replace(/\[(\d)\]/g, (m, k) => `<button class="wsx-cite" data-c="${k}" aria-label="Source ${k}: ${$('.t', pages[k].li).textContent}, ${pages[k].d}" data-tip="${$('.t', pages[k].li).textContent} · ${pages[k].d}">${k}</button>`); await c.wait(50); }

  });
  // a citation lights the page it came from (and the query that found it), and its site's mark
  const light = k => { $$('.wsx-r.hl, .wsx-q.hl', r).forEach(x => x.classList.remove('hl')); $$('.wsx-marks span', r).forEach(x => x.classList.remove('hl')); $$('.wsx-cite', r).forEach(x => x.classList.toggle('on', x.dataset.c === k)); if (!k) return;
    const p = pages[k]; const shown = !$('.fold', p.q).classList.contains('shut') && head.getAttribute('aria-expanded') === 'true'; (shown ? p.li : p.q).classList.add('hl'); const m = $(`.wsx-marks span[data-s="${p.d}"]`, r); if (m) m.classList.add('hl'); };
  c.on(ans, 'pointerover', e => { const b = e.target.closest('.wsx-cite'); if (b) light(b.dataset.c); });
  c.on(ans, 'pointerout', e => { const b = e.target.closest('.wsx-cite'); if (b && !b.contains(e.relatedTarget)) light(null); });
  c.on(ans, 'focusin', e => { const b = e.target.closest('.wsx-cite'); if (b) light(b.dataset.c); });
  c.on(ans, 'focusout', () => light(null));
  // the preview's story: open the trail again, open the search that found source 2, and point at [2]
  if (r === c.st) c.story(async s => {
    await s.until(() => done && $('.wsx-cite[data-c="2"]', r)); await s.beat(4);
    await s.tap(head); await s.beat(2);
    await s.tap($('.wsx-q[data-k="2"] .wsx-qh', r)); await s.beat(2);
    const b = $('.wsx-cite[data-c="2"]', r); await s.point(b); light('2'); await s.beat(4);
    light(null); s.away(); await s.beat(2);
  });
});
