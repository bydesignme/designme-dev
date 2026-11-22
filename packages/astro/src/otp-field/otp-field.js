// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter } from '../core/core.js';
DM.def('otp-field', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{mail}', I('mail'));
  const CODE = '482157';
  const box = $('.otp-in', r), msg = $('.otp-m', r), mf = $('.otp-mf', r), ff = $('.otp-ff', r), rs = $('.otp-rs', r);
  // one box per digit, with a short dash between the two halves. The first box carries autocomplete="one-time-code",
  // so a phone can offer the code from a message
  box.innerHTML = Array.from({ length:6 }, (_, i) => `${i === 3 ? '<span class="sep" aria-hidden="true"></span>' : ''}<input class="otp-d" inputmode="numeric" pattern="[0-9]*" maxlength="1" autocomplete="${i ? 'off' : 'one-time-code'}" aria-label="Digit ${i + 1} of 6">`).join('');
  const ins = $$('.otp-d', box);
  let state = 'idle', tries = 3;
  // the line under the boxes folds open with what it says, and folds shut with its last words still on it
  const say = (h, cls) => { mf.classList.toggle('shut', !h); if (!h) return; msg.className = 'otp-m' + (cls ? ' ' + cls : ''); msg.innerHTML = h; enter(msg); };
  const code = () => ins.map(i => i.value).join('');
  // a wrong code stays red until you type again, which starts it over
  function fresh(){ if (state !== 'bad') return; state = 'idle'; box.classList.remove('bad'); ins.forEach(i => { i.value = ''; i.removeAttribute('aria-invalid'); }); say(''); }
  function put(i, d){ fresh(); ins[i].value = d; if (code().length === 6) verify(); }
  // the code is checked as soon as the last box is filled: the boxes lock while the words say so, with the highlight sweep
  function verify(){
    if (state !== 'idle') return; state = 'vf';
    c.run(async () => {
      ins.forEach(i => { i.readOnly = true; i.blur(); }); say('<span class="spin"></span><span class="shim">Checking the code</span>');
      await c.wait(900); ins.forEach(i => i.readOnly = false);
      if (code() === CODE){
        state = 'ok'; box.classList.add('ok'); ins.forEach(i => i.readOnly = true);
        say(`${I('ok','xs')}Email verified`, 'ok'); ff.classList.add('shut'); return;
      }
      state = 'bad'; tries--; box.classList.remove('bad'); void box.offsetWidth; box.classList.add('bad'); ins.forEach(i => i.setAttribute('aria-invalid', 'true'));
      say(`${I('alert','xs')}That code doesn't match. ${tries ? `${tries} ${tries === 1 ? 'try' : 'tries'} left` : 'Send a new code to try again'}`, 'bad');
    });
  }
  // typing a digit fills the box and moves on; Backspace clears it, or the one before; the arrows move; a paste fills
  // every box from the first
  ins.forEach((inp, i) => {
    inp.oninput = () => { const d = inp.value.replace(/\D/g, ''); inp.value = ''; if (!d) return; if (d.length > 1) return fill(d); put(i, d); if (ins[i + 1] && state === 'idle') ins[i + 1].focus(); };
    inp.onkeydown = e => {
      if (e.key === 'Backspace'){ e.preventDefault(); if (state === 'bad'){ fresh(); ins[0].focus(); } else if (inp.value){ inp.value = ''; } else if (ins[i - 1]){ ins[i - 1].value = ''; ins[i - 1].focus(); } }
      else if (e.key === 'ArrowLeft' && ins[i - 1]){ e.preventDefault(); ins[i - 1].focus(); }
      else if (e.key === 'ArrowRight' && ins[i + 1]){ e.preventDefault(); ins[i + 1].focus(); }
      else if (/^\d$/.test(e.key) && inp.value){ e.preventDefault(); const j = state === 'bad' ? 0 : i; put(j, e.key); if (ins[j + 1] && state === 'idle') ins[j + 1].focus(); }
    };
    inp.onpaste = e => { e.preventDefault(); fill((e.clipboardData || window.clipboardData).getData('text')); };
    inp.onfocus = () => inp.select();
  });
  function fill(text, focus = true){
    const d = text.replace(/\D/g, '').slice(0, 6); if (!d) return;
    fresh(); ins.forEach((inp, i) => { inp.value = d[i] || ''; });
    if (d.length === 6) verify(); else if (focus) ins[d.length].focus();
  }
  // the resend link waits thirty seconds
  let left = 30; const ns = $('.num', rs);
  const iv = c.every(1000, () => { if (state === 'ok') return clearInterval(iv); left--; ns.textContent = '0:' + String(left).padStart(2, '0'); if (left <= 0){ clearInterval(iv); rs.innerHTML = '<button>Resend code</button>'; $('button', rs).onclick = () => { rs.textContent = 'A new code is on its way'; }; } });
  // the preview's story: paste a code with two digits swapped, see it fail, and type the right one. The check keeps working
  // under the pointer (DM.PLAYS); the person's own steps wait while a mouse rests on the card, so nothing moves under it
  c.story(async s => {
    const free = () => s.until(() => !r.matches(':hover'));
    await s.beat(3); await free();
    await s.tap(ins[0]); s.away();
    await s.beat(1); await free(); fill('482175', false);
    await s.until(() => state === 'bad'); await s.beat(4);
    for (let i = 0; i < 6; i++){ await free(); put(i, CODE[i]); await s.beat(1); }
    await s.until(() => state === 'ok'); await s.beat(2);
  });
});
