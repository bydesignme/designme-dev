// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, centre, enter, seg, tween } from '../core/core.js';
DM.def('set-limit', (r, c) => {
  const bar = $('.slx-bar', r), k = $('.slx-k', r), tt = $('.slx-tt', r), v = $('.slx-v', r), used = $('.slx-used', r), fc = $('.slx-fc', r), warn = $('.slx-warn', r);
  const MIN = 50, MAX = 500, SPENT = 128, FC = 184; let cap = 200, mode = 'pause';
  const pct = x => (x - MIN) / (MAX - MIN) * 100;
  const vin = $('.slx-in', r), fit = () => { vin.style.width = Math.max(1, vin.value.length) + 'ch'; };
  function upd(anim){
    k.style.left = pct(cap) + '%'; tt.textContent = '$' + cap; k.setAttribute('aria-valuenow', cap);
    // while someone types, the field keeps what they typed
    if (document.activeElement !== vin){ vin.value = cap; fit(); }
    used.style.width = Math.min(100, SPENT / cap * pct(cap)) + '%'; fc.style.width = Math.min(pct(cap), FC / cap * pct(cap)) + '%';
    const over = FC > cap;
    const h = over ? `<span class="w">${I('alert','xs')}Forecast passes your cap around Oct 27. Runs will ${mode === 'pause' ? 'pause' : mode === 'ask' ? 'wait for you' : 'keep going'}.</span>` : `<span class="o">${I('ok','xs')}<span>On track. About <span class="slx-left">$${cap - FC}</span> left at month end.</span></span>`;
    // a new message comes in with the entrance; while it stays the same, only the amount left follows the cap
    if (warn.dataset.h !== String(over) + mode){ warn.dataset.h = String(over) + mode; warn.innerHTML = h; enter(warn.firstChild); }
    else if (!over) $('.slx-left', warn).textContent = '$' + (cap - FC);
  }
  const at = e => { glide++; const b = bar.getBoundingClientRect(); cap = Math.round((MIN + (MAX - MIN) * Math.max(0, Math.min(1, (e.clientX - b.left) / b.width))) / 10) * 10; upd(); };
  bar.onpointerdown = e => { bar.setPointerCapture(e.pointerId); k.classList.add('drag'); at(e); bar.onpointermove = at; };
  bar.onpointerup = bar.onpointercancel = () => { k.classList.remove('drag'); bar.onpointermove = null; };
  // a change from the keys or the field shows the amount over the knob for a moment, so it can be followed there too
  let sayT = 0; const say = () => { k.classList.add('say'); clearTimeout(sayT); sayT = setTimeout(() => k.classList.remove('say'), 1200); };
  k.onkeydown = e => { if (e.key === 'ArrowRight' || e.key === 'ArrowUp'){ cap = Math.min(MAX, cap + 10); upd(); say(); e.preventDefault(); } if (e.key === 'ArrowLeft' || e.key === 'ArrowDown'){ cap = Math.max(MIN, cap - 10); upd(); say(); e.preventDefault(); } };
  seg($('.slx-sg', r), m => { mode = m; upd(); });
  // typing a budget: the cap glides to it while it's in range; Enter or leaving the field keeps it (held to the range), Escape goes back
  let glide = 0, before = cap;
  const goTo = n => { const id = ++glide, from = cap; say(); tween(from, n, 450, x => { if (id === glide){ cap = Math.round(x); upd(); } }); };
  const commit = () => { const n = vin.value === '' ? before : Math.max(MIN, Math.min(MAX, parseInt(vin.value, 10))); vin.value = n; fit(); if (n !== cap) goTo(n); };
  // a click selects the whole figure at once, so typing replaces it
  v.addEventListener('pointerdown', e => { if (document.activeElement !== vin){ e.preventDefault(); vin.focus({ preventScroll:true }); } });
  vin.onfocus = () => { before = cap; vin.select(); };
  vin.oninput = () => { vin.value = vin.value.replace(/\D/g, '').slice(0, 4); fit(); const n = +vin.value; if (vin.value && n >= MIN && n <= MAX) goTo(n); };
  vin.onkeydown = e => {
    if (e.key === 'Enter'){ e.preventDefault(); vin.blur(); }
    else if (e.key === 'Escape'){ vin.value = before; goTo(before); vin.blur(); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowDown'){ e.preventDefault(); const n = Math.max(MIN, Math.min(MAX, (parseInt(vin.value, 10) || cap) + (e.key === 'ArrowUp' ? 10 : -10))); vin.value = n; fit(); goTo(n); }
  };
  vin.onblur = commit;
  used.style.width = 0; fc.style.width = 0; k.style.left = pct(cap) + '%'; fit();
  // the line under the bar takes one line or two, so the panel stays centred in the room its stage keeps for it
  const root = $('.slx', r); centre(c, root, () => root.offsetHeight);
  c.later(200, () => upd());
  // the preview lowers the cap once on its own, unless you take over first
  c.auto(1500, () => tween(200, 170, 900, x => { if (!c.mine){ cap = Math.round(x / 10) * 10; upd(); } }));
});
