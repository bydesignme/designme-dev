// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, hold, release } from '../core/core.js';
DM.def('stepper', (r, c) => {
  const S = [
    ['Workspace','Name your workspace','This is what your team will see.',[['Studio','Small team'],['Agency','Many clients'],['In-house','One product']]],
    ['Agent','How should the agent work?','You can change this any time.',[['Ask first','Safest'],['Balanced','Recommended'],['Autopilot','Fastest']]],
    ['Connect','Where do your designs live?','Pick one to start.',[['Figma','Frames and tokens'],['GitHub','Code and PRs'],['Both','Full loop']]]
  ];
  const stx = $('.stx', r), track = $('.stx-track', r), body = $('.stx-body', r), bk = $('.stx-bk', r), nx = $('.stx-nx', r);
  let cur = 0, pick = [0, 1, 2];
  track.innerHTML = S.map((s, i) => `<div class="stx-st" data-i="${i}"><span class="n">${i + 1}</span><span class="lb">${s[0]}</span></div>` + (i < S.length - 1 ? '<div class="stx-ln"><i></i></div>' : '')).join('');
  const sts = $$('.stx-st', track), lns = $$('.stx-ln', track);
  function show(i, dir){
    cur = i; sts.forEach((s, j) => { s.classList.toggle('on', j === i); s.classList.toggle('done', j < i); $('.n', s).innerHTML = j < i ? I('check','xs') : j + 1; });
    lns.forEach((l, j) => l.classList.toggle('full', j < i));
    if (i >= S.length){
      if (!stx.classList.contains('fin')) hold(stx);
      body.innerHTML = `<div class="stx-dn"><span class="stx-ok"><svg viewBox="0 0 44 44" aria-hidden="true"><circle class="c" cx="22" cy="22" r="20"/><path class="k" d="M14 22.5l5.5 5.5L30.5 16.5"/></svg></span><b>You're set up</b><span class="muted">${S.map((s, k) => s[3][pick[k]][0]).join(' · ')}</span></div>`;
      bk.disabled = true; nx.textContent = 'Start over'; stx.classList.add('fin');
      // arriving here from Finish is the moment to celebrate; the screen itself doesn't slide
      if (dir > 0){ const dn = $('.stx-dn', body); dn.classList.add('go'); enter($('b', dn), 260); enter($('.muted', dn), 340); burst($('.stx-ok', dn)); }
      return;
    }
    else { if (stx.classList.contains('fin')){ stx.classList.remove('fin'); release(stx); } const s = S[i]; body.innerHTML = `<h4>${s[1]}</h4><p>${s[2]}</p><div class="stx-opts">${s[3].map((o, k) => `<button class="stx-o${pick[i] === k ? ' on' : ''}" data-k="${k}"><b style="font-weight:500">${o[0]}</b><span>${o[1]}</span></button>`).join('')}</div>`;
      $$('.stx-o', body).forEach(b => b.onclick = () => { pick[i] = +b.dataset.k; $$('.stx-o', body).forEach(x => x.classList.toggle('on', x === b)); });
      bk.disabled = i === 0; nx.textContent = i === S.length - 1 ? 'Finish' : 'Continue'; }
    if (dir){ body.classList.remove('inr','inl'); void body.offsetWidth; body.classList.add(dir > 0 ? 'inr' : 'inl'); }
  }
  // a short burst of confetti from the check, in the accent and a few brand colours, falling as it fades
  function burst(at){
    if (REDUCE) return;
    const bp = getComputedStyle(r).getPropertyValue('--dm-motion').trim() === 'bp';
    const box = document.createElement('span'); box.className = 'stx-conf'; at.appendChild(box);
    const COL = ['var(--dm-accent-mark,var(--dm-accent))', 'var(--dm-ok)', 'var(--dm-c2)', 'var(--dm-c4)', 'var(--dm-c5)', 'var(--dm-c6)'], N = 22;
    for (let k = 0; k < N; k++){
      const p = document.createElement('i'), round = k % 3 === 0, a = -Math.PI / 2 + (k / (N - 1) - .5) * Math.PI * 1.5 + Math.sin(k * 7.3) * .18;
      const d = 46 + (k * 37 % 30), w = round ? 5 : 3 + k % 2, h = round ? 5 : 7 + k % 3;
      p.className = round ? 'd' : ''; p.style.width = w + 'px'; p.style.height = h + 'px'; p.style.marginLeft = -w / 2 + 'px'; p.style.marginTop = -h / 2 + 'px'; p.style.background = COL[k % COL.length];
      box.appendChild(p);
      const x = Math.cos(a) * d, y = Math.sin(a) * d, r0 = k * 47 % 180, spin = (k % 2 ? 1 : -1) * (180 + k * 23 % 200), ms = (bp ? 760 : 1150) + k * 13 % 220;
      p.animate([
        { opacity:1, transform:`translate(0,0) rotate(${r0}deg) scale(.6)` },
        { opacity:1, transform:`translate(${x}px,${y}px) rotate(${r0 + spin * .5}deg) scale(1)`, offset:.42 },
        { opacity:0, transform:`translate(${x * 1.18}px,${y + 46}px) rotate(${r0 + spin}deg) scale(.9)` }
      ], { duration:ms, delay:120 + k % 4 * 18, easing:bp ? 'cubic-bezier(.65,0,.25,1)' : 'cubic-bezier(.16,1,.3,1)', fill:'both' });
    }
    c.later(1700, () => box.remove());
  }
  nx.onclick = () => cur >= S.length ? show(0, -1) : show(cur + 1, 1);
  bk.onclick = () => show(Math.max(0, cur - 1), -1);
  sts.forEach((s, i) => s.onclick = () => { if (i < cur) show(i, -1); });
  show(0);
});
