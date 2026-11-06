// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, copied, swap } from '../core/core.js';
DM.def('response-versions', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{l}', I('chev-l')).replace('{rr}', I('chev-r')).replace('{re}', I('refresh')).replace('{cp}', I('copy'));
  const pool = [
    'Pricing that grows with your team. Start free, upgrade when the work gets serious.',
    'One plan per stage of your team. No seat math, no surprises on the invoice.',
    'Design faster with an agent on every plan. Pay for what you ship, not for seats.',
    'Simple pricing for teams who ship. Free to start, fair as you grow.'
  ];
  const vers = [pool[0]]; let cur = 0, busy = false;
  const t = $('.rvx-t', r), n = $('.rvx-n', r), pv = $('.rvx-prev', r), nx = $('.rvx-next', r), re = $('.rvx-re', r), st = $('.rvx-st', r);
  const nav = () => { n.textContent = (cur + 1) + ' / ' + vers.length; pv.disabled = cur === 0 || busy; nx.disabled = cur === vers.length - 1 || busy; };
  async function stream(s){
    t.classList.add('out'); await c.wait(260); t.classList.remove('out'); t.innerHTML = '';
    for (const w of s.split(' ')){ t.insertAdjacentHTML('beforeend', `<span class="w">${w} </span>`); await c.wait(45); }
  }
  async function show(i){ cur = i; nav(); t.classList.add('out'); await c.wait(240); t.classList.remove('out'); t.innerHTML = vers[i].split(' ').map((w, k) => `<span class="w" style="animation-delay:${k * 12}ms">${w} </span>`).join(''); }
  pv.onclick = () => c.run(() => show(cur - 1));
  nx.onclick = () => c.run(() => show(cur + 1));
  re.onclick = () => { if (busy) return; busy = true; re.classList.add('go'); c.later(700, () => re.classList.remove('go'));
    c.run(async () => { swap(st, 'Writing a new version'); st.classList.add('shim');
      const s = pool[vers.length % pool.length]; vers.push(s); cur = vers.length - 1; nav();
      await stream(s); busy = false; nav(); st.classList.remove('shim'); swap(st, ''); }); };
  const cp = $('.rvx-cp', r);
  cp.onclick = () => copied(cp, vers[cur]);
  c.run(async () => { busy = true; nav(); await c.wait(300); await stream(vers[0]); busy = false; nav();
    // then one regenerate plays by itself, so the version count and arrows show what they do, unless you have taken over
    await c.step(1900); if (vers.length === 1) re.click(); });
});
