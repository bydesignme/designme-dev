// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, enter, giveBack, grow, stagger } from '../core/core.js';
DM.def('decision-prompt', (r, c) => {
  const Q = [
    ['Which frames should the agent redesign?', 'Frames', [['Pricing only','1 frame'],['Pricing and checkout','3 frames'],['The whole flow','9 frames']]],
    ['How bold can the changes be?', 'Scope', [['Polish spacing and type','Safe'],['Rework the layout','Medium'],['Fresh direction','Bold']]],
    ['Where should the result go?', 'Output', [['New Figma page','Keeps the original'],['Branch in the repo','Opens a PR'],['Both','Recommended']]]
  ];
  const ans = []; let qi = 0, sel = 0, done = false;
  const body = $('.dpx-body', r), k = $('.dpx-k', r), dots = $$('.dpx-dots i', r), go = $('.dpx-go', r), skip = $('.dpx-skip', r), card = $('.dpx', r), foot = $('.dpx-f', r);
  // no room is kept for the next question or the summary: the card grows and shrinks with them, once its entrance (which
  // scales it from .98 in Clean) has ended, so it measures the card at its real size
  Promise.resolve().then(() => Promise.all(card.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && card.isConnected) c.offs.push(grow(card)); });
  function paint(){
    k.textContent = 'Question ' + (qi + 1) + ' of 3';
    dots.forEach((d, i) => { d.classList.toggle('on', i === qi); d.classList.toggle('done', i < qi); });
    const q = Q[qi];
    body.innerHTML = `<div class="dpx-q">${q[0]}</div><div class="dpx-opts" role="radiogroup" aria-label="${q[0]}">` + q[2].map((o, i) => `<button class="dpx-o${i === sel ? ' on' : ''}" role="radio" aria-checked="${i === sel}" data-i="${i}"><span class="kbd">${i + 1}</span>${o[0]}<span class="d">${o[1]}</span></button>`).join('') + '</div>';
    // the next question plays its entrance; the first comes in with the card's own entrance and is drawn from the start, so a
    // frame that doesn't animate yet (a small live preview off screen, as on the docs' Introduction) still shows it
    if (qi){ enter($('.dpx-q', body)); stagger($$('.dpx-o', body), 50, 60); }
    $$('.dpx-o', body).forEach(b => { b.onclick = () => choose(+b.dataset.i); b.ondblclick = next; });
  }
  function choose(i){ sel = i; $$('.dpx-o', body).forEach((b, j) => { b.classList.toggle('on', j === i); b.setAttribute('aria-checked', j === i); }); }
  function next(skipped){
    if (done) return; ans.push(skipped === true ? 'Agent decides' : Q[qi][2][sel][0]); qi++; sel = 0;
    if (qi < Q.length) return paint();
    // the steps are over: the dots fade away where they are (owner, 21 Nov), and the head keeps its place
    done = true; dots.forEach(d => { d.classList.remove('on'); d.classList.add('done'); }); $('.dpx-dots', r).classList.add('gone'); k.textContent = 'All set';
    // the buttons give way to the line saying the agent has started (its words shimmer while it gets going); a focus that
    // was on them comes back to the card
    const had = foot.contains(document.activeElement);
    body.innerHTML = `<div class="dpx-sum">${Q.map((q, i) => `<div class="dpx-sr"><span>${q[1]}</span>${ans[i]}</div>`).join('')}</div>`;
    foot.classList.add('run'); foot.innerHTML = `<div class="dpx-run" aria-live="polite"><span class="think on"><i></i><i></i><i></i><i></i></span><span class="shim">Starting the redesign</span></div>`;
    if (had) giveBack(card);
    stagger([...$$('.dpx-sr', body), $('.dpx-run', foot)], 70);
  }
  go.onclick = () => next(); skip.onclick = () => next(true);
  c.on(card, 'keydown', e => { if (done) return; if (/^[1-3]$/.test(e.key)){ choose(+e.key - 1); e.preventDefault(); } else if (e.key === 'Enter'){ next(); e.preventDefault(); } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ choose((sel + (e.key === 'ArrowDown' ? 1 : 2)) % 3); e.preventDefault(); } });
  paint();
});
