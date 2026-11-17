/* Status pill in Soft refreshed and Clean: the motion laid over the real component (its own markup, copy and story).
   Soft refreshed follows the corrected Soft motion (owner, 17 Nov): the pill arrives whole (8px, .985, 520ms) and its
   pieces follow 50ms apart; a step changes in place: the old line fades up 4px, the pill eases to its new width (300ms) and
   only then do the new words rise in, so nothing shows clipped; the spinner gives way to a tick that draws in; the step
   count rolls like an odometer. No blur, no filters; the only spring is the Pill/Bar knob (motion.js).
   Clean (the calm Access Grid moves): the pill rises 8px from .98, its pieces 40ms apart; steps cross-fade 4px with a
   quiet width ease. Lab only, nothing ships from here. */
(() => {
const L = LAB;
const kind = box => { const g = box.querySelector('.g'); if (!g) return '';
  return g.querySelector('.spin') ? 'spin' : g.querySelector('svg') ? 'ok' : g.querySelector('.think') ? 'think' : g.querySelector('.radar') ? 'radar' : 'dot'; };
const parts = box => [...box.children].filter(x => !x.matches('.end'));

// a new step lands: the box faded up and out in CSS (.spl-in.out) and the pill is easing to its new width (CSS, 300ms in
// Soft refreshed); the new pieces rise in once the pill is nearly there, the mark first
function stepIn(f, box, k, from, to){
  const g = box.querySelector('.g'), soft = k === 'new', base = soft ? 60 : 60;
  parts(box).forEach((x, i) => { if (x === g) return;
    L.A(f, x, [{ opacity:0, transform:'translateY(4px)' }, { opacity:1, transform:'none' }], { d:soft ? 300 : 260, delay:base + i * 40 }); });
  if (!g) return;
  L.A(f, g, [{ opacity:0, transform:'scale(.8)' }, { opacity:1, transform:'none' }], { d:soft ? 300 : 240, delay:base });
  // the tick draws in left to right (a 14px mark, its own stroke; nothing around it is hidden)
  const sv = to === 'ok' && from !== 'ok' && g.querySelector('svg');
  if (sv) L.A(f, sv, [{ clipPath:'inset(0 100% 0 0)' }, { clipPath:'inset(0 0% 0 0)' }], { d:soft ? 380 : 300, delay:base + 60 });
}
// "1 of 4" to "2 of 4": the new count rolls up into place like an odometer
const roll = (f, n, k) => L.A(f, n, [{ opacity:0, transform:'translateY(5px)' }, { opacity:1, transform:'none' }], { d:k === 'new' ? 320 : 220 });

L.def('status-pill', {
  // a compact frame: the pill (or the bar) centred over its Pill/Bar switch
  h:176, only:'.spl.dm{min-height:0!important}',
  mounted(f, root, k){
    const box = root.querySelector('.spl-in'); if (!box) return;
    let was = kind(box);
    const mo = new f.contentWindow.MutationObserver(ms => {
      let swapped = false, back = false; const nums = new Set();
      for (const m of ms){
        if (m.target === box && m.type === 'childList'){ swapped = true; continue; }
        if (m.target === box && m.type === 'attributes'){ if ((m.oldValue || '').includes('out') && !box.classList.contains('out')) back = true; continue; }
        const el = m.target.nodeType === 1 ? m.target : m.target.parentElement, n = el && el.closest('.n'); if (n) nums.add(n);
      }
      if (swapped){ const now = kind(box); if (!f._s.quiet) stepIn(f, box, k, was, now); was = now; }
      else if (!f._s.quiet) nums.forEach(n => roll(f, n, k));
      // the Pill/Bar switch brings the same line back once the shape has changed: it fades back in, it never pops
      if (back && !swapped && !f._s.quiet) L.A(f, box, [{ opacity:0, transform:'translateY(4px)' }, { opacity:1, transform:'none' }], { d:k === 'new' ? 300 : 240 });
    });
    mo.observe(box, { childList:true, subtree:true, characterData:true, attributes:true, attributeOldValue:true, attributeFilter:['class'] });
  },
  enter(f, root, k){
    const pill = root.querySelector('.spl-pill'), box = root.querySelector('.spl-in'), demo = root.querySelector('.demo');
    if (!pill || !box) return;
    L.whole(f, pill, 0);
    parts(box).forEach((x, i) => L.piece(f, x, (k === 'new' ? 80 : 120) + i * (k === 'new' ? 50 : 40)));
    if (demo) L.piece(f, demo, k === 'new' ? 260 : 200);
  }
});
})();
