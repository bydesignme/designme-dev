// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, grow, html, stagger, swap } from '../core/core.js';
DM.def('sign-in', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{l}', I('chev-l','xs')).replace('{mail}', I('mail','xs'));
  const card = $('.sgx', r), body = $('.sgx-body', r), af = $('.sgx-af', r), sug = $('.sgx-sug', r), s1 = $('.sgx-1', r), s2 = $('.sgx-2', r), ft = $('.sgx-ft', r), em = $('.sgx-em', r), ef = $('.sgx-ef', r), err = $('.sgx-err', r), go = $('.sgx-go', r), rs = $('.sgx-rs', r), code = $('.sgx-code', r);
  code.innerHTML = Array.from({ length:6 }, (_, i) => `<input inputmode="numeric" maxlength="1" autocomplete="${i ? 'off' : 'one-time-code'}" aria-label="Digit ${i + 1}">`).join('');
  const CODE = '482157';
  const ins = $$('input', code);
  // the card fits each step at every moment (grow(), never a kept height): the code arriving, a message under the field and
  // the shorter confirmation all ease the steps to their height, and the foot eases to its own, so the card, which is the two
  // together, eases with them and its foot never leaves its bottom edge. It starts once the card's entrance has ended
  Promise.resolve().then(() => Promise.all(card.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && card.isConnected){ c.offs.push(grow(body)); c.offs.push(grow(ft)); } });
  // what is wrong with the email, in red words after the alert mark; the line opens under the field and closes again, so no
  // room is kept for it
  const say = t => {
    if (!t){ ef.classList.add('shut'); return; }
    const s = $('span', err);
    if (s && !ef.classList.contains('shut')) swap(s, t); else err.innerHTML = I('alert','xs') + `<span>${t}</span>`;
    ef.classList.remove('shut');
  };
  // where the code stands: idle (typing), vf (being checked), bad (wrong, until typing starts over) or ok
  let st = 'idle', n = 30, iv = 0;
  // with no box focused, the next one to fill has the focus edge
  const next = () => { const k = st === 'idle' ? ins.findIndex(i => !i.value) : -1; ins.forEach((i, j) => i.classList.toggle('nx', j === k)); };
  // the line under the boxes, while the code is being typed: the resend countdown, then Resend code. What the foot says
  // changes in place, with no fade, so the foot is never empty for a moment
  const idle = () => { if (st !== 'idle') return;
    if (n > 0){ rs.innerHTML = `Resend in <span class="num">${n}</span>s`; return; }
    rs.innerHTML = '<button class="sgx-re">Resend code</button>'; $('.sgx-re', rs).onclick = () => { n = 30; idle(); }; };
  const send = demo => c.run(async () => {
    const v = em.value.trim();
    if (!/^\S+@\S+\.\S+$/.test(v)){ const f = em.parentElement; f.classList.remove('bad'); void f.offsetWidth; f.classList.add('bad'); em.setAttribute('aria-invalid', 'true'); say(v ? 'That email looks incomplete' : 'Enter your email'); return; }
    em.parentElement.classList.remove('bad'); em.removeAttribute('aria-invalid'); say(''); go.innerHTML = '<span class="spin"></span>'; await c.wait(800);
    s1.hidden = true; s2.hidden = false; s2.classList.remove('in'); void s2.offsetWidth; s2.classList.add('in'); $('.sgx-to', r).textContent = v;
    // the foot swaps Send code for the resend line, in the same place
    go.hidden = true; rs.hidden = false; st = 'idle'; n = 30; idle(); next();
    if (demo !== true && c.mine) ins[0].focus({ preventScroll:true });
    // the email arrives: its code is offered under the boxes, the way a phone offers a one-time code
    c.later(900, () => { if (st !== 'ok') af.classList.remove('shut'); });
    clearInterval(iv); iv = c.every(1000, () => { if (st === 'ok' || n <= 0 || s2.hidden) return; n--; idle(); });
  });
  go.onclick = () => send(); em.onkeydown = e => { if (e.key === 'Enter') send(); };
  // a wrong code stays marked until typing starts over
  const fresh = () => { if (st !== 'bad') return; st = 'idle'; code.classList.remove('bad'); ins.forEach(i => i.removeAttribute('aria-invalid')); idle(); };
  $('.sgx-bk', r).onclick = () => { if (st === 'vf' || st === 'ok') return; fresh(); clearInterval(iv); af.classList.add('shut'); ins.forEach(i => i.value = '');
    s2.hidden = true; s1.hidden = false; s1.classList.remove('in'); void s1.offsetWidth; s1.classList.add('in'); rs.hidden = true; go.hidden = false; go.textContent = 'Send code'; };
  // the code is checked once every box is filled: the boxes dim a little while the line says Verifying code; a wrong one
  // clears them with a red edge and a shake and says so in red; the right one gets the green tick, then the welcome
  function check(){ if (st !== 'idle' || !ins.every(i => i.value)) return; st = 'vf'; next(); c.run(async () => {
    ins.forEach(i => { i.blur(); i.readOnly = true; });
    code.classList.add('vf'); rs.innerHTML = '<span class="sgx-v"><span class="spin"></span><span class="shim">Verifying code</span></span>'; await c.wait(1100);
    code.classList.remove('vf'); ins.forEach(i => i.readOnly = false);
    if (ins.map(i => i.value).join('') !== CODE){
      st = 'bad'; ins.forEach(i => { i.value = ''; i.setAttribute('aria-invalid', 'true'); });
      code.classList.remove('bad'); void code.offsetWidth; code.classList.add('bad');
      rs.innerHTML = `<span class="sgx-v bad">${I('alert','xs')}That code didn't work, try again</span>`;
      if (c.mine) ins[0].focus({ preventScroll:true });
      return;
    }
    st = 'ok'; ins.forEach(i => i.readOnly = true); af.classList.add('shut');
    rs.innerHTML = `<span class="sgx-v ok">${I('check','xs')}Code confirmed</span>`; await c.wait(1100);
    // the welcome takes the steps' place, and the foot carries the workspace opening in the same moment, so it is never empty
    s1.hidden = true; s2.hidden = true; rs.hidden = true;
    const d = html(`<div class="sgx-done" role="status"><svg class="sgx-ck" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="m16 27 7 7 13-14"/></svg><b>You're in</b></div>`);
    const op = html('<span class="sgx-open"><span class="shim">Opening your workspace</span><span class="sgx-bar"><i></i></span></span>');
    ($(':scope>.dm-grow', body) || body).appendChild(d); ($(':scope>.dm-grow', ft) || ft).appendChild(op); stagger([d.lastChild], 90, 250); }); }
  // a pasted code, or the one Mail offers, fills every box from the first
  const paste = t => { t = t.replace(/\D/g, '').slice(0, 6); if (!t || st === 'vf' || st === 'ok') return; fresh(); ins.forEach((i, j) => { i.value = t[j] || ''; }); next(); if (c.mine && t.length < 6) ins[t.length].focus({ preventScroll:true }); check(); };
  sug.onclick = () => { if (st === 'vf' || st === 'ok') return; af.classList.add('shut'); paste(CODE); };
  ins.forEach((i, k) => {
    i.oninput = () => { fresh(); i.value = i.value.replace(/\D/g, '').slice(-1); if (i.value && ins[k + 1]) ins[k + 1].focus({ preventScroll:true }); next(); check(); };
    i.onkeydown = e => { if (e.key === 'Backspace' && !i.value && ins[k - 1]){ ins[k - 1].focus({ preventScroll:true }); ins[k - 1].value = ''; next(); } };
    i.onpaste = e => { const t = (e.clipboardData.getData('text') || '').replace(/\D/g, ''); if (!t) return; e.preventDefault(); paste(t); };
  });
  // the preview's story: type an email and send it; the code arrives and Mail offers it; type it from memory with two digits
  // swapped, see it fail, then take the one Mail offers. The visitor can take over at any point and go through it with their
  // own email, typing 482 157 or pressing the chip
  c.story(async s => {
    await s.beat(2); await s.tap(em); await s.type(em, 'maya@studio.com', { n:.08 });
    await s.beat(1); await s.tap(go); s.away();
    await s.until(() => !af.classList.contains('shut')); await s.beat(2);
    for (const [j, d] of [...'482175'].entries()){ fresh(); ins[j].value = d; next(); await s.beat(.5); }
    check(); await s.until(() => st === 'bad'); await s.beat(4);
    await s.tap(sug); s.away();
    await s.until(() => !!$('.sgx-done', r)); await s.beat(4);
  });
});
