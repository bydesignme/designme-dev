// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, stagger, swap, tween } from '../core/core.js';
DM.def('proposal-card', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{wand}', I('wand')).replace('{right}', I('right','xs')).replace('{chev}', I('chev-r','xs'));
  const segs = $$('.prx-seg i', r), pc = $('.prx-pc', r), at = $('.prx-alt-t', r), alt = $('.prx-alt', r), f = $('.prx-f', r);
  const nw = $('.prx-new', r);
  const all = [
    { bg:'#5b6472', hex:'#5B6472', ratio:'5.9 : 1', conf:84, name:'Suggested', d:'Balanced with the primary' },
    { bg:'#475161', hex:'#475161', ratio:'7.4 : 1', conf:62, name:'Darker', d:'Stronger than the primary' },
    { bg:'#116ff8', hex:'#116FF8', ratio:'4.6 : 1', conf:41, name:'Accent outline', d:'Competes with the CTA' }
  ];
  let cur = 0;
  const alts = $('.prx-alts', r);
  function conf(v){ tween(+pc.textContent.replace('%','') || 0, v, 700, x => { pc.textContent = Math.round(x) + '%'; segs.forEach((s, i) => s.classList.toggle('on', x >= (i + 1) * 20 - 10)); }); }
  function list(){ alts.innerHTML = all.map((o, i) => i === cur ? '' : `<button class="prx-a" data-i="${i}"><span class="prx-c" style="background:${o.bg}"></span><span>${o.name}, ${o.ratio}</span><span class="d">${o.d}</span></button>`).join(''); $$('.prx-a', alts).forEach(a => a.onclick = () => apply(+a.dataset.i)); }
  function apply(i){ cur = i; const o = all[i]; $('.prx-c', nw).style.background = o.bg; swap($('.num', nw), o.hex); swap($('.prx-rt', nw), o.ratio); conf(o.conf); list(); stagger($$('.prx-a', alts), 50); }
  at.onclick = () => { const op = alt.classList.toggle('shut'); at.classList.toggle('open', !op); };
  list();
  let saved;
  const reset = () => { f.innerHTML = saved; bind(); };
  function bind(){
    $('.prx-ok', r).onclick = () => { saved = f.innerHTML; alt.classList.add('shut'); at.classList.remove('open');
      f.innerHTML = `<span class="prx-done">${I('ok')}<span>Applied to 3 buttons</span></span><button class="pill ghost sm prx-un">${I('undo','xs')}Undo</button>`; stagger([...f.children], 60);
      $('.prx-un', r).onclick = reset; };
    $('.prx-no', r).onclick = () => { saved = f.innerHTML; f.innerHTML = `<span class="prx-done muted" style="color:var(--dm-muted)">Dismissed. The agent will not suggest this again.</span><button class="pill ghost sm prx-un">Undo</button>`; stagger([...f.children], 60); $('.prx-un', r).onclick = reset; };
  }
  bind(); c.later(400, () => conf(84));
});
