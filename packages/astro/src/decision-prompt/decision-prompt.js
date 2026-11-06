// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, enter, stagger } from '../core/core.js';
DM.def('decision-prompt', (r, c) => {
  const Q = [
    ['Which frames should the agent redesign?', 'Frames', [['Pricing only','1 frame'],['Pricing and checkout','3 frames'],['The whole flow','9 frames']]],
    ['How bold can the changes be?', 'Scope', [['Polish spacing and type','Safe'],['Rework the layout','Medium'],['Fresh direction','Bold']]],
    ['Where should the result go?', 'Output', [['New Figma page','Keeps the original'],['Branch in the repo','Opens a PR'],['Both','Recommended']]]
  ];
  const ans = []; let qi = 0, sel = 0, done = false;
  const body = $('.dpx-body', r), k = $('.dpx-k', r), dots = $$('.dpx-dots i', r), go = $('.dpx-go', r), skip = $('.dpx-skip', r), card = $('.dpx', r);
  function paint(){
    k.textContent = 'Question ' + (qi + 1) + ' of 3';
    dots.forEach((d, i) => { d.classList.toggle('on', i === qi); d.classList.toggle('done', i < qi); });
    const q = Q[qi];
    body.innerHTML = `<div class="dpx-q">${q[0]}</div>` + q[2].map((o, i) => `<button class="dpx-o${i === sel ? ' on' : ''}" data-i="${i}"><span class="kbd">${i + 1}</span>${o[0]}<span class="d">${o[1]}</span></button>`).join('');
    enter($('.dpx-q', body)); stagger($$('.dpx-o', body), 50, 60);
    $$('.dpx-o', body).forEach(b => { b.onclick = () => choose(+b.dataset.i); b.ondblclick = next; });
  }
  function choose(i){ sel = i; $$('.dpx-o', body).forEach((b, j) => b.classList.toggle('on', j === i)); }
  function next(skipped){
    if (done) return; ans.push(skipped === true ? 'Agent decides' : Q[qi][2][sel][0]); qi++; sel = 0;
    if (qi < Q.length) return paint();
    done = true; dots.forEach(d => { d.classList.remove('on'); d.classList.add('done'); }); k.textContent = 'All set';
    go.parentElement.classList.add('leave');
    body.innerHTML = `<div class="dpx-sum">${Q.map((q, i) => `<div class="dpx-sr"><span>${q[1]}</span>${ans[i]}</div>`).join('')}<div class="dpx-run"><span class="think on"><i></i><i></i><i></i><i></i></span><span class="shim">Starting the redesign</span></div></div>`;
    stagger($$('.dpx-sr, .dpx-run', body), 70);
  }
  go.onclick = () => next(); skip.onclick = () => next(true);
  c.on(card, 'keydown', e => { if (done) return; if (/^[1-3]$/.test(e.key)){ choose(+e.key - 1); e.preventDefault(); } else if (e.key === 'Enter'){ next(); e.preventDefault(); } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ choose((sel + (e.key === 'ArrowDown' ? 1 : 2)) % 3); e.preventDefault(); } });
  paint();
});
