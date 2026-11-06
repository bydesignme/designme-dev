// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, enter, html, swap, tween } from '../core/core.js';
DM.def('design-tuner', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{c\}/g, I('check','xs')).replace('{wand}', I('wand','xs'));
  const card = $('.dtx-card', r), rows = $('.dtx-rows', r), st = $('.dtx-st', r), go = $('.dtx-go', r);
  const P = [
    { k:'rad', n:'Radius', min:0, max:28, v:16, u:'px', t:20 },
    { k:'pad', n:'Padding', min:8, max:32, v:18, u:'px', t:24 },
    { k:'gap', n:'Spacing', min:4, max:24, v:12, u:'px', t:14 },
    { k:'sh', n:'Shadow', min:0, max:.2, v:.08, u:'', t:.05, f:2 }
  ];
  rows.innerHTML = P.map(p => `<div class="dtx-r" data-k="${p.k}"><span>${p.n}</span><div class="dtx-sl" role="slider" tabindex="0" aria-label="${p.n}" aria-valuemin="${p.min}" aria-valuemax="${p.max}"><span class="f"></span><span class="k"></span></div><span class="v num"></span></div>`).join('');
  function set(p, v){ p.v = Math.max(p.min, Math.min(p.max, v)); const pc = (p.v - p.min) / (p.max - p.min) * 100; const row = $(`[data-k="${p.k}"]`, rows);
    $('.f', row).style.width = pc + '%'; $('.k', row).style.left = pc + '%'; $('.v', row).textContent = p.f ? p.v.toFixed(p.f) : Math.round(p.v) + p.u;
    card.style.setProperty('--dm-' + p.k, p.f ? p.v : Math.round(p.v) + 'px'); $('.dtx-sl', row).setAttribute('aria-valuenow', p.f ? p.v.toFixed(p.f) : Math.round(p.v)); }
  P.forEach(p => {
    set(p, p.v); const sl = $(`[data-k="${p.k}"] .dtx-sl`, rows);
    const at = e => { const b = sl.getBoundingClientRect(); set(p, p.min + (p.max - p.min) * Math.max(0, Math.min(1, (e.clientX - b.left) / b.width))); };
    sl.onpointerdown = e => { sl.setPointerCapture(e.pointerId); sl.classList.add('drag'); at(e); swap(st, 'Edited by you'); sl.onpointermove = at; };
    sl.onpointerup = sl.onpointercancel = () => { sl.classList.remove('drag'); sl.onpointermove = null; };
    sl.onkeydown = e => { const k = { ArrowRight:1, ArrowUp:1, ArrowLeft:-1, ArrowDown:-1 }[e.key]; if (!k) return; e.preventDefault(); set(p, p.v + k * (p.f ? .01 : 1)); swap(st, 'Edited by you'); };
  });
  let note;
  go.onclick = () => c.run(async () => {
    go.classList.add('busy'); go.innerHTML = '<span class="think on"><i></i><i></i><i></i><i></i></span>Tuning'; swap(st, 'Agent is tuning'); if (note) note.remove();
    for (const p of P){ const row = $(`[data-k="${p.k}"]`, rows); row.classList.add('hot'); await tween(p.v, p.t, 650, x => set(p, x)); await c.wait(120); row.classList.remove('hot'); }
    note = html('<div class="dtx-note">Matched the 4px grid and your card tokens. Softer shadow so the CTA leads.</div>'); go.before(note); enter(note);
    go.classList.remove('busy'); go.innerHTML = I('wand','xs') + 'Tune again'; swap(st, 'Tuned by agent');
    P.forEach(p => { const o = p.t; p.t = p.k === 'rad' ? (o === 20 ? 12 : 20) : p.k === 'pad' ? (o === 24 ? 20 : 24) : p.k === 'gap' ? (o === 14 ? 10 : 14) : (o === .05 ? .1 : .05); });
  });
  // the preview lets the agent tune once on its own, unless you reach for a slider or the button first
  c.auto(1600, () => go.click());
});
