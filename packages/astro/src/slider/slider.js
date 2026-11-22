// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, swap } from '../core/core.js';
DM.def('slider', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{spark}', I('spark','xs'));
  const q = s => $(`.sdx-tr[data-s="${s}"]`, r);
  /* one track: its knobs, the range they run over and how values read. Pointer: press anywhere on the track and the nearest
     knob comes to it and follows. Keys on a knob: arrows one step, Shift with an arrow or Page Up/Down ten, Home and End the
     ends. Two knobs never cross */
  function track(tr, o){
    const ks = $$('.sdx-k', tr), fill = $('.sdx-fill', tr), v = o.vals.slice();
    const pct = x => (x - o.min) / (o.max - o.min) * 100, snap = x => Math.round((x - o.min) / o.step) * o.step + o.min, fix = x => +x.toFixed(4);
    const clamp = (i, x) => { let lo = o.min, hi = o.max; if (ks.length > 1){ if (i === 0) hi = v[1] - o.step; else lo = v[0] + o.step; } return Math.max(lo, Math.min(hi, x)); };
    const paint = () => {
      ks.forEach((k, i) => { k.style.left = pct(v[i]) + '%'; $('.sdx-tt', k).textContent = o.fmt(v[i]); k.setAttribute('aria-valuemin', ks.length > 1 && i ? fix(v[0] + o.step) : o.min); k.setAttribute('aria-valuemax', ks.length > 1 && !i ? fix(v[1] - o.step) : o.max); k.setAttribute('aria-valuenow', fix(v[i])); k.setAttribute('aria-valuetext', o.text(v[i], i)); });
      fill.style.left = ks.length > 1 ? pct(v[0]) + '%' : '0'; fill.style.width = (ks.length > 1 ? pct(v[1]) - pct(v[0]) : pct(v[0])) + '%';
      o.change && o.change(v);
    };
    // a little hop when a knob snaps onto the agent's mark
    const hop = i => { if (REDUCE) return; $('.sdx-kb', ks[i]).animate([{ transform:'scale(1.2)' }, { transform:'scale(1.38)', offset:.35 }, { transform:'scale(1.2)' }], { duration:320, easing:'cubic-bezier(.34,1.56,.64,1)' }); };
    const set = (i, x, near) => { x = clamp(i, snap(x)); let hit = false; if (near != null && o.rec != null && Math.abs(x - o.rec) <= near){ hit = true; x = o.rec; } if (fix(x) === fix(v[i])) return; v[i] = fix(x); paint(); if (hit && tr.classList.contains('drag')) hop(i); };
    // a value set from outside (a stop, the recommended mark, a tick) glides there: the knob and the fill ease across while
    // the value lands at once
    let gt = 0;
    const glide = (i, x) => { say(i); tr.classList.add('glide'); clearTimeout(gt); gt = setTimeout(() => tr.classList.remove('glide'), 500); set(i, x); };
    let sayT = 0; const say = i => { ks.forEach((k, j) => k.classList.toggle('on', j === i)); ks[i].classList.add('say'); clearTimeout(sayT); sayT = setTimeout(() => ks[i].classList.remove('say'), 1200); };
    let act = 0;
    const at = e => { const b = tr.getBoundingClientRect(); return o.min + (o.max - o.min) * Math.max(0, Math.min(1, (e.clientX - b.left) / b.width)); };
    tr.addEventListener('pointerdown', e => {
      if (e.target.closest('.sdx-rec') || e.button) return;
      const x = at(e); act = ks.length > 1 ? (Math.abs(x - v[0]) <= Math.abs(x - v[1]) ? (x < v[0] ? 0 : Math.abs(x - v[0]) < Math.abs(x - v[1]) ? 0 : 1) : 1) : 0;
      tr.classList.remove('glide'); tr.setPointerCapture(e.pointerId); tr.classList.add('drag'); ks.forEach((k, j) => k.classList.toggle('on', j === act));
      ks.forEach(k => k.classList.add('ptr'));
      e.preventDefault(); ks[act].focus({ preventScroll:true, focusVisible:false }); set(act, x, (o.max - o.min) * .05);
      // it leans into the way it moves, as far as 16 degrees, and rights itself once the pointer rests
      let lx = e.clientX, lt = e.timeStamp, rest = 0; const kb = $('.sdx-kb', ks[act]);
      tr.onpointermove = ev => { set(act, at(ev), (o.max - o.min) * .05);
        if (REDUCE) return; const dt = Math.max(8, ev.timeStamp - lt), vx = (ev.clientX - lx) / dt; lx = ev.clientX; lt = ev.timeStamp;
        kb.style.setProperty('--dm-tilt', Math.max(-16, Math.min(16, vx * 14)).toFixed(1) + 'deg'); clearTimeout(rest); rest = setTimeout(() => kb.style.setProperty('--dm-tilt', '0deg'), 90); };
      tr.onpointerup = tr.onpointercancel = () => { tr.classList.remove('drag'); tr.onpointermove = null; clearTimeout(rest); kb.style.setProperty('--dm-tilt', '0deg');
        // let go, it drops back with a bounce
        if (!REDUCE) kb.animate([{ transform:'scale(1.2)' }, { transform:'scale(.9)', offset:.4 }, { transform:'scale(1.05)', offset:.7 }, { transform:'scale(1)' }], { duration:480, easing:'ease-out' }); };
    });
    ks.forEach((k, i) => k.addEventListener('keydown', e => {
      k.classList.remove('ptr');
      const big = o.step * (o.big || 10), d = { ArrowRight:o.step, ArrowUp:o.step, ArrowLeft:-o.step, ArrowDown:-o.step, PageUp:big, PageDown:-big }[e.key];
      if (d != null){ e.preventDefault(); set(i, v[i] + (e.shiftKey && /Arrow/.test(e.key) ? Math.sign(d) * big : d)); say(i); }
      else if (e.key === 'Home' || e.key === 'End'){ e.preventDefault(); set(i, e.key === 'Home' ? -Infinity : Infinity); say(i); }
    }));
    paint();
    return { glide, get:() => v.slice(), knobs:ks };
  }

  /* Creativity: a temperature from 0 to 1, read as five named stops, with a sample line that rewrites itself in the tone */
  const NAMES = ['Precise', 'Focused', 'Balanced', 'Playful', 'Creative'];
  const SAMPLE = [
    'The export failed because the token expired. Renew it in Settings.',
    'The export failed: your access token expired. Renew it in Settings, then run it again.',
    "Your export didn't finish because its access token had expired. Renew it in Settings and try again.",
    'Your export tripped over an expired token. A quick renewal in Settings will get it moving.',
    'The export ran out of road when its token expired mid-trip. Renew it in Settings and send it on its way.'
  ];
  const band = x => Math.min(4, Math.round(x * 4)), sm = $('.sdx-sm span', r), stops = $$('.sdx-stops button', r), REC = .4;
  let shown = -1;
  const cr = track(q('cr'), { min:0, max:1, step:.05, big:4, vals:[.5], rec:REC, fmt:x => x.toFixed(2), text:x => `${x.toFixed(2)}, ${NAMES[band(x)]}${Math.abs(x - REC) < .001 ? ', recommended' : ''}`,
    change:([x]) => { $('.sdx-v', q('cr').parentElement).textContent = `${NAMES[band(x)]}, ${x.toFixed(2)}`; stops.forEach(b => b.setAttribute('aria-pressed', Math.abs(+b.dataset.v - x) < .001));
      const b = band(x); if (b !== shown){ shown = b; swap(sm, SAMPLE[b]); } } });
  const rec = $('.sdx-rec', r); rec.style.left = REC * 100 + '%';
  $('.sdx-rail', q('cr')).insertAdjacentHTML('beforeend', `<i class="sdx-notch" style="left:calc(10px + (100% - 20px) * ${REC})"></i>`);
  rec.onclick = () => cr.glide(0, REC);
  stops.forEach(b => b.onclick = () => cr.glide(0, +b.dataset.v));

  /* Tool calls per run: steps of 10, with a tick and a number at each step you can press */
  const T = [10, 20, 30, 40, 50], ticks = $('.sdx-ticks', r);
  ticks.innerHTML = T.map(t => `<button data-v="${t}" style="left:${(t - 10) / 40 * 100}%" aria-label="${t} tool calls"><i></i>${t}</button>`).join('');
  const mx = track(q('mx'), { min:10, max:50, step:10, big:2, vals:[30], fmt:x => x + ' calls', text:x => x + ' tool calls',
    change:([x]) => { $('.sdx-v', q('mx').parentElement).textContent = x + ' calls'; $$('button', ticks).forEach(b => b.setAttribute('aria-pressed', +b.dataset.v === x)); } });
  $$('button', ticks).forEach(b => b.onclick = () => mx.glide(0, +b.dataset.v));

  /* Cost per run: a range in dollars; its two knobs stay a step apart */
  const $f = x => '$' + x.toFixed(2);
  const co = track(q('co'), { min:0, max:1, step:.05, big:4, vals:[.1, .6], fmt:$f, text:(x, i) => (i ? 'At most ' : 'At least ') + $f(x),
    change:([a, b]) => { $('.sdx-v', q('co').parentElement).textContent = `${$f(a)} to ${$f(b)}`; } });

  // the preview's story: try the far end, take the agent's recommendation, read fewer tool calls, then narrow the budget
  if (r === c.st) c.story(async s => {
    await s.beat(3);
    await s.tap(stops[2]); await s.beat(4);
    await s.point(rec); await s.beat(3);
    await s.tap(rec); await s.beat(4);
    await s.tap($('button[data-v="20"]', ticks)); await s.beat(3);
    await s.point(co.knobs[1], false); await s.beat(1);
    co.glide(1, .35); await s.beat(3);
    s.away(); await s.beat(2);
  });
});
