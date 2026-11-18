// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, REDUCE, grow, seg, stagger, swap } from '../core/core.js';
DM.def('reasoning-trail', (r, c) => {
  const body = $('.rtr-body', r), head = $('.rtr-h', r), fold = $('.rtr-fold', r), title = $('.rtr-title', r), time = $('.rtr-time', r), mark = $('.rtr-mark', r);
  let tab = 'plan', planDone = 0, secs = 0, finished = false, just = -1;
  const plan = [['Open the onboarding file','4 frames'],['Compare it with the design system','12 components'],['Find spacing that breaks the 8px grid','3 frames'],['Draft fixes for review','Ready']];
  // each step carries Clean's own mark (.rtr-m) beside Soft's glyph; the style shows one of them. The step that has just
  // finished (just) and the one it hands on to play Clean's tick and rail once
  const tick = '<svg viewBox="0 0 24 24"><path pathLength="1" d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  const views = {
    plan: () => plan.map((p, i) => { const s = i < planDone ? 'done' : i === planDone && !finished ? 'now' : 'next';
      return `<div class="rtr-li ${s === 'now' ? 'now' : ''}${i === just ? ' just' : ''}${i === just + 1 && s === 'now' ? ' next-in' : ''}" data-s="${s}"><span class="g">${i < planDone ? `<span style="color:var(--dm-ok)">${I('check','xs')}</span>` : i === planDone && !finished ? '<span class="pulse"></span>' : '<span class="dot" style="color:var(--dm-faint)"></span>'}<span class="rtr-m" aria-hidden="true">${s === 'done' ? tick : ''}</span></span><span>${p[0]}<span class="d">${i < planDone ? p[1] : i === planDone && !finished ? 'Working' : 'Next'}</span></span></div>`; }).join(''),
    notes: () => ['The hero card uses 20px padding, every other card uses 24px.','Mobile frames already follow the grid, desktop drifted.','Two buttons use a hard-coded grey instead of a token.'].map(t => `<div class="rtr-li"><span class="g"><span class="dot" style="color:var(--dm-faint)"></span></span><span>${t}</span></div>`).join(''),
    sources: () => `<div class="rtr-src"><button class="fchip lnk" data-tip-at="below" data-tip="Figma, 4 frames read">${I('figma','xs')}Onboarding.fig</button><button class="fchip lnk" data-tip-at="below" data-tip="src/styles/tokens.ts, 212 lines"><span class="ft">TS</span>tokens.ts</button><button class="fchip lnk" data-tip-at="below" data-tip="src/components/Card.tsx, 2 edits"><span class="ft re">TSX</span>Card.tsx</button><button class="fchip lnk" data-tip-at="below" data-tip="designme.dev/guide/spacing">${I('globe','xs')}Spacing guide</button></div>`,
    edits: () => `<div class="rtr-li"><span class="g">${I('edit','xs')}</span><span>Card.tsx<span class="d">2 lines</span></span></div><div class="rtr-edit"><div class="x">padding: 20px;</div><div class="a">padding: var(--space-6);</div></div><div class="rtr-li"><span class="g">${I('edit','xs')}</span><span>Button.tsx<span class="d">1 line</span></span></div><div class="rtr-edit"><div class="x">color: #8a8a8a;</div><div class="a">color: var(--text-dim);</div></div>`
  };
  const paint = anim => { body.dataset.v = tab; body.innerHTML = views[tab](); if (anim) stagger(Array.from(body.children), 50); };
  // Clean: the card grows with what it holds instead of keeping the room of its tallest view (grow()), and stays centred
  const clean = (r.closest('[data-style]') || document.documentElement).dataset.style === 'clean';
  // the header opens and folds the trail, by click, Enter or Space, and aria-expanded always says which
  let open = true;
  const setOpen = o => { open = o; fold.classList.toggle('shut', !o); fold.inert = !o; head.setAttribute('aria-expanded', o); };
  c.on(head, 'click', () => setOpen(!open));
  c.on(head, 'keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.altKey && !e.ctrlKey && !e.metaKey){ e.preventDefault(); if (!e.repeat) setOpen(!open); } });
  // the trail keeps the room of its tallest view, so the tabs under it stay put and the trail sits centred above them.
  // A hidden copy measures each view at the trail's own width
  const rtr = $('.rtr', r), main = rtr.closest('.dm-main'); let fitW = 0;
  const fit = () => {
    const w = rtr.offsetWidth; if (!main || !w || w === fitW) return; fitW = w;
    const ghost = rtr.cloneNode(true), gb = $('.rtr-body', ghost);
    ghost.inert = true; ghost.setAttribute('aria-hidden', 'true'); $('.rtr-fold', ghost).classList.remove('shut');
    Object.assign(ghost.style, { position:'absolute', left:'0', top:'0', width:w + 'px', visibility:'hidden', pointerEvents:'none' });
    main.appendChild(ghost);
    let h = 0; for (const v in views){ gb.innerHTML = views[v](); h = Math.max(h, ghost.offsetHeight); }
    ghost.remove(); main.style.minHeight = Math.ceil(h) + 'px'; main.style.justifyContent = 'center';
  };
  // switching views grows or shrinks the open trail to its new height instead of jumping to it
  const ease = from => {
    if (REDUCE || !open || clean) return; const to = body.offsetHeight; if (Math.abs(to - from) < 1) return;
    const cs = getComputedStyle(body), ms = parseFloat(cs.getPropertyValue('--dm-t')) * 1000 || 450;
    if (body._a) body._a.cancel();
    body.style.overflow = 'hidden';
    body._a = body.animate([{ height:from + 'px' }, { height:to + 'px' }], { duration:ms, easing:cs.getPropertyValue('--dm-ease').trim() || 'ease' });
    body._a.onfinish = body._a.oncancel = () => { body.style.overflow = ''; body._a = null; };
  };
  seg($('.seg2', r), v => { const from = body.offsetHeight; tab = v; paint(true); ease(from); });
  paint(true);
  // grow() starts once the card's entrance has settled: it measures the content on screen, and the entrance's .98 scale
  // would otherwise leave the card that much short of it
  if (clean) requestAnimationFrame(() => { const run = []; for (let e = rtr; e; e = e.parentElement) run.push(...e.getAnimations().filter(a => a.effect && a.effect.getComputedTiming().endTime !== Infinity));
    Promise.all(run.map(a => a.finished.catch(() => {}))).then(() => { if (!c.dead) c.offs.push(grow(rtr)); }); });
  else {
    fit();
    const ro = new ResizeObserver(fit); ro.observe(main || rtr); c.offs.push(() => ro.disconnect());
    if (document.fonts) document.fonts.ready.then(() => { if (!c.dead){ fitW = 0; fit(); } });
  }
  c.every(1000, () => { if (!finished){ secs++; time.textContent = secs + 's'; } });
  c.run(async () => {
    for (planDone = 0; planDone < plan.length; ){
      await c.wait(1500); planDone++; just = planDone - 1; if (tab === 'plan') paint(false); just = -1;
    }
    finished = true; title.classList.remove('shim'); mark.classList.remove('on'); swap(title, 'Reasoned for ' + Math.max(secs, 5) + 's'); time.textContent = ''; just = plan.length - 1; if (tab === 'plan') paint(false); just = -1;
    // Clean closes the trail with its foot strip: the plan done, and what the agent read and changed
    $('.rtr-fd', r).textContent = `All ${plan.length} steps done`; $('.rtr-fs', r).textContent = '4 sources · 2 edits';
    $('.rtr-ff', r).classList.remove('shut');
  });
});
