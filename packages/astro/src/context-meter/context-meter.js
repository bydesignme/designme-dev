// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, hoverGlide, html, mxWidth, popRoom, seg, swap, tip, tween } from '../core/core.js';
DM.def('context-meter', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs'));
  const LIMIT = 200;
  // what fills the context, in thousands of tokens; each part lists what's in it on hover. The parts take the chart palette's
  // accent, violet and teal; the instructions, the quiet part, a neutral grey that keeps 3:1 (green would be Blueprint's
  // accent again, and orange the warning)
  // (its tip lists what is in it; what arrives joins the list, and compacting leaves a summary in its place)
  const P = [
    { k:'files', l:'Files', v:32, c:'var(--dm-c1)', tip:'Pricing.fig export 19.8k, PricingCard.tsx 8.1k, tokens.css 4.1k', after:[26, 'Pricing.fig export 19.8k, summary of older reads 6.2k'] },
    { k:'tools', l:'Tool output', v:24, c:'var(--dm-c2)', tip:'Contrast check 11.2k, Figma frames 8.6k, grid audit 4.2k', after:[24, 'Contrast check 11.2k, summary of older output 12.8k'] },
    { k:'chat', l:'Chat', v:26, c:'var(--dm-c6)', tip:'Turns with Maya Kim since 09:12', after:[8, 'Summary of 48 turns, 9 decisions kept'] },
    { k:'sys', l:'Instructions', v:6, c:'var(--dm-muted)', tip:'Studio guidelines 3.9k, pricing brief 2.1k', after:[6, 'Studio guidelines 3.9k, pricing brief 2.1k'] }
  ];
  // what the chat adds as it goes on, one step at a time: [part, thousands of tokens, what it is]. The third takes it past 85%
  const STEPS = [[0, 22, 'brand-guide.pdf'], [1, 36, 'web search'], [2, 28, ''], [0, 10, 'checkout.fig']];
  const root = $('.ctm', r), tg = $('.ctm-tg', r), pop = $('.ctm-pop', r), arc = $('.ctm-ring .fl', r), pc = $('.ctm-pc', r), tot = $('.ctm-tot', r);
  const ring = $('.ctm-ring svg', r), warc = $('.ctm-ring .fw', r), shine = $('.ctm-ring .hl', r);
  const bar = $('.ctm-bar', r), leg = $('.ctm-leg', r), msg = $('.ctm-msg', r), go = $('.ctm-go', r), hint = $('.ctm-hint', r);
  bar.innerHTML = P.map(p => `<i data-k="${p.k}" style="--dm-c:${p.c}"></i>`).join('');
  leg.innerHTML = P.map(p => `<div class="ctm-l" data-k="${p.k}" style="--dm-c:${p.c}" data-tip="${p.tip}"><span class="sw"></span>${p.l}<span class="v num">0k</span></div>`).join('');
  const tips = () => P.forEach(p => { $(`.ctm-l[data-k="${p.k}"]`, leg).dataset.tip = p.tip; });
  const fmt = v => v.toFixed(1) + 'k', sum = () => P.reduce((t, p) => t + p.v, 0);
  // the numbers count to their new values; the bar, the ring and the percentage follow
  const shown = {}; let total = 0, hot = false, onHot = null;
  // the ring's moments (owner, 26 Nov, from its showcase): a step up sends a thin bright highlight once along the filled arc and
  // lifts the ring a touch; crossing 85% wipes the warning mark along the arc and nudges the pill; compacting wipes it back
  const easeIO = 'cubic-bezier(.65,0,.35,1)';
  const step = len => { if (REDUCE || !shine.animate) return;
    const seg = Math.min(9, len); shine.style.strokeDasharray = seg + ' 200';
    shine.animate([{ strokeDashoffset:0, opacity:0 }, { opacity:.9, offset:.5 }, { strokeDashoffset:-(len - seg), opacity:0 }], { duration:450, easing:easeIO });
    ring.animate([{ scale:1 }, { scale:1.06, offset:.2 }, { scale:1 }], { duration:350, easing:'cubic-bezier(.23,1,.32,1)' }); };
  const wipe = (on, len) => { (warc._a || { cancel(){} }).cancel(); warc.style.transition = 'none';
    if (on){ warc.style.opacity = '1'; warc.style.strokeDasharray = len + ' 100'; if (!REDUCE) warc._a = warc.animate([{ strokeDasharray:'0 100' }, { strokeDasharray:len + ' 100' }], { duration:200, easing:easeIO });
      if (!REDUCE) tg.animate([{ translate:'0 0' }, { translate:'3px 0', offset:.22 }, { translate:'-1.4px 0', offset:.6 }, { translate:'0 0' }], { duration:380, easing:'ease-out' }); }
    else { const from = parseFloat(warc.style.strokeDasharray) || 0; warc.style.strokeDasharray = '0 100';
      if (REDUCE){ warc.style.opacity = '0'; } else { const a = warc._a = warc.animate([{ strokeDasharray:from + ' 100' }, { strokeDasharray:'0 100' }], { duration:200, easing:easeIO }); a.onfinish = () => { if (!hot) warc.style.opacity = '0'; }; } }
    void warc.offsetWidth; warc.style.transition = ''; };
  function paint(ms = 900){
    const all = sum(), pct = Math.round(all / LIMIT * 100), up = all > total + .05 && total > 0, was = hot;
    P.forEach(p => { $(`i[data-k="${p.k}"]`, bar).style.width = (p.v / LIMIT * 100) + '%'; const el = $(`.ctm-l[data-k="${p.k}"] .v`, leg), from = shown[p.k] || 0; shown[p.k] = p.v; tween(from, p.v, ms, x => el.textContent = fmt(x)); });
    // the ring turns to the warning mark (and back) as the count passes 85%, not before
    const cross = x => { const h = Math.round(x / LIMIT * 100) >= 85; if (h === hot) return; hot = h; root.classList.toggle('hot', h); wipe(h, pct); if (h && onHot) onHot(); };
    const from = total; total = all; tween(from, all, ms, x => { tot.textContent = fmt(x); pc.textContent = Math.round(x / LIMIT * 100) + '%'; cross(x); });
    arc.style.strokeDasharray = pct + ' 100'; tg.setAttribute('aria-label', `Context, ${pct}% used`);
    if (hot && was) warc.style.strokeDasharray = pct + ' 100';
    if (up || from > all + .05) step(pct);
  }
  // a warning is a warning notice with the filled sign, and Compact, the action that resolves it, takes the warning tint
  const WARN = '<svg class="ctm-wi" viewBox="0 0 24 24" aria-hidden="true"><path class="a" d="M12 3.6 2.6 19.9h18.8z"/><path class="b" d="M12 9.6v4.4M12 17v.01"/></svg>';
  // (a warning already showing keeps its notice and only its words change)
  const say = (text, tone) => { const same = msg.classList.contains('on') && msg.classList.contains(tone) && $('span>span', msg);
    const h = `${tone === 'warn' ? WARN : I('ok','xs')}<span>${text}</span>`, shut = !msg.classList.contains('on');
    msg.className = 'ctm-msg on ' + tone; if (same) swap(same, text); else if (shut) msg.firstElementChild.innerHTML = h; else swap(msg.firstElementChild, h, true); go.classList.toggle('warn', tone === 'warn'); go.classList.toggle('line', tone !== 'warn'); };
  const hush = () => { msg.className = 'ctm-msg'; go.classList.remove('warn'); go.classList.add('line'); };
  // hovering a part lights its share of the bar, and one highlight glides from part to part (hoverGlide(), .mx-glide)
  c.offs.push(hoverGlide(leg, '.ctm-l'));
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
  // the chat goes on: each step adds to one part (and to its tip), the ring grows a step and the share counts up; past 85% the
  // warning shows
  let stepAt = 0;
  function arrive(){ const st = STEPS[stepAt++]; if (!st) return; const p = P[st[0]]; p.v = +(p.v + st[1]).toFixed(1); if (st[2]) p.tip += `, ${st[2]} ${fmt(st[1])}`; tips(); paint(600);
    const pct = Math.round(sum() / LIMIT * 100), warn = () => say(`${pct}% full. Older turns start to drop at 200k`, 'warn');
    if (hot) warn(); else if (pct >= 85) onHot = () => { onHot = null; warn(); }; }
  // Compact turns older turns into a summary and trims old tool output; Undo puts them back
  const before = {}; let state = 'full';
  const run = html('<span class="ctm-run" role="status" hidden><span class="spin"></span><span class="shim">Compacting…</span></span>'); go.after(run);
  // the button is as wide as its words and eases to its new width when they change (owner, 18 Nov), on the motion pieces'
  // spring (mxWidth())
  const label = h => { const w0 = go.offsetWidth; go.innerHTML = h; if (!REDUCE && w0) mxWidth(go, w0); };
  go.onclick = () => c.run(async () => {
    if (go._busy) return; go._busy = true;
    if (state === 'full'){
      P.forEach(p => before[p.k] = [p.v, p.tip]); const was = sum();
      const had = document.activeElement === go; go.hidden = true; run.hidden = false;
      swap(hint, '<span class="shim">Summarising 48 turns</span>', true); await c.wait(1000);
      P.forEach(p => { p.v = p.after[0]; p.tip = p.after[1]; }); tips(); paint(1100);
      say(`Freed ${fmt(was - sum())} tokens. 9 decisions kept`, 'ok'); swap(hint, 'Older turns are now a summary');
      c.later(REDUCE ? 0 : 170, () => { run.hidden = true; go.innerHTML = 'Undo'; go.hidden = false; enter(go); if (had) go.focus({ preventScroll:true }); }); state = 'compact';
    } else {
      P.forEach(p => { [p.v, p.tip] = before[p.k]; }); tips(); paint(700); hush(); swap(hint, 'Summarises older turns'); c.later(REDUCE ? 0 : 170, () => label('Compact')); state = 'full';
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
    for (let i = 0; i < STEPS.length; i++){ arrive(); await s.beat(i === 2 ? 4 : 2.4); }
    await s.beat(1);
    await s.tap(go); s.away(); await s.until(() => state === 'compact'); await s.beat(4);
    await s.tap(tg); s.away(); await s.beat(2);
  });
});
