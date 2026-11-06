// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, hideTip, placePop } from '../core/core.js';
DM.def('profile-menu', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs')).replace('{moon}', I('moon')).replace('{keyboard}', I('keyboard')).replace('{logout}', I('logout')).replace('{x}', I('x','xs'));
  // the workspaces this account belongs to: initial, name, plan and the tint of its tile
  const WS = [['N', 'Northwind', 'Pro, 12 members', 'pb'], ['A', 'Acme Labs', 'Free, 3 members', 'pp'], ['P', 'Personal', 'Just you', 'pl']];
  const uid = Math.random().toString(36).slice(2, 7);
  const tr = $('.pfm-tr', r), pop = $('.pfm-pop', r), wsl = $('.pfm-wsl', r), th = $('.pfm-th', r), note = $('.pfm-note', r), kf = $('.pfm-kf', r), sin = $('.pfm-in', r), cur = $('.pfm-cur', r), wn = $('.pfm-wn', r);
  // the menu is named by the account it belongs to, and the workspaces by their heading
  $('.pfm-nm', r).id = 'pfm-nm-' + uid; $('.pfm-em', r).id = 'pfm-em-' + uid; $('.pfm-gl', r).id = 'pfm-gl-' + uid;
  pop.setAttribute('aria-labelledby', `pfm-nm-${uid} pfm-em-${uid}`); $('.pfm-grp', r).setAttribute('aria-labelledby', 'pfm-gl-' + uid);
  wsl.innerHTML = WS.map((w, i) => `<button class="mi" role="menuitemradio" aria-checked="${!i}" tabindex="-1" data-i="${i}"><span class="pfm-lg" data-t="${w[3]}">${w[0]}</span><span>${w[1]}<span class="d">${w[2]}</span></span><span class="ck">${I('check','xs')}</span></button>`).join('');
  const rows = $$('.mi', wsl), items = () => $$('.mi', pop);
  // the theme switch starts from the page's own theme
  const root = document.documentElement;
  let ws = 0, dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const say = t => { note.innerHTML = t ? `${I('ok','xs')}<span>${t}</span>` : ''; if (t) enter(note); };
  function paint(){
    const w = WS[ws]; cur.textContent = w[0]; cur.dataset.t = w[3];
    rows.forEach((m, i) => m.setAttribute('aria-checked', i === ws)); th.setAttribute('aria-checked', dark);
  }
  // the workspace name in the bar crossfades to the new one. Each switch replaces the one before it, so switching again
  // before the fade has finished (or straight back) still ends on the workspace you picked, never on an empty line
  let named = WS[0][1], nameT = 0;
  const setName = t => {
    clearTimeout(nameT); wn.classList.add('sw');
    if (t === named){ wn.textContent = t; wn.classList.remove('out'); return; }
    wn.classList.add('out');
    nameT = setTimeout(() => { named = t; wn.textContent = t; wn.classList.remove('out'); }, REDUCE ? 0 : 170);
  };
  c.offs.push(() => clearTimeout(nameT));
  wn.textContent = named; paint();
  // the menu opens and closes on its own rather than through the page's shared popover, so a story playing in the card
  // beside it can't close it. Closing it while the focus is inside gives the focus back to the avatar
  const isOpen = () => pop.classList.contains('open');
  // the focus is the one highlight: a row the demo's pointer left lit goes dark
  const focusItem = m => { if (!m) return; items().forEach(x => { x.tabIndex = x === m ? 0 : -1; x.classList.remove('hl'); }); m.focus({ preventScroll:true }); };
  function show(on, focus){
    if (on && !isOpen()){ hideTip(); placePop(tr, pop); }
    pop.classList.toggle('open', on); pop.inert = !on; tr.setAttribute('aria-expanded', on);
    if (on && focus){ const all = items(); focusItem(focus === 'last' ? all[all.length - 1] : all[0]); }
    if (!on){ items().forEach(x => x.classList.remove('hl')); if (pop.contains(document.activeElement)) tr.focus({ preventScroll:true }); }
  }
  show(false);
  // the menu opens over whatever sits under the bar, so the component keeps room for it below the bar: centred in a
  // stage, the open menu still ends inside it
  const room = () => { const el = $('.pfm', r); el.style.minHeight = Math.ceil($('.pfm-bar', r).offsetHeight + 6 + pop.offsetHeight) + 'px'; };
  room(); if (document.fonts) document.fonts.ready.then(() => { if (!c.dead) room(); });
  c.on(window, 'resize', room);
  // the avatar opens it with a click, Enter, Space or the down arrow, and the focus goes to the first item; the up arrow
  // opens it on the last. A story's tap opens it without moving the focus
  c.on(tr, 'click', e => show(!isOpen(), e.isTrusted && 'first'));
  c.on(tr, 'keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); show(true, e.key === 'ArrowUp' ? 'last' : 'first'); } });
  c.on(document, 'pointerdown', e => { if (isOpen() && !pop.contains(e.target) && !tr.contains(e.target)) show(false); });
  c.on(window, 'resize', e => { if (e.isTrusted) show(false); });
  // inside the menu: the arrow keys move and wrap, Home and End jump to the ends, Escape closes it, Tab leaves it
  c.on(pop, 'keydown', e => {
    const all = items(), i = all.indexOf(document.activeElement);
    const go = { ArrowDown:all[(i + 1) % all.length], ArrowUp:all[(i - 1 + all.length) % all.length], Home:all[0], End:all[all.length - 1] }[e.key];
    if (go){ e.preventDefault(); focusItem(go); }
    else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); show(false); }
    else if (e.key === 'Tab') setTimeout(() => show(false));
  });
  rows.forEach((m, i) => m.addEventListener('click', () => {
    show(false); if (i === ws) return;
    ws = i; paint(); setName(WS[ws][1]); say(`Switched to ${WS[ws][1]}`);
  }));
  // the theme is a switch: the menu stays open so the change shows where it was made
  // a real click switches the page too, through its own theme button where there is one; the preview's story only flips the
  // switch, so the page doesn't flash between themes while the demo loops
  const pageDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  th.addEventListener('click', e => {
    dark = !dark; paint(); say(`Theme set to ${dark ? 'dark' : 'light'}`);
    if (!e.isTrusted || pageDark() === dark) return;
    const btn = document.getElementById('theme-btn');
    if (btn) btn.click(); else { root.dataset.theme = dark ? 'dark' : 'light'; try { localStorage.setItem('dmui-theme', root.dataset.theme); } catch(err){} }
  });
  // and when the page's theme changes from anywhere else, the switch follows it
  const mo = new MutationObserver(() => { if (pageDark() !== dark){ dark = pageDark(); paint(); } });
  mo.observe(root, { attributes:true, attributeFilter:['data-theme'] }); c.offs.push(() => mo.disconnect());
  // Keyboard shortcuts, or ? anywhere in the component, opens the list of the keys the menu answers to
  const keys = on => { kf.classList.toggle('shut', !on); kf.inert = !on; };
  keys(false);
  $('.pfm-ky', r).addEventListener('click', () => { const had = pop.contains(document.activeElement); show(false); keys(true); if (had) $('.pfm-kx', r).focus({ preventScroll:true }); });
  $('.pfm-kx', r).onclick = () => { keys(false); tr.focus({ preventScroll:true }); };
  c.on(r, 'keydown', e => { if (e.key === '?' && !e.target.matches('input,textarea')){ e.preventDefault(); show(false); keys(kf.classList.contains('shut')); } });
  // signing out swaps the avatar for Sign in, which brings it back
  $('.pfm-out', r).addEventListener('click', () => { const had = pop.contains(document.activeElement); show(false); tr.hidden = true; sin.hidden = false; if (had) sin.focus({ preventScroll:true }); say(`Signed out of ${WS[ws][1]}`); });
  sin.onclick = () => { sin.hidden = true; tr.hidden = false; tr.focus({ preventScroll:true }); say('Signed in as Maya Kim'); };
  // the preview's story: open the menu, look over the workspaces, switch to Acme Labs, then open it again and flip the theme
  c.story(async s => {
    const hl = el => items().forEach(x => x.classList.toggle('hl', x === el));
    await s.beat(3); await s.tap(tr); await s.beat(2);
    hl(rows[2]); await s.point(rows[2]); await s.beat(2);
    hl(rows[1]); await s.point(rows[1]); await s.beat(2);
    await s.tap(rows[1]); s.away(); await s.beat(4);
    await s.tap(tr); await s.beat(2);
    hl(th); await s.tap(th); await s.beat(3);
    await s.tap(tr); s.away(); await s.beat(3);
  });
});
