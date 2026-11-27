// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I } from '../core/core.js';
DM.def('zoom-bar', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)\}/g, (m, k) => I(k));
  const zo = $('.zmb-zo', r), zi = $('.zmb-zi', r), zl = $('.zmb-zl', r), live = $('.zmb-live', r);
  // the levels minus and plus step through, as the Whiteboard's
  const STEPS = [.25, .33, .5, .67, .75, .9, 1, 1.25, 1.5, 2, 3, 4];
  let z = 1;
  const paint = say => { const p = Math.round(z * 100) + '%';
    zl.textContent = p; zl.setAttribute('aria-label', `Zoom ${p}, zoom to 100%`);
    zo.setAttribute('aria-disabled', String(z <= STEPS[0])); zi.setAttribute('aria-disabled', String(z >= STEPS[STEPS.length - 1]));
    if (say) live.textContent = 'Zoom ' + p; };
  const step = d => { const n = d > 0 ? STEPS.find(x => x > z + .001) : [...STEPS].reverse().find(x => x < z - .001); if (n){ z = n; paint(true); } };
  c.on(zo, 'click', () => step(-1)); c.on(zi, 'click', () => step(1)); c.on(zl, 'click', () => { z = 1; paint(true); });
  // minus, plus and Shift 0 step and reset the level while the focus is in the bar
  c.on($('.zmb-bar', r), 'keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const a = e.key === '-' || e.key === '−' ? () => step(-1) : e.key === '+' || e.key === '=' ? () => step(1) : e.shiftKey && (e.key === ')' || e.code === 'Digit0') ? () => { z = 1; paint(true); } : null;
    if (a){ e.preventDefault(); a(); }
  });
  paint();
  // the preview's story: zoom in twice, out once, undo, fit, and back to 100%
  c.story(async s => {
    await s.beat(2);
    await s.tap(zi); await s.beat(1.5); await s.tap(zi); await s.beat(2);
    await s.tap(zo); await s.beat(2);
    await s.point($('.zmb-undo', r)); await s.beat(1); await s.tap($('.zmb-undo', r)); await s.beat(2);
    await s.tap($('.zmb-fit', r)); await s.beat(2);
    await s.tap(zl); s.away(); await s.beat(2);
  });
});
