// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, REVEAL, grow, swap } from '../core/core.js';
// the Job toast (owner, 26 Nov): a job the agent runs in the background ("Make slides" from the notes) lives in one toast from
// start to finish. It is an agent at work, so its demo keeps playing under a resting pointer (DM.PLAYS); its timing goes
// through the controller (c.later), and what the visitor sets off keeps running once they take over
DM.def('toast', (r, c) => {
  const q = s => $(s, r);
  const make = q('.tst-make'), slot = q('.tst-slot'), T = q('.tst-t'), G = q('.tst-dk'), svg = q('.tst-dk svg'), tx = q('.tst-tx'), hb = q('.tst-hb');
  const ti = q('.tst-ti'), de = q('.tst-de'), moreB = q('.tst-more'), stopB = q('.tst-stop'), xB = q('.tst-x'), ring = q('.tst-ring'), rn = q('.tst-ring .tst-rn');
  const more = q('.tst-mf'), steps = q('.tst-st'), ft = q('.tst-ft'), ftIn = q('.tst-fi');
  const [polite, loud] = $$('.tst-sr', r);
  // the job's own clock: with reduced motion it still takes its time (a few hundred ms a step), so each state can be read
  const wait = ms => new Promise(res => c.later(REDUCE ? Math.min(ms, 400) : ms, res));
  const motion = () => { const cs = getComputedStyle(r), s = v => parseFloat(cs.getPropertyValue(v)) * 1000 || 340; return { ease:cs.getPropertyValue('--dm-ease').trim() || 'ease', t:s('--dm-t'), fast:s('--dm-t-fast'), slow:s('--dm-t-slow'), m:REVEAL[cs.getPropertyValue('--dm-motion').trim()] || REVEAL.soft }; };
  const N = 12, SEC = ['Cover', 'Agenda', 'Revenue', 'North', 'South', 'Plan vs actual', 'By region', 'Hiring', 'Open roles', 'Risks', 'Data move', 'Next steps'];

  /* the glyph: a page for the notes, twelve dashed slots fanned round a point under it, twelve cards, and the tick */
  const ang = i => -32 + i * 64 / (N - 1);
  const card = (i, k) => `<g class="tst-cd${k}" style="--dm-a:${ang(i).toFixed(2)}deg;--dm-i:${i}"><rect class="tst-b" x="26" y="6" width="12" height="20" rx="2"/><path class="tst-l" d="M28.5 10h6M28.5 13.5h7M28.5 17h4.5" pathLength="8"/></g>`;
  svg.innerHTML = '<g class="tst-pg"><rect class="tst-pp" x="23.5" y="6.5" width="17" height="22" rx="2.5"/><path class="tst-pl" d="M27 12h10M27 15.5h8M27 19h10M27 22.5h6"/><path class="tst-sc" d="M25.5 10h13"/></g>'
    + '<g>' + Array.from({ length:N }, (_, i) => card(i, ' tst-gh')).join('') + '</g><g class="tst-fan">' + Array.from({ length:N }, (_, i) => card(i, '')).join('') + '</g>'
    + '<g class="tst-ok"><circle cx="41" cy="27" r="6.5"/><path d="M38.3 27.1l1.9 1.9 3.5-3.6"/></g>';
  const fan = $('.tst-fan', svg), cards = $$('.tst-fan .tst-cd', svg);
  // the card eases to its new height as its words wrap or its steps and footer come and go (grow(), centred in the stage)
  c.offs.push(grow(T));
  const fitNow = () => { T.style.transition = 'none'; T.style.height = T.firstElementChild.offsetHeight + 'px'; void T.offsetHeight; T.style.transition = ''; };
  // the card being drafted, or the one the check stopped on, comes to the front of the hand; the hand goes back in order after
  const order = () => cards.forEach(e => fan.appendChild(e));
  const glyph = k => { G.classList.remove('idle', 'read', 'plan', 'done', 'gone'); k.split(' ').filter(Boolean).forEach(x => G.classList.add(x)); };
  const cardAs = (i, k) => { const e = cards[i]; e.classList.remove('made', 'now', 'chk', 'bad'); if (k) e.classList.add(k);
    if (k === 'now' || k === 'bad') fan.appendChild(e); else if (k === 'made' && fan.lastElementChild === e) order(); };

  /* the steps, opened from the chevron; a step's mark sits in the glyph's column */
  const STEPS = ['Read the notes', 'Outline 12 slides', 'Draft the slides', 'Check the numbers'];
  steps.innerHTML = STEPS.map(s => `<li data-s="wait"><span class="tst-mk"><span class="tst-pend"></span></span><span class="tst-lb">${s}</span><span class="tst-vl"></span></li>`).join('');
  const rows = [...steps.children];
  const MK = { done:I('check'), now:'<span class="spin"></span>', bad:I('alert'), paused:I('pause'), wait:'<span class="tst-pend"></span>' };
  const stepAs = (i, s, v = '') => { const e = rows[i]; if (e.dataset.s !== s){ e.dataset.s = s; $('.tst-mk', e).innerHTML = MK[s]; } $('.tst-vl', e).textContent = v; };

  const S = { phase:'idle', n:0, tok:0, fixed:false, skipped:false, at:'read' };

  /* words that change cross-fade (swap); the words that say what is running sweep (.shim); a counter ticks over at once */
  const sayTi = (text, shim) => { if (ti.textContent === text && !ti._sw){ ti.classList.toggle('shim', !!shim); return; } swap(ti, text); c.later(REDUCE ? 0 : 170, () => ti.classList.toggle('shim', !!shim)); };
  const sayDe = (text, now) => { if (now){ if (de._sw){ clearTimeout(de._sw.t); de._sw = null; de.classList.remove('out'); } de.textContent = text; } else swap(de, text); };
  // announcements: progress politely, a problem at once
  const tell = (text, now) => { const el = now ? loud : polite; el.textContent = ''; c.later(60, () => { el.textContent = text; }); };

  /* the countdown on Close: a ring that drains; the pointer or the focus on the toast holds it, and it closes the toast */
  let cd = null;
  const held = () => T.matches(':hover') || T.contains(document.activeElement);
  const countdown = ms => { if (cd){ cd.cancel(); cd = null; } ring.toggleAttribute('hidden', !ms); if (!ms) return;
    cd = rn.animate([{ strokeDashoffset:0 }, { strokeDashoffset:100 }], { duration:ms, fill:'forwards', easing:'linear' });
    if (held()) cd.pause();
    cd.onfinish = () => { cd = null; dismiss(); }; };
  const holdT = () => { if (cd && cd.playState === 'running') cd.pause(); };
  const goT = () => { if (cd && cd.playState === 'paused' && !held()) cd.play(); };
  c.on(T, 'pointerenter', holdT); c.on(T, 'pointerleave', goT); c.on(T, 'focusin', holdT); c.on(T, 'focusout', () => c.later(0, goT));
  c.offs.push(() => { if (cd) cd.cancel(); });

  /* the footer's buttons for each state: the secondary white and outlined, the one that moves the job on the primary */
  const foot = acts => {
    if (!acts){ ft.classList.add('shut'); return; }
    const was = !ft.classList.contains('shut');
    ftIn.innerHTML = acts.map(([k, t]) => `<button type="button" class="pill sm ${k}${was ? ' in' : ''}">${t}</button>`).join('');
    [...ftIn.children].forEach((b, i) => b.addEventListener('click', acts[i][2]));
    ft.classList.remove('shut');
  };
  const btnOf = t => [...ftIn.querySelectorAll('button')].find(b => b.textContent === t);

  const P = {
    read:    { ti:'Reading your notes…', de:'3 sections · 212 words', work:1 },
    outline: { ti:'Outlining the deck…', de:'12 slides planned', work:1 },
    draft:   { ti:'Drafting slides…', de:() => `Slide ${Math.min(S.n + 1, N)} of 12 · ${SEC[Math.min(S.n, N - 1)]}`, work:1 },
    check:   { ti:'Checking the numbers…', de:'Against the Q3 sheet', work:1 },
    error:   { ti:'Slide 7 doesn’t match', de:'The sheet says 41k, not 14k', acts:[['line', 'Skip', () => skip()], ['primary', 'Fix slide 7', () => fix()]] },
    fix:     { ti:'Fixing slide 7…', de:'Using 41k from the sheet', work:1 },
    done:    { ti:'12 slides ready', de:() => S.skipped ? 'Q3 planning deck · 1 to check' : 'Q3 planning deck · 1 fixed', acts:[['line', 'Undo', () => undo()], ['primary', 'Open', () => openDeck()]], time:10000 },
    stopped: { ti:() => S.at === 'draft' ? `Stopped at slide ${S.n}` : S.at === 'check' ? 'Stopped while checking' : 'Stopped before drafting', de:() => `${S.n} of 12 drafted · nothing lost`, acts:[['line', 'Discard', () => discard()], ['primary', 'Resume', () => resume()]] },
    removed: { ti:'Deck removed', de:'Your notes are unchanged', acts:[['line', 'Redo', () => redo()]], time:6000 }
  };
  const val = v => typeof v === 'function' ? v() : v;
  const setPhase = p => {
    S.phase = p; const d = P[p];
    sayTi(val(d.ti), d.work); sayDe(val(d.de));
    stopB.hidden = !d.work; xB.hidden = !!d.work; moreB.hidden = p === 'removed';
    if (p === 'removed') toggleMore(false);
    foot(d.acts); countdown(d.time || 0);
    // the steps follow the job
    const sv = { read:['now', 'wait', 'wait', 'wait'], outline:['done', 'now', 'wait', 'wait'], draft:['done', 'done', 'now', 'wait'], check:['done', 'done', 'done', 'now'], error:['done', 'done', 'done', 'bad'], fix:['done', 'done', 'done', 'now'], done:['done', 'done', 'done', 'done'], removed:['done', 'done', 'done', 'done'] }[p];
    if (sv) sv.forEach((s, i) => stepAs(i, s, i === 2 && s === 'now' ? `${S.n} of 12` : i === 3 && (p === 'error' || p === 'fix') ? 'Slide 7' : ''));
    if (p === 'stopped'){ const at = ['read', 'outline', 'draft', 'check'].indexOf(S.at); rows.forEach((e, i) => stepAs(i, i < at ? 'done' : i === at ? 'paused' : 'wait', i === at && i === 2 ? `${S.n} of 12` : '')); }
  };

  /* it comes in: it grows out of the button that started it, in the same place, and its parts follow one after another; it
     goes back into the button when it is closed. Both ease with the style's own motion; with reduced motion they only fade */
  const box = el => { const sb = slot.getBoundingClientRect(), b = el.getBoundingClientRect();
    return { left:b.left - sb.left + 'px', top:b.top - sb.top + 'px', width:b.width + 'px', height:b.height + 'px', borderRadius:getComputedStyle(el).borderTopLeftRadius }; };
  const flyer = from => { const f = document.createElement('div'); f.className = 'tst-fly'; Object.assign(f.style, from); slot.appendChild(f); c.offs.push(() => f.remove()); return f; };
  const show = () => {
    T.getAnimations().forEach(a => a.cancel()); T.classList.remove('tst-out');
    const M = motion(), from = box(make);
    T.hidden = false; T.style.opacity = ''; make.classList.add('under'); fitNow();
    if (REDUCE){ T.animate([{ opacity:0 }, { opacity:1 }], { duration:M.fast }); return; }
    const to = box(T), fly = flyer(from); T.style.opacity = '0';
    const a = fly.animate([from, to], { duration:M.slow, easing:M.ease, fill:'forwards' });
    a.finished.then(() => {
      T.style.opacity = ''; fly.animate([{ opacity:1 }, { opacity:0 }], { duration:M.fast, fill:'forwards' }).finished.then(() => fly.remove(), () => fly.remove());
      [G, tx, hb].forEach((el, i) => { const [k] = M.m.part, { transform, ...look } = k;
        if (Object.keys(look).length) el.animate([{ offset:0, ...look }, {}], { duration:M.m.partMs, delay:i * M.m.step, easing:M.m.ease, fill:'backwards' });
        if (transform) el.animate([{ transform }, { transform:'none' }], { duration:M.m.partMs, delay:i * M.m.step, easing:M.m.ease, fill:'backwards' }); });
    }, () => fly.remove());
  };
  // the button comes back where the toast was
  const back = () => { make.classList.remove('under'); if (!REDUCE) make.animate([{ opacity:0, transform:'scale(.96)' }, { opacity:1, transform:'none' }], { duration:motion().t, easing:motion().ease }); };
  const exit = () => new Promise(res => {
    if (T.hidden){ res(); return; }
    const M = motion(), done = () => { T.hidden = true; T.style.transform = ''; T.style.opacity = ''; T.getAnimations().forEach(a => a.cancel()); back(); res(); };
    if (REDUCE){ T.animate([{ opacity:1 }, { opacity:0 }], { duration:M.fast, fill:'forwards' }); c.later(M.fast, done); return; }
    // its words fade at once, and the card eases back into the button
    const from = box(T); make.classList.remove('under'); const to = box(make); make.classList.add('under');
    const fly = flyer(from); T.animate([{ opacity:1 }, { opacity:0 }], { duration:M.fast * .6, fill:'forwards' });
    const a = fly.animate([from, to], { duration:M.t, easing:M.ease, fill:'forwards' });
    a.finished.then(() => { done(); fly.animate([{ opacity:1 }, { opacity:0 }], { duration:M.fast, fill:'forwards' }).finished.then(() => fly.remove(), () => fly.remove()); }, () => { fly.remove(); done(); });
  });
  const label = t => { make.querySelector('span').textContent = t; };
  /* Close, Escape or a swipe: a finished toast goes; a job still running carries on, and the button brings its toast back */
  const after = () => {
    if (P[S.phase] && P[S.phase].work) label('Show progress');
    else if (S.phase === 'stopped' || S.phase === 'error') label('Show job');
    else { S.phase = 'idle'; label('Make slides'); }
  };
  const dismiss = () => { if (T.hidden || closing) return; countdown(0); closing = true; after(); exit().then(() => { closing = false; }); };
  let closing = false;
  const toggleMore = open => { open = open ?? more.classList.contains('shut'); more.classList.toggle('shut', !open); moreB.setAttribute('aria-expanded', open); moreB.setAttribute('aria-label', open ? 'Hide the steps' : 'Show the steps'); moreB.dataset.tip = open ? 'Hide steps' : 'Steps'; };

  /* the job */
  const reset = () => { S.n = 0; S.fixed = false; S.skipped = false; cards.forEach((e, i) => cardAs(i)); order(); glyph('idle'); rows.forEach((e, i) => stepAs(i, 'wait')); toggleMore(false); };
  const start = () => {
    // a job whose toast was dismissed: the button brings its toast back
    if (!T.hidden || closing) return;
    // a job whose toast was closed before it finished, or that finished while it was closed: the button brings it back
    if (P[S.phase]){ label('Make slides'); show(); if (S.phase === 'done') countdown(P.done.time); return; }
    reset(); S.tok++; const tok = S.tok;
    label('Make slides'); setPhase('read'); glyph('read');
    show(); run(tok, 'read');
    tell('Making slides from your notes');
  };
  const live = tok => tok === S.tok && !c.dead;
  async function run(tok, from){
    if (from === 'read'){ S.at = 'read'; setPhase('read'); glyph('read'); await wait(1700); if (!live(tok)) return; from = 'outline'; }
    if (from === 'outline'){ S.at = 'outline'; setPhase('outline'); glyph('plan'); await wait(1300); if (!live(tok)) return; from = 'draft'; }
    if (from === 'draft'){
      S.at = 'draft'; setPhase('draft'); glyph('plan');
      while (S.n < N){
        const i = S.n; cardAs(i, 'now'); sayDe(val(P.draft.de), i > 0); stepAs(2, 'now', `${i + 1} of 12`);
        await wait(400); if (!live(tok)) return;
        cardAs(i, 'made'); S.n++;
        if (S.n === 6) tell('Half the slides are drafted');
      }
      from = 'check';
    }
    if (from === 'check' || from === 'recheck'){
      S.at = 'check'; setPhase('check'); glyph('plan');
      for (let i = from === 'recheck' ? 7 : 0; i < N; i++){
        if (i === 6 && !S.fixed && !S.skipped){ cardAs(i, 'bad'); setPhase('error'); tell('Slide 7 doesn’t match the sheet. Fix slide 7 or skip it.', true); return; }
        if (S.skipped && i === 6) continue;
        cardAs(i, 'chk'); await wait(120); if (!live(tok)) return; cardAs(i, 'made');
      }
    }
    cards.forEach((e, i) => { if (!(S.skipped && i === 6)) cardAs(i, 'made'); });
    await wait(150); if (!live(tok)) return;
    setPhase('done'); glyph('done'); if (T.hidden) label('Show job');
    tell('12 slides ready. Open the deck or undo it.');
  }
  const fix = async () => { S.tok++; const tok = S.tok; setPhase('fix'); cardAs(6, 'now'); tell('Fixing slide 7');
    await wait(1500); if (!live(tok)) return; S.fixed = true; cardAs(6, 'made'); run(tok, 'recheck'); };
  const skip = () => { S.skipped = true; S.tok++; run(S.tok, 'recheck'); };
  const stop = () => { if (!P[S.phase] || !P[S.phase].work) return; S.tok++;
    // stopping a fix goes back to the problem it was fixing
    if (S.phase === 'fix'){ cardAs(6, 'bad'); setPhase('error'); return; }
    cards.forEach((e, i) => { if (e.classList.contains('now') || e.classList.contains('chk')) cardAs(i, i < S.n ? 'made' : ''); });
    if (G.classList.contains('read')) glyph('idle');
    setPhase('stopped'); tell(`Stopped. ${S.n} of 12 drafted. Resume or discard.`); };
  const resume = () => { S.tok++; run(S.tok, S.at); };
  const discard = async () => { S.tok++; countdown(0); glyph('gone'); tell('Job discarded'); S.phase = 'idle'; label('Make slides'); await exit(); reset(); };
  const undo = () => { setPhase('removed'); glyph('gone'); tell('Deck removed. Your notes are unchanged.'); };
  const redo = () => { cards.forEach((e, i) => { if (!(S.skipped && i === 6)) cardAs(i, 'made'); }); glyph('done'); setPhase('done'); tell('Deck restored'); };
  const openDeck = async () => { countdown(0); tell('Opening the deck'); S.phase = 'idle'; label('Make slides'); await exit(); };

  c.on(make, 'click', start);
  c.on(moreB, 'click', () => toggleMore());
  c.on(stopB, 'click', stop);
  c.on(xB, 'click', dismiss);
  // Escape closes the toast while the focus is in it, and the focus goes back to the button that started it
  c.on(T, 'keydown', e => { if (e.key !== 'Escape' || T.hidden) return; const f = T.contains(document.activeElement); dismiss(); if (f) c.later(motion().t + 20, () => make.focus({ preventScroll:true })); });

  /* swipe it away: it follows the finger or the pointer sideways and goes once it has moved far enough, or eases back */
  let sw = null;
  c.on(T, 'pointerdown', e => { if (e.button || e.target.closest('button')) return; sw = { x:e.clientX, y:e.clientY, t:performance.now(), dx:0, id:e.pointerId, on:false }; });
  c.on(T, 'pointermove', e => { if (!sw || e.pointerId !== sw.id) return; const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
    if (!sw.on){ if (Math.abs(dx) < 6 || Math.abs(dy) > Math.abs(dx)) return; sw.on = true; T.setPointerCapture(e.pointerId); }
    sw.dx = dx; T.style.transform = `translateX(${dx}px)`; T.style.opacity = String(Math.max(.2, 1 - Math.abs(dx) / 260)); });
  const swEnd = e => { if (!sw || e.pointerId !== sw.id) return; const s = sw; sw = null; if (!s.on) return;
    const v = Math.abs(s.dx) / Math.max(1, performance.now() - s.t), M = motion();
    if (Math.abs(s.dx) > 90 || v > .6){ const dir = Math.sign(s.dx) || 1; countdown(0);
      const a = T.animate([{ transform:`translateX(${s.dx}px)`, opacity:T.style.opacity }, { transform:`translateX(${dir * 420}px)`, opacity:0 }], { duration:M.t, easing:M.ease, fill:'forwards' });
      after(); a.finished.then(() => { T.hidden = true; a.cancel(); T.style.transform = ''; T.style.opacity = ''; back(); }, () => {}); }
    else { T.animate([{ transform:`translateX(${s.dx}px)`, opacity:T.style.opacity }, { transform:'none', opacity:1 }], { duration:M.t, easing:M.ease }); T.style.transform = ''; T.style.opacity = ''; } };
  c.on(T, 'pointerup', swEnd); c.on(T, 'pointercancel', swEnd);

  /* the demo: the person makes slides, opens the steps, fixes the problem the check finds, tries Undo and Redo, then opens
     the deck */
  c.story(async s => {
    await s.beat(2);
    await s.tap(make);
    await s.beat(5);
    await s.tap(moreB);
    s.away();
    await s.until(() => S.n >= 9);
    await s.tap(moreB);
    s.away();
    await s.until(() => S.phase === 'error');
    await s.beat(3);
    await s.tap(btnOf('Fix slide 7'));
    s.away();
    await s.until(() => S.phase === 'done');
    await s.beat(4);
    await s.tap(btnOf('Undo'));
    await s.beat(3);
    await s.tap(btnOf('Redo'));
    s.away();
    await s.beat(5);
    await s.tap(btnOf('Open'));
    s.away();
  });
});
