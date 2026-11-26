// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, html, iconSwap, swap, tween } from '../core/core.js';
// each toast in the stack is a Toast card (owner, 26 Nov): its head (a live glyph or a status mark, the words, Close with its
// countdown ring), its steps and its footer, swiped or Escaped away. The stack collapses into a deck and fans out under the
// pointer or the keyboard's focus; it reads each card's own height, and the cards and the stack ease together on the motion
// pieces' spring. Its demo is an agent's news as it comes, so it keeps playing under a resting pointer (DM.PLAYS): a job with
// its glyph at work, a success, a problem that becomes its fix in place, and one swiped away. Its timing goes through the
// controller (c.later, the story's beats), and what the visitor sets off keeps running once they take over
DM.def('toast-stack', (r, c) => {
  const stack = $('.tsk-stack', r), addB = $('.tsk-add', r), [polite, loud] = $$('.tst-sr', r);
  const wait = ms => new Promise(res => c.later(REDUCE ? Math.min(ms, 400) : ms, res));
  const motion = () => { const cs = getComputedStyle(r), s = v => parseFloat(cs.getPropertyValue(v)) * 1000 || 340; return { ease:cs.getPropertyValue('--dm-ease').trim() || 'ease', t:s('--dm-t'), fast:s('--dm-t-fast'), tin:s('--dm-t-in') }; };
  // collapsed, the two cards behind the front one peek out 8px each; fanned out, the four in front show, 8px apart; six at most
  const PEEK = 8, GAP = 8, FAN = 4, MAX = 6;
  const MARK = { success:I('ok'), error:I('alert'), warning:I('warn'), info:I('info'), stopped:I('pause'), working:'<span class="spin"></span>' };
  const STEP = { done:I('check'), now:'<span class="spin"></span>', bad:I('alert'), paused:I('pause'), wait:'<span class="tst-pend"></span>' };
  // announcements, through the stack's two live regions: news politely, a problem at once
  const tell = (text, now) => { const el = now ? loud : polite; el.textContent = ''; c.later(60, () => { el.textContent = text; }); };

  /* the stack fans out under a mouse, while the keyboard's focus is in it, on a tap, or while the demo's pointer rests on it */
  let cards = [], hover = false, focused = false, tapped = false, shown = false;
  const fanned = () => hover || focused || tapped || shown;
  const layout = () => {
    const fan = fanned(), front = cards.slice().reverse(), H0 = front.length ? front[0].h : 0;
    let y = 0;
    front.forEach((k, i) => {
      let t, h = k.h, o = 1;
      if (fan){ t = `translateY(${-y}px)`; if (i < FAN) y += k.h + GAP; else o = 0; }
      // the cards behind the front one take its height, so each peeks out by the same 8px whatever it holds
      else { const j = Math.min(i, 2); t = j ? `translateY(${-j * PEEK}px) scale(${1 - j * .05})` : 'translateY(0px)'; if (i) h = H0; if (i > 2) o = 0; }
      k.base = t; k.el.style.height = h + 'px'; k.el.style.zIndex = 100 - i;
      if (!k.fresh && !k.drag){ k.el.style.transform = t; k.el.style.opacity = o; }
      k.el.inert = fan ? i >= FAN : i > 0;
      k.el.classList.toggle('tsk-back', !fan && i > 0);
    });
    stack.style.setProperty('--dm-tsk-h', (fan ? Math.max(0, y - GAP) : H0 + Math.min(Math.max(front.length - 1, 0), 2) * PEEK) + 'px');
    // the countdowns hold while the stack is open for reading
    cards.forEach(k => { if (!k.cd) return; if (fan) k.cd.pause(); else if (k.cd.playState === 'paused') k.cd.play(); });
  };
  c.on(stack, 'pointerenter', e => { if (e.pointerType === 'mouse'){ hover = true; layout(); } });
  c.on(stack, 'pointerleave', e => { if (e.pointerType === 'mouse'){ hover = false; layout(); } });
  c.on(stack, 'focusin', e => { if (!focused && e.target.matches(':focus-visible')){ focused = true; layout(); } });
  c.on(stack, 'focusout', e => { if (focused && !stack.contains(e.relatedTarget)){ focused = false; layout(); } });
  // touch has no hover: a tap on the deck opens it, a tap anywhere else closes it
  c.on(document, 'pointerdown', e => { if (e.pointerType === 'mouse') return; const on = stack.contains(e.target); if (on !== tapped && !(on && e.target.closest('button'))){ tapped = on; layout(); } });

  /* the job's glyph: Toast's hand of slides, dealt as each one is drafted */
  const N = 12, ang = i => -32 + i * 64 / (N - 1);
  const slide = (i, k) => `<g class="tst-cd${k}" style="--dm-a:${ang(i).toFixed(2)}deg;--dm-i:${i}"><rect class="tst-b" x="26" y="6" width="12" height="20" rx="2"/><path class="tst-l" d="M28.5 10h6M28.5 13.5h7M28.5 17h4.5" pathLength="8"/></g>`;
  const deck = '<span class="tst-dk idle" aria-hidden="true"><svg viewBox="0 0 64 40"><g class="tst-pg"><rect class="tst-pp" x="23.5" y="6.5" width="17" height="22" rx="2.5"/><path class="tst-pl" d="M27 12h10M27 15.5h8M27 19h10M27 22.5h6"/><path class="tst-sc" d="M25.5 10h13"/></g>'
    + '<g>' + Array.from({ length:N }, (_, i) => slide(i, ' tst-gh')).join('') + '</g><g class="tst-fan">' + Array.from({ length:N }, (_, i) => slide(i, '')).join('') + '</g>'
    + '<g class="tst-ok"><circle cx="41" cy="27" r="6.5"/><path d="M38.3 27.1l1.9 1.9 3.5-3.6"/></g></svg></span>';
  // look: idle, read, plan, done or gone; n slides drafted, the next one in the accent while drafting
  const glyph = (k, look, n = 0, now = false) => { const G = k.dk; G.setAttribute('class', 'tst-dk ' + look);
    $$('.tst-fan .tst-cd', G).forEach((e, i) => { e.classList.toggle('made', look !== 'gone' && i < n); e.classList.toggle('now', now && i === n); }); };

  /* a card: Toast's own markup */
  const make = job => {
    const el = html(`<div class="tst-t tsk-new"><div class="tsk-in">
      <div class="tst-hd">${job ? deck : '<span class="tst-g mx-ic" aria-hidden="true"></span>'}
        <div class="tst-tx"><span class="tst-ti"></span><span class="tst-de"></span></div>
        <div class="tst-hb">
          <button type="button" class="ib tst-more" aria-expanded="false" aria-label="Show the steps" data-tip="Steps" hidden>${I('chev-d')}</button>
          <button type="button" class="ib tst-stop" aria-label="Stop the job" data-tip="Stop" hidden>${I('stop')}</button>
          <button type="button" class="ib tst-x" aria-label="Close" data-tip="Close"><svg class="tst-ring" viewBox="0 0 28 28" aria-hidden="true" hidden><rect class="tst-tk" x=".75" y=".75" width="26.5" height="26.5"/><rect class="tst-rn" x=".75" y=".75" width="26.5" height="26.5" pathLength="100"/></svg>${I('x')}</button>
        </div>
      </div>
      <div class="fold shut tst-mf"><div><ol class="tst-st" aria-label="Steps"></ol></div></div>
      <div class="fold shut tst-ft"><div><div class="tst-fi"></div></div></div>
    </div></div>`);
    const q = s => $(s, el);
    const k = { el, inner:q('.tsk-in'), g:q('.tst-g'), dk:q('.tst-dk'), ti:q('.tst-ti'), de:q('.tst-de'), moreB:q('.tst-more'), stopB:q('.tst-stop'), xB:q('.tst-x'),
      ring:q('.tst-ring'), rn:q('.tst-rn'), mf:q('.tst-mf'), st:q('.tst-st'), ft:q('.tst-ft'), fi:q('.tst-fi'), h:0, d:{}, cd:null, base:'' };
    el.style.setProperty('--dm-tst-gw', job ? '64px' : '20px');
    c.on(k.moreB, 'click', () => openSteps(k));
    c.on(k.stopB, 'click', () => k.d.onStop && k.d.onStop());
    c.on(k.xB, 'click', () => dismiss(k));
    // Escape closes the card the focus is in; the focus goes on to the next card's Close, or to the button that sends them
    c.on(el, 'keydown', e => { if (e.key === 'Escape'){ e.stopPropagation(); dismiss(k, 'escape'); } });
    swipe(k);
    return k;
  };
  const openSteps = (k, open) => { open = open ?? k.mf.classList.contains('shut'); k.mf.classList.toggle('shut', !open);
    k.moreB.setAttribute('aria-expanded', open); k.moreB.setAttribute('aria-label', open ? 'Hide the steps' : 'Show the steps'); k.moreB.dataset.tip = open ? 'Hide steps' : 'Steps'; };

  /* what a card says and offers: d = { status, title, desc, steps:[[label, state, detail]], acts:[[variant, label, fn]], time,
     onStop, say }. The same card changes in place: its words crossfade (a counter ticks over at once), its mark crossfades
     (iconSwap), its footer opens and shuts, and the card eases to its new height */
  const lead = x => { const m = (x || '').match(/^(\D*)\d/); return m ? m[1] : null; };
  const set = (k, d) => {
    const was = k.d, first = !was.title, working = d.status === 'working'; k.d = d;
    if (first){ k.ti.textContent = d.title; k.ti.classList.toggle('shim', working); }
    else { swap(k.ti, d.title); c.later(REDUCE ? 0 : 170, () => k.ti.classList.toggle('shim', k.d.status === 'working')); }
    if (first || (lead(was.desc) !== null && lead(was.desc) === lead(d.desc))){ if (k.de._sw){ clearTimeout(k.de._sw.t); k.de._sw = null; k.de.classList.remove('out'); } k.de.textContent = d.desc; }
    else swap(k.de, d.desc);
    if (k.g && k.g.dataset.s !== d.status){ const to = () => { k.g.dataset.s = d.status; k.g.innerHTML = MARK[d.status]; }; first ? to() : iconSwap(k.g, to); }
    k.stopB.hidden = !(working && d.onStop); k.xB.hidden = !k.stopB.hidden; k.moreB.hidden = !d.steps;
    if (d.steps){
      if (k.st.children.length !== d.steps.length) k.st.innerHTML = d.steps.map(() => '<li><span class="tst-mk"></span><span class="tst-lb"></span><span class="tst-vl"></span></li>').join('');
      d.steps.forEach(([lb, s, v = ''], i) => { const li = k.st.children[i]; if (li.dataset.s !== s){ li.dataset.s = s; $('.tst-mk', li).innerHTML = STEP[s]; } $('.tst-lb', li).textContent = lb; $('.tst-vl', li).textContent = v; });
    } else openSteps(k, false);
    if (!d.acts) k.ft.classList.add('shut');
    else if (d.acts !== was.acts){
      const open = !k.ft.classList.contains('shut');
      k.fi.innerHTML = d.acts.map(([v, t]) => `<button type="button" class="pill sm ${v}${open ? ' in' : ''}">${t}</button>`).join('');
      [...k.fi.children].forEach((b, i) => b.addEventListener('click', d.acts[i][2]));
      k.ft.classList.remove('shut');
    }
    countdown(k, working ? 0 : d.time || 0);
    // (say:false changes it quietly: a counter ticking, a step on the way; the milestones are announced)
    const say = d.say === false ? k.said : d.say || d.title; if (say !== k.said){ k.said = say; tell(say, d.status === 'error'); }
  };
  const btn = (k, t) => [...k.fi.querySelectorAll('button')].find(b => b.textContent === t);

  /* the countdown on Close: a ring that drains, held while the stack is open for reading (pointer or focus); it closes the card */
  const countdown = (k, ms) => { if (k.cd){ k.cd.cancel(); k.cd = null; } k.ring.toggleAttribute('hidden', !ms); if (!ms) return;
    k.cd = k.rn.animate([{ strokeDashoffset:0 }, { strokeDashoffset:100 }], { duration:ms, fill:'forwards', easing:'linear' });
    if (fanned()) k.cd.pause();
    k.cd.onfinish = () => { k.cd = null; dismiss(k, 'timeout'); }; };
  c.offs.push(() => cards.forEach(k => k.cd && k.cd.cancel()));

  /* a new card comes in at the front: it rises out of a short blur as the cards it covers step back and lose their words */
  const push = (d, job) => {
    const k = make(job); k.fresh = true; stack.appendChild(k.el); cards.push(k);
    set(k, d);
    k.h = k.inner.offsetHeight;
    const ro = new ResizeObserver(() => { const h = k.inner.offsetHeight; if (h && h !== k.h && !k.gone){ k.h = h; layout(); } }); ro.observe(k.inner); c.offs.push(() => ro.disconnect()); k.ro = ro;
    while (cards.length > MAX) dismiss(cards[0], 'drop');
    layout();
    requestAnimationFrame(() => requestAnimationFrame(() => { if (c.dead || k.gone) return; k.fresh = false; k.el.classList.remove('tsk-new'); layout(); }));
    return k;
  };
  /* a card goes: Close, its countdown or Escape fade it 8px down while the others close the gap; a swipe has carried it off */
  const dismiss = (k, how = 'close') => {
    if (k.gone) return; k.gone = true; countdown(k, 0); k.ro && k.ro.disconnect();
    const had = k.el.contains(document.activeElement);
    cards = cards.filter(x => x !== k); k.el.inert = true; k.el.classList.add('tsk-out');
    const end = () => k.el.remove();
    if (how === 'swipe') c.later(motion().t, end);
    else { const from = getComputedStyle(k.el).transform, t0 = from === 'none' ? '' : from;
      const a = k.el.animate(REDUCE ? [{ opacity:getComputedStyle(k.el).opacity }, { opacity:0 }] : [{ transform:t0 || 'none', opacity:getComputedStyle(k.el).opacity }, { transform:t0 + ' translateY(8px) scale(.98)', opacity:0 }], { duration:motion().tin, easing:motion().ease, fill:'forwards' });
      a.finished.then(end, end); }
    layout();
    if (had && how !== 'drop'){ const next = cards[cards.length - 1]; c.later(0, () => ((next && !next.xB.hidden ? next.xB : next && next.stopB) || addB).focus({ preventScroll:true })); }
  };

  /* swipe a card away: it follows the finger or the pointer sideways and goes once it has moved far enough, or eases back */
  const fling = (k, dx, v) => {
    if (Math.abs(dx) > 90 || v > .6){ const dir = Math.sign(dx) || 1, M = motion();
      // (with reduced motion it only fades where it was let go)
      k.el.animate([{ transform:`${k.base} translateX(${dx}px)`, opacity:k.el.style.opacity }, { transform:`${k.base} translateX(${REDUCE ? dx : dx + dir * 140}px)`, opacity:0 }], { duration:REDUCE ? M.fast : M.t, easing:M.ease, fill:'forwards' });
      k.drag = false; k.el.style.transition = ''; dismiss(k, 'swipe'); }
    else { k.drag = false; k.el.style.transition = ''; k.el.style.transform = k.base; k.el.style.opacity = 1; }
  };
  const drag = (k, dx) => { k.drag = true; k.el.style.transition = 'none'; k.el.style.transform = `${k.base} translateX(${dx}px)`; k.el.style.opacity = String(Math.max(.2, 1 - Math.abs(dx) / 260)); };
  const swipe = k => { let sw = null;
    c.on(k.el, 'pointerdown', e => { if (e.button || e.target.closest('button')) return; sw = { x:e.clientX, y:e.clientY, t:performance.now(), dx:0, id:e.pointerId, on:false }; });
    c.on(k.el, 'pointermove', e => { if (!sw || e.pointerId !== sw.id) return; const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
      if (!sw.on){ if (Math.abs(dx) < 6 || Math.abs(dy) > Math.abs(dx)) return; sw.on = true; k.el.setPointerCapture(e.pointerId); }
      sw.dx = dx; drag(k, dx); });
    const up = e => { if (!sw || e.pointerId !== sw.id) return; const s = sw; sw = null; if (s.on) fling(k, s.dx, Math.abs(s.dx) / Math.max(1, performance.now() - s.t)); };
    c.on(k.el, 'pointerup', up); c.on(k.el, 'pointercancel', up); };

  /* the news */
  const SEC = ['Cover', 'Agenda', 'Revenue', 'North', 'South', 'Plan vs actual', 'By region', 'Hiring', 'Open roles', 'Risks', 'Data move', 'Next steps'];
  // a job the agent runs in the background: it reads the notes, outlines and drafts twelve slides; Stop pauses it
  const job = () => {
    let tok = 0, n = 0, at = 0;
    const L = ['Read the notes', 'Outline 12 slides', 'Draft the slides'];
    const steps = (s, v) => L.map((lb, i) => [lb, i < at ? 'done' : i === at ? s : 'wait', i === 2 && i <= at && v ? v : '']);
    const work = (title, desc) => ({ status:'working', title, desc, steps:steps('now', at === 2 ? `${Math.min(n + 1, N)} of 12` : ''), onStop:stop, say:at ? false : 'Making slides from your notes' });
    const k = push({ status:'working', title:'Reading your notes…', desc:'3 sections · 212 words', steps:steps('now'), onStop:() => stop(), say:'Making slides from your notes' }, true);
    const live = t => t === tok && !k.gone && !c.dead;
    async function go(t){
      if (at === 0){ glyph(k, 'read'); set(k, work('Reading your notes…', '3 sections · 212 words')); await wait(1600); if (!live(t)) return; at = 1; }
      if (at === 1){ glyph(k, 'plan'); set(k, { ...work('Outlining the deck…', '12 slides planned'), say:false }); await wait(1200); if (!live(t)) return; at = 2; }
      while (n < N){ glyph(k, 'plan', n, true); set(k, { ...work('Drafting slides…', `Slide ${n + 1} of 12 · ${SEC[n]}`), say:n === 6 ? 'Half the slides are drafted' : false }); await wait(380); if (!live(t)) return; n++; }
      at = 3; glyph(k, 'done', N); done();
    }
    const done = () => set(k, { status:'success', title:'12 slides ready', desc:'Q3 planning deck', steps:steps('done'), time:12000, say:'12 slides ready. Open the deck or undo it.',
      acts:[['line', 'Undo', () => { glyph(k, 'gone'); set(k, { status:'success', title:'Deck removed', desc:'Your notes are unchanged', steps:steps('done'), time:6000, acts:[['line', 'Redo', () => { glyph(k, 'done', N); done(); }]] }); }], ['primary', 'Open', () => dismiss(k)]] });
    function stop(){ tok++; glyph(k, at ? 'plan' : 'idle', n); set(k, { status:'stopped', title:at === 2 ? `Stopped at slide ${n}` : 'Stopped before drafting', desc:`${n} of 12 drafted · nothing lost`, steps:steps('paused', `${n} of 12`), say:`Stopped. ${n} of 12 drafted. Resume or discard.`,
      acts:[['line', 'Discard', () => dismiss(k)], ['primary', 'Resume', () => go(++tok)]] }); }
    go(++tok);
    return k;
  };
  // a problem the agent can fix: the card becomes its fix, then the result, in place
  const tests = () => {
    let tok = 0;
    const T = [['Cart total rounds down', 'bad'], ['Tax shows on the receipt', 'bad'], ['40 other tests', 'done']];
    const fail = () => ({ status:'error', title:'2 tests failed', desc:'checkout.spec · the total is 1¢ off', steps:T, say:'2 tests failed in checkout.spec. Fix them or ignore them.',
      acts:[['line', 'Ignore', () => dismiss(k)], ['primary', 'Fix', () => fix()]] });
    const k = push(fail());
    async function fix(){ const t = ++tok, live = () => t === tok && !k.gone && !c.dead;
      const stop = () => { tok++; set(k, fail()); };
      set(k, { status:'working', title:'Fixing 2 tests…', desc:'Rounding in cart.ts', steps:T.map(([l, s]) => [l, s === 'bad' ? 'now' : s]), onStop:stop, say:'Fixing 2 tests' }); await wait(1700); if (!live()) return;
      for (let i = 6; i <= 42; i += 6){ set(k, { status:'working', title:'Running checkout.spec…', desc:`Passed ${i} of 42`, steps:T.map(([l]) => [l, 'done']), onStop:stop, say:false }); await wait(200); if (!live()) return; }
      set(k, { status:'success', title:'42 tests passed', desc:'Fixed in cart.ts · 1 line', steps:T.map(([l]) => [l, 'done']), time:10000, acts:[['line', 'View diff', () => dismiss(k)]], say:'42 tests passed. Fixed in cart.ts.' });
    }
    return k;
  };
  // plain news, and what Send notification sends: one action at most, and a countdown
  const POOL = [
    { status:'success', title:'Frames synced', desc:'6 frames from Pricing.fig', time:9000 },
    { status:'info', title:'PR #412 is ready', desc:'Use shared spacing tokens · 3 files', time:10000, acts:[['primary', 'Review', null]] },
    { status:'warning', title:'Budget at 80%', desc:'1,600 of 2,000 credits', time:12000, acts:[['warn', 'Raise cap', null]] },
    { status:'success', title:'Draft written', desc:'Launch email · 2 subject lines', time:9000 }
  ];
  let sent = 0;
  const news = (d = POOL[sent++ % POOL.length]) => { let k;
    const acts = d.acts && d.acts.map(([v, t]) => [v, t, () => t === 'Raise cap' ? set(k, { status:'success', title:'Cap raised to 3,000', desc:'1,600 of 3,000 credits', time:6000 }) : dismiss(k)]);
    k = push({ ...d, acts }); return k; };
  c.on(addB, 'click', () => news());

  /* the demo: a job starts, a success and a problem arrive; the pointer opens the stack, fixes the problem, swipes the success
     away, and leaves the stack to fold back */
  c.story(async s => {
    await s.beat(1);
    const J = job();
    await s.beat(3);
    const F = news(POOL[0]); sent = 1;
    await s.beat(3);
    const P = tests();
    await s.beat(3);
    await s.point(P.ti, false); shown = true; layout();
    await s.beat(3);
    await s.tap(btn(P, 'Fix'));
    await s.until(() => P.d.status === 'success');
    await s.beat(2);
    // the swipe: the pointer takes the synced frames' card and drags it off to the right
    if (!F.gone){
      await s.point(F.de, false);
      const hand = $('.hand', c.st), m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(hand ? hand.style.transform : '');
      if (hand){ hand.classList.add('down'); hand.style.transition = 'none'; }
      await tween(0, 120, REDUCE ? 1 : 360, dx => { if (c.mine || c.dead || F.gone) return; drag(F, dx); if (hand && m) hand.style.transform = `translate(${+m[1] + dx}px,${m[2]}px)`; }, t => t * t);
      if (hand){ hand.style.transition = ''; hand.classList.remove('down'); }
      if (c.mine || c.dead) throw 'stop';
      if (!F.gone) fling(F, 120, 1);
    }
    await s.beat(3);
    s.away(); shown = false; layout();
    await s.until(() => J.d.title === '12 slides ready');
    await s.beat(5);
  });
  // the visitor takes over: the stack follows their pointer and focus alone
  c.taken(() => { if (shown){ shown = false; layout(); } });
});
