// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, seg } from '../core/core.js';
DM.def('funnel', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{spark}', I('spark','xs'));
  const K = ['Signed up','Opened a file','Ran the agent','Invited a teammate','Paid'];
  const D = {
    all:{ n:[12400,9180,6420,2310,1490], t:'The biggest drop is after the first agent run. 64% never invite a teammate.' },
    team:{ n:[4100,3570,2980,1890,1210], t:'Teams convert well. Most drop off at payment, so the plan page matters most here.' },
    solo:{ n:[8300,5610,3440,420,280], t:'Solo users rarely invite anyone. Try a paid plan that does not need a team.' }
  };
  const rows = $('.fnx-rows', r), txt = $('.fnx-t', r);
  // the bars and counts move with the animations below rather than CSS transitions, so only the hover dim and the
  // count's colour keep a transition here
  rows.innerHTML = K.map((k, i) => `<div class="fnx-r" style="--dm-fc:color-mix(in oklab,var(--dm-c1) ${100 - i * 25}%,var(--dm-c2))"><span class="k">${k}</span><div class="tr"><div class="bar" style="width:0;transition:opacity .3s"></div><span class="n num" style="transition:color .3s"></span></div><span class="v num"></span></div>`).join('');
  const R = $$('.fnx-r', rows);
  /* every draw writes the finished chart at once and the motion only plays over it: each bar and count glides from where
     it is to where it ends, on the page's clock. So the settled chart shows whatever happens on the way: a replay half
     way, a stop, or the card scrolling far off screen (where the homepage stops drawing it) and back */
  const glide = (el, prop, to, delay) => {
    const from = getComputedStyle(el)[prop]; if (el._g) el._g.cancel();
    el.style[prop] = to; el._g = null;
    if (REDUCE || from === getComputedStyle(el)[prop]) return;
    el._g = el.animate([{ [prop]:from }, { [prop]:to }], { duration:900, delay, easing:getComputedStyle(r).getPropertyValue('--dm-ease').trim() || 'ease', fill:'backwards' });
  };
  // the note crossfades on a switch; the newest note is the one that lands, however quickly the segments change
  let note = 0;
  const say = t => { const id = ++note; if (txt.textContent === t && !txt.classList.contains('out')) return; txt.classList.add('sw', 'out'); setTimeout(() => { if (id !== note) return; txt.textContent = t; txt.classList.remove('out'); }, REDUCE ? 0 : 170); };
  function draw(s, wait = 0){
    const d = D[s].n; let worst = 1, wv = 1;
    d.forEach((n, i) => { if (i && n / d[i - 1] < wv){ wv = n / d[i - 1]; worst = i; } });
    R.forEach((row, i) => { const w = Math.max(6, d[i] / d[0] * 100), nn = $('.n', row);
      glide($('.bar', row), 'width', w + '%', wait + i * 70); nn.classList.toggle('out', w < 24); glide(nn, 'left', w < 24 ? `calc(${w}% + 8px)` : '10px', wait + i * 70);
      nn.textContent = d[i].toLocaleString('en-US');
      $('.v', row).textContent = i ? '−' + Math.round((1 - d[i] / d[i - 1]) * 100) + '%' : '100%'; row.classList.toggle('drop', i === worst); row.title = ''; $('.tr', row).dataset.tip = i ? Math.round(d[i] / d[0] * 1000) / 10 + '% of signups' : 'Starting point'; });
  }
  seg($('.fnx-sg', r), s => { draw(s); say(D[s].t); });
  // the first draw starts a moment after the funnel appears, the way it always has, and its note fades in after it
  draw('all', 280); txt.textContent = D.all.t; txt.classList.add('sw');
  if (!REDUCE) txt.animate([{ opacity:0, filter:'blur(3px)', transform:`translateY(${getComputedStyle(r).getPropertyValue('--dm-motion').trim() === 'bp' ? -3 : 3}px)` }, { opacity:1, filter:'blur(0)', transform:'none' }], { duration:250, delay:450, easing:getComputedStyle(r).getPropertyValue('--dm-ease').trim() || 'ease', fill:'backwards' });
});
