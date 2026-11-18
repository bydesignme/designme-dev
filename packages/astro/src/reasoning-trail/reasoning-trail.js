// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, grow, reflow, seg, showTip, stagger, swap, tipFor } from '../core/core.js';
DM.def('reasoning-trail', (r, c) => {
  const body = $('.rtr-body', r), head = $('.rtr-h', r), fold = $('.rtr-fold', r), title = $('.rtr-title', r), time = $('.rtr-time', r), mark = $('.rtr-mark', r);
  const rtr = $('.rtr', r), main = rtr.closest('.dm-main');
  let tab = 'plan', secs = 0, just = -1;
  const plan = [['Open the onboarding file','4 frames'],['Compare it with the design system','12 components'],['Find spacing that breaks the 8px grid','3 frames'],['Draft fixes for review','Ready']];
  const NOTES = ['The hero card uses 20px padding, every other card uses 24px.','Mobile frames already follow the grid, desktop drifted.','Two buttons use a hard-coded grey instead of a token.'];
  // each source's chip, and its tip while the agent reads it, once it has read it, and (Card.tsx) once it has edited it
  const SRC = [
    { k:'fig', mark:I('figma','xs'), label:'Onboarding.fig', reading:'Reading the frames in Figma', read:'Figma, 4 frames read' },
    { k:'ts', mark:'<span class="ft">TS</span>', label:'tokens.ts', reading:'Reading src/styles/tokens.ts', read:'src/styles/tokens.ts, 212 lines' },
    { k:'tsx', mark:'<span class="ft re">TSX</span>', label:'Card.tsx', reading:'Reading src/components/Card.tsx', read:'src/components/Card.tsx', edited:'src/components/Card.tsx, 2 edits' },
    { k:'web', mark:I('globe','xs'), label:'Spacing guide', reading:'Reading designme.dev/guide/spacing', read:'designme.dev/guide/spacing' }
  ];
  const EDITS = [
    `<div class="rtr-li" data-key="e0"><span class="g">${I('edit','xs')}</span><span>Card.tsx<span class="d">2 lines</span></span></div><div class="rtr-edit" data-key="e0d"><div class="x">padding: 20px;</div><div class="a">padding: var(--space-6);</div></div>`,
    `<div class="rtr-li" data-key="e1"><span class="g">${I('edit','xs')}</span><span>Button.tsx<span class="d">1 line</span></span></div><div class="rtr-edit" data-key="e1d"><div class="x">color: #8a8a8a;</div><div class="a">color: var(--text-dim);</div></div>`
  ];
  // where the run is: the plan steps done, the notes found (by their place in NOTES), each source's state (unread,
  // 'reading', 'read' or 'edited') and the edits drafted. Every view shows only what the run has made by then; END is
  // the finished trail
  const now = { done:0, end:false, notes:[], src:['reading'], edits:0 };
  const END = { done:plan.length, end:true, notes:[0, 1, 2], src:['read', 'read', 'edited', 'read'], edits:2 };
  // a view with nothing in it yet says so, on the row the first one will take
  const none = what => `<div class="rtr-li" data-key="none"><span class="g"><span class="dot" style="color:var(--dm-faint)"></span></span><span class="muted">No ${what} yet</span></div>`;
  // each step carries Clean's own mark (.rtr-m) beside Soft's glyph; the style shows one of them. The step that has just
  // finished (just) and the one it hands on to play Clean's tick and rail once
  const tick = '<svg viewBox="0 0 24 24"><path pathLength="1" d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  const views = {
    plan: S => plan.map((p, i) => { const s = i < S.done ? 'done' : i === S.done && !S.end ? 'now' : 'next';
      return `<div class="rtr-li ${s === 'now' ? 'now' : ''}${i === just ? ' just' : ''}${i === just + 1 && s === 'now' ? ' next-in' : ''}" data-s="${s}"><span class="g">${i < S.done ? `<span style="color:var(--dm-ok)">${I('check','xs')}</span>` : i === S.done && !S.end ? '<span class="pulse"></span>' : '<span class="dot" style="color:var(--dm-faint)"></span>'}<span class="rtr-m" aria-hidden="true">${s === 'done' ? tick : ''}</span></span><span>${p[0]}<span class="d">${i < S.done ? p[1] : i === S.done && !S.end ? 'Working' : 'Next'}</span></span></div>`; }).join(''),
    notes: S => S.notes.length ? NOTES.map((t, i) => S.notes.includes(i) ? `<div class="rtr-li" data-key="n${i}"><span class="g"><span class="dot" style="color:var(--dm-faint)"></span></span><span>${t}</span></div>` : '').join('') : none('notes'),
    // a source the agent is still reading shimmers, as the header does while it thinks
    sources: S => S.src.some(Boolean) ? `<div class="rtr-src" data-key="src">${SRC.map((x, i) => { const s = S.src[i]; return s ? `<button class="fchip lnk" data-key="s-${x.k}" data-tip-at="below" data-tip="${x[s]}">${x.mark}${s === 'reading' ? `<span class="shim">${x.label}</span>` : x.label}</button>` : ''; }).join('')}</div>` : none('sources'),
    edits: S => S.edits ? EDITS.slice(0, S.edits).join('') : none('edits')
  };
  const paint = anim => { body.dataset.v = tab; body.innerHTML = views[tab](now); if (anim) stagger(Array.from(body.children), 50); };
  // the view's new markup laid over what is on screen: an element that stays (known by its data-key) is kept, so a tip
  // open on a chip stays open, and only what changed in it is redrawn; new ones go in where they belong and gone ones come
  // out. Returns the new ones
  const morph = markup => {
    const t = document.createElement('template'); t.innerHTML = markup; const fresh = [];
    const same = (e, n) => e.innerHTML === n.innerHTML && [...n.attributes].every(a => a.name === 'class' || a.name === 'style' || e.getAttribute(a.name) === a.value);
    const walk = (have, want) => {
      const old = new Map([...have.children].map(e => [e.dataset.key, e]));
      [...want.children].forEach((n, i) => {
        let e = old.get(n.dataset.key);
        if (e){ old.delete(n.dataset.key);
          if (n.querySelector('[data-key]')) walk(e, n);
          else if (!same(e, n)){ for (const a of n.attributes) if (a.name !== 'class' && a.name !== 'style') e.setAttribute(a.name, a.value); e.innerHTML = n.innerHTML; if (tipFor === e) showTip(e); }
        } else { e = n; fresh.push(e); }
        if (have.children[i] !== e) have.insertBefore(e, have.children[i] || null);
      });
      old.forEach(e => e.remove());
    };
    walk(body, t.content); return fresh;
  };
  // Clean: the card grows with what it holds instead of keeping the room of its tallest view (grow()), and stays centred
  const clean = (r.closest('[data-style]') || document.documentElement).dataset.style === 'clean';
  // the header opens and folds the trail, by click, Enter or Space, and aria-expanded always says which
  let open = true;
  const setOpen = o => { open = o; fold.classList.toggle('shut', !o); fold.inert = !o; head.setAttribute('aria-expanded', o); };
  c.on(head, 'click', () => setOpen(!open));
  c.on(head, 'keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.altKey && !e.ctrlKey && !e.metaKey){ e.preventDefault(); if (!e.repeat) setOpen(!open); } });
  // the trail keeps the room of its tallest view, finished, so the tabs under it stay put and the trail sits centred above
  // them. A hidden copy measures each view at the trail's own width
  let fitW = 0;
  const fit = () => {
    const w = rtr.offsetWidth; if (!main || !w || w === fitW) return; fitW = w;
    const ghost = rtr.cloneNode(true), gb = $('.rtr-body', ghost);
    ghost.inert = true; ghost.setAttribute('aria-hidden', 'true'); $('.rtr-fold', ghost).classList.remove('shut');
    Object.assign(ghost.style, { position:'absolute', left:'0', top:'0', width:w + 'px', visibility:'hidden', pointerEvents:'none' });
    main.appendChild(ghost);
    let h = 0; for (const v in views){ gb.innerHTML = views[v](END); h = Math.max(h, ghost.offsetHeight); }
    ghost.remove(); main.style.minHeight = Math.ceil(h) + 'px'; main.style.justifyContent = 'center';
  };
  // switching views, or a view taking in what the run has just made, grows or shrinks the open trail to its new height
  // instead of jumping to it (from wherever an earlier change has it)
  const ease = from => {
    if (REDUCE || !open || clean) return; if (body._a) body._a.cancel();
    const to = body.offsetHeight; if (Math.abs(to - from) < 1) return;
    const cs = getComputedStyle(body), ms = parseFloat(cs.getPropertyValue('--dm-t')) * 1000 || 450;
    body.style.overflow = 'hidden';
    body._a = body.animate([{ height:from + 'px' }, { height:to + 'px' }], { duration:ms, easing:cs.getPropertyValue('--dm-ease').trim() || 'ease' });
    body._a.onfinish = body._a.oncancel = () => { body.style.overflow = ''; body._a = null; };
  };
  seg($('.seg2', r), v => { const from = body.offsetHeight; tab = v; paint(true); ease(from); });
  paint(true);
  // what the run has just made comes into the view on screen: new rows and chips come in as a view's do, and a row that a
  // new one lands above glides down to make room
  const update = () => {
    if (tab === 'plan') return;
    const from = body.offsetHeight; let fresh = [];
    reflow(() => $$('[data-key]:not(.rtr-src)', body), () => { fresh = morph(views[tab](now)); }, { root:rtr, enter:false, leave:false });
    fresh.forEach(el => enter(el));
    ease(from);
  };
  // grow() starts once the card's entrance has settled: it measures the content on screen, and the entrance's .98 scale
  // would otherwise leave the card that much short of it
  if (clean) requestAnimationFrame(() => { const run = []; for (let e = rtr; e; e = e.parentElement) run.push(...e.getAnimations().filter(a => a.effect && a.effect.getComputedTiming().endTime !== Infinity));
    Promise.all(run.map(a => a.finished.catch(() => {}))).then(() => { if (!c.dead) c.offs.push(grow(rtr)); }); });
  else {
    fit();
    const ro = new ResizeObserver(fit); ro.observe(main || rtr); c.offs.push(() => ro.disconnect());
    if (document.fonts) document.fonts.ready.then(() => { if (!c.dead){ fitW = 0; fit(); } });
  }
  c.every(1000, () => { if (!now.end){ secs++; time.textContent = secs + 's'; } });
  // a plan step finishes: in Clean its tick draws and the rail runs down into the next one
  const step = () => { now.done++; just = now.done - 1; if (tab === 'plan') paint(false); just = -1; };
  // the run, 1.5s a step: each source shows while the agent reads it, each note once the step that finds it is done, and
  // each edit as the last step drafts it
  c.run(async () => {
    // Open the onboarding file: it reads Onboarding.fig, and sees the hero card's padding is off
    await c.wait(1500); step(); now.src[0] = 'read'; now.notes.push(0);
    // Compare it with the design system: it reads tokens.ts, then Card.tsx, and finds the hard-coded grey
    now.src[1] = 'reading'; update();
    await c.wait(750); now.src[1] = 'read'; now.src[2] = 'reading'; update();
    await c.wait(750); step(); now.src[2] = 'read'; now.notes.push(2);
    // Find spacing that breaks the 8px grid: it reads the spacing guide, and finds where desktop drifted
    now.src[3] = 'reading'; update();
    await c.wait(1500); step(); now.src[3] = 'read'; now.notes.push(1); update();
    // Draft fixes for review: the edit to Card.tsx, then the one to Button.tsx
    await c.wait(400); now.edits = 1; now.src[2] = 'edited'; update();
    await c.wait(600); now.edits = 2; update();
    await c.wait(500);
    now.done = plan.length; now.end = true; title.classList.remove('shim'); mark.classList.remove('on'); swap(title, 'Reasoned for ' + Math.max(secs, 5) + 's'); time.textContent = ''; just = plan.length - 1; if (tab === 'plan') paint(false); just = -1;
    // Clean closes the trail with its foot strip: the plan done, and what the agent read and changed
    $('.rtr-fd', r).textContent = `All ${plan.length} steps done`; $('.rtr-fs', r).textContent = '4 sources · 2 edits';
    $('.rtr-ff', r).classList.remove('shut');
  });
});
