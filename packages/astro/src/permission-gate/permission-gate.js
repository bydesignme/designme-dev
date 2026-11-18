// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, grow, hold, html, release, stagger, swap } from '../core/core.js';
DM.def('permission-gate', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{figma}', I('figma')).replace(/\{chk\}/g, I('check','xs')).replace('{chev}', I('chev-d','xs'));
  const root = $('.pgx', r), ok = $('.pgx-ok', r), no = $('.pgx-no', r), sc = $('.pgx-sc', r), title = $('.pgx-ht b', r), sub = $('.pgx-ht .muted', r);
  const first = { sc:sc.innerHTML, title:title.textContent, sub:sub.textContent, no:no.textContent };
  const boxes = () => $$('.pgx-o input', sc);
  // Clean (owner, 18 Nov) has its own touches: the card fits what it holds at every moment (grow(), never a kept height),
  // the count on Allow rolls, the answer gets a summary line in the foot strip, and the done mark is a tick that draws.
  // Soft and Blueprint keep theirs
  const ds = r.closest('[data-style]'), clean = !!ds && ds.dataset.style === 'clean';
  // grow() starts once the card's entrance (which scales it from .98) has ended, so it measures the card at its real size
  if (clean) Promise.resolve().then(() => Promise.all(root.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && root.isConnected) c.offs.push(grow(root)); });
  // where a result row goes: in the card, or in grow()'s wrapper inside it
  const into = () => $(':scope>.dm-grow', root) || root;
  // how long: This task, Today or Always, from the dropdown in the footer
  let dur = 'This task';
  const span = () => dur === 'Always' ? 'always' : 'for ' + dur.toLowerCase();
  const word = n => n > 1 ? 'scopes' : 'scope';
  // Clean's Allow: its number in a window of its own, so a new count rolls in (up as a box is ticked, down as one clears)
  const label = n => n ? `<span class="pgx-l">Allow <span class="pgx-cnt"><i>${n}</i></span> <span class="pgx-w">${word(n)}</span></span>` : 'Pick a scope';
  let shown = 0;
  const roll = (cnt, n, up) => { const old = cnt.lastElementChild, nu = document.createElement('i'); nu.textContent = n; nu.className = up ? 'iu' : 'id'; if (old){ old.className = up ? 'ou' : 'od'; setTimeout(() => old.remove(), REDUCE ? 0 : 300); } cnt.appendChild(nu); };
  const count = () => { const n = boxes().filter(b => b.checked).length; ok.disabled = !n;
    if (!clean) return swap(ok, n ? 'Allow ' + n + (n > 1 ? ' scopes' : ' scope') : 'Pick a scope');
    const cnt = $('.pgx-cnt', ok);
    if (n && shown && cnt && !ok._sw){ if (n !== shown){ roll(cnt, n, n > shown); swap($('.pgx-w', ok), word(n)); } }
    else swap(ok, label(n), true);
    shown = n; };
  if (clean){ shown = boxes().filter(b => b.checked).length; ok.innerHTML = label(shown); }
  c.on(sc, 'change', count);
  $$('.pgx-pop .mi', r).forEach(m => m.addEventListener('click', () => { dur = m.dataset.v; $$('.pgx-pop .mi', r).forEach(x => x.setAttribute('aria-checked', x === m)); swap($('.pgx-dv', r), dur === 'Always' ? 'Always' : 'For ' + dur.toLowerCase()); }));
  const body = [sc, $('.pgx-f', r)];
  // the scopes give way to a shorter result row: on the card it keeps the height it had and centres the row (hold). In Clean
  // the card eases to the row's height instead
  const show = on => { if (!on && c.card && !clean && !root.classList.contains('held')) hold(root); body.forEach(e => e.hidden = !on); if (on) stagger(body, 50); };
  // Clean's summary line in the foot strip: the scopes you allowed, by name, or how many on a narrow stage
  let names = [];
  const sum = (el, text, short = text) => { if (!clean) return; const s = el.appendChild(html(`<span class="pgx-sum"><span class="l"></span><span class="s"></span></span>`)); s.firstChild.textContent = text; s.lastChild.textContent = short; };
  // the frames the agent edits once it may. Plan toggle is a library component, so editing it needs Publish library
  const F = ['Hero', 'Plan cards', 'Compare table', 'FAQ', 'Plan toggle', 'Checkout summary'], LIB = 4;
  const clock = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  // the clock counts the agent's working time only, not the time it waits for you
  let granted = 0, publish = false, skip = false, done = 0, ms = 0, run = 0, panel = null;
  function row(){
    panel = html(`<div class="pgx-done run"><span class="g"><span class="spin"></span></span><span class="t"><b class="pgx-a"></b><span class="pgx-d"></span></span><span class="pgx-tm num"></span><button class="pill ghost sm">Revoke</button></div>`);
    sum(panel, names.join(', '), `${names.length} ${word(names.length)} allowed`);
    into().appendChild(panel); enter(panel); $('button', panel).onclick = revoke;
  }
  // the agent works through the frames under what it was given, and stops to ask when it reaches one it may not touch
  function work(){
    const id = ++run; if (!panel) row();
    const a = $('.pgx-a', panel), d = $('.pgx-d', panel), tm = $('.pgx-tm', panel);
    swap(a, `Allowed ${granted} ${granted > 1 ? 'scopes' : 'scope'} ${span()}`);
    const t0 = performance.now(), now = () => ms + performance.now() - t0;
    tm.textContent = clock(Math.floor(ms / 1000));
    c.run(async () => {
      const tick = c.every(250, () => { if (run === id) tm.textContent = clock(Math.floor(now() / 1000)); });
      try {
        while (done < F.length){
          if (done === LIB && !publish && !skip) return ask();
          swap(d, done === LIB && skip ? `Skipping ${F[done]}` : `Editing ${F[done]} · ${done + 1} of ${F.length}`);
          await c.wait(900); if (run !== id) return;
          done++;
        }
        panel.classList.replace('run', 'ok'); const g = $('.g', panel); g.innerHTML = clean ? I('check') : I('ok'); enter(g);
        swap(a, skip ? `Done. ${F.length - 1} frames edited` : `Done. ${F.length} frames edited`);
        swap(d, skip ? 'On a new page. Plan toggle skipped' : 'On a new page. Plan toggle published');
      } finally { clearInterval(tick); if (run === id) ms = now(); }
    });
  }
  // asks again, for only the scope it now needs
  function ask(){
    const p = panel; panel = null; p.classList.add('leave');
    root.classList.add('esc'); swap(title, 'Also allow Publish library?'); swap(sub, `${F[LIB]}, frame ${LIB + 1} of ${F.length}, is a library component`);
    c.later(300, () => {
      p.remove();
      sc.innerHTML = `<label class="pgx-o" data-k="publish"><input type="checkbox" checked><span class="bx">${I('check','xs')}</span><span class="t">Publish library<span class="d">Updates Checkout, Marketing site, Email kit and Docs</span></span><span class="tag warn">Risky</span></label>`;
      no.textContent = 'Skip this frame'; count(); show(true);
    });
  }
  function reset(){
    run++; granted = done = ms = 0; publish = skip = false; names = [];
    root.classList.remove('esc'); sc.innerHTML = first.sc; swap(title, first.title); swap(sub, first.sub); no.textContent = first.no; count();
  }
  function revoke(){ const p = panel; panel = null; run++; p.classList.add('leave'); c.later(300, () => { p.remove(); release(root); reset(); show(true); }); }
  ok.onclick = () => c.run(async () => {
    const picked = boxes().filter(b => b.checked); if (!picked.length) return;
    granted += picked.length; if (picked.some(b => b.closest('.pgx-o').dataset.k === 'publish')) publish = true;
    names.push(...picked.map(b => $('.t', b.closest('.pgx-o')).firstChild.textContent));
    ok.innerHTML = '<span class="spin"></span>'; await c.wait(500);
    // Clean: the scopes fade up and out before the card eases to the result row's height
    if (clean){ sc.classList.add('leave'); await c.wait(180); sc.classList.remove('leave'); }
    show(false);
    if (root.classList.contains('esc')){ root.classList.remove('esc'); swap(title, first.title); swap(sub, first.sub); }
    // placed inside another component (Agent harness), it reports back without the run
    if (!c.card){ row(); swap($('.pgx-a', panel), `Allowed ${granted} ${granted > 1 ? 'scopes' : 'scope'} ${span()}`); swap($('.pgx-d', panel), 'Applying the pricing fixes now'); $('.pgx-tm', panel).remove();
      c.later(1400, () => { if (!panel) return; panel.classList.replace('run', 'ok'); $('.g', panel).innerHTML = clean ? I('check') : I('ok'); swap($('.pgx-d', panel), 'Done. 6 frames edited on a new page'); }); return; }
    work();
  });
  no.onclick = () => {
    if (root.classList.contains('esc')){ skip = true; show(false); root.classList.remove('esc'); swap(title, first.title); swap(sub, first.sub); work(); return; }
    show(false); const d = html(`<div class="pgx-done" style="background:var(--dm-chip)">${I('info')}<span class="t">The agent will skip the Figma edits<span>It will list the fixes in chat instead</span></span><button class="pill ghost sm">Undo</button></div>`);
    sum(d, 'Nothing allowed in Figma'); into().appendChild(d); enter(d); $('button', d).onclick = () => { d.remove(); release(root); show(true); };
  };
  // the preview's story: hold back the risky scope, allow the rest, then grant it when the agent needs it for one frame
  c.story(async s => {
    await s.beat(3);
    const pub = $('[data-k="publish"]', sc);
    // Clean ticks the box the way a visitor would, without the browser's own input event, which reads as the visitor taking
    // over and stopped the story after its first tick
    const tick = async el => {
      if (!clean) return s.tap(el);
      await s.point(el, false); const h = $('.hand', c.st); if (h){ h.classList.remove('down'); void h.offsetWidth; h.classList.add('down'); }
      await s.beat(.32); const i = $('input', el); i.checked = !i.checked; i.dispatchEvent(new Event('change', { bubbles:true }));
      c.later(340, () => h && h.classList.remove('down'));
    };
    await tick(pub); await s.beat(1);
    await s.point($('.tag', pub)); await s.beat(3);
    await tick(pub); await s.beat(2);
    await s.tap(ok); s.away();
    await s.until(() => root.classList.contains('esc') && !sc.hidden);
    await s.beat(4);
    await s.tap(ok); s.away();
    await s.until(() => panel && panel.classList.contains('ok'));
  });
});
