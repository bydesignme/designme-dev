// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, centre, swap } from '../core/core.js';
DM.def('rewrite-toolbar', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{spark}', I('spark','xs')).replace('{at}', I('wand','xs'));
  const S = [
    ['Welcome to DesignMe, a place where you and your team can work together with an agent on all of your design files in one place.', { clear:'DesignMe is where your team and an agent design together.', short:'Design with your team and an agent.', warm:'Welcome in. This is where you, your team and your agent make things together.' }],
    ['To get started you will need to connect Figma, which can be done from the settings page at any time.', { clear:'Connect Figma in Settings to get started.', short:'First, connect Figma.', warm:'Start by connecting Figma. It takes about a minute.' }],
    ['After that, the agent will be able to read your frames and suggest improvements.', { clear:'Then the agent can read your frames and suggest fixes.', short:'Then the agent reviews your frames.', warm:'Then your agent can look through your frames and help polish them.' }]
  ];
  const doc = $('.rwx-doc', r), tb = $('.rwx-tb', r), st = $('.rwx-st', r), box = $('.rwx', r);
  doc.innerHTML = S.map((s, i) => `<span class="rwx-s" data-i="${i}">${s[0]}</span>`).join(' ');
  const tbHTML = tb.innerHTML; let sel = null, busy = false;
  // shorter before a rewrite than during one, it stays centred in the room its stage keeps for it
  centre(c, box, () => box.offsetHeight);
  function place(el){
    const br = box.getBoundingClientRect(), rects = el.getClientRects(), f = rects[0];
    const w = tb.offsetWidth; let x = f.left - br.left; x = Math.max(8, Math.min(x, br.width - w - 8));
    // above the sentence, unless that would cover the header: then under its last line
    let y = f.top - br.top - tb.offsetHeight - 8; if (y < $('.rwx-h', r).getBoundingClientRect().bottom - br.top) y = rects[rects.length - 1].bottom - br.top + 8;
    tb.style.left = x + 'px'; tb.style.top = y + 'px';
  }
  // hidden, the toolbar takes no focus
  function hide(){ tb.classList.remove('show'); tb.inert = true; }
  tb.inert = true;
  function bindTb(){ $$('.rwx-b[data-k]', tb).forEach(b => b.onclick = () => rewrite(b.dataset.k)); const a = $('.rwx-b.ic', tb); if (a) a.onclick = () => rewrite('clear'); }
  function select(el){
    if (busy) return; $$('.rwx-s', doc).forEach(x => x.classList.toggle('sel', x === el)); sel = el;
    tb.classList.remove('act'); tb.innerHTML = tbHTML; bindTb(); place(el); tb.inert = false; tb.classList.add('show'); swap(st, 'Pick a rewrite');
  }
  $$('.rwx-s', doc).forEach(el => el.onclick = e => { e.stopPropagation(); if (!el.querySelector('ins')) select(el); });
  c.on(document, 'pointerdown', e => { if (!busy && !r.contains(e.target)) { hide(); $$('.rwx-s', doc).forEach(x => x.classList.remove('sel')); } });
  function rewrite(k){
    const el = sel, i = +el.dataset.i, old = S[i][0], nw = S[i][1][k]; busy = true;
    tb.classList.add('act'); tb.innerHTML = `<span class="lbl"><span class="think on"><i></i><i></i><i></i><i></i></span>Rewriting</span>`; place(el);
    c.run(async () => {
      el.innerHTML = `<del>${old}</del> <ins>${nw.split(' ').map(w => `<span class="w">${w} </span>`).join('')}</ins>`; place(el); await c.wait(350);
      for (const w of $$('ins .w', el)){ w.classList.add('on'); await c.wait(55); }
      tb.innerHTML = `<span class="lbl">${I('check','xs')}Rewritten</span><button class="rwx-b rwx-un">Undo</button><button class="pill accent sm rwx-ok">Accept</button>`; place(el);
      // keeping a shorter sentence lets the doc fit its text, with no empty room above or below it
      $('.rwx-ok', tb).onclick = () => { el.textContent = nw; S[i][0] = nw; el.classList.remove('sel'); hide(); busy = false; swap(st, 'Saved'); };
      $('.rwx-un', tb).onclick = () => { el.textContent = old; el.classList.remove('sel'); hide(); busy = false; swap(st, 'Click a sentence'); };
    });
  }
  bindTb();
  // the preview plays it once on its own after the entrance: pick a sentence, make it clearer, keep it. A click of yours takes over
  c.run(async () => {
    await c.step(1300); if (sel) return; select($$('.rwx-s', doc)[0]);
    await c.step(1200); const b = $('.rwx-b[data-k="clear"]', tb); if (busy || !b) return;
    b.classList.add('hl'); c.taken(() => b.classList.remove('hl')); await c.step(240); b.classList.remove('hl'); rewrite('clear');
    await c.step(2600); const ok = $('.rwx-ok', tb); if (!ok) return;
    ok.classList.add('hl'); c.taken(() => ok.classList.remove('hl')); await c.step(240); ok.click();
  });
});
