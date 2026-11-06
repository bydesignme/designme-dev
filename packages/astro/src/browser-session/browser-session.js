// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, html, swap } from '../core/core.js';
DM.def('browser-session', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{pause}', I('pause')).replace('{search}', I('search','xs'));
  const root = $('.bws', r), stEl = $('.bws-st', r), vp = $('.bws-vp', r), url = $('.bws-url', r), list = $('.bws-steps', r);
  const pauseB = $('.bws-pause', r), takeB = $('.bws-take', r);
  // the steps the agent planned, and the pages it passes through, drawn small: a search, the site, its pricing page
  const S = [{ t:'Search "northwind pricing"' }, { t:'Open northwind.app' }, { t:'Click "Pricing"' }, { t:'Read the plans table' }, { t:'Extract prices' }];
  const NAV = on => `<div class="bws-nav"><b>Northwind</b><span>Product</span><span data-k="pricing"${on ? ' class="on"' : ''}>Pricing</span><span>Docs</span></div>`;
  const PAGES = {
    search:`<div class="bws-pg"><div class="bws-q">${I('search','xs')}<span>northwind pricing</span></div>
      <div class="bws-res"><b data-k="site">Northwind · Docs your team reads</b><span>northwind.app</span></div>
      <div class="bws-res"><b>Northwind review: is it worth it?</b><span>softwarenotes.io</span></div>
      <div class="bws-res"><b>Northwind alternatives</b><span>stackcompare.com</span></div></div>`,
    home:`<div class="bws-pg">${NAV(false)}<div class="bws-hd">Docs your team actually reads</div><span class="bws-ln" style="width:92%"></span><span class="bws-ln" style="width:68%"></span><span class="bws-cta">Start free</span></div>`,
    pricing:`<div class="bws-pg">${NAV(true)}<div class="bws-hd">Plans and pricing</div><span class="bws-ln" style="width:78%"></span>
      <div class="bws-tb"><div><span>Plan</span><span>Per seat, monthly</span></div><div><span>Starter</span><span class="num">$8</span></div><div><span>Team</span><span class="num">$16</span></div><div><span>Business</span><span class="num">$32</span></div></div><span class="bws-ln" style="width:64%"></span><span class="bws-ln" style="width:40%"></span></div>`
  };
  const G = { queued:'<span class="dot"></span>', run:'<span class="spin"></span>', wait:I('alert','xs'), done:I('ok','xs') };
  S.forEach(x => { x.el = html(`<li class="bws-s queued"><span class="g">${G.queued}</span><span class="bws-t"><span>${x.t}</span><span class="d" hidden></span></span></li>`); list.appendChild(x.el); });
  function step(i, s, d){
    const x = S[i], de = $('.d', x.el); if (x.s === s && de.textContent === (d || '')) return;
    x.s = s; x.el.className = 'bws-s ' + s; const g = $('.g', x.el); g.innerHTML = G[s]; enter(g);
    if (s === 'run' || s === 'wait') x.el.setAttribute('aria-current', 'step'); else x.el.removeAttribute('aria-current');
    if (!d){ de.hidden = true; de.textContent = ''; } else if (de.hidden){ de.textContent = d; de.hidden = false; enter(de); } else swap(de, d);
  }
  // the page's cookie banner waits below the fold of the viewport, and the agent's own pointer above it
  const ck = html('<div class="bws-ck"><span>This site uses cookies</span><button type="button">Reject all</button><button type="button">Accept all</button></div>');
  const cur = html('<span class="bws-cur" aria-hidden="true"><svg viewBox="0 0 14 14"><path d="M2 1.5l9.5 5-4.2 1.2-2 4.3z"/></svg></span>');
  vp.append(ck, cur);
  function page(k, u){
    const old = $('.bws-pg', vp), pg = html(PAGES[k]); vp.insertBefore(pg, ck); if (old) old.remove(); enter(pg);
    $('svg', url).outerHTML = I(k === 'search' ? 'search' : 'lock', 'xs'); swap($('span', url), u);
  }
  // the person can pause the agent or take the page over; either holds it wherever it is, and it waits for them when
  // the page blocks it
  let paused = false, you = false, blocked = false, finished = false, secs = 0, unblock = null;
  const held = () => paused || you;
  async function act(ms){ for (let left = ms; left > 0;){ await c.wait(100); if (!held()) left -= 100; } }
  async function aim(el){
    const v = vp.getBoundingClientRect(), b = el.getBoundingClientRect(), x = b.left - v.left + Math.min(b.width * .5, 36), y = b.top - v.top + b.height * .6;
    if (!cur.classList.contains('on')){ cur.style.transition = 'none'; cur.style.transform = `translate(${x + 30}px,${y + 40}px)`; void cur.offsetWidth; cur.style.transition = ''; cur.classList.add('on'); }
    cur.style.transform = `translate(${x}px,${y}px)`; el.classList.add('aim');
    await act(800); cur.classList.add('down'); await act(200); cur.classList.remove('down'); el.classList.remove('aim');
  }
  const clock = () => Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');
  stEl.innerHTML = '<span class="m">Browsing</span> · <span class="num ck">0:00</span>';
  c.every(1000, () => { if (!held() && !blocked && !finished){ secs++; $('.ck', stEl).textContent = clock(); } });
  function update(){
    root.classList.toggle('you', you); root.classList.toggle('paused', paused && !you);
    swap($('.m', stEl), finished ? 'Done' : you ? 'You have control' : paused ? 'Paused' : blocked ? 'Needs you' : 'Browsing');
    const pl = paused ? 'Resume' : 'Pause'; pauseB.innerHTML = I(paused ? 'play' : 'pause'); pauseB.setAttribute('aria-label', pl); pauseB.dataset.tip = pl;
    pauseB.disabled = you || finished; takeB.disabled = finished;
    takeB.setAttribute('aria-pressed', you); takeB.textContent = you ? 'Hand back' : 'Take over';
    // while the person has the page, its buttons are theirs and the agent's pointer steps aside
    vp.inert = !you; cur.style.visibility = you ? 'hidden' : '';
    const ask = $('.bws-ask', r);
    if (blocked && !you && !ask) showAsk(); else if ((!blocked || you) && ask) ask.remove();
    if (blocked) step(3, 'wait', you ? 'Close the banner, then hand back' : 'A cookie banner covers the table');
  }
  function showAsk(){
    const ask = html('<div class="bws-ask"><button class="pill primary sm bws-allow">Allow closing it</button><button class="pill soft sm bws-you">Take over</button></div>');
    $('.bws-t', S[3].el).appendChild(ask); enter(ask);
    $('.bws-allow', ask).onclick = () => c.run(async () => {
      // the agent closes it the privacy-friendly way, with Reject all
      blocked = false; update(); step(3, 'run', 'Closing the banner');
      await aim($('button', ck)); ck.classList.remove('on'); unblock();
    });
    $('.bws-you', ask).onclick = () => takeB.click();
  }
  pauseB.onclick = () => { paused = !paused; update(); };
  takeB.onclick = () => { you = !you; if (you) paused = false; update(); };
  // with the page in hand, either banner button closes it
  $$('button', ck).forEach(b => b.onclick = () => { if (!you || !blocked) return; ck.classList.remove('on'); blocked = false; update(); unblock(); });
  // the run: search, open the site, go to pricing and scroll to the table, where a cookie banner covers it and the agent
  // asks before touching it. Once it is gone, it reads the table and takes the three prices
  c.run(async () => {
    page('search', 'northwind pricing'); step(0, 'run');
    await act(1800); step(0, 'done'); step(1, 'run');
    await aim($('[data-k="site"]', vp)); page('home', 'northwind.app');
    await act(1200); step(1, 'done'); step(2, 'run');
    await aim($('[data-k="pricing"]', vp)); page('pricing', 'northwind.app/pricing');
    await act(1000); step(2, 'done'); step(3, 'run');
    await act(600);
    const pg = $('.bws-pg', vp); pg.style.transform = `translateY(${-Math.max(0, Math.min(pg.offsetHeight - vp.clientHeight, $('.bws-tb', pg).offsetTop - 8))}px)`;
    await act(1200); ck.classList.add('on'); await act(500);
    blocked = true; update();
    await new Promise(res => { unblock = res; });
    step(3, 'run');
    await act(1400); step(3, 'done', '3 plans, priced per seat'); step(4, 'run', '0 of 3 prices');
    const cells = $$('.bws-tb .num', vp);
    for (let i = 0; i < cells.length; i++){ await aim(cells[i]); cells[i].classList.add('hit'); step(4, 'run', `${i + 1} of 3 prices`); }
    await act(500); cur.classList.remove('on');
    finished = true; step(4, 'done', '$8, $16 and $32 per seat'); update();
    const sm = html(`<div class="bws-sum">${I('ok','xs')}<span>Done · 3 prices saved to Pricing research</span></div>`); root.appendChild(sm); enter(sm);
  });
  update();
  // the preview's story: the agent stops at the cookie banner, the person allows it to close it, and it finishes
  c.story(async s => {
    await s.until(() => $('.bws-allow', r)); await s.beat(3);
    await s.tap($('.bws-allow', r)); s.away();
    await s.until(() => finished); await s.beat(3);
  });
});
