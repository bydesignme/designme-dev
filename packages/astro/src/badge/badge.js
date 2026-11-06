// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, centre } from '../core/core.js';
DM.def('badge', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{lock}', I('lock','xs')).replace('{spark}', I('spark','xs')).replace(/\{x\}/g, I('x','xs'));
  const set = $('.bdx-rm', r), undo = $('.bdx-undo', r), live = $('.bdx-live', r);
  // the rows sit centred in their stage whatever the badges wrap to, and glide back to the middle as a remove or Undo
  // changes a row's height
  const box = $('.bdx', r); centre(c, box, () => box.offsetHeight);
  const label = b => $('.t', b).textContent;
  // each removable badge keeps its place in the row, so Undo puts it back where it was
  $$('.bdg', set).forEach((b, i) => { b.dataset.i = i; });
  // the badges taken off, the latest last
  const gone = [];
  // a remove button first sends a cancelable badge-remove event from its badge, so your code can keep it or act on it
  function remove(b){
    if (b.classList.contains('go')) return;
    if (!b.dispatchEvent(new CustomEvent('badge-remove', { bubbles:true, cancelable:true, detail:{ label:label(b) } }))) return;
    const had = b.contains(document.activeElement), all = $$('.bdg:not(.go)', set), i = all.indexOf(b), next = all[i + 1] || all[i - 1];
    gone.push(b); live.textContent = `Removed ${label(b)}`;
    // the focus goes on to the next badge's remove button, or to Undo once none is left
    const done = () => { b.remove(); b.classList.remove('go'); undo.hidden = false; if (had) ((next && next.isConnected && $('.bdg-x', next)) || undo).focus({ preventScroll:true }); };
    if (REDUCE) done(); else { b.classList.add('go'); c.later(220, done); }
  }
  function restore(){
    const b = gone.pop(); if (!b) return;
    const had = undo === document.activeElement, after = $$('.bdg', set).find(x => +x.dataset.i > +b.dataset.i);
    set.insertBefore(b, after || undo);
    b.classList.remove('pop-in'); void b.offsetWidth; b.classList.add('pop-in');
    undo.hidden = !gone.length; live.textContent = `${label(b)} is back`;
    if (had && undo.hidden) $('.bdg-x', b).focus({ preventScroll:true });
  }
  set.addEventListener('click', e => { const x = e.target.closest('.bdg-x'); if (x) remove(x.closest('.bdg')); });
  undo.onclick = restore;
  // the preview's story: take Staging off, then put it back with Undo
  c.story(async s => {
    await s.beat(4);
    const b = $$('.bdg', set).find(x => label(x) === 'Staging'); if (!b) return;
    await s.tap($('.bdg-x', b)); s.away(); await s.beat(4);
    await s.tap(undo); s.away(); await s.beat(4);
  });
});
