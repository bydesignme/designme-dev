// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, DM, I, copied, enter, html, swap, tween } from '../core/core.js';
DM.def('details-panel', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{link}', I('link','xs')).replace(/\{chev\}/g, I('chev-r','xs')).replace('{chevd}', I('chev-d','xs')).replace('{plus}', I('plus','xs'))
    .replace(/\{avm\}/g, AV('MK','var(--dm-av-l)')).replace('{avj}', AV('JO','var(--dm-av-m)')).replace('{ava}', AV('DA','var(--dm-av-b)'));
  const flash = el => { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); };
  $$('.pop', r).forEach(pp => $('.dtp', r).appendChild(pp));
  $$('.dtp-sh', r).forEach(b => b.onclick = () => { const f = b.nextElementSibling, open = f.classList.toggle('shut') === false; b.setAttribute('aria-expanded', open); });
  $$('.dtp-pst .mi', r).forEach(m => m.addEventListener('click', () => { const v = $('.dtp-stat', r); $('.dot', v).style.color = m.dataset.col; swap($('span:last-child', v), m.dataset.s); flash(v); }));
  $$('.dtp-pow .mi', r).forEach(m => m.addEventListener('click', () => { const v = $('.dtp-own', r); const av = $('.av', v); av.textContent = m.dataset.i; av.style.background = m.dataset.col; av.style.color = m.dataset.col.replace(')', '-ink)'); enter(av); swap($('span:last-child', v), m.dataset.o); flash(v); }));
  const cost = { Opus:[184200, 2.76], Sonnet:[184200, .55], Haiku:[184200, .15] }; let cc = 0, ct = 0;
  const setM = m => { tween(ct, cost[m][0], 800, v => { ct = v; $('.dtp-tok', r).textContent = Math.round(v).toLocaleString('en-US'); }); tween(cc, cost[m][1], 800, v => { cc = v; $('.dtp-cost', r).textContent = '$' + v.toFixed(2); }); };
  $$('.dtp-pmo .mi', r).forEach(m => m.addEventListener('click', () => { const v = $('.dtp-mo', r); swap(v, m.dataset.m); flash(v.parentElement); setM(m.dataset.m); }));
  const labels = [['Q4','y'],['A/B test','t'],['Urgent','r']]; let li = 0;
  $('.dtp-add', r).onclick = e => { if (li >= labels.length) return; const t = html(`<span class="tag ${labels[li][1]}">${labels[li][0]}</span>`); e.currentTarget.before(t); enter(t); li++; };
  const cp = $('.dtp-cp', r); cp.onclick = () => copied(cp, 'run_8f2a');
  // the run's tokens and cost count up once it has entered, unless a model you picked is counting already
  c.later(700, () => { if (!ct) setM('Opus'); });
});
