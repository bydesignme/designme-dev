// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, copied, enter, html } from '../core/core.js';
DM.def('terminal-stream', (r, c) => {
  const IC = { term:I('term'), stop:I('stop','xs'), copy:I('copy') };
  r.innerHTML = r.innerHTML.replace(/\{(\w+)\}/g, (m, k) => IC[k] || m);
  const root = $('.tmx', r), body = $('.tmx-body', r), st = $('.tmx-st', r), sv = $('.tmx-sv', r), stop = $('.tmx-stop', r), cp = $('.tmx-cp', r), ff = $('.tmx-ff', r), foot = $('.tmx-f', r);
  // what the agent does: each command with the lines it prints and how long it takes, then the one line where it says what
  // went wrong and the edit that fixes it. [text, tone] marks a line ok (green), bad (red) or mu (grey)
  const F = (n, kb) => 'dist/' + n.padEnd(22) + kb.padStart(6) + ' kB';
  const BUILD = [['> acme-web@2.4.0 build', 'mu'], ['> vite build', 'mu'], 'vite v6.2.1 building for production...', 'transforming...', ['✓ 1284 modules transformed.', 'ok'], 'rendering chunks...', 'computing gzip size...',
    ...[['index.html', '0.46'], ['assets/Home-1c9e.js', '3.12'], ['assets/Pricing-3f9a.js', '12.40'], ['assets/Cart-7b21.js', '9.86'], ['assets/Account-a04d.js', '7.31'], ['assets/Billing-52ce.js', '6.94'],
      ['assets/Bills-e8f3.js', '5.27'], ['assets/Team-0d6a.js', '4.88'], ['assets/Prefs-9a1b.js', '6.02'], ['assets/Docs-44f0.js', '8.15'], ['assets/Search-b7c2.js', '2.96'], ['assets/Modal-61de.js', '1.84'],
      ['assets/Chart-ef09.js', '21.73'], ['assets/Table-3a7e.js', '11.09'], ['assets/Form-c1d4.js', '4.41'], ['assets/Toast-8e2f.js', '1.12'], ['assets/dates-29bb.js', '18.30'], ['assets/vendor-8c1e.js', '98.12'],
      ['assets/index-4f2a.js', '42.31'], ['assets/index-9b7d.css', '18.92']].map(([n, kb]) => F(n, kb)), ['✓ built in 6.1s', 'ok']];
  const S = [
    { cmd:'npm install', ms:1900, out:['added 412 packages in 1.9s', 'found 0 vulnerabilities'] },
    { cmd:'npm run build', ms:6100, out:BUILD },
    { cmd:'npm test', ms:3400, exit:1, out:[['RUN  v3.0.5 ~/acme/web', 'mu'], ['✓ src/lib/cart.test.ts (14 tests)', 'ok'], ['× src/lib/price.test.ts (1 failed)', 'bad'], ['  × formats a yearly price', 'bad'],
      ['    Expected: "$240/yr"', 'ok'], ['    Received: "$240.00/yr"', 'bad'], ['Tests  1 failed | 23 passed (24)', 'bad']] },
    { note:'The test expects whole dollars, but formatPrice always adds cents. Dropping them for round amounts.', ms:1500 },
    { edit:'src/lib/price.ts', add:2, del:1, ms:1500, diff:["- return `$${n.toFixed(2)}/${per}`", '+ const v = Number.isInteger(n) ? String(n) : n.toFixed(2)', '+ return `$${v}/${per}`'] },
    { cmd:'npm test', ms:2900, out:[['✓ src/lib/cart.test.ts (14 tests)', 'ok'], ['✓ src/lib/price.test.ts (10 tests)', 'ok'], ['Tests  24 passed (24)', 'ok']] }
  ];
  // output longer than five lines folds to its last four, behind a button that says how many are hidden
  const TAIL = 4, GAP = 200;
  let vt = 0, halt = false, over = false;
  const log = [], ran = [];
  const clock = ms => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const sec = ms => (ms / 1000).toFixed(1) + ' s';
  // time passes in steps of a quarter second at most, so the clock in the header keeps up; false once Stop is pressed
  const pass = async (ms, each) => {
    for (let t = 0; t < ms;){ if (halt) return false; const d = Math.min(250, ms - t); await c.wait(d); t += d; vt += d; if (!over) sv.textContent = 'Running · ' + clock(vt); each && each(t); }
    return !halt;
  };
  // a command or an edit: what it is on the left, a spinner and its time on the right
  function row(mark, text){
    const el = html(`<div class="tmx-blk" data-s="run"><div class="tmx-cmd"><span class="tmx-p">${mark}</span><span class="tmx-c"></span><span class="tmx-m"><span class="g"><span class="spin"></span></span><span class="t num"></span></span></div></div>`);
    $('.tmx-c', el).textContent = text; body.appendChild(el); enter(el); return el;
  }
  function lines(el){
    const more = html(`<button class="tmx-more" aria-expanded="false" hidden>${I('chev-d','xs')}<span></span></button>`), hid = html('<div class="fold shut"><div class="tmx-o"></div></div>'), tail = html('<div class="tmx-o"></div>');
    const inner = hid.firstElementChild; hid.inert = true; el.append(more, hid, tail);
    const label = () => { const n = inner.children.length, open = !hid.classList.contains('shut'); $('span', more).textContent = open ? 'Show fewer lines' : `Show ${n} more line${n > 1 ? 's' : ''}`; more.setAttribute('aria-expanded', open); };
    more.onclick = () => { hid.inert = hid.classList.toggle('shut'); label(); };
    return ([text, tone]) => {
      const l = document.createElement('div'); l.className = 'tmx-l' + (tone ? ' ' + tone : ''); l.textContent = text; tail.appendChild(l);
      if (inner.children.length + tail.children.length > TAIL + 1) while (tail.children.length > TAIL) inner.appendChild(tail.firstElementChild);
      if (inner.children.length){ more.hidden = false; label(); }
    };
  }
  const halted = el => { $('.tmx-m .g', el).innerHTML = '<span class="tag">Stopped</span>'; el.dataset.s = 'stop'; };
  function finish(how){
    over = true; stop.hidden = true; root.classList.remove('live');
    st.classList.toggle('ok', how === 'passed'); st.classList.toggle('bad', how === 'failed'); $('.g', st).innerHTML = I(how === 'passed' ? 'check' : 'stop', 'xs'); sv.textContent = how === 'passed' ? 'Passed' : how === 'failed' ? 'Failed' : 'Stopped';
    // each command counts once, however many times it ran
    const n = new Set(ran).size;
    $('.tmx-fs', foot).textContent = `${n} command${n === 1 ? '' : 's'} · ${clock(vt)} · ${how}`;
    foot.className = 'tmx-f' + (how === 'stopped' ? ' stop' : how === 'failed' ? ' bad' : ''); $('.g', foot).innerHTML = I(how === 'passed' ? 'ok' : how === 'failed' ? 'alert' : 'stop');
    ff.classList.remove('shut');
  }
  // new output keeps the log on its newest line, unless the person has scrolled up to read; then it stays where they are
  let pinned = true;
  const stick = () => { if (pinned) body.scrollTop = body.scrollHeight; };
  c.on(body, 'scroll', () => { pinned = body.scrollTop + body.clientHeight >= body.scrollHeight - 24; });
  const mo = new MutationObserver(stick); mo.observe(body, { childList:true, subtree:true }); c.offs.push(() => mo.disconnect());
  const ro = new ResizeObserver(stick); ro.observe(body); c.offs.push(() => ro.disconnect());
  stop.onclick = () => { halt = true; };
  cp.onclick = () => copied(cp, log.join('\n'));
  root.classList.add('live');
  c.run(async () => {
    let last = 0;
    for (const k of S){
      if (!await pass(GAP)) return finish('stopped');
      if (k.note){
        const n = html(`<div class="tmx-note">${I('spark','xs')}<span class="shim"></span></div>`), w = $('span', n); w.textContent = k.note; body.appendChild(n); enter(n); log.push('# ' + k.note);
        const ok = await pass(k.ms); w.classList.remove('shim');
        if (!ok) return finish('stopped');
        continue;
      }
      if (k.edit){
        const el = row(I('edit','xs'), 'Edit ' + k.edit); el.dataset.s = 'edit';
        if (!await pass(k.ms)){ halted(el); return finish('stopped'); }
        $('.tmx-m', el).innerHTML = `<span class="add">+${k.add}</span><span class="del">−${k.del}</span>`; log.push(`# Edited ${k.edit} (+${k.add} −${k.del})`);
        const df = document.createElement('div'); df.className = 'tmx-df';
        k.diff.forEach((d, i) => { const l = document.createElement('div'); l.className = d[0] === '+' ? 'a' : d[0] === '-' ? 'd' : ''; l.textContent = d; df.appendChild(l); enter(l, i * 90); });
        el.appendChild(df); log.push(...k.diff);
        continue;
      }
      const el = row('$', k.cmd), t = $('.tmx-m .t', el), add = lines(el), per = k.ms / k.out.length;
      ran.push(k.cmd); log.push('$ ' + k.cmd); t.textContent = sec(0);
      let at = 0;
      for (const ln of k.out){
        const ok = await pass(per, d => { t.textContent = sec(at + d); }); at += per;
        if (!ok){ add(['^C', 'mu']); log.push('^C'); halted(el); return finish('stopped'); }
        const pair = Array.isArray(ln) ? ln : [ln, '']; add(pair); log.push(pair[0]);
      }
      t.textContent = sec(k.ms); last = k.exit || 0;
      $('.tmx-m .g', el).innerHTML = k.exit ? `<span class="tag bad">Exit ${k.exit}</span>` : `<span class="ok">${I('check','xs')}</span>`; el.dataset.s = k.exit ? 'bad' : 'ok';
    }
    finish(last ? 'failed' : 'passed');
  });
  // the preview's story: the agent runs, fails a test, fixes it and passes; then the person copies the whole run
  c.story(async s => {
    await s.until(() => over);
    await s.beat(2);
    await s.tap(cp); await s.beat(3);
  });
});
