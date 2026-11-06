// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, REDUCE, seg } from '../core/core.js';
DM.def('status-pill', (r, c) => {
  const pill = $('.spl-pill', r), box = $('.spl-in', r), root = $('.spl', r);
  pill.insertAdjacentHTML('beforeend', '<div class="spl-track"><div class="spl-fill"></div></div>');
  const fill = $('.spl-fill', r);
  // the switch morphs in three beats, so the words and the shape never move at once: the line fades out with its track,
  // the pill changes shape while it's empty, then the new layout fades in with the track under it
  let morph = 0;
  seg($('.seg2', r), v => {
    const bar = v === 'bar', id = ++morph; if (root.classList.contains('bar') === bar) return;
    pill.style.width = pill.offsetWidth + 'px'; box.classList.add('out'); root.classList.add('mo');
    c.later(REDUCE ? 0 : 170, () => { if (id !== morph) return; root.classList.toggle('bar', bar); fit(); });
    c.later(REDUCE ? 0 : 430, () => { if (id !== morph) return; morph = 0; box.classList.remove('out'); root.classList.remove('mo'); });
  });
  /* both variants hug their content; the bar keeps a little extra room for its track */
  function fit(){
    box.style.width = 'max-content'; const w = box.scrollWidth; box.style.width = '';
    pill.style.width = (root.classList.contains('bar') ? Math.max(w + 24, 300) : w) + 'px';
  }
  function set(htmlStr, pct){
    pill.style.width = pill.offsetWidth + 'px';
    box.classList.add('out');
    // mid-switch, the morph brings the line back once the shape has settled
    c.later(180, () => { box.innerHTML = htmlStr; if (!morph) box.classList.remove('out'); fit(); });
    if (pct !== undefined) fill.style.width = pct + '%';
  }
  const think = '<span class="think on"><i></i><i></i><i></i><i></i></span>';
  box.innerHTML = '<span class="g"><span class="dot" style="color:var(--dm-faint)"></span></span><span class="fg2">Ready for a task</span><span class="end"></span>';
  requestAnimationFrame(fit);
  const idle = '<span class="g"><span class="dot" style="color:var(--dm-faint)"></span></span><span class="fg2">Ready for a task</span><span class="end"></span>';
  c.run(async () => { for (;;){
    await c.wait(1100);
    set(`<span class="g" style="color:var(--dm-fg)">${think}</span><span class="shim">Thinking</span><span class="end"></span>`, 8); await c.wait(1800);
    set(`<span class="g" style="color:var(--dm-fg)"><span class="radar"></span></span><span class="shim">Reading Figma frames</span><span class="m n">1 of 4</span><span class="end"></span>`, 22);
    await c.wait(400);
    // the count ticks over in place, under a steady line
    for (let i = 2; i <= 4; i++){ await c.wait(650); const n = $('.n', box); if (n) n.textContent = i + ' of 4'; fill.style.width = (22 + i * 8) + '%'; }
    await c.wait(700);
    set(`<span class="g" style="color:var(--dm-fg)"><span class="spin"></span></span><span class="shim">Editing</span><span class="fchip" style="height:24px"><span class="ft re">TSX</span>PricingCard.tsx</span><span class="end"></span>`, 64); await c.wait(2000);
    set(`<span class="g" style="color:var(--dm-warn-mark)"><span class="dot"></span></span><span>Waiting for your approval</span><button class="pill primary sm">Review</button>`, 72);
    /* waits for Review, and carries on by itself after a while so the loop never stalls; once you have taken over, it waits for you */
    await new Promise(res => { c.later(220, () => { const b = $('.pill', box); if (b) b.onclick = res; }); c.auto(8000, res); });
    set(`<span class="g" style="color:var(--dm-fg)"><span class="spin"></span></span><span class="shim">Applying 4 changes</span><span class="end"></span>`, 88); await c.wait(1600);
    set(`<span class="g" style="color:var(--dm-ok)">${I('ok')}</span><span>Done</span><span class="m">4 files changed · 18s</span><span class="end"></span>`, 100);
    await c.wait(3200); set(idle, 0);
  } });
});
