// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, hideTip, hold, swap } from '../core/core.js';
DM.def('voice-capture', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{pause}', I('pause'));
  const box = $('.vcx', r), tx = $('.vcx-tx', r), cv = $('.vcx-wave', r), st = $('.vcx-st', r), pop = $('.vcx-fix', r);
  const words = 'Move the yearly toggle above the cards and make the save badge say 20% off for annual plans'.split(' ');
  const low = { 3:['toggle','toddle','tunnel'], 10:['save','sale','saving'] };
  let samples = [], speak = 0, last = 0, paused = false, secs = 0, done = false;
  c.every(1000, () => { if (!paused && !done){ secs++; $('.vcx-t', r).textContent = Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0'); } });
  // the wave scrolls while it records. Once recording stops it is the whole recording, still, in quieter bars, drawn again
  // only when its width or colours change. The colours are read a few times a second, not every frame
  let cols = null, colsAt = -1e9, drawn = '';
  c.loop(t => {
    if (!done && t - last > 50){ last = t; samples.push(!paused && speak > 0 ? .2 + Math.random() * .8 : 0); if (samples.length > 300) samples.shift(); if (speak > 0) speak--; }
    const dpr = devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight; if (!w) return;
    const now = performance.now(); if (!cols || now - colsAt > 400){ const cs = getComputedStyle(r); cols = ['--dm-fg2', '--dm-faint', '--dm-muted'].map(k => cs.getPropertyValue(k).trim()); colsAt = now; }
    if (done){ const key = w + cols.join(); if (key === drawn) return; drawn = key; }
    if (cv.width !== w * dpr){ cv.width = w * dpr; cv.height = h * dpr; }
    const x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h);
    const n = Math.floor(w / 5);
    let vals;
    if (done){
      // the recording without the silence either side, fitted to the width: each bar is the loudest moment it covers
      let a = samples.findIndex(v => v), z = samples.length - 1; while (z > a && !samples[z]) z--;
      const rec = a < 0 ? [] : samples.slice(Math.max(0, a - 2), z + 3);
      vals = Array.from({ length:n }, (_, i) => { const from = Math.floor(i * rec.length / n), to = Math.max(from + 1, Math.floor((i + 1) * rec.length / n)); return Math.max(0, ...rec.slice(from, to).map(v => v || 0)); });
    } else vals = Array.from({ length:n }, (_, i) => samples[samples.length - n + i] || 0);
    for (let i = 0; i < n; i++){ const v = vals[i], px = i * 5 + 2; x.globalAlpha = done ? (v ? .6 : 1) : Math.min(1, i / 14, (n - i) / 3 + .2);
      x.fillStyle = v ? cols[done ? 2 : 0] : cols[1];
      const bh = v ? Math.max(4, v * (h - 6)) : 2; x.beginPath(); x.roundRect ? x.roundRect(px, h / 2 - bh / 2, 2.5, bh, 1.2) : x.rect(px, h / 2 - bh / 2, 2.5, bh); x.fill(); }
  });
  const pb = $('.vcx-pause', r);
  pb.onclick = () => { paused = !paused; box.classList.toggle('paused', paused); pb.innerHTML = I(paused ? 'mic' : 'pause'); pb.dataset.tip = paused ? 'Resume' : 'Pause'; swap(st, paused ? 'Paused' : 'Listening'); };
  function finish(){
    // the box keeps the height it had while recording: the wave stays, still, and the words stay where they were
    hold(box); done = true; box.classList.add('done'); swap(st, 'Check what I heard'); pb.remove();
    $$('.low', tx).forEach(l => { l.dataset.tip = 'Not sure about this word'; });
  }
  const settle = t => { $('.vcx-acts', r).innerHTML = `<span class="muted" style="font-size:12.5px">${t}</span><span class="sp"></span><button class="pill ghost sm vcx-again">${I('refresh','xs')}Record again</button>`; $('.vcx-again', r).onclick = () => DM.mount(r.closest('.card')); };
  $('.vcx-done', r).onclick = () => { if (!done) finish(); else { swap(st, 'Sent'); settle('Sent to the agent'); } };
  $('.vcx-x', r).onclick = () => { shutFix(); if (!done) hold(box); done = true; $$('.low', tx).forEach(l => l.replaceWith(l.textContent)); pb.remove(); box.classList.add('done', 'gone'); swap(st, 'Cancelled'); settle('Nothing was sent'); };
  // a word it isn't sure of opens a short menu of fixes: with a click, or with Enter or Space, which puts the focus on the
  // first fix. The arrows move through them and wrap, Home and End jump, and Escape closes the menu back to the word
  let fixFor = null;
  const fixes = () => $$('.mi', pop);
  const shutFix = () => { const back = pop.contains(document.activeElement) && fixFor; pop.classList.remove('open'); pop.inert = true; if (fixFor) fixFor.setAttribute('aria-expanded', 'false'); fixFor = null; if (back && back.isConnected) back.focus({ preventScroll:true }); };
  function openFix(l, key){
    const alts = low[l.dataset.i];
    pop.innerHTML = '<div class="ph">Did you mean</div>' + alts.map(a => `<button class="mi" role="menuitem" tabindex="-1" data-close data-w="${a}">${a}</button>`).join('');
    hideTip(); const hr = box.getBoundingClientRect(), lr = l.getBoundingClientRect();
    pop.style.left = (lr.left - hr.left) + 'px'; pop.style.top = (lr.bottom - hr.top + 6) + 'px'; pop.inert = false; pop.classList.add('open');
    if (fixFor && fixFor !== l) fixFor.setAttribute('aria-expanded', 'false'); fixFor = l; l.setAttribute('aria-expanded', 'true');
    fixes().forEach(b => b.onclick = ev => { ev.stopPropagation(); l.textContent = b.dataset.w; l.classList.add('fixed'); l.dataset.tip = 'Fixed'; shutFix(); });
    if (key) fixes()[0].focus({ preventScroll:true });
  }
  pop.inert = true;
  c.on(tx, 'click', e => { const l = e.target.closest('.low'); if (!l) return; openFix(l, e.isTrusted && !e.detail); e.stopPropagation(); });
  c.on(tx, 'keydown', e => { const l = e.target.closest('.low'); if (!l || (e.key !== 'Enter' && e.key !== ' ')) return; e.preventDefault(); openFix(l, true); });
  c.on(pop, 'keydown', e => { const all = fixes(), i = all.indexOf(document.activeElement), go = { ArrowDown:all[(i + 1) % all.length], ArrowUp:all[(i - 1 + all.length) % all.length], Home:all[0], End:all[all.length - 1] }[e.key];
    if (go){ e.preventDefault(); go.focus({ preventScroll:true }); } else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); shutFix(); } else if (e.key === 'Tab'){ const l = fixFor; shutFix(); if (l) l.focus({ preventScroll:true }); } });
  c.on(document, 'click', e => { if (!pop.contains(e.target) && pop.classList.contains('open')) shutFix(); });
  c.run(async () => {
    await c.wait(700);
    for (let i = 0; i < words.length; i++){
      while (paused){ await c.wait(100); }
      if (done) return;
      speak = 5; tx.insertAdjacentHTML('beforeend', low[i] ? `<span class="w"><span class="low" data-i="${i}" role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false">${words[i]}</span> </span>` : `<span class="w">${words[i]} </span>`);
      await c.wait(170 + Math.random() * 150);
    }
    await c.wait(900); if (!done) finish();
  });
});
