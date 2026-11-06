// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, swap } from '../core/core.js';
DM.def('progress', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{pause}', I('pause'));
  const root = $('.prg', r), ring = $('.prg-ring', r), arc = $('.prg-ring .fl', r), pc = $('.prg-pc', r), vt = $('.prg-vt', r), tag = $('.prg-st', r), btn = $('.prg-btn', r);
  const segBox = $('.prg-seg', r), segs = $$('.prg-seg b', r), ll = $('.prg-ll', r), lin = $('.prg-lin', r), bar = $('.prg-lin i', r), sr = $('.prg-sr', r);
  const mb = $('.prg-mb', r), mfl = $('.prg-mb .fl', r), mv = $('.prg-mv', r), mw = $('.prg-mw', r);
  // the run's steps: what each does and what it counts
  const S = [['Reading the sitemap', 'Pages', 48], ['Fetching pages', 'Pages', 48], ['Indexing files', 'Files', 2000], ['Writing embeddings', 'Chunks', 6400], ['Checking links', 'Links', 310]];
  const LIMIT = 10000, fmt = n => Math.round(n).toLocaleString('en-US');
  let state = 'ind', step = 0, sub = 0, secs = 0, credits = 7000, run = 0, failed = false;
  const TAG = { ind:['Starting', ''], run:['Running', 'run'], paused:['Paused', ''], err:['Failed', 'bad'], done:['Done', 'ok'] };
  let shownState = '', shownBand = -1;
  function paint(){
    const all = state === 'done' ? 1 : (step + sub) / S.length, [name, unit, total] = S[Math.min(step, S.length - 1)];
    root.dataset.s = state;
    // the ring: the whole run
    if (state === 'ind'){ ring.removeAttribute('aria-valuenow'); ring.setAttribute('aria-valuetext', 'Preparing the run'); pc.textContent = ''; arc.style.strokeDasharray = ''; }
    else { const p = Math.round(all * 100); ring.setAttribute('aria-valuenow', p); ring.setAttribute('aria-valuemin', 0); ring.setAttribute('aria-valuemax', 100); ring.setAttribute('aria-valuetext', p + '% of the run'); arc.style.strokeDasharray = `${all * 100} 100`;
      if (state === 'done'){ if (!pc.querySelector('.i')){ pc.innerHTML = I('check','xs'); enter(pc.firstElementChild); } } else pc.textContent = p + '%'; }
    // the segments: step n of m
    segs.forEach((b, j) => b.style.setProperty('--dm-f', state === 'done' || j < step ? 1 : j === step && state !== 'ind' ? sub : 0));
    segBox.setAttribute('aria-valuenow', state === 'done' ? S.length : step); segBox.setAttribute('aria-valuetext', state === 'done' ? 'All 5 steps done' : state === 'ind' ? 'Not started' : `Step ${step + 1} of ${S.length}`);
    // the bar: the step in hand
    lin.classList.toggle('ind', state === 'ind');
    const sp = state === 'done' ? 1 : sub;
    bar.style.width = state === 'ind' ? '' : sp * 100 + '%';
    if (state === 'ind'){ lin.removeAttribute('aria-valuenow'); lin.setAttribute('aria-valuetext', 'Working out how much there is'); }
    else { lin.setAttribute('aria-valuenow', Math.round(sp * 100)); lin.setAttribute('aria-valuetext', `${fmt(sp * total)} of ${fmt(total)} ${unit.toLowerCase()}`); }
    // the line over the bar: the count, or what failed and a way on
    if (state === 'err'){ if (shownState !== 'err'){ ll.innerHTML = `<span class="e">${I('alert','xs')}<span>The embeddings service timed out</span></span><button class="pill line sm prg-retry">${I('refresh','xs')}Retry</button>`; enter(ll.firstElementChild); $('.prg-retry', ll).onclick = retry; } }
    else ll.innerHTML = state === 'ind' ? '<span>Getting ready</span><span class="n">Counting pages</span>' : `<span>${unit}</span><span class="n num">${fmt((state === 'done' ? 1 : sub) * total)} of ${fmt(total)}</span>`;
    // the words: Step 3 of 5, indexing files
    const words = { ind:'Preparing the run', run:`Step ${step + 1} of ${S.length}, ${name.toLowerCase()}`, paused:`Paused at step ${step + 1} of ${S.length}`, err:`Failed at step ${step + 1} of ${S.length}`, done:`Indexed 2,000 files in 0:${String(secs).padStart(2, '0')}` }[state];
    if (vt.textContent !== words) vt.textContent = words;
    if (shownState !== state){
      swap(tag, TAG[state][0]); tag.className = 'tag prg-st ' + TAG[state][1];
      const b = state === 'paused' ? ['play', 'Resume'] : state === 'done' ? ['refresh', 'Run again'] : ['pause', 'Pause'];
      btn.innerHTML = I(b[0]); btn.setAttribute('aria-label', b[1]); btn.dataset.tip = b[1]; btn.disabled = state === 'err' || state === 'ind'; btn.style.visibility = state === 'err' ? 'hidden' : '';
      // only a change of state is announced, never every percent
      if (shownState) sr.textContent = { run:'Running', paused:'Paused', err:'Step 4 failed: the embeddings service timed out', done:'Done. ' + words, ind:'Starting' }[state];
      shownState = state;
    }
    // the meter: credits, warning in words from 75% and more strongly from 90%
    const m = credits / LIMIT, band = m >= .9 ? 2 : m >= .75 ? 1 : 0;
    mfl.style.width = Math.min(100, m * 100) + '%'; mv.textContent = fmt(credits);
    mb.classList.toggle('warn', band === 1); mb.classList.toggle('bad', band === 2);
    mb.setAttribute('aria-valuenow', Math.round(credits)); mb.setAttribute('aria-valuetext', `${fmt(credits)} of 10,000 credits` + ['', ', running low', ', almost out'][band]);
    if (band !== shownBand){ mw.innerHTML = ['<span class="muted">On track for the month</span>', `<span class="tag warn">${I('warn','xs')}Running low</span>`, `<span class="tag bad">${I('alert','xs')}Almost out</span>`][band]; if (shownBand >= 0) enter(mw.firstElementChild); shownBand = band; }
  }
  function retry(){ if (state !== 'err') return; state = 'run'; paint(); }
  btn.onclick = () => {
    if (state === 'run'){ state = 'paused'; paint(); }
    else if (state === 'paused'){ state = step || sub ? 'run' : 'ind'; paint(); }
    else if (state === 'done') c.run(go);
  };
  c.every(1000, () => { if (state === 'run') secs++; });
  const until = async f => { while (!f()) await c.wait(100); };
  // the agent's run: it works out what there is, then goes step by step; the fourth step times out once
  async function go(){
    const id = ++run; state = 'ind'; step = 0; sub = 0; secs = 0; credits = 7000; failed = false; paint();
    await c.wait(1800); if (id !== run) return;
    state = 'run';
    for (step = 0; step < S.length; step++){
      sub = 0; paint();
      for (let k = 1; k <= 12; k++){
        await c.wait(150); await until(() => state !== 'paused'); if (id !== run) return;
        if (step === 3 && k === 6 && !failed){ failed = true; state = 'err'; paint(); await until(() => state !== 'err'); if (id !== run) return; await c.wait(400); }
        sub = k / 12; credits += 38; paint();
      }
    }
    step = S.length - 1; state = 'done'; paint();
  }
  paint(); c.run(go);
  // the preview's story: the fourth step fails, the person retries it, and the run finishes
  if (r === c.st) c.story(async s => {
    await s.until(() => state === 'err'); await s.beat(3);
    await s.tap($('.prg-retry', r)); s.away();
    await s.until(() => state === 'done'); await s.beat(4);
  });
});
