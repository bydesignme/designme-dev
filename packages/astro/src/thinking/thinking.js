// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, REDUCE, enter, grow, html, swap, tip } from '../core/core.js';
DM.def('thinking', (r, c) => {
  const tk = $('.tk', r), list = $('.tk-list', r), title = $('.tk-title', r), time = $('.tk-time', r), head = $('.tk-h', r), fold = $('.tk-fold', r), mark = $('.tk-mark', r);
  // each step: what the agent does and what it found. Measuring the cards times out once, counts down and tries again
  const S = [
    ['Open Pricing v4 in Figma', '6 frames', 1300],
    ['Read the spacing tokens', 'tokens.css, 9 spacing values', 1200],
    ['Measure the plan cards', 'Off the 8px grid', 1400, { retry:"Figma didn't answer", tip:'Pro has an 18px gap, Team 22px and Enterprise 13px' }],
    ['Check text contrast', 'All 14 text pairs pass AA', 1100],
    ['Plan the fix', 'About 3 minutes of work', 1200]
  ];
  const setOpen = o => { tk.dataset.open = o ? '1' : '0'; fold.classList.toggle('shut', !o); head.setAttribute('aria-expanded', o); };
  head.onclick = () => setOpen(tk.dataset.open !== '1');
  // the trace grows with its steps in every style (grow(), started once its entrance has settled, so it measures the card
  // at its real size), and its header says what the work came to as the last step finishes, never after it (owner, 18 Nov).
  // Clean draws its finished mark as a tick on a green disc
  const ds = r.closest('[data-style]'), clean = !!ds && ds.dataset.style === 'clean';
  Promise.resolve().then(() => Promise.all(tk.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && tk.isConnected) c.offs.push(grow(tk)); });
  // (the template's chevron names the sprite's icon directly, which the homepage renames, so it is drawn through I())
  $('.tk-chev', r).outerHTML = I('chev-d', 'xs tk-chev');
  // the header becomes what the work came to
  const finish = () => { live = false; head.classList.add('tk-fin'); mark.innerHTML = clean ? I('check','xs') : I('ok'); enter(mark.firstElementChild); title.classList.remove('shim'); swap(title, '3 cards to fix, 2 changes planned'); };
  // the line under a step opens and then crossfades; what the step found writes itself in a word at a time, and a tip on it
  // holds the detail
  const words = t => t.split(' ').map((w, i, a) => `<span class="w" style="animation-delay:${i * 45}ms">${w}${i < a.length - 1 ? ' ' : ''}</span>`).join('');
  // (warn: the step is waiting out a problem; its amber lands with its words, 170ms on as swap() writes them)
  const note = (li, text, tip, found, warn = false) => { const res = $('.res', li), sp = res.firstElementChild; res.classList.add('on');
    clearTimeout(sp._tone); const set = () => sp.classList.toggle('warn', warn);
    if (found){ set(); sp._sw = null; sp.classList.remove('out'); sp.innerHTML = tip ? `<span data-tip="${tip}">${words(text)}</span>` : words(text); }
    else { const lag = !REDUCE && !!sp.textContent.trim() && sp.textContent !== text; swap(sp, text); if (lag) sp._tone = setTimeout(set, 170); else set(); } };
  const glyph = (li, g) => { const mk = $('.mk', li); mk.innerHTML = g; enter(mk.firstElementChild); };
  let secs = 0, live = true; c.every(1000, () => { if (live){ secs++; time.textContent = secs + 's'; } });
  c.run(async () => {
    await c.wait(600);
    for (const [lab, res, ms, x] of S){
      const li = html(`<li class="tk-st run"><span class="mk"><span class="spin"></span></span><div class="tx"><span class="tk-ln"><span class="lab shim">${lab}</span><span class="tk-dur num"></span></span><span class="res"><span></span></span></div></li>`);
      list.appendChild(li); enter(li);
      const l = $('.lab', li); let took = ms;
      await c.wait(ms);
      if (x && x.retry){
        li.classList.replace('run', 'retry'); l.classList.remove('shim'); glyph(li, I('clock','xs'));
        for (let k = 2; k > 0; k--){ note(li, `${x.retry}. Trying again in ${k}s`, null, false, true); await c.wait(1000); }
        li.classList.replace('retry', 'run'); l.classList.add('shim'); glyph(li, '<span class="spin"></span>'); note(li, 'Trying again'); await c.wait(900); took += 2900;
      }
      li.classList.replace('run', 'done'); l.classList.remove('shim'); glyph(li, I('check','xs')); note(li, res, x && x.tip, true);
      const t = $('.tk-dur', li); t.textContent = (took / 1000).toFixed(1) + 's'; enter(t);
    }
    // the header becomes what the work came to as the last step finishes, and folds the trace away
    finish();
    await c.wait(2500); setOpen(false);
  });
  // the preview's story: once it has folded, the person opens it again and reads what the cards measured
  if (r === c.st) c.story(async s => {
    await s.until(() => fold.classList.contains('shut')); await s.beat(2);
    await s.tap(head); await s.beat(2);
    await s.point($('.res [data-tip]', list)); await s.beat(3);
    s.away(); await s.beat(1);
  });
});
