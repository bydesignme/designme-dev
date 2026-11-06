// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, hold, swap } from '../core/core.js';
DM.def('inline-text-diff', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chk}', I('check','xs')).replace('{x}', I('x','xs')).replace('{warn}', I('alert','xs'));
  // the copy, and the agent's edits to it: what it said, what the agent suggests, and why, when the agent isn't sure
  const T = [{ o:'Pick', n:'Choose' }, ' a plan that ', { o:'fits your team', n:'grows with your studio' }, '. Every plan ', { o:'includes', n:'comes with' }, ' unlimited projects, and ', { o:'you can cancel at any time', n:'your first month is free', why:'Not in the pricing brief: there is no free month' }, '.'];
  const E = T.filter(x => typeof x === 'object');
  const root = $('.itd', r), tx = $('.itd-t', r), st = $('.itd-st', r), bar = $('.itd-bar', r), why = $('.itd-why', r), f = $('.itd-f', r), acts = $('.itd-a', r);
  tx.innerHTML = T.map(x => typeof x === 'string' ? x : `<span class="itd-c${x.why ? ' unsure' : ''}" role="button" tabindex="0" aria-haspopup="dialog" aria-expanded="false"><del>${x.o}</del><ins>${x.n}</ins></span>`).join('');
  const chunks = $$('.itd-c', tx);
  E.forEach((e, i) => { e.s = ''; chunks[i].setAttribute('aria-label', `Edit ${i + 1} of ${E.length}: ${e.o}, suggested ${e.n}`); });
  let cur = -1;
  function tally(){
    const n = E.filter(e => !e.s).length, a = E.filter(e => e.s === 'acc').length;
    swap(st, n === E.length ? `${n} edits to review` : n ? `${n} of ${E.length} left` : `${a} accepted, ${E.length - a} rejected`);
    if (!n && !f.textContent){ acts.hidden = true; f.innerHTML = `${I('ok','xs')}<span>Saved to Pricing v4</span>`; enter(f); }
  }
  const close = () => { bar.classList.remove('open'); bar.inert = true; chunks.forEach(x => { x.classList.remove('on'); x.setAttribute('aria-expanded', false); }); cur = -1; };
  // the toolbar opens under the edit's last line; inside a scaled preview the offsets are divided by its scale
  function open(i){
    cur = i; const el = chunks[i], e = E[i];
    chunks.forEach((x, k) => { x.classList.toggle('on', k === i); x.setAttribute('aria-expanded', k === i); });
    why.hidden = !e.why; $('span', why).textContent = e.why || '';
    const rb = root.getBoundingClientRect(), k = rb.width / root.offsetWidth || 1, rs = el.getClientRects(), cr = rs[rs.length - 1] || el.getBoundingClientRect();
    bar.inert = false; bar.classList.add('open');
    bar.style.left = Math.max(12, Math.min((cr.left - rb.left) / k, root.offsetWidth - bar.offsetWidth - 12)) + 'px';
    bar.style.top = ((cr.bottom - rb.top) / k + 6) + 'px';
  }
  // each decision folds an edit into plain text, and the last swaps the actions for a short note: from the first one the
  // card keeps the height it had with every edit open, and centres what is left in it (hold)
  function decide(i, s){ if (!root.classList.contains('held')) hold(root); E[i].s = s; chunks[i].classList.remove('acc', 'rej'); chunks[i].classList.add(s); tally(); }
  // a click anywhere else on the page can close the toolbar between the story's taps, and then there is no edit to decide
  const pick = s => { const i = cur; if (i < 0) return; const back = bar.contains(document.activeElement); close(); decide(i, s); if (back) chunks[i].focus({ preventScroll:true }); };
  // Enter or Space opens an edit's toolbar with the focus on Accept, as a dialog takes the focus; Escape brings it back
  chunks.forEach((el, i) => { el.onclick = () => cur === i ? close() : open(i); el.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); el.click(); if (cur === i) $('.itd-acc', r).focus({ preventScroll:true }); } }; });
  // the left and right arrows move between Accept and Reject
  c.on(bar, 'keydown', ev => { const bs = $$('button', bar), j = bs.indexOf(document.activeElement), d = { ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1 }[ev.key];
    if (j < 0) return; const to = d ? bs[(j + d + bs.length) % bs.length] : ev.key === 'Home' ? bs[0] : ev.key === 'End' ? bs[bs.length - 1] : null;
    if (to){ ev.preventDefault(); to.focus({ preventScroll:true }); } });
  $('.itd-acc', r).onclick = () => pick('acc');
  $('.itd-rej', r).onclick = () => pick('rej');
  $('.itd-ok', r).onclick = () => { close(); E.forEach((e, i) => { if (!e.s) decide(i, 'acc'); }); };
  $('.itd-no', r).onclick = () => { close(); E.forEach((e, i) => { if (!e.s) decide(i, 'rej'); }); };
  // Escape or a click elsewhere closes the toolbar
  c.on(r, 'keydown', ev => { if (ev.key === 'Escape' && cur >= 0){ const el = chunks[cur]; close(); el.focus({ preventScroll:true }); } });
  c.on(document, 'pointerdown', ev => { if (cur >= 0 && !bar.contains(ev.target) && !ev.target.closest('.itd-c')) close(); });
  bar.inert = true; tally();
  // the preview's story: accept two edits, read why the agent isn't sure of one and reject it, then accept the rest
  c.story(async s => {
    await s.beat(4);
    await s.tap(chunks[0]); await s.beat(2); await s.tap($('.itd-acc', r)); await s.beat(1);
    await s.tap(chunks[1]); await s.beat(2); await s.tap($('.itd-acc', r)); await s.beat(1);
    await s.tap(chunks[3]); await s.beat(5); await s.tap($('.itd-rej', r)); await s.beat(3);
    await s.tap($('.itd-ok', r)); s.away();
    await s.beat(3);
  });
});
