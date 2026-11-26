// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, html, popRoom, swap, tip, tween } from '../core/core.js';
DM.def('context-meter', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs'));
  const LIMIT = 200;
  // what fills the context, in thousands of tokens; each part lists what's in it on hover. The parts take the chart palette's
  // accent, violet and teal; the instructions, the quiet part, a neutral grey that keeps 3:1 (green would be Blueprint's
  // accent again, and orange the warning)
  const P = [
    { k:'files', l:'Files', v:56.2, c:'var(--dm-c1)', tip:'Pricing.fig export 31.9k, PricingCard.tsx 18.2k, tokens.css 6.1k' },
    { k:'tools', l:'Tool output', v:41.8, c:'var(--dm-c2)', tip:'Contrast check 17.4k, Figma frames 15.6k, grid audit 8.8k' },
    { k:'chat', l:'Chat', v:32.1, c:'var(--dm-c6)', tip:'48 turns with Maya Kim since 09:12' },
    { k:'sys', l:'Instructions', v:6.3, c:'var(--dm-muted)', tip:'Studio guidelines 4.1k, pricing brief 2.2k' }
  ];
  const root = $('.ctm', r), tg = $('.ctm-tg', r), pop = $('.ctm-pop', r), arc = $('.ctm-ring .fl', r), pc = $('.ctm-pc', r), tot = $('.ctm-tot', r);
  const bar = $('.ctm-bar', r), leg = $('.ctm-leg', r), msg = $('.ctm-msg', r), go = $('.ctm-go', r), hint = $('.ctm-hint', r);
  bar.innerHTML = P.map(p => `<i data-k="${p.k}" style="--dm-c:${p.c}"></i>`).join('');
  leg.innerHTML = P.map(p => `<div class="ctm-l" data-k="${p.k}" style="--dm-c:${p.c}" data-tip="${p.tip}"><span class="sw"></span>${p.l}<span class="v num">0k</span></div>`).join('');
  const fmt = v => v.toFixed(1) + 'k', sum = () => P.reduce((t, p) => t + p.v, 0);
  // the numbers count to their new values; the bar, the ring and the percentage follow
  const shown = {}; let total = 0;
  function paint(ms = 900){
    const all = sum(), pct = Math.round(all / LIMIT * 100);
    P.forEach(p => { $(`i[data-k="${p.k}"]`, bar).style.width = (p.v / LIMIT * 100) + '%'; const el = $(`.ctm-l[data-k="${p.k}"] .v`, leg), from = shown[p.k] || 0; shown[p.k] = p.v; tween(from, p.v, ms, x => el.textContent = fmt(x)); });
    const from = total; total = all; tween(from, all, ms, x => { tot.textContent = fmt(x); pc.textContent = Math.round(x / LIMIT * 100) + '%'; });
    arc.style.strokeDasharray = pct + ' 100'; root.classList.toggle('hot', pct >= 85); tg.setAttribute('aria-label', `Context, ${pct}% used`);
  }
  // a warning is a warning notice with the filled sign, and Compact, the action that resolves it, takes the warning tint
  const WARN = '<svg class="ctm-wi" viewBox="0 0 24 24" aria-hidden="true"><path class="a" d="M12 3.6 2.6 19.9h18.8z"/><path class="b" d="M12 9.6v4.4M12 17v.01"/></svg>';
  const say = (text, tone) => { msg.className = 'ctm-msg on ' + tone; swap(msg.firstElementChild, `${tone === 'warn' ? WARN : I('ok','xs')}<span>${text}</span>`, true); go.classList.toggle('warn', tone === 'warn'); go.classList.toggle('line', tone !== 'warn'); };
  const hush = () => { msg.className = 'ctm-msg'; go.classList.remove('warn'); go.classList.add('line'); };
  // hovering a part lights its share of the bar
  c.on(leg, 'pointerover', e => { const l = e.target.closest('.ctm-l'); if (!l) return; bar.classList.add('hl'); $$('i', bar).forEach(i => i.classList.toggle('on', i.dataset.k === l.dataset.k)); });
  c.on(leg, 'pointerout', e => { if (!leg.contains(e.relatedTarget)) bar.classList.remove('hl'); });
  // the pill opens and shuts the panel; Escape shuts it while the pointer or the focus is on the meter
  // it opens above the pill, as it does under a composer. Away from a demo's stage (which keeps room for it) it opens below
  // instead when the window, or a box that clips it, has no room above and more below (as placePop does for menus)
  let full = 0;
  const side = () => {
    if (r.closest('.stage-in')) return 'up';
    full = Math.max(full, root.dataset.open === '1' ? pop.offsetHeight : 0, pop.scrollHeight);
    const room = popRoom(tg), b = tg.getBoundingClientRect(), need = full + 12, above = b.top - room.top, below = room.bottom - b.bottom;
    return above >= need || above >= below ? 'up' : 'down';
  };
  const setOpen = (o, back) => { if (o) root.dataset.pos = side(); root.dataset.open = o ? '1' : '0'; tg.setAttribute('aria-expanded', o); pop.inert = !o; if (back) tg.focus({ preventScroll:true }); };
  tg.onclick = () => setOpen(root.dataset.open !== '1');
  c.on(document, 'keydown', e => { if (e.key === 'Escape' && root.dataset.open === '1' && (root.contains(document.activeElement) || root.matches(':hover'))) setOpen(false, root.contains(document.activeElement)); });
  // new tool output lands and takes the context close to its limit
  function arrive(){ P[1].v = +(P[1].v + 38.5).toFixed(1); paint(700); say(`${Math.round(sum() / LIMIT * 100)}% full. Older turns start to drop at 200k`, 'warn'); }
  // Compact turns older turns into a summary and trims old tool output; Undo puts them back
  const before = {}; let state = 'full';
  const run = html('<span class="ctm-run" role="status" hidden><span class="spin"></span><span class="shim">Compacting…</span></span>'); go.after(run);
  // the button is as wide as its words and eases to its new width when they change (owner, 18 Nov)
  const label = h => { const w0 = go.getBoundingClientRect().width; go.innerHTML = h; const w1 = go.getBoundingClientRect().width;
    if (!REDUCE && w0 && Math.abs(w1 - w0) > .5) go.animate([{ width:w0 + 'px' }, { width:w1 + 'px' }], { duration:340, easing:'cubic-bezier(.23,1,.32,1)' }); };
  go.onclick = () => c.run(async () => {
    if (go._busy) return; go._busy = true;
    if (state === 'full'){
      P.forEach(p => before[p.k] = p.v); const was = sum();
      const had = document.activeElement === go; go.hidden = true; run.hidden = false;
      swap(hint, '<span class="shim">Summarising 48 turns</span>', true); await c.wait(1000);
      P[2].v = 4.6; P[1].v = +(P[1].v - 13.7).toFixed(1); paint(1100);
      say(`Freed ${fmt(was - sum())} tokens. 9 decisions kept`, 'ok'); swap(hint, 'Older turns are now a summary');
      c.later(REDUCE ? 0 : 170, () => { run.hidden = true; go.innerHTML = 'Undo'; go.hidden = false; enter(go); if (had) go.focus({ preventScroll:true }); }); state = 'compact';
    } else {
      P.forEach(p => p.v = before[p.k]); paint(700); hush(); swap(hint, 'Summarises older turns'); c.later(REDUCE ? 0 : 170, () => label('Compact')); state = 'full';
    }
    go._busy = false;
  });
  // it opens on its real numbers; they only count when something changes
  paint(1); root.dataset.pos = side();
  // the preview's story: read what fills it, new tool output pushes it close to the limit, compact, then shut it
  if (r === c.st) c.story(async s => {
    await s.beat(3);
    await s.point($('.ctm-l[data-k="tools"]', leg)); await s.beat(3);
    await s.point($('.ctm-l[data-k="files"]', leg)); await s.beat(3);
    s.away(); await s.beat(1);
    arrive(); await s.beat(4);
    await s.tap(go); s.away(); await s.until(() => state === 'compact'); await s.beat(4);
    await s.tap(tg); s.away(); await s.beat(2);
  });
});
