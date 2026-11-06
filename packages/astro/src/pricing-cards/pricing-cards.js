// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, seg, stagger, swap, tween } from '../core/core.js';
DM.def('pricing-cards', (r, c) => {
  const P = [
    { n:'Starter', d:'For trying the agent', m:0, f:['1 project','50 agent runs a month','Figma import'], cta:'Start free' },
    { n:'Pro', d:'For growing design teams', m:24, f:['Unlimited projects','1,000 runs per editor','Shared tokens and memory','Priority models'], cta:'Start free trial', hot:1 },
    { n:'Enterprise', d:'For design orgs', m:null, f:['SSO and audit log','Custom spend caps','Dedicated support'], cta:'Talk to us' }
  ];
  const grid = $('.pcx-grid', r), rng = $('.pcx-seats input', r), sn = $('.pcx-sn', r);
  let per = 'y', seats = 5; const shown = P.map(() => 0);
  grid.innerHTML = P.map(p => `<div class="pcx-c panel${p.hot ? ' hot' : ''}">${p.hot ? '<span class="tag b bd">Most popular</span>' : ''}<span class="nm">${p.n}</span><span class="ds">${p.d}</span><div class="pcx-pr"><b class="num"></b><s class="num"></s><span></span></div><div class="pcx-tot num"></div><div class="pcx-li">${p.f.map(x => `<span>${I('check','xs')}${x}</span>`).join('')}</div><button class="pill ${p.hot ? 'primary' : 'line'}">${p.cta}</button></div>`).join('');
  const cards = $$('.pcx-c', grid);
  // the outlined card is the recommended one, and only its button is primary
  const ctas = () => cards.forEach(el => { const b = $('.pill', el), on = el.classList.contains('hot'); b.classList.toggle('primary', on); b.classList.toggle('line', !on); });
  function upd(){
    P.forEach((p, i) => { const el = cards[i], b = $('.pcx-pr b', el), s = $('.pcx-pr s', el), u = $('.pcx-pr span', el), tt = $('.pcx-tot', el);
      if (p.m === null){ b.textContent = 'Custom'; s.textContent = ''; u.textContent = 'billed yearly'; tt.textContent = 'Volume pricing from 25 editors'; return; }
      const unit = per === 'y' ? p.m * .8 : p.m;
      const go = () => tween(shown[i], unit, 500, v => { shown[i] = v; b.textContent = '$' + (Number.isInteger(unit) ? Math.round(v) : v.toFixed(2)); });
      // the first time, the prices count up once the cards are in view
      if (first){ b.textContent = '$0'; c.later(260, go); } else go();
      s.textContent = per === 'y' && p.m ? '$' + p.m : ''; u.textContent = p.m ? 'per editor, per month' : 'forever';
      swap(tt, p.m ? `$${(unit * seats * (per === 'y' ? 12 : 1)).toLocaleString('en-US', { maximumFractionDigits:0 })} ${per === 'y' ? 'billed yearly' : 'a month'} for ${seats} editor${seats > 1 ? 's' : ''}` : 'Up to 2 editors'); });
  }
  seg($('.pcx-per', r), v => { per = v; upd(); });
  rng.oninput = () => { seats = +rng.value; sn.textContent = seats; P.forEach((p, i) => { if (!p.m) return; const tt = $('.pcx-tot', cards[i]); const unit = per === 'y' ? p.m * .8 : p.m; tt.textContent = `$${(unit * seats * (per === 'y' ? 12 : 1)).toLocaleString('en-US', { maximumFractionDigits:0 })} ${per === 'y' ? 'billed yearly' : 'a month'} for ${seats} editor${seats > 1 ? 's' : ''}`; });
    cards[2].classList.toggle('hot', seats >= 25); cards[1].classList.toggle('hot', seats < 25); ctas(); };
  let first = true; stagger(cards, 80); upd(); first = false;
  // once in view it shows the switch at work: monthly, then back to yearly. Touching it takes over
  const flip = v => $(`.pcx-per button[data-v="${v}"]`, r).click();
  c.auto(1900, () => flip('m')); c.auto(3900, () => flip('y'));
});
