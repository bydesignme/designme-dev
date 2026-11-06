// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, BRAND, DM, I, enter, html, stagger, swap } from '../core/core.js';
DM.def('tool-connections', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{refresh}', I('refresh','xs')).replace('{plus}', I('plus','xs'));
  let T = [
    ['@figma','Figma','Read and edit frames','var(--dm-pl)',1],
    ['@github','GitHub','designme/web, PRs only','var(--dm-fg)',0],
    ['@slack','Slack','#design, #launch','var(--dm-pm)',1],
    ['db','Analytics','Read only, last 90 days','var(--dm-pt)',1],
    ['globe','Web search','Any public site','var(--dm-pb)',2]
  ];
  const ADD = [['table','Google Sheets','var(--dm-ok)'],['bell','Linear','var(--dm-pp)'],['mail','Gmail','var(--dm-pr)']];
  const list = $('.hnx-list', r), st = $('.hnx-st', r), pop = $('.hnx-pop', r);
  const PM = ['Off','Ask','Allow'];
  function row(t){
    const el = html(`<div class="hnx-t${t[4] === 0 ? ' off' : ''}">${t[0][0] === '@' ? `<span class="ic brandic">${BRAND[t[0].slice(1)]}</span>` : `<span class="ic" style="color:${t[3]};background:color-mix(in srgb,${t[3]} 12%,transparent)">${I(t[0],'xs')}</span>`}<span class="t">${t[1]}<span>${t[2]}</span></span><div class="hnx-pm" role="group" aria-label="${t[1]} permission"><span class="kn"></span>${PM.map((p, i) => `<button aria-pressed="${i === t[4]}" data-tip="${['Agent cannot use it','Agent asks first','Agent uses it freely'][i]}">${p}</button>`).join('')}</div></div>`);
    const g = $('.hnx-pm', el), kn = $('.kn', g), bs = $$('button', g);
    // the knob slides when a choice changes; when the row first appears it is simply in place
    const place = now => { const b = bs[t[4]]; if (now) kn.style.transition = 'none'; kn.style.left = b.offsetLeft + 'px'; kn.style.width = b.offsetWidth + 'px'; if (now){ void kn.offsetWidth; kn.style.transition = ''; } };
    bs.forEach((b, i) => b.onclick = () => { t[4] = i; bs.forEach((x, j) => x.setAttribute('aria-pressed', j === i)); place(); el.classList.toggle('off', i === 0); count(); });
    // a click with the mouse doesn't take focus, so it never leaves a focus ring; the keyboard still reaches every option
    bs.forEach(b => b.onmousedown = e => e.preventDefault());
    requestAnimationFrame(() => place(true)); new ResizeObserver(() => place(true)).observe(g);
    el._t = t; return el;
  }
  // the first count is written straight in, so the header doesn't crossfade from the template's number on load
  const count = now => { const n = T.filter(t => t[4] > 0).length + ' connected'; if (now) st.textContent = n; else swap(st, n); };
  T.forEach(t => list.appendChild(row(t))); stagger([...list.children], 50); count(true);
  function menu(){ pop.innerHTML = ADD.length ? ADD.map((a, i) => `<button class="mi" role="menuitem" data-close data-i="${i}">${I(a[0],'xs')}<span>${a[1]}</span></button>`).join('') : '<div class="ph" style="padding:8px;font-size:12.5px;color:var(--dm-muted)">All tools connected</div>';
    $$('.mi', pop).forEach(m => m.addEventListener('click', () => { const a = ADD.splice(+m.dataset.i, 1)[0]; const t = [a[0], a[1], 'Just connected', a[2], 1]; T.push(t); const el = row(t); list.appendChild(el); enter(el); count(); menu(); })); }
  menu();
  // Test all: every connected tool shows a small spinner at once, and they settle one by one; only a failure changes its line
  const test = $('.hnx-test', r), testWas = test.innerHTML;
  test.onclick = () => c.run(async () => {
    const rows = [...list.children].filter(el => el._t[4] > 0);
    test.disabled = true; test.innerHTML = '<span class="spin"></span>Testing'; swap(st, 'Testing ' + rows.length + ' connections');
    rows.forEach(el => el.classList.add('chk'));
    for (const el of rows){ await c.wait(600); el.classList.remove('chk');
      if (el._t[1] === 'Slack' && !el._t.ok){ el.classList.add('err'); swap($('.t span', el), 'Token expired. Reconnect to use it'); }
    }
    test.disabled = false; test.innerHTML = testWas;
    swap(st, rows.filter(el => !el.classList.contains('err')).length + ' of ' + rows.length + ' healthy');
    const bad = [...list.children].find(el => el.classList.contains('err'));
    // a second test finds the row already offering Reconnect, so it keeps that button
    const pm = bad && $('.hnx-pm', bad);
    if (pm){ const b = html(`<button class="pill accent sm">Reconnect</button>`); pm.replaceWith(b); enter(b);
      b.onclick = () => c.run(async () => { b.innerHTML = '<span class="spin"></span>'; await c.wait(900); bad.classList.remove('err'); bad._t.ok = true; const n = row(bad._t); bad.replaceWith(n); swap(st, [...list.children].filter(el => el._t[4] > 0).length + ' of ' + [...list.children].filter(el => el._t[4] > 0).length + ' healthy'); }); }
  });
  // the preview's story: test everything, Slack's token has expired, reconnect it, and every connection is healthy
  c.story(async s => {
    await s.beat(3);
    await s.tap(test); s.away();
    await s.until(() => $('.hnx-t.err .pill', list)); await s.beat(3);
    await s.tap($('.hnx-t.err .pill', list)); s.away();
    await s.until(() => !$('.hnx-t.err', list)); await s.beat(1);
  });
});
