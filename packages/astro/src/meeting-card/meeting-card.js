// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, BRAND, DM, I, copied, hideTip, showTip, swap, tipFor } from '../core/core.js';
DM.def('meeting-card', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)\}/g, (m, k) => k === 'meet' ? BRAND.meet : I(k, k === 'clock' || k === 'chev-d' ? 'xs' : 's'));
  // the row runs 10:15 to 11:30 in minutes of the day; the meeting is 10:30 to 11:15, 45 minutes
  const FROM = 615, TO = 690, AT = 630, END = 675, URL = 'https://meet.google.com/nax-wqkf-stu';
  const pc = m => Math.min(100, Math.max(0, (m - FROM) / (TO - FROM) * 100));
  const clock = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  const root = $('.mtx', r), st = $('.mtx-st', r), track = $('.mtx-track', r), blk = $('.mtx-blk', r), join = $('.mtx-join', r), jm = $('.mtx-jm', r), cp = $('.mtx-cp', r);
  const phase = m => m < AT ? 'soon' : m === AT ? 'start' : m < END ? 'live' : 'done';
  let was = 'soon', num = 10;
  // the chip: a new state fades in; within a state only the minutes change, and they roll
  const chip = (cls, inner) => { st.className = 'tag mtx-st' + (cls ? ' ' + cls : ''); st.innerHTML = `<span class="mtx-fade">${inner}</span>`; };
  const roll = n => { const el = $('.mtx-roll', st); if (el && n !== num) el.innerHTML = `<i class="in">${n}</i>`; num = n; };
  const set = m => {
    const ph = phase(m), p = pc(m);
    root.style.setProperty('--dm-p', p + '%'); track.style.setProperty('--dm-p', p + '%');
    blk.style.setProperty('--dm-cut', Math.min(100, Math.max(0, (m - AT) / (END - AT) * 100)) + '%');
    const n = ph === 'soon' ? AT - m : END - m;
    if (ph !== was){
      if (ph === 'soon') chip('', `${I('clock', 'xs')}In <span class="mtx-roll num"><i>${n}</i></span> min`);
      if (ph === 'start') chip('ok', '<i class="dot"></i>Starting now');
      if (ph === 'live') chip('ok', `<i class="dot"></i>Live, <span class="mtx-roll num"><i>${n}</i></span> min left`);
      if (ph === 'done') chip('', 'Ended');
      num = n;
    } else roll(n);
    was = ph;
    root.classList.toggle('live', ph === 'start' || ph === 'live');
    root.classList.toggle('done', ph === 'done');
    join.disabled = jm.disabled = ph === 'done';
    track.setAttribute('aria-label', ph === 'done' ? 'The meeting ran 10:30 to 11:15 and has ended' : `Now ${clock(m)}. The meeting runs 10:30 to 11:15`);
  };
  set(620);
  join.onclick = () => {
    join.classList.add('prs'); c.later(110, () => join.classList.remove('prs'));
    const lb = $('.lb', join); swap(lb, 'Opening Meet'); c.later(1600, () => swap(lb, 'Join'));
  };
  cp.onclick = () => copied(cp, URL, 'Copied');
  // the meeting's actions: the chevron flashes a check and says what happened
  const jmIc = jm.innerHTML;
  $$('.mtx-pop .mi', r).forEach(b => b.addEventListener('click', () => {
    if (b.dataset.a === 'Invitation copied'){ try { navigator.clipboard.writeText(`Pricing review, today 10:30 to 11:15\n${URL}`).catch(() => {}); } catch(e){} }
    clearTimeout(jm._t); c.later(140, () => { jm.innerHTML = I('check', 'xs'); jm.classList.add('done'); jm.dataset.tip = b.dataset.a; showTip(jm);
      jm._t = setTimeout(() => { jm.innerHTML = jmIc; jm.classList.remove('done'); delete jm.dataset.tip; if (tipFor === jm) hideTip(true); }, 1500); });
  }));
  c.offs.push(() => clearTimeout(jm._t));
  const who = $('.mtx-who', r);
  // the preview: the countdown, "Starting now", the meeting going by with the gone part hatched, then over
  c.story(async s => {
    await s.beat(2);
    for (let m = 621; m <= AT; m++){ await s.beat(1); set(m); }
    await s.beat(4);
    for (let m = AT + 3; m <= 651; m += 3){ await s.beat(1.2); set(m); }
    who.classList.add('hv'); await s.point($$('.av', who)[1]); await s.beat(3);
    who.classList.remove('hv'); await s.tap(cp); await s.beat(3);
    s.away();
    for (let m = 654; m <= END; m += 3){ await s.beat(1.2); set(m); }
    await s.beat(5);
  });
});
