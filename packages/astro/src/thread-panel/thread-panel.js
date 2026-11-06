// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, html } from '../core/core.js';
DM.def('thread-panel', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{up}', I('up'));
  const T = [
    { t:'Onboarding', col:'var(--dm-ok-mark)', msgs:[['u','Why is the workspace step losing people?'],['a','It asks for a team name before anyone has made anything. Moving it after the first project, with the name filled from the email domain, should help.', ['Funnel data','Session notes']]] },
    { t:'Tokens', col:'var(--dm-warn-mark)', msgs:[['u','Which colours are still hard-coded?'],['a','Eleven, mostly greys in Button and Card. I can swap them for tokens in one pass.', ['tokens.ts']]] },
    { t:'Launch email', col:'var(--dm-faint)', msgs:[['u','Draft the launch email for Friday.'],['a','Two subject lines are ready. The shorter one tested better with the team.', []]] }
  ];
  let cur = 0;
  const tabs = $('.thp-tabs', r), body = $('.thp-body', r), field = $('.thp-field', r), send = $('.thp-send', r);
  tabs.innerHTML = T.map((t, i) => `<button class="thp-tab" role="tab" aria-selected="${i === 0}"><span class="dot" style="color:${t.col}"></span>${t.t}</button>`).join('') + '<span class="thp-ink"></span>';
  const ink = $('.thp-ink', r), tbs = $$('.thp-tab', r);
  const place = () => { const b = tbs[cur]; ink.style.left = b.offsetLeft + 10 + 'px'; ink.style.width = b.offsetWidth - 20 + 'px'; };
  const msg = (m, anim) => { const el = m[0] === 'u' ? html(`<div class="bub">${m[1]}</div>`) : html(`<div class="thp-ag">${m[2] && m[2].length ? `<div class="src">${m[2].map(s => `<button class="fchip lnk" data-tip="${({ 'Funnel data':'Amplitude, last 30 days', 'Session notes':'Notion, 8 interviews', 'tokens.ts':'src/styles/tokens.ts' })[s] || s}">${I('file-text','xs')}${s}</button>`).join('')}</div>` : ''}${m[1]}</div>`); body.appendChild(el); if (anim){ enter(el); body.scrollTo({ top:body.scrollHeight, behavior:REDUCE ? 'auto' : 'smooth' }); } else body.scrollTop = body.scrollHeight; return el; };
  function show(i){ cur = i; tbs.forEach((b, k) => b.setAttribute('aria-selected', k === i)); place(); body.innerHTML = ''; T[i].msgs.forEach((m, k) => { const el = msg(m); enter(el, k * 70); }); }
  tbs.forEach((b, i) => b.onclick = () => show(i));
  field.oninput = () => { send.disabled = !field.value.trim(); };
  $('.thp-in', r).onsubmit = e => { e.preventDefault(); const v = field.value.trim(); if (!v) return; field.value = ''; send.disabled = true;
    const m = ['u', v]; T[cur].msgs.push(m); msg(m, true);
    const th = html('<div class="thp-ag"><span class="shim">Thinking</span></div>'); body.appendChild(th); enter(th);
    const k = cur; c.later(1400, () => { th.remove(); const a = ['a', 'On it. I\'ll update this thread when it\'s done.', []]; T[k].msgs.push(a); if (cur === k) msg(a, true); });
  };
  requestAnimationFrame(() => show(0)); new ResizeObserver(place).observe(tabs);
  // once the card has settled, a reply is typed and sent in place, unless someone has started using it
  // the preview asks a follow-up by itself; clicking, focusing or typing in it takes over, and what it had typed goes
  c.run(async () => {
    await c.step(1800);
    await c.type(field, 'Can you make that change now?', { ms:() => 32 + Math.random() * 40, each:() => { send.disabled = !field.value.trim(); }, keep:true });
    await c.step(380); $('.thp-in', r).requestSubmit();
  });
});
