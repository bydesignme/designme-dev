// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE } from '../core/core.js';
DM.def('action-cards', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)\}/g, (m, k) => I(k, 'xs'));
  // each picture's pace: how long an item stays, how long the list takes to move on, and how late it starts
  const PACE = { commit:{ step:3600, mv:700, at:0 }, dates:{ step:3000, mv:600, at:700 }, follow:{ step:4200, mv:800, at:1400 } };
  const loop = async card => {
    const P = PACE[card.dataset.ax] || PACE.commit, vis = $('.axc-v', card), k = $('.axc-k', card), cur = $('.axc-cur', vis);
    // the track: the last item first (the slip above), the list, then its first two again so the loop can wrap unseen
    const own = $$('.axc-w', k), n = own.length;
    k.prepend(own[n - 1].cloneNode(true)); k.append(own[0].cloneNode(true), own[1 % n].cloneNode(true));
    const W = $$('.axc-w', k); let i = 1;
    k.style.setProperty('--dm-ax-mv', P.mv + 'ms');
    const place = (idx, anim) => { k.classList.toggle('mv', anim); const it = W[idx]; k.style.transform = `translateY(${Math.round((vis.clientHeight - it.offsetHeight) / 2 - it.offsetTop)}px)`;
      W.forEach((x, m) => x.classList.toggle('on', m === idx)); };
    requestAnimationFrame(() => place(i, false));
    // and again, at once, when its room changes (the row stacking on a narrow stage)
    if (window.ResizeObserver){ const ro = new ResizeObserver(() => place(i, false)); ro.observe(vis); c.offs.push(() => ro.disconnect()); }
    if (REDUCE) return;
    const at = el => { const v = vis.getBoundingClientRect(), b = el.getBoundingClientRect(); return [b.left - v.left + b.width * .55, b.top - v.top + b.height * .5]; };
    await c.wait(P.at + 900);
    for (;;){
      const go = $('[data-go]', W[i]);
      if (go){
        const [x, y] = at(go);
        cur.classList.remove('press'); cur.style.transition = 'none'; cur.style.transform = `translate(${x + 34}px,${y + 26}px)`; void cur.offsetWidth; cur.style.transition = '';
        cur.style.opacity = 1; cur.style.transform = `translate(${x}px,${y}px)`;
        await c.wait(700);
        cur.classList.add('press'); cur.style.transform = `translate(${x}px,${y}px) scale(.8)`;
        await c.wait(140);
        cur.style.transform = `translate(${x}px,${y}px)`; go.classList.add(go.classList.contains('axc-m') ? 'in' : 'ok');
        await c.wait(520);
        cur.classList.remove('press'); cur.style.opacity = 0; cur.style.transform = `translate(${x + 18}px,${y + 14}px)`;
      }
      await c.wait(Math.max(300, P.step - 1700));
      // scroll up to the next item; past the end, jump back unseen to the same item at the start, all fresh again
      i++; place(i, true);
      await c.wait(P.mv + 60);
      if (i === n + 1){ i = 1; W.forEach(x => $$('[data-go]', x).forEach(g => g.classList.remove('in', 'ok'))); place(i, false); }
    }
  };
  c.run(() => Promise.all($$('.axc-c', r).map(loop)));
});
