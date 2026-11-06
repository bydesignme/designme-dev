// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, swap } from '../core/core.js';
DM.def('number-field', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{minus\}/g, I('minus','xs')).replace(/\{plus\}/g, I('plus','xs'));
  // each field: its range and step, how its value reads, and the words for its unit
  const F = {
    steps:{ min:5, max:100, step:5, v:25, dp:0, say:x => `${x} steps` },
    budget:{ min:.25, max:20, step:.25, v:2.5, dp:2, say:x => `$${x.toFixed(2)}` },
    time:{ min:1, max:60, step:1, v:10, dp:0, say:x => `${x} minutes` }
  };
  const sum = $('.nmf-sum', r);
  const fix = x => +x.toFixed(4);
  const line = () => `A run stops at ${F.steps.v} steps, $${F.budget.v.toFixed(2)} or ${F.time.v} min, whichever comes first.`;
  sum.textContent = line();
  $$('.nmf-f', r).forEach(f => {
    const o = F[f.dataset.k], inp = $('input', f), dn = $('.nmf-dn', f), up = $('.nmf-up', f), hint = $('.nmf-hint', f), box = $('.nmf-in', f);
    const base = `${o.dp ? o.min.toFixed(o.dp) : o.min} to ${o.dp ? o.max.toFixed(o.dp) : o.max}${o.step !== 1 ? `, in steps of ${o.dp ? o.step.toFixed(o.dp) : o.step}` : ''}`;
    let note = '';
    const tell = t => { if (t === note) return; note = t; swap(hint, t || base); f.classList.toggle('noted', !!t); };
    hint.textContent = base;
    const paint = () => {
      inp.value = o.v.toFixed(o.dp); inp.setAttribute('aria-valuenow', o.v); inp.setAttribute('aria-valuetext', o.say(o.v));
      dn.disabled = o.v <= o.min; up.disabled = o.v >= o.max; sum.textContent = line();
    };
    inp.setAttribute('aria-valuemin', o.min); inp.setAttribute('aria-valuemax', o.max);
    // a change from the buttons or the keys: one step, or ten with Shift or Page Up/Down; it stops at the ends and says so
    const set = (x, why) => {
      const was = o.v; o.v = fix(Math.min(o.max, Math.max(o.min, x)));
      if (o.v !== was){ box.classList.remove('bump'); void box.offsetWidth; box.classList.add('bump'); }
      tell(why || (x > o.max ? `${o.say(o.max)} is the most` : x < o.min ? `${o.say(o.min)} is the least` : ''));
      paint();
    };
    const stepBy = n => set(o.v + n * o.step);
    // what was typed is kept when you press Enter or leave the field: rounded to the step and kept inside the range, with a
    // word about what changed; something that isn't a number puts the last value back
    const commit = () => {
      const raw = inp.value.replace(/[^0-9.]/g, ''), x = parseFloat(raw);
      if (!raw || isNaN(x)){ inp.removeAttribute('aria-invalid'); tell(`Enter a number from ${base.split(',')[0]}`); paint(); return; }
      const snapped = fix(Math.round((x - o.min) / o.step) * o.step + o.min);
      if (x > o.max) set(x);
      else if (x < o.min) set(x);
      else set(snapped, Math.abs(snapped - x) > 1e-9 ? `Rounded to ${o.say(snapped)}` : '');
    };
    inp.addEventListener('input', () => { const ok = /^\$?\d*\.?\d*$/.test(inp.value.trim()); inp.toggleAttribute('aria-invalid', !ok); });
    inp.addEventListener('keydown', e => {
      const big = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown'){ e.preventDefault(); stepBy((e.key === 'ArrowUp' ? 1 : -1) * big); }
      else if (e.key === 'PageUp' || e.key === 'PageDown'){ e.preventDefault(); stepBy(e.key === 'PageUp' ? 10 : -10); }
      else if (e.key === 'Enter'){ e.preventDefault(); commit(); if (document.activeElement === inp) inp.select(); }
      else if (e.key === 'Escape'){ inp.removeAttribute('aria-invalid'); paint(); }
    });
    inp.addEventListener('blur', commit);
    // the label, and a press beside the value, put the cursor in the field
    $('.nmf-l', f).onclick = () => inp.focus();
    $('.nmf-v', f).onclick = e => { if (e.target !== inp) inp.focus(); };
    // press and hold − or +: one step at once, then more and more quickly until you let go
    [[dn, -1], [up, 1]].forEach(([b, d]) => {
      let t = 0;
      const stop = () => { clearTimeout(t); t = 0; };
      const rep = ms => { t = setTimeout(() => { if (b.disabled) return stop(); stepBy(d); rep(Math.max(40, ms * .8)); }, ms); c.t.push(t); };
      b.addEventListener('pointerdown', e => { if (e.button) return; e.preventDefault(); stepBy(d); stop(); rep(420); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, stop));
      // the keyboard and the demo press it with a click, which has no pointer down before it
      b.addEventListener('click', e => { if (e.detail === 0) stepBy(d); });
    });
    paint();
  });
  // the preview's story: two more steps, a budget typed past the most it allows, then a minute less of time
  if (r === c.st) c.story(async s => {
    const up = $('.nmf-f[data-k="steps"] .nmf-up', r), bi = $('.nmf-f[data-k="budget"] input', r), td = $('.nmf-f[data-k="time"] .nmf-dn', r);
    await s.beat(3);
    await s.tap(up); await s.beat(1);
    await s.tap(up); await s.beat(3);
    await s.point(bi, false); bi.value = ''; await s.type(bi, '25', { n:.3 }); await s.beat(1);
    bi.dispatchEvent(new KeyboardEvent('keydown', { key:'Enter' })); s.away(); await s.beat(4);
    await s.tap(td); s.away(); await s.beat(4);
  });
});
