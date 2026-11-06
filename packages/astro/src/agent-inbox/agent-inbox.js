// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, html, swap, tip } from '../core/core.js';
DM.def('agent-inbox', (r, c) => {
  // the runs, grouped by what they need: one waits for approval, one failed and can be retried, two are running with their
  // clocks, two are done
  const A = { 'Design agent':['D','var(--dm-av-l)'], 'Build agent':['B','var(--dm-av-m)'], 'Research agent':['R','var(--dm-av-t)'], 'Copy agent':['C','var(--dm-av-p)'], 'QA agent':['Q','var(--dm-av-b)'] };
  const R = [
    { id:'pub', t:'Publish the pricing page', a:'Design agent', g:'needs', why:'Waiting for your approval' },
    { id:'tok', t:'Export tokens to CSS', a:'Build agent', g:'needs', fail:true, why:'Failed: rate limited by Figma', tip:'Figma answered 429 at 10:42. Safe to retry' },
    { id:'cards', t:'Rework the plan cards', a:'Design agent', g:'run', sec:102, doing:'Editing frame 3 of 6' },
    { id:'cmp', t:'Compare 3 competitor pages', a:'Research agent', g:'run', sec:38, doing:'Reading page 3 of 3' },
    { id:'copy', t:'Rewrite plan descriptions', a:'Copy agent', g:'done', ago:'12m ago' },
    { id:'aud', t:'Audit pricing contrast', a:'QA agent', g:'done', ago:'25m ago' }
  ];
  const GR = [['needs', 'Needs you'], ['run', 'Running'], ['done', 'Done']];
  const gs = $('.aib-gs', r), st = $('.aib-st', r);
  gs.innerHTML = GR.map(([k, n]) => `<section class="aib-g" data-g="${k}" aria-label="${n}"><div class="aib-gh"><span>${n}</span><span class="n"></span></div><div class="aib-gl" role="list"></div></section>`).join('');
  const clock = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  const meta = x => x.g === 'needs' ? x.why : x.g === 'run' ? x.doing : x.a;
  const right = x => x.g === 'needs' ? (x.fail ? `<button class="pill sm aib-go" aria-label="Retry ${x.t}">${I('refresh','xs')}Retry</button>` : `<button class="pill primary sm aib-go" aria-label="Approve ${x.t}">Approve</button>`)
    : x.g === 'run' ? `<span class="spin"></span><span class="num aib-ck">${clock(x.sec)}</span>` : `<span class="ok">${I('ok','xs')}</span><span>${x.ago}</span>`;
  function row(x){
    const [m, col] = A[x.a];
    x.el = html(`<div class="aib-i" role="listitem"><span class="aib-av" style="background:${col};color:${col.replace(')', '-ink)')}" aria-hidden="true">${m}</span><span class="aib-t"><b>${x.t}</b><span></span></span><span class="aib-r"></span></div>`);
    update(x, true); return x.el;
  }
  function update(x, now){
    const el = x.el, sp = $('.aib-t span', el), rr = $('.aib-r', el);
    el.classList.toggle('fail', !!x.fail && x.g === 'needs');
    if (x.tip && x.g === 'needs') sp.dataset.tip = x.tip; else delete sp.dataset.tip;
    if (now){ sp.textContent = meta(x); rr.innerHTML = right(x); } else { swap(sp, meta(x)); rr.innerHTML = right(x); enter(rr); }
    const b = $('.aib-go', el); if (b) b.onclick = () => act(x);
  }
  const list = g => $(`.aib-g[data-g="${g}"] .aib-gl`, gs);
  R.forEach(x => list(x.g).appendChild(row(x)));
  function counts(){
    // a group with nothing in it goes away, and the line at the top says what is left
    GR.forEach(([k]) => { const n = R.filter(x => x.g === k).length, sec = $(`.aib-g[data-g="${k}"]`, gs); $('.n', sec).textContent = n; sec.hidden = !n; });
    const need = R.filter(x => x.g === 'needs').length, run = R.filter(x => x.g === 'run').length, done = R.filter(x => x.g === 'done').length;
    const t = need ? `${need} need${need > 1 ? '' : 's'} you` : run ? `${run} running` : `All clear · ${done} done today`;
    if (!st.textContent) st.textContent = t; else swap(st, t);
  }
  counts();
  // a run that moves glides to its place in the new group: rows and group titles are measured before and after, and eased
  // from where they were; the moving row rides above the rest, and a group that comes back fades in
  const ease = getComputedStyle(r).getPropertyValue('--dm-ease').trim() || 'ease';
  const shown = () => $$('.aib-g:not([hidden]) .aib-gh,.aib-g:not([hidden]) .aib-i', gs);
  function move(x, g){
    const first = new Map(shown().map(e => [e, e.getBoundingClientRect().top]));
    x.g = g; update(x); list(g).prepend(x.el); counts();
    if (REDUCE) return;
    x.el.classList.add('mv'); c.later(440, () => x.el.classList.remove('mv'));
    shown().forEach(e => { if (!first.has(e)) return enter(e); const d = first.get(e) - e.getBoundingClientRect().top; if (Math.abs(d) > 1) e.animate([{ transform:`translateY(${d}px)` }, { transform:'none' }], { duration:420, easing:ease }); });
  }
  // every running run's clock ticks
  c.every(1000, () => R.forEach(x => { if (x.g === 'run'){ x.sec++; const ck = $('.aib-ck', x.el); if (ck) ck.textContent = clock(x.sec); } }));
  // Approve starts the run and Retry tries a failed one again; either runs, then lands in Done
  function act(x){
    const retry = !!x.fail; x.fail = false; x.sec = 0; x.doing = retry ? 'Retrying the export' : 'Publishing to designme.studio/pricing';
    move(x, 'run');
    c.later(retry ? 5000 : 4000, () => { x.ago = 'Just now'; move(x, 'done'); });
  }
  // the research run finishes on its own while you look
  c.later(6000, () => { const x = R.find(y => y.id === 'cmp'); if (x.g === 'run'){ x.ago = 'Just now'; move(x, 'done'); } });
  // the preview's story: read why the export failed, approve the publish, and retry the export
  c.story(async s => {
    const by = id => R.find(x => x.id === id);
    await s.beat(3);
    await s.point($('.aib-t span', by('tok').el)); await s.beat(3);
    await s.tap($('.aib-go', by('pub').el)); s.away(); await s.beat(5);
    await s.tap($('.aib-go', by('tok').el)); s.away();
    await s.until(() => by('tok').g === 'done' && by('pub').g === 'done'); await s.beat(3);
  });
});
