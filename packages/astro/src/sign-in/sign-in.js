// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, hold, html, stagger, swap } from '../core/core.js';
DM.def('sign-in', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{l}', I('chev-l','xs')).replace('{mail}', I('mail','xs'));
  const card = $('.sgx', r), ntf = $('.sgx-ntf', r), cp = $('.sgx-cp', r), s1 = $('.sgx-1', r), s2 = $('.sgx-2', r), em = $('.sgx-em', r), err = $('.sgx-err', r), go = $('.sgx-go', r), code = $('.sgx-code', r);
  code.innerHTML = Array.from({ length:6 }, (_, i) => `<input inputmode="numeric" maxlength="1" autocomplete="${i ? 'off' : 'one-time-code'}" aria-label="Digit ${i + 1}" style="--dm-i:${i}">`).join('');
  const CODE = '482157';
  const ins = $$('input', code);
  const send = demo => c.run(async () => {
    const v = em.value.trim();
    if (!/^\S+@\S+\.\S+$/.test(v)){ const f = em.parentElement; f.classList.remove('bad'); void f.offsetWidth; f.classList.add('bad'); swap(err, v ? 'That email looks incomplete' : 'Enter your email'); return; }
    em.parentElement.classList.remove('bad'); swap(err, ''); go.innerHTML = '<span class="spin"></span>'; await c.wait(800);
    s1.hidden = true; s2.hidden = false; s2.classList.remove('in'); void s2.offsetWidth; s2.classList.add('in'); $('.sgx-to', r).textContent = v; if (demo !== true && c.mine) ins[0].focus({ preventScroll:true }); c.later(900, () => ntf.classList.remove('shut'));
    let n = 30; const ns = $('.sgx-rs .num', r); const iv = c.every(1000, () => { if (checking || !ns.isConnected) return clearInterval(iv); n--; ns.textContent = n; if (n <= 0){ clearInterval(iv); $('.sgx-rs', r).innerHTML = '<button style="color:var(--dm-accent-fg,var(--dm-accent));font-weight:500">Resend code</button>'; } });
  });
  go.onclick = () => send(); em.onkeydown = e => { if (e.key === 'Enter') send(); };
  $('.sgx-bk', r).onclick = () => { s2.hidden = true; s1.hidden = false; s1.classList.remove('in'); void s1.offsetWidth; s1.classList.add('in'); go.textContent = 'Send code'; ins.forEach(i => i.value = ''); };
  let checking = false;
  /* verifying, then each digit turns green in turn, then the confirmed screen */
  function check(){ if (checking || !ins.every(i => i.value)) return; checking = true; c.run(async () => {
    const rs = $('.sgx-rs', r); ins.forEach(i => { i.blur(); i.readOnly = true; });
    code.classList.add('vf'); rs.innerHTML = '<span class="sgx-v"><span class="spin"></span>Verifying code</span>'; await c.wait(1100);
    code.classList.remove('vf'); code.classList.add('ok'); rs.innerHTML = `<span class="sgx-v ok">${I('check','xs')}Code confirmed</span>`; enter(rs.firstChild); await c.wait(1100);
    hold(card); [...card.children].forEach(k => k.hidden = true);
    const d = html(`<div class="sgx-done"><svg class="sgx-ck" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="m16 27 7 7 13-14"/></svg><b>You're in</b><span class="muted">Opening your workspace</span><span class="sgx-bar"><i></i></span></div>`);
    card.appendChild(d); stagger([...d.children].slice(1), 90, 250); }); }
  // a pasted code fills every box from the first; any 6 digits go through in the demo
  const paste = t => { t = t.replace(/\D/g, '').slice(0, 6); if (!t || checking) return; t.split('').forEach((d, j) => { if (ins[j]) ins[j].value = d; }); if (c.mine) ins[Math.min(5, t.length)].focus({ preventScroll:true }); check(); };
  // Copy puts the code on the clipboard, the way a phone offers it from the email; then it is pasted into the boxes
  cp.onclick = () => { try { navigator.clipboard.writeText(CODE).catch(() => {}); } catch(e){} swap(cp, 'Copied'); cp.disabled = true; swap($('.sgx-hint', r), 'Paste it into the first box'); const at = ins.find(i => !i.value); if (at && c.mine) at.focus({ preventScroll:true }); };
  ins.forEach((i, k) => {
    i.oninput = () => { i.value = i.value.replace(/\D/g, '').slice(-1); if (i.value && ins[k + 1]) ins[k + 1].focus({ preventScroll:true }); check(); };
    i.onkeydown = e => { if (e.key === 'Backspace' && !i.value && ins[k - 1]){ ins[k - 1].focus({ preventScroll:true }); ins[k - 1].value = ''; } };
    i.onpaste = e => { const t = (e.clipboardData.getData('text') || '').replace(/\D/g, ''); if (!t) return; e.preventDefault(); paste(t); };
  });
  // the preview's story: type an email and send it, the email arrives, copy its code and paste it in. The visitor can take
  // over at any point and go through it with their own email and any 6 digits
  c.story(async s => {
    await s.beat(2); await s.tap(em); await s.type(em, 'maya@studio.com', { n:.08 });
    await s.beat(1); await s.tap(go); s.away();
    await s.until(() => !ntf.classList.contains('shut')); await s.beat(3);
    await s.tap(cp); s.away(); await s.beat(2);
    paste(CODE); await s.until(() => !!$('.sgx-done', r)); await s.beat(4);
  });
});
