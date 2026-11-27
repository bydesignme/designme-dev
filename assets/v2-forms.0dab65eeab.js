TPLS["form"] = "<form class=\"fmx panel\" novalidate>\n  <div class=\"fmx-h\"><b>New project brief</b><button type=\"button\" class=\"pill line sm fmx-ai\">{spark}Draft with agent</button></div>\n  <label class=\"fmx-f\"><span>Project name<i class=\"fmx-dr\" role=\"img\" aria-label=\"Drafted by the agent\" data-tip=\"Drafted by the agent\">{spark}</i></span><input name=\"n\" placeholder=\"Pricing refresh\" maxlength=\"40\"><em class=\"fmx-c num\">0/40</em></label>\n  <label class=\"fmx-f\"><span>Goal<i class=\"fmx-dr\" role=\"img\" aria-label=\"Drafted by the agent\" data-tip=\"Drafted by the agent\">{spark}</i></span><textarea name=\"g\" rows=\"2\" placeholder=\"What should change, and why?\"></textarea></label>\n  <div class=\"fmx-f\"><span>Type</span><div class=\"fmx-ty\"><button type=\"button\" class=\"chip sm\" data-v=\"web\" data-tone=\"b\">Website</button><button type=\"button\" class=\"chip sm\" data-v=\"app\" data-tone=\"l\">App</button><button type=\"button\" class=\"chip sm\" data-v=\"brand\" data-tone=\"p\">Brand</button></div></div>\n  <label class=\"fmx-f\"><span>Due<i class=\"fmx-dr\" role=\"img\" aria-label=\"Drafted by the agent\" data-tip=\"Drafted by the agent\">{spark}</i></span><input name=\"d\" type=\"text\" placeholder=\"Nov 14\"></label>\n  <div class=\"fmx-ft\"><span class=\"fmx-ms muted\"></span><button class=\"pill primary sm fmx-go\" type=\"submit\">Create brief</button></div>\n</form>";

/* ---------- Form ---------- */
DM.def('form', (r, c) => {
  r.innerHTML = r.innerHTML.split('{spark}').join(I('spark','xs'));
  const form = $('.fmx', r), n = $('[name=n]', r), g = $('[name=g]', r), d = $('[name=d]', r), cnt = $('.fmx-c', r), ms = $('.fmx-ms', r);
  // the card grows with its messages and eases to the confirmation's height, keeping no room for either
  c.offs.push(grow(form));
  // a button whose words change eases to their width, with no room kept for the longer ones
  const label = (b, h) => { const w0 = b.offsetWidth; b.innerHTML = h; const w1 = b.offsetWidth, cs = getComputedStyle(form);
    if (!REDUCE && w0 && Math.abs(w1 - w0) > .5) b.animate([{ width:w0 + 'px' }, { width:w1 + 'px' }], { duration:(parseFloat(cs.getPropertyValue('--t')) || .34) * 1000, easing:cs.getPropertyValue('--ease').trim() || 'ease' }); };
  let type = null;
  n.oninput = () => { cnt.textContent = n.value.length + '/40'; clear(n); };
  g.oninput = () => clear(g); d.oninput = () => clear(d);
  const chips = $$('.fmx-ty .chip', r);
  chips.forEach(ch => ch.onclick = () => { type = ch.dataset.v; chips.forEach(x => x.classList.toggle('on', x === ch)); clear(ch.parentElement); });
  function clear(el){ const f = el.closest('.fmx-f'); f.classList.remove('bad', 'ai'); $('.er', f)?.remove(); }
  function bad(el, t){ const f = el.closest('.fmx-f'); if (f.classList.contains('bad')) return; f.classList.add('bad'); f.insertAdjacentHTML('beforeend', `<span class="er">${t}</span>`); }
  async function type_(el, s){ el.closest('.fmx-f').classList.add('ai'); el.value = ''; for (const ch of s){ el.value += ch; el.dispatchEvent(new Event('input')); el.closest('.fmx-f').classList.add('ai'); await c.wait(18); } }
  // the agent's draft: the button says Drafting with the highlight sweep while it types, then goes back to Draft with agent;
  // each field it filled shows its sparkle, and the foot line says it once in words
  let drafting = false;
  $('.fmx-ai', r).onclick = () => { if (drafting) return; drafting = true; c.run(async () => {
    const b = $('.fmx-ai', r); label(b, '<span class="think on"><i></i><i></i><i></i><i></i></span><span class="shim">Drafting</span>');
    if (!n.value) await type_(n, 'Pricing refresh');
    await type_(g, 'Lift trial to paid by showing annual plans first and keeping one CTA per card.');
    if (!type) chips[0].click();
    if (!d.value) await type_(d, 'Nov 14');
    label(b, I('spark','xs') + 'Draft with agent'); swap(ms, 'Review what the agent drafted'); drafting = false;
  }); };
  // the preview has the agent fill it in once on its own, unless you take over first. The agent's typing keeps going under the
  // pointer (DM.PLAYS); the press that starts it waits while a mouse rests on the card
  c.auto(1400, function go(){ if (c.mine) return; if (r.matches(':hover')) return c.later(250, go); if (!n.value) $('.fmx-ai', r).click(); });
  let sent = false;
  form.onsubmit = e => { e.preventDefault(); let ok = true;
    if (!n.value.trim()){ bad(n, 'Give it a name'); ok = false; }
    if (g.value.trim().length < 12){ bad(g, 'Add a sentence about the goal'); ok = false; }
    if (!type){ bad(chips[0], 'Pick a type'); ok = false; }
    if (!ok) return swap(ms, 'A few fields need a look');
    if (sent) return; sent = true;
    c.run(async () => { const go = $('.fmx-go', r); label(go, '<span class="spin"></span><span class="shim">Creating</span>'); await c.wait(800);
      // the fields give way to the confirmation, and the card eases to its height
      const into = $(':scope>.dm-grow', form) || form;
      [...into.children].forEach(k => k.hidden = true); const dn = html(`<div class="fmx-done" role="status">${I('ok')}<b>${n.value} created</b><span class="muted">The agent is gathering references now</span></div>`); into.appendChild(dn); stagger([...dn.children], 70); }); };
});