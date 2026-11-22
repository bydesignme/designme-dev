// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, BRAND, DM, I, REDUCE, enter, grow, html, popRoom, stagger, swap } from '../core/core.js';
DM.def('tool-connections', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{refresh}', I('refresh','xs')).replace('{plus}', I('plus','xs')).replace('{link}', I('link','xs'));
  // [mark, name, detail, tile colour (a vivid avatar colour, for a mark without a logo), permission 0 Off, 1 Ask, 2 Allow]
  let T = [
    ['@figma','Figma','Read and edit frames','',1],
    ['@github','GitHub','designme/web, PRs only','',0],
    ['@slack','Slack','#design, #launch','',1],
    ['db','Analytics','Read only, last 90 days','t',1],
    ['globe','Web search','Any public site','b',2]
  ];
  const ADD = [['table','Google Sheets','m'],['@linear','Linear',''],['@gmail','Gmail','']];
  const root = $('.hnx', r) || r, list = $('.hnx-list', r), st = $('.hnx-st', r), pop = $('.hnx-pop', r);
  const PM = ['Off','Ask','Allow'];
  // a tool's mark: its logo on a white tile, or its icon on a vivid tile of its colour, with white or the colour's own ink
  const mark = (m, k) => m[0] === '@' ? `<span class="ic brandic" aria-hidden="true">${BRAND[m.slice(1)]}</span>` : `<span class="ic" style="background:var(--dm-av-${k});color:var(--dm-av-${k}-ink)" aria-hidden="true">${I(m,'xs')}</span>`;
  function row(t){
    const el = html(`<div class="hnx-t${t[4] === 0 ? ' off' : ''}" role="listitem">${mark(t[0], t[3])}<span class="t"><span class="nm"><span>${t[1]}</span><i class="hnx-dot" aria-hidden="true"></i></span><span class="d">${t[2]}</span></span><div class="hnx-pm" role="group" aria-label="${t[1]} permission"><span class="kn"></span>${PM.map((p, i) => `<button aria-pressed="${i === t[4]}" data-tip="${['Agent cannot use it','Agent asks first','Agent uses it freely'][i]}">${p}</button>`).join('')}</div></div>`);
    const g = $('.hnx-pm', el), kn = $('.kn', g), bs = $$('button', g);
    // the knob slides when a choice changes; when the row first appears it is simply in place
    const place = now => { const b = bs[t[4]]; if (now) kn.style.transition = 'none'; kn.style.left = b.offsetLeft + 'px'; kn.style.width = b.offsetWidth + 'px'; if (now){ void kn.offsetWidth; kn.style.transition = ''; } };
    bs.forEach((b, i) => b.onclick = () => { t[4] = i; bs.forEach((x, j) => x.setAttribute('aria-pressed', j === i)); place(); el.classList.toggle('off', i === 0); count(); });
    // a click with the mouse doesn't take focus, so it never leaves a focus ring; the keyboard still reaches every option
    bs.forEach(b => b.onmousedown = e => e.preventDefault());
    requestAnimationFrame(() => place(true)); new ResizeObserver(() => place(true)).observe(g);
    el._t = t; return el;
  }
  // a test's line, in the foot beside Connect a tool, never a count that repeats the list (the owner's notes on batch 2):
  // while it runs, what it tests, in words that shimmer; once it has run, how many are healthy, with the green tick when
  // every one is. A change to a switch makes that result old, so the line goes again
  const write = (h, now) => { if (now) st.innerHTML = h; else swap(st, h, true); };
  const count = now => write('', now);
  const healthy = (ok, n) => write((ok === n ? I('ok','xs') : '') + `<span>${ok} of ${n} healthy</span>`);
  T.forEach(t => list.appendChild(row(t))); stagger([...list.children], 50); count(true);
  function menu(){ pop.innerHTML = ADD.length ? ADD.map((a, i) => `<button class="mi" role="menuitem" data-close data-i="${i}">${a[0][0] === '@' ? BRAND[a[0].slice(1)] : I(a[0],'xs')}<span>${a[1]}</span></button>`).join('') : '<div class="ph">All tools connected</div>';
    $$('.mi', pop).forEach(m => m.addEventListener('click', () => { const a = ADD.splice(+m.dataset.i, 1)[0]; const t = [a[0], a[1], 'Just connected', a[2], 1]; T.push(t); const el = row(t); list.appendChild(el); enter(el); count(); menu(); })); }
  menu();
  // a menu opens over the card from its button: down when it fits below, up when it doesn't and fits above or has more room
  // there (as placePop), within the stage's room, so it never spills over the card's caption under the stage (as Artifact
  // card's version menu). The side is set on the button just before the menu is placed
  const side = (btn, pop) => { const room = popRoom(btn), st = btn.closest('.stage-inner') || btn.closest('.stage');
    if (st){ const sr = st.getBoundingClientRect(), cs = getComputedStyle(st); room.top = Math.max(room.top, sr.top + parseFloat(cs.paddingTop)); room.bottom = Math.min(room.bottom, sr.bottom - parseFloat(cs.paddingBottom)); }
    const br = btn.getBoundingClientRect(), need = pop.offsetHeight + 12, below = room.bottom - br.bottom, above = br.top - room.top;
    btn.dataset.popPos = below < need && (above >= need || above > below) ? 'up' : 'down'; };
  const add = $('.hnx-add', r); c.on(add, 'click', () => { if (!pop.classList.contains('open')) side(add, pop); });
  // Test all: every connected tool's dot turns at once, and they settle one by one; only a failure changes its line. The
  // button is as wide as its words and eases to the new ones
  const test = $('.hnx-test', r);
  const label = h => { const w0 = test.getBoundingClientRect().width; test.innerHTML = h; const w1 = test.getBoundingClientRect().width;
    const cs = getComputedStyle(test), t = cs.getPropertyValue('--dm-t').trim();
    if (!REDUCE && w0 && Math.abs(w1 - w0) > .5) test.animate([{ width:w0 + 'px' }, { width:w1 + 'px' }], { duration:(t.endsWith('ms') ? parseFloat(t) : parseFloat(t) * 1000) || 340, easing:cs.getPropertyValue('--dm-ease').trim() || 'ease' }); };
  const idle = I('refresh','xs') + '<span>Test all</span>';
  test.onclick = () => c.run(async () => {
    const rows = [...list.children].filter(el => el._t[4] > 0);
    test.disabled = true; label('<span class="spin"></span><span>Testing</span>'); write(`<span class="shim">Testing ${rows.length} connections</span>`);
    rows.forEach(el => el.classList.add('chk'));
    for (const el of rows){ await c.wait(600); el.classList.remove('chk');
      // the row turns red with its new words, not before them
      if (el._t[1] === 'Slack' && !el._t.ok){ el._bad = true; swap($('.d', el), 'Token expired. Reconnect to use it'); c.later(REDUCE ? 0 : 170, () => el.classList.add('err')); }
    }
    test.disabled = false; label(idle);
    healthy(rows.filter(el => !el._bad).length, rows.length);
    const bad = [...list.children].find(el => el._bad);
    // a second test finds the row already offering Reconnect, so it keeps that button
    const pm = bad && $('.hnx-pm', bad);
    if (pm){ const b = html(`<button class="pill accent sm">Reconnect</button>`); pm.replaceWith(b); enter(b);
      // while it reconnects it keeps its colour and its width, with a spinner in place of its word, and takes no second press
      b.onclick = () => c.run(async () => { if (b.getAttribute('aria-disabled')) return; b.setAttribute('aria-disabled', 'true'); b.setAttribute('aria-label', 'Reconnecting');
        const w0 = b.getBoundingClientRect().width; b.innerHTML = '<span class="spin"></span>'; b.style.width = w0 + 'px';
        await c.wait(900); bad.classList.remove('err'); bad._t.ok = true; const n = row(bad._t); bad.replaceWith(n); enter(n);
        const on = [...list.children].filter(el => el._t[4] > 0).length; healthy(on, on); }); }
  });
  // the card grows with its rows, and eases when a line wraps or Reconnect takes a switch's place (owner, 17 Nov: no room
  // kept for a later state)
  c.offs.push(grow(root));
  // the preview's story: test everything, Slack's token has expired, reconnect it, and every connection is healthy
  c.story(async s => {
    await s.beat(3);
    await s.tap(test); s.away();
    await s.until(() => $('.hnx-t.err .pill', list)); await s.beat(3);
    await s.tap($('.hnx-t.err .pill', list)); s.away();
    await s.until(() => !$('.hnx-t.err', list)); await s.beat(1);
  });
});
