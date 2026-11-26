// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, copied, enter, grow, iconSwap, mxIn, swap } from '../core/core.js';
DM.def('answer-action-bar', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{copy}', I('copy')).replace('{re}', I('refresh')).replace('{l}', I('chev-l','xs')).replace('{rr}', I('chev-r','xs'))
    .replace('{up}', I('up-thumb')).replace('{dn}', I('down-thumb')).replace('{vol}', I('vol','xs'));
  // the versions a regenerate writes, in turn. [[…]] marks what changed from the version before; $24 to $19 a month saves 21%
  const POOL = [
    { t:'Pro is $24 a month, or $19 a month when billed yearly. That saves 15%, and yearly is the option the new pricing page shows first.', meta:'Sonnet 5.5 · 6.2s' },
    { t:'Pro is $24 a month, or $19 a month billed yearly, which saves [[21%, or $60 a year]]. The new pricing page shows the yearly price first.', meta:'Sonnet 5.5 · 4.8s' },
    { t:'Billed yearly, Pro drops from $24 to $19 a month: [[$60 back each year]], about 21%. That is why the pricing page leads with yearly.', meta:'Sonnet 5.5 · 5.1s' }
  ];
  const t = $('.aab-t', r), pg = $('.aab-pg', r), n = $('.aab-n', r), pv = $('.aab-prev', r), nx = $('.aab-next', r), re = $('.aab-re', r), cp = $('.aab-cp', r);
  const up = $('.aab-up', r), dn = $('.aab-dn', r), rd = $('.aab-rd', r), bar = $('.aab-pr i', r), tm = $('.aab-tm', r), meta = $('.aab-meta', r), why = $('.aab-why', r), st = $('.aab-st', r), chips = $$('.aab-ch .chip', r);
  // every version keeps its own rating
  const vers = [{ ...POOL[0], rate:'' }]; let cur = 0, busy = false, failOnce = false;
  const plain = v => v.t.replace(/\[\[|\]\]/g, '');
  // each word's HTML, with the space before it; inside the changed phrase the space is highlighted too, so the phrase reads as one
  const words = v => { let on = false; return v.t.split(' ').map((w, i) => { const a = w.startsWith('[['), b = w.includes(']]'), inner = on && !a; if (a) on = true;
    const s = (i ? `<span${inner ? ' class="nw"' : ''}> </span>` : '') + `<span class="w${on ? ' nw' : ''}">${w.replace(/\[\[|\]\]/g, '')}</span>`; if (b) on = false; return s; }); };
  // the tone changes with the words: the words fading out keep their colour, and the new ones arrive in theirs (swap()
  // writes them 170ms on)
  const status = (text, tone) => { clearTimeout(st._tone); const set = () => { st.classList.toggle('warn', tone === 'warn'); st.classList.toggle('ok', tone === 'ok'); };
    if (tone === 'ok') { set(); st.innerHTML = `${I('ok','xs')}<span>${text}</span>`; enter(st); return; }
    const lag = !REDUCE && !!st.textContent.trim() && st.textContent !== text; swap(st, text); if (lag) st._tone = setTimeout(set, 170); else set(); };
  function nav(){
    n.textContent = (cur + 1) + ' / ' + vers.length; pg.classList.toggle('on', vers.length > 1); pg.inert = vers.length < 2;
    pv.disabled = cur === 0 || busy; nx.disabled = cur === vers.length - 1 || busy; re.disabled = busy;
    up.setAttribute('aria-pressed', vers[cur].rate === 'up'); dn.setAttribute('aria-pressed', vers[cur].rate === 'down');
    swap(meta, vers[cur].meta);
  }
  // no room kept for a longer answer or an empty status, in every style (owner, 18 Nov). The component grows with what it
  // shows (grow(), once its entrance has settled), and a version streaming in keeps the height of the one it replaces, then
  // eases to its own
  const aab = $('.aab', r);
  Promise.resolve().then(() => Promise.all(aab.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && aab.isConnected) c.offs.push(grow(aab)); });
  const keep = () => { if (t.textContent.trim()) t.style.minHeight = t.offsetHeight + 'px'; };
  const fit = () => { if (!t.style.minHeight) return; const was = t.offsetHeight; t.style.minHeight = ''; const h = t.offsetHeight; if (h >= was || REDUCE) return;
    t.style.minHeight = was + 'px'; void t.offsetHeight; t.style.transition = 'min-height var(--dm-t) var(--dm-ease)'; t.style.minHeight = h + 'px';
    c.later(460, () => { t.style.transition = ''; t.style.minHeight = ''; }); };
  // a version streams in word by word; paging between versions shows one at once
  async function stream(v){
    keep(); t.classList.add('out'); await c.wait(260); t.classList.remove('out'); t.innerHTML = '';
    const ws = words(v);
    for (let i = 0; i < ws.length; i++){ t.insertAdjacentHTML('beforeend', ws[i]); t.lastElementChild.classList.add('in'); await c.wait(38); }
    fit();
  }
  async function show(i){ stop(); cur = i; nav(); t.classList.add('out'); await c.wait(240); t.classList.remove('out'); t.innerHTML = words(vers[i]).join(''); $$('.w', t).forEach((w, k) => { w.classList.add('in'); w.style.animationDelay = k * 10 + 'ms'; }); }
  pv.onclick = () => c.run(() => show(cur - 1));
  nx.onclick = () => c.run(() => show(cur + 1));
  // regenerate writes the next version; a dropped connection is retried once with a countdown
  function regenerate(note){
    if (busy) return; stop(); busy = true; re.classList.add('go'); c.later(700, () => re.classList.remove('go')); nav();
    c.run(async () => {
      if (failOnce){ failOnce = false;
        status('Writing a new version' + (note ? ' with your note' : '')); st.classList.add('shim'); await c.wait(1200); st.classList.remove('shim');
        for (let k = 2; k > 0; k--){ status(`Couldn't reach the model. Retrying in ${k}s`, 'warn'); await c.wait(1000); }
      }
      status('Writing a new version' + (note ? ' with your note' : '')); st.classList.add('shim');
      const v = { ...POOL[Math.min(vers.length, POOL.length - 1)], rate:'' }; vers.push(v); cur = vers.length - 1; nav();
      await stream(v); busy = false; nav(); st.classList.remove('shim');
      // what the new version fixed, when it answers a reason; the pager already counts the versions
      if (note) status('Fixes the saving: 21%, not 15%', 'ok'); else status('');
    });
  }
  re.onclick = () => regenerate();
  // the tooltip says it was copied, and how
  cp.onclick = () => copied(cp, plain(vers[cur]), 'Copied without the highlights');
  // thumbs: up is a quiet thanks; down asks why, and a reason writes a version that answers it
  up.onclick = () => { const v = vers[cur]; v.rate = v.rate === 'up' ? '' : 'up'; why.classList.add('shut'); nav(); status(v.rate ? 'Thanks, noted for this project' : ''); };
  // (as the reasons open, the question and its chips rise in one after another, mxIn(): owner's trial, 26 Nov)
  dn.onclick = () => { const v = vers[cur]; v.rate = v.rate === 'down' ? '' : 'down'; why.classList.toggle('shut', v.rate !== 'down'); why.inert = v.rate !== 'down'; nav(); status(''); chips.forEach(x => x.classList.remove('on')); if (v.rate === 'down') mxIn([$('.aab-wq', r), ...chips], { base:60 }); };
  chips.forEach(ch => ch.onclick = () => { chips.forEach(x => x.classList.toggle('on', x === ch)); c.later(400, () => { why.classList.add('shut'); why.inert = true; failOnce = vers.length === 1; regenerate(ch.textContent); }); });
  why.inert = true;
  // read aloud: about 0.28s a word, each word lit as it's read, with a progress bar and a clock
  let reading = 0, pos = 0;
  const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s) % 60).padStart(2, '0');
  // (play, pause and the speaker crossfade: iconSwap())
  let ico = 'vol'; const icon = k => { if (ico === k) return; ico = k; const ic = $('.ic', rd); iconSwap(ic, () => { ic.innerHTML = I(k, 'xs'); }, { inner:true }); };
  // stop drops the place (a new version, another page); pause keeps it, so the bar, the clock and the lit word stay
  function stop(){ if (reading) clearInterval(reading); reading = 0; pos = 0; rd.classList.remove('on', 'paused'); rd.setAttribute('aria-pressed', 'false'); rd.setAttribute('aria-label', 'Read aloud'); rd.dataset.tip = 'Read aloud'; icon('vol'); bar.style.width = '0%'; $$('.w.rd', t).forEach(w => w.classList.remove('rd')); }
  function pause(){ clearInterval(reading); reading = 0; rd.classList.add('paused'); rd.setAttribute('aria-pressed', 'false'); rd.setAttribute('aria-label', 'Resume reading'); rd.dataset.tip = 'Resume'; icon('play'); }
  rd.onclick = () => {
    if (reading) return pause();
    const ws = $$('.w', t); if (!ws.length || busy) return;
    const total = ws.length * .28;
    rd.classList.add('on'); rd.classList.remove('paused'); rd.setAttribute('aria-pressed', 'true'); rd.setAttribute('aria-label', 'Pause reading'); rd.dataset.tip = 'Pause'; icon('pause');
    reading = c.every(100, () => {
      pos += 100 / 280; const i = Math.min(ws.length - 1, Math.floor(pos));
      ws.forEach((w, k) => w.classList.toggle('rd', k === i));
      bar.style.width = Math.min(100, pos / ws.length * 100) + '%'; tm.textContent = clock(pos * .28) + ' / ' + clock(total);
      if (pos >= ws.length) stop();
    });
  };
  // Left and Right move between the toolbar's buttons, skipping any that are switched off
  c.on($('.aab-bar', r), 'keydown', e => {
    const k = { ArrowRight:1, ArrowLeft:-1 }[e.key]; if (!k) return;
    const bs = $$('.aab-bar button', r).filter(b => !b.disabled && !b.closest('[inert]')), i = bs.indexOf(document.activeElement);
    if (i < 0) return; e.preventDefault(); bs[(i + k + bs.length) % bs.length].focus({ preventScroll:true });
  });
  nav();
  c.run(async () => { busy = true; nav(); await c.wait(300); await stream(vers[0]); busy = false; nav(); });
  // the preview's story: listen, hear a wrong number, rate it down, say why, ride out a dropped connection, copy the fix
  c.story(async s => {
    await s.until(() => !busy); await s.beat(2);
    await s.tap(rd); s.away(); await s.beat(7);
    await s.tap(rd); await s.beat(1);
    await s.tap(dn); s.away(); await s.beat(3);
    await s.tap(chips[0]); s.away();
    await s.until(() => vers.length > 1 && !busy); await s.beat(3);
    await s.tap(cp); s.away(); await s.beat(1);
  });
});
