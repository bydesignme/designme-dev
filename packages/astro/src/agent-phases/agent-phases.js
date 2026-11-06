// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, swap } from '../core/core.js';
DM.def('agent-phases', (r, c) => {
  const root = $('.aph', r), head = $('.aph-h', r), g = $('.aph-g', r), lab = $('.aph-l', r), tm = $('.aph-t', r), segs = $$('.aph-tr i', r), x = $('.aph-x', r), fold = $('.aph-fold', r), list = $('.aph-list', r), sr = $('.aph-sr', r);
  // the phases in order, each with its glyph and what the line says while it lasts
  const P = [
    ['think', 'Thinking', '<span class="think on"><i></i><i></i><i></i><i></i></span>', 'Thinking about the question'],
    ['search', 'Searching', `<span class="radar"></span>`, 'Searching the help centre'],
    ['read', 'Reading', I('file-text','s'), 'Reading 3 articles'],
    ['wait', 'Waiting for you', I('hand','s'), 'Waiting for you'],
    ['write', 'Writing', I('edit','s'), 'Writing the reply'],
    ['done', 'Done', I('ok','s'), '']
  ];
  const took = {};
  let at = -1, secs = 0, ticking = true, mode = '', resolve = null;
  c.every(1000, () => { if (ticking && mode !== 'wait'){ secs++; tm.textContent = secs + 's'; } });
  const glyph = h => { g.innerHTML = h; enter(g.firstElementChild); };
  // a new phase: its glyph, its words shimmering, the next segment filling; only a change of phase is announced
  function go(i, words){
    at = i; const [k, name, gl, line] = P[i]; root.dataset.p = k; mode = k; glyph(gl);
    lab.classList.toggle('shim', k !== 'done' && k !== 'wait'); swap(lab, words || line);
    segs.forEach((s, j) => { s.classList.toggle('now', j === i && k !== 'done'); if (j <= i && !s.firstChild) s.appendChild(document.createElement('b')); });
    sr.textContent = k === 'done' ? `Done, thought for ${secs}s` : name;
  }
  const note = h => { x.innerHTML = h; if (x.firstElementChild) enter(x.firstElementChild); };
  // wait for a person: resolves with what they chose
  const ask = h => new Promise(res => { resolve = res; note(h); $$('.aph-n button', x).forEach(b => b.onclick = () => { if (resolve){ const f = resolve; resolve = null; f(b.dataset.a); } }); });
  c.run(async () => {
    const t0 = () => secs;
    let s = t0(); go(0); await c.wait(1600); took[0] = secs - s;
    // searching fails once, then works when retried
    s = t0(); go(1); await c.wait(1300);
    mode = 'err'; root.dataset.p = 'err'; glyph(I('alert','s')); lab.classList.remove('shim'); swap(lab, 'The search timed out'); sr.textContent = 'Error: the search timed out';
    await ask(`<div class="aph-n err">${I('alert','xs')}<span>The help centre didn't answer in 10s</span><button class="pill line sm" data-a="retry">${I('refresh','xs')}Retry</button></div>`);
    note(''); go(1, 'Searching the help centre again'); await c.wait(1200); took[1] = secs - s;
    // reading is slow: after a while it says so and offers Stop
    s = t0(); go(2); await c.wait(1800);
    let stopped = false;
    note(`<div class="aph-n">${I('clock','xs')}<span>Still working, the refund policy is a long page</span><button class="pill line sm aph-stop" data-a="stop">${I('stop','xs')}Stop</button></div>`);
    $('.aph-stop', x).onclick = () => { stopped = true; note(''); };
    await c.wait(2200); note(''); took[2] = secs - s;
    if (stopped){ go(5); lab.classList.remove('shim'); swap(lab, `Stopped after ${secs}s`); ticking = false; return; }
    // waiting for you: it stops the clock until someone answers
    s = t0(); go(3);
    const a = await ask(`<div class="aph-n ask"><span>Offer Maya a refund of $48?</span><button class="pill primary sm" data-a="ok">Approve</button><button class="pill ghost sm" data-a="no">Not now</button></div>`);
    note(''); took[3] = secs - s;
    s = t0(); go(4, a === 'ok' ? 'Writing the reply with the refund' : 'Writing the reply without a refund'); await c.wait(2000); took[4] = secs - s;
    // done: the line says how long it took and opens to the phases
    ticking = false; go(5); swap(lab, `Thought for ${secs}s`); tm.textContent = '';
    head.removeAttribute('aria-disabled');
    list.innerHTML = P.slice(0, 5).map(([, name], i) => `<li>${I('check','xs')}<span>${name}</span><span class="num">${took[i] || 0}s</span></li>`).join('');
  });
  head.onclick = () => { if (head.hasAttribute('aria-disabled')) return; const o = head.getAttribute('aria-expanded') !== 'true'; head.setAttribute('aria-expanded', o); fold.classList.toggle('shut', !o); };
  // the preview's story: retry the search, approve the refund, then open the finished line
  if (r === c.st) c.story(async s => {
    await s.until(() => mode === 'err' && $('.aph-n button', x)); await s.beat(3);
    await s.tap($('.aph-n button', x)); s.away();
    await s.until(() => mode === 'wait' && $('.aph-n button', x)); await s.beat(3);
    await s.tap($('.aph-n [data-a="ok"]', x)); s.away();
    await s.until(() => mode === 'done' && !head.hasAttribute('aria-disabled')); await s.beat(3);
    await s.tap(head); s.away(); await s.beat(5);
  });
});
