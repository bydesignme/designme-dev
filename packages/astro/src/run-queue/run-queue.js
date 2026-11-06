// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, html, seg, swap } from '../core/core.js';
DM.def('run-queue', (r, c) => {
  // the jobs, run one at a time: what each is, the agent on it and its icon, and its steps with what each came to. The launch
  // email's test send fails once and waits for Retry
  const J = [
    { t:'Research three competitors', ag:'Research agent', ic:'search', subs:[['Read their pricing pages', '3 of 3'], ['Compared plans and limits', '5 gaps']] },
    { t:'Draft the launch email', ag:'Copy agent', ic:'mail', fail:2, subs:[['Pulled the new features', '6 items'], ['Wrote two subject lines', '2 drafts'], ['Sent a test to the team', 'Sent']] },
    { t:'Update the help centre', ag:'Docs agent', ic:'book', subs:[['Billing questions', '4 articles'], ['Inviting your team', '2 articles']] },
    { t:'Post the changelog', ag:'Release agent', ic:'send', subs:[['Posted in #releases', 'Posted']] }
  ];
  const STEP = 1.4, secs = j => j.subs.length * STEP;
  const root = $('.rq', r), st = $('.rq-st', r), tot = $('.rq-tot', r), say = $('.rq-say', r);
  const runL = $('.rq-run', r), nextL = $('.rq-next', r), doneL = $('.rq-done', r), dn = $('.rq-dn', r);
  $('.rq-fin .rq-av', r).innerHTML = I('ok');
  const fold = (f, on) => { f.classList.toggle('shut', !on); f.inert = !on; };
  $$('.rq-b>.fold', r).forEach(f => { f.inert = f.classList.contains('shut'); });
  let compact = false, total = 0, retries = 0;
  tot.innerHTML = J.map(() => '<i><b></b></i>').join('');
  J.forEach((j, k) => {
    j.bar = $$('b', tot)[k]; j.p = 0; j.s = '';
    j.el = html(`<li class="rq-j" data-s="wait"><div class="rq-jh"><span class="rq-av" aria-hidden="true">${I(j.ic)}</span><span class="rq-jt"><b>${j.t}</b><span class="rq-js">${j.ag}</span></span><span class="rq-jm num"></span></div><div class="rq-jb" aria-hidden="true"><div class="rq-bar"><i></i></div><span class="rq-pc num">0%</span></div><div class="fold shut rq-sf"><div><ul class="rq-steps">${j.subs.map(s => `<li class="rq-sp wait"><span class="g"><span class="dot"></span></span><span>${s[0]}</span><span class="m"></span></li>`).join('')}</ul></div></div></li>`);
    $('.rq-sf', j.el).inert = true;
    nextL.appendChild(j.el);
  });
  const text = (el, t) => { if (el.textContent !== t) el.textContent = t; };
  // when each waiting job should start: after what is left of the one running and of every job ahead of it
  const left = j => secs(j) * (1 - j.p);
  function times(){
    let ahead = 0;
    J.forEach(j => {
      const m = $('.rq-jm', j.el);
      if (j.s === 'run' || j.s === 'fail'){ ahead += left(j); if (j.s === 'run') text(m, left(j) < .5 ? 'Finishing' : `${Math.ceil(left(j))}s left`); }
      else if (!j.s){ text(m, `in ~${Math.max(1, Math.round(ahead))}s`); ahead += secs(j); }
    });
    const now = J.find(j => j.s === 'run' || j.s === 'fail'), d = J.filter(j => j.s === 'done').length;
    text(st, d === J.length ? `All ${J.length} done in ${total.toFixed(1)}s` : now && now.s === 'fail' ? '1 step failed, waiting for Retry' : `${d} of ${J.length} done · ~${Math.ceil(ahead)}s left`);
  }
  // a job moves to its part of the queue, and every job glides from where it was to where it is now
  function move(j, list, s){
    const was = new Map(J.map(x => [x, x.el.getBoundingClientRect()]));
    j.s = s; j.el.dataset.s = s || 'wait'; list.appendChild(j.el); steps(j);
    if (REDUCE) return;
    J.forEach(x => { const a = was.get(x), b = x.el.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
      if (Math.abs(dx) + Math.abs(dy) > 1) x.el.animate([{ transform:`translate(${dx}px,${dy}px)` }, { transform:'none' }], { duration:520, easing:'cubic-bezier(.22,1,.36,1)' }); });
  }
  // the queue keeps the tallest room it has needed once each move settles, so it never shrinks while it runs and its end
  // sits centred in that room
  const keep = () => { const h = Math.ceil(root.getBoundingClientRect().height); if (h > (parseFloat(root.style.minHeight) || 0)) root.style.minHeight = h + 'px'; };
  function steps(j){ const f = $('.rq-sf', j.el); fold(f, !compact && (j.s === 'run' || j.s === 'fail')); }
  seg($('.seg2', r), v => { compact = v === 'compact'; J.forEach(steps); });
  const paint = j => { j.bar.style.setProperty('--dm-p', j.p.toFixed(3)); $('.rq-bar i', j.el).style.setProperty('--dm-p', j.p.toFixed(3)); text($('.rq-pc', j.el), Math.round(j.p * 100) + '%'); };
  const glyph = (sp, g, cls) => { sp.className = 'rq-sp ' + cls; $('.g', sp).innerHTML = g; };
  async function go(j){
    if (j.s !== 'run') move(j, runL, 'run');
    say.textContent = `${j.t} started`; c.later(600, keep);
    const sps = $$('.rq-sp', j.el), js = $('.rq-js', j.el), n = j.subs.length;
    let took = 0;
    for (let i = 0; i < n; i++){
      const sp = sps[i]; glyph(sp, '<span class="spin"></span>', 'run'); swap(js, `${j.ag} · ${j.subs[i][0]}`);
      // the step fills its share of the bar a tenth of a second at a time; the test send fails part way, once
      let q = 0; const failAt = j.fail === i && !j.failed ? .55 : 2;
      await new Promise(res => { const iv = c.every(100, () => { q = Math.min(1, q + .1 / STEP); took += .1; j.p = (i + q) / n; paint(j); times(); if (q >= failAt || q >= 1){ clearInterval(iv); res(); } }); });
      if (q < 1){
        j.failed = true; j.el.dataset.s = j.s = 'fail'; j.bar.parentElement.classList.add('fail'); glyph(sp, I('x','xs'), 'fail');
        text($('.rq-jm', j.el), 'Test send failed'); times(); say.textContent = `${j.t}: ${j.subs[i][0]} failed`;
        const b = html('<button class="rq-retry" type="button">Retry</button>'); $('.m', sp).appendChild(b); enter(b);
        // it waits for Retry, which presses itself after a moment so the run never stalls, until the visitor takes over
        await new Promise(res => { b.onclick = res; c.auto(2600, () => { if (b.isConnected){ b.classList.add('on'); c.auto(220, res); } }); });
        b.remove(); retries++; j.el.dataset.s = j.s = 'run'; j.bar.parentElement.classList.remove('fail'); i--; continue;
      }
      glyph(sp, I('check','xs'), 'done'); swap($('.m', sp), j.subs[i][1]);
    }
    total += took; j.p = 1; paint(j); swap(js, j.ag);
    await c.wait(REDUCE ? 0 : 420);
    move(j, doneL, 'done'); dn.textContent = doneL.children.length;
    $('.rq-jm', j.el).innerHTML = `<span>${took.toFixed(1)}s${j.failed ? ' · 1 retry' : ''}</span><span class="ok">${I('check','xs')}</span>`;
    say.textContent = `${j.t} done`; times();
  }
  // the first job is on its way from the start
  move(J[0], runL, 'run'); times();
  c.run(async () => {
    await c.wait(700);
    for (const j of J) await go(j);
    // the end: a summary takes the running job's place and the empty parts fold away; once they have, the queue lets go of
    // the room it kept and eases down to fit what is left, so no gap opens under the bars (owner, 5 Nov)
    await c.wait(REDUCE ? 0 : 560); keep();
    text($('.rq-ft', r), `All ${J.length} jobs done`); $('.rq-fs', r).textContent = `${total.toFixed(1)}s in all · ${retries ? retries + (retries > 1 ? ' retries' : ' retry') : 'no retries'}`;
    root.classList.add('fin'); fold($('.rq-ff', r), true); fold($('.rq-rf', r), false); fold($('.rq-nf', r), false);
    times(); say.textContent = `All ${J.length} jobs done`;
    await c.wait(REDUCE ? 0 : 520);
    const from = root.getBoundingClientRect().height; root.style.minHeight = ''; const to = root.getBoundingClientRect().height;
    if (!REDUCE && from - to > 1) root.animate([{ height:from + 'px' }, { height:to + 'px' }], { duration:480, easing:'cubic-bezier(.22,1,.36,1)' });
  });
});
