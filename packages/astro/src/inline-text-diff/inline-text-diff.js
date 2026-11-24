// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, giveBack, grow, popRoom, swap } from '../core/core.js';
DM.def('inline-text-diff', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chk}', I('check','xs')).replace('{x}', I('x','xs'));
  // the copy, and the agent's edits to it: what it said, what the agent suggests, and why, when the agent isn't sure
  const T = [{ o:'Pick', n:'Choose' }, ' a plan that ', { o:'fits your team', n:'grows with your studio' }, '. Every plan ', { o:'includes', n:'comes with' }, ' unlimited projects, and ', { o:'you can cancel at any time', n:'your first month is free', why:'Not in the pricing brief: there is no free month' }, '.'];
  const E = T.filter(x => typeof x === 'object');
  const root = $('.itd', r), tx = $('.itd-t', r), st = $('.itd-st', r), bar = $('.itd-bar', r), why = $('.itd-why', r), f = $('.itd-f', r), acts = $('.itd-a', r), acc = $('.itd-acc', r), rej = $('.itd-rej', r);
  // no room is kept for the end: the card eases shorter as edits fold into the text, and grows for the note at the end.
  // grow() starts once the card's entrance (which scales it from .98 in Clean) has ended, so it measures its real size
  Promise.resolve().then(() => Promise.all(root.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && root.isConnected) c.offs.push(grow(root)); });
  tx.innerHTML = T.map(x => typeof x === 'string' ? x : `<span class="itd-c${x.why ? ' unsure' : ''}" role="button" tabindex="0" aria-haspopup="dialog" aria-expanded="false"><del>${x.o}</del><ins>${x.n}</ins></span>`).join('');
  const chunks = $$('.itd-c', tx);
  E.forEach((e, i) => { e.s = ''; chunks[i].setAttribute('aria-label', `Edit ${i + 1} of ${E.length}: ${e.o}, suggested ${e.n}`); });
  let cur = -1;
  function tally(){
    const n = E.filter(e => !e.s).length, a = E.filter(e => e.s === 'acc').length;
    swap(st, n === E.length ? `${n} edits to review` : n ? `${n} of ${E.length} left` : `${a} accepted, ${E.length - a} rejected`);
    // the note comes in a beat after the card starts to grow for it, so it never shows past the card's edge
    if (!n && !f.textContent){ acts.hidden = true; f.innerHTML = `${I('ok','xs')}<span>Saved to Pricing v4</span>`; enter(f, 220); }
  }
  const close = () => { bar.classList.remove('open'); bar.inert = true; chunks.forEach(x => { x.classList.remove('on'); x.setAttribute('aria-expanded', false); }); cur = -1; };
  // the toolbar opens under the edit's last line, or over its first when the stage or the page has no room below it;
  // inside a scaled preview the offsets are divided by its scale
  function open(i){
    cur = i; const el = chunks[i], e = E[i];
    chunks.forEach((x, k) => { x.classList.toggle('on', k === i); x.setAttribute('aria-expanded', k === i); });
    why.hidden = !e.why; $('span', why).textContent = e.why || '';
    // an edit the agent isn't sure of: the toolbar is a warning notice, and Reject, which settles it, is .pill.warn
    bar.classList.toggle('unsure', !!e.why);
    acc.className = 'pill sm itd-acc ' + (e.why ? 'line' : 'primary'); rej.className = 'pill sm itd-rej ' + (e.why ? 'warn' : 'ghost');
    const rb = root.getBoundingClientRect(), k = rb.width / root.offsetWidth || 1, rs = el.getClientRects(), cr = rs[rs.length - 1] || el.getBoundingClientRect(), c0 = rs[0] || cr;
    const room = popRoom(el), up = cr.bottom + 6 + bar.offsetHeight * k > room.bottom - 8 && c0.top - 6 - bar.offsetHeight * k >= room.top + 8;
    bar.inert = false; bar.classList.toggle('up', up); void bar.offsetWidth; bar.classList.add('open');
    bar.style.left = Math.max(12, Math.min(((up ? c0 : cr).left - rb.left) / k, root.offsetWidth - bar.offsetWidth - 12)) + 'px';
    bar.style.top = (up ? (c0.top - rb.top) / k - 6 - bar.offsetHeight : (cr.bottom - rb.top) / k + 6) + 'px';
  }
  // each decision folds an edit into plain text, and the last swaps the actions for a short note; the card eases to fit
  function decide(i, s){ E[i].s = s; chunks[i].classList.remove('acc', 'rej'); chunks[i].classList.add(s); tally(); }
  // a click anywhere else on the page can close the toolbar between the story's taps, and then there is no edit to decide
  // the focus goes back to the edit, with a ring only when the answer came from the keyboard (a click never leaves one)
  const pick = s => { const i = cur; if (i < 0) return; const back = bar.contains(document.activeElement); close(); decide(i, s); if (back) giveBack(chunks[i]); };
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
