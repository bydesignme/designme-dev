// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, DM, I, enter, hideTip, html } from '../core/core.js';
DM.def('comments', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{check}', I('check','xs')).replace('{up}', I('up','xs'));
  const root = $('.cmx', r), th = $('.cmx-th', r), inp = $('.cmx-box input', r), go = $('.cmx-go', r), men = $('.cmx-men', r), st = $('.cmx-st', r), rs = $('.cmx-res', r);
  const P = { MK:['Maya Kim','var(--dm-av-l)'], JO:['Jon Ortiz','var(--dm-av-m)'], DA:['Design agent','var(--dm-av-b)'] };
  const esc = t => t.replace(/[&<>"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[ch]);
  const fmt = t => esc(t).replace(/@(agent|maya|jon)\b/gi, m => `<span class="m">${m}</span>`);
  // the first comment starts the thread; every later one is a reply, indented on a thin line under it
  let rp = null;
  const count = () => { const n = rp ? rp.children.length : 0; st.textContent = root.classList.contains('done') ? 'Resolved' : n ? n + (n === 1 ? ' reply' : ' replies') : ''; };
  function add(who, t, when, ag, agreed = 0){
    const el = html(`<div class="cmx-c${ag ? ' ag' : ''}">${AV(who, P[who][1])}<div class="b"><div class="n"><b>${P[who][0]}</b><span class="t">${when}</span><div class="cmx-tools"><button class="ib cmx-rx" aria-label="Agree" aria-pressed="false" data-tip="Agree">${I('up-thumb','xs')}</button></div></div><div class="tx">${ag ? '' : fmt(t)}</div><div class="cmx-rs"><button class="cmx-rc" aria-pressed="false" hidden>${I('up-thumb','xs')}<span class="num"></span></button></div></div></div>`);
    el._agree = { n:agreed, mine:false }; agree(el);
    $('.cmx-rx', el).onclick = () => agree(el, true); $('.cmx-rc', el).onclick = () => agree(el, true);
    if (!th.firstElementChild) th.appendChild(el);
    else { if (!rp){ rp = html('<div class="cmx-rp" role="group" aria-label="Replies"></div>'); th.appendChild(rp); } rp.appendChild(el); }
    enter(el); count(); return el;
  }
  // Agree: the button by the time and the chip under the text both toggle yours, and the chip counts everyone's
  function agree(el, flip){
    const a = el._agree; if (flip) a.mine = !a.mine;
    const n = a.n + (a.mine ? 1 : 0), b = $('.cmx-rx', el), chip = $('.cmx-rc', el), had = document.activeElement === chip;
    b.setAttribute('aria-pressed', a.mine); chip.setAttribute('aria-pressed', a.mine);
    chip.setAttribute('aria-label', 'Agree, ' + n + (n === 1 ? ' person' : ' people') + (a.mine ? ', including you' : ''));
    $('.num', chip).textContent = n; chip.hidden = !n;
    if (had && !n) b.focus({ preventScroll:true });
  }
  add('MK', 'The secondary button feels too faint next to the CTA.', '2h', false, 1);
  add('JO', 'Agree. Can we keep it outlined though?', '1h');
  async function agent(q){
    const el = add('DA', '', 'now', true), tx = $('.tx', el); tx.innerHTML = '<span class="think on" style="color:var(--dm-accent-mark,var(--dm-accent))"><i></i><i></i><i></i><i></i></span>'; await c.wait(900); tx.innerHTML = '';
    const a = /outline|border/i.test(q + ' outlined') ? 'Kept it outlined and raised the text to #5B6472, which passes AA at 5.9 : 1. Want me to apply it to the other 2 frames?' : 'On it. I will post the change here when it is ready.';
    for (const w of a.split(' ')){ tx.insertAdjacentHTML('beforeend', `<span class="w">${w} </span>`); await c.wait(40); }
    const act = html(`<div class="act"><button class="pill primary sm">Apply to all</button><button class="pill line sm">Just this one</button></div>`); $('.b', el).appendChild(act); enter(act);
    $$('button', act).forEach((b, i) => b.onclick = () => { act.innerHTML = `<span class="cmx-rv">${I('ok','xs')}${i ? 'Applied to frame 2' : 'Applied to 3 frames'}</span>`; enter(act.firstChild); });
  }
  function send(){ const v = inp.value.trim(); if (!v) return; add('MK', v, 'now'); inp.value = ''; go.disabled = true; shut(); if (/@agent/i.test(v)) c.run(() => agent(v)); }
  const opts = [['DA','agent','Design agent'],['MK','maya','Maya Kim'],['JO','jon','Jon Ortiz']];
  // the reply box drives the list of people to mention: it is a combobox, and the highlighted row is its active option
  men.id = 'cmx-m-' + Math.random().toString(36).slice(2, 7); men.setAttribute('aria-label', 'Mention');
  inp.setAttribute('role', 'combobox'); inp.setAttribute('aria-autocomplete', 'list'); inp.setAttribute('aria-expanded', 'false'); inp.setAttribute('aria-controls', men.id);
  let hl = 0;
  const mens = () => $$('.mi', men);
  const light = k => { const all = mens(); if (!all.length){ inp.removeAttribute('aria-activedescendant'); return; } hl = (k + all.length) % all.length; all.forEach((b, j) => { b.classList.toggle('hl', j === hl); b.setAttribute('aria-selected', j === hl); }); inp.setAttribute('aria-activedescendant', all[hl].id); };
  const shut = () => { men.classList.remove('open'); inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); };
  inp.oninput = () => { go.disabled = !inp.value.trim(); const m = inp.value.match(/@(\w*)$/);
    if (m){ const list = opts.filter(o => o[1].startsWith(m[1].toLowerCase())); men.innerHTML = list.map(o => `<button class="mi" role="option" tabindex="-1" id="${men.id}-${o[1]}" data-h="${o[1]}">${AV(o[0], P[o[0]][1]).replace('class="av" style="', 'class="av" style="width:20px;height:20px;font-size:9px;')}<span>${o[2]}<span class="d">@${o[1]}</span></span></button>`).join(''); men.classList.toggle('open', list.length > 0); inp.setAttribute('aria-expanded', list.length > 0); light(0);
      $$('.mi', men).forEach(b => b.onmousedown = e => { e.preventDefault(); inp.value = inp.value.replace(/@\w*$/, '@' + b.dataset.h + ' '); shut(); go.disabled = false; inp.focus({ preventScroll:true }); }); }
    else shut(); };
  // with the mention list open, the up and down arrows move through it and wrap, Enter picks, and Escape closes it
  inp.onkeydown = e => {
    const open = men.classList.contains('open') && mens().length;
    if (open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')){ e.preventDefault(); light(hl + (e.key === 'ArrowDown' ? 1 : -1)); return; }
    if (e.key === 'Enter'){ const f = mens()[hl]; if (open && f){ f.onmousedown(e); } else send(); }
    if (e.key === 'Escape') shut(); };
  go.onclick = send;
  // Resolve fades the thread back and turns the pin green; pressed again it reopens
  rs.onclick = () => { const d = root.classList.toggle('done'); hideTip(); rs.innerHTML = I(d ? 'undo' : 'check', 'xs'); rs.setAttribute('aria-pressed', d); rs.dataset.tip = d ? 'Reopen thread' : 'Resolve thread'; count(); };
  // the preview asks the agent in the thread on its own; clicking, focusing or typing in it takes over, and what it had
  // typed goes
  c.auto(1000, () => c.run(async () => { await c.type(inp, '@agent can you keep it outlined but darker?', { ms:28, each:() => inp.oninput(), keep:true }); shut(); await c.step(300); send(); }));
});
