// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, swap, tween } from '../core/core.js';
DM.def('score-breakdown', (r, c) => {
  // the factors, their weight (the points each can earn), the points earned, the agent's one-line note, and what it would change
  const F = [
    { n:'Accuracy', w:40, e:34, c:'var(--dm-c1)', note:'2 wrong refund amounts in 120 tickets' },
    { n:'Speed', w:20, e:11, c:'var(--dm-c2)', note:'Median reply 6.4s, target under 4s', fix:{ t:'Cache the search results between steps and run the two account lookups at once.', to:17, gain:'About 2.1s faster a reply', after:'Median reply 4.3s, close to the target' } },
    { n:'Cost', w:20, e:16, c:'var(--dm-c3)', note:'$0.11 a ticket, budget $0.12' },
    { n:'Safety', w:20, e:19, c:'var(--dm-c4)', note:'No policy breaks, 1 tone flag' }
  ];
  const LAST = 77;
  const g = $('.sbx-g', r), svg = $('svg', g), vb = $('.sbx-v b', r), bw = $('.sbx-bw', r), ch = $('.sbx-ch', r), list = $('.sbx-list', r);
  const total = () => F.reduce((t, f) => t + f.e, 0), band = s => s >= 90 ? 'Excellent' : s >= 75 ? 'Good' : s >= 60 ? 'Fair' : 'Needs work';
  const weakest = () => F.reduce((m, f, i) => f.e / f.w < F[m].e / F[m].w ? i : m, 0);
  // the gauge: a half circle split by weight, with a small gap between the segments
  const CX = 100, CY = 100, RAD = 86, GAP = .04;
  const at = a => [CX + Math.cos(a) * RAD, CY + Math.sin(a) * RAD];
  const arc = (a0, a1) => { const [x0, y0] = at(a0), [x1, y1] = at(a1); return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${RAD} ${RAD} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`; };
  let a = Math.PI; const SEG = F.map(f => { const span = f.w / 100 * Math.PI, s = [a + GAP / 2, a + span - GAP / 2]; a += span; return s; });
  svg.innerHTML = F.map((f, i) => `<g data-i="${i}"><path class="tr" d="${arc(...SEG[i])}"/><path class="fl" style="stroke:${f.c}" d=""/></g>`).join('');
  const G = $$('g', svg);
  const fill = (i, p) => { const [a0, a1] = SEG[i]; $('.fl', G[i]).setAttribute('d', p > 0 ? arc(a0, a0 + (a1 - a0) * Math.min(1, p)) : ''); };
  list.innerHTML = F.map((f, i) => `<div class="sbx-r" data-i="${i}"><button class="sbx-rh" aria-expanded="false"><i style="background:${f.c}"></i><span class="n"><span>${f.n}</span></span><span class="e num"></span><span class="bar"><i style="background:${f.c}"></i></span>${I('chev-r','xs')}<span class="sbx-nt">${f.note}</span></button><div class="fold shut"><div><div class="sbx-d"></div></div></div></div>`).join('');
  const R = $$('.sbx-r', list);
  let score = 0, shownFill = F.map(() => 0);
  function paint(ms = 700){
    const s = total(), w = weakest();
    tween(score, s, ms, x => { vb.textContent = Math.round(x); }); score = s;
    g.setAttribute('aria-valuenow', s); g.setAttribute('aria-valuetext', `${s} of 100, ${band(s).toLowerCase()}, ${s - LAST >= 0 ? 'up' : 'down'} ${Math.abs(s - LAST)} since last week`);
    swap(bw, band(s)); ch.hidden = false; ch.className = 'tag num sbx-ch ' + (s >= LAST ? 'ok' : 'bad'); swap(ch, `${s >= LAST ? '+' : '−'}${Math.abs(s - LAST)} since last week`);
    F.forEach((f, i) => { const row = R[i], from = shownFill[i], to = f.e / f.w; shownFill[i] = to; tween(from, to, ms + i * 120, p => fill(i, p));
      $('.e', row).textContent = `${f.e}/${f.w}`; $('.bar i', row).style.width = to * 100 + '%'; $('.sbx-nt', row).textContent = f.note;
      // the weakest factor is flagged in words
      const n = $('.n', row), tag = $('.tag', n); if (i === w && !tag) n.insertAdjacentHTML('beforeend', '<span class="tag warn">Weakest</span>'); if (i !== w && tag) tag.remove();
      $('.sbx-rh', row).setAttribute('aria-label', `${f.n}: ${f.e} of ${f.w} points${i === w ? ', weakest' : ''}. ${f.note}`); detail(i); });
  }
  // an open row: the note, and for the factor that can improve, Improve, which asks the agent for a proposal
  function detail(i){ const f = F[i], d = $('.sbx-d', R[i]); if (d.dataset.st === 'busy' || d.dataset.st === 'prop') return;
    const lost = f.w - f.e;
    d.innerHTML = `<span>${f.done ? f.done + ' ' : ''}${lost ? `Loses ${lost} of its ${f.w} points` : 'Full marks'}${i === weakest() && lost ? ', the most of any factor for its weight.' : '.'}</span>${f.fix ? `<span class="acts"><button class="pill soft sm sbx-imp">${I('wand','xs')}Improve</button></span>` : ''}`;
    const b = $('.sbx-imp', d); if (b) b.onclick = () => improve(i); }
  const improve = i => c.run(async () => { const f = F[i], d = $('.sbx-d', R[i]); d.dataset.st = 'busy';
    d.innerHTML = `<div class="sbx-pr"><span class="k">${I('spark','xs')}<span class="shim">Looking at 120 slow replies</span></span></div>`; enter(d.firstElementChild);
    await c.wait(1300);
    d.dataset.st = 'prop';
    d.innerHTML = `<div class="sbx-pr"><span class="k">${I('spark','xs')}Proposal</span><span>${f.fix.t}</span><span class="gain">${f.fix.gain}: ${f.n} <b class="num">${f.e} → ${f.fix.to}</b></span><span class="acts"><button class="pill primary sm sbx-ok">Apply</button><button class="pill ghost sm sbx-no">Not now</button></span></div>`;
    $('.sbx-ok', d).onclick = () => { f.e = f.fix.to; f.note = f.fix.after; f.done = 'Applied: search results are cached and the lookups run together.'; delete f.fix; d.dataset.st = ''; paint(900); };
    $('.sbx-no', d).onclick = () => { d.dataset.st = ''; detail(i); $('.sbx-imp', d) && $('.sbx-imp', d).focus({ preventScroll:true }); };
  });
  const open = (i, o) => { const row = R[i]; o = o ?? !row.classList.contains('open'); row.classList.toggle('open', o); $('.fold', row).classList.toggle('shut', !o); $('.sbx-rh', row).setAttribute('aria-expanded', o); };
  // a row and its segment light together, from either side
  const hl = i => { g.classList.toggle('hov', i >= 0); G.forEach((x, j) => x.classList.toggle('on', j === i)); R.forEach((x, j) => x.classList.toggle('on', j === i)); };
  R.forEach((row, i) => { $('.sbx-rh', row).onclick = () => open(i); c.on(row, 'pointerenter', e => { if (e.pointerType !== 'touch') hl(i); }); c.on(row, 'focusin', () => hl(i)); });
  G.forEach((x, i) => { c.on(x, 'pointerenter', e => { if (e.pointerType !== 'touch') hl(i); }); c.on(x, 'pointerleave', () => hl(-1)); });
  c.on(list, 'pointerleave', () => { if (!list.contains(document.activeElement)) hl(-1); });
  c.on(list, 'focusout', e => { if (!list.contains(e.relatedTarget)) hl(-1); });
  vb.textContent = '0';
  c.later(280, () => paint(1000));
  // the preview's story: the weakest factor opens, the agent proposes a fix, the person applies it and the score rises
  if (r === c.st) c.story(async s => {
    await s.beat(5);
    await s.tap($('.sbx-rh', R[1])); await s.beat(3);
    await s.tap($('.sbx-imp', R[1])); s.away();
    await s.until(() => $('.sbx-ok', R[1])); await s.beat(4);
    await s.tap($('.sbx-ok', R[1])); s.away(); await s.beat(6);
  });
});
