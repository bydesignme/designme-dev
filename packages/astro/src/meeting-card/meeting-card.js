// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, BRAND, DM, I, copied, swap } from '../core/core.js';
DM.def('meeting-card', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)\}/g, (m, k) => k === 'meet' ? BRAND.meet : I(k));
  // the track runs 10:00 to 12:30 (minutes of the day); the meeting is 10:30 to 12:00
  const FROM = 600, TO = 750, AT = 630, END = 720, URL = 'https://meet.google.com/nax-wqkf-stu';
  const pc = m => (m - FROM) / (TO - FROM) * 100, clock = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  const root = $('.mtx', r), now = $('.mtx-now', r), when = $('.mtx-in', r), track = $('.mtx-track', r), blk = $('.mtx-blk', r);
  const go = $('.mtx-go', r), label = $('.mtx-gt b', r), cp = $('.mtx-cp', r);
  $('.mtx-ticks', r).innerHTML = Array.from({ length: 11 }, (_, i) => `<i class="${i % 4 ? '' : 'h'}" style="left:${i * 10}%"></i>`).join('');
  blk.style.left = pc(AT) + '%'; blk.style.width = (pc(END) - pc(AT)) + '%';
  // the clock: the now line moves to the minute, the countdown says what is left, and at the start the meeting turns live
  const set = m => {
    now.style.setProperty('--dm-p', pc(m) + '%');
    const left = AT - m, live = left <= 0;
    const text = live ? 'Starting now' : `In ${left} minute${left === 1 ? '' : 's'}`;
    if (live !== root.classList.contains('live')) swap(when, text); else when.textContent = text;
    root.classList.toggle('live', live);
    track.setAttribute('aria-label', `Now ${clock(m)}. The meeting runs 10:30 to 12:00`);
  };
  set(FROM);
  go.onclick = () => { swap(label, 'Opening Google Meet'); c.later(1600, () => swap(label, 'Join on Google Meet')); };
  cp.onclick = () => copied(cp, URL, 'Copied');
  // the preview: the minutes tick by until the meeting starts, then the person in it copies the link
  c.story(async s => {
    await s.beat(2);
    for (let m = FROM + 1; m <= AT; m++){ await s.beat(AT - m < 4 ? .9 : .3); set(m); }
    await s.beat(3);
    await s.point(go, false); go.classList.add('hv'); await s.beat(2);
    go.classList.remove('hv'); await s.tap(cp); await s.beat(4);
  });
});
