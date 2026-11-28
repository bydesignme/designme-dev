// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, DM, I, hideTip, hoverGlide, showTip, tipFor, tipNext } from '../core/core.js';
DM.def('tooltip', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{undo}', I('undo')).replace('{chat}', I('edit')).replace('{spark}', I('spark')).replace('{users}', I('users')).replace('{a1}', AV('MK','var(--dm-av-l)','MK-g03')).replace('{a2}', AV('DA','var(--dm-av-b)'));
  const P = [['MK','var(--dm-av-l)','Maya Kim','Design lead','Editing Pricing, frame 2','MK-g03'],['DA','var(--dm-av-b)','Design agent','Working for Maya','Auditing contrast, 2 of 6 checks']];
  const card = $('.ttp-card', r), ci = $('.ttp-ci', r), root = $('.ttp', r); let t, on = null, raf = 0, at = '';
  // Clean's one hover: a highlight that glides from button to button (hoverGlide)
  c.offs.push(hoverGlide($('.ttp-bar', r), '.ib,.ttp-av'));
  /* the card sits centred on its avatar, or right-aligned to it (left-aligned on the left) where the stage's edge is near,
     under it when there is room in the stage and over it when there isn't */
  const place = b => {
    const rr = root.getBoundingClientRect(), br = b.getBoundingClientRect(), w = card.offsetWidth, h = card.offsetHeight;
    const st = root.closest('.stage-in'), sb = st ? (st.closest('.stage-inner') || st.parentElement).getBoundingClientRect() : { left:0, right:innerWidth, top:0, bottom:innerHeight };
    const lo = Math.max(0, sb.left) + 8, hi = Math.min(innerWidth, sb.right) - 8;
    let x = br.left + br.width / 2 - w / 2; if (x + w > hi) x = Math.max(lo, br.right - w); else if (x < lo) x = Math.min(hi - w, br.left);
    const down = br.bottom + 10 + h <= Math.min(innerHeight, sb.bottom) - 8 || br.top - 10 - h < Math.max(0, sb.top) + 8;
    card.classList.toggle('up', !down);
    card.style.left = Math.round(x - rr.left) + 'px'; card.style.top = Math.round((down ? br.bottom + 10 : br.top - 10 - h) - rr.top) + 'px';
  };
  // while it shows it goes where its avatar goes (owner, 19 Nov: nothing places a tooltip once and leaves it)
  const follow = () => { raf = 0; if (!on || c.dead) return; const b = on.getBoundingClientRect(), k = `${b.left},${b.top}`; if (k !== at){ at = k; place(on); } raf = requestAnimationFrame(follow); };
  const open = (b, now) => { clearTimeout(t); t = setTimeout(() => { const p = P[+b.dataset.card];
      ci.innerHTML = `<div class="ttp-ch">${AV(p[0], p[1], p[5])}<div><b>${p[2]}</b><span>${p[3]}</span></div></div><div class="ttp-cs">${p[0] === 'DA' ? '<span class="think on" style="color:var(--dm-accent-mark,var(--dm-accent))"><i></i><i></i><i></i><i></i></span><span class="shim">' + p[4] + '</span>' : '<span class="dot"></span>' + p[4]}</div>`;
      on = b; at = ''; place(b); card.classList.add('show'); card.removeAttribute('aria-hidden'); cancelAnimationFrame(raf); raf = requestAnimationFrame(follow); }, now ? 0 : 300); };
  const close = () => { clearTimeout(t); on = null; cancelAnimationFrame(raf); card.classList.remove('show'); card.setAttribute('aria-hidden', 'true'); };
  // a person's card opens on hover after a short wait, and at once on keyboard focus; it closes as the pointer or focus leaves
  $$('.ttp-av', r).forEach(b => { b.onmouseenter = () => open(b); b.onmouseleave = () => { if (b !== document.activeElement || !b.matches(':focus-visible')) close(); };
    b.onfocus = () => { if (b.matches(':focus-visible')) open(b, true); }; b.onblur = close; });
  c.offs.push(() => { clearTimeout(t); cancelAnimationFrame(raf); });
  // once it has entered, it shows what it does: a shortcut tip, then the agent's card. Pointing at it takes over, as does
  // clicking, focusing or typing in it
  // what the demo opened goes when the pointer comes in, unless it is on that very control: the visitor's own hover decides
  // from then on, so no tip or card is left over from the demo over the one they point at
  let touched = false, shown = null;
  c.on(root, 'pointerenter', () => { touched = true;
    if (shown === 'tip' && tipFor && !tipNext && root.contains(tipFor) && !tipFor.matches(':hover')) hideTip();
    if (shown === 'card' && !$('.ttp-av:hover', r)) close();
    shown = null; });
  const go = () => { if (touched || c.mine) throw 'stop'; };
  c.run(async () => {
    await c.wait(1300); go(); if (tipFor) return;
    const ask = $('[data-tip-k="⌘J"]', r); showTip(ask); shown = 'tip'; await c.wait(1700); go(); if (tipFor === ask) hideTip(true); shown = null;
    await c.wait(500); go();
    const av = $('.ttp-av[data-card="1"]', r); open(av); shown = 'card'; await c.wait(2600); go(); close(); shown = null;
  });
});
