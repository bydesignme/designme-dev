// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, ctl, enter, html, swap } from '../core/core.js';
DM.def('composer', (r, c) => {
  const icons = { clip:'clip', figma:'figma', eye:'eye', edit:'edit', list:'list', code:'code', mic:'mic', up:'up', check:'check', file:'file-text', image:'image' };
  r.innerHTML = r.innerHTML.replace(/\{(\w+)\}/g, (m, k) => k === 'chev' ? I('chev-d','xs') : icons[k] ? I(icons[k]) : m);
  const box = $('.cpx-box', r), ta = $('.cpx-ta', r), send = $('.cpx-bar .cpx-send', r), thread = $('.cpx-thread', r), att = $('.cpx-att', r), PH = ta.placeholder;
  const grow = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'; };
  // send waits for text or a file, and for every file to finish loading
  const sync = () => { send.disabled = (!ta.value.trim() && !att.children.length) || !!$('.fchip.ld,.fchip.err', att); grow(); };
  c.on(ta, 'input', sync);
  c.on(r, 'keydown', e => { if (e.target === ta && e.key === 'Enter' && !e.shiftKey && box.dataset.mode === 'idle'){ e.preventDefault(); submit(); } if (e.key === 'Escape' && box.dataset.mode === 'voice') stopVoice(false, true); });
  /* attachments load before they can be sent. The first Figma link can't be opened, so the error shows, and Try again fetches it */
  const ATT = { file:['file-text','Spacing notes.pdf'], figma:['figma','Pricing / Desktop'], shot:['image','Screenshot 10.42'] };
  let figmaTries = 0;
  function load(ch, kind){
    const a = ATT[kind]; ch.className = 'fchip ld'; $('.ic', ch).innerHTML = '<span class="spin"></span>'; swap($('.n', ch), a[1]); const rt = $('.rt', ch); if (rt) rt.remove(); sync();
    const fail = kind === 'figma' && figmaTries++ === 0;
    c.later(1000, () => { if (!ch.isConnected) return;
      if (fail){ ch.className = 'fchip err'; $('.ic', ch).innerHTML = I('alert','xs'); swap($('.n', ch), a[1] + " can't be opened");
        const b = html(`<button class="rt" aria-label="Try again" data-tip="Try again">${I('refresh','xs')}</button>`); $('.x', ch).before(b); b.onclick = () => load(ch, kind); }
      else { ch.className = 'fchip'; $('.ic', ch).innerHTML = I(a[0],'xs'); enter($('.ic', ch).firstElementChild); }
      sync(); });
  }
  function add(kind){
    const a = ATT[kind], ch = html(`<span class="fchip"><span class="ic" style="display:grid"></span><span class="n">${a[1]}</span><button class="x" aria-label="Remove ${a[1]}">${I('x','xs')}</button></span>`);
    att.appendChild(ch); enter(ch);
    $('.x', ch).onclick = () => { ch.classList.add('leave'); c.later(300, () => { ch.remove(); sync(); }); };
    load(ch, kind);
  }
  $$('[data-add]', r).forEach(b => b.onclick = () => add(b.dataset.add));
  /* what the agent works on, and what it may do: a menu each, the chip shows the pick */
  const pick = (menu, chip, name, key) => $$(menu + ' .mi', r).forEach(b => b.onclick = () => {
    $$(menu + ' .mi', r).forEach(x => x.setAttribute('aria-checked', x === b));
    const ch = $(chip, r); ch.firstElementChild.outerHTML = I(b.dataset.ic); swap($(name, ch), b.dataset[key]);
  });
  pick('.pp-ctx', '.cpx-ctx', '.cpx-ctx-n', 'ctx');
  pick('.pp-mode', '.cpx-mode', '.cpx-mode-n', 'mode');
  /* dictation, played from a sample because the page can't use a microphone: a red dot and a clock, the words arrive in the box */
  const said = 'Tighten the spacing on the plan cards and keep the buttons the same height';
  let before = '', vc = null;
  async function dictate(){
    if (vc) vc.stop(); vc = ctl(c); const k = vc; c.offs.push(() => k.stop());
    before = ta.value; box.dataset.mode = 'voice'; ta.value = ''; ta.placeholder = 'Listening…'; grow();
    const t0 = performance.now(), tm = $('.cpx-tm', r); tm.textContent = '0:00';
    k.every(250, () => { const s = Math.floor((performance.now() - t0) / 1000); tm.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); });
    await k.run(async () => { await k.wait(700); for (const w of said.split(' ')){ ta.value += (ta.value ? ' ' : '') + w; grow(); await k.wait(160 + Math.random() * 120); } });
  }
  function stopVoice(keep, mine){ if (vc) vc.stop(); box.dataset.mode = 'idle'; ta.placeholder = PH; if (!keep) ta.value = before; sync(); if (mine) ta.focus({ preventScroll:true }); }
  $('.cpx-mic', r).onclick = dictate;
  $('.cpx-cancel', r).onclick = () => stopVoice(false, true);
  $('.cpx-ok', r).onclick = () => stopVoice(true, true);
  /* sending: the message and its files go up into the conversation, and the agent answers in the mode picked */
  function submit(){
    if (send.disabled) return;
    const v = ta.value.trim(), files = $$('.fchip', att).map(f => $('.n', f).textContent), mode = $('.cpx-mode-n', r).textContent, ctx = $('.cpx-ctx-n', r).textContent;
    ta.value = ''; att.innerHTML = ''; sync();
    const b = html(`<div class="bub">${files.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:${v ? 6 : 0}px">${files.map(f => `<span class="fchip">${I('clip','xs')}${f}</span>`).join('')}</div>` : ''}${v.replace(/</g,'&lt;')}</div>`); thread.appendChild(b); enter(b);
    const a = html(`<div class="cpx-ag wk"><span class="think on"><i></i><i></i><i></i><i></i></span><span class="shim">Working</span></div>`); thread.appendChild(a); enter(a);
    while (thread.children.length > 4) thread.firstElementChild.remove();
    const say = { Ask:`Looking at ${ctx}. I won't change anything.`, Edit:`On it. I'll make the changes on a new page in ${ctx}.`, Plan:`I'll write a plan for ${ctx} first, then wait for you.` }[mode];
    c.later(1700, () => { a.classList.remove('wk'); a.innerHTML = `<span>${say}</span>`; enter(a); });
  }
  send.onclick = submit;
  sync();
  // the preview's story: attach a frame that won't open, try again, write the ask, switch to Edit and send
  if (r === c.st) c.story(async s => {
    await s.beat(3);
    await s.tap($('.cpx-add', r)); await s.beat(3);
    await s.tap($('.pp-plus [data-add="figma"]', r)); s.away();
    await s.until(() => $('.fchip.err', att)); await s.beat(3);
    await s.tap($('.fchip.err .rt', att)); s.away();
    await s.until(() => att.children.length && !$('.fchip.ld,.fchip.err', att)); await s.beat(1);
    await s.type(ta, 'Tighten the spacing on the plan cards'.split(' ').map((w, i) => (i || ta.value ? ' ' : '') + w), { n:.3, each:sync });
    await s.beat(2);
    await s.tap($('.cpx-mode', r)); await s.beat(3);
    await s.tap($('.pp-mode [data-mode="Edit"]', r)); s.away(); await s.beat(2);
    await s.tap(send); s.away();
    await s.until(() => $('.cpx-ag', thread) && !$('.cpx-ag.wk', thread)); await s.beat(1);
  });
});
