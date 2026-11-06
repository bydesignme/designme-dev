// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, REDUCE, seg, swap } from '../core/core.js';
DM.def('thinking-states', (r, c) => {
  const steps = ['Thinking', 'Reading 3 files', 'Searching the docs', 'Comparing 2 options', 'Drafting the answer'];
  const box = $('.ths', r), mk = $('.ths-mk', r), tx = $('.ths-tx', r), car = $('.ths-car', r), time = $('.ths-t', r), sr = $('.ths-sr', r);
  // Orbit, Morph, Scan and Stream as a grid of dots, each at its own density: which part each dot plays, and when
  const grid = k => {
    const n = { orbit:5, scan:6, morph:7, stream:6 }[k], rows = k === 'stream' ? 3 : n, at = (x, y) => y * n + x;
    const cls = Array(n * rows).fill(''), dly = Array(n * rows).fill(null), pose = new Set();
    const run = (order, dur) => order.forEach((c, i) => { dly[c] = ((i / order.length) - 1) * dur; });
    if (k === 'orbit'){
      const ring = [];
      for (let x = 0; x < n; x++) ring.push(at(x, 0));
      for (let y = 1; y < n; y++) ring.push(at(n - 1, y));
      for (let x = n - 2; x >= 0; x--) ring.push(at(x, n - 1));
      for (let y = n - 2; y > 0; y--) ring.push(at(0, y));
      ring.forEach(c => { cls[c] = 'r'; }); run(ring, 1.6); cls[at(2, 2)] = 'c';
      [0, ring.length - 1, ring.length - 2].forEach(i => pose.add(ring[i]));
    } else if (k === 'scan'){
      const len = [6, 0, 5, 0, 3, 0];
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++){ const c = at(x, y); cls[c] = x < len[y] ? 'l' : 'b'; dly[c] = (x / n - 1) * 1.6; if (x === 2) pose.add(c); }
    } else if (k === 'morph'){
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++){
        const rect = y >= 1 && y <= 5, circ = (x - 3) ** 2 + (y - 3) ** 2 <= 10, tri = Math.abs(x - 3) <= y / 2;
        const c = at(x, y); cls[c] = 'm' + ((rect ? 1 : 0) | (circ ? 2 : 0) | (tri ? 4 : 0)); if (circ) pose.add(c);
        dly[c] = -(((c * 37 + 11) % 17) / 17) * .32;
      }
    } else {
      for (let y = 0; y < rows; y++) for (let x = 0; x < n; x++){ const c = at(x, y); cls[c] = 's' + c; if (y < 2) pose.add(c); }
    }
    return `<span class="ths-dg" data-k="${k}">` + cls.map((x, c) => `<i class="${x}${pose.has(c) ? ' p' : ''}"${dly[c] != null ? ` style="animation-delay:${dly[c].toFixed(3)}s"` : ''}></i>`).join('') + '</span>';
  };
  // the mark each state draws on its tile
  const MARKS = {
    orbit:grid('orbit'),
    morph:grid('morph'),
    scan:grid('scan'),
    stream:grid('stream'),
    matrix:'<span class="ths-mtx">' + '<i></i>'.repeat(16) + '</span>',
    stack:'<span class="ths-stk"><i></i><i></i><i></i></span>'
  };
  let v = box.dataset.v || 'orbit', at = 0, secs = 0, typed = 0;
  // the agent's own pace: these waits are not shortened under reduced motion, so the line still changes every few seconds
  const pause = ms => new Promise(res => c.later(ms, res));
  // Stream types the line out behind its caret; the others crossfade it (Orbit shimmering). A newer line cancels the typing
  const type = async t => {
    const k = ++typed; if (tx._sw){ clearTimeout(tx._sw.t); tx._sw = null; } tx.classList.remove('out'); tx.textContent = '';
    for (let i = 1; i <= t.length; i++){ await pause(32); if (k !== typed) return; tx.textContent = t.slice(0, i); }
  };
  const show = (t, fresh) => {
    tx.classList.toggle('shim', v === 'orbit'); car.hidden = v !== 'stream';
    if (v === 'stream' && fresh && !REDUCE) type(t);
    else { typed++; if (fresh) swap(tx, t); else { if (tx._sw){ clearTimeout(tx._sw.t); tx._sw = null; } tx.classList.remove('out'); tx.textContent = t; } }
    // a screen reader hears each new step once, never the letters as they type
    if (fresh) sr.textContent = t;
  };
  const pick = x => { v = x; box.dataset.v = x; mk.innerHTML = MARKS[x]; show(steps[at], false); };
  seg($('.seg2', r), pick);
  pick(v);
  c.every(1000, () => { secs++; time.textContent = secs + 's'; });
  let first = true;
  c.run(async () => {
    for (;;){
      for (at = 0; at < steps.length; at++){ show(steps[at], !first); first = false; await pause(2600); }
      // a fresh question: the clock starts again
      at = 0; secs = 0; time.textContent = '0s';
    }
  });
});
