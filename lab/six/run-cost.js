/* Run cost in Soft refreshed and Clean: the motion and the extras laid over the real component (its own markup, copy and
   run: it starts by itself, climbs to the 90% cap, and Raise cap carries on to the budget).
   Both styles add a bar to each row for its share of this run's spend (a hover gives the credits), and change the status
   chip and the button in place: the width eases to the new words (240ms) and the words fade in as it gets there.
   Soft refreshed follows the corrected Soft motion (owner, 17 Nov): the card arrives whole (8px, .985, 520ms), its pieces
   follow 50ms apart, the budget line draws in from its middle, and the only springs are the press and the cap switch's
   stretching knob (motion.js). No blur, no filters, nothing clipped.
   Clean (the calm Access Grid moves): the card rises 8px from .98, its parts 40ms apart; quiet width changes. Lab only. */
(() => {
const L = LAB;
// what each row costs in credits, to split the spend into shares (a lab assumption: an output token costs four input
// tokens, a tool call about 1,200 input tokens)
const RATE = [0.001, 0.004, 1.2];

function shares(f, root){
  const rows = [...root.querySelectorAll('.rc-rows>div')]; if (!rows.length) return;
  rows.forEach(r => { if (r.querySelector('.six-rb')) return; const b = f.contentDocument.createElement('span'); b.className = 'six-rb'; b.setAttribute('aria-hidden', 'true'); b.innerHTML = '<i></i>'; r.insertBefore(b, r.lastElementChild); });
  const num = s => +((root.querySelector(s) || {}).textContent || '0').replace(/,/g, '') || 0;
  const paint = () => {
    const used = num('.rc-n'), w = [num('.rc-in') * RATE[0], num('.rc-out') * RATE[1], num('.rc-tools') * RATE[2]], all = w.reduce((a, b) => a + b, 0);
    rows.forEach((r, i) => { const s = all ? w[i] / all : 0;
      r.querySelector('.six-rb i').style.width = (s * 100).toFixed(1) + '%';
      r.dataset.tip = all ? `About ${Math.round(used * s).toLocaleString('en-US')} credits, ${Math.round(s * 100)}% of this run` : 'Nothing spent yet'; });
  };
  const mo = new f.contentWindow.MutationObserver(paint);
  ['.rc-n', '.rc-in', '.rc-out', '.rc-tools'].forEach(s => { const el = root.querySelector(s); if (el) mo.observe(el, { childList:true, characterData:true, subtree:true }); });
  paint();
}
// the status chip and the button keep their old width for a moment and ease to the new one as their words change
function morphs(f, root){
  [['.rc-st', '.rc-stt'], ['.rc-go', '.rc-gl']].forEach(([box, txt]) => {
    const el = root.querySelector(box), words = () => root.querySelector(txt); if (!el || !words()) return;
    let w = el.getBoundingClientRect().width, said = words().textContent;
    new f.contentWindow.MutationObserver(() => { const t = words(); if (!t || t.textContent === said) return; said = t.textContent;
      const w0 = w; w = el.getBoundingClientRect().width; if (f._s.quiet) return;
      L.morphW(f, el, w0, { d:240 });
      // longer words wait until the width is nearly there, so they are never seen cut off; shorter ones fade up at once
      L.A(f, t, [{ opacity:0, transform:'translateY(4px)' }, { opacity:1, transform:'none' }], { d:220, delay:w > w0 + 1 ? 120 : 0 }); })
      .observe(el, { childList:true, characterData:true, subtree:true });
  });
}

L.def('run-cost', {
  mounted(f, root){ shares(f, root); morphs(f, root); },
  enter(f, root, k){
    const h = root.querySelector('.rc-h'), big = root.querySelector('.rc-big'), trk = root.querySelector('.rc-track'), cap = root.querySelector('.rc-cap');
    const rows = [...root.querySelectorAll('.rc-rows>div')], foot = root.querySelector('.rc-f'), soft = k === 'new';
    L.whole(f, root, 0);
    [h, big, trk, ...rows, foot].filter(Boolean).forEach((x, i) => L.piece(f, x, (soft ? 60 : 80) + i * (soft ? 45 : 40)));
    // the budget line draws in from its middle once the track is in place (a 2px line, nothing around it hidden)
    if (cap) L.A(f, cap, soft ? [{ transform:'scaleY(0)' }, { transform:'none' }] : [{ opacity:0 }, { opacity:1 }], { d:soft ? 360 : 300, delay:soft ? 340 : 320 });
  }
});
})();
