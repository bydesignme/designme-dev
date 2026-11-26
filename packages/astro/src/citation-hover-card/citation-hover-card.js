// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, mxIn, mxOut, mxT, placePop } from '../core/core.js';
DM.def('citation-hover', (r, c) => {
  const S = [
    ['B','var(--dm-av-b)','baymard.com','Pricing page UX benchmark','Of 64 SaaS sites tested, those leading with the annual plan saw <mark>a 12 to 20% higher trial to paid rate</mark> than monthly first layouts.','Read 4 days ago'],
    ['C','var(--dm-av-r)','cxl.com','Price anchoring in plan selection','When the monthly price stayed visible with a strike through, <mark>annual selection rose by a further 9 points</mark> in the anchored group.','Read 4 days ago'],
    ['CSV','var(--dm-av-l)','Drive','Q3 conversion export.csv','Rows 412 to 480: <mark>trial to paid moves from 18.6% to 26.3%</mark> between Sep 18 and Oct 17.','Your file']
  ];
  const card = $('.chx-card', r), inn = $('.chx-in', r), box = $('.chx', r), cites = $$('.chx-c', r);
  let cur = null, hideT, showT, back = false, glide = null;
  /* it opens below its citation when it fits there and above it when it doesn't (placePop), so the stage or the page never cuts
     it off, and it stays inside the answer's column; it grows out of the citation's middle (--origin) */
  function place(b){
    placePop(b, card);
    const x = Math.max(0, Math.min(parseFloat(card.style.left) || 0, box.clientWidth - card.offsetWidth)); card.style.left = x + 'px';
    const bb = b.getBoundingClientRect(), kb = box.getBoundingClientRect(), k = kb.width / box.offsetWidth || 1;
    card.style.setProperty('--dm-origin', `${Math.round((bb.left + bb.width / 2 - kb.left) / k - x)}px ${/^bottom/.test(card.style.getPropertyValue('--dm-origin')) ? '100%' : '0'}`);
  }
  /* the card exists only while a citation (or the card itself) is under the pointer */
  function show(b){
    clearTimeout(hideT); if (cur === b) return;
    const s = S[+b.dataset.i], moving = !!cur && card.classList.contains('show') && !REDUCE; cur = b;
    cites.forEach(x => x.classList.toggle('on', x === b));
    const fill = () => { inn.innerHTML = `<div class="chx-sh"><span class="fv" style="background:${s[1]};color:${s[1].replace(')', '-ink)')}">${s[0][0]}</span><span>${s[2]}</span></div><div class="chx-t">${s[3]}</div><div class="chx-q">${s[4]}</div><div class="chx-f"><span>${s[5]}</span><a href="#" onclick="return false">Open source ${I('ext','xs')}</a></div>`; };
    if (glide){ glide.cancel(); glide = null; }
    /* showing: it grows out of its citation where it will sit (.mx-pop). Already showing for another citation, it moves on
       there: the old source fades out, and the card glides to its new place and eases to its new height as the new one fades in
       (owner's trial, 26 Nov) */
    if (!moving){ (inn._mx || []).forEach(a => a.cancel()); fill(); place(b); card.classList.add('show'); return; }
    const was = { left:card.offsetLeft, top:card.offsetTop, height:card.offsetHeight };
    mxOut(inn, { ms:80, y:0 }).then(() => {
      if (cur !== b) return;
      fill(); place(b);
      const cs = getComputedStyle(card), pad = cs.boxSizing === 'border-box' ? 0 : parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
      const to = { left:card.offsetLeft, top:card.offsetTop, height:card.offsetHeight }, px = o => ({ left:o.left + 'px', top:o.top + 'px', height:o.height - pad + 'px' });
      card.style.overflow = 'clip';
      const a = glide = card.animate([px(was), px(to)], { duration:mxT(card, '--dm-t-in', 360), easing:mxT(card, '--dm-ease-spring', 'ease') });
      a.onfinish = a.oncancel = () => { if (glide === a) glide = null; if (!glide) card.style.overflow = ''; };
      mxIn(inn, { y:0, step:0 });
    });
  }
  function hide(now){
    clearTimeout(hideT); clearTimeout(showT);
    const go = () => { if (glide){ glide.cancel(); glide = null; } card.classList.remove('show'); cur = null; cites.forEach(x => x.classList.remove('on')); };
    if (now) go(); else hideT = setTimeout(go, 140);
  }
  /* pointing at a citation shows its card, leaving it (and the card) hides it; focus shows it too, so the keyboard gets the
     same card. Touch has no hover: a tap shows the card, the next tap anywhere else hides it */
  const hover = e => e.pointerType !== 'touch';
  cites.forEach(b => {
    c.on(b, 'pointerenter', e => { if (!hover(e)) return; clearTimeout(showT); clearTimeout(hideT); showT = setTimeout(() => show(b), cur ? 0 : 90); });
    c.on(b, 'pointerleave', e => { if (!hover(e)) return; clearTimeout(showT); hide(); });
    c.on(b, 'focus', () => { if (back){ back = false; return; } show(b); }); c.on(b, 'blur', e => { if (!card.contains(e.relatedTarget)) hide(); });
    // Enter or Space opens the card with the focus on its link, so the keyboard can reach it; Escape brings the focus back
    c.on(b, 'click', e => { if (cur !== b) show(b); if (e.isTrusted && !e.detail){ const a = $('a', card); if (a) a.focus({ preventScroll:true }); } });
  });
  c.on(card, 'pointerenter', () => clearTimeout(hideT));
  c.on(card, 'pointerleave', e => { if (hover(e)) hide(); });
  c.on(card, 'focusout', e => { if (cur && !card.contains(e.relatedTarget) && e.relatedTarget !== cur) hide(); });
  /* Escape puts the card away while the focus or the pointer is on the answer, and leaves the focus where it was, or on its
     citation when it was in the card */
  c.on(document, 'keydown', e => { if (e.key === 'Escape' && cur && (box.contains(document.activeElement) || box.matches(':hover'))){ e.preventDefault(); const to = card.contains(document.activeElement) && cur; hide(true); if (to){ back = true; to.focus({ preventScroll:true }); } } });
  c.on(document, 'pointerdown', e => { if (!card.contains(e.target) && !e.target.closest('.chx-c')) hide(true); });
  c.on(window, 'resize', e => { if (e.isTrusted) hide(true); });
  c.offs.push(() => { clearTimeout(hideT); clearTimeout(showT); });
  // the preview shows one card on its own after the entrance, then puts it away, unless you are already pointing at a citation
  let mine = false; c.on(r, 'pointerover', e => { if (e.isTrusted) mine = true; }, true);
  c.run(async () => { await c.wait(1400); if (mine || cur) return; show(cites[0]); await c.wait(2800); if (!mine && cur === cites[0]) hide(); });
});
