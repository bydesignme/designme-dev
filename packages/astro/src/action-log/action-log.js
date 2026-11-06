// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, enter, html, swap } from '../core/core.js';
DM.def('action-log', (r, c) => {
  const list = $('.alg-list', r);
  const acts = [
    { ic:'file-text', t:'Read <code>Pricing.tsx</code>', d:'src/pages, 212 lines', ms:'0.4s', det:'export function Pricing() {\n  return &lt;Grid cols={3} gap={20}&gt;…' },
    { ic:'search', t:'Searched Figma for <code>Button</code>', d:'6 matches in Components.fig', ms:'1.1s', det:'Button / Primary\nButton / Secondary\nButton / Ghost  +3' },
    { ic:'edit', t:'Edited <code>PricingCard.tsx</code>', d:'<span style="color:var(--dm-add)">+18</span> <span style="color:var(--dm-del)">−7</span> lines', ms:'2.3s', det:'<span class="x">− gap: 20px;</span>\n<span class="a">+ gap: var(--space-6);</span>' },
    { ic:'term', t:'Ran <code>npm test</code>', d:'24 tests passed', ms:'3.2s', det:'✓ PricingCard renders 3 plans\n✓ toggles yearly billing\n24 passed, 0 failed' },
    { ic:'pr', t:'Opened a pull request', d:'#412, Use shared spacing tokens', ms:'0.6s', det:'feat/pricing-spacing → main\n3 commits, ready for review' }
  ];
  const sum = $('.alg-sum', r), st = $('.alg-st', r);
  c.run(async () => {
    let total = 0;
    for (const a of acts){
      const li = html(`<li class="alg-it"><button class="alg-row" aria-expanded="false"><span class="alg-ic">${I(a.ic)}</span><span class="alg-tx"><b>${a.t}</b><span class="d">${a.d}</span></span><span class="alg-r"><span class="num ms"></span><span class="g"><span class="spin" style="width:10px;height:10px"></span></span></span></button><div class="fold shut alg-det"><div><pre>${a.det}</pre></div></div></li>`);
      list.appendChild(li); enter(li);
      const btn = $('.alg-row', li), det = $('.alg-det', li);
      btn.onclick = () => { const s = det.classList.toggle('shut'); btn.setAttribute('aria-expanded', !s); };
      swap(sum, 'Running step ' + list.children.length);
      await c.wait(950);
      $('.g', li).innerHTML = `<span style="color:var(--dm-ok)">${I('check','xs')}</span>`; enter($('.g', li).firstElementChild);
      $('.ms', li).textContent = a.ms; total += parseFloat(a.ms);
    }
    st.innerHTML = `<span class="dot" style="color:var(--dm-ok)"></span><span>5 steps, ${total.toFixed(1)}s</span>`; enter(st);
  });
});
