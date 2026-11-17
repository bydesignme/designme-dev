/* Context meter in Soft refreshed and Clean: the motion and the extras laid over the real component (its own markup,
   copy and story: it points at what fills the context, new tool output pushes it past 85%, Compact frees room).
   Soft refreshed follows the corrected Soft motion (owner, 17 Nov): the meter arrives whole (8px, .985, 520ms) and the
   panel's pieces follow 50ms apart; the ring fills while the percentage counts, and the bar fills from its start through
   its parts while every number counts, on one ease, all within about 800ms. A hovered part lifts 2px and a readout fades
   up on the head's line, gliding from part to part; past 85% a warning chip widens in place inside the pill and its words
   fade up once it is there. The panel opens and shuts from the pill's corner (.96 and a fade, 180ms in, 130ms out).
   No blur, no filters, nothing clipped while it grows.
   Clean (the calm Access Grid moves): the same story, crisper: 8px and .98, pieces 40ms apart, quiet fades. Lab only. */
(() => {
const L = LAB;
const kfmt = x => x.toFixed(1) + 'k';

// the readout for a part of the bar: the part's name, its tokens and its share of the 200k. It glides from part to part
function readout(f, root, k){
  const d = f.contentDocument, pop = root.querySelector('.ctm-pop'), bar = root.querySelector('.ctm-bar'), leg = root.querySelector('.ctm-leg');
  if (!pop || !bar) return;
  const ro = d.createElement('div'); ro.className = 'six-ro'; ro.setAttribute('aria-hidden', 'true'); pop.appendChild(ro);
  let cur = null;
  const show = seg => {
    if (seg === cur) return; const was = cur; cur = seg;
    bar.classList.toggle('hl', !!seg); bar.querySelectorAll('i').forEach(i => i.classList.toggle('on', i === seg));
    pop.classList.toggle('six-ro-on', !!seg);
    if (!seg){ ro.classList.remove('on'); return; }
    const l = leg.querySelector(`.ctm-l[data-k="${seg.dataset.k}"]`), v = l ? l.querySelector('.v').textContent : '';
    const name = l ? [...l.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim() : '';
    ro.innerHTML = `<b>${name}</b><span>${v}, ${Math.round(parseFloat(v) / 200 * 100)}%</span>`;
    // it takes the head's line (the head steps back while it shows), centred over the part where there is room
    const ph = pop.querySelector('.ctm-ph'), pb = pop.getBoundingClientRect(), sb = seg.getBoundingClientRect(), hb = ph.getBoundingClientRect();
    const w = ro.offsetWidth, x = Math.max(8, Math.min(pb.width - w - 8, sb.left - pb.left + sb.width / 2 - w / 2));
    ro.style.left = x + 'px'; ro.style.top = (hb.top - pb.top + (hb.height - ro.offsetHeight) / 2) + 'px';
    // a first show places it where it is going and fades it in; after that it glides (its left only moves while shown)
    if (!was) getComputedStyle(ro).left;
    ro.classList.add('on');
  };
  // the bar is 8 to 10px tall, so it answers the pointer 8px above and below it too (its ::after), and a part is found by x
  const at = e => [...bar.querySelectorAll('i')].find(i => { const r = i.getBoundingClientRect(); return r.width > 0 && e.clientX >= r.left - 2 && e.clientX <= r.right + 2; }) || null;
  bar.addEventListener('pointermove', e => show(at(e)));
  bar.addEventListener('pointerleave', () => show(null));
}

// past 85%, a warning chip widens in place inside the pill (the pill follows it) and its words fade up once it is there
function chip(f, root, k){
  const d = f.contentDocument, tg = root.querySelector('.ctm-tg'); if (!tg) return;
  let el = null;
  const sync = () => {
    const hot = root.classList.contains('hot');
    if (hot && !el){
      // the chip widens in place (its own small width, the pill following it), empty; its words fade up once it is there
      el = d.createElement('span'); el.className = 'six-chip'; el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<span><i></i>Near limit</span>'; tg.insertBefore(el, tg.lastElementChild);
      const w = el.getBoundingClientRect().width, D = k === 'new' ? 260 : 240;
      L.A(f, el, [{ width:'0px', marginLeft:'-8px', opacity:0 }, { width:w + 'px', marginLeft:'0px', opacity:1 }], { d:D });
      L.A(f, el.firstChild, [{ opacity:0, transform:'translateY(4px)' }, { opacity:1, transform:'none' }], { d:240, delay:Math.round(D * .65) });
    } else if (!hot && el){
      // the words fade first, then the empty chip narrows away
      const gone = el; el = null; const w = gone.getBoundingClientRect().width;
      L.A(f, gone.firstChild, [{ opacity:1 }, { opacity:0 }], { d:130, fill:'forwards' });
      const a = L.A(f, gone, [{ width:w + 'px', marginLeft:'0px', opacity:1 }, { width:'0px', marginLeft:'-8px', opacity:0 }], { d:260, delay:110, fill:'both' });
      if (a) L.at(f, 400, () => gone.remove()); else gone.remove();
    }
  };
  new f.contentWindow.MutationObserver(sync).observe(root, { attributes:true, attributeFilter:['class'] });
  sync();
}

L.def('context-meter', {
  only:'.stage-in>.ctm{min-height:0!important}',
  mounted(f, root, k){ readout(f, root, k); chip(f, root, k); },
  enter(f, root, k){
    const tg = root.querySelector('.ctm-tg'), pop = root.querySelector('.ctm-pop'); if (!tg || !pop) return;
    const arc = tg.querySelector('.ctm-ring .fl'), pc = tg.querySelector('.ctm-pc');
    const ph = pop.querySelector('.ctm-ph'), tot = pop.querySelector('.ctm-tot'), bar = pop.querySelector('.ctm-bar'), segs = [...bar.querySelectorAll('i')];
    const rows = [...pop.querySelectorAll('.ctm-l')], foot = pop.querySelector('.ctm-f');
    const pct = parseInt(pc.textContent) || 0, total = parseFloat(tot.textContent) || 0, dash = arc.style.strokeDasharray || pct + ' 100';
    const vals = rows.map(r => parseFloat(r.querySelector('.v').textContent) || 0);
    const soft = k === 'new', step = 40, e = L.EASE[k], D = soft ? 760 : 820, t0 = soft ? 100 : 140;
    // the meter arrives whole, the pill and the panel together; the panel's pieces follow on a gentle cascade
    L.whole(f, root, 0);
    [ph, bar, ...rows, foot].filter(Boolean).forEach((x, i) => L.piece(f, x, (soft ? 60 : 120) + i * step));
    // the ring fills while the percentage counts; the bar fills from its start while every number counts, on one ease
    L.A(f, arc, [{ strokeDasharray:'0 100' }, { strokeDasharray:dash }], { d:D, delay:t0, e });
    L.count(f, pc, { from:0, to:pct, fmt:x => Math.round(x) + '%', delay:t0, d:D, e });
    L.fillParts(f, segs, parseFloat(getComputedStyle(bar).columnGap) || 0, { d:D, delay:t0 + 40, e });
    L.count(f, tot, { from:0, to:total, fmt:kfmt, delay:t0 + 40, d:D, e });
    rows.forEach((r, i) => L.count(f, r.querySelector('.v'), { from:0, to:vals[i], fmt:kfmt, delay:t0 + 40, d:D, e }));
  }
});
})();
