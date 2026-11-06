// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, hold, html, stagger, swap } from '../core/core.js';
DM.def('form', (r, c) => {
  r.innerHTML = r.innerHTML.split('{spark}').join(I('spark','xs'));
  const form = $('.fmx', r), n = $('[name=n]', r), g = $('[name=g]', r), d = $('[name=d]', r), cnt = $('.fmx-c', r), ms = $('.fmx-ms', r);
  let type = null;
  n.oninput = () => { cnt.textContent = n.value.length + '/40'; clear(n); };
  g.oninput = () => clear(g); d.oninput = () => clear(d);
  const chips = $$('.fmx-ty .chip', r);
  chips.forEach(ch => ch.onclick = () => { type = ch.dataset.v; chips.forEach(x => x.classList.toggle('on', x === ch)); clear(ch.parentElement); });
  function clear(el){ const f = el.closest('.fmx-f'); f.classList.remove('bad', 'ai'); $('.er', f)?.remove(); }
  function bad(el, t){ const f = el.closest('.fmx-f'); if (f.classList.contains('bad')) return; f.classList.add('bad'); f.insertAdjacentHTML('beforeend', `<span class="er">${t}</span>`); }
  async function type_(el, s){ el.closest('.fmx-f').classList.add('ai'); el.value = ''; for (const ch of s){ el.value += ch; el.dispatchEvent(new Event('input')); el.closest('.fmx-f').classList.add('ai'); await c.wait(18); } }
  $('.fmx-ai', r).onclick = () => c.run(async () => {
    const b = $('.fmx-ai', r); b.innerHTML = '<span class="think on"><i></i><i></i><i></i><i></i></span>Drafting';
    if (!n.value) await type_(n, 'Pricing refresh');
    await type_(g, 'Lift trial to paid by showing annual plans first and keeping one CTA per card.');
    if (!type) chips[0].click();
    if (!d.value) await type_(d, 'Nov 14');
    b.innerHTML = I('check','xs') + 'Drafted'; swap(ms, 'Review what the agent drafted');
  });
  // the preview has the agent fill it in once on its own, unless you take over first
  c.auto(1400, () => { if (!n.value) $('.fmx-ai', r).click(); });
  form.onsubmit = e => { e.preventDefault(); let ok = true;
    if (!n.value.trim()){ bad(n, 'Give it a name'); ok = false; }
    if (g.value.trim().length < 12){ bad(g, 'Add a sentence about the goal'); ok = false; }
    if (!type){ bad(chips[0], 'Pick a type'); ok = false; }
    if (!ok) return swap(ms, 'A few fields need a look');
    c.run(async () => { const go = $('.fmx-go', r); go.innerHTML = '<span class="spin"></span>'; await c.wait(800);
      hold(form); [...form.children].forEach(k => k.hidden = true); const dn = html(`<div class="fmx-done">${I('ok')}<b>${n.value} created</b><span class="muted">The agent is gathering references now</span></div>`); form.appendChild(dn); stagger([...dn.children], 70); }); };
});
