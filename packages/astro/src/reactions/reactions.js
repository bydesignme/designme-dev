// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, hideTip, html, showTip, tipFor } from '../core/core.js';
DM.def('reactions', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{spark}', I('spark','xs')).replace('{smile}', I('smile','xs'));
  const R = [['🚀',4,['Maya','Jon','Ari','Sam'],0],['👀',2,['Jon','Dana'],0],['✅',1,['Maya'],0]];
  const list = $('.rxx-list', r);
  const tipOf = b => { const x = b._x, who = x[3] ? ['You', ...x[2]] : x[2]; b.dataset.tip = who.slice(0, 3).join(', ') + (who.length > 3 ? ' and ' + (who.length - 3) + ' more' : ''); if (tipFor === b) showTip(b); };
  function make(x){ const b = html(`<button class="rxx-r${x[3] ? ' me' : ''}" aria-pressed="${!!x[3]}"><span class="e">${x[0]}</span><span class="n num"><i>${x[1]}</i></span></button>`); b._x = x; tipOf(b); b.onclick = () => toggle(b); return b; }
  /* the count rolls up or down instead of the whole row re-rendering under the pointer */
  function roll(b, up){ const n = $('.n', b), old = $('i:last-child', n), nu = html(`<i class="${up ? 'iu' : 'id'}">${b._x[1]}</i>`); old.className = up ? 'ou' : 'od'; n.appendChild(nu); setTimeout(() => old.remove(), 380); }
  function bump(b){ b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  function toggle(b){ const x = b._x; x[3] = x[3] ? 0 : 1; x[1] += x[3] ? 1 : -1; b.classList.toggle('me', !!x[3]); b.setAttribute('aria-pressed', !!x[3]);
    if (x[1] <= 0){ R.splice(R.indexOf(x), 1); b.classList.add('gone'); hideTip(); setTimeout(() => b.remove(), 320); return; }
    roll(b, !!x[3]); tipOf(b); if (x[3]) bump(b); }
  R.forEach(x => list.appendChild(make(x)));
  $('.rxx-grid', r).innerHTML = ['👍','❤️','🎉','🚀','👀','✅','🔥','💯','🙌','🤔','✨','👏'].map(e => `<button data-close>${e}</button>`).join('');
  $$('.rxx-grid button', r).forEach(b => b.addEventListener('click', () => { const e = b.textContent, x = R.find(y => y[0] === e);
    if (x){ const el = $$('.rxx-r', list).find(y => y._x === x); if (!x[3]) toggle(el); else bump(el); }
    else { const nx = [e, 1, [], 1]; R.push(nx); const el = make(nx); el.classList.add('new'); list.appendChild(el); bump(el); } }));
  // the preview adds one reaction on its own, unless you take over first
  c.auto(1100, () => toggle($('.rxx-r', list)));
});
