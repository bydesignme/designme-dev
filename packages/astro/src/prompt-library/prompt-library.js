// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, closePops, enter, html, swap } from '../core/core.js';
DM.def('prompt-library', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chevl}', I('chev-l'));
  const PAGE = { l:'Page', o:['Pricing v4', 'Home', 'Checkout'] };
  // the studio's saved prompts. Each blank is typed in, or picked from a short list that starts on its first option
  const P = [
    { t:'Rewrite a section', p:'Rewrite {section} on {page} so it reads {tone}.', v:{ section:{ l:'Section', ph:'Like the plan cards', er:'Say which section to rewrite' }, page:PAGE, tone:{ l:'Tone', o:['clearer', 'friendlier', 'shorter'] } } },
    { t:'Summarize feedback', p:'Summarize the comments on {page} into three fixes.', v:{ page:PAGE } },
    { t:'Check the tokens', p:'Check {page} against the {library} tokens and list what drifts.', v:{ page:PAGE, library:{ l:'Library', o:['Studio UI', 'Marketing'] } } },
    { t:'Write release notes', p:"Write release notes for {version} in the studio's voice.", v:{ version:{ l:'Version', ph:'Like Pricing v4', er:'Say which version they are for' } } }
  ];
  const cap = s => s[0].toUpperCase() + s.slice(1), uid = Math.random().toString(36).slice(2, 7);
  const list = $('.plb-list', r), one = $('.plb-one', r), rows = $('.plb-rows', r), tp = $('.plb-tp', r), vars = $('.plb-vars', r), f = $('.plb-f', r), root = $('.plb', r);
  rows.innerHTML = P.map((x, i) => `<button class="plb-row" data-i="${i}"><span class="plb-ic">${I('file-text')}</span><span class="plb-rt"><b>${x.t}</b><span>${x.p}</span></span><span class="plb-n">${Object.keys(x.v).length} ${Object.keys(x.v).length === 1 ? 'blank' : 'blanks'}</span>${I('chev-r','xs')}</button>`).join('');
  let cur = null, vals = {}, bad = new Set(), done = null;
  // the prompt as it reads now: filled blanks in the accent colour, empty ones by name, and red once they were needed
  const fill = () => { tp.innerHTML = cur.p.replace(/\{(\w+)\}/g, (m, k) => `<span class="plb-s${vals[k] ? '' : ' empty'}${bad.has(k) ? ' bad' : ''}">${vals[k] || cur.v[k].l.toLowerCase()}</span>`); };
  const err = (k, on) => { const fd = $(`.plb-fd[data-k="${k}"]`, vars), e = $('.plb-er', fd); fd.classList.toggle('bad', on); e.hidden = !on; e.textContent = on ? cur.v[k].er : ''; $('.plb-in', fd).setAttribute('aria-invalid', on); if (on) bad.add(k); else bad.delete(k); };
  function open(i){
    cur = P[i]; vals = {}; bad = new Set(); undo();
    $('.plb-tt', r).textContent = cur.t; $('.plb-vn', r).textContent = `${Object.keys(cur.v).length} ${Object.keys(cur.v).length === 1 ? 'blank' : 'blanks'}`;
    $$('.plb-pop', r).forEach(p => p.remove());
    const keys = Object.keys(cur.v), typed = keys.filter(k => !cur.v[k].o), picked = keys.filter(k => cur.v[k].o);
    // typed blanks take the full width; picked ones sit two to a row, and an odd one out takes the row. The blanks sit at
    // the foot of the card, so their lists open upward over the prompt instead of past the footer
    vars.innerHTML = [...typed, ...picked].map(k => { const v = cur.v[k], wide = !v.o || (picked.length % 2 && k === picked[picked.length - 1]);
      if (!v.o) return `<label class="plb-fd wide" data-k="${k}"><span>${v.l}</span><input class="plb-in" placeholder="${v.ph}" aria-describedby="plb-e-${k}-${uid}"><span class="plb-er" id="plb-e-${k}-${uid}" hidden></span></label>`;
      vals[k] = v.o[0];
      return `<div class="plb-fd${wide ? ' wide' : ''}" data-k="${k}"><span id="plb-l-${k}-${uid}">${v.l}</span><button class="plb-sel" aria-haspopup="menu" aria-expanded="false" aria-labelledby="plb-l-${k}-${uid} plb-v-${k}-${uid}" data-pop=".plb-pop-${k}" data-pop-pos="up"><span class="v" id="plb-v-${k}-${uid}">${cap(v.o[0])}</span>${I('chev-d','xs')}</button></div>`; }).join('');
    picked.forEach(k => {
      const pop = html(`<div class="pop plb-pop plb-pop-${k}" role="menu" aria-label="${cur.v[k].l}">${cur.v[k].o.map((o, n) => `<button class="mi" role="menuitemradio" aria-checked="${!n}" data-close data-o="${o}"><span>${cap(o)}</span><span class="ck">${I('check','xs')}</span></button>`).join('')}</div>`);
      root.appendChild(pop);
      $$('.mi', pop).forEach(m => m.addEventListener('click', () => { vals[k] = m.dataset.o; $$('.mi', pop).forEach(x => x.setAttribute('aria-checked', x === m)); swap($(`#plb-v-${k}-${uid}`, vars), cap(m.dataset.o)); fill(); }));
    });
    $$('.plb-in', vars).forEach(inp => inp.addEventListener('input', () => { const k = inp.closest('.plb-fd').dataset.k; vals[k] = inp.value.trim(); if (vals[k] && bad.has(k)) err(k, false); fill(); }));
    fill(); list.hidden = true; one.hidden = false; enter(one);
  }
  function undo(){ if (done){ done.remove(); done = null; } f.hidden = false; one.classList.remove('used'); vars.inert = false; }
  $$('.plb-row', rows).forEach(b => b.onclick = () => open(+b.dataset.i));
  $('.plb-back', r).onclick = () => { closePops(); one.hidden = true; list.hidden = false; enter(list); };
  // a prompt can't be used with a blank left empty: the blank says what it needs
  $('.plb-use', r).onclick = () => {
    const empty = Object.keys(cur.v).filter(k => !vals[k]);
    if (empty.length){ empty.forEach(k => err(k, true)); fill(); return; }
    f.hidden = true; one.classList.add('used'); vars.inert = true;
    done = html(`<div class="plb-done">${I('ok')}<span class="t">Added to your message<span class="muted">Ready to send to the agent</span></span><button class="pill sm">Undo</button></div>`);
    one.appendChild(done); enter(done); $('button', done).onclick = undo;
  };
  // the preview's story: open a prompt, try to use it with a blank empty, fill it in, pick a tone, then use it
  c.story(async s => {
    await s.beat(3); await s.tap($('.plb-row', rows)); s.away();
    await s.beat(3); await s.tap($('.plb-use', r)); s.away();
    await s.beat(4);
    const inp = $('.plb-in', vars); await s.point(inp, false);
    await s.type(inp, 'the plan cards', { n:.14, each:() => inp.dispatchEvent(new Event('input')) });
    await s.beat(1); s.away(); await s.beat(1);
    await s.tap($('.plb-sel', $('.plb-fd[data-k="tone"]', vars))); await s.beat(2);
    await s.tap($('.plb-pop-tone .mi[data-o="friendlier"]', r)); s.away(); await s.beat(3);
    await s.tap($('.plb-use', r)); s.away(); await s.beat(3);
  });
});
