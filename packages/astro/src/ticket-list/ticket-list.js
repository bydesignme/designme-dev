// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, DM, I, REDUCE, centre, seg, stagger } from '../core/core.js';
DM.def('ticket-list', (r, c) => {
  const T = [
    { p:'var(--dm-bad)', pn:'Urgent', t:'Agent stopped mid export', f:'Northwind', a:['MK','var(--dm-av-l)'], w:'4m', q:'The token export stopped at 60% and nothing has happened for 20 minutes.', s:'Sorry about that. The run paused at your $5 spend cap. I have raised it for this run and it finished just now. Your tokens are in the Exports tab.', st:'open' },
    { p:'var(--dm-warn)', pn:'High', t:'Figma frames not syncing', f:'Lumen Labs', a:['JO','var(--dm-av-m)'], w:'22m', q:'New frames from this morning are not showing up in DesignMe.', s:'The Figma token for your workspace expired yesterday. Reconnect it from Settings, then the frames will sync within a minute.', st:'open' },
    { p:'var(--dm-accent-mark,var(--dm-accent))', pn:'Normal', t:'How do I share a run?', f:'Orbit', a:['DA','var(--dm-av-b)'], w:'1h', q:'Can I send an agent run to someone outside my team?', s:'Yes. Open the run, click Share, and turn on "Anyone with the link". They can view it without an account.', st:'open' },
    { p:'var(--dm-faint)', pn:'Low', t:'Invoice address change', f:'Kite Health', a:['MK','var(--dm-av-l)'], w:'2d', q:'', s:'', st:'done' }
  ];
  const list = $('.tkx-list', r); let f = 'open', open = null;
  function paint(anim){
    const L = T.filter(t => t.st === f);
    list.innerHTML = L.length ? L.map(t => `<div class="tkx-t${open === t ? ' open' : ''}"><button class="tkx-r"><span class="pr" data-tip="${t.pn}"><span class="dot" style="color:${t.p}"></span></span><span class="t"><b>${t.t}</b><span>${t.f}${t.q && open !== t ? ' · ' + t.q : ''}</span></span><span class="m"><span class="w">${t.w}</span>${AV(t.a[0], t.a[1])}</span></button>${open === t ? `<div class="tkx-d"><div class="tkx-q">${t.q}</div><div class="tkx-s"><div class="lb">${I('spark','xs')}Suggested reply</div><div class="tx" contenteditable="true" spellcheck="false">${t.s}</div></div><div class="tkx-a"><button class="pill ghost sm ed">${I('edit','xs')}Edit</button><button class="pill accent sm sd">${I('send','xs')}Send and solve</button></div></div>` : ''}</div>`).join('') : '<div class="tkx-e">All caught up</div>';
    if (anim) stagger($$('.tkx-t', list), 40);
    $$('.tkx-t', list).forEach((el, i) => { const t = L[i];
      $('.tkx-r', el).onclick = () => { open = open === t ? null : t; paint(); const d = $('.tkx-d', list); if (d) stagger([...d.children], 50); };
      // a solved ticket fades, then folds its height away, so the tickets under it slide up instead of jumping
      const sd = $('.sd', el); if (sd) sd.onclick = () => c.run(async () => { sd.innerHTML = '<span class="spin"></span>'; await c.wait(700); t.s = $('.tx', el).textContent; t.st = 'done'; open = null; el.classList.add('leave'); await c.wait(330);
        if (!REDUCE){ el.style.overflow = 'hidden'; await el.animate([{ height:el.offsetHeight + 'px' }, { height:'0px' }], { duration:260, easing:'cubic-bezier(.22,1,.36,1)', fill:'forwards' }).finished.catch(() => {}); }
        if (!c.dead) paint(); });
      const ed = $('.ed', el); if (ed) ed.onclick = () => { const tx = $('.tx', el); tx.focus({ preventScroll:true }); const s = document.getSelection(); s.selectAllChildren(tx); s.collapseToEnd(); };
    });
  }
  seg($('.tkx-sg', r), v => { f = v; open = null; paint(true); });
  paint(true);
  // as tickets open, close, leave or change with the filter, the panel stays centred in the room its stage keeps for it
  const root = $('.tkx', r); centre(c, root, () => root.offsetHeight);
  // the preview opens the first ticket on its own, unless you take over first
  c.auto(1000, () => { if (!open){ open = T[0]; paint(); stagger([...$('.tkx-d', list).children], 50); } });
});
