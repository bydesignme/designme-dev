// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, enter, html, seg, swap } from '../core/core.js';
DM.def('eval-results', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{play}', I('play','xs'));
  // eight checks on the pricing page's copy. The price check fails after the copy agent's latest edit, until it's fixed
  const K = [
    { n:'Names the Pro seat limit', tm:'0.6s' },
    { n:'Prices match the billing table', tm:'0.9s', bad:true, exp:'$24 a seat, billed yearly', got:'$29 a seat, billed yearly', src:'Billing table, Pro row' },
    { n:'Mentions the yearly discount', tm:'0.5s' },
    { n:'Makes no “unlimited” claims', tm:'0.4s' },
    { n:'Team plan lists SSO', tm:'0.5s' },
    { n:'Reads at grade 8 or below', tm:'0.7s' },
    { n:'One call to action per plan', tm:'0.5s' },
    { n:'Free plan says no card is needed', tm:'0.6s' }
  ].map(k => ({ ...k, s:'pass' }));
  const LAST = 8;
  const list = $('.evr-list', r), segs = $('.evr-segs', r), pass = $('.evr-pass', r), dl = $('.evr-dl', r), st = $('.evr-st', r), run = $('.evr-run', r), none = $('.evr-none', r), sg = $('.evr-tabs .seg2', r);
  const G = { run:'<span class="spin"></span>', pass:I('ok','xs'), fail:I('alert','xs'), queued:'<span class="dot"></span>' };
  let filter = 'all', busy = false, ran = false;
  K.forEach((k, i) => {
    k.w = html(`<div class="fold evr-w"><div><div class="evr-i" role="listitem"></div></div></div>`); k.el = $('.evr-i', k.w); k.i = i; list.appendChild(k.w);
    k.seg = document.createElement('i'); segs.appendChild(k.seg);
  });
  // a case's row: a failed one is a button that opens what was expected and what came back
  function paint(k, fresh){
    const open = k.s === 'fail' && k.open;
    k.el.className = 'evr-i ' + k.s;
    const g = `<span class="evr-g">${G[k.s]}</span><span class="evr-n">${k.n}</span><span class="evr-tm num">${k.s === 'pass' || k.s === 'fail' ? k.tm : ''}</span>`;
    k.el.innerHTML = k.s === 'fail'
      ? `<button class="evr-r" aria-expanded="${!!open}">${g}<span class="evr-ch">${I('chev-d','xs')}</span></button><div class="fold evr-d${open ? '' : ' shut'}"><div><div class="evr-dd"><span class="evr-kv"><span class="k">Expected</span><span>${k.exp}</span></span><span class="evr-kv"><span class="k">Got</span><span class="bad">${k.got}</span></span><span class="evr-kv"><span class="k">Source</span><span>${k.src}</span></span><button class="pill sm evr-fix">Use $24 and rerun</button></div></div></div>`
      : `<div class="evr-r">${g}</div>`;
    if (k.s === 'fail'){
      const d = $('.evr-d', k.el); d.inert = !open;
      $('.evr-r', k.el).onclick = () => { k.open = !k.open; $('.evr-r', k.el).setAttribute('aria-expanded', k.open); d.classList.toggle('shut', !k.open); d.inert = !k.open; };
      $('.evr-fix', k.el).onclick = () => fix(k);
    }
    if (fresh) enter($('.evr-g', k.el));
    k.seg.className = k.s;
  }
  function counts(){
    const p = K.filter(k => k.s === 'pass').length, f = K.filter(k => k.s === 'fail').length, done = K.every(k => k.s === 'pass' || k.s === 'fail');
    swap(pass, done ? `${p} of ${K.length} passed` : busy ? `Running ${K.filter(k => k.s === 'pass' || k.s === 'fail').length + 1} of ${K.length}` : 'Running the case again');
    const d = !ran || !done ? '' : p < LAST ? `${LAST - p} fewer than the last run` : 'All passing';
    if (dl.textContent !== d){ dl.textContent = d; dl.className = 'tag evr-dl ' + (p < LAST ? 'bad' : 'ok'); if (d) enter(dl); }
    $('[data-v="all"] .n', sg).textContent = K.length; $('[data-v="fail"] .n', sg).textContent = f;
    show();
  }
  // All shows every case; Failed folds the others away
  function show(){
    K.forEach(k => { const on = filter === 'all' || k.s === 'fail'; k.w.classList.toggle('shut', !on); k.w.inert = !on; });
    none.hidden = !(filter === 'fail' && !K.some(k => k.s === 'fail'));
  }
  seg(sg, v => { filter = v; show(); });
  K.forEach(k => paint(k)); counts();
  // a run checks the cases one after another; the price check fails until the copy is fixed
  run.onclick = () => c.run(async () => {
    if (busy) return; busy = true; ran = true; run.disabled = true; run.innerHTML = '<span class="spin"></span>Running';
    K.forEach(k => { k.s = 'queued'; k.open = false; paint(k); }); counts();
    for (const k of K){
      k.s = 'run'; paint(k, true); counts();
      await c.wait(500);
      k.s = k.bad ? 'fail' : 'pass'; paint(k, true); counts();
    }
    busy = false; run.disabled = false; run.innerHTML = I('play','xs') + 'Run again'; swap(st, 'Copy agent · 8 cases · run just now');
  });
  // the fix changes the copy to the billing table's price and runs that case again
  function fix(k){
    if (busy) return;
    c.run(async () => {
      k.bad = false; k.open = false; k.s = 'run'; paint(k, true); counts();
      await c.wait(1000);
      k.s = 'pass'; paint(k, true); counts();
    });
  }
  // the preview's story: run the evals, see one fail against the last run, open it, take the fix, and see all eight pass
  c.story(async s => {
    await s.beat(3);
    await s.tap(run); s.away();
    await s.until(() => !busy); await s.beat(3);
    await s.tap($('[data-v="fail"]', sg)); s.away(); await s.beat(2);
    await s.tap($('.evr-i.fail .evr-r', r)); s.away(); await s.beat(3);
    await s.tap($('.evr-fix', r)); s.away();
    await s.until(() => K.every(k => k.s === 'pass')); await s.beat(2);
    await s.tap($('[data-v="all"]', sg)); s.away(); await s.beat(2);
  });
});
