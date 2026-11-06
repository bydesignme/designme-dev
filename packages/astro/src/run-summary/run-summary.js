// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, stagger, swap, tween } from '../core/core.js';
DM.def('run-summary', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{ok}', I('check')).replace('{more}', I('more'));
  const root = $('.rsu', r), undo = $('.rsu-undo', r), fix = $('.rsu-fix', r), g = $('.rsu-g', r);
  $$('.rsu-stats b', r).forEach((b, i) => c.later(200 + i * 90, () => tween(0, parseFloat(b.dataset.n), 1100, v => { b.textContent = (b.dataset.p || '') + (b.dataset.n.includes('.') ? v.toFixed(2) : Math.round(v)) + (b.dataset.u || ''); })));
  stagger($$('.rsu-it,.rsu-acts', r), 70, 300);
  undo.onclick = () => {
    const on = root.classList.toggle('undone');
    swap(undo, on ? 'Redo' : 'Undo all'); swap($('.rsu-t', r), on ? 'Changes undone' : 'Run complete');
    g.style.background = on ? 'var(--dm-chip)' : ''; g.style.color = on ? 'var(--dm-fg2)' : ''; g.innerHTML = I(on ? 'undo' : 'check'); enter(g.firstElementChild);
  };
  fix.onclick = () => { fix.innerHTML = '<span class="spin"></span>'; c.later(1000, () => { fix.remove(); swap($('.rsu-nt', r), 'Badge moved above the price, nothing left to review'); }); };
});
