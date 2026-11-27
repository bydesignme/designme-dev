// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I } from '../core/core.js';
DM.def('tool-rail', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)\}/g, (m, k) => I(k));
  const bs = $$('.tlr-b', r), keys = Object.fromEntries(bs.map(b => [b.dataset.tipK.toLowerCase(), b]));
  // one tool at a time, like radio buttons: the picked one is checked and is the one Tab stops on
  const pick = b => bs.forEach(x => { const on = x === b; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
  bs.forEach(b => c.on(b, 'click', () => pick(b)));
  // the arrows move the pick along the rail, and a tool's letter picks it, while the focus is in the rail
  c.on($('.tlr-bar', r), 'keydown', e => {
    const d = { ArrowDown:1, ArrowRight:1, ArrowUp:-1, ArrowLeft:-1 }[e.key];
    const n = d ? bs[(bs.indexOf(document.activeElement) + d + bs.length) % bs.length] : !e.metaKey && !e.ctrlKey && !e.altKey && keys[e.key.toLowerCase()];
    if (!n) return; e.preventDefault(); pick(n); n.focus();
  });
  // the preview's story: try the pen, a sticky note and a comment, then back to Select
  const t = k => $(`.tlr-b[data-t="${k}"]`, r);
  c.story(async s => {
    await s.beat(2);
    await s.point(t('pen')); await s.beat(1.5); await s.tap(t('pen')); await s.beat(2.5);
    await s.point(t('sticky')); await s.beat(1.5); await s.tap(t('sticky')); await s.beat(2.5);
    await s.tap(t('comment')); await s.beat(2.5);
    await s.tap(t('select')); s.away(); await s.beat(2);
  });
});
