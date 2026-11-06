// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, html, stagger, swap } from '../core/core.js';
DM.def('plan-review', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{plus}', I('plus','xs'));
  // each step, and the line it reports when it's done
  const S = [
    ['Read the pricing frames and the brand tokens', '6 frames and 42 tokens read'],
    ['Compare against the three competitor pages', '3 pages compared'],
    ['Simplify the plan cards to one CTA each', 'Plan cards now have one CTA each'],
    ['Move the FAQ below the comparison table', 'FAQ now sits under the table'],
    ['Write a summary of every change', 'Summary added to Pricing v4']
  ];
  const list = $('.plx-list', r), st = $('.plx-st', r), tm = $('.plx-tm', r), go = $('.plx-go', r), f = $('.plx-f', r);
  const row = (t, i) => `<li class="plx-s"><span class="n">${i + 1}</span><span class="b"><span class="t" contenteditable="true" spellcheck="false" role="textbox" aria-label="Step ${i + 1}">${t[0]}</span><span class="d"><span></span></span></span><button class="ib plx-x" aria-label="Skip step" data-tip="Skip step">${I('x','xs')}</button></li>`;
  list.innerHTML = S.map(row).join(''); stagger($$('.plx-s', list), 60, 100);
  const count = () => { const on = $$('.plx-s:not(.off)', list); on.forEach((s, i) => $('.n', s).textContent = i + 1); $$('.plx-s.off .n', list).forEach(n => n.textContent = '–'); swap(st, on.length + ' steps, about ' + Math.max(1, Math.round(on.length * .8)) + ' min'); };
  function bind(s, done){
    const t = $('.t', s), orig = t.textContent; s._done = done || 'Done';
    t.onkeydown = e => { if (e.key === 'Enter'){ e.preventDefault(); t.blur(); } };
    t.onblur = () => { const ed = t.textContent.trim() !== orig; s.classList.toggle('edited', ed); if (ed) s._done = 'Done as you wrote it'; };
    $('.plx-x', s).onclick = () => { const off = s.classList.toggle('off'); $('.plx-x', s).dataset.tip = off ? 'Include step' : 'Skip step'; $('.plx-x', s).setAttribute('aria-label', off ? 'Include step' : 'Skip step'); $('.plx-x', s).innerHTML = I(off ? 'undo' : 'x', 'xs'); count(); };
  }
  $$('.plx-s', list).forEach((s, i) => bind(s, S[i][1]));
  $('.plx-add', r).onclick = () => { const s = html(row(['New step'], $$('.plx-s', list).length)); list.appendChild(s); enter(s); bind(s); count(); const t = $('.t', s); t.focus({ preventScroll:true }); document.getSelection().selectAllChildren(t); };
  $('.plx-chg', r).onclick = () => { swap($('.plx-n', r), 'Tell the agent what to change in chat'); };
  const clock = ms => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const note = (s, text, tone) => { const d = $('.d', s); d.className = 'd on' + (tone ? ' ' + tone : ''); swap(d.firstElementChild, text); };
  go.onclick = () => c.run(async () => {
    $$('.t', list).forEach(t => { t.contentEditable = 'false'; t.removeAttribute('role'); }); $('.plx-add', r).hidden = true;
    // the approved plan is fixed: the skip buttons keep their space but can't be used
    $$('.plx-x', list).forEach(b => { b.disabled = true; b.style.visibility = 'hidden'; });
    f.innerHTML = `<span class="muted plx-n">Running the approved plan</span><button class="pill ghost sm plx-stop">${I('stop','xs')}Stop</button>`; stagger([...f.children], 50);
    let stop = false; $('.plx-stop', f).onclick = () => stop = true;
    $('.plx-mk', r).classList.add('on');
    const t0 = performance.now(), tick = c.every(250, () => tm.textContent = clock(performance.now() - t0)); tm.textContent = '0:00'; enter(tm);
    const on = $$('.plx-s:not(.off)', list), n = s => $('.n', s), txt = s => $('.t', s);
    try {
      for (let i = 0; i < on.length && !stop; i++){
        const s = on[i]; s.classList.add('run'); txt(s).classList.add('shim'); n(s).innerHTML = '<span class="spin"></span>'; swap(st, 'Step ' + (i + 1) + ' of ' + on.length); await c.wait(900);
        // the second step hits a rate limit: the agent waits it out, counting down, and tries again
        if (s === $$('.plx-s', list)[1] && !stop){
          s.classList.replace('run', 'retry'); txt(s).classList.remove('shim'); n(s).innerHTML = I('clock','xs');
          for (let k = 3; k > 0 && !stop; k--){ note(s, `Rate limited by the browser tool. Retrying in ${k}s`, 'warn'); await c.wait(1000); }
          if (stop) break;
          s.classList.replace('retry', 'run'); txt(s).classList.add('shim'); n(s).innerHTML = '<span class="spin"></span>'; note(s, 'Retrying'); await c.wait(700);
          s._done += ', after 1 retry';
        }
        s.classList.remove('run'); txt(s).classList.remove('shim'); s.classList.add('done'); n(s).innerHTML = I('check','xs'); enter(n(s).firstElementChild); note(s, s._done);
      }
    } finally { clearInterval(tick); }
    $('.plx-mk', r).classList.remove('on');
    $$('.plx-s.run', list).forEach(s => { s.classList.remove('run', 'retry'); txt(s).classList.remove('shim'); n(s).textContent = '–'; note(s, 'Not started'); });
    swap(st, stop ? 'Stopped, progress kept' : 'Done in ' + clock(performance.now() - t0) + '. 4 frames updated'); f.innerHTML = `<span class="muted plx-n"></span><button class="pill soft sm">${I('eye','xs')}See changes</button>`; enter(f.lastElementChild);
  });
  // the preview's story: rewrite a step, approve, and watch the agent work through a rate limit to the end
  c.story(async s => {
    await s.beat(3);
    const step = $$('.plx-s', list)[2], t = $('.t', step);
    // the demo types into the step without taking the focus: a caret would make the page follow it
    await s.tap(t); await s.beat(1);
    for (const ch of ' each'){ t.textContent = t.textContent.slice(0, -1); await s.beat(.12); }
    for (const ch of ', annual price first'){ t.textContent += ch; await s.beat(.09); }
    await s.beat(1); t.onblur(); await s.beat(2);
    await s.tap(go); s.away();
    await s.until(() => $('.plx-f .pill.soft', r));
  });
});
