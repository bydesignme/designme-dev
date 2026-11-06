// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, html } from '../core/core.js';
DM.def('toast-stack', (r, c) => {
  const stack = $('.tsk-stack', r);
  const pool = [
    ['ok','var(--dm-ok)','var(--dm-ok-bg)','Tests passed','42 of 42 in 38s'],
    ['pr','var(--dm-merge)','var(--dm-merge-bg)','PR #412 is ready','Use shared spacing tokens'],
    ['figma','var(--dm-pl)','var(--dm-pl-bg)','Frames synced','6 frames from Pricing.fig'],
    ['warn','var(--dm-warn)','var(--dm-warn-bg)','Budget at 80%','1,600 of 2,000 credits'],
    ['spark','var(--dm-pb)','var(--dm-pb-bg)','Draft written','Launch email, 2 subject lines']
  ];
  // the stack fans out under the pointer, or while the focus is in it; a toast that can't be seen can't take the focus
  let items = [], n = 0, hover = false, focused = false;
  function layout(){
    const fan = hover || focused; let y = 0;
    const hs = items.map(it => it.offsetHeight);
    stack.style.setProperty('--dm-fanh', (hs.slice(-4).reduce((a, b) => a + b + 8, 0) - 8 || 96) + 'px');
    stack.classList.toggle('fan', fan);
    items.slice().reverse().forEach((it, i) => {
      if (fan){ it.style.transform = `translateY(${-y}px)`; it.style.opacity = i > 3 ? 0 : 1; it.style.filter = 'none'; if (i < 3) y += hs[items.length - 1 - i] + 8; }
      else { const k = Math.min(i, 3); it.style.transform = `translateY(${-k * 10}px) scale(${1 - k * .05})`; it.style.opacity = i > 2 ? 0 : 1 - k * .15; it.style.filter = i ? 'blur(.3px)' : 'none'; }
      it.style.zIndex = 100 - i; it.inert = fan ? i > 3 : i > 0;
    });
  }
  function add(){
    const p = pool[n++ % pool.length];
    const el = html(`<div class="tsk-c"><span class="g" style="color:${p[1]};background:${p[2]}">${I(p[0])}</span><div class="tx"><b>${p[3]}</b><span>${p[4]}</span></div><span class="t">now</span><button class="ib" aria-label="Dismiss" data-tip="Dismiss">${I('x')}</button></div>`);
    el.style.transform = 'translateY(24px) scale(.96)'; el.style.opacity = 0; el.style.filter = 'blur(6px)';
    stack.appendChild(el); items.push(el);
    $('.ib', el).onclick = () => { items = items.filter(x => x !== el); el.style.opacity = 0; el.style.transform += ' translateX(30px)'; setTimeout(() => el.remove(), 400); layout(); };
    if (items.length > 6){ const old = items.shift(); old.remove(); }
    requestAnimationFrame(() => requestAnimationFrame(layout));
    items.forEach((it, i) => { if (i < items.length - 1){ const t = $('.t', it); t.textContent = (items.length - 1 - i) * 2 + 'm'; } });
  }
  c.on(stack, 'pointerenter', () => { hover = true; layout(); });
  c.on(stack, 'pointerleave', () => { hover = false; layout(); });
  c.on(stack, 'focusin', () => { if (!focused){ focused = true; layout(); } });
  c.on(stack, 'focusout', e => { if (!stack.contains(e.relatedTarget)){ focused = false; layout(); } });
  $('.tsk-add', r).onclick = add;
  c.run(async () => {
    for (let i = 0; i < 3; i++){ await c.wait(i ? 700 : 400); add(); }
    // then a new one now and then, held back while the stack is fanned out under the pointer, until you take over
    for (;;){ await c.step(3800); if (!hover && !focused) add(); }
  });
});
