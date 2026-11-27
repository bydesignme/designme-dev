TPLS["context-menu"] = "<div class=\"cxm\">\n  <div class=\"cxm-msg panel\" tabindex=\"0\" aria-haspopup=\"menu\" aria-label=\"Agent reply. Press Shift+F10 for actions\">\n    <div class=\"cxm-hd\"><span class=\"cxm-av\"><svg class=\"i s\"><use href=\"#v2i-spark\"/></svg></span><span class=\"cxm-ht\"><b>Agent</b><span class=\"muted num\">2:14 pm</span></span><span class=\"cxm-ok\" hidden></span><span class=\"cxm-pin\" hidden><svg class=\"i s\"><use href=\"#v2i-pin\"/></svg>Pinned</span></div>\n    <p class=\"cxm-tx\">Most of the checkout drop-off is on mobile. 61% of the people who leave do it at the address step, where the keyboard covers the Continue button. Moving Continue above the keyboard should win back about 300 orders a week.</p>\n    <div class=\"cxm-out\" aria-live=\"polite\"></div>\n  </div>\n  <p class=\"cxm-note\" aria-live=\"polite\"></p>\n  <div class=\"pop cxm-pop\" role=\"menu\" aria-label=\"Reply actions\">\n    <button class=\"mi\" role=\"menuitem\" data-a=\"copy\">{copy}Copy text<span class=\"r\">⌘C</span></button>\n    <button class=\"mi\" role=\"menuitem\" data-a=\"quote\">{quote}Quote in reply<span class=\"r\">R</span></button>\n    <button class=\"mi\" role=\"menuitem\" data-a=\"pin\">{pin}<span class=\"t\">Pin to thread</span><span class=\"r\">P</span></button>\n    <div class=\"sep\" role=\"separator\"></div>\n    <button class=\"mi cxm-sub\" role=\"menuitem\" aria-haspopup=\"menu\" aria-expanded=\"false\" data-a=\"ask\">{spark}Ask the agent<span class=\"r\">{chev-r}</span></button>\n    <button class=\"mi\" role=\"menuitemcheckbox\" aria-checked=\"false\" data-a=\"follow\">{bell}Follow replies<span class=\"ck\">{check}</span></button>\n    <div class=\"sep\" role=\"separator\"></div>\n    <button class=\"mi cxm-del\" role=\"menuitem\" data-a=\"del\">{trash}<span class=\"t\">Delete reply</span><span class=\"r\">⌫</span></button>\n  </div>\n  <div class=\"pop cxm-pop2\" role=\"menu\" aria-label=\"Ask the agent\">\n    <button class=\"mi\" role=\"menuitem\" data-a=\"explain\">{info}Explain</button>\n    <button class=\"mi\" role=\"menuitem\" data-a=\"sum\">{list}Summarise</button>\n    <button class=\"mi\" role=\"menuitem\" data-a=\"rewrite\">{edit}Rewrite shorter</button>\n  </div>\n</div>";

/* ---------- Context menu ---------- */
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
    // short of room below (the screen's foot, a box that would cut it off, or the end of the demo's stage, past which it would
    // cover the card's words), it opens upward from the point; where neither way fits, it moves up just enough to end inside
    // the room, so it is never cut off
    const room = popRoom(root), st = root.closest('.stage-inner'), sr = st && st.getBoundingClientRect();
    if (sr){ room.top = Math.max(room.top, sr.top); room.bottom = Math.min(room.bottom, sr.bottom); }
    const top = room.top + 8 - rb.top, bottom = room.bottom - 8 - rb.top;
    let up = false;
    if (y + h > bottom){ if (y - h >= top){ y -= h; up = true; } else y = Math.max(top, bottom - h); }
    m.style.left = x + 'px'; m.style.top = y + 'px'; m.style.setProperty('--origin', (up ? 'bottom ' : 'top ') + 'left');
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
  // the card grows to hold what the agent writes, and shrinks to the Undo row, eased (grow()); the menus open over it
  c.offs.push(grow(root));
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
  // what each item does. What it did is said to screen readers, and shows for a moment on the reply's head line with a green
  // tick; a pin shows its own Pinned, and Ask the agent its answer
  let okT = 0;
  const say = (t, show = true) => {
    note.textContent = t || '';
    const ok = $('.cxm-ok', r); if (!ok) return;
    clearTimeout(okT);
    if (!t || !show){ ok.hidden = true; return; }
    ok.innerHTML = `${I('check','xs')}<span>${t}</span>`; ok.hidden = false; ok.classList.remove('out');
    okT = setTimeout(() => { ok.classList.add('out'); okT = setTimeout(() => { ok.hidden = true; }, 240); }, 2400);
  };
  c.offs.push(() => clearTimeout(okT));
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
    if (a === 'follow'){ const on = it.getAttribute('aria-checked') !== 'true'; it.setAttribute('aria-checked', on); say(on ? 'Following replies' : 'Not following replies'); return; }
    // deleting asks again in the same row; the second press deletes, with Undo
    if (a === 'del'){
      if (!del.classList.contains('ask')){ del.classList.add('ask'); $('.t', del).textContent = 'Press again to delete'; del.setAttribute('aria-label', 'Delete reply: press again to confirm'); return; }
      // the card shrinks to the Undo row smoothly (grow()), and Undo brings the same reply back
      close(); say(''); msg.hidden = true;
      const g = html(`<div class="cxm-gone">Reply deleted<button class="pill ghost sm">Undo</button></div>`); note.before(g); enter(g); note.textContent = 'Reply deleted';
      $('button', g).onclick = () => { g.remove(); msg.hidden = false; note.textContent = 'Reply restored'; msg.focus({ preventScroll:true }); };
      return;
    }
    close(true);
    if (a === 'copy'){ try { navigator.clipboard.writeText(tx.textContent).catch(() => {}); } catch(e){} say('Copied'); }
    if (a === 'quote') say('Quoted in your reply');
    if (a === 'pin'){ pinned = !pinned; $('.cxm-pin', r).hidden = !pinned; $('.t', $('[data-a="pin"]', pop)).textContent = pinned ? 'Unpin' : 'Pin to thread'; say(pinned ? 'Pinned to the thread' : 'Unpinned', false); }
    if (ASK[a]){ say(''); ask(a); }
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