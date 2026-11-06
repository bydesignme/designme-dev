// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, hold, html, release, stagger, swap } from '../core/core.js';
DM.def('permission-gate', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{figma}', I('figma')).replace(/\{chk\}/g, I('check','xs')).replace('{chev}', I('chev-d','xs'));
  const root = $('.pgx', r), ok = $('.pgx-ok', r), no = $('.pgx-no', r), sc = $('.pgx-sc', r), title = $('.pgx-ht b', r), sub = $('.pgx-ht .muted', r);
  const first = { sc:sc.innerHTML, title:title.textContent, sub:sub.textContent, no:no.textContent };
  const boxes = () => $$('.pgx-o input', sc);
  // how long: This task, Today or Always, from the dropdown in the footer
  let dur = 'This task';
  const span = () => dur === 'Always' ? 'always' : 'for ' + dur.toLowerCase();
  const count = () => { const n = boxes().filter(b => b.checked).length; ok.disabled = !n; swap(ok, n ? 'Allow ' + n + (n > 1 ? ' scopes' : ' scope') : 'Pick a scope'); };
  c.on(sc, 'change', count);
  $$('.pgx-pop .mi', r).forEach(m => m.addEventListener('click', () => { dur = m.dataset.v; $$('.pgx-pop .mi', r).forEach(x => x.setAttribute('aria-checked', x === m)); swap($('.pgx-dv', r), dur === 'Always' ? 'Always' : 'For ' + dur.toLowerCase()); }));
  const body = [sc, $('.pgx-f', r)];
  // the scopes give way to a shorter result row: on the card it keeps the height it had and centres the row (hold)
  const show = on => { if (!on && c.card && !root.classList.contains('held')) hold(root); body.forEach(e => e.hidden = !on); if (on) stagger(body, 50); };
  // the frames the agent edits once it may. Plan toggle is a library component, so editing it needs Publish library
  const F = ['Hero', 'Plan cards', 'Compare table', 'FAQ', 'Plan toggle', 'Checkout summary'], LIB = 4;
  const clock = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  // the clock counts the agent's working time only, not the time it waits for you
  let granted = 0, publish = false, skip = false, done = 0, ms = 0, run = 0, panel = null;
  function row(){
    panel = html(`<div class="pgx-done run"><span class="g"><span class="spin"></span></span><span class="t"><b class="pgx-a"></b><span class="pgx-d"></span></span><span class="pgx-tm num"></span><button class="pill ghost sm">Revoke</button></div>`);
    root.appendChild(panel); enter(panel); $('button', panel).onclick = revoke;
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
        panel.classList.replace('run', 'ok'); const g = $('.g', panel); g.innerHTML = I('ok'); enter(g);
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
    run++; granted = done = ms = 0; publish = skip = false;
    root.classList.remove('esc'); sc.innerHTML = first.sc; swap(title, first.title); swap(sub, first.sub); no.textContent = first.no; count();
  }
  function revoke(){ const p = panel; panel = null; run++; p.classList.add('leave'); c.later(300, () => { p.remove(); release(root); reset(); show(true); }); }
  ok.onclick = () => c.run(async () => {
    const picked = boxes().filter(b => b.checked); if (!picked.length) return;
    granted += picked.length; if (picked.some(b => b.closest('.pgx-o').dataset.k === 'publish')) publish = true;
    ok.innerHTML = '<span class="spin"></span>'; await c.wait(500);
    show(false);
    if (root.classList.contains('esc')){ root.classList.remove('esc'); swap(title, first.title); swap(sub, first.sub); }
    // placed inside another component (Agent harness), it reports back without the run
    if (!c.card){ row(); swap($('.pgx-a', panel), `Allowed ${granted} ${granted > 1 ? 'scopes' : 'scope'} ${span()}`); swap($('.pgx-d', panel), 'Applying the pricing fixes now'); $('.pgx-tm', panel).remove();
      c.later(1400, () => { if (!panel) return; panel.classList.replace('run', 'ok'); $('.g', panel).innerHTML = I('ok'); swap($('.pgx-d', panel), 'Done. 6 frames edited on a new page'); }); return; }
    work();
  });
  no.onclick = () => {
    if (root.classList.contains('esc')){ skip = true; show(false); root.classList.remove('esc'); swap(title, first.title); swap(sub, first.sub); work(); return; }
    show(false); const d = html(`<div class="pgx-done" style="background:var(--dm-chip)">${I('info')}<span class="t">The agent will skip the Figma edits<span>It will list the fixes in chat instead</span></span><button class="pill ghost sm">Undo</button></div>`);
    root.appendChild(d); enter(d); $('button', d).onclick = () => { d.remove(); release(root); show(true); };
  };
  // the preview's story: hold back the risky scope, allow the rest, then grant it when the agent needs it for one frame
  c.story(async s => {
    await s.beat(3);
    const pub = $('[data-k="publish"]', sc);
    await s.tap(pub); await s.beat(1);
    await s.point($('.tag', pub)); await s.beat(3);
    await s.tap(pub); await s.beat(2);
    await s.tap(ok); s.away();
    await s.until(() => root.classList.contains('esc') && !sc.hidden);
    await s.beat(4);
    await s.tap(ok); s.away();
    await s.until(() => panel && panel.classList.contains('ok'));
  });
});
