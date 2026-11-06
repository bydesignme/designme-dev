// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, ctl, stagger } from '../core/core.js';
DM.def('prompt-starters', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{up}', I('up')).replace('{shuffle}', I('refresh','xs'));
  const sets = [
    [['grid','var(--dm-pb)','var(--dm-pb-bg)','Audit a page','Check the pricing page for spacing and contrast','Audit pricing for spacing and contrast'],['edit','var(--dm-pl)','var(--dm-pl-bg)','Rewrite copy','Make the onboarding intro shorter','Make the onboarding intro shorter'],['code','var(--dm-pm)','var(--dm-pm-bg)','Export tokens','Turn colour and spacing into CSS variables','Export the tokens as CSS variables'],['layers','var(--dm-pp)','var(--dm-pp-bg)','Compare frames','Diff the mobile and desktop frames','Diff the mobile and desktop frames']],
    [['chart','var(--dm-pt)','var(--dm-pt-bg)','Explain a metric','Why did activation drop last week','Why did activation drop last week?'],['mail','var(--dm-pk)','var(--dm-pk-bg)','Draft an email','Announce the new pricing to customers','Announce the new pricing by email'],['bug','var(--dm-pr)','var(--dm-pr-bg)','Find a bug','Trace why checkout logs people out','Fix checkout logging people out'],['figma','var(--dm-pl)','var(--dm-pl-bg)','Build from Figma','Turn the hero frame into code','Build the hero frame in React']]
  ];
  let si = 0;
  const grid = $('.psx-grid', r), tx = $('.psx-tx', r), inp = $('.psx-in', r), go = $('.psx-go', r);
  function paint(){
    grid.innerHTML = sets[si].map((s, i) => `<button class="psx-c" data-i="${i}"><span class="psx-ic" style="color:${s[1]};background:${s[2]}">${I(s[0] === 'bug' ? 'alert' : s[0])}</span><b>${s[3]}</b><span class="d">${s[4]}</span></button>`).join('');
    stagger($$('.psx-c', grid), 60);
    $$('.psx-c', grid).forEach(b => b.onclick = () => pick(b));
  }
  let k = null;
  function pick(b){
    $$('.psx-c', grid).forEach(x => x.classList.toggle('on', x === b));
    if (k) k.stop(); k = ctl(c); const kk = k; c.offs.push(() => kk.stop());
    tx.innerHTML = ''; inp.classList.add('has'); go.disabled = false;
    kk.run(async () => { for (const w of sets[si][b.dataset.i][5].split(' ')){ tx.insertAdjacentHTML('beforeend', `<span class="w">${w} </span>`); await kk.wait(40); } });
  }
  $('.psx-sh', r).onclick = () => { si = (si + 1) % sets.length; tx.innerHTML = ''; inp.classList.remove('has'); go.disabled = true; paint(); };
  go.onclick = () => { tx.innerHTML = '<span class="w">Sent to the agent</span>'; go.disabled = true; $$('.psx-c', grid).forEach(x => x.classList.remove('on')); };
  // the box starts empty: a starter fills it when someone picks one, in one short line
  paint();
});
