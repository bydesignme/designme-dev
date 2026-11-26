// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, centre, enter, hoverGlide, iconSwap, swap, tip } from '../core/core.js';
DM.def('model-picker', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{chev\}/g, I('chev-d','xs')).replace('{brain}', I('brain','xs')).replace(/\{chk\}/g, I('check','xs'));
  // speed, quality and cost out of five, and the numbers behind them: tokens a second, and a typical reply's seconds and
  // price with no thinking
  const M = [
    { n:'Opus 5.5', m:'O', c:'var(--dm-pl)', t:'var(--dm-on-ink)', d:'Deepest reasoning, slower', s:2, q:5, p:5, tps:38, sec:9, cost:.021 },
    { n:'Sonnet 5.5', m:'S', c:'var(--dm-accent)', t:'var(--dm-on-accent)', d:'Balanced, the default for design work', s:4, q:4, p:2, tps:74, sec:4, cost:.006 },
    { n:'Haiku 5.5', m:'H', c:'var(--dm-pm)', t:'var(--dm-on-ink)', d:'Fastest, for quick edits', s:5, q:3, p:1, tps:142, sec:1.5, cost:.001 }
  ];
  // thinking effort, and what it may spend
  const E = [['Off', 'Answers straight away'], ['Low', 'Up to 2k thinking tokens'], ['Medium', 'Up to 8k thinking tokens'], ['High', 'Up to 24k thinking tokens']];
  const list = $('.mpk-list', r), tr = $('.mpk-tr', r), fold = $('.mpk-fold', r), sgf = $('.mpk-sgf', r), sgt = $('.mpk-sgt', r), note = $('.mpk-note', r), thd = $('.mpk-thd', r), ev = $('.mpk-ev', r), items = $$('.mpk-pop .mi', r);
  // in Clean the first row's numbers show under its meters, so they never sit over the column heads
  const clean = r.closest('[data-style]')?.dataset.style === 'clean';
  const meter = (v, tip, i) => `<span class="mpk-m" data-tip="${tip}"${clean && !i ? ' data-tip-at="below"' : ''}>${[1, 2, 3, 4, 5].map(k => `<i${k <= v ? ' class="on"' : ''}></i>`).join('')}</span>`;
  list.innerHTML = M.map((x, i) => `<button class="mpk-o mx-press" role="radio" aria-checked="false" tabindex="-1" data-i="${i}"><span class="mpk-mk" style="--dm-mc:${x.c};--dm-mt:${x.t}">${x.m}</span><span class="t"><b>${x.n}<span class="ck">${I('check','xs')}</span></b><span class="d">${x.d}</span></span>${meter(x.s, x.tps + ' tokens a second', i)}${meter(x.q, 'Quality ' + x.q + ' of 5', i)}${meter(x.p, '$' + x.cost.toFixed(3) + ' a reply', i)}</button>`).join('');
  const rows = $$('.mpk-o', list);
  // Clean's one hover glides from model to model; the picked one keeps its stronger fill
  if (!r.closest('.ahx')) c.offs.push(hoverGlide(list, '.mpk-o'));
  // Opus is at capacity when the demo starts (busy is its wait in seconds), and free again once you've waited it out
  let cur = 1, eff = 2, busy = 20, waiting = false;
  function paint(){
    rows.forEach((b, i) => { b.setAttribute('aria-checked', i === cur); b.tabIndex = i === cur ? 0 : -1; });
    // the trigger's mark crossfades to the new model's (iconSwap(); at once as it is first drawn)
    const mk = $('.mpk-mk', tr), mark = () => { mk.style.setProperty('--dm-mc', M[cur].c); mk.style.setProperty('--dm-mt', M[cur].t); mk.textContent = M[cur].m; };
    if (mk.textContent && mk.textContent !== M[cur].m) iconSwap(mk, mark); else mark();
    swap($('.mpk-nm', tr), M[cur].n); swap($('.mpk-ef', tr), E[eff][0]); swap(thd, E[eff][1]); swap(ev, E[eff][0]);
    items.forEach((m, i) => m.setAttribute('aria-checked', i === eff));
  }
  const say = t => { note.innerHTML = t ? `${I('ok','xs')}<span>${t}</span>` : ''; if (t) enter(note); };
  const sg = on => { sgf.classList.toggle('shut', !on); sgf.inert = !on; };
  sg(false);
  // thinking effort: a small dropdown of the four levels, each with what it may spend
  items.forEach((m, i) => m.addEventListener('click', () => { eff = i; paint(); say(''); }));
  function choose(i){ cur = i; sg(false); paint(); say(`Set for this chat: ${M[cur].n}, ${E[eff][0].toLowerCase()} thinking`); }
  // picking a model checks it can take the request first; a busy one offers a wait, or a close match that starts now
  function pick(i){
    if (i !== 0 || !busy) return choose(i);
    if (waiting) return;
    const row = rows[0], d = $('.d', row), ck = $('.ck', row);
    ck.innerHTML = '<span class="spin"></span>'; swap(d, 'Checking it can take this chat'); say('');
    c.run(async () => {
      await c.wait(1000);
      iconSwap(ck, () => { ck.innerHTML = I('check','xs'); }); row.classList.add('busy'); swap(d, `At capacity, about ${busy}s wait`);
      sgt.textContent = `Opus 5.5 is at capacity for about ${busy}s. Sonnet 5.5 on high thinking comes close on long reviews and starts now.`; sg(true);
    });
  }
  rows.forEach((b, i) => b.onclick = () => pick(i));
  // arrow keys move through the models, as in any radio group
  c.on(list, 'keydown', e => {
    const k = { ArrowDown:1, ArrowRight:1, ArrowUp:-1, ArrowLeft:-1 }[e.key]; if (!k) return;
    e.preventDefault(); const i = (rows.indexOf(document.activeElement) + k + rows.length) % rows.length; rows[i].focus({ preventScroll:true }); pick(i);
  });
  $('.mpk-use', r).onclick = () => { eff = 3; choose(1); };
  $('.mpk-wait', r).onclick = () => c.run(async () => {
    sg(false); waiting = true; const d = $('.d', rows[0]);
    for (let w = busy; w > 0; w--){ d.textContent = `Starts in ${w}s`; await c.wait(1000); }
    busy = 0; waiting = false; rows[0].classList.remove('busy'); swap(d, M[0].d); choose(0);
  });
  // the trigger opens and closes the list; Escape closes it and gives the trigger the focus back
  // the trigger sits centred on its own, and glides up as the list folds open; it aims for the open list's own height,
  // not the one it is easing through, so the two move as one
  const mpk = $('.mpk', r), effp = $('.mpk-pop', r);
  // Clean: the confirmation is the card's own foot strip, not a line under it
  if (clean) $('.mpk-p', r).appendChild(note);
  // Clean leaves the centring to its stage, which centres it at every moment as the list folds open and the confirmation
  // strip opens and shuts (centre() measured the homepage card before its stage was laid out and kept it 145px too high)
  const centred = clean ? () => {} : centre(c, mpk, () => { const shut = fold.classList.contains('shut'), sgx = sgf.classList.contains('shut') ? 0 : sgf.firstElementChild.scrollHeight;
    let h = mpk.offsetHeight - fold.offsetHeight + (shut ? 0 : fold.firstElementChild.scrollHeight - sgf.offsetHeight + sgx);
    return effp.classList.contains('open') ? Math.max(h, effp.offsetTop + effp.offsetHeight) : h; }, [fold.firstElementChild, effp]);
  // (its rows settle one after another each time it opens: .mx-play)
  const open = v => { fold.classList.toggle('shut', !v); fold.inert = !v; tr.setAttribute('aria-expanded', v); list.classList.toggle('mx-play', v); centred(); };
  tr.onclick = () => open(tr.getAttribute('aria-expanded') !== 'true');
  c.on(r, 'keydown', e => { if (e.key === 'Escape' && tr.getAttribute('aria-expanded') === 'true'){ open(false); tr.focus({ preventScroll:true }); } });
  paint();
  // the preview's story: compare the meters, ask for Opus, find it busy, and take the close match on high thinking
  c.story(async s => {
    await s.beat(3);
    await s.point($$('.mpk-m', rows[2])[2]); await s.beat(3);
    await s.point($$('.mpk-m', rows[0])[1]); await s.beat(3);
    await s.tap(rows[0]); s.away();
    await s.until(() => !sgf.classList.contains('shut')); await s.beat(5);
    await s.tap($('.mpk-use', r)); s.away();
    await s.beat(4);
  });
});
