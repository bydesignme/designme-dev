// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, DM, I, copied, enter, html, swap } from '../core/core.js';
DM.def('invite', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs')).replace(/\{chk\}/g, I('check','xs')).replace('{link}', I('link','xs'));
  const chips = $('.ivx-chips', r), inp = $('.ivx-f input', r), go = $('.ivx-go', r), mem = $('.ivx-mem', r), sg = $('.ivx-sg', r);
  let E = [], role = 'Can edit', shown = new Set();
  const COL = ['var(--dm-av-l)','var(--dm-av-m)','var(--dm-av-t)','var(--dm-av-p)','var(--dm-av-k)'];
  const ok = e => /^\S+@\S+\.\S+$/.test(e);
  const ini = e => e.split('@')[0].slice(0, 2).toUpperCase();
  function paint(){ const seen = shown; shown = new Set(E); chips.innerHTML = E.map((e, i) => `<span class="ivx-ch${ok(e) ? '' : ' bad'}${seen.has(e) ? ' seen' : ''}" ${ok(e) ? '' : 'data-tip="Not a valid email"'}>${ok(e) ? AV(ini(e), COL[i % 5]) : I('alert','xs')}${e}<button aria-label="Remove ${e}">${I('x','xs')}</button></span>`).join('');
    $$('.ivx-ch button', chips).forEach((b, i) => b.onclick = () => { E.splice(i, 1); paint(); });
    const n = E.filter(ok).length; go.disabled = !n || E.some(e => !ok(e)); go.textContent = n > 1 ? `Send ${n} invites` : 'Send invite'; }
  function commit(){ const parts = inp.value.split(/[,\s]+/).map(s => s.trim()).filter(Boolean); if (!parts.length) return; parts.forEach(p => { if (!E.includes(p)) E.push(p); }); inp.value = ''; paint(); }
  inp.onkeydown = e => { if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab'){ if (inp.value.trim()){ e.preventDefault(); commit(); } } else if (e.key === 'Backspace' && !inp.value && E.length){ E.pop(); paint(); } };
  inp.onpaste = () => setTimeout(commit, 0); inp.onblur = commit;
  [['ari@studio.com','AR','var(--dm-av-p)'],['sam@studio.com','SL','var(--dm-av-t)']].forEach(s => { const b = html(`<button class="chip sm">${AV(s[1], s[2])}${s[0].split('@')[0]}</button>`); sg.appendChild(b); b.onclick = () => { if (!E.includes(s[0])){ E.push(s[0]); paint(); } b.remove(); }; });
  $$('.ivx-rp .mi', r).forEach(m => m.addEventListener('click', () => { role = m.dataset.r; $$('.ivx-rp .mi', r).forEach(x => x.setAttribute('aria-checked', x === m)); swap($('.ivx-role span', r), role); }));
  const M = [['MK','var(--dm-av-l)','Maya Kim','Owner'],['JO','var(--dm-av-m)','Jon Ortiz','Can edit']];
  mem.innerHTML = M.map(m => `<div class="ivx-m">${AV(m[0], m[1])}<span class="t">${m[2]}</span><span class="r">${m[3]}</span></div>`).join('');
  go.onclick = () => c.run(async () => { go.innerHTML = '<span class="spin"></span>'; await c.wait(800); E.filter(ok).forEach((e, i) => { const el = html(`<div class="ivx-m">${AV(ini(e), COL[i % 5])}<span class="t">${e.split('@')[0]}<span>${e}</span></span><span class="r pend">Invited, ${role.toLowerCase()}</span></div>`); mem.appendChild(el); enter(el, i * 70); }); E = []; paint(); });
  const lk = $('.ivx-link', r); lk.onclick = () => { copied(lk, 'https://designme.dev/join/pricing-refresh'); const t = lk.lastChild; t.textContent = 'Link copied'; clearTimeout(lk._lt); lk._lt = setTimeout(() => { t.textContent = 'Copy link'; }, 1600); };
  paint();
  // the preview adds two people on its own; clicking, focusing or typing in it takes over, and what it had typed goes
  c.auto(900, () => c.run(async () => { await c.type(inp, 'dana@studio.com', { keep:true }); await c.step(40); commit(); await c.type(inp, ' lee@studio', { keep:true }); commit(); }));
});
