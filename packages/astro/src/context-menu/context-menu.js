// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, hold, html, release, swap } from '../core/core.js';
DM.def('context-menu', (r, c) => {
  const ICON = { spark:'spark', copy:'copy', quote:'quote', pin:'pin', 'chev-r':'chev-r', bell:'bell', check:'check', trash:'trash', info:'info', list:'list', edit:'edit' };
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)\}/g, (m, k) => ICON[k] ? I(ICON[k], k === 'chev-r' || k === 'check' ? 'xs' : 's') : m);
  const root = $('.cxm', r), msg = $('.cxm-msg', r), tx = $('.cxm-tx', r), out = $('.cxm-out', r), note = $('.cxm-note', r);
  const pop = $('.cxm-pop', r), sub = $('.cxm-pop2', r), subRow = $('.cxm-sub', r), del = $('.cxm-del', r);
  const items = m => $$('.mi', m);
  let open = false, subOpen = false, opener = null, openedAt = 0;
  // where a menu goes: at the point, turned back from the right and bottom edges so it stays on screen and inside the card
  const fit = (m, x, y, { left } = {}) => {
    const rb = root.getBoundingClientRect(), card = (root.closest('.card,.comp,[data-c]') || document.body).getBoundingClientRect();
    const lo = Math.max(card.left, 0) + 8 - rb.left, hi = Math.min(card.right, innerWidth) - 8 - rb.left, w = m.offsetWidth, h = m.offsetHeight;
    if (x + w > hi && left != null) x = left - w; else if (x + w > hi) x = x - w;
    x = Math.max(lo, Math.min(x, hi - w));
    // near the foot of the screen it opens upward, but only where it fits over the component, so it never covers what is above
    const up = rb.top + y + h > innerHeight - 8 && y - h >= 0 && rb.top + y - h > 8; if (up) y -= h;
    m.style.left = x + 'px'; m.style.top = y + 'px'; m.style.setProperty('--dm-origin', (up ? 'bottom ' : 'top ') + 'left');
  };
  const show = (m, on) => { m.classList.toggle('open', on); m.inert = !on; };
  function openAt(x, y, keyed){
    closeSub(); del.classList.remove('ask'); $('.t', del).textContent = 'Delete reply';
    open = true; openedAt = performance.now(); opener = document.activeElement; msg.classList.add('on'); show(pop, true); fit(pop, x, y);
    // opened by a person, the menu takes the focus on its first item; the demo leaves the focus where it is
    if (keyed) items(pop)[0].focus({ preventScroll:true });
  }
  function close(back){ if (!open) return; back = back && (pop.contains(document.activeElement) || sub.contains(document.activeElement)); open = false; closeSub(); show(pop, false); msg.classList.remove('on'); if (back) msg.focus({ preventScroll:true }); }
  // the submenu opens beside its row, on the right or else the left; where neither side has room (a phone) it drops under the row
  function openSub(focus){
    subOpen = true; subRow.setAttribute('aria-expanded', 'true'); show(sub, true);
    const p = pop.getBoundingClientRect(), b = subRow.getBoundingClientRect(), rb = root.getBoundingClientRect(), card = (root.closest('.card,.comp,[data-c]') || document.body).getBoundingClientRect(), w = sub.offsetWidth;
    const lo = Math.max(card.left, 0) + 8, hi = Math.min(card.right, innerWidth) - 8;
    if (p.right - 4 + w <= hi) fit(sub, p.right - rb.left - 4, b.top - rb.top - 6);
    else if (p.left + 4 - w >= lo) fit(sub, p.left - rb.left + 4 - w, b.top - rb.top - 6);
    else fit(sub, b.left - rb.left + 24, b.bottom - rb.top + 2);
    if (focus) items(sub)[0].focus({ preventScroll:true });
  }
  function closeSub(focus){ if (!subOpen) return; subOpen = false; subRow.setAttribute('aria-expanded', 'false'); show(sub, false); if (focus) subRow.focus({ preventScroll:true }); }
  show(pop, false); show(sub, false);
  // right-click, or a long press on a touch screen
  c.on(msg, 'contextmenu', e => { e.preventDefault(); if (open && performance.now() - openedAt < 600) return; const rb = root.getBoundingClientRect(); openAt(e.clientX - rb.left, e.clientY - rb.top, e.isTrusted && !e.button && e.detail === 0 ? false : e.isTrusted); });
  let press = 0;
  c.on(msg, 'pointerdown', e => { if (e.pointerType !== 'touch') return; const rb = root.getBoundingClientRect(), x = e.clientX - rb.left, y = e.clientY - rb.top; clearTimeout(press); press = setTimeout(() => openAt(x, y, true), 500); });
  ['pointerup', 'pointercancel', 'pointermove'].forEach(t => c.on(msg, t, e => { if (t !== 'pointermove' || Math.abs(e.movementX) + Math.abs(e.movementY) > 4) clearTimeout(press); }));
  // Shift+F10 or the Menu key on the reply opens it at the reply's corner
  c.on(msg, 'keydown', e => { if ((e.key === 'F10' && e.shiftKey) || e.key === 'ContextMenu'){ e.preventDefault(); const b = msg.getBoundingClientRect(), rb = root.getBoundingClientRect(); openAt(b.left - rb.left + 16, b.top - rb.top + 36, true); } });
  // a press anywhere else closes it
  c.on(document, 'pointerdown', e => { if (open && !pop.contains(e.target) && !sub.contains(e.target)) close(); }, true);
  // the submenu opens as the pointer rests on its row, and shuts when it moves to another row
  let hov = 0;
  c.on(pop, 'pointerover', e => { const it = e.target.closest('.mi'); if (!it) return; clearTimeout(hov); if (it === subRow){ if (!subOpen) hov = setTimeout(() => openSub(), 160); } else if (subOpen) hov = setTimeout(() => closeSub(), 200); });
  // the keys: up and down wrap, Home and End, a letter jumps to the next item starting with it, Right opens the submenu and Left
  // or Escape shuts it, Escape shuts the menu and gives the focus back to the reply, Tab shuts it
  const keys = (m, inSub) => c.on(m, 'keydown', e => {
    const its = items(m), i = its.indexOf(document.activeElement), k = e.key;
    let to = null;
    if (k === 'ArrowDown') to = its[(i + 1) % its.length]; else if (k === 'ArrowUp') to = its[(i - 1 + its.length) % its.length];
    else if (k === 'Home') to = its[0]; else if (k === 'End') to = its[its.length - 1];
    else if (k === 'ArrowRight' && !inSub && document.activeElement === subRow){ e.preventDefault(); openSub(true); return; }
    else if ((k === 'ArrowLeft' || k === 'Escape') && inSub){ e.preventDefault(); e.stopPropagation(); closeSub(true); return; }
    else if (k === 'Escape'){ e.preventDefault(); e.stopPropagation(); close(true); return; }
    else if (k === 'Tab'){ close(); return; }
    else if (k.length === 1 && /\S/.test(k)){ const n = its.length, from = Math.max(i, 0); for (let j = 1; j <= n; j++){ const it = its[(from + j) % n]; if (it.textContent.trim().toLowerCase().startsWith(k.toLowerCase())){ to = it; break; } } }
    if (to){ e.preventDefault(); to.focus({ preventScroll:true }); if (!inSub && to !== subRow) closeSub(); }
  });
  keys(pop, false); keys(sub, true);
  // what each item does
  const say = t => { swap(note, t); };
  const words = t => t.split(' ').map((w, i, a) => `<span class="w" style="animation-delay:${i * 45}ms">${w}${i < a.length - 1 ? ' ' : ''}</span>`).join('');
  const ASK = {
    explain:['Explanation', 'info', 'On a phone the keyboard takes the lower half of the screen. The Continue button sits there, so people have to close the keyboard to find it, and many leave instead.'],
    sum:['Summary', 'list', 'Mobile shoppers drop at the address step because the keyboard hides Continue. Moving it up could win back about 300 orders a week.'],
    rewrite:['Shorter', 'edit', 'Mobile checkout loses people at the address step: the keyboard hides Continue. Move it up to win back about 300 orders a week.']
  };
  let asking = 0;
  const ask = k => c.run(async () => {
    const id = ++asking, [lab, ic, text] = ASK[k];
    out.innerHTML = `<div class="cxm-res"><span class="k">${I(ic,'xs')}<span class="shim">Writing a ${lab.toLowerCase()}</span></span><span class="b"></span></div>`; enter(out.firstElementChild);
    await c.wait(900); if (id !== asking) return;
    const k2 = $('.k span', out); k2.classList.remove('shim'); k2.textContent = lab;
    const b = $('.b', out), ws = text.split(' ');
    for (let i = 1; i <= ws.length; i++){ if (id !== asking) return; b.textContent = ws.slice(0, i).join(' '); await c.wait(55); }
  });
  let pinned = false;
  const act = it => {
    const a = it.dataset.a;
    if (a === 'ask'){ subOpen ? closeSub(true) : openSub(true); return; }
    if (a === 'follow'){ const on = it.getAttribute('aria-checked') !== 'true'; it.setAttribute('aria-checked', on); say(on ? 'You will hear about replies to this' : 'You will not hear about replies'); return; }
    // deleting asks again in the same row; the second press deletes, with Undo
    if (a === 'del'){
      if (!del.classList.contains('ask')){ del.classList.add('ask'); $('.t', del).textContent = 'Press again to delete'; del.setAttribute('aria-label', 'Delete reply: press again to confirm'); return; }
      close(); hold(root); const was = msg.innerHTML; msg.hidden = true;
      const g = html(`<div class="cxm-gone">Reply deleted<button class="pill ghost sm">Undo</button></div>`); root.insertBefore(g, note); enter(g); say('');
      $('button', g).onclick = () => { g.remove(); msg.hidden = false; msg.innerHTML = was; release(root); msg.focus({ preventScroll:true }); };
      return;
    }
    close(true);
    if (a === 'copy'){ try { navigator.clipboard.writeText(tx.textContent).catch(() => {}); } catch(e){} say('Copied to clipboard'); }
    if (a === 'quote') say('Quoted in your reply');
    if (a === 'pin'){ pinned = !pinned; $('.cxm-pin', r).hidden = !pinned; $('.t', $('[data-a="pin"]', pop)).textContent = pinned ? 'Unpin' : 'Pin to thread'; say(pinned ? 'Pinned to the thread' : 'Unpinned'); }
    if (ASK[a]) ask(a);
  };
  [pop, sub].forEach(m => c.on(m, 'click', e => { const it = e.target.closest('.mi'); if (it) act(it); }));
  // the preview's story: right-click the reply, ask the agent for a summary, and it streams in under the reply
  if (r === c.st) c.story(async s => {
    await s.beat(3);
    await s.point(tx); await s.beat(1);
    const h = $('.hand', c.st).getBoundingClientRect();
    tx.dispatchEvent(new MouseEvent('contextmenu', { bubbles:true, cancelable:true, clientX:h.left + 3, clientY:h.top + 2, button:2 }));
    await s.beat(2);
    await s.point(subRow, false); openSub(); await s.beat(2);
    await s.tap($('[data-a="sum"]', sub)); s.away();
    await s.until(() => !asking || ($('.b', out) && $('.b', out).textContent.length > 120)); await s.beat(6);
  });
});
