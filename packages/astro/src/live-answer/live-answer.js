// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, copied, enter, html, stagger } from '../core/core.js';
DM.def('live-answer', (r, c) => {
  const A = $('.lva-a', r);
  const srcs = { 1:'Funnel data, last 30 days', 2:'Session notes from 8 interviews', 3:'Onboarding.fig, step 2' };
  const S = [[1,'F','#7a5af8','Funnel data','Amplitude, last 30 days'],[2,'N','#0ea5a4','Session notes','Notion, 8 interviews'],[3,'S','#f97316','Onboarding.fig','Figma, step 2']];
  const T = {
    '': 'Most people leave at the workspace step [1]. It asks for a team name before anyone has made anything, and five of eight people in interviews paused there [2]. Moving it after the first project, and filling the name from the email domain, should help [3].',
    'Show the drop-off by device': 'On mobile the workspace step loses 41% [1], on desktop 23% [1]. Most of the mobile drop comes from the keyboard covering the Continue button [3].',
    'Draft a fix for the workspace step': 'Ask for the team name after the first project, and fill it from the email domain so most people never type it [2]. On mobile, keep Continue above the keyboard [3], then compare the step again after a week [1].'
  };
  const steps = ['Read the funnel for the last 30 days','Matched the drop to the interview notes','Checked step 2 in Onboarding.fig'];
  /* each answer streams into its own turn, so follow-ups add to the thread instead of replacing it */
  async function answer(q, turn){
    if (turn._busy) return; turn._busy = true; turn.innerHTML = '';
    const th = html(`<div class="lva-th"><span class="think on" style="color:var(--dm-fg2)"><i></i><i></i><i></i><i></i></span><span class="shim">Thinking</span></div>`);
    turn.appendChild(th); enter(th);
    await c.wait(1300);
    const tb = html(`<button class="lva-th lva-tb" aria-expanded="false"><span>${steps.length} steps · 2s</span>${I('chev-d','xs')}</button>`);
    const tl = html(`<div class="fold shut lva-tl"><div><ul class="lva-tlist">${steps.map(x => `<li>${x}</li>`).join('')}</ul></div></div>`);
    th.replaceWith(tb); tb.after(tl);
    tb.onclick = () => { const s = tl.classList.toggle('shut'); tb.setAttribute('aria-expanded', !s); };
    const p = html('<p class="lva-p"></p>'); turn.appendChild(p);
    for (const tok of T[q].split(' ')){
      const m = tok.match(/^\[(\d)\](.*)$/);
      const prev = p.lastElementChild;
      if (m && prev){ prev.textContent = prev.textContent.replace(/ $/, ''); prev.style.whiteSpace = 'nowrap'; prev.insertAdjacentHTML('beforeend', `<span class="cite" data-tip="${srcs[m[1]]}">${m[1]}</span>${m[2]} `); }
      else p.insertAdjacentHTML('beforeend', `<span class="w">${tok} </span>`);
      await c.wait(55 + Math.random() * 45);
    }
    const src = html(`<div class="lva-src"><span class="lva-acts"><button class="ib" aria-label="Copy" data-tip="Copy">${I('copy')}</button><button class="ib" aria-label="Good answer" data-tip="Good answer">${I('up-thumb')}</button><button class="ib" aria-label="Bad answer" data-tip="Bad answer">${I('down-thumb')}</button><button class="ib" aria-label="Try again" data-tip="Try again">${I('refresh')}</button></span><button class="lva-sb" aria-expanded="false"><span class="lva-fav">${S.map(x => `<span style="background-color:${x[2]}">${x[1]}</span>`).join('')}</span>3 sources${I('chev-d','xs')}</button></div>`);
    const ls = html(`<div class="fold shut lva-ls"><div><div class="lva-ll">${S.map(x => `<button class="lva-s" data-n="${x[0]}"><span class="n">${x[0]}</span><span class="t">${x[3]}</span><span class="d">${x[4]}</span>${I('ext','xs')}</button>`).join('')}</div></div></div>`);
    turn.appendChild(src); turn.appendChild(ls); enter(src);
    const sb = $('.lva-sb', src), open = o => { ls.classList.toggle('shut', !o); sb.setAttribute('aria-expanded', o); };
    sb.onclick = () => open(ls.classList.contains('shut'));
    /* hover previews a source, a click pins it until the next click */
    let pin = '';
    const hl = n => { $$('.cite', p).forEach(x => x.classList.toggle('on', x.textContent === n)); $$('.lva-s', ls).forEach(x => x.classList.toggle('on', x.dataset.n === n)); };
    const pick = n => { pin = pin === n ? '' : n; if (pin) open(true); hl(pin); };
    $$('.lva-s', ls).forEach(x => { x.onmouseenter = () => hl(x.dataset.n); x.onmouseleave = () => hl(pin); x.onclick = () => pick(x.dataset.n); });
    $$('.cite', p).forEach(x => { x.style.cursor = 'pointer'; x.onmouseenter = () => hl(x.textContent); x.onmouseleave = () => hl(pin); x.onclick = () => pick(x.textContent); });
    const acts = $$('.lva-acts .ib', src);
    acts[0].onclick = () => { const cl = p.cloneNode(true); $$('.cite', cl).forEach(x => x.remove()); copied(acts[0], cl.textContent.replace(/\s+/g, ' ').trim()); };
    [1, 2].forEach(i => acts[i].onclick = () => { const on = !acts[i].classList.contains('on'); acts[1].classList.remove('on'); acts[2].classList.remove('on'); acts[i].classList.toggle('on', on); });
    acts[3].onclick = () => c.run(() => answer(q, turn));
    turn._busy = false;
    if (!q && !A.querySelector('.lva-q.fu')){
      const fu = html(`<div class="lva-fu"><button>${I('chev-r','xs')}Show the drop-off by device</button><button>${I('chev-r','xs')}Draft a fix for the workspace step</button></div>`);
      turn.appendChild(fu); stagger($$('button', fu), 90);
      $$('button', fu).forEach(b => b.onclick = () => {
        const t = b.textContent; fu.remove();
        const bub = html(`<div class="lva-q fu"><div class="bub">${t}</div></div>`), next = html('<div class="lva-turn"></div>');
        A.append(bub, next); enter(bub);
        c.run(async () => { await c.wait(450); await answer(t, next); });
      });
    }
  }
  const first = html('<div class="lva-turn"></div>'); A.appendChild(first);
  c.run(() => answer('', first));
});
