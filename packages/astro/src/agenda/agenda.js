// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, DM, I, html, stagger } from '../core/core.js';
DM.def('agenda', (r, c) => {
  const E = [
    ['9:00','Standup','15 min, Design team','b',[['MK','var(--dm-av-l)'],['JO','var(--dm-av-m)'],['AR','var(--dm-av-p)']],null,1],
    ['11:30','Agent demo','30 min, Zoom','y',[['SL','var(--dm-av-t)'],['MK','var(--dm-av-l)']],['Demo flow: pricing audit, then the token export','Sam asked about cost limits last time, the cap is now $5'],0],
    ['1:00','Pricing workshop','90 min, Room 4','p',[['JO','var(--dm-av-m)'],['AR','var(--dm-av-p)'],['DK','var(--dm-av-b)'],['MK','var(--dm-av-l)']],['Trial to paid is up 8.1 pts since Sep 18','Open question: show monthly price crossed out on mobile too?','3 frames ready to review in Figma'],0],
    ['4:00','1:1 with Maya','30 min','l',[['MK','var(--dm-av-l)']],['She wanted feedback on the checkout copy','Library publish is waiting on her approval'],0]
  ];
  const list = $('.agx-list', r);
  list.innerHTML = E.map((e, i) => `<button class="agx-e${e[6] ? ' past' : ''}" data-i="${i}"><span class="tm num">${e[0]}</span><span class="bar"></span><span class="t"><b>${e[1]}</b><span>${e[2]}</span><span class="who">${e[4].map(a => AV(a[0], a[1])).join('')}</span></span></button>`).join('');
  const rows = $$('.agx-e', list);
  rows[0].after(html('<div class="agx-now"><i></i>10:42</div>'));
  stagger([...list.children], 60);
  rows.forEach((el, i) => el.onclick = () => {
    const open = el.classList.contains('open'); rows.forEach(x => { x.classList.remove('open'); $('.agx-prep', x)?.remove(); });
    if (open || !E[i][5]) return;
    el.classList.add('open');
    const p = html(`<div class="agx-prep">${E[i][5].map(t => `<div>${I('spark','xs')}<span>${t}</span></div>`).join('')}${i === 1 ? '<span class="pill accent sm agx-join">Join in 48 min</span>' : ''}</div>`);
    el.appendChild(p); stagger([...p.children], 60);
  });
  // the preview opens one meeting on its own, unless you take over first
  c.auto(1000, () => rows[2].click());
});
