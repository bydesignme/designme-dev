// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, DM, I, REDUCE, enter, grow, html, swap } from '../core/core.js';
DM.def('draft-review', (r, c) => {
  const IC = { spark:I('spark'), clip:I('clip','xs'), send:I('send','xs'), chev:I('chev-d','xs'), chk:I('check','xs'), trash:I('trash','xs'), av:AV('MK','var(--dm-av-l)') };
  r.innerHTML = r.innerHTML.replace(/\{(\w+)\}/g, (m, k) => IC[k] || m);
  const root = $('.drf', r), go = $('.drf-go', r), dd = $('.drf-dd', r), att = $('.drf-att', r), wf = $('.drf-wf', r), when = $('.drf-when', r), f = $('.drf-f', r), tag = $('.drf-tag', r), body = $('.drf-b', r), fields = [$('.drf-fs', r), body, att];
  const items = $$('.drf-pop .mi', r);
  // the card fits what it holds at every moment, easing to it (grow()), once its entrance has ended so it measures the card at
  // its real size; the result row goes into grow()'s wrapper
  Promise.resolve().then(() => Promise.all(root.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && root.isConnected) c.offs.push(grow(root)); });
  const into = () => $(':scope>.dm-grow', root) || root;
  let at = 'now', file = false, done = null, run = 0;
  const label = () => (at === 'now' ? I('send','xs') + 'Send' : I('clock','xs') + 'Schedule');
  // a button whose words change is as wide as its words and eases to its new width (owner, 18 Nov)
  const relabel = (b, h) => { const w0 = b.getBoundingClientRect().width; b.innerHTML = h; const w1 = b.getBoundingClientRect().width, cs = getComputedStyle(b);
    if (!REDUCE && w0 && Math.abs(w1 - w0) > .5) b.animate([{ width:w0 + 'px' }, { width:w1 + 'px' }], { duration:(parseFloat(cs.getPropertyValue('--dm-t')) || .34) * 1000, easing:cs.getPropertyValue('--dm-ease').trim() || 'ease' }); };
  // when to send: now, or a set time from the menu beside the button
  items.forEach(m => m.addEventListener('click', () => { at = m.dataset.w; items.forEach(x => x.setAttribute('aria-checked', x === m)); relabel(go, label()); swap(when, at === 'now' ? '' : at); }));
  const warn = on => { wf.classList.toggle('shut', !on); wf.inert = !on; };
  warn(false);
  // the result of sending, scheduling or discarding takes the footer's place, with a white button to take it back
  function row(ic, t, sub, btn, fn, cls){
    f.hidden = true; root.classList.add('sent'); fields.forEach(e => e.inert = true); body.contentEditable = 'false';
    done = html(`<div class="drf-done ${cls || ''}"><span class="g">${ic}</span><span class="t">${t}<span class="muted drf-sub">${sub}</span></span>${btn ? `<button class="pill sm">${btn}</button>` : ''}</div>`);
    into().appendChild(done); enter(done); if (btn) $('button', done).onclick = fn; return done;
  }
  function back(){
    run++; if (done){ done.remove(); done = null; }
    f.hidden = false; root.classList.remove('sent'); fields.forEach(e => e.inert = false); body.contentEditable = 'true';
    go.disabled = dd.disabled = false; relabel(go, label()); swap(tag, 'Not sent'); tag.className = 'tag drf-tag';
  }
  function send(force){
    // the message talks about an attachment that isn't there: say so before it goes
    if (!force && !file && /attach/i.test(body.textContent)){ warn(true); return; }
    warn(false);
    const id = ++run;
    c.run(async () => {
      go.disabled = dd.disabled = true; relabel(go, `<span class="spin"></span>${at === 'now' ? 'Sending' : 'Scheduling'}`);
      await c.wait(900); if (id !== run) return;
      if (at !== 'now'){ row(I('clock'), `Scheduled for ${at.replace(/^\w/, ch => ch.toLowerCase())}`, 'To Maya Kim', 'Cancel', back, 'later'); swap(tag, 'Scheduled'); tag.className = 'tag b drf-tag'; return; }
      // a few seconds to take it back before it really goes
      const d = row(I('ok'), 'Sent to Maya Kim', 'You can undo for 5s', 'Undo', back), sub = $('.drf-sub', d);
      for (let k = 5; k > 0; k--){ sub.textContent = `You can undo for ${k}s`; await c.wait(1000); if (id !== run) return; }
      $('button', d).remove(); swap(sub, 'Delivered just now'); swap(tag, 'Sent'); tag.className = 'tag ok drf-tag';
    });
  }
  go.onclick = () => send(false);
  $('.drf-any', r).onclick = () => send(true);
  $('.drf-at', r).onclick = () => c.run(async () => {
    if (file) return; warn(false);
    const chip = html(`<span class="drf-file">${I('file','xs')}<span>Pricing v4 summary.pdf</span><span class="muted drf-fz"><span class="spin"></span></span></span>`);
    att.appendChild(chip); enter(chip);
    await c.wait(1200); $('.drf-fz', chip).textContent = '240 KB'; file = true;
  });
  $('.drf-x', r).onclick = () => { warn(false); row(I('trash'), 'Draft discarded', 'Nothing was sent', 'Undo', back, 'bin'); };
  // the preview's story: send, get stopped by the missing attachment, attach it, send, and let the undo window pass
  c.story(async s => {
    await s.beat(3);
    await s.point(body, false); await s.beat(3);
    await s.tap(go); s.away();
    await s.until(() => !wf.classList.contains('shut')); await s.beat(5);
    await s.tap($('.drf-at', r)); s.away();
    await s.until(() => file); await s.beat(2);
    await s.tap(go); s.away();
    await s.until(() => done && !$('button', done));
  });
});
