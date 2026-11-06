// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, swap } from '../core/core.js';
DM.def('run-cost', (r, c) => {
  // the label crossfades on its own span, so the button itself never blurs
  const go = $('.rc-go', r); go.innerHTML = '<span class="rc-gl">Start run</span>'; const gl = () => $('.rc-gl', go);
  const tg = $('.toggle', r), cap = $('.rc-cap', r), fill = $('.rc-fill', r), st = $('.rc-st', r), stt = $('.rc-stt', r);
  let used = 0, inT = 0, outT = 0, tools = 0, running = false, limit = 1800, loop = 0;
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const paint = () => { $('.rc-n', r).textContent = fmt(used); fill.style.width = (used / 2000 * 100) + '%'; $('.rc-in', r).textContent = fmt(inT); $('.rc-out', r).textContent = fmt(outT); $('.rc-tools', r).textContent = tools; };
  const status = (t, cls) => { st.className = 'rc-st tag ' + (cls || ''); swap(stt, t); };
  const capOn = () => tg.getAttribute('aria-checked') === 'true';
  $('.rc-cap-t', r).onclick = e => { e.preventDefault(); tg.setAttribute('aria-checked', !capOn()); cap.style.opacity = capOn() ? 1 : .2; limit = capOn() ? 1800 : 2000; if (!running && used < limit && used > 0) go.disabled = false; };
  function stop(t, cls){ running = false; clearInterval(loop); status(t, cls); }
  go.onclick = () => {
    if (running){ stop('Stopped'); swap(gl(), 'Resume'); return; }
    if (used >= 2000){ used = inT = outT = tools = 0; paint(); }
    running = true; status('Running', 'b'); swap(gl(), 'Stop'); go.className = 'pill soft sm rc-go'; fill.style.background = 'var(--dm-accent-mark,var(--dm-accent))';
    loop = c.every(90, () => {
      used = Math.min(2000, used + 8 + Math.random() * 18); inT += 120 + Math.random() * 220; outT += 30 + Math.random() * 70; if (Math.random() < .12) tools++;
      paint();
      if (used >= limit){
        used = limit; paint();
        if (limit < 2000){ stop('Paused at 90%', 'warn'); fill.style.background = 'var(--dm-warn-mark)'; swap(gl(), 'Raise cap'); go.className = 'pill primary sm rc-go'; go.onclick2 = true; }
        else { stop('Budget used', 'bad'); swap(gl(), 'Start over'); go.className = 'pill primary sm rc-go'; }
      }
    });
  };
  const orig = go.onclick;
  go.addEventListener('click', e => { if (go.onclick2 && !running){ go.onclick2 = false; e.stopImmediatePropagation(); tg.setAttribute('aria-checked','false'); cap.style.opacity = .2; limit = 2000; orig(); } }, true);
  paint();
  // the run starts by itself once the card has settled, so the spend can be seen climbing to the cap
  c.auto(1500, () => { if (!running && !used) go.click(); });
});
