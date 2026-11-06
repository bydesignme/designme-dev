// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I } from '../core/core.js';
DM.def('citation-hover', (r, c) => {
  const S = [
    ['B','#4a5a8a','baymard.com','Pricing page UX benchmark','Of 64 SaaS sites tested, those leading with the annual plan saw <mark>a 12 to 20% higher trial to paid rate</mark> than monthly first layouts.','Read 4 days ago'],
    ['C','#d9480f','cxl.com','Price anchoring in plan selection','When the monthly price stayed visible with a strike through, <mark>annual selection rose by a further 9 points</mark> in the anchored group.','Read 4 days ago'],
    ['CSV','var(--dm-pm)','Drive','Q3 conversion export.csv','Rows 412 to 480: <mark>trial to paid moves from 18.6% to 26.3%</mark> between Sep 18 and Oct 17.','Your file']
  ];
  const card = $('.chx-card', r), inn = $('.chx-in', r), box = $('.chx', r), cites = $$('.chx-c', r);
  let cur = null, hideT, showT, back = false;
  /* the card exists only while a citation (or the card itself) is under the pointer */
  function show(b){
    clearTimeout(hideT); if (cur === b) return;
    const s = S[+b.dataset.i]; cur = b;
    cites.forEach(x => x.classList.toggle('on', x === b));
    inn.innerHTML = `<div class="chx-sh"><span class="fv" style="background:${s[1]}">${s[0][0]}</span><span>${s[2]}</span></div><div class="chx-t">${s[3]}</div><div class="chx-q">${s[4]}</div><div class="chx-f"><span>${s[5]}</span><a href="#" onclick="return false">Open source ${I('ext','xs')}</a></div>`;
    /* restart the entry each time, so it always rises from below in place and never slides sideways */
    card.classList.remove('show'); void card.offsetWidth;
    const br = box.getBoundingClientRect(), cr = b.getBoundingClientRect();
    const x = Math.max(0, Math.min(cr.left - br.left - 24, br.width - card.offsetWidth));
    card.style.left = x + 'px'; card.style.top = (cr.bottom - br.top + 8) + 'px';
    card.classList.add('show');
  }
  function hide(now){
    clearTimeout(hideT); clearTimeout(showT);
    const go = () => { card.classList.remove('show'); cur = null; cites.forEach(x => x.classList.remove('on')); };
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
